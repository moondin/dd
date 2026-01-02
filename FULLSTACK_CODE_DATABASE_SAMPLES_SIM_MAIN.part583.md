---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 583
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 583 of 933)

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

---[FILE: storage-service.ts]---
Location: sim-main/apps/sim/lib/uploads/core/storage-service.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import { getStorageConfig, USE_BLOB_STORAGE, USE_S3_STORAGE } from '@/lib/uploads/config'
import type { BlobConfig } from '@/lib/uploads/providers/blob/types'
import type { S3Config } from '@/lib/uploads/providers/s3/types'
import type {
  DeleteFileOptions,
  DownloadFileOptions,
  FileInfo,
  GeneratePresignedUrlOptions,
  PresignedUrlResponse,
  StorageConfig,
  StorageContext,
  UploadFileOptions,
} from '@/lib/uploads/shared/types'
import {
  sanitizeFileKey,
  sanitizeFilenameForMetadata,
  sanitizeStorageMetadata,
} from '@/lib/uploads/utils/file-utils'

const logger = createLogger('StorageService')

/**
 * Create a Blob config from StorageConfig
 * @throws Error if required properties are missing
 */
function createBlobConfig(config: StorageConfig): BlobConfig {
  if (!config.containerName || !config.accountName) {
    throw new Error('Blob configuration missing required properties: containerName and accountName')
  }

  if (!config.connectionString && !config.accountKey) {
    throw new Error(
      'Blob configuration missing authentication: either connectionString or accountKey must be provided'
    )
  }

  return {
    containerName: config.containerName,
    accountName: config.accountName,
    accountKey: config.accountKey,
    connectionString: config.connectionString,
  }
}

/**
 * Create an S3 config from StorageConfig
 * @throws Error if required properties are missing
 */
function createS3Config(config: StorageConfig): S3Config {
  if (!config.bucket || !config.region) {
    throw new Error('S3 configuration missing required properties: bucket and region')
  }

  return {
    bucket: config.bucket,
    region: config.region,
  }
}

/**
 * Insert file metadata into the database
 */
async function insertFileMetadataHelper(
  key: string,
  metadata: Record<string, string>,
  context: StorageContext,
  fileName: string,
  contentType: string,
  fileSize: number
): Promise<void> {
  const { insertFileMetadata } = await import('../server/metadata')
  await insertFileMetadata({
    key,
    userId: metadata.userId,
    workspaceId: metadata.workspaceId || null,
    context,
    originalName: metadata.originalName || fileName,
    contentType,
    size: fileSize,
  })
}

/**
 * Upload a file to the configured storage provider with context-aware configuration
 */
export async function uploadFile(options: UploadFileOptions): Promise<FileInfo> {
  const { file, fileName, contentType, context, preserveKey, customKey, metadata } = options

  logger.info(`Uploading file to ${context} storage: ${fileName}`)

  const config = getStorageConfig(context)

  const keyToUse = customKey || fileName

  if (USE_BLOB_STORAGE) {
    const { uploadToBlob } = await import('@/lib/uploads/providers/blob/client')
    const uploadResult = await uploadToBlob(
      file,
      keyToUse,
      contentType,
      createBlobConfig(config),
      file.length,
      preserveKey,
      metadata
    )

    if (metadata) {
      await insertFileMetadataHelper(
        uploadResult.key,
        metadata,
        context,
        fileName,
        contentType,
        file.length
      )
    }

    return uploadResult
  }

  if (USE_S3_STORAGE) {
    const { uploadToS3 } = await import('@/lib/uploads/providers/s3/client')
    const uploadResult = await uploadToS3(
      file,
      keyToUse,
      contentType,
      createS3Config(config),
      file.length,
      preserveKey,
      metadata
    )

    if (metadata) {
      await insertFileMetadataHelper(
        uploadResult.key,
        metadata,
        context,
        fileName,
        contentType,
        file.length
      )
    }

    return uploadResult
  }

  const { writeFile, mkdir } = await import('fs/promises')
  const { join, dirname } = await import('path')
  const { UPLOAD_DIR_SERVER } = await import('./setup.server')

  const storageKey = keyToUse
  const safeKey = sanitizeFileKey(keyToUse) // Validates and preserves path structure
  const filesystemPath = join(UPLOAD_DIR_SERVER, safeKey)

  await mkdir(dirname(filesystemPath), { recursive: true })

  await writeFile(filesystemPath, file)

  if (metadata) {
    await insertFileMetadataHelper(
      storageKey,
      metadata,
      context,
      fileName,
      contentType,
      file.length
    )
  }

  return {
    path: `/api/files/serve/${storageKey}`,
    key: storageKey,
    name: fileName,
    size: file.length,
    type: contentType,
  }
}

/**
 * Download a file from the configured storage provider
 */
