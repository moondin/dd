---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 281
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 281 of 933)

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
Location: sim-main/apps/sim/app/api/help/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { renderHelpConfirmationEmail } from '@/components/emails'
import { getSession } from '@/lib/auth'
import { env } from '@/lib/core/config/env'
import { generateRequestId } from '@/lib/core/utils/request'
import { getEmailDomain } from '@/lib/core/utils/urls'
import { createLogger } from '@/lib/logs/console/logger'
import { sendEmail } from '@/lib/messaging/email/mailer'
import { getFromEmailAddress } from '@/lib/messaging/email/utils'

const logger = createLogger('HelpAPI')

const helpFormSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
  type: z.enum(['bug', 'feedback', 'feature_request', 'other']),
})

export async function POST(req: NextRequest) {
  const requestId = generateRequestId()

  try {
    // Get user session
    const session = await getSession()
    if (!session?.user?.email) {
      logger.warn(`[${requestId}] Unauthorized help request attempt`)
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const email = session.user.email

    // Handle multipart form data
    const formData = await req.formData()

    // Extract form fields
    const subject = formData.get('subject') as string
    const message = formData.get('message') as string
    const type = formData.get('type') as string

    logger.info(`[${requestId}] Processing help request`, {
      type,
      email: `${email.substring(0, 3)}***`, // Log partial email for privacy
    })

    // Validate the form data
    const validationResult = helpFormSchema.safeParse({
      subject,
      message,
      type,
    })

    if (!validationResult.success) {
      logger.warn(`[${requestId}] Invalid help request data`, {
        errors: validationResult.error.format(),
      })
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400 }
      )
    }

    // Extract images
    const images: { filename: string; content: Buffer; contentType: string }[] = []

    for (const [key, value] of formData.entries()) {
      if (key.startsWith('image_') && typeof value !== 'string') {
        if (value && 'arrayBuffer' in value) {
          const blob = value as unknown as Blob
          const buffer = Buffer.from(await blob.arrayBuffer())
          const filename = 'name' in value ? (value as any).name : `image_${key.split('_')[1]}`

          images.push({
            filename,
            content: buffer,
            contentType: 'type' in value ? (value as any).type : 'application/octet-stream',
          })
        }
      }
    }

    logger.debug(`[${requestId}] Help request includes ${images.length} images`)

    // Prepare email content
    let emailText = `
Type: ${type}
From: ${email}

${message}
    `

    if (images.length > 0) {
      emailText += `\n\n${images.length} image(s) attached.`
    }

    const emailResult = await sendEmail({
      to: [`help@${env.EMAIL_DOMAIN || getEmailDomain()}`],
      subject: `[${type.toUpperCase()}] ${subject}`,
      text: emailText,
      from: getFromEmailAddress(),
      replyTo: email,
      emailType: 'transactional',
      attachments: images.map((image) => ({
        filename: image.filename,
        content: image.content.toString('base64'),
        contentType: image.contentType,
        disposition: 'attachment',
      })),
    })

    if (!emailResult.success) {
      logger.error(`[${requestId}] Error sending help request email`, emailResult.message)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    logger.info(`[${requestId}] Help request email sent successfully`)

    // Send confirmation email to the user
    try {
      const confirmationHtml = await renderHelpConfirmationEmail(
        email,
        type as 'bug' | 'feedback' | 'feature_request' | 'other',
        images.length
      )

      await sendEmail({
        to: [email],
        subject: `Your ${type} request has been received: ${subject}`,
        html: confirmationHtml,
        from: getFromEmailAddress(),
        replyTo: `help@${env.EMAIL_DOMAIN || getEmailDomain()}`,
        emailType: 'transactional',
      })
    } catch (err) {
      logger.warn(`[${requestId}] Failed to send confirmation email`, err)
    }

    return NextResponse.json(
      { success: true, message: 'Help request submitted successfully' },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof Error && error.message.includes('not configured')) {
      logger.error(`[${requestId}] Email service configuration error`, error)
      return NextResponse.json(
        {
          error:
            'Email service configuration error. Please check your email service configuration.',
        },
        { status: 500 }
      )
    }

    logger.error(`[${requestId}] Error processing help request`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/jobs/[jobId]/route.ts
Signals: Next.js

```typescript
import { runs } from '@trigger.dev/sdk'
import { type NextRequest, NextResponse } from 'next/server'
import { authenticateApiKeyFromHeader, updateApiKeyLastUsed } from '@/lib/api-key/service'
import { getSession } from '@/lib/auth'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { createErrorResponse } from '@/app/api/workflows/utils'

const logger = createLogger('TaskStatusAPI')

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId: taskId } = await params
  const requestId = generateRequestId()

  try {
    logger.debug(`[${requestId}] Getting status for task: ${taskId}`)

    // Try session auth first (for web UI)
    const session = await getSession()
    let authenticatedUserId: string | null = session?.user?.id || null

    if (!authenticatedUserId) {
      const apiKeyHeader = request.headers.get('x-api-key')
      if (apiKeyHeader) {
        const authResult = await authenticateApiKeyFromHeader(apiKeyHeader)
        if (authResult.success && authResult.userId) {
          authenticatedUserId = authResult.userId
          if (authResult.keyId) {
            await updateApiKeyLastUsed(authResult.keyId).catch((error) => {
              logger.warn(`[${requestId}] Failed to update API key last used timestamp:`, {
                keyId: authResult.keyId,
                error,
              })
            })
          }
        }
      }
    }

    if (!authenticatedUserId) {
      return createErrorResponse('Authentication required', 401)
    }

    // Fetch task status from Trigger.dev
    const run = await runs.retrieve(taskId)

    logger.debug(`[${requestId}] Task ${taskId} status: ${run.status}`)

    // Map Trigger.dev status to our format
    const statusMap = {
      QUEUED: 'queued',
      WAITING_FOR_DEPLOY: 'queued',
      EXECUTING: 'processing',
      RESCHEDULED: 'processing',
      FROZEN: 'processing',
      COMPLETED: 'completed',
      CANCELED: 'cancelled',
      FAILED: 'failed',
      CRASHED: 'failed',
      INTERRUPTED: 'failed',
      SYSTEM_FAILURE: 'failed',
      EXPIRED: 'failed',
    } as const

    const mappedStatus = statusMap[run.status as keyof typeof statusMap] || 'unknown'

    // Build response based on status
    const response: any = {
      success: true,
      taskId,
      status: mappedStatus,
      metadata: {
        startedAt: run.startedAt,
      },
    }

    // Add completion details if finished
    if (mappedStatus === 'completed') {
      response.output = run.output // This contains the workflow execution results
      response.metadata.completedAt = run.finishedAt
      response.metadata.duration = run.durationMs
    }

    // Add error details if failed
    if (mappedStatus === 'failed') {
      response.error = run.error
      response.metadata.completedAt = run.finishedAt
      response.metadata.duration = run.durationMs
    }

    // Add progress info if still processing
    if (mappedStatus === 'processing' || mappedStatus === 'queued') {
      response.estimatedDuration = 180000 // 3 minutes max from our config
    }

    return NextResponse.json(response)
  } catch (error: any) {
    logger.error(`[${requestId}] Error fetching task status:`, error)

    if (error.message?.includes('not found') || error.status === 404) {
      return createErrorResponse('Task not found', 404)
    }

    return createErrorResponse('Failed to fetch task status', 500)
  }
}

// TODO: Implement task cancellation via Trigger.dev API if needed
// export async function DELETE() { ... }
```

--------------------------------------------------------------------------------

---[FILE: route.test.ts]---
Location: sim-main/apps/sim/app/api/knowledge/route.test.ts

```typescript
/**
 * Tests for knowledge base API route
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

describe('Knowledge Base API Route', () => {
  const mockAuth$ = mockAuth()

  const mockDbChain = {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    leftJoin: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    groupBy: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockResolvedValue([]),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockResolvedValue(undefined),
  }

  beforeEach(async () => {
    vi.clearAllMocks()

    vi.doMock('@sim/db', () => ({
      db: mockDbChain,
    }))

    Object.values(mockDbChain).forEach((fn) => {
      if (typeof fn === 'function') {
        fn.mockClear()
        if (fn !== mockDbChain.orderBy && fn !== mockDbChain.values) {
          fn.mockReturnThis()
        }
      }
    })

    vi.stubGlobal('crypto', {
      randomUUID: vi.fn().mockReturnValue('mock-uuid-1234-5678'),
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/knowledge', () => {
    it('should return unauthorized for unauthenticated user', async () => {
      mockAuth$.mockUnauthenticated()

      const req = createMockRequest('GET')
      const { GET } = await import('@/app/api/knowledge/route')
      const response = await GET(req)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should handle database errors', async () => {
      mockAuth$.mockAuthenticatedUser()
      mockDbChain.orderBy.mockRejectedValue(new Error('Database error'))

      const req = createMockRequest('GET')
      const { GET } = await import('@/app/api/knowledge/route')
      const response = await GET(req)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to fetch knowledge bases')
    })
  })

  describe('POST /api/knowledge', () => {
    const validKnowledgeBaseData = {
      name: 'Test Knowledge Base',
      description: 'Test description',
      chunkingConfig: {
        maxSize: 1024,
        minSize: 100,
        overlap: 200,
      },
    }

    it('should create knowledge base successfully', async () => {
      mockAuth$.mockAuthenticatedUser()

      const req = createMockRequest('POST', validKnowledgeBaseData)
      const { POST } = await import('@/app/api/knowledge/route')
      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.name).toBe(validKnowledgeBaseData.name)
      expect(data.data.description).toBe(validKnowledgeBaseData.description)
      expect(mockDbChain.insert).toHaveBeenCalled()
    })

    it('should return unauthorized for unauthenticated user', async () => {
      mockAuth$.mockUnauthenticated()

      const req = createMockRequest('POST', validKnowledgeBaseData)
      const { POST } = await import('@/app/api/knowledge/route')
      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should validate required fields', async () => {
      mockAuth$.mockAuthenticatedUser()

      const req = createMockRequest('POST', { description: 'Missing name' })
      const { POST } = await import('@/app/api/knowledge/route')
      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid request data')
      expect(data.details).toBeDefined()
    })

    it('should validate chunking config constraints', async () => {
      mockAuth$.mockAuthenticatedUser()

      const invalidData = {
        name: 'Test KB',
        chunkingConfig: {
          maxSize: 100,
          minSize: 200, // Invalid: minSize > maxSize
          overlap: 50,
        },
      }

      const req = createMockRequest('POST', invalidData)
      const { POST } = await import('@/app/api/knowledge/route')
      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid request data')
    })

    it('should use default values for optional fields', async () => {
      mockAuth$.mockAuthenticatedUser()

      const minimalData = { name: 'Test KB' }
      const req = createMockRequest('POST', minimalData)
      const { POST } = await import('@/app/api/knowledge/route')
      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.embeddingModel).toBe('text-embedding-3-small')
      expect(data.data.embeddingDimension).toBe(1536)
      expect(data.data.chunkingConfig).toEqual({
        maxSize: 1024,
        minSize: 1,
        overlap: 200,
      })
    })

    it('should handle database errors during creation', async () => {
      mockAuth$.mockAuthenticatedUser()
      mockDbChain.values.mockRejectedValue(new Error('Database error'))

      const req = createMockRequest('POST', validKnowledgeBaseData)
      const { POST } = await import('@/app/api/knowledge/route')
      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to create knowledge base')
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/knowledge/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { generateRequestId } from '@/lib/core/utils/request'
import { createKnowledgeBase, getKnowledgeBases } from '@/lib/knowledge/service'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('KnowledgeBaseAPI')

const CreateKnowledgeBaseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  workspaceId: z.string().optional(),
  embeddingModel: z.literal('text-embedding-3-small').default('text-embedding-3-small'),
  embeddingDimension: z.literal(1536).default(1536),
  chunkingConfig: z
    .object({
      maxSize: z.number().min(100).max(4000).default(1024),
      minSize: z.number().min(1).max(2000).default(1),
      overlap: z.number().min(0).max(500).default(200),
    })
    .default({
      maxSize: 1024,
      minSize: 1,
      overlap: 200,
    })
    .refine((data) => data.minSize < data.maxSize, {
      message: 'Min chunk size must be less than max chunk size',
    }),
})

export async function GET(req: NextRequest) {
  const requestId = generateRequestId()

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized knowledge base access attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get('workspaceId')

    const knowledgeBasesWithCounts = await getKnowledgeBases(session.user.id, workspaceId)

    return NextResponse.json({
      success: true,
      data: knowledgeBasesWithCounts,
    })
  } catch (error) {
    logger.error(`[${requestId}] Error fetching knowledge bases`, error)
    return NextResponse.json({ error: 'Failed to fetch knowledge bases' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const requestId = generateRequestId()

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized knowledge base creation attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    try {
      const validatedData = CreateKnowledgeBaseSchema.parse(body)

      const createData = {
        ...validatedData,
        userId: session.user.id,
      }

      const newKnowledgeBase = await createKnowledgeBase(createData, requestId)

      logger.info(
        `[${requestId}] Knowledge base created: ${newKnowledgeBase.id} for user ${session.user.id}`
      )

      return NextResponse.json({
        success: true,
        data: newKnowledgeBase,
      })
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        logger.warn(`[${requestId}] Invalid knowledge base data`, {
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
    logger.error(`[${requestId}] Error creating knowledge base`, error)
    return NextResponse.json({ error: 'Failed to create knowledge base' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: utils.test.ts]---
Location: sim-main/apps/sim/app/api/knowledge/utils.test.ts

```typescript
/**
 * @vitest-environment node
 *
 * Knowledge Utils Unit Tests
 *
 * This file contains unit tests for the knowledge base utility functions,
 * including access checks, document processing, and embedding generation.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('drizzle-orm', () => ({
  and: (...args: any[]) => args,
  eq: (...args: any[]) => args,
  isNull: () => true,
  sql: (strings: TemplateStringsArray, ...expr: any[]) => ({ strings, expr }),
}))

vi.mock('@/lib/core/config/env', () => ({
  env: { OPENAI_API_KEY: 'test-key' },
  getEnv: (key: string) => process.env[key],
  isTruthy: (value: string | boolean | number | undefined) =>
    typeof value === 'string' ? value === 'true' || value === '1' : Boolean(value),
}))

vi.mock('@/lib/knowledge/documents/utils', () => ({
  retryWithExponentialBackoff: (fn: any) => fn(),
}))

vi.mock('@/lib/knowledge/documents/document-processor', () => ({
  processDocument: vi.fn().mockResolvedValue({
    chunks: [
      {
        text: 'alpha',
        tokenCount: 1,
        metadata: { startIndex: 0, endIndex: 4 },
      },
      {
        text: 'beta',
        tokenCount: 1,
        metadata: { startIndex: 5, endIndex: 8 },
      },
    ],
    metadata: {
      filename: 'dummy',
      fileSize: 10,
      mimeType: 'text/plain',
      characterCount: 9,
      tokenCount: 3,
      chunkCount: 2,
      processingMethod: 'file-parser',
    },
  }),
}))

const dbOps: {
  order: string[]
  insertRecords: any[][]
  updatePayloads: any[]
} = {
  order: [],
  insertRecords: [],
  updatePayloads: [],
}

let kbRows: any[] = []
let docRows: any[] = []
let chunkRows: any[] = []

function resetDatasets() {
  kbRows = []
  docRows = []
  chunkRows = []
}

vi.stubGlobal(
  'fetch',
  vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      data: [
        { embedding: [0.1, 0.2], index: 0 },
        { embedding: [0.3, 0.4], index: 1 },
      ],
    }),
  })
)

vi.mock('@sim/db', () => {
  const selectBuilder = {
    from(table: any) {
      return {
        where() {
          return {
            limit(n: number) {
              const tableSymbols = Object.getOwnPropertySymbols(table || {})
              const baseNameSymbol = tableSymbols.find((s) => s.toString().includes('BaseName'))
              const tableName = baseNameSymbol ? table[baseNameSymbol] : ''

              if (tableName === 'knowledge_base') {
                return Promise.resolve(kbRows.slice(0, n))
              }
              if (tableName === 'document') {
                return Promise.resolve(docRows.slice(0, n))
              }
              if (tableName === 'embedding') {
                return Promise.resolve(chunkRows.slice(0, n))
              }

              return Promise.resolve([])
            },
          }
        },
      }
    },
  }

  return {
    db: {
      select: vi.fn(() => selectBuilder),
      update: (table: any) => ({
        set: (payload: any) => ({
          where: () => {
            const tableSymbols = Object.getOwnPropertySymbols(table || {})
            const baseNameSymbol = tableSymbols.find((s) => s.toString().includes('BaseName'))
            const tableName = baseNameSymbol ? table[baseNameSymbol] : ''
            if (tableName === 'knowledge_base') {
              dbOps.order.push('updateKb')
              dbOps.updatePayloads.push(payload)
            } else if (tableName === 'document') {
              if (payload.processingStatus !== 'processing') {
                dbOps.order.push('updateDoc')
                dbOps.updatePayloads.push(payload)
              }
            }
            return Promise.resolve()
          },
        }),
      }),
      transaction: vi.fn(async (fn: any) => {
        await fn({
          insert: (table: any) => ({
            values: (records: any) => {
              dbOps.order.push('insert')
              dbOps.insertRecords.push(records)
              return Promise.resolve()
            },
          }),
          update: (table: any) => ({
            set: (payload: any) => ({
              where: () => {
                dbOps.updatePayloads.push(payload)
                const label = payload.processingStatus !== undefined ? 'updateDoc' : 'updateKb'
                dbOps.order.push(label)
                return Promise.resolve()
              },
            }),
          }),
        })
      }),
    },
    document: {},
    knowledgeBase: {},
    embedding: {},
  }
})

import { processDocumentAsync } from '@/lib/knowledge/documents/service'
import { generateEmbeddings } from '@/lib/knowledge/embeddings'
import {
  checkChunkAccess,
  checkDocumentAccess,
  checkKnowledgeBaseAccess,
} from '@/app/api/knowledge/utils'

describe('Knowledge Utils', () => {
  beforeEach(() => {
    dbOps.order.length = 0
    dbOps.insertRecords.length = 0
    dbOps.updatePayloads.length = 0
    resetDatasets()
    vi.clearAllMocks()
  })

  describe('processDocumentAsync', () => {
    it.concurrent('should insert embeddings before updating document counters', async () => {
      kbRows.push({ id: 'kb1', userId: 'user1', workspaceId: null })
      docRows.push({ id: 'doc1', knowledgeBaseId: 'kb1' })

      await processDocumentAsync(
        'kb1',
        'doc1',
        {
          filename: 'file.txt',
          fileUrl: 'https://example.com/file.txt',
          fileSize: 10,
          mimeType: 'text/plain',
        },
        {}
      )

      expect(dbOps.order).toEqual(['insert', 'updateDoc'])

      expect(dbOps.updatePayloads[0]).toMatchObject({
        processingStatus: 'completed',
        chunkCount: 2,
      })

      expect(dbOps.insertRecords[0].length).toBe(2)
    })
  })

  describe('checkKnowledgeBaseAccess', () => {
    it.concurrent('should return success for owner', async () => {
      kbRows.push({ id: 'kb1', userId: 'user1' })
      const result = await checkKnowledgeBaseAccess('kb1', 'user1')

      expect(result.hasAccess).toBe(true)
    })

    it('should return notFound when knowledge base is missing', async () => {
      const result = await checkKnowledgeBaseAccess('missing', 'user1')

      expect(result.hasAccess).toBe(false)
      expect('notFound' in result && result.notFound).toBe(true)
    })
  })

  describe('checkDocumentAccess', () => {
    it.concurrent('should return unauthorized when user mismatch', async () => {
      kbRows.push({ id: 'kb1', userId: 'owner' })
      const result = await checkDocumentAccess('kb1', 'doc1', 'intruder')

      expect(result.hasAccess).toBe(false)
      if ('reason' in result) {
        expect(result.reason).toBe('Unauthorized knowledge base access')
      }
    })
  })

  describe('checkChunkAccess', () => {
    it.concurrent('should fail when document is not completed', async () => {
      kbRows.push({ id: 'kb1', userId: 'user1' })
      docRows.push({ id: 'doc1', knowledgeBaseId: 'kb1', processingStatus: 'processing' })

      const result = await checkChunkAccess('kb1', 'doc1', 'chunk1', 'user1')

      expect(result.hasAccess).toBe(false)
      if ('reason' in result) {
        expect(result.reason).toContain('Document is not ready')
      }
    })

    it('should return success for valid access', async () => {
      kbRows.push({ id: 'kb1', userId: 'user1' })
      docRows.push({ id: 'doc1', knowledgeBaseId: 'kb1', processingStatus: 'completed' })
      chunkRows.push({ id: 'chunk1', documentId: 'doc1' })

      const result = await checkChunkAccess('kb1', 'doc1', 'chunk1', 'user1')

      expect(result.hasAccess).toBe(true)
      if ('chunk' in result) {
        expect(result.chunk.id).toBe('chunk1')
      }
    })
  })

  describe('generateEmbeddings', () => {
    it.concurrent('should return same length as input', async () => {
      const result = await generateEmbeddings(['a', 'b'])

      expect(result.length).toBe(2)
    })

    it('should use Azure OpenAI when Azure config is provided', async () => {
      const { env } = await import('@/lib/core/config/env')
      Object.keys(env).forEach((key) => delete (env as any)[key])
      Object.assign(env, {
        AZURE_OPENAI_API_KEY: 'test-azure-key',
        AZURE_OPENAI_ENDPOINT: 'https://test.openai.azure.com',
        AZURE_OPENAI_API_VERSION: '2024-12-01-preview',
        KB_OPENAI_MODEL_NAME: 'text-embedding-ada-002',
        OPENAI_API_KEY: 'test-openai-key',
      })

      const fetchSpy = vi.mocked(fetch)
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{ embedding: [0.1, 0.2], index: 0 }],
        }),
      } as any)

      await generateEmbeddings(['test text'])

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://test.openai.azure.com/openai/deployments/text-embedding-ada-002/embeddings?api-version=2024-12-01-preview',
        expect.objectContaining({
          headers: expect.objectContaining({
            'api-key': 'test-azure-key',
          }),
        })
      )

      Object.keys(env).forEach((key) => delete (env as any)[key])
    })

    it('should fallback to OpenAI when no Azure config provided', async () => {
      const { env } = await import('@/lib/core/config/env')
      Object.keys(env).forEach((key) => delete (env as any)[key])
      Object.assign(env, {
        OPENAI_API_KEY: 'test-openai-key',
      })

      const fetchSpy = vi.mocked(fetch)
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{ embedding: [0.1, 0.2], index: 0 }],
        }),
      } as any)

      await generateEmbeddings(['test text'])

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.openai.com/v1/embeddings',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-openai-key',
          }),
        })
      )

      Object.keys(env).forEach((key) => delete (env as any)[key])
    })

    it('should throw error when no API configuration provided', async () => {
      const { env } = await import('@/lib/core/config/env')
      Object.keys(env).forEach((key) => delete (env as any)[key])

      await expect(generateEmbeddings(['test text'])).rejects.toThrow(
        'Either OPENAI_API_KEY or Azure OpenAI configuration (AZURE_OPENAI_API_KEY + AZURE_OPENAI_ENDPOINT) must be configured'
      )
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/app/api/knowledge/utils.ts

```typescript
import { db } from '@sim/db'
import { document, embedding, knowledgeBase } from '@sim/db/schema'
import { and, eq, isNull } from 'drizzle-orm'
import { getUserEntityPermissions } from '@/lib/workspaces/permissions/utils'

export interface KnowledgeBaseData {
  id: string
  userId: string
  workspaceId?: string | null
  name: string
  description?: string | null
  tokenCount: number
  embeddingModel: string
  embeddingDimension: number
  chunkingConfig: unknown
  deletedAt?: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface DocumentData {
  id: string
  knowledgeBaseId: string
  filename: string
  fileUrl: string
  fileSize: number
  mimeType: string
  chunkCount: number
  tokenCount: number
  characterCount: number
  processingStatus: string
  processingStartedAt?: Date | null
  processingCompletedAt?: Date | null
  processingError?: string | null
  enabled: boolean
  deletedAt?: Date | null
  uploadedAt: Date
  // Document tags
  tag1?: string | null
  tag2?: string | null
  tag3?: string | null
  tag4?: string | null
  tag5?: string | null
  tag6?: string | null
  tag7?: string | null
}

export interface EmbeddingData {
  id: string
  knowledgeBaseId: string
  documentId: string
  chunkIndex: number
  chunkHash: string
  content: string
  contentLength: number
  tokenCount: number
  embedding?: number[] | null
  embeddingModel: string
  startOffset: number
  endOffset: number
  // Tag fields for filtering
  tag1?: string | null
  tag2?: string | null
  tag3?: string | null
  tag4?: string | null
  tag5?: string | null
  tag6?: string | null
  tag7?: string | null
  enabled: boolean
  createdAt: Date
  updatedAt: Date
}

export interface KnowledgeBaseAccessResult {
  hasAccess: true
  knowledgeBase: Pick<KnowledgeBaseData, 'id' | 'userId'>
}

export interface KnowledgeBaseAccessDenied {
  hasAccess: false
  notFound?: boolean
  reason?: string
}

export type KnowledgeBaseAccessCheck = KnowledgeBaseAccessResult | KnowledgeBaseAccessDenied

export interface DocumentAccessResult {
  hasAccess: true
  document: DocumentData
  knowledgeBase: Pick<KnowledgeBaseData, 'id' | 'userId'>
}

export interface DocumentAccessDenied {
  hasAccess: false
  notFound?: boolean
  reason: string
}

export type DocumentAccessCheck = DocumentAccessResult | DocumentAccessDenied

export interface ChunkAccessResult {
  hasAccess: true
  chunk: EmbeddingData
  document: DocumentData
  knowledgeBase: Pick<KnowledgeBaseData, 'id' | 'userId'>
}

export interface ChunkAccessDenied {
  hasAccess: false
  notFound?: boolean
  reason: string
}

export type ChunkAccessCheck = ChunkAccessResult | ChunkAccessDenied

/**
 * Check if a user has access to a knowledge base
 */
export async function checkKnowledgeBaseAccess(
  knowledgeBaseId: string,
  userId: string
): Promise<KnowledgeBaseAccessCheck> {
  const kb = await db
    .select({
      id: knowledgeBase.id,
      userId: knowledgeBase.userId,
      workspaceId: knowledgeBase.workspaceId,
    })
    .from(knowledgeBase)
    .where(and(eq(knowledgeBase.id, knowledgeBaseId), isNull(knowledgeBase.deletedAt)))
    .limit(1)

  if (kb.length === 0) {
    return { hasAccess: false, notFound: true }
  }

  const kbData = kb[0]

  // Case 1: User owns the knowledge base directly
  if (kbData.userId === userId) {
    return { hasAccess: true, knowledgeBase: kbData }
  }

  // Case 2: Knowledge base belongs to a workspace the user has permissions for
  if (kbData.workspaceId) {
    const userPermission = await getUserEntityPermissions(userId, 'workspace', kbData.workspaceId)
    if (userPermission !== null) {
      return { hasAccess: true, knowledgeBase: kbData }
    }
  }

  return { hasAccess: false }
}

/**
 * Check if a user has write access to a knowledge base
 * Write access is granted if:
 * 1. User owns the knowledge base directly, OR
 * 2. User has write or admin permissions on the knowledge base's workspace
 */
export async function checkKnowledgeBaseWriteAccess(
  knowledgeBaseId: string,
  userId: string
): Promise<KnowledgeBaseAccessCheck> {
  const kb = await db
    .select({
      id: knowledgeBase.id,
      userId: knowledgeBase.userId,
      workspaceId: knowledgeBase.workspaceId,
    })
    .from(knowledgeBase)
    .where(and(eq(knowledgeBase.id, knowledgeBaseId), isNull(knowledgeBase.deletedAt)))
    .limit(1)

  if (kb.length === 0) {
    return { hasAccess: false, notFound: true }
  }

  const kbData = kb[0]

  // Case 1: User owns the knowledge base directly
  if (kbData.userId === userId) {
    return { hasAccess: true, knowledgeBase: kbData }
  }

  // Case 2: Knowledge base belongs to a workspace and user has write/admin permissions
  if (kbData.workspaceId) {
    const userPermission = await getUserEntityPermissions(userId, 'workspace', kbData.workspaceId)
    if (userPermission === 'write' || userPermission === 'admin') {
      return { hasAccess: true, knowledgeBase: kbData }
    }
  }

  return { hasAccess: false }
}

/**
 * Check if a user has write access to a specific document
 * Write access is granted if user has write access to the knowledge base
 */
export async function checkDocumentWriteAccess(
  knowledgeBaseId: string,
  documentId: string,
  userId: string
): Promise<DocumentAccessCheck> {
  // First check if user has write access to the knowledge base
  const kbAccess = await checkKnowledgeBaseWriteAccess(knowledgeBaseId, userId)

  if (!kbAccess.hasAccess) {
    return {
      hasAccess: false,
      notFound: kbAccess.notFound,
      reason: kbAccess.notFound ? 'Knowledge base not found' : 'Unauthorized knowledge base access',
    }
  }

  // Check if document exists
  const doc = await db
    .select({
      id: document.id,
      filename: document.filename,
      fileUrl: document.fileUrl,
      fileSize: document.fileSize,
      mimeType: document.mimeType,
      chunkCount: document.chunkCount,
      tokenCount: document.tokenCount,
      characterCount: document.characterCount,
      enabled: document.enabled,
      processingStatus: document.processingStatus,
      processingError: document.processingError,
      uploadedAt: document.uploadedAt,
      processingStartedAt: document.processingStartedAt,
      processingCompletedAt: document.processingCompletedAt,
      knowledgeBaseId: document.knowledgeBaseId,
    })
    .from(document)
    .where(and(eq(document.id, documentId), isNull(document.deletedAt)))
    .limit(1)

  if (doc.length === 0) {
    return { hasAccess: false, notFound: true, reason: 'Document not found' }
  }

  return {
    hasAccess: true,
    document: doc[0] as DocumentData,
    knowledgeBase: kbAccess.knowledgeBase!,
  }
}

/**
 * Check if a user has access to a document within a knowledge base
 */
export async function checkDocumentAccess(
  knowledgeBaseId: string,
  documentId: string,
  userId: string
): Promise<DocumentAccessCheck> {
  // First check if user has access to the knowledge base
  const kbAccess = await checkKnowledgeBaseAccess(knowledgeBaseId, userId)

  if (!kbAccess.hasAccess) {
    return {
      hasAccess: false,
      notFound: kbAccess.notFound,
      reason: kbAccess.notFound ? 'Knowledge base not found' : 'Unauthorized knowledge base access',
    }
  }

  const doc = await db
    .select()
    .from(document)
    .where(
      and(
        eq(document.id, documentId),
        eq(document.knowledgeBaseId, knowledgeBaseId),
        isNull(document.deletedAt)
      )
    )
    .limit(1)

  if (doc.length === 0) {
    return { hasAccess: false, notFound: true, reason: 'Document not found' }
  }

  return {
    hasAccess: true,
    document: doc[0] as DocumentData,
    knowledgeBase: kbAccess.knowledgeBase!,
  }
}

/**
 * Check if a user has access to a chunk within a document and knowledge base
 */
export async function checkChunkAccess(
  knowledgeBaseId: string,
  documentId: string,
  chunkId: string,
  userId: string
): Promise<ChunkAccessCheck> {
  // First check if user has access to the knowledge base
  const kbAccess = await checkKnowledgeBaseAccess(knowledgeBaseId, userId)

  if (!kbAccess.hasAccess) {
    return {
      hasAccess: false,
      notFound: kbAccess.notFound,
      reason: kbAccess.notFound ? 'Knowledge base not found' : 'Unauthorized knowledge base access',
    }
  }

  const doc = await db
    .select()
    .from(document)
    .where(
      and(
        eq(document.id, documentId),
        eq(document.knowledgeBaseId, knowledgeBaseId),
        isNull(document.deletedAt)
      )
    )
    .limit(1)

  if (doc.length === 0) {
    return { hasAccess: false, notFound: true, reason: 'Document not found' }
  }

  const docData = doc[0] as DocumentData

  // Check if document processing is completed
  if (docData.processingStatus !== 'completed') {
    return {
      hasAccess: false,
      reason: `Document is not ready for access (status: ${docData.processingStatus})`,
    }
  }

  const chunk = await db
    .select()
    .from(embedding)
    .where(and(eq(embedding.id, chunkId), eq(embedding.documentId, documentId)))
    .limit(1)

  if (chunk.length === 0) {
    return { hasAccess: false, notFound: true, reason: 'Chunk not found' }
  }

  return {
    hasAccess: true,
    chunk: chunk[0] as EmbeddingData,
    document: docData,
    knowledgeBase: kbAccess.knowledgeBase!,
  }
}
```

--------------------------------------------------------------------------------

````
