---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 523
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 523 of 933)

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

---[FILE: start-block.test.ts]---
Location: sim-main/apps/sim/executor/utils/start-block.test.ts

```typescript
import { describe, expect, it } from 'vitest'
import { StartBlockPath } from '@/lib/workflows/triggers/triggers'
import type { UserFile } from '@/executor/types'
import {
  buildResolutionFromBlock,
  buildStartBlockOutput,
  resolveExecutorStartBlock,
} from '@/executor/utils/start-block'
import type { SerializedBlock } from '@/serializer/types'

function createBlock(
  type: string,
  id = type,
  options?: { subBlocks?: Record<string, unknown> }
): SerializedBlock {
  return {
    id,
    position: { x: 0, y: 0 },
    config: {
      tool: type,
      params: options?.subBlocks?.inputFormat ? { inputFormat: options.subBlocks.inputFormat } : {},
    },
    inputs: {},
    outputs: {},
    metadata: {
      id: type,
      name: `block-${type}`,
      category: 'triggers',
      ...(options?.subBlocks ? { subBlocks: options.subBlocks } : {}),
    } as SerializedBlock['metadata'] & { subBlocks?: Record<string, unknown> },
    enabled: true,
  }
}

describe('start-block utilities', () => {
  it.concurrent('buildResolutionFromBlock returns null when metadata id missing', () => {
    const block = createBlock('api_trigger')
    ;(block.metadata as Record<string, unknown>).id = undefined

    expect(buildResolutionFromBlock(block)).toBeNull()
  })

  it.concurrent('resolveExecutorStartBlock prefers unified start block', () => {
    const blocks = [
      createBlock('api_trigger', 'api'),
      createBlock('starter', 'starter'),
      createBlock('start_trigger', 'start'),
    ]

    const resolution = resolveExecutorStartBlock(blocks, {
      execution: 'api',
      isChildWorkflow: false,
    })

    expect(resolution?.blockId).toBe('start')
    expect(resolution?.path).toBe(StartBlockPath.UNIFIED)
  })

  it.concurrent('buildStartBlockOutput normalizes unified start payload', () => {
    const block = createBlock('start_trigger', 'start')
    const resolution = {
      blockId: 'start',
      block,
      path: StartBlockPath.UNIFIED,
    } as const

    const output = buildStartBlockOutput({
      resolution,
      workflowInput: { payload: 'value' },
    })

    expect(output.payload).toBe('value')
    expect(output.input).toBeUndefined()
    expect(output.conversationId).toBeUndefined()
  })

  it.concurrent('buildStartBlockOutput uses trigger schema for API triggers', () => {
    const apiBlock = createBlock('api_trigger', 'api', {
      subBlocks: {
        inputFormat: {
          value: [
            { name: 'name', type: 'string' },
            { name: 'count', type: 'number' },
          ],
        },
      },
    })

    const resolution = {
      blockId: 'api',
      block: apiBlock,
      path: StartBlockPath.SPLIT_API,
    } as const

    const files: UserFile[] = [
      {
        id: 'file-1',
        name: 'document.txt',
        url: 'https://example.com/document.txt',
        size: 42,
        type: 'text/plain',
        key: 'file-key',
      },
    ]

    const output = buildStartBlockOutput({
      resolution,
      workflowInput: {
        input: {
          name: 'Ada',
          count: '5',
        },
        files,
      },
    })

    expect(output.name).toBe('Ada')
    expect(output.input).toEqual({ name: 'Ada', count: 5 })
    expect(output.files).toEqual(files)
  })

  describe('inputFormat default values', () => {
    it.concurrent('uses default value when runtime does not provide the field', () => {
      const block = createBlock('start_trigger', 'start', {
        subBlocks: {
          inputFormat: {
            value: [
              { name: 'input', type: 'string' },
              { name: 'customField', type: 'string', value: 'defaultValue' },
            ],
          },
        },
      })

      const resolution = {
        blockId: 'start',
        block,
        path: StartBlockPath.UNIFIED,
      } as const

      const output = buildStartBlockOutput({
        resolution,
        workflowInput: { input: 'hello' },
      })

      expect(output.input).toBe('hello')
      expect(output.customField).toBe('defaultValue')
    })

    it.concurrent('runtime value overrides default value', () => {
      const block = createBlock('start_trigger', 'start', {
        subBlocks: {
          inputFormat: {
            value: [{ name: 'customField', type: 'string', value: 'defaultValue' }],
          },
        },
      })

      const resolution = {
        blockId: 'start',
        block,
        path: StartBlockPath.UNIFIED,
      } as const

      const output = buildStartBlockOutput({
        resolution,
        workflowInput: { customField: 'runtimeValue' },
      })

      expect(output.customField).toBe('runtimeValue')
    })

    it.concurrent('empty string from runtime overrides default value', () => {
      const block = createBlock('start_trigger', 'start', {
        subBlocks: {
          inputFormat: {
            value: [{ name: 'customField', type: 'string', value: 'defaultValue' }],
          },
        },
      })

      const resolution = {
        blockId: 'start',
        block,
        path: StartBlockPath.UNIFIED,
      } as const

      const output = buildStartBlockOutput({
        resolution,
        workflowInput: { customField: '' },
      })

      expect(output.customField).toBe('')
    })

    it.concurrent('null from runtime does not override default value', () => {
      const block = createBlock('start_trigger', 'start', {
        subBlocks: {
          inputFormat: {
            value: [{ name: 'customField', type: 'string', value: 'defaultValue' }],
          },
        },
      })

      const resolution = {
        blockId: 'start',
        block,
        path: StartBlockPath.UNIFIED,
      } as const

      const output = buildStartBlockOutput({
        resolution,
        workflowInput: { customField: null },
      })

      expect(output.customField).toBe('defaultValue')
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: start-block.ts]---
Location: sim-main/apps/sim/executor/utils/start-block.ts

```typescript
import { isUserFile } from '@/lib/core/utils/display-filters'
import {
  classifyStartBlockType,
  getLegacyStarterMode,
  resolveStartCandidates,
  StartBlockPath,
} from '@/lib/workflows/triggers/triggers'
import type { InputFormatField } from '@/lib/workflows/types'
import type { NormalizedBlockOutput, UserFile } from '@/executor/types'
import type { SerializedBlock } from '@/serializer/types'

