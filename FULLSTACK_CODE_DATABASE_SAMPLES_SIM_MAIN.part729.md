---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 729
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 729 of 933)

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
Location: sim-main/apps/sim/tools/pipedrive/get_leads.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { PipedriveGetLeadsParams, PipedriveGetLeadsResponse } from '@/tools/pipedrive/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('PipedriveGetLeads')

export const pipedriveGetLeadsTool: ToolConfig<PipedriveGetLeadsParams, PipedriveGetLeadsResponse> =
  {
    id: 'pipedrive_get_leads',
    name: 'Get Leads from Pipedrive',
    description: 'Retrieve all leads or a specific lead from Pipedrive',
    version: '1.0.0',

    oauth: {
      required: true,
      provider: 'pipedrive',
    },

    params: {
      accessToken: {
        type: 'string',
        required: true,
        visibility: 'hidden',
        description: 'The access token for the Pipedrive API',
      },
      lead_id: {
        type: 'string',
        required: false,
        visibility: 'user-only',
        description: 'Optional: ID of a specific lead to retrieve',
      },
      archived: {
        type: 'string',
        required: false,
        visibility: 'user-only',
        description: 'Get archived leads instead of active ones',
      },
      owner_id: {
        type: 'string',
        required: false,
        visibility: 'user-only',
        description: 'Filter by owner user ID',
      },
      person_id: {
        type: 'string',
        required: false,
        visibility: 'user-only',
        description: 'Filter by person ID',
      },
      organization_id: {
        type: 'string',
        required: false,
        visibility: 'user-only',
        description: 'Filter by organization ID',
      },
      limit: {
        type: 'string',
        required: false,
        visibility: 'user-only',
        description: 'Number of results to return (default: 100, max: 500)',
      },
    },

    request: {
      url: (params) => {
        // If lead_id is provided, get specific lead
        if (params.lead_id) {
          return `https://api.pipedrive.com/v1/leads/${params.lead_id}`
        }

        // Get archived or active leads with optional filters
        const baseUrl =
          params.archived === 'true'
            ? 'https://api.pipedrive.com/v1/leads/archived'
            : 'https://api.pipedrive.com/v1/leads'

        const queryParams = new URLSearchParams()

        if (params.owner_id) queryParams.append('owner_id', params.owner_id)
        if (params.person_id) queryParams.append('person_id', params.person_id)
        if (params.organization_id) queryParams.append('organization_id', params.organization_id)
        if (params.limit) queryParams.append('limit', params.limit)

        const queryString = queryParams.toString()
        return queryString ? `${baseUrl}?${queryString}` : baseUrl
      },
      method: 'GET',
      headers: (params) => {
        if (!params.accessToken) {
          throw new Error('Access token is required')
        }

        return {
          Authorization: `Bearer ${params.accessToken}`,
          Accept: 'application/json',
        }
      },
    },

    transformResponse: async (response: Response, params) => {
      const data = await response.json()

      if (!data.success) {
        logger.error('Pipedrive API request failed', { data })
        throw new Error(data.error || 'Failed to fetch lead(s) from Pipedrive')
      }

      // If lead_id was provided, return single lead
      if (params?.lead_id) {
        return {
          success: true,
          output: {
            lead: data.data,
            metadata: {
              operation: 'get_leads' as const,
            },
            success: true,
          },
        }
      }

      // Otherwise, return list of leads
      const leads = data.data || []

      return {
        success: true,
        output: {
          leads,
          metadata: {
            operation: 'get_leads' as const,
            totalItems: leads.length,
          },
          success: true,
        },
      }
    },

    outputs: {
      leads: { type: 'array', description: 'Array of lead objects (when listing all)' },
      lead: { type: 'object', description: 'Single lead object (when lead_id is provided)' },
      metadata: { type: 'object', description: 'Operation metadata' },
      success: { type: 'boolean', description: 'Operation success status' },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: get_mail_messages.ts]---
Location: sim-main/apps/sim/tools/pipedrive/get_mail_messages.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  PipedriveGetMailMessagesParams,
  PipedriveGetMailMessagesResponse,
} from '@/tools/pipedrive/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('PipedriveGetMailMessages')

