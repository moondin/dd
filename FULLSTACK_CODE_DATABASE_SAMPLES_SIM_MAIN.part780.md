---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 780
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 780 of 933)

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

---[FILE: create_users_bulk.ts]---
Location: sim-main/apps/sim/tools/zendesk/create_users_bulk.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildZendeskUrl, handleZendeskError } from './types'

const logger = createLogger('ZendeskCreateUsersBulk')

export interface ZendeskCreateUsersBulkParams {
  email: string
  apiToken: string
  subdomain: string
  users: string
}

export interface ZendeskCreateUsersBulkResponse {
  success: boolean
  output: {
    jobStatus: any
    metadata: {
      operation: 'create_users_bulk'
      jobId: string
    }
    success: boolean
  }
}

export const zendeskCreateUsersBulkTool: ToolConfig<
  ZendeskCreateUsersBulkParams,
  ZendeskCreateUsersBulkResponse
> = {
  id: 'zendesk_create_users_bulk',
  name: 'Bulk Create Users in Zendesk',
  description: 'Create multiple users in Zendesk using bulk import',
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
      description: 'JSON array of user objects to create',
    },
  },

  request: {
    url: (params) => buildZendeskUrl(params.subdomain, '/users/create_many'),
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
      handleZendeskError(data, response.status, 'create_users_bulk')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        jobStatus: data.job_status,
        metadata: {
          operation: 'create_users_bulk' as const,
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

---[FILE: delete_organization.ts]---
Location: sim-main/apps/sim/tools/zendesk/delete_organization.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildZendeskUrl, handleZendeskError } from './types'

const logger = createLogger('ZendeskDeleteOrganization')

export interface ZendeskDeleteOrganizationParams {
  email: string
  apiToken: string
  subdomain: string
  organizationId: string
}

export interface ZendeskDeleteOrganizationResponse {
  success: boolean
  output: {
    deleted: boolean
    metadata: {
      operation: 'delete_organization'
      organizationId: string
    }
    success: boolean
  }
}

export const zendeskDeleteOrganizationTool: ToolConfig<
  ZendeskDeleteOrganizationParams,
  ZendeskDeleteOrganizationResponse
> = {
  id: 'zendesk_delete_organization',
  name: 'Delete Organization from Zendesk',
  description: 'Delete an organization from Zendesk',
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
      description: 'Organization ID to delete',
    },
  },

  request: {
    url: (params) => buildZendeskUrl(params.subdomain, `/organizations/${params.organizationId}`),
    method: 'DELETE',
    headers: (params) => {
      const credentials = `${params.email}/token:${params.apiToken}`
      const base64Credentials = Buffer.from(credentials).toString('base64')
      return {
        Authorization: `Basic ${base64Credentials}`,
        'Content-Type': 'application/json',
      }
    },
  },

  transformResponse: async (response: Response, params) => {
    if (!response.ok) {
      const data = await response.json()
      handleZendeskError(data, response.status, 'delete_organization')
    }

    // DELETE returns 204 No Content with empty body
    return {
      success: true,
      output: {
        deleted: true,
        metadata: {
          operation: 'delete_organization' as const,
          organizationId: params?.organizationId || '',
        },
        success: true,
      },
    }
  },

  outputs: {
    deleted: { type: 'boolean', description: 'Deletion success' },
    metadata: { type: 'object', description: 'Operation metadata' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_ticket.ts]---
Location: sim-main/apps/sim/tools/zendesk/delete_ticket.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildZendeskUrl, handleZendeskError } from './types'

const logger = createLogger('ZendeskDeleteTicket')

export interface ZendeskDeleteTicketParams {
  email: string
  apiToken: string
  subdomain: string
  ticketId: string
}

export interface ZendeskDeleteTicketResponse {
  success: boolean
  output: {
    deleted: boolean
    metadata: {
      operation: 'delete_ticket'
      ticketId: string
    }
    success: boolean
  }
}

export const zendeskDeleteTicketTool: ToolConfig<
  ZendeskDeleteTicketParams,
  ZendeskDeleteTicketResponse