type ExecutionKind = 'chat' | 'manual' | 'api'

export interface ExecutorStartResolution {
  blockId: string
  block: SerializedBlock
  path: StartBlockPath
}

export interface ResolveExecutorStartOptions {
  execution: ExecutionKind
  isChildWorkflow: boolean
}

type StartCandidateWrapper = {
  type: string
  subBlocks?: Record<string, unknown>
  original: SerializedBlock
}

export function resolveExecutorStartBlock(
  blocks: SerializedBlock[],
  options: ResolveExecutorStartOptions
): ExecutorStartResolution | null {
  if (blocks.length === 0) {
    return null
  }

  const blockMap = blocks.reduce<Record<string, StartCandidateWrapper>>((acc, block) => {
    const type = block.metadata?.id
    if (!type) {
      return acc
    }

    acc[block.id] = {
      type,
      subBlocks: extractSubBlocks(block),
      original: block,
    }

    return acc
  }, {})

  const candidates = resolveStartCandidates(blockMap, {
    execution: options.execution,
    isChildWorkflow: options.isChildWorkflow,
  })

  if (candidates.length === 0) {
    return null
  }

  if (options.isChildWorkflow && candidates.length > 1) {
    throw new Error('Child workflow has multiple trigger blocks. Keep only one Start block.')
  }

  const [primary] = candidates
  return {
    blockId: primary.blockId,
    block: primary.block.original,
    path: primary.path,
  }
}

export function buildResolutionFromBlock(block: SerializedBlock): ExecutorStartResolution | null {
  const type = block.metadata?.id
  if (!type) {
    return null
  }

  const category = block.metadata?.category
  const triggerModeEnabled = block.config?.params?.triggerMode === true

  const path = classifyStartBlockType(type, {
    category,
    triggerModeEnabled,
  })
  if (!path) {
    return null
  }

  return {
    blockId: block.id,
    block,
    path,
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readMetadataSubBlockValue(block: SerializedBlock, key: string): unknown {
  const metadata = block.metadata
  if (!metadata || typeof metadata !== 'object') {
    return undefined
  }

  const maybeWithSubBlocks = metadata as typeof metadata & {
    subBlocks?: Record<string, unknown>
  }

  const raw = maybeWithSubBlocks.subBlocks?.[key]
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return undefined
  }

  return (raw as { value?: unknown }).value
}

function extractInputFormat(block: SerializedBlock): InputFormatField[] {
  const fromMetadata = readMetadataSubBlockValue(block, 'inputFormat')
  const fromParams = block.config?.params?.inputFormat
  const source = fromMetadata ?? fromParams

  if (!Array.isArray(source)) {
    return []
  }

  return source
    .filter((field): field is InputFormatField => isPlainObject(field))
    .map((field) => field)
}

export function coerceValue(type: string | null | undefined, value: unknown): unknown {
  if (value === undefined || value === null) {
    return value
  }

  switch (type) {
    case 'string':
      return typeof value === 'string' ? value : String(value)
    case 'number': {
      if (typeof value === 'number') return value
      const parsed = Number(value)
      return Number.isNaN(parsed) ? value : parsed
    }
    case 'boolean': {
      if (typeof value === 'boolean') return value
      if (value === 'true' || value === '1' || value === 1) return true
      if (value === 'false' || value === '0' || value === 0) return false
      return value
    }
    case 'object':
    case 'array': {
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value)
          return parsed
        } catch {
          return value
        }
      }
      return value
    }
    default:
      return value
  }
}

