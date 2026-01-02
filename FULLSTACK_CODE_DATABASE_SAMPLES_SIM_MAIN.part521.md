---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 521
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 521 of 933)

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

---[FILE: workflow-handler.ts]---
Location: sim-main/apps/sim/executor/handlers/workflow/workflow-handler.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import { buildTraceSpans } from '@/lib/logs/execution/trace-spans/trace-spans'
import type { TraceSpan } from '@/lib/logs/types'
import type { BlockOutput } from '@/blocks/types'
import { Executor } from '@/executor'
import { BlockType, DEFAULTS, HTTP } from '@/executor/constants'
import type {
  BlockHandler,
  ExecutionContext,
  ExecutionResult,
  StreamingExecution,
} from '@/executor/types'
import { buildAPIUrl, buildAuthHeaders } from '@/executor/utils/http'
import { parseJSON } from '@/executor/utils/json'
import { lazyCleanupInputMapping } from '@/executor/utils/lazy-cleanup'
import { Serializer } from '@/serializer'
import type { SerializedBlock } from '@/serializer/types'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'

const logger = createLogger('WorkflowBlockHandler')

type WorkflowTraceSpan = TraceSpan & {
  metadata?: Record<string, unknown>
  children?: WorkflowTraceSpan[]
  output?: (Record<string, unknown> & { childTraceSpans?: WorkflowTraceSpan[] }) | null
}

/**
 * Handler for workflow blocks that execute other workflows inline.
 * Creates sub-execution contexts and manages data flow between parent and child workflows.
 */
export class WorkflowBlockHandler implements BlockHandler {
  private serializer = new Serializer()

  canHandle(block: SerializedBlock): boolean {
    const id = block.metadata?.id
    return id === BlockType.WORKFLOW || id === BlockType.WORKFLOW_INPUT
  }

  async execute(
    ctx: ExecutionContext,
    block: SerializedBlock,
    inputs: Record<string, any>
  ): Promise<BlockOutput | StreamingExecution> {
    logger.info(`Executing workflow block: ${block.id}`)

    const workflowId = inputs.workflowId

    if (!workflowId) {
      throw new Error('No workflow selected for execution')
    }

    try {
      const currentDepth = (ctx.workflowId?.split('_sub_').length || 1) - 1
      if (currentDepth >= DEFAULTS.MAX_WORKFLOW_DEPTH) {
        throw new Error(`Maximum workflow nesting depth of ${DEFAULTS.MAX_WORKFLOW_DEPTH} exceeded`)
      }

      if (ctx.isDeployedContext) {
        const hasActiveDeployment = await this.checkChildDeployment(workflowId)
        if (!hasActiveDeployment) {
          throw new Error(
            `Child workflow is not deployed. Please deploy the workflow before invoking it.`
          )
        }
      }

      const childWorkflow = ctx.isDeployedContext
        ? await this.loadChildWorkflowDeployed(workflowId)
        : await this.loadChildWorkflow(workflowId)

      if (!childWorkflow) {
        throw new Error(`Child workflow ${workflowId} not found`)
      }

      const { workflows } = useWorkflowRegistry.getState()
      const workflowMetadata = workflows[workflowId]
      const childWorkflowName = workflowMetadata?.name || childWorkflow.name || 'Unknown Workflow'

      logger.info(
        `Executing child workflow: ${childWorkflowName} (${workflowId}) at depth ${currentDepth}`
      )

      let childWorkflowInput: Record<string, any> = {}

      if (inputs.inputMapping !== undefined && inputs.inputMapping !== null) {
        const normalized = parseJSON(inputs.inputMapping, inputs.inputMapping)

        if (normalized && typeof normalized === 'object' && !Array.isArray(normalized)) {
          const cleanedMapping = await lazyCleanupInputMapping(
            ctx.workflowId || 'unknown',
            block.id,
            normalized,
            childWorkflow.rawBlocks || {}
          )
          childWorkflowInput = cleanedMapping as Record<string, any>
        } else {
          childWorkflowInput = {}
        }
      } else if (inputs.input !== undefined) {
        childWorkflowInput = inputs.input
      }

      const subExecutor = new Executor({
        workflow: childWorkflow.serializedState,
        workflowInput: childWorkflowInput,
        envVarValues: ctx.environmentVariables,
        workflowVariables: childWorkflow.variables || {},
        contextExtensions: {
          isChildExecution: true,
          isDeployedContext: ctx.isDeployedContext === true,
        },
      })

      const startTime = performance.now()

      const result = await subExecutor.execute(workflowId)
      const executionResult = this.toExecutionResult(result)
      const duration = performance.now() - startTime

      logger.info(`Child workflow ${childWorkflowName} completed in ${Math.round(duration)}ms`, {
        success: executionResult.success,
        hasLogs: (executionResult.logs?.length ?? 0) > 0,
      })

      const childTraceSpans = this.captureChildWorkflowLogs(executionResult, childWorkflowName, ctx)

      const mappedResult = this.mapChildOutputToParent(
        executionResult,
        workflowId,
        childWorkflowName,
        duration,
        childTraceSpans
      )

      return mappedResult
    } catch (error: any) {
      logger.error(`Error executing child workflow ${workflowId}:`, error)

      const { workflows } = useWorkflowRegistry.getState()
      const workflowMetadata = workflows[workflowId]
      const childWorkflowName = workflowMetadata?.name || workflowId

      if (error.executionResult?.logs) {
        const executionResult = error.executionResult as ExecutionResult

        logger.info(`Extracting child trace spans from error.executionResult`, {
          hasLogs: (executionResult.logs?.length ?? 0) > 0,
          logCount: executionResult.logs?.length ?? 0,
        })

        const childTraceSpans = this.captureChildWorkflowLogs(
          executionResult,
          childWorkflowName,
          ctx
        )

        logger.info(`Captured ${childTraceSpans.length} child trace spans from failed execution`)

        return {
          success: false,
          childWorkflowName,
          result: {},
          error: error.message || 'Child workflow execution failed',
          childTraceSpans: childTraceSpans,
        } as Record<string, any>
      }

      if (error.childTraceSpans && Array.isArray(error.childTraceSpans)) {
        return {
          success: false,
          childWorkflowName,
          result: {},
          error: error.message || 'Child workflow execution failed',
          childTraceSpans: error.childTraceSpans,
        } as Record<string, any>
      }

      const originalError = error.message || 'Unknown error'
      throw new Error(`Error in child workflow "${childWorkflowName}": ${originalError}`)
    }
  }

