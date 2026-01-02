---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 592
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 592 of 933)

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

---[FILE: core.ts]---
Location: sim-main/apps/sim/lib/workflows/autolayout/core.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import {
  CONTAINER_LAYOUT_OPTIONS,
  DEFAULT_LAYOUT_OPTIONS,
  MAX_OVERLAP_ITERATIONS,
} from '@/lib/workflows/autolayout/constants'
import type { Edge, GraphNode, LayoutOptions } from '@/lib/workflows/autolayout/types'
import {
  getBlockMetrics,
  normalizePositions,
  prepareBlockMetrics,
} from '@/lib/workflows/autolayout/utils'
import { BLOCK_DIMENSIONS, HANDLE_POSITIONS } from '@/lib/workflows/blocks/block-dimensions'
import type { BlockState } from '@/stores/workflows/workflow/types'

const logger = createLogger('AutoLayout:Core')

const SUBFLOW_END_HANDLES = new Set(['loop-end-source', 'parallel-end-source'])
const SUBFLOW_START_HANDLES = new Set(['loop-start-source', 'parallel-start-source'])

/**
 * Calculates the Y offset for a source handle based on block type and handle ID.
 */
function getSourceHandleYOffset(block: BlockState, sourceHandle?: string | null): number {
  if (sourceHandle === 'error') {
    const blockHeight = block.height || BLOCK_DIMENSIONS.MIN_HEIGHT
    return blockHeight - HANDLE_POSITIONS.ERROR_BOTTOM_OFFSET
  }

  if (sourceHandle && SUBFLOW_START_HANDLES.has(sourceHandle)) {
    return HANDLE_POSITIONS.SUBFLOW_START_Y_OFFSET
  }

  if (block.type === 'condition' && sourceHandle?.startsWith('condition-')) {
    const conditionId = sourceHandle.replace('condition-', '')
    try {
      const conditionsValue = block.subBlocks?.conditions?.value
      if (typeof conditionsValue === 'string' && conditionsValue) {
        const conditions = JSON.parse(conditionsValue) as Array<{ id?: string }>
        const conditionIndex = conditions.findIndex((c) => c.id === conditionId)
        if (conditionIndex >= 0) {
          return (
            HANDLE_POSITIONS.CONDITION_START_Y +
            conditionIndex * HANDLE_POSITIONS.CONDITION_ROW_HEIGHT
          )
        }
      }
    } catch {
      // Fall back to default offset
    }
  }

  return HANDLE_POSITIONS.DEFAULT_Y_OFFSET
}

/**
 * Calculates the Y offset for a target handle based on block type and handle ID.
 */
function getTargetHandleYOffset(_block: BlockState, _targetHandle?: string | null): number {
  return HANDLE_POSITIONS.DEFAULT_Y_OFFSET
}

/**
 * Checks if an edge comes from a subflow end handle
 */
function isSubflowEndEdge(edge: Edge): boolean {
  return edge.sourceHandle != null && SUBFLOW_END_HANDLES.has(edge.sourceHandle)
}

/**
 * Assigns layers (columns) to blocks using topological sort.
 * Blocks with no incoming edges are placed in layer 0.
 * When edges come from subflow end handles, the subflow's internal depth is added.
 *
 * @param blocks - The blocks to assign layers to
 * @param edges - The edges connecting blocks
 * @param subflowDepths - Optional map of container block IDs to their internal depth (max layers inside)
 */
