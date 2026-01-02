---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 663
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 663 of 933)

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

---[FILE: get_invite.ts]---
Location: sim-main/apps/sim/tools/discord/get_invite.ts

```typescript
import type { DiscordGetInviteParams, DiscordGetInviteResponse } from '@/tools/discord/types'
import type { ToolConfig } from '@/tools/types'

export const discordGetInviteTool: ToolConfig<DiscordGetInviteParams, DiscordGetInviteResponse> = {
  id: 'discord_get_invite',
  name: 'Discord Get Invite',
  description: 'Get information about a Discord invite',
  version: '1.0.0',

  params: {
    botToken: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The bot token for authentication',
    },
    inviteCode: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The invite code to retrieve',
    },
    serverId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The Discord server ID (guild ID)',
    },
  },

  request: {
    url: (params: DiscordGetInviteParams) => {
      return `https://discord.com/api/v10/invites/${params.inviteCode}?with_counts=true`
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bot ${params.botToken}`,
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        message: 'Invite information retrieved successfully',
        data,
      },
    }
  },

  outputs: {
    message: { type: 'string', description: 'Success or error message' },
    data: {
      type: 'object',
      description: 'Invite data',
      properties: {
        code: { type: 'string', description: 'Invite code' },
        guild: { type: 'object', description: 'Server information' },
        channel: { type: 'object', description: 'Channel information' },
        approximate_member_count: { type: 'number', description: 'Approximate member count' },
        approximate_presence_count: { type: 'number', description: 'Approximate online count' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_member.ts]---
Location: sim-main/apps/sim/tools/discord/get_member.ts

```typescript
import type { DiscordGetMemberParams, DiscordGetMemberResponse } from '@/tools/discord/types'
import type { ToolConfig } from '@/tools/types'