> = {
  id: 'zendesk_delete_ticket',
  name: 'Delete Ticket from Zendesk',
  description: 'Delete a ticket from Zendesk',
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
      description: 'Ticket ID to delete',
    },
  },

  request: {
    url: (params) => buildZendeskUrl(params.subdomain, `/tickets/${params.ticketId}`),
    method: 'DELETE',
    headers: (params) => {
      // Use Basic Authentication with email/token format for Zendesk API tokens
      const credentials = `${params.email}/token:${params.apiToken}`
      const base64Credentials = Buffer.from(credentials).toString('base64')
      return {
        Authorization: `Basic ${base64Credentials}`,
        'Content-Type': 'application/json',
      }
    },
  },

  transformResponse: async (response: Response, params) => {
    if (!response.ok) {
      const data = await response.json()
      handleZendeskError(data, response.status, 'delete_ticket')
    }

    return {
      success: true,
      output: {
        deleted: true,
        metadata: {
          operation: 'delete_ticket' as const,
          ticketId: params?.ticketId || '',
        },
        success: true,
      },
    }
  },

  outputs: {
    deleted: { type: 'boolean', description: 'Deletion success' },
    metadata: { type: 'object', description: 'Operation metadata' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_user.ts]---
Location: sim-main/apps/sim/tools/zendesk/delete_user.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildZendeskUrl, handleZendeskError } from './types'

const logger = createLogger('ZendeskDeleteUser')

export interface ZendeskDeleteUserParams {
  email: string
  apiToken: string
  subdomain: string
  userId: string
}

export interface ZendeskDeleteUserResponse {
  success: boolean
  output: {
    deleted: boolean
    metadata: {
      operation: 'delete_user'
      userId: string
    }
    success: boolean
  }
}

export const zendeskDeleteUserTool: ToolConfig<ZendeskDeleteUserParams, ZendeskDeleteUserResponse> =
  {
    id: 'zendesk_delete_user',
    name: 'Delete User from Zendesk',
    description: 'Delete a user from Zendesk',
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
        description: 'User ID to delete',
      },
    },

    request: {
      url: (params) => buildZendeskUrl(params.subdomain, `/users/${params.userId}`),
      method: 'DELETE',
      headers: (params) => {
        const credentials = `${params.email}/token:${params.apiToken}`
        const base64Credentials = Buffer.from(credentials).toString('base64')
        return {
          Authorization: `Basic ${base64Credentials}`,
          'Content-Type': 'application/json',
        }
      },
    },

    transformResponse: async (response: Response, params) => {
      if (!response.ok) {
        const data = await response.json()
        handleZendeskError(data, response.status, 'delete_user')
      }

      // DELETE returns 204 No Content with empty body
      return {
        success: true,
        output: {
          deleted: true,
          metadata: {
            operation: 'delete_user' as const,
            userId: params?.userId || '',
          },
          success: true,
        },
      }
    },

    outputs: {
      deleted: { type: 'boolean', description: 'Deletion success' },
      metadata: { type: 'object', description: 'Operation metadata' },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: get_current_user.ts]---
Location: sim-main/apps/sim/tools/zendesk/get_current_user.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildZendeskUrl, handleZendeskError } from './types'

const logger = createLogger('ZendeskGetCurrentUser')

export interface ZendeskGetCurrentUserParams {
  email: string
  apiToken: string
  subdomain: string
}

export interface ZendeskGetCurrentUserResponse {
  success: boolean
  output: {
    user: any
    metadata: {
      operation: 'get_current_user'
    }
    success: boolean
  }
}

export const zendeskGetCurrentUserTool: ToolConfig<
  ZendeskGetCurrentUserParams,
  ZendeskGetCurrentUserResponse
> = {
  id: 'zendesk_get_current_user',
  name: 'Get Current User from Zendesk',
  description: 'Get the currently authenticated user from Zendesk',
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
  },

  request: {
    url: (params) => buildZendeskUrl(params.subdomain, '/users/me'),
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
      handleZendeskError(data, response.status, 'get_current_user')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        user: data.user,
        metadata: {
          operation: 'get_current_user' as const,
        },
        success: true,
      },
    }
  },

  outputs: {
    user: { type: 'object', description: 'Current user object' },
    metadata: { type: 'object', description: 'Operation metadata' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_organization.ts]---
Location: sim-main/apps/sim/tools/zendesk/get_organization.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildZendeskUrl, handleZendeskError } from './types'

const logger = createLogger('ZendeskGetOrganization')

export interface ZendeskGetOrganizationParams {
  email: string
  apiToken: string
  subdomain: string
  organizationId: string
}

export interface ZendeskGetOrganizationResponse {
  success: boolean
  output: {
    organization: any
    metadata: {
      operation: 'get_organization'
    }
    success: boolean
  }
}

export const zendeskGetOrganizationTool: ToolConfig<
  ZendeskGetOrganizationParams,
  ZendeskGetOrganizationResponse