  private async loadChildWorkflow(workflowId: string) {
    const headers = await buildAuthHeaders()
    const url = buildAPIUrl(`/api/workflows/${workflowId}`)

    const response = await fetch(url.toString(), { headers })

    if (!response.ok) {
      if (response.status === HTTP.STATUS.NOT_FOUND) {
        logger.warn(`Child workflow ${workflowId} not found`)
        return null
      }
      throw new Error(`Failed to fetch workflow: ${response.status} ${response.statusText}`)
    }

    const { data: workflowData } = await response.json()

    if (!workflowData) {
      throw new Error(`Child workflow ${workflowId} returned empty data`)
    }

    logger.info(`Loaded child workflow: ${workflowData.name} (${workflowId})`)
    const workflowState = workflowData.state

    if (!workflowState || !workflowState.blocks) {
      throw new Error(`Child workflow ${workflowId} has invalid state`)
    }

    const serializedWorkflow = this.serializer.serializeWorkflow(
      workflowState.blocks,
      workflowState.edges || [],
      workflowState.loops || {},
      workflowState.parallels || {},
      true
    )

    const workflowVariables = (workflowData.variables as Record<string, any>) || {}

    if (Object.keys(workflowVariables).length > 0) {
      logger.info(
        `Loaded ${Object.keys(workflowVariables).length} variables for child workflow: ${workflowId}`
      )
    }

    return {
      name: workflowData.name,
      serializedState: serializedWorkflow,
      variables: workflowVariables,
      rawBlocks: workflowState.blocks,
    }
  }

  private async checkChildDeployment(workflowId: string): Promise<boolean> {
    try {
      const headers = await buildAuthHeaders()
      const url = buildAPIUrl(`/api/workflows/${workflowId}/deployed`)

      const response = await fetch(url.toString(), {
        headers,
        cache: 'no-store',
      })

      if (!response.ok) return false

      const json = await response.json()
      return !!json?.data?.deployedState || !!json?.deployedState
    } catch (e) {
      logger.error(`Failed to check child deployment for ${workflowId}:`, e)
      return false
    }
  }

  private async loadChildWorkflowDeployed(workflowId: string) {
    const headers = await buildAuthHeaders()
    const deployedUrl = buildAPIUrl(`/api/workflows/${workflowId}/deployed`)

    const deployedRes = await fetch(deployedUrl.toString(), {
      headers,
      cache: 'no-store',
    })

    if (!deployedRes.ok) {
      if (deployedRes.status === HTTP.STATUS.NOT_FOUND) {
        return null
      }
      throw new Error(
        `Failed to fetch deployed workflow: ${deployedRes.status} ${deployedRes.statusText}`
      )
    }
    const deployedJson = await deployedRes.json()
    const deployedState = deployedJson?.data?.deployedState || deployedJson?.deployedState
    if (!deployedState || !deployedState.blocks) {
      throw new Error(`Deployed state missing or invalid for child workflow ${workflowId}`)
    }

    const metaUrl = buildAPIUrl(`/api/workflows/${workflowId}`)
    const metaRes = await fetch(metaUrl.toString(), {
      headers,
      cache: 'no-store',
    })

    if (!metaRes.ok) {
      throw new Error(`Failed to fetch workflow metadata: ${metaRes.status} ${metaRes.statusText}`)
    }
    const metaJson = await metaRes.json()
    const wfData = metaJson?.data

    const serializedWorkflow = this.serializer.serializeWorkflow(
      deployedState.blocks,
      deployedState.edges || [],
      deployedState.loops || {},
      deployedState.parallels || {},
      true
    )

    const workflowVariables = (wfData?.variables as Record<string, any>) || {}

    return {
      name: wfData?.name || DEFAULTS.WORKFLOW_NAME,
      serializedState: serializedWorkflow,
      variables: workflowVariables,
      rawBlocks: deployedState.blocks,
    }
  }

