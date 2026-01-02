---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 721
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 721 of 933)

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

---[FILE: read_chat.ts]---
Location: sim-main/apps/sim/tools/microsoft_teams/read_chat.ts

```typescript
import type {
  MicrosoftTeamsReadResponse,
  MicrosoftTeamsToolParams,
} from '@/tools/microsoft_teams/types'
import {
  downloadAllReferenceAttachments,
  extractMessageAttachments,
  fetchHostedContentsForChatMessage,
} from '@/tools/microsoft_teams/utils'
import type { ToolConfig } from '@/tools/types'

export const readChatTool: ToolConfig<MicrosoftTeamsToolParams, MicrosoftTeamsReadResponse> = {
  id: 'microsoft_teams_read_chat',
  name: 'Read Microsoft Teams Chat',
  description: 'Read content from a Microsoft Teams chat',
  version: '1.0',
  errorExtractor: 'nested-error-object',

  oauth: {
    required: true,
    provider: 'microsoft-teams',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Microsoft Teams API',
    },
    chatId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the chat to read from',
    },
    includeAttachments: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Download and include message attachments (hosted contents) into storage',
    },
  },

  request: {
    url: (params) => {
      const chatId = params.chatId?.trim()
      if (!chatId) {
        throw new Error('Chat ID is required')
      }
      return `https://graph.microsoft.com/v1.0/chats/${encodeURIComponent(chatId)}/messages?$top=50&$orderby=createdDateTime desc`
    },
    method: 'GET',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
  },

  transformResponse: async (response: Response, params?: MicrosoftTeamsToolParams) => {
    const data = await response.json()

    const messages = data.value || []

    if (messages.length === 0) {
      return {
        success: true,
        output: {
          content: 'No messages found in this chat.',
          metadata: {
            chatId: '',
            messageCount: 0,
            messages: [],
            totalAttachments: 0,
            attachmentTypes: [],
          },
        },
      }
    }

    const processedMessages = await Promise.all(
      messages.map(async (message: any) => {
        const content = message.body?.content || 'No content'
        const messageId = message.id

        const attachments = extractMessageAttachments(message)

        let uploaded: any[] = []
        if (params?.includeAttachments && params.accessToken && params.chatId && messageId) {
          try {
            const hostedContents = await fetchHostedContentsForChatMessage({
              accessToken: params.accessToken,
              chatId: params.chatId,
              messageId,
            })
            uploaded.push(...hostedContents)

            const referenceFiles = await downloadAllReferenceAttachments({
              accessToken: params.accessToken,
              attachments,
            })
            uploaded.push(...referenceFiles)
          } catch (_e) {
            uploaded = []
          }
        }

        return {
          id: messageId,
          content: content, // Keep original content without modification
          sender: message.from?.user?.displayName || 'Unknown',
          timestamp: message.createdDateTime,
          messageType: message.messageType || 'message',
          attachments, // Raw attachment metadata
          uploadedFiles: uploaded, // Uploaded file infos (paths/keys)
        }
      })
    )

    // Format the messages into a readable text (no attachment info in content)
    const formattedMessages = processedMessages
      .map((message: any) => {
        const sender = message.sender
        const timestamp = message.timestamp
          ? new Date(message.timestamp).toLocaleString()
          : 'Unknown time'

        return `[${timestamp}] ${sender}: ${message.content}`
      })
      .join('\n\n')

    // Calculate attachment statistics
    const allAttachments = processedMessages.flatMap((msg: any) => msg.attachments || [])
    const attachmentTypes: string[] = []
    const seenTypes = new Set<string>()

    allAttachments.forEach((att: any) => {
      if (
        att.contentType &&
        typeof att.contentType === 'string' &&
        !seenTypes.has(att.contentType)
      ) {
        attachmentTypes.push(att.contentType)
        seenTypes.add(att.contentType)
      }
    })

    // Create document metadata
    const metadata = {
      chatId: messages[0]?.chatId || params?.chatId || '',
      messageCount: messages.length,
      totalAttachments: allAttachments.length,
      attachmentTypes,
      messages: processedMessages,
    }

    // Flatten uploaded files across all messages for convenience
    const flattenedUploads = processedMessages.flatMap((m: any) => m.uploadedFiles || [])

    return {
      success: true,
      output: {
        content: formattedMessages,
        metadata,
        attachments: flattenedUploads,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Teams chat read operation success status' },
    messageCount: { type: 'number', description: 'Number of messages retrieved from chat' },
    chatId: { type: 'string', description: 'ID of the chat that was read from' },
    messages: { type: 'array', description: 'Array of chat message objects' },
    attachmentCount: { type: 'number', description: 'Total number of attachments found' },
    attachmentTypes: { type: 'array', description: 'Types of attachments found' },
    content: { type: 'string', description: 'Formatted content of chat messages' },
    attachments: {
      type: 'file[]',
      description: 'Uploaded attachments for convenience (flattened)',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: reply_to_message.ts]---
Location: sim-main/apps/sim/tools/microsoft_teams/reply_to_message.ts

```typescript
import type {
  MicrosoftTeamsReplyParams,
  MicrosoftTeamsWriteResponse,
} from '@/tools/microsoft_teams/types'
import type { ToolConfig } from '@/tools/types'

export const replyToMessageTool: ToolConfig<
  MicrosoftTeamsReplyParams,
  MicrosoftTeamsWriteResponse
> = {
  id: 'microsoft_teams_reply_to_message',
  name: 'Reply to Microsoft Teams Channel Message',
  description: 'Reply to an existing message in a Microsoft Teams channel',
  version: '1.0',
  errorExtractor: 'nested-error-object',
  oauth: {
    required: true,
    provider: 'microsoft-teams',
  },
  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Microsoft Teams API',
    },
    teamId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the team',
    },
    channelId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the channel',
    },
    messageId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The ID of the message to reply to',
    },
    content: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The reply content',
    },
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the reply was successful' },
    messageId: { type: 'string', description: 'ID of the reply message' },
    updatedContent: { type: 'boolean', description: 'Whether content was successfully sent' },
  },

  request: {
    url: (params) => {
      const teamId = params.teamId?.trim()
      const channelId = params.channelId?.trim()
      const messageId = params.messageId?.trim()
      if (!teamId || !channelId || !messageId) {
        throw new Error('Team ID, Channel ID, and Message ID are required')
      }
      return `https://graph.microsoft.com/v1.0/teams/${encodeURIComponent(teamId)}/channels/${encodeURIComponent(channelId)}/messages/${encodeURIComponent(messageId)}/replies`
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
    body: (params) => {
      if (!params.content) {
        throw new Error('Content is required')
      }
      return {
        body: {
          contentType: 'text',
          content: params.content,
        },
      }
    },
  },

  transformResponse: async (response: Response, params?: MicrosoftTeamsReplyParams) => {
    const data = await response.json()

    const metadata = {
      messageId: data.id || '',
      teamId: params?.teamId || '',
      channelId: params?.channelId || '',
      content: data.body?.content || params?.content || '',
      createdTime: data.createdDateTime || '',
      url: data.webUrl || '',
    }

    return {
      success: true,
      output: {
        updatedContent: true,
        metadata,
      },
    }
  },
}
```

--------------------------------------------------------------------------------

---[FILE: set_reaction.ts]---
Location: sim-main/apps/sim/tools/microsoft_teams/set_reaction.ts

```typescript
import type {
  MicrosoftTeamsReactionParams,
  MicrosoftTeamsReactionResponse,
} from '@/tools/microsoft_teams/types'
import type { ToolConfig } from '@/tools/types'

export const setReactionTool: ToolConfig<
  MicrosoftTeamsReactionParams,
  MicrosoftTeamsReactionResponse
> = {
  id: 'microsoft_teams_set_reaction',
  name: 'Add Reaction to Microsoft Teams Message',
  description: 'Add an emoji reaction to a message in Microsoft Teams',
  version: '1.0',
  errorExtractor: 'nested-error-object',
  oauth: {
    required: true,
    provider: 'microsoft-teams',
  },
  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Microsoft Teams API',
    },
    teamId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The ID of the team (for channel messages)',
    },
    channelId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The ID of the channel (for channel messages)',
    },
    chatId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The ID of the chat (for chat messages)',
    },
    messageId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The ID of the message to react to',
    },
    reactionType: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The emoji reaction (e.g., ❤️, 👍, 😊)',
    },
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the reaction was added successfully' },
    reactionType: { type: 'string', description: 'The emoji that was added' },
    messageId: { type: 'string', description: 'ID of the message' },
  },

  request: {
    url: (params) => {
      const messageId = params.messageId?.trim()
      if (!messageId) {
        throw new Error('Message ID is required')
      }

      // Check if it's a channel or chat message
      if (params.teamId && params.channelId) {
        const teamId = params.teamId.trim()
        const channelId = params.channelId.trim()
        return `https://graph.microsoft.com/v1.0/teams/${encodeURIComponent(teamId)}/channels/${encodeURIComponent(channelId)}/messages/${encodeURIComponent(messageId)}/setReaction`
      }
      if (params.chatId) {
        const chatId = params.chatId.trim()
        return `https://graph.microsoft.com/v1.0/chats/${encodeURIComponent(chatId)}/messages/${encodeURIComponent(messageId)}/setReaction`
      }

      throw new Error('Either (teamId and channelId) or chatId is required')
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
    body: (params) => {
      if (!params.reactionType) {
        throw new Error('Reaction type is required')
      }
      return {
        reactionType: params.reactionType,
      }
    },
  },

  transformResponse: async (_response: Response, params?: MicrosoftTeamsReactionParams) => {
    // setReaction returns 204 No Content on success
    return {
      success: true,
      output: {
        success: true,
        reactionType: params?.reactionType || '',
        messageId: params?.messageId || '',
        metadata: {
          messageId: params?.messageId || '',
          teamId: params?.teamId,
          channelId: params?.channelId,
          chatId: params?.chatId,
        },
      },
    }
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/microsoft_teams/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface MicrosoftTeamsAttachment {
  id: string
  contentType: string
  contentUrl?: string
  content?: string
  name?: string
  thumbnailUrl?: string
  size?: number
  sourceUrl?: string
  providerType?: string
  item?: any
}

export interface MicrosoftTeamsMetadata {
  messageId?: string
  channelId?: string
  teamId?: string
  chatId?: string
  content?: string
  createdTime?: string
  url?: string
  messageCount?: number
  messages?: Array<{
    id: string
    content: string
    sender: string
    timestamp: string
    messageType: string
    attachments?: MicrosoftTeamsAttachment[]
    uploadedFiles?: {
      path: string
      key: string
      name: string
      size: number
      type: string
    }[]
  }>
  // Global attachments summary
  totalAttachments?: number
  attachmentTypes?: string[]
}

export interface MicrosoftTeamsReadResponse extends ToolResponse {
  output: {
    content: string
    metadata: MicrosoftTeamsMetadata
    attachments?: Array<{
      path: string
      key: string
      name: string
      size: number
      type: string
    }>
  }
}

export interface MicrosoftTeamsWriteResponse extends ToolResponse {
  output: {
    updatedContent: boolean
    metadata: MicrosoftTeamsMetadata
  }
}

export interface MicrosoftTeamsToolParams {
  accessToken: string
  messageId?: string
  chatId?: string
  channelId?: string
  teamId?: string
  content?: string
  includeAttachments?: boolean
  files?: any[] // UserFile array for attachments
  reactionType?: string // For reaction operations
}

// Update message params
export interface MicrosoftTeamsUpdateMessageParams extends MicrosoftTeamsToolParams {
  messageId: string
  content: string
}

// Delete message params
export interface MicrosoftTeamsDeleteMessageParams extends MicrosoftTeamsToolParams {
  messageId: string
}

// Reply to message params
export interface MicrosoftTeamsReplyParams extends MicrosoftTeamsToolParams {
  messageId: string
  content: string
}

// Reaction params
export interface MicrosoftTeamsReactionParams extends MicrosoftTeamsToolParams {
  messageId: string
  reactionType: string
}

// Get message params
export interface MicrosoftTeamsGetMessageParams extends MicrosoftTeamsToolParams {
  messageId: string
}

// Member list response
export interface MicrosoftTeamsMember {
  id: string
  displayName: string
  email?: string
  userId?: string
  roles?: string[]
}

export interface MicrosoftTeamsListMembersResponse extends ToolResponse {
  output: {
    members: MicrosoftTeamsMember[]
    memberCount: number
    metadata: {
      teamId?: string
      channelId?: string
    }
  }
}

// Delete response
export interface MicrosoftTeamsDeleteResponse extends ToolResponse {
  output: {
    deleted: boolean
    messageId: string
    metadata: MicrosoftTeamsMetadata
  }
}

// Reaction response
export interface MicrosoftTeamsReactionResponse extends ToolResponse {
  output: {
    success: boolean
    reactionType: string
    messageId: string
    metadata: MicrosoftTeamsMetadata
  }
}

export type MicrosoftTeamsResponse =
  | MicrosoftTeamsReadResponse
  | MicrosoftTeamsWriteResponse
  | MicrosoftTeamsDeleteResponse
  | MicrosoftTeamsListMembersResponse
  | MicrosoftTeamsReactionResponse
```

--------------------------------------------------------------------------------

---[FILE: unset_reaction.ts]---
Location: sim-main/apps/sim/tools/microsoft_teams/unset_reaction.ts

```typescript
import type {
  MicrosoftTeamsReactionParams,
  MicrosoftTeamsReactionResponse,
} from '@/tools/microsoft_teams/types'
import type { ToolConfig } from '@/tools/types'

export const unsetReactionTool: ToolConfig<
  MicrosoftTeamsReactionParams,
  MicrosoftTeamsReactionResponse
> = {
  id: 'microsoft_teams_unset_reaction',
  name: 'Remove Reaction from Microsoft Teams Message',
  description: 'Remove an emoji reaction from a message in Microsoft Teams',
  version: '1.0',
  errorExtractor: 'nested-error-object',
  oauth: {
    required: true,
    provider: 'microsoft-teams',
  },
  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Microsoft Teams API',
    },
    teamId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The ID of the team (for channel messages)',
    },
    channelId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The ID of the channel (for channel messages)',
    },
    chatId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The ID of the chat (for chat messages)',
    },
    messageId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The ID of the message',
    },
    reactionType: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The emoji reaction to remove (e.g., ❤️, 👍, 😊)',
    },
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the reaction was removed successfully' },
    reactionType: { type: 'string', description: 'The emoji that was removed' },
    messageId: { type: 'string', description: 'ID of the message' },
  },

  request: {
    url: (params) => {
      const messageId = params.messageId?.trim()
      if (!messageId) {
        throw new Error('Message ID is required')
      }

      // Check if it's a channel or chat message
      if (params.teamId && params.channelId) {
        const teamId = params.teamId.trim()
        const channelId = params.channelId.trim()
        return `https://graph.microsoft.com/v1.0/teams/${encodeURIComponent(teamId)}/channels/${encodeURIComponent(channelId)}/messages/${encodeURIComponent(messageId)}/unsetReaction`
      }
      if (params.chatId) {
        const chatId = params.chatId.trim()
        return `https://graph.microsoft.com/v1.0/chats/${encodeURIComponent(chatId)}/messages/${encodeURIComponent(messageId)}/unsetReaction`
      }

      throw new Error('Either (teamId and channelId) or chatId is required')
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
    body: (params) => {
      if (!params.reactionType) {
        throw new Error('Reaction type is required')
      }
      return {
        reactionType: params.reactionType,
      }
    },
  },

  transformResponse: async (_response: Response, params?: MicrosoftTeamsReactionParams) => {
    // unsetReaction returns 204 No Content on success
    return {
      success: true,
      output: {
        success: true,
        reactionType: params?.reactionType || '',
        messageId: params?.messageId || '',
        metadata: {
          messageId: params?.messageId || '',
          teamId: params?.teamId,
          channelId: params?.channelId,
          chatId: params?.chatId,
        },
      },
    }
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_channel_message.ts]---
Location: sim-main/apps/sim/tools/microsoft_teams/update_channel_message.ts

```typescript
import type {
  MicrosoftTeamsUpdateMessageParams,
  MicrosoftTeamsWriteResponse,
} from '@/tools/microsoft_teams/types'
import type { ToolConfig } from '@/tools/types'

export const updateChannelMessageTool: ToolConfig<
  MicrosoftTeamsUpdateMessageParams,
  MicrosoftTeamsWriteResponse
> = {
  id: 'microsoft_teams_update_channel_message',
  name: 'Update Microsoft Teams Channel Message',
  description: 'Update an existing message in a Microsoft Teams channel',
  version: '1.0',
  errorExtractor: 'nested-error-object',
  oauth: {
    required: true,
    provider: 'microsoft-teams',
  },
  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Microsoft Teams API',
    },
    teamId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the team',
    },
    channelId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the channel containing the message',
    },
    messageId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The ID of the message to update',
    },
    content: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The new content for the message',
    },
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the update was successful' },
    messageId: { type: 'string', description: 'ID of the updated message' },
    updatedContent: { type: 'boolean', description: 'Whether content was successfully updated' },
  },

  request: {
    url: (params) => {
      const teamId = params.teamId?.trim()
      const channelId = params.channelId?.trim()
      const messageId = params.messageId?.trim()
      if (!teamId || !channelId || !messageId) {
        throw new Error('Team ID, Channel ID, and Message ID are required')
      }
      return `https://graph.microsoft.com/v1.0/teams/${encodeURIComponent(teamId)}/channels/${encodeURIComponent(channelId)}/messages/${encodeURIComponent(messageId)}`
    },
    method: 'PATCH',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }
      return {
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
      }
    },
    body: (params) => {
      if (!params.content) {
        throw new Error('Content is required')
      }
      return {
        body: {
          contentType: 'text',
          content: params.content,
        },
      }
    },
  },

  transformResponse: async (response: Response, params?: MicrosoftTeamsUpdateMessageParams) => {
    let data: any = {}
    if (response.status !== 204 && response.headers.get('content-length') !== '0') {
      const text = await response.text()
      if (text) {
        data = JSON.parse(text)
      }
    }

    const metadata = {
      messageId: data.id || params?.messageId || '',
      teamId: params?.teamId || '',
      channelId: params?.channelId || '',
      content: data.body?.content || params?.content || '',
      createdTime: data.createdDateTime || '',
      url: data.webUrl || '',
    }

    return {
      success: true,
      output: {
        updatedContent: true,
        metadata,
      },
    }
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_chat_message.ts]---
Location: sim-main/apps/sim/tools/microsoft_teams/update_chat_message.ts

