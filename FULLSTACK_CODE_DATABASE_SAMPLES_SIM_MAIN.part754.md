---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 754
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 754 of 933)

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

---[FILE: message.ts]---
Location: sim-main/apps/sim/tools/slack/message.ts

```typescript
import type { SlackMessageParams, SlackMessageResponse } from '@/tools/slack/types'
import type { ToolConfig } from '@/tools/types'

export const slackMessageTool: ToolConfig<SlackMessageParams, SlackMessageResponse> = {
  id: 'slack_message',
  name: 'Slack Message',
  description:
    'Send messages to Slack channels or direct messages. Supports Slack mrkdwn formatting.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'slack',
  },

  params: {
    authMethod: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Authentication method: oauth or bot_token',
    },
    botToken: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Bot token for Custom Bot',
    },
    accessToken: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description: 'OAuth access token or bot token for Slack API',
    },
    channel: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Target Slack channel (e.g., #general)',
    },
    userId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Target Slack user ID for direct messages (e.g., U1234567890)',
    },
    text: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Message text to send (supports Slack mrkdwn formatting)',
    },
    thread_ts: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Thread timestamp to reply to (creates thread reply)',
    },
    files: {
      type: 'file[]',
      required: false,
      visibility: 'user-only',
      description: 'Files to attach to the message',
    },
  },

  request: {
    url: '/api/tools/slack/send-message',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params: SlackMessageParams) => {
      return {
        accessToken: params.accessToken || params.botToken,
        channel: params.channel,
        userId: params.userId,
        text: params.text,
        thread_ts: params.thread_ts || undefined,
        files: params.files || null,
      }
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()
    if (!data.success) {
      throw new Error(data.error || 'Failed to send Slack message')
    }
    return {
      success: true,
      output: data.output,
    }
  },

  outputs: {
    message: {
      type: 'object',
      description: 'Complete message object with all properties returned by Slack',
    },
    // Legacy properties for backward compatibility
    ts: { type: 'string', description: 'Message timestamp' },
    channel: { type: 'string', description: 'Channel ID where message was sent' },
    fileCount: {
      type: 'number',
      description: 'Number of files uploaded (when files are attached)',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: message_reader.ts]---
Location: sim-main/apps/sim/tools/slack/message_reader.ts

```typescript
import type { SlackMessageReaderParams, SlackMessageReaderResponse } from '@/tools/slack/types'
import type { ToolConfig } from '@/tools/types'

export const slackMessageReaderTool: ToolConfig<
  SlackMessageReaderParams,
  SlackMessageReaderResponse
