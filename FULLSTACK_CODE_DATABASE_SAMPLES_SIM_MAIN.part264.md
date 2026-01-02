---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 264
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 264 of 933)

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
Location: sim-main/apps/sim/app/api/chat/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import { chat } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { isDev } from '@/lib/core/config/feature-flags'
import { encryptSecret } from '@/lib/core/security/encryption'
import { getBaseUrl } from '@/lib/core/utils/urls'
import { createLogger } from '@/lib/logs/console/logger'
import { deployWorkflow } from '@/lib/workflows/persistence/utils'
import { checkWorkflowAccessForChatCreation } from '@/app/api/chat/utils'
import { createErrorResponse, createSuccessResponse } from '@/app/api/workflows/utils'

const logger = createLogger('ChatAPI')

const chatSchema = z.object({
  workflowId: z.string().min(1, 'Workflow ID is required'),
  identifier: z
    .string()
    .min(1, 'Identifier is required')
    .regex(/^[a-z0-9-]+$/, 'Identifier can only contain lowercase letters, numbers, and hyphens'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  customizations: z.object({
    primaryColor: z.string(),
    welcomeMessage: z.string(),
    imageUrl: z.string().optional(),
  }),
  authType: z.enum(['public', 'password', 'email', 'sso']).default('public'),
  password: z.string().optional(),
  allowedEmails: z.array(z.string()).optional().default([]),
  outputConfigs: z
    .array(
      z.object({
        blockId: z.string(),
        path: z.string(),
      })
    )
    .optional()
    .default([]),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return createErrorResponse('Unauthorized', 401)
    }

    // Get the user's chat deployments
    const deployments = await db.select().from(chat).where(eq(chat.userId, session.user.id))

    return createSuccessResponse({ deployments })
  } catch (error: any) {
    logger.error('Error fetching chat deployments:', error)
    return createErrorResponse(error.message || 'Failed to fetch chat deployments', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return createErrorResponse('Unauthorized', 401)
    }

    const body = await request.json()

    try {
      const validatedData = chatSchema.parse(body)

      // Extract validated data
      const {
        workflowId,
        identifier,
        title,
        description = '',
        customizations,
        authType = 'public',
        password,
        allowedEmails = [],
        outputConfigs = [],
      } = validatedData

      // Perform additional validation specific to auth types
      if (authType === 'password' && !password) {
        return createErrorResponse('Password is required when using password protection', 400)
      }

      if (authType === 'email' && (!Array.isArray(allowedEmails) || allowedEmails.length === 0)) {
        return createErrorResponse(
          'At least one email or domain is required when using email access control',
          400
        )
      }

      if (authType === 'sso' && (!Array.isArray(allowedEmails) || allowedEmails.length === 0)) {
        return createErrorResponse(
          'At least one email or domain is required when using SSO access control',
          400
        )
      }

      // Check if identifier is available
      const existingIdentifier = await db
        .select()
        .from(chat)
        .where(eq(chat.identifier, identifier))
        .limit(1)

      if (existingIdentifier.length > 0) {
        return createErrorResponse('Identifier already in use', 400)
      }

      // Check if user has permission to create chat for this workflow
      const { hasAccess, workflow: workflowRecord } = await checkWorkflowAccessForChatCreation(
        workflowId,
        session.user.id
      )

      if (!hasAccess || !workflowRecord) {
        return createErrorResponse('Workflow not found or access denied', 404)
      }

      // Always deploy/redeploy the workflow to ensure latest version
      const result = await deployWorkflow({
        workflowId,
        deployedBy: session.user.id,
      })

      if (!result.success) {
        return createErrorResponse(result.error || 'Failed to deploy workflow', 500)
      }

      logger.info(
        `${workflowRecord.isDeployed ? 'Redeployed' : 'Auto-deployed'} workflow ${workflowId} for chat (v${result.version})`
      )

      // Encrypt password if provided
      let encryptedPassword = null
      if (authType === 'password' && password) {
        const { encrypted } = await encryptSecret(password)
        encryptedPassword = encrypted
      }

      // Create the chat deployment
      const id = uuidv4()

      // Log the values we're inserting
      logger.info('Creating chat deployment with values:', {
        workflowId,
        identifier,
        title,
        authType,
        hasPassword: !!encryptedPassword,
        emailCount: allowedEmails?.length || 0,
        outputConfigsCount: outputConfigs.length,
      })

      // Merge customizations with the additional fields
      const mergedCustomizations = {
        ...(customizations || {}),
        primaryColor: customizations?.primaryColor || 'var(--brand-primary-hover-hex)',
        welcomeMessage: customizations?.welcomeMessage || 'Hi there! How can I help you today?',
      }

      await db.insert(chat).values({
        id,
        workflowId,
        userId: session.user.id,
        identifier,
        title,
        description: description || '',
        customizations: mergedCustomizations,
        isActive: true,
        authType,
        password: encryptedPassword,
        allowedEmails: authType === 'email' || authType === 'sso' ? allowedEmails : [],
        outputConfigs,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Return successful response with chat URL
      // Generate chat URL using path-based routing instead of subdomains
      const baseUrl = getBaseUrl()

      let chatUrl: string
      try {
        const url = new URL(baseUrl)
        let host = url.host
        if (host.startsWith('www.')) {
          host = host.substring(4)
        }
        chatUrl = `${url.protocol}//${host}/chat/${identifier}`
      } catch (error) {
        logger.warn('Failed to parse baseUrl, falling back to defaults:', {
          baseUrl,
          error: error instanceof Error ? error.message : 'Unknown error',
        })
        // Fallback based on environment
        if (isDev) {
          chatUrl = `http://localhost:3000/chat/${identifier}`
        } else {
          chatUrl = `https://sim.ai/chat/${identifier}`
        }
      }

      logger.info(`Chat "${title}" deployed successfully at ${chatUrl}`)

      return createSuccessResponse({
        id,
        chatUrl,
        message: 'Chat deployment created successfully',
      })
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        const errorMessage = validationError.errors[0]?.message || 'Invalid request data'
        return createErrorResponse(errorMessage, 400, 'VALIDATION_ERROR')
      }
      throw validationError
    }
  } catch (error: any) {
    logger.error('Error creating chat deployment:', error)
    return createErrorResponse(error.message || 'Failed to create chat deployment', 500)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: utils.test.ts]---
Location: sim-main/apps/sim/app/api/chat/utils.test.ts
Signals: Next.js

```typescript
import type { NextResponse } from 'next/server'
/**
 * Tests for chat API utils
 *
 * @vitest-environment node
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { env } from '@/lib/core/config/env'

vi.mock('@sim/db', () => ({
  db: {
    select: vi.fn(),
    update: vi.fn(),
  },
}))

vi.mock('@/lib/logs/execution/logging-session', () => ({
  LoggingSession: vi.fn().mockImplementation(() => ({
    safeStart: vi.fn().mockResolvedValue(undefined),
    safeComplete: vi.fn().mockResolvedValue(undefined),
    safeCompleteWithError: vi.fn().mockResolvedValue(undefined),
  })),
}))

vi.mock('@/executor', () => ({
  Executor: vi.fn(),
}))

vi.mock('@/serializer', () => ({
  Serializer: vi.fn(),
}))

vi.mock('@/stores/workflows/server-utils', () => ({
  mergeSubblockState: vi.fn().mockReturnValue({}),
}))

const mockDecryptSecret = vi.fn()

vi.mock('@/lib/core/security/encryption', () => ({
  decryptSecret: mockDecryptSecret,
}))

vi.mock('@/lib/core/utils/request', () => ({
  generateRequestId: vi.fn(),
}))

vi.mock('@/lib/core/config/feature-flags', () => ({
  isDev: true,
  isHosted: false,
  isProd: false,
}))

describe('Chat API Utils', () => {
  beforeEach(() => {
    vi.doMock('@/lib/logs/console/logger', () => ({
      createLogger: vi.fn().mockReturnValue({
        info: vi.fn(),
        error: vi.fn(),
        warn: vi.fn(),
        debug: vi.fn(),
      }),
    }))

    vi.stubGlobal('process', {
      ...process,
      env: {
        ...env,
        NODE_ENV: 'development',
      },
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Auth token utils', () => {
    it('should validate auth tokens', async () => {
      const { validateAuthToken } = await import('@/app/api/chat/utils')

      const chatId = 'test-chat-id'
      const type = 'password'

      const token = Buffer.from(`${chatId}:${type}:${Date.now()}`).toString('base64')
      expect(typeof token).toBe('string')
      expect(token.length).toBeGreaterThan(0)

      const isValid = validateAuthToken(token, chatId)
      expect(isValid).toBe(true)

      const isInvalidChat = validateAuthToken(token, 'wrong-chat-id')
      expect(isInvalidChat).toBe(false)
    })

    it('should reject expired tokens', async () => {
      const { validateAuthToken } = await import('@/app/api/chat/utils')

      const chatId = 'test-chat-id'
      const expiredToken = Buffer.from(
        `${chatId}:password:${Date.now() - 25 * 60 * 60 * 1000}`
      ).toString('base64')

      const isValid = validateAuthToken(expiredToken, chatId)
      expect(isValid).toBe(false)
    })
  })

  describe('Cookie handling', () => {
    it('should set auth cookie correctly', async () => {
      const { setChatAuthCookie } = await import('@/app/api/chat/utils')

      const mockSet = vi.fn()
      const mockResponse = {
        cookies: {
          set: mockSet,
        },
      } as unknown as NextResponse

      const chatId = 'test-chat-id'
      const type = 'password'

      setChatAuthCookie(mockResponse, chatId, type)

      expect(mockSet).toHaveBeenCalledWith({
        name: `chat_auth_${chatId}`,
        value: expect.any(String),
        httpOnly: true,
        secure: false, // Development mode
        sameSite: 'lax',
        path: '/',
        domain: undefined, // Development mode
        maxAge: 60 * 60 * 24,
      })
    })
  })

  describe('CORS handling', () => {
    it('should add CORS headers for localhost in development', async () => {
      const { addCorsHeaders } = await import('@/app/api/chat/utils')

      const mockRequest = {
        headers: {
          get: vi.fn().mockReturnValue('http://localhost:3000'),
        },
      } as any

      const mockResponse = {
        headers: {
          set: vi.fn(),
        },
      } as unknown as NextResponse

      addCorsHeaders(mockResponse, mockRequest)

      expect(mockResponse.headers.set).toHaveBeenCalledWith(
        'Access-Control-Allow-Origin',
        'http://localhost:3000'
      )
      expect(mockResponse.headers.set).toHaveBeenCalledWith(
        'Access-Control-Allow-Credentials',
        'true'
      )
      expect(mockResponse.headers.set).toHaveBeenCalledWith(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS'
      )
      expect(mockResponse.headers.set).toHaveBeenCalledWith(
        'Access-Control-Allow-Headers',
        'Content-Type, X-Requested-With'
      )
    })
  })

  describe('Chat auth validation', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      mockDecryptSecret.mockResolvedValue({ decrypted: 'correct-password' })

      vi.doMock('@/app/api/chat/utils', async (importOriginal) => {
        const original = (await importOriginal()) as any
        return {
          ...original,
          validateAuthToken: vi.fn((token, id) => {
            if (token === 'valid-token' && id === 'chat-id') {
              return true
            }
            return false
          }),
        }
      })
    })

    it('should allow access to public chats', async () => {
      const utils = await import('@/app/api/chat/utils')
      const { validateChatAuth } = utils

      const deployment = {
        id: 'chat-id',
        authType: 'public',
      }

      const mockRequest = {
        cookies: {
          get: vi.fn().mockReturnValue(null),
        },
      } as any

      const result = await validateChatAuth('request-id', deployment, mockRequest)

      expect(result.authorized).toBe(true)
    })

    it('should request password auth for GET requests', async () => {
      const { validateChatAuth } = await import('@/app/api/chat/utils')

      const deployment = {
        id: 'chat-id',
        authType: 'password',
      }

      const mockRequest = {
        method: 'GET',
        cookies: {
          get: vi.fn().mockReturnValue(null),
        },
      } as any

      const result = await validateChatAuth('request-id', deployment, mockRequest)

      expect(result.authorized).toBe(false)
      expect(result.error).toBe('auth_required_password')
    })

    it('should validate password for POST requests', async () => {
      const { validateChatAuth } = await import('@/app/api/chat/utils')
      const { decryptSecret } = await import('@/lib/core/security/encryption')

      const deployment = {
        id: 'chat-id',
        authType: 'password',
        password: 'encrypted-password',
      }

      const mockRequest = {
        method: 'POST',
        cookies: {
          get: vi.fn().mockReturnValue(null),
        },
      } as any

      const parsedBody = {
        password: 'correct-password',
      }

      const result = await validateChatAuth('request-id', deployment, mockRequest, parsedBody)

      expect(decryptSecret).toHaveBeenCalledWith('encrypted-password')
      expect(result.authorized).toBe(true)
    })

    it('should reject incorrect password', async () => {
      const { validateChatAuth } = await import('@/app/api/chat/utils')

      const deployment = {
        id: 'chat-id',
        authType: 'password',
        password: 'encrypted-password',
      }

      const mockRequest = {
        method: 'POST',
        cookies: {
          get: vi.fn().mockReturnValue(null),
        },
      } as any

      const parsedBody = {
        password: 'wrong-password',
      }

      const result = await validateChatAuth('request-id', deployment, mockRequest, parsedBody)

      expect(result.authorized).toBe(false)
      expect(result.error).toBe('Invalid password')
    })

    it('should request email auth for email-protected chats', async () => {
      const { validateChatAuth } = await import('@/app/api/chat/utils')

      const deployment = {
        id: 'chat-id',
        authType: 'email',
        allowedEmails: ['user@example.com', '@company.com'],
      }

      const mockRequest = {
        method: 'GET',
        cookies: {
          get: vi.fn().mockReturnValue(null),
        },
      } as any

      const result = await validateChatAuth('request-id', deployment, mockRequest)

      expect(result.authorized).toBe(false)
      expect(result.error).toBe('auth_required_email')
    })

    it('should check allowed emails for email auth', async () => {
      const { validateChatAuth } = await import('@/app/api/chat/utils')

      const deployment = {
        id: 'chat-id',
        authType: 'email',
        allowedEmails: ['user@example.com', '@company.com'],
      }

      const mockRequest = {
        method: 'POST',
        cookies: {
          get: vi.fn().mockReturnValue(null),
        },
      } as any

      const result1 = await validateChatAuth('request-id', deployment, mockRequest, {
        email: 'user@example.com',
      })
      expect(result1.authorized).toBe(false)
      expect(result1.error).toBe('otp_required')

      const result2 = await validateChatAuth('request-id', deployment, mockRequest, {
        email: 'other@company.com',
      })
      expect(result2.authorized).toBe(false)
      expect(result2.error).toBe('otp_required')

      const result3 = await validateChatAuth('request-id', deployment, mockRequest, {
        email: 'user@unknown.com',
      })
      expect(result3.authorized).toBe(false)
      expect(result3.error).toBe('Email not authorized')
    })
  })

  describe('Execution Result Processing', () => {
    it('should process logs regardless of overall success status', () => {
      const executionResult = {
        success: false,
        output: {},
        logs: [
          {
            blockId: 'agent1',
            startedAt: '2023-01-01T00:00:00Z',
            endedAt: '2023-01-01T00:00:01Z',
            durationMs: 1000,
            success: true,
            output: { content: 'Agent 1 succeeded' },
            error: undefined,
          },
          {
            blockId: 'agent2',
            startedAt: '2023-01-01T00:00:00Z',
            endedAt: '2023-01-01T00:00:01Z',
            durationMs: 500,
            success: false,
            output: null,
            error: 'Agent 2 failed',
          },
        ],
        metadata: { duration: 1000 },
      }

      expect(executionResult.success).toBe(false)
      expect(executionResult.logs).toBeDefined()
      expect(executionResult.logs).toHaveLength(2)

      expect(executionResult.logs[0].success).toBe(true)
      expect(executionResult.logs[0].output?.content).toBe('Agent 1 succeeded')

      expect(executionResult.logs[1].success).toBe(false)
      expect(executionResult.logs[1].error).toBe('Agent 2 failed')
    })

    it('should handle ExecutionResult vs StreamingExecution types correctly', () => {
      const executionResult = {
        success: true,
        output: { content: 'test' },
        logs: [],
        metadata: { duration: 100 },
      }

      const directResult = executionResult
      const extractedDirect = directResult
      expect(extractedDirect).toBe(executionResult)

      const streamingResult = {
        stream: new ReadableStream(),
        execution: executionResult,
      }

      const extractedFromStreaming =
        streamingResult && typeof streamingResult === 'object' && 'execution' in streamingResult
          ? streamingResult.execution
          : streamingResult

      expect(extractedFromStreaming).toBe(executionResult)
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/app/api/chat/utils.ts
Signals: Next.js

```typescript
import { createHash } from 'crypto'
import { db } from '@sim/db'
import { chat, workflow } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import type { NextRequest, NextResponse } from 'next/server'
import { isDev } from '@/lib/core/config/feature-flags'
import { decryptSecret } from '@/lib/core/security/encryption'
import { createLogger } from '@/lib/logs/console/logger'
import { hasAdminPermission } from '@/lib/workspaces/permissions/utils'

const logger = createLogger('ChatAuthUtils')

function hashPassword(encryptedPassword: string): string {
  return createHash('sha256').update(encryptedPassword).digest('hex').substring(0, 8)
}

/**
 * Check if user has permission to create a chat for a specific workflow
 * Either the user owns the workflow directly OR has admin permission for the workflow's workspace
 */
export async function checkWorkflowAccessForChatCreation(
  workflowId: string,
  userId: string
): Promise<{ hasAccess: boolean; workflow?: any }> {
  const workflowData = await db.select().from(workflow).where(eq(workflow.id, workflowId)).limit(1)

  if (workflowData.length === 0) {
    return { hasAccess: false }
  }

  const workflowRecord = workflowData[0]

  if (workflowRecord.userId === userId) {
    return { hasAccess: true, workflow: workflowRecord }
  }

  if (workflowRecord.workspaceId) {
    const hasAdmin = await hasAdminPermission(userId, workflowRecord.workspaceId)
    if (hasAdmin) {
      return { hasAccess: true, workflow: workflowRecord }
    }
  }

  return { hasAccess: false }
}

/**
 * Check if user has access to view/edit/delete a specific chat
 * Either the user owns the chat directly OR has admin permission for the workflow's workspace
 */
export async function checkChatAccess(
  chatId: string,
  userId: string
): Promise<{ hasAccess: boolean; chat?: any }> {
  const chatData = await db
    .select({
      chat: chat,
      workflowWorkspaceId: workflow.workspaceId,
    })
    .from(chat)
    .innerJoin(workflow, eq(chat.workflowId, workflow.id))
    .where(eq(chat.id, chatId))
    .limit(1)

  if (chatData.length === 0) {
    return { hasAccess: false }
  }

  const { chat: chatRecord, workflowWorkspaceId } = chatData[0]

  if (chatRecord.userId === userId) {
    return { hasAccess: true, chat: chatRecord }
  }

  if (workflowWorkspaceId) {
    const hasAdmin = await hasAdminPermission(userId, workflowWorkspaceId)
    if (hasAdmin) {
      return { hasAccess: true, chat: chatRecord }
    }
  }

  return { hasAccess: false }
}

function encryptAuthToken(chatId: string, type: string, encryptedPassword?: string | null): string {
  const pwHash = encryptedPassword ? hashPassword(encryptedPassword) : ''
  return Buffer.from(`${chatId}:${type}:${Date.now()}:${pwHash}`).toString('base64')
}

export function validateAuthToken(
  token: string,
  chatId: string,
  encryptedPassword?: string | null
): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString()
    const parts = decoded.split(':')
    const [storedId, _type, timestamp, storedPwHash] = parts

    if (storedId !== chatId) {
      return false
    }

    const createdAt = Number.parseInt(timestamp)
    const now = Date.now()
    const expireTime = 24 * 60 * 60 * 1000

    if (now - createdAt > expireTime) {
      return false
    }

    if (encryptedPassword) {
      const currentPwHash = hashPassword(encryptedPassword)
      if (storedPwHash !== currentPwHash) {
        return false
      }
    }

    return true
  } catch (_e) {
    return false
  }
}

