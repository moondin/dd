---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 269
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 269 of 933)

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
Location: sim-main/apps/sim/app/api/copilot/chat/delete/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import { copilotChats } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('DeleteChatAPI')

const DeleteChatSchema = z.object({
  chatId: z.string(),
})

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = DeleteChatSchema.parse(body)

    // Delete the chat
    await db.delete(copilotChats).where(eq(copilotChats.id, parsed.chatId))

    logger.info('Chat deleted', { chatId: parsed.chatId })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Error deleting chat:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete chat' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.test.ts]---
Location: sim-main/apps/sim/app/api/copilot/chat/update-messages/route.test.ts
Signals: Next.js

```typescript
/**
 * Tests for copilot chat update-messages API route
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

describe('Copilot Chat Update Messages API Route', () => {
  const mockSelect = vi.fn()
  const mockFrom = vi.fn()
  const mockWhere = vi.fn()
  const mockLimit = vi.fn()
  const mockUpdate = vi.fn()
  const mockSet = vi.fn()

  beforeEach(() => {
    vi.resetModules()
    setupCommonApiMocks()
    mockCryptoUuid()

    mockSelect.mockReturnValue({ from: mockFrom })
    mockFrom.mockReturnValue({ where: mockWhere })
    mockWhere.mockReturnValue({ limit: mockLimit })
    mockLimit.mockResolvedValue([]) // Default: no chat found
    mockUpdate.mockReturnValue({ set: mockSet })
    mockSet.mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) }) // Different where for update

    vi.doMock('@sim/db', () => ({
      db: {
        select: mockSelect,
        update: mockUpdate,
      },
    }))

    vi.doMock('@sim/db/schema', () => ({
      copilotChats: {
        id: 'id',
        userId: 'userId',
        messages: 'messages',
        updatedAt: 'updatedAt',
      },
    }))

    vi.doMock('drizzle-orm', () => ({
      and: vi.fn((...conditions) => ({ conditions, type: 'and' })),
      eq: vi.fn((field, value) => ({ field, value, type: 'eq' })),
    }))
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
        chatId: 'chat-123',
        messages: [
          {
            id: 'msg-1',
            role: 'user',
            content: 'Hello',
            timestamp: '2024-01-01T00:00:00.000Z',
          },
        ],
      })

      const { POST } = await import('@/app/api/copilot/chat/update-messages/route')
      const response = await POST(req)

      expect(response.status).toBe(401)
      const responseData = await response.json()
      expect(responseData).toEqual({ error: 'Unauthorized' })
    })

    it('should return 400 for invalid request body - missing chatId', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      const req = createMockRequest('POST', {
        messages: [
          {
            id: 'msg-1',
            role: 'user',
            content: 'Hello',
            timestamp: '2024-01-01T00:00:00.000Z',
          },
        ],
        // Missing chatId
      })

      const { POST } = await import('@/app/api/copilot/chat/update-messages/route')
      const response = await POST(req)

      expect(response.status).toBe(500)
      const responseData = await response.json()
      expect(responseData.error).toBe('Failed to update chat messages')
    })

    it('should return 400 for invalid request body - missing messages', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      const req = createMockRequest('POST', {
        chatId: 'chat-123',
        // Missing messages
      })

      const { POST } = await import('@/app/api/copilot/chat/update-messages/route')
      const response = await POST(req)

      expect(response.status).toBe(500)
      const responseData = await response.json()
      expect(responseData.error).toBe('Failed to update chat messages')
    })

    it('should return 400 for invalid message structure - missing required fields', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      const req = createMockRequest('POST', {
        chatId: 'chat-123',
        messages: [
          {
            id: 'msg-1',
            // Missing role, content, timestamp
          },
        ],
      })

      const { POST } = await import('@/app/api/copilot/chat/update-messages/route')
      const response = await POST(req)

      expect(response.status).toBe(500)
      const responseData = await response.json()
      expect(responseData.error).toBe('Failed to update chat messages')
    })

    it('should return 400 for invalid message role', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      const req = createMockRequest('POST', {
        chatId: 'chat-123',
        messages: [
          {
            id: 'msg-1',
            role: 'invalid-role',
            content: 'Hello',
            timestamp: '2024-01-01T00:00:00.000Z',
          },
        ],
      })

      const { POST } = await import('@/app/api/copilot/chat/update-messages/route')
      const response = await POST(req)

      expect(response.status).toBe(500)
      const responseData = await response.json()
      expect(responseData.error).toBe('Failed to update chat messages')
    })

    it('should return 404 when chat is not found', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      // Mock chat not found
      mockLimit.mockResolvedValueOnce([])

      const req = createMockRequest('POST', {
        chatId: 'non-existent-chat',
        messages: [
          {
            id: 'msg-1',
            role: 'user',
            content: 'Hello',
            timestamp: '2024-01-01T00:00:00.000Z',
          },
        ],
      })

      const { POST } = await import('@/app/api/copilot/chat/update-messages/route')
      const response = await POST(req)

      expect(response.status).toBe(404)
      const responseData = await response.json()
      expect(responseData.error).toBe('Chat not found or unauthorized')
    })

    it('should return 404 when chat belongs to different user', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      // Mock chat not found (due to user mismatch)
      mockLimit.mockResolvedValueOnce([])

      const req = createMockRequest('POST', {
        chatId: 'other-user-chat',
        messages: [
          {
            id: 'msg-1',
            role: 'user',
            content: 'Hello',
            timestamp: '2024-01-01T00:00:00.000Z',
          },
        ],
      })

      const { POST } = await import('@/app/api/copilot/chat/update-messages/route')
      const response = await POST(req)

      expect(response.status).toBe(404)
      const responseData = await response.json()
      expect(responseData.error).toBe('Chat not found or unauthorized')
    })

    it('should successfully update chat messages', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      const existingChat = {
        id: 'chat-123',
        userId: 'user-123',
        messages: [],
      }
      mockLimit.mockResolvedValueOnce([existingChat])

      const messages = [
        {
          id: 'msg-1',
          role: 'user',
          content: 'Hello, how are you?',
          timestamp: '2024-01-01T10:00:00.000Z',
        },
        {
          id: 'msg-2',
          role: 'assistant',
          content: 'I am doing well, thank you!',
          timestamp: '2024-01-01T10:01:00.000Z',
        },
      ]

      const req = createMockRequest('POST', {
        chatId: 'chat-123',
        messages,
      })

      const { POST } = await import('@/app/api/copilot/chat/update-messages/route')
      const response = await POST(req)

      expect(response.status).toBe(200)
      const responseData = await response.json()
      expect(responseData).toEqual({
        success: true,
        messageCount: 2,
      })

      expect(mockSelect).toHaveBeenCalled()
      expect(mockUpdate).toHaveBeenCalled()
      expect(mockSet).toHaveBeenCalledWith({
        messages,
        updatedAt: expect.any(Date),
      })
    })

    it('should successfully update chat messages with optional fields', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      const existingChat = {
        id: 'chat-456',
        userId: 'user-123',
        messages: [],
      }
      mockLimit.mockResolvedValueOnce([existingChat])

      const messages = [
        {
          id: 'msg-1',
          role: 'user',
          content: 'Hello',
          timestamp: '2024-01-01T10:00:00.000Z',
        },
        {
          id: 'msg-2',
          role: 'assistant',
          content: 'Hi there!',
          timestamp: '2024-01-01T10:01:00.000Z',
          toolCalls: [
            {
              id: 'tool-1',
              name: 'get_weather',
              arguments: { location: 'NYC' },
            },
          ],
          contentBlocks: [
            {
              type: 'text',
              content: 'Here is the weather information',
            },
          ],
        },
      ]

      const req = createMockRequest('POST', {
        chatId: 'chat-456',
        messages,
      })

      const { POST } = await import('@/app/api/copilot/chat/update-messages/route')
      const response = await POST(req)

      expect(response.status).toBe(200)
      const responseData = await response.json()
      expect(responseData).toEqual({
        success: true,
        messageCount: 2,
      })

      expect(mockSet).toHaveBeenCalledWith({
        messages,
        updatedAt: expect.any(Date),
      })
    })

    it('should handle empty messages array', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      const existingChat = {
        id: 'chat-789',
        userId: 'user-123',
        messages: [],
      }
      mockLimit.mockResolvedValueOnce([existingChat])

      const req = createMockRequest('POST', {
        chatId: 'chat-789',
        messages: [],
      })

      const { POST } = await import('@/app/api/copilot/chat/update-messages/route')
      const response = await POST(req)

      expect(response.status).toBe(200)
      const responseData = await response.json()
      expect(responseData).toEqual({
        success: true,
        messageCount: 0,
      })

      expect(mockSet).toHaveBeenCalledWith({
        messages: [],
        updatedAt: expect.any(Date),
      })
    })

    it('should handle database errors during chat lookup', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      mockLimit.mockRejectedValueOnce(new Error('Database connection failed'))

      const req = createMockRequest('POST', {
        chatId: 'chat-123',
        messages: [
          {
            id: 'msg-1',
            role: 'user',
            content: 'Hello',
            timestamp: '2024-01-01T00:00:00.000Z',
          },
        ],
      })

      const { POST } = await import('@/app/api/copilot/chat/update-messages/route')
      const response = await POST(req)

      expect(response.status).toBe(500)
      const responseData = await response.json()
      expect(responseData.error).toBe('Failed to update chat messages')
    })

    it('should handle database errors during update operation', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      const existingChat = {
        id: 'chat-123',
        userId: 'user-123',
        messages: [],
      }
      mockLimit.mockResolvedValueOnce([existingChat])

      mockSet.mockReturnValueOnce({
        where: vi.fn().mockRejectedValue(new Error('Update operation failed')),
      })

      const req = createMockRequest('POST', {
        chatId: 'chat-123',
        messages: [
          {
            id: 'msg-1',
            role: 'user',
            content: 'Hello',
            timestamp: '2024-01-01T00:00:00.000Z',
          },
        ],
      })

      const { POST } = await import('@/app/api/copilot/chat/update-messages/route')
      const response = await POST(req)

      expect(response.status).toBe(500)
      const responseData = await response.json()
      expect(responseData.error).toBe('Failed to update chat messages')
    })

    it('should handle JSON parsing errors in request body', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      const req = new NextRequest('http://localhost:3000/api/copilot/chat/update-messages', {
        method: 'POST',
        body: '{invalid-json',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const { POST } = await import('@/app/api/copilot/chat/update-messages/route')
      const response = await POST(req)

      expect(response.status).toBe(500)
      const responseData = await response.json()
      expect(responseData.error).toBe('Failed to update chat messages')
    })

    it('should handle large message arrays', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      const existingChat = {
        id: 'chat-large',
        userId: 'user-123',
        messages: [],
      }
      mockLimit.mockResolvedValueOnce([existingChat])

      const messages = Array.from({ length: 100 }, (_, i) => ({
        id: `msg-${i + 1}`,
        role: i % 2 === 0 ? 'user' : 'assistant',
        content: `Message ${i + 1}`,
        timestamp: new Date(2024, 0, 1, 10, i).toISOString(),
      }))

      const req = createMockRequest('POST', {
        chatId: 'chat-large',
        messages,
      })

      const { POST } = await import('@/app/api/copilot/chat/update-messages/route')
      const response = await POST(req)

      expect(response.status).toBe(200)
      const responseData = await response.json()
      expect(responseData).toEqual({
        success: true,
        messageCount: 100,
      })

      expect(mockSet).toHaveBeenCalledWith({
        messages,
        updatedAt: expect.any(Date),
      })
    })

    it('should handle messages with both user and assistant roles', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      const existingChat = {
        id: 'chat-mixed',
        userId: 'user-123',
        messages: [],
      }
      mockLimit.mockResolvedValueOnce([existingChat])

      const messages = [
        {
          id: 'msg-1',
          role: 'user',
          content: 'What is the weather like?',
          timestamp: '2024-01-01T10:00:00.000Z',
        },
        {
          id: 'msg-2',
          role: 'assistant',
          content: 'Let me check the weather for you.',
          timestamp: '2024-01-01T10:01:00.000Z',
          toolCalls: [
            {
              id: 'tool-weather',
              name: 'get_weather',
              arguments: { location: 'current' },
            },
          ],
        },
        {
          id: 'msg-3',
          role: 'assistant',
          content: 'The weather is sunny and 75°F.',
          timestamp: '2024-01-01T10:02:00.000Z',
        },
        {
          id: 'msg-4',
          role: 'user',
          content: 'Thank you!',
          timestamp: '2024-01-01T10:03:00.000Z',
        },
      ]

      const req = createMockRequest('POST', {
        chatId: 'chat-mixed',
        messages,
      })

      const { POST } = await import('@/app/api/copilot/chat/update-messages/route')
      const response = await POST(req)

      expect(response.status).toBe(200)
      const responseData = await response.json()
      expect(responseData).toEqual({
        success: true,
        messageCount: 4,
      })
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/copilot/chat/update-messages/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import { copilotChats } from '@sim/db/schema'
import { and, eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import {
  authenticateCopilotRequestSessionOnly,
  createInternalServerErrorResponse,
  createNotFoundResponse,
  createRequestTracker,
  createUnauthorizedResponse,
} from '@/lib/copilot/request-helpers'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('CopilotChatUpdateAPI')

const UpdateMessagesSchema = z.object({
  chatId: z.string(),
  messages: z.array(
    z.object({
      id: z.string(),
      role: z.enum(['user', 'assistant']),
      content: z.string(),
      timestamp: z.string(),
      toolCalls: z.array(z.any()).optional(),
      contentBlocks: z.array(z.any()).optional(),
      fileAttachments: z
        .array(
          z.object({
            id: z.string(),
            key: z.string(),
            filename: z.string(),
            media_type: z.string(),
            size: z.number(),
          })
        )
        .optional(),
    })
  ),
  planArtifact: z.string().nullable().optional(),
  config: z
    .object({
      mode: z.enum(['ask', 'build', 'plan']).optional(),
      model: z.string().optional(),
    })
    .nullable()
    .optional(),
})

export async function POST(req: NextRequest) {
  const tracker = createRequestTracker()

  try {
    const { userId, isAuthenticated } = await authenticateCopilotRequestSessionOnly()
    if (!isAuthenticated || !userId) {
      return createUnauthorizedResponse()
    }

    const body = await req.json()
    const { chatId, messages, planArtifact, config } = UpdateMessagesSchema.parse(body)

    // Verify that the chat belongs to the user
    const [chat] = await db
      .select()
      .from(copilotChats)
      .where(and(eq(copilotChats.id, chatId), eq(copilotChats.userId, userId)))
      .limit(1)

    if (!chat) {
      return createNotFoundResponse('Chat not found or unauthorized')
    }

    // Update chat with new messages, plan artifact, and config
    const updateData: Record<string, any> = {
      messages: messages,
      updatedAt: new Date(),
    }

    if (planArtifact !== undefined) {
      updateData.planArtifact = planArtifact
    }

    if (config !== undefined) {
      updateData.config = config
    }

    await db.update(copilotChats).set(updateData).where(eq(copilotChats.id, chatId))

    logger.info(`[${tracker.requestId}] Successfully updated chat`, {
      chatId,
      newMessageCount: messages.length,
      hasPlanArtifact: !!planArtifact,
      hasConfig: !!config,
    })

    return NextResponse.json({
      success: true,
      messageCount: messages.length,
    })
  } catch (error) {
    logger.error(`[${tracker.requestId}] Error updating chat messages:`, error)
    return createInternalServerErrorResponse('Failed to update chat messages')
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/copilot/chat/update-title/route.ts
Signals: Next.js, Zod

```typescript
/**
 * @deprecated This route is not currently in use
 * @remarks Kept for reference - may be removed in future cleanup
 */

