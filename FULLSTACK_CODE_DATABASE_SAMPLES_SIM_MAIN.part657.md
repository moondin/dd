---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 657
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 657 of 933)

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
Location: sim-main/apps/sim/tools/browser_use/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface BrowserUseRunTaskParams {
  task: string
  apiKey: string
  variables?: Record<string, string>
  model?: string
  save_browser_data?: boolean
}

export interface BrowserUseTaskStep {
  id: string
  step: number
  evaluation_previous_goal: string
  next_goal: string
  url?: string
  extracted_data?: Record<string, any>
}

export interface BrowserUseTaskOutput {
  id: string
  success: boolean
  output: any
  steps: BrowserUseTaskStep[]
}

export interface BrowserUseRunTaskResponse extends ToolResponse {
  output: BrowserUseTaskOutput
}

export interface BrowserUseResponse extends ToolResponse {
  output: {
    id: string
    success: boolean
    output: any
    steps: BrowserUseTaskStep[]
  }
}
```

--------------------------------------------------------------------------------

---[FILE: cancel_event.ts]---
Location: sim-main/apps/sim/tools/calendly/cancel_event.ts

```typescript
import type { CalendlyCancelEventParams, CalendlyCancelEventResponse } from '@/tools/calendly/types'
import type { ToolConfig } from '@/tools/types'

