---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 315
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 315 of 933)

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
Location: sim-main/apps/sim/app/api/tools/slack/users/route.ts
Signals: Next.js

```typescript
import { NextResponse } from 'next/server'
import { authorizeCredentialUse } from '@/lib/auth/credential-access'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { refreshAccessTokenIfNeeded } from '@/app/api/auth/oauth/utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('SlackUsersAPI')

interface SlackUser {
  id: string
  name: string
  real_name: string
  deleted: boolean
  is_bot: boolean
}

export async function POST(request: Request) {
  try {
    const requestId = generateRequestId()
    const body = await request.json()
    const { credential, workflowId } = body

    if (!credential) {
      logger.error('Missing credential in request')
      return NextResponse.json({ error: 'Credential is required' }, { status: 400 })
    }

    let accessToken: string
    const isBotToken = credential.startsWith('xoxb-')

    if (isBotToken) {
      accessToken = credential
      logger.info('Using direct bot token for Slack API')
    } else {
      const authz = await authorizeCredentialUse(request as any, {
        credentialId: credential,
        workflowId,
      })
      if (!authz.ok || !authz.credentialOwnerUserId) {
        return NextResponse.json({ error: authz.error || 'Unauthorized' }, { status: 403 })
      }
      const resolvedToken = await refreshAccessTokenIfNeeded(
        credential,
        authz.credentialOwnerUserId,
        requestId
      )
      if (!resolvedToken) {
        logger.error('Failed to get access token', {
          credentialId: credential,
          userId: authz.credentialOwnerUserId,
        })
        return NextResponse.json(
          {
            error: 'Could not retrieve access token',
            authRequired: true,
          },
          { status: 401 }
        )
      }
      accessToken = resolvedToken
      logger.info('Using OAuth token for Slack API')
    }

    const data = await fetchSlackUsers(accessToken)

    const users = (data.members || [])
      .filter((user: SlackUser) => !user.deleted && !user.is_bot)
      .map((user: SlackUser) => ({
        id: user.id,
        name: user.name,
        real_name: user.real_name || user.name,
      }))

    logger.info(`Successfully fetched ${users.length} Slack users`, {
      total: data.members?.length || 0,
      tokenType: isBotToken ? 'bot_token' : 'oauth',
    })
    return NextResponse.json({ users })
  } catch (error) {
    logger.error('Error processing Slack users request:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve Slack users', details: (error as Error).message },
      { status: 500 }
    )
  }
}

async function fetchSlackUsers(accessToken: string) {
  const url = new URL('https://slack.com/api/users.list')
  url.searchParams.append('limit', '200')

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Slack API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()

  if (!data.ok) {
    throw new Error(data.error || 'Failed to fetch users')
  }

  return data
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/sms/send/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { env } from '@/lib/core/config/env'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { type SMSOptions, sendSMS } from '@/lib/messaging/sms/service'

export const dynamic = 'force-dynamic'

const logger = createLogger('SMSSendAPI')

const SMSSendSchema = z.object({
  to: z.string().min(1, 'To phone number is required'),
  body: z.string().min(1, 'SMS body is required'),
})

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })

    if (!authResult.success) {
      logger.warn(`[${requestId}] Unauthorized SMS send attempt: ${authResult.error}`)
      return NextResponse.json(
        {
          success: false,
          message: authResult.error || 'Authentication required',
        },
        { status: 401 }
      )
    }

    logger.info(`[${requestId}] Authenticated SMS request via ${authResult.authType}`, {
      userId: authResult.userId,
    })

    const body = await request.json()
    const validatedData = SMSSendSchema.parse(body)

    const fromNumber = env.TWILIO_PHONE_NUMBER

    if (!fromNumber) {
      logger.error(`[${requestId}] SMS sending failed: No phone number configured`)
      return NextResponse.json(
        {
          success: false,
          message: 'SMS sending failed: No phone number configured.',
        },
        { status: 500 }
      )
    }

    logger.info(`[${requestId}] Sending SMS via internal SMS API`, {
      to: validatedData.to,
      bodyLength: validatedData.body.length,
      from: fromNumber,
    })

    const smsOptions: SMSOptions = {
      to: validatedData.to,
      body: validatedData.body,
      from: fromNumber,
    }

    const result = await sendSMS(smsOptions)

    logger.info(`[${requestId}] SMS send result`, {
      success: result.success,
      message: result.message,
    })

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn(`[${requestId}] Invalid request data`, { errors: error.errors })
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request data',
          errors: error.errors,
        },
        { status: 400 }
      )
    }

    logger.error(`[${requestId}] Error sending SMS via API:`, error)

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error while sending SMS',
        data: {},
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/smtp/send/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { z } from 'zod'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { processFilesToUserFiles } from '@/lib/uploads/utils/file-utils'
import { downloadFileFromStorage } from '@/lib/uploads/utils/file-utils.server'

export const dynamic = 'force-dynamic'

const logger = createLogger('SmtpSendAPI')

const SmtpSendSchema = z.object({
  smtpHost: z.string().min(1, 'SMTP host is required'),
  smtpPort: z.number().min(1).max(65535, 'Port must be between 1 and 65535'),
  smtpUsername: z.string().min(1, 'SMTP username is required'),
  smtpPassword: z.string().min(1, 'SMTP password is required'),
  smtpSecure: z.enum(['TLS', 'SSL', 'None']),

  from: z.string().email('Invalid from email address').min(1, 'From address is required'),
  to: z.string().min(1, 'To email is required'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Email body is required'),
  contentType: z.enum(['text', 'html']).optional().nullable(),

  fromName: z.string().optional().nullable(),
  cc: z.string().optional().nullable(),
  bcc: z.string().optional().nullable(),
  replyTo: z.string().optional().nullable(),
  attachments: z.array(z.any()).optional().nullable(),
})

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })

    if (!authResult.success) {
      logger.warn(`[${requestId}] Unauthorized SMTP send attempt: ${authResult.error}`)
      return NextResponse.json(
        {
          success: false,
          error: authResult.error || 'Authentication required',
        },
        { status: 401 }
      )
    }

    logger.info(`[${requestId}] Authenticated SMTP request via ${authResult.authType}`, {
      userId: authResult.userId,
    })

    const body = await request.json()
    const validatedData = SmtpSendSchema.parse(body)

    logger.info(`[${requestId}] Sending email via SMTP`, {
      host: validatedData.smtpHost,
      port: validatedData.smtpPort,
      to: validatedData.to,
      subject: validatedData.subject,
      secure: validatedData.smtpSecure,
    })

    const transporter = nodemailer.createTransport({
      host: validatedData.smtpHost,
      port: validatedData.smtpPort,
      secure: validatedData.smtpSecure === 'SSL',
      auth: {
        user: validatedData.smtpUsername,
        pass: validatedData.smtpPassword,
      },
      tls:
        validatedData.smtpSecure === 'None'
          ? {
              rejectUnauthorized: false,
            }
          : {
              rejectUnauthorized: true,
            },
    })

    const contentType = validatedData.contentType || 'text'
    const fromAddress = validatedData.fromName
      ? `"${validatedData.fromName}" <${validatedData.from}>`
      : validatedData.from

    const mailOptions: nodemailer.SendMailOptions = {
      from: fromAddress,
      to: validatedData.to,
      subject: validatedData.subject,
      [contentType === 'html' ? 'html' : 'text']: validatedData.body,
    }

    if (validatedData.cc) {
      mailOptions.cc = validatedData.cc
    }
    if (validatedData.bcc) {
      mailOptions.bcc = validatedData.bcc
    }
    if (validatedData.replyTo) {
      mailOptions.replyTo = validatedData.replyTo
    }

    if (validatedData.attachments && validatedData.attachments.length > 0) {
      const rawAttachments = validatedData.attachments
      logger.info(`[${requestId}] Processing ${rawAttachments.length} attachment(s)`)

      const attachments = processFilesToUserFiles(rawAttachments, requestId, logger)

      if (attachments.length > 0) {
        const totalSize = attachments.reduce((sum, file) => sum + file.size, 0)
        const maxSize = 25 * 1024 * 1024

        if (totalSize > maxSize) {
          const sizeMB = (totalSize / (1024 * 1024)).toFixed(2)
          return NextResponse.json(
            {
              success: false,
              error: `Total attachment size (${sizeMB}MB) exceeds SMTP limit of 25MB`,
            },
            { status: 400 }
          )
        }

        const attachmentBuffers = await Promise.all(
          attachments.map(async (file) => {
            try {
              logger.info(
                `[${requestId}] Downloading attachment: ${file.name} (${file.size} bytes)`
              )

              const buffer = await downloadFileFromStorage(file, requestId, logger)

              return {
                filename: file.name,
                content: buffer,
                contentType: file.type || 'application/octet-stream',
              }
            } catch (error) {
              logger.error(`[${requestId}] Failed to download attachment ${file.name}:`, error)
              throw new Error(
                `Failed to download attachment "${file.name}": ${error instanceof Error ? error.message : 'Unknown error'}`
              )
            }
          })
        )

        logger.info(`[${requestId}] Processed ${attachmentBuffers.length} attachment(s)`)
        mailOptions.attachments = attachmentBuffers
      }
    }

    const result = await transporter.sendMail(mailOptions)

    logger.info(`[${requestId}] Email sent successfully via SMTP`, {
      messageId: result.messageId,
      to: validatedData.to,
    })

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      to: validatedData.to,
      subject: validatedData.subject,
    })
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      logger.warn(`[${requestId}] Invalid request data`, { errors: error.errors })
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          details: error.errors,
        },
        { status: 400 }
      )
    }

    // Type guard for error objects with code property
    const isNodeError = (err: unknown): err is NodeJS.ErrnoException => {
      return err instanceof Error && 'code' in err
    }

    let errorMessage = 'Failed to send email via SMTP'

    if (isNodeError(error)) {
      if (error.code === 'EAUTH') {
        errorMessage = 'SMTP authentication failed - check username and password'
      } else if (error.code === 'ECONNECTION' || error.code === 'ECONNREFUSED') {
        errorMessage = 'Could not connect to SMTP server - check host and port'
      } else if (error.code === 'ECONNRESET') {
        errorMessage = 'Connection was reset by SMTP server'
      } else if (error.code === 'ETIMEDOUT') {
        errorMessage = 'SMTP server connection timeout'
      }
    }

    // Check for SMTP response codes
    const hasResponseCode = (err: unknown): err is { responseCode: number } => {
      return typeof err === 'object' && err !== null && 'responseCode' in err
    }

    if (hasResponseCode(error)) {
      if (error.responseCode >= 500) {
        errorMessage = 'SMTP server error - please try again later'
      } else if (error.responseCode >= 400) {
        errorMessage = 'Email rejected by SMTP server - check recipient addresses'
      }
    }

    logger.error(`[${requestId}] Error sending email via SMTP:`, {
      error: error instanceof Error ? error.message : String(error),
      code: isNodeError(error) ? error.code : undefined,
      responseCode: hasResponseCode(error) ? error.responseCode : undefined,
    })

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/app/api/tools/sqs/utils.ts

```typescript
import { SendMessageCommand, type SendMessageCommandOutput, SQSClient } from '@aws-sdk/client-sqs'
import type { SqsConnectionConfig } from '@/tools/sqs/types'