export async function downloadFile(options: DownloadFileOptions): Promise<Buffer> {
  const { key, context } = options

  if (context) {
    const config = getStorageConfig(context)

    if (USE_BLOB_STORAGE) {
      const { downloadFromBlob } = await import('@/lib/uploads/providers/blob/client')
      return downloadFromBlob(key, createBlobConfig(config))
    }

    if (USE_S3_STORAGE) {
      const { downloadFromS3 } = await import('@/lib/uploads/providers/s3/client')
      return downloadFromS3(key, createS3Config(config))
    }
  }

  const { readFile } = await import('fs/promises')
  const { join } = await import('path')
  const { UPLOAD_DIR_SERVER } = await import('./setup.server')

  const safeKey = sanitizeFileKey(key)
  const filePath = join(UPLOAD_DIR_SERVER, safeKey)

  return readFile(filePath)
}

/**
 * Delete a file from the configured storage provider
 */
export async function deleteFile(options: DeleteFileOptions): Promise<void> {
  const { key, context } = options

  if (context) {
    const config = getStorageConfig(context)

    if (USE_BLOB_STORAGE) {
      const { deleteFromBlob } = await import('@/lib/uploads/providers/blob/client')
      return deleteFromBlob(key, createBlobConfig(config))
    }

    if (USE_S3_STORAGE) {
      const { deleteFromS3 } = await import('@/lib/uploads/providers/s3/client')
      return deleteFromS3(key, createS3Config(config))
    }
  }

  const { unlink } = await import('fs/promises')
  const { join } = await import('path')
  const { UPLOAD_DIR_SERVER } = await import('./setup.server')

  const safeKey = sanitizeFileKey(key)
  const filePath = join(UPLOAD_DIR_SERVER, safeKey)

  await unlink(filePath)
}

/**
 * Generate a presigned URL for direct file upload
 */
export async function generatePresignedUploadUrl(
  options: GeneratePresignedUrlOptions
): Promise<PresignedUrlResponse> {
  const {
    fileName,
    contentType,
    fileSize,
    context,
    userId,
    expirationSeconds = 3600,
    metadata = {},
  } = options

  const allMetadata = {
    ...metadata,
    originalName: fileName,
    uploadedAt: new Date().toISOString(),
    purpose: context,
    ...(userId && { userId }),
  }

  const config = getStorageConfig(context)

  const timestamp = Date.now()
  const uniqueId = Math.random().toString(36).substring(2, 9)
  const safeFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
  const key = `${context}/${timestamp}-${uniqueId}-${safeFileName}`

  if (USE_S3_STORAGE) {
    return generateS3PresignedUrl(
      key,
      contentType,
      fileSize,
      allMetadata,
      config,
      expirationSeconds
    )
  }

  if (USE_BLOB_STORAGE) {
    return generateBlobPresignedUrl(key, contentType, allMetadata, config, expirationSeconds)
  }

  throw new Error('Cloud storage not configured. Cannot generate presigned URL for local storage.')
}

/**
 * Generate presigned URL for S3
 */
async function generateS3PresignedUrl(
  key: string,
  contentType: string,
  fileSize: number,
  metadata: Record<string, string>,
  config: { bucket?: string; region?: string },
  expirationSeconds: number
): Promise<PresignedUrlResponse> {
  const { getS3Client } = await import('@/lib/uploads/providers/s3/client')
  const { PutObjectCommand } = await import('@aws-sdk/client-s3')
  const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner')

  if (!config.bucket || !config.region) {
    throw new Error('S3 configuration missing bucket or region')
  }

  const sanitizedMetadata = sanitizeStorageMetadata(metadata, 2000)
  if (sanitizedMetadata.originalName) {
    sanitizedMetadata.originalName = sanitizeFilenameForMetadata(sanitizedMetadata.originalName)
  }

  const command = new PutObjectCommand({
    Bucket: config.bucket,
    Key: key,
    ContentType: contentType,
    ContentLength: fileSize,
    Metadata: sanitizedMetadata,
  })

  const presignedUrl = await getSignedUrl(getS3Client(), command, { expiresIn: expirationSeconds })

  return {
    url: presignedUrl,
    key,
  }
}

/**
 * Generate presigned URL for Azure Blob
 */
