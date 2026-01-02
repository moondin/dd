---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 714
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 714 of 933)

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

---[FILE: get_member.ts]---
Location: sim-main/apps/sim/tools/mailchimp/get_member.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildMailchimpUrl, handleMailchimpError, type MailchimpMember } from './types'

const logger = createLogger('MailchimpGetMember')

export interface MailchimpGetMemberParams {
  apiKey: string
  listId: string
  subscriberEmail: string
}

export interface MailchimpGetMemberResponse {
  success: boolean
  output: {
    member: MailchimpMember
    metadata: {
      operation: 'get_member'
      subscriberHash: string
    }
    success: boolean
  }
}

export const mailchimpGetMemberTool: ToolConfig<
  MailchimpGetMemberParams,
  MailchimpGetMemberResponse
> = {
  id: 'mailchimp_get_member',
  name: 'Get Member from Mailchimp Audience',
  description: 'Retrieve details of a specific member from a Mailchimp audience',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Mailchimp API key with server prefix',
    },
    listId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The unique ID for the list',
    },
    subscriberEmail: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Member email address or MD5 hash',
    },
  },

  request: {
    url: (params) =>
      buildMailchimpUrl(params.apiKey, `/lists/${params.listId}/members/${params.subscriberEmail}`),
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'get_member')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        member: data,
        metadata: {
          operation: 'get_member' as const,
          subscriberHash: data.id,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Member data and metadata',
      properties: {
        member: { type: 'object', description: 'Member object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_members.ts]---
Location: sim-main/apps/sim/tools/mailchimp/get_members.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildMailchimpUrl, handleMailchimpError, type MailchimpMember } from './types'

const logger = createLogger('MailchimpGetMembers')

export interface MailchimpGetMembersParams {
  apiKey: string
  listId: string
  status?: string
  count?: string
  offset?: string
}

export interface MailchimpGetMembersResponse {
  success: boolean
  output: {
    members: MailchimpMember[]
    totalItems: number
    metadata: {
      operation: 'get_members'
      totalReturned: number
    }
    success: boolean
  }
}

export const mailchimpGetMembersTool: ToolConfig<
  MailchimpGetMembersParams,
  MailchimpGetMembersResponse
> = {
  id: 'mailchimp_get_members',
  name: 'Get Members from Mailchimp Audience',
  description: 'Retrieve a list of members from a Mailchimp audience',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Mailchimp API key with server prefix',
    },
    listId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The unique ID for the list',
    },
    status: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Filter by status (subscribed, unsubscribed, cleaned, pending)',
    },
    count: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Number of results (default: 10, max: 1000)',
    },
    offset: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Number of results to skip',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()
      if (params.status) queryParams.append('status', params.status)
      if (params.count) queryParams.append('count', params.count)
      if (params.offset) queryParams.append('offset', params.offset)

      const query = queryParams.toString()
      const url = buildMailchimpUrl(params.apiKey, `/lists/${params.listId}/members`)
      return query ? `${url}?${query}` : url
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'get_members')
    }

    const data = await response.json()
    const members = data.members || []

    return {
      success: true,
      output: {
        members,
        totalItems: data.total_items || members.length,
        metadata: {
          operation: 'get_members' as const,
          totalReturned: members.length,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Members data and metadata',
      properties: {
        members: { type: 'array', description: 'Array of member objects' },
        totalItems: { type: 'number', description: 'Total number of members' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_member_tags.ts]---
Location: sim-main/apps/sim/tools/mailchimp/get_member_tags.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildMailchimpUrl, handleMailchimpError, type MailchimpTag } from './types'

const logger = createLogger('MailchimpGetMemberTags')

export interface MailchimpGetMemberTagsParams {
  apiKey: string
  listId: string
  subscriberEmail: string
}

export interface MailchimpGetMemberTagsResponse {
  success: boolean
  output: {
    tags: MailchimpTag[]
    totalItems: number
    metadata: {
      operation: 'get_member_tags'
      totalReturned: number
    }
    success: boolean
  }
}

export const mailchimpGetMemberTagsTool: ToolConfig<
  MailchimpGetMemberTagsParams,
  MailchimpGetMemberTagsResponse
> = {
  id: 'mailchimp_get_member_tags',
  name: 'Get Member Tags from Mailchimp',
  description: 'Retrieve tags associated with a member in a Mailchimp audience',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Mailchimp API key with server prefix',
    },
    listId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The unique ID for the list',
    },
    subscriberEmail: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Member email address or MD5 hash',
    },
  },

  request: {
    url: (params) =>
      buildMailchimpUrl(
        params.apiKey,
        `/lists/${params.listId}/members/${params.subscriberEmail}/tags`
      ),
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'get_member_tags')
    }

    const data = await response.json()
    const tags = data.tags || []

    return {
      success: true,
      output: {
        tags,
        totalItems: data.total_items || tags.length,
        metadata: {
          operation: 'get_member_tags' as const,
          totalReturned: tags.length,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Member tags data and metadata',
      properties: {
        tags: { type: 'array', description: 'Array of tag objects' },
        totalItems: { type: 'number', description: 'Total number of tags' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_merge_field.ts]---
Location: sim-main/apps/sim/tools/mailchimp/get_merge_field.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpGetMergeField')

export interface MailchimpGetMergeFieldParams {
  apiKey: string
  listId: string
  mergeId: string
}

export interface MailchimpGetMergeFieldResponse {
  success: boolean
  output: {
    mergeField: any
    metadata: {
      operation: 'get_merge_field'
      mergeId: string
    }
    success: boolean
  }
}

export const mailchimpGetMergeFieldTool: ToolConfig<
  MailchimpGetMergeFieldParams,
  MailchimpGetMergeFieldResponse
> = {
  id: 'mailchimp_get_merge_field',
  name: 'Get Merge Field from Mailchimp Audience',
  description: 'Retrieve details of a specific merge field from a Mailchimp audience',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Mailchimp API key with server prefix',
    },
    listId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The unique ID for the list',
    },
    mergeId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The unique ID for the merge field',
    },
  },

  request: {
    url: (params) =>
      buildMailchimpUrl(params.apiKey, `/lists/${params.listId}/merge-fields/${params.mergeId}`),
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'get_merge_field')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        mergeField: data,
        metadata: {
          operation: 'get_merge_field' as const,
          mergeId: data.merge_id,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Merge field data and metadata',
      properties: {
        mergeField: { type: 'object', description: 'Merge field object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_merge_fields.ts]---
Location: sim-main/apps/sim/tools/mailchimp/get_merge_fields.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import type { MailchimpMergeField } from './types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpGetMergeFields')

export interface MailchimpGetMergeFieldsParams {
  apiKey: string
  listId: string
  count?: string
  offset?: string
}

export interface MailchimpGetMergeFieldsResponse {
  success: boolean
  output: {
    mergeFields: MailchimpMergeField[]
    totalItems: number
    metadata: {
      operation: 'get_merge_fields'
      totalReturned: number
    }
    success: boolean
  }
}

export const mailchimpGetMergeFieldsTool: ToolConfig<
  MailchimpGetMergeFieldsParams,
  MailchimpGetMergeFieldsResponse
> = {
  id: 'mailchimp_get_merge_fields',
  name: 'Get Merge Fields from Mailchimp Audience',
  description: 'Retrieve a list of merge fields from a Mailchimp audience',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Mailchimp API key with server prefix',
    },
    listId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The unique ID for the list',
    },
    count: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Number of results (default: 10, max: 1000)',
    },
    offset: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Number of results to skip',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()
      if (params.count) queryParams.append('count', params.count)
      if (params.offset) queryParams.append('offset', params.offset)

      const query = queryParams.toString()
      const url = buildMailchimpUrl(params.apiKey, `/lists/${params.listId}/merge-fields`)
      return query ? `${url}?${query}` : url
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'get_merge_fields')
    }

    const data = await response.json()
    const mergeFields = data.merge_fields || []

    return {
      success: true,
      output: {
        mergeFields,
        totalItems: data.total_items || mergeFields.length,
        metadata: {
          operation: 'get_merge_fields' as const,
          totalReturned: mergeFields.length,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Merge fields data and metadata',
      properties: {
        mergeFields: { type: 'array', description: 'Array of merge field objects' },
        totalItems: { type: 'number', description: 'Total number of merge fields' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_segment.ts]---
Location: sim-main/apps/sim/tools/mailchimp/get_segment.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import type { MailchimpSegment } from './types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpGetSegment')

export interface MailchimpGetSegmentParams {
  apiKey: string
  listId: string
  segmentId: string
}

export interface MailchimpGetSegmentResponse {
  success: boolean
  output: {
    segment: MailchimpSegment
    metadata: {
      operation: 'get_segment'
      segmentId: string
    }
    success: boolean
  }
}

export const mailchimpGetSegmentTool: ToolConfig<
  MailchimpGetSegmentParams,
  MailchimpGetSegmentResponse
> = {
  id: 'mailchimp_get_segment',
  name: 'Get Segment from Mailchimp Audience',
  description: 'Retrieve details of a specific segment from a Mailchimp audience',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Mailchimp API key with server prefix',
    },
    listId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The unique ID for the list',
    },
    segmentId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The unique ID for the segment',
    },
  },

  request: {
    url: (params) =>
      buildMailchimpUrl(params.apiKey, `/lists/${params.listId}/segments/${params.segmentId}`),
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'get_segment')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        segment: data,
        metadata: {
          operation: 'get_segment' as const,
          segmentId: data.id,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Segment data and metadata',
      properties: {
        segment: { type: 'object', description: 'Segment object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_segments.ts]---
Location: sim-main/apps/sim/tools/mailchimp/get_segments.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpGetSegments')

export interface MailchimpGetSegmentsParams {
  apiKey: string
  listId: string
  count?: string
  offset?: string
}

export interface MailchimpGetSegmentsResponse {
  success: boolean
  output: {
    segments: any[]
    totalItems: number
    metadata: {
      operation: 'get_segments'
      totalReturned: number
    }
    success: boolean
  }
}

export const mailchimpGetSegmentsTool: ToolConfig<
  MailchimpGetSegmentsParams,
  MailchimpGetSegmentsResponse
> = {
  id: 'mailchimp_get_segments',
  name: 'Get Segments from Mailchimp Audience',
  description: 'Retrieve a list of segments from a Mailchimp audience',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Mailchimp API key with server prefix',
    },
    listId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The unique ID for the list',
    },
    count: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Number of results (default: 10, max: 1000)',
    },
    offset: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Number of results to skip',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()
      if (params.count) queryParams.append('count', params.count)
      if (params.offset) queryParams.append('offset', params.offset)

      const query = queryParams.toString()
      const url = buildMailchimpUrl(params.apiKey, `/lists/${params.listId}/segments`)
      return query ? `${url}?${query}` : url
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'get_segments')
    }

    const data = await response.json()
    const segments = data.segments || []

    return {
      success: true,
      output: {
        segments,
        totalItems: data.total_items || segments.length,
        metadata: {
          operation: 'get_segments' as const,
          totalReturned: segments.length,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Segments data and metadata',
      properties: {
        segments: { type: 'array', description: 'Array of segment objects' },
        totalItems: { type: 'number', description: 'Total number of segments' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_segment_members.ts]---
Location: sim-main/apps/sim/tools/mailchimp/get_segment_members.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import type { MailchimpMember } from './types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpGetSegmentMembers')

export interface MailchimpGetSegmentMembersParams {
  apiKey: string
  listId: string
  segmentId: string
  count?: string
  offset?: string
}

export interface MailchimpGetSegmentMembersResponse {
  success: boolean
  output: {
    members: MailchimpMember[]
    totalItems: number
    metadata: {
      operation: 'get_segment_members'
      totalReturned: number
    }
    success: boolean
  }
}

export const mailchimpGetSegmentMembersTool: ToolConfig<
  MailchimpGetSegmentMembersParams,
  MailchimpGetSegmentMembersResponse
> = {
  id: 'mailchimp_get_segment_members',
  name: 'Get Segment Members from Mailchimp',
  description: 'Retrieve members of a specific segment from a Mailchimp audience',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Mailchimp API key with server prefix',
    },
    listId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The unique ID for the list',
    },
    segmentId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The unique ID for the segment',
    },
    count: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Number of results (default: 10, max: 1000)',
    },
    offset: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Number of results to skip',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()
      if (params.count) queryParams.append('count', params.count)
      if (params.offset) queryParams.append('offset', params.offset)

      const query = queryParams.toString()
      const url = buildMailchimpUrl(
        params.apiKey,
        `/lists/${params.listId}/segments/${params.segmentId}/members`
      )
      return query ? `${url}?${query}` : url
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'get_segment_members')
    }

    const data = await response.json()
    const members = data.members || []

    return {
      success: true,
      output: {
        members,
        totalItems: data.total_items || members.length,
        metadata: {
          operation: 'get_segment_members' as const,
          totalReturned: members.length,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Segment members data and metadata',
      properties: {
        members: { type: 'array', description: 'Array of member objects' },
        totalItems: { type: 'number', description: 'Total number of members' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_template.ts]---
Location: sim-main/apps/sim/tools/mailchimp/get_template.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import type { MailchimpTemplate } from './types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpGetTemplate')

export interface MailchimpGetTemplateParams {
  apiKey: string
  templateId: string
}

export interface MailchimpGetTemplateResponse {
  success: boolean
  output: {
    template: MailchimpTemplate
    metadata: {
      operation: 'get_template'
      templateId: string
    }
    success: boolean
  }
}

export const mailchimpGetTemplateTool: ToolConfig<
  MailchimpGetTemplateParams,
  MailchimpGetTemplateResponse
> = {
  id: 'mailchimp_get_template',
  name: 'Get Template from Mailchimp',
  description: 'Retrieve details of a specific template from Mailchimp',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Mailchimp API key with server prefix',
    },
    templateId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The unique ID for the template',
    },
  },

  request: {
    url: (params) => buildMailchimpUrl(params.apiKey, `/templates/${params.templateId}`),
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'get_template')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        template: data,
        metadata: {
          operation: 'get_template' as const,
          templateId: data.id,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Template data and metadata',
      properties: {
        template: { type: 'object', description: 'Template object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_templates.ts]---
Location: sim-main/apps/sim/tools/mailchimp/get_templates.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import type { MailchimpTemplate } from './types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpGetTemplates')

export interface MailchimpGetTemplatesParams {
  apiKey: string
  count?: string
  offset?: string
}

export interface MailchimpGetTemplatesResponse {
  success: boolean
  output: {
    templates: MailchimpTemplate[]
    totalItems: number
    metadata: {
      operation: 'get_templates'
      totalReturned: number
    }
    success: boolean
  }
}

export const mailchimpGetTemplatesTool: ToolConfig<
  MailchimpGetTemplatesParams,
  MailchimpGetTemplatesResponse
> = {
  id: 'mailchimp_get_templates',
  name: 'Get Templates from Mailchimp',
  description: 'Retrieve a list of templates from Mailchimp',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Mailchimp API key with server prefix',
    },
    count: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Number of results (default: 10, max: 1000)',
    },
    offset: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Number of results to skip',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()
      if (params.count) queryParams.append('count', params.count)
      if (params.offset) queryParams.append('offset', params.offset)

      const query = queryParams.toString()
      const url = buildMailchimpUrl(params.apiKey, '/templates')
      return query ? `${url}?${query}` : url
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'get_templates')
    }

    const data = await response.json()
    const templates = data.templates || []

    return {
      success: true,
      output: {
        templates,
        totalItems: data.total_items || templates.length,
        metadata: {
          operation: 'get_templates' as const,
          totalReturned: templates.length,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Templates data and metadata',
      properties: {
        templates: { type: 'array', description: 'Array of template objects' },
        totalItems: { type: 'number', description: 'Total number of templates' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/mailchimp/index.ts

```typescript
// Audience/List tools

export { mailchimpAddMemberTool } from './add_member'
export { mailchimpAddMemberTagsTool } from './add_member_tags'
export { mailchimpAddOrUpdateMemberTool } from './add_or_update_member'
export { mailchimpAddSegmentMemberTool } from './add_segment_member'
export { mailchimpAddSubscriberToAutomationTool } from './add_subscriber_to_automation'
export { mailchimpArchiveMemberTool } from './archive_member'
export { mailchimpCreateAudienceTool } from './create_audience'
export { mailchimpCreateBatchOperationTool } from './create_batch_operation'
export { mailchimpCreateCampaignTool } from './create_campaign'
export { mailchimpCreateInterestTool } from './create_interest'
export { mailchimpCreateInterestCategoryTool } from './create_interest_category'
export { mailchimpCreateLandingPageTool } from './create_landing_page'
export { mailchimpCreateMergeFieldTool } from './create_merge_field'
export { mailchimpCreateSegmentTool } from './create_segment'
export { mailchimpCreateTemplateTool } from './create_template'
export { mailchimpDeleteAudienceTool } from './delete_audience'
export { mailchimpDeleteBatchOperationTool } from './delete_batch_operation'
export { mailchimpDeleteCampaignTool } from './delete_campaign'
export { mailchimpDeleteInterestTool } from './delete_interest'
export { mailchimpDeleteInterestCategoryTool } from './delete_interest_category'
export { mailchimpDeleteLandingPageTool } from './delete_landing_page'
export { mailchimpDeleteMemberTool } from './delete_member'
export { mailchimpDeleteMergeFieldTool } from './delete_merge_field'
export { mailchimpDeleteSegmentTool } from './delete_segment'
export { mailchimpDeleteTemplateTool } from './delete_template'
export { mailchimpGetAudienceTool } from './get_audience'
export { mailchimpGetAudiencesTool } from './get_audiences'
export { mailchimpGetAutomationTool } from './get_automation'
// Automation tools
export { mailchimpGetAutomationsTool } from './get_automations'
export { mailchimpGetBatchOperationTool } from './get_batch_operation'
// Batch operation tools
export { mailchimpGetBatchOperationsTool } from './get_batch_operations'
export { mailchimpGetCampaignTool } from './get_campaign'
// Campaign content tools
export { mailchimpGetCampaignContentTool } from './get_campaign_content'
export { mailchimpGetCampaignReportTool } from './get_campaign_report'
// Report tools
export { mailchimpGetCampaignReportsTool } from './get_campaign_reports'
// Campaign tools
export { mailchimpGetCampaignsTool } from './get_campaigns'
export { mailchimpGetInterestTool } from './get_interest'
// Interest category tools
export { mailchimpGetInterestCategoriesTool } from './get_interest_categories'
export { mailchimpGetInterestCategoryTool } from './get_interest_category'
// Interest tools
export { mailchimpGetInterestsTool } from './get_interests'
export { mailchimpGetLandingPageTool } from './get_landing_page'
// Landing page tools
export { mailchimpGetLandingPagesTool } from './get_landing_pages'
export { mailchimpGetMemberTool } from './get_member'
// Tag tools
export { mailchimpGetMemberTagsTool } from './get_member_tags'
// Member tools
export { mailchimpGetMembersTool } from './get_members'
export { mailchimpGetMergeFieldTool } from './get_merge_field'
// Merge field tools
export { mailchimpGetMergeFieldsTool } from './get_merge_fields'
export { mailchimpGetSegmentTool } from './get_segment'
export { mailchimpGetSegmentMembersTool } from './get_segment_members'
// Segment tools
export { mailchimpGetSegmentsTool } from './get_segments'
export { mailchimpGetTemplateTool } from './get_template'
// Template tools
export { mailchimpGetTemplatesTool } from './get_templates'
export { mailchimpPauseAutomationTool } from './pause_automation'
export { mailchimpPublishLandingPageTool } from './publish_landing_page'
export { mailchimpRemoveMemberTagsTool } from './remove_member_tags'
export { mailchimpRemoveSegmentMemberTool } from './remove_segment_member'
export { mailchimpReplicateCampaignTool } from './replicate_campaign'
export { mailchimpScheduleCampaignTool } from './schedule_campaign'
export { mailchimpSendCampaignTool } from './send_campaign'
export { mailchimpSetCampaignContentTool } from './set_campaign_content'
export { mailchimpStartAutomationTool } from './start_automation'
export { mailchimpUnarchiveMemberTool } from './unarchive_member'
export { mailchimpUnpublishLandingPageTool } from './unpublish_landing_page'
export { mailchimpUnscheduleCampaignTool } from './unschedule_campaign'
export { mailchimpUpdateAudienceTool } from './update_audience'
export { mailchimpUpdateCampaignTool } from './update_campaign'
export { mailchimpUpdateInterestTool } from './update_interest'
export { mailchimpUpdateInterestCategoryTool } from './update_interest_category'
export { mailchimpUpdateLandingPageTool } from './update_landing_page'
export { mailchimpUpdateMemberTool } from './update_member'
export { mailchimpUpdateMergeFieldTool } from './update_merge_field'
export { mailchimpUpdateSegmentTool } from './update_segment'
export { mailchimpUpdateTemplateTool } from './update_template'
```

--------------------------------------------------------------------------------

---[FILE: pause_automation.ts]---
Location: sim-main/apps/sim/tools/mailchimp/pause_automation.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpPauseAutomation')

export interface MailchimpPauseAutomationParams {
  apiKey: string
  workflowId: string
}

export interface MailchimpPauseAutomationResponse {
  success: boolean
  output: {
    metadata: {
      operation: 'pause_automation'
      workflowId: string
    }
    success: boolean
  }
}

export const mailchimpPauseAutomationTool: ToolConfig<
  MailchimpPauseAutomationParams,
  MailchimpPauseAutomationResponse
> = {
  id: 'mailchimp_pause_automation',
  name: 'Pause Automation in Mailchimp',
  description: 'Pause all emails in a Mailchimp automation workflow',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Mailchimp API key with server prefix',
    },
    workflowId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The unique ID for the automation workflow',
    },
  },

  request: {
    url: (params) =>
      buildMailchimpUrl(
        params.apiKey,
        `/automations/${params.workflowId}/actions/pause-all-emails`
      ),
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'pause_automation')
    }

    return {
      success: true,
      output: {
        metadata: {
          operation: 'pause_automation' as const,
          workflowId: '',
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Pause confirmation',
      properties: {
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

````
