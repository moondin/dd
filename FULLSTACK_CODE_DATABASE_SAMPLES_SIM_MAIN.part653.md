---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 653
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 653 of 933)

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

---[FILE: list_records.ts]---
Location: sim-main/apps/sim/tools/airtable/list_records.ts

```typescript
import type { AirtableListParams, AirtableListResponse } from '@/tools/airtable/types'
import type { ToolConfig } from '@/tools/types'

export const airtableListRecordsTool: ToolConfig<AirtableListParams, AirtableListResponse> = {
  id: 'airtable_list_records',
  name: 'Airtable List Records',
  description: 'Read records from an Airtable table',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'airtable',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token',
    },
    baseId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ID of the Airtable base',
    },
    tableId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ID of the table',
    },
    maxRecords: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Maximum number of records to return',
    },
    filterFormula: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Formula to filter records (e.g., "({Field Name} = \'Value\')")',
    },
  },

  request: {
    url: (params) => {
      const url = `https://api.airtable.com/v0/${params.baseId}/${params.tableId}`
      const queryParams = new URLSearchParams()
      if (params.maxRecords) queryParams.append('maxRecords', Number(params.maxRecords).toString())
      if (params.filterFormula) {
        // Airtable formulas often contain characters needing encoding,
        // but standard encodeURIComponent might over-encode.
        // Simple replacement for single quotes is often sufficient.
        // More complex formulas might need careful encoding.
        const encodedFormula = params.filterFormula.replace(/'/g, "'")
        queryParams.append('filterByFormula', encodedFormula)
      }
      const queryString = queryParams.toString()
      const finalUrl = queryString ? `${url}?${queryString}` : url
      return finalUrl
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        records: data.records || [],
        metadata: {
          offset: data.offset,
          totalRecords: (data.records || []).length,
        },
      },
    }
  },

  outputs: {
    records: {
      type: 'json',
      description: 'Array of retrieved Airtable records',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          createdTime: { type: 'string' },
          fields: { type: 'object' },
        },
      },
    },
    metadata: {
      type: 'json',
      description: 'Operation metadata including pagination offset and total records count',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/airtable/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

// Common types
export interface AirtableRecord {
  id: string
  createdTime: string
  fields: Record<string, any>
}

interface AirtableBaseParams {
  accessToken: string
  baseId: string
  tableId: string
}

// List Records Types
export interface AirtableListParams extends AirtableBaseParams {
  maxRecords?: number
  filterFormula?: string
}

export interface AirtableListResponse extends ToolResponse {
  output: {
    records: AirtableRecord[]
    metadata: {
      offset?: string
      totalRecords: number
    }
  }
}

// Get Record Types
export interface AirtableGetParams extends AirtableBaseParams {
  recordId: string
}

export interface AirtableGetResponse extends ToolResponse {
  output: {
    record: AirtableRecord
    metadata: {
      recordCount: 1
    }
  }
}

// Create Records Types
export interface AirtableCreateParams extends AirtableBaseParams {
  records: Array<{ fields: Record<string, any> }>
}

export interface AirtableCreateResponse extends ToolResponse {
  output: {
    records: AirtableRecord[]
    metadata: {
      recordCount: number
    }
  }
}

// Update Record Types (Single)
export interface AirtableUpdateParams extends AirtableBaseParams {
  recordId: string
  fields: Record<string, any>
}

export interface AirtableUpdateResponse extends ToolResponse {
  output: {
    record: AirtableRecord // Airtable returns the single updated record
    metadata: {
      recordCount: 1
      updatedFields: string[]
    }
  }
}

// Update Multiple Records Types
export interface AirtableUpdateMultipleParams extends AirtableBaseParams {
  records: Array<{ id: string; fields: Record<string, any> }>
}

export interface AirtableUpdateMultipleResponse extends ToolResponse {
  output: {
    records: AirtableRecord[] // Airtable returns the array of updated records
    metadata: {
      recordCount: number
      updatedRecordIds: string[]
    }
  }
}

export type AirtableResponse =
  | AirtableListResponse
  | AirtableGetResponse
  | AirtableCreateResponse
  | AirtableUpdateResponse
  | AirtableUpdateMultipleResponse
```

--------------------------------------------------------------------------------

---[FILE: update_multiple_records.ts]---
Location: sim-main/apps/sim/tools/airtable/update_multiple_records.ts

```typescript
import type {
  AirtableUpdateMultipleParams,
  AirtableUpdateMultipleResponse,
} from '@/tools/airtable/types'
import type { ToolConfig } from '@/tools/types'

export const airtableUpdateMultipleRecordsTool: ToolConfig<
  AirtableUpdateMultipleParams,
  AirtableUpdateMultipleResponse
> = {
  id: 'airtable_update_multiple_records',
  name: 'Airtable Update Multiple Records',
  description: 'Update multiple existing records in an Airtable table',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'airtable',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token',
    },
    baseId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ID of the Airtable base',
    },
    tableId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ID or name of the table',
    },
    records: {
      type: 'json',
      required: true,
      visibility: 'user-or-llm',
      description: 'Array of records to update, each with an `id` and a `fields` object',
    },
  },

  request: {
    // The API endpoint uses PATCH for multiple record updates as well
    url: (params) => `https://api.airtable.com/v0/${params.baseId}/${params.tableId}`,
    method: 'PATCH',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => ({ records: params.records }),
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        records: data.records || [], // API returns an array of updated records
        metadata: {
          recordCount: (data.records || []).length,
          updatedRecordIds: (data.records || []).map((r: any) => r.id),
        },
      },
    }
  },

  outputs: {
    records: {
      type: 'json',
      description: 'Array of updated Airtable records',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          createdTime: { type: 'string' },
          fields: { type: 'object' },
        },
      },
    },
    metadata: {
      type: 'json',
      description: 'Operation metadata including record count and updated record IDs',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_record.ts]---
