---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 270
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 270 of 933)

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
Location: sim-main/apps/sim/app/api/copilot/checkpoints/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import { copilotChats, workflowCheckpoints } from '@sim/db/schema'
import { and, desc, eq } from 'drizzle-orm'
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

const logger = createLogger('WorkflowCheckpointsAPI')

const CreateCheckpointSchema = z.object({
  workflowId: z.string(),
  chatId: z.string(),
  messageId: z.string().optional(), // ID of the user message that triggered this checkpoint
  workflowState: z.string(), // JSON stringified workflow state
})

/**
 * POST /api/copilot/checkpoints
 * Create a new checkpoint with JSON workflow state
 */
export async function POST(req: NextRequest) {
  const tracker = createRequestTracker()

  try {
    const { userId, isAuthenticated } = await authenticateCopilotRequestSessionOnly()
    if (!isAuthenticated || !userId) {
      return createUnauthorizedResponse()
    }

    const body = await req.json()
    const { workflowId, chatId, messageId, workflowState } = CreateCheckpointSchema.parse(body)

    logger.info(`[${tracker.requestId}] Creating workflow checkpoint`, {
      userId,
      workflowId,
      chatId,
      messageId,
      fullRequestBody: body,
      parsedData: { workflowId, chatId, messageId },
      messageIdType: typeof messageId,
      messageIdExists: !!messageId,
    })

    // Verify that the chat belongs to the user
    const [chat] = await db
      .select()
      .from(copilotChats)
      .where(and(eq(copilotChats.id, chatId), eq(copilotChats.userId, userId)))
      .limit(1)

    if (!chat) {
      return createBadRequestResponse('Chat not found or unauthorized')
    }

    // Parse the workflow state to validate it's valid JSON
    let parsedWorkflowState
    try {
      parsedWorkflowState = JSON.parse(workflowState)
    } catch (error) {
      return createBadRequestResponse('Invalid workflow state JSON')
    }

    // Create checkpoint with JSON workflow state
    const [checkpoint] = await db
      .insert(workflowCheckpoints)
      .values({
        userId,
        workflowId,
        chatId,
        messageId,
        workflowState: parsedWorkflowState, // Store as JSON object
      })
      .returning()

    logger.info(`[${tracker.requestId}] Workflow checkpoint created successfully`, {
      checkpointId: checkpoint.id,
      savedData: {
        checkpointId: checkpoint.id,
        userId: checkpoint.userId,
        workflowId: checkpoint.workflowId,
        chatId: checkpoint.chatId,
        messageId: checkpoint.messageId,
        createdAt: checkpoint.createdAt,
      },
    })

    return NextResponse.json({
      success: true,
      checkpoint: {
        id: checkpoint.id,
        userId: checkpoint.userId,
        workflowId: checkpoint.workflowId,
        chatId: checkpoint.chatId,
        messageId: checkpoint.messageId,
        createdAt: checkpoint.createdAt,
        updatedAt: checkpoint.updatedAt,
      },
    })
  } catch (error) {
    logger.error(`[${tracker.requestId}] Failed to create workflow checkpoint:`, error)
    return createInternalServerErrorResponse('Failed to create checkpoint')
  }
}

/**
 * GET /api/copilot/checkpoints?chatId=xxx
 * Retrieve workflow checkpoints for a chat
 */