export const discordGetMemberTool: ToolConfig<DiscordGetMemberParams, DiscordGetMemberResponse> = {
  id: 'discord_get_member',
  name: 'Discord Get Member',
  description: 'Get information about a member in a Discord server',
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
      description: 'The user ID to retrieve',
    },
  },

  request: {
    url: (params: DiscordGetMemberParams) => {
      return `https://discord.com/api/v10/guilds/${params.serverId}/members/${params.userId}`
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bot ${params.botToken}`,
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        message: 'Member information retrieved successfully',
        data,
      },
    }
  },

  outputs: {
    message: { type: 'string', description: 'Success or error message' },
    data: {
      type: 'object',
      description: 'Member data',
      properties: {
        user: {
          type: 'object',
          description: 'User information',
          properties: {
            id: { type: 'string', description: 'User ID' },
            username: { type: 'string', description: 'Username' },
            avatar: { type: 'string', description: 'Avatar hash' },
          },
        },
        nick: { type: 'string', description: 'Server nickname' },
        roles: { type: 'array', description: 'Array of role IDs' },
        joined_at: { type: 'string', description: 'When the member joined' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_messages.ts]---
Location: sim-main/apps/sim/tools/discord/get_messages.ts

```typescript
import type { DiscordGetMessagesParams, DiscordGetMessagesResponse } from '@/tools/discord/types'
import type { ToolConfig } from '@/tools/types'

export const discordGetMessagesTool: ToolConfig<
  DiscordGetMessagesParams,
  DiscordGetMessagesResponse
> = {
  id: 'discord_get_messages',
  name: 'Discord Get Messages',
  description: 'Retrieve messages from a Discord channel',
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
      description: 'The Discord channel ID to retrieve messages from',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Maximum number of messages to retrieve (default: 10, max: 100)',
    },
  },

  request: {
    url: (params: DiscordGetMessagesParams) => {
      const limit = params.limit ? Number(params.limit) : 10
      return `https://discord.com/api/v10/channels/${params.channelId}/messages?limit=${Math.min(limit, 100)}`
    },
    method: 'GET',
    headers: (params) => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }

      if (params.botToken) {
        headers.Authorization = `Bot ${params.botToken}`
      }

      return headers
    },
  },

  transformResponse: async (response) => {
    const messages = await response.json()
    return {
      success: true,
      output: {
        message: `Retrieved ${messages.length} messages from Discord channel`,
        data: {
          messages,
          channel_id: messages.length > 0 ? messages[0].channel_id : '',
        },
      },
    }
  },

  outputs: {
    message: { type: 'string', description: 'Success or error message' },
    data: {
      type: 'object',
      description: 'Container for messages data',
      properties: {
        messages: {
          type: 'array',
          description: 'Array of Discord messages with full metadata',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', description: 'Message ID' },
              content: { type: 'string', description: 'Message content' },
              channel_id: { type: 'string', description: 'Channel ID' },
              author: {
                type: 'object',
                description: 'Message author information',
                properties: {
                  id: { type: 'string', description: 'Author user ID' },
                  username: { type: 'string', description: 'Author username' },
                  avatar: { type: 'string', description: 'Author avatar hash' },
                  bot: { type: 'boolean', description: 'Whether author is a bot' },
                },
              },
              timestamp: { type: 'string', description: 'Message timestamp' },
              edited_timestamp: { type: 'string', description: 'Message edited timestamp' },
              embeds: { type: 'array', description: 'Message embeds' },
              attachments: { type: 'array', description: 'Message attachments' },
              mentions: { type: 'array', description: 'User mentions in message' },
              mention_roles: { type: 'array', description: 'Role mentions in message' },
              mention_everyone: {
                type: 'boolean',
                description: 'Whether message mentions everyone',
              },
            },
          },
        },
        channel_id: { type: 'string', description: 'Channel ID' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_server.ts]---
Location: sim-main/apps/sim/tools/discord/get_server.ts

```typescript
import type {
  DiscordGetServerParams,
  DiscordGetServerResponse,
  DiscordGuild,
} from '@/tools/discord/types'
import type { ToolConfig } from '@/tools/types'

export const discordGetServerTool: ToolConfig<DiscordGetServerParams, DiscordGetServerResponse> = {
  id: 'discord_get_server',
  name: 'Discord Get Server',
  description: 'Retrieve information about a Discord server (guild)',
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
  },

  request: {
    url: (params: DiscordGetServerParams) =>
      `https://discord.com/api/v10/guilds/${params.serverId}`,
    method: 'GET',
    headers: (params: DiscordGetServerParams) => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }

      if (params.botToken) {
        headers.Authorization = `Bot ${params.botToken}`
      }

      return headers
    },
  },

  transformResponse: async (response: Response) => {
    const responseData = await response.json()

    return {
      success: true,
      output: {
        message: 'Successfully retrieved server information',
        data: responseData as DiscordGuild,
      },
    }
  },

  outputs: {
    message: { type: 'string', description: 'Success or error message' },
    data: {
      type: 'object',
      description: 'Discord server (guild) information',
      properties: {
        id: { type: 'string', description: 'Server ID' },
        name: { type: 'string', description: 'Server name' },
        icon: { type: 'string', description: 'Server icon hash' },
        description: { type: 'string', description: 'Server description' },
        owner_id: { type: 'string', description: 'Server owner user ID' },
        roles: { type: 'array', description: 'Server roles' },
        channels: { type: 'array', description: 'Server channels' },
        member_count: { type: 'number', description: 'Number of members in server' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_user.ts]---
Location: sim-main/apps/sim/tools/discord/get_user.ts

```typescript
import type {
  DiscordGetUserParams,
  DiscordGetUserResponse,
  DiscordUser,
} from '@/tools/discord/types'
import type { ToolConfig } from '@/tools/types'

export const discordGetUserTool: ToolConfig<DiscordGetUserParams, DiscordGetUserResponse> = {
  id: 'discord_get_user',
  name: 'Discord Get User',
  description: 'Retrieve information about a Discord user',
  version: '1.0.0',

  params: {
    botToken: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Discord bot token for authentication',
    },
    userId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The Discord user ID',
    },
  },

  request: {
    url: (params: DiscordGetUserParams) => `https://discord.com/api/v10/users/${params.userId}`,
    method: 'GET',
    headers: (params: DiscordGetUserParams) => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }

      if (params.botToken) {
        headers.Authorization = `Bot ${params.botToken}`
      }

      return headers
    },
  },

  transformResponse: async (response) => {
    const data: DiscordUser = await response.json()

    return {
      success: true,
      output: {
        message: `Retrieved information for Discord user: ${data.username}`,
        data,
      },
    }
  },

  outputs: {
    message: { type: 'string', description: 'Success or error message' },
    data: {
      type: 'object',
      description: 'Discord user information',
      properties: {
        id: { type: 'string', description: 'User ID' },
        username: { type: 'string', description: 'Username' },
        discriminator: { type: 'string', description: 'User discriminator (4-digit number)' },
        avatar: { type: 'string', description: 'User avatar hash' },
        bot: { type: 'boolean', description: 'Whether user is a bot' },
        system: { type: 'boolean', description: 'Whether user is a system user' },
        email: { type: 'string', description: 'User email (if available)' },
        verified: { type: 'boolean', description: 'Whether user email is verified' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_webhook.ts]---
Location: sim-main/apps/sim/tools/discord/get_webhook.ts

```typescript
import type { DiscordGetWebhookParams, DiscordGetWebhookResponse } from '@/tools/discord/types'
import type { ToolConfig } from '@/tools/types'

export const discordGetWebhookTool: ToolConfig<DiscordGetWebhookParams, DiscordGetWebhookResponse> =
  {
    id: 'discord_get_webhook',
    name: 'Discord Get Webhook',
    description: 'Get information about a Discord webhook',
    version: '1.0.0',

    params: {
      botToken: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'The bot token for authentication',
      },
      webhookId: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'The webhook ID to retrieve',
      },
      serverId: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'The Discord server ID (guild ID)',
      },
    },

    request: {
      url: (params: DiscordGetWebhookParams) => {
        return `https://discord.com/api/v10/webhooks/${params.webhookId}`
      },
      method: 'GET',
      headers: (params) => ({
        Authorization: `Bot ${params.botToken}`,
      }),
    },

    transformResponse: async (response) => {
      const data = await response.json()
      return {
        success: true,
        output: {
          message: 'Webhook information retrieved successfully',
          data,
        },
      }
    },

    outputs: {
      message: { type: 'string', description: 'Success or error message' },
      data: {
        type: 'object',
        description: 'Webhook data',
        properties: {
          id: { type: 'string', description: 'Webhook ID' },
          name: { type: 'string', description: 'Webhook name' },
          channel_id: { type: 'string', description: 'Channel ID' },
          guild_id: { type: 'string', description: 'Server ID' },
          token: { type: 'string', description: 'Webhook token' },
        },
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/discord/index.ts

```typescript
import { discordAddReactionTool } from '@/tools/discord/add_reaction'
import { discordArchiveThreadTool } from '@/tools/discord/archive_thread'
import { discordAssignRoleTool } from '@/tools/discord/assign_role'
import { discordBanMemberTool } from '@/tools/discord/ban_member'
import { discordCreateChannelTool } from '@/tools/discord/create_channel'
import { discordCreateInviteTool } from '@/tools/discord/create_invite'
import { discordCreateRoleTool } from '@/tools/discord/create_role'
import { discordCreateThreadTool } from '@/tools/discord/create_thread'
import { discordCreateWebhookTool } from '@/tools/discord/create_webhook'
import { discordDeleteChannelTool } from '@/tools/discord/delete_channel'
import { discordDeleteInviteTool } from '@/tools/discord/delete_invite'
import { discordDeleteMessageTool } from '@/tools/discord/delete_message'
import { discordDeleteRoleTool } from '@/tools/discord/delete_role'
import { discordDeleteWebhookTool } from '@/tools/discord/delete_webhook'
import { discordEditMessageTool } from '@/tools/discord/edit_message'
import { discordExecuteWebhookTool } from '@/tools/discord/execute_webhook'
import { discordGetChannelTool } from '@/tools/discord/get_channel'
import { discordGetInviteTool } from '@/tools/discord/get_invite'
import { discordGetMemberTool } from '@/tools/discord/get_member'
import { discordGetMessagesTool } from '@/tools/discord/get_messages'
import { discordGetServerTool } from '@/tools/discord/get_server'
import { discordGetUserTool } from '@/tools/discord/get_user'
import { discordGetWebhookTool } from '@/tools/discord/get_webhook'
import { discordJoinThreadTool } from '@/tools/discord/join_thread'
import { discordKickMemberTool } from '@/tools/discord/kick_member'
import { discordLeaveThreadTool } from '@/tools/discord/leave_thread'
import { discordPinMessageTool } from '@/tools/discord/pin_message'
import { discordRemoveReactionTool } from '@/tools/discord/remove_reaction'
import { discordRemoveRoleTool } from '@/tools/discord/remove_role'
import { discordSendMessageTool } from '@/tools/discord/send_message'
import { discordUnbanMemberTool } from '@/tools/discord/unban_member'
import { discordUnpinMessageTool } from '@/tools/discord/unpin_message'
import { discordUpdateChannelTool } from '@/tools/discord/update_channel'
import { discordUpdateMemberTool } from '@/tools/discord/update_member'
import { discordUpdateRoleTool } from '@/tools/discord/update_role'

export {
  discordSendMessageTool,
  discordGetMessagesTool,
  discordGetServerTool,
  discordGetUserTool,
  discordEditMessageTool,
  discordDeleteMessageTool,
  discordAddReactionTool,
  discordRemoveReactionTool,
  discordPinMessageTool,
  discordUnpinMessageTool,
  discordCreateThreadTool,
  discordJoinThreadTool,
  discordLeaveThreadTool,
  discordArchiveThreadTool,
  discordCreateChannelTool,
  discordUpdateChannelTool,
  discordDeleteChannelTool,
  discordGetChannelTool,
  discordCreateRoleTool,
  discordUpdateRoleTool,
  discordDeleteRoleTool,
  discordAssignRoleTool,
  discordRemoveRoleTool,
  discordKickMemberTool,
  discordBanMemberTool,
  discordUnbanMemberTool,
  discordGetMemberTool,
  discordUpdateMemberTool,
  discordCreateInviteTool,
  discordGetInviteTool,
  discordDeleteInviteTool,
  discordCreateWebhookTool,
  discordExecuteWebhookTool,
  discordGetWebhookTool,
  discordDeleteWebhookTool,
}
```

--------------------------------------------------------------------------------

---[FILE: join_thread.ts]---
Location: sim-main/apps/sim/tools/discord/join_thread.ts

```typescript
import type { DiscordJoinThreadParams, DiscordJoinThreadResponse } from '@/tools/discord/types'
import type { ToolConfig } from '@/tools/types'

export const discordJoinThreadTool: ToolConfig<DiscordJoinThreadParams, DiscordJoinThreadResponse> =
  {
    id: 'discord_join_thread',
    name: 'Discord Join Thread',
    description: 'Join a thread in Discord',
    version: '1.0.0',

    params: {
      botToken: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'The bot token for authentication',
      },
      threadId: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description: 'The thread ID to join',
      },
      serverId: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'The Discord server ID (guild ID)',
      },
    },

    request: {
      url: (params: DiscordJoinThreadParams) => {
        return `https://discord.com/api/v10/channels/${params.threadId}/thread-members/@me`
      },
      method: 'PUT',
      headers: (params) => ({
        Authorization: `Bot ${params.botToken}`,
      }),
    },

    transformResponse: async (response) => {
      return {
        success: true,
        output: {
          message: 'Joined thread successfully',
        },
      }
    },

    outputs: {
      message: { type: 'string', description: 'Success or error message' },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: kick_member.ts]---
Location: sim-main/apps/sim/tools/discord/kick_member.ts

```typescript
import type { DiscordKickMemberParams, DiscordKickMemberResponse } from '@/tools/discord/types'
import type { ToolConfig } from '@/tools/types'

export const discordKickMemberTool: ToolConfig<DiscordKickMemberParams, DiscordKickMemberResponse> =
  {
    id: 'discord_kick_member',
    name: 'Discord Kick Member',
    description: 'Kick a member from a Discord server',
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
        description: 'The user ID to kick',
      },
      reason: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Reason for kicking the member',
      },
    },

    request: {
      url: (params: DiscordKickMemberParams) => {
        return `https://discord.com/api/v10/guilds/${params.serverId}/members/${params.userId}`
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
          message: 'Member kicked successfully',
        },
      }
    },

    outputs: {
      message: { type: 'string', description: 'Success or error message' },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: leave_thread.ts]---
