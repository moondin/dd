---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 645
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 645 of 933)

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

---[FILE: types.ts]---
Location: sim-main/apps/sim/stores/workflows/workflow/types.ts

```typescript
import type { Edge } from 'reactflow'
import type { BlockOutput, SubBlockType } from '@/blocks/types'
import type { DeploymentStatus } from '@/stores/workflows/registry/types'

export const SUBFLOW_TYPES = {
  LOOP: 'loop',
  PARALLEL: 'parallel',
} as const

export type SubflowType = (typeof SUBFLOW_TYPES)[keyof typeof SUBFLOW_TYPES]

export function isValidSubflowType(type: string): type is SubflowType {
  return Object.values(SUBFLOW_TYPES).includes(type as SubflowType)
}

export interface LoopConfig {
  nodes: string[]
  iterations: number
  loopType: 'for' | 'forEach' | 'while' | 'doWhile'
  forEachItems?: any[] | Record<string, any> | string
  whileCondition?: string // JS expression that evaluates to boolean (for while loops)
  doWhileCondition?: string // JS expression that evaluates to boolean (for do-while loops)
}

export interface ParallelConfig {
  nodes: string[]
  distribution?: any[] | Record<string, any> | string
  parallelType?: 'count' | 'collection'
}

export interface Subflow {
  id: string
  workflowId: string
  type: SubflowType
  config: LoopConfig | ParallelConfig
  createdAt: Date
  updatedAt: Date
}

export interface Position {
  x: number
  y: number
}

export interface BlockData {
  // Parent-child relationships for container nodes
  parentId?: string
  extent?: 'parent'

  // Container dimensions
  width?: number
  height?: number

  // Loop-specific properties
  collection?: any // The items to iterate over in a forEach loop
  count?: number // Number of iterations for numeric loops
  loopType?: 'for' | 'forEach' | 'while' | 'doWhile' // Type of loop - must match Loop interface
  whileCondition?: string // While loop condition (JS expression)
  doWhileCondition?: string // Do-While loop condition (JS expression)

  // Parallel-specific properties
  parallelType?: 'collection' | 'count' // Type of parallel execution

  // Container node type (for ReactFlow node type determination)
  type?: string
}

export interface BlockLayoutState {
  measuredWidth?: number
  measuredHeight?: number
}

export interface BlockState {
  id: string
  type: string
  name: string
  position: Position
  subBlocks: Record<string, SubBlockState>
  outputs: Record<string, BlockOutput>
  enabled: boolean
  horizontalHandles?: boolean
  height?: number
  advancedMode?: boolean
  triggerMode?: boolean
  data?: BlockData
  layout?: BlockLayoutState
}

export interface SubBlockState {
  id: string
  type: SubBlockType
  value: string | number | string[][] | null
}

export interface LoopBlock {
  id: string
  loopType: 'for' | 'forEach'
  count: number
  collection: string
  width: number
  height: number
  executionState: {
    isExecuting: boolean
    startTime: null | number
    endTime: null | number
  }
}

export interface ParallelBlock {
  id: string
  collection: string
  width: number
  height: number
  executionState: {
    currentExecution: number
    isExecuting: boolean
    startTime: null | number
    endTime: null | number
  }
}

export interface Loop {
  id: string
  nodes: string[]
  iterations: number
  loopType: 'for' | 'forEach' | 'while' | 'doWhile'
  forEachItems?: any[] | Record<string, any> | string // Items or expression
  whileCondition?: string // JS expression that evaluates to boolean (for while loops)
  doWhileCondition?: string // JS expression that evaluates to boolean (for do-while loops)
}

export interface Parallel {
  id: string
  nodes: string[]
  distribution?: any[] | Record<string, any> | string // Items or expression
  count?: number // Number of parallel executions for count-based parallel
  parallelType?: 'count' | 'collection' // Explicit parallel type to avoid inference bugs
}

export interface DragStartPosition {
  id: string
  x: number
  y: number
  parentId?: string | null
}

export interface WorkflowState {
  blocks: Record<string, BlockState>
  edges: Edge[]
  lastSaved?: number
  loops: Record<string, Loop>
  parallels: Record<string, Parallel>
  lastUpdate?: number
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
  isDeployed?: boolean
  deployedAt?: Date
  deploymentStatuses?: Record<string, DeploymentStatus>
  needsRedeployment?: boolean
  dragStartPosition?: DragStartPosition | null
}

export interface WorkflowActions {
  addBlock: (
    id: string,
    type: string,
    name: string,
    position: Position,
    data?: Record<string, any>,
    parentId?: string,
    extent?: 'parent',
    blockProperties?: {
      enabled?: boolean
      horizontalHandles?: boolean
      advancedMode?: boolean
      triggerMode?: boolean
      height?: number
    }
  ) => void
  updateBlockPosition: (id: string, position: Position) => void
  updateNodeDimensions: (id: string, dimensions: { width: number; height: number }) => void
  updateParentId: (id: string, parentId: string, extent: 'parent') => void
  removeBlock: (id: string) => void
  addEdge: (edge: Edge) => void
  removeEdge: (edgeId: string) => void
  clear: () => Partial<WorkflowState>
  updateLastSaved: () => void
  toggleBlockEnabled: (id: string) => void
  duplicateBlock: (id: string) => void
  toggleBlockHandles: (id: string) => void
  updateBlockName: (
    id: string,
    name: string
  ) => {
    success: boolean
    changedSubblocks: Array<{ blockId: string; subBlockId: string; newValue: any }>
  }
  setBlockAdvancedMode: (id: string, advancedMode: boolean) => void
  setBlockTriggerMode: (id: string, triggerMode: boolean) => void
  updateBlockLayoutMetrics: (id: string, dimensions: { width: number; height: number }) => void
  triggerUpdate: () => void
  updateLoopCount: (loopId: string, count: number) => void
  updateLoopType: (loopId: string, loopType: 'for' | 'forEach' | 'while' | 'doWhile') => void
  updateLoopCollection: (loopId: string, collection: string) => void
  setLoopForEachItems: (loopId: string, items: any) => void
  setLoopWhileCondition: (loopId: string, condition: string) => void
  setLoopDoWhileCondition: (loopId: string, condition: string) => void
  updateParallelCount: (parallelId: string, count: number) => void
  updateParallelCollection: (parallelId: string, collection: string) => void
  updateParallelType: (parallelId: string, parallelType: 'count' | 'collection') => void
  generateLoopBlocks: () => Record<string, Loop>
  generateParallelBlocks: () => Record<string, Parallel>
  setNeedsRedeploymentFlag: (needsRedeployment: boolean) => void
  revertToDeployedState: (deployedState: WorkflowState) => void
  toggleBlockAdvancedMode: (id: string) => void
  toggleBlockTriggerMode: (id: string) => void
  setDragStartPosition: (position: DragStartPosition | null) => void
  getDragStartPosition: () => DragStartPosition | null
  getWorkflowState: () => WorkflowState
  replaceWorkflowState: (
    workflowState: WorkflowState,
    options?: { updateLastSaved?: boolean }
  ) => void
}

export type WorkflowStore = WorkflowState & WorkflowActions
```

