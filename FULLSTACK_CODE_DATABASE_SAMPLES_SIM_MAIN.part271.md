---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 271
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 271 of 933)

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
Location: sim-main/apps/sim/app/api/copilot/confirm/route.test.ts
Signals: Next.js

```typescript
/**
 * Tests for copilot confirm API route
 *
 * @vitest-environment node
 */
import { NextRequest } from 'next/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  createMockRequest,
  mockAuth,
  mockCryptoUuid,
  setupCommonApiMocks,
} from '@/app/api/__test-utils__/utils'

describe('Copilot Confirm API Route', () => {
  const mockRedisExists = vi.fn()
  const mockRedisSet = vi.fn()
  const mockGetRedisClient = vi.fn()

  beforeEach(() => {
    vi.resetModules()
    setupCommonApiMocks()
    mockCryptoUuid()

    const mockRedisClient = {
      exists: mockRedisExists,
      set: mockRedisSet,
    }

    mockGetRedisClient.mockReturnValue(mockRedisClient)
    mockRedisExists.mockResolvedValue(1)
    mockRedisSet.mockResolvedValue('OK')

    vi.doMock('@/lib/core/config/redis', () => ({
      getRedisClient: mockGetRedisClient,
    }))

    vi.spyOn(global, 'setTimeout').mockImplementation((callback, _delay) => {
      if (typeof callback === 'function') {
        setImmediate(callback)
      }
      return setTimeout(() => {}, 0) as any
    })

    let mockTime = 1640995200000
    vi.spyOn(Date, 'now').mockImplementation(() => {
      mockTime += 10000
      return mockTime
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
  })

  describe('POST', () => {
    it('should return 401 when user is not authenticated', async () => {
      const authMocks = mockAuth()
      authMocks.setUnauthenticated()

      const req = createMockRequest('POST', {
        toolCallId: 'tool-call-123',
        status: 'success',
      })

      const { POST } = await import('@/app/api/copilot/confirm/route')
      const response = await POST(req)

      expect(response.status).toBe(401)
      const responseData = await response.json()
      expect(responseData).toEqual({ error: 'Unauthorized' })
    })

    it('should return 400 for invalid request body - missing toolCallId', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      const req = createMockRequest('POST', {
        status: 'success',
      })

      const { POST } = await import('@/app/api/copilot/confirm/route')
      const response = await POST(req)

      expect(response.status).toBe(400)
      const responseData = await response.json()
      expect(responseData.error).toContain('Required')
    })

    it('should return 400 for invalid request body - missing status', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      const req = createMockRequest('POST', {
        toolCallId: 'tool-call-123',
        // Missing status
      })

      const { POST } = await import('@/app/api/copilot/confirm/route')
      const response = await POST(req)

      expect(response.status).toBe(400)
      const responseData = await response.json()
      expect(responseData.error).toContain('Invalid request data')
    })

    it('should return 400 for invalid status value', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      const req = createMockRequest('POST', {
        toolCallId: 'tool-call-123',
        status: 'invalid-status',
      })

      const { POST } = await import('@/app/api/copilot/confirm/route')
      const response = await POST(req)

      expect(response.status).toBe(400)
      const responseData = await response.json()
      expect(responseData.error).toContain('Invalid notification status')
    })

    it('should successfully confirm tool call with success status', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      const req = createMockRequest('POST', {
        toolCallId: 'tool-call-123',
        status: 'success',
        message: 'Tool executed successfully',
      })

      const { POST } = await import('@/app/api/copilot/confirm/route')
      const response = await POST(req)

      expect(response.status).toBe(200)
      const responseData = await response.json()
      expect(responseData).toEqual({
        success: true,
        message: 'Tool executed successfully',
        toolCallId: 'tool-call-123',
        status: 'success',
      })

      expect(mockRedisExists).toHaveBeenCalled()
      expect(mockRedisSet).toHaveBeenCalled()
    })

    it('should successfully confirm tool call with error status', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      const req = createMockRequest('POST', {
        toolCallId: 'tool-call-456',
        status: 'error',
        message: 'Tool execution failed',
      })

      const { POST } = await import('@/app/api/copilot/confirm/route')
      const response = await POST(req)

      expect(response.status).toBe(200)
      const responseData = await response.json()
      expect(responseData).toEqual({
        success: true,
        message: 'Tool execution failed',
        toolCallId: 'tool-call-456',
        status: 'error',
      })

      expect(mockRedisSet).toHaveBeenCalled()
    })

    it('should successfully confirm tool call with accepted status', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      const req = createMockRequest('POST', {
        toolCallId: 'tool-call-789',
        status: 'accepted',
      })

      const { POST } = await import('@/app/api/copilot/confirm/route')
      const response = await POST(req)

      expect(response.status).toBe(200)
      const responseData = await response.json()
      expect(responseData).toEqual({
        success: true,
        message: 'Tool call tool-call-789 has been accepted',
        toolCallId: 'tool-call-789',
        status: 'accepted',
      })

      expect(mockRedisSet).toHaveBeenCalled()
    })

    it('should successfully confirm tool call with rejected status', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      const req = createMockRequest('POST', {
        toolCallId: 'tool-call-101',
        status: 'rejected',
      })

      const { POST } = await import('@/app/api/copilot/confirm/route')
      const response = await POST(req)

      expect(response.status).toBe(200)
      const responseData = await response.json()
      expect(responseData).toEqual({
        success: true,
        message: 'Tool call tool-call-101 has been rejected',
        toolCallId: 'tool-call-101',
        status: 'rejected',
      })
    })

    it('should successfully confirm tool call with background status', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      const req = createMockRequest('POST', {
        toolCallId: 'tool-call-bg',
        status: 'background',
        message: 'Moved to background execution',
      })

      const { POST } = await import('@/app/api/copilot/confirm/route')
      const response = await POST(req)

      expect(response.status).toBe(200)
      const responseData = await response.json()
      expect(responseData).toEqual({
        success: true,
        message: 'Moved to background execution',
        toolCallId: 'tool-call-bg',
        status: 'background',
      })
    })

    it('should return 400 when Redis client is not available', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      mockGetRedisClient.mockReturnValue(null)

      const req = createMockRequest('POST', {
        toolCallId: 'tool-call-123',
        status: 'success',
      })

      const { POST } = await import('@/app/api/copilot/confirm/route')
      const response = await POST(req)

      expect(response.status).toBe(400)
      const responseData = await response.json()
      expect(responseData.error).toBe('Failed to update tool call status or tool call not found')
    })

    it('should return 400 when tool call is not found in Redis', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      mockRedisExists.mockResolvedValue(0)

      const req = createMockRequest('POST', {
        toolCallId: 'non-existent-tool',
        status: 'success',
      })

      const { POST } = await import('@/app/api/copilot/confirm/route')
      const response = await POST(req)

      expect(response.status).toBe(400)
      const responseData = await response.json()
      expect(responseData.error).toBe('Failed to update tool call status or tool call not found')
    }, 10000) // 10 second timeout for this specific test

    it('should handle Redis errors gracefully', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      mockRedisExists.mockRejectedValue(new Error('Redis connection failed'))

      const req = createMockRequest('POST', {
        toolCallId: 'tool-call-123',
        status: 'success',
      })

      const { POST } = await import('@/app/api/copilot/confirm/route')
      const response = await POST(req)

      expect(response.status).toBe(400)
      const responseData = await response.json()
      expect(responseData.error).toBe('Failed to update tool call status or tool call not found')
    })

    it('should handle Redis set operation failure', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      mockRedisExists.mockResolvedValue(1)
      mockRedisSet.mockRejectedValue(new Error('Redis set failed'))

      const req = createMockRequest('POST', {
        toolCallId: 'tool-call-123',
        status: 'success',
      })

      const { POST } = await import('@/app/api/copilot/confirm/route')
      const response = await POST(req)

      expect(response.status).toBe(400)
      const responseData = await response.json()
      expect(responseData.error).toBe('Failed to update tool call status or tool call not found')
    })

    it('should handle JSON parsing errors in request body', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      const req = new NextRequest('http://localhost:3000/api/copilot/confirm', {
        method: 'POST',
        body: '{invalid-json',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const { POST } = await import('@/app/api/copilot/confirm/route')
      const response = await POST(req)

      expect(response.status).toBe(500)
      const responseData = await response.json()
      expect(responseData.error).toContain('JSON')
    })

    it('should validate empty toolCallId', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      const req = createMockRequest('POST', {
        toolCallId: '',
        status: 'success',
      })

      const { POST } = await import('@/app/api/copilot/confirm/route')
      const response = await POST(req)

      expect(response.status).toBe(400)
      const responseData = await response.json()
      expect(responseData.error).toContain('Tool call ID is required')
    })

    it('should handle all valid status types', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      const validStatuses = ['success', 'error', 'accepted', 'rejected', 'background']

      for (const status of validStatuses) {
        const req = createMockRequest('POST', {
          toolCallId: `tool-call-${status}`,
          status,
        })

        const { POST } = await import('@/app/api/copilot/confirm/route')
        const response = await POST(req)

        expect(response.status).toBe(200)
        const responseData = await response.json()
        expect(responseData.success).toBe(true)
        expect(responseData.status).toBe(status)
        expect(responseData.toolCallId).toBe(`tool-call-${status}`)
      }
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/copilot/confirm/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import {
  authenticateCopilotRequestSessionOnly,
  createBadRequestResponse,
  createInternalServerErrorResponse,
  createRequestTracker,
  createUnauthorizedResponse,
  type NotificationStatus,
} from '@/lib/copilot/request-helpers'
import { getRedisClient } from '@/lib/core/config/redis'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('CopilotConfirmAPI')

// Schema for confirmation request
const ConfirmationSchema = z.object({
  toolCallId: z.string().min(1, 'Tool call ID is required'),
  status: z.enum(['success', 'error', 'accepted', 'rejected', 'background'] as const, {
    errorMap: () => ({ message: 'Invalid notification status' }),
  }),
  message: z.string().optional(), // Optional message for background moves or additional context
})

/**
 * Update tool call status in Redis
 */
async function updateToolCallStatus(
  toolCallId: string,
  status: NotificationStatus,
  message?: string
): Promise<boolean> {
  const redis = getRedisClient()
  if (!redis) {
    logger.warn('updateToolCallStatus: Redis client not available')
    return false
  }

  try {
    const key = `tool_call:${toolCallId}`
    const timeout = 600000 // 10 minutes timeout for user confirmation
    const pollInterval = 100 // Poll every 100ms
    const startTime = Date.now()

    logger.info('Polling for tool call in Redis', { toolCallId, key, timeout })

    // Poll until the key exists or timeout
    while (Date.now() - startTime < timeout) {
      const exists = await redis.exists(key)
      if (exists) {
        break
      }

      // Wait before next poll
      await new Promise((resolve) => setTimeout(resolve, pollInterval))
    }

    // Final check if key exists after polling
    const exists = await redis.exists(key)
    if (!exists) {
      logger.warn('Tool call not found in Redis after polling timeout', {
        toolCallId,
        key,
        timeout,
        pollDuration: Date.now() - startTime,
      })
      return false
    }

    // Store both status and message as JSON
    const toolCallData = {
      status,
      message: message || null,
      timestamp: new Date().toISOString(),
    }

    await redis.set(key, JSON.stringify(toolCallData), 'EX', 86400) // Keep 24 hour expiry

    return true
  } catch (error) {
    logger.error('Failed to update tool call status in Redis', {
      toolCallId,
      status,
      message,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    return false
  }
}

/**
 * POST /api/copilot/confirm
 * Update tool call status (Accept/Reject)
 */
export async function POST(req: NextRequest) {
  const tracker = createRequestTracker()

  try {
    // Authenticate user using consolidated helper
    const { userId: authenticatedUserId, isAuthenticated } =
      await authenticateCopilotRequestSessionOnly()

    if (!isAuthenticated) {
      return createUnauthorizedResponse()
    }

    const body = await req.json()
    const { toolCallId, status, message } = ConfirmationSchema.parse(body)

    // Update the tool call status in Redis
    const updated = await updateToolCallStatus(toolCallId, status, message)

    if (!updated) {
      logger.error(`[${tracker.requestId}] Failed to update tool call status`, {
        userId: authenticatedUserId,
        toolCallId,
        status,
        internalStatus: status,
        message,
      })
      return createBadRequestResponse('Failed to update tool call status or tool call not found')
    }

    const duration = tracker.getDuration()

    return NextResponse.json({
      success: true,
      message: message || `Tool call ${toolCallId} has been ${status.toLowerCase()}`,
      toolCallId,
      status,
    })
  } catch (error) {
    const duration = tracker.getDuration()

    if (error instanceof z.ZodError) {
      logger.error(`[${tracker.requestId}] Request validation error:`, {
        duration,
        errors: error.errors,
      })
      return createBadRequestResponse(
        `Invalid request data: ${error.errors.map((e) => e.message).join(', ')}`
      )
    }

    logger.error(`[${tracker.requestId}] Unexpected error:`, {
      duration,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    })

    return createInternalServerErrorResponse(
      error instanceof Error ? error.message : 'Internal server error'
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/copilot/context-usage/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { getCopilotModel } from '@/lib/copilot/config'
import { SIM_AGENT_API_URL_DEFAULT } from '@/lib/copilot/constants'
import type { CopilotProviderConfig } from '@/lib/copilot/types'
import { env } from '@/lib/core/config/env'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('ContextUsageAPI')

const SIM_AGENT_API_URL = env.SIM_AGENT_API_URL || SIM_AGENT_API_URL_DEFAULT

const ContextUsageRequestSchema = z.object({
  chatId: z.string(),
  model: z.string(),
  workflowId: z.string(),
  provider: z.any().optional(),
})

/**
 * POST /api/copilot/context-usage
 * Fetch context usage from sim-agent API
 */
export async function POST(req: NextRequest) {
  try {
    logger.info('[Context Usage API] Request received')

    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn('[Context Usage API] No session/user ID')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    logger.info('[Context Usage API] Request body', body)

    const parsed = ContextUsageRequestSchema.safeParse(body)

    if (!parsed.success) {
      logger.warn('[Context Usage API] Invalid request body', parsed.error.errors)
      return NextResponse.json(
        { error: 'Invalid request body', details: parsed.error.errors },
        { status: 400 }
      )
    }

    const { chatId, model, workflowId, provider } = parsed.data
    const userId = session.user.id // Get userId from session, not from request

    logger.info('[Context Usage API] Request validated', { chatId, model, userId, workflowId })

    // Build provider config similar to chat route
    let providerConfig: CopilotProviderConfig | undefined = provider
    if (!providerConfig) {
      const defaults = getCopilotModel('chat')
      const modelToUse = env.COPILOT_MODEL || defaults.model
      const providerEnv = env.COPILOT_PROVIDER as any

      if (providerEnv) {
        if (providerEnv === 'azure-openai') {
          providerConfig = {
            provider: 'azure-openai',
            model: modelToUse,
            apiKey: env.AZURE_OPENAI_API_KEY,
            apiVersion: env.AZURE_OPENAI_API_VERSION,
            endpoint: env.AZURE_OPENAI_ENDPOINT,
          }
        } else if (providerEnv === 'vertex') {
          providerConfig = {
            provider: 'vertex',
            model: modelToUse,
            apiKey: env.COPILOT_API_KEY,
            vertexProject: env.VERTEX_PROJECT,
            vertexLocation: env.VERTEX_LOCATION,
          }
        } else {
          providerConfig = {
            provider: providerEnv,
            model: modelToUse,
            apiKey: env.COPILOT_API_KEY,
          }
        }
      }
    }

    // Call sim-agent API
    const requestPayload = {
      chatId,
      model,
      userId,
      workflowId,
      ...(providerConfig ? { provider: providerConfig } : {}),
    }

    logger.info('[Context Usage API] Calling sim-agent', {
      url: `${SIM_AGENT_API_URL}/api/get-context-usage`,
      payload: requestPayload,
    })

    const simAgentResponse = await fetch(`${SIM_AGENT_API_URL}/api/get-context-usage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(env.COPILOT_API_KEY ? { 'x-api-key': env.COPILOT_API_KEY } : {}),
      },
      body: JSON.stringify(requestPayload),
    })

    logger.info('[Context Usage API] Sim-agent response', {
      status: simAgentResponse.status,
      ok: simAgentResponse.ok,
    })

    if (!simAgentResponse.ok) {
      const errorText = await simAgentResponse.text().catch(() => '')
      logger.warn('[Context Usage API] Sim agent request failed', {
        status: simAgentResponse.status,
        error: errorText,
      })
      return NextResponse.json(
        { error: 'Failed to fetch context usage from sim-agent' },
        { status: simAgentResponse.status }
      )
    }

    const data = await simAgentResponse.json()
    logger.info('[Context Usage API] Sim-agent data received', data)
    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error fetching context usage:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/copilot/execute-copilot-server-tool/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import {
  authenticateCopilotRequestSessionOnly,
  createBadRequestResponse,
  createInternalServerErrorResponse,
  createRequestTracker,
  createUnauthorizedResponse,
} from '@/lib/copilot/request-helpers'
import { routeExecution } from '@/lib/copilot/tools/server/router'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('ExecuteCopilotServerToolAPI')

