---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 640
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 640 of 933)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - sim-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/sim-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: store.ts]---
Location: sim-main/apps/sim/stores/workflow-diff/store.ts

```typescript
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { getClientTool } from '@/lib/copilot/tools/client/manager'
import { createLogger } from '@/lib/logs/console/logger'
import {
  type DiffAnalysis,
  stripWorkflowDiffMarkers,
  type WorkflowDiff,
  WorkflowDiffEngine,
} from '@/lib/workflows/diff'
import { enqueueReplaceWorkflowState } from '@/lib/workflows/operations/socket-operations'
import { validateWorkflowState } from '@/lib/workflows/sanitization/validation'
import { Serializer } from '@/serializer'
import { useWorkflowRegistry } from '../workflows/registry/store'
import { useSubBlockStore } from '../workflows/subblock/store'
import { mergeSubblockState } from '../workflows/utils'
import { useWorkflowStore } from '../workflows/workflow/store'
import type { WorkflowState } from '../workflows/workflow/types'

const logger = createLogger('WorkflowDiffStore')
const diffEngine = new WorkflowDiffEngine()

let updateTimer: NodeJS.Timeout | null = null
const UPDATE_DEBOUNCE_MS = 16

function cloneWorkflowState(state: WorkflowState): WorkflowState {
  return {
    ...state,
    blocks: structuredClone(state.blocks || {}),
    edges: structuredClone(state.edges || []),
    loops: structuredClone(state.loops || {}),
    parallels: structuredClone(state.parallels || {}),
  }
}

function extractSubBlockValues(workflowState: WorkflowState): Record<string, Record<string, any>> {
  const values: Record<string, Record<string, any>> = {}
  Object.entries(workflowState.blocks || {}).forEach(([blockId, block]) => {
    values[blockId] = {}
    Object.entries(block.subBlocks || {}).forEach(([subBlockId, subBlock]) => {
      values[blockId][subBlockId] = (subBlock as any)?.value ?? null
    })
  })
  return values
}

function applyWorkflowStateToStores(
  workflowId: string,
  workflowState: WorkflowState,
  options?: { updateLastSaved?: boolean }
) {
  const workflowStore = useWorkflowStore.getState()
  workflowStore.replaceWorkflowState(cloneWorkflowState(workflowState), options)
  const subBlockValues = extractSubBlockValues(workflowState)
  useSubBlockStore.getState().setWorkflowValues(workflowId, subBlockValues)
}

function captureBaselineSnapshot(workflowId: string): WorkflowState {
  const workflowStore = useWorkflowStore.getState()
  const currentState = workflowStore.getWorkflowState()
  const mergedBlocks = mergeSubblockState(currentState.blocks, workflowId)

  return {
    ...cloneWorkflowState(currentState),
    blocks: structuredClone(mergedBlocks),
  }
}

async function persistWorkflowStateToServer(
  workflowId: string,
  workflowState: WorkflowState
): Promise<boolean> {
  try {
    const cleanState = stripWorkflowDiffMarkers(cloneWorkflowState(workflowState))
    const response = await fetch(`/api/workflows/${workflowId}/state`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...cleanState,
        lastSaved: Date.now(),
      }),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      throw new Error(errorText || 'Failed to persist workflow state')
    }

    const activeWorkflowId = useWorkflowRegistry.getState().activeWorkflowId
    if (activeWorkflowId === workflowId) {
      useWorkflowStore.setState({ lastSaved: Date.now() })
    }

    return true
  } catch (error) {
    logger.error('Failed to persist workflow state after copilot edit', error)
    return false
  }
}

async function getLatestUserMessageId(): Promise<string | null> {
  try {
    const { useCopilotStore } = await import('@/stores/panel/copilot/store')
    const { messages } = useCopilotStore.getState() as any
    if (!Array.isArray(messages) || messages.length === 0) {
      return null
    }

    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i]
      if (m?.role === 'user' && m?.id) {
        return m.id
      }
    }
  } catch (error) {
    logger.warn('Failed to capture trigger message id', { error })
  }
  return null
}

async function findLatestEditWorkflowToolCallId(): Promise<string | undefined> {
  try {
    const { useCopilotStore } = await import('@/stores/panel/copilot/store')
    const { messages, toolCallsById } = useCopilotStore.getState() as any

    for (let mi = messages.length - 1; mi >= 0; mi--) {
      const message = messages[mi]
      if (message.role !== 'assistant' || !message.contentBlocks) continue
      for (const block of message.contentBlocks as any[]) {
        if (block?.type === 'tool_call' && block.toolCall?.name === 'edit_workflow') {
          return block.toolCall?.id
        }
      }
    }

    const fallback = Object.values(toolCallsById).filter(
      (call: any) => call.name === 'edit_workflow'
    ) as any[]

    return fallback.length ? fallback[fallback.length - 1].id : undefined
  } catch (error) {
    logger.warn('Failed to resolve edit_workflow tool call id', { error })
    return undefined
  }
}

function createBatchedUpdater(set: any) {
  let pendingUpdates: Partial<WorkflowDiffState> = {}
  return (updates: Partial<WorkflowDiffState>) => {
    Object.assign(pendingUpdates, updates)
    if (updateTimer) {
      clearTimeout(updateTimer)
    }
    updateTimer = setTimeout(() => {
      set(pendingUpdates)
      pendingUpdates = {}
      updateTimer = null
    }, UPDATE_DEBOUNCE_MS)
  }
}

interface WorkflowDiffState {
  hasActiveDiff: boolean
  isShowingDiff: boolean
  isDiffReady: boolean
  baselineWorkflow: WorkflowState | null
  baselineWorkflowId: string | null
  diffAnalysis: DiffAnalysis | null
  diffMetadata: WorkflowDiff['metadata'] | null
  diffError?: string | null
  _triggerMessageId?: string | null
}

interface WorkflowDiffActions {
  setProposedChanges: (workflowState: WorkflowState, diffAnalysis?: DiffAnalysis) => Promise<void>
  clearDiff: (options?: { restoreBaseline?: boolean }) => void
  toggleDiffView: () => void
  acceptChanges: () => Promise<void>
  rejectChanges: () => Promise<void>
  reapplyDiffMarkers: () => void
  _batchedStateUpdate: (updates: Partial<WorkflowDiffState>) => void
}

export const useWorkflowDiffStore = create<WorkflowDiffState & WorkflowDiffActions>()(
  devtools(
    (set, get) => {
      const batchedUpdate = createBatchedUpdater(set)

      return {
        hasActiveDiff: false,
        isShowingDiff: false,
        isDiffReady: false,
        baselineWorkflow: null,
        baselineWorkflowId: null,
        diffAnalysis: null,
        diffMetadata: null,
        diffError: null,
        _triggerMessageId: null,
        _batchedStateUpdate: batchedUpdate,

        setProposedChanges: async (proposedState, diffAnalysis) => {
          const activeWorkflowId = useWorkflowRegistry.getState().activeWorkflowId
          if (!activeWorkflowId) {
            logger.error('Cannot apply diff without an active workflow')
            throw new Error('No active workflow found')
          }

          // Capture baseline if needed (synchronous, fast)
          let baselineWorkflow = get().baselineWorkflow
          let baselineWorkflowId = get().baselineWorkflowId
          let capturedBaseline = false

          if (!baselineWorkflow || baselineWorkflowId !== activeWorkflowId) {
            baselineWorkflow = captureBaselineSnapshot(activeWorkflowId)
            baselineWorkflowId = activeWorkflowId
            capturedBaseline = true
            logger.info('Captured baseline snapshot for diff workflow', {
              workflowId: activeWorkflowId,
              blockCount: Object.keys(baselineWorkflow.blocks || {}).length,
            })
          }

          // Create diff (this is fast, just computes the diff)
          const diffResult = await diffEngine.createDiffFromWorkflowState(
            proposedState,
            diffAnalysis,
            baselineWorkflow ?? undefined
          )

          if (!diffResult.success || !diffResult.diff) {
            const errorMessage = diffResult.errors?.join(', ') || 'Failed to create diff'
            logger.error(errorMessage)
            throw new Error(errorMessage)
          }

          const candidateState = diffResult.diff.proposedState

          // Validate proposed workflow using serializer round-trip
          const serializer = new Serializer()
          const serialized = serializer.serializeWorkflow(
            candidateState.blocks,
            candidateState.edges,
            candidateState.loops,
            candidateState.parallels,
            false
          )
          serializer.deserializeWorkflow(serialized)

          // OPTIMISTIC: Apply state immediately to stores (this is what makes UI update)
          applyWorkflowStateToStores(activeWorkflowId, candidateState)

          // OPTIMISTIC: Update diff state immediately so UI shows the diff
          const triggerMessageId =
            capturedBaseline && !get()._triggerMessageId
              ? await getLatestUserMessageId()
              : get()._triggerMessageId

          set({
            hasActiveDiff: true,
            isShowingDiff: true,
            isDiffReady: true,
            baselineWorkflow: baselineWorkflow,
            baselineWorkflowId,
            diffAnalysis: diffResult.diff.diffAnalysis || null,
            diffMetadata: diffResult.diff.metadata,
            diffError: null,
            _triggerMessageId: triggerMessageId ?? null,
          })

          logger.info('Workflow diff applied optimistically', {
            workflowId: activeWorkflowId,
            blocks: Object.keys(candidateState.blocks || {}).length,
            edges: candidateState.edges?.length || 0,
          })

          // BACKGROUND: Broadcast and persist without blocking
          // These operations happen after the UI has already updated
          const cleanState = stripWorkflowDiffMarkers(cloneWorkflowState(candidateState))

          // Fire and forget: broadcast to other users (don't await)
          enqueueReplaceWorkflowState({
            workflowId: activeWorkflowId,
            state: cleanState,
          }).catch((error) => {
            logger.warn('Failed to broadcast workflow state (non-blocking)', { error })
          })

          // Fire and forget: persist to database (don't await)
          persistWorkflowStateToServer(activeWorkflowId, candidateState)
            .then((persisted) => {
              if (!persisted) {
                logger.warn('Failed to persist copilot edits (state already applied locally)')
                // Don't revert - user can retry or state will sync on next save
              } else {
                logger.info('Workflow diff persisted to database', {
                  workflowId: activeWorkflowId,
                })
              }
            })
            .catch((error) => {
              logger.warn('Failed to persist workflow state (non-blocking)', { error })
            })

          // Emit event for undo/redo recording
          if (!(window as any).__skipDiffRecording) {
            window.dispatchEvent(
              new CustomEvent('record-diff-operation', {
                detail: {
                  type: 'apply-diff',
                  baselineSnapshot: baselineWorkflow,
                  proposedState: candidateState,
                  diffAnalysis: diffResult.diff.diffAnalysis,
                },
              })
            )
          }
        },

        clearDiff: ({ restoreBaseline = true } = {}) => {
          const { baselineWorkflow, baselineWorkflowId } = get()
          const activeWorkflowId = useWorkflowRegistry.getState().activeWorkflowId

          if (
            restoreBaseline &&
            baselineWorkflow &&
            baselineWorkflowId &&
            baselineWorkflowId === activeWorkflowId
          ) {
            applyWorkflowStateToStores(baselineWorkflowId, baselineWorkflow)
          }

          diffEngine.clearDiff()

          batchedUpdate({
            hasActiveDiff: false,
            isShowingDiff: false,
            isDiffReady: false,
            baselineWorkflow: null,
            baselineWorkflowId: null,
            diffAnalysis: null,
            diffMetadata: null,
            diffError: null,
            _triggerMessageId: null,
          })
        },

        toggleDiffView: () => {
          const { hasActiveDiff, isDiffReady, isShowingDiff } = get()
          if (!hasActiveDiff) {
            logger.warn('Cannot toggle diff view without active diff')
            return
          }
          if (!isDiffReady) {
            logger.warn('Cannot toggle diff view before diff is ready')
            return
          }
          batchedUpdate({ isShowingDiff: !isShowingDiff })
        },

        acceptChanges: async () => {
          const activeWorkflowId = useWorkflowRegistry.getState().activeWorkflowId
          if (!activeWorkflowId) {
            logger.error('No active workflow ID found when accepting diff')
            throw new Error('No active workflow found')
          }

          const workflowStore = useWorkflowStore.getState()
          const currentState = workflowStore.getWorkflowState()
          const mergedBlocks = mergeSubblockState(
            currentState.blocks,
            activeWorkflowId ?? undefined
          )
          const mergedState = {
            ...currentState,
            blocks: mergedBlocks,
          }
          const cleanState = stripWorkflowDiffMarkers(cloneWorkflowState(mergedState))
          const validation = validateWorkflowState(cleanState, { sanitize: true })

          if (!validation.valid) {
            const errorMessage = `Cannot apply changes: ${validation.errors.join('; ')}`
            logger.error(errorMessage)
            batchedUpdate({ diffError: errorMessage })
            throw new Error(errorMessage)
          }

          const stateToApply = {
            ...(validation.sanitizedState || cleanState),
            lastSaved: useWorkflowStore.getState().lastSaved,
          }

          // Capture state before accept for undo
          const beforeAccept = cloneWorkflowState(mergedState)
          const afterAccept = cloneWorkflowState(stateToApply)
          const diffAnalysisForUndo = get().diffAnalysis
          const baselineForUndo = get().baselineWorkflow
          const triggerMessageId = get()._triggerMessageId

          // Clear diff state FIRST to prevent flash of colors
          // This must happen synchronously before applying the cleaned state
          set({
            hasActiveDiff: false,
            isShowingDiff: false,
            isDiffReady: false,
            baselineWorkflow: null,
            baselineWorkflowId: null,
            diffAnalysis: null,
            diffMetadata: null,
            diffError: null,
            _triggerMessageId: null,
          })

          // Clear the diff engine
          diffEngine.clearDiff()

          // Now apply the cleaned state
          applyWorkflowStateToStores(activeWorkflowId, stateToApply)

          // Emit event for undo/redo recording (unless we're in an undo/redo operation)
          if (!(window as any).__skipDiffRecording) {
            window.dispatchEvent(
              new CustomEvent('record-diff-operation', {
                detail: {
                  type: 'accept-diff',
                  beforeAccept,
                  afterAccept,
                  diffAnalysis: diffAnalysisForUndo,
                  baselineSnapshot: baselineForUndo,
                },
              })
            )
          }

          if (triggerMessageId) {
            fetch('/api/copilot/stats', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                messageId: triggerMessageId,
                diffCreated: true,
                diffAccepted: true,
              }),
            }).catch(() => {})
          }

          const toolCallId = await findLatestEditWorkflowToolCallId()
          if (toolCallId) {
            try {
              await getClientTool(toolCallId)?.handleAccept?.()
            } catch (error) {
              logger.warn('Failed to notify tool accept state', { error })
            }
          }
        },

        rejectChanges: async () => {
          const { baselineWorkflow, baselineWorkflowId, _triggerMessageId, diffAnalysis } = get()
          const activeWorkflowId = useWorkflowRegistry.getState().activeWorkflowId

          if (!baselineWorkflow || !baselineWorkflowId) {
            logger.warn('Reject called without baseline workflow')
            get().clearDiff({ restoreBaseline: false })
            return
          }

          if (!activeWorkflowId || activeWorkflowId !== baselineWorkflowId) {
            logger.warn('Reject called while viewing a different workflow', {
              activeWorkflowId,
              baselineWorkflowId,
            })
            get().clearDiff({ restoreBaseline: false })
            return
          }

          // Capture current state (with markers) before rejecting
          const workflowStore = useWorkflowStore.getState()
          const currentState = workflowStore.getWorkflowState()
          const mergedBlocks = mergeSubblockState(
            currentState.blocks,
            activeWorkflowId ?? undefined
          )
          const beforeReject = cloneWorkflowState({
            ...currentState,
            blocks: mergedBlocks,
          })
          const afterReject = cloneWorkflowState(baselineWorkflow)

          // Apply baseline state locally
          applyWorkflowStateToStores(baselineWorkflowId, baselineWorkflow)

          // Broadcast to other users
          logger.info('Broadcasting reject to other users', {
            workflowId: activeWorkflowId,
            blockCount: Object.keys(baselineWorkflow.blocks).length,
          })

          await enqueueReplaceWorkflowState({
            workflowId: activeWorkflowId,
            state: baselineWorkflow,
            immediate: true,
          })

          // Persist to database
          const persisted = await persistWorkflowStateToServer(baselineWorkflowId, baselineWorkflow)
          if (!persisted) {
            throw new Error('Failed to restore baseline workflow state')
          }

          // Emit event for undo/redo recording
          if (!(window as any).__skipDiffRecording) {
            window.dispatchEvent(
              new CustomEvent('record-diff-operation', {
                detail: {
                  type: 'reject-diff',
                  beforeReject,
                  afterReject,
                  diffAnalysis,
                  baselineSnapshot: baselineWorkflow,
                },
              })
            )
          }

          if (_triggerMessageId) {
            fetch('/api/copilot/stats', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                messageId: _triggerMessageId,
                diffCreated: true,
                diffAccepted: false,
              }),
            }).catch(() => {})
          }

          const toolCallId = await findLatestEditWorkflowToolCallId()
          if (toolCallId) {
            try {
              await getClientTool(toolCallId)?.handleReject?.()
            } catch (error) {
              logger.warn('Failed to notify tool reject state', { error })
            }
          }

          get().clearDiff({ restoreBaseline: false })
        },

        reapplyDiffMarkers: () => {
          const { hasActiveDiff, isDiffReady, diffAnalysis } = get()
          if (!hasActiveDiff || !isDiffReady || !diffAnalysis) {
            return
          }

          const workflowStore = useWorkflowStore.getState()
          const currentBlocks = workflowStore.blocks

          // Check if any blocks need markers applied (checking the actual property, not just existence)
          const needsUpdate =
            diffAnalysis.new_blocks?.some((blockId) => {
              const block = currentBlocks[blockId]
              return block && (block as any).is_diff !== 'new'
            }) ||
            diffAnalysis.edited_blocks?.some((blockId) => {
              const block = currentBlocks[blockId]
              return block && (block as any).is_diff !== 'edited'
            })

          if (!needsUpdate) {
            return
          }

          const updatedBlocks: Record<string, any> = {}
          let hasChanges = false

          // Only clone blocks that need diff markers
          Object.entries(currentBlocks).forEach(([blockId, block]) => {
            const isNewBlock = diffAnalysis.new_blocks?.includes(blockId)
            const isEditedBlock = diffAnalysis.edited_blocks?.includes(blockId)

            if (isNewBlock && (block as any).is_diff !== 'new') {
              updatedBlocks[blockId] = { ...block, is_diff: 'new' }
              hasChanges = true
            } else if (isEditedBlock && (block as any).is_diff !== 'edited') {
              updatedBlocks[blockId] = { ...block, is_diff: 'edited' }

              // Re-apply field_diffs if available
              if (diffAnalysis.field_diffs?.[blockId]) {
                updatedBlocks[blockId].field_diffs = diffAnalysis.field_diffs[blockId]

                // Clone subblocks and apply markers
                const fieldDiff = diffAnalysis.field_diffs[blockId]
                updatedBlocks[blockId].subBlocks = { ...block.subBlocks }

                fieldDiff.changed_fields.forEach((field) => {
                  if (updatedBlocks[blockId].subBlocks?.[field]) {
                    updatedBlocks[blockId].subBlocks[field] = {
                      ...updatedBlocks[blockId].subBlocks[field],
                      is_diff: 'changed',
                    }
                  }
                })
              }
              hasChanges = true
            } else {
              updatedBlocks[blockId] = block
            }
          })

          // Only update if we actually made changes
          if (hasChanges) {
            useWorkflowStore.setState({ blocks: updatedBlocks })
            logger.info('Re-applied diff markers to workflow blocks')
          }
        },
      }
    },
    { name: 'workflow-diff-store' }
  )
)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/stores/workflows/index.ts
Signals: Zod

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'
import { mergeSubblockState } from '@/stores/workflows/utils'
import { useWorkflowStore } from '@/stores/workflows/workflow/store'
import type { BlockState, WorkflowState } from '@/stores/workflows/workflow/types'

const logger = createLogger('Workflows')

/**
 * Get a workflow with its state merged in by ID
 * Note: Since localStorage has been removed, this only works for the active workflow
 * @param workflowId ID of the workflow to retrieve
 * @returns The workflow with merged state values or null if not found/not active
 */
export function getWorkflowWithValues(workflowId: string) {
  const { workflows } = useWorkflowRegistry.getState()
  const activeWorkflowId = useWorkflowRegistry.getState().activeWorkflowId
  const currentState = useWorkflowStore.getState()

  if (!workflows[workflowId]) {
    logger.warn(`Workflow ${workflowId} not found`)
    return null
  }

  // Since localStorage persistence has been removed, only return data for active workflow
  if (workflowId !== activeWorkflowId) {
    logger.warn(`Cannot get state for non-active workflow ${workflowId} - localStorage removed`)
    return null
  }

  const metadata = workflows[workflowId]

  // Get deployment status from registry
  const deploymentStatus = useWorkflowRegistry.getState().getWorkflowDeploymentStatus(workflowId)

  // Use the current state from the store (only available for active workflow)
  const workflowState: WorkflowState = {
    // Use the main store's method to get the base workflow state
    ...useWorkflowStore.getState().getWorkflowState(),
    // Override deployment fields with registry-specific deployment status
    isDeployed: deploymentStatus?.isDeployed || false,
    deployedAt: deploymentStatus?.deployedAt,
  }

  // Merge the subblock values for this specific workflow
  const mergedBlocks = mergeSubblockState(workflowState.blocks, workflowId)

  return {
    id: workflowId,
    name: metadata.name,
    description: metadata.description,
    color: metadata.color || '#3972F6',
    workspaceId: metadata.workspaceId,
    folderId: metadata.folderId,
    state: {
      blocks: mergedBlocks,
      edges: workflowState.edges,
      loops: workflowState.loops,
      parallels: workflowState.parallels,
      lastSaved: workflowState.lastSaved,
      isDeployed: workflowState.isDeployed,
      deployedAt: workflowState.deployedAt,
    },
  }
}

/**
 * Get a specific block with its subblock values merged in
 * @param blockId ID of the block to retrieve
 * @returns The block with merged subblock values or null if not found
 */
export function getBlockWithValues(blockId: string): BlockState | null {
  const workflowState = useWorkflowStore.getState()
  const activeWorkflowId = useWorkflowRegistry.getState().activeWorkflowId

  if (!activeWorkflowId || !workflowState.blocks[blockId]) return null

  const mergedBlocks = mergeSubblockState(workflowState.blocks, activeWorkflowId, blockId)
  return mergedBlocks[blockId] || null
}

/**
 * Get all workflows with their values merged
 * Note: Since localStorage has been removed, this only includes the active workflow state
 * @returns An object containing workflows, with state only for the active workflow
 */
export function getAllWorkflowsWithValues() {
  const { workflows } = useWorkflowRegistry.getState()
  const result: Record<string, any> = {}
  const activeWorkflowId = useWorkflowRegistry.getState().activeWorkflowId
  const currentState = useWorkflowStore.getState()

  // Only sync the active workflow to ensure we always send valid state data
  if (activeWorkflowId && workflows[activeWorkflowId]) {
    const metadata = workflows[activeWorkflowId]

    // Get deployment status from registry
    const deploymentStatus = useWorkflowRegistry
      .getState()
      .getWorkflowDeploymentStatus(activeWorkflowId)

    // Ensure state has all required fields for Zod validation
    const workflowState: WorkflowState = {
      // Use the main store's method to get the base workflow state with fallback values
      ...useWorkflowStore.getState().getWorkflowState(),
      // Ensure fallback values for safer handling
      blocks: currentState.blocks || {},
      edges: currentState.edges || [],
      loops: currentState.loops || {},
      parallels: currentState.parallels || {},
      lastSaved: currentState.lastSaved || Date.now(),
      // Override deployment fields with registry-specific deployment status
      isDeployed: deploymentStatus?.isDeployed || false,
      deployedAt: deploymentStatus?.deployedAt,
    }

    // Merge the subblock values for this specific workflow
    const mergedBlocks = mergeSubblockState(workflowState.blocks, activeWorkflowId)

    // Include the API key in the state if it exists in the deployment status
    const apiKey = deploymentStatus?.apiKey

    result[activeWorkflowId] = {
      id: activeWorkflowId,
      name: metadata.name,
      description: metadata.description,
      color: metadata.color || '#3972F6',
      folderId: metadata.folderId,
      state: {
        blocks: mergedBlocks,
        edges: workflowState.edges,
        loops: workflowState.loops,
        parallels: workflowState.parallels,
        lastSaved: workflowState.lastSaved,
        isDeployed: workflowState.isDeployed,
        deployedAt: workflowState.deployedAt,
      },
      // Include API key if available
      apiKey,
    }

    // Only include workspaceId if it's not null/undefined
    if (metadata.workspaceId) {
      result[activeWorkflowId].workspaceId = metadata.workspaceId
    }
  }

  return result
}

export { useWorkflowRegistry } from '@/stores/workflows/registry/store'
export type { WorkflowMetadata } from '@/stores/workflows/registry/types'
export { useSubBlockStore } from '@/stores/workflows/subblock/store'
export type { SubBlockStore } from '@/stores/workflows/subblock/types'
export { mergeSubblockState } from '@/stores/workflows/utils'
export { useWorkflowStore } from '@/stores/workflows/workflow/store'
export type { WorkflowState } from '@/stores/workflows/workflow/types'
```