async function generateBlobPresignedUrl(
  key: string,
  contentType: string,
  metadata: Record<string, string>,
  config: {
    containerName?: string
    accountName?: string
    accountKey?: string
    connectionString?: string
  },
  expirationSeconds: number
): Promise<PresignedUrlResponse> {
  const { getBlobServiceClient } = await import('@/lib/uploads/providers/blob/client')
  const { BlobSASPermissions, generateBlobSASQueryParameters, StorageSharedKeyCredential } =
    await import('@azure/storage-blob')

  if (!config.containerName) {
    throw new Error('Blob configuration missing container name')
  }

  const blobServiceClient = await getBlobServiceClient()
  const containerClient = blobServiceClient.getContainerClient(config.containerName)
  const blobClient = containerClient.getBlockBlobClient(key)

  const startsOn = new Date()
  const expiresOn = new Date(startsOn.getTime() + expirationSeconds * 1000)

  let sasToken: string

  if (config.accountName && config.accountKey) {
    const sharedKeyCredential = new StorageSharedKeyCredential(
      config.accountName,
      config.accountKey
    )
    sasToken = generateBlobSASQueryParameters(
      {
        containerName: config.containerName,
        blobName: key,
        permissions: BlobSASPermissions.parse('w'), // write permission for upload
        startsOn,
        expiresOn,
      },
      sharedKeyCredential
    ).toString()
  } else {
    throw new Error('Azure Blob SAS generation requires accountName and accountKey')
  }

  return {
    url: `${blobClient.url}?${sasToken}`,
    key,
    uploadHeaders: {
      'x-ms-blob-type': 'BlockBlob',
      'x-ms-blob-content-type': contentType,
      ...Object.entries(metadata).reduce(
        (acc, [k, v]) => {
          acc[`x-ms-meta-${k}`] = encodeURIComponent(v)
          return acc
        },
        {} as Record<string, string>
      ),
    },
  }
}

/**
 * Generate multiple presigned URLs at once (batch operation)
 */
export async function generateBatchPresignedUploadUrls(
  files: Array<{
    fileName: string
    contentType: string
    fileSize: number
  }>,
  context: StorageContext,
  userId?: string,
  expirationSeconds?: number
): Promise<PresignedUrlResponse[]> {
  const results: PresignedUrlResponse[] = []

  for (const file of files) {
    const result = await generatePresignedUploadUrl({
      fileName: file.fileName,
      contentType: file.contentType,
      fileSize: file.fileSize,
      context,
      userId,
      expirationSeconds,
    })
    results.push(result)
  }

  return results
}

/**
 * Generate a presigned URL for downloading/accessing an existing file
 */
export async function generatePresignedDownloadUrl(
  key: string,
  context: StorageContext,
  expirationSeconds = 3600
): Promise<string> {
  const config = getStorageConfig(context)

  if (USE_S3_STORAGE) {
    const { getPresignedUrlWithConfig } = await import('@/lib/uploads/providers/s3/client')
    return getPresignedUrlWithConfig(key, createS3Config(config), expirationSeconds)
  }

  if (USE_BLOB_STORAGE) {
    const { getPresignedUrlWithConfig } = await import('@/lib/uploads/providers/blob/client')
    return getPresignedUrlWithConfig(key, createBlobConfig(config), expirationSeconds)
  }

  const { getBaseUrl } = await import('@/lib/core/utils/urls')
  const baseUrl = getBaseUrl()
  return `${baseUrl}/api/files/serve/${encodeURIComponent(key)}`
}

/**
 * Check if cloud storage is available
 */
