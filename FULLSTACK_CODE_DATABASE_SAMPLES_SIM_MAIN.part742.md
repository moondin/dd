---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 742
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 742 of 933)

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

---[FILE: get_leads.ts]---
Location: sim-main/apps/sim/tools/salesforce/get_leads.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import { getInstanceUrl } from './utils'

export interface SalesforceGetLeadsParams {
  accessToken: string
  idToken?: string
  instanceUrl?: string
  leadId?: string
  limit?: string
  fields?: string
  orderBy?: string
}

export interface SalesforceGetLeadsResponse {
  success: boolean
  output: {
    lead?: any
    leads?: any[]
    paging?: {
      nextRecordsUrl?: string
      totalSize: number
      done: boolean
    }
    metadata: {
      operation: 'get_leads'
      totalReturned?: number
      hasMore?: boolean
      singleLead?: boolean
    }
    success: boolean
  }
}

export const salesforceGetLeadsTool: ToolConfig<
  SalesforceGetLeadsParams,
  SalesforceGetLeadsResponse
> = {
  id: 'salesforce_get_leads',
  name: 'Get Leads from Salesforce',
  description: 'Get lead(s) from Salesforce',
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
      required: false,
      visibility: 'user-only',
      description: 'Lead ID (optional)',
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
      if (params.leadId) {
        const fields =
          params.fields || 'Id,FirstName,LastName,Company,Email,Phone,Status,LeadSource'
        return `${instanceUrl}/services/data/v59.0/sobjects/Lead/${params.leadId}?fields=${fields}`
      }
      const limit = params.limit ? Number.parseInt(params.limit) : 100
      const fields = params.fields || 'Id,FirstName,LastName,Company,Email,Phone,Status,LeadSource'
      const orderBy = params.orderBy || 'LastName ASC'
      const query = `SELECT ${fields} FROM Lead ORDER BY ${orderBy} LIMIT ${limit}`
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
    if (!response.ok) throw new Error(data[0]?.message || data.message || 'Failed to fetch leads')
    if (params?.leadId) {
      return {
        success: true,
        output: {
          lead: data,
          metadata: { operation: 'get_leads', singleLead: true },
          success: true,
        },
      }
    }
    const leads = data.records || []
    return {
      success: true,
      output: {
        leads,
        paging: {
          nextRecordsUrl: data.nextRecordsUrl,
          totalSize: data.totalSize || leads.length,
          done: data.done !== false,
        },
        metadata: { operation: 'get_leads', totalReturned: leads.length, hasMore: !data.done },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Success status' },
    output: { type: 'object', description: 'Lead data' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_opportunities.ts]---
Location: sim-main/apps/sim/tools/salesforce/get_opportunities.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import { getInstanceUrl } from './utils'

export interface SalesforceGetOpportunitiesParams {
  accessToken: string
  idToken?: string
  instanceUrl?: string
  opportunityId?: string
  limit?: string
  fields?: string
  orderBy?: string
}

export interface SalesforceGetOpportunitiesResponse {
  success: boolean
  output: {
    opportunity?: any
    opportunities?: any[]
    paging?: {
      nextRecordsUrl?: string
      totalSize: number
      done: boolean
    }
    metadata: {
      operation: 'get_opportunities'
      totalReturned?: number
      hasMore?: boolean
    }
    success: boolean
  }
}

export const salesforceGetOpportunitiesTool: ToolConfig<
  SalesforceGetOpportunitiesParams,
  SalesforceGetOpportunitiesResponse
> = {
  id: 'salesforce_get_opportunities',
  name: 'Get Opportunities from Salesforce',
  description: 'Get opportunity(ies) from Salesforce',
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
      required: false,
      visibility: 'user-only',
      description: 'Opportunity ID (optional)',
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
      if (params.opportunityId) {
        const fields = params.fields || 'Id,Name,AccountId,Amount,StageName,CloseDate,Probability'
        return `${instanceUrl}/services/data/v59.0/sobjects/Opportunity/${params.opportunityId}?fields=${fields}`
      }
      const limit = params.limit ? Number.parseInt(params.limit) : 100
      const fields = params.fields || 'Id,Name,AccountId,Amount,StageName,CloseDate,Probability'
      const orderBy = params.orderBy || 'CloseDate DESC'
      const query = `SELECT ${fields} FROM Opportunity ORDER BY ${orderBy} LIMIT ${limit}`
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
    if (!response.ok)
      throw new Error(data[0]?.message || data.message || 'Failed to fetch opportunities')
    if (params?.opportunityId) {
      return {
        success: true,
        output: { opportunity: data, metadata: { operation: 'get_opportunities' }, success: true },
      }
    }
    const opportunities = data.records || []
    return {
      success: true,
      output: {
        opportunities,
        paging: {
          nextRecordsUrl: data.nextRecordsUrl,
          totalSize: data.totalSize || opportunities.length,
          done: data.done !== false,
        },
        metadata: {
          operation: 'get_opportunities',
          totalReturned: opportunities.length,
          hasMore: !data.done,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Success' },
    output: { type: 'object', description: 'Opportunity data' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_report.ts]---
Location: sim-main/apps/sim/tools/salesforce/get_report.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { extractErrorMessage, getInstanceUrl } from './utils'

const logger = createLogger('SalesforceReports')

export interface SalesforceGetReportParams {
  accessToken: string
  idToken?: string
  instanceUrl?: string
  reportId: string
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

/**
 * Get metadata for a specific report
 * @see https://developer.salesforce.com/docs/atlas.en-us.api_analytics.meta/api_analytics/sforce_analytics_rest_api_get_reportmetadata.htm
 */
export const salesforceGetReportTool: ToolConfig<
  SalesforceGetReportParams,
  SalesforceGetReportResponse
> = {
  id: 'salesforce_get_report',
  name: 'Get Report Metadata from Salesforce',
  description: 'Get metadata and describe information for a specific report',
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
  },

  request: {
    url: (params) => {
      if (!params.reportId || params.reportId.trim() === '') {
        throw new Error('Report ID is required. Please provide a valid Salesforce Report ID.')
      }
      const instanceUrl = getInstanceUrl(params.idToken, params.instanceUrl)
      return `${instanceUrl}/services/data/v59.0/analytics/reports/${params.reportId}/describe`
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
        `Failed to get report metadata for report ID: ${params?.reportId}`
      )
      logger.error('Failed to get report metadata', { data, status: response.status })
      throw new Error(errorMessage)
    }

    return {
      success: true,
      output: {
        report: data,
        reportId: params?.reportId || '',
        metadata: {
          operation: 'get_report',
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Success status' },
    output: {
      type: 'object',
      description: 'Report metadata',
      properties: {
        report: { type: 'object', description: 'Report metadata object' },
        reportId: { type: 'string', description: 'Report ID' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success status' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_tasks.ts]---
Location: sim-main/apps/sim/tools/salesforce/get_tasks.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import { getInstanceUrl } from './utils'

export interface SalesforceGetTasksParams {
  accessToken: string
  idToken?: string
  instanceUrl?: string
  taskId?: string
  limit?: string
  fields?: string
  orderBy?: string
}

export interface SalesforceGetTasksResponse {
  success: boolean
  output: {
    task?: any
    tasks?: any[]
    paging?: {
      nextRecordsUrl?: string
      totalSize: number
      done: boolean
    }
    metadata: {
      operation: 'get_tasks'
      totalReturned?: number
      hasMore?: boolean
    }
    success: boolean
  }
}

export const salesforceGetTasksTool: ToolConfig<
  SalesforceGetTasksParams,
  SalesforceGetTasksResponse
> = {
  id: 'salesforce_get_tasks',
  name: 'Get Tasks from Salesforce',
  description: 'Get task(s) from Salesforce',
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
      required: false,
      visibility: 'user-only',
      description: 'Task ID (optional)',
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
      if (params.taskId) {
        const fields =
          params.fields || 'Id,Subject,Status,Priority,ActivityDate,WhoId,WhatId,OwnerId'
        return `${instanceUrl}/services/data/v59.0/sobjects/Task/${params.taskId}?fields=${fields}`
      }
      const limit = params.limit ? Number.parseInt(params.limit) : 100
      const fields = params.fields || 'Id,Subject,Status,Priority,ActivityDate,WhoId,WhatId,OwnerId'
      const orderBy = params.orderBy || 'ActivityDate DESC'
      const query = `SELECT ${fields} FROM Task ORDER BY ${orderBy} LIMIT ${limit}`
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
    if (!response.ok) throw new Error(data[0]?.message || data.message || 'Failed to fetch tasks')
    if (params?.taskId) {
      return {
        success: true,
        output: { task: data, metadata: { operation: 'get_tasks' }, success: true },
      }
    }
    const tasks = data.records || []
    return {
      success: true,
      output: {
        tasks,
        paging: {
          nextRecordsUrl: data.nextRecordsUrl,
          totalSize: data.totalSize || tasks.length,
          done: data.done !== false,
        },
        metadata: { operation: 'get_tasks', totalReturned: tasks.length, hasMore: !data.done },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Success' },
    output: { type: 'object', description: 'Task data' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/salesforce/index.ts

```typescript
export { salesforceCreateAccountTool } from './create_account'
export { salesforceCreateCaseTool } from './create_case'
export { salesforceCreateContactTool } from './create_contact'
export { salesforceCreateLeadTool } from './create_lead'
export { salesforceCreateOpportunityTool } from './create_opportunity'
export { salesforceCreateTaskTool } from './create_task'
export { salesforceDeleteAccountTool } from './delete_account'
export { salesforceDeleteCaseTool } from './delete_case'
export { salesforceDeleteContactTool } from './delete_contact'
export { salesforceDeleteLeadTool } from './delete_lead'
export { salesforceDeleteOpportunityTool } from './delete_opportunity'
export { salesforceDeleteTaskTool } from './delete_task'
export { salesforceDescribeObjectTool } from './describe_object'
export { salesforceGetAccountsTool } from './get_accounts'
export { salesforceGetCasesTool } from './get_cases'
export { salesforceGetContactsTool } from './get_contacts'
export { salesforceGetDashboardTool } from './get_dashboard'
export { salesforceGetLeadsTool } from './get_leads'
export { salesforceGetOpportunitiesTool } from './get_opportunities'
export { salesforceGetReportTool } from './get_report'
export { salesforceGetTasksTool } from './get_tasks'
export { salesforceListDashboardsTool } from './list_dashboards'
export { salesforceListObjectsTool } from './list_objects'
export { salesforceListReportTypesTool } from './list_report_types'
export { salesforceListReportsTool } from './list_reports'
export { salesforceQueryTool } from './query'
export { salesforceQueryMoreTool } from './query_more'
export { salesforceRefreshDashboardTool } from './refresh_dashboard'
export { salesforceRunReportTool } from './run_report'
export { salesforceUpdateAccountTool } from './update_account'
export { salesforceUpdateCaseTool } from './update_case'
export { salesforceUpdateContactTool } from './update_contact'
export { salesforceUpdateLeadTool } from './update_lead'
export { salesforceUpdateOpportunityTool } from './update_opportunity'
export { salesforceUpdateTaskTool } from './update_task'
```

--------------------------------------------------------------------------------

---[FILE: list_dashboards.ts]---
Location: sim-main/apps/sim/tools/salesforce/list_dashboards.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { extractErrorMessage, getInstanceUrl } from './utils'

const logger = createLogger('SalesforceDashboards')

export interface SalesforceListDashboardsParams {
  accessToken: string
  idToken?: string
  instanceUrl?: string
  folderName?: string
}

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

/**
 * List all dashboards accessible by the current user
 * @see https://developer.salesforce.com/docs/atlas.en-us.api_analytics.meta/api_analytics/sforce_analytics_rest_api_getbasic_dashboardlist.htm
 */
export const salesforceListDashboardsTool: ToolConfig<
  SalesforceListDashboardsParams,
  SalesforceListDashboardsResponse
> = {
  id: 'salesforce_list_dashboards',
  name: 'List Dashboards from Salesforce',
  description: 'Get a list of dashboards accessible by the current user',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'salesforce',
  },

  params: {
    accessToken: { type: 'string', required: true, visibility: 'hidden' },
    idToken: { type: 'string', required: false, visibility: 'hidden' },
    instanceUrl: { type: 'string', required: false, visibility: 'hidden' },
    folderName: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Filter by folder name',
    },
  },

  request: {
    url: (params) => {
      const instanceUrl = getInstanceUrl(params.idToken, params.instanceUrl)
      return `${instanceUrl}/services/data/v59.0/analytics/dashboards`
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
        'Failed to list dashboards from Salesforce'
      )
      logger.error('Failed to list dashboards', { data, status: response.status })
      throw new Error(errorMessage)
    }

    let dashboards = data.dashboards || data || []

    // Filter by folder name if provided
    if (params?.folderName) {
      dashboards = dashboards.filter((dashboard: any) =>
        dashboard.folderName?.toLowerCase().includes(params.folderName!.toLowerCase())
      )
    }

    return {
      success: true,
      output: {
        dashboards,
        metadata: {
          operation: 'list_dashboards',
          totalReturned: dashboards.length,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Success status' },
    output: {
      type: 'object',
      description: 'Dashboards data',
      properties: {
        dashboards: { type: 'array', description: 'Array of dashboard objects' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success status' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_objects.ts]---
Location: sim-main/apps/sim/tools/salesforce/list_objects.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { extractErrorMessage, getInstanceUrl } from './utils'

const logger = createLogger('SalesforceQuery')

export interface SalesforceListObjectsParams {
  accessToken: string
  idToken?: string
  instanceUrl?: string
}

export interface SalesforceListObjectsResponse {
  success: boolean
  output: {
    objects: any[]
    encoding?: string
    maxBatchSize?: number
    metadata: {
      operation: 'list_objects'
      totalReturned: number
    }
    success: boolean
  }
}

/**
 * List all available Salesforce objects
 * Useful for discovering what objects are available
 */
export const salesforceListObjectsTool: ToolConfig<
  SalesforceListObjectsParams,
  SalesforceListObjectsResponse
> = {
  id: 'salesforce_list_objects',
  name: 'List Salesforce Objects',
  description: 'Get a list of all available Salesforce objects',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'salesforce',
  },

  params: {
    accessToken: { type: 'string', required: true, visibility: 'hidden' },
    idToken: { type: 'string', required: false, visibility: 'hidden' },
    instanceUrl: { type: 'string', required: false, visibility: 'hidden' },
  },

  request: {
    url: (params) => {
      const instanceUrl = getInstanceUrl(params.idToken, params.instanceUrl)
      return `${instanceUrl}/services/data/v59.0/sobjects`
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()
    if (!response.ok) {
      const errorMessage = extractErrorMessage(
        data,
        response.status,
        'Failed to list Salesforce objects'
      )
      logger.error('Failed to list objects', { data, status: response.status })
      throw new Error(errorMessage)
    }

    const objects = data.sobjects || []

    return {
      success: true,
      output: {
        objects,
        encoding: data.encoding,
        maxBatchSize: data.maxBatchSize,
        metadata: {
          operation: 'list_objects',
          totalReturned: objects.length,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Success status' },
    output: {
      type: 'object',
      description: 'Objects list',
      properties: {
        objects: { type: 'array', description: 'Array of available Salesforce objects' },
        encoding: { type: 'string', description: 'Encoding used' },
        maxBatchSize: { type: 'number', description: 'Maximum batch size' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success status' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_reports.ts]---
Location: sim-main/apps/sim/tools/salesforce/list_reports.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { extractErrorMessage, getInstanceUrl } from './utils'

const logger = createLogger('SalesforceReports')

export interface SalesforceListReportsParams {
  accessToken: string
  idToken?: string
  instanceUrl?: string
  folderName?: string
  searchTerm?: string
}

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

/**
 * List all reports accessible by the current user
 * @see https://developer.salesforce.com/docs/atlas.en-us.api_analytics.meta/api_analytics/sforce_analytics_rest_api_get_reportlist.htm
 */
export const salesforceListReportsTool: ToolConfig<
  SalesforceListReportsParams,
  SalesforceListReportsResponse
> = {
  id: 'salesforce_list_reports',
  name: 'List Reports from Salesforce',
  description: 'Get a list of reports accessible by the current user',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'salesforce',
  },

  params: {
    accessToken: { type: 'string', required: true, visibility: 'hidden' },
    idToken: { type: 'string', required: false, visibility: 'hidden' },
    instanceUrl: { type: 'string', required: false, visibility: 'hidden' },
    folderName: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Filter by folder name',
    },
    searchTerm: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Search term to filter reports by name',
    },
  },

  request: {
    url: (params) => {
      const instanceUrl = getInstanceUrl(params.idToken, params.instanceUrl)
      return `${instanceUrl}/services/data/v59.0/analytics/reports`
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
        'Failed to list reports from Salesforce'
      )
      logger.error('Failed to list reports', { data, status: response.status })
      throw new Error(errorMessage)
    }

    let reports = data || []

    // Filter by folder name if provided
    if (params?.folderName) {
      reports = reports.filter((report: any) =>
        report.folderName?.toLowerCase().includes(params.folderName!.toLowerCase())
      )
    }

    // Filter by search term if provided
    if (params?.searchTerm) {
      reports = reports.filter(
        (report: any) =>
          report.name?.toLowerCase().includes(params.searchTerm!.toLowerCase()) ||
          report.description?.toLowerCase().includes(params.searchTerm!.toLowerCase())
      )
    }

    return {
      success: true,
      output: {
        reports,
        metadata: {
          operation: 'list_reports',
          totalReturned: reports.length,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Success status' },
    output: {
      type: 'object',
      description: 'Reports data',
      properties: {
        reports: { type: 'array', description: 'Array of report objects' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success status' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_report_types.ts]---
Location: sim-main/apps/sim/tools/salesforce/list_report_types.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { extractErrorMessage, getInstanceUrl } from './utils'

const logger = createLogger('SalesforceReports')

export interface SalesforceListReportTypesParams {
  accessToken: string
  idToken?: string
  instanceUrl?: string
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

/**
 * Get list of available report types
 * @see https://developer.salesforce.com/docs/atlas.en-us.api_analytics.meta/api_analytics/sforce_analytics_rest_api_list_reporttypes.htm
 */
export const salesforceListReportTypesTool: ToolConfig<
  SalesforceListReportTypesParams,
  SalesforceListReportTypesResponse
> = {
  id: 'salesforce_list_report_types',
  name: 'List Report Types from Salesforce',
  description: 'Get a list of available report types',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'salesforce',
  },

  params: {
    accessToken: { type: 'string', required: true, visibility: 'hidden' },
    idToken: { type: 'string', required: false, visibility: 'hidden' },
    instanceUrl: { type: 'string', required: false, visibility: 'hidden' },
  },

  request: {
    url: (params) => {
      const instanceUrl = getInstanceUrl(params.idToken, params.instanceUrl)
      return `${instanceUrl}/services/data/v59.0/analytics/reportTypes`
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()
    if (!response.ok) {
      const errorMessage = extractErrorMessage(
        data,
        response.status,
        'Failed to list report types from Salesforce'
      )
      logger.error('Failed to list report types', { data, status: response.status })
      throw new Error(errorMessage)
    }

    return {
      success: true,
      output: {
        reportTypes: data,
        metadata: {
          operation: 'list_report_types',
          totalReturned: Array.isArray(data) ? data.length : 0,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Success status' },
    output: {
      type: 'object',
      description: 'Report types data',
      properties: {
        reportTypes: { type: 'array', description: 'Array of report type objects' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success status' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: query.ts]---
Location: sim-main/apps/sim/tools/salesforce/query.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { extractErrorMessage, getInstanceUrl } from './utils'

const logger = createLogger('SalesforceQuery')

export interface SalesforceQueryParams {
  accessToken: string
  idToken?: string
  instanceUrl?: string
  query: string
}

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

/**
 * Execute a custom SOQL query
 * @see https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_query.htm
 */
export const salesforceQueryTool: ToolConfig<SalesforceQueryParams, SalesforceQueryResponse> = {
  id: 'salesforce_query',
  name: 'Run SOQL Query in Salesforce',
  description: 'Execute a custom SOQL query to retrieve data from Salesforce',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'salesforce',
  },

  params: {
    accessToken: { type: 'string', required: true, visibility: 'hidden' },
    idToken: { type: 'string', required: false, visibility: 'hidden' },
    instanceUrl: { type: 'string', required: false, visibility: 'hidden' },
    query: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SOQL query to execute (e.g., SELECT Id, Name FROM Account LIMIT 10)',
    },
  },

  request: {
    url: (params) => {
      if (!params.query || params.query.trim() === '') {
        throw new Error(
          'SOQL Query is required. Please provide a valid SOQL query (e.g., SELECT Id, Name FROM Account LIMIT 10).'
        )
      }
      const instanceUrl = getInstanceUrl(params.idToken, params.instanceUrl)
      const encodedQuery = encodeURIComponent(params.query)
      return `${instanceUrl}/services/data/v59.0/query?q=${encodedQuery}`
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
        'Failed to execute SOQL query'
      )
      logger.error('Failed to execute SOQL query', { data, status: response.status })
      throw new Error(errorMessage)
    }

    const records = data.records || []

    return {
      success: true,
      output: {
        records,
        totalSize: data.totalSize || records.length,
        done: data.done !== false,
        nextRecordsUrl: data.nextRecordsUrl,
        query: params?.query || '',
        metadata: {
          operation: 'query',
          totalReturned: records.length,
          hasMore: !data.done,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Success status' },
    output: {
      type: 'object',
      description: 'Query results',
      properties: {
        records: { type: 'array', description: 'Array of record objects' },
        totalSize: { type: 'number', description: 'Total number of records matching query' },
        done: { type: 'boolean', description: 'Whether all records have been returned' },
        nextRecordsUrl: { type: 'string', description: 'URL to fetch next batch of records' },
        query: { type: 'string', description: 'The executed SOQL query' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success status' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: query_more.ts]---
Location: sim-main/apps/sim/tools/salesforce/query_more.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { extractErrorMessage, getInstanceUrl } from './utils'

const logger = createLogger('SalesforceQuery')

export interface SalesforceQueryMoreParams {
  accessToken: string
  idToken?: string
  instanceUrl?: string
  nextRecordsUrl: string
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

/**
 * Retrieve additional query results using the nextRecordsUrl
 * @see https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_query.htm
 */
export const salesforceQueryMoreTool: ToolConfig<
  SalesforceQueryMoreParams,
  SalesforceQueryMoreResponse
> = {
  id: 'salesforce_query_more',
  name: 'Get More Query Results from Salesforce',
  description: 'Retrieve additional query results using the nextRecordsUrl from a previous query',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'salesforce',
  },

  params: {
    accessToken: { type: 'string', required: true, visibility: 'hidden' },
    idToken: { type: 'string', required: false, visibility: 'hidden' },
    instanceUrl: { type: 'string', required: false, visibility: 'hidden' },
    nextRecordsUrl: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The nextRecordsUrl from a previous query response',
    },
  },

  request: {
    url: (params) => {
      if (!params.nextRecordsUrl || params.nextRecordsUrl.trim() === '') {
        throw new Error(
          'Next Records URL is required. This should be the nextRecordsUrl value from a previous query response.'
        )
      }
      const instanceUrl = getInstanceUrl(params.idToken, params.instanceUrl)
      // nextRecordsUrl is typically a relative path like /services/data/v59.0/query/01g...
      const nextUrl = params.nextRecordsUrl.startsWith('/')
        ? params.nextRecordsUrl
        : `/${params.nextRecordsUrl}`
      return `${instanceUrl}${nextUrl}`
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()
    if (!response.ok) {
      const errorMessage = extractErrorMessage(
        data,
        response.status,
        'Failed to get more query results'
      )
      logger.error('Failed to get more query results', { data, status: response.status })
      throw new Error(errorMessage)
    }

    const records = data.records || []

    return {
      success: true,
      output: {
        records,
        totalSize: data.totalSize || records.length,
        done: data.done !== false,
        nextRecordsUrl: data.nextRecordsUrl,
        metadata: {
          operation: 'query_more',
          totalReturned: records.length,
          hasMore: !data.done,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Success status' },
    output: {
      type: 'object',
      description: 'Query results',
      properties: {
        records: { type: 'array', description: 'Array of record objects' },
        totalSize: { type: 'number', description: 'Total number of records matching query' },
        done: { type: 'boolean', description: 'Whether all records have been returned' },
        nextRecordsUrl: { type: 'string', description: 'URL to fetch next batch of records' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success status' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

````
