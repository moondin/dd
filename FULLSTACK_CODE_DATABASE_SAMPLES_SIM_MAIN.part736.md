---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 736
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 736 of 933)

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

---[FILE: list_property_definitions.ts]---
Location: sim-main/apps/sim/tools/posthog/list_property_definitions.ts

```typescript
import type { ToolConfig } from '@/tools/types'

interface PostHogListPropertyDefinitionsParams {
  projectId: string
  region: 'us' | 'eu'
  apiKey: string
  limit?: number
  offset?: number
  search?: string
  type?: 'event' | 'person' | 'group'
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
}

interface PostHogListPropertyDefinitionsResponse {
  count: number
  next: string | null
  previous: string | null
  results: PropertyDefinition[]
}

export const listPropertyDefinitionsTool: ToolConfig<
  PostHogListPropertyDefinitionsParams,
  PostHogListPropertyDefinitionsResponse
> = {
  id: 'posthog_list_property_definitions',
  name: 'PostHog List Property Definitions',
  description:
    'List all property definitions in a PostHog project. Property definitions represent tracked properties with metadata like descriptions, tags, types, and usage statistics.',
  version: '1.0.0',

  params: {
    projectId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'PostHog Project ID',
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
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of results to return per page (default: 100)',
    },
    offset: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'The initial index from which to return results',
    },
    search: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Search term to filter property definitions by name',
    },
    type: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by property type: event, person, or group',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = params.region === 'eu' ? 'https://eu.posthog.com' : 'https://us.posthog.com'
      const queryParams = new URLSearchParams()

      if (params.limit) queryParams.append('limit', params.limit.toString())
      if (params.offset) queryParams.append('offset', params.offset.toString())
      if (params.search) queryParams.append('search', params.search)
      if (params.type) queryParams.append('type', params.type)

      const query = queryParams.toString()
      return `${baseUrl}/api/projects/${params.projectId}/property_definitions/${query ? `?${query}` : ''}`
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      count: data.count,
      next: data.next,
      previous: data.previous,
      results: data.results.map((property: any) => ({
        id: property.id,
        name: property.name,
        description: property.description || '',
        tags: property.tags || [],
        is_numerical: property.is_numerical || false,
        is_seen_on_filtered_events: property.is_seen_on_filtered_events,
        property_type: property.property_type,
        type: property.type,
        volume_30_day: property.volume_30_day,
        query_usage_30_day: property.query_usage_30_day,
        created_at: property.created_at,
        updated_at: property.updated_at,
        updated_by: property.updated_by,
      })),
    }
  },

  outputs: {
    count: {
      type: 'number',
      description: 'Total number of property definitions',
    },
    next: {
      type: 'string',
      description: 'URL for the next page of results',
    },
    previous: {
      type: 'string',
      description: 'URL for the previous page of results',
    },
    results: {
      type: 'array',
      description: 'List of property definitions',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Unique identifier for the property definition' },
          name: { type: 'string', description: 'Property name' },
          description: { type: 'string', description: 'Property description' },
          tags: { type: 'array', description: 'Tags associated with the property' },
          is_numerical: { type: 'boolean', description: 'Whether the property is numerical' },
          is_seen_on_filtered_events: {
            type: 'boolean',
            description: 'Whether the property is seen on filtered events',
          },
          property_type: { type: 'string', description: 'The data type of the property' },
          type: { type: 'string', description: 'Property type: event, person, or group' },
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
          updated_by: { type: 'object', description: 'User who last updated the property' },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_recording_playlists.ts]---
Location: sim-main/apps/sim/tools/posthog/list_recording_playlists.ts

```typescript
import type { ToolConfig } from '@/tools/types'

interface PostHogListRecordingPlaylistsParams {
  apiKey: string
  projectId: string
  region?: 'us' | 'eu'
  limit?: number
  offset?: number
}

interface PostHogRecordingPlaylist {
  id: string
  short_id: string
  name: string
  description?: string
  created_at: string
  created_by: {
    id: string
    uuid: string
    distinct_id: string
    first_name: string
    email: string
  }
  deleted: boolean
  filters?: Record<string, any>
  last_modified_at: string
  last_modified_by: Record<string, any>
  derived_name?: string
}

interface PostHogListRecordingPlaylistsResponse {
  success: boolean
  output: {
    playlists: PostHogRecordingPlaylist[]
    count: number
    next?: string
    previous?: string
  }
}

