---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 307
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 307 of 933)

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
Location: sim-main/apps/sim/app/api/tools/microsoft_planner/tasks/route.ts
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
import type { PlannerTask } from '@/tools/microsoft_planner/types'

const logger = createLogger('MicrosoftPlannerTasksAPI')

export async function GET(request: NextRequest) {
  const requestId = randomUUID().slice(0, 8)

  try {
    const session = await getSession()

    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthenticated request rejected`)
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const credentialId = searchParams.get('credentialId')
    const planId = searchParams.get('planId')

    if (!credentialId) {
      logger.error(`[${requestId}] Missing credentialId parameter`)
      return NextResponse.json({ error: 'Credential ID is required' }, { status: 400 })
    }

    if (!planId) {
      logger.error(`[${requestId}] Missing planId parameter`)
      return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 })
    }

    const planIdValidation = validateMicrosoftGraphId(planId, 'planId')
    if (!planIdValidation.isValid) {
      logger.error(`[${requestId}] Invalid planId: ${planIdValidation.error}`)
      return NextResponse.json({ error: planIdValidation.error }, { status: 400 })
    }

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

    const response = await fetch(`https://graph.microsoft.com/v1.0/planner/plans/${planId}/tasks`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      logger.error(`[${requestId}] Microsoft Graph API error:`, errorText)
      return NextResponse.json(
        { error: 'Failed to fetch tasks from Microsoft Graph' },
        { status: response.status }
      )
    }

    const data = await response.json()
    const tasks = data.value || []

    const filteredTasks = tasks.map((task: PlannerTask) => ({
      id: task.id,
      title: task.title,
      planId: task.planId,
      bucketId: task.bucketId,
      percentComplete: task.percentComplete,
      priority: task.priority,
      dueDateTime: task.dueDateTime,
      createdDateTime: task.createdDateTime,
      completedDateTime: task.completedDateTime,
      hasDescription: task.hasDescription,
      assignments: task.assignments ? Object.keys(task.assignments) : [],
    }))

    return NextResponse.json({
      tasks: filteredTasks,
      metadata: {
        planId,
        planUrl: `https://graph.microsoft.com/v1.0/planner/plans/${planId}`,
      },
    })
  } catch (error) {
    logger.error(`[${requestId}] Error fetching Microsoft Planner tasks:`, error)
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/microsoft_teams/delete_chat_message/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'

export const dynamic = 'force-dynamic'

const logger = createLogger('TeamsDeleteChatMessageAPI')

const TeamsDeleteChatMessageSchema = z.object({
  accessToken: z.string().min(1, 'Access token is required'),
  chatId: z.string().min(1, 'Chat ID is required'),
  messageId: z.string().min(1, 'Message ID is required'),
})

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })

    if (!authResult.success) {
      logger.warn(`[${requestId}] Unauthorized Teams chat delete attempt: ${authResult.error}`)
      return NextResponse.json(
        {
          success: false,
          error: authResult.error || 'Authentication required',
        },
        { status: 401 }
      )
    }

    logger.info(
      `[${requestId}] Authenticated Teams chat message delete request via ${authResult.authType}`,
      {
        userId: authResult.userId,
      }
    )

    const body = await request.json()
    const validatedData = TeamsDeleteChatMessageSchema.parse(body)

    logger.info(`[${requestId}] Deleting Teams chat message`, {
      chatId: validatedData.chatId,
      messageId: validatedData.messageId,
    })

    // First, get the current user's ID (required for chat message deletion endpoint)
    const meUrl = 'https://graph.microsoft.com/v1.0/me'
    const meResponse = await fetch(meUrl, {
      headers: {
        Authorization: `Bearer ${validatedData.accessToken}`,
      },
    })

    if (!meResponse.ok) {
      const errorData = await meResponse.json().catch(() => ({}))
      logger.error(`[${requestId}] Failed to get user ID:`, errorData)
      return NextResponse.json(
        {
          success: false,
          error: errorData.error?.message || 'Failed to get user information',
        },
        { status: meResponse.status }
      )
    }

    const userData = await meResponse.json()
    const userId = userData.id

    logger.info(`[${requestId}] Retrieved user ID: ${userId}`)

    // Now perform the softDelete operation using the correct endpoint format
    const deleteUrl = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(userId)}/chats/${encodeURIComponent(validatedData.chatId)}/messages/${encodeURIComponent(validatedData.messageId)}/softDelete`

    const deleteResponse = await fetch(deleteUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${validatedData.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}), // softDelete requires an empty JSON body
    })

    if (!deleteResponse.ok) {
      const errorData = await deleteResponse.json().catch(() => ({}))
      logger.error(`[${requestId}] Microsoft Teams API delete error:`, errorData)
      return NextResponse.json(
        {
          success: false,
          error: errorData.error?.message || 'Failed to delete Teams message',
        },
        { status: deleteResponse.status }
      )
    }

    logger.info(`[${requestId}] Teams message deleted successfully`)

    return NextResponse.json({
      success: true,
      output: {
        deleted: true,
        messageId: validatedData.messageId,
        metadata: {
          messageId: validatedData.messageId,
          chatId: validatedData.chatId,
        },
      },
    })
  } catch (error) {
    logger.error(`[${requestId}] Error deleting Teams chat message:`, error)
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
Location: sim-main/apps/sim/app/api/tools/microsoft_teams/write_channel/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { processFilesToUserFiles } from '@/lib/uploads/utils/file-utils'
import { downloadFileFromStorage } from '@/lib/uploads/utils/file-utils.server'
import { resolveMentionsForChannel, type TeamsMention } from '@/tools/microsoft_teams/utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('TeamsWriteChannelAPI')

const TeamsWriteChannelSchema = z.object({
  accessToken: z.string().min(1, 'Access token is required'),
  teamId: z.string().min(1, 'Team ID is required'),
  channelId: z.string().min(1, 'Channel ID is required'),
  content: z.string().min(1, 'Message content is required'),
  files: z.array(z.any()).optional().nullable(),
})

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })

    if (!authResult.success) {
      logger.warn(`[${requestId}] Unauthorized Teams channel write attempt: ${authResult.error}`)
      return NextResponse.json(
        {
          success: false,
          error: authResult.error || 'Authentication required',
        },
        { status: 401 }
      )
    }

    logger.info(
      `[${requestId}] Authenticated Teams channel write request via ${authResult.authType}`,
      {
        userId: authResult.userId,
      }
    )

    const body = await request.json()
    const validatedData = TeamsWriteChannelSchema.parse(body)

    logger.info(`[${requestId}] Sending Teams channel message`, {
      teamId: validatedData.teamId,
      channelId: validatedData.channelId,
      hasFiles: !!(validatedData.files && validatedData.files.length > 0),
      fileCount: validatedData.files?.length || 0,
    })

    const attachments: any[] = []
    if (validatedData.files && validatedData.files.length > 0) {
      const rawFiles = validatedData.files
      logger.info(`[${requestId}] Processing ${rawFiles.length} file(s) for upload to OneDrive`)

      const userFiles = processFilesToUserFiles(rawFiles, requestId, logger)

      for (const file of userFiles) {
        try {
          logger.info(`[${requestId}] Uploading file to Teams: ${file.name} (${file.size} bytes)`)

          const buffer = await downloadFileFromStorage(file, requestId, logger)

          const uploadUrl =
            'https://graph.microsoft.com/v1.0/me/drive/root:/TeamsAttachments/' +
            encodeURIComponent(file.name) +
            ':/content'

          logger.info(`[${requestId}] Uploading to Teams: ${uploadUrl}`)

          const uploadResponse = await fetch(uploadUrl, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${validatedData.accessToken}`,
              'Content-Type': file.type || 'application/octet-stream',
            },
            body: new Uint8Array(buffer),
          })

          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json().catch(() => ({}))
            logger.error(`[${requestId}] Teams upload failed:`, errorData)
            throw new Error(
              `Failed to upload file to Teams: ${errorData.error?.message || 'Unknown error'}`
            )
          }

          const uploadedFile = await uploadResponse.json()
          logger.info(`[${requestId}] File uploaded to Teams successfully`, {
            id: uploadedFile.id,
            webUrl: uploadedFile.webUrl,
          })

          const fileDetailsUrl = `https://graph.microsoft.com/v1.0/me/drive/items/${uploadedFile.id}?$select=id,name,webDavUrl,eTag,size`

          const fileDetailsResponse = await fetch(fileDetailsUrl, {
            headers: {
              Authorization: `Bearer ${validatedData.accessToken}`,
            },
          })

          if (!fileDetailsResponse.ok) {
            const errorData = await fileDetailsResponse.json().catch(() => ({}))
            logger.error(`[${requestId}] Failed to get file details:`, errorData)
            throw new Error(
              `Failed to get file details: ${errorData.error?.message || 'Unknown error'}`
            )
          }

          const fileDetails = await fileDetailsResponse.json()
          logger.info(`[${requestId}] Got file details`, {
            webDavUrl: fileDetails.webDavUrl,
            eTag: fileDetails.eTag,
          })

          const attachmentId = fileDetails.eTag?.match(/\{([a-f0-9-]+)\}/i)?.[1] || fileDetails.id

          attachments.push({
            id: attachmentId,
            contentType: 'reference',
            contentUrl: fileDetails.webDavUrl,
            name: file.name,
          })

          logger.info(`[${requestId}] Created attachment reference for ${file.name}`)
        } catch (error) {
          logger.error(`[${requestId}] Failed to process file ${file.name}:`, error)
          throw new Error(
            `Failed to process file "${file.name}": ${error instanceof Error ? error.message : 'Unknown error'}`
          )
        }
      }

      logger.info(
        `[${requestId}] All ${attachments.length} file(s) uploaded and attachment references created`
      )
    }

    let messageContent = validatedData.content
    let contentType: 'text' | 'html' = 'text'
    const mentionEntities: TeamsMention[] = []

    try {
      const mentionResult = await resolveMentionsForChannel(
        validatedData.content,
        validatedData.teamId,
        validatedData.channelId,
        validatedData.accessToken
      )

      if (mentionResult.hasMentions) {
        contentType = 'html'
        messageContent = mentionResult.updatedContent
        mentionEntities.push(...mentionResult.mentions)
        logger.info(`[${requestId}] Resolved ${mentionResult.mentions.length} mention(s)`)
      }
    } catch (error) {
      logger.warn(`[${requestId}] Failed to resolve mentions, continuing without them:`, error)
    }

    if (attachments.length > 0) {
      contentType = 'html'
      const attachmentTags = attachments
        .map((att) => `<attachment id="${att.id}"></attachment>`)
        .join(' ')
      messageContent = `${messageContent}<br/>${attachmentTags}`
    }

    const messageBody: {
      body: {
        contentType: 'text' | 'html'
        content: string
      }
      attachments?: any[]
      mentions?: TeamsMention[]
    } = {
      body: {
        contentType,
        content: messageContent,
      },
    }

    if (attachments.length > 0) {
      messageBody.attachments = attachments
    }

    if (mentionEntities.length > 0) {
      messageBody.mentions = mentionEntities
    }

    logger.info(`[${requestId}] Sending message to Teams channel: ${validatedData.channelId}`)

    const teamsUrl = `https://graph.microsoft.com/v1.0/teams/${encodeURIComponent(validatedData.teamId)}/channels/${encodeURIComponent(validatedData.channelId)}/messages`

    const teamsResponse = await fetch(teamsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${validatedData.accessToken}`,
      },
      body: JSON.stringify(messageBody),
    })

    if (!teamsResponse.ok) {
      const errorData = await teamsResponse.json().catch(() => ({}))
      logger.error(`[${requestId}] Microsoft Teams API error:`, errorData)
      return NextResponse.json(
        {
          success: false,
          error: errorData.error?.message || 'Failed to send Teams channel message',
        },
        { status: teamsResponse.status }
      )
    }

    const responseData = await teamsResponse.json()
    logger.info(`[${requestId}] Teams channel message sent successfully`, {
      messageId: responseData.id,
      attachmentCount: attachments.length,
    })

    return NextResponse.json({
      success: true,
      output: {
        updatedContent: true,
        metadata: {
          messageId: responseData.id,
          teamId: responseData.channelIdentity?.teamId || validatedData.teamId,
          channelId: responseData.channelIdentity?.channelId || validatedData.channelId,
          content: responseData.body?.content || validatedData.content,
          createdTime: responseData.createdDateTime || new Date().toISOString(),
          url: responseData.webUrl || '',
          attachmentCount: attachments.length,
        },
      },
    })
  } catch (error) {
    logger.error(`[${requestId}] Error sending Teams channel message:`, error)
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
Location: sim-main/apps/sim/app/api/tools/microsoft_teams/write_chat/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { processFilesToUserFiles } from '@/lib/uploads/utils/file-utils'
import { downloadFileFromStorage } from '@/lib/uploads/utils/file-utils.server'
import { resolveMentionsForChat, type TeamsMention } from '@/tools/microsoft_teams/utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('TeamsWriteChatAPI')

const TeamsWriteChatSchema = z.object({
  accessToken: z.string().min(1, 'Access token is required'),
  chatId: z.string().min(1, 'Chat ID is required'),
  content: z.string().min(1, 'Message content is required'),
  files: z.array(z.any()).optional().nullable(),
})

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })

    if (!authResult.success) {
      logger.warn(`[${requestId}] Unauthorized Teams chat write attempt: ${authResult.error}`)
      return NextResponse.json(
        {
          success: false,
          error: authResult.error || 'Authentication required',
        },
        { status: 401 }
      )
    }

    logger.info(
      `[${requestId}] Authenticated Teams chat write request via ${authResult.authType}`,
      {
        userId: authResult.userId,
      }
    )

    const body = await request.json()
    const validatedData = TeamsWriteChatSchema.parse(body)

    logger.info(`[${requestId}] Sending Teams chat message`, {
      chatId: validatedData.chatId,
      hasFiles: !!(validatedData.files && validatedData.files.length > 0),
      fileCount: validatedData.files?.length || 0,
    })

    const attachments: any[] = []
    if (validatedData.files && validatedData.files.length > 0) {
      const rawFiles = validatedData.files
      logger.info(`[${requestId}] Processing ${rawFiles.length} file(s) for upload to Teams`)

      const userFiles = processFilesToUserFiles(rawFiles, requestId, logger)

      for (const file of userFiles) {
        try {
          logger.info(`[${requestId}] Uploading file to Teams: ${file.name} (${file.size} bytes)`)

          const buffer = await downloadFileFromStorage(file, requestId, logger)

          const uploadUrl =
            'https://graph.microsoft.com/v1.0/me/drive/root:/TeamsAttachments/' +
            encodeURIComponent(file.name) +
            ':/content'

          logger.info(`[${requestId}] Uploading to Teams: ${uploadUrl}`)

          const uploadResponse = await fetch(uploadUrl, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${validatedData.accessToken}`,
              'Content-Type': file.type || 'application/octet-stream',
            },
            body: new Uint8Array(buffer),
          })

          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json().catch(() => ({}))
            logger.error(`[${requestId}] Teams upload failed:`, errorData)
            throw new Error(
              `Failed to upload file to Teams: ${errorData.error?.message || 'Unknown error'}`
            )
          }

          const uploadedFile = await uploadResponse.json()
          logger.info(`[${requestId}] File uploaded to Teams successfully`, {
            id: uploadedFile.id,
            webUrl: uploadedFile.webUrl,
          })

          const fileDetailsUrl = `https://graph.microsoft.com/v1.0/me/drive/items/${uploadedFile.id}?$select=id,name,webDavUrl,eTag,size`

          const fileDetailsResponse = await fetch(fileDetailsUrl, {
            headers: {
              Authorization: `Bearer ${validatedData.accessToken}`,
            },
          })

          if (!fileDetailsResponse.ok) {
            const errorData = await fileDetailsResponse.json().catch(() => ({}))
            logger.error(`[${requestId}] Failed to get file details:`, errorData)
            throw new Error(
              `Failed to get file details: ${errorData.error?.message || 'Unknown error'}`
            )
          }

          const fileDetails = await fileDetailsResponse.json()
          logger.info(`[${requestId}] Got file details`, {
            webDavUrl: fileDetails.webDavUrl,
            eTag: fileDetails.eTag,
          })

          const attachmentId = fileDetails.eTag?.match(/\{([a-f0-9-]+)\}/i)?.[1] || fileDetails.id

          attachments.push({
            id: attachmentId,
            contentType: 'reference',
            contentUrl: fileDetails.webDavUrl,
            name: file.name,
          })

          logger.info(`[${requestId}] Created attachment reference for ${file.name}`)
        } catch (error) {
          logger.error(`[${requestId}] Failed to process file ${file.name}:`, error)
          throw new Error(
            `Failed to process file "${file.name}": ${error instanceof Error ? error.message : 'Unknown error'}`
          )
        }
      }

      logger.info(
        `[${requestId}] All ${attachments.length} file(s) uploaded and attachment references created`
      )
    }

    let messageContent = validatedData.content
    let contentType: 'text' | 'html' = 'text'
    const mentionEntities: TeamsMention[] = []

    try {
      const mentionResult = await resolveMentionsForChat(
        validatedData.content,
        validatedData.chatId,
        validatedData.accessToken
      )

      if (mentionResult.hasMentions) {
        contentType = 'html'
        messageContent = mentionResult.updatedContent
        mentionEntities.push(...mentionResult.mentions)
        logger.info(`[${requestId}] Resolved ${mentionResult.mentions.length} mention(s)`)
      }
    } catch (error) {
      logger.warn(`[${requestId}] Failed to resolve mentions, continuing without them:`, error)
    }

    if (attachments.length > 0) {
      contentType = 'html'
      const attachmentTags = attachments
        .map((att) => `<attachment id="${att.id}"></attachment>`)
        .join(' ')
      messageContent = `${messageContent}<br/>${attachmentTags}`
    }

    const messageBody: {
      body: {
        contentType: 'text' | 'html'
        content: string
      }
      attachments?: any[]
      mentions?: TeamsMention[]
    } = {
      body: {
        contentType,
        content: messageContent,
      },
    }

    if (attachments.length > 0) {
      messageBody.attachments = attachments
    }

    if (mentionEntities.length > 0) {
      messageBody.mentions = mentionEntities
    }

    logger.info(`[${requestId}] Sending message to Teams chat: ${validatedData.chatId}`)

    const teamsUrl = `https://graph.microsoft.com/v1.0/chats/${encodeURIComponent(validatedData.chatId)}/messages`

    const teamsResponse = await fetch(teamsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${validatedData.accessToken}`,
      },
      body: JSON.stringify(messageBody),
    })

    if (!teamsResponse.ok) {
      const errorData = await teamsResponse.json().catch(() => ({}))
      logger.error(`[${requestId}] Microsoft Teams API error:`, errorData)
      return NextResponse.json(
        {
          success: false,
          error: errorData.error?.message || 'Failed to send Teams message',
        },
        { status: teamsResponse.status }
      )
    }

    const responseData = await teamsResponse.json()
    logger.info(`[${requestId}] Teams message sent successfully`, {
      messageId: responseData.id,
      attachmentCount: attachments.length,
    })

    return NextResponse.json({
      success: true,
      output: {
        updatedContent: true,
        metadata: {
          messageId: responseData.id,
          chatId: responseData.chatId || validatedData.chatId,
          content: responseData.body?.content || validatedData.content,
          createdTime: responseData.createdDateTime || new Date().toISOString(),
          url: responseData.webUrl || '',
          attachmentCount: attachments.length,
        },
      },
    })
  } catch (error) {
    logger.error(`[${requestId}] Error sending Teams chat message:`, error)
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
Location: sim-main/apps/sim/app/api/tools/mistral/parse/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { generateRequestId } from '@/lib/core/utils/request'
import { getBaseUrl } from '@/lib/core/utils/urls'
import { createLogger } from '@/lib/logs/console/logger'
import { StorageService } from '@/lib/uploads'
import { extractStorageKey, inferContextFromKey } from '@/lib/uploads/utils/file-utils'
import { verifyFileAccess } from '@/app/api/files/authorization'

export const dynamic = 'force-dynamic'

const logger = createLogger('MistralParseAPI')

const MistralParseSchema = z.object({
  apiKey: z.string().min(1, 'API key is required'),
  filePath: z.string().min(1, 'File path is required'),
  resultType: z.string().optional(),
  pages: z.array(z.number()).optional(),
  includeImageBase64: z.boolean().optional(),
  imageLimit: z.number().optional(),
  imageMinSize: z.number().optional(),
})

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })

    if (!authResult.success || !authResult.userId) {
      logger.warn(`[${requestId}] Unauthorized Mistral parse attempt`, {
        error: authResult.error || 'Missing userId',
      })
      return NextResponse.json(
        {
          success: false,
          error: authResult.error || 'Unauthorized',
        },
        { status: 401 }
      )
    }

    const userId = authResult.userId
    const body = await request.json()
    const validatedData = MistralParseSchema.parse(body)

    logger.info(`[${requestId}] Mistral parse request`, {
      filePath: validatedData.filePath,
      isWorkspaceFile: validatedData.filePath.includes('/api/files/serve/'),
      userId,
    })

    let fileUrl = validatedData.filePath

    if (validatedData.filePath?.includes('/api/files/serve/')) {
      try {
        const storageKey = extractStorageKey(validatedData.filePath)

        const context = inferContextFromKey(storageKey)

        const hasAccess = await verifyFileAccess(
          storageKey,
          userId,
          undefined, // customConfig
          context, // context
          false // isLocal
        )

        if (!hasAccess) {
          logger.warn(`[${requestId}] Unauthorized presigned URL generation attempt`, {
            userId,
            key: storageKey,
            context,
          })
          return NextResponse.json(
            {
              success: false,
              error: 'File not found',
            },
            { status: 404 }
          )
        }

        fileUrl = await StorageService.generatePresignedDownloadUrl(storageKey, context, 5 * 60)
        logger.info(`[${requestId}] Generated presigned URL for ${context} file`)
      } catch (error) {
        logger.error(`[${requestId}] Failed to generate presigned URL:`, error)
        return NextResponse.json(
          {
            success: false,
            error: 'Failed to generate file access URL',
          },
          { status: 500 }
        )
      }
    } else if (validatedData.filePath?.startsWith('/')) {
      const baseUrl = getBaseUrl()
      fileUrl = `${baseUrl}${validatedData.filePath}`
    }

    const mistralBody: any = {
      model: 'mistral-ocr-latest',
      document: {
        type: 'document_url',
        document_url: fileUrl,
      },
    }

    if (validatedData.pages) {
      mistralBody.pages = validatedData.pages
    }
    if (validatedData.includeImageBase64 !== undefined) {
      mistralBody.include_image_base64 = validatedData.includeImageBase64
    }
    if (validatedData.imageLimit) {
      mistralBody.image_limit = validatedData.imageLimit
    }
    if (validatedData.imageMinSize) {
      mistralBody.image_min_size = validatedData.imageMinSize
    }

    const mistralResponse = await fetch('https://api.mistral.ai/v1/ocr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${validatedData.apiKey}`,
      },
      body: JSON.stringify(mistralBody),
    })

    if (!mistralResponse.ok) {
      const errorText = await mistralResponse.text()
      logger.error(`[${requestId}] Mistral API error:`, errorText)
      return NextResponse.json(
        {
          success: false,
          error: `Mistral API error: ${mistralResponse.statusText}`,
        },
        { status: mistralResponse.status }
      )
    }

    const mistralData = await mistralResponse.json()

    logger.info(`[${requestId}] Mistral parse successful`)

    return NextResponse.json({
      success: true,
      output: mistralData,
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

    logger.error(`[${requestId}] Error in Mistral parse:`, error)

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

---[FILE: utils.ts]---
Location: sim-main/apps/sim/app/api/tools/mongodb/utils.ts

```typescript
import { MongoClient } from 'mongodb'
import type { MongoDBConnectionConfig } from '@/tools/mongodb/types'

export async function createMongoDBConnection(config: MongoDBConnectionConfig) {
  const credentials =
    config.username && config.password
      ? `${encodeURIComponent(config.username)}:${encodeURIComponent(config.password)}@`
      : ''

  const queryParams = new URLSearchParams()

  if (config.authSource) {
    queryParams.append('authSource', config.authSource)
  }

  if (config.ssl === 'required') {
    queryParams.append('ssl', 'true')
  }

  const queryString = queryParams.toString()
  const uri = `mongodb://${credentials}${config.host}:${config.port}/${config.database}${queryString ? `?${queryString}` : ''}`

  const client = new MongoClient(uri, {
    connectTimeoutMS: 10000,
    socketTimeoutMS: 10000,
    maxPoolSize: 1,
  })

  await client.connect()
  return client
}

export function validateFilter(filter: string): { isValid: boolean; error?: string } {
  try {
    const parsed = JSON.parse(filter)

    const dangerousOperators = ['$where', '$regex', '$expr', '$function', '$accumulator', '$let']

    const checkForDangerousOps = (obj: any): boolean => {
      if (typeof obj !== 'object' || obj === null) return false

      for (const key of Object.keys(obj)) {
        if (dangerousOperators.includes(key)) return true
        if (typeof obj[key] === 'object' && checkForDangerousOps(obj[key])) return true
      }
      return false
    }

    if (checkForDangerousOps(parsed)) {
      return {
        isValid: false,
        error: 'Filter contains potentially dangerous operators',
      }
    }

    return { isValid: true }
  } catch (error) {
    return {
      isValid: false,
      error: 'Invalid JSON format in filter',
    }
  }
}

export function validatePipeline(pipeline: string): { isValid: boolean; error?: string } {
  try {
    const parsed = JSON.parse(pipeline)

    if (!Array.isArray(parsed)) {
      return {
        isValid: false,
        error: 'Pipeline must be an array',
      }
    }

    const dangerousOperators = [
      '$where',
      '$function',
      '$accumulator',
      '$let',
      '$merge',
      '$out',
      '$currentOp',
      '$listSessions',
      '$listLocalSessions',
    ]

    const checkPipelineStage = (stage: any): boolean => {
      if (typeof stage !== 'object' || stage === null) return false

      for (const key of Object.keys(stage)) {
        if (dangerousOperators.includes(key)) return true
        if (typeof stage[key] === 'object' && checkPipelineStage(stage[key])) return true
      }
      return false
    }

    for (const stage of parsed) {
      if (checkPipelineStage(stage)) {
        return {
          isValid: false,
          error: 'Pipeline contains potentially dangerous operators',
        }
      }
    }

    return { isValid: true }
  } catch (error) {
    return {
      isValid: false,
      error: 'Invalid JSON format in pipeline',
    }
  }
}

export function sanitizeCollectionName(name: string): string {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
    throw new Error(
      'Invalid collection name. Must start with letter or underscore and contain only letters, numbers, and underscores.'
    )
  }
  return name
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/mongodb/delete/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createLogger } from '@/lib/logs/console/logger'
import { createMongoDBConnection, sanitizeCollectionName, validateFilter } from '../utils'

