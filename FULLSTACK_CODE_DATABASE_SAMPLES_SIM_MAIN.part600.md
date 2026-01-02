---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 600
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 600 of 933)

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

---[FILE: utils.ts]---
Location: sim-main/apps/sim/lib/workflows/persistence/utils.ts

```typescript
import crypto from 'crypto'
import {
  db,
  webhook,
  workflow,
  workflowBlocks,
  workflowDeploymentVersion,
  workflowEdges,
  workflowSubflows,
} from '@sim/db'
import type { InferSelectModel } from 'drizzle-orm'
import { and, desc, eq, sql } from 'drizzle-orm'
import type { Edge } from 'reactflow'
import { v4 as uuidv4 } from 'uuid'
import { createLogger } from '@/lib/logs/console/logger'
import { sanitizeAgentToolsInBlocks } from '@/lib/workflows/sanitization/validation'
import type { BlockState, Loop, Parallel, WorkflowState } from '@/stores/workflows/workflow/types'
import { SUBFLOW_TYPES } from '@/stores/workflows/workflow/types'
import { generateLoopBlocks, generateParallelBlocks } from '@/stores/workflows/workflow/utils'

const logger = createLogger('WorkflowDBHelpers')

export type WorkflowDeploymentVersion = InferSelectModel<typeof workflowDeploymentVersion>

export interface WorkflowDeploymentVersionResponse {
  id: string
  version: number
  name?: string | null
  isActive: boolean
  createdAt: string
  createdBy?: string | null
  deployedBy?: string | null
}

export interface NormalizedWorkflowData {
  blocks: Record<string, BlockState>
  edges: Edge[]
  loops: Record<string, Loop>
  parallels: Record<string, Parallel>
  isFromNormalizedTables: boolean // Flag to indicate source (true = normalized tables, false = deployed state)
}

export interface DeployedWorkflowData extends NormalizedWorkflowData {
  deploymentVersionId: string
}

export async function blockExistsInDeployment(
  workflowId: string,
  blockId: string
): Promise<boolean> {
  try {
    const [result] = await db
      .select({ state: workflowDeploymentVersion.state })
      .from(workflowDeploymentVersion)
      .where(
        and(
          eq(workflowDeploymentVersion.workflowId, workflowId),
          eq(workflowDeploymentVersion.isActive, true)
        )
      )
      .limit(1)

    if (!result?.state) {
      return false
    }

    const state = result.state as WorkflowState
    return !!state.blocks?.[blockId]
  } catch (error) {
    logger.error(`Error checking block ${blockId} in deployment for workflow ${workflowId}:`, error)
    return false
  }
}

export async function loadDeployedWorkflowState(workflowId: string): Promise<DeployedWorkflowData> {
  try {
    const [active] = await db
      .select({
        id: workflowDeploymentVersion.id,
        state: workflowDeploymentVersion.state,
        createdAt: workflowDeploymentVersion.createdAt,
      })
      .from(workflowDeploymentVersion)
      .where(
        and(
          eq(workflowDeploymentVersion.workflowId, workflowId),
          eq(workflowDeploymentVersion.isActive, true)
        )
      )
      .orderBy(desc(workflowDeploymentVersion.createdAt))
      .limit(1)

    if (!active?.state) {
      throw new Error(`Workflow ${workflowId} has no active deployment`)
    }

    const state = active.state as WorkflowState

    return {
      blocks: state.blocks || {},
      edges: state.edges || [],
      loops: state.loops || {},
      parallels: state.parallels || {},
      isFromNormalizedTables: false,
      deploymentVersionId: active.id,
    }
  } catch (error) {
    logger.error(`Error loading deployed workflow state ${workflowId}:`, error)
    throw error
  }
}

/**
 * Migrates agent blocks from old format (systemPrompt/userPrompt) to new format (messages array)
 * This ensures backward compatibility for workflows created before the messages-input refactor.
 *
 * @param blocks - Record of block states to migrate
 * @returns Migrated blocks with messages array format for agent blocks
 */
export function migrateAgentBlocksToMessagesFormat(
  blocks: Record<string, BlockState>
): Record<string, BlockState> {
  return Object.fromEntries(
    Object.entries(blocks).map(([id, block]) => {
      if (block.type === 'agent') {
        const systemPrompt = block.subBlocks.systemPrompt?.value
        const userPrompt = block.subBlocks.userPrompt?.value
        const messages = block.subBlocks.messages?.value

        // Only migrate if old format exists and new format doesn't
        if ((systemPrompt || userPrompt) && !messages) {
          const newMessages: Array<{ role: string; content: string }> = []

          // Add system message first (industry standard)
          if (systemPrompt) {
            newMessages.push({
              role: 'system',
              content: typeof systemPrompt === 'string' ? systemPrompt : String(systemPrompt),
            })
          }

          // Add user message
          if (userPrompt) {
            let userContent = userPrompt

            // Handle object format (e.g., { input: "..." })
            if (typeof userContent === 'object' && userContent !== null) {
              if ('input' in userContent) {
                userContent = (userContent as any).input
              } else {
                // If it's an object but doesn't have 'input', stringify it
                userContent = JSON.stringify(userContent)
              }
            }

            newMessages.push({
              role: 'user',
              content: String(userContent),
            })
          }

          // Return block with migrated messages subBlock
          return [
            id,
            {
              ...block,
              subBlocks: {
                ...block.subBlocks,
                messages: {
                  id: 'messages',
                  type: 'messages-input',
                  value: newMessages,
                },
              },
            },
          ]
        }
      }
      return [id, block]
    })
  )
}

/**
 * Load workflow state from normalized tables
 * Returns null if no data found (fallback to JSON blob)
 */
export async function loadWorkflowFromNormalizedTables(
  workflowId: string
): Promise<NormalizedWorkflowData | null> {
  try {
    // Load all components in parallel
    const [blocks, edges, subflows] = await Promise.all([
      db.select().from(workflowBlocks).where(eq(workflowBlocks.workflowId, workflowId)),
      db.select().from(workflowEdges).where(eq(workflowEdges.workflowId, workflowId)),
      db.select().from(workflowSubflows).where(eq(workflowSubflows.workflowId, workflowId)),
    ])

    // If no blocks found, assume this workflow hasn't been migrated yet
    if (blocks.length === 0) {
      return null
    }

    // Convert blocks to the expected format
    const blocksMap: Record<string, BlockState> = {}
    blocks.forEach((block) => {
      const blockData = block.data || {}

      const assembled: BlockState = {
        id: block.id,
        type: block.type,
        name: block.name,
        position: {
          x: Number(block.positionX),
          y: Number(block.positionY),
        },
        enabled: block.enabled,
        horizontalHandles: block.horizontalHandles,
        advancedMode: block.advancedMode,
        triggerMode: block.triggerMode,
        height: Number(block.height),
        subBlocks: (block.subBlocks as BlockState['subBlocks']) || {},
        outputs: (block.outputs as BlockState['outputs']) || {},
        data: blockData,
      }

      blocksMap[block.id] = assembled
    })

    // Sanitize any invalid custom tools in agent blocks to prevent client crashes
    const { blocks: sanitizedBlocks } = sanitizeAgentToolsInBlocks(blocksMap)

    // Migrate old agent block format (systemPrompt/userPrompt) to new messages array format
    // This ensures backward compatibility for workflows created before the messages-input refactor
    const migratedBlocks = migrateAgentBlocksToMessagesFormat(sanitizedBlocks)

    // Convert edges to the expected format
    const edgesArray: Edge[] = edges.map((edge) => ({
      id: edge.id,
      source: edge.sourceBlockId,
      target: edge.targetBlockId,
      sourceHandle: edge.sourceHandle ?? undefined,
      targetHandle: edge.targetHandle ?? undefined,
      type: 'default',
      data: {},
    }))

    // Convert subflows to loops and parallels
    const loops: Record<string, Loop> = {}
    const parallels: Record<string, Parallel> = {}

    subflows.forEach((subflow) => {
      const config = (subflow.config ?? {}) as Partial<Loop & Parallel>

      if (subflow.type === SUBFLOW_TYPES.LOOP) {
        const loopType =
          (config as Loop).loopType === 'for' ||
          (config as Loop).loopType === 'forEach' ||
          (config as Loop).loopType === 'while' ||
          (config as Loop).loopType === 'doWhile'
            ? (config as Loop).loopType
            : 'for'

        const loop: Loop = {
          id: subflow.id,
          nodes: Array.isArray((config as Loop).nodes) ? (config as Loop).nodes : [],
          iterations:
            typeof (config as Loop).iterations === 'number' ? (config as Loop).iterations : 1,
          loopType,
          forEachItems: (config as Loop).forEachItems ?? '',
          whileCondition: (config as Loop).whileCondition ?? '',
          doWhileCondition: (config as Loop).doWhileCondition ?? '',
        }
        loops[subflow.id] = loop

        // Sync block.data with loop config to ensure all fields are present
        // This allows switching between loop types without losing data
        if (migratedBlocks[subflow.id]) {
          const block = migratedBlocks[subflow.id]
          migratedBlocks[subflow.id] = {
            ...block,
            data: {
              ...block.data,
              collection: loop.forEachItems ?? block.data?.collection ?? '',
              whileCondition: loop.whileCondition ?? block.data?.whileCondition ?? '',
              doWhileCondition: loop.doWhileCondition ?? block.data?.doWhileCondition ?? '',
            },
          }
        }
      } else if (subflow.type === SUBFLOW_TYPES.PARALLEL) {
        const parallel: Parallel = {
          id: subflow.id,
          nodes: Array.isArray((config as Parallel).nodes) ? (config as Parallel).nodes : [],
          count: typeof (config as Parallel).count === 'number' ? (config as Parallel).count : 5,
          distribution: (config as Parallel).distribution ?? '',
          parallelType:
            (config as Parallel).parallelType === 'count' ||
            (config as Parallel).parallelType === 'collection'
              ? (config as Parallel).parallelType
              : 'count',
        }
        parallels[subflow.id] = parallel
      } else {
        logger.warn(`Unknown subflow type: ${subflow.type} for subflow ${subflow.id}`)
      }
    })

    return {
      blocks: migratedBlocks,
      edges: edgesArray,
      loops,
      parallels,
      isFromNormalizedTables: true,
    }
  } catch (error) {
    logger.error(`Error loading workflow ${workflowId} from normalized tables:`, error)
    return null
  }
}

/**
 * Save workflow state to normalized tables
 */
export async function saveWorkflowToNormalizedTables(
  workflowId: string,
  state: WorkflowState
): Promise<{ success: boolean; error?: string }> {
  try {
    const blockRecords = state.blocks as Record<string, BlockState>
    const canonicalLoops = generateLoopBlocks(blockRecords)
    const canonicalParallels = generateParallelBlocks(blockRecords)

    // Start a transaction
    await db.transaction(async (tx) => {
      // Snapshot existing webhooks before deletion to preserve them through the cycle
      let existingWebhooks: any[] = []
      try {
        existingWebhooks = await tx.select().from(webhook).where(eq(webhook.workflowId, workflowId))
      } catch (webhookError) {
        // Webhook table might not be available in test environments
        logger.debug('Could not load webhooks before save, skipping preservation', {
          error: webhookError instanceof Error ? webhookError.message : String(webhookError),
        })
      }

      // Clear existing data for this workflow
      await Promise.all([
        tx.delete(workflowBlocks).where(eq(workflowBlocks.workflowId, workflowId)),
        tx.delete(workflowEdges).where(eq(workflowEdges.workflowId, workflowId)),
        tx.delete(workflowSubflows).where(eq(workflowSubflows.workflowId, workflowId)),
      ])

      // Insert blocks
      if (Object.keys(state.blocks).length > 0) {
        const blockInserts = Object.values(state.blocks).map((block) => ({
          id: block.id,
          workflowId: workflowId,
          type: block.type,
          name: block.name || '',
          positionX: String(block.position?.x || 0),
          positionY: String(block.position?.y || 0),
          enabled: block.enabled ?? true,
          horizontalHandles: block.horizontalHandles ?? true,
          advancedMode: block.advancedMode ?? false,
          triggerMode: block.triggerMode ?? false,
          height: String(block.height || 0),
          subBlocks: block.subBlocks || {},
          outputs: block.outputs || {},
          data: block.data || {},
          parentId: block.data?.parentId || null,
          extent: block.data?.extent || null,
        }))

        await tx.insert(workflowBlocks).values(blockInserts)
      }

      // Insert edges
      if (state.edges.length > 0) {
        const edgeInserts = state.edges.map((edge) => ({
          id: edge.id,
          workflowId: workflowId,
          sourceBlockId: edge.source,
          targetBlockId: edge.target,
          sourceHandle: edge.sourceHandle || null,
          targetHandle: edge.targetHandle || null,
        }))

        await tx.insert(workflowEdges).values(edgeInserts)
      }

      // Insert subflows (loops and parallels)
      const subflowInserts: any[] = []

      // Add loops
      Object.values(canonicalLoops).forEach((loop) => {
        subflowInserts.push({
          id: loop.id,
          workflowId: workflowId,
          type: SUBFLOW_TYPES.LOOP,
          config: loop,
        })
      })

      // Add parallels
      Object.values(canonicalParallels).forEach((parallel) => {
        subflowInserts.push({
          id: parallel.id,
          workflowId: workflowId,
          type: SUBFLOW_TYPES.PARALLEL,
          config: parallel,
        })
      })

      if (subflowInserts.length > 0) {
        await tx.insert(workflowSubflows).values(subflowInserts)
      }

      // Re-insert preserved webhooks if any exist and their blocks still exist
      if (existingWebhooks.length > 0) {
        try {
          const webhookInserts = existingWebhooks
            .filter((wh) => !!state.blocks?.[wh.blockId ?? ''])
            .map((wh) => ({
              id: wh.id,
              workflowId: wh.workflowId,
              blockId: wh.blockId,
              path: wh.path,
              provider: wh.provider,
              providerConfig: wh.providerConfig,
              isActive: wh.isActive,
              createdAt: wh.createdAt,
              updatedAt: new Date(),
            }))

          if (webhookInserts.length > 0) {
            await tx.insert(webhook).values(webhookInserts)
            logger.debug(`Preserved ${webhookInserts.length} webhook(s) through workflow save`, {
              workflowId,
            })
          }
        } catch (webhookInsertError) {
          // Webhook preservation is optional - don't fail the entire save if it errors
          logger.warn('Could not preserve webhooks during save', {
            error:
              webhookInsertError instanceof Error
                ? webhookInsertError.message
                : String(webhookInsertError),
            workflowId,
          })
        }
      }
    })

    return { success: true }
  } catch (error) {
    logger.error(`Error saving workflow ${workflowId} to normalized tables:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Check if a workflow exists in normalized tables
 */
