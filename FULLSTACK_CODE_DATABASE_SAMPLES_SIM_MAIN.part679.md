---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 679
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 679 of 933)

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

---[FILE: search.ts]---
Location: sim-main/apps/sim/tools/gmail/search.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { GmailSearchParams, GmailToolResponse } from '@/tools/gmail/types'
import {
  createMessagesSummary,
  GMAIL_API_BASE,
  processMessageForSummary,
} from '@/tools/gmail/utils'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('GmailSearchTool')

export const gmailSearchTool: ToolConfig<GmailSearchParams, GmailToolResponse> = {
  id: 'gmail_search',
  name: 'Gmail Search',
  description: 'Search emails in Gmail',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'google-email',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Access token for Gmail API',
    },
    query: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Search query for emails',
    },
    maxResults: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Maximum number of results to return',
    },
  },

  request: {
    url: (params: GmailSearchParams) => {
      const searchParams = new URLSearchParams()
      searchParams.append('q', params.query)
      if (params.maxResults) {
        searchParams.append('maxResults', Number(params.maxResults).toString())
      }
      return `${GMAIL_API_BASE}/messages?${searchParams.toString()}`
    },
    method: 'GET',
    headers: (params: GmailSearchParams) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response, params) => {
    const data = await response.json()

    if (!data.messages || data.messages.length === 0) {
      return {
        success: true,
        output: {
          content: 'No messages found matching your search query.',
          metadata: {
            results: [],
          },
        },
      }
    }

    try {
      // Fetch full message details for each result
      const messagePromises = data.messages.map(async (msg: any) => {
        const messageResponse = await fetch(`${GMAIL_API_BASE}/messages/${msg.id}?format=full`, {
          headers: {
            Authorization: `Bearer ${params?.accessToken || ''}`,
            'Content-Type': 'application/json',
          },
        })

        if (!messageResponse.ok) {
          throw new Error(`Failed to fetch details for message ${msg.id}`)
        }

        return await messageResponse.json()
      })

      const messages = await Promise.all(messagePromises)

      // Process all messages and create a summary
      const processedMessages = messages.map(processMessageForSummary)

      return {
        success: true,
        output: {
          content: createMessagesSummary(processedMessages),
          metadata: {
            results: processedMessages.map((msg) => ({
              id: msg.id,
              threadId: msg.threadId,
              subject: msg.subject,
              from: msg.from,
              date: msg.date,
              snippet: msg.snippet,
            })),
          },
        },
      }
    } catch (error: any) {
      logger.error('Error fetching message details:', error)
      return {
        success: true,
        output: {
          content: `Found ${data.messages.length} messages but couldn't retrieve all details: ${error.message || 'Unknown error'}`,
          metadata: {
            results: data.messages.map((msg: any) => ({
              id: msg.id,
              threadId: msg.threadId,
            })),
          },
        },
      }
    }
  },

  outputs: {
    content: { type: 'string', description: 'Search results summary' },
    metadata: {
      type: 'object',
      description: 'Search metadata',
      properties: {
        results: {
          type: 'array',
          description: 'Array of search results',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', description: 'Gmail message ID' },
              threadId: { type: 'string', description: 'Gmail thread ID' },
              subject: { type: 'string', description: 'Email subject' },
              from: { type: 'string', description: 'Sender email address' },
              date: { type: 'string', description: 'Email date' },
              snippet: { type: 'string', description: 'Email snippet/preview' },
            },
          },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: send.ts]---
Location: sim-main/apps/sim/tools/gmail/send.ts

```typescript
import type { GmailSendParams, GmailToolResponse } from '@/tools/gmail/types'
import type { ToolConfig } from '@/tools/types'

export const gmailSendTool: ToolConfig<GmailSendParams, GmailToolResponse> = {
  id: 'gmail_send',
  name: 'Gmail Send',
  description: 'Send emails using Gmail',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'google-email',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Access token for Gmail API',
    },
    to: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Recipient email address',
    },
    subject: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Email subject',
    },
    body: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Email body content',
    },
    contentType: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Content type for the email body (text or html)',
    },
    threadId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Thread ID to reply to (for threading)',
    },
    replyToMessageId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Gmail message ID to reply to - use the "id" field from Gmail Read results (not the RFC "messageId")',
    },
    cc: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'CC recipients (comma-separated)',
    },
    bcc: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'BCC recipients (comma-separated)',
    },
    attachments: {
      type: 'file[]',
      required: false,
      visibility: 'user-only',
      description: 'Files to attach to the email',
    },
  },

  request: {
    url: '/api/tools/gmail/send',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params: GmailSendParams) => ({
      accessToken: params.accessToken,
      to: params.to,
      subject: params.subject,
      body: params.body,
      contentType: params.contentType || 'text',
      threadId: params.threadId,
      replyToMessageId: params.replyToMessageId,
      cc: params.cc,
      bcc: params.bcc,
      attachments: params.attachments,
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (!data.success) {
      return {
        success: false,
        output: {
          content: data.error || 'Failed to send email',
          metadata: {},
        },
        error: data.error,
      }
    }

    return {
      success: true,
      output: {
        content: data.output.content,
        metadata: data.output.metadata,
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Success message' },
    metadata: {
      type: 'object',
      description: 'Email metadata',
      properties: {
        id: { type: 'string', description: 'Gmail message ID' },
        threadId: { type: 'string', description: 'Gmail thread ID' },
        labelIds: { type: 'array', items: { type: 'string' }, description: 'Email labels' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/gmail/types.ts

```typescript
import type { UserFile } from '@/executor/types'
import type { ToolResponse } from '@/tools/types'

// Base parameters shared by all operations
interface BaseGmailParams {
  accessToken: string
}

// Send operation parameters
export interface GmailSendParams extends BaseGmailParams {
  to: string
  cc?: string
  bcc?: string
  subject?: string
  body: string
  contentType?: 'text' | 'html'
  threadId?: string
  replyToMessageId?: string
  attachments?: UserFile[]
}

// Read operation parameters
export interface GmailReadParams extends BaseGmailParams {
  messageId: string
  folder: string
  unreadOnly?: boolean
  maxResults?: number
  includeAttachments?: boolean
}

// Search operation parameters
export interface GmailSearchParams extends BaseGmailParams {
  query: string
  maxResults?: number
}

// Move operation parameters
export interface GmailMoveParams extends BaseGmailParams {
  messageId: string
  addLabelIds: string
  removeLabelIds?: string
}

// Mark as read/unread parameters (reuses simple messageId pattern)
export interface GmailMarkReadParams extends BaseGmailParams {
  messageId: string
}

// Label management parameters
export interface GmailLabelParams extends BaseGmailParams {
  messageId: string
  labelIds: string
}

// Union type for all Gmail tool parameters
export type GmailToolParams =
  | GmailSendParams
  | GmailReadParams
  | GmailSearchParams
  | GmailMoveParams
  | GmailMarkReadParams
  | GmailLabelParams

// Response metadata
interface BaseGmailMetadata {
  id?: string
  threadId?: string
  labelIds?: string[]
}

interface EmailMetadata extends BaseGmailMetadata {
  from?: string
  to?: string
  subject?: string
  date?: string
  hasAttachments?: boolean
  attachmentCount?: number
}

interface SearchMetadata extends BaseGmailMetadata {
  results: Array<{
    id: string
    threadId: string
  }>
}

// Response format
export interface GmailToolResponse extends ToolResponse {
  output: {
    content: string
    metadata: EmailMetadata | SearchMetadata
    attachments?: GmailAttachment[]
  }
}

// Email Message Interface
export interface GmailMessage {
  id: string
  threadId: string
  labelIds: string[]
  snippet: string
  payload: {
    headers: Array<{
      name: string
      value: string
    }>
    body: {
      data?: string
      attachmentId?: string
      size?: number
    }
    parts?: Array<{
      mimeType: string
      filename?: string
      body: {
        data?: string
        attachmentId?: string
        size?: number
      }
      parts?: Array<any>
    }>
  }
}

// Gmail Attachment Interface (for processed attachments)
export interface GmailAttachment {
  name: string
  data: Buffer
  mimeType: string
  size: number
}
```

--------------------------------------------------------------------------------

---[FILE: unarchive.ts]---
Location: sim-main/apps/sim/tools/gmail/unarchive.ts

```typescript
import type { GmailMarkReadParams, GmailToolResponse } from '@/tools/gmail/types'
import type { ToolConfig } from '@/tools/types'

export const gmailUnarchiveTool: ToolConfig<GmailMarkReadParams, GmailToolResponse> = {
  id: 'gmail_unarchive',
  name: 'Gmail Unarchive',
  description: 'Unarchive a Gmail message (move back to inbox)',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'google-email',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Access token for Gmail API',
    },
    messageId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'ID of the message to unarchive',
    },
  },

  request: {
    url: '/api/tools/gmail/unarchive',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params: GmailMarkReadParams) => ({
      accessToken: params.accessToken,
      messageId: params.messageId,
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (!data.success) {
      return {
        success: false,
        output: {
          content: data.error || 'Failed to unarchive email',
          metadata: {},
        },
        error: data.error,
      }
    }

    return {
      success: true,
      output: {
        content: data.output.content,
        metadata: data.output.metadata,
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Success message' },
    metadata: {
      type: 'object',
      description: 'Email metadata',
      properties: {
        id: { type: 'string', description: 'Gmail message ID' },
        threadId: { type: 'string', description: 'Gmail thread ID' },
        labelIds: { type: 'array', items: { type: 'string' }, description: 'Updated email labels' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/tools/gmail/utils.ts

```typescript
import type {
  GmailAttachment,
  GmailMessage,
  GmailReadParams,
  GmailToolResponse,
} from '@/tools/gmail/types'

export const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1/users/me'

/**
 * Fetch original message headers for threading
 * @param messageId Gmail message ID to fetch headers from
 * @param accessToken Gmail access token
 * @returns Object containing threading headers (messageId, references, subject)
 */
export async function fetchThreadingHeaders(
  messageId: string,
  accessToken: string
): Promise<{
  messageId?: string
  references?: string
  subject?: string
}> {
  try {
    const messageResponse = await fetch(
      `${GMAIL_API_BASE}/messages/${messageId}?format=metadata&metadataHeaders=Message-ID&metadataHeaders=References&metadataHeaders=Subject`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (messageResponse.ok) {
      const messageData = await messageResponse.json()
      const headers = messageData.payload?.headers || []

      return {
        messageId: headers.find((h: any) => h.name.toLowerCase() === 'message-id')?.value,
        references: headers.find((h: any) => h.name.toLowerCase() === 'references')?.value,
        subject: headers.find((h: any) => h.name.toLowerCase() === 'subject')?.value,
      }
    }
  } catch (error) {
    // Continue without threading headers rather than failing
  }

  return {}
}

// Helper function to process a Gmail message
export async function processMessage(
  message: GmailMessage,
  params?: GmailReadParams
): Promise<GmailToolResponse> {
  // Check if message and payload exist
  if (!message || !message.payload) {
    return {
      success: true,
      output: {
        content: 'Unable to process email: Invalid message format',
        metadata: {
          id: message?.id || '',
          threadId: message?.threadId || '',
          labelIds: message?.labelIds || [],
        },
      },
    }
  }

  const headers = message.payload.headers || []
  const subject = headers.find((h) => h.name.toLowerCase() === 'subject')?.value || ''
  const from = headers.find((h) => h.name.toLowerCase() === 'from')?.value || ''
  const to = headers.find((h) => h.name.toLowerCase() === 'to')?.value || ''
  const date = headers.find((h) => h.name.toLowerCase() === 'date')?.value || ''

  // Extract the message body
  const body = extractMessageBody(message.payload)

  // Check for attachments
  const attachmentInfo = extractAttachmentInfo(message.payload)
  const hasAttachments = attachmentInfo.length > 0

  // Download attachments if requested
  let attachments: GmailAttachment[] | undefined
  if (params?.includeAttachments && hasAttachments && params.accessToken) {
    try {
      attachments = await downloadAttachments(message.id, attachmentInfo, params.accessToken)
    } catch (error) {
      // Continue without attachments rather than failing the entire request
    }
  }

  const result: GmailToolResponse = {
    success: true,
    output: {
      content: body || 'No content found in email',
      metadata: {
        id: message.id || '',
        threadId: message.threadId || '',
        labelIds: message.labelIds || [],
        from,
        to,
        subject,
        date,
        hasAttachments,
        attachmentCount: attachmentInfo.length,
      },
      // Always include attachments array (empty if none downloaded)
      attachments: attachments || [],
    },
  }

  return result
}

// Helper function to process a message for summary (without full content)
export function processMessageForSummary(message: GmailMessage): any {
  if (!message || !message.payload) {
    return {
      id: message?.id || '',
      threadId: message?.threadId || '',
      subject: 'Unknown Subject',
      from: 'Unknown Sender',
      to: '',
      date: '',
      snippet: message?.snippet || '',
    }
  }

  const headers = message.payload.headers || []
  const subject = headers.find((h) => h.name.toLowerCase() === 'subject')?.value || 'No Subject'
  const from = headers.find((h) => h.name.toLowerCase() === 'from')?.value || 'Unknown Sender'
  const to = headers.find((h) => h.name.toLowerCase() === 'to')?.value || ''
  const date = headers.find((h) => h.name.toLowerCase() === 'date')?.value || ''

  return {
    id: message.id,
    threadId: message.threadId,
    subject,
    from,
    to,
    date,
    snippet: message.snippet || '',
  }
}

// Helper function to recursively extract message body from MIME parts
export function extractMessageBody(payload: any): string {
  // If the payload has a body with data, decode it
  if (payload.body?.data) {
    return Buffer.from(payload.body.data, 'base64').toString()
  }

  // If there are no parts, return empty string
  if (!payload.parts || !Array.isArray(payload.parts) || payload.parts.length === 0) {
    return ''
  }

  // First try to find a text/plain part
  const textPart = payload.parts.find((part: any) => part.mimeType === 'text/plain')
  if (textPart?.body?.data) {
    return Buffer.from(textPart.body.data, 'base64').toString()
  }

  // If no text/plain, try to find text/html
  const htmlPart = payload.parts.find((part: any) => part.mimeType === 'text/html')
  if (htmlPart?.body?.data) {
    return Buffer.from(htmlPart.body.data, 'base64').toString()
  }

  // If we have multipart/alternative or other complex types, recursively check parts
  for (const part of payload.parts) {
    if (part.parts) {
      const nestedBody = extractMessageBody(part)
      if (nestedBody) {
        return nestedBody
      }
    }
  }

  // If we couldn't find any text content, return empty string
  return ''
}

// Helper function to extract attachment information from message payload
export function extractAttachmentInfo(
  payload: any
): Array<{ attachmentId: string; filename: string; mimeType: string; size: number }> {
  const attachments: Array<{
    attachmentId: string
    filename: string
    mimeType: string
    size: number
  }> = []

  function processPayloadPart(part: any) {
    // Check if this part has an attachment
    if (part.body?.attachmentId && part.filename) {
      attachments.push({
        attachmentId: part.body.attachmentId,
        filename: part.filename,
        mimeType: part.mimeType || 'application/octet-stream',
        size: part.body.size || 0,
      })
    }

    // Recursively process nested parts
    if (part.parts && Array.isArray(part.parts)) {
      part.parts.forEach(processPayloadPart)
    }
  }

  // Process the main payload
  processPayloadPart(payload)

  return attachments
}

// Helper function to download attachments from Gmail API
export async function downloadAttachments(
  messageId: string,
  attachmentInfo: Array<{ attachmentId: string; filename: string; mimeType: string; size: number }>,
  accessToken: string
): Promise<GmailAttachment[]> {
  const downloadedAttachments: GmailAttachment[] = []

  for (const attachment of attachmentInfo) {
    try {
      // Download attachment from Gmail API
      const attachmentResponse = await fetch(
        `${GMAIL_API_BASE}/messages/${messageId}/attachments/${attachment.attachmentId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!attachmentResponse.ok) {
        continue
      }

      const attachmentData = (await attachmentResponse.json()) as { data: string; size: number }

      // Decode base64url data to buffer
      // Gmail API returns data in base64url format (URL-safe base64)
      const base64Data = attachmentData.data.replace(/-/g, '+').replace(/_/g, '/')
      const buffer = Buffer.from(base64Data, 'base64')

      downloadedAttachments.push({
        name: attachment.filename,
        data: buffer,
        mimeType: attachment.mimeType,
        size: attachment.size,
      })
    } catch (error) {
      // Continue with other attachments
    }
  }

  return downloadedAttachments
}

// Helper function to create a summary of multiple messages
export function createMessagesSummary(messages: any[]): string {
  if (messages.length === 0) {
    return 'No messages found.'
  }

  let summary = `Found ${messages.length} messages:\n\n`

  messages.forEach((msg, index) => {
    summary += `${index + 1}. Subject: ${msg.subject}\n`
    summary += `   From: ${msg.from}\n`
    summary += `   To: ${msg.to}\n`
    summary += `   Date: ${msg.date}\n`
    summary += `   ID: ${msg.id}\n`
    summary += `   Thread ID: ${msg.threadId}\n`
    summary += `   Preview: ${msg.snippet}\n\n`
  })

  summary += `To read full content of a specific message, use the gmail_read tool with messageId: ${messages.map((m) => m.id).join(', ')}`

  return summary
}

/**
 * Generate a unique MIME boundary string
 */
function generateBoundary(): string {
  return `----=_Part_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

/**
 * Encode string or buffer to base64url format (URL-safe base64)
 * Gmail API requires base64url encoding for the raw message field
 */
export function base64UrlEncode(data: string | Buffer): string {
  const base64 = Buffer.from(data).toString('base64')
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/**
 * Build a simple text email message (without attachments)
 * @param params Email parameters including recipients, subject, body, and threading info
 * @returns Base64url encoded raw message
 */
export function buildSimpleEmailMessage(params: {
  to: string
  cc?: string | null
  bcc?: string | null
  subject?: string | null
  body: string
  contentType?: 'text' | 'html'
  inReplyTo?: string
  references?: string
}): string {
  const { to, cc, bcc, subject, body, contentType, inReplyTo, references } = params
  const mimeContentType = contentType === 'html' ? 'text/html' : 'text/plain'
  const emailHeaders = [
    `Content-Type: ${mimeContentType}; charset="UTF-8"`,
    'MIME-Version: 1.0',
    `To: ${to}`,
  ]

  if (cc) {
    emailHeaders.push(`Cc: ${cc}`)
  }
  if (bcc) {
    emailHeaders.push(`Bcc: ${bcc}`)
  }

  emailHeaders.push(`Subject: ${subject || ''}`)

  if (inReplyTo) {
    emailHeaders.push(`In-Reply-To: ${inReplyTo}`)
    const referencesChain = references ? `${references} ${inReplyTo}` : inReplyTo
    emailHeaders.push(`References: ${referencesChain}`)
  }

  emailHeaders.push('', body)
  const email = emailHeaders.join('\n')
  return Buffer.from(email).toString('base64url')
}

/**
 * Build a MIME multipart message with optional attachments
 * @param params Message parameters including recipients, subject, body, and attachments
 * @returns Complete MIME message string ready to be base64url encoded
 */
export interface BuildMimeMessageParams {
  to: string
  cc?: string
  bcc?: string
  subject?: string
  body: string
  contentType?: 'text' | 'html'
  inReplyTo?: string
  references?: string
  attachments?: Array<{
    filename: string
    mimeType: string
    content: Buffer
  }>
}

export function buildMimeMessage(params: BuildMimeMessageParams): string {
  const { to, cc, bcc, subject, body, contentType, inReplyTo, references, attachments } = params
  const boundary = generateBoundary()
  const messageParts: string[] = []
  const mimeContentType = contentType === 'html' ? 'text/html' : 'text/plain'

  messageParts.push(`To: ${to}`)
  if (cc) {
    messageParts.push(`Cc: ${cc}`)
  }
  if (bcc) {
    messageParts.push(`Bcc: ${bcc}`)
  }
  messageParts.push(`Subject: ${subject || ''}`)

  if (inReplyTo) {
    messageParts.push(`In-Reply-To: ${inReplyTo}`)
  }
  if (references) {
    const referencesChain = inReplyTo ? `${references} ${inReplyTo}` : references
    messageParts.push(`References: ${referencesChain}`)
  } else if (inReplyTo) {
    messageParts.push(`References: ${inReplyTo}`)
  }

  messageParts.push('MIME-Version: 1.0')

  if (attachments && attachments.length > 0) {
    messageParts.push(`Content-Type: multipart/mixed; boundary="${boundary}"`)
    messageParts.push('')
    messageParts.push(`--${boundary}`)
    messageParts.push(`Content-Type: ${mimeContentType}; charset="UTF-8"`)
    messageParts.push('Content-Transfer-Encoding: 7bit')
    messageParts.push('')
    messageParts.push(body)
    messageParts.push('')

    for (const attachment of attachments) {
      messageParts.push(`--${boundary}`)
      messageParts.push(`Content-Type: ${attachment.mimeType}`)
      messageParts.push(`Content-Disposition: attachment; filename="${attachment.filename}"`)
      messageParts.push('Content-Transfer-Encoding: base64')
      messageParts.push('')

      const base64Content = attachment.content.toString('base64')
      const lines = base64Content.match(/.{1,76}/g) || []
      messageParts.push(...lines)
      messageParts.push('')
    }

    messageParts.push(`--${boundary}--`)
  } else {
    messageParts.push(`Content-Type: ${mimeContentType}; charset="UTF-8"`)
    messageParts.push('MIME-Version: 1.0')
    messageParts.push('')
    messageParts.push(body)
  }

  return messageParts.join('\n')
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/google/index.ts

```typescript
import { searchTool } from './search'

export const googleSearchTool = searchTool
```

--------------------------------------------------------------------------------

---[FILE: search.ts]---
Location: sim-main/apps/sim/tools/google/search.ts

```typescript
import type { GoogleSearchParams, GoogleSearchResponse } from '@/tools/google/types'
import type { ToolConfig } from '@/tools/types'

export const searchTool: ToolConfig<GoogleSearchParams, GoogleSearchResponse> = {
  id: 'google_search',
  name: 'Google Search',
  description: 'Search the web with the Custom Search API',
  version: '1.0.0',

  params: {
    query: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The search query to execute',
    },
    searchEngineId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Custom Search Engine ID',
    },
    num: {
      type: 'string', // Treated as string for compatibility with tool interfaces
      required: false,
      visibility: 'user-only',
      description: 'Number of results to return (default: 10, max: 10)',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Google API key',
    },
  },

  request: {
    url: (params: GoogleSearchParams) => {
      const baseUrl = 'https://www.googleapis.com/customsearch/v1'
      const searchParams = new URLSearchParams()

      // Add required parameters
      searchParams.append('key', params.apiKey)
      searchParams.append('q', params.query)
      searchParams.append('cx', params.searchEngineId)

      // Add optional parameter
      if (params.num) {
        searchParams.append('num', params.num.toString())
      }

      return `${baseUrl}?${searchParams.toString()}`
    },
    method: 'GET',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        items: data.items || [],
        searchInformation: data.searchInformation || {
          totalResults: '0',
          searchTime: 0,
          formattedSearchTime: '0',
          formattedTotalResults: '0',
        },
      },
    }
  },

  outputs: {
    items: {
      type: 'array',
      description: 'Array of search results from Google',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Title of the search result' },
          link: { type: 'string', description: 'URL of the search result' },
          snippet: { type: 'string', description: 'Snippet or description of the search result' },
          displayLink: { type: 'string', description: 'Display URL', optional: true },
          pagemap: { type: 'object', description: 'Additional page metadata', optional: true },
        },
      },
    },
    searchInformation: {
      type: 'object',
      description: 'Information about the search query and results',
      properties: {
        totalResults: { type: 'string', description: 'Total number of search results available' },
        searchTime: { type: 'number', description: 'Time taken to perform the search in seconds' },
        formattedSearchTime: { type: 'string', description: 'Formatted search time for display' },
        formattedTotalResults: {
          type: 'string',
          description: 'Formatted total results count for display',
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/google/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface GoogleSearchParams {
  query: string
  apiKey: string
  searchEngineId: string
  num?: number | string
}

export interface GoogleSearchResponse extends ToolResponse {
  output: {
    items: Array<{
      title: string
      link: string
      snippet: string
      displayLink?: string
      pagemap?: Record<string, any>
    }>
    searchInformation: {
      totalResults: string
      searchTime: number
      formattedSearchTime: string
      formattedTotalResults: string
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: create.ts]---
Location: sim-main/apps/sim/tools/google_calendar/create.ts

```typescript
import {
  CALENDAR_API_BASE,
  type GoogleCalendarApiEventResponse,
  type GoogleCalendarCreateParams,
  type GoogleCalendarCreateResponse,
  type GoogleCalendarEventRequestBody,
} from '@/tools/google_calendar/types'
import type { ToolConfig } from '@/tools/types'

export const createTool: ToolConfig<GoogleCalendarCreateParams, GoogleCalendarCreateResponse> = {
  id: 'google_calendar_create',
  name: 'Google Calendar Create Event',
  description: 'Create a new event in Google Calendar',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'google-calendar',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Access token for Google Calendar API',
    },
    calendarId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Calendar ID (defaults to primary)',
    },
    summary: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Event title/summary',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Event description',
    },
    location: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Event location',
    },
    startDateTime: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description:
        'Start date and time. MUST include timezone offset (e.g., 2025-06-03T10:00:00-08:00) OR provide timeZone parameter',
    },
    endDateTime: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description:
        'End date and time. MUST include timezone offset (e.g., 2025-06-03T11:00:00-08:00) OR provide timeZone parameter',
    },
    timeZone: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Time zone (e.g., America/Los_Angeles). Required if datetime does not include offset. Defaults to America/Los_Angeles if not provided.',
      default: 'America/Los_Angeles',
    },
    attendees: {
      type: 'array',
      required: false,
      visibility: 'user-or-llm',
      description: 'Array of attendee email addresses',
    },
    sendUpdates: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'How to send updates to attendees: all, externalOnly, or none',
    },
  },

  request: {
    url: (params: GoogleCalendarCreateParams) => {
      const calendarId = params.calendarId || 'primary'
      const queryParams = new URLSearchParams()

      if (params.sendUpdates !== undefined) {
        queryParams.append('sendUpdates', params.sendUpdates)
      }

      const queryString = queryParams.toString()
      const finalUrl = `${CALENDAR_API_BASE}/calendars/${encodeURIComponent(calendarId)}/events${queryString ? `?${queryString}` : ''}`

      return finalUrl
    },
    method: 'POST',
    headers: (params: GoogleCalendarCreateParams) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: (params: GoogleCalendarCreateParams): GoogleCalendarEventRequestBody => {
      // Default timezone if not provided and datetime doesn't include offset
      const timeZone = params.timeZone || 'America/Los_Angeles'
      const needsTimezone =
        !params.startDateTime.includes('+') && !params.startDateTime.includes('-', 10)

      const eventData: GoogleCalendarEventRequestBody = {
        summary: params.summary,
        start: {
          dateTime: params.startDateTime,
          ...(needsTimezone ? { timeZone } : {}),
        },
        end: {
          dateTime: params.endDateTime,
          ...(needsTimezone ? { timeZone } : {}),
        },
      }

      if (params.description) {
        eventData.description = params.description
      }

      if (params.location) {
        eventData.location = params.location
      }

      // Always set timezone if explicitly provided
      if (params.timeZone) {
        eventData.start.timeZone = params.timeZone
        eventData.end.timeZone = params.timeZone
      }

      // Handle both string and array cases for attendees
      let attendeeList: string[] = []
      if (params.attendees) {
        const attendees = params.attendees as string | string[]
        if (Array.isArray(attendees)) {
          attendeeList = attendees.filter((email: string) => email && email.trim().length > 0)
        } else if (typeof attendees === 'string' && attendees.trim().length > 0) {
          // Convert comma-separated string to array
          attendeeList = attendees
            .split(',')
            .map((email: string) => email.trim())
            .filter((email: string) => email.length > 0)
        }
      }

      if (attendeeList.length > 0) {
        eventData.attendees = attendeeList.map((email: string) => ({ email }))
      }

      return eventData
    },
  },

  transformResponse: async (response: Response) => {
    const data: GoogleCalendarApiEventResponse = await response.json()

    return {
      success: true,
      output: {
        content: `Event "${data.summary}" created successfully`,
        metadata: {
          id: data.id,
          htmlLink: data.htmlLink,
          status: data.status,
          summary: data.summary,
          description: data.description,
          location: data.location,
          start: data.start,
          end: data.end,
          attendees: data.attendees,
          creator: data.creator,
          organizer: data.organizer,
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Event creation confirmation message' },
    metadata: {
      type: 'json',
      description: 'Created event metadata including ID, status, and details',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get.ts]---
Location: sim-main/apps/sim/tools/google_calendar/get.ts

```typescript
import {
  CALENDAR_API_BASE,
  type GoogleCalendarApiEventResponse,
  type GoogleCalendarGetParams,
  type GoogleCalendarGetResponse,
} from '@/tools/google_calendar/types'
import type { ToolConfig } from '@/tools/types'

export const getTool: ToolConfig<GoogleCalendarGetParams, GoogleCalendarGetResponse> = {
  id: 'google_calendar_get',
  name: 'Google Calendar Get Event',
  description: 'Get a specific event from Google Calendar',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'google-calendar',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Access token for Google Calendar API',
    },
    calendarId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Calendar ID (defaults to primary)',
    },
    eventId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Event ID to retrieve',
    },
  },

  request: {
    url: (params: GoogleCalendarGetParams) => {
      const calendarId = params.calendarId || 'primary'
      return `${CALENDAR_API_BASE}/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(params.eventId)}`
    },
    method: 'GET',
    headers: (params: GoogleCalendarGetParams) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const data: GoogleCalendarApiEventResponse = await response.json()

    return {
      success: true,
      output: {
        content: `Retrieved event "${data.summary}"`,
        metadata: {
          id: data.id,
          htmlLink: data.htmlLink,
          status: data.status,
          summary: data.summary,
          description: data.description,
          location: data.location,
          start: data.start,
          end: data.end,
          attendees: data.attendees,
          creator: data.creator,
          organizer: data.organizer,
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Event retrieval confirmation message' },
    metadata: {
      type: 'json',
      description: 'Event details including ID, status, times, and attendees',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/google_calendar/index.ts

```typescript
import { createTool } from '@/tools/google_calendar/create'
import { getTool } from '@/tools/google_calendar/get'
import { inviteTool } from '@/tools/google_calendar/invite'
import { listTool } from '@/tools/google_calendar/list'
import { quickAddTool } from '@/tools/google_calendar/quick_add'

export const googleCalendarCreateTool = createTool
export const googleCalendarGetTool = getTool
export const googleCalendarInviteTool = inviteTool
export const googleCalendarListTool = listTool
export const googleCalendarQuickAddTool = quickAddTool
```

--------------------------------------------------------------------------------

````
