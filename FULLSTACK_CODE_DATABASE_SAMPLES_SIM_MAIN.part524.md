---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 524
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 524 of 933)

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
Location: sim-main/apps/sim/executor/variables/resolvers/parallel.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import { isReference, parseReferencePath, REFERENCE } from '@/executor/constants'
import { extractBaseBlockId, extractBranchIndex } from '@/executor/utils/subflow-utils'
import {
  navigatePath,
  type ResolutionContext,
  type Resolver,
} from '@/executor/variables/resolvers/reference'
import type { SerializedWorkflow } from '@/serializer/types'

const logger = createLogger('ParallelResolver')

export class ParallelResolver implements Resolver {
  constructor(private workflow: SerializedWorkflow) {}

  canResolve(reference: string): boolean {
    if (!isReference(reference)) {
      return false
    }
    const parts = parseReferencePath(reference)
    if (parts.length === 0) {
      return false
    }
    const [type] = parts
    return type === REFERENCE.PREFIX.PARALLEL
  }

  resolve(reference: string, context: ResolutionContext): any {
    const parts = parseReferencePath(reference)
    if (parts.length < 2) {
      logger.warn('Invalid parallel reference - missing property', { reference })
      return undefined
    }

    const [_, property, ...pathParts] = parts
    const parallelId = this.findParallelForBlock(context.currentNodeId)
    if (!parallelId) {
      return undefined
    }

    const parallelConfig = this.workflow.parallels?.[parallelId]
    if (!parallelConfig) {
      logger.warn('Parallel config not found', { parallelId })
      return undefined
    }

    const branchIndex = extractBranchIndex(context.currentNodeId)
    if (branchIndex === null) {
      return undefined
    }

    // First try to get items from the parallel scope (resolved at runtime)
    // This is the same pattern as LoopResolver reading from loopScope.items
    const parallelScope = context.executionContext.parallelExecutions?.get(parallelId)
    const distributionItems = parallelScope?.items ?? this.getDistributionItems(parallelConfig)

    let value: any
    switch (property) {
      case 'index':
        value = branchIndex
        break
      case 'currentItem':
        if (Array.isArray(distributionItems)) {
          value = distributionItems[branchIndex]
        } else if (typeof distributionItems === 'object' && distributionItems !== null) {
          const keys = Object.keys(distributionItems)
          const key = keys[branchIndex]
          value = key !== undefined ? distributionItems[key] : undefined
        } else {
          return undefined
        }
        break
      case 'items':
        value = distributionItems
        break
      default:
        logger.warn('Unknown parallel property', { property })
        return undefined
    }

    // If there are additional path parts, navigate deeper
    if (pathParts.length > 0) {
      return navigatePath(value, pathParts)
    }

    return value
  }

  private findParallelForBlock(blockId: string): string | undefined {
    const baseId = extractBaseBlockId(blockId)
    if (!this.workflow.parallels) {
      return undefined
    }
    for (const parallelId of Object.keys(this.workflow.parallels)) {
      const parallelConfig = this.workflow.parallels[parallelId]
      if (parallelConfig?.nodes.includes(baseId)) {
        return parallelId
      }
    }

    return undefined
  }

