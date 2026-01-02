---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 735
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 735 of 933)

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

---[FILE: list_events.ts]---
Location: sim-main/apps/sim/tools/posthog/list_events.ts

```typescript
import type { ToolConfig } from '@/tools/types'

export interface PostHogListEventsParams {
  personalApiKey: string
  region?: 'us' | 'eu'
  projectId: string
  limit?: number
  offset?: number
  event?: string
  distinctId?: string
  before?: string
  after?: string
}

export interface PostHogEvent {
  id: string
  event: string
  distinct_id: string
  properties: Record<string, any>
  timestamp: string
  person?: {
    id: string
    distinct_ids: string[]
    properties: Record<string, any>
  }
}

export interface PostHogListEventsResponse {
  success: boolean
  output: {
    events: PostHogEvent[]
    next?: string
  }
}

export const listEventsTool: ToolConfig<PostHogListEventsParams, PostHogListEventsResponse> = {
  id: 'posthog_list_events',
  name: 'PostHog List Events',
  description:
    'List events in PostHog. Note: This endpoint is deprecated but kept for backwards compatibility. For production use, prefer the Query endpoint with HogQL.',
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
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of events to return (default: 100, max: 100)',
      default: 100,
    },
    offset: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of events to skip for pagination',
    },
    event: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by specific event name',
    },
    distinctId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by specific distinct_id',
    },
    before: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'ISO 8601 timestamp - only return events before this time',
    },
    after: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'ISO 8601 timestamp - only return events after this time',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = params.region === 'eu' ? 'https://eu.posthog.com' : 'https://us.posthog.com'
      const url = new URL(`${baseUrl}/api/projects/${params.projectId}/events/`)

      if (params.limit) url.searchParams.append('limit', params.limit.toString())
      if (params.offset) url.searchParams.append('offset', params.offset.toString())
      if (params.event) url.searchParams.append('event', params.event)
      if (params.distinctId) url.searchParams.append('distinct_id', params.distinctId)
      if (params.before) url.searchParams.append('before', params.before)
      if (params.after) url.searchParams.append('after', params.after)

      return url.toString()
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.personalApiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const error = await response.text()
      return {
        success: false,
        output: {
          events: [],
        },
        error: error || 'Failed to list events',
      }
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        events:
          data.results?.map((event: any) => ({
            id: event.id,
            event: event.event,
            distinct_id: event.distinct_id,
            properties: event.properties || {},
            timestamp: event.timestamp,
            person: event.person
              ? {
                  id: event.person.id,
                  distinct_ids: event.person.distinct_ids || [],
                  properties: event.person.properties || {},
                }
              : undefined,
          })) || [],
        next: data.next || undefined,
      },
    }
  },

  outputs: {
    events: {
      type: 'array',
      description: 'List of events with their properties and metadata',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Unique event ID' },
          event: { type: 'string', description: 'Event name' },
          distinct_id: { type: 'string', description: 'User or device identifier' },
          properties: { type: 'object', description: 'Event properties' },
          timestamp: { type: 'string', description: 'When the event occurred' },
          person: {
            type: 'object',
            description: 'Associated person data',
            properties: {
              id: { type: 'string', description: 'Person ID' },
              distinct_ids: { type: 'array', description: 'All distinct IDs for this person' },
              properties: { type: 'object', description: 'Person properties' },
            },
          },
        },
      },
    },
    next: {
      type: 'string',
      description: 'URL for the next page of results (if available)',
      optional: true,
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_event_definitions.ts]---
Location: sim-main/apps/sim/tools/posthog/list_event_definitions.ts

```typescript
import type { ToolConfig } from '@/tools/types'

interface PostHogListEventDefinitionsParams {
  projectId: string
  region: 'us' | 'eu'
  apiKey: string
  limit?: number
  offset?: number
  search?: string
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
}

interface PostHogListEventDefinitionsResponse {
  count: number
  next: string | null
  previous: string | null
  results: EventDefinition[]
}

export const listEventDefinitionsTool: ToolConfig<
  PostHogListEventDefinitionsParams,
  PostHogListEventDefinitionsResponse