const ExecuteSchema = z.object({
  toolName: z.string(),
  payload: z.unknown().optional(),
})

export async function POST(req: NextRequest) {
  const tracker = createRequestTracker()
  try {
    const { userId, isAuthenticated } = await authenticateCopilotRequestSessionOnly()
    if (!isAuthenticated || !userId) {
      return createUnauthorizedResponse()
    }

    const body = await req.json()
    try {
      const preview = JSON.stringify(body).slice(0, 300)
      logger.debug(`[${tracker.requestId}] Incoming request body preview`, { preview })
    } catch {}

    const { toolName, payload } = ExecuteSchema.parse(body)

    logger.info(`[${tracker.requestId}] Executing server tool`, { toolName })
    const result = await routeExecution(toolName, payload, { userId })

    try {
      const resultPreview = JSON.stringify(result).slice(0, 300)
      logger.debug(`[${tracker.requestId}] Server tool result preview`, { toolName, resultPreview })
    } catch {}

    return NextResponse.json({ success: true, result })
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.debug(`[${tracker.requestId}] Zod validation error`, { issues: error.issues })
      return createBadRequestResponse('Invalid request body for execute-copilot-server-tool')
    }
    logger.error(`[${tracker.requestId}] Failed to execute server tool:`, error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to execute server tool'
    return createInternalServerErrorResponse(errorMessage)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/copilot/execute-tool/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import { account, workflow } from '@sim/db/schema'
import { and, eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import {
  createBadRequestResponse,
  createInternalServerErrorResponse,
  createRequestTracker,
  createUnauthorizedResponse,
} from '@/lib/copilot/request-helpers'
import { generateRequestId } from '@/lib/core/utils/request'
import { getEffectiveDecryptedEnv } from '@/lib/environment/utils'
import { createLogger } from '@/lib/logs/console/logger'
import { refreshTokenIfNeeded } from '@/app/api/auth/oauth/utils'
import { executeTool } from '@/tools'
import { getTool } from '@/tools/utils'

const logger = createLogger('CopilotExecuteToolAPI')

const ExecuteToolSchema = z.object({
  toolCallId: z.string(),
  toolName: z.string(),
  arguments: z.record(z.any()).optional().default({}),
  workflowId: z.string().optional(),
})

/**
 * Resolves all {{ENV_VAR}} references in a value recursively
 * Works with strings, arrays, and objects
 */
function resolveEnvVarReferences(value: any, envVars: Record<string, string>): any {
  if (typeof value === 'string') {
    // Check for exact match: entire string is "{{VAR_NAME}}"
    const exactMatch = /^\{\{([^}]+)\}\}$/.exec(value)
    if (exactMatch) {
      const envVarName = exactMatch[1].trim()
      return envVars[envVarName] ?? value
    }

    // Check for embedded references: "prefix {{VAR}} suffix"
    return value.replace(/\{\{([^}]+)\}\}/g, (match, varName) => {
      const trimmedName = varName.trim()
      return envVars[trimmedName] ?? match
    })
  }

  if (Array.isArray(value)) {
    return value.map((item) => resolveEnvVarReferences(item, envVars))
  }

  if (value !== null && typeof value === 'object') {
    const resolved: Record<string, any> = {}
    for (const [key, val] of Object.entries(value)) {
      resolved[key] = resolveEnvVarReferences(val, envVars)
    }
    return resolved
  }

  return value
}

export async function POST(req: NextRequest) {
  const tracker = createRequestTracker()

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return createUnauthorizedResponse()
    }

    const userId = session.user.id
    const body = await req.json()

    try {
      const preview = JSON.stringify(body).slice(0, 300)
      logger.debug(`[${tracker.requestId}] Incoming execute-tool request`, { preview })
    } catch {}

    const { toolCallId, toolName, arguments: toolArgs, workflowId } = ExecuteToolSchema.parse(body)

    logger.info(`[${tracker.requestId}] Executing tool`, {
      toolCallId,
      toolName,
      workflowId,
      hasArgs: Object.keys(toolArgs).length > 0,
    })

    // Get tool config from registry
    const toolConfig = getTool(toolName)
    if (!toolConfig) {
      // Find similar tool names to help debug
      const { tools: allTools } = await import('@/tools/registry')
      const allToolNames = Object.keys(allTools)
      const prefix = toolName.split('_').slice(0, 2).join('_')
      const similarTools = allToolNames
        .filter((name) => name.startsWith(`${prefix.split('_')[0]}_`))
        .slice(0, 10)

      logger.warn(`[${tracker.requestId}] Tool not found in registry`, {
        toolName,
        prefix,
        similarTools,
        totalToolsInRegistry: allToolNames.length,
      })
      return NextResponse.json(
        {
          success: false,
          error: `Tool not found: ${toolName}. Similar tools: ${similarTools.join(', ')}`,
          toolCallId,
        },
        { status: 404 }
      )
    }

    // Get the workspaceId from the workflow (env vars are stored at workspace level)
    let workspaceId: string | undefined
    if (workflowId) {
      const workflowResult = await db
        .select({ workspaceId: workflow.workspaceId })
        .from(workflow)
        .where(eq(workflow.id, workflowId))
        .limit(1)
      workspaceId = workflowResult[0]?.workspaceId ?? undefined
    }

    // Get decrypted environment variables early so we can resolve all {{VAR}} references
    const decryptedEnvVars = await getEffectiveDecryptedEnv(userId, workspaceId)

    logger.info(`[${tracker.requestId}] Fetched environment variables`, {
      workflowId,
      workspaceId,
      envVarCount: Object.keys(decryptedEnvVars).length,
      envVarKeys: Object.keys(decryptedEnvVars),
    })

    // Build execution params starting with LLM-provided arguments
    // Resolve all {{ENV_VAR}} references in the arguments
    const executionParams: Record<string, any> = resolveEnvVarReferences(toolArgs, decryptedEnvVars)

    logger.info(`[${tracker.requestId}] Resolved env var references in arguments`, {
      toolName,
      originalArgKeys: Object.keys(toolArgs),
      resolvedArgKeys: Object.keys(executionParams),
    })

    // Resolve OAuth access token if required
    if (toolConfig.oauth?.required && toolConfig.oauth.provider) {
      const provider = toolConfig.oauth.provider
      logger.info(`[${tracker.requestId}] Resolving OAuth token`, { provider })

      try {
        // Find the account for this provider and user
        const accounts = await db
          .select()
          .from(account)
          .where(and(eq(account.providerId, provider), eq(account.userId, userId)))
          .limit(1)

        if (accounts.length > 0) {
          const acc = accounts[0]
          const requestId = generateRequestId()
          const { accessToken } = await refreshTokenIfNeeded(requestId, acc as any, acc.id)

          if (accessToken) {
            executionParams.accessToken = accessToken
            logger.info(`[${tracker.requestId}] OAuth token resolved`, { provider })
          } else {
            logger.warn(`[${tracker.requestId}] No access token available`, { provider })
            return NextResponse.json(
              {
                success: false,
                error: `OAuth token not available for ${provider}. Please reconnect your account.`,
                toolCallId,
              },
              { status: 400 }
            )
          }
        } else {
          logger.warn(`[${tracker.requestId}] No account found for provider`, { provider })
          return NextResponse.json(
            {
              success: false,
              error: `No ${provider} account connected. Please connect your account first.`,
              toolCallId,
            },
            { status: 400 }
          )
        }
      } catch (error) {
        logger.error(`[${tracker.requestId}] Failed to resolve OAuth token`, {
          provider,
          error: error instanceof Error ? error.message : String(error),
        })
        return NextResponse.json(
          {
            success: false,
            error: `Failed to get OAuth token for ${provider}`,
            toolCallId,
          },
          { status: 500 }
        )
      }
    }

    // Check if tool requires an API key that wasn't resolved via {{ENV_VAR}} reference
    const needsApiKey = toolConfig.params?.apiKey?.required

    if (needsApiKey && !executionParams.apiKey) {
      logger.warn(`[${tracker.requestId}] No API key found for tool`, { toolName })
      return NextResponse.json(
        {
          success: false,
          error: `API key not provided for ${toolName}. Use {{YOUR_API_KEY_ENV_VAR}} to reference your environment variable.`,
          toolCallId,
        },
        { status: 400 }
      )
    }

    // Add execution context
    executionParams._context = {
      workflowId,
      userId,
    }

    // Special handling for function_execute - inject environment variables
    if (toolName === 'function_execute') {
      executionParams.envVars = decryptedEnvVars
      executionParams.workflowVariables = {} // No workflow variables in copilot context
      executionParams.blockData = {} // No block data in copilot context
      executionParams.blockNameMapping = {} // No block mapping in copilot context
      executionParams.language = executionParams.language || 'javascript'
      executionParams.timeout = executionParams.timeout || 30000

      logger.info(`[${tracker.requestId}] Injected env vars for function_execute`, {
        envVarCount: Object.keys(decryptedEnvVars).length,
      })
    }

    // Execute the tool
    logger.info(`[${tracker.requestId}] Executing tool with resolved credentials`, {
      toolName,
      hasAccessToken: !!executionParams.accessToken,
      hasApiKey: !!executionParams.apiKey,
    })

    const result = await executeTool(toolName, executionParams, true)

    logger.info(`[${tracker.requestId}] Tool execution complete`, {
      toolName,
      success: result.success,
      hasOutput: !!result.output,
    })

    return NextResponse.json({
      success: true,
      toolCallId,
      result: {
        success: result.success,
        output: result.output,
        error: result.error,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.debug(`[${tracker.requestId}] Zod validation error`, { issues: error.issues })
      return createBadRequestResponse('Invalid request body for execute-tool')
    }
    logger.error(`[${tracker.requestId}] Failed to execute tool:`, error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to execute tool'
    return createInternalServerErrorResponse(errorMessage)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/copilot/feedback/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import { copilotFeedback } from '@sim/db/schema'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import {
  authenticateCopilotRequestSessionOnly,
  createBadRequestResponse,
  createInternalServerErrorResponse,
  createRequestTracker,
  createUnauthorizedResponse,
} from '@/lib/copilot/request-helpers'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('CopilotFeedbackAPI')

// Schema for feedback submission
const FeedbackSchema = z.object({
  chatId: z.string().uuid('Chat ID must be a valid UUID'),
  userQuery: z.string().min(1, 'User query is required'),
  agentResponse: z.string().min(1, 'Agent response is required'),
  isPositiveFeedback: z.boolean(),
  feedback: z.string().optional(),
  workflowYaml: z.string().optional(), // Optional workflow YAML when edit/build workflow tools were used
})

/**
 * POST /api/copilot/feedback
 * Submit feedback for a copilot interaction
 */
export async function POST(req: NextRequest) {
  const tracker = createRequestTracker()

  try {
    // Authenticate user using the same pattern as other copilot routes
    const { userId: authenticatedUserId, isAuthenticated } =
      await authenticateCopilotRequestSessionOnly()

    if (!isAuthenticated || !authenticatedUserId) {
      return createUnauthorizedResponse()
    }

    const body = await req.json()
    const { chatId, userQuery, agentResponse, isPositiveFeedback, feedback, workflowYaml } =
      FeedbackSchema.parse(body)

    logger.info(`[${tracker.requestId}] Processing copilot feedback submission`, {
      userId: authenticatedUserId,
      chatId,
      isPositiveFeedback,
      userQueryLength: userQuery.length,
      agentResponseLength: agentResponse.length,
      hasFeedback: !!feedback,
      hasWorkflowYaml: !!workflowYaml,
      workflowYamlLength: workflowYaml?.length || 0,
    })

    // Insert feedback into the database
    const [feedbackRecord] = await db
      .insert(copilotFeedback)
      .values({
        userId: authenticatedUserId,
        chatId,
        userQuery,
        agentResponse,
        isPositive: isPositiveFeedback,
        feedback: feedback || null,
        workflowYaml: workflowYaml || null,
      })
      .returning()

    logger.info(`[${tracker.requestId}] Successfully saved copilot feedback`, {
      feedbackId: feedbackRecord.feedbackId,
      userId: authenticatedUserId,
      isPositive: isPositiveFeedback,
      duration: tracker.getDuration(),
    })

    return NextResponse.json({
      success: true,
      feedbackId: feedbackRecord.feedbackId,
      message: 'Feedback submitted successfully',
      metadata: {
        requestId: tracker.requestId,
        duration: tracker.getDuration(),
      },
    })
  } catch (error) {
    const duration = tracker.getDuration()

    if (error instanceof z.ZodError) {
      logger.error(`[${tracker.requestId}] Validation error:`, {
        duration,
        errors: error.errors,
      })
      return createBadRequestResponse(
        `Invalid request data: ${error.errors.map((e) => e.message).join(', ')}`
      )
    }

    logger.error(`[${tracker.requestId}] Error submitting copilot feedback:`, {
      duration,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    })

    return createInternalServerErrorResponse('Failed to submit feedback')
  }
}

/**
 * GET /api/copilot/feedback
 * Get all feedback records (for analytics)
 */
export async function GET(req: NextRequest) {
  const tracker = createRequestTracker()

  try {
    // Authenticate user
    const { userId: authenticatedUserId, isAuthenticated } =
      await authenticateCopilotRequestSessionOnly()

    if (!isAuthenticated || !authenticatedUserId) {
      return createUnauthorizedResponse()
    }

    // Get all feedback records
    const feedbackRecords = await db
      .select({
        feedbackId: copilotFeedback.feedbackId,
        userId: copilotFeedback.userId,
        chatId: copilotFeedback.chatId,
        userQuery: copilotFeedback.userQuery,
        agentResponse: copilotFeedback.agentResponse,
        isPositive: copilotFeedback.isPositive,
        feedback: copilotFeedback.feedback,
        workflowYaml: copilotFeedback.workflowYaml,
        createdAt: copilotFeedback.createdAt,
      })
      .from(copilotFeedback)

    logger.info(`[${tracker.requestId}] Retrieved ${feedbackRecords.length} feedback records`)

    return NextResponse.json({
      success: true,
      feedback: feedbackRecords,
      metadata: {
        requestId: tracker.requestId,
        duration: tracker.getDuration(),
      },
    })
  } catch (error) {
    logger.error(`[${tracker.requestId}] Error retrieving copilot feedback:`, error)
    return createInternalServerErrorResponse('Failed to retrieve feedback')
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.test.ts]---
Location: sim-main/apps/sim/app/api/copilot/methods/route.test.ts

```typescript
import { describe, expect, it } from 'vitest'

describe('copilot methods route placeholder', () => {
  it('loads test suite', () => {
    expect(true).toBe(true)
  })
})
```

--------------------------------------------------------------------------------

````