```typescript
import type {
  MicrosoftTeamsUpdateMessageParams,
  MicrosoftTeamsWriteResponse,
} from '@/tools/microsoft_teams/types'
import type { ToolConfig } from '@/tools/types'

export const updateChatMessageTool: ToolConfig<
  MicrosoftTeamsUpdateMessageParams,
  MicrosoftTeamsWriteResponse
> = {
  id: 'microsoft_teams_update_chat_message',
  name: 'Update Microsoft Teams Chat Message',
  description: 'Update an existing message in a Microsoft Teams chat',
  version: '1.0',
  errorExtractor: 'nested-error-object',
  oauth: {
    required: true,
    provider: 'microsoft-teams',
  },
  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Microsoft Teams API',
    },
    chatId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the chat containing the message',
    },
    messageId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The ID of the message to update',
    },
    content: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The new content for the message',
    },
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the update was successful' },
    messageId: { type: 'string', description: 'ID of the updated message' },
    updatedContent: { type: 'boolean', description: 'Whether content was successfully updated' },
  },

  request: {
    url: (params) => {
      const chatId = params.chatId?.trim()
      const messageId = params.messageId?.trim()
      if (!chatId || !messageId) {
        throw new Error('Chat ID and Message ID are required')
      }
      return `https://graph.microsoft.com/v1.0/chats/${encodeURIComponent(chatId)}/messages/${encodeURIComponent(messageId)}`
    },
    method: 'PATCH',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }
      return {
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
      }
    },
    body: (params) => {
      if (!params.content) {
        throw new Error('Content is required')
      }
      return {
        body: {
          contentType: 'text',
          content: params.content,
        },
      }
    },
  },

  transformResponse: async (response: Response, params?: MicrosoftTeamsUpdateMessageParams) => {
    let data: any = {}
    if (response.status !== 204 && response.headers.get('content-length') !== '0') {
      const text = await response.text()
      if (text) {
        data = JSON.parse(text)
      }
    }

    const metadata = {
      messageId: data.id || params?.messageId || '',
      chatId: params?.chatId || '',
      content: data.body?.content || params?.content || '',
      createdTime: data.createdDateTime || '',
      url: data.webUrl || '',
    }

    return {
      success: true,
      output: {
        updatedContent: true,
        metadata,
      },
    }
  },
}
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/tools/microsoft_teams/utils.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { MicrosoftTeamsAttachment } from '@/tools/microsoft_teams/types'
import type { ToolFileData } from '@/tools/types'

