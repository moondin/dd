---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 313
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 313 of 933)

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
Location: sim-main/apps/sim/app/api/tools/sftp/delete/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import type { SFTPWrapper } from 'ssh2'
import { z } from 'zod'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import {
  createSftpConnection,
  getFileType,
  getSftp,
  isPathSafe,
  sanitizePath,
  sftpIsDirectory,
} from '@/app/api/tools/sftp/utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('SftpDeleteAPI')

const DeleteSchema = z.object({
  host: z.string().min(1, 'Host is required'),
  port: z.coerce.number().int().positive().default(22),
  username: z.string().min(1, 'Username is required'),
  password: z.string().nullish(),
  privateKey: z.string().nullish(),
  passphrase: z.string().nullish(),
  remotePath: z.string().min(1, 'Remote path is required'),
  recursive: z.boolean().default(false),
})

/**
 * Recursively deletes a directory and all its contents
 */
async function deleteRecursive(sftp: SFTPWrapper, dirPath: string): Promise<void> {
  const entries = await new Promise<Array<{ filename: string; attrs: any }>>((resolve, reject) => {
    sftp.readdir(dirPath, (err, list) => {
      if (err) {
        reject(err)
      } else {
        resolve(list)
      }
    })
  })

  for (const entry of entries) {
    if (entry.filename === '.' || entry.filename === '..') continue

    const entryPath = `${dirPath}/${entry.filename}`
    const entryType = getFileType(entry.attrs)

    if (entryType === 'directory') {
      await deleteRecursive(sftp, entryPath)
    } else {
      await new Promise<void>((resolve, reject) => {
        sftp.unlink(entryPath, (err) => {
          if (err) reject(err)
          else resolve()
        })
      })
    }
  }

  await new Promise<void>((resolve, reject) => {
    sftp.rmdir(dirPath, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })

    if (!authResult.success) {
      logger.warn(`[${requestId}] Unauthorized SFTP delete attempt: ${authResult.error}`)
      return NextResponse.json(
        { success: false, error: authResult.error || 'Authentication required' },
        { status: 401 }
      )
    }

    logger.info(`[${requestId}] Authenticated SFTP delete request via ${authResult.authType}`, {
      userId: authResult.userId,
    })

    const body = await request.json()
    const params = DeleteSchema.parse(body)

    if (!params.password && !params.privateKey) {
      return NextResponse.json(
        { error: 'Either password or privateKey must be provided' },
        { status: 400 }
      )
    }

    if (!isPathSafe(params.remotePath)) {
      logger.warn(`[${requestId}] Path traversal attempt detected in remotePath`)
      return NextResponse.json(
        { error: 'Invalid remote path: path traversal sequences are not allowed' },
        { status: 400 }
      )
    }

    logger.info(`[${requestId}] Connecting to SFTP server ${params.host}:${params.port}`)

    const client = await createSftpConnection({
      host: params.host,
      port: params.port,
      username: params.username,
      password: params.password,
      privateKey: params.privateKey,
      passphrase: params.passphrase,
    })

    try {
      const sftp = await getSftp(client)
      const remotePath = sanitizePath(params.remotePath)

      logger.info(`[${requestId}] Deleting ${remotePath} (recursive: ${params.recursive})`)

      const isDir = await sftpIsDirectory(sftp, remotePath)

      if (isDir) {
        if (params.recursive) {
          await deleteRecursive(sftp, remotePath)
        } else {
          await new Promise<void>((resolve, reject) => {
            sftp.rmdir(remotePath, (err) => {
              if (err) {
                if (err.message.includes('not empty')) {
                  reject(
                    new Error(
                      'Directory is not empty. Use recursive: true to delete non-empty directories.'
                    )
                  )
                } else {
                  reject(err)
                }
              } else {
                resolve()
              }
            })
          })
        }
      } else {
        await new Promise<void>((resolve, reject) => {
          sftp.unlink(remotePath, (err) => {
            if (err) {
              if (err.message.includes('No such file')) {
                reject(new Error(`File not found: ${remotePath}`))
              } else {
                reject(err)
              }
            } else {
              resolve()
            }
          })
        })
      }

      logger.info(`[${requestId}] Successfully deleted ${remotePath}`)

      return NextResponse.json({
        success: true,
        deletedPath: remotePath,
        message: `Successfully deleted ${remotePath}`,
      })
    } finally {
      client.end()
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn(`[${requestId}] Invalid request data`, { errors: error.errors })
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    logger.error(`[${requestId}] SFTP delete failed:`, error)

    return NextResponse.json({ error: `SFTP delete failed: ${errorMessage}` }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/sftp/download/route.ts
Signals: Next.js, Zod

```typescript
import path from 'path'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { createSftpConnection, getSftp, isPathSafe, sanitizePath } from '@/app/api/tools/sftp/utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('SftpDownloadAPI')

const DownloadSchema = z.object({
  host: z.string().min(1, 'Host is required'),
  port: z.coerce.number().int().positive().default(22),
  username: z.string().min(1, 'Username is required'),
  password: z.string().nullish(),
  privateKey: z.string().nullish(),
  passphrase: z.string().nullish(),
  remotePath: z.string().min(1, 'Remote path is required'),
  encoding: z.enum(['utf-8', 'base64']).default('utf-8'),
})

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })

    if (!authResult.success) {
      logger.warn(`[${requestId}] Unauthorized SFTP download attempt: ${authResult.error}`)
      return NextResponse.json(
        { success: false, error: authResult.error || 'Authentication required' },
        { status: 401 }
      )
    }

    logger.info(`[${requestId}] Authenticated SFTP download request via ${authResult.authType}`, {
      userId: authResult.userId,
    })

    const body = await request.json()
    const params = DownloadSchema.parse(body)

    if (!params.password && !params.privateKey) {
      return NextResponse.json(
        { error: 'Either password or privateKey must be provided' },
        { status: 400 }
      )
    }

    if (!isPathSafe(params.remotePath)) {
      logger.warn(`[${requestId}] Path traversal attempt detected in remotePath`)
      return NextResponse.json(
        { error: 'Invalid remote path: path traversal sequences are not allowed' },
        { status: 400 }
      )
    }

    logger.info(`[${requestId}] Connecting to SFTP server ${params.host}:${params.port}`)

    const client = await createSftpConnection({
      host: params.host,
      port: params.port,
      username: params.username,
      password: params.password,
      privateKey: params.privateKey,
      passphrase: params.passphrase,
    })

    try {
      const sftp = await getSftp(client)
      const remotePath = sanitizePath(params.remotePath)

      const stats = await new Promise<{ size: number }>((resolve, reject) => {
        sftp.stat(remotePath, (err, stats) => {
          if (err) {
            if (err.message.includes('No such file')) {
              reject(new Error(`File not found: ${remotePath}`))
            } else {
              reject(err)
            }
          } else {
            resolve(stats)
          }
        })
      })

      const maxSize = 50 * 1024 * 1024
      if (stats.size > maxSize) {
        const sizeMB = (stats.size / (1024 * 1024)).toFixed(2)
        return NextResponse.json(
          { success: false, error: `File size (${sizeMB}MB) exceeds download limit of 50MB` },
          { status: 400 }
        )
      }

      logger.info(`[${requestId}] Downloading file ${remotePath} (${stats.size} bytes)`)

      const chunks: Buffer[] = []
      await new Promise<void>((resolve, reject) => {
        const readStream = sftp.createReadStream(remotePath)

        readStream.on('data', (chunk: Buffer) => {
          chunks.push(chunk)
        })

        readStream.on('end', () => resolve())
        readStream.on('error', reject)
      })

      const buffer = Buffer.concat(chunks)
      const fileName = path.basename(remotePath)

      let content: string
      if (params.encoding === 'base64') {
        content = buffer.toString('base64')
      } else {
        content = buffer.toString('utf-8')
      }

      logger.info(`[${requestId}] Downloaded ${fileName} (${buffer.length} bytes)`)

      return NextResponse.json({
        success: true,
        fileName,
        content,
        size: buffer.length,
        encoding: params.encoding,
        message: `Successfully downloaded ${fileName}`,
      })
    } finally {
      client.end()
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn(`[${requestId}] Invalid request data`, { errors: error.errors })
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    logger.error(`[${requestId}] SFTP download failed:`, error)

    return NextResponse.json({ error: `SFTP download failed: ${errorMessage}` }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/sftp/list/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import {
  createSftpConnection,
  getFileType,
  getSftp,
  isPathSafe,
  parsePermissions,
  sanitizePath,
} from '@/app/api/tools/sftp/utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('SftpListAPI')

const ListSchema = z.object({
  host: z.string().min(1, 'Host is required'),
  port: z.coerce.number().int().positive().default(22),
  username: z.string().min(1, 'Username is required'),
  password: z.string().nullish(),
  privateKey: z.string().nullish(),
  passphrase: z.string().nullish(),
  remotePath: z.string().min(1, 'Remote path is required'),
  detailed: z.boolean().default(false),
})

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })

    if (!authResult.success) {
      logger.warn(`[${requestId}] Unauthorized SFTP list attempt: ${authResult.error}`)
      return NextResponse.json(
        { success: false, error: authResult.error || 'Authentication required' },
        { status: 401 }
      )
    }

    logger.info(`[${requestId}] Authenticated SFTP list request via ${authResult.authType}`, {
      userId: authResult.userId,
    })

    const body = await request.json()
    const params = ListSchema.parse(body)

    if (!params.password && !params.privateKey) {
      return NextResponse.json(
        { error: 'Either password or privateKey must be provided' },
        { status: 400 }
      )
    }

    if (!isPathSafe(params.remotePath)) {
      logger.warn(`[${requestId}] Path traversal attempt detected in remotePath`)
      return NextResponse.json(
        { error: 'Invalid remote path: path traversal sequences are not allowed' },
        { status: 400 }
      )
    }

    logger.info(`[${requestId}] Connecting to SFTP server ${params.host}:${params.port}`)

    const client = await createSftpConnection({
      host: params.host,
      port: params.port,
      username: params.username,
      password: params.password,
      privateKey: params.privateKey,
      passphrase: params.passphrase,
    })

    try {
      const sftp = await getSftp(client)
      const remotePath = sanitizePath(params.remotePath)

      logger.info(`[${requestId}] Listing directory ${remotePath}`)

      const fileList = await new Promise<Array<{ filename: string; longname: string; attrs: any }>>(
        (resolve, reject) => {
          sftp.readdir(remotePath, (err, list) => {
            if (err) {
              if (err.message.includes('No such file')) {
                reject(new Error(`Directory not found: ${remotePath}`))
              } else {
                reject(err)
              }
            } else {
              resolve(list)
            }
          })
        }
      )

      const entries = fileList
        .filter((item) => item.filename !== '.' && item.filename !== '..')
        .map((item) => {
          const entry: {
            name: string
            type: 'file' | 'directory' | 'symlink' | 'other'
            size?: number
            permissions?: string
            modifiedAt?: string
          } = {
            name: item.filename,
            type: getFileType(item.attrs),
          }

          if (params.detailed) {
            entry.size = item.attrs.size
            entry.permissions = parsePermissions(item.attrs.mode)
            if (item.attrs.mtime) {
              entry.modifiedAt = new Date(item.attrs.mtime * 1000).toISOString()
            }
          }

          return entry
        })

      entries.sort((a, b) => {
        if (a.type === 'directory' && b.type !== 'directory') return -1
        if (a.type !== 'directory' && b.type === 'directory') return 1
        return a.name.localeCompare(b.name)
      })

      logger.info(`[${requestId}] Listed ${entries.length} entries in ${remotePath}`)

      return NextResponse.json({
        success: true,
        path: remotePath,
        entries,
        count: entries.length,
        message: `Found ${entries.length} entries in ${remotePath}`,
      })
    } finally {
      client.end()
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn(`[${requestId}] Invalid request data`, { errors: error.errors })
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    logger.error(`[${requestId}] SFTP list failed:`, error)

    return NextResponse.json({ error: `SFTP list failed: ${errorMessage}` }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/sftp/mkdir/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import type { SFTPWrapper } from 'ssh2'
import { z } from 'zod'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import {
  createSftpConnection,
  getSftp,
  isPathSafe,
  sanitizePath,
  sftpExists,
} from '@/app/api/tools/sftp/utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('SftpMkdirAPI')

const MkdirSchema = z.object({
  host: z.string().min(1, 'Host is required'),
  port: z.coerce.number().int().positive().default(22),
  username: z.string().min(1, 'Username is required'),
  password: z.string().nullish(),
  privateKey: z.string().nullish(),
  passphrase: z.string().nullish(),
  remotePath: z.string().min(1, 'Remote path is required'),
  recursive: z.boolean().default(false),
})

/**
 * Creates directory recursively (like mkdir -p)
 */
async function mkdirRecursive(sftp: SFTPWrapper, dirPath: string): Promise<void> {
  const parts = dirPath.split('/').filter(Boolean)
  let currentPath = dirPath.startsWith('/') ? '' : ''

  for (const part of parts) {
    currentPath = currentPath
      ? `${currentPath}/${part}`
      : dirPath.startsWith('/')
        ? `/${part}`
        : part

    const exists = await sftpExists(sftp, currentPath)
    if (!exists) {
      await new Promise<void>((resolve, reject) => {
        sftp.mkdir(currentPath, (err) => {
          if (err && !err.message.includes('already exists')) {
            reject(err)
          } else {
            resolve()
          }
        })
      })
    }
  }
}

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })

    if (!authResult.success) {
      logger.warn(`[${requestId}] Unauthorized SFTP mkdir attempt: ${authResult.error}`)
      return NextResponse.json(
        { success: false, error: authResult.error || 'Authentication required' },
        { status: 401 }
      )
    }

    logger.info(`[${requestId}] Authenticated SFTP mkdir request via ${authResult.authType}`, {
      userId: authResult.userId,
    })

    const body = await request.json()
    const params = MkdirSchema.parse(body)

    if (!params.password && !params.privateKey) {
      return NextResponse.json(
        { error: 'Either password or privateKey must be provided' },
        { status: 400 }
      )
    }

    if (!isPathSafe(params.remotePath)) {
      logger.warn(`[${requestId}] Path traversal attempt detected in remotePath`)
      return NextResponse.json(
        { error: 'Invalid remote path: path traversal sequences are not allowed' },
        { status: 400 }
      )
    }

    logger.info(`[${requestId}] Connecting to SFTP server ${params.host}:${params.port}`)

    const client = await createSftpConnection({
      host: params.host,
      port: params.port,
      username: params.username,
      password: params.password,
      privateKey: params.privateKey,
      passphrase: params.passphrase,
    })

    try {
      const sftp = await getSftp(client)
      const remotePath = sanitizePath(params.remotePath)

      logger.info(
        `[${requestId}] Creating directory ${remotePath} (recursive: ${params.recursive})`
      )

      if (params.recursive) {
        await mkdirRecursive(sftp, remotePath)
      } else {
        const exists = await sftpExists(sftp, remotePath)
        if (exists) {
          return NextResponse.json(
            { error: `Directory already exists: ${remotePath}` },
            { status: 409 }
          )
        }

        await new Promise<void>((resolve, reject) => {
          sftp.mkdir(remotePath, (err) => {
            if (err) {
              if (err.message.includes('No such file')) {
                reject(
                  new Error(
                    'Parent directory does not exist. Use recursive: true to create parent directories.'
                  )
                )
              } else {
                reject(err)
              }
            } else {
              resolve()
            }
          })
        })
      }

      logger.info(`[${requestId}] Successfully created directory ${remotePath}`)

      return NextResponse.json({
        success: true,
        createdPath: remotePath,
        message: `Successfully created directory ${remotePath}`,
      })
    } finally {
      client.end()
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn(`[${requestId}] Invalid request data`, { errors: error.errors })
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    logger.error(`[${requestId}] SFTP mkdir failed:`, error)

    return NextResponse.json({ error: `SFTP mkdir failed: ${errorMessage}` }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/sftp/upload/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { processFilesToUserFiles } from '@/lib/uploads/utils/file-utils'
import { downloadFileFromStorage } from '@/lib/uploads/utils/file-utils.server'
import {
  createSftpConnection,
  getSftp,
  isPathSafe,
  sanitizeFileName,
  sanitizePath,
  sftpExists,
} from '@/app/api/tools/sftp/utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('SftpUploadAPI')

const UploadSchema = z.object({
  host: z.string().min(1, 'Host is required'),
  port: z.coerce.number().int().positive().default(22),
  username: z.string().min(1, 'Username is required'),
  password: z.string().nullish(),
  privateKey: z.string().nullish(),
  passphrase: z.string().nullish(),
  remotePath: z.string().min(1, 'Remote path is required'),
  files: z
    .union([z.array(z.any()), z.string(), z.number(), z.null(), z.undefined()])
    .transform((val) => {
      if (Array.isArray(val)) return val
      if (val === null || val === undefined || val === '') return undefined
      return undefined
    })
    .nullish(),
  fileContent: z.string().nullish(),
  fileName: z.string().nullish(),
  overwrite: z.boolean().default(true),
  permissions: z.string().nullish(),
})

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })

    if (!authResult.success) {
      logger.warn(`[${requestId}] Unauthorized SFTP upload attempt: ${authResult.error}`)
      return NextResponse.json(
        { success: false, error: authResult.error || 'Authentication required' },
        { status: 401 }
      )
    }

    logger.info(`[${requestId}] Authenticated SFTP upload request via ${authResult.authType}`, {
      userId: authResult.userId,
    })

    const body = await request.json()
    const params = UploadSchema.parse(body)

    if (!params.password && !params.privateKey) {
      return NextResponse.json(
        { error: 'Either password or privateKey must be provided' },
        { status: 400 }
      )
    }

    const hasFiles = params.files && params.files.length > 0
    const hasDirectContent = params.fileContent && params.fileName

    if (!hasFiles && !hasDirectContent) {
      return NextResponse.json(
        { error: 'Either files or fileContent with fileName must be provided' },
        { status: 400 }
      )
    }

    if (!isPathSafe(params.remotePath)) {
      logger.warn(`[${requestId}] Path traversal attempt detected in remotePath`)
      return NextResponse.json(
        { error: 'Invalid remote path: path traversal sequences are not allowed' },
        { status: 400 }
      )
    }

    logger.info(`[${requestId}] Connecting to SFTP server ${params.host}:${params.port}`)

    const client = await createSftpConnection({
      host: params.host,
      port: params.port,
      username: params.username,
      password: params.password,
      privateKey: params.privateKey,
      passphrase: params.passphrase,
    })

    try {
      const sftp = await getSftp(client)
      const remotePath = sanitizePath(params.remotePath)
      const uploadedFiles: Array<{ name: string; remotePath: string; size: number }> = []

      if (hasFiles) {
        const rawFiles = params.files!
        logger.info(`[${requestId}] Processing ${rawFiles.length} file(s) for upload`)

        const userFiles = processFilesToUserFiles(rawFiles, requestId, logger)

        const totalSize = userFiles.reduce((sum, file) => sum + file.size, 0)
        const maxSize = 100 * 1024 * 1024

        if (totalSize > maxSize) {
          const sizeMB = (totalSize / (1024 * 1024)).toFixed(2)
          return NextResponse.json(
            { success: false, error: `Total file size (${sizeMB}MB) exceeds limit of 100MB` },
            { status: 400 }
          )
        }

        for (const file of userFiles) {
          try {
            logger.info(
              `[${requestId}] Downloading file for upload: ${file.name} (${file.size} bytes)`
            )
            const buffer = await downloadFileFromStorage(file, requestId, logger)

            const safeFileName = sanitizeFileName(file.name)
            const fullRemotePath = remotePath.endsWith('/')
              ? `${remotePath}${safeFileName}`
              : `${remotePath}/${safeFileName}`

            const sanitizedRemotePath = sanitizePath(fullRemotePath)

            if (!params.overwrite) {
              const exists = await sftpExists(sftp, sanitizedRemotePath)
              if (exists) {
                logger.warn(`[${requestId}] File ${sanitizedRemotePath} already exists, skipping`)
                continue
              }
            }

            await new Promise<void>((resolve, reject) => {
              const writeStream = sftp.createWriteStream(sanitizedRemotePath, {
                mode: params.permissions ? Number.parseInt(params.permissions, 8) : 0o644,
              })

              writeStream.on('error', reject)
              writeStream.on('close', () => resolve())
              writeStream.end(buffer)
            })

            uploadedFiles.push({
              name: safeFileName,
              remotePath: sanitizedRemotePath,
              size: buffer.length,
            })

            logger.info(`[${requestId}] Uploaded ${safeFileName} to ${sanitizedRemotePath}`)
          } catch (error) {
            logger.error(`[${requestId}] Failed to upload file ${file.name}:`, error)
            throw new Error(
              `Failed to upload file "${file.name}": ${error instanceof Error ? error.message : 'Unknown error'}`
            )
          }
        }
      }

      if (hasDirectContent) {
        const safeFileName = sanitizeFileName(params.fileName!)
        const fullRemotePath = remotePath.endsWith('/')
          ? `${remotePath}${safeFileName}`
          : `${remotePath}/${safeFileName}`

        const sanitizedRemotePath = sanitizePath(fullRemotePath)

        if (!params.overwrite) {
          const exists = await sftpExists(sftp, sanitizedRemotePath)
          if (exists) {
            return NextResponse.json(
              { error: 'File already exists and overwrite is disabled' },
              { status: 409 }
            )
          }
        }

        let content: Buffer
        try {
          content = Buffer.from(params.fileContent!, 'base64')
          const reEncoded = content.toString('base64')
          if (reEncoded !== params.fileContent) {
            content = Buffer.from(params.fileContent!, 'utf-8')
          }
        } catch {
          content = Buffer.from(params.fileContent!, 'utf-8')
        }

        await new Promise<void>((resolve, reject) => {
          const writeStream = sftp.createWriteStream(sanitizedRemotePath, {
            mode: params.permissions ? Number.parseInt(params.permissions, 8) : 0o644,
          })

          writeStream.on('error', reject)
          writeStream.on('close', () => resolve())
          writeStream.end(content)
        })

        uploadedFiles.push({
          name: safeFileName,
          remotePath: sanitizedRemotePath,
          size: content.length,
        })

        logger.info(`[${requestId}] Uploaded direct content to ${sanitizedRemotePath}`)
      }

      logger.info(`[${requestId}] SFTP upload completed: ${uploadedFiles.length} file(s)`)

      return NextResponse.json({
        success: true,
        uploadedFiles,
        message: `Successfully uploaded ${uploadedFiles.length} file(s)`,
      })
    } finally {
      client.end()
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn(`[${requestId}] Invalid request data`, { errors: error.errors })
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    logger.error(`[${requestId}] SFTP upload failed:`, error)

    return NextResponse.json({ error: `SFTP upload failed: ${errorMessage}` }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/sharepoint/site/route.ts
Signals: Next.js

```typescript
import { randomUUID } from 'crypto'
import { db } from '@sim/db'
import { account } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { validateMicrosoftGraphId } from '@/lib/core/security/input-validation'
import { createLogger } from '@/lib/logs/console/logger'
import { refreshAccessTokenIfNeeded } from '@/app/api/auth/oauth/utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('SharePointSiteAPI')

export async function GET(request: NextRequest) {
  const requestId = randomUUID().slice(0, 8)

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const credentialId = searchParams.get('credentialId')
    const siteId = searchParams.get('siteId')

    if (!credentialId || !siteId) {
      return NextResponse.json({ error: 'Credential ID and Site ID are required' }, { status: 400 })
    }

    const siteIdValidation = validateMicrosoftGraphId(siteId, 'siteId')
    if (!siteIdValidation.isValid) {
      return NextResponse.json({ error: siteIdValidation.error }, { status: 400 })
    }

    const credentials = await db.select().from(account).where(eq(account.id, credentialId)).limit(1)
    if (!credentials.length) {
      return NextResponse.json({ error: 'Credential not found' }, { status: 404 })
    }

    const credential = credentials[0]
    if (credential.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const accessToken = await refreshAccessTokenIfNeeded(credentialId, session.user.id, requestId)
    if (!accessToken) {
      return NextResponse.json({ error: 'Failed to obtain valid access token' }, { status: 401 })
    }

    let endpoint: string
    if (siteId === 'root') {
      endpoint = 'sites/root'
    } else if (siteId.includes(':')) {
      endpoint = `sites/${siteId}`
    } else if (siteId.includes('groups/')) {
      endpoint = siteId
    } else {
      endpoint = `sites/${siteId}`
    }

    const response = await fetch(
      `https://graph.microsoft.com/v1.0/${endpoint}?$select=id,name,displayName,webUrl,createdDateTime,lastModifiedDateTime`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: 'Unknown error' } }))
      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to fetch site from SharePoint' },
        { status: response.status }
      )
    }

    const site = await response.json()

    const transformedSite = {
      id: site.id,
      name: site.displayName || site.name,
      mimeType: 'application/vnd.microsoft.graph.site',
      webViewLink: site.webUrl,
      createdTime: site.createdDateTime,
      modifiedTime: site.lastModifiedDateTime,
    }

    logger.info(`[${requestId}] Successfully fetched SharePoint site: ${transformedSite.name}`)
    return NextResponse.json({ site: transformedSite }, { status: 200 })
  } catch (error) {
    logger.error(`[${requestId}] Error fetching site from SharePoint`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/sharepoint/sites/route.ts
Signals: Next.js

```typescript
import { randomUUID } from 'crypto'
import { db } from '@sim/db'
import { account } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { createLogger } from '@/lib/logs/console/logger'
import { refreshAccessTokenIfNeeded } from '@/app/api/auth/oauth/utils'
import type { SharepointSite } from '@/tools/sharepoint/types'

export const dynamic = 'force-dynamic'

const logger = createLogger('SharePointSitesAPI')

/**
 * Get SharePoint sites from Microsoft Graph API
 */
export async function GET(request: NextRequest) {
  const requestId = randomUUID().slice(0, 8)

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const credentialId = searchParams.get('credentialId')
    const query = searchParams.get('query') || ''

    if (!credentialId) {
      return NextResponse.json({ error: 'Credential ID is required' }, { status: 400 })
    }

    const credentials = await db.select().from(account).where(eq(account.id, credentialId)).limit(1)
    if (!credentials.length) {
      return NextResponse.json({ error: 'Credential not found' }, { status: 404 })
    }

    const credential = credentials[0]
    if (credential.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const accessToken = await refreshAccessTokenIfNeeded(credentialId, session.user.id, requestId)
    if (!accessToken) {
      return NextResponse.json({ error: 'Failed to obtain valid access token' }, { status: 401 })
    }

    // Build URL for SharePoint sites
    // Use search=* to get all sites the user has access to, or search for specific query
    const searchQuery = query || '*'
    const url = `https://graph.microsoft.com/v1.0/sites?search=${encodeURIComponent(searchQuery)}&$select=id,name,displayName,webUrl,createdDateTime,lastModifiedDateTime&$top=50`

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: 'Unknown error' } }))
      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to fetch sites from SharePoint' },
        { status: response.status }
      )
    }

    const data = await response.json()
    const sites = (data.value || []).map((site: SharepointSite) => ({
      id: site.id,
      name: site.displayName || site.name,
      mimeType: 'application/vnd.microsoft.graph.site',
      webViewLink: site.webUrl,
      createdTime: site.createdDateTime,
      modifiedTime: site.lastModifiedDateTime,
    }))

    logger.info(`[${requestId}] Successfully fetched ${sites.length} SharePoint sites`)
    return NextResponse.json({ files: sites }, { status: 200 })
  } catch (error) {
    logger.error(`[${requestId}] Error fetching sites from SharePoint`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

````
