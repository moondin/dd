---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 302
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 302 of 933)

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
Location: sim-main/apps/sim/app/api/tools/custom/route.test.ts
Signals: Next.js

```typescript
import { NextRequest } from 'next/server'
/**
 * Tests for custom tools API routes
 *
 * @vitest-environment node
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMockRequest } from '@/app/api/__test-utils__/utils'

describe('Custom Tools API Routes', () => {
  // Sample data for testing
  const sampleTools = [
    {
      id: 'tool-1',
      workspaceId: 'workspace-123',
      userId: 'user-123',
      title: 'Weather Tool',
      schema: {
        type: 'function',
        function: {
          name: 'getWeather',
          description: 'Get weather information for a location',
          parameters: {
            type: 'object',
            properties: {
              location: {
                type: 'string',
                description: 'The city and state, e.g. San Francisco, CA',
              },
            },
            required: ['location'],
          },
        },
      },
      code: 'return { temperature: 72, conditions: "sunny" };',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z',
    },
    {
      id: 'tool-2',
      workspaceId: 'workspace-123',
      userId: 'user-123',
      title: 'Calculator Tool',
      schema: {
        type: 'function',
        function: {
          name: 'calculator',
          description: 'Perform basic calculations',
          parameters: {
            type: 'object',
            properties: {
              operation: {
                type: 'string',
                description: 'The operation to perform (add, subtract, multiply, divide)',
              },
              a: { type: 'number', description: 'First number' },
              b: { type: 'number', description: 'Second number' },
            },
            required: ['operation', 'a', 'b'],
          },
        },
      },
      code: 'const { operation, a, b } = params; if (operation === "add") return a + b;',
      createdAt: '2023-02-01T00:00:00.000Z',
      updatedAt: '2023-02-02T00:00:00.000Z',
    },
  ]

  // Mock implementation stubs
  const mockSelect = vi.fn()
  const mockFrom = vi.fn()
  const mockWhere = vi.fn()
  const mockOrderBy = vi.fn()
  const mockInsert = vi.fn()
  const mockValues = vi.fn()
  const mockUpdate = vi.fn()
  const mockSet = vi.fn()
  const mockDelete = vi.fn()
  const mockLimit = vi.fn()
  const mockSession = { user: { id: 'user-123' } }

  beforeEach(() => {
    vi.resetModules()

    // Reset all mock implementations
    mockSelect.mockReturnValue({ from: mockFrom })
    mockFrom.mockReturnValue({ where: mockWhere })
    // where() can be called with orderBy(), limit(), or directly awaited
    // Create a mock query builder that supports all patterns
    mockWhere.mockImplementation((condition) => {
      // Return an object that is both awaitable and has orderBy() and limit() methods
      const queryBuilder = {
        orderBy: mockOrderBy,
        limit: mockLimit,
        then: (resolve: (value: typeof sampleTools) => void) => {
          resolve(sampleTools)
          return queryBuilder
        },
        catch: (reject: (error: Error) => void) => queryBuilder,
      }
      return queryBuilder
    })
    mockOrderBy.mockImplementation(() => {
      // orderBy returns an awaitable query builder
      const queryBuilder = {
        limit: mockLimit,
        then: (resolve: (value: typeof sampleTools) => void) => {
          resolve(sampleTools)
          return queryBuilder
        },
        catch: (reject: (error: Error) => void) => queryBuilder,
      }
      return queryBuilder
    })
    mockLimit.mockResolvedValue(sampleTools)
    mockInsert.mockReturnValue({ values: mockValues })
    mockValues.mockResolvedValue({ id: 'new-tool-id' })
    mockUpdate.mockReturnValue({ set: mockSet })
    mockSet.mockReturnValue({ where: mockWhere })
    mockDelete.mockReturnValue({ where: mockWhere })

    // Mock database
    vi.doMock('@sim/db', () => ({
      db: {
        select: mockSelect,
        insert: mockInsert,
        update: mockUpdate,
        delete: mockDelete,
        transaction: vi.fn().mockImplementation(async (callback) => {
          // Execute the callback with a transaction object that has the same methods
          // Create transaction-specific mocks that follow the same pattern
          const txMockSelect = vi.fn().mockReturnValue({ from: mockFrom })
          const txMockInsert = vi.fn().mockReturnValue({ values: mockValues })
          const txMockUpdate = vi.fn().mockReturnValue({ set: mockSet })
          const txMockDelete = vi.fn().mockReturnValue({ where: mockWhere })

          // Transaction where() should also support the query builder pattern with orderBy
          const txMockOrderBy = vi.fn().mockImplementation(() => {
            const queryBuilder = {
              limit: mockLimit,
              then: (resolve: (value: typeof sampleTools) => void) => {
                resolve(sampleTools)
                return queryBuilder
              },
              catch: (reject: (error: Error) => void) => queryBuilder,
            }
            return queryBuilder
          })

          const txMockWhere = vi.fn().mockImplementation((condition) => {
            const queryBuilder = {
              orderBy: txMockOrderBy,
              limit: mockLimit,
              then: (resolve: (value: typeof sampleTools) => void) => {
                resolve(sampleTools)
                return queryBuilder
              },
              catch: (reject: (error: Error) => void) => queryBuilder,
            }
            return queryBuilder
          })

          // Update mockFrom to return txMockWhere for transaction queries
          const txMockFrom = vi.fn().mockReturnValue({ where: txMockWhere })
          txMockSelect.mockReturnValue({ from: txMockFrom })

          return await callback({
            select: txMockSelect,
            insert: txMockInsert,
            update: txMockUpdate,
            delete: txMockDelete,
          })
        }),
      },
    }))

    // Mock schema
    vi.doMock('@sim/db/schema', () => ({
      customTools: {
        id: 'id',
        workspaceId: 'workspaceId',
        userId: 'userId',
        title: 'title',
      },
      workflow: {
        id: 'id',
        workspaceId: 'workspaceId',
        userId: 'userId',
      },
    }))

    // Mock authentication
    vi.doMock('@/lib/auth', () => ({
      getSession: vi.fn().mockResolvedValue(mockSession),
    }))

    // Mock hybrid auth
    vi.doMock('@/lib/auth/hybrid', () => ({
      checkHybridAuth: vi.fn().mockResolvedValue({
        success: true,
        userId: 'user-123',
        authType: 'session',
      }),
    }))

    // Mock permissions
    vi.doMock('@/lib/workspaces/permissions/utils', () => ({
      getUserEntityPermissions: vi.fn().mockResolvedValue('admin'),
    }))

    // Mock logger
    vi.doMock('@/lib/logs/console/logger', () => ({
      createLogger: vi.fn().mockReturnValue({
        info: vi.fn(),
        error: vi.fn(),
        warn: vi.fn(),
        debug: vi.fn(),
      }),
    }))

    // Mock drizzle-orm functions
    vi.doMock('drizzle-orm', async () => {
      const actual = await vi.importActual('drizzle-orm')
      return {
        ...(actual as object),
        eq: vi.fn().mockImplementation((field, value) => ({ field, value, operator: 'eq' })),
        and: vi.fn().mockImplementation((...conditions) => ({ operator: 'and', conditions })),
        or: vi.fn().mockImplementation((...conditions) => ({ operator: 'or', conditions })),
        isNull: vi.fn().mockImplementation((field) => ({ field, operator: 'isNull' })),
        ne: vi.fn().mockImplementation((field, value) => ({ field, value, operator: 'ne' })),
        desc: vi.fn().mockImplementation((field) => ({ field, operator: 'desc' })),
      }
    })

    // Mock utils
    vi.doMock('@/lib/core/utils/request', () => ({
      generateRequestId: vi.fn().mockReturnValue('test-request-id'),
    }))

    // Mock custom tools operations
    vi.doMock('@/lib/workflows/custom-tools/operations', () => ({
      upsertCustomTools: vi.fn().mockResolvedValue(sampleTools),
    }))
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  /**
   * Test GET endpoint
   */
  describe('GET /api/tools/custom', () => {
    it('should return tools for authenticated user with workspaceId', async () => {
      // Create mock request with workspaceId
      const req = new NextRequest(
        'http://localhost:3000/api/tools/custom?workspaceId=workspace-123'
      )

      // Simulate DB returning tools with orderBy chain
      mockWhere.mockReturnValueOnce({
        orderBy: mockOrderBy.mockReturnValueOnce(Promise.resolve(sampleTools)),
      })

      // Import handler after mocks are set up
      const { GET } = await import('@/app/api/tools/custom/route')

      // Call the handler
      const response = await GET(req)
      const data = await response.json()

      // Verify response
      expect(response.status).toBe(200)
      expect(data).toHaveProperty('data')
      expect(data.data).toEqual(sampleTools)

      // Verify DB query
      expect(mockSelect).toHaveBeenCalled()
      expect(mockFrom).toHaveBeenCalled()
      expect(mockWhere).toHaveBeenCalled()
      expect(mockOrderBy).toHaveBeenCalled()
    })

    it('should handle unauthorized access', async () => {
      // Create mock request
      const req = new NextRequest(
        'http://localhost:3000/api/tools/custom?workspaceId=workspace-123'
      )

      // Mock hybrid auth to return unauthorized
      vi.doMock('@/lib/auth/hybrid', () => ({
        checkHybridAuth: vi.fn().mockResolvedValue({
          success: false,
          error: 'Unauthorized',
        }),
      }))

      // Import handler after mocks are set up
      const { GET } = await import('@/app/api/tools/custom/route')

      // Call the handler
      const response = await GET(req)
      const data = await response.json()

      // Verify response
      expect(response.status).toBe(401)
      expect(data).toHaveProperty('error', 'Unauthorized')
    })

    it('should handle workflowId parameter', async () => {
      // Create mock request with workflowId parameter
      const req = new NextRequest('http://localhost:3000/api/tools/custom?workflowId=workflow-123')

      // Mock workflow lookup to return workspaceId (for limit(1) call)
      mockLimit.mockResolvedValueOnce([{ workspaceId: 'workspace-123' }])

      // Mock the where() call for fetching tools (returns awaitable query builder)
      mockWhere.mockImplementationOnce((condition) => {
        const queryBuilder = {
          limit: mockLimit,
          then: (resolve: (value: typeof sampleTools) => void) => {
            resolve(sampleTools)
            return queryBuilder
          },
          catch: (reject: (error: Error) => void) => queryBuilder,
        }
        return queryBuilder
      })

      // Import handler after mocks are set up
      const { GET } = await import('@/app/api/tools/custom/route')

      // Call the handler
      const response = await GET(req)
      const data = await response.json()

      // Verify response
      expect(response.status).toBe(200)
      expect(data).toHaveProperty('data')

      // Verify DB query was called
      expect(mockWhere).toHaveBeenCalled()
    })
  })

  /**
   * Test POST endpoint
   */
  describe('POST /api/tools/custom', () => {
    it('should reject unauthorized requests', async () => {
      // Mock hybrid auth to return unauthorized
      vi.doMock('@/lib/auth/hybrid', () => ({
        checkHybridAuth: vi.fn().mockResolvedValue({
          success: false,
          error: 'Unauthorized',
        }),
      }))

      // Create mock request
      const req = createMockRequest('POST', { tools: [], workspaceId: 'workspace-123' })

      // Import handler after mocks are set up
      const { POST } = await import('@/app/api/tools/custom/route')

      // Call the handler
      const response = await POST(req)
      const data = await response.json()

      // Verify response
      expect(response.status).toBe(401)
      expect(data).toHaveProperty('error', 'Unauthorized')
    })

    it('should validate request data', async () => {
      // Create invalid tool data (missing required fields)
      const invalidTool = {
        // Missing title, schema
        code: 'return "invalid";',
      }

      // Create mock request with invalid tool and workspaceId
      const req = createMockRequest('POST', { tools: [invalidTool], workspaceId: 'workspace-123' })

      // Import handler after mocks are set up
      const { POST } = await import('@/app/api/tools/custom/route')

      // Call the handler
      const response = await POST(req)
      const data = await response.json()

      // Verify response
      expect(response.status).toBe(400)
      expect(data).toHaveProperty('error', 'Invalid request data')
      expect(data).toHaveProperty('details')
    })
  })

  /**
   * Test DELETE endpoint
   */
  describe('DELETE /api/tools/custom', () => {
    it('should delete a workspace-scoped tool by ID', async () => {
      // Mock finding existing workspace-scoped tool
      mockLimit.mockResolvedValueOnce([sampleTools[0]])

      // Create mock request with ID and workspaceId parameters
      const req = new NextRequest(
        'http://localhost:3000/api/tools/custom?id=tool-1&workspaceId=workspace-123'
      )

      // Import handler after mocks are set up
      const { DELETE } = await import('@/app/api/tools/custom/route')

      // Call the handler
      const response = await DELETE(req)
      const data = await response.json()

      // Verify response
      expect(response.status).toBe(200)
      expect(data).toHaveProperty('success', true)

      // Verify delete was called with correct parameters
      expect(mockDelete).toHaveBeenCalled()
      expect(mockWhere).toHaveBeenCalled()
    })

    it('should reject requests missing tool ID', async () => {
      // Create mock request without ID parameter
      const req = createMockRequest('DELETE')

      // Import handler after mocks are set up
      const { DELETE } = await import('@/app/api/tools/custom/route')

      // Call the handler
      const response = await DELETE(req)
      const data = await response.json()

      // Verify response
      expect(response.status).toBe(400)
      expect(data).toHaveProperty('error', 'Tool ID is required')
    })

    it('should handle tool not found', async () => {
      // Mock tool not found
      mockLimit.mockResolvedValueOnce([])

      // Create mock request with non-existent ID
      const req = new NextRequest('http://localhost:3000/api/tools/custom?id=non-existent')

      // Import handler after mocks are set up
      const { DELETE } = await import('@/app/api/tools/custom/route')

      // Call the handler
      const response = await DELETE(req)
      const data = await response.json()

      // Verify response
      expect(response.status).toBe(404)
      expect(data).toHaveProperty('error', 'Tool not found')
    })

    it('should prevent unauthorized deletion of user-scoped tool', async () => {
      // Mock hybrid auth for the DELETE request
      vi.doMock('@/lib/auth/hybrid', () => ({
        checkHybridAuth: vi.fn().mockResolvedValue({
          success: true,
          userId: 'user-456', // Different user
          authType: 'session',
        }),
      }))

      // Mock finding user-scoped tool (no workspaceId) that belongs to user-123
      const userScopedTool = { ...sampleTools[0], workspaceId: null, userId: 'user-123' }
      mockLimit.mockResolvedValueOnce([userScopedTool])

      // Create mock request (no workspaceId for user-scoped tool)
      const req = new NextRequest('http://localhost:3000/api/tools/custom?id=tool-1')

      // Import handler after mocks are set up
      const { DELETE } = await import('@/app/api/tools/custom/route')

      // Call the handler
      const response = await DELETE(req)
      const data = await response.json()

      // Verify response
      expect(response.status).toBe(403)
      expect(data).toHaveProperty('error', 'Access denied')
    })

    it('should reject unauthorized requests', async () => {
      // Mock hybrid auth to return unauthorized
      vi.doMock('@/lib/auth/hybrid', () => ({
        checkHybridAuth: vi.fn().mockResolvedValue({
          success: false,
          error: 'Unauthorized',
        }),
      }))

      // Create mock request
      const req = new NextRequest('http://localhost:3000/api/tools/custom?id=tool-1')

      // Import handler after mocks are set up
      const { DELETE } = await import('@/app/api/tools/custom/route')

      // Call the handler
      const response = await DELETE(req)
      const data = await response.json()

      // Verify response
      expect(response.status).toBe(401)
      expect(data).toHaveProperty('error', 'Unauthorized')
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/custom/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import { customTools, workflow } from '@sim/db/schema'
import { and, desc, eq, isNull, or } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { upsertCustomTools } from '@/lib/workflows/custom-tools/operations'
import { getUserEntityPermissions } from '@/lib/workspaces/permissions/utils'

const logger = createLogger('CustomToolsAPI')

const CustomToolSchema = z.object({
  tools: z.array(
    z.object({
      id: z.string().optional(),
      title: z.string().min(1, 'Tool title is required'),
      schema: z.object({
        type: z.literal('function'),
        function: z.object({
          name: z.string().min(1, 'Function name is required'),
          description: z.string().optional(),
          parameters: z.object({
            type: z.string(),
            properties: z.record(z.any()),
            required: z.array(z.string()).optional(),
          }),
        }),
      }),
      code: z.string(),
    })
  ),
  workspaceId: z.string().optional(),
})

// GET - Fetch all custom tools for the workspace
export async function GET(request: NextRequest) {
  const requestId = generateRequestId()
  const searchParams = request.nextUrl.searchParams
  const workspaceId = searchParams.get('workspaceId')
  const workflowId = searchParams.get('workflowId')

  try {
    // Use hybrid auth to support session, API key, and internal JWT
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })
    if (!authResult.success || !authResult.userId) {
      logger.warn(`[${requestId}] Unauthorized custom tools access attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = authResult.userId

    let resolvedWorkspaceId: string | null = workspaceId

    if (!resolvedWorkspaceId && workflowId) {
      const [workflowData] = await db
        .select({ workspaceId: workflow.workspaceId })
        .from(workflow)
        .where(eq(workflow.id, workflowId))
        .limit(1)

      if (!workflowData) {
        logger.warn(`[${requestId}] Workflow not found: ${workflowId}`)
        return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
      }

      resolvedWorkspaceId = workflowData.workspaceId
    }

    // Check workspace permissions
    // For internal JWT with workflowId: checkHybridAuth already resolved userId from workflow owner
    // For session/API key: verify user has access to the workspace
    // For legacy (no workspaceId): skip workspace check, rely on userId match
    if (resolvedWorkspaceId && !(authResult.authType === 'internal_jwt' && workflowId)) {
      const userPermission = await getUserEntityPermissions(
        userId,
        'workspace',
        resolvedWorkspaceId
      )
      if (!userPermission) {
        logger.warn(
          `[${requestId}] User ${userId} does not have access to workspace ${resolvedWorkspaceId}`
        )
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }
    }

    // Build query to fetch tools
    // 1. Workspace-scoped tools: tools with matching workspaceId
    // 2. User-scoped legacy tools: tools with null workspaceId and matching userId
    const conditions = []

    if (resolvedWorkspaceId) {
      conditions.push(eq(customTools.workspaceId, resolvedWorkspaceId))
    }

    // Always include legacy user-scoped tools for backward compatibility
    conditions.push(and(isNull(customTools.workspaceId), eq(customTools.userId, userId)))

    const result = await db
      .select()
      .from(customTools)
      .where(or(...conditions))
      .orderBy(desc(customTools.createdAt))

    return NextResponse.json({ data: result }, { status: 200 })
  } catch (error) {
    logger.error(`[${requestId}] Error fetching custom tools:`, error)
    return NextResponse.json({ error: 'Failed to fetch custom tools' }, { status: 500 })
  }
}