interface DerivedInputResult {
  structuredInput: Record<string, unknown>
  finalInput: unknown
  hasStructured: boolean
}

function deriveInputFromFormat(
  inputFormat: InputFormatField[],
  workflowInput: unknown
): DerivedInputResult {
  const structuredInput: Record<string, unknown> = {}

  if (inputFormat.length === 0) {
    return {
      structuredInput,
      finalInput: getRawInputCandidate(workflowInput),
      hasStructured: false,
    }
  }

  for (const field of inputFormat) {
    const fieldName = field.name?.trim()
    if (!fieldName) continue

    let fieldValue: unknown
    const workflowRecord = isPlainObject(workflowInput) ? workflowInput : undefined

    if (workflowRecord) {
      const inputContainer = workflowRecord.input
      if (isPlainObject(inputContainer) && Object.hasOwn(inputContainer, fieldName)) {
        fieldValue = inputContainer[fieldName]
      } else if (Object.hasOwn(workflowRecord, fieldName)) {
        fieldValue = workflowRecord[fieldName]
      }
    }

    // Use the default value from inputFormat if the field value wasn't provided at runtime
    if (fieldValue === undefined || fieldValue === null) {
      fieldValue = field.value
    }

    structuredInput[fieldName] = coerceValue(field.type, fieldValue)
  }

  const hasStructured = Object.keys(structuredInput).length > 0
  const finalInput = hasStructured ? structuredInput : getRawInputCandidate(workflowInput)

  return {
    structuredInput,
    finalInput,
    hasStructured,
  }
}

function getRawInputCandidate(workflowInput: unknown): unknown {
  if (isPlainObject(workflowInput) && Object.hasOwn(workflowInput, 'input')) {
    return workflowInput.input
  }
  return workflowInput
}

function getFilesFromWorkflowInput(workflowInput: unknown): UserFile[] | undefined {
  if (!isPlainObject(workflowInput)) {
    return undefined
  }
  const files = workflowInput.files
  if (Array.isArray(files) && files.every(isUserFile)) {
    return files
  }
  return undefined
}

function mergeFilesIntoOutput(
  output: NormalizedBlockOutput,
  workflowInput: unknown
): NormalizedBlockOutput {
  const files = getFilesFromWorkflowInput(workflowInput)
  if (files) {
    output.files = files
  }
  return output
}

function ensureString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function buildUnifiedStartOutput(
  workflowInput: unknown,
  structuredInput: Record<string, unknown>,
  hasStructured: boolean
): NormalizedBlockOutput {
  const output: NormalizedBlockOutput = {}

  if (hasStructured) {
    for (const [key, value] of Object.entries(structuredInput)) {
      output[key] = value
    }
  }

  if (isPlainObject(workflowInput)) {
    for (const [key, value] of Object.entries(workflowInput)) {
      if (key === 'onUploadError') continue
      // Runtime values override defaults (except undefined/null which mean "not provided")
      if (value !== undefined && value !== null) {
        output[key] = value
      } else if (!Object.hasOwn(output, key)) {
        output[key] = value
      }
    }
  }

  if (!Object.hasOwn(output, 'input')) {
    const fallbackInput =
      isPlainObject(workflowInput) && typeof workflowInput.input !== 'undefined'
        ? ensureString(workflowInput.input)
        : ''
    output.input = fallbackInput ? fallbackInput : undefined
  } else if (typeof output.input === 'string' && output.input.length === 0) {
    output.input = undefined
  }

  if (!Object.hasOwn(output, 'conversationId')) {
    const conversationId =
      isPlainObject(workflowInput) && workflowInput.conversationId
        ? ensureString(workflowInput.conversationId)
        : undefined
    if (conversationId) {
      output.conversationId = conversationId
    }
  } else if (typeof output.conversationId === 'string' && output.conversationId.length === 0) {
    output.conversationId = undefined
  }

  return mergeFilesIntoOutput(output, workflowInput)
}

function buildApiOrInputOutput(finalInput: unknown, workflowInput: unknown): NormalizedBlockOutput {
  const isObjectInput = isPlainObject(finalInput)

  const output: NormalizedBlockOutput = isObjectInput
    ? {
        ...(finalInput as Record<string, unknown>),
        input: { ...(finalInput as Record<string, unknown>) },
      }
    : { input: finalInput }

  return mergeFilesIntoOutput(output, workflowInput)
}