export const pipedriveGetMailMessagesTool: ToolConfig<
  PipedriveGetMailMessagesParams,
  PipedriveGetMailMessagesResponse
> = {
  id: 'pipedrive_get_mail_messages',
  name: 'Get Mail Threads from Pipedrive',
  description: 'Retrieve mail threads from Pipedrive mailbox',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'pipedrive',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Pipedrive API',
    },
    folder: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Filter by folder: inbox, drafts, sent, archive (default: inbox)',
    },
    limit: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Number of results to return (default: 50)',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = 'https://api.pipedrive.com/v1/mailbox/mailThreads'
      const queryParams = new URLSearchParams()

      if (params.folder) queryParams.append('folder', params.folder)
      if (params.limit) queryParams.append('limit', params.limit)

      const queryString = queryParams.toString()
      return queryString ? `${baseUrl}?${queryString}` : baseUrl
    },
    method: 'GET',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
        Accept: 'application/json',
      }
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!data.success) {
      logger.error('Pipedrive API request failed', { data })
      throw new Error(data.error || 'Failed to fetch mail threads from Pipedrive')
    }

    const threads = data.data || []

    return {
      success: true,
      output: {
        messages: threads,
        metadata: {
          operation: 'get_mail_messages' as const,
          totalItems: threads.length,
        },
        success: true,
      },
    }
  },

  outputs: {
    messages: { type: 'array', description: 'Array of mail thread objects from Pipedrive mailbox' },
    metadata: { type: 'object', description: 'Operation metadata' },
    success: { type: 'boolean', description: 'Operation success status' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_mail_thread.ts]---
Location: sim-main/apps/sim/tools/pipedrive/get_mail_thread.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  PipedriveGetMailThreadParams,
  PipedriveGetMailThreadResponse,
} from '@/tools/pipedrive/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('PipedriveGetMailThread')

export const pipedriveGetMailThreadTool: ToolConfig<
  PipedriveGetMailThreadParams,
  PipedriveGetMailThreadResponse
> = {
  id: 'pipedrive_get_mail_thread',
  name: 'Get Mail Thread Messages from Pipedrive',
  description: 'Retrieve all messages from a specific mail thread',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'pipedrive',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Pipedrive API',
    },
    thread_id: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the mail thread',
    },
  },

  request: {
    url: (params) =>
      `https://api.pipedrive.com/v1/mailbox/mailThreads/${params.thread_id}/mailMessages`,
    method: 'GET',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
        Accept: 'application/json',
      }
    },
  },

  transformResponse: async (response: Response, params) => {
    const data = await response.json()

    if (!data.success) {
      logger.error('Pipedrive API request failed', { data })
      throw new Error(data.error || 'Failed to fetch mail thread from Pipedrive')
    }

    const messages = data.data || []

    return {
      success: true,
      output: {
        messages,
        metadata: {
          operation: 'get_mail_thread' as const,
          threadId: params?.thread_id || '',
          totalItems: messages.length,
        },
        success: true,
      },
    }
  },

  outputs: {
    messages: { type: 'array', description: 'Array of mail message objects from the thread' },
    metadata: { type: 'object', description: 'Operation metadata including thread ID' },
    success: { type: 'boolean', description: 'Operation success status' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_pipelines.ts]---
Location: sim-main/apps/sim/tools/pipedrive/get_pipelines.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  PipedriveGetPipelinesParams,
  PipedriveGetPipelinesResponse,
} from '@/tools/pipedrive/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('PipedriveGetPipelines')

export const pipedriveGetPipelinesTool: ToolConfig<
  PipedriveGetPipelinesParams,
  PipedriveGetPipelinesResponse
