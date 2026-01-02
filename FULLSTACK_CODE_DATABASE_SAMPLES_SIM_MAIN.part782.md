---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 782
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 782 of 933)

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

---[FILE: add_messages.ts]---
Location: sim-main/apps/sim/tools/zep/add_messages.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { ZepResponse } from '@/tools/zep/types'

// Add Messages Tool - Add messages to a thread (Zep v3)
export const zepAddMessagesTool: ToolConfig<any, ZepResponse> = {
  id: 'zep_add_messages',
  name: 'Add Messages',
  description: 'Add messages to an existing thread',
  version: '1.0.0',

  params: {
    threadId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Thread ID to add messages to',
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
      description: 'Your Zep API key',
    },
  },

  request: {
    url: (params) => `https://api.getzep.com/api/v2/threads/${params.threadId}/messages`,
    method: 'POST',
    headers: (params) => ({
      Authorization: `Api-Key ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      let messagesArray = params.messages
      if (typeof messagesArray === 'string') {
        try {
          messagesArray = JSON.parse(messagesArray)
        } catch (_e) {
          throw new Error('Messages must be a valid JSON array')
        }
      }

      if (!Array.isArray(messagesArray) || messagesArray.length === 0) {
        throw new Error('Messages must be a non-empty array')
      }

      for (const msg of messagesArray) {
        if (!msg.role || !msg.content) {
          throw new Error('Each message must have role and content properties')
        }
      }

      return {
        messages: messagesArray,
      }
    },
  },

  transformResponse: async (response, params) => {
    const threadId = params.threadId

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Zep API error (${response.status}): ${error || response.statusText}`)
    }

    const text = await response.text()
    if (!text || text.trim() === '') {
      return {
        success: true,
        output: {
          threadId,
          added: true,
          messageIds: [],
        },
      }
    }

    const data = JSON.parse(text)

    return {
      success: true,
      output: {
        threadId,
        added: true,
        messageIds: data.message_uuids || [],
      },
    }
  },

  outputs: {
    threadId: {
      type: 'string',
      description: 'The thread ID',
    },
    added: {
      type: 'boolean',
      description: 'Whether messages were added successfully',
    },
    messageIds: {
      type: 'array',
      description: 'Array of added message UUIDs',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: add_user.ts]---
Location: sim-main/apps/sim/tools/zep/add_user.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { ZepResponse } from '@/tools/zep/types'

// Add User Tool - Create a new user (Zep v3)
export const zepAddUserTool: ToolConfig<any, ZepResponse> = {
  id: 'zep_add_user',
  name: 'Add User',
  description: 'Create a new user in Zep',
  version: '1.0.0',

  params: {
    userId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Unique identifier for the user',
    },
    email: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'User email address',
    },
    firstName: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'User first name',
    },
    lastName: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'User last name',
    },
    metadata: {
      type: 'json',
      required: false,
      visibility: 'user-only',
      description: 'Additional metadata as JSON object',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Zep API key',
    },
  },

  request: {
    url: 'https://api.getzep.com/api/v2/users',
    method: 'POST',
    headers: (params) => ({
      Authorization: `Api-Key ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: Record<string, any> = {
        user_id: params.userId,
      }

      if (params.email) body.email = params.email
      if (params.firstName) body.first_name = params.firstName
      if (params.lastName) body.last_name = params.lastName

      if (params.metadata) {
        let metadataObj = params.metadata
        if (typeof metadataObj === 'string') {
          try {
            metadataObj = JSON.parse(metadataObj)
          } catch (_e) {
            throw new Error('Metadata must be a valid JSON object')
          }
        }
        body.metadata = metadataObj
      }

      return body
    },
  },

  transformResponse: async (response) => {
    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Zep API error (${response.status}): ${error || response.statusText}`)
    }

    const text = await response.text()
    if (!text || text.trim() === '') {
      return {
        success: true,
        output: {},
      }
    }

    const data = JSON.parse(text)

    return {
      success: true,
      output: {
        userId: data.user_id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        uuid: data.uuid,
        createdAt: data.created_at,
        metadata: data.metadata,
      },
    }
  },

  outputs: {
    userId: {
      type: 'string',
      description: 'The user ID',
    },
    email: {
      type: 'string',
      description: 'User email',
    },
    firstName: {
      type: 'string',
      description: 'User first name',
    },
    lastName: {
      type: 'string',
      description: 'User last name',
    },
    uuid: {
      type: 'string',
      description: 'Internal UUID',
    },
    createdAt: {
      type: 'string',
      description: 'Creation timestamp',
    },
    metadata: {
      type: 'object',
      description: 'User metadata',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_thread.ts]---
Location: sim-main/apps/sim/tools/zep/create_thread.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { ZepResponse } from '@/tools/zep/types'

// Create Thread Tool - Start a new thread (Zep v3)
export const zepCreateThreadTool: ToolConfig<any, ZepResponse> = {
  id: 'zep_create_thread',
  name: 'Create Thread',
  description: 'Start a new conversation thread in Zep',
  version: '1.0.0',

  params: {
    threadId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Unique identifier for the thread',
    },
    userId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'User ID associated with the thread',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Zep API key',
    },
  },

  request: {
    url: 'https://api.getzep.com/api/v2/threads',
    method: 'POST',
    headers: (params) => ({
      Authorization: `Api-Key ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      thread_id: params.threadId,
      user_id: params.userId,
    }),
  },

  transformResponse: async (response) => {
    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Zep API error (${response.status}): ${error || response.statusText}`)
    }

    const text = await response.text()
    if (!text || text.trim() === '') {
      return {
        success: true,
        output: {},
      }
    }

    const data = JSON.parse(text)

    return {
      success: true,
      output: {
        threadId: data.thread_id,
        userId: data.user_id,
        uuid: data.uuid,
        createdAt: data.created_at,
        projectUuid: data.project_uuid,
      },
    }
  },

  outputs: {
    threadId: {
      type: 'string',
      description: 'The thread ID',
    },
    userId: {
      type: 'string',
      description: 'The user ID',
    },
    uuid: {
      type: 'string',
      description: 'Internal UUID',
    },
    createdAt: {
      type: 'string',
      description: 'Creation timestamp',
    },
    projectUuid: {
      type: 'string',
      description: 'Project UUID',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_thread.ts]---
Location: sim-main/apps/sim/tools/zep/delete_thread.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { ZepResponse } from '@/tools/zep/types'

// Delete Thread Tool - Delete a thread (Zep v3)
export const zepDeleteThreadTool: ToolConfig<any, ZepResponse> = {
  id: 'zep_delete_thread',
  name: 'Delete Thread',
  description: 'Delete a conversation thread from Zep',
  version: '1.0.0',

  params: {
    threadId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Thread ID to delete',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Zep API key',
    },
  },

  request: {
    url: (params) => `https://api.getzep.com/api/v2/threads/${params.threadId}`,
    method: 'DELETE',
    headers: (params) => ({
      Authorization: `Api-Key ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response) => {
    const text = await response.text()

    if (!response.ok) {
      throw new Error(`Zep API error (${response.status}): ${text || response.statusText}`)
    }

    return {
      success: true,
      output: {
        deleted: true,
      },
    }
  },

  outputs: {
    deleted: {
      type: 'boolean',
      description: 'Whether the thread was deleted',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_context.ts]---
Location: sim-main/apps/sim/tools/zep/get_context.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { ZepResponse } from '@/tools/zep/types'

// Get User Context Tool - Retrieve user context with mode (Zep v3)
export const zepGetContextTool: ToolConfig<any, ZepResponse> = {
  id: 'zep_get_context',
  name: 'Get User Context',
  description: 'Retrieve user context from a thread with summary or basic mode',
  version: '1.0.0',

  params: {
    threadId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Thread ID to get context from',
    },
    mode: {
      type: 'string',
      required: false,
      default: 'summary',
      visibility: 'user-only',
      description: 'Context mode: "summary" (natural language) or "basic" (raw facts)',
    },
    minRating: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Minimum rating by which to filter relevant facts',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Zep API key',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()
      const mode = params.mode || 'summary'
      queryParams.append('mode', mode)
      if (params.minRating !== undefined)
        queryParams.append('minRating', String(Number(params.minRating)))
      return `https://api.getzep.com/api/v2/threads/${params.threadId}/context?${queryParams.toString()}`
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Api-Key ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response) => {
    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Zep API error (${response.status}): ${error || response.statusText}`)
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        context: data.context,
      },
    }
  },

  outputs: {
    context: {
      type: 'string',
      description: 'The context string (summary or basic mode)',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_messages.ts]---
Location: sim-main/apps/sim/tools/zep/get_messages.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { ZepResponse } from '@/tools/zep/types'

// Get Messages Tool - Retrieve messages from a thread (Zep v3)
export const zepGetMessagesTool: ToolConfig<any, ZepResponse> = {
  id: 'zep_get_messages',
  name: 'Get Messages',
  description: 'Retrieve messages from a thread',
  version: '1.0.0',

  params: {
    threadId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Thread ID to get messages from',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Maximum number of messages to return',
    },
    cursor: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Cursor for pagination',
    },
    lastn: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of most recent messages to return (overrides limit and cursor)',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Zep API key',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()
      if (params.limit) queryParams.append('limit', String(Number(params.limit)))
      if (params.cursor) queryParams.append('cursor', params.cursor)
      if (params.lastn) queryParams.append('lastn', String(Number(params.lastn)))

      const queryString = queryParams.toString()
      return `https://api.getzep.com/api/v2/threads/${params.threadId}/messages${queryString ? `?${queryString}` : ''}`
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Api-Key ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response) => {
    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Zep API error (${response.status}): ${error || response.statusText}`)
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        messages: data.messages || [],
        rowCount: data.row_count,
        totalCount: data.total_count,
      },
    }
  },

  outputs: {
    messages: {
      type: 'array',
      description: 'Array of message objects',
    },
    rowCount: {
      type: 'number',
      description: 'Number of messages in this response',
    },
    totalCount: {
      type: 'number',
      description: 'Total number of messages in the thread',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_threads.ts]---
Location: sim-main/apps/sim/tools/zep/get_threads.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { ZepResponse } from '@/tools/zep/types'

// Get Threads Tool - List all threads (Zep v3)
export const zepGetThreadsTool: ToolConfig<any, ZepResponse> = {
  id: 'zep_get_threads',
  name: 'Get Threads',
  description: 'List all conversation threads',
  version: '1.0.0',

  params: {
    pageSize: {
      type: 'number',
      required: false,
      default: 10,
      visibility: 'user-only',
      description: 'Number of threads to retrieve per page',
    },
    pageNumber: {
      type: 'number',
      required: false,
      default: 1,
      visibility: 'user-only',
      description: 'Page number for pagination',
    },
    orderBy: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Field to order results by (created_at, updated_at, user_id, thread_id)',
    },
    asc: {
      type: 'boolean',
      required: false,
      default: false,
      visibility: 'user-only',
      description: 'Order direction: true for ascending, false for descending',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Zep API key',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()
      queryParams.append('page_size', String(Number(params.pageSize || 10)))
      queryParams.append('page_number', String(Number(params.pageNumber || 1)))
      if (params.orderBy) queryParams.append('order_by', params.orderBy)
      if (params.asc !== undefined) queryParams.append('asc', String(params.asc))
      return `https://api.getzep.com/api/v2/threads?${queryParams.toString()}`
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Api-Key ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response) => {
    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Zep API error (${response.status}): ${error || response.statusText}`)
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        threads: data.threads || [],
        responseCount: data.response_count,
        totalCount: data.total_count,
      },
    }
  },

  outputs: {
    threads: {
      type: 'array',
      description: 'Array of thread objects',
    },
    responseCount: {
      type: 'number',
      description: 'Number of threads in this response',
    },
    totalCount: {
      type: 'number',
      description: 'Total number of threads available',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_user.ts]---
Location: sim-main/apps/sim/tools/zep/get_user.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { ZepResponse } from '@/tools/zep/types'

// Get User Tool - Retrieve user information (Zep v3)
export const zepGetUserTool: ToolConfig<any, ZepResponse> = {
  id: 'zep_get_user',
  name: 'Get User',
  description: 'Retrieve user information from Zep',
  version: '1.0.0',

  params: {
    userId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'User ID to retrieve',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Zep API key',
    },
  },

  request: {
    url: (params) => `https://api.getzep.com/api/v2/users/${params.userId}`,
    method: 'GET',
    headers: (params) => ({
      Authorization: `Api-Key ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response) => {
    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Zep API error (${response.status}): ${error || response.statusText}`)
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        userId: data.user_id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        uuid: data.uuid,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        metadata: data.metadata,
      },
    }
  },

  outputs: {
    userId: {
      type: 'string',
      description: 'The user ID',
    },
    email: {
      type: 'string',
      description: 'User email',
    },
    firstName: {
      type: 'string',
      description: 'User first name',
    },
    lastName: {
      type: 'string',
      description: 'User last name',
    },
    uuid: {
      type: 'string',
      description: 'Internal UUID',
    },
    createdAt: {
      type: 'string',
      description: 'Creation timestamp',
    },
    updatedAt: {
      type: 'string',
      description: 'Last update timestamp',
    },
    metadata: {
      type: 'object',
      description: 'User metadata',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_user_threads.ts]---
Location: sim-main/apps/sim/tools/zep/get_user_threads.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { ZepResponse } from '@/tools/zep/types'

// Get User Threads Tool - List all threads for a user (Zep v3)
export const zepGetUserThreadsTool: ToolConfig<any, ZepResponse> = {
  id: 'zep_get_user_threads',
  name: 'Get User Threads',
  description: 'List all conversation threads for a specific user',
  version: '1.0.0',

  params: {
    userId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'User ID to get threads for',
    },
    limit: {
      type: 'number',
      required: false,
      default: 10,
      visibility: 'user-only',
      description: 'Maximum number of threads to return',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Zep API key',
    },
  },

  request: {
    url: (params) => {
      const limit = Number(params.limit || 10)
      return `https://api.getzep.com/api/v2/users/${params.userId}/threads?limit=${limit}`
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Api-Key ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response) => {
    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Zep API error (${response.status}): ${error || response.statusText}`)
    }

    const data = await response.json()
    const threads = data.threads || data || []

    return {
      success: true,
      output: {
        threads,
        totalCount: threads.length,
      },
    }
  },

  outputs: {
    threads: {
      type: 'array',
      description: 'Array of thread objects for this user',
    },
    totalCount: {
      type: 'number',
      description: 'Total number of threads returned',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/zep/index.ts

```typescript
import { zepAddMessagesTool } from '@/tools/zep/add_messages'
import { zepAddUserTool } from '@/tools/zep/add_user'
import { zepCreateThreadTool } from '@/tools/zep/create_thread'
import { zepDeleteThreadTool } from '@/tools/zep/delete_thread'
import { zepGetContextTool } from '@/tools/zep/get_context'
import { zepGetMessagesTool } from '@/tools/zep/get_messages'
import { zepGetThreadsTool } from '@/tools/zep/get_threads'
import { zepGetUserTool } from '@/tools/zep/get_user'
import { zepGetUserThreadsTool } from '@/tools/zep/get_user_threads'

export {
  zepCreateThreadTool,
  zepGetThreadsTool,
  zepDeleteThreadTool,
  zepGetContextTool,
  zepGetMessagesTool,
  zepAddMessagesTool,
  zepAddUserTool,
  zepGetUserTool,
  zepGetUserThreadsTool,
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/zep/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

// Zep v3 Response Type
export interface ZepResponse extends ToolResponse {
  output: {
    // Thread operations
    threadId?: string
    uuid?: string
    createdAt?: string
    updatedAt?: string
    projectUuid?: string
    threads?: any[]
    deleted?: boolean

    // Message operations
    messages?: any[]
    messageIds?: string[]
    added?: boolean

    // Context operations
    context?: string

    // User operations
    userId?: string
    email?: string
    firstName?: string
    lastName?: string
    metadata?: any

    // Counts
    totalCount?: number
  }
}
```

--------------------------------------------------------------------------------

---[FILE: create_meeting.ts]---
Location: sim-main/apps/sim/tools/zoom/create_meeting.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { ZoomCreateMeetingParams, ZoomCreateMeetingResponse } from '@/tools/zoom/types'

export const zoomCreateMeetingTool: ToolConfig<ZoomCreateMeetingParams, ZoomCreateMeetingResponse> =
  {
    id: 'zoom_create_meeting',
    name: 'Zoom Create Meeting',
    description: 'Create a new Zoom meeting',
    version: '1.0.0',

    oauth: {
      required: true,
      provider: 'zoom',
      requiredScopes: ['meeting:write:meeting'],
    },

    params: {
      userId: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'The user ID or email address. Use "me" for the authenticated user.',
      },
      topic: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description: 'Meeting topic',
      },
      type: {
        type: 'number',
        required: false,
        visibility: 'user-or-llm',
        description:
          'Meeting type: 1=instant, 2=scheduled, 3=recurring no fixed time, 8=recurring fixed time',
      },
      startTime: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Meeting start time in ISO 8601 format (e.g., 2025-06-03T10:00:00Z)',
      },
      duration: {
        type: 'number',
        required: false,
        visibility: 'user-or-llm',
        description: 'Meeting duration in minutes',
      },
      timezone: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Timezone for the meeting (e.g., America/Los_Angeles)',
      },
      password: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Meeting password',
      },
      agenda: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Meeting agenda',
      },
      hostVideo: {
        type: 'boolean',
        required: false,
        visibility: 'user-or-llm',
        description: 'Start with host video on',
      },
      participantVideo: {
        type: 'boolean',
        required: false,
        visibility: 'user-or-llm',
        description: 'Start with participant video on',
      },
      joinBeforeHost: {
        type: 'boolean',
        required: false,
        visibility: 'user-or-llm',
        description: 'Allow participants to join before host',
      },
      muteUponEntry: {
        type: 'boolean',
        required: false,
        visibility: 'user-or-llm',
        description: 'Mute participants upon entry',
      },
      waitingRoom: {
        type: 'boolean',
        required: false,
        visibility: 'user-or-llm',
        description: 'Enable waiting room',
      },
      autoRecording: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Auto recording setting: local, cloud, or none',
      },
    },

    request: {
      url: (params) => `https://api.zoom.us/v2/users/${encodeURIComponent(params.userId)}/meetings`,
      method: 'POST',
      headers: (params) => {
        if (!params.accessToken) {
          throw new Error('Missing access token for Zoom API request')
        }
        return {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${params.accessToken}`,
        }
      },
      body: (params) => {
        if (!params.topic || !params.topic.trim()) {
          throw new Error('Topic is required to create a Zoom meeting')
        }

        const body: Record<string, any> = {
          topic: params.topic,
          type: params.type || 2, // Default to scheduled meeting
        }

        if (params.startTime) {
          body.start_time = params.startTime
        }
        if (params.duration != null) {
          body.duration = params.duration
        }
        if (params.timezone) {
          body.timezone = params.timezone
        }
        if (params.password) {
          body.password = params.password
        }
        if (params.agenda) {
          body.agenda = params.agenda
        }

        // Build settings object
        const settings: Record<string, any> = {}
        if (params.hostVideo != null) {
          settings.host_video = params.hostVideo
        }
        if (params.participantVideo != null) {
          settings.participant_video = params.participantVideo
        }
        if (params.joinBeforeHost != null) {
          settings.join_before_host = params.joinBeforeHost
        }
        if (params.muteUponEntry != null) {
          settings.mute_upon_entry = params.muteUponEntry
        }
        if (params.waitingRoom != null) {
          settings.waiting_room = params.waitingRoom
        }
        if (params.autoRecording) {
          settings.auto_recording = params.autoRecording
        }

        if (Object.keys(settings).length > 0) {
          body.settings = settings
        }

        return body
      },
    },

    transformResponse: async (response) => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          error: errorData.message || `Zoom API error: ${response.status} ${response.statusText}`,
          output: { meeting: {} as any },
        }
      }

      const data = await response.json()

      return {
        success: true,
        output: {
          meeting: {
            id: data.id,
            uuid: data.uuid,
            host_id: data.host_id,
            host_email: data.host_email,
            topic: data.topic,
            type: data.type,
            status: data.status,
            start_time: data.start_time,
            duration: data.duration,
            timezone: data.timezone,
            agenda: data.agenda,
            created_at: data.created_at,
            start_url: data.start_url,
            join_url: data.join_url,
            password: data.password,
            h323_password: data.h323_password,
            pstn_password: data.pstn_password,
            encrypted_password: data.encrypted_password,
            settings: data.settings,
          },
        },
      }
    },

    outputs: {
      meeting: {
        type: 'object',
        description: 'The created meeting with all its properties',
        properties: {
          id: { type: 'number', description: 'Meeting ID' },
          uuid: { type: 'string', description: 'Meeting UUID' },
          host_id: { type: 'string', description: 'Host user ID' },
          host_email: { type: 'string', description: 'Host email' },
          topic: { type: 'string', description: 'Meeting topic' },
          type: { type: 'number', description: 'Meeting type' },
          status: { type: 'string', description: 'Meeting status' },
          start_time: { type: 'string', description: 'Start time' },
          duration: { type: 'number', description: 'Duration in minutes' },
          timezone: { type: 'string', description: 'Timezone' },
          agenda: { type: 'string', description: 'Meeting agenda' },
          created_at: { type: 'string', description: 'Creation timestamp' },
          start_url: { type: 'string', description: 'Host start URL' },
          join_url: { type: 'string', description: 'Participant join URL' },
          password: { type: 'string', description: 'Meeting password' },
          settings: { type: 'object', description: 'Meeting settings' },
        },
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: delete_meeting.ts]---
Location: sim-main/apps/sim/tools/zoom/delete_meeting.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { ZoomDeleteMeetingParams, ZoomDeleteMeetingResponse } from '@/tools/zoom/types'

export const zoomDeleteMeetingTool: ToolConfig<ZoomDeleteMeetingParams, ZoomDeleteMeetingResponse> =
  {
    id: 'zoom_delete_meeting',
    name: 'Zoom Delete Meeting',
    description: 'Delete or cancel a Zoom meeting',
    version: '1.0.0',

    oauth: {
      required: true,
      provider: 'zoom',
      requiredScopes: ['meeting:delete:meeting'],
    },

    params: {
      meetingId: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description: 'The meeting ID to delete',
      },
      occurrenceId: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Occurrence ID for deleting a specific occurrence of a recurring meeting',
      },
      scheduleForReminder: {
        type: 'boolean',
        required: false,
        visibility: 'user-or-llm',
        description: 'Send cancellation reminder email to registrants',
      },
      cancelMeetingReminder: {
        type: 'boolean',
        required: false,
        visibility: 'user-or-llm',
        description: 'Send cancellation email to registrants and alternative hosts',
      },
    },

    request: {
      url: (params) => {
        const baseUrl = `https://api.zoom.us/v2/meetings/${encodeURIComponent(params.meetingId)}`
        const queryParams = new URLSearchParams()

        if (params.occurrenceId) {
          queryParams.append('occurrence_id', params.occurrenceId)
        }
        if (params.scheduleForReminder != null) {
          queryParams.append('schedule_for_reminder', String(params.scheduleForReminder))
        }
        if (params.cancelMeetingReminder != null) {
          queryParams.append('cancel_meeting_reminder', String(params.cancelMeetingReminder))
        }

        const queryString = queryParams.toString()
        return queryString ? `${baseUrl}?${queryString}` : baseUrl
      },
      method: 'DELETE',
      headers: (params) => {
        if (!params.accessToken) {
          throw new Error('Missing access token for Zoom API request')
        }
        return {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${params.accessToken}`,
        }
      },
    },

    transformResponse: async (response) => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          error: errorData.message || `Zoom API error: ${response.status} ${response.statusText}`,
          output: { success: false },
        }
      }

      // Zoom returns 204 No Content on successful deletion
      return {
        success: true,
        output: {
          success: true,
        },
      }
    },

    outputs: {
      success: {
        type: 'boolean',
        description: 'Whether the meeting was deleted successfully',
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: delete_recording.ts]---
Location: sim-main/apps/sim/tools/zoom/delete_recording.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { ZoomDeleteRecordingParams, ZoomDeleteRecordingResponse } from '@/tools/zoom/types'

export const zoomDeleteRecordingTool: ToolConfig<
  ZoomDeleteRecordingParams,
  ZoomDeleteRecordingResponse
> = {
  id: 'zoom_delete_recording',
  name: 'Zoom Delete Recording',
  description: 'Delete cloud recordings for a Zoom meeting',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'zoom',
    requiredScopes: ['cloud_recording:delete:recording_file'],
  },

  params: {
    meetingId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The meeting ID or meeting UUID',
    },
    recordingId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Specific recording file ID to delete. If not provided, deletes all recordings.',
    },
    action: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Delete action: "trash" (move to trash) or "delete" (permanently delete)',
    },
  },

  request: {
    url: (params) => {
      let baseUrl = `https://api.zoom.us/v2/meetings/${encodeURIComponent(params.meetingId)}/recordings`

      if (params.recordingId) {
        baseUrl += `/${encodeURIComponent(params.recordingId)}`
      }

      const queryParams = new URLSearchParams()
      if (params.action) {
        queryParams.append('action', params.action)
      }

      const queryString = queryParams.toString()
      return queryString ? `${baseUrl}?${queryString}` : baseUrl
    },
    method: 'DELETE',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Missing access token for Zoom API request')
      }
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
  },

  transformResponse: async (response) => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        error: errorData.message || `Zoom API error: ${response.status} ${response.statusText}`,
        output: { success: false },
      }
    }

    // Zoom returns 204 No Content on successful deletion
    return {
      success: true,
      output: {
        success: true,
      },
    }
  },

  outputs: {
    success: {
      type: 'boolean',
      description: 'Whether the recording was deleted successfully',
    },
  },
}
```

--------------------------------------------------------------------------------

````