> = {
  id: 'zendesk_get_organization',
  name: 'Get Single Organization from Zendesk',
  description: 'Get a single organization by ID from Zendesk',
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
      description: 'Organization ID to retrieve',
    },
  },

  request: {
    url: (params) => buildZendeskUrl(params.subdomain, `/organizations/${params.organizationId}`),
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
      handleZendeskError(data, response.status, 'get_organization')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        organization: data.organization,
        metadata: {
          operation: 'get_organization' as const,
        },
        success: true,
      },
    }
  },

  outputs: {
    organization: { type: 'object', description: 'Organization object' },
    metadata: { type: 'object', description: 'Operation metadata' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_organizations.ts]---
Location: sim-main/apps/sim/tools/zendesk/get_organizations.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildZendeskUrl, handleZendeskError } from './types'

const logger = createLogger('ZendeskGetOrganizations')

export interface ZendeskGetOrganizationsParams {
  email: string
  apiToken: string
  subdomain: string
  perPage?: string
  page?: string
}

export interface ZendeskGetOrganizationsResponse {
  success: boolean
  output: {
    organizations: any[]
    paging?: {
      nextPage?: string | null
      previousPage?: string | null
      count: number
    }
    metadata: {
      operation: 'get_organizations'
      totalReturned: number
    }
    success: boolean
  }
}

export const zendeskGetOrganizationsTool: ToolConfig<
  ZendeskGetOrganizationsParams,
  ZendeskGetOrganizationsResponse
> = {
  id: 'zendesk_get_organizations',
  name: 'Get Organizations from Zendesk',
  description: 'Retrieve a list of organizations from Zendesk',
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
      description: 'Your Zendesk subdomain (e.g., "mycompany" for mycompany.zendesk.com)',
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
      if (params.page) queryParams.append('page', params.page)
      if (params.perPage) queryParams.append('per_page', params.perPage)

      const query = queryParams.toString()
      const url = buildZendeskUrl(params.subdomain, '/organizations')
      return query ? `${url}?${query}` : url
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
      handleZendeskError(data, response.status, 'get_organizations')
    }

    const data = await response.json()
    const organizations = data.organizations || []

    return {
      success: true,
      output: {
        organizations,
        paging: {
          nextPage: data.next_page,
          previousPage: data.previous_page,
          count: data.count || organizations.length,
        },
        metadata: {
          operation: 'get_organizations' as const,
          totalReturned: organizations.length,
        },
        success: true,
      },
    }
  },

  outputs: {
    organizations: { type: 'array', description: 'Array of organization objects' },
    paging: { type: 'object', description: 'Pagination information' },
    metadata: { type: 'object', description: 'Operation metadata' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_ticket.ts]---
Location: sim-main/apps/sim/tools/zendesk/get_ticket.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildZendeskUrl, handleZendeskError } from './types'

const logger = createLogger('ZendeskGetTicket')

export interface ZendeskGetTicketParams {
  email: string
  apiToken: string
  subdomain: string
  ticketId: string
}

export interface ZendeskGetTicketResponse {
  success: boolean
  output: {
    ticket: any
    metadata: {
      operation: 'get_ticket'
    }
    success: boolean
  }
}

export const zendeskGetTicketTool: ToolConfig<ZendeskGetTicketParams, ZendeskGetTicketResponse> = {
  id: 'zendesk_get_ticket',
  name: 'Get Single Ticket from Zendesk',
  description: 'Get a single ticket by ID from Zendesk',
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
      description: 'Ticket ID to retrieve',
    },
  },

  request: {
    url: (params) => buildZendeskUrl(params.subdomain, `/tickets/${params.ticketId}`),
    method: 'GET',
    headers: (params) => {
      // Use Basic Authentication with email/token format for Zendesk API tokens
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
      handleZendeskError(data, response.status, 'get_ticket')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        ticket: data.ticket,
        metadata: {
          operation: 'get_ticket' as const,
        },
        success: true,
      },
    }
  },

  outputs: {
    ticket: { type: 'object', description: 'Ticket object' },
    metadata: { type: 'object', description: 'Operation metadata' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_tickets.ts]---
Location: sim-main/apps/sim/tools/zendesk/get_tickets.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildZendeskUrl, handleZendeskError } from './types'

const logger = createLogger('ZendeskGetTickets')

