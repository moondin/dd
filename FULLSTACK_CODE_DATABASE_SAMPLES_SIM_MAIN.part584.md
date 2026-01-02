---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 584
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 584 of 933)

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

---[FILE: client.test.ts]---
Location: sim-main/apps/sim/lib/uploads/providers/s3/client.test.ts

```typescript
/**
 * Tests for S3 client functionality
 *
 * @vitest-environment node
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('S3 Client', () => {
  const mockSend = vi.fn()
  const mockS3Client = {
    send: mockSend,
  }

  const mockPutObjectCommand = vi.fn()
  const mockGetObjectCommand = vi.fn()
  const mockDeleteObjectCommand = vi.fn()
  const mockGetSignedUrl = vi.fn()

  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()

    vi.doMock('@aws-sdk/client-s3', () => ({
      S3Client: vi.fn(() => mockS3Client),
      PutObjectCommand: mockPutObjectCommand,
      GetObjectCommand: mockGetObjectCommand,
      DeleteObjectCommand: mockDeleteObjectCommand,
    }))

    vi.doMock('@aws-sdk/s3-request-presigner', () => ({
      getSignedUrl: mockGetSignedUrl,
    }))

    vi.doMock('@/lib/core/config/env', () => ({
      env: {
        S3_BUCKET_NAME: 'test-bucket',
        AWS_REGION: 'test-region',
        AWS_ACCESS_KEY_ID: 'test-access-key',
        AWS_SECRET_ACCESS_KEY: 'test-secret-key',
      },
    }))

    vi.doMock('@/lib/logs/console/logger', () => ({
      createLogger: vi.fn().mockReturnValue({
        debug: vi.fn(),
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
      }),
    }))

    vi.doMock('@/lib/uploads/setup', () => ({
      S3_CONFIG: {
        bucket: 'test-bucket',
        region: 'test-region',
      },
    }))

    vi.spyOn(Date, 'now').mockReturnValue(1672603200000)
    vi.spyOn(Date.prototype, 'toISOString').mockReturnValue('2025-06-16T01:13:10.765Z')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('uploadToS3', () => {
    it('should upload a file to S3 and return file info', async () => {
      mockSend.mockResolvedValueOnce({})

      const { uploadToS3 } = await import('@/lib/uploads/providers/s3/client')

      const file = Buffer.from('test content')
      const fileName = 'test-file.txt'
      const contentType = 'text/plain'

      const result = await uploadToS3(file, fileName, contentType)

      expect(mockPutObjectCommand).toHaveBeenCalledWith({
        Bucket: 'test-bucket',
        Key: expect.stringContaining('test-file.txt'),
        Body: file,
        ContentType: 'text/plain',
        Metadata: {
          originalName: 'test-file.txt',
          uploadedAt: expect.any(String),
        },
      })

      expect(mockSend).toHaveBeenCalledWith(expect.any(Object))

      expect(result).toEqual({
        path: expect.stringContaining('/api/files/serve/'),
        key: expect.stringContaining('test-file.txt'),
        name: 'test-file.txt',
        size: file.length,
        type: 'text/plain',
      })
    })

    it('should handle spaces in filenames', async () => {
      mockSend.mockResolvedValueOnce({})

      const { uploadToS3 } = await import('@/lib/uploads/providers/s3/client')

      const testFile = Buffer.from('test file content')
      const fileName = 'test file with spaces.txt'
      const contentType = 'text/plain'

      const result = await uploadToS3(testFile, fileName, contentType)

      expect(mockPutObjectCommand).toHaveBeenCalledWith(
        expect.objectContaining({
          Key: expect.stringContaining('test-file-with-spaces.txt'),
        })
      )

      expect(result.name).toBe(fileName)
    })

    it('should use provided size if available', async () => {
      mockSend.mockResolvedValueOnce({})

      const { uploadToS3 } = await import('@/lib/uploads/providers/s3/client')

      const testFile = Buffer.from('test file content')
      const fileName = 'test-file.txt'
      const contentType = 'text/plain'
      const providedSize = 1000

      const result = await uploadToS3(testFile, fileName, contentType, providedSize)

      expect(result.size).toBe(providedSize)
    })

    it('should handle upload errors', async () => {
      const error = new Error('Upload failed')
      mockSend.mockRejectedValueOnce(error)

      const { uploadToS3 } = await import('@/lib/uploads/providers/s3/client')

      const testFile = Buffer.from('test file content')
      const fileName = 'test-file.txt'
      const contentType = 'text/plain'

      await expect(uploadToS3(testFile, fileName, contentType)).rejects.toThrow('Upload failed')
    })
  })

  describe('getPresignedUrl', () => {
    it('should generate a presigned URL for a file', async () => {
      mockGetSignedUrl.mockResolvedValueOnce('https://example.com/presigned-url')

      const { getPresignedUrl } = await import('@/lib/uploads/providers/s3/client')

      const key = 'test-file.txt'
      const expiresIn = 1800

      const url = await getPresignedUrl(key, expiresIn)

      expect(mockGetObjectCommand).toHaveBeenCalledWith({
        Bucket: 'test-bucket',
        Key: key,
      })

      expect(mockGetSignedUrl).toHaveBeenCalledWith(mockS3Client, expect.any(Object), { expiresIn })

      expect(url).toBe('https://example.com/presigned-url')
    })

    it('should use default expiration if not provided', async () => {
      mockGetSignedUrl.mockResolvedValueOnce('https://example.com/presigned-url')

      const { getPresignedUrl } = await import('@/lib/uploads/providers/s3/client')

      const key = 'test-file.txt'

      await getPresignedUrl(key)

      expect(mockGetSignedUrl).toHaveBeenCalledWith(
        mockS3Client,
        expect.any(Object),
        { expiresIn: 3600 } // Default is 3600 seconds (1 hour)
      )
    })

    it('should handle errors when generating presigned URL', async () => {
      const error = new Error('Presigned URL generation failed')
      mockGetSignedUrl.mockRejectedValueOnce(error)

      const { getPresignedUrl } = await import('@/lib/uploads/providers/s3/client')

      const key = 'test-file.txt'

      await expect(getPresignedUrl(key)).rejects.toThrow('Presigned URL generation failed')
    })
  })

  describe('downloadFromS3', () => {
    it('should download a file from S3', async () => {
      const mockStream = {
        on: vi.fn((event, callback) => {
          if (event === 'data') {
            callback(Buffer.from('chunk1'))
            callback(Buffer.from('chunk2'))
          }
          if (event === 'end') {
            callback()
          }
          return mockStream
        }),
      }

      mockSend.mockResolvedValueOnce({
        Body: mockStream,
        $metadata: { httpStatusCode: 200 },
      })

      const { downloadFromS3 } = await import('@/lib/uploads/providers/s3/client')

      const key = 'test-file.txt'

      const result = await downloadFromS3(key)

      expect(mockGetObjectCommand).toHaveBeenCalledWith({
        Bucket: 'test-bucket',
        Key: key,
      })

      expect(mockSend).toHaveBeenCalledTimes(1)
      expect(result).toBeInstanceOf(Buffer)
      expect(result.toString()).toBe('chunk1chunk2')
    })

    it('should handle stream errors', async () => {
      const mockStream = {
        on: vi.fn((event, callback) => {
          if (event === 'error') {
            callback(new Error('Stream error'))
          }
          return mockStream
        }),
      }

      mockSend.mockResolvedValueOnce({
        Body: mockStream,
        $metadata: { httpStatusCode: 200 },
      })

      const { downloadFromS3 } = await import('@/lib/uploads/providers/s3/client')

      const key = 'test-file.txt'

      await expect(downloadFromS3(key)).rejects.toThrow('Stream error')
    })

    it('should handle S3 client errors', async () => {
      const error = new Error('Download failed')
      mockSend.mockRejectedValueOnce(error)

      const { downloadFromS3 } = await import('@/lib/uploads/providers/s3/client')

      const key = 'test-file.txt'

      await expect(downloadFromS3(key)).rejects.toThrow('Download failed')
    })
  })

  describe('deleteFromS3', () => {
    it('should delete a file from S3', async () => {
      mockSend.mockResolvedValueOnce({})

      const { deleteFromS3 } = await import('@/lib/uploads/providers/s3/client')

      const key = 'test-file.txt'

      await deleteFromS3(key)

      expect(mockDeleteObjectCommand).toHaveBeenCalledWith({
        Bucket: 'test-bucket',
        Key: key,
      })

      expect(mockSend).toHaveBeenCalledTimes(1)
    })

    it('should handle delete errors', async () => {
      const error = new Error('Delete failed')
      mockSend.mockRejectedValueOnce(error)

      const { deleteFromS3 } = await import('@/lib/uploads/providers/s3/client')

      const key = 'test-file.txt'

      await expect(deleteFromS3(key)).rejects.toThrow('Delete failed')
    })
  })

  describe('s3Client initialization', () => {
    it('should initialize with correct configuration when credentials are available', async () => {
      vi.doMock('@/lib/core/config/env', () => ({
        env: {
          S3_BUCKET_NAME: 'test-bucket',
          AWS_REGION: 'test-region',
          AWS_ACCESS_KEY_ID: 'test-access-key',
          AWS_SECRET_ACCESS_KEY: 'test-secret-key',
        },
      }))

      vi.doMock('@/lib/uploads/setup', () => ({
        S3_CONFIG: {
          bucket: 'test-bucket',
          region: 'test-region',
        },
      }))

      vi.resetModules()
      const { getS3Client } = await import('@/lib/uploads/providers/s3/client')
      const { S3Client } = await import('@aws-sdk/client-s3')

      const client = getS3Client()

      expect(client).toBeDefined()
      expect(S3Client).toHaveBeenCalledWith({
        region: 'test-region',
        credentials: {
          accessKeyId: 'test-access-key',
          secretAccessKey: 'test-secret-key',
        },
      })
    })

    it('should initialize without credentials when env vars are not available', async () => {
      vi.doMock('@/lib/core/config/env', () => ({
        env: {
          S3_BUCKET_NAME: 'test-bucket',
          AWS_REGION: 'test-region',
          AWS_ACCESS_KEY_ID: undefined,
          AWS_SECRET_ACCESS_KEY: undefined,
        },
      }))

      vi.doMock('@/lib/uploads/setup', () => ({
        S3_CONFIG: {
          bucket: 'test-bucket',
          region: 'test-region',
        },
      }))

      vi.resetModules()
      const { getS3Client } = await import('@/lib/uploads/providers/s3/client')
      const { S3Client } = await import('@aws-sdk/client-s3')

      const client = getS3Client()

      expect(client).toBeDefined()
      expect(S3Client).toHaveBeenCalledWith({
        region: 'test-region',
        credentials: undefined,
      })
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: client.ts]---
Location: sim-main/apps/sim/lib/uploads/providers/s3/client.ts

```typescript
import {
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  UploadPartCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { env } from '@/lib/core/config/env'
import { S3_CONFIG, S3_KB_CONFIG } from '@/lib/uploads/config'
import type {
  S3Config,
  S3MultipartPart,
  S3MultipartUploadInit,
  S3PartUploadUrl,
} from '@/lib/uploads/providers/s3/types'
import type { FileInfo } from '@/lib/uploads/shared/types'
import {
  sanitizeFilenameForMetadata,
  sanitizeStorageMetadata,
} from '@/lib/uploads/utils/file-utils'

let _s3Client: S3Client | null = null

export function getS3Client(): S3Client {
  if (_s3Client) return _s3Client

  const { region } = S3_CONFIG

  if (!region) {
    throw new Error(
      'AWS region is missing – set AWS_REGION in your environment or disable S3 uploads.'
    )
  }

  _s3Client = new S3Client({
    region,
    credentials:
      env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY
        ? {
            accessKeyId: env.AWS_ACCESS_KEY_ID,
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
          }
        : undefined,
  })

  return _s3Client
}

/**
 * Upload a file to S3
 * @param file Buffer containing file data
 * @param fileName Original file name
 * @param contentType MIME type of the file
 * @param configOrSize Custom S3 configuration OR file size in bytes (optional)
 * @param size File size in bytes (required if configOrSize is S3Config, optional otherwise)
 * @param skipTimestampPrefix Skip adding timestamp prefix to filename (default: false)
 * @param metadata Optional metadata to store with the file
 * @returns Object with file information
 */
export async function uploadToS3(
  file: Buffer,
  fileName: string,
  contentType: string,
  configOrSize?: S3Config | number,
  size?: number,
  skipTimestampPrefix?: boolean,
  metadata?: Record<string, string>
): Promise<FileInfo> {
  let config: S3Config
  let fileSize: number
  let shouldSkipTimestamp: boolean

  if (typeof configOrSize === 'object') {
    config = configOrSize
    fileSize = size ?? file.length
    shouldSkipTimestamp = skipTimestampPrefix ?? false
  } else {
    config = { bucket: S3_CONFIG.bucket, region: S3_CONFIG.region }
    fileSize = configOrSize ?? file.length
    shouldSkipTimestamp = skipTimestampPrefix ?? false
  }

  const safeFileName = fileName.replace(/\s+/g, '-') // Replace spaces with hyphens
  const uniqueKey = shouldSkipTimestamp ? fileName : `${Date.now()}-${safeFileName}`

  const s3Client = getS3Client()

  const s3Metadata: Record<string, string> = {
    originalName: sanitizeFilenameForMetadata(fileName),
    uploadedAt: new Date().toISOString(),
  }

  if (metadata) {
    Object.assign(s3Metadata, sanitizeStorageMetadata(metadata, 2000))
  }

  await s3Client.send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: uniqueKey,
      Body: file,
      ContentType: contentType,
      Metadata: s3Metadata,
    })
  )

  const servePath = `/api/files/serve/${encodeURIComponent(uniqueKey)}`

  return {
    path: servePath,
    key: uniqueKey,
    name: fileName,
    size: fileSize,
    type: contentType,
  }
}

