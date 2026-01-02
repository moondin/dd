---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 311
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 311 of 933)

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
Location: sim-main/apps/sim/app/api/tools/outlook/move/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'

export const dynamic = 'force-dynamic'

const logger = createLogger('OutlookMoveAPI')

const OutlookMoveSchema = z.object({
  accessToken: z.string().min(1, 'Access token is required'),
  messageId: z.string().min(1, 'Message ID is required'),
  destinationId: z.string().min(1, 'Destination folder ID is required'),
})

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })

    if (!authResult.success) {
      logger.warn(`[${requestId}] Unauthorized Outlook move attempt: ${authResult.error}`)
      return NextResponse.json(
        {
          success: false,
          error: authResult.error || 'Authentication required',
        },
        { status: 401 }
      )
    }

    logger.info(`[${requestId}] Authenticated Outlook move request via ${authResult.authType}`, {
      userId: authResult.userId,
    })

    const body = await request.json()
    const validatedData = OutlookMoveSchema.parse(body)

    logger.info(`[${requestId}] Moving Outlook email`, {
      messageId: validatedData.messageId,
      destinationId: validatedData.destinationId,
    })

    const graphEndpoint = `https://graph.microsoft.com/v1.0/me/messages/${validatedData.messageId}/move`

    logger.info(`[${requestId}] Sending to Microsoft Graph API: ${graphEndpoint}`)

    const graphResponse = await fetch(graphEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${validatedData.accessToken}`,
      },
      body: JSON.stringify({
        destinationId: validatedData.destinationId,
      }),
    })

    if (!graphResponse.ok) {
      const errorData = await graphResponse.json().catch(() => ({}))
      logger.error(`[${requestId}] Microsoft Graph API error:`, errorData)
      return NextResponse.json(
        {
          success: false,
          error: errorData.error?.message || 'Failed to move email',
        },
        { status: graphResponse.status }
      )
    }

    const responseData = await graphResponse.json()

    logger.info(`[${requestId}] Email moved successfully`, {
      messageId: responseData.id,
      parentFolderId: responseData.parentFolderId,
    })

    return NextResponse.json({
      success: true,
      output: {
        message: 'Email moved successfully',
        messageId: responseData.id,
        newFolderId: responseData.parentFolderId,
      },
    })
  } catch (error) {
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

    logger.error(`[${requestId}] Error moving Outlook email:`, error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/outlook/send/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { processFilesToUserFiles } from '@/lib/uploads/utils/file-utils'
import { downloadFileFromStorage } from '@/lib/uploads/utils/file-utils.server'

export const dynamic = 'force-dynamic'

const logger = createLogger('OutlookSendAPI')

const OutlookSendSchema = z.object({
  accessToken: z.string().min(1, 'Access token is required'),
  to: z.string().min(1, 'Recipient email is required'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Email body is required'),
  contentType: z.enum(['text', 'html']).optional().nullable(),
  cc: z.string().optional().nullable(),
  bcc: z.string().optional().nullable(),
  replyToMessageId: z.string().optional().nullable(),
  conversationId: z.string().optional().nullable(),
  attachments: z.array(z.any()).optional().nullable(),
})

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })

    if (!authResult.success) {
      logger.warn(`[${requestId}] Unauthorized Outlook send attempt: ${authResult.error}`)
      return NextResponse.json(
        {
          success: false,
          error: authResult.error || 'Authentication required',
        },
        { status: 401 }
      )
    }

    logger.info(`[${requestId}] Authenticated Outlook send request via ${authResult.authType}`, {
      userId: authResult.userId,
    })

    const body = await request.json()
    const validatedData = OutlookSendSchema.parse(body)

    logger.info(`[${requestId}] Sending Outlook email`, {
      to: validatedData.to,
      subject: validatedData.subject,
      hasAttachments: !!(validatedData.attachments && validatedData.attachments.length > 0),
      attachmentCount: validatedData.attachments?.length || 0,
    })

    const toRecipients = validatedData.to.split(',').map((email) => ({
      emailAddress: { address: email.trim() },
    }))

    const ccRecipients = validatedData.cc
      ? validatedData.cc.split(',').map((email) => ({
          emailAddress: { address: email.trim() },
        }))
      : undefined

    const bccRecipients = validatedData.bcc
      ? validatedData.bcc.split(',').map((email) => ({
          emailAddress: { address: email.trim() },
        }))
      : undefined

    const message: any = {
      subject: validatedData.subject,
      body: {
        contentType: validatedData.contentType || 'text',
        content: validatedData.body,
      },
      toRecipients,
    }

    if (ccRecipients) {
      message.ccRecipients = ccRecipients
    }

    if (bccRecipients) {
      message.bccRecipients = bccRecipients
    }

    if (validatedData.attachments && validatedData.attachments.length > 0) {
      const rawAttachments = validatedData.attachments
      logger.info(`[${requestId}] Processing ${rawAttachments.length} attachment(s)`)

      const attachments = processFilesToUserFiles(rawAttachments, requestId, logger)

      if (attachments.length > 0) {
        const totalSize = attachments.reduce((sum, file) => sum + file.size, 0)
        const maxSize = 4 * 1024 * 1024 // 4MB

        if (totalSize > maxSize) {
          const sizeMB = (totalSize / (1024 * 1024)).toFixed(2)
          return NextResponse.json(
            {
              success: false,
              error: `Total attachment size (${sizeMB}MB) exceeds Outlook's limit of 4MB per request`,
            },
            { status: 400 }
          )
        }

        const attachmentObjects = await Promise.all(
          attachments.map(async (file) => {
            try {
              logger.info(
                `[${requestId}] Downloading attachment: ${file.name} (${file.size} bytes)`
              )

              const buffer = await downloadFileFromStorage(file, requestId, logger)

              const base64Content = buffer.toString('base64')

              return {
                '@odata.type': '#microsoft.graph.fileAttachment',
                name: file.name,
                contentType: file.type || 'application/octet-stream',
                contentBytes: base64Content,
              }
            } catch (error) {
              logger.error(`[${requestId}] Failed to download attachment ${file.name}:`, error)
              throw new Error(
                `Failed to download attachment "${file.name}": ${error instanceof Error ? error.message : 'Unknown error'}`
              )
            }
          })
        )

        logger.info(`[${requestId}] Converted ${attachmentObjects.length} attachments to base64`)
        message.attachments = attachmentObjects
      }
    }

    const graphEndpoint = validatedData.replyToMessageId
      ? `https://graph.microsoft.com/v1.0/me/messages/${validatedData.replyToMessageId}/reply`
      : 'https://graph.microsoft.com/v1.0/me/sendMail'

    logger.info(`[${requestId}] Sending to Microsoft Graph API: ${graphEndpoint}`)

    const graphResponse = await fetch(graphEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${validatedData.accessToken}`,
      },
      body: JSON.stringify(
        validatedData.replyToMessageId
          ? {
              comment: validatedData.body,
              message: message,
            }
          : {
              message: message,
              saveToSentItems: true,
            }
      ),
    })

    if (!graphResponse.ok) {
      const errorData = await graphResponse.json().catch(() => ({}))
      logger.error(`[${requestId}] Microsoft Graph API error:`, errorData)
      return NextResponse.json(
        {
          success: false,
          error: errorData.error?.message || 'Failed to send email',
        },
        { status: graphResponse.status }
      )
    }

    logger.info(`[${requestId}] Email sent successfully`)

    return NextResponse.json({
      success: true,
      output: {
        message: 'Email sent successfully',
        status: 'sent',
        timestamp: new Date().toISOString(),
        attachmentCount: message.attachments?.length || 0,
      },
    })
  } catch (error) {
    logger.error(`[${requestId}] Error sending Outlook email:`, error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/app/api/tools/postgresql/utils.ts

```typescript
import postgres from 'postgres'
import type { PostgresConnectionConfig } from '@/tools/postgresql/types'

export function createPostgresConnection(config: PostgresConnectionConfig) {
  const sslConfig =
    config.ssl === 'disabled'
      ? false
      : config.ssl === 'required'
        ? 'require'
        : config.ssl === 'preferred'
          ? 'prefer'
          : 'require'

  const sql = postgres({
    host: config.host,
    port: config.port,
    database: config.database,
    username: config.username,
    password: config.password,
    ssl: sslConfig,
    connect_timeout: 10, // 10 seconds
    idle_timeout: 20, // 20 seconds
    max_lifetime: 60 * 30, // 30 minutes
    max: 1, // Single connection for tool usage
  })

  return sql
}

export async function executeQuery(
  sql: any,
  query: string,
  params: unknown[] = []
): Promise<{ rows: unknown[]; rowCount: number }> {
  const result = await sql.unsafe(query, params)
  const rowCount = result.count ?? result.length ?? 0
  return {
    rows: Array.isArray(result) ? result : [result],
    rowCount,
  }
}

export function validateQuery(query: string): { isValid: boolean; error?: string } {
  const trimmedQuery = query.trim().toLowerCase()

  const allowedStatements = /^(select|insert|update|delete|with|explain|analyze|show)\s+/i
  if (!allowedStatements.test(trimmedQuery)) {
    return {
      isValid: false,
      error:
        'Only SELECT, INSERT, UPDATE, DELETE, WITH, EXPLAIN, ANALYZE, and SHOW statements are allowed',
    }
  }

  return { isValid: true }
}

export function sanitizeIdentifier(identifier: string): string {
  if (identifier.includes('.')) {
    const parts = identifier.split('.')
    return parts.map((part) => sanitizeSingleIdentifier(part)).join('.')
  }

  return sanitizeSingleIdentifier(identifier)
}

function validateWhereClause(where: string): void {
  const dangerousPatterns = [
    /;\s*(drop|delete|insert|update|create|alter|grant|revoke)/i,
    /union\s+select/i,
    /into\s+outfile/i,
    /load_file/i,
    /--/,
    /\/\*/,
    /\*\//,
  ]

  for (const pattern of dangerousPatterns) {
    if (pattern.test(where)) {
      throw new Error('WHERE clause contains potentially dangerous operation')
    }
  }
}

function sanitizeSingleIdentifier(identifier: string): string {
  const cleaned = identifier.replace(/"/g, '')

  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(cleaned)) {
    throw new Error(
      `Invalid identifier: ${identifier}. Identifiers must start with a letter or underscore and contain only letters, numbers, and underscores.`
    )
  }

  return `"${cleaned}"`
}

export async function executeInsert(
  sql: any,
  table: string,
  data: Record<string, unknown>
): Promise<{ rows: unknown[]; rowCount: number }> {
  const sanitizedTable = sanitizeIdentifier(table)
  const columns = Object.keys(data)
  const sanitizedColumns = columns.map((col) => sanitizeIdentifier(col))
  const placeholders = columns.map((_, index) => `$${index + 1}`)
  const values = columns.map((col) => data[col])

  const query = `INSERT INTO ${sanitizedTable} (${sanitizedColumns.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`
  const result = await sql.unsafe(query, values)

  const rowCount = result.count ?? result.length ?? 0
  return {
    rows: Array.isArray(result) ? result : [result],
    rowCount,
  }
}

export async function executeUpdate(
  sql: any,
  table: string,
  data: Record<string, unknown>,
  where: string
): Promise<{ rows: unknown[]; rowCount: number }> {
  validateWhereClause(where)

  const sanitizedTable = sanitizeIdentifier(table)
  const columns = Object.keys(data)
  const sanitizedColumns = columns.map((col) => sanitizeIdentifier(col))
  const setClause = sanitizedColumns.map((col, index) => `${col} = $${index + 1}`).join(', ')
  const values = columns.map((col) => data[col])

  const query = `UPDATE ${sanitizedTable} SET ${setClause} WHERE ${where} RETURNING *`
  const result = await sql.unsafe(query, values)

  const rowCount = result.count ?? result.length ?? 0
  return {
    rows: Array.isArray(result) ? result : [result],
    rowCount,
  }
}

export async function executeDelete(
  sql: any,
  table: string,
  where: string
): Promise<{ rows: unknown[]; rowCount: number }> {
  validateWhereClause(where)

  const sanitizedTable = sanitizeIdentifier(table)
  const query = `DELETE FROM ${sanitizedTable} WHERE ${where} RETURNING *`
  const result = await sql.unsafe(query, [])

  const rowCount = result.count ?? result.length ?? 0
  return {
    rows: Array.isArray(result) ? result : [result],
    rowCount,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/postgresql/delete/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createLogger } from '@/lib/logs/console/logger'
import { createPostgresConnection, executeDelete } from '@/app/api/tools/postgresql/utils'

const logger = createLogger('PostgreSQLDeleteAPI')

const DeleteSchema = z.object({
  host: z.string().min(1, 'Host is required'),
  port: z.coerce.number().int().positive('Port must be a positive integer'),
  database: z.string().min(1, 'Database name is required'),
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  ssl: z.enum(['disabled', 'required', 'preferred']).default('preferred'),
  table: z.string().min(1, 'Table name is required'),
  where: z.string().min(1, 'WHERE clause is required'),
})

export async function POST(request: NextRequest) {
  const requestId = randomUUID().slice(0, 8)

  try {
    const body = await request.json()
    const params = DeleteSchema.parse(body)

    logger.info(
      `[${requestId}] Deleting data from ${params.table} on ${params.host}:${params.port}/${params.database}`
    )

    const sql = createPostgresConnection({
      host: params.host,
      port: params.port,
      database: params.database,
      username: params.username,
      password: params.password,
      ssl: params.ssl,
    })

    try {
      const result = await executeDelete(sql, params.table, params.where)

      logger.info(`[${requestId}] Delete executed successfully, ${result.rowCount} row(s) deleted`)

      return NextResponse.json({
        message: `Data deleted successfully. ${result.rowCount} row(s) affected.`,
        rows: result.rows,
        rowCount: result.rowCount,
      })
    } finally {
      await sql.end()
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
    logger.error(`[${requestId}] PostgreSQL delete failed:`, error)

    return NextResponse.json(
      { error: `PostgreSQL delete failed: ${errorMessage}` },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/postgresql/execute/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createLogger } from '@/lib/logs/console/logger'
import {
  createPostgresConnection,
  executeQuery,
  validateQuery,
} from '@/app/api/tools/postgresql/utils'

const logger = createLogger('PostgreSQLExecuteAPI')

const ExecuteSchema = z.object({
  host: z.string().min(1, 'Host is required'),
  port: z.coerce.number().int().positive('Port must be a positive integer'),
  database: z.string().min(1, 'Database name is required'),
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  ssl: z.enum(['disabled', 'required', 'preferred']).default('preferred'),
  query: z.string().min(1, 'Query is required'),
})

export async function POST(request: NextRequest) {
  const requestId = randomUUID().slice(0, 8)

  try {
    const body = await request.json()
    const params = ExecuteSchema.parse(body)

    logger.info(
      `[${requestId}] Executing raw SQL on ${params.host}:${params.port}/${params.database}`
    )

    const validation = validateQuery(params.query)
    if (!validation.isValid) {
      logger.warn(`[${requestId}] Query validation failed: ${validation.error}`)
      return NextResponse.json(
        { error: `Query validation failed: ${validation.error}` },
        { status: 400 }
      )
    }

    const sql = createPostgresConnection({
      host: params.host,
      port: params.port,
      database: params.database,
      username: params.username,
      password: params.password,
      ssl: params.ssl,
    })

    try {
      const result = await executeQuery(sql, params.query)

      logger.info(`[${requestId}] SQL executed successfully, ${result.rowCount} row(s) affected`)

      return NextResponse.json({
        message: `SQL executed successfully. ${result.rowCount} row(s) affected.`,
        rows: result.rows,
        rowCount: result.rowCount,
      })
    } finally {
      await sql.end()
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
    logger.error(`[${requestId}] PostgreSQL execute failed:`, error)

    return NextResponse.json(
      { error: `PostgreSQL execute failed: ${errorMessage}` },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/postgresql/insert/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createLogger } from '@/lib/logs/console/logger'
import { createPostgresConnection, executeInsert } from '@/app/api/tools/postgresql/utils'

const logger = createLogger('PostgreSQLInsertAPI')

const InsertSchema = z.object({
  host: z.string().min(1, 'Host is required'),
  port: z.coerce.number().int().positive('Port must be a positive integer'),
  database: z.string().min(1, 'Database name is required'),
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  ssl: z.enum(['disabled', 'required', 'preferred']).default('preferred'),
  table: z.string().min(1, 'Table name is required'),
  data: z.union([
    z
      .record(z.unknown())
      .refine((obj) => Object.keys(obj).length > 0, 'Data object cannot be empty'),
    z
      .string()
      .min(1)
      .transform((str) => {
        try {
          const parsed = JSON.parse(str)
          if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
            throw new Error('Data must be a JSON object')
          }
          return parsed
        } catch (e) {
          const errorMsg = e instanceof Error ? e.message : 'Unknown error'
          throw new Error(
            `Invalid JSON format in data field: ${errorMsg}. Received: ${str.substring(0, 100)}...`
          )
        }
      }),
  ]),
})

export async function POST(request: NextRequest) {
  const requestId = randomUUID().slice(0, 8)

  try {
    const body = await request.json()

    const params = InsertSchema.parse(body)

    logger.info(
      `[${requestId}] Inserting data into ${params.table} on ${params.host}:${params.port}/${params.database}`
    )

    const sql = createPostgresConnection({
      host: params.host,
      port: params.port,
      database: params.database,
      username: params.username,
      password: params.password,
      ssl: params.ssl,
    })

    try {
      const result = await executeInsert(sql, params.table, params.data)

      logger.info(`[${requestId}] Insert executed successfully, ${result.rowCount} row(s) inserted`)

      return NextResponse.json({
        message: `Data inserted successfully. ${result.rowCount} row(s) affected.`,
        rows: result.rows,
        rowCount: result.rowCount,
      })
    } finally {
      await sql.end()
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
    logger.error(`[${requestId}] PostgreSQL insert failed:`, error)

    return NextResponse.json(
      { error: `PostgreSQL insert failed: ${errorMessage}` },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/postgresql/query/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createLogger } from '@/lib/logs/console/logger'
import { createPostgresConnection, executeQuery } from '@/app/api/tools/postgresql/utils'

const logger = createLogger('PostgreSQLQueryAPI')

const QuerySchema = z.object({
  host: z.string().min(1, 'Host is required'),
  port: z.coerce.number().int().positive('Port must be a positive integer'),
  database: z.string().min(1, 'Database name is required'),
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  ssl: z.enum(['disabled', 'required', 'preferred']).default('preferred'),
  query: z.string().min(1, 'Query is required'),
})

export async function POST(request: NextRequest) {
  const requestId = randomUUID().slice(0, 8)

  try {
    const body = await request.json()
    const params = QuerySchema.parse(body)

    logger.info(
      `[${requestId}] Executing PostgreSQL query on ${params.host}:${params.port}/${params.database}`
    )

    const sql = createPostgresConnection({
      host: params.host,
      port: params.port,
      database: params.database,
      username: params.username,
      password: params.password,
      ssl: params.ssl,
    })

    try {
      const result = await executeQuery(sql, params.query)

      logger.info(`[${requestId}] Query executed successfully, returned ${result.rowCount} rows`)

      return NextResponse.json({
        message: `Query executed successfully. ${result.rowCount} row(s) returned.`,
        rows: result.rows,
        rowCount: result.rowCount,
      })
    } finally {
      await sql.end()
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
    logger.error(`[${requestId}] PostgreSQL query failed:`, error)

    return NextResponse.json({ error: `PostgreSQL query failed: ${errorMessage}` }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/postgresql/update/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createLogger } from '@/lib/logs/console/logger'
import { createPostgresConnection, executeUpdate } from '@/app/api/tools/postgresql/utils'

const logger = createLogger('PostgreSQLUpdateAPI')

const UpdateSchema = z.object({
  host: z.string().min(1, 'Host is required'),
  port: z.coerce.number().int().positive('Port must be a positive integer'),
  database: z.string().min(1, 'Database name is required'),
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  ssl: z.enum(['disabled', 'required', 'preferred']).default('preferred'),
  table: z.string().min(1, 'Table name is required'),
  data: z.union([
    z
      .record(z.unknown())
      .refine((obj) => Object.keys(obj).length > 0, 'Data object cannot be empty'),
    z
      .string()
      .min(1)
      .transform((str) => {
        try {
          const parsed = JSON.parse(str)
          if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
            throw new Error('Data must be a JSON object')
          }
          return parsed
        } catch (e) {
          throw new Error('Invalid JSON format in data field')
        }
      }),
  ]),
  where: z.string().min(1, 'WHERE clause is required'),
})

export async function POST(request: NextRequest) {
  const requestId = randomUUID().slice(0, 8)

  try {
    const body = await request.json()
    const params = UpdateSchema.parse(body)

    logger.info(
      `[${requestId}] Updating data in ${params.table} on ${params.host}:${params.port}/${params.database}`
    )

    const sql = createPostgresConnection({
      host: params.host,
      port: params.port,
      database: params.database,
      username: params.username,
      password: params.password,
      ssl: params.ssl,
    })

    try {
      const result = await executeUpdate(sql, params.table, params.data, params.where)

      logger.info(`[${requestId}] Update executed successfully, ${result.rowCount} row(s) updated`)

      return NextResponse.json({
        message: `Data updated successfully. ${result.rowCount} row(s) affected.`,
        rows: result.rows,
        rowCount: result.rowCount,
      })
    } finally {
      await sql.end()
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
    logger.error(`[${requestId}] PostgreSQL update failed:`, error)

    return NextResponse.json(
      { error: `PostgreSQL update failed: ${errorMessage}` },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/app/api/tools/rds/utils.ts

```typescript
import {
  ExecuteStatementCommand,
  type ExecuteStatementCommandOutput,
  type Field,
  RDSDataClient,
  type SqlParameter,
} from '@aws-sdk/client-rds-data'
import type { RdsConnectionConfig } from '@/tools/rds/types'

export function createRdsClient(config: RdsConnectionConfig): RDSDataClient {
  return new RDSDataClient({
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  })
}

export async function executeStatement(
  client: RDSDataClient,
  resourceArn: string,
  secretArn: string,
  database: string | undefined,
  sql: string,
  parameters?: SqlParameter[]
): Promise<{ rows: Record<string, unknown>[]; rowCount: number }> {
  const command = new ExecuteStatementCommand({
    resourceArn,
    secretArn,
    ...(database && { database }),
    sql,
    ...(parameters && parameters.length > 0 && { parameters }),
    includeResultMetadata: true,
  })

  const response = await client.send(command)
  const rows = parseRdsResponse(response)

  return {
    rows,
    rowCount: response.numberOfRecordsUpdated ?? rows.length,
  }
}

function parseRdsResponse(response: ExecuteStatementCommandOutput): Record<string, unknown>[] {
  if (!response.records || !response.columnMetadata) {
    return []
  }

  const columnNames = response.columnMetadata.map((col) => col.name || col.label || 'unknown')

  return response.records.map((record) => {
    const row: Record<string, unknown> = {}
    record.forEach((field, index) => {
      const columnName = columnNames[index] || `column_${index}`
      row[columnName] = parseFieldValue(field)
    })
    return row
  })
}

function parseFieldValue(field: Field): unknown {
  if (field.isNull) return null
  if (field.stringValue !== undefined) return field.stringValue
  if (field.longValue !== undefined) return field.longValue
  if (field.doubleValue !== undefined) return field.doubleValue
  if (field.booleanValue !== undefined) return field.booleanValue
  if (field.blobValue !== undefined) return Buffer.from(field.blobValue).toString('base64')
  if (field.arrayValue !== undefined) {
    const arr = field.arrayValue
    if (arr.stringValues) return arr.stringValues
    if (arr.longValues) return arr.longValues
    if (arr.doubleValues) return arr.doubleValues
    if (arr.booleanValues) return arr.booleanValues
    if (arr.arrayValues) return arr.arrayValues.map((f) => parseFieldValue({ arrayValue: f }))
    return []
  }
  return null
}

export function validateQuery(query: string): { isValid: boolean; error?: string } {
  const trimmedQuery = query.trim().toLowerCase()

  const allowedStatements = /^(select|insert|update|delete|with|explain|show)\s+/i
  if (!allowedStatements.test(trimmedQuery)) {
    return {
      isValid: false,
      error: 'Only SELECT, INSERT, UPDATE, DELETE, WITH, EXPLAIN, and SHOW statements are allowed',
    }
  }

  return { isValid: true }
}

export function sanitizeIdentifier(identifier: string): string {
  if (identifier.includes('.')) {
    const parts = identifier.split('.')
    return parts.map((part) => sanitizeSingleIdentifier(part)).join('.')
  }

  return sanitizeSingleIdentifier(identifier)
}

function sanitizeSingleIdentifier(identifier: string): string {
  const cleaned = identifier.replace(/`/g, '').replace(/"/g, '')

  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(cleaned)) {
    throw new Error(
      `Invalid identifier: ${identifier}. Identifiers must start with a letter or underscore and contain only letters, numbers, and underscores.`
    )
  }

  return cleaned
}

/**
 * Convert a JS value to an RDS Data API SqlParameter value
 */
function toSqlParameterValue(value: unknown): SqlParameter['value'] {
  if (value === null || value === undefined) {
    return { isNull: true }
  }
  if (typeof value === 'boolean') {
    return { booleanValue: value }
  }
  if (typeof value === 'number') {
    if (Number.isInteger(value)) {
      return { longValue: value }
    }
    return { doubleValue: value }
  }
  if (typeof value === 'string') {
    return { stringValue: value }
  }
  if (value instanceof Uint8Array || Buffer.isBuffer(value)) {
    return { blobValue: value }
  }
  // Objects/arrays as JSON strings
  return { stringValue: JSON.stringify(value) }
}

/**
 * Build parameterized INSERT query
 */
export async function executeInsert(
  client: RDSDataClient,
  resourceArn: string,
  secretArn: string,
  database: string | undefined,
  table: string,
  data: Record<string, unknown>
): Promise<{ rows: Record<string, unknown>[]; rowCount: number }> {
  const sanitizedTable = sanitizeIdentifier(table)
  const columns = Object.keys(data)
  const sanitizedColumns = columns.map((col) => sanitizeIdentifier(col))

  const placeholders = columns.map((col) => `:${col}`)
  const parameters: SqlParameter[] = columns.map((col) => ({
    name: col,
    value: toSqlParameterValue(data[col]),
  }))

  const sql = `INSERT INTO ${sanitizedTable} (${sanitizedColumns.join(', ')}) VALUES (${placeholders.join(', ')})`

  return executeStatement(client, resourceArn, secretArn, database, sql, parameters)
}

/**
 * Build parameterized UPDATE query with conditions
 */
export async function executeUpdate(
  client: RDSDataClient,
  resourceArn: string,
  secretArn: string,
  database: string | undefined,
  table: string,
  data: Record<string, unknown>,
  conditions: Record<string, unknown>
): Promise<{ rows: Record<string, unknown>[]; rowCount: number }> {
  const sanitizedTable = sanitizeIdentifier(table)

  // Build SET clause with parameters
  const dataColumns = Object.keys(data)
  const setClause = dataColumns.map((col) => `${sanitizeIdentifier(col)} = :set_${col}`).join(', ')

  // Build WHERE clause with parameters
  const conditionColumns = Object.keys(conditions)
  if (conditionColumns.length === 0) {
    throw new Error('At least one condition is required for UPDATE operations')
  }
  const whereClause = conditionColumns
    .map((col) => `${sanitizeIdentifier(col)} = :where_${col}`)
    .join(' AND ')

  // Build parameters array (prefixed to avoid name collisions)
  const parameters: SqlParameter[] = [
    ...dataColumns.map((col) => ({
      name: `set_${col}`,
      value: toSqlParameterValue(data[col]),
    })),
    ...conditionColumns.map((col) => ({
      name: `where_${col}`,
      value: toSqlParameterValue(conditions[col]),
    })),
  ]

  const sql = `UPDATE ${sanitizedTable} SET ${setClause} WHERE ${whereClause}`

  return executeStatement(client, resourceArn, secretArn, database, sql, parameters)
}

/**
 * Build parameterized DELETE query with conditions
 */
export async function executeDelete(
  client: RDSDataClient,
  resourceArn: string,
  secretArn: string,
  database: string | undefined,
  table: string,
  conditions: Record<string, unknown>
): Promise<{ rows: Record<string, unknown>[]; rowCount: number }> {
  const sanitizedTable = sanitizeIdentifier(table)

  // Build WHERE clause with parameters
  const conditionColumns = Object.keys(conditions)
  if (conditionColumns.length === 0) {
    throw new Error('At least one condition is required for DELETE operations')
  }
  const whereClause = conditionColumns
    .map((col) => `${sanitizeIdentifier(col)} = :${col}`)
    .join(' AND ')

  const parameters: SqlParameter[] = conditionColumns.map((col) => ({
    name: col,
    value: toSqlParameterValue(conditions[col]),
  }))

  const sql = `DELETE FROM ${sanitizedTable} WHERE ${whereClause}`

  return executeStatement(client, resourceArn, secretArn, database, sql, parameters)
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/rds/delete/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createLogger } from '@/lib/logs/console/logger'
import { createRdsClient, executeDelete } from '@/app/api/tools/rds/utils'

const logger = createLogger('RDSDeleteAPI')

const DeleteSchema = z.object({
  region: z.string().min(1, 'AWS region is required'),
  accessKeyId: z.string().min(1, 'AWS access key ID is required'),
  secretAccessKey: z.string().min(1, 'AWS secret access key is required'),
  resourceArn: z.string().min(1, 'Resource ARN is required'),
  secretArn: z.string().min(1, 'Secret ARN is required'),
  database: z.string().optional(),
  table: z.string().min(1, 'Table name is required'),
  conditions: z.record(z.unknown()).refine((obj) => Object.keys(obj).length > 0, {
    message: 'At least one condition is required',
  }),
})

export async function POST(request: NextRequest) {
  const requestId = randomUUID().slice(0, 8)

  try {
    const body = await request.json()
    const params = DeleteSchema.parse(body)

    logger.info(`[${requestId}] Deleting from RDS table ${params.table} in ${params.database}`)

    const client = createRdsClient({
      region: params.region,
      accessKeyId: params.accessKeyId,
      secretAccessKey: params.secretAccessKey,
      resourceArn: params.resourceArn,
      secretArn: params.secretArn,
      database: params.database,
    })

    try {
      const result = await executeDelete(
        client,
        params.resourceArn,
        params.secretArn,
        params.database,
        params.table,
        params.conditions
      )

      logger.info(`[${requestId}] Delete executed successfully, affected ${result.rowCount} rows`)

      return NextResponse.json({
        message: `Delete executed successfully. ${result.rowCount} row(s) deleted.`,
        rows: result.rows,
        rowCount: result.rowCount,
      })
    } finally {
      client.destroy()
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
    logger.error(`[${requestId}] RDS delete failed:`, error)

    return NextResponse.json({ error: `RDS delete failed: ${errorMessage}` }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

````
