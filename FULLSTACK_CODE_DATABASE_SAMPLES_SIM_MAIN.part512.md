---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 512
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 512 of 933)

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

---[FILE: loops.ts]---
Location: sim-main/apps/sim/executor/dag/construction/loops.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import { BlockType, LOOP, type SentinelType } from '@/executor/constants'
import type { DAG, DAGNode } from '@/executor/dag/builder'
import { buildSentinelEndId, buildSentinelStartId } from '@/executor/utils/subflow-utils'

const logger = createLogger('LoopConstructor')

export class LoopConstructor {
  execute(dag: DAG, reachableBlocks: Set<string>): void {
    for (const [loopId, loopConfig] of dag.loopConfigs) {
      const loopNodes = loopConfig.nodes

      if (loopNodes.length === 0) {
        continue
      }

      if (!this.hasReachableNodes(loopNodes, reachableBlocks)) {
        continue
      }

      this.createSentinelPair(dag, loopId)
    }
  }

  private hasReachableNodes(loopNodes: string[], reachableBlocks: Set<string>): boolean {
    return loopNodes.some((nodeId) => reachableBlocks.has(nodeId))
  }

  private createSentinelPair(dag: DAG, loopId: string): void {
    const startId = buildSentinelStartId(loopId)
    const endId = buildSentinelEndId(loopId)

    dag.nodes.set(
      startId,
      this.createSentinelNode({
        id: startId,
        loopId,
        sentinelType: LOOP.SENTINEL.START_TYPE,
        blockType: BlockType.SENTINEL_START,
        name: `${LOOP.SENTINEL.START_NAME_PREFIX} (${loopId})`,
      })
    )

    dag.nodes.set(
      endId,
      this.createSentinelNode({
        id: endId,
        loopId,
        sentinelType: LOOP.SENTINEL.END_TYPE,
        blockType: BlockType.SENTINEL_END,
        name: `${LOOP.SENTINEL.END_NAME_PREFIX} (${loopId})`,
      })
    )
  }