Location: sim-main/apps/sim/tools/discord/leave_thread.ts

```typescript
import type { DiscordLeaveThreadParams, DiscordLeaveThreadResponse } from '@/tools/discord/types'
import type { ToolConfig } from '@/tools/types'

export const discordLeaveThreadTool: ToolConfig<
  DiscordLeaveThreadParams,
  DiscordLeaveThreadResponse
> = {
  id: 'discord_leave_thread',
  name: 'Discord Leave Thread',
  description: 'Leave a thread in Discord',
  version: '1.0.0',

  params: {
    botToken: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The bot token for authentication',
    },
    threadId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The thread ID to leave',
    },
    serverId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The Discord server ID (guild ID)',
    },
  },

  request: {
    url: (params: DiscordLeaveThreadParams) => {
      return `https://discord.com/api/v10/channels/${params.threadId}/thread-members/@me`
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
        message: 'Left thread successfully',
      },
    }
  },

  outputs: {
    message: { type: 'string', description: 'Success or error message' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: pin_message.ts]---
Location: sim-main/apps/sim/tools/discord/pin_message.ts

```typescript
import type { DiscordPinMessageParams, DiscordPinMessageResponse } from '@/tools/discord/types'
import type { ToolConfig } from '@/tools/types'

export const discordPinMessageTool: ToolConfig<DiscordPinMessageParams, DiscordPinMessageResponse> =
  {
    id: 'discord_pin_message',
    name: 'Discord Pin Message',
    description: 'Pin a message in a Discord channel',
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
        description: 'The ID of the message to pin',
      },
      serverId: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'The Discord server ID (guild ID)',
      },
    },

    request: {
      url: (params: DiscordPinMessageParams) => {
        return `https://discord.com/api/v10/channels/${params.channelId}/pins/${params.messageId}`
      },
      method: 'PUT',
      headers: (params) => ({
        Authorization: `Bot ${params.botToken}`,
      }),
    },

    transformResponse: async (response) => {
      return {
        success: true,
        output: {
          message: 'Message pinned successfully',
        },
      }
    },

    outputs: {
      message: { type: 'string', description: 'Success or error message' },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: remove_reaction.ts]---
