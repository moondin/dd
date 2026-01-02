---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 662
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 662 of 933)

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

---[FILE: add_reaction.ts]---
Location: sim-main/apps/sim/tools/discord/add_reaction.ts

```typescript
import type { DiscordAddReactionParams, DiscordAddReactionResponse } from '@/tools/discord/types'
import type { ToolConfig } from '@/tools/types'

export const discordAddReactionTool: ToolConfig<
  DiscordAddReactionParams,
  DiscordAddReactionResponse
> = {
  id: 'discord_add_reaction',
  name: 'Discord Add Reaction',
  description: 'Add a reaction emoji to a Discord message',
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
      description: 'The ID of the message to react to',
    },
    emoji: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The emoji to react with (unicode emoji or custom emoji in name:id format)',
    },
    serverId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The Discord server ID (guild ID)',
    },
  },

  request: {
    url: (params: DiscordAddReactionParams) => {
      const encodedEmoji = encodeURIComponent(params.emoji)
      return `https://discord.com/api/v10/channels/${params.channelId}/messages/${params.messageId}/reactions/${encodedEmoji}/@me`
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
        message: 'Reaction added successfully',
      },
    }
  },

  outputs: {
    message: { type: 'string', description: 'Success or error message' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: archive_thread.ts]---
Location: sim-main/apps/sim/tools/discord/archive_thread.ts

```typescript
import type {
  DiscordArchiveThreadParams,
  DiscordArchiveThreadResponse,
} from '@/tools/discord/types'
import type { ToolConfig } from '@/tools/types'

export const discordArchiveThreadTool: ToolConfig<
  DiscordArchiveThreadParams,
  DiscordArchiveThreadResponse
> = {
  id: 'discord_archive_thread',
  name: 'Discord Archive Thread',
  description: 'Archive or unarchive a thread in Discord',
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
      description: 'The thread ID to archive/unarchive',
    },
    archived: {
      type: 'boolean',
      required: true,
      visibility: 'user-or-llm',
      description: 'Whether to archive (true) or unarchive (false) the thread',
    },
    serverId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The Discord server ID (guild ID)',
    },
  },

  request: {
    url: (params: DiscordArchiveThreadParams) => {
      return `https://discord.com/api/v10/channels/${params.threadId}`
    },
    method: 'PATCH',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bot ${params.botToken}`,
    }),
    body: (params: DiscordArchiveThreadParams) => {
      return {
        archived: params.archived,
      }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        message: data.archived ? 'Thread archived successfully' : 'Thread unarchived successfully',
        data,
      },
    }
  },

  outputs: {
    message: { type: 'string', description: 'Success or error message' },
    data: {
      type: 'object',
      description: 'Updated thread data',
      properties: {
        id: { type: 'string', description: 'Thread ID' },
        archived: { type: 'boolean', description: 'Whether thread is archived' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: assign_role.ts]---
Location: sim-main/apps/sim/tools/discord/assign_role.ts

```typescript
import type { DiscordAssignRoleParams, DiscordAssignRoleResponse } from '@/tools/discord/types'
import type { ToolConfig } from '@/tools/types'

export const discordAssignRoleTool: ToolConfig<DiscordAssignRoleParams, DiscordAssignRoleResponse> =
  {
    id: 'discord_assign_role',
    name: 'Discord Assign Role',
    description: 'Assign a role to a member in a Discord server',
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
        description: 'The user ID to assign the role to',
      },
      roleId: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description: 'The role ID to assign',
      },
    },

    request: {
      url: (params: DiscordAssignRoleParams) => {
        return `https://discord.com/api/v10/guilds/${params.serverId}/members/${params.userId}/roles/${params.roleId}`
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
          message: 'Role assigned successfully',
        },
      }
    },

    outputs: {
      message: { type: 'string', description: 'Success or error message' },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: ban_member.ts]---
Location: sim-main/apps/sim/tools/discord/ban_member.ts