const logger = createLogger('MicrosoftTeamsUtils')

interface ParsedMention {
  name: string
  fullTag: string
  mentionId: number
}

interface TeamMember {
  id: string
  displayName: string
  userIdentityType?: string
}

export interface TeamsMention {
  id: number
  mentionText: string
  mentioned:
    | {
        user: {
          id: string
          displayName: string
          userIdentityType?: string
        }
      }
    | {
        application: {
          displayName: string
          id: string
          applicationIdentityType: 'bot'
        }
      }
}

/**
 * Transform raw attachment data from Microsoft Graph API
 */
function transformAttachment(rawAttachment: any): MicrosoftTeamsAttachment {
  return {
    id: rawAttachment.id,
    contentType: rawAttachment.contentType,
    contentUrl: rawAttachment.contentUrl,
    content: rawAttachment.content,
    name: rawAttachment.name,
    thumbnailUrl: rawAttachment.thumbnailUrl,
    size: rawAttachment.size,
    sourceUrl: rawAttachment.sourceUrl,
    providerType: rawAttachment.providerType,
    item: rawAttachment.item,
  }
}

/**
 * Extract attachments from message data
 * Returns all attachments without any content processing
 */
export function extractMessageAttachments(message: any): MicrosoftTeamsAttachment[] {
  const attachments = (message.attachments || []).map(transformAttachment)

  return attachments
}

