---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 286
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 286 of 933)

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
Location: sim-main/apps/sim/app/api/knowledge/[id]/documents/[documentId]/route.test.ts

```typescript
/**
 * Tests for document by ID API route
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

vi.mock('@/app/api/knowledge/utils', () => ({
  checkKnowledgeBaseAccess: vi.fn(),
  checkKnowledgeBaseWriteAccess: vi.fn(),
  checkDocumentAccess: vi.fn(),
  checkDocumentWriteAccess: vi.fn(),
  checkChunkAccess: vi.fn(),
  generateEmbeddings: vi.fn(),
  processDocumentAsync: vi.fn(),
}))

vi.mock('@/lib/knowledge/documents/service', () => ({
  updateDocument: vi.fn(),
  deleteDocument: vi.fn(),
  markDocumentAsFailedTimeout: vi.fn(),
  retryDocumentProcessing: vi.fn(),
  processDocumentAsync: vi.fn(),
}))

mockDrizzleOrm()
mockConsoleLogger()

describe('Document By ID API Route', () => {
  const mockAuth$ = mockAuth()

  const mockDbChain = {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    transaction: vi.fn(),
  }

  const mockDocument = {
    id: 'doc-123',
    knowledgeBaseId: 'kb-123',
    filename: 'test-document.pdf',
    fileUrl: 'https://example.com/test-document.pdf',
    fileSize: 1024,
    mimeType: 'application/pdf',
    chunkCount: 5,
    tokenCount: 100,
    characterCount: 500,
    processingStatus: 'completed' as const,
    processingStartedAt: new Date('2023-01-01T10:00:00Z'),
    processingCompletedAt: new Date('2023-01-01T10:05:00Z'),
    processingError: null,
    enabled: true,
    uploadedAt: new Date('2023-01-01T09:00:00Z'),
    tag1: null,
    tag2: null,
    tag3: null,
    tag4: null,
    tag5: null,
    tag6: null,
    tag7: null,
    deletedAt: null,
  }

  const resetMocks = () => {
    vi.clearAllMocks()
    Object.values(mockDbChain).forEach((fn) => {
      if (typeof fn === 'function') {
        fn.mockClear().mockReset()
        if (fn !== mockDbChain.transaction) {
          fn.mockReturnThis()
        }
      }
    })
  }

  beforeEach(async () => {
    resetMocks()

    vi.doMock('@sim/db', () => ({
      db: mockDbChain,
    }))

    vi.stubGlobal('crypto', {
      randomUUID: vi.fn().mockReturnValue('mock-uuid-1234-5678'),
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/knowledge/[id]/documents/[documentId]', () => {
    const mockParams = Promise.resolve({ id: 'kb-123', documentId: 'doc-123' })

    it('should retrieve document successfully for authenticated user', async () => {
      const { checkDocumentAccess } = await import('@/app/api/knowledge/utils')

      mockAuth$.mockAuthenticatedUser()
      vi.mocked(checkDocumentAccess).mockResolvedValue({
        hasAccess: true,
        document: mockDocument,
        knowledgeBase: { id: 'kb-123', userId: 'user-123' },
      })

      const req = createMockRequest('GET')
      const { GET } = await import('@/app/api/knowledge/[id]/documents/[documentId]/route')
      const response = await GET(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.id).toBe('doc-123')
      expect(data.data.filename).toBe('test-document.pdf')
      expect(vi.mocked(checkDocumentAccess)).toHaveBeenCalledWith('kb-123', 'doc-123', 'user-123')
    })

    it('should return unauthorized for unauthenticated user', async () => {
      mockAuth$.mockUnauthenticated()

      const req = createMockRequest('GET')
      const { GET } = await import('@/app/api/knowledge/[id]/documents/[documentId]/route')
      const response = await GET(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return not found for non-existent document', async () => {
      const { checkDocumentAccess } = await import('@/app/api/knowledge/utils')

      mockAuth$.mockAuthenticatedUser()
      vi.mocked(checkDocumentAccess).mockResolvedValue({
        hasAccess: false,
        notFound: true,
        reason: 'Document not found',
      })

      const req = createMockRequest('GET')
      const { GET } = await import('@/app/api/knowledge/[id]/documents/[documentId]/route')
      const response = await GET(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Document not found')
    })

    it('should return unauthorized for document without access', async () => {
      const { checkDocumentAccess } = await import('@/app/api/knowledge/utils')

      mockAuth$.mockAuthenticatedUser()
      vi.mocked(checkDocumentAccess).mockResolvedValue({
        hasAccess: false,
        reason: 'Access denied',
      })

      const req = createMockRequest('GET')
      const { GET } = await import('@/app/api/knowledge/[id]/documents/[documentId]/route')
      const response = await GET(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should handle database errors', async () => {
      const { checkDocumentAccess } = await import('@/app/api/knowledge/utils')

      mockAuth$.mockAuthenticatedUser()
      vi.mocked(checkDocumentAccess).mockRejectedValue(new Error('Database error'))

      const req = createMockRequest('GET')
      const { GET } = await import('@/app/api/knowledge/[id]/documents/[documentId]/route')
      const response = await GET(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to fetch document')
    })
  })

  describe('PUT /api/knowledge/[id]/documents/[documentId] - Regular Updates', () => {
    const mockParams = Promise.resolve({ id: 'kb-123', documentId: 'doc-123' })
    const validUpdateData = {
      filename: 'updated-document.pdf',
      enabled: false,
      chunkCount: 10,
      tokenCount: 200,
    }

    it('should update document successfully', async () => {
      const { checkDocumentWriteAccess } = await import('@/app/api/knowledge/utils')
      const { updateDocument } = await import('@/lib/knowledge/documents/service')

      mockAuth$.mockAuthenticatedUser()
      vi.mocked(checkDocumentWriteAccess).mockResolvedValue({
        hasAccess: true,
        document: mockDocument,
        knowledgeBase: { id: 'kb-123', userId: 'user-123' },
      })

      const updatedDocument = {
        ...mockDocument,
        ...validUpdateData,
        deletedAt: null,
      }
      vi.mocked(updateDocument).mockResolvedValue(updatedDocument)

      const req = createMockRequest('PUT', validUpdateData)
      const { PUT } = await import('@/app/api/knowledge/[id]/documents/[documentId]/route')
      const response = await PUT(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.filename).toBe('updated-document.pdf')
      expect(data.data.enabled).toBe(false)
      expect(vi.mocked(updateDocument)).toHaveBeenCalledWith(
        'doc-123',
        validUpdateData,
        expect.any(String)
      )
    })

    it('should validate update data', async () => {
      const { checkDocumentWriteAccess } = await import('@/app/api/knowledge/utils')

      mockAuth$.mockAuthenticatedUser()
      vi.mocked(checkDocumentWriteAccess).mockResolvedValue({
        hasAccess: true,
        document: mockDocument,
        knowledgeBase: { id: 'kb-123', userId: 'user-123' },
      })

      const invalidData = {
        filename: '', // Invalid: empty filename
        chunkCount: -1, // Invalid: negative count
        processingStatus: 'invalid', // Invalid: not in enum
      }

      const req = createMockRequest('PUT', invalidData)
      const { PUT } = await import('@/app/api/knowledge/[id]/documents/[documentId]/route')
      const response = await PUT(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid request data')
      expect(data.details).toBeDefined()
    })
  })

  describe('PUT /api/knowledge/[id]/documents/[documentId] - Mark Failed Due to Timeout', () => {
    const mockParams = Promise.resolve({ id: 'kb-123', documentId: 'doc-123' })

    it('should mark document as failed due to timeout successfully', async () => {
      const { checkDocumentWriteAccess } = await import('@/app/api/knowledge/utils')
      const { markDocumentAsFailedTimeout } = await import('@/lib/knowledge/documents/service')

      const processingDocument = {
        ...mockDocument,
        processingStatus: 'processing',
        processingStartedAt: new Date(Date.now() - 200000), // 200 seconds ago
      }

      mockAuth$.mockAuthenticatedUser()
      vi.mocked(checkDocumentWriteAccess).mockResolvedValue({
        hasAccess: true,
        document: processingDocument,
        knowledgeBase: { id: 'kb-123', userId: 'user-123' },
      })

      vi.mocked(markDocumentAsFailedTimeout).mockResolvedValue({
        success: true,
        processingDuration: 200000,
      })

      const req = createMockRequest('PUT', { markFailedDueToTimeout: true })
      const { PUT } = await import('@/app/api/knowledge/[id]/documents/[documentId]/route')
      const response = await PUT(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.documentId).toBe('doc-123')
      expect(data.data.status).toBe('failed')
      expect(data.data.message).toBe('Document marked as failed due to timeout')
      expect(vi.mocked(markDocumentAsFailedTimeout)).toHaveBeenCalledWith(
        'doc-123',
        processingDocument.processingStartedAt,
        expect.any(String)
      )
    })

    it('should reject marking failed for non-processing document', async () => {
      const { checkDocumentWriteAccess } = await import('@/app/api/knowledge/utils')

      mockAuth$.mockAuthenticatedUser()
      vi.mocked(checkDocumentWriteAccess).mockResolvedValue({
        hasAccess: true,
        document: { ...mockDocument, processingStatus: 'completed' },
        knowledgeBase: { id: 'kb-123', userId: 'user-123' },
      })

      const req = createMockRequest('PUT', { markFailedDueToTimeout: true })
      const { PUT } = await import('@/app/api/knowledge/[id]/documents/[documentId]/route')
      const response = await PUT(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Document is not in processing state')
    })

    it('should reject marking failed for recently started processing', async () => {
      const { checkDocumentWriteAccess } = await import('@/app/api/knowledge/utils')
      const { markDocumentAsFailedTimeout } = await import('@/lib/knowledge/documents/service')

      const recentProcessingDocument = {
        ...mockDocument,
        processingStatus: 'processing',
        processingStartedAt: new Date(Date.now() - 60000), // 60 seconds ago
      }

      mockAuth$.mockAuthenticatedUser()
      vi.mocked(checkDocumentWriteAccess).mockResolvedValue({
        hasAccess: true,
        document: recentProcessingDocument,
        knowledgeBase: { id: 'kb-123', userId: 'user-123' },
      })

      vi.mocked(markDocumentAsFailedTimeout).mockRejectedValue(
        new Error('Document has not been processing long enough to be considered dead')
      )

      const req = createMockRequest('PUT', { markFailedDueToTimeout: true })
      const { PUT } = await import('@/app/api/knowledge/[id]/documents/[documentId]/route')
      const response = await PUT(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Document has not been processing long enough')
    })
  })

  describe('PUT /api/knowledge/[id]/documents/[documentId] - Retry Processing', () => {
    const mockParams = Promise.resolve({ id: 'kb-123', documentId: 'doc-123' })

    it('should retry processing successfully', async () => {
      const { checkDocumentWriteAccess } = await import('@/app/api/knowledge/utils')
      const { retryDocumentProcessing } = await import('@/lib/knowledge/documents/service')

      const failedDocument = {
        ...mockDocument,
        processingStatus: 'failed',
        processingError: 'Previous processing failed',
      }

      mockAuth$.mockAuthenticatedUser()
      vi.mocked(checkDocumentWriteAccess).mockResolvedValue({
        hasAccess: true,
        document: failedDocument,
        knowledgeBase: { id: 'kb-123', userId: 'user-123' },
      })

      vi.mocked(retryDocumentProcessing).mockResolvedValue({
        success: true,
        status: 'pending',
        message: 'Document retry processing started',
      })

      const req = createMockRequest('PUT', { retryProcessing: true })
      const { PUT } = await import('@/app/api/knowledge/[id]/documents/[documentId]/route')
      const response = await PUT(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.status).toBe('pending')
      expect(data.data.message).toBe('Document retry processing started')
      expect(vi.mocked(retryDocumentProcessing)).toHaveBeenCalledWith(
        'kb-123',
        'doc-123',
        {
          filename: failedDocument.filename,
          fileUrl: failedDocument.fileUrl,
          fileSize: failedDocument.fileSize,
          mimeType: failedDocument.mimeType,
        },
        expect.any(String)
      )
    })

    it('should reject retry for non-failed document', async () => {
      const { checkDocumentWriteAccess } = await import('@/app/api/knowledge/utils')

      mockAuth$.mockAuthenticatedUser()
      vi.mocked(checkDocumentWriteAccess).mockResolvedValue({
        hasAccess: true,
        document: { ...mockDocument, processingStatus: 'completed' },
        knowledgeBase: { id: 'kb-123', userId: 'user-123' },
      })

      const req = createMockRequest('PUT', { retryProcessing: true })
      const { PUT } = await import('@/app/api/knowledge/[id]/documents/[documentId]/route')
      const response = await PUT(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Document is not in failed state')
    })
  })

  describe('PUT /api/knowledge/[id]/documents/[documentId] - Authentication & Authorization', () => {
    const mockParams = Promise.resolve({ id: 'kb-123', documentId: 'doc-123' })
    const validUpdateData = { filename: 'updated-document.pdf' }

    it('should return unauthorized for unauthenticated user', async () => {
      mockAuth$.mockUnauthenticated()

      const req = createMockRequest('PUT', validUpdateData)
      const { PUT } = await import('@/app/api/knowledge/[id]/documents/[documentId]/route')
      const response = await PUT(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return not found for non-existent document', async () => {
      const { checkDocumentWriteAccess } = await import('@/app/api/knowledge/utils')

      mockAuth$.mockAuthenticatedUser()
      vi.mocked(checkDocumentWriteAccess).mockResolvedValue({
        hasAccess: false,
        notFound: true,
        reason: 'Document not found',
      })

      const req = createMockRequest('PUT', validUpdateData)
      const { PUT } = await import('@/app/api/knowledge/[id]/documents/[documentId]/route')
      const response = await PUT(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Document not found')
    })

    it('should handle database errors during update', async () => {
      const { checkDocumentWriteAccess } = await import('@/app/api/knowledge/utils')
      const { updateDocument } = await import('@/lib/knowledge/documents/service')

      mockAuth$.mockAuthenticatedUser()
      vi.mocked(checkDocumentWriteAccess).mockResolvedValue({
        hasAccess: true,
        document: mockDocument,
        knowledgeBase: { id: 'kb-123', userId: 'user-123' },
      })

      vi.mocked(updateDocument).mockRejectedValue(new Error('Database error'))

      const req = createMockRequest('PUT', validUpdateData)
      const { PUT } = await import('@/app/api/knowledge/[id]/documents/[documentId]/route')
      const response = await PUT(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to update document')
    })
  })

  describe('DELETE /api/knowledge/[id]/documents/[documentId]', () => {
    const mockParams = Promise.resolve({ id: 'kb-123', documentId: 'doc-123' })

    it('should delete document successfully', async () => {
      const { checkDocumentWriteAccess } = await import('@/app/api/knowledge/utils')
      const { deleteDocument } = await import('@/lib/knowledge/documents/service')

      mockAuth$.mockAuthenticatedUser()
      vi.mocked(checkDocumentWriteAccess).mockResolvedValue({
        hasAccess: true,
        document: mockDocument,
        knowledgeBase: { id: 'kb-123', userId: 'user-123' },
      })

      vi.mocked(deleteDocument).mockResolvedValue({
        success: true,
        message: 'Document deleted successfully',
      })

      const req = createMockRequest('DELETE')
      const { DELETE } = await import('@/app/api/knowledge/[id]/documents/[documentId]/route')
      const response = await DELETE(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.message).toBe('Document deleted successfully')
      expect(vi.mocked(deleteDocument)).toHaveBeenCalledWith('doc-123', expect.any(String))
    })

    it('should return unauthorized for unauthenticated user', async () => {
      mockAuth$.mockUnauthenticated()

      const req = createMockRequest('DELETE')
      const { DELETE } = await import('@/app/api/knowledge/[id]/documents/[documentId]/route')
      const response = await DELETE(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return not found for non-existent document', async () => {
      const { checkDocumentWriteAccess } = await import('@/app/api/knowledge/utils')

      mockAuth$.mockAuthenticatedUser()
      vi.mocked(checkDocumentWriteAccess).mockResolvedValue({
        hasAccess: false,
        notFound: true,
        reason: 'Document not found',
      })

      const req = createMockRequest('DELETE')
      const { DELETE } = await import('@/app/api/knowledge/[id]/documents/[documentId]/route')
      const response = await DELETE(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Document not found')
    })

    it('should return unauthorized for document without access', async () => {
      const { checkDocumentWriteAccess } = await import('@/app/api/knowledge/utils')

      mockAuth$.mockAuthenticatedUser()
      vi.mocked(checkDocumentWriteAccess).mockResolvedValue({
        hasAccess: false,
        reason: 'Access denied',
      })

      const req = createMockRequest('DELETE')
      const { DELETE } = await import('@/app/api/knowledge/[id]/documents/[documentId]/route')
      const response = await DELETE(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should handle database errors during deletion', async () => {
      const { checkDocumentWriteAccess } = await import('@/app/api/knowledge/utils')
      const { deleteDocument } = await import('@/lib/knowledge/documents/service')

      mockAuth$.mockAuthenticatedUser()
      vi.mocked(checkDocumentWriteAccess).mockResolvedValue({
        hasAccess: true,
        document: mockDocument,
        knowledgeBase: { id: 'kb-123', userId: 'user-123' },
      })
      vi.mocked(deleteDocument).mockRejectedValue(new Error('Database error'))

      const req = createMockRequest('DELETE')
      const { DELETE } = await import('@/app/api/knowledge/[id]/documents/[documentId]/route')
      const response = await DELETE(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to delete document')
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/knowledge/[id]/documents/[documentId]/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { generateRequestId } from '@/lib/core/utils/request'
import {
  deleteDocument,
  markDocumentAsFailedTimeout,
  retryDocumentProcessing,
  updateDocument,
} from '@/lib/knowledge/documents/service'
import { createLogger } from '@/lib/logs/console/logger'
import { checkDocumentAccess, checkDocumentWriteAccess } from '@/app/api/knowledge/utils'

const logger = createLogger('DocumentByIdAPI')

const UpdateDocumentSchema = z.object({
  filename: z.string().min(1, 'Filename is required').optional(),
  enabled: z.boolean().optional(),
  chunkCount: z.number().min(0).optional(),
  tokenCount: z.number().min(0).optional(),
  characterCount: z.number().min(0).optional(),
  processingStatus: z.enum(['pending', 'processing', 'completed', 'failed']).optional(),
  processingError: z.string().optional(),
  markFailedDueToTimeout: z.boolean().optional(),
  retryProcessing: z.boolean().optional(),
  // Tag fields
  tag1: z.string().optional(),
  tag2: z.string().optional(),
  tag3: z.string().optional(),
  tag4: z.string().optional(),
  tag5: z.string().optional(),
  tag6: z.string().optional(),
  tag7: z.string().optional(),
})

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; documentId: string }> }
) {
  const requestId = generateRequestId()
  const { id: knowledgeBaseId, documentId } = await params

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized document access attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const accessCheck = await checkDocumentAccess(knowledgeBaseId, documentId, session.user.id)

    if (!accessCheck.hasAccess) {
      if (accessCheck.notFound) {
        logger.warn(
          `[${requestId}] ${accessCheck.reason}: KB=${knowledgeBaseId}, Doc=${documentId}`
        )
        return NextResponse.json({ error: accessCheck.reason }, { status: 404 })
      }
      logger.warn(
        `[${requestId}] User ${session.user.id} attempted unauthorized document access: ${accessCheck.reason}`
      )
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    logger.info(
      `[${requestId}] Retrieved document: ${documentId} from knowledge base ${knowledgeBaseId}`
    )

    return NextResponse.json({
      success: true,
      data: accessCheck.document,
    })
  } catch (error) {
    logger.error(`[${requestId}] Error fetching document`, error)
    return NextResponse.json({ error: 'Failed to fetch document' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; documentId: string }> }
) {
  const requestId = generateRequestId()
  const { id: knowledgeBaseId, documentId } = await params

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized document update attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const accessCheck = await checkDocumentWriteAccess(knowledgeBaseId, documentId, session.user.id)

    if (!accessCheck.hasAccess) {
      if (accessCheck.notFound) {
        logger.warn(
          `[${requestId}] ${accessCheck.reason}: KB=${knowledgeBaseId}, Doc=${documentId}`
        )
        return NextResponse.json({ error: accessCheck.reason }, { status: 404 })
      }
      logger.warn(
        `[${requestId}] User ${session.user.id} attempted unauthorized document update: ${accessCheck.reason}`
      )
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    try {
      const validatedData = UpdateDocumentSchema.parse(body)

      const updateData: any = {}

      if (validatedData.markFailedDueToTimeout) {
        const doc = accessCheck.document

        if (doc.processingStatus !== 'processing') {
          return NextResponse.json(
            { error: `Document is not in processing state (current: ${doc.processingStatus})` },
            { status: 400 }
          )
        }

        if (!doc.processingStartedAt) {
          return NextResponse.json(
            { error: 'Document has no processing start time' },
            { status: 400 }
          )
        }

        try {
          await markDocumentAsFailedTimeout(documentId, doc.processingStartedAt, requestId)

          return NextResponse.json({
            success: true,
            data: {
              documentId,
              status: 'failed',
              message: 'Document marked as failed due to timeout',
            },
          })
        } catch (error) {
          if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 400 })
          }
          throw error
        }
      } else if (validatedData.retryProcessing) {
        const doc = accessCheck.document

        if (doc.processingStatus !== 'failed') {
          return NextResponse.json({ error: 'Document is not in failed state' }, { status: 400 })
        }

        const docData = {
          filename: doc.filename,
          fileUrl: doc.fileUrl,
          fileSize: doc.fileSize,
          mimeType: doc.mimeType,
        }

        const result = await retryDocumentProcessing(
          knowledgeBaseId,
          documentId,
          docData,
          requestId
        )

        return NextResponse.json({
          success: true,
          data: {
            documentId,
            status: result.status,
            message: result.message,
          },
        })
      } else {
        const updatedDocument = await updateDocument(documentId, validatedData, requestId)

        logger.info(
          `[${requestId}] Document updated: ${documentId} in knowledge base ${knowledgeBaseId}`
        )

        return NextResponse.json({
          success: true,
          data: updatedDocument,
        })
      }
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        logger.warn(`[${requestId}] Invalid document update data`, {
          errors: validationError.errors,
          documentId,
        })
        return NextResponse.json(
          { error: 'Invalid request data', details: validationError.errors },
          { status: 400 }
        )
      }
      throw validationError
    }
  } catch (error) {
    logger.error(`[${requestId}] Error updating document ${documentId}`, error)
    return NextResponse.json({ error: 'Failed to update document' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; documentId: string }> }
) {
  const requestId = generateRequestId()
  const { id: knowledgeBaseId, documentId } = await params

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized document delete attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const accessCheck = await checkDocumentWriteAccess(knowledgeBaseId, documentId, session.user.id)

    if (!accessCheck.hasAccess) {
      if (accessCheck.notFound) {
        logger.warn(
          `[${requestId}] ${accessCheck.reason}: KB=${knowledgeBaseId}, Doc=${documentId}`
        )
        return NextResponse.json({ error: accessCheck.reason }, { status: 404 })
      }
      logger.warn(
        `[${requestId}] User ${session.user.id} attempted unauthorized document deletion: ${accessCheck.reason}`
      )
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await deleteDocument(documentId, requestId)

    logger.info(
      `[${requestId}] Document deleted: ${documentId} from knowledge base ${knowledgeBaseId}`
    )

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    logger.error(`[${requestId}] Error deleting document`, error)
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/knowledge/[id]/documents/[documentId]/chunks/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { generateRequestId } from '@/lib/core/utils/request'
import { batchChunkOperation, createChunk, queryChunks } from '@/lib/knowledge/chunks/service'
import { createLogger } from '@/lib/logs/console/logger'
import { getUserId } from '@/app/api/auth/oauth/utils'
import { checkDocumentAccess, checkDocumentWriteAccess } from '@/app/api/knowledge/utils'
import { calculateCost } from '@/providers/utils'

const logger = createLogger('DocumentChunksAPI')

const GetChunksQuerySchema = z.object({
  search: z.string().optional(),
  enabled: z.enum(['true', 'false', 'all']).optional().default('all'),
  limit: z.coerce.number().min(1).max(100).optional().default(50),
  offset: z.coerce.number().min(0).optional().default(0),
})

const CreateChunkSchema = z.object({
  content: z.string().min(1, 'Content is required').max(10000, 'Content too long'),
  enabled: z.boolean().optional().default(true),
})

const BatchOperationSchema = z.object({
  operation: z.enum(['enable', 'disable', 'delete']),
  chunkIds: z
    .array(z.string())
    .min(1, 'At least one chunk ID is required')
    .max(100, 'Cannot operate on more than 100 chunks at once'),
})

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; documentId: string }> }
) {
  const requestId = generateRequestId()
  const { id: knowledgeBaseId, documentId } = await params

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized chunks access attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const accessCheck = await checkDocumentAccess(knowledgeBaseId, documentId, session.user.id)

    if (!accessCheck.hasAccess) {
      if (accessCheck.notFound) {
        logger.warn(
          `[${requestId}] ${accessCheck.reason}: KB=${knowledgeBaseId}, Doc=${documentId}`
        )
        return NextResponse.json({ error: accessCheck.reason }, { status: 404 })
      }
      logger.warn(
        `[${requestId}] User ${session.user.id} attempted unauthorized chunks access: ${accessCheck.reason}`
      )
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const doc = accessCheck.document
    if (!doc) {
      logger.warn(
        `[${requestId}] Document data not available: KB=${knowledgeBaseId}, Doc=${documentId}`
      )
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    if (doc.processingStatus !== 'completed') {
      logger.warn(
        `[${requestId}] Document ${documentId} is not ready for chunk access (status: ${doc.processingStatus})`
      )
      return NextResponse.json(
        {
          error: 'Document is not ready for access',
          details: `Document status: ${doc.processingStatus}`,
          retryAfter: doc.processingStatus === 'processing' ? 5 : null,
        },
        { status: 400 }
      )
    }

    const { searchParams } = new URL(req.url)
    const queryParams = GetChunksQuerySchema.parse({
      search: searchParams.get('search') || undefined,
      enabled: searchParams.get('enabled') || undefined,
      limit: searchParams.get('limit') || undefined,
      offset: searchParams.get('offset') || undefined,
    })

    const result = await queryChunks(documentId, queryParams, requestId)

    return NextResponse.json({
      success: true,
      data: result.chunks,
      pagination: result.pagination,
    })
  } catch (error) {
    logger.error(`[${requestId}] Error fetching chunks`, error)
    return NextResponse.json({ error: 'Failed to fetch chunks' }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; documentId: string }> }
) {
  const requestId = generateRequestId()
  const { id: knowledgeBaseId, documentId } = await params

  try {
    const body = await req.json()
    const { workflowId, ...searchParams } = body

    const userId = await getUserId(requestId, workflowId)

    if (!userId) {
      const errorMessage = workflowId ? 'Workflow not found' : 'Unauthorized'
      const statusCode = workflowId ? 404 : 401
      logger.warn(`[${requestId}] Authentication failed: ${errorMessage}`)
      return NextResponse.json({ error: errorMessage }, { status: statusCode })
    }

    const accessCheck = await checkDocumentWriteAccess(knowledgeBaseId, documentId, userId)

    if (!accessCheck.hasAccess) {
      if (accessCheck.notFound) {
        logger.warn(
          `[${requestId}] ${accessCheck.reason}: KB=${knowledgeBaseId}, Doc=${documentId}`
        )
        return NextResponse.json({ error: accessCheck.reason }, { status: 404 })
      }
      logger.warn(
        `[${requestId}] User ${userId} attempted unauthorized chunk creation: ${accessCheck.reason}`
      )
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const doc = accessCheck.document
    if (!doc) {
      logger.warn(
        `[${requestId}] Document data not available: KB=${knowledgeBaseId}, Doc=${documentId}`
      )
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Allow manual chunk creation even if document is not fully processed
    // but it should exist and not be in failed state
    if (doc.processingStatus === 'failed') {
      logger.warn(`[${requestId}] Document ${documentId} is in failed state, cannot add chunks`)
      return NextResponse.json({ error: 'Cannot add chunks to failed document' }, { status: 400 })
    }

    try {
      const validatedData = CreateChunkSchema.parse(searchParams)

      const docTags = {
        tag1: doc.tag1 ?? null,
        tag2: doc.tag2 ?? null,
        tag3: doc.tag3 ?? null,
        tag4: doc.tag4 ?? null,
        tag5: doc.tag5 ?? null,
        tag6: doc.tag6 ?? null,
        tag7: doc.tag7 ?? null,
      }

      const newChunk = await createChunk(
        knowledgeBaseId,
        documentId,
        docTags,
        validatedData,
        requestId
      )

      let cost = null
      try {
        cost = calculateCost('text-embedding-3-small', newChunk.tokenCount, 0, false)
      } catch (error) {
        logger.warn(`[${requestId}] Failed to calculate cost for chunk upload`, {
          error: error instanceof Error ? error.message : 'Unknown error',
        })
        // Continue without cost information rather than failing the upload
      }

      return NextResponse.json({
        success: true,
        data: {
          ...newChunk,
          documentId,
          documentName: doc.filename,
          ...(cost
            ? {
                cost: {
                  input: cost.input,
                  output: cost.output,
                  total: cost.total,
                  tokens: {
                    prompt: newChunk.tokenCount,
                    completion: 0,
                    total: newChunk.tokenCount,
                  },
                  model: 'text-embedding-3-small',
                  pricing: cost.pricing,
                },
              }
            : {}),
        },
      })
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        logger.warn(`[${requestId}] Invalid chunk creation data`, {
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
    logger.error(`[${requestId}] Error creating chunk`, error)
    return NextResponse.json({ error: 'Failed to create chunk' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; documentId: string }> }
) {
  const requestId = generateRequestId()
  const { id: knowledgeBaseId, documentId } = await params

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized batch chunk operation attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const accessCheck = await checkDocumentAccess(knowledgeBaseId, documentId, session.user.id)

    if (!accessCheck.hasAccess) {
      if (accessCheck.notFound) {
        logger.warn(
          `[${requestId}] ${accessCheck.reason}: KB=${knowledgeBaseId}, Doc=${documentId}`
        )
        return NextResponse.json({ error: accessCheck.reason }, { status: 404 })
      }
      logger.warn(
        `[${requestId}] User ${session.user.id} attempted unauthorized batch chunk operation: ${accessCheck.reason}`
      )
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    try {
      const validatedData = BatchOperationSchema.parse(body)
      const { operation, chunkIds } = validatedData

      const result = await batchChunkOperation(documentId, operation, chunkIds, requestId)

      return NextResponse.json({
        success: true,
        data: {
          operation,
          successCount: result.processed,
          errorCount: result.errors.length,
          processed: result.processed,
          errors: result.errors,
        },
      })
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        logger.warn(`[${requestId}] Invalid batch operation data`, {
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
    logger.error(`[${requestId}] Error in batch chunk operation`, error)
    return NextResponse.json({ error: 'Failed to perform batch operation' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

````
