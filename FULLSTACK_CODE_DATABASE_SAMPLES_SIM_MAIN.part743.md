---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 743
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 743 of 933)

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

---[FILE: refresh_dashboard.ts]---
Location: sim-main/apps/sim/tools/salesforce/refresh_dashboard.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { extractErrorMessage, getInstanceUrl } from './utils'

const logger = createLogger('SalesforceDashboards')

export interface SalesforceRefreshDashboardParams {
  accessToken: string
  idToken?: string
  instanceUrl?: string
  dashboardId: string
}

export interface SalesforceRefreshDashboardResponse {
  success: boolean
  output: {
    dashboard: any
    dashboardId: string
    components: any[]
    status?: any
    metadata: {
      operation: 'refresh_dashboard'
      dashboardName?: string
      refreshDate?: string
    }
    success: boolean
  }
}

/**
 * Refresh a dashboard to get latest data
 * @see https://developer.salesforce.com/docs/atlas.en-us.api_analytics.meta/api_analytics/sforce_analytics_rest_api_refresh_dashboard.htm
 */
export const salesforceRefreshDashboardTool: ToolConfig<
  SalesforceRefreshDashboardParams,
  SalesforceRefreshDashboardResponse
> = {
  id: 'salesforce_refresh_dashboard',
  name: 'Refresh Dashboard in Salesforce',
  description: 'Refresh a dashboard to get the latest data',
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
    method: 'PUT',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: () => ({}),
  },

  transformResponse: async (response, params?) => {
    const data = await response.json()
    if (!response.ok) {
      const errorMessage = extractErrorMessage(
        data,
        response.status,
        `Failed to refresh dashboard ID: ${params?.dashboardId}`
      )
      logger.error('Failed to refresh dashboard', { data, status: response.status })
      throw new Error(errorMessage)
    }

    return {
      success: true,
      output: {
        dashboard: data,
        dashboardId: params?.dashboardId || '',
        components: data.componentData || [],
        status: data.status,
        metadata: {
          operation: 'refresh_dashboard',
          dashboardName: data.name,
          refreshDate: data.refreshDate,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Success status' },
    output: {
      type: 'object',
      description: 'Refreshed dashboard data',
      properties: {
        dashboard: { type: 'object', description: 'Dashboard details' },
        dashboardId: { type: 'string', description: 'Dashboard ID' },
        components: { type: 'array', description: 'Dashboard component data' },
        status: { type: 'object', description: 'Dashboard status' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success status' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: run_report.ts]---
Location: sim-main/apps/sim/tools/salesforce/run_report.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { extractErrorMessage, getInstanceUrl } from './utils'

const logger = createLogger('SalesforceReports')

export interface SalesforceRunReportParams {
  accessToken: string
  idToken?: string
  instanceUrl?: string
  reportId: string
  includeDetails?: string
  filters?: string
}

export interface SalesforceRunReportResponse {
  success: boolean
  output: {
    reportId: string
    reportMetadata?: any
    reportExtendedMetadata?: any
    factMap?: any
    groupingsDown?: any
    groupingsAcross?: any
    hasDetailRows?: boolean
    allData?: boolean
    metadata: {
      operation: 'run_report'
      reportName?: string
      reportFormat?: string
    }
    success: boolean
  }
}

/**
 * Run a report and return the results
 * @see https://developer.salesforce.com/docs/atlas.en-us.api_analytics.meta/api_analytics/sforce_analytics_rest_api_get_reportdata.htm
 */
export const salesforceRunReportTool: ToolConfig<
  SalesforceRunReportParams,
  SalesforceRunReportResponse
> = {
  id: 'salesforce_run_report',
  name: 'Run Report in Salesforce',
  description: 'Execute a report and retrieve the results',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'salesforce',
  },

  params: {
    accessToken: { type: 'string', required: true, visibility: 'hidden' },
    idToken: { type: 'string', required: false, visibility: 'hidden' },
    instanceUrl: { type: 'string', required: false, visibility: 'hidden' },
    reportId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Report ID (required)',
    },
    includeDetails: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Include detail rows (true/false, default: true)',
    },
    filters: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'JSON string of report filters to apply',
    },
  },

  request: {
    url: (params) => {
      if (!params.reportId || params.reportId.trim() === '') {
        throw new Error('Report ID is required. Please provide a valid Salesforce Report ID.')
      }
      const instanceUrl = getInstanceUrl(params.idToken, params.instanceUrl)
      const includeDetails = params.includeDetails !== 'false'
      return `${instanceUrl}/services/data/v59.0/analytics/reports/${params.reportId}?includeDetails=${includeDetails}`
    },
    // Use GET for simple report runs, POST only when filters are provided
    method: (params) => (params.filters ? 'POST' : 'GET'),
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      // Only send a body when filters are provided (POST request)
      if (params.filters) {
        try {
          const filters = JSON.parse(params.filters)
          return { reportMetadata: { reportFilters: filters } }
        } catch (e) {
          throw new Error(
            `Invalid report filters JSON: ${e instanceof Error ? e.message : 'Parse error'}. Please provide a valid JSON array of filter objects.`
          )
        }
      }
      // Return undefined for GET requests (no body)
      return undefined as any
    },
  },

  transformResponse: async (response, params?) => {
    const data = await response.json()
    if (!response.ok) {
      const errorMessage = extractErrorMessage(
        data,
        response.status,
        `Failed to run report ID: ${params?.reportId}`
      )
      logger.error('Failed to run report', { data, status: response.status })
      throw new Error(errorMessage)
    }

    return {
      success: true,
      output: {
        reportId: params?.reportId || '',
        reportMetadata: data.reportMetadata,
        reportExtendedMetadata: data.reportExtendedMetadata,
        factMap: data.factMap,
        groupingsDown: data.groupingsDown,
        groupingsAcross: data.groupingsAcross,
        hasDetailRows: data.hasDetailRows,
        allData: data.allData,
        metadata: {
          operation: 'run_report',
          reportName: data.reportMetadata?.name,
          reportFormat: data.reportMetadata?.reportFormat,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Success status' },
    output: {
      type: 'object',
      description: 'Report results',
      properties: {
        reportId: { type: 'string', description: 'Report ID' },
        reportMetadata: { type: 'object', description: 'Report metadata' },
        reportExtendedMetadata: { type: 'object', description: 'Extended metadata' },
        factMap: { type: 'object', description: 'Report data organized by groupings' },
        groupingsDown: { type: 'object', description: 'Row groupings' },
        groupingsAcross: { type: 'object', description: 'Column groupings' },
        hasDetailRows: { type: 'boolean', description: 'Whether report has detail rows' },
        allData: { type: 'boolean', description: 'Whether all data is returned' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success status' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/salesforce/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

// Common Salesforce types
export interface SalesforceAccount {
  Id: string
  Name: string
  Type?: string
  Industry?: string
  BillingStreet?: string
  BillingCity?: string
  BillingState?: string
  BillingPostalCode?: string
  BillingCountry?: string
  Phone?: string
  Website?: string
  AnnualRevenue?: number
  NumberOfEmployees?: number
  Description?: string
  OwnerId?: string
  CreatedDate?: string
  LastModifiedDate?: string
  [key: string]: any
}

export interface SalesforcePaging {
  nextRecordsUrl?: string
  totalSize: number
  done: boolean
}

// Get Accounts
export interface SalesforceGetAccountsResponse extends ToolResponse {
  output: {
    accounts: SalesforceAccount[]
    paging?: SalesforcePaging
    metadata: {
      operation: 'get_accounts'
      totalReturned: number
      hasMore: boolean
    }
    success: boolean
  }
}

export interface SalesforceGetAccountsParams {
  accessToken: string
  idToken?: string
  instanceUrl?: string
  limit?: string
  fields?: string
  orderBy?: string
}

// Create Account
export interface SalesforceCreateAccountResponse {
  success: boolean
  output: {
    id: string
    success: boolean
    created: boolean
    metadata: {
      operation: 'create_account'
    }
  }
}

// Update Account
export interface SalesforceUpdateAccountResponse {
  success: boolean
  output: {
    id: string
    updated: boolean
    metadata: {
      operation: 'update_account'
    }
  }
}

// Delete Account
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

// Contact types
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

export interface SalesforceCreateContactResponse {
  success: boolean
  output: {
    id: string
    success: boolean
    created: boolean
    metadata: { operation: 'create_contact' }
  }
}

export interface SalesforceUpdateContactResponse {
  success: boolean
  output: {
    id: string
    updated: boolean
    metadata: { operation: 'update_contact' }
  }
}

export interface SalesforceDeleteContactResponse {
  success: boolean
  output: {
    id: string
    deleted: boolean
    metadata: { operation: 'delete_contact' }
  }
}

// Report types
export interface SalesforceListReportsResponse {
  success: boolean
  output: {
    reports: any[]
    metadata: {
      operation: 'list_reports'
      totalReturned: number
    }
    success: boolean
  }
}

export interface SalesforceGetReportResponse {
  success: boolean
  output: {
    report: any
    reportId: string
    metadata: {
      operation: 'get_report'
    }
    success: boolean
  }
}

export interface SalesforceRunReportResponse {
  success: boolean
  output: {
    reportId: string
    reportMetadata: any
    reportExtendedMetadata: any
    factMap: any
    groupingsDown: any
    groupingsAcross: any
    hasDetailRows: boolean
    allData: boolean
    metadata: {
      operation: 'run_report'
      reportName: string
      reportFormat: string
    }
    success: boolean
  }
}

export interface SalesforceListReportTypesResponse {
  success: boolean
  output: {
    reportTypes: any[]
    metadata: {
      operation: 'list_report_types'
      totalReturned: number
    }
    success: boolean
  }
}

// Dashboard types
export interface SalesforceListDashboardsResponse {
  success: boolean
  output: {
    dashboards: any[]
    metadata: {
      operation: 'list_dashboards'
      totalReturned: number
    }
    success: boolean
  }
}

export interface SalesforceGetDashboardResponse {
  success: boolean
  output: {
    dashboard: any
    dashboardId: string
    components: any[]
    metadata: {
      operation: 'get_dashboard'
      dashboardName: string
      folderId: string
      runningUser: any
    }
    success: boolean
  }
}

export interface SalesforceRefreshDashboardResponse {
  success: boolean
  output: {
    dashboard: any
    dashboardId: string
    components: any[]
    status: any
    metadata: {
      operation: 'refresh_dashboard'
      dashboardName: string
      refreshDate: string
    }
    success: boolean
  }
}

// Query types
export interface SalesforceQueryResponse {
  success: boolean
  output: {
    records: any[]
    totalSize: number
    done: boolean
    nextRecordsUrl?: string
    query: string
    metadata: {
      operation: 'query'
      totalReturned: number
      hasMore: boolean
    }
    success: boolean
  }
}

export interface SalesforceQueryMoreResponse {
  success: boolean
  output: {
    records: any[]
    totalSize: number
    done: boolean
    nextRecordsUrl?: string
    metadata: {
      operation: 'query_more'
      totalReturned: number
      hasMore: boolean
    }
    success: boolean
  }
}

export interface SalesforceDescribeObjectResponse {
  success: boolean
  output: {
    objectName: string
    label: string
    labelPlural: string
    fields: any[]
    keyPrefix: string
    queryable: boolean
    createable: boolean
    updateable: boolean
    deletable: boolean
    childRelationships: any[]
    recordTypeInfos: any[]
    metadata: {
      operation: 'describe_object'
      fieldCount: number
    }
    success: boolean
  }
}

export interface SalesforceListObjectsResponse {
  success: boolean
  output: {
    objects: any[]
    encoding: string
    maxBatchSize: number
    metadata: {
      operation: 'list_objects'
      totalReturned: number
    }
    success: boolean
  }
}

// Generic Salesforce response type for the block
export type SalesforceResponse =
  | SalesforceGetAccountsResponse
  | SalesforceCreateAccountResponse
  | SalesforceUpdateAccountResponse
  | SalesforceDeleteAccountResponse
  | SalesforceGetContactsResponse
  | SalesforceCreateContactResponse
  | SalesforceUpdateContactResponse
  | SalesforceDeleteContactResponse
  | SalesforceListReportsResponse
  | SalesforceGetReportResponse
  | SalesforceRunReportResponse
  | SalesforceListReportTypesResponse
  | SalesforceListDashboardsResponse
  | SalesforceGetDashboardResponse
  | SalesforceRefreshDashboardResponse
  | SalesforceQueryResponse
  | SalesforceQueryMoreResponse
  | SalesforceDescribeObjectResponse
  | SalesforceListObjectsResponse
  | { success: boolean; output: any } // Generic for leads, opportunities, cases, tasks
```

--------------------------------------------------------------------------------

---[FILE: update_account.ts]---
Location: sim-main/apps/sim/tools/salesforce/update_account.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('SalesforceUpdateAccount')

export interface SalesforceUpdateAccountParams {
  accessToken: string
  idToken?: string
  instanceUrl?: string
  accountId: string
  name?: string
  type?: string
  industry?: string
  phone?: string
  website?: string
  billingStreet?: string
  billingCity?: string
  billingState?: string
  billingPostalCode?: string
  billingCountry?: string
  description?: string
  annualRevenue?: string
  numberOfEmployees?: string
}

export interface SalesforceUpdateAccountResponse {
  success: boolean
  output: {
    id: string
    updated: boolean
    metadata: {
      operation: 'update_account'
    }
  }
}

export const salesforceUpdateAccountTool: ToolConfig<
  SalesforceUpdateAccountParams,
  SalesforceUpdateAccountResponse
> = {
  id: 'salesforce_update_account',
  name: 'Update Account in Salesforce',
  description: 'Update an existing account in Salesforce CRM',
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
      description: 'Account ID to update (required)',
    },
    name: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Account name',
    },
    type: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Account type',
    },
    industry: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Industry',
    },
    phone: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Phone number',
    },
    website: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Website URL',
    },
    billingStreet: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Billing street address',
    },
    billingCity: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Billing city',
    },
    billingState: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Billing state/province',
    },
    billingPostalCode: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Billing postal code',
    },
    billingCountry: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Billing country',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Account description',
    },
    annualRevenue: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Annual revenue (number)',
    },
    numberOfEmployees: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Number of employees (number)',
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
    method: 'PATCH',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
      }
    },
    body: (params) => {
      const body: Record<string, any> = {}

      if (params.name) body.Name = params.name
      if (params.type) body.Type = params.type
      if (params.industry) body.Industry = params.industry
      if (params.phone) body.Phone = params.phone
      if (params.website) body.Website = params.website
      if (params.billingStreet) body.BillingStreet = params.billingStreet
      if (params.billingCity) body.BillingCity = params.billingCity
      if (params.billingState) body.BillingState = params.billingState
      if (params.billingPostalCode) body.BillingPostalCode = params.billingPostalCode
      if (params.billingCountry) body.BillingCountry = params.billingCountry
      if (params.description) body.Description = params.description
      if (params.annualRevenue) body.AnnualRevenue = Number.parseFloat(params.annualRevenue)
      if (params.numberOfEmployees)
        body.NumberOfEmployees = Number.parseInt(params.numberOfEmployees)

      return body
    },
  },

  transformResponse: async (response: Response, params) => {
    if (!response.ok) {
      const data = await response.json()
      logger.error('Salesforce API request failed', { data, status: response.status })
      throw new Error(data[0]?.message || data.message || 'Failed to update account in Salesforce')
    }

    return {
      success: true,
      output: {
        id: params?.accountId || '',
        updated: true,
        metadata: {
          operation: 'update_account' as const,
        },
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Updated account data',
      properties: {
        id: { type: 'string', description: 'Updated account ID' },
        updated: { type: 'boolean', description: 'Whether account was updated' },
        metadata: { type: 'object', description: 'Operation metadata' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_case.ts]---
Location: sim-main/apps/sim/tools/salesforce/update_case.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import { getInstanceUrl } from './utils'

export interface SalesforceUpdateCaseParams {
  accessToken: string
  idToken?: string
  instanceUrl?: string
  caseId: string
  subject?: string
  status?: string
  priority?: string
  description?: string
}

export interface SalesforceUpdateCaseResponse {
  success: boolean
  output: {
    id: string
    updated: boolean
    metadata: {
      operation: 'update_case'
    }
  }
}

export const salesforceUpdateCaseTool: ToolConfig<
  SalesforceUpdateCaseParams,
  SalesforceUpdateCaseResponse
> = {
  id: 'salesforce_update_case',
  name: 'Update Case in Salesforce',
  description: 'Update an existing case',
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
    subject: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Case subject',
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
    description: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Description',
    },
  },

  request: {
    url: (params) =>
      `${getInstanceUrl(params.idToken, params.instanceUrl)}/services/data/v59.0/sobjects/Case/${params.caseId}`,
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
      if (params.description) body.Description = params.description
      return body
    },
  },

  transformResponse: async (response, params?) => {
    if (!response.ok) {
      const data = await response.json()
      throw new Error(data[0]?.message || data.message || 'Failed to update case')
    }
    return {
      success: true,
      output: {
        id: params?.caseId || '',
        updated: true,
        metadata: { operation: 'update_case' },
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Success' },
    output: { type: 'object', description: 'Updated case' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_contact.ts]---
Location: sim-main/apps/sim/tools/salesforce/update_contact.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { getInstanceUrl } from './utils'

const logger = createLogger('SalesforceContacts')

export interface SalesforceUpdateContactParams {
  accessToken: string
  idToken?: string
  instanceUrl?: string
  contactId: string
  lastName?: string
  firstName?: string
  email?: string
  phone?: string
  accountId?: string
  title?: string
  department?: string
  mailingStreet?: string
  mailingCity?: string
  mailingState?: string
  mailingPostalCode?: string
  mailingCountry?: string
  description?: string
}

export interface SalesforceUpdateContactResponse {
  success: boolean
  output: {
    id: string
    updated: boolean
    metadata: { operation: 'update_contact' }
  }
}

export const salesforceUpdateContactTool: ToolConfig<
  SalesforceUpdateContactParams,
  SalesforceUpdateContactResponse
> = {
  id: 'salesforce_update_contact',
  name: 'Update Contact in Salesforce',
  description: 'Update an existing contact in Salesforce CRM',
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
      description: 'Contact ID to update (required)',
    },
    lastName: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Last name',
    },
    firstName: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'First name',
    },
    email: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Email address',
    },
    phone: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Phone number',
    },
    accountId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Account ID to associate with',
    },
    title: { type: 'string', required: false, visibility: 'user-only', description: 'Job title' },
    department: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Department',
    },
    mailingStreet: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Mailing street',
    },
    mailingCity: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Mailing city',
    },
    mailingState: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Mailing state',
    },
    mailingPostalCode: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Mailing postal code',
    },
    mailingCountry: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Mailing country',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Description',
    },
  },

  request: {
    url: (params) => {
      const instanceUrl = getInstanceUrl(params.idToken, params.instanceUrl)
      return `${instanceUrl}/services/data/v59.0/sobjects/Contact/${params.contactId}`
    },
    method: 'PATCH',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: Record<string, any> = {}

      if (params.lastName) body.LastName = params.lastName
      if (params.firstName) body.FirstName = params.firstName
      if (params.email) body.Email = params.email
      if (params.phone) body.Phone = params.phone
      if (params.accountId) body.AccountId = params.accountId
      if (params.title) body.Title = params.title
      if (params.department) body.Department = params.department
      if (params.mailingStreet) body.MailingStreet = params.mailingStreet
      if (params.mailingCity) body.MailingCity = params.mailingCity
      if (params.mailingState) body.MailingState = params.mailingState
      if (params.mailingPostalCode) body.MailingPostalCode = params.mailingPostalCode
      if (params.mailingCountry) body.MailingCountry = params.mailingCountry
      if (params.description) body.Description = params.description

      return body
    },
  },

  transformResponse: async (response: Response, params?) => {
    if (!response.ok) {
      const data = await response.json()
      logger.error('Salesforce API request failed', { data, status: response.status })
      throw new Error(data[0]?.message || data.message || 'Failed to update contact in Salesforce')
    }

    return {
      success: true,
      output: {
        id: params?.contactId || '',
        updated: true,
        metadata: { operation: 'update_contact' as const },
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Updated contact data',
      properties: {
        id: { type: 'string', description: 'Updated contact ID' },
        updated: { type: 'boolean', description: 'Whether contact was updated' },
        metadata: { type: 'object', description: 'Operation metadata' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_lead.ts]---
Location: sim-main/apps/sim/tools/salesforce/update_lead.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import { getInstanceUrl } from './utils'

export interface SalesforceUpdateLeadParams {
  accessToken: string
  idToken?: string
  instanceUrl?: string
  leadId: string
  lastName?: string
  company?: string
  firstName?: string
  email?: string
  phone?: string
  status?: string
  leadSource?: string
  title?: string
  description?: string
}

export interface SalesforceUpdateLeadResponse {
  success: boolean
  output: {
    id: string
    updated: boolean
    metadata: {
      operation: 'update_lead'
    }
  }
}

export const salesforceUpdateLeadTool: ToolConfig<
  SalesforceUpdateLeadParams,
  SalesforceUpdateLeadResponse
> = {
  id: 'salesforce_update_lead',
  name: 'Update Lead in Salesforce',
  description: 'Update an existing lead',
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
    lastName: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Last name',
    },
    company: { type: 'string', required: false, visibility: 'user-only', description: 'Company' },
    firstName: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'First name',
    },
    email: { type: 'string', required: false, visibility: 'user-only', description: 'Email' },
    phone: { type: 'string', required: false, visibility: 'user-only', description: 'Phone' },
    status: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Lead status',
    },
    leadSource: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Lead source',
    },
    title: { type: 'string', required: false, visibility: 'user-only', description: 'Title' },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Description',
    },
  },

  request: {
    url: (params) =>
      `${getInstanceUrl(params.idToken, params.instanceUrl)}/services/data/v59.0/sobjects/Lead/${params.leadId}`,
    method: 'PATCH',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: Record<string, any> = {}
      if (params.lastName) body.LastName = params.lastName
      if (params.company) body.Company = params.company
      if (params.firstName) body.FirstName = params.firstName
      if (params.email) body.Email = params.email
      if (params.phone) body.Phone = params.phone
      if (params.status) body.Status = params.status
      if (params.leadSource) body.LeadSource = params.leadSource
      if (params.title) body.Title = params.title
      if (params.description) body.Description = params.description
      return body
    },
  },

  transformResponse: async (response, params?) => {
    if (!response.ok) {
      const data = await response.json()
      throw new Error(data[0]?.message || data.message || 'Failed to update lead')
    }
    return {
      success: true,
      output: {
        id: params?.leadId || '',
        updated: true,
        metadata: { operation: 'update_lead' },
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Success' },
    output: { type: 'object', description: 'Updated lead' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_opportunity.ts]---
Location: sim-main/apps/sim/tools/salesforce/update_opportunity.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import { getInstanceUrl } from './utils'

export interface SalesforceUpdateOpportunityParams {
  accessToken: string
  idToken?: string
  instanceUrl?: string
  opportunityId: string
  name?: string
  stageName?: string
  closeDate?: string
  accountId?: string
  amount?: string
  probability?: string
  description?: string
}

export interface SalesforceUpdateOpportunityResponse {
  success: boolean
  output: {
    id: string
    updated: boolean
    metadata: {
      operation: 'update_opportunity'
    }
  }
}

export const salesforceUpdateOpportunityTool: ToolConfig<
  SalesforceUpdateOpportunityParams,
  SalesforceUpdateOpportunityResponse
> = {
  id: 'salesforce_update_opportunity',
  name: 'Update Opportunity in Salesforce',
  description: 'Update an existing opportunity',
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
    name: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Opportunity name',
    },
    stageName: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Stage name',
    },
    closeDate: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Close date YYYY-MM-DD',
    },
    accountId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Account ID',
    },
    amount: { type: 'string', required: false, visibility: 'user-only', description: 'Amount' },
    probability: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Probability (0-100)',
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
      `${getInstanceUrl(params.idToken, params.instanceUrl)}/services/data/v59.0/sobjects/Opportunity/${params.opportunityId}`,
    method: 'PATCH',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: Record<string, any> = {}
      if (params.name) body.Name = params.name
      if (params.stageName) body.StageName = params.stageName
      if (params.closeDate) body.CloseDate = params.closeDate
      if (params.accountId) body.AccountId = params.accountId
      if (params.amount) body.Amount = Number.parseFloat(params.amount)
      if (params.probability) body.Probability = Number.parseInt(params.probability)
      if (params.description) body.Description = params.description
      return body
    },
  },

  transformResponse: async (response, params?) => {
    if (!response.ok) {
      const data = await response.json()
      throw new Error(data[0]?.message || data.message || 'Failed to update opportunity')
    }
    return {
      success: true,
      output: {
        id: params?.opportunityId || '',
        updated: true,
        metadata: { operation: 'update_opportunity' },
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Success' },
    output: { type: 'object', description: 'Updated opportunity' },
  },
}
```

--------------------------------------------------------------------------------

````
