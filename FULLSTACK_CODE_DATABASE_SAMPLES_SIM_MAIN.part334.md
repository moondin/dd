---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 334
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 334 of 933)

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
Location: sim-main/apps/sim/app/api/workspaces/[id]/files/[fileId]/download/route.ts
Signals: Next.js

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { getWorkspaceFile } from '@/lib/uploads/contexts/workspace'
import { verifyWorkspaceMembership } from '@/app/api/workflows/utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('WorkspaceFileDownloadAPI')

/**
 * POST /api/workspaces/[id]/files/[fileId]/download
 * Return authenticated file serve URL (requires read permission)
 * Uses /api/files/serve endpoint which enforces authentication and context
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; fileId: string }> }
) {
  const requestId = generateRequestId()
  const { id: workspaceId, fileId } = await params

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userPermission = await verifyWorkspaceMembership(session.user.id, workspaceId)
    if (!userPermission) {
      logger.warn(
        `[${requestId}] User ${session.user.id} lacks permission for workspace ${workspaceId}`
      )
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const fileRecord = await getWorkspaceFile(workspaceId, fileId)
    if (!fileRecord) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    const { getBaseUrl } = await import('@/lib/core/utils/urls')
    const serveUrl = `${getBaseUrl()}/api/files/serve/${encodeURIComponent(fileRecord.key)}?context=workspace`
    const viewerUrl = `${getBaseUrl()}/workspace/${workspaceId}/files/${fileId}/view`

    logger.info(`[${requestId}] Generated download URL for workspace file: ${fileRecord.name}`)

    return NextResponse.json({
      success: true,
      downloadUrl: serveUrl,
      viewerUrl: viewerUrl,
      fileName: fileRecord.name,
      expiresIn: null,
    })
  } catch (error) {
    logger.error(`[${requestId}] Error generating download URL:`, error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate download URL',
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/workspaces/[id]/metrics/executions/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import { pausedExecutions, permissions, workflow, workflowExecutionLogs } from '@sim/db/schema'
import { and, eq, gte, inArray, isNotNull, isNull, lte, or, type SQL, sql } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('MetricsExecutionsAPI')

const QueryParamsSchema = z.object({
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  segments: z.coerce.number().min(1).max(200).default(72),
  workflowIds: z.string().optional(),
  folderIds: z.string().optional(),
  triggers: z.string().optional(),
  level: z.string().optional(), // Supports comma-separated values: 'error,running'
})

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: workspaceId } = await params
    const { searchParams } = new URL(request.url)
    const qp = QueryParamsSchema.parse(Object.fromEntries(searchParams.entries()))
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = session.user.id

    const end = qp.endTime ? new Date(qp.endTime) : new Date()
    const start = qp.startTime
      ? new Date(qp.startTime)
      : new Date(end.getTime() - 24 * 60 * 60 * 1000)
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end) {
      return NextResponse.json({ error: 'Invalid time range' }, { status: 400 })
    }

    const segments = qp.segments
    const totalMs = Math.max(1, end.getTime() - start.getTime())
    const segmentMs = Math.max(1, Math.floor(totalMs / Math.max(1, segments)))

    const [permission] = await db
      .select()
      .from(permissions)
      .where(
        and(
          eq(permissions.entityType, 'workspace'),
          eq(permissions.entityId, workspaceId),
          eq(permissions.userId, userId)
        )
      )
      .limit(1)
    if (!permission) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    const wfWhere = [eq(workflow.workspaceId, workspaceId)] as any[]
    if (qp.folderIds) {
      const folderList = qp.folderIds.split(',').filter(Boolean)
      wfWhere.push(inArray(workflow.folderId, folderList))
    }
    if (qp.workflowIds) {
      const wfList = qp.workflowIds.split(',').filter(Boolean)
      wfWhere.push(inArray(workflow.id, wfList))
    }

    const workflows = await db
      .select({ id: workflow.id, name: workflow.name })
      .from(workflow)
      .where(and(...wfWhere))

    if (workflows.length === 0) {
      return NextResponse.json({
        workflows: [],
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        segmentMs,
      })
    }

    const workflowIdList = workflows.map((w) => w.id)

    const logWhere = [
      inArray(workflowExecutionLogs.workflowId, workflowIdList),
      gte(workflowExecutionLogs.startedAt, start),
      lte(workflowExecutionLogs.startedAt, end),
    ] as SQL[]
    if (qp.triggers) {
      const t = qp.triggers.split(',').filter(Boolean)
      logWhere.push(inArray(workflowExecutionLogs.trigger, t))
    }

    // Handle level filtering with support for derived statuses and multiple selections
    if (qp.level && qp.level !== 'all') {
      const levels = qp.level.split(',').filter(Boolean)
      const levelConditions: SQL[] = []

      for (const level of levels) {
        if (level === 'error') {
          levelConditions.push(eq(workflowExecutionLogs.level, 'error'))
        } else if (level === 'info') {
          // Completed info logs only
          const condition = and(
            eq(workflowExecutionLogs.level, 'info'),
            isNotNull(workflowExecutionLogs.endedAt)
          )
          if (condition) levelConditions.push(condition)
        } else if (level === 'running') {
          // Running logs: info level with no endedAt
          const condition = and(
            eq(workflowExecutionLogs.level, 'info'),
            isNull(workflowExecutionLogs.endedAt)
          )
          if (condition) levelConditions.push(condition)
        } else if (level === 'pending') {
          // Pending logs: info level with pause status indicators
          const condition = and(
            eq(workflowExecutionLogs.level, 'info'),
            or(
              sql`(${pausedExecutions.totalPauseCount} > 0 AND ${pausedExecutions.resumedCount} < ${pausedExecutions.totalPauseCount})`,
              and(
                isNotNull(pausedExecutions.status),
                sql`${pausedExecutions.status} != 'fully_resumed'`
              )
            )
          )
          if (condition) levelConditions.push(condition)
        }
      }

      if (levelConditions.length > 0) {
        const combinedCondition =
          levelConditions.length === 1 ? levelConditions[0] : or(...levelConditions)
        if (combinedCondition) logWhere.push(combinedCondition)
      }
    }

    const logs = await db
      .select({
        workflowId: workflowExecutionLogs.workflowId,
        level: workflowExecutionLogs.level,
        startedAt: workflowExecutionLogs.startedAt,
        endedAt: workflowExecutionLogs.endedAt,
        totalDurationMs: workflowExecutionLogs.totalDurationMs,
        pausedTotalPauseCount: pausedExecutions.totalPauseCount,
        pausedResumedCount: pausedExecutions.resumedCount,
        pausedStatus: pausedExecutions.status,
      })
      .from(workflowExecutionLogs)
      .leftJoin(
        pausedExecutions,
        eq(pausedExecutions.executionId, workflowExecutionLogs.executionId)
      )
      .where(and(...logWhere))

    type Bucket = {
      timestamp: string
      totalExecutions: number
      successfulExecutions: number
      durations: number[]
    }

    const wfIdToBuckets = new Map<string, Bucket[]>()
    for (const wf of workflows) {
      const buckets: Bucket[] = Array.from({ length: segments }, (_, i) => ({
        timestamp: new Date(start.getTime() + i * segmentMs).toISOString(),
        totalExecutions: 0,
        successfulExecutions: 0,
        durations: [],
      }))
      wfIdToBuckets.set(wf.id, buckets)
    }

    for (const log of logs) {
      const idx = Math.min(
        segments - 1,
        Math.max(0, Math.floor((log.startedAt.getTime() - start.getTime()) / segmentMs))
      )
      const buckets = wfIdToBuckets.get(log.workflowId)
      if (!buckets) continue
      const b = buckets[idx]
      b.totalExecutions += 1
      if ((log.level || '').toLowerCase() !== 'error') b.successfulExecutions += 1
      if (typeof log.totalDurationMs === 'number') b.durations.push(log.totalDurationMs)
    }

    function percentile(arr: number[], p: number): number {
      if (arr.length === 0) return 0
      const sorted = [...arr].sort((a, b) => a - b)
      const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * (sorted.length - 1)))
      return sorted[idx]
    }

    const result = workflows.map((wf) => {
      const buckets = wfIdToBuckets.get(wf.id) as Bucket[]
      const segmentsOut = buckets.map((b) => {
        const avg =
          b.durations.length > 0
            ? Math.round(b.durations.reduce((s, d) => s + d, 0) / b.durations.length)
            : 0
        const p50 = percentile(b.durations, 50)
        const p90 = percentile(b.durations, 90)
        const p99 = percentile(b.durations, 99)
        return {
          timestamp: b.timestamp,
          totalExecutions: b.totalExecutions,
          successfulExecutions: b.successfulExecutions,
          avgDurationMs: avg,
          p50Ms: p50,
          p90Ms: p90,
          p99Ms: p99,
        }
      })
      return { workflowId: wf.id, workflowName: wf.name, segments: segmentsOut }
    })

    return NextResponse.json({
      workflows: result,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      segmentMs,
    })
  } catch (error) {
    logger.error('MetricsExecutionsAPI error', error)
    return NextResponse.json({ error: 'Failed to compute metrics' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: sim-main/apps/sim/app/api/workspaces/[id]/notifications/constants.ts

```typescript
/** Maximum email recipients per notification */
export const MAX_EMAIL_RECIPIENTS = 10

