---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 642
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 642 of 933)

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
Location: sim-main/apps/sim/stores/workflows/registry/store.ts

```typescript
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { withOptimisticUpdate } from '@/lib/core/utils/optimistic-update'
import { createLogger } from '@/lib/logs/console/logger'
import { buildDefaultWorkflowArtifacts } from '@/lib/workflows/defaults'
import { API_ENDPOINTS } from '@/stores/constants'
import { useVariablesStore } from '@/stores/panel/variables/store'
import type {
  DeploymentStatus,
  HydrationState,
  WorkflowMetadata,
  WorkflowRegistry,
} from '@/stores/workflows/registry/types'
import { getNextWorkflowColor } from '@/stores/workflows/registry/utils'
import { useSubBlockStore } from '@/stores/workflows/subblock/store'
import { useWorkflowStore } from '@/stores/workflows/workflow/store'

const logger = createLogger('WorkflowRegistry')
const initialHydration: HydrationState = {
  phase: 'idle',
  workspaceId: null,
  workflowId: null,
  requestId: null,
  error: null,
}

const createRequestId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`

// Track workspace transitions to prevent race conditions
let isWorkspaceTransitioning = false
const TRANSITION_TIMEOUT = 5000 // 5 seconds maximum for workspace transitions

// Resets workflow and subblock stores to prevent data leakage between workspaces
function resetWorkflowStores() {
  // Reset the workflow store to prevent data leakage between workspaces
  useWorkflowStore.setState({
    blocks: {},
    edges: [],
    loops: {},
    parallels: {},
    isDeployed: false,
    deployedAt: undefined,
    deploymentStatuses: {}, // Reset deployment statuses map
    lastSaved: Date.now(),
  })

  // Reset the subblock store
  useSubBlockStore.setState({
    workflowValues: {},
  })
}

/**
 * Handles workspace transition state tracking
 * @param isTransitioning Whether workspace is currently transitioning
 */
function setWorkspaceTransitioning(isTransitioning: boolean): void {
  isWorkspaceTransitioning = isTransitioning

  // Set a safety timeout to prevent permanently stuck in transition state
  if (isTransitioning) {
    setTimeout(() => {
      if (isWorkspaceTransitioning) {
        logger.warn('Forcing workspace transition to complete due to timeout')
        isWorkspaceTransitioning = false
      }
    }, TRANSITION_TIMEOUT)
  }
}