const logger = createLogger('MongoDBDeleteAPI')

const DeleteSchema = z.object({
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
      message: 'Filter is required for MongoDB Delete',
    }),
  multi: z
    .union([z.boolean(), z.string(), z.undefined()])
    .optional()
    .transform((val) => {
      if (val === 'true' || val === true) return true
      if (val === 'false' || val === false) return false
      return false // Default to false
    }),
})

export async function POST(request: NextRequest) {
  const requestId = randomUUID().slice(0, 8)
  let client = null

  try {
    const body = await request.json()
    const params = DeleteSchema.parse(body)

    logger.info(
      `[${requestId}] Deleting document(s) from ${params.host}:${params.port}/${params.database}.${params.collection} (multi: ${params.multi})`
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
    try {
      filterDoc = JSON.parse(params.filter)
    } catch (error) {
      logger.warn(`[${requestId}] Invalid filter JSON: ${params.filter}`)
      return NextResponse.json({ error: 'Invalid JSON format in filter' }, { status: 400 })
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
      result = await coll.deleteMany(filterDoc)
    } else {
      result = await coll.deleteOne(filterDoc)
    }

    logger.info(`[${requestId}] Delete completed: ${result.deletedCount} documents deleted`)

    return NextResponse.json({
      message: `${result.deletedCount} documents deleted`,
      deletedCount: result.deletedCount,
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
    logger.error(`[${requestId}] MongoDB delete failed:`, error)

    return NextResponse.json({ error: `MongoDB delete failed: ${errorMessage}` }, { status: 500 })
  } finally {
    if (client) {
      await client.close()
    }
  }
}
```

--------------------------------------------------------------------------------

````