export interface ZendeskGetTicketsParams {
  email: string
  apiToken: string
  subdomain: string
  status?: string
  priority?: string
  type?: string
  assigneeId?: string
  organizationId?: string
  sortBy?: string
  sortOrder?: string
  perPage?: string
  page?: string
}

export interface ZendeskGetTicketsResponse {
  success: boolean
  output: {
    tickets: any[]
    paging?: {
      nextPage?: string | null
      previousPage?: string | null
      count: number
    }
    metadata: {
      operation: 'get_tickets'
      totalReturned: number
    }
    success: boolean
  }
}

export const zendeskGetTicketsTool: ToolConfig<ZendeskGetTicketsParams, ZendeskGetTicketsResponse> =
  {
    id: 'zendesk_get_tickets',
    name: 'Get Tickets from Zendesk',
    description: 'Retrieve a list of tickets from Zendesk with optional filtering',
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
        description: 'Your Zendesk subdomain (e.g., "mycompany" for mycompany.zendesk.com)',
      },
      status: {
        type: 'string',
        required: false,
        visibility: 'user-only',
        description: 'Filter by status (new, open, pending, hold, solved, closed)',
      },
      priority: {
        type: 'string',
        required: false,
        visibility: 'user-only',
        description: 'Filter by priority (low, normal, high, urgent)',
      },
      type: {
        type: 'string',
        required: false,
        visibility: 'user-only',
        description: 'Filter by type (problem, incident, question, task)',
      },
      assigneeId: {
        type: 'string',
        required: false,
        visibility: 'user-only',
        description: 'Filter by assignee user ID',
      },
      organizationId: {
        type: 'string',
        required: false,
        visibility: 'user-only',
        description: 'Filter by organization ID',
      },
      sortBy: {
        type: 'string',
        required: false,
        visibility: 'user-only',
        description: 'Sort field (created_at, updated_at, priority, status)',
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
        const hasFilters =
          params.status ||
          params.priority ||
          params.type ||
          params.assigneeId ||
          params.organizationId

        if (hasFilters) {
          // Use Search API for filtering - the /tickets endpoint doesn't support filter params
          // Build search query using Zendesk search syntax
          const searchTerms: string[] = ['type:ticket']
          if (params.status) searchTerms.push(`status:${params.status}`)
          if (params.priority) searchTerms.push(`priority:${params.priority}`)
          if (params.type) searchTerms.push(`ticket_type:${params.type}`)
          if (params.assigneeId) searchTerms.push(`assignee_id:${params.assigneeId}`)
          if (params.organizationId) searchTerms.push(`organization_id:${params.organizationId}`)

          const queryParams = new URLSearchParams()
          queryParams.append('query', searchTerms.join(' '))
          if (params.sortBy) queryParams.append('sort_by', params.sortBy)
          if (params.sortOrder) queryParams.append('sort_order', params.sortOrder)
          if (params.page) queryParams.append('page', params.page)
          if (params.perPage) queryParams.append('per_page', params.perPage)

          return `${buildZendeskUrl(params.subdomain, '/search')}?${queryParams.toString()}`
        }

        // No filters - use the simple /tickets endpoint
        const queryParams = new URLSearchParams()
        if (params.sortBy) queryParams.append('sort_by', params.sortBy)
        if (params.sortOrder) queryParams.append('sort_order', params.sortOrder)
        if (params.page) queryParams.append('page', params.page)
        if (params.perPage) queryParams.append('per_page', params.perPage)

        const query = queryParams.toString()
        const url = buildZendeskUrl(params.subdomain, '/tickets')
        return query ? `${url}?${query}` : url
      },
      method: 'GET',
      headers: (params) => {
        // Use Basic Authentication with email/token format for Zendesk API tokens
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
        handleZendeskError(data, response.status, 'get_tickets')
      }

      const data = await response.json()
      // Handle both /tickets response (data.tickets) and /search response (data.results)
      const tickets = data.tickets || data.results || []

      return {
        success: true,
        output: {
          tickets,
          paging: {
            nextPage: data.next_page,
            previousPage: data.previous_page,
            count: data.count || tickets.length,
          },
          metadata: {
            operation: 'get_tickets' as const,
            totalReturned: tickets.length,
          },
          success: true,
        },
      }
    },

    outputs: {
      tickets: { type: 'array', description: 'Array of ticket objects' },
      paging: { type: 'object', description: 'Pagination information' },
      metadata: { type: 'object', description: 'Operation metadata' },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: get_user.ts]---
Location: sim-main/apps/sim/tools/zendesk/get_user.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildZendeskUrl, handleZendeskError } from './types'