  /**
   * Captures and transforms child workflow logs into trace spans
   */
  private captureChildWorkflowLogs(
    childResult: ExecutionResult,
    childWorkflowName: string,
    parentContext: ExecutionContext
  ): WorkflowTraceSpan[] {
    try {
      if (!childResult.logs || !Array.isArray(childResult.logs)) {
        return []
      }

      const { traceSpans } = buildTraceSpans(childResult)

      if (!traceSpans || traceSpans.length === 0) {
        return []
      }

      const processedSpans = this.processChildWorkflowSpans(traceSpans)

      if (processedSpans.length === 0) {
        return []
      }

      const transformedSpans = processedSpans.map((span) =>
        this.transformSpanForChildWorkflow(span, childWorkflowName)
      )

      return transformedSpans
    } catch (error) {
      logger.error(`Error capturing child workflow logs for ${childWorkflowName}:`, error)
      return []
    }
  }

  private transformSpanForChildWorkflow(
    span: WorkflowTraceSpan,
    childWorkflowName: string
  ): WorkflowTraceSpan {
    const metadata: Record<string, unknown> = {
      ...(span.metadata ?? {}),
      isFromChildWorkflow: true,
      childWorkflowName,
    }

    const transformedChildren = Array.isArray(span.children)
      ? span.children.map((childSpan) =>
          this.transformSpanForChildWorkflow(childSpan, childWorkflowName)
        )
      : undefined

    return {
      ...span,
      metadata,
      ...(transformedChildren ? { children: transformedChildren } : {}),
    }
  }

  private processChildWorkflowSpans(spans: TraceSpan[]): WorkflowTraceSpan[] {
    const processed: WorkflowTraceSpan[] = []

    spans.forEach((span) => {
      if (this.isSyntheticWorkflowWrapper(span)) {
        if (span.children && Array.isArray(span.children)) {
          processed.push(...this.processChildWorkflowSpans(span.children))
        }
        return
      }

      const workflowSpan: WorkflowTraceSpan = {
        ...span,
      }

      if (Array.isArray(workflowSpan.children)) {
        workflowSpan.children = this.processChildWorkflowSpans(workflowSpan.children as TraceSpan[])
      }

      processed.push(workflowSpan)
    })

    return processed
  }

  private flattenChildWorkflowSpans(spans: TraceSpan[]): WorkflowTraceSpan[] {
    const flattened: WorkflowTraceSpan[] = []

    spans.forEach((span) => {
      if (this.isSyntheticWorkflowWrapper(span)) {
        if (span.children && Array.isArray(span.children)) {
          flattened.push(...this.flattenChildWorkflowSpans(span.children))
        }
        return
      }

      const workflowSpan: WorkflowTraceSpan = {
        ...span,
      }

      if (Array.isArray(workflowSpan.children)) {
        const childSpans = workflowSpan.children as TraceSpan[]
        workflowSpan.children = this.flattenChildWorkflowSpans(childSpans)
      }

      if (workflowSpan.output && typeof workflowSpan.output === 'object') {
        const { childTraceSpans: nestedChildSpans, ...outputRest } = workflowSpan.output as {
          childTraceSpans?: TraceSpan[]
        } & Record<string, unknown>

        if (Array.isArray(nestedChildSpans) && nestedChildSpans.length > 0) {
          const flattenedNestedChildren = this.flattenChildWorkflowSpans(nestedChildSpans)
          workflowSpan.children = [...(workflowSpan.children || []), ...flattenedNestedChildren]
        }

        workflowSpan.output = outputRest
      }

      flattened.push(workflowSpan)
    })

    return flattened
  }

  private toExecutionResult(result: ExecutionResult | StreamingExecution): ExecutionResult {
    return 'execution' in result ? result.execution : result
  }

  private isSyntheticWorkflowWrapper(span: TraceSpan | undefined): boolean {
    if (!span || span.type !== 'workflow') return false
    return !span.blockId
  }

