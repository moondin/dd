---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 664
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 664 of 933)

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

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/discord/types.ts

```typescript
export interface DiscordMessage {
  id: string
  content: string
  channel_id: string
  author: {
    id: string
    username: string
    avatar?: string
    bot: boolean
  }
  timestamp: string
  edited_timestamp?: string | null
  embeds: any[]
  attachments: any[]
  mentions: any[]
  mention_roles: string[]
  mention_everyone: boolean
}

export interface DiscordAPIError {
  code: number
  message: string
  errors?: Record<string, any>
}

export interface DiscordGuild {
  id: string
  name: string
  icon?: string
  description?: string
  owner_id: string
  roles: any[]
  channels?: any[]
  member_count?: number
}

export interface DiscordUser {
  id: string
  username: string
  discriminator: string
  avatar?: string
  bot?: boolean
  system?: boolean
  email?: string
  verified?: boolean
}

export interface DiscordAuthParams {
  botToken: string
  serverId: string
}

export interface DiscordSendMessageParams extends DiscordAuthParams {
  channelId: string
  content?: string
  embed?: {
    title?: string
    description?: string
    color?: string | number
  }
  files?: any[]
}

export interface DiscordGetMessagesParams extends DiscordAuthParams {
  channelId: string
  limit?: number
}

export interface DiscordGetServerParams extends Omit<DiscordAuthParams, 'serverId'> {
  serverId: string
}

export interface DiscordGetUserParams extends Omit<DiscordAuthParams, 'serverId'> {
  userId: string
}

interface BaseDiscordResponse {
  success: boolean
  output: Record<string, any>
  error?: string
}

export interface DiscordSendMessageResponse extends BaseDiscordResponse {
  output: {
    message: string
    data?: DiscordMessage
  }
}

export interface DiscordGetMessagesResponse extends BaseDiscordResponse {
  output: {
    message: string
    data?: {
      messages: DiscordMessage[]
      channel_id: string
    }
  }
}

export interface DiscordGetServerResponse extends BaseDiscordResponse {
  output: {
    message: string
    data?: DiscordGuild
  }
}

export interface DiscordGetUserResponse extends BaseDiscordResponse {
  output: {
    message: string
    data?: DiscordUser
  }
}

// Message operations
export interface DiscordEditMessageParams extends DiscordAuthParams {
  channelId: string
  messageId: string
  content?: string
}

export interface DiscordEditMessageResponse extends BaseDiscordResponse {
  output: {
    message: string
    data?: DiscordMessage
  }
}

export interface DiscordDeleteMessageParams extends DiscordAuthParams {
  channelId: string
  messageId: string
}

export interface DiscordDeleteMessageResponse extends BaseDiscordResponse {
  output: {
    message: string
  }
}

export interface DiscordAddReactionParams extends DiscordAuthParams {
  channelId: string
  messageId: string
  emoji: string
}

export interface DiscordAddReactionResponse extends BaseDiscordResponse {
  output: {
    message: string
  }
}

export interface DiscordRemoveReactionParams extends DiscordAuthParams {
  channelId: string
  messageId: string
  emoji: string
  userId?: string
}

export interface DiscordRemoveReactionResponse extends BaseDiscordResponse {
  output: {
    message: string
  }
}

export interface DiscordPinMessageParams extends DiscordAuthParams {
  channelId: string
  messageId: string
}

export interface DiscordPinMessageResponse extends BaseDiscordResponse {
  output: {
    message: string
  }
}

export interface DiscordUnpinMessageParams extends DiscordAuthParams {
  channelId: string
  messageId: string
}

export interface DiscordUnpinMessageResponse extends BaseDiscordResponse {
  output: {
    message: string
  }
}

// Thread operations
export interface DiscordCreateThreadParams extends DiscordAuthParams {
  channelId: string
  name: string
  messageId?: string
  autoArchiveDuration?: number
}

export interface DiscordCreateThreadResponse extends BaseDiscordResponse {
  output: {
    message: string
    data?: any
  }
}

export interface DiscordJoinThreadParams extends DiscordAuthParams {
  threadId: string
}

export interface DiscordJoinThreadResponse extends BaseDiscordResponse {
  output: {
    message: string
  }
}

export interface DiscordLeaveThreadParams extends DiscordAuthParams {
  threadId: string
}

export interface DiscordLeaveThreadResponse extends BaseDiscordResponse {
  output: {
    message: string
  }
}

export interface DiscordArchiveThreadParams extends DiscordAuthParams {
  threadId: string
  archived: boolean
}

export interface DiscordArchiveThreadResponse extends BaseDiscordResponse {
  output: {
    message: string
    data?: any
  }
}

// Channel operations
export interface DiscordCreateChannelParams extends DiscordAuthParams {
  name: string
  type?: number
  topic?: string
  parentId?: string
}

export interface DiscordCreateChannelResponse extends BaseDiscordResponse {
  output: {
    message: string
    data?: any
  }
}

export interface DiscordUpdateChannelParams extends DiscordAuthParams {
  channelId: string
  name?: string
  topic?: string
}

export interface DiscordUpdateChannelResponse extends BaseDiscordResponse {
  output: {
    message: string
    data?: any
  }
}

export interface DiscordDeleteChannelParams extends DiscordAuthParams {
  channelId: string
}

export interface DiscordDeleteChannelResponse extends BaseDiscordResponse {
  output: {
    message: string
  }
}

export interface DiscordGetChannelParams extends DiscordAuthParams {
  channelId: string
}

export interface DiscordGetChannelResponse extends BaseDiscordResponse {
  output: {
    message: string
    data?: any
  }
}

// Role operations
export interface DiscordCreateRoleParams extends DiscordAuthParams {
  name: string
  color?: number
  hoist?: boolean
  mentionable?: boolean
}

export interface DiscordCreateRoleResponse extends BaseDiscordResponse {
  output: {
    message: string
    data?: any
  }
}

export interface DiscordUpdateRoleParams extends DiscordAuthParams {
  roleId: string
  name?: string
  color?: number
  hoist?: boolean
  mentionable?: boolean
}

export interface DiscordUpdateRoleResponse extends BaseDiscordResponse {
  output: {
    message: string
    data?: any
  }
}

export interface DiscordDeleteRoleParams extends DiscordAuthParams {
  roleId: string
}

export interface DiscordDeleteRoleResponse extends BaseDiscordResponse {
  output: {
    message: string
  }
}

export interface DiscordAssignRoleParams extends DiscordAuthParams {
  userId: string
  roleId: string
}

export interface DiscordAssignRoleResponse extends BaseDiscordResponse {
  output: {
    message: string
  }
}

export interface DiscordRemoveRoleParams extends DiscordAuthParams {
  userId: string
  roleId: string
}

export interface DiscordRemoveRoleResponse extends BaseDiscordResponse {
  output: {
    message: string
  }
}

// Member operations
export interface DiscordKickMemberParams extends DiscordAuthParams {
  userId: string
  reason?: string
}

export interface DiscordKickMemberResponse extends BaseDiscordResponse {
  output: {
    message: string
  }
}

export interface DiscordBanMemberParams extends DiscordAuthParams {
  userId: string
  reason?: string
  deleteMessageDays?: number
}

export interface DiscordBanMemberResponse extends BaseDiscordResponse {
  output: {
    message: string
  }
}

export interface DiscordUnbanMemberParams extends DiscordAuthParams {
  userId: string
  reason?: string
}

export interface DiscordUnbanMemberResponse extends BaseDiscordResponse {
  output: {
    message: string
  }
}

export interface DiscordGetMemberParams extends DiscordAuthParams {
  userId: string
}

export interface DiscordGetMemberResponse extends BaseDiscordResponse {
  output: {
    message: string
    data?: any
  }
}

export interface DiscordUpdateMemberParams extends DiscordAuthParams {
  userId: string
  nick?: string
  mute?: boolean
  deaf?: boolean
}

export interface DiscordUpdateMemberResponse extends BaseDiscordResponse {
  output: {
    message: string
    data?: any
  }
}

// Invite operations
export interface DiscordCreateInviteParams extends DiscordAuthParams {
  channelId: string
  maxAge?: number
  maxUses?: number
  temporary?: boolean
}

export interface DiscordCreateInviteResponse extends BaseDiscordResponse {
  output: {
    message: string
    data?: any
  }
}

export interface DiscordGetInviteParams extends DiscordAuthParams {
  inviteCode: string
}

export interface DiscordGetInviteResponse extends BaseDiscordResponse {
  output: {
    message: string
    data?: any
  }
}

export interface DiscordDeleteInviteParams extends DiscordAuthParams {
  inviteCode: string
}

export interface DiscordDeleteInviteResponse extends BaseDiscordResponse {
  output: {
    message: string
  }
}

// Webhook operations
export interface DiscordCreateWebhookParams extends DiscordAuthParams {
  channelId: string
  name: string
}

export interface DiscordCreateWebhookResponse extends BaseDiscordResponse {
  output: {
    message: string
    data?: any
  }
}

export interface DiscordExecuteWebhookParams extends DiscordAuthParams {
  webhookId: string
  webhookToken: string
  content: string
  username?: string
}

export interface DiscordExecuteWebhookResponse extends BaseDiscordResponse {
  output: {
    message: string
    data?: any
  }
}

export interface DiscordGetWebhookParams extends DiscordAuthParams {
  webhookId: string
}

export interface DiscordGetWebhookResponse extends BaseDiscordResponse {
  output: {
    message: string
    data?: any
  }
}

export interface DiscordDeleteWebhookParams extends DiscordAuthParams {
  webhookId: string
}

export interface DiscordDeleteWebhookResponse extends BaseDiscordResponse {
  output: {
    message: string
  }
}

export type DiscordResponse =
  | DiscordSendMessageResponse
  | DiscordGetMessagesResponse
  | DiscordGetServerResponse
  | DiscordGetUserResponse
  | DiscordEditMessageResponse
  | DiscordDeleteMessageResponse
  | DiscordAddReactionResponse
  | DiscordRemoveReactionResponse
  | DiscordPinMessageResponse
  | DiscordUnpinMessageResponse
  | DiscordCreateThreadResponse
  | DiscordJoinThreadResponse
  | DiscordLeaveThreadResponse
  | DiscordArchiveThreadResponse
  | DiscordCreateChannelResponse
  | DiscordUpdateChannelResponse
  | DiscordDeleteChannelResponse
  | DiscordGetChannelResponse
  | DiscordCreateRoleResponse
  | DiscordUpdateRoleResponse
  | DiscordDeleteRoleResponse
  | DiscordAssignRoleResponse
  | DiscordRemoveRoleResponse
  | DiscordKickMemberResponse
  | DiscordBanMemberResponse
  | DiscordUnbanMemberResponse
  | DiscordGetMemberResponse
  | DiscordUpdateMemberResponse
  | DiscordCreateInviteResponse
  | DiscordGetInviteResponse
  | DiscordDeleteInviteResponse
  | DiscordCreateWebhookResponse
  | DiscordExecuteWebhookResponse
  | DiscordGetWebhookResponse
  | DiscordDeleteWebhookResponse
```

