---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 753
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 753 of 933)

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

---[FILE: update_product.ts]---
Location: sim-main/apps/sim/tools/shopify/update_product.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { ShopifyProductResponse, ShopifyUpdateProductParams } from './types'

export const shopifyUpdateProductTool: ToolConfig<
  ShopifyUpdateProductParams,
  ShopifyProductResponse
> = {
  id: 'shopify_update_product',
  name: 'Shopify Update Product',
  description: 'Update an existing product in your Shopify store',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'shopify',
  },

  params: {
    shopDomain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Shopify store domain (e.g., mystore.myshopify.com)',
    },
    productId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Product ID to update (gid://shopify/Product/123456789)',
    },
    title: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New product title',
    },
    descriptionHtml: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New product description (HTML)',
    },
    vendor: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New product vendor/brand',
    },
    productType: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New product type/category',
    },
    tags: {
      type: 'array',
      required: false,
      visibility: 'user-or-llm',
      description: 'New product tags',
    },
    status: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New product status (ACTIVE, DRAFT, ARCHIVED)',
    },
  },

  request: {
    url: (params) =>
      `https://${params.shopDomain || params.idToken}/admin/api/2024-10/graphql.json`,
    method: 'POST',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Missing access token for Shopify API request')
      }
      return {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': params.accessToken,
      }
    },
    body: (params) => {
      if (!params.productId) {
        throw new Error('Product ID is required to update a product')
      }

      const input: Record<string, unknown> = {
        id: params.productId,
      }

      if (params.title !== undefined) {
        input.title = params.title
      }
      if (params.descriptionHtml !== undefined) {
        input.descriptionHtml = params.descriptionHtml
      }
      if (params.vendor !== undefined) {
        input.vendor = params.vendor
      }
      if (params.productType !== undefined) {
        input.productType = params.productType
      }
      if (params.tags !== undefined) {
        input.tags = params.tags
      }
      if (params.status !== undefined) {
        input.status = params.status
      }

      return {
        query: `
          mutation productUpdate($input: ProductInput!) {
            productUpdate(input: $input) {
              product {
                id
                title
                handle
                descriptionHtml
                vendor
                productType
                tags
                status
                createdAt
                updatedAt
                variants(first: 10) {
                  edges {
                    node {
                      id
                      title
                      price
                      compareAtPrice
                      sku
                      inventoryQuantity
                    }
                  }
                }
                images(first: 10) {
                  edges {
                    node {
                      id
                      url
                      altText
                    }
                  }
                }
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
        variables: {
          input,
        },
      }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to update product',
        output: {},
      }
    }

    const result = data.data?.productUpdate
    if (result?.userErrors?.length > 0) {
      return {
        success: false,
        error: result.userErrors.map((e: { message: string }) => e.message).join(', '),
        output: {},
      }
    }

    const product = result?.product
    if (!product) {
      return {
        success: false,
        error: 'Product update was not successful',
        output: {},
      }
    }

    return {
      success: true,
      output: {
        product,
      },
    }
  },

  outputs: {
    product: {
      type: 'object',
      description: 'The updated product',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: add_reaction.ts]---
Location: sim-main/apps/sim/tools/slack/add_reaction.ts

```typescript
import type { SlackAddReactionParams, SlackAddReactionResponse } from '@/tools/slack/types'
import type { ToolConfig } from '@/tools/types'

export const slackAddReactionTool: ToolConfig<SlackAddReactionParams, SlackAddReactionResponse> = {
  id: 'slack_add_reaction',
  name: 'Slack Add Reaction',
  description: 'Add an emoji reaction to a Slack message',
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
      description: 'Timestamp of the message to react to (e.g., 1405894322.002768)',
    },
    name: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Name of the emoji reaction (without colons, e.g., thumbsup, heart, eyes)',
    },
  },

  request: {
    url: '/api/tools/slack/add-reaction',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params: SlackAddReactionParams) => ({
      accessToken: params.accessToken || params.botToken,
      channel: params.channel,
      timestamp: params.timestamp,
      name: params.name,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!data.success) {
      return {
        success: false,
        output: {
          content: data.error || 'Failed to add reaction',
          metadata: {
            channel: '',
            timestamp: '',
            reaction: '',
          },
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
      description: 'Reaction metadata',
      properties: {
        channel: { type: 'string', description: 'Channel ID' },
        timestamp: { type: 'string', description: 'Message timestamp' },
        reaction: { type: 'string', description: 'Emoji reaction name' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: canvas.ts]---
Location: sim-main/apps/sim/tools/slack/canvas.ts

```typescript
import type { SlackCanvasParams, SlackCanvasResponse } from '@/tools/slack/types'
import type { ToolConfig } from '@/tools/types'

export const slackCanvasTool: ToolConfig<SlackCanvasParams, SlackCanvasResponse> = {
  id: 'slack_canvas',
  name: 'Slack Canvas Writer',
  description:
    'Create and share Slack canvases in channels. Canvases are collaborative documents within Slack.',
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
      description: 'Target Slack channel (e.g., #general)',
    },
    title: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Title of the canvas',
    },
    content: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Canvas content in markdown format',
    },
    document_content: {
      type: 'object',
      required: false,
      visibility: 'hidden',
      description: 'Structured canvas document content',
    },
  },

  request: {
    url: 'https://slack.com/api/canvases.create',
    method: 'POST',
    headers: (params: SlackCanvasParams) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.accessToken || params.botToken}`,
    }),
    body: (params: SlackCanvasParams) => {
      // Use structured document content if provided, otherwise use markdown format
      if (params.document_content) {
        return {
          title: params.title,
          channel_id: params.channel,
          document_content: params.document_content,
        }
      }
      // Use the correct Canvas API format with markdown
      return {
        title: params.title,
        channel_id: params.channel,
        document_content: {
          type: 'markdown',
          markdown: params.content,
        },
      }
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        canvas_id: data.canvas_id || data.id,
        channel: data.channel || '',
        title: data.title || '',
      },
    }
  },

  outputs: {
    canvas_id: { type: 'string', description: 'ID of the created canvas' },
    channel: { type: 'string', description: 'Channel where canvas was created' },
    title: { type: 'string', description: 'Title of the canvas' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_message.ts]---
Location: sim-main/apps/sim/tools/slack/delete_message.ts

```typescript
import type { SlackDeleteMessageParams, SlackDeleteMessageResponse } from '@/tools/slack/types'
import type { ToolConfig } from '@/tools/types'

export const slackDeleteMessageTool: ToolConfig<
  SlackDeleteMessageParams,
  SlackDeleteMessageResponse
> = {
  id: 'slack_delete_message',
  name: 'Slack Delete Message',
  description: 'Delete a message previously sent by the bot in Slack',
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
      description: 'Timestamp of the message to delete (e.g., 1405894322.002768)',
    },
  },

  request: {
    url: '/api/tools/slack/delete-message',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params: SlackDeleteMessageParams) => ({
      accessToken: params.accessToken || params.botToken,
      channel: params.channel,
      timestamp: params.timestamp,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!data.success) {
      return {
        success: false,
        output: {
          content: data.error || 'Failed to delete message',
          metadata: {
            channel: '',
            timestamp: '',
          },
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
      description: 'Deleted message metadata',
      properties: {
        channel: { type: 'string', description: 'Channel ID' },
        timestamp: { type: 'string', description: 'Message timestamp' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: download.ts]---
Location: sim-main/apps/sim/tools/slack/download.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { SlackDownloadParams, SlackDownloadResponse } from '@/tools/slack/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('SlackDownloadTool')

export const slackDownloadTool: ToolConfig<SlackDownloadParams, SlackDownloadResponse> = {
  id: 'slack_download',
  name: 'Download File from Slack',
  description: 'Download a file from Slack',
  version: '1.0',

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
    fileId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the file to download',
    },
    fileName: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Optional filename override',
    },
  },

  request: {
    url: (params) => `https://slack.com/api/files.info?file=${params.fileId}`,
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken || params.botToken}`,
    }),
  },

  transformResponse: async (response: Response, params?: SlackDownloadParams) => {
    try {
      if (!response.ok) {
        const errorDetails = await response.json().catch(() => ({}))
        logger.error('Failed to get file info from Slack', {
          status: response.status,
          statusText: response.statusText,
          error: errorDetails,
        })
        throw new Error(errorDetails.error || 'Failed to get file info')
      }

      const data = await response.json()

      if (!data.ok) {
        logger.error('Slack API returned error', {
          error: data.error,
        })
        throw new Error(data.error || 'Slack API error')
      }

      const file = data.file
      const fileId = file.id
      const fileName = file.name
      const mimeType = file.mimetype || 'application/octet-stream'
      const urlPrivate = file.url_private
      const authToken = params?.accessToken || params?.botToken || ''

      if (!urlPrivate) {
        throw new Error('File does not have a download URL')
      }

      logger.info('Downloading file from Slack', {
        fileId,
        fileName,
        mimeType,
      })

      const downloadResponse = await fetch(urlPrivate, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      if (!downloadResponse.ok) {
        logger.error('Failed to download file content', {
          status: downloadResponse.status,
          statusText: downloadResponse.statusText,
        })
        throw new Error('Failed to download file content')
      }

      const arrayBuffer = await downloadResponse.arrayBuffer()
      const fileBuffer = Buffer.from(arrayBuffer)

      const resolvedName = params?.fileName || fileName || 'download'

      logger.info('File downloaded successfully', {
        fileId,
        name: resolvedName,
        size: fileBuffer.length,
        mimeType,
      })

      // Convert buffer to base64 string for proper JSON serialization
      // This ensures the file data survives the proxy round-trip
      const base64Data = fileBuffer.toString('base64')

      return {
        success: true,
        output: {
          file: {
            name: resolvedName,
            mimeType,
            data: base64Data,
            size: fileBuffer.length,
          },
        },
      }
    } catch (error: any) {
      logger.error('Error in transform response', {
        error: error.message,
        stack: error.stack,
      })
      throw error
    }
  },

  outputs: {
    file: { type: 'file', description: 'Downloaded file stored in execution files' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_user.ts]---
Location: sim-main/apps/sim/tools/slack/get_user.ts

```typescript
import type { SlackGetUserParams, SlackGetUserResponse } from '@/tools/slack/types'
import type { ToolConfig } from '@/tools/types'

export const slackGetUserTool: ToolConfig<SlackGetUserParams, SlackGetUserResponse> = {
  id: 'slack_get_user',
  name: 'Slack Get User Info',
  description: 'Get detailed information about a specific Slack user by their user ID.',
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
    userId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'User ID to look up (e.g., U1234567890)',
    },
  },

  request: {
    url: (params: SlackGetUserParams) => {
      const url = new URL('https://slack.com/api/users.info')
      url.searchParams.append('user', params.userId)
      return url.toString()
    },
    method: 'GET',
    headers: (params: SlackGetUserParams) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.accessToken || params.botToken}`,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!data.ok) {
      if (data.error === 'user_not_found') {
        throw new Error('User not found. Please check the user ID and try again.')
      }
      if (data.error === 'missing_scope') {
        throw new Error(
          'Missing required permissions. Please reconnect your Slack account with the necessary scopes (users:read).'
        )
      }
      if (data.error === 'invalid_auth') {
        throw new Error('Invalid authentication. Please check your Slack credentials.')
      }
      throw new Error(data.error || 'Failed to get user info from Slack')
    }

    const user = data.user
    const profile = user.profile || {}

    return {
      success: true,
      output: {
        user: {
          id: user.id,
          name: user.name,
          real_name: user.real_name || profile.real_name || '',
          display_name: profile.display_name || '',
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          title: profile.title || '',
          phone: profile.phone || '',
          skype: profile.skype || '',
          is_bot: user.is_bot || false,
          is_admin: user.is_admin || false,
          is_owner: user.is_owner || false,
          is_primary_owner: user.is_primary_owner || false,
          is_restricted: user.is_restricted || false,
          is_ultra_restricted: user.is_ultra_restricted || false,
          deleted: user.deleted || false,
          timezone: user.tz,
          timezone_label: user.tz_label,
          timezone_offset: user.tz_offset,
          avatar_24: profile.image_24,
          avatar_48: profile.image_48,
          avatar_72: profile.image_72,
          avatar_192: profile.image_192,
          avatar_512: profile.image_512,
          status_text: profile.status_text || '',
          status_emoji: profile.status_emoji || '',
          status_expiration: profile.status_expiration,
          updated: user.updated,
        },
      },
    }
  },

  outputs: {
    user: {
      type: 'object',
      description: 'Detailed user information',
      properties: {
        id: { type: 'string', description: 'User ID' },
        name: { type: 'string', description: 'Username (handle)' },
        real_name: { type: 'string', description: 'Full real name' },
        display_name: { type: 'string', description: 'Display name shown in Slack' },
        first_name: { type: 'string', description: 'First name' },
        last_name: { type: 'string', description: 'Last name' },
        title: { type: 'string', description: 'Job title' },
        phone: { type: 'string', description: 'Phone number' },
        skype: { type: 'string', description: 'Skype handle' },
        is_bot: { type: 'boolean', description: 'Whether the user is a bot' },
        is_admin: { type: 'boolean', description: 'Whether the user is a workspace admin' },
        is_owner: { type: 'boolean', description: 'Whether the user is the workspace owner' },
        is_primary_owner: { type: 'boolean', description: 'Whether the user is the primary owner' },
        is_restricted: { type: 'boolean', description: 'Whether the user is a guest (restricted)' },
        is_ultra_restricted: {
          type: 'boolean',
          description: 'Whether the user is a single-channel guest',
        },
        deleted: { type: 'boolean', description: 'Whether the user is deactivated' },
        timezone: {
          type: 'string',
          description: 'Timezone identifier (e.g., America/Los_Angeles)',
        },
        timezone_label: { type: 'string', description: 'Human-readable timezone label' },
        timezone_offset: { type: 'number', description: 'Timezone offset in seconds from UTC' },
        avatar_24: { type: 'string', description: 'URL to 24px avatar' },
        avatar_48: { type: 'string', description: 'URL to 48px avatar' },
        avatar_72: { type: 'string', description: 'URL to 72px avatar' },
        avatar_192: { type: 'string', description: 'URL to 192px avatar' },
        avatar_512: { type: 'string', description: 'URL to 512px avatar' },
        status_text: { type: 'string', description: 'Custom status text' },
        status_emoji: { type: 'string', description: 'Custom status emoji' },
        status_expiration: { type: 'number', description: 'Unix timestamp when status expires' },
        updated: { type: 'number', description: 'Unix timestamp of last profile update' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/slack/index.ts

```typescript
import { slackAddReactionTool } from '@/tools/slack/add_reaction'
import { slackCanvasTool } from '@/tools/slack/canvas'
import { slackDeleteMessageTool } from '@/tools/slack/delete_message'
import { slackDownloadTool } from '@/tools/slack/download'
import { slackGetUserTool } from '@/tools/slack/get_user'
import { slackListChannelsTool } from '@/tools/slack/list_channels'
import { slackListMembersTool } from '@/tools/slack/list_members'
import { slackListUsersTool } from '@/tools/slack/list_users'
import { slackMessageTool } from '@/tools/slack/message'
import { slackMessageReaderTool } from '@/tools/slack/message_reader'
import { slackUpdateMessageTool } from '@/tools/slack/update_message'

