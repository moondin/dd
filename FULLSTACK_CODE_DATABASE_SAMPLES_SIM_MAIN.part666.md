---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 666
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 666 of 933)

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
Location: sim-main/apps/sim/tools/dynamodb/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface DynamoDBConnectionConfig {
  region: string
  accessKeyId: string
  secretAccessKey: string
}

export interface DynamoDBGetParams extends DynamoDBConnectionConfig {
  tableName: string
  key: Record<string, unknown>
  consistentRead?: boolean
}

export interface DynamoDBPutParams extends DynamoDBConnectionConfig {
  tableName: string
  item: Record<string, unknown>
}

export interface DynamoDBQueryParams extends DynamoDBConnectionConfig {
  tableName: string
  keyConditionExpression: string
  filterExpression?: string
  expressionAttributeNames?: Record<string, string>
  expressionAttributeValues?: Record<string, unknown>
  indexName?: string
  limit?: number
}

export interface DynamoDBScanParams extends DynamoDBConnectionConfig {
  tableName: string
  filterExpression?: string
  projectionExpression?: string
  expressionAttributeNames?: Record<string, string>
  expressionAttributeValues?: Record<string, unknown>
  limit?: number
}

export interface DynamoDBUpdateParams extends DynamoDBConnectionConfig {
  tableName: string
  key: Record<string, unknown>
  updateExpression: string
  expressionAttributeNames?: Record<string, string>
  expressionAttributeValues?: Record<string, unknown>
  conditionExpression?: string
}

export interface DynamoDBDeleteParams extends DynamoDBConnectionConfig {
  tableName: string
  key: Record<string, unknown>
  conditionExpression?: string
}

export interface DynamoDBBaseResponse extends ToolResponse {
  output: {
    message: string
    item?: Record<string, unknown>
    items?: Record<string, unknown>[]
    count?: number
  }
  error?: string
}

export interface DynamoDBGetResponse extends DynamoDBBaseResponse {}
export interface DynamoDBPutResponse extends DynamoDBBaseResponse {}
export interface DynamoDBQueryResponse extends DynamoDBBaseResponse {}
export interface DynamoDBScanResponse extends DynamoDBBaseResponse {}
export interface DynamoDBUpdateResponse extends DynamoDBBaseResponse {}
export interface DynamoDBDeleteResponse extends DynamoDBBaseResponse {}
export interface DynamoDBResponse extends DynamoDBBaseResponse {}
```

--------------------------------------------------------------------------------

---[FILE: update.ts]---
Location: sim-main/apps/sim/tools/dynamodb/update.ts

```typescript
import type { DynamoDBUpdateParams, DynamoDBUpdateResponse } from '@/tools/dynamodb/types'
import type { ToolConfig } from '@/tools/types'

export const updateTool: ToolConfig<DynamoDBUpdateParams, DynamoDBUpdateResponse> = {
  id: 'dynamodb_update',
  name: 'DynamoDB Update',
  description: 'Update an item in a DynamoDB table',
  version: '1.0',

  params: {
    region: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'AWS region (e.g., us-east-1)',
    },
    accessKeyId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'AWS access key ID',
    },
    secretAccessKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'AWS secret access key',
    },
    tableName: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'DynamoDB table name',
    },
    key: {
      type: 'object',
      required: true,
      visibility: 'user-or-llm',
      description: 'Primary key of the item to update',
    },
    updateExpression: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Update expression (e.g., "SET #name = :name")',
    },
    expressionAttributeNames: {
      type: 'object',
      required: false,
      visibility: 'user-or-llm',
      description: 'Attribute name mappings for reserved words',
    },
    expressionAttributeValues: {
      type: 'object',
      required: false,
      visibility: 'user-or-llm',
      description: 'Expression attribute values',
    },
    conditionExpression: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Condition that must be met for the update to succeed',
    },
  },

  request: {
    url: '/api/tools/dynamodb/update',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      region: params.region,
      accessKeyId: params.accessKeyId,
      secretAccessKey: params.secretAccessKey,
      tableName: params.tableName,
      key: params.key,
      updateExpression: params.updateExpression,
      ...(params.expressionAttributeNames && {
        expressionAttributeNames: params.expressionAttributeNames,
      }),
      ...(params.expressionAttributeValues && {
        expressionAttributeValues: params.expressionAttributeValues,
      }),
      ...(params.conditionExpression && { conditionExpression: params.conditionExpression }),
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'DynamoDB update failed')
    }

    return {
      success: true,
      output: {
        message: data.message || 'Item updated successfully',
        item: data.item,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    item: { type: 'object', description: 'Updated item' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: bulk.ts]---
Location: sim-main/apps/sim/tools/elasticsearch/bulk.ts

```typescript
import type {
  ElasticsearchBulkParams,
  ElasticsearchBulkResponse,
} from '@/tools/elasticsearch/types'
import type { ToolConfig } from '@/tools/types'

function buildBaseUrl(params: ElasticsearchBulkParams): string {
  if (params.deploymentType === 'cloud' && params.cloudId) {
    const parts = params.cloudId.split(':')
    if (parts.length >= 2) {
      try {
        const decoded = Buffer.from(parts[1], 'base64').toString('utf-8')
        const [esHost] = decoded.split('$')
        if (esHost) {
          return `https://${parts[0]}.${esHost}`
        }
      } catch {
        // Fallback
      }
    }
    throw new Error('Invalid Cloud ID format')
  }

  if (!params.host) {
    throw new Error('Host is required for self-hosted deployments')
  }

  return params.host.replace(/\/$/, '')
}