const logger = createLogger('ZendeskGetUser')

export interface ZendeskGetUserParams {
  email: string
  apiToken: string
  subdomain: string
  userId: string
}

export interface ZendeskGetUserResponse {
  success: boolean
  output: {
    user: any
    metadata: {
      operation: 'get_user'
    }
    success: boolean
  }
}

export const zendeskGetUserTool: ToolConfig<ZendeskGetUserParams, ZendeskGetUserResponse> = {
  id: 'zendesk_get_user',
  name: 'Get Single User from Zendesk',
  description: 'Get a single user by ID from Zendesk',
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
      description: 'User ID to retrieve',
    },
  },

  request: {
    url: (params) => buildZendeskUrl(params.subdomain, `/users/${params.userId}`),
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
      handleZendeskError(data, response.status, 'get_user')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        user: data.user,
        metadata: {
          operation: 'get_user' as const,
        },
        success: true,
      },
    }
  },

  outputs: {
    user: { type: 'object', description: 'User object' },
    metadata: { type: 'object', description: 'Operation metadata' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_users.ts]---
Location: sim-main/apps/sim/tools/zendesk/get_users.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildZendeskUrl, handleZendeskError } from './types'

const logger = createLogger('ZendeskGetUsers')

export interface ZendeskGetUsersParams {
  email: string
  apiToken: string
  subdomain: string
  role?: string
  permissionSet?: string
  perPage?: string
  page?: string
}

export interface ZendeskGetUsersResponse {
  success: boolean
  output: {
    users: any[]
    paging?: {
      nextPage?: string | null
      previousPage?: string | null
      count: number
    }
    metadata: {
      operation: 'get_users'
      totalReturned: number
    }
    success: boolean
  }
}

export const zendeskGetUsersTool: ToolConfig<ZendeskGetUsersParams, ZendeskGetUsersResponse> = {
  id: 'zendesk_get_users',
  name: 'Get Users from Zendesk',
  description: 'Retrieve a list of users from Zendesk with optional filtering',
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
      description: 'Your Zendesk subdomain (e.g., "mycompany" for mycompany.zendesk.com)',
    },
    role: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Filter by role (end-user, agent, admin)',
    },
    permissionSet: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Filter by permission set ID',
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
      if (params.role) queryParams.append('role', params.role)
      if (params.permissionSet) queryParams.append('permission_set', params.permissionSet)
      if (params.page) queryParams.append('page', params.page)
      if (params.perPage) queryParams.append('per_page', params.perPage)

      const query = queryParams.toString()
      const url = buildZendeskUrl(params.subdomain, '/users')
      return query ? `${url}?${query}` : url
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
      handleZendeskError(data, response.status, 'get_users')
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
          operation: 'get_users' as const,
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

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/zendesk/index.ts

```typescript
export { zendeskAutocompleteOrganizationsTool } from './autocomplete_organizations'
export { zendeskCreateOrganizationTool } from './create_organization'
export { zendeskCreateOrganizationsBulkTool } from './create_organizations_bulk'
export { zendeskCreateTicketTool } from './create_ticket'
export { zendeskCreateTicketsBulkTool } from './create_tickets_bulk'
export { zendeskCreateUserTool } from './create_user'
export { zendeskCreateUsersBulkTool } from './create_users_bulk'
export { zendeskDeleteOrganizationTool } from './delete_organization'
export { zendeskDeleteTicketTool } from './delete_ticket'
export { zendeskDeleteUserTool } from './delete_user'
export { zendeskGetCurrentUserTool } from './get_current_user'
export { zendeskGetOrganizationTool } from './get_organization'
export { zendeskGetOrganizationsTool } from './get_organizations'
export { zendeskGetTicketTool } from './get_ticket'
export { zendeskGetTicketsTool } from './get_tickets'
export { zendeskGetUserTool } from './get_user'
export { zendeskGetUsersTool } from './get_users'
export { zendeskMergeTicketsTool } from './merge_tickets'
export { zendeskSearchTool } from './search'
export { zendeskSearchCountTool } from './search_count'
export { zendeskSearchUsersTool } from './search_users'
export { zendeskUpdateOrganizationTool } from './update_organization'
export { zendeskUpdateTicketTool } from './update_ticket'
export { zendeskUpdateTicketsBulkTool } from './update_tickets_bulk'
export { zendeskUpdateUserTool } from './update_user'
export { zendeskUpdateUsersBulkTool } from './update_users_bulk'
```

--------------------------------------------------------------------------------

````