/**
 * Fetch hostedContents for a chat message, upload each item to storage, and return uploaded file infos.
 * Hosted contents expose base64 contentBytes via Microsoft Graph.
 */
export async function fetchHostedContentsForChatMessage(params: {
  accessToken: string
  chatId: string
  messageId: string
}): Promise<ToolFileData[]> {
  const { accessToken, chatId, messageId } = params
  try {
    const url = `https://graph.microsoft.com/v1.0/chats/${encodeURIComponent(chatId)}/messages/${encodeURIComponent(messageId)}/hostedContents`
    const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } })
    if (!res.ok) {
      return []
    }
    const data = await res.json()
    const items = Array.isArray(data.value) ? data.value : []
    const results: ToolFileData[] = []
    for (const item of items) {
      const base64: string | undefined = item.contentBytes
      if (!base64) continue
      const contentType: string =
        typeof item.contentType === 'string' ? item.contentType : 'application/octet-stream'
      const name: string = item.id ? `teams-hosted-${item.id}` : 'teams-hosted-content'
      results.push({ name, mimeType: contentType, data: base64 })
    }
    return results
  } catch (error) {
    logger.error('Error fetching/uploading hostedContents for chat message:', error)
    return []
  }
}

/**
 * Fetch hostedContents for a channel message, upload each item to storage, and return uploaded file infos.
 */