export function assignLayers(
  blocks: Record<string, BlockState>,
  edges: Edge[],
  subflowDepths?: Map<string, number>
): Map<string, GraphNode> {
  const nodes = new Map<string, GraphNode>()

  // Initialize nodes
  for (const [id, block] of Object.entries(blocks)) {
    nodes.set(id, {
      id,
      block,
      metrics: getBlockMetrics(block),
      incoming: new Set(),
      outgoing: new Set(),
      layer: 0,
      position: { ...block.position },
    })
  }

  // Build a map of target node -> edges coming into it (to check sourceHandle later)
  const incomingEdgesMap = new Map<string, Edge[]>()
  for (const edge of edges) {
    if (!incomingEdgesMap.has(edge.target)) {
      incomingEdgesMap.set(edge.target, [])
    }
    incomingEdgesMap.get(edge.target)!.push(edge)
  }

  // Build adjacency from edges
  for (const edge of edges) {
    const sourceNode = nodes.get(edge.source)
    const targetNode = nodes.get(edge.target)

    if (sourceNode && targetNode) {
      sourceNode.outgoing.add(edge.target)
      targetNode.incoming.add(edge.source)
    }
  }

  // Find starter nodes (no incoming edges)
  const starterNodes = Array.from(nodes.values()).filter((node) => node.incoming.size === 0)

  if (starterNodes.length === 0 && nodes.size > 0) {
    const firstNode = Array.from(nodes.values())[0]
    starterNodes.push(firstNode)
    logger.warn('No starter blocks found, using first block as starter', { blockId: firstNode.id })
  }

  // Topological sort using Kahn's algorithm
  const inDegreeCount = new Map<string, number>()

  for (const node of nodes.values()) {
    inDegreeCount.set(node.id, node.incoming.size)
    if (starterNodes.includes(node)) {
      node.layer = 0
    }
  }

  const queue: string[] = starterNodes.map((n) => n.id)
  const processed = new Set<string>()

  while (queue.length > 0) {
    const nodeId = queue.shift()!
    const node = nodes.get(nodeId)!
    processed.add(nodeId)

    // Calculate layer based on max incoming layer + 1
    // For edges from subflow ends, add the subflow's internal depth (minus 1 to avoid double-counting)
    if (node.incoming.size > 0) {
      let maxEffectiveLayer = -1
      const incomingEdges = incomingEdgesMap.get(nodeId) || []

      for (const incomingId of node.incoming) {
        const incomingNode = nodes.get(incomingId)
        if (incomingNode) {
          // Find edges from this incoming node to check if it's a subflow end edge
          const edgesFromSource = incomingEdges.filter((e) => e.source === incomingId)
          let additionalDepth = 0

          // Check if any edge from this source is a subflow end edge
          const hasSubflowEndEdge = edgesFromSource.some(isSubflowEndEdge)
          if (hasSubflowEndEdge && subflowDepths) {
            // Get the internal depth of the subflow
            // Subtract 1 because the +1 at the end of layer calculation already accounts for one layer
            // E.g., if subflow has 2 internal layers (depth=2), we add 1 extra so total offset is 2
            const depth = subflowDepths.get(incomingId) ?? 1
            additionalDepth = Math.max(0, depth - 1)
          }

          const effectiveLayer = incomingNode.layer + additionalDepth
          maxEffectiveLayer = Math.max(maxEffectiveLayer, effectiveLayer)
        }
      }
      node.layer = maxEffectiveLayer + 1
    }

    // Add outgoing nodes when all dependencies processed
    for (const targetId of node.outgoing) {
      const currentCount = inDegreeCount.get(targetId) || 0
      inDegreeCount.set(targetId, currentCount - 1)

      if (inDegreeCount.get(targetId) === 0 && !processed.has(targetId)) {
        queue.push(targetId)
      }
    }
  }

  // Handle isolated nodes
  for (const node of nodes.values()) {
    if (!processed.has(node.id)) {
      logger.debug('Isolated node detected, assigning to layer 0', { blockId: node.id })
      node.layer = 0
    }
  }

  return nodes
}

/**
 * Groups nodes by their layer number
 */
export function groupByLayer(nodes: Map<string, GraphNode>): Map<number, GraphNode[]> {
  const layers = new Map<number, GraphNode[]>()

  for (const node of nodes.values()) {
    if (!layers.has(node.layer)) {
      layers.set(node.layer, [])
    }
    layers.get(node.layer)!.push(node)
  }

  return layers
}

/**
 * Resolves vertical overlaps between nodes in the same layer.
 * X overlaps are prevented by construction via cumulative width-based positioning.
 */
