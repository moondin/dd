---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 641
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 641 of 933)

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
Location: sim-main/apps/sim/stores/workflows/utils.ts

```typescript
import { useSubBlockStore } from '@/stores/workflows/subblock/store'
import type { BlockState, SubBlockState } from '@/stores/workflows/workflow/types'

/**
 * Normalizes a block name for comparison by converting to lowercase and removing spaces
 * @param name - The block name to normalize
 * @returns The normalized name
 */
export function normalizeBlockName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '')
}

/**
 * Generates a unique block name by finding the highest number suffix among existing blocks
 * with the same base name and incrementing it
 * @param baseName - The base name for the block (e.g., "API 1", "Agent", "Loop 3")
 * @param existingBlocks - Record of existing blocks to check against
 * @returns A unique block name with an appropriate number suffix
 */
export function getUniqueBlockName(baseName: string, existingBlocks: Record<string, any>): string {
  // Special case: Start blocks should always be named "Start" without numbers
  // This applies to both "Start" and "Starter" base names
  const normalizedBaseName = normalizeBlockName(baseName)
  if (normalizedBaseName === 'start' || normalizedBaseName === 'starter') {
    return 'Start'
  }

  const baseNameMatch = baseName.match(/^(.*?)(\s+\d+)?$/)
  const namePrefix = baseNameMatch ? baseNameMatch[1].trim() : baseName

  const normalizedBase = normalizeBlockName(namePrefix)

  const existingNumbers = Object.values(existingBlocks)
    .filter((block) => {
      const blockNameMatch = block.name?.match(/^(.*?)(\s+\d+)?$/)
      const blockPrefix = blockNameMatch ? blockNameMatch[1].trim() : block.name
      return blockPrefix && normalizeBlockName(blockPrefix) === normalizedBase
    })
    .map((block) => {
      const match = block.name?.match(/(\d+)$/)
      return match ? Number.parseInt(match[1], 10) : 0
    })

  const maxNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0

  if (maxNumber === 0 && existingNumbers.length === 0) {
    return `${namePrefix} 1`
  }

  return `${namePrefix} ${maxNumber + 1}`
}

/**
 * Merges workflow block states with subblock values while maintaining block structure
 * @param blocks - Block configurations from workflow store
 * @param workflowId - ID of the workflow to merge values for
 * @param blockId - Optional specific block ID to merge (merges all if not provided)
 * @returns Merged block states with updated values
 */
export function mergeSubblockState(
  blocks: Record<string, BlockState>,
  workflowId?: string,
  blockId?: string
): Record<string, BlockState> {
  const blocksToProcess = blockId ? { [blockId]: blocks[blockId] } : blocks
  const subBlockStore = useSubBlockStore.getState()

  // Get all the values stored in the subblock store for this workflow
  const workflowSubblockValues = workflowId ? subBlockStore.workflowValues[workflowId] || {} : {}

  return Object.entries(blocksToProcess).reduce(
    (acc, [id, block]) => {
      // Skip if block is undefined
      if (!block) {
        return acc
      }

      // Initialize subBlocks if not present
      const blockSubBlocks = block.subBlocks || {}

      // Get stored values for this block
      const blockValues = workflowSubblockValues[id] || {}

      // Create a deep copy of the block's subBlocks to maintain structure
      const mergedSubBlocks = Object.entries(blockSubBlocks).reduce(
        (subAcc, [subBlockId, subBlock]) => {
          // Skip if subBlock is undefined
          if (!subBlock) {
            return subAcc
          }

          // Get the stored value for this subblock
          let storedValue = null

          // If workflowId is provided, use it to get the value
          if (workflowId) {
            // Try to get the value from the subblock store for this specific workflow
            if (blockValues[subBlockId] !== undefined) {
              storedValue = blockValues[subBlockId]
            }
          } else {
            // Fall back to the active workflow if no workflowId is provided
            storedValue = subBlockStore.getValue(id, subBlockId)
          }

          // Create a new subblock object with the same structure but updated value
          subAcc[subBlockId] = {
            ...subBlock,
            value: storedValue !== undefined && storedValue !== null ? storedValue : subBlock.value,
          }

          return subAcc
        },
        {} as Record<string, SubBlockState>
      )

      // Add any values that exist in the store but aren't in the block structure
      // This handles cases where block config has been updated but values still exist
      // IMPORTANT: This includes runtime subblock IDs like webhookId, triggerPath, etc.
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

      // Return the full block state with updated subBlocks (including orphaned values)
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
 * Asynchronously merges workflow block states with subblock values
 * Ensures all values are properly resolved before returning
 *
 * @param blocks - Block configurations from workflow store
 * @param workflowId - ID of the workflow to merge values for
 * @param blockId - Optional specific block ID to merge (merges all if not provided)
 * @returns Promise resolving to merged block states with updated values
 */
export async function mergeSubblockStateAsync(
  blocks: Record<string, BlockState>,
  workflowId?: string,
  blockId?: string
): Promise<Record<string, BlockState>> {
  const blocksToProcess = blockId ? { [blockId]: blocks[blockId] } : blocks
  const subBlockStore = useSubBlockStore.getState()

  // Process blocks in parallel for better performance
  const processedBlockEntries = await Promise.all(
    Object.entries(blocksToProcess).map(async ([id, block]) => {
      // Skip if block is undefined or doesn't have subBlocks
      if (!block || !block.subBlocks) {
        return [id, block] as const
      }

      // Process all subblocks in parallel
      const subBlockEntries = await Promise.all(
        Object.entries(block.subBlocks).map(async ([subBlockId, subBlock]) => {
          // Skip if subBlock is undefined
          if (!subBlock) {
            return null
          }

          let storedValue = null

          if (workflowId) {
            const workflowValues = subBlockStore.workflowValues[workflowId]
            if (workflowValues?.[id]) {
              storedValue = workflowValues[id][subBlockId]
            }
          } else {
            storedValue = subBlockStore.getValue(id, subBlockId)
          }

          return [
            subBlockId,
            {
              ...subBlock,
              value:
                storedValue !== undefined && storedValue !== null ? storedValue : subBlock.value,
            },
          ] as const
        })
      )

      // Convert entries back to an object
      const mergedSubBlocks = Object.fromEntries(
        subBlockEntries.filter((entry): entry is readonly [string, SubBlockState] => entry !== null)
      ) as Record<string, SubBlockState>

      // Return the full block state with updated subBlocks
      return [
        id,
        {
          ...block,
          subBlocks: mergedSubBlocks,
        },
      ] as const
    })
  )

  // Convert entries back to an object
  return Object.fromEntries(processedBlockEntries) as Record<string, BlockState>
}
```