  private mapChildOutputToParent(
    childResult: ExecutionResult,
    childWorkflowId: string,
    childWorkflowName: string,
    duration: number,
    childTraceSpans?: WorkflowTraceSpan[]
  ): BlockOutput {
    const success = childResult.success !== false
    const result = childResult.output || {}

    if (!success) {
      logger.warn(`Child workflow ${childWorkflowName} failed`)
      // Return failure with child trace spans so they can be displayed
      return {
        success: false,
        childWorkflowName,
        result,
        error: childResult.error || 'Child workflow execution failed',
        childTraceSpans: childTraceSpans || [],
      } as Record<string, any>
    }

    // Success case
    return {
      success: true,
      childWorkflowName,
      result,
      childTraceSpans: childTraceSpans || [],
    } as Record<string, any>
  }
}
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/executor/human-in-the-loop/utils.ts

```typescript
import { PARALLEL } from '@/executor/constants'
import type { ExecutionContext, LoopPauseScope, ParallelPauseScope } from '@/executor/types'

interface NodeMetadataLike {
  nodeId: string
  loopId?: string
  parallelId?: string
  branchIndex?: number
  branchTotal?: number
}

export function generatePauseContextId(
  baseBlockId: string,
  nodeMetadata: NodeMetadataLike,
  loopScope?: LoopPauseScope
): string {
  let contextId = baseBlockId

  if (typeof nodeMetadata.branchIndex === 'number') {
    contextId = `${contextId}${PARALLEL.BRANCH.PREFIX}${nodeMetadata.branchIndex}${PARALLEL.BRANCH.SUFFIX}`
  }

  if (loopScope) {
    contextId = `${contextId}_loop${loopScope.iteration}`
  }

  return contextId
}

export function buildTriggerBlockId(nodeId: string): string {
  if (nodeId.includes('__response')) {
    return nodeId.replace('__response', '__trigger')
  }

  if (nodeId.endsWith('_response')) {
    return nodeId.replace(/_response$/, '_trigger')
  }

  return `${nodeId}__trigger`
}

export function mapNodeMetadataToPauseScopes(
  ctx: ExecutionContext,
  nodeMetadata: NodeMetadataLike
): {
  parallelScope?: ParallelPauseScope
  loopScope?: LoopPauseScope
} {
  let parallelScope: ParallelPauseScope | undefined
  let loopScope: LoopPauseScope | undefined

  if (nodeMetadata.parallelId && typeof nodeMetadata.branchIndex === 'number') {
    parallelScope = {
      parallelId: nodeMetadata.parallelId,
      branchIndex: nodeMetadata.branchIndex,
      branchTotal: nodeMetadata.branchTotal,
    }
  }

  if (nodeMetadata.loopId) {
    const loopExecution = ctx.loopExecutions?.get(nodeMetadata.loopId)
    const iteration = loopExecution?.iteration ?? 0
    loopScope = {
      loopId: nodeMetadata.loopId,
      iteration,
    }
  }

  return {
    parallelScope,
    loopScope,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: loop.ts]---
Location: sim-main/apps/sim/executor/orchestrators/loop.ts

```typescript
import { generateRequestId } from '@/lib/core/utils/request'
import { executeInIsolatedVM } from '@/lib/execution/isolated-vm'
import { createLogger } from '@/lib/logs/console/logger'
import { buildLoopIndexCondition, DEFAULTS, EDGE } from '@/executor/constants'
import type { DAG } from '@/executor/dag/builder'
import type { EdgeManager } from '@/executor/execution/edge-manager'
import type { LoopScope } from '@/executor/execution/state'
import type { BlockStateController } from '@/executor/execution/types'
import type { ExecutionContext, NormalizedBlockOutput } from '@/executor/types'
import type { LoopConfigWithNodes } from '@/executor/types/loop'
import { replaceValidReferences } from '@/executor/utils/reference-validation'
import {
  buildSentinelEndId,
  buildSentinelStartId,
  extractBaseBlockId,
} from '@/executor/utils/subflow-utils'
import type { VariableResolver } from '@/executor/variables/resolver'
import type { SerializedLoop } from '@/serializer/types'

const logger = createLogger('LoopOrchestrator')

const LOOP_CONDITION_TIMEOUT_MS = 5000

export type LoopRoute = typeof EDGE.LOOP_CONTINUE | typeof EDGE.LOOP_EXIT

export interface LoopContinuationResult {
  shouldContinue: boolean
  shouldExit: boolean
  selectedRoute: LoopRoute
  aggregatedResults?: NormalizedBlockOutput[][]
}

export class LoopOrchestrator {
  private edgeManager: EdgeManager | null = null

  constructor(
    private dag: DAG,
    private state: BlockStateController,
    private resolver: VariableResolver
  ) {}

  setEdgeManager(edgeManager: EdgeManager): void {
    this.edgeManager = edgeManager
  }

