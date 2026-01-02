---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 511
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 511 of 933)

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

---[FILE: utils.test.ts]---
Location: sim-main/apps/sim/executor/utils.test.ts

```typescript
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  StreamingResponseFormatProcessor,
  streamingResponseFormatProcessor,
} from '@/executor/utils'

vi.mock('@/lib/logs/console/logger', () => ({
  createLogger: vi.fn().mockReturnValue({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }),
}))

describe('StreamingResponseFormatProcessor', () => {
  let processor: StreamingResponseFormatProcessor

  beforeEach(() => {
    processor = new StreamingResponseFormatProcessor()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('processStream', () => {
    it.concurrent('should return original stream when no response format selection', async () => {
      const mockStream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('{"content": "test"}'))
          controller.close()
        },
      })

      const result = processor.processStream(
        mockStream,
        'block-1',
        ['block-1.content'], // No underscore, not response format
        { schema: { properties: { username: { type: 'string' } } } }
      )

      expect(result).toBe(mockStream)
    })

    it.concurrent('should return original stream when no response format provided', async () => {
      const mockStream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('{"content": "test"}'))
          controller.close()
        },
      })

      const result = processor.processStream(
        mockStream,
        'block-1',
        ['block-1_username'], // Has underscore but no response format
        undefined
      )

      expect(result).toBe(mockStream)
    })

    it.concurrent('should process stream and extract single selected field', async () => {
      const mockStream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('{"username": "alice", "age": 25}'))
          controller.close()
        },
      })

      const processedStream = processor.processStream(mockStream, 'block-1', ['block-1_username'], {
        schema: { properties: { username: { type: 'string' }, age: { type: 'number' } } },
      })

      const reader = processedStream.getReader()
      const decoder = new TextDecoder()
      let result = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        result += decoder.decode(value)
      }

      expect(result).toBe('alice')
    })

    it.concurrent('should process stream and extract multiple selected fields', async () => {
      const mockStream = new ReadableStream({
        start(controller) {
          controller.enqueue(
            new TextEncoder().encode('{"username": "bob", "age": 30, "email": "bob@test.com"}')
          )
          controller.close()
        },
      })

      const processedStream = processor.processStream(
        mockStream,
        'block-1',
        ['block-1_username', 'block-1_age'],
        {
          schema: { properties: { username: { type: 'string' }, age: { type: 'number' } } },
        }
      )

      const reader = processedStream.getReader()
      const decoder = new TextDecoder()
      let result = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        result += decoder.decode(value)
      }

      expect(result).toBe('bob\n30')
    })

    it.concurrent('should handle non-string field values by JSON stringifying them', async () => {
      const mockStream = new ReadableStream({
        start(controller) {
          controller.enqueue(
            new TextEncoder().encode(
              '{"config": {"theme": "dark", "notifications": true}, "count": 42}'
            )
          )
          controller.close()
        },
      })

      const processedStream = processor.processStream(
        mockStream,
        'block-1',
        ['block-1_config', 'block-1_count'],
        {
          schema: { properties: { config: { type: 'object' }, count: { type: 'number' } } },
        }
      )

      const reader = processedStream.getReader()
      const decoder = new TextDecoder()
      let result = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        result += decoder.decode(value)
      }

      expect(result).toBe('{"theme":"dark","notifications":true}\n42')
    })

    it.concurrent('should handle streaming JSON that comes in chunks', async () => {
      const mockStream = new ReadableStream({
        start(controller) {
          // Simulate streaming JSON in chunks
          controller.enqueue(new TextEncoder().encode('{"username": "charlie"'))
          controller.enqueue(new TextEncoder().encode(', "age": 35}'))
          controller.close()
        },
      })

      const processedStream = processor.processStream(mockStream, 'block-1', ['block-1_username'], {
        schema: { properties: { username: { type: 'string' }, age: { type: 'number' } } },
      })

      const reader = processedStream.getReader()
      const decoder = new TextDecoder()
      let result = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        result += decoder.decode(value)
      }

      expect(result).toBe('charlie')
    })

    it.concurrent('should handle missing fields gracefully', async () => {
      const mockStream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('{"username": "diana"}'))
          controller.close()
        },
      })

      const processedStream = processor.processStream(
        mockStream,
        'block-1',
        ['block-1_username', 'block-1_missing_field'],
        { schema: { properties: { username: { type: 'string' } } } }
      )

      const reader = processedStream.getReader()
      const decoder = new TextDecoder()
      let result = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        result += decoder.decode(value)
      }

      expect(result).toBe('diana')
    })

    it.concurrent('should handle invalid JSON gracefully', async () => {
      const mockStream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('invalid json'))
          controller.close()
        },
      })

      const processedStream = processor.processStream(mockStream, 'block-1', ['block-1_username'], {
        schema: { properties: { username: { type: 'string' } } },
      })

      const reader = processedStream.getReader()
      const decoder = new TextDecoder()
      let result = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        result += decoder.decode(value)
      }

      expect(result).toBe('')
    })

    it.concurrent('should filter selected fields for correct block ID', async () => {
      const mockStream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('{"username": "eve", "age": 28}'))
          controller.close()
        },
      })

      const processedStream = processor.processStream(
        mockStream,
        'block-1',
        ['block-1_username', 'block-2_age'], // Different block ID should be filtered out
        { schema: { properties: { username: { type: 'string' }, age: { type: 'number' } } } }
      )

      const reader = processedStream.getReader()
      const decoder = new TextDecoder()
      let result = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        result += decoder.decode(value)
      }

      expect(result).toBe('eve')
    })

    it.concurrent('should handle empty result when no matching fields', async () => {
      const mockStream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('{"other_field": "value"}'))
          controller.close()
        },
      })

      const processedStream = processor.processStream(mockStream, 'block-1', ['block-1_username'], {
        schema: { properties: { username: { type: 'string' } } },
      })

      const reader = processedStream.getReader()
      const decoder = new TextDecoder()
      let result = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        result += decoder.decode(value)
      }

      expect(result).toBe('')
    })
  })

  describe('singleton instance', () => {
    it.concurrent('should export a singleton instance', () => {
      expect(streamingResponseFormatProcessor).toBeInstanceOf(StreamingResponseFormatProcessor)
    })

    it.concurrent('should return the same instance on multiple imports', () => {
      const instance1 = streamingResponseFormatProcessor
      const instance2 = streamingResponseFormatProcessor
      expect(instance1).toBe(instance2)
    })
  })

  describe('edge cases', () => {
    it.concurrent('should handle empty stream', async () => {
      const mockStream = new ReadableStream({
        start(controller) {
          controller.close()
        },
      })

      const processedStream = processor.processStream(mockStream, 'block-1', ['block-1_username'], {
        schema: { properties: { username: { type: 'string' } } },
      })

      const reader = processedStream.getReader()
      const decoder = new TextDecoder()
      let result = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        result += decoder.decode(value)
      }

      expect(result).toBe('')
    })

    it.concurrent('should handle very large JSON objects', async () => {
      const largeObject = {
        username: 'frank',
        data: 'x'.repeat(10000), // Large string
        nested: {
          deep: {
            value: 'test',
          },
        },
      }

      const mockStream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode(JSON.stringify(largeObject)))
          controller.close()
        },
      })

      const processedStream = processor.processStream(mockStream, 'block-1', ['block-1_username'], {
        schema: { properties: { username: { type: 'string' } } },
      })

      const reader = processedStream.getReader()
      const decoder = new TextDecoder()
      let result = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        result += decoder.decode(value)
      }

      expect(result).toBe('frank')
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/executor/utils.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ResponseFormatStreamProcessor } from '@/executor/types'

const logger = createLogger('ExecutorUtils')

/**
 * Processes a streaming response to extract only the selected response format fields
 * instead of streaming the full JSON wrapper.
 */
export class StreamingResponseFormatProcessor implements ResponseFormatStreamProcessor {
  processStream(
    originalStream: ReadableStream,
    blockId: string,
    selectedOutputs: string[],
    responseFormat?: any
  ): ReadableStream {
    const hasResponseFormatSelection = selectedOutputs.some((outputId) => {
      const blockIdForOutput = outputId.includes('_')
        ? outputId.split('_')[0]
        : outputId.split('.')[0]
      return blockIdForOutput === blockId && outputId.includes('_')
    })

    if (!hasResponseFormatSelection || !responseFormat) {
      return originalStream
    }

    const selectedFields = selectedOutputs
      .filter((outputId) => {
        const blockIdForOutput = outputId.includes('_')
          ? outputId.split('_')[0]
          : outputId.split('.')[0]
        return blockIdForOutput === blockId && outputId.includes('_')
      })
      .map((outputId) => outputId.substring(blockId.length + 1))

    logger.info('Processing streaming response format', {
      blockId,
      selectedFields,
      hasResponseFormat: !!responseFormat,
      selectedFieldsCount: selectedFields.length,
    })

    return this.createProcessedStream(originalStream, selectedFields, blockId)
  }

  private createProcessedStream(
    originalStream: ReadableStream,
    selectedFields: string[],
    blockId: string
  ): ReadableStream {
    let buffer = ''
    let hasProcessedComplete = false

    const self = this

    return new ReadableStream({
      async start(controller) {
        const reader = originalStream.getReader()
        const decoder = new TextDecoder()

        try {
          while (true) {
            const { done, value } = await reader.read()

            if (done) {
              if (buffer.trim() && !hasProcessedComplete) {
                self.processCompleteJson(buffer, selectedFields, controller)
              }
              controller.close()
              break
            }

            const chunk = decoder.decode(value, { stream: true })
            buffer += chunk

            if (!hasProcessedComplete) {
              const processedChunk = self.processStreamingChunk(buffer, selectedFields)

              if (processedChunk) {
                controller.enqueue(new TextEncoder().encode(processedChunk))
                hasProcessedComplete = true
              }
            }
          }
        } catch (error) {
          logger.error('Error processing streaming response format:', { error, blockId })
          controller.error(error)
        } finally {
          reader.releaseLock()
        }
      },
    })
  }

  private processStreamingChunk(buffer: string, selectedFields: string[]): string | null {
    try {
      const parsed = JSON.parse(buffer.trim())
      if (typeof parsed === 'object' && parsed !== null) {
        const results: string[] = []
        for (const field of selectedFields) {
          if (field in parsed) {
            const value = parsed[field]
            const formattedValue = typeof value === 'string' ? value : JSON.stringify(value)
            results.push(formattedValue)
          }
        }

        if (results.length > 0) {
          const result = results.join('\n')
          return result
        }

        return null
      }
    } catch (e) {}

    const openBraces = (buffer.match(/\{/g) || []).length
    const closeBraces = (buffer.match(/\}/g) || []).length

    if (openBraces > 0 && openBraces === closeBraces) {
      try {
        const parsed = JSON.parse(buffer.trim())
        if (typeof parsed === 'object' && parsed !== null) {
          const results: string[] = []
          for (const field of selectedFields) {
            if (field in parsed) {
              const value = parsed[field]
              const formattedValue = typeof value === 'string' ? value : JSON.stringify(value)
              results.push(formattedValue)
            }
          }

          if (results.length > 0) {
            const result = results.join('\n')
            return result
          }

          return null
        }
      } catch (e) {}
    }

    return null
  }

  private processCompleteJson(
    buffer: string,
    selectedFields: string[],
    controller: ReadableStreamDefaultController
  ): void {
    try {
      const parsed = JSON.parse(buffer.trim())
      if (typeof parsed === 'object' && parsed !== null) {
        const results: string[] = []
        for (const field of selectedFields) {
          if (field in parsed) {
            const value = parsed[field]
            const formattedValue = typeof value === 'string' ? value : JSON.stringify(value)
            results.push(formattedValue)
          }
        }

        if (results.length > 0) {
          const result = results.join('\n')
          controller.enqueue(new TextEncoder().encode(result))
        }
      }
    } catch (error) {
      logger.warn('Failed to parse complete JSON in streaming processor:', { error })
    }
  }
}

export const streamingResponseFormatProcessor = new StreamingResponseFormatProcessor()
```