export async function GET(req: NextRequest) {
  const tracker = createRequestTracker()

  try {
    const { userId, isAuthenticated } = await authenticateCopilotRequestSessionOnly()
    if (!isAuthenticated || !userId) {
      return createUnauthorizedResponse()
    }

    const { searchParams } = new URL(req.url)
    const chatId = searchParams.get('chatId')

    if (!chatId) {
      return createBadRequestResponse('chatId is required')
    }

    logger.info(`[${tracker.requestId}] Fetching workflow checkpoints for chat`, {
      userId,
      chatId,
    })

    // Fetch checkpoints for this user and chat
    const checkpoints = await db
      .select({
        id: workflowCheckpoints.id,
        userId: workflowCheckpoints.userId,
        workflowId: workflowCheckpoints.workflowId,
        chatId: workflowCheckpoints.chatId,
        messageId: workflowCheckpoints.messageId,
        createdAt: workflowCheckpoints.createdAt,
        updatedAt: workflowCheckpoints.updatedAt,
      })
      .from(workflowCheckpoints)
      .where(and(eq(workflowCheckpoints.chatId, chatId), eq(workflowCheckpoints.userId, userId)))
      .orderBy(desc(workflowCheckpoints.createdAt))

    logger.info(`[${tracker.requestId}] Retrieved ${checkpoints.length} workflow checkpoints`)

    return NextResponse.json({
      success: true,
      checkpoints,
    })
  } catch (error) {
    logger.error(`[${tracker.requestId}] Failed to fetch workflow checkpoints:`, error)
    return createInternalServerErrorResponse('Failed to fetch checkpoints')
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.test.ts]---
Location: sim-main/apps/sim/app/api/copilot/checkpoints/revert/route.test.ts
Signals: Next.js

```typescript
/**
 * Tests for copilot checkpoints revert API route
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

describe('Copilot Checkpoints Revert API Route', () => {
  const mockSelect = vi.fn()
  const mockFrom = vi.fn()
  const mockWhere = vi.fn()
  const mockThen = vi.fn()

  beforeEach(() => {
    vi.resetModules()
    setupCommonApiMocks()
    mockCryptoUuid()

    // Mock getBaseUrl to return localhost for tests
    vi.doMock('@/lib/core/utils/urls', () => ({
      getBaseUrl: vi.fn(() => 'http://localhost:3000'),
      getBaseDomain: vi.fn(() => 'localhost:3000'),
      getEmailDomain: vi.fn(() => 'localhost:3000'),
    }))

    mockSelect.mockReturnValue({ from: mockFrom })
    mockFrom.mockReturnValue({ where: mockWhere })
    mockWhere.mockReturnValue({ then: mockThen })
    mockThen.mockResolvedValue(null) // Default: no data found

    vi.doMock('@sim/db', () => ({
      db: {
        select: mockSelect,
      },
    }))

    vi.doMock('@sim/db/schema', () => ({
      workflowCheckpoints: {
        id: 'id',
        userId: 'userId',
        workflowId: 'workflowId',
        workflowState: 'workflowState',
      },
      workflow: {
        id: 'id',
        userId: 'userId',
      },
    }))

    vi.doMock('drizzle-orm', () => ({
      and: vi.fn((...conditions) => ({ conditions, type: 'and' })),
      eq: vi.fn((field, value) => ({ field, value, type: 'eq' })),
    }))

    global.fetch = vi.fn()

    vi.spyOn(Date, 'now').mockReturnValue(1640995200000)

    const originalDate = Date
    vi.spyOn(global, 'Date').mockImplementation(((...args: any[]) => {
      if (args.length === 0) {
        const mockDate = new originalDate('2024-01-01T00:00:00.000Z')
        return mockDate
      }
      if (args.length === 1) {
        return new originalDate(args[0])
      }
      return new originalDate(args[0], args[1], args[2], args[3], args[4], args[5], args[6])
    }) as any)
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
        checkpointId: 'checkpoint-123',
      })

      const { POST } = await import('@/app/api/copilot/checkpoints/revert/route')
      const response = await POST(req)

      expect(response.status).toBe(401)
      const responseData = await response.json()
      expect(responseData).toEqual({ error: 'Unauthorized' })
    })

    it('should return 500 for invalid request body - missing checkpointId', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      const req = createMockRequest('POST', {
        // Missing checkpointId
      })

      const { POST } = await import('@/app/api/copilot/checkpoints/revert/route')
      const response = await POST(req)

      expect(response.status).toBe(500)
      const responseData = await response.json()
      expect(responseData.error).toBe('Failed to revert to checkpoint')
    })

    it('should return 500 for empty checkpointId', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      const req = createMockRequest('POST', {
        checkpointId: '',
      })

      const { POST } = await import('@/app/api/copilot/checkpoints/revert/route')
      const response = await POST(req)

      expect(response.status).toBe(500)
      const responseData = await response.json()
      expect(responseData.error).toBe('Failed to revert to checkpoint')
    })

    it('should return 404 when checkpoint is not found', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      // Mock checkpoint not found
      mockThen.mockResolvedValueOnce(undefined)

      const req = createMockRequest('POST', {
        checkpointId: 'non-existent-checkpoint',
      })

      const { POST } = await import('@/app/api/copilot/checkpoints/revert/route')
      const response = await POST(req)

      expect(response.status).toBe(404)
      const responseData = await response.json()
      expect(responseData.error).toBe('Checkpoint not found or access denied')
    })

    it('should return 404 when checkpoint belongs to different user', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      // Mock checkpoint not found (due to user mismatch in query)
      mockThen.mockResolvedValueOnce(undefined)

      const req = createMockRequest('POST', {
        checkpointId: 'other-user-checkpoint',
      })

      const { POST } = await import('@/app/api/copilot/checkpoints/revert/route')
      const response = await POST(req)

      expect(response.status).toBe(404)
      const responseData = await response.json()
      expect(responseData.error).toBe('Checkpoint not found or access denied')
    })

    it('should return 404 when workflow is not found', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      // Mock checkpoint found but workflow not found
      const mockCheckpoint = {
        id: 'checkpoint-123',
        workflowId: 'a1b2c3d4-e5f6-4a78-b9c0-d1e2f3a4b5c6',
        userId: 'user-123',
        workflowState: { blocks: {}, edges: [] },
      }

      mockThen
        .mockResolvedValueOnce(mockCheckpoint) // Checkpoint found
        .mockResolvedValueOnce(undefined) // Workflow not found

      const req = createMockRequest('POST', {
        checkpointId: 'checkpoint-123',
      })

      const { POST } = await import('@/app/api/copilot/checkpoints/revert/route')
      const response = await POST(req)

      expect(response.status).toBe(404)
      const responseData = await response.json()
      expect(responseData.error).toBe('Workflow not found')
    })

    it('should return 401 when workflow belongs to different user', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      // Mock checkpoint found but workflow belongs to different user
      const mockCheckpoint = {
        id: 'checkpoint-123',
        workflowId: 'b2c3d4e5-f6a7-4b89-a0d1-e2f3a4b5c6d7',
        userId: 'user-123',
        workflowState: { blocks: {}, edges: [] },
      }

      const mockWorkflow = {
        id: 'b2c3d4e5-f6a7-4b89-a0d1-e2f3a4b5c6d7',
        userId: 'different-user',
      }

      mockThen
        .mockResolvedValueOnce(mockCheckpoint) // Checkpoint found
        .mockResolvedValueOnce(mockWorkflow) // Workflow found but different user

      const req = createMockRequest('POST', {
        checkpointId: 'checkpoint-123',
      })

      const { POST } = await import('@/app/api/copilot/checkpoints/revert/route')
      const response = await POST(req)

      expect(response.status).toBe(401)
      const responseData = await response.json()
      expect(responseData).toEqual({ error: 'Unauthorized' })
    })

    it('should successfully revert checkpoint with basic workflow state', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      const mockCheckpoint = {
        id: 'checkpoint-123',
        workflowId: 'c3d4e5f6-a7b8-4c09-a1e2-f3a4b5c6d7e8',
        userId: 'user-123',
        workflowState: {
          blocks: { block1: { type: 'start' } },
          edges: [{ from: 'block1', to: 'block2' }],
          loops: {},
          parallels: {},
          isDeployed: true,
          deploymentStatuses: { production: 'deployed' },
        },
      }

      const mockWorkflow = {
        id: 'c3d4e5f6-a7b8-4c09-a1e2-f3a4b5c6d7e8',
        userId: 'user-123',
      }

      mockThen
        .mockResolvedValueOnce(mockCheckpoint) // Checkpoint found
        .mockResolvedValueOnce(mockWorkflow) // Workflow found

      // Mock successful state API call

      ;(global.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })

      const req = new NextRequest('http://localhost:3000/api/copilot/checkpoints/revert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: 'session=test-session',
        },
        body: JSON.stringify({
          checkpointId: 'checkpoint-123',
        }),
      })

      const { POST } = await import('@/app/api/copilot/checkpoints/revert/route')
      const response = await POST(req)

      expect(response.status).toBe(200)
      const responseData = await response.json()
      expect(responseData).toEqual({
        success: true,
        workflowId: 'c3d4e5f6-a7b8-4c09-a1e2-f3a4b5c6d7e8',
        checkpointId: 'checkpoint-123',
        revertedAt: '2024-01-01T00:00:00.000Z',
        checkpoint: {
          id: 'checkpoint-123',
          workflowState: {
            blocks: { block1: { type: 'start' } },
            edges: [{ from: 'block1', to: 'block2' }],
            loops: {},
            parallels: {},
            isDeployed: true,
            deploymentStatuses: { production: 'deployed' },
            lastSaved: 1640995200000,
          },
        },
      })

      // Verify fetch was called with correct parameters
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/workflows/c3d4e5f6-a7b8-4c09-a1e2-f3a4b5c6d7e8/state',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Cookie: 'session=test-session',
          },
          body: JSON.stringify({
            blocks: { block1: { type: 'start' } },
            edges: [{ from: 'block1', to: 'block2' }],
            loops: {},
            parallels: {},
            isDeployed: true,
            deploymentStatuses: { production: 'deployed' },
            lastSaved: 1640995200000,
          }),
        }
      )
    })

    it('should handle checkpoint state with valid deployedAt date', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      const mockCheckpoint = {
        id: 'checkpoint-with-date',
        workflowId: 'd4e5f6a7-b8c9-4d10-a2e3-a4b5c6d7e8f9',
        userId: 'user-123',
        workflowState: {
          blocks: {},
          edges: [],
          deployedAt: '2024-01-01T12:00:00.000Z',
          isDeployed: true,
        },
      }

      const mockWorkflow = {
        id: 'd4e5f6a7-b8c9-4d10-a2e3-a4b5c6d7e8f9',
        userId: 'user-123',
      }

      mockThen.mockResolvedValueOnce(mockCheckpoint).mockResolvedValueOnce(mockWorkflow)

      ;(global.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })

      const req = createMockRequest('POST', {
        checkpointId: 'checkpoint-with-date',
      })

      const { POST } = await import('@/app/api/copilot/checkpoints/revert/route')
      const response = await POST(req)

      expect(response.status).toBe(200)
      const responseData = await response.json()
      expect(responseData.checkpoint.workflowState.deployedAt).toBeDefined()
      expect(responseData.checkpoint.workflowState.deployedAt).toEqual('2024-01-01T12:00:00.000Z')
    })

    it('should handle checkpoint state with invalid deployedAt date', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      const mockCheckpoint = {
        id: 'checkpoint-invalid-date',
        workflowId: 'e5f6a7b8-c9d0-4e11-a3f4-b5c6d7e8f9a0',
        userId: 'user-123',
        workflowState: {
          blocks: {},
          edges: [],
          deployedAt: 'invalid-date',
          isDeployed: true,
        },
      }

      const mockWorkflow = {
        id: 'e5f6a7b8-c9d0-4e11-a3f4-b5c6d7e8f9a0',
        userId: 'user-123',
      }

      mockThen.mockResolvedValueOnce(mockCheckpoint).mockResolvedValueOnce(mockWorkflow)

      ;(global.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })

      const req = createMockRequest('POST', {
        checkpointId: 'checkpoint-invalid-date',
      })

      const { POST } = await import('@/app/api/copilot/checkpoints/revert/route')
      const response = await POST(req)

      expect(response.status).toBe(200)
      const responseData = await response.json()
      // Invalid date should be filtered out
      expect(responseData.checkpoint.workflowState.deployedAt).toBeUndefined()
    })

    it('should handle checkpoint state with null/undefined values', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      const mockCheckpoint = {
        id: 'checkpoint-null-values',
        workflowId: 'f6a7b8c9-d0e1-4f23-a4b5-c6d7e8f9a0b1',
        userId: 'user-123',
        workflowState: {
          blocks: null,
          edges: undefined,
          loops: null,
          parallels: undefined,
          deploymentStatuses: null,
        },
      }

      const mockWorkflow = {
        id: 'f6a7b8c9-d0e1-4f23-a4b5-c6d7e8f9a0b1',
        userId: 'user-123',
      }

      mockThen.mockResolvedValueOnce(mockCheckpoint).mockResolvedValueOnce(mockWorkflow)

      ;(global.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })

      const req = createMockRequest('POST', {
        checkpointId: 'checkpoint-null-values',
      })

      const { POST } = await import('@/app/api/copilot/checkpoints/revert/route')
      const response = await POST(req)

      expect(response.status).toBe(200)
      const responseData = await response.json()

      // Null/undefined values should be replaced with defaults
      expect(responseData.checkpoint.workflowState).toEqual({
        blocks: {},
        edges: [],
        loops: {},
        parallels: {},
        isDeployed: false,
        deploymentStatuses: {},
        lastSaved: 1640995200000,
      })
    })

    it('should return 500 when state API call fails', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      const mockCheckpoint = {
        id: 'checkpoint-123',
        workflowId: 'a7b8c9d0-e1f2-4a34-b5c6-d7e8f9a0b1c2',
        userId: 'user-123',
        workflowState: { blocks: {}, edges: [] },
      }

      const mockWorkflow = {
        id: 'a7b8c9d0-e1f2-4a34-b5c6-d7e8f9a0b1c2',
        userId: 'user-123',
      }

      mockThen
        .mockResolvedValueOnce(mockCheckpoint)
        .mockResolvedValueOnce(mockWorkflow)

      // Mock failed state API call

      ;(global.fetch as any).mockResolvedValue({
        ok: false,
        text: () => Promise.resolve('State validation failed'),
      })

      const req = createMockRequest('POST', {
        checkpointId: 'checkpoint-123',
      })

      const { POST } = await import('@/app/api/copilot/checkpoints/revert/route')
      const response = await POST(req)

      expect(response.status).toBe(500)
      const responseData = await response.json()
      expect(responseData.error).toBe('Failed to revert workflow to checkpoint')
    })

    it('should handle database errors during checkpoint lookup', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      // Mock database error
      mockThen.mockRejectedValueOnce(new Error('Database connection failed'))

      const req = createMockRequest('POST', {
        checkpointId: 'checkpoint-123',
      })

      const { POST } = await import('@/app/api/copilot/checkpoints/revert/route')
      const response = await POST(req)

      expect(response.status).toBe(500)
      const responseData = await response.json()
      expect(responseData.error).toBe('Failed to revert to checkpoint')
    })

    it('should handle database errors during workflow lookup', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      const mockCheckpoint = {
        id: 'checkpoint-123',
        workflowId: 'b8c9d0e1-f2a3-4b45-a6d7-e8f9a0b1c2d3',
        userId: 'user-123',
        workflowState: { blocks: {}, edges: [] },
      }

      mockThen
        .mockResolvedValueOnce(mockCheckpoint) // Checkpoint found
        .mockRejectedValueOnce(new Error('Database error during workflow lookup')) // Workflow lookup fails

      const req = createMockRequest('POST', {
        checkpointId: 'checkpoint-123',
      })

      const { POST } = await import('@/app/api/copilot/checkpoints/revert/route')
      const response = await POST(req)

      expect(response.status).toBe(500)
      const responseData = await response.json()
      expect(responseData.error).toBe('Failed to revert to checkpoint')
    })

    it('should handle fetch network errors', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      const mockCheckpoint = {
        id: 'checkpoint-123',
        workflowId: 'c9d0e1f2-a3b4-4c56-a7e8-f9a0b1c2d3e4',
        userId: 'user-123',
        workflowState: { blocks: {}, edges: [] },
      }

      const mockWorkflow = {
        id: 'c9d0e1f2-a3b4-4c56-a7e8-f9a0b1c2d3e4',
        userId: 'user-123',
      }

      mockThen
        .mockResolvedValueOnce(mockCheckpoint)
        .mockResolvedValueOnce(mockWorkflow)

      // Mock fetch network error

      ;(global.fetch as any).mockRejectedValue(new Error('Network error'))

      const req = createMockRequest('POST', {
        checkpointId: 'checkpoint-123',
      })

      const { POST } = await import('@/app/api/copilot/checkpoints/revert/route')
      const response = await POST(req)

      expect(response.status).toBe(500)
      const responseData = await response.json()
      expect(responseData.error).toBe('Failed to revert to checkpoint')
    })

    it('should handle JSON parsing errors in request body', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      // Create a request with invalid JSON
      const req = new NextRequest('http://localhost:3000/api/copilot/checkpoints/revert', {
        method: 'POST',
        body: '{invalid-json',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const { POST } = await import('@/app/api/copilot/checkpoints/revert/route')
      const response = await POST(req)

      expect(response.status).toBe(500)
      const responseData = await response.json()
      expect(responseData.error).toBe('Failed to revert to checkpoint')
    })

    it('should forward cookies to state API call', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      const mockCheckpoint = {
        id: 'checkpoint-123',
        workflowId: 'd0e1f2a3-b4c5-4d67-a8f9-a0b1c2d3e4f5',
        userId: 'user-123',
        workflowState: { blocks: {}, edges: [] },
      }

      const mockWorkflow = {
        id: 'd0e1f2a3-b4c5-4d67-a8f9-a0b1c2d3e4f5',
        userId: 'user-123',
      }

      mockThen.mockResolvedValueOnce(mockCheckpoint).mockResolvedValueOnce(mockWorkflow)

      ;(global.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })

      const req = new NextRequest('http://localhost:3000/api/copilot/checkpoints/revert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: 'session=test-session; auth=token123',
        },
        body: JSON.stringify({
          checkpointId: 'checkpoint-123',
        }),
      })

      const { POST } = await import('@/app/api/copilot/checkpoints/revert/route')
      await POST(req)

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/workflows/d0e1f2a3-b4c5-4d67-a8f9-a0b1c2d3e4f5/state',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Cookie: 'session=test-session; auth=token123',
          },
          body: expect.any(String),
        }
      )
    })

    it('should handle missing cookies gracefully', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      const mockCheckpoint = {
        id: 'checkpoint-123',
        workflowId: 'e1f2a3b4-c5d6-4e78-a9a0-b1c2d3e4f5a6',
        userId: 'user-123',
        workflowState: { blocks: {}, edges: [] },
      }

      const mockWorkflow = {
        id: 'e1f2a3b4-c5d6-4e78-a9a0-b1c2d3e4f5a6',
        userId: 'user-123',
      }

      mockThen.mockResolvedValueOnce(mockCheckpoint).mockResolvedValueOnce(mockWorkflow)

      ;(global.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })

      const req = new NextRequest('http://localhost:3000/api/copilot/checkpoints/revert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // No Cookie header
        },
        body: JSON.stringify({
          checkpointId: 'checkpoint-123',
        }),
      })

      const { POST } = await import('@/app/api/copilot/checkpoints/revert/route')
      const response = await POST(req)

      expect(response.status).toBe(200)
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/workflows/e1f2a3b4-c5d6-4e78-a9a0-b1c2d3e4f5a6/state',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Cookie: '', // Empty string when no cookies
          },
          body: expect.any(String),
        }
      )
    })

    it('should handle complex checkpoint state with all fields', async () => {
      const authMocks = mockAuth()
      authMocks.setAuthenticated()

      const mockCheckpoint = {
        id: 'checkpoint-complex',
        workflowId: 'f2a3b4c5-d6e7-4f89-a0b1-c2d3e4f5a6b7',
        userId: 'user-123',
        workflowState: {
          blocks: {
            start: { type: 'start', config: {} },
            http: { type: 'http', config: { url: 'https://api.example.com' } },
            end: { type: 'end', config: {} },
          },
          edges: [
            { from: 'start', to: 'http' },
            { from: 'http', to: 'end' },
          ],
          loops: {
            loop1: { condition: 'true', iterations: 3 },
          },
          parallels: {
            parallel1: { branches: ['branch1', 'branch2'] },
          },
          isDeployed: true,
          deploymentStatuses: {
            production: 'deployed',
            staging: 'pending',
          },
          deployedAt: '2024-01-01T10:00:00.000Z',
        },
      }

      const mockWorkflow = {
        id: 'f2a3b4c5-d6e7-4f89-a0b1-c2d3e4f5a6b7',
        userId: 'user-123',
      }

      mockThen.mockResolvedValueOnce(mockCheckpoint).mockResolvedValueOnce(mockWorkflow)

      ;(global.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })

      const req = createMockRequest('POST', {
        checkpointId: 'checkpoint-complex',
      })

      const { POST } = await import('@/app/api/copilot/checkpoints/revert/route')
      const response = await POST(req)

      expect(response.status).toBe(200)
      const responseData = await response.json()
      expect(responseData.checkpoint.workflowState).toEqual({
        blocks: {
          start: { type: 'start', config: {} },
          http: { type: 'http', config: { url: 'https://api.example.com' } },
          end: { type: 'end', config: {} },
        },
        edges: [
          { from: 'start', to: 'http' },
          { from: 'http', to: 'end' },
        ],
        loops: {
          loop1: { condition: 'true', iterations: 3 },
        },
        parallels: {
          parallel1: { branches: ['branch1', 'branch2'] },
        },
        isDeployed: true,
        deploymentStatuses: {
          production: 'deployed',
          staging: 'pending',
        },
        deployedAt: '2024-01-01T10:00:00.000Z',
        lastSaved: 1640995200000,
      })
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/copilot/checkpoints/revert/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import { workflowCheckpoints, workflow as workflowTable } from '@sim/db/schema'
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
import { validateUUID } from '@/lib/core/security/input-validation'
import { getBaseUrl } from '@/lib/core/utils/urls'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('CheckpointRevertAPI')

const RevertCheckpointSchema = z.object({
  checkpointId: z.string().min(1),
})

/**
 * POST /api/copilot/checkpoints/revert
 * Revert workflow to a specific checkpoint state
 */
export async function POST(request: NextRequest) {
  const tracker = createRequestTracker()

  try {
    const { userId, isAuthenticated } = await authenticateCopilotRequestSessionOnly()
    if (!isAuthenticated || !userId) {
      return createUnauthorizedResponse()
    }

    const body = await request.json()
    const { checkpointId } = RevertCheckpointSchema.parse(body)

    logger.info(`[${tracker.requestId}] Reverting to checkpoint ${checkpointId}`)

    const checkpoint = await db
      .select()
      .from(workflowCheckpoints)
      .where(and(eq(workflowCheckpoints.id, checkpointId), eq(workflowCheckpoints.userId, userId)))
      .then((rows) => rows[0])

    if (!checkpoint) {
      return createNotFoundResponse('Checkpoint not found or access denied')
    }

    const workflowData = await db
      .select()
      .from(workflowTable)
      .where(eq(workflowTable.id, checkpoint.workflowId))
      .then((rows) => rows[0])

    if (!workflowData) {
      return createNotFoundResponse('Workflow not found')
    }

    if (workflowData.userId !== userId) {
      return createUnauthorizedResponse()
    }

    const checkpointState = checkpoint.workflowState as any // Cast to any for property access

    const cleanedState = {
      blocks: checkpointState?.blocks || {},
      edges: checkpointState?.edges || [],
      loops: checkpointState?.loops || {},
      parallels: checkpointState?.parallels || {},
      isDeployed: checkpointState?.isDeployed || false,
      deploymentStatuses: checkpointState?.deploymentStatuses || {},
      lastSaved: Date.now(),
      ...(checkpointState?.deployedAt &&
      checkpointState.deployedAt !== null &&
      checkpointState.deployedAt !== undefined &&
      !Number.isNaN(new Date(checkpointState.deployedAt).getTime())
        ? { deployedAt: new Date(checkpointState.deployedAt) }
        : {}),
    }

    logger.info(`[${tracker.requestId}] Applying cleaned checkpoint state`, {
      blocksCount: Object.keys(cleanedState.blocks).length,
      edgesCount: cleanedState.edges.length,
      hasDeployedAt: !!cleanedState.deployedAt,
      isDeployed: cleanedState.isDeployed,
    })

    const workflowIdValidation = validateUUID(checkpoint.workflowId, 'workflowId')
    if (!workflowIdValidation.isValid) {
      logger.error(`[${tracker.requestId}] Invalid workflow ID: ${workflowIdValidation.error}`)
      return NextResponse.json({ error: 'Invalid workflow ID format' }, { status: 400 })
    }

    const stateResponse = await fetch(
      `${getBaseUrl()}/api/workflows/${checkpoint.workflowId}/state`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Cookie: request.headers.get('Cookie') || '',
        },
        body: JSON.stringify(cleanedState),
      }
    )

    if (!stateResponse.ok) {
      const errorData = await stateResponse.text()
      logger.error(`[${tracker.requestId}] Failed to apply checkpoint state: ${errorData}`)
      return NextResponse.json(
        { error: 'Failed to revert workflow to checkpoint' },
        { status: 500 }
      )
    }

    const result = await stateResponse.json()
    logger.info(
      `[${tracker.requestId}] Successfully reverted workflow ${checkpoint.workflowId} to checkpoint ${checkpointId}`
    )

    // Delete the checkpoint after successfully reverting to it
    try {
      await db.delete(workflowCheckpoints).where(eq(workflowCheckpoints.id, checkpointId))
      logger.info(`[${tracker.requestId}] Deleted checkpoint after reverting`, { checkpointId })
    } catch (deleteError) {
      logger.warn(`[${tracker.requestId}] Failed to delete checkpoint after revert`, {
        checkpointId,
        error: deleteError,
      })
      // Don't fail the request if deletion fails - the revert was successful
    }

    return NextResponse.json({
      success: true,
      workflowId: checkpoint.workflowId,
      checkpointId,
      revertedAt: new Date().toISOString(),
      checkpoint: {
        id: checkpoint.id,
        workflowState: cleanedState,
      },
    })
  } catch (error) {
    logger.error(`[${tracker.requestId}] Error reverting to checkpoint:`, error)
    return createInternalServerErrorResponse('Failed to revert to checkpoint')
  }
}
```

--------------------------------------------------------------------------------

````