> = {
  id: 'pipedrive_get_pipelines',
  name: 'Get Pipelines from Pipedrive',
  description: 'Retrieve all pipelines from Pipedrive',
  version: '1.0.0',

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Pipedrive API',
    },
    sort_by: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Field to sort by: id, update_time, add_time (default: id)',
    },
    sort_direction: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Sorting direction: asc, desc (default: asc)',
    },
    limit: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Number of results to return (default: 100, max: 500)',
    },
    cursor: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'For pagination, the marker representing the first item on the next page',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = 'https://api.pipedrive.com/v1/pipelines'
      const queryParams = new URLSearchParams()

      if (params.sort_by) queryParams.append('sort_by', params.sort_by)
      if (params.sort_direction) queryParams.append('sort_direction', params.sort_direction)
      if (params.limit) queryParams.append('limit', params.limit)
      if (params.cursor) queryParams.append('cursor', params.cursor)

      const queryString = queryParams.toString()
      return queryString ? `${baseUrl}?${queryString}` : baseUrl
    },
    method: 'GET',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
        Accept: 'application/json',
      }
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!data.success) {
      logger.error('Pipedrive API request failed', { data })
      throw new Error(data.error || 'Failed to fetch pipelines from Pipedrive')
    }

    const pipelines = data.data || []

    return {
      success: true,
      output: {
        pipelines,
        metadata: {
          operation: 'get_pipelines' as const,
          totalItems: pipelines.length,
        },
        success: true,
      },
    }
  },

  outputs: {
    pipelines: { type: 'array', description: 'Array of pipeline objects from Pipedrive' },
    metadata: { type: 'object', description: 'Operation metadata' },
    success: { type: 'boolean', description: 'Operation success status' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_pipeline_deals.ts]---
Location: sim-main/apps/sim/tools/pipedrive/get_pipeline_deals.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  PipedriveGetPipelineDealsParams,
  PipedriveGetPipelineDealsResponse,
} from '@/tools/pipedrive/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('PipedriveGetPipelineDeals')

export const pipedriveGetPipelineDealsTool: ToolConfig<
  PipedriveGetPipelineDealsParams,
  PipedriveGetPipelineDealsResponse
> = {
  id: 'pipedrive_get_pipeline_deals',
  name: 'Get Pipeline Deals from Pipedrive',
  description: 'Retrieve all deals in a specific pipeline',
  version: '1.0.0',

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Pipedrive API',
    },
    pipeline_id: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the pipeline',
    },
    stage_id: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Filter by specific stage within the pipeline',
    },
    status: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Filter by deal status: open, won, lost',
    },
    limit: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Number of results to return (default: 100, max: 500)',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = `https://api.pipedrive.com/v1/pipelines/${params.pipeline_id}/deals`
      const queryParams = new URLSearchParams()

      if (params.stage_id) queryParams.append('stage_id', params.stage_id)
      if (params.status) queryParams.append('status', params.status)
      if (params.limit) queryParams.append('limit', params.limit)

      const queryString = queryParams.toString()
      return queryString ? `${baseUrl}?${queryString}` : baseUrl
    },
    method: 'GET',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
        Accept: 'application/json',
      }
    },
  },

  transformResponse: async (response: Response, params) => {
    const data = await response.json()

    if (!data.success) {
      logger.error('Pipedrive API request failed', { data })
      throw new Error(data.error || 'Failed to fetch pipeline deals from Pipedrive')
    }

    const deals = data.data || []

    return {
      success: true,
      output: {
        deals,
        metadata: {
          operation: 'get_pipeline_deals' as const,
          pipelineId: params?.pipeline_id || '',
          totalItems: deals.length,
        },
        success: true,
      },
    }
  },

  outputs: {
    deals: { type: 'array', description: 'Array of deal objects from the pipeline' },
    metadata: { type: 'object', description: 'Operation metadata including pipeline ID' },
    success: { type: 'boolean', description: 'Operation success status' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_projects.ts]---
Location: sim-main/apps/sim/tools/pipedrive/get_projects.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  PipedriveGetProjectsParams,
  PipedriveGetProjectsResponse,
} from '@/tools/pipedrive/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('PipedriveGetProjects')

