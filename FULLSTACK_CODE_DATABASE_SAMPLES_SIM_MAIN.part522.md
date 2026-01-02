---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 522
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 522 of 933)

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

---[FILE: parallel.ts]---
Location: sim-main/apps/sim/executor/orchestrators/parallel.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { DAG, DAGNode } from '@/executor/dag/builder'
import type { ParallelScope } from '@/executor/execution/state'
import type { BlockStateWriter } from '@/executor/execution/types'
import type { ExecutionContext, NormalizedBlockOutput } from '@/executor/types'
import type { ParallelConfigWithNodes } from '@/executor/types/parallel'
import {
  buildBranchNodeId,
  calculateBranchCount,
  extractBaseBlockId,
  extractBranchIndex,
  parseDistributionItems,
} from '@/executor/utils/subflow-utils'
import type { VariableResolver } from '@/executor/variables/resolver'
import type { SerializedParallel } from '@/serializer/types'

const logger = createLogger('ParallelOrchestrator')

export interface ParallelBranchMetadata {
  branchIndex: number
  branchTotal: number
  distributionItem?: any
  parallelId: string
}

export interface ParallelAggregationResult {
  allBranchesComplete: boolean
  results?: NormalizedBlockOutput[][]
  completedBranches?: number
  totalBranches?: number
}

export class ParallelOrchestrator {
  private resolver: VariableResolver | null = null

  constructor(
    private dag: DAG,
    private state: BlockStateWriter
  ) {}

  setResolver(resolver: VariableResolver): void {
    this.resolver = resolver
  }

  initializeParallelScope(
    ctx: ExecutionContext,
    parallelId: string,
    totalBranches: number,
    terminalNodesCount = 1
  ): ParallelScope {
    const parallelConfig = this.dag.parallelConfigs.get(parallelId)
    const items = parallelConfig ? this.resolveDistributionItems(ctx, parallelConfig) : undefined

    // If we have more items than pre-built branches, expand the DAG
    const actualBranchCount = items && items.length > totalBranches ? items.length : totalBranches

    const scope: ParallelScope = {
      parallelId,
      totalBranches: actualBranchCount,
      branchOutputs: new Map(),
      completedCount: 0,
      totalExpectedNodes: actualBranchCount * terminalNodesCount,
      items,
    }
    if (!ctx.parallelExecutions) {
      ctx.parallelExecutions = new Map()
    }
    ctx.parallelExecutions.set(parallelId, scope)

    // Dynamically expand DAG if needed
    if (items && items.length > totalBranches && parallelConfig) {
      logger.info('Dynamically expanding parallel branches', {
        parallelId,
        existingBranches: totalBranches,
        targetBranches: items.length,
        itemsCount: items.length,
      })

      const newEntryNodes = this.expandParallelBranches(
        parallelId,
        parallelConfig,
        totalBranches,
        items.length
      )

      logger.info('Parallel expansion complete', {
        parallelId,
        newEntryNodes,
        totalNodesInDag: this.dag.nodes.size,
      })

      // Add new entry nodes to pending dynamic nodes so the engine can schedule them
      if (newEntryNodes.length > 0) {
        if (!ctx.pendingDynamicNodes) {
          ctx.pendingDynamicNodes = []
        }
        ctx.pendingDynamicNodes.push(...newEntryNodes)
      }
    } else {
      logger.info('No parallel expansion needed', {
        parallelId,
        itemsLength: items?.length,
        totalBranches,
        hasParallelConfig: !!parallelConfig,
      })
    }

    return scope
  }

