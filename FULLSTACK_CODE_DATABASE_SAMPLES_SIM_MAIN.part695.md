---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 695
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 695 of 933)

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

---[FILE: workflows_update.ts]---
Location: sim-main/apps/sim/tools/incidentio/workflows_update.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { WorkflowsUpdateParams, WorkflowsUpdateResponse } from './types'

export const workflowsUpdateTool: ToolConfig<WorkflowsUpdateParams, WorkflowsUpdateResponse> = {
  id: 'incidentio_workflows_update',
  name: 'incident.io Workflows Update',
  description: 'Update an existing workflow in incident.io.',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'incident.io API Key',
    },
    id: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The ID of the workflow to update',
    },
    name: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New name for the workflow',
    },
    state: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New state for the workflow (active, draft, or disabled)',
    },
    folder: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New folder for the workflow',
    },
  },

  request: {
    url: (params) => `https://api.incident.io/v2/workflows/${params.id}`,
    method: 'PUT',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
    body: (params) => {
      const body: Record<string, any> = {}

      if (params.name) {
        body.name = params.name
      }

      if (params.state) {
        body.state = params.state
      }

      if (params.folder) {
        body.folder = params.folder
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        workflow: {
          id: data.workflow.id,
          name: data.workflow.name,
          state: data.workflow.state,
          folder: data.workflow.folder,
          created_at: data.workflow.created_at,
          updated_at: data.workflow.updated_at,
        },
      },
    }
  },

  outputs: {
    workflow: {
      type: 'object',
      description: 'The updated workflow',
      properties: {
        id: { type: 'string', description: 'Unique identifier for the workflow' },
        name: { type: 'string', description: 'Name of the workflow' },
        state: {
          type: 'string',
          description: 'State of the workflow (active, draft, or disabled)',
        },
        folder: { type: 'string', description: 'Folder the workflow belongs to', optional: true },
        created_at: {
          type: 'string',
          description: 'When the workflow was created',
          optional: true,
        },
        updated_at: {
          type: 'string',
          description: 'When the workflow was last updated',
          optional: true,
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_company.ts]---
Location: sim-main/apps/sim/tools/intercom/create_company.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildIntercomUrl, handleIntercomError } from './types'

const logger = createLogger('IntercomCreateCompany')

export interface IntercomCreateCompanyParams {
  accessToken: string
  company_id: string
  name?: string
  website?: string
  plan?: string
  size?: number
  industry?: string
  monthly_spend?: number
  custom_attributes?: string
}

export interface IntercomCreateCompanyResponse {
  success: boolean
  output: {
    company: any
    metadata: {
      operation: 'create_company'
      companyId: string
    }
    success: boolean
  }
}

export const intercomCreateCompanyTool: ToolConfig<
  IntercomCreateCompanyParams,
  IntercomCreateCompanyResponse
> = {
  id: 'intercom_create_company',
  name: 'Create Company in Intercom',
  description: 'Create or update a company in Intercom',
  version: '1.0.0',

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Intercom API access token',
    },
    company_id: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your unique identifier for the company',
    },
    name: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The name of the company',
    },
    website: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The company website',
    },
    plan: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The company plan name',
    },
    size: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'The number of employees in the company',
    },
    industry: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The industry the company operates in',
    },
    monthly_spend: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description:
        'How much revenue the company generates for your business. Note: This field truncates floats to whole integers (e.g., 155.98 becomes 155)',
    },
    custom_attributes: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Custom attributes as JSON object',
    },
  },

  request: {
    url: () => buildIntercomUrl('/companies'),
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Intercom-Version': '2.14',
    }),
    body: (params) => {
      const company: any = {
        company_id: params.company_id,
      }

      if (params.name) company.name = params.name
      if (params.website) company.website = params.website
      if (params.plan) company.plan = params.plan
      if (params.size) company.size = params.size
      if (params.industry) company.industry = params.industry
      if (params.monthly_spend) company.monthly_spend = params.monthly_spend

      if (params.custom_attributes) {
        try {
          company.custom_attributes = JSON.parse(params.custom_attributes)
        } catch (error) {
          logger.warn('Failed to parse custom attributes', { error })
        }
      }

      return company
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleIntercomError(data, response.status, 'create_company')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        company: data,
        metadata: {
          operation: 'create_company' as const,
          companyId: data.id,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Created or updated company data',
      properties: {
        company: { type: 'object', description: 'Company object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_contact.ts]---
Location: sim-main/apps/sim/tools/intercom/create_contact.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildIntercomUrl, handleIntercomError } from './types'

const logger = createLogger('IntercomCreateContact')

export interface IntercomCreateContactParams {
  accessToken: string
  email?: string
  external_id?: string
  phone?: string
  name?: string
  avatar?: string
  signed_up_at?: number
  last_seen_at?: number
  owner_id?: string
  unsubscribed_from_emails?: boolean
  custom_attributes?: string
}

export interface IntercomCreateContactResponse {
  success: boolean
  output: {
    contact: any
    metadata: {
      operation: 'create_contact'
      contactId: string
    }
    success: boolean
  }
}

export const intercomCreateContactTool: ToolConfig<
  IntercomCreateContactParams,
  IntercomCreateContactResponse
> = {
  id: 'intercom_create_contact',
  name: 'Create Contact in Intercom',
  description: 'Create a new contact in Intercom with email, external_id, or role',
  version: '1.0.0',

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Intercom API access token',
    },
    email: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: "The contact's email address",
    },
    external_id: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'A unique identifier for the contact provided by the client',
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
    url: () => buildIntercomUrl('/contacts'),
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
      'Intercom-Version': '2.14',
    }),
    body: (params) => {
      const contact: any = {}

      if (params.email) contact.email = params.email
      if (params.external_id) contact.external_id = params.external_id
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
      handleIntercomError(data, response.status, 'create_contact')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        contact: data,
        metadata: {
          operation: 'create_contact' as const,
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
      description: 'Created contact data',
      properties: {
        contact: { type: 'object', description: 'Created contact object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_message.ts]---
Location: sim-main/apps/sim/tools/intercom/create_message.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildIntercomUrl, handleIntercomError } from './types'

const logger = createLogger('IntercomCreateMessage')

export interface IntercomCreateMessageParams {
  accessToken: string
  message_type: string
  subject?: string
  body: string
  from_type: string
  from_id: string
  to_type: string
  to_id: string
}

export interface IntercomCreateMessageResponse {
  success: boolean
  output: {
    message: any
    metadata: {
      operation: 'create_message'
      messageId: string
    }
    success: boolean
  }
}

export const intercomCreateMessageTool: ToolConfig<
  IntercomCreateMessageParams,
  IntercomCreateMessageResponse
> = {
  id: 'intercom_create_message',
  name: 'Create Message in Intercom',
  description: 'Create and send a new admin-initiated message in Intercom',
  version: '1.0.0',

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Intercom API access token',
    },
    message_type: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Message type: "inapp" or "email"',
    },
    subject: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The subject of the message (for email type)',
    },
    body: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The body of the message',
    },
    from_type: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Sender type: "admin"',
    },
    from_id: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the admin sending the message',
    },
    to_type: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Recipient type: "contact"',
    },
    to_id: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the contact receiving the message',
    },
  },

  request: {
    url: () => buildIntercomUrl('/messages'),
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
      'Intercom-Version': '2.14',
    }),
    body: (params) => {
      const message: any = {
        message_type: params.message_type,
        body: params.body,
        from: {
          type: params.from_type,
          id: params.from_id,
        },
        to: {
          type: params.to_type,
          id: params.to_id,
        },
      }

      if (params.subject && params.message_type === 'email') {
        message.subject = params.subject
      }

      return message
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleIntercomError(data, response.status, 'create_message')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        message: data,
        metadata: {
          operation: 'create_message' as const,
          messageId: data.id,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Created message data',
      properties: {
        message: { type: 'object', description: 'Created message object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_ticket.ts]---
Location: sim-main/apps/sim/tools/intercom/create_ticket.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildIntercomUrl, handleIntercomError } from './types'

const logger = createLogger('IntercomCreateTicket')

export interface IntercomCreateTicketParams {
  accessToken: string
  ticket_type_id: string
  contacts: string
  ticket_attributes: string
}

export interface IntercomCreateTicketResponse {
  success: boolean
  output: {
    ticket: any
    metadata: {
      operation: 'create_ticket'
      ticketId: string
    }
    success: boolean
  }
}

export const intercomCreateTicketTool: ToolConfig<
  IntercomCreateTicketParams,
  IntercomCreateTicketResponse
> = {
  id: 'intercom_create_ticket',
  name: 'Create Ticket in Intercom',
  description: 'Create a new ticket in Intercom',
  version: '1.0.0',

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Intercom API access token',
    },
    ticket_type_id: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the ticket type',
    },
    contacts: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'JSON array of contact identifiers (e.g., [{"id": "contact_id"}])',
    },
    ticket_attributes: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description:
        'JSON object with ticket attributes including _default_title_ and _default_description_',
    },
  },

  request: {
    url: () => buildIntercomUrl('/tickets'),
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
      'Intercom-Version': '2.14',
    }),
    body: (params) => {
      const ticket: any = {
        ticket_type_id: params.ticket_type_id,
      }

      try {
        ticket.contacts = JSON.parse(params.contacts)
      } catch (error) {
        logger.warn('Failed to parse contacts, using as single contact ID', { error })
        ticket.contacts = [{ id: params.contacts }]
      }

      try {
        ticket.ticket_attributes = JSON.parse(params.ticket_attributes)
      } catch (error) {
        logger.error('Failed to parse ticket attributes', { error })
        throw new Error('ticket_attributes must be a valid JSON object')
      }

      return ticket
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleIntercomError(data, response.status, 'create_ticket')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        ticket: data,
        metadata: {
          operation: 'create_ticket' as const,
          ticketId: data.id,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Created ticket data',
      properties: {
        ticket: { type: 'object', description: 'Created ticket object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_contact.ts]---
Location: sim-main/apps/sim/tools/intercom/delete_contact.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildIntercomUrl, handleIntercomError } from './types'

const logger = createLogger('IntercomDeleteContact')

export interface IntercomDeleteContactParams {
  accessToken: string
  contactId: string
}

export interface IntercomDeleteContactResponse {
  success: boolean
  output: {
    id: string
    deleted: boolean
    metadata: {
      operation: 'delete_contact'
    }
    success: boolean
  }
}

export const intercomDeleteContactTool: ToolConfig<
  IntercomDeleteContactParams,
  IntercomDeleteContactResponse
> = {
  id: 'intercom_delete_contact',
  name: 'Delete Contact from Intercom',
  description: 'Delete a contact from Intercom by ID',
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
      description: 'Contact ID to delete',
    },
  },

  request: {
    url: (params) => buildIntercomUrl(`/contacts/${params.contactId}`),
    method: 'DELETE',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
      'Intercom-Version': '2.14',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleIntercomError(data, response.status, 'delete_contact')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        id: data.id,
        deleted: true,
        metadata: {
          operation: 'delete_contact' as const,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Deletion result',
      properties: {
        id: { type: 'string', description: 'ID of deleted contact' },
        deleted: { type: 'boolean', description: 'Deletion status' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_company.ts]---
Location: sim-main/apps/sim/tools/intercom/get_company.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildIntercomUrl, handleIntercomError } from './types'

const logger = createLogger('IntercomGetCompany')

export interface IntercomGetCompanyParams {
  accessToken: string
  companyId: string
}

export interface IntercomGetCompanyResponse {
  success: boolean
  output: {
    company: any
    metadata: {
      operation: 'get_company'
    }
    success: boolean
  }
}

export const intercomGetCompanyTool: ToolConfig<
  IntercomGetCompanyParams,
  IntercomGetCompanyResponse
> = {
  id: 'intercom_get_company',
  name: 'Get Company from Intercom',
  description: 'Retrieve a single company by ID from Intercom',
  version: '1.0.0',

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Intercom API access token',
    },
    companyId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Company ID to retrieve',
    },
  },

  request: {
    url: (params) => buildIntercomUrl(`/companies/${params.companyId}`),
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
      handleIntercomError(data, response.status, 'get_company')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        company: data,
        metadata: {
          operation: 'get_company' as const,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Company data',
      properties: {
        company: { type: 'object', description: 'Company object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_contact.ts]---
Location: sim-main/apps/sim/tools/intercom/get_contact.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildIntercomUrl, handleIntercomError } from './types'

const logger = createLogger('IntercomGetContact')

export interface IntercomGetContactParams {
  accessToken: string
  contactId: string
}

export interface IntercomGetContactResponse {
  success: boolean
  output: {
    contact: any
    metadata: {
      operation: 'get_contact'
    }
    success: boolean
  }
}

export const intercomGetContactTool: ToolConfig<
  IntercomGetContactParams,
  IntercomGetContactResponse
> = {
  id: 'intercom_get_contact',
  name: 'Get Single Contact from Intercom',
  description: 'Get a single contact by ID from Intercom',
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
      description: 'Contact ID to retrieve',
    },
  },

  request: {
    url: (params) => buildIntercomUrl(`/contacts/${params.contactId}`),
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
      handleIntercomError(data, response.status, 'get_contact')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        contact: data,
        metadata: {
          operation: 'get_contact' as const,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Contact data',
      properties: {
        contact: { type: 'object', description: 'Contact object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_conversation.ts]---
Location: sim-main/apps/sim/tools/intercom/get_conversation.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildIntercomUrl, handleIntercomError } from './types'

const logger = createLogger('IntercomGetConversation')

export interface IntercomGetConversationParams {
  accessToken: string
  conversationId: string
  display_as?: string
}

export interface IntercomGetConversationResponse {
  success: boolean
  output: {
    conversation: any
    metadata: {
      operation: 'get_conversation'
    }
    success: boolean
  }
}

export const intercomGetConversationTool: ToolConfig<
  IntercomGetConversationParams,
  IntercomGetConversationResponse
> = {
  id: 'intercom_get_conversation',
  name: 'Get Conversation from Intercom',
  description: 'Retrieve a single conversation by ID from Intercom',
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
      description: 'Conversation ID to retrieve',
    },
    display_as: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Set to "plaintext" to retrieve messages in plain text',
    },
  },

  request: {
    url: (params) => {
      const url = buildIntercomUrl(`/conversations/${params.conversationId}`)
      if (params.display_as) {
        return `${url}?display_as=${params.display_as}`
      }
      return url
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
      handleIntercomError(data, response.status, 'get_conversation')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        conversation: data,
        metadata: {
          operation: 'get_conversation' as const,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Conversation data',
      properties: {
        conversation: { type: 'object', description: 'Conversation object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_ticket.ts]---
Location: sim-main/apps/sim/tools/intercom/get_ticket.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildIntercomUrl, handleIntercomError } from './types'

const logger = createLogger('IntercomGetTicket')

export interface IntercomGetTicketParams {
  accessToken: string
  ticketId: string
}

export interface IntercomGetTicketResponse {
  success: boolean
  output: {
    ticket: any
    metadata: {
      operation: 'get_ticket'
    }
    success: boolean
  }
}

export const intercomGetTicketTool: ToolConfig<IntercomGetTicketParams, IntercomGetTicketResponse> =
  {
    id: 'intercom_get_ticket',
    name: 'Get Ticket from Intercom',
    description: 'Retrieve a single ticket by ID from Intercom',
    version: '1.0.0',

    params: {
      accessToken: {
        type: 'string',
        required: true,
        visibility: 'hidden',
        description: 'Intercom API access token',
      },
      ticketId: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'Ticket ID to retrieve',
      },
    },

    request: {
      url: (params) => buildIntercomUrl(`/tickets/${params.ticketId}`),
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
        handleIntercomError(data, response.status, 'get_ticket')
      }

      const data = await response.json()

      return {
        success: true,
        output: {
          ticket: data,
          metadata: {
            operation: 'get_ticket' as const,
          },
          success: true,
        },
      }
    },

    outputs: {
      success: { type: 'boolean', description: 'Operation success status' },
      output: {
        type: 'object',
        description: 'Ticket data',
        properties: {
          ticket: { type: 'object', description: 'Ticket object' },
          metadata: { type: 'object', description: 'Operation metadata' },
          success: { type: 'boolean', description: 'Operation success' },
        },
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/intercom/index.ts

```typescript
// Contact tools

// Company tools
export { intercomCreateCompanyTool } from './create_company'
export { intercomCreateContactTool } from './create_contact'
// Message tools
export { intercomCreateMessageTool } from './create_message'
// Ticket tools
export { intercomCreateTicketTool } from './create_ticket'
export { intercomDeleteContactTool } from './delete_contact'
export { intercomGetCompanyTool } from './get_company'
export { intercomGetContactTool } from './get_contact'
// Conversation tools
export { intercomGetConversationTool } from './get_conversation'
export { intercomGetTicketTool } from './get_ticket'
export { intercomListCompaniesTool } from './list_companies'
export { intercomListContactsTool } from './list_contacts'
export { intercomListConversationsTool } from './list_conversations'
export { intercomReplyConversationTool } from './reply_conversation'
export { intercomSearchContactsTool } from './search_contacts'
export { intercomSearchConversationsTool } from './search_conversations'
export { intercomUpdateContactTool } from './update_contact'
```

--------------------------------------------------------------------------------

---[FILE: list_companies.ts]---
Location: sim-main/apps/sim/tools/intercom/list_companies.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildIntercomUrl, handleIntercomError } from './types'

const logger = createLogger('IntercomListCompanies')

export interface IntercomListCompaniesParams {
  accessToken: string
  per_page?: number
  page?: number
}

export interface IntercomListCompaniesResponse {
  success: boolean
  output: {
    companies: any[]
    pages?: any
    metadata: {
      operation: 'list_companies'
      total_count?: number
    }
    success: boolean
  }
}

export const intercomListCompaniesTool: ToolConfig<
  IntercomListCompaniesParams,
  IntercomListCompaniesResponse
> = {
  id: 'intercom_list_companies',
  name: 'List Companies from Intercom',
  description:
    'List all companies from Intercom with pagination support. Note: This endpoint has a limit of 10,000 companies that can be returned using pagination. For datasets larger than 10,000 companies, use the Scroll API instead.',
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
      description: 'Number of results per page',
    },
    page: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Page number',
    },
  },

  request: {
    url: (params) => {
      const url = buildIntercomUrl('/companies/list')
      const queryParams = new URLSearchParams()

      if (params.per_page) queryParams.append('per_page', params.per_page.toString())
      if (params.page) queryParams.append('page', params.page.toString())

      const queryString = queryParams.toString()
      return queryString ? `${url}?${queryString}` : url
    },
    method: 'POST',
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
      handleIntercomError(data, response.status, 'list_companies')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        companies: data.data || data.companies || [],
        pages: data.pages,
        metadata: {
          operation: 'list_companies' as const,
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
      description: 'List of companies',
      properties: {
        companies: { type: 'array', description: 'Array of company objects' },
        pages: { type: 'object', description: 'Pagination information' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

````