Location: sim-main/apps/sim/tools/discord/remove_reaction.ts

```typescript
import type {
  DiscordRemoveReactionParams,
  DiscordRemoveReactionResponse,
} from '@/tools/discord/types'
import type { ToolConfig } from '@/tools/types'

export const discordRemoveReactionTool: ToolConfig<
  DiscordRemoveReactionParams,
  DiscordRemoveReactionResponse
> = {
  id: 'discord_remove_reaction',
  name: 'Discord Remove Reaction',
  description: 'Remove a reaction from a Discord message',
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
      description: 'The ID of the message with the reaction',
    },
    emoji: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The emoji to remove (unicode emoji or custom emoji in name:id format)',
    },
    userId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: "The user ID whose reaction to remove (omit to remove bot's own reaction)",
    },
    serverId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The Discord server ID (guild ID)',
    },
  },

  request: {
    url: (params: DiscordRemoveReactionParams) => {
      const encodedEmoji = encodeURIComponent(params.emoji)
      const userPart = params.userId ? `/${params.userId}` : '/@me'
      return `https://discord.com/api/v10/channels/${params.channelId}/messages/${params.messageId}/reactions/${encodedEmoji}${userPart}`
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
        message: 'Reaction removed successfully',
      },
    }
  },

  outputs: {
    message: { type: 'string', description: 'Success or error message' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: remove_role.ts]---
Location: sim-main/apps/sim/tools/discord/remove_role.ts

```typescript
import type { DiscordRemoveRoleParams, DiscordRemoveRoleResponse } from '@/tools/discord/types'
import type { ToolConfig } from '@/tools/types'

export const discordRemoveRoleTool: ToolConfig<DiscordRemoveRoleParams, DiscordRemoveRoleResponse> =
  {
    id: 'discord_remove_role',
    name: 'Discord Remove Role',
    description: 'Remove a role from a member in a Discord server',
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
        description: 'The user ID to remove the role from',
      },
      roleId: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description: 'The role ID to remove',
      },
    },

    request: {
      url: (params: DiscordRemoveRoleParams) => {
        return `https://discord.com/api/v10/guilds/${params.serverId}/members/${params.userId}/roles/${params.roleId}`
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
          message: 'Role removed successfully',
        },
      }
    },

    outputs: {
      message: { type: 'string', description: 'Success or error message' },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: send_message.ts]---
