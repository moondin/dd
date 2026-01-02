---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 643
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 643 of 933)

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

---[FILE: store.ts]---
Location: sim-main/apps/sim/stores/workflows/subblock/store.ts

```typescript
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { createLogger } from '@/lib/logs/console/logger'
import { getBlock } from '@/blocks'
import type { SubBlockConfig } from '@/blocks/types'
import { populateTriggerFieldsFromConfig } from '@/hooks/use-trigger-config-aggregation'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'
import type { SubBlockStore } from '@/stores/workflows/subblock/types'
import { isTriggerValid } from '@/triggers'

const logger = createLogger('SubBlockStore')

/**
 * SubBlockState stores values for all subblocks in workflows
 *
 * Important implementation notes:
 * 1. Values are stored per workflow, per block, per subblock
 * 2. When workflows are synced to the database, the mergeSubblockState function
 *    in utils.ts combines the block structure with these values
 * 3. If a subblock value exists here but not in the block structure
 *    (e.g., inputFormat in starter block), the merge function will include it
 *    in the synchronized state to ensure persistence
 */

export const useSubBlockStore = create<SubBlockStore>()(
  devtools((set, get) => ({
    workflowValues: {},
    loadingWebhooks: new Set<string>(),
    checkedWebhooks: new Set<string>(),
    loadingSchedules: new Set<string>(),
    checkedSchedules: new Set<string>(),

    setValue: (blockId: string, subBlockId: string, value: any) => {
      const activeWorkflowId = useWorkflowRegistry.getState().activeWorkflowId
      if (!activeWorkflowId) return

      let validatedValue = value
      if (Array.isArray(value)) {
        const isTableData =
          value.length > 0 &&
          value.some((item) => item && typeof item === 'object' && 'cells' in item)

        if (isTableData) {
          logger.debug('Validating table data for subblock', { blockId, subBlockId })
          validatedValue = value.map((row: any) => {
            if (!row || typeof row !== 'object') {
              logger.warn('Fixing malformed table row', { blockId, subBlockId, row })
              return {
                id: crypto.randomUUID(),
                cells: { Key: '', Value: '' },
              }
            }

            if (!row.id) {
              row.id = crypto.randomUUID()
            }

            if (!row.cells || typeof row.cells !== 'object') {
              logger.warn('Fixing malformed table row cells', { blockId, subBlockId, row })
              row.cells = { Key: '', Value: '' }
            }

            return row
          })
        }
      }

      set((state) => ({
        workflowValues: {
          ...state.workflowValues,
          [activeWorkflowId]: {
            ...state.workflowValues[activeWorkflowId],
            [blockId]: {
              ...state.workflowValues[activeWorkflowId]?.[blockId],
              [subBlockId]: validatedValue,
            },
          },
        },
      }))
    },

    getValue: (blockId: string, subBlockId: string) => {
      const activeWorkflowId = useWorkflowRegistry.getState().activeWorkflowId
      if (!activeWorkflowId) return null

      return get().workflowValues[activeWorkflowId]?.[blockId]?.[subBlockId] ?? null
    },

    clear: () => {
      const activeWorkflowId = useWorkflowRegistry.getState().activeWorkflowId
      if (!activeWorkflowId) return

      set((state) => ({
        workflowValues: {
          ...state.workflowValues,
          [activeWorkflowId]: {},
        },
      }))
    },

    initializeFromWorkflow: (workflowId: string, blocks: Record<string, any>) => {
      const values: Record<string, Record<string, any>> = {}

      Object.entries(blocks).forEach(([blockId, block]) => {
        values[blockId] = {}
        Object.entries(block.subBlocks || {}).forEach(([subBlockId, subBlock]) => {
          values[blockId][subBlockId] = (subBlock as SubBlockConfig).value
        })
      })

      set((state) => ({
        workflowValues: {
          ...state.workflowValues,
          [workflowId]: values,
        },
      }))

      Object.entries(blocks).forEach(([blockId, block]) => {
        const blockConfig = getBlock(block.type)
        if (!blockConfig) return

        const isTriggerBlock = blockConfig.category === 'triggers' || block.triggerMode === true
        if (!isTriggerBlock) return

        let triggerId: string | undefined
        if (blockConfig.category === 'triggers') {
          triggerId = block.type
        } else if (block.triggerMode === true && blockConfig.triggers?.enabled) {
          const selectedTriggerIdValue = block.subBlocks?.selectedTriggerId?.value
          const triggerIdValue = block.subBlocks?.triggerId?.value
          triggerId =
            (typeof selectedTriggerIdValue === 'string' && isTriggerValid(selectedTriggerIdValue)
              ? selectedTriggerIdValue
              : undefined) ||
            (typeof triggerIdValue === 'string' && isTriggerValid(triggerIdValue)
              ? triggerIdValue
              : undefined) ||
            blockConfig.triggers?.available?.[0]
        }

        if (!triggerId || !isTriggerValid(triggerId)) {
          return
        }

        const triggerConfigSubBlock = block.subBlocks?.triggerConfig
        if (triggerConfigSubBlock?.value && typeof triggerConfigSubBlock.value === 'object') {
          populateTriggerFieldsFromConfig(blockId, triggerConfigSubBlock.value, triggerId)

          const currentChecked = get().checkedWebhooks
          if (currentChecked.has(blockId)) {
            set((state) => {
              const newSet = new Set(state.checkedWebhooks)
              newSet.delete(blockId)
              return { checkedWebhooks: newSet }
            })
          }
        }
      })
    },
    setWorkflowValues: (workflowId: string, values: Record<string, Record<string, any>>) => {
      set((state) => ({
        workflowValues: {
          ...state.workflowValues,
          [workflowId]: values,
        },
      }))
    },
  }))
)
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/stores/workflows/subblock/types.ts

```typescript
export interface SubBlockState {
  workflowValues: Record<string, Record<string, Record<string, any>>> // Store values per workflow ID
  loadingWebhooks: Set<string> // Track which blockIds are currently loading webhooks
  checkedWebhooks: Set<string> // Track which blockIds have been checked for webhooks
  loadingSchedules: Set<string> // Track which blockIds are currently loading schedules
  checkedSchedules: Set<string> // Track which blockIds have been checked for schedules
}

