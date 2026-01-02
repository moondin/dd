---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 284
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 284 of 933)

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
Location: sim-main/apps/sim/app/api/knowledge/[id]/route.test.ts

```typescript
/**
 * Tests for knowledge base by ID API route
 *
 * @vitest-environment node
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  createMockRequest,
  mockAuth,
  mockConsoleLogger,
  mockDrizzleOrm,
  mockKnowledgeSchemas,
} from '@/app/api/__test-utils__/utils'

mockKnowledgeSchemas()
mockDrizzleOrm()
mockConsoleLogger()

vi.mock('@/lib/knowledge/service', () => ({
  getKnowledgeBaseById: vi.fn(),
  updateKnowledgeBase: vi.fn(),
  deleteKnowledgeBase: vi.fn(),
}))

vi.mock('@/app/api/knowledge/utils', () => ({
  checkKnowledgeBaseAccess: vi.fn(),
  checkKnowledgeBaseWriteAccess: vi.fn(),
}))

describe('Knowledge Base By ID API Route', () => {
  const mockAuth$ = mockAuth()

  let mockGetKnowledgeBaseById: any
  let mockUpdateKnowledgeBase: any
  let mockDeleteKnowledgeBase: any
  let mockCheckKnowledgeBaseAccess: any
  let mockCheckKnowledgeBaseWriteAccess: any

  const mockDbChain = {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
  }

  const mockKnowledgeBase = {
    id: 'kb-123',
    userId: 'user-123',
    name: 'Test Knowledge Base',
    description: 'Test description',
    tokenCount: 100,
    embeddingModel: 'text-embedding-3-small',
    embeddingDimension: 1536,
    chunkingConfig: { maxSize: 1024, minSize: 100, overlap: 200 },
    createdAt: new Date(),
    updatedAt: new Date(),
    workspaceId: null,
    deletedAt: null,
  }

  const resetMocks = () => {
    vi.clearAllMocks()
    Object.values(mockDbChain).forEach((fn) => {
      if (typeof fn === 'function') {
        fn.mockClear().mockReset().mockReturnThis()
      }
    })
  }

  beforeEach(async () => {
    vi.clearAllMocks()

    vi.doMock('@sim/db', () => ({
      db: mockDbChain,
    }))

    vi.stubGlobal('crypto', {
      randomUUID: vi.fn().mockReturnValue('mock-uuid-1234-5678'),
    })

    const knowledgeService = await import('@/lib/knowledge/service')
    const knowledgeUtils = await import('@/app/api/knowledge/utils')

    mockGetKnowledgeBaseById = knowledgeService.getKnowledgeBaseById as any
    mockUpdateKnowledgeBase = knowledgeService.updateKnowledgeBase as any
    mockDeleteKnowledgeBase = knowledgeService.deleteKnowledgeBase as any
    mockCheckKnowledgeBaseAccess = knowledgeUtils.checkKnowledgeBaseAccess as any
    mockCheckKnowledgeBaseWriteAccess = knowledgeUtils.checkKnowledgeBaseWriteAccess as any
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/knowledge/[id]', () => {
    const mockParams = Promise.resolve({ id: 'kb-123' })

    it('should retrieve knowledge base successfully for authenticated user', async () => {
      mockAuth$.mockAuthenticatedUser()

      mockCheckKnowledgeBaseAccess.mockResolvedValueOnce({
        hasAccess: true,
        knowledgeBase: { id: 'kb-123', userId: 'user-123' },
      })

      mockGetKnowledgeBaseById.mockResolvedValueOnce(mockKnowledgeBase)

      const req = createMockRequest('GET')
      const { GET } = await import('@/app/api/knowledge/[id]/route')
      const response = await GET(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.id).toBe('kb-123')
      expect(data.data.name).toBe('Test Knowledge Base')
      expect(mockCheckKnowledgeBaseAccess).toHaveBeenCalledWith('kb-123', 'user-123')
      expect(mockGetKnowledgeBaseById).toHaveBeenCalledWith('kb-123')
    })

    it('should return unauthorized for unauthenticated user', async () => {
      mockAuth$.mockUnauthenticated()

      const req = createMockRequest('GET')
      const { GET } = await import('@/app/api/knowledge/[id]/route')
      const response = await GET(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return not found for non-existent knowledge base', async () => {
      mockAuth$.mockAuthenticatedUser()

      mockCheckKnowledgeBaseAccess.mockResolvedValueOnce({
        hasAccess: false,
        notFound: true,
      })

      const req = createMockRequest('GET')
      const { GET } = await import('@/app/api/knowledge/[id]/route')
      const response = await GET(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Knowledge base not found')
    })

    it('should return unauthorized for knowledge base owned by different user', async () => {
      mockAuth$.mockAuthenticatedUser()

      mockCheckKnowledgeBaseAccess.mockResolvedValueOnce({
        hasAccess: false,
        notFound: false,
      })

      const req = createMockRequest('GET')
      const { GET } = await import('@/app/api/knowledge/[id]/route')
      const response = await GET(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return not found when service returns null', async () => {
      mockAuth$.mockAuthenticatedUser()

      mockCheckKnowledgeBaseAccess.mockResolvedValueOnce({
        hasAccess: true,
        knowledgeBase: { id: 'kb-123', userId: 'user-123' },
      })

      mockGetKnowledgeBaseById.mockResolvedValueOnce(null)

      const req = createMockRequest('GET')
      const { GET } = await import('@/app/api/knowledge/[id]/route')
      const response = await GET(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Knowledge base not found')
    })

    it('should handle database errors', async () => {
      mockAuth$.mockAuthenticatedUser()

      mockCheckKnowledgeBaseAccess.mockRejectedValueOnce(new Error('Database error'))

      const req = createMockRequest('GET')
      const { GET } = await import('@/app/api/knowledge/[id]/route')
      const response = await GET(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to fetch knowledge base')
    })
  })

  describe('PUT /api/knowledge/[id]', () => {
    const mockParams = Promise.resolve({ id: 'kb-123' })
    const validUpdateData = {
      name: 'Updated Knowledge Base',
      description: 'Updated description',
    }

    it('should update knowledge base successfully', async () => {
      mockAuth$.mockAuthenticatedUser()

      resetMocks()

      mockCheckKnowledgeBaseWriteAccess.mockResolvedValueOnce({
        hasAccess: true,
        knowledgeBase: { id: 'kb-123', userId: 'user-123' },
      })

      const updatedKnowledgeBase = { ...mockKnowledgeBase, ...validUpdateData }
      mockUpdateKnowledgeBase.mockResolvedValueOnce(updatedKnowledgeBase)

      const req = createMockRequest('PUT', validUpdateData)
      const { PUT } = await import('@/app/api/knowledge/[id]/route')
      const response = await PUT(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.name).toBe('Updated Knowledge Base')
      expect(mockCheckKnowledgeBaseWriteAccess).toHaveBeenCalledWith('kb-123', 'user-123')
      expect(mockUpdateKnowledgeBase).toHaveBeenCalledWith(
        'kb-123',
        {
          name: validUpdateData.name,
          description: validUpdateData.description,
          workspaceId: undefined,
          chunkingConfig: undefined,
        },
        expect.any(String)
      )
    })

    it('should return unauthorized for unauthenticated user', async () => {
      mockAuth$.mockUnauthenticated()

      const req = createMockRequest('PUT', validUpdateData)
      const { PUT } = await import('@/app/api/knowledge/[id]/route')
      const response = await PUT(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return not found for non-existent knowledge base', async () => {
      mockAuth$.mockAuthenticatedUser()

      resetMocks()

      mockCheckKnowledgeBaseWriteAccess.mockResolvedValueOnce({
        hasAccess: false,
        notFound: true,
      })

      const req = createMockRequest('PUT', validUpdateData)
      const { PUT } = await import('@/app/api/knowledge/[id]/route')
      const response = await PUT(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Knowledge base not found')
    })

    it('should validate update data', async () => {
      mockAuth$.mockAuthenticatedUser()

      resetMocks()

      mockCheckKnowledgeBaseWriteAccess.mockResolvedValueOnce({
        hasAccess: true,
        knowledgeBase: { id: 'kb-123', userId: 'user-123' },
      })

      const invalidData = {
        name: '',
      }

      const req = createMockRequest('PUT', invalidData)
      const { PUT } = await import('@/app/api/knowledge/[id]/route')
      const response = await PUT(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid request data')
      expect(data.details).toBeDefined()
    })

    it('should handle database errors during update', async () => {
      mockAuth$.mockAuthenticatedUser()

      // Mock successful write access check
      mockCheckKnowledgeBaseWriteAccess.mockResolvedValueOnce({
        hasAccess: true,
        knowledgeBase: { id: 'kb-123', userId: 'user-123' },
      })

      mockUpdateKnowledgeBase.mockRejectedValueOnce(new Error('Database error'))

      const req = createMockRequest('PUT', validUpdateData)
      const { PUT } = await import('@/app/api/knowledge/[id]/route')
      const response = await PUT(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to update knowledge base')
    })
  })

  describe('DELETE /api/knowledge/[id]', () => {
    const mockParams = Promise.resolve({ id: 'kb-123' })

    it('should delete knowledge base successfully', async () => {
      mockAuth$.mockAuthenticatedUser()

      resetMocks()

      mockCheckKnowledgeBaseWriteAccess.mockResolvedValueOnce({
        hasAccess: true,
        knowledgeBase: { id: 'kb-123', userId: 'user-123' },
      })

      mockDeleteKnowledgeBase.mockResolvedValueOnce(undefined)

      const req = createMockRequest('DELETE')
      const { DELETE } = await import('@/app/api/knowledge/[id]/route')
      const response = await DELETE(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.message).toBe('Knowledge base deleted successfully')
      expect(mockCheckKnowledgeBaseWriteAccess).toHaveBeenCalledWith('kb-123', 'user-123')
      expect(mockDeleteKnowledgeBase).toHaveBeenCalledWith('kb-123', expect.any(String))
    })

    it('should return unauthorized for unauthenticated user', async () => {
      mockAuth$.mockUnauthenticated()

      const req = createMockRequest('DELETE')
      const { DELETE } = await import('@/app/api/knowledge/[id]/route')
      const response = await DELETE(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return not found for non-existent knowledge base', async () => {
      mockAuth$.mockAuthenticatedUser()

      resetMocks()

      mockCheckKnowledgeBaseWriteAccess.mockResolvedValueOnce({
        hasAccess: false,
        notFound: true,
      })

      const req = createMockRequest('DELETE')
      const { DELETE } = await import('@/app/api/knowledge/[id]/route')
      const response = await DELETE(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Knowledge base not found')
    })

    it('should return unauthorized for knowledge base owned by different user', async () => {
      mockAuth$.mockAuthenticatedUser()

      resetMocks()

      mockCheckKnowledgeBaseWriteAccess.mockResolvedValueOnce({
        hasAccess: false,
        notFound: false,
      })

      const req = createMockRequest('DELETE')
      const { DELETE } = await import('@/app/api/knowledge/[id]/route')
      const response = await DELETE(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should handle database errors during delete', async () => {
      mockAuth$.mockAuthenticatedUser()

      mockCheckKnowledgeBaseWriteAccess.mockResolvedValueOnce({
        hasAccess: true,
        knowledgeBase: { id: 'kb-123', userId: 'user-123' },
      })

      mockDeleteKnowledgeBase.mockRejectedValueOnce(new Error('Database error'))

      const req = createMockRequest('DELETE')
      const { DELETE } = await import('@/app/api/knowledge/[id]/route')
      const response = await DELETE(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to delete knowledge base')
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/knowledge/[id]/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { generateRequestId } from '@/lib/core/utils/request'
import {
  deleteKnowledgeBase,
  getKnowledgeBaseById,
  updateKnowledgeBase,
} from '@/lib/knowledge/service'
import { createLogger } from '@/lib/logs/console/logger'
import { checkKnowledgeBaseAccess, checkKnowledgeBaseWriteAccess } from '@/app/api/knowledge/utils'

const logger = createLogger('KnowledgeBaseByIdAPI')

const UpdateKnowledgeBaseSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().optional(),
  embeddingModel: z.literal('text-embedding-3-small').optional(),
  embeddingDimension: z.literal(1536).optional(),
  workspaceId: z.string().nullable().optional(),
  chunkingConfig: z
    .object({
      maxSize: z.number(),
      minSize: z.number(),
      overlap: z.number(),
    })
    .optional(),
})

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = generateRequestId()
  const { id } = await params

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized knowledge base access attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const accessCheck = await checkKnowledgeBaseAccess(id, session.user.id)

    if (!accessCheck.hasAccess) {
      if ('notFound' in accessCheck && accessCheck.notFound) {
        logger.warn(`[${requestId}] Knowledge base not found: ${id}`)
        return NextResponse.json({ error: 'Knowledge base not found' }, { status: 404 })
      }
      logger.warn(
        `[${requestId}] User ${session.user.id} attempted to access unauthorized knowledge base ${id}`
      )
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const knowledgeBaseData = await getKnowledgeBaseById(id)

    if (!knowledgeBaseData) {
      return NextResponse.json({ error: 'Knowledge base not found' }, { status: 404 })
    }

    logger.info(`[${requestId}] Retrieved knowledge base: ${id} for user ${session.user.id}`)

    return NextResponse.json({
      success: true,
      data: knowledgeBaseData,
    })
  } catch (error) {
    logger.error(`[${requestId}] Error fetching knowledge base`, error)
    return NextResponse.json({ error: 'Failed to fetch knowledge base' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = generateRequestId()
  const { id } = await params

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized knowledge base update attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const accessCheck = await checkKnowledgeBaseWriteAccess(id, session.user.id)

    if (!accessCheck.hasAccess) {
      if ('notFound' in accessCheck && accessCheck.notFound) {
        logger.warn(`[${requestId}] Knowledge base not found: ${id}`)
        return NextResponse.json({ error: 'Knowledge base not found' }, { status: 404 })
      }
      logger.warn(
        `[${requestId}] User ${session.user.id} attempted to update unauthorized knowledge base ${id}`
      )
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    try {
      const validatedData = UpdateKnowledgeBaseSchema.parse(body)

      const updatedKnowledgeBase = await updateKnowledgeBase(
        id,
        {
          name: validatedData.name,
          description: validatedData.description,
          workspaceId: validatedData.workspaceId,
          chunkingConfig: validatedData.chunkingConfig,
        },
        requestId
      )

      logger.info(`[${requestId}] Knowledge base updated: ${id} for user ${session.user.id}`)

      return NextResponse.json({
        success: true,
        data: updatedKnowledgeBase,
      })
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        logger.warn(`[${requestId}] Invalid knowledge base update data`, {
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
    logger.error(`[${requestId}] Error updating knowledge base`, error)
    return NextResponse.json({ error: 'Failed to update knowledge base' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = generateRequestId()
  const { id } = await params

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized knowledge base delete attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const accessCheck = await checkKnowledgeBaseWriteAccess(id, session.user.id)

    if (!accessCheck.hasAccess) {
      if ('notFound' in accessCheck && accessCheck.notFound) {
        logger.warn(`[${requestId}] Knowledge base not found: ${id}`)
        return NextResponse.json({ error: 'Knowledge base not found' }, { status: 404 })
      }
      logger.warn(
        `[${requestId}] User ${session.user.id} attempted to delete unauthorized knowledge base ${id}`
      )
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await deleteKnowledgeBase(id, requestId)

    logger.info(`[${requestId}] Knowledge base deleted: ${id} for user ${session.user.id}`)

    return NextResponse.json({
      success: true,
      data: { message: 'Knowledge base deleted successfully' },
    })
  } catch (error) {
    logger.error(`[${requestId}] Error deleting knowledge base`, error)
    return NextResponse.json({ error: 'Failed to delete knowledge base' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

````