  initializeLoopScope(ctx: ExecutionContext, loopId: string): LoopScope {
    const loopConfig = this.dag.loopConfigs.get(loopId) as SerializedLoop | undefined
    if (!loopConfig) {
      throw new Error(`Loop config not found: ${loopId}`)
    }

    const scope: LoopScope = {
      iteration: 0,
      currentIterationOutputs: new Map(),
      allIterationOutputs: [],
    }

    const loopType = loopConfig.loopType

    switch (loopType) {
      case 'for':
        scope.loopType = 'for'
        scope.maxIterations = loopConfig.iterations || DEFAULTS.MAX_LOOP_ITERATIONS
        scope.condition = buildLoopIndexCondition(scope.maxIterations)
        break

      case 'forEach': {
        scope.loopType = 'forEach'
        const items = this.resolveForEachItems(ctx, loopConfig.forEachItems)
        scope.items = items
        scope.maxIterations = items.length
        scope.item = items[0]
        scope.condition = buildLoopIndexCondition(scope.maxIterations)
        break
      }

      case 'while':
        scope.loopType = 'while'
        scope.condition = loopConfig.whileCondition
        break

      case 'doWhile':
        scope.loopType = 'doWhile'
        if (loopConfig.doWhileCondition) {
          scope.condition = loopConfig.doWhileCondition
        } else {
          scope.maxIterations = loopConfig.iterations || DEFAULTS.MAX_LOOP_ITERATIONS
          scope.condition = buildLoopIndexCondition(scope.maxIterations)
        }
        break

      default:
        throw new Error(`Unknown loop type: ${loopType}`)
    }

    if (!ctx.loopExecutions) {
      ctx.loopExecutions = new Map()
    }
    ctx.loopExecutions.set(loopId, scope)
    return scope
  }

  storeLoopNodeOutput(
    ctx: ExecutionContext,
    loopId: string,
    nodeId: string,
    output: NormalizedBlockOutput
  ): void {
    const scope = ctx.loopExecutions?.get(loopId)
    if (!scope) {
      logger.warn('Loop scope not found for node output storage', { loopId, nodeId })
      return
    }

    const baseId = extractBaseBlockId(nodeId)
    scope.currentIterationOutputs.set(baseId, output)
  }

  async evaluateLoopContinuation(
    ctx: ExecutionContext,
    loopId: string
  ): Promise<LoopContinuationResult> {
    const scope = ctx.loopExecutions?.get(loopId)
    if (!scope) {
      logger.error('Loop scope not found during continuation evaluation', { loopId })
      return {
        shouldContinue: false,
        shouldExit: true,
        selectedRoute: EDGE.LOOP_EXIT,
      }
    }

    if (ctx.isCancelled) {
      logger.info('Loop execution cancelled', { loopId, iteration: scope.iteration })
      return this.createExitResult(ctx, loopId, scope)
    }

    const iterationResults: NormalizedBlockOutput[] = []
    for (const blockOutput of scope.currentIterationOutputs.values()) {
      iterationResults.push(blockOutput)
    }

    if (iterationResults.length > 0) {
      scope.allIterationOutputs.push(iterationResults)
    }

    scope.currentIterationOutputs.clear()

    if (!(await this.evaluateCondition(ctx, scope, scope.iteration + 1))) {
      return this.createExitResult(ctx, loopId, scope)
    }

    scope.iteration++

    if (scope.items && scope.iteration < scope.items.length) {
      scope.item = scope.items[scope.iteration]
    }

    return {
      shouldContinue: true,
      shouldExit: false,
      selectedRoute: EDGE.LOOP_CONTINUE,
    }
  }

  private createExitResult(
    ctx: ExecutionContext,
    loopId: string,
    scope: LoopScope
  ): LoopContinuationResult {
    const results = scope.allIterationOutputs
    this.state.setBlockOutput(loopId, { results }, DEFAULTS.EXECUTION_TIME)

    return {
      shouldContinue: false,
      shouldExit: true,
      selectedRoute: EDGE.LOOP_EXIT,
      aggregatedResults: results,
    }
  }

  private async evaluateCondition(
    ctx: ExecutionContext,
    scope: LoopScope,
    iteration?: number
  ): Promise<boolean> {
    if (!scope.condition) {
      logger.warn('No condition defined for loop')
      return false
    }

    const currentIteration = scope.iteration
    if (iteration !== undefined) {
      scope.iteration = iteration
    }

    const result = await this.evaluateWhileCondition(ctx, scope.condition, scope)

    if (iteration !== undefined) {
      scope.iteration = currentIteration
    }

    return result
  }

  clearLoopExecutionState(loopId: string): void {
    const loopConfig = this.dag.loopConfigs.get(loopId) as LoopConfigWithNodes | undefined
    if (!loopConfig) {
      logger.warn('Loop config not found for state clearing', { loopId })
      return
    }

    const sentinelStartId = buildSentinelStartId(loopId)
    const sentinelEndId = buildSentinelEndId(loopId)
    const loopNodes = loopConfig.nodes

    this.state.unmarkExecuted(sentinelStartId)
    this.state.unmarkExecuted(sentinelEndId)
    for (const loopNodeId of loopNodes) {
      this.state.unmarkExecuted(loopNodeId)
    }
  }