--------------------------------------------------------------------------------

---[FILE: builder.test.ts]---
Location: sim-main/apps/sim/executor/dag/builder.test.ts

```typescript
import { describe, expect, it, vi } from 'vitest'
import { BlockType } from '@/executor/constants'
import { DAGBuilder } from '@/executor/dag/builder'
import type { SerializedBlock, SerializedWorkflow } from '@/serializer/types'

vi.mock('@/lib/logs/console/logger', () => ({
  createLogger: vi.fn().mockReturnValue({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }),
}))

function createBlock(id: string, metadataId: string): SerializedBlock {
  return {
    id,
    position: { x: 0, y: 0 },
    config: {
      tool: 'noop',
      params: {},
    },
    inputs: {},
    outputs: {},
    metadata: {
      id: metadataId,
      name: id,
    },
    enabled: true,
  }
}

describe('DAGBuilder human-in-the-loop transformation', () => {
  it('creates trigger nodes and rewires edges for pause blocks', () => {
    const workflow: SerializedWorkflow = {
      version: '1',
      blocks: [
        createBlock('start', BlockType.STARTER),
        createBlock('pause', BlockType.HUMAN_IN_THE_LOOP),
        createBlock('finish', BlockType.FUNCTION),
      ],
      connections: [
        { source: 'start', target: 'pause' },
        { source: 'pause', target: 'finish' },
      ],
      loops: {},
    }

    const builder = new DAGBuilder()
    const dag = builder.build(workflow)

    const pauseNode = dag.nodes.get('pause')
    expect(pauseNode).toBeDefined()
    expect(pauseNode?.metadata.isPauseResponse).toBe(true)

    const startNode = dag.nodes.get('start')!
    const startOutgoing = Array.from(startNode.outgoingEdges.values())
    expect(startOutgoing).toHaveLength(1)
    expect(startOutgoing[0].target).toBe('pause')

    const pauseOutgoing = Array.from(pauseNode!.outgoingEdges.values())
    expect(pauseOutgoing).toHaveLength(1)
    expect(pauseOutgoing[0].target).toBe('finish')

    const triggerNode = dag.nodes.get('pause__trigger')
    expect(triggerNode).toBeUndefined()
  })
})
```

