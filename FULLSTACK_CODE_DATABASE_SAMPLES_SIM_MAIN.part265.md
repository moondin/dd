---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 265
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 265 of 933)

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
Location: sim-main/apps/sim/app/api/chat/manage/[id]/route.test.ts
Signals: Next.js

```typescript
import { NextRequest } from 'next/server'
/**
 * Tests for chat edit API route
 *
 * @vitest-environment node
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/core/config/feature-flags', () => ({
  isDev: true,
  isHosted: false,
  isProd: false,
}))

describe('Chat Edit API Route', () => {
  const mockSelect = vi.fn()
  const mockFrom = vi.fn()
  const mockWhere = vi.fn()
  const mockLimit = vi.fn()
  const mockUpdate = vi.fn()
  const mockSet = vi.fn()
  const mockDelete = vi.fn()

  const mockCreateSuccessResponse = vi.fn()
  const mockCreateErrorResponse = vi.fn()
  const mockEncryptSecret = vi.fn()
  const mockCheckChatAccess = vi.fn()
  const mockDeployWorkflow = vi.fn()

  beforeEach(() => {
    vi.resetModules()

    mockLimit.mockResolvedValue([])
    mockSelect.mockReturnValue({ from: mockFrom })
    mockFrom.mockReturnValue({ where: mockWhere })
    mockWhere.mockReturnValue({ limit: mockLimit })
    mockUpdate.mockReturnValue({ set: mockSet })
    mockSet.mockReturnValue({ where: mockWhere })
    mockDelete.mockReturnValue({ where: mockWhere })

    vi.doMock('@sim/db', () => ({
      db: {
        select: mockSelect,
        update: mockUpdate,
        delete: mockDelete,
      },
    }))

    vi.doMock('@sim/db/schema', () => ({
      chat: { id: 'id', identifier: 'identifier', userId: 'userId' },
    }))

    vi.doMock('@/lib/logs/console/logger', () => ({
      createLogger: vi.fn().mockReturnValue({
        info: vi.fn(),
        error: vi.fn(),
        warn: vi.fn(),
        debug: vi.fn(),
      }),
    }))

    vi.doMock('@/app/api/workflows/utils', () => ({
      createSuccessResponse: mockCreateSuccessResponse.mockImplementation((data) => {
        return new Response(JSON.stringify(data), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      }),
      createErrorResponse: mockCreateErrorResponse.mockImplementation((message, status = 500) => {
        return new Response(JSON.stringify({ error: message }), {
          status,
          headers: { 'Content-Type': 'application/json' },
        })
      }),
    }))

    vi.doMock('@/lib/core/security/encryption', () => ({
      encryptSecret: mockEncryptSecret.mockResolvedValue({ encrypted: 'encrypted-password' }),
    }))

    vi.doMock('@/lib/core/utils/urls', () => ({
      getEmailDomain: vi.fn().mockReturnValue('localhost:3000'),
    }))

    vi.doMock('@/app/api/chat/utils', () => ({
      checkChatAccess: mockCheckChatAccess,
    }))

    mockDeployWorkflow.mockResolvedValue({ success: true, version: 1 })
    vi.doMock('@/lib/workflows/persistence/utils', () => ({
      deployWorkflow: mockDeployWorkflow,
    }))

    vi.doMock('drizzle-orm', () => ({
      eq: vi.fn((field, value) => ({ field, value, type: 'eq' })),
    }))
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('GET', () => {
    it('should return 401 when user is not authenticated', async () => {
      vi.doMock('@/lib/auth', () => ({
        getSession: vi.fn().mockResolvedValue(null),
      }))

      const req = new NextRequest('http://localhost:3000/api/chat/manage/chat-123')
      const { GET } = await import('@/app/api/chat/manage/[id]/route')
      const response = await GET(req, { params: Promise.resolve({ id: 'chat-123' }) })

      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data.error).toBe('Unauthorized')
    })

    it('should return 404 when chat not found or access denied', async () => {
      vi.doMock('@/lib/auth', () => ({
        getSession: vi.fn().mockResolvedValue({
          user: { id: 'user-id' },
        }),
      }))

      mockCheckChatAccess.mockResolvedValue({ hasAccess: false })

      const req = new NextRequest('http://localhost:3000/api/chat/manage/chat-123')
      const { GET } = await import('@/app/api/chat/manage/[id]/route')
      const response = await GET(req, { params: Promise.resolve({ id: 'chat-123' }) })

      expect(response.status).toBe(404)
      const data = await response.json()
      expect(data.error).toBe('Chat not found or access denied')
      expect(mockCheckChatAccess).toHaveBeenCalledWith('chat-123', 'user-id')
    })

    it('should return chat details when user has access', async () => {
      vi.doMock('@/lib/auth', () => ({
        getSession: vi.fn().mockResolvedValue({
          user: { id: 'user-id' },
        }),
      }))

      const mockChat = {
        id: 'chat-123',
        identifier: 'test-chat',
        title: 'Test Chat',
        description: 'A test chat',
        password: 'encrypted-password',
        customizations: { primaryColor: '#000000' },
      }

      mockCheckChatAccess.mockResolvedValue({ hasAccess: true, chat: mockChat })

      const req = new NextRequest('http://localhost:3000/api/chat/manage/chat-123')
      const { GET } = await import('@/app/api/chat/manage/[id]/route')
      const response = await GET(req, { params: Promise.resolve({ id: 'chat-123' }) })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.id).toBe('chat-123')
      expect(data.identifier).toBe('test-chat')
      expect(data.title).toBe('Test Chat')
      expect(data.chatUrl).toBe('http://localhost:3000/chat/test-chat')
      expect(data.hasPassword).toBe(true)
    })
  })

  describe('PATCH', () => {
    it('should return 401 when user is not authenticated', async () => {
      vi.doMock('@/lib/auth', () => ({
        getSession: vi.fn().mockResolvedValue(null),
      }))

      const req = new NextRequest('http://localhost:3000/api/chat/manage/chat-123', {
        method: 'PATCH',
        body: JSON.stringify({ title: 'Updated Chat' }),
      })
      const { PATCH } = await import('@/app/api/chat/manage/[id]/route')
      const response = await PATCH(req, { params: Promise.resolve({ id: 'chat-123' }) })

      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data.error).toBe('Unauthorized')
    })

    it('should return 404 when chat not found or access denied', async () => {
      vi.doMock('@/lib/auth', () => ({
        getSession: vi.fn().mockResolvedValue({
          user: { id: 'user-id' },
        }),
      }))

      mockCheckChatAccess.mockResolvedValue({ hasAccess: false })

      const req = new NextRequest('http://localhost:3000/api/chat/manage/chat-123', {
        method: 'PATCH',
        body: JSON.stringify({ title: 'Updated Chat' }),
      })
      const { PATCH } = await import('@/app/api/chat/manage/[id]/route')
      const response = await PATCH(req, { params: Promise.resolve({ id: 'chat-123' }) })

      expect(response.status).toBe(404)
      const data = await response.json()
      expect(data.error).toBe('Chat not found or access denied')
      expect(mockCheckChatAccess).toHaveBeenCalledWith('chat-123', 'user-id')
    })

    it('should update chat when user has access', async () => {
      vi.doMock('@/lib/auth', () => ({
        getSession: vi.fn().mockResolvedValue({
          user: { id: 'user-id' },
        }),
      }))

      const mockChat = {
        id: 'chat-123',
        identifier: 'test-chat',
        title: 'Test Chat',
        authType: 'public',
        workflowId: 'workflow-123',
      }

      mockCheckChatAccess.mockResolvedValue({ hasAccess: true, chat: mockChat })
      mockLimit.mockResolvedValueOnce([]) // No identifier conflict

      const req = new NextRequest('http://localhost:3000/api/chat/manage/chat-123', {
        method: 'PATCH',
        body: JSON.stringify({ title: 'Updated Chat', description: 'Updated description' }),
      })
      const { PATCH } = await import('@/app/api/chat/manage/[id]/route')
      const response = await PATCH(req, { params: Promise.resolve({ id: 'chat-123' }) })

      expect(response.status).toBe(200)
      expect(mockUpdate).toHaveBeenCalled()
      const data = await response.json()
      expect(data.id).toBe('chat-123')
      expect(data.chatUrl).toBe('http://localhost:3000/chat/test-chat')
      expect(data.message).toBe('Chat deployment updated successfully')
    })

    it('should handle identifier conflicts', async () => {
      vi.doMock('@/lib/auth', () => ({
        getSession: vi.fn().mockResolvedValue({
          user: { id: 'user-id' },
        }),
      }))

      const mockChat = {
        id: 'chat-123',
        identifier: 'test-chat',
        title: 'Test Chat',
        workflowId: 'workflow-123',
      }

      mockCheckChatAccess.mockResolvedValue({ hasAccess: true, chat: mockChat })

      mockLimit.mockReset()
      mockLimit.mockResolvedValue([{ id: 'other-chat-id', identifier: 'new-identifier' }])
      mockWhere.mockReturnValue({ limit: mockLimit })

      const req = new NextRequest('http://localhost:3000/api/chat/manage/chat-123', {
        method: 'PATCH',
        body: JSON.stringify({ identifier: 'new-identifier' }),
      })
      const { PATCH } = await import('@/app/api/chat/manage/[id]/route')
      const response = await PATCH(req, { params: Promise.resolve({ id: 'chat-123' }) })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toBe('Identifier already in use')
    })

    it('should validate password requirement for password auth', async () => {
      vi.doMock('@/lib/auth', () => ({
        getSession: vi.fn().mockResolvedValue({
          user: { id: 'user-id' },
        }),
      }))

      const mockChat = {
        id: 'chat-123',
        identifier: 'test-chat',
        title: 'Test Chat',
        authType: 'public',
        password: null,
        workflowId: 'workflow-123',
      }

      mockCheckChatAccess.mockResolvedValue({ hasAccess: true, chat: mockChat })

      const req = new NextRequest('http://localhost:3000/api/chat/manage/chat-123', {
        method: 'PATCH',
        body: JSON.stringify({ authType: 'password' }),
      })
      const { PATCH } = await import('@/app/api/chat/manage/[id]/route')
      const response = await PATCH(req, { params: Promise.resolve({ id: 'chat-123' }) })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toBe('Password is required when using password protection')
    })

    it('should allow access when user has workspace admin permission', async () => {
      vi.doMock('@/lib/auth', () => ({
        getSession: vi.fn().mockResolvedValue({
          user: { id: 'admin-user-id' },
        }),
      }))

      const mockChat = {
        id: 'chat-123',
        identifier: 'test-chat',
        title: 'Test Chat',
        authType: 'public',
        workflowId: 'workflow-123',
      }

      mockCheckChatAccess.mockResolvedValue({ hasAccess: true, chat: mockChat })
      mockLimit.mockResolvedValueOnce([])

      const req = new NextRequest('http://localhost:3000/api/chat/manage/chat-123', {
        method: 'PATCH',
        body: JSON.stringify({ title: 'Admin Updated Chat' }),
      })
      const { PATCH } = await import('@/app/api/chat/manage/[id]/route')
      const response = await PATCH(req, { params: Promise.resolve({ id: 'chat-123' }) })

      expect(response.status).toBe(200)
      expect(mockCheckChatAccess).toHaveBeenCalledWith('chat-123', 'admin-user-id')
    })
  })

  describe('DELETE', () => {
    it('should return 401 when user is not authenticated', async () => {
      vi.doMock('@/lib/auth', () => ({
        getSession: vi.fn().mockResolvedValue(null),
      }))

      const req = new NextRequest('http://localhost:3000/api/chat/manage/chat-123', {
        method: 'DELETE',
      })
      const { DELETE } = await import('@/app/api/chat/manage/[id]/route')
      const response = await DELETE(req, { params: Promise.resolve({ id: 'chat-123' }) })

      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data.error).toBe('Unauthorized')
    })

    it('should return 404 when chat not found or access denied', async () => {
      vi.doMock('@/lib/auth', () => ({
        getSession: vi.fn().mockResolvedValue({
          user: { id: 'user-id' },
        }),
      }))

      mockCheckChatAccess.mockResolvedValue({ hasAccess: false })

      const req = new NextRequest('http://localhost:3000/api/chat/manage/chat-123', {
        method: 'DELETE',
      })
      const { DELETE } = await import('@/app/api/chat/manage/[id]/route')
      const response = await DELETE(req, { params: Promise.resolve({ id: 'chat-123' }) })

      expect(response.status).toBe(404)
      const data = await response.json()
      expect(data.error).toBe('Chat not found or access denied')
      expect(mockCheckChatAccess).toHaveBeenCalledWith('chat-123', 'user-id')
    })

    it('should delete chat when user has access', async () => {
      vi.doMock('@/lib/auth', () => ({
        getSession: vi.fn().mockResolvedValue({
          user: { id: 'user-id' },
        }),
      }))

      mockCheckChatAccess.mockResolvedValue({ hasAccess: true })
      mockWhere.mockResolvedValue(undefined)

      const req = new NextRequest('http://localhost:3000/api/chat/manage/chat-123', {
        method: 'DELETE',
      })
      const { DELETE } = await import('@/app/api/chat/manage/[id]/route')
      const response = await DELETE(req, { params: Promise.resolve({ id: 'chat-123' }) })

      expect(response.status).toBe(200)
      expect(mockDelete).toHaveBeenCalled()
      const data = await response.json()
      expect(data.message).toBe('Chat deployment deleted successfully')
    })

    it('should allow deletion when user has workspace admin permission', async () => {
      vi.doMock('@/lib/auth', () => ({
        getSession: vi.fn().mockResolvedValue({
          user: { id: 'admin-user-id' },
        }),
      }))

      mockCheckChatAccess.mockResolvedValue({ hasAccess: true })
      mockWhere.mockResolvedValue(undefined)

      const req = new NextRequest('http://localhost:3000/api/chat/manage/chat-123', {
        method: 'DELETE',
      })
      const { DELETE } = await import('@/app/api/chat/manage/[id]/route')
      const response = await DELETE(req, { params: Promise.resolve({ id: 'chat-123' }) })

      expect(response.status).toBe(200)
      expect(mockCheckChatAccess).toHaveBeenCalledWith('chat-123', 'admin-user-id')
      expect(mockDelete).toHaveBeenCalled()
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/chat/manage/[id]/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import { chat } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { isDev } from '@/lib/core/config/feature-flags'
import { encryptSecret } from '@/lib/core/security/encryption'
import { getEmailDomain } from '@/lib/core/utils/urls'
import { createLogger } from '@/lib/logs/console/logger'
import { deployWorkflow } from '@/lib/workflows/persistence/utils'
import { checkChatAccess } from '@/app/api/chat/utils'
import { createErrorResponse, createSuccessResponse } from '@/app/api/workflows/utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('ChatDetailAPI')

const chatUpdateSchema = z.object({
  workflowId: z.string().min(1, 'Workflow ID is required').optional(),
  identifier: z
    .string()
    .min(1, 'Identifier is required')
    .regex(/^[a-z0-9-]+$/, 'Identifier can only contain lowercase letters, numbers, and hyphens')
    .optional(),
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
  customizations: z
    .object({
      primaryColor: z.string(),
      welcomeMessage: z.string(),
      imageUrl: z.string().optional(),
    })
    .optional(),
  authType: z.enum(['public', 'password', 'email', 'sso']).optional(),
  password: z.string().optional(),
  allowedEmails: z.array(z.string()).optional(),
  outputConfigs: z
    .array(
      z.object({
        blockId: z.string(),
        path: z.string(),
      })
    )
    .optional(),
})

/**
 * GET endpoint to fetch a specific chat deployment by ID
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const chatId = id

  try {
    const session = await getSession()

    if (!session) {
      return createErrorResponse('Unauthorized', 401)
    }

    const { hasAccess, chat: chatRecord } = await checkChatAccess(chatId, session.user.id)

    if (!hasAccess || !chatRecord) {
      return createErrorResponse('Chat not found or access denied', 404)
    }

    const { password, ...safeData } = chatRecord

    const baseDomain = getEmailDomain()
    const protocol = isDev ? 'http' : 'https'
    const chatUrl = `${protocol}://${baseDomain}/chat/${chatRecord.identifier}`

    const result = {
      ...safeData,
      chatUrl,
      hasPassword: !!password,
    }

    return createSuccessResponse(result)
  } catch (error: any) {
    logger.error('Error fetching chat deployment:', error)
    return createErrorResponse(error.message || 'Failed to fetch chat deployment', 500)
  }
}

