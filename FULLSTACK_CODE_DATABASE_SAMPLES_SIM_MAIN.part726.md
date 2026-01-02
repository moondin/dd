---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 726
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 726 of 933)

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

---[FILE: copy.ts]---
Location: sim-main/apps/sim/tools/outlook/copy.ts

```typescript
import type { OutlookCopyParams, OutlookCopyResponse } from '@/tools/outlook/types'
import type { ToolConfig } from '@/tools/types'

export const outlookCopyTool: ToolConfig<OutlookCopyParams, OutlookCopyResponse> = {
  id: 'outlook_copy',
  name: 'Outlook Copy',
  description: 'Copy an Outlook message to another folder',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'outlook',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Access token for Outlook API',
    },
    messageId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'ID of the message to copy',
    },
    destinationId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'ID of the destination folder',
    },
  },

  request: {
    url: '/api/tools/outlook/copy',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params: OutlookCopyParams) => ({
      accessToken: params.accessToken,
      messageId: params.messageId,
      destinationId: params.destinationId,
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()
    if (!data.success) {
      throw new Error(data.error || 'Failed to copy Outlook email')
    }
    return {
      success: true,
      output: {
        message: data.output.message,
        results: {
          originalMessageId: data.output.originalMessageId,
          copiedMessageId: data.output.copiedMessageId,
          destinationFolderId: data.output.destinationFolderId,
        },
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Email copy success status' },
    message: { type: 'string', description: 'Success or error message' },
    originalMessageId: { type: 'string', description: 'ID of the original message' },
    copiedMessageId: { type: 'string', description: 'ID of the copied message' },
    destinationFolderId: { type: 'string', description: 'ID of the destination folder' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete.ts]---
Location: sim-main/apps/sim/tools/outlook/delete.ts

```typescript
import type { OutlookDeleteParams, OutlookDeleteResponse } from '@/tools/outlook/types'
import type { ToolConfig } from '@/tools/types'