function resolveVerticalOverlaps(nodes: GraphNode[], verticalSpacing: number): void {
  let iteration = 0
  let hasOverlap = true

  while (hasOverlap && iteration < MAX_OVERLAP_ITERATIONS) {
    hasOverlap = false
    iteration++

    // Group nodes by layer for same-layer overlap resolution
    const nodesByLayer = new Map<number, GraphNode[]>()
    for (const node of nodes) {
      if (!nodesByLayer.has(node.layer)) {
        nodesByLayer.set(node.layer, [])
      }
      nodesByLayer.get(node.layer)!.push(node)
    }

    // Process each layer independently
    for (const [layer, layerNodes] of nodesByLayer) {
      if (layerNodes.length < 2) continue

      // Sort by Y position for consistent processing
      layerNodes.sort((a, b) => a.position.y - b.position.y)

      for (let i = 0; i < layerNodes.length - 1; i++) {
        const node1 = layerNodes[i]
        const node2 = layerNodes[i + 1]

        const node1Bottom = node1.position.y + node1.metrics.height
        const requiredY = node1Bottom + verticalSpacing

        if (node2.position.y < requiredY) {
          hasOverlap = true
          node2.position.y = requiredY

          logger.debug('Resolved vertical overlap in layer', {
            layer,
            block1: node1.id,
            block2: node2.id,
            iteration,
          })
        }
      }
    }
  }

  if (hasOverlap) {
    logger.warn('Could not fully resolve all vertical overlaps after max iterations', {
      iterations: MAX_OVERLAP_ITERATIONS,
    })
  }
}

/**
 * Checks if a block is a container type (loop or parallel)
 */
function isContainerBlock(node: GraphNode): boolean {
  return node.block.type === 'loop' || node.block.type === 'parallel'
}

/**
 * Extra vertical spacing after containers to prevent edge crossings with sibling blocks.
 * This creates clearance for edges from container ends to route cleanly.
 */
const CONTAINER_VERTICAL_CLEARANCE = 120

/**
 * Calculates positions for nodes organized by layer.
 * Uses cumulative width-based X positioning to properly handle containers of varying widths.
 * Aligns blocks based on their connected predecessors to achieve handle-to-handle alignment.
 *
 * Handle alignment: Calculates actual source handle Y positions based on block type
 * (condition blocks have handles at different heights for each branch).
 * Target handles are also calculated per-block to ensure precise alignment.
 */