export {
  slackMessageTool,
  slackCanvasTool,
  slackMessageReaderTool,
  slackDownloadTool,
  slackUpdateMessageTool,
  slackDeleteMessageTool,
  slackAddReactionTool,
  slackListChannelsTool,
  slackListMembersTool,
  slackListUsersTool,
  slackGetUserTool,
}
```

--------------------------------------------------------------------------------

---[FILE: list_channels.ts]---
Location: sim-main/apps/sim/tools/slack/list_channels.ts

```typescript
import type { SlackListChannelsParams, SlackListChannelsResponse } from '@/tools/slack/types'
import type { ToolConfig } from '@/tools/types'

export const slackListChannelsTool: ToolConfig<SlackListChannelsParams, SlackListChannelsResponse> =
  {
    id: 'slack_list_channels',
    name: 'Slack List Channels',
    description:
      'List all channels in a Slack workspace. Returns public and private channels the bot has access to.',
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
      includePrivate: {
        type: 'boolean',
        required: false,
        visibility: 'user-or-llm',
        description: 'Include private channels the bot is a member of (default: true)',
      },
      excludeArchived: {
        type: 'boolean',
        required: false,
        visibility: 'user-or-llm',
        description: 'Exclude archived channels (default: true)',
      },
      limit: {
        type: 'number',
        required: false,
        visibility: 'user-or-llm',
        description: 'Maximum number of channels to return (default: 100, max: 200)',
      },
    },

    request: {
      url: (params: SlackListChannelsParams) => {
        const url = new URL('https://slack.com/api/conversations.list')

        // Determine channel types to include
        const includePrivate = params.includePrivate !== false
        if (includePrivate) {
          url.searchParams.append('types', 'public_channel,private_channel')
        } else {
          url.searchParams.append('types', 'public_channel')
        }

        // Exclude archived by default
        const excludeArchived = params.excludeArchived !== false
        url.searchParams.append('exclude_archived', String(excludeArchived))

        // Set limit (default 100, max 200)
        const limit = params.limit ? Math.min(Number(params.limit), 200) : 100
        url.searchParams.append('limit', String(limit))

        return url.toString()
      },
      method: 'GET',
      headers: (params: SlackListChannelsParams) => ({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken || params.botToken}`,
      }),
    },

    transformResponse: async (response: Response) => {
      const data = await response.json()

      if (!data.ok) {
        if (data.error === 'missing_scope') {
          throw new Error(
            'Missing required permissions. Please reconnect your Slack account with the necessary scopes (channels:read, groups:read).'
          )
        }
        if (data.error === 'invalid_auth') {
          throw new Error('Invalid authentication. Please check your Slack credentials.')
        }
        throw new Error(data.error || 'Failed to list channels from Slack')
      }

      const channels = (data.channels || []).map((channel: any) => ({
        id: channel.id,
        name: channel.name,
        is_private: channel.is_private || false,
        is_archived: channel.is_archived || false,
        is_member: channel.is_member || false,
        num_members: channel.num_members,
        topic: channel.topic?.value || '',
        purpose: channel.purpose?.value || '',
        created: channel.created,
        creator: channel.creator,
      }))

      return {
        success: true,
        output: {
          channels,
          count: channels.length,
        },
      }
    },

    outputs: {
      channels: {
        type: 'array',
        description: 'Array of channel objects from the workspace',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Channel ID (e.g., C1234567890)' },
            name: { type: 'string', description: 'Channel name without # prefix' },
            is_private: { type: 'boolean', description: 'Whether the channel is private' },
            is_archived: { type: 'boolean', description: 'Whether the channel is archived' },
            is_member: {
              type: 'boolean',
              description: 'Whether the bot is a member of the channel',
            },
            num_members: { type: 'number', description: 'Number of members in the channel' },
            topic: { type: 'string', description: 'Channel topic' },
            purpose: { type: 'string', description: 'Channel purpose/description' },
            created: { type: 'number', description: 'Unix timestamp when channel was created' },
            creator: { type: 'string', description: 'User ID of channel creator' },
          },
        },
      },
      count: {
        type: 'number',
        description: 'Total number of channels returned',
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: list_members.ts]---
Location: sim-main/apps/sim/tools/slack/list_members.ts

```typescript
import type { SlackListMembersParams, SlackListMembersResponse } from '@/tools/slack/types'
import type { ToolConfig } from '@/tools/types'

export const slackListMembersTool: ToolConfig<SlackListMembersParams, SlackListMembersResponse> = {
  id: 'slack_list_members',
  name: 'Slack List Channel Members',
  description:
    'List all members (user IDs) in a Slack channel. Use with Get User Info to resolve IDs to names.',
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
      description: 'Channel ID to list members from',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Maximum number of members to return (default: 100, max: 200)',
    },
  },

  request: {
    url: (params: SlackListMembersParams) => {
      const url = new URL('https://slack.com/api/conversations.members')
      url.searchParams.append('channel', params.channel)

      // Set limit (default 100, max 200)
      const limit = params.limit ? Math.min(Number(params.limit), 200) : 100
      url.searchParams.append('limit', String(limit))

      return url.toString()
    },
    method: 'GET',
    headers: (params: SlackListMembersParams) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.accessToken || params.botToken}`,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!data.ok) {
      if (data.error === 'channel_not_found') {
        throw new Error('Channel not found. Please check the channel ID and try again.')
      }
      if (data.error === 'missing_scope') {
        throw new Error(
          'Missing required permissions. Please reconnect your Slack account with the necessary scopes (channels:read, groups:read).'
        )
      }
      if (data.error === 'invalid_auth') {
        throw new Error('Invalid authentication. Please check your Slack credentials.')
      }
      throw new Error(data.error || 'Failed to list channel members from Slack')
    }

    const members = data.members || []

    return {
      success: true,
      output: {
        members,
        count: members.length,
      },
    }
  },

  outputs: {
    members: {
      type: 'array',
      description: 'Array of user IDs who are members of the channel (e.g., U1234567890)',
      items: {
        type: 'string',
      },
    },
    count: {
      type: 'number',
      description: 'Total number of members returned',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_users.ts]---
Location: sim-main/apps/sim/tools/slack/list_users.ts

```typescript
import type { SlackListUsersParams, SlackListUsersResponse } from '@/tools/slack/types'
import type { ToolConfig } from '@/tools/types'

export const slackListUsersTool: ToolConfig<SlackListUsersParams, SlackListUsersResponse> = {
  id: 'slack_list_users',
  name: 'Slack List Users',
  description: 'List all users in a Slack workspace. Returns user profiles with names and avatars.',
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
    includeDeleted: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Include deactivated/deleted users (default: false)',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Maximum number of users to return (default: 100, max: 200)',
    },
  },

  request: {
    url: (params: SlackListUsersParams) => {
      const url = new URL('https://slack.com/api/users.list')

      // Set limit (default 100, max 200)
      const limit = params.limit ? Math.min(Number(params.limit), 200) : 100
      url.searchParams.append('limit', String(limit))

      return url.toString()
    },
    method: 'GET',
    headers: (params: SlackListUsersParams) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.accessToken || params.botToken}`,
    }),
  },

  transformResponse: async (response: Response, params?: SlackListUsersParams) => {
    const data = await response.json()

    if (!data.ok) {
      if (data.error === 'missing_scope') {
        throw new Error(
          'Missing required permissions. Please reconnect your Slack account with the necessary scopes (users:read).'
        )
      }
      if (data.error === 'invalid_auth') {
        throw new Error('Invalid authentication. Please check your Slack credentials.')
      }
      throw new Error(data.error || 'Failed to list users from Slack')
    }

    const includeDeleted = params?.includeDeleted === true

    const users = (data.members || [])
      .filter((user: any) => {
        // Always filter out Slackbot
        if (user.id === 'USLACKBOT') return false
        // Filter deleted users unless includeDeleted is true
        if (!includeDeleted && user.deleted) return false
        return true
      })
      .map((user: any) => ({
        id: user.id,
        name: user.name,
        real_name: user.real_name || user.profile?.real_name || '',
        display_name: user.profile?.display_name || '',
        is_bot: user.is_bot || false,
        is_admin: user.is_admin || false,
        is_owner: user.is_owner || false,
        deleted: user.deleted || false,
        timezone: user.tz,
        avatar: user.profile?.image_72 || user.profile?.image_48 || '',
        status_text: user.profile?.status_text || '',
        status_emoji: user.profile?.status_emoji || '',
      }))

    return {
      success: true,
      output: {
        users,
        count: users.length,
      },
    }
  },

  outputs: {
    users: {
      type: 'array',
      description: 'Array of user objects from the workspace',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'User ID (e.g., U1234567890)' },
          name: { type: 'string', description: 'Username (handle)' },
          real_name: { type: 'string', description: 'Full real name' },
          display_name: { type: 'string', description: 'Display name shown in Slack' },
          is_bot: { type: 'boolean', description: 'Whether the user is a bot' },
          is_admin: { type: 'boolean', description: 'Whether the user is a workspace admin' },
          is_owner: { type: 'boolean', description: 'Whether the user is the workspace owner' },
          deleted: { type: 'boolean', description: 'Whether the user is deactivated' },
          timezone: { type: 'string', description: 'User timezone identifier' },
          avatar: { type: 'string', description: 'URL to user avatar image' },
          status_text: { type: 'string', description: 'Custom status text' },
          status_emoji: { type: 'string', description: 'Custom status emoji' },
        },
      },
    },
    count: {
      type: 'number',
      description: 'Total number of users returned',
    },
  },
}
```

--------------------------------------------------------------------------------

````
