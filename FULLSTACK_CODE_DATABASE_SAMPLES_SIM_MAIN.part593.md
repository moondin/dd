---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 593
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 593 of 933)

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
Location: sim-main/apps/sim/lib/workflows/autolayout/utils.ts

```typescript
import {
  AUTO_LAYOUT_EXCLUDED_TYPES,
  CONTAINER_BLOCK_TYPES,
  CONTAINER_PADDING,
  CONTAINER_PADDING_X,
  CONTAINER_PADDING_Y,
  ROOT_PADDING_X,
  ROOT_PADDING_Y,
} from '@/lib/workflows/autolayout/constants'
import type { BlockMetrics, BoundingBox, Edge, GraphNode } from '@/lib/workflows/autolayout/types'
import { BLOCK_DIMENSIONS, CONTAINER_DIMENSIONS } from '@/lib/workflows/blocks/block-dimensions'
import type { BlockState } from '@/stores/workflows/workflow/types'

// Re-export layout constants for backwards compatibility
export {
  CONTAINER_PADDING,
  CONTAINER_PADDING_X,
  CONTAINER_PADDING_Y,
  ROOT_PADDING_X,
  ROOT_PADDING_Y,
}

// Re-export block dimensions for backwards compatibility
export const DEFAULT_BLOCK_WIDTH = BLOCK_DIMENSIONS.FIXED_WIDTH
export const DEFAULT_BLOCK_HEIGHT = BLOCK_DIMENSIONS.MIN_HEIGHT
export const DEFAULT_CONTAINER_WIDTH = CONTAINER_DIMENSIONS.DEFAULT_WIDTH
export const DEFAULT_CONTAINER_HEIGHT = CONTAINER_DIMENSIONS.DEFAULT_HEIGHT

/**
 * Resolves a potentially undefined numeric value to a fallback
 */
function resolveNumeric(value: number | undefined, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

/**
 * Checks if a block type is a container (loop or parallel)
 */
export function isContainerType(blockType: string): boolean {
  return CONTAINER_BLOCK_TYPES.has(blockType)
}

/**
 * Checks if a block should be excluded from autolayout
 */
export function shouldSkipAutoLayout(block?: BlockState): boolean {
  if (!block) return true
  return AUTO_LAYOUT_EXCLUDED_TYPES.has(block.type)
}

/**
 * Filters block IDs to only include those eligible for layout
 */
export function filterLayoutEligibleBlockIds(
  blockIds: string[],
  blocks: Record<string, BlockState>
): string[] {
  return blockIds.filter((id) => {
    const block = blocks[id]
    if (!block) return false
    return !shouldSkipAutoLayout(block)
  })
}

/**
 * Gets metrics for a container block
 */
function getContainerMetrics(block: BlockState): BlockMetrics {
  const measuredWidth = block.layout?.measuredWidth
  const measuredHeight = block.layout?.measuredHeight

  const containerWidth = Math.max(
    measuredWidth ?? 0,
    resolveNumeric(block.data?.width, CONTAINER_DIMENSIONS.DEFAULT_WIDTH)
  )
  const containerHeight = Math.max(
    measuredHeight ?? 0,
    resolveNumeric(block.data?.height, CONTAINER_DIMENSIONS.DEFAULT_HEIGHT)
  )

  return {
    width: containerWidth,
    height: containerHeight,
    minWidth: CONTAINER_DIMENSIONS.DEFAULT_WIDTH,
    minHeight: CONTAINER_DIMENSIONS.DEFAULT_HEIGHT,
    paddingTop: BLOCK_DIMENSIONS.HEADER_HEIGHT,
    paddingBottom: BLOCK_DIMENSIONS.HEADER_HEIGHT,
    paddingLeft: BLOCK_DIMENSIONS.HEADER_HEIGHT,
    paddingRight: BLOCK_DIMENSIONS.HEADER_HEIGHT,
  }
}

/**
 * Gets metrics for a regular (non-container) block
 */
function getRegularBlockMetrics(block: BlockState): BlockMetrics {
  const minWidth = BLOCK_DIMENSIONS.FIXED_WIDTH
  const minHeight = BLOCK_DIMENSIONS.MIN_HEIGHT
  const measuredH = block.layout?.measuredHeight ?? block.height
  const measuredW = block.layout?.measuredWidth

  const width = Math.max(measuredW ?? minWidth, minWidth)
  const height = Math.max(measuredH ?? minHeight, minHeight)

  return {
    width,
    height,
    minWidth,
    minHeight,
    paddingTop: BLOCK_DIMENSIONS.HEADER_HEIGHT,
    paddingBottom: BLOCK_DIMENSIONS.HEADER_HEIGHT,
    paddingLeft: BLOCK_DIMENSIONS.HEADER_HEIGHT,
    paddingRight: BLOCK_DIMENSIONS.HEADER_HEIGHT,
  }
}

/**
 * Gets the dimensions and metrics for a block
 */
export function getBlockMetrics(block: BlockState): BlockMetrics {
  if (isContainerType(block.type)) {
    return getContainerMetrics(block)
  }

  return getRegularBlockMetrics(block)
}

/**
 * Prepares metrics for all nodes in a graph
 */
export function prepareBlockMetrics(nodes: Map<string, GraphNode>): void {
  for (const node of nodes.values()) {
    node.metrics = getBlockMetrics(node.block)
  }
}

/**
 * Creates a bounding box from position and dimensions
 */
export function createBoundingBox(
  position: { x: number; y: number },
  dimensions: Pick<BlockMetrics, 'width' | 'height'>
): BoundingBox {
  return {
    x: position.x,
    y: position.y,
    width: dimensions.width,
    height: dimensions.height,
  }
}

/**
 * Checks if two bounding boxes overlap (with optional margin)
 */
export function boxesOverlap(box1: BoundingBox, box2: BoundingBox, margin = 0): boolean {
  return !(
    box1.x + box1.width + margin <= box2.x ||
    box2.x + box2.width + margin <= box1.x ||
    box1.y + box1.height + margin <= box2.y ||
    box2.y + box2.height + margin <= box1.y
  )
}

/**
 * Groups blocks by their parent container
 */
export function getBlocksByParent(blocks: Record<string, BlockState>): {
  root: string[]
  children: Map<string, string[]>
} {
  const root: string[] = []
  const children = new Map<string, string[]>()

  for (const [id, block] of Object.entries(blocks)) {
    const parentId = block.data?.parentId

    if (!parentId) {
      root.push(id)
    } else {
      if (!children.has(parentId)) {
        children.set(parentId, [])
      }
      children.get(parentId)!.push(id)
    }
  }

  return { root, children }
}

/**
 * Normalizes node positions to start from a given padding offset.
 * Returns the bounding box dimensions of the normalized layout.
 */
export function normalizePositions(
  nodes: Map<string, GraphNode>,
  options: { isContainer: boolean }
): { width: number; height: number } {
  if (nodes.size === 0) {
    return { width: 0, height: 0 }
  }

  let minX = Number.POSITIVE_INFINITY
  let minY = Number.POSITIVE_INFINITY
  let maxX = Number.NEGATIVE_INFINITY
  let maxY = Number.NEGATIVE_INFINITY

  for (const node of nodes.values()) {
    minX = Math.min(minX, node.position.x)
    minY = Math.min(minY, node.position.y)
    maxX = Math.max(maxX, node.position.x + node.metrics.width)
    maxY = Math.max(maxY, node.position.y + node.metrics.height)
  }

  const paddingX = options.isContainer ? CONTAINER_PADDING_X : ROOT_PADDING_X
  const paddingY = options.isContainer ? CONTAINER_PADDING_Y : ROOT_PADDING_Y

  const xOffset = paddingX - minX
  const yOffset = paddingY - minY

  for (const node of nodes.values()) {
    node.position = {
      x: node.position.x + xOffset,
      y: node.position.y + yOffset,
    }
  }

  const width = maxX - minX + CONTAINER_PADDING * 2
  const height = maxY - minY + CONTAINER_PADDING * 2

  return { width, height }
}

/**
 * Transfers block height measurements from source blocks to target blocks.
 * Matches blocks by type:name key.
 */
export function transferBlockHeights(
  sourceBlocks: Record<string, BlockState>,
  targetBlocks: Record<string, BlockState>
): void {
  // Build a map of block type+name to heights from source
  const heightMap = new Map<string, { height: number; width: number }>()

  for (const block of Object.values(sourceBlocks)) {
    const key = `${block.type}:${block.name}`
    heightMap.set(key, {
      height: block.height || BLOCK_DIMENSIONS.MIN_HEIGHT,
      width: block.layout?.measuredWidth || BLOCK_DIMENSIONS.FIXED_WIDTH,
    })
  }

  // Transfer heights to target blocks
  for (const block of Object.values(targetBlocks)) {
    const key = `${block.type}:${block.name}`
    const measurements = heightMap.get(key)

    if (measurements) {
      block.height = measurements.height

      if (!block.layout) {
        block.layout = {}
      }
      block.layout.measuredHeight = measurements.height
      block.layout.measuredWidth = measurements.width
    }
  }
}

/**
 * Calculates the internal depth (max layer count) for each subflow container.
 * Used to properly position blocks that connect after a subflow ends.
 *
 * @param blocks - All blocks in the workflow
 * @param edges - All edges in the workflow
 * @param assignLayersFn - Function to assign layers to blocks
 * @returns Map of container block IDs to their internal layer depth
 */
export function calculateSubflowDepths(
  blocks: Record<string, BlockState>,
  edges: Edge[],
  assignLayersFn: (blocks: Record<string, BlockState>, edges: Edge[]) => Map<string, GraphNode>
): Map<string, number> {
  const depths = new Map<string, number>()
  const { children } = getBlocksByParent(blocks)

  for (const [containerId, childIds] of children.entries()) {
    if (childIds.length === 0) {
      depths.set(containerId, 1)
      continue
    }

    const childBlocks: Record<string, BlockState> = {}
    const layoutChildIds = filterLayoutEligibleBlockIds(childIds, blocks)
    for (const childId of layoutChildIds) {
      childBlocks[childId] = blocks[childId]
    }

    const childEdges = edges.filter(
      (edge) => layoutChildIds.includes(edge.source) && layoutChildIds.includes(edge.target)
    )

    if (Object.keys(childBlocks).length === 0) {
      depths.set(containerId, 1)
      continue
    }

    const childNodes = assignLayersFn(childBlocks, childEdges)
    let maxLayer = 0
    for (const node of childNodes.values()) {
      maxLayer = Math.max(maxLayer, node.layer)
    }

    depths.set(containerId, Math.max(maxLayer + 1, 1))
  }

  return depths
}

/**
 * Layout function type for preparing container dimensions.
 * Returns laid out nodes and bounding dimensions.
 */
export type LayoutFunction = (
  blocks: Record<string, BlockState>,
  edges: Edge[],
  options: {
    isContainer: boolean
    layoutOptions?: {
      horizontalSpacing?: number
      verticalSpacing?: number
      padding?: { x: number; y: number }
    }
    subflowDepths?: Map<string, number>
  }
) => { nodes: Map<string, GraphNode>; dimensions: { width: number; height: number } }

/**
 * Pre-calculates container dimensions by laying out their children.
 * Processes containers bottom-up to handle nested subflows correctly.
 * This ensures accurate width/height values before root-level layout.
 *
 * @param blocks - All blocks in the workflow (will be mutated with updated dimensions)
 * @param edges - All edges in the workflow
 * @param layoutFn - The layout function to use for calculating dimensions
 * @param horizontalSpacing - Horizontal spacing between blocks
 * @param verticalSpacing - Vertical spacing between blocks
 */
export function prepareContainerDimensions(
  blocks: Record<string, BlockState>,
  edges: Edge[],
  layoutFn: LayoutFunction,
  horizontalSpacing: number,
  verticalSpacing: number
): void {
  const { children } = getBlocksByParent(blocks)

  // Build dependency graph to process nested containers bottom-up
  const containerIds = Array.from(children.keys())
  const containerDepth = new Map<string, number>()

  // Calculate nesting depth for each container
  for (const containerId of containerIds) {
    let depth = 0
    let currentId: string | undefined = containerId
    while (currentId) {
      const block: BlockState | undefined = blocks[currentId]
      const parentId: string | undefined = block?.data?.parentId
      currentId = parentId
      if (currentId) depth++
    }
    containerDepth.set(containerId, depth)
  }

  // Sort containers by depth (deepest first) for bottom-up processing
  const sortedContainerIds = containerIds.sort((a, b) => {
    const depthA = containerDepth.get(a) ?? 0
    const depthB = containerDepth.get(b) ?? 0
    return depthB - depthA
  })

  // Process each container, laying out its children to determine dimensions
  for (const containerId of sortedContainerIds) {
    const container = blocks[containerId]
    if (!container) continue

    const childIds = children.get(containerId) ?? []
    const layoutChildIds = filterLayoutEligibleBlockIds(childIds, blocks)

    if (layoutChildIds.length === 0) {
      // Empty container - use default dimensions
      container.data = {
        ...container.data,
        width: CONTAINER_DIMENSIONS.DEFAULT_WIDTH,
        height: CONTAINER_DIMENSIONS.DEFAULT_HEIGHT,
      }
      container.layout = {
        ...container.layout,
        measuredWidth: CONTAINER_DIMENSIONS.DEFAULT_WIDTH,
        measuredHeight: CONTAINER_DIMENSIONS.DEFAULT_HEIGHT,
      }
      continue
    }

    // Build subset of blocks and edges for this container's children
    const childBlocks: Record<string, BlockState> = {}
    for (const childId of layoutChildIds) {
      childBlocks[childId] = blocks[childId]
    }

    const childEdges = edges.filter(
      (edge) => layoutChildIds.includes(edge.source) && layoutChildIds.includes(edge.target)
    )

    // Layout children to get dimensions
    const { dimensions } = layoutFn(childBlocks, childEdges, {
      isContainer: true,
      layoutOptions: {
        horizontalSpacing: horizontalSpacing * 0.85,
        verticalSpacing,
      },
    })

    // Update container with calculated dimensions
    const calculatedWidth = Math.max(dimensions.width, CONTAINER_DIMENSIONS.DEFAULT_WIDTH)
    const calculatedHeight = Math.max(dimensions.height, CONTAINER_DIMENSIONS.DEFAULT_HEIGHT)

    container.data = {
      ...container.data,
      width: calculatedWidth,
      height: calculatedHeight,
    }
    container.layout = {
      ...container.layout,
      measuredWidth: calculatedWidth,
      measuredHeight: calculatedHeight,
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: block-dimensions.ts]---
Location: sim-main/apps/sim/lib/workflows/blocks/block-dimensions.ts

```typescript
/**
 * Shared Block Dimension Constants
 *
 * Single source of truth for block dimensions used by:
 * - UI components (workflow-block, note-block, subflow-node)
 * - Autolayout system
 * - Node utilities
 */

