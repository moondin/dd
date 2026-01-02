---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 274
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 274 of 933)

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

---[FILE: utils.ts]---
Location: sim-main/apps/sim/app/api/files/utils.ts
Signals: Next.js

```typescript
import { existsSync } from 'fs'
import { join, resolve, sep } from 'path'
import { NextResponse } from 'next/server'
import { createLogger } from '@/lib/logs/console/logger'
import { UPLOAD_DIR } from '@/lib/uploads/config'
import { sanitizeFileKey } from '@/lib/uploads/utils/file-utils'

const logger = createLogger('FilesUtils')

export interface ApiSuccessResponse {
  success: true
  [key: string]: any
}

export interface ApiErrorResponse {
  error: string
  message?: string
}

export interface FileResponse {
  buffer: Buffer
  contentType: string
  filename: string
}

export class FileNotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FileNotFoundError'
  }
}

export class InvalidRequestError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidRequestError'
  }
}

export const contentTypeMap: Record<string, string> = {
  txt: 'text/plain',
  csv: 'text/csv',
  json: 'application/json',
  xml: 'application/xml',
  md: 'text/markdown',
  html: 'text/html',
  css: 'text/css',
  js: 'application/javascript',
  ts: 'application/typescript',
  pdf: 'application/pdf',
  googleDoc: 'application/vnd.google-apps.document',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  googleSheet: 'application/vnd.google-apps.spreadsheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  zip: 'application/zip',
  googleFolder: 'application/vnd.google-apps.folder',
}

export const binaryExtensions = [
  'doc',
  'docx',
  'xls',
  'xlsx',
  'ppt',
  'pptx',
  'zip',
  'png',
  'jpg',
  'jpeg',
  'gif',
  'pdf',
]

export function getContentType(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase() || ''
  return contentTypeMap[extension] || 'application/octet-stream'
}

export function extractFilename(path: string): string {
  let filename: string

  if (path.startsWith('/api/files/serve/')) {
    filename = path.substring('/api/files/serve/'.length)
  } else {
    filename = path.split('/').pop() || path
  }

  filename = filename
    .replace(/\.\./g, '')
    .replace(/\/\.\./g, '')
    .replace(/\.\.\//g, '')

  if (filename.startsWith('s3/') || filename.startsWith('blob/')) {
    const parts = filename.split('/')
    const prefix = parts[0] // 's3' or 'blob'
    const keyParts = parts.slice(1)

    const sanitizedKeyParts = keyParts
      .map((part) => part.replace(/\.\./g, '').replace(/^\./g, '').trim())
      .filter((part) => part.length > 0)

    filename = `${prefix}/${sanitizedKeyParts.join('/')}`
  } else {
    filename = filename.replace(/[/\\]/g, '')
  }

  if (!filename || filename.trim().length === 0) {
    throw new Error('Invalid or empty filename after sanitization')
  }

  return filename
}

function sanitizeFilename(filename: string): string {
  if (!filename || typeof filename !== 'string') {
    throw new Error('Invalid filename provided')
  }

  if (!filename.includes('/')) {
    throw new Error('File key must include a context prefix (e.g., kb/, workspace/, execution/)')
  }

  const segments = filename.split('/')

  const sanitizedSegments = segments.map((segment) => {
    if (segment === '..' || segment === '.') {
      throw new Error('Path traversal detected')
    }

    const sanitized = segment.replace(/\.\./g, '').replace(/[\\]/g, '').replace(/^\./g, '').trim()

    if (!sanitized) {
      throw new Error('Invalid or empty path segment after sanitization')
    }

    if (
      sanitized.includes(':') ||
      sanitized.includes('|') ||
      sanitized.includes('?') ||
      sanitized.includes('*') ||
      sanitized.includes('\x00') ||
      /[\x00-\x1F\x7F]/.test(sanitized)
    ) {
      throw new Error('Path segment contains invalid characters')
    }

    return sanitized
  })

  return sanitizedSegments.join(sep)
}

export function findLocalFile(filename: string): string | null {
  try {
    const sanitizedFilename = sanitizeFileKey(filename)

    // Reject if sanitized filename is empty or only contains path separators/dots
    if (!sanitizedFilename || !sanitizedFilename.trim() || /^[/\\.\s]+$/.test(sanitizedFilename)) {
      return null
    }

    const possiblePaths = [
      join(UPLOAD_DIR, sanitizedFilename),
      join(process.cwd(), 'uploads', sanitizedFilename),
    ]

    for (const path of possiblePaths) {
      const resolvedPath = resolve(path)
      const allowedDirs = [resolve(UPLOAD_DIR), resolve(process.cwd(), 'uploads')]

      // Must be within allowed directory but NOT the directory itself
      const isWithinAllowedDir = allowedDirs.some(
        (allowedDir) => resolvedPath.startsWith(allowedDir + sep) && resolvedPath !== allowedDir
      )

      if (!isWithinAllowedDir) {
        continue
      }

      if (existsSync(resolvedPath)) {
        return resolvedPath
      }
    }

    return null
  } catch (error) {
    logger.error('Error in findLocalFile:', error)
    return null
  }
}

const SAFE_INLINE_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'application/pdf',
  'text/plain',
  'text/csv',
  'application/json',
])

const FORCE_ATTACHMENT_EXTENSIONS = new Set(['html', 'htm', 'svg', 'js', 'css', 'xml'])

function getSecureFileHeaders(filename: string, originalContentType: string) {
  const extension = filename.split('.').pop()?.toLowerCase() || ''

  if (FORCE_ATTACHMENT_EXTENSIONS.has(extension)) {
    return {
      contentType: 'application/octet-stream',
      disposition: 'attachment',
    }
  }

  let safeContentType = originalContentType

  if (originalContentType === 'text/html' || originalContentType === 'image/svg+xml') {
    safeContentType = 'text/plain'
  }

  const disposition = SAFE_INLINE_TYPES.has(safeContentType) ? 'inline' : 'attachment'

  return {
    contentType: safeContentType,
    disposition,
  }
}

function encodeFilenameForHeader(storageKey: string): string {
  const filename = storageKey.split('/').pop() || storageKey

  const hasNonAscii = /[^\x00-\x7F]/.test(filename)

  if (!hasNonAscii) {
    return `filename="${filename}"`
  }

  const encodedFilename = encodeURIComponent(filename)
  const asciiSafe = filename.replace(/[^\x00-\x7F]/g, '_')
  return `filename="${asciiSafe}"; filename*=UTF-8''${encodedFilename}`
}

export function createFileResponse(file: FileResponse): NextResponse {
  const { contentType, disposition } = getSecureFileHeaders(file.filename, file.contentType)

  return new NextResponse(file.buffer as BodyInit, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `${disposition}; ${encodeFilenameForHeader(file.filename)}`,
      'Cache-Control': 'public, max-age=31536000',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox;",
    },
  })
}

export function createErrorResponse(error: Error, status = 500): NextResponse {
  const statusCode =
    error instanceof FileNotFoundError ? 404 : error instanceof InvalidRequestError ? 400 : status

  return NextResponse.json(
    {
      error: error.name,
      message: error.message,
    },
    { status: statusCode }
  )
}

export function createSuccessResponse(data: ApiSuccessResponse): NextResponse {
  return NextResponse.json(data)
}

export function createOptionsResponse(): NextResponse {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
```

