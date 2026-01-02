---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 556
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 556 of 933)

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

---[FILE: get-workflow-console.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/server/workflow/get-workflow-console.ts

```typescript
import { db } from '@sim/db'
import { workflowExecutionLogs } from '@sim/db/schema'
import { desc, eq } from 'drizzle-orm'
import type { BaseServerTool } from '@/lib/copilot/tools/server/base-tool'
import { createLogger } from '@/lib/logs/console/logger'

interface GetWorkflowConsoleArgs {
  workflowId: string
  limit?: number
  includeDetails?: boolean
}

interface BlockExecution {
  id: string
  blockId: string
  blockName: string
  blockType: string
  startedAt: string
  endedAt: string
  durationMs: number
  status: 'success' | 'error' | 'skipped'
  errorMessage?: string
  inputData: any
  outputData: any
  cost?: {
    total: number
    input: number
    output: number
    model?: string
    tokens?: { total: number; prompt: number; completion: number }
  }
}

interface ExecutionEntry {
  id: string
  executionId: string
  level: string
  trigger: string
  startedAt: string
  endedAt: string | null
  durationMs: number | null
  totalCost: number | null
  totalTokens: number | null
  blockExecutions: BlockExecution[]
  output?: any
  errorMessage?: string
  errorBlock?: {
    blockId?: string
    blockName?: string
    blockType?: string
  }
}

function extractBlockExecutionsFromTraceSpans(traceSpans: any[]): BlockExecution[] {
  const blockExecutions: BlockExecution[] = []

  function processSpan(span: any) {
    if (span?.blockId) {
      blockExecutions.push({
        id: span.id,
        blockId: span.blockId,
        blockName: span.name || '',
        blockType: span.type,
        startedAt: span.startTime,
        endedAt: span.endTime,
        durationMs: span.duration || 0,
        status: span.status || 'success',
        errorMessage: span.output?.error || undefined,
        inputData: span.input || {},
        outputData: span.output || {},
        cost: span.cost || undefined,
      })
    }
    if (span?.children && Array.isArray(span.children)) {
      span.children.forEach(processSpan)
    }
  }

  traceSpans.forEach(processSpan)
  return blockExecutions
}

function normalizeErrorMessage(errorValue: unknown): string | undefined {
  if (!errorValue) return undefined
  if (typeof errorValue === 'string') return errorValue
  if (errorValue instanceof Error) return errorValue.message
  if (typeof errorValue === 'object') {
    try {
      return JSON.stringify(errorValue)
    } catch {}
  }
  try {
    return String(errorValue)
  } catch {
    return undefined
  }
}

function extractErrorFromExecutionData(executionData: any): ExecutionEntry['errorBlock'] & {
  message?: string
} {
  if (!executionData) return {}

  const errorDetails = executionData.errorDetails
  if (errorDetails) {
    const message = normalizeErrorMessage(errorDetails.error || errorDetails.message)
    if (message) {
      return {
        message,
        blockId: errorDetails.blockId,
        blockName: errorDetails.blockName,
        blockType: errorDetails.blockType,
      }
    }
  }

  const finalOutputError = normalizeErrorMessage(executionData.finalOutput?.error)
  if (finalOutputError) {
    return {
      message: finalOutputError,
      blockName: 'Workflow',
    }
  }

  const genericError = normalizeErrorMessage(executionData.error)
  if (genericError) {
    return {
      message: genericError,
      blockName: 'Workflow',
    }
  }

  return {}
}

function extractErrorFromTraceSpans(traceSpans: any[]): ExecutionEntry['errorBlock'] & {
  message?: string
} {
  if (!Array.isArray(traceSpans) || traceSpans.length === 0) return {}

  const queue = [...traceSpans]
  while (queue.length > 0) {
    const span = queue.shift()
    if (!span || typeof span !== 'object') continue

    const message =
      normalizeErrorMessage(span.output?.error) ||
      normalizeErrorMessage(span.error) ||
      normalizeErrorMessage(span.output?.message) ||
      normalizeErrorMessage(span.message)

    const status = span.status
    if (status === 'error' || message) {
      return {
        message,
        blockId: span.blockId,
        blockName: span.blockName || span.name || (span.blockId ? undefined : 'Workflow'),
        blockType: span.blockType || span.type,
      }
    }

    if (Array.isArray(span.children)) {
      queue.push(...span.children)
    }
  }

  return {}
}

function deriveExecutionErrorSummary(params: {
  blockExecutions: BlockExecution[]
  traceSpans: any[]
  executionData: any
}): { message?: string; block?: ExecutionEntry['errorBlock'] } {
  const { blockExecutions, traceSpans, executionData } = params

  const blockError = blockExecutions.find((block) => block.status === 'error' && block.errorMessage)
  if (blockError) {
    return {
      message: blockError.errorMessage,
      block: {
        blockId: blockError.blockId,
        blockName: blockError.blockName,
        blockType: blockError.blockType,
      },
    }
  }

  const executionDataError = extractErrorFromExecutionData(executionData)
  if (executionDataError.message) {
    return {
      message: executionDataError.message,
      block: {
        blockId: executionDataError.blockId,
        blockName:
          executionDataError.blockName || (executionDataError.blockId ? undefined : 'Workflow'),
        blockType: executionDataError.blockType,
      },
    }
  }

  const traceError = extractErrorFromTraceSpans(traceSpans)
  if (traceError.message) {
    return {
      message: traceError.message,
      block: {
        blockId: traceError.blockId,
        blockName: traceError.blockName || (traceError.blockId ? undefined : 'Workflow'),
        blockType: traceError.blockType,
      },
    }
  }

  return {}
}

export const getWorkflowConsoleServerTool: BaseServerTool<GetWorkflowConsoleArgs, any> = {
  name: 'get_workflow_console',
  async execute(rawArgs: GetWorkflowConsoleArgs): Promise<any> {
    const logger = createLogger('GetWorkflowConsoleServerTool')
    const {
      workflowId,
      limit = 2,
      includeDetails = false,
    } = rawArgs || ({} as GetWorkflowConsoleArgs)

    if (!workflowId || typeof workflowId !== 'string') {
      throw new Error('workflowId is required')
    }

    logger.info('Fetching workflow console logs', { workflowId, limit, includeDetails })

    const executionLogs = await db
      .select({
        id: workflowExecutionLogs.id,
        executionId: workflowExecutionLogs.executionId,
        level: workflowExecutionLogs.level,
        trigger: workflowExecutionLogs.trigger,
        startedAt: workflowExecutionLogs.startedAt,
        endedAt: workflowExecutionLogs.endedAt,
        totalDurationMs: workflowExecutionLogs.totalDurationMs,
        executionData: workflowExecutionLogs.executionData,
        cost: workflowExecutionLogs.cost,
      })
      .from(workflowExecutionLogs)
      .where(eq(workflowExecutionLogs.workflowId, workflowId))
      .orderBy(desc(workflowExecutionLogs.startedAt))
      .limit(limit)

    // Simplify data for copilot - only essential block execution details
    const simplifiedExecutions = executionLogs.map((log) => {
      const executionData = log.executionData as any
      const traceSpans = executionData?.traceSpans || []
      const blockExecutions = includeDetails ? extractBlockExecutionsFromTraceSpans(traceSpans) : []

      // Simplify block executions to only essential fields
      const simplifiedBlocks = blockExecutions.map((block) => ({
        id: block.blockId,
        name: block.blockName,
        startedAt: block.startedAt,
        endedAt: block.endedAt,
        durationMs: block.durationMs,
        output: block.outputData,
        error: block.status === 'error' ? block.errorMessage : undefined,
      }))

      return {
        executionId: log.executionId,
        startedAt: log.startedAt.toISOString(),
        blocks: simplifiedBlocks,
      }
    })

    const resultSize = JSON.stringify(simplifiedExecutions).length
    logger.info('Workflow console result prepared', {
      executionCount: simplifiedExecutions.length,
      resultSizeKB: Math.round(resultSize / 1024),
    })

    return simplifiedExecutions
  },
}
```

--------------------------------------------------------------------------------

---[FILE: schemas.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/shared/schemas.ts
Signals: Zod

```typescript
import { z } from 'zod'

// Generic envelope used by client to validate API responses
export const ExecuteResponseSuccessSchema = z.object({
  success: z.literal(true),
  result: z.unknown(),
})
export type ExecuteResponseSuccess = z.infer<typeof ExecuteResponseSuccessSchema>

// get_blocks_and_tools
export const GetBlocksAndToolsInput = z.object({})
export const GetBlocksAndToolsResult = z.object({
  blocks: z.array(
    z
      .object({
        type: z.string(),
        name: z.string(),
        triggerAllowed: z.boolean().optional(),
        longDescription: z.string().optional(),
      })
      .passthrough()
  ),
})
export type GetBlocksAndToolsResultType = z.infer<typeof GetBlocksAndToolsResult>

// get_blocks_metadata
export const GetBlocksMetadataInput = z.object({ blockIds: z.array(z.string()).min(1) })
export const GetBlocksMetadataResult = z.object({ metadata: z.record(z.any()) })
export type GetBlocksMetadataResultType = z.infer<typeof GetBlocksMetadataResult>

// get_trigger_blocks
export const GetTriggerBlocksInput = z.object({})
export const GetTriggerBlocksResult = z.object({
  triggerBlockIds: z.array(z.string()),
})
export type GetTriggerBlocksResultType = z.infer<typeof GetTriggerBlocksResult>

// knowledge_base - shared schema used by client tool, server tool, and registry
export const KnowledgeBaseArgsSchema = z.object({
  operation: z.enum(['create', 'list', 'get', 'query']),
  args: z
    .object({
      /** Name of the knowledge base (required for create) */
      name: z.string().optional(),
      /** Description of the knowledge base (optional for create) */
      description: z.string().optional(),
      /** Workspace ID to associate with (optional for create/list) */
      workspaceId: z.string().optional(),
      /** Knowledge base ID (required for get, query) */
      knowledgeBaseId: z.string().optional(),
      /** Search query text (required for query) */
      query: z.string().optional(),
      /** Number of results to return (optional for query, defaults to 5) */
      topK: z.number().min(1).max(50).optional(),
      /** Chunking configuration (optional for create) */
      chunkingConfig: z
        .object({
          maxSize: z.number().min(100).max(4000).default(1024),
          minSize: z.number().min(1).max(2000).default(1),
          overlap: z.number().min(0).max(500).default(200),
        })
        .optional(),
    })
    .optional(),
})
export type KnowledgeBaseArgs = z.infer<typeof KnowledgeBaseArgsSchema>

export const KnowledgeBaseResultSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.any().optional(),
})
export type KnowledgeBaseResult = z.infer<typeof KnowledgeBaseResultSchema>
```

--------------------------------------------------------------------------------

---[FILE: selector-validator.ts]---
Location: sim-main/apps/sim/lib/copilot/validation/selector-validator.ts

```typescript
import { db } from '@sim/db'
import { account, document, knowledgeBase, mcpServers, workflow } from '@sim/db/schema'
import { and, eq, inArray, isNull } from 'drizzle-orm'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('SelectorValidator')

/**
 * Result of selector ID validation
 */
export interface SelectorValidationResult {
  valid: string[]
  invalid: string[]
  warning?: string
}

/**
 * Validates that selector IDs exist in the database
 * Returns valid IDs, invalid IDs, and optional warning for unknown selector types
 */
export async function validateSelectorIds(
  selectorType: string,
  ids: string | string[],
  context: { userId: string; workspaceId?: string }
): Promise<SelectorValidationResult> {
  const idsArray = (Array.isArray(ids) ? ids : [ids]).filter((id) => id && id.trim() !== '')
  if (idsArray.length === 0) {
    return { valid: [], invalid: [] }
  }

  let existingIds: string[] = []

  try {
    switch (selectorType) {
      case 'oauth-input': {
        // Credentials must belong to the user
        const results = await db
          .select({ id: account.id })
          .from(account)
          .where(and(inArray(account.id, idsArray), eq(account.userId, context.userId)))
        existingIds = results.map((r) => r.id)
        break
      }

      case 'knowledge-base-selector': {
        // Knowledge bases - check if they exist (workspace check optional)
        const conditions = [inArray(knowledgeBase.id, idsArray)]
        if (context.workspaceId) {
          conditions.push(eq(knowledgeBase.workspaceId, context.workspaceId))
        }
        const results = await db
          .select({ id: knowledgeBase.id })
          .from(knowledgeBase)
          .where(and(...conditions))
        existingIds = results.map((r) => r.id)
        break
      }

      case 'workflow-selector': {
        // Workflows - check if they exist
        const results = await db
          .select({ id: workflow.id })
          .from(workflow)
          .where(inArray(workflow.id, idsArray))
        existingIds = results.map((r) => r.id)
        break
      }

      case 'document-selector': {
        // Documents in knowledge bases - check if they exist and are not deleted
        const results = await db
          .select({ id: document.id })
          .from(document)
          .where(and(inArray(document.id, idsArray), isNull(document.deletedAt)))
        existingIds = results.map((r) => r.id)
        break
      }

      case 'mcp-server-selector': {
        // MCP servers - check if they exist, are enabled, and not deleted in the workspace
        const conditions = [
          inArray(mcpServers.id, idsArray),
          eq(mcpServers.enabled, true),
          isNull(mcpServers.deletedAt),
        ]
        if (context.workspaceId) {
          conditions.push(eq(mcpServers.workspaceId, context.workspaceId))
        }
        const results = await db
          .select({ id: mcpServers.id })
          .from(mcpServers)
          .where(and(...conditions))
        existingIds = results.map((r) => r.id)
        break
      }

      // MCP tools are dynamically fetched from external MCP servers at runtime
      // We can't validate tool IDs locally - only the server connection validates them
      case 'mcp-tool-selector': {
        return { valid: idsArray, invalid: [] }
      }

      // These selectors use external IDs from third-party systems (Slack, Google, Jira, etc.)
      // We can't validate them locally - they're validated at runtime when calling the external API
      case 'file-selector':
      case 'project-selector':
      case 'channel-selector':
      case 'folder-selector': {
        // External/dynamic selectors - skip validation, IDs are validated at runtime
        // These IDs come from: Slack channels, Google Drive files, Jira projects, etc.
        return { valid: idsArray, invalid: [] }
      }

      default: {
        // Unknown selector type - skip validation but warn
        logger.warn(`Unknown selector type "${selectorType}" - ID validation skipped`, {
          selectorType,
          idCount: idsArray.length,
        })
        return {
          valid: idsArray,
          invalid: [],
          warning: `Unknown selector type "${selectorType}" - ID validation skipped`,
        }
      }
    }
  } catch (error) {
    // On DB error, skip validation rather than failing the edit
    logger.error(`Failed to validate selector IDs for type "${selectorType}"`, {
      error: error instanceof Error ? error.message : String(error),
      selectorType,
      idCount: idsArray.length,
    })
    return {
      valid: idsArray,
      invalid: [],
      warning: `Failed to validate ${selectorType} IDs - validation skipped`,
    }
  }

  const existingSet = new Set(existingIds)
  return {
    valid: idsArray.filter((id) => existingSet.has(id)),
    invalid: idsArray.filter((id) => !existingSet.has(id)),
  }
}

/**
 * Batch validate multiple selector fields
 * Returns a map of field name to validation result
 */
export async function validateAllSelectorFields(
  fields: Array<{ fieldName: string; selectorType: string; value: string | string[] }>,
  context: { userId: string; workspaceId?: string }
): Promise<Map<string, SelectorValidationResult>> {
  const results = new Map<string, SelectorValidationResult>()

  // Run validations in parallel for better performance
  const validationPromises = fields.map(async ({ fieldName, selectorType, value }) => {
    const result = await validateSelectorIds(selectorType, value, context)
    return { fieldName, result }
  })

  const validationResults = await Promise.all(validationPromises)

  for (const { fieldName, result } of validationResults) {
    results.set(fieldName, result)
  }

  return results
}
```

--------------------------------------------------------------------------------

---[FILE: telemetry.ts]---
Location: sim-main/apps/sim/lib/core/telemetry.ts

```typescript
/**
 * OpenTelemetry Integration for Sim Execution Pipeline
 *
 * This module integrates OpenTelemetry tracing with the existing execution logging system.
 * It converts TraceSpans and BlockLogs into proper OpenTelemetry spans with semantic conventions.
 *
 * Architecture:
 * - LoggingSession tracks workflow execution start/complete
 * - Executor generates BlockLogs for each block execution
 * - TraceSpans are built from BlockLogs
 * - This module converts TraceSpans -> OpenTelemetry Spans
 *
 * Integration Points:
 * 1. LoggingSession.start() -> Create root workflow span
 * 2. LoggingSession.complete() -> End workflow span with all block spans as children
 * 3. Block execution -> Create span for each block type with proper attributes
 */

import { context, type Span, SpanStatusCode, trace } from '@opentelemetry/api'
import { createLogger } from '@/lib/logs/console/logger'
import type { TraceSpan } from '@/lib/logs/types'

/**
 * GenAI Semantic Convention Attributes
 */
const GenAIAttributes = {
  // System attributes
  SYSTEM: 'gen_ai.system',
  REQUEST_MODEL: 'gen_ai.request.model',
  RESPONSE_MODEL: 'gen_ai.response.model',

  // Token usage
  USAGE_INPUT_TOKENS: 'gen_ai.usage.input_tokens',
  USAGE_OUTPUT_TOKENS: 'gen_ai.usage.output_tokens',
  USAGE_TOTAL_TOKENS: 'gen_ai.usage.total_tokens',

  // Request/Response
  REQUEST_TEMPERATURE: 'gen_ai.request.temperature',
  REQUEST_TOP_P: 'gen_ai.request.top_p',
  REQUEST_MAX_TOKENS: 'gen_ai.request.max_tokens',
  RESPONSE_FINISH_REASON: 'gen_ai.response.finish_reason',

  // Agent-specific
  AGENT_ID: 'gen_ai.agent.id',
  AGENT_NAME: 'gen_ai.agent.name',
  AGENT_TASK: 'gen_ai.agent.task',

  // Workflow-specific
  WORKFLOW_ID: 'gen_ai.workflow.id',
  WORKFLOW_NAME: 'gen_ai.workflow.name',
  WORKFLOW_VERSION: 'gen_ai.workflow.version',
  WORKFLOW_EXECUTION_ID: 'gen_ai.workflow.execution_id',

  // Tool-specific
  TOOL_NAME: 'gen_ai.tool.name',
  TOOL_DESCRIPTION: 'gen_ai.tool.description',

  // Cost tracking
  COST_TOTAL: 'gen_ai.cost.total',
  COST_INPUT: 'gen_ai.cost.input',
  COST_OUTPUT: 'gen_ai.cost.output',
}

const logger = createLogger('OTelIntegration')

// Lazy-load tracer
let _tracer: ReturnType<typeof trace.getTracer> | null = null

function getTracer() {
  if (!_tracer) {
    _tracer = trace.getTracer('sim-ai-platform', '1.0.0')
  }
  return _tracer
}

/**
 * Map block types to OpenTelemetry span kinds and semantic conventions
 */
const BLOCK_TYPE_MAPPING: Record<
  string,
  {
    spanName: string
    spanKind: string
    getAttributes: (traceSpan: TraceSpan) => Record<string, string | number | boolean | undefined>
  }
> = {
  agent: {
    spanName: 'gen_ai.agent.execute',
    spanKind: 'gen_ai.agent',
    getAttributes: (span) => {
      const attrs: Record<string, string | number | boolean | undefined> = {
        [GenAIAttributes.AGENT_ID]: span.blockId || span.id,
        [GenAIAttributes.AGENT_NAME]: span.name,
      }

      if (span.model) {
        attrs[GenAIAttributes.REQUEST_MODEL] = span.model
      }

      if (span.tokens) {
        if (typeof span.tokens === 'number') {
          attrs[GenAIAttributes.USAGE_TOTAL_TOKENS] = span.tokens
        } else {
          attrs[GenAIAttributes.USAGE_INPUT_TOKENS] = span.tokens.input || span.tokens.prompt || 0
          attrs[GenAIAttributes.USAGE_OUTPUT_TOKENS] =
            span.tokens.output || span.tokens.completion || 0
          attrs[GenAIAttributes.USAGE_TOTAL_TOKENS] = span.tokens.total || 0
        }
      }

      if (span.cost) {
        attrs[GenAIAttributes.COST_INPUT] = span.cost.input || 0
        attrs[GenAIAttributes.COST_OUTPUT] = span.cost.output || 0
        attrs[GenAIAttributes.COST_TOTAL] = span.cost.total || 0
      }

      return attrs
    },
  },
  workflow: {
    spanName: 'gen_ai.workflow.execute',
    spanKind: 'gen_ai.workflow',
    getAttributes: (span) => ({
      [GenAIAttributes.WORKFLOW_ID]: span.blockId || 'root',
      [GenAIAttributes.WORKFLOW_NAME]: span.name,
    }),
  },
  tool: {
    spanName: 'gen_ai.tool.call',
    spanKind: 'gen_ai.tool',
    getAttributes: (span) => ({
      [GenAIAttributes.TOOL_NAME]: span.name,
      'tool.id': span.id,
      'tool.duration_ms': span.duration,
    }),
  },
  model: {
    spanName: 'gen_ai.model.request',
    spanKind: 'gen_ai.model',
    getAttributes: (span) => ({
      'model.name': span.name,
      'model.id': span.id,
      'model.duration_ms': span.duration,
    }),
  },
  api: {
    spanName: 'http.client.request',
    spanKind: 'http.client',
    getAttributes: (span) => {
      const input = span.input as { method?: string; url?: string } | undefined
      const output = span.output as { status?: number } | undefined
      return {
        'http.request.method': input?.method || 'GET',
        'http.request.url': input?.url || '',
        'http.response.status_code': output?.status || 0,
        'block.id': span.blockId,
        'block.name': span.name,
      }
    },
  },
  function: {
    spanName: 'function.execute',
    spanKind: 'function',
    getAttributes: (span) => ({
      'function.name': span.name,
      'function.id': span.blockId,
      'function.execution_time_ms': span.duration,
    }),
  },
  router: {
    spanName: 'router.evaluate',
    spanKind: 'router',
    getAttributes: (span) => {
      const output = span.output as { selectedPath?: { blockId?: string } } | undefined
      return {
        'router.name': span.name,
        'router.id': span.blockId,
        'router.selected_path': output?.selectedPath?.blockId,
      }
    },
  },
  condition: {
    spanName: 'condition.evaluate',
    spanKind: 'condition',
    getAttributes: (span) => {
      const output = span.output as { conditionResult?: boolean | string } | undefined
      return {
        'condition.name': span.name,
        'condition.id': span.blockId,
        'condition.result': output?.conditionResult,
      }
    },
  },
  loop: {
    spanName: 'loop.execute',
    spanKind: 'loop',
    getAttributes: (span) => ({
      'loop.name': span.name,
      'loop.id': span.blockId,
      'loop.iterations': span.children?.length || 0,
    }),
  },
  parallel: {
    spanName: 'parallel.execute',
    spanKind: 'parallel',
    getAttributes: (span) => ({
      'parallel.name': span.name,
      'parallel.id': span.blockId,
      'parallel.branches': span.children?.length || 0,
    }),
  },
}

/**
 * Convert a TraceSpan to an OpenTelemetry span
 * Creates a proper OTel span with all the metadata from the trace span
 */
export function createOTelSpanFromTraceSpan(traceSpan: TraceSpan, parentSpan?: Span): Span | null {
  try {
    const tracer = getTracer()

    const blockMapping = BLOCK_TYPE_MAPPING[traceSpan.type] || {
      spanName: `block.${traceSpan.type}`,
      spanKind: 'internal',
      getAttributes: (span: TraceSpan) => ({
        'block.type': span.type,
        'block.id': span.blockId,
        'block.name': span.name,
      }),
    }

    const attributes = {
      ...blockMapping.getAttributes(traceSpan),
      'span.type': traceSpan.type,
      'span.duration_ms': traceSpan.duration,
      'span.status': traceSpan.status,
    }

    const ctx = parentSpan ? trace.setSpan(context.active(), parentSpan) : context.active()

    const span = tracer.startSpan(
      blockMapping.spanName,
      {
        attributes,
        startTime: new Date(traceSpan.startTime),
      },
      ctx
    )

    if (traceSpan.status === 'error') {
      const errorMessage =
        typeof traceSpan.output?.error === 'string'
          ? traceSpan.output.error
          : 'Block execution failed'

      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: errorMessage,
      })

      if (errorMessage && errorMessage !== 'Block execution failed') {
        span.recordException(new Error(errorMessage))
      }
    } else {
      span.setStatus({ code: SpanStatusCode.OK })
    }

    if (traceSpan.children && traceSpan.children.length > 0) {
      for (const childTraceSpan of traceSpan.children) {
        createOTelSpanFromTraceSpan(childTraceSpan, span)
      }
    }

    if (traceSpan.toolCalls && traceSpan.toolCalls.length > 0) {
      for (const toolCall of traceSpan.toolCalls) {
        const toolSpan = tracer.startSpan(
          'gen_ai.tool.call',
          {
            attributes: {
              [GenAIAttributes.TOOL_NAME]: toolCall.name,
              'tool.status': toolCall.status,
              'tool.duration_ms': toolCall.duration || 0,
            },
            startTime: new Date(toolCall.startTime),
          },
          trace.setSpan(context.active(), span)
        )

        if (toolCall.status === 'error') {
          toolSpan.setStatus({
            code: SpanStatusCode.ERROR,
            message: toolCall.error || 'Tool call failed',
          })
          if (toolCall.error) {
            toolSpan.recordException(new Error(toolCall.error))
          }
        } else {
          toolSpan.setStatus({ code: SpanStatusCode.OK })
        }

        toolSpan.end(new Date(toolCall.endTime))
      }
    }

    span.end(new Date(traceSpan.endTime))

    return span
  } catch (error) {
    logger.error('Failed to create OTel span from trace span', {
      error,
      traceSpanId: traceSpan.id,
      traceSpanType: traceSpan.type,
    })
    return null
  }
}

/**
 * Create OpenTelemetry spans for an entire workflow execution
 * This is called from LoggingSession.complete() with the final trace spans
 */
export function createOTelSpansForWorkflowExecution(params: {
  workflowId: string
  workflowName?: string
  executionId: string
  traceSpans: TraceSpan[]
  trigger: string
  startTime: string
  endTime: string
  totalDurationMs: number
  status: 'success' | 'error'
  error?: string
}): void {
  try {
    const tracer = getTracer()

    const rootSpan = tracer.startSpan(
      'gen_ai.workflow.execute',
      {
        attributes: {
          [GenAIAttributes.WORKFLOW_ID]: params.workflowId,
          [GenAIAttributes.WORKFLOW_NAME]: params.workflowName || params.workflowId,
          [GenAIAttributes.WORKFLOW_EXECUTION_ID]: params.executionId,
          'workflow.trigger': params.trigger,
          'workflow.duration_ms': params.totalDurationMs,
        },
        startTime: new Date(params.startTime),
      },
      context.active()
    )

    if (params.status === 'error') {
      rootSpan.setStatus({
        code: SpanStatusCode.ERROR,
        message: params.error || 'Workflow execution failed',
      })
      if (params.error) {
        rootSpan.recordException(new Error(params.error))
      }
    } else {
      rootSpan.setStatus({ code: SpanStatusCode.OK })
    }

    for (const traceSpan of params.traceSpans) {
      createOTelSpanFromTraceSpan(traceSpan, rootSpan)
    }

    rootSpan.end(new Date(params.endTime))

    logger.debug('Created OTel spans for workflow execution', {
      workflowId: params.workflowId,
      executionId: params.executionId,
      spanCount: params.traceSpans.length,
    })
  } catch (error) {
    logger.error('Failed to create OTel spans for workflow execution', {
      error,
      workflowId: params.workflowId,
      executionId: params.executionId,
    })
  }
}

/**
 * Create a real-time OpenTelemetry span for a block execution
 * Can be called from block handlers during execution for real-time tracing
 */
export async function traceBlockExecution<T>(
  blockType: string,
  blockId: string,
  blockName: string,
  fn: (span: Span) => Promise<T>
): Promise<T> {
  const tracer = getTracer()

  const blockMapping = BLOCK_TYPE_MAPPING[blockType] || {
    spanName: `block.${blockType}`,
    spanKind: 'internal',
    getAttributes: () => ({}),
  }

  return tracer.startActiveSpan(
    blockMapping.spanName,
    {
      attributes: {
        'block.type': blockType,
        'block.id': blockId,
        'block.name': blockName,
      },
    },
    async (span) => {
      try {
        const result = await fn(span)
        span.setStatus({ code: SpanStatusCode.OK })
        return result
      } catch (error) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error instanceof Error ? error.message : 'Block execution failed',
        })
        span.recordException(error instanceof Error ? error : new Error(String(error)))
        throw error
      } finally {
        span.end()
      }
    }
  )
}

/**
 * Track platform events (workflow creation, knowledge base operations, etc.)
 */
export function trackPlatformEvent(
  eventName: string,
  attributes: Record<string, string | number | boolean>
): void {
  try {
    const tracer = getTracer()
    const span = tracer.startSpan(eventName, {
      attributes: {
        ...attributes,
        'event.name': eventName,
        'event.timestamp': Date.now(),
      },
    })
    span.setStatus({ code: SpanStatusCode.OK })
    span.end()
  } catch (error) {
    // Silently fail
  }
}
```

--------------------------------------------------------------------------------

````