/**
 * Generate a presigned URL for direct file access
 * @param key S3 object key
 * @param expiresIn Time in seconds until URL expires
 * @returns Presigned URL
 */
export async function getPresignedUrl(key: string, expiresIn = 3600) {
  const command = new GetObjectCommand({
    Bucket: S3_CONFIG.bucket,
    Key: key,
  })

  return getSignedUrl(getS3Client(), command, { expiresIn })
}

/**
 * Generate a presigned URL for direct file access with custom bucket
 * @param key S3 object key
 * @param customConfig Custom S3 configuration
 * @param expiresIn Time in seconds until URL expires
 * @returns Presigned URL
 */
export async function getPresignedUrlWithConfig(
  key: string,
  customConfig: S3Config,
  expiresIn = 3600
) {
  const command = new GetObjectCommand({
    Bucket: customConfig.bucket,
    Key: key,
  })

  return getSignedUrl(getS3Client(), command, { expiresIn })
}

/**
 * Download a file from S3
 * @param key S3 object key
 * @returns File buffer
 */
export async function downloadFromS3(key: string): Promise<Buffer>

/**
 * Download a file from S3 with custom bucket configuration
 * @param key S3 object key
 * @param customConfig Custom S3 configuration
 * @returns File buffer
 */
export async function downloadFromS3(key: string, customConfig: S3Config): Promise<Buffer>

