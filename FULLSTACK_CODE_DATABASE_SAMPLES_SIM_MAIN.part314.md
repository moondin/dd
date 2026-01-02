---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 314
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 314 of 933)

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
Location: sim-main/apps/sim/app/api/tools/sharepoint/upload/route.ts
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

const logger = createLogger('SharepointUploadAPI')

const SharepointUploadSchema = z.object({
  accessToken: z.string().min(1, 'Access token is required'),
  siteId: z.string().default('root'),
  driveId: z.string().optional().nullable(),
  folderPath: z.string().optional().nullable(),
  fileName: z.string().optional().nullable(),
  files: z.array(z.any()).optional().nullable(),
})

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })

    if (!authResult.success) {
      logger.warn(`[${requestId}] Unauthorized SharePoint upload attempt: ${authResult.error}`)
      return NextResponse.json(
        {
          success: false,
          error: authResult.error || 'Authentication required',
        },
        { status: 401 }
      )
    }

    logger.info(
      `[${requestId}] Authenticated SharePoint upload request via ${authResult.authType}`,
      {
        userId: authResult.userId,
      }
    )

    const body = await request.json()
    const validatedData = SharepointUploadSchema.parse(body)

    logger.info(`[${requestId}] Uploading files to SharePoint`, {
      siteId: validatedData.siteId,
      driveId: validatedData.driveId,
      folderPath: validatedData.folderPath,
      hasFiles: !!(validatedData.files && validatedData.files.length > 0),
      fileCount: validatedData.files?.length || 0,
    })

    if (!validatedData.files || validatedData.files.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'At least one file is required for upload',
        },
        { status: 400 }
      )
    }

    const userFiles = processFilesToUserFiles(validatedData.files, requestId, logger)

    if (userFiles.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No valid files to upload',
        },
        { status: 400 }
      )
    }

    let effectiveDriveId = validatedData.driveId
    if (!effectiveDriveId) {
      logger.info(`[${requestId}] No driveId provided, fetching default drive for site`)
      const driveResponse = await fetch(
        `https://graph.microsoft.com/v1.0/sites/${validatedData.siteId}/drive`,
        {
          headers: {
            Authorization: `Bearer ${validatedData.accessToken}`,
            Accept: 'application/json',
          },
        }
      )

      if (!driveResponse.ok) {
        const errorData = await driveResponse.json().catch(() => ({}))
        logger.error(`[${requestId}] Failed to get default drive:`, errorData)
        return NextResponse.json(
          {
            success: false,
            error: errorData.error?.message || 'Failed to get default document library',
          },
          { status: driveResponse.status }
        )
      }

      const driveData = await driveResponse.json()
      effectiveDriveId = driveData.id
      logger.info(`[${requestId}] Using default drive: ${effectiveDriveId}`)
    }

    const uploadedFiles: any[] = []

    for (const userFile of userFiles) {
      logger.info(`[${requestId}] Uploading file: ${userFile.name}`)

      const buffer = await downloadFileFromStorage(userFile, requestId, logger)

      const fileName = validatedData.fileName || userFile.name
      const folderPath = validatedData.folderPath?.trim() || ''

      const fileSizeMB = buffer.length / (1024 * 1024)

      if (fileSizeMB > 250) {
        logger.warn(
          `[${requestId}] File ${fileName} is ${fileSizeMB.toFixed(2)}MB, exceeds 250MB limit`
        )
        continue
      }

      let uploadPath = ''
      if (folderPath) {
        const normalizedPath = folderPath.startsWith('/') ? folderPath : `/${folderPath}`
        const cleanPath = normalizedPath.endsWith('/')
          ? normalizedPath.slice(0, -1)
          : normalizedPath
        uploadPath = `${cleanPath}/${fileName}`
      } else {
        uploadPath = `/${fileName}`
      }

      const encodedPath = uploadPath
        .split('/')
        .map((segment) => (segment ? encodeURIComponent(segment) : ''))
        .join('/')

      const uploadUrl = `https://graph.microsoft.com/v1.0/sites/${validatedData.siteId}/drives/${effectiveDriveId}/root:${encodedPath}:/content`

      logger.info(`[${requestId}] Uploading to: ${uploadUrl}`)

      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${validatedData.accessToken}`,
          'Content-Type': userFile.type || 'application/octet-stream',
        },
        body: new Uint8Array(buffer),
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({}))
        logger.error(`[${requestId}] Failed to upload file ${fileName}:`, errorData)

        if (uploadResponse.status === 409) {
          logger.warn(`[${requestId}] File ${fileName} already exists, attempting to replace`)
          continue
        }

        return NextResponse.json(
          {
            success: false,
            error: errorData.error?.message || `Failed to upload file: ${fileName}`,
          },
          { status: uploadResponse.status }
        )
      }

      const uploadData = await uploadResponse.json()
      logger.info(`[${requestId}] File uploaded successfully: ${fileName}`)

      uploadedFiles.push({
        id: uploadData.id,
        name: uploadData.name,
        webUrl: uploadData.webUrl,
        size: uploadData.size,
        createdDateTime: uploadData.createdDateTime,
        lastModifiedDateTime: uploadData.lastModifiedDateTime,
      })
    }

    if (uploadedFiles.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No files were uploaded successfully',
        },
        { status: 400 }
      )
    }

    logger.info(`[${requestId}] Successfully uploaded ${uploadedFiles.length} file(s)`)

    return NextResponse.json({
      success: true,
      output: {
        uploadedFiles,
        fileCount: uploadedFiles.length,
      },
    })
  } catch (error) {
    logger.error(`[${requestId}] Error uploading files to SharePoint:`, error)
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
Location: sim-main/apps/sim/app/api/tools/slack/utils.ts

```typescript
import type { Logger } from '@/lib/logs/console/logger'
import { processFilesToUserFiles } from '@/lib/uploads/utils/file-utils'
import { downloadFileFromStorage } from '@/lib/uploads/utils/file-utils.server'

/**
 * Sends a message to a Slack channel using chat.postMessage
 */
export async function postSlackMessage(
  accessToken: string,
  channel: string,
  text: string,
  threadTs?: string | null
): Promise<{ ok: boolean; ts?: string; channel?: string; message?: any; error?: string }> {
  const response = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      channel,
      text,
      ...(threadTs && { thread_ts: threadTs }),
    }),
  })

  return response.json()
}

