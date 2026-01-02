---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 604
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 604 of 933)

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

---[FILE: compute-edit-sequence.ts]---
Location: sim-main/apps/sim/lib/workflows/training/compute-edit-sequence.ts

```typescript
import type { CopilotWorkflowState } from '@/lib/workflows/sanitization/json-sanitizer'
import { TRIGGER_RUNTIME_SUBBLOCK_IDS } from '@/triggers/constants'

export interface EditOperation {
  operation_type: 'add' | 'edit' | 'delete' | 'insert_into_subflow' | 'extract_from_subflow'
  block_id: string
  params?: {
    type?: string
    name?: string
    outputs?: Record<string, any>
    enabled?: boolean
    triggerMode?: boolean
    advancedMode?: boolean
    inputs?: Record<string, any>
    connections?: Record<string, any>
    nestedNodes?: Record<string, any>
    subflowId?: string
  }
}

export interface WorkflowDiff {
  operations: EditOperation[]
  summary: {
    blocksAdded: number
    blocksModified: number
    blocksDeleted: number
    edgesChanged: number
    subflowsChanged: number
  }
}

/**
 * Flatten nested blocks into a single-level map for comparison
 * Returns map of blockId -> {block, parentId}
 */
function flattenBlocks(
  blocks: Record<string, any>
): Record<string, { block: any; parentId?: string }> {
  const flattened: Record<string, { block: any; parentId?: string }> = {}

  const processBlock = (blockId: string, block: any, parentId?: string) => {
    flattened[blockId] = { block, parentId }

    // Recursively process nested nodes
    if (block.nestedNodes) {
      Object.entries(block.nestedNodes).forEach(([nestedId, nestedBlock]) => {
        processBlock(nestedId, nestedBlock, blockId)
      })
    }
  }

  Object.entries(blocks).forEach(([blockId, block]) => {
    processBlock(blockId, block)
  })

  return flattened
}

/**
 * Extract all edges from blocks with embedded connections (including nested)
 */
function extractAllEdgesFromBlocks(blocks: Record<string, any>): Array<{
  source: string
  target: string
  sourceHandle?: string | null
  targetHandle?: string | null
}> {
  const edges: Array<{
    source: string
    target: string
    sourceHandle?: string | null
    targetHandle?: string | null
  }> = []

  const processBlockConnections = (block: any, blockId: string) => {
    if (block.connections) {
      Object.entries(block.connections).forEach(([sourceHandle, targets]) => {
        const targetArray = Array.isArray(targets) ? targets : [targets]
        targetArray.forEach((target: string) => {
          edges.push({
            source: blockId,
            target,
            sourceHandle,
            targetHandle: 'target',
          })
        })
      })
    }

    // Process nested nodes
    if (block.nestedNodes) {
      Object.entries(block.nestedNodes).forEach(([nestedId, nestedBlock]) => {
        processBlockConnections(nestedBlock, nestedId)
      })
    }
  }

  Object.entries(blocks).forEach(([blockId, block]) => {
    processBlockConnections(block, blockId)
  })

  return edges
}

/**
 * Compute the edit sequence (operations) needed to transform startState into endState
 * This analyzes the differences and generates operations that can recreate the changes
 * Works with sanitized CopilotWorkflowState (no positions, only semantic data)
 */
export function computeEditSequence(
  startState: CopilotWorkflowState,
  endState: CopilotWorkflowState
): WorkflowDiff {
  const operations: EditOperation[] = []

  const startBlocks = startState.blocks || {}
  const endBlocks = endState.blocks || {}

  // Flatten nested blocks for comparison (includes nested nodes at top level)
  const startFlattened = flattenBlocks(startBlocks)
  const endFlattened = flattenBlocks(endBlocks)

  // Extract edges from connections for tracking
  const startEdges = extractAllEdgesFromBlocks(startBlocks)
  const endEdges = extractAllEdgesFromBlocks(endBlocks)

  // Track statistics
  let blocksAdded = 0
  let blocksModified = 0
  let blocksDeleted = 0
  let edgesChanged = 0
  let subflowsChanged = 0

  // Track which blocks are being deleted (including subflows)
  const deletedBlocks = new Set<string>()
  for (const blockId in startFlattened) {
    if (!(blockId in endFlattened)) {
      deletedBlocks.add(blockId)
    }
  }

  // 1. Find deleted blocks (exist in start but not in end)
  for (const blockId in startFlattened) {
    if (!(blockId in endFlattened)) {
      const { parentId } = startFlattened[blockId]

      // Skip if parent is also being deleted (cascade delete is implicit)
      if (parentId && deletedBlocks.has(parentId)) {
        continue
      }

      if (parentId) {
        // Block was inside a subflow and was removed (but subflow still exists)
        operations.push({
          operation_type: 'extract_from_subflow',
          block_id: blockId,
          params: {
            subflowId: parentId,
          },
        })
        subflowsChanged++
      } else {
        // Regular block deletion
        operations.push({
          operation_type: 'delete',
          block_id: blockId,
        })
        blocksDeleted++
      }
    }
  }

  // 2. Find added blocks (exist in end but not in start)
  for (const blockId in endFlattened) {
    if (!(blockId in startFlattened)) {
      const { block, parentId } = endFlattened[blockId]
      if (parentId) {
        // Check if this block will be included in parent's nestedNodes
        const parentData = endFlattened[parentId]
        const parentIsNew = parentData && !(parentId in startFlattened)
        const parentHasNestedNodes = parentData?.block?.nestedNodes?.[blockId]

        // Skip if parent is new and will include this block in nestedNodes
        if (parentIsNew && parentHasNestedNodes) {
          // Parent's 'add' operation will include this child, skip separate operation
          continue
        }

        // Block was added inside a subflow - include full block state
        const addParams: EditOperation['params'] = {
          subflowId: parentId,
          type: block.type,
          name: block.name,
          outputs: block.outputs,
          enabled: block.enabled !== undefined ? block.enabled : true,
        }

        // Only include triggerMode/advancedMode if true
        if (block?.triggerMode === true) {
          addParams.triggerMode = true
        }
        if (block?.advancedMode === true) {
          addParams.advancedMode = true
        }

        // Add inputs if present
        const inputs = extractInputValues(block)
        if (Object.keys(inputs).length > 0) {
          addParams.inputs = inputs
        }

        // Add connections if present
        const connections = extractConnections(blockId, endEdges)
        if (connections && Object.keys(connections).length > 0) {
          addParams.connections = connections
        }

        operations.push({
          operation_type: 'insert_into_subflow',
          block_id: blockId,
          params: addParams,
        })
        subflowsChanged++
      } else {
        // Regular block addition at root level
        const addParams: EditOperation['params'] = {
          type: block.type,
          name: block.name,
        }

        if (block?.triggerMode === true) {
          addParams.triggerMode = true
        }

        if (block?.advancedMode === true) {
          addParams.advancedMode = true
        }

        // Add inputs if present
        const inputs = extractInputValues(block)
        if (Object.keys(inputs).length > 0) {
          addParams.inputs = inputs
        }

        // Add connections if present
        const connections = extractConnections(blockId, endEdges)
        if (connections && Object.keys(connections).length > 0) {
          addParams.connections = connections
        }

        // Add nested nodes if present AND all children are new
        // This creates the loop/parallel with children in one operation
        // If some children already exist, they'll have separate insert_into_subflow operations
        if (block.nestedNodes && Object.keys(block.nestedNodes).length > 0) {
          const allChildrenNew = Object.keys(block.nestedNodes).every(
            (childId) => !(childId in startFlattened)
          )

          if (allChildrenNew) {
            addParams.nestedNodes = block.nestedNodes
            subflowsChanged++
          }
        }

        operations.push({
          operation_type: 'add',
          block_id: blockId,
          params: addParams,
        })
        blocksAdded++
      }
    }
  }

  // 3. Find modified blocks (exist in both but have changes)
  for (const blockId in endFlattened) {
    if (blockId in startFlattened) {
      const { block: startBlock, parentId: startParentId } = startFlattened[blockId]
      const { block: endBlock, parentId: endParentId } = endFlattened[blockId]

      // Check if parent changed (moved in/out of subflow)
      if (startParentId !== endParentId) {
        // Extract from old parent if it had one
        if (startParentId) {
          operations.push({
            operation_type: 'extract_from_subflow',
            block_id: blockId,
            params: { subflowId: startParentId },
          })
          subflowsChanged++
        }

        // Insert into new parent if it has one - include full block state
        if (endParentId) {
          const addParams: EditOperation['params'] = {
            subflowId: endParentId,
            type: endBlock.type,
            name: endBlock.name,
            outputs: endBlock.outputs,
            enabled: endBlock.enabled !== undefined ? endBlock.enabled : true,
          }

          // Only include triggerMode/advancedMode if true
          if (endBlock?.triggerMode === true) {
            addParams.triggerMode = true
          }
          if (endBlock?.advancedMode === true) {
            addParams.advancedMode = true
          }

          const inputs = extractInputValues(endBlock)
          if (Object.keys(inputs).length > 0) {
            addParams.inputs = inputs
          }

          const connections = extractConnections(blockId, endEdges)
          if (connections && Object.keys(connections).length > 0) {
            addParams.connections = connections
          }

          operations.push({
            operation_type: 'insert_into_subflow',
            block_id: blockId,
            params: addParams,
          })
          subflowsChanged++
        }
      }

      // Check for other changes (only if parent didn't change)
      const changes = computeBlockChanges(startBlock, endBlock, blockId, startEdges, endEdges)
      if (changes) {
        operations.push({
          operation_type: 'edit',
          block_id: blockId,
          params: changes,
        })
        blocksModified++
        if (changes.connections) {
          edgesChanged++
        }
      }
    }
  }

  return {
    operations,
    summary: {
      blocksAdded,
      blocksModified,
      blocksDeleted,
      edgesChanged,
      subflowsChanged,
    },
  }
}

/**
 * Extract input values from a block
 * Works with sanitized format where inputs is Record<string, value>
 */
function extractInputValues(block: any): Record<string, any> {
  // New sanitized format uses 'inputs' field
  if (block.inputs) {
    return { ...block.inputs }
  }

  // Fallback for any legacy data
  if (block.subBlocks) {
    return { ...block.subBlocks }
  }

  return {}
}

/**
 * Extract connections for a specific block from edges
 */
function extractConnections(
  blockId: string,
  edges: Array<{
    source: string
    target: string
    sourceHandle?: string | null
    targetHandle?: string | null
  }>
): Record<string, any> {
  const connections: Record<string, any> = {}

  // Find all edges where this block is the source
  const outgoingEdges = edges.filter((edge) => edge.source === blockId)

  for (const edge of outgoingEdges) {
    const handle = edge.sourceHandle || 'default'

    // Group by source handle
    if (!connections[handle]) {
      connections[handle] = []
    }

    // Add target block to this handle's connections
    if (edge.targetHandle && edge.targetHandle !== 'target') {
      connections[handle].push({
        block: edge.target,
        handle: edge.targetHandle,
      })
    } else {
      connections[handle].push(edge.target)
    }
  }

  // Simplify single-element arrays to just the element
  for (const handle in connections) {
    if (Array.isArray(connections[handle]) && connections[handle].length === 1) {
      connections[handle] = connections[handle][0]
    }
  }

  return connections
}

/**
 * Compute what changed in a block between two states
 */
function computeBlockChanges(
  startBlock: any,
  endBlock: any,
  blockId: string,
  startEdges: Array<{
    source: string
    target: string
    sourceHandle?: string | null
    targetHandle?: string | null
  }>,
  endEdges: Array<{
    source: string
    target: string
    sourceHandle?: string | null
    targetHandle?: string | null
  }>
): Record<string, any> | null {
  const changes: Record<string, any> = {}
  let hasChanges = false

  // Check type change
  if (startBlock.type !== endBlock.type) {
    changes.type = endBlock.type
    hasChanges = true
  }

  // Check name change
  if (startBlock.name !== endBlock.name) {
    changes.name = endBlock.name
    hasChanges = true
  }

  // Check trigger mode change (covers entering/exiting trigger mode)
  const startTrigger = Boolean(startBlock?.triggerMode)
  const endTrigger = Boolean(endBlock?.triggerMode)
  if (startTrigger !== endTrigger) {
    changes.triggerMode = endTrigger
    hasChanges = true
  }

  // Check advanced mode change
  const startAdvanced = Boolean(startBlock?.advancedMode)
  const endAdvanced = Boolean(endBlock?.advancedMode)
  if (startAdvanced !== endAdvanced) {
    changes.advancedMode = endAdvanced
    hasChanges = true
  }

  // Check input value changes - only include changed fields
  const startInputs = extractInputValues(startBlock)
  const endInputs = extractInputValues(endBlock)

  const changedInputs = computeInputDelta(startInputs, endInputs)
  if (Object.keys(changedInputs).length > 0) {
    changes.inputs = changedInputs
    hasChanges = true
  }

  // Check connection changes
  const startConnections = extractConnections(blockId, startEdges)
  const endConnections = extractConnections(blockId, endEdges)

  if (JSON.stringify(startConnections) !== JSON.stringify(endConnections)) {
    changes.connections = endConnections
    hasChanges = true
  }

  return hasChanges ? changes : null
}

/**
 * Compute delta between two input objects
 * Only returns fields that actually changed or were added
 */
function computeInputDelta(
  startInputs: Record<string, any>,
  endInputs: Record<string, any>
): Record<string, any> {
  const delta: Record<string, any> = {}

  for (const key in endInputs) {
    if (TRIGGER_RUNTIME_SUBBLOCK_IDS.includes(key)) {
      continue
    }
    if (
      !(key in startInputs) ||
      JSON.stringify(startInputs[key]) !== JSON.stringify(endInputs[key])
    ) {
      delta[key] = endInputs[key]
    }
  }

  return delta
}

/**
 * Format edit operations into a human-readable description
 */
export function formatEditSequence(operations: EditOperation[]): string[] {
  return operations.map((op) => {
    switch (op.operation_type) {
      case 'add':
        return `Add block "${op.params?.name || op.block_id}" (${op.params?.type || 'unknown'})`
      case 'delete':
        return `Delete block "${op.block_id}"`
      case 'insert_into_subflow':
        return `Insert "${op.params?.name || op.block_id}" into subflow "${op.params?.subflowId}"`
      case 'extract_from_subflow':
        return `Extract "${op.block_id}" from subflow "${op.params?.subflowId}"`
      case 'edit': {
        const changes: string[] = []
        if (op.params?.type) changes.push(`type to ${op.params.type}`)
        if (op.params?.name) changes.push(`name to "${op.params.name}"`)
        if (op.params?.triggerMode !== undefined)
          changes.push(`trigger mode to ${op.params.triggerMode}`)
        if (op.params?.advancedMode !== undefined)
          changes.push(`advanced mode to ${op.params.advancedMode}`)
        if (op.params?.inputs) {
          const inputKeys = Object.keys(op.params.inputs)
          if (inputKeys.length > 0) {
            changes.push(`inputs (${inputKeys.join(', ')})`)
          }
        }
        if (op.params?.connections) changes.push('connections')
        return `Edit block "${op.block_id}": ${changes.join(', ')}`
      }
      default:
        return `Unknown operation: ${op.operation_type}`
    }
  })
}
```