export const cancelEventTool: ToolConfig<CalendlyCancelEventParams, CalendlyCancelEventResponse> = {
  id: 'calendly_cancel_event',
  name: 'Calendly Cancel Event',
  description: 'Cancel a scheduled event',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Calendly Personal Access Token',
    },
    eventUuid: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Scheduled event UUID to cancel (can be full URI or just the UUID)',
    },
    reason: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Reason for cancellation (will be sent to invitees)',
    },
  },

  request: {
    url: (params: CalendlyCancelEventParams) => {
      const uuid = params.eventUuid.includes('/')
        ? params.eventUuid.split('/').pop()
        : params.eventUuid
      return `https://api.calendly.com/scheduled_events/${uuid}/cancellation`
    },
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params: CalendlyCancelEventParams) => {
      const body: any = {}

      if (params.reason) {
        body.reason = params.reason
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: data,
    }
  },

  outputs: {
    resource: {
      type: 'object',
      description: 'Cancellation details',
      properties: {
        canceler_type: {
          type: 'string',
          description: 'Type of canceler (host or invitee)',
        },
        canceled_by: {
          type: 'string',
          description: 'Name of person who canceled',
        },
        reason: {
          type: 'string',
          description: 'Cancellation reason',
        },
        created_at: {
          type: 'string',
          description: 'ISO timestamp when event was canceled',
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_webhook.ts]---
Location: sim-main/apps/sim/tools/calendly/create_webhook.ts

```typescript
import type {
  CalendlyCreateWebhookParams,
  CalendlyCreateWebhookResponse,
} from '@/tools/calendly/types'
import type { ToolConfig } from '@/tools/types'

export const createWebhookTool: ToolConfig<
  CalendlyCreateWebhookParams,
  CalendlyCreateWebhookResponse
> = {
  id: 'calendly_create_webhook',
  name: 'Calendly Create Webhook',
  description: 'Create a new webhook subscription to receive real-time event notifications',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Calendly Personal Access Token',
    },
    url: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'URL to receive webhook events (must be HTTPS)',
    },
    events: {
      type: 'json',
      required: true,
      visibility: 'user-only',
      description:
        'Array of event types to subscribe to (e.g., ["invitee.created", "invitee.canceled"])',
    },
    organization: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Organization URI',
    },
    user: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'User URI (required for user-scoped webhooks)',
    },
    scope: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Webhook scope: "organization" or "user"',
    },
    signing_key: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Optional signing key to verify webhook signatures',
    },
  },

  request: {
    url: () => 'https://api.calendly.com/webhook_subscriptions',
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params: CalendlyCreateWebhookParams) => {
      const body: any = {
        url: params.url,
        events: params.events,
        organization: params.organization,
        scope: params.scope,
      }

      if (params.user && params.scope === 'user') {
        body.user = params.user
      }

      if (params.signing_key) {
        body.signing_key = params.signing_key
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: data,
    }
  },

  outputs: {
    resource: {
      type: 'object',
      description: 'Created webhook subscription details',
      properties: {
        uri: {
          type: 'string',
          description: 'Canonical reference to the webhook',
        },
        callback_url: {
          type: 'string',
          description: 'URL receiving webhook events',
        },
        created_at: {
          type: 'string',
          description: 'ISO timestamp of creation',
        },
        updated_at: {
          type: 'string',
          description: 'ISO timestamp of last update',
        },
        state: {
          type: 'string',
          description: 'Webhook state (active by default)',
        },
        events: {
          type: 'array',
          items: { type: 'string' },
          description: 'Subscribed event types',
        },
        signing_key: {
          type: 'string',
          description: 'Key to verify webhook signatures',
        },
        scope: {
          type: 'string',
          description: 'Webhook scope',
        },
        organization: {
          type: 'string',
          description: 'Organization URI',
        },
        user: {
          type: 'string',
          description: 'User URI (for user-scoped webhooks)',
        },
        creator: {
          type: 'string',
          description: 'URI of user who created the webhook',
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_webhook.ts]---
Location: sim-main/apps/sim/tools/calendly/delete_webhook.ts

```typescript
import type {
  CalendlyDeleteWebhookParams,
  CalendlyDeleteWebhookResponse,
} from '@/tools/calendly/types'
import type { ToolConfig } from '@/tools/types'

export const deleteWebhookTool: ToolConfig<
  CalendlyDeleteWebhookParams,
  CalendlyDeleteWebhookResponse
> = {
  id: 'calendly_delete_webhook',
  name: 'Calendly Delete Webhook',
  description: 'Delete a webhook subscription',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Calendly Personal Access Token',
    },
    webhookUuid: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Webhook subscription UUID to delete (can be full URI or just the UUID)',
    },
  },

  request: {
    url: (params: CalendlyDeleteWebhookParams) => {
      const uuid = params.webhookUuid.includes('/')
        ? params.webhookUuid.split('/').pop()
        : params.webhookUuid
      return `https://api.calendly.com/webhook_subscriptions/${uuid}`
    },
    method: 'DELETE',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (response.status === 204 || response.status === 200) {
      return {
        success: true,
        output: {
          deleted: true,
          message: 'Webhook subscription deleted successfully',
        },
      }
    }

    const data = await response.json()
    return {
      success: false,
      output: {
        deleted: false,
        message: data.message || 'Failed to delete webhook subscription',
      },
    }
  },

  outputs: {
    deleted: {
      type: 'boolean',
      description: 'Whether the webhook was successfully deleted',
    },
    message: {
      type: 'string',
      description: 'Status message',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_current_user.ts]---
Location: sim-main/apps/sim/tools/calendly/get_current_user.ts

```typescript
import type {
  CalendlyGetCurrentUserParams,
  CalendlyGetCurrentUserResponse,
} from '@/tools/calendly/types'
import type { ToolConfig } from '@/tools/types'

export const getCurrentUserTool: ToolConfig<
  CalendlyGetCurrentUserParams,
  CalendlyGetCurrentUserResponse
> = {
  id: 'calendly_get_current_user',
  name: 'Calendly Get Current User',
  description: 'Get information about the currently authenticated Calendly user',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Calendly Personal Access Token',
    },
  },

  request: {
    url: () => 'https://api.calendly.com/users/me',
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
    resource: {
      type: 'object',
      description: 'Current user information',
      properties: {
        uri: {
          type: 'string',
          description: 'Canonical reference to the user',
        },
        name: {
          type: 'string',
          description: 'User full name',
        },
        slug: {
          type: 'string',
          description: 'Unique identifier for the user in URLs',
        },
        email: {
          type: 'string',
          description: 'User email address',
        },
        scheduling_url: {
          type: 'string',
          description: "URL to the user's scheduling page",
        },
        timezone: {
          type: 'string',
          description: 'User timezone',
        },
        avatar_url: {
          type: 'string',
          description: 'URL to user avatar image',
        },
        created_at: {
          type: 'string',
          description: 'ISO timestamp when user was created',
        },
        updated_at: {
          type: 'string',
          description: 'ISO timestamp when user was last updated',
        },
        current_organization: {
          type: 'string',
          description: 'URI of current organization',
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_event_type.ts]---
Location: sim-main/apps/sim/tools/calendly/get_event_type.ts

```typescript
import type {
  CalendlyGetEventTypeParams,
  CalendlyGetEventTypeResponse,
} from '@/tools/calendly/types'
import type { ToolConfig } from '@/tools/types'

export const getEventTypeTool: ToolConfig<
  CalendlyGetEventTypeParams,
  CalendlyGetEventTypeResponse
> = {
  id: 'calendly_get_event_type',
  name: 'Calendly Get Event Type',
  description: 'Get detailed information about a specific event type',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Calendly Personal Access Token',
    },
    eventTypeUuid: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Event type UUID (can be full URI or just the UUID)',
    },
  },

  request: {
    url: (params: CalendlyGetEventTypeParams) => {
      const uuid = params.eventTypeUuid.includes('/')
        ? params.eventTypeUuid.split('/').pop()
        : params.eventTypeUuid
      return `https://api.calendly.com/event_types/${uuid}`
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
    resource: {
      type: 'object',
      description: 'Event type details',
      properties: {
        uri: { type: 'string', description: 'Canonical reference to the event type' },
        name: { type: 'string', description: 'Event type name' },
        active: { type: 'boolean', description: 'Whether the event type is active' },
        booking_method: { type: 'string', description: 'Booking method' },
        color: { type: 'string', description: 'Hex color code' },
        created_at: { type: 'string', description: 'ISO timestamp of creation' },
        custom_questions: {
          type: 'array',
          description: 'Custom questions for invitees',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Question text' },
              type: {
                type: 'string',
                description: 'Question type (text, single_select, multi_select, etc.)',
              },
              position: { type: 'number', description: 'Question order' },
              enabled: { type: 'boolean', description: 'Whether question is enabled' },
              required: { type: 'boolean', description: 'Whether question is required' },
              answer_choices: {
                type: 'array',
                items: { type: 'string' },
                description: 'Available answer choices',
              },
            },
          },
        },
        description_html: { type: 'string', description: 'HTML formatted description' },
        description_plain: { type: 'string', description: 'Plain text description' },
        duration: { type: 'number', description: 'Duration in minutes' },
        scheduling_url: { type: 'string', description: 'URL to scheduling page' },
        slug: { type: 'string', description: 'Unique identifier for URLs' },
        type: { type: 'string', description: 'Event type classification' },
        updated_at: { type: 'string', description: 'ISO timestamp of last update' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_scheduled_event.ts]---
Location: sim-main/apps/sim/tools/calendly/get_scheduled_event.ts

```typescript
import type {
  CalendlyGetScheduledEventParams,
  CalendlyGetScheduledEventResponse,
} from '@/tools/calendly/types'
import type { ToolConfig } from '@/tools/types'

export const getScheduledEventTool: ToolConfig<
  CalendlyGetScheduledEventParams,
  CalendlyGetScheduledEventResponse
> = {
  id: 'calendly_get_scheduled_event',
  name: 'Calendly Get Scheduled Event',
  description: 'Get detailed information about a specific scheduled event',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Calendly Personal Access Token',
    },
    eventUuid: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Scheduled event UUID (can be full URI or just the UUID)',
    },
  },

  request: {
    url: (params: CalendlyGetScheduledEventParams) => {
      const uuid = params.eventUuid.includes('/')
        ? params.eventUuid.split('/').pop()
        : params.eventUuid
      return `https://api.calendly.com/scheduled_events/${uuid}`
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
    resource: {
      type: 'object',
      description: 'Scheduled event details',
      properties: {
        uri: { type: 'string', description: 'Canonical reference to the event' },
        name: { type: 'string', description: 'Event name' },
        status: { type: 'string', description: 'Event status (active or canceled)' },
        start_time: { type: 'string', description: 'ISO timestamp of event start' },
        end_time: { type: 'string', description: 'ISO timestamp of event end' },
        event_type: { type: 'string', description: 'URI of the event type' },
        location: {
          type: 'object',
          description: 'Event location details',
          properties: {
            type: { type: 'string', description: 'Location type' },
            location: { type: 'string', description: 'Location description' },
            join_url: { type: 'string', description: 'URL to join online meeting' },
          },
        },
        invitees_counter: {
          type: 'object',
          description: 'Invitee count information',
          properties: {
            total: { type: 'number', description: 'Total number of invitees' },
            active: { type: 'number', description: 'Number of active invitees' },
            limit: { type: 'number', description: 'Maximum number of invitees' },
          },
        },
        event_memberships: {
          type: 'array',
          description: 'Event hosts/members',
          items: {
            type: 'object',
            properties: {
              user: { type: 'string', description: 'User URI' },
              user_email: { type: 'string', description: 'User email' },
              user_name: { type: 'string', description: 'User name' },
            },
          },
        },
        event_guests: {
          type: 'array',
          description: 'Additional guests',
          items: {
            type: 'object',
            properties: {
              email: { type: 'string', description: 'Guest email' },
              created_at: { type: 'string', description: 'When guest was added' },
              updated_at: { type: 'string', description: 'When guest info was updated' },
            },
          },
        },
        created_at: { type: 'string', description: 'ISO timestamp of event creation' },
        updated_at: { type: 'string', description: 'ISO timestamp of last update' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/calendly/index.ts

```typescript
import { cancelEventTool } from '@/tools/calendly/cancel_event'
import { createWebhookTool } from '@/tools/calendly/create_webhook'
import { deleteWebhookTool } from '@/tools/calendly/delete_webhook'
import { getCurrentUserTool } from '@/tools/calendly/get_current_user'
import { getEventTypeTool } from '@/tools/calendly/get_event_type'
import { getScheduledEventTool } from '@/tools/calendly/get_scheduled_event'
import { listEventInviteesTool } from '@/tools/calendly/list_event_invitees'
import { listEventTypesTool } from '@/tools/calendly/list_event_types'
import { listScheduledEventsTool } from '@/tools/calendly/list_scheduled_events'
import { listWebhooksTool } from '@/tools/calendly/list_webhooks'

export const calendlyGetCurrentUserTool = getCurrentUserTool
export const calendlyListEventTypesTool = listEventTypesTool
export const calendlyGetEventTypeTool = getEventTypeTool
export const calendlyListScheduledEventsTool = listScheduledEventsTool
export const calendlyGetScheduledEventTool = getScheduledEventTool
export const calendlyListEventInviteesTool = listEventInviteesTool
export const calendlyCancelEventTool = cancelEventTool
export const calendlyListWebhooksTool = listWebhooksTool
export const calendlyCreateWebhookTool = createWebhookTool
export const calendlyDeleteWebhookTool = deleteWebhookTool
```

--------------------------------------------------------------------------------

---[FILE: list_event_invitees.ts]---
Location: sim-main/apps/sim/tools/calendly/list_event_invitees.ts

```typescript
import type {
  CalendlyListEventInviteesParams,
  CalendlyListEventInviteesResponse,
} from '@/tools/calendly/types'
import type { ToolConfig } from '@/tools/types'

export const listEventInviteesTool: ToolConfig<
  CalendlyListEventInviteesParams,
  CalendlyListEventInviteesResponse
> = {
  id: 'calendly_list_event_invitees',
  name: 'Calendly List Event Invitees',
  description: 'Retrieve a list of invitees for a scheduled event',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Calendly Personal Access Token',
    },
    eventUuid: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Scheduled event UUID (can be full URI or just the UUID)',
    },
    count: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of results per page (default: 20, max: 100)',
    },
    email: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Filter invitees by email address',
    },
    pageToken: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Page token for pagination',
    },
    sort: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Sort order for results (e.g., "created_at:asc", "created_at:desc")',
    },
    status: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Filter by status ("active" or "canceled")',
    },
  },

  request: {
    url: (params: CalendlyListEventInviteesParams) => {
      const uuid = params.eventUuid.includes('/')
        ? params.eventUuid.split('/').pop()
        : params.eventUuid
      const url = `https://api.calendly.com/scheduled_events/${uuid}/invitees`
      const queryParams = []

      if (params.count) {
        queryParams.push(`count=${Number(params.count)}`)
      }

      if (params.email) {
        queryParams.push(`email=${encodeURIComponent(params.email)}`)
      }

      if (params.pageToken) {
        queryParams.push(`page_token=${encodeURIComponent(params.pageToken)}`)
      }

      if (params.sort) {
        queryParams.push(`sort=${encodeURIComponent(params.sort)}`)
      }

      if (params.status) {
        queryParams.push(`status=${encodeURIComponent(params.status)}`)
      }

      return queryParams.length > 0 ? `${url}?${queryParams.join('&')}` : url
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
      description: 'Array of invitee objects',
      items: {
        type: 'object',
        properties: {
          uri: { type: 'string', description: 'Canonical reference to the invitee' },
          email: { type: 'string', description: 'Invitee email address' },
          name: { type: 'string', description: 'Invitee full name' },
          first_name: { type: 'string', description: 'Invitee first name' },
          last_name: { type: 'string', description: 'Invitee last name' },
          status: { type: 'string', description: 'Invitee status (active or canceled)' },
          questions_and_answers: {
            type: 'array',
            description: 'Responses to custom questions',
            items: {
              type: 'object',
              properties: {
                question: { type: 'string', description: 'Question text' },
                answer: { type: 'string', description: 'Invitee answer' },
                position: { type: 'number', description: 'Question order' },
              },
            },
          },
          timezone: { type: 'string', description: 'Invitee timezone' },
          event: { type: 'string', description: 'URI of the scheduled event' },
          created_at: { type: 'string', description: 'ISO timestamp when invitee was created' },
          updated_at: { type: 'string', description: 'ISO timestamp when invitee was updated' },
          cancel_url: { type: 'string', description: 'URL to cancel the booking' },
          reschedule_url: { type: 'string', description: 'URL to reschedule the booking' },
          rescheduled: { type: 'boolean', description: 'Whether invitee rescheduled' },
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

---[FILE: list_event_types.ts]---
Location: sim-main/apps/sim/tools/calendly/list_event_types.ts

```typescript
import type {
  CalendlyListEventTypesParams,
  CalendlyListEventTypesResponse,
} from '@/tools/calendly/types'
import type { ToolConfig } from '@/tools/types'

export const listEventTypesTool: ToolConfig<
  CalendlyListEventTypesParams,
  CalendlyListEventTypesResponse
> = {
  id: 'calendly_list_event_types',
  name: 'Calendly List Event Types',
  description: 'Retrieve a list of all event types for a user or organization',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Calendly Personal Access Token',
    },
    user: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Return only event types that belong to this user (URI format)',
    },
    organization: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Return only event types that belong to this organization (URI format)',
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
    sort: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Sort order for results (e.g., "name:asc", "name:desc")',
    },
    active: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description:
        'When true, show only active event types. When false or unchecked, show all event types (both active and inactive).',
    },
  },

  request: {
    url: (params: CalendlyListEventTypesParams) => {
      const url = 'https://api.calendly.com/event_types'
      const queryParams = []

      if (params.user) {
        queryParams.push(`user=${encodeURIComponent(params.user)}`)
      }

      if (params.organization) {
        queryParams.push(`organization=${encodeURIComponent(params.organization)}`)
      }

      if (params.count) {
        queryParams.push(`count=${Number(params.count)}`)
      }

      if (params.pageToken) {
        queryParams.push(`page_token=${encodeURIComponent(params.pageToken)}`)
      }

      if (params.sort) {
        queryParams.push(`sort=${encodeURIComponent(params.sort)}`)
      }

      if (params.active === true) {
        queryParams.push('active=true')
      }

      return queryParams.length > 0 ? `${url}?${queryParams.join('&')}` : url
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
      description: 'Array of event type objects',
      items: {
        type: 'object',
        properties: {
          uri: { type: 'string', description: 'Canonical reference to the event type' },
          name: { type: 'string', description: 'Event type name' },
          active: { type: 'boolean', description: 'Whether the event type is active' },
          booking_method: {
            type: 'string',
            description: 'Booking method (e.g., "round_robin_or_collect", "collective")',
          },
          color: { type: 'string', description: 'Hex color code' },
          created_at: { type: 'string', description: 'ISO timestamp of creation' },
          description_html: { type: 'string', description: 'HTML formatted description' },
          description_plain: { type: 'string', description: 'Plain text description' },
          duration: { type: 'number', description: 'Duration in minutes' },
          scheduling_url: { type: 'string', description: 'URL to scheduling page' },
          slug: { type: 'string', description: 'Unique identifier for URLs' },
          type: { type: 'string', description: 'Event type classification' },
          updated_at: { type: 'string', description: 'ISO timestamp of last update' },
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

---[FILE: list_scheduled_events.ts]---
Location: sim-main/apps/sim/tools/calendly/list_scheduled_events.ts

```typescript
import type {
  CalendlyListScheduledEventsParams,
  CalendlyListScheduledEventsResponse,
} from '@/tools/calendly/types'
import type { ToolConfig } from '@/tools/types'

export const listScheduledEventsTool: ToolConfig<
  CalendlyListScheduledEventsParams,
  CalendlyListScheduledEventsResponse
> = {
  id: 'calendly_list_scheduled_events',
  name: 'Calendly List Scheduled Events',
  description: 'Retrieve a list of scheduled events for a user or organization',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Calendly Personal Access Token',
    },
    user: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'Return events that belong to this user (URI format). Either "user" or "organization" must be provided.',
    },
    organization: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'Return events that belong to this organization (URI format). Either "user" or "organization" must be provided.',
    },
    invitee_email: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Return events where invitee has this email',
    },
    count: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of results per page (default: 20, max: 100)',
    },
    max_start_time: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Return events with start time before this time (ISO 8601 format)',
    },
    min_start_time: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Return events with start time after this time (ISO 8601 format)',
    },
    pageToken: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Page token for pagination',
    },
    sort: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Sort order for results (e.g., "start_time:asc", "start_time:desc")',
    },
    status: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Filter by status ("active" or "canceled")',
    },
  },

  request: {
    url: (params: CalendlyListScheduledEventsParams) => {
      const url = 'https://api.calendly.com/scheduled_events'
      const queryParams = []

      if (!params.user && !params.organization) {
        throw new Error(
          'At least one of "user" or "organization" parameter is required. Please provide either a user URI or organization URI.'
        )
      }

      if (params.user) {
        queryParams.push(`user=${encodeURIComponent(params.user)}`)
      }

      if (params.organization) {
        queryParams.push(`organization=${encodeURIComponent(params.organization)}`)
      }

      if (params.invitee_email) {
        queryParams.push(`invitee_email=${encodeURIComponent(params.invitee_email)}`)
      }

      if (params.count) {
        queryParams.push(`count=${Number(params.count)}`)
      }

      if (params.max_start_time) {
        queryParams.push(`max_start_time=${encodeURIComponent(params.max_start_time)}`)
      }

      if (params.min_start_time) {
        queryParams.push(`min_start_time=${encodeURIComponent(params.min_start_time)}`)
      }

      if (params.pageToken) {
        queryParams.push(`page_token=${encodeURIComponent(params.pageToken)}`)
      }

      if (params.sort) {
        queryParams.push(`sort=${encodeURIComponent(params.sort)}`)
      }

      if (params.status) {
        queryParams.push(`status=${encodeURIComponent(params.status)}`)
      }

      return queryParams.length > 0 ? `${url}?${queryParams.join('&')}` : url
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
      description: 'Array of scheduled event objects',
      items: {
        type: 'object',
        properties: {
          uri: { type: 'string', description: 'Canonical reference to the event' },
          name: { type: 'string', description: 'Event name' },
          status: { type: 'string', description: 'Event status (active or canceled)' },
          start_time: { type: 'string', description: 'ISO timestamp of event start' },
          end_time: { type: 'string', description: 'ISO timestamp of event end' },
          event_type: { type: 'string', description: 'URI of the event type' },
          location: {
            type: 'object',
            description: 'Event location details',
            properties: {
              type: {
                type: 'string',
                description: 'Location type (e.g., "zoom", "google_meet", "physical")',
              },
              location: { type: 'string', description: 'Location description' },
              join_url: {
                type: 'string',
                description: 'URL to join online meeting (if applicable)',
              },
            },
          },
          invitees_counter: {
            type: 'object',
            description: 'Invitee count information',
            properties: {
              total: { type: 'number', description: 'Total number of invitees' },
              active: { type: 'number', description: 'Number of active invitees' },
              limit: { type: 'number', description: 'Maximum number of invitees' },
            },
          },
          created_at: { type: 'string', description: 'ISO timestamp of event creation' },
          updated_at: { type: 'string', description: 'ISO timestamp of last update' },
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

````