export const useWorkflowRegistry = create<WorkflowRegistry>()(
  devtools(
    (set, get) => ({
      // Store state
      workflows: {},
      activeWorkflowId: null,
      error: null,
      deploymentStatuses: {},
      hydration: initialHydration,

      beginMetadataLoad: (workspaceId: string) => {
        set((state) => ({
          error: null,
          hydration: {
            phase: 'metadata-loading',
            workspaceId,
            workflowId: null,
            requestId: null,
            error: null,
          },
        }))
      },

      completeMetadataLoad: (workspaceId: string, workflows: WorkflowMetadata[]) => {
        const mapped = workflows.reduce<Record<string, WorkflowMetadata>>((acc, workflow) => {
          acc[workflow.id] = workflow
          return acc
        }, {})

        set((state) => ({
          workflows: mapped,
          error: null,
          hydration:
            state.hydration.phase === 'state-loading'
              ? state.hydration
              : {
                  phase: 'metadata-ready',
                  workspaceId,
                  workflowId: null,
                  requestId: null,
                  error: null,
                },
        }))
      },

      failMetadataLoad: (workspaceId: string | null, errorMessage: string) => {
        set((state) => ({
          error: errorMessage,
          hydration: {
            phase: 'error',
            workspaceId: workspaceId ?? state.hydration.workspaceId,
            workflowId: state.hydration.workflowId,
            requestId: null,
            error: errorMessage,
          },
        }))
      },

      // Switch to workspace - just clear state, let sidebar handle workflow loading
      switchToWorkspace: async (workspaceId: string) => {
        // Prevent multiple simultaneous transitions
        if (isWorkspaceTransitioning) {
          logger.warn(
            `Ignoring workspace switch to ${workspaceId} - transition already in progress`
          )
          return
        }

        // Set transition flag
        setWorkspaceTransitioning(true)

        try {
          logger.info(`Switching to workspace: ${workspaceId}`)

          // Clear current workspace state
          resetWorkflowStores()

          // Update state - sidebar will load workflows when URL changes
          set({
            activeWorkflowId: null,
            workflows: {},
            deploymentStatuses: {},
            error: null,
            hydration: {
              phase: 'metadata-loading',
              workspaceId,
              workflowId: null,
              requestId: null,
              error: null,
            },
          })

          logger.info(`Successfully switched to workspace: ${workspaceId}`)
        } catch (error) {
          logger.error(`Error switching to workspace ${workspaceId}:`, { error })
          set({
            error: `Failed to switch workspace: ${error instanceof Error ? error.message : 'Unknown error'}`,
            hydration: {
              phase: 'error',
              workspaceId,
              workflowId: null,
              requestId: null,
              error: error instanceof Error ? error.message : 'Unknown error',
            },
          })
        } finally {
          setWorkspaceTransitioning(false)
        }
      },

      // Method to get deployment status for a specific workflow
      getWorkflowDeploymentStatus: (workflowId: string | null): DeploymentStatus | null => {
        if (!workflowId) {
          // If no workflow ID provided, check the active workflow
          workflowId = get().activeWorkflowId
          if (!workflowId) return null
        }

        const { deploymentStatuses = {} } = get()

        // Get from the workflow-specific deployment statuses in the registry
        if (deploymentStatuses[workflowId]) {
          return deploymentStatuses[workflowId]
        }

        // No deployment status found
        return null
      },

      // Method to set deployment status for a specific workflow
      setDeploymentStatus: (
        workflowId: string | null,
        isDeployed: boolean,
        deployedAt?: Date,
        apiKey?: string
      ) => {
        if (!workflowId) {
          workflowId = get().activeWorkflowId
          if (!workflowId) return
        }

        // Update the deployment statuses in the registry
        set((state) => ({
          deploymentStatuses: {
            ...state.deploymentStatuses,
            [workflowId as string]: {
              isDeployed,
              deployedAt: deployedAt || (isDeployed ? new Date() : undefined),
              apiKey,
              // Preserve existing needsRedeployment flag if available, but reset if newly deployed
              needsRedeployment: isDeployed
                ? false
                : ((state.deploymentStatuses?.[workflowId as string] as any)?.needsRedeployment ??
                  false),
            },
          },
        }))

        // Also update the workflow store if this is the active workflow
        const { activeWorkflowId } = get()
        if (workflowId === activeWorkflowId) {
          // Update the workflow store for backward compatibility
          useWorkflowStore.setState((state) => ({
            isDeployed,
            deployedAt: deployedAt || (isDeployed ? new Date() : undefined),
            needsRedeployment: isDeployed ? false : state.needsRedeployment,
            deploymentStatuses: {
              ...state.deploymentStatuses,
              [workflowId as string]: {
                isDeployed,
                deployedAt: deployedAt || (isDeployed ? new Date() : undefined),
                apiKey,
                needsRedeployment: isDeployed
                  ? false
                  : ((state.deploymentStatuses?.[workflowId as string] as any)?.needsRedeployment ??
                    false),
              },
            },
          }))
        }

        // Note: Socket.IO handles real-time sync automatically
      },

      // Method to set the needsRedeployment flag for a specific workflow
      setWorkflowNeedsRedeployment: (workflowId: string | null, needsRedeployment: boolean) => {
        if (!workflowId) {
          workflowId = get().activeWorkflowId
          if (!workflowId) return
        }

        // Update the registry's deployment status for this specific workflow
        set((state) => {
          const deploymentStatuses = state.deploymentStatuses || {}
          const currentStatus = deploymentStatuses[workflowId as string] || { isDeployed: false }

          return {
            deploymentStatuses: {
              ...deploymentStatuses,
              [workflowId as string]: {
                ...currentStatus,
                needsRedeployment,
              },
            },
          }
        })

        // Only update the global flag if this is the active workflow
        const { activeWorkflowId } = get()
        if (workflowId === activeWorkflowId) {
          useWorkflowStore.getState().setNeedsRedeploymentFlag(needsRedeployment)
        }
      },

      loadWorkflowState: async (workflowId: string) => {
        const { workflows } = get()

        if (!workflows[workflowId]) {
          const message = `Workflow not found: ${workflowId}`
          logger.error(message)
          set({ error: message })
          throw new Error(message)
        }

        const requestId = createRequestId()

        set((state) => ({
          error: null,
          hydration: {
            phase: 'state-loading',
            workspaceId: state.hydration.workspaceId,
            workflowId,
            requestId,
            error: null,
          },
        }))

        try {
          const response = await fetch(`/api/workflows/${workflowId}`, { method: 'GET' })
          if (!response.ok) {
            throw new Error(`Failed to load workflow ${workflowId}`)
          }

          const workflowData = (await response.json()).data
          let workflowState: any

          if (workflowData?.state) {
            workflowState = {
              blocks: workflowData.state.blocks || {},
              edges: workflowData.state.edges || [],
              loops: workflowData.state.loops || {},
              parallels: workflowData.state.parallels || {},
              isDeployed: workflowData.isDeployed || false,
              deployedAt: workflowData.deployedAt ? new Date(workflowData.deployedAt) : undefined,
              apiKey: workflowData.apiKey,
              lastSaved: Date.now(),
              deploymentStatuses: {},
            }
          } else {
            workflowState = {
              blocks: {},
              edges: [],
              loops: {},
              parallels: {},
              isDeployed: false,
              deployedAt: undefined,
              deploymentStatuses: {},
              lastSaved: Date.now(),
            }

            logger.info(
              `Workflow ${workflowId} has no state yet - will load from DB or show empty canvas`
            )
          }

          const nextDeploymentStatuses =
            workflowData?.isDeployed || workflowData?.deployedAt
              ? {
                  ...get().deploymentStatuses,
                  [workflowId]: {
                    isDeployed: workflowData.isDeployed || false,
                    deployedAt: workflowData.deployedAt
                      ? new Date(workflowData.deployedAt)
                      : undefined,
                    apiKey: workflowData.apiKey || undefined,
                    needsRedeployment: false,
                  },
                }
              : get().deploymentStatuses

          const currentHydration = get().hydration
          if (
            currentHydration.requestId !== requestId ||
            currentHydration.workflowId !== workflowId
          ) {
            logger.info('Discarding stale workflow hydration result', {
              workflowId,
              requestId,
            })
            return
          }

          useWorkflowStore.setState(workflowState)
          useSubBlockStore.getState().initializeFromWorkflow(workflowId, workflowState.blocks || {})

          if (workflowData?.variables && typeof workflowData.variables === 'object') {
            useVariablesStore.setState((state) => {
              const withoutWorkflow = Object.fromEntries(
                Object.entries(state.variables).filter(([, v]: any) => v.workflowId !== workflowId)
              )
              return {
                variables: { ...withoutWorkflow, ...workflowData.variables },
              }
            })
          }

          window.dispatchEvent(
            new CustomEvent('active-workflow-changed', {
              detail: { workflowId },
            })
          )

          set((state) => ({
            activeWorkflowId: workflowId,
            error: null,
            deploymentStatuses: nextDeploymentStatuses,
            hydration: {
              phase: 'ready',
              workspaceId: state.hydration.workspaceId,
              workflowId,
              requestId,
              error: null,
            },
          }))

          logger.info(`Switched to workflow ${workflowId}`)
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : `Failed to load workflow ${workflowId}: Unknown error`
          logger.error(message)
          set((state) => ({
            error: message,
            hydration: {
              phase: 'error',
              workspaceId: state.hydration.workspaceId,
              workflowId,
              requestId: null,
              error: message,
            },
          }))
          throw error
        }
      },

      // Modified setActiveWorkflow to work with clean DB-only architecture
      setActiveWorkflow: async (id: string) => {
        const { activeWorkflowId, hydration } = get()

        const workflowStoreState = useWorkflowStore.getState()
        const hasWorkflowData = Object.keys(workflowStoreState.blocks).length > 0

        // Skip loading only if:
        // - Same workflow is already active
        // - Workflow data exists
        // - Hydration is complete (phase is 'ready')
        const isFullyHydrated =
          activeWorkflowId === id &&
          hasWorkflowData &&
          hydration.phase === 'ready' &&
          hydration.workflowId === id

        if (isFullyHydrated) {
          logger.info(`Already active workflow ${id} with data loaded, skipping switch`)
          return
        }

        await get().loadWorkflowState(id)
      },

      /**
       * Duplicates an existing workflow
       */
      duplicateWorkflow: async (sourceId: string) => {
        const { workflows } = get()
        const sourceWorkflow = workflows[sourceId]

        if (!sourceWorkflow) {
          set({ error: `Workflow ${sourceId} not found` })
          return null
        }

        // Get the workspace ID from the source workflow (required)
        const workspaceId = sourceWorkflow.workspaceId

        // Call the server to duplicate the workflow - server generates all IDs
        let duplicatedWorkflow
        try {
          const response = await fetch(`/api/workflows/${sourceId}/duplicate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: `${sourceWorkflow.name} (Copy)`,
              description: sourceWorkflow.description,
              color: sourceWorkflow.color,
              workspaceId: workspaceId,
              folderId: sourceWorkflow.folderId,
            }),
          })

          if (!response.ok) {
            throw new Error(`Failed to duplicate workflow: ${response.statusText}`)
          }

          duplicatedWorkflow = await response.json()
          logger.info(
            `Successfully duplicated workflow ${sourceId} to ${duplicatedWorkflow.id} with ${duplicatedWorkflow.blocksCount} blocks, ${duplicatedWorkflow.edgesCount} edges, ${duplicatedWorkflow.subflowsCount} subflows`
          )
        } catch (error) {
          logger.error(`Failed to duplicate workflow ${sourceId}:`, error)
          set({
            error: `Failed to duplicate workflow: ${error instanceof Error ? error.message : 'Unknown error'}`,
          })
          return null
        }

        // Use the server-generated ID
        const id = duplicatedWorkflow.id

        // Generate new workflow metadata using the server-generated ID
        const newWorkflow: WorkflowMetadata = {
          id,
          name: `${sourceWorkflow.name} (Copy)`,
          lastModified: new Date(),
          createdAt: new Date(),
          description: sourceWorkflow.description,
          color: getNextWorkflowColor(),
          workspaceId, // Include the workspaceId in the new workflow
          folderId: sourceWorkflow.folderId, // Include the folderId from source workflow
        }

        // Get the current workflow state to copy from
        const currentWorkflowState = useWorkflowStore.getState()

        // If we're duplicating the active workflow, use current state
        // Otherwise, we need to fetch it from DB or use empty state
        let sourceState: any

        if (sourceId === get().activeWorkflowId) {
          // Source is the active workflow, copy current state
          sourceState = {
            blocks: currentWorkflowState.blocks || {},
            edges: currentWorkflowState.edges || [],
            loops: currentWorkflowState.loops || {},
            parallels: currentWorkflowState.parallels || {},
          }
        } else {
          const { workflowState } = buildDefaultWorkflowArtifacts()
          sourceState = {
            blocks: workflowState.blocks,
            edges: workflowState.edges,
            loops: workflowState.loops,
            parallels: workflowState.parallels,
          }
        }

        // Create the new workflow state with copied content
        const newState = {
          blocks: sourceState.blocks,
          edges: sourceState.edges,
          loops: sourceState.loops,
          parallels: sourceState.parallels,
          isDeployed: false,
          deployedAt: undefined,
          workspaceId,
          deploymentStatuses: {},
          lastSaved: Date.now(),
        }

        // Add workflow to registry
        set((state) => ({
          workflows: {
            ...state.workflows,
            [id]: newWorkflow,
          },
          error: null,
        }))

        // Copy subblock values if duplicating active workflow
        if (sourceId === get().activeWorkflowId) {
          const sourceSubblockValues = useSubBlockStore.getState().workflowValues[sourceId] || {}
          useSubBlockStore.setState((state) => ({
            workflowValues: {
              ...state.workflowValues,
              [id]: sourceSubblockValues,
            },
          }))
        } else {
          // Initialize subblock values for starter block
          const subblockValues: Record<string, Record<string, any>> = {}
          Object.entries(newState.blocks).forEach(([blockId, block]) => {
            const blockState = block as any
            subblockValues[blockId] = {}
            Object.entries(blockState.subBlocks || {}).forEach(([subblockId, subblock]) => {
              subblockValues[blockId][subblockId] = (subblock as any).value
            })
          })

          useSubBlockStore.setState((state) => ({
            workflowValues: {
              ...state.workflowValues,
              [id]: subblockValues,
            },
          }))
        }

        try {
          await useVariablesStore.getState().loadForWorkflow(id)
        } catch (error) {
          logger.warn(`Error hydrating variables for duplicated workflow ${id}:`, error)
        }

        logger.info(
          `Duplicated workflow ${sourceId} to ${id} in workspace ${workspaceId || 'none'}`
        )

        return id
      },

      removeWorkflow: async (id: string) => {
        const { workflows, activeWorkflowId } = get()
        const workflowToDelete = workflows[id]

        if (!workflowToDelete) {
          logger.warn(`Attempted to delete non-existent workflow: ${id}`)
          return
        }

        const isDeletingActiveWorkflow = activeWorkflowId === id

        await withOptimisticUpdate({
          getCurrentState: () => ({
            workflows: { ...get().workflows },
            activeWorkflowId: get().activeWorkflowId,
            subBlockValues: { ...useSubBlockStore.getState().workflowValues },
            workflowStoreState: isDeletingActiveWorkflow
              ? {
                  blocks: { ...useWorkflowStore.getState().blocks },
                  edges: [...useWorkflowStore.getState().edges],
                  loops: { ...useWorkflowStore.getState().loops },
                  parallels: { ...useWorkflowStore.getState().parallels },
                  isDeployed: useWorkflowStore.getState().isDeployed,
                  deployedAt: useWorkflowStore.getState().deployedAt,
                  lastSaved: useWorkflowStore.getState().lastSaved,
                }
              : null,
          }),
          optimisticUpdate: () => {
            const newWorkflows = { ...get().workflows }
            delete newWorkflows[id]

            const currentSubBlockValues = useSubBlockStore.getState().workflowValues
            const newWorkflowValues = { ...currentSubBlockValues }
            delete newWorkflowValues[id]
            useSubBlockStore.setState({ workflowValues: newWorkflowValues })

            let newActiveWorkflowId = get().activeWorkflowId
            if (isDeletingActiveWorkflow) {
              newActiveWorkflowId = null

              useWorkflowStore.setState({
                blocks: {},
                edges: [],
                loops: {},
                parallels: {},
                isDeployed: false,
                deployedAt: undefined,
                lastSaved: Date.now(),
              })

              logger.info(
                `Cleared active workflow ${id} - user will need to manually select another workflow`
              )
            }

            set({
              workflows: newWorkflows,
              activeWorkflowId: newActiveWorkflowId,
              error: null,
            })

            logger.info(`Removed workflow ${id} from local state (optimistic)`)
          },
          apiCall: async () => {
            const response = await fetch(`/api/workflows/${id}`, {
              method: 'DELETE',
            })

            if (!response.ok) {
              const error = await response.json().catch(() => ({ error: 'Unknown error' }))
              throw new Error(error.error || 'Failed to delete workflow')
            }

            logger.info(`Successfully deleted workflow ${id} from database`)

            fetch(API_ENDPOINTS.SCHEDULE, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                workflowId: id,
                state: {
                  blocks: {},
                  edges: [],
                  loops: {},
                },
              }),
            }).catch((error) => {
              logger.error(`Error cancelling schedule for deleted workflow ${id}:`, error)
            })
          },
          rollback: (originalState) => {
            set({
              workflows: originalState.workflows,
              activeWorkflowId: originalState.activeWorkflowId,
            })

            useSubBlockStore.setState({ workflowValues: originalState.subBlockValues })

            if (originalState.workflowStoreState) {
              useWorkflowStore.setState(originalState.workflowStoreState)
              logger.info(`Restored workflow store state for workflow ${id}`)
            }

            logger.info(`Rolled back deletion of workflow ${id}`)
          },
          errorMessage: `Failed to delete workflow ${id}`,
        })
      },

      updateWorkflow: async (id: string, metadata: Partial<WorkflowMetadata>) => {
        const { workflows } = get()
        const workflow = workflows[id]
        if (!workflow) {
          logger.warn(`Cannot update workflow ${id}: not found in registry`)
          return
        }

        await withOptimisticUpdate({
          getCurrentState: () => workflow,
          optimisticUpdate: () => {
            set((state) => ({
              workflows: {
                ...state.workflows,
                [id]: {
                  ...workflow,
                  ...metadata,
                  lastModified: new Date(),
                  createdAt: workflow.createdAt, // Preserve creation date
                },
              },
              error: null,
            }))
          },
          apiCall: async () => {
            const response = await fetch(`/api/workflows/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(metadata),
            })

            if (!response.ok) {
              const error = await response.json()
              throw new Error(error.error || 'Failed to update workflow')
            }

            const { workflow: updatedWorkflow } = await response.json()
            logger.info(`Successfully updated workflow ${id} metadata`, metadata)

            set((state) => ({
              workflows: {
                ...state.workflows,
                [id]: {
                  ...state.workflows[id],
                  name: updatedWorkflow.name,
                  description: updatedWorkflow.description,
                  color: updatedWorkflow.color,
                  folderId: updatedWorkflow.folderId,
                  lastModified: new Date(updatedWorkflow.updatedAt),
                  createdAt: updatedWorkflow.createdAt
                    ? new Date(updatedWorkflow.createdAt)
                    : state.workflows[id].createdAt,
                },
              },
            }))
          },
          rollback: (originalWorkflow) => {
            set((state) => ({
              workflows: {
                ...state.workflows,
                [id]: originalWorkflow, // Revert to original state
              },
              error: `Failed to update workflow: ${metadata.name ? 'name' : 'metadata'}`,
            }))
          },
          errorMessage: `Failed to update workflow ${id} metadata`,
        })
      },

      logout: () => {
        logger.info('Logging out - clearing all workflow data')

        resetWorkflowStores()

        set({
          activeWorkflowId: null,
          workflows: {},
          deploymentStatuses: {},
          error: null,
          hydration: initialHydration,
        })

        logger.info('Logout complete - all workflow data cleared')
      },
    }),
    { name: 'workflow-registry' }
  )
)
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/stores/workflows/registry/types.ts