/**
 * Creates a default message object when the API doesn't return one
 */
export function createDefaultMessageObject(
  ts: string,
  text: string,
  channel: string
): Record<string, any> {
  return {
    type: 'message',
    ts,
    text,
    channel,
  }
}

/**
 * Formats the success response for a sent message
 */
export function formatMessageSuccessResponse(
  data: any,
  text: string
): {
  message: any
  ts: string
  channel: string
} {
  const messageObj = data.message || createDefaultMessageObject(data.ts, text, data.channel)
  return {
    message: messageObj,
    ts: data.ts,
    channel: data.channel,
  }
}

/**
 * Uploads files to Slack and returns the uploaded file IDs
 */
export async function uploadFilesToSlack(
  files: any[],
  accessToken: string,
  requestId: string,
  logger: Logger
): Promise<string[]> {
  const userFiles = processFilesToUserFiles(files, requestId, logger)
  const uploadedFileIds: string[] = []

  for (const userFile of userFiles) {
    logger.info(`[${requestId}] Uploading file: ${userFile.name}`)

    const buffer = await downloadFileFromStorage(userFile, requestId, logger)

    const getUrlResponse = await fetch('https://slack.com/api/files.getUploadURLExternal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${accessToken}`,
      },
      body: new URLSearchParams({
        filename: userFile.name,
        length: buffer.length.toString(),
      }),
    })

    const urlData = await getUrlResponse.json()

    if (!urlData.ok) {
      logger.error(`[${requestId}] Failed to get upload URL:`, urlData.error)
      continue
    }

    logger.info(`[${requestId}] Got upload URL for ${userFile.name}, file_id: ${urlData.file_id}`)

    const uploadResponse = await fetch(urlData.upload_url, {
      method: 'POST',
      body: new Uint8Array(buffer),
    })

    if (!uploadResponse.ok) {
      logger.error(`[${requestId}] Failed to upload file data: ${uploadResponse.status}`)
      continue
    }

    logger.info(`[${requestId}] File data uploaded successfully`)
    uploadedFileIds.push(urlData.file_id)
  }

  return uploadedFileIds
}