```typescript
import type { DiscordBanMemberParams, DiscordBanMemberResponse } from '@/tools/discord/types'
import type { ToolConfig } from '@/tools/types'

export const discordBanMemberTool: ToolConfig<DiscordBanMemberParams, DiscordBanMemberResponse> = {
  id: 'discord_ban_member',
  name: 'Discord Ban Member',
  description: 'Ban a member from a Discord server',
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
      description: 'The user ID to ban',
    },
    reason: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Reason for banning the member',
    },
    deleteMessageDays: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Number of days to delete messages for (0-7)',
    },
  },

  request: {
    url: (params: DiscordBanMemberParams) => {
      return `https://discord.com/api/v10/guilds/${params.serverId}/bans/${params.userId}`
    },
    method: 'PUT',
    headers: (params) => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Authorization: `Bot ${params.botToken}`,
      }
      if (params.reason) {
        headers['X-Audit-Log-Reason'] = encodeURIComponent(params.reason)
      }
      return headers
    },
    body: (params: DiscordBanMemberParams) => {
      const body: any = {}
      if (params.deleteMessageDays !== undefined) {
        body.delete_message_days = Number(params.deleteMessageDays)
      }
      return body
    },
  },

  transformResponse: async (response) => {
    return {
      success: true,
      output: {
        message: 'Member banned successfully',
      },
    }
  },

  outputs: {
    message: { type: 'string', description: 'Success or error message' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_channel.ts]---
Location: sim-main/apps/sim/tools/discord/create_channel.ts

```typescript
import type {
  DiscordCreateChannelParams,
  DiscordCreateChannelResponse,
} from '@/tools/discord/types'
import type { ToolConfig } from '@/tools/types'

export const discordCreateChannelTool: ToolConfig<
  DiscordCreateChannelParams,
  DiscordCreateChannelResponse
> = {
  id: 'discord_create_channel',
  name: 'Discord Create Channel',
  description: 'Create a new channel in a Discord server',
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
    name: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The name of the channel (1-100 characters)',
    },
    type: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Channel type (0=text, 2=voice, 4=category, 5=announcement, 13=stage)',
    },
    topic: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Channel topic (0-1024 characters)',
    },
    parentId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Parent category ID for the channel',
    },
  },

  request: {
    url: (params: DiscordCreateChannelParams) => {
      return `https://discord.com/api/v10/guilds/${params.serverId}/channels`
    },
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bot ${params.botToken}`,
    }),
    body: (params: DiscordCreateChannelParams) => {
      const body: any = {
        name: params.name,
      }
      if (params.type !== undefined) body.type = Number(params.type)
      if (params.topic) body.topic = params.topic
      if (params.parentId) body.parent_id = params.parentId
      return body
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        message: 'Channel created successfully',
        data,
      },
    }
  },

  outputs: {
    message: { type: 'string', description: 'Success or error message' },
    data: {
      type: 'object',
      description: 'Created channel data',
      properties: {
        id: { type: 'string', description: 'Channel ID' },
        name: { type: 'string', description: 'Channel name' },
        type: { type: 'number', description: 'Channel type' },
        guild_id: { type: 'string', description: 'Server ID' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_invite.ts]---
Location: sim-main/apps/sim/tools/discord/create_invite.ts

```typescript
import type { DiscordCreateInviteParams, DiscordCreateInviteResponse } from '@/tools/discord/types'
import type { ToolConfig } from '@/tools/types'

export const discordCreateInviteTool: ToolConfig<
  DiscordCreateInviteParams,
  DiscordCreateInviteResponse
