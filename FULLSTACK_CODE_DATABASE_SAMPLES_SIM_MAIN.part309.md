---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 309
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 309 of 933)

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
Location: sim-main/apps/sim/app/api/tools/neo4j/create/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createLogger } from '@/lib/logs/console/logger'
import {
  convertNeo4jTypesToJSON,
  createNeo4jDriver,
  validateCypherQuery,
} from '@/app/api/tools/neo4j/utils'

const logger = createLogger('Neo4jCreateAPI')

const CreateSchema = z.object({
  host: z.string().min(1, 'Host is required'),
  port: z.coerce.number().int().positive('Port must be a positive integer'),
  database: z.string().min(1, 'Database name is required'),
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  encryption: z.enum(['enabled', 'disabled']).default('disabled'),
  cypherQuery: z.string().min(1, 'Cypher query is required'),
  parameters: z.record(z.unknown()).nullable().optional().default({}),
})

export async function POST(request: NextRequest) {
  const requestId = randomUUID().slice(0, 8)
  let driver = null
  let session = null

  try {
    const body = await request.json()
    const params = CreateSchema.parse(body)

    logger.info(
      `[${requestId}] Executing Neo4j create on ${params.host}:${params.port}/${params.database}`
    )

    const validation = validateCypherQuery(params.cypherQuery)
    if (!validation.isValid) {
      logger.warn(`[${requestId}] Cypher query validation failed: ${validation.error}`)
      return NextResponse.json(
        { error: `Query validation failed: ${validation.error}` },
        { status: 400 }
      )
    }

    driver = await createNeo4jDriver({
      host: params.host,
      port: params.port,
      database: params.database,
      username: params.username,
      password: params.password,
      encryption: params.encryption,
    })

    session = driver.session({ database: params.database })

    const result = await session.run(params.cypherQuery, params.parameters)

    const records = result.records.map((record) => {
      const obj: Record<string, unknown> = {}
      record.keys.forEach((key) => {
        if (typeof key === 'string') {
          obj[key] = convertNeo4jTypesToJSON(record.get(key))
        }
      })
      return obj
    })

    const summary = {
      resultAvailableAfter: result.summary.resultAvailableAfter.toNumber(),
      resultConsumedAfter: result.summary.resultConsumedAfter.toNumber(),
      counters: {
        nodesCreated: result.summary.counters.updates().nodesCreated,
        nodesDeleted: result.summary.counters.updates().nodesDeleted,
        relationshipsCreated: result.summary.counters.updates().relationshipsCreated,
        relationshipsDeleted: result.summary.counters.updates().relationshipsDeleted,
        propertiesSet: result.summary.counters.updates().propertiesSet,
        labelsAdded: result.summary.counters.updates().labelsAdded,
        labelsRemoved: result.summary.counters.updates().labelsRemoved,
        indexesAdded: result.summary.counters.updates().indexesAdded,
        indexesRemoved: result.summary.counters.updates().indexesRemoved,
        constraintsAdded: result.summary.counters.updates().constraintsAdded,
        constraintsRemoved: result.summary.counters.updates().constraintsRemoved,
      },
    }

    logger.info(
      `[${requestId}] Create executed successfully, created ${summary.counters.nodesCreated} nodes and ${summary.counters.relationshipsCreated} relationships, returned ${records.length} records`
    )

    return NextResponse.json({
      message: `Created ${summary.counters.nodesCreated} nodes and ${summary.counters.relationshipsCreated} relationships`,
      records,
      recordCount: records.length,
      summary,
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
    logger.error(`[${requestId}] Neo4j create failed:`, error)

    return NextResponse.json({ error: `Neo4j create failed: ${errorMessage}` }, { status: 500 })
  } finally {
    if (session) {
      await session.close()
    }
    if (driver) {
      await driver.close()
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/neo4j/delete/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createLogger } from '@/lib/logs/console/logger'
import { createNeo4jDriver, validateCypherQuery } from '@/app/api/tools/neo4j/utils'

const logger = createLogger('Neo4jDeleteAPI')

const DeleteSchema = z.object({
  host: z.string().min(1, 'Host is required'),
  port: z.coerce.number().int().positive('Port must be a positive integer'),
  database: z.string().min(1, 'Database name is required'),
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  encryption: z.enum(['enabled', 'disabled']).default('disabled'),
  cypherQuery: z.string().min(1, 'Cypher query is required'),
  parameters: z.record(z.unknown()).nullable().optional().default({}),
  detach: z.boolean().optional().default(false),
})

export async function POST(request: NextRequest) {
  const requestId = randomUUID().slice(0, 8)
  let driver = null
  let session = null

  try {
    const body = await request.json()
    const params = DeleteSchema.parse(body)

    logger.info(
      `[${requestId}] Executing Neo4j delete on ${params.host}:${params.port}/${params.database}`
    )

    const validation = validateCypherQuery(params.cypherQuery)
    if (!validation.isValid) {
      logger.warn(`[${requestId}] Cypher query validation failed: ${validation.error}`)
      return NextResponse.json(
        { error: `Query validation failed: ${validation.error}` },
        { status: 400 }
      )
    }

    driver = await createNeo4jDriver({
      host: params.host,
      port: params.port,
      database: params.database,
      username: params.username,
      password: params.password,
      encryption: params.encryption,
    })

    session = driver.session({ database: params.database })

    const result = await session.run(params.cypherQuery, params.parameters)

    const summary = {
      resultAvailableAfter: result.summary.resultAvailableAfter.toNumber(),
      resultConsumedAfter: result.summary.resultConsumedAfter.toNumber(),
      counters: {
        nodesCreated: result.summary.counters.updates().nodesCreated,
        nodesDeleted: result.summary.counters.updates().nodesDeleted,
        relationshipsCreated: result.summary.counters.updates().relationshipsCreated,
        relationshipsDeleted: result.summary.counters.updates().relationshipsDeleted,
        propertiesSet: result.summary.counters.updates().propertiesSet,
        labelsAdded: result.summary.counters.updates().labelsAdded,
        labelsRemoved: result.summary.counters.updates().labelsRemoved,
        indexesAdded: result.summary.counters.updates().indexesAdded,
        indexesRemoved: result.summary.counters.updates().indexesRemoved,
        constraintsAdded: result.summary.counters.updates().constraintsAdded,
        constraintsRemoved: result.summary.counters.updates().constraintsRemoved,
      },
    }

    logger.info(
      `[${requestId}] Delete executed successfully, deleted ${summary.counters.nodesDeleted} nodes and ${summary.counters.relationshipsDeleted} relationships`
    )

    return NextResponse.json({
      message: `Deleted ${summary.counters.nodesDeleted} nodes and ${summary.counters.relationshipsDeleted} relationships`,
      summary,
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
    logger.error(`[${requestId}] Neo4j delete failed:`, error)

    return NextResponse.json({ error: `Neo4j delete failed: ${errorMessage}` }, { status: 500 })
  } finally {
    if (session) {
      await session.close()
    }
    if (driver) {
      await driver.close()
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/neo4j/execute/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createLogger } from '@/lib/logs/console/logger'
import {
  convertNeo4jTypesToJSON,
  createNeo4jDriver,
  validateCypherQuery,
} from '@/app/api/tools/neo4j/utils'

const logger = createLogger('Neo4jExecuteAPI')

const ExecuteSchema = z.object({
  host: z.string().min(1, 'Host is required'),
  port: z.coerce.number().int().positive('Port must be a positive integer'),
  database: z.string().min(1, 'Database name is required'),
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  encryption: z.enum(['enabled', 'disabled']).default('disabled'),
  cypherQuery: z.string().min(1, 'Cypher query is required'),
  parameters: z.record(z.unknown()).nullable().optional().default({}),
})

export async function POST(request: NextRequest) {
  const requestId = randomUUID().slice(0, 8)
  let driver = null
  let session = null

  try {
    const body = await request.json()
    const params = ExecuteSchema.parse(body)

    logger.info(
      `[${requestId}] Executing Neo4j query on ${params.host}:${params.port}/${params.database}`
    )

    const validation = validateCypherQuery(params.cypherQuery)
    if (!validation.isValid) {
      logger.warn(`[${requestId}] Cypher query validation failed: ${validation.error}`)
      return NextResponse.json(
        { error: `Query validation failed: ${validation.error}` },
        { status: 400 }
      )
    }

    driver = await createNeo4jDriver({
      host: params.host,
      port: params.port,
      database: params.database,
      username: params.username,
      password: params.password,
      encryption: params.encryption,
    })

    session = driver.session({ database: params.database })

    const result = await session.run(params.cypherQuery, params.parameters)

    const records = result.records.map((record) => {
      const obj: Record<string, unknown> = {}
      record.keys.forEach((key) => {
        if (typeof key === 'string') {
          obj[key] = convertNeo4jTypesToJSON(record.get(key))
        }
      })
      return obj
    })

    const summary = {
      resultAvailableAfter: result.summary.resultAvailableAfter.toNumber(),
      resultConsumedAfter: result.summary.resultConsumedAfter.toNumber(),
      counters: {
        nodesCreated: result.summary.counters.updates().nodesCreated,
        nodesDeleted: result.summary.counters.updates().nodesDeleted,
        relationshipsCreated: result.summary.counters.updates().relationshipsCreated,
        relationshipsDeleted: result.summary.counters.updates().relationshipsDeleted,
        propertiesSet: result.summary.counters.updates().propertiesSet,
        labelsAdded: result.summary.counters.updates().labelsAdded,
        labelsRemoved: result.summary.counters.updates().labelsRemoved,
        indexesAdded: result.summary.counters.updates().indexesAdded,
        indexesRemoved: result.summary.counters.updates().indexesRemoved,
        constraintsAdded: result.summary.counters.updates().constraintsAdded,
        constraintsRemoved: result.summary.counters.updates().constraintsRemoved,
      },
    }

    logger.info(`[${requestId}] Query executed successfully, returned ${records.length} records`)

    return NextResponse.json({
      message: `Query executed successfully, returned ${records.length} records`,
      records,
      recordCount: records.length,
      summary,
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
    logger.error(`[${requestId}] Neo4j execute failed:`, error)

    return NextResponse.json({ error: `Neo4j execute failed: ${errorMessage}` }, { status: 500 })
  } finally {
    if (session) {
      await session.close()
    }
    if (driver) {
      await driver.close()
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/neo4j/merge/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createLogger } from '@/lib/logs/console/logger'
import {
  convertNeo4jTypesToJSON,
  createNeo4jDriver,
  validateCypherQuery,
} from '@/app/api/tools/neo4j/utils'

const logger = createLogger('Neo4jMergeAPI')

const MergeSchema = z.object({
  host: z.string().min(1, 'Host is required'),
  port: z.coerce.number().int().positive('Port must be a positive integer'),
  database: z.string().min(1, 'Database name is required'),
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  encryption: z.enum(['enabled', 'disabled']).default('disabled'),
  cypherQuery: z.string().min(1, 'Cypher query is required'),
  parameters: z.record(z.unknown()).nullable().optional().default({}),
})

export async function POST(request: NextRequest) {
  const requestId = randomUUID().slice(0, 8)
  let driver = null
  let session = null

  try {
    const body = await request.json()
    const params = MergeSchema.parse(body)

    logger.info(
      `[${requestId}] Executing Neo4j merge on ${params.host}:${params.port}/${params.database}`
    )

    const validation = validateCypherQuery(params.cypherQuery)
    if (!validation.isValid) {
      logger.warn(`[${requestId}] Cypher query validation failed: ${validation.error}`)
      return NextResponse.json(
        { error: `Query validation failed: ${validation.error}` },
        { status: 400 }
      )
    }

    driver = await createNeo4jDriver({
      host: params.host,
      port: params.port,
      database: params.database,
      username: params.username,
      password: params.password,
      encryption: params.encryption,
    })

    session = driver.session({ database: params.database })

    const result = await session.run(params.cypherQuery, params.parameters)

    const records = result.records.map((record) => {
      const obj: Record<string, unknown> = {}
      record.keys.forEach((key) => {
        if (typeof key === 'string') {
          obj[key] = convertNeo4jTypesToJSON(record.get(key))
        }
      })
      return obj
    })

    const summary = {
      resultAvailableAfter: result.summary.resultAvailableAfter.toNumber(),
      resultConsumedAfter: result.summary.resultConsumedAfter.toNumber(),
      counters: {
        nodesCreated: result.summary.counters.updates().nodesCreated,
        nodesDeleted: result.summary.counters.updates().nodesDeleted,
        relationshipsCreated: result.summary.counters.updates().relationshipsCreated,
        relationshipsDeleted: result.summary.counters.updates().relationshipsDeleted,
        propertiesSet: result.summary.counters.updates().propertiesSet,
        labelsAdded: result.summary.counters.updates().labelsAdded,
        labelsRemoved: result.summary.counters.updates().labelsRemoved,
        indexesAdded: result.summary.counters.updates().indexesAdded,
        indexesRemoved: result.summary.counters.updates().indexesRemoved,
        constraintsAdded: result.summary.counters.updates().constraintsAdded,
        constraintsRemoved: result.summary.counters.updates().constraintsRemoved,
      },
    }

    logger.info(
      `[${requestId}] Merge executed successfully, created ${summary.counters.nodesCreated} nodes, ${summary.counters.relationshipsCreated} relationships, returned ${records.length} records`
    )

    return NextResponse.json({
      message: `Merge completed: ${summary.counters.nodesCreated} nodes created, ${summary.counters.relationshipsCreated} relationships created`,
      records,
      recordCount: records.length,
      summary,
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
    logger.error(`[${requestId}] Neo4j merge failed:`, error)

    return NextResponse.json({ error: `Neo4j merge failed: ${errorMessage}` }, { status: 500 })
  } finally {
    if (session) {
      await session.close()
    }
    if (driver) {
      await driver.close()
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/neo4j/query/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createLogger } from '@/lib/logs/console/logger'
import {
  convertNeo4jTypesToJSON,
  createNeo4jDriver,
  validateCypherQuery,
} from '@/app/api/tools/neo4j/utils'

const logger = createLogger('Neo4jQueryAPI')

const QuerySchema = z.object({
  host: z.string().min(1, 'Host is required'),
  port: z.coerce.number().int().positive('Port must be a positive integer'),
  database: z.string().min(1, 'Database name is required'),
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  encryption: z.enum(['enabled', 'disabled']).default('disabled'),
  cypherQuery: z.string().min(1, 'Cypher query is required'),
  parameters: z.record(z.unknown()).nullable().optional().default({}),
})

export async function POST(request: NextRequest) {
  const requestId = randomUUID().slice(0, 8)
  let driver = null
  let session = null

  try {
    const body = await request.json()
    const params = QuerySchema.parse(body)

    logger.info(
      `[${requestId}] Executing Neo4j query on ${params.host}:${params.port}/${params.database}`
    )

    const validation = validateCypherQuery(params.cypherQuery)
    if (!validation.isValid) {
      logger.warn(`[${requestId}] Cypher query validation failed: ${validation.error}`)
      return NextResponse.json(
        { error: `Query validation failed: ${validation.error}` },
        { status: 400 }
      )
    }

    driver = await createNeo4jDriver({
      host: params.host,
      port: params.port,
      database: params.database,
      username: params.username,
      password: params.password,
      encryption: params.encryption,
    })

    session = driver.session({ database: params.database })

    const result = await session.run(params.cypherQuery, params.parameters)

    const records = result.records.map((record) => {
      const obj: Record<string, unknown> = {}
      record.keys.forEach((key) => {
        if (typeof key === 'string') {
          obj[key] = convertNeo4jTypesToJSON(record.get(key))
        }
      })
      return obj
    })

    const summary = {
      resultAvailableAfter: result.summary.resultAvailableAfter.toNumber(),
      resultConsumedAfter: result.summary.resultConsumedAfter.toNumber(),
      counters: {
        nodesCreated: result.summary.counters.updates().nodesCreated,
        nodesDeleted: result.summary.counters.updates().nodesDeleted,
        relationshipsCreated: result.summary.counters.updates().relationshipsCreated,
        relationshipsDeleted: result.summary.counters.updates().relationshipsDeleted,
        propertiesSet: result.summary.counters.updates().propertiesSet,
        labelsAdded: result.summary.counters.updates().labelsAdded,
        labelsRemoved: result.summary.counters.updates().labelsRemoved,
        indexesAdded: result.summary.counters.updates().indexesAdded,
        indexesRemoved: result.summary.counters.updates().indexesRemoved,
        constraintsAdded: result.summary.counters.updates().constraintsAdded,
        constraintsRemoved: result.summary.counters.updates().constraintsRemoved,
      },
    }

    logger.info(`[${requestId}] Query executed successfully, returned ${records.length} records`)

    return NextResponse.json({
      message: `Found ${records.length} records`,
      records,
      recordCount: records.length,
      summary,
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
    logger.error(`[${requestId}] Neo4j query failed:`, error)

    return NextResponse.json({ error: `Neo4j query failed: ${errorMessage}` }, { status: 500 })
  } finally {
    if (session) {
      await session.close()
    }
    if (driver) {
      await driver.close()
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/neo4j/update/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createLogger } from '@/lib/logs/console/logger'
import {
  convertNeo4jTypesToJSON,
  createNeo4jDriver,
  validateCypherQuery,
} from '@/app/api/tools/neo4j/utils'

const logger = createLogger('Neo4jUpdateAPI')

const UpdateSchema = z.object({
  host: z.string().min(1, 'Host is required'),
  port: z.coerce.number().int().positive('Port must be a positive integer'),
  database: z.string().min(1, 'Database name is required'),
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  encryption: z.enum(['enabled', 'disabled']).default('disabled'),
  cypherQuery: z.string().min(1, 'Cypher query is required'),
  parameters: z.record(z.unknown()).nullable().optional().default({}),
})

export async function POST(request: NextRequest) {
  const requestId = randomUUID().slice(0, 8)
  let driver = null
  let session = null

  try {
    const body = await request.json()
    const params = UpdateSchema.parse(body)

    logger.info(
      `[${requestId}] Executing Neo4j update on ${params.host}:${params.port}/${params.database}`
    )

    const validation = validateCypherQuery(params.cypherQuery)
    if (!validation.isValid) {
      logger.warn(`[${requestId}] Cypher query validation failed: ${validation.error}`)
      return NextResponse.json(
        { error: `Query validation failed: ${validation.error}` },
        { status: 400 }
      )
    }

    driver = await createNeo4jDriver({
      host: params.host,
      port: params.port,
      database: params.database,
      username: params.username,
      password: params.password,
      encryption: params.encryption,
    })

    session = driver.session({ database: params.database })

    const result = await session.run(params.cypherQuery, params.parameters)

    const records = result.records.map((record) => {
      const obj: Record<string, unknown> = {}
      record.keys.forEach((key) => {
        if (typeof key === 'string') {
          obj[key] = convertNeo4jTypesToJSON(record.get(key))
        }
      })
      return obj
    })

    const summary = {
      resultAvailableAfter: result.summary.resultAvailableAfter.toNumber(),
      resultConsumedAfter: result.summary.resultConsumedAfter.toNumber(),
      counters: {
        nodesCreated: result.summary.counters.updates().nodesCreated,
        nodesDeleted: result.summary.counters.updates().nodesDeleted,
        relationshipsCreated: result.summary.counters.updates().relationshipsCreated,
        relationshipsDeleted: result.summary.counters.updates().relationshipsDeleted,
        propertiesSet: result.summary.counters.updates().propertiesSet,
        labelsAdded: result.summary.counters.updates().labelsAdded,
        labelsRemoved: result.summary.counters.updates().labelsRemoved,
        indexesAdded: result.summary.counters.updates().indexesAdded,
        indexesRemoved: result.summary.counters.updates().indexesRemoved,
        constraintsAdded: result.summary.counters.updates().constraintsAdded,
        constraintsRemoved: result.summary.counters.updates().constraintsRemoved,
      },
    }

    logger.info(
      `[${requestId}] Update executed successfully, ${summary.counters.propertiesSet} properties set, returned ${records.length} records`
    )

    return NextResponse.json({
      message: `Updated ${summary.counters.propertiesSet} properties`,
      records,
      recordCount: records.length,
      summary,
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
    logger.error(`[${requestId}] Neo4j update failed:`, error)

    return NextResponse.json({ error: `Neo4j update failed: ${errorMessage}` }, { status: 500 })
  } finally {
    if (session) {
      await session.close()
    }
    if (driver) {
      await driver.close()
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/onedrive/files/route.ts
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

export const dynamic = 'force-dynamic'

const logger = createLogger('OneDriveFilesAPI')

import type { MicrosoftGraphDriveItem } from '@/tools/onedrive/types'

/**
 * Get files (not folders) from Microsoft OneDrive
 */
export async function GET(request: NextRequest) {
  const requestId = randomUUID().slice(0, 8)
  logger.info(`[${requestId}] OneDrive files request received`)

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthenticated request rejected`)
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const credentialId = searchParams.get('credentialId')
    const query = searchParams.get('query') || ''

    if (!credentialId) {
      logger.warn(`[${requestId}] Missing credential ID`)
      return NextResponse.json({ error: 'Credential ID is required' }, { status: 400 })
    }

    logger.info(`[${requestId}] Fetching credential`, { credentialId })

    const credentials = await db.select().from(account).where(eq(account.id, credentialId)).limit(1)
    if (!credentials.length) {
      logger.warn(`[${requestId}] Credential not found`, { credentialId })
      return NextResponse.json({ error: 'Credential not found' }, { status: 404 })
    }

    const credential = credentials[0]
    if (credential.userId !== session.user.id) {
      logger.warn(`[${requestId}] Unauthorized credential access attempt`, {
        credentialUserId: credential.userId,
        requestUserId: session.user.id,
      })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const accessToken = await refreshAccessTokenIfNeeded(credentialId, session.user.id, requestId)
    if (!accessToken) {
      logger.error(`[${requestId}] Failed to obtain valid access token`)
      return NextResponse.json({ error: 'Failed to obtain valid access token' }, { status: 401 })
    }

    // Use search endpoint if query provided, otherwise list root children
    // Microsoft Graph API doesn't support $filter on file/folder properties for /children endpoint
    let url: string
    if (query) {
      // Use search endpoint with query
      const searchParams_new = new URLSearchParams()
      searchParams_new.append(
        '$select',
        'id,name,file,webUrl,size,createdDateTime,lastModifiedDateTime,createdBy,thumbnails'
      )
      searchParams_new.append('$top', '50')
      url = `https://graph.microsoft.com/v1.0/me/drive/root/search(q='${encodeURIComponent(query)}')?${searchParams_new.toString()}`
    } else {
      // List all children (files and folders) from root
      const searchParams_new = new URLSearchParams()
      searchParams_new.append(
        '$select',
        'id,name,file,folder,webUrl,size,createdDateTime,lastModifiedDateTime,createdBy,thumbnails'
      )
      searchParams_new.append('$top', '50')
      url = `https://graph.microsoft.com/v1.0/me/drive/root/children?${searchParams_new.toString()}`
    }

    logger.info(`[${requestId}] Fetching files from Microsoft Graph`, { url })

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: 'Unknown error' } }))
      logger.error(`[${requestId}] Microsoft Graph API error`, {
        status: response.status,
        error: errorData.error?.message || 'Failed to fetch files from OneDrive',
      })
      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to fetch files from OneDrive' },
        { status: response.status }
      )
    }

    const data = await response.json()
    logger.info(`[${requestId}] Received ${data.value?.length || 0} items from Microsoft Graph`)

    // Log what we received to debug filtering
    const itemBreakdown = (data.value || []).reduce(
      (acc: any, item: MicrosoftGraphDriveItem) => {
        if (item.file) acc.files++
        if (item.folder) acc.folders++
        return acc
      },
      { files: 0, folders: 0 }
    )
    logger.info(`[${requestId}] Item breakdown`, itemBreakdown)

    const files = (data.value || [])
      .filter((item: MicrosoftGraphDriveItem) => {
        const isFile = !!item.file && !item.folder
        if (!isFile) {
          logger.debug(
            `[${requestId}] Filtering out item: ${item.name} (isFolder: ${!!item.folder})`
          )
        }
        return isFile
      })
      .map((file: MicrosoftGraphDriveItem) => ({
        id: file.id,
        name: file.name,
        mimeType: file.file?.mimeType || 'application/octet-stream',
        iconLink: file.thumbnails?.[0]?.small?.url,
        webViewLink: file.webUrl,
        thumbnailLink: file.thumbnails?.[0]?.medium?.url,
        createdTime: file.createdDateTime,
        modifiedTime: file.lastModifiedDateTime,
        size: file.size?.toString(),
        owners: file.createdBy
          ? [
              {
                displayName: file.createdBy.user?.displayName || 'Unknown',
                emailAddress: file.createdBy.user?.email || '',
              },
            ]
          : [],
      }))

    logger.info(
      `[${requestId}] Returning ${files.length} files (filtered from ${data.value?.length || 0} items)`
    )

    // Log the file IDs we're returning
    if (files.length > 0) {
      logger.info(`[${requestId}] File IDs being returned:`, {
        fileIds: files.slice(0, 5).map((f: any) => ({ id: f.id, name: f.name })),
      })
    }

    return NextResponse.json({ files }, { status: 200 })
  } catch (error) {
    logger.error(`[${requestId}] Error fetching files from OneDrive`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/onedrive/folder/route.ts
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

const logger = createLogger('OneDriveFolderAPI')

export async function GET(request: NextRequest) {
  const requestId = randomUUID().slice(0, 8)

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const credentialId = searchParams.get('credentialId')
    const fileId = searchParams.get('fileId')

    if (!credentialId || !fileId) {
      return NextResponse.json({ error: 'Credential ID and File ID are required' }, { status: 400 })
    }

    const fileIdValidation = validateMicrosoftGraphId(fileId, 'fileId')
    if (!fileIdValidation.isValid) {
      return NextResponse.json({ error: fileIdValidation.error }, { status: 400 })
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

    const response = await fetch(
      `https://graph.microsoft.com/v1.0/me/drive/items/${fileId}?$select=id,name,folder,webUrl,createdDateTime,lastModifiedDateTime`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: 'Unknown error' } }))
      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to fetch folder from OneDrive' },
        { status: response.status }
      )
    }

    const folder = await response.json()

    const transformedFolder = {
      id: folder.id,
      name: folder.name,
      mimeType: 'application/vnd.microsoft.graph.folder',
      webViewLink: folder.webUrl,
      createdTime: folder.createdDateTime,
      modifiedTime: folder.lastModifiedDateTime,
    }

    return NextResponse.json({ file: transformedFolder }, { status: 200 })
  } catch (error) {
    logger.error(`[${requestId}] Error fetching folder from OneDrive`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/onedrive/folders/route.ts
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

export const dynamic = 'force-dynamic'

const logger = createLogger('OneDriveFoldersAPI')

import type { MicrosoftGraphDriveItem } from '@/tools/onedrive/types'

/**
 * Get folders from Microsoft OneDrive
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

    // Build URL for OneDrive folders
    let url = `https://graph.microsoft.com/v1.0/me/drive/root/children?$filter=folder ne null&$select=id,name,folder,webUrl,createdDateTime,lastModifiedDateTime&$top=50`

    if (query) {
      url += `&$search="${encodeURIComponent(query)}"`
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: 'Unknown error' } }))
      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to fetch folders from OneDrive' },
        { status: response.status }
      )
    }

    const data = await response.json()
    const folders = (data.value || [])
      .filter((item: MicrosoftGraphDriveItem) => item.folder) // Only folders
      .map((folder: MicrosoftGraphDriveItem) => ({
        id: folder.id,
        name: folder.name,
        mimeType: 'application/vnd.microsoft.graph.folder',
        webViewLink: folder.webUrl,
        createdTime: folder.createdDateTime,
        modifiedTime: folder.lastModifiedDateTime,
      }))

    return NextResponse.json({ files: folders }, { status: 200 })
  } catch (error) {
    logger.error(`[${requestId}] Error fetching folders from OneDrive`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

````