export const BLOCK_DIMENSIONS = {
  FIXED_WIDTH: 250,
  HEADER_HEIGHT: 40,
  MIN_HEIGHT: 100,
  WORKFLOW_CONTENT_PADDING: 16,
  WORKFLOW_ROW_HEIGHT: 29,
  NOTE_CONTENT_PADDING: 14,
  NOTE_MIN_CONTENT_HEIGHT: 20,
  NOTE_BASE_CONTENT_HEIGHT: 60,
} as const

export const CONTAINER_DIMENSIONS = {
  DEFAULT_WIDTH: 500,
  DEFAULT_HEIGHT: 300,
  MIN_WIDTH: 400,
  MIN_HEIGHT: 200,
  HEADER_HEIGHT: 50,
  LEFT_PADDING: 16,
  RIGHT_PADDING: 80,
  TOP_PADDING: 16,
  BOTTOM_PADDING: 16,
} as const

/**
 * Handle position constants - must match CSS in workflow-block.tsx and subflow-node.tsx
 */
export const HANDLE_POSITIONS = {
  /** Default Y offset from block top for source/target handles */
  DEFAULT_Y_OFFSET: 20,
  /** Error handle offset from block bottom */
  ERROR_BOTTOM_OFFSET: 17,
  /** Condition handle starting Y offset */
  CONDITION_START_Y: 60,
  /** Height per condition row */
  CONDITION_ROW_HEIGHT: 29,
  /** Subflow start handle Y offset (header 50px + pill offset 16px + pill center 14px) */
  SUBFLOW_START_Y_OFFSET: 80,
} as const
```

--------------------------------------------------------------------------------

---[FILE: block-outputs.ts]---
Location: sim-main/apps/sim/lib/workflows/blocks/block-outputs.ts

```typescript
import { normalizeInputFormatValue } from '@/lib/workflows/input-format-utils'
import {
  classifyStartBlockType,
  StartBlockPath,
  TRIGGER_TYPES,
} from '@/lib/workflows/triggers/triggers'
import {
  type InputFormatField,
  START_BLOCK_RESERVED_FIELDS,
  USER_FILE_ACCESSIBLE_PROPERTIES,
  USER_FILE_PROPERTY_TYPES,
} from '@/lib/workflows/types'
import { getBlock } from '@/blocks'
import type { BlockConfig, OutputCondition } from '@/blocks/types'
import { getTrigger, isTriggerValid } from '@/triggers'