Location: sim-main/apps/sim/tools/airtable/update_record.ts

```typescript
import type { AirtableUpdateParams, AirtableUpdateResponse } from '@/tools/airtable/types'
import type { ToolConfig } from '@/tools/types'

export const airtableUpdateRecordTool: ToolConfig<AirtableUpdateParams, AirtableUpdateResponse> = {
  id: 'airtable_update_record',
  name: 'Airtable Update Record',
  description: 'Update an existing record in an Airtable table by ID',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'airtable',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token',
    },
    baseId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ID of the Airtable base',
    },
    tableId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ID or name of the table',
    },
    recordId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ID of the record to update',
    },
    fields: {
      type: 'json',
      required: true,
      visibility: 'user-or-llm',
      description: 'An object containing the field names and their new values',
    },
  },

  request: {
    // The API endpoint uses PATCH for single record updates
    url: (params) =>
      `https://api.airtable.com/v0/${params.baseId}/${params.tableId}/${params.recordId}`,
    method: 'PATCH',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => ({ fields: params.fields }),
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        record: data, // API returns the single updated record object
        metadata: {
          recordCount: 1,
          updatedFields: Object.keys(data.fields || {}),
        },
      },
    }
  },

  outputs: {
    record: {
      type: 'json',
      description: 'Updated Airtable record with id, createdTime, and fields',
    },
    metadata: {
      type: 'json',
      description: 'Operation metadata including record count and updated field names',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/apify/index.ts

```typescript
export { apifyRunActorAsyncTool } from './run_actor_async'
export { apifyRunActorSyncTool } from './run_actor_sync'
export type { RunActorParams, RunActorResult } from './types'
```

--------------------------------------------------------------------------------

---[FILE: run_actor_async.ts]---
Location: sim-main/apps/sim/tools/apify/run_actor_async.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { RunActorParams, RunActorResult } from './types'

const POLL_INTERVAL_MS = 5000 // 5 seconds between polls
const MAX_POLL_TIME_MS = 300000 // 5 minutes maximum polling time

export const apifyRunActorAsyncTool: ToolConfig<RunActorParams, RunActorResult> = {
  id: 'apify_run_actor_async',
  name: 'APIFY Run Actor (Async)',
  description: 'Run an APIFY actor asynchronously with polling for long-running tasks',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'APIFY API token from console.apify.com/account#/integrations',
    },
    actorId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Actor ID or username/actor-name (e.g., "janedoe/my-actor" or actor ID)',
    },
    input: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Actor input as JSON string',
    },
    waitForFinish: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Initial wait time in seconds (0-60) before polling starts',
    },
    itemLimit: {
      type: 'number',
      required: false,
      default: 100,
      visibility: 'user-or-llm',
      description: 'Max dataset items to fetch (1-250000, default 100)',
    },
    timeout: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Timeout in seconds (default: actor default)',
    },
    build: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Actor build to run (e.g., "latest", "beta", or build tag/number)',
    },
  },

  request: {
    url: (params) => {
      const encodedActorId = encodeURIComponent(params.actorId)
      const baseUrl = `https://api.apify.com/v2/acts/${encodedActorId}/runs`
      const queryParams = new URLSearchParams()

      queryParams.set('token', params.apiKey)

      if (params.waitForFinish !== undefined) {
        const waitTime = Math.max(0, Math.min(params.waitForFinish, 60))
        queryParams.set('waitForFinish', waitTime.toString())
      }
      if (params.timeout) {
        queryParams.set('timeout', params.timeout.toString())
      }
      if (params.build) {
        queryParams.set('build', params.build)
      }

      return `${baseUrl}?${queryParams.toString()}`
    },
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      let inputData = {}
      if (params.input) {
        try {
          inputData = JSON.parse(params.input)
        } catch (e) {
          throw new Error('Invalid JSON in input parameter')
        }
      }
      return inputData
    },
  },

  transformResponse: async (response) => {
    if (!response.ok) {
      const errorText = await response.text()
      return {
        success: false,
        output: { success: false, runId: '', status: 'ERROR' },
        error: `APIFY API error: ${errorText}`,
      }
    }

    const data = await response.json()
    return {
      success: true,
      output: data.data,
    }
  },

  postProcess: async (result, params) => {
    if (!result.success) {
      return result
    }

    const runData = result.output as any
    const runId = runData.id

    let elapsedTime = 0

    while (elapsedTime < MAX_POLL_TIME_MS) {
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))
      elapsedTime += POLL_INTERVAL_MS

      const encodedActorId = encodeURIComponent(params.actorId)
      const statusResponse = await fetch(
        `https://api.apify.com/v2/acts/${encodedActorId}/runs/${runId}?token=${params.apiKey}`,
        {
          headers: {
            Authorization: `Bearer ${params.apiKey}`,
          },
        }
      )

      if (!statusResponse.ok) {
        return {
          success: false,
          output: { success: false, runId, status: 'UNKNOWN' },
          error: 'Failed to fetch run status',
        }
      }

      const statusData = await statusResponse.json()
      const run = statusData.data

      if (
        run.status === 'SUCCEEDED' ||
        run.status === 'FAILED' ||
        run.status === 'ABORTED' ||
        run.status === 'TIMED-OUT'
      ) {
        if (run.status === 'SUCCEEDED') {
          const limit = Math.max(1, Math.min(params.itemLimit || 100, 250000))
          const itemsResponse = await fetch(
            `https://api.apify.com/v2/datasets/${run.defaultDatasetId}/items?token=${params.apiKey}&limit=${limit}`,
            {
              headers: {
                Authorization: `Bearer ${params.apiKey}`,
              },
            }
          )

          if (itemsResponse.ok) {
            const items = await itemsResponse.json()
            return {
              success: true,
              output: {
                success: true,
                runId,
                status: run.status,
                datasetId: run.defaultDatasetId,
                items,
              },
            }
          }
        }

        return {
          success: run.status === 'SUCCEEDED',
          output: {
            success: run.status === 'SUCCEEDED',
            runId,
            status: run.status,
            datasetId: run.defaultDatasetId,
          },
          error: run.status !== 'SUCCEEDED' ? `Actor run ${run.status}` : undefined,
        }
      }
    }

    return {
      success: false,
      output: {
        success: false,
        runId,
        status: 'TIMEOUT',
      },
      error: 'Actor run timed out after 5 minutes of polling',
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the actor run succeeded' },
    runId: { type: 'string', description: 'APIFY run ID' },
    status: { type: 'string', description: 'Run status (SUCCEEDED, FAILED, etc.)' },
    datasetId: { type: 'string', description: 'Dataset ID containing results' },
    items: { type: 'array', description: 'Dataset items (if completed)' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: run_actor_sync.ts]---
Location: sim-main/apps/sim/tools/apify/run_actor_sync.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { RunActorParams, RunActorResult } from './types'

export const apifyRunActorSyncTool: ToolConfig<RunActorParams, RunActorResult> = {
  id: 'apify_run_actor_sync',
  name: 'APIFY Run Actor (Sync)',
  description: 'Run an APIFY actor synchronously and get results (max 5 minutes)',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'APIFY API token from console.apify.com/account#/integrations',
    },
    actorId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Actor ID or username/actor-name (e.g., "janedoe/my-actor" or actor ID)',
    },
    input: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Actor input as JSON string. See actor documentation for required fields.',
    },
    timeout: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Timeout in seconds (default: actor default)',
    },
    build: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Actor build to run (e.g., "latest", "beta", or build tag/number)',
    },
  },

  request: {
    url: (params) => {
      const encodedActorId = encodeURIComponent(params.actorId)
      const baseUrl = `https://api.apify.com/v2/acts/${encodedActorId}/run-sync-get-dataset-items`
      const queryParams = new URLSearchParams()

      queryParams.set('token', params.apiKey)

      if (params.timeout) {
        queryParams.set('timeout', params.timeout.toString())
      }
      if (params.build) {
        queryParams.set('build', params.build)
      }

      return `${baseUrl}?${queryParams.toString()}`
    },
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      let inputData = {}
      if (params.input) {
        try {
          inputData = JSON.parse(params.input)
        } catch (e) {
          throw new Error('Invalid JSON in input parameter')
        }
      }
      return inputData
    },
  },

  transformResponse: async (response) => {
    if (!response.ok) {
      const errorText = await response.text()
      return {
        success: false,
        output: { success: false, runId: '', status: 'ERROR', items: [] },
        error: `APIFY API error: ${errorText}`,
      }
    }

    const items = await response.json()
    return {
      success: true,
      output: {
        success: true,
        runId: 'sync-execution',
        status: 'SUCCEEDED',
        items,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the actor run succeeded' },
    runId: { type: 'string', description: 'APIFY run ID' },
    status: { type: 'string', description: 'Run status (SUCCEEDED, FAILED, etc.)' },
    items: { type: 'array', description: 'Dataset items (if completed)' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/apify/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface ApifyActor {
  id: string
  name: string
  username: string
  description?: string
  stats?: {
    lastRunStartedAt?: string
  }
}

export interface RunActorParams {
  apiKey: string
  actorId: string
  input?: string
  waitForFinish?: number // For async tool: 0-60 seconds initial wait
  itemLimit?: number // For async tool: 1-250000 items, default 100
  timeout?: number
  build?: string // Actor build to run (e.g., "latest", "beta", build tag/number)
}

export interface ApifyRun {
  id: string
  actId: string
  status:
    | 'READY'
    | 'RUNNING'
    | 'SUCCEEDED'
    | 'FAILED'
    | 'ABORTED'
    | 'TIMED-OUT'
    | 'ABORTING'
    | 'TIMING-OUT'
  startedAt: string
  finishedAt?: string
  defaultDatasetId: string
  defaultKeyValueStoreId: string
}

export interface RunActorResult extends ToolResponse {
  output: {
    success: boolean
    runId: string
    status: string
    datasetId?: string
    items?: any[]
    stats?: {
      inputRecords?: number
      outputRecords?: number
      duration?: number
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: account_bulk_create.ts]---
Location: sim-main/apps/sim/tools/apollo/account_bulk_create.ts

```typescript
import type {
  ApolloAccountBulkCreateParams,
  ApolloAccountBulkCreateResponse,
} from '@/tools/apollo/types'
import type { ToolConfig } from '@/tools/types'

export const apolloAccountBulkCreateTool: ToolConfig<
  ApolloAccountBulkCreateParams,
  ApolloAccountBulkCreateResponse
> = {
  id: 'apollo_account_bulk_create',
  name: 'Apollo Bulk Create Accounts',
  description:
    'Create up to 100 accounts at once in your Apollo database. Note: Apollo does not apply deduplication - duplicate accounts may be created if entries share similar names or domains. Master key required.',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Apollo API key (master key required)',
    },
    accounts: {
      type: 'array',
      required: true,
      visibility: 'user-or-llm',
      description:
        'Array of accounts to create (max 100). Each account should include name (required), and optionally website_url, phone, owner_id',
    },
  },

  request: {
    url: 'https://api.apollo.io/api/v1/accounts/bulk_create',
    method: 'POST',
    headers: (params: ApolloAccountBulkCreateParams) => ({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'X-Api-Key': params.apiKey,
    }),
    body: (params: ApolloAccountBulkCreateParams) => ({
      accounts: params.accounts.slice(0, 100),
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Apollo API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        created_accounts: data.accounts || data.created_accounts || [],
        failed_accounts: data.failed_accounts || [],
        metadata: {
          total_submitted: data.accounts?.length || 0,
          created: data.created_accounts?.length || data.accounts?.length || 0,
          failed: data.failed_accounts?.length || 0,
        },
      },
    }
  },

  outputs: {
    created_accounts: {
      type: 'json',
      description: 'Array of newly created accounts',
    },
    failed_accounts: {
      type: 'json',
      description: 'Array of accounts that failed to create',
    },
    metadata: {
      type: 'json',
      description: 'Bulk creation metadata including counts of created and failed accounts',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: account_bulk_update.ts]---
Location: sim-main/apps/sim/tools/apollo/account_bulk_update.ts

```typescript
import type {
  ApolloAccountBulkUpdateParams,
  ApolloAccountBulkUpdateResponse,
} from '@/tools/apollo/types'
import type { ToolConfig } from '@/tools/types'

export const apolloAccountBulkUpdateTool: ToolConfig<
  ApolloAccountBulkUpdateParams,
  ApolloAccountBulkUpdateResponse
> = {
  id: 'apollo_account_bulk_update',
  name: 'Apollo Bulk Update Accounts',
  description:
    'Update up to 1000 existing accounts at once in your Apollo database (higher limit than contacts!). Each account must include an id field. Master key required.',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Apollo API key (master key required)',
    },
    accounts: {
      type: 'array',
      required: true,
      visibility: 'user-or-llm',
      description:
        'Array of accounts to update (max 1000). Each account must include id field, and optionally name, website_url, phone, owner_id',
    },
  },

  request: {
    url: 'https://api.apollo.io/api/v1/accounts/bulk_update',
    method: 'POST',
    headers: (params: ApolloAccountBulkUpdateParams) => ({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'X-Api-Key': params.apiKey,
    }),
    body: (params: ApolloAccountBulkUpdateParams) => ({
      accounts: params.accounts.slice(0, 1000),
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Apollo API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        updated_accounts: data.accounts || data.updated_accounts || [],
        failed_accounts: data.failed_accounts || [],
        metadata: {
          total_submitted: data.accounts?.length || 0,
          updated: data.updated_accounts?.length || data.accounts?.length || 0,
          failed: data.failed_accounts?.length || 0,
        },
      },
    }
  },

  outputs: {
    updated_accounts: {
      type: 'json',
      description: 'Array of successfully updated accounts',
    },
    failed_accounts: {
      type: 'json',
      description: 'Array of accounts that failed to update',
    },
    metadata: {
      type: 'json',
      description: 'Bulk update metadata including counts of updated and failed accounts',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: account_create.ts]---
Location: sim-main/apps/sim/tools/apollo/account_create.ts

```typescript
import type { ApolloAccountCreateParams, ApolloAccountCreateResponse } from '@/tools/apollo/types'
import type { ToolConfig } from '@/tools/types'

export const apolloAccountCreateTool: ToolConfig<
  ApolloAccountCreateParams,
  ApolloAccountCreateResponse
> = {
  id: 'apollo_account_create',
  name: 'Apollo Create Account',
  description: 'Create a new account (company) in your Apollo database',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Apollo API key',
    },
    name: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Company name',
    },
    website_url: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Company website URL',
    },
    phone: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Company phone number',
    },
    owner_id: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'User ID of the account owner',
    },
  },

  request: {
    url: 'https://api.apollo.io/api/v1/accounts',
    method: 'POST',
    headers: (params: ApolloAccountCreateParams) => ({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'X-Api-Key': params.apiKey,
    }),
    body: (params: ApolloAccountCreateParams) => {
      const body: any = { name: params.name }
      if (params.website_url) body.website_url = params.website_url
      if (params.phone) body.phone = params.phone
      if (params.owner_id) body.owner_id = params.owner_id
      return body
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Apollo API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        account: data.account || {},
        metadata: {
          created: !!data.account,
        },
      },
    }
  },

  outputs: {
    account: { type: 'json', description: 'Created account data from Apollo' },
    metadata: { type: 'json', description: 'Creation metadata including created status' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: account_search.ts]---
Location: sim-main/apps/sim/tools/apollo/account_search.ts

```typescript
import type { ApolloAccountSearchParams, ApolloAccountSearchResponse } from '@/tools/apollo/types'
import type { ToolConfig } from '@/tools/types'

export const apolloAccountSearchTool: ToolConfig<
  ApolloAccountSearchParams,
  ApolloAccountSearchResponse
> = {
  id: 'apollo_account_search',
  name: 'Apollo Search Accounts',
  description:
    "Search your team's accounts in Apollo. Display limit: 50,000 records (100 records per page, 500 pages max). Use filters to narrow results. Master key required.",
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Apollo API key (master key required)',
    },
    q_keywords: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Keywords to search for in account data',
    },
    owner_id: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Filter by account owner user ID',
    },
    account_stage_ids: {
      type: 'array',
      required: false,
      visibility: 'user-only',
      description: 'Filter by account stage IDs',
    },
    page: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Page number for pagination',
    },
    per_page: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Results per page (max: 100)',
    },
  },

  request: {
    url: 'https://api.apollo.io/api/v1/accounts/search',
    method: 'POST',
    headers: (params: ApolloAccountSearchParams) => ({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'X-Api-Key': params.apiKey,
    }),
    body: (params: ApolloAccountSearchParams) => {
      const body: any = {
        page: params.page || 1,
        per_page: Math.min(params.per_page || 25, 100),
      }
      if (params.q_keywords) body.q_keywords = params.q_keywords
      if (params.owner_id) body.owner_id = params.owner_id
      if (params.account_stage_ids?.length) {
        body.account_stage_ids = params.account_stage_ids
      }
      return body
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Apollo API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        accounts: data.accounts || [],
        metadata: {
          page: data.pagination?.page || 1,
          per_page: data.pagination?.per_page || 25,
          total_entries: data.pagination?.total_entries || 0,
        },
      },
    }
  },

  outputs: {
    accounts: { type: 'json', description: 'Array of accounts matching the search criteria' },
    metadata: {
      type: 'json',
      description: 'Pagination information including page, per_page, and total_entries',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: account_update.ts]---
Location: sim-main/apps/sim/tools/apollo/account_update.ts

```typescript
import type { ApolloAccountUpdateParams, ApolloAccountUpdateResponse } from '@/tools/apollo/types'
import type { ToolConfig } from '@/tools/types'

export const apolloAccountUpdateTool: ToolConfig<
  ApolloAccountUpdateParams,
  ApolloAccountUpdateResponse
> = {
  id: 'apollo_account_update',
  name: 'Apollo Update Account',
  description: 'Update an existing account in your Apollo database',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Apollo API key',
    },
    account_id: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'ID of the account to update',
    },
    name: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Company name',
    },
    website_url: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Company website URL',
    },
    phone: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Company phone number',
    },
    owner_id: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'User ID of the account owner',
    },
  },

  request: {
    url: (params: ApolloAccountUpdateParams) =>
      `https://api.apollo.io/api/v1/accounts/${params.account_id}`,
    method: 'PATCH',
    headers: (params: ApolloAccountUpdateParams) => ({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'X-Api-Key': params.apiKey,
    }),
    body: (params: ApolloAccountUpdateParams) => {
      const body: any = {}
      if (params.name) body.name = params.name
      if (params.website_url) body.website_url = params.website_url
      if (params.phone) body.phone = params.phone
      if (params.owner_id) body.owner_id = params.owner_id
      return body
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Apollo API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        account: data.account || {},
        metadata: {
          updated: !!data.account,
        },
      },
    }
  },

  outputs: {
    account: { type: 'json', description: 'Updated account data from Apollo' },
    metadata: { type: 'json', description: 'Update metadata including updated status' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: contact_bulk_create.ts]---
Location: sim-main/apps/sim/tools/apollo/contact_bulk_create.ts

```typescript
import type {
  ApolloContactBulkCreateParams,
  ApolloContactBulkCreateResponse,
} from '@/tools/apollo/types'
import type { ToolConfig } from '@/tools/types'

export const apolloContactBulkCreateTool: ToolConfig<
  ApolloContactBulkCreateParams,
  ApolloContactBulkCreateResponse
> = {
  id: 'apollo_contact_bulk_create',
  name: 'Apollo Bulk Create Contacts',
  description:
    'Create up to 100 contacts at once in your Apollo database. Supports deduplication to prevent creating duplicate contacts. Master key required.',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Apollo API key (master key required)',
    },
    contacts: {
      type: 'array',
      required: true,
      visibility: 'user-or-llm',
      description:
        'Array of contacts to create (max 100). Each contact should include first_name, last_name, and optionally email, title, account_id, owner_id',
    },
    run_dedupe: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description:
        'Enable deduplication to prevent creating duplicate contacts. When true, existing contacts are returned without modification',
    },
  },

  request: {
    url: 'https://api.apollo.io/api/v1/contacts/bulk_create',
    method: 'POST',
    headers: (params: ApolloContactBulkCreateParams) => ({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'X-Api-Key': params.apiKey,
    }),
    body: (params: ApolloContactBulkCreateParams) => {
      const body: any = {
        contacts: params.contacts.slice(0, 100),
      }
      if (params.run_dedupe !== undefined) {
        body.run_dedupe = params.run_dedupe
      }
      return body
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Apollo API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        created_contacts: data.contacts || data.created_contacts || [],
        existing_contacts: data.existing_contacts || [],
        metadata: {
          total_submitted: data.contacts?.length || 0,
          created: data.created_contacts?.length || data.contacts?.length || 0,
          existing: data.existing_contacts?.length || 0,
        },
      },
    }
  },

  outputs: {
    created_contacts: {
      type: 'json',
      description: 'Array of newly created contacts',
    },
    existing_contacts: {
      type: 'json',
      description: 'Array of existing contacts (when deduplication is enabled)',
    },
    metadata: {
      type: 'json',
      description: 'Bulk creation metadata including counts of created and existing contacts',
    },
  },
}
```

--------------------------------------------------------------------------------

````
