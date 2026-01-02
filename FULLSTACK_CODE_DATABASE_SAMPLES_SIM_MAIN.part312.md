---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 312
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 312 of 933)

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
Location: sim-main/apps/sim/app/api/tools/rds/execute/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createLogger } from '@/lib/logs/console/logger'
import { createRdsClient, executeStatement } from '@/app/api/tools/rds/utils'

const logger = createLogger('RDSExecuteAPI')

const ExecuteSchema = z.object({
  region: z.string().min(1, 'AWS region is required'),
  accessKeyId: z.string().min(1, 'AWS access key ID is required'),
  secretAccessKey: z.string().min(1, 'AWS secret access key is required'),
  resourceArn: z.string().min(1, 'Resource ARN is required'),
  secretArn: z.string().min(1, 'Secret ARN is required'),
  database: z.string().optional(),
  query: z.string().min(1, 'Query is required'),
})

export async function POST(request: NextRequest) {
  const requestId = randomUUID().slice(0, 8)

  try {
    const body = await request.json()
    const params = ExecuteSchema.parse(body)

    logger.info(`[${requestId}] Executing raw SQL on RDS database ${params.database}`)

    const client = createRdsClient({
      region: params.region,
      accessKeyId: params.accessKeyId,
      secretAccessKey: params.secretAccessKey,
      resourceArn: params.resourceArn,
      secretArn: params.secretArn,
      database: params.database,
    })

    try {
      const result = await executeStatement(
        client,
        params.resourceArn,
        params.secretArn,
        params.database,
        params.query
      )

      logger.info(`[${requestId}] Execute completed successfully, affected ${result.rowCount} rows`)

      return NextResponse.json({
        message: `Query executed successfully. ${result.rowCount} row(s) affected.`,
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
    logger.error(`[${requestId}] RDS execute failed:`, error)

    return NextResponse.json({ error: `RDS execute failed: ${errorMessage}` }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/rds/insert/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createLogger } from '@/lib/logs/console/logger'
import { createRdsClient, executeInsert } from '@/app/api/tools/rds/utils'

const logger = createLogger('RDSInsertAPI')

const InsertSchema = z.object({
  region: z.string().min(1, 'AWS region is required'),
  accessKeyId: z.string().min(1, 'AWS access key ID is required'),
  secretAccessKey: z.string().min(1, 'AWS secret access key is required'),
  resourceArn: z.string().min(1, 'Resource ARN is required'),
  secretArn: z.string().min(1, 'Secret ARN is required'),
  database: z.string().optional(),
  table: z.string().min(1, 'Table name is required'),
  data: z.record(z.unknown()).refine((obj) => Object.keys(obj).length > 0, {
    message: 'Data object must have at least one field',
  }),
})

export async function POST(request: NextRequest) {
  const requestId = randomUUID().slice(0, 8)

  try {
    const body = await request.json()
    const params = InsertSchema.parse(body)

    logger.info(`[${requestId}] Inserting into RDS table ${params.table} in ${params.database}`)

    const client = createRdsClient({
      region: params.region,
      accessKeyId: params.accessKeyId,
      secretAccessKey: params.secretAccessKey,
      resourceArn: params.resourceArn,
      secretArn: params.secretArn,
      database: params.database,
    })

    try {
      const result = await executeInsert(
        client,
        params.resourceArn,
        params.secretArn,
        params.database,
        params.table,
        params.data
      )

      logger.info(`[${requestId}] Insert executed successfully, affected ${result.rowCount} rows`)

      return NextResponse.json({
        message: `Insert executed successfully. ${result.rowCount} row(s) inserted.`,
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
    logger.error(`[${requestId}] RDS insert failed:`, error)

    return NextResponse.json({ error: `RDS insert failed: ${errorMessage}` }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/rds/query/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createLogger } from '@/lib/logs/console/logger'
import { createRdsClient, executeStatement, validateQuery } from '@/app/api/tools/rds/utils'

const logger = createLogger('RDSQueryAPI')

const QuerySchema = z.object({
  region: z.string().min(1, 'AWS region is required'),
  accessKeyId: z.string().min(1, 'AWS access key ID is required'),
  secretAccessKey: z.string().min(1, 'AWS secret access key is required'),
  resourceArn: z.string().min(1, 'Resource ARN is required'),
  secretArn: z.string().min(1, 'Secret ARN is required'),
  database: z.string().optional(),
  query: z.string().min(1, 'Query is required'),
})

export async function POST(request: NextRequest) {
  const requestId = randomUUID().slice(0, 8)

  try {
    const body = await request.json()
    const params = QuerySchema.parse(body)

    logger.info(`[${requestId}] Executing RDS query on ${params.database}`)

    const validation = validateQuery(params.query)
    if (!validation.isValid) {
      logger.warn(`[${requestId}] Query validation failed: ${validation.error}`)
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const client = createRdsClient({
      region: params.region,
      accessKeyId: params.accessKeyId,
      secretAccessKey: params.secretAccessKey,
      resourceArn: params.resourceArn,
      secretArn: params.secretArn,
      database: params.database,
    })

    try {
      const result = await executeStatement(
        client,
        params.resourceArn,
        params.secretArn,
        params.database,
        params.query
      )

      logger.info(`[${requestId}] Query executed successfully, returned ${result.rowCount} rows`)

      return NextResponse.json({
        message: `Query executed successfully. ${result.rowCount} row(s) returned.`,
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
    logger.error(`[${requestId}] RDS query failed:`, error)

    return NextResponse.json({ error: `RDS query failed: ${errorMessage}` }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/rds/update/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createLogger } from '@/lib/logs/console/logger'
import { createRdsClient, executeUpdate } from '@/app/api/tools/rds/utils'

const logger = createLogger('RDSUpdateAPI')

const UpdateSchema = z.object({
  region: z.string().min(1, 'AWS region is required'),
  accessKeyId: z.string().min(1, 'AWS access key ID is required'),
  secretAccessKey: z.string().min(1, 'AWS secret access key is required'),
  resourceArn: z.string().min(1, 'Resource ARN is required'),
  secretArn: z.string().min(1, 'Secret ARN is required'),
  database: z.string().optional(),
  table: z.string().min(1, 'Table name is required'),
  data: z.record(z.unknown()).refine((obj) => Object.keys(obj).length > 0, {
    message: 'Data object must have at least one field',
  }),
  conditions: z.record(z.unknown()).refine((obj) => Object.keys(obj).length > 0, {
    message: 'At least one condition is required',
  }),
})

export async function POST(request: NextRequest) {
  const requestId = randomUUID().slice(0, 8)

  try {
    const body = await request.json()
    const params = UpdateSchema.parse(body)

    logger.info(`[${requestId}] Updating RDS table ${params.table} in ${params.database}`)

    const client = createRdsClient({
      region: params.region,
      accessKeyId: params.accessKeyId,
      secretAccessKey: params.secretAccessKey,
      resourceArn: params.resourceArn,
      secretArn: params.secretArn,
      database: params.database,
    })

    try {
      const result = await executeUpdate(
        client,
        params.resourceArn,
        params.secretArn,
        params.database,
        params.table,
        params.data,
        params.conditions
      )

      logger.info(`[${requestId}] Update executed successfully, affected ${result.rowCount} rows`)

      return NextResponse.json({
        message: `Update executed successfully. ${result.rowCount} row(s) updated.`,
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
    logger.error(`[${requestId}] RDS update failed:`, error)

    return NextResponse.json({ error: `RDS update failed: ${errorMessage}` }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/s3/copy-object/route.ts
Signals: Next.js, Zod

```typescript
import { CopyObjectCommand, type ObjectCannedACL, S3Client } from '@aws-sdk/client-s3'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'

export const dynamic = 'force-dynamic'

const logger = createLogger('S3CopyObjectAPI')

const S3CopyObjectSchema = z.object({
  accessKeyId: z.string().min(1, 'Access Key ID is required'),
  secretAccessKey: z.string().min(1, 'Secret Access Key is required'),
  region: z.string().min(1, 'Region is required'),
  sourceBucket: z.string().min(1, 'Source bucket name is required'),
  sourceKey: z.string().min(1, 'Source object key is required'),
  destinationBucket: z.string().min(1, 'Destination bucket name is required'),
  destinationKey: z.string().min(1, 'Destination object key is required'),
  acl: z.string().optional().nullable(),
})

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })

    if (!authResult.success) {
      logger.warn(`[${requestId}] Unauthorized S3 copy object attempt: ${authResult.error}`)
      return NextResponse.json(
        {
          success: false,
          error: authResult.error || 'Authentication required',
        },
        { status: 401 }
      )
    }

    logger.info(`[${requestId}] Authenticated S3 copy object request via ${authResult.authType}`, {
      userId: authResult.userId,
    })

    const body = await request.json()
    const validatedData = S3CopyObjectSchema.parse(body)

    logger.info(`[${requestId}] Copying S3 object`, {
      source: `${validatedData.sourceBucket}/${validatedData.sourceKey}`,
      destination: `${validatedData.destinationBucket}/${validatedData.destinationKey}`,
    })

    // Initialize S3 client
    const s3Client = new S3Client({
      region: validatedData.region,
      credentials: {
        accessKeyId: validatedData.accessKeyId,
        secretAccessKey: validatedData.secretAccessKey,
      },
    })

    // Copy object (properly encode the source key for CopySource parameter)
    const encodedSourceKey = validatedData.sourceKey.split('/').map(encodeURIComponent).join('/')
    const copySource = `${validatedData.sourceBucket}/${encodedSourceKey}`
    const copyCommand = new CopyObjectCommand({
      Bucket: validatedData.destinationBucket,
      Key: validatedData.destinationKey,
      CopySource: copySource,
      ACL: validatedData.acl as ObjectCannedACL | undefined,
    })

    const result = await s3Client.send(copyCommand)

    logger.info(`[${requestId}] Object copied successfully`, {
      source: copySource,
      destination: `${validatedData.destinationBucket}/${validatedData.destinationKey}`,
      etag: result.CopyObjectResult?.ETag,
    })

    // Generate public URL for destination (properly encode the destination key)
    const encodedDestKey = validatedData.destinationKey.split('/').map(encodeURIComponent).join('/')
    const url = `https://${validatedData.destinationBucket}.s3.${validatedData.region}.amazonaws.com/${encodedDestKey}`

    return NextResponse.json({
      success: true,
      output: {
        url,
        copySourceVersionId: result.CopySourceVersionId,
        versionId: result.VersionId,
        etag: result.CopyObjectResult?.ETag,
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

    logger.error(`[${requestId}] Error copying S3 object:`, error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/s3/delete-object/route.ts
Signals: Next.js, Zod

```typescript
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'

export const dynamic = 'force-dynamic'

const logger = createLogger('S3DeleteObjectAPI')

const S3DeleteObjectSchema = z.object({
  accessKeyId: z.string().min(1, 'Access Key ID is required'),
  secretAccessKey: z.string().min(1, 'Secret Access Key is required'),
  region: z.string().min(1, 'Region is required'),
  bucketName: z.string().min(1, 'Bucket name is required'),
  objectKey: z.string().min(1, 'Object key is required'),
})

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })

    if (!authResult.success) {
      logger.warn(`[${requestId}] Unauthorized S3 delete object attempt: ${authResult.error}`)
      return NextResponse.json(
        {
          success: false,
          error: authResult.error || 'Authentication required',
        },
        { status: 401 }
      )
    }

    logger.info(
      `[${requestId}] Authenticated S3 delete object request via ${authResult.authType}`,
      {
        userId: authResult.userId,
      }
    )

    const body = await request.json()
    const validatedData = S3DeleteObjectSchema.parse(body)

    logger.info(`[${requestId}] Deleting S3 object`, {
      bucket: validatedData.bucketName,
      key: validatedData.objectKey,
    })

    // Initialize S3 client
    const s3Client = new S3Client({
      region: validatedData.region,
      credentials: {
        accessKeyId: validatedData.accessKeyId,
        secretAccessKey: validatedData.secretAccessKey,
      },
    })

    // Delete object
    const deleteCommand = new DeleteObjectCommand({
      Bucket: validatedData.bucketName,
      Key: validatedData.objectKey,
    })

    const result = await s3Client.send(deleteCommand)

    logger.info(`[${requestId}] Object deleted successfully`, {
      bucket: validatedData.bucketName,
      key: validatedData.objectKey,
      deleteMarker: result.DeleteMarker,
    })

    return NextResponse.json({
      success: true,
      output: {
        key: validatedData.objectKey,
        deleteMarker: result.DeleteMarker,
        versionId: result.VersionId,
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

    logger.error(`[${requestId}] Error deleting S3 object:`, error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/s3/list-objects/route.ts
Signals: Next.js, Zod

```typescript
import { ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'

export const dynamic = 'force-dynamic'

const logger = createLogger('S3ListObjectsAPI')

const S3ListObjectsSchema = z.object({
  accessKeyId: z.string().min(1, 'Access Key ID is required'),
  secretAccessKey: z.string().min(1, 'Secret Access Key is required'),
  region: z.string().min(1, 'Region is required'),
  bucketName: z.string().min(1, 'Bucket name is required'),
  prefix: z.string().optional().nullable(),
  maxKeys: z.number().optional().nullable(),
  continuationToken: z.string().optional().nullable(),
})

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })

    if (!authResult.success) {
      logger.warn(`[${requestId}] Unauthorized S3 list objects attempt: ${authResult.error}`)
      return NextResponse.json(
        {
          success: false,
          error: authResult.error || 'Authentication required',
        },
        { status: 401 }
      )
    }

    logger.info(`[${requestId}] Authenticated S3 list objects request via ${authResult.authType}`, {
      userId: authResult.userId,
    })

    const body = await request.json()
    const validatedData = S3ListObjectsSchema.parse(body)

    logger.info(`[${requestId}] Listing S3 objects`, {
      bucket: validatedData.bucketName,
      prefix: validatedData.prefix || '(none)',
      maxKeys: validatedData.maxKeys || 1000,
    })

    // Initialize S3 client
    const s3Client = new S3Client({
      region: validatedData.region,
      credentials: {
        accessKeyId: validatedData.accessKeyId,
        secretAccessKey: validatedData.secretAccessKey,
      },
    })

    // List objects
    const listCommand = new ListObjectsV2Command({
      Bucket: validatedData.bucketName,
      Prefix: validatedData.prefix || undefined,
      MaxKeys: validatedData.maxKeys || undefined,
      ContinuationToken: validatedData.continuationToken || undefined,
    })

    const result = await s3Client.send(listCommand)

    const objects = (result.Contents || []).map((obj) => ({
      key: obj.Key || '',
      size: obj.Size || 0,
      lastModified: obj.LastModified?.toISOString() || '',
      etag: obj.ETag || '',
    }))

    logger.info(`[${requestId}] Listed ${objects.length} objects`, {
      bucket: validatedData.bucketName,
      isTruncated: result.IsTruncated,
    })

    return NextResponse.json({
      success: true,
      output: {
        objects,
        isTruncated: result.IsTruncated,
        nextContinuationToken: result.NextContinuationToken,
        keyCount: result.KeyCount,
        prefix: validatedData.prefix,
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

    logger.error(`[${requestId}] Error listing S3 objects:`, error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/s3/put-object/route.ts
Signals: Next.js, Zod

```typescript
import { type ObjectCannedACL, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { processSingleFileToUserFile } from '@/lib/uploads/utils/file-utils'
import { downloadFileFromStorage } from '@/lib/uploads/utils/file-utils.server'

export const dynamic = 'force-dynamic'

const logger = createLogger('S3PutObjectAPI')

const S3PutObjectSchema = z.object({
  accessKeyId: z.string().min(1, 'Access Key ID is required'),
  secretAccessKey: z.string().min(1, 'Secret Access Key is required'),
  region: z.string().min(1, 'Region is required'),
  bucketName: z.string().min(1, 'Bucket name is required'),
  objectKey: z.string().min(1, 'Object key is required'),
  file: z.any().optional().nullable(),
  content: z.string().optional().nullable(),
  contentType: z.string().optional().nullable(),
  acl: z.string().optional().nullable(),
})

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })

    if (!authResult.success) {
      logger.warn(`[${requestId}] Unauthorized S3 put object attempt: ${authResult.error}`)
      return NextResponse.json(
        {
          success: false,
          error: authResult.error || 'Authentication required',
        },
        { status: 401 }
      )
    }

    logger.info(`[${requestId}] Authenticated S3 put object request via ${authResult.authType}`, {
      userId: authResult.userId,
    })

    const body = await request.json()
    const validatedData = S3PutObjectSchema.parse(body)

    logger.info(`[${requestId}] Uploading to S3`, {
      bucket: validatedData.bucketName,
      key: validatedData.objectKey,
      hasFile: !!validatedData.file,
      hasContent: !!validatedData.content,
    })

    const s3Client = new S3Client({
      region: validatedData.region,
      credentials: {
        accessKeyId: validatedData.accessKeyId,
        secretAccessKey: validatedData.secretAccessKey,
      },
    })

    let uploadBody: Buffer | string
    let uploadContentType: string | undefined

    if (validatedData.file) {
      const rawFile = validatedData.file
      logger.info(`[${requestId}] Processing file upload: ${rawFile.name}`)

      let userFile
      try {
        userFile = processSingleFileToUserFile(rawFile, requestId, logger)
      } catch (error) {
        return NextResponse.json(
          {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to process file',
          },
          { status: 400 }
        )
      }

      const buffer = await downloadFileFromStorage(userFile, requestId, logger)

      uploadBody = buffer
      uploadContentType = validatedData.contentType || userFile.type || 'application/octet-stream'
    } else if (validatedData.content) {
      uploadBody = Buffer.from(validatedData.content, 'utf-8')
      uploadContentType = validatedData.contentType || 'text/plain'
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Either file or content must be provided',
        },
        { status: 400 }
      )
    }

    const putCommand = new PutObjectCommand({
      Bucket: validatedData.bucketName,
      Key: validatedData.objectKey,
      Body: uploadBody,
      ContentType: uploadContentType,
      ACL: validatedData.acl as ObjectCannedACL | undefined,
    })

    const result = await s3Client.send(putCommand)

    logger.info(`[${requestId}] File uploaded successfully`, {
      etag: result.ETag,
      bucket: validatedData.bucketName,
      key: validatedData.objectKey,
    })

    const encodedKey = validatedData.objectKey.split('/').map(encodeURIComponent).join('/')
    const url = `https://${validatedData.bucketName}.s3.${validatedData.region}.amazonaws.com/${encodedKey}`

    return NextResponse.json({
      success: true,
      output: {
        url,
        etag: result.ETag,
        location: url,
        key: validatedData.objectKey,
        bucket: validatedData.bucketName,
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

    logger.error(`[${requestId}] Error uploading to S3:`, error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/search/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { SEARCH_TOOL_COST } from '@/lib/billing/constants'
import { env } from '@/lib/core/config/env'
import { createLogger } from '@/lib/logs/console/logger'
import { executeTool } from '@/tools'

const logger = createLogger('search')

const SearchRequestSchema = z.object({
  query: z.string().min(1),
})

export const maxDuration = 60
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID()

  try {
    const { searchParams: urlParams } = new URL(request.url)
    const workflowId = urlParams.get('workflowId') || undefined

    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })

    if (!authResult.success || !authResult.userId) {
      const errorMessage = workflowId ? 'Workflow not found' : authResult.error || 'Unauthorized'
      const statusCode = workflowId ? 404 : 401
      return NextResponse.json({ success: false, error: errorMessage }, { status: statusCode })
    }

    const userId = authResult.userId

    logger.info(`[${requestId}] Authenticated search request via ${authResult.authType}`, {
      userId,
    })

    const body = await request.json()
    const validated = SearchRequestSchema.parse(body)

    if (!env.EXA_API_KEY) {
      logger.error(`[${requestId}] EXA_API_KEY not configured`)
      return NextResponse.json(
        { success: false, error: 'Search service not configured' },
        { status: 503 }
      )
    }

    logger.info(`[${requestId}] Executing search`, {
      userId,
      query: validated.query,
    })

    const result = await executeTool('exa_search', {
      query: validated.query,
      type: 'auto',
      useAutoprompt: true,
      text: true,
      apiKey: env.EXA_API_KEY,
    })

    if (!result.success) {
      logger.error(`[${requestId}] Search failed`, {
        userId,
        error: result.error,
      })
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Search failed',
        },
        { status: 500 }
      )
    }

    const results = (result.output.results || []).map((r: any, index: number) => ({
      title: r.title || '',
      link: r.url || '',
      snippet: r.text || '',
      date: r.publishedDate || undefined,
      position: index + 1,
    }))

    const cost = {
      input: 0,
      output: 0,
      total: SEARCH_TOOL_COST,
      tokens: {
        prompt: 0,
        completion: 0,
        total: 0,
      },
      model: 'search-exa',
      pricing: {
        input: 0,
        cachedInput: 0,
        output: 0,
        updatedAt: new Date().toISOString(),
      },
    }

    logger.info(`[${requestId}] Search completed`, {
      userId,
      resultCount: results.length,
      cost: cost.total,
    })

    return NextResponse.json({
      results,
      query: validated.query,
      totalResults: results.length,
      source: 'exa',
      cost,
    })
  } catch (error: any) {
    logger.error(`[${requestId}] Search failed`, {
      error: error.message,
      stack: error.stack,
    })

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Search failed',
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/app/api/tools/sftp/utils.ts

```typescript
import { type Attributes, Client, type ConnectConfig, type SFTPWrapper } from 'ssh2'

const S_IFMT = 0o170000
const S_IFDIR = 0o040000
const S_IFREG = 0o100000
const S_IFLNK = 0o120000

export interface SftpConnectionConfig {
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

/**
 * Formats SSH/SFTP errors with helpful troubleshooting context
 */
function formatSftpError(err: Error, config: { host: string; port: number }): Error {
  const errorMessage = err.message.toLowerCase()
  const { host, port } = config

  if (errorMessage.includes('econnrefused') || errorMessage.includes('connection refused')) {
    return new Error(
      `Connection refused to ${host}:${port}. ` +
        `Please verify: (1) SSH/SFTP server is running, ` +
        `(2) Port ${port} is correct, ` +
        `(3) Firewall allows connections.`
    )
  }

  if (errorMessage.includes('econnreset') || errorMessage.includes('connection reset')) {
    return new Error(
      `Connection reset by ${host}:${port}. ` +
        `This usually means: (1) Wrong port number, ` +
        `(2) Server rejected the connection, ` +
        `(3) Network/firewall interrupted the connection.`
    )
  }

  if (errorMessage.includes('etimedout') || errorMessage.includes('timeout')) {
    return new Error(
      `Connection timed out to ${host}:${port}. ` +
        `Please verify: (1) Host is reachable, ` +
        `(2) No firewall is blocking the connection, ` +
        `(3) The SFTP server is responding.`
    )
  }

  if (errorMessage.includes('enotfound') || errorMessage.includes('getaddrinfo')) {
    return new Error(
      `Could not resolve hostname "${host}". Please verify the hostname or IP address is correct.`
    )
  }

  if (errorMessage.includes('authentication') || errorMessage.includes('auth')) {
    return new Error(
      `Authentication failed on ${host}:${port}. ` +
        `Please verify: (1) Username is correct, ` +
        `(2) Password or private key is valid, ` +
        `(3) User has SFTP access on the server.`
    )
  }

  if (
    errorMessage.includes('key') &&
    (errorMessage.includes('parse') || errorMessage.includes('invalid'))
  ) {
    return new Error(
      `Invalid private key format. ` +
        `Please ensure you're using a valid OpenSSH private key ` +
        `(starts with "-----BEGIN" and ends with "-----END").`
    )
  }

  if (errorMessage.includes('host key') || errorMessage.includes('hostkey')) {
    return new Error(
      `Host key verification issue for ${host}. ` +
        `This may be the first connection or the server's key has changed.`
    )
  }

  return new Error(`SFTP connection to ${host}:${port} failed: ${err.message}`)
}

/**
 * Creates an SSH connection for SFTP using the provided configuration.
 * Uses ssh2 library defaults which align with OpenSSH standards.
 */
export function createSftpConnection(config: SftpConnectionConfig): Promise<Client> {
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
      reject(formatSftpError(err, { host, port }))
    })

    try {
      client.connect(connectConfig)
    } catch (err) {
      reject(formatSftpError(err instanceof Error ? err : new Error(String(err)), { host, port }))
    }
  })
}

/**
 * Gets SFTP subsystem from SSH client
 */
export function getSftp(client: Client): Promise<SFTPWrapper> {
  return new Promise((resolve, reject) => {
    client.sftp((err, sftp) => {
      if (err) {
        reject(new Error(`Failed to start SFTP session: ${err.message}`))
      } else {
        resolve(sftp)
      }
    })
  })
}

/**
 * Sanitizes a remote path to prevent path traversal attacks.
 * Removes null bytes, normalizes path separators, and collapses traversal sequences.
 * Based on OWASP Path Traversal prevention guidelines.
 */
export function sanitizePath(path: string): string {
  let sanitized = path
  sanitized = sanitized.replace(/\0/g, '')
  sanitized = decodeURIComponent(sanitized)
  sanitized = sanitized.replace(/\\/g, '/')
  sanitized = sanitized.replace(/\/+/g, '/')
  sanitized = sanitized.trim()
  return sanitized
}

/**
 * Sanitizes a filename to prevent path traversal and injection attacks.
 * Removes directory traversal sequences, path separators, null bytes, and dangerous patterns.
 * Based on OWASP Input Validation Cheat Sheet recommendations.
 */
export function sanitizeFileName(fileName: string): string {
  let sanitized = fileName
  sanitized = sanitized.replace(/\0/g, '')

  try {
    sanitized = decodeURIComponent(sanitized)
  } catch {
    // Keep original if decode fails (malformed encoding)
  }

  sanitized = sanitized.replace(/\.\.[/\\]?/g, '')
  sanitized = sanitized.replace(/[/\\]/g, '_')
  sanitized = sanitized.replace(/^\.+/, '')
  sanitized = sanitized.replace(/[\x00-\x1f\x7f]/g, '')
  sanitized = sanitized.trim()

  return sanitized || 'unnamed_file'
}

/**
 * Validates that a path doesn't contain traversal sequences.
 * Returns true if the path is safe, false if it contains potential traversal attacks.
 */
export function isPathSafe(path: string): boolean {
  const normalizedPath = path.replace(/\\/g, '/')

  if (normalizedPath.includes('../') || normalizedPath.includes('..\\')) {
    return false
  }

  try {
    const decoded = decodeURIComponent(normalizedPath)
    if (decoded.includes('../') || decoded.includes('..\\')) {
      return false
    }
  } catch {
    return false
  }

  if (normalizedPath.includes('\0')) {
    return false
  }

  return true
}

/**
 * Parses file permissions from mode bits to octal string representation.
 */
export function parsePermissions(mode: number): string {
  return `0${(mode & 0o777).toString(8)}`
}

/**
 * Determines file type from SFTP attributes mode bits.
 */
export function getFileType(attrs: Attributes): 'file' | 'directory' | 'symlink' | 'other' {
  const fileType = attrs.mode & S_IFMT

  if (fileType === S_IFDIR) return 'directory'
  if (fileType === S_IFREG) return 'file'
  if (fileType === S_IFLNK) return 'symlink'
  return 'other'
}

/**
 * Checks if a path exists on the SFTP server.
 */
export function sftpExists(sftp: SFTPWrapper, path: string): Promise<boolean> {
  return new Promise((resolve) => {
    sftp.stat(path, (err) => {
      resolve(!err)
    })
  })
}

/**
 * Checks if a path is a directory on the SFTP server.
 */
export function sftpIsDirectory(sftp: SFTPWrapper, path: string): Promise<boolean> {
  return new Promise((resolve) => {
    sftp.stat(path, (err, stats) => {
      if (err) {
        resolve(false)
      } else {
        resolve(getFileType(stats) === 'directory')
      }
    })
  })
}
```

--------------------------------------------------------------------------------

````