function buildAuthHeaders(params: ElasticsearchBulkParams): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/x-ndjson',
  }

  if (params.authMethod === 'api_key' && params.apiKey) {
    headers.Authorization = `ApiKey ${params.apiKey}`
  } else if (params.authMethod === 'basic_auth' && params.username && params.password) {
    const credentials = Buffer.from(`${params.username}:${params.password}`).toString('base64')
    headers.Authorization = `Basic ${credentials}`
  } else {
    throw new Error('Invalid authentication configuration')
  }

  return headers
}

export const bulkTool: ToolConfig<ElasticsearchBulkParams, ElasticsearchBulkResponse> = {
  id: 'elasticsearch_bulk',
  name: 'Elasticsearch Bulk Operations',
  description:
    'Perform multiple index, create, delete, or update operations in a single request for high performance.',
  version: '1.0.0',

  params: {
    deploymentType: {
      type: 'string',
      required: true,
      description: 'Deployment type: self_hosted or cloud',
    },
    host: {
      type: 'string',
      required: false,
      description: 'Elasticsearch host URL (for self-hosted)',
    },
    cloudId: {
      type: 'string',
      required: false,
      description: 'Elastic Cloud ID (for cloud deployments)',
    },
    authMethod: {
      type: 'string',
      required: true,
      description: 'Authentication method: api_key or basic_auth',
    },
    apiKey: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Elasticsearch API key',
    },
    username: {
      type: 'string',
      required: false,
      description: 'Username for basic auth',
    },
    password: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Password for basic auth',
    },
    index: {
      type: 'string',
      required: false,
      description: 'Default index for operations that do not specify one',
    },
    operations: {
      type: 'string',
      required: true,
      description: 'Bulk operations as NDJSON string (newline-delimited JSON)',
    },
    refresh: {
      type: 'string',
      required: false,
      description: 'Refresh policy: true, false, or wait_for',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = buildBaseUrl(params)
      let url = params.index
        ? `${baseUrl}/${encodeURIComponent(params.index)}/_bulk`
        : `${baseUrl}/_bulk`

      if (params.refresh) {
        url += `?refresh=${params.refresh}`
      }

      return url
    },
    method: 'POST',
    headers: (params) => buildAuthHeaders(params),
    body: (params) => {
      // The body should be NDJSON format - we pass it as raw string
      // Ensure it ends with a newline
      // Note: The executor in tools/utils.ts handles NDJSON content-type specially
      // and accepts string bodies directly
      let operations = params.operations.trim()
      if (!operations.endsWith('\n')) {
        operations += '\n'
      }
      return operations as unknown as Record<string, any>
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = `Elasticsearch error: ${response.status}`
      try {
        const errorJson = JSON.parse(errorText)
        errorMessage = errorJson.error?.reason || errorJson.error?.type || errorMessage
      } catch {
        errorMessage = errorText || errorMessage
      }
      return {
        success: false,
        output: { took: 0, errors: true, items: [] },
        error: errorMessage,
      }
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        took: data.took,
        errors: data.errors,
        items: data.items,
      },
    }
  },

  outputs: {
    took: {
      type: 'number',
      description: 'Time in milliseconds the bulk operation took',
    },
    errors: {
      type: 'boolean',
      description: 'Whether any operation had an error',
    },
    items: {
      type: 'array',
      description: 'Results for each operation',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: cluster_health.ts]---
Location: sim-main/apps/sim/tools/elasticsearch/cluster_health.ts

```typescript
import type {
  ElasticsearchClusterHealthParams,
  ElasticsearchClusterHealthResponse,
} from '@/tools/elasticsearch/types'
import type { ToolConfig } from '@/tools/types'

function buildBaseUrl(params: ElasticsearchClusterHealthParams): string {
  if (params.deploymentType === 'cloud' && params.cloudId) {
    const parts = params.cloudId.split(':')
    if (parts.length >= 2) {
      try {
        const decoded = Buffer.from(parts[1], 'base64').toString('utf-8')
        const [esHost] = decoded.split('$')
        if (esHost) {
          return `https://${parts[0]}.${esHost}`
        }
      } catch {
        // Fallback
      }
    }
    throw new Error('Invalid Cloud ID format')
  }

  if (!params.host) {
    throw new Error('Host is required for self-hosted deployments')
  }

  return params.host.replace(/\/$/, '')
}