export async function workflowExistsInNormalizedTables(workflowId: string): Promise<boolean> {
  try {
    const blocks = await db
      .select({ id: workflowBlocks.id })
      .from(workflowBlocks)
      .where(eq(workflowBlocks.workflowId, workflowId))
      .limit(1)

    return blocks.length > 0
  } catch (error) {
    logger.error(`Error checking if workflow ${workflowId} exists in normalized tables:`, error)
    return false
  }
}

/**
 * Deploy a workflow by creating a new deployment version
 */
export async function deployWorkflow(params: {
  workflowId: string
  deployedBy: string // User ID of the person deploying
  workflowName?: string
}): Promise<{
  success: boolean
  version?: number
  deployedAt?: Date
  currentState?: any
  error?: string
}> {
  const { workflowId, deployedBy, workflowName } = params

  try {
    const normalizedData = await loadWorkflowFromNormalizedTables(workflowId)
    if (!normalizedData) {
      return { success: false, error: 'Failed to load workflow state' }
    }

    // Also fetch workflow variables
    const [workflowRecord] = await db
      .select({ variables: workflow.variables })
      .from(workflow)
      .where(eq(workflow.id, workflowId))
      .limit(1)

    const currentState = {
      blocks: normalizedData.blocks,
      edges: normalizedData.edges,
      loops: normalizedData.loops,
      parallels: normalizedData.parallels,
      variables: workflowRecord?.variables || undefined,
      lastSaved: Date.now(),
    }

    const now = new Date()

    const deployedVersion = await db.transaction(async (tx) => {
      // Get next version number
      const [{ maxVersion }] = await tx
        .select({ maxVersion: sql`COALESCE(MAX("version"), 0)` })
        .from(workflowDeploymentVersion)
        .where(eq(workflowDeploymentVersion.workflowId, workflowId))

      const nextVersion = Number(maxVersion) + 1

      // Deactivate all existing versions
      await tx
        .update(workflowDeploymentVersion)
        .set({ isActive: false })
        .where(eq(workflowDeploymentVersion.workflowId, workflowId))

      // Create new deployment version
      await tx.insert(workflowDeploymentVersion).values({
        id: uuidv4(),
        workflowId,
        version: nextVersion,
        state: currentState,
        isActive: true,
        createdBy: deployedBy,
        createdAt: now,
      })

      // Update workflow to deployed
      const updateData: Record<string, unknown> = {
        isDeployed: true,
        deployedAt: now,
      }

      await tx.update(workflow).set(updateData).where(eq(workflow.id, workflowId))

      // Note: Templates are NOT automatically updated on deployment
      // Template updates must be done explicitly through the "Update Template" button

      return nextVersion
    })

    logger.info(`Deployed workflow ${workflowId} as v${deployedVersion}`)

    // Track deployment telemetry if workflow name is provided
    if (workflowName) {
      try {
        const { trackPlatformEvent } = await import('@/lib/core/telemetry')

        const blockTypeCounts: Record<string, number> = {}
        for (const block of Object.values(currentState.blocks)) {
          const blockType = (block as any).type || 'unknown'
          blockTypeCounts[blockType] = (blockTypeCounts[blockType] || 0) + 1
        }

        trackPlatformEvent('platform.workflow.deployed', {
          'workflow.id': workflowId,
          'workflow.name': workflowName,
          'workflow.blocks_count': Object.keys(currentState.blocks).length,
          'workflow.edges_count': currentState.edges.length,
          'workflow.loops_count': Object.keys(currentState.loops).length,
          'workflow.parallels_count': Object.keys(currentState.parallels).length,
          'workflow.block_types': JSON.stringify(blockTypeCounts),
          'deployment.version': deployedVersion,
        })
      } catch (telemetryError) {
        logger.warn(`Failed to track deployment telemetry for ${workflowId}`, telemetryError)
      }
    }

    return {
      success: true,
      version: deployedVersion,
      deployedAt: now,
      currentState,
    }
  } catch (error) {
    logger.error(`Error deploying workflow ${workflowId}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Regenerates all IDs in a workflow state to avoid conflicts when duplicating or using templates
 * Returns a new state with all IDs regenerated and references updated
 */
export function regenerateWorkflowStateIds(state: any): any {
  // Create ID mappings
  const blockIdMapping = new Map<string, string>()
  const edgeIdMapping = new Map<string, string>()
  const loopIdMapping = new Map<string, string>()
  const parallelIdMapping = new Map<string, string>()

  // First pass: Create all ID mappings
  // Map block IDs
  Object.keys(state.blocks || {}).forEach((oldId) => {
    blockIdMapping.set(oldId, crypto.randomUUID())
  })

  // Map edge IDs

  ;(state.edges || []).forEach((edge: any) => {
    edgeIdMapping.set(edge.id, crypto.randomUUID())
  })

  // Map loop IDs
  Object.keys(state.loops || {}).forEach((oldId) => {
    loopIdMapping.set(oldId, crypto.randomUUID())
  })

  // Map parallel IDs
  Object.keys(state.parallels || {}).forEach((oldId) => {
    parallelIdMapping.set(oldId, crypto.randomUUID())
  })

  // Second pass: Create new state with regenerated IDs and updated references
  const newBlocks: Record<string, any> = {}
  const newEdges: any[] = []
  const newLoops: Record<string, any> = {}
  const newParallels: Record<string, any> = {}

  // Regenerate blocks with updated references
  Object.entries(state.blocks || {}).forEach(([oldId, block]: [string, any]) => {
    const newId = blockIdMapping.get(oldId)!
    const newBlock = { ...block, id: newId }

    // Update parentId reference if it exists
    if (newBlock.data?.parentId) {
      const newParentId = blockIdMapping.get(newBlock.data.parentId)
      if (newParentId) {
        newBlock.data.parentId = newParentId
      }
    }

    // Update any block references in subBlocks
    if (newBlock.subBlocks) {
      const updatedSubBlocks: Record<string, any> = {}
      Object.entries(newBlock.subBlocks).forEach(([subId, subBlock]: [string, any]) => {
        const updatedSubBlock = { ...subBlock }

        // If subblock value contains block references, update them
        if (
          typeof updatedSubBlock.value === 'string' &&
          blockIdMapping.has(updatedSubBlock.value)
        ) {
          updatedSubBlock.value = blockIdMapping.get(updatedSubBlock.value)
        }

        updatedSubBlocks[subId] = updatedSubBlock
      })
      newBlock.subBlocks = updatedSubBlocks
    }

    newBlocks[newId] = newBlock
  })

  // Regenerate edges with updated source/target references

  ;(state.edges || []).forEach((edge: any) => {
    const newId = edgeIdMapping.get(edge.id)!
    const newSource = blockIdMapping.get(edge.source) || edge.source
    const newTarget = blockIdMapping.get(edge.target) || edge.target

    newEdges.push({
      ...edge,
      id: newId,
      source: newSource,
      target: newTarget,
    })
  })

  // Regenerate loops with updated node references
  Object.entries(state.loops || {}).forEach(([oldId, loop]: [string, any]) => {
    const newId = loopIdMapping.get(oldId)!
    const newLoop = { ...loop, id: newId }

    // Update nodes array with new block IDs
    if (newLoop.nodes) {
      newLoop.nodes = newLoop.nodes.map((nodeId: string) => blockIdMapping.get(nodeId) || nodeId)
    }

    newLoops[newId] = newLoop
  })

  // Regenerate parallels with updated node references
  Object.entries(state.parallels || {}).forEach(([oldId, parallel]: [string, any]) => {
    const newId = parallelIdMapping.get(oldId)!
    const newParallel = { ...parallel, id: newId }

    // Update nodes array with new block IDs
    if (newParallel.nodes) {
      newParallel.nodes = newParallel.nodes.map(
        (nodeId: string) => blockIdMapping.get(nodeId) || nodeId
      )
    }

    newParallels[newId] = newParallel
  })

  return {
    blocks: newBlocks,
    edges: newEdges,
    loops: newLoops,
    parallels: newParallels,
    lastSaved: state.lastSaved || Date.now(),
    ...(state.variables && { variables: state.variables }),
    ...(state.metadata && { metadata: state.metadata }),
  }
}
```

--------------------------------------------------------------------------------

---[FILE: json-sanitizer.ts]---
Location: sim-main/apps/sim/lib/workflows/sanitization/json-sanitizer.ts

```typescript
import type { Edge } from 'reactflow'
import { sanitizeWorkflowForSharing } from '@/lib/workflows/credentials/credential-extractor'
import type { BlockState, Loop, Parallel, WorkflowState } from '@/stores/workflows/workflow/types'
import { generateLoopBlocks, generateParallelBlocks } from '@/stores/workflows/workflow/utils'

/**
 * Sanitized workflow state for copilot (removes all UI-specific data)
 * Connections are embedded in blocks for consistency with operations format
 * Loops and parallels use nested structure - no separate loops/parallels objects
 */
export interface CopilotWorkflowState {
  blocks: Record<string, CopilotBlockState>
}

/**
 * Block state for copilot (no positions, no UI dimensions, no redundant IDs)
 * Connections are embedded here instead of separate edges array
 * Loops and parallels have nested structure for clarity
 */
export interface CopilotBlockState {
  type: string
  name: string
  inputs?: Record<string, string | number | string[][] | object>
  connections?: Record<string, string | string[]>
  nestedNodes?: Record<string, CopilotBlockState>
  enabled: boolean
  advancedMode?: boolean
  triggerMode?: boolean
}

/**
 * Edge state for copilot (only semantic connection data)
 */
export interface CopilotEdge {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
}

/**
 * Export workflow state (includes positions but removes secrets)
 */
export interface ExportWorkflowState {
  version: string
  exportedAt: string
  state: {
    blocks: Record<string, BlockState>
    edges: Edge[]
    loops: Record<string, Loop>
    parallels: Record<string, Parallel>
    metadata?: {
      name?: string
      description?: string
      exportedAt?: string
    }
    variables?: Array<{
      id: string
      name: string
      type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'plain'
      value: any
    }>
  }
}

/**
 * Sanitize condition blocks by removing UI-specific metadata
 * Returns cleaned JSON string (not parsed array)
 */
function sanitizeConditions(conditionsJson: string): string {
  try {
    const conditions = JSON.parse(conditionsJson)
    if (!Array.isArray(conditions)) return conditionsJson

    // Keep only id, title, and value - remove UI state
    const cleaned = conditions.map((cond: any) => ({
      id: cond.id,
      title: cond.title,
      value: cond.value || '',
    }))

    return JSON.stringify(cleaned)
  } catch {
    return conditionsJson
  }
}

/**
 * Sanitize tools array by removing UI state and redundant fields
 */
function sanitizeTools(tools: any[]): any[] {
  return tools.map((tool) => {
    if (tool.type === 'custom-tool') {
      // New reference format: minimal fields only
      if (tool.customToolId && !tool.schema && !tool.code) {
        return {
          type: tool.type,
          customToolId: tool.customToolId,
          usageControl: tool.usageControl,
        }
      }

      // Legacy inline format: include all fields
      const sanitized: any = {
        type: tool.type,
        title: tool.title,
        toolId: tool.toolId,
        usageControl: tool.usageControl,
      }

      // Include schema for inline format (legacy format)
      if (tool.schema?.function) {
        sanitized.schema = {
          type: tool.schema.type || 'function',
          function: {
            name: tool.schema.function.name,
            description: tool.schema.function.description,
            parameters: tool.schema.function.parameters,
          },
        }
      }

      // Include code for inline format (legacy format)
      if (tool.code) {
        sanitized.code = tool.code
      }

      return sanitized
    }

    const { isExpanded, ...cleanTool } = tool
    return cleanTool
  })
}

/**
 * Sort object keys recursively for consistent comparison
 */
function sortKeysRecursively(item: any): any {
  if (Array.isArray(item)) {
    return item.map(sortKeysRecursively)
  }
  if (item !== null && typeof item === 'object') {
    return Object.keys(item)
      .sort()
      .reduce((result: any, key: string) => {
        result[key] = sortKeysRecursively(item[key])
        return result
      }, {})
  }
  return item
}

/**
 * Sanitize subblocks by removing null values and simplifying structure
 * Maps each subblock key directly to its value instead of the full object
 */
function sanitizeSubBlocks(
  subBlocks: BlockState['subBlocks']
): Record<string, string | number | string[][] | object> {
  const sanitized: Record<string, string | number | string[][] | object> = {}

  Object.entries(subBlocks).forEach(([key, subBlock]) => {
    // Skip null/undefined values
    if (subBlock.value === null || subBlock.value === undefined) {
      return
    }

    // Normalize responseFormat for consistent key ordering (important for training data)
    if (key === 'responseFormat') {
      try {
        let obj = subBlock.value

        // Parse JSON string if needed
        if (typeof subBlock.value === 'string') {
          const trimmed = subBlock.value.trim()
          if (!trimmed) {
            return
          }
          obj = JSON.parse(trimmed)
        }

        // Sort keys for consistent comparison
        if (obj && typeof obj === 'object') {
          sanitized[key] = sortKeysRecursively(obj)
          return
        }
      } catch {
        // Invalid JSON - pass through as-is
        sanitized[key] = subBlock.value
        return
      }
    }

    // Special handling for condition-input type - clean UI metadata
    if (subBlock.type === 'condition-input' && typeof subBlock.value === 'string') {
      const cleanedConditions: string = sanitizeConditions(subBlock.value)
      sanitized[key] = cleanedConditions
      return
    }

    if (key === 'tools' && Array.isArray(subBlock.value)) {
      sanitized[key] = sanitizeTools(subBlock.value)
      return
    }

    // Skip knowledge base tag filters and document tags (workspace-specific data)
    if (key === 'tagFilters' || key === 'documentTags') {
      return
    }

    sanitized[key] = subBlock.value
  })

  return sanitized
}

/**
 * Extract connections for a block from edges and format as operations-style connections
 */
function extractConnectionsForBlock(
  blockId: string,
  edges: WorkflowState['edges']
): Record<string, string | string[]> | undefined {
  const connections: Record<string, string[]> = {}

  // Find all outgoing edges from this block
  const outgoingEdges = edges.filter((edge) => edge.source === blockId)

  if (outgoingEdges.length === 0) {
    return undefined
  }

  // Group by source handle
  for (const edge of outgoingEdges) {
    const handle = edge.sourceHandle || 'source'

    if (!connections[handle]) {
      connections[handle] = []
    }

    connections[handle].push(edge.target)
  }

  // Simplify single-element arrays to just the string
  const simplified: Record<string, string | string[]> = {}
  for (const [handle, targets] of Object.entries(connections)) {
    simplified[handle] = targets.length === 1 ? targets[0] : targets
  }

  return simplified
}

/**
 * Sanitize workflow state for copilot by removing all UI-specific data
 * Creates nested structure for loops/parallels with their child blocks inside
 */
export function sanitizeForCopilot(state: WorkflowState): CopilotWorkflowState {
  const sanitizedBlocks: Record<string, CopilotBlockState> = {}
  const processedBlocks = new Set<string>()

  // Helper to find child blocks of a parent (loop/parallel container)
  const findChildBlocks = (parentId: string): string[] => {
    return Object.keys(state.blocks).filter(
      (blockId) => state.blocks[blockId].data?.parentId === parentId
    )
  }

  // Helper to recursively sanitize a block and its children
  const sanitizeBlock = (blockId: string, block: BlockState): CopilotBlockState => {
    const connections = extractConnectionsForBlock(blockId, state.edges)

    // For loop/parallel blocks, extract config from block.data instead of subBlocks
    let inputs: Record<string, string | number | string[][] | object>

    if (block.type === 'loop' || block.type === 'parallel') {
      // Extract configuration from block.data (only include type-appropriate fields)
      const loopInputs: Record<string, string | number | string[][] | object> = {}

      if (block.type === 'loop') {
        const loopType = block.data?.loopType || 'for'
        loopInputs.loopType = loopType
        // Only export fields relevant to the current loopType
        if (loopType === 'for' && block.data?.count !== undefined) {
          loopInputs.iterations = block.data.count
        }
        if (loopType === 'forEach' && block.data?.collection !== undefined) {
          loopInputs.collection = block.data.collection
        }
        if (loopType === 'while' && block.data?.whileCondition !== undefined) {
          loopInputs.condition = block.data.whileCondition
        }
        if (loopType === 'doWhile' && block.data?.doWhileCondition !== undefined) {
          loopInputs.condition = block.data.doWhileCondition
        }
      } else if (block.type === 'parallel') {
        const parallelType = block.data?.parallelType || 'count'
        loopInputs.parallelType = parallelType
        // Only export fields relevant to the current parallelType
        if (parallelType === 'count' && block.data?.count !== undefined) {
          loopInputs.iterations = block.data.count
        }
        if (parallelType === 'collection' && block.data?.collection !== undefined) {
          loopInputs.collection = block.data.collection
        }
      }

      inputs = loopInputs
    } else {
      // For regular blocks, sanitize subBlocks
      inputs = sanitizeSubBlocks(block.subBlocks)
    }

    // Check if this is a loop or parallel (has children)
    const childBlockIds = findChildBlocks(blockId)
    const nestedNodes: Record<string, CopilotBlockState> = {}

    if (childBlockIds.length > 0) {
      // Recursively sanitize child blocks
      childBlockIds.forEach((childId) => {
        const childBlock = state.blocks[childId]
        if (childBlock) {
          nestedNodes[childId] = sanitizeBlock(childId, childBlock)
          processedBlocks.add(childId)
        }
      })
    }

    // Create clean result without runtime data (outputs, positions, layout, etc.)
    const result: CopilotBlockState = {
      type: block.type,
      name: block.name,
      enabled: block.enabled,
    }

    if (Object.keys(inputs).length > 0) result.inputs = inputs
    if (connections) result.connections = connections
    if (Object.keys(nestedNodes).length > 0) result.nestedNodes = nestedNodes
    if (block.advancedMode !== undefined) result.advancedMode = block.advancedMode
    if (block.triggerMode !== undefined) result.triggerMode = block.triggerMode

    // Note: outputs, position, height, layout, horizontalHandles are intentionally excluded
    // These are runtime/UI-specific fields not needed for copilot understanding

    return result
  }

  // Process only root-level blocks (those without a parent)
  Object.entries(state.blocks).forEach(([blockId, block]) => {
    // Skip if already processed as a child
    if (processedBlocks.has(blockId)) return

    // Skip if it has a parent (it will be processed as nested)
    if (block.data?.parentId) return

    sanitizedBlocks[blockId] = sanitizeBlock(blockId, block)
  })

  return {
    blocks: sanitizedBlocks,
  }
}

/**
 * Sanitize workflow state for export by removing secrets but keeping positions
 * Users need positions to restore the visual layout when importing
 */
export function sanitizeForExport(state: WorkflowState): ExportWorkflowState {
  const canonicalLoops = generateLoopBlocks(state.blocks || {})
  const canonicalParallels = generateParallelBlocks(state.blocks || {})

  // Preserve edges, loops, parallels, metadata, and variables
  const fullState = {
    blocks: state.blocks,
    edges: state.edges,
    loops: canonicalLoops,
    parallels: canonicalParallels,
    metadata: state.metadata,
    variables: state.variables,
  }

  // Use unified sanitization with env var preservation for export
  const sanitizedState = sanitizeWorkflowForSharing(fullState, {
    preserveEnvVars: true, // Keep {{ENV_VAR}} references in exported workflows
  })

  return {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    state: sanitizedState,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: references.test.ts]---
Location: sim-main/apps/sim/lib/workflows/sanitization/references.test.ts

```typescript
import { describe, expect, it } from 'vitest'
import {
  isLikelyReferenceSegment,
  splitReferenceSegment,
} from '@/lib/workflows/sanitization/references'

describe('splitReferenceSegment', () => {
  it('should return leading and reference for simple segments', () => {
    const result = splitReferenceSegment('<block.output>')
    expect(result).toEqual({
      leading: '',
      reference: '<block.output>',
    })
  })

  it('should separate comparator prefixes from reference', () => {
    const result = splitReferenceSegment('< <block2.output>')
    expect(result).toEqual({
      leading: '< ',
      reference: '<block2.output>',
    })
  })

  it('should handle <= comparator prefixes', () => {
    const result = splitReferenceSegment('<= <block2.output>')
    expect(result).toEqual({
      leading: '<= ',
      reference: '<block2.output>',
    })
  })
})

describe('isLikelyReferenceSegment', () => {
  it('should return true for regular references', () => {
    expect(isLikelyReferenceSegment('<block.output>')).toBe(true)
  })

  it('should return true for references after comparator', () => {
    expect(isLikelyReferenceSegment('< <block2.output>')).toBe(true)
    expect(isLikelyReferenceSegment('<= <block2.output>')).toBe(true)
  })

  it('should return false when leading content is not comparator characters', () => {
    expect(isLikelyReferenceSegment('<foo<bar>')).toBe(false)
  })
})
```

--------------------------------------------------------------------------------

````