// POST - Create or update custom tools
export async function POST(req: NextRequest) {
  const requestId = generateRequestId()

  try {
    // Use hybrid auth (though this endpoint is only called from UI)
    const authResult = await checkHybridAuth(req, { requireWorkflowId: false })
    if (!authResult.success || !authResult.userId) {
      logger.warn(`[${requestId}] Unauthorized custom tools update attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = authResult.userId
    const body = await req.json()

    try {
      // Validate the request body
      const { tools, workspaceId } = CustomToolSchema.parse(body)

      if (!workspaceId) {
        logger.warn(`[${requestId}] Missing workspaceId in request body`)
        return NextResponse.json({ error: 'workspaceId is required' }, { status: 400 })
      }

      // Check workspace permissions
      const userPermission = await getUserEntityPermissions(userId, 'workspace', workspaceId)
      if (!userPermission) {
        logger.warn(
          `[${requestId}] User ${userId} does not have access to workspace ${workspaceId}`
        )
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }

      // Check write permission
      if (userPermission !== 'admin' && userPermission !== 'write') {
        logger.warn(
          `[${requestId}] User ${userId} does not have write permission for workspace ${workspaceId}`
        )
        return NextResponse.json({ error: 'Write permission required' }, { status: 403 })
      }

      // Use the extracted upsert function
      const resultTools = await upsertCustomTools({
        tools,
        workspaceId,
        userId,
        requestId,
      })

      return NextResponse.json({ success: true, data: resultTools })
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        logger.warn(`[${requestId}] Invalid custom tools data`, {
          errors: validationError.errors,
        })
        return NextResponse.json(
          { error: 'Invalid request data', details: validationError.errors },
          { status: 400 }
        )
      }
      throw validationError
    }
  } catch (error) {
    logger.error(`[${requestId}] Error updating custom tools`, error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to update custom tools'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// DELETE - Delete a custom tool by ID
export async function DELETE(request: NextRequest) {
  const requestId = generateRequestId()
  const searchParams = request.nextUrl.searchParams
  const toolId = searchParams.get('id')
  const workspaceId = searchParams.get('workspaceId')

  if (!toolId) {
    logger.warn(`[${requestId}] Missing tool ID for deletion`)
    return NextResponse.json({ error: 'Tool ID is required' }, { status: 400 })
  }

  try {
    // Use hybrid auth (though this endpoint is only called from UI)
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })
    if (!authResult.success || !authResult.userId) {
      logger.warn(`[${requestId}] Unauthorized custom tool deletion attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = authResult.userId

    // Check if the tool exists
    const existingTool = await db
      .select()
      .from(customTools)
      .where(eq(customTools.id, toolId))
      .limit(1)

    if (existingTool.length === 0) {
      logger.warn(`[${requestId}] Tool not found: ${toolId}`)
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 })
    }

    const tool = existingTool[0]

    // Handle workspace-scoped tools
    if (tool.workspaceId) {
      if (!workspaceId) {
        logger.warn(`[${requestId}] Missing workspaceId for workspace-scoped tool`)
        return NextResponse.json({ error: 'workspaceId is required' }, { status: 400 })
      }

      // Check workspace permissions
      const userPermission = await getUserEntityPermissions(userId, 'workspace', workspaceId)
      if (!userPermission) {
        logger.warn(
          `[${requestId}] User ${userId} does not have access to workspace ${workspaceId}`
        )
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }

      // Check write permission
      if (userPermission !== 'admin' && userPermission !== 'write') {
        logger.warn(
          `[${requestId}] User ${userId} does not have write permission for workspace ${workspaceId}`
        )
        return NextResponse.json({ error: 'Write permission required' }, { status: 403 })
      }

      // Verify tool belongs to this workspace
      if (tool.workspaceId !== workspaceId) {
        logger.warn(`[${requestId}] Tool ${toolId} does not belong to workspace ${workspaceId}`)
        return NextResponse.json({ error: 'Tool not found' }, { status: 404 })
      }
    } else {
      // Handle legacy user-scoped tools (no workspaceId)
      // Only allow deletion if user owns the tool
      if (tool.userId !== userId) {
        logger.warn(
          `[${requestId}] User ${userId} attempted to delete tool they don't own: ${toolId}`
        )
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }
    }

    // Delete the tool
    await db.delete(customTools).where(eq(customTools.id, toolId))

    logger.info(`[${requestId}] Deleted tool: ${toolId}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error(`[${requestId}] Error deleting custom tool:`, error)
    return NextResponse.json({ error: 'Failed to delete custom tool' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/discord/channels/route.ts
Signals: Next.js

```typescript
import { NextResponse } from 'next/server'
import { validateNumericId } from '@/lib/core/security/input-validation'
import { createLogger } from '@/lib/logs/console/logger'

interface DiscordChannel {
  id: string
  name: string
  type: number
  guild_id?: string
}

export const dynamic = 'force-dynamic'

const logger = createLogger('DiscordChannelsAPI')

export async function POST(request: Request) {
  try {
    const { botToken, serverId, channelId } = await request.json()

    if (!botToken) {
      logger.error('Missing bot token in request')
      return NextResponse.json({ error: 'Bot token is required' }, { status: 400 })
    }

    if (!serverId) {
      logger.error('Missing server ID in request')
      return NextResponse.json({ error: 'Server ID is required' }, { status: 400 })
    }

    const serverIdValidation = validateNumericId(serverId, 'serverId')
    if (!serverIdValidation.isValid) {
      logger.error(`Invalid server ID: ${serverIdValidation.error}`)
      return NextResponse.json({ error: serverIdValidation.error }, { status: 400 })
    }

    if (channelId) {
      const channelIdValidation = validateNumericId(channelId, 'channelId')
      if (!channelIdValidation.isValid) {
        logger.error(`Invalid channel ID: ${channelIdValidation.error}`)
        return NextResponse.json({ error: channelIdValidation.error }, { status: 400 })
      }

      logger.info(`Fetching single Discord channel: ${channelId}`)

      const response = await fetch(`https://discord.com/api/v10/channels/${channelId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bot ${botToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        logger.error('Discord API error fetching channel:', {
          status: response.status,
          statusText: response.statusText,
        })

        let errorMessage
        try {
          const errorData = await response.json()
          logger.error('Error details:', errorData)
          errorMessage = errorData.message || `Failed to fetch channel (${response.status})`
        } catch (_e) {
          errorMessage = `Failed to fetch channel: ${response.status} ${response.statusText}`
        }
        return NextResponse.json({ error: errorMessage }, { status: response.status })
      }

      const channel = (await response.json()) as DiscordChannel

      if (channel.guild_id !== serverId) {
        logger.error('Channel does not belong to the specified server')
        return NextResponse.json(
          { error: 'Channel not found in specified server' },
          { status: 404 }
        )
      }

      if (channel.type !== 0) {
        logger.warn('Requested channel is not a text channel')
        return NextResponse.json({ error: 'Channel is not a text channel' }, { status: 400 })
      }

      logger.info(`Successfully fetched channel: ${channel.name}`)

      return NextResponse.json({
        channel: {
          id: channel.id,
          name: channel.name,
          type: channel.type,
        },
      })
    }

    logger.info(`Fetching all Discord channels for server: ${serverId}`)

    const response = await fetch(`https://discord.com/api/v10/guilds/${serverId}/channels`, {
      method: 'GET',
      headers: {
        Authorization: `Bot ${botToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      logger.warn(
        'Discord API returned non-OK for channels; returning empty list to avoid UX break',
        {
          status: response.status,
          statusText: response.statusText,
        }
      )
      return NextResponse.json({ channels: [] })
    }

    const channels = (await response.json()) as DiscordChannel[]

    const textChannels = channels.filter((channel: DiscordChannel) => channel.type === 0)

    logger.info(`Successfully fetched ${textChannels.length} text channels`)

    return NextResponse.json({
      channels: textChannels.map((channel: DiscordChannel) => ({
        id: channel.id,
        name: channel.name,
        type: channel.type,
      })),
    })
  } catch (error) {
    logger.error('Error processing request:', error)
    return NextResponse.json(
      {
        error: 'Failed to retrieve Discord channels',
        details: (error as Error).message,
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/discord/send-message/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { validateNumericId } from '@/lib/core/security/input-validation'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { processFilesToUserFiles } from '@/lib/uploads/utils/file-utils'
import { downloadFileFromStorage } from '@/lib/uploads/utils/file-utils.server'

export const dynamic = 'force-dynamic'

const logger = createLogger('DiscordSendMessageAPI')

const DiscordSendMessageSchema = z.object({
  botToken: z.string().min(1, 'Bot token is required'),
  channelId: z.string().min(1, 'Channel ID is required'),
  content: z.string().optional().nullable(),
  files: z.array(z.any()).optional().nullable(),
})

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })

    if (!authResult.success) {
      logger.warn(`[${requestId}] Unauthorized Discord send attempt: ${authResult.error}`)
      return NextResponse.json(
        {
          success: false,
          error: authResult.error || 'Authentication required',
        },
        { status: 401 }
      )
    }

    logger.info(`[${requestId}] Authenticated Discord send request via ${authResult.authType}`, {
      userId: authResult.userId,
    })

    const body = await request.json()
    const validatedData = DiscordSendMessageSchema.parse(body)

    const channelIdValidation = validateNumericId(validatedData.channelId, 'channelId')
    if (!channelIdValidation.isValid) {
      logger.warn(`[${requestId}] Invalid channelId format`, {
        error: channelIdValidation.error,
      })
      return NextResponse.json(
        { success: false, error: channelIdValidation.error },
        { status: 400 }
      )
    }

    logger.info(`[${requestId}] Sending Discord message`, {
      channelId: validatedData.channelId,
      hasFiles: !!(validatedData.files && validatedData.files.length > 0),
      fileCount: validatedData.files?.length || 0,
    })

    const discordApiUrl = `https://discord.com/api/v10/channels/${validatedData.channelId}/messages`

    if (!validatedData.files || validatedData.files.length === 0) {
      logger.info(`[${requestId}] No files, using JSON POST`)

      const response = await fetch(discordApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bot ${validatedData.botToken}`,
        },
        body: JSON.stringify({
          content: validatedData.content || '',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        logger.error(`[${requestId}] Discord API error:`, errorData)
        return NextResponse.json(
          {
            success: false,
            error: errorData.message || 'Failed to send message',
          },
          { status: response.status }
        )
      }

      const data = await response.json()
      logger.info(`[${requestId}] Message sent successfully`)
      return NextResponse.json({
        success: true,
        output: {
          message: data.content,
          data: data,
        },
      })
    }

    logger.info(`[${requestId}] Processing ${validatedData.files.length} file(s)`)

    const userFiles = processFilesToUserFiles(validatedData.files, requestId, logger)

    if (userFiles.length === 0) {
      logger.warn(`[${requestId}] No valid files to upload, falling back to text-only`)
      const response = await fetch(discordApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bot ${validatedData.botToken}`,
        },
        body: JSON.stringify({
          content: validatedData.content || '',
        }),
      })

      const data = await response.json()
      return NextResponse.json({
        success: true,
        output: {
          message: data.content,
          data: data,
        },
      })
    }

    const formData = new FormData()

    const payload = {
      content: validatedData.content || '',
    }
    formData.append('payload_json', JSON.stringify(payload))

    for (let i = 0; i < userFiles.length; i++) {
      const userFile = userFiles[i]
      logger.info(`[${requestId}] Downloading file ${i}: ${userFile.name}`)

      const buffer = await downloadFileFromStorage(userFile, requestId, logger)

      const blob = new Blob([new Uint8Array(buffer)], { type: userFile.type })
      formData.append(`files[${i}]`, blob, userFile.name)
      logger.info(`[${requestId}] Added file ${i}: ${userFile.name} (${buffer.length} bytes)`)
    }

    logger.info(`[${requestId}] Sending multipart request with ${userFiles.length} file(s)`)
    const response = await fetch(discordApiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bot ${validatedData.botToken}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      logger.error(`[${requestId}] Discord API error:`, errorData)
      return NextResponse.json(
        {
          success: false,
          error: errorData.message || 'Failed to send message with files',
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    logger.info(`[${requestId}] Message with files sent successfully`)

    return NextResponse.json({
      success: true,
      output: {
        message: data.content,
        data: data,
        fileCount: userFiles.length,
      },
    })
  } catch (error) {
    logger.error(`[${requestId}] Error sending Discord message:`, error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

````