> = {
  id: 'discord_create_invite',
  name: 'Discord Create Invite',
  description: 'Create an invite link for a Discord channel',
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
      description: 'The Discord channel ID to create an invite for',
    },
    maxAge: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Duration of invite in seconds (0 = never expires, default 86400)',
    },
    maxUses: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Max number of uses (0 = unlimited, default 0)',
    },
    temporary: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Whether invite grants temporary membership',
    },
    serverId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The Discord server ID (guild ID)',
    },
  },

  request: {
    url: (params: DiscordCreateInviteParams) => {
      return `https://discord.com/api/v10/channels/${params.channelId}/invites`
    },
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bot ${params.botToken}`,
    }),
    body: (params: DiscordCreateInviteParams) => {
      const body: any = {}
      if (params.maxAge !== undefined) body.max_age = Number(params.maxAge)
      if (params.maxUses !== undefined) body.max_uses = Number(params.maxUses)
      if (params.temporary !== undefined) body.temporary = params.temporary
      return body
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        message: 'Invite created successfully',
        data,
      },
    }
  },

  outputs: {
    message: { type: 'string', description: 'Success or error message' },
    data: {
      type: 'object',
      description: 'Created invite data',
      properties: {
        code: { type: 'string', description: 'Invite code' },
        url: { type: 'string', description: 'Full invite URL' },
        max_age: { type: 'number', description: 'Max age in seconds' },
        max_uses: { type: 'number', description: 'Max uses' },
        temporary: { type: 'boolean', description: 'Whether temporary' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_role.ts]---
Location: sim-main/apps/sim/tools/discord/create_role.ts

```typescript
import type { DiscordCreateRoleParams, DiscordCreateRoleResponse } from '@/tools/discord/types'
import type { ToolConfig } from '@/tools/types'

export const discordCreateRoleTool: ToolConfig<DiscordCreateRoleParams, DiscordCreateRoleResponse> =
  {
    id: 'discord_create_role',
    name: 'Discord Create Role',
    description: 'Create a new role in a Discord server',
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
      name: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description: 'The name of the role',
      },
      color: {
        type: 'number',
        required: false,
        visibility: 'user-or-llm',
        description: 'RGB color value as integer (e.g., 0xFF0000 for red)',
      },
      hoist: {
        type: 'boolean',
        required: false,
        visibility: 'user-or-llm',
        description: 'Whether to display role members separately from online members',
      },
      mentionable: {
        type: 'boolean',
        required: false,
        visibility: 'user-or-llm',
        description: 'Whether the role can be mentioned',
      },
    },

    request: {
      url: (params: DiscordCreateRoleParams) => {
        return `https://discord.com/api/v10/guilds/${params.serverId}/roles`
      },
      method: 'POST',
      headers: (params) => ({
        'Content-Type': 'application/json',
        Authorization: `Bot ${params.botToken}`,
      }),
      body: (params: DiscordCreateRoleParams) => {
        const body: any = {
          name: params.name,
        }
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
          message: 'Role created successfully',
          data,
        },
      }
    },

    outputs: {
      message: { type: 'string', description: 'Success or error message' },
      data: {
        type: 'object',
        description: 'Created role data',
        properties: {
          id: { type: 'string', description: 'Role ID' },
          name: { type: 'string', description: 'Role name' },
          color: { type: 'number', description: 'Role color' },
          hoist: { type: 'boolean', description: 'Whether role is hoisted' },
          mentionable: { type: 'boolean', description: 'Whether role is mentionable' },
        },
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: create_thread.ts]---
Location: sim-main/apps/sim/tools/discord/create_thread.ts

```typescript
import type { DiscordCreateThreadParams, DiscordCreateThreadResponse } from '@/tools/discord/types'
import type { ToolConfig } from '@/tools/types'

export const discordCreateThreadTool: ToolConfig<
  DiscordCreateThreadParams,
  DiscordCreateThreadResponse
> = {
  id: 'discord_create_thread',
  name: 'Discord Create Thread',
  description: 'Create a thread in a Discord channel',
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
      description: 'The Discord channel ID to create the thread in',
    },
    name: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The name of the thread (1-100 characters)',
    },
    messageId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'The message ID to create a thread from (if creating from existing message)',
    },
    autoArchiveDuration: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Duration in minutes to auto-archive the thread (60, 1440, 4320, 10080)',
    },
    serverId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The Discord server ID (guild ID)',
    },
  },

  request: {
    url: (params: DiscordCreateThreadParams) => {
      if (params.messageId) {
        return `https://discord.com/api/v10/channels/${params.channelId}/messages/${params.messageId}/threads`
      }
      return `https://discord.com/api/v10/channels/${params.channelId}/threads`
    },
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bot ${params.botToken}`,
    }),
    body: (params: DiscordCreateThreadParams) => {
      const body: any = {
        name: params.name,
      }
      if (params.autoArchiveDuration) {
        body.auto_archive_duration = Number(params.autoArchiveDuration)
      }
      return body
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        message: 'Thread created successfully',
        data,
      },
    }
  },

  outputs: {
    message: { type: 'string', description: 'Success or error message' },
    data: {
      type: 'object',
      description: 'Created thread data',
      properties: {
        id: { type: 'string', description: 'Thread ID' },
        name: { type: 'string', description: 'Thread name' },
        type: { type: 'number', description: 'Thread channel type' },
        guild_id: { type: 'string', description: 'Server ID' },
        parent_id: { type: 'string', description: 'Parent channel ID' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_webhook.ts]---
Location: sim-main/apps/sim/tools/discord/create_webhook.ts

```typescript
import type {
  DiscordCreateWebhookParams,
  DiscordCreateWebhookResponse,
} from '@/tools/discord/types'
import type { ToolConfig } from '@/tools/types'

