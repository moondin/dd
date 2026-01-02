---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 658
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 658 of 933)

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

---[FILE: list_webhooks.ts]---
Location: sim-main/apps/sim/tools/calendly/list_webhooks.ts

```typescript
import type {
  CalendlyListWebhooksParams,
  CalendlyListWebhooksResponse,
} from '@/tools/calendly/types'
import type { ToolConfig } from '@/tools/types'

export const listWebhooksTool: ToolConfig<
  CalendlyListWebhooksParams,
  CalendlyListWebhooksResponse
> = {
  id: 'calendly_list_webhooks',
  name: 'Calendly List Webhooks',
  description: 'Retrieve a list of webhook subscriptions for an organization',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Calendly Personal Access Token',
    },
    organization: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Organization URI to list webhooks for',
    },
    count: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of results per page (default: 20, max: 100)',
    },
    pageToken: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Page token for pagination',
    },
    scope: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Filter by scope ("organization" or "user")',
    },
    user: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Filter webhooks by user URI (for user-scoped webhooks)',
    },
  },

  request: {
    url: (params: CalendlyListWebhooksParams) => {
      const url = 'https://api.calendly.com/webhook_subscriptions'
      const queryParams = []

      queryParams.push(`organization=${encodeURIComponent(params.organization)}`)

      if (params.count) {
        queryParams.push(`count=${Number(params.count)}`)
      }

      if (params.pageToken) {
        queryParams.push(`page_token=${encodeURIComponent(params.pageToken)}`)
      }

      if (params.scope) {
        queryParams.push(`scope=${encodeURIComponent(params.scope)}`)
      }

      if (params.user) {
        queryParams.push(`user=${encodeURIComponent(params.user)}`)
      }

      return `${url}?${queryParams.join('&')}`
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: data,
    }
  },

  outputs: {
    collection: {
      type: 'array',
      description: 'Array of webhook subscription objects',
      items: {
        type: 'object',
        properties: {
          uri: { type: 'string', description: 'Canonical reference to the webhook' },
          callback_url: { type: 'string', description: 'URL to receive webhook events' },
          created_at: { type: 'string', description: 'ISO timestamp of creation' },
          updated_at: { type: 'string', description: 'ISO timestamp of last update' },
          state: { type: 'string', description: 'Webhook state (active, disabled, etc.)' },
          events: {
            type: 'array',
            items: { type: 'string' },
            description: 'Event types this webhook subscribes to',
          },
          signing_key: { type: 'string', description: 'Key to verify webhook signatures' },
          scope: { type: 'string', description: 'Webhook scope (organization or user)' },
          organization: { type: 'string', description: 'Organization URI' },
          user: { type: 'string', description: 'User URI (for user-scoped webhooks)' },
          creator: { type: 'string', description: 'URI of user who created the webhook' },
        },
      },
    },
    pagination: {
      type: 'object',
      description: 'Pagination information',
      properties: {
        count: { type: 'number', description: 'Number of results in this page' },
        next_page: { type: 'string', description: 'URL to next page (if available)' },
        previous_page: { type: 'string', description: 'URL to previous page (if available)' },
        next_page_token: { type: 'string', description: 'Token for next page' },
        previous_page_token: { type: 'string', description: 'Token for previous page' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/calendly/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface CalendlyGetCurrentUserParams {
  apiKey: string
}

export interface CalendlyGetCurrentUserResponse extends ToolResponse {
  output: {
    resource: {
      uri: string
      name: string
      slug: string
      email: string
      scheduling_url: string
      timezone: string
      avatar_url: string
      created_at: string
      updated_at: string
      current_organization: string
      resource_type: string
      locale: string
    }
  }
}

export interface CalendlyListEventTypesParams {
  apiKey: string
  user?: string
  organization?: string
  count?: number
  pageToken?: string
  sort?: string
  active?: boolean
}

export interface CalendlyListEventTypesResponse extends ToolResponse {
  output: {
    collection: Array<{
      uri: string
      name: string
      active: boolean
      booking_method: string
      color: string
      created_at: string
      description_html: string
      description_plain: string
      duration: number
      internal_note: string
      kind: string
      pooling_type: string
      profile: {
        name: string
        owner: string
        type: string
      }
      scheduling_url: string
      slug: string
      type: string
      updated_at: string
    }>
    pagination: {
      count: number
      next_page: string | null
      previous_page: string | null
      next_page_token: string | null
      previous_page_token: string | null
    }
  }
}

export interface CalendlyGetEventTypeParams {
  apiKey: string
  eventTypeUuid: string
}

export interface CalendlyGetEventTypeResponse extends ToolResponse {
  output: {
    resource: {
      uri: string
      name: string
      active: boolean
      booking_method: string
      color: string
      created_at: string
      custom_questions: Array<{
        name: string
        type: string
        position: number
        enabled: boolean
        required: boolean
        answer_choices: string[]
        include_other: boolean
      }>
      deleted_at: string | null
      description_html: string
      description_plain: string
      duration: number
      internal_note: string
      kind: string
      pooling_type: string
      profile: {
        name: string
        owner: string
        type: string
      }
      scheduling_url: string
      slug: string
      type: string
      updated_at: string
    }
  }
}

export interface CalendlyListScheduledEventsParams {
  apiKey: string
  user?: string
  organization?: string
  invitee_email?: string
  count?: number
  max_start_time?: string
  min_start_time?: string
  pageToken?: string
  sort?: string
  status?: string
}

export interface CalendlyListScheduledEventsResponse extends ToolResponse {
  output: {
    collection: Array<{
      uri: string
      name: string
      status: string
      start_time: string
      end_time: string
      event_type: string
      location: {
        type: string
        location: string
        join_url?: string
        data?: Record<string, any>
      }
      invitees_counter: {
        total: number
        active: number
        limit: number
      }
      created_at: string
      updated_at: string
      event_memberships: Array<{
        user: string
        user_email: string
        user_name: string
      }>
      event_guests: Array<{
        email: string
        created_at: string
        updated_at: string
      }>
      cancellation?: {
        canceled_by: string
        reason: string
        canceler_type: string
      }
    }>
    pagination: {
      count: number
      next_page: string | null
      previous_page: string | null
      next_page_token: string | null
      previous_page_token: string | null
    }
  }
}

export interface CalendlyGetScheduledEventParams {
  apiKey: string
  eventUuid: string
}

export interface CalendlyGetScheduledEventResponse extends ToolResponse {
  output: {
    resource: {
      uri: string
      name: string
      status: string
      start_time: string
      end_time: string
      event_type: string
      location: {
        type: string
        location: string
        join_url?: string
        data?: Record<string, any>
      }
      invitees_counter: {
        total: number
        active: number
        limit: number
      }
      created_at: string
      updated_at: string
      event_memberships: Array<{
        user: string
        user_email: string
        user_name: string
      }>
      event_guests: Array<{
        email: string
        created_at: string
        updated_at: string
      }>
      cancellation?: {
        canceled_by: string
        reason: string
        canceler_type: string
      }
    }
  }
}

export interface CalendlyListEventInviteesParams {
  apiKey: string
  eventUuid: string
  count?: number
  email?: string
  pageToken?: string
  sort?: string
  status?: string
}

export interface CalendlyListEventInviteesResponse extends ToolResponse {
  output: {
    collection: Array<{
      uri: string
      email: string
      name: string
      first_name: string | null
      last_name: string | null
      status: string
      questions_and_answers: Array<{
        question: string
        answer: string
        position: number
      }>
      timezone: string
      event: string
      created_at: string
      updated_at: string
      tracking: {
        utm_campaign: string | null
        utm_source: string | null
        utm_medium: string | null
        utm_content: string | null
        utm_term: string | null
        salesforce_uuid: string | null
      }
      text_reminder_number: string | null
      rescheduled: boolean
      old_invitee: string | null
      new_invitee: string | null
      cancel_url: string
      reschedule_url: string
      cancellation?: {
        canceled_by: string
        reason: string
        canceler_type: string
      }
      payment?: {
        id: string
        provider: string
        amount: number
        currency: string
        terms: string
        successful: boolean
      }
      no_show?: {
        created_at: string
      }
      reconfirmation?: {
        created_at: string
        confirmed_at: string | null
      }
    }>
    pagination: {
      count: number
      next_page: string | null
      previous_page: string | null
      next_page_token: string | null
      previous_page_token: string | null
    }
  }
}

export interface CalendlyCancelEventParams {
  apiKey: string
  eventUuid: string
  reason?: string
}

export interface CalendlyCancelEventResponse extends ToolResponse {
  output: {
    resource: {
      canceler_type: string
      canceled_by: string
      reason: string | null
      created_at: string
    }
  }
}

export interface CalendlyListWebhooksParams {
  apiKey: string
  organization: string
  count?: number
  pageToken?: string
  scope?: string
  user?: string
}

export interface CalendlyListWebhooksResponse extends ToolResponse {
  output: {
    collection: Array<{
      uri: string
      callback_url: string
      created_at: string
      updated_at: string
      retry_started_at: string | null
      state: string
      events: string[]
      signing_key: string
      scope: string
      organization: string
      user?: string
      creator: string
    }>
    pagination: {
      count: number
      next_page: string | null
      previous_page: string | null
      next_page_token: string | null
      previous_page_token: string | null
    }
  }
}

export interface CalendlyCreateWebhookParams {
  apiKey: string
  url: string
  events: string[]
  organization: string
  user?: string
  scope: string
  signing_key?: string
}

export interface CalendlyCreateWebhookResponse extends ToolResponse {
  output: {
    resource: {
      uri: string
      callback_url: string
      created_at: string
      updated_at: string
      retry_started_at: string | null
      state: string
      events: string[]
      signing_key: string
      scope: string
      organization: string
      user?: string
      creator: string
    }
  }
}

export interface CalendlyDeleteWebhookParams {
  apiKey: string
  webhookUuid: string
}

export interface CalendlyDeleteWebhookResponse extends ToolResponse {
  output: {
    deleted: boolean
    message: string
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/clay/index.ts

```typescript
import { clayPopulateTool } from '@/tools/clay/populate'