export function hasCloudStorage(): boolean {
  return USE_BLOB_STORAGE || USE_S3_STORAGE
}
```

--------------------------------------------------------------------------------

---[FILE: client.test.ts]---
Location: sim-main/apps/sim/lib/uploads/providers/blob/client.test.ts

```typescript
/**
 * Tests for Azure Blob Storage client
 *
 * @vitest-environment node
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mockUpload = vi.fn()
const mockDownload = vi.fn()
const mockDelete = vi.fn()
const mockGetBlockBlobClient = vi.fn()
const mockGetContainerClient = vi.fn()
const mockFromConnectionString = vi.fn()
const mockBlobServiceClient = vi.fn()
const mockStorageSharedKeyCredential = vi.fn()
const mockGenerateBlobSASQueryParameters = vi.fn()

vi.mock('@azure/storage-blob', () => ({
  BlobServiceClient: {
    fromConnectionString: mockFromConnectionString,
  },
  StorageSharedKeyCredential: mockStorageSharedKeyCredential,
  generateBlobSASQueryParameters: mockGenerateBlobSASQueryParameters,
  BlobSASPermissions: {
    parse: vi.fn().mockReturnValue('r'),
  },
}))

describe('Azure Blob Storage Client', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.resetModules()

    mockGetBlockBlobClient.mockReturnValue({
      upload: mockUpload,
      download: mockDownload,
      delete: mockDelete,
      url: 'https://test.blob.core.windows.net/container/test-file',
    })

    mockGetContainerClient.mockReturnValue({
      getBlockBlobClient: mockGetBlockBlobClient,
    })

    mockFromConnectionString.mockReturnValue({
      getContainerClient: mockGetContainerClient,
    })

    mockBlobServiceClient.mockReturnValue({
      getContainerClient: mockGetContainerClient,
    })

    mockGenerateBlobSASQueryParameters.mockReturnValue({
      toString: () => 'sv=2021-06-08&se=2023-01-01T00%3A00%3A00Z&sr=b&sp=r&sig=test',
    })

    vi.doMock('@/lib/core/config/env', () => ({
      env: {
        AZURE_ACCOUNT_NAME: 'testaccount',
        AZURE_ACCOUNT_KEY: 'testkey',
        AZURE_CONNECTION_STRING:
          'DefaultEndpointsProtocol=https;AccountName=testaccount;AccountKey=testkey;EndpointSuffix=core.windows.net',
        AZURE_STORAGE_CONTAINER_NAME: 'testcontainer',
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
      BLOB_CONFIG: {
        accountName: 'testaccount',
        accountKey: 'testkey',
        connectionString:
          'DefaultEndpointsProtocol=https;AccountName=testaccount;AccountKey=testkey;EndpointSuffix=core.windows.net',
        containerName: 'testcontainer',
      },
    }))
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('uploadToBlob', () => {
    it('should upload a file to Azure Blob Storage', async () => {
      const { uploadToBlob } = await import('@/lib/uploads/providers/blob/client')

      const testBuffer = Buffer.from('test file content')
      const fileName = 'test-file.txt'
      const contentType = 'text/plain'

      mockUpload.mockResolvedValueOnce({})

      const result = await uploadToBlob(testBuffer, fileName, contentType)

      expect(mockUpload).toHaveBeenCalledWith(testBuffer, testBuffer.length, {
        blobHTTPHeaders: {
          blobContentType: contentType,
        },
        metadata: {
          originalName: encodeURIComponent(fileName),
          uploadedAt: expect.any(String),
        },
      })

      expect(result).toEqual({
        path: expect.stringContaining('/api/files/serve/'),
        key: expect.stringContaining(fileName.replace(/\s+/g, '-')),
        name: fileName,
        size: testBuffer.length,
        type: contentType,
      })
    })

    it('should handle custom blob configuration', async () => {
      const { uploadToBlob } = await import('@/lib/uploads/providers/blob/client')

      const testBuffer = Buffer.from('test file content')
      const fileName = 'test-file.txt'
      const contentType = 'text/plain'
      const customConfig = {
        containerName: 'customcontainer',
        accountName: 'customaccount',
        accountKey: 'customkey',
      }

      mockUpload.mockResolvedValueOnce({})

      const result = await uploadToBlob(testBuffer, fileName, contentType, customConfig)

      expect(mockGetContainerClient).toHaveBeenCalledWith('customcontainer')
      expect(result.name).toBe(fileName)
      expect(result.type).toBe(contentType)
    })
  })

  describe('downloadFromBlob', () => {
    it('should download a file from Azure Blob Storage', async () => {
      const { downloadFromBlob } = await import('@/lib/uploads/providers/blob/client')

      const testKey = 'test-file-key'
      const testContent = Buffer.from('downloaded content')

      const mockReadableStream = {
        on: vi.fn((event, callback) => {
          if (event === 'data') {
            callback(testContent)
          } else if (event === 'end') {
            callback()
          }
        }),
      }

      mockDownload.mockResolvedValueOnce({
        readableStreamBody: mockReadableStream,
      })

      const result = await downloadFromBlob(testKey)

      expect(mockGetBlockBlobClient).toHaveBeenCalledWith(testKey)
      expect(mockDownload).toHaveBeenCalled()
      expect(result).toEqual(testContent)
    })
  })

  describe('deleteFromBlob', () => {
    it('should delete a file from Azure Blob Storage', async () => {
      const { deleteFromBlob } = await import('@/lib/uploads/providers/blob/client')

      const testKey = 'test-file-key'

      mockDelete.mockResolvedValueOnce({})

      await deleteFromBlob(testKey)

      expect(mockGetBlockBlobClient).toHaveBeenCalledWith(testKey)
      expect(mockDelete).toHaveBeenCalled()
    })
  })

  describe('getPresignedUrl', () => {
    it('should generate a presigned URL for Azure Blob Storage', async () => {
      const { getPresignedUrl } = await import('@/lib/uploads/providers/blob/client')

      const testKey = 'test-file-key'
      const expiresIn = 3600

      const result = await getPresignedUrl(testKey, expiresIn)

      expect(mockGetBlockBlobClient).toHaveBeenCalledWith(testKey)
      expect(mockGenerateBlobSASQueryParameters).toHaveBeenCalled()
      expect(result).toContain('https://test.blob.core.windows.net/container/test-file')
      expect(result).toContain('sv=2021-06-08')
    })
  })

  describe('sanitizeFilenameForMetadata', () => {
    const testCases = [
      { input: 'test file.txt', expected: 'test file.txt' },
      { input: 'test"file.txt', expected: 'testfile.txt' },
      { input: 'test\\file.txt', expected: 'testfile.txt' },
      { input: 'test  file.txt', expected: 'test file.txt' },
      { input: '', expected: 'file' },
    ]

    it.each(testCases)('should sanitize "$input" to "$expected"', async ({ input, expected }) => {
      const { sanitizeFilenameForMetadata } = await import('@/lib/uploads/utils/file-utils')
      expect(sanitizeFilenameForMetadata(input)).toBe(expected)
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: client.ts]---
Location: sim-main/apps/sim/lib/uploads/providers/blob/client.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import { BLOB_CONFIG } from '@/lib/uploads/config'
import type {
  AzureMultipartPart,
  AzureMultipartUploadInit,
  AzurePartUploadUrl,
  BlobConfig,
} from '@/lib/uploads/providers/blob/types'
import type { FileInfo } from '@/lib/uploads/shared/types'
import { sanitizeStorageMetadata } from '@/lib/uploads/utils/file-utils'

type BlobServiceClientInstance = Awaited<
  ReturnType<typeof import('@azure/storage-blob').BlobServiceClient.fromConnectionString>
>

const logger = createLogger('BlobClient')

let _blobServiceClient: BlobServiceClientInstance | null = null

export async function getBlobServiceClient(): Promise<BlobServiceClientInstance> {
  if (_blobServiceClient) return _blobServiceClient

  const { BlobServiceClient, StorageSharedKeyCredential } = await import('@azure/storage-blob')
  const { accountName, accountKey, connectionString } = BLOB_CONFIG

  if (connectionString) {
    _blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
  } else if (accountName && accountKey) {
    const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey)
    _blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      sharedKeyCredential
    )
  } else {
    throw new Error(
      'Azure Blob Storage credentials are missing – set AZURE_STORAGE_CONNECTION_STRING or both AZURE_STORAGE_ACCOUNT_NAME and AZURE_STORAGE_ACCOUNT_KEY in your environment.'
    )
  }

  return _blobServiceClient
}

/**
 * Upload a file to Azure Blob Storage
 * @param file Buffer containing file data
 * @param fileName Original file name
 * @param contentType MIME type of the file
 * @param configOrSize Custom Blob configuration OR file size in bytes (optional)
 * @param size File size in bytes (required if configOrSize is BlobConfig, optional otherwise)
 * @param preserveKey Preserve the fileName as the storage key without adding timestamp prefix (default: false)
 * @param metadata Optional metadata to store with the file
 * @returns Object with file information
 */