type OutputDefinition = Record<string, any>

/**
 * Evaluates an output condition against subBlock values.
 * Returns true if the condition is met and the output should be shown.
 */
function evaluateOutputCondition(
  condition: OutputCondition,
  subBlocks: Record<string, any> | undefined
): boolean {
  if (!subBlocks) return false

  const fieldValue = subBlocks[condition.field]?.value

  let matches: boolean
  if (Array.isArray(condition.value)) {
    matches = condition.value.includes(fieldValue)
  } else {
    matches = fieldValue === condition.value
  }

  if (condition.not) {
    matches = !matches
  }

  if (condition.and) {
    const andFieldValue = subBlocks[condition.and.field]?.value
    let andMatches: boolean

    if (Array.isArray(condition.and.value)) {
      andMatches = condition.and.value.includes(andFieldValue)
    } else {
      andMatches = andFieldValue === condition.and.value
    }

    if (condition.and.not) {
      andMatches = !andMatches
    }

    matches = matches && andMatches
  }

  return matches
}

/**
 * Filters outputs based on their conditions.
 * Returns a new OutputDefinition with only the outputs whose conditions are met.
 */
function filterOutputsByCondition(
  outputs: OutputDefinition,
  subBlocks: Record<string, any> | undefined
): OutputDefinition {
  const filtered: OutputDefinition = {}

  for (const [key, value] of Object.entries(outputs)) {
    if (!value || typeof value !== 'object' || !('condition' in value)) {
      filtered[key] = value
      continue
    }

    const condition = value.condition as OutputCondition | undefined
    if (!condition || evaluateOutputCondition(condition, subBlocks)) {
      const { condition: _, ...rest } = value
      filtered[key] = rest
    }
  }

  return filtered
}

