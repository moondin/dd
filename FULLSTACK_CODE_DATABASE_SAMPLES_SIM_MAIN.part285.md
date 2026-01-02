---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 285
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 285 of 933)

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
Location: sim-main/apps/sim/app/api/knowledge/[id]/documents/route.test.ts

```typescript
/**
 * Tests for knowledge base documents API route
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
  getDocuments: vi.fn(),
  createSingleDocument: vi.fn(),
  createDocumentRecords: vi.fn(),
  processDocumentsWithQueue: vi.fn(),
  getProcessingConfig: vi.fn(),
  bulkDocumentOperation: vi.fn(),
  updateDocument: vi.fn(),
  deleteDocument: vi.fn(),
  markDocumentAsFailedTimeout: vi.fn(),
  retryDocumentProcessing: vi.fn(),
}))

mockDrizzleOrm()
mockConsoleLogger()

describe('Knowledge Base Documents API Route', () => {
  const mockAuth$ = mockAuth()

  const mockDbChain = {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    offset: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
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
    processingStartedAt: new Date(),
    processingCompletedAt: new Date(),
    processingError: null,
    enabled: true,
    uploadedAt: new Date(),
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

  describe('GET /api/knowledge/[id]/documents', () => {
    const mockParams = Promise.resolve({ id: 'kb-123' })

    it('should retrieve documents successfully for authenticated user', async () => {
      const { checkKnowledgeBaseAccess } = await import('@/app/api/knowledge/utils')
      const { getDocuments } = await import('@/lib/knowledge/documents/service')

      mockAuth$.mockAuthenticatedUser()
      vi.mocked(checkKnowledgeBaseAccess).mockResolvedValue({
        hasAccess: true,
        knowledgeBase: { id: 'kb-123', userId: 'user-123' },
      })

      vi.mocked(getDocuments).mockResolvedValue({
        documents: [mockDocument],
        pagination: {
          total: 1,
          limit: 50,
          offset: 0,
          hasMore: false,
        },
      })

      const req = createMockRequest('GET')
      const { GET } = await import('@/app/api/knowledge/[id]/documents/route')
      const response = await GET(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.documents).toHaveLength(1)
      expect(data.data.documents[0].id).toBe('doc-123')
      expect(vi.mocked(checkKnowledgeBaseAccess)).toHaveBeenCalledWith('kb-123', 'user-123')
      expect(vi.mocked(getDocuments)).toHaveBeenCalledWith(
        'kb-123',
        {
          includeDisabled: false,
          search: undefined,
          limit: 50,
          offset: 0,
        },
        expect.any(String)
      )
    })

    it('should filter disabled documents by default', async () => {
      const { checkKnowledgeBaseAccess } = await import('@/app/api/knowledge/utils')
      const { getDocuments } = await import('@/lib/knowledge/documents/service')

      mockAuth$.mockAuthenticatedUser()
      vi.mocked(checkKnowledgeBaseAccess).mockResolvedValue({
        hasAccess: true,
        knowledgeBase: { id: 'kb-123', userId: 'user-123' },
      })

      vi.mocked(getDocuments).mockResolvedValue({
        documents: [mockDocument],
        pagination: {
          total: 1,
          limit: 50,
          offset: 0,
          hasMore: false,
        },
      })

      const req = createMockRequest('GET')
      const { GET } = await import('@/app/api/knowledge/[id]/documents/route')
      const response = await GET(req, { params: mockParams })

      expect(response.status).toBe(200)
      expect(vi.mocked(getDocuments)).toHaveBeenCalledWith(
        'kb-123',
        {
          includeDisabled: false,
          search: undefined,
          limit: 50,
          offset: 0,
        },
        expect.any(String)
      )
    })

    it('should include disabled documents when requested', async () => {
      const { checkKnowledgeBaseAccess } = await import('@/app/api/knowledge/utils')
      const { getDocuments } = await import('@/lib/knowledge/documents/service')

      mockAuth$.mockAuthenticatedUser()
      vi.mocked(checkKnowledgeBaseAccess).mockResolvedValue({
        hasAccess: true,
        knowledgeBase: { id: 'kb-123', userId: 'user-123' },
      })

      vi.mocked(getDocuments).mockResolvedValue({
        documents: [mockDocument],
        pagination: {
          total: 1,
          limit: 50,
          offset: 0,
          hasMore: false,
        },
      })

      const url = 'http://localhost:3000/api/knowledge/kb-123/documents?includeDisabled=true'
      const req = new Request(url, { method: 'GET' }) as any

      const { GET } = await import('@/app/api/knowledge/[id]/documents/route')
      const response = await GET(req, { params: mockParams })

      expect(response.status).toBe(200)
      expect(vi.mocked(getDocuments)).toHaveBeenCalledWith(
        'kb-123',
        {
          includeDisabled: true,
          search: undefined,
          limit: 50,
          offset: 0,
        },
        expect.any(String)
      )
    })

    it('should return unauthorized for unauthenticated user', async () => {
      mockAuth$.mockUnauthenticated()

      const req = createMockRequest('GET')
      const { GET } = await import('@/app/api/knowledge/[id]/documents/route')
      const response = await GET(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return not found for non-existent knowledge base', async () => {
      const { checkKnowledgeBaseAccess } = await import('@/app/api/knowledge/utils')

      mockAuth$.mockAuthenticatedUser()
      vi.mocked(checkKnowledgeBaseAccess).mockResolvedValue({
        hasAccess: false,
        notFound: true,
      })

      const req = createMockRequest('GET')
      const { GET } = await import('@/app/api/knowledge/[id]/documents/route')
      const response = await GET(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Knowledge base not found')
    })

    it('should return unauthorized for knowledge base without access', async () => {
      const { checkKnowledgeBaseAccess } = await import('@/app/api/knowledge/utils')

      mockAuth$.mockAuthenticatedUser()
      vi.mocked(checkKnowledgeBaseAccess).mockResolvedValue({ hasAccess: false })

      const req = createMockRequest('GET')
      const { GET } = await import('@/app/api/knowledge/[id]/documents/route')
      const response = await GET(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should handle database errors', async () => {
      const { checkKnowledgeBaseAccess } = await import('@/app/api/knowledge/utils')
      const { getDocuments } = await import('@/lib/knowledge/documents/service')

      mockAuth$.mockAuthenticatedUser()
      vi.mocked(checkKnowledgeBaseAccess).mockResolvedValue({
        hasAccess: true,
        knowledgeBase: { id: 'kb-123', userId: 'user-123' },
      })
      vi.mocked(getDocuments).mockRejectedValue(new Error('Database error'))

      const req = createMockRequest('GET')
      const { GET } = await import('@/app/api/knowledge/[id]/documents/route')
      const response = await GET(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to fetch documents')
    })
  })

  describe('POST /api/knowledge/[id]/documents - Single Document', () => {
    const mockParams = Promise.resolve({ id: 'kb-123' })
    const validDocumentData = {
      filename: 'test-document.pdf',
      fileUrl: 'https://example.com/test-document.pdf',
      fileSize: 1024,
      mimeType: 'application/pdf',
    }

    it('should create single document successfully', async () => {
      const { checkKnowledgeBaseWriteAccess } = await import('@/app/api/knowledge/utils')
      const { createSingleDocument } = await import('@/lib/knowledge/documents/service')

      mockAuth$.mockAuthenticatedUser()
      vi.mocked(checkKnowledgeBaseWriteAccess).mockResolvedValue({
        hasAccess: true,
        knowledgeBase: { id: 'kb-123', userId: 'user-123' },
      })

      const createdDocument = {
        id: 'doc-123',
        knowledgeBaseId: 'kb-123',
        filename: validDocumentData.filename,
        fileUrl: validDocumentData.fileUrl,
        fileSize: validDocumentData.fileSize,
        mimeType: validDocumentData.mimeType,
        chunkCount: 0,
        tokenCount: 0,
        characterCount: 0,
        enabled: true,
        uploadedAt: new Date(),
        tag1: null,
        tag2: null,
        tag3: null,
        tag4: null,
        tag5: null,
        tag6: null,
        tag7: null,
      }
      vi.mocked(createSingleDocument).mockResolvedValue(createdDocument)

      const req = createMockRequest('POST', validDocumentData)
      const { POST } = await import('@/app/api/knowledge/[id]/documents/route')
      const response = await POST(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.filename).toBe(validDocumentData.filename)
      expect(data.data.fileUrl).toBe(validDocumentData.fileUrl)
      expect(vi.mocked(createSingleDocument)).toHaveBeenCalledWith(
        validDocumentData,
        'kb-123',
        expect.any(String),
        'user-123'
      )
    })

    it('should validate single document data', async () => {
      const { checkKnowledgeBaseWriteAccess } = await import('@/app/api/knowledge/utils')

      mockAuth$.mockAuthenticatedUser()
      vi.mocked(checkKnowledgeBaseWriteAccess).mockResolvedValue({
        hasAccess: true,
        knowledgeBase: { id: 'kb-123', userId: 'user-123' },
      })

      const invalidData = {
        filename: '', // Invalid: empty filename
        fileUrl: 'invalid-url', // Invalid: not a valid URL
        fileSize: 0, // Invalid: size must be > 0
        mimeType: '', // Invalid: empty mime type
      }

      const req = createMockRequest('POST', invalidData)
      const { POST } = await import('@/app/api/knowledge/[id]/documents/route')
      const response = await POST(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid request data')
      expect(data.details).toBeDefined()
    })
  })

  describe('POST /api/knowledge/[id]/documents - Bulk Documents', () => {
    const mockParams = Promise.resolve({ id: 'kb-123' })
    const validBulkData = {
      bulk: true,
      documents: [
        {
          filename: 'doc1.pdf',
          fileUrl: 'https://example.com/doc1.pdf',
          fileSize: 1024,
          mimeType: 'application/pdf',
        },
        {
          filename: 'doc2.pdf',
          fileUrl: 'https://example.com/doc2.pdf',
          fileSize: 2048,
          mimeType: 'application/pdf',
        },
      ],
      processingOptions: {
        chunkSize: 1024,
        minCharactersPerChunk: 100,
        recipe: 'default',
        lang: 'en',
        chunkOverlap: 200,
      },
    }

    it('should create bulk documents successfully', async () => {
      const { checkKnowledgeBaseWriteAccess } = await import('@/app/api/knowledge/utils')
      const { createDocumentRecords, processDocumentsWithQueue, getProcessingConfig } =
        await import('@/lib/knowledge/documents/service')

      mockAuth$.mockAuthenticatedUser()
      vi.mocked(checkKnowledgeBaseWriteAccess).mockResolvedValue({
        hasAccess: true,
        knowledgeBase: { id: 'kb-123', userId: 'user-123' },
      })

      const createdDocuments = [
        {
          documentId: 'doc-1',
          filename: 'doc1.pdf',
          fileUrl: 'https://example.com/doc1.pdf',
          fileSize: 1024,
          mimeType: 'application/pdf',
        },
        {
          documentId: 'doc-2',
          filename: 'doc2.pdf',
          fileUrl: 'https://example.com/doc2.pdf',
          fileSize: 2048,
          mimeType: 'application/pdf',
        },
      ]

      vi.mocked(createDocumentRecords).mockResolvedValue(createdDocuments)
      vi.mocked(processDocumentsWithQueue).mockResolvedValue(undefined)
      vi.mocked(getProcessingConfig).mockReturnValue({
        maxConcurrentDocuments: 8,
        batchSize: 20,
        delayBetweenBatches: 100,
        delayBetweenDocuments: 0,
      })

      const req = createMockRequest('POST', validBulkData)
      const { POST } = await import('@/app/api/knowledge/[id]/documents/route')
      const response = await POST(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.total).toBe(2)
      expect(data.data.documentsCreated).toHaveLength(2)
      expect(data.data.processingMethod).toBe('background')
      expect(vi.mocked(createDocumentRecords)).toHaveBeenCalledWith(
        validBulkData.documents,
        'kb-123',
        expect.any(String),
        'user-123'
      )
      expect(vi.mocked(processDocumentsWithQueue)).toHaveBeenCalled()
    })

    it('should validate bulk document data', async () => {
      const { checkKnowledgeBaseWriteAccess } = await import('@/app/api/knowledge/utils')

      mockAuth$.mockAuthenticatedUser()
      vi.mocked(checkKnowledgeBaseWriteAccess).mockResolvedValue({
        hasAccess: true,
        knowledgeBase: { id: 'kb-123', userId: 'user-123' },
      })

      const invalidBulkData = {
        bulk: true,
        documents: [
          {
            filename: '', // Invalid: empty filename
            fileUrl: 'invalid-url',
            fileSize: 0,
            mimeType: '',
          },
        ],
        processingOptions: {
          chunkSize: 50, // Invalid: too small
          minCharactersPerChunk: 0, // Invalid: too small
          recipe: 'default',
          lang: 'en',
          chunkOverlap: 1000, // Invalid: too large
        },
      }

      const req = createMockRequest('POST', invalidBulkData)
      const { POST } = await import('@/app/api/knowledge/[id]/documents/route')
      const response = await POST(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid request data')
      expect(data.details).toBeDefined()
    })

    it('should handle processing errors gracefully', async () => {
      const { checkKnowledgeBaseWriteAccess } = await import('@/app/api/knowledge/utils')
      const { createDocumentRecords, processDocumentsWithQueue, getProcessingConfig } =
        await import('@/lib/knowledge/documents/service')

      mockAuth$.mockAuthenticatedUser()
      vi.mocked(checkKnowledgeBaseWriteAccess).mockResolvedValue({
        hasAccess: true,
        knowledgeBase: { id: 'kb-123', userId: 'user-123' },
      })

      const createdDocuments = [
        {
          documentId: 'doc-1',
          filename: 'doc1.pdf',
          fileUrl: 'https://example.com/doc1.pdf',
          fileSize: 1024,
          mimeType: 'application/pdf',
        },
      ]

      vi.mocked(createDocumentRecords).mockResolvedValue(createdDocuments)
      vi.mocked(processDocumentsWithQueue).mockResolvedValue(undefined)
      vi.mocked(getProcessingConfig).mockReturnValue({
        maxConcurrentDocuments: 8,
        batchSize: 20,
        delayBetweenBatches: 100,
        delayBetweenDocuments: 0,
      })

      const req = createMockRequest('POST', validBulkData)
      const { POST } = await import('@/app/api/knowledge/[id]/documents/route')
      const response = await POST(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })
  })

  describe('POST /api/knowledge/[id]/documents - Authentication & Authorization', () => {
    const mockParams = Promise.resolve({ id: 'kb-123' })
    const validDocumentData = {
      filename: 'test-document.pdf',
      fileUrl: 'https://example.com/test-document.pdf',
      fileSize: 1024,
      mimeType: 'application/pdf',
    }

    it('should return unauthorized for unauthenticated user', async () => {
      mockAuth$.mockUnauthenticated()

      const req = createMockRequest('POST', validDocumentData)
      const { POST } = await import('@/app/api/knowledge/[id]/documents/route')
      const response = await POST(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return not found for non-existent knowledge base', async () => {
      const { checkKnowledgeBaseWriteAccess } = await import('@/app/api/knowledge/utils')

      mockAuth$.mockAuthenticatedUser()
      vi.mocked(checkKnowledgeBaseWriteAccess).mockResolvedValue({
        hasAccess: false,
        notFound: true,
      })

      const req = createMockRequest('POST', validDocumentData)
      const { POST } = await import('@/app/api/knowledge/[id]/documents/route')
      const response = await POST(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Knowledge base not found')
    })

    it('should return unauthorized for knowledge base without access', async () => {
      const { checkKnowledgeBaseWriteAccess } = await import('@/app/api/knowledge/utils')

      mockAuth$.mockAuthenticatedUser()
      vi.mocked(checkKnowledgeBaseWriteAccess).mockResolvedValue({ hasAccess: false })

      const req = createMockRequest('POST', validDocumentData)
      const { POST } = await import('@/app/api/knowledge/[id]/documents/route')
      const response = await POST(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should handle database errors during creation', async () => {
      const { checkKnowledgeBaseWriteAccess } = await import('@/app/api/knowledge/utils')
      const { createSingleDocument } = await import('@/lib/knowledge/documents/service')

      mockAuth$.mockAuthenticatedUser()
      vi.mocked(checkKnowledgeBaseWriteAccess).mockResolvedValue({
        hasAccess: true,
        knowledgeBase: { id: 'kb-123', userId: 'user-123' },
      })
      vi.mocked(createSingleDocument).mockRejectedValue(new Error('Database error'))

      const req = createMockRequest('POST', validDocumentData)
      const { POST } = await import('@/app/api/knowledge/[id]/documents/route')
      const response = await POST(req, { params: mockParams })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Database error')
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/knowledge/[id]/documents/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import {
  bulkDocumentOperation,
  createDocumentRecords,
  createSingleDocument,
  getDocuments,
  getProcessingConfig,
  processDocumentsWithQueue,
} from '@/lib/knowledge/documents/service'
import type { DocumentSortField, SortOrder } from '@/lib/knowledge/documents/types'
import { createLogger } from '@/lib/logs/console/logger'
import { getUserId } from '@/app/api/auth/oauth/utils'
import { checkKnowledgeBaseAccess, checkKnowledgeBaseWriteAccess } from '@/app/api/knowledge/utils'

const logger = createLogger('DocumentsAPI')

const CreateDocumentSchema = z.object({
  filename: z.string().min(1, 'Filename is required'),
  fileUrl: z.string().url('File URL must be valid'),
  fileSize: z.number().min(1, 'File size must be greater than 0'),
  mimeType: z.string().min(1, 'MIME type is required'),
  // Document tags for filtering (legacy format)
  tag1: z.string().optional(),
  tag2: z.string().optional(),
  tag3: z.string().optional(),
  tag4: z.string().optional(),
  tag5: z.string().optional(),
  tag6: z.string().optional(),
  tag7: z.string().optional(),
  // Structured tag data (new format)
  documentTagsData: z.string().optional(),
})

const BulkCreateDocumentsSchema = z.object({
  documents: z.array(CreateDocumentSchema),
  processingOptions: z.object({
    chunkSize: z.number().min(100).max(4000),
    minCharactersPerChunk: z.number().min(1).max(2000),
    recipe: z.string(),
    lang: z.string(),
    chunkOverlap: z.number().min(0).max(500),
  }),
  bulk: z.literal(true),
})

const BulkUpdateDocumentsSchema = z.object({
  operation: z.enum(['enable', 'disable', 'delete']),
  documentIds: z
    .array(z.string())
    .min(1, 'At least one document ID is required')
    .max(100, 'Cannot operate on more than 100 documents at once'),
})

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = randomUUID().slice(0, 8)
  const { id: knowledgeBaseId } = await params

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized documents access attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const accessCheck = await checkKnowledgeBaseAccess(knowledgeBaseId, session.user.id)

    if (!accessCheck.hasAccess) {
      if ('notFound' in accessCheck && accessCheck.notFound) {
        logger.warn(`[${requestId}] Knowledge base not found: ${knowledgeBaseId}`)
        return NextResponse.json({ error: 'Knowledge base not found' }, { status: 404 })
      }
      logger.warn(
        `[${requestId}] User ${session.user.id} attempted to access unauthorized knowledge base documents ${knowledgeBaseId}`
      )
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(req.url)
    const includeDisabled = url.searchParams.get('includeDisabled') === 'true'
    const search = url.searchParams.get('search') || undefined
    const limit = Number.parseInt(url.searchParams.get('limit') || '50')
    const offset = Number.parseInt(url.searchParams.get('offset') || '0')
    const sortByParam = url.searchParams.get('sortBy')
    const sortOrderParam = url.searchParams.get('sortOrder')

    // Validate sort parameters
    const validSortFields: DocumentSortField[] = [
      'filename',
      'fileSize',
      'tokenCount',
      'chunkCount',
      'uploadedAt',
      'processingStatus',
    ]
    const validSortOrders: SortOrder[] = ['asc', 'desc']

    const sortBy =
      sortByParam && validSortFields.includes(sortByParam as DocumentSortField)
        ? (sortByParam as DocumentSortField)
        : undefined
    const sortOrder =
      sortOrderParam && validSortOrders.includes(sortOrderParam as SortOrder)
        ? (sortOrderParam as SortOrder)
        : undefined

    const result = await getDocuments(
      knowledgeBaseId,
      {
        includeDisabled,
        search,
        limit,
        offset,
        ...(sortBy && { sortBy }),
        ...(sortOrder && { sortOrder }),
      },
      requestId
    )

    return NextResponse.json({
      success: true,
      data: {
        documents: result.documents,
        pagination: result.pagination,
      },
    })
  } catch (error) {
    logger.error(`[${requestId}] Error fetching documents`, error)
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = randomUUID().slice(0, 8)
  const { id: knowledgeBaseId } = await params

  try {
    const body = await req.json()
    const { workflowId } = body

    logger.info(`[${requestId}] Knowledge base document creation request`, {
      knowledgeBaseId,
      workflowId,
      hasWorkflowId: !!workflowId,
      bodyKeys: Object.keys(body),
    })

    const userId = await getUserId(requestId, workflowId)

    if (!userId) {
      const errorMessage = workflowId ? 'Workflow not found' : 'Unauthorized'
      const statusCode = workflowId ? 404 : 401
      logger.warn(`[${requestId}] Authentication failed: ${errorMessage}`, {
        workflowId,
        hasWorkflowId: !!workflowId,
      })
      return NextResponse.json({ error: errorMessage }, { status: statusCode })
    }

    const accessCheck = await checkKnowledgeBaseWriteAccess(knowledgeBaseId, userId)

    if (!accessCheck.hasAccess) {
      if ('notFound' in accessCheck && accessCheck.notFound) {
        logger.warn(`[${requestId}] Knowledge base not found: ${knowledgeBaseId}`)
        return NextResponse.json({ error: 'Knowledge base not found' }, { status: 404 })
      }
      logger.warn(
        `[${requestId}] User ${userId} attempted to create document in unauthorized knowledge base ${knowledgeBaseId}`
      )
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (body.bulk === true) {
      try {
        const validatedData = BulkCreateDocumentsSchema.parse(body)

        const createdDocuments = await createDocumentRecords(
          validatedData.documents,
          knowledgeBaseId,
          requestId,
          userId
        )

        logger.info(
          `[${requestId}] Starting controlled async processing of ${createdDocuments.length} documents`
        )

        // Track bulk document upload
        try {
          const { trackPlatformEvent } = await import('@/lib/core/telemetry')
          trackPlatformEvent('platform.knowledge_base.documents_uploaded', {
            'knowledge_base.id': knowledgeBaseId,
            'documents.count': createdDocuments.length,
            'documents.upload_type': 'bulk',
            'processing.chunk_size': validatedData.processingOptions.chunkSize,
            'processing.recipe': validatedData.processingOptions.recipe,
          })
        } catch (_e) {
          // Silently fail
        }

        processDocumentsWithQueue(
          createdDocuments,
          knowledgeBaseId,
          validatedData.processingOptions,
          requestId
        ).catch((error: unknown) => {
          logger.error(`[${requestId}] Critical error in document processing pipeline:`, error)
        })

        return NextResponse.json({
          success: true,
          data: {
            total: createdDocuments.length,
            documentsCreated: createdDocuments.map((doc) => ({
              documentId: doc.documentId,
              filename: doc.filename,
              status: 'pending',
            })),
            processingMethod: 'background',
            processingConfig: {
              maxConcurrentDocuments: getProcessingConfig().maxConcurrentDocuments,
              batchSize: getProcessingConfig().batchSize,
              totalBatches: Math.ceil(createdDocuments.length / getProcessingConfig().batchSize),
            },
          },
        })
      } catch (validationError) {
        if (validationError instanceof z.ZodError) {
          logger.warn(`[${requestId}] Invalid bulk processing request data`, {
            errors: validationError.errors,
          })
          return NextResponse.json(
            { error: 'Invalid request data', details: validationError.errors },
            { status: 400 }
          )
        }
        throw validationError
      }
    } else {
      // Handle single document creation
      try {
        const validatedData = CreateDocumentSchema.parse(body)

        const newDocument = await createSingleDocument(
          validatedData,
          knowledgeBaseId,
          requestId,
          userId
        )

        // Track single document upload
        try {
          const { trackPlatformEvent } = await import('@/lib/core/telemetry')
          trackPlatformEvent('platform.knowledge_base.documents_uploaded', {
            'knowledge_base.id': knowledgeBaseId,
            'documents.count': 1,
            'documents.upload_type': 'single',
            'document.mime_type': validatedData.mimeType,
            'document.file_size': validatedData.fileSize,
          })
        } catch (_e) {
          // Silently fail
        }

        return NextResponse.json({
          success: true,
          data: newDocument,
        })
      } catch (validationError) {
        if (validationError instanceof z.ZodError) {
          logger.warn(`[${requestId}] Invalid document data`, {
            errors: validationError.errors,
          })
          return NextResponse.json(
            { error: 'Invalid request data', details: validationError.errors },
            { status: 400 }
          )
        }
        throw validationError
      }
    }
  } catch (error) {
    logger.error(`[${requestId}] Error creating document`, error)

    // Check if it's a storage limit error
    const errorMessage = error instanceof Error ? error.message : 'Failed to create document'
    const isStorageLimitError =
      errorMessage.includes('Storage limit exceeded') || errorMessage.includes('storage limit')

    return NextResponse.json({ error: errorMessage }, { status: isStorageLimitError ? 413 : 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = randomUUID().slice(0, 8)
  const { id: knowledgeBaseId } = await params

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized bulk document operation attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const accessCheck = await checkKnowledgeBaseWriteAccess(knowledgeBaseId, session.user.id)

    if (!accessCheck.hasAccess) {
      if ('notFound' in accessCheck && accessCheck.notFound) {
        logger.warn(`[${requestId}] Knowledge base not found: ${knowledgeBaseId}`)
        return NextResponse.json({ error: 'Knowledge base not found' }, { status: 404 })
      }
      logger.warn(
        `[${requestId}] User ${session.user.id} attempted to perform bulk operation on unauthorized knowledge base ${knowledgeBaseId}`
      )
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    try {
      const validatedData = BulkUpdateDocumentsSchema.parse(body)
      const { operation, documentIds } = validatedData

      try {
        const result = await bulkDocumentOperation(
          knowledgeBaseId,
          operation,
          documentIds,
          requestId,
          session.user.id
        )

        return NextResponse.json({
          success: true,
          data: {
            operation,
            successCount: result.successCount,
            updatedDocuments: result.updatedDocuments,
          },
        })
      } catch (error) {
        if (error instanceof Error && error.message === 'No valid documents found to update') {
          return NextResponse.json({ error: 'No valid documents found to update' }, { status: 404 })
        }
        throw error
      }
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        logger.warn(`[${requestId}] Invalid bulk operation data`, {
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
    logger.error(`[${requestId}] Error in bulk document operation`, error)
    return NextResponse.json({ error: 'Failed to perform bulk operation' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

````