--------------------------------------------------------------------------------

---[FILE: utils.test.ts]---
Location: sim-main/apps/sim/stores/workflows/workflow/utils.test.ts

```typescript
import { describe, expect, it } from 'vitest'
import type { BlockState } from '@/stores/workflows/workflow/types'
import { convertLoopBlockToLoop } from '@/stores/workflows/workflow/utils'

describe('convertLoopBlockToLoop', () => {
  it.concurrent('should keep JSON array string as-is for forEach loops', () => {
    const blocks: Record<string, BlockState> = {
      loop1: {
        id: 'loop1',
        type: 'loop',
        name: 'Test Loop',
        position: { x: 0, y: 0 },
        subBlocks: {},
        outputs: {},
        enabled: true,
        data: {
          loopType: 'forEach',
          count: 10,
          collection: '["item1", "item2", "item3"]',
        },
      },
    }

    const result = convertLoopBlockToLoop('loop1', blocks)

    expect(result).toBeDefined()
    expect(result?.loopType).toBe('forEach')
    expect(result?.forEachItems).toBe('["item1", "item2", "item3"]')
    expect(result?.iterations).toBe(10)
  })

  it.concurrent('should keep JSON object string as-is for forEach loops', () => {
    const blocks: Record<string, BlockState> = {
      loop1: {
        id: 'loop1',
        type: 'loop',
        name: 'Test Loop',
        position: { x: 0, y: 0 },
        subBlocks: {},
        outputs: {},
        enabled: true,
        data: {
          loopType: 'forEach',
          count: 5,
          collection: '{"key1": "value1", "key2": "value2"}',
        },
      },
    }

    const result = convertLoopBlockToLoop('loop1', blocks)

    expect(result).toBeDefined()
    expect(result?.loopType).toBe('forEach')
    expect(result?.forEachItems).toBe('{"key1": "value1", "key2": "value2"}')
  })

  it.concurrent('should keep string as-is if not valid JSON', () => {
    const blocks: Record<string, BlockState> = {
      loop1: {
        id: 'loop1',
        type: 'loop',
        name: 'Test Loop',
        position: { x: 0, y: 0 },
        subBlocks: {},
        outputs: {},
        enabled: true,
        data: {
          loopType: 'forEach',
          count: 5,
          collection: '<blockName.items>',
        },
      },
    }

    const result = convertLoopBlockToLoop('loop1', blocks)

    expect(result).toBeDefined()
    expect(result?.forEachItems).toBe('<blockName.items>')
  })

  it.concurrent('should handle empty collection', () => {
    const blocks: Record<string, BlockState> = {
      loop1: {
        id: 'loop1',
        type: 'loop',
        name: 'Test Loop',
        position: { x: 0, y: 0 },
        subBlocks: {},
        outputs: {},
        enabled: true,
        data: {
          loopType: 'forEach',
          count: 5,
          collection: '',
        },
      },
    }

    const result = convertLoopBlockToLoop('loop1', blocks)

    expect(result).toBeDefined()
    expect(result?.forEachItems).toBe('')
  })

  it.concurrent('should handle for loops without collection parsing', () => {
    const blocks: Record<string, BlockState> = {
      loop1: {
        id: 'loop1',
        type: 'loop',
        name: 'Test Loop',
        position: { x: 0, y: 0 },
        subBlocks: {},
        outputs: {},
        enabled: true,
        data: {
          loopType: 'for',
          count: 5,
          collection: '["should", "not", "matter"]',
        },
      },
    }

    const result = convertLoopBlockToLoop('loop1', blocks)

    expect(result).toBeDefined()
    expect(result?.loopType).toBe('for')
    expect(result?.iterations).toBe(5)
    expect(result?.forEachItems).toBe('["should", "not", "matter"]')
  })
})
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/stores/workflows/workflow/utils.ts

```typescript
import type { Edge } from 'reactflow'
import type { BlockState, Loop, Parallel } from '@/stores/workflows/workflow/types'