export const pipedriveGetProjectsTool: ToolConfig<
  PipedriveGetProjectsParams,
  PipedriveGetProjectsResponse
> = {
  id: 'pipedrive_get_projects',
  name: 'Get Projects from Pipedrive',
  description: 'Retrieve all projects or a specific project from Pipedrive',
  version: '1.0.0',

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Pipedrive API',
    },
    project_id: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Optional: ID of a specific project to retrieve',
    },
    status: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Filter by project status: open, completed, deleted (only for listing all)',
    },
    limit: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Number of results to return (default: 100, max: 500, only for listing all)',
    },
  },

  request: {
    url: (params) => {
      // If project_id is provided, get specific project
      if (params.project_id) {
        return `https://api.pipedrive.com/v1/projects/${params.project_id}`
      }

      // Otherwise, get all projects with optional filters
      const baseUrl = 'https://api.pipedrive.com/v1/projects'
      const queryParams = new URLSearchParams()

      if (params.status) queryParams.append('status', params.status)
      if (params.limit) queryParams.append('limit', params.limit)

      const queryString = queryParams.toString()
      return queryString ? `${baseUrl}?${queryString}` : baseUrl
    },
    method: 'GET',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
        Accept: 'application/json',
      }
    },
  },

  transformResponse: async (response: Response, params) => {
    const data = await response.json()

    if (!data.success) {
      logger.error('Pipedrive API request failed', { data })
      throw new Error(data.error || 'Failed to fetch project(s) from Pipedrive')
    }

    // If project_id was provided, return single project
    if (params?.project_id) {
      return {
        success: true,
        output: {
          project: data.data,
          metadata: {
            operation: 'get_projects' as const,
          },
          success: true,
        },
      }
    }

    // Otherwise, return list of projects
    const projects = data.data || []

    return {
      success: true,
      output: {
        projects,
        metadata: {
          operation: 'get_projects' as const,
          totalItems: projects.length,
        },
        success: true,
      },
    }
  },

  outputs: {
    projects: { type: 'array', description: 'Array of project objects (when listing all)' },
    project: { type: 'object', description: 'Single project object (when project_id is provided)' },
    metadata: { type: 'object', description: 'Operation metadata' },
    success: { type: 'boolean', description: 'Operation success status' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/pipedrive/index.ts

```typescript
// Deal operations

export { pipedriveCreateActivityTool } from '@/tools/pipedrive/create_activity'
export { pipedriveCreateDealTool } from '@/tools/pipedrive/create_deal'
export { pipedriveCreateLeadTool } from '@/tools/pipedrive/create_lead'
export { pipedriveCreateProjectTool } from '@/tools/pipedrive/create_project'
export { pipedriveDeleteLeadTool } from '@/tools/pipedrive/delete_lead'
// Activity operations
export { pipedriveGetActivitiesTool } from '@/tools/pipedrive/get_activities'
export { pipedriveGetAllDealsTool } from '@/tools/pipedrive/get_all_deals'
export { pipedriveGetDealTool } from '@/tools/pipedrive/get_deal'
// File operations
export { pipedriveGetFilesTool } from '@/tools/pipedrive/get_files'
// Lead operations
export { pipedriveGetLeadsTool } from '@/tools/pipedrive/get_leads'
// Mail operations
export { pipedriveGetMailMessagesTool } from '@/tools/pipedrive/get_mail_messages'
export { pipedriveGetMailThreadTool } from '@/tools/pipedrive/get_mail_thread'
export { pipedriveGetPipelineDealsTool } from '@/tools/pipedrive/get_pipeline_deals'
// Pipeline operations
export { pipedriveGetPipelinesTool } from '@/tools/pipedrive/get_pipelines'
// Project operations
export { pipedriveGetProjectsTool } from '@/tools/pipedrive/get_projects'
export { pipedriveUpdateActivityTool } from '@/tools/pipedrive/update_activity'
export { pipedriveUpdateDealTool } from '@/tools/pipedrive/update_deal'
export { pipedriveUpdateLeadTool } from '@/tools/pipedrive/update_lead'
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/pipedrive/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

// Common Pipedrive types
export interface PipedriveLead {
  id: string
  title: string
  person_id?: number
  organization_id?: number
  owner_id: number
  value?: {
    amount: number
    currency: string
  }
  expected_close_date?: string
  is_archived: boolean
  was_seen: boolean
  add_time: string
  update_time: string
}

export interface PipedriveDeal {
  id: number
  title: string
  value: number
  currency: string
  status: string
  stage_id: number
  pipeline_id: number
  person_id?: number
  org_id?: number
  owner_id: number
  add_time: string
  update_time: string
  won_time?: string
  lost_time?: string
  close_time?: string
  expected_close_date?: string
}

export interface PipedriveActivity {
  id: number
  subject: string
  type: string
  due_date: string
  due_time: string
  duration: string
  deal_id?: number
  person_id?: number
  org_id?: number
  done: boolean
  note: string
  add_time: string
  update_time: string
}

export interface PipedriveFile {
  id: number
  name: string
  file_type: string
  file_size: number
  add_time: string
  update_time: string
  deal_id?: number
  person_id?: number
  org_id?: number
  url: string
}

export interface PipedrivePipeline {
  id: number
  name: string
  url_title: string
  order_nr: number
  active: boolean
  deal_probability: boolean
  add_time: string
  update_time: string
}

export interface PipedriveProject {
  id: number
  title: string
  description?: string
  status: string
  owner_id: number
  start_date?: string
  end_date?: string
  add_time: string
  update_time: string
}

export interface PipedriveMailMessage {
  id: number
  subject: string
  snippet: string
  mail_thread_id: number
  from_address: string
  to_addresses: string[]
  cc_addresses?: string[]
  bcc_addresses?: string[]
  timestamp: string
  item_type: string
  deal_id?: number
  person_id?: number
  org_id?: number
}

// GET All Deals
export interface PipedriveGetAllDealsParams {
  accessToken: string
  status?: string
  person_id?: string
  org_id?: string
  pipeline_id?: string
  updated_since?: string
  limit?: string
}

export interface PipedriveGetAllDealsOutput {
  deals: PipedriveDeal[]
  metadata: {
    operation: 'get_all_deals'
    totalItems: number
    hasMore: boolean
  }
  success: boolean
}

export interface PipedriveGetAllDealsResponse extends ToolResponse {
  output: PipedriveGetAllDealsOutput
}

// GET Deal
export interface PipedriveGetDealParams {
  accessToken: string
  deal_id: string
}

export interface PipedriveGetDealOutput {
  deal: PipedriveDeal
  metadata: {
    operation: 'get_deal'
  }
  success: boolean
}

export interface PipedriveGetDealResponse extends ToolResponse {
  output: PipedriveGetDealOutput
}

// CREATE Deal
export interface PipedriveCreateDealParams {
  accessToken: string
  title: string
  value?: string
  currency?: string
  person_id?: string
  org_id?: string
  pipeline_id?: string
  stage_id?: string
  status?: string
  expected_close_date?: string
}

export interface PipedriveCreateDealOutput {
  deal: PipedriveDeal
  metadata: {
    operation: 'create_deal'
  }
  success: boolean
}

export interface PipedriveCreateDealResponse extends ToolResponse {
  output: PipedriveCreateDealOutput
}

// UPDATE Deal
export interface PipedriveUpdateDealParams {
  accessToken: string
  deal_id: string
  title?: string
  value?: string
  status?: string
  stage_id?: string
  expected_close_date?: string
}

export interface PipedriveUpdateDealOutput {
  deal: PipedriveDeal
  metadata: {
    operation: 'update_deal'
  }
  success: boolean
}

export interface PipedriveUpdateDealResponse extends ToolResponse {
  output: PipedriveUpdateDealOutput
}

// GET Files
export interface PipedriveGetFilesParams {
  accessToken: string
  deal_id?: string
  person_id?: string
  org_id?: string
  limit?: string
}

export interface PipedriveGetFilesOutput {
  files: PipedriveFile[]
  metadata: {
    operation: 'get_files'
    totalItems: number
  }
  success: boolean
}

export interface PipedriveGetFilesResponse extends ToolResponse {
  output: PipedriveGetFilesOutput
}

export interface PipedriveGetMailMessagesParams {
  accessToken: string
  folder?: string
  limit?: string
}

export interface PipedriveGetMailMessagesOutput {
  messages: PipedriveMailMessage[]
  metadata: {
    operation: 'get_mail_messages'
    totalItems: number
  }
  success: boolean
}

export interface PipedriveGetMailMessagesResponse extends ToolResponse {
  output: PipedriveGetMailMessagesOutput
}

// GET Mail Thread
export interface PipedriveGetMailThreadParams {
  accessToken: string
  thread_id: string
}

export interface PipedriveGetMailThreadOutput {
  messages: PipedriveMailMessage[]
  metadata: {
    operation: 'get_mail_thread'
    threadId: string
    totalItems: number
  }
  success: boolean
}

export interface PipedriveGetMailThreadResponse extends ToolResponse {
  output: PipedriveGetMailThreadOutput
}

// GET All Pipelines
export interface PipedriveGetPipelinesParams {
  accessToken: string
  sort_by?: string
  sort_direction?: string
  limit?: string
  cursor?: string
}

export interface PipedriveGetPipelinesOutput {
  pipelines: PipedrivePipeline[]
  metadata: {
    operation: 'get_pipelines'
    totalItems: number
  }
  success: boolean
}

export interface PipedriveGetPipelinesResponse extends ToolResponse {
  output: PipedriveGetPipelinesOutput
}

// GET Pipeline Deals
export interface PipedriveGetPipelineDealsParams {
  accessToken: string
  pipeline_id: string
  stage_id?: string
  status?: string
  limit?: string
}

export interface PipedriveGetPipelineDealsOutput {
  deals: PipedriveDeal[]
  metadata: {
    operation: 'get_pipeline_deals'
    pipelineId: string
    totalItems: number
  }
  success: boolean
}

export interface PipedriveGetPipelineDealsResponse extends ToolResponse {
  output: PipedriveGetPipelineDealsOutput
}

// GET All Projects (or single project if project_id provided)
export interface PipedriveGetProjectsParams {
  accessToken: string
  project_id?: string
  status?: string
  limit?: string
}

export interface PipedriveGetProjectsOutput {
  projects?: PipedriveProject[]
  project?: PipedriveProject
  metadata: {
    operation: 'get_projects'
    totalItems?: number
  }
  success: boolean
}

export interface PipedriveGetProjectsResponse extends ToolResponse {
  output: PipedriveGetProjectsOutput
}

// CREATE Project
export interface PipedriveCreateProjectParams {
  accessToken: string
  title: string
  description?: string
  start_date?: string
  end_date?: string
}

export interface PipedriveCreateProjectOutput {
  project: PipedriveProject
  metadata: {
    operation: 'create_project'
  }
  success: boolean
}

export interface PipedriveCreateProjectResponse extends ToolResponse {
  output: PipedriveCreateProjectOutput
}

// GET All Activities
export interface PipedriveGetActivitiesParams {
  accessToken: string
  deal_id?: string
  person_id?: string
  org_id?: string
  type?: string
  done?: string
  limit?: string
}

export interface PipedriveGetActivitiesOutput {
  activities: PipedriveActivity[]
  metadata: {
    operation: 'get_activities'
    totalItems: number
  }
  success: boolean
}

export interface PipedriveGetActivitiesResponse extends ToolResponse {
  output: PipedriveGetActivitiesOutput
}

// CREATE Activity
export interface PipedriveCreateActivityParams {
  accessToken: string
  subject: string
  type: string
  due_date: string
  due_time?: string
  duration?: string
  deal_id?: string
  person_id?: string
  org_id?: string
  note?: string
}

export interface PipedriveCreateActivityOutput {
  activity: PipedriveActivity
  metadata: {
    operation: 'create_activity'
  }
  success: boolean
}

export interface PipedriveCreateActivityResponse extends ToolResponse {
  output: PipedriveCreateActivityOutput
}

// UPDATE Activity
export interface PipedriveUpdateActivityParams {
  accessToken: string
  activity_id: string
  subject?: string
  due_date?: string
  due_time?: string
  duration?: string
  done?: string
  note?: string
}

export interface PipedriveUpdateActivityOutput {
  activity: PipedriveActivity
  metadata: {
    operation: 'update_activity'
  }
  success: boolean
}

export interface PipedriveUpdateActivityResponse extends ToolResponse {
  output: PipedriveUpdateActivityOutput
}

// GET Leads
export interface PipedriveGetLeadsParams {
  accessToken: string
  lead_id?: string
  archived?: string
  owner_id?: string
  person_id?: string
  organization_id?: string
  limit?: string
}

export interface PipedriveGetLeadsOutput {
  leads?: PipedriveLead[]
  lead?: PipedriveLead
  metadata: {
    operation: 'get_leads'
    totalItems?: number
  }
  success: boolean
}

export interface PipedriveGetLeadsResponse extends ToolResponse {
  output: PipedriveGetLeadsOutput
}

// CREATE Lead
export interface PipedriveCreateLeadParams {
  accessToken: string
  title: string
  person_id?: string
  organization_id?: string
  owner_id?: string
  value_amount?: string
  value_currency?: string
  expected_close_date?: string
  visible_to?: string
}

export interface PipedriveCreateLeadOutput {
  lead: PipedriveLead
  metadata: {
    operation: 'create_lead'
  }
  success: boolean
}

export interface PipedriveCreateLeadResponse extends ToolResponse {
  output: PipedriveCreateLeadOutput
}

// UPDATE Lead
export interface PipedriveUpdateLeadParams {
  accessToken: string
  lead_id: string
  title?: string
  person_id?: string
  organization_id?: string
  owner_id?: string
  value_amount?: string
  value_currency?: string
  expected_close_date?: string
  is_archived?: string
}

export interface PipedriveUpdateLeadOutput {
  lead: PipedriveLead
  metadata: {
    operation: 'update_lead'
  }
  success: boolean
}

export interface PipedriveUpdateLeadResponse extends ToolResponse {
  output: PipedriveUpdateLeadOutput
}

// DELETE Lead
export interface PipedriveDeleteLeadParams {
  accessToken: string
  lead_id: string
}

export interface PipedriveDeleteLeadOutput {
  data: any
  metadata: {
    operation: 'delete_lead'
  }
  success: boolean
}

export interface PipedriveDeleteLeadResponse extends ToolResponse {
  output: PipedriveDeleteLeadOutput
}

// Union type of all responses
export type PipedriveResponse =
  | PipedriveGetAllDealsResponse
  | PipedriveGetDealResponse
  | PipedriveCreateDealResponse
  | PipedriveUpdateDealResponse
  | PipedriveGetFilesResponse
  | PipedriveGetMailMessagesResponse
  | PipedriveGetMailThreadResponse
  | PipedriveGetPipelinesResponse
  | PipedriveGetPipelineDealsResponse
  | PipedriveGetProjectsResponse
  | PipedriveCreateProjectResponse
  | PipedriveGetActivitiesResponse
  | PipedriveCreateActivityResponse
  | PipedriveUpdateActivityResponse
  | PipedriveGetLeadsResponse
  | PipedriveCreateLeadResponse
  | PipedriveUpdateLeadResponse
  | PipedriveDeleteLeadResponse
```

--------------------------------------------------------------------------------

---[FILE: update_activity.ts]---
Location: sim-main/apps/sim/tools/pipedrive/update_activity.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  PipedriveUpdateActivityParams,
  PipedriveUpdateActivityResponse,
} from '@/tools/pipedrive/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('PipedriveUpdateActivity')

export const pipedriveUpdateActivityTool: ToolConfig<
  PipedriveUpdateActivityParams,
  PipedriveUpdateActivityResponse
> = {
  id: 'pipedrive_update_activity',
  name: 'Update Activity in Pipedrive',
  description: 'Update an existing activity (task) in Pipedrive',
  version: '1.0.0',

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Pipedrive API',
    },
    activity_id: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the activity to update',
    },
    subject: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'New subject/title for the activity',
    },
    due_date: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'New due date in YYYY-MM-DD format',
    },
    due_time: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'New due time in HH:MM format',
    },
    duration: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'New duration in HH:MM format',
    },
    done: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Mark as done: 0 for not done, 1 for done',
    },
    note: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'New notes for the activity',
    },
  },

  request: {
    url: (params) => `https://api.pipedrive.com/v1/activities/${params.activity_id}`,
    method: 'PUT',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    },
    body: (params) => {
      const body: Record<string, any> = {}

      if (params.subject) body.subject = params.subject
      if (params.due_date) body.due_date = params.due_date
      if (params.due_time) body.due_time = params.due_time
      if (params.duration) body.duration = params.duration
      if (params.done !== undefined) body.done = params.done === '1' ? 1 : 0
      if (params.note) body.note = params.note

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!data.success) {
      logger.error('Pipedrive API request failed', { data })
      throw new Error(data.error || 'Failed to update activity in Pipedrive')
    }

    return {
      success: true,
      output: {
        activity: data.data,
        metadata: {
          operation: 'update_activity' as const,
        },
        success: true,
      },
    }
  },

  outputs: {
    activity: { type: 'object', description: 'The updated activity object' },
    metadata: { type: 'object', description: 'Operation metadata' },
    success: { type: 'boolean', description: 'Operation success status' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_deal.ts]---
Location: sim-main/apps/sim/tools/pipedrive/update_deal.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  PipedriveUpdateDealParams,
  PipedriveUpdateDealResponse,
} from '@/tools/pipedrive/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('PipedriveUpdateDeal')

