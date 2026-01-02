---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 667
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 667 of 933)

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

---[FILE: delete_index.ts]---
Location: sim-main/apps/sim/tools/elasticsearch/delete_index.ts

```typescript
import type {
  ElasticsearchDeleteIndexParams,
  ElasticsearchIndexResponse,
} from '@/tools/elasticsearch/types'
import type { ToolConfig } from '@/tools/types'

function buildBaseUrl(params: ElasticsearchDeleteIndexParams): string {
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

function buildAuthHeaders(params: ElasticsearchDeleteIndexParams): Record<string, string> {
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

export const deleteIndexTool: ToolConfig<
  ElasticsearchDeleteIndexParams,
  ElasticsearchIndexResponse
> = {
  id: 'elasticsearch_delete_index',
  name: 'Elasticsearch Delete Index',
  description: 'Delete an index and all its documents. This operation is irreversible.',
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
      description: 'Index name to delete',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = buildBaseUrl(params)
      return `${baseUrl}/${encodeURIComponent(params.index)}`
    },
    method: 'DELETE',
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
        output: { acknowledged: false },
        error: errorMessage,
      }
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        acknowledged: data.acknowledged,
      },
    }
  },

  outputs: {
    acknowledged: {
      type: 'boolean',
      description: 'Whether the deletion was acknowledged',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_document.ts]---
Location: sim-main/apps/sim/tools/elasticsearch/get_document.ts

```typescript
import type {
  ElasticsearchDocumentResponse,
  ElasticsearchGetDocumentParams,
} from '@/tools/elasticsearch/types'
import type { ToolConfig } from '@/tools/types'