const DEFAULT_LOOP_ITERATIONS = 5

/**
 * Check if adding an edge would create a cycle in the graph.
 * Uses depth-first search to detect if the source node is reachable from the target node.
 *
 * @param edges - Current edges in the graph
 * @param sourceId - Source node ID of the proposed edge
 * @param targetId - Target node ID of the proposed edge
 * @returns true if adding this edge would create a cycle
 */
export function wouldCreateCycle(edges: Edge[], sourceId: string, targetId: string): boolean {
  if (sourceId === targetId) {
    return true
  }

  const adjacencyList = new Map<string, string[]>()
  for (const edge of edges) {
    if (!adjacencyList.has(edge.source)) {
      adjacencyList.set(edge.source, [])
    }
    adjacencyList.get(edge.source)!.push(edge.target)
  }

  const visited = new Set<string>()

  function canReachSource(currentNode: string): boolean {
    if (currentNode === sourceId) {
      return true
    }

    if (visited.has(currentNode)) {
      return false
    }

    visited.add(currentNode)

    const neighbors = adjacencyList.get(currentNode) || []
    for (const neighbor of neighbors) {
      if (canReachSource(neighbor)) {
        return true
      }
    }

    return false
  }

  return canReachSource(targetId)
}

/**
 * Convert UI loop block to executor Loop format
 *
 * @param loopBlockId - ID of the loop block to convert
 * @param blocks - Record of all blocks in the workflow
 * @returns Loop object for execution engine or undefined if not a valid loop
 */
