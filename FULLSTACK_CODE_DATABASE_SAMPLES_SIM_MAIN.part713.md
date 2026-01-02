---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 713
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 713 of 933)

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

---[FILE: get_batch_operation.ts]---
Location: sim-main/apps/sim/tools/mailchimp/get_batch_operation.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import type { MailchimpBatchOperation } from './types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpGetBatchOperation')

export interface MailchimpGetBatchOperationParams {
  apiKey: string
  batchId: string
}

export interface MailchimpGetBatchOperationResponse {
  success: boolean
  output: {
    batch: MailchimpBatchOperation
    metadata: {
      operation: 'get_batch_operation'
      batchId: string
    }
    success: boolean
  }
}

export const mailchimpGetBatchOperationTool: ToolConfig<
  MailchimpGetBatchOperationParams,
  MailchimpGetBatchOperationResponse
> = {
  id: 'mailchimp_get_batch_operation',
  name: 'Get Batch Operation from Mailchimp',
  description: 'Retrieve details of a specific batch operation from Mailchimp',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Mailchimp API key with server prefix',
    },
    batchId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The unique ID for the batch operation',
    },
  },

  request: {
    url: (params) => buildMailchimpUrl(params.apiKey, `/batches/${params.batchId}`),
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'get_batch_operation')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        batch: data,
        metadata: {
          operation: 'get_batch_operation' as const,
          batchId: data.id,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Batch operation data and metadata',
      properties: {
        batch: { type: 'object', description: 'Batch operation object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_batch_operations.ts]---
Location: sim-main/apps/sim/tools/mailchimp/get_batch_operations.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import type { MailchimpBatchOperation } from './types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpGetBatchOperations')

export interface MailchimpGetBatchOperationsParams {
  apiKey: string
  count?: string
  offset?: string
}

export interface MailchimpGetBatchOperationsResponse {
  success: boolean
  output: {
    batches: MailchimpBatchOperation[]
    totalItems: number
    metadata: {
      operation: 'get_batch_operations'
      totalReturned: number
    }
    success: boolean
  }
}

export const mailchimpGetBatchOperationsTool: ToolConfig<
  MailchimpGetBatchOperationsParams,
  MailchimpGetBatchOperationsResponse
> = {
  id: 'mailchimp_get_batch_operations',
  name: 'Get Batch Operations from Mailchimp',
  description: 'Retrieve a list of batch operations from Mailchimp',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Mailchimp API key with server prefix',
    },
    count: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Number of results (default: 10, max: 1000)',
    },
    offset: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Number of results to skip',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()
      if (params.count) queryParams.append('count', params.count)
      if (params.offset) queryParams.append('offset', params.offset)

      const query = queryParams.toString()
      const url = buildMailchimpUrl(params.apiKey, '/batches')
      return query ? `${url}?${query}` : url
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'get_batch_operations')
    }

    const data = await response.json()
    const batches = data.batches || []

    return {
      success: true,
      output: {
        batches,
        totalItems: data.total_items || batches.length,
        metadata: {
          operation: 'get_batch_operations' as const,
          totalReturned: batches.length,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Batch operations data and metadata',
      properties: {
        batches: { type: 'array', description: 'Array of batch operation objects' },
        totalItems: { type: 'number', description: 'Total number of batch operations' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_campaign.ts]---
Location: sim-main/apps/sim/tools/mailchimp/get_campaign.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildMailchimpUrl, handleMailchimpError, type MailchimpCampaign } from './types'

const logger = createLogger('MailchimpGetCampaign')

export interface MailchimpGetCampaignParams {
  apiKey: string
  campaignId: string
}

export interface MailchimpGetCampaignResponse {
  success: boolean
  output: {
    campaign: MailchimpCampaign
    metadata: {
      operation: 'get_campaign'
      campaignId: string
    }
    success: boolean
  }
}

export const mailchimpGetCampaignTool: ToolConfig<
  MailchimpGetCampaignParams,
  MailchimpGetCampaignResponse
> = {
  id: 'mailchimp_get_campaign',
  name: 'Get Campaign from Mailchimp',
  description: 'Retrieve details of a specific campaign from Mailchimp',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Mailchimp API key with server prefix',
    },
    campaignId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The unique ID for the campaign',
    },
  },

  request: {
    url: (params) => buildMailchimpUrl(params.apiKey, `/campaigns/${params.campaignId}`),
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'get_campaign')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        campaign: data,
        metadata: {
          operation: 'get_campaign' as const,
          campaignId: data.id,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Campaign data and metadata',
      properties: {
        campaign: { type: 'object', description: 'Campaign object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_campaigns.ts]---
Location: sim-main/apps/sim/tools/mailchimp/get_campaigns.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildMailchimpUrl, handleMailchimpError, type MailchimpCampaign } from './types'

const logger = createLogger('MailchimpGetCampaigns')

export interface MailchimpGetCampaignsParams {
  apiKey: string
  campaignType?: string
  status?: string
  count?: string
  offset?: string
}

export interface MailchimpGetCampaignsResponse {
  success: boolean
  output: {
    campaigns: MailchimpCampaign[]
    totalItems: number
    metadata: {
      operation: 'get_campaigns'
      totalReturned: number
    }
    success: boolean
  }
}

export const mailchimpGetCampaignsTool: ToolConfig<
  MailchimpGetCampaignsParams,
  MailchimpGetCampaignsResponse
> = {
  id: 'mailchimp_get_campaigns',
  name: 'Get Campaigns from Mailchimp',
  description: 'Retrieve a list of campaigns from Mailchimp',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Mailchimp API key with server prefix',
    },
    campaignType: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Filter by campaign type (regular, plaintext, absplit, rss, variate)',
    },
    status: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Filter by status (save, paused, schedule, sending, sent)',
    },
    count: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Number of results (default: 10, max: 1000)',
    },
    offset: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Number of results to skip',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()
      if (params.campaignType) queryParams.append('type', params.campaignType)
      if (params.status) queryParams.append('status', params.status)
      if (params.count) queryParams.append('count', params.count)
      if (params.offset) queryParams.append('offset', params.offset)

      const query = queryParams.toString()
      const url = buildMailchimpUrl(params.apiKey, '/campaigns')
      return query ? `${url}?${query}` : url
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'get_campaigns')
    }

    const data = await response.json()
    const campaigns = data.campaigns || []

    return {
      success: true,
      output: {
        campaigns,
        totalItems: data.total_items || campaigns.length,
        metadata: {
          operation: 'get_campaigns' as const,
          totalReturned: campaigns.length,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Campaigns data and metadata',
      properties: {
        campaigns: { type: 'array', description: 'Array of campaign objects' },
        totalItems: { type: 'number', description: 'Total number of campaigns' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_campaign_content.ts]---
Location: sim-main/apps/sim/tools/mailchimp/get_campaign_content.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildMailchimpUrl, handleMailchimpError, type MailchimpCampaignContent } from './types'

const logger = createLogger('MailchimpGetCampaignContent')

export interface MailchimpGetCampaignContentParams {
  apiKey: string
  campaignId: string
}

export interface MailchimpGetCampaignContentResponse {
  success: boolean
  output: {
    content: MailchimpCampaignContent
    metadata: {
      operation: 'get_campaign_content'
      campaignId: string
    }
    success: boolean
  }
}

export const mailchimpGetCampaignContentTool: ToolConfig<
  MailchimpGetCampaignContentParams,
  MailchimpGetCampaignContentResponse
> = {
  id: 'mailchimp_get_campaign_content',
  name: 'Get Campaign Content from Mailchimp',
  description: 'Retrieve the HTML and plain-text content for a Mailchimp campaign',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Mailchimp API key with server prefix',
    },
    campaignId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The unique ID for the campaign',
    },
  },

  request: {
    url: (params) => buildMailchimpUrl(params.apiKey, `/campaigns/${params.campaignId}/content`),
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'get_campaign_content')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        content: data,
        metadata: {
          operation: 'get_campaign_content' as const,
          campaignId: '',
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Campaign content data',
      properties: {
        content: { type: 'object', description: 'Campaign content object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_campaign_report.ts]---
Location: sim-main/apps/sim/tools/mailchimp/get_campaign_report.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildMailchimpUrl, handleMailchimpError, type MailchimpCampaignReport } from './types'

const logger = createLogger('MailchimpGetCampaignReport')

export interface MailchimpGetCampaignReportParams {
  apiKey: string
  campaignId: string
}

export interface MailchimpGetCampaignReportResponse {
  success: boolean
  output: {
    report: MailchimpCampaignReport
    metadata: {
      operation: 'get_campaign_report'
      campaignId: string
    }
    success: boolean
  }
}

export const mailchimpGetCampaignReportTool: ToolConfig<
  MailchimpGetCampaignReportParams,
  MailchimpGetCampaignReportResponse
> = {
  id: 'mailchimp_get_campaign_report',
  name: 'Get Campaign Report from Mailchimp',
  description: 'Retrieve the report for a specific campaign from Mailchimp',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Mailchimp API key with server prefix',
    },
    campaignId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The unique ID for the campaign',
    },
  },

  request: {
    url: (params) => buildMailchimpUrl(params.apiKey, `/reports/${params.campaignId}`),
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'get_campaign_report')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        report: data,
        metadata: {
          operation: 'get_campaign_report' as const,
          campaignId: data.campaign_id,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Campaign report data and metadata',
      properties: {
        report: { type: 'object', description: 'Campaign report object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_campaign_reports.ts]---
Location: sim-main/apps/sim/tools/mailchimp/get_campaign_reports.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildMailchimpUrl, handleMailchimpError, type MailchimpCampaignReport } from './types'

const logger = createLogger('MailchimpGetCampaignReports')

export interface MailchimpGetCampaignReportsParams {
  apiKey: string
  count?: string
  offset?: string
}

export interface MailchimpGetCampaignReportsResponse {
  success: boolean
  output: {
    reports: MailchimpCampaignReport[]
    totalItems: number
    metadata: {
      operation: 'get_campaign_reports'
      totalReturned: number
    }
    success: boolean
  }
}

export const mailchimpGetCampaignReportsTool: ToolConfig<
  MailchimpGetCampaignReportsParams,
  MailchimpGetCampaignReportsResponse
> = {
  id: 'mailchimp_get_campaign_reports',
  name: 'Get Campaign Reports from Mailchimp',
  description: 'Retrieve a list of campaign reports from Mailchimp',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Mailchimp API key with server prefix',
    },
    count: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Number of results (default: 10, max: 1000)',
    },
    offset: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Number of results to skip',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()
      if (params.count) queryParams.append('count', params.count)
      if (params.offset) queryParams.append('offset', params.offset)

      const query = queryParams.toString()
      const url = buildMailchimpUrl(params.apiKey, '/reports')
      return query ? `${url}?${query}` : url
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'get_campaign_reports')
    }

    const data = await response.json()
    const reports = data.reports || []

    return {
      success: true,
      output: {
        reports,
        totalItems: data.total_items || reports.length,
        metadata: {
          operation: 'get_campaign_reports' as const,
          totalReturned: reports.length,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Campaign reports data and metadata',
      properties: {
        reports: { type: 'array', description: 'Array of campaign report objects' },
        totalItems: { type: 'number', description: 'Total number of reports' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_interest.ts]---
Location: sim-main/apps/sim/tools/mailchimp/get_interest.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import type { MailchimpInterest } from './types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpGetInterest')

export interface MailchimpGetInterestParams {
  apiKey: string
  listId: string
  interestCategoryId: string
  interestId: string
}

export interface MailchimpGetInterestResponse {
  success: boolean
  output: {
    interest: MailchimpInterest
    metadata: {
      operation: 'get_interest'
      interestId: string
    }
    success: boolean
  }
}

export const mailchimpGetInterestTool: ToolConfig<
  MailchimpGetInterestParams,
  MailchimpGetInterestResponse
> = {
  id: 'mailchimp_get_interest',
  name: 'Get Interest from Mailchimp Interest Category',
  description:
    'Retrieve details of a specific interest from an interest category in a Mailchimp audience',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Mailchimp API key with server prefix',
    },
    listId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The unique ID for the list',
    },
    interestCategoryId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The unique ID for the interest category',
    },
    interestId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The unique ID for the interest',
    },
  },

  request: {
    url: (params) =>
      buildMailchimpUrl(
        params.apiKey,
        `/lists/${params.listId}/interest-categories/${params.interestCategoryId}/interests/${params.interestId}`
      ),
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'get_interest')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        interest: data,
        metadata: {
          operation: 'get_interest' as const,
          interestId: data.id,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Interest data and metadata',
      properties: {
        interest: { type: 'object', description: 'Interest object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_interests.ts]---
Location: sim-main/apps/sim/tools/mailchimp/get_interests.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpGetInterests')

export interface MailchimpGetInterestsParams {
  apiKey: string
  listId: string
  interestCategoryId: string
  count?: string
  offset?: string
}

export interface MailchimpGetInterestsResponse {
  success: boolean
  output: {
    interests: any[]
    totalItems: number
    metadata: {
      operation: 'get_interests'
      totalReturned: number
    }
    success: boolean
  }
}

export const mailchimpGetInterestsTool: ToolConfig<
  MailchimpGetInterestsParams,
  MailchimpGetInterestsResponse
> = {
  id: 'mailchimp_get_interests',
  name: 'Get Interests from Mailchimp Interest Category',
  description: 'Retrieve a list of interests from an interest category in a Mailchimp audience',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Mailchimp API key with server prefix',
    },
    listId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The unique ID for the list',
    },
    interestCategoryId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The unique ID for the interest category',
    },
    count: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Number of results (default: 10, max: 1000)',
    },
    offset: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Number of results to skip',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()
      if (params.count) queryParams.append('count', params.count)
      if (params.offset) queryParams.append('offset', params.offset)

      const query = queryParams.toString()
      const url = buildMailchimpUrl(
        params.apiKey,
        `/lists/${params.listId}/interest-categories/${params.interestCategoryId}/interests`
      )
      return query ? `${url}?${query}` : url
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'get_interests')
    }

    const data = await response.json()
    const interests = data.interests || []

    return {
      success: true,
      output: {
        interests,
        totalItems: data.total_items || interests.length,
        metadata: {
          operation: 'get_interests' as const,
          totalReturned: interests.length,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Interests data and metadata',
      properties: {
        interests: { type: 'array', description: 'Array of interest objects' },
        totalItems: { type: 'number', description: 'Total number of interests' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_interest_categories.ts]---
Location: sim-main/apps/sim/tools/mailchimp/get_interest_categories.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpGetInterestCategories')

export interface MailchimpGetInterestCategoriesParams {
  apiKey: string
  listId: string
  count?: string
  offset?: string
}

export interface MailchimpGetInterestCategoriesResponse {
  success: boolean
  output: {
    categories: any[]
    totalItems: number
    metadata: {
      operation: 'get_interest_categories'
      totalReturned: number
    }
    success: boolean
  }
}

export const mailchimpGetInterestCategoriesTool: ToolConfig<
  MailchimpGetInterestCategoriesParams,
  MailchimpGetInterestCategoriesResponse
> = {
  id: 'mailchimp_get_interest_categories',
  name: 'Get Interest Categories from Mailchimp Audience',
  description: 'Retrieve a list of interest categories from a Mailchimp audience',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Mailchimp API key with server prefix',
    },
    listId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The unique ID for the list',
    },
    count: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Number of results (default: 10, max: 1000)',
    },
    offset: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Number of results to skip',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()
      if (params.count) queryParams.append('count', params.count)
      if (params.offset) queryParams.append('offset', params.offset)

      const query = queryParams.toString()
      const url = buildMailchimpUrl(params.apiKey, `/lists/${params.listId}/interest-categories`)
      return query ? `${url}?${query}` : url
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'get_interest_categories')
    }

    const data = await response.json()
    const categories = data.categories || []

    return {
      success: true,
      output: {
        categories,
        totalItems: data.total_items || categories.length,
        metadata: {
          operation: 'get_interest_categories' as const,
          totalReturned: categories.length,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Interest categories data and metadata',
      properties: {
        categories: { type: 'array', description: 'Array of interest category objects' },
        totalItems: { type: 'number', description: 'Total number of categories' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_interest_category.ts]---
Location: sim-main/apps/sim/tools/mailchimp/get_interest_category.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import type { MailchimpInterestCategory } from './types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpGetInterestCategory')

export interface MailchimpGetInterestCategoryParams {
  apiKey: string
  listId: string
  interestCategoryId: string
}

export interface MailchimpGetInterestCategoryResponse {
  success: boolean
  output: {
    category: MailchimpInterestCategory
    metadata: {
      operation: 'get_interest_category'
      interestCategoryId: string
    }
    success: boolean
  }
}

export const mailchimpGetInterestCategoryTool: ToolConfig<
  MailchimpGetInterestCategoryParams,
  MailchimpGetInterestCategoryResponse
> = {
  id: 'mailchimp_get_interest_category',
  name: 'Get Interest Category from Mailchimp Audience',
  description: 'Retrieve details of a specific interest category from a Mailchimp audience',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Mailchimp API key with server prefix',
    },
    listId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The unique ID for the list',
    },
    interestCategoryId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The unique ID for the interest category',
    },
  },

  request: {
    url: (params) =>
      buildMailchimpUrl(
        params.apiKey,
        `/lists/${params.listId}/interest-categories/${params.interestCategoryId}`
      ),
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'get_interest_category')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        category: data,
        metadata: {
          operation: 'get_interest_category' as const,
          interestCategoryId: data.id,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Interest category data and metadata',
      properties: {
        category: { type: 'object', description: 'Interest category object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_landing_page.ts]---
Location: sim-main/apps/sim/tools/mailchimp/get_landing_page.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import type { MailchimpLandingPage } from './types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpGetLandingPage')

export interface MailchimpGetLandingPageParams {
  apiKey: string
  pageId: string
}

export interface MailchimpGetLandingPageResponse {
  success: boolean
  output: {
    landingPage: MailchimpLandingPage
    metadata: {
      operation: 'get_landing_page'
      pageId: string
    }
    success: boolean
  }
}

export const mailchimpGetLandingPageTool: ToolConfig<
  MailchimpGetLandingPageParams,
  MailchimpGetLandingPageResponse
> = {
  id: 'mailchimp_get_landing_page',
  name: 'Get Landing Page from Mailchimp',
  description: 'Retrieve details of a specific landing page from Mailchimp',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Mailchimp API key with server prefix',
    },
    pageId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The unique ID for the landing page',
    },
  },

  request: {
    url: (params) => buildMailchimpUrl(params.apiKey, `/landing-pages/${params.pageId}`),
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'get_landing_page')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        landingPage: data,
        metadata: {
          operation: 'get_landing_page' as const,
          pageId: data.id,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Landing page data and metadata',
      properties: {
        landingPage: { type: 'object', description: 'Landing page object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_landing_pages.ts]---
Location: sim-main/apps/sim/tools/mailchimp/get_landing_pages.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import type { MailchimpLandingPage } from './types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpGetLandingPages')

export interface MailchimpGetLandingPagesParams {
  apiKey: string
  count?: string
  offset?: string
}

export interface MailchimpGetLandingPagesResponse {
  success: boolean
  output: {
    landingPages: MailchimpLandingPage[]
    totalItems: number
    metadata: {
      operation: 'get_landing_pages'
      totalReturned: number
    }
    success: boolean
  }
}

export const mailchimpGetLandingPagesTool: ToolConfig<
  MailchimpGetLandingPagesParams,
  MailchimpGetLandingPagesResponse
> = {
  id: 'mailchimp_get_landing_pages',
  name: 'Get Landing Pages from Mailchimp',
  description: 'Retrieve a list of landing pages from Mailchimp',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Mailchimp API key with server prefix',
    },
    count: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Number of results (default: 10, max: 1000)',
    },
    offset: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Number of results to skip',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()
      if (params.count) queryParams.append('count', params.count)
      if (params.offset) queryParams.append('offset', params.offset)

      const query = queryParams.toString()
      const url = buildMailchimpUrl(params.apiKey, '/landing-pages')
      return query ? `${url}?${query}` : url
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'get_landing_pages')
    }

    const data = await response.json()
    const landingPages = data.landing_pages || []

    return {
      success: true,
      output: {
        landingPages,
        totalItems: data.total_items || landingPages.length,
        metadata: {
          operation: 'get_landing_pages' as const,
          totalReturned: landingPages.length,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Landing pages data and metadata',
      properties: {
        landingPages: { type: 'array', description: 'Array of landing page objects' },
        totalItems: { type: 'number', description: 'Total number of landing pages' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

````