const CHAT_OUTPUTS: OutputDefinition = {
  input: { type: 'string', description: 'User message' },
  conversationId: { type: 'string', description: 'Conversation ID' },
  files: { type: 'files', description: 'Uploaded files' },
}

const UNIFIED_START_OUTPUTS: OutputDefinition = {
  input: { type: 'string', description: 'Primary user input or message' },
  conversationId: { type: 'string', description: 'Conversation thread identifier' },
  files: { type: 'files', description: 'User uploaded files' },
}

function applyInputFormatFields(
  inputFormat: InputFormatField[],
  outputs: OutputDefinition
): OutputDefinition {
  for (const field of inputFormat) {
    const fieldName = field?.name?.trim()
    if (!fieldName) continue

    outputs[fieldName] = {
      type: (field?.type || 'any') as any,
      description: `Field from input format`,
    }
  }

  return outputs
}

function hasInputFormat(blockConfig: BlockConfig): boolean {
  return blockConfig.subBlocks?.some((sb) => sb.type === 'input-format') || false
}

function getTriggerId(
  subBlocks: Record<string, any> | undefined,
  blockConfig: BlockConfig
): string | undefined {
  const selectedTriggerIdValue = subBlocks?.selectedTriggerId?.value
  const triggerIdValue = subBlocks?.triggerId?.value

  return (
    (typeof selectedTriggerIdValue === 'string' && isTriggerValid(selectedTriggerIdValue)
      ? selectedTriggerIdValue
      : undefined) ||
    (typeof triggerIdValue === 'string' && isTriggerValid(triggerIdValue)
      ? triggerIdValue
      : undefined) ||
    blockConfig.triggers?.available?.[0]
  )
}