function buildChatOutput(workflowInput: unknown): NormalizedBlockOutput {
  const source = isPlainObject(workflowInput) ? workflowInput : undefined

  const output: NormalizedBlockOutput = {
    input: ensureString(source?.input),
  }

  const conversationId = ensureString(source?.conversationId)
  if (conversationId) {
    output.conversationId = conversationId
  }

  return mergeFilesIntoOutput(output, workflowInput)
}

function buildLegacyStarterOutput(
  finalInput: unknown,
  workflowInput: unknown,
  mode: 'manual' | 'api' | 'chat' | null
): NormalizedBlockOutput {
  if (mode === 'chat') {
    return buildChatOutput(workflowInput)
  }

  const output: NormalizedBlockOutput = {}
  const finalObject = isPlainObject(finalInput) ? finalInput : undefined

  if (finalObject) {
    Object.assign(output, finalObject)
    output.input = { ...finalObject }
  } else {
    output.input = finalInput
  }

  const conversationId = isPlainObject(workflowInput) ? workflowInput.conversationId : undefined
  if (conversationId) {
    output.conversationId = ensureString(conversationId)
  }

  return mergeFilesIntoOutput(output, workflowInput)
}

function buildManualTriggerOutput(
  finalInput: unknown,
  workflowInput: unknown
): NormalizedBlockOutput {
  const finalObject = isPlainObject(finalInput)
    ? (finalInput as Record<string, unknown>)
    : undefined

  const output: NormalizedBlockOutput = finalObject ? { ...finalObject } : { input: finalInput }

  if (!Object.hasOwn(output, 'input')) {
    output.input = getRawInputCandidate(workflowInput)
  }

  return mergeFilesIntoOutput(output, workflowInput)
}

function buildIntegrationTriggerOutput(
  finalInput: unknown,
  workflowInput: unknown
): NormalizedBlockOutput {
  const base: NormalizedBlockOutput = isPlainObject(workflowInput)
    ? ({ ...(workflowInput as Record<string, unknown>) } as NormalizedBlockOutput)
    : {}

  if (isPlainObject(finalInput)) {
    Object.assign(base, finalInput as Record<string, unknown>)
    base.input = { ...(finalInput as Record<string, unknown>) }
  } else {
    base.input = finalInput
  }

  return mergeFilesIntoOutput(base, workflowInput)
}

function extractSubBlocks(block: SerializedBlock): Record<string, unknown> | undefined {
  const metadata = block.metadata
  if (!metadata || typeof metadata !== 'object') {
    return undefined
  }

  const maybeWithSubBlocks = metadata as typeof metadata & {
    subBlocks?: Record<string, unknown>
  }

  const subBlocks = maybeWithSubBlocks.subBlocks
  if (subBlocks && typeof subBlocks === 'object' && !Array.isArray(subBlocks)) {
    return subBlocks
  }

  return undefined
}

export interface StartBlockOutputOptions {
  resolution: ExecutorStartResolution
  workflowInput: unknown
}

