---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 696
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 696 of 933)

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

---[FILE: list_contacts.ts]---
Location: sim-main/apps/sim/tools/intercom/list_contacts.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildIntercomUrl, handleIntercomError } from './types'

const logger = createLogger('IntercomListContacts')

export interface IntercomListContactsParams {
  accessToken: string
  per_page?: number
  starting_after?: string
}

export interface IntercomListContactsResponse {
  success: boolean
  output: {
    contacts: any[]
    pages?: any
    metadata: {
      operation: 'list_contacts'
      total_count?: number
    }
    success: boolean
  }
}

export const intercomListContactsTool: ToolConfig<
  IntercomListContactsParams,
  IntercomListContactsResponse
> = {
  id: 'intercom_list_contacts',
  name: 'List Contacts from Intercom',
  description: 'List all contacts from Intercom with pagination support',
  version: '1.0.0',

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Intercom API access token',
    },
    per_page: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of results per page (max: 150)',
    },
    starting_after: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Cursor for pagination - ID to start after',
    },
  },

  request: {
    url: (params) => {
      const url = buildIntercomUrl('/contacts')
      const queryParams = new URLSearchParams()

      if (params.per_page) queryParams.append('per_page', params.per_page.toString())
      if (params.starting_after) queryParams.append('starting_after', params.starting_after)

      const queryString = queryParams.toString()
      return queryString ? `${url}?${queryString}` : url
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Intercom-Version': '2.14',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleIntercomError(data, response.status, 'list_contacts')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        contacts: data.data || [],
        pages: data.pages,
        metadata: {
          operation: 'list_contacts' as const,
          total_count: data.total_count,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'List of contacts',
      properties: {
        contacts: { type: 'array', description: 'Array of contact objects' },
        pages: { type: 'object', description: 'Pagination information' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_conversations.ts]---
Location: sim-main/apps/sim/tools/intercom/list_conversations.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildIntercomUrl, handleIntercomError } from './types'

const logger = createLogger('IntercomListConversations')

export interface IntercomListConversationsParams {
  accessToken: string
  per_page?: number
  starting_after?: string
}

export interface IntercomListConversationsResponse {
  success: boolean
  output: {
    conversations: any[]
    pages?: any
    metadata: {
      operation: 'list_conversations'
      total_count?: number
    }
    success: boolean
  }
}

export const intercomListConversationsTool: ToolConfig<
  IntercomListConversationsParams,
  IntercomListConversationsResponse
> = {
  id: 'intercom_list_conversations',
  name: 'List Conversations from Intercom',
  description: 'List all conversations from Intercom with pagination support',
  version: '1.0.0',

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Intercom API access token',
    },
    per_page: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of results per page (max: 150)',
    },
    starting_after: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Cursor for pagination',
    },
  },

  request: {
    url: (params) => {
      const url = buildIntercomUrl('/conversations')
      const queryParams = new URLSearchParams()

      if (params.per_page) queryParams.append('per_page', params.per_page.toString())
      if (params.starting_after) queryParams.append('starting_after', params.starting_after)

      const queryString = queryParams.toString()
      return queryString ? `${url}?${queryString}` : url
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Intercom-Version': '2.14',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleIntercomError(data, response.status, 'list_conversations')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        conversations: data.conversations || [],
        pages: data.pages,
        metadata: {
          operation: 'list_conversations' as const,
          total_count: data.total_count,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'List of conversations',
      properties: {
        conversations: { type: 'array', description: 'Array of conversation objects' },
        pages: { type: 'object', description: 'Pagination information' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: reply_conversation.ts]---
Location: sim-main/apps/sim/tools/intercom/reply_conversation.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildIntercomUrl, handleIntercomError } from './types'

const logger = createLogger('IntercomReplyConversation')

export interface IntercomReplyConversationParams {
  accessToken: string
  conversationId: string
  message_type: string
  body: string
  admin_id?: string
  attachment_urls?: string
}

export interface IntercomReplyConversationResponse {
  success: boolean
  output: {
    conversation: any
    metadata: {
      operation: 'reply_conversation'
      conversationId: string
    }
    success: boolean
  }
}

export const intercomReplyConversationTool: ToolConfig<
  IntercomReplyConversationParams,
  IntercomReplyConversationResponse
> = {
  id: 'intercom_reply_conversation',
  name: 'Reply to Conversation in Intercom',
  description: 'Reply to a conversation as an admin in Intercom',
  version: '1.0.0',

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Intercom API access token',
    },
    conversationId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Conversation ID to reply to',
    },
    message_type: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Message type: "comment" or "note"',
    },
    body: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The text body of the reply',
    },
    admin_id: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'The ID of the admin authoring the reply. If not provided, a default admin (Operator/Fin) will be used.',
    },
    attachment_urls: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comma-separated list of image URLs (max 10)',
    },
  },

  request: {
    url: (params) => buildIntercomUrl(`/conversations/${params.conversationId}/reply`),
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
      'Intercom-Version': '2.14',
    }),
    body: (params) => {
      const reply: any = {
        message_type: params.message_type,
        type: 'admin',
        body: params.body,
      }

      if (params.admin_id) reply.admin_id = params.admin_id

      if (params.attachment_urls) {
        reply.attachment_urls = params.attachment_urls
          .split(',')
          .map((url) => url.trim())
          .slice(0, 10)
      }

      return reply
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleIntercomError(data, response.status, 'reply_conversation')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        conversation: data,
        metadata: {
          operation: 'reply_conversation' as const,
          conversationId: data.id,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Updated conversation with reply',
      properties: {
        conversation: { type: 'object', description: 'Updated conversation object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: search_contacts.ts]---
Location: sim-main/apps/sim/tools/intercom/search_contacts.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildIntercomUrl, handleIntercomError } from './types'

const logger = createLogger('IntercomSearchContacts')

export interface IntercomSearchContactsParams {
  accessToken: string
  query: string
  per_page?: number
  starting_after?: string
}

export interface IntercomSearchContactsResponse {
  success: boolean
  output: {
    contacts: any[]
    pages?: any
    metadata: {
      operation: 'search_contacts'
      total_count?: number
    }
    success: boolean
  }
}

export const intercomSearchContactsTool: ToolConfig<
  IntercomSearchContactsParams,
  IntercomSearchContactsResponse
> = {
  id: 'intercom_search_contacts',
  name: 'Search Contacts in Intercom',
  description: 'Search for contacts in Intercom using a query',
  version: '1.0.0',

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Intercom API access token',
    },
    query: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description:
        'Search query (e.g., {"field":"email","operator":"=","value":"user@example.com"})',
    },
    per_page: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of results per page (max: 150)',
    },
    starting_after: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Cursor for pagination',
    },
  },

  request: {
    url: () => buildIntercomUrl('/contacts/search'),
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Intercom-Version': '2.14',
    }),
    body: (params) => {
      let query
      try {
        query = JSON.parse(params.query)
      } catch (error) {
        // If not JSON, treat as simple text search
        query = {
          field: 'name',
          operator: '~',
          value: params.query,
        }
      }

      const body: any = { query }

      if (params.per_page) body.pagination = { per_page: params.per_page }
      if (params.starting_after)
        body.pagination = { ...body.pagination, starting_after: params.starting_after }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleIntercomError(data, response.status, 'search_contacts')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        contacts: data.data || [],
        pages: data.pages,
        metadata: {
          operation: 'search_contacts' as const,
          total_count: data.total_count,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Search results',
      properties: {
        contacts: { type: 'array', description: 'Array of matching contact objects' },
        pages: { type: 'object', description: 'Pagination information' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: search_conversations.ts]---
Location: sim-main/apps/sim/tools/intercom/search_conversations.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildIntercomUrl, handleIntercomError } from './types'

const logger = createLogger('IntercomSearchConversations')

export interface IntercomSearchConversationsParams {
  accessToken: string
  query: string
  per_page?: number
  starting_after?: string
}

export interface IntercomSearchConversationsResponse {
  success: boolean
  output: {
    conversations: any[]
    pages?: any
    metadata: {
      operation: 'search_conversations'
      total_count?: number
    }
    success: boolean
  }
}

export const intercomSearchConversationsTool: ToolConfig<
  IntercomSearchConversationsParams,
  IntercomSearchConversationsResponse
> = {
  id: 'intercom_search_conversations',
  name: 'Search Conversations in Intercom',
  description: 'Search for conversations in Intercom using a query',
  version: '1.0.0',

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Intercom API access token',
    },
    query: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Search query as JSON object',
    },
    per_page: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of results per page (max: 150)',
    },
    starting_after: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Cursor for pagination',
    },
  },

  request: {
    url: () => buildIntercomUrl('/conversations/search'),
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Intercom-Version': '2.14',
    }),
    body: (params) => {
      let query
      try {
        query = JSON.parse(params.query)
      } catch (error) {
        logger.warn('Failed to parse search query, using default', { error })
        query = {
          field: 'updated_at',
          operator: '>',
          value: Math.floor(Date.now() / 1000) - 86400, // Last 24 hours
        }
      }

      const body: any = { query }

      if (params.per_page) body.pagination = { per_page: params.per_page }
      if (params.starting_after)
        body.pagination = { ...body.pagination, starting_after: params.starting_after }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleIntercomError(data, response.status, 'search_conversations')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        conversations: data.conversations || [],
        pages: data.pages,
        metadata: {
          operation: 'search_conversations' as const,
          total_count: data.total_count,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Search results',
      properties: {
        conversations: { type: 'array', description: 'Array of matching conversation objects' },
        pages: { type: 'object', description: 'Pagination information' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/intercom/types.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('Intercom')

// Base params for Intercom API
export interface IntercomBaseParams {
  accessToken: string // OAuth token or API token (hidden)
}

export interface IntercomPaginationParams {
  per_page?: number
  starting_after?: string // Cursor for pagination
}

export interface IntercomPagingInfo {
  next?: {
    page: number
    starting_after: string
  } | null
  total_count?: number
}

export interface IntercomResponse<T> {
  success: boolean
  output: {
    data?: T
    pages?: IntercomPagingInfo
    metadata: {
      operation: string
      [key: string]: any
    }
    success: boolean
  }
}

// Helper function to build Intercom API URLs
export function buildIntercomUrl(path: string): string {
  return `https://api.intercom.io${path}`
}

// Helper function for consistent error handling
export function handleIntercomError(data: any, status: number, operation: string): never {
  logger.error(`Intercom API request failed for ${operation}`, { data, status })

  const errorMessage = data.errors?.[0]?.message || data.error || data.message || 'Unknown error'
  throw new Error(`Intercom ${operation} failed: ${errorMessage}`)
}
```

--------------------------------------------------------------------------------

---[FILE: update_contact.ts]---
Location: sim-main/apps/sim/tools/intercom/update_contact.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildIntercomUrl, handleIntercomError } from './types'

const logger = createLogger('IntercomUpdateContact')

export interface IntercomUpdateContactParams {
  accessToken: string
  contactId: string
  email?: string
  phone?: string
  name?: string
  avatar?: string
  signed_up_at?: number
  last_seen_at?: number
  owner_id?: string
  unsubscribed_from_emails?: boolean
  custom_attributes?: string
}

export interface IntercomUpdateContactResponse {
  success: boolean
  output: {
    contact: any
    metadata: {
      operation: 'update_contact'
      contactId: string
    }
    success: boolean
  }
}

export const intercomUpdateContactTool: ToolConfig<
  IntercomUpdateContactParams,
  IntercomUpdateContactResponse
> = {
  id: 'intercom_update_contact',
  name: 'Update Contact in Intercom',
  description: 'Update an existing contact in Intercom',
  version: '1.0.0',

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Intercom API access token',
    },
    contactId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Contact ID to update',
    },
    email: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: "The contact's email address",
    },
    phone: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: "The contact's phone number",
    },
    name: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: "The contact's name",
    },
    avatar: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'An avatar image URL for the contact',
    },
    signed_up_at: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'The time the user signed up as a Unix timestamp',
    },
    last_seen_at: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'The time the user was last seen as a Unix timestamp',
    },
    owner_id: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The id of an admin that has been assigned account ownership of the contact',
    },
    unsubscribed_from_emails: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Whether the contact is unsubscribed from emails',
    },
    custom_attributes: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Custom attributes as JSON object (e.g., {"attribute_name": "value"})',
    },
  },

  request: {
    url: (params) => buildIntercomUrl(`/contacts/${params.contactId}`),
    method: 'PUT',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
      'Intercom-Version': '2.14',
    }),
    body: (params) => {
      const contact: any = {}

      if (params.email) contact.email = params.email
      if (params.phone) contact.phone = params.phone
      if (params.name) contact.name = params.name
      if (params.avatar) contact.avatar = params.avatar
      if (params.signed_up_at) contact.signed_up_at = params.signed_up_at
      if (params.last_seen_at) contact.last_seen_at = params.last_seen_at
      if (params.owner_id) contact.owner_id = params.owner_id
      if (params.unsubscribed_from_emails !== undefined)
        contact.unsubscribed_from_emails = params.unsubscribed_from_emails

      if (params.custom_attributes) {
        try {
          contact.custom_attributes = JSON.parse(params.custom_attributes)
        } catch (error) {
          logger.warn('Failed to parse custom attributes', { error })
        }
      }

      return contact
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleIntercomError(data, response.status, 'update_contact')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        contact: data,
        metadata: {
          operation: 'update_contact' as const,
          contactId: data.id,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Updated contact data',
      properties: {
        contact: { type: 'object', description: 'Updated contact object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/jina/index.ts

```typescript
import { readUrlTool } from './read_url'
import { searchTool } from './search'

export const jinaReadUrlTool = readUrlTool
export const jinaSearchTool = searchTool
```

--------------------------------------------------------------------------------

---[FILE: read_url.ts]---
Location: sim-main/apps/sim/tools/jina/read_url.ts

```typescript
import type { ReadUrlParams, ReadUrlResponse } from '@/tools/jina/types'
import type { ToolConfig } from '@/tools/types'

export const readUrlTool: ToolConfig<ReadUrlParams, ReadUrlResponse> = {
  id: 'jina_read_url',
  name: 'Jina Reader',
  description:
    'Extract and process web content into clean, LLM-friendly text using Jina AI Reader. Supports advanced content parsing, link gathering, and multiple output formats with configurable processing options.',
  version: '1.0.0',

  params: {
    url: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The URL to read and convert to markdown',
    },
    useReaderLMv2: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Whether to use ReaderLM-v2 for better quality (3x token cost)',
    },
    gatherLinks: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Whether to gather all links at the end',
    },
    jsonResponse: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Whether to return response in JSON format',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Jina AI API key',
    },
    // Content extraction params
    withImagesummary: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Gather all images from the page with metadata',
    },
    retainImages: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Control image inclusion: "none" removes all, "all" keeps all',
    },
    returnFormat: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Output format: markdown, html, text, screenshot, or pageshot',
    },
    withIframe: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Include iframe content in extraction',
    },
    withShadowDom: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Extract Shadow DOM content',
    },
    // Performance & caching
    noCache: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Bypass cached content for real-time retrieval',
    },
    // Advanced options
    withGeneratedAlt: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Generate alt text for images using VLM',
    },
    robotsTxt: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Bot User-Agent for robots.txt checking',
    },
    dnt: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Do Not Track - prevents caching/tracking',
    },
    noGfm: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Disable GitHub Flavored Markdown',
    },
  },

  request: {
    url: (params: ReadUrlParams) => {
      return `https://r.jina.ai/https://${params.url.replace(/^https?:\/\//, '')}`
    },
    method: 'GET',
    headers: (params: ReadUrlParams) => {
      // Start with base headers
      const headers: Record<string, string> = {
        Accept: params.jsonResponse ? 'application/json' : 'text/plain',
        Authorization: `Bearer ${params.apiKey}`,
      }

      // Legacy params (backward compatible)
      if (params.useReaderLMv2 === true) {
        headers['X-Respond-With'] = 'readerlm-v2'
      }
      if (params.gatherLinks === true) {
        headers['X-With-Links-Summary'] = 'true'
      }

      // Content extraction headers
      if (params.withImagesummary === true) {
        headers['X-With-Images-Summary'] = 'true'
      }
      if (params.retainImages) {
        headers['X-Retain-Images'] = params.retainImages
      }
      if (params.returnFormat) {
        headers['X-Return-Format'] = params.returnFormat
      }
      if (params.withIframe === true) {
        headers['X-With-Iframe'] = 'true'
      }
      if (params.withShadowDom === true) {
        headers['X-With-Shadow-Dom'] = 'true'
      }

      // Advanced options
      if (params.withGeneratedAlt === true) {
        headers['X-With-Generated-Alt'] = 'true'
      }
      if (params.robotsTxt) {
        headers['X-Robots-Txt'] = params.robotsTxt
      }
      if (params.dnt === true) {
        headers.DNT = '1'
      }
      if (params.noGfm === true) {
        headers['X-No-Gfm'] = 'true'
      }

      return headers
    },
  },

  transformResponse: async (response: Response) => {
    const contentType = response.headers.get('content-type')

    if (contentType?.includes('application/json')) {
      const data = await response.json()
      return {
        success: response.ok,
        output: {
          content: data.data?.content || data.content || JSON.stringify(data),
          links: data.data?.links || undefined,
          images: data.data?.images || undefined,
        },
      }
    }

    const content = await response.text()
    return {
      success: response.ok,
      output: {
        content,
      },
    }
  },

  outputs: {
    content: {
      type: 'string',
      description: 'The extracted content from the URL, processed into clean, LLM-friendly text',
    },
    links: {
      type: 'array',
      description:
        'List of links found on the page (when gatherLinks or withLinksummary is enabled)',
    },
    images: {
      type: 'array',
      description: 'List of images found on the page (when withImagesummary is enabled)',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: search.ts]---
Location: sim-main/apps/sim/tools/jina/search.ts

```typescript
import type { SearchParams, SearchResponse } from '@/tools/jina/types'
import type { ToolConfig } from '@/tools/types'

export const searchTool: ToolConfig<SearchParams, SearchResponse> = {
  id: 'jina_search',
  name: 'Jina Search',
  description:
    'Search the web and return top 5 results with LLM-friendly content. Each result is automatically processed through Jina Reader API. Supports geographic filtering, site restrictions, and pagination.',
  version: '1.0.0',

  params: {
    q: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Search query string',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Jina AI API key',
    },
    // Pagination
    num: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Maximum number of results per page (default: 5)',
    },
    // Site restriction
    site: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'Restrict results to specific domain(s). Can be comma-separated for multiple sites (e.g., "jina.ai,github.com")',
    },
    // Content options
    withFavicon: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Include website favicons in results',
    },
    withImagesummary: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Gather all images from result pages with metadata',
    },
    withLinksummary: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Gather all links from result pages',
    },
    retainImages: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Control image inclusion: "none" removes all, "all" keeps all',
    },
    noCache: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Bypass cached content for real-time retrieval',
    },
    withGeneratedAlt: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Generate alt text for images using VLM',
    },
    respondWith: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Set to "no-content" to get only metadata without page content',
    },
    returnFormat: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Output format: markdown, html, text, screenshot, or pageshot',
    },
  },

  request: {
    url: (params: SearchParams) => {
      const baseUrl = 'https://s.jina.ai/'
      const query = encodeURIComponent(params.q)

      // Build query params
      const queryParams: string[] = []

      // Handle site parameter (can be string or array)
      if (params.site) {
        const sites = typeof params.site === 'string' ? params.site.split(',') : params.site
        sites.forEach((s) => queryParams.push(`site=${encodeURIComponent(s.trim())}`))
      }

      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : ''
      return `${baseUrl}${query}${queryString}`
    },
    method: 'GET',
    headers: (params: SearchParams) => {
      const headers: Record<string, string> = {
        Accept: 'application/json',
        Authorization: `Bearer ${params.apiKey}`,
      }

      // Content options
      if (params.withFavicon === true) {
        headers['X-With-Favicon'] = 'true'
      }
      if (params.withImagesummary === true) {
        headers['X-With-Images-Summary'] = 'true'
      }
      if (params.withLinksummary === true) {
        headers['X-With-Links-Summary'] = 'true'
      }
      if (params.retainImages) {
        headers['X-Retain-Images'] = params.retainImages
      }
      if (params.noCache === true) {
        headers['X-No-Cache'] = 'true'
      }
      if (params.withGeneratedAlt === true) {
        headers['X-With-Generated-Alt'] = 'true'
      }
      if (params.respondWith) {
        headers['X-Respond-With'] = params.respondWith
      }
      if (params.returnFormat) {
        headers['X-Return-Format'] = params.returnFormat
      }

      // Pagination headers
      if (params.num) {
        headers['X-Num'] = params.num.toString()
      }

      return headers
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    // The API returns an array of results or a data object with results
    const results = Array.isArray(data) ? data : data.data || []

    return {
      success: response.ok,
      output: {
        results: results.map((result: any) => ({
          title: result.title || '',
          description: result.description || '',
          url: result.url || '',
          content: result.content || '',
        })),
      },
    }
  },

  outputs: {
    results: {
      type: 'array',
      description:
        'Array of search results, each containing title, description, url, and LLM-friendly content',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/jina/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface ReadUrlParams {
  url: string
  // Existing params (backward compatible)
  useReaderLMv2?: boolean
  gatherLinks?: boolean
  jsonResponse?: boolean
  apiKey?: string
  // Content extraction params
  withImagesummary?: boolean
  retainImages?: 'none' | 'all'
  returnFormat?: 'markdown' | 'html' | 'text' | 'screenshot' | 'pageshot'
  withIframe?: boolean
  withShadowDom?: boolean
  // Performance & caching
  noCache?: boolean
  // Advanced options
  withGeneratedAlt?: boolean
  robotsTxt?: string
  dnt?: boolean
  noGfm?: boolean
}

export interface ReadUrlResponse extends ToolResponse {
  output: {
    content: string
    links?: string[]
    images?: string[]
  }
}

export interface SearchParams {
  q: string
  apiKey?: string
  // Pagination
  num?: number
  // Site restriction
  site?: string | string[]
  // Content options
  withFavicon?: boolean
  withImagesummary?: boolean
  withLinksummary?: boolean
  retainImages?: 'none' | 'all'
  noCache?: boolean
  withGeneratedAlt?: boolean
  respondWith?: 'no-content'
  returnFormat?: 'markdown' | 'html' | 'text' | 'screenshot' | 'pageshot'
}

export interface SearchResult {
  title: string
  description: string
  url: string
  content: string
}

export interface SearchResponse extends ToolResponse {
  output: {
    results: SearchResult[]
  }
}
```

--------------------------------------------------------------------------------

````