  private createSentinelNode(config: {
    id: string
    loopId: string
    sentinelType: SentinelType
    blockType: BlockType
    name: string
  }): DAGNode {
    return {
      id: config.id,
      block: {
        id: config.id,
        enabled: true,
        metadata: {
          id: config.blockType,
          name: config.name,
          loopId: config.loopId,
        },
        config: { params: {} },
      } as any,
      incomingEdges: new Set(),
      outgoingEdges: new Map(),
      metadata: {
        isSentinel: true,
        sentinelType: config.sentinelType,
        loopId: config.loopId,
      },
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: nodes.ts]---
Location: sim-main/apps/sim/executor/dag/construction/nodes.ts

```typescript
import { BlockType, isMetadataOnlyBlockType } from '@/executor/constants'
import type { DAG, DAGNode } from '@/executor/dag/builder'
import {
  buildBranchNodeId,
  calculateBranchCount,
  parseDistributionItems,
} from '@/executor/utils/subflow-utils'
import type { SerializedBlock, SerializedWorkflow } from '@/serializer/types'

interface ParallelExpansion {
  parallelId: string
  branchCount: number
  distributionItems: any[]
}

export class NodeConstructor {
  execute(
    workflow: SerializedWorkflow,
    dag: DAG,
    reachableBlocks: Set<string>
  ): {
    blocksInLoops: Set<string>
    blocksInParallels: Set<string>
    pauseTriggerMapping: Map<string, string>
  } {
    const blocksInLoops = new Set<string>()
    const blocksInParallels = new Set<string>()
    const pauseTriggerMapping = new Map<string, string>()

    this.categorizeBlocks(dag, reachableBlocks, blocksInLoops, blocksInParallels)

    for (const block of workflow.blocks) {
      if (!this.shouldProcessBlock(block, reachableBlocks)) {
        continue
      }

      const parallelId = this.findParallelForBlock(block.id, dag)

      if (parallelId) {
        this.createParallelBranchNodes(block, parallelId, dag)
      } else {
        this.createRegularOrLoopNode(block, blocksInLoops, dag)
      }
    }

    return { blocksInLoops, blocksInParallels, pauseTriggerMapping }
  }

  private shouldProcessBlock(block: SerializedBlock, reachableBlocks: Set<string>): boolean {
    if (!block.enabled) {
      return false
    }

    if (!reachableBlocks.has(block.id)) {
      return false
    }

    if (isMetadataOnlyBlockType(block.metadata?.id)) {
      return false
    }

    return true
  }

  private categorizeBlocks(
    dag: DAG,
    reachableBlocks: Set<string>,
    blocksInLoops: Set<string>,
    blocksInParallels: Set<string>
  ): void {
    this.categorizeLoopBlocks(dag, reachableBlocks, blocksInLoops)
    this.categorizeParallelBlocks(dag, reachableBlocks, blocksInParallels)
  }

  private categorizeLoopBlocks(
    dag: DAG,
    reachableBlocks: Set<string>,
    blocksInLoops: Set<string>
  ): void {
    for (const [, loopConfig] of dag.loopConfigs) {
      for (const nodeId of loopConfig.nodes) {
        if (reachableBlocks.has(nodeId)) {
          blocksInLoops.add(nodeId)
        }
      }
    }
  }

  private categorizeParallelBlocks(
    dag: DAG,
    reachableBlocks: Set<string>,
    blocksInParallels: Set<string>
  ): void {
    for (const [, parallelConfig] of dag.parallelConfigs) {
      for (const nodeId of parallelConfig.nodes) {
        if (reachableBlocks.has(nodeId)) {
          blocksInParallels.add(nodeId)
        }
      }
    }
  }

  private createParallelBranchNodes(block: SerializedBlock, parallelId: string, dag: DAG): void {
    const expansion = this.calculateParallelExpansion(parallelId, dag)

    for (let branchIndex = 0; branchIndex < expansion.branchCount; branchIndex++) {
      const branchNode = this.createParallelBranchNode(block, branchIndex, expansion)
      dag.nodes.set(branchNode.id, branchNode)
    }
  }

  private calculateParallelExpansion(parallelId: string, dag: DAG): ParallelExpansion {
    const config = dag.parallelConfigs.get(parallelId)

    if (!config) {
      throw new Error(`Parallel config not found: ${parallelId}`)
    }

    const distributionItems = parseDistributionItems(config)
    const branchCount = calculateBranchCount(config, distributionItems)

    return {
      parallelId,
      branchCount,
      distributionItems,
    }
  }

  private createParallelBranchNode(
    baseBlock: SerializedBlock,
    branchIndex: number,
    expansion: ParallelExpansion
  ): DAGNode {
    const branchNodeId = buildBranchNodeId(baseBlock.id, branchIndex)
    const blockClone: SerializedBlock = {
      ...baseBlock,
      id: branchNodeId,
    }
    return {
      id: branchNodeId,
      block: blockClone,
      incomingEdges: new Set(),
      outgoingEdges: new Map(),
      metadata: {
        isParallelBranch: true,
        parallelId: expansion.parallelId,
        branchIndex,
        branchTotal: expansion.branchCount,
        distributionItem: expansion.distributionItems[branchIndex],
        isPauseResponse: baseBlock.metadata?.id === BlockType.HUMAN_IN_THE_LOOP,
        originalBlockId: baseBlock.id,
      },
    }
  }

  private createRegularOrLoopNode(
    block: SerializedBlock,
    blocksInLoops: Set<string>,
    dag: DAG
  ): void {
    const isLoopNode = blocksInLoops.has(block.id)
    const loopId = isLoopNode ? this.findLoopIdForBlock(block.id, dag) : undefined
    const isPauseBlock = block.metadata?.id === BlockType.HUMAN_IN_THE_LOOP

    dag.nodes.set(block.id, {
      id: block.id,
      block,
      incomingEdges: new Set(),
      outgoingEdges: new Map(),
      metadata: {
        isLoopNode,
        loopId,
        isPauseResponse: isPauseBlock,
        originalBlockId: block.id,
      },
    })
  }

  private createTriggerNode(
    block: SerializedBlock,
    triggerId: string,
    options: {
      loopId?: string
      isParallelBranch?: boolean
      parallelId?: string
      branchIndex?: number
      branchTotal?: number
    }
  ): DAGNode {
    const triggerBlock: SerializedBlock = {
      ...block,
      id: triggerId,
      enabled: true,
      metadata: {
        ...block.metadata,
        id: BlockType.START_TRIGGER,
      },
    }

    return {
      id: triggerId,
      block: triggerBlock,
      incomingEdges: new Set(),
      outgoingEdges: new Map(),
      metadata: {
        isResumeTrigger: true,
        originalBlockId: block.id,
        loopId: options.loopId,
        isParallelBranch: options.isParallelBranch,
        parallelId: options.parallelId,
        branchIndex: options.branchIndex,
        branchTotal: options.branchTotal,
      },
    }
  }

  private findLoopIdForBlock(blockId: string, dag: DAG): string | undefined {
    for (const [loopId, loopConfig] of dag.loopConfigs) {
      if (loopConfig.nodes.includes(blockId)) {
        return loopId
      }
    }
    return undefined
  }

  private findParallelForBlock(blockId: string, dag: DAG): string | null {
    for (const [parallelId, parallelConfig] of dag.parallelConfigs) {
      if (parallelConfig.nodes.includes(blockId)) {
        return parallelId
      }
    }
    return null
  }
}
```

--------------------------------------------------------------------------------

---[FILE: paths.ts]---
Location: sim-main/apps/sim/executor/dag/construction/paths.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import { isMetadataOnlyBlockType, isTriggerBlockType } from '@/executor/constants'
import { extractBaseBlockId } from '@/executor/utils/subflow-utils'
import type { SerializedBlock, SerializedWorkflow } from '@/serializer/types'

const logger = createLogger('PathConstructor')

export class PathConstructor {
  execute(workflow: SerializedWorkflow, triggerBlockId?: string): Set<string> {
    const resolvedTriggerId = this.findTriggerBlock(workflow, triggerBlockId)

    if (!resolvedTriggerId) {
      logger.warn('No trigger block found, including all enabled blocks as fallback')
      return this.getAllEnabledBlocks(workflow)
    }

    const adjacency = this.buildAdjacencyMap(workflow)
    const reachable = this.performBFS(resolvedTriggerId, adjacency)

    return reachable
  }

  private findTriggerBlock(
    workflow: SerializedWorkflow,
    triggerBlockId?: string
  ): string | undefined {
    if (triggerBlockId) {
      const block = workflow.blocks.find((b) => b.id === triggerBlockId)

      if (block) {
        if (!block.enabled) {
          logger.error('Provided triggerBlockId is disabled, finding alternative', {
            triggerBlockId,
            blockEnabled: block.enabled,
          })
          // Try to find an alternative enabled trigger instead of failing
          const alternativeTrigger = this.findExplicitTrigger(workflow)
          if (alternativeTrigger) {
            logger.info('Using alternative enabled trigger', {
              disabledTriggerId: triggerBlockId,
              alternativeTriggerId: alternativeTrigger,
            })
            return alternativeTrigger
          }
          throw new Error(
            `Trigger block ${triggerBlockId} is disabled and no alternative enabled trigger found`
          )
        }
        return triggerBlockId
      }

      const fallbackTriggerId = this.resolveResumeTriggerFallback(triggerBlockId, workflow)

      if (fallbackTriggerId) {
        return fallbackTriggerId
      }

      logger.error('Provided triggerBlockId not found in workflow', {
        triggerBlockId,
        availableBlocks: workflow.blocks.map((b) => ({ id: b.id, type: b.metadata?.id })),
      })

      throw new Error(`Trigger block not found: ${triggerBlockId}`)
    }

    const explicitTrigger = this.findExplicitTrigger(workflow)

    if (explicitTrigger) {
      return explicitTrigger
    }

    const rootBlock = this.findRootBlock(workflow)

    if (rootBlock) {
      return rootBlock
    }

    return undefined
  }

  private findExplicitTrigger(workflow: SerializedWorkflow): string | undefined {
    for (const block of workflow.blocks) {
      if (block.enabled && this.isTriggerBlock(block)) {
        return block.id
      }
    }
    return undefined
  }

  private findRootBlock(workflow: SerializedWorkflow): string | undefined {
    const hasIncoming = new Set(workflow.connections.map((c) => c.target))

    for (const block of workflow.blocks) {
      if (
        !hasIncoming.has(block.id) &&
        block.enabled &&
        !isMetadataOnlyBlockType(block.metadata?.id)
      ) {
        return block.id
      }
    }

    return undefined
  }

  private isTriggerBlock(block: SerializedBlock): boolean {
    return isTriggerBlockType(block.metadata?.id)
  }

  private getAllEnabledBlocks(workflow: SerializedWorkflow): Set<string> {
    return new Set(workflow.blocks.filter((b) => b.enabled).map((b) => b.id))
  }

  private buildAdjacencyMap(workflow: SerializedWorkflow): Map<string, string[]> {
    const adjacency = new Map<string, string[]>()
    const enabledBlocks = new Set(workflow.blocks.filter((b) => b.enabled).map((b) => b.id))

    for (const connection of workflow.connections) {
      if (!enabledBlocks.has(connection.source) || !enabledBlocks.has(connection.target)) {
        continue
      }

      const neighbors = adjacency.get(connection.source) ?? []
      neighbors.push(connection.target)
      adjacency.set(connection.source, neighbors)
    }

    return adjacency
  }

  private performBFS(triggerBlockId: string, adjacency: Map<string, string[]>): Set<string> {
    const reachable = new Set<string>([triggerBlockId])
    const queue = [triggerBlockId]

    while (queue.length > 0) {
      const currentBlockId = queue.shift()

      if (!currentBlockId) break

      const neighbors = adjacency.get(currentBlockId) ?? []

      for (const neighborId of neighbors) {
        if (!reachable.has(neighborId)) {
          reachable.add(neighborId)
          queue.push(neighborId)
        }
      }
    }

    return reachable
  }

  private resolveResumeTriggerFallback(
    triggerBlockId: string,
    workflow: SerializedWorkflow
  ): string | undefined {
    if (!triggerBlockId.endsWith('__trigger')) {
      return undefined
    }

    const baseId = triggerBlockId.replace(/__trigger$/, '')
    const normalizedBaseId = extractBaseBlockId(baseId)
    const candidates = baseId === normalizedBaseId ? [baseId] : [baseId, normalizedBaseId]

    for (const candidate of candidates) {
      const block = workflow.blocks.find((b) => b.id === candidate)

      if (block) {
        return candidate
      }
    }

    return undefined
  }
}
```

--------------------------------------------------------------------------------

---[FILE: block-executor.ts]---
Location: sim-main/apps/sim/executor/execution/block-executor.ts

```typescript
import { db } from '@sim/db'
import { mcpServers } from '@sim/db/schema'
import { and, eq, inArray, isNull } from 'drizzle-orm'
import { getBaseUrl } from '@/lib/core/utils/urls'
import { createLogger } from '@/lib/logs/console/logger'
import {
  BlockType,
  buildResumeApiUrl,
  buildResumeUiUrl,
  DEFAULTS,
  EDGE,
  isSentinelBlockType,
} from '@/executor/constants'
import type { DAGNode } from '@/executor/dag/builder'
import type { BlockStateWriter, ContextExtensions } from '@/executor/execution/types'
import {
  generatePauseContextId,
  mapNodeMetadataToPauseScopes,
} from '@/executor/human-in-the-loop/utils.ts'
import type {
  BlockHandler,
  BlockLog,
  BlockState,
  ExecutionContext,
  NormalizedBlockOutput,
} from '@/executor/types'
import { streamingResponseFormatProcessor } from '@/executor/utils'
import { buildBlockExecutionError, normalizeError } from '@/executor/utils/errors'
import type { VariableResolver } from '@/executor/variables/resolver'
import type { SerializedBlock } from '@/serializer/types'
import type { SubflowType } from '@/stores/workflows/workflow/types'

const logger = createLogger('BlockExecutor')

export class BlockExecutor {
  constructor(
    private blockHandlers: BlockHandler[],
    private resolver: VariableResolver,
    private contextExtensions: ContextExtensions,
    private state: BlockStateWriter
  ) {}

  async execute(
    ctx: ExecutionContext,
    node: DAGNode,
    block: SerializedBlock
  ): Promise<NormalizedBlockOutput> {
    const handler = this.findHandler(block)
    if (!handler) {
      throw buildBlockExecutionError({
        block,
        context: ctx,
        error: `No handler found for block type: ${block.metadata?.id ?? 'unknown'}`,
      })
    }

    const isSentinel = isSentinelBlockType(block.metadata?.id ?? '')

    let blockLog: BlockLog | undefined
    if (!isSentinel) {
      blockLog = this.createBlockLog(ctx, node.id, block, node)
      ctx.blockLogs.push(blockLog)
      this.callOnBlockStart(ctx, node, block)
    }

    const startTime = Date.now()
    let resolvedInputs: Record<string, any> = {}

    const nodeMetadata = this.buildNodeMetadata(node)
    let cleanupSelfReference: (() => void) | undefined

    if (block.metadata?.id === BlockType.HUMAN_IN_THE_LOOP) {
      cleanupSelfReference = this.preparePauseResumeSelfReference(ctx, node, block, nodeMetadata)
    }

    try {
      resolvedInputs = this.resolver.resolveInputs(ctx, node.id, block.config.params, block)

      if (block.metadata?.id === BlockType.AGENT && resolvedInputs.tools) {
        resolvedInputs = await this.filterUnavailableMcpToolsForLog(ctx, resolvedInputs)
      }

      if (blockLog) {
        blockLog.input = resolvedInputs
      }
    } catch (error) {
      cleanupSelfReference?.()
      return this.handleBlockError(
        error,
        ctx,
        node,
        block,
        startTime,
        blockLog,
        resolvedInputs,
        isSentinel,
        'input_resolution'
      )
    }
    cleanupSelfReference?.()

    try {
      const output = handler.executeWithNode
        ? await handler.executeWithNode(ctx, block, resolvedInputs, nodeMetadata)
        : await handler.execute(ctx, block, resolvedInputs)

      const isStreamingExecution =
        output && typeof output === 'object' && 'stream' in output && 'execution' in output

      let normalizedOutput: NormalizedBlockOutput
      if (isStreamingExecution) {
        const streamingExec = output as { stream: ReadableStream; execution: any }

        if (ctx.onStream) {
          await this.handleStreamingExecution(
            ctx,
            node,
            block,
            streamingExec,
            resolvedInputs,
            ctx.selectedOutputs ?? []
          )
        }

        normalizedOutput = this.normalizeOutput(
          streamingExec.execution.output ?? streamingExec.execution
        )
      } else {
        normalizedOutput = this.normalizeOutput(output)
      }

      const duration = Date.now() - startTime

      if (blockLog) {
        blockLog.endedAt = new Date().toISOString()
        blockLog.durationMs = duration
        blockLog.success = true
        blockLog.output = this.filterOutputForLog(block, normalizedOutput)
      }

      this.state.setBlockOutput(node.id, normalizedOutput, duration)

      if (!isSentinel) {
        const filteredOutput = this.filterOutputForLog(block, normalizedOutput)
        this.callOnBlockComplete(ctx, node, block, resolvedInputs, filteredOutput, duration)
      }

      return normalizedOutput
    } catch (error) {
      return this.handleBlockError(
        error,
        ctx,
        node,
        block,
        startTime,
        blockLog,
        resolvedInputs,
        isSentinel,
        'execution'
      )
    }
  }

  private buildNodeMetadata(node: DAGNode): {
    nodeId: string
    loopId?: string
    parallelId?: string
    branchIndex?: number
    branchTotal?: number
  } {
    const metadata = node?.metadata ?? {}
    return {
      nodeId: node.id,
      loopId: metadata.loopId,
      parallelId: metadata.parallelId,
      branchIndex: metadata.branchIndex,
      branchTotal: metadata.branchTotal,
    }
  }

  private findHandler(block: SerializedBlock): BlockHandler | undefined {
    return this.blockHandlers.find((h) => h.canHandle(block))
  }

  private handleBlockError(
    error: unknown,
    ctx: ExecutionContext,
    node: DAGNode,
    block: SerializedBlock,
    startTime: number,
    blockLog: BlockLog | undefined,
    resolvedInputs: Record<string, any>,
    isSentinel: boolean,
    phase: 'input_resolution' | 'execution'
  ): NormalizedBlockOutput {
    const duration = Date.now() - startTime
    const errorMessage = normalizeError(error)
    const hasResolvedInputs =
      resolvedInputs && typeof resolvedInputs === 'object' && Object.keys(resolvedInputs).length > 0
    const input =
      hasResolvedInputs && resolvedInputs
        ? resolvedInputs
        : ((block.config?.params as Record<string, any> | undefined) ?? {})

    if (blockLog) {
      blockLog.endedAt = new Date().toISOString()
      blockLog.durationMs = duration
      blockLog.success = false
      blockLog.error = errorMessage
      blockLog.input = input
    }

    const errorOutput: NormalizedBlockOutput = {
      error: errorMessage,
    }

    if (error && typeof error === 'object' && 'childTraceSpans' in error) {
      errorOutput.childTraceSpans = (error as any).childTraceSpans
    }

    this.state.setBlockOutput(node.id, errorOutput, duration)

    logger.error(
      phase === 'input_resolution' ? 'Failed to resolve block inputs' : 'Block execution failed',
      {
        blockId: node.id,
        blockType: block.metadata?.id,
        error: errorMessage,
      }
    )

    if (!isSentinel) {
      this.callOnBlockComplete(ctx, node, block, input, errorOutput, duration)
    }

    const hasErrorPort = this.hasErrorPortEdge(node)
    if (hasErrorPort) {
      logger.info('Block has error port - returning error output instead of throwing', {
        blockId: node.id,
        error: errorMessage,
      })
      return errorOutput
    }

    const errorToThrow = error instanceof Error ? error : new Error(errorMessage)

    throw buildBlockExecutionError({
      block,
      error: errorToThrow,
      context: ctx,
      additionalInfo: {
        nodeId: node.id,
        executionTime: duration,
      },
    })
  }

  private hasErrorPortEdge(node: DAGNode): boolean {
    for (const [_, edge] of node.outgoingEdges) {
      if (edge.sourceHandle === EDGE.ERROR) {
        return true
      }
    }
    return false
  }

  private createBlockLog(
    ctx: ExecutionContext,
    blockId: string,
    block: SerializedBlock,
    node: DAGNode
  ): BlockLog {
    let blockName = block.metadata?.name ?? blockId
    let loopId: string | undefined
    let parallelId: string | undefined
    let iterationIndex: number | undefined

    if (node?.metadata) {
      if (node.metadata.branchIndex !== undefined && node.metadata.parallelId) {
        blockName = `${blockName} (iteration ${node.metadata.branchIndex})`
        iterationIndex = node.metadata.branchIndex
        parallelId = node.metadata.parallelId
      } else if (node.metadata.isLoopNode && node.metadata.loopId) {
        loopId = node.metadata.loopId
        const loopScope = ctx.loopExecutions?.get(loopId)
        if (loopScope && loopScope.iteration !== undefined) {
          blockName = `${blockName} (iteration ${loopScope.iteration})`
          iterationIndex = loopScope.iteration
        } else {
          logger.warn('Loop scope not found for block', { blockId, loopId })
        }
      }
    }

    return {
      blockId,
      blockName,
      blockType: block.metadata?.id ?? DEFAULTS.BLOCK_TYPE,
      startedAt: new Date().toISOString(),
      endedAt: '',
      durationMs: 0,
      success: false,
      loopId,
      parallelId,
      iterationIndex,
    }
  }

  private normalizeOutput(output: unknown): NormalizedBlockOutput {
    if (output === null || output === undefined) {
      return {}
    }

    if (typeof output === 'object' && !Array.isArray(output)) {
      return output as NormalizedBlockOutput
    }

    return { result: output }
  }

  private filterOutputForLog(
    block: SerializedBlock,
    output: NormalizedBlockOutput
  ): NormalizedBlockOutput {
    if (block.metadata?.id === BlockType.HUMAN_IN_THE_LOOP) {
      const filtered: NormalizedBlockOutput = {}
      for (const [key, value] of Object.entries(output)) {
        if (key.startsWith('_')) continue
        if (key === 'response') continue
        filtered[key] = value
      }
      return filtered
    }
    return output
  }

  private callOnBlockStart(ctx: ExecutionContext, node: DAGNode, block: SerializedBlock): void {
    const blockId = node.id
    const blockName = block.metadata?.name ?? blockId
    const blockType = block.metadata?.id ?? DEFAULTS.BLOCK_TYPE

    const iterationContext = this.getIterationContext(ctx, node)

    if (this.contextExtensions.onBlockStart) {
      this.contextExtensions.onBlockStart(blockId, blockName, blockType, iterationContext)
    }
  }

  private callOnBlockComplete(
    ctx: ExecutionContext,
    node: DAGNode,
    block: SerializedBlock,
    input: Record<string, any>,
    output: NormalizedBlockOutput,
    duration: number
  ): void {
    const blockId = node.id
    const blockName = block.metadata?.name ?? blockId
    const blockType = block.metadata?.id ?? DEFAULTS.BLOCK_TYPE

    const iterationContext = this.getIterationContext(ctx, node)

    if (this.contextExtensions.onBlockComplete) {
      this.contextExtensions.onBlockComplete(
        blockId,
        blockName,
        blockType,
        {
          input,
          output,
          executionTime: duration,
        },
        iterationContext
      )
    }
  }

  private getIterationContext(
    ctx: ExecutionContext,
    node: DAGNode
  ): { iterationCurrent: number; iterationTotal: number; iterationType: SubflowType } | undefined {
    if (!node?.metadata) return undefined

    if (node.metadata.branchIndex !== undefined && node.metadata.branchTotal) {
      return {
        iterationCurrent: node.metadata.branchIndex,
        iterationTotal: node.metadata.branchTotal,
        iterationType: 'parallel',
      }
    }

    if (node.metadata.isLoopNode && node.metadata.loopId) {
      const loopScope = ctx.loopExecutions?.get(node.metadata.loopId)
      if (loopScope && loopScope.iteration !== undefined && loopScope.maxIterations) {
        return {
          iterationCurrent: loopScope.iteration,
          iterationTotal: loopScope.maxIterations,
          iterationType: 'loop',
        }
      }
    }

    return undefined
  }

  /**
   * Filters out unavailable MCP tools from agent inputs for logging.
   * Only includes tools from servers with 'connected' status.
   */
  private async filterUnavailableMcpToolsForLog(
    ctx: ExecutionContext,
    inputs: Record<string, any>
  ): Promise<Record<string, any>> {
    const tools = inputs.tools
    if (!Array.isArray(tools) || tools.length === 0) return inputs

    const mcpTools = tools.filter((t: any) => t.type === 'mcp')
    if (mcpTools.length === 0) return inputs

    const serverIds = [
      ...new Set(mcpTools.map((t: any) => t.params?.serverId).filter(Boolean)),
    ] as string[]
    if (serverIds.length === 0) return inputs

    const availableServerIds = new Set<string>()
    if (ctx.workspaceId && serverIds.length > 0) {
      try {
        const servers = await db
          .select({ id: mcpServers.id, connectionStatus: mcpServers.connectionStatus })
          .from(mcpServers)
          .where(
            and(
              eq(mcpServers.workspaceId, ctx.workspaceId),
              inArray(mcpServers.id, serverIds),
              isNull(mcpServers.deletedAt)
            )
          )

        for (const server of servers) {
          if (server.connectionStatus === 'connected') {
            availableServerIds.add(server.id)
          }
        }
      } catch (error) {
        logger.warn('Failed to check MCP server availability for logging:', error)
        return inputs
      }
    }

    const filteredTools = tools.filter((tool: any) => {
      if (tool.type !== 'mcp') return true
      const serverId = tool.params?.serverId
      if (!serverId) return false
      return availableServerIds.has(serverId)
    })

    return { ...inputs, tools: filteredTools }
  }

  private preparePauseResumeSelfReference(
    ctx: ExecutionContext,
    node: DAGNode,
    block: SerializedBlock,
    nodeMetadata: {
      nodeId: string
      loopId?: string
      parallelId?: string
      branchIndex?: number
      branchTotal?: number
    }
  ): (() => void) | undefined {
    const blockId = node.id

    const existingState = ctx.blockStates.get(blockId)
    if (existingState?.executed) {
      return undefined
    }

    const executionId = ctx.executionId ?? ctx.metadata?.executionId
    const workflowId = ctx.workflowId

    if (!executionId || !workflowId) {
      return undefined
    }

    const { loopScope } = mapNodeMetadataToPauseScopes(ctx, nodeMetadata)
    const contextId = generatePauseContextId(block.id, nodeMetadata, loopScope)

    let resumeLinks: { apiUrl: string; uiUrl: string }

    try {
      const baseUrl = getBaseUrl()
      resumeLinks = {
        apiUrl: buildResumeApiUrl(baseUrl, workflowId, executionId, contextId),
        uiUrl: buildResumeUiUrl(baseUrl, workflowId, executionId),
      }
    } catch {
      resumeLinks = {
        apiUrl: buildResumeApiUrl(undefined, workflowId, executionId, contextId),
        uiUrl: buildResumeUiUrl(undefined, workflowId, executionId),
      }
    }

    let previousState: BlockState | undefined
    if (existingState) {
      previousState = { ...existingState }
    }
    const hadPrevious = existingState !== undefined

    const placeholderState: BlockState = {
      output: {
        url: resumeLinks.uiUrl,
        // apiUrl: resumeLinks.apiUrl, // Hidden from output
      },
      executed: false,
      executionTime: existingState?.executionTime ?? 0,
    }

    this.state.setBlockState(blockId, placeholderState)

    return () => {
      if (hadPrevious && previousState) {
        this.state.setBlockState(blockId, previousState)
      } else {
        this.state.deleteBlockState(blockId)
      }
    }
  }

  private async handleStreamingExecution(
    ctx: ExecutionContext,
    node: DAGNode,
    block: SerializedBlock,
    streamingExec: { stream: ReadableStream; execution: any },
    resolvedInputs: Record<string, any>,
    selectedOutputs: string[]
  ): Promise<void> {
    const blockId = node.id

    const responseFormat =
      resolvedInputs?.responseFormat ??
      (block.config?.params as Record<string, any> | undefined)?.responseFormat ??
      (block.config as Record<string, any> | undefined)?.responseFormat

    const stream = streamingExec.stream
    if (typeof stream.tee !== 'function') {
      await this.forwardStream(ctx, blockId, streamingExec, stream, responseFormat, selectedOutputs)
      return
    }

    const [clientStream, executorStream] = stream.tee()

    const processedClientStream = streamingResponseFormatProcessor.processStream(
      clientStream,
      blockId,
      selectedOutputs,
      responseFormat
    )

    const clientStreamingExec = {
      ...streamingExec,
      stream: processedClientStream,
    }

    const executorConsumption = this.consumeExecutorStream(
      executorStream,
      streamingExec,
      blockId,
      responseFormat
    )

    const clientConsumption = (async () => {
      try {
        await ctx.onStream?.(clientStreamingExec)
      } catch (error) {
        logger.error('Error in onStream callback', { blockId, error })
      }
    })()

    await Promise.all([clientConsumption, executorConsumption])
  }

  private async forwardStream(
    ctx: ExecutionContext,
    blockId: string,
    streamingExec: { stream: ReadableStream; execution: any },
    stream: ReadableStream,
    responseFormat: any,
    selectedOutputs: string[]
  ): Promise<void> {
    const processedStream = streamingResponseFormatProcessor.processStream(
      stream,
      blockId,
      selectedOutputs,
      responseFormat
    )

    try {
      await ctx.onStream?.({
        ...streamingExec,
        stream: processedStream,
      })
    } catch (error) {
      logger.error('Error in onStream callback', { blockId, error })
    }
  }

  private async consumeExecutorStream(
    stream: ReadableStream,
    streamingExec: { execution: any },
    blockId: string,
    responseFormat: any
  ): Promise<void> {
    const reader = stream.getReader()
    const decoder = new TextDecoder()
    let fullContent = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        fullContent += decoder.decode(value, { stream: true })
      }
    } catch (error) {
      logger.error('Error reading executor stream for block', { blockId, error })
    } finally {
      try {
        reader.releaseLock()
      } catch {}
    }

    if (!fullContent) {
      return
    }

    const executionOutput = streamingExec.execution?.output
    if (!executionOutput || typeof executionOutput !== 'object') {
      return
    }

    if (responseFormat) {
      try {
        const parsed = JSON.parse(fullContent.trim())

        streamingExec.execution.output = {
          ...parsed,
          tokens: executionOutput.tokens,
          toolCalls: executionOutput.toolCalls,
          providerTiming: executionOutput.providerTiming,
          cost: executionOutput.cost,
          model: executionOutput.model,
        }
        return
      } catch (error) {
        logger.warn('Failed to parse streamed content for response format', { blockId, error })
      }
    }

    executionOutput.content = fullContent
  }
}
```

--------------------------------------------------------------------------------

---[FILE: edge-manager.ts]---
Location: sim-main/apps/sim/executor/execution/edge-manager.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import { EDGE } from '@/executor/constants'
import type { DAG, DAGNode } from '@/executor/dag/builder'
import type { DAGEdge } from '@/executor/dag/types'
import type { NormalizedBlockOutput } from '@/executor/types'

const logger = createLogger('EdgeManager')

export class EdgeManager {
  private deactivatedEdges = new Set<string>()

  constructor(private dag: DAG) {}

  processOutgoingEdges(
    node: DAGNode,
    output: NormalizedBlockOutput,
    skipBackwardsEdge = false
  ): string[] {
    const readyNodes: string[] = []
    const activatedTargets: string[] = []

    for (const [edgeId, edge] of node.outgoingEdges) {
      if (skipBackwardsEdge && this.isBackwardsEdge(edge.sourceHandle)) {
        continue
      }

      const shouldActivate = this.shouldActivateEdge(edge, output)
      if (!shouldActivate) {
        const isLoopEdge =
          edge.sourceHandle === EDGE.LOOP_CONTINUE ||
          edge.sourceHandle === EDGE.LOOP_CONTINUE_ALT ||
          edge.sourceHandle === EDGE.LOOP_EXIT

        if (!isLoopEdge) {
          this.deactivateEdgeAndDescendants(node.id, edge.target, edge.sourceHandle)
        }

        continue
      }

      const targetNode = this.dag.nodes.get(edge.target)
      if (!targetNode) {
        logger.warn('Target node not found', { target: edge.target })
        continue
      }

      targetNode.incomingEdges.delete(node.id)
      activatedTargets.push(edge.target)
    }

    // Check readiness after all edges processed to ensure cascade deactivations are complete
    for (const targetId of activatedTargets) {
      const targetNode = this.dag.nodes.get(targetId)
      if (targetNode && this.isNodeReady(targetNode)) {
        readyNodes.push(targetId)
      }
    }

    return readyNodes
  }

  isNodeReady(node: DAGNode): boolean {
    if (node.incomingEdges.size === 0) {
      return true
    }

    const activeIncomingCount = this.countActiveIncomingEdges(node)
    if (activeIncomingCount > 0) {
      return false
    }

    return true
  }

  restoreIncomingEdge(targetNodeId: string, sourceNodeId: string): void {
    const targetNode = this.dag.nodes.get(targetNodeId)
    if (!targetNode) {
      logger.warn('Cannot restore edge - target node not found', { targetNodeId })
      return
    }

    targetNode.incomingEdges.add(sourceNodeId)
  }

  clearDeactivatedEdges(): void {
    this.deactivatedEdges.clear()
  }

  /**
   * Clear deactivated edges for a set of nodes (used when restoring loop state for next iteration).
   * This ensures error/success edges can be re-evaluated on each iteration.
   */
  clearDeactivatedEdgesForNodes(nodeIds: Set<string>): void {
    const edgesToRemove: string[] = []
    for (const edgeKey of this.deactivatedEdges) {
      // Edge key format is "sourceId-targetId-handle"
      // Check if either source or target is in the nodeIds set
      for (const nodeId of nodeIds) {
        if (edgeKey.startsWith(`${nodeId}-`) || edgeKey.includes(`-${nodeId}-`)) {
          edgesToRemove.push(edgeKey)
          break
        }
      }
    }
    for (const edgeKey of edgesToRemove) {
      this.deactivatedEdges.delete(edgeKey)
    }
  }

  private shouldActivateEdge(edge: DAGEdge, output: NormalizedBlockOutput): boolean {
    const handle = edge.sourceHandle

    if (output.selectedRoute === EDGE.LOOP_EXIT) {
      return handle === EDGE.LOOP_EXIT
    }

    if (output.selectedRoute === EDGE.LOOP_CONTINUE) {
      return handle === EDGE.LOOP_CONTINUE || handle === EDGE.LOOP_CONTINUE_ALT
    }

    if (!handle) {
      return true
    }

    if (handle.startsWith(EDGE.CONDITION_PREFIX)) {
      const conditionValue = handle.substring(EDGE.CONDITION_PREFIX.length)
      return output.selectedOption === conditionValue
    }

    if (handle.startsWith(EDGE.ROUTER_PREFIX)) {
      const routeId = handle.substring(EDGE.ROUTER_PREFIX.length)
      return output.selectedRoute === routeId
    }

    switch (handle) {
      case EDGE.ERROR:
        return !!output.error

      case EDGE.SOURCE:
        return !output.error

      default:
        return true
    }
  }

  private isBackwardsEdge(sourceHandle?: string): boolean {
    return sourceHandle === EDGE.LOOP_CONTINUE || sourceHandle === EDGE.LOOP_CONTINUE_ALT
  }

  private deactivateEdgeAndDescendants(
    sourceId: string,
    targetId: string,
    sourceHandle?: string
  ): void {
    const edgeKey = this.createEdgeKey(sourceId, targetId, sourceHandle)
    if (this.deactivatedEdges.has(edgeKey)) {
      return
    }

    this.deactivatedEdges.add(edgeKey)
    const targetNode = this.dag.nodes.get(targetId)
    if (!targetNode) return

    const hasOtherActiveIncoming = this.hasActiveIncomingEdges(targetNode, sourceId)
    if (!hasOtherActiveIncoming) {
      for (const [_, outgoingEdge] of targetNode.outgoingEdges) {
        this.deactivateEdgeAndDescendants(targetId, outgoingEdge.target, outgoingEdge.sourceHandle)
      }
    }
  }

  private hasActiveIncomingEdges(node: DAGNode, excludeSourceId: string): boolean {
    for (const incomingSourceId of node.incomingEdges) {
      if (incomingSourceId === excludeSourceId) continue

      const incomingNode = this.dag.nodes.get(incomingSourceId)
      if (!incomingNode) continue

      for (const [_, incomingEdge] of incomingNode.outgoingEdges) {
        if (incomingEdge.target === node.id) {
          const incomingEdgeKey = this.createEdgeKey(
            incomingSourceId,
            node.id,
            incomingEdge.sourceHandle
          )
          if (!this.deactivatedEdges.has(incomingEdgeKey)) {
            return true
          }
        }
      }
    }

    return false
  }

  private countActiveIncomingEdges(node: DAGNode): number {
    let count = 0

    for (const sourceId of node.incomingEdges) {
      const sourceNode = this.dag.nodes.get(sourceId)
      if (!sourceNode) continue

      for (const [, edge] of sourceNode.outgoingEdges) {
        if (edge.target === node.id) {
          const edgeKey = this.createEdgeKey(sourceId, edge.target, edge.sourceHandle)
          if (!this.deactivatedEdges.has(edgeKey)) {
            count++
            break
          }
        }
      }
    }

    return count
  }

  private createEdgeKey(sourceId: string, targetId: string, sourceHandle?: string): string {
    return `${sourceId}-${targetId}-${sourceHandle ?? EDGE.DEFAULT}`
  }
}
```

--------------------------------------------------------------------------------

````