export function calculatePositions(
  layers: Map<number, GraphNode[]>,
  edges: Edge[],
  options: LayoutOptions = {}
): void {
  const horizontalSpacing = options.horizontalSpacing ?? DEFAULT_LAYOUT_OPTIONS.horizontalSpacing
  const verticalSpacing = options.verticalSpacing ?? DEFAULT_LAYOUT_OPTIONS.verticalSpacing
  const padding = options.padding ?? DEFAULT_LAYOUT_OPTIONS.padding

  const layerNumbers = Array.from(layers.keys()).sort((a, b) => a - b)

  // Calculate max width for each layer
  const layerWidths = new Map<number, number>()
  for (const layerNum of layerNumbers) {
    const nodesInLayer = layers.get(layerNum)!
    const maxWidth = Math.max(...nodesInLayer.map((n) => n.metrics.width))
    layerWidths.set(layerNum, maxWidth)
  }

  // Calculate cumulative X positions for each layer based on actual widths
  const layerXPositions = new Map<number, number>()
  let cumulativeX = padding.x

  for (const layerNum of layerNumbers) {
    layerXPositions.set(layerNum, cumulativeX)
    cumulativeX += layerWidths.get(layerNum)! + horizontalSpacing
  }

  // Build a flat map of all nodes for quick lookups
  const allNodes = new Map<string, GraphNode>()
  for (const nodesInLayer of layers.values()) {
    for (const node of nodesInLayer) {
      allNodes.set(node.id, node)
    }
  }

  // Build incoming edges map for handle lookups
  const incomingEdgesMap = new Map<string, Edge[]>()
  for (const edge of edges) {
    if (!incomingEdgesMap.has(edge.target)) {
      incomingEdgesMap.set(edge.target, [])
    }
    incomingEdgesMap.get(edge.target)!.push(edge)
  }

  // Position nodes layer by layer, aligning with connected predecessors
  for (const layerNum of layerNumbers) {
    const nodesInLayer = layers.get(layerNum)!
    const xPosition = layerXPositions.get(layerNum)!

    // Separate containers and non-containers
    const containersInLayer = nodesInLayer.filter(isContainerBlock)
    const nonContainersInLayer = nodesInLayer.filter((n) => !isContainerBlock(n))

    // For the first layer (layer 0), position sequentially from padding.y
    if (layerNum === 0) {
      let yOffset = padding.y

      // Sort containers by height for visual balance
      containersInLayer.sort((a, b) => b.metrics.height - a.metrics.height)

      for (const node of containersInLayer) {
        node.position = { x: xPosition, y: yOffset }
        yOffset += node.metrics.height + verticalSpacing
      }

      if (containersInLayer.length > 0 && nonContainersInLayer.length > 0) {
        yOffset += CONTAINER_VERTICAL_CLEARANCE
      }

      // Sort non-containers by outgoing connections
      nonContainersInLayer.sort((a, b) => b.outgoing.size - a.outgoing.size)

      for (const node of nonContainersInLayer) {
        node.position = { x: xPosition, y: yOffset }
        yOffset += node.metrics.height + verticalSpacing
      }
      continue
    }

    // For subsequent layers, align with connected predecessors (handle-to-handle)
    for (const node of [...containersInLayer, ...nonContainersInLayer]) {
      // Find the bottommost predecessor handle Y (highest value) and align to it
      let bestSourceHandleY = -1
      let bestEdge: Edge | null = null
      const incomingEdges = incomingEdgesMap.get(node.id) || []

      for (const edge of incomingEdges) {
        const predecessor = allNodes.get(edge.source)
        if (predecessor) {
          // Calculate actual source handle Y position based on block type and handle
          const sourceHandleOffset = getSourceHandleYOffset(predecessor.block, edge.sourceHandle)
          const sourceHandleY = predecessor.position.y + sourceHandleOffset

          if (sourceHandleY > bestSourceHandleY) {
            bestSourceHandleY = sourceHandleY
            bestEdge = edge
          }
        }
      }

      // If no predecessors found (shouldn't happen for layer > 0), use padding
      if (bestSourceHandleY < 0) {
        bestSourceHandleY = padding.y + HANDLE_POSITIONS.DEFAULT_Y_OFFSET
      }

      // Calculate the target handle Y offset for this node
      const targetHandleOffset = getTargetHandleYOffset(node.block, bestEdge?.targetHandle)

      // Position node so its target handle aligns with the source handle Y
      node.position = { x: xPosition, y: bestSourceHandleY - targetHandleOffset }
    }
  }

  // Resolve vertical overlaps within layers (X overlaps prevented by cumulative positioning)
  resolveVerticalOverlaps(Array.from(layers.values()).flat(), verticalSpacing)
}

/**
 * Core layout function that performs the complete layout pipeline:
 * 1. Assign layers using topological sort
 * 2. Prepare block metrics
 * 3. Group nodes by layer
 * 4. Calculate positions
 * 5. Normalize positions to start from padding
 *
 * @param blocks - The blocks to lay out
 * @param edges - The edges connecting blocks
 * @param options - Layout options including container flag and subflow depths
 * @returns The laid-out nodes with updated positions, and bounding dimensions
 */