export async function fetchHostedContentsForChannelMessage(params: {
  accessToken: string
  teamId: string
  channelId: string
  messageId: string
}): Promise<ToolFileData[]> {
  const { accessToken, teamId, channelId, messageId } = params
  try {
    const url = `https://graph.microsoft.com/v1.0/teams/${encodeURIComponent(teamId)}/channels/${encodeURIComponent(channelId)}/messages/${encodeURIComponent(messageId)}/hostedContents`
    const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } })
    if (!res.ok) {
      return []
    }
    const data = await res.json()
    const items = Array.isArray(data.value) ? data.value : []
    const results: ToolFileData[] = []
    for (const item of items) {
      const base64: string | undefined = item.contentBytes
      if (!base64) continue
      const contentType: string =
        typeof item.contentType === 'string' ? item.contentType : 'application/octet-stream'
      const name: string = item.id ? `teams-hosted-${item.id}` : 'teams-hosted-content'
      results.push({ name, mimeType: contentType, data: base64 })
    }
    return results
  } catch (error) {
    logger.error('Error fetching/uploading hostedContents for channel message:', error)
    return []
  }
}

/**
 * Download a reference-type attachment (SharePoint/OneDrive file) from Teams.
 * These are files shared in Teams that are stored in SharePoint/OneDrive.
 *
 */
