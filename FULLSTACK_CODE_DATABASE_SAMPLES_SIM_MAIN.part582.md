---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 582
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 582 of 933)

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

---[FILE: copilot-file-manager.ts]---
Location: sim-main/apps/sim/lib/uploads/contexts/copilot/copilot-file-manager.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import {
  deleteFile,
  downloadFile,
  generatePresignedDownloadUrl,
  generatePresignedUploadUrl,
} from '@/lib/uploads/core/storage-service'
import type { PresignedUrlResponse } from '@/lib/uploads/shared/types'

const logger = createLogger('CopilotFileManager')

const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
]

/**
 * Check if a file type is a supported image format for copilot
 */
export function isSupportedFileType(mimeType: string): boolean {
  return SUPPORTED_IMAGE_TYPES.includes(mimeType.toLowerCase())
}

/**
 * Check if a content type is an image
 */
export function isImageFileType(contentType: string): boolean {
  return contentType.toLowerCase().startsWith('image/')
}

export interface CopilotFileAttachment {
  key: string
  filename: string
  media_type: string
}

export interface GenerateCopilotUploadUrlOptions {
  fileName: string
  contentType: string
  fileSize: number
  userId: string
  expirationSeconds?: number
}

/**
 * Generate a presigned URL for copilot file upload
 *
 * Only image files are allowed for copilot uploads.
 * Requires authenticated user session.
 *
 * @param options Upload URL generation options
 * @returns Presigned URL response with upload URL and file key
 * @throws Error if file type is not an image or user is not authenticated
 */
export async function generateCopilotUploadUrl(
  options: GenerateCopilotUploadUrlOptions
): Promise<PresignedUrlResponse> {
  const { fileName, contentType, fileSize, userId, expirationSeconds = 3600 } = options

  if (!userId?.trim()) {
    throw new Error('Authenticated user session is required for copilot uploads')
  }

  if (!isImageFileType(contentType)) {
    throw new Error('Only image files (JPEG, PNG, GIF, WebP, SVG) are allowed for copilot uploads')
  }

  const presignedUrlResponse = await generatePresignedUploadUrl({
    fileName,
    contentType,
    fileSize,
    context: 'copilot',
    userId,
    expirationSeconds,
  })

  logger.info(`Generated copilot upload URL for: ${fileName}`, {
    key: presignedUrlResponse.key,
    userId,
  })

  return presignedUrlResponse
}

/**
 * Download a copilot file from storage
 *
 * Uses the unified storage service with explicit copilot context.
 * Handles S3, Azure Blob, and local storage automatically.
 *
 * @param key File storage key
 * @returns File buffer
 * @throws Error if file not found or download fails
 */
export async function downloadCopilotFile(key: string): Promise<Buffer> {
  try {
    const fileBuffer = await downloadFile({
      key,
      context: 'copilot',
    })

    logger.info(`Successfully downloaded copilot file: ${key}`, {
      size: fileBuffer.length,
    })

    return fileBuffer
  } catch (error) {
    logger.error(`Failed to download copilot file: ${key}`, error)
    throw error
  }
}

/**
 * Process copilot file attachments for chat messages
 *
 * Downloads files from storage and validates they are supported types.
 * Skips unsupported files with a warning.
 *
 * @param attachments Array of file attachments
 * @param requestId Request identifier for logging
 * @returns Array of buffers for successfully downloaded files
 */
export async function processCopilotAttachments(
  attachments: CopilotFileAttachment[],
  requestId: string
): Promise<Array<{ buffer: Buffer; attachment: CopilotFileAttachment }>> {
  const results: Array<{ buffer: Buffer; attachment: CopilotFileAttachment }> = []

  for (const attachment of attachments) {
    try {
      if (!isSupportedFileType(attachment.media_type)) {
        logger.warn(`[${requestId}] Unsupported file type: ${attachment.media_type}`)
        continue
      }

      const buffer = await downloadCopilotFile(attachment.key)

      results.push({ buffer, attachment })
    } catch (error) {
      logger.error(`[${requestId}] Failed to process file ${attachment.filename}:`, error)
    }
  }

  logger.info(`Successfully processed ${results.length}/${attachments.length} attachments`, {
    requestId,
  })

  return results
}

