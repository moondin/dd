---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 781
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 781 of 933)

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

---[FILE: merge_tickets.ts]---
Location: sim-main/apps/sim/tools/zendesk/merge_tickets.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildZendeskUrl, handleZendeskError } from './types'

const logger = createLogger('ZendeskMergeTickets')

export interface ZendeskMergeTicketsParams {
  email: string
  apiToken: string
  subdomain: string
  targetTicketId: string
  sourceTicketIds: string
  targetComment?: string
}

export interface ZendeskMergeTicketsResponse {
  success: boolean
  output: {
    jobStatus: any
    metadata: {
      operation: 'merge_tickets'
      jobId?: string
      targetTicketId: string
    }
    success: boolean
  }
}

export const zendeskMergeTicketsTool: ToolConfig<
  ZendeskMergeTicketsParams,
  ZendeskMergeTicketsResponse
> = {
  id: 'zendesk_merge_tickets',
  name: 'Merge Tickets in Zendesk',
  description: 'Merge multiple tickets into a target ticket',
  version: '1.0.0',

  params: {
    email: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Zendesk email address',
    },
    apiToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Zendesk API token',
    },
    subdomain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Zendesk subdomain',
    },
    targetTicketId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Target ticket ID (tickets will be merged into this one)',
    },
    sourceTicketIds: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Comma-separated source ticket IDs to merge',
    },
    targetComment: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comment to add to target ticket after merge',
    },
  },

  request: {
    url: (params) => buildZendeskUrl(params.subdomain, `/tickets/${params.targetTicketId}/merge`),
    method: 'POST',
    headers: (params) => {
      const credentials = `${params.email}/token:${params.apiToken}`
      const base64Credentials = Buffer.from(credentials).toString('base64')
      return {
        Authorization: `Basic ${base64Credentials}`,
        'Content-Type': 'application/json',
      }
    },
    body: (params) => {
      const ids = params.sourceTicketIds.split(',').map((id) => id.trim())
      const body: any = { ids }
      if (params.targetComment) {
        body.target_comment = {
          body: params.targetComment,
          public: true,
        }
      }
      return body
    },
  },

  transformResponse: async (response: Response, params) => {
    if (!response.ok) {
      const data = await response.json()
      handleZendeskError(data, response.status, 'merge_tickets')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        jobStatus: data.job_status,
        metadata: {
          operation: 'merge_tickets' as const,
          jobId: data.job_status?.id,
          targetTicketId: params?.targetTicketId || '',
        },
        success: true,
      },
    }
  },

  outputs: {
    jobStatus: { type: 'object', description: 'Job status object' },
    metadata: { type: 'object', description: 'Operation metadata' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: search.ts]---
Location: sim-main/apps/sim/tools/zendesk/search.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildZendeskUrl, handleZendeskError } from './types'

const logger = createLogger('ZendeskSearch')

export interface ZendeskSearchParams {
  email: string
  apiToken: string
  subdomain: string
  query: string
  sortBy?: string
  sortOrder?: string
  perPage?: string
  page?: string
}

export interface ZendeskSearchResponse {
  success: boolean
  output: {
    results: any[]
    paging?: {
      nextPage?: string | null
      previousPage?: string | null
      count: number
    }
    metadata: {
      operation: 'search'
      totalReturned: number
    }
    success: boolean
  }
}