export async function uploadToBlob(
  file: Buffer,
  fileName: string,
  contentType: string,
  configOrSize?: BlobConfig | number,
  size?: number,
  preserveKey?: boolean,
  metadata?: Record<string, string>
): Promise<FileInfo> {
  let config: BlobConfig
  let fileSize: number
  let shouldPreserveKey: boolean

  if (typeof configOrSize === 'object') {
    config = configOrSize
    fileSize = size ?? file.length
    shouldPreserveKey = preserveKey ?? false
  } else {
    config = {
      containerName: BLOB_CONFIG.containerName,
      accountName: BLOB_CONFIG.accountName,
      accountKey: BLOB_CONFIG.accountKey,
      connectionString: BLOB_CONFIG.connectionString,
    }
    fileSize = configOrSize ?? file.length
    shouldPreserveKey = preserveKey ?? false
  }

  const safeFileName = fileName.replace(/\s+/g, '-') // Replace spaces with hyphens
  const uniqueKey = shouldPreserveKey ? fileName : `${Date.now()}-${safeFileName}`

  const blobServiceClient = await getBlobServiceClient()
  const containerClient = blobServiceClient.getContainerClient(config.containerName)
  const blockBlobClient = containerClient.getBlockBlobClient(uniqueKey)

  const blobMetadata: Record<string, string> = {
    originalName: encodeURIComponent(fileName), // Encode filename to prevent invalid characters in HTTP headers
    uploadedAt: new Date().toISOString(),
  }

  if (metadata) {
    Object.assign(blobMetadata, sanitizeStorageMetadata(metadata, 8000))
  }

  await blockBlobClient.upload(file, fileSize, {
    blobHTTPHeaders: {
      blobContentType: contentType,
    },
    metadata: blobMetadata,
  })

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
 * @param key Blob name
 * @param expiresIn Time in seconds until URL expires
 * @returns Presigned URL
 */
export async function getPresignedUrl(key: string, expiresIn = 3600) {
  const { BlobSASPermissions, generateBlobSASQueryParameters, StorageSharedKeyCredential } =
    await import('@azure/storage-blob')
  const blobServiceClient = await getBlobServiceClient()
  const containerClient = blobServiceClient.getContainerClient(BLOB_CONFIG.containerName)
  const blockBlobClient = containerClient.getBlockBlobClient(key)

  const sasOptions = {
    containerName: BLOB_CONFIG.containerName,
    blobName: key,
    permissions: BlobSASPermissions.parse('r'), // Read permission
    startsOn: new Date(),
    expiresOn: new Date(Date.now() + expiresIn * 1000),
  }

  const sasToken = generateBlobSASQueryParameters(
    sasOptions,
    new StorageSharedKeyCredential(
      BLOB_CONFIG.accountName,
      BLOB_CONFIG.accountKey ??
        (() => {
          throw new Error('AZURE_ACCOUNT_KEY is required when using account name authentication')
        })()
    )
  ).toString()

  return `${blockBlobClient.url}?${sasToken}`
}

/**
 * Generate a presigned URL for direct file access with custom container
 * @param key Blob name
 * @param customConfig Custom Blob configuration
 * @param expiresIn Time in seconds until URL expires
 * @returns Presigned URL
 */
export async function getPresignedUrlWithConfig(
  key: string,
  customConfig: BlobConfig,
  expiresIn = 3600
) {
  const {
    BlobServiceClient,
    BlobSASPermissions,
    generateBlobSASQueryParameters,
    StorageSharedKeyCredential,
  } = await import('@azure/storage-blob')
  let tempBlobServiceClient: BlobServiceClientInstance

  if (customConfig.connectionString) {
    tempBlobServiceClient = BlobServiceClient.fromConnectionString(customConfig.connectionString)
  } else if (customConfig.accountName && customConfig.accountKey) {
    const sharedKeyCredential = new StorageSharedKeyCredential(
      customConfig.accountName,
      customConfig.accountKey
    )
    tempBlobServiceClient = new BlobServiceClient(
      `https://${customConfig.accountName}.blob.core.windows.net`,
      sharedKeyCredential
    )
  } else {
    throw new Error(
      'Custom blob config must include either connectionString or accountName + accountKey'
    )
  }

  const containerClient = tempBlobServiceClient.getContainerClient(customConfig.containerName)
  const blockBlobClient = containerClient.getBlockBlobClient(key)

  const sasOptions = {
    containerName: customConfig.containerName,
    blobName: key,
    permissions: BlobSASPermissions.parse('r'), // Read permission
    startsOn: new Date(),
    expiresOn: new Date(Date.now() + expiresIn * 1000),
  }

  const sasToken = generateBlobSASQueryParameters(
    sasOptions,
    new StorageSharedKeyCredential(
      customConfig.accountName,
      customConfig.accountKey ??
        (() => {
          throw new Error('Account key is required when using account name authentication')
        })()
    )
  ).toString()

  return `${blockBlobClient.url}?${sasToken}`
}

/**
 * Download a file from Azure Blob Storage
 * @param key Blob name
 * @returns File buffer
 */
export async function downloadFromBlob(key: string): Promise<Buffer>

/**
 * Download a file from Azure Blob Storage with custom configuration
 * @param key Blob name
 * @param customConfig Custom Blob configuration
 * @returns File buffer
 */
export async function downloadFromBlob(key: string, customConfig: BlobConfig): Promise<Buffer>

export async function downloadFromBlob(key: string, customConfig?: BlobConfig): Promise<Buffer> {
  const { BlobServiceClient, StorageSharedKeyCredential } = await import('@azure/storage-blob')
  let blobServiceClient: BlobServiceClientInstance
  let containerName: string

  if (customConfig) {
    if (customConfig.connectionString) {
      blobServiceClient = BlobServiceClient.fromConnectionString(customConfig.connectionString)
    } else if (customConfig.accountName && customConfig.accountKey) {
      const credential = new StorageSharedKeyCredential(
        customConfig.accountName,
        customConfig.accountKey
      )
      blobServiceClient = new BlobServiceClient(
        `https://${customConfig.accountName}.blob.core.windows.net`,
        credential
      )
    } else {
      throw new Error('Invalid custom blob configuration')
    }
    containerName = customConfig.containerName
  } else {
    blobServiceClient = await getBlobServiceClient()
    containerName = BLOB_CONFIG.containerName
  }

  const containerClient = blobServiceClient.getContainerClient(containerName)
  const blockBlobClient = containerClient.getBlockBlobClient(key)

  const downloadBlockBlobResponse = await blockBlobClient.download()
  if (!downloadBlockBlobResponse.readableStreamBody) {
    throw new Error('Failed to get readable stream from blob download')
  }
  const downloaded = await streamToBuffer(downloadBlockBlobResponse.readableStreamBody)

  return downloaded
}

/**
 * Delete a file from Azure Blob Storage
 * @param key Blob name
 */
export async function deleteFromBlob(key: string): Promise<void>

/**
 * Delete a file from Azure Blob Storage with custom configuration
 * @param key Blob name
 * @param customConfig Custom Blob configuration
 */
export async function deleteFromBlob(key: string, customConfig: BlobConfig): Promise<void>

export async function deleteFromBlob(key: string, customConfig?: BlobConfig): Promise<void> {
  const { BlobServiceClient, StorageSharedKeyCredential } = await import('@azure/storage-blob')
  let blobServiceClient: BlobServiceClientInstance
  let containerName: string

  if (customConfig) {
    if (customConfig.connectionString) {
      blobServiceClient = BlobServiceClient.fromConnectionString(customConfig.connectionString)
    } else if (customConfig.accountName && customConfig.accountKey) {
      const credential = new StorageSharedKeyCredential(
        customConfig.accountName,
        customConfig.accountKey
      )
      blobServiceClient = new BlobServiceClient(
        `https://${customConfig.accountName}.blob.core.windows.net`,
        credential
      )
    } else {
      throw new Error('Invalid custom blob configuration')
    }
    containerName = customConfig.containerName
  } else {
    blobServiceClient = await getBlobServiceClient()
    containerName = BLOB_CONFIG.containerName
  }

  const containerClient = blobServiceClient.getContainerClient(containerName)
  const blockBlobClient = containerClient.getBlockBlobClient(key)

  await blockBlobClient.delete()
}

/**
 * Helper function to convert a readable stream to a Buffer
 */
async function streamToBuffer(readableStream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    readableStream.on('data', (data) => {
      chunks.push(data instanceof Buffer ? data : Buffer.from(data))
    })
    readableStream.on('end', () => {
      resolve(Buffer.concat(chunks))
    })
    readableStream.on('error', reject)
  })
}