export function convertLoopBlockToLoop(
  loopBlockId: string,
  blocks: Record<string, BlockState>
): Loop | undefined {
  const loopBlock = blocks[loopBlockId]
  if (!loopBlock || loopBlock.type !== 'loop') return undefined

  const loopType = loopBlock.data?.loopType || 'for'

  const loop: Loop = {
    id: loopBlockId,
    nodes: findChildNodes(loopBlockId, blocks),
    iterations: loopBlock.data?.count || DEFAULT_LOOP_ITERATIONS,
    loopType,
  }

  loop.forEachItems = loopBlock.data?.collection || ''
  loop.whileCondition = loopBlock.data?.whileCondition || ''
  loop.doWhileCondition = loopBlock.data?.doWhileCondition || ''

  return loop
}

/**
 * Convert UI parallel block to executor Parallel format
 *
 * @param parallelBlockId - ID of the parallel block to convert
 * @param blocks - Record of all blocks in the workflow
 * @returns Parallel object for execution engine or undefined if not a valid parallel block
 */
export function convertParallelBlockToParallel(
  parallelBlockId: string,
  blocks: Record<string, BlockState>
): Parallel | undefined {
  const parallelBlock = blocks[parallelBlockId]
  if (!parallelBlock || parallelBlock.type !== 'parallel') return undefined

  const parallelType = parallelBlock.data?.parallelType || 'count'

  const validParallelTypes = ['collection', 'count'] as const
  const validatedParallelType = validParallelTypes.includes(parallelType as any)
    ? parallelType
    : 'collection'

  const distribution =
    validatedParallelType === 'collection' ? parallelBlock.data?.collection || '' : ''

  const count = parallelBlock.data?.count || 5

  return {
    id: parallelBlockId,
    nodes: findChildNodes(parallelBlockId, blocks),
    distribution,
    count,
    parallelType: validatedParallelType,
  }
}

/**
 * Find all nodes that are children of this container (loop or parallel)
 *
 * @param containerId - ID of the container to find children for
 * @param blocks - Record of all blocks in the workflow
 * @returns Array of node IDs that are direct children of this container
 */
export function findChildNodes(containerId: string, blocks: Record<string, BlockState>): string[] {
  return Object.values(blocks)
    .filter((block) => block.data?.parentId === containerId)
    .map((block) => block.id)
}

/**
 * Find all descendant nodes, including children, grandchildren, etc.
 *
 * @param containerId - ID of the container to find descendants for
 * @param blocks - Record of all blocks in the workflow
 * @returns Array of node IDs that are descendants of this container
 */
export function findAllDescendantNodes(
  containerId: string,
  blocks: Record<string, BlockState>
): string[] {
  const descendants: string[] = []
  const findDescendants = (parentId: string) => {
    const children = Object.values(blocks)
      .filter((block) => block.data?.parentId === parentId)
      .map((block) => block.id)

    children.forEach((childId) => {
      descendants.push(childId)
      findDescendants(childId)
    })
  }

  findDescendants(containerId)
  return descendants
}

/**
 * Builds a complete collection of loops from the UI blocks
 *
 * @param blocks - Record of all blocks in the workflow
 * @returns Record of Loop objects for execution engine
 */