/** Maximum notifications per type per workspace */
export const MAX_NOTIFICATIONS_PER_TYPE = 10

/** Maximum workflow IDs per notification */
export const MAX_WORKFLOW_IDS = 1000
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/workspaces/[id]/notifications/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import { workflow, workspaceNotificationSubscription } from '@sim/db/schema'
import { and, eq, inArray } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { encryptSecret } from '@/lib/core/security/encryption'
import { createLogger } from '@/lib/logs/console/logger'
import { getUserEntityPermissions } from '@/lib/workspaces/permissions/utils'
import { MAX_EMAIL_RECIPIENTS, MAX_NOTIFICATIONS_PER_TYPE, MAX_WORKFLOW_IDS } from './constants'

const logger = createLogger('WorkspaceNotificationsAPI')

const notificationTypeSchema = z.enum(['webhook', 'email', 'slack'])
const levelFilterSchema = z.array(z.enum(['info', 'error']))
const triggerFilterSchema = z.array(z.enum(['api', 'webhook', 'schedule', 'manual', 'chat']))

const alertRuleSchema = z.enum([
  'consecutive_failures',
  'failure_rate',
  'latency_threshold',
  'latency_spike',
  'cost_threshold',
  'no_activity',
  'error_count',
])

const alertConfigSchema = z
  .object({
    rule: alertRuleSchema,
    consecutiveFailures: z.number().int().min(1).max(100).optional(),
    failureRatePercent: z.number().int().min(1).max(100).optional(),
    windowHours: z.number().int().min(1).max(168).optional(),
    durationThresholdMs: z.number().int().min(1000).max(3600000).optional(),
    latencySpikePercent: z.number().int().min(10).max(1000).optional(),
    costThresholdDollars: z.number().min(0.01).max(1000).optional(),
    inactivityHours: z.number().int().min(1).max(168).optional(),
    errorCountThreshold: z.number().int().min(1).max(1000).optional(),
  })
  .refine(
    (data) => {
      switch (data.rule) {
        case 'consecutive_failures':
          return data.consecutiveFailures !== undefined
        case 'failure_rate':
          return data.failureRatePercent !== undefined && data.windowHours !== undefined
        case 'latency_threshold':
          return data.durationThresholdMs !== undefined
        case 'latency_spike':
          return data.latencySpikePercent !== undefined && data.windowHours !== undefined
        case 'cost_threshold':
          return data.costThresholdDollars !== undefined
        case 'no_activity':
          return data.inactivityHours !== undefined
        case 'error_count':
          return data.errorCountThreshold !== undefined && data.windowHours !== undefined
        default:
          return false
      }
    },
    { message: 'Missing required fields for alert rule' }
  )
  .nullable()

