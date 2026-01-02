---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 303
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 303 of 933)

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
Location: sim-main/apps/sim/app/api/tools/discord/servers/route.ts
Signals: Next.js

```typescript
import { NextResponse } from 'next/server'
import { validateNumericId } from '@/lib/core/security/input-validation'
import { createLogger } from '@/lib/logs/console/logger'

interface DiscordServer {
  id: string
  name: string
  icon: string | null
}

export const dynamic = 'force-dynamic'

const logger = createLogger('DiscordServersAPI')

export async function POST(request: Request) {
  try {
    const { botToken, serverId } = await request.json()

    if (!botToken) {
      logger.error('Missing bot token in request')
      return NextResponse.json({ error: 'Bot token is required' }, { status: 400 })
    }

    if (serverId) {
      const serverIdValidation = validateNumericId(serverId, 'serverId')
      if (!serverIdValidation.isValid) {
        logger.error(`Invalid server ID: ${serverIdValidation.error}`)
        return NextResponse.json({ error: serverIdValidation.error }, { status: 400 })
      }

      logger.info(`Fetching single Discord server: ${serverId}`)

      const response = await fetch(`https://discord.com/api/v10/guilds/${serverId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bot ${botToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        logger.error('Discord API error fetching server:', {
          status: response.status,
          statusText: response.statusText,
        })

        let errorMessage
        try {
          const errorData = await response.json()
          logger.error('Error details:', errorData)
          errorMessage = errorData.message || `Failed to fetch server (${response.status})`
        } catch (_e) {
          errorMessage = `Failed to fetch server: ${response.status} ${response.statusText}`
        }
        return NextResponse.json({ error: errorMessage }, { status: response.status })
      }

      const server = (await response.json()) as DiscordServer
      logger.info(`Successfully fetched server: ${server.name}`)

      return NextResponse.json({
        server: {
          id: server.id,
          name: server.name,
          icon: server.icon
            ? `https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png`
            : null,
        },
      })
    }

    logger.info(
      'Skipping guild listing: bot token cannot list /users/@me/guilds; returning empty list'
    )
    return NextResponse.json({ servers: [] })
  } catch (error) {
    logger.error('Error processing request:', error)
    return NextResponse.json(
      {
        error: 'Failed to retrieve Discord servers',
        details: (error as Error).message,
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/drive/file/route.ts
Signals: Next.js

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { authorizeCredentialUse } from '@/lib/auth/credential-access'
import { validateAlphanumericId } from '@/lib/core/security/input-validation'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { refreshAccessTokenIfNeeded } from '@/app/api/auth/oauth/utils'
export const dynamic = 'force-dynamic'

const logger = createLogger('GoogleDriveFileAPI')

/**
 * Get a single file from Google Drive
 */
export async function GET(request: NextRequest) {
  const requestId = generateRequestId()
  logger.info(`[${requestId}] Google Drive file request received`)

  try {
    const { searchParams } = new URL(request.url)
    const credentialId = searchParams.get('credentialId')
    const fileId = searchParams.get('fileId')
    const workflowId = searchParams.get('workflowId') || undefined

    if (!credentialId || !fileId) {
      logger.warn(`[${requestId}] Missing required parameters`)
      return NextResponse.json({ error: 'Credential ID and File ID are required' }, { status: 400 })
    }

    const fileIdValidation = validateAlphanumericId(fileId, 'fileId', 255)
    if (!fileIdValidation.isValid) {
      logger.warn(`[${requestId}] Invalid file ID: ${fileIdValidation.error}`)
      return NextResponse.json({ error: fileIdValidation.error }, { status: 400 })
    }

    const authz = await authorizeCredentialUse(request, { credentialId: credentialId, workflowId })
    if (!authz.ok || !authz.credentialOwnerUserId) {
      return NextResponse.json({ error: authz.error || 'Unauthorized' }, { status: 403 })
    }

    const accessToken = await refreshAccessTokenIfNeeded(
      credentialId,
      authz.credentialOwnerUserId,
      requestId
    )

    if (!accessToken) {
      return NextResponse.json({ error: 'Failed to obtain valid access token' }, { status: 401 })
    }

    logger.info(`[${requestId}] Fetching file ${fileId} from Google Drive API`)
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,mimeType,iconLink,webViewLink,thumbnailLink,createdTime,modifiedTime,size,owners,exportLinks,shortcutDetails&supportsAllDrives=true`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok && response.status === 404) {
      logger.info(`[${requestId}] File not found, checking if it's a shared drive`)
      const driveResponse = await fetch(
        `https://www.googleapis.com/drive/v3/drives/${fileId}?fields=id,name`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      if (driveResponse.ok) {
        const driveData = await driveResponse.json()
        logger.info(`[${requestId}] Found shared drive: ${driveData.name}`)
        return NextResponse.json(
          {
            file: {
              id: driveData.id,
              name: driveData.name,
              mimeType: 'application/vnd.google-apps.folder',
              iconLink:
                'https://ssl.gstatic.com/docs/doclist/images/icon_11_shared_collection_list_1.png',
            },
          },
          { status: 200 }
        )
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: 'Unknown error' } }))
      logger.error(`[${requestId}] Google Drive API error`, {
        status: response.status,
        error: errorData.error?.message || 'Failed to fetch file from Google Drive',
      })
      return NextResponse.json(
        {
          error: errorData.error?.message || 'Failed to fetch file from Google Drive',
        },
        { status: response.status }
      )
    }

    const file = await response.json()

    const exportFormats: { [key: string]: string } = {
      'application/vnd.google-apps.document': 'application/pdf',
      'application/vnd.google-apps.spreadsheet':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.google-apps.presentation': 'application/pdf',
    }

    if (
      file.mimeType === 'application/vnd.google-apps.shortcut' &&
      file.shortcutDetails?.targetId
    ) {
      const targetId = file.shortcutDetails.targetId
      const shortcutResp = await fetch(
        `https://www.googleapis.com/drive/v3/files/${targetId}?fields=id,name,mimeType,iconLink,webViewLink,thumbnailLink,createdTime,modifiedTime,size,owners,exportLinks&supportsAllDrives=true`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      if (shortcutResp.ok) {
        const targetFile = await shortcutResp.json()
        file.id = targetFile.id
        file.name = targetFile.name
        file.mimeType = targetFile.mimeType
        file.iconLink = targetFile.iconLink
        file.webViewLink = targetFile.webViewLink
        file.thumbnailLink = targetFile.thumbnailLink
        file.createdTime = targetFile.createdTime
        file.modifiedTime = targetFile.modifiedTime
        file.size = targetFile.size
        file.owners = targetFile.owners
        file.exportLinks = targetFile.exportLinks
      }
    }

    if (file.mimeType.startsWith('application/vnd.google-apps.')) {
      const format = exportFormats[file.mimeType] || 'application/pdf'
      if (!file.exportLinks) {
        file.downloadUrl = `https://www.googleapis.com/drive/v3/files/${file.id}/export?mimeType=${encodeURIComponent(
          format
        )}&supportsAllDrives=true`
      } else {
        file.downloadUrl = file.exportLinks[format]
      }
    } else {
      file.downloadUrl = `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media&supportsAllDrives=true`
    }

    return NextResponse.json({ file }, { status: 200 })
  } catch (error) {
    logger.error(`[${requestId}] Error fetching file from Google Drive`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/drive/files/route.ts
Signals: Next.js

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { authorizeCredentialUse } from '@/lib/auth/credential-access'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { refreshAccessTokenIfNeeded } from '@/app/api/auth/oauth/utils'
export const dynamic = 'force-dynamic'

const logger = createLogger('GoogleDriveFilesAPI')

function escapeForDriveQuery(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

interface SharedDrive {
  id: string
  name: string
  kind: string
}

interface DriveFile {
  id: string
  name: string
  mimeType: string
  iconLink?: string
  webViewLink?: string
  thumbnailLink?: string
  createdTime?: string
  modifiedTime?: string
  size?: string
  owners?: any[]
  parents?: string[]
}

/**
 * Fetches shared drives the user has access to
 */
async function fetchSharedDrives(accessToken: string, requestId: string): Promise<DriveFile[]> {
  try {
    const response = await fetch(
      'https://www.googleapis.com/drive/v3/drives?pageSize=100&fields=drives(id,name)',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      logger.warn(`[${requestId}] Failed to fetch shared drives`, {
        status: response.status,
      })
      return []
    }

    const data = await response.json()
    const drives: SharedDrive[] = data.drives || []

    return drives.map((drive) => ({
      id: drive.id,
      name: drive.name,
      mimeType: 'application/vnd.google-apps.folder',
      iconLink: 'https://ssl.gstatic.com/docs/doclist/images/icon_11_shared_collection_list_1.png',
    }))
  } catch (error) {
    logger.error(`[${requestId}] Error fetching shared drives`, error)
    return []
  }
}

export async function GET(request: NextRequest) {
  const requestId = generateRequestId()
  logger.info(`[${requestId}] Google Drive files request received`)

  try {
    const session = await getSession()

    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthenticated request rejected`)
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const credentialId = searchParams.get('credentialId')
    const mimeType = searchParams.get('mimeType')
    const query = searchParams.get('query') || ''
    const folderId = searchParams.get('folderId') || searchParams.get('parentId') || ''
    const workflowId = searchParams.get('workflowId') || undefined

    if (!credentialId) {
      logger.warn(`[${requestId}] Missing credential ID`)
      return NextResponse.json({ error: 'Credential ID is required' }, { status: 400 })
    }

    const authz = await authorizeCredentialUse(request, { credentialId: credentialId!, workflowId })
    if (!authz.ok || !authz.credentialOwnerUserId) {
      logger.warn(`[${requestId}] Unauthorized credential access attempt`, authz)
      return NextResponse.json({ error: authz.error || 'Unauthorized' }, { status: 403 })
    }

    const accessToken = await refreshAccessTokenIfNeeded(
      credentialId!,
      authz.credentialOwnerUserId,
      requestId
    )

    if (!accessToken) {
      return NextResponse.json({ error: 'Failed to obtain valid access token' }, { status: 401 })
    }

    const qParts: string[] = ['trashed = false']
    if (folderId) {
      qParts.push(`'${escapeForDriveQuery(folderId)}' in parents`)
    }
    if (mimeType) {
      qParts.push(`mimeType = '${escapeForDriveQuery(mimeType)}'`)
    }
    if (query) {
      qParts.push(`name contains '${escapeForDriveQuery(query)}'`)
    }
    const q = encodeURIComponent(qParts.join(' and '))

    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${q}&corpora=allDrives&supportsAllDrives=true&includeItemsFromAllDrives=true&fields=files(id,name,mimeType,iconLink,webViewLink,thumbnailLink,createdTime,modifiedTime,size,owners,parents)`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }))
      logger.error(`[${requestId}] Google Drive API error`, {
        status: response.status,
        error: error.error?.message || 'Failed to fetch files from Google Drive',
      })
      return NextResponse.json(
        {
          error: error.error?.message || 'Failed to fetch files from Google Drive',
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    let files: DriveFile[] = data.files || []

    if (mimeType === 'application/vnd.google-apps.spreadsheet') {
      files = files.filter(
        (file: DriveFile) => file.mimeType === 'application/vnd.google-apps.spreadsheet'
      )
    } else if (mimeType === 'application/vnd.google-apps.document') {
      files = files.filter(
        (file: DriveFile) => file.mimeType === 'application/vnd.google-apps.document'
      )
    }

    const isRootFolderListing =
      !folderId && mimeType === 'application/vnd.google-apps.folder' && !query
    if (isRootFolderListing) {
      const sharedDrives = await fetchSharedDrives(accessToken, requestId)
      if (sharedDrives.length > 0) {
        logger.info(`[${requestId}] Found ${sharedDrives.length} shared drives`)
        files = [...sharedDrives, ...files]
      }
    }

    return NextResponse.json({ files }, { status: 200 })
  } catch (error) {
    logger.error(`[${requestId}] Error fetching files from Google Drive`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/app/api/tools/dynamodb/utils.ts

```typescript
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb'
import type { DynamoDBConnectionConfig } from '@/tools/dynamodb/types'

export function createDynamoDBClient(config: DynamoDBConnectionConfig): DynamoDBDocumentClient {
  const client = new DynamoDBClient({
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  })

  return DynamoDBDocumentClient.from(client, {
    marshallOptions: {
      removeUndefinedValues: true,
      convertEmptyValues: false,
    },
    unmarshallOptions: {
      wrapNumbers: false,
    },
  })
}

export async function getItem(
  client: DynamoDBDocumentClient,
  tableName: string,
  key: Record<string, unknown>,
  consistentRead?: boolean
): Promise<{ item: Record<string, unknown> | null }> {
  const command = new GetCommand({
    TableName: tableName,
    Key: key,
    ConsistentRead: consistentRead,
  })

  const response = await client.send(command)
  return {
    item: (response.Item as Record<string, unknown>) || null,
  }
}

export async function putItem(
  client: DynamoDBDocumentClient,
  tableName: string,
  item: Record<string, unknown>
): Promise<{ success: boolean }> {
  const command = new PutCommand({
    TableName: tableName,
    Item: item,
  })

  await client.send(command)
  return { success: true }
}

export async function queryItems(
  client: DynamoDBDocumentClient,
  tableName: string,
  keyConditionExpression: string,
  options?: {
    filterExpression?: string
    expressionAttributeNames?: Record<string, string>
    expressionAttributeValues?: Record<string, unknown>
    indexName?: string
    limit?: number
  }
): Promise<{ items: Record<string, unknown>[]; count: number }> {
  const command = new QueryCommand({
    TableName: tableName,
    KeyConditionExpression: keyConditionExpression,
    ...(options?.filterExpression && { FilterExpression: options.filterExpression }),
    ...(options?.expressionAttributeNames && {
      ExpressionAttributeNames: options.expressionAttributeNames,
    }),
    ...(options?.expressionAttributeValues && {
      ExpressionAttributeValues: options.expressionAttributeValues,
    }),
    ...(options?.indexName && { IndexName: options.indexName }),
    ...(options?.limit && { Limit: options.limit }),
  })

  const response = await client.send(command)
  return {
    items: (response.Items as Record<string, unknown>[]) || [],
    count: response.Count || 0,
  }
}

export async function scanItems(
  client: DynamoDBDocumentClient,
  tableName: string,
  options?: {
    filterExpression?: string
    projectionExpression?: string
    expressionAttributeNames?: Record<string, string>
    expressionAttributeValues?: Record<string, unknown>
    limit?: number
  }
): Promise<{ items: Record<string, unknown>[]; count: number }> {
  const command = new ScanCommand({
    TableName: tableName,
    ...(options?.filterExpression && { FilterExpression: options.filterExpression }),
    ...(options?.projectionExpression && { ProjectionExpression: options.projectionExpression }),
    ...(options?.expressionAttributeNames && {
      ExpressionAttributeNames: options.expressionAttributeNames,
    }),
    ...(options?.expressionAttributeValues && {
      ExpressionAttributeValues: options.expressionAttributeValues,
    }),
    ...(options?.limit && { Limit: options.limit }),
  })

  const response = await client.send(command)
  return {
    items: (response.Items as Record<string, unknown>[]) || [],
    count: response.Count || 0,
  }
}

export async function updateItem(
  client: DynamoDBDocumentClient,
  tableName: string,
  key: Record<string, unknown>,
  updateExpression: string,
  options?: {
    expressionAttributeNames?: Record<string, string>
    expressionAttributeValues?: Record<string, unknown>
    conditionExpression?: string
  }
): Promise<{ attributes: Record<string, unknown> | null }> {
  const command = new UpdateCommand({
    TableName: tableName,
    Key: key,
    UpdateExpression: updateExpression,
    ...(options?.expressionAttributeNames && {
      ExpressionAttributeNames: options.expressionAttributeNames,
    }),
    ...(options?.expressionAttributeValues && {
      ExpressionAttributeValues: options.expressionAttributeValues,
    }),
    ...(options?.conditionExpression && { ConditionExpression: options.conditionExpression }),
    ReturnValues: 'ALL_NEW',
  })

  const response = await client.send(command)
  return {
    attributes: (response.Attributes as Record<string, unknown>) || null,
  }
}

export async function deleteItem(
  client: DynamoDBDocumentClient,
  tableName: string,
  key: Record<string, unknown>,
  conditionExpression?: string
): Promise<{ success: boolean }> {
  const command = new DeleteCommand({
    TableName: tableName,
    Key: key,
    ...(conditionExpression && { ConditionExpression: conditionExpression }),
  })

  await client.send(command)
  return { success: true }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/dynamodb/delete/route.ts
Signals: Next.js, Zod

```typescript
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createDynamoDBClient, deleteItem } from '@/app/api/tools/dynamodb/utils'

const DeleteSchema = z.object({
  region: z.string().min(1, 'AWS region is required'),
  accessKeyId: z.string().min(1, 'AWS access key ID is required'),
  secretAccessKey: z.string().min(1, 'AWS secret access key is required'),
  tableName: z.string().min(1, 'Table name is required'),
  key: z.record(z.unknown()).refine((val) => Object.keys(val).length > 0, {
    message: 'Key is required',
  }),
  conditionExpression: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = DeleteSchema.parse(body)

    const client = createDynamoDBClient({
      region: validatedData.region,
      accessKeyId: validatedData.accessKeyId,
      secretAccessKey: validatedData.secretAccessKey,
    })

    await deleteItem(
      client,
      validatedData.tableName,
      validatedData.key,
      validatedData.conditionExpression
    )

    return NextResponse.json({
      message: 'Item deleted successfully',
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'DynamoDB delete failed'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/dynamodb/get/route.ts
Signals: Next.js, Zod

```typescript
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createDynamoDBClient, getItem } from '@/app/api/tools/dynamodb/utils'

const GetSchema = z.object({
  region: z.string().min(1, 'AWS region is required'),
  accessKeyId: z.string().min(1, 'AWS access key ID is required'),
  secretAccessKey: z.string().min(1, 'AWS secret access key is required'),
  tableName: z.string().min(1, 'Table name is required'),
  key: z.record(z.unknown()).refine((val) => Object.keys(val).length > 0, {
    message: 'Key is required',
  }),
  consistentRead: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((val) => {
      if (val === true || val === 'true') return true
      return undefined
    }),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = GetSchema.parse(body)

    const client = createDynamoDBClient({
      region: validatedData.region,
      accessKeyId: validatedData.accessKeyId,
      secretAccessKey: validatedData.secretAccessKey,
    })

    const result = await getItem(
      client,
      validatedData.tableName,
      validatedData.key,
      validatedData.consistentRead
    )

    return NextResponse.json({
      message: result.item ? 'Item retrieved successfully' : 'Item not found',
      item: result.item,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'DynamoDB get failed'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/dynamodb/put/route.ts
Signals: Next.js, Zod

```typescript
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createDynamoDBClient, putItem } from '@/app/api/tools/dynamodb/utils'

const PutSchema = z.object({
  region: z.string().min(1, 'AWS region is required'),
  accessKeyId: z.string().min(1, 'AWS access key ID is required'),
  secretAccessKey: z.string().min(1, 'AWS secret access key is required'),
  tableName: z.string().min(1, 'Table name is required'),
  item: z.record(z.unknown()).refine((val) => Object.keys(val).length > 0, {
    message: 'Item is required',
  }),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = PutSchema.parse(body)

    const client = createDynamoDBClient({
      region: validatedData.region,
      accessKeyId: validatedData.accessKeyId,
      secretAccessKey: validatedData.secretAccessKey,
    })

    await putItem(client, validatedData.tableName, validatedData.item)

    return NextResponse.json({
      message: 'Item created successfully',
      item: validatedData.item,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'DynamoDB put failed'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/dynamodb/query/route.ts
Signals: Next.js, Zod

```typescript
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createDynamoDBClient, queryItems } from '@/app/api/tools/dynamodb/utils'

const QuerySchema = z.object({
  region: z.string().min(1, 'AWS region is required'),
  accessKeyId: z.string().min(1, 'AWS access key ID is required'),
  secretAccessKey: z.string().min(1, 'AWS secret access key is required'),
  tableName: z.string().min(1, 'Table name is required'),
  keyConditionExpression: z.string().min(1, 'Key condition expression is required'),
  filterExpression: z.string().optional(),
  expressionAttributeNames: z.record(z.string()).optional(),
  expressionAttributeValues: z.record(z.unknown()).optional(),
  indexName: z.string().optional(),
  limit: z.number().positive().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = QuerySchema.parse(body)

    const client = createDynamoDBClient({
      region: validatedData.region,
      accessKeyId: validatedData.accessKeyId,
      secretAccessKey: validatedData.secretAccessKey,
    })

    const result = await queryItems(
      client,
      validatedData.tableName,
      validatedData.keyConditionExpression,
      {
        filterExpression: validatedData.filterExpression,
        expressionAttributeNames: validatedData.expressionAttributeNames,
        expressionAttributeValues: validatedData.expressionAttributeValues,
        indexName: validatedData.indexName,
        limit: validatedData.limit,
      }
    )

    return NextResponse.json({
      message: `Query returned ${result.count} items`,
      items: result.items,
      count: result.count,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'DynamoDB query failed'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/dynamodb/scan/route.ts
Signals: Next.js, Zod

```typescript
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createDynamoDBClient, scanItems } from '@/app/api/tools/dynamodb/utils'

const ScanSchema = z.object({
  region: z.string().min(1, 'AWS region is required'),
  accessKeyId: z.string().min(1, 'AWS access key ID is required'),
  secretAccessKey: z.string().min(1, 'AWS secret access key is required'),
  tableName: z.string().min(1, 'Table name is required'),
  filterExpression: z.string().optional(),
  projectionExpression: z.string().optional(),
  expressionAttributeNames: z.record(z.string()).optional(),
  expressionAttributeValues: z.record(z.unknown()).optional(),
  limit: z.number().positive().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = ScanSchema.parse(body)

    const client = createDynamoDBClient({
      region: validatedData.region,
      accessKeyId: validatedData.accessKeyId,
      secretAccessKey: validatedData.secretAccessKey,
    })

    const result = await scanItems(client, validatedData.tableName, {
      filterExpression: validatedData.filterExpression,
      projectionExpression: validatedData.projectionExpression,
      expressionAttributeNames: validatedData.expressionAttributeNames,
      expressionAttributeValues: validatedData.expressionAttributeValues,
      limit: validatedData.limit,
    })

    return NextResponse.json({
      message: `Scan returned ${result.count} items`,
      items: result.items,
      count: result.count,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'DynamoDB scan failed'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/dynamodb/update/route.ts
Signals: Next.js, Zod

```typescript
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createDynamoDBClient, updateItem } from '@/app/api/tools/dynamodb/utils'

const UpdateSchema = z.object({
  region: z.string().min(1, 'AWS region is required'),
  accessKeyId: z.string().min(1, 'AWS access key ID is required'),
  secretAccessKey: z.string().min(1, 'AWS secret access key is required'),
  tableName: z.string().min(1, 'Table name is required'),
  key: z.record(z.unknown()).refine((val) => Object.keys(val).length > 0, {
    message: 'Key is required',
  }),
  updateExpression: z.string().min(1, 'Update expression is required'),
  expressionAttributeNames: z.record(z.string()).optional(),
  expressionAttributeValues: z.record(z.unknown()).optional(),
  conditionExpression: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = UpdateSchema.parse(body)

    const client = createDynamoDBClient({
      region: validatedData.region,
      accessKeyId: validatedData.accessKeyId,
      secretAccessKey: validatedData.secretAccessKey,
    })

    const result = await updateItem(
      client,
      validatedData.tableName,
      validatedData.key,
      validatedData.updateExpression,
      {
        expressionAttributeNames: validatedData.expressionAttributeNames,
        expressionAttributeValues: validatedData.expressionAttributeValues,
        conditionExpression: validatedData.conditionExpression,
      }
    )

    return NextResponse.json({
      message: 'Item updated successfully',
      item: result.attributes,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'DynamoDB update failed'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/gmail/add-label/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'

export const dynamic = 'force-dynamic'

const logger = createLogger('GmailAddLabelAPI')

const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1/users/me'

const GmailAddLabelSchema = z.object({
  accessToken: z.string().min(1, 'Access token is required'),
  messageId: z.string().min(1, 'Message ID is required'),
  labelIds: z.string().min(1, 'At least one label ID is required'),
})

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })

    if (!authResult.success) {
      logger.warn(`[${requestId}] Unauthorized Gmail add label attempt: ${authResult.error}`)
      return NextResponse.json(
        {
          success: false,
          error: authResult.error || 'Authentication required',
        },
        { status: 401 }
      )
    }

    logger.info(`[${requestId}] Authenticated Gmail add label request via ${authResult.authType}`, {
      userId: authResult.userId,
    })

    const body = await request.json()
    const validatedData = GmailAddLabelSchema.parse(body)

    logger.info(`[${requestId}] Adding label(s) to Gmail email`, {
      messageId: validatedData.messageId,
      labelIds: validatedData.labelIds,
    })

    const labelIds = validatedData.labelIds
      .split(',')
      .map((id) => id.trim())
      .filter((id) => id.length > 0)

    const gmailResponse = await fetch(
      `${GMAIL_API_BASE}/messages/${validatedData.messageId}/modify`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${validatedData.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          addLabelIds: labelIds,
        }),
      }
    )

    if (!gmailResponse.ok) {
      const errorText = await gmailResponse.text()
      logger.error(`[${requestId}] Gmail API error:`, errorText)
      return NextResponse.json(
        {
          success: false,
          error: `Gmail API error: ${gmailResponse.statusText}`,
        },
        { status: gmailResponse.status }
      )
    }

    const data = await gmailResponse.json()

    logger.info(`[${requestId}] Label(s) added successfully`, { messageId: data.id })

    return NextResponse.json({
      success: true,
      output: {
        content: `Successfully added ${labelIds.length} label(s) to email`,
        metadata: {
          id: data.id,
          threadId: data.threadId,
          labelIds: data.labelIds,
        },
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

    logger.error(`[${requestId}] Error adding label to Gmail email:`, error)

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
Location: sim-main/apps/sim/app/api/tools/gmail/archive/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'

export const dynamic = 'force-dynamic'

const logger = createLogger('GmailArchiveAPI')

const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1/users/me'

const GmailArchiveSchema = z.object({
  accessToken: z.string().min(1, 'Access token is required'),
  messageId: z.string().min(1, 'Message ID is required'),
})

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })

    if (!authResult.success) {
      logger.warn(`[${requestId}] Unauthorized Gmail archive attempt: ${authResult.error}`)
      return NextResponse.json(
        {
          success: false,
          error: authResult.error || 'Authentication required',
        },
        { status: 401 }
      )
    }

    logger.info(`[${requestId}] Authenticated Gmail archive request via ${authResult.authType}`, {
      userId: authResult.userId,
    })

    const body = await request.json()
    const validatedData = GmailArchiveSchema.parse(body)

    logger.info(`[${requestId}] Archiving Gmail email`, {
      messageId: validatedData.messageId,
    })

    const gmailResponse = await fetch(
      `${GMAIL_API_BASE}/messages/${validatedData.messageId}/modify`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${validatedData.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          removeLabelIds: ['INBOX'],
        }),
      }
    )

    if (!gmailResponse.ok) {
      const errorText = await gmailResponse.text()
      logger.error(`[${requestId}] Gmail API error:`, errorText)
      return NextResponse.json(
        {
          success: false,
          error: `Gmail API error: ${gmailResponse.statusText}`,
        },
        { status: gmailResponse.status }
      )
    }

    const data = await gmailResponse.json()

    logger.info(`[${requestId}] Email archived successfully`, { messageId: data.id })

    return NextResponse.json({
      success: true,
      output: {
        content: 'Email archived successfully',
        metadata: {
          id: data.id,
          threadId: data.threadId,
          labelIds: data.labelIds,
        },
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

    logger.error(`[${requestId}] Error archiving Gmail email:`, error)

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

````
