---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 741
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 741 of 933)

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

---[FILE: delete_account.ts]---
Location: sim-main/apps/sim/tools/salesforce/delete_account.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('SalesforceDeleteAccount')

export interface SalesforceDeleteAccountParams {
  accessToken: string
  idToken?: string
  instanceUrl?: string
  accountId: string
}

export interface SalesforceDeleteAccountResponse {
  success: boolean
  output: {
    id: string
    deleted: boolean
    metadata: {
      operation: 'delete_account'
    }
  }
}

export const salesforceDeleteAccountTool: ToolConfig<
  SalesforceDeleteAccountParams,
  SalesforceDeleteAccountResponse
> = {
  id: 'salesforce_delete_account',
  name: 'Delete Account from Salesforce',
  description: 'Delete an account from Salesforce CRM',
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
    accountId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Account ID to delete (required)',
    },
  },

  request: {
    url: (params) => {
      let instanceUrl = params.instanceUrl

      if (!instanceUrl && params.idToken) {
        try {
          const base64Url = params.idToken.split('.')[1]
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
            if (match) {
              instanceUrl = match[1]
            }
          } else if (decoded.sub) {
            const match = decoded.sub.match(/^(https:\/\/[^/]+)/)
            if (match && match[1] !== 'https://login.salesforce.com') {
              instanceUrl = match[1]
            }
          }
        } catch (error) {
          logger.error('Failed to decode Salesforce idToken', { error })
        }
      }

      if (!instanceUrl) {
        throw new Error('Salesforce instance URL is required but not provided')
      }

      return `${instanceUrl}/services/data/v59.0/sobjects/Account/${params.accountId}`
    },
    method: 'DELETE',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
  },

  transformResponse: async (response: Response, params) => {
    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      logger.error('Salesforce API request failed', { data, status: response.status })
      throw new Error(
        data[0]?.message || data.message || 'Failed to delete account from Salesforce'
      )
    }

    return {
      success: true,
      output: {
        id: params?.accountId || '',
        deleted: true,
        metadata: {
          operation: 'delete_account' as const,
        },
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Deleted account data',
      properties: {
        id: { type: 'string', description: 'Deleted account ID' },
        deleted: { type: 'boolean', description: 'Whether account was deleted' },
        metadata: { type: 'object', description: 'Operation metadata' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_case.ts]---
Location: sim-main/apps/sim/tools/salesforce/delete_case.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import { getInstanceUrl } from './utils'

export interface SalesforceDeleteCaseParams {
  accessToken: string
  idToken?: string
  instanceUrl?: string
  caseId: string
}

export interface SalesforceDeleteCaseResponse {
  success: boolean
  output: {
    id: string
    deleted: boolean
    metadata: {
      operation: 'delete_case'
    }
  }
}

export const salesforceDeleteCaseTool: ToolConfig<
  SalesforceDeleteCaseParams,
  SalesforceDeleteCaseResponse
> = {
  id: 'salesforce_delete_case',
  name: 'Delete Case from Salesforce',
  description: 'Delete a case',
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
    caseId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Case ID (required)',
    },
  },

  request: {
    url: (params) =>
      `${getInstanceUrl(params.idToken, params.instanceUrl)}/services/data/v59.0/sobjects/Case/${params.caseId}`,
    method: 'DELETE',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },

  transformResponse: async (response, params?) => {
    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data[0]?.message || data.message || 'Failed to delete case')
    }
    return {
      success: true,
      output: {
        id: params?.caseId || '',
        deleted: true,
        metadata: { operation: 'delete_case' },
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Success' },
    output: { type: 'object', description: 'Deleted case' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_contact.ts]---
Location: sim-main/apps/sim/tools/salesforce/delete_contact.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { getInstanceUrl } from './utils'

const logger = createLogger('SalesforceContacts')

export interface SalesforceDeleteContactParams {
  accessToken: string
  idToken?: string
  instanceUrl?: string
  contactId: string
}

export interface SalesforceDeleteContactResponse {
  success: boolean
  output: {
    id: string
    deleted: boolean
    metadata: { operation: 'delete_contact' }
  }
}

export const salesforceDeleteContactTool: ToolConfig<
  SalesforceDeleteContactParams,
  SalesforceDeleteContactResponse
> = {
  id: 'salesforce_delete_contact',
  name: 'Delete Contact from Salesforce',
  description: 'Delete a contact from Salesforce CRM',
  version: '1.0.0',

  oauth: { required: true, provider: 'salesforce' },

  params: {
    accessToken: { type: 'string', required: true, visibility: 'hidden' },
    idToken: { type: 'string', required: false, visibility: 'hidden' },
    instanceUrl: { type: 'string', required: false, visibility: 'hidden' },
    contactId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Contact ID to delete (required)',
    },
  },

  request: {
    url: (params) => {
      const instanceUrl = getInstanceUrl(params.idToken, params.instanceUrl)
      return `${instanceUrl}/services/data/v59.0/sobjects/Contact/${params.contactId}`
    },
    method: 'DELETE',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },

  transformResponse: async (response: Response, params?) => {
    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      logger.error('Salesforce API request failed', { data, status: response.status })
      throw new Error(
        data[0]?.message || data.message || 'Failed to delete contact from Salesforce'
      )
    }

    return {
      success: true,
      output: {
        id: params?.contactId || '',
        deleted: true,
        metadata: { operation: 'delete_contact' as const },
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Deleted contact data',
      properties: {
        id: { type: 'string', description: 'Deleted contact ID' },
        deleted: { type: 'boolean', description: 'Whether contact was deleted' },
        metadata: { type: 'object', description: 'Operation metadata' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_lead.ts]---
Location: sim-main/apps/sim/tools/salesforce/delete_lead.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import { getInstanceUrl } from './utils'

export interface SalesforceDeleteLeadParams {
  accessToken: string
  idToken?: string
  instanceUrl?: string
  leadId: string
}

export interface SalesforceDeleteLeadResponse {
  success: boolean
  output: {
    id: string
    deleted: boolean
    metadata: {
      operation: 'delete_lead'
    }
  }
}

export const salesforceDeleteLeadTool: ToolConfig<
  SalesforceDeleteLeadParams,
  SalesforceDeleteLeadResponse
> = {
  id: 'salesforce_delete_lead',
  name: 'Delete Lead from Salesforce',
  description: 'Delete a lead',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'salesforce',
  },

  params: {
    accessToken: { type: 'string', required: true, visibility: 'hidden' },
    idToken: { type: 'string', required: false, visibility: 'hidden' },
    instanceUrl: { type: 'string', required: false, visibility: 'hidden' },
    leadId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Lead ID (required)',
    },
  },

  request: {
    url: (params) =>
      `${getInstanceUrl(params.idToken, params.instanceUrl)}/services/data/v59.0/sobjects/Lead/${params.leadId}`,
    method: 'DELETE',
    headers: (params) => ({ Authorization: `Bearer ${params.accessToken}` }),
  },

  transformResponse: async (response, params?) => {
    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data[0]?.message || data.message || 'Failed to delete lead')
    }
    return {
      success: true,
      output: {
        id: params?.leadId || '',
        deleted: true,
        metadata: { operation: 'delete_lead' },
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Success' },
    output: { type: 'object', description: 'Deleted lead' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_opportunity.ts]---
Location: sim-main/apps/sim/tools/salesforce/delete_opportunity.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import { getInstanceUrl } from './utils'

export interface SalesforceDeleteOpportunityParams {
  accessToken: string
  idToken?: string
  instanceUrl?: string
  opportunityId: string
}

export interface SalesforceDeleteOpportunityResponse {
  success: boolean
  output: {
    id: string
    deleted: boolean
    metadata: {
      operation: 'delete_opportunity'
    }
  }
}

export const salesforceDeleteOpportunityTool: ToolConfig<
  SalesforceDeleteOpportunityParams,
  SalesforceDeleteOpportunityResponse
> = {
  id: 'salesforce_delete_opportunity',
  name: 'Delete Opportunity from Salesforce',
  description: 'Delete an opportunity',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'salesforce',
  },

  params: {
    accessToken: { type: 'string', required: true, visibility: 'hidden' },
    idToken: { type: 'string', required: false, visibility: 'hidden' },
    instanceUrl: { type: 'string', required: false, visibility: 'hidden' },
    opportunityId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Opportunity ID (required)',
    },
  },

  request: {
    url: (params) =>
      `${getInstanceUrl(params.idToken, params.instanceUrl)}/services/data/v59.0/sobjects/Opportunity/${params.opportunityId}`,
    method: 'DELETE',
    headers: (params) => ({ Authorization: `Bearer ${params.accessToken}` }),
  },

  transformResponse: async (response, params?) => {
    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data[0]?.message || data.message || 'Failed to delete opportunity')
    }
    return {
      success: true,
      output: {
        id: params?.opportunityId || '',
        deleted: true,
        metadata: { operation: 'delete_opportunity' },
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Success' },
    output: { type: 'object', description: 'Deleted opportunity' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_task.ts]---
Location: sim-main/apps/sim/tools/salesforce/delete_task.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import { getInstanceUrl } from './utils'

export interface SalesforceDeleteTaskParams {
  accessToken: string
  idToken?: string
  instanceUrl?: string
  taskId: string
}

export interface SalesforceDeleteTaskResponse {
  success: boolean
  output: {
    id: string
    deleted: boolean
    metadata: {
      operation: 'delete_task'
    }
  }
}

export const salesforceDeleteTaskTool: ToolConfig<
  SalesforceDeleteTaskParams,
  SalesforceDeleteTaskResponse
> = {
  id: 'salesforce_delete_task',
  name: 'Delete Task from Salesforce',
  description: 'Delete a task',
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
  },

  request: {
    url: (params) =>
      `${getInstanceUrl(params.idToken, params.instanceUrl)}/services/data/v59.0/sobjects/Task/${params.taskId}`,
    method: 'DELETE',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },

  transformResponse: async (response, params?) => {
    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data[0]?.message || data.message || 'Failed to delete task')
    }
    return {
      success: true,
      output: {
        id: params?.taskId || '',
        deleted: true,
        metadata: { operation: 'delete_task' },
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Success' },
    output: { type: 'object', description: 'Deleted task' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: describe_object.ts]---
Location: sim-main/apps/sim/tools/salesforce/describe_object.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { extractErrorMessage, getInstanceUrl } from './utils'

const logger = createLogger('SalesforceQuery')

export interface SalesforceDescribeObjectParams {
  accessToken: string
  idToken?: string
  instanceUrl?: string
  objectName: string
}

export interface SalesforceDescribeObjectResponse {
  success: boolean
  output: {
    objectName: string
    label?: string
    labelPlural?: string
    fields?: any[]
    keyPrefix?: string
    queryable?: boolean
    createable?: boolean
    updateable?: boolean
    deletable?: boolean
    childRelationships?: any[]
    recordTypeInfos?: any[]
    metadata: {
      operation: 'describe_object'
      fieldCount: number
    }
    success: boolean
  }
}

/**
 * Describe a Salesforce object to get its metadata/fields
 * Useful for discovering available fields for queries
 */
export const salesforceDescribeObjectTool: ToolConfig<
  SalesforceDescribeObjectParams,
  SalesforceDescribeObjectResponse
> = {
  id: 'salesforce_describe_object',
  name: 'Describe Salesforce Object',
  description: 'Get metadata and field information for a Salesforce object',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'salesforce',
  },

  params: {
    accessToken: { type: 'string', required: true, visibility: 'hidden' },
    idToken: { type: 'string', required: false, visibility: 'hidden' },
    instanceUrl: { type: 'string', required: false, visibility: 'hidden' },
    objectName: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'API name of the object (e.g., Account, Contact, Lead, Custom_Object__c)',
    },
  },

  request: {
    url: (params) => {
      if (!params.objectName || params.objectName.trim() === '') {
        throw new Error(
          'Object Name is required. Please provide a valid Salesforce object API name (e.g., Account, Contact, Lead).'
        )
      }
      const instanceUrl = getInstanceUrl(params.idToken, params.instanceUrl)
      return `${instanceUrl}/services/data/v59.0/sobjects/${params.objectName}/describe`
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response, params?) => {
    const data = await response.json()
    if (!response.ok) {
      const errorMessage = extractErrorMessage(
        data,
        response.status,
        `Failed to describe object: ${params?.objectName}`
      )
      logger.error('Failed to describe object', { data, status: response.status })
      throw new Error(errorMessage)
    }

    return {
      success: true,
      output: {
        objectName: params?.objectName || '',
        label: data.label,
        labelPlural: data.labelPlural,
        fields: data.fields,
        keyPrefix: data.keyPrefix,
        queryable: data.queryable,
        createable: data.createable,
        updateable: data.updateable,
        deletable: data.deletable,
        childRelationships: data.childRelationships,
        recordTypeInfos: data.recordTypeInfos,
        metadata: {
          operation: 'describe_object',
          fieldCount: data.fields?.length || 0,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Success status' },
    output: {
      type: 'object',
      description: 'Object metadata',
      properties: {
        objectName: { type: 'string', description: 'API name of the object' },
        label: { type: 'string', description: 'Display label' },
        labelPlural: { type: 'string', description: 'Plural display label' },
        fields: { type: 'array', description: 'Array of field definitions' },
        keyPrefix: { type: 'string', description: 'ID prefix for this object type' },
        queryable: { type: 'boolean', description: 'Whether object can be queried' },
        createable: { type: 'boolean', description: 'Whether records can be created' },
        updateable: { type: 'boolean', description: 'Whether records can be updated' },
        deletable: { type: 'boolean', description: 'Whether records can be deleted' },
        childRelationships: { type: 'array', description: 'Child relationship definitions' },
        recordTypeInfos: { type: 'array', description: 'Record type information' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success status' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_accounts.ts]---
Location: sim-main/apps/sim/tools/salesforce/get_accounts.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  SalesforceGetAccountsParams,
  SalesforceGetAccountsResponse,
} from '@/tools/salesforce/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('SalesforceGetAccounts')

export const salesforceGetAccountsTool: ToolConfig<
  SalesforceGetAccountsParams,
  SalesforceGetAccountsResponse
> = {
  id: 'salesforce_get_accounts',
  name: 'Get Accounts from Salesforce',
  description: 'Retrieve accounts from Salesforce CRM',
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
      description: 'The access token for the Salesforce API',
    },
    idToken: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description: 'The ID token from Salesforce OAuth (contains instance URL)',
    },
    instanceUrl: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description: 'The Salesforce instance URL',
    },
    limit: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Number of results to return (default: 100, max: 2000)',
    },
    fields: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comma-separated list of fields to return (e.g., "Id,Name,Industry,Phone")',
    },
    orderBy: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Field to order by (e.g., "Name ASC" or "CreatedDate DESC")',
    },
  },

  request: {
    url: (params) => {
      let instanceUrl = params.instanceUrl

      if (!instanceUrl && params.idToken) {
        try {
          const base64Url = params.idToken.split('.')[1]
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
            if (match) {
              instanceUrl = match[1]
            }
          } else if (decoded.sub) {
            const match = decoded.sub.match(/^(https:\/\/[^/]+)/)
            if (match && match[1] !== 'https://login.salesforce.com') {
              instanceUrl = match[1]
            }
          }
        } catch (error) {
          logger.error('Failed to decode Salesforce idToken', { error })
        }
      }

      if (!instanceUrl) {
        throw new Error('Salesforce instance URL is required but not provided')
      }

      const limit = params.limit ? Number.parseInt(params.limit) : 100
      const fields =
        params.fields ||
        'Id,Name,Type,Industry,BillingCity,BillingState,BillingCountry,Phone,Website'
      const orderBy = params.orderBy || 'Name ASC'

      // Build SOQL query
      const query = `SELECT ${fields} FROM Account ORDER BY ${orderBy} LIMIT ${limit}`
      const encodedQuery = encodeURIComponent(query)

      return `${instanceUrl}/services/data/v59.0/query?q=${encodedQuery}`
    },
    method: 'GET',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
      }
    },
  },

  transformResponse: async (response: Response, params) => {
    const data = await response.json()

    if (!response.ok) {
      logger.error('Salesforce API request failed', { data, status: response.status })
      throw new Error(
        data[0]?.message || data.message || 'Failed to fetch accounts from Salesforce'
      )
    }

    const accounts = data.records || []

    return {
      success: true,
      output: {
        accounts,
        paging: {
          nextRecordsUrl: data.nextRecordsUrl,
          totalSize: data.totalSize || accounts.length,
          done: data.done !== false,
        },
        metadata: {
          operation: 'get_accounts' as const,
          totalReturned: accounts.length,
          hasMore: !data.done,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Accounts data',
      properties: {
        accounts: {
          type: 'array',
          description: 'Array of account objects',
        },
        paging: {
          type: 'object',
          description: 'Pagination information',
        },
        metadata: {
          type: 'object',
          description: 'Operation metadata',
        },
        success: { type: 'boolean', description: 'Operation success status' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_cases.ts]---
Location: sim-main/apps/sim/tools/salesforce/get_cases.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import { getInstanceUrl } from './utils'

export interface SalesforceGetCasesParams {
  accessToken: string
  idToken?: string
  instanceUrl?: string
  caseId?: string
  limit?: string
  fields?: string
  orderBy?: string
}

export interface SalesforceGetCasesResponse {
  success: boolean
  output: {
    case?: any
    cases?: any[]
    paging?: {
      nextRecordsUrl?: string
      totalSize: number
      done: boolean
    }
    metadata: {
      operation: 'get_cases'
      totalReturned?: number
      hasMore?: boolean
    }
    success: boolean
  }
}

export const salesforceGetCasesTool: ToolConfig<
  SalesforceGetCasesParams,
  SalesforceGetCasesResponse
> = {
  id: 'salesforce_get_cases',
  name: 'Get Cases from Salesforce',
  description: 'Get case(s) from Salesforce',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'salesforce',
  },

  params: {
    accessToken: { type: 'string', required: true, visibility: 'hidden' },
    idToken: { type: 'string', required: false, visibility: 'hidden' },
    instanceUrl: { type: 'string', required: false, visibility: 'hidden' },
    caseId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Case ID (optional)',
    },
    limit: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Max results (default: 100)',
    },
    fields: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comma-separated fields',
    },
    orderBy: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Order by field',
    },
  },

  request: {
    url: (params) => {
      const instanceUrl = getInstanceUrl(params.idToken, params.instanceUrl)
      if (params.caseId) {
        const fields =
          params.fields || 'Id,CaseNumber,Subject,Status,Priority,Origin,ContactId,AccountId'
        return `${instanceUrl}/services/data/v59.0/sobjects/Case/${params.caseId}?fields=${fields}`
      }
      const limit = params.limit ? Number.parseInt(params.limit) : 100
      const fields =
        params.fields || 'Id,CaseNumber,Subject,Status,Priority,Origin,ContactId,AccountId'
      const orderBy = params.orderBy || 'CreatedDate DESC'
      const query = `SELECT ${fields} FROM Case ORDER BY ${orderBy} LIMIT ${limit}`
      return `${instanceUrl}/services/data/v59.0/query?q=${encodeURIComponent(query)}`
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response, params?) => {
    const data = await response.json()
    if (!response.ok) throw new Error(data[0]?.message || data.message || 'Failed to fetch cases')
    if (params?.caseId) {
      return {
        success: true,
        output: { case: data, metadata: { operation: 'get_cases' }, success: true },
      }
    }
    const cases = data.records || []
    return {
      success: true,
      output: {
        cases,
        paging: {
          nextRecordsUrl: data.nextRecordsUrl,
          totalSize: data.totalSize || cases.length,
          done: data.done !== false,
        },
        metadata: { operation: 'get_cases', totalReturned: cases.length, hasMore: !data.done },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Success' },
    output: { type: 'object', description: 'Case data' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_contacts.ts]---
Location: sim-main/apps/sim/tools/salesforce/get_contacts.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { getInstanceUrl } from './utils'

const logger = createLogger('SalesforceContacts')

export interface SalesforceGetContactsParams {
  accessToken: string
  idToken?: string
  instanceUrl?: string
  contactId?: string
  limit?: string
  fields?: string
  orderBy?: string
}

export interface SalesforceGetContactsResponse {
  success: boolean
  output: {
    contacts?: any[]
    contact?: any
    paging?: {
      nextRecordsUrl?: string
      totalSize: number
      done: boolean
    }
    metadata: {
      operation: 'get_contacts'
      totalReturned?: number
      hasMore?: boolean
      singleContact?: boolean
    }
    success: boolean
  }
}

export const salesforceGetContactsTool: ToolConfig<
  SalesforceGetContactsParams,
  SalesforceGetContactsResponse
> = {
  id: 'salesforce_get_contacts',
  name: 'Get Contacts from Salesforce',
  description: 'Get contact(s) from Salesforce - single contact if ID provided, or list if not',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'salesforce',
  },

  params: {
    accessToken: { type: 'string', required: true, visibility: 'hidden' },
    idToken: { type: 'string', required: false, visibility: 'hidden' },
    instanceUrl: { type: 'string', required: false, visibility: 'hidden' },
    contactId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Contact ID (if provided, returns single contact)',
    },
    limit: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Number of results (default: 100, max: 2000). Only for list query.',
    },
    fields: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comma-separated fields (e.g., "Id,FirstName,LastName,Email,Phone")',
    },
    orderBy: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Order by field (e.g., "LastName ASC"). Only for list query.',
    },
  },

  request: {
    url: (params) => {
      const instanceUrl = getInstanceUrl(params.idToken, params.instanceUrl)

      // Single contact by ID
      if (params.contactId) {
        const fields =
          params.fields || 'Id,FirstName,LastName,Email,Phone,AccountId,Title,Department'
        return `${instanceUrl}/services/data/v59.0/sobjects/Contact/${params.contactId}?fields=${fields}`
      }

      // List contacts with SOQL query
      const limit = params.limit ? Number.parseInt(params.limit) : 100
      const fields = params.fields || 'Id,FirstName,LastName,Email,Phone,AccountId,Title,Department'
      const orderBy = params.orderBy || 'LastName ASC'
      const query = `SELECT ${fields} FROM Contact ORDER BY ${orderBy} LIMIT ${limit}`
      const encodedQuery = encodeURIComponent(query)

      return `${instanceUrl}/services/data/v59.0/query?q=${encodedQuery}`
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response, params?) => {
    const data = await response.json()

    if (!response.ok) {
      logger.error('Salesforce API request failed', { data, status: response.status })
      throw new Error(
        data[0]?.message || data.message || 'Failed to fetch contacts from Salesforce'
      )
    }

    // Single contact response
    if (params?.contactId) {
      return {
        success: true,
        output: {
          contact: data,
          metadata: {
            operation: 'get_contacts' as const,
            singleContact: true,
          },
          success: true,
        },
      }
    }

    // List contacts response
    const contacts = data.records || []
    return {
      success: true,
      output: {
        contacts,
        paging: {
          nextRecordsUrl: data.nextRecordsUrl,
          totalSize: data.totalSize || contacts.length,
          done: data.done !== false,
        },
        metadata: {
          operation: 'get_contacts' as const,
          totalReturned: contacts.length,
          hasMore: !data.done,
          singleContact: false,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Contact(s) data',
      properties: {
        contacts: { type: 'array', description: 'Array of contacts (list query)' },
        contact: { type: 'object', description: 'Single contact (by ID)' },
        paging: { type: 'object', description: 'Pagination info (list query)' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_dashboard.ts]---
Location: sim-main/apps/sim/tools/salesforce/get_dashboard.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { extractErrorMessage, getInstanceUrl } from './utils'

const logger = createLogger('SalesforceDashboards')

export interface SalesforceGetDashboardParams {
  accessToken: string
  idToken?: string
  instanceUrl?: string
  dashboardId: string
}

export interface SalesforceGetDashboardResponse {
  success: boolean
  output: {
    dashboard: any
    dashboardId: string
    components: any[]
    metadata: {
      operation: 'get_dashboard'
      dashboardName?: string
      folderId?: string
      runningUser?: any
    }
    success: boolean
  }
}

/**
 * Get details for a specific dashboard
 * @see https://developer.salesforce.com/docs/atlas.en-us.api_analytics.meta/api_analytics/sforce_analytics_rest_api_dashboard_results.htm
 */
export const salesforceGetDashboardTool: ToolConfig<
  SalesforceGetDashboardParams,
  SalesforceGetDashboardResponse
> = {
  id: 'salesforce_get_dashboard',
  name: 'Get Dashboard from Salesforce',
  description: 'Get details and results for a specific dashboard',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'salesforce',
  },

  params: {
    accessToken: { type: 'string', required: true, visibility: 'hidden' },
    idToken: { type: 'string', required: false, visibility: 'hidden' },
    instanceUrl: { type: 'string', required: false, visibility: 'hidden' },
    dashboardId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Dashboard ID (required)',
    },
  },

  request: {
    url: (params) => {
      if (!params.dashboardId || params.dashboardId.trim() === '') {
        throw new Error('Dashboard ID is required. Please provide a valid Salesforce Dashboard ID.')
      }
      const instanceUrl = getInstanceUrl(params.idToken, params.instanceUrl)
      return `${instanceUrl}/services/data/v59.0/analytics/dashboards/${params.dashboardId}`
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response, params?) => {
    const data = await response.json()
    if (!response.ok) {
      const errorMessage = extractErrorMessage(
        data,
        response.status,
        `Failed to get dashboard ID: ${params?.dashboardId}`
      )
      logger.error('Failed to get dashboard', { data, status: response.status })
      throw new Error(errorMessage)
    }

    return {
      success: true,
      output: {
        dashboard: data,
        dashboardId: params?.dashboardId || '',
        components: data.componentData || [],
        metadata: {
          operation: 'get_dashboard',
          dashboardName: data.name,
          folderId: data.folderId,
          runningUser: data.runningUser,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Success status' },
    output: {
      type: 'object',
      description: 'Dashboard data',
      properties: {
        dashboard: { type: 'object', description: 'Dashboard details' },
        dashboardId: { type: 'string', description: 'Dashboard ID' },
        components: { type: 'array', description: 'Dashboard component data' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success status' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

````