export function generateLoopBlocks(blocks: Record<string, BlockState>): Record<string, Loop> {
  const loops: Record<string, Loop> = {}

  Object.entries(blocks)
    .filter(([_, block]) => block.type === 'loop')
    .forEach(([id, block]) => {
      const loop = convertLoopBlockToLoop(id, blocks)
      if (loop) {
        loops[id] = loop
      }
    })

  return loops
}

/**
 * Builds a complete collection of parallel blocks from the UI blocks
 *
 * @param blocks - Record of all blocks in the workflow
 * @returns Record of Parallel objects for execution engine
 */
export function generateParallelBlocks(
  blocks: Record<string, BlockState>
): Record<string, Parallel> {
  const parallels: Record<string, Parallel> = {}

  Object.entries(blocks)
    .filter(([_, block]) => block.type === 'parallel')
    .forEach(([id, block]) => {
      const parallel = convertParallelBlockToParallel(id, blocks)
      if (parallel) {
        parallels[id] = parallel
      }
    })

  return parallels
}
```

--------------------------------------------------------------------------------

---[FILE: importer.ts]---
Location: sim-main/apps/sim/stores/workflows/yaml/importer.ts

```typescript
import { load as yamlParse } from 'js-yaml'
import { v4 as uuidv4 } from 'uuid'
import { createLogger } from '@/lib/logs/console/logger'
import { getBlock } from '@/blocks'
import {
  type ConnectionsFormat,
  expandConditionInputs,
  type ImportedEdge,
  parseBlockConnections,
  validateBlockReferences,
  validateBlockStructure,
} from '@/stores/workflows/yaml/parsing-utils'

const logger = createLogger('WorkflowYamlImporter')

interface YamlBlock {
  type: string
  name: string
  inputs?: Record<string, any>
  connections?: ConnectionsFormat
  parentId?: string // Add parentId for nested blocks
}

interface YamlWorkflow {
  version: string
  blocks: Record<string, YamlBlock>
}

interface ImportedBlock {
  id: string
  type: string
  name: string
  inputs: Record<string, any>
  position: { x: number; y: number }
  data?: Record<string, any>
  parentId?: string
  extent?: 'parent'
}

interface ImportResult {
  blocks: ImportedBlock[]
  edges: ImportedEdge[]
  errors: string[]
  warnings: string[]
}

/**
 * Parse YAML content and validate its structure
 */