/**
 * Completes the file upload process by associating files with a channel
 */
export async function completeSlackFileUpload(
  uploadedFileIds: string[],
  channel: string,
  text: string,
  accessToken: string
): Promise<{ ok: boolean; files?: any[]; error?: string }> {
  const response = await fetch('https://slack.com/api/files.completeUploadExternal', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      files: uploadedFileIds.map((id) => ({ id })),
      channel_id: channel,
      initial_comment: text,
    }),
  })

  return response.json()
}

/**
 * Creates a message object for file uploads
 */
export function createFileMessageObject(
  text: string,
  channel: string,
  files: any[]
): Record<string, any> {
  const fileTs = files?.[0]?.created?.toString() || (Date.now() / 1000).toString()
  return {
    type: 'message',
    ts: fileTs,
    text,
    channel,
    files: files?.map((file: any) => ({
      id: file?.id,
      name: file?.name,
      mimetype: file?.mimetype,
      size: file?.size,
      url_private: file?.url_private,
      permalink: file?.permalink,
    })),
  }
}

/**
 * Opens a DM channel with a user and returns the channel ID
 */
export async function openDMChannel(
  accessToken: string,
  userId: string,
  requestId: string,
  logger: Logger
): Promise<string> {
  const response = await fetch('https://slack.com/api/conversations.open', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      users: userId,
    }),
  })

  const data = await response.json()

  if (!data.ok) {
    logger.error(`[${requestId}] Failed to open DM channel:`, data.error)
    throw new Error(data.error || 'Failed to open DM channel with user')
  }

  logger.info(`[${requestId}] Opened DM channel: ${data.channel.id}`)
  return data.channel.id
}

export interface SlackMessageParams {
  accessToken: string
  channel?: string
  userId?: string
  text: string
  threadTs?: string | null
  files?: any[] | null
}

/**
 * Sends a Slack message with optional file attachments
 * Supports both channel messages and direct messages via userId
 */