const webhookConfigSchema = z.object({
  url: z.string().url(),
  secret: z.string().optional(),
})

const slackConfigSchema = z.object({
  channelId: z.string(),
  channelName: z.string(),
  accountId: z.string(),
})

const createNotificationSchema = z
  .object({
    notificationType: notificationTypeSchema,
    workflowIds: z.array(z.string()).max(MAX_WORKFLOW_IDS).default([]),
    allWorkflows: z.boolean().default(false),
    levelFilter: levelFilterSchema.default(['info', 'error']),
    triggerFilter: triggerFilterSchema.default(['api', 'webhook', 'schedule', 'manual', 'chat']),
    includeFinalOutput: z.boolean().default(false),
    includeTraceSpans: z.boolean().default(false),
    includeRateLimits: z.boolean().default(false),
    includeUsageData: z.boolean().default(false),
    alertConfig: alertConfigSchema.optional(),
    webhookConfig: webhookConfigSchema.optional(),
    emailRecipients: z.array(z.string().email()).max(MAX_EMAIL_RECIPIENTS).optional(),
    slackConfig: slackConfigSchema.optional(),
  })
  .refine(
    (data) => {
      if (data.notificationType === 'webhook') return !!data.webhookConfig?.url
      if (data.notificationType === 'email')
        return !!data.emailRecipients && data.emailRecipients.length > 0
      if (data.notificationType === 'slack')
        return !!data.slackConfig?.channelId && !!data.slackConfig?.accountId
      return false
    },
    { message: 'Missing required fields for notification type' }
  )
  .refine((data) => !(data.allWorkflows && data.workflowIds.length > 0), {
    message: 'Cannot specify both allWorkflows and workflowIds',
  })