  /**
   * Dynamically expand the DAG to include additional branch nodes when
   * the resolved item count exceeds the pre-built branch count.
   */
  private expandParallelBranches(
    parallelId: string,
    config: SerializedParallel,
    existingBranchCount: number,
    targetBranchCount: number
  ): string[] {
    // Get all blocks that are part of this parallel
    const blocksInParallel = config.nodes
    const blocksInParallelSet = new Set(blocksInParallel)

    // Step 1: Create all new nodes first
    for (const blockId of blocksInParallel) {
      const branch0NodeId = buildBranchNodeId(blockId, 0)
      const templateNode = this.dag.nodes.get(branch0NodeId)

      if (!templateNode) {
        logger.warn('Template node not found for parallel expansion', { blockId, branch0NodeId })
        continue
      }

      for (let branchIndex = existingBranchCount; branchIndex < targetBranchCount; branchIndex++) {
        const newNodeId = buildBranchNodeId(blockId, branchIndex)

        const newNode: DAGNode = {
          id: newNodeId,
          block: {
            ...templateNode.block,
            id: newNodeId,
          },
          incomingEdges: new Set(),
          outgoingEdges: new Map(),
          metadata: {
            ...templateNode.metadata,
            branchIndex,
            branchTotal: targetBranchCount,
            originalBlockId: blockId,
          },
        }

        this.dag.nodes.set(newNodeId, newNode)
      }
    }

    // Step 2: Wire edges between the new branch nodes
    this.wireExpandedBranchEdges(
      parallelId,
      blocksInParallel,
      existingBranchCount,
      targetBranchCount
    )

    // Step 3: Update metadata on existing nodes to reflect new total
    this.updateExistingBranchMetadata(blocksInParallel, existingBranchCount, targetBranchCount)

    // Step 4: Identify entry nodes AFTER edges are wired
    // Entry nodes are those with no INTERNAL incoming edges (edges from outside parallel don't count)
    const newEntryNodes: string[] = []
    for (const blockId of blocksInParallel) {
      const branch0NodeId = buildBranchNodeId(blockId, 0)
      const templateNode = this.dag.nodes.get(branch0NodeId)
      if (!templateNode) continue

      // Check if template has any INTERNAL incoming edges
      let hasInternalIncoming = false
      for (const incomingId of templateNode.incomingEdges) {
        const baseIncomingId = extractBaseBlockId(incomingId)
        if (blocksInParallelSet.has(baseIncomingId)) {
          hasInternalIncoming = true
          break
        }
      }

      // If no internal incoming edges, the new branches of this block are entry nodes
      if (!hasInternalIncoming) {
        for (
          let branchIndex = existingBranchCount;
          branchIndex < targetBranchCount;
          branchIndex++
        ) {
          newEntryNodes.push(buildBranchNodeId(blockId, branchIndex))
        }
      }
    }

    return newEntryNodes
  }

  /**
   * Wire edges between expanded branch nodes by replicating the edge pattern from branch 0.
   * Handles both internal edges (within the parallel) and exit edges (to blocks after the parallel).
   */
  private wireExpandedBranchEdges(
    parallelId: string,
    blocksInParallel: string[],
    existingBranchCount: number,
    targetBranchCount: number
  ): void {
    const blocksInParallelSet = new Set(blocksInParallel)

    // For each block, look at branch 0's outgoing edges and replicate for new branches
    for (const blockId of blocksInParallel) {
      const branch0NodeId = buildBranchNodeId(blockId, 0)
      const branch0Node = this.dag.nodes.get(branch0NodeId)

      if (!branch0Node) continue

      // Replicate outgoing edges for each new branch
      for (const [, edge] of branch0Node.outgoingEdges) {
        // Use edge.target (the actual target node ID), not the Map key which may be a formatted edge ID
        const actualTargetNodeId = edge.target

        // Extract the base target block ID
        const baseTargetId = extractBaseBlockId(actualTargetNodeId)

        // Check if target is inside or outside the parallel
        const isInternalEdge = blocksInParallelSet.has(baseTargetId)

        for (
          let branchIndex = existingBranchCount;
          branchIndex < targetBranchCount;
          branchIndex++
        ) {
          const sourceNodeId = buildBranchNodeId(blockId, branchIndex)
          const sourceNode = this.dag.nodes.get(sourceNodeId)

          if (!sourceNode) continue

          if (isInternalEdge) {
            // Internal edge: wire to the corresponding branch of the target
            const newTargetNodeId = buildBranchNodeId(baseTargetId, branchIndex)
            const targetNode = this.dag.nodes.get(newTargetNodeId)

            if (targetNode) {
              sourceNode.outgoingEdges.set(newTargetNodeId, {
                target: newTargetNodeId,
                sourceHandle: edge.sourceHandle,
                targetHandle: edge.targetHandle,
              })
              targetNode.incomingEdges.add(sourceNodeId)
            }
          } else {
            // Exit edge: wire to the same external target (blocks after the parallel)
            // All branches point to the same external node
            const externalTargetNode = this.dag.nodes.get(actualTargetNodeId)

            if (externalTargetNode) {
              sourceNode.outgoingEdges.set(actualTargetNodeId, {
                target: actualTargetNodeId,
                sourceHandle: edge.sourceHandle,
                targetHandle: edge.targetHandle,
              })
              // Add incoming edge from this new branch to the external node
              externalTargetNode.incomingEdges.add(sourceNodeId)
            }
          }
        }
      }
    }
  }

