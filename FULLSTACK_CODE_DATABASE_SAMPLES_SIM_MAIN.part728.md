---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 728
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 728 of 933)

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

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/pinecone/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

// Base Pinecone params shared across all operations
export interface PineconeBaseParams {
  indexHost: string
  namespace: string
  apiKey: string
}

// Response types
export interface PineconeMatchResponse {
  id: string
  score: number
  values?: number[]
  metadata?: Record<string, any>
}

export interface PineconeResponse extends ToolResponse {
  output: {
    matches?: PineconeMatchResponse[]
    upsertedCount?: number
    data?: Array<{
      values: number[]
      vector_type: 'dense' | 'sparse'
    }>
    model?: string
    vector_type?: 'dense' | 'sparse'
    usage?: {
      total_tokens: number
    }
  }
}

// Generate Embeddings
export interface PineconeGenerateEmbeddingsParams {
  apiKey: string
  model: string
  inputs: { text: string }[]
  parameters?: {
    input_type?: 'passage'
    truncate?: 'END'
  }
}

// Upsert Text
export interface PineconeUpsertTextRecord {
  _id: string
  chunk_text: string
  category?: string
  [key: string]: any
}

export interface PineconeUpsertTextParams extends PineconeBaseParams {
  records: PineconeUpsertTextRecord | PineconeUpsertTextRecord[]
}

// Upsert Vectors
export interface PineconeUpsertVectorsParams extends PineconeBaseParams {
  vectors: {
    id: string
    values: number[]
    metadata?: Record<string, any>
    sparseValues?: {
      indices: number[]
      values: number[]
    }
  }[]
}

// Search Text
export interface PineconeSearchQuery {
  inputs?: { text: string }
  vector?: {
    values: number[]
    sparse_values?: number[]
    sparse_indices?: number[]
  }
  id?: string
  top_k: number
  filter?: Record<string, any>
}

export interface PineconeRerank {
  model: string
  rank_fields: string[]
  top_n?: number
  parameters?: Record<string, any>
  query?: { text: string }
}

export interface PineconeSearchTextParams extends PineconeBaseParams {
  searchQuery: string
  topK?: string
  fields?: string[] | string
  filter?: Record<string, any> | string
  rerank?: PineconeRerank | string
}

export interface PineconeSearchHit {
  _id: string
  _score: number
  fields?: Record<string, any>
}

export interface PineconeSearchResponse {
  result: {
    hits: PineconeSearchHit[]
  }
  usage: {
    read_units: number
    embed_total_tokens?: number
    rerank_units?: number
  }
}

// Fetch Vectors
export interface PineconeFetchParams extends PineconeBaseParams {
  ids: string[]
}

export interface PineconeVector {
  id: string
  values: number[]
  metadata?: Record<string, any>
}

export interface PineconeUsage {
  readUnits: number
}

export interface PineconeFetchResponse {
  vectors: Record<string, PineconeVector>
  namespace?: string
  usage: PineconeUsage
}

export interface PineconeParams {
  apiKey: string
  indexHost: string
  operation: 'query' | 'upsert' | 'delete'
  // Query operation
  queryVector?: number[]
  topK?: number
  includeMetadata?: boolean
  includeValues?: boolean
  // Upsert operation
  vectors?: Array<{
    id: string
    values: number[]
    metadata?: Record<string, any>
  }>
}

// Search Vector
export interface PineconeSearchVectorParams extends PineconeBaseParams {
  vector: number[] | string
  topK?: number | string
  filter?: Record<string, any> | string
  includeValues?: boolean
  includeMetadata?: boolean
}
```

--------------------------------------------------------------------------------

---[FILE: upsert_text.ts]---
Location: sim-main/apps/sim/tools/pinecone/upsert_text.ts

```typescript
import type {
  PineconeResponse,
  PineconeUpsertTextParams,
  PineconeUpsertTextRecord,
} from '@/tools/pinecone/types'
import type { ToolConfig } from '@/tools/types'

