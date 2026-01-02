---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 277
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 277 of 933)

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
Location: sim-main/apps/sim/app/api/files/serve/[...path]/route.ts
Signals: Next.js

```typescript
import { readFile } from 'fs/promises'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { createLogger } from '@/lib/logs/console/logger'
import { CopilotFiles, isUsingCloudStorage } from '@/lib/uploads'
import type { StorageContext } from '@/lib/uploads/config'
import { downloadFile } from '@/lib/uploads/core/storage-service'
import { inferContextFromKey } from '@/lib/uploads/utils/file-utils'
import { verifyFileAccess } from '@/app/api/files/authorization'
import {
  createErrorResponse,
  createFileResponse,
  FileNotFoundError,
  findLocalFile,
  getContentType,
} from '@/app/api/files/utils'

const logger = createLogger('FilesServeAPI')

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params

    if (!path || path.length === 0) {
      throw new FileNotFoundError('No file path provided')
    }

    logger.info('File serve request:', { path })

    const fullPath = path.join('/')
    const isS3Path = path[0] === 's3'
    const isBlobPath = path[0] === 'blob'
    const isCloudPath = isS3Path || isBlobPath
    const cloudKey = isCloudPath ? path.slice(1).join('/') : fullPath

    const contextParam = request.nextUrl.searchParams.get('context')
    const legacyBucketType = request.nextUrl.searchParams.get('bucket')

    const context = contextParam || (isCloudPath ? inferContextFromKey(cloudKey) : undefined)

    if (context === 'profile-pictures') {
      logger.info('Serving public profile picture:', { cloudKey })
      if (isUsingCloudStorage() || isCloudPath) {
        return await handleCloudProxyPublic(cloudKey, context, legacyBucketType)
      }
      return await handleLocalFilePublic(fullPath)
    }

    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })

    if (!authResult.success || !authResult.userId) {
      logger.warn('Unauthorized file access attempt', {
        path,
        error: authResult.error || 'Missing userId',
      })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = authResult.userId

    if (isUsingCloudStorage()) {
      return await handleCloudProxy(cloudKey, userId, contextParam)
    }

    return await handleLocalFile(cloudKey, userId)
  } catch (error) {
    logger.error('Error serving file:', error)

    if (error instanceof FileNotFoundError) {
      return createErrorResponse(error)
    }

    return createErrorResponse(error instanceof Error ? error : new Error('Failed to serve file'))
  }
}

async function handleLocalFile(filename: string, userId: string): Promise<NextResponse> {
  try {
    const contextParam: StorageContext | undefined = inferContextFromKey(filename) as
      | StorageContext
      | undefined

    const hasAccess = await verifyFileAccess(
      filename,
      userId,
      undefined, // customConfig
      contextParam, // context
      true // isLocal
    )

    if (!hasAccess) {
      logger.warn('Unauthorized local file access attempt', { userId, filename })
      throw new FileNotFoundError(`File not found: ${filename}`)
    }

    const filePath = findLocalFile(filename)

    if (!filePath) {
      throw new FileNotFoundError(`File not found: ${filename}`)
    }

    const fileBuffer = await readFile(filePath)
    const contentType = getContentType(filename)

    logger.info('Local file served', { userId, filename, size: fileBuffer.length })

    return createFileResponse({
      buffer: fileBuffer,
      contentType,
      filename,
    })
  } catch (error) {
    logger.error('Error reading local file:', error)
    throw error
  }
}

async function handleCloudProxy(
  cloudKey: string,
  userId: string,
  contextParam?: string | null
): Promise<NextResponse> {
  try {
    let context: StorageContext

    if (contextParam) {
      context = contextParam as StorageContext
      logger.info(`Using explicit context: ${context} for key: ${cloudKey}`)
    } else {
      context = inferContextFromKey(cloudKey)
      logger.info(`Inferred context: ${context} from key pattern: ${cloudKey}`)
    }

    const hasAccess = await verifyFileAccess(
      cloudKey,
      userId,
      undefined, // customConfig
      context, // context
      false // isLocal
    )

    if (!hasAccess) {
      logger.warn('Unauthorized cloud file access attempt', { userId, key: cloudKey, context })
      throw new FileNotFoundError(`File not found: ${cloudKey}`)
    }

    let fileBuffer: Buffer

    if (context === 'copilot') {
      fileBuffer = await CopilotFiles.downloadCopilotFile(cloudKey)
    } else {
      fileBuffer = await downloadFile({
        key: cloudKey,
        context,
      })
    }

    const originalFilename = cloudKey.split('/').pop() || 'download'
    const contentType = getContentType(originalFilename)

    logger.info('Cloud file served', {
      userId,
      key: cloudKey,
      size: fileBuffer.length,
      context,
    })

    return createFileResponse({
      buffer: fileBuffer,
      contentType,
      filename: originalFilename,
    })
  } catch (error) {
    logger.error('Error downloading from cloud storage:', error)
    throw error
  }
}

async function handleCloudProxyPublic(
  cloudKey: string,
  context: StorageContext,
  legacyBucketType?: string | null
): Promise<NextResponse> {
  try {
    let fileBuffer: Buffer

    if (context === 'copilot') {
      fileBuffer = await CopilotFiles.downloadCopilotFile(cloudKey)
    } else {
      fileBuffer = await downloadFile({
        key: cloudKey,
        context,
      })
    }

    const originalFilename = cloudKey.split('/').pop() || 'download'
    const contentType = getContentType(originalFilename)

    logger.info('Public cloud file served', {
      key: cloudKey,
      size: fileBuffer.length,
      context,
    })

    return createFileResponse({
      buffer: fileBuffer,
      contentType,
      filename: originalFilename,
    })
  } catch (error) {
    logger.error('Error serving public cloud file:', error)
    throw error
  }
}

async function handleLocalFilePublic(filename: string): Promise<NextResponse> {
  try {
    const filePath = findLocalFile(filename)

    if (!filePath) {
      throw new FileNotFoundError(`File not found: ${filename}`)
    }

    const fileBuffer = await readFile(filePath)
    const contentType = getContentType(filename)

    logger.info('Public local file served', { filename, size: fileBuffer.length })

    return createFileResponse({
      buffer: fileBuffer,
      contentType,
      filename,
    })
  } catch (error) {
    logger.error('Error reading public local file:', error)
    throw error
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.test.ts]---
Location: sim-main/apps/sim/app/api/files/upload/route.test.ts
Signals: Next.js

```typescript
import { NextRequest } from 'next/server'
/**
 * Tests for file upload API route
 *
 * @vitest-environment node
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { setupFileApiMocks } from '@/app/api/__test-utils__/utils'

describe('File Upload API Route', () => {
  const createMockFormData = (files: File[], context = 'workspace'): FormData => {
    const formData = new FormData()
    formData.append('context', context)
    formData.append('workspaceId', 'test-workspace-id')
    files.forEach((file) => {
      formData.append('file', file)
    })
    return formData
  }

  const createMockFile = (
    name = 'test.txt',
    type = 'text/plain',
    content = 'test content'
  ): File => {
    return new File([content], name, { type })
  }

  beforeEach(() => {
    vi.resetModules()
    vi.doMock('@/lib/uploads/setup.server', () => ({
      UPLOAD_DIR_SERVER: '/tmp/test-uploads',
    }))
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should upload a file to local storage', async () => {
    setupFileApiMocks({
      cloudEnabled: false,
      storageProvider: 'local',
    })

    const mockFile = createMockFile()
    const formData = createMockFormData([mockFile])

    const req = new NextRequest('http://localhost:3000/api/files/upload', {
      method: 'POST',
      body: formData,
    })

    const { POST } = await import('@/app/api/files/upload/route')

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('url')
    expect(data.url).toMatch(/\/api\/files\/serve\/.*\.txt$/)
    expect(data).toHaveProperty('name', 'test.txt')
    expect(data).toHaveProperty('size')
    expect(data).toHaveProperty('type', 'text/plain')
    expect(data).toHaveProperty('key')

    const { uploadWorkspaceFile } = await import('@/lib/uploads/contexts/workspace')
    expect(uploadWorkspaceFile).toHaveBeenCalled()
  })

  it('should upload a file to S3 when in S3 mode', async () => {
    setupFileApiMocks({
      cloudEnabled: true,
      storageProvider: 's3',
    })

    const mockFile = createMockFile()
    const formData = createMockFormData([mockFile])

    const req = new NextRequest('http://localhost:3000/api/files/upload', {
      method: 'POST',
      body: formData,
    })

    const { POST } = await import('@/app/api/files/upload/route')

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('url')
    expect(data.url).toContain('/api/files/serve/')
    expect(data).toHaveProperty('name', 'test.txt')
    expect(data).toHaveProperty('size')
    expect(data).toHaveProperty('type', 'text/plain')
    expect(data).toHaveProperty('key')

    const { uploadWorkspaceFile } = await import('@/lib/uploads/contexts/workspace')
    expect(uploadWorkspaceFile).toHaveBeenCalled()
  })

  it('should handle multiple file uploads', async () => {
    setupFileApiMocks({
      cloudEnabled: false,
      storageProvider: 'local',
    })

    const mockFile1 = createMockFile('file1.txt', 'text/plain')
    const mockFile2 = createMockFile('file2.txt', 'text/plain')
    const formData = createMockFormData([mockFile1, mockFile2])

    const req = new NextRequest('http://localhost:3000/api/files/upload', {
      method: 'POST',
      body: formData,
    })

    const { POST } = await import('@/app/api/files/upload/route')

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBeGreaterThanOrEqual(200)
    expect(response.status).toBeLessThan(600)
    expect(data).toBeDefined()
  })

  it('should handle missing files', async () => {
    setupFileApiMocks()

    const formData = new FormData()

    const req = new NextRequest('http://localhost:3000/api/files/upload', {
      method: 'POST',
      body: formData,
    })

    const { POST } = await import('@/app/api/files/upload/route')

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error', 'InvalidRequestError')
    expect(data).toHaveProperty('message', 'No files provided')
  })

  it('should handle S3 upload errors', async () => {
    vi.resetModules()

    setupFileApiMocks({
      cloudEnabled: true,
      storageProvider: 's3',
    })

    vi.doMock('@/lib/uploads/contexts/workspace', () => ({
      uploadWorkspaceFile: vi.fn().mockRejectedValue(new Error('Storage limit exceeded')),
    }))

    const mockFile = createMockFile()
    const formData = createMockFormData([mockFile])

    const req = new NextRequest('http://localhost:3000/api/files/upload', {
      method: 'POST',
      body: formData,
    })

    const { POST } = await import('@/app/api/files/upload/route')

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(413)
    expect(data).toHaveProperty('error')
    expect(typeof data.error).toBe('string')

    vi.resetModules()
  })

  it('should handle CORS preflight requests', async () => {
    const { OPTIONS } = await import('@/app/api/files/upload/route')

    const response = await OPTIONS()

    expect(response.status).toBe(204)
    expect(response.headers.get('Access-Control-Allow-Methods')).toBe('GET, POST, DELETE, OPTIONS')
    expect(response.headers.get('Access-Control-Allow-Headers')).toBe('Content-Type')
  })
})

describe('File Upload Security Tests', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()

    vi.doMock('@/lib/auth', () => ({
      getSession: vi.fn().mockResolvedValue({
        user: { id: 'test-user-id' },
      }),
    }))

    vi.doMock('@/lib/uploads', () => ({
      isUsingCloudStorage: vi.fn().mockReturnValue(false),
      StorageService: {
        uploadFile: vi.fn().mockResolvedValue({
          key: 'test-key',
          path: '/test/path',
        }),
        hasCloudStorage: vi.fn().mockReturnValue(false),
      },
    }))

    vi.doMock('@/lib/uploads/core/storage-service', () => ({
      uploadFile: vi.fn().mockResolvedValue({
        key: 'test-key',
        path: '/test/path',
      }),
      hasCloudStorage: vi.fn().mockReturnValue(false),
    }))

    vi.doMock('@/lib/uploads/setup.server', () => ({}))
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('File Extension Validation', () => {
    beforeEach(() => {
      vi.resetModules()
      setupFileApiMocks({
        cloudEnabled: false,
        storageProvider: 'local',
      })
    })

    it('should accept allowed file types', async () => {
      const allowedTypes = [
        'pdf',
        'doc',
        'docx',
        'txt',
        'md',
        'png',
        'jpg',
        'jpeg',
        'gif',
        'csv',
        'xlsx',
        'xls',
      ]

      for (const ext of allowedTypes) {
        const formData = new FormData()
        const file = new File(['test content'], `test.${ext}`, { type: 'application/octet-stream' })
        formData.append('file', file)
        formData.append('context', 'workspace')
        formData.append('workspaceId', 'test-workspace-id')

        const req = new Request('http://localhost/api/files/upload', {
          method: 'POST',
          body: formData,
        })

        const { POST } = await import('@/app/api/files/upload/route')
        const response = await POST(req as any)

        expect(response.status).toBe(200)
      }
    })

    it('should reject HTML files to prevent XSS', async () => {
      const formData = new FormData()
      const maliciousContent = '<script>alert("XSS")</script>'
      const file = new File([maliciousContent], 'malicious.html', { type: 'text/html' })
      formData.append('file', file)
      formData.append('context', 'workspace')
      formData.append('workspaceId', 'test-workspace-id')

      const req = new Request('http://localhost/api/files/upload', {
        method: 'POST',
        body: formData,
      })

      const { POST } = await import('@/app/api/files/upload/route')
      const response = await POST(req as any)

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.message).toContain("File type 'html' is not allowed")
    })

    it('should reject HTML files to prevent XSS', async () => {
      const formData = new FormData()
      const maliciousContent = '<script>alert("XSS")</script>'
      const file = new File([maliciousContent], 'malicious.html', { type: 'text/html' })
      formData.append('file', file)
      formData.append('context', 'workspace')
      formData.append('workspaceId', 'test-workspace-id')

      const req = new Request('http://localhost/api/files/upload', {
        method: 'POST',
        body: formData,
      })

      const { POST } = await import('@/app/api/files/upload/route')
      const response = await POST(req as any)

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.message).toContain("File type 'html' is not allowed")
    })

    it('should reject SVG files to prevent XSS', async () => {
      const formData = new FormData()
      const maliciousSvg = '<svg onload="alert(\'XSS\')" xmlns="http://www.w3.org/2000/svg"></svg>'
      const file = new File([maliciousSvg], 'malicious.svg', { type: 'image/svg+xml' })
      formData.append('file', file)
      formData.append('context', 'workspace')
      formData.append('workspaceId', 'test-workspace-id')

      const req = new Request('http://localhost/api/files/upload', {
        method: 'POST',
        body: formData,
      })

      const { POST } = await import('@/app/api/files/upload/route')
      const response = await POST(req as any)

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.message).toContain("File type 'svg' is not allowed")
    })

    it('should reject JavaScript files', async () => {
      const formData = new FormData()
      const maliciousJs = 'alert("XSS")'
      const file = new File([maliciousJs], 'malicious.js', { type: 'application/javascript' })
      formData.append('file', file)
      formData.append('context', 'workspace')
      formData.append('workspaceId', 'test-workspace-id')

      const req = new Request('http://localhost/api/files/upload', {
        method: 'POST',
        body: formData,
      })

      const { POST } = await import('@/app/api/files/upload/route')
      const response = await POST(req as any)

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.message).toContain("File type 'js' is not allowed")
    })

    it('should reject files without extensions', async () => {
      const formData = new FormData()
      const file = new File(['test content'], 'noextension', { type: 'application/octet-stream' })
      formData.append('file', file)
      formData.append('context', 'workspace')
      formData.append('workspaceId', 'test-workspace-id')

      const req = new Request('http://localhost/api/files/upload', {
        method: 'POST',
        body: formData,
      })

      const { POST } = await import('@/app/api/files/upload/route')
      const response = await POST(req as any)

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.message).toContain("File type 'noextension' is not allowed")
    })

    it('should handle multiple files with mixed valid/invalid types', async () => {
      const formData = new FormData()

      const validFile = new File(['valid content'], 'valid.pdf', { type: 'application/pdf' })
      formData.append('file', validFile)

      const invalidFile = new File(['<script>alert("XSS")</script>'], 'malicious.html', {
        type: 'text/html',
      })
      formData.append('file', invalidFile)
      formData.append('context', 'workspace')
      formData.append('workspaceId', 'test-workspace-id')

      const req = new Request('http://localhost/api/files/upload', {
        method: 'POST',
        body: formData,
      })

      const { POST } = await import('@/app/api/files/upload/route')
      const response = await POST(req as any)

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.message).toContain("File type 'html' is not allowed")
    })
  })

  describe('Authentication Requirements', () => {
    it('should reject uploads without authentication', async () => {
      vi.doMock('@/lib/auth', () => ({
        getSession: vi.fn().mockResolvedValue(null),
      }))

      const formData = new FormData()
      const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
      formData.append('file', file)

      const req = new Request('http://localhost/api/files/upload', {
        method: 'POST',
        body: formData,
      })

      const { POST } = await import('@/app/api/files/upload/route')
      const response = await POST(req as any)

      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data.error).toBe('Unauthorized')
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/files/upload/route.ts
Signals: Next.js

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { createLogger } from '@/lib/logs/console/logger'
import '@/lib/uploads/core/setup.server'
import { getSession } from '@/lib/auth'
import type { StorageContext } from '@/lib/uploads/config'
import { isImageFileType } from '@/lib/uploads/utils/file-utils'
import { validateFileType } from '@/lib/uploads/utils/validation'
import { getUserEntityPermissions } from '@/lib/workspaces/permissions/utils'
import {
  createErrorResponse,
  createOptionsResponse,
  InvalidRequestError,
} from '@/app/api/files/utils'

const ALLOWED_EXTENSIONS = new Set([
  // Documents
  'pdf',
  'doc',
  'docx',
  'txt',
  'md',
  'csv',
  'xlsx',
  'xls',
  'json',
  'yaml',
  'yml',
  // Images
  'png',
  'jpg',
  'jpeg',
  'gif',
  // Audio
  'mp3',
  'm4a',
  'wav',
  'webm',
  'ogg',
  'flac',
  'aac',
  'opus',
  // Video
  'mp4',
  'mov',
  'avi',
  'mkv',
])

function validateFileExtension(filename: string): boolean {
  const extension = filename.split('.').pop()?.toLowerCase()
  if (!extension) return false
  return ALLOWED_EXTENSIONS.has(extension)
}

export const dynamic = 'force-dynamic'

const logger = createLogger('FilesUploadAPI')

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()

    const files = formData.getAll('file') as File[]

    if (!files || files.length === 0) {
      throw new InvalidRequestError('No files provided')
    }

    const workflowId = formData.get('workflowId') as string | null
    const executionId = formData.get('executionId') as string | null
    const workspaceId = formData.get('workspaceId') as string | null
    const contextParam = formData.get('context') as string | null

    // Context must be explicitly provided
    if (!contextParam) {
      throw new InvalidRequestError(
        'Upload requires explicit context parameter (knowledge-base, workspace, execution, copilot, chat, or profile-pictures)'
      )
    }

    const context = contextParam as StorageContext

    const storageService = await import('@/lib/uploads/core/storage-service')
    const usingCloudStorage = storageService.hasCloudStorage()
    logger.info(`Using storage mode: ${usingCloudStorage ? 'Cloud' : 'Local'} for file upload`)

    const uploadResults = []

    for (const file of files) {
      const originalName = file.name

      if (!validateFileExtension(originalName)) {
        const extension = originalName.split('.').pop()?.toLowerCase() || 'unknown'
        throw new InvalidRequestError(
          `File type '${extension}' is not allowed. Allowed types: ${Array.from(ALLOWED_EXTENSIONS).join(', ')}`
        )
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Handle execution context
      if (context === 'execution') {
        if (!workflowId || !executionId) {
          throw new InvalidRequestError(
            'Execution context requires workflowId and executionId parameters'
          )
        }

        const { uploadExecutionFile } = await import('@/lib/uploads/contexts/execution')
        const userFile = await uploadExecutionFile(
          {
            workspaceId: workspaceId || '',
            workflowId,
            executionId,
          },
          buffer,
          originalName,
          file.type,
          session.user.id
        )

        uploadResults.push(userFile)
        continue
      }

      // Handle knowledge-base context
      if (context === 'knowledge-base') {
        // Validate file type for knowledge base
        const validationError = validateFileType(originalName, file.type)
        if (validationError) {
          throw new InvalidRequestError(validationError.message)
        }

        if (workspaceId) {
          const permission = await getUserEntityPermissions(
            session.user.id,
            'workspace',
            workspaceId
          )
          if (permission === null) {
            return NextResponse.json(
              { error: 'Insufficient permissions for workspace' },
              { status: 403 }
            )
          }
        }

        logger.info(`Uploading knowledge-base file: ${originalName}`)

        const timestamp = Date.now()
        const safeFileName = originalName.replace(/\s+/g, '-')
        const storageKey = `kb/${timestamp}-${safeFileName}`

        const metadata: Record<string, string> = {
          originalName: originalName,
          uploadedAt: new Date().toISOString(),
          purpose: 'knowledge-base',
          userId: session.user.id,
        }

        if (workspaceId) {
          metadata.workspaceId = workspaceId
        }

        const fileInfo = await storageService.uploadFile({
          file: buffer,
          fileName: storageKey,
          contentType: file.type,
          context: 'knowledge-base',
          preserveKey: true,
          customKey: storageKey,
          metadata,
        })

        const finalPath = usingCloudStorage
          ? `${fileInfo.path}?context=knowledge-base`
          : fileInfo.path

        const uploadResult = {
          fileName: originalName,
          presignedUrl: '', // Not used for server-side uploads
          fileInfo: {
            path: finalPath,
            key: fileInfo.key,
            name: originalName,
            size: buffer.length,
            type: file.type,
          },
          directUploadSupported: false,
        }

        logger.info(`Successfully uploaded knowledge-base file: ${fileInfo.key}`)
        uploadResults.push(uploadResult)
        continue
      }

      // Handle workspace context
      if (context === 'workspace') {
        if (!workspaceId) {
          throw new InvalidRequestError('Workspace context requires workspaceId parameter')
        }

        try {
          const { uploadWorkspaceFile } = await import('@/lib/uploads/contexts/workspace')
          const userFile = await uploadWorkspaceFile(
            workspaceId,
            session.user.id,
            buffer,
            originalName,
            file.type || 'application/octet-stream'
          )

          uploadResults.push(userFile)
          continue
        } catch (workspaceError) {
          const errorMessage =
            workspaceError instanceof Error ? workspaceError.message : 'Upload failed'
          const isDuplicate = errorMessage.includes('already exists')
          const isStorageLimitError =
            errorMessage.includes('Storage limit exceeded') ||
            errorMessage.includes('storage limit')

          logger.warn(`Workspace file upload failed: ${errorMessage}`)

          let statusCode = 500
          if (isDuplicate) statusCode = 409
          else if (isStorageLimitError) statusCode = 413

          return NextResponse.json(
            {
              success: false,
              error: errorMessage,
              isDuplicate,
            },
            { status: statusCode }
          )
        }
      }

      // Handle image-only contexts (copilot, chat, profile-pictures)
      if (context === 'copilot' || context === 'chat' || context === 'profile-pictures') {
        if (!isImageFileType(file.type)) {
          throw new InvalidRequestError(
            `Only image files (JPEG, PNG, GIF, WebP, SVG) are allowed for ${context} uploads`
          )
        }

        if (context === 'chat' && workspaceId) {
          const permission = await getUserEntityPermissions(
            session.user.id,
            'workspace',
            workspaceId
          )
          if (permission === null) {
            return NextResponse.json(
              { error: 'Insufficient permissions for workspace' },
              { status: 403 }
            )
          }
        }

        logger.info(`Uploading ${context} file: ${originalName}`)

        // Generate storage key with context prefix and timestamp to ensure uniqueness
        const timestamp = Date.now()
        const safeFileName = originalName.replace(/\s+/g, '-')
        const storageKey = `${context}/${timestamp}-${safeFileName}`

        const metadata: Record<string, string> = {
          originalName: originalName,
          uploadedAt: new Date().toISOString(),
          purpose: context,
          userId: session.user.id,
        }

        if (workspaceId && context === 'chat') {
          metadata.workspaceId = workspaceId
        }

        const fileInfo = await storageService.uploadFile({
          file: buffer,
          fileName: storageKey,
          contentType: file.type,
          context,
          preserveKey: true,
          customKey: storageKey,
          metadata,
        })

        const finalPath = usingCloudStorage ? `${fileInfo.path}?context=${context}` : fileInfo.path

        const uploadResult = {
          fileName: originalName,
          presignedUrl: '', // Not used for server-side uploads
          fileInfo: {
            path: finalPath,
            key: fileInfo.key,
            name: originalName,
            size: buffer.length,
            type: file.type,
          },
          directUploadSupported: false,
        }

        logger.info(`Successfully uploaded ${context} file: ${fileInfo.key}`)
        uploadResults.push(uploadResult)
        continue
      }

      // Unknown context
      throw new InvalidRequestError(
        `Unsupported context: ${context}. Use knowledge-base, workspace, execution, copilot, chat, or profile-pictures`
      )
    }

    if (uploadResults.length === 1) {
      return NextResponse.json(uploadResults[0])
    }
    return NextResponse.json({ files: uploadResults })
  } catch (error) {
    logger.error('Error in file upload:', error)
    return createErrorResponse(error instanceof Error ? error : new Error('File upload failed'))
  }
}

export async function OPTIONS() {
  return createOptionsResponse()
}
```

--------------------------------------------------------------------------------

````