  /**
   * Update existing branch nodes' metadata to reflect the new total branch count.
   */
  private updateExistingBranchMetadata(
    blocksInParallel: string[],
    existingBranchCount: number,
    targetBranchCount: number
  ): void {
    for (const blockId of blocksInParallel) {
      for (let branchIndex = 0; branchIndex < existingBranchCount; branchIndex++) {
        const nodeId = buildBranchNodeId(blockId, branchIndex)
        const node = this.dag.nodes.get(nodeId)
        if (node) {
          node.metadata.branchTotal = targetBranchCount
        }
      }
    }
  }

  /**
   * Resolve distribution items at runtime, handling references like <previousBlock.items>
   * This mirrors how LoopOrchestrator.resolveForEachItems works.
   */
  private resolveDistributionItems(ctx: ExecutionContext, config: SerializedParallel): any[] {
    const rawItems = config.distribution

    if (rawItems === undefined || rawItems === null) {
      return []
    }

    // Already an array - return as-is
    if (Array.isArray(rawItems)) {
      return rawItems
    }

    // Object - convert to entries array (consistent with loop forEach behavior)
    if (typeof rawItems === 'object') {
      return Object.entries(rawItems)
    }

    // String handling
    if (typeof rawItems === 'string') {
      // Resolve references at runtime using the variable resolver
      if (rawItems.startsWith('<') && rawItems.endsWith('>') && this.resolver) {
        const resolved = this.resolver.resolveSingleReference(ctx, '', rawItems)
        if (Array.isArray(resolved)) {
          return resolved
        }
        if (typeof resolved === 'object' && resolved !== null) {
          return Object.entries(resolved)
        }
        logger.warn('Distribution reference did not resolve to array or object', {
          rawItems,
          resolved,
        })
        return []
      }

      // Try to parse as JSON
      try {
        const normalized = rawItems.replace(/'/g, '"')
        const parsed = JSON.parse(normalized)
        if (Array.isArray(parsed)) {
          return parsed
        }
        if (typeof parsed === 'object' && parsed !== null) {
          return Object.entries(parsed)
        }
        return []
      } catch (error) {
        logger.error('Failed to parse distribution items', { rawItems, error })
        return []
      }
    }

    return []
  }

  handleParallelBranchCompletion(
    ctx: ExecutionContext,
    parallelId: string,
    nodeId: string,
    output: NormalizedBlockOutput
  ): boolean {
    const scope = ctx.parallelExecutions?.get(parallelId)
    if (!scope) {
      logger.warn('Parallel scope not found for branch completion', { parallelId, nodeId })
      return false
    }

    const branchIndex = extractBranchIndex(nodeId)
    if (branchIndex === null) {
      logger.warn('Could not extract branch index from node ID', { nodeId })
      return false
    }

    if (!scope.branchOutputs.has(branchIndex)) {
      scope.branchOutputs.set(branchIndex, [])
    }
    scope.branchOutputs.get(branchIndex)!.push(output)
    scope.completedCount++

    const allComplete = scope.completedCount >= scope.totalExpectedNodes
    return allComplete
  }

  aggregateParallelResults(ctx: ExecutionContext, parallelId: string): ParallelAggregationResult {
    const scope = ctx.parallelExecutions?.get(parallelId)
    if (!scope) {
      logger.error('Parallel scope not found for aggregation', { parallelId })
      return { allBranchesComplete: false }
    }

    const results: NormalizedBlockOutput[][] = []
    for (let i = 0; i < scope.totalBranches; i++) {
      const branchOutputs = scope.branchOutputs.get(i) || []
      results.push(branchOutputs)
    }
    this.state.setBlockOutput(parallelId, {
      results,
    })
    return {
      allBranchesComplete: true,
      results,
      completedBranches: scope.totalBranches,
      totalBranches: scope.totalBranches,
    }
  }
  extractBranchMetadata(nodeId: string): ParallelBranchMetadata | null {
    const branchIndex = extractBranchIndex(nodeId)
    if (branchIndex === null) {
      return null
    }

    const baseId = extractBaseBlockId(nodeId)
    const parallelId = this.findParallelIdForNode(baseId)
    if (!parallelId) {
      return null
    }
    const parallelConfig = this.dag.parallelConfigs.get(parallelId)
    if (!parallelConfig) {
      return null
    }
    const { totalBranches, distributionItem } = this.getParallelConfigInfo(
      parallelConfig,
      branchIndex
    )
    return {
      branchIndex,
      branchTotal: totalBranches,
      distributionItem,
      parallelId,
    }
  }

  getParallelScope(ctx: ExecutionContext, parallelId: string): ParallelScope | undefined {
    return ctx.parallelExecutions?.get(parallelId)
  }

  findParallelIdForNode(baseNodeId: string): string | undefined {
    for (const [parallelId, config] of this.dag.parallelConfigs) {
      const parallelConfig = config as ParallelConfigWithNodes
      if (parallelConfig.nodes?.includes(baseNodeId)) {
        return parallelId
      }
    }
    return undefined
  }

  private getParallelConfigInfo(
    parallelConfig: SerializedParallel,
    branchIndex: number
  ): { totalBranches: number; distributionItem?: any } {
    const distributionItems = parseDistributionItems(parallelConfig)
    const totalBranches = calculateBranchCount(parallelConfig, distributionItems)

    let distributionItem: any
    if (Array.isArray(distributionItems) && branchIndex < distributionItems.length) {
      distributionItem = distributionItems[branchIndex]
    }
    return { totalBranches, distributionItem }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: loop.ts]---
Location: sim-main/apps/sim/executor/types/loop.ts

```typescript
import type { SerializedLoop } from '@/serializer/types'

export interface LoopConfigWithNodes extends SerializedLoop {
  nodes: string[]
}

export function isLoopConfigWithNodes(config: SerializedLoop): config is LoopConfigWithNodes {
  return Array.isArray((config as any).nodes)
}
```

--------------------------------------------------------------------------------

---[FILE: parallel.ts]---
Location: sim-main/apps/sim/executor/types/parallel.ts

```typescript
import type { SerializedParallel } from '@/serializer/types'

export interface ParallelConfigWithNodes extends SerializedParallel {
  nodes: string[]
}

export function isParallelConfigWithNodes(
  config: SerializedParallel
): config is ParallelConfigWithNodes {
  return Array.isArray((config as any).nodes)
}
```

--------------------------------------------------------------------------------

---[FILE: block-data.ts]---
Location: sim-main/apps/sim/executor/utils/block-data.ts

```typescript
import type { ExecutionContext } from '@/executor/types'

export interface BlockDataCollection {
  blockData: Record<string, any>
  blockNameMapping: Record<string, string>
}

export function collectBlockData(ctx: ExecutionContext): BlockDataCollection {
  const blockData: Record<string, any> = {}
  const blockNameMapping: Record<string, string> = {}

  for (const [id, state] of ctx.blockStates.entries()) {
    if (state.output !== undefined) {
      blockData[id] = state.output
      const workflowBlock = ctx.workflow?.blocks?.find((b) => b.id === id)
      if (workflowBlock?.metadata?.name) {
        blockNameMapping[workflowBlock.metadata.name] = id
        const normalized = workflowBlock.metadata.name.replace(/\s+/g, '').toLowerCase()
        blockNameMapping[normalized] = id
      }
    }
  }

  return { blockData, blockNameMapping }
}
```

--------------------------------------------------------------------------------

---[FILE: connections.ts]---
Location: sim-main/apps/sim/executor/utils/connections.ts

```typescript
import type { SerializedConnection } from '@/serializer/types'

/**
 * Utility functions for analyzing connections in workflow execution.
 * Provides reusable helpers for connection filtering and analysis.
 */
export class ConnectionUtils {
  /**
   * Get all incoming connections to a specific node.
   */
  static getIncomingConnections(
    nodeId: string,
    connections: SerializedConnection[]
  ): SerializedConnection[] {
    return connections.filter((conn) => conn.target === nodeId)
  }

  /**
   * Get all outgoing connections from a specific node.
   */
  static getOutgoingConnections(
    nodeId: string,
    connections: SerializedConnection[]
  ): SerializedConnection[] {
    return connections.filter((conn) => conn.source === nodeId)
  }

  /**
   * Get connections from within a specific scope (parallel/loop) to a target node.
   */
  static getInternalConnections(
    nodeId: string,
    scopeNodes: string[],
    connections: SerializedConnection[]
  ): SerializedConnection[] {
    const incomingConnections = ConnectionUtils.getIncomingConnections(nodeId, connections)
    return incomingConnections.filter((conn) => scopeNodes.includes(conn.source))
  }

  /**
   * Check if a block is completely unconnected (has no incoming connections at all).
   */
  static isUnconnectedBlock(nodeId: string, connections: SerializedConnection[]): boolean {
    return ConnectionUtils.getIncomingConnections(nodeId, connections).length === 0
  }

  /**
   * Check if a block has external connections (connections from outside a scope).
   */
  static hasExternalConnections(
    nodeId: string,
    scopeNodes: string[],
    connections: SerializedConnection[]
  ): boolean {
    const incomingConnections = ConnectionUtils.getIncomingConnections(nodeId, connections)
    const internalConnections = incomingConnections.filter((conn) =>
      scopeNodes.includes(conn.source)
    )

    return incomingConnections.length > internalConnections.length
  }

  /**
   * Determine if a block should be considered an entry point for a scope.
   * Entry points are blocks that have no internal connections but do have external connections.
   */
  static isEntryPoint(
    nodeId: string,
    scopeNodes: string[],
    connections: SerializedConnection[]
  ): boolean {
    const hasInternalConnections =
      ConnectionUtils.getInternalConnections(nodeId, scopeNodes, connections).length > 0

    if (hasInternalConnections) {
      return false
    }

    return ConnectionUtils.hasExternalConnections(nodeId, scopeNodes, connections)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: errors.ts]---
Location: sim-main/apps/sim/executor/utils/errors.ts

```typescript
import type { ExecutionContext } from '@/executor/types'
import type { SerializedBlock } from '@/serializer/types'

export interface BlockExecutionErrorDetails {
  block: SerializedBlock
  error: Error | string
  context?: ExecutionContext
  additionalInfo?: Record<string, any>
}

export function buildBlockExecutionError(details: BlockExecutionErrorDetails): Error {
  const errorMessage =
    details.error instanceof Error ? details.error.message : String(details.error)
  const blockName = details.block.metadata?.name || details.block.id
  const blockType = details.block.metadata?.id || 'unknown'

  const error = new Error(`[${blockType}] ${blockName}: ${errorMessage}`)

  Object.assign(error, {
    blockId: details.block.id,
    blockName,
    blockType,
    workflowId: details.context?.workflowId,
    timestamp: new Date().toISOString(),
    ...details.additionalInfo,
  })

  return error
}

export function buildHTTPError(config: {
  status: number
  url?: string
  method?: string
  message?: string
}): Error {
  let errorMessage = config.message || `HTTP ${config.method || 'request'} failed`

  if (config.url) {
    errorMessage += ` - ${config.url}`
  }

  if (config.status) {
    errorMessage += ` (Status: ${config.status})`
  }

  const error = new Error(errorMessage)

  Object.assign(error, {
    status: config.status,
    url: config.url,
    method: config.method,
    timestamp: new Date().toISOString(),
  })

  return error
}

export function normalizeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}
```

--------------------------------------------------------------------------------

---[FILE: file-tool-processor.ts]---
Location: sim-main/apps/sim/executor/utils/file-tool-processor.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import { uploadExecutionFile, uploadFileFromRawData } from '@/lib/uploads/contexts/execution'
import type { ExecutionContext, UserFile } from '@/executor/types'
import type { ToolConfig, ToolFileData } from '@/tools/types'

const logger = createLogger('FileToolProcessor')

/**
 * Processes tool outputs and converts file-typed outputs to UserFile objects.
 * This enables tools to return file data that gets automatically stored in the
 * execution filesystem and made available as UserFile objects for workflow use.
 */
export class FileToolProcessor {
  /**
   * Process tool outputs and convert file-typed outputs to UserFile objects
   */
  static async processToolOutputs(
    toolOutput: any,
    toolConfig: ToolConfig,
    executionContext: ExecutionContext
  ): Promise<any> {
    if (!toolConfig.outputs) {
      return toolOutput
    }

    const processedOutput = { ...toolOutput }

    for (const [outputKey, outputDef] of Object.entries(toolConfig.outputs)) {
      if (!FileToolProcessor.isFileOutput(outputDef.type)) {
        continue
      }

      const fileData = processedOutput[outputKey]
      if (!fileData) {
        logger.warn(`File-typed output '${outputKey}' is missing from tool result`)
        continue
      }

      try {
        processedOutput[outputKey] = await FileToolProcessor.processFileOutput(
          fileData,
          outputDef.type,
          outputKey,
          executionContext
        )
      } catch (error) {
        logger.error(`Error processing file output '${outputKey}':`, error)
        const errorMessage = error instanceof Error ? error.message : String(error)
        throw new Error(`Failed to process file output '${outputKey}': ${errorMessage}`)
      }
    }

    return processedOutput
  }

  /**
   * Check if an output type is file-related
   */
  private static isFileOutput(type: string): boolean {
    return type === 'file' || type === 'file[]'
  }

  /**
   * Process a single file output (either single file or array of files)
   */
  private static async processFileOutput(
    fileData: any,
    outputType: string,
    outputKey: string,
    executionContext: ExecutionContext
  ): Promise<UserFile | UserFile[]> {
    if (outputType === 'file[]') {
      return FileToolProcessor.processFileArray(fileData, outputKey, executionContext)
    }
    return FileToolProcessor.processFileData(fileData, executionContext)
  }

  /**
   * Process an array of files
   */
  private static async processFileArray(
    fileData: any,
    outputKey: string,
    executionContext: ExecutionContext
  ): Promise<UserFile[]> {
    if (!Array.isArray(fileData)) {
      throw new Error(`Output '${outputKey}' is marked as file[] but is not an array`)
    }

    return Promise.all(
      fileData.map((file, index) => FileToolProcessor.processFileData(file, executionContext))
    )
  }

  /**
   * Convert various file data formats to UserFile by storing in execution filesystem
   */
  private static async processFileData(
    fileData: ToolFileData,
    context: ExecutionContext
  ): Promise<UserFile> {
    try {
      let buffer: Buffer | null = null

      if (Buffer.isBuffer(fileData.data)) {
        buffer = fileData.data
      } else if (
        fileData.data &&
        typeof fileData.data === 'object' &&
        'type' in fileData.data &&
        'data' in fileData.data
      ) {
        const serializedBuffer = fileData.data as { type: string; data: number[] }
        if (serializedBuffer.type === 'Buffer' && Array.isArray(serializedBuffer.data)) {
          buffer = Buffer.from(serializedBuffer.data)
        } else {
          throw new Error(`Invalid serialized buffer format for ${fileData.name}`)
        }
      } else if (typeof fileData.data === 'string' && fileData.data) {
        let base64Data = fileData.data

        if (base64Data.includes('-') || base64Data.includes('_')) {
          base64Data = base64Data.replace(/-/g, '+').replace(/_/g, '/')
        }

        buffer = Buffer.from(base64Data, 'base64')
      }

      if (!buffer && fileData.url) {
        const response = await fetch(fileData.url)

        if (!response.ok) {
          throw new Error(`Failed to download file from ${fileData.url}: ${response.statusText}`)
        }

        const arrayBuffer = await response.arrayBuffer()
        buffer = Buffer.from(arrayBuffer)
      }

      if (buffer) {
        if (buffer.length === 0) {
          throw new Error(`File '${fileData.name}' has zero bytes`)
        }

        return await uploadExecutionFile(
          {
            workspaceId: context.workspaceId || '',
            workflowId: context.workflowId,
            executionId: context.executionId || '',
          },
          buffer,
          fileData.name,
          fileData.mimeType,
          context.userId
        )
      }

      if (!fileData.data) {
        throw new Error(
          `File data for '${fileData.name}' must have either 'data' (Buffer/base64) or 'url' property`
        )
      }

      return uploadFileFromRawData(
        {
          name: fileData.name,
          data: fileData.data,
          mimeType: fileData.mimeType,
        },
        {
          workspaceId: context.workspaceId || '',
          workflowId: context.workflowId,
          executionId: context.executionId || '',
        },
        context.userId
      )
    } catch (error) {
      logger.error(`Error processing file data for '${fileData.name}':`, error)
      throw error
    }
  }

  /**
   * Check if a tool has any file-typed outputs
   */
  static hasFileOutputs(toolConfig: ToolConfig): boolean {
    if (!toolConfig.outputs) {
      return false
    }

    return Object.values(toolConfig.outputs).some(
      (output) => output.type === 'file' || output.type === 'file[]'
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: http.ts]---
Location: sim-main/apps/sim/executor/utils/http.ts

```typescript
import { generateInternalToken } from '@/lib/auth/internal'
import { getBaseUrl } from '@/lib/core/utils/urls'
import { HTTP } from '@/executor/constants'

export async function buildAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    'Content-Type': HTTP.CONTENT_TYPE.JSON,
  }

  if (typeof window === 'undefined') {
    const token = await generateInternalToken()
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

export function buildAPIUrl(path: string, params?: Record<string, string>): URL {
  const url = new URL(path, getBaseUrl())

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, value)
      }
    }
  }

  return url
}