export const zendeskSearchTool: ToolConfig<ZendeskSearchParams, ZendeskSearchResponse> = {
  id: 'zendesk_search',
  name: 'Search Zendesk',
  description: 'Unified search across tickets, users, and organizations in Zendesk',
  version: '1.0.0',

  params: {
    email: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Zendesk email address',
    },
    apiToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Zendesk API token',
    },
    subdomain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Zendesk subdomain',
    },
    query: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Search query string',
    },
    sortBy: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Sort field (relevance, created_at, updated_at, priority, status, ticket_type)',
    },
    sortOrder: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Sort order (asc or desc)',
    },
    perPage: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Results per page (default: 100, max: 100)',
    },
    page: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Page number',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()
      queryParams.append('query', params.query)
      if (params.sortBy) queryParams.append('sort_by', params.sortBy)
      if (params.sortOrder) queryParams.append('sort_order', params.sortOrder)
      if (params.page) queryParams.append('page', params.page)
      if (params.perPage) queryParams.append('per_page', params.perPage)

      const query = queryParams.toString()
      const url = buildZendeskUrl(params.subdomain, '/search')
      return `${url}?${query}`
    },
    method: 'GET',
    headers: (params) => {
      const credentials = `${params.email}/token:${params.apiToken}`
      const base64Credentials = Buffer.from(credentials).toString('base64')
      return {
        Authorization: `Basic ${base64Credentials}`,
        'Content-Type': 'application/json',
      }
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleZendeskError(data, response.status, 'search')
    }

    const data = await response.json()
    const results = data.results || []

    return {
      success: true,
      output: {
        results,
        paging: {
          nextPage: data.next_page,
          previousPage: data.previous_page,
          count: data.count || results.length,
        },
        metadata: {
          operation: 'search' as const,
          totalReturned: results.length,
        },
        success: true,
      },
    }
  },

  outputs: {
    results: { type: 'array', description: 'Array of result objects' },
    paging: { type: 'object', description: 'Pagination information' },
    metadata: { type: 'object', description: 'Operation metadata' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: search_count.ts]---
Location: sim-main/apps/sim/tools/zendesk/search_count.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildZendeskUrl, handleZendeskError } from './types'

const logger = createLogger('ZendeskSearchCount')

export interface ZendeskSearchCountParams {
  email: string
  apiToken: string
  subdomain: string
  query: string
}

export interface ZendeskSearchCountResponse {
  success: boolean
  output: {
    count: number
    metadata: {
      operation: 'search_count'
    }
    success: boolean
  }
}

export const zendeskSearchCountTool: ToolConfig<
  ZendeskSearchCountParams,
  ZendeskSearchCountResponse
> = {
  id: 'zendesk_search_count',
  name: 'Count Search Results in Zendesk',
  description: 'Count the number of search results matching a query in Zendesk',
  version: '1.0.0',

  params: {
    email: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Zendesk email address',
    },
    apiToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Zendesk API token',
    },
    subdomain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Zendesk subdomain',
    },
    query: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Search query string',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()
      queryParams.append('query', params.query)

      const query = queryParams.toString()
      const url = buildZendeskUrl(params.subdomain, '/search/count')
      return `${url}?${query}`
    },
    method: 'GET',
    headers: (params) => {
      const credentials = `${params.email}/token:${params.apiToken}`
      const base64Credentials = Buffer.from(credentials).toString('base64')
      return {
        Authorization: `Basic ${base64Credentials}`,
        'Content-Type': 'application/json',
      }
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleZendeskError(data, response.status, 'search_count')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        count: data.count || 0,
        metadata: {
          operation: 'search_count' as const,
        },
        success: true,
      },
    }
  },

  outputs: {
    count: { type: 'number', description: 'Number of matching results' },
    metadata: { type: 'object', description: 'Operation metadata' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: search_users.ts]---
Location: sim-main/apps/sim/tools/zendesk/search_users.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildZendeskUrl, handleZendeskError } from './types'

const logger = createLogger('ZendeskSearchUsers')

export interface ZendeskSearchUsersParams {
  email: string
  apiToken: string
  subdomain: string
  query?: string
  externalId?: string
  perPage?: string
  page?: string
}

export interface ZendeskSearchUsersResponse {
  success: boolean
  output: {
    users: any[]
    paging?: {
      nextPage?: string | null
      previousPage?: string | null
      count: number
    }
    metadata: {
      operation: 'search_users'
      totalReturned: number
    }
    success: boolean
  }
}

export const zendeskSearchUsersTool: ToolConfig<
  ZendeskSearchUsersParams,
  ZendeskSearchUsersResponse
