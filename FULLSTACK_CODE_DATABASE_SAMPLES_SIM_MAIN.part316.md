---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 316
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 316 of 933)

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
Location: sim-main/apps/sim/app/api/tools/ssh/delete-file/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createLogger } from '@/lib/logs/console/logger'
import {
  createSSHConnection,
  escapeShellArg,
  executeSSHCommand,
  sanitizePath,
} from '@/app/api/tools/ssh/utils'

const logger = createLogger('SSHDeleteFileAPI')

const DeleteFileSchema = z.object({
  host: z.string().min(1, 'Host is required'),
  port: z.coerce.number().int().positive().default(22),
  username: z.string().min(1, 'Username is required'),
  password: z.string().nullish(),
  privateKey: z.string().nullish(),
  passphrase: z.string().nullish(),
  path: z.string().min(1, 'Path is required'),
  recursive: z.boolean().default(false),
  force: z.boolean().default(false),
})

export async function POST(request: NextRequest) {
  const requestId = randomUUID().slice(0, 8)

  try {
    const body = await request.json()
    const params = DeleteFileSchema.parse(body)

    // Validate authentication
    if (!params.password && !params.privateKey) {
      return NextResponse.json(
        { error: 'Either password or privateKey must be provided' },
        { status: 400 }
      )
    }

    logger.info(`[${requestId}] Deleting ${params.path} on ${params.host}:${params.port}`)

    const client = await createSSHConnection({
      host: params.host,
      port: params.port,
      username: params.username,
      password: params.password,
      privateKey: params.privateKey,
      passphrase: params.passphrase,
    })

    try {
      const filePath = sanitizePath(params.path)
      const escapedPath = escapeShellArg(filePath)

      // Check if path exists
      const checkResult = await executeSSHCommand(
        client,
        `test -e '${escapedPath}' && echo "exists"`
      )
      if (checkResult.stdout.trim() !== 'exists') {
        return NextResponse.json({ error: `Path does not exist: ${filePath}` }, { status: 404 })
      }

      // Build delete command
      let command: string
      if (params.recursive) {
        command = params.force ? `rm -rf '${escapedPath}'` : `rm -r '${escapedPath}'`
      } else {
        command = params.force ? `rm -f '${escapedPath}'` : `rm '${escapedPath}'`
      }

      const result = await executeSSHCommand(client, command)

      if (result.exitCode !== 0) {
        throw new Error(result.stderr || 'Failed to delete path')
      }

      logger.info(`[${requestId}] Path deleted successfully: ${filePath}`)

      return NextResponse.json({
        deleted: true,
        path: filePath,
        message: `Successfully deleted: ${filePath}`,
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
    logger.error(`[${requestId}] SSH delete file failed:`, error)

    return NextResponse.json({ error: `SSH delete file failed: ${errorMessage}` }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/ssh/download-file/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import path from 'path'
import { type NextRequest, NextResponse } from 'next/server'
import type { Client, SFTPWrapper } from 'ssh2'
import { z } from 'zod'
import { createLogger } from '@/lib/logs/console/logger'
import { createSSHConnection, sanitizePath } from '@/app/api/tools/ssh/utils'

const logger = createLogger('SSHDownloadFileAPI')

const DownloadFileSchema = z.object({
  host: z.string().min(1, 'Host is required'),
  port: z.coerce.number().int().positive().default(22),
  username: z.string().min(1, 'Username is required'),
  password: z.string().nullish(),
  privateKey: z.string().nullish(),
  passphrase: z.string().nullish(),
  remotePath: z.string().min(1, 'Remote path is required'),
})

function getSFTP(client: Client): Promise<SFTPWrapper> {
  return new Promise((resolve, reject) => {
    client.sftp((err, sftp) => {
      if (err) {
        reject(err)
      } else {
        resolve(sftp)
      }
    })
  })
}

export async function POST(request: NextRequest) {
  const requestId = randomUUID().slice(0, 8)

  try {
    const body = await request.json()
    const params = DownloadFileSchema.parse(body)

    // Validate authentication
    if (!params.password && !params.privateKey) {
      return NextResponse.json(
        { error: 'Either password or privateKey must be provided' },
        { status: 400 }
      )
    }

    logger.info(
      `[${requestId}] Downloading file from ${params.host}:${params.port}${params.remotePath}`
    )

    const client = await createSSHConnection({
      host: params.host,
      port: params.port,
      username: params.username,
      password: params.password,
      privateKey: params.privateKey,
      passphrase: params.passphrase,
    })

    try {
      const sftp = await getSFTP(client)
      const remotePath = sanitizePath(params.remotePath)

      // Check if file exists
      const stats = await new Promise<{ size: number }>((resolve, reject) => {
        sftp.stat(remotePath, (err, stats) => {
          if (err) {
            reject(new Error(`File not found: ${remotePath}`))
          } else {
            resolve(stats)
          }
        })
      })

      // Read file content
      const content = await new Promise<Buffer>((resolve, reject) => {
        const chunks: Buffer[] = []
        const readStream = sftp.createReadStream(remotePath)

        readStream.on('data', (chunk: Buffer) => {
          chunks.push(chunk)
        })

        readStream.on('end', () => {
          resolve(Buffer.concat(chunks))
        })

        readStream.on('error', reject)
      })

      const fileName = path.basename(remotePath)

      // Encode content as base64 for binary safety
      const base64Content = content.toString('base64')

      logger.info(`[${requestId}] File downloaded successfully from ${remotePath}`)

      return NextResponse.json({
        downloaded: true,
        content: base64Content,
        fileName: fileName,
        remotePath: remotePath,
        size: stats.size,
        message: `File downloaded successfully from ${remotePath}`,
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
    logger.error(`[${requestId}] SSH file download failed:`, error)

    return NextResponse.json(
      { error: `SSH file download failed: ${errorMessage}` },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/ssh/execute-command/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createLogger } from '@/lib/logs/console/logger'
import { createSSHConnection, executeSSHCommand, sanitizeCommand } from '@/app/api/tools/ssh/utils'

const logger = createLogger('SSHExecuteCommandAPI')

const ExecuteCommandSchema = z.object({
  host: z.string().min(1, 'Host is required'),
  port: z.coerce.number().int().positive().default(22),
  username: z.string().min(1, 'Username is required'),
  password: z.string().nullish(),
  privateKey: z.string().nullish(),
  passphrase: z.string().nullish(),
  command: z.string().min(1, 'Command is required'),
  workingDirectory: z.string().nullish(),
})

export async function POST(request: NextRequest) {
  const requestId = randomUUID().slice(0, 8)

  try {
    const body = await request.json()
    const params = ExecuteCommandSchema.parse(body)

    // Validate authentication
    if (!params.password && !params.privateKey) {
      return NextResponse.json(
        { error: 'Either password or privateKey must be provided' },
        { status: 400 }
      )
    }

    logger.info(`[${requestId}] Executing SSH command on ${params.host}:${params.port}`)

    const client = await createSSHConnection({
      host: params.host,
      port: params.port,
      username: params.username,
      password: params.password,
      privateKey: params.privateKey,
      passphrase: params.passphrase,
    })

    try {
      // Build command with optional working directory
      let command = sanitizeCommand(params.command)
      if (params.workingDirectory) {
        command = `cd "${params.workingDirectory}" && ${command}`
      }

      const result = await executeSSHCommand(client, command)

      logger.info(`[${requestId}] Command executed successfully with exit code ${result.exitCode}`)

      return NextResponse.json({
        stdout: result.stdout,
        stderr: result.stderr,
        exitCode: result.exitCode,
        success: result.exitCode === 0,
        message: `Command executed with exit code ${result.exitCode}`,
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
    logger.error(`[${requestId}] SSH command execution failed:`, error)

    return NextResponse.json(
      { error: `SSH command execution failed: ${errorMessage}` },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/ssh/execute-script/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createLogger } from '@/lib/logs/console/logger'
import { createSSHConnection, escapeShellArg, executeSSHCommand } from '@/app/api/tools/ssh/utils'

const logger = createLogger('SSHExecuteScriptAPI')

const ExecuteScriptSchema = z.object({
  host: z.string().min(1, 'Host is required'),
  port: z.coerce.number().int().positive().default(22),
  username: z.string().min(1, 'Username is required'),
  password: z.string().nullish(),
  privateKey: z.string().nullish(),
  passphrase: z.string().nullish(),
  script: z.string().min(1, 'Script content is required'),
  interpreter: z.string().default('/bin/bash'),
  workingDirectory: z.string().nullish(),
})

export async function POST(request: NextRequest) {
  const requestId = randomUUID().slice(0, 8)

  try {
    const body = await request.json()
    const params = ExecuteScriptSchema.parse(body)

    // Validate authentication
    if (!params.password && !params.privateKey) {
      return NextResponse.json(
        { error: 'Either password or privateKey must be provided' },
        { status: 400 }
      )
    }

    logger.info(`[${requestId}] Executing SSH script on ${params.host}:${params.port}`)

    const client = await createSSHConnection({
      host: params.host,
      port: params.port,
      username: params.username,
      password: params.password,
      privateKey: params.privateKey,
      passphrase: params.passphrase,
    })

    try {
      // Create a temporary script file, execute it, and clean up
      const scriptPath = `/tmp/sim_script_${requestId}.sh`
      const escapedScriptPath = escapeShellArg(scriptPath)
      const escapedInterpreter = escapeShellArg(params.interpreter)

      // Build the command to create, execute, and clean up the script
      // Note: heredoc with quoted delimiter ('SIMEOF') prevents variable expansion
      let command = `cat > '${escapedScriptPath}' << 'SIMEOF'
${params.script}
SIMEOF
chmod +x '${escapedScriptPath}'`

      if (params.workingDirectory) {
        const escapedWorkDir = escapeShellArg(params.workingDirectory)
        command += `
cd '${escapedWorkDir}'`
      }

      command += `
'${escapedInterpreter}' '${escapedScriptPath}'
exit_code=$?
rm -f '${escapedScriptPath}'
exit $exit_code`

      const result = await executeSSHCommand(client, command)

      logger.info(`[${requestId}] Script executed successfully with exit code ${result.exitCode}`)

      return NextResponse.json({
        stdout: result.stdout,
        stderr: result.stderr,
        exitCode: result.exitCode,
        success: result.exitCode === 0,
        scriptPath: scriptPath,
        message: `Script executed with exit code ${result.exitCode}`,
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
    logger.error(`[${requestId}] SSH script execution failed:`, error)

    return NextResponse.json(
      { error: `SSH script execution failed: ${errorMessage}` },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/ssh/get-system-info/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createLogger } from '@/lib/logs/console/logger'
import { createSSHConnection, executeSSHCommand } from '@/app/api/tools/ssh/utils'

const logger = createLogger('SSHGetSystemInfoAPI')

const GetSystemInfoSchema = z.object({
  host: z.string().min(1, 'Host is required'),
  port: z.coerce.number().int().positive().default(22),
  username: z.string().min(1, 'Username is required'),
  password: z.string().nullish(),
  privateKey: z.string().nullish(),
  passphrase: z.string().nullish(),
})

export async function POST(request: NextRequest) {
  const requestId = randomUUID().slice(0, 8)

  try {
    const body = await request.json()
    const params = GetSystemInfoSchema.parse(body)

    // Validate authentication
    if (!params.password && !params.privateKey) {
      return NextResponse.json(
        { error: 'Either password or privateKey must be provided' },
        { status: 400 }
      )
    }

    logger.info(`[${requestId}] Getting system info from ${params.host}:${params.port}`)

    const client = await createSSHConnection({
      host: params.host,
      port: params.port,
      username: params.username,
      password: params.password,
      privateKey: params.privateKey,
      passphrase: params.passphrase,
    })

    try {
      // Get hostname
      const hostnameResult = await executeSSHCommand(client, 'hostname')
      const hostname = hostnameResult.stdout.trim()

      // Get OS info
      const osResult = await executeSSHCommand(client, 'uname -s')
      const os = osResult.stdout.trim()

      // Get architecture
      const archResult = await executeSSHCommand(client, 'uname -m')
      const architecture = archResult.stdout.trim()

      // Get uptime in seconds
      const uptimeResult = await executeSSHCommand(
        client,
        "cat /proc/uptime 2>/dev/null | awk '{print int($1)}' || sysctl -n kern.boottime 2>/dev/null | awk '{print int(($(date +%s)) - $4)}'"
      )
      const uptime = Number.parseInt(uptimeResult.stdout.trim()) || 0

      // Get memory info
      const memoryResult = await executeSSHCommand(
        client,
        "free -b 2>/dev/null | awk '/Mem:/ {print $2, $7, $3}' || vm_stat 2>/dev/null | awk '/Pages free|Pages active|Pages speculative|Pages wired|page size/ {gsub(/[^0-9]/, \"\"); print}'"
      )
      const memParts = memoryResult.stdout.trim().split(/\s+/)
      let memory = { total: 0, free: 0, used: 0 }
      if (memParts.length >= 3) {
        memory = {
          total: Number.parseInt(memParts[0]) || 0,
          free: Number.parseInt(memParts[1]) || 0,
          used: Number.parseInt(memParts[2]) || 0,
        }
      }

      // Get disk space
      const diskResult = await executeSSHCommand(
        client,
        "df -B1 / 2>/dev/null | awk 'NR==2 {print $2, $4, $3}' || df -k / 2>/dev/null | awk 'NR==2 {print $2*1024, $4*1024, $3*1024}'"
      )
      const diskParts = diskResult.stdout.trim().split(/\s+/)
      let diskSpace = { total: 0, free: 0, used: 0 }
      if (diskParts.length >= 3) {
        diskSpace = {
          total: Number.parseInt(diskParts[0]) || 0,
          free: Number.parseInt(diskParts[1]) || 0,
          used: Number.parseInt(diskParts[2]) || 0,
        }
      }

      logger.info(`[${requestId}] System info retrieved successfully`)

      return NextResponse.json({
        hostname,
        os,
        architecture,
        uptime,
        memory,
        diskSpace,
        message: `System info retrieved for ${hostname}`,
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
    logger.error(`[${requestId}] SSH get system info failed:`, error)

    return NextResponse.json(
      { error: `SSH get system info failed: ${errorMessage}` },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/ssh/list-directory/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import type { Client, FileEntry, SFTPWrapper } from 'ssh2'
import { z } from 'zod'
import { createLogger } from '@/lib/logs/console/logger'
import {
  createSSHConnection,
  getFileType,
  parsePermissions,
  sanitizePath,
} from '@/app/api/tools/ssh/utils'

const logger = createLogger('SSHListDirectoryAPI')

const ListDirectorySchema = z.object({
  host: z.string().min(1, 'Host is required'),
  port: z.coerce.number().int().positive().default(22),
  username: z.string().min(1, 'Username is required'),
  password: z.string().nullish(),
  privateKey: z.string().nullish(),
  passphrase: z.string().nullish(),
  path: z.string().min(1, 'Path is required'),
  detailed: z.boolean().default(true),
  recursive: z.boolean().default(false),
})

function getSFTP(client: Client): Promise<SFTPWrapper> {
  return new Promise((resolve, reject) => {
    client.sftp((err, sftp) => {
      if (err) {
        reject(err)
      } else {
        resolve(sftp)
      }
    })
  })
}

interface FileInfo {
  name: string
  type: 'file' | 'directory' | 'symlink' | 'other'
  size: number
  permissions: string
  modified: string
}

async function listDir(sftp: SFTPWrapper, dirPath: string): Promise<FileEntry[]> {
  return new Promise((resolve, reject) => {
    sftp.readdir(dirPath, (err, list) => {
      if (err) {
        reject(err)
      } else {
        resolve(list)
      }
    })
  })
}

export async function POST(request: NextRequest) {
  const requestId = randomUUID().slice(0, 8)

  try {
    const body = await request.json()
    const params = ListDirectorySchema.parse(body)

    // Validate authentication
    if (!params.password && !params.privateKey) {
      return NextResponse.json(
        { error: 'Either password or privateKey must be provided' },
        { status: 400 }
      )
    }

    logger.info(`[${requestId}] Listing directory ${params.path} on ${params.host}:${params.port}`)

    const client = await createSSHConnection({
      host: params.host,
      port: params.port,
      username: params.username,
      password: params.password,
      privateKey: params.privateKey,
      passphrase: params.passphrase,
    })

    try {
      const sftp = await getSFTP(client)
      const dirPath = sanitizePath(params.path)

      const list = await listDir(sftp, dirPath)

      const entries: FileInfo[] = list.map((entry) => ({
        name: entry.filename,
        type: getFileType(entry.attrs),
        size: entry.attrs.size,
        permissions: parsePermissions(entry.attrs.mode),
        modified: new Date((entry.attrs.mtime || 0) * 1000).toISOString(),
      }))

      const totalFiles = entries.filter((e) => e.type === 'file').length
      const totalDirectories = entries.filter((e) => e.type === 'directory').length

      logger.info(
        `[${requestId}] Directory listed successfully: ${totalFiles} files, ${totalDirectories} directories`
      )

      return NextResponse.json({
        entries,
        totalFiles,
        totalDirectories,
        message: `Found ${totalFiles} files and ${totalDirectories} directories`,
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
    logger.error(`[${requestId}] SSH list directory failed:`, error)

    return NextResponse.json(
      { error: `SSH list directory failed: ${errorMessage}` },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/ssh/move-rename/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createLogger } from '@/lib/logs/console/logger'
import {
  createSSHConnection,
  escapeShellArg,
  executeSSHCommand,
  sanitizePath,
} from '@/app/api/tools/ssh/utils'

const logger = createLogger('SSHMoveRenameAPI')

const MoveRenameSchema = z.object({
  host: z.string().min(1, 'Host is required'),
  port: z.coerce.number().int().positive().default(22),
  username: z.string().min(1, 'Username is required'),
  password: z.string().nullish(),
  privateKey: z.string().nullish(),
  passphrase: z.string().nullish(),
  sourcePath: z.string().min(1, 'Source path is required'),
  destinationPath: z.string().min(1, 'Destination path is required'),
  overwrite: z.boolean().default(false),
})

export async function POST(request: NextRequest) {
  const requestId = randomUUID().slice(0, 8)

  try {
    const body = await request.json()
    const params = MoveRenameSchema.parse(body)

    if (!params.password && !params.privateKey) {
      return NextResponse.json(
        { error: 'Either password or privateKey must be provided' },
        { status: 400 }
      )
    }

    logger.info(
      `[${requestId}] Moving ${params.sourcePath} to ${params.destinationPath} on ${params.host}:${params.port}`
    )

    const client = await createSSHConnection({
      host: params.host,
      port: params.port,
      username: params.username,
      password: params.password,
      privateKey: params.privateKey,
      passphrase: params.passphrase,
    })

    try {
      const sourcePath = sanitizePath(params.sourcePath)
      const destPath = sanitizePath(params.destinationPath)
      const escapedSource = escapeShellArg(sourcePath)
      const escapedDest = escapeShellArg(destPath)

      const sourceCheck = await executeSSHCommand(
        client,
        `test -e '${escapedSource}' && echo "exists"`
      )
      if (sourceCheck.stdout.trim() !== 'exists') {
        return NextResponse.json(
          { error: `Source path does not exist: ${sourcePath}` },
          { status: 404 }
        )
      }

      if (!params.overwrite) {
        const destCheck = await executeSSHCommand(
          client,
          `test -e '${escapedDest}' && echo "exists"`
        )
        if (destCheck.stdout.trim() === 'exists') {
          return NextResponse.json(
            { error: `Destination already exists and overwrite is disabled: ${destPath}` },
            { status: 409 }
          )
        }
      }

      const command = params.overwrite
        ? `mv -f '${escapedSource}' '${escapedDest}'`
        : `mv '${escapedSource}' '${escapedDest}'`
      const result = await executeSSHCommand(client, command)

      if (result.exitCode !== 0) {
        throw new Error(result.stderr || 'Failed to move/rename')
      }

      logger.info(`[${requestId}] Successfully moved ${sourcePath} to ${destPath}`)

      return NextResponse.json({
        success: true,
        sourcePath,
        destinationPath: destPath,
        message: `Successfully moved ${sourcePath} to ${destPath}`,
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
    logger.error(`[${requestId}] SSH move/rename failed:`, error)

    return NextResponse.json({ error: `SSH move/rename failed: ${errorMessage}` }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/ssh/read-file-content/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import type { Client, SFTPWrapper } from 'ssh2'
import { z } from 'zod'
import { createLogger } from '@/lib/logs/console/logger'
import { createSSHConnection, sanitizePath } from '@/app/api/tools/ssh/utils'

const logger = createLogger('SSHReadFileContentAPI')

const ReadFileContentSchema = z.object({
  host: z.string().min(1, 'Host is required'),
  port: z.coerce.number().int().positive().default(22),
  username: z.string().min(1, 'Username is required'),
  password: z.string().nullish(),
  privateKey: z.string().nullish(),
  passphrase: z.string().nullish(),
  path: z.string().min(1, 'Path is required'),
  encoding: z.string().default('utf-8'),
  maxSize: z.coerce.number().default(10), // MB
})

function getSFTP(client: Client): Promise<SFTPWrapper> {
  return new Promise((resolve, reject) => {
    client.sftp((err, sftp) => {
      if (err) {
        reject(err)
      } else {
        resolve(sftp)
      }
    })
  })
}

export async function POST(request: NextRequest) {
  const requestId = randomUUID().slice(0, 8)

  try {
    const body = await request.json()
    const params = ReadFileContentSchema.parse(body)

    if (!params.password && !params.privateKey) {
      return NextResponse.json(
        { error: 'Either password or privateKey must be provided' },
        { status: 400 }
      )
    }

    logger.info(
      `[${requestId}] Reading file content from ${params.path} on ${params.host}:${params.port}`
    )

    const client = await createSSHConnection({
      host: params.host,
      port: params.port,
      username: params.username,
      password: params.password,
      privateKey: params.privateKey,
      passphrase: params.passphrase,
    })

    try {
      const sftp = await getSFTP(client)
      const filePath = sanitizePath(params.path)
      const maxBytes = params.maxSize * 1024 * 1024 // Convert MB to bytes

      const stats = await new Promise<{ size: number }>((resolve, reject) => {
        sftp.stat(filePath, (err, stats) => {
          if (err) {
            reject(new Error(`File not found: ${filePath}`))
          } else {
            resolve(stats)
          }
        })
      })

      if (stats.size > maxBytes) {
        return NextResponse.json(
          { error: `File size (${stats.size} bytes) exceeds maximum allowed (${maxBytes} bytes)` },
          { status: 400 }
        )
      }

      const content = await new Promise<string>((resolve, reject) => {
        const chunks: Buffer[] = []
        const readStream = sftp.createReadStream(filePath)

        readStream.on('data', (chunk: Buffer) => {
          chunks.push(chunk)
        })

        readStream.on('end', () => {
          const buffer = Buffer.concat(chunks)
          resolve(buffer.toString(params.encoding as BufferEncoding))
        })

        readStream.on('error', reject)
      })

      const lines = content.split('\n').length

      logger.info(
        `[${requestId}] File content read successfully: ${stats.size} bytes, ${lines} lines`
      )

      return NextResponse.json({
        content,
        size: stats.size,
        lines,
        path: filePath,
        message: `File read successfully: ${stats.size} bytes, ${lines} lines`,
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
    logger.error(`[${requestId}] SSH read file content failed:`, error)

    return NextResponse.json(
      { error: `SSH read file content failed: ${errorMessage}` },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/ssh/upload-file/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import type { Client, SFTPWrapper } from 'ssh2'
import { z } from 'zod'
import { createLogger } from '@/lib/logs/console/logger'
import { createSSHConnection, sanitizePath } from '@/app/api/tools/ssh/utils'

const logger = createLogger('SSHUploadFileAPI')

const UploadFileSchema = z.object({
  host: z.string().min(1, 'Host is required'),
  port: z.coerce.number().int().positive().default(22),
  username: z.string().min(1, 'Username is required'),
  password: z.string().nullish(),
  privateKey: z.string().nullish(),
  passphrase: z.string().nullish(),
  fileContent: z.string().min(1, 'File content is required'),
  fileName: z.string().min(1, 'File name is required'),
  remotePath: z.string().min(1, 'Remote path is required'),
  permissions: z.string().nullish(),
  overwrite: z.boolean().default(true),
})

function getSFTP(client: Client): Promise<SFTPWrapper> {
  return new Promise((resolve, reject) => {
    client.sftp((err, sftp) => {
      if (err) {
        reject(err)
      } else {
        resolve(sftp)
      }
    })
  })
}

export async function POST(request: NextRequest) {
  const requestId = randomUUID().slice(0, 8)

  try {
    const body = await request.json()
    const params = UploadFileSchema.parse(body)

    if (!params.password && !params.privateKey) {
      return NextResponse.json(
        { error: 'Either password or privateKey must be provided' },
        { status: 400 }
      )
    }

    logger.info(
      `[${requestId}] Uploading file to ${params.host}:${params.port}${params.remotePath}`
    )

    const client = await createSSHConnection({
      host: params.host,
      port: params.port,
      username: params.username,
      password: params.password,
      privateKey: params.privateKey,
      passphrase: params.passphrase,
    })

    try {
      const sftp = await getSFTP(client)
      const remotePath = sanitizePath(params.remotePath)

      if (!params.overwrite) {
        const exists = await new Promise<boolean>((resolve) => {
          sftp.stat(remotePath, (err) => {
            resolve(!err)
          })
        })

        if (exists) {
          return NextResponse.json(
            { error: 'File already exists and overwrite is disabled' },
            { status: 409 }
          )
        }
      }

      let content: Buffer
      try {
        content = Buffer.from(params.fileContent, 'base64')
        const reEncoded = content.toString('base64')
        if (reEncoded !== params.fileContent) {
          content = Buffer.from(params.fileContent, 'utf-8')
        }
      } catch {
        content = Buffer.from(params.fileContent, 'utf-8')
      }

      await new Promise<void>((resolve, reject) => {
        const writeStream = sftp.createWriteStream(remotePath, {
          mode: params.permissions ? Number.parseInt(params.permissions, 8) : 0o644,
        })

        writeStream.on('error', reject)
        writeStream.on('close', () => resolve())

        writeStream.end(content)
      })

      logger.info(`[${requestId}] File uploaded successfully to ${remotePath}`)

      return NextResponse.json({
        uploaded: true,
        remotePath: remotePath,
        size: content.length,
        message: `File uploaded successfully to ${remotePath}`,
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
    logger.error(`[${requestId}] SSH file upload failed:`, error)

    return NextResponse.json({ error: `SSH file upload failed: ${errorMessage}` }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/ssh/write-file-content/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import type { Client, SFTPWrapper } from 'ssh2'
import { z } from 'zod'
import { createLogger } from '@/lib/logs/console/logger'
import { createSSHConnection, sanitizePath } from '@/app/api/tools/ssh/utils'

const logger = createLogger('SSHWriteFileContentAPI')

const WriteFileContentSchema = z.object({
  host: z.string().min(1, 'Host is required'),
  port: z.coerce.number().int().positive().default(22),
  username: z.string().min(1, 'Username is required'),
  password: z.string().nullish(),
  privateKey: z.string().nullish(),
  passphrase: z.string().nullish(),
  path: z.string().min(1, 'Path is required'),
  content: z.string(),
  mode: z.enum(['overwrite', 'append', 'create']).default('overwrite'),
  permissions: z.string().nullish(),
})

function getSFTP(client: Client): Promise<SFTPWrapper> {
  return new Promise((resolve, reject) => {
    client.sftp((err, sftp) => {
      if (err) {
        reject(err)
      } else {
        resolve(sftp)
      }
    })
  })
}

export async function POST(request: NextRequest) {
  const requestId = randomUUID().slice(0, 8)

  try {
    const body = await request.json()
    const params = WriteFileContentSchema.parse(body)

    // Validate authentication
    if (!params.password && !params.privateKey) {
      return NextResponse.json(
        { error: 'Either password or privateKey must be provided' },
        { status: 400 }
      )
    }

    logger.info(
      `[${requestId}] Writing file content to ${params.path} on ${params.host}:${params.port} (mode: ${params.mode})`
    )

    const client = await createSSHConnection({
      host: params.host,
      port: params.port,
      username: params.username,
      password: params.password,
      privateKey: params.privateKey,
      passphrase: params.passphrase,
    })

    try {
      const sftp = await getSFTP(client)
      const filePath = sanitizePath(params.path)

      // Check if file exists for 'create' mode
      if (params.mode === 'create') {
        const exists = await new Promise<boolean>((resolve) => {
          sftp.stat(filePath, (err) => {
            resolve(!err)
          })
        })

        if (exists) {
          return NextResponse.json(
            { error: `File already exists and mode is 'create': ${filePath}` },
            { status: 409 }
          )
        }
      }

      // Handle append mode by reading existing content first
      let finalContent = params.content
      if (params.mode === 'append') {
        const existingContent = await new Promise<string>((resolve) => {
          const chunks: Buffer[] = []
          const readStream = sftp.createReadStream(filePath)

          readStream.on('data', (chunk: Buffer) => {
            chunks.push(chunk)
          })

          readStream.on('end', () => {
            resolve(Buffer.concat(chunks).toString('utf-8'))
          })

          readStream.on('error', () => {
            resolve('')
          })
        })
        finalContent = existingContent + params.content
      }

      // Write file
      const fileMode = params.permissions ? Number.parseInt(params.permissions, 8) : 0o644
      await new Promise<void>((resolve, reject) => {
        const writeStream = sftp.createWriteStream(filePath, { mode: fileMode })

        writeStream.on('error', reject)
        writeStream.on('close', () => resolve())

        writeStream.end(Buffer.from(finalContent, 'utf-8'))
      })

      // Get final file size
      const stats = await new Promise<{ size: number }>((resolve, reject) => {
        sftp.stat(filePath, (err, stats) => {
          if (err) reject(err)
          else resolve(stats)
        })
      })

      logger.info(`[${requestId}] File written successfully: ${stats.size} bytes`)

      return NextResponse.json({
        written: true,
        path: filePath,
        size: stats.size,
        message: `File written successfully: ${stats.size} bytes`,
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
    logger.error(`[${requestId}] SSH write file content failed:`, error)

    return NextResponse.json(
      { error: `SSH write file content failed: ${errorMessage}` },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

````