--------------------------------------------------------------------------------

---[FILE: builder.ts]---
Location: sim-main/apps/sim/executor/dag/builder.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import { EdgeConstructor } from '@/executor/dag/construction/edges'
import { LoopConstructor } from '@/executor/dag/construction/loops'
import { NodeConstructor } from '@/executor/dag/construction/nodes'
import { PathConstructor } from '@/executor/dag/construction/paths'
import type { DAGEdge, NodeMetadata } from '@/executor/dag/types'
import type {
  SerializedBlock,
  SerializedLoop,
  SerializedParallel,
  SerializedWorkflow,
} from '@/serializer/types'

const logger = createLogger('DAGBuilder')

export interface DAGNode {
  id: string
  block: SerializedBlock
  incomingEdges: Set<string>
  outgoingEdges: Map<string, DAGEdge>
  metadata: NodeMetadata
}

export interface DAG {
  nodes: Map<string, DAGNode>
  loopConfigs: Map<string, SerializedLoop>
  parallelConfigs: Map<string, SerializedParallel>
}

export class DAGBuilder {
  private pathConstructor = new PathConstructor()
  private loopConstructor = new LoopConstructor()
  private nodeConstructor = new NodeConstructor()
  private edgeConstructor = new EdgeConstructor()

  build(
    workflow: SerializedWorkflow,
    triggerBlockId?: string,
    savedIncomingEdges?: Record<string, string[]>
  ): DAG {
    const dag: DAG = {
      nodes: new Map(),
      loopConfigs: new Map(),
      parallelConfigs: new Map(),
    }

    this.initializeConfigs(workflow, dag)

    const reachableBlocks = this.pathConstructor.execute(workflow, triggerBlockId)

    this.loopConstructor.execute(dag, reachableBlocks)

    const { blocksInLoops, blocksInParallels, pauseTriggerMapping } = this.nodeConstructor.execute(
      workflow,
      dag,
      reachableBlocks
    )

    this.edgeConstructor.execute(
      workflow,
      dag,
      blocksInParallels,
      blocksInLoops,
      reachableBlocks,
      pauseTriggerMapping
    )

    if (savedIncomingEdges) {
      logger.info('Restoring DAG incoming edges from snapshot', {
        nodeCount: Object.keys(savedIncomingEdges).length,
      })

      for (const [nodeId, incomingEdgeArray] of Object.entries(savedIncomingEdges)) {
        const node = dag.nodes.get(nodeId)

        if (node) {
          node.incomingEdges = new Set(incomingEdgeArray)
        }
      }
    }

    logger.info('DAG built', {
      totalNodes: dag.nodes.size,
      loopCount: dag.loopConfigs.size,
      parallelCount: dag.parallelConfigs.size,
      allNodeIds: Array.from(dag.nodes.keys()),
      triggerNodes: Array.from(dag.nodes.values())
        .filter((n) => n.metadata?.isResumeTrigger)
        .map((n) => ({ id: n.id, originalBlockId: n.metadata?.originalBlockId })),
    })

    return dag
  }