function buildAuthHeaders(params: ElasticsearchClusterHealthParams): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (params.authMethod === 'api_key' && params.apiKey) {
    headers.Authorization = `ApiKey ${params.apiKey}`
  } else if (params.authMethod === 'basic_auth' && params.username && params.password) {
    const credentials = Buffer.from(`${params.username}:${params.password}`).toString('base64')
    headers.Authorization = `Basic ${credentials}`
  } else {
    throw new Error('Invalid authentication configuration')
  }

  return headers
}

export const clusterHealthTool: ToolConfig<
  ElasticsearchClusterHealthParams,
  ElasticsearchClusterHealthResponse
> = {
  id: 'elasticsearch_cluster_health',
  name: 'Elasticsearch Cluster Health',
  description: 'Get the health status of the Elasticsearch cluster.',
  version: '1.0.0',

  params: {
    deploymentType: {
      type: 'string',
      required: true,
      description: 'Deployment type: self_hosted or cloud',
    },
    host: {
      type: 'string',
      required: false,
      description: 'Elasticsearch host URL (for self-hosted)',
    },
    cloudId: {
      type: 'string',
      required: false,
      description: 'Elastic Cloud ID (for cloud deployments)',
    },
    authMethod: {
      type: 'string',
      required: true,
      description: 'Authentication method: api_key or basic_auth',
    },
    apiKey: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Elasticsearch API key',
    },
    username: {
      type: 'string',
      required: false,
      description: 'Username for basic auth',
    },
    password: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Password for basic auth',
    },
    waitForStatus: {
      type: 'string',
      required: false,
      description: 'Wait until cluster reaches this status: green, yellow, or red',
    },
    timeout: {
      type: 'string',
      required: false,
      description: 'Timeout for the wait operation (e.g., 30s, 1m)',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = buildBaseUrl(params)
      let url = `${baseUrl}/_cluster/health`

      const queryParams: string[] = []
      if (params.waitForStatus) {
        queryParams.push(`wait_for_status=${params.waitForStatus}`)
      }
      if (params.timeout) {
        queryParams.push(`timeout=${encodeURIComponent(params.timeout)}`)
      }
      if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`
      }

      return url
    },
    method: 'GET',
    headers: (params) => buildAuthHeaders(params),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = `Elasticsearch error: ${response.status}`
      try {
        const errorJson = JSON.parse(errorText)
        errorMessage = errorJson.error?.reason || errorJson.error?.type || errorMessage
      } catch {
        errorMessage = errorText || errorMessage
      }
      return {
        success: false,
        output: {
          cluster_name: '',
          status: 'red' as const,
          timed_out: true,
          number_of_nodes: 0,
          number_of_data_nodes: 0,
          active_primary_shards: 0,
          active_shards: 0,
          relocating_shards: 0,
          initializing_shards: 0,
          unassigned_shards: 0,
          delayed_unassigned_shards: 0,
          number_of_pending_tasks: 0,
          number_of_in_flight_fetch: 0,
          task_max_waiting_in_queue_millis: 0,
          active_shards_percent_as_number: 0,
        },
        error: errorMessage,
      }
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        cluster_name: data.cluster_name,
        status: data.status,
        timed_out: data.timed_out,
        number_of_nodes: data.number_of_nodes,
        number_of_data_nodes: data.number_of_data_nodes,
        active_primary_shards: data.active_primary_shards,
        active_shards: data.active_shards,
        relocating_shards: data.relocating_shards,
        initializing_shards: data.initializing_shards,
        unassigned_shards: data.unassigned_shards,
        delayed_unassigned_shards: data.delayed_unassigned_shards,
        number_of_pending_tasks: data.number_of_pending_tasks,
        number_of_in_flight_fetch: data.number_of_in_flight_fetch,
        task_max_waiting_in_queue_millis: data.task_max_waiting_in_queue_millis,
        active_shards_percent_as_number: data.active_shards_percent_as_number,
      },
    }
  },

  outputs: {
    cluster_name: {
      type: 'string',
      description: 'Name of the cluster',
    },
    status: {
      type: 'string',
      description: 'Cluster health status: green, yellow, or red',
    },
    number_of_nodes: {
      type: 'number',
      description: 'Total number of nodes in the cluster',
    },
    number_of_data_nodes: {
      type: 'number',
      description: 'Number of data nodes',
    },
    active_shards: {
      type: 'number',
      description: 'Number of active shards',
    },
    unassigned_shards: {
      type: 'number',
      description: 'Number of unassigned shards',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: cluster_stats.ts]---
Location: sim-main/apps/sim/tools/elasticsearch/cluster_stats.ts

```typescript
import type {
  ElasticsearchClusterStatsParams,
  ElasticsearchClusterStatsResponse,
} from '@/tools/elasticsearch/types'
import type { ToolConfig } from '@/tools/types'

function buildBaseUrl(params: ElasticsearchClusterStatsParams): string {
  if (params.deploymentType === 'cloud' && params.cloudId) {
    const parts = params.cloudId.split(':')
    if (parts.length >= 2) {
      try {
        const decoded = Buffer.from(parts[1], 'base64').toString('utf-8')
        const [esHost] = decoded.split('$')
        if (esHost) {
          return `https://${parts[0]}.${esHost}`
        }
      } catch {
        // Fallback
      }
    }
    throw new Error('Invalid Cloud ID format')
  }

  if (!params.host) {
    throw new Error('Host is required for self-hosted deployments')
  }

  return params.host.replace(/\/$/, '')
}

function buildAuthHeaders(params: ElasticsearchClusterStatsParams): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (params.authMethod === 'api_key' && params.apiKey) {
    headers.Authorization = `ApiKey ${params.apiKey}`
  } else if (params.authMethod === 'basic_auth' && params.username && params.password) {
    const credentials = Buffer.from(`${params.username}:${params.password}`).toString('base64')
    headers.Authorization = `Basic ${credentials}`
  } else {
    throw new Error('Invalid authentication configuration')
  }

  return headers
}

