---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 513
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 513 of 933)

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

---[FILE: engine.ts]---
Location: sim-main/apps/sim/executor/execution/engine.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import { BlockType } from '@/executor/constants'
import type { DAG } from '@/executor/dag/builder'
import type { EdgeManager } from '@/executor/execution/edge-manager'
import { serializePauseSnapshot } from '@/executor/execution/snapshot-serializer'
import type { NodeExecutionOrchestrator } from '@/executor/orchestrators/node'
import type {
  ExecutionContext,
  ExecutionResult,
  NormalizedBlockOutput,
  PauseMetadata,
  PausePoint,
  ResumeStatus,
} from '@/executor/types'
import { normalizeError } from '@/executor/utils/errors'

const logger = createLogger('ExecutionEngine')

export class ExecutionEngine {
  private readyQueue: string[] = []
  private executing = new Set<Promise<void>>()
  private queueLock = Promise.resolve()
  private finalOutput: NormalizedBlockOutput = {}
  private pausedBlocks: Map<string, PauseMetadata> = new Map()
  private allowResumeTriggers: boolean

  constructor(
    private context: ExecutionContext,
    private dag: DAG,
    private edgeManager: EdgeManager,
    private nodeOrchestrator: NodeExecutionOrchestrator
  ) {
    this.allowResumeTriggers = this.context.metadata.resumeFromSnapshot === true
  }

  async run(triggerBlockId?: string): Promise<ExecutionResult> {
    const startTime = Date.now()
    try {
      this.initializeQueue(triggerBlockId)

      while (this.hasWork()) {
        await this.processQueue()
      }
      await this.waitForAllExecutions()

      if (this.pausedBlocks.size > 0) {
        return this.buildPausedResult(startTime)
      }

      const endTime = Date.now()
      this.context.metadata.endTime = new Date(endTime).toISOString()
      this.context.metadata.duration = endTime - startTime

      return {
        success: true,
        output: this.finalOutput,
        logs: this.context.blockLogs,
        metadata: this.context.metadata,
      }
    } catch (error) {
      const endTime = Date.now()
      this.context.metadata.endTime = new Date(endTime).toISOString()
      this.context.metadata.duration = endTime - startTime

      const errorMessage = normalizeError(error)
      logger.error('Execution failed', { error: errorMessage })

      const executionResult: ExecutionResult = {
        success: false,
        output: this.finalOutput,
        error: errorMessage,
        logs: this.context.blockLogs,
        metadata: this.context.metadata,
      }

      // Attach executionResult to the original error instead of creating a new one
      // This preserves block error metadata (blockId, blockName, blockType, etc.)
      if (error && typeof error === 'object') {
        ;(error as any).executionResult = executionResult
      }
      throw error
    }
  }

  private hasWork(): boolean {
    return this.readyQueue.length > 0 || this.executing.size > 0
  }

  private addToQueue(nodeId: string): void {
    const node = this.dag.nodes.get(nodeId)
    if (node?.metadata?.isResumeTrigger && !this.allowResumeTriggers) {
      return
    }

    if (!this.readyQueue.includes(nodeId)) {
      this.readyQueue.push(nodeId)
    }
  }

  private addMultipleToQueue(nodeIds: string[]): void {
    for (const nodeId of nodeIds) {
      this.addToQueue(nodeId)
    }
  }

  private dequeue(): string | undefined {
    return this.readyQueue.shift()
  }

  private trackExecution(promise: Promise<void>): void {
    this.executing.add(promise)
    // Attach error handler to prevent unhandled rejection warnings
    // The actual error handling happens in waitForAllExecutions/waitForAnyExecution
    promise.catch(() => {
      // Error will be properly handled by Promise.all/Promise.race in wait methods
    })
    promise.finally(() => {
      this.executing.delete(promise)
    })
  }

  private async waitForAnyExecution(): Promise<void> {
    if (this.executing.size > 0) {
      await Promise.race(this.executing)
    }
  }

  private async waitForAllExecutions(): Promise<void> {
    await Promise.all(Array.from(this.executing))
  }

  private async withQueueLock<T>(fn: () => Promise<T> | T): Promise<T> {
    const prevLock = this.queueLock
    let resolveLock: () => void
    this.queueLock = new Promise((resolve) => {
      resolveLock = resolve
    })
    await prevLock
    try {
      return await fn()
    } finally {
      resolveLock!()
    }
  }