  restoreLoopEdges(loopId: string): void {
    const loopConfig = this.dag.loopConfigs.get(loopId) as LoopConfigWithNodes | undefined
    if (!loopConfig) {
      logger.warn('Loop config not found for edge restoration', { loopId })
      return
    }

    const sentinelStartId = buildSentinelStartId(loopId)
    const sentinelEndId = buildSentinelEndId(loopId)
    const loopNodes = loopConfig.nodes
    const allLoopNodeIds = new Set([sentinelStartId, sentinelEndId, ...loopNodes])

    if (this.edgeManager) {
      this.edgeManager.clearDeactivatedEdgesForNodes(allLoopNodeIds)
    }

    for (const nodeId of allLoopNodeIds) {
      const nodeToRestore = this.dag.nodes.get(nodeId)
      if (!nodeToRestore) continue

      for (const [potentialSourceId, potentialSourceNode] of this.dag.nodes) {
        if (!allLoopNodeIds.has(potentialSourceId)) continue

        for (const [, edge] of potentialSourceNode.outgoingEdges) {
          if (edge.target === nodeId) {
            const isBackwardEdge =
              edge.sourceHandle === EDGE.LOOP_CONTINUE ||
              edge.sourceHandle === EDGE.LOOP_CONTINUE_ALT

            if (!isBackwardEdge) {
              nodeToRestore.incomingEdges.add(potentialSourceId)
            }
          }
        }
      }
    }
  }

  getLoopScope(ctx: ExecutionContext, loopId: string): LoopScope | undefined {
    return ctx.loopExecutions?.get(loopId)
  }

  /**
   * Evaluates the initial condition for loops at the sentinel start.
   * - For while loops, the condition must be checked BEFORE the first iteration.
   * - For forEach loops, skip if the items array is empty.
   * - For for loops, skip if maxIterations is 0.
   * - For doWhile loops, always execute at least once.
   *
   * @returns true if the loop should execute, false if it should be skipped
   */
  async evaluateInitialCondition(ctx: ExecutionContext, loopId: string): Promise<boolean> {
    const scope = ctx.loopExecutions?.get(loopId)
    if (!scope) {
      logger.warn('Loop scope not found for initial condition evaluation', { loopId })
      return true
    }

    // forEach: skip if items array is empty
    if (scope.loopType === 'forEach') {
      if (!scope.items || scope.items.length === 0) {
        logger.info('ForEach loop has empty items, skipping loop body', { loopId })
        return false
      }
      return true
    }

    // for: skip if maxIterations is 0
    if (scope.loopType === 'for') {
      if (scope.maxIterations === 0) {
        logger.info('For loop has 0 iterations, skipping loop body', { loopId })
        return false
      }
      return true
    }

    // doWhile: always execute at least once
    if (scope.loopType === 'doWhile') {
      return true
    }

    // while: check condition before first iteration
    if (scope.loopType === 'while') {
      if (!scope.condition) {
        logger.warn('No condition defined for while loop', { loopId })
        return false
      }

      const result = await this.evaluateWhileCondition(ctx, scope.condition, scope)
      logger.info('While loop initial condition evaluation', {
        loopId,
        condition: scope.condition,
        result,
      })

      return result
    }

    return true
  }

  shouldExecuteLoopNode(_ctx: ExecutionContext, _nodeId: string, _loopId: string): boolean {
    return true
  }

  private findLoopForNode(nodeId: string): string | undefined {
    for (const [loopId, config] of this.dag.loopConfigs) {
      const nodes = (config as any).nodes || []
      if (nodes.includes(nodeId)) {
        return loopId
      }
    }
    return undefined
  }

  private async evaluateWhileCondition(
    ctx: ExecutionContext,
    condition: string,
    scope: LoopScope
  ): Promise<boolean> {
    if (!condition) {
      return false
    }

    try {
      logger.info('Evaluating loop condition', {
        originalCondition: condition,
        iteration: scope.iteration,
        workflowVariables: ctx.workflowVariables,
      })

      const evaluatedCondition = replaceValidReferences(condition, (match) => {
        const resolved = this.resolver.resolveSingleReference(ctx, '', match, scope)
        logger.info('Resolved variable reference in loop condition', {
          reference: match,
          resolvedValue: resolved,
          resolvedType: typeof resolved,
        })
        if (resolved !== undefined) {
          if (typeof resolved === 'boolean' || typeof resolved === 'number') {
            return String(resolved)
          }
          if (typeof resolved === 'string') {
            const lower = resolved.toLowerCase().trim()
            if (lower === 'true' || lower === 'false') {
              return lower
            }
            return `"${resolved}"`
          }
          return JSON.stringify(resolved)
        }
        return match
      })

      const requestId = generateRequestId()
      const code = `return Boolean(${evaluatedCondition})`

      const vmResult = await executeInIsolatedVM({
        code,
        params: {},
        envVars: {},
        contextVariables: {},
        timeoutMs: LOOP_CONDITION_TIMEOUT_MS,
        requestId,
      })

      if (vmResult.error) {
        logger.error('Failed to evaluate loop condition', {
          condition,
          evaluatedCondition,
          error: vmResult.error,
        })
        return false
      }

      const result = Boolean(vmResult.result)

      logger.info('Loop condition evaluation result', {
        originalCondition: condition,
        evaluatedCondition,
        result,
      })

      return result
    } catch (error) {
      logger.error('Failed to evaluate loop condition', { condition, error })
      return false
    }
  }