```typescript
export interface DeploymentStatus {
  isDeployed: boolean
  deployedAt?: Date
  apiKey?: string
  needsRedeployment?: boolean
}

export interface WorkflowMetadata {
  id: string
  name: string
  lastModified: Date
  createdAt: Date
  description?: string
  color: string
  workspaceId?: string
  folderId?: string | null
}

export type HydrationPhase =
  | 'idle'
  | 'metadata-loading'
  | 'metadata-ready'
  | 'state-loading'
  | 'ready'
  | 'error'

export interface HydrationState {
  phase: HydrationPhase
  workspaceId: string | null
  workflowId: string | null
  requestId: string | null
  error: string | null
}

export interface WorkflowRegistryState {
  workflows: Record<string, WorkflowMetadata>
  activeWorkflowId: string | null
  error: string | null
  deploymentStatuses: Record<string, DeploymentStatus>
  hydration: HydrationState
}

export interface WorkflowRegistryActions {
  beginMetadataLoad: (workspaceId: string) => void
  completeMetadataLoad: (workspaceId: string, workflows: WorkflowMetadata[]) => void
  failMetadataLoad: (workspaceId: string | null, error: string) => void
  setActiveWorkflow: (id: string) => Promise<void>
  loadWorkflowState: (workflowId: string) => Promise<void>
  switchToWorkspace: (id: string) => Promise<void>
  removeWorkflow: (id: string) => Promise<void>
  updateWorkflow: (id: string, metadata: Partial<WorkflowMetadata>) => Promise<void>
  duplicateWorkflow: (sourceId: string) => Promise<string | null>
  getWorkflowDeploymentStatus: (workflowId: string | null) => DeploymentStatus | null
  setDeploymentStatus: (
    workflowId: string | null,
    isDeployed: boolean,
    deployedAt?: Date,
    apiKey?: string
  ) => void
  setWorkflowNeedsRedeployment: (workflowId: string | null, needsRedeployment: boolean) => void
}

export type WorkflowRegistry = WorkflowRegistryState & WorkflowRegistryActions
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/stores/workflows/registry/utils.ts

```typescript
// Available workflow colors
export const WORKFLOW_COLORS = [
  // Blues - vibrant blue tones
  '#3972F6', // Blue (original)
  '#2E5BF5', // Deeper Blue
  '#1E4BF4', // Royal Blue
  '#0D3BF3', // Deep Royal Blue

  // Pinks/Magentas - vibrant pink and magenta tones
  '#F639DD', // Pink/Magenta (original)
  '#F529CF', // Deep Magenta
  '#F749E7', // Light Magenta
  '#F419C1', // Hot Pink

  // Oranges/Yellows - vibrant orange and yellow tones
  '#F6B539', // Orange/Yellow (original)
  '#F5A529', // Deep Orange
  '#F49519', // Burnt Orange
  '#F38509', // Deep Burnt Orange

  // Purples - vibrant purple tones
  '#8139F6', // Purple (original)
  '#7129F5', // Deep Purple
  '#6119F4', // Royal Purple
  '#5109F3', // Deep Royal Purple

  // Greens - vibrant green tones
  '#39B54A', // Green (original)
  '#29A53A', // Deep Green
  '#19952A', // Forest Green
  '#09851A', // Deep Forest Green

  // Teals/Cyans - vibrant teal and cyan tones
  '#39B5AB', // Teal (original)
  '#29A59B', // Deep Teal
  '#19958B', // Dark Teal
  '#09857B', // Deep Dark Teal

  // Reds/Red-Oranges - vibrant red and red-orange tones
  '#F66839', // Red/Orange (original)
  '#F55829', // Deep Red-Orange
  '#F44819', // Burnt Red
  '#F33809', // Deep Burnt Red

  // Additional vibrant colors for variety
  // Corals - warm coral tones
  '#F6397A', // Coral
  '#F5296A', // Deep Coral
  '#F7498A', // Light Coral

  // Crimsons - deep red tones
  '#DC143C', // Crimson
  '#CC042C', // Deep Crimson
  '#EC243C', // Light Crimson
  '#BC003C', // Dark Crimson
  '#FC343C', // Bright Crimson

  // Mint - fresh green tones
  '#00FF7F', // Mint Green
  '#00EF6F', // Deep Mint
  '#00DF5F', // Dark Mint

  // Slate - blue-gray tones
  '#6A5ACD', // Slate Blue
  '#5A4ABD', // Deep Slate
  '#4A3AAD', // Dark Slate

  // Amber - warm orange-yellow tones
  '#FFBF00', // Amber
  '#EFAF00', // Deep Amber
  '#DF9F00', // Dark Amber
]