export const clusterStatsTool: ToolConfig<
  ElasticsearchClusterStatsParams,
  ElasticsearchClusterStatsResponse
> = {
  id: 'elasticsearch_cluster_stats',
  name: 'Elasticsearch Cluster Stats',
  description: 'Get comprehensive statistics about the Elasticsearch cluster.',
  version: '1.0.0',

  params: {
    deploymentType: {
      type: 'string',
      required: true,
      description: 'Deployment type: self_hosted or cloud',
    },
    host: {
      type: 'string',
      required: false,
      description: 'Elasticsearch host URL (for self-hosted)',
    },
    cloudId: {
      type: 'string',
      required: false,
      description: 'Elastic Cloud ID (for cloud deployments)',
    },
    authMethod: {
      type: 'string',
      required: true,
      description: 'Authentication method: api_key or basic_auth',
    },
    apiKey: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Elasticsearch API key',
    },
    username: {
      type: 'string',
      required: false,
      description: 'Username for basic auth',
    },
    password: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Password for basic auth',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = buildBaseUrl(params)
      return `${baseUrl}/_cluster/stats`
    },
    method: 'GET',
    headers: (params) => buildAuthHeaders(params),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = `Elasticsearch error: ${response.status}`
      try {
        const errorJson = JSON.parse(errorText)
        errorMessage = errorJson.error?.reason || errorJson.error?.type || errorMessage
      } catch {
        errorMessage = errorText || errorMessage
      }
      return {
        success: false,
        output: {
          cluster_name: '',
          cluster_uuid: '',
          status: 'red',
          nodes: {
            count: { total: 0, data: 0, master: 0 },
            versions: [],
          },
          indices: {
            count: 0,
            docs: { count: 0, deleted: 0 },
            store: { size_in_bytes: 0 },
            shards: { total: 0, primaries: 0 },
          },
        },
        error: errorMessage,
      }
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        cluster_name: data.cluster_name,
        cluster_uuid: data.cluster_uuid,
        status: data.status,
        nodes: {
          count: data.nodes?.count || { total: 0, data: 0, master: 0 },
          versions: data.nodes?.versions || [],
        },
        indices: {
          count: data.indices?.count || 0,
          docs: data.indices?.docs || { count: 0, deleted: 0 },
          store: data.indices?.store || { size_in_bytes: 0 },
          shards: data.indices?.shards || { total: 0, primaries: 0 },
        },
      },
    }
  },

  outputs: {
    cluster_name: {
      type: 'string',
      description: 'Name of the cluster',
    },
    status: {
      type: 'string',
      description: 'Cluster health status',
    },
    nodes: {
      type: 'object',
      description: 'Node statistics including count and versions',
    },
    indices: {
      type: 'object',
      description: 'Index statistics including document count and store size',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: count.ts]---
Location: sim-main/apps/sim/tools/elasticsearch/count.ts

```typescript
import type {
  ElasticsearchCountParams,
  ElasticsearchCountResponse,
} from '@/tools/elasticsearch/types'
import type { ToolConfig } from '@/tools/types'

function buildBaseUrl(params: ElasticsearchCountParams): string {
  if (params.deploymentType === 'cloud' && params.cloudId) {
    const parts = params.cloudId.split(':')
    if (parts.length >= 2) {
      try {
        const decoded = Buffer.from(parts[1], 'base64').toString('utf-8')
        const [esHost] = decoded.split('$')
        if (esHost) {
          return `https://${parts[0]}.${esHost}`
        }
      } catch {
        // Fallback
      }
    }
    throw new Error('Invalid Cloud ID format')
  }

  if (!params.host) {
    throw new Error('Host is required for self-hosted deployments')
  }

  return params.host.replace(/\/$/, '')
}

