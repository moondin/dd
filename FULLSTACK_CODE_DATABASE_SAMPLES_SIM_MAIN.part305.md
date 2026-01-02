---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 305
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 305 of 933)

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
Location: sim-main/apps/sim/app/api/tools/gmail/send/route.ts
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
  base64UrlEncode,
  buildMimeMessage,
  buildSimpleEmailMessage,
  fetchThreadingHeaders,
} from '@/tools/gmail/utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('GmailSendAPI')

const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1/users/me'

const GmailSendSchema = z.object({
  accessToken: z.string().min(1, 'Access token is required'),
  to: z.string().min(1, 'Recipient email is required'),
  subject: z.string().optional().nullable(),
  body: z.string().min(1, 'Email body is required'),
  contentType: z.enum(['text', 'html']).optional().nullable(),
  threadId: z.string().optional().nullable(),
  replyToMessageId: z.string().optional().nullable(),
  cc: z.string().optional().nullable(),
  bcc: z.string().optional().nullable(),
  attachments: z.array(z.any()).optional().nullable(),
})

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })

    if (!authResult.success) {
      logger.warn(`[${requestId}] Unauthorized Gmail send attempt: ${authResult.error}`)
      return NextResponse.json(
        {
          success: false,
          error: authResult.error || 'Authentication required',
        },
        { status: 401 }
      )
    }

    logger.info(`[${requestId}] Authenticated Gmail send request via ${authResult.authType}`, {
      userId: authResult.userId,
    })

    const body = await request.json()
    const validatedData = GmailSendSchema.parse(body)

    logger.info(`[${requestId}] Sending Gmail email`, {
      to: validatedData.to,
      subject: validatedData.subject || '',
      hasAttachments: !!(validatedData.attachments && validatedData.attachments.length > 0),
      attachmentCount: validatedData.attachments?.length || 0,
    })

    const threadingHeaders = validatedData.replyToMessageId
      ? await fetchThreadingHeaders(validatedData.replyToMessageId, validatedData.accessToken)
      : {}

    const originalMessageId = threadingHeaders.messageId
    const originalReferences = threadingHeaders.references
    const originalSubject = threadingHeaders.subject

    let rawMessage: string | undefined

    if (validatedData.attachments && validatedData.attachments.length > 0) {
      const rawAttachments = validatedData.attachments
      logger.info(`[${requestId}] Processing ${rawAttachments.length} attachment(s)`)

      const attachments = processFilesToUserFiles(rawAttachments, requestId, logger)

      if (attachments.length === 0) {
        logger.warn(`[${requestId}] No valid attachments found after processing`)
      } else {
        const totalSize = attachments.reduce((sum, file) => sum + file.size, 0)
        const maxSize = 25 * 1024 * 1024 // 25MB

        if (totalSize > maxSize) {
          const sizeMB = (totalSize / (1024 * 1024)).toFixed(2)
          return NextResponse.json(
            {
              success: false,
              error: `Total attachment size (${sizeMB}MB) exceeds Gmail's limit of 25MB`,
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
                mimeType: file.type || 'application/octet-stream',
                content: buffer,
              }
            } catch (error) {
              logger.error(`[${requestId}] Failed to download attachment ${file.name}:`, error)
              throw new Error(
                `Failed to download attachment "${file.name}": ${error instanceof Error ? error.message : 'Unknown error'}`
              )
            }
          })
        )

        const mimeMessage = buildMimeMessage({
          to: validatedData.to,
          cc: validatedData.cc ?? undefined,
          bcc: validatedData.bcc ?? undefined,
          subject: validatedData.subject || originalSubject || '',
          body: validatedData.body,
          contentType: validatedData.contentType || 'text',
          inReplyTo: originalMessageId,
          references: originalReferences,
          attachments: attachmentBuffers,
        })

        logger.info(`[${requestId}] Built MIME message (${mimeMessage.length} bytes)`)
        rawMessage = base64UrlEncode(mimeMessage)
      }
    }

    if (!rawMessage) {
      rawMessage = buildSimpleEmailMessage({
        to: validatedData.to,
        cc: validatedData.cc,
        bcc: validatedData.bcc,
        subject: validatedData.subject || originalSubject,
        body: validatedData.body,
        contentType: validatedData.contentType || 'text',
        inReplyTo: originalMessageId,
        references: originalReferences,
      })
    }

    const requestBody: { raw: string; threadId?: string } = { raw: rawMessage }

    if (validatedData.threadId) {
      requestBody.threadId = validatedData.threadId
    }

    const gmailResponse = await fetch(`${GMAIL_API_BASE}/messages/send`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${validatedData.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

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

    logger.info(`[${requestId}] Email sent successfully`, { messageId: data.id })

    return NextResponse.json({
      success: true,
      output: {
        content: 'Email sent successfully',
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

    logger.error(`[${requestId}] Error sending Gmail email:`, error)

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
Location: sim-main/apps/sim/app/api/tools/gmail/unarchive/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'

export const dynamic = 'force-dynamic'

const logger = createLogger('GmailUnarchiveAPI')

const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1/users/me'

const GmailUnarchiveSchema = z.object({
  accessToken: z.string().min(1, 'Access token is required'),
  messageId: z.string().min(1, 'Message ID is required'),
})

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })

    if (!authResult.success) {
      logger.warn(`[${requestId}] Unauthorized Gmail unarchive attempt: ${authResult.error}`)
      return NextResponse.json(
        {
          success: false,
          error: authResult.error || 'Authentication required',
        },
        { status: 401 }
      )
    }

    logger.info(`[${requestId}] Authenticated Gmail unarchive request via ${authResult.authType}`, {
      userId: authResult.userId,
    })

    const body = await request.json()
    const validatedData = GmailUnarchiveSchema.parse(body)

    logger.info(`[${requestId}] Unarchiving Gmail email`, {
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
          addLabelIds: ['INBOX'],
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

    logger.info(`[${requestId}] Email unarchived successfully`, { messageId: data.id })

    return NextResponse.json({
      success: true,
      output: {
        content: 'Email moved back to inbox successfully',
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

    logger.error(`[${requestId}] Error unarchiving Gmail email:`, error)

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
Location: sim-main/apps/sim/app/api/tools/google_calendar/calendars/route.ts
Signals: Next.js

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { authorizeCredentialUse } from '@/lib/auth/credential-access'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { refreshAccessTokenIfNeeded } from '@/app/api/auth/oauth/utils'
export const dynamic = 'force-dynamic'

const logger = createLogger('GoogleCalendarAPI')

interface CalendarListItem {
  id: string
  summary: string
  description?: string
  primary?: boolean
  accessRole: string
  backgroundColor?: string
  foregroundColor?: string
}

/**
 * Get calendars from Google Calendar
 */
export async function GET(request: NextRequest) {
  const requestId = generateRequestId()
  logger.info(`[${requestId}] Google Calendar calendars request received`)

  try {
    // Get the credential ID from the query params
    const { searchParams } = new URL(request.url)
    const credentialId = searchParams.get('credentialId')
    const workflowId = searchParams.get('workflowId') || undefined

    if (!credentialId) {
      logger.warn(`[${requestId}] Missing credentialId parameter`)
      return NextResponse.json({ error: 'Credential ID is required' }, { status: 400 })
    }
    const authz = await authorizeCredentialUse(request, { credentialId, workflowId })
    if (!authz.ok || !authz.credentialOwnerUserId) {
      return NextResponse.json({ error: authz.error || 'Unauthorized' }, { status: 403 })
    }

    // Refresh access token if needed using the utility function
    const accessToken = await refreshAccessTokenIfNeeded(
      credentialId,
      authz.credentialOwnerUserId,
      requestId
    )

    if (!accessToken) {
      return NextResponse.json({ error: 'Failed to obtain valid access token' }, { status: 401 })
    }

    // Fetch calendars from Google Calendar API
    logger.info(`[${requestId}] Fetching calendars from Google Calendar API`)
    const calendarResponse = await fetch(
      'https://www.googleapis.com/calendar/v3/users/me/calendarList',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!calendarResponse.ok) {
      const errorData = await calendarResponse
        .text()
        .then((text) => JSON.parse(text))
        .catch(() => ({ error: { message: 'Unknown error' } }))
      logger.error(`[${requestId}] Google Calendar API error`, {
        status: calendarResponse.status,
        error: errorData.error?.message || 'Failed to fetch calendars',
      })
      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to fetch calendars' },
        { status: calendarResponse.status }
      )
    }

    const data = await calendarResponse.json()
    const calendars: CalendarListItem[] = data.items || []

    // Sort calendars with primary first, then alphabetically
    calendars.sort((a, b) => {
      if (a.primary && !b.primary) return -1
      if (!a.primary && b.primary) return 1
      return a.summary.localeCompare(b.summary)
    })

    logger.info(`[${requestId}] Successfully fetched ${calendars.length} calendars`)

    return NextResponse.json({
      calendars: calendars.map((calendar) => ({
        id: calendar.id,
        summary: calendar.summary,
        description: calendar.description,
        primary: calendar.primary || false,
        accessRole: calendar.accessRole,
        backgroundColor: calendar.backgroundColor,
        foregroundColor: calendar.foregroundColor,
      })),
    })
  } catch (error) {
    logger.error(`[${requestId}] Error fetching Google calendars`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/google_drive/upload/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { processSingleFileToUserFile } from '@/lib/uploads/utils/file-utils'
import { downloadFileFromStorage } from '@/lib/uploads/utils/file-utils.server'
import {
  GOOGLE_WORKSPACE_MIME_TYPES,
  handleSheetsFormat,
  SOURCE_MIME_TYPES,
} from '@/tools/google_drive/utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('GoogleDriveUploadAPI')

const GOOGLE_DRIVE_API_BASE = 'https://www.googleapis.com/upload/drive/v3/files'

const GoogleDriveUploadSchema = z.object({
  accessToken: z.string().min(1, 'Access token is required'),
  fileName: z.string().min(1, 'File name is required'),
  file: z.any().optional().nullable(),
  mimeType: z.string().optional().nullable(),
  folderId: z.string().optional().nullable(),
})

/**
 * Build multipart upload body for Google Drive API
 */
function buildMultipartBody(
  metadata: Record<string, any>,
  fileBuffer: Buffer,
  mimeType: string,
  boundary: string
): string {
  const parts: string[] = []

  parts.push(`--${boundary}`)
  parts.push('Content-Type: application/json; charset=UTF-8')
  parts.push('')
  parts.push(JSON.stringify(metadata))

  parts.push(`--${boundary}`)
  parts.push(`Content-Type: ${mimeType}`)
  parts.push('Content-Transfer-Encoding: base64')
  parts.push('')
  parts.push(fileBuffer.toString('base64'))

  parts.push(`--${boundary}--`)

  return parts.join('\r\n')
}

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })

    if (!authResult.success) {
      logger.warn(`[${requestId}] Unauthorized Google Drive upload attempt: ${authResult.error}`)
      return NextResponse.json(
        {
          success: false,
          error: authResult.error || 'Authentication required',
        },
        { status: 401 }
      )
    }

    logger.info(
      `[${requestId}] Authenticated Google Drive upload request via ${authResult.authType}`,
      {
        userId: authResult.userId,
      }
    )

    const body = await request.json()
    const validatedData = GoogleDriveUploadSchema.parse(body)

    logger.info(`[${requestId}] Uploading file to Google Drive`, {
      fileName: validatedData.fileName,
      mimeType: validatedData.mimeType,
      folderId: validatedData.folderId,
      hasFile: !!validatedData.file,
    })

    if (!validatedData.file) {
      return NextResponse.json(
        {
          success: false,
          error: 'No file provided. Use the text content field for text-only uploads.',
        },
        { status: 400 }
      )
    }

    // Process file - convert to UserFile format if needed
    const fileData = validatedData.file

    let userFile
    try {
      userFile = processSingleFileToUserFile(fileData, requestId, logger)
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to process file',
        },
        { status: 400 }
      )
    }

    logger.info(`[${requestId}] Downloading file from storage`, {
      fileName: userFile.name,
      key: userFile.key,
      size: userFile.size,
    })

    let fileBuffer: Buffer

    try {
      fileBuffer = await downloadFileFromStorage(userFile, requestId, logger)
    } catch (error) {
      logger.error(`[${requestId}] Failed to download file:`, error)
      return NextResponse.json(
        {
          success: false,
          error: `Failed to download file: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
        { status: 500 }
      )
    }

    let uploadMimeType = validatedData.mimeType || userFile.type || 'application/octet-stream'
    const requestedMimeType = validatedData.mimeType || userFile.type || 'application/octet-stream'

    if (GOOGLE_WORKSPACE_MIME_TYPES.includes(requestedMimeType)) {
      uploadMimeType = SOURCE_MIME_TYPES[requestedMimeType] || 'text/plain'
      logger.info(`[${requestId}] Converting to Google Workspace type`, {
        requestedMimeType,
        uploadMimeType,
      })
    }

    if (requestedMimeType === 'application/vnd.google-apps.spreadsheet') {
      try {
        const textContent = fileBuffer.toString('utf-8')
        const { csv } = handleSheetsFormat(textContent)
        if (csv !== undefined) {
          fileBuffer = Buffer.from(csv, 'utf-8')
          uploadMimeType = 'text/csv'
          logger.info(`[${requestId}] Converted to CSV for Google Sheets upload`)
        }
      } catch (error) {
        logger.warn(`[${requestId}] Could not convert to CSV, uploading as-is:`, error)
      }
    }

    const metadata: {
      name: string
      mimeType: string
      parents?: string[]
    } = {
      name: validatedData.fileName,
      mimeType: requestedMimeType,
    }

    if (validatedData.folderId && validatedData.folderId.trim() !== '') {
      metadata.parents = [validatedData.folderId.trim()]
    }

    const boundary = `boundary_${Date.now()}_${Math.random().toString(36).substring(7)}`

    const multipartBody = buildMultipartBody(metadata, fileBuffer, uploadMimeType, boundary)

    logger.info(`[${requestId}] Uploading to Google Drive via multipart upload`, {
      fileName: validatedData.fileName,
      size: fileBuffer.length,
      uploadMimeType,
      requestedMimeType,
    })

    const uploadResponse = await fetch(
      `${GOOGLE_DRIVE_API_BASE}?uploadType=multipart&supportsAllDrives=true`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${validatedData.accessToken}`,
          'Content-Type': `multipart/related; boundary=${boundary}`,
          'Content-Length': Buffer.byteLength(multipartBody, 'utf-8').toString(),
        },
        body: multipartBody,
      }
    )

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      logger.error(`[${requestId}] Google Drive API error:`, {
        status: uploadResponse.status,
        statusText: uploadResponse.statusText,
        error: errorText,
      })
      return NextResponse.json(
        {
          success: false,
          error: `Google Drive API error: ${uploadResponse.statusText}`,
        },
        { status: uploadResponse.status }
      )
    }

    const uploadData = await uploadResponse.json()
    const fileId = uploadData.id

    logger.info(`[${requestId}] File uploaded successfully`, { fileId })

    if (GOOGLE_WORKSPACE_MIME_TYPES.includes(requestedMimeType)) {
      logger.info(`[${requestId}] Updating file name to ensure it persists after conversion`)

      const updateNameResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?supportsAllDrives=true`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${validatedData.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: validatedData.fileName,
          }),
        }
      )

      if (!updateNameResponse.ok) {
        logger.warn(
          `[${requestId}] Failed to update filename after conversion, but content was uploaded`
        )
      }
    }

    const finalFileResponse = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?supportsAllDrives=true&fields=id,name,mimeType,webViewLink,webContentLink,size,createdTime,modifiedTime,parents`,
      {
        headers: {
          Authorization: `Bearer ${validatedData.accessToken}`,
        },
      }
    )

    const finalFile = await finalFileResponse.json()

    logger.info(`[${requestId}] Upload complete`, {
      fileId: finalFile.id,
      fileName: finalFile.name,
      webViewLink: finalFile.webViewLink,
    })

    return NextResponse.json({
      success: true,
      output: {
        file: {
          id: finalFile.id,
          name: finalFile.name,
          mimeType: finalFile.mimeType,
          webViewLink: finalFile.webViewLink,
          webContentLink: finalFile.webContentLink,
          size: finalFile.size,
          createdTime: finalFile.createdTime,
          modifiedTime: finalFile.modifiedTime,
          parents: finalFile.parents,
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

    logger.error(`[${requestId}] Error uploading file to Google Drive:`, error)

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
Location: sim-main/apps/sim/app/api/tools/jira/issue/route.ts
Signals: Next.js

```typescript
import { NextResponse } from 'next/server'
import { validateJiraCloudId, validateJiraIssueKey } from '@/lib/core/security/input-validation'
import { createLogger } from '@/lib/logs/console/logger'
import { getJiraCloudId } from '@/tools/jira/utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('JiraIssueAPI')

export async function POST(request: Request) {
  try {
    const { domain, accessToken, issueId, cloudId: providedCloudId } = await request.json()
    if (!domain) {
      logger.error('Missing domain in request')
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 })
    }

    if (!accessToken) {
      logger.error('Missing access token in request')
      return NextResponse.json({ error: 'Access token is required' }, { status: 400 })
    }

    if (!issueId) {
      logger.error('Missing issue ID in request')
      return NextResponse.json({ error: 'Issue ID is required' }, { status: 400 })
    }

    const cloudId = providedCloudId || (await getJiraCloudId(domain, accessToken))
    logger.info('Using cloud ID:', cloudId)

    const cloudIdValidation = validateJiraCloudId(cloudId, 'cloudId')
    if (!cloudIdValidation.isValid) {
      return NextResponse.json({ error: cloudIdValidation.error }, { status: 400 })
    }

    const issueIdValidation = validateJiraIssueKey(issueId, 'issueId')
    if (!issueIdValidation.isValid) {
      return NextResponse.json({ error: issueIdValidation.error }, { status: 400 })
    }

    const url = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue/${issueId}`

    logger.info('Fetching Jira issue from:', url)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      logger.error('Jira API error:', {
        status: response.status,
        statusText: response.statusText,
      })

      let errorMessage
      try {
        const errorData = await response.json()
        logger.error('Error details:', errorData)
        errorMessage = errorData.message || `Failed to fetch issue (${response.status})`
      } catch (_e) {
        errorMessage = `Failed to fetch issue: ${response.status} ${response.statusText}`
      }
      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    const data = await response.json()
    logger.info('Successfully fetched issue:', data.key)

    const issueInfo: any = {
      id: data.key,
      name: data.fields.summary,
      mimeType: 'jira/issue',
      url: `https://${domain}/browse/${data.key}`,
      modifiedTime: data.fields.updated,
      webViewLink: `https://${domain}/browse/${data.key}`,
      status: data.fields.status?.name,
      description: data.fields.description,
      priority: data.fields.priority?.name,
      assignee: data.fields.assignee?.displayName,
      reporter: data.fields.reporter?.displayName,
      project: {
        key: data.fields.project?.key,
        name: data.fields.project?.name,
      },
    }

    return NextResponse.json({
      issue: issueInfo,
      cloudId,
    })
  } catch (error) {
    logger.error('Error processing request:', error)
    return NextResponse.json(
      {
        error: 'Failed to retrieve Jira issue',
        details: (error as Error).message,
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/jira/issues/route.ts
Signals: Next.js

```typescript
import { NextResponse } from 'next/server'
import { validateAlphanumericId, validateJiraCloudId } from '@/lib/core/security/input-validation'
import { createLogger } from '@/lib/logs/console/logger'
import { getJiraCloudId } from '@/tools/jira/utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('JiraIssuesAPI')

const createErrorResponse = async (response: Response, defaultMessage: string) => {
  try {
    const errorData = await response.json()
    return errorData.message || errorData.errorMessages?.[0] || defaultMessage
  } catch {
    return defaultMessage
  }
}

const validateRequiredParams = (domain: string | null, accessToken: string | null) => {
  if (!domain) {
    return NextResponse.json({ error: 'Domain is required' }, { status: 400 })
  }
  if (!accessToken) {
    return NextResponse.json({ error: 'Access token is required' }, { status: 400 })
  }
  return null
}

export async function POST(request: Request) {
  try {
    const { domain, accessToken, issueKeys = [], cloudId: providedCloudId } = await request.json()

    const validationError = validateRequiredParams(domain || null, accessToken || null)
    if (validationError) return validationError

    if (issueKeys.length === 0) {
      logger.info('No issue keys provided, returning empty result')
      return NextResponse.json({ issues: [] })
    }

    const cloudId = providedCloudId || (await getJiraCloudId(domain!, accessToken!))

    const cloudIdValidation = validateJiraCloudId(cloudId, 'cloudId')
    if (!cloudIdValidation.isValid) {
      return NextResponse.json({ error: cloudIdValidation.error }, { status: 400 })
    }

    // Use search/jql endpoint (GET) with URL parameters
    const jql = `issueKey in (${issueKeys.map((k: string) => k.trim()).join(',')})`
    const params = new URLSearchParams({
      jql,
      fields: 'summary,status,assignee,updated,project',
      maxResults: String(Math.min(issueKeys.length, 100)),
    })
    const searchUrl = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/search/jql?${params.toString()}`

    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      logger.error(`Jira API error: ${response.status} ${response.statusText}`)
      const errorMessage = await createErrorResponse(
        response,
        `Failed to fetch Jira issues (${response.status})`
      )
      if (response.status === 401 || response.status === 403) {
        return NextResponse.json(
          {
            error: errorMessage,
            authRequired: true,
            requiredScopes: ['read:jira-work', 'read:project:jira'],
          },
          { status: response.status }
        )
      }
      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    const data = await response.json()
    const issues = (data.issues || []).map((it: any) => ({
      id: it.key,
      name: it.fields?.summary || it.key,
      mimeType: 'jira/issue',
      url: `https://${domain}/browse/${it.key}`,
      modifiedTime: it.fields?.updated,
      webViewLink: `https://${domain}/browse/${it.key}`,
    }))

    return NextResponse.json({ issues, cloudId })
  } catch (error) {
    logger.error('Error fetching Jira issues:', error)
    return NextResponse.json(
      { error: (error as Error).message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const domain = url.searchParams.get('domain')?.trim()
    const accessToken = url.searchParams.get('accessToken')
    const providedCloudId = url.searchParams.get('cloudId')
    const query = url.searchParams.get('query') || ''
    const projectId = url.searchParams.get('projectId') || ''
    const manualProjectId = url.searchParams.get('manualProjectId') || ''
    const all = url.searchParams.get('all')?.toLowerCase() === 'true'
    const limitParam = Number.parseInt(url.searchParams.get('limit') || '', 10)
    const limit = Number.isFinite(limitParam) && limitParam > 0 ? limitParam : 0

    const validationError = validateRequiredParams(domain || null, accessToken || null)
    if (validationError) return validationError

    const cloudId = providedCloudId || (await getJiraCloudId(domain!, accessToken!))

    const cloudIdValidation = validateJiraCloudId(cloudId, 'cloudId')
    if (!cloudIdValidation.isValid) {
      return NextResponse.json({ error: cloudIdValidation.error }, { status: 400 })
    }

    if (projectId) {
      const projectIdValidation = validateAlphanumericId(projectId, 'projectId', 100)
      if (!projectIdValidation.isValid) {
        return NextResponse.json({ error: projectIdValidation.error }, { status: 400 })
      }
    }
    if (manualProjectId) {
      const manualProjectIdValidation = validateAlphanumericId(
        manualProjectId,
        'manualProjectId',
        100
      )
      if (!manualProjectIdValidation.isValid) {
        return NextResponse.json({ error: manualProjectIdValidation.error }, { status: 400 })
      }
    }

    let data: any

    if (query || projectId || manualProjectId) {
      const SAFETY_CAP = 1000
      const PAGE_SIZE = 100
      const target = Math.min(all ? limit || SAFETY_CAP : 25, SAFETY_CAP)
      const projectKey = (projectId || manualProjectId || '').trim()

      const escapeJql = (s: string) => s.replace(/"/g, '\\"')

      const buildJql = (startAt: number) => {
        const jqlParts: string[] = []
        if (projectKey) jqlParts.push(`project = ${projectKey}`)
        if (query) {
          const q = escapeJql(query)
          // Match by key prefix or summary text
          jqlParts.push(`(key ~ "${q}" OR summary ~ "${q}")`)
        }
        const jql = `${jqlParts.length ? `${jqlParts.join(' AND ')} ` : ''}ORDER BY updated DESC`
        const params = new URLSearchParams({
          jql,
          fields: 'summary,key,updated',
          maxResults: String(Math.min(PAGE_SIZE, target)),
        })
        if (startAt > 0) {
          params.set('startAt', String(startAt))
        }
        return {
          url: `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/search/jql?${params.toString()}`,
        }
      }

      let startAt = 0
      let collected: any[] = []
      let total = 0

      do {
        const { url: apiUrl } = buildJql(startAt)
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
        })

        if (!response.ok) {
          const errorMessage = await createErrorResponse(
            response,
            `Failed to fetch issues (${response.status})`
          )
          if (response.status === 401 || response.status === 403) {
            return NextResponse.json(
              {
                error: errorMessage,
                authRequired: true,
                requiredScopes: ['read:jira-work', 'read:project:jira'],
              },
              { status: response.status }
            )
          }
          return NextResponse.json({ error: errorMessage }, { status: response.status })
        }

        const page = await response.json()
        const issues = page.issues || []
        total = page.total || issues.length
        collected = collected.concat(issues)
        startAt += PAGE_SIZE
      } while (all && collected.length < Math.min(total, target))

      const issues = collected.slice(0, target).map((it: any) => ({
        key: it.key,
        summary: it.fields?.summary || it.key,
      }))
      data = { sections: [{ issues }], cloudId }
    } else {
      data = { sections: [], cloudId }
    }

    return NextResponse.json({ ...data, cloudId })
  } catch (error) {
    logger.error('Error fetching Jira issue suggestions:', error)
    return NextResponse.json(
      { error: (error as Error).message || 'Internal server error' },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

````