function getUnifiedStartOutputs(subBlocks: Record<string, any> | undefined): OutputDefinition {
  const outputs = { ...UNIFIED_START_OUTPUTS }
  const normalizedInputFormat = normalizeInputFormatValue(subBlocks?.inputFormat?.value)
  return applyInputFormatFields(normalizedInputFormat, outputs)
}

function getLegacyStarterOutputs(subBlocks: Record<string, any> | undefined): OutputDefinition {
  const startWorkflowValue = subBlocks?.startWorkflow?.value

  if (startWorkflowValue === 'chat') {
    return { ...CHAT_OUTPUTS }
  }

  if (
    startWorkflowValue === 'api' ||
    startWorkflowValue === 'run' ||
    startWorkflowValue === 'manual'
  ) {
    const normalizedInputFormat = normalizeInputFormatValue(subBlocks?.inputFormat?.value)
    return applyInputFormatFields(normalizedInputFormat, {})
  }

  return {}
}

function shouldClearBaseOutputs(
  blockType: string,
  normalizedInputFormat: InputFormatField[]
): boolean {
  if (blockType === TRIGGER_TYPES.API || blockType === TRIGGER_TYPES.INPUT) {
    return true
  }

  if (blockType === TRIGGER_TYPES.GENERIC_WEBHOOK && normalizedInputFormat.length > 0) {
    return true
  }

  return false
}

function applyInputFormatToOutputs(
  blockType: string,
  blockConfig: BlockConfig,
  subBlocks: Record<string, any> | undefined,
  baseOutputs: OutputDefinition
): OutputDefinition {
  if (!hasInputFormat(blockConfig) || !subBlocks?.inputFormat?.value) {
    return baseOutputs
  }

  const normalizedInputFormat = normalizeInputFormatValue(subBlocks.inputFormat.value)

  if (!Array.isArray(subBlocks.inputFormat.value)) {
    if (blockType === TRIGGER_TYPES.API || blockType === TRIGGER_TYPES.INPUT) {
      return {}
    }
    return baseOutputs
  }

  const shouldClear = shouldClearBaseOutputs(blockType, normalizedInputFormat)
  const outputs = shouldClear ? {} : { ...baseOutputs }

  return applyInputFormatFields(normalizedInputFormat, outputs)
}

export function getBlockOutputs(
  blockType: string,
  subBlocks?: Record<string, any>,
  triggerMode?: boolean
): OutputDefinition {
  const blockConfig = getBlock(blockType)
  if (!blockConfig) return {}

  if (triggerMode && blockConfig.triggers?.enabled) {
    const triggerId = getTriggerId(subBlocks, blockConfig)
    if (triggerId && isTriggerValid(triggerId)) {
      const trigger = getTrigger(triggerId)
      if (trigger.outputs) {
        return trigger.outputs
      }
    }
  }

  const startPath = classifyStartBlockType(blockType)

  if (startPath === StartBlockPath.UNIFIED) {
    return getUnifiedStartOutputs(subBlocks)
  }

  if (blockType === 'approval') {
    // Start with only url (apiUrl commented out - not accessible as output)
    const pauseResumeOutputs: Record<string, any> = {
      url: { type: 'string', description: 'Resume UI URL' },
      // apiUrl: { type: 'string', description: 'Resume API URL' }, // Commented out - not accessible as output
    }

    const normalizedInputFormat = normalizeInputFormatValue(subBlocks?.inputFormat?.value)

    // Add each input format field as a top-level output
    for (const field of normalizedInputFormat) {
      const fieldName = field?.name?.trim()
      if (!fieldName) continue

      pauseResumeOutputs[fieldName] = {
        type: (field?.type || 'any') as any,
        description: `Field from input format`,
      }
    }

    return pauseResumeOutputs
  }

  if (startPath === StartBlockPath.LEGACY_STARTER) {
    return getLegacyStarterOutputs(subBlocks)
  }

  const baseOutputs = { ...(blockConfig.outputs || {}) }
  const filteredOutputs = filterOutputsByCondition(baseOutputs, subBlocks)
  return applyInputFormatToOutputs(blockType, blockConfig, subBlocks, filteredOutputs)
}

function shouldFilterReservedField(
  blockType: string,
  key: string,
  prefix: string,
  subBlocks: Record<string, any> | undefined
): boolean {
  if (blockType !== TRIGGER_TYPES.START || prefix) {
    return false
  }

  if (!START_BLOCK_RESERVED_FIELDS.includes(key as any)) {
    return false
  }

  const normalizedInputFormat = normalizeInputFormatValue(subBlocks?.inputFormat?.value)
  const isExplicitlyDefined = normalizedInputFormat.some((field) => field?.name?.trim() === key)

  return !isExplicitlyDefined
}

function expandFileTypeProperties(path: string): string[] {
  return USER_FILE_ACCESSIBLE_PROPERTIES.map((prop) => `${path}.${prop}`)
}