function buildAuthHeaders(params: ElasticsearchCountParams): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (params.authMethod === 'api_key' && params.apiKey) {
    headers.Authorization = `ApiKey ${params.apiKey}`
  } else if (params.authMethod === 'basic_auth' && params.username && params.password) {
    const credentials = Buffer.from(`${params.username}:${params.password}`).toString('base64')
    headers.Authorization = `Basic ${credentials}`
  } else {
    throw new Error('Invalid authentication configuration')
  }

  return headers
}

export const countTool: ToolConfig<ElasticsearchCountParams, ElasticsearchCountResponse> = {
  id: 'elasticsearch_count',
  name: 'Elasticsearch Count',
  description: 'Count documents matching a query in Elasticsearch.',
  version: '1.0.0',

  params: {
    deploymentType: {
      type: 'string',
      required: true,
      description: 'Deployment type: self_hosted or cloud',
    },
    host: {
      type: 'string',
      required: false,
      description: 'Elasticsearch host URL (for self-hosted)',
    },
    cloudId: {
      type: 'string',
      required: false,
      description: 'Elastic Cloud ID (for cloud deployments)',
    },
    authMethod: {
      type: 'string',
      required: true,
      description: 'Authentication method: api_key or basic_auth',
    },
    apiKey: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Elasticsearch API key',
    },
    username: {
      type: 'string',
      required: false,
      description: 'Username for basic auth',
    },
    password: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Password for basic auth',
    },
    index: {
      type: 'string',
      required: true,
      description: 'Index name to count documents in',
    },
    query: {
      type: 'string',
      required: false,
      description: 'Optional query to filter documents (JSON string)',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = buildBaseUrl(params)
      return `${baseUrl}/${encodeURIComponent(params.index)}/_count`
    },
    method: 'POST',
    headers: (params) => buildAuthHeaders(params),
    body: (params) => {
      if (params.query) {
        try {
          return { query: JSON.parse(params.query) }
        } catch {
          return {}
        }
      }
      return {}
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = `Elasticsearch error: ${response.status}`
      try {
        const errorJson = JSON.parse(errorText)
        errorMessage = errorJson.error?.reason || errorJson.error?.type || errorMessage
      } catch {
        errorMessage = errorText || errorMessage
      }
      return {
        success: false,
        output: {
          count: 0,
          _shards: { total: 0, successful: 0, skipped: 0, failed: 0 },
        },
        error: errorMessage,
      }
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        count: data.count,
        _shards: data._shards,
      },
    }
  },

  outputs: {
    count: {
      type: 'number',
      description: 'Number of documents matching the query',
    },
    _shards: {
      type: 'object',
      description: 'Shard statistics',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_index.ts]---
Location: sim-main/apps/sim/tools/elasticsearch/create_index.ts

```typescript
import type {
  ElasticsearchCreateIndexParams,
  ElasticsearchIndexResponse,
} from '@/tools/elasticsearch/types'
import type { ToolConfig } from '@/tools/types'

function buildBaseUrl(params: ElasticsearchCreateIndexParams): string {
  if (params.deploymentType === 'cloud' && params.cloudId) {
    const parts = params.cloudId.split(':')
    if (parts.length >= 2) {
      try {
        const decoded = Buffer.from(parts[1], 'base64').toString('utf-8')
        const [esHost] = decoded.split('$')
        if (esHost) {
          return `https://${parts[0]}.${esHost}`
        }
      } catch {
        // Fallback
      }
    }
    throw new Error('Invalid Cloud ID format')
  }

  if (!params.host) {
    throw new Error('Host is required for self-hosted deployments')
  }

  return params.host.replace(/\/$/, '')
}