export const upsertTextTool: ToolConfig<PineconeUpsertTextParams, PineconeResponse> = {
  id: 'pinecone_upsert_text',
  name: 'Pinecone Upsert Text',
  description: 'Insert or update text records in a Pinecone index',
  version: '1.0',

  params: {
    indexHost: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Full Pinecone index host URL',
    },
    namespace: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Namespace to upsert records into',
    },
    records: {
      type: 'array',
      required: true,
      visibility: 'user-or-llm',
      description:
        'Record or array of records to upsert, each containing _id, text, and optional metadata',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Pinecone API key',
    },
  },

  request: {
    method: 'POST',
    url: (params) => `${params.indexHost}/records/namespaces/${params.namespace}/upsert`,
    headers: (params) => ({
      'Api-Key': params.apiKey,
      'Content-Type': 'application/x-ndjson',
      'X-Pinecone-API-Version': '2025-01',
    }),
    body: (params) => {
      // If records is a string, parse it line by line
      let records: PineconeUpsertTextRecord[]
      if (typeof params.records === 'string') {
        // Split by newlines and parse each line
        records = (params.records as string)
          .split('\n')
          .filter((line: string) => line.trim()) // Remove empty lines
          .map((line: string) => {
            // Clean and parse each line
            const cleanJson = line.trim().replace(/'\\''/g, "'")
            return JSON.parse(cleanJson) as PineconeUpsertTextRecord
          })
      } else {
        records = Array.isArray(params.records) ? params.records : [params.records]
      }

      // Convert to NDJSON format
      const ndjson = records.map((r: PineconeUpsertTextRecord) => JSON.stringify(r)).join('\n')
      return { body: ndjson }
    },
  },

  transformResponse: async (response) => {
    // Handle empty response (201 Created)
    if (response.status === 201) {
      return {
        success: true,
        output: {
          statusText: 'Created',
        },
      }
    }

    // Handle response with content
    const data = await response.json()
    return {
      success: true,
      output: {
        upsertedCount: data.upsertedCount || 0,
      },
    }
  },

  outputs: {
    statusText: {
      type: 'string',
      description: 'Status of the upsert operation',
    },
    upsertedCount: {
      type: 'number',
      description: 'Number of records successfully upserted',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_activity.ts]---
Location: sim-main/apps/sim/tools/pipedrive/create_activity.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  PipedriveCreateActivityParams,
  PipedriveCreateActivityResponse,
} from '@/tools/pipedrive/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('PipedriveCreateActivity')

export const pipedriveCreateActivityTool: ToolConfig<
  PipedriveCreateActivityParams,
  PipedriveCreateActivityResponse
> = {
  id: 'pipedrive_create_activity',
  name: 'Create Activity in Pipedrive',
  description: 'Create a new activity (task) in Pipedrive',
  version: '1.0.0',

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Pipedrive API',
    },
    subject: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The subject/title of the activity',
    },
    type: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Activity type: call, meeting, task, deadline, email, lunch',
    },
    due_date: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Due date in YYYY-MM-DD format',
    },
    due_time: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Due time in HH:MM format',
    },
    duration: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Duration in HH:MM format',
    },
    deal_id: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'ID of the deal to associate with',
    },
    person_id: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'ID of the person to associate with',
    },
    org_id: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'ID of the organization to associate with',
    },
    note: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Notes for the activity',
    },
  },

  request: {
    url: () => 'https://api.pipedrive.com/v1/activities',
    method: 'POST',
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
      const body: Record<string, any> = {
        subject: params.subject,
        type: params.type,
        due_date: params.due_date,
      }

      if (params.due_time) body.due_time = params.due_time
      if (params.duration) body.duration = params.duration
      if (params.deal_id) body.deal_id = Number(params.deal_id)
      if (params.person_id) body.person_id = Number(params.person_id)
      if (params.org_id) body.org_id = Number(params.org_id)
      if (params.note) body.note = params.note

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!data.success) {
      logger.error('Pipedrive API request failed', { data })
      throw new Error(data.error || 'Failed to create activity in Pipedrive')
    }

    return {
      success: true,
      output: {
        activity: data.data,
        metadata: {
          operation: 'create_activity' as const,
        },
        success: true,
      },
    }
  },

  outputs: {
    activity: { type: 'object', description: 'The created activity object' },
    metadata: { type: 'object', description: 'Operation metadata' },
    success: { type: 'boolean', description: 'Operation success status' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_deal.ts]---
Location: sim-main/apps/sim/tools/pipedrive/create_deal.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  PipedriveCreateDealParams,
  PipedriveCreateDealResponse,
} from '@/tools/pipedrive/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('PipedriveCreateDeal')

