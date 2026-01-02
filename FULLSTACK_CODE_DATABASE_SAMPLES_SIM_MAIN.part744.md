---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 744
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 744 of 933)

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

---[FILE: update_task.ts]---
Location: sim-main/apps/sim/tools/salesforce/update_task.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import { getInstanceUrl } from './utils'

export interface SalesforceUpdateTaskParams {
  accessToken: string
  idToken?: string
  instanceUrl?: string
  taskId: string
  subject?: string
  status?: string
  priority?: string
  activityDate?: string
  description?: string
}

export interface SalesforceUpdateTaskResponse {
  success: boolean
  output: {
    id: string
    updated: boolean
    metadata: {
      operation: 'update_task'
    }
  }
}

export const salesforceUpdateTaskTool: ToolConfig<
  SalesforceUpdateTaskParams,
  SalesforceUpdateTaskResponse
> = {
  id: 'salesforce_update_task',
  name: 'Update Task in Salesforce',
  description: 'Update an existing task',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'salesforce',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
    },
    idToken: {
      type: 'string',
      required: false,
      visibility: 'hidden',
    },
    instanceUrl: {
      type: 'string',
      required: false,
      visibility: 'hidden',
    },
    taskId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Task ID (required)',
    },
    subject: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Task subject',
    },
    status: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Status',
    },
    priority: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Priority',
    },
    activityDate: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Due date YYYY-MM-DD',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Description',
    },
  },

  request: {
    url: (params) =>
      `${getInstanceUrl(params.idToken, params.instanceUrl)}/services/data/v59.0/sobjects/Task/${params.taskId}`,
    method: 'PATCH',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: Record<string, any> = {}
      if (params.subject) body.Subject = params.subject
      if (params.status) body.Status = params.status
      if (params.priority) body.Priority = params.priority
      if (params.activityDate) body.ActivityDate = params.activityDate
      if (params.description) body.Description = params.description
      return body
    },
  },

  transformResponse: async (response, params?) => {
    if (!response.ok) {
      const data = await response.json()
      throw new Error(data[0]?.message || data.message || 'Failed to update task')
    }
    return {
      success: true,
      output: {
        id: params?.taskId || '',
        updated: true,
        metadata: { operation: 'update_task' },
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Success' },
    output: { type: 'object', description: 'Updated task' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/tools/salesforce/utils.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('SalesforceUtils')

/**
 * Extracts Salesforce instance URL from ID token or uses provided instance URL
 * @param idToken - The Salesforce ID token containing instance URL
 * @param instanceUrl - Direct instance URL if provided
 * @returns The Salesforce instance URL
 * @throws Error if instance URL cannot be determined
 */
export function getInstanceUrl(idToken?: string, instanceUrl?: string): string {
  if (instanceUrl) return instanceUrl
  if (idToken) {
    try {
      const base64Url = idToken.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
          .join('')
      )
      const decoded = JSON.parse(jsonPayload)
      if (decoded.profile) {
        const match = decoded.profile.match(/^(https:\/\/[^/]+)/)
        if (match) return match[1]
      } else if (decoded.sub) {
        const match = decoded.sub.match(/^(https:\/\/[^/]+)/)
        if (match && match[1] !== 'https://login.salesforce.com') return match[1]
      }
    } catch (error) {
      logger.error('Failed to decode Salesforce idToken', { error })
    }
  }
  throw new Error('Salesforce instance URL is required but not provided')
}

/**
 * Extracts a descriptive error message from Salesforce API responses
 * @param data - The response data from Salesforce API
 * @param status - HTTP status code
 * @param defaultMessage - Default message to use if no specific error found
 * @returns Formatted error message
 */
export function extractErrorMessage(data: any, status: number, defaultMessage: string): string {
  if (Array.isArray(data) && data[0]?.message) {
    return `Salesforce API Error (${status}): ${data[0].message}${data[0].errorCode ? ` [${data[0].errorCode}]` : ''}`
  }
  if (data?.message) {
    return `Salesforce API Error (${status}): ${data.message}`
  }
  if (data?.error) {
    return `Salesforce API Error (${status}): ${data.error}${data.error_description ? ` - ${data.error_description}` : ''}`
  }
  switch (status) {
    case 400:
      return `Salesforce API Error (400): Bad Request - The request was malformed or missing required parameters`
    case 401:
      return `Salesforce API Error (401): Unauthorized - Invalid or expired access token. Please re-authenticate.`
    case 403:
      return `Salesforce API Error (403): Forbidden - You do not have permission to access this resource.`
    case 404:
      return `Salesforce API Error (404): Not Found - The requested resource does not exist or you do not have access to it.`
    case 500:
      return `Salesforce API Error (500): Internal Server Error - An error occurred on Salesforce's servers.`
    default:
      return `${defaultMessage} (HTTP ${status})`
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/search/index.ts

```typescript
export { searchTool } from './tool'
export type { SearchParams, SearchResponse } from './types'
```

--------------------------------------------------------------------------------

---[FILE: tool.ts]---
Location: sim-main/apps/sim/tools/search/tool.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { SearchParams, SearchResponse } from './types'

export const searchTool: ToolConfig<SearchParams, SearchResponse> = {
  id: 'search_tool',
  name: 'Web Search',
  description:
    'Search the web. Returns the most relevant web results, including title, link, snippet, and date for each result.',
  version: '1.0.0',

  params: {
    query: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The search query',
    },
  },

  request: {
    url: () => '/api/tools/search',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      query: params.query,
    }),
  },

  transformResponse: async (response) => {
    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`)
    }
    const data = await response.json()
    return {
      success: true,
      output: data,
    }
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/search/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface SearchParams {
  query: string
}

export interface SearchResponse extends ToolResponse {
  output: {
    results: Array<{
      title: string
      link: string
      snippet: string
      date?: string
      position: number
    }>
    query: string
    totalResults: number
    source: 'exa'
    cost: {
      input: number
      output: number
      total: number
      tokens: {
        prompt: number
        completion: number
        total: number
      }
      model: string
      pricing?: {
        input: number
        cachedInput: number
        output: number
        updatedAt: string
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: add_contact.ts]---
Location: sim-main/apps/sim/tools/sendgrid/add_contact.ts

```typescript
import type {
  AddContactParams,
  ContactResult,
  SendGridContactObject,
  SendGridContactRequest,
} from '@/tools/sendgrid/types'
import type { ToolConfig } from '@/tools/types'

export const sendGridAddContactTool: ToolConfig<AddContactParams, ContactResult> = {
  id: 'sendgrid_add_contact',
  name: 'SendGrid Add Contact',
  description: 'Add a new contact to SendGrid',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SendGrid API key',
    },
    email: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Contact email address',
    },
    firstName: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Contact first name',
    },
    lastName: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Contact last name',
    },
    customFields: {
      type: 'json',
      required: false,
      visibility: 'user-or-llm',
      description:
        'JSON object of custom field key-value pairs (use field IDs like e1_T, e2_N, e3_D, not field names)',
    },
    listIds: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Comma-separated list IDs to add the contact to',
    },
  },

  request: {
    url: () => 'https://api.sendgrid.com/v3/marketing/contacts',
    method: 'PUT',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const contact: SendGridContactObject = {
        email: params.email,
      }

      if (params.firstName) contact.first_name = params.firstName
      if (params.lastName) contact.last_name = params.lastName

      if (params.customFields) {
        const customFields =
          typeof params.customFields === 'string'
            ? JSON.parse(params.customFields)
            : params.customFields
        Object.assign(contact, customFields)
      }

      const body: SendGridContactRequest = {
        contacts: [contact],
      }

      if (params.listIds) {
        body.list_ids = params.listIds.split(',').map((id) => id.trim())
      }

      return { body: JSON.stringify(body) }
    },
  },

  transformResponse: async (response, params): Promise<ContactResult> => {
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.errors?.[0]?.message || 'Failed to add contact')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        jobId: data.job_id,
        email: params?.email || '',
        firstName: params?.firstName,
        lastName: params?.lastName,
        message:
          'Contact is being added. This is an asynchronous operation. Use the job ID to track status.',
      },
    }
  },

  outputs: {
    jobId: { type: 'string', description: 'Job ID for tracking the async contact creation' },
    email: { type: 'string', description: 'Contact email address' },
    firstName: { type: 'string', description: 'Contact first name' },
    lastName: { type: 'string', description: 'Contact last name' },
    message: { type: 'string', description: 'Status message' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: add_contacts_to_list.ts]---
Location: sim-main/apps/sim/tools/sendgrid/add_contacts_to_list.ts

```typescript
import type { AddContactsToListParams, SendGridContactObject } from '@/tools/sendgrid/types'
import type { ToolConfig, ToolResponse } from '@/tools/types'

export const sendGridAddContactsToListTool: ToolConfig<AddContactsToListParams, ToolResponse> = {
  id: 'sendgrid_add_contacts_to_list',
  name: 'SendGrid Add Contacts to List',
  description:
    'Add or update contacts and assign them to a list in SendGrid (uses PUT /v3/marketing/contacts)',
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
      description: 'List ID to add contacts to',
    },
    contacts: {
      type: 'json',
      required: true,
      visibility: 'user-or-llm',
      description:
        'JSON array of contact objects. Each contact must have at least: email (or phone_number_id/external_id/anonymous_id). Example: [{"email": "user@example.com", "first_name": "John"}]',
    },
  },

  request: {
    url: () => 'https://api.sendgrid.com/v3/marketing/contacts',
    method: 'PUT',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const contactsArray: SendGridContactObject[] =
        typeof params.contacts === 'string' ? JSON.parse(params.contacts) : params.contacts

      return {
        body: JSON.stringify({
          list_ids: [params.listId],
          contacts: contactsArray,
        }),
      }
    },
  },

  transformResponse: async (response): Promise<ToolResponse> => {
    if (!response.ok) {
      const error = (await response.json()) as { errors?: Array<{ message?: string }> }
      throw new Error(error.errors?.[0]?.message || 'Failed to add contacts to list')
    }

    const data = (await response.json()) as { job_id: string }

    return {
      success: true,
      output: {
        jobId: data.job_id,
        message: 'Contacts are being added to the list. This is an asynchronous operation.',
      },
    }
  },

  outputs: {
    jobId: { type: 'string', description: 'Job ID for tracking the async operation' },
    message: { type: 'string', description: 'Status message' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_list.ts]---
Location: sim-main/apps/sim/tools/sendgrid/create_list.ts

```typescript
import type { CreateListParams, ListResult, SendGridList } from '@/tools/sendgrid/types'
import type { ToolConfig } from '@/tools/types'

export const sendGridCreateListTool: ToolConfig<CreateListParams, ListResult> = {
  id: 'sendgrid_create_list',
  name: 'SendGrid Create List',
  description: 'Create a new contact list in SendGrid',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SendGrid API key',
    },
    name: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'List name',
    },
  },

  request: {
    url: () => 'https://api.sendgrid.com/v3/marketing/lists',
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      return {
        body: JSON.stringify({
          name: params.name,
        }),
      }
    },
  },

  transformResponse: async (response): Promise<ListResult> => {
    if (!response.ok) {
      const error = (await response.json()) as { errors?: Array<{ message?: string }> }
      throw new Error(error.errors?.[0]?.message || 'Failed to create list')
    }

    const data = (await response.json()) as SendGridList

    return {
      success: true,
      output: {
        id: data.id,
        name: data.name,
        contactCount: data.contact_count,
      },
    }
  },

  outputs: {
    id: { type: 'string', description: 'List ID' },
    name: { type: 'string', description: 'List name' },
    contactCount: { type: 'number', description: 'Number of contacts in the list' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_template.ts]---
Location: sim-main/apps/sim/tools/sendgrid/create_template.ts

```typescript
import type { CreateTemplateParams, SendGridTemplate, TemplateResult } from '@/tools/sendgrid/types'
import type { ToolConfig } from '@/tools/types'

export const sendGridCreateTemplateTool: ToolConfig<CreateTemplateParams, TemplateResult> = {
  id: 'sendgrid_create_template',
  name: 'SendGrid Create Template',
  description: 'Create a new email template in SendGrid',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SendGrid API key',
    },
    name: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Template name',
    },
    generation: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Template generation type (legacy or dynamic, default: dynamic)',
    },
  },

  request: {
    url: () => 'https://api.sendgrid.com/v3/templates',
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      return {
        body: JSON.stringify({
          name: params.name,
          generation: params.generation || 'dynamic',
        }),
      }
    },
  },

  transformResponse: async (response): Promise<TemplateResult> => {
    if (!response.ok) {
      const error = (await response.json()) as { errors?: Array<{ message?: string }> }
      throw new Error(error.errors?.[0]?.message || 'Failed to create template')
    }

    const data = (await response.json()) as SendGridTemplate

    return {
      success: true,
      output: {
        id: data.id,
        name: data.name,
        generation: data.generation,
        updatedAt: data.updated_at,
        versions: data.versions || [],
      },
    }
  },

  outputs: {
    id: { type: 'string', description: 'Template ID' },
    name: { type: 'string', description: 'Template name' },
    generation: { type: 'string', description: 'Template generation' },
    updatedAt: { type: 'string', description: 'Last update timestamp' },
    versions: { type: 'json', description: 'Array of template versions' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_template_version.ts]---
Location: sim-main/apps/sim/tools/sendgrid/create_template_version.ts

```typescript
import type {
  CreateTemplateVersionParams,
  SendGridTemplateVersionRequest,
  TemplateVersionResult,
} from '@/tools/sendgrid/types'
import type { ToolConfig } from '@/tools/types'

export const sendGridCreateTemplateVersionTool: ToolConfig<
  CreateTemplateVersionParams,
  TemplateVersionResult
> = {
  id: 'sendgrid_create_template_version',
  name: 'SendGrid Create Template Version',
  description: 'Create a new version of an email template in SendGrid',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SendGrid API key',
    },
    templateId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Template ID',
    },
    name: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Version name',
    },
    subject: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Email subject line',
    },
    htmlContent: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'HTML content of the template',
    },
    plainContent: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Plain text content of the template',
    },
    active: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Whether this version is active (default: true)',
    },
  },

  request: {
    url: (params) => `https://api.sendgrid.com/v3/templates/${params.templateId}/versions`,
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: SendGridTemplateVersionRequest = {
        name: params.name,
        subject: params.subject,
        active: params.active !== undefined ? params.active : 1,
      }

      if (params.htmlContent) {
        body.html_content = params.htmlContent
      }

      if (params.plainContent) {
        body.plain_content = params.plainContent
      }

      return { body: JSON.stringify(body) }
    },
  },

  transformResponse: async (response): Promise<TemplateVersionResult> => {
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.errors?.[0]?.message || 'Failed to create template version')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        id: data.id,
        templateId: data.template_id,
        name: data.name,
        subject: data.subject,
        active: data.active === 1,
        htmlContent: data.html_content,
        plainContent: data.plain_content,
        updatedAt: data.updated_at,
      },
    }
  },

  outputs: {
    id: { type: 'string', description: 'Version ID' },
    templateId: { type: 'string', description: 'Template ID' },
    name: { type: 'string', description: 'Version name' },
    subject: { type: 'string', description: 'Email subject' },
    active: { type: 'boolean', description: 'Whether this version is active' },
    htmlContent: { type: 'string', description: 'HTML content' },
    plainContent: { type: 'string', description: 'Plain text content' },
    updatedAt: { type: 'string', description: 'Last update timestamp' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_contacts.ts]---
Location: sim-main/apps/sim/tools/sendgrid/delete_contacts.ts

```typescript
import type { DeleteContactParams } from '@/tools/sendgrid/types'
import type { ToolConfig, ToolResponse } from '@/tools/types'

export const sendGridDeleteContactsTool: ToolConfig<DeleteContactParams, ToolResponse> = {
  id: 'sendgrid_delete_contacts',
  name: 'SendGrid Delete Contacts',
  description: 'Delete one or more contacts from SendGrid',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SendGrid API key',
    },
    contactIds: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Comma-separated contact IDs to delete',
    },
  },

  request: {
    url: (params) => {
      const ids = params.contactIds
        .split(',')
        .map((id) => id.trim())
        .join(',')
      return `https://api.sendgrid.com/v3/marketing/contacts?ids=${encodeURIComponent(ids)}`
    },
    method: 'DELETE',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
    }),
  },

  transformResponse: async (response): Promise<ToolResponse> => {
    if (!response.ok) {
      const error = (await response.json()) as { errors?: Array<{ message?: string }> }
      throw new Error(error.errors?.[0]?.message || 'Failed to delete contacts')
    }

    const data = (await response.json()) as { job_id: string }

    return {
      success: true,
      output: {
        jobId: data.job_id,
      },
    }
  },

  outputs: {
    jobId: { type: 'string', description: 'Job ID for the deletion request' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_list.ts]---
Location: sim-main/apps/sim/tools/sendgrid/delete_list.ts

```typescript
import type { DeleteListParams } from '@/tools/sendgrid/types'
import type { ToolConfig, ToolResponse } from '@/tools/types'

export const sendGridDeleteListTool: ToolConfig<DeleteListParams, ToolResponse> = {
  id: 'sendgrid_delete_list',
  name: 'SendGrid Delete List',
  description: 'Delete a contact list from SendGrid',
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
      description: 'List ID to delete',
    },
  },

  request: {
    url: (params) => `https://api.sendgrid.com/v3/marketing/lists/${params.listId}`,
    method: 'DELETE',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
    }),
  },

  transformResponse: async (response): Promise<ToolResponse> => {
    if (!response.ok) {
      const error = (await response.json()) as { errors?: Array<{ message?: string }> }
      throw new Error(error.errors?.[0]?.message || 'Failed to delete list')
    }

    // API returns 204 No Content on success
    return {
      success: true,
      output: {
        message: 'List deleted successfully',
      },
    }
  },

  outputs: {
    message: { type: 'string', description: 'Success message' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_template.ts]---
Location: sim-main/apps/sim/tools/sendgrid/delete_template.ts

```typescript
import type { DeleteTemplateParams } from '@/tools/sendgrid/types'
import type { ToolConfig, ToolResponse } from '@/tools/types'

export const sendGridDeleteTemplateTool: ToolConfig<DeleteTemplateParams, ToolResponse> = {
  id: 'sendgrid_delete_template',
  name: 'SendGrid Delete Template',
  description: 'Delete an email template from SendGrid',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SendGrid API key',
    },
    templateId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Template ID to delete',
    },
  },

  request: {
    url: (params) => `https://api.sendgrid.com/v3/templates/${params.templateId}`,
    method: 'DELETE',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
    }),
  },

  transformResponse: async (response): Promise<ToolResponse> => {
    if (!response.ok) {
      const error = (await response.json()) as { errors?: Array<{ message?: string }> }
      throw new Error(error.errors?.[0]?.message || 'Failed to delete template')
    }

    return {
      success: true,
      output: {},
    }
  },

  outputs: {},
}
```

--------------------------------------------------------------------------------

---[FILE: get_contact.ts]---
Location: sim-main/apps/sim/tools/sendgrid/get_contact.ts

```typescript
import type { ContactResult, GetContactParams, SendGridContact } from '@/tools/sendgrid/types'
import type { ToolConfig } from '@/tools/types'

