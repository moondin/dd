---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 308
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 308 of 933)

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
Location: sim-main/apps/sim/app/api/tools/mongodb/execute/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createLogger } from '@/lib/logs/console/logger'
import { createMongoDBConnection, sanitizeCollectionName, validatePipeline } from '../utils'

const logger = createLogger('MongoDBExecuteAPI')

const ExecuteSchema = z.object({
  host: z.string().min(1, 'Host is required'),
  port: z.coerce.number().int().positive('Port must be a positive integer'),
  database: z.string().min(1, 'Database name is required'),
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  authSource: z.string().optional(),
  ssl: z.enum(['disabled', 'required', 'preferred']).default('preferred'),
  collection: z.string().min(1, 'Collection name is required'),
  pipeline: z
    .union([z.string(), z.array(z.object({}).passthrough())])
    .transform((val) => {
      if (Array.isArray(val)) {
        return JSON.stringify(val)
      }
      return val
    })
    .refine((val) => val && val.trim() !== '', {
      message: 'Pipeline is required',
    }),
})

export async function POST(request: NextRequest) {
  const requestId = randomUUID().slice(0, 8)
  let client = null

  try {
    const body = await request.json()
    const params = ExecuteSchema.parse(body)

    logger.info(
      `[${requestId}] Executing aggregation pipeline on ${params.host}:${params.port}/${params.database}.${params.collection}`
    )

    const sanitizedCollection = sanitizeCollectionName(params.collection)

    const pipelineValidation = validatePipeline(params.pipeline)
    if (!pipelineValidation.isValid) {
      logger.warn(`[${requestId}] Pipeline validation failed: ${pipelineValidation.error}`)
      return NextResponse.json(
        { error: `Pipeline validation failed: ${pipelineValidation.error}` },
        { status: 400 }
      )
    }

    const pipelineDoc = JSON.parse(params.pipeline)

    client = await createMongoDBConnection({
      host: params.host,
      port: params.port,
      database: params.database,
      username: params.username,
      password: params.password,
      authSource: params.authSource,
      ssl: params.ssl,
    })

    const db = client.db(params.database)
    const coll = db.collection(sanitizedCollection)

    const cursor = coll.aggregate(pipelineDoc)
    const documents = await cursor.toArray()

    logger.info(
      `[${requestId}] Aggregation completed successfully, returned ${documents.length} documents`
    )

    return NextResponse.json({
      message: `Aggregation completed, returned ${documents.length} documents`,
      documents,
      documentCount: documents.length,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn(`[${requestId}] Invalid request data`, { errors: error.errors })
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    logger.error(`[${requestId}] MongoDB aggregation failed:`, error)

    return NextResponse.json(
      { error: `MongoDB aggregation failed: ${errorMessage}` },
      { status: 500 }
    )
  } finally {
    if (client) {
      await client.close()
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/mongodb/insert/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createLogger } from '@/lib/logs/console/logger'
import { createMongoDBConnection, sanitizeCollectionName } from '../utils'

const logger = createLogger('MongoDBInsertAPI')

const InsertSchema = z.object({
  host: z.string().min(1, 'Host is required'),
  port: z.coerce.number().int().positive('Port must be a positive integer'),
  database: z.string().min(1, 'Database name is required'),
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  authSource: z.string().optional(),
  ssl: z.enum(['disabled', 'required', 'preferred']).default('preferred'),
  collection: z.string().min(1, 'Collection name is required'),
  documents: z
    .union([z.array(z.record(z.unknown())), z.string()])
    .transform((val) => {
      if (typeof val === 'string') {
        try {
          const parsed = JSON.parse(val)
          return Array.isArray(parsed) ? parsed : [parsed]
        } catch {
          throw new Error('Invalid JSON in documents field')
        }
      }
      return val
    })
    .refine((val) => Array.isArray(val) && val.length > 0, {
      message: 'At least one document is required',
    }),
})

export async function POST(request: NextRequest) {
  const requestId = randomUUID().slice(0, 8)
  let client = null

  try {
    const body = await request.json()
    const params = InsertSchema.parse(body)

    logger.info(
      `[${requestId}] Inserting ${params.documents.length} document(s) into ${params.host}:${params.port}/${params.database}.${params.collection}`
    )

    const sanitizedCollection = sanitizeCollectionName(params.collection)
    client = await createMongoDBConnection({
      host: params.host,
      port: params.port,
      database: params.database,
      username: params.username,
      password: params.password,
      authSource: params.authSource,
      ssl: params.ssl,
    })

    const db = client.db(params.database)
    const coll = db.collection(sanitizedCollection)

    let result
    if (params.documents.length === 1) {
      result = await coll.insertOne(params.documents[0] as Record<string, unknown>)
      logger.info(`[${requestId}] Single document inserted successfully`)
      return NextResponse.json({
        message: 'Document inserted successfully',
        insertedId: result.insertedId.toString(),
        documentCount: 1,
      })
    }
    result = await coll.insertMany(params.documents as Record<string, unknown>[])
    const insertedCount = Object.keys(result.insertedIds).length
    logger.info(`[${requestId}] ${insertedCount} documents inserted successfully`)
    return NextResponse.json({
      message: `${insertedCount} documents inserted successfully`,
      insertedIds: Object.values(result.insertedIds).map((id) => id.toString()),
      documentCount: insertedCount,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn(`[${requestId}] Invalid request data`, { errors: error.errors })
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    logger.error(`[${requestId}] MongoDB insert failed:`, error)

    return NextResponse.json({ error: `MongoDB insert failed: ${errorMessage}` }, { status: 500 })
  } finally {
    if (client) {
      await client.close()
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/mongodb/query/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createLogger } from '@/lib/logs/console/logger'
import { createMongoDBConnection, sanitizeCollectionName, validateFilter } from '../utils'

const logger = createLogger('MongoDBQueryAPI')

const QuerySchema = z.object({
  host: z.string().min(1, 'Host is required'),
  port: z.coerce.number().int().positive('Port must be a positive integer'),
  database: z.string().min(1, 'Database name is required'),
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  authSource: z.string().optional(),
  ssl: z.enum(['disabled', 'required', 'preferred']).default('preferred'),
  collection: z.string().min(1, 'Collection name is required'),
  query: z
    .union([z.string(), z.object({}).passthrough()])
    .optional()
    .default('{}')
    .transform((val) => {
      if (typeof val === 'object' && val !== null) {
        return JSON.stringify(val)
      }
      return val || '{}'
    }),
  limit: z
    .union([z.coerce.number().int().positive(), z.literal(''), z.undefined()])
    .optional()
    .transform((val) => {
      if (val === '' || val === undefined || val === null) {
        return 100
      }
      return val
    }),
  sort: z
    .union([z.string(), z.object({}).passthrough(), z.null()])
    .optional()
    .transform((val) => {
      if (typeof val === 'object' && val !== null) {
        return JSON.stringify(val)
      }
      return val
    }),
})

export async function POST(request: NextRequest) {
  const requestId = randomUUID().slice(0, 8)
  let client = null

  try {
    const body = await request.json()
    const params = QuerySchema.parse(body)

    logger.info(
      `[${requestId}] Executing MongoDB query on ${params.host}:${params.port}/${params.database}.${params.collection}`
    )

    const sanitizedCollection = sanitizeCollectionName(params.collection)

    let filter = {}
    if (params.query?.trim()) {
      const validation = validateFilter(params.query)
      if (!validation.isValid) {
        logger.warn(`[${requestId}] Filter validation failed: ${validation.error}`)
        return NextResponse.json(
          { error: `Filter validation failed: ${validation.error}` },
          { status: 400 }
        )
      }
      filter = JSON.parse(params.query)
    }

    let sortCriteria = {}
    if (params.sort?.trim()) {
      try {
        sortCriteria = JSON.parse(params.sort)
      } catch (error) {
        logger.warn(`[${requestId}] Invalid sort JSON: ${params.sort}`)
        return NextResponse.json({ error: 'Invalid JSON format in sort criteria' }, { status: 400 })
      }
    }

    client = await createMongoDBConnection({
      host: params.host,
      port: params.port,
      database: params.database,
      username: params.username,
      password: params.password,
      authSource: params.authSource,
      ssl: params.ssl,
    })

    const db = client.db(params.database)
    const coll = db.collection(sanitizedCollection)

    let cursor = coll.find(filter)

    if (Object.keys(sortCriteria).length > 0) {
      cursor = cursor.sort(sortCriteria)
    }

    const limit = params.limit || 100
    cursor = cursor.limit(limit)

    const documents = await cursor.toArray()

    logger.info(
      `[${requestId}] Query executed successfully, returned ${documents.length} documents`
    )

    return NextResponse.json({
      message: `Found ${documents.length} documents`,
      documents,
      documentCount: documents.length,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn(`[${requestId}] Invalid request data`, { errors: error.errors })
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    logger.error(`[${requestId}] MongoDB query failed:`, error)

    return NextResponse.json({ error: `MongoDB query failed: ${errorMessage}` }, { status: 500 })
  } finally {
    if (client) {
      await client.close()
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/mongodb/update/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createLogger } from '@/lib/logs/console/logger'
import { createMongoDBConnection, sanitizeCollectionName, validateFilter } from '../utils'

const logger = createLogger('MongoDBUpdateAPI')

const UpdateSchema = z.object({
  host: z.string().min(1, 'Host is required'),
  port: z.coerce.number().int().positive('Port must be a positive integer'),
  database: z.string().min(1, 'Database name is required'),
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  authSource: z.string().optional(),
  ssl: z.enum(['disabled', 'required', 'preferred']).default('preferred'),
  collection: z.string().min(1, 'Collection name is required'),
  filter: z
    .union([z.string(), z.object({}).passthrough()])
    .transform((val) => {
      if (typeof val === 'object' && val !== null) {
        return JSON.stringify(val)
      }
      return val
    })
    .refine((val) => val && val.trim() !== '' && val !== '{}', {
      message: 'Filter is required for MongoDB Update',
    }),
  update: z
    .union([z.string(), z.object({}).passthrough()])
    .transform((val) => {
      if (typeof val === 'object' && val !== null) {
        return JSON.stringify(val)
      }
      return val
    })
    .refine((val) => val && val.trim() !== '', {
      message: 'Update is required',
    }),
  upsert: z
    .union([z.boolean(), z.string(), z.undefined()])
    .optional()
    .transform((val) => {
      if (val === 'true' || val === true) return true
      if (val === 'false' || val === false) return false
      return false
    }),
  multi: z
    .union([z.boolean(), z.string(), z.undefined()])
    .optional()
    .transform((val) => {
      if (val === 'true' || val === true) return true
      if (val === 'false' || val === false) return false
      return false
    }),
})

export async function POST(request: NextRequest) {
  const requestId = randomUUID().slice(0, 8)
  let client = null

  try {
    const body = await request.json()
    const params = UpdateSchema.parse(body)

    logger.info(
      `[${requestId}] Updating document(s) in ${params.host}:${params.port}/${params.database}.${params.collection} (multi: ${params.multi}, upsert: ${params.upsert})`
    )

    const sanitizedCollection = sanitizeCollectionName(params.collection)

    const filterValidation = validateFilter(params.filter)
    if (!filterValidation.isValid) {
      logger.warn(`[${requestId}] Filter validation failed: ${filterValidation.error}`)
      return NextResponse.json(
        { error: `Filter validation failed: ${filterValidation.error}` },
        { status: 400 }
      )
    }

    let filterDoc
    let updateDoc
    try {
      filterDoc = JSON.parse(params.filter)
      updateDoc = JSON.parse(params.update)
    } catch (error) {
      logger.warn(`[${requestId}] Invalid JSON in filter or update`)
      return NextResponse.json(
        { error: 'Invalid JSON format in filter or update' },
        { status: 400 }
      )
    }

    client = await createMongoDBConnection({
      host: params.host,
      port: params.port,
      database: params.database,
      username: params.username,
      password: params.password,
      authSource: params.authSource,
      ssl: params.ssl,
    })

    const db = client.db(params.database)
    const coll = db.collection(sanitizedCollection)

    let result
    if (params.multi) {
      result = await coll.updateMany(filterDoc, updateDoc, { upsert: params.upsert })
    } else {
      result = await coll.updateOne(filterDoc, updateDoc, { upsert: params.upsert })
    }

    logger.info(
      `[${requestId}] Update completed: ${result.modifiedCount} modified, ${result.matchedCount} matched${result.upsertedCount ? `, ${result.upsertedCount} upserted` : ''}`
    )

    return NextResponse.json({
      message: `${result.modifiedCount} documents updated${result.upsertedCount ? `, ${result.upsertedCount} documents upserted` : ''}`,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      documentCount: result.modifiedCount + (result.upsertedCount || 0),
      ...(result.upsertedId && { insertedId: result.upsertedId.toString() }),
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn(`[${requestId}] Invalid request data`, { errors: error.errors })
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    logger.error(`[${requestId}] MongoDB update failed:`, error)

    return NextResponse.json({ error: `MongoDB update failed: ${errorMessage}` }, { status: 500 })
  } finally {
    if (client) {
      await client.close()
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/app/api/tools/mysql/utils.ts

```typescript
import mysql from 'mysql2/promise'

export interface MySQLConnectionConfig {
  host: string
  port: number
  database: string
  username: string
  password: string
  ssl?: 'disabled' | 'required' | 'preferred'
}

export async function createMySQLConnection(config: MySQLConnectionConfig) {
  const connectionConfig: mysql.ConnectionOptions = {
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.username,
    password: config.password,
  }

  if (config.ssl === 'disabled') {
  } else if (config.ssl === 'required') {
    connectionConfig.ssl = { rejectUnauthorized: true }
  } else if (config.ssl === 'preferred') {
    connectionConfig.ssl = { rejectUnauthorized: false }
  }

  return mysql.createConnection(connectionConfig)
}

export async function executeQuery(
  connection: mysql.Connection,
  query: string,
  values?: unknown[]
) {
  const [rows, fields] = await connection.execute(query, values)

  if (Array.isArray(rows)) {
    return {
      rows: rows as unknown[],
      rowCount: rows.length,
      fields,
    }
  }

  return {
    rows: [],
    rowCount: (rows as mysql.ResultSetHeader).affectedRows || 0,
    fields,
  }
}

export function validateQuery(query: string): { isValid: boolean; error?: string } {
  const trimmedQuery = query.trim().toLowerCase()

  const allowedStatements = /^(select|insert|update|delete|with|show|describe|explain)\s+/i
  if (!allowedStatements.test(trimmedQuery)) {
    return {
      isValid: false,
      error:
        'Only SELECT, INSERT, UPDATE, DELETE, WITH, SHOW, DESCRIBE, and EXPLAIN statements are allowed',
    }
  }

  return { isValid: true }
}

export function buildInsertQuery(table: string, data: Record<string, unknown>) {
  const sanitizedTable = sanitizeIdentifier(table)
  const columns = Object.keys(data)
  const values = Object.values(data)
  const placeholders = columns.map(() => '?').join(', ')

  const query = `INSERT INTO ${sanitizedTable} (${columns.map(sanitizeIdentifier).join(', ')}) VALUES (${placeholders})`

  return { query, values }
}

export function buildUpdateQuery(table: string, data: Record<string, unknown>, where: string) {
  validateWhereClause(where)

  const sanitizedTable = sanitizeIdentifier(table)
  const columns = Object.keys(data)
  const values = Object.values(data)

  const setClause = columns.map((col) => `${sanitizeIdentifier(col)} = ?`).join(', ')
  const query = `UPDATE ${sanitizedTable} SET ${setClause} WHERE ${where}`

  return { query, values }
}

export function buildDeleteQuery(table: string, where: string) {
  validateWhereClause(where)

  const sanitizedTable = sanitizeIdentifier(table)
  const query = `DELETE FROM ${sanitizedTable} WHERE ${where}`

  return { query, values: [] }
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

export function sanitizeIdentifier(identifier: string): string {
  if (identifier.includes('.')) {
    const parts = identifier.split('.')
    return parts.map((part) => sanitizeSingleIdentifier(part)).join('.')
  }

  return sanitizeSingleIdentifier(identifier)
}

function sanitizeSingleIdentifier(identifier: string): string {
  const cleaned = identifier.replace(/`/g, '')

  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(cleaned)) {
    throw new Error(
      `Invalid identifier: ${identifier}. Identifiers must start with a letter or underscore and contain only letters, numbers, and underscores.`
    )
  }

  return `\`${cleaned}\``
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/mysql/delete/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createLogger } from '@/lib/logs/console/logger'
import { buildDeleteQuery, createMySQLConnection, executeQuery } from '@/app/api/tools/mysql/utils'

const logger = createLogger('MySQLDeleteAPI')

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

    const connection = await createMySQLConnection({
      host: params.host,
      port: params.port,
      database: params.database,
      username: params.username,
      password: params.password,
      ssl: params.ssl,
    })

    try {
      const { query, values } = buildDeleteQuery(params.table, params.where)
      const result = await executeQuery(connection, query, values)

      logger.info(`[${requestId}] Delete executed successfully, ${result.rowCount} row(s) deleted`)

      return NextResponse.json({
        message: `Data deleted successfully. ${result.rowCount} row(s) affected.`,
        rows: result.rows,
        rowCount: result.rowCount,
      })
    } finally {
      await connection.end()
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
    logger.error(`[${requestId}] MySQL delete failed:`, error)

    return NextResponse.json({ error: `MySQL delete failed: ${errorMessage}` }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/mysql/execute/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createLogger } from '@/lib/logs/console/logger'
import { createMySQLConnection, executeQuery, validateQuery } from '@/app/api/tools/mysql/utils'

const logger = createLogger('MySQLExecuteAPI')

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

    const connection = await createMySQLConnection({
      host: params.host,
      port: params.port,
      database: params.database,
      username: params.username,
      password: params.password,
      ssl: params.ssl,
    })

    try {
      const result = await executeQuery(connection, params.query)

      logger.info(`[${requestId}] SQL executed successfully, ${result.rowCount} row(s) affected`)

      return NextResponse.json({
        message: `SQL executed successfully. ${result.rowCount} row(s) affected.`,
        rows: result.rows,
        rowCount: result.rowCount,
      })
    } finally {
      await connection.end()
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
    logger.error(`[${requestId}] MySQL execute failed:`, error)

    return NextResponse.json({ error: `MySQL execute failed: ${errorMessage}` }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/mysql/insert/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createLogger } from '@/lib/logs/console/logger'
import { buildInsertQuery, createMySQLConnection, executeQuery } from '@/app/api/tools/mysql/utils'

const logger = createLogger('MySQLInsertAPI')

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

    const connection = await createMySQLConnection({
      host: params.host,
      port: params.port,
      database: params.database,
      username: params.username,
      password: params.password,
      ssl: params.ssl,
    })

    try {
      const { query, values } = buildInsertQuery(params.table, params.data)
      const result = await executeQuery(connection, query, values)

      logger.info(`[${requestId}] Insert executed successfully, ${result.rowCount} row(s) inserted`)

      return NextResponse.json({
        message: `Data inserted successfully. ${result.rowCount} row(s) affected.`,
        rows: result.rows,
        rowCount: result.rowCount,
      })
    } finally {
      await connection.end()
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
    logger.error(`[${requestId}] MySQL insert failed:`, error)

    return NextResponse.json({ error: `MySQL insert failed: ${errorMessage}` }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/mysql/query/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createLogger } from '@/lib/logs/console/logger'
import { createMySQLConnection, executeQuery, validateQuery } from '@/app/api/tools/mysql/utils'

const logger = createLogger('MySQLQueryAPI')

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
      `[${requestId}] Executing MySQL query on ${params.host}:${params.port}/${params.database}`
    )

    const validation = validateQuery(params.query)
    if (!validation.isValid) {
      logger.warn(`[${requestId}] Query validation failed: ${validation.error}`)
      return NextResponse.json(
        { error: `Query validation failed: ${validation.error}` },
        { status: 400 }
      )
    }

    const connection = await createMySQLConnection({
      host: params.host,
      port: params.port,
      database: params.database,
      username: params.username,
      password: params.password,
      ssl: params.ssl,
    })

    try {
      const result = await executeQuery(connection, params.query)

      logger.info(`[${requestId}] Query executed successfully, returned ${result.rowCount} rows`)

      return NextResponse.json({
        message: `Query executed successfully. ${result.rowCount} row(s) returned.`,
        rows: result.rows,
        rowCount: result.rowCount,
      })
    } finally {
      await connection.end()
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
    logger.error(`[${requestId}] MySQL query failed:`, error)

    return NextResponse.json({ error: `MySQL query failed: ${errorMessage}` }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/mysql/update/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createLogger } from '@/lib/logs/console/logger'
import { buildUpdateQuery, createMySQLConnection, executeQuery } from '@/app/api/tools/mysql/utils'

const logger = createLogger('MySQLUpdateAPI')

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

    const connection = await createMySQLConnection({
      host: params.host,
      port: params.port,
      database: params.database,
      username: params.username,
      password: params.password,
      ssl: params.ssl,
    })

    try {
      const { query, values } = buildUpdateQuery(params.table, params.data, params.where)
      const result = await executeQuery(connection, query, values)

      logger.info(`[${requestId}] Update executed successfully, ${result.rowCount} row(s) updated`)

      return NextResponse.json({
        message: `Data updated successfully. ${result.rowCount} row(s) affected.`,
        rows: result.rows,
        rowCount: result.rowCount,
      })
    } finally {
      await connection.end()
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
    logger.error(`[${requestId}] MySQL update failed:`, error)

    return NextResponse.json({ error: `MySQL update failed: ${errorMessage}` }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/app/api/tools/neo4j/utils.ts

```typescript
import neo4j from 'neo4j-driver'
import type { Neo4jConnectionConfig } from '@/tools/neo4j/types'

export async function createNeo4jDriver(config: Neo4jConnectionConfig) {
  const isAuraHost =
    config.host === 'databases.neo4j.io' || config.host.endsWith('.databases.neo4j.io')

  let protocol: string
  if (isAuraHost) {
    protocol = 'neo4j+s'
  } else {
    protocol = config.encryption === 'enabled' ? 'bolt+s' : 'bolt'
  }

  const uri = `${protocol}://${config.host}:${config.port}`

  const driverConfig: any = {
    maxConnectionPoolSize: 1,
    connectionTimeout: 10000,
  }

  if (!protocol.endsWith('+s')) {
    driverConfig.encrypted = config.encryption === 'enabled' ? 'ENCRYPTION_ON' : 'ENCRYPTION_OFF'
  }

  const driver = neo4j.driver(uri, neo4j.auth.basic(config.username, config.password), driverConfig)

  await driver.verifyConnectivity()

  return driver
}

export function validateCypherQuery(query: string): { isValid: boolean; error?: string } {
  if (!query || typeof query !== 'string') {
    return {
      isValid: false,
      error: 'Query must be a non-empty string',
    }
  }

  const trimmedQuery = query.trim()
  if (trimmedQuery.length === 0) {
    return {
      isValid: false,
      error: 'Query cannot be empty',
    }
  }

  return { isValid: true }
}

export function sanitizeLabelName(name: string): string {
  if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(name)) {
    throw new Error(
      'Invalid label name. Must start with a letter and contain only letters, numbers, and underscores.'
    )
  }
  return name
}

export function sanitizePropertyKey(key: string): string {
  if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(key)) {
    throw new Error(
      'Invalid property key. Must start with a letter and contain only letters, numbers, and underscores.'
    )
  }
  return key
}

export function sanitizeRelationshipType(type: string): string {
  if (!/^[A-Z][A-Z0-9_]*$/.test(type)) {
    throw new Error(
      'Invalid relationship type. Must start with an uppercase letter and contain only uppercase letters, numbers, and underscores.'
    )
  }
  return type
}

export function convertNeo4jTypesToJSON(value: unknown): unknown {
  if (value === null || value === undefined) {
    return value
  }

  if (typeof value === 'object' && value !== null && 'toNumber' in value) {
    return (value as any).toNumber()
  }

  if (Array.isArray(value)) {
    return value.map(convertNeo4jTypesToJSON)
  }

  if (typeof value === 'object') {
    const obj = value as any

    if (obj.labels && obj.properties && obj.identity) {
      return {
        identity: obj.identity.toNumber ? obj.identity.toNumber() : obj.identity,
        labels: obj.labels,
        properties: convertNeo4jTypesToJSON(obj.properties),
      }
    }

    if (obj.type && obj.properties && obj.identity && obj.start && obj.end) {
      return {
        identity: obj.identity.toNumber ? obj.identity.toNumber() : obj.identity,
        start: obj.start.toNumber ? obj.start.toNumber() : obj.start,
        end: obj.end.toNumber ? obj.end.toNumber() : obj.end,
        type: obj.type,
        properties: convertNeo4jTypesToJSON(obj.properties),
      }
    }

    if (obj.start && obj.end && obj.segments) {
      return {
        start: convertNeo4jTypesToJSON(obj.start),
        end: convertNeo4jTypesToJSON(obj.end),
        segments: obj.segments.map((seg: any) => ({
          start: convertNeo4jTypesToJSON(seg.start),
          relationship: convertNeo4jTypesToJSON(seg.relationship),
          end: convertNeo4jTypesToJSON(seg.end),
        })),
        length: obj.length,
      }
    }

    const result: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(obj)) {
      result[key] = convertNeo4jTypesToJSON(val)
    }
    return result
  }

  return value
}
```

--------------------------------------------------------------------------------

````