export const pipedriveCreateDealTool: ToolConfig<
  PipedriveCreateDealParams,
  PipedriveCreateDealResponse
> = {
  id: 'pipedrive_create_deal',
  name: 'Create Deal in Pipedrive',
  description: 'Create a new deal in Pipedrive',
  version: '1.0.0',

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Pipedrive API',
    },
    title: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The title of the deal',
    },
    value: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The monetary value of the deal',
    },
    currency: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Currency code (e.g., USD, EUR)',
    },
    person_id: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'ID of the person this deal is associated with',
    },
    org_id: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'ID of the organization this deal is associated with',
    },
    pipeline_id: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'ID of the pipeline this deal should be placed in',
    },
    stage_id: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'ID of the stage this deal should be placed in',
    },
    status: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Status of the deal: open, won, lost',
    },
    expected_close_date: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Expected close date in YYYY-MM-DD format',
    },
  },

  request: {
    url: () => 'https://api.pipedrive.com/api/v2/deals',
    method: 'POST',
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
      const body: Record<string, any> = {
        title: params.title,
      }

      if (params.value) body.value = Number(params.value)
      if (params.currency) body.currency = params.currency
      if (params.person_id) body.person_id = Number(params.person_id)
      if (params.org_id) body.org_id = Number(params.org_id)
      if (params.pipeline_id) body.pipeline_id = Number(params.pipeline_id)
      if (params.stage_id) body.stage_id = Number(params.stage_id)
      if (params.status) body.status = params.status
      if (params.expected_close_date) body.expected_close_date = params.expected_close_date

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!data.success) {
      logger.error('Pipedrive API request failed', { data })
      throw new Error(data.error || 'Failed to create deal in Pipedrive')
    }

    return {
      success: true,
      output: {
        deal: data.data,
        metadata: {
          operation: 'create_deal' as const,
        },
        success: true,
      },
    }
  },

  outputs: {
    deal: { type: 'object', description: 'The created deal object' },
    metadata: { type: 'object', description: 'Operation metadata' },
    success: { type: 'boolean', description: 'Operation success status' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_lead.ts]---
Location: sim-main/apps/sim/tools/pipedrive/create_lead.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  PipedriveCreateLeadParams,
  PipedriveCreateLeadResponse,
} from '@/tools/pipedrive/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('PipedriveCreateLead')

export const pipedriveCreateLeadTool: ToolConfig<
  PipedriveCreateLeadParams,
  PipedriveCreateLeadResponse