export interface SubBlockStore extends SubBlockState {
  setValue: (blockId: string, subBlockId: string, value: any) => void
  getValue: (blockId: string, subBlockId: string) => any
  clear: () => void
  initializeFromWorkflow: (workflowId: string, blocks: Record<string, any>) => void
  setWorkflowValues: (workflowId: string, values: Record<string, Record<string, any>>) => void
}
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/stores/workflows/subblock/utils.ts

```typescript
// DEPRECATED: useEnvironmentStore import removed as autofill functions were removed

/**
 * Checks if a value is an environment variable reference in the format {{ENV_VAR}}
 */
export const isEnvVarReference = (value: string): boolean => {
  // Check if the value looks like {{ENV_VAR}}
  return /^\{\{[a-zA-Z0-9_-]+\}\}$/.test(value)
}

/**
 * Extracts the environment variable name from a reference like {{ENV_VAR}}
 */
export const extractEnvVarName = (value: string): string | null => {
  if (!isEnvVarReference(value)) return null
  return value.slice(2, -2)
}
```

--------------------------------------------------------------------------------

---[FILE: store.test.ts]---
Location: sim-main/apps/sim/stores/workflows/workflow/store.test.ts

```typescript
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'
import { useSubBlockStore } from '@/stores/workflows/subblock/store'
import { useWorkflowStore } from '@/stores/workflows/workflow/store'

describe('workflow store', () => {
  beforeEach(() => {
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    }
    global.localStorage = localStorageMock as any

    useWorkflowStore.setState({
      blocks: {},
      edges: [],
      loops: {},
      parallels: {},
    })
  })

  describe('loop management', () => {
    it.concurrent('should regenerate loops when updateLoopCount is called', () => {
      const { addBlock, updateLoopCount } = useWorkflowStore.getState()

      addBlock(
        'loop1',
        'loop',
        'Test Loop',
        { x: 0, y: 0 },
        {
          loopType: 'for',
          count: 5,
          collection: '',
        }
      )

      updateLoopCount('loop1', 10)

      const state = useWorkflowStore.getState()

      expect(state.blocks.loop1?.data?.count).toBe(10)

      expect(state.loops.loop1).toBeDefined()
      expect(state.loops.loop1.iterations).toBe(10)
    })

    it.concurrent('should regenerate loops when updateLoopType is called', () => {
      const { addBlock, updateLoopType } = useWorkflowStore.getState()

      addBlock(
        'loop1',
        'loop',
        'Test Loop',
        { x: 0, y: 0 },
        {
          loopType: 'for',
          count: 5,
          collection: '["a", "b", "c"]',
        }
      )

      updateLoopType('loop1', 'forEach')

      const state = useWorkflowStore.getState()

      expect(state.blocks.loop1?.data?.loopType).toBe('forEach')

      expect(state.loops.loop1).toBeDefined()
      expect(state.loops.loop1.loopType).toBe('forEach')
      expect(state.loops.loop1.forEachItems).toBe('["a", "b", "c"]')
    })

    it.concurrent('should regenerate loops when updateLoopCollection is called', () => {
      const { addBlock, updateLoopCollection } = useWorkflowStore.getState()

      addBlock(
        'loop1',
        'loop',
        'Test Loop',
        { x: 0, y: 0 },
        {
          loopType: 'forEach',
          collection: '["item1", "item2"]',
        }
      )

      updateLoopCollection('loop1', '["item1", "item2", "item3"]')

      const state = useWorkflowStore.getState()

      expect(state.blocks.loop1?.data?.collection).toBe('["item1", "item2", "item3"]')

      expect(state.loops.loop1).toBeDefined()
      expect(state.loops.loop1.forEachItems).toBe('["item1", "item2", "item3"]')
    })

    it.concurrent('should clamp loop count between 1 and 1000', () => {
      const { addBlock, updateLoopCount } = useWorkflowStore.getState()

      addBlock(
        'loop1',
        'loop',
        'Test Loop',
        { x: 0, y: 0 },
        {
          loopType: 'for',
          count: 5,
          collection: '',
        }
      )

      updateLoopCount('loop1', 1500)
      let state = useWorkflowStore.getState()
      expect(state.blocks.loop1?.data?.count).toBe(1000)

      updateLoopCount('loop1', 0)
      state = useWorkflowStore.getState()
      expect(state.blocks.loop1?.data?.count).toBe(1)
    })
  })

  describe('parallel management', () => {
    it.concurrent('should regenerate parallels when updateParallelCount is called', () => {
      const { addBlock, updateParallelCount } = useWorkflowStore.getState()

      addBlock(
        'parallel1',
        'parallel',
        'Test Parallel',
        { x: 0, y: 0 },
        {
          count: 3,
          collection: '',
        }
      )

      updateParallelCount('parallel1', 5)

      const state = useWorkflowStore.getState()

      expect(state.blocks.parallel1?.data?.count).toBe(5)

      expect(state.parallels.parallel1).toBeDefined()
      expect(state.parallels.parallel1.distribution).toBe('')
    })

    it.concurrent('should regenerate parallels when updateParallelCollection is called', () => {
      const { addBlock, updateParallelCollection } = useWorkflowStore.getState()

      addBlock(
        'parallel1',
        'parallel',
        'Test Parallel',
        { x: 0, y: 0 },
        {
          count: 3,
          collection: '["item1", "item2"]',
          parallelType: 'collection',
        }
      )

      updateParallelCollection('parallel1', '["item1", "item2", "item3"]')

      const state = useWorkflowStore.getState()

      expect(state.blocks.parallel1?.data?.collection).toBe('["item1", "item2", "item3"]')

      expect(state.parallels.parallel1).toBeDefined()
      expect(state.parallels.parallel1.distribution).toBe('["item1", "item2", "item3"]')

      const parsedDistribution = JSON.parse(state.parallels.parallel1.distribution as string)
      expect(parsedDistribution).toHaveLength(3)
    })

    it.concurrent('should clamp parallel count between 1 and 20', () => {
      const { addBlock, updateParallelCount } = useWorkflowStore.getState()

      addBlock(
        'parallel1',
        'parallel',
        'Test Parallel',
        { x: 0, y: 0 },
        {
          count: 5,
          collection: '',
        }
      )

      updateParallelCount('parallel1', 100)
      let state = useWorkflowStore.getState()
      expect(state.blocks.parallel1?.data?.count).toBe(20)

      updateParallelCount('parallel1', 0)
      state = useWorkflowStore.getState()
      expect(state.blocks.parallel1?.data?.count).toBe(1)
    })

    it.concurrent('should regenerate parallels when updateParallelType is called', () => {
      const { addBlock, updateParallelType } = useWorkflowStore.getState()

      addBlock(
        'parallel1',
        'parallel',
        'Test Parallel',
        { x: 0, y: 0 },
        {
          parallelType: 'collection',
          count: 3,
          collection: '["a", "b", "c"]',
        }
      )

      updateParallelType('parallel1', 'count')

      const state = useWorkflowStore.getState()

      expect(state.blocks.parallel1?.data?.parallelType).toBe('count')

      expect(state.parallels.parallel1).toBeDefined()
      expect(state.parallels.parallel1.parallelType).toBe('count')
    })
  })

  describe('mode switching', () => {
    it.concurrent('should toggle advanced mode on a block', () => {
      const { addBlock, toggleBlockAdvancedMode } = useWorkflowStore.getState()

      addBlock('agent1', 'agent', 'Test Agent', { x: 0, y: 0 })

      let state = useWorkflowStore.getState()
      expect(state.blocks.agent1?.advancedMode).toBe(false)

      toggleBlockAdvancedMode('agent1')
      state = useWorkflowStore.getState()
      expect(state.blocks.agent1?.advancedMode).toBe(true)

      toggleBlockAdvancedMode('agent1')
      state = useWorkflowStore.getState()
      expect(state.blocks.agent1?.advancedMode).toBe(false)
    })

    it.concurrent('should preserve systemPrompt and userPrompt when switching modes', () => {
      const { addBlock, toggleBlockAdvancedMode } = useWorkflowStore.getState()
      const { setState: setSubBlockState } = useSubBlockStore
      useWorkflowRegistry.setState({ activeWorkflowId: 'test-workflow' })
      addBlock('agent1', 'agent', 'Test Agent', { x: 0, y: 0 })
      setSubBlockState({
        workflowValues: {
          'test-workflow': {
            agent1: {
              systemPrompt: 'You are a helpful assistant',
              userPrompt: 'Hello, how are you?',
            },
          },
        },
      })
      toggleBlockAdvancedMode('agent1')
      let subBlockState = useSubBlockStore.getState()
      expect(subBlockState.workflowValues['test-workflow'].agent1.systemPrompt).toBe(
        'You are a helpful assistant'
      )
      expect(subBlockState.workflowValues['test-workflow'].agent1.userPrompt).toBe(
        'Hello, how are you?'
      )
      toggleBlockAdvancedMode('agent1')
      subBlockState = useSubBlockStore.getState()
      expect(subBlockState.workflowValues['test-workflow'].agent1.systemPrompt).toBe(
        'You are a helpful assistant'
      )
      expect(subBlockState.workflowValues['test-workflow'].agent1.userPrompt).toBe(
        'Hello, how are you?'
      )
    })

    it.concurrent('should preserve memories when switching from advanced to basic mode', () => {
      const { addBlock, toggleBlockAdvancedMode } = useWorkflowStore.getState()
      const { setState: setSubBlockState } = useSubBlockStore

      useWorkflowRegistry.setState({ activeWorkflowId: 'test-workflow' })

      addBlock('agent1', 'agent', 'Test Agent', { x: 0, y: 0 })

      toggleBlockAdvancedMode('agent1')

      setSubBlockState({
        workflowValues: {
          'test-workflow': {
            agent1: {
              systemPrompt: 'You are a helpful assistant',
              userPrompt: 'What did we discuss?',
              memories: [
                { role: 'user', content: 'My name is John' },
                { role: 'assistant', content: 'Nice to meet you, John!' },
              ],
            },
          },
        },
      })

      toggleBlockAdvancedMode('agent1')

      const subBlockState = useSubBlockStore.getState()
      expect(subBlockState.workflowValues['test-workflow'].agent1.systemPrompt).toBe(
        'You are a helpful assistant'
      )
      expect(subBlockState.workflowValues['test-workflow'].agent1.userPrompt).toBe(
        'What did we discuss?'
      )
      expect(subBlockState.workflowValues['test-workflow'].agent1.memories).toEqual([
        { role: 'user', content: 'My name is John' },
        { role: 'assistant', content: 'Nice to meet you, John!' },
      ])
    })

    it.concurrent('should handle mode switching when no subblock values exist', () => {
      const { addBlock, toggleBlockAdvancedMode } = useWorkflowStore.getState()

      useWorkflowRegistry.setState({ activeWorkflowId: 'test-workflow' })

      addBlock('agent1', 'agent', 'Test Agent', { x: 0, y: 0 })

      expect(useWorkflowStore.getState().blocks.agent1?.advancedMode).toBe(false)
      expect(() => toggleBlockAdvancedMode('agent1')).not.toThrow()

      const state = useWorkflowStore.getState()
      expect(state.blocks.agent1?.advancedMode).toBe(true)
    })

    it.concurrent('should not throw when toggling non-existent block', () => {
      const { toggleBlockAdvancedMode } = useWorkflowStore.getState()

      expect(() => toggleBlockAdvancedMode('non-existent')).not.toThrow()
    })
  })

  describe('addBlock with blockProperties', () => {
    it.concurrent(
      'should create a block with default properties when no blockProperties provided',
      () => {
        const { addBlock } = useWorkflowStore.getState()

        addBlock('agent1', 'agent', 'Test Agent', { x: 100, y: 200 })

        const state = useWorkflowStore.getState()
        const block = state.blocks.agent1

        expect(block).toBeDefined()
        expect(block.id).toBe('agent1')
        expect(block.type).toBe('agent')
        expect(block.name).toBe('Test Agent')
        expect(block.position).toEqual({ x: 100, y: 200 })
        expect(block.enabled).toBe(true)
        expect(block.horizontalHandles).toBe(true)
        expect(block.height).toBe(0)
      }
    )

    it.concurrent('should create a block with custom blockProperties for regular blocks', () => {
      const { addBlock } = useWorkflowStore.getState()

      addBlock(
        'agent1',
        'agent',
        'Test Agent',
        { x: 100, y: 200 },
        { someData: 'test' },
        undefined,
        undefined,
        {
          enabled: false,
          horizontalHandles: false,
          advancedMode: true,
          height: 300,
        }
      )

      const state = useWorkflowStore.getState()
      const block = state.blocks.agent1

      expect(block).toBeDefined()
      expect(block.enabled).toBe(false)
      expect(block.horizontalHandles).toBe(false)
      expect(block.advancedMode).toBe(true)
      expect(block.height).toBe(300)
    })

    it('should create a loop block with custom blockProperties', () => {
      const { addBlock } = useWorkflowStore.getState()

      addBlock(
        'loop1',
        'loop',
        'Test Loop',
        { x: 0, y: 0 },
        { loopType: 'for', count: 5 },
        undefined,
        undefined,
        {
          enabled: false,
          horizontalHandles: false,
          advancedMode: true,
          height: 250,
        }
      )

      const state = useWorkflowStore.getState()
      const block = state.blocks.loop1

      expect(block).toBeDefined()
      expect(block.enabled).toBe(false)
      expect(block.horizontalHandles).toBe(false)
      expect(block.advancedMode).toBe(true)
      expect(block.height).toBe(250)
    })

    it('should create a parallel block with custom blockProperties', () => {
      const { addBlock } = useWorkflowStore.getState()

      addBlock(
        'parallel1',
        'parallel',
        'Test Parallel',
        { x: 0, y: 0 },
        { count: 3 },
        undefined,
        undefined,
        {
          enabled: false,
          horizontalHandles: false,
          advancedMode: true,
          height: 400,
        }
      )

      const state = useWorkflowStore.getState()
      const block = state.blocks.parallel1

      expect(block).toBeDefined()
      expect(block.enabled).toBe(false)
      expect(block.horizontalHandles).toBe(false)
      expect(block.advancedMode).toBe(true)
      expect(block.height).toBe(400)
    })

    it('should handle partial blockProperties (only some properties provided)', () => {
      const { addBlock } = useWorkflowStore.getState()

      addBlock(
        'agent1',
        'agent',
        'Test Agent',
        { x: 100, y: 200 },
        undefined,
        undefined,
        undefined,
        {
          // Empty blockProperties - all should use defaults
        }
      )

      const state = useWorkflowStore.getState()
      const block = state.blocks.agent1

      expect(block).toBeDefined()
      expect(block.enabled).toBe(true) // default
      expect(block.horizontalHandles).toBe(true) // default
      expect(block.advancedMode).toBe(false) // default
      expect(block.height).toBe(0) // default
    })

    it('should handle blockProperties with parent relationships', () => {
      const { addBlock } = useWorkflowStore.getState()

      addBlock('loop1', 'loop', 'Parent Loop', { x: 0, y: 0 })

      addBlock(
        'agent1',
        'agent',
        'Child Agent',
        { x: 50, y: 50 },
        { parentId: 'loop1' },
        'loop1',
        'parent',
        {
          enabled: false,
          advancedMode: true,
          height: 200,
        }
      )

      const state = useWorkflowStore.getState()
      const childBlock = state.blocks.agent1

      expect(childBlock).toBeDefined()
      expect(childBlock.enabled).toBe(false)
      expect(childBlock.advancedMode).toBe(true)
      expect(childBlock.height).toBe(200)
      expect(childBlock.data?.parentId).toBe('loop1')
      expect(childBlock.data?.extent).toBe('parent')
    })
  })

  describe('updateBlockName', () => {
    beforeEach(() => {
      useWorkflowStore.setState({
        blocks: {},
        edges: [],
        loops: {},
        parallels: {},
      })

      const { addBlock } = useWorkflowStore.getState()

      addBlock('block1', 'agent', 'Column AD', { x: 0, y: 0 })
      addBlock('block2', 'function', 'Employee Length', { x: 100, y: 0 })
      addBlock('block3', 'trigger', 'Start', { x: 200, y: 0 })
    })

    it.concurrent('should have test blocks set up correctly', () => {
      const state = useWorkflowStore.getState()

      expect(state.blocks.block1).toBeDefined()
      expect(state.blocks.block1.name).toBe('Column AD')
      expect(state.blocks.block2).toBeDefined()
      expect(state.blocks.block2.name).toBe('Employee Length')
      expect(state.blocks.block3).toBeDefined()
      expect(state.blocks.block3.name).toBe('Start')
    })

    it.concurrent('should successfully rename a block when no conflicts exist', () => {
      const { updateBlockName } = useWorkflowStore.getState()

      const result = updateBlockName('block1', 'Data Processor')

      expect(result.success).toBe(true)

      const state = useWorkflowStore.getState()
      expect(state.blocks.block1.name).toBe('Data Processor')
    })

    it.concurrent(
      'should allow renaming a block to a different case/spacing of its current name',
      () => {
        const { updateBlockName } = useWorkflowStore.getState()

        const result = updateBlockName('block1', 'column ad')

        expect(result.success).toBe(true)

        const state = useWorkflowStore.getState()
        expect(state.blocks.block1.name).toBe('column ad')
      }
    )

    it.concurrent('should prevent renaming when another block has the same normalized name', () => {
      const { updateBlockName } = useWorkflowStore.getState()

      const result = updateBlockName('block2', 'Column AD')

      expect(result.success).toBe(false)

      const state = useWorkflowStore.getState()
      expect(state.blocks.block2.name).toBe('Employee Length')
    })

    it.concurrent(
      'should prevent renaming when another block has a name that normalizes to the same value',
      () => {
        const { updateBlockName } = useWorkflowStore.getState()

        const result = updateBlockName('block2', 'columnad')

        expect(result.success).toBe(false)

        const state = useWorkflowStore.getState()
        expect(state.blocks.block2.name).toBe('Employee Length')
      }
    )

    it.concurrent(
      'should prevent renaming when another block has a similar name with different spacing',
      () => {
        const { updateBlockName } = useWorkflowStore.getState()

        const result = updateBlockName('block3', 'employee length')

        expect(result.success).toBe(false)

        const state = useWorkflowStore.getState()
        expect(state.blocks.block3.name).toBe('Start')
      }
    )

    it.concurrent('should handle edge cases with empty or whitespace-only names', () => {
      const { updateBlockName } = useWorkflowStore.getState()

      const result1 = updateBlockName('block1', '')
      expect(result1.success).toBe(true)

      const result2 = updateBlockName('block2', '   ')
      expect(result2.success).toBe(true)

      const state = useWorkflowStore.getState()
      expect(state.blocks.block1.name).toBe('')
      expect(state.blocks.block2.name).toBe('   ')
    })

    it.concurrent('should return false when trying to rename a non-existent block', () => {
      const { updateBlockName } = useWorkflowStore.getState()

      const result = updateBlockName('nonexistent', 'New Name')

      expect(result.success).toBe(false)
    })

    it('should handle complex normalization cases correctly', () => {
      const { updateBlockName } = useWorkflowStore.getState()

      const conflictingNames = [
        'column ad',
        'COLUMN AD',
        'Column  AD',
        'columnad',
        'ColumnAD',
        'COLUMNAD',
      ]

      for (const name of conflictingNames) {
        const result = updateBlockName('block2', name)
        expect(result.success).toBe(false)
      }

      const result = updateBlockName('block2', 'Unique Name')
      expect(result.success).toBe(true)

      const state = useWorkflowStore.getState()
      expect(state.blocks.block2.name).toBe('Unique Name')
    })
  })
})
```

--------------------------------------------------------------------------------

````