--------------------------------------------------------------------------------

---[FILE: unban_member.ts]---
Location: sim-main/apps/sim/tools/discord/unban_member.ts

```typescript
import type { DiscordUnbanMemberParams, DiscordUnbanMemberResponse } from '@/tools/discord/types'
import type { ToolConfig } from '@/tools/types'

export const discordUnbanMemberTool: ToolConfig<
  DiscordUnbanMemberParams,
  DiscordUnbanMemberResponse
> = {
  id: 'discord_unban_member',
  name: 'Discord Unban Member',
  description: 'Unban a member from a Discord server',
  version: '1.0.0',

  params: {
    botToken: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The bot token for authentication',
    },
    serverId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The Discord server ID (guild ID)',
    },
    userId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The user ID to unban',
    },
    reason: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Reason for unbanning the member',
    },
  },

  request: {
    url: (params: DiscordUnbanMemberParams) => {
      return `https://discord.com/api/v10/guilds/${params.serverId}/bans/${params.userId}`
    },
    method: 'DELETE',
    headers: (params) => {
      const headers: Record<string, string> = {
        Authorization: `Bot ${params.botToken}`,
      }
      if (params.reason) {
        headers['X-Audit-Log-Reason'] = encodeURIComponent(params.reason)
      }
      return headers
    },
  },

  transformResponse: async (response) => {
    return {
      success: true,
      output: {
        message: 'Member unbanned successfully',
      },
    }
  },

  outputs: {
    message: { type: 'string', description: 'Success or error message' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: unpin_message.ts]---
Location: sim-main/apps/sim/tools/discord/unpin_message.ts

```typescript
import type { DiscordUnpinMessageParams, DiscordUnpinMessageResponse } from '@/tools/discord/types'
import type { ToolConfig } from '@/tools/types'

export const discordUnpinMessageTool: ToolConfig<
  DiscordUnpinMessageParams,
  DiscordUnpinMessageResponse
> = {
  id: 'discord_unpin_message',
  name: 'Discord Unpin Message',
  description: 'Unpin a message in a Discord channel',
  version: '1.0.0',

  params: {
    botToken: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The bot token for authentication',
    },
    channelId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The Discord channel ID containing the message',
    },
    messageId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The ID of the message to unpin',
    },
    serverId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The Discord server ID (guild ID)',
    },
  },

  request: {
    url: (params: DiscordUnpinMessageParams) => {
      return `https://discord.com/api/v10/channels/${params.channelId}/pins/${params.messageId}`
    },
    method: 'DELETE',
    headers: (params) => ({
      Authorization: `Bot ${params.botToken}`,
    }),
  },

  transformResponse: async (response) => {
    return {
      success: true,
      output: {
        message: 'Message unpinned successfully',
      },
    }
  },

  outputs: {
    message: { type: 'string', description: 'Success or error message' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_channel.ts]---
Location: sim-main/apps/sim/tools/discord/update_channel.ts

```typescript
import type {
  DiscordUpdateChannelParams,
  DiscordUpdateChannelResponse,
} from '@/tools/discord/types'
import type { ToolConfig } from '@/tools/types'

export const discordUpdateChannelTool: ToolConfig<
  DiscordUpdateChannelParams,
  DiscordUpdateChannelResponse
> = {
  id: 'discord_update_channel',
  name: 'Discord Update Channel',
  description: 'Update a Discord channel',
  version: '1.0.0',

  params: {
    botToken: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The bot token for authentication',
    },
    channelId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The Discord channel ID to update',
    },
    name: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'The new name for the channel',
    },
    topic: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'The new topic for the channel',
    },
    serverId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The Discord server ID (guild ID)',
    },
  },

  request: {
    url: (params: DiscordUpdateChannelParams) => {
      return `https://discord.com/api/v10/channels/${params.channelId}`
    },
    method: 'PATCH',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bot ${params.botToken}`,
    }),
    body: (params: DiscordUpdateChannelParams) => {
      const body: any = {}
      if (params.name !== undefined && params.name !== null && params.name !== '')
        body.name = params.name
      if (params.topic !== undefined && params.topic !== null && params.topic !== '')
        body.topic = params.topic
      return body
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        message: 'Channel updated successfully',
        data,
      },
    }
  },

  outputs: {
    message: { type: 'string', description: 'Success or error message' },
    data: {
      type: 'object',
      description: 'Updated channel data',
      properties: {
        id: { type: 'string', description: 'Channel ID' },
        name: { type: 'string', description: 'Channel name' },
        type: { type: 'number', description: 'Channel type' },
        topic: { type: 'string', description: 'Channel topic' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_member.ts]---
Location: sim-main/apps/sim/tools/discord/update_member.ts

```typescript
import type { DiscordUpdateMemberParams, DiscordUpdateMemberResponse } from '@/tools/discord/types'
import type { ToolConfig } from '@/tools/types'