export const discordCreateWebhookTool: ToolConfig<
  DiscordCreateWebhookParams,
  DiscordCreateWebhookResponse
> = {
  id: 'discord_create_webhook',
  name: 'Discord Create Webhook',
  description: 'Create a webhook in a Discord channel',
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
      description: 'The Discord channel ID to create the webhook in',
    },
    name: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Name of the webhook (1-80 characters)',
    },
    serverId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The Discord server ID (guild ID)',
    },
  },

  request: {
    url: (params: DiscordCreateWebhookParams) => {
      return `https://discord.com/api/v10/channels/${params.channelId}/webhooks`
    },
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bot ${params.botToken}`,
    }),
    body: (params: DiscordCreateWebhookParams) => {
      return {
        name: params.name,
      }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        message: 'Webhook created successfully',
        data,
      },
    }
  },

  outputs: {
    message: { type: 'string', description: 'Success or error message' },
    data: {
      type: 'object',
      description: 'Created webhook data',
      properties: {
        id: { type: 'string', description: 'Webhook ID' },
        name: { type: 'string', description: 'Webhook name' },
        token: { type: 'string', description: 'Webhook token' },
        url: { type: 'string', description: 'Webhook URL' },
        channel_id: { type: 'string', description: 'Channel ID' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_channel.ts]---
Location: sim-main/apps/sim/tools/discord/delete_channel.ts

```typescript
import type {
  DiscordDeleteChannelParams,
  DiscordDeleteChannelResponse,
} from '@/tools/discord/types'
import type { ToolConfig } from '@/tools/types'

export const discordDeleteChannelTool: ToolConfig<
  DiscordDeleteChannelParams,
  DiscordDeleteChannelResponse
> = {
  id: 'discord_delete_channel',
  name: 'Discord Delete Channel',
  description: 'Delete a Discord channel',
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
      visibility: 'user-or-llm',
      description: 'The Discord channel ID to delete',
    },
    serverId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The Discord server ID (guild ID)',
    },
  },

  request: {
    url: (params: DiscordDeleteChannelParams) => {
      return `https://discord.com/api/v10/channels/${params.channelId}`
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
        message: 'Channel deleted successfully',
      },
    }
  },

  outputs: {
    message: { type: 'string', description: 'Success or error message' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_invite.ts]---
Location: sim-main/apps/sim/tools/discord/delete_invite.ts

```typescript
import type { DiscordDeleteInviteParams, DiscordDeleteInviteResponse } from '@/tools/discord/types'
import type { ToolConfig } from '@/tools/types'

export const discordDeleteInviteTool: ToolConfig<
  DiscordDeleteInviteParams,
  DiscordDeleteInviteResponse
> = {
  id: 'discord_delete_invite',
  name: 'Discord Delete Invite',
  description: 'Delete a Discord invite',
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
      description: 'The invite code to delete',
    },
    serverId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The Discord server ID (guild ID)',
    },
  },

  request: {
    url: (params: DiscordDeleteInviteParams) => {
      return `https://discord.com/api/v10/invites/${params.inviteCode}`
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
        message: 'Invite deleted successfully',
      },
    }
  },

  outputs: {
    message: { type: 'string', description: 'Success or error message' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_message.ts]---
Location: sim-main/apps/sim/tools/discord/delete_message.ts

```typescript
import type {
  DiscordDeleteMessageParams,
  DiscordDeleteMessageResponse,
} from '@/tools/discord/types'
import type { ToolConfig } from '@/tools/types'

export const discordDeleteMessageTool: ToolConfig<
  DiscordDeleteMessageParams,
  DiscordDeleteMessageResponse
> = {
  id: 'discord_delete_message',
  name: 'Discord Delete Message',
  description: 'Delete a message from a Discord channel',
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
      description: 'The ID of the message to delete',
    },
    serverId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The Discord server ID (guild ID)',
    },
  },

  request: {
    url: (params: DiscordDeleteMessageParams) => {
      return `https://discord.com/api/v10/channels/${params.channelId}/messages/${params.messageId}`
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
        message: 'Message deleted successfully',
      },
    }
  },

  outputs: {
    message: { type: 'string', description: 'Success or error message' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_role.ts]---
Location: sim-main/apps/sim/tools/discord/delete_role.ts

```typescript
import type { DiscordDeleteRoleParams, DiscordDeleteRoleResponse } from '@/tools/discord/types'
import type { ToolConfig } from '@/tools/types'

export const discordDeleteRoleTool: ToolConfig<DiscordDeleteRoleParams, DiscordDeleteRoleResponse> =
  {
    id: 'discord_delete_role',
    name: 'Discord Delete Role',
    description: 'Delete a role from a Discord server',
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
        description: 'The role ID to delete',
      },
    },

    request: {
      url: (params: DiscordDeleteRoleParams) => {
        return `https://discord.com/api/v10/guilds/${params.serverId}/roles/${params.roleId}`
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
          message: 'Role deleted successfully',
        },
      }
    },

    outputs: {
      message: { type: 'string', description: 'Success or error message' },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: delete_webhook.ts]---