Location: sim-main/apps/sim/tools/discord/send_message.ts

```typescript
import type { DiscordSendMessageParams, DiscordSendMessageResponse } from '@/tools/discord/types'
import type { ToolConfig } from '@/tools/types'

export const discordSendMessageTool: ToolConfig<
  DiscordSendMessageParams,
  DiscordSendMessageResponse
> = {
  id: 'discord_send_message',
  name: 'Discord Send Message',
  description: 'Send a message to a Discord channel',
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
      description: 'The Discord channel ID to send the message to',
    },
    content: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'The text content of the message',
    },
    serverId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The Discord server ID (guild ID)',
    },
    files: {
      type: 'file[]',
      required: false,
      visibility: 'user-only',
      description: 'Files to attach to the message',
    },
  },

  request: {
    url: '/api/tools/discord/send-message',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params: DiscordSendMessageParams) => {
      return {
        botToken: params.botToken,
        channelId: params.channelId,
        content: params.content || 'Message sent from Sim',
        files: params.files || null,
      }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()
    if (!data.success) {
      throw new Error(data.error || 'Failed to send Discord message')
    }
    return {
      success: true,
      output: data.output,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Success or error message' },
    data: {
      type: 'object',
      description: 'Discord message data',
      properties: {
        id: { type: 'string', description: 'Message ID' },
        content: { type: 'string', description: 'Message content' },
        channel_id: { type: 'string', description: 'Channel ID where message was sent' },
        author: {
          type: 'object',
          description: 'Message author information',
          properties: {
            id: { type: 'string', description: 'Author user ID' },
            username: { type: 'string', description: 'Author username' },
            avatar: { type: 'string', description: 'Author avatar hash' },
            bot: { type: 'boolean', description: 'Whether author is a bot' },
          },
        },
        timestamp: { type: 'string', description: 'Message timestamp' },
        edited_timestamp: { type: 'string', description: 'Message edited timestamp' },
        embeds: { type: 'array', description: 'Message embeds' },
        attachments: { type: 'array', description: 'Message attachments' },
        mentions: { type: 'array', description: 'User mentions in message' },
        mention_roles: { type: 'array', description: 'Role mentions in message' },
        mention_everyone: { type: 'boolean', description: 'Whether message mentions everyone' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

````