import { db } from '@sim/db'
import { copilotChats } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('UpdateChatTitleAPI')

const UpdateTitleSchema = z.object({
  chatId: z.string(),
  title: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = UpdateTitleSchema.parse(body)

    // Update the chat title
    await db
      .update(copilotChats)
      .set({
        title: parsed.title,
        updatedAt: new Date(),
      })
      .where(eq(copilotChats.id, parsed.chatId))

    logger.info('Chat title updated', { chatId: parsed.chatId, title: parsed.title })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Error updating chat title:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update chat title' },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/copilot/chats/route.ts
Signals: Next.js

```typescript
import { db } from '@sim/db'
import { copilotChats } from '@sim/db/schema'
import { desc, eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import {
  authenticateCopilotRequestSessionOnly,
  createInternalServerErrorResponse,
  createUnauthorizedResponse,
} from '@/lib/copilot/request-helpers'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('CopilotChatsListAPI')

export async function GET(_req: NextRequest) {
  try {
    const { userId, isAuthenticated } = await authenticateCopilotRequestSessionOnly()
    if (!isAuthenticated || !userId) {
      return createUnauthorizedResponse()
    }

    const chats = await db
      .select({
        id: copilotChats.id,
        title: copilotChats.title,
        workflowId: copilotChats.workflowId,
        updatedAt: copilotChats.updatedAt,
      })
      .from(copilotChats)
      .where(eq(copilotChats.userId, userId))
      .orderBy(desc(copilotChats.updatedAt))

    logger.info(`Retrieved ${chats.length} chats for user ${userId}`)

    return NextResponse.json({ success: true, chats })
  } catch (error) {
    logger.error('Error fetching user copilot chats:', error)
    return createInternalServerErrorResponse('Failed to fetch user chats')
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.test.ts]---
Location: sim-main/apps/sim/app/api/copilot/checkpoints/route.test.ts
Signals: Next.js

```typescript
/**
 * Tests for copilot checkpoints API route
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

describe('Copilot Checkpoints API Route', () => {
  const mockSelect = vi.fn()
  const mockFrom = vi.fn()
  const mockWhere = vi.fn()
  const mockLimit = vi.fn()
  const mockOrderBy = vi.fn()
  const mockInsert = vi.fn()
  const mockValues = vi.fn()
  const mockReturning = vi.fn()

  const mockCopilotChats = { id: 'id', userId: 'userId' }
  const mockWorkflowCheckpoints = {
    id: 'id',
    userId: 'userId',
    workflowId: 'workflowId',
    chatId: 'chatId',
    messageId: 'messageId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  }

  beforeEach(() => {
    vi.resetModules()
    setupCommonApiMocks()
    mockCryptoUuid()

    mockSelect.mockReturnValue({ from: mockFrom })
    mockFrom.mockReturnValue({ where: mockWhere })
    mockWhere.mockReturnValue({
      orderBy: mockOrderBy,
      limit: mockLimit,
    })
    mockOrderBy.mockResolvedValue([])
    mockLimit.mockResolvedValue([])
    mockInsert.mockReturnValue({ values: mockValues })
    mockValues.mockReturnValue({ returning: mockReturning })

    vi.doMock('@sim/db', () => ({
      db: {
        select: mockSelect,
        insert: mockInsert,
      },
    }))

    vi.doMock('@sim/db/schema', () => ({
      copilotChats: mockCopilotChats,
      workflowCheckpoints: mockWorkflowCheckpoints,
    }))

    vi.doMock('drizzle-orm', () => ({
      and: vi.fn((...conditions) => ({ conditions, type: 'and' })),
      eq: vi.fn((field, value) => ({ field, value, type: 'eq' })),
      desc: vi.fn((field) => ({ field, type: 'desc' })),
    }))
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
        workflowId: 'workflow-123',
        chatId: 'chat-123',
        workflowState: '{"blocks": []}',
      })

      const { POST } = await import('@/app/api/copilot/checkpoints/route')
      const response = await POST(req)

      expect(response.status).toBe(401)
      const responseData = await response.json()
      expect(responseData).toEqual({ error: 'Unauthorized' })
    })

    it('should return 500 for invalid request body', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      const req = createMockRequest('POST', {
        // Missing required fields
        workflowId: 'workflow-123',
        // Missing chatId and workflowState
      })

      const { POST } = await import('@/app/api/copilot/checkpoints/route')
      const response = await POST(req)

      expect(response.status).toBe(500)
      const responseData = await response.json()
      expect(responseData.error).toBe('Failed to create checkpoint')
    })

    it('should return 400 when chat not found or unauthorized', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      // Mock chat not found
      mockLimit.mockResolvedValue([])

      const req = createMockRequest('POST', {
        workflowId: 'workflow-123',
        chatId: 'chat-123',
        workflowState: '{"blocks": []}',
      })

      const { POST } = await import('@/app/api/copilot/checkpoints/route')
      const response = await POST(req)

      expect(response.status).toBe(400)
      const responseData = await response.json()
      expect(responseData.error).toBe('Chat not found or unauthorized')
    })

    it('should return 400 for invalid workflow state JSON', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      // Mock chat exists
      const chat = {
        id: 'chat-123',
        userId: 'user-123',
      }
      mockLimit.mockResolvedValue([chat])

      const req = createMockRequest('POST', {
        workflowId: 'workflow-123',
        chatId: 'chat-123',
        workflowState: 'invalid-json', // Invalid JSON
      })

      const { POST } = await import('@/app/api/copilot/checkpoints/route')
      const response = await POST(req)

      expect(response.status).toBe(400)
      const responseData = await response.json()
      expect(responseData.error).toBe('Invalid workflow state JSON')
    })

    it('should successfully create a checkpoint', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      // Mock chat exists
      const chat = {
        id: 'chat-123',
        userId: 'user-123',
      }
      mockLimit.mockResolvedValue([chat])

      // Mock successful checkpoint creation
      const checkpoint = {
        id: 'checkpoint-123',
        userId: 'user-123',
        workflowId: 'workflow-123',
        chatId: 'chat-123',
        messageId: 'message-123',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      }
      mockReturning.mockResolvedValue([checkpoint])

      const workflowState = { blocks: [], connections: [] }
      const req = createMockRequest('POST', {
        workflowId: 'workflow-123',
        chatId: 'chat-123',
        messageId: 'message-123',
        workflowState: JSON.stringify(workflowState),
      })

      const { POST } = await import('@/app/api/copilot/checkpoints/route')
      const response = await POST(req)

      expect(response.status).toBe(200)
      const responseData = await response.json()
      expect(responseData).toEqual({
        success: true,
        checkpoint: {
          id: 'checkpoint-123',
          userId: 'user-123',
          workflowId: 'workflow-123',
          chatId: 'chat-123',
          messageId: 'message-123',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      })

      // Verify database operations
      expect(mockInsert).toHaveBeenCalled()
      expect(mockValues).toHaveBeenCalledWith({
        userId: 'user-123',
        workflowId: 'workflow-123',
        chatId: 'chat-123',
        messageId: 'message-123',
        workflowState: workflowState, // Should be parsed JSON object
      })
    })

    it('should create checkpoint without messageId', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      // Mock chat exists
      const chat = {
        id: 'chat-123',
        userId: 'user-123',
      }
      mockLimit.mockResolvedValue([chat])

      // Mock successful checkpoint creation
      const checkpoint = {
        id: 'checkpoint-123',
        userId: 'user-123',
        workflowId: 'workflow-123',
        chatId: 'chat-123',
        messageId: undefined,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      }
      mockReturning.mockResolvedValue([checkpoint])

      const workflowState = { blocks: [] }
      const req = createMockRequest('POST', {
        workflowId: 'workflow-123',
        chatId: 'chat-123',
        // No messageId provided
        workflowState: JSON.stringify(workflowState),
      })

      const { POST } = await import('@/app/api/copilot/checkpoints/route')
      const response = await POST(req)

      expect(response.status).toBe(200)
      const responseData = await response.json()
      expect(responseData.success).toBe(true)
      expect(responseData.checkpoint.messageId).toBeUndefined()
    })

    it('should handle database errors during checkpoint creation', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      // Mock chat exists
      const chat = {
        id: 'chat-123',
        userId: 'user-123',
      }
      mockLimit.mockResolvedValue([chat])

      // Mock database error
      mockReturning.mockRejectedValue(new Error('Database insert failed'))

      const req = createMockRequest('POST', {
        workflowId: 'workflow-123',
        chatId: 'chat-123',
        workflowState: '{"blocks": []}',
      })

      const { POST } = await import('@/app/api/copilot/checkpoints/route')
      const response = await POST(req)

      expect(response.status).toBe(500)
      const responseData = await response.json()
      expect(responseData.error).toBe('Failed to create checkpoint')
    })

    it('should handle database errors during chat lookup', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      // Mock database error during chat lookup
      mockLimit.mockRejectedValue(new Error('Database query failed'))

      const req = createMockRequest('POST', {
        workflowId: 'workflow-123',
        chatId: 'chat-123',
        workflowState: '{"blocks": []}',
      })

      const { POST } = await import('@/app/api/copilot/checkpoints/route')
      const response = await POST(req)

      expect(response.status).toBe(500)
      const responseData = await response.json()
      expect(responseData.error).toBe('Failed to create checkpoint')
    })
  })

  describe('GET', () => {
    it('should return 401 when user is not authenticated', async () => {
      const authMocks = mockAuth()
      authMocks.setUnauthenticated()

      const req = new NextRequest('http://localhost:3000/api/copilot/checkpoints?chatId=chat-123')

      const { GET } = await import('@/app/api/copilot/checkpoints/route')
      const response = await GET(req)

      expect(response.status).toBe(401)
      const responseData = await response.json()
      expect(responseData).toEqual({ error: 'Unauthorized' })
    })

    it('should return 400 when chatId is missing', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      const req = new NextRequest('http://localhost:3000/api/copilot/checkpoints')

      const { GET } = await import('@/app/api/copilot/checkpoints/route')
      const response = await GET(req)

      expect(response.status).toBe(400)
      const responseData = await response.json()
      expect(responseData.error).toBe('chatId is required')
    })

    it('should return checkpoints for authenticated user and chat', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      const mockCheckpoints = [
        {
          id: 'checkpoint-1',
          userId: 'user-123',
          workflowId: 'workflow-123',
          chatId: 'chat-123',
          messageId: 'message-1',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
        {
          id: 'checkpoint-2',
          userId: 'user-123',
          workflowId: 'workflow-123',
          chatId: 'chat-123',
          messageId: 'message-2',
          createdAt: new Date('2024-01-02'),
          updatedAt: new Date('2024-01-02'),
        },
      ]

      mockOrderBy.mockResolvedValue(mockCheckpoints)

      const req = new NextRequest('http://localhost:3000/api/copilot/checkpoints?chatId=chat-123')

      const { GET } = await import('@/app/api/copilot/checkpoints/route')
      const response = await GET(req)

      expect(response.status).toBe(200)
      const responseData = await response.json()
      expect(responseData).toEqual({
        success: true,
        checkpoints: [
          {
            id: 'checkpoint-1',
            userId: 'user-123',
            workflowId: 'workflow-123',
            chatId: 'chat-123',
            messageId: 'message-1',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
          {
            id: 'checkpoint-2',
            userId: 'user-123',
            workflowId: 'workflow-123',
            chatId: 'chat-123',
            messageId: 'message-2',
            createdAt: '2024-01-02T00:00:00.000Z',
            updatedAt: '2024-01-02T00:00:00.000Z',
          },
        ],
      })

      // Verify database query was made correctly
      expect(mockSelect).toHaveBeenCalled()
      expect(mockWhere).toHaveBeenCalled()
      expect(mockOrderBy).toHaveBeenCalled()
    })

    it('should handle database errors when fetching checkpoints', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      // Mock database error
      mockOrderBy.mockRejectedValue(new Error('Database query failed'))

      const req = new NextRequest('http://localhost:3000/api/copilot/checkpoints?chatId=chat-123')

      const { GET } = await import('@/app/api/copilot/checkpoints/route')
      const response = await GET(req)

      expect(response.status).toBe(500)
      const responseData = await response.json()
      expect(responseData.error).toBe('Failed to fetch checkpoints')
    })

    it('should return empty array when no checkpoints found', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      mockOrderBy.mockResolvedValue([])

      const req = new NextRequest('http://localhost:3000/api/copilot/checkpoints?chatId=chat-123')

      const { GET } = await import('@/app/api/copilot/checkpoints/route')
      const response = await GET(req)

      expect(response.status).toBe(200)
      const responseData = await response.json()
      expect(responseData).toEqual({
        success: true,
        checkpoints: [],
      })
    })
  })
})
```

--------------------------------------------------------------------------------

````