--------------------------------------------------------------------------------

---[FILE: route.test.ts]---
Location: sim-main/apps/sim/app/api/files/delete/route.test.ts

```typescript
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMockRequest, setupFileApiMocks } from '@/app/api/__test-utils__/utils'

describe('File Delete API Route', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.doMock('@/lib/uploads/setup.server', () => ({}))
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should handle local file deletion successfully', async () => {
    setupFileApiMocks({
      cloudEnabled: false,
      storageProvider: 'local',
    })

    const req = createMockRequest('POST', {
      filePath: '/api/files/serve/workspace/test-workspace-id/test-file.txt',
    })

    const { POST } = await import('@/app/api/files/delete/route')

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('success', true)
    expect(data).toHaveProperty('message')
    expect(['File deleted successfully', "File not found, but that's okay"]).toContain(data.message)
  })

  it('should handle file not found gracefully', async () => {
    setupFileApiMocks({
      cloudEnabled: false,
      storageProvider: 'local',
    })

    const req = createMockRequest('POST', {
      filePath: '/api/files/serve/workspace/test-workspace-id/nonexistent.txt',
    })

    const { POST } = await import('@/app/api/files/delete/route')

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('success', true)
    expect(data).toHaveProperty('message')
  })

  it('should handle S3 file deletion successfully', async () => {
    setupFileApiMocks({
      cloudEnabled: true,
      storageProvider: 's3',
    })

    const req = createMockRequest('POST', {
      filePath: '/api/files/serve/workspace/test-workspace-id/1234567890-test-file.txt',
    })

    const { POST } = await import('@/app/api/files/delete/route')

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('success', true)
    expect(data).toHaveProperty('message', 'File deleted successfully')

    const storageService = await import('@/lib/uploads/core/storage-service')
    expect(storageService.deleteFile).toHaveBeenCalledWith({
      key: 'workspace/test-workspace-id/1234567890-test-file.txt',
      context: 'workspace',
    })
  })

  it('should handle Azure Blob file deletion successfully', async () => {
    setupFileApiMocks({
      cloudEnabled: true,
      storageProvider: 'blob',
    })

    const req = createMockRequest('POST', {
      filePath: '/api/files/serve/workspace/test-workspace-id/1234567890-test-document.pdf',
    })

    const { POST } = await import('@/app/api/files/delete/route')

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('success', true)
    expect(data).toHaveProperty('message', 'File deleted successfully')

    const storageService = await import('@/lib/uploads/core/storage-service')
    expect(storageService.deleteFile).toHaveBeenCalledWith({
      key: 'workspace/test-workspace-id/1234567890-test-document.pdf',
      context: 'workspace',
    })
  })

  it('should handle missing file path', async () => {
    setupFileApiMocks()

    const req = createMockRequest('POST', {})

    const { POST } = await import('@/app/api/files/delete/route')

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error', 'InvalidRequestError')
    expect(data).toHaveProperty('message', 'No file path provided')
  })

  it('should handle CORS preflight requests', async () => {
    const { OPTIONS } = await import('@/app/api/files/delete/route')

    const response = await OPTIONS()

    expect(response.status).toBe(204)
    expect(response.headers.get('Access-Control-Allow-Methods')).toBe('GET, POST, DELETE, OPTIONS')
    expect(response.headers.get('Access-Control-Allow-Headers')).toBe('Content-Type')
  })
})
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/files/delete/route.ts
Signals: Next.js

```typescript
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { createLogger } from '@/lib/logs/console/logger'
import type { StorageContext } from '@/lib/uploads/config'
import { deleteFile, hasCloudStorage } from '@/lib/uploads/core/storage-service'
import { extractStorageKey, inferContextFromKey } from '@/lib/uploads/utils/file-utils'
import { verifyFileAccess } from '@/app/api/files/authorization'
import {
  createErrorResponse,
  createOptionsResponse,
  createSuccessResponse,
  extractFilename,
  FileNotFoundError,
  InvalidRequestError,
} from '@/app/api/files/utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('FilesDeleteAPI')