/**
 * PATCH endpoint to update an existing chat deployment
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const chatId = id

  try {
    const session = await getSession()

    if (!session) {
      return createErrorResponse('Unauthorized', 401)
    }

    const body = await request.json()

    try {
      const validatedData = chatUpdateSchema.parse(body)

      const { hasAccess, chat: existingChatRecord } = await checkChatAccess(chatId, session.user.id)

      if (!hasAccess || !existingChatRecord) {
        return createErrorResponse('Chat not found or access denied', 404)
      }

      const existingChat = [existingChatRecord]

      const {
        workflowId,
        identifier,
        title,
        description,
        customizations,
        authType,
        password,
        allowedEmails,
        outputConfigs,
      } = validatedData

      if (identifier && identifier !== existingChat[0].identifier) {
        const existingIdentifier = await db
          .select()
          .from(chat)
          .where(eq(chat.identifier, identifier))
          .limit(1)

        if (existingIdentifier.length > 0 && existingIdentifier[0].id !== chatId) {
          return createErrorResponse('Identifier already in use', 400)
        }
      }

      // Redeploy the workflow to ensure latest version is active
      const deployResult = await deployWorkflow({
        workflowId: existingChat[0].workflowId,
        deployedBy: session.user.id,
      })

      if (!deployResult.success) {
        logger.warn(
          `Failed to redeploy workflow for chat update: ${deployResult.error}, continuing with chat update`
        )
      } else {
        logger.info(
          `Redeployed workflow ${existingChat[0].workflowId} for chat update (v${deployResult.version})`
        )
      }

      let encryptedPassword

      if (password) {
        const { encrypted } = await encryptSecret(password)
        encryptedPassword = encrypted
        logger.info('Password provided, will be updated')
      } else if (authType === 'password' && !password) {
        if (existingChat[0].authType !== 'password' || !existingChat[0].password) {
          return createErrorResponse('Password is required when using password protection', 400)
        }
        logger.info('Keeping existing password')
      }

      const updateData: any = {
        updatedAt: new Date(),
      }

      if (workflowId) updateData.workflowId = workflowId
      if (identifier) updateData.identifier = identifier
      if (title) updateData.title = title
      if (description !== undefined) updateData.description = description
      if (customizations) updateData.customizations = customizations

      if (authType) {
        updateData.authType = authType

        if (authType === 'public') {
          updateData.password = null
          updateData.allowedEmails = []
        } else if (authType === 'password') {
          updateData.allowedEmails = []
        } else if (authType === 'email' || authType === 'sso') {
          updateData.password = null
        }
      }

      if (encryptedPassword) {
        updateData.password = encryptedPassword
      }

      if (allowedEmails) {
        updateData.allowedEmails = allowedEmails
      }

      if (outputConfigs) {
        updateData.outputConfigs = outputConfigs
      }

      logger.info('Updating chat deployment with values:', {
        chatId,
        authType: updateData.authType,
        hasPassword: updateData.password !== undefined,
        emailCount: updateData.allowedEmails?.length,
        outputConfigsCount: updateData.outputConfigs ? updateData.outputConfigs.length : undefined,
      })

      await db.update(chat).set(updateData).where(eq(chat.id, chatId))

      const updatedIdentifier = identifier || existingChat[0].identifier

      const baseDomain = getEmailDomain()
      const protocol = isDev ? 'http' : 'https'
      const chatUrl = `${protocol}://${baseDomain}/chat/${updatedIdentifier}`

      logger.info(`Chat "${chatId}" updated successfully`)

      return createSuccessResponse({
        id: chatId,
        chatUrl,
        message: 'Chat deployment updated successfully',
      })
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        const errorMessage = validationError.errors[0]?.message || 'Invalid request data'
        return createErrorResponse(errorMessage, 400, 'VALIDATION_ERROR')
      }
      throw validationError
    }
  } catch (error: any) {
    logger.error('Error updating chat deployment:', error)
    return createErrorResponse(error.message || 'Failed to update chat deployment', 500)
  }
}

/**
 * DELETE endpoint to remove a chat deployment
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const chatId = id

  try {
    const session = await getSession()

    if (!session) {
      return createErrorResponse('Unauthorized', 401)
    }

    const { hasAccess } = await checkChatAccess(chatId, session.user.id)

    if (!hasAccess) {
      return createErrorResponse('Chat not found or access denied', 404)
    }

    await db.delete(chat).where(eq(chat.id, chatId))

    logger.info(`Chat "${chatId}" deleted successfully`)

    return createSuccessResponse({
      message: 'Chat deployment deleted successfully',
    })
  } catch (error: any) {
    logger.error('Error deleting chat deployment:', error)
    return createErrorResponse(error.message || 'Failed to delete chat deployment', 500)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/chat/validate/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import { chat } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { z } from 'zod'
import { createLogger } from '@/lib/logs/console/logger'
import { createErrorResponse, createSuccessResponse } from '@/app/api/workflows/utils'

const logger = createLogger('ChatValidateAPI')

const validateQuerySchema = z.object({
  identifier: z
    .string()
    .min(1, 'Identifier is required')
    .regex(/^[a-z0-9-]+$/, 'Identifier can only contain lowercase letters, numbers, and hyphens')
    .max(100, 'Identifier must be 100 characters or less'),
})

/**
 * GET endpoint to validate chat identifier availability
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const identifier = searchParams.get('identifier')

    const validation = validateQuerySchema.safeParse({ identifier })

    if (!validation.success) {
      const errorMessage = validation.error.errors[0]?.message || 'Invalid identifier'
      logger.warn(`Validation error: ${errorMessage}`)

      if (identifier && !/^[a-z0-9-]+$/.test(identifier)) {
        return createSuccessResponse({
          available: false,
          error: errorMessage,
        })
      }

      return createErrorResponse(errorMessage, 400)
    }

    const { identifier: validatedIdentifier } = validation.data

    const existingChat = await db
      .select({ id: chat.id })
      .from(chat)
      .where(eq(chat.identifier, validatedIdentifier))
      .limit(1)

    const isAvailable = existingChat.length === 0

    logger.debug(
      `Identifier "${validatedIdentifier}" availability check: ${isAvailable ? 'available' : 'taken'}`
    )

    return createSuccessResponse({
      available: isAvailable,
      error: isAvailable ? null : 'This identifier is already in use',
    })
  } catch (error: any) {
    logger.error('Error validating chat identifier:', error)
    return createErrorResponse(error.message || 'Failed to validate identifier', 500)
  }
}
```

--------------------------------------------------------------------------------

````