> = {
  id: 'posthog_list_event_definitions',
  name: 'PostHog List Event Definitions',
  description:
    'List all event definitions in a PostHog project. Event definitions represent tracked events with metadata like descriptions, tags, and usage statistics.',
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
      description: 'Search term to filter event definitions by name',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = params.region === 'eu' ? 'https://eu.posthog.com' : 'https://us.posthog.com'
      const queryParams = new URLSearchParams()

      if (params.limit) queryParams.append('limit', params.limit.toString())
      if (params.offset) queryParams.append('offset', params.offset.toString())
      if (params.search) queryParams.append('search', params.search)

      const query = queryParams.toString()
      return `${baseUrl}/api/projects/${params.projectId}/event_definitions/${query ? `?${query}` : ''}`
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
      results: data.results.map((event: any) => ({
        id: event.id,
        name: event.name,
        description: event.description || '',
        tags: event.tags || [],
        volume_30_day: event.volume_30_day,
        query_usage_30_day: event.query_usage_30_day,
        created_at: event.created_at,
        last_seen_at: event.last_seen_at,
        updated_at: event.updated_at,
        updated_by: event.updated_by,
      })),
    }
  },

  outputs: {
    count: {
      type: 'number',
      description: 'Total number of event definitions',
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
      description: 'List of event definitions',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Unique identifier for the event definition' },
          name: { type: 'string', description: 'Event name' },
          description: { type: 'string', description: 'Event description' },
          tags: { type: 'array', description: 'Tags associated with the event' },
          volume_30_day: {
            type: 'number',
            description: 'Number of events received in the last 30 days',
          },
          query_usage_30_day: {
            type: 'number',
            description: 'Number of times this event was queried in the last 30 days',
          },
          created_at: { type: 'string', description: 'ISO timestamp when the event was created' },
          last_seen_at: {
            type: 'string',
            description: 'ISO timestamp when the event was last seen',
          },
          updated_at: { type: 'string', description: 'ISO timestamp when the event was updated' },
          updated_by: { type: 'object', description: 'User who last updated the event' },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_experiments.ts]---
Location: sim-main/apps/sim/tools/posthog/list_experiments.ts

```typescript
import type { ToolConfig } from '@/tools/types'

interface ListExperimentsParams {
  projectId: string
  region: 'us' | 'eu'
  apiKey: string
  limit?: number
  offset?: number
}

interface Experiment {
  id: number
  name: string
  description: string
  feature_flag_key: string
  feature_flag: Record<string, any>
  parameters: Record<string, any>
  filters: Record<string, any>
  variants: Record<string, any>
  start_date: string | null
  end_date: string | null
  created_at: string
  created_by: Record<string, any>
  archived: boolean
}

interface ListExperimentsResponse {
  results: Experiment[]
  count: number
  next: string | null
  previous: string | null
}

export const listExperimentsTool: ToolConfig<ListExperimentsParams, ListExperimentsResponse> = {
  id: 'posthog_list_experiments',
  name: 'PostHog List Experiments',
  description: 'List all experiments in a PostHog project',
  version: '1.0.0',

  params: {
    projectId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The PostHog project ID',
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
      description: 'Number of results to return',
    },
    offset: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of results to skip',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = params.region === 'eu' ? 'https://eu.posthog.com' : 'https://us.posthog.com'
      const url = new URL(`${baseUrl}/api/projects/${params.projectId}/experiments/`)

      if (params.limit) url.searchParams.append('limit', String(params.limit))
      if (params.offset) url.searchParams.append('offset', String(params.offset))

      return url.toString()
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
      results: data.results,
      count: data.count,
      next: data.next,
      previous: data.previous,
    }
  },

  outputs: {
    results: {
      type: 'array',
      description: 'List of experiments',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', description: 'Experiment ID' },
          name: { type: 'string', description: 'Experiment name' },
          description: { type: 'string', description: 'Experiment description' },
          feature_flag_key: { type: 'string', description: 'Associated feature flag key' },
          feature_flag: { type: 'object', description: 'Feature flag details' },
          parameters: { type: 'object', description: 'Experiment parameters' },
          filters: { type: 'object', description: 'Experiment filters' },
          variants: { type: 'object', description: 'Experiment variants' },
          start_date: { type: 'string', description: 'Start date' },
          end_date: { type: 'string', description: 'End date' },
          created_at: { type: 'string', description: 'Creation timestamp' },
          created_by: { type: 'object', description: 'Creator information' },
          archived: { type: 'boolean', description: 'Whether the experiment is archived' },
        },
      },
    },
    count: {
      type: 'number',
      description: 'Total number of experiments',
    },
    next: {
      type: 'string',
      description: 'URL to next page of results',
      optional: true,
    },
    previous: {
      type: 'string',
      description: 'URL to previous page of results',
      optional: true,
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_feature_flags.ts]---
Location: sim-main/apps/sim/tools/posthog/list_feature_flags.ts

```typescript
import type { ToolConfig } from '@/tools/types'

interface ListFeatureFlagsParams {
  projectId: string
  region: 'us' | 'eu'
  apiKey: string
  limit?: number
  offset?: number
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

interface ListFeatureFlagsResponse {
  results: FeatureFlag[]
  count: number
  next: string | null
  previous: string | null
}

export const listFeatureFlagsTool: ToolConfig<ListFeatureFlagsParams, ListFeatureFlagsResponse> = {
  id: 'posthog_list_feature_flags',
  name: 'PostHog List Feature Flags',
  description: 'List all feature flags in a PostHog project',
  version: '1.0.0',

  params: {
    projectId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The PostHog project ID',
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
      description: 'Number of results to return',
    },
    offset: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of results to skip',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = params.region === 'eu' ? 'https://eu.posthog.com' : 'https://us.posthog.com'
      const url = new URL(`${baseUrl}/api/projects/${params.projectId}/feature_flags/`)

      if (params.limit) url.searchParams.append('limit', String(params.limit))
      if (params.offset) url.searchParams.append('offset', String(params.offset))

      return url.toString()
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
      results: data.results,
      count: data.count,
      next: data.next,
      previous: data.previous,
    }
  },

  outputs: {
    results: {
      type: 'array',
      description: 'List of feature flags',
      items: {
        type: 'object',
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
    count: {
      type: 'number',
      description: 'Total number of feature flags',
    },
    next: {
      type: 'string',
      description: 'URL to next page of results',
      optional: true,
    },
    previous: {
      type: 'string',
      description: 'URL to previous page of results',
      optional: true,
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_insights.ts]---
Location: sim-main/apps/sim/tools/posthog/list_insights.ts

```typescript
import type { ToolConfig } from '@/tools/types'

interface PostHogListInsightsParams {
  apiKey: string
  projectId: string
  region: string
  limit?: number
  offset?: number
}

interface PostHogListInsightsResponse {
  success: boolean
  output: {
    count: number
    next: string | null
    previous: string | null
    results: Array<{
      id: number
      name: string
      description: string
      filters: Record<string, any>
      query: Record<string, any> | null
      created_at: string
      created_by: Record<string, any> | null
      last_modified_at: string
      last_modified_by: Record<string, any> | null
      saved: boolean
      dashboards: number[]
    }>
  }
}

export const listInsightsTool: ToolConfig<PostHogListInsightsParams, PostHogListInsightsResponse> =
  {
    id: 'posthog_list_insights',
    name: 'PostHog List Insights',
    description:
      'List all insights in a PostHog project. Returns insight configurations, filters, and metadata.',
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
        description: 'Number of results to skip for pagination',
      },
    },

    request: {
      url: (params) => {
        const baseUrl = params.region === 'eu' ? 'https://eu.posthog.com' : 'https://us.posthog.com'
        let url = `${baseUrl}/api/projects/${params.projectId}/insights/`

        const queryParams = []
        if (params.limit) queryParams.push(`limit=${params.limit}`)
        if (params.offset) queryParams.push(`offset=${params.offset}`)

        if (queryParams.length > 0) {
          url += `?${queryParams.join('&')}`
        }

        return url
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
          count: data.count || 0,
          next: data.next || null,
          previous: data.previous || null,
          results: (data.results || []).map((insight: any) => ({
            id: insight.id,
            name: insight.name || '',
            description: insight.description || '',
            filters: insight.filters || {},
            query: insight.query || null,
            created_at: insight.created_at,
            created_by: insight.created_by || null,
            last_modified_at: insight.last_modified_at,
            last_modified_by: insight.last_modified_by || null,
            saved: insight.saved || false,
            dashboards: insight.dashboards || [],
          })),
        },
      }
    },

    outputs: {
      count: {
        type: 'number',
        description: 'Total number of insights in the project',
      },
      next: {
        type: 'string',
        description: 'URL for the next page of results',
        optional: true,
      },
      previous: {
        type: 'string',
        description: 'URL for the previous page of results',
        optional: true,
      },
      results: {
        type: 'array',
        description: 'List of insights with their configurations and metadata',
        items: {
          type: 'object',
          properties: {
            id: { type: 'number', description: 'Unique identifier for the insight' },
            name: { type: 'string', description: 'Name of the insight' },
            description: { type: 'string', description: 'Description of the insight' },
            filters: { type: 'object', description: 'Filter configuration for the insight' },
            query: { type: 'object', description: 'Query configuration for the insight' },
            created_at: { type: 'string', description: 'ISO timestamp when insight was created' },
            created_by: { type: 'object', description: 'User who created the insight' },
            last_modified_at: {
              type: 'string',
              description: 'ISO timestamp when insight was last modified',
            },
            last_modified_by: { type: 'object', description: 'User who last modified the insight' },
            saved: { type: 'boolean', description: 'Whether the insight is saved' },
            dashboards: {
              type: 'array',
              description: 'IDs of dashboards this insight appears on',
            },
          },
        },
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: list_organizations.ts]---
Location: sim-main/apps/sim/tools/posthog/list_organizations.ts

```typescript
import type { ToolConfig } from '@/tools/types'

export interface PostHogListOrganizationsParams {
  apiKey: string
  region?: 'us' | 'eu'
}

export interface PostHogOrganization {
  id: string
  name: string
  slug: string
  created_at: string
  updated_at: string
  membership_level: number
  plugins_access_level: number
  teams: number[]
  available_product_features: Array<{
    key: string
    name: string
    description: string
    unit: string
    limit: number | null
    note: string | null
  }>
}

export interface PostHogListOrganizationsResponse {
  success: boolean
  output: {
    organizations: PostHogOrganization[]
  }
  error?: string
}

export const listOrganizationsTool: ToolConfig<
  PostHogListOrganizationsParams,
  PostHogListOrganizationsResponse
> = {
  id: 'posthog_list_organizations',
  name: 'PostHog List Organizations',
  description:
    'List all organizations the user has access to. Returns organization details including name, slug, membership level, and available product features.',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'PostHog Personal API Key',
    },
    region: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Cloud region: us or eu (default: us)',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = params.region === 'eu' ? 'https://eu.posthog.com' : 'https://us.posthog.com'
      return `${baseUrl}/api/organizations/`
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
      success: true,
      output: {
        organizations: data.results.map((org: any) => ({
          id: org.id,
          name: org.name,
          slug: org.slug,
          created_at: org.created_at,
          updated_at: org.updated_at,
          membership_level: org.membership_level,
          plugins_access_level: org.plugins_access_level,
          teams: org.teams || [],
          available_product_features: org.available_product_features || [],
        })),
      },
    }
  },

  outputs: {
    organizations: {
      type: 'array',
      description: 'List of organizations with their settings and features',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Organization ID (UUID)' },
          name: { type: 'string', description: 'Organization name' },
          slug: { type: 'string', description: 'Organization slug' },
          created_at: { type: 'string', description: 'Organization creation timestamp' },
          updated_at: { type: 'string', description: 'Last update timestamp' },
          membership_level: {
            type: 'number',
            description: 'User membership level in organization',
          },
          plugins_access_level: {
            type: 'number',
            description: 'Access level for plugins/apps',
          },
          teams: { type: 'array', description: 'List of team IDs in this organization' },
          available_product_features: {
            type: 'array',
            description: 'Available product features and their limits',
          },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_persons.ts]---
Location: sim-main/apps/sim/tools/posthog/list_persons.ts

```typescript
import type { ToolConfig } from '@/tools/types'

export interface PostHogListPersonsParams {
  personalApiKey: string
  region?: 'us' | 'eu'
  projectId: string
  limit?: number
  offset?: number
  search?: string
  distinctId?: string
}

export interface PostHogPerson {
  id: string
  name: string
  distinct_ids: string[]
  properties: Record<string, any>
  created_at: string
  uuid: string
}

export interface PostHogListPersonsResponse {
  success: boolean
  output: {
    persons: PostHogPerson[]
    next?: string
  }
}

export const listPersonsTool: ToolConfig<PostHogListPersonsParams, PostHogListPersonsResponse> = {
  id: 'posthog_list_persons',
  name: 'PostHog List Persons',
  description:
    'List persons (users) in PostHog. Returns user profiles with their properties and distinct IDs.',
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
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of persons to return (default: 100, max: 100)',
      default: 100,
    },
    offset: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of persons to skip for pagination',
    },
    search: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Search persons by email, name, or distinct ID',
    },
    distinctId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by specific distinct_id',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = params.region === 'eu' ? 'https://eu.posthog.com' : 'https://us.posthog.com'
      const url = new URL(`${baseUrl}/api/projects/${params.projectId}/persons/`)

      if (params.limit) url.searchParams.append('limit', params.limit.toString())
      if (params.offset) url.searchParams.append('offset', params.offset.toString())
      if (params.search) url.searchParams.append('search', params.search)
      if (params.distinctId) url.searchParams.append('distinct_id', params.distinctId)

      return url.toString()
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.personalApiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const error = await response.text()
      return {
        success: false,
        output: {
          persons: [],
        },
        error: error || 'Failed to list persons',
      }
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        persons:
          data.results?.map((person: any) => ({
            id: person.id,
            name: person.name || '',
            distinct_ids: person.distinct_ids || [],
            properties: person.properties || {},
            created_at: person.created_at,
            uuid: person.uuid,
          })) || [],
        next: data.next || undefined,
      },
    }
  },

  outputs: {
    persons: {
      type: 'array',
      description: 'List of persons with their properties and identifiers',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Person ID' },
          name: { type: 'string', description: 'Person name' },
          distinct_ids: {
            type: 'array',
            description: 'All distinct IDs associated with this person',
          },
          properties: { type: 'object', description: 'Person properties' },
          created_at: { type: 'string', description: 'When the person was first seen' },
          uuid: { type: 'string', description: 'Person UUID' },
        },
      },
    },
    next: {
      type: 'string',
      description: 'URL for the next page of results (if available)',
      optional: true,
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_projects.ts]---
Location: sim-main/apps/sim/tools/posthog/list_projects.ts

```typescript
import type { ToolConfig } from '@/tools/types'

export interface PostHogListProjectsParams {
  apiKey: string
  region?: 'us' | 'eu'
}

export interface PostHogProject {
  id: number
  uuid: string
  organization: string
  api_token: string
  app_urls: string[]
  name: string
  slack_incoming_webhook: string
  created_at: string
  updated_at: string
  anonymize_ips: boolean
  completed_snippet_onboarding: boolean
  ingested_event: boolean
  test_account_filters: any[]
  is_demo: boolean
  timezone: string
  data_attributes: string[]
}

export interface PostHogListProjectsResponse {
  success: boolean
  output: {
    projects: PostHogProject[]
  }
  error?: string
}

export const listProjectsTool: ToolConfig<PostHogListProjectsParams, PostHogListProjectsResponse> =
  {
    id: 'posthog_list_projects',
    name: 'PostHog List Projects',
    description:
      'List all projects in the organization. Returns project details including IDs, names, API tokens, and settings. Useful for getting project IDs needed by other endpoints.',
    version: '1.0.0',

    params: {
      apiKey: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'PostHog Personal API Key',
      },
      region: {
        type: 'string',
        required: false,
        visibility: 'user-only',
        description: 'Cloud region: us or eu (default: us)',
      },
    },

    request: {
      url: (params) => {
        const baseUrl = params.region === 'eu' ? 'https://eu.posthog.com' : 'https://us.posthog.com'
        return `${baseUrl}/api/projects/`
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
        success: true,
        output: {
          projects: data.results.map((project: any) => ({
            id: project.id,
            uuid: project.uuid,
            organization: project.organization,
            api_token: project.api_token,
            app_urls: project.app_urls || [],
            name: project.name,
            slack_incoming_webhook: project.slack_incoming_webhook,
            created_at: project.created_at,
            updated_at: project.updated_at,
            anonymize_ips: project.anonymize_ips,
            completed_snippet_onboarding: project.completed_snippet_onboarding,
            ingested_event: project.ingested_event,
            test_account_filters: project.test_account_filters || [],
            is_demo: project.is_demo,
            timezone: project.timezone,
            data_attributes: project.data_attributes || [],
          })),
        },
      }
    },

    outputs: {
      projects: {
        type: 'array',
        description: 'List of projects with their configuration and settings',
        items: {
          type: 'object',
          properties: {
            id: { type: 'number', description: 'Project ID' },
            uuid: { type: 'string', description: 'Project UUID' },
            organization: { type: 'string', description: 'Organization UUID' },
            api_token: { type: 'string', description: 'Project API token for ingestion' },
            app_urls: { type: 'array', description: 'Allowed app URLs' },
            name: { type: 'string', description: 'Project name' },
            slack_incoming_webhook: {
              type: 'string',
              description: 'Slack webhook URL for notifications',
            },
            created_at: { type: 'string', description: 'Project creation timestamp' },
            updated_at: { type: 'string', description: 'Last update timestamp' },
            anonymize_ips: { type: 'boolean', description: 'Whether IP anonymization is enabled' },
            completed_snippet_onboarding: {
              type: 'boolean',
              description: 'Whether snippet onboarding is completed',
            },
            ingested_event: { type: 'boolean', description: 'Whether any event has been ingested' },
            test_account_filters: { type: 'array', description: 'Filters for test accounts' },
            is_demo: { type: 'boolean', description: 'Whether this is a demo project' },
            timezone: { type: 'string', description: 'Project timezone' },
            data_attributes: { type: 'array', description: 'Custom data attributes' },
          },
        },
      },
    },
  }
```

--------------------------------------------------------------------------------

````