/**
 * Main API route handler for file deletion
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })

    if (!authResult.success || !authResult.userId) {
      logger.warn('Unauthorized file delete request', {
        error: authResult.error || 'Missing userId',
      })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = authResult.userId
    const requestData = await request.json()
    const { filePath, context } = requestData

    logger.info('File delete request received:', { filePath, context, userId })

    if (!filePath) {
      throw new InvalidRequestError('No file path provided')
    }

    try {
      const key = extractStorageKeyFromPath(filePath)

      const storageContext: StorageContext = context || inferContextFromKey(key)

      const hasAccess = await verifyFileAccess(
        key,
        userId,
        undefined, // customConfig
        storageContext, // context
        !hasCloudStorage() // isLocal
      )

      if (!hasAccess) {
        logger.warn('Unauthorized file delete attempt', { userId, key, context: storageContext })
        throw new FileNotFoundError(`File not found: ${key}`)
      }

      logger.info(`Deleting file with key: ${key}, context: ${storageContext}`)

      await deleteFile({
        key,
        context: storageContext,
      })

      logger.info(`File successfully deleted: ${key}`)

      return createSuccessResponse({
        success: true,
        message: 'File deleted successfully',
      })
    } catch (error) {
      logger.error('Error deleting file:', error)

      if (error instanceof FileNotFoundError) {
        return createErrorResponse(error)
      }

      return createErrorResponse(
        error instanceof Error ? error : new Error('Failed to delete file')
      )
    }
  } catch (error) {
    logger.error('Error parsing request:', error)
    return createErrorResponse(error instanceof Error ? error : new Error('Invalid request'))
  }
}

/**
 * Extract storage key from file path
 */
function extractStorageKeyFromPath(filePath: string): string {
  if (filePath.startsWith('/api/files/serve/')) {
    return extractStorageKey(filePath)
  }

  return extractFilename(filePath)
}