export async function sendSlackMessage(
  params: SlackMessageParams,
  requestId: string,
  logger: Logger
): Promise<{
  success: boolean
  output?: { message: any; ts: string; channel: string; fileCount?: number }
  error?: string
}> {
  const { accessToken, text, threadTs, files } = params
  let { channel } = params

  if (!channel && params.userId) {
    logger.info(`[${requestId}] Opening DM channel for user: ${params.userId}`)
    channel = await openDMChannel(accessToken, params.userId, requestId, logger)
  }

  if (!channel) {
    return { success: false, error: 'Either channel or userId is required' }
  }

  // No files - simple message
  if (!files || files.length === 0) {
    logger.info(`[${requestId}] No files, using chat.postMessage`)

    const data = await postSlackMessage(accessToken, channel, text, threadTs)

    if (!data.ok) {
      logger.error(`[${requestId}] Slack API error:`, data.error)
      return { success: false, error: data.error || 'Failed to send message' }
    }

    logger.info(`[${requestId}] Message sent successfully`)
    return { success: true, output: formatMessageSuccessResponse(data, text) }
  }

  // Process files
  logger.info(`[${requestId}] Processing ${files.length} file(s)`)
  const uploadedFileIds = await uploadFilesToSlack(files, accessToken, requestId, logger)

  // No valid files uploaded - send text-only
  if (uploadedFileIds.length === 0) {
    logger.warn(`[${requestId}] No valid files to upload, sending text-only message`)

    const data = await postSlackMessage(accessToken, channel, text, threadTs)

    if (!data.ok) {
      return { success: false, error: data.error || 'Failed to send message' }
    }

    return { success: true, output: formatMessageSuccessResponse(data, text) }
  }

  // Complete file upload
  const completeData = await completeSlackFileUpload(uploadedFileIds, channel, text, accessToken)

  if (!completeData.ok) {
    logger.error(`[${requestId}] Failed to complete upload:`, completeData.error)
    return { success: false, error: completeData.error || 'Failed to complete file upload' }
  }

  logger.info(`[${requestId}] Files uploaded and shared successfully`)

  const fileMessage = createFileMessageObject(text, channel, completeData.files || [])

  return {
    success: true,
    output: {
      message: fileMessage,
      ts: fileMessage.ts,
      channel,
      fileCount: uploadedFileIds.length,
    },
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/slack/add-reaction/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkHybridAuth } from '@/lib/auth/hybrid'

export const dynamic = 'force-dynamic'

const SlackAddReactionSchema = z.object({
  accessToken: z.string().min(1, 'Access token is required'),
  channel: z.string().min(1, 'Channel is required'),
  timestamp: z.string().min(1, 'Message timestamp is required'),
  name: z.string().min(1, 'Emoji name is required'),
})

export async function POST(request: NextRequest) {
  try {
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })

    if (!authResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: authResult.error || 'Authentication required',
        },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = SlackAddReactionSchema.parse(body)

    const slackResponse = await fetch('https://slack.com/api/reactions.add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${validatedData.accessToken}`,
      },
      body: JSON.stringify({
        channel: validatedData.channel,
        timestamp: validatedData.timestamp,
        name: validatedData.name,
      }),
    })

    const data = await slackResponse.json()

    if (!data.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.error || 'Failed to add reaction',
        },
        { status: slackResponse.status }
      )
    }

    return NextResponse.json({
      success: true,
      output: {
        content: `Successfully added :${validatedData.name}: reaction`,
        metadata: {
          channel: validatedData.channel,
          timestamp: validatedData.timestamp,
          reaction: validatedData.name,
        },
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          details: error.errors,
        },
        { status: 400 }
      )
    }

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
Location: sim-main/apps/sim/app/api/tools/slack/channels/route.ts
Signals: Next.js