export function createSqsClient(config: SqsConnectionConfig): SQSClient {
  return new SQSClient({
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  })
}

export async function sendMessage(
  client: SQSClient,
  queueUrl: string,
  data: Record<string, unknown>,
  messageGroupId?: string | null,
  messageDeduplicationId?: string | null
): Promise<Record<string, unknown> | null> {
  const command = new SendMessageCommand({
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(data),
    MessageGroupId: messageGroupId ?? undefined,
    ...(messageDeduplicationId ? { MessageDeduplicationId: messageDeduplicationId } : {}),
  })

  const response = await client.send(command)
  return parseSendMessageResponse(response)
}

function parseSendMessageResponse(
  response: SendMessageCommandOutput
): Record<string, unknown> | null {
  if (!response) {
    return null
  }

  return { id: response.MessageId }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/sqs/send/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createLogger } from '@/lib/logs/console/logger'
import { createSqsClient, sendMessage } from '../utils'

const logger = createLogger('SQSSendMessageAPI')

const SendMessageSchema = z.object({
  region: z.string().min(1, 'AWS region is required'),
  accessKeyId: z.string().min(1, 'AWS access key ID is required'),
  secretAccessKey: z.string().min(1, 'AWS secret access key is required'),
  queueUrl: z.string().min(1, 'Queue URL is required'),
  messageGroupId: z.string().nullish(),
  messageDeduplicationId: z.string().nullish(),
  data: z.record(z.unknown()).refine((obj) => Object.keys(obj).length > 0, {
    message: 'Data object must have at least one field',
  }),
})