export const listRecordingPlaylistsTool: ToolConfig<
  PostHogListRecordingPlaylistsParams,
  PostHogListRecordingPlaylistsResponse
> = {
  id: 'posthog_list_recording_playlists',
  name: 'PostHog List Recording Playlists',
  description:
    'List session recording playlists in a PostHog project. Playlists allow you to organize and curate session recordings.',
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
    region: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'PostHog cloud region: us or eu (default: us)',
      default: 'us',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of results to return (default: 100)',
    },
    offset: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of results to skip for pagination',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = params.region === 'eu' ? 'https://eu.posthog.com' : 'https://us.posthog.com'
      const url = new URL(
        `${baseUrl}/api/projects/${params.projectId}/session_recording_playlists/`
      )

      if (params.limit) {
        url.searchParams.set('limit', params.limit.toString())
      }
      if (params.offset) {
        url.searchParams.set('offset', params.offset.toString())
      }

      return url.toString()
    },
    method: 'GET',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        playlists: data.results || [],
        count: data.count || 0,
        next: data.next,
        previous: data.previous,
      },
    }
  },

  outputs: {
    playlists: {
      type: 'array',
      description: 'List of session recording playlists',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Playlist ID' },
          short_id: { type: 'string', description: 'Playlist short ID' },
          name: { type: 'string', description: 'Playlist name' },
          description: { type: 'string', description: 'Playlist description' },
          created_at: { type: 'string', description: 'Creation timestamp' },
          created_by: { type: 'object', description: 'Creator information' },
          deleted: { type: 'boolean', description: 'Whether playlist is deleted' },
          filters: { type: 'object', description: 'Playlist filters' },
          last_modified_at: { type: 'string', description: 'Last modification timestamp' },
          last_modified_by: { type: 'object', description: 'Last modifier information' },
          derived_name: { type: 'string', description: 'Auto-generated name from filters' },
        },
      },
    },
    count: {
      type: 'number',
      description: 'Total number of playlists',
    },
    next: {
      type: 'string',
      description: 'URL for next page of results',
      optional: true,
    },
    previous: {
      type: 'string',
      description: 'URL for previous page of results',
      optional: true,
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_session_recordings.ts]---
Location: sim-main/apps/sim/tools/posthog/list_session_recordings.ts

```typescript
import type { ToolConfig } from '@/tools/types'

interface PostHogListSessionRecordingsParams {
  apiKey: string
  projectId: string
  region?: 'us' | 'eu'
  limit?: number
  offset?: number
}

interface PostHogSessionRecording {
  id: string
  distinct_id: string
  viewed: boolean
  recording_duration: number
  active_seconds: number
  inactive_seconds: number
  start_time: string
  end_time: string
  click_count: number
  keypress_count: number
  console_log_count: number
  console_warn_count: number
  console_error_count: number
  person?: {
    id: string
    name?: string
    properties?: Record<string, any>
  }
}

interface PostHogListSessionRecordingsResponse {
  success: boolean
  output: {
    recordings: PostHogSessionRecording[]
    count: number
    next?: string
    previous?: string
  }
}

export const listSessionRecordingsTool: ToolConfig<
  PostHogListSessionRecordingsParams,
  PostHogListSessionRecordingsResponse
> = {
  id: 'posthog_list_session_recordings',
  name: 'PostHog List Session Recordings',
  description:
    'List session recordings in a PostHog project. Session recordings capture user interactions with your application.',
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
    region: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'PostHog cloud region: us or eu (default: us)',
      default: 'us',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of results to return (default: 50)',
    },
    offset: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of results to skip for pagination',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = params.region === 'eu' ? 'https://eu.posthog.com' : 'https://us.posthog.com'
      const url = new URL(`${baseUrl}/api/projects/${params.projectId}/session_recordings/`)

      if (params.limit) {
        url.searchParams.set('limit', params.limit.toString())
      }
      if (params.offset) {
        url.searchParams.set('offset', params.offset.toString())
      }

      return url.toString()
    },
    method: 'GET',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        recordings: data.results || [],
        count: data.count || 0,
        next: data.next,
        previous: data.previous,
      },
    }
  },

  outputs: {
    recordings: {
      type: 'array',
      description: 'List of session recordings',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Recording ID' },
          distinct_id: { type: 'string', description: 'User distinct ID' },
          viewed: { type: 'boolean', description: 'Whether recording has been viewed' },
          recording_duration: { type: 'number', description: 'Recording duration in seconds' },
          active_seconds: { type: 'number', description: 'Active time in seconds' },
          inactive_seconds: { type: 'number', description: 'Inactive time in seconds' },
          start_time: { type: 'string', description: 'Recording start timestamp' },
          end_time: { type: 'string', description: 'Recording end timestamp' },
          click_count: { type: 'number', description: 'Number of clicks' },
          keypress_count: { type: 'number', description: 'Number of keypresses' },
          console_log_count: { type: 'number', description: 'Number of console logs' },
          console_warn_count: { type: 'number', description: 'Number of console warnings' },
          console_error_count: { type: 'number', description: 'Number of console errors' },
          person: { type: 'object', description: 'Person information' },
        },
      },
    },
    count: {
      type: 'number',
      description: 'Total number of recordings',
    },
    next: {
      type: 'string',
      description: 'URL for next page of results',
      optional: true,
    },
    previous: {
      type: 'string',
      description: 'URL for previous page of results',
      optional: true,
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_surveys.ts]---
Location: sim-main/apps/sim/tools/posthog/list_surveys.ts

```typescript
import type { ToolConfig } from '@/tools/types'