export async function extractAPIErrorMessage(response: Response): Promise<string> {
  const defaultMessage = `API request failed with status ${response.status}`

  try {
    const errorData = await response.json()
    return errorData.error || defaultMessage
  } catch {
    return defaultMessage
  }
}
```

--------------------------------------------------------------------------------

---[FILE: json.ts]---
Location: sim-main/apps/sim/executor/utils/json.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import { EVALUATOR } from '@/executor/constants'

const logger = createLogger('JSONUtils')

export function parseJSON<T>(value: unknown, fallback: T): T {
  if (typeof value !== 'string') {
    return fallback
  }

  try {
    return JSON.parse(value.trim())
  } catch (error) {
    return fallback
  }
}

export function parseJSONOrThrow(value: string): any {
  try {
    return JSON.parse(value.trim())
  } catch (error) {
    throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : 'Parse error'}`)
  }
}

export function normalizeJSONString(value: string): string {
  return value.replace(/'/g, '"')
}

export function stringifyJSON(value: any, indent?: number): string {
  try {
    return JSON.stringify(value, null, indent ?? EVALUATOR.JSON_INDENT)
  } catch (error) {
    logger.warn('Failed to stringify value, returning string representation', { error })
    return String(value)
  }
}

export function isJSONString(value: string): boolean {
  const trimmed = value.trim()
  return trimmed.startsWith('{') || trimmed.startsWith('[')
}
```

--------------------------------------------------------------------------------

---[FILE: lazy-cleanup.ts]---
Location: sim-main/apps/sim/executor/utils/lazy-cleanup.ts

```typescript
import { db } from '@sim/db'
import { workflowBlocks } from '@sim/db/schema'
import { and, eq } from 'drizzle-orm'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('LazyCleanup')

/**
 * Extract valid field names from a child workflow's start block inputFormat
 *
 * @param childWorkflowBlocks - The blocks from the child workflow state
 * @returns Set of valid field names defined in the child's inputFormat
 */
function extractValidInputFieldNames(childWorkflowBlocks: Record<string, any>): Set<string> | null {
  const validFieldNames = new Set<string>()

  const startBlock = Object.values(childWorkflowBlocks).find((block: any) => {
    const blockType = block?.type
    return blockType === 'start_trigger' || blockType === 'input_trigger' || blockType === 'starter'
  })

  if (!startBlock) {
    logger.debug('No start block found in child workflow')
    return null
  }

  const inputFormat =
    (startBlock as any)?.subBlocks?.inputFormat?.value ??
    (startBlock as any)?.config?.params?.inputFormat

  if (!Array.isArray(inputFormat)) {
    logger.debug('No inputFormat array found in child workflow start block')
    return null
  }

  // Extract field names
  for (const field of inputFormat) {
    if (field?.name && typeof field.name === 'string') {
      const fieldName = field.name.trim()
      if (fieldName) {
        validFieldNames.add(fieldName)
      }
    }
  }

  return validFieldNames
}

/**
 * Clean up orphaned inputMapping fields that don't exist in child workflow's inputFormat.
 * This is a lazy cleanup that only runs at execution time and only persists if changes are needed.
 *
 * @param parentWorkflowId - The parent workflow ID
 * @param parentBlockId - The workflow block ID in the parent
 * @param currentInputMapping - The current inputMapping value from the parent block
 * @param childWorkflowBlocks - The blocks from the child workflow
 * @returns The cleaned inputMapping (only different if cleanup was needed)
 */
export async function lazyCleanupInputMapping(
  parentWorkflowId: string,
  parentBlockId: string,
  currentInputMapping: any,
  childWorkflowBlocks: Record<string, any>
): Promise<any> {
  try {
    if (
      !currentInputMapping ||
      typeof currentInputMapping !== 'object' ||
      Array.isArray(currentInputMapping)
    ) {
      return currentInputMapping
    }

    const validFieldNames = extractValidInputFieldNames(childWorkflowBlocks)

    if (!validFieldNames || validFieldNames.size === 0) {
      logger.debug('Child workflow has no inputFormat fields, skipping cleanup')
      return currentInputMapping
    }

    const orphanedFields: string[] = []
    for (const fieldName of Object.keys(currentInputMapping)) {
      if (!validFieldNames.has(fieldName)) {
        orphanedFields.push(fieldName)
      }
    }

    if (orphanedFields.length === 0) {
      return currentInputMapping
    }

    const cleanedMapping: Record<string, any> = {}
    for (const [fieldName, fieldValue] of Object.entries(currentInputMapping)) {
      if (validFieldNames.has(fieldName)) {
        cleanedMapping[fieldName] = fieldValue
      }
    }

    logger.info(
      `Lazy cleanup: Removing ${orphanedFields.length} orphaned field(s) from inputMapping in workflow ${parentWorkflowId}, block ${parentBlockId}: ${orphanedFields.join(', ')}`
    )

    persistCleanedMapping(parentWorkflowId, parentBlockId, cleanedMapping).catch((error) => {
      logger.error('Failed to persist cleaned inputMapping:', error)
    })

    return cleanedMapping
  } catch (error) {
    logger.error('Error in lazy cleanup:', error)
    return currentInputMapping
  }
}

/**
 * Persist the cleaned inputMapping to the database
 *
 * @param workflowId - The workflow ID
 * @param blockId - The block ID
 * @param cleanedMapping - The cleaned inputMapping value
 */
async function persistCleanedMapping(
  workflowId: string,
  blockId: string,
  cleanedMapping: Record<string, any>
): Promise<void> {
  try {
    await db.transaction(async (tx) => {
      const [block] = await tx
        .select({ subBlocks: workflowBlocks.subBlocks })
        .from(workflowBlocks)
        .where(and(eq(workflowBlocks.id, blockId), eq(workflowBlocks.workflowId, workflowId)))
        .limit(1)

      if (!block) {
        logger.warn(`Block ${blockId} not found in workflow ${workflowId}, skipping persistence`)
        return
      }

      const subBlocks = (block.subBlocks as Record<string, any>) || {}

      if (subBlocks.inputMapping) {
        subBlocks.inputMapping = {
          ...subBlocks.inputMapping,
          value: cleanedMapping,
        }

        // Persist updated subBlocks
        await tx
          .update(workflowBlocks)
          .set({
            subBlocks: subBlocks,
            updatedAt: new Date(),
          })
          .where(and(eq(workflowBlocks.id, blockId), eq(workflowBlocks.workflowId, workflowId)))

        logger.info(`Successfully persisted cleaned inputMapping for block ${blockId}`)
      }
    })
  } catch (error) {
    logger.error('Error persisting cleaned mapping:', error)
    throw error
  }
}
```

--------------------------------------------------------------------------------

---[FILE: reference-validation.ts]---
Location: sim-main/apps/sim/executor/utils/reference-validation.ts

```typescript
import { isLikelyReferenceSegment } from '@/lib/workflows/sanitization/references'
import { REFERENCE } from '@/executor/constants'

/**
 * Creates a regex pattern for matching variable references.
 * Uses [^<>]+ to prevent matching across nested brackets (e.g., "<3 <real.ref>" matches separately).
 */
export function createReferencePattern(): RegExp {
  return new RegExp(
    `${REFERENCE.START}([^${REFERENCE.START}${REFERENCE.END}]+)${REFERENCE.END}`,
    'g'
  )
}

/**
 * Creates a regex pattern for matching environment variables {{variable}}
 */
export function createEnvVarPattern(): RegExp {
  return new RegExp(`\\${REFERENCE.ENV_VAR_START}([^}]+)\\${REFERENCE.ENV_VAR_END}`, 'g')
}

/**
 * Creates a regex pattern for matching workflow variables <variable.name>
 * Captures the variable name (after "variable.") in group 1
 */
export function createWorkflowVariablePattern(): RegExp {
  return new RegExp(
    `${REFERENCE.START}${REFERENCE.PREFIX.VARIABLE}\\${REFERENCE.PATH_DELIMITER}([^${REFERENCE.START}${REFERENCE.END}]+)${REFERENCE.END}`,
    'g'
  )
}

/**
 * Combined pattern matching both <reference> and {{env_var}}
 */
export function createCombinedPattern(): RegExp {
  return new RegExp(
    `${REFERENCE.START}[^${REFERENCE.START}${REFERENCE.END}]+${REFERENCE.END}|` +
      `\\${REFERENCE.ENV_VAR_START}[^}]+\\${REFERENCE.ENV_VAR_END}`,
    'g'
  )
}

/**
 * Replaces variable references with smart validation.
 * Distinguishes < operator from < bracket using isLikelyReferenceSegment.
 */
export function replaceValidReferences(
  template: string,
  replacer: (match: string) => string
): string {
  const pattern = createReferencePattern()

  return template.replace(pattern, (match) => {
    if (!isLikelyReferenceSegment(match)) {
      return match
    }
    return replacer(match)
  })
}
```

--------------------------------------------------------------------------------

````