> = {
  id: 'slack_message_reader',
  name: 'Slack Message Reader',
  description:
    'Read the latest messages from Slack channels. Retrieve conversation history with filtering options.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'slack',
  },

  params: {
    authMethod: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Authentication method: oauth or bot_token',
    },
    botToken: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Bot token for Custom Bot',
    },
    accessToken: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description: 'OAuth access token or bot token for Slack API',
    },
    channel: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Slack channel to read messages from (e.g., #general)',
    },
    userId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'User ID for DM conversation (e.g., U1234567890)',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Number of messages to retrieve (default: 10, max: 100)',
    },
    oldest: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Start of time range (timestamp)',
    },
    latest: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'End of time range (timestamp)',
    },
  },

  request: {
    url: '/api/tools/slack/read-messages',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params: SlackMessageReaderParams) => ({
      accessToken: params.accessToken || params.botToken,
      channel: params.channel,
      userId: params.userId,
      limit: params.limit,
      oldest: params.oldest,
      latest: params.latest,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch messages from Slack')
    }

    return {
      success: true,
      output: data.output,
    }
  },

  outputs: {
    messages: {
      type: 'array',
      description: 'Array of message objects from the channel',
      items: {
        type: 'object',
        properties: {
          // Core properties
          type: { type: 'string', description: 'Message type' },
          ts: { type: 'string', description: 'Message timestamp' },
          text: { type: 'string', description: 'Message text content' },
          user: { type: 'string', description: 'User ID who sent the message' },
          bot_id: { type: 'string', description: 'Bot ID if sent by a bot' },
          username: { type: 'string', description: 'Display username' },
          channel: { type: 'string', description: 'Channel ID' },
          team: { type: 'string', description: 'Team ID' },

          // Thread properties
          thread_ts: { type: 'string', description: 'Thread parent message timestamp' },
          parent_user_id: { type: 'string', description: 'User ID of thread parent' },
          reply_count: { type: 'number', description: 'Number of thread replies' },
          reply_users_count: { type: 'number', description: 'Number of users who replied' },
          latest_reply: { type: 'string', description: 'Timestamp of latest reply' },
          subscribed: { type: 'boolean', description: 'Whether user is subscribed to thread' },
          last_read: { type: 'string', description: 'Last read timestamp' },
          unread_count: { type: 'number', description: 'Number of unread messages' },

          // Message subtype
          subtype: { type: 'string', description: 'Message subtype' },

          // Reactions and interactions
          reactions: {
            type: 'array',
            description: 'Array of reactions on this message',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Emoji name' },
                count: { type: 'number', description: 'Number of reactions' },
                users: {
                  type: 'array',
                  description: 'Array of user IDs who reacted',
                  items: { type: 'string' },
                },
              },
            },
          },
          is_starred: { type: 'boolean', description: 'Whether message is starred' },
          pinned_to: {
            type: 'array',
            description: 'Array of channel IDs where message is pinned',
            items: { type: 'string' },
          },

          // Content attachments
          files: {
            type: 'array',
            description: 'Array of files attached to message',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'File ID' },
                name: { type: 'string', description: 'File name' },
                mimetype: { type: 'string', description: 'MIME type' },
                size: { type: 'number', description: 'File size in bytes' },
                url_private: { type: 'string', description: 'Private download URL' },
                permalink: { type: 'string', description: 'Permanent link to file' },
                mode: { type: 'string', description: 'File mode' },
              },
            },
          },
          attachments: {
            type: 'array',
            description: 'Array of legacy attachments',
            items: { type: 'object' },
          },
          blocks: {
            type: 'array',
            description: 'Array of Block Kit blocks',
            items: { type: 'object' },
          },

          // Metadata
          edited: {
            type: 'object',
            description: 'Edit information if message was edited',
            properties: {
              user: { type: 'string', description: 'User ID who edited' },
              ts: { type: 'string', description: 'Edit timestamp' },
            },
          },
          permalink: { type: 'string', description: 'Permanent link to message' },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/slack/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface SlackBaseParams {
  authMethod: 'oauth' | 'bot_token'
  accessToken: string
  botToken: string
}

export interface SlackMessageParams extends SlackBaseParams {
  channel?: string
  userId?: string
  text: string
  thread_ts?: string
  files?: any[]
}

export interface SlackCanvasParams extends SlackBaseParams {
  channel: string
  title: string
  content: string
  document_content?: object
}

export interface SlackMessageReaderParams extends SlackBaseParams {
  channel?: string
  userId?: string
  limit?: number
  oldest?: string
  latest?: string
}

export interface SlackDownloadParams extends SlackBaseParams {
  fileId: string
  fileName?: string
}

export interface SlackUpdateMessageParams extends SlackBaseParams {
  channel: string
  timestamp: string
  text: string
}

export interface SlackDeleteMessageParams extends SlackBaseParams {
  channel: string
  timestamp: string
}

export interface SlackAddReactionParams extends SlackBaseParams {
  channel: string
  timestamp: string
  name: string
}

export interface SlackListChannelsParams extends SlackBaseParams {
  includePrivate?: boolean
  excludeArchived?: boolean
  limit?: number
}

export interface SlackListMembersParams extends SlackBaseParams {
  channel: string
  limit?: number
}

export interface SlackListUsersParams extends SlackBaseParams {
  includeDeleted?: boolean
  limit?: number
}

export interface SlackGetUserParams extends SlackBaseParams {
  userId: string
}

export interface SlackMessageResponse extends ToolResponse {
  output: {
    // Legacy properties for backward compatibility
    ts: string
    channel: string
    fileCount?: number
    // New comprehensive message object
    message: SlackMessage
  }
}

export interface SlackCanvasResponse extends ToolResponse {
  output: {
    canvas_id: string
    channel: string
    title: string
  }
}

export interface SlackReaction {
  name: string
  count: number
  users: string[]
}