export async function downloadReferenceAttachment(params: {
  accessToken: string
  attachment: MicrosoftTeamsAttachment
}): Promise<ToolFileData | null> {
  const { accessToken, attachment } = params

  if (attachment.contentType !== 'reference') {
    return null
  }

  const contentUrl = attachment.contentUrl
  if (!contentUrl) {
    logger.warn('Reference attachment has no contentUrl', { attachmentId: attachment.id })
    return null
  }

  try {
    const encodedUrl = Buffer.from(contentUrl)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
    const shareId = `u!${encodedUrl}`

    const metadataUrl = `https://graph.microsoft.com/v1.0/shares/${shareId}/driveItem`
    const metadataRes = await fetch(metadataUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!metadataRes.ok) {
      const errorData = await metadataRes.json().catch(() => ({}))
      logger.error('Failed to get driveItem metadata via shares API', {
        status: metadataRes.status,
        error: errorData,
        attachmentName: attachment.name,
      })
      return null
    }

    const driveItem = await metadataRes.json()
    const mimeType = driveItem.file?.mimeType || 'application/octet-stream'
    const fileName = attachment.name || driveItem.name || 'attachment'

    const downloadUrl = `https://graph.microsoft.com/v1.0/shares/${shareId}/driveItem/content`
    const downloadRes = await fetch(downloadUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!downloadRes.ok) {
      logger.error('Failed to download file content', {
        status: downloadRes.status,
        fileName,
      })
      return null
    }

    const arrayBuffer = await downloadRes.arrayBuffer()
    const base64Data = Buffer.from(arrayBuffer).toString('base64')

    logger.info('Successfully downloaded reference attachment', {
      fileName,
      size: arrayBuffer.byteLength,
    })

    return {
      name: fileName,
      mimeType,
      data: base64Data,
    }
  } catch (error) {
    logger.error('Error downloading reference attachment:', {
      error,
      attachmentId: attachment.id,
      attachmentName: attachment.name,
    })
    return null
  }
}