Location: sim-main/apps/sim/tools/discord/delete_webhook.ts

```typescript
import type {
  DiscordDeleteWebhookParams,
  DiscordDeleteWebhookResponse,
} from '@/tools/discord/types'
import type { ToolConfig } from '@/tools/types'

export const discordDeleteWebhookTool: ToolConfig<
  DiscordDeleteWebhookParams,
  DiscordDeleteWebhookResponse
> = {
  id: 'discord_delete_webhook',
  name: 'Discord Delete Webhook',
  description: 'Delete a Discord webhook',
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
      visibility: 'user-or-llm',
      description: 'The webhook ID to delete',
    },
    serverId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The Discord server ID (guild ID)',
    },
  },

  request: {
    url: (params: DiscordDeleteWebhookParams) => {
      return `https://discord.com/api/v10/webhooks/${params.webhookId}`
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
        message: 'Webhook deleted successfully',
      },
    }
  },

  outputs: {
    message: { type: 'string', description: 'Success or error message' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: edit_message.ts]---
Location: sim-main/apps/sim/tools/discord/edit_message.ts

```typescript
import type { DiscordEditMessageParams, DiscordEditMessageResponse } from '@/tools/discord/types'
import type { ToolConfig } from '@/tools/types'

export const discordEditMessageTool: ToolConfig<
  DiscordEditMessageParams,
  DiscordEditMessageResponse
> = {
  id: 'discord_edit_message',
  name: 'Discord Edit Message',
  description: 'Edit an existing message in a Discord channel',
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
      description: 'The ID of the message to edit',
    },
    content: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'The new text content for the message',
    },
    serverId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The Discord server ID (guild ID)',
    },
  },

  request: {
    url: (params: DiscordEditMessageParams) => {
      return `https://discord.com/api/v10/channels/${params.channelId}/messages/${params.messageId}`
    },
    method: 'PATCH',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bot ${params.botToken}`,
    }),
    body: (params: DiscordEditMessageParams) => {
      const body: any = {}
      if (params.content !== undefined && params.content !== null && params.content !== '') {
        body.content = params.content
      }
      return body
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        message: 'Message edited successfully',
        data,
      },
    }
  },

  outputs: {
    message: { type: 'string', description: 'Success or error message' },
    data: {
      type: 'object',
      description: 'Updated Discord message data',
      properties: {
        id: { type: 'string', description: 'Message ID' },
        content: { type: 'string', description: 'Updated message content' },
        channel_id: { type: 'string', description: 'Channel ID' },
        edited_timestamp: { type: 'string', description: 'Message edited timestamp' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: execute_webhook.ts]---
Location: sim-main/apps/sim/tools/discord/execute_webhook.ts

```typescript
import type {
  DiscordExecuteWebhookParams,
  DiscordExecuteWebhookResponse,
} from '@/tools/discord/types'
import type { ToolConfig } from '@/tools/types'