> = {
  id: 'pipedrive_create_lead',
  name: 'Create Lead in Pipedrive',
  description: 'Create a new lead in Pipedrive',
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
    title: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The name of the lead',
    },
    person_id: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'ID of the person (REQUIRED unless organization_id is provided)',
    },
    organization_id: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'ID of the organization (REQUIRED unless person_id is provided)',
    },
    owner_id: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'ID of the user who will own the lead',
    },
    value_amount: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Potential value amount',
    },
    value_currency: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Currency code (e.g., USD, EUR)',
    },
    expected_close_date: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Expected close date in YYYY-MM-DD format',
    },
    visible_to: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Visibility: 1 (Owner & followers), 3 (Entire company)',
    },
  },

  request: {
    url: () => 'https://api.pipedrive.com/v1/leads',
    method: 'POST',
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
      if (!params.person_id && !params.organization_id) {
        throw new Error('Either person_id or organization_id is required to create a lead')
      }

      const body: Record<string, any> = {
        title: params.title,
      }

      if (params.person_id) body.person_id = Number(params.person_id)
      if (params.organization_id) body.organization_id = Number(params.organization_id)
      if (params.owner_id) body.owner_id = Number(params.owner_id)

      // Build value object if both amount and currency are provided
      if (params.value_amount && params.value_currency) {
        body.value = {
          amount: Number(params.value_amount),
          currency: params.value_currency,
        }
      }

      if (params.expected_close_date) body.expected_close_date = params.expected_close_date
      if (params.visible_to) body.visible_to = Number(params.visible_to)

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!data.success) {
      logger.error('Pipedrive API request failed', { data })
      throw new Error(data.error || 'Failed to create lead in Pipedrive')
    }

    return {
      success: true,
      output: {
        lead: data.data,
        metadata: {
          operation: 'create_lead' as const,
        },
        success: true,
      },
    }
  },

  outputs: {
    lead: { type: 'object', description: 'The created lead object' },
    metadata: { type: 'object', description: 'Operation metadata' },
    success: { type: 'boolean', description: 'Operation success status' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_project.ts]---
Location: sim-main/apps/sim/tools/pipedrive/create_project.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  PipedriveCreateProjectParams,
  PipedriveCreateProjectResponse,
} from '@/tools/pipedrive/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('PipedriveCreateProject')

export const pipedriveCreateProjectTool: ToolConfig<
  PipedriveCreateProjectParams,
  PipedriveCreateProjectResponse
> = {
  id: 'pipedrive_create_project',
  name: 'Create Project in Pipedrive',
  description: 'Create a new project in Pipedrive',
  version: '1.0.0',

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Pipedrive API',
    },
    title: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The title of the project',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Description of the project',
    },
    start_date: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Project start date in YYYY-MM-DD format',
    },
    end_date: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Project end date in YYYY-MM-DD format',
    },
  },

  request: {
    url: () => 'https://api.pipedrive.com/v1/projects',
    method: 'POST',
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
      const body: Record<string, any> = {
        title: params.title,
      }

      if (params.description) body.description = params.description
      if (params.start_date) body.start_date = params.start_date
      if (params.end_date) body.end_date = params.end_date

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!data.success) {
      logger.error('Pipedrive API request failed', { data })
      throw new Error(data.error || 'Failed to create project in Pipedrive')
    }

    return {
      success: true,
      output: {
        project: data.data,
        metadata: {
          operation: 'create_project' as const,
        },
        success: true,
      },
    }
  },

  outputs: {
    project: { type: 'object', description: 'The created project object' },
    metadata: { type: 'object', description: 'Operation metadata' },
    success: { type: 'boolean', description: 'Operation success status' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_lead.ts]---
Location: sim-main/apps/sim/tools/pipedrive/delete_lead.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  PipedriveDeleteLeadParams,
  PipedriveDeleteLeadResponse,
} from '@/tools/pipedrive/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('PipedriveDeleteLead')

export const pipedriveDeleteLeadTool: ToolConfig<
  PipedriveDeleteLeadParams,
  PipedriveDeleteLeadResponse