--------------------------------------------------------------------------------

---[FILE: execution-events.ts]---
Location: sim-main/apps/sim/lib/workflows/triggers/execution-events.ts

```typescript
/**
 * SSE Event types for workflow execution
 */

import type { SubflowType } from '@/stores/workflows/workflow/types'

export type ExecutionEventType =
  | 'execution:started'
  | 'execution:completed'
  | 'execution:error'
  | 'execution:cancelled'
  | 'block:started'
  | 'block:completed'
  | 'block:error'
  | 'stream:chunk'
  | 'stream:done'

/**
 * Base event structure for SSE
 */
export interface BaseExecutionEvent {
  type: ExecutionEventType
  timestamp: string
  executionId: string
}

/**
 * Execution started event
 */
export interface ExecutionStartedEvent extends BaseExecutionEvent {
  type: 'execution:started'
  workflowId: string
  data: {
    startTime: string
  }
}

/**
 * Execution completed event
 */
export interface ExecutionCompletedEvent extends BaseExecutionEvent {
  type: 'execution:completed'
  workflowId: string
  data: {
    success: boolean
    output: any
    duration: number
    startTime: string
    endTime: string
  }
}

/**
 * Execution error event
 */
export interface ExecutionErrorEvent extends BaseExecutionEvent {
  type: 'execution:error'
  workflowId: string
  data: {
    error: string
    duration: number
  }
}

/**
 * Execution cancelled event
 */
export interface ExecutionCancelledEvent extends BaseExecutionEvent {
  type: 'execution:cancelled'
  workflowId: string
  data: {
    duration: number
  }
}

/**
 * Block started event
 */
export interface BlockStartedEvent extends BaseExecutionEvent {
  type: 'block:started'
  workflowId: string
  data: {
    blockId: string
    blockName: string
    blockType: string
    // Iteration context for loops and parallels
    iterationCurrent?: number
    iterationTotal?: number
    iterationType?: SubflowType
  }
}

/**
 * Block completed event
 */
export interface BlockCompletedEvent extends BaseExecutionEvent {
  type: 'block:completed'
  workflowId: string
  data: {
    blockId: string
    blockName: string
    blockType: string
    output: any
    durationMs: number
    // Iteration context for loops and parallels
    iterationCurrent?: number
    iterationTotal?: number
    iterationType?: SubflowType
  }
}

/**
 * Block error event
 */
export interface BlockErrorEvent extends BaseExecutionEvent {
  type: 'block:error'
  workflowId: string
  data: {
    blockId: string
    blockName: string
    blockType: string
    error: string
    durationMs: number
    // Iteration context for loops and parallels
    iterationCurrent?: number
    iterationTotal?: number
    iterationType?: SubflowType
  }
}

/**
 * Stream chunk event (for agent blocks)
 */
export interface StreamChunkEvent extends BaseExecutionEvent {
  type: 'stream:chunk'
  workflowId: string
  data: {
    blockId: string
    chunk: string
  }
}

/**
 * Stream done event
 */
export interface StreamDoneEvent extends BaseExecutionEvent {
  type: 'stream:done'
  workflowId: string
  data: {
    blockId: string
  }
}

/**
 * Union type of all execution events
 */
export type ExecutionEvent =
  | ExecutionStartedEvent
  | ExecutionCompletedEvent
  | ExecutionErrorEvent
  | ExecutionCancelledEvent
  | BlockStartedEvent
  | BlockCompletedEvent
  | BlockErrorEvent
  | StreamChunkEvent
  | StreamDoneEvent

/**
 * Helper to create SSE formatted message
 */
export function formatSSEEvent(event: ExecutionEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`
}