> = {
  id: 'zendesk_search_users',
  name: 'Search Users in Zendesk',
  description: 'Search for users in Zendesk using a query string',
  version: '1.0.0',

  params: {
    email: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Zendesk email address',
    },
    apiToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Zendesk API token',
    },
    subdomain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Zendesk subdomain',
    },
    query: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Search query string',
    },
    externalId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'External ID to search by',
    },
    perPage: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Results per page (default: 100, max: 100)',
    },
    page: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Page number',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()
      if (params.query) queryParams.append('query', params.query)
      if (params.externalId) queryParams.append('external_id', params.externalId)
      if (params.page) queryParams.append('page', params.page)
      if (params.perPage) queryParams.append('per_page', params.perPage)

      const query = queryParams.toString()
      const url = buildZendeskUrl(params.subdomain, '/users/search')
      return `${url}?${query}`
    },
    method: 'GET',
    headers: (params) => {
      const credentials = `${params.email}/token:${params.apiToken}`
      const base64Credentials = Buffer.from(credentials).toString('base64')
      return {
        Authorization: `Basic ${base64Credentials}`,
        'Content-Type': 'application/json',
      }
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleZendeskError(data, response.status, 'search_users')
    }

    const data = await response.json()
    const users = data.users || []

    return {
      success: true,
      output: {
        users,
        paging: {
          nextPage: data.next_page,
          previousPage: data.previous_page,
          count: data.count || users.length,
        },
        metadata: {
          operation: 'search_users' as const,
          totalReturned: users.length,
        },
        success: true,
      },
    }
  },

  outputs: {
    users: { type: 'array', description: 'Array of user objects' },
    paging: { type: 'object', description: 'Pagination information' },
    metadata: { type: 'object', description: 'Operation metadata' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/zendesk/types.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('Zendesk')

// Base params - following Sentry pattern where subdomain is user-provided
export interface ZendeskBaseParams {
  email: string // Zendesk user email (required for API token authentication)
  apiToken: string // API token (hidden)
  subdomain: string // Zendesk subdomain (user-visible, required - e.g., "mycompany" for mycompany.zendesk.com)
}

export interface ZendeskPaginationParams {
  page?: string
  perPage?: string
}

export interface ZendeskPagingInfo {
  nextPage?: string | null
  previousPage?: string | null
  count: number
}

export interface ZendeskResponse<T> {
  success: boolean
  output: {
    data?: T
    paging?: ZendeskPagingInfo
    metadata: {
      operation: string
      [key: string]: any
    }
    success: boolean
  }
}

// Helper function to build Zendesk API URLs
// Subdomain is always provided by user as a parameter
export function buildZendeskUrl(subdomain: string, path: string): string {
  return `https://${subdomain}.zendesk.com/api/v2${path}`
}

// Helper function for consistent error handling
export function handleZendeskError(data: any, status: number, operation: string): never {
  logger.error(`Zendesk API request failed for ${operation}`, { data, status })

  const errorMessage = data.error || data.description || data.message || 'Unknown error'
  throw new Error(`Zendesk ${operation} failed: ${errorMessage}`)
}
```

--------------------------------------------------------------------------------

---[FILE: update_organization.ts]---
Location: sim-main/apps/sim/tools/zendesk/update_organization.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildZendeskUrl, handleZendeskError } from './types'

const logger = createLogger('ZendeskUpdateOrganization')

export interface ZendeskUpdateOrganizationParams {
  email: string
  apiToken: string
  subdomain: string
  organizationId: string
  name?: string
  domainNames?: string
  details?: string
  notes?: string
  tags?: string
  customFields?: string
}

export interface ZendeskUpdateOrganizationResponse {
  success: boolean
  output: {
    organization: any
    metadata: {
      operation: 'update_organization'
      organizationId: string
    }
    success: boolean
  }
}

export const zendeskUpdateOrganizationTool: ToolConfig<
  ZendeskUpdateOrganizationParams,
  ZendeskUpdateOrganizationResponse
> = {
  id: 'zendesk_update_organization',
  name: 'Update Organization in Zendesk',
  description: 'Update an existing organization in Zendesk',
  version: '1.0.0',

  params: {
    email: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Zendesk email address',
    },
    apiToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Zendesk API token',
    },
    subdomain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Zendesk subdomain',
    },
    organizationId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Organization ID to update',
    },
    name: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'New organization name',
    },
    domainNames: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comma-separated domain names',
    },
    details: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Organization details',
    },
    notes: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Organization notes',
    },
    tags: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comma-separated tags',
    },
    customFields: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Custom fields as JSON object',
    },
  },

  request: {
    url: (params) => buildZendeskUrl(params.subdomain, `/organizations/${params.organizationId}`),
    method: 'PUT',
    headers: (params) => {
      const credentials = `${params.email}/token:${params.apiToken}`
      const base64Credentials = Buffer.from(credentials).toString('base64')
      return {
        Authorization: `Basic ${base64Credentials}`,
        'Content-Type': 'application/json',
      }
    },
    body: (params) => {
      const organization: any = {}

      if (params.name) organization.name = params.name
      if (params.domainNames)
        organization.domain_names = params.domainNames.split(',').map((d) => d.trim())
      if (params.details) organization.details = params.details
      if (params.notes) organization.notes = params.notes
      if (params.tags) organization.tags = params.tags.split(',').map((t) => t.trim())

      if (params.customFields) {
        try {
          const customFields = JSON.parse(params.customFields)
          organization.organization_fields = customFields
        } catch (error) {
          logger.warn('Failed to parse custom fields', { error })
        }
      }

      return { organization }
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleZendeskError(data, response.status, 'update_organization')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        organization: data.organization,
        metadata: {
          operation: 'update_organization' as const,
          organizationId: data.organization?.id,
        },
        success: true,
      },
    }
  },

  outputs: {
    organization: { type: 'object', description: 'Updated organization object' },
    metadata: { type: 'object', description: 'Operation metadata' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_ticket.ts]---
Location: sim-main/apps/sim/tools/zendesk/update_ticket.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildZendeskUrl, handleZendeskError } from './types'

const logger = createLogger('ZendeskUpdateTicket')

export interface ZendeskUpdateTicketParams {
  email: string
  apiToken: string
  subdomain: string
  ticketId: string
  subject?: string
  comment?: string
  priority?: string
  status?: string
  type?: string
  tags?: string
  assigneeId?: string
  groupId?: string
  customFields?: string
}

export interface ZendeskUpdateTicketResponse {
  success: boolean
  output: {
    ticket: any
    metadata: {
      operation: 'update_ticket'
      ticketId: string
    }
    success: boolean
  }
}

export const zendeskUpdateTicketTool: ToolConfig<
  ZendeskUpdateTicketParams,
  ZendeskUpdateTicketResponse
> = {
  id: 'zendesk_update_ticket',
  name: 'Update Ticket in Zendesk',
  description: 'Update an existing ticket in Zendesk with support for custom fields',
  version: '1.0.0',

  params: {
    email: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Zendesk email address',
    },
    apiToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Zendesk API token',
    },
    subdomain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Zendesk subdomain',
    },
    ticketId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Ticket ID to update',
    },
    subject: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'New ticket subject',
    },
    comment: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Add a comment to the ticket',
    },
    priority: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Priority (low, normal, high, urgent)',
    },
    status: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Status (new, open, pending, hold, solved, closed)',
    },
    type: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Type (problem, incident, question, task)',
    },
    tags: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comma-separated tags',
    },
    assigneeId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Assignee user ID',
    },
    groupId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Group ID',
    },
    customFields: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Custom fields as JSON object',
    },
  },

  request: {
    url: (params) => buildZendeskUrl(params.subdomain, `/tickets/${params.ticketId}`),
    method: 'PUT',
    headers: (params) => {
      // Use Basic Authentication with email/token format for Zendesk API tokens
      const credentials = `${params.email}/token:${params.apiToken}`
      const base64Credentials = Buffer.from(credentials).toString('base64')
      return {
        Authorization: `Basic ${base64Credentials}`,
        'Content-Type': 'application/json',
      }
    },
    body: (params) => {
      const ticket: any = {}

      if (params.subject) ticket.subject = params.subject
      if (params.priority) ticket.priority = params.priority
      if (params.status) ticket.status = params.status
      if (params.type) ticket.type = params.type
      if (params.assigneeId) ticket.assignee_id = params.assigneeId
      if (params.groupId) ticket.group_id = params.groupId
      if (params.tags) ticket.tags = params.tags.split(',').map((t) => t.trim())
      if (params.comment) ticket.comment = { body: params.comment }

      if (params.customFields) {
        try {
          const customFields = JSON.parse(params.customFields)
          ticket.custom_fields = Object.entries(customFields).map(([id, value]) => ({ id, value }))
        } catch (error) {
          logger.warn('Failed to parse custom fields', { error })
        }
      }

      return { ticket }
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleZendeskError(data, response.status, 'update_ticket')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        ticket: data.ticket,
        metadata: {
          operation: 'update_ticket' as const,
          ticketId: data.ticket?.id,
        },
        success: true,
      },
    }
  },

  outputs: {
    ticket: { type: 'object', description: 'Updated ticket object' },
    metadata: { type: 'object', description: 'Operation metadata' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_tickets_bulk.ts]---
Location: sim-main/apps/sim/tools/zendesk/update_tickets_bulk.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildZendeskUrl, handleZendeskError } from './types'

const logger = createLogger('ZendeskUpdateTicketsBulk')

export interface ZendeskUpdateTicketsBulkParams {
  email: string
  apiToken: string
  subdomain: string
  ticketIds: string
  status?: string
  priority?: string
  assigneeId?: string
  groupId?: string
  tags?: string
}

export interface ZendeskUpdateTicketsBulkResponse {
  success: boolean
  output: {
    jobStatus: any
    metadata: {
      operation: 'update_tickets_bulk'
      jobId?: string
    }
    success: boolean
  }
}

export const zendeskUpdateTicketsBulkTool: ToolConfig<
  ZendeskUpdateTicketsBulkParams,
  ZendeskUpdateTicketsBulkResponse
> = {
  id: 'zendesk_update_tickets_bulk',
  name: 'Bulk Update Tickets in Zendesk',
  description: 'Update multiple tickets in Zendesk at once (max 100)',
  version: '1.0.0',

  params: {
    email: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Zendesk email address',
    },
    apiToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Zendesk API token',
    },
    subdomain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Zendesk subdomain',
    },
    ticketIds: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Comma-separated ticket IDs to update (max 100)',
    },
    status: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'New status for all tickets',
    },
    priority: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'New priority for all tickets',
    },
    assigneeId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'New assignee ID for all tickets',
    },
    groupId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'New group ID for all tickets',
    },
    tags: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comma-separated tags to add to all tickets',
    },
  },

  request: {
    url: (params) => {
      const ids = params.ticketIds.split(',').map((id) => id.trim())
      return buildZendeskUrl(params.subdomain, `/tickets/update_many?ids=${ids.join(',')}`)
    },
    method: 'PUT',
    headers: (params) => {
      const credentials = `${params.email}/token:${params.apiToken}`
      const base64Credentials = Buffer.from(credentials).toString('base64')
      return {
        Authorization: `Basic ${base64Credentials}`,
        'Content-Type': 'application/json',
      }
    },
    body: (params) => {
      const ticket: any = {}
      if (params.status) ticket.status = params.status
      if (params.priority) ticket.priority = params.priority
      if (params.assigneeId) ticket.assignee_id = params.assigneeId
      if (params.groupId) ticket.group_id = params.groupId
      if (params.tags) ticket.tags = params.tags.split(',').map((t) => t.trim())
      return { ticket }
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleZendeskError(data, response.status, 'update_tickets_bulk')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        jobStatus: data.job_status,
        metadata: {
          operation: 'update_tickets_bulk' as const,
          jobId: data.job_status?.id,
        },
        success: true,
      },
    }
  },

  outputs: {
    jobStatus: { type: 'object', description: 'Job status object' },
    metadata: { type: 'object', description: 'Operation metadata' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_user.ts]---
Location: sim-main/apps/sim/tools/zendesk/update_user.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildZendeskUrl, handleZendeskError } from './types'

const logger = createLogger('ZendeskUpdateUser')

export interface ZendeskUpdateUserParams {
  email: string
  apiToken: string
  subdomain: string
  userId: string
  name?: string
  userEmail?: string
  role?: string
  phone?: string
  organizationId?: string
  verified?: string
  tags?: string
  customFields?: string
}

export interface ZendeskUpdateUserResponse {
  success: boolean
  output: {
    user: any
    metadata: {
      operation: 'update_user'
      userId: string
    }
    success: boolean
  }
}

export const zendeskUpdateUserTool: ToolConfig<ZendeskUpdateUserParams, ZendeskUpdateUserResponse> =
  {
    id: 'zendesk_update_user',
    name: 'Update User in Zendesk',
    description: 'Update an existing user in Zendesk',
    version: '1.0.0',

    params: {
      email: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'Your Zendesk email address',
      },
      apiToken: {
        type: 'string',
        required: true,
        visibility: 'hidden',
        description: 'Zendesk API token',
      },
      subdomain: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'Your Zendesk subdomain',
      },
      userId: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'User ID to update',
      },
      name: {
        type: 'string',
        required: false,
        visibility: 'user-only',
        description: 'New user name',
      },
      userEmail: {
        type: 'string',
        required: false,
        visibility: 'user-only',
        description: 'New user email',
      },
      role: {
        type: 'string',
        required: false,
        visibility: 'user-only',
        description: 'User role (end-user, agent, admin)',
      },
      phone: {
        type: 'string',
        required: false,
        visibility: 'user-only',
        description: 'User phone number',
      },
      organizationId: {
        type: 'string',
        required: false,
        visibility: 'user-only',
        description: 'Organization ID',
      },
      verified: {
        type: 'string',
        required: false,
        visibility: 'user-only',
        description: 'Set to "true" to mark user as verified',
      },
      tags: {
        type: 'string',
        required: false,
        visibility: 'user-only',
        description: 'Comma-separated tags',
      },
      customFields: {
        type: 'string',
        required: false,
        visibility: 'user-only',
        description: 'Custom fields as JSON object',
      },
    },

    request: {
      url: (params) => buildZendeskUrl(params.subdomain, `/users/${params.userId}`),
      method: 'PUT',
      headers: (params) => {
        const credentials = `${params.email}/token:${params.apiToken}`
        const base64Credentials = Buffer.from(credentials).toString('base64')
        return {
          Authorization: `Basic ${base64Credentials}`,
          'Content-Type': 'application/json',
        }
      },
      body: (params) => {
        const user: any = {}

        if (params.name) user.name = params.name
        if (params.userEmail) user.email = params.userEmail
        if (params.role) user.role = params.role
        if (params.phone) user.phone = params.phone
        if (params.organizationId) user.organization_id = params.organizationId
        if (params.verified) user.verified = params.verified === 'true'
        if (params.tags) user.tags = params.tags.split(',').map((t) => t.trim())

        if (params.customFields) {
          try {
            const customFields = JSON.parse(params.customFields)
            user.user_fields = customFields
          } catch (error) {
            logger.warn('Failed to parse custom fields', { error })
          }
        }

        return { user }
      },
    },

    transformResponse: async (response: Response) => {
      if (!response.ok) {
        const data = await response.json()
        handleZendeskError(data, response.status, 'update_user')
      }

      const data = await response.json()

      return {
        success: true,
        output: {
          user: data.user,
          metadata: {
            operation: 'update_user' as const,
            userId: data.user?.id,
          },
          success: true,
        },
      }
    },

    outputs: {
      user: { type: 'object', description: 'Updated user object' },
      metadata: { type: 'object', description: 'Operation metadata' },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: update_users_bulk.ts]---
Location: sim-main/apps/sim/tools/zendesk/update_users_bulk.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildZendeskUrl, handleZendeskError } from './types'

const logger = createLogger('ZendeskUpdateUsersBulk')

export interface ZendeskUpdateUsersBulkParams {
  email: string
  apiToken: string
  subdomain: string
  users: string
}

export interface ZendeskUpdateUsersBulkResponse {
  success: boolean
  output: {
    jobStatus: any
    metadata: {
      operation: 'update_users_bulk'
      jobId: string
    }
    success: boolean
  }
}

export const zendeskUpdateUsersBulkTool: ToolConfig<
  ZendeskUpdateUsersBulkParams,
  ZendeskUpdateUsersBulkResponse
> = {
  id: 'zendesk_update_users_bulk',
  name: 'Bulk Update Users in Zendesk',
  description: 'Update multiple users in Zendesk using bulk update',
  version: '1.0.0',

  params: {
    email: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Zendesk email address',
    },
    apiToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Zendesk API token',
    },
    subdomain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Zendesk subdomain',
    },
    users: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'JSON array of user objects to update (must include id field)',
    },
  },

  request: {
    url: (params) => buildZendeskUrl(params.subdomain, '/users/update_many'),
    method: 'PUT',
    headers: (params) => {
      const credentials = `${params.email}/token:${params.apiToken}`
      const base64Credentials = Buffer.from(credentials).toString('base64')
      return {
        Authorization: `Basic ${base64Credentials}`,
        'Content-Type': 'application/json',
      }
    },
    body: (params) => {
      try {
        const users = JSON.parse(params.users)
        return { users }
      } catch (error) {
        logger.error('Failed to parse users array', { error })
        throw new Error('Invalid users JSON format')
      }
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleZendeskError(data, response.status, 'update_users_bulk')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        jobStatus: data.job_status,
        metadata: {
          operation: 'update_users_bulk' as const,
          jobId: data.job_status?.id,
        },
        success: true,
      },
    }
  },

  outputs: {
    jobStatus: { type: 'object', description: 'Job status object' },
    metadata: { type: 'object', description: 'Operation metadata' },
  },
}
```

--------------------------------------------------------------------------------

````