  private initializeQueue(triggerBlockId?: string): void {
    const pendingBlocks = this.context.metadata.pendingBlocks
    const remainingEdges = (this.context.metadata as any).remainingEdges

    if (remainingEdges && Array.isArray(remainingEdges) && remainingEdges.length > 0) {
      logger.info('Removing edges from resumed pause blocks', {
        edgeCount: remainingEdges.length,
        edges: remainingEdges,
      })

      for (const edge of remainingEdges) {
        const targetNode = this.dag.nodes.get(edge.target)
        if (targetNode) {
          const hadEdge = targetNode.incomingEdges.has(edge.source)
          targetNode.incomingEdges.delete(edge.source)

          if (this.edgeManager.isNodeReady(targetNode)) {
            logger.info('Node became ready after edge removal', { nodeId: targetNode.id })
            this.addToQueue(targetNode.id)
          }
        }
      }

      logger.info('Edge removal complete, queued ready nodes', {
        queueLength: this.readyQueue.length,
        queuedNodes: this.readyQueue,
      })

      return
    }

    if (pendingBlocks && pendingBlocks.length > 0) {
      logger.info('Initializing queue from pending blocks (resume mode)', {
        pendingBlocks,
        allowResumeTriggers: this.allowResumeTriggers,
        dagNodeCount: this.dag.nodes.size,
      })

      for (const nodeId of pendingBlocks) {
        this.addToQueue(nodeId)
      }

      logger.info('Pending blocks queued', {
        queueLength: this.readyQueue.length,
        queuedNodes: this.readyQueue,
      })

      this.context.metadata.pendingBlocks = []
      return
    }

    if (triggerBlockId) {
      this.addToQueue(triggerBlockId)
      return
    }

    const startNode = Array.from(this.dag.nodes.values()).find(
      (node) =>
        node.block.metadata?.id === BlockType.START_TRIGGER ||
        node.block.metadata?.id === BlockType.STARTER
    )
    if (startNode) {
      this.addToQueue(startNode.id)
    } else {
      logger.warn('No start node found in DAG')
    }
  }

  private async processQueue(): Promise<void> {
    while (this.readyQueue.length > 0) {
      const nodeId = this.dequeue()
      if (!nodeId) continue
      const promise = this.executeNodeAsync(nodeId)
      this.trackExecution(promise)
    }

    if (this.executing.size > 0) {
      await this.waitForAnyExecution()
    }
  }

  private async executeNodeAsync(nodeId: string): Promise<void> {
    try {
      const wasAlreadyExecuted = this.context.executedBlocks.has(nodeId)
      const node = this.dag.nodes.get(nodeId)

      const result = await this.nodeOrchestrator.executeNode(this.context, nodeId)

      if (!wasAlreadyExecuted) {
        await this.withQueueLock(async () => {
          await this.handleNodeCompletion(nodeId, result.output, result.isFinalOutput)
        })
      }
    } catch (error) {
      const errorMessage = normalizeError(error)
      logger.error('Node execution failed', { nodeId, error: errorMessage })
      throw error
    }
  }

  private async handleNodeCompletion(
    nodeId: string,
    output: NormalizedBlockOutput,
    isFinalOutput: boolean
  ): Promise<void> {
    const node = this.dag.nodes.get(nodeId)
    if (!node) {
      logger.error('Node not found during completion', { nodeId })
      return
    }

    if (output._pauseMetadata) {
      const pauseMetadata = output._pauseMetadata
      this.pausedBlocks.set(pauseMetadata.contextId, pauseMetadata)
      this.context.metadata.status = 'paused'
      this.context.metadata.pausePoints = Array.from(this.pausedBlocks.keys())

      return
    }

    await this.nodeOrchestrator.handleNodeCompletion(this.context, nodeId, output)

    if (isFinalOutput) {
      this.finalOutput = output
    }

    const readyNodes = this.edgeManager.processOutgoingEdges(node, output, false)

    logger.info('Processing outgoing edges', {
      nodeId,
      outgoingEdgesCount: node.outgoingEdges.size,
      readyNodesCount: readyNodes.length,
      readyNodes,
    })

    this.addMultipleToQueue(readyNodes)

    // Check for dynamically added nodes (e.g., from parallel expansion)
    if (this.context.pendingDynamicNodes && this.context.pendingDynamicNodes.length > 0) {
      const dynamicNodes = this.context.pendingDynamicNodes
      this.context.pendingDynamicNodes = []
      logger.info('Adding dynamically expanded parallel nodes', { dynamicNodes })
      this.addMultipleToQueue(dynamicNodes)
    }
  }