  private resolveForEachItems(ctx: ExecutionContext, items: any): any[] {
    if (Array.isArray(items)) {
      return items
    }

    if (typeof items === 'object' && items !== null) {
      return Object.entries(items)
    }

    if (typeof items === 'string') {
      if (items.startsWith('<') && items.endsWith('>')) {
        const resolved = this.resolver.resolveSingleReference(ctx, '', items)
        if (Array.isArray(resolved)) {
          return resolved
        }
        return []
      }

      try {
        const normalized = items.replace(/'/g, '"')
        const parsed = JSON.parse(normalized)
        if (Array.isArray(parsed)) {
          return parsed
        }
        return []
      } catch (error) {
        logger.error('Failed to parse forEach items', { items, error })
        return []
      }
    }

    try {
      const resolved = this.resolver.resolveInputs(ctx, 'loop_foreach_items', { items }).items

      if (Array.isArray(resolved)) {
        return resolved
      }

      logger.warn('ForEach items did not resolve to array', {
        items,
        resolved,
      })

      return []
    } catch (error: any) {
      logger.error('Error resolving forEach items, returning empty array:', {
        error: error.message,
      })
      return []
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: node.ts]---
Location: sim-main/apps/sim/executor/orchestrators/node.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import { EDGE } from '@/executor/constants'
import type { DAG, DAGNode } from '@/executor/dag/builder'
import type { BlockExecutor } from '@/executor/execution/block-executor'
import type { BlockStateController } from '@/executor/execution/types'
import type { LoopOrchestrator } from '@/executor/orchestrators/loop'
import type { ParallelOrchestrator } from '@/executor/orchestrators/parallel'
import type { ExecutionContext, NormalizedBlockOutput } from '@/executor/types'
import { extractBaseBlockId } from '@/executor/utils/subflow-utils'

const logger = createLogger('NodeExecutionOrchestrator')

export interface NodeExecutionResult {
  nodeId: string
  output: NormalizedBlockOutput
  isFinalOutput: boolean
}

export class NodeExecutionOrchestrator {
  constructor(
    private dag: DAG,
    private state: BlockStateController,
    private blockExecutor: BlockExecutor,
    private loopOrchestrator: LoopOrchestrator,
    private parallelOrchestrator: ParallelOrchestrator
  ) {}

  async executeNode(ctx: ExecutionContext, nodeId: string): Promise<NodeExecutionResult> {
    const node = this.dag.nodes.get(nodeId)
    if (!node) {
      throw new Error(`Node not found in DAG: ${nodeId}`)
    }

    if (this.state.hasExecuted(nodeId)) {
      const output = this.state.getBlockOutput(nodeId) || {}
      return {
        nodeId,
        output,
        isFinalOutput: false,
      }
    }

    const loopId = node.metadata.loopId
    if (loopId && !this.loopOrchestrator.getLoopScope(ctx, loopId)) {
      this.loopOrchestrator.initializeLoopScope(ctx, loopId)
    }

    if (loopId && !this.loopOrchestrator.shouldExecuteLoopNode(ctx, nodeId, loopId)) {
      return {
        nodeId,
        output: {},
        isFinalOutput: false,
      }
    }

    // Initialize parallel scope BEFORE execution so <parallel.currentItem> can be resolved
    const parallelId = node.metadata.parallelId
    if (parallelId && !this.parallelOrchestrator.getParallelScope(ctx, parallelId)) {
      const totalBranches = node.metadata.branchTotal || 1
      const parallelConfig = this.dag.parallelConfigs.get(parallelId)
      const nodesInParallel = (parallelConfig as any)?.nodes?.length || 1
      this.parallelOrchestrator.initializeParallelScope(
        ctx,
        parallelId,
        totalBranches,
        nodesInParallel
      )
    }

    if (node.metadata.isSentinel) {
      const output = await this.handleSentinel(ctx, node)
      const isFinalOutput = node.outgoingEdges.size === 0
      return {
        nodeId,
        output,
        isFinalOutput,
      }
    }

    const output = await this.blockExecutor.execute(ctx, node, node.block)
    const isFinalOutput = node.outgoingEdges.size === 0
    return {
      nodeId,
      output,
      isFinalOutput,
    }
  }

  private async handleSentinel(
    ctx: ExecutionContext,
    node: DAGNode
  ): Promise<NormalizedBlockOutput> {
    const sentinelType = node.metadata.sentinelType
    const loopId = node.metadata.loopId

    switch (sentinelType) {
      case 'start': {
        if (loopId) {
          const shouldExecute = await this.loopOrchestrator.evaluateInitialCondition(ctx, loopId)
          if (!shouldExecute) {
            logger.info('While loop initial condition false, skipping loop body', { loopId })
            return {
              sentinelStart: true,
              shouldExit: true,
              selectedRoute: EDGE.LOOP_EXIT,
            }
          }
        }
        return { sentinelStart: true }
      }

      case 'end': {
        if (!loopId) {
          logger.warn('Sentinel end called without loopId')
          return { shouldExit: true, selectedRoute: EDGE.LOOP_EXIT }
        }

        const continuationResult = await this.loopOrchestrator.evaluateLoopContinuation(ctx, loopId)

        if (continuationResult.shouldContinue) {
          return {
            shouldContinue: true,
            shouldExit: false,
            selectedRoute: continuationResult.selectedRoute,
          }
        }

        return {
          results: continuationResult.aggregatedResults || [],
          shouldContinue: false,
          shouldExit: true,
          selectedRoute: continuationResult.selectedRoute,
          totalIterations: continuationResult.aggregatedResults?.length || 0,
        }
      }

      default:
        logger.warn('Unknown sentinel type', { sentinelType })
        return {}
    }
  }

  async handleNodeCompletion(
    ctx: ExecutionContext,
    nodeId: string,
    output: NormalizedBlockOutput
  ): Promise<void> {
    const node = this.dag.nodes.get(nodeId)
    if (!node) {
      logger.error('Node not found during completion handling', { nodeId })
      return
    }

    const loopId = node.metadata.loopId
    const isParallelBranch = node.metadata.isParallelBranch
    const isSentinel = node.metadata.isSentinel
    if (isSentinel) {
      this.handleRegularNodeCompletion(ctx, node, output)
    } else if (loopId) {
      this.handleLoopNodeCompletion(ctx, node, output, loopId)
    } else if (isParallelBranch) {
      const parallelId = this.findParallelIdForNode(node.id)
      if (parallelId) {
        this.handleParallelNodeCompletion(ctx, node, output, parallelId)
      } else {
        this.handleRegularNodeCompletion(ctx, node, output)
      }
    } else {
      this.handleRegularNodeCompletion(ctx, node, output)
    }
  }

  private handleLoopNodeCompletion(
    ctx: ExecutionContext,
    node: DAGNode,
    output: NormalizedBlockOutput,
    loopId: string
  ): void {
    this.loopOrchestrator.storeLoopNodeOutput(ctx, loopId, node.id, output)
    this.state.setBlockOutput(node.id, output)
  }

  private handleParallelNodeCompletion(
    ctx: ExecutionContext,
    node: DAGNode,
    output: NormalizedBlockOutput,
    parallelId: string
  ): void {
    const scope = this.parallelOrchestrator.getParallelScope(ctx, parallelId)
    if (!scope) {
      const totalBranches = node.metadata.branchTotal || 1
      const parallelConfig = this.dag.parallelConfigs.get(parallelId)
      const nodesInParallel = (parallelConfig as any)?.nodes?.length || 1
      this.parallelOrchestrator.initializeParallelScope(
        ctx,
        parallelId,
        totalBranches,
        nodesInParallel
      )
    }
    const allComplete = this.parallelOrchestrator.handleParallelBranchCompletion(
      ctx,
      parallelId,
      node.id,
      output
    )
    if (allComplete) {
      this.parallelOrchestrator.aggregateParallelResults(ctx, parallelId)
    }

    this.state.setBlockOutput(node.id, output)
  }

  private handleRegularNodeCompletion(
    ctx: ExecutionContext,
    node: DAGNode,
    output: NormalizedBlockOutput
  ): void {
    this.state.setBlockOutput(node.id, output)

    if (
      node.metadata.isSentinel &&
      node.metadata.sentinelType === 'end' &&
      output.selectedRoute === 'loop_continue'
    ) {
      const loopId = node.metadata.loopId
      if (loopId) {
        this.loopOrchestrator.clearLoopExecutionState(loopId)
        this.loopOrchestrator.restoreLoopEdges(loopId)
      }
    }
  }

  private findParallelIdForNode(nodeId: string): string | undefined {
    const baseId = extractBaseBlockId(nodeId)
    return this.parallelOrchestrator.findParallelIdForNode(baseId)
  }
}
```

--------------------------------------------------------------------------------

````
