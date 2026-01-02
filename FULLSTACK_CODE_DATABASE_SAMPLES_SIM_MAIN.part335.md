---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 335
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 335 of 933)

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
Location: sim-main/apps/sim/app/api/workspaces/[id]/notifications/[notificationId]/test/route.ts
Signals: Next.js

```typescript
import { createHmac } from 'crypto'
import { db } from '@sim/db'
import { account, workspaceNotificationSubscription } from '@sim/db/schema'
import { and, eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { getSession } from '@/lib/auth'
import { decryptSecret } from '@/lib/core/security/encryption'
import { createLogger } from '@/lib/logs/console/logger'
import { sendEmail } from '@/lib/messaging/email/mailer'
import { getUserEntityPermissions } from '@/lib/workspaces/permissions/utils'

const logger = createLogger('WorkspaceNotificationTestAPI')

type RouteParams = { params: Promise<{ id: string; notificationId: string }> }

interface WebhookConfig {
  url: string
  secret?: string
}

interface SlackConfig {
  channelId: string
  channelName: string
  accountId: string
}

function generateSignature(secret: string, timestamp: number, body: string): string {
  const signatureBase = `${timestamp}.${body}`
  const hmac = createHmac('sha256', secret)
  hmac.update(signatureBase)
  return hmac.digest('hex')
}

function buildTestPayload(subscription: typeof workspaceNotificationSubscription.$inferSelect) {
  const timestamp = Date.now()
  const eventId = `evt_test_${uuidv4()}`
  const executionId = `exec_test_${uuidv4()}`

  const payload: Record<string, unknown> = {
    id: eventId,
    type: 'workflow.execution.completed',
    timestamp,
    data: {
      workflowId: 'test-workflow-id',
      workflowName: 'Test Workflow',
      executionId,
      status: 'success',
      level: 'info',
      trigger: 'manual',
      startedAt: new Date(timestamp - 5000).toISOString(),
      endedAt: new Date(timestamp).toISOString(),
      totalDurationMs: 5000,
      cost: {
        total: 0.00123,
        tokens: { prompt: 100, completion: 50, total: 150 },
      },
    },
    links: {
      log: `/workspace/logs`,
    },
  }

  const data = payload.data as Record<string, unknown>

  if (subscription.includeFinalOutput) {
    data.finalOutput = { message: 'This is a test notification', test: true }
  }

  if (subscription.includeTraceSpans) {
    data.traceSpans = [
      {
        id: 'span_test_1',
        name: 'Test Block',
        type: 'block',
        status: 'success',
        startTime: new Date(timestamp - 5000).toISOString(),
        endTime: new Date(timestamp).toISOString(),
        duration: 5000,
      },
    ]
  }

  if (subscription.includeRateLimits) {
    data.rateLimits = {
      sync: { limit: 150, remaining: 45, resetAt: new Date(timestamp + 60000).toISOString() },
      async: { limit: 1000, remaining: 50, resetAt: new Date(timestamp + 60000).toISOString() },
    }
  }

  if (subscription.includeUsageData) {
    data.usage = { currentPeriodCost: 2.45, limit: 10, plan: 'pro', isExceeded: false }
  }

  return { payload, timestamp }
}

async function testWebhook(subscription: typeof workspaceNotificationSubscription.$inferSelect) {
  const webhookConfig = subscription.webhookConfig as WebhookConfig | null
  if (!webhookConfig?.url) {
    return { success: false, error: 'No webhook URL configured' }
  }

  const { payload, timestamp } = buildTestPayload(subscription)
  const body = JSON.stringify(payload)
  const deliveryId = `delivery_test_${uuidv4()}`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'sim-event': 'workflow.execution.completed',
    'sim-timestamp': timestamp.toString(),
    'sim-delivery-id': deliveryId,
    'Idempotency-Key': deliveryId,
  }

  if (webhookConfig.secret) {
    const { decrypted } = await decryptSecret(webhookConfig.secret)
    const signature = generateSignature(decrypted, timestamp, body)
    headers['sim-signature'] = `t=${timestamp},v1=${signature}`
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000)

  try {
    const response = await fetch(webhookConfig.url, {
      method: 'POST',
      headers,
      body,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    const responseBody = await response.text().catch(() => '')

    return {
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      body: responseBody.slice(0, 500),
      timestamp: new Date().toISOString(),
    }
  } catch (error: unknown) {
    clearTimeout(timeoutId)
    const err = error as Error & { name?: string }
    if (err.name === 'AbortError') {
      return { success: false, error: 'Request timeout after 10 seconds' }
    }
    return { success: false, error: err.message }
  }
}

async function testEmail(subscription: typeof workspaceNotificationSubscription.$inferSelect) {
  if (!subscription.emailRecipients || subscription.emailRecipients.length === 0) {
    return { success: false, error: 'No email recipients configured' }
  }

  const { payload } = buildTestPayload(subscription)
  const data = (payload as Record<string, unknown>).data as Record<string, unknown>

  const result = await sendEmail({
    to: subscription.emailRecipients,
    subject: `[Test] Workflow Execution: ${data.workflowName}`,
    text: `This is a test notification from Sim Studio.\n\nWorkflow: ${data.workflowName}\nStatus: ${data.status}\nDuration: ${data.totalDurationMs}ms\n\nThis notification is configured for workspace notifications.`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7F2FFF;">Test Notification</h2>
        <p>This is a test notification from Sim Studio.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 8px; border: 1px solid #eee;"><strong>Workflow</strong></td><td style="padding: 8px; border: 1px solid #eee;">${data.workflowName}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #eee;"><strong>Status</strong></td><td style="padding: 8px; border: 1px solid #eee;">${data.status}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #eee;"><strong>Duration</strong></td><td style="padding: 8px; border: 1px solid #eee;">${data.totalDurationMs}ms</td></tr>
        </table>
        <p style="color: #666; font-size: 12px;">This notification is configured for workspace notifications.</p>
      </div>
    `,
    emailType: 'notifications',
  })

  return {
    success: result.success,
    message: result.message,
    timestamp: new Date().toISOString(),
  }
}