function buildAuthHeaders(params: ElasticsearchCreateIndexParams): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (params.authMethod === 'api_key' && params.apiKey) {
    headers.Authorization = `ApiKey ${params.apiKey}`
  } else if (params.authMethod === 'basic_auth' && params.username && params.password) {
    const credentials = Buffer.from(`${params.username}:${params.password}`).toString('base64')
    headers.Authorization = `Basic ${credentials}`
  } else {
    throw new Error('Invalid authentication configuration')
  }

  return headers
}

export const createIndexTool: ToolConfig<
  ElasticsearchCreateIndexParams,
  ElasticsearchIndexResponse
> = {
  id: 'elasticsearch_create_index',
  name: 'Elasticsearch Create Index',
  description: 'Create a new index with optional settings and mappings.',
  version: '1.0.0',

  params: {
    deploymentType: {
      type: 'string',
      required: true,
      description: 'Deployment type: self_hosted or cloud',
    },
    host: {
      type: 'string',
      required: false,
      description: 'Elasticsearch host URL (for self-hosted)',
    },
    cloudId: {
      type: 'string',
      required: false,
      description: 'Elastic Cloud ID (for cloud deployments)',
    },
    authMethod: {
      type: 'string',
      required: true,
      description: 'Authentication method: api_key or basic_auth',
    },
    apiKey: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Elasticsearch API key',
    },
    username: {
      type: 'string',
      required: false,
      description: 'Username for basic auth',
    },
    password: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Password for basic auth',
    },
    index: {
      type: 'string',
      required: true,
      description: 'Index name to create',
    },
    settings: {
      type: 'string',
      required: false,
      description: 'Index settings as JSON string',
    },
    mappings: {
      type: 'string',
      required: false,
      description: 'Index mappings as JSON string',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = buildBaseUrl(params)
      return `${baseUrl}/${encodeURIComponent(params.index)}`
    },
    method: 'PUT',
    headers: (params) => buildAuthHeaders(params),
    body: (params) => {
      const body: Record<string, unknown> = {}

      if (params.settings) {
        try {
          body.settings = JSON.parse(params.settings)
        } catch {
          // Ignore invalid settings
        }
      }

      if (params.mappings) {
        try {
          body.mappings = JSON.parse(params.mappings)
        } catch {
          // Ignore invalid mappings
        }
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = `Elasticsearch error: ${response.status}`
      try {
        const errorJson = JSON.parse(errorText)
        errorMessage = errorJson.error?.reason || errorJson.error?.type || errorMessage
      } catch {
        errorMessage = errorText || errorMessage
      }
      return {
        success: false,
        output: { acknowledged: false },
        error: errorMessage,
      }
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        acknowledged: data.acknowledged,
        shards_acknowledged: data.shards_acknowledged,
        index: data.index,
      },
    }
  },

  outputs: {
    acknowledged: {
      type: 'boolean',
      description: 'Whether the request was acknowledged',
    },
    shards_acknowledged: {
      type: 'boolean',
      description: 'Whether the shards were acknowledged',
    },
    index: {
      type: 'string',
      description: 'Created index name',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_document.ts]---
Location: sim-main/apps/sim/tools/elasticsearch/delete_document.ts

```typescript
import type {
  ElasticsearchDeleteDocumentParams,
  ElasticsearchDocumentResponse,
} from '@/tools/elasticsearch/types'
import type { ToolConfig } from '@/tools/types'

function buildBaseUrl(params: ElasticsearchDeleteDocumentParams): string {
  if (params.deploymentType === 'cloud' && params.cloudId) {
    const parts = params.cloudId.split(':')
    if (parts.length >= 2) {
      try {
        const decoded = Buffer.from(parts[1], 'base64').toString('utf-8')
        const [esHost] = decoded.split('$')
        if (esHost) {
          return `https://${parts[0]}.${esHost}`
        }
      } catch {
        // Fallback
      }
    }
    throw new Error('Invalid Cloud ID format')
  }

  if (!params.host) {
    throw new Error('Host is required for self-hosted deployments')
  }

  return params.host.replace(/\/$/, '')
}