> = {
  id: 'pipedrive_delete_lead',
  name: 'Delete Lead from Pipedrive',
  description: 'Delete a specific lead from Pipedrive',
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
      required: true,
      visibility: 'user-only',
      description: 'The ID of the lead to delete',
    },
  },

  request: {
    url: (params) => `https://api.pipedrive.com/v1/leads/${params.lead_id}`,
    method: 'DELETE',
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
      throw new Error(data.error || 'Failed to delete lead from Pipedrive')
    }

    return {
      success: true,
      output: {
        data: data.data,
        metadata: {
          operation: 'delete_lead' as const,
        },
        success: true,
      },
    }
  },

  outputs: {
    data: { type: 'object', description: 'Deletion confirmation data' },
    metadata: { type: 'object', description: 'Operation metadata' },
    success: { type: 'boolean', description: 'Operation success status' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_activities.ts]---
Location: sim-main/apps/sim/tools/pipedrive/get_activities.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  PipedriveGetActivitiesParams,
  PipedriveGetActivitiesResponse,
} from '@/tools/pipedrive/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('PipedriveGetActivities')

export const pipedriveGetActivitiesTool: ToolConfig<
  PipedriveGetActivitiesParams,
  PipedriveGetActivitiesResponse
> = {
  id: 'pipedrive_get_activities',
  name: 'Get Activities from Pipedrive',
  description: 'Retrieve activities (tasks) from Pipedrive with optional filters',
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
      required: false,
      visibility: 'user-only',
      description: 'Filter activities by deal ID',
    },
    person_id: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Filter activities by person ID',
    },
    org_id: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Filter activities by organization ID',
    },
    type: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Filter by activity type (call, meeting, task, deadline, email, lunch)',
    },
    done: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Filter by completion status: 0 for not done, 1 for done',
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
      const baseUrl = 'https://api.pipedrive.com/v1/activities'
      const queryParams = new URLSearchParams()

      if (params.deal_id) queryParams.append('deal_id', params.deal_id)
      if (params.person_id) queryParams.append('person_id', params.person_id)
      if (params.org_id) queryParams.append('org_id', params.org_id)
      if (params.type) queryParams.append('type', params.type)
      if (params.done) queryParams.append('done', params.done)
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
      throw new Error(data.error || 'Failed to fetch activities from Pipedrive')
    }

    const activities = data.data || []

    return {
      success: true,
      output: {
        activities,
        metadata: {
          operation: 'get_activities' as const,
          totalItems: activities.length,
        },
        success: true,
      },
    }
  },

  outputs: {
    activities: { type: 'array', description: 'Array of activity objects from Pipedrive' },
    metadata: { type: 'object', description: 'Operation metadata' },
    success: { type: 'boolean', description: 'Operation success status' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_all_deals.ts]---
Location: sim-main/apps/sim/tools/pipedrive/get_all_deals.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  PipedriveGetAllDealsParams,
  PipedriveGetAllDealsResponse,
} from '@/tools/pipedrive/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('PipedriveGetAllDeals')

export const pipedriveGetAllDealsTool: ToolConfig<
  PipedriveGetAllDealsParams,
  PipedriveGetAllDealsResponse