export const sendGridGetContactTool: ToolConfig<GetContactParams, ContactResult> = {
  id: 'sendgrid_get_contact',
  name: 'SendGrid Get Contact',
  description: 'Get a specific contact by ID from SendGrid',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SendGrid API key',
    },
    contactId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Contact ID',
    },
  },

  request: {
    url: (params) => `https://api.sendgrid.com/v3/marketing/contacts/${params.contactId}`,
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
    }),
  },

  transformResponse: async (response): Promise<ContactResult> => {
    if (!response.ok) {
      const error = (await response.json()) as { errors?: Array<{ message?: string }> }
      throw new Error(error.errors?.[0]?.message || 'Failed to get contact')
    }

    const data = (await response.json()) as SendGridContact

    return {
      success: true,
      output: {
        id: data.id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        listIds: data.list_ids,
        customFields: data.custom_fields,
      },
    }
  },

  outputs: {
    id: { type: 'string', description: 'Contact ID' },
    email: { type: 'string', description: 'Contact email address' },
    firstName: { type: 'string', description: 'Contact first name' },
    lastName: { type: 'string', description: 'Contact last name' },
    createdAt: { type: 'string', description: 'Creation timestamp' },
    updatedAt: { type: 'string', description: 'Last update timestamp' },
    listIds: { type: 'json', description: 'Array of list IDs the contact belongs to' },
    customFields: { type: 'json', description: 'Custom field values' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_list.ts]---
Location: sim-main/apps/sim/tools/sendgrid/get_list.ts

```typescript
import type { GetListParams, ListResult, SendGridList } from '@/tools/sendgrid/types'
import type { ToolConfig } from '@/tools/types'

export const sendGridGetListTool: ToolConfig<GetListParams, ListResult> = {
  id: 'sendgrid_get_list',
  name: 'SendGrid Get List',
  description: 'Get a specific list by ID from SendGrid',
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
  },

  request: {
    url: (params) => `https://api.sendgrid.com/v3/marketing/lists/${params.listId}`,
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
    }),
  },

  transformResponse: async (response): Promise<ListResult> => {
    if (!response.ok) {
      const error = (await response.json()) as { errors?: Array<{ message?: string }> }
      throw new Error(error.errors?.[0]?.message || 'Failed to get list')
    }

    const data = (await response.json()) as SendGridList

    return {
      success: true,
      output: {
        id: data.id,
        name: data.name,
        contactCount: data.contact_count,
      },
    }
  },

  outputs: {
    id: { type: 'string', description: 'List ID' },
    name: { type: 'string', description: 'List name' },
    contactCount: { type: 'number', description: 'Number of contacts in the list' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_template.ts]---
Location: sim-main/apps/sim/tools/sendgrid/get_template.ts

```typescript
import type { GetTemplateParams, SendGridTemplate, TemplateResult } from '@/tools/sendgrid/types'
import type { ToolConfig } from '@/tools/types'

export const sendGridGetTemplateTool: ToolConfig<GetTemplateParams, TemplateResult> = {
  id: 'sendgrid_get_template',
  name: 'SendGrid Get Template',
  description: 'Get a specific template by ID from SendGrid',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SendGrid API key',
    },
    templateId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Template ID',
    },
  },

  request: {
    url: (params) => `https://api.sendgrid.com/v3/templates/${params.templateId}`,
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
    }),
  },

  transformResponse: async (response): Promise<TemplateResult> => {
    if (!response.ok) {
      const error = (await response.json()) as { errors?: Array<{ message?: string }> }
      throw new Error(error.errors?.[0]?.message || 'Failed to get template')
    }

    const data = (await response.json()) as SendGridTemplate

    return {
      success: true,
      output: {
        id: data.id,
        name: data.name,
        generation: data.generation,
        updatedAt: data.updated_at,
        versions: data.versions || [],
      },
    }
  },

  outputs: {
    id: { type: 'string', description: 'Template ID' },
    name: { type: 'string', description: 'Template name' },
    generation: { type: 'string', description: 'Template generation' },
    updatedAt: { type: 'string', description: 'Last update timestamp' },
    versions: { type: 'json', description: 'Array of template versions' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/sendgrid/index.ts

```typescript
// Mail Send

// Contact Management
export { sendGridAddContactTool } from './add_contact'
export { sendGridAddContactsToListTool } from './add_contacts_to_list'
// List Management
export { sendGridCreateListTool } from './create_list'
// Template Management
export { sendGridCreateTemplateTool } from './create_template'
export { sendGridCreateTemplateVersionTool } from './create_template_version'
export { sendGridDeleteContactsTool } from './delete_contacts'
export { sendGridDeleteListTool } from './delete_list'
export { sendGridDeleteTemplateTool } from './delete_template'
export { sendGridGetContactTool } from './get_contact'
export { sendGridGetListTool } from './get_list'
export { sendGridGetTemplateTool } from './get_template'
export { sendGridListAllListsTool } from './list_all_lists'
export { sendGridListTemplatesTool } from './list_templates'
export { sendGridRemoveContactsFromListTool } from './remove_contacts_from_list'
export { sendGridSearchContactsTool } from './search_contacts'
export { sendGridSendMailTool } from './send_mail'
// Types
export * from './types'
```

--------------------------------------------------------------------------------

---[FILE: list_all_lists.ts]---
Location: sim-main/apps/sim/tools/sendgrid/list_all_lists.ts

```typescript
import type { ListAllListsParams, ListsResult, SendGridList } from '@/tools/sendgrid/types'
import type { ToolConfig } from '@/tools/types'

export const sendGridListAllListsTool: ToolConfig<ListAllListsParams, ListsResult> = {
  id: 'sendgrid_list_all_lists',
  name: 'SendGrid List All Lists',
  description: 'Get all contact lists from SendGrid',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SendGrid API key',
    },
    pageSize: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Number of lists to return per page (default: 100)',
    },
  },

  request: {
    url: (params) => {
      const url = new URL('https://api.sendgrid.com/v3/marketing/lists')
      if (params.pageSize) {
        url.searchParams.append('page_size', params.pageSize.toString())
      }
      return url.toString()
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
    }),
  },

  transformResponse: async (response): Promise<ListsResult> => {
    if (!response.ok) {
      const error = (await response.json()) as { errors?: Array<{ message?: string }> }
      throw new Error(error.errors?.[0]?.message || 'Failed to list all lists')
    }

    const data = (await response.json()) as { result?: SendGridList[] }

    return {
      success: true,
      output: {
        lists: data.result || [],
      },
    }
  },

  outputs: {
    lists: { type: 'json', description: 'Array of lists' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_templates.ts]---
Location: sim-main/apps/sim/tools/sendgrid/list_templates.ts

```typescript
import type { ListTemplatesParams, SendGridTemplate, TemplatesResult } from '@/tools/sendgrid/types'
import type { ToolConfig } from '@/tools/types'

export const sendGridListTemplatesTool: ToolConfig<ListTemplatesParams, TemplatesResult> = {
  id: 'sendgrid_list_templates',
  name: 'SendGrid List Templates',
  description: 'Get all email templates from SendGrid',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SendGrid API key',
    },
    generations: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by generation (legacy, dynamic, or both)',
    },
    pageSize: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Number of templates to return per page (default: 20)',
    },
  },

  request: {
    url: (params) => {
      const url = new URL('https://api.sendgrid.com/v3/templates')
      if (params.generations) {
        url.searchParams.append('generations', params.generations)
      }
      if (params.pageSize) {
        url.searchParams.append('page_size', params.pageSize.toString())
      }
      return url.toString()
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
    }),
  },

  transformResponse: async (response): Promise<TemplatesResult> => {
    if (!response.ok) {
      const error = (await response.json()) as { errors?: Array<{ message?: string }> }
      throw new Error(error.errors?.[0]?.message || 'Failed to list templates')
    }

    const data = (await response.json()) as {
      result?: SendGridTemplate[]
      templates?: SendGridTemplate[]
    }

    return {
      success: true,
      output: {
        templates: data.result || data.templates || [],
      },
    }
  },

  outputs: {
    templates: { type: 'json', description: 'Array of templates' },
  },
}
```

--------------------------------------------------------------------------------

````