/**
 * Generate a presigned download URL for a copilot file
 *
 * @param key File storage key
 * @param expirationSeconds Time in seconds until URL expires (default: 1 hour)
 * @returns Presigned download URL
 */
export async function generateCopilotDownloadUrl(
  key: string,
  expirationSeconds = 3600
): Promise<string> {
  const downloadUrl = await generatePresignedDownloadUrl(key, 'copilot', expirationSeconds)

  logger.info(`Generated copilot download URL for: ${key}`)

  return downloadUrl
}

/**
 * Delete a copilot file from storage
 *
 * @param key File storage key
 */
export async function deleteCopilotFile(key: string): Promise<void> {
  await deleteFile({
    key,
    context: 'copilot',
  })

  logger.info(`Successfully deleted copilot file: ${key}`)
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/lib/uploads/contexts/copilot/index.ts

```typescript
export {
  type CopilotFileAttachment,
  deleteCopilotFile,
  downloadCopilotFile,
  type GenerateCopilotUploadUrlOptions,
  generateCopilotDownloadUrl,
  generateCopilotUploadUrl,
  isImageFileType,
  isSupportedFileType,
  processCopilotAttachments,
} from './copilot-file-manager'
```

--------------------------------------------------------------------------------

---[FILE: execution-file-manager.ts]---
Location: sim-main/apps/sim/lib/uploads/contexts/execution/execution-file-manager.ts

```typescript
import { isUserFile } from '@/lib/core/utils/display-filters'
import { createLogger } from '@/lib/logs/console/logger'
import type { ExecutionContext } from '@/lib/uploads/contexts/execution/utils'
import { generateExecutionFileKey, generateFileId } from '@/lib/uploads/contexts/execution/utils'
import type { UserFile } from '@/executor/types'

const logger = createLogger('ExecutionFileStorage')

function isSerializedBuffer(value: unknown): value is { type: string; data: number[] } {
  return (
    !!value &&
    typeof value === 'object' &&
    (value as { type?: unknown }).type === 'Buffer' &&
    Array.isArray((value as { data?: unknown }).data)
  )
}

function toBuffer(data: unknown, fileName: string): Buffer {
  if (data === undefined || data === null) {
    throw new Error(`File '${fileName}' has no data`)
  }

  if (Buffer.isBuffer(data)) {
    return data
  }

  if (isSerializedBuffer(data)) {
    return Buffer.from(data.data)
  }

  if (data instanceof ArrayBuffer) {
    return Buffer.from(data)
  }

  if (ArrayBuffer.isView(data)) {
    return Buffer.from(data.buffer, data.byteOffset, data.byteLength)
  }

  if (Array.isArray(data)) {
    return Buffer.from(data)
  }

  if (typeof data === 'string') {
    const trimmed = data.trim()
    if (trimmed.startsWith('data:')) {
      const [, base64Data] = trimmed.split(',')
      return Buffer.from(base64Data ?? '', 'base64')
    }
    return Buffer.from(trimmed, 'base64')
  }

  throw new Error(`File '${fileName}' has unsupported data format: ${typeof data}`)
}

/**
 * Upload a file to execution-scoped storage
 */
export async function uploadExecutionFile(
  context: ExecutionContext,
  fileBuffer: Buffer,
  fileName: string,
  contentType: string,
  userId?: string
): Promise<UserFile> {
  logger.info(`Uploading execution file: ${fileName} for execution ${context.executionId}`)
  logger.debug(`File upload context:`, {
    workspaceId: context.workspaceId,
    workflowId: context.workflowId,
    executionId: context.executionId,
    userId: userId || 'not provided',
    fileName,
    bufferSize: fileBuffer.length,
  })

  const storageKey = generateExecutionFileKey(context, fileName)
  const fileId = generateFileId()

  logger.info(`Generated storage key: "${storageKey}" for file: ${fileName}`)

  const metadata: Record<string, string> = {
    originalName: fileName,
    uploadedAt: new Date().toISOString(),
    purpose: 'execution',
    workspaceId: context.workspaceId,
  }

  if (userId) {
    metadata.userId = userId
  }

  try {
    const { uploadFile, generatePresignedDownloadUrl } = await import(
      '@/lib/uploads/core/storage-service'
    )
    const fileInfo = await uploadFile({
      file: fileBuffer,
      fileName: storageKey,
      contentType,
      context: 'execution',
      preserveKey: true, // Don't add timestamp prefix
      customKey: storageKey, // Use exact execution-scoped key
      metadata, // Pass metadata for cloud storage and database tracking
    })

    // Generate presigned URL for file access (10 minutes expiration)
    const fullUrl = await generatePresignedDownloadUrl(fileInfo.key, 'execution', 600)

    const userFile: UserFile = {
      id: fileId,
      name: fileName,
      size: fileBuffer.length,
      type: contentType,
      url: fullUrl, // Presigned URL for external access and downstream workflow usage
      key: fileInfo.key,
      context: 'execution', // Preserve context in file object
    }

    logger.info(`Successfully uploaded execution file: ${fileName} (${fileBuffer.length} bytes)`, {
      url: fullUrl,
      key: fileInfo.key,
    })
    return userFile
  } catch (error) {
    logger.error(`Failed to upload execution file ${fileName}:`, error)
    throw new Error(
      `Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Download a file from execution-scoped storage
 */
export async function downloadExecutionFile(userFile: UserFile): Promise<Buffer> {
  logger.info(`Downloading execution file: ${userFile.name}`)

  try {
    const { downloadFile } = await import('@/lib/uploads/core/storage-service')
    const fileBuffer = await downloadFile({
      key: userFile.key,
      context: 'execution',
    })

    logger.info(
      `Successfully downloaded execution file: ${userFile.name} (${fileBuffer.length} bytes)`
    )
    return fileBuffer
  } catch (error) {
    logger.error(`Failed to download execution file ${userFile.name}:`, error)
    throw new Error(
      `Failed to download file: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Convert raw file data (from tools/triggers) to UserFile
 * Handles all common formats: Buffer, serialized Buffer, base64, data URLs
 */
export async function uploadFileFromRawData(
  rawData: {
    name?: string
    filename?: string
    data?: unknown
    mimeType?: string
    contentType?: string
    size?: number
  },
  context: ExecutionContext,
  userId?: string
): Promise<UserFile> {
  if (isUserFile(rawData)) {
    return rawData
  }

  const fileName = rawData.name || rawData.filename || 'file.bin'
  const buffer = toBuffer(rawData.data, fileName)
  const contentType = rawData.mimeType || rawData.contentType || 'application/octet-stream'

  return uploadExecutionFile(context, buffer, fileName, contentType, userId)
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/lib/uploads/contexts/execution/index.ts

```typescript
export * from './execution-file-manager'
export * from './utils'
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/lib/uploads/contexts/execution/utils.ts

```typescript
import type { UserFile } from '@/executor/types'

/**
 * Execution context for file operations
 */
export interface ExecutionContext {
  workspaceId: string
  workflowId: string
  executionId: string
}

/**
 * Generate execution-scoped storage key with explicit prefix
 * Format: execution/workspace_id/workflow_id/execution_id/filename
 */
export function generateExecutionFileKey(context: ExecutionContext, fileName: string): string {
  const { workspaceId, workflowId, executionId } = context
  const safeFileName = fileName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '_')
  return `execution/${workspaceId}/${workflowId}/${executionId}/${safeFileName}`
}

/**
 * Generate unique file ID for execution files
 */
export function generateFileId(): string {
  return `file_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

/**
 * UUID pattern for validating execution context IDs
 */
const UUID_PATTERN = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i

/**
 * Check if a string matches UUID pattern
 */
export function isUuid(str: string): boolean {
  return UUID_PATTERN.test(str)
}

/**
 * Check if a key matches execution file pattern
 * Execution files have keys in format: execution/workspaceId/workflowId/executionId/filename
 */
function matchesExecutionFilePattern(key: string): boolean {
  if (!key || key.startsWith('/api/') || key.startsWith('http')) {
    return false
  }

  const parts = key.split('/')

  if (parts[0] === 'execution' && parts.length >= 5) {
    const [, workspaceId, workflowId, executionId] = parts
    return isUuid(workspaceId) && isUuid(workflowId) && isUuid(executionId)
  }

  return false
}

/**
 * Check if a file is from execution storage based on its key pattern
 * Execution files have keys in format: execution/workspaceId/workflowId/executionId/filename
 */
export function isExecutionFile(file: UserFile): boolean {
  if (!file.key) {
    return false
  }

  return matchesExecutionFilePattern(file.key)
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/lib/uploads/contexts/workspace/index.ts

```typescript
export * from './workspace-file-manager'
```

--------------------------------------------------------------------------------

---[FILE: workspace-file-manager.ts]---
Location: sim-main/apps/sim/lib/uploads/contexts/workspace/workspace-file-manager.ts

```typescript
/**
 * Workspace file storage system
 * Files uploaded at workspace level persist indefinitely and are accessible across all workflows
 */

import { db } from '@sim/db'
import { workspaceFiles } from '@sim/db/schema'
import { and, eq } from 'drizzle-orm'
import {
  checkStorageQuota,
  decrementStorageUsage,
  incrementStorageUsage,
} from '@/lib/billing/storage'
import { createLogger } from '@/lib/logs/console/logger'
import {
  deleteFile,
  downloadFile,
  hasCloudStorage,
  uploadFile,
} from '@/lib/uploads/core/storage-service'
import { getFileMetadataByKey, insertFileMetadata } from '@/lib/uploads/server/metadata'
import type { UserFile } from '@/executor/types'

const logger = createLogger('WorkspaceFileStorage')

export interface WorkspaceFileRecord {
  id: string
  workspaceId: string
  name: string
  key: string
  path: string // Full serve path including storage type
  url?: string // Presigned URL for external access (optional, regenerated as needed)
  size: number
  type: string
  uploadedBy: string
  uploadedAt: Date
}

/**
 * UUID pattern for validating workspace IDs
 */
const UUID_PATTERN = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i

/**
 * Workspace file key pattern: workspace/{workspaceId}/{timestamp}-{random}-{filename}
 */
const WORKSPACE_KEY_PATTERN = /^workspace\/([a-f0-9-]{36})\/(\d+)-([a-z0-9]+)-(.+)$/

/**
 * Check if a key matches workspace file pattern
 * Format: workspace/{workspaceId}/{timestamp}-{random}-{filename}
 */
export function matchesWorkspaceFilePattern(key: string): boolean {
  if (!key || key.startsWith('/api/') || key.startsWith('http')) {
    return false
  }
  return WORKSPACE_KEY_PATTERN.test(key)
}

/**
 * Parse workspace file key to extract workspace ID
 * Format: workspace/{workspaceId}/{timestamp}-{random}-{filename}
 * @returns workspaceId if key matches pattern, null otherwise
 */
export function parseWorkspaceFileKey(key: string): string | null {
  if (!matchesWorkspaceFilePattern(key)) {
    return null
  }

  const match = key.match(WORKSPACE_KEY_PATTERN)
  if (!match) {
    return null
  }

  const workspaceId = match[1]
  return UUID_PATTERN.test(workspaceId) ? workspaceId : null
}

/**
 * Generate workspace-scoped storage key with explicit prefix
 * Format: workspace/{workspaceId}/{timestamp}-{random}-{filename}
 */
export function generateWorkspaceFileKey(workspaceId: string, fileName: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 9)
  const safeFileName = fileName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '_')
  return `workspace/${workspaceId}/${timestamp}-${random}-${safeFileName}`
}

/**
 * Upload a file to workspace-scoped storage
 */
export async function uploadWorkspaceFile(
  workspaceId: string,
  userId: string,
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
): Promise<UserFile> {
  logger.info(`Uploading workspace file: ${fileName} for workspace ${workspaceId}`)

  const exists = await fileExistsInWorkspace(workspaceId, fileName)
  if (exists) {
    throw new Error(`A file named "${fileName}" already exists in this workspace`)
  }

  const quotaCheck = await checkStorageQuota(userId, fileBuffer.length)

  if (!quotaCheck.allowed) {
    throw new Error(quotaCheck.error || 'Storage limit exceeded')
  }

  const storageKey = generateWorkspaceFileKey(workspaceId, fileName)
  let fileId = `wf_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

  try {
    logger.info(`Generated storage key: ${storageKey}`)

    const metadata: Record<string, string> = {
      originalName: fileName,
      uploadedAt: new Date().toISOString(),
      purpose: 'workspace',
      userId: userId,
      workspaceId: workspaceId,
    }

    const uploadResult = await uploadFile({
      file: fileBuffer,
      fileName: storageKey, // Use the full storageKey as fileName
      contentType,
      context: 'workspace',
      preserveKey: true, // Don't add timestamp prefix
      customKey: storageKey, // Explicitly set the key
      metadata, // Pass metadata for cloud storage consistency
    })

    logger.info(`Upload returned key: ${uploadResult.key}`)

    const usingCloudStorage = hasCloudStorage()

    if (!usingCloudStorage) {
      const metadataRecord = await insertFileMetadata({
        id: fileId,
        key: uploadResult.key,
        userId,
        workspaceId,
        context: 'workspace',
        originalName: fileName,
        contentType,
        size: fileBuffer.length,
      })
      fileId = metadataRecord.id
      logger.info(`Stored metadata in database for local file: ${uploadResult.key}`)
    } else {
      const existing = await getFileMetadataByKey(uploadResult.key, 'workspace')

      if (!existing) {
        logger.warn(`Metadata not found for cloud file ${uploadResult.key}, inserting...`)
        const metadataRecord = await insertFileMetadata({
          id: fileId,
          key: uploadResult.key,
          userId,
          workspaceId,
          context: 'workspace',
          originalName: fileName,
          contentType,
          size: fileBuffer.length,
        })
        fileId = metadataRecord.id
      } else {
        fileId = existing.id
        logger.info(`Using existing metadata record for cloud file: ${uploadResult.key}`)
      }
    }

    logger.info(`Successfully uploaded workspace file: ${fileName} with key: ${uploadResult.key}`)

    try {
      await incrementStorageUsage(userId, fileBuffer.length)
    } catch (storageError) {
      logger.error(`Failed to update storage tracking:`, storageError)
    }

    const { getServePathPrefix } = await import('@/lib/uploads')
    const pathPrefix = getServePathPrefix()
    const serveUrl = `${pathPrefix}${encodeURIComponent(uploadResult.key)}?context=workspace`

    return {
      id: fileId,
      name: fileName,
      size: fileBuffer.length,
      type: contentType,
      url: serveUrl, // Use authenticated serve URL (enforces context)
      key: uploadResult.key,
      context: 'workspace',
    }
  } catch (error) {
    logger.error(`Failed to upload workspace file ${fileName}:`, error)
    throw new Error(
      `Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Check if a file with the same name already exists in workspace
 */
export async function fileExistsInWorkspace(
  workspaceId: string,
  fileName: string
): Promise<boolean> {
  try {
    const existing = await db
      .select()
      .from(workspaceFiles)
      .where(
        and(
          eq(workspaceFiles.workspaceId, workspaceId),
          eq(workspaceFiles.originalName, fileName),
          eq(workspaceFiles.context, 'workspace')
        )
      )
      .limit(1)

    return existing.length > 0
  } catch (error) {
    logger.error(`Failed to check file existence for ${fileName}:`, error)
    return false
  }
}

/**
 * List all files for a workspace
 */
export async function listWorkspaceFiles(workspaceId: string): Promise<WorkspaceFileRecord[]> {
  try {
    const files = await db
      .select()
      .from(workspaceFiles)
      .where(
        and(eq(workspaceFiles.workspaceId, workspaceId), eq(workspaceFiles.context, 'workspace'))
      )
      .orderBy(workspaceFiles.uploadedAt)

    const { getServePathPrefix } = await import('@/lib/uploads')
    const pathPrefix = getServePathPrefix()

    return files.map((file) => ({
      id: file.id,
      workspaceId: file.workspaceId || workspaceId, // Use query workspaceId as fallback (should never be null for workspace files)
      name: file.originalName,
      key: file.key,
      path: `${pathPrefix}${encodeURIComponent(file.key)}?context=workspace`,
      size: file.size,
      type: file.contentType,
      uploadedBy: file.userId,
      uploadedAt: file.uploadedAt,
    }))
  } catch (error) {
    logger.error(`Failed to list workspace files for ${workspaceId}:`, error)
    return []
  }
}

/**
 * Get a specific workspace file
 */
export async function getWorkspaceFile(
  workspaceId: string,
  fileId: string
): Promise<WorkspaceFileRecord | null> {
  try {
    const files = await db
      .select()
      .from(workspaceFiles)
      .where(
        and(
          eq(workspaceFiles.id, fileId),
          eq(workspaceFiles.workspaceId, workspaceId),
          eq(workspaceFiles.context, 'workspace')
        )
      )
      .limit(1)

    if (files.length === 0) return null

    const { getServePathPrefix } = await import('@/lib/uploads')
    const pathPrefix = getServePathPrefix()

    const file = files[0]
    return {
      id: file.id,
      workspaceId: file.workspaceId || workspaceId, // Use query workspaceId as fallback (should never be null for workspace files)
      name: file.originalName,
      key: file.key,
      path: `${pathPrefix}${encodeURIComponent(file.key)}?context=workspace`,
      size: file.size,
      type: file.contentType,
      uploadedBy: file.userId,
      uploadedAt: file.uploadedAt,
    }
  } catch (error) {
    logger.error(`Failed to get workspace file ${fileId}:`, error)
    return null
  }
}

/**
 * Download workspace file content
 */
export async function downloadWorkspaceFile(fileRecord: WorkspaceFileRecord): Promise<Buffer> {
  logger.info(`Downloading workspace file: ${fileRecord.name}`)

  try {
    const buffer = await downloadFile({
      key: fileRecord.key,
      context: 'workspace',
    })
    logger.info(
      `Successfully downloaded workspace file: ${fileRecord.name} (${buffer.length} bytes)`
    )
    return buffer
  } catch (error) {
    logger.error(`Failed to download workspace file ${fileRecord.name}:`, error)
    throw new Error(
      `Failed to download file: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Delete a workspace file (both from storage and database)
 */
export async function deleteWorkspaceFile(workspaceId: string, fileId: string): Promise<void> {
  logger.info(`Deleting workspace file: ${fileId}`)

  try {
    const fileRecord = await getWorkspaceFile(workspaceId, fileId)
    if (!fileRecord) {
      throw new Error('File not found')
    }

    await deleteFile({
      key: fileRecord.key,
      context: 'workspace',
    })

    await db
      .delete(workspaceFiles)
      .where(
        and(
          eq(workspaceFiles.id, fileId),
          eq(workspaceFiles.workspaceId, workspaceId),
          eq(workspaceFiles.context, 'workspace')
        )
      )

    try {
      await decrementStorageUsage(fileRecord.uploadedBy, fileRecord.size)
    } catch (storageError) {
      logger.error(`Failed to update storage tracking:`, storageError)
    }

    logger.info(`Successfully deleted workspace file: ${fileRecord.name}`)
  } catch (error) {
    logger.error(`Failed to delete workspace file ${fileId}:`, error)
    throw new Error(
      `Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: setup.server.ts]---
Location: sim-main/apps/sim/lib/uploads/core/setup.server.ts

```typescript
import { existsSync } from 'fs'
import { mkdir } from 'fs/promises'
import path, { join } from 'path'
import { env } from '@/lib/core/config/env'
import { createLogger } from '@/lib/logs/console/logger'
import { getStorageProvider, USE_BLOB_STORAGE, USE_S3_STORAGE } from '@/lib/uploads/config'

const logger = createLogger('UploadsSetup')

const PROJECT_ROOT = path.resolve(process.cwd())
export const UPLOAD_DIR_SERVER = join(PROJECT_ROOT, 'uploads')

/**
 * Server-only function to ensure uploads directory exists
 */
export async function ensureUploadsDirectory() {
  if (USE_S3_STORAGE) {
    logger.info('Using S3 storage, skipping local uploads directory creation')
    return true
  }

  if (USE_BLOB_STORAGE) {
    logger.info('Using Azure Blob storage, skipping local uploads directory creation')
    return true
  }

  try {
    if (!existsSync(UPLOAD_DIR_SERVER)) {
      await mkdir(UPLOAD_DIR_SERVER, { recursive: true })
    } else {
      logger.info(`Uploads directory already exists at ${UPLOAD_DIR_SERVER}`)
    }
    return true
  } catch (error) {
    logger.error('Failed to create uploads directory:', error)
    return false
  }
}

// Immediately invoke on server startup
if (typeof process !== 'undefined') {
  const storageProvider = getStorageProvider()

  // Log storage mode
  logger.info(`Storage provider: ${storageProvider}`)

  if (USE_BLOB_STORAGE) {
    // Verify Azure Blob credentials
    if (!env.AZURE_STORAGE_CONTAINER_NAME) {
      logger.warn('Azure Blob storage is enabled but AZURE_STORAGE_CONTAINER_NAME is not set')
    } else if (!env.AZURE_ACCOUNT_NAME && !env.AZURE_CONNECTION_STRING) {
      logger.warn(
        'Azure Blob storage is enabled but neither AZURE_ACCOUNT_NAME nor AZURE_CONNECTION_STRING is set'
      )
      logger.warn(
        'Set AZURE_ACCOUNT_NAME + AZURE_ACCOUNT_KEY or AZURE_CONNECTION_STRING for Azure Blob storage'
      )
    } else if (env.AZURE_ACCOUNT_NAME && !env.AZURE_ACCOUNT_KEY && !env.AZURE_CONNECTION_STRING) {
      logger.warn(
        'AZURE_ACCOUNT_NAME is set but AZURE_ACCOUNT_KEY is missing and no AZURE_CONNECTION_STRING provided'
      )
      logger.warn('Set AZURE_ACCOUNT_KEY or use AZURE_CONNECTION_STRING for authentication')
    } else {
      logger.info('Azure Blob storage credentials found in environment variables')
      if (env.AZURE_CONNECTION_STRING) {
        logger.info('Using Azure connection string for authentication')
      } else {
        logger.info('Using Azure account name and key for authentication')
      }
    }
  } else if (USE_S3_STORAGE) {
    // Verify AWS credentials
    if (!env.S3_BUCKET_NAME || !env.AWS_REGION) {
      logger.warn('S3 storage configuration is incomplete')
      logger.warn('Set S3_BUCKET_NAME and AWS_REGION for S3 storage')
    } else if (!env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY) {
      logger.warn('AWS credentials are not set in environment variables')
      logger.warn('Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY for S3 storage')
    } else {
      logger.info('AWS S3 credentials found in environment variables')
    }
  } else {
    // Local storage mode
    logger.info('Using local file storage')

    // Only initialize local uploads directory when using local storage
    ensureUploadsDirectory().then((success) => {
      if (success) {
        logger.info('Local uploads directory initialized')
      } else {
        logger.error('Failed to initialize local uploads directory')
      }
    })
  }

  // Log additional configuration details
  if (USE_BLOB_STORAGE && env.AZURE_STORAGE_KB_CONTAINER_NAME) {
    logger.info(`Azure Blob knowledge base container: ${env.AZURE_STORAGE_KB_CONTAINER_NAME}`)
  }
  if (USE_BLOB_STORAGE && env.AZURE_STORAGE_COPILOT_CONTAINER_NAME) {
    logger.info(`Azure Blob copilot container: ${env.AZURE_STORAGE_COPILOT_CONTAINER_NAME}`)
  }
  if (USE_S3_STORAGE && env.S3_KB_BUCKET_NAME) {
    logger.info(`S3 knowledge base bucket: ${env.S3_KB_BUCKET_NAME}`)
  }
  if (USE_S3_STORAGE && env.S3_COPILOT_BUCKET_NAME) {
    logger.info(`S3 copilot bucket: ${env.S3_COPILOT_BUCKET_NAME}`)
  }
}

export default ensureUploadsDirectory
```

--------------------------------------------------------------------------------

---[FILE: storage-client.ts]---
Location: sim-main/apps/sim/lib/uploads/core/storage-client.ts

```typescript
import { USE_BLOB_STORAGE, USE_S3_STORAGE } from '@/lib/uploads/config'
import type { StorageConfig } from '@/lib/uploads/shared/types'

export type { StorageConfig } from '@/lib/uploads/shared/types'

/**
 * Get the current storage provider name
 */
export function getStorageProvider(): 'blob' | 's3' | 'local' {
  if (USE_BLOB_STORAGE) return 'blob'
  if (USE_S3_STORAGE) return 's3'
  return 'local'
}

/**
 * Get the serve path prefix (unified across all storage providers)
 */
export function getServePathPrefix(): string {
  return '/api/files/serve/'
}

/**
 * Get file metadata from storage provider
 * @param key File key/name
 * @param customConfig Optional custom storage configuration
 * @returns File metadata object with userId, workspaceId, originalName, uploadedAt, etc.
 */
export async function getFileMetadata(
  key: string,
  customConfig?: StorageConfig
): Promise<Record<string, string>> {
  const { getFileMetadataByKey } = await import('../server/metadata')
  const metadataRecord = await getFileMetadataByKey(key)

  if (metadataRecord) {
    return {
      userId: metadataRecord.userId,
      workspaceId: metadataRecord.workspaceId || '',
      originalName: metadataRecord.originalName,
      uploadedAt: metadataRecord.uploadedAt.toISOString(),
      purpose: metadataRecord.context,
    }
  }

  if (USE_BLOB_STORAGE) {
    const { getBlobServiceClient } = await import('@/lib/uploads/providers/blob/client')
    const { BLOB_CONFIG } = await import('@/lib/uploads/config')

    let blobServiceClient = await getBlobServiceClient()
    let containerName = BLOB_CONFIG.containerName

    if (customConfig) {
      const { BlobServiceClient, StorageSharedKeyCredential } = await import('@azure/storage-blob')
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
      }
      containerName = customConfig.containerName || containerName
    }

    const containerClient = blobServiceClient.getContainerClient(containerName)
    const blockBlobClient = containerClient.getBlockBlobClient(key)
    const properties = await blockBlobClient.getProperties()
    return properties.metadata || {}
  }

  if (USE_S3_STORAGE) {
    const { getS3Client } = await import('@/lib/uploads/providers/s3/client')
    const { HeadObjectCommand } = await import('@aws-sdk/client-s3')
    const { S3_CONFIG } = await import('@/lib/uploads/config')

    const s3Client = getS3Client()
    const bucket = customConfig?.bucket || S3_CONFIG.bucket

    if (!bucket) {
      throw new Error('S3 bucket not configured')
    }

    const command = new HeadObjectCommand({
      Bucket: bucket,
      Key: key,
    })

    const response = await s3Client.send(command)
    return response.Metadata || {}
  }

  return {}
}
```

--------------------------------------------------------------------------------

````
