---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 326
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 326 of 933)

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

---[FILE: route.test.ts]---
Location: sim-main/apps/sim/app/api/webhooks/trigger/[path]/route.test.ts

```typescript
/**
 * Integration tests for webhook trigger API route
 *
 * @vitest-environment node
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  createMockRequest,
  globalMockData,
  mockExecutionDependencies,
  mockTriggerDevSdk,
} from '@/app/api/__test-utils__/utils'

const {
  hasProcessedMessageMock,
  markMessageAsProcessedMock,
  closeRedisConnectionMock,
  acquireLockMock,
  generateRequestHashMock,
  validateSlackSignatureMock,
  handleWhatsAppVerificationMock,
  handleSlackChallengeMock,
  processWhatsAppDeduplicationMock,
  processGenericDeduplicationMock,
  fetchAndProcessAirtablePayloadsMock,
  processWebhookMock,
  executeMock,
} = vi.hoisted(() => ({
  hasProcessedMessageMock: vi.fn().mockResolvedValue(false),
  markMessageAsProcessedMock: vi.fn().mockResolvedValue(true),
  closeRedisConnectionMock: vi.fn().mockResolvedValue(undefined),
  acquireLockMock: vi.fn().mockResolvedValue(true),
  generateRequestHashMock: vi.fn().mockResolvedValue('test-hash-123'),
  validateSlackSignatureMock: vi.fn().mockResolvedValue(true),
  handleWhatsAppVerificationMock: vi.fn().mockResolvedValue(null),
  handleSlackChallengeMock: vi.fn().mockReturnValue(null),
  processWhatsAppDeduplicationMock: vi.fn().mockResolvedValue(null),
  processGenericDeduplicationMock: vi.fn().mockResolvedValue(null),
  fetchAndProcessAirtablePayloadsMock: vi.fn().mockResolvedValue(undefined),
  processWebhookMock: vi.fn().mockResolvedValue(new Response('Webhook processed', { status: 200 })),
  executeMock: vi.fn().mockResolvedValue({
    success: true,
    output: { response: 'Webhook execution success' },
    logs: [],
    metadata: {
      duration: 100,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
    },
  }),
}))

vi.mock('@trigger.dev/sdk', () => ({
  tasks: {
    trigger: vi.fn().mockResolvedValue({ id: 'mock-task-id' }),
  },
  task: vi.fn().mockReturnValue({}),
}))

vi.mock('@/background/webhook-execution', () => ({
  executeWebhookJob: vi.fn().mockResolvedValue({
    success: true,
    workflowId: 'test-workflow-id',
    executionId: 'test-exec-id',
    output: {},
    executedAt: new Date().toISOString(),
  }),
}))

vi.mock('@/background/logs-webhook-delivery', () => ({
  logsWebhookDelivery: {},
}))

vi.mock('@/lib/redis', () => ({
  hasProcessedMessage: hasProcessedMessageMock,
  markMessageAsProcessed: markMessageAsProcessedMock,
  closeRedisConnection: closeRedisConnectionMock,
  acquireLock: acquireLockMock,
}))

vi.mock('@/lib/webhooks/utils', () => ({
  handleWhatsAppVerification: handleWhatsAppVerificationMock,
  handleSlackChallenge: handleSlackChallengeMock,
  verifyProviderWebhook: vi.fn().mockReturnValue(null),
  processWhatsAppDeduplication: processWhatsAppDeduplicationMock,
  processGenericDeduplication: processGenericDeduplicationMock,
  fetchAndProcessAirtablePayloads: fetchAndProcessAirtablePayloadsMock,
  processWebhook: processWebhookMock,
}))

vi.mock('@/app/api/webhooks/utils', () => ({
  generateRequestHash: generateRequestHashMock,
  validateSlackSignature: validateSlackSignatureMock,
}))

vi.mock('@/executor', () => ({
  Executor: vi.fn().mockImplementation(() => ({
    execute: executeMock,
  })),
}))

vi.mock('@/lib/execution/preprocessing', () => ({
  preprocessExecution: vi.fn().mockResolvedValue({
    success: true,
    actorUserId: 'test-user-id',
    workflowRecord: {
      id: 'test-workflow-id',
      userId: 'test-user-id',
      isDeployed: true,
      workspaceId: 'test-workspace-id',
    },
    userSubscription: {
      plan: 'pro',
      status: 'active',
    },
    rateLimitInfo: {
      allowed: true,
      remaining: 100,
      resetAt: new Date(),
    },
  }),
}))

vi.mock('@/lib/logs/execution/logging-session', () => ({
  LoggingSession: vi.fn().mockImplementation(() => ({
    safeStart: vi.fn().mockResolvedValue(undefined),
    safeCompleteWithError: vi.fn().mockResolvedValue(undefined),
  })),
}))

vi.mock('@/lib/workspaces/utils', async () => {
  const actual = await vi.importActual('@/lib/workspaces/utils')
  return {
    ...(actual as Record<string, unknown>),
    getWorkspaceBilledAccountUserId: vi
      .fn()
      .mockImplementation(async (workspaceId: string | null | undefined) =>
        workspaceId ? 'test-user-id' : null
      ),
  }
})

vi.mock('@/lib/core/rate-limiter', () => ({
  RateLimiter: vi.fn().mockImplementation(() => ({
    checkRateLimit: vi.fn().mockResolvedValue({
      allowed: true,
      remaining: 10,
      resetAt: new Date(),
    }),
  })),
  RateLimitError: class RateLimitError extends Error {
    constructor(
      message: string,
      public statusCode = 429
    ) {
      super(message)
      this.name = 'RateLimitError'
    }
  },
}))

vi.mock('@/lib/workflows/persistence/utils', () => ({
  loadWorkflowFromNormalizedTables: vi.fn().mockResolvedValue({
    blocks: {},
    edges: [],
    loops: {},
    parallels: {},
    isFromNormalizedTables: true,
  }),
  blockExistsInDeployment: vi.fn().mockResolvedValue(true),
}))

vi.mock('drizzle-orm/postgres-js', () => ({
  drizzle: vi.fn().mockReturnValue({}),
}))

vi.mock('postgres', () => vi.fn().mockReturnValue({}))

process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'

import { POST } from '@/app/api/webhooks/trigger/[path]/route'

describe('Webhook Trigger API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    globalMockData.webhooks.length = 0
    globalMockData.workflows.length = 0
    globalMockData.schedules.length = 0

    mockExecutionDependencies()
    mockTriggerDevSdk()

    globalMockData.workflows.push({
      id: 'test-workflow-id',
      userId: 'test-user-id',
      workspaceId: 'test-workspace-id',
    })

    hasProcessedMessageMock.mockResolvedValue(false)
    markMessageAsProcessedMock.mockResolvedValue(true)
    acquireLockMock.mockResolvedValue(true)
    handleWhatsAppVerificationMock.mockResolvedValue(null)
    processGenericDeduplicationMock.mockResolvedValue(null)
    processWebhookMock.mockResolvedValue(new Response('Webhook processed', { status: 200 }))

    if ((global as any).crypto?.randomUUID) {
      vi.spyOn(crypto, 'randomUUID').mockRestore()
    }

    vi.spyOn(crypto, 'randomUUID').mockReturnValue('mock-uuid-12345')
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should handle 404 for non-existent webhooks', async () => {
    const req = createMockRequest('POST', { event: 'test' })

    const params = Promise.resolve({ path: 'non-existent-path' })

    const response = await POST(req, { params })

    expect(response.status).toBe(404)

    const text = await response.text()
    expect(text).toMatch(/not found/i)
  })

  describe('Generic Webhook Authentication', () => {
    it('should process generic webhook without authentication', async () => {
      globalMockData.webhooks.push({
        id: 'generic-webhook-id',
        provider: 'generic',
        path: 'test-path',
        isActive: true,
        providerConfig: { requireAuth: false },
        workflowId: 'test-workflow-id',
        rateLimitCount: 100,
        rateLimitPeriod: 60,
      })
      globalMockData.workflows.push({
        id: 'test-workflow-id',
        userId: 'test-user-id',
        workspaceId: 'test-workspace-id',
      })

      const req = createMockRequest('POST', { event: 'test', id: 'test-123' })
      const params = Promise.resolve({ path: 'test-path' })

      const response = await POST(req, { params })

      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data.message).toBe('Webhook processed')
    })

    /**
     * Test generic webhook with Bearer token authentication
     */
    it('should authenticate with Bearer token when no custom header is configured', async () => {
      globalMockData.webhooks.push({
        id: 'generic-webhook-id',
        provider: 'generic',
        path: 'test-path',
        isActive: true,
        providerConfig: { requireAuth: true, token: 'test-token-123' },
        workflowId: 'test-workflow-id',
      })
      globalMockData.workflows.push({
        id: 'test-workflow-id',
        userId: 'test-user-id',
        workspaceId: 'test-workspace-id',
      })

      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-token-123',
      }
      const req = createMockRequest('POST', { event: 'bearer.test' }, headers)
      const params = Promise.resolve({ path: 'test-path' })

      const response = await POST(req, { params })

      expect(response.status).toBe(200)
    })

    it('should authenticate with custom header when configured', async () => {
      globalMockData.webhooks.push({
        id: 'generic-webhook-id',
        provider: 'generic',
        path: 'test-path',
        isActive: true,
        providerConfig: {
          requireAuth: true,
          token: 'secret-token-456',
          secretHeaderName: 'X-Custom-Auth',
        },
        workflowId: 'test-workflow-id',
      })
      globalMockData.workflows.push({
        id: 'test-workflow-id',
        userId: 'test-user-id',
        workspaceId: 'test-workspace-id',
      })

      const headers = {
        'Content-Type': 'application/json',
        'X-Custom-Auth': 'secret-token-456',
      }
      const req = createMockRequest('POST', { event: 'custom.header.test' }, headers)
      const params = Promise.resolve({ path: 'test-path' })

      const response = await POST(req, { params })

      expect(response.status).toBe(200)
    })

    it('should handle case insensitive Bearer token authentication', async () => {
      globalMockData.webhooks.push({
        id: 'generic-webhook-id',
        provider: 'generic',
        path: 'test-path',
        isActive: true,
        providerConfig: { requireAuth: true, token: 'case-test-token' },
        workflowId: 'test-workflow-id',
      })
      globalMockData.workflows.push({
        id: 'test-workflow-id',
        userId: 'test-user-id',
        workspaceId: 'test-workspace-id',
      })

      vi.doMock('@trigger.dev/sdk', () => ({
        tasks: {
          trigger: vi.fn().mockResolvedValue({ id: 'mock-task-id' }),
        },
      }))

      const testCases = [
        'Bearer case-test-token',
        'bearer case-test-token',
        'BEARER case-test-token',
        'BeArEr case-test-token',
      ]

      for (const authHeader of testCases) {
        const headers = {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        }
        const req = createMockRequest('POST', { event: 'case.test' }, headers)
        const params = Promise.resolve({ path: 'test-path' })

        const response = await POST(req, { params })

        expect(response.status).toBe(200)
      }
    })

    it('should handle case insensitive custom header authentication', async () => {
      globalMockData.webhooks.push({
        id: 'generic-webhook-id',
        provider: 'generic',
        path: 'test-path',
        isActive: true,
        providerConfig: {
          requireAuth: true,
          token: 'custom-token-789',
          secretHeaderName: 'X-Secret-Key',
        },
        workflowId: 'test-workflow-id',
      })
      globalMockData.workflows.push({
        id: 'test-workflow-id',
        userId: 'test-user-id',
        workspaceId: 'test-workspace-id',
      })

      vi.doMock('@trigger.dev/sdk', () => ({
        tasks: {
          trigger: vi.fn().mockResolvedValue({ id: 'mock-task-id' }),
        },
      }))

      const testCases = ['X-Secret-Key', 'x-secret-key', 'X-SECRET-KEY', 'x-Secret-Key']

      for (const headerName of testCases) {
        const headers = {
          'Content-Type': 'application/json',
          [headerName]: 'custom-token-789',
        }
        const req = createMockRequest('POST', { event: 'custom.case.test' }, headers)
        const params = Promise.resolve({ path: 'test-path' })

        const response = await POST(req, { params })

        expect(response.status).toBe(200)
      }
    })

    it('should reject wrong Bearer token', async () => {
      globalMockData.webhooks.push({
        id: 'generic-webhook-id',
        provider: 'generic',
        path: 'test-path',
        isActive: true,
        providerConfig: { requireAuth: true, token: 'correct-token' },
        workflowId: 'test-workflow-id',
      })

      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer wrong-token',
      }
      const req = createMockRequest('POST', { event: 'wrong.token.test' }, headers)
      const params = Promise.resolve({ path: 'test-path' })

      const response = await POST(req, { params })

      expect(response.status).toBe(401)
      expect(await response.text()).toContain('Unauthorized - Invalid authentication token')
      expect(processWebhookMock).not.toHaveBeenCalled()
    })

    it('should reject wrong custom header token', async () => {
      globalMockData.webhooks.push({
        id: 'generic-webhook-id',
        provider: 'generic',
        path: 'test-path',
        isActive: true,
        providerConfig: {
          requireAuth: true,
          token: 'correct-custom-token',
          secretHeaderName: 'X-Auth-Key',
        },
        workflowId: 'test-workflow-id',
      })

      const headers = {
        'Content-Type': 'application/json',
        'X-Auth-Key': 'wrong-custom-token',
      }
      const req = createMockRequest('POST', { event: 'wrong.custom.test' }, headers)
      const params = Promise.resolve({ path: 'test-path' })

      const response = await POST(req, { params })

      expect(response.status).toBe(401)
      expect(await response.text()).toContain('Unauthorized - Invalid authentication token')
      expect(processWebhookMock).not.toHaveBeenCalled()
    })

    it('should reject missing authentication when required', async () => {
      globalMockData.webhooks.push({
        id: 'generic-webhook-id',
        provider: 'generic',
        path: 'test-path',
        isActive: true,
        providerConfig: { requireAuth: true, token: 'required-token' },
        workflowId: 'test-workflow-id',
      })

      const req = createMockRequest('POST', { event: 'no.auth.test' })
      const params = Promise.resolve({ path: 'test-path' })

      const response = await POST(req, { params })

      expect(response.status).toBe(401)
      expect(await response.text()).toContain('Unauthorized - Invalid authentication token')
      expect(processWebhookMock).not.toHaveBeenCalled()
    })

    it('should reject Bearer token when custom header is configured', async () => {
      globalMockData.webhooks.push({
        id: 'generic-webhook-id',
        provider: 'generic',
        path: 'test-path',
        isActive: true,
        providerConfig: {
          requireAuth: true,
          token: 'exclusive-token',
          secretHeaderName: 'X-Only-Header',
        },
        workflowId: 'test-workflow-id',
      })

      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer exclusive-token', // Correct token but wrong header type
      }
      const req = createMockRequest('POST', { event: 'exclusivity.test' }, headers)
      const params = Promise.resolve({ path: 'test-path' })

      const response = await POST(req, { params })

      expect(response.status).toBe(401)
      expect(await response.text()).toContain('Unauthorized - Invalid authentication token')
      expect(processWebhookMock).not.toHaveBeenCalled()
    })

    it('should reject wrong custom header name', async () => {
      globalMockData.webhooks.push({
        id: 'generic-webhook-id',
        provider: 'generic',
        path: 'test-path',
        isActive: true,
        providerConfig: {
          requireAuth: true,
          token: 'correct-token',
          secretHeaderName: 'X-Expected-Header',
        },
        workflowId: 'test-workflow-id',
      })

      const headers = {
        'Content-Type': 'application/json',
        'X-Wrong-Header': 'correct-token', // Correct token but wrong header name
      }
      const req = createMockRequest('POST', { event: 'wrong.header.name.test' }, headers)
      const params = Promise.resolve({ path: 'test-path' })

      const response = await POST(req, { params })

      expect(response.status).toBe(401)
      expect(await response.text()).toContain('Unauthorized - Invalid authentication token')
      expect(processWebhookMock).not.toHaveBeenCalled()
    })

    it('should reject when auth is required but no token is configured', async () => {
      globalMockData.webhooks.push({
        id: 'generic-webhook-id',
        provider: 'generic',
        path: 'test-path',
        isActive: true,
        providerConfig: { requireAuth: true },
        workflowId: 'test-workflow-id',
      })
      globalMockData.workflows.push({ id: 'test-workflow-id', userId: 'test-user-id' })

      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer any-token',
      }
      const req = createMockRequest('POST', { event: 'no.token.config.test' }, headers)
      const params = Promise.resolve({ path: 'test-path' })

      const response = await POST(req, { params })

      expect(response.status).toBe(401)
      expect(await response.text()).toContain(
        'Unauthorized - Authentication required but not configured'
      )
      expect(processWebhookMock).not.toHaveBeenCalled()
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/webhooks/trigger/[path]/route.ts
Signals: Next.js

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import {
  checkWebhookPreprocessing,
  findWebhookAndWorkflow,
  handleProviderChallenges,
  parseWebhookBody,
  queueWebhookExecution,
  verifyProviderAuth,
} from '@/lib/webhooks/processor'
import { blockExistsInDeployment } from '@/lib/workflows/persistence/utils'

const logger = createLogger('WebhookTriggerAPI')

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string }> }) {
  const requestId = generateRequestId()
  const { path } = await params

  // Handle Microsoft Graph subscription validation
  const url = new URL(request.url)
  const validationToken = url.searchParams.get('validationToken')

  if (validationToken) {
    logger.info(`[${requestId}] Microsoft Graph subscription validation for path: ${path}`)
    return new NextResponse(validationToken, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    })
  }

  // Handle other GET-based verifications if needed
  const challengeResponse = await handleProviderChallenges({}, request, requestId, path)
  if (challengeResponse) {
    return challengeResponse
  }

  return new NextResponse('Method not allowed', { status: 405 })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string }> }
) {
  const requestId = generateRequestId()
  const { path } = await params

  // Log ALL incoming webhook requests for debugging
  logger.info(`[${requestId}] Incoming webhook request`, {
    path,
    method: request.method,
    headers: Object.fromEntries(request.headers.entries()),
  })

  // Handle Microsoft Graph subscription validation (some environments send POST with validationToken)
  try {
    const url = new URL(request.url)
    const validationToken = url.searchParams.get('validationToken')
    if (validationToken) {
      logger.info(`[${requestId}] Microsoft Graph subscription validation (POST) for path: ${path}`)
      return new NextResponse(validationToken, {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      })
    }
  } catch {
    // ignore URL parsing errors; proceed to normal handling
  }

  const parseResult = await parseWebhookBody(request, requestId)

  // Check if parseWebhookBody returned an error response
  if (parseResult instanceof NextResponse) {
    return parseResult
  }

  const { body, rawBody } = parseResult

  const challengeResponse = await handleProviderChallenges(body, request, requestId, path)
  if (challengeResponse) {
    return challengeResponse
  }

  const findResult = await findWebhookAndWorkflow({ requestId, path })

  if (!findResult) {
    logger.warn(`[${requestId}] Webhook or workflow not found for path: ${path}`)

    return new NextResponse('Not Found', { status: 404 })
  }

  const { webhook: foundWebhook, workflow: foundWorkflow } = findResult

  // Log HubSpot webhook details for debugging
  if (foundWebhook.provider === 'hubspot') {
    const events = Array.isArray(body) ? body : [body]
    const firstEvent = events[0]

    logger.info(`[${requestId}] HubSpot webhook received`, {
      path,
      subscriptionType: firstEvent?.subscriptionType,
      objectId: firstEvent?.objectId,
      portalId: firstEvent?.portalId,
      webhookId: foundWebhook.id,
      workflowId: foundWorkflow.id,
      triggerId: foundWebhook.providerConfig?.triggerId,
      eventCount: events.length,
    })
  }

  const authError = await verifyProviderAuth(
    foundWebhook,
    foundWorkflow,
    request,
    rawBody,
    requestId
  )
  if (authError) {
    return authError
  }

  let preprocessError: NextResponse | null = null
  try {
    preprocessError = await checkWebhookPreprocessing(foundWorkflow, foundWebhook, requestId)
    if (preprocessError) {
      return preprocessError
    }
  } catch (error) {
    logger.error(`[${requestId}] Unexpected error during webhook preprocessing`, {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      webhookId: foundWebhook.id,
      workflowId: foundWorkflow.id,
    })

    if (foundWebhook.provider === 'microsoft-teams') {
      return NextResponse.json(
        {
          type: 'message',
          text: 'An unexpected error occurred during preprocessing',
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred during preprocessing' },
      { status: 500 }
    )
  }

  if (foundWebhook.blockId) {
    const blockExists = await blockExistsInDeployment(foundWorkflow.id, foundWebhook.blockId)
    if (!blockExists) {
      logger.info(
        `[${requestId}] Trigger block ${foundWebhook.blockId} not found in deployment for workflow ${foundWorkflow.id}`
      )
      return new NextResponse('Trigger block not found in deployment', { status: 404 })
    }
  }

  if (foundWebhook.provider === 'stripe') {
    const providerConfig = (foundWebhook.providerConfig as Record<string, any>) || {}
    const eventTypes = providerConfig.eventTypes

    if (eventTypes && Array.isArray(eventTypes) && eventTypes.length > 0) {
      const eventType = body?.type

      if (eventType && !eventTypes.includes(eventType)) {
        logger.info(
          `[${requestId}] Stripe event type '${eventType}' not in allowed list, skipping execution`
        )
        return new NextResponse('Event type filtered', { status: 200 })
      }
    }
  }

  return queueWebhookExecution(foundWebhook, foundWorkflow, body, request, {
    requestId,
    path,
    testMode: false,
    executionTarget: 'deployed',
  })
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/webhooks/[id]/route.ts
Signals: Next.js

```typescript
import { db } from '@sim/db'
import { webhook, workflow } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { validateInteger } from '@/lib/core/security/input-validation'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { getUserEntityPermissions } from '@/lib/workspaces/permissions/utils'