export function buildStartBlockOutput(options: StartBlockOutputOptions): NormalizedBlockOutput {
  const { resolution, workflowInput } = options
  const inputFormat = extractInputFormat(resolution.block)
  const { finalInput, structuredInput, hasStructured } = deriveInputFromFormat(
    inputFormat,
    workflowInput
  )

  switch (resolution.path) {
    case StartBlockPath.UNIFIED:
      return buildUnifiedStartOutput(workflowInput, structuredInput, hasStructured)

    case StartBlockPath.SPLIT_API:
    case StartBlockPath.SPLIT_INPUT:
      return buildApiOrInputOutput(finalInput, workflowInput)

    case StartBlockPath.SPLIT_CHAT:
      return buildChatOutput(workflowInput)

    case StartBlockPath.SPLIT_MANUAL:
      return buildManualTriggerOutput(finalInput, workflowInput)

    case StartBlockPath.EXTERNAL_TRIGGER:
      return buildIntegrationTriggerOutput(finalInput, workflowInput)

    case StartBlockPath.LEGACY_STARTER:
      return buildLegacyStarterOutput(
        finalInput,
        workflowInput,
        getLegacyStarterMode({ subBlocks: extractSubBlocks(resolution.block) })
      )
    default:
      return buildManualTriggerOutput(finalInput, workflowInput)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: subflow-utils.ts]---
Location: sim-main/apps/sim/executor/utils/subflow-utils.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import { LOOP, PARALLEL, PARSING, REFERENCE } from '@/executor/constants'
import type { SerializedParallel } from '@/serializer/types'

const logger = createLogger('SubflowUtils')

const BRANCH_PATTERN = new RegExp(`${PARALLEL.BRANCH.PREFIX}\\d+${PARALLEL.BRANCH.SUFFIX}$`)
const BRANCH_INDEX_PATTERN = new RegExp(`${PARALLEL.BRANCH.PREFIX}(\\d+)${PARALLEL.BRANCH.SUFFIX}$`)
const SENTINEL_START_PATTERN = new RegExp(
  `${LOOP.SENTINEL.PREFIX}(.+)${LOOP.SENTINEL.START_SUFFIX}`
)
const SENTINEL_END_PATTERN = new RegExp(`${LOOP.SENTINEL.PREFIX}(.+)${LOOP.SENTINEL.END_SUFFIX}`)

/** Build sentinel start node ID */
export function buildSentinelStartId(loopId: string): string {
  return `${LOOP.SENTINEL.PREFIX}${loopId}${LOOP.SENTINEL.START_SUFFIX}`
}
/**
 * Build sentinel end node ID
 */
export function buildSentinelEndId(loopId: string): string {
  return `${LOOP.SENTINEL.PREFIX}${loopId}${LOOP.SENTINEL.END_SUFFIX}`
}
/**
 * Check if a node ID is a sentinel node
 */
export function isSentinelNodeId(nodeId: string): boolean {
  return nodeId.includes(LOOP.SENTINEL.START_SUFFIX) || nodeId.includes(LOOP.SENTINEL.END_SUFFIX)
}

export function extractLoopIdFromSentinel(sentinelId: string): string | null {
  const startMatch = sentinelId.match(SENTINEL_START_PATTERN)
  if (startMatch) return startMatch[1]
  const endMatch = sentinelId.match(SENTINEL_END_PATTERN)
  if (endMatch) return endMatch[1]
  return null
}

/**
 * Parse distribution items from parallel config
 * Handles: arrays, JSON strings, objects, and references
 * Note: References (starting with '<') cannot be resolved at DAG construction time,
 * they must be resolved at runtime. This function returns [] for references.
 */
export function parseDistributionItems(config: SerializedParallel): any[] {
  const rawItems = config.distribution ?? []

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
    // References cannot be resolved at DAG construction time
    if (rawItems.startsWith(REFERENCE.START) && rawItems.endsWith(REFERENCE.END)) {
      return []
    }

    // Try to parse as JSON
    try {
      const normalizedJSON = rawItems.replace(/'/g, '"')
      const parsed = JSON.parse(normalizedJSON)
      if (Array.isArray(parsed)) {
        return parsed
      }
      // Parsed to non-array (e.g. object) - convert to entries
      if (typeof parsed === 'object' && parsed !== null) {
        return Object.entries(parsed)
      }
      return []
    } catch (error) {
      logger.error('Failed to parse distribution items', {
        rawItems,
        error: error instanceof Error ? error.message : String(error),
      })
      return []
    }
  }

  return []
}
/**
 * Calculate branch count from parallel config
 */
export function calculateBranchCount(config: SerializedParallel, distributionItems: any[]): number {
  const explicitCount = config.count ?? PARALLEL.DEFAULT_COUNT
  if (config.parallelType === PARALLEL.TYPE.COLLECTION && distributionItems.length > 0) {
    return distributionItems.length
  }
  return explicitCount
}
/**
 * Build branch node ID with subscript notation
 * Example: ("blockId", 2) → "blockId₍2₎"
 */
export function buildBranchNodeId(baseId: string, branchIndex: number): string {
  return `${baseId}${PARALLEL.BRANCH.PREFIX}${branchIndex}${PARALLEL.BRANCH.SUFFIX}`
}
export function extractBaseBlockId(branchNodeId: string): string {
  return branchNodeId.replace(BRANCH_PATTERN, '')
}

export function extractBranchIndex(branchNodeId: string): number | null {
  const match = branchNodeId.match(BRANCH_INDEX_PATTERN)
  return match ? Number.parseInt(match[1], PARSING.JSON_RADIX) : null
}

export function isBranchNodeId(nodeId: string): boolean {
  return BRANCH_PATTERN.test(nodeId)
}

export function isLoopNode(nodeId: string): boolean {
  return isSentinelNodeId(nodeId) || nodeId.startsWith(LOOP.SENTINEL.PREFIX)
}

export function isParallelNode(nodeId: string): boolean {
  return isBranchNodeId(nodeId)
}

export function normalizeNodeId(nodeId: string): string {
  if (isBranchNodeId(nodeId)) {
    return extractBaseBlockId(nodeId)
  }
  if (isSentinelNodeId(nodeId)) {
    return extractLoopIdFromSentinel(nodeId) || nodeId
  }
  return nodeId
}
```

--------------------------------------------------------------------------------

---[FILE: resolver.ts]---
Location: sim-main/apps/sim/executor/variables/resolver.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import { BlockType, REFERENCE } from '@/executor/constants'
import type { ExecutionState, LoopScope } from '@/executor/execution/state'
import type { ExecutionContext } from '@/executor/types'
import { replaceValidReferences } from '@/executor/utils/reference-validation'
import { BlockResolver } from '@/executor/variables/resolvers/block'
import { EnvResolver } from '@/executor/variables/resolvers/env'
import { LoopResolver } from '@/executor/variables/resolvers/loop'
import { ParallelResolver } from '@/executor/variables/resolvers/parallel'
import type { ResolutionContext, Resolver } from '@/executor/variables/resolvers/reference'
import { WorkflowResolver } from '@/executor/variables/resolvers/workflow'
import type { SerializedBlock, SerializedWorkflow } from '@/serializer/types'

const logger = createLogger('VariableResolver')

export class VariableResolver {
  private resolvers: Resolver[]
  private blockResolver: BlockResolver

  constructor(
    workflow: SerializedWorkflow,
    workflowVariables: Record<string, any>,
    private state: ExecutionState
  ) {
    this.blockResolver = new BlockResolver(workflow)
    this.resolvers = [
      new LoopResolver(workflow),
      new ParallelResolver(workflow),
      new WorkflowResolver(workflowVariables),
      new EnvResolver(),
      this.blockResolver,
    ]
  }

  resolveInputs(
    ctx: ExecutionContext,
    currentNodeId: string,
    params: Record<string, any>,
    block?: SerializedBlock
  ): Record<string, any> {
    if (!params) {
      return {}
    }
    const resolved: Record<string, any> = {}

    const isConditionBlock = block?.metadata?.id === BlockType.CONDITION
    if (isConditionBlock && typeof params.conditions === 'string') {
      try {
        const parsed = JSON.parse(params.conditions)
        if (Array.isArray(parsed)) {
          resolved.conditions = parsed.map((cond: any) => ({
            ...cond,
            value:
              typeof cond.value === 'string'
                ? this.resolveTemplateWithoutConditionFormatting(ctx, currentNodeId, cond.value)
                : cond.value,
          }))
        } else {
          resolved.conditions = this.resolveValue(
            ctx,
            currentNodeId,
            params.conditions,
            undefined,
            block
          )
        }
      } catch (parseError) {
        logger.warn('Failed to parse conditions JSON, falling back to normal resolution', {
          error: parseError,
          conditions: params.conditions,
        })
        resolved.conditions = this.resolveValue(
          ctx,
          currentNodeId,
          params.conditions,
          undefined,
          block
        )
      }
    }

    for (const [key, value] of Object.entries(params)) {
      if (isConditionBlock && key === 'conditions') {
        continue
      }
      resolved[key] = this.resolveValue(ctx, currentNodeId, value, undefined, block)
    }
    return resolved
  }

  resolveSingleReference(
    ctx: ExecutionContext,
    currentNodeId: string,
    reference: string,
    loopScope?: LoopScope
  ): any {
    if (typeof reference === 'string') {
      const trimmed = reference.trim()
      if (/^<[^<>]+>$/.test(trimmed)) {
        const resolutionContext: ResolutionContext = {
          executionContext: ctx,
          executionState: this.state,
          currentNodeId,
          loopScope,
        }

        return this.resolveReference(trimmed, resolutionContext)
      }
    }

    return this.resolveValue(ctx, currentNodeId, reference, loopScope)
  }

  private resolveValue(
    ctx: ExecutionContext,
    currentNodeId: string,
    value: any,
    loopScope?: LoopScope,
    block?: SerializedBlock
  ): any {
    if (value === null || value === undefined) {
      return value
    }

    if (Array.isArray(value)) {
      return value.map((v) => this.resolveValue(ctx, currentNodeId, v, loopScope, block))
    }

    if (typeof value === 'object') {
      return Object.entries(value).reduce(
        (acc, [key, val]) => ({
          ...acc,
          [key]: this.resolveValue(ctx, currentNodeId, val, loopScope, block),
        }),
        {}
      )
    }

    if (typeof value === 'string') {
      return this.resolveTemplate(ctx, currentNodeId, value, loopScope, block)
    }
    return value
  }
  private resolveTemplate(
    ctx: ExecutionContext,
    currentNodeId: string,
    template: string,
    loopScope?: LoopScope,
    block?: SerializedBlock
  ): string {
    const resolutionContext: ResolutionContext = {
      executionContext: ctx,
      executionState: this.state,
      currentNodeId,
      loopScope,
    }

    let replacementError: Error | null = null

    // Use generic utility for smart variable reference replacement
    let result = replaceValidReferences(template, (match) => {
      if (replacementError) return match

      try {
        const resolved = this.resolveReference(match, resolutionContext)
        if (resolved === undefined) {
          return match
        }

        const blockType = block?.metadata?.id
        const isInTemplateLiteral =
          blockType === BlockType.FUNCTION &&
          template.includes('${') &&
          template.includes('}') &&
          template.includes('`')

        return this.blockResolver.formatValueForBlock(resolved, blockType, isInTemplateLiteral)
      } catch (error) {
        replacementError = error instanceof Error ? error : new Error(String(error))
        return match
      }
    })

    if (replacementError !== null) {
      throw replacementError
    }

    const envRegex = new RegExp(`${REFERENCE.ENV_VAR_START}([^}]+)${REFERENCE.ENV_VAR_END}`, 'g')
    result = result.replace(envRegex, (match) => {
      const resolved = this.resolveReference(match, resolutionContext)
      return typeof resolved === 'string' ? resolved : match
    })
    return result
  }

  private resolveTemplateWithoutConditionFormatting(
    ctx: ExecutionContext,
    currentNodeId: string,
    template: string,
    loopScope?: LoopScope
  ): string {
    const resolutionContext: ResolutionContext = {
      executionContext: ctx,
      executionState: this.state,
      currentNodeId,
      loopScope,
    }

    let replacementError: Error | null = null

    // Use generic utility for smart variable reference replacement
    let result = replaceValidReferences(template, (match) => {
      if (replacementError) return match

      try {
        const resolved = this.resolveReference(match, resolutionContext)
        if (resolved === undefined) {
          return match
        }

        if (typeof resolved === 'string') {
          const escaped = resolved.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
          return `'${escaped}'`
        }
        if (typeof resolved === 'object' && resolved !== null) {
          return JSON.stringify(resolved)
        }
        return String(resolved)
      } catch (error) {
        replacementError = error instanceof Error ? error : new Error(String(error))
        return match
      }
    })

    if (replacementError !== null) {
      throw replacementError
    }

    const envRegex = new RegExp(`${REFERENCE.ENV_VAR_START}([^}]+)${REFERENCE.ENV_VAR_END}`, 'g')
    result = result.replace(envRegex, (match) => {
      const resolved = this.resolveReference(match, resolutionContext)
      return typeof resolved === 'string' ? resolved : match
    })
    return result
  }

  private resolveReference(reference: string, context: ResolutionContext): any {
    for (const resolver of this.resolvers) {
      if (resolver.canResolve(reference)) {
        const result = resolver.resolve(reference, context)
        return result
      }
    }

    logger.warn('No resolver found for reference', { reference })
    return undefined
  }
}
```

--------------------------------------------------------------------------------

---[FILE: block.ts]---
Location: sim-main/apps/sim/executor/variables/resolvers/block.ts

```typescript
import { isReference, parseReferencePath, SPECIAL_REFERENCE_PREFIXES } from '@/executor/constants'
import {
  navigatePath,
  type ResolutionContext,
  type Resolver,
} from '@/executor/variables/resolvers/reference'
import type { SerializedWorkflow } from '@/serializer/types'
import { normalizeBlockName } from '@/stores/workflows/utils'