```typescript
import { NextResponse } from 'next/server'
import { authorizeCredentialUse } from '@/lib/auth/credential-access'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { refreshAccessTokenIfNeeded } from '@/app/api/auth/oauth/utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('SlackChannelsAPI')

interface SlackChannel {
  id: string
  name: string
  is_private: boolean
  is_archived: boolean
  is_member: boolean
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
    let isBotToken = false

    if (credential.startsWith('xoxb-')) {
      accessToken = credential
      isBotToken = true
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

    let data
    try {
      data = await fetchSlackChannels(accessToken, true)
      logger.info('Successfully fetched channels including private channels')
    } catch (error) {
      if (isBotToken) {
        logger.warn(
          'Failed to fetch private channels with bot token, falling back to public channels only:',
          (error as Error).message
        )
        try {
          data = await fetchSlackChannels(accessToken, false)
          logger.info('Successfully fetched public channels only')
        } catch (fallbackError) {
          logger.error('Failed to fetch channels even with public-only fallback:', fallbackError)
          return NextResponse.json(
            { error: `Slack API error: ${(fallbackError as Error).message}` },
            { status: 400 }
          )
        }
      } else {
        logger.error('Slack API error with OAuth token:', error)
        return NextResponse.json(
          { error: `Slack API error: ${(error as Error).message}` },
          { status: 400 }
        )
      }
    }

    // Filter to channels the bot can access and format the response
    const channels = (data.channels || [])
      .filter((channel: SlackChannel) => {
        const canAccess = !channel.is_archived && (channel.is_member || !channel.is_private)

        if (!canAccess) {
          logger.debug(
            `Filtering out channel: ${channel.name} (archived: ${channel.is_archived}, private: ${channel.is_private}, member: ${channel.is_member})`
          )
        }

        return canAccess
      })
      .map((channel: SlackChannel) => ({
        id: channel.id,
        name: channel.name,
        isPrivate: channel.is_private,
      }))

    logger.info(`Successfully fetched ${channels.length} Slack channels`, {
      total: data.channels?.length || 0,
      private: channels.filter((c: { isPrivate: boolean }) => c.isPrivate).length,
      public: channels.filter((c: { isPrivate: boolean }) => !c.isPrivate).length,
      tokenType: isBotToken ? 'bot_token' : 'oauth',
    })
    return NextResponse.json({ channels })
  } catch (error) {
    logger.error('Error processing Slack channels request:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve Slack channels', details: (error as Error).message },
      { status: 500 }
    )
  }
}

async function fetchSlackChannels(accessToken: string, includePrivate = true) {
  const url = new URL('https://slack.com/api/conversations.list')

  if (includePrivate) {
    url.searchParams.append('types', 'public_channel,private_channel')
  } else {
    url.searchParams.append('types', 'public_channel')
  }

  url.searchParams.append('exclude_archived', 'true')
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
    throw new Error(data.error || 'Failed to fetch channels')
  }

  return data
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/slack/delete-message/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkHybridAuth } from '@/lib/auth/hybrid'

export const dynamic = 'force-dynamic'

const SlackDeleteMessageSchema = z.object({
  accessToken: z.string().min(1, 'Access token is required'),
  channel: z.string().min(1, 'Channel is required'),
  timestamp: z.string().min(1, 'Message timestamp is required'),
})

export async function POST(request: NextRequest) {
  try {
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })

    if (!authResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: authResult.error || 'Authentication required',
        },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = SlackDeleteMessageSchema.parse(body)

    const slackResponse = await fetch('https://slack.com/api/chat.delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${validatedData.accessToken}`,
      },
      body: JSON.stringify({
        channel: validatedData.channel,
        ts: validatedData.timestamp,
      }),
    })

    const data = await slackResponse.json()

    if (!data.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.error || 'Failed to delete message',
        },
        { status: slackResponse.status }
      )
    }

    return NextResponse.json({
      success: true,
      output: {
        content: 'Message deleted successfully',
        metadata: {
          channel: data.channel,
          timestamp: data.ts,
        },
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          details: error.errors,
        },
        { status: 400 }
      )
    }

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
Location: sim-main/apps/sim/app/api/tools/slack/read-messages/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { openDMChannel } from '../utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('SlackReadMessagesAPI')