--------------------------------------------------------------------------------

---[FILE: importer.ts]---
Location: sim-main/apps/sim/stores/workflows/json/importer.ts
Signals: Zod

```typescript
import { v4 as uuidv4 } from 'uuid'
import { createLogger } from '@/lib/logs/console/logger'
import { TRIGGER_RUNTIME_SUBBLOCK_IDS } from '@/triggers/constants'
import type { WorkflowState } from '../workflow/types'

const logger = createLogger('WorkflowJsonImporter')

/**
 * Generate new IDs for all blocks and edges to avoid conflicts
 */
function regenerateIds(workflowState: WorkflowState): WorkflowState {
  const { metadata, variables } = workflowState
  const blockIdMap = new Map<string, string>()
  const newBlocks: WorkflowState['blocks'] = {}

  // First pass: create new IDs for all blocks
  Object.entries(workflowState.blocks).forEach(([oldId, block]) => {
    const newId = uuidv4()
    blockIdMap.set(oldId, newId)
    newBlocks[newId] = {
      ...block,
      id: newId,
    }
  })

  // Second pass: update edges with new block IDs
  const newEdges = workflowState.edges.map((edge) => ({
    ...edge,
    id: uuidv4(), // Generate new edge ID
    source: blockIdMap.get(edge.source) || edge.source,
    target: blockIdMap.get(edge.target) || edge.target,
  }))

  // Third pass: update loops with new block IDs
  // CRITICAL: Loop IDs must match their block IDs (loops are keyed by their block ID)
  const newLoops: WorkflowState['loops'] = {}
  if (workflowState.loops) {
    Object.entries(workflowState.loops).forEach(([oldLoopId, loop]) => {
      // Map the loop ID using the block ID mapping (loop ID = block ID)
      const newLoopId = blockIdMap.get(oldLoopId) || oldLoopId
      newLoops[newLoopId] = {
        ...loop,
        id: newLoopId,
        nodes: loop.nodes.map((nodeId) => blockIdMap.get(nodeId) || nodeId),
      }
    })
  }

  // Fourth pass: update parallels with new block IDs
  // CRITICAL: Parallel IDs must match their block IDs (parallels are keyed by their block ID)
  const newParallels: WorkflowState['parallels'] = {}
  if (workflowState.parallels) {
    Object.entries(workflowState.parallels).forEach(([oldParallelId, parallel]) => {
      // Map the parallel ID using the block ID mapping (parallel ID = block ID)
      const newParallelId = blockIdMap.get(oldParallelId) || oldParallelId
      newParallels[newParallelId] = {
        ...parallel,
        id: newParallelId,
        nodes: parallel.nodes.map((nodeId) => blockIdMap.get(nodeId) || nodeId),
      }
    })
  }

  // Fifth pass: update any block references in subblock values and clear runtime trigger values
  Object.entries(newBlocks).forEach(([blockId, block]) => {
    if (block.subBlocks) {
      Object.entries(block.subBlocks).forEach(([subBlockId, subBlock]) => {
        if (TRIGGER_RUNTIME_SUBBLOCK_IDS.includes(subBlockId)) {
          block.subBlocks[subBlockId] = {
            ...subBlock,
            value: null,
          }
          return
        }

        if (subBlock.value && typeof subBlock.value === 'string') {
          // Replace any block references in the value
          let updatedValue = subBlock.value
          blockIdMap.forEach((newId, oldId) => {
            // Replace references like <blockId.output> with new IDs
            const regex = new RegExp(`<${oldId}\\.`, 'g')
            updatedValue = updatedValue.replace(regex, `<${newId}.`)
          })
          block.subBlocks[subBlockId] = {
            ...subBlock,
            value: updatedValue,
          }
        }
      })
    }

    // Update parentId references in block.data
    if (block.data?.parentId) {
      const newParentId = blockIdMap.get(block.data.parentId)
      if (newParentId) {
        block.data.parentId = newParentId
      } else {
        // Parent ID not in mapping - this shouldn't happen but log it
        logger.warn(`Block ${blockId} references unmapped parent ${block.data.parentId}`)
        // Remove invalid parent reference
        block.data.parentId = undefined
        block.data.extent = undefined
      }
    }
  })

  return {
    blocks: newBlocks,
    edges: newEdges,
    loops: newLoops,
    parallels: newParallels,
    metadata,
    variables,
  }
}

/**
 * Normalize subblock values by converting empty strings to null.
 * This provides backwards compatibility for workflows exported before the null sanitization fix,
 * preventing Zod validation errors like "Expected array, received string".
 */
function normalizeSubblockValues(blocks: Record<string, any>): Record<string, any> {
  const normalizedBlocks: Record<string, any> = {}

  Object.entries(blocks).forEach(([blockId, block]) => {
    const normalizedBlock = { ...block }

    if (block.subBlocks) {
      const normalizedSubBlocks: Record<string, any> = {}

      Object.entries(block.subBlocks).forEach(([subBlockId, subBlock]: [string, any]) => {
        const normalizedSubBlock = { ...subBlock }

        // Convert empty strings to null for consistency
        if (normalizedSubBlock.value === '') {
          normalizedSubBlock.value = null
        }

        normalizedSubBlocks[subBlockId] = normalizedSubBlock
      })

      normalizedBlock.subBlocks = normalizedSubBlocks
    }

    normalizedBlocks[blockId] = normalizedBlock
  })

  return normalizedBlocks
}

export function parseWorkflowJson(
  jsonContent: string,
  regenerateIdsFlag = true
): {
  data: WorkflowState | null
  errors: string[]
} {
  const errors: string[] = []

  try {
    // Parse JSON content
    let data: any
    try {
      data = JSON.parse(jsonContent)
    } catch (parseError) {
      errors.push(
        `Invalid JSON: ${parseError instanceof Error ? parseError.message : 'Parse error'}`
      )
      return { data: null, errors }
    }

    // Validate top-level structure
    if (!data || typeof data !== 'object') {
      errors.push('Invalid JSON: Root must be an object')
      return { data: null, errors }
    }

    // Handle new export format (version/exportedAt/state) or old format (blocks/edges at root)
    let workflowData: any
    if (data.version && data.state) {
      // New format with versioning
      logger.info('Parsing workflow JSON with version', {
        version: data.version,
        exportedAt: data.exportedAt,
      })
      workflowData = data.state
    } else {
      // Old format - blocks/edges at root level
      logger.info('Parsing legacy workflow JSON format')
      workflowData = data
    }

    // Validate required fields
    if (!workflowData.blocks || typeof workflowData.blocks !== 'object') {
      errors.push('Missing or invalid field: blocks')
      return { data: null, errors }
    }

    if (!Array.isArray(workflowData.edges)) {
      errors.push('Missing or invalid field: edges (must be an array)')
      return { data: null, errors }
    }

    // Validate blocks have required fields
    Object.entries(workflowData.blocks).forEach(([blockId, block]: [string, any]) => {
      if (!block || typeof block !== 'object') {
        errors.push(`Invalid block ${blockId}: must be an object`)
        return
      }

      if (!block.id) {
        errors.push(`Block ${blockId} missing required field: id`)
      }
      if (!block.type) {
        errors.push(`Block ${blockId} missing required field: type`)
      }
      if (
        !block.position ||
        typeof block.position.x !== 'number' ||
        typeof block.position.y !== 'number'
      ) {
        errors.push(`Block ${blockId} missing or invalid position`)
      }
    })

    // Validate edges have required fields
    workflowData.edges.forEach((edge: any, index: number) => {
      if (!edge || typeof edge !== 'object') {
        errors.push(`Invalid edge at index ${index}: must be an object`)
        return
      }

      if (!edge.id) {
        errors.push(`Edge at index ${index} missing required field: id`)
      }
      if (!edge.source) {
        errors.push(`Edge at index ${index} missing required field: source`)
      }
      if (!edge.target) {
        errors.push(`Edge at index ${index} missing required field: target`)
      }
    })

    // If there are errors, return null
    if (errors.length > 0) {
      return { data: null, errors }
    }

    // Normalize non-string subblock values (convert empty strings to null)
    // This handles exported workflows that may have empty strings for non-string types
    const normalizedBlocks = normalizeSubblockValues(workflowData.blocks || {})

    // Construct the workflow state with defaults
    let workflowState: WorkflowState = {
      blocks: normalizedBlocks,
      edges: workflowData.edges || [],
      loops: workflowData.loops || {},
      parallels: workflowData.parallels || {},
      metadata: workflowData.metadata,
      variables: Array.isArray(workflowData.variables) ? workflowData.variables : undefined,
    }

    // Regenerate IDs if requested (default: true)
    if (regenerateIdsFlag) {
      const regeneratedState = regenerateIds(workflowState)
      workflowState = {
        ...regeneratedState,
        metadata: workflowState.metadata,
        variables: workflowState.variables,
      }
      logger.info('Regenerated IDs for imported workflow to avoid conflicts')
    }

    logger.info('Successfully parsed workflow JSON', {
      blocksCount: Object.keys(workflowState.blocks).length,
      edgesCount: workflowState.edges.length,
      loopsCount: Object.keys(workflowState.loops).length,
      parallelsCount: Object.keys(workflowState.parallels).length,
    })

    return { data: workflowState, errors: [] }
  } catch (error) {
    logger.error('Failed to parse workflow JSON:', error)
    errors.push(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    return { data: null, errors }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: store.ts]---
Location: sim-main/apps/sim/stores/workflows/json/store.ts

```typescript
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { createLogger } from '@/lib/logs/console/logger'
import {
  type ExportWorkflowState,
  sanitizeForExport,
} from '@/lib/workflows/sanitization/json-sanitizer'
import { getWorkflowWithValues } from '@/stores/workflows'
import { useWorkflowRegistry } from '../registry/store'