  private getDistributionItems(parallelConfig: any): any[] {
    const rawItems = parallelConfig.distributionItems || parallelConfig.distribution || []

    // Already an array - return as-is
    if (Array.isArray(rawItems)) {
      return rawItems
    }

    // Object - convert to entries array (consistent with loop forEach behavior)
    if (typeof rawItems === 'object' && rawItems !== null) {
      return Object.entries(rawItems)
    }

    // String handling
    if (typeof rawItems === 'string') {
      // Skip references - they should be resolved by the variable resolver
      if (rawItems.startsWith('<')) {
        return []
      }

      // Try to parse as JSON
      try {
        const parsed = JSON.parse(rawItems.replace(/'/g, '"'))
        if (Array.isArray(parsed)) {
          return parsed
        }
        // Parsed to non-array (e.g. object) - convert to entries
        if (typeof parsed === 'object' && parsed !== null) {
          return Object.entries(parsed)
        }
        return []
      } catch (e) {
        logger.error('Failed to parse distribution items', { rawItems })
        return []
      }
    }

    return []
  }
}
```

--------------------------------------------------------------------------------

---[FILE: reference.ts]---
Location: sim-main/apps/sim/executor/variables/resolvers/reference.ts

```typescript
import type { ExecutionState, LoopScope } from '@/executor/execution/state'
import type { ExecutionContext } from '@/executor/types'
export interface ResolutionContext {
  executionContext: ExecutionContext
  executionState: ExecutionState
  currentNodeId: string
  loopScope?: LoopScope
}

export interface Resolver {
  canResolve(reference: string): boolean
  resolve(reference: string, context: ResolutionContext): any
}

/**
 * Navigate through nested object properties using a path array.
 * Supports dot notation and array indices.
 *
 * @example
 * navigatePath({a: {b: {c: 1}}}, ['a', 'b', 'c']) => 1
 * navigatePath({items: [{name: 'test'}]}, ['items', '0', 'name']) => 'test'
 */
export function navigatePath(obj: any, path: string[]): any {
  let current = obj
  for (const part of path) {
    if (current === null || current === undefined) {
      return undefined
    }

    // Handle array indexing like "items[0]" or just numeric indices
    const arrayMatch = part.match(/^([^[]+)\[(\d+)\](.*)$/)
    if (arrayMatch) {
      // Handle complex array access like "items[0]"
      const [, prop, index] = arrayMatch
      current = current[prop]
      if (current === undefined || current === null) {
        return undefined
      }
      const idx = Number.parseInt(index, 10)
      current = Array.isArray(current) ? current[idx] : undefined
    } else if (/^\d+$/.test(part)) {
      // Handle plain numeric index
      const index = Number.parseInt(part, 10)
      current = Array.isArray(current) ? current[index] : undefined
    } else {
      // Handle regular property access
      current = current[part]
    }
  }
  return current
}
```

--------------------------------------------------------------------------------

---[FILE: workflow.ts]---
Location: sim-main/apps/sim/executor/variables/resolvers/workflow.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import { VariableManager } from '@/lib/workflows/variables/variable-manager'
import { isReference, parseReferencePath, REFERENCE } from '@/executor/constants'
import {
  navigatePath,
  type ResolutionContext,
  type Resolver,
} from '@/executor/variables/resolvers/reference'

const logger = createLogger('WorkflowResolver')

export class WorkflowResolver implements Resolver {
  constructor(private workflowVariables: Record<string, any>) {}

  canResolve(reference: string): boolean {
    if (!isReference(reference)) {
      return false
    }
    const parts = parseReferencePath(reference)
    if (parts.length === 0) {
      return false
    }
    const [type] = parts
    return type === REFERENCE.PREFIX.VARIABLE
  }

  resolve(reference: string, context: ResolutionContext): any {
    const parts = parseReferencePath(reference)
    if (parts.length < 2) {
      logger.warn('Invalid variable reference - missing variable name', { reference })
      return undefined
    }

    const [_, variableName, ...pathParts] = parts

    const workflowVars = context.executionContext.workflowVariables || this.workflowVariables

    for (const varObj of Object.values(workflowVars)) {
      const v = varObj as any
      if (v && (v.name === variableName || v.id === variableName)) {
        const normalizedType = (v.type === 'string' ? 'plain' : v.type) || 'plain'
        let value: any
        try {
          value = VariableManager.resolveForExecution(v.value, normalizedType)
        } catch (error) {
          logger.warn('Failed to resolve workflow variable, returning raw value', {
            variableName,
            error: (error as Error).message,
          })
          value = v.value
        }

        // If there are additional path parts, navigate deeper
        if (pathParts.length > 0) {
          return navigatePath(value, pathParts)
        }

        return value
      }
    }

    return undefined
  }
}
```

--------------------------------------------------------------------------------

---[FILE: executor-mocks.ts]---
Location: sim-main/apps/sim/executor/__test-utils__/executor-mocks.ts

```typescript
import { vi } from 'vitest'
import type { SerializedWorkflow } from '@/serializer/types'

/**
 * Mock handler factory - creates consistent handler mocks
 */
export const createMockHandler = (
  handlerName: string,
  options?: {
    canHandleCondition?: (block: any) => boolean
    executeResult?: any | ((inputs: any) => any)
  }
) => {
  const defaultCanHandle = (block: any) =>
    block.metadata?.id === handlerName || handlerName === 'generic'

  const defaultExecuteResult = {
    result: `${handlerName} executed`,
  }

  return vi.fn().mockImplementation(() => ({
    canHandle: options?.canHandleCondition || defaultCanHandle,
    execute: vi.fn().mockImplementation(async (block, inputs) => {
      if (typeof options?.executeResult === 'function') {
        return options.executeResult(inputs)
      }
      return options?.executeResult || defaultExecuteResult
    }),
  }))
}

/**
 * Setup all handler mocks with default behaviors
 */
export const setupHandlerMocks = () => {
  vi.doMock('@/executor/handlers', () => ({
    TriggerBlockHandler: createMockHandler('trigger', {
      canHandleCondition: (block) =>
        block.metadata?.category === 'triggers' || block.config?.params?.triggerMode === true,
      executeResult: (inputs: any) => inputs || {},
    }),
    AgentBlockHandler: createMockHandler('agent'),
    RouterBlockHandler: createMockHandler('router'),
    ConditionBlockHandler: createMockHandler('condition'),
    EvaluatorBlockHandler: createMockHandler('evaluator'),
    FunctionBlockHandler: createMockHandler('function'),
    ApiBlockHandler: createMockHandler('api'),
    LoopBlockHandler: createMockHandler('loop'),
    ParallelBlockHandler: createMockHandler('parallel'),
    WorkflowBlockHandler: createMockHandler('workflow'),
    VariablesBlockHandler: createMockHandler('variables'),
    WaitBlockHandler: createMockHandler('wait'),
    GenericBlockHandler: createMockHandler('generic'),
    ResponseBlockHandler: createMockHandler('response'),
  }))
}

/**
 * Setup store mocks with configurable options
 */
export const setupStoreMocks = (options?: {
  isDebugging?: boolean
  consoleAddFn?: ReturnType<typeof vi.fn>
  consoleUpdateFn?: ReturnType<typeof vi.fn>
}) => {
  const consoleAddFn = options?.consoleAddFn || vi.fn()
  const consoleUpdateFn = options?.consoleUpdateFn || vi.fn()

  vi.doMock('@/stores/settings/general/store', () => ({
    useGeneralStore: {
      getState: () => ({}),
    },
  }))

  vi.doMock('@/stores/execution/store', () => ({
    useExecutionStore: {
      getState: () => ({
        isDebugging: options?.isDebugging ?? false,
        setIsExecuting: vi.fn(),
        reset: vi.fn(),
        setActiveBlocks: vi.fn(),
        setPendingBlocks: vi.fn(),
        setIsDebugging: vi.fn(),
      }),
      setState: vi.fn(),
    },
  }))

  vi.doMock('@/stores/console/store', () => ({
    useConsoleStore: {
      getState: () => ({
        addConsole: consoleAddFn,
      }),
    },
  }))

  vi.doMock('@/stores/terminal', () => ({
    useTerminalConsoleStore: {
      getState: () => ({
        addConsole: consoleAddFn,
        updateConsole: consoleUpdateFn,
      }),
    },
  }))

  return { consoleAddFn, consoleUpdateFn }
}

/**
 * Setup core executor mocks (PathTracker, InputResolver, LoopManager, ParallelManager)
 */
export const setupExecutorCoreMocks = () => {
  vi.doMock('@/executor/path', () => ({
    PathTracker: vi.fn().mockImplementation(() => ({
      updateExecutionPaths: vi.fn(),
      isInActivePath: vi.fn().mockReturnValue(true),
    })),
  }))

  vi.doMock('@/executor/resolver', () => ({
    InputResolver: vi.fn().mockImplementation(() => ({
      resolveInputs: vi.fn().mockReturnValue({}),
      resolveBlockReferences: vi.fn().mockImplementation((value) => value),
      resolveVariableReferences: vi.fn().mockImplementation((value) => value),
      resolveEnvVariables: vi.fn().mockImplementation((value) => value),
    })),
  }))

  vi.doMock('@/executor/loops', () => ({
    LoopManager: vi.fn().mockImplementation(() => ({
      processLoopIterations: vi.fn().mockResolvedValue(false),
      getLoopIndex: vi.fn().mockImplementation((loopId, blockId, context) => {
        return context.loopExecutions?.get(loopId)?.iteration || 0
      }),
    })),
  }))

  vi.doMock('@/executor/parallels', () => ({
    ParallelManager: vi.fn().mockImplementation(() => ({
      processParallelIterations: vi.fn().mockResolvedValue(false),
      createVirtualBlockInstances: vi.fn().mockReturnValue([]),
      setupIterationContext: vi.fn(),
      storeIterationResult: vi.fn(),
      initializeParallel: vi.fn(),
      getIterationItem: vi.fn(),
      areAllVirtualBlocksExecuted: vi.fn().mockReturnValue(false),
    })),
  }))
}

/**
 * Workflow factory functions
 */
export const createMinimalWorkflow = (): SerializedWorkflow => ({
  version: '1.0',
  blocks: [
    {
      id: 'starter',
      position: { x: 0, y: 0 },
      config: { tool: 'test-tool', params: {} },
      inputs: {},
      outputs: {},
      enabled: true,
      metadata: { id: 'starter', name: 'Starter Block' },
    },
    {
      id: 'block1',
      position: { x: 100, y: 0 },
      config: { tool: 'test-tool', params: {} },
      inputs: {},
      outputs: {},
      enabled: true,
      metadata: { id: 'test', name: 'Test Block' },
    },
  ],
  connections: [
    {
      source: 'starter',
      target: 'block1',
    },
  ],
  loops: {},
})

export const createWorkflowWithCondition = (): SerializedWorkflow => ({
  version: '1.0',
  blocks: [
    {
      id: 'starter',
      position: { x: 0, y: 0 },
      config: { tool: 'test-tool', params: {} },
      inputs: {},
      outputs: {},
      enabled: true,
      metadata: { id: 'starter', name: 'Starter Block' },
    },
    {
      id: 'condition1',
      position: { x: 100, y: 0 },
      config: { tool: 'test-tool', params: {} },
      inputs: {},
      outputs: {},
      enabled: true,
      metadata: { id: 'condition', name: 'Condition Block' },
    },
    {
      id: 'block1',
      position: { x: 200, y: -50 },
      config: { tool: 'test-tool', params: {} },
      inputs: {},
      outputs: {},
      enabled: true,
      metadata: { id: 'test', name: 'True Path Block' },
    },
    {
      id: 'block2',
      position: { x: 200, y: 50 },
      config: { tool: 'test-tool', params: {} },
      inputs: {},
      outputs: {},
      enabled: true,
      metadata: { id: 'test', name: 'False Path Block' },
    },
  ],
  connections: [
    {
      source: 'starter',
      target: 'condition1',
    },
    {
      source: 'condition1',
      target: 'block1',
      sourceHandle: 'condition-true',
    },
    {
      source: 'condition1',
      target: 'block2',
      sourceHandle: 'condition-false',
    },
  ],
  loops: {},
})

export const createWorkflowWithLoop = (): SerializedWorkflow => ({
  version: '1.0',
  blocks: [
    {
      id: 'starter',
      position: { x: 0, y: 0 },
      config: { tool: 'test-tool', params: {} },
      inputs: {},
      outputs: {},
      enabled: true,
      metadata: { id: 'starter', name: 'Starter Block' },
    },
    {
      id: 'block1',
      position: { x: 100, y: 0 },
      config: { tool: 'test-tool', params: {} },
      inputs: {},
      outputs: {},
      enabled: true,
      metadata: { id: 'test', name: 'Loop Block 1' },
    },
    {
      id: 'block2',
      position: { x: 200, y: 0 },
      config: { tool: 'test-tool', params: {} },
      inputs: {},
      outputs: {},
      enabled: true,
      metadata: { id: 'test', name: 'Loop Block 2' },
    },
  ],
  connections: [
    {
      source: 'starter',
      target: 'block1',
    },
    {
      source: 'block1',
      target: 'block2',
    },
    {
      source: 'block2',
      target: 'block1',
    },
  ],
  loops: {
    loop1: {
      id: 'loop1',
      nodes: ['block1', 'block2'],
      iterations: 5,
      loopType: 'forEach',
      forEachItems: [1, 2, 3, 4, 5],
    },
  },
})

export const createWorkflowWithErrorPath = (): SerializedWorkflow => ({
  version: '1.0',
  blocks: [
    {
      id: 'starter',
      position: { x: 0, y: 0 },
      config: { tool: 'test-tool', params: {} },
      inputs: {},
      outputs: {},
      enabled: true,
      metadata: { id: 'starter', name: 'Starter Block' },
    },
    {
      id: 'block1',
      position: { x: 100, y: 0 },
      config: { tool: 'test-tool', params: {} },
      inputs: {},
      outputs: {},
      enabled: true,
      metadata: { id: 'function', name: 'Function Block' },
    },
    {
      id: 'error-handler',
      position: { x: 200, y: 50 },
      config: { tool: 'test-tool', params: {} },
      inputs: {},
      outputs: {},
      enabled: true,
      metadata: { id: 'test', name: 'Error Handler Block' },
    },
    {
      id: 'success-block',
      position: { x: 200, y: -50 },
      config: { tool: 'test-tool', params: {} },
      inputs: {},
      outputs: {},
      enabled: true,
      metadata: { id: 'test', name: 'Success Block' },
    },
  ],
  connections: [
    {
      source: 'starter',
      target: 'block1',
    },
    {
      source: 'block1',
      target: 'success-block',
      sourceHandle: 'source',
    },
    {
      source: 'block1',
      target: 'error-handler',
      sourceHandle: 'error',
    },
  ],
  loops: {},
})

export const createWorkflowWithParallel = (distribution?: any): SerializedWorkflow => ({
  version: '2.0',
  blocks: [
    {
      id: 'starter',
      position: { x: 0, y: 0 },
      metadata: { id: 'starter', name: 'Start' },
      config: { tool: 'starter', params: {} },
      inputs: {},
      outputs: {},
      enabled: true,
    },
    {
      id: 'parallel-1',
      position: { x: 100, y: 0 },
      metadata: { id: 'parallel', name: 'Test Parallel' },
      config: { tool: 'parallel', params: {} },
      inputs: {},
      outputs: {},
      enabled: true,
    },
    {
      id: 'function-1',
      position: { x: 200, y: 0 },
      metadata: { id: 'function', name: 'Process Item' },
      config: {
        tool: 'function',
        params: {
          code: 'return { item: <parallel.currentItem>, index: <parallel.index> }',
        },
      },
      inputs: {},
      outputs: {},
      enabled: true,
    },
    {
      id: 'endpoint',
      position: { x: 300, y: 0 },
      metadata: { id: 'generic', name: 'End' },
      config: { tool: 'generic', params: {} },
      inputs: {},
      outputs: {},
      enabled: true,
    },
  ],
  connections: [
    { source: 'starter', target: 'parallel-1' },
    { source: 'parallel-1', target: 'function-1', sourceHandle: 'parallel-start-source' },
    { source: 'parallel-1', target: 'endpoint', sourceHandle: 'parallel-end-source' },
  ],
  loops: {},
  parallels: {
    'parallel-1': {
      id: 'parallel-1',
      nodes: ['function-1'],
      distribution: distribution || ['apple', 'banana', 'cherry'],
    },
  },
})

export const createWorkflowWithResponse = (): SerializedWorkflow => ({
  version: '1.0',
  blocks: [
    {
      id: 'starter',
      position: { x: 0, y: 0 },
      config: { tool: 'test-tool', params: {} },
      inputs: {
        input: 'json',
      },
      outputs: {
        response: {
          input: 'json',
        },
      },
      enabled: true,
      metadata: { id: 'starter', name: 'Starter Block' },
    },
    {
      id: 'response',
      position: { x: 100, y: 0 },
      config: { tool: 'test-tool', params: {} },
      inputs: {
        data: 'json',
        status: 'number',
        headers: 'json',
      },
      outputs: {
        response: {
          data: 'json',
          status: 'number',
          headers: 'json',
        },
      },
      enabled: true,
      metadata: { id: 'response', name: 'Response Block' },
    },
  ],
  connections: [{ source: 'starter', target: 'response' }],
  loops: {},
})

/**
 * Create a mock execution context with customizable options
 */
export interface MockContextOptions {
  workflowId?: string
  loopExecutions?: Map<string, any>
  executedBlocks?: Set<string>
  activeExecutionPath?: Set<string>
  completedLoops?: Set<string>
  parallelExecutions?: Map<string, any>
  parallelBlockMapping?: Map<string, any>
  currentVirtualBlockId?: string
  workflow?: SerializedWorkflow
  blockStates?: Map<string, any>
}

export const createMockContext = (options: MockContextOptions = {}) => {
  const workflow = options.workflow || createMinimalWorkflow()

  return {
    workflowId: options.workflowId || 'test-workflow-id',
    blockStates: options.blockStates || new Map(),
    blockLogs: [],
    metadata: { startTime: new Date().toISOString(), duration: 0 },
    environmentVariables: {},
    decisions: { router: new Map(), condition: new Map() },
    loopExecutions: options.loopExecutions || new Map(),
    executedBlocks: options.executedBlocks || new Set<string>(),
    activeExecutionPath: options.activeExecutionPath || new Set<string>(),
    workflow,
    completedLoops: options.completedLoops || new Set<string>(),
    parallelExecutions: options.parallelExecutions || new Map(),
    parallelBlockMapping: options.parallelBlockMapping,
    currentVirtualBlockId: options.currentVirtualBlockId,
  }
}

/**
 * Mock implementations for testing loops
 */
export const createLoopManagerMock = (options?: {
  processLoopIterationsImpl?: (context: any) => Promise<boolean>
  getLoopIndexImpl?: (loopId: string, blockId: string, context: any) => number
}) => ({
  LoopManager: vi.fn().mockImplementation(() => ({
    processLoopIterations: options?.processLoopIterationsImpl || vi.fn().mockResolvedValue(false),
    getLoopIndex:
      options?.getLoopIndexImpl ||
      vi.fn().mockImplementation((loopId, blockId, context) => {
        return context.loopExecutions?.get(loopId)?.iteration || 0
      }),
  })),
})

/**
 * Create a parallel execution state object for testing
 */
export const createParallelExecutionState = (options?: {
  parallelCount?: number
  distributionItems?: any[] | Record<string, any> | null
  completedExecutions?: number
  executionResults?: Map<string, any>
  activeIterations?: Set<number>
  parallelType?: 'count' | 'collection'
}) => ({
  parallelCount: options?.parallelCount ?? 3,
  distributionItems:
    options?.distributionItems !== undefined ? options.distributionItems : ['a', 'b', 'c'],
  completedExecutions: options?.completedExecutions ?? 0,
  executionResults: options?.executionResults ?? new Map<string, any>(),
  activeIterations: options?.activeIterations ?? new Set<number>(),
  parallelType: options?.parallelType,
})

/**
 * Mock implementations for testing parallels
 */
export const createParallelManagerMock = (options?: {
  maxChecks?: number
  processParallelIterationsImpl?: (context: any) => Promise<void>
}) => ({
  ParallelManager: vi.fn().mockImplementation(() => {
    const executionCounts = new Map()
    const maxChecks = options?.maxChecks || 2

    return {
      processParallelIterations:
        options?.processParallelIterationsImpl ||
        vi.fn().mockImplementation(async (context) => {
          for (const [parallelId, parallel] of Object.entries(context.workflow?.parallels || {})) {
            if (context.completedLoops.has(parallelId)) {
              continue
            }

            const parallelState = context.parallelExecutions?.get(parallelId)
            if (!parallelState) {
              continue
            }

            const checkCount = executionCounts.get(parallelId) || 0
            executionCounts.set(parallelId, checkCount + 1)

            if (checkCount >= maxChecks) {
              context.completedLoops.add(parallelId)
              continue
            }

            let allVirtualBlocksExecuted = true
            const parallelNodes = (parallel as any).nodes || []
            for (const nodeId of parallelNodes) {
              for (let i = 0; i < parallelState.parallelCount; i++) {
                const virtualBlockId = `${nodeId}_parallel_${parallelId}_iteration_${i}`
                if (!context.executedBlocks.has(virtualBlockId)) {
                  allVirtualBlocksExecuted = false
                  break
                }
              }
              if (!allVirtualBlocksExecuted) break
            }

            if (allVirtualBlocksExecuted && !context.completedLoops.has(parallelId)) {
              context.executedBlocks.delete(parallelId)
              context.activeExecutionPath.add(parallelId)

              for (const nodeId of parallelNodes) {
                context.activeExecutionPath.delete(nodeId)
              }
            }
          }
        }),
      createVirtualBlockInstances: vi.fn().mockImplementation((block, parallelId, state) => {
        const instances = []
        for (let i = 0; i < state.parallelCount; i++) {
          instances.push(`${block.id}_parallel_${parallelId}_iteration_${i}`)
        }
        return instances
      }),
      setupIterationContext: vi.fn(),
      storeIterationResult: vi.fn(),
      initializeParallel: vi.fn(),
      getIterationItem: vi.fn(),
      areAllVirtualBlocksExecuted: vi
        .fn()
        .mockImplementation((parallelId, parallel, executedBlocks, state, context) => {
          // Simple mock implementation - check all blocks (ignoring conditional routing for tests)
          for (const nodeId of parallel.nodes) {
            for (let i = 0; i < state.parallelCount; i++) {
              const virtualBlockId = `${nodeId}_parallel_${parallelId}_iteration_${i}`
              if (!executedBlocks.has(virtualBlockId)) {
                return false
              }
            }
          }
          return true
        }),
    }
  }),
})

/**
 * Setup function block handler that executes code
 */
export const createFunctionBlockHandler = vi.fn().mockImplementation(() => ({
  canHandle: (block: any) => block.metadata?.id === 'function',
  execute: vi.fn().mockImplementation(async (block, inputs) => {
    return {
      result: inputs.code ? new Function(inputs.code)() : { key: inputs.key, value: inputs.value },
      stdout: '',
    }
  }),
}))

/**
 * Create a custom parallel block handler for testing
 */
export const createParallelBlockHandler = vi.fn().mockImplementation(() => {
  return {
    canHandle: (block: any) => block.metadata?.id === 'parallel',
    execute: vi.fn().mockImplementation(async (block, inputs, context) => {
      const parallelId = block.id
      const parallel = context.workflow?.parallels?.[parallelId]

      if (!parallel) {
        throw new Error('Parallel configuration not found')
      }

      if (!context.parallelExecutions) {
        context.parallelExecutions = new Map()
      }

      let parallelState = context.parallelExecutions.get(parallelId)

      if (!parallelState) {
        // First execution - initialize
        const distributionItems = parallel.distribution || []
        const parallelCount = Array.isArray(distributionItems)
          ? distributionItems.length
          : typeof distributionItems === 'object'
            ? Object.keys(distributionItems).length
            : 1

        parallelState = {
          parallelCount,
          distributionItems,
          completedExecutions: 0,
          executionResults: new Map(),
          activeIterations: new Set(),
        }
        context.parallelExecutions.set(parallelId, parallelState)

        if (distributionItems) {
          context.loopItems.set(`${parallelId}_items`, distributionItems)
        }

        // Activate child nodes
        const connections =
          context.workflow?.connections.filter(
            (conn: any) =>
              conn.source === parallelId && conn.sourceHandle === 'parallel-start-source'
          ) || []

        for (const conn of connections) {
          context.activeExecutionPath.add(conn.target)
        }

        return {
          parallelId,
          parallelCount,
          distributionType: 'distributed',
          started: true,
          message: `Initialized ${parallelCount} parallel executions`,
        }
      }

      // Check completion
      const allCompleted = parallel.nodes.every((nodeId: string) => {
        for (let i = 0; i < parallelState.parallelCount; i++) {
          const virtualBlockId = `${nodeId}_parallel_${parallelId}_iteration_${i}`
          if (!context.executedBlocks.has(virtualBlockId)) {
            return false
          }
        }
        return true
      })

      if (allCompleted) {
        context.completedLoops.add(parallelId)

        // Activate end connections
        const endConnections =
          context.workflow?.connections.filter(
            (conn: any) => conn.source === parallelId && conn.sourceHandle === 'parallel-end-source'
          ) || []

        for (const conn of endConnections) {
          context.activeExecutionPath.add(conn.target)
        }

        return {
          parallelId,
          parallelCount: parallelState.parallelCount,
          completed: true,
          message: `Completed all ${parallelState.parallelCount} executions`,
        }
      }

      return {
        parallelId,
        parallelCount: parallelState.parallelCount,
        waiting: true,
        message: 'Waiting for iterations to complete',
      }
    }),
  }
})

/**
 * Create an input resolver mock that handles parallel references
 */
export const createParallelInputResolver = (distributionData: any) => ({
  InputResolver: vi.fn().mockImplementation(() => ({
    resolveInputs: vi.fn().mockImplementation((block, context) => {
      if (block.metadata?.id === 'function') {
        const virtualBlockId = context.currentVirtualBlockId
        if (virtualBlockId && context.parallelBlockMapping) {
          const mapping = context.parallelBlockMapping.get(virtualBlockId)
          if (mapping) {
            if (Array.isArray(distributionData)) {
              const currentItem = distributionData[mapping.iterationIndex]
              const currentIndex = mapping.iterationIndex
              return {
                code: `return { item: "${currentItem}", index: ${currentIndex} }`,
              }
            }
            if (typeof distributionData === 'object') {
              const entries = Object.entries(distributionData)
              const [key, value] = entries[mapping.iterationIndex]
              return {
                code: `return { key: "${key}", value: "${value}" }`,
              }
            }
          }
        }
      }
      return {}
    }),
  })),
})

/**
 * Create a workflow with parallel blocks for testing
 */
export const createWorkflowWithParallelArray = (
  items: any[] = ['apple', 'banana', 'cherry']
): SerializedWorkflow => ({
  version: '2.0',
  blocks: [
    {
      id: 'starter',
      position: { x: 0, y: 0 },
      metadata: { id: 'starter', name: 'Start' },
      config: { tool: 'starter', params: {} },
      inputs: {},
      outputs: {},
      enabled: true,
    },
    {
      id: 'parallel-1',
      position: { x: 100, y: 0 },
      metadata: { id: 'parallel', name: 'Test Parallel' },
      config: { tool: 'parallel', params: {} },
      inputs: {},
      outputs: {},
      enabled: true,
    },
    {
      id: 'function-1',
      position: { x: 200, y: 0 },
      metadata: { id: 'function', name: 'Process Item' },
      config: {
        tool: 'function',
        params: {
          code: 'return { item: <parallel.currentItem>, index: <parallel.index> }',
        },
      },
      inputs: {},
      outputs: {},
      enabled: true,
    },
    {
      id: 'endpoint',
      position: { x: 300, y: 0 },
      metadata: { id: 'generic', name: 'End' },
      config: { tool: 'generic', params: {} },
      inputs: {},
      outputs: {},
      enabled: true,
    },
  ],
  connections: [
    { source: 'starter', target: 'parallel-1' },
    { source: 'parallel-1', target: 'function-1', sourceHandle: 'parallel-start-source' },
    { source: 'parallel-1', target: 'endpoint', sourceHandle: 'parallel-end-source' },
  ],
  loops: {},
  parallels: {
    'parallel-1': {
      id: 'parallel-1',
      nodes: ['function-1'],
      distribution: items,
    },
  },
})

/**
 * Create a workflow with parallel blocks for object distribution
 */
export const createWorkflowWithParallelObject = (
  items: Record<string, any> = { first: 'alpha', second: 'beta', third: 'gamma' }
): SerializedWorkflow => ({
  version: '2.0',
  blocks: [
    {
      id: 'starter',
      position: { x: 0, y: 0 },
      metadata: { id: 'starter', name: 'Start' },
      config: { tool: 'starter', params: {} },
      inputs: {},
      outputs: {},
      enabled: true,
    },
    {
      id: 'parallel-1',
      position: { x: 100, y: 0 },
      metadata: { id: 'parallel', name: 'Test Parallel' },
      config: { tool: 'parallel', params: {} },
      inputs: {},
      outputs: {},
      enabled: true,
    },
    {
      id: 'function-1',
      position: { x: 200, y: 0 },
      metadata: { id: 'function', name: 'Process Entry' },
      config: {
        tool: 'function',
        params: {
          code: 'return { key: <parallel.currentItem.key>, value: <parallel.currentItem.value> }',
        },
      },
      inputs: {},
      outputs: {},
      enabled: true,
    },
    {
      id: 'endpoint',
      position: { x: 300, y: 0 },
      metadata: { id: 'generic', name: 'End' },
      config: { tool: 'generic', params: {} },
      inputs: {},
      outputs: {},
      enabled: true,
    },
  ],
  connections: [
    { source: 'starter', target: 'parallel-1' },
    { source: 'parallel-1', target: 'function-1', sourceHandle: 'parallel-start-source' },
    { source: 'parallel-1', target: 'endpoint', sourceHandle: 'parallel-end-source' },
  ],
  loops: {},
  parallels: {
    'parallel-1': {
      id: 'parallel-1',
      nodes: ['function-1'],
      distribution: items,
    },
  },
})

/**
 * Mock all modules needed for parallel tests
 */
export const setupParallelTestMocks = (options?: {
  distributionData?: any
  maxParallelChecks?: number
}) => {
  setupStoreMocks()

  setupExecutorCoreMocks()

  vi.doMock('@/executor/parallels', () =>
    createParallelManagerMock({
      maxChecks: options?.maxParallelChecks,
    })
  )

  vi.doMock('@/executor/loops', () => createLoopManagerMock())
}

/**
 * Sets up all standard mocks for executor tests
 */
export const setupAllMocks = (options?: {
  isDebugging?: boolean
  consoleAddFn?: ReturnType<typeof vi.fn>
  consoleUpdateFn?: ReturnType<typeof vi.fn>
}) => {
  setupHandlerMocks()
  const storeMocks = setupStoreMocks(options)
  setupExecutorCoreMocks()

  return storeMocks
}
```

--------------------------------------------------------------------------------

---[FILE: mock-dependencies.ts]---
Location: sim-main/apps/sim/executor/__test-utils__/mock-dependencies.ts

```typescript
import { vi } from 'vitest'

// Mock common dependencies used across executor handler tests

// Logger
vi.mock('@/lib/logs/console/logger', () => ({
  createLogger: vi.fn(() => ({
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  })),
}))

// Blocks
vi.mock('@/blocks/index', () => ({
  getBlock: vi.fn(),
}))

// Tools
vi.mock('@/tools/utils', () => ({
  getTool: vi.fn(),
  getToolAsync: vi.fn(),
  validateToolRequest: vi.fn(), // Keep for backward compatibility
  formatRequestParams: vi.fn(),
  transformTable: vi.fn(),
  createParamSchema: vi.fn(),
  getClientEnvVars: vi.fn(),
  createCustomToolRequestBody: vi.fn(),
  validateRequiredParametersAfterMerge: vi.fn(),
}))

// Utils
vi.mock('@/lib/core/config/environment', () => ({
  isHosted: false,
}))

vi.mock('@/lib/core/config/api-keys', () => ({
  getRotatingApiKey: vi.fn(),
}))

// Tools
vi.mock('@/tools')

// Providers
vi.mock('@/providers', () => ({
  executeProviderRequest: vi.fn(),
}))
vi.mock('@/providers/utils', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    // @ts-ignore
    ...actual,
    getProviderFromModel: vi.fn(),
    transformBlockTool: vi.fn(),
    // Ensure getBaseModelProviders returns an object
    getBaseModelProviders: vi.fn(() => ({})),
  }
})

// Executor utilities
vi.mock('@/executor/path')
vi.mock('@/executor/resolver', () => ({
  InputResolver: vi.fn(),
}))

// Specific block utilities (like router prompt generator)
vi.mock('@/blocks/blocks/router')

// Mock blocks - needed by agent handler for transformBlockTool
vi.mock('@/blocks')

// Mock fetch for server requests
global.fetch = Object.assign(vi.fn(), { preconnect: vi.fn() }) as typeof fetch

// Mock process.env
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
```

--------------------------------------------------------------------------------

---[FILE: test-executor.ts]---
Location: sim-main/apps/sim/executor/__test-utils__/test-executor.ts

```typescript
/**
 * TestExecutor Class
 *
 * A testable version of the Executor class that can be used in tests
 * without requiring all the complex dependencies.
 */
import { Executor } from '@/executor'
import type { ExecutionResult, NormalizedBlockOutput } from '@/executor/types'

/**
 * Test implementation of Executor for unit testing.
 * Extends the real Executor but provides simplified execution that
 * doesn't depend on complex dependencies.
 */
export class TestExecutor extends Executor {
  /**
   * Override the execute method to return a pre-defined result for testing
   */
  async execute(workflowId: string): Promise<ExecutionResult> {
    try {
      // Call validateWorkflow to ensure we validate the workflow
      // even though we're not actually executing it
      ;(this as any).validateWorkflow()

      // Return a successful result
      return {
        success: true,
        output: {
          result: 'Test execution completed',
        } as NormalizedBlockOutput,
        logs: [],
        metadata: {
          duration: 100,
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
        },
      }
    } catch (error: any) {
      // If validation fails, return a failure result
      return {
        success: false,
        output: {} as NormalizedBlockOutput,
        error: error.message,
        logs: [],
      }
    }
  }
}
```

--------------------------------------------------------------------------------

````