export function parseWorkflowYaml(yamlContent: string): {
  data: YamlWorkflow | null
  errors: string[]
} {
  const errors: string[] = []

  try {
    const data = yamlParse(yamlContent) as unknown

    // Validate top-level structure
    if (!data || typeof data !== 'object') {
      errors.push('Invalid YAML: Root must be an object')
      return { data: null, errors }
    }

    // Type guard to check if data has the expected structure
    const parsedData = data as Record<string, unknown>

    if (!parsedData.version) {
      errors.push('Missing required field: version')
    }

    if (!parsedData.blocks || typeof parsedData.blocks !== 'object') {
      errors.push('Missing or invalid field: blocks')
      return { data: null, errors }
    }

    // Validate blocks structure
    const blocks = parsedData.blocks as Record<string, unknown>
    Object.entries(blocks).forEach(([blockId, block]: [string, unknown]) => {
      if (!block || typeof block !== 'object') {
        errors.push(`Invalid block definition for '${blockId}': must be an object`)
        return
      }

      const blockData = block as Record<string, unknown>

      if (!blockData.type || typeof blockData.type !== 'string') {
        errors.push(`Invalid block '${blockId}': missing or invalid 'type' field`)
      }

      if (!blockData.name || typeof blockData.name !== 'string') {
        errors.push(`Invalid block '${blockId}': missing or invalid 'name' field`)
      }

      if (blockData.inputs && typeof blockData.inputs !== 'object') {
        errors.push(`Invalid block '${blockId}': 'inputs' must be an object`)
      }

      if (blockData.preceding && !Array.isArray(blockData.preceding)) {
        errors.push(`Invalid block '${blockId}': 'preceding' must be an array`)
      }

      if (blockData.following && !Array.isArray(blockData.following)) {
        errors.push(`Invalid block '${blockId}': 'following' must be an array`)
      }
    })

    if (errors.length > 0) {
      return { data: null, errors }
    }

    return { data: parsedData as unknown as YamlWorkflow, errors: [] }
  } catch (error) {
    errors.push(`YAML parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    return { data: null, errors }
  }
}

/**
 * Validate that block types exist and are valid
 */
function validateBlockTypes(yamlWorkflow: YamlWorkflow): { errors: string[]; warnings: string[] } {
  const errors: string[] = []
  const warnings: string[] = []

  // Precompute counts that are used in validations to avoid O(n^2) checks
  const apiTriggerCount = Object.values(yamlWorkflow.blocks).filter(
    (b) => b.type === 'api_trigger'
  ).length

  Object.entries(yamlWorkflow.blocks).forEach(([blockId, block]) => {
    // Use shared structure validation
    const { errors: structureErrors, warnings: structureWarnings } = validateBlockStructure(
      blockId,
      block
    )
    errors.push(...structureErrors)
    warnings.push(...structureWarnings)

    // Check if block type exists
    const blockConfig = getBlock(block.type)

    // Special handling for container blocks
    if (block.type === 'loop' || block.type === 'parallel') {
      // These are valid container types
      return
    }

    if (!blockConfig) {
      errors.push(`Unknown block type '${block.type}' for block '${blockId}'`)
      return
    }

    // Validate inputs against block configuration
    if (block.inputs && blockConfig.subBlocks) {
      Object.keys(block.inputs).forEach((inputKey) => {
        const subBlockConfig = blockConfig.subBlocks.find((sb) => sb.id === inputKey)
        if (!subBlockConfig) {
          warnings.push(
            `Block '${blockId}' has unknown input '${inputKey}' for type '${block.type}'`
          )
        }
      })
    }
  })

  // Enforce only one API trigger in YAML (single check outside the loop)
  if (apiTriggerCount > 1) {
    errors.push('Only one API trigger is allowed per workflow (YAML contains multiple).')
  }

  return { errors, warnings }
}

/**
 * Calculate positions for blocks based on their connections
 * Uses a simple layered approach similar to the auto-layout algorithm
 */
function calculateBlockPositions(
  yamlWorkflow: YamlWorkflow
): Record<string, { x: number; y: number }> {
  const positions: Record<string, { x: number; y: number }> = {}
  const blockIds = Object.keys(yamlWorkflow.blocks)

  // Find starter blocks (no incoming connections)
  const starterBlocks = blockIds.filter((id) => {
    const block = yamlWorkflow.blocks[id]
    return !block.connections?.incoming || block.connections.incoming.length === 0
  })

  // If no starter blocks found, use first block as starter
  if (starterBlocks.length === 0 && blockIds.length > 0) {
    starterBlocks.push(blockIds[0])
  }

  // Build layers
  const layers: string[][] = []
  const visited = new Set<string>()
  const queue = [...starterBlocks]

  // BFS to organize blocks into layers
  while (queue.length > 0) {
    const currentLayer: string[] = []
    const currentLayerSize = queue.length

    for (let i = 0; i < currentLayerSize; i++) {
      const blockId = queue.shift()!
      if (visited.has(blockId)) continue

      visited.add(blockId)
      currentLayer.push(blockId)

      // Add following blocks to queue
      const block = yamlWorkflow.blocks[blockId]
      if (block.connections?.outgoing) {
        block.connections.outgoing.forEach((connection) => {
          if (!visited.has(connection.target)) {
            queue.push(connection.target)
          }
        })
      }
    }

    if (currentLayer.length > 0) {
      layers.push(currentLayer)
    }
  }

  // Add any remaining blocks as isolated layer
  const remainingBlocks = blockIds.filter((id) => !visited.has(id))
  if (remainingBlocks.length > 0) {
    layers.push(remainingBlocks)
  }

  // Calculate positions
  const horizontalSpacing = 600
  const verticalSpacing = 200
  const startX = 150
  const startY = 300

  // First pass: position all blocks as if they're root level
  layers.forEach((layer, layerIndex) => {
    const layerX = startX + layerIndex * horizontalSpacing

    layer.forEach((blockId, blockIndex) => {
      const blockY = startY + (blockIndex - layer.length / 2) * verticalSpacing
      positions[blockId] = { x: layerX, y: blockY }
    })
  })

  // Second pass: adjust positions for child blocks to be relative to their parent
  Object.entries(yamlWorkflow.blocks).forEach(([blockId, block]) => {
    if (block.parentId && positions[blockId] && positions[block.parentId]) {
      // Convert absolute position to relative position within parent
      const parentPos = positions[block.parentId]
      const childPos = positions[blockId]

      // Calculate relative position inside the parent container
      // Start child blocks at a reasonable offset inside the parent
      positions[blockId] = {
        x: 50 + (childPos.x - parentPos.x) * 0.3, // Scale down and offset
        y: 100 + (childPos.y - parentPos.y) * 0.3, // Scale down and offset
      }
    }
  })

  return positions
}

/**
 * Sort blocks to ensure parents are processed before children
 * This ensures proper creation order for nested blocks
 */
function sortBlocksByParentChildOrder(blocks: ImportedBlock[]): ImportedBlock[] {
  const sorted: ImportedBlock[] = []
  const processed = new Set<string>()
  const visiting = new Set<string>() // Track blocks currently being processed to detect cycles

  // Create a map for quick lookup
  const blockMap = new Map<string, ImportedBlock>()
  blocks.forEach((block) => blockMap.set(block.id, block))

  // Process blocks recursively, ensuring parents are added first
  function processBlock(block: ImportedBlock) {
    if (processed.has(block.id)) {
      return // Already processed
    }

    if (visiting.has(block.id)) {
      // Circular dependency detected - break the cycle by processing this block without its parent
      logger.warn(`Circular parent-child dependency detected for block ${block.id}, breaking cycle`)
      sorted.push(block)
      processed.add(block.id)
      return
    }

    visiting.add(block.id)

    // If this block has a parent, ensure the parent is processed first
    if (block.parentId) {
      const parentBlock = blockMap.get(block.parentId)
      if (parentBlock && !processed.has(block.parentId)) {
        processBlock(parentBlock)
      }
    }

    // Now process this block
    visiting.delete(block.id)
    sorted.push(block)
    processed.add(block.id)
  }

  // Process all blocks
  blocks.forEach((block) => processBlock(block))

  return sorted
}

/**
 * Convert YAML workflow to importable format
 */
export function convertYamlToWorkflow(yamlWorkflow: YamlWorkflow): ImportResult {
  const errors: string[] = []
  const warnings: string[] = []
  const blocks: ImportedBlock[] = []
  const edges: ImportedEdge[] = []

  // Validate block references
  const referenceErrors = validateBlockReferences(yamlWorkflow.blocks)
  errors.push(...referenceErrors)

  // Validate block types
  const { errors: typeErrors, warnings: typeWarnings } = validateBlockTypes(yamlWorkflow)
  errors.push(...typeErrors)
  warnings.push(...typeWarnings)

  if (errors.length > 0) {
    return { blocks: [], edges: [], errors, warnings }
  }

  // Calculate positions
  const positions = calculateBlockPositions(yamlWorkflow)

  // Convert blocks
  Object.entries(yamlWorkflow.blocks).forEach(([blockId, yamlBlock]) => {
    const position = positions[blockId] || { x: 100, y: 100 }

    // Expand condition inputs from clean format to internal format
    const processedInputs =
      yamlBlock.type === 'condition'
        ? expandConditionInputs(blockId, yamlBlock.inputs || {})
        : yamlBlock.inputs || {}

    const importedBlock: ImportedBlock = {
      id: blockId,
      type: yamlBlock.type,
      name: yamlBlock.name,
      inputs: processedInputs,
      position,
    }

    // Add container-specific data
    if (yamlBlock.type === 'loop' || yamlBlock.type === 'parallel') {
      // For loop/parallel blocks, map the inputs to the data field since they don't use subBlocks
      const inputs = yamlBlock.inputs || {}

      // Apply defaults for loop blocks
      if (yamlBlock.type === 'loop') {
        importedBlock.data = {
          width: 500,
          height: 300,
          type: 'subflowNode',
          loopType: inputs.loopType || 'for',
          count: inputs.iterations || inputs.count || 5,
          collection: inputs.collection || '',
          maxConcurrency: inputs.maxConcurrency || 1,
          // Include any other inputs provided
          ...inputs,
        }
      } else {
        // Parallel blocks
        importedBlock.data = {
          width: 500,
          height: 300,
          type: 'subflowNode',
          ...inputs,
        }
      }

      // Clear inputs since they're now in data
      importedBlock.inputs = {}
    }

    // Handle parent-child relationships for nested blocks
    if (yamlBlock.parentId) {
      importedBlock.parentId = yamlBlock.parentId
      importedBlock.extent = 'parent' // Always 'parent' when parentId exists
      // Also add to data for consistency with how the system works
      if (!importedBlock.data) {
        importedBlock.data = {}
      }
      importedBlock.data.parentId = yamlBlock.parentId
      importedBlock.data.extent = 'parent' // Always 'parent' when parentId exists
    }

    blocks.push(importedBlock)
  })

  // Convert edges from connections using shared parser
  Object.entries(yamlWorkflow.blocks).forEach(([blockId, yamlBlock]) => {
    const {
      edges: blockEdges,
      errors: connectionErrors,
      warnings: connectionWarnings,
    } = parseBlockConnections(blockId, yamlBlock.connections, yamlBlock.type)

    edges.push(...blockEdges)
    errors.push(...connectionErrors)
    warnings.push(...connectionWarnings)
  })

  // Sort blocks to ensure parents are created before children
  const sortedBlocks = sortBlocksByParentChildOrder(blocks)

  return { blocks: sortedBlocks, edges, errors, warnings }
}

/**
 * Create smart ID mapping that preserves existing block IDs and generates new ones for new blocks
 */
function createSmartIdMapping(
  yamlBlocks: ImportedBlock[],
  existingBlocks: Record<string, any>,
  activeWorkflowId: string,
  forceNewIds = false
): Map<string, string> {
  const yamlIdToActualId = new Map<string, string>()
  const existingBlockIds = new Set(Object.keys(existingBlocks))

  logger.info('Creating smart ID mapping', {
    activeWorkflowId,
    yamlBlockCount: yamlBlocks.length,
    existingBlockCount: Object.keys(existingBlocks).length,
    existingBlockIds: Array.from(existingBlockIds),
    yamlBlockIds: yamlBlocks.map((b) => b.id),
    forceNewIds,
  })

  for (const block of yamlBlocks) {
    if (forceNewIds || !existingBlockIds.has(block.id)) {
      // Force new ID or block ID doesn't exist in current workflow - generate new UUID
      const newId = uuidv4()
      yamlIdToActualId.set(block.id, newId)
      logger.info(
        `🆕 Mapping new block: ${block.id} -> ${newId} (${forceNewIds ? 'forced new ID' : `not found in workflow ${activeWorkflowId}`})`
      )
    } else {
      // Block ID exists in current workflow - preserve it
      yamlIdToActualId.set(block.id, block.id)
      logger.info(
        `✅ Preserving existing block ID: ${block.id} (exists in workflow ${activeWorkflowId})`
      )
    }
  }

  logger.info('Smart ID mapping completed', {
    mappings: Array.from(yamlIdToActualId.entries()),
    preservedCount: Array.from(yamlIdToActualId.entries()).filter(([old, new_]) => old === new_)
      .length,
    newCount: Array.from(yamlIdToActualId.entries()).filter(([old, new_]) => old !== new_).length,
  })

  return yamlIdToActualId
}
```

--------------------------------------------------------------------------------

````