> = {
  id: 'pipedrive_get_all_deals',
  name: 'Get All Deals from Pipedrive',
  description: 'Retrieve all deals from Pipedrive with optional filters',
  version: '1.0.0',

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Pipedrive API',
    },
    status: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'Only fetch deals with a specific status. Values: open, won, lost. If omitted, all not deleted deals are returned',
    },
    person_id: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'If supplied, only deals linked to the specified person are returned',
    },
    org_id: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'If supplied, only deals linked to the specified organization are returned',
    },
    pipeline_id: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'If supplied, only deals in the specified pipeline are returned',
    },
    updated_since: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'If set, only deals updated after this time are returned. Format: 2025-01-01T10:20:00Z',
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
      const baseUrl = 'https://api.pipedrive.com/api/v2/deals'
      const queryParams = new URLSearchParams()

      // Add optional parameters to query string if they exist
      if (params.status) queryParams.append('status', params.status)
      if (params.person_id) queryParams.append('person_id', params.person_id)
      if (params.org_id) queryParams.append('org_id', params.org_id)
      if (params.pipeline_id) queryParams.append('pipeline_id', params.pipeline_id)
      if (params.updated_since) queryParams.append('updated_since', params.updated_since)
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

  transformResponse: async (response: Response, params?: PipedriveGetAllDealsParams) => {
    const data = await response.json()

    if (!data.success) {
      logger.error('Pipedrive API request failed', { data })
      throw new Error(data.error || 'Failed to fetch deals from Pipedrive')
    }

    const deals = data.data || []
    const hasMore = data.additional_data?.pagination?.more_items_in_collection || false

    return {
      success: true,
      output: {
        deals,
        metadata: {
          operation: 'get_all_deals' as const,
          totalItems: deals.length,
          hasMore,
        },
        success: true,
      },
    }
  },

  outputs: {
    deals: { type: 'array', description: 'Array of deal objects from Pipedrive' },
    metadata: { type: 'object', description: 'Operation metadata' },
    success: { type: 'boolean', description: 'Operation success status' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_deal.ts]---
Location: sim-main/apps/sim/tools/pipedrive/get_deal.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { PipedriveGetDealParams, PipedriveGetDealResponse } from '@/tools/pipedrive/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('PipedriveGetDeal')

export const pipedriveGetDealTool: ToolConfig<PipedriveGetDealParams, PipedriveGetDealResponse> = {
  id: 'pipedrive_get_deal',
  name: 'Get Deal Details from Pipedrive',
  description: 'Retrieve detailed information about a specific deal',
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
      description: 'The ID of the deal to retrieve',
    },
  },

  request: {
    url: (params) => `https://api.pipedrive.com/api/v2/deals/${params.deal_id}`,
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
      throw new Error(data.error || 'Failed to fetch deal from Pipedrive')
    }

    return {
      success: true,
      output: {
        deal: data.data,
        metadata: {
          operation: 'get_deal' as const,
        },
        success: true,
      },
    }
  },

  outputs: {
    deal: { type: 'object', description: 'Deal object with full details' },
    metadata: { type: 'object', description: 'Operation metadata' },
    success: { type: 'boolean', description: 'Operation success status' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_files.ts]---
Location: sim-main/apps/sim/tools/pipedrive/get_files.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { PipedriveGetFilesParams, PipedriveGetFilesResponse } from '@/tools/pipedrive/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('PipedriveGetFiles')

export const pipedriveGetFilesTool: ToolConfig<PipedriveGetFilesParams, PipedriveGetFilesResponse> =
  {
    id: 'pipedrive_get_files',
    name: 'Get Files from Pipedrive',
    description: 'Retrieve files from Pipedrive with optional filters',
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
        required: false,
        visibility: 'user-only',
        description: 'Filter files by deal ID',
      },
      person_id: {
        type: 'string',
        required: false,
        visibility: 'user-only',
        description: 'Filter files by person ID',
      },
      org_id: {
        type: 'string',
        required: false,
        visibility: 'user-only',
        description: 'Filter files by organization ID',
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
        const baseUrl = 'https://api.pipedrive.com/v1/files'
        const queryParams = new URLSearchParams()

        if (params.deal_id) queryParams.append('deal_id', params.deal_id)
        if (params.person_id) queryParams.append('person_id', params.person_id)
        if (params.org_id) queryParams.append('org_id', params.org_id)
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
        throw new Error(data.error || 'Failed to fetch files from Pipedrive')
      }

      const files = data.data || []

      return {
        success: true,
        output: {
          files,
          metadata: {
            operation: 'get_files' as const,
            totalItems: files.length,
          },
          success: true,
        },
      }
    },

    outputs: {
      files: { type: 'array', description: 'Array of file objects from Pipedrive' },
      metadata: { type: 'object', description: 'Operation metadata' },
      success: { type: 'boolean', description: 'Operation success status' },
    },
  }
```

--------------------------------------------------------------------------------

````