export const outlookDeleteTool: ToolConfig<OutlookDeleteParams, OutlookDeleteResponse> = {
  id: 'outlook_delete',
  name: 'Outlook Delete',
  description: 'Delete an Outlook message (move to Deleted Items)',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'outlook',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Access token for Outlook API',
    },
    messageId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'ID of the message to delete',
    },
  },

  request: {
    url: '/api/tools/outlook/delete',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params: OutlookDeleteParams) => ({
      accessToken: params.accessToken,
      messageId: params.messageId,
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()
    if (!data.success) {
      throw new Error(data.error || 'Failed to delete Outlook email')
    }
    return {
      success: true,
      output: {
        message: data.output.message,
        results: {
          messageId: data.output.messageId,
          status: data.output.status,
        },
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    message: { type: 'string', description: 'Success or error message' },
    messageId: { type: 'string', description: 'ID of the deleted message' },
    status: { type: 'string', description: 'Deletion status' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: draft.ts]---
Location: sim-main/apps/sim/tools/outlook/draft.ts

```typescript
import type { OutlookDraftParams, OutlookDraftResponse } from '@/tools/outlook/types'
import type { ToolConfig } from '@/tools/types'

export const outlookDraftTool: ToolConfig<OutlookDraftParams, OutlookDraftResponse> = {
  id: 'outlook_draft',
  name: 'Outlook Draft',
  description: 'Draft emails using Outlook',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'outlook',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Access token for Outlook API',
    },
    to: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Recipient email address',
    },
    subject: {
      type: 'string',
      required: true,
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
      description: 'Files to attach to the email draft',
    },
  },

  request: {
    url: '/api/tools/outlook/draft',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params: OutlookDraftParams) => {
      return {
        accessToken: params.accessToken,
        to: params.to,
        subject: params.subject,
        body: params.body,
        contentType: params.contentType || 'text',
        cc: params.cc || null,
        bcc: params.bcc || null,
        attachments: params.attachments || null,
      }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()
    if (!data.success) {
      throw new Error(data.error || 'Failed to create Outlook draft')
    }
    return {
      success: true,
      output: {
        message: data.output.message,
        results: {
          id: data.output.messageId,
          subject: data.output.subject,
          status: 'drafted',
          timestamp: new Date().toISOString(),
          attachmentCount: data.output.attachmentCount || 0,
        },
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Email draft creation success status' },
    messageId: { type: 'string', description: 'Unique identifier for the drafted email' },
    status: { type: 'string', description: 'Draft status of the email' },
    subject: { type: 'string', description: 'Subject of the drafted email' },
    timestamp: { type: 'string', description: 'Timestamp when draft was created' },
    message: { type: 'string', description: 'Success or error message' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: forward.ts]---
Location: sim-main/apps/sim/tools/outlook/forward.ts

```typescript
import type { OutlookForwardParams, OutlookForwardResponse } from '@/tools/outlook/types'
import type { ToolConfig } from '@/tools/types'

export const outlookForwardTool: ToolConfig<OutlookForwardParams, OutlookForwardResponse> = {
  id: 'outlook_forward',
  name: 'Outlook Forward',
  description: 'Forward an existing Outlook message to specified recipients',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'outlook',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token for Outlook',
    },
    messageId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The ID of the message to forward',
    },
    to: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Recipient email address(es), comma-separated',
    },
    comment: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Optional comment to include with the forwarded message',
    },
  },

  request: {
    url: (params) => {
      return `https://graph.microsoft.com/v1.0/me/messages/${params.messageId}/forward`
    },
    method: 'POST',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }
      return {
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
      }
    },
    body: (params: OutlookForwardParams): Record<string, any> => {
      const parseEmails = (emailString?: string) => {
        if (!emailString) return []
        return emailString
          .split(',')
          .map((email) => email.trim())
          .filter((email) => email.length > 0)
          .map((email) => ({ emailAddress: { address: email } }))
      }

      const toRecipients = parseEmails(params.to)
      if (toRecipients.length === 0) {
        throw new Error('At least one recipient is required to forward a message')
      }

      return {
        comment: params.comment ?? '',
        toRecipients,
      }
    },
  },

  transformResponse: async (response: Response) => {
    const status = response.status
    const requestId =
      response.headers?.get('request-id') || response.headers?.get('x-ms-request-id') || undefined

    // Graph forward action typically returns 202/204 with no body. Try to read text safely.
    let bodyText = ''
    try {
      bodyText = await response.text()
    } catch (_) {
      // ignore body read errors
    }

    // Attempt to parse JSON if present (rare for this endpoint). Extract message identifiers if available.
    let parsed: any | undefined
    if (bodyText && bodyText.trim().length > 0) {
      try {
        parsed = JSON.parse(bodyText)
      } catch (_) {
        // non-JSON body; ignore
      }
    }

    const messageId = parsed?.id || parsed?.messageId || parsed?.internetMessageId
    const internetMessageId = parsed?.internetMessageId

    return {
      success: true,
      output: {
        message:
          status === 202 || status === 204
            ? 'Email forwarded successfully'
            : `Email forwarded (HTTP ${status})`,
        results: {
          status: 'forwarded',
          timestamp: new Date().toISOString(),
          httpStatus: status,
          requestId,
          ...(messageId ? { messageId } : {}),
          ...(internetMessageId ? { internetMessageId } : {}),
        },
      },
    }
  },

  outputs: {
    message: { type: 'string', description: 'Success or error message' },
    results: {
      type: 'object',
      description: 'Delivery result details',
      properties: {
        status: { type: 'string', description: 'Delivery status of the email' },
        timestamp: { type: 'string', description: 'Timestamp when email was forwarded' },
        httpStatus: {
          type: 'number',
          description: 'HTTP status code returned by the API',
          optional: true,
        },
        requestId: {
          type: 'string',
          description: 'Microsoft Graph request-id header for tracing',
          optional: true,
        },
        messageId: {
          type: 'string',
          description: 'Forwarded message ID if provided by API',
          optional: true,
        },
        internetMessageId: {
          type: 'string',
          description: 'RFC 822 Message-ID if provided',
          optional: true,
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/outlook/index.ts

```typescript
import { outlookCopyTool } from '@/tools/outlook/copy'
import { outlookDeleteTool } from '@/tools/outlook/delete'
import { outlookDraftTool } from '@/tools/outlook/draft'
import { outlookForwardTool } from '@/tools/outlook/forward'
import { outlookMarkReadTool } from '@/tools/outlook/mark_read'
import { outlookMarkUnreadTool } from '@/tools/outlook/mark_unread'
import { outlookMoveTool } from '@/tools/outlook/move'
import { outlookReadTool } from '@/tools/outlook/read'
import { outlookSendTool } from '@/tools/outlook/send'

export {
  outlookDraftTool,
  outlookForwardTool,
  outlookMoveTool,
  outlookReadTool,
  outlookSendTool,
  outlookMarkReadTool,
  outlookMarkUnreadTool,
  outlookDeleteTool,
  outlookCopyTool,
}
```

--------------------------------------------------------------------------------

---[FILE: mark_read.ts]---
Location: sim-main/apps/sim/tools/outlook/mark_read.ts

```typescript
import type { OutlookMarkReadParams, OutlookMarkReadResponse } from '@/tools/outlook/types'
import type { ToolConfig } from '@/tools/types'

export const outlookMarkReadTool: ToolConfig<OutlookMarkReadParams, OutlookMarkReadResponse> = {
  id: 'outlook_mark_read',
  name: 'Outlook Mark as Read',
  description: 'Mark an Outlook message as read',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'outlook',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Access token for Outlook API',
    },
    messageId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'ID of the message to mark as read',
    },
  },

  request: {
    url: '/api/tools/outlook/mark-read',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params: OutlookMarkReadParams) => ({
      accessToken: params.accessToken,
      messageId: params.messageId,
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()
    if (!data.success) {
      throw new Error(data.error || 'Failed to mark Outlook email as read')
    }
    return {
      success: true,
      output: {
        message: data.output.message,
        results: {
          messageId: data.output.messageId,
          isRead: data.output.isRead,
        },
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    message: { type: 'string', description: 'Success or error message' },
    messageId: { type: 'string', description: 'ID of the message' },
    isRead: { type: 'boolean', description: 'Read status of the message' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: mark_unread.ts]---
Location: sim-main/apps/sim/tools/outlook/mark_unread.ts

```typescript
import type { OutlookMarkReadParams, OutlookMarkReadResponse } from '@/tools/outlook/types'
import type { ToolConfig } from '@/tools/types'

export const outlookMarkUnreadTool: ToolConfig<OutlookMarkReadParams, OutlookMarkReadResponse> = {
  id: 'outlook_mark_unread',
  name: 'Outlook Mark as Unread',
  description: 'Mark an Outlook message as unread',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'outlook',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Access token for Outlook API',
    },
    messageId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'ID of the message to mark as unread',
    },
  },

  request: {
    url: '/api/tools/outlook/mark-unread',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params: OutlookMarkReadParams) => ({
      accessToken: params.accessToken,
      messageId: params.messageId,
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()
    if (!data.success) {
      throw new Error(data.error || 'Failed to mark Outlook email as unread')
    }
    return {
      success: true,
      output: {
        message: data.output.message,
        results: {
          messageId: data.output.messageId,
          isRead: data.output.isRead,
        },
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    message: { type: 'string', description: 'Success or error message' },
    messageId: { type: 'string', description: 'ID of the message' },
    isRead: { type: 'boolean', description: 'Read status of the message' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: move.ts]---
Location: sim-main/apps/sim/tools/outlook/move.ts

```typescript
import type { OutlookMoveParams, OutlookMoveResponse } from '@/tools/outlook/types'
import type { ToolConfig } from '@/tools/types'

export const outlookMoveTool: ToolConfig<OutlookMoveParams, OutlookMoveResponse> = {
  id: 'outlook_move',
  name: 'Outlook Move',
  description: 'Move emails between Outlook folders',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'outlook',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Access token for Outlook API',
    },
    messageId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'ID of the message to move',
    },
    destinationId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'ID of the destination folder',
    },
  },

  request: {
    url: '/api/tools/outlook/move',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params: OutlookMoveParams) => ({
      accessToken: params.accessToken,
      messageId: params.messageId,
      destinationId: params.destinationId,
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()
    if (!data.success) {
      throw new Error(data.error || 'Failed to move Outlook email')
    }
    return {
      success: true,
      output: {
        message: data.output.message,
        results: {
          messageId: data.output.messageId,
          newFolderId: data.output.newFolderId,
        },
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Email move success status' },
    message: { type: 'string', description: 'Success or error message' },
    messageId: { type: 'string', description: 'ID of the moved message' },
    newFolderId: { type: 'string', description: 'ID of the destination folder' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: read.ts]---
Location: sim-main/apps/sim/tools/outlook/read.ts

```typescript
import type {
  CleanedOutlookMessage,
  OutlookAttachment,
  OutlookMessage,
  OutlookMessagesResponse,
  OutlookReadParams,
  OutlookReadResponse,
} from '@/tools/outlook/types'
import type { ToolConfig } from '@/tools/types'

/**
 * Download attachments from an Outlook message
 */
async function downloadAttachments(
  messageId: string,
  accessToken: string
): Promise<OutlookAttachment[]> {
  const attachments: OutlookAttachment[] = []

  try {
    // Fetch attachments list from Microsoft Graph API
    const response = await fetch(
      `https://graph.microsoft.com/v1.0/me/messages/${messageId}/attachments`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      return attachments
    }

    const data = await response.json()
    const attachmentsList = data.value || []

    for (const attachment of attachmentsList) {
      try {
        // Microsoft Graph returns attachment data directly in the list response for file attachments
        if (attachment['@odata.type'] === '#microsoft.graph.fileAttachment') {
          const contentBytes = attachment.contentBytes
          if (contentBytes) {
            // contentBytes is base64 encoded
            const buffer = Buffer.from(contentBytes, 'base64')
            attachments.push({
              name: attachment.name,
              data: buffer,
              contentType: attachment.contentType,
              size: attachment.size,
            })
          }
        }
      } catch (error) {
        // Continue with other attachments
      }
    }
  } catch (error) {
    // Return empty array on error
  }

  return attachments
}

export const outlookReadTool: ToolConfig<OutlookReadParams, OutlookReadResponse> = {
  id: 'outlook_read',
  name: 'Outlook Read',
  description: 'Read emails from Outlook',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'outlook',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token for Outlook',
    },
    folder: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Folder ID to read emails from (default: Inbox)',
    },
    maxResults: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Maximum number of emails to retrieve (default: 1, max: 10)',
    },
    includeAttachments: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Download and include email attachments',
    },
  },

  request: {
    url: (params) => {
      // Set max results (default to 1 for simplicity, max 10) with no negative values
      const maxResults = params.maxResults
        ? Math.max(1, Math.min(Math.abs(Number(params.maxResults)), 10))
        : 1

      // If folder is provided, read from that specific folder
      if (params.folder) {
        return `https://graph.microsoft.com/v1.0/me/mailFolders/${params.folder}/messages?$top=${maxResults}&$orderby=createdDateTime desc`
      }

      // Otherwise fetch from all messages (default behavior)
      return `https://graph.microsoft.com/v1.0/me/messages?$top=${maxResults}&$orderby=createdDateTime desc`
    },
    method: 'GET',
    headers: (params) => {
      // Validate access token
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
  },

  transformResponse: async (response: Response, params?: OutlookReadParams) => {
    const data: OutlookMessagesResponse = await response.json()

    // Microsoft Graph API returns messages in a 'value' array
    const messages = data.value || []

    if (messages.length === 0) {
      return {
        success: true,
        output: {
          message: 'No mail found.',
          results: [],
        },
      }
    }

    // Clean up the message data to only include essential fields
    const cleanedMessages: CleanedOutlookMessage[] = await Promise.all(
      messages.map(async (message: OutlookMessage) => {
        // Download attachments if requested
        let attachments: OutlookAttachment[] | undefined
        if (params?.includeAttachments && message.hasAttachments && params?.accessToken) {
          try {
            attachments = await downloadAttachments(message.id, params.accessToken)
          } catch (error) {
            // Continue without attachments rather than failing the entire request
          }
        }

        return {
          id: message.id,
          subject: message.subject,
          bodyPreview: message.bodyPreview,
          body: {
            contentType: message.body?.contentType,
            content: message.body?.content,
          },
          sender: {
            name: message.sender?.emailAddress?.name,
            address: message.sender?.emailAddress?.address,
          },
          from: {
            name: message.from?.emailAddress?.name,
            address: message.from?.emailAddress?.address,
          },
          toRecipients:
            message.toRecipients?.map((recipient) => ({
              name: recipient.emailAddress?.name,
              address: recipient.emailAddress?.address,
            })) || [],
          ccRecipients:
            message.ccRecipients?.map((recipient) => ({
              name: recipient.emailAddress?.name,
              address: recipient.emailAddress?.address,
            })) || [],
          receivedDateTime: message.receivedDateTime,
          sentDateTime: message.sentDateTime,
          hasAttachments: message.hasAttachments,
          attachments: attachments || [],
          isRead: message.isRead,
          importance: message.importance,
        }
      })
    )

    // Flatten all attachments from all emails to top level for FileToolProcessor
    const allAttachments: OutlookAttachment[] = []
    for (const email of cleanedMessages) {
      if (email.attachments && email.attachments.length > 0) {
        allAttachments.push(...email.attachments)
      }
    }

    return {
      success: true,
      output: {
        message: `Successfully read ${cleanedMessages.length} email(s).`,
        results: cleanedMessages,
        attachments: allAttachments,
      },
    }
  },

  outputs: {
    message: { type: 'string', description: 'Success or status message' },
    results: { type: 'array', description: 'Array of email message objects' },
    attachments: { type: 'file[]', description: 'All email attachments flattened from all emails' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: send.ts]---
Location: sim-main/apps/sim/tools/outlook/send.ts

```typescript
import type { OutlookSendParams, OutlookSendResponse } from '@/tools/outlook/types'
import type { ToolConfig } from '@/tools/types'

export const outlookSendTool: ToolConfig<OutlookSendParams, OutlookSendResponse> = {
  id: 'outlook_send',
  name: 'Outlook Send',
  description: 'Send emails using Outlook',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'outlook',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Access token for Outlook API',
    },
    to: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Recipient email address',
    },
    subject: {
      type: 'string',
      required: true,
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
    replyToMessageId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Message ID to reply to (for threading)',
    },
    conversationId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Conversation ID for threading',
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
    url: '/api/tools/outlook/send',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params: OutlookSendParams) => {
      return {
        accessToken: params.accessToken,
        to: params.to,
        subject: params.subject,
        body: params.body,
        contentType: params.contentType || 'text',
        cc: params.cc || null,
        bcc: params.bcc || null,
        replyToMessageId: params.replyToMessageId || null,
        conversationId: params.conversationId || null,
        attachments: params.attachments || null,
      }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()
    if (!data.success) {
      throw new Error(data.error || 'Failed to send Outlook email')
    }
    return {
      success: true,
      output: {
        message: data.output.message,
        results: {
          status: data.output.status,
          timestamp: data.output.timestamp,
          attachmentCount: data.output.attachmentCount || 0,
        },
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Email send success status' },
    status: { type: 'string', description: 'Delivery status of the email' },
    timestamp: { type: 'string', description: 'Timestamp when email was sent' },
    message: { type: 'string', description: 'Success or error message' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/outlook/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface OutlookSendParams {
  accessToken: string
  to: string
  subject: string
  body: string
  contentType?: 'text' | 'html'
  // Thread support parameters
  replyToMessageId?: string
  conversationId?: string
  cc?: string
  bcc?: string
  attachments?: any[]
}

export interface OutlookSendResponse extends ToolResponse {
  output: {
    message: string
    results: any
  }
}

export interface OutlookReadParams {
  accessToken: string
  folder: string
  maxResults: number
  messageId?: string
  includeAttachments?: boolean
}

export interface OutlookReadResponse extends ToolResponse {
  output: {
    message: string
    results: CleanedOutlookMessage[]
  }
}

export interface OutlookDraftParams {
  accessToken: string
  to: string
  cc?: string
  bcc?: string
  subject: string
  body: string
  contentType?: 'text' | 'html'
  attachments?: any[]
}

export interface OutlookDraftResponse extends ToolResponse {
  output: {
    message: string
    results: any
  }
}

// Outlook API response interfaces
export interface OutlookEmailAddress {
  name?: string
  address: string
}

export interface OutlookRecipient {
  emailAddress: OutlookEmailAddress
}

export interface OutlookMessageBody {
  contentType?: string
  content?: string
}

export interface OutlookMessage {
  id: string
  subject?: string
  bodyPreview?: string
  body?: OutlookMessageBody
  sender?: OutlookRecipient
  from?: OutlookRecipient
  toRecipients?: OutlookRecipient[]
  ccRecipients?: OutlookRecipient[]
  bccRecipients?: OutlookRecipient[]
  receivedDateTime?: string
  sentDateTime?: string
  hasAttachments?: boolean
  isRead?: boolean
  importance?: string
  // Add other common fields
  '@odata.etag'?: string
  createdDateTime?: string
  lastModifiedDateTime?: string
  changeKey?: string
  categories?: string[]
  internetMessageId?: string
  parentFolderId?: string
  conversationId?: string
  conversationIndex?: string
  isDeliveryReceiptRequested?: boolean | null
  isReadReceiptRequested?: boolean
  isDraft?: boolean
  webLink?: string
  inferenceClassification?: string
  replyTo?: OutlookRecipient[]
}

export interface OutlookMessagesResponse {
  '@odata.context'?: string
  '@odata.nextLink'?: string
  value: OutlookMessage[]
}

// Outlook attachment interface (for tool responses)
export interface OutlookAttachment {
  name: string
  data: Buffer
  contentType: string
  size: number
}

// Cleaned message interface for our response
export interface CleanedOutlookMessage {
  id: string
  subject?: string
  bodyPreview?: string
  body?: {
    contentType?: string
    content?: string
  }
  sender?: {
    name?: string
    address?: string
  }
  from?: {
    name?: string
    address?: string
  }
  toRecipients: Array<{
    name?: string
    address?: string
  }>
  ccRecipients: Array<{
    name?: string
    address?: string
  }>
  receivedDateTime?: string
  sentDateTime?: string
  hasAttachments?: boolean
  attachments?: OutlookAttachment[] | any[]
  isRead?: boolean
  importance?: string
}

export type OutlookResponse = OutlookReadResponse | OutlookSendResponse | OutlookDraftResponse

export interface OutlookForwardParams {
  accessToken: string
  messageId: string
  to: string
  comment?: string
}

export interface OutlookForwardResponse extends ToolResponse {
  output: {
    message: string
    results: any
  }
}

export interface OutlookMoveParams {
  accessToken: string
  messageId: string
  destinationId: string
}

export interface OutlookMoveResponse extends ToolResponse {
  output: {
    message: string
    results: {
      messageId: string
      newFolderId: string
    }
  }
}

export interface OutlookMarkReadParams {
  accessToken: string
  messageId: string
}

export interface OutlookMarkReadResponse extends ToolResponse {
  output: {
    message: string
    results: {
      messageId: string
      isRead: boolean
    }
  }
}

export interface OutlookDeleteParams {
  accessToken: string
  messageId: string
}

export interface OutlookDeleteResponse extends ToolResponse {
  output: {
    message: string
    results: {
      messageId: string
      status: string
    }
  }
}

export interface OutlookCopyParams {
  accessToken: string
  messageId: string
  destinationId: string
}

export interface OutlookCopyResponse extends ToolResponse {
  output: {
    message: string
    results: {
      originalMessageId: string
      copiedMessageId: string
      destinationFolderId: string
    }
  }
}

export type OutlookExtendedResponse =
  | OutlookResponse
  | OutlookForwardResponse
  | OutlookMoveResponse
  | OutlookMarkReadResponse
  | OutlookDeleteResponse
  | OutlookCopyResponse
```

--------------------------------------------------------------------------------

````