export async function downloadFromS3(key: string, customConfig?: S3Config): Promise<Buffer> {
  const config = customConfig || { bucket: S3_CONFIG.bucket, region: S3_CONFIG.region }

  const command = new GetObjectCommand({
    Bucket: config.bucket,
    Key: key,
  })

  const response = await getS3Client().send(command)
  const stream = response.Body as any

  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = []
    stream.on('data', (chunk: Buffer) => chunks.push(chunk))
    stream.on('end', () => resolve(Buffer.concat(chunks)))
    stream.on('error', reject)
  })
}

/**
 * Delete a file from S3
 * @param key S3 object key
 */
export async function deleteFromS3(key: string): Promise<void>

/**
 * Delete a file from S3 with custom bucket configuration
 * @param key S3 object key
 * @param customConfig Custom S3 configuration
 */
export async function deleteFromS3(key: string, customConfig: S3Config): Promise<void>

export async function deleteFromS3(key: string, customConfig?: S3Config): Promise<void> {
  const config = customConfig || { bucket: S3_CONFIG.bucket, region: S3_CONFIG.region }

  await getS3Client().send(
    new DeleteObjectCommand({
      Bucket: config.bucket,
      Key: key,
    })
  )
}

/**
 * Initiate a multipart upload for S3
 */
