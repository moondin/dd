---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 439
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 439 of 933)

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

---[FILE: use-accessible-reference-prefixes.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/hooks/use-accessible-reference-prefixes.ts
Signals: React

```typescript
import { useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { BlockPathCalculator } from '@/lib/workflows/blocks/block-path-calculator'
import { SYSTEM_REFERENCE_PREFIXES } from '@/lib/workflows/sanitization/references'
import { normalizeBlockName } from '@/stores/workflows/utils'
import { useWorkflowStore } from '@/stores/workflows/workflow/store'
import type { Loop, Parallel } from '@/stores/workflows/workflow/types'

export function useAccessibleReferencePrefixes(blockId?: string | null): Set<string> | undefined {
  const { blocks, edges, loops, parallels } = useWorkflowStore(
    useShallow((state) => ({
      blocks: state.blocks,
      edges: state.edges,
      loops: state.loops || {},
      parallels: state.parallels || {},
    }))
  )

  return useMemo(() => {
    if (!blockId) {
      return undefined
    }

    const graphEdges = edges.map((edge) => ({ source: edge.source, target: edge.target }))
    const ancestorIds = BlockPathCalculator.findAllPathNodes(graphEdges, blockId)
    const accessibleIds = new Set<string>(ancestorIds)
    accessibleIds.add(blockId)

    const starterBlock = Object.values(blocks).find(
      (block) => block.type === 'starter' || block.type === 'start_trigger'
    )
    if (starterBlock && ancestorIds.includes(starterBlock.id)) {
      accessibleIds.add(starterBlock.id)
    }

    const loopValues = Object.values(loops as Record<string, Loop>)
    loopValues.forEach((loop) => {
      if (!loop?.nodes) return
      if (loop.nodes.includes(blockId)) {
        accessibleIds.add(loop.id) // Add the loop block itself
        loop.nodes.forEach((nodeId) => accessibleIds.add(nodeId))
      }
    })

    const parallelValues = Object.values(parallels as Record<string, Parallel>)
    parallelValues.forEach((parallel) => {
      if (!parallel?.nodes) return
      if (parallel.nodes.includes(blockId)) {
        accessibleIds.add(parallel.id) // Add the parallel block itself
        parallel.nodes.forEach((nodeId) => accessibleIds.add(nodeId))
      }
    })

    const prefixes = new Set<string>()
    accessibleIds.forEach((id) => {
      prefixes.add(normalizeBlockName(id))
      const block = blocks[id]
      if (block?.name) {
        prefixes.add(normalizeBlockName(block.name))
      }
    })

    SYSTEM_REFERENCE_PREFIXES.forEach((prefix) => prefixes.add(prefix))

    return prefixes
  }, [blockId, blocks, edges, loops, parallels])
}
```

--------------------------------------------------------------------------------

---[FILE: use-auto-layout.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/hooks/use-auto-layout.ts
Signals: React

```typescript
import { useCallback } from 'react'
import type { AutoLayoutOptions } from '../utils/auto-layout-utils'
import { applyAutoLayoutAndUpdateStore as applyAutoLayoutStandalone } from '../utils/auto-layout-utils'

export type { AutoLayoutOptions }

/**
 * Hook providing auto-layout functionality for workflows
 * Binds workflowId context and provides memoized callback for React components
 */
export function useAutoLayout(workflowId: string | null) {
  const applyAutoLayoutAndUpdateStore = useCallback(
    async (options: AutoLayoutOptions = {}) => {
      if (!workflowId) {
        return { success: false, error: 'No workflow ID provided' }
      }
      return applyAutoLayoutStandalone(workflowId, options)
    },
    [workflowId]
  )

  return {
    applyAutoLayoutAndUpdateStore,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-block-connections.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/hooks/use-block-connections.ts

```typescript
import { useShallow } from 'zustand/react/shallow'
import { createLogger } from '@/lib/logs/console/logger'
import { getBlockOutputs } from '@/lib/workflows/blocks/block-outputs'
import { BlockPathCalculator } from '@/lib/workflows/blocks/block-path-calculator'
import { TriggerUtils } from '@/lib/workflows/triggers/triggers'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'
import { useSubBlockStore } from '@/stores/workflows/subblock/store'
import { useWorkflowStore } from '@/stores/workflows/workflow/store'

const logger = createLogger('useBlockConnections')

interface Field {
  name: string
  type: string
  description?: string
}

export interface ConnectedBlock {
  id: string
  type: string
  outputType: string | string[]
  name: string
  responseFormat?: {
    // Support both formats
    fields?: Field[]
    name?: string
    schema?: {
      type: string
      properties: Record<string, any>
      required?: string[]
    }
  }
}

function parseResponseFormatSafely(responseFormatValue: any, blockId: string): any {
  if (!responseFormatValue) {
    return undefined
  }

  if (typeof responseFormatValue === 'object' && responseFormatValue !== null) {
    return responseFormatValue
  }

  if (typeof responseFormatValue === 'string') {
    const trimmedValue = responseFormatValue.trim()

    if (trimmedValue.startsWith('<') && trimmedValue.includes('>')) {
      return trimmedValue
    }

    if (trimmedValue === '') {
      return undefined
    }

    try {
      return JSON.parse(trimmedValue)
    } catch (error) {
      return undefined
    }
  }
  return undefined
}

// Helper function to extract fields from JSON Schema
function extractFieldsFromSchema(schema: any): Field[] {
  if (!schema || typeof schema !== 'object') {
    return []
  }

  // Handle legacy format with fields array
  if (Array.isArray(schema.fields)) {
    return schema.fields
  }

  // Handle new JSON Schema format
  const schemaObj = schema.schema || schema
  if (!schemaObj || !schemaObj.properties || typeof schemaObj.properties !== 'object') {
    return []
  }

  // Extract fields from schema properties
  return Object.entries(schemaObj.properties).map(([name, prop]: [string, any]) => ({
    name,
    type: prop.type || 'string',
    description: prop.description,
  }))
}

export function useBlockConnections(blockId: string) {
  const { edges, blocks } = useWorkflowStore(
    useShallow((state) => ({
      edges: state.edges,
      blocks: state.blocks,
    }))
  )

  const workflowId = useWorkflowRegistry((state) => state.activeWorkflowId)
  const workflowSubBlockValues = useSubBlockStore((state) =>
    workflowId ? (state.workflowValues[workflowId] ?? {}) : {}
  )

  // Helper function to merge block subBlocks with live values from subblock store
  const getMergedSubBlocks = (sourceBlockId: string): Record<string, any> => {
    const base = blocks[sourceBlockId]?.subBlocks || {}
    const live = workflowSubBlockValues?.[sourceBlockId] || {}
    const merged: Record<string, any> = { ...base }
    for (const [subId, liveVal] of Object.entries(live)) {
      merged[subId] = { ...(base[subId] || {}), value: liveVal }
    }
    return merged
  }

  // Filter out all incoming edges to trigger blocks - triggers are independent entry points
  // This ensures UI tags only show blocks that are actually connected in execution
  const filteredEdges = edges.filter((edge) => {
    const sourceBlock = blocks[edge.source]
    const targetBlock = blocks[edge.target]

    // If either block not found, keep the edge (might be in a different state structure)
    if (!sourceBlock || !targetBlock) {
      return true
    }

    const targetIsTrigger = TriggerUtils.isTriggerBlock({
      type: targetBlock.type,
      triggerMode: targetBlock.triggerMode,
    })

    // Filter out ALL incoming edges to trigger blocks
    // Triggers are independent entry points and should not have incoming connections
    return !targetIsTrigger
  })

  // Find all blocks along paths leading to this block (using filtered edges)
  const allPathNodeIds = BlockPathCalculator.findAllPathNodes(filteredEdges, blockId)

  // Map each path node to a ConnectedBlock structure
  const allPathConnections = allPathNodeIds
    .map((sourceId) => {
      const sourceBlock = blocks[sourceId]
      if (!sourceBlock) return null

      // Get merged subblocks for this source block
      const mergedSubBlocks = getMergedSubBlocks(sourceId)

      // Get the response format from the subblock store
      const responseFormatValue = useSubBlockStore.getState().getValue(sourceId, 'responseFormat')

      // Safely parse response format with proper error handling
      const responseFormat = parseResponseFormatSafely(responseFormatValue, sourceId)

      // Use getBlockOutputs to properly handle dynamic outputs from inputFormat
      const blockOutputs = getBlockOutputs(
        sourceBlock.type,
        mergedSubBlocks,
        sourceBlock.triggerMode
      )

      // Extract fields from the response format if available, otherwise use block outputs
      let outputFields: Field[]
      if (responseFormat) {
        outputFields = extractFieldsFromSchema(responseFormat)
      } else {
        // Convert block outputs to field format
        outputFields = Object.entries(blockOutputs).map(([key, value]: [string, any]) => ({
          name: key,
          type: value && typeof value === 'object' && 'type' in value ? value.type : 'string',
          description:
            value && typeof value === 'object' && 'description' in value
              ? value.description
              : undefined,
        }))
      }

      return {
        id: sourceBlock.id,
        type: sourceBlock.type,
        outputType: outputFields.map((field: Field) => field.name),
        name: sourceBlock.name,
        responseFormat,
      }
    })
    .filter(Boolean) as ConnectedBlock[]

  // Keep the original incoming connections for compatibility (using filtered edges)
  const directIncomingConnections = filteredEdges
    .filter((edge) => edge.target === blockId)
    .map((edge) => {
      const sourceBlock = blocks[edge.source]
      if (!sourceBlock) return null

      // Get merged subblocks for this source block
      const mergedSubBlocks = getMergedSubBlocks(edge.source)

      // Get the response format from the subblock store instead
      const responseFormatValue = useSubBlockStore
        .getState()
        .getValue(edge.source, 'responseFormat')

      // Safely parse response format with proper error handling
      const responseFormat = parseResponseFormatSafely(responseFormatValue, edge.source)

      // Use getBlockOutputs to properly handle dynamic outputs from inputFormat
      const blockOutputs = getBlockOutputs(
        sourceBlock.type,
        mergedSubBlocks,
        sourceBlock.triggerMode
      )

      // Extract fields from the response format if available, otherwise use block outputs
      let outputFields: Field[]
      if (responseFormat) {
        outputFields = extractFieldsFromSchema(responseFormat)
      } else {
        // Convert block outputs to field format
        outputFields = Object.entries(blockOutputs).map(([key, value]: [string, any]) => ({
          name: key,
          type: value && typeof value === 'object' && 'type' in value ? value.type : 'string',
          description:
            value && typeof value === 'object' && 'description' in value
              ? value.description
              : undefined,
        }))
      }

      return {
        id: sourceBlock.id,
        type: sourceBlock.type,
        outputType: outputFields.map((field: Field) => field.name),
        name: sourceBlock.name,
        responseFormat,
      }
    })
    .filter(Boolean) as ConnectedBlock[]

  return {
    incomingConnections: allPathConnections,
    directIncomingConnections,
    hasIncomingConnections: allPathConnections.length > 0,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-block-dimensions.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/hooks/use-block-dimensions.ts
Signals: React

```typescript
import { useEffect, useRef } from 'react'
import { useUpdateNodeInternals } from 'reactflow'
import { useWorkflowStore } from '@/stores/workflows/workflow/store'

// Re-export for backwards compatibility
export { BLOCK_DIMENSIONS, HANDLE_POSITIONS } from '@/lib/workflows/blocks/block-dimensions'

interface BlockDimensions {
  width: number
  height: number
}

interface UseBlockDimensionsOptions {
  blockId: string
  calculateDimensions: () => BlockDimensions
  dependencies: React.DependencyList
}

/**
 * Hook to manage deterministic block dimensions without ResizeObserver.
 * Calculates dimensions based on content structure and updates the store.
 *
 * @param options - Configuration for dimension calculation
 * @param options.blockId - The ID of the block
 * @param options.calculateDimensions - Function that returns current dimensions
 * @param options.dependencies - Dependencies that trigger recalculation
 */
export function useBlockDimensions({
  blockId,
  calculateDimensions,
  dependencies,
}: UseBlockDimensionsOptions) {
  const updateNodeInternals = useUpdateNodeInternals()
  const updateBlockLayoutMetrics = useWorkflowStore((state) => state.updateBlockLayoutMetrics)
  const previousDimensions = useRef<BlockDimensions | null>(null)

  useEffect(() => {
    const dimensions = calculateDimensions()
    const previous = previousDimensions.current

    if (!previous || previous.width !== dimensions.width || previous.height !== dimensions.height) {
      previousDimensions.current = dimensions
      updateBlockLayoutMetrics(blockId, dimensions)
      updateNodeInternals(blockId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockId, updateBlockLayoutMetrics, updateNodeInternals, ...dependencies])
}
```

--------------------------------------------------------------------------------

---[FILE: use-block-output-fields.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/hooks/use-block-output-fields.ts
Signals: React

```typescript
'use client'

import { useMemo } from 'react'
import { extractFieldsFromSchema } from '@/lib/core/utils/response-format'
import { getBlockOutputPaths, getBlockOutputs } from '@/lib/workflows/blocks/block-outputs'
import { TRIGGER_TYPES } from '@/lib/workflows/triggers/triggers'
import type { SchemaField } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/connection-blocks/components/field-item/field-item'
import { getBlock } from '@/blocks'
import type { BlockConfig } from '@/blocks/types'
import { useSubBlockStore } from '@/stores/workflows/subblock/store'
import { getTool } from '@/tools/utils'

const RESERVED_KEYS = new Set(['type', 'description'])

/**
 * Checks if a property is an object type
 */
const isObject = (prop: any): boolean => prop && typeof prop === 'object'

/**
 * Gets a subblock value from the store
 */
const getSubBlockValue = (blockId: string, property: string): any => {
  return useSubBlockStore.getState().getValue(blockId, property)
}

/**
 * Generates output paths for a tool-based block
 */
const generateToolOutputPaths = (blockConfig: BlockConfig, operation: string): string[] => {
  if (!blockConfig?.tools?.config?.tool) return []

  try {
    const toolId = blockConfig.tools.config.tool({ operation })
    if (!toolId) return []

    const toolConfig = getTool(toolId)
    if (!toolConfig?.outputs) return []

    return generateOutputPaths(toolConfig.outputs)
  } catch {
    return []
  }
}

/**
 * Recursively generates all output paths from an outputs schema
 */
const generateOutputPaths = (outputs: Record<string, any>, prefix = ''): string[] => {
  const paths: string[] = []

  for (const [key, value] of Object.entries(outputs)) {
    const currentPath = prefix ? `${prefix}.${key}` : key

    if (typeof value === 'string') {
      paths.push(currentPath)
    } else if (typeof value === 'object' && value !== null) {
      if ('type' in value && typeof value.type === 'string') {
        paths.push(currentPath)
        // Handle nested objects and arrays
        if (value.type === 'object' && value.properties) {
          paths.push(...generateOutputPaths(value.properties, currentPath))
        } else if (value.type === 'array' && value.items?.properties) {
          paths.push(...generateOutputPaths(value.items.properties, currentPath))
        } else if (
          value.type === 'array' &&
          value.items &&
          typeof value.items === 'object' &&
          !('type' in value.items)
        ) {
          paths.push(...generateOutputPaths(value.items, currentPath))
        }
      } else {
        const subPaths = generateOutputPaths(value, currentPath)
        paths.push(...subPaths)
      }
    } else {
      paths.push(currentPath)
    }
  }

  return paths
}

/**
 * Extracts nested fields from array or object properties
 */
const extractChildFields = (prop: any): SchemaField[] | undefined => {
  if (!isObject(prop)) return undefined

  if (prop.properties && isObject(prop.properties)) {
    return extractNestedFields(prop.properties)
  }

  if (prop.items?.properties && isObject(prop.items.properties)) {
    return extractNestedFields(prop.items.properties)
  }

  if (!('type' in prop)) {
    return extractNestedFields(prop)
  }

  if (prop.type === 'array') {
    const itemDefs = Object.fromEntries(
      Object.entries(prop).filter(([key]) => !RESERVED_KEYS.has(key))
    )
    if (Object.keys(itemDefs).length > 0) {
      return extractNestedFields(itemDefs)
    }
  }

  return undefined
}

/**
 * Recursively extracts nested fields from output properties
 */
const extractNestedFields = (properties: Record<string, any>): SchemaField[] => {
  return Object.entries(properties).map(([name, prop]) => {
    const baseType = isObject(prop) && typeof prop.type === 'string' ? prop.type : 'string'
    const type = isObject(prop) && !('type' in prop) ? 'object' : baseType

    return {
      name,
      type,
      description: isObject(prop) ? prop.description : undefined,
      children: extractChildFields(prop),
    }
  })
}

/**
 * Creates a schema field from an output definition
 */
const createFieldFromOutput = (
  name: string,
  output: any,
  responseFormatFields?: SchemaField[]
): SchemaField => {
  const hasExplicitType = isObject(output) && typeof output.type === 'string'
  const type = hasExplicitType ? output.type : isObject(output) ? 'object' : 'string'

  const field: SchemaField = {
    name,
    type,
    description: isObject(output) && 'description' in output ? output.description : undefined,
  }

  if (name === 'data' && responseFormatFields && responseFormatFields.length > 0) {
    field.children = responseFormatFields
  } else {
    field.children = extractChildFields(output)
  }

  return field
}

/**
 * Gets tool outputs for a block's operation
 */
const getToolOutputs = (
  blockConfig: BlockConfig | null,
  operation?: string
): Record<string, any> => {
  if (!blockConfig?.tools?.config?.tool || !operation) return {}

  try {
    const toolId = blockConfig.tools.config.tool({ operation })
    if (!toolId) return {}

    const toolConfig = getTool(toolId)
    return toolConfig?.outputs || {}
  } catch {
    return {}
  }
}

interface UseBlockOutputFieldsParams {
  blockId: string
  blockType: string
  mergedSubBlocks?: Record<string, any>
  responseFormat?: any
  operation?: string
  triggerMode?: boolean
}

/**
 * Hook that generates consistent block output fields using the same logic as tag-dropdown
 * Returns SchemaField[] format for use in connection-blocks component
 */
export function useBlockOutputFields({
  blockId,
  blockType,
  mergedSubBlocks,
  responseFormat,
  operation,
  triggerMode,
}: UseBlockOutputFieldsParams): SchemaField[] {
  return useMemo(() => {
    const blockConfig = getBlock(blockType)

    // Handle loop/parallel blocks without config
    if (!blockConfig && (blockType === 'loop' || blockType === 'parallel')) {
      return [
        {
          name: 'results',
          type: 'array',
          description: 'Array of results from the loop/parallel execution',
        },
      ]
    }

    if (!blockConfig) {
      return []
    }

    // Handle evaluator blocks - use metrics if available
    if (blockType === 'evaluator') {
      const metricsValue = mergedSubBlocks?.metrics?.value ?? getSubBlockValue(blockId, 'metrics')

      if (metricsValue && Array.isArray(metricsValue) && metricsValue.length > 0) {
        const validMetrics = metricsValue.filter((metric: { name?: string }) => metric?.name)
        return validMetrics.map((metric: { name: string }) => ({
          name: metric.name.toLowerCase(),
          type: 'number',
          description: `Metric: ${metric.name}`,
        }))
      }
      // Fall through to use blockConfig.outputs
    }

    // Handle variables blocks - use variable assignments if available
    if (blockType === 'variables') {
      const variablesValue =
        mergedSubBlocks?.variables?.value ?? getSubBlockValue(blockId, 'variables')

      if (variablesValue && Array.isArray(variablesValue) && variablesValue.length > 0) {
        const validAssignments = variablesValue.filter((assignment: { variableName?: string }) =>
          assignment?.variableName?.trim()
        )
        return validAssignments.map((assignment: { variableName: string }) => ({
          name: assignment.variableName.trim(),
          type: 'any',
          description: `Variable: ${assignment.variableName}`,
        }))
      }
      // Fall through to empty or default
      return []
    }

    // Get base outputs using getBlockOutputs (handles triggers, starter, approval, etc.)
    let baseOutputs: Record<string, any> = {}

    if (blockConfig.category === 'triggers' || blockType === 'starter') {
      // Use getBlockOutputPaths to get dynamic outputs, then reconstruct the structure
      const outputPaths = getBlockOutputPaths(blockType, mergedSubBlocks, triggerMode)
      if (outputPaths.length > 0) {
        // Reconstruct outputs structure from paths
        // This is a simplified approach - we'll use the paths to build the structure
        baseOutputs = getBlockOutputs(blockType, mergedSubBlocks, triggerMode)
      } else if (blockType === 'starter') {
        const startWorkflowValue = mergedSubBlocks?.startWorkflow?.value
        if (startWorkflowValue === 'chat') {
          baseOutputs = {
            input: { type: 'string', description: 'User message' },
            conversationId: { type: 'string', description: 'Conversation ID' },
            files: { type: 'files', description: 'Uploaded files' },
          }
        } else {
          const inputFormatValue = mergedSubBlocks?.inputFormat?.value
          if (inputFormatValue && Array.isArray(inputFormatValue) && inputFormatValue.length > 0) {
            baseOutputs = {}
            inputFormatValue.forEach((field: { name?: string; type?: string }) => {
              if (field.name && field.name.trim() !== '') {
                baseOutputs[field.name] = {
                  type: field.type || 'string',
                  description: `Field from input format`,
                }
              }
            })
          }
        }
      } else if (blockType === TRIGGER_TYPES.GENERIC_WEBHOOK) {
        // Generic webhook returns the whole payload
        baseOutputs = {}
      } else {
        baseOutputs = {}
      }
    } else if (triggerMode && blockConfig.triggers?.enabled) {
      // Trigger mode enabled
      const dynamicOutputs = getBlockOutputPaths(blockType, mergedSubBlocks, true)
      if (dynamicOutputs.length > 0) {
        baseOutputs = getBlockOutputs(blockType, mergedSubBlocks, true)
      } else {
        baseOutputs = blockConfig.outputs || {}
      }
    } else if (blockType === 'approval') {
      // Approval block uses dynamic outputs from inputFormat
      baseOutputs = getBlockOutputs(blockType, mergedSubBlocks)
    } else {
      // For tool-based blocks, try to get tool outputs first
      const operationValue =
        operation ?? mergedSubBlocks?.operation?.value ?? getSubBlockValue(blockId, 'operation')
      const toolOutputs = operationValue ? getToolOutputs(blockConfig, operationValue) : {}

      if (Object.keys(toolOutputs).length > 0) {
        baseOutputs = toolOutputs
      } else {
        // Use getBlockOutputs which handles inputFormat merging
        baseOutputs = getBlockOutputs(blockType, mergedSubBlocks, triggerMode)
      }
    }

    // Handle responseFormat
    const responseFormatFields = responseFormat ? extractFieldsFromSchema(responseFormat) : []

    // If responseFormat exists and has fields, merge with base outputs
    if (responseFormatFields.length > 0) {
      // If base outputs is empty, use responseFormat fields directly
      if (Object.keys(baseOutputs).length === 0) {
        return responseFormatFields.map((field) => ({
          name: field.name,
          type: field.type,
          description: field.description,
          children: undefined, // ResponseFormat fields are flat
        }))
      }

      // Otherwise, merge: responseFormat takes precedence for 'data' field
      const fields: SchemaField[] = []
      const responseFormatFieldNames = new Set(responseFormatFields.map((f) => f.name))

      // Add base outputs, replacing 'data' with responseFormat fields if present
      for (const [name, output] of Object.entries(baseOutputs)) {
        if (name === 'data' && responseFormatFields.length > 0) {
          fields.push(
            createFieldFromOutput(
              name,
              output,
              responseFormatFields.map((f) => ({
                name: f.name,
                type: f.type,
                description: f.description,
              }))
            )
          )
        } else if (!responseFormatFieldNames.has(name)) {
          fields.push(createFieldFromOutput(name, output))
        }
      }

      // Add responseFormat fields that aren't in base outputs
      for (const field of responseFormatFields) {
        if (!baseOutputs[field.name]) {
          fields.push({
            name: field.name,
            type: field.type,
            description: field.description,
          })
        }
      }

      return fields
    }

    // No responseFormat, just use base outputs
    if (Object.keys(baseOutputs).length === 0) {
      return []
    }

    return Object.entries(baseOutputs).map(([name, output]) => createFieldFromOutput(name, output))
  }, [blockId, blockType, mergedSubBlocks, responseFormat, operation, triggerMode])
}
```

--------------------------------------------------------------------------------

---[FILE: use-block-visual.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/hooks/use-block-visual.ts
Signals: React

```typescript
import { useCallback, useMemo } from 'react'
import { useBlockState } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/workflow-block/hooks'
import type { WorkflowBlockProps } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/workflow-block/types'
import { useCurrentWorkflow } from '@/app/workspace/[workspaceId]/w/[workflowId]/hooks/use-current-workflow'
import { getBlockRingStyles } from '@/app/workspace/[workspaceId]/w/[workflowId]/utils/block-ring-utils'
import { useExecutionStore } from '@/stores/execution/store'
import { usePanelEditorStore } from '@/stores/panel/editor/store'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'

/**
 * Props for the useBlockVisual hook.
 */
interface UseBlockVisualProps {
  /** The unique identifier of the block */
  blockId: string
  /** Block data including type, config, and preview state */
  data: WorkflowBlockProps
  /** Whether the block is pending execution */
  isPending?: boolean
}

/**
 * Provides visual state and interaction handlers for workflow blocks.
 * Computes ring styling based on execution, focus, diff, and run path states.
 * In preview mode, all interactive and execution-related visual states are disabled.
 *
 * @param props - The hook properties
 * @returns Visual state, click handler, and ring styling for the block
 */
export function useBlockVisual({ blockId, data, isPending = false }: UseBlockVisualProps) {
  const isPreview = data.isPreview ?? false

  const currentWorkflow = useCurrentWorkflow()
  const activeWorkflowId = useWorkflowRegistry((state) => state.activeWorkflowId)

  const {
    isEnabled,
    isActive: blockIsActive,
    diffStatus,
    isDeletedBlock,
  } = useBlockState(blockId, currentWorkflow, data)

  const isActive = isPreview ? false : blockIsActive

  const lastRunPath = useExecutionStore((state) => state.lastRunPath)
  const runPathStatus = isPreview ? undefined : lastRunPath.get(blockId)

  const setCurrentBlockId = usePanelEditorStore((state) => state.setCurrentBlockId)
  const currentBlockId = usePanelEditorStore((state) => state.currentBlockId)
  const isFocused = isPreview ? false : currentBlockId === blockId

  const handleClick = useCallback(() => {
    if (!isPreview) {
      setCurrentBlockId(blockId)
    }
  }, [blockId, setCurrentBlockId, isPreview])

  const { hasRing, ringClassName: ringStyles } = useMemo(
    () =>
      getBlockRingStyles({
        isActive,
        isPending: isPreview ? false : isPending,
        isFocused,
        isDeletedBlock: isPreview ? false : isDeletedBlock,
        diffStatus: isPreview ? undefined : diffStatus,
        runPathStatus,
      }),
    [isActive, isPending, isFocused, isDeletedBlock, diffStatus, runPathStatus, isPreview]
  )

  return {
    currentWorkflow,
    activeWorkflowId,
    isEnabled,
    handleClick,
    hasRing,
    ringStyles,
    runPathStatus,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-current-workflow.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/hooks/use-current-workflow.ts
Signals: React

```typescript
import { useMemo } from 'react'
import type { Edge } from 'reactflow'
import { useShallow } from 'zustand/react/shallow'
import { useWorkflowDiffStore } from '@/stores/workflow-diff/store'
import type { DeploymentStatus } from '@/stores/workflows/registry/types'
import { useWorkflowStore } from '@/stores/workflows/workflow/store'
import type { BlockState, Loop, Parallel, WorkflowState } from '@/stores/workflows/workflow/types'

/**
 * Interface for the current workflow abstraction
 */
export interface CurrentWorkflow {
  // Current workflow state properties
  blocks: Record<string, BlockState>
  edges: Edge[]
  loops: Record<string, Loop>
  parallels: Record<string, Parallel>
  lastSaved?: number
  isDeployed?: boolean
  deployedAt?: Date
  deploymentStatuses?: Record<string, DeploymentStatus>
  needsRedeployment?: boolean

  // Mode information
  isDiffMode: boolean
  isNormalMode: boolean
  isSnapshotView: boolean

  // Full workflow state (for cases that need the complete object)
  workflowState: WorkflowState

  // Helper methods
  getBlockById: (blockId: string) => BlockState | undefined
  getBlockCount: () => number
  getEdgeCount: () => number
  hasBlocks: () => boolean
  hasEdges: () => boolean
}

/**
 * Clean abstraction for accessing the current workflow state.
 * Automatically handles diff vs normal mode without exposing the complexity to consumers.
 */
export function useCurrentWorkflow(): CurrentWorkflow {
  // Get normal workflow state - optimized with shallow comparison
  const normalWorkflow = useWorkflowStore(
    useShallow((state) => ({
      blocks: state.blocks,
      edges: state.edges,
      loops: state.loops,
      parallels: state.parallels,
      lastSaved: state.lastSaved,
      isDeployed: state.isDeployed,
      deployedAt: state.deployedAt,
      deploymentStatuses: state.deploymentStatuses,
      needsRedeployment: state.needsRedeployment,
    }))
  )

  // Get diff state - optimized with shallow comparison
  const { isShowingDiff, isDiffReady, hasActiveDiff, baselineWorkflow } = useWorkflowDiffStore(
    useShallow((state) => ({
      isShowingDiff: state.isShowingDiff,
      isDiffReady: state.isDiffReady,
      hasActiveDiff: state.hasActiveDiff,
      baselineWorkflow: state.baselineWorkflow,
    }))
  )

  // Create the abstracted interface - optimized to prevent unnecessary re-renders
  const currentWorkflow = useMemo((): CurrentWorkflow => {
    // Determine which workflow to use
    const isSnapshotView =
      Boolean(baselineWorkflow) && hasActiveDiff && isDiffReady && !isShowingDiff

    const activeWorkflow = isSnapshotView ? (baselineWorkflow as WorkflowState) : normalWorkflow

    return {
      // Current workflow state
      blocks: activeWorkflow.blocks || {},
      edges: activeWorkflow.edges || [],
      loops: activeWorkflow.loops || {},
      parallels: activeWorkflow.parallels || {},
      lastSaved: activeWorkflow.lastSaved,
      isDeployed: activeWorkflow.isDeployed,
      deployedAt: activeWorkflow.deployedAt,
      deploymentStatuses: activeWorkflow.deploymentStatuses,
      needsRedeployment: activeWorkflow.needsRedeployment,

      // Mode information - update to reflect ready state
      isDiffMode: hasActiveDiff && isShowingDiff,
      isNormalMode: !hasActiveDiff || (!isShowingDiff && !isSnapshotView),
      isSnapshotView: Boolean(isSnapshotView),

      // Full workflow state (for cases that need the complete object)
      workflowState: activeWorkflow as WorkflowState,

      // Helper methods
      getBlockById: (blockId: string) => activeWorkflow.blocks?.[blockId],
      getBlockCount: () => Object.keys(activeWorkflow.blocks || {}).length,
      getEdgeCount: () => (activeWorkflow.edges || []).length,
      hasBlocks: () => Object.keys(activeWorkflow.blocks || {}).length > 0,
      hasEdges: () => (activeWorkflow.edges || []).length > 0,
    }
  }, [normalWorkflow, isShowingDiff, isDiffReady, hasActiveDiff, baselineWorkflow])

  return currentWorkflow
}
```

--------------------------------------------------------------------------------

````