/**
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
  return createOptionsResponse()
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/files/download/route.ts
Signals: Next.js

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { createLogger } from '@/lib/logs/console/logger'
import type { StorageContext } from '@/lib/uploads/config'
import { hasCloudStorage } from '@/lib/uploads/core/storage-service'
import { verifyFileAccess } from '@/app/api/files/authorization'
import { createErrorResponse, FileNotFoundError } from '@/app/api/files/utils'

const logger = createLogger('FileDownload')

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })

    if (!authResult.success || !authResult.userId) {
      logger.warn('Unauthorized download URL request', {
        error: authResult.error || 'Missing userId',
      })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = authResult.userId
    const body = await request.json()
    const { key, name, isExecutionFile, context, url } = body

    if (!key) {
      return createErrorResponse(new Error('File key is required'), 400)
    }

    if (key.startsWith('url/')) {
      if (!url) {
        return createErrorResponse(new Error('URL is required for URL-type files'), 400)
      }

      return NextResponse.json({
        downloadUrl: url,
        expiresIn: null,
        fileName: name || key.split('/').pop() || 'download',
      })
    }

    let storageContext: StorageContext = context || 'general'

    if (isExecutionFile && !context) {
      storageContext = 'execution'
      logger.info(`Using execution context for file: ${key}`)
    }

    const hasAccess = await verifyFileAccess(
      key,
      userId,
      undefined, // customConfig
      storageContext, // context
      !hasCloudStorage() // isLocal
    )

    if (!hasAccess) {
      logger.warn('Unauthorized download URL request', { userId, key, context: storageContext })
      throw new FileNotFoundError(`File not found: ${key}`)
    }

    const { getBaseUrl } = await import('@/lib/core/utils/urls')
    const downloadUrl = `${getBaseUrl()}/api/files/serve/${encodeURIComponent(key)}?context=${storageContext}`

    logger.info(`Generated download URL for ${storageContext} file: ${key}`)

    return NextResponse.json({
      downloadUrl,
      expiresIn: null,
      fileName: name || key.split('/').pop() || 'download',
    })
  } catch (error) {
    logger.error('Error in file download endpoint:', error)

    if (error instanceof FileNotFoundError) {
      return createErrorResponse(error)
    }

    return createErrorResponse(
      error instanceof Error ? error : new Error('Internal server error'),
      500
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/files/multipart/route.ts
Signals: Next.js

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { createLogger } from '@/lib/logs/console/logger'
import {
  getStorageConfig,
  getStorageProvider,
  isUsingCloudStorage,
  type StorageContext,
} from '@/lib/uploads'

const logger = createLogger('MultipartUploadAPI')

interface InitiateMultipartRequest {
  fileName: string
  contentType: string
  fileSize: number
  context?: StorageContext
}

interface GetPartUrlsRequest {
  uploadId: string
  key: string
  partNumbers: number[]
  context?: StorageContext
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const action = request.nextUrl.searchParams.get('action')

    if (!isUsingCloudStorage()) {
      return NextResponse.json(
        { error: 'Multipart upload is only available with cloud storage (S3 or Azure Blob)' },
        { status: 400 }
      )
    }

    const storageProvider = getStorageProvider()

    switch (action) {
      case 'initiate': {
        const data: InitiateMultipartRequest = await request.json()
        const { fileName, contentType, fileSize, context = 'knowledge-base' } = data

        const config = getStorageConfig(context)

        if (storageProvider === 's3') {
          const { initiateS3MultipartUpload } = await import('@/lib/uploads/providers/s3/client')

          const result = await initiateS3MultipartUpload({
            fileName,
            contentType,
            fileSize,
          })

          logger.info(
            `Initiated S3 multipart upload for ${fileName} (context: ${context}): ${result.uploadId}`
          )

          return NextResponse.json({
            uploadId: result.uploadId,
            key: result.key,
          })
        }
        if (storageProvider === 'blob') {
          const { initiateMultipartUpload } = await import('@/lib/uploads/providers/blob/client')

          const result = await initiateMultipartUpload({
            fileName,
            contentType,
            fileSize,
            customConfig: {
              containerName: config.containerName!,
              accountName: config.accountName!,
              accountKey: config.accountKey,
              connectionString: config.connectionString,
            },
          })

          logger.info(
            `Initiated Azure multipart upload for ${fileName} (context: ${context}): ${result.uploadId}`
          )

          return NextResponse.json({
            uploadId: result.uploadId,
            key: result.key,
          })
        }

        return NextResponse.json(
          { error: `Unsupported storage provider: ${storageProvider}` },
          { status: 400 }
        )
      }

      case 'get-part-urls': {
        const data: GetPartUrlsRequest = await request.json()
        const { uploadId, key, partNumbers, context = 'knowledge-base' } = data

        const config = getStorageConfig(context)

        if (storageProvider === 's3') {
          const { getS3MultipartPartUrls } = await import('@/lib/uploads/providers/s3/client')

          const presignedUrls = await getS3MultipartPartUrls(key, uploadId, partNumbers)

          return NextResponse.json({ presignedUrls })
        }
        if (storageProvider === 'blob') {
          const { getMultipartPartUrls } = await import('@/lib/uploads/providers/blob/client')

          const presignedUrls = await getMultipartPartUrls(key, partNumbers, {
            containerName: config.containerName!,
            accountName: config.accountName!,
            accountKey: config.accountKey,
            connectionString: config.connectionString,
          })

          return NextResponse.json({ presignedUrls })
        }

        return NextResponse.json(
          { error: `Unsupported storage provider: ${storageProvider}` },
          { status: 400 }
        )
      }

      case 'complete': {
        const data = await request.json()
        const context: StorageContext = data.context || 'knowledge-base'

        const config = getStorageConfig(context)

        if ('uploads' in data) {
          const results = await Promise.all(
            data.uploads.map(async (upload: any) => {
              const { uploadId, key } = upload

              if (storageProvider === 's3') {
                const { completeS3MultipartUpload } = await import(
                  '@/lib/uploads/providers/s3/client'
                )
                const parts = upload.parts // S3 format: { ETag, PartNumber }

                const result = await completeS3MultipartUpload(key, uploadId, parts)

                return {
                  success: true,
                  location: result.location,
                  path: result.path,
                  key: result.key,
                }
              }
              if (storageProvider === 'blob') {
                const { completeMultipartUpload } = await import(
                  '@/lib/uploads/providers/blob/client'
                )
                const parts = upload.parts // Azure format: { blockId, partNumber }

                const result = await completeMultipartUpload(key, parts, {
                  containerName: config.containerName!,
                  accountName: config.accountName!,
                  accountKey: config.accountKey,
                  connectionString: config.connectionString,
                })

                return {
                  success: true,
                  location: result.location,
                  path: result.path,
                  key: result.key,
                }
              }

              throw new Error(`Unsupported storage provider: ${storageProvider}`)
            })
          )

          logger.info(`Completed ${data.uploads.length} multipart uploads (context: ${context})`)
          return NextResponse.json({ results })
        }

        const { uploadId, key, parts } = data

        if (storageProvider === 's3') {
          const { completeS3MultipartUpload } = await import('@/lib/uploads/providers/s3/client')

          const result = await completeS3MultipartUpload(key, uploadId, parts)

          logger.info(`Completed S3 multipart upload for key ${key} (context: ${context})`)

          return NextResponse.json({
            success: true,
            location: result.location,
            path: result.path,
            key: result.key,
          })
        }
        if (storageProvider === 'blob') {
          const { completeMultipartUpload } = await import('@/lib/uploads/providers/blob/client')

          const result = await completeMultipartUpload(key, parts, {
            containerName: config.containerName!,
            accountName: config.accountName!,
            accountKey: config.accountKey,
            connectionString: config.connectionString,
          })

          logger.info(`Completed Azure multipart upload for key ${key} (context: ${context})`)

          return NextResponse.json({
            success: true,
            location: result.location,
            path: result.path,
            key: result.key,
          })
        }

        return NextResponse.json(
          { error: `Unsupported storage provider: ${storageProvider}` },
          { status: 400 }
        )
      }

      case 'abort': {
        const data = await request.json()
        const { uploadId, key, context = 'knowledge-base' } = data

        const config = getStorageConfig(context as StorageContext)

        if (storageProvider === 's3') {
          const { abortS3MultipartUpload } = await import('@/lib/uploads/providers/s3/client')

          await abortS3MultipartUpload(key, uploadId)

          logger.info(`Aborted S3 multipart upload for key ${key} (context: ${context})`)
        } else if (storageProvider === 'blob') {
          const { abortMultipartUpload } = await import('@/lib/uploads/providers/blob/client')

          await abortMultipartUpload(key, {
            containerName: config.containerName!,
            accountName: config.accountName!,
            accountKey: config.accountKey,
            connectionString: config.connectionString,
          })

          logger.info(`Aborted Azure multipart upload for key ${key} (context: ${context})`)
        } else {
          return NextResponse.json(
            { error: `Unsupported storage provider: ${storageProvider}` },
            { status: 400 }
          )
        }

        return NextResponse.json({ success: true })
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: initiate, get-part-urls, complete, or abort' },
          { status: 400 }
        )
    }
  } catch (error) {
    logger.error('Multipart upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Multipart upload failed' },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

````