  private initializeConfigs(workflow: SerializedWorkflow, dag: DAG): void {
    if (workflow.loops) {
      for (const [loopId, loopConfig] of Object.entries(workflow.loops)) {
        dag.loopConfigs.set(loopId, loopConfig)
      }
    }

    if (workflow.parallels) {
      for (const [parallelId, parallelConfig] of Object.entries(workflow.parallels)) {
        dag.parallelConfigs.set(parallelId, parallelConfig)
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/executor/dag/types.ts

```typescript
export interface DAGEdge {
  target: string
  sourceHandle?: string
  targetHandle?: string
  isActive?: boolean
}

export interface NodeMetadata {
  isParallelBranch?: boolean
  parallelId?: string
  branchIndex?: number
  branchTotal?: number
  distributionItem?: unknown
  isLoopNode?: boolean
  loopId?: string
  isSentinel?: boolean
  sentinelType?: 'start' | 'end'
  isPauseResponse?: boolean
  isResumeTrigger?: boolean
  originalBlockId?: string
}
```

--------------------------------------------------------------------------------

---[FILE: edges.ts]---
Location: sim-main/apps/sim/executor/dag/construction/edges.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import { EDGE, isConditionBlockType, isRouterBlockType } from '@/executor/constants'
import type { DAG } from '@/executor/dag/builder'
import {
  buildBranchNodeId,
  buildSentinelEndId,
  buildSentinelStartId,
  calculateBranchCount,
  extractBaseBlockId,
  parseDistributionItems,
} from '@/executor/utils/subflow-utils'
import type { SerializedWorkflow } from '@/serializer/types'

const logger = createLogger('EdgeConstructor')

interface ConditionConfig {
  id: string
  label?: string
  condition: string
}

interface EdgeMetadata {
  blockTypeMap: Map<string, string>
  conditionConfigMap: Map<string, ConditionConfig[]>
  routerBlockIds: Set<string>
}

export class EdgeConstructor {
  execute(
    workflow: SerializedWorkflow,
    dag: DAG,
    blocksInParallels: Set<string>,
    blocksInLoops: Set<string>,
    reachableBlocks: Set<string>,
    pauseTriggerMapping: Map<string, string>
  ): void {
    const loopBlockIds = new Set(dag.loopConfigs.keys())
    const parallelBlockIds = new Set(dag.parallelConfigs.keys())
    const metadata = this.buildMetadataMaps(workflow)

    this.wireRegularEdges(
      workflow,
      dag,
      blocksInParallels,
      blocksInLoops,
      reachableBlocks,
      loopBlockIds,
      parallelBlockIds,
      metadata,
      pauseTriggerMapping
    )

    this.wireLoopSentinels(dag, reachableBlocks)
    this.wireParallelBlocks(workflow, dag, loopBlockIds, parallelBlockIds, pauseTriggerMapping)
  }

  private buildMetadataMaps(workflow: SerializedWorkflow): EdgeMetadata {
    const blockTypeMap = new Map<string, string>()
    const conditionConfigMap = new Map<string, ConditionConfig[]>()
    const routerBlockIds = new Set<string>()

    for (const block of workflow.blocks) {
      const blockType = block.metadata?.id ?? ''
      blockTypeMap.set(block.id, blockType)

      if (isConditionBlockType(blockType)) {
        const conditions = this.parseConditionConfig(block)

        if (conditions) {
          conditionConfigMap.set(block.id, conditions)
        }
      } else if (isRouterBlockType(blockType)) {
        routerBlockIds.add(block.id)
      }
    }

    return { blockTypeMap, conditionConfigMap, routerBlockIds }
  }

  private parseConditionConfig(block: any): ConditionConfig[] | null {
    try {
      const conditionsJson = block.config.params?.conditions

      if (typeof conditionsJson === 'string') {
        return JSON.parse(conditionsJson)
      }

      if (Array.isArray(conditionsJson)) {
        return conditionsJson
      }

      return null
    } catch (error) {
      logger.warn('Failed to parse condition config', {
        blockId: block.id,
        error: error instanceof Error ? error.message : String(error),
      })

      return null
    }
  }

  private generateSourceHandle(
    source: string,
    target: string,
    sourceHandle: string | undefined,
    metadata: EdgeMetadata,
    workflow: SerializedWorkflow
  ): string | undefined {
    let handle = sourceHandle

    if (!handle && isConditionBlockType(metadata.blockTypeMap.get(source) ?? '')) {
      const conditions = metadata.conditionConfigMap.get(source)

      if (conditions && conditions.length > 0) {
        const edgesFromCondition = workflow.connections.filter((c) => c.source === source)
        const edgeIndex = edgesFromCondition.findIndex((e) => e.target === target)

        if (edgeIndex >= 0 && edgeIndex < conditions.length) {
          const correspondingCondition = conditions[edgeIndex]
          handle = `${EDGE.CONDITION_PREFIX}${correspondingCondition.id}`
        }
      }
    }

    if (metadata.routerBlockIds.has(source) && handle !== EDGE.ERROR) {
      handle = `${EDGE.ROUTER_PREFIX}${target}`
    }

    return handle
  }

  private wireRegularEdges(
    workflow: SerializedWorkflow,
    dag: DAG,
    blocksInParallels: Set<string>,
    blocksInLoops: Set<string>,
    reachableBlocks: Set<string>,
    loopBlockIds: Set<string>,
    parallelBlockIds: Set<string>,
    metadata: EdgeMetadata,
    pauseTriggerMapping: Map<string, string>
  ): void {
    for (const connection of workflow.connections) {
      let { source, target } = connection
      const originalSource = source
      let sourceHandle = this.generateSourceHandle(
        source,
        target,
        connection.sourceHandle,
        metadata,
        workflow
      )
      const targetHandle = connection.targetHandle
      const sourceIsLoopBlock = loopBlockIds.has(source)
      const targetIsLoopBlock = loopBlockIds.has(target)
      const sourceIsParallelBlock = parallelBlockIds.has(source)
      const targetIsParallelBlock = parallelBlockIds.has(target)

      if (
        sourceIsLoopBlock ||
        targetIsLoopBlock ||
        sourceIsParallelBlock ||
        targetIsParallelBlock
      ) {
        let loopSentinelStartId: string | undefined

        if (sourceIsLoopBlock) {
          const sentinelEndId = buildSentinelEndId(originalSource)
          loopSentinelStartId = buildSentinelStartId(originalSource)

          if (!dag.nodes.has(sentinelEndId) || !dag.nodes.has(loopSentinelStartId)) {
            continue
          }

          source = sentinelEndId
          sourceHandle = EDGE.LOOP_EXIT
        }

        if (targetIsLoopBlock) {
          const sentinelStartId = buildSentinelStartId(target)

          if (!dag.nodes.has(sentinelStartId)) {
            continue
          }

          target = sentinelStartId
        }

        if (loopSentinelStartId) {
          this.addEdge(dag, loopSentinelStartId, target, EDGE.LOOP_EXIT, targetHandle)
        }

        if (sourceIsParallelBlock || targetIsParallelBlock) {
          continue
        }
      }

      if (this.edgeCrossesLoopBoundary(source, target, blocksInLoops, dag)) {
        continue
      }

      if (!this.isEdgeReachable(source, target, reachableBlocks, dag)) {
        continue
      }

      if (blocksInParallels.has(source) && blocksInParallels.has(target)) {
        const sourceParallelId = this.getParallelId(source, dag)
        const targetParallelId = this.getParallelId(target, dag)

        if (sourceParallelId === targetParallelId) {
          this.wireParallelInternalEdge(
            source,
            target,
            sourceParallelId!,
            dag,
            sourceHandle,
            targetHandle,
            pauseTriggerMapping
          )
        } else {
          logger.warn('Edge between different parallels - invalid workflow', { source, target })
        }
      } else if (blocksInParallels.has(source) || blocksInParallels.has(target)) {
      } else {
        const resolvedSource = pauseTriggerMapping.get(originalSource) ?? source
        this.addEdge(dag, resolvedSource, target, sourceHandle, targetHandle)
      }
    }
  }

  private wireLoopSentinels(dag: DAG, reachableBlocks: Set<string>): void {
    for (const [loopId, loopConfig] of dag.loopConfigs) {
      const nodes = loopConfig.nodes

      if (nodes.length === 0) continue

      const sentinelStartId = buildSentinelStartId(loopId)
      const sentinelEndId = buildSentinelEndId(loopId)

      if (!dag.nodes.has(sentinelStartId) || !dag.nodes.has(sentinelEndId)) {
        continue
      }

      const { startNodes, terminalNodes } = this.findLoopBoundaryNodes(nodes, dag, reachableBlocks)

      for (const startNodeId of startNodes) {
        this.addEdge(dag, sentinelStartId, startNodeId)
      }

      for (const terminalNodeId of terminalNodes) {
        this.addEdge(dag, terminalNodeId, sentinelEndId)
      }

      this.addEdge(dag, sentinelEndId, sentinelStartId, EDGE.LOOP_CONTINUE, undefined, true)
    }
  }

  private wireParallelBlocks(
    workflow: SerializedWorkflow,
    dag: DAG,
    loopBlockIds: Set<string>,
    parallelBlockIds: Set<string>,
    pauseTriggerMapping: Map<string, string>
  ): void {
    for (const [parallelId, parallelConfig] of dag.parallelConfigs) {
      const nodes = parallelConfig.nodes

      if (nodes.length === 0) continue

      const { entryNodes, terminalNodes, branchCount } = this.findParallelBoundaryNodes(
        nodes,
        parallelId,
        dag
      )

      logger.info('Wiring parallel block edges', {
        parallelId,
        entryNodes,
        terminalNodes,
        branchCount,
      })

      for (const connection of workflow.connections) {
        const { source, target, sourceHandle, targetHandle } = connection

        if (target === parallelId) {
          if (loopBlockIds.has(source) || parallelBlockIds.has(source)) continue

          if (nodes.includes(source)) {
            logger.warn('Invalid: parallel block connected from its own internal node', {
              parallelId,
              source,
            })
            continue
          }

          logger.info('Wiring edge to parallel block', { source, parallelId, entryNodes })

          for (const entryNodeId of entryNodes) {
            for (let i = 0; i < branchCount; i++) {
              const branchNodeId = buildBranchNodeId(entryNodeId, i)

              if (dag.nodes.has(branchNodeId)) {
                this.addEdge(dag, source, branchNodeId, sourceHandle, targetHandle)
              }
            }
          }
        }

        if (source === parallelId) {
          if (loopBlockIds.has(target) || parallelBlockIds.has(target)) continue

          if (nodes.includes(target)) {
            logger.warn('Invalid: parallel block connected to its own internal node', {
              parallelId,
              target,
            })
            continue
          }

          logger.info('Wiring edge from parallel block', { parallelId, target, terminalNodes })

          for (const terminalNodeId of terminalNodes) {
            for (let i = 0; i < branchCount; i++) {
              const branchNodeId = buildBranchNodeId(terminalNodeId, i)

              if (dag.nodes.has(branchNodeId)) {
                const resolvedSourceId = pauseTriggerMapping.get(branchNodeId) ?? branchNodeId
                this.addEdge(dag, resolvedSourceId, target, sourceHandle, targetHandle)
              }
            }
          }
        }
      }
    }
  }

  private edgeCrossesLoopBoundary(
    source: string,
    target: string,
    blocksInLoops: Set<string>,
    dag: DAG
  ): boolean {
    const sourceInLoop = blocksInLoops.has(source)
    const targetInLoop = blocksInLoops.has(target)

    if (sourceInLoop !== targetInLoop) {
      return true
    }

    if (!sourceInLoop && !targetInLoop) {
      return false
    }

    let sourceLoopId: string | undefined
    let targetLoopId: string | undefined

    for (const [loopId, loopConfig] of dag.loopConfigs) {
      if (loopConfig.nodes.includes(source)) {
        sourceLoopId = loopId
      }

      if (loopConfig.nodes.includes(target)) {
        targetLoopId = loopId
      }
    }

    return sourceLoopId !== targetLoopId
  }

  private isEdgeReachable(
    source: string,
    target: string,
    reachableBlocks: Set<string>,
    dag: DAG
  ): boolean {
    if (!reachableBlocks.has(source) && !dag.nodes.has(source)) {
      return false
    }
    if (!reachableBlocks.has(target) && !dag.nodes.has(target)) {
      return false
    }
    return true
  }

  private wireParallelInternalEdge(
    source: string,
    target: string,
    parallelId: string,
    dag: DAG,
    sourceHandle?: string,
    targetHandle?: string,
    pauseTriggerMapping?: Map<string, string>
  ): void {
    const parallelConfig = dag.parallelConfigs.get(parallelId)

    if (!parallelConfig) {
      throw new Error(`Parallel config not found: ${parallelId}`)
    }

    const distributionItems = parseDistributionItems(parallelConfig)
    const count = calculateBranchCount(parallelConfig, distributionItems)

    for (let i = 0; i < count; i++) {
      const sourceNodeId = buildBranchNodeId(source, i)
      const targetNodeId = buildBranchNodeId(target, i)
      const resolvedSourceId = pauseTriggerMapping?.get(sourceNodeId) ?? sourceNodeId
      this.addEdge(dag, resolvedSourceId, targetNodeId, sourceHandle, targetHandle)
    }
  }

  private findLoopBoundaryNodes(
    nodes: string[],
    dag: DAG,
    reachableBlocks: Set<string>
  ): { startNodes: string[]; terminalNodes: string[] } {
    const nodesSet = new Set(nodes)
    const startNodesSet = new Set<string>()
    const terminalNodesSet = new Set<string>()

    for (const nodeId of nodes) {
      const node = dag.nodes.get(nodeId)

      if (!node) continue

      let hasIncomingFromLoop = false

      for (const incomingNodeId of node.incomingEdges) {
        if (nodesSet.has(incomingNodeId)) {
          hasIncomingFromLoop = true
          break
        }
      }

      if (!hasIncomingFromLoop) {
        startNodesSet.add(nodeId)
      }
    }

    for (const nodeId of nodes) {
      const node = dag.nodes.get(nodeId)

      if (!node) continue

      let hasOutgoingToLoop = false

      for (const [_, edge] of node.outgoingEdges) {
        if (nodesSet.has(edge.target)) {
          hasOutgoingToLoop = true
          break
        }
      }

      if (!hasOutgoingToLoop) {
        terminalNodesSet.add(nodeId)
      }
    }

    return {
      startNodes: Array.from(startNodesSet),
      terminalNodes: Array.from(terminalNodesSet),
    }
  }

  private findParallelBoundaryNodes(
    nodes: string[],
    parallelId: string,
    dag: DAG
  ): { entryNodes: string[]; terminalNodes: string[]; branchCount: number } {
    const nodesSet = new Set(nodes)
    const entryNodesSet = new Set<string>()
    const terminalNodesSet = new Set<string>()
    const parallelConfig = dag.parallelConfigs.get(parallelId)

    if (!parallelConfig) {
      throw new Error(`Parallel config not found: ${parallelId}`)
    }

    const distributionItems = parseDistributionItems(parallelConfig)
    const branchCount = calculateBranchCount(parallelConfig, distributionItems)

    for (const nodeId of nodes) {
      let hasAnyBranch = false

      for (let i = 0; i < branchCount; i++) {
        if (dag.nodes.has(buildBranchNodeId(nodeId, i))) {
          hasAnyBranch = true
          break
        }
      }

      if (!hasAnyBranch) continue

      const firstBranchId = buildBranchNodeId(nodeId, 0)
      const firstBranchNode = dag.nodes.get(firstBranchId)

      if (!firstBranchNode) continue

      let hasIncomingFromParallel = false

      for (const incomingNodeId of firstBranchNode.incomingEdges) {
        const originalNodeId = extractBaseBlockId(incomingNodeId)

        if (nodesSet.has(originalNodeId)) {
          hasIncomingFromParallel = true
          break
        }
      }

      if (!hasIncomingFromParallel) {
        entryNodesSet.add(nodeId)
      }
    }

    for (const nodeId of nodes) {
      let hasAnyBranch = false

      for (let i = 0; i < branchCount; i++) {
        if (dag.nodes.has(buildBranchNodeId(nodeId, i))) {
          hasAnyBranch = true
          break
        }
      }

      if (!hasAnyBranch) continue

      const firstBranchId = buildBranchNodeId(nodeId, 0)
      const firstBranchNode = dag.nodes.get(firstBranchId)

      if (!firstBranchNode) continue

      let hasOutgoingToParallel = false

      for (const [_, edge] of firstBranchNode.outgoingEdges) {
        const originalTargetId = extractBaseBlockId(edge.target)

        if (nodesSet.has(originalTargetId)) {
          hasOutgoingToParallel = true
          break
        }
      }

      if (!hasOutgoingToParallel) {
        terminalNodesSet.add(nodeId)
      }
    }

    return {
      entryNodes: Array.from(entryNodesSet),
      terminalNodes: Array.from(terminalNodesSet),
      branchCount,
    }
  }

  private getParallelId(blockId: string, dag: DAG): string | null {
    for (const [parallelId, parallelConfig] of dag.parallelConfigs) {
      if (parallelConfig.nodes.includes(blockId)) {
        return parallelId
      }
    }
    return null
  }

  private addEdge(
    dag: DAG,
    sourceId: string,
    targetId: string,
    sourceHandle?: string,
    targetHandle?: string,
    isLoopBackEdge = false
  ): void {
    const sourceNode = dag.nodes.get(sourceId)
    const targetNode = dag.nodes.get(targetId)

    if (!sourceNode || !targetNode) {
      logger.warn('Edge references non-existent node', { sourceId, targetId })
      return
    }

    const edgeId = `${sourceId}→${targetId}`

    sourceNode.outgoingEdges.set(edgeId, {
      target: targetId,
      sourceHandle,
      targetHandle,
      isActive: isLoopBackEdge ? false : undefined,
    })

    if (!isLoopBackEdge) {
      targetNode.incomingEdges.add(sourceId)
    }
  }
}
```

--------------------------------------------------------------------------------

````