/**
 * Initiate a multipart upload for Azure Blob Storage
 */
export async function initiateMultipartUpload(
  options: AzureMultipartUploadInit
): Promise<{ uploadId: string; key: string }> {
  const { BlobServiceClient, StorageSharedKeyCredential } = await import('@azure/storage-blob')
  const { fileName, contentType, customConfig } = options

  let blobServiceClient: BlobServiceClientInstance
  let containerName: string

  if (customConfig) {
    if (customConfig.connectionString) {
      blobServiceClient = BlobServiceClient.fromConnectionString(customConfig.connectionString)
    } else if (customConfig.accountName && customConfig.accountKey) {
      const credential = new StorageSharedKeyCredential(
        customConfig.accountName,
        customConfig.accountKey
      )
      blobServiceClient = new BlobServiceClient(
        `https://${customConfig.accountName}.blob.core.windows.net`,
        credential
      )
    } else {
      throw new Error('Invalid custom blob configuration')
    }
    containerName = customConfig.containerName
  } else {
    blobServiceClient = await getBlobServiceClient()
    containerName = BLOB_CONFIG.containerName
  }

  const safeFileName = fileName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '_')
  const { v4: uuidv4 } = await import('uuid')
  const uniqueKey = `kb/${uuidv4()}-${safeFileName}`

  const uploadId = uuidv4()

  const containerClient = blobServiceClient.getContainerClient(containerName)
  const blockBlobClient = containerClient.getBlockBlobClient(uniqueKey)

  await blockBlobClient.setMetadata({
    uploadId,
    fileName: encodeURIComponent(fileName),
    contentType,
    uploadStarted: new Date().toISOString(),
    multipartUpload: 'true',
  })

  return {
    uploadId,
    key: uniqueKey,
  }
}

