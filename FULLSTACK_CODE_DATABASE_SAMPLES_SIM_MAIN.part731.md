---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 731
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 731 of 933)

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

---[FILE: search.ts]---
Location: sim-main/apps/sim/tools/polymarket/search.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { PolymarketPaginationParams, PolymarketSearchResult } from './types'
import { buildGammaUrl, handlePolymarketError } from './types'

export interface PolymarketSearchParams extends PolymarketPaginationParams {
  query: string // Search term (required)
}

export interface PolymarketSearchResponse {
  success: boolean
  output: {
    results: PolymarketSearchResult
  }
}

export const polymarketSearchTool: ToolConfig<PolymarketSearchParams, PolymarketSearchResponse> = {
  id: 'polymarket_search',
  name: 'Search Polymarket',
  description: 'Search for markets, events, and profiles on Polymarket',
  version: '1.0.0',

  params: {
    query: {
      type: 'string',
      required: true,
      description: 'Search query term',
    },
    limit: {
      type: 'string',
      required: false,
      description: 'Number of results per page (max 50)',
    },
    offset: {
      type: 'string',
      required: false,
      description: 'Pagination offset',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()
      queryParams.append('q', params.query)
      // Default limit to 50 to prevent browser crashes from large data sets
      queryParams.append('limit', params.limit || '50')
      if (params.offset) queryParams.append('offset', params.offset)

      return `${buildGammaUrl('/public-search')}?${queryParams.toString()}`
    },
    method: 'GET',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      handlePolymarketError(data, response.status, 'search')
    }

    // Response contains markets, events, and profiles arrays
    const results: PolymarketSearchResult = {
      markets: data.markets || [],
      events: data.events || [],
      profiles: data.profiles || [],
    }

    return {
      success: true,
      output: {
        results,
      },
    }
  },

  outputs: {
    results: {
      type: 'object',
      description: 'Search results containing markets, events, and profiles arrays',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/polymarket/types.ts

```typescript
export const POLYMARKET_GAMMA_URL = 'https://gamma-api.polymarket.com'
export const POLYMARKET_CLOB_URL = 'https://clob.polymarket.com'
export const POLYMARKET_DATA_URL = 'https://data-api.polymarket.com'

export function buildGammaUrl(path: string): string {
  return `${POLYMARKET_GAMMA_URL}${path}`
}

export function buildClobUrl(path: string): string {
  return `${POLYMARKET_CLOB_URL}${path}`
}

export function buildDataUrl(path: string): string {
  return `${POLYMARKET_DATA_URL}${path}`
}

export interface PolymarketPaginationParams {
  limit?: string
  offset?: string
}

export interface PolymarketPagingInfo {
  limit: number
  offset: number
  count: number
}

export interface PolymarketMarket {
  id: string
  question: string
  conditionId: string
  slug: string
  resolutionSource: string
  endDate: string
  liquidity: string
  startDate: string
  image: string
  icon: string
  description: string
  outcomes: string
  outcomePrices: string
  volume: string
  active: boolean
  closed: boolean
  marketMakerAddress: string
  createdAt: string
  updatedAt: string
  new: boolean
  featured: boolean
  submitted_by: string
  archived: boolean
  resolvedBy: string
  restricted: boolean
  groupItemTitle: string
  groupItemThreshold: string
  questionID: string
  enableOrderBook: boolean
  orderPriceMinTickSize: number
  orderMinSize: number
  volumeNum: number
  liquidityNum: number
  clobTokenIds: string[]
  acceptingOrders: boolean
  negRisk: boolean
}

export interface PolymarketEvent {
  id: string
  ticker: string
  slug: string
  title: string
  description: string
  startDate: string
  creationDate: string
  endDate: string
  image: string
  icon: string
  active: boolean
  closed: boolean
  archived: boolean
  new: boolean
  featured: boolean
  restricted: boolean
  liquidity: number
  volume: number
  openInterest: number
  commentCount: number
  markets: PolymarketMarket[]
}

export interface PolymarketTag {
  id: string
  label: string
  slug: string
}

export interface PolymarketOrderBookEntry {
  price: string
  size: string
}

export interface PolymarketOrderBook {
  market: string
  asset_id: string
  hash: string
  timestamp: string
  bids: PolymarketOrderBookEntry[]
  asks: PolymarketOrderBookEntry[]
}

export interface PolymarketPrice {
  price: string
  side: string
}

export interface PolymarketPriceHistoryEntry {
  t: number
  p: number
}

export interface PolymarketSeries {
  id: string
  ticker: string
  slug: string
  title: string
  seriesType: string
  recurrence: string
  image: string
  icon: string
  active: boolean
  closed: boolean
  archived: boolean
  featured: boolean
  restricted: boolean
  createdAt: string
  updatedAt: string
  volume: number
  liquidity: number
  commentCount: number
  eventCount: number
}

export interface PolymarketSearchResult {
  markets: PolymarketMarket[]
  events: PolymarketEvent[]
  profiles: any[]
}

export interface PolymarketSpread {
  bid: string
  ask: string
}

export interface PolymarketPosition {
  market: string
  asset_id: string
  size: string
  value: string
}

export interface PolymarketTrade {
  id: string
  market: string
  asset_id: string
  side: string
  size: string
  price: string
  timestamp: string
  maker: string
  taker: string
}

export function handlePolymarketError(data: any, status: number, operation: string): never {
  const errorMessage = data?.message || data?.error || `Unknown error during ${operation}`
  throw new Error(`Polymarket API error (${status}): ${errorMessage}`)
}
```

--------------------------------------------------------------------------------

---[FILE: delete.ts]---
Location: sim-main/apps/sim/tools/postgresql/delete.ts

```typescript
import type { PostgresDeleteParams, PostgresDeleteResponse } from '@/tools/postgresql/types'
import type { ToolConfig } from '@/tools/types'

export const deleteTool: ToolConfig<PostgresDeleteParams, PostgresDeleteResponse> = {
  id: 'postgresql_delete',
  name: 'PostgreSQL Delete',
  description: 'Delete data from PostgreSQL database',
  version: '1.0',

  params: {
    host: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'PostgreSQL server hostname or IP address',
    },
    port: {
      type: 'number',
      required: true,
      visibility: 'user-only',
      description: 'PostgreSQL server port (default: 5432)',
    },
    database: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Database name to connect to',
    },
    username: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Database username',
    },
    password: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Database password',
    },
    ssl: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'SSL connection mode (disabled, required, preferred)',
    },
    table: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Table name to delete data from',
    },
    where: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'WHERE clause condition (without WHERE keyword)',
    },
  },

  request: {
    url: '/api/tools/postgresql/delete',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      host: params.host,
      port: Number(params.port),
      database: params.database,
      username: params.username,
      password: params.password,
      ssl: params.ssl || 'required',
      table: params.table,
      where: params.where,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'PostgreSQL delete failed')
    }

    return {
      success: true,
      output: {
        message: data.message || 'Data deleted successfully',
        rows: data.rows || [],
        rowCount: data.rowCount || 0,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    rows: { type: 'array', description: 'Deleted data (if RETURNING clause used)' },
    rowCount: { type: 'number', description: 'Number of rows deleted' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: execute.ts]---
Location: sim-main/apps/sim/tools/postgresql/execute.ts

```typescript
import type { PostgresExecuteParams, PostgresExecuteResponse } from '@/tools/postgresql/types'
import type { ToolConfig } from '@/tools/types'

export const executeTool: ToolConfig<PostgresExecuteParams, PostgresExecuteResponse> = {
  id: 'postgresql_execute',
  name: 'PostgreSQL Execute',
  description: 'Execute raw SQL query on PostgreSQL database',
  version: '1.0',

  params: {
    host: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'PostgreSQL server hostname or IP address',
    },
    port: {
      type: 'number',
      required: true,
      visibility: 'user-only',
      description: 'PostgreSQL server port (default: 5432)',
    },
    database: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Database name to connect to',
    },
    username: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Database username',
    },
    password: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Database password',
    },
    ssl: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'SSL connection mode (disabled, required, preferred)',
    },
    query: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Raw SQL query to execute',
    },
  },

  request: {
    url: '/api/tools/postgresql/execute',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      host: params.host,
      port: Number(params.port),
      database: params.database,
      username: params.username,
      password: params.password,
      ssl: params.ssl || 'required',
      query: params.query,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'PostgreSQL execute failed')
    }

    return {
      success: true,
      output: {
        message: data.message || 'Query executed successfully',
        rows: data.rows || [],
        rowCount: data.rowCount || 0,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    rows: { type: 'array', description: 'Array of rows returned from the query' },
    rowCount: { type: 'number', description: 'Number of rows affected' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/postgresql/index.ts

```typescript
import { deleteTool } from './delete'
import { executeTool } from './execute'
import { insertTool } from './insert'
import { queryTool } from './query'
import { updateTool } from './update'

export const postgresDeleteTool = deleteTool
export const postgresExecuteTool = executeTool
export const postgresInsertTool = insertTool
export const postgresQueryTool = queryTool
export const postgresUpdateTool = updateTool
```

--------------------------------------------------------------------------------

---[FILE: insert.ts]---
Location: sim-main/apps/sim/tools/postgresql/insert.ts

```typescript
import type { PostgresInsertParams, PostgresInsertResponse } from '@/tools/postgresql/types'
import type { ToolConfig } from '@/tools/types'

export const insertTool: ToolConfig<PostgresInsertParams, PostgresInsertResponse> = {
  id: 'postgresql_insert',
  name: 'PostgreSQL Insert',
  description: 'Insert data into PostgreSQL database',
  version: '1.0',

  params: {
    host: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'PostgreSQL server hostname or IP address',
    },
    port: {
      type: 'number',
      required: true,
      visibility: 'user-only',
      description: 'PostgreSQL server port (default: 5432)',
    },
    database: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Database name to connect to',
    },
    username: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Database username',
    },
    password: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Database password',
    },
    ssl: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'SSL connection mode (disabled, required, preferred)',
    },
    table: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Table name to insert data into',
    },
    data: {
      type: 'object',
      required: true,
      visibility: 'user-or-llm',
      description: 'Data object to insert (key-value pairs)',
    },
  },

  request: {
    url: '/api/tools/postgresql/insert',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      host: params.host,
      port: Number(params.port),
      database: params.database,
      username: params.username,
      password: params.password,
      ssl: params.ssl || 'required',
      table: params.table,
      data: params.data,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'PostgreSQL insert failed')
    }

    return {
      success: true,
      output: {
        message: data.message || 'Data inserted successfully',
        rows: data.rows || [],
        rowCount: data.rowCount || 0,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    rows: { type: 'array', description: 'Inserted data (if RETURNING clause used)' },
    rowCount: { type: 'number', description: 'Number of rows inserted' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: query.ts]---
Location: sim-main/apps/sim/tools/postgresql/query.ts

```typescript
import type { PostgresQueryParams, PostgresQueryResponse } from '@/tools/postgresql/types'
import type { ToolConfig } from '@/tools/types'

export const queryTool: ToolConfig<PostgresQueryParams, PostgresQueryResponse> = {
  id: 'postgresql_query',
  name: 'PostgreSQL Query',
  description: 'Execute a SELECT query on PostgreSQL database',
  version: '1.0',

  params: {
    host: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'PostgreSQL server hostname or IP address',
    },
    port: {
      type: 'number',
      required: true,
      visibility: 'user-only',
      description: 'PostgreSQL server port (default: 5432)',
    },
    database: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Database name to connect to',
    },
    username: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Database username',
    },
    password: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Database password',
    },
    ssl: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'SSL connection mode (disabled, required, preferred)',
    },
    query: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'SQL SELECT query to execute',
    },
  },

  request: {
    url: '/api/tools/postgresql/query',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      host: params.host,
      port: Number(params.port),
      database: params.database,
      username: params.username,
      password: params.password,
      ssl: params.ssl || 'required',
      query: params.query,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'PostgreSQL query failed')
    }

    return {
      success: true,
      output: {
        message: data.message || 'Query executed successfully',
        rows: data.rows || [],
        rowCount: data.rowCount || 0,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    rows: { type: 'array', description: 'Array of rows returned from the query' },
    rowCount: { type: 'number', description: 'Number of rows returned' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/postgresql/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface PostgresConnectionConfig {
  host: string
  port: number
  database: string
  username: string
  password: string
  ssl: 'disabled' | 'required' | 'preferred'
}

export interface PostgresQueryParams extends PostgresConnectionConfig {
  query: string
}

export interface PostgresInsertParams extends PostgresConnectionConfig {
  table: string
  data: Record<string, unknown>
}

export interface PostgresUpdateParams extends PostgresConnectionConfig {
  table: string
  data: Record<string, unknown>
  where: string
}

export interface PostgresDeleteParams extends PostgresConnectionConfig {
  table: string
  where: string
}

export interface PostgresExecuteParams extends PostgresConnectionConfig {
  query: string
}

export interface PostgresBaseResponse extends ToolResponse {
  output: {
    message: string
    rows: unknown[]
    rowCount: number
  }
  error?: string
}

export interface PostgresQueryResponse extends PostgresBaseResponse {}
export interface PostgresInsertResponse extends PostgresBaseResponse {}
export interface PostgresUpdateResponse extends PostgresBaseResponse {}
export interface PostgresDeleteResponse extends PostgresBaseResponse {}
export interface PostgresExecuteResponse extends PostgresBaseResponse {}
export interface PostgresResponse extends PostgresBaseResponse {}
```

--------------------------------------------------------------------------------

---[FILE: update.ts]---
Location: sim-main/apps/sim/tools/postgresql/update.ts

```typescript
import type { PostgresUpdateParams, PostgresUpdateResponse } from '@/tools/postgresql/types'
import type { ToolConfig } from '@/tools/types'

export const updateTool: ToolConfig<PostgresUpdateParams, PostgresUpdateResponse> = {
  id: 'postgresql_update',
  name: 'PostgreSQL Update',
  description: 'Update data in PostgreSQL database',
  version: '1.0',

  params: {
    host: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'PostgreSQL server hostname or IP address',
    },
    port: {
      type: 'number',
      required: true,
      visibility: 'user-only',
      description: 'PostgreSQL server port (default: 5432)',
    },
    database: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Database name to connect to',
    },
    username: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Database username',
    },
    password: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Database password',
    },
    ssl: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'SSL connection mode (disabled, required, preferred)',
    },
    table: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Table name to update data in',
    },
    data: {
      type: 'object',
      required: true,
      visibility: 'user-or-llm',
      description: 'Data object with fields to update (key-value pairs)',
    },
    where: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'WHERE clause condition (without WHERE keyword)',
    },
  },

  request: {
    url: '/api/tools/postgresql/update',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      host: params.host,
      port: Number(params.port),
      database: params.database,
      username: params.username,
      password: params.password,
      ssl: params.ssl || 'required',
      table: params.table,
      data: params.data,
      where: params.where,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'PostgreSQL update failed')
    }

    return {
      success: true,
      output: {
        message: data.message || 'Data updated successfully',
        rows: data.rows || [],
        rowCount: data.rowCount || 0,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    rows: { type: 'array', description: 'Updated data (if RETURNING clause used)' },
    rowCount: { type: 'number', description: 'Number of rows updated' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: batch_events.ts]---
Location: sim-main/apps/sim/tools/posthog/batch_events.ts

```typescript
import type { ToolConfig } from '@/tools/types'

export interface PostHogBatchEventsParams {
  projectApiKey: string
  region?: 'us' | 'eu'
  batch: string
}

export interface PostHogBatchEventsResponse {
  success: boolean
  output: {
    status: string
    eventsProcessed: number
  }
}

export const batchEventsTool: ToolConfig<PostHogBatchEventsParams, PostHogBatchEventsResponse> = {
  id: 'posthog_batch_events',
  name: 'PostHog Batch Events',
  description:
    'Capture multiple events at once in PostHog. Use this for bulk event ingestion to improve performance.',
  version: '1.0.0',

  params: {
    projectApiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'PostHog Project API Key (public token for event ingestion)',
    },
    region: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'PostHog region: us (default) or eu',
      default: 'us',
    },
    batch: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description:
        'JSON array of events to capture. Each event should have: event, distinct_id, and optional properties, timestamp. Example: [{"event": "page_view", "distinct_id": "user123", "properties": {"page": "/"}}]',
    },
  },

  request: {
    url: (params) => {
      const baseUrl =
        params.region === 'eu' ? 'https://eu.i.posthog.com' : 'https://us.i.posthog.com'
      return `${baseUrl}/batch/`
    },
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      let batch: any[]
      try {
        batch = JSON.parse(params.batch)
      } catch (e) {
        batch = []
      }

      return {
        api_key: params.projectApiKey,
        batch: batch,
      }
    },
  },

  transformResponse: async (response: Response) => {
    if (response.ok) {
      const data = await response.json()
      return {
        success: true,
        output: {
          status: 'Batch events captured successfully',
          eventsProcessed: data.status === 1 ? JSON.parse(data.batch || '[]').length : 0,
        },
      }
    }

    const error = await response.text()
    return {
      success: false,
      output: {
        status: 'Failed to capture batch events',
        eventsProcessed: 0,
      },
      error: error || 'Unknown error occurred',
    }
  },

  outputs: {
    status: {
      type: 'string',
      description: 'Status message indicating whether the batch was captured successfully',
    },
    eventsProcessed: {
      type: 'number',
      description: 'Number of events processed in the batch',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: capture_event.ts]---
Location: sim-main/apps/sim/tools/posthog/capture_event.ts

```typescript
import type { ToolConfig } from '@/tools/types'

export interface PostHogCaptureEventParams {
  projectApiKey: string
  region?: 'us' | 'eu'
  event: string
  distinctId: string
  properties?: string
  timestamp?: string
}

export interface PostHogCaptureEventResponse {
  success: boolean
  output: {
    status: string
  }
}

export const captureEventTool: ToolConfig<PostHogCaptureEventParams, PostHogCaptureEventResponse> =
  {
    id: 'posthog_capture_event',
    name: 'PostHog Capture Event',
    description:
      'Capture a single event in PostHog. Use this to track user actions, page views, or custom events.',
    version: '1.0.0',

    params: {
      projectApiKey: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'PostHog Project API Key (public token for event ingestion)',
      },
      region: {
        type: 'string',
        required: false,
        visibility: 'user-only',
        description: 'PostHog region: us (default) or eu',
        default: 'us',
      },
      event: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description: 'The name of the event to capture (e.g., "page_view", "button_clicked")',
      },
      distinctId: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description:
          'Unique identifier for the user or device. Can be user ID, device ID, or anonymous ID',
      },
      properties: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description:
          'JSON string of event properties (e.g., {"button_name": "signup", "page": "homepage"})',
      },
      timestamp: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description:
          'ISO 8601 timestamp for when the event occurred. If not provided, uses current time',
      },
    },

    request: {
      url: (params) => {
        const baseUrl =
          params.region === 'eu' ? 'https://eu.i.posthog.com' : 'https://us.i.posthog.com'
        return `${baseUrl}/capture/`
      },
      method: 'POST',
      headers: (params) => ({
        'Content-Type': 'application/json',
      }),
      body: (params) => {
        const body: Record<string, any> = {
          api_key: params.projectApiKey,
          event: params.event,
          distinct_id: params.distinctId,
        }

        if (params.properties) {
          try {
            body.properties = JSON.parse(params.properties)
          } catch (e) {
            body.properties = {}
          }
        }

        if (params.timestamp) {
          body.timestamp = params.timestamp
        }

        return body
      },
    },

    transformResponse: async (response: Response) => {
      if (response.ok) {
        return {
          success: true,
          output: {
            status: 'Event captured successfully',
          },
        }
      }

      const error = await response.text()
      return {
        success: false,
        output: {
          status: 'Failed to capture event',
        },
        error: error || 'Unknown error occurred',
      }
    },

    outputs: {
      status: {
        type: 'string',
        description: 'Status message indicating whether the event was captured successfully',
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: create_annotation.ts]---
Location: sim-main/apps/sim/tools/posthog/create_annotation.ts

```typescript
import type { ToolConfig } from '@/tools/types'

interface PostHogCreateAnnotationParams {
  apiKey: string
  projectId: string
  region: string
  content: string
  date_marker: string
  scope?: string
  dashboard_item?: string
  insight_short_id?: string
}

interface PostHogCreateAnnotationResponse {
  success: boolean
  output: {
    id: number
    content: string
    date_marker: string
    created_at: string
    updated_at: string
    created_by: Record<string, any> | null
    dashboard_item: number | null
    insight_short_id: string | null
    insight_name: string | null
    scope: string
    deleted: boolean
  }
}

export const createAnnotationTool: ToolConfig<
  PostHogCreateAnnotationParams,
  PostHogCreateAnnotationResponse
> = {
  id: 'posthog_create_annotation',
  name: 'PostHog Create Annotation',
  description:
    'Create a new annotation in PostHog. Mark important events on your graphs with date and description.',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'PostHog Personal API Key',
    },
    projectId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The PostHog project ID',
    },
    region: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'PostHog cloud region: "us" or "eu" (default: "us")',
      default: 'us',
    },
    content: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Content/text of the annotation',
    },
    date_marker: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description:
        'ISO timestamp marking when the annotation applies (e.g., "2024-01-15T10:00:00Z")',
    },
    scope: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Scope of the annotation: "project" or "dashboard_item" (default: "project")',
    },
    dashboard_item: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'ID of dashboard item to attach this annotation to',
    },
    insight_short_id: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Short ID of the insight to attach this annotation to',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = params.region === 'eu' ? 'https://eu.posthog.com' : 'https://us.posthog.com'
      return `${baseUrl}/api/projects/${params.projectId}/annotations/`
    },
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
    body: (params) => {
      const body: Record<string, any> = {
        content: params.content,
        date_marker: params.date_marker,
      }

      if (params.scope) {
        body.scope = params.scope
      }

      if (params.dashboard_item) {
        body.dashboard_item = Number(params.dashboard_item)
      }

      if (params.insight_short_id) {
        body.insight_short_id = params.insight_short_id
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        id: data.id,
        content: data.content || '',
        date_marker: data.date_marker,
        created_at: data.created_at,
        updated_at: data.updated_at,
        created_by: data.created_by || null,
        dashboard_item: data.dashboard_item || null,
        insight_short_id: data.insight_short_id || null,
        insight_name: data.insight_name || null,
        scope: data.scope || '',
        deleted: data.deleted || false,
      },
    }
  },

  outputs: {
    id: {
      type: 'number',
      description: 'Unique identifier for the created annotation',
    },
    content: {
      type: 'string',
      description: 'Content/text of the annotation',
    },
    date_marker: {
      type: 'string',
      description: 'ISO timestamp marking when the annotation applies',
    },
    created_at: {
      type: 'string',
      description: 'ISO timestamp when annotation was created',
    },
    updated_at: {
      type: 'string',
      description: 'ISO timestamp when annotation was last updated',
    },
    created_by: {
      type: 'object',
      description: 'User who created the annotation',
      optional: true,
    },
    dashboard_item: {
      type: 'number',
      description: 'ID of dashboard item this annotation is attached to',
      optional: true,
    },
    insight_short_id: {
      type: 'string',
      description: 'Short ID of the insight this annotation is attached to',
      optional: true,
    },
    insight_name: {
      type: 'string',
      description: 'Name of the insight this annotation is attached to',
      optional: true,
    },
    scope: {
      type: 'string',
      description: 'Scope of the annotation (project or dashboard_item)',
    },
    deleted: {
      type: 'boolean',
      description: 'Whether the annotation is deleted',
    },
  },
}
```

--------------------------------------------------------------------------------

````