export const discordUpdateMemberTool: ToolConfig<
  DiscordUpdateMemberParams,
  DiscordUpdateMemberResponse
> = {
  id: 'discord_update_member',
  name: 'Discord Update Member',
  description: 'Update a member in a Discord server (e.g., change nickname)',
  version: '1.0.0',

  params: {
    botToken: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The bot token for authentication',
    },
    serverId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The Discord server ID (guild ID)',
    },
    userId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The user ID to update',
    },
    nick: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New nickname for the member (null to remove)',
    },
    mute: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Whether to mute the member in voice channels',
    },
    deaf: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Whether to deafen the member in voice channels',
    },
  },

  request: {
    url: (params: DiscordUpdateMemberParams) => {
      return `https://discord.com/api/v10/guilds/${params.serverId}/members/${params.userId}`
    },
    method: 'PATCH',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bot ${params.botToken}`,
    }),
    body: (params: DiscordUpdateMemberParams) => {
      const body: any = {}
      // Note: nick can be null to remove nickname, so we allow null but not empty string
      if (params.nick !== undefined && params.nick !== '') body.nick = params.nick
      if (params.mute !== undefined && params.mute !== null) body.mute = params.mute
      if (params.deaf !== undefined && params.deaf !== null) body.deaf = params.deaf
      return body
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        message: 'Member updated successfully',
        data,
      },
    }
  },

  outputs: {
    message: { type: 'string', description: 'Success or error message' },
    data: {
      type: 'object',
      description: 'Updated member data',
      properties: {
        nick: { type: 'string', description: 'Server nickname' },
        mute: { type: 'boolean', description: 'Voice mute status' },
        deaf: { type: 'boolean', description: 'Voice deaf status' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_role.ts]---
Location: sim-main/apps/sim/tools/discord/update_role.ts

```typescript
import type { DiscordUpdateRoleParams, DiscordUpdateRoleResponse } from '@/tools/discord/types'
import type { ToolConfig } from '@/tools/types'

export const discordUpdateRoleTool: ToolConfig<DiscordUpdateRoleParams, DiscordUpdateRoleResponse> =
  {
    id: 'discord_update_role',
    name: 'Discord Update Role',
    description: 'Update a role in a Discord server',
    version: '1.0.0',

    params: {
      botToken: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'The bot token for authentication',
      },
      serverId: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'The Discord server ID (guild ID)',
      },
      roleId: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description: 'The role ID to update',
      },
      name: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'The new name for the role',
      },
      color: {
        type: 'number',
        required: false,
        visibility: 'user-or-llm',
        description: 'RGB color value as integer',
      },
      hoist: {
        type: 'boolean',
        required: false,
        visibility: 'user-or-llm',
        description: 'Whether to display role members separately',
      },
      mentionable: {
        type: 'boolean',
        required: false,
        visibility: 'user-or-llm',
        description: 'Whether the role can be mentioned',
      },
    },

    request: {
      url: (params: DiscordUpdateRoleParams) => {
        return `https://discord.com/api/v10/guilds/${params.serverId}/roles/${params.roleId}`
      },
      method: 'PATCH',
      headers: (params) => ({
        'Content-Type': 'application/json',
        Authorization: `Bot ${params.botToken}`,
      }),
      body: (params: DiscordUpdateRoleParams) => {
        const body: any = {}
        if (params.name) body.name = params.name
        if (params.color !== undefined) body.color = Number(params.color)
        if (params.hoist !== undefined) body.hoist = params.hoist
        if (params.mentionable !== undefined) body.mentionable = params.mentionable
        return body
      },
    },

    transformResponse: async (response) => {
      const data = await response.json()
      return {
        success: true,
        output: {
          message: 'Role updated successfully',
          data,
        },
      }
    },

    outputs: {
      message: { type: 'string', description: 'Success or error message' },
      data: {
        type: 'object',
        description: 'Updated role data',
        properties: {
          id: { type: 'string', description: 'Role ID' },
          name: { type: 'string', description: 'Role name' },
          color: { type: 'number', description: 'Role color' },
        },
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: copy.ts]---
Location: sim-main/apps/sim/tools/dropbox/copy.ts

```typescript
import type { DropboxCopyParams, DropboxCopyResponse } from '@/tools/dropbox/types'
import type { ToolConfig } from '@/tools/types'

export const dropboxCopyTool: ToolConfig<DropboxCopyParams, DropboxCopyResponse> = {
  id: 'dropbox_copy',
  name: 'Dropbox Copy',
  description: 'Copy a file or folder in Dropbox',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'dropbox',
  },

  params: {
    fromPath: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The source path of the file or folder to copy',
    },
    toPath: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The destination path for the copied file or folder',
    },
    autorename: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'If true, rename the file if there is a conflict at destination',
    },
  },

  request: {
    url: 'https://api.dropboxapi.com/2/files/copy_v2',
    method: 'POST',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Missing access token for Dropbox API request')
      }
      return {
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
      }
    },
    body: (params) => ({
      from_path: params.fromPath,
      to_path: params.toPath,
      autorename: params.autorename ?? false,
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error_summary || data.error?.message || 'Failed to copy file/folder',
        output: {},
      }
    }

    return {
      success: true,
      output: {
        metadata: data.metadata,
      },
    }
  },

  outputs: {
    metadata: {
      type: 'object',
      description: 'Metadata of the copied item',
      properties: {
        '.tag': { type: 'string', description: 'Type: file or folder' },
        id: { type: 'string', description: 'Unique identifier' },
        name: { type: 'string', description: 'Name of the copied item' },
        path_display: { type: 'string', description: 'Display path' },
        size: { type: 'number', description: 'Size in bytes (files only)' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_folder.ts]---
Location: sim-main/apps/sim/tools/dropbox/create_folder.ts

```typescript
import type { DropboxCreateFolderParams, DropboxCreateFolderResponse } from '@/tools/dropbox/types'
import type { ToolConfig } from '@/tools/types'

export const dropboxCreateFolderTool: ToolConfig<
  DropboxCreateFolderParams,
  DropboxCreateFolderResponse
> = {
  id: 'dropbox_create_folder',
  name: 'Dropbox Create Folder',
  description: 'Create a new folder in Dropbox',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'dropbox',
  },

  params: {
    path: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The path where the folder should be created (e.g., /new-folder)',
    },
    autorename: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'If true, rename the folder if there is a conflict',
    },
  },

  request: {
    url: 'https://api.dropboxapi.com/2/files/create_folder_v2',
    method: 'POST',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Missing access token for Dropbox API request')
      }
      return {
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
      }
    },
    body: (params) => ({
      path: params.path,
      autorename: params.autorename ?? false,
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error_summary || data.error?.message || 'Failed to create folder',
        output: {},
      }
    }

    return {
      success: true,
      output: {
        folder: data.metadata,
      },
    }
  },

  outputs: {
    folder: {
      type: 'object',
      description: 'The created folder metadata',
      properties: {
        id: { type: 'string', description: 'Unique identifier for the folder' },
        name: { type: 'string', description: 'Name of the folder' },
        path_display: { type: 'string', description: 'Display path of the folder' },
        path_lower: { type: 'string', description: 'Lowercase path of the folder' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_shared_link.ts]---
Location: sim-main/apps/sim/tools/dropbox/create_shared_link.ts

```typescript
import type {
  DropboxCreateSharedLinkParams,
  DropboxCreateSharedLinkResponse,
} from '@/tools/dropbox/types'
import type { ToolConfig } from '@/tools/types'

export const dropboxCreateSharedLinkTool: ToolConfig<
  DropboxCreateSharedLinkParams,
  DropboxCreateSharedLinkResponse
> = {
  id: 'dropbox_create_shared_link',
  name: 'Dropbox Create Shared Link',
  description: 'Create a shareable link for a file or folder in Dropbox',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'dropbox',
  },

  params: {
    path: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The path of the file or folder to share',
    },
    requestedVisibility: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Visibility: public, team_only, or password',
    },
    linkPassword: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Password for the shared link (only if visibility is password)',
    },
    expires: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Expiration date in ISO 8601 format (e.g., 2025-12-31T23:59:59Z)',
    },
  },

  request: {
    url: 'https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings',
    method: 'POST',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Missing access token for Dropbox API request')
      }
      return {
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
      }
    },
    body: (params) => {
      const body: Record<string, any> = {
        path: params.path,
      }

      const settings: Record<string, any> = {}

      if (params.requestedVisibility) {
        settings.requested_visibility = { '.tag': params.requestedVisibility }
      }

      if (params.linkPassword) {
        settings.link_password = params.linkPassword
      }

      if (params.expires) {
        settings.expires = params.expires
      }

      if (Object.keys(settings).length > 0) {
        body.settings = settings
      }

      return body
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (!response.ok) {
      // Check if a shared link already exists
      if (data.error_summary?.includes('shared_link_already_exists')) {
        return {
          success: false,
          error:
            'A shared link already exists for this path. Use list_shared_links to get the existing link.',
          output: {},
        }
      }
      return {
        success: false,
        error: data.error_summary || data.error?.message || 'Failed to create shared link',
        output: {},
      }
    }

    return {
      success: true,
      output: {
        sharedLink: data,
      },
    }
  },

  outputs: {
    sharedLink: {
      type: 'object',
      description: 'The created shared link',
      properties: {
        url: { type: 'string', description: 'The shared link URL' },
        name: { type: 'string', description: 'Name of the shared item' },
        path_lower: { type: 'string', description: 'Lowercase path of the shared item' },
        expires: { type: 'string', description: 'Expiration date if set' },
        link_permissions: {
          type: 'object',
          description: 'Permissions for the shared link',
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete.ts]---
Location: sim-main/apps/sim/tools/dropbox/delete.ts

```typescript
import type { DropboxDeleteParams, DropboxDeleteResponse } from '@/tools/dropbox/types'
import type { ToolConfig } from '@/tools/types'

export const dropboxDeleteTool: ToolConfig<DropboxDeleteParams, DropboxDeleteResponse> = {
  id: 'dropbox_delete',
  name: 'Dropbox Delete',
  description: 'Delete a file or folder in Dropbox (moves to trash)',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'dropbox',
  },

  params: {
    path: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The path of the file or folder to delete',
    },
  },

  request: {
    url: 'https://api.dropboxapi.com/2/files/delete_v2',
    method: 'POST',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Missing access token for Dropbox API request')
      }
      return {
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
      }
    },
    body: (params) => ({
      path: params.path,
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error_summary || data.error?.message || 'Failed to delete file/folder',
        output: {},
      }
    }

    return {
      success: true,
      output: {
        metadata: data.metadata,
        deleted: true,
      },
    }
  },

  outputs: {
    metadata: {
      type: 'object',
      description: 'Metadata of the deleted item',
      properties: {
        '.tag': { type: 'string', description: 'Type: file, folder, or deleted' },
        name: { type: 'string', description: 'Name of the deleted item' },
        path_display: { type: 'string', description: 'Display path' },
      },
    },
    deleted: {
      type: 'boolean',
      description: 'Whether the deletion was successful',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: download.ts]---
Location: sim-main/apps/sim/tools/dropbox/download.ts

```typescript
import type { DropboxDownloadParams, DropboxDownloadResponse } from '@/tools/dropbox/types'
import type { ToolConfig } from '@/tools/types'

export const dropboxDownloadTool: ToolConfig<DropboxDownloadParams, DropboxDownloadResponse> = {
  id: 'dropbox_download',
  name: 'Dropbox Download File',
  description: 'Download a file from Dropbox and get a temporary link',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'dropbox',
  },

  params: {
    path: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The path of the file to download (e.g., /folder/document.pdf)',
    },
  },

  request: {
    url: 'https://api.dropboxapi.com/2/files/get_temporary_link',
    method: 'POST',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Missing access token for Dropbox API request')
      }
      return {
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
      }
    },
    body: (params) => ({
      path: params.path,
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error_summary || data.error?.message || 'Failed to download file',
        output: {},
      }
    }

    return {
      success: true,
      output: {
        file: data.metadata,
        content: '', // Content will be available via the temporary link
        temporaryLink: data.link,
      },
    }
  },

  outputs: {
    file: {
      type: 'object',
      description: 'The file metadata',
      properties: {
        id: { type: 'string', description: 'Unique identifier for the file' },
        name: { type: 'string', description: 'Name of the file' },
        path_display: { type: 'string', description: 'Display path of the file' },
        size: { type: 'number', description: 'Size of the file in bytes' },
      },
    },
    temporaryLink: {
      type: 'string',
      description: 'Temporary link to download the file (valid for ~4 hours)',
    },
    content: {
      type: 'string',
      description: 'Base64 encoded file content (if fetched)',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_metadata.ts]---
Location: sim-main/apps/sim/tools/dropbox/get_metadata.ts

```typescript
import type { DropboxGetMetadataParams, DropboxGetMetadataResponse } from '@/tools/dropbox/types'
import type { ToolConfig } from '@/tools/types'

export const dropboxGetMetadataTool: ToolConfig<
  DropboxGetMetadataParams,
  DropboxGetMetadataResponse
> = {
  id: 'dropbox_get_metadata',
  name: 'Dropbox Get Metadata',
  description: 'Get metadata for a file or folder in Dropbox',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'dropbox',
  },

  params: {
    path: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The path of the file or folder to get metadata for',
    },
    includeMediaInfo: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'If true, include media info for photos/videos',
    },
    includeDeleted: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'If true, include deleted files in results',
    },
  },

  request: {
    url: 'https://api.dropboxapi.com/2/files/get_metadata',
    method: 'POST',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Missing access token for Dropbox API request')
      }
      return {
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
      }
    },
    body: (params) => ({
      path: params.path,
      include_media_info: params.includeMediaInfo ?? false,
      include_deleted: params.includeDeleted ?? false,
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error_summary || data.error?.message || 'Failed to get metadata',
        output: {},
      }
    }

    return {
      success: true,
      output: {
        metadata: data,
      },
    }
  },

  outputs: {
    metadata: {
      type: 'object',
      description: 'Metadata for the file or folder',
      properties: {
        '.tag': { type: 'string', description: 'Type: file, folder, or deleted' },
        id: { type: 'string', description: 'Unique identifier' },
        name: { type: 'string', description: 'Name of the item' },
        path_display: { type: 'string', description: 'Display path' },
        path_lower: { type: 'string', description: 'Lowercase path' },
        size: { type: 'number', description: 'Size in bytes (files only)' },
        client_modified: { type: 'string', description: 'Client modification time' },
        server_modified: { type: 'string', description: 'Server modification time' },
        rev: { type: 'string', description: 'Revision identifier' },
        content_hash: { type: 'string', description: 'Content hash' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

````