export interface SlackMessageEdited {
  user: string
  ts: string
}

export interface SlackAttachment {
  id?: number
  fallback?: string
  text?: string
  pretext?: string
  color?: string
  fields?: Array<{
    title: string
    value: string
    short?: boolean
  }>
  author_name?: string
  author_link?: string
  author_icon?: string
  title?: string
  title_link?: string
  image_url?: string
  thumb_url?: string
  footer?: string
  footer_icon?: string
  ts?: string
}

export interface SlackBlock {
  type: string
  block_id?: string
  [key: string]: any // Blocks can have various properties depending on type
}

export interface SlackMessage {
  // Core properties
  type: string
  ts: string
  text: string
  user?: string
  bot_id?: string
  username?: string
  channel?: string
  team?: string

  // Thread properties
  thread_ts?: string
  parent_user_id?: string
  reply_count?: number
  reply_users_count?: number
  latest_reply?: string
  subscribed?: boolean
  last_read?: string
  unread_count?: number

  // Message subtype
  subtype?: string

  // Reactions and interactions
  reactions?: SlackReaction[]
  is_starred?: boolean
  pinned_to?: string[]

  // Content attachments
  files?: Array<{
    id: string
    name: string
    mimetype: string
    size: number
    url_private?: string
    permalink?: string
    mode?: string
  }>
  attachments?: SlackAttachment[]
  blocks?: SlackBlock[]

  // Metadata
  edited?: SlackMessageEdited
  permalink?: string
}

export interface SlackMessageReaderResponse extends ToolResponse {
  output: {
    messages: SlackMessage[]
  }
}

export interface SlackDownloadResponse extends ToolResponse {
  output: {
    file: {
      name: string
      mimeType: string
      data: Buffer | string // Buffer for direct use, string for base64-encoded data
      size: number
    }
  }
}

export interface SlackUpdateMessageResponse extends ToolResponse {
  output: {
    // Legacy properties for backward compatibility
    content: string
    metadata: {
      channel: string
      timestamp: string
      text: string
    }
    // New comprehensive message object
    message: SlackMessage
  }
}

export interface SlackDeleteMessageResponse extends ToolResponse {
  output: {
    content: string
    metadata: {
      channel: string
      timestamp: string
    }
  }
}

export interface SlackAddReactionResponse extends ToolResponse {
  output: {
    content: string
    metadata: {
      channel: string
      timestamp: string
      reaction: string
    }
  }
}

export interface SlackChannel {
  id: string
  name: string
  is_private: boolean
  is_archived: boolean
  is_member: boolean
  num_members?: number
  topic?: string
  purpose?: string
  created?: number
  creator?: string
}

export interface SlackListChannelsResponse extends ToolResponse {
  output: {
    channels: SlackChannel[]
    count: number
  }
}

export interface SlackListMembersResponse extends ToolResponse {
  output: {
    members: string[]
    count: number
  }
}

export interface SlackUser {
  id: string
  name: string
  real_name: string
  display_name: string
  first_name?: string
  last_name?: string
  title?: string
  phone?: string
  skype?: string
  is_bot: boolean
  is_admin: boolean
  is_owner: boolean
  is_primary_owner?: boolean
  is_restricted?: boolean
  is_ultra_restricted?: boolean
  deleted: boolean
  timezone?: string
  timezone_label?: string
  timezone_offset?: number
  avatar?: string
  avatar_24?: string
  avatar_48?: string
  avatar_72?: string
  avatar_192?: string
  avatar_512?: string
  status_text?: string
  status_emoji?: string
  status_expiration?: number
  updated?: number
}

export interface SlackListUsersResponse extends ToolResponse {
  output: {
    users: SlackUser[]
    count: number
  }
}

export interface SlackGetUserResponse extends ToolResponse {
  output: {
    user: SlackUser
  }
}

export type SlackResponse =
  | SlackCanvasResponse
  | SlackMessageReaderResponse
  | SlackMessageResponse
  | SlackDownloadResponse
  | SlackUpdateMessageResponse
  | SlackDeleteMessageResponse
  | SlackAddReactionResponse
  | SlackListChannelsResponse
  | SlackListMembersResponse
  | SlackListUsersResponse
  | SlackGetUserResponse