export async function initiateS3MultipartUpload(
  options: S3MultipartUploadInit
): Promise<{ uploadId: string; key: string }> {
  const { fileName, contentType, customConfig } = options

  const config = customConfig || { bucket: S3_KB_CONFIG.bucket, region: S3_KB_CONFIG.region }
  const s3Client = getS3Client()

  const safeFileName = fileName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '_')
  const { v4: uuidv4 } = await import('uuid')
  const uniqueKey = `kb/${uuidv4()}-${safeFileName}`

  const command = new CreateMultipartUploadCommand({
    Bucket: config.bucket,
    Key: uniqueKey,
    ContentType: contentType,
    Metadata: {
      originalName: sanitizeFilenameForMetadata(fileName),
      uploadedAt: new Date().toISOString(),
      purpose: 'knowledge-base',
    },
  })

  const response = await s3Client.send(command)

  if (!response.UploadId) {
    throw new Error('Failed to initiate S3 multipart upload')
  }

  return {
    uploadId: response.UploadId,
    key: uniqueKey,
  }
}

/**
 * Generate presigned URLs for uploading parts to S3
 */
export async function getS3MultipartPartUrls(
  key: string,
  uploadId: string,
  partNumbers: number[],
  customConfig?: S3Config
): Promise<S3PartUploadUrl[]> {
  const config = customConfig || { bucket: S3_KB_CONFIG.bucket, region: S3_KB_CONFIG.region }
  const s3Client = getS3Client()

  const presignedUrls = await Promise.all(
    partNumbers.map(async (partNumber) => {
      const command = new UploadPartCommand({
        Bucket: config.bucket,
        Key: key,
        PartNumber: partNumber,
        UploadId: uploadId,
      })

      const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
      return { partNumber, url }
    })
  )

  return presignedUrls
}