/**
 * Helper to encode SSE event as Uint8Array
 */
export function encodeSSEEvent(event: ExecutionEvent): Uint8Array {
  return new TextEncoder().encode(formatSSEEvent(event))
}
```

--------------------------------------------------------------------------------

---[FILE: trigger-utils.ts]---
Location: sim-main/apps/sim/lib/workflows/triggers/trigger-utils.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import {
  type StartBlockCandidate,
  StartBlockPath,
  TRIGGER_TYPES,
} from '@/lib/workflows/triggers/triggers'
import { getAllBlocks, getBlock } from '@/blocks'
import type { BlockConfig } from '@/blocks/types'
import { getTrigger } from '@/triggers'

const logger = createLogger('TriggerUtils')

/**
 * Generates mock data based on the output type definition
 */
function generateMockValue(type: string, description?: string, fieldName?: string): any {
  const name = fieldName || 'value'

  switch (type) {
    case 'string':
      return `mock_${name}`

    case 'number':
      return 42

    case 'boolean':
      return true

    case 'array':
      return [
        {
          id: 'item_1',
          name: 'Sample Item',
          value: 'Sample Value',
        },
      ]

    case 'json':
    case 'object':
      return {
        id: 'sample_id',
        name: 'Sample Object',
        status: 'active',
      }

    default:
      return null
  }
}

/**
 * Recursively processes nested output structures
 */
function processOutputField(key: string, field: any, depth = 0, maxDepth = 10): any {
  // Prevent infinite recursion
  if (depth > maxDepth) {
    return null
  }

  if (field && typeof field === 'object' && 'type' in field) {
    return generateMockValue(field.type, field.description, key)
  }

  if (field && typeof field === 'object' && !Array.isArray(field)) {
    const nestedObject: Record<string, any> = {}
    for (const [nestedKey, nestedField] of Object.entries(field)) {
      nestedObject[nestedKey] = processOutputField(nestedKey, nestedField, depth + 1, maxDepth)
    }
    return nestedObject
  }

  return null
}

/**
 * Generates mock payload from outputs object
 */
function generateMockPayloadFromOutputs(outputs: Record<string, any>): Record<string, any> {
  const mockPayload: Record<string, any> = {}

  for (const [key, output] of Object.entries(outputs)) {
    if (key === 'visualization') {
      continue
    }
    mockPayload[key] = processOutputField(key, output)
  }

  return mockPayload
}

/**
 * Generates a mock payload based on outputs definition
 */
export function generateMockPayloadFromOutputsDefinition(
  outputs: Record<string, any>
): Record<string, any> {
  return generateMockPayloadFromOutputs(outputs)
}

export interface TriggerInfo {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  category: 'core' | 'integration'
  enableTriggerMode?: boolean
}

/**
 * Get all blocks that can act as triggers
 * This includes both dedicated trigger blocks and tools with trigger capabilities
 */
export function getAllTriggerBlocks(): TriggerInfo[] {
  const allBlocks = getAllBlocks()
  const triggers: TriggerInfo[] = []

  for (const block of allBlocks) {
    // Skip hidden blocks
    if (block.hideFromToolbar) continue

    // Check if it's a core trigger block (category: 'triggers')
    if (block.category === 'triggers') {
      triggers.push({
        id: block.type,
        name: block.name,
        description: block.description,
        icon: block.icon,
        color: block.bgColor,
        category: 'core',
        enableTriggerMode: hasTriggerCapability(block),
      })
    }
    // Check if it's a tool with trigger capability (has trigger-config subblock)
    else if (hasTriggerCapability(block)) {
      triggers.push({
        id: block.type,
        name: block.name,
        description: block.description.replace(' or trigger workflows from ', ', trigger from '),
        icon: block.icon,
        color: block.bgColor,
        category: 'integration',
        enableTriggerMode: true,
      })
    }
  }

  // Sort: core triggers first, then integration triggers, alphabetically within each category
  return triggers.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category === 'core' ? -1 : 1
    }
    return a.name.localeCompare(b.name)
  })
}

/**
 * Check if a block has trigger capability (contains trigger mode subblocks)
 */
export function hasTriggerCapability(block: BlockConfig): boolean {
  const hasTriggerModeSubBlocks = block.subBlocks.some((subBlock) => subBlock.mode === 'trigger')

  if (block.category === 'triggers') {
    return hasTriggerModeSubBlocks
  }

  return (
    (block.triggers?.enabled === true && block.triggers.available.length > 0) ||
    hasTriggerModeSubBlocks
  )
}

/**
 * Get blocks that should appear in the triggers tab
 * This includes all trigger blocks and tools with trigger mode
 */
export function getTriggersForSidebar(): BlockConfig[] {
  const allBlocks = getAllBlocks()
  return allBlocks.filter((block) => {
    if (block.hideFromToolbar) return false
    // Include blocks with triggers category or trigger-config subblock
    return block.category === 'triggers' || hasTriggerCapability(block)
  })
}

/**
 * Get blocks that should appear in the blocks tab
 * This excludes only dedicated trigger blocks, not tools with trigger capability
 */
export function getBlocksForSidebar(): BlockConfig[] {
  const allBlocks = getAllBlocks()
  return allBlocks.filter((block) => {
    if (block.hideFromToolbar) return false
    if (block.type === 'starter') return false // Legacy block
    // Only exclude blocks with 'triggers' category
    // Tools with trigger capability should still appear in blocks tab
    return block.category !== 'triggers'
  })
}

/**
 * Get the proper display name for a trigger block in the UI
 */
export function getTriggerDisplayName(blockType: string): string {
  const block = getBlock(blockType)
  if (!block) return blockType

  if (blockType === TRIGGER_TYPES.GENERIC_WEBHOOK) {
    return 'Webhook'
  }

  return block.name
}

/**
 * Groups triggers by their immediate downstream blocks to identify disjoint paths
 */
export function groupTriggersByPath<
  T extends { type: string; subBlocks?: Record<string, unknown> },
>(
  candidates: StartBlockCandidate<T>[],
  edges: Array<{ source: string; target: string }>
): Array<StartBlockCandidate<T>[]> {
  if (candidates.length <= 1) {
    return [candidates]
  }

  const groups: Array<StartBlockCandidate<T>[]> = []
  const processed = new Set<string>()

  // Build adjacency map (edges should already be filtered to exclude trigger-to-trigger)
  const adjacency = new Map<string, string[]>()
  for (const edge of edges) {
    if (!adjacency.has(edge.source)) {
      adjacency.set(edge.source, [])
    }
    adjacency.get(edge.source)!.push(edge.target)
  }

  // Group triggers that feed into the same immediate blocks
  for (const trigger of candidates) {
    if (processed.has(trigger.blockId)) continue

    const immediateTargets = adjacency.get(trigger.blockId) || []
    const targetSet = new Set(immediateTargets)

    // Find all triggers with the same immediate targets
    const group = candidates.filter((t) => {
      if (processed.has(t.blockId)) return false
      if (t.blockId === trigger.blockId) return true

      const tTargets = adjacency.get(t.blockId) || []

      // Different number of targets = different paths
      if (immediateTargets.length !== tTargets.length) return false

      // Check if all targets match
      return tTargets.every((target) => targetSet.has(target))
    })

    group.forEach((t) => processed.add(t.blockId))
    groups.push(group)
  }

  logger.info('Grouped triggers by path', {
    groupCount: groups.length,
    groups: groups.map((g) => ({
      count: g.length,
      triggers: g.map((t) => ({ id: t.blockId, type: t.block.type })),
    })),
  })

  return groups
}

/**
 * Selects the best trigger from a list of candidates based on priority
 * Priority: Start Block > Schedules > External Triggers > Legacy
 * If multiple disjoint paths exist, returns one trigger per path
 */
export function selectBestTrigger<T extends { type: string; subBlocks?: Record<string, unknown> }>(
  candidates: StartBlockCandidate<T>[],
  edges?: Array<{ source: string; target: string }>
): StartBlockCandidate<T>[] {
  if (candidates.length === 0) {
    throw new Error('No trigger candidates provided')
  }

  // If edges provided, group by path and select best from each group
  if (edges) {
    const groups = groupTriggersByPath(candidates, edges)
    return groups.map((group) => selectBestFromGroup(group))
  }

  // Otherwise just select the single best trigger
  return [selectBestFromGroup(candidates)]
}

/**
 * Selects the best trigger from a group based on priority
 */
function selectBestFromGroup<T extends { type: string; subBlocks?: Record<string, unknown> }>(
  candidates: StartBlockCandidate<T>[]
): StartBlockCandidate<T> {
  if (candidates.length === 1) {
    return candidates[0]
  }

  // Sort by priority (lower number = higher priority)
  const sorted = [...candidates].sort((a, b) => {
    const getPriority = (trigger: StartBlockCandidate<T>): number => {
      // Start block - highest priority
      if (trigger.path === StartBlockPath.UNIFIED) return 0
      if (trigger.path === StartBlockPath.LEGACY_STARTER) return 1

      // For external triggers, differentiate schedules from webhooks
      if (trigger.path === StartBlockPath.EXTERNAL_TRIGGER) {
        if (trigger.block.type === 'schedule') return 2
        return 3 // Webhooks and other external triggers
      }

      // Other trigger types
      if (trigger.path === StartBlockPath.SPLIT_API) return 4
      if (trigger.path === StartBlockPath.SPLIT_INPUT) return 5
      if (trigger.path === StartBlockPath.SPLIT_MANUAL) return 6
      if (trigger.path === StartBlockPath.SPLIT_CHAT) return 7

      return 99 // Unknown
    }

    return getPriority(a) - getPriority(b)
  })

  const selected = sorted[0]
  logger.info('Selected best trigger from group', {
    selectedId: selected.blockId,
    selectedType: selected.block.type,
    selectedPath: selected.path,
    groupSize: candidates.length,
  })

  return selected
}

/**
 * Checks if a trigger needs mock payload (external triggers/webhooks, but not schedules)
 */
export function triggerNeedsMockPayload<T extends { type: string }>(
  trigger: StartBlockCandidate<T>
): boolean {
  // Only webhooks and external integrations need mock payloads
  // Schedules run normally without mock data
  return trigger.path === StartBlockPath.EXTERNAL_TRIGGER && trigger.block.type !== 'schedule'
}

/**
 * Extracts or generates mock payload for external trigger execution
 */
export function extractTriggerMockPayload<
  T extends { type: string; subBlocks?: Record<string, unknown> },
>(trigger: StartBlockCandidate<T>): any {
  const subBlocks = trigger.block.subBlocks as Record<string, any> | undefined

  // Determine the trigger ID
  let triggerId: string

  // Check for selectedTriggerId (multi-trigger blocks like Linear, Jira)
  if (typeof subBlocks?.selectedTriggerId?.value === 'string') {
    triggerId = subBlocks.selectedTriggerId.value
  } else {
    // For single-trigger blocks, get from block config
    const blockConfig = getBlock(trigger.block.type)

    if (blockConfig?.triggers?.available?.length === 1) {
      triggerId = blockConfig.triggers.available[0]
    } else {
      // Fallback to block type (for blocks that are themselves triggers like schedule)
      triggerId = trigger.block.type
    }
  }

  try {
    const triggerConfig = getTrigger(triggerId)

    if (!triggerConfig || !triggerConfig.outputs) {
      logger.warn('No trigger config or outputs found', {
        triggerId,
        blockId: trigger.blockId,
      })
      return {}
    }

    const payload = generateMockPayloadFromOutputsDefinition(triggerConfig.outputs)

    logger.info('Generated mock payload from trigger outputs', {
      triggerId,
      blockId: trigger.blockId,
      topLevelKeys: Object.keys(payload ?? {}),
    })

    return payload
  } catch (error) {
    logger.error('Failed to generate mock payload from trigger outputs', {
      triggerId,
      blockId: trigger.blockId,
      error: error instanceof Error ? error.message : String(error),
    })
    return {}
  }
}
```

--------------------------------------------------------------------------------

````