```

--------------------------------------------------------------------------------

---[FILE: update_message.ts]---
Location: sim-main/apps/sim/tools/slack/update_message.ts

```typescript
import type { SlackUpdateMessageParams, SlackUpdateMessageResponse } from '@/tools/slack/types'
import type { ToolConfig } from '@/tools/types'

export const slackUpdateMessageTool: ToolConfig<
  SlackUpdateMessageParams,
  SlackUpdateMessageResponse
> = {
  id: 'slack_update_message',
  name: 'Slack Update Message',
  description: 'Update a message previously sent by the bot in Slack',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'slack',
  },

  params: {
    authMethod: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Authentication method: oauth or bot_token',
    },
    botToken: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Bot token for Custom Bot',
    },
    accessToken: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description: 'OAuth access token or bot token for Slack API',
    },
    channel: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Channel ID where the message was posted (e.g., C1234567890)',
    },
    timestamp: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Timestamp of the message to update (e.g., 1405894322.002768)',
    },
    text: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'New message text (supports Slack mrkdwn formatting)',
    },
  },

  request: {
    url: '/api/tools/slack/update-message',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params: SlackUpdateMessageParams) => ({
      accessToken: params.accessToken || params.botToken,
      channel: params.channel,
      timestamp: params.timestamp,
      text: params.text,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || 'Failed to update message')
    }

    return {
      success: true,
      output: data.output,
    }
  },

  outputs: {
    message: {
      type: 'object',
      description: 'Complete updated message object with all properties returned by Slack',
    },
    // Legacy properties for backward compatibility
    content: { type: 'string', description: 'Success message' },
    metadata: {
      type: 'object',
      description: 'Updated message metadata',
      properties: {
        channel: { type: 'string', description: 'Channel ID' },
        timestamp: { type: 'string', description: 'Message timestamp' },
        text: { type: 'string', description: 'Updated message text' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/sms/index.ts

```typescript
import { smsSendTool } from '@/tools/sms/send'

export { smsSendTool }
```

--------------------------------------------------------------------------------

---[FILE: send.ts]---
Location: sim-main/apps/sim/tools/sms/send.ts

```typescript
import type { SMSSendParams, SMSSendResult } from '@/tools/sms/types'
import type { ToolConfig } from '@/tools/types'

export const smsSendTool: ToolConfig<SMSSendParams, SMSSendResult> = {
  id: 'sms_send',
  name: 'Send SMS',
  description: 'Send an SMS message using the internal SMS service powered by Twilio',
  version: '1.0.0',

  params: {
    to: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Recipient phone number (include country code, e.g., +1234567890)',
    },
    body: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'SMS message content',
    },
  },

  request: {
    url: '/api/tools/sms/send',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params: SMSSendParams) => ({
      to: params.to,
      body: params.body,
    }),
  },

  transformResponse: async (response: Response, params): Promise<SMSSendResult> => {
    const result = await response.json()

    return {
      success: true,
      output: {
        success: result.success,
        to: params?.to || '',
        body: params?.body || '',
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the SMS was sent successfully' },
    to: { type: 'string', description: 'Recipient phone number' },
    body: { type: 'string', description: 'SMS message content' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/sms/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface SMSSendParams {
  to: string
  body: string
}

export interface SMSSendResult extends ToolResponse {
  output: {
    success: boolean
    to: string
    body: string
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/smtp/index.ts

```typescript
export { smtpSendMailTool } from './send_mail'
export type { SmtpConnectionConfig, SmtpSendMailParams, SmtpSendMailResult } from './types'
```

--------------------------------------------------------------------------------

---[FILE: send_mail.ts]---
Location: sim-main/apps/sim/tools/smtp/send_mail.ts

```typescript
import type { SmtpSendMailParams, SmtpSendMailResult } from '@/tools/smtp/types'
import type { ToolConfig } from '@/tools/types'

export const smtpSendMailTool: ToolConfig<SmtpSendMailParams, SmtpSendMailResult> = {
  id: 'smtp_send_mail',
  name: 'SMTP Send Mail',
  description: 'Send emails via SMTP server',
  version: '1.0.0',

  params: {
    smtpHost: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SMTP server hostname (e.g., smtp.gmail.com)',
    },
    smtpPort: {
      type: 'number',
      required: true,
      visibility: 'user-only',
      description: 'SMTP server port (587 for TLS, 465 for SSL)',
    },
    smtpUsername: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SMTP authentication username',
    },
    smtpPassword: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SMTP authentication password',
    },
    smtpSecure: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Security protocol (TLS, SSL, or None)',
    },

    from: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Sender email address',
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
      description: 'Content type (text or html)',
    },

    // Optional Fields
    fromName: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Display name for sender',
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
    replyTo: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Reply-to email address',
    },
    attachments: {
      type: 'file[]',
      required: false,
      visibility: 'user-only',
      description: 'Files to attach to the email',
    },
  },

  request: {
    url: '/api/tools/smtp/send',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params: SmtpSendMailParams) => ({
      smtpHost: params.smtpHost,
      smtpPort: params.smtpPort,
      smtpUsername: params.smtpUsername,
      smtpPassword: params.smtpPassword,
      smtpSecure: params.smtpSecure,
      from: params.from,
      to: params.to,
      subject: params.subject,
      body: params.body,
      contentType: params.contentType || 'text',
      fromName: params.fromName,
      cc: params.cc,
      bcc: params.bcc,
      replyTo: params.replyTo,
      attachments: params.attachments,
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        output: {
          success: false,
        },
        error: data.error || 'Failed to send email via SMTP',
      }
    }

    return {
      success: true,
      output: {
        success: true,
        messageId: data.messageId,
        to: data.to,
        subject: data.subject,
      },
    }
  },

  outputs: {
    success: {
      type: 'boolean',
      description: 'Whether the email was sent successfully',
    },
    messageId: {
      type: 'string',
      description: 'Message ID from SMTP server',
    },
    to: {
      type: 'string',
      description: 'Recipient email address',
    },
    subject: {
      type: 'string',
      description: 'Email subject',
    },
    error: {
      type: 'string',
      description: 'Error message if sending failed',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/smtp/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface SmtpConnectionConfig {
  smtpHost: string
  smtpPort: number
  smtpUsername: string
  smtpPassword: string
  smtpSecure: 'TLS' | 'SSL' | 'None'
}

export interface SmtpSendMailParams extends SmtpConnectionConfig {
  // Email content
  from: string
  to: string
  subject: string
  body: string
  contentType?: 'text' | 'html'

  // Optional fields
  fromName?: string
  cc?: string
  bcc?: string
  replyTo?: string
  attachments?: any[]
}

export interface SmtpSendMailResult extends ToolResponse {
  output: {
    success: boolean
    messageId?: string
    to?: string
    subject?: string
  }
}
```

--------------------------------------------------------------------------------

---[FILE: add_playlist_cover.ts]---
Location: sim-main/apps/sim/tools/spotify/add_playlist_cover.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'

interface SpotifyAddPlaylistCoverParams {
  accessToken: string
  playlistId: string
  imageBase64: string
}

interface SpotifyAddPlaylistCoverResponse extends ToolResponse {
  output: { success: boolean }
}

export const spotifyAddPlaylistCoverTool: ToolConfig<
  SpotifyAddPlaylistCoverParams,
  SpotifyAddPlaylistCoverResponse
> = {
  id: 'spotify_add_playlist_cover',
  name: 'Spotify Add Playlist Cover',
  description: 'Upload a custom cover image for a playlist. Image must be JPEG and under 256KB.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['playlist-modify-public', 'playlist-modify-private', 'ugc-image-upload'],
  },

  params: {
    playlistId: {
      type: 'string',
      required: true,
      description: 'The Spotify playlist ID',
    },
    imageBase64: {
      type: 'string',
      required: true,
      description: 'Base64-encoded JPEG image (max 256KB)',
    },
  },

  request: {
    url: (params) => `https://api.spotify.com/v1/playlists/${params.playlistId}/images`,
    method: 'PUT',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'image/jpeg',
    }),
    body: (params) => params.imageBase64,
  },

  transformResponse: async (): Promise<SpotifyAddPlaylistCoverResponse> => {
    return { success: true, output: { success: true } }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether upload succeeded' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: add_to_queue.ts]---
Location: sim-main/apps/sim/tools/spotify/add_to_queue.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { SpotifyAddToQueueParams, SpotifyAddToQueueResponse } from './types'

export const spotifyAddToQueueTool: ToolConfig<SpotifyAddToQueueParams, SpotifyAddToQueueResponse> =
  {
    id: 'spotify_add_to_queue',
    name: 'Spotify Add to Queue',
    description: "Add a track to the user's playback queue.",
    version: '1.0.0',

    oauth: {
      required: true,
      provider: 'spotify',
      requiredScopes: ['user-modify-playback-state'],
    },

    params: {
      uri: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description: 'Spotify URI of the track to add (e.g., "spotify:track:xxx")',
      },
      device_id: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Device ID. If not provided, uses active device.',
      },
    },

    request: {
      url: (params) => {
        let url = `https://api.spotify.com/v1/me/player/queue?uri=${encodeURIComponent(params.uri)}`
        if (params.device_id) {
          url += `&device_id=${params.device_id}`
        }
        return url
      },
      method: 'POST',
      headers: (params) => ({
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
      }),
    },

    transformResponse: async (): Promise<SpotifyAddToQueueResponse> => {
      return {
        success: true,
        output: {
          success: true,
        },
      }
    },

    outputs: {
      success: { type: 'boolean', description: 'Whether track was added to queue' },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: add_tracks_to_playlist.ts]---