export class BlockResolver implements Resolver {
  private blockByNormalizedName: Map<string, string>

  constructor(private workflow: SerializedWorkflow) {
    this.blockByNormalizedName = new Map()
    for (const block of workflow.blocks) {
      this.blockByNormalizedName.set(block.id, block.id)
      if (block.metadata?.name) {
        const normalized = normalizeBlockName(block.metadata.name)
        this.blockByNormalizedName.set(normalized, block.id)
      }
    }
  }

  canResolve(reference: string): boolean {
    if (!isReference(reference)) {
      return false
    }
    const parts = parseReferencePath(reference)
    if (parts.length === 0) {
      return false
    }
    const [type] = parts
    return !SPECIAL_REFERENCE_PREFIXES.includes(type as any)
  }

  resolve(reference: string, context: ResolutionContext): any {
    const parts = parseReferencePath(reference)
    if (parts.length === 0) {
      return undefined
    }
    const [blockName, ...pathParts] = parts

    const blockId = this.findBlockIdByName(blockName)
    if (!blockId) {
      return undefined
    }

    const output = this.getBlockOutput(blockId, context)

    if (output === undefined) {
      return undefined
    }
    if (pathParts.length === 0) {
      return output
    }

    const result = navigatePath(output, pathParts)

    if (result === undefined) {
      const availableKeys = output && typeof output === 'object' ? Object.keys(output) : []
      throw new Error(
        `No value found at path "${pathParts.join('.')}" in block "${blockName}". Available fields: ${availableKeys.join(', ')}`
      )
    }

    return result
  }