async function checkWorkspaceWriteAccess(
  userId: string,
  workspaceId: string
): Promise<{ hasAccess: boolean; permission: string | null }> {
  const permission = await getUserEntityPermissions(userId, 'workspace', workspaceId)
  const hasAccess = permission === 'write' || permission === 'admin'
  return { hasAccess, permission }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: workspaceId } = await params
    const permission = await getUserEntityPermissions(session.user.id, 'workspace', workspaceId)

    if (!permission) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 })
    }

    const subscriptions = await db
      .select({
        id: workspaceNotificationSubscription.id,
        notificationType: workspaceNotificationSubscription.notificationType,
        workflowIds: workspaceNotificationSubscription.workflowIds,
        allWorkflows: workspaceNotificationSubscription.allWorkflows,
        levelFilter: workspaceNotificationSubscription.levelFilter,
        triggerFilter: workspaceNotificationSubscription.triggerFilter,
        includeFinalOutput: workspaceNotificationSubscription.includeFinalOutput,
        includeTraceSpans: workspaceNotificationSubscription.includeTraceSpans,
        includeRateLimits: workspaceNotificationSubscription.includeRateLimits,
        includeUsageData: workspaceNotificationSubscription.includeUsageData,
        webhookConfig: workspaceNotificationSubscription.webhookConfig,
        emailRecipients: workspaceNotificationSubscription.emailRecipients,
        slackConfig: workspaceNotificationSubscription.slackConfig,
        alertConfig: workspaceNotificationSubscription.alertConfig,
        active: workspaceNotificationSubscription.active,
        createdAt: workspaceNotificationSubscription.createdAt,
        updatedAt: workspaceNotificationSubscription.updatedAt,
      })
      .from(workspaceNotificationSubscription)
      .where(eq(workspaceNotificationSubscription.workspaceId, workspaceId))
      .orderBy(workspaceNotificationSubscription.createdAt)

    return NextResponse.json({ data: subscriptions })
  } catch (error) {
    logger.error('Error fetching notifications', { error })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: workspaceId } = await params
    const { hasAccess } = await checkWorkspaceWriteAccess(session.user.id, workspaceId)

    if (!hasAccess) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const validationResult = createNotificationSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const data = validationResult.data

    const existingCount = await db
      .select({ id: workspaceNotificationSubscription.id })
      .from(workspaceNotificationSubscription)
      .where(
        and(
          eq(workspaceNotificationSubscription.workspaceId, workspaceId),
          eq(workspaceNotificationSubscription.notificationType, data.notificationType)
        )
      )

    if (existingCount.length >= MAX_NOTIFICATIONS_PER_TYPE) {
      return NextResponse.json(
        {
          error: `Maximum ${MAX_NOTIFICATIONS_PER_TYPE} ${data.notificationType} notifications per workspace`,
        },
        { status: 400 }
      )
    }

    if (!data.allWorkflows && data.workflowIds.length > 0) {
      const workflowsInWorkspace = await db
        .select({ id: workflow.id })
        .from(workflow)
        .where(and(eq(workflow.workspaceId, workspaceId), inArray(workflow.id, data.workflowIds)))

      const validIds = new Set(workflowsInWorkspace.map((w) => w.id))
      const invalidIds = data.workflowIds.filter((id) => !validIds.has(id))

      if (invalidIds.length > 0) {
        return NextResponse.json(
          { error: 'Some workflow IDs do not belong to this workspace', invalidIds },
          { status: 400 }
        )
      }
    }

    // Encrypt webhook secret if provided
    let webhookConfig = data.webhookConfig || null
    if (webhookConfig?.secret) {
      const { encrypted } = await encryptSecret(webhookConfig.secret)
      webhookConfig = { ...webhookConfig, secret: encrypted }
    }

    const [subscription] = await db
      .insert(workspaceNotificationSubscription)
      .values({
        id: uuidv4(),
        workspaceId,
        notificationType: data.notificationType,
        workflowIds: data.workflowIds,
        allWorkflows: data.allWorkflows,
        levelFilter: data.levelFilter,
        triggerFilter: data.triggerFilter,
        includeFinalOutput: data.includeFinalOutput,
        includeTraceSpans: data.includeTraceSpans,
        includeRateLimits: data.includeRateLimits,
        includeUsageData: data.includeUsageData,
        alertConfig: data.alertConfig || null,
        webhookConfig,
        emailRecipients: data.emailRecipients || null,
        slackConfig: data.slackConfig || null,
        createdBy: session.user.id,
      })
      .returning()

    logger.info('Created notification subscription', {
      workspaceId,
      subscriptionId: subscription.id,
      type: data.notificationType,
    })

    return NextResponse.json({
      data: {
        id: subscription.id,
        notificationType: subscription.notificationType,
        workflowIds: subscription.workflowIds,
        allWorkflows: subscription.allWorkflows,
        levelFilter: subscription.levelFilter,
        triggerFilter: subscription.triggerFilter,
        includeFinalOutput: subscription.includeFinalOutput,
        includeTraceSpans: subscription.includeTraceSpans,
        includeRateLimits: subscription.includeRateLimits,
        includeUsageData: subscription.includeUsageData,
        webhookConfig: subscription.webhookConfig,
        emailRecipients: subscription.emailRecipients,
        slackConfig: subscription.slackConfig,
        alertConfig: subscription.alertConfig,
        active: subscription.active,
        createdAt: subscription.createdAt,
        updatedAt: subscription.updatedAt,
      },
    })
  } catch (error) {
    logger.error('Error creating notification', { error })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/workspaces/[id]/notifications/[notificationId]/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import { workflow, workspaceNotificationSubscription } from '@sim/db/schema'
import { and, eq, inArray } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { encryptSecret } from '@/lib/core/security/encryption'
import { createLogger } from '@/lib/logs/console/logger'
import { getUserEntityPermissions } from '@/lib/workspaces/permissions/utils'
import { MAX_EMAIL_RECIPIENTS, MAX_WORKFLOW_IDS } from '../constants'

const logger = createLogger('WorkspaceNotificationAPI')

const levelFilterSchema = z.array(z.enum(['info', 'error']))
const triggerFilterSchema = z.array(z.enum(['api', 'webhook', 'schedule', 'manual', 'chat']))

const alertRuleSchema = z.enum([
  'consecutive_failures',
  'failure_rate',
  'latency_threshold',
  'latency_spike',
  'cost_threshold',
  'no_activity',
  'error_count',
])

const alertConfigSchema = z
  .object({
    rule: alertRuleSchema,
    consecutiveFailures: z.number().int().min(1).max(100).optional(),
    failureRatePercent: z.number().int().min(1).max(100).optional(),
    windowHours: z.number().int().min(1).max(168).optional(),
    durationThresholdMs: z.number().int().min(1000).max(3600000).optional(),
    latencySpikePercent: z.number().int().min(10).max(1000).optional(),
    costThresholdDollars: z.number().min(0.01).max(1000).optional(),
    inactivityHours: z.number().int().min(1).max(168).optional(),
    errorCountThreshold: z.number().int().min(1).max(1000).optional(),
  })
  .refine(
    (data) => {
      switch (data.rule) {
        case 'consecutive_failures':
          return data.consecutiveFailures !== undefined
        case 'failure_rate':
          return data.failureRatePercent !== undefined && data.windowHours !== undefined
        case 'latency_threshold':
          return data.durationThresholdMs !== undefined
        case 'latency_spike':
          return data.latencySpikePercent !== undefined && data.windowHours !== undefined
        case 'cost_threshold':
          return data.costThresholdDollars !== undefined
        case 'no_activity':
          return data.inactivityHours !== undefined
        case 'error_count':
          return data.errorCountThreshold !== undefined && data.windowHours !== undefined
        default:
          return false
      }
    },
    { message: 'Missing required fields for alert rule' }
  )
  .nullable()

const webhookConfigSchema = z.object({
  url: z.string().url(),
  secret: z.string().optional(),
})

const slackConfigSchema = z.object({
  channelId: z.string(),
  channelName: z.string(),
  accountId: z.string(),
})

const updateNotificationSchema = z
  .object({
    workflowIds: z.array(z.string()).max(MAX_WORKFLOW_IDS).optional(),
    allWorkflows: z.boolean().optional(),
    levelFilter: levelFilterSchema.optional(),
    triggerFilter: triggerFilterSchema.optional(),
    includeFinalOutput: z.boolean().optional(),
    includeTraceSpans: z.boolean().optional(),
    includeRateLimits: z.boolean().optional(),
    includeUsageData: z.boolean().optional(),
    alertConfig: alertConfigSchema.optional(),
    webhookConfig: webhookConfigSchema.optional(),
    emailRecipients: z.array(z.string().email()).max(MAX_EMAIL_RECIPIENTS).optional(),
    slackConfig: slackConfigSchema.optional(),
    active: z.boolean().optional(),
  })
  .refine((data) => !(data.allWorkflows && data.workflowIds && data.workflowIds.length > 0), {
    message: 'Cannot specify both allWorkflows and workflowIds',
  })

type RouteParams = { params: Promise<{ id: string; notificationId: string }> }

async function checkWorkspaceWriteAccess(
  userId: string,
  workspaceId: string
): Promise<{ hasAccess: boolean; permission: string | null }> {
  const permission = await getUserEntityPermissions(userId, 'workspace', workspaceId)
  const hasAccess = permission === 'write' || permission === 'admin'
  return { hasAccess, permission }
}

async function getSubscription(notificationId: string, workspaceId: string) {
  const [subscription] = await db
    .select()
    .from(workspaceNotificationSubscription)
    .where(
      and(
        eq(workspaceNotificationSubscription.id, notificationId),
        eq(workspaceNotificationSubscription.workspaceId, workspaceId)
      )
    )
    .limit(1)
  return subscription
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: workspaceId, notificationId } = await params
    const permission = await getUserEntityPermissions(session.user.id, 'workspace', workspaceId)

    if (!permission) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 })
    }

    const subscription = await getSubscription(notificationId, workspaceId)

    if (!subscription) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
    }

    return NextResponse.json({
      data: {
        id: subscription.id,
        notificationType: subscription.notificationType,
        workflowIds: subscription.workflowIds,
        allWorkflows: subscription.allWorkflows,
        levelFilter: subscription.levelFilter,
        triggerFilter: subscription.triggerFilter,
        includeFinalOutput: subscription.includeFinalOutput,
        includeTraceSpans: subscription.includeTraceSpans,
        includeRateLimits: subscription.includeRateLimits,
        includeUsageData: subscription.includeUsageData,
        webhookConfig: subscription.webhookConfig,
        emailRecipients: subscription.emailRecipients,
        slackConfig: subscription.slackConfig,
        alertConfig: subscription.alertConfig,
        active: subscription.active,
        createdAt: subscription.createdAt,
        updatedAt: subscription.updatedAt,
      },
    })
  } catch (error) {
    logger.error('Error fetching notification', { error })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: workspaceId, notificationId } = await params
    const { hasAccess } = await checkWorkspaceWriteAccess(session.user.id, workspaceId)

    if (!hasAccess) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const existingSubscription = await getSubscription(notificationId, workspaceId)

    if (!existingSubscription) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
    }

    const body = await request.json()
    const validationResult = updateNotificationSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const data = validationResult.data

    if (data.workflowIds && data.workflowIds.length > 0) {
      const workflowsInWorkspace = await db
        .select({ id: workflow.id })
        .from(workflow)
        .where(and(eq(workflow.workspaceId, workspaceId), inArray(workflow.id, data.workflowIds)))

      const validIds = new Set(workflowsInWorkspace.map((w) => w.id))
      const invalidIds = data.workflowIds.filter((id) => !validIds.has(id))

      if (invalidIds.length > 0) {
        return NextResponse.json(
          { error: 'Some workflow IDs do not belong to this workspace', invalidIds },
          { status: 400 }
        )
      }
    }

    const updateData: Record<string, unknown> = { updatedAt: new Date() }

    if (data.workflowIds !== undefined) updateData.workflowIds = data.workflowIds
    if (data.allWorkflows !== undefined) updateData.allWorkflows = data.allWorkflows
    if (data.levelFilter !== undefined) updateData.levelFilter = data.levelFilter
    if (data.triggerFilter !== undefined) updateData.triggerFilter = data.triggerFilter
    if (data.includeFinalOutput !== undefined)
      updateData.includeFinalOutput = data.includeFinalOutput
    if (data.includeTraceSpans !== undefined) updateData.includeTraceSpans = data.includeTraceSpans
    if (data.includeRateLimits !== undefined) updateData.includeRateLimits = data.includeRateLimits
    if (data.includeUsageData !== undefined) updateData.includeUsageData = data.includeUsageData
    if (data.alertConfig !== undefined) updateData.alertConfig = data.alertConfig
    if (data.emailRecipients !== undefined) updateData.emailRecipients = data.emailRecipients
    if (data.slackConfig !== undefined) updateData.slackConfig = data.slackConfig
    if (data.active !== undefined) updateData.active = data.active

    // Handle webhookConfig with secret encryption
    if (data.webhookConfig !== undefined) {
      let webhookConfig = data.webhookConfig
      if (webhookConfig?.secret) {
        const { encrypted } = await encryptSecret(webhookConfig.secret)
        webhookConfig = { ...webhookConfig, secret: encrypted }
      }
      updateData.webhookConfig = webhookConfig
    }

    const [subscription] = await db
      .update(workspaceNotificationSubscription)
      .set(updateData)
      .where(eq(workspaceNotificationSubscription.id, notificationId))
      .returning()

    logger.info('Updated notification subscription', {
      workspaceId,
      subscriptionId: subscription.id,
    })

    return NextResponse.json({
      data: {
        id: subscription.id,
        notificationType: subscription.notificationType,
        workflowIds: subscription.workflowIds,
        allWorkflows: subscription.allWorkflows,
        levelFilter: subscription.levelFilter,
        triggerFilter: subscription.triggerFilter,
        includeFinalOutput: subscription.includeFinalOutput,
        includeTraceSpans: subscription.includeTraceSpans,
        includeRateLimits: subscription.includeRateLimits,
        includeUsageData: subscription.includeUsageData,
        webhookConfig: subscription.webhookConfig,
        emailRecipients: subscription.emailRecipients,
        slackConfig: subscription.slackConfig,
        alertConfig: subscription.alertConfig,
        active: subscription.active,
        createdAt: subscription.createdAt,
        updatedAt: subscription.updatedAt,
      },
    })
  } catch (error) {
    logger.error('Error updating notification', { error })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: workspaceId, notificationId } = await params
    const { hasAccess } = await checkWorkspaceWriteAccess(session.user.id, workspaceId)

    if (!hasAccess) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const deleted = await db
      .delete(workspaceNotificationSubscription)
      .where(
        and(
          eq(workspaceNotificationSubscription.id, notificationId),
          eq(workspaceNotificationSubscription.workspaceId, workspaceId)
        )
      )
      .returning({ id: workspaceNotificationSubscription.id })

    if (deleted.length === 0) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
    }

    logger.info('Deleted notification subscription', {
      workspaceId,
      subscriptionId: notificationId,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Error deleting notification', { error })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

````