async function testSlack(
  subscription: typeof workspaceNotificationSubscription.$inferSelect,
  userId: string
) {
  const slackConfig = subscription.slackConfig as SlackConfig | null
  if (!slackConfig?.channelId || !slackConfig?.accountId) {
    return { success: false, error: 'No Slack channel or account configured' }
  }

  const [slackAccount] = await db
    .select({ accessToken: account.accessToken })
    .from(account)
    .where(and(eq(account.id, slackConfig.accountId), eq(account.userId, userId)))
    .limit(1)

  if (!slackAccount?.accessToken) {
    return { success: false, error: 'Slack account not found or not connected' }
  }

  const { payload } = buildTestPayload(subscription)
  const data = (payload as Record<string, unknown>).data as Record<string, unknown>

  const slackPayload = {
    channel: slackConfig.channelId,
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: '🧪 Test Notification', emoji: true },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Workflow:*\n${data.workflowName}` },
          { type: 'mrkdwn', text: `*Status:*\n✅ ${data.status}` },
          { type: 'mrkdwn', text: `*Duration:*\n${data.totalDurationMs}ms` },
          { type: 'mrkdwn', text: `*Trigger:*\n${data.trigger}` },
        ],
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: 'This is a test notification from Sim Studio workspace notifications.',
          },
        ],
      },
    ],
    text: `Test notification: ${data.workflowName} - ${data.status}`,
  }

  try {
    const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${slackAccount.accessToken}`,
      },
      body: JSON.stringify(slackPayload),
    })

    const result = await response.json()

    return {
      success: result.ok,
      error: result.error,
      channel: result.channel,
      timestamp: new Date().toISOString(),
    }
  } catch (error: unknown) {
    const err = error as Error
    return { success: false, error: err.message }
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: workspaceId, notificationId } = await params
    const permission = await getUserEntityPermissions(session.user.id, 'workspace', workspaceId)

    if (permission !== 'write' && permission !== 'admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

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

    if (!subscription) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
    }

    let result: Record<string, unknown>

    switch (subscription.notificationType) {
      case 'webhook':
        result = await testWebhook(subscription)
        break
      case 'email':
        result = await testEmail(subscription)
        break
      case 'slack':
        result = await testSlack(subscription, session.user.id)
        break
      default:
        return NextResponse.json({ error: 'Unknown notification type' }, { status: 400 })
    }

    logger.info('Test notification sent', {
      workspaceId,
      subscriptionId: notificationId,
      type: subscription.notificationType,
      success: result.success,
    })

    return NextResponse.json({ data: result })
  } catch (error) {
    logger.error('Error testing notification', { error })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/workspaces/[id]/permissions/route.ts
Signals: Next.js, Zod

```typescript
import crypto from 'crypto'
import { db } from '@sim/db'
import { permissions, workspace } from '@sim/db/schema'
import { and, eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { createLogger } from '@/lib/logs/console/logger'
import {
  getUsersWithPermissions,
  hasWorkspaceAdminAccess,
} from '@/lib/workspaces/permissions/utils'

const logger = createLogger('WorkspacesPermissionsAPI')

const updatePermissionsSchema = z.object({
  updates: z.array(
    z.object({
      userId: z.string(),
      permissions: z.enum(['admin', 'write', 'read']),
    })
  ),
})

/**
 * GET /api/workspaces/[id]/permissions
 *
 * Retrieves all users who have permissions for the specified workspace.
 * Returns user details along with their specific permissions.
 *
 * @param workspaceId - The workspace ID from the URL parameters
 * @returns Array of users with their permissions for the workspace
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: workspaceId } = await params
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const userPermission = await db
      .select()
      .from(permissions)
      .where(
        and(
          eq(permissions.entityId, workspaceId),
          eq(permissions.entityType, 'workspace'),
          eq(permissions.userId, session.user.id)
        )
      )
      .limit(1)

    if (userPermission.length === 0) {
      return NextResponse.json({ error: 'Workspace not found or access denied' }, { status: 404 })
    }

    const result = await getUsersWithPermissions(workspaceId)

    return NextResponse.json({
      users: result,
      total: result.length,
    })
  } catch (error) {
    logger.error('Error fetching workspace permissions:', error)
    return NextResponse.json({ error: 'Failed to fetch workspace permissions' }, { status: 500 })
  }
}

/**
 * PATCH /api/workspaces/[id]/permissions
 *
 * Updates permissions for existing workspace members.
 * Only admin users can update permissions.
 *
 * @param workspaceId - The workspace ID from the URL parameters
 * @param updates - Array of permission updates for users
 * @returns Success message or error
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: workspaceId } = await params
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const hasAdminAccess = await hasWorkspaceAdminAccess(session.user.id, workspaceId)

    if (!hasAdminAccess) {
      return NextResponse.json(
        { error: 'Admin access required to update permissions' },
        { status: 403 }
      )
    }

    const body = updatePermissionsSchema.parse(await request.json())

    const workspaceRow = await db
      .select({ billedAccountUserId: workspace.billedAccountUserId })
      .from(workspace)
      .where(eq(workspace.id, workspaceId))
      .limit(1)

    if (!workspaceRow.length) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 })
    }

    const billedAccountUserId = workspaceRow[0].billedAccountUserId

    const selfUpdate = body.updates.find((update) => update.userId === session.user.id)
    if (selfUpdate && selfUpdate.permissions !== 'admin') {
      return NextResponse.json(
        { error: 'Cannot remove your own admin permissions' },
        { status: 400 }
      )
    }

    if (
      billedAccountUserId &&
      body.updates.some(
        (update) => update.userId === billedAccountUserId && update.permissions !== 'admin'
      )
    ) {
      return NextResponse.json(
        { error: 'Workspace billing account must retain admin permissions' },
        { status: 400 }
      )
    }

    await db.transaction(async (tx) => {
      for (const update of body.updates) {
        await tx
          .delete(permissions)
          .where(
            and(
              eq(permissions.userId, update.userId),
              eq(permissions.entityType, 'workspace'),
              eq(permissions.entityId, workspaceId)
            )
          )

        await tx.insert(permissions).values({
          id: crypto.randomUUID(),
          userId: update.userId,
          entityType: 'workspace' as const,
          entityId: workspaceId,
          permissionType: update.permissions,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }
    })

    const updatedUsers = await getUsersWithPermissions(workspaceId)

    return NextResponse.json({
      message: 'Permissions updated successfully',
      users: updatedUsers,
      total: updatedUsers.length,
    })
  } catch (error) {
    logger.error('Error updating workspace permissions:', error)
    return NextResponse.json({ error: 'Failed to update workspace permissions' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/yaml/autolayout/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { applyAutoLayout } from '@/lib/workflows/autolayout'
import {
  DEFAULT_HORIZONTAL_SPACING,
  DEFAULT_LAYOUT_PADDING,
  DEFAULT_VERTICAL_SPACING,
} from '@/lib/workflows/autolayout/constants'

const logger = createLogger('YamlAutoLayoutAPI')

const AutoLayoutRequestSchema = z.object({
  workflowState: z.object({
    blocks: z.record(z.any()),
    edges: z.array(z.any()),
    loops: z.record(z.any()).optional().default({}),
    parallels: z.record(z.any()).optional().default({}),
  }),
  options: z
    .object({
      spacing: z
        .object({
          horizontal: z.number().optional(),
          vertical: z.number().optional(),
        })
        .optional(),
      alignment: z.enum(['start', 'center', 'end']).optional(),
      padding: z
        .object({
          x: z.number().optional(),
          y: z.number().optional(),
        })
        .optional(),
    })
    .optional(),
})

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const body = await request.json()
    const { workflowState, options } = AutoLayoutRequestSchema.parse(body)

    logger.info(`[${requestId}] Applying auto layout`, {
      blockCount: Object.keys(workflowState.blocks).length,
      edgeCount: workflowState.edges.length,
    })

    const autoLayoutOptions = {
      horizontalSpacing: options?.spacing?.horizontal ?? DEFAULT_HORIZONTAL_SPACING,
      verticalSpacing: options?.spacing?.vertical ?? DEFAULT_VERTICAL_SPACING,
      padding: {
        x: options?.padding?.x ?? DEFAULT_LAYOUT_PADDING.x,
        y: options?.padding?.y ?? DEFAULT_LAYOUT_PADDING.y,
      },
      alignment: options?.alignment ?? 'center',
    }

    const layoutResult = applyAutoLayout(
      workflowState.blocks,
      workflowState.edges,
      autoLayoutOptions
    )

    if (!layoutResult.success || !layoutResult.blocks) {
      logger.error(`[${requestId}] Auto layout failed:`, {
        error: layoutResult.error,
      })
      return NextResponse.json(
        {
          success: false,
          errors: [layoutResult.error || 'Unknown auto layout error'],
        },
        { status: 500 }
      )
    }

    logger.info(`[${requestId}] Auto layout completed successfully:`, {
      success: true,
      blockCount: Object.keys(layoutResult.blocks).length,
    })

    const transformedResponse = {
      success: true,
      workflowState: {
        blocks: layoutResult.blocks,
        edges: workflowState.edges,
        loops: workflowState.loops || {},
        parallels: workflowState.parallels || {},
      },
    }

    return NextResponse.json(transformedResponse)
  } catch (error) {
    logger.error(`[${requestId}] Auto layout failed:`, error)

    return NextResponse.json(
      {
        success: false,
        errors: [error instanceof Error ? error.message : 'Unknown auto layout error'],
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

````