  private getBlockOutput(blockId: string, context: ResolutionContext): any {
    const stateOutput = context.executionState.getBlockOutput(blockId, context.currentNodeId)
    if (stateOutput !== undefined) {
      return stateOutput
    }
    const contextState = context.executionContext.blockStates?.get(blockId)
    if (contextState?.output) {
      return contextState.output
    }

    return undefined
  }

  private findBlockIdByName(name: string): string | undefined {
    if (this.blockByNormalizedName.has(name)) {
      return this.blockByNormalizedName.get(name)
    }
    const normalized = normalizeBlockName(name)
    return this.blockByNormalizedName.get(normalized)
  }

  public formatValueForBlock(
    value: any,
    blockType: string | undefined,
    isInTemplateLiteral = false
  ): string {
    if (blockType === 'condition') {
      return this.stringifyForCondition(value)
    }

    if (blockType === 'function') {
      return this.formatValueForCodeContext(value, isInTemplateLiteral)
    }

    if (blockType === 'response') {
      if (typeof value === 'string') {
        return value
      }
      if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
        return JSON.stringify(value)
      }
      return String(value)
    }

    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value)
    }

    return String(value)
  }

  private stringifyForCondition(value: any): string {
    if (typeof value === 'string') {
      const sanitized = value
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
      return `"${sanitized}"`
    }
    if (value === null) {
      return 'null'
    }
    if (value === undefined) {
      return 'undefined'
    }
    if (typeof value === 'object') {
      return JSON.stringify(value)
    }
    return String(value)
  }

  private formatValueForCodeContext(value: any, isInTemplateLiteral: boolean): string {
    if (isInTemplateLiteral) {
      if (typeof value === 'string') {
        return value
      }
      if (typeof value === 'object' && value !== null) {
        return JSON.stringify(value)
      }
      return String(value)
    }

    if (typeof value === 'string') {
      return JSON.stringify(value)
    }
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value)
    }
    if (value === undefined) {
      return 'undefined'
    }
    if (value === null) {
      return 'null'
    }
    return String(value)
  }

  tryParseJSON(value: any): any {
    if (typeof value !== 'string') {
      return value
    }

    const trimmed = value.trim()
    if (trimmed.length > 0 && (trimmed.startsWith('{') || trimmed.startsWith('['))) {
      try {
        return JSON.parse(trimmed)
      } catch {
        return value
      }
    }

    return value
  }
}
```

--------------------------------------------------------------------------------

---[FILE: env.ts]---
Location: sim-main/apps/sim/executor/variables/resolvers/env.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import { extractEnvVarName, isEnvVarReference } from '@/executor/constants'
import type { ResolutionContext, Resolver } from '@/executor/variables/resolvers/reference'

const logger = createLogger('EnvResolver')

export class EnvResolver implements Resolver {
  canResolve(reference: string): boolean {
    return isEnvVarReference(reference)
  }

  resolve(reference: string, context: ResolutionContext): any {
    const varName = extractEnvVarName(reference)

    const value = context.executionContext.environmentVariables?.[varName]
    if (value === undefined) {
      return reference
    }
    return value
  }
}
```