const logger = createLogger('WebhookAPI')

export const dynamic = 'force-dynamic'

// Get a specific webhook
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = generateRequestId()

  try {
    const { id } = await params
    logger.debug(`[${requestId}] Fetching webhook with ID: ${id}`)

    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized webhook access attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const webhooks = await db
      .select({
        webhook: webhook,
        workflow: {
          id: workflow.id,
          name: workflow.name,
          userId: workflow.userId,
          workspaceId: workflow.workspaceId,
        },
      })
      .from(webhook)
      .innerJoin(workflow, eq(webhook.workflowId, workflow.id))
      .where(eq(webhook.id, id))
      .limit(1)

    if (webhooks.length === 0) {
      logger.warn(`[${requestId}] Webhook not found: ${id}`)
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 })
    }

    const webhookData = webhooks[0]

    // Check if user has permission to access this webhook
    let hasAccess = false

    // Case 1: User owns the workflow
    if (webhookData.workflow.userId === session.user.id) {
      hasAccess = true
    }

    // Case 2: Workflow belongs to a workspace and user has any permission
    if (!hasAccess && webhookData.workflow.workspaceId) {
      const userPermission = await getUserEntityPermissions(
        session.user.id,
        'workspace',
        webhookData.workflow.workspaceId
      )
      if (userPermission !== null) {
        hasAccess = true
      }
    }

    if (!hasAccess) {
      logger.warn(`[${requestId}] User ${session.user.id} denied access to webhook: ${id}`)
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    logger.info(`[${requestId}] Successfully retrieved webhook: ${id}`)
    return NextResponse.json({ webhook: webhooks[0] }, { status: 200 })
  } catch (error) {
    logger.error(`[${requestId}] Error fetching webhook`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Update a webhook
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = generateRequestId()

  try {
    const { id } = await params
    logger.debug(`[${requestId}] Updating webhook with ID: ${id}`)

    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized webhook update attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { path, provider, providerConfig, isActive, failedCount } = body

    if (failedCount !== undefined) {
      const validation = validateInteger(failedCount, 'failedCount', { min: 0 })
      if (!validation.isValid) {
        logger.warn(`[${requestId}] ${validation.error}`)
        return NextResponse.json({ error: validation.error }, { status: 400 })
      }
    }

    let resolvedProviderConfig = providerConfig
    if (providerConfig) {
      const { resolveEnvVarsInObject } = await import('@/lib/webhooks/env-resolver')
      const webhookDataForResolve = await db
        .select({
          workspaceId: workflow.workspaceId,
        })
        .from(webhook)
        .innerJoin(workflow, eq(webhook.workflowId, workflow.id))
        .where(eq(webhook.id, id))
        .limit(1)

      if (webhookDataForResolve.length > 0) {
        resolvedProviderConfig = await resolveEnvVarsInObject(
          providerConfig,
          session.user.id,
          webhookDataForResolve[0].workspaceId || undefined
        )
      }
    }

    // Find the webhook and check permissions
    const webhooks = await db
      .select({
        webhook: webhook,
        workflow: {
          id: workflow.id,
          userId: workflow.userId,
          workspaceId: workflow.workspaceId,
        },
      })
      .from(webhook)
      .innerJoin(workflow, eq(webhook.workflowId, workflow.id))
      .where(eq(webhook.id, id))
      .limit(1)

    if (webhooks.length === 0) {
      logger.warn(`[${requestId}] Webhook not found: ${id}`)
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 })
    }

    const webhookData = webhooks[0]

    // Check if user has permission to modify this webhook
    let canModify = false

    // Case 1: User owns the workflow
    if (webhookData.workflow.userId === session.user.id) {
      canModify = true
    }

    // Case 2: Workflow belongs to a workspace and user has write or admin permission
    if (!canModify && webhookData.workflow.workspaceId) {
      const userPermission = await getUserEntityPermissions(
        session.user.id,
        'workspace',
        webhookData.workflow.workspaceId
      )
      if (userPermission === 'write' || userPermission === 'admin') {
        canModify = true
      }
    }

    if (!canModify) {
      logger.warn(
        `[${requestId}] User ${session.user.id} denied permission to modify webhook: ${id}`
      )
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    logger.debug(`[${requestId}] Updating webhook properties`, {
      hasPathUpdate: path !== undefined,
      hasProviderUpdate: provider !== undefined,
      hasConfigUpdate: providerConfig !== undefined,
      hasActiveUpdate: isActive !== undefined,
      hasFailedCountUpdate: failedCount !== undefined,
    })

    // Update the webhook
    const updatedWebhook = await db
      .update(webhook)
      .set({
        path: path !== undefined ? path : webhooks[0].webhook.path,
        provider: provider !== undefined ? provider : webhooks[0].webhook.provider,
        providerConfig:
          providerConfig !== undefined
            ? resolvedProviderConfig
            : webhooks[0].webhook.providerConfig,
        isActive: isActive !== undefined ? isActive : webhooks[0].webhook.isActive,
        failedCount: failedCount !== undefined ? failedCount : webhooks[0].webhook.failedCount,
        updatedAt: new Date(),
      })
      .where(eq(webhook.id, id))
      .returning()

    logger.info(`[${requestId}] Successfully updated webhook: ${id}`)
    return NextResponse.json({ webhook: updatedWebhook[0] }, { status: 200 })
  } catch (error) {
    logger.error(`[${requestId}] Error updating webhook`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Delete a webhook
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = generateRequestId()

  try {
    const { id } = await params
    logger.debug(`[${requestId}] Deleting webhook with ID: ${id}`)

    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized webhook deletion attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the webhook and check permissions
    const webhooks = await db
      .select({
        webhook: webhook,
        workflow: {
          id: workflow.id,
          userId: workflow.userId,
          workspaceId: workflow.workspaceId,
        },
      })
      .from(webhook)
      .innerJoin(workflow, eq(webhook.workflowId, workflow.id))
      .where(eq(webhook.id, id))
      .limit(1)

    if (webhooks.length === 0) {
      logger.warn(`[${requestId}] Webhook not found: ${id}`)
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 })
    }

    const webhookData = webhooks[0]

    // Check if user has permission to delete this webhook
    let canDelete = false

    // Case 1: User owns the workflow
    if (webhookData.workflow.userId === session.user.id) {
      canDelete = true
    }

    // Case 2: Workflow belongs to a workspace and user has write or admin permission
    if (!canDelete && webhookData.workflow.workspaceId) {
      const userPermission = await getUserEntityPermissions(
        session.user.id,
        'workspace',
        webhookData.workflow.workspaceId
      )
      if (userPermission === 'write' || userPermission === 'admin') {
        canDelete = true
      }
    }

    if (!canDelete) {
      logger.warn(
        `[${requestId}] User ${session.user.id} denied permission to delete webhook: ${id}`
      )
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const foundWebhook = webhookData.webhook

    const { cleanupExternalWebhook } = await import('@/lib/webhooks/provider-subscriptions')
    await cleanupExternalWebhook(foundWebhook, webhookData.workflow, requestId)

    await db.delete(webhook).where(eq(webhook.id, id))

    logger.info(`[${requestId}] Successfully deleted webhook: ${id}`)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    logger.error(`[${requestId}] Error deleting webhook`, {
      error: error.message,
      stack: error.stack,
    })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/webhooks/[id]/test-url/route.ts
Signals: Next.js

```typescript
import { db, webhook, workflow } from '@sim/db'
import { eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { generateRequestId } from '@/lib/core/utils/request'
import { getBaseUrl } from '@/lib/core/utils/urls'
import { createLogger } from '@/lib/logs/console/logger'
import { signTestWebhookToken } from '@/lib/webhooks/test-tokens'
import { getUserEntityPermissions } from '@/lib/workspaces/permissions/utils'

const logger = createLogger('MintWebhookTestUrlAPI')

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = generateRequestId()
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json().catch(() => ({}))
    const ttlSeconds = Math.max(
      60,
      Math.min(60 * 60 * 24 * 30, Number(body?.ttlSeconds) || 60 * 60 * 24 * 7)
    )

    // Load webhook + workflow for permission check
    const rows = await db
      .select({
        webhook: webhook,
        workflow: {
          id: workflow.id,
          userId: workflow.userId,
          workspaceId: workflow.workspaceId,
        },
      })
      .from(webhook)
      .innerJoin(workflow, eq(webhook.workflowId, workflow.id))
      .where(eq(webhook.id, id))
      .limit(1)

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 })
    }

    const wf = rows[0].workflow

    // Permissions: owner OR workspace write/admin
    let canMint = false
    if (wf.userId === session.user.id) {
      canMint = true
    } else if (wf.workspaceId) {
      const perm = await getUserEntityPermissions(session.user.id, 'workspace', wf.workspaceId)
      if (perm === 'write' || perm === 'admin') {
        canMint = true
      }
    }

    if (!canMint) {
      logger.warn(`[${requestId}] User ${session.user.id} denied mint for webhook ${id}`)
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const token = await signTestWebhookToken(id, ttlSeconds)
    const url = `${getBaseUrl()}/api/webhooks/test/${id}?token=${encodeURIComponent(token)}`

    logger.info(`[${requestId}] Minted test URL for webhook ${id}`)
    return NextResponse.json({
      url,
      expiresAt: new Date(Date.now() + ttlSeconds * 1000).toISOString(),
    })
  } catch (error: any) {
    logger.error('Error minting test webhook URL', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: middleware.ts]---
Location: sim-main/apps/sim/app/api/workflows/middleware.ts
Signals: Next.js

```typescript
import type { NextRequest } from 'next/server'
import {
  type ApiKeyAuthResult,
  authenticateApiKeyFromHeader,
  updateApiKeyLastUsed,
} from '@/lib/api-key/service'
import { env } from '@/lib/core/config/env'
import { createLogger } from '@/lib/logs/console/logger'
import { getWorkflowById } from '@/lib/workflows/utils'

const logger = createLogger('WorkflowMiddleware')

export interface ValidationResult {
  error?: { message: string; status: number }
  workflow?: any
}

export async function validateWorkflowAccess(
  request: NextRequest,
  workflowId: string,
  requireDeployment = true
): Promise<ValidationResult> {
  try {
    const workflow = await getWorkflowById(workflowId)
    if (!workflow) {
      return {
        error: {
          message: 'Workflow not found',
          status: 404,
        },
      }
    }

    if (requireDeployment) {
      if (!workflow.isDeployed) {
        return {
          error: {
            message: 'Workflow is not deployed',
            status: 403,
          },
        }
      }

      const internalSecret = request.headers.get('X-Internal-Secret')
      if (env.INTERNAL_API_SECRET && internalSecret === env.INTERNAL_API_SECRET) {
        return { workflow }
      }

      let apiKeyHeader = null
      for (const [key, value] of request.headers.entries()) {
        if (key.toLowerCase() === 'x-api-key' && value) {
          apiKeyHeader = value
          break
        }
      }

      if (!apiKeyHeader) {
        return {
          error: {
            message: 'Unauthorized: API key required',
            status: 401,
          },
        }
      }

      let validResult: ApiKeyAuthResult | null = null

      if (workflow.workspaceId) {
        const workspaceResult = await authenticateApiKeyFromHeader(apiKeyHeader, {
          workspaceId: workflow.workspaceId as string,
          keyTypes: ['workspace', 'personal'],
        })

        if (workspaceResult.success) {
          validResult = workspaceResult
        }
      } else {
        const personalResult = await authenticateApiKeyFromHeader(apiKeyHeader, {
          userId: workflow.userId as string,
          keyTypes: ['personal'],
        })

        if (personalResult.success) {
          validResult = personalResult
        }
      }

      if (!validResult) {
        return {
          error: {
            message: 'Unauthorized: Invalid API key',
            status: 401,
          },
        }
      }

      if (validResult.keyId) {
        await updateApiKeyLastUsed(validResult.keyId)
      }
    }
    return { workflow }
  } catch (error) {
    logger.error('Validation error:', { error })
    return {
      error: {
        message: 'Internal server error',
        status: 500,
      },
    }
  }
}
```

--------------------------------------------------------------------------------

````