function collectOutputPaths(
  obj: OutputDefinition,
  blockType: string,
  subBlocks: Record<string, any> | undefined,
  prefix = ''
): string[] {
  const paths: string[] = []

  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key

    if (shouldFilterReservedField(blockType, key, prefix, subBlocks)) {
      continue
    }

    if (value && typeof value === 'object' && 'type' in value) {
      if (value.type === 'files') {
        paths.push(...expandFileTypeProperties(path))
      } else {
        paths.push(path)
      }
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      paths.push(...collectOutputPaths(value, blockType, subBlocks, path))
    } else {
      paths.push(path)
    }
  }

  return paths
}

export function getBlockOutputPaths(
  blockType: string,
  subBlocks?: Record<string, any>,
  triggerMode?: boolean
): string[] {
  const outputs = getBlockOutputs(blockType, subBlocks, triggerMode)
  return collectOutputPaths(outputs, blockType, subBlocks)
}

function getFilePropertyType(outputs: OutputDefinition, pathParts: string[]): string | null {
  const lastPart = pathParts[pathParts.length - 1]
  if (!lastPart || !USER_FILE_PROPERTY_TYPES[lastPart as keyof typeof USER_FILE_PROPERTY_TYPES]) {
    return null
  }

  let current: any = outputs
  for (const part of pathParts.slice(0, -1)) {
    if (!current || typeof current !== 'object') {
      return null
    }
    current = current[part]
  }

  if (current && typeof current === 'object' && 'type' in current && current.type === 'files') {
    return USER_FILE_PROPERTY_TYPES[lastPart as keyof typeof USER_FILE_PROPERTY_TYPES]
  }

  return null
}

function traverseOutputPath(outputs: OutputDefinition, pathParts: string[]): any {
  let current: any = outputs

  for (const part of pathParts) {
    if (!current || typeof current !== 'object') {
      return null
    }
    current = current[part]
  }

  return current
}

function extractType(value: any): string {
  if (!value) return 'any'

  if (typeof value === 'object' && 'type' in value) {
    return value.type
  }

  return typeof value === 'string' ? value : 'any'
}

export function getBlockOutputType(
  blockType: string,
  outputPath: string,
  subBlocks?: Record<string, any>,
  triggerMode?: boolean
): string {
  const outputs = getBlockOutputs(blockType, subBlocks, triggerMode)

  const cleanPath = outputPath.replace(/\[(\d+)\]/g, '')
  const pathParts = cleanPath.split('.').filter(Boolean)

  const filePropertyType = getFilePropertyType(outputs, pathParts)
  if (filePropertyType) {
    return filePropertyType
  }

  const value = traverseOutputPath(outputs, pathParts)
  return extractType(value)
}
```

--------------------------------------------------------------------------------

---[FILE: block-path-calculator.ts]---
Location: sim-main/apps/sim/lib/workflows/blocks/block-path-calculator.ts

```typescript
import type { SerializedWorkflow } from '@/serializer/types'

/**
 * Shared utility for calculating block paths and accessible connections.
 * Used by both frontend (useBlockConnections) and backend (InputResolver) to ensure consistency.
 */
export class BlockPathCalculator {
  /**
   * Finds all blocks along paths leading to the target block.
   * This is a reverse traversal from the target node to find all ancestors
   * along connected paths using BFS.
   *
   * @param edges - List of all edges in the graph
   * @param targetNodeId - ID of the target block we're finding connections for
   * @returns Array of unique ancestor node IDs
   */
  static findAllPathNodes(
    edges: Array<{ source: string; target: string }>,
    targetNodeId: string
  ): string[] {
    // We'll use a reverse topological sort approach by tracking "distance" from target
    const nodeDistances = new Map<string, number>()
    const visited = new Set<string>()
    const queue: [string, number][] = [[targetNodeId, 0]] // [nodeId, distance]
    const pathNodes = new Set<string>()

    // Build a reverse adjacency list for faster traversal
    const reverseAdjList: Record<string, string[]> = {}
    for (const edge of edges) {
      if (!reverseAdjList[edge.target]) {
        reverseAdjList[edge.target] = []
      }
      reverseAdjList[edge.target].push(edge.source)
    }

    // BFS to find all ancestors and their shortest distance from target
    while (queue.length > 0) {
      const [currentNodeId, distance] = queue.shift()!

      if (visited.has(currentNodeId)) {
        // If we've seen this node before, update its distance if this path is shorter
        const currentDistance = nodeDistances.get(currentNodeId) || Number.POSITIVE_INFINITY
        if (distance < currentDistance) {
          nodeDistances.set(currentNodeId, distance)
        }
        continue
      }

      visited.add(currentNodeId)
      nodeDistances.set(currentNodeId, distance)

      // Don't add the target node itself to the results
      if (currentNodeId !== targetNodeId) {
        pathNodes.add(currentNodeId)
      }

      // Get all incoming edges from the reverse adjacency list
      const incomingNodeIds = reverseAdjList[currentNodeId] || []

      // Add all source nodes to the queue with incremented distance
      for (const sourceId of incomingNodeIds) {
        queue.push([sourceId, distance + 1])
      }
    }

    return Array.from(pathNodes)
  }