export function setChatAuthCookie(
  response: NextResponse,
  chatId: string,
  type: string,
  encryptedPassword?: string | null
): void {
  const token = encryptAuthToken(chatId, type, encryptedPassword)
  response.cookies.set({
    name: `chat_auth_${chatId}`,
    value: token,
    httpOnly: true,
    secure: !isDev,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24,
  })
}

export function addCorsHeaders(response: NextResponse, request: NextRequest) {
  const origin = request.headers.get('origin') || ''

  if (isDev && origin.includes('localhost')) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With')
  }

  return response
}

export async function validateChatAuth(
  requestId: string,
  deployment: any,
  request: NextRequest,
  parsedBody?: any
): Promise<{ authorized: boolean; error?: string }> {
  const authType = deployment.authType || 'public'

  if (authType === 'public') {
    return { authorized: true }
  }

  const cookieName = `chat_auth_${deployment.id}`
  const authCookie = request.cookies.get(cookieName)

  if (authCookie && validateAuthToken(authCookie.value, deployment.id, deployment.password)) {
    return { authorized: true }
  }

  if (authType === 'password') {
    if (request.method === 'GET') {
      return { authorized: false, error: 'auth_required_password' }
    }

    try {
      if (!parsedBody) {
        return { authorized: false, error: 'Password is required' }
      }

      const { password, input } = parsedBody

      if (input && !password) {
        return { authorized: false, error: 'auth_required_password' }
      }

      if (!password) {
        return { authorized: false, error: 'Password is required' }
      }

      if (!deployment.password) {
        logger.error(`[${requestId}] No password set for password-protected chat: ${deployment.id}`)
        return { authorized: false, error: 'Authentication configuration error' }
      }

      const { decrypted } = await decryptSecret(deployment.password)
      if (password !== decrypted) {
        return { authorized: false, error: 'Invalid password' }
      }

      return { authorized: true }
    } catch (error) {
      logger.error(`[${requestId}] Error validating password:`, error)
      return { authorized: false, error: 'Authentication error' }
    }
  }

  if (authType === 'email') {
    if (request.method === 'GET') {
      return { authorized: false, error: 'auth_required_email' }
    }

    try {
      if (!parsedBody) {
        return { authorized: false, error: 'Email is required' }
      }

      const { email, input } = parsedBody

      if (input && !email) {
        return { authorized: false, error: 'auth_required_email' }
      }

      if (!email) {
        return { authorized: false, error: 'Email is required' }
      }

      const allowedEmails = deployment.allowedEmails || []

      if (allowedEmails.includes(email)) {
        return { authorized: false, error: 'otp_required' }
      }

      const domain = email.split('@')[1]
      if (domain && allowedEmails.some((allowed: string) => allowed === `@${domain}`)) {
        return { authorized: false, error: 'otp_required' }
      }

      return { authorized: false, error: 'Email not authorized' }
    } catch (error) {
      logger.error(`[${requestId}] Error validating email:`, error)
      return { authorized: false, error: 'Authentication error' }
    }
  }

  if (authType === 'sso') {
    if (request.method === 'GET') {
      return { authorized: false, error: 'auth_required_sso' }
    }

    try {
      if (!parsedBody) {
        return { authorized: false, error: 'SSO authentication is required' }
      }

      const { email, input, checkSSOAccess } = parsedBody

      if (input && !checkSSOAccess) {
        return { authorized: false, error: 'auth_required_sso' }
      }

      if (checkSSOAccess) {
        if (!email) {
          return { authorized: false, error: 'Email is required' }
        }

        const allowedEmails = deployment.allowedEmails || []

        if (allowedEmails.includes(email)) {
          return { authorized: true }
        }

        const domain = email.split('@')[1]
        if (domain && allowedEmails.some((allowed: string) => allowed === `@${domain}`)) {
          return { authorized: true }
        }

        return { authorized: false, error: 'Email not authorized for SSO access' }
      }

      const { getSession } = await import('@/lib/auth')
      const session = await getSession()

      if (!session || !session.user) {
        return { authorized: false, error: 'auth_required_sso' }
      }

      const userEmail = session.user.email
      if (!userEmail) {
        return { authorized: false, error: 'SSO session does not contain email' }
      }

      const allowedEmails = deployment.allowedEmails || []

      if (allowedEmails.includes(userEmail)) {
        return { authorized: true }
      }

      const domain = userEmail.split('@')[1]
      if (domain && allowedEmails.some((allowed: string) => allowed === `@${domain}`)) {
        return { authorized: true }
      }

      return { authorized: false, error: 'Your email is not authorized to access this chat' }
    } catch (error) {
      logger.error(`[${requestId}] Error validating SSO:`, error)
      return { authorized: false, error: 'SSO authentication error' }
    }
  }

  return { authorized: false, error: 'Unsupported authentication type' }
}
```

--------------------------------------------------------------------------------

````
