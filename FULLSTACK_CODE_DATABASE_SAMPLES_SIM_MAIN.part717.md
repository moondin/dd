---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 717
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 717 of 933)

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

---[FILE: get_mailing_list.ts]---
Location: sim-main/apps/sim/tools/mailgun/get_mailing_list.ts

```typescript
import type { GetMailingListParams, GetMailingListResult } from '@/tools/mailgun/types'
import type { ToolConfig } from '@/tools/types'

export const mailgunGetMailingListTool: ToolConfig<GetMailingListParams, GetMailingListResult> = {
  id: 'mailgun_get_mailing_list',
  name: 'Mailgun Get Mailing List',
  description: 'Get details of a mailing list',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Mailgun API key',
    },
    address: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Mailing list address',
    },
  },

  request: {
    url: (params) => `https://api.mailgun.net/v3/lists/${params.address}`,
    method: 'GET',
    headers: (params) => ({
      Authorization: `Basic ${Buffer.from(`api:${params.apiKey}`).toString('base64')}`,
    }),
  },

  transformResponse: async (response, params): Promise<GetMailingListResult> => {
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to get mailing list')
    }

    const result = await response.json()

    return {
      success: true,
      output: {
        success: true,
        list: {
          address: result.list.address,
          name: result.list.name,
          description: result.list.description,
          accessLevel: result.list.access_level,
          membersCount: result.list.members_count,
          createdAt: result.list.created_at,
        },
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the request was successful' },
    list: { type: 'json', description: 'Mailing list details' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_message.ts]---
Location: sim-main/apps/sim/tools/mailgun/get_message.ts

```typescript
import type { GetMessageParams, GetMessageResult } from '@/tools/mailgun/types'
import type { ToolConfig } from '@/tools/types'

export const mailgunGetMessageTool: ToolConfig<GetMessageParams, GetMessageResult> = {
  id: 'mailgun_get_message',
  name: 'Mailgun Get Message',
  description: 'Retrieve a stored message by its key',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Mailgun API key',
    },
    domain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Mailgun domain',
    },
    messageKey: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Message storage key',
    },
  },

  request: {
    url: (params) =>
      `https://api.mailgun.net/v3/domains/${params.domain}/messages/${params.messageKey}`,
    method: 'GET',
    headers: (params) => ({
      Authorization: `Basic ${Buffer.from(`api:${params.apiKey}`).toString('base64')}`,
    }),
  },

  transformResponse: async (response, params): Promise<GetMessageResult> => {
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to get message')
    }

    const result = await response.json()

    return {
      success: true,
      output: {
        success: true,
        recipients: result.recipients,
        from: result.from,
        subject: result.subject,
        bodyPlain: result['body-plain'],
        strippedText: result['stripped-text'],
        strippedSignature: result['stripped-signature'],
        bodyHtml: result['body-html'],
        strippedHtml: result['stripped-html'],
        attachmentCount: result['attachment-count'],
        timestamp: result.timestamp,
        messageHeaders: result['message-headers'],
        contentIdMap: result['content-id-map'],
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the request was successful' },
    recipients: { type: 'string', description: 'Message recipients' },
    from: { type: 'string', description: 'Sender email' },
    subject: { type: 'string', description: 'Message subject' },
    bodyPlain: { type: 'string', description: 'Plain text body' },
    strippedText: { type: 'string', description: 'Stripped text' },
    strippedSignature: { type: 'string', description: 'Stripped signature' },
    bodyHtml: { type: 'string', description: 'HTML body' },
    strippedHtml: { type: 'string', description: 'Stripped HTML' },
    attachmentCount: { type: 'number', description: 'Number of attachments' },
    timestamp: { type: 'number', description: 'Message timestamp' },
    messageHeaders: { type: 'json', description: 'Message headers' },
    contentIdMap: { type: 'json', description: 'Content ID map' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/mailgun/index.ts

```typescript
// Message Operations

export { mailgunAddListMemberTool } from './add_list_member'
export { mailgunCreateMailingListTool } from './create_mailing_list'
export { mailgunGetDomainTool } from './get_domain'
export { mailgunGetMailingListTool } from './get_mailing_list'
export { mailgunGetMessageTool } from './get_message'
export { mailgunListDomainsTool } from './list_domains'
export { mailgunListMessagesTool } from './list_messages'
export { mailgunSendMessageTool } from './send_message'
export type { SendMessageParams, SendMessageResult } from './types'
```

--------------------------------------------------------------------------------

---[FILE: list_domains.ts]---
Location: sim-main/apps/sim/tools/mailgun/list_domains.ts

```typescript
import type { ListDomainsParams, ListDomainsResult } from '@/tools/mailgun/types'
import type { ToolConfig } from '@/tools/types'

export const mailgunListDomainsTool: ToolConfig<ListDomainsParams, ListDomainsResult> = {
  id: 'mailgun_list_domains',
  name: 'Mailgun List Domains',
  description: 'List all domains for your Mailgun account',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Mailgun API key',
    },
  },

  request: {
    url: () => 'https://api.mailgun.net/v3/domains',
    method: 'GET',
    headers: (params) => ({
      Authorization: `Basic ${Buffer.from(`api:${params.apiKey}`).toString('base64')}`,
    }),
  },

  transformResponse: async (response, params): Promise<ListDomainsResult> => {
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to list domains')
    }

    const result = await response.json()

    return {
      success: true,
      output: {
        success: true,
        totalCount: result.total_count,
        items: result.items || [],
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the request was successful' },
    totalCount: { type: 'number', description: 'Total number of domains' },
    items: { type: 'json', description: 'Array of domain objects' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_messages.ts]---
Location: sim-main/apps/sim/tools/mailgun/list_messages.ts

```typescript
import type { ListMessagesParams, ListMessagesResult } from '@/tools/mailgun/types'
import type { ToolConfig } from '@/tools/types'

export const mailgunListMessagesTool: ToolConfig<ListMessagesParams, ListMessagesResult> = {
  id: 'mailgun_list_messages',
  name: 'Mailgun List Messages',
  description: 'List events (logs) for messages sent through Mailgun',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Mailgun API key',
    },
    domain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Mailgun domain',
    },
    event: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by event type (accepted, delivered, failed, opened, clicked, etc.)',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Maximum number of events to return (default: 100)',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = `https://api.mailgun.net/v3/${params.domain}/events`
      const queryParams = new URLSearchParams()

      if (params.event) {
        queryParams.append('event', params.event)
      }
      if (params.limit) {
        queryParams.append('limit', params.limit.toString())
      }

      const query = queryParams.toString()
      return query ? `${baseUrl}?${query}` : baseUrl
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Basic ${Buffer.from(`api:${params.apiKey}`).toString('base64')}`,
    }),
  },

  transformResponse: async (response, params): Promise<ListMessagesResult> => {
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to list messages')
    }

    const result = await response.json()

    return {
      success: true,
      output: {
        success: true,
        items: result.items || [],
        paging: result.paging || {},
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the request was successful' },
    items: { type: 'json', description: 'Array of event items' },
    paging: { type: 'json', description: 'Paging information' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: send_message.ts]---
Location: sim-main/apps/sim/tools/mailgun/send_message.ts

```typescript
import type { SendMessageParams, SendMessageResult } from '@/tools/mailgun/types'
import type { ToolConfig } from '@/tools/types'

export const mailgunSendMessageTool: ToolConfig<SendMessageParams, SendMessageResult> = {
  id: 'mailgun_send_message',
  name: 'Mailgun Send Message',
  description: 'Send an email using Mailgun API',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Mailgun API key',
    },
    domain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Mailgun domain (e.g., mg.example.com)',
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
      description: 'Recipient email address (comma-separated for multiple)',
    },
    subject: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Email subject',
    },
    text: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Plain text body of the email',
    },
    html: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'HTML body of the email',
    },
    cc: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'CC email address (comma-separated for multiple)',
    },
    bcc: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'BCC email address (comma-separated for multiple)',
    },
    tags: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Tags for the email (comma-separated)',
    },
  },

  request: {
    url: (params) => `https://api.mailgun.net/v3/${params.domain}/messages`,
    method: 'POST',
    headers: (params) => ({
      Authorization: `Basic ${Buffer.from(`api:${params.apiKey}`).toString('base64')}`,
    }),
    body: (params) => {
      const formData = new FormData()
      formData.append('from', params.from)
      formData.append('to', params.to)
      formData.append('subject', params.subject)

      if (params.text) {
        formData.append('text', params.text)
      }
      if (params.html) {
        formData.append('html', params.html)
      }
      if (params.cc) {
        formData.append('cc', params.cc)
      }
      if (params.bcc) {
        formData.append('bcc', params.bcc)
      }
      if (params.tags) {
        const tagArray = params.tags.split(',').map((t) => t.trim())
        tagArray.forEach((tag) => formData.append('o:tag', tag))
      }

      return { body: formData }
    },
  },

  transformResponse: async (response, params): Promise<SendMessageResult> => {
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to send message')
    }

    const result = await response.json()

    return {
      success: true,
      output: {
        success: true,
        id: result.id,
        message: result.message || 'Queued. Thank you.',
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the message was sent successfully' },
    id: { type: 'string', description: 'Message ID' },
    message: { type: 'string', description: 'Response message from Mailgun' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/mailgun/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface MailgunMessageHeaders {
  [key: string]: string | string[]
}

export interface MailgunMessageItem {
  timestamp: number
  event: string
  recipient: string
  sender?: string
  subject?: string
  deliveryStatus?: string
  [key: string]: unknown
}

export interface MailgunDomainItem {
  name: string
  state: string
  type: string
  created_at?: string
  smtp_login?: string
  [key: string]: unknown
}

export interface MailgunPaging {
  first?: string
  next?: string
  previous?: string
  last?: string
}

export interface MailgunMailingListMember {
  address: string
  name?: string
  subscribed: boolean
  vars?: Record<string, string | number | boolean | null>
}

// Send Message
export interface SendMessageParams {
  apiKey: string
  domain: string
  from: string
  to: string
  subject: string
  text?: string
  html?: string
  cc?: string
  bcc?: string
  tags?: string
}

export interface SendMessageResult extends ToolResponse {
  output: {
    success: boolean
    id: string
    message: string
  }
}

// Get Message
export interface GetMessageParams {
  apiKey: string
  domain: string
  messageKey: string
}

export interface GetMessageResult extends ToolResponse {
  output: {
    success: boolean
    recipients: string
    from: string
    subject: string
    bodyPlain: string
    strippedText: string
    strippedSignature: string
    bodyHtml: string
    strippedHtml: string
    attachmentCount: number
    timestamp: number
    messageHeaders: MailgunMessageHeaders
    contentIdMap: Record<string, string>
  }
}

// List Messages (Events)
export interface ListMessagesParams {
  apiKey: string
  domain: string
  event?: string
  limit?: number
}

export interface ListMessagesResult extends ToolResponse {
  output: {
    success: boolean
    items: MailgunMessageItem[]
    paging: MailgunPaging
  }
}

// Create Mailing List
export interface CreateMailingListParams {
  apiKey: string
  address: string
  name?: string
  description?: string
  accessLevel?: 'readonly' | 'members' | 'everyone'
}

export interface CreateMailingListResult extends ToolResponse {
  output: {
    success: boolean
    message: string
    list: {
      address: string
      name: string
      description: string
      accessLevel: string
      createdAt: string
    }
  }
}

// Get Mailing List
export interface GetMailingListParams {
  apiKey: string
  address: string
}

export interface GetMailingListResult extends ToolResponse {
  output: {
    success: boolean
    list: {
      address: string
      name: string
      description: string
      accessLevel: string
      membersCount: number
      createdAt: string
    }
  }
}

// Add List Member
export interface AddListMemberParams {
  apiKey: string
  listAddress: string
  address: string
  name?: string
  vars?: string
  subscribed?: boolean
}

export interface AddListMemberResult extends ToolResponse {
  output: {
    success: boolean
    message: string
    member: {
      address: string
      name: string
      subscribed: boolean
      vars: Record<string, string | number | boolean | null>
    }
  }
}

// List Domains
export interface ListDomainsParams {
  apiKey: string
}

export interface ListDomainsResult extends ToolResponse {
  output: {
    success: boolean
    totalCount: number
    items: MailgunDomainItem[]
  }
}

// Get Domain
export interface GetDomainParams {
  apiKey: string
  domain: string
}

export interface GetDomainResult extends ToolResponse {
  output: {
    success: boolean
    domain: {
      name: string
      smtpLogin: string
      smtpPassword: string
      spamAction: string
      state: string
      createdAt: string
      type: string
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: add_memories.ts]---
Location: sim-main/apps/sim/tools/mem0/add_memories.ts

```typescript
import type { ToolConfig } from '@/tools/types'

// Add Memories Tool
export const mem0AddMemoriesTool: ToolConfig = {
  id: 'mem0_add_memories',
  name: 'Add Memories',
  description: 'Add memories to Mem0 for persistent storage and retrieval',
  version: '1.0.0',

  params: {
    userId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'User ID associated with the memory',
    },
    messages: {
      type: 'json',
      required: true,
      visibility: 'user-or-llm',
      description: 'Array of message objects with role and content',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Mem0 API key',
    },
  },

  request: {
    url: 'https://api.mem0.ai/v1/memories/',
    method: 'POST',
    headers: (params) => ({
      Authorization: `Token ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      // First, ensure messages is an array
      let messagesArray = params.messages
      if (typeof messagesArray === 'string') {
        try {
          messagesArray = JSON.parse(messagesArray)
        } catch (_e) {
          throw new Error('Messages must be a valid JSON array of objects with role and content')
        }
      }

      // Validate message format
      if (!Array.isArray(messagesArray) || messagesArray.length === 0) {
        throw new Error('Messages must be a non-empty array')
      }

      for (const msg of messagesArray) {
        if (!msg.role || !msg.content) {
          throw new Error('Each message must have role and content properties')
        }
      }

      // Prepare request body
      const body: Record<string, any> = {
        messages: messagesArray,
        version: 'v2',
        user_id: params.userId,
      }

      return body
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    // If the API returns an empty array, this might be normal behavior on success
    if (Array.isArray(data) && data.length === 0) {
      return {
        success: true,
        output: {
          memories: [],
        },
      }
    }

    // Handle array response with memory objects
    if (Array.isArray(data) && data.length > 0) {
      // Extract IDs for easy access
      const memoryIds = data.map((memory) => memory.id)

      return {
        success: true,
        output: {
          ids: memoryIds,
          memories: data,
        },
      }
    }

    // Handle non-array responses (single memory object)
    if (data && !Array.isArray(data) && data.id) {
      return {
        success: true,
        output: {
          ids: [data.id],
          memories: [data],
        },
      }
    }

    // Default response format if none of the above match
    return {
      success: true,
      output: {
        memories: Array.isArray(data) ? data : [data],
      },
    }
  },

  outputs: {
    ids: {
      type: 'array',
      description: 'Array of memory IDs that were created',
    },
    memories: {
      type: 'array',
      description: 'Array of memory objects that were created',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_memories.ts]---
Location: sim-main/apps/sim/tools/mem0/get_memories.ts

```typescript
import type { ToolConfig } from '@/tools/types'

// Get Memories Tool
export const mem0GetMemoriesTool: ToolConfig = {
  id: 'mem0_get_memories',
  name: 'Get Memories',
  description: 'Retrieve memories from Mem0 by ID or filter criteria',
  version: '1.0.0',

  params: {
    userId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'User ID to retrieve memories for',
    },
    memoryId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Specific memory ID to retrieve',
    },
    startDate: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Start date for filtering by created_at (format: YYYY-MM-DD)',
    },
    endDate: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'End date for filtering by created_at (format: YYYY-MM-DD)',
    },
    limit: {
      type: 'number',
      required: false,
      default: 10,
      visibility: 'hidden',
      description: 'Maximum number of results to return',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Mem0 API key',
    },
  },

  request: {
    url: (params: Record<string, any>) => {
      // For a specific memory ID, use the get single memory endpoint
      if (params.memoryId) {
        // Dynamically set method to GET for memory ID requests
        params.method = 'GET'
        return `https://api.mem0.ai/v1/memories/${params.memoryId}/`
      }
      // Otherwise use v2 memories endpoint with filters
      return 'https://api.mem0.ai/v2/memories/'
    },
    method: 'POST', // Default to POST for filtering
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Token ${params.apiKey}`,
    }),
    body: (params: Record<string, any>) => {
      // For specific memory ID, we'll use GET method instead and don't need a body
      // But we still need to return an empty object to satisfy the type
      if (params.memoryId) {
        return {}
      }

      // Build filters array for AND condition
      const andConditions = []

      // Add user filter
      andConditions.push({ user_id: params.userId })

      // Add date range filter if provided
      if (params.startDate || params.endDate) {
        const dateFilter: Record<string, any> = {}

        if (params.startDate) {
          dateFilter.gte = params.startDate
        }

        if (params.endDate) {
          dateFilter.lte = params.endDate
        }

        andConditions.push({ created_at: dateFilter })
      }

      // Build final filters object
      const body: Record<string, any> = {
        page_size: Number(params.limit || 10),
      }

      // Only add filters if we have any conditions
      if (andConditions.length > 0) {
        body.filters = { AND: andConditions }
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()
    const memories = Array.isArray(data) ? data : [data]
    const ids = memories.map((memory) => memory.id).filter(Boolean)

    return {
      success: true,
      output: {
        memories,
        ids,
      },
    }
  },

  outputs: {
    memories: {
      type: 'array',
      description: 'Array of retrieved memory objects',
    },
    ids: {
      type: 'array',
      description: 'Array of memory IDs that were retrieved',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/mem0/index.ts

```typescript
import { mem0AddMemoriesTool } from '@/tools/mem0/add_memories'
import { mem0GetMemoriesTool } from '@/tools/mem0/get_memories'
import { mem0SearchMemoriesTool } from '@/tools/mem0/search_memories'

export { mem0AddMemoriesTool, mem0SearchMemoriesTool, mem0GetMemoriesTool }
```

--------------------------------------------------------------------------------

---[FILE: search_memories.ts]---
Location: sim-main/apps/sim/tools/mem0/search_memories.ts

```typescript
import type { Mem0Response } from '@/tools/mem0/types'
import type { ToolConfig } from '@/tools/types'

// Search Memories Tool
export const mem0SearchMemoriesTool: ToolConfig<any, Mem0Response> = {
  id: 'mem0_search_memories',
  name: 'Search Memories',
  description: 'Search for memories in Mem0 using semantic search',
  version: '1.0.0',

  params: {
    userId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'User ID to search memories for',
    },
    query: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Search query to find relevant memories',
    },
    limit: {
      type: 'number',
      required: false,
      default: 10,
      visibility: 'user-only',
      description: 'Maximum number of results to return',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Mem0 API key',
    },
  },

  request: {
    url: 'https://api.mem0.ai/v2/memories/search/',
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Token ${params.apiKey}`,
    }),
    body: (params) => {
      // Create the request body with the format that the curl test confirms works
      const body: Record<string, any> = {
        query: params.query || 'test',
        filters: {
          user_id: params.userId,
        },
        top_k: Number(params.limit || 10),
      }

      return body
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (!data || (Array.isArray(data) && data.length === 0)) {
      return {
        success: true,
        output: {
          searchResults: [],
          ids: [],
        },
      }
    }

    if (Array.isArray(data)) {
      const searchResults = data.map((item) => ({
        id: item.id,
        data: { memory: item.memory || '' },
        score: item.score || 0,
      }))

      const ids = data.map((item) => item.id).filter(Boolean)

      return {
        success: true,
        output: {
          searchResults,
          ids,
        },
      }
    }

    return {
      success: true,
      output: {
        searchResults: [],
      },
    }
  },

  outputs: {
    searchResults: {
      type: 'array',
      description: 'Array of search results with memory data, each containing id, data, and score',
    },
    ids: {
      type: 'array',
      description: 'Array of memory IDs found in the search results',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/mem0/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface Mem0Response extends ToolResponse {
  output: {
    ids?: string[]
    memories?: any[]
    searchResults?: any[]
  }
}
```

--------------------------------------------------------------------------------

---[FILE: add.ts]---
Location: sim-main/apps/sim/tools/memory/add.ts

```typescript
import { buildMemoryKey } from '@/tools/memory/helpers'
import type { MemoryResponse } from '@/tools/memory/types'
import type { ToolConfig } from '@/tools/types'

export const memoryAddTool: ToolConfig<any, MemoryResponse> = {
  id: 'memory_add',
  name: 'Add Memory',
  description: 'Add a new memory to the database or append to existing memory with the same ID.',
  version: '1.0.0',

  params: {
    conversationId: {
      type: 'string',
      required: false,
      description:
        'Conversation identifier (e.g., user-123, session-abc). If a memory with this conversationId already exists for this block, the new message will be appended to it.',
    },
    id: {
      type: 'string',
      required: false,
      description:
        'Legacy parameter for conversation identifier. Use conversationId instead. Provided for backwards compatibility.',
    },
    role: {
      type: 'string',
      required: true,
      description: 'Role for agent memory (user, assistant, or system)',
    },
    content: {
      type: 'string',
      required: true,
      description: 'Content for agent memory',
    },
    blockId: {
      type: 'string',
      required: false,
      description:
        'Optional block ID. If not provided, uses the current block ID from execution context, or defaults to "default".',
    },
  },

  request: {
    url: '/api/memory',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const workflowId = params._context?.workflowId
      const contextBlockId = params._context?.blockId

      if (!workflowId) {
        return {
          _errorResponse: {
            status: 400,
            data: {
              success: false,
              error: {
                message: 'workflowId is required and must be provided in execution context',
              },
            },
          },
        }
      }

      // Use 'id' as fallback for 'conversationId' for backwards compatibility
      const conversationId = params.conversationId || params.id

      // Default blockId to 'default' if not provided in params or context
      const blockId = params.blockId || contextBlockId || 'default'

      if (!conversationId || conversationId.trim() === '') {
        return {
          _errorResponse: {
            status: 400,
            data: {
              success: false,
              error: {
                message: 'conversationId or id is required',
              },
            },
          },
        }
      }

      if (!params.role || !params.content) {
        return {
          _errorResponse: {
            status: 400,
            data: {
              success: false,
              error: {
                message: 'Role and content are required for agent memory',
              },
            },
          },
        }
      }

      const key = buildMemoryKey(conversationId, blockId)

      const body: Record<string, any> = {
        key,
        workflowId,
        data: {
          role: params.role,
          content: params.content,
        },
      }

      return body
    },
  },

  transformResponse: async (response): Promise<MemoryResponse> => {
    const result = await response.json()
    const data = result.data || result

    const memories = Array.isArray(data.data) ? data.data : [data.data]

    return {
      success: true,
      output: {
        memories,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the memory was added successfully' },
    memories: {
      type: 'array',
      description: 'Array of memory objects including the new or updated memory',
    },
    error: { type: 'string', description: 'Error message if operation failed' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete.ts]---
Location: sim-main/apps/sim/tools/memory/delete.ts

```typescript
import type { MemoryResponse } from '@/tools/memory/types'
import type { ToolConfig } from '@/tools/types'

export const memoryDeleteTool: ToolConfig<any, MemoryResponse> = {
  id: 'memory_delete',
  name: 'Delete Memory',
  description:
    'Delete memories by conversationId, blockId, blockName, or a combination. Supports bulk deletion.',
  version: '1.0.0',

  params: {
    conversationId: {
      type: 'string',
      required: false,
      description:
        'Conversation identifier (e.g., user-123, session-abc). If provided alone, deletes all memories for this conversation across all blocks.',
    },
    id: {
      type: 'string',
      required: false,
      description:
        'Legacy parameter for conversation identifier. Use conversationId instead. Provided for backwards compatibility.',
    },
    blockId: {
      type: 'string',
      required: false,
      description:
        'Block identifier. If provided alone, deletes all memories for this block across all conversations. If provided with conversationId, deletes memories for that specific conversation in this block.',
    },
    blockName: {
      type: 'string',
      required: false,
      description:
        'Block name. Alternative to blockId. If provided alone, deletes all memories for blocks with this name. If provided with conversationId, deletes memories for that conversation in blocks with this name.',
    },
  },

  request: {
    url: (params): any => {
      const workflowId = params._context?.workflowId

      if (!workflowId) {
        return {
          _errorResponse: {
            status: 400,
            data: {
              success: false,
              error: {
                message: 'workflowId is required and must be provided in execution context',
              },
            },
          },
        }
      }

      // Use 'id' as fallback for 'conversationId' for backwards compatibility
      const conversationId = params.conversationId || params.id

      if (!conversationId && !params.blockId && !params.blockName) {
        return {
          _errorResponse: {
            status: 400,
            data: {
              success: false,
              error: {
                message:
                  'At least one of conversationId, id, blockId, or blockName must be provided',
              },
            },
          },
        }
      }

      const url = new URL('/api/memory', 'http://dummy')
      url.searchParams.set('workflowId', workflowId)

      if (conversationId) {
        url.searchParams.set('conversationId', conversationId)
      }
      if (params.blockId) {
        url.searchParams.set('blockId', params.blockId)
      }
      if (params.blockName) {
        url.searchParams.set('blockName', params.blockName)
      }

      return url.pathname + url.search
    },
    method: 'DELETE',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response): Promise<MemoryResponse> => {
    const result = await response.json()
    const data = result.data || result

    return {
      success: result.success !== false,
      output: {
        message: data.message || 'Memories deleted successfully',
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the memory was deleted successfully' },
    message: { type: 'string', description: 'Success or error message' },
    error: { type: 'string', description: 'Error message if operation failed' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get.ts]---
Location: sim-main/apps/sim/tools/memory/get.ts

```typescript
import { buildMemoryKey } from '@/tools/memory/helpers'
import type { MemoryResponse } from '@/tools/memory/types'
import type { ToolConfig } from '@/tools/types'

export const memoryGetTool: ToolConfig<any, MemoryResponse> = {
  id: 'memory_get',
  name: 'Get Memory',
  description:
    'Retrieve memory by conversationId, blockId, blockName, or a combination. Returns all matching memories.',
  version: '1.0.0',

  params: {
    conversationId: {
      type: 'string',
      required: false,
      description:
        'Conversation identifier (e.g., user-123, session-abc). If provided alone, returns all memories for this conversation across all blocks.',
    },
    id: {
      type: 'string',
      required: false,
      description:
        'Legacy parameter for conversation identifier. Use conversationId instead. Provided for backwards compatibility.',
    },
    blockId: {
      type: 'string',
      required: false,
      description:
        'Block identifier. If provided alone, returns all memories for this block across all conversations. If provided with conversationId, returns memories for that specific conversation in this block.',
    },
    blockName: {
      type: 'string',
      required: false,
      description:
        'Block name. Alternative to blockId. If provided alone, returns all memories for blocks with this name. If provided with conversationId, returns memories for that conversation in blocks with this name.',
    },
  },

  request: {
    url: (params): any => {
      const workflowId = params._context?.workflowId

      if (!workflowId) {
        return {
          _errorResponse: {
            status: 400,
            data: {
              success: false,
              error: {
                message: 'workflowId is required and must be provided in execution context',
              },
            },
          },
        }
      }

      // Use 'id' as fallback for 'conversationId' for backwards compatibility
      const conversationId = params.conversationId || params.id

      if (!conversationId && !params.blockId && !params.blockName) {
        return {
          _errorResponse: {
            status: 400,
            data: {
              success: false,
              error: {
                message:
                  'At least one of conversationId, id, blockId, or blockName must be provided',
              },
            },
          },
        }
      }

      let query = ''

      if (conversationId && params.blockId) {
        query = buildMemoryKey(conversationId, params.blockId)
      } else if (conversationId) {
        // Also check for legacy format (conversationId without blockId)
        query = `${conversationId}:`
      } else if (params.blockId) {
        query = `:${params.blockId}`
      }

      const url = new URL('/api/memory', 'http://dummy')
      url.searchParams.set('workflowId', workflowId)
      if (query) {
        url.searchParams.set('query', query)
      }
      if (params.blockName) {
        url.searchParams.set('blockName', params.blockName)
      }
      url.searchParams.set('limit', '1000')

      return url.pathname + url.search
    },
    method: 'GET',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response): Promise<MemoryResponse> => {
    const result = await response.json()
    const memories = result.data?.memories || []

    if (!Array.isArray(memories) || memories.length === 0) {
      return {
        success: true,
        output: {
          memories: [],
          message: 'No memories found',
        },
      }
    }

    return {
      success: true,
      output: {
        memories,
        message: `Found ${memories.length} memories`,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the memory was retrieved successfully' },
    memories: {
      type: 'array',
      description:
        'Array of memory objects with conversationId, blockId, blockName, and data fields',
    },
    message: { type: 'string', description: 'Success or error message' },
    error: { type: 'string', description: 'Error message if operation failed' },
  },
}
```

--------------------------------------------------------------------------------

````