  /**
   * Calculates accessible blocks for all blocks in a workflow.
   * This ensures consistent block reference resolution across frontend and backend.
   *
   * @param workflow - The serialized workflow
   * @returns Map of block ID to Set of accessible block IDs
   */
  static calculateAccessibleBlocksForWorkflow(
    workflow: SerializedWorkflow
  ): Map<string, Set<string>> {
    const accessibleMap = new Map<string, Set<string>>()

    for (const block of workflow.blocks) {
      const accessibleBlocks = new Set<string>()

      // Find all blocks along paths leading to this block
      const pathNodes = BlockPathCalculator.findAllPathNodes(workflow.connections, block.id)
      pathNodes.forEach((nodeId) => accessibleBlocks.add(nodeId))

      // Only add starter block if it's actually upstream (already in pathNodes)
      // Don't add it just because it exists on the canvas
      const starterBlock = workflow.blocks.find((b) => b.metadata?.id === 'starter')
      if (starterBlock && starterBlock.id !== block.id && pathNodes.includes(starterBlock.id)) {
        accessibleBlocks.add(starterBlock.id)
      }

      accessibleMap.set(block.id, accessibleBlocks)
    }

    return accessibleMap
  }

  /**
   * Gets accessible block names for a specific block (for error messages).
   *
   * @param blockId - The block ID to get accessible names for
   * @param workflow - The serialized workflow
   * @param accessibleBlocksMap - Pre-calculated accessible blocks map
   * @returns Array of accessible block names and aliases
   */
  static getAccessibleBlockNames(
    blockId: string,
    workflow: SerializedWorkflow,
    accessibleBlocksMap: Map<string, Set<string>>
  ): string[] {
    const accessibleBlockIds = accessibleBlocksMap.get(blockId) || new Set<string>()
    const names: string[] = []

    // Create a map of block IDs to blocks for efficient lookup
    const blockById = new Map(workflow.blocks.map((block) => [block.id, block]))

    for (const accessibleBlockId of accessibleBlockIds) {
      const block = blockById.get(accessibleBlockId)
      if (block) {
        // Add both the actual name and the normalized name
        if (block.metadata?.name) {
          names.push(block.metadata.name)
          names.push(block.metadata.name.toLowerCase().replace(/\s+/g, ''))
        }
        names.push(accessibleBlockId)
      }
    }

    // Add special aliases
    names.push('start') // Always allow start alias

    return [...new Set(names)] // Remove duplicates
  }
}
```

--------------------------------------------------------------------------------

---[FILE: credential-extractor.ts]---
Location: sim-main/apps/sim/lib/workflows/credentials/credential-extractor.ts

```typescript
import { getBlock } from '@/blocks/registry'
import type { SubBlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'

// Credential types based on actual patterns in the codebase
export enum CredentialType {
  OAUTH = 'oauth',
  SECRET = 'secret', // password: true (covers API keys, bot tokens, passwords, etc.)
}

// Type for credential requirement
export interface CredentialRequirement {
  type: CredentialType
  serviceId?: string // For OAuth (e.g., 'google-drive', 'slack')
  label: string // Human-readable label
  blockType: string // The block type that requires this
  subBlockId: string // The subblock ID for reference
  required: boolean
}

// Workspace-specific subblock types that should be cleared
const WORKSPACE_SPECIFIC_TYPES = new Set([
  'knowledge-base-selector',
  'knowledge-tag-filters',
  'document-selector',
  'document-tag-entry',
  'file-selector', // Workspace files
  'file-upload', // Uploaded files in workspace
  'project-selector', // Workspace-specific projects
  'channel-selector', // Workspace-specific channels
  'folder-selector', // User-specific folders
  'mcp-server-selector', // User-specific MCP servers
])

// Field IDs that are workspace-specific
const WORKSPACE_SPECIFIC_FIELDS = new Set([
  'knowledgeBaseId',
  'tagFilters',
  'documentTags',
  'documentId',
  'fileId',
  'projectId',
  'channelId',
  'folderId',
])

/**
 * Extract required credentials from a workflow state
 * This analyzes all blocks and their subblocks to identify credential requirements
 */
export function extractRequiredCredentials(state: any): CredentialRequirement[] {
  const credentials: CredentialRequirement[] = []
  const seen = new Set<string>()

  if (!state?.blocks) {
    return credentials
  }

  // Process each block
  Object.values(state.blocks).forEach((block: any) => {
    if (!block?.type) return

    const blockConfig = getBlock(block.type)
    if (!blockConfig) return

    // Add OAuth credential if block has OAuth auth mode
    if (blockConfig.authMode === AuthMode.OAuth) {
      const blockName = blockConfig.name || block.type
      const key = `oauth-${block.type}`

      if (!seen.has(key)) {
        seen.add(key)
        credentials.push({
          type: CredentialType.OAUTH,
          serviceId: block.type,
          label: `Credential for ${blockName}`,
          blockType: block.type,
          subBlockId: 'oauth',
          required: true,
        })
      }
    }

    // Process password fields (API keys, tokens, etc)
    blockConfig.subBlocks?.forEach((subBlockConfig: SubBlockConfig) => {
      if (!isSubBlockVisible(block, subBlockConfig)) return
      if (!subBlockConfig.password) return

      const blockName = blockConfig.name || block.type
      const suffix = block?.triggerMode ? ' Trigger' : ''
      const fieldLabel = subBlockConfig.title || formatFieldName(subBlockConfig.id)
      const key = `secret-${block.type}-${subBlockConfig.id}-${block?.triggerMode ? 'trigger' : 'default'}`

      if (!seen.has(key)) {
        seen.add(key)
        credentials.push({
          type: CredentialType.SECRET,
          label: `${fieldLabel} for ${blockName}${suffix}`,
          blockType: block.type,
          subBlockId: subBlockConfig.id,
          required: subBlockConfig.required !== false,
        })
      }
    })
  })

  // Helper to check visibility, respecting mode and conditions
  function isSubBlockVisible(block: any, subBlockConfig: SubBlockConfig): boolean {
    const mode = subBlockConfig.mode ?? 'both'
    if (mode === 'trigger' && !block?.triggerMode) return false
    if (mode === 'basic' && block?.advancedMode) return false
    if (mode === 'advanced' && !block?.advancedMode) return false

    if (!subBlockConfig.condition) return true

    const condition =
      typeof subBlockConfig.condition === 'function'
        ? subBlockConfig.condition()
        : subBlockConfig.condition

    const evaluate = (cond: any): boolean => {
      const currentValue = block?.subBlocks?.[cond.field]?.value
      const expected = cond.value

      let match =
        expected === undefined
          ? true
          : Array.isArray(expected)
            ? expected.includes(currentValue)
            : currentValue === expected

      if (cond.not) match = !match
      if (cond.and) match = match && evaluate(cond.and)

      return match
    }

    return evaluate(condition)
  }

  // Sort: OAuth first, then secrets, alphabetically within each type
  credentials.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === CredentialType.OAUTH ? -1 : 1
    }
    return a.label.localeCompare(b.label)
  })

  return credentials
}