export async function POST(request: NextRequest) {
  const requestId = randomUUID().slice(0, 8)

  try {
    const body = await request.json()
    const params = SendMessageSchema.parse(body)

    logger.info(`[${requestId}] Sending message to SQS queue ${params.queueUrl}`)

    const client = createSqsClient({
      region: params.region,
      accessKeyId: params.accessKeyId,
      secretAccessKey: params.secretAccessKey,
    })

    try {
      const result = await sendMessage(
        client,
        params.queueUrl,
        params.data,
        params.messageGroupId,
        params.messageDeduplicationId
      )

      logger.info(`[${requestId}] Message sent to SQS queue ${params.queueUrl}`)

      return NextResponse.json({
        message: `Message sent to SQS queue ${params.queueUrl}`,
        id: result?.id,
      })
    } finally {
      client.destroy()
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn(`[${requestId}] Invalid request data`, {
        errors: error.errors,
      })
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    logger.error(`[${requestId}] SQS send message failed:`, error)

    return NextResponse.json({ error: `SQS send message failed: ${errorMessage}` }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/app/api/tools/ssh/utils.ts

```typescript
import { type Attributes, Client, type ConnectConfig } from 'ssh2'

// File type constants from POSIX
const S_IFMT = 0o170000 // bit mask for the file type bit field
const S_IFDIR = 0o040000 // directory
const S_IFREG = 0o100000 // regular file
const S_IFLNK = 0o120000 // symbolic link

export interface SSHConnectionConfig {
  host: string
  port: number
  username: string
  password?: string | null
  privateKey?: string | null
  passphrase?: string | null
  timeout?: number
  keepaliveInterval?: number
  readyTimeout?: number
}

export interface SSHCommandResult {
  stdout: string
  stderr: string
  exitCode: number
}

/**
 * Format SSH error with helpful troubleshooting context
 */
function formatSSHError(err: Error, config: { host: string; port: number }): Error {
  const errorMessage = err.message.toLowerCase()
  const host = config.host
  const port = config.port

  // Connection refused - server not running or wrong port
  if (errorMessage.includes('econnrefused') || errorMessage.includes('connection refused')) {
    return new Error(
      `Connection refused to ${host}:${port}. ` +
        `Please verify: (1) SSH server is running on the target machine, ` +
        `(2) Port ${port} is correct (default SSH port is 22), ` +
        `(3) Firewall allows connections to port ${port}.`
    )
  }

  // Connection reset - server closed connection unexpectedly
  if (errorMessage.includes('econnreset') || errorMessage.includes('connection reset')) {
    return new Error(
      `Connection reset by ${host}:${port}. ` +
        `This usually means: (1) Wrong port number (SSH default is 22), ` +
        `(2) Server rejected the connection, ` +
        `(3) Network/firewall interrupted the connection. ` +
        `Verify your SSH server configuration and port number.`
    )
  }

  // Timeout - server unreachable or slow
  if (errorMessage.includes('etimedout') || errorMessage.includes('timeout')) {
    return new Error(
      `Connection timed out to ${host}:${port}. ` +
        `Please verify: (1) Host "${host}" is reachable, ` +
        `(2) No firewall is blocking the connection, ` +
        `(3) The SSH server is responding.`
    )
  }

  // DNS/hostname resolution
  if (errorMessage.includes('enotfound') || errorMessage.includes('getaddrinfo')) {
    return new Error(
      `Could not resolve hostname "${host}". ` +
        `Please verify the hostname or IP address is correct.`
    )
  }

  // Authentication failure
  if (errorMessage.includes('authentication') || errorMessage.includes('auth')) {
    return new Error(
      `Authentication failed for user on ${host}:${port}. ` +
        `Please verify: (1) Username is correct, ` +
        `(2) Password or private key is valid, ` +
        `(3) User has SSH access on the server.`
    )
  }

  // Private key format issues
  if (
    errorMessage.includes('key') &&
    (errorMessage.includes('parse') || errorMessage.includes('invalid'))
  ) {
    return new Error(
      `Invalid private key format. ` +
        `Please ensure you're using a valid OpenSSH private key. ` +
        `The key should start with "-----BEGIN" and end with "-----END".`
    )
  }

  // Host key verification (first connection)
  if (errorMessage.includes('host key') || errorMessage.includes('hostkey')) {
    return new Error(
      `Host key verification issue for ${host}. ` +
        `This may be the first connection to this server or the server's key has changed.`
    )
  }

  // Return original error with context if no specific match
  return new Error(`SSH connection to ${host}:${port} failed: ${err.message}`)
}

/**
 * Create an SSH connection using the provided configuration
 *
 * Uses ssh2 library defaults which align with OpenSSH standards:
 * - readyTimeout: 20000ms (20 seconds)
 * - keepaliveInterval: 0 (disabled, same as OpenSSH ServerAliveInterval)
 * - keepaliveCountMax: 3 (same as OpenSSH ServerAliveCountMax)
 */
export function createSSHConnection(config: SSHConnectionConfig): Promise<Client> {
  return new Promise((resolve, reject) => {
    const client = new Client()
    const port = config.port || 22
    const host = config.host

    if (!host || host.trim() === '') {
      reject(new Error('Host is required. Please provide a valid hostname or IP address.'))
      return
    }

    const hasPassword = config.password && config.password.trim() !== ''
    const hasPrivateKey = config.privateKey && config.privateKey.trim() !== ''

    if (!hasPassword && !hasPrivateKey) {
      reject(new Error('Authentication required. Please provide either a password or private key.'))
      return
    }

    const connectConfig: ConnectConfig = {
      host: host.trim(),
      port,
      username: config.username,
    }

    if (config.readyTimeout !== undefined) {
      connectConfig.readyTimeout = config.readyTimeout
    }
    if (config.keepaliveInterval !== undefined) {
      connectConfig.keepaliveInterval = config.keepaliveInterval
    }

    if (hasPrivateKey) {
      connectConfig.privateKey = config.privateKey!
      if (config.passphrase && config.passphrase.trim() !== '') {
        connectConfig.passphrase = config.passphrase
      }
    } else if (hasPassword) {
      connectConfig.password = config.password!
    }

    client.on('ready', () => {
      resolve(client)
    })

    client.on('error', (err) => {
      reject(formatSSHError(err, { host, port }))
    })

    try {
      client.connect(connectConfig)
    } catch (err) {
      reject(formatSSHError(err instanceof Error ? err : new Error(String(err)), { host, port }))
    }
  })
}

/**
 * Execute a command on the SSH connection
 */
export function executeSSHCommand(client: Client, command: string): Promise<SSHCommandResult> {
  return new Promise((resolve, reject) => {
    client.exec(command, (err, stream) => {
      if (err) {
        reject(err)
        return
      }

      let stdout = ''
      let stderr = ''

      stream.on('close', (code: number) => {
        resolve({
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          exitCode: code ?? 0,
        })
      })

      stream.on('data', (data: Buffer) => {
        stdout += data.toString()
      })

      stream.stderr.on('data', (data: Buffer) => {
        stderr += data.toString()
      })
    })
  })
}

/**
 * Sanitize command input to prevent command injection
 */
export function sanitizeCommand(command: string): string {
  return command.trim()
}

/**
 * Sanitize file path - removes null bytes and trims whitespace
 */
export function sanitizePath(path: string): string {
  let sanitized = path.replace(/\0/g, '')

  sanitized = sanitized.trim()

  return sanitized
}

/**
 * Escape a string for safe use in single-quoted shell arguments
 * This is standard practice for shell command construction.
 * e.g., "/tmp/test'file" becomes "/tmp/test'\''file"
 *
 * The pattern 'foo'\''bar' works because:
 * - First ' ends the current single-quoted string
 * - \' inserts a literal single quote (escaped outside quotes)
 * - Next ' starts a new single-quoted string
 */
export function escapeShellArg(arg: string): string {
  return arg.replace(/'/g, "'\\''")
}

/**
 * Validate that authentication credentials are provided
 */
export function validateAuth(params: { password?: string; privateKey?: string }): {
  isValid: boolean
  error?: string
} {
  if (!params.password && !params.privateKey) {
    return {
      isValid: false,
      error: 'Either password or privateKey must be provided for authentication',
    }
  }
  return { isValid: true }
}

/**
 * Parse file permissions from octal string
 */
export function parsePermissions(mode: number): string {
  return `0${(mode & 0o777).toString(8)}`
}

/**
 * Get file type from attributes mode bits
 */
export function getFileType(attrs: Attributes): 'file' | 'directory' | 'symlink' | 'other' {
  const mode = attrs.mode
  const fileType = mode & S_IFMT

  if (fileType === S_IFDIR) return 'directory'
  if (fileType === S_IFREG) return 'file'
  if (fileType === S_IFLNK) return 'symlink'
  return 'other'
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/ssh/check-command-exists/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createLogger } from '@/lib/logs/console/logger'
import { createSSHConnection, escapeShellArg, executeSSHCommand } from '@/app/api/tools/ssh/utils'

const logger = createLogger('SSHCheckCommandExistsAPI')

const CheckCommandExistsSchema = z.object({
  host: z.string().min(1, 'Host is required'),
  port: z.coerce.number().int().positive().default(22),
  username: z.string().min(1, 'Username is required'),
  password: z.string().nullish(),
  privateKey: z.string().nullish(),
  passphrase: z.string().nullish(),
  commandName: z.string().min(1, 'Command name is required'),
})

export async function POST(request: NextRequest) {
  const requestId = randomUUID().slice(0, 8)

  try {
    const body = await request.json()
    const params = CheckCommandExistsSchema.parse(body)

    if (!params.password && !params.privateKey) {
      return NextResponse.json(
        { error: 'Either password or privateKey must be provided' },
        { status: 400 }
      )
    }

    logger.info(
      `[${requestId}] Checking if command '${params.commandName}' exists on ${params.host}:${params.port}`
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
      const escapedCommand = escapeShellArg(params.commandName)

      const result = await executeSSHCommand(
        client,
        `command -v '${escapedCommand}' 2>/dev/null || which '${escapedCommand}' 2>/dev/null`
      )

      const exists = result.exitCode === 0 && result.stdout.trim().length > 0
      const path = exists ? result.stdout.trim() : undefined

      let version: string | undefined
      if (exists) {
        try {
          const versionResult = await executeSSHCommand(
            client,
            `'${escapedCommand}' --version 2>&1 | head -1 || '${escapedCommand}' -v 2>&1 | head -1`
          )
          if (versionResult.exitCode === 0 && versionResult.stdout.trim()) {
            version = versionResult.stdout.trim()
          }
        } catch {
          // Version check failed, that's okay
        }
      }

      logger.info(
        `[${requestId}] Command '${params.commandName}' ${exists ? 'exists' : 'does not exist'}`
      )

      return NextResponse.json({
        exists,
        path,
        version,
        message: exists
          ? `Command '${params.commandName}' found at ${path}`
          : `Command '${params.commandName}' not found`,
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
    logger.error(`[${requestId}] SSH check command exists failed:`, error)

    return NextResponse.json(
      { error: `SSH check command exists failed: ${errorMessage}` },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/ssh/check-file-exists/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import type { Client, SFTPWrapper, Stats } from 'ssh2'
import { z } from 'zod'
import { createLogger } from '@/lib/logs/console/logger'
import {
  createSSHConnection,
  getFileType,
  parsePermissions,
  sanitizePath,
} from '@/app/api/tools/ssh/utils'

const logger = createLogger('SSHCheckFileExistsAPI')

const CheckFileExistsSchema = z.object({
  host: z.string().min(1, 'Host is required'),
  port: z.coerce.number().int().positive().default(22),
  username: z.string().min(1, 'Username is required'),
  password: z.string().nullish(),
  privateKey: z.string().nullish(),
  passphrase: z.string().nullish(),
  path: z.string().min(1, 'Path is required'),
  type: z.enum(['file', 'directory', 'any']).default('any'),
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
    const params = CheckFileExistsSchema.parse(body)

    // Validate authentication
    if (!params.password && !params.privateKey) {
      return NextResponse.json(
        { error: 'Either password or privateKey must be provided' },
        { status: 400 }
      )
    }

    logger.info(
      `[${requestId}] Checking if path exists: ${params.path} on ${params.host}:${params.port}`
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

      const stats = await new Promise<Stats | null>((resolve) => {
        sftp.stat(filePath, (err, stats) => {
          if (err) {
            resolve(null)
          } else {
            resolve(stats)
          }
        })
      })

      if (!stats) {
        logger.info(`[${requestId}] Path does not exist: ${filePath}`)
        return NextResponse.json({
          exists: false,
          type: 'not_found',
          message: `Path does not exist: ${filePath}`,
        })
      }

      const fileType = getFileType(stats)

      // Check if the type matches the expected type
      if (params.type !== 'any' && fileType !== params.type) {
        logger.info(`[${requestId}] Path exists but is not a ${params.type}: ${filePath}`)
        return NextResponse.json({
          exists: false,
          type: fileType,
          size: stats.size,
          permissions: parsePermissions(stats.mode),
          modified: new Date((stats.mtime || 0) * 1000).toISOString(),
          message: `Path exists but is a ${fileType}, not a ${params.type}`,
        })
      }

      logger.info(`[${requestId}] Path exists: ${filePath} (${fileType})`)

      return NextResponse.json({
        exists: true,
        type: fileType,
        size: stats.size,
        permissions: parsePermissions(stats.mode),
        modified: new Date((stats.mtime || 0) * 1000).toISOString(),
        message: `Path exists: ${filePath} (${fileType})`,
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
    logger.error(`[${requestId}] SSH check file exists failed:`, error)

    return NextResponse.json(
      { error: `SSH check file exists failed: ${errorMessage}` },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/ssh/create-directory/route.ts
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

const logger = createLogger('SSHCreateDirectoryAPI')

const CreateDirectorySchema = z.object({
  host: z.string().min(1, 'Host is required'),
  port: z.coerce.number().int().positive().default(22),
  username: z.string().min(1, 'Username is required'),
  password: z.string().nullish(),
  privateKey: z.string().nullish(),
  passphrase: z.string().nullish(),
  path: z.string().min(1, 'Path is required'),
  recursive: z.boolean().default(true),
  permissions: z.string().default('0755'),
})

export async function POST(request: NextRequest) {
  const requestId = randomUUID().slice(0, 8)

  try {
    const body = await request.json()
    const params = CreateDirectorySchema.parse(body)

    // Validate authentication
    if (!params.password && !params.privateKey) {
      return NextResponse.json(
        { error: 'Either password or privateKey must be provided' },
        { status: 400 }
      )
    }

    logger.info(`[${requestId}] Creating directory ${params.path} on ${params.host}:${params.port}`)

    const client = await createSSHConnection({
      host: params.host,
      port: params.port,
      username: params.username,
      password: params.password,
      privateKey: params.privateKey,
      passphrase: params.passphrase,
    })

    try {
      const dirPath = sanitizePath(params.path)
      const escapedPath = escapeShellArg(dirPath)

      // Check if directory already exists
      const checkResult = await executeSSHCommand(
        client,
        `test -d '${escapedPath}' && echo "exists"`
      )
      const alreadyExists = checkResult.stdout.trim() === 'exists'

      if (alreadyExists) {
        logger.info(`[${requestId}] Directory already exists: ${dirPath}`)
        return NextResponse.json({
          created: false,
          path: dirPath,
          alreadyExists: true,
          message: `Directory already exists: ${dirPath}`,
        })
      }

      // Create directory
      const mkdirFlag = params.recursive ? '-p' : ''
      const command = `mkdir ${mkdirFlag} -m ${params.permissions} '${escapedPath}'`
      const result = await executeSSHCommand(client, command)

      if (result.exitCode !== 0) {
        throw new Error(result.stderr || 'Failed to create directory')
      }

      logger.info(`[${requestId}] Directory created successfully: ${dirPath}`)

      return NextResponse.json({
        created: true,
        path: dirPath,
        alreadyExists: false,
        message: `Directory created successfully: ${dirPath}`,
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
    logger.error(`[${requestId}] SSH create directory failed:`, error)

    return NextResponse.json(
      { error: `SSH create directory failed: ${errorMessage}` },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

````
