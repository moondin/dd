---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 266
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 266 of 933)

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
Location: sim-main/apps/sim/app/api/chat/[identifier]/route.test.ts

```typescript
/**
 * Tests for chat identifier API route
 *
 * @vitest-environment node
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMockRequest } from '@/app/api/__test-utils__/utils'

const createMockStream = () => {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(
        new TextEncoder().encode('data: {"blockId":"agent-1","chunk":"Hello"}\n\n')
      )
      controller.enqueue(
        new TextEncoder().encode('data: {"blockId":"agent-1","chunk":" world"}\n\n')
      )
      controller.enqueue(
        new TextEncoder().encode('data: {"event":"final","data":{"success":true}}\n\n')
      )
      controller.close()
    },
  })
}

vi.mock('@/lib/execution/preprocessing', () => ({
  preprocessExecution: vi.fn().mockResolvedValue({
    success: true,
    actorUserId: 'test-user-id',
    workflowRecord: {
      id: 'test-workflow-id',
      userId: 'test-user-id',
      isDeployed: true,
      workspaceId: 'test-workspace-id',
      variables: {},
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

vi.mock('@/lib/workflows/streaming/streaming', () => ({
  createStreamingResponse: vi.fn().mockImplementation(async () => createMockStream()),
}))

vi.mock('@/lib/core/utils/sse', () => ({
  SSE_HEADERS: {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  },
}))

vi.mock('@/lib/core/utils/request', () => ({
  generateRequestId: vi.fn().mockReturnValue('test-request-id'),
}))

vi.mock('@/app/api/workflows/[id]/execute/route', () => ({
  createFilteredResult: vi.fn().mockImplementation((result: any) => ({
    ...result,
    logs: undefined,
    metadata: result.metadata
      ? {
          ...result.metadata,
          workflowConnections: undefined,
        }
      : undefined,
  })),
}))

describe('Chat Identifier API Route', () => {
  const mockAddCorsHeaders = vi.fn().mockImplementation((response) => response)
  const mockValidateChatAuth = vi.fn().mockResolvedValue({ authorized: true })
  const mockSetChatAuthCookie = vi.fn()

  const mockChatResult = [
    {
      id: 'chat-id',
      workflowId: 'workflow-id',
      userId: 'user-id',
      isActive: true,
      authType: 'public',
      title: 'Test Chat',
      description: 'Test chat description',
      customizations: {
        welcomeMessage: 'Welcome to the test chat',
        primaryColor: '#000000',
      },
      outputConfigs: [{ blockId: 'block-1', path: 'output' }],
    },
  ]

  const mockWorkflowResult = [
    {
      isDeployed: true,
      state: {
        blocks: {},
        edges: [],
        loops: {},
        parallels: {},
      },
      deployedState: {
        blocks: {},
        edges: [],
        loops: {},
        parallels: {},
      },
    },
  ]

  beforeEach(() => {
    vi.resetModules()

    vi.doMock('@/app/api/chat/utils', () => ({
      addCorsHeaders: mockAddCorsHeaders,
      validateChatAuth: mockValidateChatAuth,
      setChatAuthCookie: mockSetChatAuthCookie,
      validateAuthToken: vi.fn().mockReturnValue(true),
    }))

    vi.doMock('@/lib/logs/console/logger', () => ({
      createLogger: vi.fn().mockReturnValue({
        debug: vi.fn(),
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
      }),
    }))

    vi.doMock('@sim/db', () => {
      const mockSelect = vi.fn().mockImplementation((fields) => {
        if (fields && fields.isDeployed !== undefined) {
          return {
            from: vi.fn().mockReturnValue({
              where: vi.fn().mockReturnValue({
                limit: vi.fn().mockReturnValue(mockWorkflowResult),
              }),
            }),
          }
        }
        return {
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue(mockChatResult),
            }),
          }),
        }
      })

      return {
        db: {
          select: mockSelect,
        },
        chat: {},
        workflow: {},
      }
    })

    vi.doMock('@/app/api/workflows/utils', () => ({
      createErrorResponse: vi.fn().mockImplementation((message, status, code) => {
        return new Response(
          JSON.stringify({
            error: code || 'Error',
            message,
          }),
          { status }
        )
      }),
      createSuccessResponse: vi.fn().mockImplementation((data) => {
        return new Response(JSON.stringify(data), { status: 200 })
      }),
    }))
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('GET endpoint', () => {
    it('should return chat info for a valid identifier', async () => {
      const req = createMockRequest('GET')
      const params = Promise.resolve({ identifier: 'test-chat' })

      const { GET } = await import('@/app/api/chat/[identifier]/route')

      const response = await GET(req, { params })

      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data).toHaveProperty('id', 'chat-id')
      expect(data).toHaveProperty('title', 'Test Chat')
      expect(data).toHaveProperty('description', 'Test chat description')
      expect(data).toHaveProperty('customizations')
      expect(data.customizations).toHaveProperty('welcomeMessage', 'Welcome to the test chat')
    })

    it('should return 404 for non-existent identifier', async () => {
      vi.doMock('@sim/db', () => {
        const mockLimit = vi.fn().mockReturnValue([])
        const mockWhere = vi.fn().mockReturnValue({ limit: mockLimit })
        const mockFrom = vi.fn().mockReturnValue({ where: mockWhere })
        const mockSelect = vi.fn().mockReturnValue({ from: mockFrom })

        return {
          db: {
            select: mockSelect,
          },
        }
      })

      const req = createMockRequest('GET')
      const params = Promise.resolve({ identifier: 'nonexistent' })

      const { GET } = await import('@/app/api/chat/[identifier]/route')

      const response = await GET(req, { params })

      expect(response.status).toBe(404)

      const data = await response.json()
      expect(data).toHaveProperty('error')
      expect(data).toHaveProperty('message', 'Chat not found')
    })

    it('should return 403 for inactive chat', async () => {
      vi.doMock('@sim/db', () => {
        const mockLimit = vi.fn().mockReturnValue([
          {
            id: 'chat-id',
            isActive: false,
            authType: 'public',
          },
        ])
        const mockWhere = vi.fn().mockReturnValue({ limit: mockLimit })
        const mockFrom = vi.fn().mockReturnValue({ where: mockWhere })
        const mockSelect = vi.fn().mockReturnValue({ from: mockFrom })

        return {
          db: {
            select: mockSelect,
          },
        }
      })

      const req = createMockRequest('GET')
      const params = Promise.resolve({ identifier: 'inactive-chat' })

      const { GET } = await import('@/app/api/chat/[identifier]/route')

      const response = await GET(req, { params })

      expect(response.status).toBe(403)

      const data = await response.json()
      expect(data).toHaveProperty('error')
      expect(data).toHaveProperty('message', 'This chat is currently unavailable')
    })

    it('should return 401 when authentication is required', async () => {
      const originalValidateChatAuth = mockValidateChatAuth.getMockImplementation()
      mockValidateChatAuth.mockImplementationOnce(async () => ({
        authorized: false,
        error: 'auth_required_password',
      }))

      const req = createMockRequest('GET')
      const params = Promise.resolve({ identifier: 'password-protected-chat' })

      const { GET } = await import('@/app/api/chat/[identifier]/route')

      const response = await GET(req, { params })

      expect(response.status).toBe(401)

      const data = await response.json()
      expect(data).toHaveProperty('error')
      expect(data).toHaveProperty('message', 'auth_required_password')

      if (originalValidateChatAuth) {
        mockValidateChatAuth.mockImplementation(originalValidateChatAuth)
      }
    })
  })

  describe('POST endpoint', () => {
    it('should handle authentication requests without input', async () => {
      const req = createMockRequest('POST', { password: 'test-password' })
      const params = Promise.resolve({ identifier: 'password-protected-chat' })

      const { POST } = await import('@/app/api/chat/[identifier]/route')

      const response = await POST(req, { params })

      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data).toHaveProperty('authenticated', true)

      expect(mockSetChatAuthCookie).toHaveBeenCalled()
    })

    it('should return 400 for requests without input', async () => {
      const req = createMockRequest('POST', {})
      const params = Promise.resolve({ identifier: 'test-chat' })

      const { POST } = await import('@/app/api/chat/[identifier]/route')

      const response = await POST(req, { params })

      expect(response.status).toBe(400)

      const data = await response.json()
      expect(data).toHaveProperty('error')
      expect(data).toHaveProperty('message', 'No input provided')
    })

    it('should return 401 for unauthorized access', async () => {
      const originalValidateChatAuth = mockValidateChatAuth.getMockImplementation()
      mockValidateChatAuth.mockImplementationOnce(async () => ({
        authorized: false,
        error: 'Authentication required',
      }))

      const req = createMockRequest('POST', { input: 'Hello' })
      const params = Promise.resolve({ identifier: 'protected-chat' })

      const { POST } = await import('@/app/api/chat/[identifier]/route')

      const response = await POST(req, { params })

      expect(response.status).toBe(401)

      const data = await response.json()
      expect(data).toHaveProperty('error')
      expect(data).toHaveProperty('message', 'Authentication required')

      if (originalValidateChatAuth) {
        mockValidateChatAuth.mockImplementation(originalValidateChatAuth)
      }
    })

    it('should return 503 when workflow is not available', async () => {
      const { preprocessExecution } = await import('@/lib/execution/preprocessing')
      const originalImplementation = vi.mocked(preprocessExecution).getMockImplementation()

      vi.mocked(preprocessExecution).mockResolvedValueOnce({
        success: false,
        error: {
          message: 'Workflow is not deployed',
          statusCode: 403,
          logCreated: false,
        },
      })

      const req = createMockRequest('POST', { input: 'Hello' })
      const params = Promise.resolve({ identifier: 'test-chat' })

      const { POST } = await import('@/app/api/chat/[identifier]/route')

      const response = await POST(req, { params })

      expect(response.status).toBe(403)

      const data = await response.json()
      expect(data).toHaveProperty('error')
      expect(data).toHaveProperty('message', 'Workflow is not deployed')

      if (originalImplementation) {
        vi.mocked(preprocessExecution).mockImplementation(originalImplementation)
      }
    })

    it('should return streaming response for valid chat messages', async () => {
      const req = createMockRequest('POST', { input: 'Hello world', conversationId: 'conv-123' })
      const params = Promise.resolve({ identifier: 'test-chat' })

      const { POST } = await import('@/app/api/chat/[identifier]/route')
      const { createStreamingResponse } = await import('@/lib/workflows/streaming/streaming')

      const response = await POST(req, { params })

      expect(response.status).toBe(200)
      expect(response.headers.get('Content-Type')).toBe('text/event-stream')
      expect(response.headers.get('Cache-Control')).toBe('no-cache')
      expect(response.headers.get('Connection')).toBe('keep-alive')

      expect(createStreamingResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          workflow: expect.objectContaining({
            id: 'workflow-id',
            userId: 'user-id',
          }),
          input: expect.objectContaining({
            input: 'Hello world',
            conversationId: 'conv-123',
          }),
          streamConfig: expect.objectContaining({
            isSecureMode: true,
            workflowTriggerType: 'chat',
          }),
        })
      )
    }, 10000)

    it('should handle streaming response body correctly', async () => {
      const req = createMockRequest('POST', { input: 'Hello world' })
      const params = Promise.resolve({ identifier: 'test-chat' })

      const { POST } = await import('@/app/api/chat/[identifier]/route')

      const response = await POST(req, { params })

      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(ReadableStream)

      if (response.body) {
        const reader = response.body.getReader()
        const { value, done } = await reader.read()

        if (!done && value) {
          const chunk = new TextDecoder().decode(value)
          expect(chunk).toMatch(/^data: /)
        }

        reader.releaseLock()
      }
    })

    it('should handle workflow execution errors gracefully', async () => {
      const { createStreamingResponse } = await import('@/lib/workflows/streaming/streaming')
      const originalStreamingResponse = vi.mocked(createStreamingResponse).getMockImplementation()
      vi.mocked(createStreamingResponse).mockImplementationOnce(async () => {
        throw new Error('Execution failed')
      })

      const req = createMockRequest('POST', { input: 'Trigger error' })
      const params = Promise.resolve({ identifier: 'test-chat' })

      const { POST } = await import('@/app/api/chat/[identifier]/route')

      const response = await POST(req, { params })

      expect(response.status).toBe(500)

      const data = await response.json()
      expect(data).toHaveProperty('error')
      expect(data).toHaveProperty('message', 'Execution failed')

      if (originalStreamingResponse) {
        vi.mocked(createStreamingResponse).mockImplementation(originalStreamingResponse)
      }
    })

    it('should handle invalid JSON in request body', async () => {
      const req = {
        method: 'POST',
        headers: new Headers(),
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
      } as any

      const params = Promise.resolve({ identifier: 'test-chat' })

      const { POST } = await import('@/app/api/chat/[identifier]/route')

      const response = await POST(req, { params })

      expect(response.status).toBe(400)

      const data = await response.json()
      expect(data).toHaveProperty('error')
      expect(data).toHaveProperty('message', 'Invalid request body')
    })

    it('should pass conversationId to streaming execution when provided', async () => {
      const req = createMockRequest('POST', {
        input: 'Hello world',
        conversationId: 'test-conversation-123',
      })
      const params = Promise.resolve({ identifier: 'test-chat' })

      const { POST } = await import('@/app/api/chat/[identifier]/route')
      const { createStreamingResponse } = await import('@/lib/workflows/streaming/streaming')

      await POST(req, { params })

      expect(createStreamingResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({
            input: 'Hello world',
            conversationId: 'test-conversation-123',
          }),
        })
      )
    })

    it('should handle missing conversationId gracefully', async () => {
      const req = createMockRequest('POST', { input: 'Hello world' })
      const params = Promise.resolve({ identifier: 'test-chat' })

      const { POST } = await import('@/app/api/chat/[identifier]/route')
      const { createStreamingResponse } = await import('@/lib/workflows/streaming/streaming')

      await POST(req, { params })

      expect(createStreamingResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({
            input: 'Hello world',
          }),
        })
      )
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/chat/[identifier]/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import { db } from '@sim/db'
import { chat } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { generateRequestId } from '@/lib/core/utils/request'
import { preprocessExecution } from '@/lib/execution/preprocessing'
import { createLogger } from '@/lib/logs/console/logger'
import { LoggingSession } from '@/lib/logs/execution/logging-session'
import { ChatFiles } from '@/lib/uploads'
import {
  addCorsHeaders,
  setChatAuthCookie,
  validateAuthToken,
  validateChatAuth,
} from '@/app/api/chat/utils'
import { createErrorResponse, createSuccessResponse } from '@/app/api/workflows/utils'

const logger = createLogger('ChatIdentifierAPI')

const chatFileSchema = z.object({
  name: z.string().min(1, 'File name is required'),
  type: z.string().min(1, 'File type is required'),
  size: z.number().positive('File size must be positive'),
  data: z.string().min(1, 'File data is required'),
  lastModified: z.number().optional(),
})

const chatPostBodySchema = z.object({
  input: z.string().optional(),
  password: z.string().optional(),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  conversationId: z.string().optional(),
  files: z.array(chatFileSchema).optional().default([]),
})

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ identifier: string }> }
) {
  const { identifier } = await params
  const requestId = generateRequestId()

  try {
    logger.debug(`[${requestId}] Processing chat request for identifier: ${identifier}`)

    let parsedBody
    try {
      const rawBody = await request.json()
      const validation = chatPostBodySchema.safeParse(rawBody)

      if (!validation.success) {
        const errorMessage = validation.error.errors
          .map((err) => `${err.path.join('.')}: ${err.message}`)
          .join(', ')
        logger.warn(`[${requestId}] Validation error: ${errorMessage}`)
        return addCorsHeaders(
          createErrorResponse(`Invalid request body: ${errorMessage}`, 400),
          request
        )
      }

      parsedBody = validation.data
    } catch (_error) {
      return addCorsHeaders(createErrorResponse('Invalid request body', 400), request)
    }

    const deploymentResult = await db
      .select({
        id: chat.id,
        workflowId: chat.workflowId,
        userId: chat.userId,
        isActive: chat.isActive,
        authType: chat.authType,
        password: chat.password,
        allowedEmails: chat.allowedEmails,
        outputConfigs: chat.outputConfigs,
      })
      .from(chat)
      .where(eq(chat.identifier, identifier))
      .limit(1)

    if (deploymentResult.length === 0) {
      logger.warn(`[${requestId}] Chat not found for identifier: ${identifier}`)
      return addCorsHeaders(createErrorResponse('Chat not found', 404), request)
    }

    const deployment = deploymentResult[0]

    if (!deployment.isActive) {
      logger.warn(`[${requestId}] Chat is not active: ${identifier}`)

      const executionId = randomUUID()
      const loggingSession = new LoggingSession(
        deployment.workflowId,
        executionId,
        'chat',
        requestId
      )

      await loggingSession.safeStart({
        userId: deployment.userId,
        workspaceId: '', // Will be resolved if needed
        variables: {},
      })

      await loggingSession.safeCompleteWithError({
        error: {
          message: 'This chat is currently unavailable. The chat has been disabled.',
          stackTrace: undefined,
        },
        traceSpans: [],
      })

      return addCorsHeaders(createErrorResponse('This chat is currently unavailable', 403), request)
    }

    const authResult = await validateChatAuth(requestId, deployment, request, parsedBody)
    if (!authResult.authorized) {
      return addCorsHeaders(
        createErrorResponse(authResult.error || 'Authentication required', 401),
        request
      )
    }

    const { input, password, email, conversationId, files } = parsedBody

    if ((password || email) && !input) {
      const response = addCorsHeaders(createSuccessResponse({ authenticated: true }), request)

      setChatAuthCookie(response, deployment.id, deployment.authType, deployment.password)

      return response
    }

    if (!input && (!files || files.length === 0)) {
      return addCorsHeaders(createErrorResponse('No input provided', 400), request)
    }

    const executionId = randomUUID()

    const loggingSession = new LoggingSession(deployment.workflowId, executionId, 'chat', requestId)

    const preprocessResult = await preprocessExecution({
      workflowId: deployment.workflowId,
      userId: deployment.userId,
      triggerType: 'chat',
      executionId,
      requestId,
      checkRateLimit: true,
      checkDeployment: true,
      loggingSession,
    })

    if (!preprocessResult.success) {
      logger.warn(`[${requestId}] Preprocessing failed: ${preprocessResult.error?.message}`)
      return addCorsHeaders(
        createErrorResponse(
          preprocessResult.error?.message || 'Failed to process request',
          preprocessResult.error?.statusCode || 500
        ),
        request
      )
    }

    const { actorUserId, workflowRecord } = preprocessResult
    const workspaceOwnerId = actorUserId!
    const workspaceId = workflowRecord?.workspaceId || ''

    try {
      const selectedOutputs: string[] = []
      if (deployment.outputConfigs && Array.isArray(deployment.outputConfigs)) {
        for (const config of deployment.outputConfigs) {
          const outputId = config.path
            ? `${config.blockId}_${config.path}`
            : `${config.blockId}_content`
          selectedOutputs.push(outputId)
        }
      }

      const { createStreamingResponse } = await import('@/lib/workflows/streaming/streaming')
      const { SSE_HEADERS } = await import('@/lib/core/utils/sse')
      const { createFilteredResult } = await import('@/app/api/workflows/[id]/execute/route')

      const workflowInput: any = { input, conversationId }
      if (files && Array.isArray(files) && files.length > 0) {
        const executionContext = {
          workspaceId,
          workflowId: deployment.workflowId,
          executionId,
        }

        try {
          const uploadedFiles = await ChatFiles.processChatFiles(
            files,
            executionContext,
            requestId,
            deployment.userId
          )

          if (uploadedFiles.length > 0) {
            workflowInput.files = uploadedFiles
            logger.info(`[${requestId}] Successfully processed ${uploadedFiles.length} files`)
          }
        } catch (fileError: any) {
          logger.error(`[${requestId}] Failed to process chat files:`, fileError)

          await loggingSession.safeStart({
            userId: workspaceOwnerId,
            workspaceId,
            variables: {},
          })

          await loggingSession.safeCompleteWithError({
            error: {
              message: `File upload failed: ${fileError.message || 'Unable to process uploaded files'}`,
              stackTrace: fileError.stack,
            },
            traceSpans: [],
          })

          throw fileError
        }
      }

      const workflowForExecution = {
        id: deployment.workflowId,
        userId: deployment.userId,
        workspaceId,
        isDeployed: workflowRecord?.isDeployed ?? false,
        variables: workflowRecord?.variables || {},
      }

      const stream = await createStreamingResponse({
        requestId,
        workflow: workflowForExecution,
        input: workflowInput,
        executingUserId: workspaceOwnerId,
        streamConfig: {
          selectedOutputs,
          isSecureMode: true,
          workflowTriggerType: 'chat',
        },
        createFilteredResult,
        executionId,
      })

      const streamResponse = new NextResponse(stream, {
        status: 200,
        headers: SSE_HEADERS,
      })
      return addCorsHeaders(streamResponse, request)
    } catch (error: any) {
      logger.error(`[${requestId}] Error processing chat request:`, error)
      return addCorsHeaders(
        createErrorResponse(error.message || 'Failed to process request', 500),
        request
      )
    }
  } catch (error: any) {
    logger.error(`[${requestId}] Error processing chat request:`, error)
    return addCorsHeaders(
      createErrorResponse(error.message || 'Failed to process request', 500),
      request
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ identifier: string }> }
) {
  const { identifier } = await params
  const requestId = generateRequestId()

  try {
    logger.debug(`[${requestId}] Fetching chat info for identifier: ${identifier}`)

    const deploymentResult = await db
      .select({
        id: chat.id,
        title: chat.title,
        description: chat.description,
        customizations: chat.customizations,
        isActive: chat.isActive,
        workflowId: chat.workflowId,
        authType: chat.authType,
        password: chat.password,
        allowedEmails: chat.allowedEmails,
        outputConfigs: chat.outputConfigs,
      })
      .from(chat)
      .where(eq(chat.identifier, identifier))
      .limit(1)

    if (deploymentResult.length === 0) {
      logger.warn(`[${requestId}] Chat not found for identifier: ${identifier}`)
      return addCorsHeaders(createErrorResponse('Chat not found', 404), request)
    }

    const deployment = deploymentResult[0]

    if (!deployment.isActive) {
      logger.warn(`[${requestId}] Chat is not active: ${identifier}`)
      return addCorsHeaders(createErrorResponse('This chat is currently unavailable', 403), request)
    }

    const cookieName = `chat_auth_${deployment.id}`
    const authCookie = request.cookies.get(cookieName)

    if (
      deployment.authType !== 'public' &&
      authCookie &&
      validateAuthToken(authCookie.value, deployment.id, deployment.password)
    ) {
      return addCorsHeaders(
        createSuccessResponse({
          id: deployment.id,
          title: deployment.title,
          description: deployment.description,
          customizations: deployment.customizations,
          authType: deployment.authType,
          outputConfigs: deployment.outputConfigs,
        }),
        request
      )
    }

    const authResult = await validateChatAuth(requestId, deployment, request)
    if (!authResult.authorized) {
      logger.info(
        `[${requestId}] Authentication required for chat: ${identifier}, type: ${deployment.authType}`
      )
      return addCorsHeaders(
        createErrorResponse(authResult.error || 'Authentication required', 401),
        request
      )
    }

    return addCorsHeaders(
      createSuccessResponse({
        id: deployment.id,
        title: deployment.title,
        description: deployment.description,
        customizations: deployment.customizations,
        authType: deployment.authType,
        outputConfigs: deployment.outputConfigs,
      }),
      request
    )
  } catch (error: any) {
    logger.error(`[${requestId}] Error fetching chat info:`, error)
    return addCorsHeaders(
      createErrorResponse(error.message || 'Failed to fetch chat information', 500),
      request
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/chat/[identifier]/otp/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import { chat } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { z } from 'zod'
import { renderOTPEmail } from '@/components/emails/render-email'
import { getRedisClient } from '@/lib/core/config/redis'
import { getStorageMethod } from '@/lib/core/storage'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { sendEmail } from '@/lib/messaging/email/mailer'
import { addCorsHeaders, setChatAuthCookie } from '@/app/api/chat/utils'
import { createErrorResponse, createSuccessResponse } from '@/app/api/workflows/utils'

const logger = createLogger('ChatOtpAPI')

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

const OTP_EXPIRY = 15 * 60 // 15 minutes
const OTP_EXPIRY_MS = OTP_EXPIRY * 1000

/**
 * In-memory OTP storage for single-instance deployments without Redis.
 * Only used when REDIS_URL is not configured (determined once at startup).
 *
 * Warning: This does NOT work in multi-instance/serverless deployments.
 */
const inMemoryOTPStore = new Map<string, { otp: string; expiresAt: number }>()

function cleanupExpiredOTPs() {
  const now = Date.now()
  for (const [key, value] of inMemoryOTPStore.entries()) {
    if (value.expiresAt < now) {
      inMemoryOTPStore.delete(key)
    }
  }
}

async function storeOTP(email: string, chatId: string, otp: string): Promise<void> {
  const key = `otp:${email}:${chatId}`
  const storageMethod = getStorageMethod()

  if (storageMethod === 'redis') {
    const redis = getRedisClient()
    if (!redis) {
      throw new Error('Redis configured but client unavailable')
    }
    await redis.set(key, otp, 'EX', OTP_EXPIRY)
  } else {
    cleanupExpiredOTPs()
    inMemoryOTPStore.set(key, {
      otp,
      expiresAt: Date.now() + OTP_EXPIRY_MS,
    })
  }
}

async function getOTP(email: string, chatId: string): Promise<string | null> {
  const key = `otp:${email}:${chatId}`
  const storageMethod = getStorageMethod()

  if (storageMethod === 'redis') {
    const redis = getRedisClient()
    if (!redis) {
      throw new Error('Redis configured but client unavailable')
    }
    return redis.get(key)
  }

  const entry = inMemoryOTPStore.get(key)
  if (!entry) return null

  if (entry.expiresAt < Date.now()) {
    inMemoryOTPStore.delete(key)
    return null
  }

  return entry.otp
}

async function deleteOTP(email: string, chatId: string): Promise<void> {
  const key = `otp:${email}:${chatId}`
  const storageMethod = getStorageMethod()

  if (storageMethod === 'redis') {
    const redis = getRedisClient()
    if (!redis) {
      throw new Error('Redis configured but client unavailable')
    }
    await redis.del(key)
  } else {
    inMemoryOTPStore.delete(key)
  }
}

const otpRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
})

const otpVerifySchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ identifier: string }> }
) {
  const { identifier } = await params
  const requestId = generateRequestId()

  try {
    logger.debug(`[${requestId}] Processing OTP request for identifier: ${identifier}`)

    const body = await request.json()
    const { email } = otpRequestSchema.parse(body)

    const deploymentResult = await db
      .select({
        id: chat.id,
        authType: chat.authType,
        allowedEmails: chat.allowedEmails,
        title: chat.title,
      })
      .from(chat)
      .where(eq(chat.identifier, identifier))
      .limit(1)

    if (deploymentResult.length === 0) {
      logger.warn(`[${requestId}] Chat not found for identifier: ${identifier}`)
      return addCorsHeaders(createErrorResponse('Chat not found', 404), request)
    }

    const deployment = deploymentResult[0]

    if (deployment.authType !== 'email') {
      return addCorsHeaders(
        createErrorResponse('This chat does not use email authentication', 400),
        request
      )
    }

    const allowedEmails: string[] = Array.isArray(deployment.allowedEmails)
      ? deployment.allowedEmails
      : []

    const isEmailAllowed =
      allowedEmails.includes(email) ||
      allowedEmails.some((allowed: string) => {
        if (allowed.startsWith('@')) {
          const domain = email.split('@')[1]
          return domain && allowed === `@${domain}`
        }
        return false
      })

    if (!isEmailAllowed) {
      return addCorsHeaders(createErrorResponse('Email not authorized for this chat', 403), request)
    }

    const otp = generateOTP()
    await storeOTP(email, deployment.id, otp)

    const emailHtml = await renderOTPEmail(
      otp,
      email,
      'email-verification',
      deployment.title || 'Chat'
    )

    const emailResult = await sendEmail({
      to: email,
      subject: `Verification code for ${deployment.title || 'Chat'}`,
      html: emailHtml,
    })

    if (!emailResult.success) {
      logger.error(`[${requestId}] Failed to send OTP email:`, emailResult.message)
      return addCorsHeaders(createErrorResponse('Failed to send verification email', 500), request)
    }

    logger.info(`[${requestId}] OTP sent to ${email} for chat ${deployment.id}`)
    return addCorsHeaders(createSuccessResponse({ message: 'Verification code sent' }), request)
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return addCorsHeaders(
        createErrorResponse(error.errors[0]?.message || 'Invalid request', 400),
        request
      )
    }
    logger.error(`[${requestId}] Error processing OTP request:`, error)
    return addCorsHeaders(
      createErrorResponse(error.message || 'Failed to process request', 500),
      request
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ identifier: string }> }
) {
  const { identifier } = await params
  const requestId = generateRequestId()

  try {
    logger.debug(`[${requestId}] Verifying OTP for identifier: ${identifier}`)

    const body = await request.json()
    const { email, otp } = otpVerifySchema.parse(body)

    const deploymentResult = await db
      .select({
        id: chat.id,
        authType: chat.authType,
      })
      .from(chat)
      .where(eq(chat.identifier, identifier))
      .limit(1)

    if (deploymentResult.length === 0) {
      logger.warn(`[${requestId}] Chat not found for identifier: ${identifier}`)
      return addCorsHeaders(createErrorResponse('Chat not found', 404), request)
    }

    const deployment = deploymentResult[0]

    const storedOTP = await getOTP(email, deployment.id)
    if (!storedOTP) {
      return addCorsHeaders(
        createErrorResponse('No verification code found, request a new one', 400),
        request
      )
    }

    if (storedOTP !== otp) {
      return addCorsHeaders(createErrorResponse('Invalid verification code', 400), request)
    }

    await deleteOTP(email, deployment.id)

    const response = addCorsHeaders(createSuccessResponse({ authenticated: true }), request)
    setChatAuthCookie(response, deployment.id, deployment.authType)

    return response
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return addCorsHeaders(
        createErrorResponse(error.errors[0]?.message || 'Invalid request', 400),
        request
      )
    }
    logger.error(`[${requestId}] Error verifying OTP:`, error)
    return addCorsHeaders(
      createErrorResponse(error.message || 'Failed to process request', 500),
      request
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/copilot/api-keys/route.ts
Signals: Next.js

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { SIM_AGENT_API_URL_DEFAULT } from '@/lib/copilot/constants'
import { env } from '@/lib/core/config/env'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const SIM_AGENT_API_URL = env.SIM_AGENT_API_URL || SIM_AGENT_API_URL_DEFAULT

    const res = await fetch(`${SIM_AGENT_API_URL}/api/validate-key/get-api-keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(env.COPILOT_API_KEY ? { 'x-api-key': env.COPILOT_API_KEY } : {}),
      },
      body: JSON.stringify({ userId }),
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to get keys' }, { status: res.status || 500 })
    }

    const apiKeys = (await res.json().catch(() => null)) as
      | { id: string; apiKey: string; name?: string; createdAt?: string; lastUsed?: string }[]
      | null

    if (!Array.isArray(apiKeys)) {
      return NextResponse.json({ error: 'Invalid response from Sim Agent' }, { status: 500 })
    }

    const keys = apiKeys.map((k) => {
      const value = typeof k.apiKey === 'string' ? k.apiKey : ''
      const last6 = value.slice(-6)
      const displayKey = `•••••${last6}`
      return {
        id: k.id,
        displayKey,
        name: k.name || null,
        createdAt: k.createdAt || null,
        lastUsed: k.lastUsed || null,
      }
    })

    return NextResponse.json({ keys }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get keys' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const SIM_AGENT_API_URL = env.SIM_AGENT_API_URL || SIM_AGENT_API_URL_DEFAULT

    const res = await fetch(`${SIM_AGENT_API_URL}/api/validate-key/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(env.COPILOT_API_KEY ? { 'x-api-key': env.COPILOT_API_KEY } : {}),
      },
      body: JSON.stringify({ userId, apiKeyId: id }),
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to delete key' }, { status: res.status || 500 })
    }

    const data = (await res.json().catch(() => null)) as { success?: boolean } | null
    if (!data?.success) {
      return NextResponse.json({ error: 'Invalid response from Sim Agent' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete key' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

````