export { clayPopulateTool }
```

--------------------------------------------------------------------------------

---[FILE: populate.ts]---
Location: sim-main/apps/sim/tools/clay/populate.ts

```typescript
import type { ClayPopulateParams, ClayPopulateResponse } from '@/tools/clay/types'
import type { ToolConfig } from '@/tools/types'

export const clayPopulateTool: ToolConfig<ClayPopulateParams, ClayPopulateResponse> = {
  id: 'clay_populate',
  name: 'Clay Populate',
  description:
    'Populate Clay with data from a JSON file. Enables direct communication and notifications with timestamp tracking and channel confirmation.',
  version: '1.0.0',

  params: {
    webhookURL: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The webhook URL to populate',
    },
    data: {
      type: 'json',
      required: true,
      visibility: 'user-or-llm',
      description: 'The data to populate',
    },
    authToken: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'Optional auth token for Clay webhook authentication (most webhooks do not require this)',
    },
  },

  request: {
    url: (params: ClayPopulateParams) => params.webhookURL,
    method: 'POST',
    headers: (params: ClayPopulateParams) => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }

      if (params.authToken && params.authToken.trim() !== '') {
        headers['x-clay-webhook-auth'] = params.authToken
      }

      return headers
    },
    body: (params: ClayPopulateParams) => ({
      data: params.data,
    }),
  },

  transformResponse: async (response: Response) => {
    const contentType = response.headers.get('content-type')
    const timestamp = new Date().toISOString()

    // Extract response headers
    const headers: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      headers[key] = value
    })

    // Parse response body
    let responseData
    if (contentType?.includes('application/json')) {
      responseData = await response.json()
    } else {
      responseData = await response.text()
    }

    return {
      success: true,
      output: {
        data: contentType?.includes('application/json') ? responseData : { message: responseData },
        metadata: {
          status: response.status,
          statusText: response.statusText,
          headers: headers,
          timestamp: timestamp,
          contentType: contentType || 'unknown',
        },
      },
    }
  },

  outputs: {
    data: {
      type: 'json',
      description: 'Response data from Clay webhook',
    },
    metadata: {
      type: 'object',
      description: 'Webhook response metadata',
      properties: {
        status: { type: 'number', description: 'HTTP status code' },
        statusText: { type: 'string', description: 'HTTP status text' },
        headers: { type: 'object', description: 'Response headers from Clay' },
        timestamp: { type: 'string', description: 'ISO timestamp when webhook was received' },
        contentType: { type: 'string', description: 'Content type of the response' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/clay/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface ClayPopulateParams {
  webhookURL: string
  data: JSON
  authToken?: string
}

export interface ClayPopulateResponse extends ToolResponse {
  output: {
    data: any
    metadata: {
      status: number
      statusText: string
      headers: Record<string, string>
      timestamp: string
      contentType: string
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: create_comment.ts]---
Location: sim-main/apps/sim/tools/confluence/create_comment.ts

```typescript
import type { ToolConfig } from '@/tools/types'

export interface ConfluenceCreateCommentParams {
  accessToken: string
  domain: string
  pageId: string
  comment: string
  cloudId?: string
}

export interface ConfluenceCreateCommentResponse {
  success: boolean
  output: {
    ts: string
    commentId: string
    pageId: string
  }
}

export const confluenceCreateCommentTool: ToolConfig<
  ConfluenceCreateCommentParams,
  ConfluenceCreateCommentResponse
> = {
  id: 'confluence_create_comment',
  name: 'Confluence Create Comment',
  description: 'Add a comment to a Confluence page.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'confluence',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token for Confluence',
    },
    domain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Confluence domain (e.g., yourcompany.atlassian.net)',
    },
    pageId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Confluence page ID to comment on',
    },
    comment: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Comment text in Confluence storage format',
    },
    cloudId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'Confluence Cloud ID for the instance. If not provided, it will be fetched using the domain.',
    },
  },

  request: {
    url: () => '/api/tools/confluence/comments',
    method: 'POST',
    headers: (params: ConfluenceCreateCommentParams) => {
      return {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
    body: (params: ConfluenceCreateCommentParams) => {
      return {
        domain: params.domain,
        accessToken: params.accessToken,
        cloudId: params.cloudId,
        pageId: params.pageId,
        comment: params.comment,
      }
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        ts: new Date().toISOString(),
        commentId: data.id,
        pageId: data.pageId || '',
      },
    }
  },

  outputs: {
    ts: { type: 'string', description: 'Timestamp of creation' },
    commentId: { type: 'string', description: 'Created comment ID' },
    pageId: { type: 'string', description: 'Page ID' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_page.ts]---
Location: sim-main/apps/sim/tools/confluence/create_page.ts

```typescript
import type { ToolConfig } from '@/tools/types'

export interface ConfluenceCreatePageParams {
  accessToken: string
  domain: string
  spaceId: string
  title: string
  content: string
  parentId?: string
  cloudId?: string
}

export interface ConfluenceCreatePageResponse {
  success: boolean
  output: {
    ts: string
    pageId: string
    title: string
    url: string
  }
}

export const confluenceCreatePageTool: ToolConfig<
  ConfluenceCreatePageParams,
  ConfluenceCreatePageResponse
> = {
  id: 'confluence_create_page',
  name: 'Confluence Create Page',
  description: 'Create a new page in a Confluence space.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'confluence',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token for Confluence',
    },
    domain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Confluence domain (e.g., yourcompany.atlassian.net)',
    },
    spaceId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Confluence space ID where the page will be created',
    },
    title: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Title of the new page',
    },
    content: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Page content in Confluence storage format (HTML)',
    },
    parentId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Parent page ID if creating a child page',
    },
    cloudId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'Confluence Cloud ID for the instance. If not provided, it will be fetched using the domain.',
    },
  },

  request: {
    url: () => '/api/tools/confluence/create-page',
    method: 'POST',
    headers: (params: ConfluenceCreatePageParams) => {
      return {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
    body: (params: ConfluenceCreatePageParams) => {
      return {
        domain: params.domain,
        accessToken: params.accessToken,
        cloudId: params.cloudId,
        spaceId: params.spaceId,
        title: params.title,
        content: params.content,
        parentId: params.parentId,
      }
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        ts: new Date().toISOString(),
        pageId: data.id,
        title: data.title,
        url: data.url || data._links?.webui || '',
      },
    }
  },

  outputs: {
    ts: { type: 'string', description: 'Timestamp of creation' },
    pageId: { type: 'string', description: 'Created page ID' },
    title: { type: 'string', description: 'Page title' },
    url: { type: 'string', description: 'Page URL' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_attachment.ts]---
Location: sim-main/apps/sim/tools/confluence/delete_attachment.ts

```typescript
import type { ToolConfig } from '@/tools/types'

export interface ConfluenceDeleteAttachmentParams {
  accessToken: string
  domain: string
  attachmentId: string
  cloudId?: string
}

export interface ConfluenceDeleteAttachmentResponse {
  success: boolean
  output: {
    ts: string
    attachmentId: string
    deleted: boolean
  }
}

export const confluenceDeleteAttachmentTool: ToolConfig<
  ConfluenceDeleteAttachmentParams,
  ConfluenceDeleteAttachmentResponse
> = {
  id: 'confluence_delete_attachment',
  name: 'Confluence Delete Attachment',
  description: 'Delete an attachment from a Confluence page (moves to trash).',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'confluence',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token for Confluence',
    },
    domain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Confluence domain (e.g., yourcompany.atlassian.net)',
    },
    attachmentId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Confluence attachment ID to delete',
    },
    cloudId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'Confluence Cloud ID for the instance. If not provided, it will be fetched using the domain.',
    },
  },

  request: {
    url: () => '/api/tools/confluence/attachment',
    method: 'DELETE',
    headers: (params: ConfluenceDeleteAttachmentParams) => {
      return {
        Accept: 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
    body: (params: ConfluenceDeleteAttachmentParams) => {
      return {
        domain: params.domain,
        accessToken: params.accessToken,
        cloudId: params.cloudId,
        attachmentId: params.attachmentId,
      }
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        ts: new Date().toISOString(),
        attachmentId: data.attachmentId || '',
        deleted: true,
      },
    }
  },

  outputs: {
    ts: { type: 'string', description: 'Timestamp of deletion' },
    attachmentId: { type: 'string', description: 'Deleted attachment ID' },
    deleted: { type: 'boolean', description: 'Deletion status' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_comment.ts]---
Location: sim-main/apps/sim/tools/confluence/delete_comment.ts

```typescript
import type { ToolConfig } from '@/tools/types'

export interface ConfluenceDeleteCommentParams {
  accessToken: string
  domain: string
  commentId: string
  cloudId?: string
}

export interface ConfluenceDeleteCommentResponse {
  success: boolean
  output: {
    ts: string
    commentId: string
    deleted: boolean
  }
}

export const confluenceDeleteCommentTool: ToolConfig<
  ConfluenceDeleteCommentParams,
  ConfluenceDeleteCommentResponse
> = {
  id: 'confluence_delete_comment',
  name: 'Confluence Delete Comment',
  description: 'Delete a comment from a Confluence page.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'confluence',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token for Confluence',
    },
    domain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Confluence domain (e.g., yourcompany.atlassian.net)',
    },
    commentId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Confluence comment ID to delete',
    },
    cloudId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'Confluence Cloud ID for the instance. If not provided, it will be fetched using the domain.',
    },
  },

  request: {
    url: () => '/api/tools/confluence/comment',
    method: 'DELETE',
    headers: (params: ConfluenceDeleteCommentParams) => {
      return {
        Accept: 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
    body: (params: ConfluenceDeleteCommentParams) => {
      return {
        domain: params.domain,
        accessToken: params.accessToken,
        cloudId: params.cloudId,
        commentId: params.commentId,
      }
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        ts: new Date().toISOString(),
        commentId: data.commentId || '',
        deleted: true,
      },
    }
  },

  outputs: {
    ts: { type: 'string', description: 'Timestamp of deletion' },
    commentId: { type: 'string', description: 'Deleted comment ID' },
    deleted: { type: 'boolean', description: 'Deletion status' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_page.ts]---
Location: sim-main/apps/sim/tools/confluence/delete_page.ts

```typescript
import type { ToolConfig } from '@/tools/types'

export interface ConfluenceDeletePageParams {
  accessToken: string
  domain: string
  pageId: string
  cloudId?: string
}

export interface ConfluenceDeletePageResponse {
  success: boolean
  output: {
    ts: string
    pageId: string
    deleted: boolean
  }
}

export const confluenceDeletePageTool: ToolConfig<
  ConfluenceDeletePageParams,
  ConfluenceDeletePageResponse
> = {
  id: 'confluence_delete_page',
  name: 'Confluence Delete Page',
  description: 'Delete a Confluence page (moves it to trash where it can be restored).',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'confluence',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token for Confluence',
    },
    domain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Confluence domain (e.g., yourcompany.atlassian.net)',
    },
    pageId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Confluence page ID to delete',
    },
    cloudId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'Confluence Cloud ID for the instance. If not provided, it will be fetched using the domain.',
    },
  },

  request: {
    url: (params: ConfluenceDeletePageParams) => '/api/tools/confluence/page',
    method: 'DELETE',
    headers: (params: ConfluenceDeletePageParams) => {
      return {
        Accept: 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
    body: (params: ConfluenceDeletePageParams) => {
      return {
        domain: params.domain,
        accessToken: params.accessToken,
        pageId: params.pageId,
        cloudId: params.cloudId,
      }
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        ts: new Date().toISOString(),
        pageId: data.pageId || '',
        deleted: true,
      },
    }
  },

  outputs: {
    ts: { type: 'string', description: 'Timestamp of deletion' },
    pageId: { type: 'string', description: 'Deleted page ID' },
    deleted: { type: 'boolean', description: 'Deletion status' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_space.ts]---
Location: sim-main/apps/sim/tools/confluence/get_space.ts

```typescript
import type { ToolConfig } from '@/tools/types'

export interface ConfluenceGetSpaceParams {
  accessToken: string
  domain: string
  spaceId: string
  cloudId?: string
}

export interface ConfluenceGetSpaceResponse {
  success: boolean
  output: {
    ts: string
    spaceId: string
    name: string
    key: string
    type: string
    status: string
    url: string
  }
}

export const confluenceGetSpaceTool: ToolConfig<
  ConfluenceGetSpaceParams,
  ConfluenceGetSpaceResponse
> = {
  id: 'confluence_get_space',
  name: 'Confluence Get Space',
  description: 'Get details about a specific Confluence space.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'confluence',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token for Confluence',
    },
    domain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Confluence domain (e.g., yourcompany.atlassian.net)',
    },
    spaceId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Confluence space ID to retrieve',
    },
    cloudId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'Confluence Cloud ID for the instance. If not provided, it will be fetched using the domain.',
    },
  },

  request: {
    url: (params: ConfluenceGetSpaceParams) => {
      const query = new URLSearchParams({
        domain: params.domain,
        accessToken: params.accessToken,
        spaceId: params.spaceId,
      })
      if (params.cloudId) {
        query.set('cloudId', params.cloudId)
      }
      return `/api/tools/confluence/space?${query.toString()}`
    },
    method: 'GET',
    headers: (params: ConfluenceGetSpaceParams) => {
      return {
        Accept: 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        ts: new Date().toISOString(),
        spaceId: data.id,
        name: data.name,
        key: data.key,
        type: data.type,
        status: data.status,
        url: data._links?.webui || '',
      },
    }
  },

  outputs: {
    ts: { type: 'string', description: 'Timestamp of retrieval' },
    spaceId: { type: 'string', description: 'Space ID' },
    name: { type: 'string', description: 'Space name' },
    key: { type: 'string', description: 'Space key' },
    type: { type: 'string', description: 'Space type' },
    status: { type: 'string', description: 'Space status' },
    url: { type: 'string', description: 'Space URL' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/confluence/index.ts

```typescript
import { confluenceCreateCommentTool } from '@/tools/confluence/create_comment'
import { confluenceCreatePageTool } from '@/tools/confluence/create_page'
import { confluenceDeleteAttachmentTool } from '@/tools/confluence/delete_attachment'
import { confluenceDeleteCommentTool } from '@/tools/confluence/delete_comment'
import { confluenceDeletePageTool } from '@/tools/confluence/delete_page'
import { confluenceGetSpaceTool } from '@/tools/confluence/get_space'
import { confluenceListAttachmentsTool } from '@/tools/confluence/list_attachments'
import { confluenceListCommentsTool } from '@/tools/confluence/list_comments'
import { confluenceListLabelsTool } from '@/tools/confluence/list_labels'
import { confluenceListSpacesTool } from '@/tools/confluence/list_spaces'
import { confluenceRetrieveTool } from '@/tools/confluence/retrieve'
import { confluenceSearchTool } from '@/tools/confluence/search'
import { confluenceUpdateTool } from '@/tools/confluence/update'
import { confluenceUpdateCommentTool } from '@/tools/confluence/update_comment'
import { confluenceUploadAttachmentTool } from '@/tools/confluence/upload_attachment'

export {
  confluenceRetrieveTool,
  confluenceUpdateTool,
  confluenceCreatePageTool,
  confluenceDeletePageTool,
  confluenceSearchTool,
  confluenceCreateCommentTool,
  confluenceListCommentsTool,
  confluenceUpdateCommentTool,
  confluenceDeleteCommentTool,
  confluenceListAttachmentsTool,
  confluenceDeleteAttachmentTool,
  confluenceUploadAttachmentTool,
  confluenceListLabelsTool,
  confluenceGetSpaceTool,
  confluenceListSpacesTool,
}
```

--------------------------------------------------------------------------------

---[FILE: list_attachments.ts]---
Location: sim-main/apps/sim/tools/confluence/list_attachments.ts

```typescript
import type { ToolConfig } from '@/tools/types'

export interface ConfluenceListAttachmentsParams {
  accessToken: string
  domain: string
  pageId: string
  limit?: number
  cloudId?: string
}

export interface ConfluenceListAttachmentsResponse {
  success: boolean
  output: {
    ts: string
    attachments: Array<{
      id: string
      title: string
      fileSize: number
      mediaType: string
      downloadUrl: string
    }>
  }
}

export const confluenceListAttachmentsTool: ToolConfig<
  ConfluenceListAttachmentsParams,
  ConfluenceListAttachmentsResponse
> = {
  id: 'confluence_list_attachments',
  name: 'Confluence List Attachments',
  description: 'List all attachments on a Confluence page.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'confluence',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token for Confluence',
    },
    domain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Confluence domain (e.g., yourcompany.atlassian.net)',
    },
    pageId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Confluence page ID to list attachments from',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Maximum number of attachments to return (default: 25)',
    },
    cloudId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'Confluence Cloud ID for the instance. If not provided, it will be fetched using the domain.',
    },
  },

  request: {
    url: (params: ConfluenceListAttachmentsParams) => {
      const query = new URLSearchParams({
        domain: params.domain,
        accessToken: params.accessToken,
        pageId: params.pageId,
        limit: String(params.limit || 25),
      })
      if (params.cloudId) {
        query.set('cloudId', params.cloudId)
      }
      return `/api/tools/confluence/attachments?${query.toString()}`
    },
    method: 'GET',
    headers: (params: ConfluenceListAttachmentsParams) => {
      return {
        Accept: 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
    body: (params: ConfluenceListAttachmentsParams) => {
      return {
        domain: params.domain,
        accessToken: params.accessToken,
        cloudId: params.cloudId,
        pageId: params.pageId,
        limit: params.limit ? Number(params.limit) : 25,
      }
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        ts: new Date().toISOString(),
        attachments: data.attachments || [],
      },
    }
  },

  outputs: {
    ts: { type: 'string', description: 'Timestamp of retrieval' },
    attachments: { type: 'array', description: 'List of attachments' },
  },
}
```

--------------------------------------------------------------------------------

````