// Generates a random color for a new workflow
export function getNextWorkflowColor(): string {
  // Simply return a random color from the available colors
  return WORKFLOW_COLORS[Math.floor(Math.random() * WORKFLOW_COLORS.length)]
}

// Adjectives and nouns for creative workflow names
const ADJECTIVES = [
  'Blazing',
  'Crystal',
  'Golden',
  'Silver',
  'Mystic',
  'Cosmic',
  'Electric',
  'Frozen',
  'Burning',
  'Shining',
  'Dancing',
  'Flying',
  'Roaring',
  'Whispering',
  'Glowing',
  'Sparkling',
  'Thunder',
  'Lightning',
  'Storm',
  'Ocean',
  'Mountain',
  'Forest',
  'Desert',
  'Arctic',
  'Tropical',
  'Midnight',
  'Dawn',
  'Sunset',
  'Rainbow',
  'Diamond',
  'Ruby',
  'Emerald',
  'Sapphire',
  'Pearl',
  'Jade',
  'Amber',
  'Coral',
  'Ivory',
  'Obsidian',
  'Marble',
  'Velvet',
  'Silk',
  'Satin',
  'Linen',
  'Cotton',
  'Wool',
  'Cashmere',
  'Denim',
  'Neon',
  'Pastel',
  'Vibrant',
  'Muted',
  'Bold',
  'Subtle',
  'Bright',
  'Dark',
  'Ancient',
  'Modern',
  'Eternal',
  'Swift',
  'Radiant',
  'Quantum',
  'Stellar',
  'Lunar',
  'Solar',
  'Celestial',
  'Ethereal',
  'Phantom',
  'Shadow',
  'Crimson',
  'Azure',
  'Violet',
  'Scarlet',
  'Magenta',
  'Turquoise',
  'Indigo',
  'Jade',
  'Noble',
  'Regal',
  'Imperial',
  'Royal',
  'Supreme',
  'Prime',
  'Elite',
  'Ultra',
  'Mega',
  'Hyper',
  'Super',
  'Neo',
  'Cyber',
  'Digital',
  'Virtual',
  'Sonic',
  'Atomic',
  'Nuclear',
  'Laser',
  'Plasma',
  'Magnetic',
]