const logger = createLogger('WorkflowJsonStore')

interface WorkflowJsonStore {
  json: string
  lastGenerated?: number

  generateJson: () => void
  getJson: () => Promise<string>
  refreshJson: () => void
}

export const useWorkflowJsonStore = create<WorkflowJsonStore>()(
  devtools(
    (set, get) => ({
      json: '',
      lastGenerated: undefined,

      generateJson: () => {
        const { activeWorkflowId, workflows } = useWorkflowRegistry.getState()

        if (!activeWorkflowId) {
          logger.warn('No active workflow to generate JSON for')
          return
        }

        try {
          const workflow = getWorkflowWithValues(activeWorkflowId)

          if (!workflow || !workflow.state) {
            logger.warn('No workflow state found for ID:', activeWorkflowId)
            return
          }

          const workflowMetadata = workflows[activeWorkflowId]
          const { useVariablesStore } = require('@/stores/panel/variables/store')
          const workflowVariables = useVariablesStore
            .getState()
            .getVariablesByWorkflowId(activeWorkflowId)

          const workflowState = {
            ...workflow.state,
            metadata: {
              name: workflowMetadata?.name,
              description: workflowMetadata?.description,
              exportedAt: new Date().toISOString(),
            },
            variables: workflowVariables.map((v: any) => ({
              id: v.id,
              name: v.name,
              type: v.type,
              value: v.value,
            })),
          }

          const exportState: ExportWorkflowState = sanitizeForExport(workflowState)

          // Convert to formatted JSON
          const jsonString = JSON.stringify(exportState, null, 2)

          set({
            json: jsonString,
            lastGenerated: Date.now(),
          })

          logger.info('Workflow JSON generated successfully', {
            version: exportState.version,
            exportedAt: exportState.exportedAt,
            blocksCount: Object.keys(exportState.state.blocks).length,
            edgesCount: exportState.state.edges.length,
            jsonLength: jsonString.length,
          })
        } catch (error) {
          logger.error('Failed to generate JSON:', error)
        }
      },

      getJson: async () => {
        const currentTime = Date.now()
        const { json, lastGenerated } = get()

        // Auto-refresh if data is stale (older than 1 second) or never generated
        if (!lastGenerated || currentTime - lastGenerated > 1000) {
          get().generateJson()
          return get().json
        }

        return json
      },

      refreshJson: () => {
        get().generateJson()
      },
    }),
    {
      name: 'workflow-json-store',
    }
  )
)
```

--------------------------------------------------------------------------------

````
