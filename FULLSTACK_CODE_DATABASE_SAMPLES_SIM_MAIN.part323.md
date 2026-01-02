---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 323
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 323 of 933)

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

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/v1/logs/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import { permissions, workflow, workflowExecutionLogs } from '@sim/db/schema'
import { and, eq, sql } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createLogger } from '@/lib/logs/console/logger'
import { buildLogFilters, getOrderBy } from '@/app/api/v1/logs/filters'
import { createApiResponse, getUserLimits } from '@/app/api/v1/logs/meta'
import { checkRateLimit, createRateLimitResponse } from '@/app/api/v1/middleware'

const logger = createLogger('V1LogsAPI')

export const dynamic = 'force-dynamic'
export const revalidate = 0

const QueryParamsSchema = z.object({
  workspaceId: z.string(),
  workflowIds: z.string().optional(),
  folderIds: z.string().optional(),
  triggers: z.string().optional(),
  level: z.enum(['info', 'error']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  executionId: z.string().optional(),
  minDurationMs: z.coerce.number().optional(),
  maxDurationMs: z.coerce.number().optional(),
  minCost: z.coerce.number().optional(),
  maxCost: z.coerce.number().optional(),
  model: z.string().optional(),
  details: z.enum(['basic', 'full']).optional().default('basic'),
  includeTraceSpans: z.coerce.boolean().optional().default(false),
  includeFinalOutput: z.coerce.boolean().optional().default(false),
  limit: z.coerce.number().optional().default(100),
  cursor: z.string().optional(),
  order: z.enum(['desc', 'asc']).optional().default('desc'),
})

interface CursorData {
  startedAt: string
  id: string
}

function encodeCursor(data: CursorData): string {
  return Buffer.from(JSON.stringify(data)).toString('base64')
}

function decodeCursor(cursor: string): CursorData | null {
  try {
    return JSON.parse(Buffer.from(cursor, 'base64').toString())
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  const requestId = crypto.randomUUID().slice(0, 8)

  try {
    const rateLimit = await checkRateLimit(request, 'logs')
    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit)
    }

    const userId = rateLimit.userId!
    const { searchParams } = new URL(request.url)
    const rawParams = Object.fromEntries(searchParams.entries())

    const validationResult = QueryParamsSchema.safeParse(rawParams)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const params = validationResult.data

    logger.info(`[${requestId}] Fetching logs for workspace ${params.workspaceId}`, {
      userId,
      filters: {
        workflowIds: params.workflowIds,
        triggers: params.triggers,
        level: params.level,
      },
    })

    const filters = {
      workspaceId: params.workspaceId,
      workflowIds: params.workflowIds?.split(',').filter(Boolean),
      folderIds: params.folderIds?.split(',').filter(Boolean),
      triggers: params.triggers?.split(',').filter(Boolean),
      level: params.level,
      startDate: params.startDate ? new Date(params.startDate) : undefined,
      endDate: params.endDate ? new Date(params.endDate) : undefined,
      executionId: params.executionId,
      minDurationMs: params.minDurationMs,
      maxDurationMs: params.maxDurationMs,
      minCost: params.minCost,
      maxCost: params.maxCost,
      model: params.model,
      cursor: params.cursor ? decodeCursor(params.cursor) || undefined : undefined,
      order: params.order,
    }

    const conditions = buildLogFilters(filters)
    const orderBy = getOrderBy(params.order)

    // Build and execute query
    const baseQuery = db
      .select({
        id: workflowExecutionLogs.id,
        workflowId: workflowExecutionLogs.workflowId,
        executionId: workflowExecutionLogs.executionId,
        deploymentVersionId: workflowExecutionLogs.deploymentVersionId,
        level: workflowExecutionLogs.level,
        trigger: workflowExecutionLogs.trigger,
        startedAt: workflowExecutionLogs.startedAt,
        endedAt: workflowExecutionLogs.endedAt,
        totalDurationMs: workflowExecutionLogs.totalDurationMs,
        cost: workflowExecutionLogs.cost,
        files: workflowExecutionLogs.files,
        executionData: params.details === 'full' ? workflowExecutionLogs.executionData : sql`null`,
        workflowName: workflow.name,
        workflowDescription: workflow.description,
      })
      .from(workflowExecutionLogs)
      .innerJoin(
        workflow,
        and(
          eq(workflowExecutionLogs.workflowId, workflow.id),
          eq(workflow.workspaceId, params.workspaceId)
        )
      )
      .innerJoin(
        permissions,
        and(
          eq(permissions.entityType, 'workspace'),
          eq(permissions.entityId, params.workspaceId),
          eq(permissions.userId, userId)
        )
      )

    const logs = await baseQuery
      .where(conditions)
      .orderBy(orderBy)
      .limit(params.limit + 1)

    const hasMore = logs.length > params.limit
    const data = logs.slice(0, params.limit)

    let nextCursor: string | undefined
    if (hasMore && data.length > 0) {
      const lastLog = data[data.length - 1]
      nextCursor = encodeCursor({
        startedAt: lastLog.startedAt.toISOString(),
        id: lastLog.id,
      })
    }

    const formattedLogs = data.map((log) => {
      const result: any = {
        id: log.id,
        workflowId: log.workflowId,
        executionId: log.executionId,
        deploymentVersionId: log.deploymentVersionId,
        level: log.level,
        trigger: log.trigger,
        startedAt: log.startedAt.toISOString(),
        endedAt: log.endedAt?.toISOString() || null,
        totalDurationMs: log.totalDurationMs,
        cost: log.cost ? { total: (log.cost as any).total } : null,
        files: log.files || null,
      }

      if (params.details === 'full') {
        result.workflow = {
          id: log.workflowId,
          name: log.workflowName,
          description: log.workflowDescription,
        }

        if (log.cost) {
          result.cost = log.cost
        }

        if (log.executionData) {
          const execData = log.executionData as any
          if (params.includeFinalOutput && execData.finalOutput) {
            result.finalOutput = execData.finalOutput
          }
          if (params.includeTraceSpans && execData.traceSpans) {
            result.traceSpans = execData.traceSpans
          }
        }
      }

      return result
    })

    // Get user's workflow execution limits and usage
    const limits = await getUserLimits(userId)

    // Create response with limits information
    // The rateLimit object from checkRateLimit is for THIS API endpoint's rate limits
    const response = createApiResponse(
      {
        data: formattedLogs,
        nextCursor,
      },
      limits,
      rateLimit // This is the API endpoint rate limit, not workflow execution limits
    )

    return NextResponse.json(response.body, { headers: response.headers })
  } catch (error: any) {
    logger.error(`[${requestId}] Logs fetch error`, { error: error.message })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/v1/logs/executions/[executionId]/route.ts
Signals: Next.js

```typescript
import { db } from '@sim/db'
import {
  permissions,
  workflow,
  workflowExecutionLogs,
  workflowExecutionSnapshots,
} from '@sim/db/schema'
import { and, eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { createLogger } from '@/lib/logs/console/logger'
import { createApiResponse, getUserLimits } from '@/app/api/v1/logs/meta'
import { checkRateLimit, createRateLimitResponse } from '@/app/api/v1/middleware'

const logger = createLogger('V1ExecutionAPI')

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ executionId: string }> }
) {
  try {
    const rateLimit = await checkRateLimit(request, 'logs-detail')
    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit)
    }

    const userId = rateLimit.userId!
    const { executionId } = await params

    logger.debug(`Fetching execution data for: ${executionId}`)

    const rows = await db
      .select({
        log: workflowExecutionLogs,
        workflow: workflow,
      })
      .from(workflowExecutionLogs)
      .innerJoin(workflow, eq(workflowExecutionLogs.workflowId, workflow.id))
      .innerJoin(
        permissions,
        and(
          eq(permissions.entityType, 'workspace'),
          eq(permissions.entityId, workflow.workspaceId),
          eq(permissions.userId, userId)
        )
      )
      .where(eq(workflowExecutionLogs.executionId, executionId))
      .limit(1)

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Workflow execution not found' }, { status: 404 })
    }

    const { log: workflowLog } = rows[0]

    const [snapshot] = await db
      .select()
      .from(workflowExecutionSnapshots)
      .where(eq(workflowExecutionSnapshots.id, workflowLog.stateSnapshotId))
      .limit(1)

    if (!snapshot) {
      return NextResponse.json({ error: 'Workflow state snapshot not found' }, { status: 404 })
    }

    const response = {
      executionId,
      workflowId: workflowLog.workflowId,
      workflowState: snapshot.stateData,
      executionMetadata: {
        trigger: workflowLog.trigger,
        startedAt: workflowLog.startedAt.toISOString(),
        endedAt: workflowLog.endedAt?.toISOString(),
        totalDurationMs: workflowLog.totalDurationMs,
        cost: workflowLog.cost || null,
      },
    }

    logger.debug(`Successfully fetched execution data for: ${executionId}`)
    logger.debug(
      `Workflow state contains ${Object.keys((snapshot.stateData as any)?.blocks || {}).length} blocks`
    )

    // Get user's workflow execution limits and usage
    const limits = await getUserLimits(userId)

    // Create response with limits information
    const apiResponse = createApiResponse(
      {
        ...response,
      },
      limits,
      rateLimit
    )

    return NextResponse.json(apiResponse.body, { headers: apiResponse.headers })
  } catch (error) {
    logger.error('Error fetching execution data:', error)
    return NextResponse.json({ error: 'Failed to fetch execution data' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/v1/logs/[id]/route.ts
Signals: Next.js

```typescript
import { db } from '@sim/db'
import { permissions, workflow, workflowExecutionLogs } from '@sim/db/schema'
import { and, eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { createLogger } from '@/lib/logs/console/logger'
import { createApiResponse, getUserLimits } from '@/app/api/v1/logs/meta'
import { checkRateLimit, createRateLimitResponse } from '@/app/api/v1/middleware'

const logger = createLogger('V1LogDetailsAPI')

export const revalidate = 0

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = crypto.randomUUID().slice(0, 8)

  try {
    const rateLimit = await checkRateLimit(request, 'logs-detail')
    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit)
    }

    const userId = rateLimit.userId!
    const { id } = await params

    const rows = await db
      .select({
        id: workflowExecutionLogs.id,
        workflowId: workflowExecutionLogs.workflowId,
        executionId: workflowExecutionLogs.executionId,
        stateSnapshotId: workflowExecutionLogs.stateSnapshotId,
        level: workflowExecutionLogs.level,
        trigger: workflowExecutionLogs.trigger,
        startedAt: workflowExecutionLogs.startedAt,
        endedAt: workflowExecutionLogs.endedAt,
        totalDurationMs: workflowExecutionLogs.totalDurationMs,
        executionData: workflowExecutionLogs.executionData,
        cost: workflowExecutionLogs.cost,
        files: workflowExecutionLogs.files,
        createdAt: workflowExecutionLogs.createdAt,
        workflowName: workflow.name,
        workflowDescription: workflow.description,
        workflowColor: workflow.color,
        workflowFolderId: workflow.folderId,
        workflowUserId: workflow.userId,
        workflowWorkspaceId: workflow.workspaceId,
        workflowCreatedAt: workflow.createdAt,
        workflowUpdatedAt: workflow.updatedAt,
      })
      .from(workflowExecutionLogs)
      .innerJoin(workflow, eq(workflowExecutionLogs.workflowId, workflow.id))
      .innerJoin(
        permissions,
        and(
          eq(permissions.entityType, 'workspace'),
          eq(permissions.entityId, workflow.workspaceId),
          eq(permissions.userId, userId)
        )
      )
      .where(eq(workflowExecutionLogs.id, id))
      .limit(1)

    const log = rows[0]
    if (!log) {
      return NextResponse.json({ error: 'Log not found' }, { status: 404 })
    }

    const workflowSummary = {
      id: log.workflowId,
      name: log.workflowName,
      description: log.workflowDescription,
      color: log.workflowColor,
      folderId: log.workflowFolderId,
      userId: log.workflowUserId,
      workspaceId: log.workflowWorkspaceId,
      createdAt: log.workflowCreatedAt,
      updatedAt: log.workflowUpdatedAt,
    }

    const response = {
      id: log.id,
      workflowId: log.workflowId,
      executionId: log.executionId,
      level: log.level,
      trigger: log.trigger,
      startedAt: log.startedAt.toISOString(),
      endedAt: log.endedAt?.toISOString() || null,
      totalDurationMs: log.totalDurationMs,
      files: log.files || undefined,
      workflow: workflowSummary,
      executionData: log.executionData as any,
      cost: log.cost as any,
      createdAt: log.createdAt.toISOString(),
    }

    // Get user's workflow execution limits and usage
    const limits = await getUserLimits(userId)

    // Create response with limits information
    const apiResponse = createApiResponse({ data: response }, limits, rateLimit)

    return NextResponse.json(apiResponse.body, { headers: apiResponse.headers })
  } catch (error: any) {
    logger.error(`[${requestId}] Log details fetch error`, { error: error.message })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/wand/route.ts
Signals: Next.js

```typescript
import { db } from '@sim/db'
import { userStats, workflow } from '@sim/db/schema'
import { eq, sql } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import OpenAI, { AzureOpenAI } from 'openai'
import { getSession } from '@/lib/auth'
import { checkAndBillOverageThreshold } from '@/lib/billing/threshold-billing'
import { env } from '@/lib/core/config/env'
import { getCostMultiplier, isBillingEnabled } from '@/lib/core/config/feature-flags'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { verifyWorkspaceMembership } from '@/app/api/workflows/utils'
import { getModelPricing } from '@/providers/utils'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 60

const logger = createLogger('WandGenerateAPI')

const azureApiKey = env.AZURE_OPENAI_API_KEY
const azureEndpoint = env.AZURE_OPENAI_ENDPOINT
const azureApiVersion = env.AZURE_OPENAI_API_VERSION
const wandModelName = env.WAND_OPENAI_MODEL_NAME || 'gpt-4o'
const openaiApiKey = env.OPENAI_API_KEY

const useWandAzure = azureApiKey && azureEndpoint && azureApiVersion

const client = useWandAzure
  ? new AzureOpenAI({
      apiKey: azureApiKey,
      apiVersion: azureApiVersion,
      endpoint: azureEndpoint,
    })
  : openaiApiKey
    ? new OpenAI({
        apiKey: openaiApiKey,
      })
    : null

if (!useWandAzure && !openaiApiKey) {
  logger.warn(
    'Neither Azure OpenAI nor OpenAI API key found. Wand generation API will not function.'
  )
} else {
  logger.info(`Using ${useWandAzure ? 'Azure OpenAI' : 'OpenAI'} for wand generation`)
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface RequestBody {
  prompt: string
  systemPrompt?: string
  stream?: boolean
  history?: ChatMessage[]
  workflowId?: string
}

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value)
  } catch {
    return '[unserializable]'
  }
}

async function updateUserStatsForWand(
  workflowId: string,
  usage: {
    prompt_tokens?: number
    completion_tokens?: number
    total_tokens?: number
  },
  requestId: string
): Promise<void> {
  if (!isBillingEnabled) {
    logger.debug(`[${requestId}] Billing is disabled, skipping wand usage cost update`)
    return
  }

  if (!usage.total_tokens || usage.total_tokens <= 0) {
    logger.debug(`[${requestId}] No tokens to update in user stats`)
    return
  }

  try {
    const [workflowRecord] = await db
      .select({ userId: workflow.userId })
      .from(workflow)
      .where(eq(workflow.id, workflowId))
      .limit(1)

    if (!workflowRecord?.userId) {
      logger.warn(
        `[${requestId}] No user found for workflow ${workflowId}, cannot update user stats`
      )
      return
    }

    const userId = workflowRecord.userId
    const totalTokens = usage.total_tokens || 0
    const promptTokens = usage.prompt_tokens || 0
    const completionTokens = usage.completion_tokens || 0

    const modelName = useWandAzure ? wandModelName : 'gpt-4o'
    const pricing = getModelPricing(modelName)

    const costMultiplier = getCostMultiplier()
    let modelCost = 0

    if (pricing) {
      const inputCost = (promptTokens / 1000000) * pricing.input
      const outputCost = (completionTokens / 1000000) * pricing.output
      modelCost = inputCost + outputCost
    } else {
      modelCost = (promptTokens / 1000000) * 0.005 + (completionTokens / 1000000) * 0.015
    }

    const costToStore = modelCost * costMultiplier

    await db
      .update(userStats)
      .set({
        totalTokensUsed: sql`total_tokens_used + ${totalTokens}`,
        totalCost: sql`total_cost + ${costToStore}`,
        currentPeriodCost: sql`current_period_cost + ${costToStore}`,
        lastActive: new Date(),
      })
      .where(eq(userStats.userId, userId))

    logger.debug(`[${requestId}] Updated user stats for wand usage`, {
      userId,
      tokensUsed: totalTokens,
      costAdded: costToStore,
    })

    await checkAndBillOverageThreshold(userId)
  } catch (error) {
    logger.error(`[${requestId}] Failed to update user stats for wand usage`, error)
  }
}

export async function POST(req: NextRequest) {
  const requestId = generateRequestId()
  logger.info(`[${requestId}] Received wand generation request`)

  const session = await getSession()
  if (!session?.user?.id) {
    logger.warn(`[${requestId}] Unauthorized wand generation attempt`)
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  if (!client) {
    logger.error(`[${requestId}] AI client not initialized. Missing API key.`)
    return NextResponse.json(
      { success: false, error: 'Wand generation service is not configured.' },
      { status: 503 }
    )
  }

  try {
    const body = (await req.json()) as RequestBody

    const { prompt, systemPrompt, stream = false, history = [], workflowId } = body

    if (!prompt) {
      logger.warn(`[${requestId}] Invalid request: Missing prompt.`)
      return NextResponse.json(
        { success: false, error: 'Missing required field: prompt.' },
        { status: 400 }
      )
    }

    if (workflowId) {
      const [workflowRecord] = await db
        .select({ workspaceId: workflow.workspaceId, userId: workflow.userId })
        .from(workflow)
        .where(eq(workflow.id, workflowId))
        .limit(1)

      if (!workflowRecord) {
        logger.warn(`[${requestId}] Workflow not found: ${workflowId}`)
        return NextResponse.json({ success: false, error: 'Workflow not found' }, { status: 404 })
      }

      if (workflowRecord.workspaceId) {
        const permission = await verifyWorkspaceMembership(
          session.user.id,
          workflowRecord.workspaceId
        )
        if (!permission || (permission !== 'admin' && permission !== 'write')) {
          logger.warn(
            `[${requestId}] User ${session.user.id} does not have write access to workspace for workflow ${workflowId}`
          )
          return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
        }
      } else if (workflowRecord.userId !== session.user.id) {
        logger.warn(`[${requestId}] User ${session.user.id} does not own workflow ${workflowId}`)
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
      }
    }

    const finalSystemPrompt =
      systemPrompt ||
      'You are a helpful AI assistant. Generate content exactly as requested by the user.'

    const messages: ChatMessage[] = [{ role: 'system', content: finalSystemPrompt }]

    messages.push(...history.filter((msg) => msg.role !== 'system'))

    messages.push({ role: 'user', content: prompt })

    logger.debug(
      `[${requestId}] Calling ${useWandAzure ? 'Azure OpenAI' : 'OpenAI'} API for wand generation`,
      {
        stream,
        historyLength: history.length,
        endpoint: useWandAzure ? azureEndpoint : 'api.openai.com',
        model: useWandAzure ? wandModelName : 'gpt-4o',
        apiVersion: useWandAzure ? azureApiVersion : 'N/A',
      }
    )

    if (stream) {
      try {
        logger.debug(
          `[${requestId}] Starting streaming request to ${useWandAzure ? 'Azure OpenAI' : 'OpenAI'}`
        )

        logger.info(
          `[${requestId}] About to create stream with model: ${useWandAzure ? wandModelName : 'gpt-4o'}`
        )

        const apiUrl = useWandAzure
          ? `${azureEndpoint}/openai/deployments/${wandModelName}/chat/completions?api-version=${azureApiVersion}`
          : 'https://api.openai.com/v1/chat/completions'

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        }

        if (useWandAzure) {
          headers['api-key'] = azureApiKey!
        } else {
          headers.Authorization = `Bearer ${openaiApiKey}`
        }

        logger.debug(`[${requestId}] Making streaming request to: ${apiUrl}`)

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            model: useWandAzure ? wandModelName : 'gpt-4o',
            messages: messages,
            temperature: 0.2,
            max_tokens: 10000,
            stream: true,
            stream_options: { include_usage: true },
          }),
        })

        if (!response.ok) {
          const errorText = await response.text()
          logger.error(`[${requestId}] API request failed`, {
            status: response.status,
            statusText: response.statusText,
            error: errorText,
          })
          throw new Error(`API request failed: ${response.status} ${response.statusText}`)
        }

        logger.info(`[${requestId}] Stream response received, starting processing`)

        const encoder = new TextEncoder()
        const decoder = new TextDecoder()

        const readable = new ReadableStream({
          async start(controller) {
            const reader = response.body?.getReader()
            if (!reader) {
              controller.close()
              return
            }

            try {
              let buffer = ''
              let chunkCount = 0
              let finalUsage: any = null

              while (true) {
                const { done, value } = await reader.read()

                if (done) {
                  logger.info(`[${requestId}] Stream completed. Total chunks: ${chunkCount}`)
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`))
                  controller.close()
                  break
                }

                buffer += decoder.decode(value, { stream: true })

                const lines = buffer.split('\n')
                buffer = lines.pop() || ''

                for (const line of lines) {
                  if (line.startsWith('data: ')) {
                    const data = line.slice(6).trim()

                    if (data === '[DONE]') {
                      logger.info(`[${requestId}] Received [DONE] signal`)
                      controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`)
                      )
                      controller.close()
                      return
                    }

                    try {
                      const parsed = JSON.parse(data)
                      const content = parsed.choices?.[0]?.delta?.content

                      if (content) {
                        chunkCount++
                        if (chunkCount === 1) {
                          logger.info(`[${requestId}] Received first content chunk`)
                        }

                        controller.enqueue(
                          encoder.encode(`data: ${JSON.stringify({ chunk: content })}\n\n`)
                        )
                      }

                      if (parsed.usage) {
                        finalUsage = parsed.usage
                        logger.info(
                          `[${requestId}] Received usage data: ${JSON.stringify(parsed.usage)}`
                        )
                      }

                      if (chunkCount % 10 === 0) {
                        logger.debug(`[${requestId}] Processed ${chunkCount} chunks`)
                      }
                    } catch (parseError) {
                      logger.debug(
                        `[${requestId}] Skipped non-JSON line: ${data.substring(0, 100)}`
                      )
                    }
                  }
                }
              }

              logger.info(`[${requestId}] Wand generation streaming completed successfully`)

              if (finalUsage && workflowId) {
                await updateUserStatsForWand(workflowId, finalUsage, requestId)
              }
            } catch (streamError: any) {
              logger.error(`[${requestId}] Streaming error`, {
                name: streamError?.name,
                message: streamError?.message || 'Unknown error',
                stack: streamError?.stack,
              })

              const errorData = `data: ${JSON.stringify({ error: 'Streaming failed', done: true })}\n\n`
              controller.enqueue(encoder.encode(errorData))
              controller.close()
            } finally {
              reader.releaseLock()
            }
          },
        })

        return new Response(readable, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            Connection: 'keep-alive',
            'X-Accel-Buffering': 'no',
          },
        })
      } catch (error: any) {
        logger.error(`[${requestId}] Failed to create stream`, {
          name: error?.name,
          message: error?.message || 'Unknown error',
          code: error?.code,
          status: error?.status,
          responseStatus: error?.response?.status,
          responseData: error?.response?.data ? safeStringify(error.response.data) : undefined,
          stack: error?.stack,
          useWandAzure,
          model: useWandAzure ? wandModelName : 'gpt-4o',
          endpoint: useWandAzure ? azureEndpoint : 'api.openai.com',
          apiVersion: useWandAzure ? azureApiVersion : 'N/A',
        })

        return NextResponse.json(
          { success: false, error: 'An error occurred during wand generation streaming.' },
          { status: 500 }
        )
      }
    }

    const completion = await client.chat.completions.create({
      model: useWandAzure ? wandModelName : 'gpt-4o',
      messages: messages,
      temperature: 0.3,
      max_tokens: 10000,
    })

    const generatedContent = completion.choices[0]?.message?.content?.trim()

    if (!generatedContent) {
      logger.error(
        `[${requestId}] ${useWandAzure ? 'Azure OpenAI' : 'OpenAI'} response was empty or invalid.`
      )
      return NextResponse.json(
        { success: false, error: 'Failed to generate content. AI response was empty.' },
        { status: 500 }
      )
    }

    logger.info(`[${requestId}] Wand generation successful`)

    if (completion.usage && workflowId) {
      await updateUserStatsForWand(workflowId, completion.usage, requestId)
    }

    return NextResponse.json({ success: true, content: generatedContent })
  } catch (error: any) {
    logger.error(`[${requestId}] Wand generation failed`, {
      name: error?.name,
      message: error?.message || 'Unknown error',
      code: error?.code,
      status: error?.status,
      responseStatus: error instanceof OpenAI.APIError ? error.status : error?.response?.status,
      responseData: (error as any)?.response?.data
        ? safeStringify((error as any).response.data)
        : undefined,
      stack: error?.stack,
      useWandAzure,
      model: useWandAzure ? wandModelName : 'gpt-4o',
      endpoint: useWandAzure ? azureEndpoint : 'api.openai.com',
      apiVersion: useWandAzure ? azureApiVersion : 'N/A',
    })

    let clientErrorMessage = 'Wand generation failed. Please try again later.'
    let status = 500

    if (error instanceof OpenAI.APIError) {
      status = error.status || 500
      logger.error(
        `[${requestId}] ${useWandAzure ? 'Azure OpenAI' : 'OpenAI'} API Error: ${status} - ${error.message}`
      )

      if (status === 401) {
        clientErrorMessage = 'Authentication failed. Please check your API key configuration.'
      } else if (status === 429) {
        clientErrorMessage = 'Rate limit exceeded. Please try again later.'
      } else if (status >= 500) {
        clientErrorMessage =
          'The wand generation service is currently unavailable. Please try again later.'
      }
    } else if (useWandAzure && error.message?.includes('DeploymentNotFound')) {
      clientErrorMessage =
        'Azure OpenAI deployment not found. Please check your model deployment configuration.'
      status = 404
    }

    return NextResponse.json(
      {
        success: false,
        error: clientErrorMessage,
      },
      { status }
    )
  }
}
```

--------------------------------------------------------------------------------

````