function buildBaseUrl(params: ElasticsearchGetDocumentParams): string {
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

function buildAuthHeaders(params: ElasticsearchGetDocumentParams): Record<string, string> {
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

export const getDocumentTool: ToolConfig<
  ElasticsearchGetDocumentParams,
  ElasticsearchDocumentResponse
> = {
  id: 'elasticsearch_get_document',
  name: 'Elasticsearch Get Document',
  description: 'Retrieve a document by ID from Elasticsearch.',
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
      description: 'Document ID to retrieve',
    },
    sourceIncludes: {
      type: 'string',
      required: false,
      description: 'Comma-separated list of fields to include',
    },
    sourceExcludes: {
      type: 'string',
      required: false,
      description: 'Comma-separated list of fields to exclude',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = buildBaseUrl(params)
      let url = `${baseUrl}/${encodeURIComponent(params.index)}/_doc/${encodeURIComponent(params.documentId)}`

      const queryParams: string[] = []
      if (params.sourceIncludes) {
        queryParams.push(`_source_includes=${encodeURIComponent(params.sourceIncludes)}`)
      }
      if (params.sourceExcludes) {
        queryParams.push(`_source_excludes=${encodeURIComponent(params.sourceExcludes)}`)
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
      if (response.status === 404) {
        return {
          success: true,
          output: {
            _index: '',
            _id: '',
            found: false,
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
        found: data.found,
        _source: data._source,
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
    found: {
      type: 'boolean',
      description: 'Whether the document was found',
    },
    _source: {
      type: 'json',
      description: 'Document content',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_index.ts]---
Location: sim-main/apps/sim/tools/elasticsearch/get_index.ts

```typescript
import type {
  ElasticsearchGetIndexParams,
  ElasticsearchIndexInfoResponse,
} from '@/tools/elasticsearch/types'
import type { ToolConfig } from '@/tools/types'

function buildBaseUrl(params: ElasticsearchGetIndexParams): string {
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

function buildAuthHeaders(params: ElasticsearchGetIndexParams): Record<string, string> {
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

export const getIndexTool: ToolConfig<ElasticsearchGetIndexParams, ElasticsearchIndexInfoResponse> =
  {
    id: 'elasticsearch_get_index',
    name: 'Elasticsearch Get Index',
    description: 'Retrieve index information including settings, mappings, and aliases.',
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
        description: 'Index name to retrieve info for',
      },
    },

    request: {
      url: (params) => {
        const baseUrl = buildBaseUrl(params)
        return `${baseUrl}/${encodeURIComponent(params.index)}`
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
          output: {},
          error: errorMessage,
        }
      }

      const data = await response.json()

      return {
        success: true,
        output: data,
      }
    },

    outputs: {
      index: {
        type: 'json',
        description: 'Index information including aliases, mappings, and settings',
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/elasticsearch/index.ts

```typescript
// Elasticsearch tools exports
import { bulkTool } from '@/tools/elasticsearch/bulk'
import { clusterHealthTool } from '@/tools/elasticsearch/cluster_health'
import { clusterStatsTool } from '@/tools/elasticsearch/cluster_stats'
import { countTool } from '@/tools/elasticsearch/count'
import { createIndexTool } from '@/tools/elasticsearch/create_index'
import { deleteDocumentTool } from '@/tools/elasticsearch/delete_document'
import { deleteIndexTool } from '@/tools/elasticsearch/delete_index'
import { getDocumentTool } from '@/tools/elasticsearch/get_document'
import { getIndexTool } from '@/tools/elasticsearch/get_index'
import { indexDocumentTool } from '@/tools/elasticsearch/index_document'
import { searchTool } from '@/tools/elasticsearch/search'
import { updateDocumentTool } from '@/tools/elasticsearch/update_document'

// Export individual tools with elasticsearch prefix
export const elasticsearchSearchTool = searchTool
export const elasticsearchIndexDocumentTool = indexDocumentTool
export const elasticsearchGetDocumentTool = getDocumentTool
export const elasticsearchUpdateDocumentTool = updateDocumentTool
export const elasticsearchDeleteDocumentTool = deleteDocumentTool
export const elasticsearchBulkTool = bulkTool
export const elasticsearchCountTool = countTool
export const elasticsearchCreateIndexTool = createIndexTool
export const elasticsearchDeleteIndexTool = deleteIndexTool
export const elasticsearchGetIndexTool = getIndexTool
export const elasticsearchClusterHealthTool = clusterHealthTool
export const elasticsearchClusterStatsTool = clusterStatsTool
```

--------------------------------------------------------------------------------

---[FILE: index_document.ts]---
Location: sim-main/apps/sim/tools/elasticsearch/index_document.ts

```typescript
import type {
  ElasticsearchDocumentResponse,
  ElasticsearchIndexDocumentParams,
} from '@/tools/elasticsearch/types'
import type { ToolConfig } from '@/tools/types'

function buildBaseUrl(params: ElasticsearchIndexDocumentParams): string {
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

function buildAuthHeaders(params: ElasticsearchIndexDocumentParams): Record<string, string> {
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

export const indexDocumentTool: ToolConfig<
  ElasticsearchIndexDocumentParams,
  ElasticsearchDocumentResponse
> = {
  id: 'elasticsearch_index_document',
  name: 'Elasticsearch Index Document',
  description: 'Index (create or update) a document in Elasticsearch.',
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
      description: 'Target index name',
    },
    documentId: {
      type: 'string',
      required: false,
      description: 'Document ID (auto-generated if not provided)',
    },
    document: {
      type: 'string',
      required: true,
      description: 'Document body as JSON string',
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
      let url = `${baseUrl}/${encodeURIComponent(params.index)}/_doc`
      if (params.documentId) {
        url += `/${encodeURIComponent(params.documentId)}`
      }
      if (params.refresh) {
        url += `?refresh=${params.refresh}`
      }
      return url
    },
    method: (params) => (params.documentId ? 'PUT' : 'POST'),
    headers: (params) => buildAuthHeaders(params),
    body: (params) => {
      try {
        return JSON.parse(params.document)
      } catch {
        throw new Error('Invalid JSON document')
      }
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
      description: 'Index where the document was stored',
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
      description: 'Operation result (created or updated)',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: search.ts]---
Location: sim-main/apps/sim/tools/elasticsearch/search.ts

```typescript
import type {
  ElasticsearchSearchParams,
  ElasticsearchSearchResponse,
} from '@/tools/elasticsearch/types'
import type { ToolConfig } from '@/tools/types'

// Helper to build base URL from connection params
function buildBaseUrl(params: ElasticsearchSearchParams): string {
  if (params.deploymentType === 'cloud' && params.cloudId) {
    // Parse Cloud ID: format is "name:base64data"
    // The base64 data contains: es_host$kibana_host ($ separated)
    const parts = params.cloudId.split(':')
    if (parts.length >= 2) {
      try {
        const decoded = Buffer.from(parts[1], 'base64').toString('utf-8')
        const [esHost] = decoded.split('$')
        if (esHost) {
          // Cloud endpoints are always HTTPS with port 443
          return `https://${parts[0]}.${esHost}`
        }
      } catch {
        // If decoding fails, try using cloudId directly as host
      }
    }
    throw new Error('Invalid Cloud ID format')
  }

  if (!params.host) {
    throw new Error('Host is required for self-hosted deployments')
  }

  return params.host.replace(/\/$/, '') // Remove trailing slash
}

// Helper to build auth headers
function buildAuthHeaders(params: ElasticsearchSearchParams): Record<string, string> {
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

export const searchTool: ToolConfig<ElasticsearchSearchParams, ElasticsearchSearchResponse> = {
  id: 'elasticsearch_search',
  name: 'Elasticsearch Search',
  description:
    'Search documents in Elasticsearch using Query DSL. Returns matching documents with scores and metadata.',
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
      description: 'Index name to search',
    },
    query: {
      type: 'string',
      required: false,
      description: 'Query DSL as JSON string',
    },
    from: {
      type: 'number',
      required: false,
      description: 'Starting offset for pagination (default: 0)',
    },
    size: {
      type: 'number',
      required: false,
      description: 'Number of results to return (default: 10)',
    },
    sort: {
      type: 'string',
      required: false,
      description: 'Sort specification as JSON string',
    },
    sourceIncludes: {
      type: 'string',
      required: false,
      description: 'Comma-separated list of fields to include in _source',
    },
    sourceExcludes: {
      type: 'string',
      required: false,
      description: 'Comma-separated list of fields to exclude from _source',
    },
    trackTotalHits: {
      type: 'boolean',
      required: false,
      description: 'Track accurate total hit count (default: true)',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = buildBaseUrl(params)
      return `${baseUrl}/${encodeURIComponent(params.index)}/_search`
    },
    method: 'POST',
    headers: (params) => buildAuthHeaders(params),
    body: (params) => {
      const body: Record<string, unknown> = {}

      if (params.query) {
        try {
          body.query = JSON.parse(params.query)
        } catch {
          // If not valid JSON, treat as simple match query
          body.query = { match_all: {} }
        }
      }

      if (params.from !== undefined) body.from = params.from
      if (params.size !== undefined) body.size = params.size

      if (params.sort) {
        try {
          body.sort = JSON.parse(params.sort)
        } catch {
          // Ignore invalid sort
        }
      }

      if (params.sourceIncludes || params.sourceExcludes) {
        body._source = {}
        if (params.sourceIncludes) {
          ;(body._source as Record<string, unknown>).includes = params.sourceIncludes
            .split(',')
            .map((s) => s.trim())
        }
        if (params.sourceExcludes) {
          ;(body._source as Record<string, unknown>).excludes = params.sourceExcludes
            .split(',')
            .map((s) => s.trim())
        }
      }

      if (params.trackTotalHits !== undefined) {
        body.track_total_hits = params.trackTotalHits
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
        output: {
          took: 0,
          timed_out: false,
          hits: { total: { value: 0, relation: 'eq' }, max_score: null, hits: [] },
        },
        error: errorMessage,
      }
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        took: data.took,
        timed_out: data.timed_out,
        hits: {
          total: data.hits.total,
          max_score: data.hits.max_score,
          hits: data.hits.hits.map((hit: Record<string, unknown>) => ({
            _index: hit._index,
            _id: hit._id,
            _score: hit._score,
            _source: hit._source,
          })),
        },
        aggregations: data.aggregations,
      },
    }
  },

  outputs: {
    took: {
      type: 'number',
      description: 'Time in milliseconds the search took',
    },
    timed_out: {
      type: 'boolean',
      description: 'Whether the search timed out',
    },
    hits: {
      type: 'object',
      description: 'Search results with total count and matching documents',
    },
    aggregations: {
      type: 'json',
      description: 'Aggregation results if any',
      optional: true,
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/elasticsearch/types.ts

```typescript
// Common types for Elasticsearch tools
import type { ToolResponse } from '@/tools/types'

// Base params for all Elasticsearch tools
export interface ElasticsearchBaseParams {
  // Connection configuration
  deploymentType: 'self_hosted' | 'cloud'
  host?: string // For self-hosted
  cloudId?: string // For Elastic Cloud
  // Authentication
  authMethod: 'api_key' | 'basic_auth'
  apiKey?: string
  username?: string
  password?: string
}

// Document Operations
export interface ElasticsearchIndexDocumentParams extends ElasticsearchBaseParams {
  index: string
  documentId?: string
  document: string // JSON string
  refresh?: 'true' | 'false' | 'wait_for'
}

export interface ElasticsearchGetDocumentParams extends ElasticsearchBaseParams {
  index: string
  documentId: string
  sourceIncludes?: string
  sourceExcludes?: string
}

export interface ElasticsearchUpdateDocumentParams extends ElasticsearchBaseParams {
  index: string
  documentId: string
  document: string // JSON string (partial document)
  retryOnConflict?: number
}

export interface ElasticsearchDeleteDocumentParams extends ElasticsearchBaseParams {
  index: string
  documentId: string
  refresh?: 'true' | 'false' | 'wait_for'
}

export interface ElasticsearchBulkParams extends ElasticsearchBaseParams {
  index?: string
  operations: string // NDJSON string
  refresh?: 'true' | 'false' | 'wait_for'
}

// Search Operations
export interface ElasticsearchSearchParams extends ElasticsearchBaseParams {
  index: string
  query?: string // JSON string
  from?: number
  size?: number
  sort?: string // JSON string
  sourceIncludes?: string
  sourceExcludes?: string
  trackTotalHits?: boolean
}

export interface ElasticsearchCountParams extends ElasticsearchBaseParams {
  index: string
  query?: string // JSON string
}

// Index Management Operations
export interface ElasticsearchCreateIndexParams extends ElasticsearchBaseParams {
  index: string
  settings?: string // JSON string
  mappings?: string // JSON string
}

export interface ElasticsearchDeleteIndexParams extends ElasticsearchBaseParams {
  index: string
}

export interface ElasticsearchGetIndexParams extends ElasticsearchBaseParams {
  index: string
}

export interface ElasticsearchIndexExistsParams extends ElasticsearchBaseParams {
  index: string
}

export interface ElasticsearchRefreshIndexParams extends ElasticsearchBaseParams {
  index: string
}

export interface ElasticsearchIndexStatsParams extends ElasticsearchBaseParams {
  index: string
}

// Mapping Operations
export interface ElasticsearchPutMappingParams extends ElasticsearchBaseParams {
  index: string
  mappings: string // JSON string
}

export interface ElasticsearchGetMappingParams extends ElasticsearchBaseParams {
  index: string
}

// Cluster Operations
export interface ElasticsearchClusterHealthParams extends ElasticsearchBaseParams {
  waitForStatus?: 'green' | 'yellow' | 'red'
  timeout?: string
}

export interface ElasticsearchClusterStatsParams extends ElasticsearchBaseParams {}

// Response types
export interface ElasticsearchDocumentResponse extends ToolResponse {
  output: {
    _index: string
    _id: string
    _version?: number
    result?: 'created' | 'updated' | 'deleted' | 'not_found' | 'noop'
    _source?: Record<string, unknown>
    found?: boolean
  }
}

export interface ElasticsearchSearchResponse extends ToolResponse {
  output: {
    took: number
    timed_out: boolean
    hits: {
      total: { value: number; relation: string }
      max_score: number | null
      hits: Array<{
        _index: string
        _id: string
        _score: number | null
        _source: Record<string, unknown>
      }>
    }
    aggregations?: Record<string, unknown>
  }
}

export interface ElasticsearchCountResponse extends ToolResponse {
  output: {
    count: number
    _shards: {
      total: number
      successful: number
      skipped: number
      failed: number
    }
  }
}

export interface ElasticsearchBulkResponse extends ToolResponse {
  output: {
    took: number
    errors: boolean
    items: Array<{
      index?: { _index: string; _id: string; result: string; status: number }
      create?: { _index: string; _id: string; result: string; status: number }
      update?: { _index: string; _id: string; result: string; status: number }
      delete?: { _index: string; _id: string; result: string; status: number }
    }>
  }
}

export interface ElasticsearchIndexResponse extends ToolResponse {
  output: {
    acknowledged: boolean
    shards_acknowledged?: boolean
    index?: string
  }
}

export interface ElasticsearchIndexInfoResponse extends ToolResponse {
  output: Record<
    string,
    {
      aliases: Record<string, unknown>
      mappings: Record<string, unknown>
      settings: Record<string, unknown>
    }
  >
}

export interface ElasticsearchIndexExistsResponse extends ToolResponse {
  output: {
    exists: boolean
  }
}

export interface ElasticsearchMappingResponse extends ToolResponse {
  output: Record<string, { mappings: Record<string, unknown> }>
}

export interface ElasticsearchClusterHealthResponse extends ToolResponse {
  output: {
    cluster_name: string
    status: 'green' | 'yellow' | 'red'
    timed_out: boolean
    number_of_nodes: number
    number_of_data_nodes: number
    active_primary_shards: number
    active_shards: number
    relocating_shards: number
    initializing_shards: number
    unassigned_shards: number
    delayed_unassigned_shards: number
    number_of_pending_tasks: number
    number_of_in_flight_fetch: number
    task_max_waiting_in_queue_millis: number
    active_shards_percent_as_number: number
  }
}

export interface ElasticsearchClusterStatsResponse extends ToolResponse {
  output: {
    cluster_name: string
    cluster_uuid: string
    status: string
    nodes: {
      count: { total: number; data: number; master: number }
      versions: string[]
    }
    indices: {
      count: number
      docs: { count: number; deleted: number }
      store: { size_in_bytes: number }
      shards: { total: number; primaries: number }
    }
  }
}

export interface ElasticsearchRefreshResponse extends ToolResponse {
  output: {
    _shards: {
      total: number
      successful: number
      failed: number
    }
  }
}

export interface ElasticsearchIndexStatsResponse extends ToolResponse {
  output: {
    _all: {
      primaries: {
        docs: { count: number; deleted: number }
        store: { size_in_bytes: number }
        indexing: { index_total: number }
        search: { query_total: number }
      }
      total: {
        docs: { count: number; deleted: number }
        store: { size_in_bytes: number }
        indexing: { index_total: number }
        search: { query_total: number }
      }
    }
    indices: Record<string, unknown>
  }
}

// Union type for all Elasticsearch responses
export type ElasticsearchResponse =
  | ElasticsearchDocumentResponse
  | ElasticsearchSearchResponse
  | ElasticsearchCountResponse
  | ElasticsearchBulkResponse
  | ElasticsearchIndexResponse
  | ElasticsearchIndexInfoResponse
  | ElasticsearchIndexExistsResponse
  | ElasticsearchMappingResponse
  | ElasticsearchClusterHealthResponse
  | ElasticsearchClusterStatsResponse
  | ElasticsearchRefreshResponse
  | ElasticsearchIndexStatsResponse
```

--------------------------------------------------------------------------------

---[FILE: update_document.ts]---
Location: sim-main/apps/sim/tools/elasticsearch/update_document.ts

```typescript
import type {
  ElasticsearchDocumentResponse,
  ElasticsearchUpdateDocumentParams,
} from '@/tools/elasticsearch/types'
import type { ToolConfig } from '@/tools/types'

function buildBaseUrl(params: ElasticsearchUpdateDocumentParams): string {
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

function buildAuthHeaders(params: ElasticsearchUpdateDocumentParams): Record<string, string> {
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

export const updateDocumentTool: ToolConfig<
  ElasticsearchUpdateDocumentParams,
  ElasticsearchDocumentResponse
> = {
  id: 'elasticsearch_update_document',
  name: 'Elasticsearch Update Document',
  description: 'Partially update a document in Elasticsearch using doc merge.',
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
      description: 'Document ID to update',
    },
    document: {
      type: 'string',
      required: true,
      description: 'Partial document to merge as JSON string',
    },
    retryOnConflict: {
      type: 'number',
      required: false,
      description: 'Number of retries on version conflict',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = buildBaseUrl(params)
      let url = `${baseUrl}/${encodeURIComponent(params.index)}/_update/${encodeURIComponent(params.documentId)}`

      if (params.retryOnConflict !== undefined) {
        url += `?retry_on_conflict=${params.retryOnConflict}`
      }

      return url
    },
    method: 'POST',
    headers: (params) => buildAuthHeaders(params),
    body: (params) => {
      try {
        return { doc: JSON.parse(params.document) }
      } catch {
        throw new Error('Invalid JSON document')
      }
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
      description: 'New document version',
    },
    result: {
      type: 'string',
      description: 'Operation result (updated or noop)',
    },
  },
}
```

--------------------------------------------------------------------------------

````
