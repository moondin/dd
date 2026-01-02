---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 737
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 737 of 933)

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

---[FILE: update_property_definition.ts]---
Location: sim-main/apps/sim/tools/posthog/update_property_definition.ts

```typescript
import type { ToolConfig } from '@/tools/types'

interface PostHogUpdatePropertyDefinitionParams {
  projectId: string
  propertyDefinitionId: string
  region: 'us' | 'eu'
  apiKey: string
  description?: string
  tags?: string
  verified?: boolean
  property_type?: string
}

interface PropertyDefinition {
  id: string
  name: string
  description: string
  tags: string[]
  is_numerical: boolean
  is_seen_on_filtered_events: boolean | null
  property_type: string
  type: 'event' | 'person' | 'group'
  volume_30_day: number | null
  query_usage_30_day: number | null
  created_at: string
  updated_at: string
  updated_by: {
    id: number
    uuid: string
    distinct_id: string
    first_name: string
    email: string
  } | null
  verified: boolean
  verified_at: string | null
  verified_by: string | null
  example: string | null
}

export const updatePropertyDefinitionTool: ToolConfig<
  PostHogUpdatePropertyDefinitionParams,
  PropertyDefinition
> = {
  id: 'posthog_update_property_definition',
  name: 'PostHog Update Property Definition',
  description:
    'Update a property definition in PostHog. Can modify description, tags, property type, and verification status to maintain clean property schemas.',
  version: '1.0.0',

  params: {
    projectId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'PostHog Project ID',
    },
    propertyDefinitionId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Property Definition ID to update',
    },
    region: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'PostHog cloud region: us or eu',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'PostHog Personal API Key',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated description for the property',
    },
    tags: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Comma-separated list of tags to associate with the property',
    },
    verified: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Whether to mark the property as verified',
    },
    property_type: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'The data type of the property (e.g., String, Numeric, Boolean, DateTime, etc.)',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = params.region === 'eu' ? 'https://eu.posthog.com' : 'https://us.posthog.com'
      return `${baseUrl}/api/projects/${params.projectId}/property_definitions/${params.propertyDefinitionId}`
    },
    method: 'PATCH',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: Record<string, any> = {}

      if (params.description !== undefined) {
        body.description = params.description
      }

      if (params.tags) {
        body.tags = params.tags
          .split(',')
          .map((tag: string) => tag.trim())
          .filter((tag: string) => tag.length > 0)
      }

      if (params.verified !== undefined) {
        body.verified = params.verified
      }

      if (params.property_type !== undefined) {
        body.property_type = params.property_type
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      tags: data.tags || [],
      is_numerical: data.is_numerical || false,
      is_seen_on_filtered_events: data.is_seen_on_filtered_events,
      property_type: data.property_type,
      type: data.type,
      volume_30_day: data.volume_30_day,
      query_usage_30_day: data.query_usage_30_day,
      created_at: data.created_at,
      updated_at: data.updated_at,
      updated_by: data.updated_by,
      verified: data.verified || false,
      verified_at: data.verified_at,
      verified_by: data.verified_by,
      example: data.example,
    }
  },

  outputs: {
    id: {
      type: 'string',
      description: 'Unique identifier for the property definition',
    },
    name: {
      type: 'string',
      description: 'Property name',
    },
    description: {
      type: 'string',
      description: 'Updated property description',
    },
    tags: {
      type: 'array',
      description: 'Updated tags associated with the property',
    },
    is_numerical: {
      type: 'boolean',
      description: 'Whether the property is numerical',
    },
    is_seen_on_filtered_events: {
      type: 'boolean',
      description: 'Whether the property is seen on filtered events',
    },
    property_type: {
      type: 'string',
      description: 'The data type of the property',
    },
    type: {
      type: 'string',
      description: 'Property type: event, person, or group',
    },
    volume_30_day: {
      type: 'number',
      description: 'Number of times property was seen in the last 30 days',
    },
    query_usage_30_day: {
      type: 'number',
      description: 'Number of times this property was queried in the last 30 days',
    },
    created_at: {
      type: 'string',
      description: 'ISO timestamp when the property was created',
    },
    updated_at: {
      type: 'string',
      description: 'ISO timestamp when the property was updated',
    },
    updated_by: {
      type: 'object',
      description: 'User who last updated the property',
    },
    verified: {
      type: 'boolean',
      description: 'Whether the property has been verified',
    },
    verified_at: {
      type: 'string',
      description: 'ISO timestamp when the property was verified',
    },
    verified_by: {
      type: 'string',
      description: 'User who verified the property',
    },
    example: {
      type: 'string',
      description: 'Example value for the property',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_survey.ts]---
Location: sim-main/apps/sim/tools/posthog/update_survey.ts

```typescript
import type { ToolConfig } from '@/tools/types'