function buildAuthHeaders(params: ElasticsearchDeleteDocumentParams): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (params.authMethod === 'api_key' && params.apiKey) {
    headers.Authorization = `ApiKey ${params.apiKey}`
  } else if (params.authMethod === 'basic_auth' && params.username && params.password) {
    const credentials = Buffer.from(`${params.username}:${params.password}`).toString('base64')
    headers.Authorization = `Basic ${credentials}`
  } else {
    throw new Error('Invalid authentication configuration')
  }

  return headers
}

export const deleteDocumentTool: ToolConfig<
  ElasticsearchDeleteDocumentParams,
  ElasticsearchDocumentResponse
> = {
  id: 'elasticsearch_delete_document',
  name: 'Elasticsearch Delete Document',
  description: 'Delete a document from Elasticsearch by ID.',
  version: '1.0.0',

  params: {
    deploymentType: {
      type: 'string',
      required: true,
      description: 'Deployment type: self_hosted or cloud',
    },
    host: {
      type: 'string',
      required: false,
      description: 'Elasticsearch host URL (for self-hosted)',
    },
    cloudId: {
      type: 'string',
      required: false,
      description: 'Elastic Cloud ID (for cloud deployments)',
    },
    authMethod: {
      type: 'string',
      required: true,
      description: 'Authentication method: api_key or basic_auth',
    },
    apiKey: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Elasticsearch API key',
    },
    username: {
      type: 'string',
      required: false,
      description: 'Username for basic auth',
    },
    password: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Password for basic auth',
    },
    index: {
      type: 'string',
      required: true,
      description: 'Index name',
    },
    documentId: {
      type: 'string',
      required: true,
      description: 'Document ID to delete',
    },
    refresh: {
      type: 'string',
      required: false,
      description: 'Refresh policy: true, false, or wait_for',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = buildBaseUrl(params)
      let url = `${baseUrl}/${encodeURIComponent(params.index)}/_doc/${encodeURIComponent(params.documentId)}`

      if (params.refresh) {
        url += `?refresh=${params.refresh}`
      }

      return url
    },
    method: 'DELETE',
    headers: (params) => buildAuthHeaders(params),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: true,
          output: {
            _index: '',
            _id: '',
            result: 'not_found',
          },
        }
      }

      const errorText = await response.text()
      let errorMessage = `Elasticsearch error: ${response.status}`
      try {
        const errorJson = JSON.parse(errorText)
        errorMessage = errorJson.error?.reason || errorJson.error?.type || errorMessage
      } catch {
        errorMessage = errorText || errorMessage
      }
      return {
        success: false,
        output: { _index: '', _id: '' },
        error: errorMessage,
      }
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        _index: data._index,
        _id: data._id,
        _version: data._version,
        result: data.result,
      },
    }
  },

  outputs: {
    _index: {
      type: 'string',
      description: 'Index name',
    },
    _id: {
      type: 'string',
      description: 'Document ID',
    },
    _version: {
      type: 'number',
      description: 'Document version',
    },
    result: {
      type: 'string',
      description: 'Operation result (deleted or not_found)',
    },
  },
}
```

--------------------------------------------------------------------------------

````