/**
 * Format field name to be human-readable
 */
function formatFieldName(fieldName: string): string {
  return fieldName
    .replace(/[_-]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Sanitize workflow state by removing all credentials and workspace-specific data
 * This is used for both template creation and workflow export to ensure consistency
 *
 * @param state - The workflow state to sanitize
 * @param options - Options for sanitization behavior
 */
export function sanitizeWorkflowForSharing(
  state: any,
  options: {
    preserveEnvVars?: boolean // Keep {{VAR}} references for export
  } = {}
): any {
  const sanitized = JSON.parse(JSON.stringify(state)) // Deep clone

  if (!sanitized?.blocks) {
    return sanitized
  }

  Object.values(sanitized.blocks).forEach((block: any) => {
    if (!block?.type) return

    const blockConfig = getBlock(block.type)

    // Process subBlocks with config
    if (blockConfig) {
      blockConfig.subBlocks?.forEach((subBlockConfig: SubBlockConfig) => {
        if (block.subBlocks?.[subBlockConfig.id]) {
          const subBlock = block.subBlocks[subBlockConfig.id]

          // Clear OAuth credentials (type: 'oauth-input')
          if (subBlockConfig.type === 'oauth-input') {
            block.subBlocks[subBlockConfig.id].value = null
          }

          // Clear secret fields (password: true)
          else if (subBlockConfig.password === true) {
            // Preserve environment variable references if requested
            if (
              options.preserveEnvVars &&
              typeof subBlock.value === 'string' &&
              subBlock.value.startsWith('{{') &&
              subBlock.value.endsWith('}}')
            ) {
              // Keep the env var reference
            } else {
              block.subBlocks[subBlockConfig.id].value = null
            }
          }

          // Clear workspace-specific selectors
          else if (WORKSPACE_SPECIFIC_TYPES.has(subBlockConfig.type)) {
            block.subBlocks[subBlockConfig.id].value = null
          }

          // Clear workspace-specific fields by ID
          else if (WORKSPACE_SPECIFIC_FIELDS.has(subBlockConfig.id)) {
            block.subBlocks[subBlockConfig.id].value = null
          }
        }
      })
    }

    // Process subBlocks without config (fallback)
    if (block.subBlocks) {
      Object.entries(block.subBlocks).forEach(([key, subBlock]: [string, any]) => {
        // Clear workspace-specific fields by key name
        if (WORKSPACE_SPECIFIC_FIELDS.has(key)) {
          subBlock.value = null
        }
      })
    }

    // Clear data field (for backward compatibility)
    if (block.data) {
      Object.entries(block.data).forEach(([key, value]: [string, any]) => {
        // Clear anything that looks like credentials
        if (/credential|oauth|api[_-]?key|token|secret|auth|password|bearer/i.test(key)) {
          block.data[key] = null
        }
        // Clear workspace-specific data
        if (WORKSPACE_SPECIFIC_FIELDS.has(key)) {
          block.data[key] = null
        }
      })
    }
  })

  return sanitized
}

/**
 * Sanitize workflow state for templates (removes credentials and workspace data)
 * Wrapper for backward compatibility
 */
export function sanitizeCredentials(state: any): any {
  return sanitizeWorkflowForSharing(state, { preserveEnvVars: false })
}

/**
 * Sanitize workflow state for export (preserves env vars)
 * Convenience wrapper for workflow export
 */
export function sanitizeForExport(state: any): any {
  return sanitizeWorkflowForSharing(state, { preserveEnvVars: true })
}
```

--------------------------------------------------------------------------------

````