interface PostHogListSurveysParams {
  apiKey: string
  projectId: string
  region?: 'us' | 'eu'
  limit?: number
  offset?: number
}

interface PostHogSurvey {
  id: string
  name: string
  description: string
  type: 'popover' | 'api'
  questions: Array<{
    type: 'open' | 'link' | 'rating' | 'multiple_choice'
    question: string
    description?: string
    choices?: string[]
    scale?: number
  }>
  appearance?: Record<string, any>
  conditions?: Record<string, any>
  created_at: string
  created_by: Record<string, any>
  start_date?: string
  end_date?: string
  archived?: boolean
}

interface PostHogListSurveysResponse {
  success: boolean
  output: {
    surveys: PostHogSurvey[]
    count: number
    next?: string
    previous?: string
  }
}

export const listSurveysTool: ToolConfig<PostHogListSurveysParams, PostHogListSurveysResponse> = {
  id: 'posthog_list_surveys',
  name: 'PostHog List Surveys',
  description:
    'List all surveys in a PostHog project. Surveys allow you to collect feedback from users.',
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
    region: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'PostHog cloud region: us or eu (default: us)',
      default: 'us',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of results to return (default: 100)',
    },
    offset: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of results to skip for pagination',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = params.region === 'eu' ? 'https://eu.posthog.com' : 'https://us.posthog.com'
      const url = new URL(`${baseUrl}/api/projects/${params.projectId}/surveys/`)

      if (params.limit) {
        url.searchParams.set('limit', params.limit.toString())
      }
      if (params.offset) {
        url.searchParams.set('offset', params.offset.toString())
      }

      return url.toString()
    },
    method: 'GET',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        surveys: data.results || [],
        count: data.count || 0,
        next: data.next,
        previous: data.previous,
      },
    }
  },

  outputs: {
    surveys: {
      type: 'array',
      description: 'List of surveys in the project',
      items: {
        type: 'object',
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
    count: {
      type: 'number',
      description: 'Total number of surveys',
    },
    next: {
      type: 'string',
      description: 'URL for next page of results',
      optional: true,
    },
    previous: {
      type: 'string',
      description: 'URL for previous page of results',
      optional: true,
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: query.ts]---
Location: sim-main/apps/sim/tools/posthog/query.ts

```typescript
import type { ToolConfig } from '@/tools/types'

export interface PostHogQueryParams {
  personalApiKey: string
  region?: 'us' | 'eu'
  projectId: string
  query: string
  values?: string
}

export interface PostHogQueryResponse {
  success: boolean
  output: {
    results: any[]
    columns?: string[]
    types?: string[]
    hogql?: string
    hasMore?: boolean
  }
}

export const queryTool: ToolConfig<PostHogQueryParams, PostHogQueryResponse> = {
  id: 'posthog_query',
  name: 'PostHog Query',
  description:
    "Execute a HogQL query in PostHog. HogQL is PostHog's SQL-like query language for analytics. Use this for advanced data retrieval and analysis.",
  version: '1.0.0',

  params: {
    personalApiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'PostHog Personal API Key (for authenticated API access)',
    },
    region: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'PostHog region: us (default) or eu',
      default: 'us',
    },
    projectId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'PostHog Project ID',
    },
    query: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description:
        'HogQL query to execute. Example: {"kind": "HogQLQuery", "query": "SELECT event, count() FROM events WHERE timestamp > now() - INTERVAL 1 DAY GROUP BY event"}',
    },
    values: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Optional JSON string of parameter values for parameterized queries. Example: {"user_id": "123"}',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = params.region === 'eu' ? 'https://eu.posthog.com' : 'https://us.posthog.com'
      return `${baseUrl}/api/projects/${params.projectId}/query/`
    },
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.personalApiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      let query: any
      try {
        query = JSON.parse(params.query)
      } catch (e) {
        // If it's not valid JSON, treat it as a raw HogQL string
        query = {
          kind: 'HogQLQuery',
          query: params.query,
        }
      }

      const body: Record<string, any> = {
        query: query,
      }

      if (params.values) {
        try {
          body.values = JSON.parse(params.values)
        } catch (e) {
          // Ignore invalid values JSON
        }
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const error = await response.text()
      return {
        success: false,
        output: {
          results: [],
        },
        error: error || 'Failed to execute query',
      }
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        results: data.results || [],
        columns: data.columns || undefined,
        types: data.types || undefined,
        hogql: data.hogql || undefined,
        hasMore: data.hasMore || false,
      },
    }
  },

  outputs: {
    results: {
      type: 'array',
      description: 'Query results as an array of rows',
      items: {
        type: 'object',
        properties: {},
      },
    },
    columns: {
      type: 'array',
      description: 'Column names in the result set',
      optional: true,
      items: {
        type: 'string',
      },
    },
    types: {
      type: 'array',
      description: 'Data types of columns in the result set',
      optional: true,
      items: {
        type: 'string',
      },
    },
    hogql: {
      type: 'string',
      description: 'The actual HogQL query that was executed',
      optional: true,
    },
    hasMore: {
      type: 'boolean',
      description: 'Whether there are more results available',
      optional: true,
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/posthog/types.ts

```typescript
// Common types for PostHog tools
import type { ToolResponse } from '@/tools/types'

// Common base parameters
export interface PostHogBaseParams {
  region?: 'us' | 'eu'
}

export interface PostHogPublicParams extends PostHogBaseParams {
  projectApiKey: string
}

export interface PostHogPrivateParams extends PostHogBaseParams {
  personalApiKey: string
  projectId: string
}

// Common data types
export interface PostHogPerson {
  id: string
  name: string
  distinct_ids: string[]
  properties: Record<string, any>
  created_at: string
  uuid: string
}

export interface PostHogEvent {
  id: string
  distinct_id: string
  properties: Record<string, any>
  event: string
  timestamp: string
  person?: PostHogPerson
}

export interface PostHogFeatureFlag {
  id: number
  name: string
  key: string
  filters: Record<string, any>
  deleted: boolean
  active: boolean
  created_at: string
  created_by: any
  is_simple_flag: boolean
  rollout_percentage?: number
  ensure_experience_continuity?: boolean
}

export interface PostHogInsight {
  id: number
  name: string
  description: string
  favorited: boolean
  filters: Record<string, any>
  query?: Record<string, any>
  result?: any
  created_at: string
  created_by: any
  last_modified_at: string
  last_modified_by: any
  deleted: boolean
  saved: boolean
  short_id: string
}

export interface PostHogDashboard {
  id: number
  name: string
  description: string
  pinned: boolean
  created_at: string
  created_by: any
  is_shared: boolean
  deleted: boolean
  creation_mode: string
  restriction_level: number
  filters: Record<string, any>
  tiles: any[]
}

export interface PostHogCohort {
  id: number
  name: string
  description: string
  groups: any[]
  filters?: Record<string, any>
  query?: Record<string, any>
  is_calculating: boolean
  count?: number
  created_at: string
  created_by: any
  deleted: boolean
  is_static: boolean
  version?: number
}

export interface PostHogExperiment {
  id: number
  name: string
  description: string
  feature_flag_key: string
  feature_flag: any
  parameters: Record<string, any>
  filters: Record<string, any>
  start_date?: string
  end_date?: string
  created_at: string
  created_by: any
  archived: boolean
}

export interface PostHogSurvey {
  id: string
  name: string
  description: string
  type: 'popover' | 'api'
  questions: any[]
  appearance?: Record<string, any>
  conditions?: Record<string, any>
  start_date?: string
  end_date?: string
  archived: boolean
  created_at: string
  created_by: any
}

export interface PostHogSessionRecording {
  id: string
  distinct_id: string
  viewed: boolean
  recording_duration: number
  start_time: string
  end_time: string
  click_count: number
  keypress_count: number
  console_error_count: number
  console_warn_count: number
  console_log_count: number
  person?: PostHogPerson
}

export interface PostHogAnnotation {
  id: number
  content: string
  date_marker: string
  created_at: string
  updated_at: string
  created_by: any
  dashboard_item?: number
  scope: string
  deleted: boolean
}

export interface PostHogEventDefinition {
  id: string
  name: string
  description: string
  tags: string[]
  volume_30_day?: number
  query_usage_30_day?: number
  created_at: string
  last_seen_at?: string
  verified: boolean
}

export interface PostHogPropertyDefinition {
  id: string
  name: string
  description: string
  tags: string[]
  is_numerical: boolean
  property_type: 'DateTime' | 'String' | 'Numeric' | 'Boolean'
  volume_30_day?: number
  query_usage_30_day?: number
  verified: boolean
}

export interface PostHogProject {
  id: number
  uuid: string
  organization: string
  api_token: string
  app_urls: string[]
  name: string
  slack_incoming_webhook?: string
  created_at: string
  updated_at: string
  anonymize_ips: boolean
  completed_snippet_onboarding: boolean
  ingested_event: boolean
  test_account_filters: any[]
  is_demo: boolean
}

export interface PostHogOrganization {
  id: string
  name: string
  created_at: string
  updated_at: string
  membership_level?: number
  personalization?: Record<string, any>
  setup?: Record<string, any>
  available_features: string[]
  is_member_join_email_enabled: boolean
}

// Union type for all PostHog responses
export type PostHogResponse = ToolResponse
```

--------------------------------------------------------------------------------

---[FILE: update_event_definition.ts]---
Location: sim-main/apps/sim/tools/posthog/update_event_definition.ts

```typescript
import type { ToolConfig } from '@/tools/types'

interface PostHogUpdateEventDefinitionParams {
  projectId: string
  eventDefinitionId: string
  region: 'us' | 'eu'
  apiKey: string
  description?: string
  tags?: string
  verified?: boolean
}

interface EventDefinition {
  id: string
  name: string
  description: string
  tags: string[]
  volume_30_day: number | null
  query_usage_30_day: number | null
  created_at: string
  last_seen_at: string | null
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
}

export const updateEventDefinitionTool: ToolConfig<
  PostHogUpdateEventDefinitionParams,
  EventDefinition
> = {
  id: 'posthog_update_event_definition',
  name: 'PostHog Update Event Definition',
  description:
    'Update an event definition in PostHog. Can modify description, tags, and verification status to maintain clean event schemas.',
  version: '1.0.0',

  params: {
    projectId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'PostHog Project ID',
    },
    eventDefinitionId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Event Definition ID to update',
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
      description: 'Updated description for the event',
    },
    tags: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Comma-separated list of tags to associate with the event',
    },
    verified: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Whether to mark the event as verified',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = params.region === 'eu' ? 'https://eu.posthog.com' : 'https://us.posthog.com'
      return `${baseUrl}/api/projects/${params.projectId}/event_definitions/${params.eventDefinitionId}`
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
      volume_30_day: data.volume_30_day,
      query_usage_30_day: data.query_usage_30_day,
      created_at: data.created_at,
      last_seen_at: data.last_seen_at,
      updated_at: data.updated_at,
      updated_by: data.updated_by,
      verified: data.verified || false,
      verified_at: data.verified_at,
      verified_by: data.verified_by,
    }
  },

  outputs: {
    id: {
      type: 'string',
      description: 'Unique identifier for the event definition',
    },
    name: {
      type: 'string',
      description: 'Event name',
    },
    description: {
      type: 'string',
      description: 'Updated event description',
    },
    tags: {
      type: 'array',
      description: 'Updated tags associated with the event',
    },
    volume_30_day: {
      type: 'number',
      description: 'Number of events received in the last 30 days',
    },
    query_usage_30_day: {
      type: 'number',
      description: 'Number of times this event was queried in the last 30 days',
    },
    created_at: {
      type: 'string',
      description: 'ISO timestamp when the event was created',
    },
    last_seen_at: {
      type: 'string',
      description: 'ISO timestamp when the event was last seen',
    },
    updated_at: {
      type: 'string',
      description: 'ISO timestamp when the event was updated',
    },
    updated_by: {
      type: 'object',
      description: 'User who last updated the event',
    },
    verified: {
      type: 'boolean',
      description: 'Whether the event has been verified',
    },
    verified_at: {
      type: 'string',
      description: 'ISO timestamp when the event was verified',
    },
    verified_by: {
      type: 'string',
      description: 'User who verified the event',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_feature_flag.ts]---
Location: sim-main/apps/sim/tools/posthog/update_feature_flag.ts

```typescript
import type { ToolConfig } from '@/tools/types'

interface UpdateFeatureFlagParams {
  projectId: string
  flagId: string
  region: 'us' | 'eu'
  apiKey: string
  name?: string
  key?: string
  filters?: string
  active?: boolean
  ensureExperienceContinuity?: boolean
  rolloutPercentage?: number
}

interface FeatureFlag {
  id: number
  name: string
  key: string
  filters: Record<string, any>
  deleted: boolean
  active: boolean
  created_at: string
  created_by: Record<string, any>
  is_simple_flag: boolean
  rollout_percentage: number | null
  ensure_experience_continuity: boolean
}

interface UpdateFeatureFlagResponse {
  flag: FeatureFlag
}

export const updateFeatureFlagTool: ToolConfig<UpdateFeatureFlagParams, UpdateFeatureFlagResponse> =
  {
    id: 'posthog_update_feature_flag',
    name: 'PostHog Update Feature Flag',
    description: 'Update an existing feature flag in PostHog',
    version: '1.0.0',

    params: {
      projectId: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description: 'The PostHog project ID',
      },
      flagId: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description: 'The feature flag ID',
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
      name: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Feature flag name',
      },
      key: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Feature flag key (unique identifier)',
      },
      filters: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Feature flag filters as JSON string',
      },
      active: {
        type: 'boolean',
        required: false,
        visibility: 'user-or-llm',
        description: 'Whether the flag is active',
      },
      ensureExperienceContinuity: {
        type: 'boolean',
        required: false,
        visibility: 'user-or-llm',
        description: 'Whether to ensure experience continuity',
      },
      rolloutPercentage: {
        type: 'number',
        required: false,
        visibility: 'user-or-llm',
        description: 'Rollout percentage (0-100)',
      },
    },

    request: {
      url: (params) => {
        const baseUrl = params.region === 'eu' ? 'https://eu.posthog.com' : 'https://us.posthog.com'
        return `${baseUrl}/api/projects/${params.projectId}/feature_flags/${params.flagId}`
      },
      method: 'PATCH',
      headers: (params) => ({
        Authorization: `Bearer ${params.apiKey}`,
        'Content-Type': 'application/json',
      }),
      body: (params) => {
        const body: Record<string, any> = {}

        if (params.name !== undefined) {
          body.name = params.name
        }

        if (params.key !== undefined && params.key !== '') {
          body.key = params.key
        }

        if (params.filters) {
          try {
            body.filters = JSON.parse(params.filters)
          } catch {
            body.filters = {}
          }
        }

        if (params.active !== undefined) {
          body.active = params.active
        }

        if (params.ensureExperienceContinuity !== undefined) {
          body.ensure_experience_continuity = params.ensureExperienceContinuity
        }

        if (params.rolloutPercentage !== undefined) {
          body.rollout_percentage = params.rolloutPercentage
        }

        return body
      },
    },

    transformResponse: async (response: Response) => {
      const data = await response.json()

      return {
        flag: data,
      }
    },

    outputs: {
      flag: {
        type: 'object',
        description: 'Updated feature flag',
        properties: {
          id: { type: 'number', description: 'Feature flag ID' },
          name: { type: 'string', description: 'Feature flag name' },
          key: { type: 'string', description: 'Feature flag key' },
          filters: { type: 'object', description: 'Feature flag filters' },
          deleted: { type: 'boolean', description: 'Whether the flag is deleted' },
          active: { type: 'boolean', description: 'Whether the flag is active' },
          created_at: { type: 'string', description: 'Creation timestamp' },
          created_by: { type: 'object', description: 'Creator information' },
          is_simple_flag: { type: 'boolean', description: 'Whether this is a simple flag' },
          rollout_percentage: {
            type: 'number',
            description: 'Rollout percentage (if applicable)',
          },
          ensure_experience_continuity: {
            type: 'boolean',
            description: 'Whether to ensure experience continuity',
          },
        },
      },
    },
  }
```

--------------------------------------------------------------------------------

````