interface PostHogSurveyQuestion {
  type: 'open' | 'link' | 'rating' | 'multiple_choice'
  question: string
  description?: string
  choices?: string[]
  scale?: number
  lowerBoundLabel?: string
  upperBoundLabel?: string
  buttonText?: string
}

interface PostHogUpdateSurveyParams {
  apiKey: string
  projectId: string
  surveyId: string
  region?: 'us' | 'eu'
  name?: string
  description?: string
  type?: 'popover' | 'api'
  questions?: string // JSON string of questions array
  startDate?: string
  endDate?: string
  appearance?: string // JSON string of appearance config
  conditions?: string // JSON string of conditions
  targetingFlagFilters?: string // JSON string of targeting filters
  linkedFlagId?: string
  responsesLimit?: number
  archived?: boolean
}

interface PostHogSurvey {
  id: string
  name: string
  description: string
  type: 'popover' | 'api'
  questions: PostHogSurveyQuestion[]
  appearance?: Record<string, any>
  conditions?: Record<string, any>
  created_at: string
  created_by: Record<string, any>
  start_date?: string
  end_date?: string
  archived?: boolean
  targeting_flag_filters?: Record<string, any>
  linked_flag?: Record<string, any>
  responses_limit?: number
}

interface PostHogUpdateSurveyResponse {
  success: boolean
  output: {
    survey: PostHogSurvey
  }
}

