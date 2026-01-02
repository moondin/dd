---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 430
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 430 of 933)

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

---[FILE: use-block-connections.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/hooks/use-block-connections.ts

```typescript
import { useShallow } from 'zustand/react/shallow'
import {
  extractFieldsFromSchema,
  parseResponseFormatSafely,
} from '@/lib/core/utils/response-format'
import { getBlockOutputs } from '@/lib/workflows/blocks/block-outputs'
import { BlockPathCalculator } from '@/lib/workflows/blocks/block-path-calculator'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'
import { useSubBlockStore } from '@/stores/workflows/subblock/store'
import { useWorkflowStore } from '@/stores/workflows/workflow/store'

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
  outputs?: Record<string, any>
  operation?: string
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

  // Early return if block doesn't exist or has no incoming edges
  // This prevents triggers and unconnected blocks from showing phantom connections
  const directIncomingEdges = edges.filter((edge) => edge.target === blockId)

  if (!blocks[blockId] || directIncomingEdges.length === 0) {
    return {
      incomingConnections: [],
      hasIncomingConnections: false,
    }
  }

  // Find all blocks along paths leading to this block using BlockPathCalculator
  // This returns blocks that are connected via edges in the execution path
  const pathNodeIds = BlockPathCalculator.findAllPathNodes(edges, blockId)

  // Calculate distances for sorting (closest blocks first)
  const nodeDistances = new Map<string, number>()
  const visited = new Set<string>()
  const queue: [string, number][] = [[blockId, 0]]

  // BFS to calculate distances
  while (queue.length > 0) {
    const [currentNodeId, distance] = queue.shift()!
    if (visited.has(currentNodeId)) continue

    visited.add(currentNodeId)
    nodeDistances.set(currentNodeId, distance)

    // Find incoming edges
    const incomingEdges = edges.filter((edge) => edge.target === currentNodeId)
    for (const edge of incomingEdges) {
      if (!visited.has(edge.source)) {
        queue.push([edge.source, distance + 1])
      }
    }
  }

  // Map path nodes to ConnectedBlock structures and sort by distance
  const incomingConnections = pathNodeIds
    .map((sourceId) => {
      const sourceBlock = blocks[sourceId]
      if (!sourceBlock) return null

      // Get merged subblocks for this source block
      const mergedSubBlocks = getMergedSubBlocks(sourceId)

      // Get the response format from the subblock store
      const responseFormatValue = useSubBlockStore.getState().getValue(sourceId, 'responseFormat')

      // Safely parse response format with proper error handling
      const responseFormat = parseResponseFormatSafely(responseFormatValue, sourceId)

      // Get operation value for tool-based blocks
      const operationValue = useSubBlockStore.getState().getValue(sourceId, 'operation')

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
        outputs: blockOutputs,
        operation: operationValue,
        distance: nodeDistances.get(sourceId) || Number.POSITIVE_INFINITY,
      }
    })
    .filter((conn): conn is NonNullable<typeof conn> => conn !== null)
    .sort((a, b) => a.distance - b.distance) // Sort by distance, closest first
    .map(({ distance: _distance, ...conn }) => conn) as ConnectedBlock[] // Remove distance from final result

  return {
    incomingConnections,
    hasIncomingConnections: incomingConnections.length > 0,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-connections-resize.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/hooks/use-connections-resize.ts
Signals: React

```typescript
import { useCallback, useEffect, useRef, useState } from 'react'
import { usePanelEditorStore } from '@/stores/panel/editor/store'

/**
 * Minimum height for the connections section (header only)
 */
const MIN_CONNECTIONS_HEIGHT = 30
/**
 * Maximum height for the connections section
 */
const MAX_CONNECTIONS_HEIGHT = 300

/**
 * Props for the useConnectionsResize hook
 */
interface UseConnectionsResizeProps {
  /** Reference to the subblocks section to calculate available space */
  subBlocksRef: React.RefObject<HTMLDivElement | null>
}

/**
 * Custom hook to handle connections section resize functionality.
 * Manages the resizing of the connections section within the editor view.
 *
 * @param props - Configuration object containing section refs
 * @param props.subBlocksRef - Reference to the subblocks section for boundary calculations
 * @returns Object containing resize handler
 */
export function useConnectionsResize({ subBlocksRef }: UseConnectionsResizeProps) {
  const { connectionsHeight, setConnectionsHeight } = usePanelEditorStore()

  const [isResizing, setIsResizing] = useState(false)
  const startYRef = useRef<number>(0)
  const startHeightRef = useRef<number>(0)
  const maxHeightRef = useRef<number>(MAX_CONNECTIONS_HEIGHT)

  /**
   * Handles mouse down event on the resize handle to initiate resizing
   *
   * @param e - The React mouse event from the resize handle
   */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsResizing(true)
      startYRef.current = e.clientY
      startHeightRef.current = connectionsHeight
      // Freeze max height for current resize session to prevent jitter
      maxHeightRef.current = MAX_CONNECTIONS_HEIGHT
    },
    [connectionsHeight]
  )

  /**
   * Sets up resize event listeners and body styles during resize operations
   */
  useEffect(() => {
    if (!isResizing || !subBlocksRef.current) return

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = startYRef.current - e.clientY // Inverted because we're resizing from bottom up
      let newHeight = startHeightRef.current + deltaY

      // Clamp height between fixed min and max for stable behavior
      newHeight = Math.max(MIN_CONNECTIONS_HEIGHT, Math.min(maxHeightRef.current, newHeight))
      setConnectionsHeight(newHeight)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = 'ns-resize'
    document.body.style.userSelect = 'none'

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing, subBlocksRef, setConnectionsHeight])

  return {
    handleMouseDown,
    isResizing,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-editor-block-properties.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/hooks/use-editor-block-properties.ts
Signals: React

```typescript
import { useCallback, useMemo } from 'react'
import { useWorkflowDiffStore } from '@/stores/workflow-diff'
import { useWorkflowStore } from '@/stores/workflows/workflow/store'

/**
 * Custom hook for managing block display properties in the editor panel.
 * Provides access to advanced mode and trigger mode states.
 *
 * @param blockId - The ID of the block being edited
 * @param isSnapshotView - Whether we're currently viewing the baseline snapshot
 * @returns Block display properties (advanced mode, trigger mode)
 */
export function useEditorBlockProperties(blockId: string | null, isSnapshotView: boolean) {
  const normalBlocks = useWorkflowStore(useCallback((state) => state.blocks, []))
  const baselineBlocks = useWorkflowDiffStore(
    useCallback((state) => state.baselineWorkflow?.blocks || {}, [])
  )

  const blockProperties = useMemo(() => {
    if (!blockId) {
      return {
        advancedMode: false,
        triggerMode: false,
      }
    }

    const blocks = isSnapshotView ? baselineBlocks : normalBlocks
    const block = blocks?.[blockId]

    return {
      advancedMode: block?.advancedMode ?? false,
      triggerMode: block?.triggerMode ?? false,
    }
  }, [blockId, isSnapshotView, normalBlocks, baselineBlocks])

  return blockProperties
}
```

--------------------------------------------------------------------------------

---[FILE: use-editor-subblock-layout.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/hooks/use-editor-subblock-layout.ts
Signals: React

```typescript
import { useMemo } from 'react'
import { getEnv, isTruthy } from '@/lib/core/config/env'
import type { BlockConfig, SubBlockConfig, SubBlockType } from '@/blocks/types'
import { useWorkflowDiffStore } from '@/stores/workflow-diff'
import { mergeSubblockState } from '@/stores/workflows/utils'
import { useWorkflowStore } from '@/stores/workflows/workflow/store'

/**
 * Custom hook for computing subblock layout in the editor panel.
 * Determines which subblocks should be visible based on mode, conditions, and feature flags.
 *
 * @param config - The block configuration containing subblock definitions
 * @param blockId - The ID of the current block being edited
 * @param displayAdvancedMode - Whether advanced mode is enabled for this block
 * @param displayTriggerMode - Whether trigger mode is enabled for this block
 * @param activeWorkflowId - The active workflow ID
 * @param blockSubBlockValues - Current subblock values from the store
 * @param isDiffMode - Whether we're currently viewing a diff
 * @returns Object containing subBlocks array and stateToUse for stable key generation
 */
export function useEditorSubblockLayout(
  config: BlockConfig,
  blockId: string,
  displayAdvancedMode: boolean,
  displayTriggerMode: boolean,
  activeWorkflowId: string | null,
  blockSubBlockValues: Record<string, any>,
  isSnapshotView: boolean
) {
  return useMemo(() => {
    // Guard against missing config or block selection
    if (!config || !Array.isArray((config as any).subBlocks) || !blockId) {
      return { subBlocks: [] as SubBlockConfig[], stateToUse: {} }
    }

    const diffStore = useWorkflowDiffStore.getState()
    const workflowBlocks = useWorkflowStore.getState().blocks || {}

    const sourceBlocks = isSnapshotView
      ? (diffStore.baselineWorkflow?.blocks as Record<string, any>) || {}
      : workflowBlocks

    const mergedMap = isSnapshotView
      ? { [blockId]: structuredClone(sourceBlocks[blockId]) }
      : mergeSubblockState(sourceBlocks, activeWorkflowId || undefined, blockId)

    const mergedState = mergedMap ? mergedMap[blockId] : undefined
    const mergedSubBlocks = mergedState?.subBlocks || {}

    const stateToUse = Object.keys(mergedSubBlocks).reduce(
      (acc, key) => {
        const baselineValue = mergedSubBlocks[key]?.value ?? null
        const liveValue =
          blockSubBlockValues[key] !== undefined ? blockSubBlockValues[key] : baselineValue
        acc[key] = {
          value: isSnapshotView ? baselineValue : liveValue,
        }
        return acc
      },
      {} as Record<string, { value: unknown }>
    )

    if (!isSnapshotView) {
      Object.keys(blockSubBlockValues).forEach((key) => {
        if (!(key in stateToUse)) {
          stateToUse[key] = { value: blockSubBlockValues[key] }
        }
      })
    }

    // Filter visible blocks and those that meet their conditions
    const visibleSubBlocks = (config.subBlocks || []).filter((block) => {
      if (block.hidden) return false

      // Check required feature if specified - declarative feature gating
      if (block.requiresFeature && !isTruthy(getEnv(block.requiresFeature))) {
        return false
      }

      // Special handling for trigger-config type (legacy trigger configuration UI)
      if (block.type === ('trigger-config' as SubBlockType)) {
        const isPureTriggerBlock = config?.triggers?.enabled && config.category === 'triggers'
        return displayTriggerMode || isPureTriggerBlock
      }

      // Filter by mode if specified
      if (block.mode) {
        if (block.mode === 'basic' && displayAdvancedMode) return false
        if (block.mode === 'advanced' && !displayAdvancedMode) return false
        if (block.mode === 'trigger') {
          // Show trigger mode blocks only when in trigger mode
          if (!displayTriggerMode) return false
        }
      }

      // When in trigger mode, hide blocks that don't have mode: 'trigger'
      if (displayTriggerMode && block.mode !== 'trigger') {
        return false
      }

      // If there's no condition, the block should be shown
      if (!block.condition) return true

      // If condition is a function, call it to get the actual condition object
      const actualCondition =
        typeof block.condition === 'function' ? block.condition() : block.condition

      // Get the values of the fields this block depends on from the appropriate state
      const fieldValue = stateToUse[actualCondition.field]?.value
      const andFieldValue = actualCondition.and
        ? stateToUse[actualCondition.and.field]?.value
        : undefined

      // Check if the condition value is an array
      const isValueMatch = Array.isArray(actualCondition.value)
        ? fieldValue != null &&
          (actualCondition.not
            ? !actualCondition.value.includes(fieldValue as string | number | boolean)
            : actualCondition.value.includes(fieldValue as string | number | boolean))
        : actualCondition.not
          ? fieldValue !== actualCondition.value
          : fieldValue === actualCondition.value

      // Check both conditions if 'and' is present
      const isAndValueMatch =
        !actualCondition.and ||
        (Array.isArray(actualCondition.and.value)
          ? andFieldValue != null &&
            (actualCondition.and.not
              ? !actualCondition.and.value.includes(andFieldValue as string | number | boolean)
              : actualCondition.and.value.includes(andFieldValue as string | number | boolean))
          : actualCondition.and.not
            ? andFieldValue !== actualCondition.and.value
            : andFieldValue === actualCondition.and.value)

      return isValueMatch && isAndValueMatch
    })

    return { subBlocks: visibleSubBlocks, stateToUse }
  }, [
    config.subBlocks,
    config.triggers,
    config.category,
    blockId,
    displayAdvancedMode,
    displayTriggerMode,
    blockSubBlockValues,
    activeWorkflowId,
    isSnapshotView,
  ])
}
```

--------------------------------------------------------------------------------

---[FILE: use-subflow-editor.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/hooks/use-subflow-editor.ts
Signals: React

```typescript
import { useCallback, useRef, useState } from 'react'
import { highlight, languages } from '@/components/emcn'
import {
  isLikelyReferenceSegment,
  SYSTEM_REFERENCE_PREFIXES,
  splitReferenceSegment,
} from '@/lib/workflows/sanitization/references'
import { checkTagTrigger } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/tag-dropdown/tag-dropdown'
import { useAccessibleReferencePrefixes } from '@/app/workspace/[workspaceId]/w/[workflowId]/hooks/use-accessible-reference-prefixes'
import { createEnvVarPattern, createReferencePattern } from '@/executor/utils/reference-validation'
import { useCollaborativeWorkflow } from '@/hooks/use-collaborative-workflow'
import { normalizeBlockName } from '@/stores/workflows/utils'
import { useWorkflowStore } from '@/stores/workflows/workflow/store'
import type { BlockState } from '@/stores/workflows/workflow/types'

/**
 * Configuration for subflow types (loop and parallel)
 */
const SUBFLOW_CONFIG = {
  loop: {
    typeLabels: {
      for: 'For Loop',
      forEach: 'For Each',
      while: 'While Loop',
      doWhile: 'Do While Loop',
    },
    typeKey: 'loopType' as const,
    storeKey: 'loops' as const,
    maxIterations: 1000,
    configKeys: {
      iterations: 'iterations' as const,
      items: 'forEachItems' as const,
      condition: 'whileCondition' as const,
    } as any,
  },
  parallel: {
    typeLabels: { count: 'Parallel Count', collection: 'Parallel Each' },
    typeKey: 'parallelType' as const,
    storeKey: 'parallels' as const,
    maxIterations: 20,
    configKeys: {
      iterations: 'count' as const,
      items: 'distribution' as const,
    },
  },
} as const

/**
 * Hook for managing subflow editor state and logic
 *
 * @param currentBlock - The current block being edited
 * @param currentBlockId - The ID of the current block
 * @returns Subflow editor state and handlers
 */
export function useSubflowEditor(currentBlock: BlockState | null, currentBlockId: string | null) {
  const workflowStore = useWorkflowStore()
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const editorContainerRef = useRef<HTMLDivElement>(null)

  // State
  const [tempInputValue, setTempInputValue] = useState<string | null>(null)
  const [showTagDropdown, setShowTagDropdown] = useState(false)
  const [cursorPosition, setCursorPosition] = useState(0)

  // Check if current block is a subflow
  const isSubflow =
    currentBlock && (currentBlock.type === 'loop' || currentBlock.type === 'parallel')

  // Get subflow configuration
  const subflowConfig = isSubflow ? SUBFLOW_CONFIG[currentBlock.type as 'loop' | 'parallel'] : null
  const nodeConfig = isSubflow ? workflowStore[subflowConfig!.storeKey][currentBlockId!] : null

  // Get block data for fallback values
  const blockData = isSubflow ? currentBlock?.data : null

  // Get accessible prefixes for tag dropdown
  const accessiblePrefixes = useAccessibleReferencePrefixes(currentBlockId || '')

  // Collaborative actions
  const {
    collaborativeUpdateLoopType,
    collaborativeUpdateParallelType,
    collaborativeUpdateIterationCount,
    collaborativeUpdateIterationCollection,
  } = useCollaborativeWorkflow()

  /**
   * Checks if a reference should be highlighted based on accessible prefixes
   */
  const shouldHighlightReference = useCallback(
    (part: string): boolean => {
      if (!part.startsWith('<') || !part.endsWith('>')) {
        return false
      }

      if (!isLikelyReferenceSegment(part)) {
        return false
      }

      const split = splitReferenceSegment(part)
      if (!split) {
        return false
      }

      const reference = split.reference

      if (!accessiblePrefixes) {
        return true
      }

      const inner = reference.slice(1, -1)
      const [prefix] = inner.split('.')
      const normalizedPrefix = normalizeBlockName(prefix)

      if (SYSTEM_REFERENCE_PREFIXES.has(normalizedPrefix)) {
        return true
      }

      return accessiblePrefixes.has(normalizedPrefix)
    },
    [accessiblePrefixes]
  )

  /**
   * Highlights code with references and environment variables
   */
  const highlightWithReferences = useCallback(
    (code: string): string => {
      const placeholders: Array<{
        placeholder: string
        original: string
        type: 'var' | 'env'
      }> = []

      let processedCode = code

      processedCode = processedCode.replace(createEnvVarPattern(), (match) => {
        const placeholder = `__ENV_VAR_${placeholders.length}__`
        placeholders.push({ placeholder, original: match, type: 'env' })
        return placeholder
      })

      // Use [^<>]+ to prevent matching across nested brackets (e.g., "<3 <real.ref>" should match separately)
      processedCode = processedCode.replace(createReferencePattern(), (match) => {
        if (shouldHighlightReference(match)) {
          const placeholder = `__VAR_REF_${placeholders.length}__`
          placeholders.push({ placeholder, original: match, type: 'var' })
          return placeholder
        }
        return match
      })

      let highlightedCode = highlight(processedCode, languages.javascript, 'javascript')

      placeholders.forEach(({ placeholder, original, type }) => {
        if (type === 'env') {
          highlightedCode = highlightedCode.replace(
            placeholder,
            `<span class="text-blue-500">${original}</span>`
          )
        } else {
          const escaped = original.replace(/</g, '&lt;').replace(/>/g, '&gt;')
          highlightedCode = highlightedCode.replace(
            placeholder,
            `<span class="text-blue-500">${escaped}</span>`
          )
        }
      })

      return highlightedCode
    },
    [shouldHighlightReference]
  )

  /**
   * Handle subflow type change (loop type or parallel type)
   */
  const handleSubflowTypeChange = useCallback(
    (newType: string) => {
      if (!currentBlockId || !isSubflow || !currentBlock) return
      if (currentBlock.type === 'loop') {
        collaborativeUpdateLoopType(
          currentBlockId,
          newType as 'for' | 'forEach' | 'while' | 'doWhile'
        )
      } else {
        collaborativeUpdateParallelType(currentBlockId, newType as 'count' | 'collection')
      }
    },
    [
      currentBlockId,
      isSubflow,
      currentBlock,
      collaborativeUpdateLoopType,
      collaborativeUpdateParallelType,
    ]
  )

  /**
   * Handle iterations input change
   */
  const handleSubflowIterationsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!subflowConfig) return
      const sanitizedValue = e.target.value.replace(/[^0-9]/g, '')
      const numValue = Number.parseInt(sanitizedValue)

      if (!Number.isNaN(numValue)) {
        setTempInputValue(Math.min(subflowConfig.maxIterations, numValue).toString())
      } else {
        setTempInputValue(sanitizedValue)
      }
    },
    [subflowConfig]
  )

  /**
   * Save iterations value
   */
  const handleSubflowIterationsSave = useCallback(() => {
    if (!currentBlockId || !isSubflow || !subflowConfig || !currentBlock) return
    const value = Number.parseInt(tempInputValue ?? '5')

    if (!Number.isNaN(value)) {
      const newValue = Math.min(subflowConfig.maxIterations, Math.max(1, value))
      collaborativeUpdateIterationCount(
        currentBlockId,
        currentBlock.type as 'loop' | 'parallel',
        newValue
      )
    }
    setTempInputValue(null)
  }, [
    tempInputValue,
    currentBlockId,
    isSubflow,
    subflowConfig,
    currentBlock,
    collaborativeUpdateIterationCount,
  ])

  /**
   * Handle editor value change (collection/condition)
   */
  const handleSubflowEditorChange = useCallback(
    (value: string) => {
      if (!currentBlockId || !isSubflow || !currentBlock) return
      collaborativeUpdateIterationCollection(
        currentBlockId,
        currentBlock.type as 'loop' | 'parallel',
        value
      )

      const textarea = editorContainerRef.current?.querySelector('textarea')
      if (textarea) {
        textareaRef.current = textarea
        const cursorPos = textarea.selectionStart || 0
        setCursorPosition(cursorPos)

        const triggerCheck = checkTagTrigger(value, cursorPos)
        setShowTagDropdown(triggerCheck.show)
      }
    },
    [currentBlockId, isSubflow, currentBlock, collaborativeUpdateIterationCollection]
  )

  /**
   * Handle tag selection from dropdown
   */
  const handleSubflowTagSelect = useCallback(
    (newValue: string) => {
      if (!currentBlockId || !isSubflow || !currentBlock) return
      collaborativeUpdateIterationCollection(
        currentBlockId,
        currentBlock.type as 'loop' | 'parallel',
        newValue
      )
      setShowTagDropdown(false)

      setTimeout(() => {
        const textarea = textareaRef.current
        if (textarea) {
          textarea.focus()
        }
      }, 0)
    },
    [currentBlockId, isSubflow, currentBlock, collaborativeUpdateIterationCollection]
  )

  // Compute derived values
  const currentType =
    isSubflow && subflowConfig
      ? (nodeConfig as any)?.[subflowConfig.typeKey] ||
        (blockData as any)?.[subflowConfig.typeKey] ||
        (currentBlock!.type === 'loop' ? 'for' : 'count')
      : null

  const isCountMode = currentType === 'for' || currentType === 'count'
  const isConditionMode = currentType === 'while' || currentType === 'doWhile'

  const configIterations =
    isSubflow && subflowConfig
      ? ((nodeConfig as any)?.[subflowConfig.configKeys.iterations] ??
        (blockData as any)?.count ??
        5)
      : 5

  const configCollection =
    isSubflow && subflowConfig
      ? ((nodeConfig as any)?.[subflowConfig.configKeys.items] ??
        (blockData as any)?.collection ??
        '')
      : ''

  const conditionKey =
    currentType === 'while'
      ? 'whileCondition'
      : currentType === 'doWhile'
        ? 'doWhileCondition'
        : null

  const configCondition =
    isSubflow && conditionKey
      ? ((nodeConfig as any)?.[conditionKey] ?? (blockData as any)?.[conditionKey] ?? '')
      : ''

  const iterations = configIterations
  const collectionString =
    typeof configCollection === 'string' ? configCollection : JSON.stringify(configCollection) || ''
  const conditionString = typeof configCondition === 'string' ? configCondition : ''

  const inputValue = tempInputValue ?? iterations.toString()
  const editorValue = isConditionMode ? conditionString : collectionString

  // Type options for combobox
  const typeOptions =
    isSubflow && subflowConfig
      ? Object.entries(subflowConfig.typeLabels).map(([value, label]) => ({
          value,
          label,
        }))
      : []

  return {
    // State
    isSubflow,
    subflowConfig,
    currentType,
    isCountMode,
    isConditionMode,
    inputValue,
    editorValue,
    typeOptions,
    showTagDropdown,
    cursorPosition,
    textareaRef,
    editorContainerRef,

    // Handlers
    handleSubflowTypeChange,
    handleSubflowIterationsChange,
    handleSubflowIterationsSave,
    handleSubflowEditorChange,
    handleSubflowTagSelect,
    highlightWithReferences,
    setShowTagDropdown,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: file-selector-input.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/sub-block/components/file-selector/file-selector-input.tsx
Signals: React, Next.js

```typescript
'use client'

import { useMemo } from 'react'
import { useParams } from 'next/navigation'
import { Tooltip } from '@/components/emcn'
import { getProviderIdFromServiceId } from '@/lib/oauth'
import { SelectorCombobox } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/selector-combobox/selector-combobox'
import { useDependsOnGate } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/hooks/use-depends-on-gate'
import { useForeignCredential } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/hooks/use-foreign-credential'
import { useSubBlockValue } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/hooks/use-sub-block-value'
import type { SubBlockConfig } from '@/blocks/types'
import { isDependency } from '@/blocks/utils'
import { resolveSelectorForSubBlock, type SelectorResolution } from '@/hooks/selectors/resolution'
import { useCollaborativeWorkflow } from '@/hooks/use-collaborative-workflow'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'

interface FileSelectorInputProps {
  blockId: string
  subBlock: SubBlockConfig
  disabled: boolean
  isPreview?: boolean
  previewValue?: any | null
  previewContextValues?: Record<string, any>
}

export function FileSelectorInput({
  blockId,
  subBlock,
  disabled,
  isPreview = false,
  previewValue,
  previewContextValues,
}: FileSelectorInputProps) {
  const { collaborativeSetSubblockValue } = useCollaborativeWorkflow()
  const { activeWorkflowId } = useWorkflowRegistry()
  const params = useParams()
  const workflowIdFromUrl = (params?.workflowId as string) || activeWorkflowId || ''

  const { finalDisabled } = useDependsOnGate(blockId, subBlock, {
    disabled,
    isPreview,
    previewContextValues,
  })

  const [connectedCredentialFromStore] = useSubBlockValue(blockId, 'credential')
  const [domainValueFromStore] = useSubBlockValue(blockId, 'domain')
  const [projectIdValueFromStore] = useSubBlockValue(blockId, 'projectId')
  const [planIdValueFromStore] = useSubBlockValue(blockId, 'planId')
  const [teamIdValueFromStore] = useSubBlockValue(blockId, 'teamId')
  const [siteIdValueFromStore] = useSubBlockValue(blockId, 'siteId')
  const [collectionIdValueFromStore] = useSubBlockValue(blockId, 'collectionId')

  const connectedCredential = previewContextValues?.credential ?? connectedCredentialFromStore
  const domainValue = previewContextValues?.domain ?? domainValueFromStore
  const projectIdValue = previewContextValues?.projectId ?? projectIdValueFromStore
  const planIdValue = previewContextValues?.planId ?? planIdValueFromStore
  const teamIdValue = previewContextValues?.teamId ?? teamIdValueFromStore
  const siteIdValue = previewContextValues?.siteId ?? siteIdValueFromStore
  const collectionIdValue = previewContextValues?.collectionId ?? collectionIdValueFromStore

  const normalizedCredentialId =
    typeof connectedCredential === 'string'
      ? connectedCredential
      : typeof connectedCredential === 'object' && connectedCredential !== null
        ? ((connectedCredential as Record<string, any>).id ?? '')
        : ''

  // Derive provider from serviceId using OAuth config
  const serviceId = subBlock.serviceId || ''
  const effectiveProviderId = useMemo(() => getProviderIdFromServiceId(serviceId), [serviceId])

  const { isForeignCredential } = useForeignCredential(effectiveProviderId, normalizedCredentialId)

  const selectorResolution = useMemo<SelectorResolution | null>(() => {
    return resolveSelectorForSubBlock(subBlock, {
      credentialId: normalizedCredentialId,
      workflowId: workflowIdFromUrl,
      domain: (domainValue as string) || undefined,
      projectId: (projectIdValue as string) || undefined,
      planId: (planIdValue as string) || undefined,
      teamId: (teamIdValue as string) || undefined,
      siteId: (siteIdValue as string) || undefined,
      collectionId: (collectionIdValue as string) || undefined,
    })
  }, [
    subBlock,
    normalizedCredentialId,
    workflowIdFromUrl,
    domainValue,
    projectIdValue,
    planIdValue,
    teamIdValue,
    siteIdValue,
    collectionIdValue,
  ])

  const missingCredential = !normalizedCredentialId
  const missingDomain =
    selectorResolution?.key &&
    (selectorResolution.key === 'confluence.pages' || selectorResolution.key === 'jira.issues') &&
    !selectorResolution.context.domain
  const missingProject =
    selectorResolution?.key === 'jira.issues' &&
    isDependency(subBlock.dependsOn, 'projectId') &&
    !selectorResolution?.context.projectId
  const missingPlan =
    selectorResolution?.key === 'microsoft.planner' && !selectorResolution?.context.planId
  const missingSite =
    selectorResolution?.key === 'webflow.collections' && !selectorResolution?.context.siteId
  const missingCollection =
    selectorResolution?.key === 'webflow.items' && !selectorResolution?.context.collectionId

  const disabledReason =
    finalDisabled ||
    isForeignCredential ||
    missingCredential ||
    missingDomain ||
    missingProject ||
    missingPlan ||
    missingSite ||
    missingCollection ||
    !selectorResolution?.key

  if (!selectorResolution?.key) {
    return (
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div className='w-full rounded border p-4 text-center text-muted-foreground text-sm'>
            File selector not supported for service: {serviceId}
          </div>
        </Tooltip.Trigger>
        <Tooltip.Content side='top'>
          <p>This file selector is not implemented for {serviceId}</p>
        </Tooltip.Content>
      </Tooltip.Root>
    )
  }

  return (
    <SelectorCombobox
      blockId={blockId}
      subBlock={subBlock}
      selectorKey={selectorResolution.key}
      selectorContext={selectorResolution.context}
      disabled={disabledReason}
      isPreview={isPreview}
      previewValue={previewValue ?? null}
      placeholder={subBlock.placeholder || 'Select resource'}
      allowSearch={selectorResolution.allowSearch}
      onOptionChange={(value) => {
        if (!isPreview) {
          collaborativeSetSubblockValue(blockId, subBlock.id, value)
        }
      }}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/toolbar/index.ts

```typescript
export { Toolbar } from './toolbar'
```

--------------------------------------------------------------------------------

````