Location: sim-main/apps/sim/tools/spotify/add_tracks_to_playlist.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { SpotifyAddTracksToPlaylistParams, SpotifyAddTracksToPlaylistResponse } from './types'

export const spotifyAddTracksToPlaylistTool: ToolConfig<
  SpotifyAddTracksToPlaylistParams,
  SpotifyAddTracksToPlaylistResponse
> = {
  id: 'spotify_add_tracks_to_playlist',
  name: 'Spotify Add Tracks to Playlist',
  description: 'Add one or more tracks to a Spotify playlist.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['playlist-modify-public', 'playlist-modify-private'],
  },

  params: {
    playlistId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The Spotify ID of the playlist',
    },
    uris: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Comma-separated Spotify URIs (e.g., "spotify:track:xxx,spotify:track:yyy")',
    },
    position: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Position to insert tracks (0-based). If omitted, tracks are appended.',
    },
  },

  request: {
    url: (params) => `https://api.spotify.com/v1/playlists/${params.playlistId}/tracks`,
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const uris = params.uris.split(',').map((uri) => uri.trim())
      const body: any = { uris }
      if (params.position !== undefined) {
        body.position = params.position
      }
      return body
    },
  },

  transformResponse: async (response): Promise<SpotifyAddTracksToPlaylistResponse> => {
    const data = await response.json()

    return {
      success: true,
      output: {
        snapshot_id: data.snapshot_id,
      },
    }
  },

  outputs: {
    snapshot_id: { type: 'string', description: 'New playlist snapshot ID after modification' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: check_following.ts]---
Location: sim-main/apps/sim/tools/spotify/check_following.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'

interface SpotifyCheckFollowingParams {
  accessToken: string
  type: string
  ids: string
}

interface SpotifyCheckFollowingResponse extends ToolResponse {
  output: { results: boolean[] }
}

export const spotifyCheckFollowingTool: ToolConfig<
  SpotifyCheckFollowingParams,
  SpotifyCheckFollowingResponse
> = {
  id: 'spotify_check_following',
  name: 'Spotify Check Following',
  description: 'Check if the user follows artists or users.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['user-follow-read'],
  },

  params: {
    type: {
      type: 'string',
      required: true,
      description: 'Type to check: "artist" or "user"',
    },
    ids: {
      type: 'string',
      required: true,
      description: 'Comma-separated artist or user IDs (max 50)',
    },
  },

  request: {
    url: (params) => {
      const ids = params.ids
        .split(',')
        .map((id) => id.trim())
        .slice(0, 50)
        .join(',')
      return `https://api.spotify.com/v1/me/following/contains?type=${params.type}&ids=${ids}`
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },

  transformResponse: async (response): Promise<SpotifyCheckFollowingResponse> => {
    const results = await response.json()
    return { success: true, output: { results } }
  },

  outputs: {
    results: { type: 'json', description: 'Array of booleans for each ID' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: check_playlist_followers.ts]---
Location: sim-main/apps/sim/tools/spotify/check_playlist_followers.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'

interface SpotifyCheckPlaylistFollowersParams {
  accessToken: string
  playlistId: string
  userIds: string
}

interface SpotifyCheckPlaylistFollowersResponse extends ToolResponse {
  output: { results: boolean[] }
}

export const spotifyCheckPlaylistFollowersTool: ToolConfig<
  SpotifyCheckPlaylistFollowersParams,
  SpotifyCheckPlaylistFollowersResponse
> = {
  id: 'spotify_check_playlist_followers',
  name: 'Spotify Check Playlist Followers',
  description: 'Check if users follow a playlist.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['playlist-read-private'],
  },

  params: {
    playlistId: {
      type: 'string',
      required: true,
      description: 'The Spotify playlist ID',
    },
    userIds: {
      type: 'string',
      required: true,
      description: 'Comma-separated user IDs to check (max 5)',
    },
  },

  request: {
    url: (params) => {
      const ids = params.userIds
        .split(',')
        .map((id) => id.trim())
        .slice(0, 5)
        .join(',')
      return `https://api.spotify.com/v1/playlists/${params.playlistId}/followers/contains?ids=${ids}`
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },

  transformResponse: async (response): Promise<SpotifyCheckPlaylistFollowersResponse> => {
    const results = await response.json()
    return { success: true, output: { results } }
  },

  outputs: {
    results: { type: 'json', description: 'Array of booleans for each user' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: check_saved_albums.ts]---
Location: sim-main/apps/sim/tools/spotify/check_saved_albums.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'

interface SpotifyCheckSavedAlbumsParams {
  accessToken: string
  albumIds: string
}

interface SpotifyCheckSavedAlbumsResponse extends ToolResponse {
  output: { results: boolean[] }
}

export const spotifyCheckSavedAlbumsTool: ToolConfig<
  SpotifyCheckSavedAlbumsParams,
  SpotifyCheckSavedAlbumsResponse
> = {
  id: 'spotify_check_saved_albums',
  name: 'Spotify Check Saved Albums',
  description: 'Check if albums are saved in library.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['user-library-read'],
  },

  params: {
    albumIds: {
      type: 'string',
      required: true,
      description: 'Comma-separated album IDs (max 20)',
    },
  },

  request: {
    url: (params) => {
      const ids = params.albumIds
        .split(',')
        .map((id) => id.trim())
        .slice(0, 20)
        .join(',')
      return `https://api.spotify.com/v1/me/albums/contains?ids=${ids}`
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },

  transformResponse: async (response): Promise<SpotifyCheckSavedAlbumsResponse> => {
    const results = await response.json()
    return { success: true, output: { results } }
  },

  outputs: {
    results: { type: 'json', description: 'Array of booleans for each album' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: check_saved_audiobooks.ts]---
Location: sim-main/apps/sim/tools/spotify/check_saved_audiobooks.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'

interface SpotifyCheckSavedAudiobooksParams {
  accessToken: string
  audiobookIds: string
}

interface SpotifyCheckSavedAudiobooksResponse extends ToolResponse {
  output: { results: boolean[] }
}

export const spotifyCheckSavedAudiobooksTool: ToolConfig<
  SpotifyCheckSavedAudiobooksParams,
  SpotifyCheckSavedAudiobooksResponse
> = {
  id: 'spotify_check_saved_audiobooks',
  name: 'Spotify Check Saved Audiobooks',
  description: 'Check if audiobooks are saved in library.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'spotify',
    requiredScopes: ['user-library-read'],
  },

  params: {
    audiobookIds: {
      type: 'string',
      required: true,
      description: 'Comma-separated audiobook IDs (max 50)',
    },
  },

  request: {
    url: (params) => {
      const ids = params.audiobookIds
        .split(',')
        .map((id) => id.trim())
        .slice(0, 50)
        .join(',')
      return `https://api.spotify.com/v1/me/audiobooks/contains?ids=${ids}`
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },

  transformResponse: async (response): Promise<SpotifyCheckSavedAudiobooksResponse> => {
    const results = await response.json()
    return { success: true, output: { results } }
  },

  outputs: {
    results: { type: 'json', description: 'Array of booleans for each audiobook' },
  },
}
```

--------------------------------------------------------------------------------

````