export const updateSurveyTool: ToolConfig<PostHogUpdateSurveyParams, PostHogUpdateSurveyResponse> =
  {
    id: 'posthog_update_survey',
    name: 'PostHog Update Survey',
    description:
      'Update an existing survey in PostHog. Can modify questions, appearance, conditions, and other settings.',
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
        description: 'PostHog Project ID',
      },
      surveyId: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description: 'Survey ID to update',
      },
      region: {
        type: 'string',
        required: false,
        visibility: 'user-only',
        description: 'PostHog cloud region: us or eu (default: us)',
        default: 'us',
      },
      name: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Survey name',
      },
      description: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Survey description',
      },
      type: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Survey type: popover or api',
      },
      questions: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description:
          'JSON string of survey questions array. Each question must have type (open/link/rating/multiple_choice) and question text.',
      },
      startDate: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Survey start date in ISO 8601 format',
      },
      endDate: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Survey end date in ISO 8601 format',
      },
      appearance: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'JSON string of appearance configuration (colors, position, etc.)',
      },
      conditions: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'JSON string of display conditions (URL matching, etc.)',
      },
      targetingFlagFilters: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'JSON string of feature flag filters for targeting',
      },
      linkedFlagId: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Feature flag ID to link to this survey',
      },
      responsesLimit: {
        type: 'number',
        required: false,
        visibility: 'user-or-llm',
        description: 'Maximum number of responses to collect',
      },
      archived: {
        type: 'boolean',
        required: false,
        visibility: 'user-or-llm',
        description: 'Archive or unarchive the survey',
      },
    },

    request: {
      url: (params) => {
        const baseUrl = params.region === 'eu' ? 'https://eu.posthog.com' : 'https://us.posthog.com'
        return `${baseUrl}/api/projects/${params.projectId}/surveys/${params.surveyId}/`
      },
      method: 'PATCH',
      headers: (params) => ({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.apiKey}`,
      }),
      body: (params) => {
        const body: Record<string, any> = {}

        if (params.name !== undefined) body.name = params.name
        if (params.description !== undefined) body.description = params.description
        if (params.type !== undefined) body.type = params.type
        if (params.questions) body.questions = JSON.parse(params.questions)
        if (params.startDate !== undefined) body.start_date = params.startDate
        if (params.endDate !== undefined) body.end_date = params.endDate
        if (params.appearance) body.appearance = JSON.parse(params.appearance)
        if (params.conditions) body.conditions = JSON.parse(params.conditions)
        if (params.targetingFlagFilters) {
          body.targeting_flag_filters = JSON.parse(params.targetingFlagFilters)
        }
        if (params.linkedFlagId !== undefined && params.linkedFlagId !== '') {
          body.linked_flag_id = params.linkedFlagId
        }
        if (params.responsesLimit !== undefined) body.responses_limit = params.responsesLimit
        if (params.archived !== undefined) body.archived = params.archived

        return body
      },
    },

    transformResponse: async (response: Response) => {
      const data = await response.json()

      return {
        success: true,
        output: {
          survey: data,
        },
      }
    },

    outputs: {
      survey: {
        type: 'object',
        description: 'Updated survey details',
        properties: {
          id: { type: 'string', description: 'Survey ID' },
          name: { type: 'string', description: 'Survey name' },
          description: { type: 'string', description: 'Survey description' },
          type: { type: 'string', description: 'Survey type (popover or api)' },
          questions: {
            type: 'array',
            description: 'Survey questions',
          },
          created_at: { type: 'string', description: 'Creation timestamp' },
          start_date: { type: 'string', description: 'Survey start date' },
          end_date: { type: 'string', description: 'Survey end date' },
          archived: { type: 'boolean', description: 'Whether survey is archived' },
        },
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: fetch_points.ts]---
Location: sim-main/apps/sim/tools/qdrant/fetch_points.ts

```typescript
import type { QdrantFetchParams, QdrantResponse } from '@/tools/qdrant/types'
import type { ToolConfig } from '@/tools/types'

export const fetchPointsTool: ToolConfig<QdrantFetchParams, QdrantResponse> = {
  id: 'qdrant_fetch_points',
  name: 'Qdrant Fetch Points',
  description: 'Fetch points by ID from a Qdrant collection',
  version: '1.0',

  params: {
    url: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Qdrant base URL',
    },
    apiKey: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Qdrant API key (optional)',
    },
    collection: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Collection name',
    },
    ids: {
      type: 'array',
      required: true,
      visibility: 'user-only',
      description: 'Array of point IDs to fetch',
    },
    fetch_return_data: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Data to return from fetch',
    },
    with_payload: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Include payload in response',
    },
    with_vector: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Include vector in response',
    },
  },

  request: {
    method: 'POST',
    url: (params) => `${params.url.replace(/\/$/, '')}/collections/${params.collection}/points`,
    headers: (params) => ({
      'Content-Type': 'application/json',
      ...(params.apiKey ? { 'api-key': params.apiKey } : {}),
    }),
    body: (params) => {
      // Calculate with_payload and with_vector from fetch_return_data if provided
      let withPayload = params.with_payload ?? false
      let withVector = params.with_vector ?? false

      if (params.fetch_return_data) {
        switch (params.fetch_return_data) {
          case 'payload_only':
            withPayload = true
            withVector = false
            break
          case 'vector_only':
            withPayload = false
            withVector = true
            break
          case 'both':
            withPayload = true
            withVector = true
            break
          case 'none':
            withPayload = false
            withVector = false
            break
        }
      }

      return {
        ids: params.ids,
        with_payload: withPayload,
        with_vector: withVector,
      }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        data: data.result,
        status: data.status,
      },
    }
  },

  outputs: {
    data: {
      type: 'array',
      description: 'Fetched points with ID, payload, and optional vector data',
    },
    status: {
      type: 'string',
      description: 'Status of the fetch operation',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/qdrant/index.ts

```typescript
import { fetchPointsTool } from '@/tools/qdrant/fetch_points'
import { searchVectorTool } from '@/tools/qdrant/search_vector'
import { upsertPointsTool } from '@/tools/qdrant/upsert_points'

export const qdrantUpsertTool = upsertPointsTool
export const qdrantSearchTool = searchVectorTool
export const qdrantFetchTool = fetchPointsTool
```

--------------------------------------------------------------------------------

---[FILE: search_vector.ts]---
Location: sim-main/apps/sim/tools/qdrant/search_vector.ts

```typescript
import type { QdrantResponse, QdrantSearchParams } from '@/tools/qdrant/types'
import type { ToolConfig } from '@/tools/types'

export const searchVectorTool: ToolConfig<QdrantSearchParams, QdrantResponse> = {
  id: 'qdrant_search_vector',
  name: 'Qdrant Search Vector',
  description: 'Search for similar vectors in a Qdrant collection',
  version: '1.0',

  params: {
    url: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Qdrant base URL',
    },
    apiKey: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Qdrant API key (optional)',
    },
    collection: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Collection name',
    },
    vector: {
      type: 'array',
      required: true,
      visibility: 'user-only',
      description: 'Vector to search for',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of results to return',
    },
    filter: {
      type: 'object',
      required: false,
      visibility: 'user-only',
      description: 'Filter to apply to the search',
    },
    search_return_data: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Data to return from search',
    },
    with_payload: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Include payload in response',
    },
    with_vector: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Include vector in response',
    },
  },

  request: {
    method: 'POST',
    url: (params) =>
      `${params.url.replace(/\/$/, '')}/collections/${encodeURIComponent(params.collection)}/points/query`,
    headers: (params) => ({
      'Content-Type': 'application/json',
      ...(params.apiKey ? { 'api-key': params.apiKey } : {}),
    }),
    body: (params) => {
      // Calculate with_payload and with_vector from search_return_data if provided
      let withPayload = params.with_payload ?? false
      let withVector = params.with_vector ?? false

      if (params.search_return_data) {
        switch (params.search_return_data) {
          case 'payload_only':
            withPayload = true
            withVector = false
            break
          case 'vector_only':
            withPayload = false
            withVector = true
            break
          case 'both':
            withPayload = true
            withVector = true
            break
          case 'none':
            withPayload = false
            withVector = false
            break
        }
      }

      return {
        query: params.vector,
        limit: params.limit ? Number(params.limit) : 10,
        filter: params.filter,
        with_payload: withPayload,
        with_vector: withVector,
      }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        data: data.result,
        status: data.status,
      },
    }
  },

  outputs: {
    data: {
      type: 'array',
      description: 'Vector search results with ID, score, payload, and optional vector data',
    },
    status: {
      type: 'string',
      description: 'Status of the search operation',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/qdrant/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface QdrantBaseParams {
  url: string
  apiKey?: string
  collection: string
}

export interface QdrantVector {
  id: string
  vector: number[]
  payload?: Record<string, any>
}

export interface QdrantUpsertParams extends QdrantBaseParams {
  points: QdrantVector[]
}

export interface QdrantSearchParams extends QdrantBaseParams {
  vector: number[]
  limit?: number
  filter?: Record<string, any>
  search_return_data?: string
  with_payload?: boolean
  with_vector?: boolean
}

export interface QdrantFetchParams extends QdrantBaseParams {
  ids: string[]
  fetch_return_data?: string
  with_payload?: boolean
  with_vector?: boolean
}

export interface QdrantResponse extends ToolResponse {
  output: {
    result?: any
    status?: string
    matches?: Array<{
      id: string
      score: number
      payload?: Record<string, any>
      vector?: number[]
    }>
    upsertedCount?: number
    data?: any
  }
}
```

--------------------------------------------------------------------------------

---[FILE: upsert_points.ts]---
Location: sim-main/apps/sim/tools/qdrant/upsert_points.ts

```typescript
import type { QdrantResponse, QdrantUpsertParams } from '@/tools/qdrant/types'
import type { ToolConfig } from '@/tools/types'

export const upsertPointsTool: ToolConfig<QdrantUpsertParams, QdrantResponse> = {
  id: 'qdrant_upsert_points',
  name: 'Qdrant Upsert Points',
  description: 'Insert or update points in a Qdrant collection',
  version: '1.0',

  params: {
    url: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Qdrant base URL',
    },
    apiKey: {
      type: 'string',
      required: false,
      description: 'Qdrant API key (optional)',
    },
    collection: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Collection name',
    },
    points: {
      type: 'array',
      required: true,
      visibility: 'user-only',
      description: 'Array of points to upsert',
    },
  },

  request: {
    method: 'PUT',
    url: (params) => `${params.url.replace(/\/$/, '')}/collections/${params.collection}/points`,
    headers: (params) => ({
      'Content-Type': 'application/json',
      ...(params.apiKey ? { 'api-key': params.apiKey } : {}),
    }),
    body: (params) => ({ points: params.points }),
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: response.ok && data.status === 'ok',
      output: {
        status: data.status,
        data: data.result,
      },
    }
  },

  outputs: {
    status: {
      type: 'string',
      description: 'Status of the upsert operation',
    },
    data: {
      type: 'object',
      description: 'Result data from the upsert operation',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/tools/qdrant/utils.ts

```typescript
export async function requestQdrant(url: string, path: string, options: RequestInit) {
  const res = await fetch(url.replace(/\/$/, '') + path, options)
  if (!res.ok) throw new Error(`Qdrant request failed: ${res.status}`)
  return res.json()
}
```

--------------------------------------------------------------------------------

---[FILE: delete.ts]---
Location: sim-main/apps/sim/tools/rds/delete.ts

```typescript
import type { RdsDeleteParams, RdsDeleteResponse } from '@/tools/rds/types'
import type { ToolConfig } from '@/tools/types'

export const deleteTool: ToolConfig<RdsDeleteParams, RdsDeleteResponse> = {
  id: 'rds_delete',
  name: 'RDS Delete',
  description: 'Delete data from an Amazon RDS table using the Data API',
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
    resourceArn: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ARN of the Aurora DB cluster',
    },
    secretArn: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ARN of the Secrets Manager secret containing DB credentials',
    },
    database: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Database name (optional)',
    },
    table: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Table name to delete from',
    },
    conditions: {
      type: 'object',
      required: true,
      visibility: 'user-or-llm',
      description: 'Conditions for the delete (e.g., {"id": 1})',
    },
  },

  request: {
    url: '/api/tools/rds/delete',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      region: params.region,
      accessKeyId: params.accessKeyId,
      secretAccessKey: params.secretAccessKey,
      resourceArn: params.resourceArn,
      secretArn: params.secretArn,
      ...(params.database && { database: params.database }),
      table: params.table,
      conditions: params.conditions,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'RDS delete failed')
    }

    return {
      success: true,
      output: {
        message: data.message || 'Delete executed successfully',
        rows: data.rows || [],
        rowCount: data.rowCount || 0,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    rows: { type: 'array', description: 'Array of deleted rows' },
    rowCount: { type: 'number', description: 'Number of rows deleted' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: execute.ts]---
Location: sim-main/apps/sim/tools/rds/execute.ts

```typescript
import type { RdsExecuteParams, RdsExecuteResponse } from '@/tools/rds/types'
import type { ToolConfig } from '@/tools/types'

export const executeTool: ToolConfig<RdsExecuteParams, RdsExecuteResponse> = {
  id: 'rds_execute',
  name: 'RDS Execute',
  description: 'Execute raw SQL on Amazon RDS using the Data API',
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
    resourceArn: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ARN of the Aurora DB cluster',
    },
    secretArn: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ARN of the Secrets Manager secret containing DB credentials',
    },
    database: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Database name (optional)',
    },
    query: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Raw SQL query to execute',
    },
  },

  request: {
    url: '/api/tools/rds/execute',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      region: params.region,
      accessKeyId: params.accessKeyId,
      secretAccessKey: params.secretAccessKey,
      resourceArn: params.resourceArn,
      secretArn: params.secretArn,
      ...(params.database && { database: params.database }),
      query: params.query,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'RDS execute failed')
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
    rows: { type: 'array', description: 'Array of rows returned or affected' },
    rowCount: { type: 'number', description: 'Number of rows affected' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/rds/index.ts

```typescript
import { deleteTool } from './delete'
import { executeTool } from './execute'
import { insertTool } from './insert'
import { queryTool } from './query'
import { updateTool } from './update'

export const rdsDeleteTool = deleteTool
export const rdsExecuteTool = executeTool
export const rdsInsertTool = insertTool
export const rdsQueryTool = queryTool
export const rdsUpdateTool = updateTool
```

--------------------------------------------------------------------------------

---[FILE: insert.ts]---
Location: sim-main/apps/sim/tools/rds/insert.ts

```typescript
import type { RdsInsertParams, RdsInsertResponse } from '@/tools/rds/types'
import type { ToolConfig } from '@/tools/types'

export const insertTool: ToolConfig<RdsInsertParams, RdsInsertResponse> = {
  id: 'rds_insert',
  name: 'RDS Insert',
  description: 'Insert data into an Amazon RDS table using the Data API',
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
    resourceArn: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ARN of the Aurora DB cluster',
    },
    secretArn: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ARN of the Secrets Manager secret containing DB credentials',
    },
    database: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Database name (optional)',
    },
    table: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Table name to insert into',
    },
    data: {
      type: 'object',
      required: true,
      visibility: 'user-or-llm',
      description: 'Data to insert as key-value pairs',
    },
  },

  request: {
    url: '/api/tools/rds/insert',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      region: params.region,
      accessKeyId: params.accessKeyId,
      secretAccessKey: params.secretAccessKey,
      resourceArn: params.resourceArn,
      secretArn: params.secretArn,
      ...(params.database && { database: params.database }),
      table: params.table,
      data: params.data,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'RDS insert failed')
    }

    return {
      success: true,
      output: {
        message: data.message || 'Insert executed successfully',
        rows: data.rows || [],
        rowCount: data.rowCount || 0,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    rows: { type: 'array', description: 'Array of inserted rows' },
    rowCount: { type: 'number', description: 'Number of rows inserted' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: query.ts]---
Location: sim-main/apps/sim/tools/rds/query.ts

```typescript
import type { RdsQueryParams, RdsQueryResponse } from '@/tools/rds/types'
import type { ToolConfig } from '@/tools/types'

export const queryTool: ToolConfig<RdsQueryParams, RdsQueryResponse> = {
  id: 'rds_query',
  name: 'RDS Query',
  description: 'Execute a SELECT query on Amazon RDS using the Data API',
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
    resourceArn: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ARN of the Aurora DB cluster',
    },
    secretArn: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ARN of the Secrets Manager secret containing DB credentials',
    },
    database: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Database name (optional)',
    },
    query: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'SQL SELECT query to execute',
    },
  },

  request: {
    url: '/api/tools/rds/query',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      region: params.region,
      accessKeyId: params.accessKeyId,
      secretAccessKey: params.secretAccessKey,
      resourceArn: params.resourceArn,
      secretArn: params.secretArn,
      ...(params.database && { database: params.database }),
      query: params.query,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'RDS query failed')
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
Location: sim-main/apps/sim/tools/rds/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface RdsConnectionConfig {
  region: string
  accessKeyId: string
  secretAccessKey: string
  resourceArn: string
  secretArn: string
  database?: string
}

export interface RdsQueryParams extends RdsConnectionConfig {
  query: string
}

export interface RdsInsertParams extends RdsConnectionConfig {
  table: string
  data: Record<string, unknown>
}

export interface RdsUpdateParams extends RdsConnectionConfig {
  table: string
  data: Record<string, unknown>
  conditions: Record<string, unknown>
}

export interface RdsDeleteParams extends RdsConnectionConfig {
  table: string
  conditions: Record<string, unknown>
}

export interface RdsExecuteParams extends RdsConnectionConfig {
  query: string
}

export interface RdsBaseResponse extends ToolResponse {
  output: {
    message: string
    rows: unknown[]
    rowCount: number
  }
  error?: string
}

export interface RdsQueryResponse extends RdsBaseResponse {}
export interface RdsInsertResponse extends RdsBaseResponse {}
export interface RdsUpdateResponse extends RdsBaseResponse {}
export interface RdsDeleteResponse extends RdsBaseResponse {}
export interface RdsExecuteResponse extends RdsBaseResponse {}
export interface RdsResponse extends RdsBaseResponse {}
```

--------------------------------------------------------------------------------

````