/**
 * Generate presigned URLs for uploading parts
 */
export async function getMultipartPartUrls(
  key: string,
  partNumbers: number[],
  customConfig?: BlobConfig
): Promise<AzurePartUploadUrl[]> {
  const {
    BlobServiceClient,
    BlobSASPermissions,
    generateBlobSASQueryParameters,
    StorageSharedKeyCredential,
  } = await import('@azure/storage-blob')
  let blobServiceClient: BlobServiceClientInstance
  let containerName: string
  let accountName: string
  let accountKey: string

  if (customConfig) {
    if (customConfig.connectionString) {
      blobServiceClient = BlobServiceClient.fromConnectionString(customConfig.connectionString)
      const match = customConfig.connectionString.match(/AccountName=([^;]+)/)
      if (!match) throw new Error('Cannot extract account name from connection string')
      accountName = match[1]

      const keyMatch = customConfig.connectionString.match(/AccountKey=([^;]+)/)
      if (!keyMatch) throw new Error('Cannot extract account key from connection string')
      accountKey = keyMatch[1]
    } else if (customConfig.accountName && customConfig.accountKey) {
      const credential = new StorageSharedKeyCredential(
        customConfig.accountName,
        customConfig.accountKey
      )
      blobServiceClient = new BlobServiceClient(
        `https://${customConfig.accountName}.blob.core.windows.net`,
        credential
      )
      accountName = customConfig.accountName
      accountKey = customConfig.accountKey
    } else {
      throw new Error('Invalid custom blob configuration')
    }
    containerName = customConfig.containerName
  } else {
    blobServiceClient = await getBlobServiceClient()
    containerName = BLOB_CONFIG.containerName
    accountName = BLOB_CONFIG.accountName
    accountKey =
      BLOB_CONFIG.accountKey ||
      (() => {
        throw new Error('AZURE_ACCOUNT_KEY is required')
      })()
  }

  const containerClient = blobServiceClient.getContainerClient(containerName)
  const blockBlobClient = containerClient.getBlockBlobClient(key)

  return partNumbers.map((partNumber) => {
    const blockId = Buffer.from(`block-${partNumber.toString().padStart(6, '0')}`).toString(
      'base64'
    )

    const sasOptions = {
      containerName,
      blobName: key,
      permissions: BlobSASPermissions.parse('w'), // Write permission
      startsOn: new Date(),
      expiresOn: new Date(Date.now() + 3600 * 1000), // 1 hour
    }

    const sasToken = generateBlobSASQueryParameters(
      sasOptions,
      new StorageSharedKeyCredential(accountName, accountKey)
    ).toString()

    return {
      partNumber,
      blockId,
      url: `${blockBlobClient.url}?comp=block&blockid=${encodeURIComponent(blockId)}&${sasToken}`,
    }
  })
}

