---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 330
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 330 of 933)

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
Location: sim-main/apps/sim/app/api/workflows/[id]/log/route.ts
Signals: Next.js, Zod

```typescript
import type { NextRequest } from 'next/server'
import { z } from 'zod'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { LoggingSession } from '@/lib/logs/execution/logging-session'
import { buildTraceSpans } from '@/lib/logs/execution/trace-spans/trace-spans'
import { validateWorkflowAccess } from '@/app/api/workflows/middleware'
import { createErrorResponse, createSuccessResponse } from '@/app/api/workflows/utils'
import type { ExecutionResult } from '@/executor/types'

const logger = createLogger('WorkflowLogAPI')

const postBodySchema = z.object({
  logs: z.array(z.any()).optional(),
  executionId: z.string().min(1, 'Execution ID is required').optional(),
  result: z
    .object({
      success: z.boolean(),
      error: z.string().optional(),
      output: z.any(),
      metadata: z
        .object({
          source: z.string().optional(),
          duration: z.number().optional(),
        })
        .optional(),
    })
    .optional(),
})

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = generateRequestId()
  const { id } = await params

  try {
    const accessValidation = await validateWorkflowAccess(request, id, false)
    if (accessValidation.error) {
      logger.warn(
        `[${requestId}] Workflow access validation failed: ${accessValidation.error.message}`
      )
      return createErrorResponse(accessValidation.error.message, accessValidation.error.status)
    }

    const body = await request.json()
    const validation = postBodySchema.safeParse(body)

    if (!validation.success) {
      logger.warn(`[${requestId}] Invalid request body: ${validation.error.message}`)
      return createErrorResponse(validation.error.errors[0]?.message || 'Invalid request body', 400)
    }

    const { logs, executionId, result } = validation.data

    if (result) {
      if (!executionId) {
        logger.warn(`[${requestId}] Missing executionId for result logging`)
        return createErrorResponse('executionId is required when logging results', 400)
      }

      logger.info(`[${requestId}] Persisting execution result for workflow: ${id}`, {
        executionId,
        success: result.success,
      })

      const isChatExecution = result.metadata?.source === 'chat'

      const triggerType = isChatExecution ? 'chat' : 'manual'
      const loggingSession = new LoggingSession(id, executionId, triggerType, requestId)

      const userId = accessValidation.workflow.userId
      const workspaceId = accessValidation.workflow.workspaceId || ''

      await loggingSession.safeStart({
        userId,
        workspaceId,
        variables: {},
      })

      const resultWithOutput = {
        ...result,
        output: result.output ?? {},
      }

      const { traceSpans, totalDuration } = buildTraceSpans(resultWithOutput as ExecutionResult)

      if (result.success === false) {
        const message = result.error || 'Workflow execution failed'
        await loggingSession.safeCompleteWithError({
          endedAt: new Date().toISOString(),
          totalDurationMs: totalDuration || result.metadata?.duration || 0,
          error: { message },
          traceSpans,
        })
      } else {
        await loggingSession.safeComplete({
          endedAt: new Date().toISOString(),
          totalDurationMs: totalDuration || result.metadata?.duration || 0,
          finalOutput: result.output || {},
          traceSpans,
        })
      }

      return createSuccessResponse({
        message: 'Execution logs persisted successfully',
      })
    }

    if (!logs || !Array.isArray(logs) || logs.length === 0) {
      logger.warn(`[${requestId}] No logs provided for workflow: ${id}`)
      return createErrorResponse('No logs provided', 400)
    }

    logger.info(`[${requestId}] Persisting ${logs.length} logs for workflow: ${id}`, {
      executionId,
    })

    return createSuccessResponse({ message: 'Logs persisted successfully' })
  } catch (error: any) {
    logger.error(`[${requestId}] Error persisting logs for workflow: ${id}`, error)
    return createErrorResponse(error.message || 'Failed to persist logs', 500)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/workflows/[id]/paused/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { PauseResumeManager } from '@/lib/workflows/executor/human-in-the-loop-manager'
import { validateWorkflowAccess } from '@/app/api/workflows/middleware'

const queryParamsSchema = z.object({
  status: z.string().optional(),
})

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>
  }
) {
  const { id: workflowId } = await params

  const access = await validateWorkflowAccess(request, workflowId, false)
  if (access.error) {
    return NextResponse.json({ error: access.error.message }, { status: access.error.status })
  }

  const validation = queryParamsSchema.safeParse({
    status: request.nextUrl.searchParams.get('status'),
  })

  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.errors[0]?.message || 'Invalid query parameters' },
      { status: 400 }
    )
  }

  const { status: statusFilter } = validation.data

  const pausedExecutions = await PauseResumeManager.listPausedExecutions({
    workflowId,
    status: statusFilter,
  })

  return NextResponse.json({ pausedExecutions })
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/workflows/[id]/paused/[executionId]/route.ts
Signals: Next.js

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { PauseResumeManager } from '@/lib/workflows/executor/human-in-the-loop-manager'
import { validateWorkflowAccess } from '@/app/api/workflows/middleware'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string; executionId: string }>
  }
) {
  const { id: workflowId, executionId } = await params

  const access = await validateWorkflowAccess(request, workflowId, false)
  if (access.error) {
    return NextResponse.json({ error: access.error.message }, { status: access.error.status })
  }

  const detail = await PauseResumeManager.getPausedExecutionDetail({
    workflowId,
    executionId,
  })

  if (!detail) {
    return NextResponse.json({ error: 'Paused execution not found' }, { status: 404 })
  }

  return NextResponse.json(detail)
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/workflows/[id]/state/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import { webhook, workflow, workflowSchedule } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { env } from '@/lib/core/config/env'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { extractAndPersistCustomTools } from '@/lib/workflows/persistence/custom-tools-persistence'
import { saveWorkflowToNormalizedTables } from '@/lib/workflows/persistence/utils'
import { sanitizeAgentToolsInBlocks } from '@/lib/workflows/sanitization/validation'
import {
  calculateNextRunTime,
  generateCronExpression,
  getScheduleTimeValues,
  validateCronExpression,
} from '@/lib/workflows/schedules/utils'
import { getWorkflowAccessContext } from '@/lib/workflows/utils'
import type { BlockState } from '@/stores/workflows/workflow/types'
import { generateLoopBlocks, generateParallelBlocks } from '@/stores/workflows/workflow/utils'
import { getTrigger } from '@/triggers'

const logger = createLogger('WorkflowStateAPI')

const PositionSchema = z.object({
  x: z.number(),
  y: z.number(),
})

const BlockDataSchema = z.object({
  parentId: z.string().optional(),
  extent: z.literal('parent').optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  collection: z.unknown().optional(),
  count: z.number().optional(),
  loopType: z.enum(['for', 'forEach', 'while', 'doWhile']).optional(),
  whileCondition: z.string().optional(),
  doWhileCondition: z.string().optional(),
  parallelType: z.enum(['collection', 'count']).optional(),
  type: z.string().optional(),
})

const SubBlockStateSchema = z.object({
  id: z.string(),
  type: z.string(),
  value: z.any(),
})

const BlockOutputSchema = z.any()

const BlockStateSchema = z.object({
  id: z.string(),
  type: z.string(),
  name: z.string(),
  position: PositionSchema,
  subBlocks: z.record(SubBlockStateSchema),
  outputs: z.record(BlockOutputSchema),
  enabled: z.boolean(),
  horizontalHandles: z.boolean().optional(),
  height: z.number().optional(),
  advancedMode: z.boolean().optional(),
  triggerMode: z.boolean().optional(),
  data: BlockDataSchema.optional(),
})

const EdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  sourceHandle: z.string().optional(),
  targetHandle: z.string().optional(),
  type: z.string().optional(),
  animated: z.boolean().optional(),
  style: z.record(z.any()).optional(),
  data: z.record(z.any()).optional(),
  label: z.string().optional(),
  labelStyle: z.record(z.any()).optional(),
  labelShowBg: z.boolean().optional(),
  labelBgStyle: z.record(z.any()).optional(),
  labelBgPadding: z.array(z.number()).optional(),
  labelBgBorderRadius: z.number().optional(),
  markerStart: z.string().optional(),
  markerEnd: z.string().optional(),
})

const LoopSchema = z.object({
  id: z.string(),
  nodes: z.array(z.string()),
  iterations: z.number(),
  loopType: z.enum(['for', 'forEach', 'while', 'doWhile']),
  forEachItems: z.union([z.array(z.any()), z.record(z.any()), z.string()]).optional(),
  whileCondition: z.string().optional(),
  doWhileCondition: z.string().optional(),
})

const ParallelSchema = z.object({
  id: z.string(),
  nodes: z.array(z.string()),
  distribution: z.union([z.array(z.any()), z.record(z.any()), z.string()]).optional(),
  count: z.number().optional(),
  parallelType: z.enum(['count', 'collection']).optional(),
})

const WorkflowStateSchema = z.object({
  blocks: z.record(BlockStateSchema),
  edges: z.array(EdgeSchema),
  loops: z.record(LoopSchema).optional(),
  parallels: z.record(ParallelSchema).optional(),
  lastSaved: z.number().optional(),
  isDeployed: z.boolean().optional(),
  deployedAt: z.coerce.date().optional(),
  variables: z.any().optional(), // Workflow variables
})

/**
 * PUT /api/workflows/[id]/state
 * Save complete workflow state to normalized database tables
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = generateRequestId()
  const startTime = Date.now()
  const { id: workflowId } = await params

  try {
    // Get the session
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized state update attempt for workflow ${workflowId}`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const body = await request.json()
    const state = WorkflowStateSchema.parse(body)

    // Fetch the workflow to check ownership/access
    const accessContext = await getWorkflowAccessContext(workflowId, userId)
    const workflowData = accessContext?.workflow

    if (!workflowData) {
      logger.warn(`[${requestId}] Workflow ${workflowId} not found for state update`)
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }

    // Check if user has permission to update this workflow
    const canUpdate =
      accessContext?.isOwner ||
      (workflowData.workspaceId
        ? accessContext?.workspacePermission === 'write' ||
          accessContext?.workspacePermission === 'admin'
        : false)

    if (!canUpdate) {
      logger.warn(
        `[${requestId}] User ${userId} denied permission to update workflow state ${workflowId}`
      )
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Sanitize custom tools in agent blocks before saving
    const { blocks: sanitizedBlocks, warnings } = sanitizeAgentToolsInBlocks(state.blocks as any)

    // Save to normalized tables
    // Ensure all required fields are present for WorkflowState type
    // Filter out blocks without type or name before saving
    const filteredBlocks = Object.entries(sanitizedBlocks).reduce(
      (acc, [blockId, block]: [string, any]) => {
        if (block.type && block.name) {
          // Ensure all required fields are present
          acc[blockId] = {
            ...block,
            enabled: block.enabled !== undefined ? block.enabled : true,
            horizontalHandles:
              block.horizontalHandles !== undefined ? block.horizontalHandles : true,
            height: block.height !== undefined ? block.height : 0,
            subBlocks: block.subBlocks || {},
            outputs: block.outputs || {},
          }
        }
        return acc
      },
      {} as typeof state.blocks
    )

    const typedBlocks = filteredBlocks as Record<string, BlockState>
    const canonicalLoops = generateLoopBlocks(typedBlocks)
    const canonicalParallels = generateParallelBlocks(typedBlocks)

    const workflowState = {
      blocks: filteredBlocks,
      edges: state.edges,
      loops: canonicalLoops,
      parallels: canonicalParallels,
      lastSaved: state.lastSaved || Date.now(),
      isDeployed: state.isDeployed || false,
      deployedAt: state.deployedAt,
    }

    const saveResult = await saveWorkflowToNormalizedTables(workflowId, workflowState as any)

    if (!saveResult.success) {
      logger.error(`[${requestId}] Failed to save workflow ${workflowId} state:`, saveResult.error)
      return NextResponse.json(
        { error: 'Failed to save workflow state', details: saveResult.error },
        { status: 500 }
      )
    }

    await syncWorkflowWebhooks(workflowId, workflowState.blocks)
    await syncWorkflowSchedules(workflowId, workflowState.blocks)

    // Extract and persist custom tools to database
    try {
      const workspaceId = workflowData.workspaceId
      if (workspaceId) {
        const { saved, errors } = await extractAndPersistCustomTools(
          workflowState,
          workspaceId,
          userId
        )

        if (saved > 0) {
          logger.info(`[${requestId}] Persisted ${saved} custom tool(s) to database`, {
            workflowId,
          })
        }

        if (errors.length > 0) {
          logger.warn(`[${requestId}] Some custom tools failed to persist`, { errors, workflowId })
        }
      } else {
        logger.warn(
          `[${requestId}] Workflow has no workspaceId, skipping custom tools persistence`,
          {
            workflowId,
          }
        )
      }
    } catch (error) {
      logger.error(`[${requestId}] Failed to persist custom tools`, { error, workflowId })
    }

    // Update workflow's lastSynced timestamp and variables if provided
    const updateData: any = {
      lastSynced: new Date(),
      updatedAt: new Date(),
    }

    // If variables are provided in the state, update them in the workflow record
    if (state.variables !== undefined) {
      updateData.variables = state.variables
    }

    await db.update(workflow).set(updateData).where(eq(workflow.id, workflowId))

    const elapsed = Date.now() - startTime
    logger.info(`[${requestId}] Successfully saved workflow ${workflowId} state in ${elapsed}ms`)

    try {
      const socketUrl = env.SOCKET_SERVER_URL || 'http://localhost:3002'
      const notifyResponse = await fetch(`${socketUrl}/api/workflow-updated`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId }),
      })

      if (!notifyResponse.ok) {
        logger.warn(
          `[${requestId}] Failed to notify Socket.IO server about workflow ${workflowId} update`
        )
      }
    } catch (notificationError) {
      logger.warn(
        `[${requestId}] Error notifying Socket.IO server about workflow ${workflowId} update`,
        notificationError
      )
    }

    return NextResponse.json({ success: true, warnings }, { status: 200 })
  } catch (error: any) {
    const elapsed = Date.now() - startTime
    logger.error(
      `[${requestId}] Error saving workflow ${workflowId} state after ${elapsed}ms`,
      error
    )

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function getSubBlockValue<T = unknown>(block: BlockState, subBlockId: string): T | undefined {
  const value = block.subBlocks?.[subBlockId]?.value
  if (value === undefined || value === null) {
    return undefined
  }
  return value as T
}

async function syncWorkflowWebhooks(
  workflowId: string,
  blocks: Record<string, any>
): Promise<void> {
  await syncBlockResources(workflowId, blocks, {
    resourceName: 'webhook',
    subBlockId: 'webhookId',
    buildMetadata: buildWebhookMetadata,
    applyMetadata: upsertWebhookRecord,
  })
}

type ScheduleBlockInput = Parameters<typeof getScheduleTimeValues>[0]

async function syncWorkflowSchedules(
  workflowId: string,
  blocks: Record<string, any>
): Promise<void> {
  await syncBlockResources(workflowId, blocks, {
    resourceName: 'schedule',
    subBlockId: 'scheduleId',
    buildMetadata: buildScheduleMetadata,
    applyMetadata: upsertScheduleRecord,
  })
}

interface ScheduleMetadata {
  cronExpression: string | null
  nextRunAt: Date | null
  timezone: string
}

function buildScheduleMetadata(block: BlockState): ScheduleMetadata | null {
  const scheduleType = getSubBlockValue<string>(block, 'scheduleType') || 'daily'
  const scheduleBlock = convertToScheduleBlock(block)

  const scheduleValues = getScheduleTimeValues(scheduleBlock)
  const sanitizedValues =
    scheduleType !== 'custom' ? { ...scheduleValues, cronExpression: null } : scheduleValues

  try {
    const cronExpression = generateCronExpression(scheduleType, sanitizedValues)
    const timezone = scheduleValues.timezone || 'UTC'

    if (cronExpression) {
      const validation = validateCronExpression(cronExpression, timezone)
      if (!validation.isValid) {
        logger.warn('Invalid cron expression while syncing schedule', {
          blockId: block.id,
          cronExpression,
          error: validation.error,
        })
        return null
      }
    }

    const nextRunAt = calculateNextRunTime(scheduleType, sanitizedValues)

    return {
      cronExpression,
      timezone,
      nextRunAt,
    }
  } catch (error) {
    logger.error('Failed to build schedule metadata during sync', {
      blockId: block.id,
      error,
    })
    return null
  }
}

function convertToScheduleBlock(block: BlockState): ScheduleBlockInput {
  const subBlocks: ScheduleBlockInput['subBlocks'] = {}

  Object.entries(block.subBlocks || {}).forEach(([id, subBlock]) => {
    subBlocks[id] = { value: stringifySubBlockValue(subBlock?.value) }
  })

  return {
    type: block.type,
    subBlocks,
  }
}

interface WebhookMetadata {
  triggerPath: string
  provider: string | null
  providerConfig: Record<string, any>
}

function buildWebhookMetadata(block: BlockState): WebhookMetadata | null {
  const triggerId =
    getSubBlockValue<string>(block, 'triggerId') ||
    getSubBlockValue<string>(block, 'selectedTriggerId')
  const triggerConfig = getSubBlockValue<Record<string, any>>(block, 'triggerConfig') || {}
  const triggerCredentials = getSubBlockValue<string>(block, 'triggerCredentials')
  const triggerPath = getSubBlockValue<string>(block, 'triggerPath') || block.id

  const triggerDef = triggerId ? getTrigger(triggerId) : undefined
  const provider = triggerDef?.provider || null

  const providerConfig = {
    ...(typeof triggerConfig === 'object' ? triggerConfig : {}),
    ...(triggerCredentials ? { credentialId: triggerCredentials } : {}),
    ...(triggerId ? { triggerId } : {}),
  }

  return {
    triggerPath,
    provider,
    providerConfig,
  }
}

async function upsertWebhookRecord(
  workflowId: string,
  block: BlockState,
  webhookId: string,
  metadata: WebhookMetadata
): Promise<void> {
  const [existing] = await db.select().from(webhook).where(eq(webhook.id, webhookId)).limit(1)

  if (existing) {
    const needsUpdate =
      existing.blockId !== block.id ||
      existing.workflowId !== workflowId ||
      existing.path !== metadata.triggerPath

    if (needsUpdate) {
      await db
        .update(webhook)
        .set({
          workflowId,
          blockId: block.id,
          path: metadata.triggerPath,
          provider: metadata.provider || existing.provider,
          providerConfig: Object.keys(metadata.providerConfig).length
            ? metadata.providerConfig
            : existing.providerConfig,
          isActive: true,
          updatedAt: new Date(),
        })
        .where(eq(webhook.id, webhookId))
    }
    return
  }

  await db.insert(webhook).values({
    id: webhookId,
    workflowId,
    blockId: block.id,
    path: metadata.triggerPath,
    provider: metadata.provider,
    providerConfig: metadata.providerConfig,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  logger.info('Recreated missing webhook after workflow save', {
    workflowId,
    blockId: block.id,
    webhookId,
  })
}

async function upsertScheduleRecord(
  workflowId: string,
  block: BlockState,
  scheduleId: string,
  metadata: ScheduleMetadata
): Promise<void> {
  const now = new Date()
  const [existing] = await db
    .select({
      id: workflowSchedule.id,
      nextRunAt: workflowSchedule.nextRunAt,
    })
    .from(workflowSchedule)
    .where(eq(workflowSchedule.id, scheduleId))
    .limit(1)

  if (existing) {
    await db
      .update(workflowSchedule)
      .set({
        workflowId,
        blockId: block.id,
        cronExpression: metadata.cronExpression,
        nextRunAt: metadata.nextRunAt ?? existing.nextRunAt,
        timezone: metadata.timezone,
        updatedAt: now,
      })
      .where(eq(workflowSchedule.id, scheduleId))
    return
  }

  await db.insert(workflowSchedule).values({
    id: scheduleId,
    workflowId,
    blockId: block.id,
    cronExpression: metadata.cronExpression,
    nextRunAt: metadata.nextRunAt ?? null,
    triggerType: 'schedule',
    timezone: metadata.timezone,
    status: 'active',
    failedCount: 0,
    createdAt: now,
    updatedAt: now,
  })

  logger.info('Recreated missing schedule after workflow save', {
    workflowId,
    blockId: block.id,
    scheduleId,
  })
}

interface BlockResourceSyncConfig<T> {
  resourceName: string
  subBlockId: string
  buildMetadata: (block: BlockState, resourceId: string) => T | null
  applyMetadata: (
    workflowId: string,
    block: BlockState,
    resourceId: string,
    metadata: T
  ) => Promise<void>
}

async function syncBlockResources<T>(
  workflowId: string,
  blocks: Record<string, any>,
  config: BlockResourceSyncConfig<T>
): Promise<void> {
  const blockEntries = Object.values(blocks || {}).filter(Boolean) as BlockState[]
  if (blockEntries.length === 0) return

  for (const block of blockEntries) {
    const resourceId = getSubBlockValue<string>(block, config.subBlockId)
    if (!resourceId) continue

    const metadata = config.buildMetadata(block, resourceId)
    if (!metadata) {
      logger.warn(`Skipping ${config.resourceName} sync due to invalid configuration`, {
        workflowId,
        blockId: block.id,
        resourceId,
        resourceName: config.resourceName,
      })
      continue
    }

    try {
      await config.applyMetadata(workflowId, block, resourceId, metadata)
    } catch (error) {
      logger.error(`Failed to sync ${config.resourceName}`, {
        workflowId,
        blockId: block.id,
        resourceId,
        resourceName: config.resourceName,
        error,
      })
    }
  }
}

function stringifySubBlockValue(value: unknown): string {
  if (value === undefined || value === null) {
    return ''
  }

  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  if (value instanceof Date) {
    return value.toISOString()
  }

  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/workflows/[id]/stats/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import { userStats, workflow } from '@sim/db/schema'
import { eq, sql } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('WorkflowStatsAPI')

const queryParamsSchema = z.object({
  runs: z.coerce.number().int().min(1).max(100).default(1),
})

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const searchParams = request.nextUrl.searchParams

  const validation = queryParamsSchema.safeParse({
    runs: searchParams.get('runs'),
  })

  if (!validation.success) {
    logger.error(`Invalid query parameters: ${validation.error.message}`)
    return NextResponse.json(
      {
        error:
          validation.error.errors[0]?.message ||
          'Invalid number of runs. Must be between 1 and 100.',
      },
      { status: 400 }
    )
  }

  const { runs } = validation.data

  try {
    const [workflowRecord] = await db.select().from(workflow).where(eq(workflow.id, id)).limit(1)

    if (!workflowRecord) {
      return NextResponse.json({ error: `Workflow ${id} not found` }, { status: 404 })
    }

    try {
      await db
        .update(workflow)
        .set({
          runCount: workflowRecord.runCount + runs,
          lastRunAt: new Date(),
        })
        .where(eq(workflow.id, id))
    } catch (error) {
      logger.error('Error updating workflow runCount:', error)
      throw error
    }

    try {
      const userStatsRecords = await db
        .select()
        .from(userStats)
        .where(eq(userStats.userId, workflowRecord.userId))

      if (userStatsRecords.length === 0) {
        await db.insert(userStats).values({
          id: crypto.randomUUID(),
          userId: workflowRecord.userId,
          totalManualExecutions: 0,
          totalApiCalls: 0,
          totalWebhookTriggers: 0,
          totalScheduledExecutions: 0,
          totalChatExecutions: 0,
          totalTokensUsed: 0,
          totalCost: '0.00',
          lastActive: sql`now()`,
        })
      } else {
        await db
          .update(userStats)
          .set({
            lastActive: sql`now()`,
          })
          .where(eq(userStats.userId, workflowRecord.userId))
      }
    } catch (error) {
      logger.error(`Error ensuring userStats for userId ${workflowRecord.userId}:`, error)
      // Don't rethrow - we want to continue even if this fails
    }

    return NextResponse.json({
      success: true,
      runsAdded: runs,
      newTotal: workflowRecord.runCount + runs,
    })
  } catch (error) {
    logger.error('Error updating workflow stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/workflows/[id]/status/route.ts
Signals: Next.js

```typescript
import { db, workflowDeploymentVersion } from '@sim/db'
import { and, desc, eq } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { loadWorkflowFromNormalizedTables } from '@/lib/workflows/persistence/utils'
import { hasWorkflowChanged } from '@/lib/workflows/utils'
import { validateWorkflowAccess } from '@/app/api/workflows/middleware'
import { createErrorResponse, createSuccessResponse } from '@/app/api/workflows/utils'

const logger = createLogger('WorkflowStatusAPI')

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = generateRequestId()

  try {
    const { id } = await params

    const validation = await validateWorkflowAccess(request, id, false)
    if (validation.error) {
      logger.warn(`[${requestId}] Workflow access validation failed: ${validation.error.message}`)
      return createErrorResponse(validation.error.message, validation.error.status)
    }

    // Check if the workflow has meaningful changes that would require redeployment
    let needsRedeployment = false

    if (validation.workflow.isDeployed) {
      // Get current state from normalized tables (same logic as deployment API)
      // Load current state from normalized tables using centralized helper
      const normalizedData = await loadWorkflowFromNormalizedTables(id)

      if (!normalizedData) {
        // Workflow exists but has no blocks in normalized tables (empty workflow or not migrated)
        // This is valid state - return success with no redeployment needed
        return createSuccessResponse({
          isDeployed: validation.workflow.isDeployed,
          deployedAt: validation.workflow.deployedAt,
          isPublished: validation.workflow.isPublished,
          needsRedeployment: false,
        })
      }

      const currentState = {
        blocks: normalizedData.blocks,
        edges: normalizedData.edges,
        loops: normalizedData.loops,
        parallels: normalizedData.parallels,
        lastSaved: Date.now(),
      }

      const [active] = await db
        .select({ state: workflowDeploymentVersion.state })
        .from(workflowDeploymentVersion)
        .where(
          and(
            eq(workflowDeploymentVersion.workflowId, id),
            eq(workflowDeploymentVersion.isActive, true)
          )
        )
        .orderBy(desc(workflowDeploymentVersion.createdAt))
        .limit(1)

      if (active?.state) {
        needsRedeployment = hasWorkflowChanged(currentState as any, active.state as any)
      }
    }

    return createSuccessResponse({
      isDeployed: validation.workflow.isDeployed,
      deployedAt: validation.workflow.deployedAt,
      needsRedeployment,
    })
  } catch (error) {
    logger.error(`[${requestId}] Error getting status for workflow: ${(await params).id}`, error)
    return createErrorResponse('Failed to get status', 500)
  }
}
```

--------------------------------------------------------------------------------

````