--------------------------------------------------------------------------------

---[FILE: loop.ts]---
Location: sim-main/apps/sim/executor/variables/resolvers/loop.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import { isReference, parseReferencePath, REFERENCE } from '@/executor/constants'
import { extractBaseBlockId } from '@/executor/utils/subflow-utils'
import {
  navigatePath,
  type ResolutionContext,
  type Resolver,
} from '@/executor/variables/resolvers/reference'
import type { SerializedWorkflow } from '@/serializer/types'

const logger = createLogger('LoopResolver')

export class LoopResolver implements Resolver {
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
    return type === REFERENCE.PREFIX.LOOP
  }

  resolve(reference: string, context: ResolutionContext): any {
    const parts = parseReferencePath(reference)
    if (parts.length < 2) {
      logger.warn('Invalid loop reference - missing property', { reference })
      return undefined
    }

    const [_, property, ...pathParts] = parts
    let loopScope = context.loopScope

    if (!loopScope) {
      const loopId = this.findLoopForBlock(context.currentNodeId)
      if (!loopId) {
        return undefined
      }
      loopScope = context.executionContext.loopExecutions?.get(loopId)
    }

    if (!loopScope) {
      logger.warn('Loop scope not found', { reference })
      return undefined
    }

    let value: any
    switch (property) {
      case 'iteration':
      case 'index':
        value = loopScope.iteration
        break
      case 'item':
      case 'currentItem':
        value = loopScope.item
        break
      case 'items':
        value = loopScope.items
        break
      default:
        logger.warn('Unknown loop property', { property })
        return undefined
    }

    // If there are additional path parts, navigate deeper
    if (pathParts.length > 0) {
      return navigatePath(value, pathParts)
    }

    return value
  }

  private findLoopForBlock(blockId: string): string | undefined {
    const baseId = extractBaseBlockId(blockId)
    for (const loopId of Object.keys(this.workflow.loops || {})) {
      const loopConfig = this.workflow.loops[loopId]
      if (loopConfig.nodes.includes(baseId)) {
        return loopId
      }
    }

    return undefined
  }
}
```

--------------------------------------------------------------------------------

````
