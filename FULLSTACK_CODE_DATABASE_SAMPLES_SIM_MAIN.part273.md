---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 273
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 273 of 933)

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
Location: sim-main/apps/sim/app/api/environment/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import { environment } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { decryptSecret, encryptSecret } from '@/lib/core/security/encryption'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import type { EnvironmentVariable } from '@/stores/settings/environment/types'

const logger = createLogger('EnvironmentAPI')

const EnvVarSchema = z.object({
  variables: z.record(z.string()),
})

export async function POST(req: NextRequest) {
  const requestId = generateRequestId()

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized environment variables update attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    try {
      const { variables } = EnvVarSchema.parse(body)

      const encryptedVariables = await Promise.all(
        Object.entries(variables).map(async ([key, value]) => {
          const { encrypted } = await encryptSecret(value)
          return [key, encrypted] as const
        })
      ).then((entries) => Object.fromEntries(entries))

      await db
        .insert(environment)
        .values({
          id: crypto.randomUUID(),
          userId: session.user.id,
          variables: encryptedVariables,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: [environment.userId],
          set: {
            variables: encryptedVariables,
            updatedAt: new Date(),
          },
        })

      return NextResponse.json({ success: true })
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        logger.warn(`[${requestId}] Invalid environment variables data`, {
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
    logger.error(`[${requestId}] Error updating environment variables`, error)
    return NextResponse.json({ error: 'Failed to update environment variables' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const requestId = generateRequestId()

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized environment variables access attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const result = await db
      .select()
      .from(environment)
      .where(eq(environment.userId, userId))
      .limit(1)

    if (!result.length || !result[0].variables) {
      return NextResponse.json({ data: {} }, { status: 200 })
    }

    const encryptedVariables = result[0].variables as Record<string, string>
    const decryptedVariables: Record<string, EnvironmentVariable> = {}

    for (const [key, encryptedValue] of Object.entries(encryptedVariables)) {
      try {
        const { decrypted } = await decryptSecret(encryptedValue)
        decryptedVariables[key] = { key, value: decrypted }
      } catch (error) {
        logger.error(`[${requestId}] Error decrypting variable ${key}`, error)
        decryptedVariables[key] = { key, value: '' }
      }
    }

    return NextResponse.json({ data: decryptedVariables }, { status: 200 })
  } catch (error: any) {
    logger.error(`[${requestId}] Environment fetch error`, error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: authorization.ts]---
Location: sim-main/apps/sim/app/api/files/authorization.ts

```typescript
import { db } from '@sim/db'
import { document, workspaceFile } from '@sim/db/schema'
import { eq, like, or } from 'drizzle-orm'
import { createLogger } from '@/lib/logs/console/logger'
import { getFileMetadata } from '@/lib/uploads'
import type { StorageContext } from '@/lib/uploads/config'
import {
  BLOB_CHAT_CONFIG,
  BLOB_KB_CONFIG,
  S3_CHAT_CONFIG,
  S3_KB_CONFIG,
} from '@/lib/uploads/config'
import type { StorageConfig } from '@/lib/uploads/core/storage-client'
import { getFileMetadataByKey } from '@/lib/uploads/server/metadata'
import { inferContextFromKey } from '@/lib/uploads/utils/file-utils'
import { getUserEntityPermissions } from '@/lib/workspaces/permissions/utils'

const logger = createLogger('FileAuthorization')

export interface AuthorizationResult {
  granted: boolean
  reason: string
  workspaceId?: string
}

/**
 * Lookup workspace file by storage key from database
 * @param key Storage key to lookup
 * @returns Workspace file info or null if not found
 */
export async function lookupWorkspaceFileByKey(
  key: string
): Promise<{ workspaceId: string; uploadedBy: string } | null> {
  try {
    // Priority 1: Check new workspaceFiles table
    const fileRecord = await getFileMetadataByKey(key, 'workspace')

    if (fileRecord) {
      return {
        workspaceId: fileRecord.workspaceId || '',
        uploadedBy: fileRecord.userId,
      }
    }

    // Priority 2: Check legacy workspace_file table (for backward compatibility during migration)
    try {
      const [legacyFile] = await db
        .select({
          workspaceId: workspaceFile.workspaceId,
          uploadedBy: workspaceFile.uploadedBy,
        })
        .from(workspaceFile)
        .where(eq(workspaceFile.key, key))
        .limit(1)

      if (legacyFile) {
        return {
          workspaceId: legacyFile.workspaceId,
          uploadedBy: legacyFile.uploadedBy,
        }
      }
    } catch (legacyError) {
      // Ignore errors when checking legacy table (it may not exist after migration)
      logger.debug('Legacy workspace_file table check failed (may not exist):', legacyError)
    }

    return null
  } catch (error) {
    logger.error('Error looking up workspace file by key:', { key, error })
    return null
  }
}

/**
 * Extract workspace ID from workspace file key pattern
 * Pattern: {workspaceId}/{timestamp}-{random}-{filename}
 */
function extractWorkspaceIdFromKey(key: string): string | null {
  const inferredContext = inferContextFromKey(key)
  if (inferredContext !== 'workspace') {
    return null
  }

  // Use the proper parsing utility from workspace context module
  const parts = key.split('/')
  const workspaceId = parts[0]

  // Validate UUID format
  const UUID_PATTERN = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i
  if (workspaceId && UUID_PATTERN.test(workspaceId)) {
    return workspaceId
  }

  return null
}

/**
 * Verify file access based on file path patterns and metadata
 * @param cloudKey The file key/path (e.g., "workspace_id/workflow_id/execution_id/filename" or "kb/filename")
 * @param userId The authenticated user ID
 * @param customConfig Optional custom storage configuration
 * @param context Optional explicit storage context
 * @param isLocal Optional flag indicating if this is local storage
 * @returns Promise<boolean> True if user has access, false otherwise
 */
export async function verifyFileAccess(
  cloudKey: string,
  userId: string,
  customConfig?: StorageConfig,
  context?: StorageContext,
  isLocal?: boolean
): Promise<boolean> {
  try {
    // Infer context from key if not explicitly provided
    const inferredContext = context || inferContextFromKey(cloudKey)

    // 0. Profile pictures: Public access (anyone can view creator profile pictures)
    if (inferredContext === 'profile-pictures') {
      logger.info('Profile picture access allowed (public)', { cloudKey })
      return true
    }

    // 1. Workspace files: Check database first (most reliable for both local and cloud)
    if (inferredContext === 'workspace') {
      return await verifyWorkspaceFileAccess(cloudKey, userId, customConfig, isLocal)
    }

    // 2. Execution files: workspace_id/workflow_id/execution_id/filename
    if (inferredContext === 'execution') {
      return await verifyExecutionFileAccess(cloudKey, userId, customConfig)
    }

    // 3. Copilot files: Check database first, then metadata, then path pattern (legacy)
    if (inferredContext === 'copilot') {
      return await verifyCopilotFileAccess(cloudKey, userId, customConfig)
    }

    // 4. KB files: kb/filename
    if (inferredContext === 'knowledge-base') {
      return await verifyKBFileAccess(cloudKey, userId, customConfig)
    }

    // 5. Chat files: chat/filename
    if (inferredContext === 'chat') {
      return await verifyChatFileAccess(cloudKey, userId, customConfig)
    }

    // 6. Regular uploads: UUID-filename or timestamp-filename
    // Check metadata for userId/workspaceId, or database for workspace files
    return await verifyRegularFileAccess(cloudKey, userId, customConfig, isLocal)
  } catch (error) {
    logger.error('Error verifying file access:', { cloudKey, userId, error })
    // Deny access on error to be safe
    return false
  }
}

/**
 * Verify access to workspace files
 * Priority: Database lookup > Metadata > Deny
 */
async function verifyWorkspaceFileAccess(
  cloudKey: string,
  userId: string,
  customConfig?: StorageConfig,
  isLocal?: boolean
): Promise<boolean> {
  try {
    // Priority 1: Check database (most reliable, works for both local and cloud)
    const workspaceFileRecord = await lookupWorkspaceFileByKey(cloudKey)
    if (workspaceFileRecord) {
      const permission = await getUserEntityPermissions(
        userId,
        'workspace',
        workspaceFileRecord.workspaceId
      )
      if (permission !== null) {
        logger.debug('Workspace file access granted (database lookup)', {
          userId,
          workspaceId: workspaceFileRecord.workspaceId,
          cloudKey,
        })
        return true
      }
      logger.warn('User does not have workspace access for file', {
        userId,
        workspaceId: workspaceFileRecord.workspaceId,
        cloudKey,
      })
      return false
    }

    // Priority 2: Check metadata (works for both local and cloud files)
    const config: StorageConfig = customConfig || {}
    const metadata = await getFileMetadata(cloudKey, config)
    const workspaceId = metadata.workspaceId

    if (workspaceId) {
      const permission = await getUserEntityPermissions(userId, 'workspace', workspaceId)
      if (permission !== null) {
        logger.debug('Workspace file access granted (metadata)', {
          userId,
          workspaceId,
          cloudKey,
        })
        return true
      }
      logger.warn('User does not have workspace access for file (metadata)', {
        userId,
        workspaceId,
        cloudKey,
      })
      return false
    }

    logger.warn('Workspace file missing authorization metadata', { cloudKey, userId })
    return false
  } catch (error) {
    logger.error('Error verifying workspace file access', { cloudKey, userId, error })
    return false
  }
}

/**
 * Verify access to execution files
 * Modern format: execution/workspace_id/workflow_id/execution_id/filename
 * Legacy format: workspace_id/workflow_id/execution_id/filename
 */
async function verifyExecutionFileAccess(
  cloudKey: string,
  userId: string,
  customConfig?: StorageConfig
): Promise<boolean> {
  const parts = cloudKey.split('/')

  // Determine if this is modern prefixed or legacy format
  let workspaceId: string
  if (parts[0] === 'execution') {
    // Modern format: execution/workspaceId/workflowId/executionId/filename
    if (parts.length < 5) {
      logger.warn('Invalid execution file path format (modern)', { cloudKey })
      return false
    }
    workspaceId = parts[1]
  } else {
    // Legacy format: workspaceId/workflowId/executionId/filename
    if (parts.length < 4) {
      logger.warn('Invalid execution file path format (legacy)', { cloudKey })
      return false
    }
    workspaceId = parts[0]
  }

  if (!workspaceId) {
    logger.warn('Could not extract workspaceId from execution file path', { cloudKey })
    return false
  }

  const permission = await getUserEntityPermissions(userId, 'workspace', workspaceId)
  if (permission === null) {
    logger.warn('User does not have workspace access for execution file', {
      userId,
      workspaceId,
      cloudKey,
    })
    return false
  }

  logger.debug('Execution file access granted', { userId, workspaceId, cloudKey })
  return true
}

/**
 * Verify access to copilot files
 * Priority: Database lookup > Metadata > Path pattern (legacy)
 */
async function verifyCopilotFileAccess(
  cloudKey: string,
  userId: string,
  customConfig?: StorageConfig
): Promise<boolean> {
  try {
    // Priority 1: Check workspaceFiles table (new system)
    const fileRecord = await getFileMetadataByKey(cloudKey, 'copilot')

    if (fileRecord) {
      if (fileRecord.userId === userId) {
        logger.debug('Copilot file access granted (workspaceFiles table)', {
          userId,
          cloudKey,
        })
        return true
      }
      logger.warn('User does not own copilot file', {
        userId,
        fileUserId: fileRecord.userId,
        cloudKey,
      })
      return false
    }

    // Priority 2: Check metadata (for files not yet in database)
    const config: StorageConfig = customConfig || {}
    const metadata = await getFileMetadata(cloudKey, config)
    const fileUserId = metadata.userId

    if (fileUserId) {
      if (fileUserId === userId) {
        logger.debug('Copilot file access granted (metadata)', { userId, cloudKey })
        return true
      }
      logger.warn('User does not own copilot file (metadata)', {
        userId,
        fileUserId,
        cloudKey,
      })
      return false
    }

    // Priority 3: Legacy path pattern check (userId/filename format)
    // This handles old copilot files that may have been stored with userId prefix
    const parts = cloudKey.split('/')
    if (parts.length >= 2) {
      const fileUserId = parts[0]
      if (fileUserId && fileUserId === userId) {
        logger.debug('Copilot file access granted (path pattern)', { userId, cloudKey })
        return true
      }
      logger.warn('User does not own copilot file (path pattern)', {
        userId,
        fileUserId,
        cloudKey,
      })
      return false
    }

    logger.warn('Copilot file missing authorization metadata', { cloudKey, userId })
    return false
  } catch (error) {
    logger.error('Error verifying copilot file access', { cloudKey, userId, error })
    return false
  }
}

/**
 * Verify access to KB files
 * KB files: kb/filename
 */
async function verifyKBFileAccess(
  cloudKey: string,
  userId: string,
  customConfig?: StorageConfig
): Promise<boolean> {
  try {
    // Priority 1: Check workspaceFiles table (new system)
    const fileRecord = await getFileMetadataByKey(cloudKey, 'knowledge-base')

    if (fileRecord?.workspaceId) {
      const permission = await getUserEntityPermissions(userId, 'workspace', fileRecord.workspaceId)
      if (permission !== null) {
        logger.debug('KB file access granted (workspaceFiles table)', {
          userId,
          workspaceId: fileRecord.workspaceId,
          cloudKey,
        })
        return true
      }
      logger.warn('User does not have workspace access for KB file', {
        userId,
        workspaceId: fileRecord.workspaceId,
        cloudKey,
      })
      return false
    }

    // Priority 2: Check document table via fileUrl (legacy knowledge base files)
    try {
      // Try to find document with matching fileUrl
      const documents = await db
        .select({
          knowledgeBaseId: document.knowledgeBaseId,
        })
        .from(document)
        .where(
          or(
            like(document.fileUrl, `%${cloudKey}%`),
            like(document.fileUrl, `%${encodeURIComponent(cloudKey)}%`)
          )
        )
        .limit(10) // Limit to avoid scanning too many

      // Check each document's knowledge base for workspace access
      for (const doc of documents) {
        const { knowledgeBase } = await import('@sim/db/schema')
        const [kb] = await db
          .select({
            workspaceId: knowledgeBase.workspaceId,
          })
          .from(knowledgeBase)
          .where(eq(knowledgeBase.id, doc.knowledgeBaseId))
          .limit(1)

        if (kb?.workspaceId) {
          const permission = await getUserEntityPermissions(userId, 'workspace', kb.workspaceId)
          if (permission !== null) {
            logger.debug('KB file access granted (document table lookup)', {
              userId,
              workspaceId: kb.workspaceId,
              cloudKey,
            })
            return true
          }
        }
      }
    } catch (docError) {
      logger.debug('Document table lookup failed:', docError)
    }

    // Priority 3: Check cloud storage metadata
    const config: StorageConfig = customConfig || (await getKBStorageConfig())
    const metadata = await getFileMetadata(cloudKey, config)
    const workspaceId = metadata.workspaceId

    if (workspaceId) {
      const permission = await getUserEntityPermissions(userId, 'workspace', workspaceId)
      if (permission !== null) {
        logger.debug('KB file access granted (cloud metadata)', {
          userId,
          workspaceId,
          cloudKey,
        })
        return true
      }
      logger.warn('User does not have workspace access for KB file', {
        userId,
        workspaceId,
        cloudKey,
      })
      return false
    }

    logger.warn('KB file missing workspaceId in all sources', { cloudKey, userId })
    return false
  } catch (error) {
    logger.error('Error verifying KB file access', { cloudKey, userId, error })
    return false
  }
}

/**
 * Verify access to chat files
 * Chat files: chat/filename
 */
async function verifyChatFileAccess(
  cloudKey: string,
  userId: string,
  customConfig?: StorageConfig
): Promise<boolean> {
  try {
    const config: StorageConfig = customConfig || (await getChatStorageConfig())

    const metadata = await getFileMetadata(cloudKey, config)
    const workspaceId = metadata.workspaceId

    if (!workspaceId) {
      logger.warn('Chat file missing workspaceId in metadata', { cloudKey, userId })
      return false
    }

    const permission = await getUserEntityPermissions(userId, 'workspace', workspaceId)
    if (permission === null) {
      logger.warn('User does not have workspace access for chat file', {
        userId,
        workspaceId,
        cloudKey,
      })
      return false
    }

    logger.debug('Chat file access granted', { userId, workspaceId, cloudKey })
    return true
  } catch (error) {
    logger.error('Error verifying chat file access', { cloudKey, userId, error })
    return false
  }
}

/**
 * Verify access to regular uploads
 * Regular uploads: UUID-filename or timestamp-filename
 * Priority: Database lookup (for workspace files) > Metadata > Deny
 */
async function verifyRegularFileAccess(
  cloudKey: string,
  userId: string,
  customConfig?: StorageConfig,
  isLocal?: boolean
): Promise<boolean> {
  try {
    // Priority 1: Check if this might be a workspace file (check database)
    // This handles legacy files that might not have metadata
    const workspaceFileRecord = await lookupWorkspaceFileByKey(cloudKey)
    if (workspaceFileRecord) {
      const permission = await getUserEntityPermissions(
        userId,
        'workspace',
        workspaceFileRecord.workspaceId
      )
      if (permission !== null) {
        logger.debug('Regular file access granted (workspace file from database)', {
          userId,
          workspaceId: workspaceFileRecord.workspaceId,
          cloudKey,
        })
        return true
      }
      logger.warn('User does not have workspace access for file', {
        userId,
        workspaceId: workspaceFileRecord.workspaceId,
        cloudKey,
      })
      return false
    }

    // Priority 2: Check metadata (works for both local and cloud files)
    const config: StorageConfig = customConfig || {}
    const metadata = await getFileMetadata(cloudKey, config)
    const fileUserId = metadata.userId
    const workspaceId = metadata.workspaceId

    // If file has userId, verify ownership
    if (fileUserId) {
      if (fileUserId === userId) {
        logger.debug('Regular file access granted (userId match)', { userId, cloudKey })
        return true
      }
      logger.warn('User does not own file', { userId, fileUserId, cloudKey })
      return false
    }

    // If file has workspaceId, verify workspace membership
    if (workspaceId) {
      const permission = await getUserEntityPermissions(userId, 'workspace', workspaceId)
      if (permission !== null) {
        logger.debug('Regular file access granted (workspace membership)', {
          userId,
          workspaceId,
          cloudKey,
        })
        return true
      }
      logger.warn('User does not have workspace access for file', {
        userId,
        workspaceId,
        cloudKey,
      })
      return false
    }

    // No ownership info available - deny access for security
    logger.warn('File missing ownership metadata', { cloudKey, userId })
    return false
  } catch (error) {
    logger.error('Error verifying regular file access', { cloudKey, userId, error })
    return false
  }
}

/**
 * Unified authorization function that returns structured result
 */
export async function authorizeFileAccess(
  key: string,
  userId: string,
  context?: StorageContext,
  storageConfig?: StorageConfig,
  isLocal?: boolean
): Promise<AuthorizationResult> {
  const granted = await verifyFileAccess(key, userId, storageConfig, context, isLocal)

  if (granted) {
    let workspaceId: string | undefined
    const inferredContext = context || inferContextFromKey(key)

    if (inferredContext === 'workspace') {
      const record = await lookupWorkspaceFileByKey(key)
      workspaceId = record?.workspaceId
    } else {
      const extracted = extractWorkspaceIdFromKey(key)
      if (extracted) {
        workspaceId = extracted
      }
    }

    return {
      granted: true,
      reason: 'Access granted',
      workspaceId,
    }
  }

  return {
    granted: false,
    reason: 'Access denied - insufficient permissions or file not found',
  }
}

/**
 * Get KB storage configuration based on current storage provider
 */
async function getKBStorageConfig(): Promise<StorageConfig> {
  const { USE_S3_STORAGE, USE_BLOB_STORAGE } = await import('@/lib/uploads/config')

  if (USE_BLOB_STORAGE) {
    return {
      containerName: BLOB_KB_CONFIG.containerName,
      accountName: BLOB_KB_CONFIG.accountName,
      accountKey: BLOB_KB_CONFIG.accountKey,
      connectionString: BLOB_KB_CONFIG.connectionString,
    }
  }

  if (USE_S3_STORAGE) {
    return {
      bucket: S3_KB_CONFIG.bucket,
      region: S3_KB_CONFIG.region,
    }
  }

  return {}
}

/**
 * Get chat storage configuration based on current storage provider
 */
async function getChatStorageConfig(): Promise<StorageConfig> {
  const { USE_S3_STORAGE, USE_BLOB_STORAGE } = await import('@/lib/uploads/config')

  if (USE_BLOB_STORAGE) {
    return {
      containerName: BLOB_CHAT_CONFIG.containerName,
      accountName: BLOB_CHAT_CONFIG.accountName,
      accountKey: BLOB_CHAT_CONFIG.accountKey,
      connectionString: BLOB_CHAT_CONFIG.connectionString,
    }
  }

  if (USE_S3_STORAGE) {
    return {
      bucket: S3_CHAT_CONFIG.bucket,
      region: S3_CHAT_CONFIG.region,
    }
  }

  return {}
}
```

--------------------------------------------------------------------------------

---[FILE: utils.test.ts]---
Location: sim-main/apps/sim/app/api/files/utils.test.ts

```typescript
import { describe, expect, it } from 'vitest'
import { createFileResponse, extractFilename, findLocalFile } from '@/app/api/files/utils'

describe('extractFilename', () => {
  describe('legitimate file paths', () => {
    it('should extract filename from standard serve path', () => {
      expect(extractFilename('/api/files/serve/test-file.txt')).toBe('test-file.txt')
    })

    it('should extract filename from serve path with special characters', () => {
      expect(extractFilename('/api/files/serve/document-with-dashes_and_underscores.pdf')).toBe(
        'document-with-dashes_and_underscores.pdf'
      )
    })

    it('should handle simple filename without serve path', () => {
      expect(extractFilename('simple-file.txt')).toBe('simple-file.txt')
    })

    it('should extract last segment from nested path', () => {
      expect(extractFilename('nested/path/file.txt')).toBe('file.txt')
    })
  })

  describe('cloud storage paths', () => {
    it('should preserve S3 path structure', () => {
      expect(extractFilename('/api/files/serve/s3/1234567890-test-file.txt')).toBe(
        's3/1234567890-test-file.txt'
      )
    })

    it('should preserve S3 path with nested folders', () => {
      expect(extractFilename('/api/files/serve/s3/folder/subfolder/document.pdf')).toBe(
        's3/folder/subfolder/document.pdf'
      )
    })

    it('should preserve Azure Blob path structure', () => {
      expect(extractFilename('/api/files/serve/blob/1234567890-test-document.pdf')).toBe(
        'blob/1234567890-test-document.pdf'
      )
    })

    it('should preserve Blob path with nested folders', () => {
      expect(extractFilename('/api/files/serve/blob/uploads/user-files/report.xlsx')).toBe(
        'blob/uploads/user-files/report.xlsx'
      )
    })
  })

  describe('security - path traversal prevention', () => {
    it('should sanitize basic path traversal attempt', () => {
      expect(extractFilename('/api/files/serve/../config.txt')).toBe('config.txt')
    })

    it('should sanitize deep path traversal attempt', () => {
      expect(extractFilename('/api/files/serve/../../../../../etc/passwd')).toBe('etcpasswd')
    })

    it('should sanitize multiple path traversal patterns', () => {
      expect(extractFilename('/api/files/serve/../../secret.txt')).toBe('secret.txt')
    })

    it('should sanitize path traversal with forward slashes', () => {
      expect(extractFilename('/api/files/serve/../../../system/file')).toBe('systemfile')
    })

    it('should sanitize mixed path traversal patterns', () => {
      expect(extractFilename('/api/files/serve/../folder/../file.txt')).toBe('folderfile.txt')
    })

    it('should remove directory separators from local filenames', () => {
      expect(extractFilename('/api/files/serve/folder/with/separators.txt')).toBe(
        'folderwithseparators.txt'
      )
    })

    it('should handle backslash path separators (Windows style)', () => {
      expect(extractFilename('/api/files/serve/folder\\file.txt')).toBe('folderfile.txt')
    })
  })

  describe('cloud storage path traversal prevention', () => {
    it('should sanitize S3 path traversal attempts while preserving structure', () => {
      expect(extractFilename('/api/files/serve/s3/../config')).toBe('s3/config')
    })

    it('should sanitize S3 path with nested traversal attempts', () => {
      expect(extractFilename('/api/files/serve/s3/folder/../sensitive/../file.txt')).toBe(
        's3/folder/sensitive/file.txt'
      )
    })

    it('should sanitize Blob path traversal attempts while preserving structure', () => {
      expect(extractFilename('/api/files/serve/blob/../system.txt')).toBe('blob/system.txt')
    })

    it('should remove leading dots from cloud path segments', () => {
      expect(extractFilename('/api/files/serve/s3/.hidden/../file.txt')).toBe('s3/hidden/file.txt')
    })
  })

  describe('edge cases and error handling', () => {
    it('should handle filename with dots (but not traversal)', () => {
      expect(extractFilename('/api/files/serve/file.with.dots.txt')).toBe('file.with.dots.txt')
    })

    it('should handle filename with multiple extensions', () => {
      expect(extractFilename('/api/files/serve/archive.tar.gz')).toBe('archive.tar.gz')
    })

    it('should throw error for empty filename after sanitization', () => {
      expect(() => extractFilename('/api/files/serve/')).toThrow(
        'Invalid or empty filename after sanitization'
      )
    })

    it('should throw error for filename that becomes empty after path traversal removal', () => {
      expect(() => extractFilename('/api/files/serve/../..')).toThrow(
        'Invalid or empty filename after sanitization'
      )
    })

    it('should handle single character filenames', () => {
      expect(extractFilename('/api/files/serve/a')).toBe('a')
    })

    it('should handle numeric filenames', () => {
      expect(extractFilename('/api/files/serve/123')).toBe('123')
    })
  })

  describe('backward compatibility', () => {
    it('should match old behavior for legitimate local files', () => {
      // These test cases verify that our security fix maintains exact backward compatibility
      // for all legitimate use cases found in the existing codebase
      expect(extractFilename('/api/files/serve/test-file.txt')).toBe('test-file.txt')
      expect(extractFilename('/api/files/serve/nonexistent.txt')).toBe('nonexistent.txt')
    })

    it('should match old behavior for legitimate cloud files', () => {
      // These test cases are from the actual delete route tests
      expect(extractFilename('/api/files/serve/s3/1234567890-test-file.txt')).toBe(
        's3/1234567890-test-file.txt'
      )
      expect(extractFilename('/api/files/serve/blob/1234567890-test-document.pdf')).toBe(
        'blob/1234567890-test-document.pdf'
      )
    })

    it('should match old behavior for simple paths', () => {
      // These match the mock implementations in serve route tests
      expect(extractFilename('simple-file.txt')).toBe('simple-file.txt')
      expect(extractFilename('nested/path/file.txt')).toBe('file.txt')
    })
  })

  describe('File Serving Security Tests', () => {
    describe('createFileResponse security headers', () => {
      it('should serve safe images inline with proper headers', () => {
        const response = createFileResponse({
          buffer: Buffer.from('fake-image-data'),
          contentType: 'image/png',
          filename: 'safe-image.png',
        })

        expect(response.status).toBe(200)
        expect(response.headers.get('Content-Type')).toBe('image/png')
        expect(response.headers.get('Content-Disposition')).toBe(
          'inline; filename="safe-image.png"'
        )
        expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff')
        expect(response.headers.get('Content-Security-Policy')).toBe(
          "default-src 'none'; style-src 'unsafe-inline'; sandbox;"
        )
      })

      it('should serve PDFs inline safely', () => {
        const response = createFileResponse({
          buffer: Buffer.from('fake-pdf-data'),
          contentType: 'application/pdf',
          filename: 'document.pdf',
        })

        expect(response.status).toBe(200)
        expect(response.headers.get('Content-Type')).toBe('application/pdf')
        expect(response.headers.get('Content-Disposition')).toBe('inline; filename="document.pdf"')
        expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff')
      })

      it('should force attachment for HTML files to prevent XSS', () => {
        const response = createFileResponse({
          buffer: Buffer.from('<script>alert("XSS")</script>'),
          contentType: 'text/html',
          filename: 'malicious.html',
        })

        expect(response.status).toBe(200)
        expect(response.headers.get('Content-Type')).toBe('application/octet-stream')
        expect(response.headers.get('Content-Disposition')).toBe(
          'attachment; filename="malicious.html"'
        )
        expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff')
      })

      it('should force attachment for SVG files to prevent XSS', () => {
        const response = createFileResponse({
          buffer: Buffer.from(
            '<svg onload="alert(\'XSS\')" xmlns="http://www.w3.org/2000/svg"></svg>'
          ),
          contentType: 'image/svg+xml',
          filename: 'malicious.svg',
        })

        expect(response.status).toBe(200)
        expect(response.headers.get('Content-Type')).toBe('application/octet-stream')
        expect(response.headers.get('Content-Disposition')).toBe(
          'attachment; filename="malicious.svg"'
        )
      })

      it('should override dangerous content types to safe alternatives', () => {
        const response = createFileResponse({
          buffer: Buffer.from('<svg>safe content</svg>'),
          contentType: 'image/svg+xml',
          filename: 'image.png', // Extension doesn't match content-type
        })

        expect(response.status).toBe(200)
        // Should override SVG content type to plain text for safety
        expect(response.headers.get('Content-Type')).toBe('text/plain')
        expect(response.headers.get('Content-Disposition')).toBe('inline; filename="image.png"')
      })

      it('should force attachment for JavaScript files', () => {
        const response = createFileResponse({
          buffer: Buffer.from('alert("XSS")'),
          contentType: 'application/javascript',
          filename: 'malicious.js',
        })

        expect(response.status).toBe(200)
        expect(response.headers.get('Content-Type')).toBe('application/octet-stream')
        expect(response.headers.get('Content-Disposition')).toBe(
          'attachment; filename="malicious.js"'
        )
      })

      it('should force attachment for CSS files', () => {
        const response = createFileResponse({
          buffer: Buffer.from('body { background: url(javascript:alert("XSS")) }'),
          contentType: 'text/css',
          filename: 'malicious.css',
        })

        expect(response.status).toBe(200)
        expect(response.headers.get('Content-Type')).toBe('application/octet-stream')
        expect(response.headers.get('Content-Disposition')).toBe(
          'attachment; filename="malicious.css"'
        )
      })

      it('should force attachment for XML files', () => {
        const response = createFileResponse({
          buffer: Buffer.from('<?xml version="1.0"?><root><script>alert("XSS")</script></root>'),
          contentType: 'application/xml',
          filename: 'malicious.xml',
        })

        expect(response.status).toBe(200)
        expect(response.headers.get('Content-Type')).toBe('application/octet-stream')
        expect(response.headers.get('Content-Disposition')).toBe(
          'attachment; filename="malicious.xml"'
        )
      })

      it('should serve text files safely', () => {
        const response = createFileResponse({
          buffer: Buffer.from('Safe text content'),
          contentType: 'text/plain',
          filename: 'document.txt',
        })

        expect(response.status).toBe(200)
        expect(response.headers.get('Content-Type')).toBe('text/plain')
        expect(response.headers.get('Content-Disposition')).toBe('inline; filename="document.txt"')
      })

      it('should force attachment for unknown/unsafe content types', () => {
        const response = createFileResponse({
          buffer: Buffer.from('unknown content'),
          contentType: 'application/unknown',
          filename: 'unknown.bin',
        })

        expect(response.status).toBe(200)
        expect(response.headers.get('Content-Type')).toBe('application/unknown')
        expect(response.headers.get('Content-Disposition')).toBe(
          'attachment; filename="unknown.bin"'
        )
      })
    })

    describe('Content Security Policy', () => {
      it('should include CSP header in all responses', () => {
        const response = createFileResponse({
          buffer: Buffer.from('test'),
          contentType: 'text/plain',
          filename: 'test.txt',
        })

        const csp = response.headers.get('Content-Security-Policy')
        expect(csp).toBe("default-src 'none'; style-src 'unsafe-inline'; sandbox;")
      })

      it('should include X-Content-Type-Options header', () => {
        const response = createFileResponse({
          buffer: Buffer.from('test'),
          contentType: 'text/plain',
          filename: 'test.txt',
        })

        expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff')
      })
    })
  })
})

describe('findLocalFile - Path Traversal Security Tests', () => {
  describe('path traversal attack prevention', () => {
    it.concurrent('should reject classic path traversal attacks', () => {
      const maliciousInputs = [
        '../../../etc/passwd',
        '..\\..\\..\\windows\\system32\\config\\sam',
        '../../../../etc/shadow',
        '../config.json',
        '..\\config.ini',
      ]

      maliciousInputs.forEach((input) => {
        const result = findLocalFile(input)
        expect(result).toBeNull()
      })
    })

    it.concurrent('should reject encoded path traversal attempts', () => {
      const encodedInputs = [
        '%2e%2e%2f%2e%2e%2f%65%74%63%2f%70%61%73%73%77%64', // ../../../etc/passwd
        '..%2f..%2fetc%2fpasswd',
        '..%5c..%5cconfig.ini',
      ]

      encodedInputs.forEach((input) => {
        const result = findLocalFile(input)
        expect(result).toBeNull()
      })
    })

    it.concurrent('should reject mixed path separators', () => {
      const mixedInputs = ['../..\\config.txt', '..\\../secret.ini', '/..\\..\\system32']

      mixedInputs.forEach((input) => {
        const result = findLocalFile(input)
        expect(result).toBeNull()
      })
    })

    it.concurrent('should reject filenames with dangerous characters', () => {
      const dangerousInputs = [
        'file:with:colons.txt',
        'file|with|pipes.txt',
        'file?with?questions.txt',
        'file*with*asterisks.txt',
      ]

      dangerousInputs.forEach((input) => {
        const result = findLocalFile(input)
        expect(result).toBeNull()
      })
    })

    it.concurrent('should reject null and empty inputs', () => {
      expect(findLocalFile('')).toBeNull()
      expect(findLocalFile('   ')).toBeNull()
      expect(findLocalFile('\t\n')).toBeNull()
    })

    it.concurrent('should reject filenames that become empty after sanitization', () => {
      const emptyAfterSanitization = ['../..', '..\\..\\', '////', '....', '..']

      emptyAfterSanitization.forEach((input) => {
        const result = findLocalFile(input)
        expect(result).toBeNull()
      })
    })
  })

  describe('security validation passes for legitimate files', () => {
    it.concurrent('should accept properly formatted filenames without throwing errors', () => {
      const legitimateInputs = [
        'document.pdf',
        'image.png',
        'data.csv',
        'report-2024.doc',
        'file_with_underscores.txt',
        'file-with-dashes.json',
      ]

      legitimateInputs.forEach((input) => {
        // Should not throw security errors for legitimate filenames
        expect(() => findLocalFile(input)).not.toThrow()
      })
    })
  })
})
```

--------------------------------------------------------------------------------

````
