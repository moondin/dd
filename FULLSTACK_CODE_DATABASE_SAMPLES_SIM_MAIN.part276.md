---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 276
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 276 of 933)

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
Location: sim-main/apps/sim/app/api/files/presigned/route.test.ts
Signals: Next.js

```typescript
import { NextRequest } from 'next/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { setupFileApiMocks } from '@/app/api/__test-utils__/utils'

/**
 * Tests for file presigned API route
 *
 * @vitest-environment node
 */

describe('/api/files/presigned', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'))

    vi.stubGlobal('crypto', {
      randomUUID: vi.fn().mockReturnValue('mock-uuid-1234-5678'),
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('POST', () => {
    it('should return graceful fallback response when cloud storage is not enabled', async () => {
      setupFileApiMocks({
        cloudEnabled: false,
        storageProvider: 's3',
      })

      const { POST } = await import('@/app/api/files/presigned/route')

      const request = new NextRequest('http://localhost:3000/api/files/presigned?type=chat', {
        method: 'POST',
        body: JSON.stringify({
          fileName: 'test.txt',
          contentType: 'text/plain',
          fileSize: 1024,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.directUploadSupported).toBe(false)
      expect(data.presignedUrl).toBe('')
      expect(data.fileName).toBe('test.txt')
      expect(data.fileInfo).toBeDefined()
      expect(data.fileInfo.name).toBe('test.txt')
      expect(data.fileInfo.size).toBe(1024)
      expect(data.fileInfo.type).toBe('text/plain')
    })

    it('should return error when fileName is missing', async () => {
      setupFileApiMocks({
        cloudEnabled: true,
        storageProvider: 's3',
      })

      const { POST } = await import('@/app/api/files/presigned/route')

      const request = new NextRequest('http://localhost:3000/api/files/presigned', {
        method: 'POST',
        body: JSON.stringify({
          contentType: 'text/plain',
          fileSize: 1024,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('fileName is required and cannot be empty')
      expect(data.code).toBe('VALIDATION_ERROR')
    })

    it('should return error when contentType is missing', async () => {
      setupFileApiMocks({
        cloudEnabled: true,
        storageProvider: 's3',
      })

      const { POST } = await import('@/app/api/files/presigned/route')

      const request = new NextRequest('http://localhost:3000/api/files/presigned', {
        method: 'POST',
        body: JSON.stringify({
          fileName: 'test.txt',
          fileSize: 1024,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('contentType is required and cannot be empty')
      expect(data.code).toBe('VALIDATION_ERROR')
    })

    it('should return error when fileSize is invalid', async () => {
      setupFileApiMocks({
        cloudEnabled: true,
        storageProvider: 's3',
      })

      const { POST } = await import('@/app/api/files/presigned/route')

      const request = new NextRequest('http://localhost:3000/api/files/presigned', {
        method: 'POST',
        body: JSON.stringify({
          fileName: 'test.txt',
          contentType: 'text/plain',
          fileSize: 0,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('fileSize must be a positive number')
      expect(data.code).toBe('VALIDATION_ERROR')
    })

    it('should return error when file size exceeds limit', async () => {
      setupFileApiMocks({
        cloudEnabled: true,
        storageProvider: 's3',
      })

      const { POST } = await import('@/app/api/files/presigned/route')

      const largeFileSize = 150 * 1024 * 1024 // 150MB (exceeds 100MB limit)
      const request = new NextRequest('http://localhost:3000/api/files/presigned', {
        method: 'POST',
        body: JSON.stringify({
          fileName: 'large-file.txt',
          contentType: 'text/plain',
          fileSize: largeFileSize,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('exceeds maximum allowed size')
      expect(data.code).toBe('VALIDATION_ERROR')
    })

    it('should generate S3 presigned URL successfully', async () => {
      setupFileApiMocks({
        cloudEnabled: true,
        storageProvider: 's3',
      })

      const { POST } = await import('@/app/api/files/presigned/route')

      const request = new NextRequest('http://localhost:3000/api/files/presigned?type=chat', {
        method: 'POST',
        body: JSON.stringify({
          fileName: 'test document.txt',
          contentType: 'text/plain',
          fileSize: 1024,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.presignedUrl).toBe('https://example.com/presigned-url')
      expect(data.fileInfo).toMatchObject({
        path: expect.stringMatching(/\/api\/files\/serve\/s3\/.+\?context=chat$/),
        key: expect.stringMatching(/.*test.document\.txt$/),
        name: 'test document.txt',
        size: 1024,
        type: 'text/plain',
      })
      expect(data.directUploadSupported).toBe(true)
    })

    it('should generate knowledge-base S3 presigned URL with kb prefix', async () => {
      setupFileApiMocks({
        cloudEnabled: true,
        storageProvider: 's3',
      })

      const { POST } = await import('@/app/api/files/presigned/route')

      const request = new NextRequest(
        'http://localhost:3000/api/files/presigned?type=knowledge-base',
        {
          method: 'POST',
          body: JSON.stringify({
            fileName: 'knowledge-doc.pdf',
            contentType: 'application/pdf',
            fileSize: 2048,
          }),
        }
      )

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.fileInfo.key).toMatch(/^kb\/.*knowledge-doc\.pdf$/)
      expect(data.directUploadSupported).toBe(true)
    })

    it('should generate chat S3 presigned URL with chat prefix and direct path', async () => {
      setupFileApiMocks({
        cloudEnabled: true,
        storageProvider: 's3',
      })

      const { POST } = await import('@/app/api/files/presigned/route')

      const request = new NextRequest('http://localhost:3000/api/files/presigned?type=chat', {
        method: 'POST',
        body: JSON.stringify({
          fileName: 'chat-logo.png',
          contentType: 'image/png',
          fileSize: 4096,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.fileInfo.key).toMatch(/^chat\/.*chat-logo\.png$/)
      expect(data.fileInfo.path).toMatch(/\/api\/files\/serve\/s3\/.+\?context=chat$/)
      expect(data.presignedUrl).toBeTruthy()
      expect(data.directUploadSupported).toBe(true)
    })

    it('should generate Azure Blob presigned URL successfully', async () => {
      setupFileApiMocks({
        cloudEnabled: true,
        storageProvider: 'blob',
      })

      const { POST } = await import('@/app/api/files/presigned/route')

      const request = new NextRequest('http://localhost:3000/api/files/presigned?type=chat', {
        method: 'POST',
        body: JSON.stringify({
          fileName: 'test document.txt',
          contentType: 'text/plain',
          fileSize: 1024,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.presignedUrl).toBeTruthy()
      expect(typeof data.presignedUrl).toBe('string')
      expect(data.fileInfo).toMatchObject({
        key: expect.stringMatching(/.*test.document\.txt$/),
        name: 'test document.txt',
        size: 1024,
        type: 'text/plain',
      })
      expect(data.directUploadSupported).toBe(true)
    })

    it('should generate chat Azure Blob presigned URL with chat prefix and direct path', async () => {
      setupFileApiMocks({
        cloudEnabled: true,
        storageProvider: 'blob',
      })

      const { POST } = await import('@/app/api/files/presigned/route')

      const request = new NextRequest('http://localhost:3000/api/files/presigned?type=chat', {
        method: 'POST',
        body: JSON.stringify({
          fileName: 'chat-logo.png',
          contentType: 'image/png',
          fileSize: 4096,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.fileInfo.key).toMatch(/^chat\/.*chat-logo\.png$/)
      expect(data.fileInfo.path).toMatch(/\/api\/files\/serve\/blob\/.+\?context=chat$/)
      expect(data.presignedUrl).toBeTruthy()
      expect(data.directUploadSupported).toBe(true)
    })

    it('should return error for unknown storage provider', async () => {
      setupFileApiMocks({
        cloudEnabled: true,
        storageProvider: 's3',
      })

      vi.doMock('@/lib/uploads/core/storage-service', () => ({
        hasCloudStorage: vi.fn().mockReturnValue(true),
        generatePresignedUploadUrl: vi
          .fn()
          .mockRejectedValue(new Error('Unknown storage provider: unknown')),
      }))

      const { POST } = await import('@/app/api/files/presigned/route')

      const request = new NextRequest('http://localhost:3000/api/files/presigned?type=chat', {
        method: 'POST',
        body: JSON.stringify({
          fileName: 'test.txt',
          contentType: 'text/plain',
          fileSize: 1024,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBeTruthy()
      expect(typeof data.error).toBe('string')
    })

    it('should handle S3 errors gracefully', async () => {
      setupFileApiMocks({
        cloudEnabled: true,
        storageProvider: 's3',
      })

      vi.doMock('@/lib/uploads/core/storage-service', () => ({
        hasCloudStorage: vi.fn().mockReturnValue(true),
        generatePresignedUploadUrl: vi.fn().mockRejectedValue(new Error('S3 service unavailable')),
      }))

      const { POST } = await import('@/app/api/files/presigned/route')

      const request = new NextRequest('http://localhost:3000/api/files/presigned?type=chat', {
        method: 'POST',
        body: JSON.stringify({
          fileName: 'test.txt',
          contentType: 'text/plain',
          fileSize: 1024,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBeTruthy()
      expect(typeof data.error).toBe('string')
    })

    it('should handle Azure Blob errors gracefully', async () => {
      setupFileApiMocks({
        cloudEnabled: true,
        storageProvider: 'blob',
      })

      vi.doMock('@/lib/uploads/core/storage-service', () => ({
        hasCloudStorage: vi.fn().mockReturnValue(true),
        generatePresignedUploadUrl: vi
          .fn()
          .mockRejectedValue(new Error('Azure service unavailable')),
      }))

      const { POST } = await import('@/app/api/files/presigned/route')

      const request = new NextRequest('http://localhost:3000/api/files/presigned?type=chat', {
        method: 'POST',
        body: JSON.stringify({
          fileName: 'test.txt',
          contentType: 'text/plain',
          fileSize: 1024,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBeTruthy()
      expect(typeof data.error).toBe('string')
    })

    it('should handle malformed JSON gracefully', async () => {
      setupFileApiMocks({
        cloudEnabled: true,
        storageProvider: 's3',
      })

      const { POST } = await import('@/app/api/files/presigned/route')

      const request = new NextRequest('http://localhost:3000/api/files/presigned', {
        method: 'POST',
        body: 'invalid json',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400) // Changed from 500 to 400 (ValidationError)
      expect(data.error).toBe('Invalid JSON in request body') // Updated error message
      expect(data.code).toBe('VALIDATION_ERROR')
    })
  })

  describe('OPTIONS', () => {
    it('should handle CORS preflight requests', async () => {
      const { OPTIONS } = await import('@/app/api/files/presigned/route')

      const response = await OPTIONS()

      expect(response.status).toBe(200)
      expect(response.headers.get('Access-Control-Allow-Methods')).toBe('POST, OPTIONS')
      expect(response.headers.get('Access-Control-Allow-Headers')).toBe(
        'Content-Type, Authorization'
      )
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/files/presigned/route.ts
Signals: Next.js

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { createLogger } from '@/lib/logs/console/logger'
import { CopilotFiles } from '@/lib/uploads'
import type { StorageContext } from '@/lib/uploads/config'
import { USE_BLOB_STORAGE } from '@/lib/uploads/config'
import { generatePresignedUploadUrl, hasCloudStorage } from '@/lib/uploads/core/storage-service'
import { validateFileType } from '@/lib/uploads/utils/validation'
import { createErrorResponse } from '@/app/api/files/utils'

const logger = createLogger('PresignedUploadAPI')

interface PresignedUrlRequest {
  fileName: string
  contentType: string
  fileSize: number
  userId?: string
  chatId?: string
}

class PresignedUrlError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode = 400
  ) {
    super(message)
    this.name = 'PresignedUrlError'
  }
}

class ValidationError extends PresignedUrlError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400)
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let data: PresignedUrlRequest
    try {
      data = await request.json()
    } catch {
      throw new ValidationError('Invalid JSON in request body')
    }

    const { fileName, contentType, fileSize } = data

    if (!fileName?.trim()) {
      throw new ValidationError('fileName is required and cannot be empty')
    }
    if (!contentType?.trim()) {
      throw new ValidationError('contentType is required and cannot be empty')
    }
    if (!fileSize || fileSize <= 0) {
      throw new ValidationError('fileSize must be a positive number')
    }

    const MAX_FILE_SIZE = 100 * 1024 * 1024
    if (fileSize > MAX_FILE_SIZE) {
      throw new ValidationError(
        `File size (${fileSize} bytes) exceeds maximum allowed size (${MAX_FILE_SIZE} bytes)`
      )
    }

    const uploadTypeParam = request.nextUrl.searchParams.get('type')
    if (!uploadTypeParam) {
      throw new ValidationError('type query parameter is required')
    }

    const validTypes: StorageContext[] = ['knowledge-base', 'chat', 'copilot', 'profile-pictures']
    if (!validTypes.includes(uploadTypeParam as StorageContext)) {
      throw new ValidationError(`Invalid type parameter. Must be one of: ${validTypes.join(', ')}`)
    }

    const uploadType = uploadTypeParam as StorageContext

    if (uploadType === 'knowledge-base') {
      const fileValidationError = validateFileType(fileName, contentType)
      if (fileValidationError) {
        throw new ValidationError(`${fileValidationError.message}`)
      }
    }

    const sessionUserId = session.user.id

    if (!hasCloudStorage()) {
      logger.info(
        `Local storage detected - presigned URL not available for ${fileName}, client will use API fallback`
      )
      return NextResponse.json({
        fileName,
        presignedUrl: '', // Empty URL signals fallback to API upload
        fileInfo: {
          path: '',
          key: '',
          name: fileName,
          size: fileSize,
          type: contentType,
        },
        directUploadSupported: false,
      })
    }

    logger.info(`Generating ${uploadType} presigned URL for ${fileName}`)

    let presignedUrlResponse

    if (uploadType === 'copilot') {
      try {
        presignedUrlResponse = await CopilotFiles.generateCopilotUploadUrl({
          fileName,
          contentType,
          fileSize,
          userId: sessionUserId,
          expirationSeconds: 3600,
        })
      } catch (error) {
        throw new ValidationError(
          error instanceof Error ? error.message : 'Copilot validation failed'
        )
      }
    } else {
      if (uploadType === 'profile-pictures') {
        if (!sessionUserId?.trim()) {
          throw new ValidationError(
            'Authenticated user session is required for profile picture uploads'
          )
        }
        if (!CopilotFiles.isImageFileType(contentType)) {
          throw new ValidationError(
            'Only image files (JPEG, PNG, GIF, WebP, SVG) are allowed for profile picture uploads'
          )
        }
      }

      presignedUrlResponse = await generatePresignedUploadUrl({
        fileName,
        contentType,
        fileSize,
        context: uploadType,
        userId: sessionUserId,
        expirationSeconds: 3600, // 1 hour
      })
    }

    const finalPath = `/api/files/serve/${USE_BLOB_STORAGE ? 'blob' : 's3'}/${encodeURIComponent(presignedUrlResponse.key)}?context=${uploadType}`

    return NextResponse.json({
      fileName,
      presignedUrl: presignedUrlResponse.url,
      fileInfo: {
        path: finalPath,
        key: presignedUrlResponse.key,
        name: fileName,
        size: fileSize,
        type: contentType,
      },
      uploadHeaders: presignedUrlResponse.uploadHeaders,
      directUploadSupported: true,
    })
  } catch (error) {
    logger.error('Error generating presigned URL:', error)

    if (error instanceof PresignedUrlError) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
          directUploadSupported: false,
        },
        { status: error.statusCode }
      )
    }

    return createErrorResponse(
      error instanceof Error ? error : new Error('Failed to generate presigned URL')
    )
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  )
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/files/presigned/batch/route.ts
Signals: Next.js

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { createLogger } from '@/lib/logs/console/logger'
import type { StorageContext } from '@/lib/uploads/config'
import { USE_BLOB_STORAGE } from '@/lib/uploads/config'
import {
  generateBatchPresignedUploadUrls,
  hasCloudStorage,
} from '@/lib/uploads/core/storage-service'
import { validateFileType } from '@/lib/uploads/utils/validation'
import { createErrorResponse } from '@/app/api/files/utils'

const logger = createLogger('BatchPresignedUploadAPI')

interface BatchFileRequest {
  fileName: string
  contentType: string
  fileSize: number
}

interface BatchPresignedUrlRequest {
  files: BatchFileRequest[]
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let data: BatchPresignedUrlRequest
    try {
      data = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 })
    }

    const { files } = data

    if (!files || !Array.isArray(files) || files.length === 0) {
      return NextResponse.json(
        { error: 'files array is required and cannot be empty' },
        { status: 400 }
      )
    }

    if (files.length > 100) {
      return NextResponse.json(
        { error: 'Cannot process more than 100 files at once' },
        { status: 400 }
      )
    }

    const uploadTypeParam = request.nextUrl.searchParams.get('type')
    if (!uploadTypeParam) {
      return NextResponse.json({ error: 'type query parameter is required' }, { status: 400 })
    }

    const validTypes: StorageContext[] = ['knowledge-base', 'chat', 'copilot', 'profile-pictures']
    if (!validTypes.includes(uploadTypeParam as StorageContext)) {
      return NextResponse.json(
        { error: `Invalid type parameter. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      )
    }

    const uploadType = uploadTypeParam as StorageContext

    const MAX_FILE_SIZE = 100 * 1024 * 1024
    for (const file of files) {
      if (!file.fileName?.trim()) {
        return NextResponse.json({ error: 'fileName is required for all files' }, { status: 400 })
      }
      if (!file.contentType?.trim()) {
        return NextResponse.json(
          { error: 'contentType is required for all files' },
          { status: 400 }
        )
      }
      if (!file.fileSize || file.fileSize <= 0) {
        return NextResponse.json(
          { error: 'fileSize must be positive for all files' },
          { status: 400 }
        )
      }
      if (file.fileSize > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File ${file.fileName} exceeds maximum size of ${MAX_FILE_SIZE} bytes` },
          { status: 400 }
        )
      }

      if (uploadType === 'knowledge-base') {
        const fileValidationError = validateFileType(file.fileName, file.contentType)
        if (fileValidationError) {
          return NextResponse.json(
            {
              error: fileValidationError.message,
              code: fileValidationError.code,
              supportedTypes: fileValidationError.supportedTypes,
            },
            { status: 400 }
          )
        }
      }
    }

    const sessionUserId = session.user.id

    if (uploadType === 'copilot' && !sessionUserId?.trim()) {
      return NextResponse.json(
        { error: 'Authenticated user session is required for copilot uploads' },
        { status: 400 }
      )
    }

    if (!hasCloudStorage()) {
      logger.info(
        `Local storage detected - batch presigned URLs not available, client will use API fallback`
      )
      return NextResponse.json({
        files: files.map((file) => ({
          fileName: file.fileName,
          presignedUrl: '', // Empty URL signals fallback to API upload
          fileInfo: {
            path: '',
            key: '',
            name: file.fileName,
            size: file.fileSize,
            type: file.contentType,
          },
          directUploadSupported: false,
        })),
        directUploadSupported: false,
      })
    }

    logger.info(`Generating batch ${uploadType} presigned URLs for ${files.length} files`)

    const startTime = Date.now()

    const presignedUrls = await generateBatchPresignedUploadUrls(
      files.map((file) => ({
        fileName: file.fileName,
        contentType: file.contentType,
        fileSize: file.fileSize,
      })),
      uploadType,
      sessionUserId,
      3600 // 1 hour
    )

    const duration = Date.now() - startTime
    logger.info(
      `Generated ${files.length} presigned URLs in ${duration}ms (avg ${Math.round(duration / files.length)}ms per file)`
    )

    const storagePrefix = USE_BLOB_STORAGE ? 'blob' : 's3'

    return NextResponse.json({
      files: presignedUrls.map((urlResponse, index) => {
        const finalPath = `/api/files/serve/${storagePrefix}/${encodeURIComponent(urlResponse.key)}?context=${uploadType}`

        return {
          fileName: files[index].fileName,
          presignedUrl: urlResponse.url,
          fileInfo: {
            path: finalPath,
            key: urlResponse.key,
            name: files[index].fileName,
            size: files[index].fileSize,
            type: files[index].contentType,
          },
          uploadHeaders: urlResponse.uploadHeaders,
          directUploadSupported: true,
        }
      }),
      directUploadSupported: true,
    })
  } catch (error) {
    logger.error('Error generating batch presigned URLs:', error)
    return createErrorResponse(
      error instanceof Error ? error : new Error('Failed to generate batch presigned URLs')
    )
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  )
}
```

--------------------------------------------------------------------------------

---[FILE: route.test.ts]---
Location: sim-main/apps/sim/app/api/files/serve/[...path]/route.test.ts
Signals: Next.js

```typescript
import { NextRequest } from 'next/server'
/**
 * Tests for file serve API route
 *
 * @vitest-environment node
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { setupApiTestMocks } from '@/app/api/__test-utils__/utils'

describe('File Serve API Route', () => {
  beforeEach(() => {
    vi.resetModules()

    setupApiTestMocks({
      withFileSystem: true,
      withUploadUtils: true,
    })

    vi.doMock('@/lib/auth/hybrid', () => ({
      checkHybridAuth: vi.fn().mockResolvedValue({
        success: true,
        userId: 'test-user-id',
      }),
    }))

    vi.doMock('@/app/api/files/authorization', () => ({
      verifyFileAccess: vi.fn().mockResolvedValue(true),
    }))

    vi.doMock('fs', () => ({
      existsSync: vi.fn().mockReturnValue(true),
    }))

    vi.doMock('@/app/api/files/utils', () => ({
      FileNotFoundError: class FileNotFoundError extends Error {
        constructor(message: string) {
          super(message)
          this.name = 'FileNotFoundError'
        }
      },
      createFileResponse: vi.fn().mockImplementation((file) => {
        return new Response(file.buffer, {
          status: 200,
          headers: {
            'Content-Type': file.contentType,
            'Content-Disposition': `inline; filename="${file.filename}"`,
          },
        })
      }),
      createErrorResponse: vi.fn().mockImplementation((error) => {
        return new Response(JSON.stringify({ error: error.name, message: error.message }), {
          status: error.name === 'FileNotFoundError' ? 404 : 500,
          headers: { 'Content-Type': 'application/json' },
        })
      }),
      getContentType: vi.fn().mockReturnValue('text/plain'),
      extractStorageKey: vi.fn().mockImplementation((path) => path.split('/').pop()),
      extractFilename: vi.fn().mockImplementation((path) => path.split('/').pop()),
      findLocalFile: vi.fn().mockReturnValue('/test/uploads/test-file.txt'),
    }))

    vi.doMock('@/lib/uploads/setup.server', () => ({}))
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should serve local file successfully', async () => {
    const req = new NextRequest(
      'http://localhost:3000/api/files/serve/workspace/test-workspace-id/test-file.txt'
    )
    const params = { path: ['workspace', 'test-workspace-id', 'test-file.txt'] }
    const { GET } = await import('@/app/api/files/serve/[...path]/route')

    const response = await GET(req, { params: Promise.resolve(params) })

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('text/plain')
    const disposition = response.headers.get('Content-Disposition')
    expect(disposition).toContain('inline')
    expect(disposition).toContain('filename=')
    expect(disposition).toContain('test-file.txt')

    const fs = await import('fs/promises')
    expect(fs.readFile).toHaveBeenCalled()
  })

  it('should handle nested paths correctly', async () => {
    vi.doMock('@/app/api/files/utils', () => ({
      FileNotFoundError: class FileNotFoundError extends Error {
        constructor(message: string) {
          super(message)
          this.name = 'FileNotFoundError'
        }
      },
      createFileResponse: vi.fn().mockImplementation((file) => {
        return new Response(file.buffer, {
          status: 200,
          headers: {
            'Content-Type': file.contentType,
            'Content-Disposition': `inline; filename="${file.filename}"`,
          },
        })
      }),
      createErrorResponse: vi.fn().mockImplementation((error) => {
        return new Response(JSON.stringify({ error: error.name, message: error.message }), {
          status: error.name === 'FileNotFoundError' ? 404 : 500,
          headers: { 'Content-Type': 'application/json' },
        })
      }),
      getContentType: vi.fn().mockReturnValue('text/plain'),
      extractStorageKey: vi.fn().mockImplementation((path) => path.split('/').pop()),
      extractFilename: vi.fn().mockImplementation((path) => path.split('/').pop()),
      findLocalFile: vi.fn().mockReturnValue('/test/uploads/nested/path/file.txt'),
    }))

    vi.doMock('@/lib/auth/hybrid', () => ({
      checkHybridAuth: vi.fn().mockResolvedValue({
        success: true,
        userId: 'test-user-id',
      }),
    }))

    vi.doMock('@/app/api/files/authorization', () => ({
      verifyFileAccess: vi.fn().mockResolvedValue(true),
    }))

    const req = new NextRequest(
      'http://localhost:3000/api/files/serve/workspace/test-workspace-id/nested-path-file.txt'
    )
    const params = { path: ['workspace', 'test-workspace-id', 'nested-path-file.txt'] }
    const { GET } = await import('@/app/api/files/serve/[...path]/route')

    const response = await GET(req, { params: Promise.resolve(params) })

    expect(response.status).toBe(200)

    const fs = await import('fs/promises')
    expect(fs.readFile).toHaveBeenCalledWith('/test/uploads/nested/path/file.txt')
  })

  it('should serve cloud file by downloading and proxying', async () => {
    const downloadFileMock = vi.fn().mockResolvedValue(Buffer.from('test cloud file content'))

    vi.doMock('@/lib/uploads', () => ({
      StorageService: {
        downloadFile: downloadFileMock,
        generatePresignedDownloadUrl: vi
          .fn()
          .mockResolvedValue('https://example-s3.com/presigned-url'),
        hasCloudStorage: vi.fn().mockReturnValue(true),
      },
      isUsingCloudStorage: vi.fn().mockReturnValue(true),
    }))

    vi.doMock('@/lib/uploads/core/storage-service', () => ({
      downloadFile: downloadFileMock,
      hasCloudStorage: vi.fn().mockReturnValue(true),
    }))

    vi.doMock('@/lib/uploads/setup', () => ({
      UPLOAD_DIR: '/test/uploads',
      USE_S3_STORAGE: true,
      USE_BLOB_STORAGE: false,
    }))

    vi.doMock('@/lib/auth/hybrid', () => ({
      checkHybridAuth: vi.fn().mockResolvedValue({
        success: true,
        userId: 'test-user-id',
      }),
    }))

    vi.doMock('@/app/api/files/authorization', () => ({
      verifyFileAccess: vi.fn().mockResolvedValue(true),
    }))

    vi.doMock('@/app/api/files/utils', () => ({
      FileNotFoundError: class FileNotFoundError extends Error {
        constructor(message: string) {
          super(message)
          this.name = 'FileNotFoundError'
        }
      },
      createFileResponse: vi.fn().mockImplementation((file) => {
        return new Response(file.buffer, {
          status: 200,
          headers: {
            'Content-Type': file.contentType,
            'Content-Disposition': `inline; filename="${file.filename}"`,
          },
        })
      }),
      createErrorResponse: vi.fn().mockImplementation((error) => {
        return new Response(JSON.stringify({ error: error.name, message: error.message }), {
          status: error.name === 'FileNotFoundError' ? 404 : 500,
          headers: { 'Content-Type': 'application/json' },
        })
      }),
      getContentType: vi.fn().mockReturnValue('image/png'),
      extractStorageKey: vi.fn().mockImplementation((path) => path.split('/').pop()),
      extractFilename: vi.fn().mockImplementation((path) => path.split('/').pop()),
      findLocalFile: vi.fn().mockReturnValue('/test/uploads/test-file.txt'),
    }))

    const req = new NextRequest(
      'http://localhost:3000/api/files/serve/workspace/test-workspace-id/1234567890-image.png'
    )
    const params = { path: ['workspace', 'test-workspace-id', '1234567890-image.png'] }
    const { GET } = await import('@/app/api/files/serve/[...path]/route')

    const response = await GET(req, { params: Promise.resolve(params) })

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('image/png')

    expect(downloadFileMock).toHaveBeenCalledWith({
      key: 'workspace/test-workspace-id/1234567890-image.png',
      context: 'workspace',
    })
  })

  it('should return 404 when file not found', async () => {
    vi.doMock('fs', () => ({
      existsSync: vi.fn().mockReturnValue(false),
    }))

    vi.doMock('fs/promises', () => ({
      readFile: vi.fn().mockRejectedValue(new Error('ENOENT: no such file or directory')),
    }))

    vi.doMock('@/lib/auth/hybrid', () => ({
      checkHybridAuth: vi.fn().mockResolvedValue({
        success: true,
        userId: 'test-user-id',
      }),
    }))

    vi.doMock('@/app/api/files/authorization', () => ({
      verifyFileAccess: vi.fn().mockResolvedValue(false), // File not found = no access
    }))

    vi.doMock('@/app/api/files/utils', () => ({
      FileNotFoundError: class FileNotFoundError extends Error {
        constructor(message: string) {
          super(message)
          this.name = 'FileNotFoundError'
        }
      },
      createFileResponse: vi.fn(),
      createErrorResponse: vi.fn().mockImplementation((error) => {
        return new Response(JSON.stringify({ error: error.name, message: error.message }), {
          status: error.name === 'FileNotFoundError' ? 404 : 500,
          headers: { 'Content-Type': 'application/json' },
        })
      }),
      getContentType: vi.fn().mockReturnValue('text/plain'),
      extractStorageKey: vi.fn(),
      extractFilename: vi.fn(),
      findLocalFile: vi.fn().mockReturnValue(null),
    }))

    const req = new NextRequest(
      'http://localhost:3000/api/files/serve/workspace/test-workspace-id/nonexistent.txt'
    )
    const params = { path: ['workspace', 'test-workspace-id', 'nonexistent.txt'] }
    const { GET } = await import('@/app/api/files/serve/[...path]/route')

    const response = await GET(req, { params: Promise.resolve(params) })

    expect(response.status).toBe(404)

    const responseData = await response.json()
    expect(responseData).toEqual({
      error: 'FileNotFoundError',
      message: expect.stringContaining('File not found'),
    })
  })

  describe('content type detection', () => {
    const contentTypeTests = [
      { ext: 'pdf', contentType: 'application/pdf' },
      { ext: 'json', contentType: 'application/json' },
      { ext: 'jpg', contentType: 'image/jpeg' },
      { ext: 'txt', contentType: 'text/plain' },
      { ext: 'unknown', contentType: 'application/octet-stream' },
    ]

    for (const test of contentTypeTests) {
      it(`should serve ${test.ext} file with correct content type`, async () => {
        vi.doMock('@/lib/auth/hybrid', () => ({
          checkHybridAuth: vi.fn().mockResolvedValue({
            success: true,
            userId: 'test-user-id',
          }),
        }))

        vi.doMock('@/app/api/files/authorization', () => ({
          verifyFileAccess: vi.fn().mockResolvedValue(true),
        }))

        vi.doMock('@/app/api/files/utils', () => ({
          FileNotFoundError: class FileNotFoundError extends Error {
            constructor(message: string) {
              super(message)
              this.name = 'FileNotFoundError'
            }
          },
          getContentType: () => test.contentType,
          findLocalFile: () => `/test/uploads/file.${test.ext}`,
          createFileResponse: (obj: { buffer: Buffer; contentType: string; filename: string }) =>
            new Response(obj.buffer as any, {
              status: 200,
              headers: {
                'Content-Type': obj.contentType,
                'Content-Disposition': `inline; filename="${obj.filename}"`,
                'Cache-Control': 'public, max-age=31536000',
              },
            }),
          createErrorResponse: () => new Response(null, { status: 404 }),
        }))

        const req = new NextRequest(
          `http://localhost:3000/api/files/serve/workspace/test-workspace-id/file.${test.ext}`
        )
        const params = { path: ['workspace', 'test-workspace-id', `file.${test.ext}`] }
        const { GET } = await import('@/app/api/files/serve/[...path]/route')

        const response = await GET(req, { params: Promise.resolve(params) })

        expect(response.headers.get('Content-Type')).toBe(test.contentType)
      })
    }
  })
})
```

--------------------------------------------------------------------------------

````