export const pipedriveUpdateDealTool: ToolConfig<
  PipedriveUpdateDealParams,
  PipedriveUpdateDealResponse
> = {
  id: 'pipedrive_update_deal',
  name: 'Update Deal in Pipedrive',
  description: 'Update an existing deal in Pipedrive',
  version: '1.0.0',

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Pipedrive API',
    },
    deal_id: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the deal to update',
    },
    title: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'New title for the deal',
    },
    value: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'New monetary value for the deal',
    },
    status: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'New status: open, won, lost',
    },
    stage_id: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'New stage ID for the deal',
    },
    expected_close_date: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'New expected close date in YYYY-MM-DD format',
    },
  },

  request: {
    url: (params) => `https://api.pipedrive.com/api/v2/deals/${params.deal_id}`,
    method: 'PATCH',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    },
    body: (params) => {
      const body: Record<string, any> = {}

      if (params.title) body.title = params.title
      if (params.value) body.value = Number(params.value)
      if (params.status) body.status = params.status
      if (params.stage_id) body.stage_id = Number(params.stage_id)
      if (params.expected_close_date) body.expected_close_date = params.expected_close_date

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!data.success) {
      logger.error('Pipedrive API request failed', { data })
      throw new Error(data.error || 'Failed to update deal in Pipedrive')
    }

    return {
      success: true,
      output: {
        deal: data.data,
        metadata: {
          operation: 'update_deal' as const,
        },
        success: true,
      },
    }
  },

  outputs: {
    deal: { type: 'object', description: 'The updated deal object' },
    metadata: { type: 'object', description: 'Operation metadata' },
    success: { type: 'boolean', description: 'Operation success status' },
  },
}
```

--------------------------------------------------------------------------------

````