/**
 * Complete multipart upload for S3
 */
export async function completeS3MultipartUpload(
  key: string,
  uploadId: string,
  parts: S3MultipartPart[],
  customConfig?: S3Config
): Promise<{ location: string; path: string; key: string }> {
  const config = customConfig || { bucket: S3_KB_CONFIG.bucket, region: S3_KB_CONFIG.region }
  const s3Client = getS3Client()

  const command = new CompleteMultipartUploadCommand({
    Bucket: config.bucket,
    Key: key,
    UploadId: uploadId,
    MultipartUpload: {
      Parts: parts.sort((a, b) => a.PartNumber - b.PartNumber),
    },
  })

  const response = await s3Client.send(command)
  const location =
    response.Location || `https://${config.bucket}.s3.${config.region}.amazonaws.com/${key}`
  const path = `/api/files/serve/${encodeURIComponent(key)}`

  return {
    location,
    path,
    key,
  }
}

/**
 * Abort multipart upload for S3
 */
export async function abortS3MultipartUpload(
  key: string,
  uploadId: string,
  customConfig?: S3Config
): Promise<void> {
  const config = customConfig || { bucket: S3_KB_CONFIG.bucket, region: S3_KB_CONFIG.region }
  const s3Client = getS3Client()

  const command = new AbortMultipartUploadCommand({
    Bucket: config.bucket,
    Key: key,
    UploadId: uploadId,
  })

  await s3Client.send(command)
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/lib/uploads/providers/s3/index.ts

```typescript
export {
  deleteFromS3,
  downloadFromS3,
  getPresignedUrl,
  getPresignedUrlWithConfig,
  getS3Client,
  uploadToS3,
} from '@/lib/uploads/providers/s3/client'
export type {
  S3Config,
  S3MultipartPart,
  S3MultipartUploadInit,
  S3PartUploadUrl,
} from '@/lib/uploads/providers/s3/types'
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/lib/uploads/providers/s3/types.ts

```typescript
export interface S3Config {
  bucket: string
  region: string
}

export interface S3MultipartUploadInit {
  fileName: string
  contentType: string
  fileSize: number
  customConfig?: S3Config
}

export interface S3PartUploadUrl {
  partNumber: number
  url: string
}

export interface S3MultipartPart {
  ETag: string
  PartNumber: number
}
```

--------------------------------------------------------------------------------

---[FILE: metadata.ts]---
Location: sim-main/apps/sim/lib/uploads/server/metadata.ts

```typescript
import { db } from '@sim/db'
import { workspaceFiles } from '@sim/db/schema'
import { and, eq } from 'drizzle-orm'
import { createLogger } from '@/lib/logs/console/logger'
import type { StorageContext } from '../shared/types'

const logger = createLogger('FileMetadata')

export interface FileMetadataRecord {
  id: string
  key: string
  userId: string
  workspaceId: string | null
  context: string
  originalName: string
  contentType: string
  size: number
  uploadedAt: Date
}

export interface FileMetadataInsertOptions {
  key: string
  userId: string
  workspaceId?: string | null
  context: StorageContext
  originalName: string
  contentType: string
  size: number
  id?: string // Optional - will generate UUID if not provided
}

export interface FileMetadataQueryOptions {
  context?: StorageContext
  workspaceId?: string
  userId?: string
}

/**
 * Insert file metadata into workspaceFiles table
 * Handles duplicate key errors gracefully by returning existing record
 */
export async function insertFileMetadata(
  options: FileMetadataInsertOptions
): Promise<FileMetadataRecord> {
  const { key, userId, workspaceId, context, originalName, contentType, size, id } = options

  const existing = await db
    .select()
    .from(workspaceFiles)
    .where(eq(workspaceFiles.key, key))
    .limit(1)

  if (existing.length > 0) {
    return {
      id: existing[0].id,
      key: existing[0].key,
      userId: existing[0].userId,
      workspaceId: existing[0].workspaceId,
      context: existing[0].context,
      originalName: existing[0].originalName,
      contentType: existing[0].contentType,
      size: existing[0].size,
      uploadedAt: existing[0].uploadedAt,
    }
  }

  const fileId = id || (await import('uuid')).v4()

  try {
    await db.insert(workspaceFiles).values({
      id: fileId,
      key,
      userId,
      workspaceId: workspaceId || null,
      context,
      originalName,
      contentType,
      size,
      uploadedAt: new Date(),
    })

    return {
      id: fileId,
      key,
      userId,
      workspaceId: workspaceId || null,
      context,
      originalName,
      contentType,
      size,
      uploadedAt: new Date(),
    }
  } catch (error) {
    if (
      (error as any)?.code === '23505' ||
      (error instanceof Error && error.message.includes('unique'))
    ) {
      const existingAfterError = await db
        .select()
        .from(workspaceFiles)
        .where(eq(workspaceFiles.key, key))
        .limit(1)

      if (existingAfterError.length > 0) {
        return {
          id: existingAfterError[0].id,
          key: existingAfterError[0].key,
          userId: existingAfterError[0].userId,
          workspaceId: existingAfterError[0].workspaceId,
          context: existingAfterError[0].context,
          originalName: existingAfterError[0].originalName,
          contentType: existingAfterError[0].contentType,
          size: existingAfterError[0].size,
          uploadedAt: existingAfterError[0].uploadedAt,
        }
      }
    }

    logger.error(`Failed to insert file metadata for key: ${key}`, error)
    throw error
  }
}

/**
 * Get file metadata by key with optional context filter
 */
export async function getFileMetadataByKey(
  key: string,
  context?: StorageContext
): Promise<FileMetadataRecord | null> {
  const conditions = [eq(workspaceFiles.key, key)]

  if (context) {
    conditions.push(eq(workspaceFiles.context, context))
  }

  const [record] = await db
    .select()
    .from(workspaceFiles)
    .where(conditions.length > 1 ? and(...conditions) : conditions[0])
    .limit(1)

  if (!record) {
    return null
  }

  return {
    id: record.id,
    key: record.key,
    userId: record.userId,
    workspaceId: record.workspaceId,
    context: record.context,
    originalName: record.originalName,
    contentType: record.contentType,
    size: record.size,
    uploadedAt: record.uploadedAt,
  }
}

/**
 * Get file metadata by context with optional workspaceId/userId filters
 */
export async function getFileMetadataByContext(
  context: StorageContext,
  options?: FileMetadataQueryOptions
): Promise<FileMetadataRecord[]> {
  const conditions = [eq(workspaceFiles.context, context)]

  if (options?.workspaceId) {
    conditions.push(eq(workspaceFiles.workspaceId, options.workspaceId))
  }

  if (options?.userId) {
    conditions.push(eq(workspaceFiles.userId, options.userId))
  }

  const records = await db
    .select()
    .from(workspaceFiles)
    .where(conditions.length > 1 ? and(...conditions) : conditions[0])
    .orderBy(workspaceFiles.uploadedAt)

  return records.map((record) => ({
    id: record.id,
    key: record.key,
    userId: record.userId,
    workspaceId: record.workspaceId,
    context: record.context,
    originalName: record.originalName,
    contentType: record.contentType,
    size: record.size,
    uploadedAt: record.uploadedAt,
  }))
}

/**
 * Delete file metadata by key
 */
export async function deleteFileMetadata(key: string): Promise<boolean> {
  await db.delete(workspaceFiles).where(eq(workspaceFiles.key, key))
  return true
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/lib/uploads/shared/types.ts

```typescript
export type StorageContext =
  | 'knowledge-base'
  | 'chat'
  | 'copilot'
  | 'execution'
  | 'workspace'
  | 'profile-pictures'
  | 'logs'

export interface FileInfo {
  path: string
  key: string
  name: string
  size: number
  type: string
}

export interface StorageConfig {
  bucket?: string
  region?: string
  containerName?: string
  accountName?: string
  accountKey?: string
  connectionString?: string
}

export interface UploadFileOptions {
  file: Buffer
  fileName: string
  contentType: string
  context: StorageContext
  preserveKey?: boolean
  customKey?: string
  metadata?: Record<string, string>
}

export interface DownloadFileOptions {
  key: string
  context?: StorageContext
}

export interface DeleteFileOptions {
  key: string
  context?: StorageContext
}

export interface GeneratePresignedUrlOptions {
  fileName: string
  contentType: string
  fileSize: number
  context: StorageContext
  userId?: string
  expirationSeconds?: number
  metadata?: Record<string, string>
}

export interface PresignedUrlResponse {
  url: string
  key: string
  uploadHeaders?: Record<string, string>
}
```

--------------------------------------------------------------------------------

---[FILE: file-utils.server.ts]---
Location: sim-main/apps/sim/lib/uploads/utils/file-utils.server.ts

```typescript
'use server'

import type { Logger } from '@/lib/logs/console/logger'
import type { StorageContext } from '@/lib/uploads'
import { isExecutionFile } from '@/lib/uploads/contexts/execution/utils'
import { inferContextFromKey } from '@/lib/uploads/utils/file-utils'
import type { UserFile } from '@/executor/types'

/**
 * Download a file from a URL (internal or external)
 * For internal URLs, uses direct storage access (server-side only)
 * For external URLs, uses HTTP fetch
 */
export async function downloadFileFromUrl(fileUrl: string, timeoutMs = 180000): Promise<Buffer> {
  const { isInternalFileUrl } = await import('./file-utils')
  const { parseInternalFileUrl } = await import('./file-utils')
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    if (isInternalFileUrl(fileUrl)) {
      const { key, context } = parseInternalFileUrl(fileUrl)
      const { downloadFile } = await import('@/lib/uploads/core/storage-service')
      const buffer = await downloadFile({ key, context })
      clearTimeout(timeoutId)
      return buffer
    }

    const response = await fetch(fileUrl, { signal: controller.signal })
    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`)
    }

    return Buffer.from(await response.arrayBuffer())
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('File download timed out')
    }
    throw error
  }
}

/**
 * Downloads a file from storage (execution or regular)
 * @param userFile - UserFile object
 * @param requestId - Request ID for logging
 * @param logger - Logger instance
 * @returns Buffer containing file data
 */
export async function downloadFileFromStorage(
  userFile: UserFile,
  requestId: string,
  logger: Logger
): Promise<Buffer> {
  let buffer: Buffer

  if (isExecutionFile(userFile)) {
    logger.info(`[${requestId}] Downloading from execution storage: ${userFile.key}`)
    const { downloadExecutionFile } = await import(
      '@/lib/uploads/contexts/execution/execution-file-manager'
    )
    buffer = await downloadExecutionFile(userFile)
  } else if (userFile.key) {
    const context = (userFile.context as StorageContext) || inferContextFromKey(userFile.key)
    logger.info(
      `[${requestId}] Downloading from ${context} storage (${userFile.context ? 'explicit' : 'inferred'}): ${userFile.key}`
    )

    const { downloadFile } = await import('@/lib/uploads/core/storage-service')
    buffer = await downloadFile({
      key: userFile.key,
      context,
    })
  } else {
    throw new Error('File has no key - cannot download')
  }

  return buffer
}
```

--------------------------------------------------------------------------------

````