export const discordExecuteWebhookTool: ToolConfig<
  DiscordExecuteWebhookParams,
  DiscordExecuteWebhookResponse
> = {
  id: 'discord_execute_webhook',
  name: 'Discord Execute Webhook',
  description: 'Execute a Discord webhook to send a message',
  version: '1.0.0',

  params: {
    webhookId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The webhook ID',
    },
    webhookToken: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The webhook token',
    },
    content: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The message content to send',
    },
    username: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Override the default username of the webhook',
    },
    serverId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The Discord server ID (guild ID)',
    },
  },

  request: {
    url: (params: DiscordExecuteWebhookParams) => {
      return `https://discord.com/api/v10/webhooks/${params.webhookId}/${params.webhookToken}?wait=true`
    },
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params: DiscordExecuteWebhookParams) => {
      const body: any = {
        content: params.content,
      }
      if (params.username) body.username = params.username
      return body
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        message: 'Webhook executed successfully',
        data,
      },
    }
  },

  outputs: {
    message: { type: 'string', description: 'Success or error message' },
    data: {
      type: 'object',
      description: 'Message sent via webhook',
      properties: {
        id: { type: 'string', description: 'Message ID' },
        content: { type: 'string', description: 'Message content' },
        channel_id: { type: 'string', description: 'Channel ID' },
        timestamp: { type: 'string', description: 'Message timestamp' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_channel.ts]---
Location: sim-main/apps/sim/tools/discord/get_channel.ts

```typescript
import type { DiscordGetChannelParams, DiscordGetChannelResponse } from '@/tools/discord/types'
import type { ToolConfig } from '@/tools/types'

export const discordGetChannelTool: ToolConfig<DiscordGetChannelParams, DiscordGetChannelResponse> =
  {
    id: 'discord_get_channel',
    name: 'Discord Get Channel',
    description: 'Get information about a Discord channel',
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
        description: 'The Discord channel ID to retrieve',
      },
      serverId: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'The Discord server ID (guild ID)',
      },
    },

    request: {
      url: (params: DiscordGetChannelParams) => {
        return `https://discord.com/api/v10/channels/${params.channelId}`
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
          message: 'Channel information retrieved successfully',
          data,
        },
      }
    },

    outputs: {
      message: { type: 'string', description: 'Success or error message' },
      data: {
        type: 'object',
        description: 'Channel data',
        properties: {
          id: { type: 'string', description: 'Channel ID' },
          name: { type: 'string', description: 'Channel name' },
          type: { type: 'number', description: 'Channel type' },
          topic: { type: 'string', description: 'Channel topic' },
          guild_id: { type: 'string', description: 'Server ID' },
        },
      },
    },
  }
```

--------------------------------------------------------------------------------

````