export function layoutBlocksCore(
  blocks: Record<string, BlockState>,
  edges: Edge[],
  options: {
    isContainer: boolean
    layoutOptions?: LayoutOptions
    subflowDepths?: Map<string, number>
  }
): { nodes: Map<string, GraphNode>; dimensions: { width: number; height: number } } {
  if (Object.keys(blocks).length === 0) {
    return { nodes: new Map(), dimensions: { width: 0, height: 0 } }
  }

  const layoutOptions =
    options.layoutOptions ??
    (options.isContainer ? CONTAINER_LAYOUT_OPTIONS : DEFAULT_LAYOUT_OPTIONS)

  // 1. Assign layers (with subflow depth adjustment for subflow end edges)
  const nodes = assignLayers(blocks, edges, options.subflowDepths)

  // 2. Prepare metrics
  prepareBlockMetrics(nodes)

  // 3. Group by layer
  const layers = groupByLayer(nodes)

  // 4. Calculate positions (pass edges for handle offset calculations)
  calculatePositions(layers, edges, layoutOptions)

  // 5. Normalize positions
  const dimensions = normalizePositions(nodes, { isContainer: options.isContainer })

  return { nodes, dimensions }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/lib/workflows/autolayout/index.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import {
  DEFAULT_HORIZONTAL_SPACING,
  DEFAULT_VERTICAL_SPACING,
} from '@/lib/workflows/autolayout/constants'
import { layoutContainers } from '@/lib/workflows/autolayout/containers'
import { assignLayers, layoutBlocksCore } from '@/lib/workflows/autolayout/core'
import type { Edge, LayoutOptions, LayoutResult } from '@/lib/workflows/autolayout/types'
import {
  calculateSubflowDepths,
  filterLayoutEligibleBlockIds,
  getBlocksByParent,
  prepareContainerDimensions,
} from '@/lib/workflows/autolayout/utils'
import type { BlockState } from '@/stores/workflows/workflow/types'

const logger = createLogger('AutoLayout')

/**
 * Applies automatic layout to all blocks in a workflow.
 * Positions blocks in layers based on their connections (edges).
 */
export function applyAutoLayout(
  blocks: Record<string, BlockState>,
  edges: Edge[],
  options: LayoutOptions = {}
): LayoutResult {
  try {
    logger.info('Starting auto layout', {
      blockCount: Object.keys(blocks).length,
      edgeCount: edges.length,
    })

    const blocksCopy: Record<string, BlockState> = JSON.parse(JSON.stringify(blocks))

    const horizontalSpacing = options.horizontalSpacing ?? DEFAULT_HORIZONTAL_SPACING
    const verticalSpacing = options.verticalSpacing ?? DEFAULT_VERTICAL_SPACING

    // Pre-calculate container dimensions by laying out their children (bottom-up)
    // This ensures accurate widths/heights before root-level layout
    prepareContainerDimensions(
      blocksCopy,
      edges,
      layoutBlocksCore,
      horizontalSpacing,
      verticalSpacing
    )

    const { root: rootBlockIds } = getBlocksByParent(blocksCopy)
    const layoutRootIds = filterLayoutEligibleBlockIds(rootBlockIds, blocksCopy)

    const rootBlocks: Record<string, BlockState> = {}
    for (const id of layoutRootIds) {
      rootBlocks[id] = blocksCopy[id]
    }

    const rootEdges = edges.filter(
      (edge) => layoutRootIds.includes(edge.source) && layoutRootIds.includes(edge.target)
    )

    // Calculate subflow depths before laying out root blocks
    // This ensures blocks connected to subflow ends are positioned correctly
    const subflowDepths = calculateSubflowDepths(blocksCopy, edges, assignLayers)

    if (Object.keys(rootBlocks).length > 0) {
      const { nodes } = layoutBlocksCore(rootBlocks, rootEdges, {
        isContainer: false,
        layoutOptions: options,
        subflowDepths,
      })

      for (const node of nodes.values()) {
        blocksCopy[node.id].position = node.position
      }
    }

    layoutContainers(blocksCopy, edges, options)

    logger.info('Auto layout completed successfully', {
      blockCount: Object.keys(blocksCopy).length,
    })

    return {
      blocks: blocksCopy,
      success: true,
    }
  } catch (error) {
    logger.error('Auto layout failed', { error })
    return {
      blocks,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export type { TargetedLayoutOptions } from '@/lib/workflows/autolayout/targeted'
// Function exports
export { applyTargetedLayout } from '@/lib/workflows/autolayout/targeted'
// Type exports
export type { Edge, LayoutOptions, LayoutResult } from '@/lib/workflows/autolayout/types'
export {
  getBlockMetrics,
  isContainerType,
  shouldSkipAutoLayout,
  transferBlockHeights,
} from '@/lib/workflows/autolayout/utils'
```

--------------------------------------------------------------------------------

---[FILE: targeted.ts]---
Location: sim-main/apps/sim/lib/workflows/autolayout/targeted.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import {
  CONTAINER_PADDING,
  DEFAULT_HORIZONTAL_SPACING,
  DEFAULT_VERTICAL_SPACING,
} from '@/lib/workflows/autolayout/constants'
import { assignLayers, layoutBlocksCore } from '@/lib/workflows/autolayout/core'
import type { Edge, LayoutOptions } from '@/lib/workflows/autolayout/types'
import {
  calculateSubflowDepths,
  filterLayoutEligibleBlockIds,
  getBlockMetrics,
  getBlocksByParent,
  isContainerType,
  prepareContainerDimensions,
  shouldSkipAutoLayout,
} from '@/lib/workflows/autolayout/utils'
import { CONTAINER_DIMENSIONS } from '@/lib/workflows/blocks/block-dimensions'
import type { BlockState } from '@/stores/workflows/workflow/types'

const logger = createLogger('AutoLayout:Targeted')

export interface TargetedLayoutOptions extends LayoutOptions {
  changedBlockIds: string[]
  verticalSpacing?: number
  horizontalSpacing?: number
}

/**
 * Applies targeted layout to only reposition changed blocks.
 * Unchanged blocks act as anchors to preserve existing layout.
 */
export function applyTargetedLayout(
  blocks: Record<string, BlockState>,
  edges: Edge[],
  options: TargetedLayoutOptions
): Record<string, BlockState> {
  const {
    changedBlockIds,
    verticalSpacing = DEFAULT_VERTICAL_SPACING,
    horizontalSpacing = DEFAULT_HORIZONTAL_SPACING,
  } = options

  if (!changedBlockIds || changedBlockIds.length === 0) {
    return blocks
  }

  const changedSet = new Set(changedBlockIds)
  const blocksCopy: Record<string, BlockState> = JSON.parse(JSON.stringify(blocks))

  // Pre-calculate container dimensions by laying out their children (bottom-up)
  // This ensures accurate widths/heights before root-level layout
  prepareContainerDimensions(
    blocksCopy,
    edges,
    layoutBlocksCore,
    horizontalSpacing,
    verticalSpacing
  )

  const groups = getBlocksByParent(blocksCopy)

  // Calculate subflow depths before layout to properly position blocks after subflow ends
  const subflowDepths = calculateSubflowDepths(blocksCopy, edges, assignLayers)

  layoutGroup(
    null,
    groups.root,
    blocksCopy,
    edges,
    changedSet,
    verticalSpacing,
    horizontalSpacing,
    subflowDepths
  )

  for (const [parentId, childIds] of groups.children.entries()) {
    layoutGroup(
      parentId,
      childIds,
      blocksCopy,
      edges,
      changedSet,
      verticalSpacing,
      horizontalSpacing,
      subflowDepths
    )
  }

  return blocksCopy
}

/**
 * Layouts a group of blocks (either root level or within a container)
 */
function layoutGroup(
  parentId: string | null,
  childIds: string[],
  blocks: Record<string, BlockState>,
  edges: Edge[],
  changedSet: Set<string>,
  verticalSpacing: number,
  horizontalSpacing: number,
  subflowDepths: Map<string, number>
): void {
  if (childIds.length === 0) return

  const parentBlock = parentId ? blocks[parentId] : undefined

  const layoutEligibleChildIds = filterLayoutEligibleBlockIds(childIds, blocks)

  if (layoutEligibleChildIds.length === 0) {
    if (parentBlock) {
      updateContainerDimensions(parentBlock, childIds, blocks)
    }
    return
  }

  // Determine which blocks need repositioning
  const requestedLayout = layoutEligibleChildIds.filter((id) => {
    const block = blocks[id]
    if (!block) return false
    if (isContainerType(block.type)) {
      return changedSet.has(id) && isDefaultPosition(block)
    }
    return changedSet.has(id)
  })
  const missingPositions = layoutEligibleChildIds.filter((id) => {
    const block = blocks[id]
    if (!block) return false
    return !hasPosition(block) || isDefaultPosition(block)
  })
  const needsLayoutSet = new Set([...requestedLayout, ...missingPositions])
  const needsLayout = Array.from(needsLayoutSet)

  if (parentBlock) {
    updateContainerDimensions(parentBlock, childIds, blocks)
  }

  if (needsLayout.length === 0) {
    return
  }

  // Store old positions for anchor calculation
  const oldPositions = new Map<string, { x: number; y: number }>()
  for (const id of layoutEligibleChildIds) {
    const block = blocks[id]
    if (!block) continue
    oldPositions.set(id, { ...block.position })
  }

  // Compute layout positions using core function
  // Only pass subflowDepths for root-level layout (not inside containers)
  const layoutPositions = computeLayoutPositions(
    layoutEligibleChildIds,
    blocks,
    edges,
    parentBlock,
    horizontalSpacing,
    verticalSpacing,
    parentId === null ? subflowDepths : undefined
  )

  if (layoutPositions.size === 0) {
    if (parentBlock) {
      updateContainerDimensions(parentBlock, childIds, blocks)
    }
    return
  }

  // Find anchor block (unchanged block with a layout position)
  let offsetX = 0
  let offsetY = 0

  const anchorId = layoutEligibleChildIds.find(
    (id) => !needsLayout.includes(id) && layoutPositions.has(id)
  )

  if (anchorId) {
    const oldPos = oldPositions.get(anchorId)
    const newPos = layoutPositions.get(anchorId)
    if (oldPos && newPos) {
      offsetX = oldPos.x - newPos.x
      offsetY = oldPos.y - newPos.y
    }
  }

  // Apply new positions only to blocks that need layout
  for (const id of needsLayout) {
    const block = blocks[id]
    const newPos = layoutPositions.get(id)
    if (!block || !newPos) continue
    block.position = {
      x: newPos.x + offsetX,
      y: newPos.y + offsetY,
    }
  }
}

/**
 * Computes layout positions for a subset of blocks using the core layout
 */
function computeLayoutPositions(
  childIds: string[],
  blocks: Record<string, BlockState>,
  edges: Edge[],
  parentBlock: BlockState | undefined,
  horizontalSpacing: number,
  verticalSpacing: number,
  subflowDepths?: Map<string, number>
): Map<string, { x: number; y: number }> {
  const subsetBlocks: Record<string, BlockState> = {}
  for (const id of childIds) {
    subsetBlocks[id] = blocks[id]
  }

  const subsetEdges = edges.filter(
    (edge) => childIds.includes(edge.source) && childIds.includes(edge.target)
  )

  if (Object.keys(subsetBlocks).length === 0) {
    return new Map()
  }

  const isContainer = !!parentBlock
  const { nodes, dimensions } = layoutBlocksCore(subsetBlocks, subsetEdges, {
    isContainer,
    layoutOptions: {
      horizontalSpacing: isContainer ? horizontalSpacing * 0.85 : horizontalSpacing,
      verticalSpacing,
    },
    subflowDepths,
  })

  // Update parent container dimensions if applicable
  if (parentBlock) {
    parentBlock.data = {
      ...parentBlock.data,
      width: Math.max(dimensions.width, CONTAINER_DIMENSIONS.DEFAULT_WIDTH),
      height: Math.max(dimensions.height, CONTAINER_DIMENSIONS.DEFAULT_HEIGHT),
    }
  }

  // Convert nodes to position map
  const positions = new Map<string, { x: number; y: number }>()
  for (const node of nodes.values()) {
    positions.set(node.id, { x: node.position.x, y: node.position.y })
  }

  return positions
}

/**
 * Updates container dimensions based on children
 */
function updateContainerDimensions(
  parentBlock: BlockState,
  childIds: string[],
  blocks: Record<string, BlockState>
): void {
  if (childIds.length === 0) {
    parentBlock.data = {
      ...parentBlock.data,
      width: CONTAINER_DIMENSIONS.DEFAULT_WIDTH,
      height: CONTAINER_DIMENSIONS.DEFAULT_HEIGHT,
    }
    parentBlock.layout = {
      ...parentBlock.layout,
      measuredWidth: CONTAINER_DIMENSIONS.DEFAULT_WIDTH,
      measuredHeight: CONTAINER_DIMENSIONS.DEFAULT_HEIGHT,
    }
    return
  }

  let minX = Number.POSITIVE_INFINITY
  let minY = Number.POSITIVE_INFINITY
  let maxX = Number.NEGATIVE_INFINITY
  let maxY = Number.NEGATIVE_INFINITY

  for (const id of childIds) {
    const child = blocks[id]
    if (!child) continue
    if (shouldSkipAutoLayout(child)) {
      continue
    }
    const metrics = getBlockMetrics(child)

    minX = Math.min(minX, child.position.x)
    minY = Math.min(minY, child.position.y)
    maxX = Math.max(maxX, child.position.x + metrics.width)
    maxY = Math.max(maxY, child.position.y + metrics.height)
  }

  if (!Number.isFinite(minX) || !Number.isFinite(minY)) {
    return
  }

  const calculatedWidth = maxX - minX + CONTAINER_PADDING * 2
  const calculatedHeight = maxY - minY + CONTAINER_PADDING * 2

  parentBlock.data = {
    ...parentBlock.data,
    width: Math.max(calculatedWidth, CONTAINER_DIMENSIONS.DEFAULT_WIDTH),
    height: Math.max(calculatedHeight, CONTAINER_DIMENSIONS.DEFAULT_HEIGHT),
  }

  parentBlock.layout = {
    ...parentBlock.layout,
    measuredWidth: parentBlock.data.width,
    measuredHeight: parentBlock.data.height,
  }
}

/**
 * Checks if a block has a valid position
 */
function hasPosition(block: BlockState): boolean {
  if (!block.position) return false
  const { x, y } = block.position
  return Number.isFinite(x) && Number.isFinite(y)
}

/**
 * Checks if a block is at the default/uninitialized position (0, 0).
 * New blocks typically start at this position before being laid out.
 */
function isDefaultPosition(block: BlockState): boolean {
  if (!block.position) return true
  const { x, y } = block.position
  return x === 0 && y === 0
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/lib/workflows/autolayout/types.ts

```typescript
import type { BlockState, Position } from '@/stores/workflows/workflow/types'

export interface LayoutOptions {
  horizontalSpacing?: number
  verticalSpacing?: number
  padding?: { x: number; y: number }
}

export interface LayoutResult {
  blocks: Record<string, BlockState>
  success: boolean
  error?: string
}

export interface Edge {
  id: string
  source: string
  target: string
  sourceHandle?: string | null
  targetHandle?: string | null
}

export interface Loop {
  id: string
  nodes: string[]
  iterations: number
  loopType: 'for' | 'forEach' | 'while' | 'doWhile'
  forEachItems?: any[] | Record<string, any> | string // Items or expression
  whileCondition?: string // JS expression that evaluates to boolean
}

export interface Parallel {
  id: string
  nodes: string[]
  count?: number
  parallelType?: 'count' | 'collection'
}

export interface BlockMetrics {
  width: number
  height: number
  minWidth: number
  minHeight: number
  paddingTop: number
  paddingBottom: number
  paddingLeft: number
  paddingRight: number
}

export interface BoundingBox {
  x: number
  y: number
  width: number
  height: number
}

export interface LayerInfo {
  layer: number
  order: number
}

export interface GraphNode {
  id: string
  block: BlockState
  metrics: BlockMetrics
  incoming: Set<string>
  outgoing: Set<string>
  layer: number
  position: Position
}

export interface AdjustmentOptions extends LayoutOptions {
  preservePositions?: boolean
  minimalShift?: boolean
}
```

--------------------------------------------------------------------------------

````