  private buildPausedResult(startTime: number): ExecutionResult {
    const endTime = Date.now()
    this.context.metadata.endTime = new Date(endTime).toISOString()
    this.context.metadata.duration = endTime - startTime
    this.context.metadata.status = 'paused'

    const snapshotSeed = serializePauseSnapshot(this.context, [], this.dag)
    const pausePoints: PausePoint[] = Array.from(this.pausedBlocks.values()).map((pause) => ({
      contextId: pause.contextId,
      blockId: pause.blockId,
      response: pause.response,
      registeredAt: pause.timestamp,
      resumeStatus: 'paused' as ResumeStatus,
      snapshotReady: true,
      parallelScope: pause.parallelScope,
      loopScope: pause.loopScope,
      resumeLinks: pause.resumeLinks,
    }))

    return {
      success: true,
      output: this.collectPauseResponses(),
      logs: this.context.blockLogs,
      metadata: this.context.metadata,
      status: 'paused',
      pausePoints,
      snapshotSeed,
    }
  }

  private collectPauseResponses(): NormalizedBlockOutput {
    const responses = Array.from(this.pausedBlocks.values()).map((pause) => pause.response)

    if (responses.length === 1) {
      return responses[0]
    }

    return {
      pausedBlocks: responses,
      pauseCount: responses.length,
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: executor.ts]---
Location: sim-main/apps/sim/executor/execution/executor.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import { StartBlockPath } from '@/lib/workflows/triggers/triggers'
import type { BlockOutput } from '@/blocks/types'
import { DAGBuilder } from '@/executor/dag/builder'
import { BlockExecutor } from '@/executor/execution/block-executor'
import { EdgeManager } from '@/executor/execution/edge-manager'
import { ExecutionEngine } from '@/executor/execution/engine'
import { ExecutionState } from '@/executor/execution/state'
import type { ContextExtensions, WorkflowInput } from '@/executor/execution/types'
import { createBlockHandlers } from '@/executor/handlers/registry'
import { LoopOrchestrator } from '@/executor/orchestrators/loop'
import { NodeExecutionOrchestrator } from '@/executor/orchestrators/node'
import { ParallelOrchestrator } from '@/executor/orchestrators/parallel'
import type { BlockState, ExecutionContext, ExecutionResult } from '@/executor/types'
import {
  buildResolutionFromBlock,
  buildStartBlockOutput,
  resolveExecutorStartBlock,
} from '@/executor/utils/start-block'
import { VariableResolver } from '@/executor/variables/resolver'
import type { SerializedWorkflow } from '@/serializer/types'

const logger = createLogger('DAGExecutor')

export interface DAGExecutorOptions {
  workflow: SerializedWorkflow
  currentBlockStates?: Record<string, BlockOutput>
  envVarValues?: Record<string, string>
  workflowInput?: WorkflowInput
  workflowVariables?: Record<string, unknown>
  contextExtensions?: ContextExtensions
}

export class DAGExecutor {
  private workflow: SerializedWorkflow
  private environmentVariables: Record<string, string>
  private workflowInput: WorkflowInput
  private workflowVariables: Record<string, unknown>
  private contextExtensions: ContextExtensions
  private isCancelled = false
  private dagBuilder: DAGBuilder

  constructor(options: DAGExecutorOptions) {
    this.workflow = options.workflow
    this.environmentVariables = options.envVarValues ?? {}
    this.workflowInput = options.workflowInput ?? {}
    this.workflowVariables = options.workflowVariables ?? {}
    this.contextExtensions = options.contextExtensions ?? {}
    this.dagBuilder = new DAGBuilder()
  }

  async execute(workflowId: string, triggerBlockId?: string): Promise<ExecutionResult> {
    const savedIncomingEdges = this.contextExtensions.dagIncomingEdges
    const dag = this.dagBuilder.build(this.workflow, triggerBlockId, savedIncomingEdges)
    const { context, state } = this.createExecutionContext(workflowId, triggerBlockId)

    // Link cancellation flag to context
    Object.defineProperty(context, 'isCancelled', {
      get: () => this.isCancelled,
      enumerable: true,
      configurable: true,
    })

    const resolver = new VariableResolver(this.workflow, this.workflowVariables, state)
    const loopOrchestrator = new LoopOrchestrator(dag, state, resolver)
    const parallelOrchestrator = new ParallelOrchestrator(dag, state)
    parallelOrchestrator.setResolver(resolver)
    const allHandlers = createBlockHandlers()
    const blockExecutor = new BlockExecutor(allHandlers, resolver, this.contextExtensions, state)
    const edgeManager = new EdgeManager(dag)
    loopOrchestrator.setEdgeManager(edgeManager)
    const nodeOrchestrator = new NodeExecutionOrchestrator(
      dag,
      state,
      blockExecutor,
      loopOrchestrator,
      parallelOrchestrator
    )
    const engine = new ExecutionEngine(context, dag, edgeManager, nodeOrchestrator)
    return await engine.run(triggerBlockId)
  }

  cancel(): void {
    this.isCancelled = true
  }

  async continueExecution(
    _pendingBlocks: string[],
    context: ExecutionContext
  ): Promise<ExecutionResult> {
    logger.warn('Debug mode (continueExecution) is not yet implemented in the refactored executor')
    return {
      success: false,
      output: {},
      logs: context.blockLogs ?? [],
      error: 'Debug mode is not yet supported in the refactored executor',
      metadata: {
        duration: 0,
        startTime: new Date().toISOString(),
      },
    }
  }

  private createExecutionContext(
    workflowId: string,
    triggerBlockId?: string
  ): { context: ExecutionContext; state: ExecutionState } {
    const snapshotState = this.contextExtensions.snapshotState
    const blockStates = snapshotState?.blockStates
      ? new Map(Object.entries(snapshotState.blockStates))
      : new Map<string, BlockState>()
    const executedBlocks = snapshotState?.executedBlocks
      ? new Set(snapshotState.executedBlocks)
      : new Set<string>()
    const state = new ExecutionState(blockStates, executedBlocks)

    const context: ExecutionContext = {
      workflowId,
      workspaceId: this.contextExtensions.workspaceId,
      executionId: this.contextExtensions.executionId,
      userId: this.contextExtensions.userId,
      isDeployedContext: this.contextExtensions.isDeployedContext,
      blockStates: state.getBlockStates(),
      blockLogs: snapshotState?.blockLogs ?? [],
      metadata: {
        ...this.contextExtensions.metadata,
        startTime: new Date().toISOString(),
        duration: 0,
        useDraftState: this.contextExtensions.isDeployedContext !== true,
      },
      environmentVariables: this.environmentVariables,
      workflowVariables: this.workflowVariables,
      decisions: {
        router: snapshotState?.decisions?.router
          ? new Map(Object.entries(snapshotState.decisions.router))
          : new Map(),
        condition: snapshotState?.decisions?.condition
          ? new Map(Object.entries(snapshotState.decisions.condition))
          : new Map(),
      },
      completedLoops: snapshotState?.completedLoops
        ? new Set(snapshotState.completedLoops)
        : new Set(),
      loopExecutions: snapshotState?.loopExecutions
        ? new Map(
            Object.entries(snapshotState.loopExecutions).map(([loopId, scope]) => [
              loopId,
              {
                ...scope,
                currentIterationOutputs: scope.currentIterationOutputs
                  ? new Map(Object.entries(scope.currentIterationOutputs))
                  : new Map(),
              },
            ])
          )
        : new Map(),
      parallelExecutions: snapshotState?.parallelExecutions
        ? new Map(
            Object.entries(snapshotState.parallelExecutions).map(([parallelId, scope]) => [
              parallelId,
              {
                ...scope,
                branchOutputs: scope.branchOutputs
                  ? new Map(Object.entries(scope.branchOutputs).map(([k, v]) => [Number(k), v]))
                  : new Map(),
              },
            ])
          )
        : new Map(),
      executedBlocks: state.getExecutedBlocks(),
      activeExecutionPath: snapshotState?.activeExecutionPath
        ? new Set(snapshotState.activeExecutionPath)
        : new Set(),
      workflow: this.workflow,
      stream: this.contextExtensions.stream ?? false,
      selectedOutputs: this.contextExtensions.selectedOutputs ?? [],
      edges: this.contextExtensions.edges ?? [],
      onStream: this.contextExtensions.onStream,
      onBlockStart: this.contextExtensions.onBlockStart,
      onBlockComplete: this.contextExtensions.onBlockComplete,
    }

    if (this.contextExtensions.resumeFromSnapshot) {
      context.metadata.resumeFromSnapshot = true
      logger.info('Resume from snapshot enabled', {
        resumePendingQueue: this.contextExtensions.resumePendingQueue,
        remainingEdges: this.contextExtensions.remainingEdges,
        triggerBlockId,
      })
    }

    if (this.contextExtensions.remainingEdges) {
      ;(context.metadata as any).remainingEdges = this.contextExtensions.remainingEdges
      logger.info('Set remaining edges for resume', {
        edgeCount: this.contextExtensions.remainingEdges.length,
      })
    }

    if (this.contextExtensions.resumePendingQueue?.length) {
      context.metadata.pendingBlocks = [...this.contextExtensions.resumePendingQueue]
      logger.info('Set pending blocks from resume queue', {
        pendingBlocks: context.metadata.pendingBlocks,
        skipStarterBlockInit: true,
      })
    } else {
      this.initializeStarterBlock(context, state, triggerBlockId)
    }

    return { context, state }
  }

  private initializeStarterBlock(
    context: ExecutionContext,
    state: ExecutionState,
    triggerBlockId?: string
  ): void {
    let startResolution: ReturnType<typeof resolveExecutorStartBlock> | null = null

    if (triggerBlockId) {
      const triggerBlock = this.workflow.blocks.find((b) => b.id === triggerBlockId)
      if (!triggerBlock) {
        logger.error('Specified trigger block not found in workflow', {
          triggerBlockId,
        })
        throw new Error(`Trigger block not found: ${triggerBlockId}`)
      }

      startResolution = buildResolutionFromBlock(triggerBlock)

      if (!startResolution) {
        startResolution = {
          blockId: triggerBlock.id,
          block: triggerBlock,
          path: StartBlockPath.SPLIT_MANUAL,
        }
      }
    } else {
      startResolution = resolveExecutorStartBlock(this.workflow.blocks, {
        execution: 'manual',
        isChildWorkflow: false,
      })

      if (!startResolution?.block) {
        logger.warn('No start block found in workflow')
        return
      }
    }

    if (state.getBlockStates().has(startResolution.block.id)) {
      return
    }

    const blockOutput = buildStartBlockOutput({
      resolution: startResolution,
      workflowInput: this.workflowInput,
    })

    state.setBlockState(startResolution.block.id, {
      output: blockOutput,
      executed: false,
      executionTime: 0,
    })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: snapshot-serializer.ts]---
Location: sim-main/apps/sim/executor/execution/snapshot-serializer.ts

```typescript
import type { DAG } from '@/executor/dag/builder'
import {
  type ExecutionMetadata,
  ExecutionSnapshot,
  type SerializableExecutionState,
} from '@/executor/execution/snapshot'
import type { ExecutionContext, SerializedSnapshot } from '@/executor/types'

function mapFromEntries<T>(map?: Map<string, T>): Record<string, T> | undefined {
  if (!map) return undefined
  return Object.fromEntries(map)
}

function serializeLoopExecutions(
  loopExecutions?: Map<string, any>
): Record<string, any> | undefined {
  if (!loopExecutions) return undefined
  const result: Record<string, any> = {}
  for (const [loopId, scope] of loopExecutions.entries()) {
    let currentIterationOutputs: any
    if (scope.currentIterationOutputs instanceof Map) {
      currentIterationOutputs = Object.fromEntries(scope.currentIterationOutputs)
    } else {
      currentIterationOutputs = scope.currentIterationOutputs ?? {}
    }

    result[loopId] = {
      ...scope,
      currentIterationOutputs,
    }
  }
  return result
}

function serializeParallelExecutions(
  parallelExecutions?: Map<string, any>
): Record<string, any> | undefined {
  if (!parallelExecutions) return undefined
  const result: Record<string, any> = {}
  for (const [parallelId, scope] of parallelExecutions.entries()) {
    let branchOutputs: any
    if (scope.branchOutputs instanceof Map) {
      branchOutputs = Object.fromEntries(scope.branchOutputs)
    } else {
      branchOutputs = scope.branchOutputs ?? {}
    }

    result[parallelId] = {
      ...scope,
      branchOutputs,
    }
  }
  return result
}

export function serializePauseSnapshot(
  context: ExecutionContext,
  triggerBlockIds: string[],
  dag?: DAG
): SerializedSnapshot {
  const metadataFromContext = context.metadata as ExecutionMetadata | undefined
  let useDraftState: boolean
  if (metadataFromContext?.useDraftState !== undefined) {
    useDraftState = metadataFromContext.useDraftState
  } else if (context.isDeployedContext === true) {
    useDraftState = false
  } else {
    useDraftState = true
  }

  const dagIncomingEdges: Record<string, string[]> | undefined = dag
    ? Object.fromEntries(
        Array.from(dag.nodes.entries()).map(([nodeId, node]) => [
          nodeId,
          Array.from(node.incomingEdges),
        ])
      )
    : undefined

  const state: SerializableExecutionState = {
    blockStates: Object.fromEntries(context.blockStates),
    executedBlocks: Array.from(context.executedBlocks),
    blockLogs: context.blockLogs,
    decisions: {
      router: Object.fromEntries(context.decisions.router),
      condition: Object.fromEntries(context.decisions.condition),
    },
    completedLoops: Array.from(context.completedLoops),
    loopExecutions: serializeLoopExecutions(context.loopExecutions),
    parallelExecutions: serializeParallelExecutions(context.parallelExecutions),
    parallelBlockMapping: mapFromEntries(context.parallelBlockMapping),
    activeExecutionPath: Array.from(context.activeExecutionPath),
    pendingQueue: triggerBlockIds,
    dagIncomingEdges,
  }

  const executionMetadata: ExecutionMetadata = {
    requestId:
      metadataFromContext?.requestId ?? context.executionId ?? context.workflowId ?? 'unknown',
    executionId: context.executionId ?? 'unknown',
    workflowId: context.workflowId,
    workspaceId: context.workspaceId,
    userId: metadataFromContext?.userId ?? '',
    sessionUserId: metadataFromContext?.sessionUserId,
    workflowUserId: metadataFromContext?.workflowUserId,
    triggerType: metadataFromContext?.triggerType ?? 'manual',
    triggerBlockId: triggerBlockIds[0],
    useDraftState,
    startTime: metadataFromContext?.startTime ?? new Date().toISOString(),
    isClientSession: metadataFromContext?.isClientSession,
  }

  const snapshot = new ExecutionSnapshot(
    executionMetadata,
    context.workflow,
    {},
    context.workflowVariables ?? {},
    context.selectedOutputs ?? [],
    state
  )

  return {
    snapshot: snapshot.toJSON(),
    triggerIds: triggerBlockIds,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: snapshot.ts]---
Location: sim-main/apps/sim/executor/execution/snapshot.ts

```typescript
import type { Edge } from 'reactflow'
import type { BlockLog, BlockState } from '@/executor/types'

export interface ExecutionMetadata {
  requestId: string
  executionId: string
  workflowId: string
  workspaceId?: string
  userId: string
  sessionUserId?: string
  workflowUserId?: string
  triggerType: string
  triggerBlockId?: string
  useDraftState: boolean
  startTime: string
  isClientSession?: boolean
  pendingBlocks?: string[]
  resumeFromSnapshot?: boolean
  workflowStateOverride?: {
    blocks: Record<string, any>
    edges: Edge[]
    loops?: Record<string, any>
    parallels?: Record<string, any>
    deploymentVersionId?: string // ID of deployment version if this is deployed state
  }
}

export interface ExecutionCallbacks {
  onStream?: (streamingExec: any) => Promise<void>
  onBlockStart?: (blockId: string, blockName: string, blockType: string) => Promise<void>
  onBlockComplete?: (
    blockId: string,
    blockName: string,
    blockType: string,
    output: any
  ) => Promise<void>
  onExecutorCreated?: (executor: any) => void
}

export interface SerializableExecutionState {
  blockStates: Record<string, BlockState>
  executedBlocks: string[]
  blockLogs: BlockLog[]
  decisions: {
    router: Record<string, string>
    condition: Record<string, string>
  }
  completedLoops: string[]
  loopExecutions?: Record<string, any>
  parallelExecutions?: Record<string, any>
  parallelBlockMapping?: Record<string, any>
  activeExecutionPath: string[]
  pendingQueue?: string[]
  remainingEdges?: Edge[]
  dagIncomingEdges?: Record<string, string[]>
  completedPauseContexts?: string[]
}

export class ExecutionSnapshot {
  constructor(
    public readonly metadata: ExecutionMetadata,
    public readonly workflow: any,
    public readonly input: any,
    public readonly workflowVariables: Record<string, any>,
    public readonly selectedOutputs: string[] = [],
    public readonly state?: SerializableExecutionState
  ) {}

  toJSON(): string {
    return JSON.stringify({
      metadata: this.metadata,
      workflow: this.workflow,
      input: this.input,
      workflowVariables: this.workflowVariables,
      selectedOutputs: this.selectedOutputs,
      state: this.state,
    })
  }

  static fromJSON(json: string): ExecutionSnapshot {
    const data = JSON.parse(json)
    return new ExecutionSnapshot(
      data.metadata,
      data.workflow,
      data.input,
      data.workflowVariables,
      data.selectedOutputs,
      data.state
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: state.ts]---
Location: sim-main/apps/sim/executor/execution/state.ts

```typescript
import type { BlockStateController } from '@/executor/execution/types'
import type { BlockState, NormalizedBlockOutput } from '@/executor/types'

function normalizeLookupId(id: string): string {
  return id.replace(/₍\d+₎/gu, '').replace(/_loop\d+/g, '')
}
export interface LoopScope {
  iteration: number
  currentIterationOutputs: Map<string, NormalizedBlockOutput>
  allIterationOutputs: NormalizedBlockOutput[][]
  maxIterations?: number
  item?: any
  items?: any[]
  condition?: string
  loopType?: 'for' | 'forEach' | 'while' | 'doWhile'
  skipFirstConditionCheck?: boolean
}

export interface ParallelScope {
  parallelId: string
  totalBranches: number
  branchOutputs: Map<number, NormalizedBlockOutput[]>
  completedCount: number
  totalExpectedNodes: number
  items?: any[]
}

export class ExecutionState implements BlockStateController {
  private readonly blockStates: Map<string, BlockState>
  private readonly executedBlocks: Set<string>

  constructor(blockStates?: Map<string, BlockState>, executedBlocks?: Set<string>) {
    this.blockStates = blockStates ?? new Map()
    this.executedBlocks = executedBlocks ?? new Set()
  }

  getBlockStates(): ReadonlyMap<string, BlockState> {
    return this.blockStates
  }

  getExecutedBlocks(): ReadonlySet<string> {
    return this.executedBlocks
  }

  getBlockOutput(blockId: string, currentNodeId?: string): NormalizedBlockOutput | undefined {
    const direct = this.blockStates.get(blockId)?.output
    if (direct !== undefined) {
      return direct
    }

    const normalizedId = normalizeLookupId(blockId)
    if (normalizedId !== blockId) {
      return undefined
    }

    if (currentNodeId) {
      const currentSuffix = currentNodeId.replace(normalizedId, '').match(/₍\d+₎/g)?.[0] ?? ''
      const loopSuffix = currentNodeId.match(/_loop\d+/)?.[0] ?? ''
      const withSuffix = `${blockId}${currentSuffix}${loopSuffix}`
      const suffixedOutput = this.blockStates.get(withSuffix)?.output
      if (suffixedOutput !== undefined) {
        return suffixedOutput
      }
    }

    for (const [storedId, state] of this.blockStates.entries()) {
      if (normalizeLookupId(storedId) === blockId) {
        return state.output
      }
    }

    return undefined
  }

  setBlockOutput(blockId: string, output: NormalizedBlockOutput, executionTime = 0): void {
    this.blockStates.set(blockId, { output, executed: true, executionTime })
    this.executedBlocks.add(blockId)
  }

  setBlockState(blockId: string, state: BlockState): void {
    this.blockStates.set(blockId, state)
    if (state.executed) {
      this.executedBlocks.add(blockId)
    } else {
      this.executedBlocks.delete(blockId)
    }
  }

  deleteBlockState(blockId: string): void {
    this.blockStates.delete(blockId)
    this.executedBlocks.delete(blockId)
  }

  unmarkExecuted(blockId: string): void {
    this.executedBlocks.delete(blockId)
  }

  hasExecuted(blockId: string): boolean {
    return this.executedBlocks.has(blockId)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/executor/execution/types.ts

```typescript
import type { ExecutionMetadata, SerializableExecutionState } from '@/executor/execution/snapshot'
import type { BlockState, NormalizedBlockOutput } from '@/executor/types'
import type { SubflowType } from '@/stores/workflows/workflow/types'

export interface ContextExtensions {
  workspaceId?: string
  executionId?: string
  userId?: string
  stream?: boolean
  selectedOutputs?: string[]
  edges?: Array<{ source: string; target: string }>
  isDeployedContext?: boolean
  isChildExecution?: boolean
  resumeFromSnapshot?: boolean
  resumePendingQueue?: string[]
  remainingEdges?: Array<{
    source: string
    target: string
    sourceHandle?: string
    targetHandle?: string
  }>
  dagIncomingEdges?: Record<string, string[]>
  snapshotState?: SerializableExecutionState
  metadata?: ExecutionMetadata
  onStream?: (streamingExecution: unknown) => Promise<void>
  onBlockStart?: (
    blockId: string,
    blockName: string,
    blockType: string,
    iterationContext?: {
      iterationCurrent: number
      iterationTotal: number
      iterationType: SubflowType
    }
  ) => Promise<void>
  onBlockComplete?: (
    blockId: string,
    blockName: string,
    blockType: string,
    output: { input?: any; output: NormalizedBlockOutput; executionTime: number },
    iterationContext?: {
      iterationCurrent: number
      iterationTotal: number
      iterationType: SubflowType
    }
  ) => Promise<void>
}

export interface WorkflowInput {
  [key: string]: unknown
}

export interface BlockStateReader {
  getBlockOutput(blockId: string, currentNodeId?: string): NormalizedBlockOutput | undefined
  hasExecuted(blockId: string): boolean
}

export interface BlockStateWriter {
  setBlockOutput(blockId: string, output: NormalizedBlockOutput, executionTime?: number): void
  setBlockState(blockId: string, state: BlockState): void
  deleteBlockState(blockId: string): void
  unmarkExecuted(blockId: string): void
}

export type BlockStateController = BlockStateReader & BlockStateWriter
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/executor/handlers/index.ts

```typescript
import { AgentBlockHandler } from '@/executor/handlers/agent/agent-handler'
import { ApiBlockHandler } from '@/executor/handlers/api/api-handler'
import { ConditionBlockHandler } from '@/executor/handlers/condition/condition-handler'
import { EvaluatorBlockHandler } from '@/executor/handlers/evaluator/evaluator-handler'
import { FunctionBlockHandler } from '@/executor/handlers/function/function-handler'
import { GenericBlockHandler } from '@/executor/handlers/generic/generic-handler'
import { HumanInTheLoopBlockHandler } from '@/executor/handlers/human-in-the-loop/human-in-the-loop-handler'
import { ResponseBlockHandler } from '@/executor/handlers/response/response-handler'
import { RouterBlockHandler } from '@/executor/handlers/router/router-handler'
import { TriggerBlockHandler } from '@/executor/handlers/trigger/trigger-handler'
import { VariablesBlockHandler } from '@/executor/handlers/variables/variables-handler'
import { WaitBlockHandler } from '@/executor/handlers/wait/wait-handler'
import { WorkflowBlockHandler } from '@/executor/handlers/workflow/workflow-handler'

export {
  AgentBlockHandler,
  ApiBlockHandler,
  ConditionBlockHandler,
  EvaluatorBlockHandler,
  FunctionBlockHandler,
  GenericBlockHandler,
  ResponseBlockHandler,
  HumanInTheLoopBlockHandler,
  RouterBlockHandler,
  TriggerBlockHandler,
  VariablesBlockHandler,
  WaitBlockHandler,
  WorkflowBlockHandler,
}
```

--------------------------------------------------------------------------------

---[FILE: registry.ts]---
Location: sim-main/apps/sim/executor/handlers/registry.ts

```typescript
/**
 * Handler Registry
 *
 * Central registry for all block handlers.
 * Creates handlers for real user blocks (not infrastructure like sentinels).
 */

import { AgentBlockHandler } from '@/executor/handlers/agent/agent-handler'
import { ApiBlockHandler } from '@/executor/handlers/api/api-handler'
import { ConditionBlockHandler } from '@/executor/handlers/condition/condition-handler'
import { EvaluatorBlockHandler } from '@/executor/handlers/evaluator/evaluator-handler'
import { FunctionBlockHandler } from '@/executor/handlers/function/function-handler'
import { GenericBlockHandler } from '@/executor/handlers/generic/generic-handler'
import { HumanInTheLoopBlockHandler } from '@/executor/handlers/human-in-the-loop/human-in-the-loop-handler'
import { ResponseBlockHandler } from '@/executor/handlers/response/response-handler'
import { RouterBlockHandler } from '@/executor/handlers/router/router-handler'
import { TriggerBlockHandler } from '@/executor/handlers/trigger/trigger-handler'
import { VariablesBlockHandler } from '@/executor/handlers/variables/variables-handler'
import { WaitBlockHandler } from '@/executor/handlers/wait/wait-handler'
import { WorkflowBlockHandler } from '@/executor/handlers/workflow/workflow-handler'
import type { BlockHandler } from '@/executor/types'

/**
 * Create all block handlers
 *
 * Note: Sentinels are NOT included here - they're infrastructure handled
 * by NodeExecutionOrchestrator, not user blocks.
 */
export function createBlockHandlers(): BlockHandler[] {
  return [
    new TriggerBlockHandler(),
    new FunctionBlockHandler(),
    new ApiBlockHandler(),
    new ConditionBlockHandler(),
    new RouterBlockHandler(),
    new ResponseBlockHandler(),
    new HumanInTheLoopBlockHandler(),
    new AgentBlockHandler(),
    new VariablesBlockHandler(),
    new WorkflowBlockHandler(),
    new WaitBlockHandler(),
    new EvaluatorBlockHandler(),
    new GenericBlockHandler(),
  ]
}
```

--------------------------------------------------------------------------------

````