export async function downloadAllReferenceAttachments(params: {
  accessToken: string
  attachments: MicrosoftTeamsAttachment[]
}): Promise<ToolFileData[]> {
  const { accessToken, attachments } = params
  const results: ToolFileData[] = []

  const referenceAttachments = attachments.filter((att) => att.contentType === 'reference')

  if (referenceAttachments.length === 0) {
    return results
  }

  logger.info(`Downloading ${referenceAttachments.length} reference attachment(s)`)

  for (const attachment of referenceAttachments) {
    const file = await downloadReferenceAttachment({ accessToken, attachment })
    if (file) {
      results.push(file)
    }
  }

  return results
}

function parseMentions(content: string): ParsedMention[] {
  const mentions: ParsedMention[] = []
  const mentionRegex = /<at>([^<]+)<\/at>/gi
  let match: RegExpExecArray | null
  let mentionId = 0

  while ((match = mentionRegex.exec(content)) !== null) {
    const name = match[1].trim()
    if (name) {
      mentions.push({
        name,
        fullTag: match[0],
        mentionId: mentionId++,
      })
    }
  }

  return mentions
}

async function fetchChatMembers(chatId: string, accessToken: string): Promise<TeamMember[]> {
  const response = await fetch(
    `https://graph.microsoft.com/v1.0/chats/${encodeURIComponent(chatId)}/members`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    return []
  }

  const data = await response.json()
  return (data.value || []).map((member: TeamMember) => ({
    id: member.id,
    displayName: member.displayName || '',
    userIdentityType: member.userIdentityType,
  }))
}