const SlackReadMessagesSchema = z
  .object({
    accessToken: z.string().min(1, 'Access token is required'),
    channel: z.string().optional().nullable(),
    userId: z.string().optional().nullable(),
    limit: z.number().optional().nullable(),
    oldest: z.string().optional().nullable(),
    latest: z.string().optional().nullable(),
  })
  .refine((data) => data.channel || data.userId, {
    message: 'Either channel or userId is required',
  })

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })

    if (!authResult.success) {
      logger.warn(`[${requestId}] Unauthorized Slack read messages attempt: ${authResult.error}`)
      return NextResponse.json(
        {
          success: false,
          error: authResult.error || 'Authentication required',
        },
        { status: 401 }
      )
    }

    logger.info(
      `[${requestId}] Authenticated Slack read messages request via ${authResult.authType}`,
      {
        userId: authResult.userId,
      }
    )

    const body = await request.json()
    const validatedData = SlackReadMessagesSchema.parse(body)

    let channel = validatedData.channel
    if (!channel && validatedData.userId) {
      logger.info(`[${requestId}] Opening DM channel for user: ${validatedData.userId}`)
      channel = await openDMChannel(
        validatedData.accessToken,
        validatedData.userId,
        requestId,
        logger
      )
    }

    const url = new URL('https://slack.com/api/conversations.history')
    url.searchParams.append('channel', channel!)
    const limit = validatedData.limit ? Number(validatedData.limit) : 10
    url.searchParams.append('limit', String(Math.min(limit, 15)))

    if (validatedData.oldest) {
      url.searchParams.append('oldest', validatedData.oldest)
    }
    if (validatedData.latest) {
      url.searchParams.append('latest', validatedData.latest)
    }

    logger.info(`[${requestId}] Reading Slack messages`, {
      channel,
      limit,
    })

    const slackResponse = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${validatedData.accessToken}`,
      },
    })

    const data = await slackResponse.json()

    if (!data.ok) {
      logger.error(`[${requestId}] Slack API error:`, data)

      if (data.error === 'not_in_channel') {
        return NextResponse.json(
          {
            success: false,
            error:
              'Bot is not in the channel. Please invite the Sim bot to your Slack channel by typing: /invite @Sim Studio',
          },
          { status: 400 }
        )
      }
      if (data.error === 'channel_not_found') {
        return NextResponse.json(
          {
            success: false,
            error: 'Channel not found. Please check the channel ID and try again.',
          },
          { status: 400 }
        )
      }
      if (data.error === 'missing_scope') {
        return NextResponse.json(
          {
            success: false,
            error:
              'Missing required permissions. Please reconnect your Slack account with the necessary scopes (channels:history, groups:history, im:history).',
          },
          { status: 400 }
        )
      }

      return NextResponse.json(
        {
          success: false,
          error: data.error || 'Failed to fetch messages',
        },
        { status: 400 }
      )
    }

    const messages = (data.messages || []).map((message: any) => ({
      type: message.type || 'message',
      ts: message.ts,
      text: message.text || '',
      user: message.user,
      bot_id: message.bot_id,
      username: message.username,
      channel: message.channel,
      team: message.team,
      thread_ts: message.thread_ts,
      parent_user_id: message.parent_user_id,
      reply_count: message.reply_count,
      reply_users_count: message.reply_users_count,
      latest_reply: message.latest_reply,
      subscribed: message.subscribed,
      last_read: message.last_read,
      unread_count: message.unread_count,
      subtype: message.subtype,
      reactions: message.reactions?.map((reaction: any) => ({
        name: reaction.name,
        count: reaction.count,
        users: reaction.users || [],
      })),
      is_starred: message.is_starred,
      pinned_to: message.pinned_to,
      files: message.files?.map((file: any) => ({
        id: file.id,
        name: file.name,
        mimetype: file.mimetype,
        size: file.size,
        url_private: file.url_private,
        permalink: file.permalink,
        mode: file.mode,
      })),
      attachments: message.attachments,
      blocks: message.blocks,
      edited: message.edited
        ? {
            user: message.edited.user,
            ts: message.edited.ts,
          }
        : undefined,
      permalink: message.permalink,
    }))

    logger.info(`[${requestId}] Successfully read ${messages.length} messages`)

    return NextResponse.json({
      success: true,
      output: {
        messages,
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

    logger.error(`[${requestId}] Error reading Slack messages:`, error)
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
Location: sim-main/apps/sim/app/api/tools/slack/send-message/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { sendSlackMessage } from '../utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('SlackSendMessageAPI')

const SlackSendMessageSchema = z
  .object({
    accessToken: z.string().min(1, 'Access token is required'),
    channel: z.string().optional().nullable(),
    userId: z.string().optional().nullable(),
    text: z.string().min(1, 'Message text is required'),
    thread_ts: z.string().optional().nullable(),
    files: z.array(z.any()).optional().nullable(),
  })
  .refine((data) => data.channel || data.userId, {
    message: 'Either channel or userId is required',
  })

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })

    if (!authResult.success) {
      logger.warn(`[${requestId}] Unauthorized Slack send attempt: ${authResult.error}`)
      return NextResponse.json(
        {
          success: false,
          error: authResult.error || 'Authentication required',
        },
        { status: 401 }
      )
    }

    logger.info(`[${requestId}] Authenticated Slack send request via ${authResult.authType}`, {
      userId: authResult.userId,
    })

    const body = await request.json()
    const validatedData = SlackSendMessageSchema.parse(body)

    const isDM = !!validatedData.userId
    logger.info(`[${requestId}] Sending Slack message`, {
      channel: validatedData.channel,
      userId: validatedData.userId,
      isDM,
      hasFiles: !!(validatedData.files && validatedData.files.length > 0),
      fileCount: validatedData.files?.length || 0,
    })

    const result = await sendSlackMessage(
      {
        accessToken: validatedData.accessToken,
        channel: validatedData.channel ?? undefined,
        userId: validatedData.userId ?? undefined,
        text: validatedData.text,
        threadTs: validatedData.thread_ts ?? undefined,
        files: validatedData.files ?? undefined,
      },
      requestId,
      logger
    )

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    }

    return NextResponse.json({ success: true, output: result.output })
  } catch (error) {
    logger.error(`[${requestId}] Error sending Slack message:`, error)
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
Location: sim-main/apps/sim/app/api/tools/slack/update-message/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'

export const dynamic = 'force-dynamic'

const logger = createLogger('SlackUpdateMessageAPI')

const SlackUpdateMessageSchema = z.object({
  accessToken: z.string().min(1, 'Access token is required'),
  channel: z.string().min(1, 'Channel is required'),
  timestamp: z.string().min(1, 'Message timestamp is required'),
  text: z.string().min(1, 'Message text is required'),
})

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })

    if (!authResult.success) {
      logger.warn(`[${requestId}] Unauthorized Slack update message attempt: ${authResult.error}`)
      return NextResponse.json(
        {
          success: false,
          error: authResult.error || 'Authentication required',
        },
        { status: 401 }
      )
    }

    logger.info(
      `[${requestId}] Authenticated Slack update message request via ${authResult.authType}`,
      {
        userId: authResult.userId,
      }
    )

    const body = await request.json()
    const validatedData = SlackUpdateMessageSchema.parse(body)

    logger.info(`[${requestId}] Updating Slack message`, {
      channel: validatedData.channel,
      timestamp: validatedData.timestamp,
    })

    const slackResponse = await fetch('https://slack.com/api/chat.update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${validatedData.accessToken}`,
      },
      body: JSON.stringify({
        channel: validatedData.channel,
        ts: validatedData.timestamp,
        text: validatedData.text,
      }),
    })

    const data = await slackResponse.json()

    if (!data.ok) {
      logger.error(`[${requestId}] Slack API error:`, data)
      return NextResponse.json(
        {
          success: false,
          error: data.error || 'Failed to update message',
        },
        { status: slackResponse.status }
      )
    }

    logger.info(`[${requestId}] Message updated successfully`, {
      channel: data.channel,
      timestamp: data.ts,
    })

    const messageObj = data.message || {
      type: 'message',
      ts: data.ts,
      text: data.text || validatedData.text,
      channel: data.channel,
    }

    return NextResponse.json({
      success: true,
      output: {
        message: messageObj,
        content: 'Message updated successfully',
        metadata: {
          channel: data.channel,
          timestamp: data.ts,
          text: data.text || validatedData.text,
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

    logger.error(`[${requestId}] Error updating Slack message:`, error)
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

````
