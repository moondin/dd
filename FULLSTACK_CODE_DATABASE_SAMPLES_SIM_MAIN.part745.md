---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 745
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 745 of 933)

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

---[FILE: remove_contacts_from_list.ts]---
Location: sim-main/apps/sim/tools/sendgrid/remove_contacts_from_list.ts

```typescript
import type { RemoveContactsFromListParams } from '@/tools/sendgrid/types'
import type { ToolConfig, ToolResponse } from '@/tools/types'

export const sendGridRemoveContactsFromListTool: ToolConfig<
  RemoveContactsFromListParams,
  ToolResponse
> = {
  id: 'sendgrid_remove_contacts_from_list',
  name: 'SendGrid Remove Contacts from List',
  description: 'Remove contacts from a specific list in SendGrid',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SendGrid API key',
    },
    listId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'List ID',
    },
    contactIds: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Comma-separated contact IDs to remove from the list',
    },
  },

  request: {
    url: (params) => {
      const contactIds = params.contactIds
        .split(',')
        .map((id) => id.trim())
        .join(',')
      return `https://api.sendgrid.com/v3/marketing/lists/${params.listId}/contacts?contact_ids=${encodeURIComponent(contactIds)}`
    },
    method: 'DELETE',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
    }),
  },

  transformResponse: async (response): Promise<ToolResponse> => {
    if (!response.ok) {
      const error = (await response.json()) as { errors?: Array<{ message?: string }> }
      throw new Error(error.errors?.[0]?.message || 'Failed to remove contacts from list')
    }

    const data = (await response.json()) as { job_id?: string }

    return {
      success: true,
      output: {
        jobId: data.job_id,
      },
    }
  },

  outputs: {
    jobId: { type: 'string', description: 'Job ID for the request' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: search_contacts.ts]---
Location: sim-main/apps/sim/tools/sendgrid/search_contacts.ts

```typescript
import type { ContactsResult, SearchContactsParams, SendGridContact } from '@/tools/sendgrid/types'
import type { ToolConfig } from '@/tools/types'

export const sendGridSearchContactsTool: ToolConfig<SearchContactsParams, ContactsResult> = {
  id: 'sendgrid_search_contacts',
  name: 'SendGrid Search Contacts',
  description: 'Search for contacts in SendGrid using a query',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SendGrid API key',
    },
    query: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description:
        "Search query (e.g., \"email LIKE '%example.com%' AND CONTAINS(list_ids, 'list-id')\")",
    },
  },

  request: {
    url: () => 'https://api.sendgrid.com/v3/marketing/contacts/search',
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      return {
        body: JSON.stringify({
          query: params.query,
        }),
      }
    },
  },

  transformResponse: async (response): Promise<ContactsResult> => {
    if (!response.ok) {
      const error = (await response.json()) as { errors?: Array<{ message?: string }> }
      throw new Error(error.errors?.[0]?.message || 'Failed to search contacts')
    }

    const data = (await response.json()) as {
      result?: SendGridContact[]
      contact_count?: number
    }

    return {
      success: true,
      output: {
        contacts: data.result || [],
        contactCount: data.contact_count,
      },
    }
  },

  outputs: {
    contacts: { type: 'json', description: 'Array of matching contacts' },
    contactCount: { type: 'number', description: 'Total number of contacts found' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: send_mail.ts]---
Location: sim-main/apps/sim/tools/sendgrid/send_mail.ts

```typescript
import type {
  SendGridMailBody,
  SendGridPersonalization,
  SendMailParams,
  SendMailResult,
} from '@/tools/sendgrid/types'
import type { ToolConfig } from '@/tools/types'

export const sendGridSendMailTool: ToolConfig<SendMailParams, SendMailResult> = {
  id: 'sendgrid_send_mail',
  name: 'SendGrid Send Mail',
  description: 'Send an email using SendGrid API',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SendGrid API key',
    },
    from: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Sender email address (must be verified in SendGrid)',
    },
    fromName: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Sender name',
    },
    to: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Recipient email address',
    },
    toName: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Recipient name',
    },
    subject: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Email subject (required unless using a template with pre-defined subject)',
    },
    content: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Email body content (required unless using a template with pre-defined content)',
    },
    contentType: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Content type (text/plain or text/html)',
    },
    cc: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'CC email address',
    },
    bcc: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'BCC email address',
    },
    replyTo: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Reply-to email address',
    },
    replyToName: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Reply-to name',
    },
    attachments: {
      type: 'file[]',
      required: false,
      visibility: 'user-only',
      description: 'Files to attach to the email',
    },
    templateId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'SendGrid template ID to use',
    },
    dynamicTemplateData: {
      type: 'json',
      required: false,
      visibility: 'user-or-llm',
      description: 'JSON object of dynamic template data',
    },
  },

  request: {
    url: () => 'https://api.sendgrid.com/v3/mail/send',
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const personalizations: SendGridPersonalization = {
        to: [
          {
            email: params.to,
            ...(params.toName && { name: params.toName }),
          },
        ],
      }

      if (params.cc) {
        personalizations.cc = [{ email: params.cc }]
      }

      if (params.bcc) {
        personalizations.bcc = [{ email: params.bcc }]
      }

      if (params.templateId && params.dynamicTemplateData) {
        try {
          personalizations.dynamic_template_data =
            typeof params.dynamicTemplateData === 'string'
              ? JSON.parse(params.dynamicTemplateData)
              : params.dynamicTemplateData
        } catch (e) {
          // If parsing fails, use as-is
        }
      }

      const mailBody: SendGridMailBody = {
        personalizations: [personalizations],
        from: {
          email: params.from,
          ...(params.fromName && { name: params.fromName }),
        },
        subject: params.subject,
      }

      if (params.templateId) {
        mailBody.template_id = params.templateId
      } else {
        mailBody.content = [
          {
            type: params.contentType || 'text/plain',
            value: params.content,
          },
        ]
      }

      if (params.replyTo) {
        mailBody.reply_to = {
          email: params.replyTo,
          ...(params.replyToName && { name: params.replyToName }),
        }
      }

      if (params.attachments) {
        try {
          mailBody.attachments =
            typeof params.attachments === 'string'
              ? JSON.parse(params.attachments)
              : params.attachments
        } catch (e) {
          // If parsing fails, skip attachments
        }
      }

      return { body: JSON.stringify(mailBody) }
    },
  },

  transformResponse: async (response, params): Promise<SendMailResult> => {
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.errors?.[0]?.message || 'Failed to send email')
    }

    // SendGrid returns 202 Accepted with X-Message-Id header
    const messageId = response.headers.get('X-Message-Id')

    return {
      success: true,
      output: {
        success: true,
        messageId: messageId || undefined,
        to: params?.to || '',
        subject: params?.subject || '',
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the email was sent successfully' },
    messageId: { type: 'string', description: 'SendGrid message ID' },
    to: { type: 'string', description: 'Recipient email address' },
    subject: { type: 'string', description: 'Email subject' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/sendgrid/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

// Shared type definitions
export interface SendGridContact {
  id: string
  email: string
  first_name?: string
  last_name?: string
  created_at?: string
  updated_at?: string
  list_ids?: string[]
  custom_fields?: Record<string, unknown>
}

export interface SendGridList {
  id: string
  name: string
  contact_count: number
  _metadata?: {
    self?: string
  }
}

export interface SendGridTemplateVersion {
  id: string
  template_id: string
  name: string
  subject: string
  active: number | boolean
  html_content?: string
  plain_content?: string
  updated_at?: string
}

export interface SendGridTemplate {
  id: string
  name: string
  generation: 'legacy' | 'dynamic'
  created_at?: string
  updated_at?: string
  versions?: SendGridTemplateVersion[]
}

export interface SendGridPersonalization {
  to: Array<{ email: string; name?: string }>
  cc?: Array<{ email: string }>
  bcc?: Array<{ email: string }>
  dynamic_template_data?: Record<string, unknown>
}

export interface SendGridMailBody {
  personalizations: SendGridPersonalization[]
  from: { email: string; name?: string }
  subject?: string
  template_id?: string
  content?: Array<{ type: 'text/plain' | 'text/html'; value?: string }>
  reply_to?: { email: string; name?: string }
  attachments?: any[]
}

export interface SendGridContactObject {
  email: string
  first_name?: string
  last_name?: string
  [key: string]: unknown
}

export interface SendGridContactRequest {
  contacts: SendGridContactObject[]
  list_ids?: string[]
}

export interface SendGridTemplateVersionRequest {
  name: string
  subject: string
  active: number | boolean
  html_content?: string
  plain_content?: string
}

// Common types
export interface SendGridBaseParams {
  apiKey: string
}

export interface SendMailParams extends SendGridBaseParams {
  from: string
  fromName?: string
  to: string
  toName?: string
  subject?: string
  content?: string
  contentType?: 'text/plain' | 'text/html'
  cc?: string
  bcc?: string
  replyTo?: string
  replyToName?: string
  attachments?: string
  templateId?: string
  dynamicTemplateData?: string
}

export interface SendMailResult extends ToolResponse {
  output: {
    success: boolean
    messageId?: string
    to: string
    subject: string
  }
}

// Contact Management types
export interface AddContactParams extends SendGridBaseParams {
  email: string
  firstName?: string
  lastName?: string
  customFields?: string // JSON string
  listIds?: string // Comma-separated list IDs
}

export interface UpdateContactParams extends SendGridBaseParams {
  contactId?: string
  email: string
  firstName?: string
  lastName?: string
  customFields?: string // JSON string
  listIds?: string // Comma-separated list IDs
}

export interface SearchContactsParams extends SendGridBaseParams {
  query: string
}

export interface GetContactParams extends SendGridBaseParams {
  contactId: string
}

export interface DeleteContactParams extends SendGridBaseParams {
  contactIds: string // Comma-separated contact IDs
}

export interface ContactResult extends ToolResponse {
  output: {
    id?: string
    jobId?: string
    email: string
    firstName?: string
    lastName?: string
    createdAt?: string
    updatedAt?: string
    listIds?: string[]
    customFields?: Record<string, unknown>
    message?: string
  }
}

export interface ContactsResult extends ToolResponse {
  output: {
    contacts: SendGridContact[]
    contactCount?: number
  }
}

// List Management types
export interface CreateListParams extends SendGridBaseParams {
  name: string
}

export interface GetListParams extends SendGridBaseParams {
  listId: string
}

export interface UpdateListParams extends SendGridBaseParams {
  listId: string
  name: string
}

export interface DeleteListParams extends SendGridBaseParams {
  listId: string
}

export interface ListAllListsParams extends SendGridBaseParams {
  pageSize?: number
}

export interface AddContactsToListParams extends SendGridBaseParams {
  listId: string
  contacts: string // JSON string array of contact objects with at least email
}

export interface RemoveContactsFromListParams extends SendGridBaseParams {
  listId: string
  contactIds: string // Comma-separated contact IDs
}

export interface ListResult extends ToolResponse {
  output: {
    id: string
    name: string
    contactCount?: number
  }
}

export interface ListsResult extends ToolResponse {
  output: {
    lists: SendGridList[]
  }
}

// Template types
export interface CreateTemplateParams extends SendGridBaseParams {
  name: string
  generation: 'legacy' | 'dynamic'
}

export interface GetTemplateParams extends SendGridBaseParams {
  templateId: string
}

export interface UpdateTemplateParams extends SendGridBaseParams {
  templateId: string
  name: string
}

export interface DeleteTemplateParams extends SendGridBaseParams {
  templateId: string
}

export interface ListTemplatesParams extends SendGridBaseParams {
  generations?: string // 'legacy' or 'dynamic' or both
  pageSize?: number
}

export interface CreateTemplateVersionParams extends SendGridBaseParams {
  templateId: string
  name: string
  subject: string
  htmlContent?: string
  plainContent?: string
  active?: boolean
}

export interface TemplateResult extends ToolResponse {
  output: {
    id: string
    name: string
    generation: string
    updatedAt?: string
    versions?: SendGridTemplateVersion[]
  }
}

export interface TemplatesResult extends ToolResponse {
  output: {
    templates: SendGridTemplate[]
  }
}

export interface TemplateVersionResult extends ToolResponse {
  output: {
    id: string
    templateId: string
    name: string
    subject: string
    active: boolean
    htmlContent?: string
    plainContent?: string
    updatedAt?: string
  }
}
```

--------------------------------------------------------------------------------

---[FILE: events_get.ts]---
Location: sim-main/apps/sim/tools/sentry/events_get.ts

```typescript
import type { SentryGetEventParams, SentryGetEventResponse } from '@/tools/sentry/types'
import type { ToolConfig } from '@/tools/types'

export const getEventTool: ToolConfig<SentryGetEventParams, SentryGetEventResponse> = {
  id: 'sentry_events_get',
  name: 'Get Event',
  description:
    'Retrieve detailed information about a specific Sentry event by its ID. Returns complete event details including stack traces, breadcrumbs, context, and user information.',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Sentry API authentication token',
    },
    organizationSlug: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The slug of the organization',
    },
    projectSlug: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The slug of the project',
    },
    eventId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The unique ID of the event to retrieve',
    },
  },

  request: {
    url: (params) =>
      `https://sentry.io/api/0/projects/${params.organizationSlug}/${params.projectSlug}/events/${params.eventId}/`,
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const event = await response.json()

    return {
      success: true,
      output: {
        event: {
          id: event.id,
          eventID: event.eventID,
          projectID: event.projectID,
          groupID: event.groupID,
          message: event.message || '',
          title: event.title,
          location: event.location,
          culprit: event.culprit,
          dateCreated: event.dateCreated,
          dateReceived: event.dateReceived,
          user: event.user
            ? {
                id: event.user.id,
                email: event.user.email,
                username: event.user.username,
                ipAddress: event.user.ip_address,
                name: event.user.name,
              }
            : null,
          tags:
            event.tags?.map((tag: any) => ({
              key: tag.key,
              value: tag.value,
            })) || [],
          contexts: event.contexts || {},
          platform: event.platform,
          type: event.type,
          metadata: event.metadata || {},
          entries: event.entries || [],
          errors: event.errors || [],
          dist: event.dist,
          fingerprints: event.fingerprints || [],
          sdk: event.sdk
            ? {
                name: event.sdk.name,
                version: event.sdk.version,
              }
            : null,
        },
      },
    }
  },

  outputs: {
    event: {
      type: 'object',
      description: 'Detailed information about the Sentry event',
      properties: {
        id: { type: 'string', description: 'Unique event ID' },
        eventID: { type: 'string', description: 'Event identifier' },
        projectID: { type: 'string', description: 'Project ID' },
        groupID: { type: 'string', description: 'Issue group ID this event belongs to' },
        message: { type: 'string', description: 'Event message' },
        title: { type: 'string', description: 'Event title' },
        location: { type: 'string', description: 'Location information' },
        culprit: { type: 'string', description: 'Function or location that caused the event' },
        dateCreated: { type: 'string', description: 'When the event was created (ISO timestamp)' },
        dateReceived: {
          type: 'string',
          description: 'When Sentry received the event (ISO timestamp)',
        },
        user: {
          type: 'object',
          description: 'User information associated with the event',
          properties: {
            id: { type: 'string', description: 'User ID' },
            email: { type: 'string', description: 'User email' },
            username: { type: 'string', description: 'Username' },
            ipAddress: { type: 'string', description: 'IP address' },
            name: { type: 'string', description: 'User display name' },
          },
        },
        tags: {
          type: 'array',
          description: 'Tags associated with the event',
          items: {
            type: 'object',
            properties: {
              key: { type: 'string', description: 'Tag key' },
              value: { type: 'string', description: 'Tag value' },
            },
          },
        },
        contexts: {
          type: 'object',
          description: 'Additional context data (device, OS, browser, etc.)',
        },
        platform: { type: 'string', description: 'Platform where the event occurred' },
        type: { type: 'string', description: 'Event type (error, transaction, etc.)' },
        metadata: {
          type: 'object',
          description: 'Metadata about the event including error type and value',
        },
        entries: {
          type: 'array',
          description: 'Event entries including exception, breadcrumbs, and request data',
        },
        errors: {
          type: 'array',
          description: 'Processing errors that occurred',
        },
        dist: { type: 'string', description: 'Distribution identifier' },
        fingerprints: {
          type: 'array',
          description: 'Fingerprints used for grouping events',
          items: { type: 'string' },
        },
        sdk: {
          type: 'object',
          description: 'SDK information',
          properties: {
            name: { type: 'string', description: 'SDK name' },
            version: { type: 'string', description: 'SDK version' },
          },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: events_list.ts]---
Location: sim-main/apps/sim/tools/sentry/events_list.ts

```typescript
import type { SentryListEventsParams, SentryListEventsResponse } from '@/tools/sentry/types'
import type { ToolConfig } from '@/tools/types'

export const listEventsTool: ToolConfig<SentryListEventsParams, SentryListEventsResponse> = {
  id: 'sentry_events_list',
  name: 'List Events',
  description:
    'List events from a Sentry project. Can be filtered by issue ID, query, or time period. Returns event details including context, tags, and user information.',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Sentry API authentication token',
    },
    organizationSlug: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The slug of the organization',
    },
    projectSlug: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The slug of the project to list events from',
    },
    issueId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter events by a specific issue ID',
    },
    query: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Search query to filter events. Supports Sentry search syntax (e.g., "user.email:*@example.com")',
    },
    cursor: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Pagination cursor for retrieving next page of results',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of events to return per page (default: 50, max: 100)',
    },
    statsPeriod: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'Time period to query (e.g., "24h", "7d", "30d"). Defaults to 90d if not specified.',
    },
  },

  request: {
    url: (params) => {
      let baseUrl: string

      if (params.issueId && params.issueId !== null && params.issueId !== '') {
        // List events for a specific issue
        baseUrl = `https://sentry.io/api/0/organizations/${params.organizationSlug}/issues/${params.issueId}/events/`
      } else {
        // List events for a project
        baseUrl = `https://sentry.io/api/0/projects/${params.organizationSlug}/${params.projectSlug}/events/`
      }

      const queryParams: string[] = []

      if (params.query && params.query !== null && params.query !== '') {
        queryParams.push(`query=${encodeURIComponent(params.query)}`)
      }

      if (params.cursor && params.cursor !== null && params.cursor !== '') {
        queryParams.push(`cursor=${encodeURIComponent(params.cursor)}`)
      }

      if (params.limit && params.limit !== null) {
        queryParams.push(`limit=${Number(params.limit)}`)
      }

      if (params.statsPeriod && params.statsPeriod !== null && params.statsPeriod !== '') {
        queryParams.push(`statsPeriod=${encodeURIComponent(params.statsPeriod)}`)
      }

      return queryParams.length > 0 ? `${baseUrl}?${queryParams.join('&')}` : baseUrl
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    // Extract pagination info from Link header
    const linkHeader = response.headers.get('Link')
    let nextCursor: string | undefined
    let hasMore = false

    if (linkHeader) {
      const nextMatch = linkHeader.match(
        /<[^>]*cursor=([^&>]+)[^>]*>;\s*rel="next";\s*results="true"/
      )
      if (nextMatch) {
        nextCursor = decodeURIComponent(nextMatch[1])
        hasMore = true
      }
    }

    return {
      success: true,
      output: {
        events: data.map((event: any) => ({
          id: event.id,
          eventID: event.eventID,
          projectID: event.projectID,
          groupID: event.groupID,
          message: event.message || '',
          title: event.title,
          location: event.location,
          culprit: event.culprit,
          dateCreated: event.dateCreated,
          dateReceived: event.dateReceived,
          user: event.user
            ? {
                id: event.user.id,
                email: event.user.email,
                username: event.user.username,
                ipAddress: event.user.ip_address,
                name: event.user.name,
              }
            : null,
          tags:
            event.tags?.map((tag: any) => ({
              key: tag.key,
              value: tag.value,
            })) || [],
          contexts: event.contexts || {},
          platform: event.platform,
          type: event.type,
          metadata: event.metadata || {},
          entries: event.entries || [],
          errors: event.errors || [],
          dist: event.dist,
          fingerprints: event.fingerprints || [],
          sdk: event.sdk
            ? {
                name: event.sdk.name,
                version: event.sdk.version,
              }
            : null,
        })),
        nextCursor,
        hasMore,
      },
    }
  },

  outputs: {
    events: {
      type: 'array',
      description: 'List of Sentry events',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Unique event ID' },
          eventID: { type: 'string', description: 'Event identifier' },
          projectID: { type: 'string', description: 'Project ID' },
          groupID: { type: 'string', description: 'Issue group ID' },
          message: { type: 'string', description: 'Event message' },
          title: { type: 'string', description: 'Event title' },
          culprit: { type: 'string', description: 'Function or location that caused the event' },
          dateCreated: {
            type: 'string',
            description: 'When the event was created (ISO timestamp)',
          },
          dateReceived: {
            type: 'string',
            description: 'When Sentry received the event (ISO timestamp)',
          },
          user: {
            type: 'object',
            description: 'User information associated with the event',
            properties: {
              id: { type: 'string', description: 'User ID' },
              email: { type: 'string', description: 'User email' },
              username: { type: 'string', description: 'Username' },
              ipAddress: { type: 'string', description: 'IP address' },
            },
          },
          tags: {
            type: 'array',
            description: 'Tags associated with the event',
            items: {
              type: 'object',
              properties: {
                key: { type: 'string', description: 'Tag key' },
                value: { type: 'string', description: 'Tag value' },
              },
            },
          },
          platform: { type: 'string', description: 'Platform where the event occurred' },
          type: { type: 'string', description: 'Event type' },
        },
      },
    },
    nextCursor: {
      type: 'string',
      description: 'Cursor for the next page of results (if available)',
    },
    hasMore: {
      type: 'boolean',
      description: 'Whether there are more results available',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/sentry/index.ts

```typescript
// Export all Sentry tool configurations

export { getEventTool } from './events_get'
export { listEventsTool } from './events_list'
export { getIssueTool } from './issues_get'
export { listIssuesTool } from './issues_list'
export { updateIssueTool } from './issues_update'
export { createProjectTool } from './projects_create'
export { getProjectTool } from './projects_get'
export { listProjectsTool } from './projects_list'
export { updateProjectTool } from './projects_update'
export { createReleaseTool } from './releases_create'
export { createDeployTool } from './releases_deploy'
export { listReleasesTool } from './releases_list'
// Export all types
export type * from './types'
```

--------------------------------------------------------------------------------

---[FILE: issues_get.ts]---
Location: sim-main/apps/sim/tools/sentry/issues_get.ts

```typescript
import type { SentryGetIssueParams, SentryGetIssueResponse } from '@/tools/sentry/types'
import type { ToolConfig } from '@/tools/types'

export const getIssueTool: ToolConfig<SentryGetIssueParams, SentryGetIssueResponse> = {
  id: 'sentry_issues_get',
  name: 'Get Issue',
  description:
    'Retrieve detailed information about a specific Sentry issue by its ID. Returns complete issue details including metadata, tags, and statistics.',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Sentry API authentication token',
    },
    organizationSlug: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The slug of the organization',
    },
    issueId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The unique ID of the issue to retrieve',
    },
  },

  request: {
    url: (params) =>
      `https://sentry.io/api/0/organizations/${params.organizationSlug}/issues/${params.issueId}/`,
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const issue = await response.json()

    return {
      success: true,
      output: {
        issue: {
          id: issue.id,
          shortId: issue.shortId,
          title: issue.title,
          culprit: issue.culprit,
          permalink: issue.permalink,
          logger: issue.logger,
          level: issue.level,
          status: issue.status,
          statusDetails: issue.statusDetails || {},
          isPublic: issue.isPublic,
          platform: issue.platform,
          project: {
            id: issue.project?.id || '',
            name: issue.project?.name || '',
            slug: issue.project?.slug || '',
            platform: issue.project?.platform || '',
          },
          type: issue.type,
          metadata: issue.metadata || {},
          numComments: issue.numComments || 0,
          assignedTo: issue.assignedTo
            ? {
                id: issue.assignedTo.id,
                name: issue.assignedTo.name,
                email: issue.assignedTo.email,
              }
            : null,
          isBookmarked: issue.isBookmarked,
          isSubscribed: issue.isSubscribed,
          subscriptionDetails: issue.subscriptionDetails,
          hasSeen: issue.hasSeen,
          annotations: issue.annotations || [],
          isUnhandled: issue.isUnhandled,
          count: issue.count,
          userCount: issue.userCount || 0,
          firstSeen: issue.firstSeen,
          lastSeen: issue.lastSeen,
          stats: issue.stats || {},
        },
      },
    }
  },

  outputs: {
    issue: {
      type: 'object',
      description: 'Detailed information about the Sentry issue',
      properties: {
        id: { type: 'string', description: 'Unique issue ID' },
        shortId: { type: 'string', description: 'Short issue identifier' },
        title: { type: 'string', description: 'Issue title' },
        culprit: { type: 'string', description: 'Function or location that caused the issue' },
        permalink: { type: 'string', description: 'Direct link to the issue in Sentry' },
        logger: { type: 'string', description: 'Logger name that reported the issue' },
        level: { type: 'string', description: 'Severity level (error, warning, info, etc.)' },
        status: { type: 'string', description: 'Current issue status' },
        statusDetails: {
          type: 'object',
          description: 'Additional details about the status',
        },
        isPublic: { type: 'boolean', description: 'Whether the issue is publicly visible' },
        platform: { type: 'string', description: 'Platform where the issue occurred' },
        project: {
          type: 'object',
          description: 'Project information',
          properties: {
            id: { type: 'string', description: 'Project ID' },
            name: { type: 'string', description: 'Project name' },
            slug: { type: 'string', description: 'Project slug' },
            platform: { type: 'string', description: 'Project platform' },
          },
        },
        type: { type: 'string', description: 'Issue type' },
        metadata: { type: 'object', description: 'Additional metadata about the issue' },
        numComments: { type: 'number', description: 'Number of comments on the issue' },
        assignedTo: {
          type: 'object',
          description: 'User assigned to the issue (if any)',
          properties: {
            id: { type: 'string', description: 'User ID' },
            name: { type: 'string', description: 'User name' },
            email: { type: 'string', description: 'User email' },
          },
        },
        isBookmarked: { type: 'boolean', description: 'Whether the issue is bookmarked' },
        isSubscribed: { type: 'boolean', description: 'Whether the user is subscribed to updates' },
        hasSeen: { type: 'boolean', description: 'Whether the user has seen this issue' },
        annotations: { type: 'array', description: 'Issue annotations' },
        isUnhandled: { type: 'boolean', description: 'Whether the issue is unhandled' },
        count: { type: 'string', description: 'Total number of occurrences' },
        userCount: { type: 'number', description: 'Number of unique users affected' },
        firstSeen: { type: 'string', description: 'When the issue was first seen (ISO timestamp)' },
        lastSeen: { type: 'string', description: 'When the issue was last seen (ISO timestamp)' },
        stats: { type: 'object', description: 'Statistical information about the issue' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

````