--------------------------------------------------------------------------------

---[FILE: server-utils.ts]---
Location: sim-main/apps/sim/stores/workflows/server-utils.ts

```typescript
/**
 * Server-Safe Workflow Utilities
 *
 * This file contains workflow utility functions that can be safely imported
 * by server-side API routes without causing client/server boundary violations.
 *
 * Unlike the main utils.ts file, this does NOT import any client-side stores
 * or React hooks, making it safe for use in Next.js API routes.
 */

import type { BlockState, SubBlockState } from '@/stores/workflows/workflow/types'

/**
 * Server-safe version of mergeSubblockState for API routes
 *
 * Merges workflow block states with provided subblock values while maintaining block structure.
 * This version takes explicit subblock values instead of reading from client stores.
 *
 * @param blocks - Block configurations from workflow state
 * @param subBlockValues - Object containing subblock values keyed by blockId -> subBlockId -> value
 * @param blockId - Optional specific block ID to merge (merges all if not provided)
 * @returns Merged block states with updated values
 */
export function mergeSubblockState(
  blocks: Record<string, BlockState>,
  subBlockValues: Record<string, Record<string, any>> = {},
  blockId?: string
): Record<string, BlockState> {
  const blocksToProcess = blockId ? { [blockId]: blocks[blockId] } : blocks

  return Object.entries(blocksToProcess).reduce(
    (acc, [id, block]) => {
      // Skip if block is undefined
      if (!block) {
        return acc
      }

      // Initialize subBlocks if not present
      const blockSubBlocks = block.subBlocks || {}

      // Get stored values for this block
      const blockValues = subBlockValues[id] || {}

      // Create a deep copy of the block's subBlocks to maintain structure
      const mergedSubBlocks = Object.entries(blockSubBlocks).reduce(
        (subAcc, [subBlockId, subBlock]) => {
          // Skip if subBlock is undefined
          if (!subBlock) {
            return subAcc
          }

          // Get the stored value for this subblock
          const storedValue = blockValues[subBlockId]

          // Create a new subblock object with the same structure but updated value
          subAcc[subBlockId] = {
            ...subBlock,
            value: storedValue !== undefined && storedValue !== null ? storedValue : subBlock.value,
          }

          return subAcc
        },
        {} as Record<string, SubBlockState>
      )

      // Return the full block state with updated subBlocks
      acc[id] = {
        ...block,
        subBlocks: mergedSubBlocks,
      }

      // Add any values that exist in the provided values but aren't in the block structure
      // This handles cases where block config has been updated but values still exist
      Object.entries(blockValues).forEach(([subBlockId, value]) => {
        if (!mergedSubBlocks[subBlockId] && value !== null && value !== undefined) {
          // Create a minimal subblock structure
          mergedSubBlocks[subBlockId] = {
            id: subBlockId,
            type: 'short-input', // Default type that's safe to use
            value: value,
          }
        }
      })

      // Update the block with the final merged subBlocks (including orphaned values)
      acc[id] = {
        ...block,
        subBlocks: mergedSubBlocks,
      }

      return acc
    },
    {} as Record<string, BlockState>
  )
}

/**
 * Server-safe async version of mergeSubblockState for API routes
 *
 * Asynchronously merges workflow block states with provided subblock values.
 * This version takes explicit subblock values instead of reading from client stores.
 *
 * @param blocks - Block configurations from workflow state
 * @param subBlockValues - Object containing subblock values keyed by blockId -> subBlockId -> value
 * @param blockId - Optional specific block ID to merge (merges all if not provided)
 * @returns Promise resolving to merged block states with updated values
 */
export async function mergeSubblockStateAsync(
  blocks: Record<string, BlockState>,
  subBlockValues: Record<string, Record<string, any>> = {},
  blockId?: string
): Promise<Record<string, BlockState>> {
  // Since we're not reading from client stores, we can just return the sync version
  // The async nature was only needed for the client-side store operations
  return mergeSubblockState(blocks, subBlockValues, blockId)
}
```

--------------------------------------------------------------------------------

````