async function fetchChannelMembers(
  teamId: string,
  channelId: string,
  accessToken: string
): Promise<TeamMember[]> {
  const response = await fetch(
    `https://graph.microsoft.com/v1.0/teams/${encodeURIComponent(teamId)}/channels/${encodeURIComponent(channelId)}/members`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    return []
  }

  const data = await response.json()
  return (data.value || []).map((member: TeamMember) => ({
    id: member.id,
    displayName: member.displayName || '',
    userIdentityType: member.userIdentityType,
  }))
}

function findMemberByName(members: TeamMember[], name: string): TeamMember | undefined {
  const normalizedName = name.trim().toLowerCase()
  return members.find((member) => member.displayName.toLowerCase() === normalizedName)
}

export async function resolveMentionsForChat(
  content: string,
  chatId: string,
  accessToken: string
): Promise<{ mentions: TeamsMention[]; hasMentions: boolean; updatedContent: string }> {
  const parsedMentions = parseMentions(content)

  if (parsedMentions.length === 0) {
    return { mentions: [], hasMentions: false, updatedContent: content }
  }

  const members = await fetchChatMembers(chatId, accessToken)
  const mentions: TeamsMention[] = []
  const resolvedTags = new Set<string>()
  let updatedContent = content

  for (const mention of parsedMentions) {
    if (resolvedTags.has(mention.fullTag)) {
      continue
    }

    const member = findMemberByName(members, mention.name)

    if (member) {
      const isBot = member.userIdentityType === 'bot'

      if (isBot) {
        mentions.push({
          id: mention.mentionId,
          mentionText: mention.name,
          mentioned: {
            application: {
              displayName: member.displayName,
              id: member.id,
              applicationIdentityType: 'bot',
            },
          },
        })
      } else {
        mentions.push({
          id: mention.mentionId,
          mentionText: mention.name,
          mentioned: {
            user: {
              id: member.id,
              displayName: member.displayName,
              userIdentityType: member.userIdentityType || 'aadUser',
            },
          },
        })
      }
      resolvedTags.add(mention.fullTag)
      updatedContent = updatedContent.replace(
        mention.fullTag,
        `<at id="${mention.mentionId}">${mention.name}</at>`
      )
    }
  }

  return {
    mentions,
    hasMentions: mentions.length > 0,
    updatedContent,
  }
}

export async function resolveMentionsForChannel(
  content: string,
  teamId: string,
  channelId: string,
  accessToken: string
): Promise<{ mentions: TeamsMention[]; hasMentions: boolean; updatedContent: string }> {
  const parsedMentions = parseMentions(content)

  if (parsedMentions.length === 0) {
    return { mentions: [], hasMentions: false, updatedContent: content }
  }

  const members = await fetchChannelMembers(teamId, channelId, accessToken)
  const mentions: TeamsMention[] = []
  const resolvedTags = new Set<string>()
  let updatedContent = content

  for (const mention of parsedMentions) {
    if (resolvedTags.has(mention.fullTag)) {
      continue
    }

    const member = findMemberByName(members, mention.name)

    if (member) {
      const isBot = member.userIdentityType === 'bot'

      if (isBot) {
        mentions.push({
          id: mention.mentionId,
          mentionText: mention.name,
          mentioned: {
            application: {
              displayName: member.displayName,
              id: member.id,
              applicationIdentityType: 'bot',
            },
          },
        })
      } else {
        mentions.push({
          id: mention.mentionId,
          mentionText: mention.name,
          mentioned: {
            user: {
              id: member.id,
              displayName: member.displayName,
              userIdentityType: member.userIdentityType || 'aadUser',
            },
          },
        })
      }
      resolvedTags.add(mention.fullTag)
      updatedContent = updatedContent.replace(
        mention.fullTag,
        `<at id="${mention.mentionId}">${mention.name}</at>`
      )
    }
  }

  return {
    mentions,
    hasMentions: mentions.length > 0,
    updatedContent,
  }
}
```

--------------------------------------------------------------------------------

````