const NOUNS = [
  'Phoenix',
  'Dragon',
  'Eagle',
  'Wolf',
  'Lion',
  'Tiger',
  'Panther',
  'Falcon',
  'Hawk',
  'Raven',
  'Swan',
  'Dove',
  'Butterfly',
  'Firefly',
  'Dragonfly',
  'Hummingbird',
  'Galaxy',
  'Nebula',
  'Comet',
  'Meteor',
  'Star',
  'Moon',
  'Sun',
  'Planet',
  'Asteroid',
  'Constellation',
  'Aurora',
  'Eclipse',
  'Solstice',
  'Equinox',
  'Horizon',
  'Zenith',
  'Castle',
  'Tower',
  'Bridge',
  'Garden',
  'Fountain',
  'Palace',
  'Temple',
  'Cathedral',
  'Lighthouse',
  'Windmill',
  'Waterfall',
  'Canyon',
  'Valley',
  'Peak',
  'Ridge',
  'Cliff',
  'Ocean',
  'River',
  'Lake',
  'Stream',
  'Pond',
  'Bay',
  'Cove',
  'Harbor',
  'Island',
  'Peninsula',
  'Archipelago',
  'Atoll',
  'Reef',
  'Lagoon',
  'Fjord',
  'Delta',
  'Cake',
  'Cookie',
  'Muffin',
  'Cupcake',
  'Pie',
  'Tart',
  'Brownie',
  'Donut',
  'Pancake',
  'Waffle',
  'Croissant',
  'Bagel',
  'Pretzel',
  'Biscuit',
  'Scone',
  'Crumpet',
  'Thunder',
  'Blizzard',
  'Tornado',
  'Hurricane',
  'Tsunami',
  'Volcano',
  'Glacier',
  'Avalanche',
  'Vortex',
  'Tempest',
  'Maelstrom',
  'Whirlwind',
  'Cyclone',
  'Typhoon',
  'Monsoon',
  'Anvil',
  'Hammer',
  'Forge',
  'Blade',
  'Sword',
  'Shield',
  'Arrow',
  'Spear',
  'Crown',
  'Throne',
  'Scepter',
  'Orb',
  'Gem',
  'Crystal',
  'Prism',
  'Spectrum',
  'Beacon',
  'Signal',
  'Pulse',
  'Wave',
  'Surge',
  'Tide',
  'Current',
  'Flow',
  'Circuit',
  'Node',
  'Core',
  'Matrix',
  'Network',
  'System',
  'Engine',
  'Reactor',
  'Generator',
  'Dynamo',
  'Catalyst',
  'Nexus',
  'Portal',
  'Gateway',
  'Passage',
  'Conduit',
  'Channel',
]

/**
 * Generates a creative workflow name using random adjectives and nouns
 * @returns A creative workflow name like "blazing-phoenix" or "crystal-dragon"
 */
export function generateCreativeWorkflowName(): string {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)]
  return `${adjective.toLowerCase()}-${noun.toLowerCase()}`
}
```

--------------------------------------------------------------------------------

````