/**
 * Complete multipart upload by committing all blocks
 */
export async function completeMultipartUpload(
  key: string,
  parts: AzureMultipartPart[],
  customConfig?: BlobConfig
): Promise<{ location: string; path: string; key: string }> {
  const { BlobServiceClient, StorageSharedKeyCredential } = await import('@azure/storage-blob')
  let blobServiceClient: BlobServiceClientInstance
  let containerName: string

  if (customConfig) {
    if (customConfig.connectionString) {
      blobServiceClient = BlobServiceClient.fromConnectionString(customConfig.connectionString)
    } else if (customConfig.accountName && customConfig.accountKey) {
      const credential = new StorageSharedKeyCredential(
        customConfig.accountName,
        customConfig.accountKey
      )
      blobServiceClient = new BlobServiceClient(
        `https://${customConfig.accountName}.blob.core.windows.net`,
        credential
      )
    } else {
      throw new Error('Invalid custom blob configuration')
    }
    containerName = customConfig.containerName
  } else {
    blobServiceClient = await getBlobServiceClient()
    containerName = BLOB_CONFIG.containerName
  }

  const containerClient = blobServiceClient.getContainerClient(containerName)
  const blockBlobClient = containerClient.getBlockBlobClient(key)

  // Sort parts by part number and extract block IDs
  const sortedBlockIds = parts
    .sort((a, b) => a.partNumber - b.partNumber)
    .map((part) => part.blockId)

  // Commit the block list to create the final blob
  await blockBlobClient.commitBlockList(sortedBlockIds, {
    metadata: {
      multipartUpload: 'completed',
      uploadCompletedAt: new Date().toISOString(),
    },
  })

  const location = blockBlobClient.url
  const path = `/api/files/serve/${encodeURIComponent(key)}`

  return {
    location,
    path,
    key,
  }
}

/**
 * Abort multipart upload by deleting the blob if it exists
 */
export async function abortMultipartUpload(key: string, customConfig?: BlobConfig): Promise<void> {
  const { BlobServiceClient, StorageSharedKeyCredential } = await import('@azure/storage-blob')
  let blobServiceClient: BlobServiceClientInstance
  let containerName: string

  if (customConfig) {
    if (customConfig.connectionString) {
      blobServiceClient = BlobServiceClient.fromConnectionString(customConfig.connectionString)
    } else if (customConfig.accountName && customConfig.accountKey) {
      const credential = new StorageSharedKeyCredential(
        customConfig.accountName,
        customConfig.accountKey
      )
      blobServiceClient = new BlobServiceClient(
        `https://${customConfig.accountName}.blob.core.windows.net`,
        credential
      )
    } else {
      throw new Error('Invalid custom blob configuration')
    }
    containerName = customConfig.containerName
  } else {
    blobServiceClient = await getBlobServiceClient()
    containerName = BLOB_CONFIG.containerName
  }

  const containerClient = blobServiceClient.getContainerClient(containerName)
  const blockBlobClient = containerClient.getBlockBlobClient(key)

  try {
    // Delete the blob if it exists (this also cleans up any uncommitted blocks)
    await blockBlobClient.deleteIfExists()
  } catch (error) {
    // Ignore errors since we're just cleaning up
    logger.warn('Error cleaning up multipart upload:', error)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/lib/uploads/providers/blob/index.ts

```typescript
export {
  deleteFromBlob,
  downloadFromBlob,
  getBlobServiceClient,
  getPresignedUrl,
  getPresignedUrlWithConfig,
  uploadToBlob,
} from '@/lib/uploads/providers/blob/client'
export type {
  AzureMultipartPart,
  AzureMultipartUploadInit,
  AzurePartUploadUrl,
  BlobConfig,
} from '@/lib/uploads/providers/blob/types'
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/lib/uploads/providers/blob/types.ts

```typescript
export interface BlobConfig {
  containerName: string
  accountName: string
  accountKey?: string
  connectionString?: string
}

export interface AzureMultipartUploadInit {
  fileName: string
  contentType: string
  fileSize: number
  customConfig?: BlobConfig
}

export interface AzurePartUploadUrl {
  partNumber: number
  blockId: string
  url: string
}

export interface AzureMultipartPart {
  blockId: string
  partNumber: number
}
```

--------------------------------------------------------------------------------

````
