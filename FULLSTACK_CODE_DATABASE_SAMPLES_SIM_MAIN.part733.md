---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 733
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 733 of 933)

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

---[FILE: get_cohort.ts]---
Location: sim-main/apps/sim/tools/posthog/get_cohort.ts

```typescript
import type { ToolConfig } from '@/tools/types'

interface PostHogGetCohortParams {
  apiKey: string
  projectId: string
  cohortId: string
  region: string
}

interface PostHogGetCohortResponse {
  success: boolean
  output: {
    id: number
    name: string
    description: string
    groups: Array<Record<string, any>>
    deleted: boolean
    filters: Record<string, any>
    query: Record<string, any> | null
    created_at: string
    created_by: Record<string, any> | null
    is_calculating: boolean
    last_calculation: string
    errors_calculating: number
    count: number
    is_static: boolean
    version: number
  }
}

export const getCohortTool: ToolConfig<PostHogGetCohortParams, PostHogGetCohortResponse> = {
  id: 'posthog_get_cohort',
  name: 'PostHog Get Cohort',
  description:
    'Get a specific cohort by ID from PostHog. Returns detailed cohort definition, filters, and user count.',
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
    cohortId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The cohort ID to retrieve',
    },
    region: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'PostHog cloud region: "us" or "eu" (default: "us")',
      default: 'us',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = params.region === 'eu' ? 'https://eu.posthog.com' : 'https://us.posthog.com'
      return `${baseUrl}/api/projects/${params.projectId}/cohorts/${params.cohortId}/`
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
        id: data.id,
        name: data.name || '',
        description: data.description || '',
        groups: data.groups || [],
        deleted: data.deleted || false,
        filters: data.filters || {},
        query: data.query || null,
        created_at: data.created_at,
        created_by: data.created_by || null,
        is_calculating: data.is_calculating || false,
        last_calculation: data.last_calculation || '',
        errors_calculating: data.errors_calculating || 0,
        count: data.count || 0,
        is_static: data.is_static || false,
        version: data.version || 0,
      },
    }
  },

  outputs: {
    id: {
      type: 'number',
      description: 'Unique identifier for the cohort',
    },
    name: {
      type: 'string',
      description: 'Name of the cohort',
    },
    description: {
      type: 'string',
      description: 'Description of the cohort',
    },
    groups: {
      type: 'array',
      description: 'Groups that define the cohort',
    },
    deleted: {
      type: 'boolean',
      description: 'Whether the cohort is deleted',
    },
    filters: {
      type: 'object',
      description: 'Filter configuration for the cohort',
    },
    query: {
      type: 'object',
      description: 'Query configuration for the cohort',
      optional: true,
    },
    created_at: {
      type: 'string',
      description: 'ISO timestamp when cohort was created',
    },
    created_by: {
      type: 'object',
      description: 'User who created the cohort',
      optional: true,
    },
    is_calculating: {
      type: 'boolean',
      description: 'Whether the cohort is being calculated',
    },
    last_calculation: {
      type: 'string',
      description: 'ISO timestamp of last calculation',
    },
    errors_calculating: {
      type: 'number',
      description: 'Number of errors during calculation',
    },
    count: {
      type: 'number',
      description: 'Number of users in the cohort',
    },
    is_static: {
      type: 'boolean',
      description: 'Whether the cohort is static',
    },
    version: {
      type: 'number',
      description: 'Version number of the cohort',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_dashboard.ts]---
Location: sim-main/apps/sim/tools/posthog/get_dashboard.ts

```typescript
import type { ToolConfig } from '@/tools/types'

interface PostHogGetDashboardParams {
  apiKey: string
  projectId: string
  dashboardId: string
  region: string
}

interface PostHogGetDashboardResponse {
  success: boolean
  output: {
    id: number
    name: string
    description: string
    pinned: boolean
    created_at: string
    created_by: Record<string, any> | null
    last_modified_at: string
    last_modified_by: Record<string, any> | null
    tiles: Array<Record<string, any>>
    filters: Record<string, any>
    tags: string[]
    restriction_level: number
  }
}

export const getDashboardTool: ToolConfig<PostHogGetDashboardParams, PostHogGetDashboardResponse> =
  {
    id: 'posthog_get_dashboard',
    name: 'PostHog Get Dashboard',
    description:
      'Get a specific dashboard by ID from PostHog. Returns detailed dashboard configuration, tiles, and metadata.',
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
      dashboardId: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description: 'The dashboard ID to retrieve',
      },
      region: {
        type: 'string',
        required: false,
        visibility: 'user-only',
        description: 'PostHog cloud region: "us" or "eu" (default: "us")',
        default: 'us',
      },
    },

    request: {
      url: (params) => {
        const baseUrl = params.region === 'eu' ? 'https://eu.posthog.com' : 'https://us.posthog.com'
        return `${baseUrl}/api/projects/${params.projectId}/dashboards/${params.dashboardId}/`
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
          id: data.id,
          name: data.name || '',
          description: data.description || '',
          pinned: data.pinned || false,
          created_at: data.created_at,
          created_by: data.created_by || null,
          last_modified_at: data.last_modified_at,
          last_modified_by: data.last_modified_by || null,
          tiles: data.tiles || [],
          filters: data.filters || {},
          tags: data.tags || [],
          restriction_level: data.restriction_level || 0,
        },
      }
    },

    outputs: {
      id: {
        type: 'number',
        description: 'Unique identifier for the dashboard',
      },
      name: {
        type: 'string',
        description: 'Name of the dashboard',
      },
      description: {
        type: 'string',
        description: 'Description of the dashboard',
      },
      pinned: {
        type: 'boolean',
        description: 'Whether the dashboard is pinned',
      },
      created_at: {
        type: 'string',
        description: 'ISO timestamp when dashboard was created',
      },
      created_by: {
        type: 'object',
        description: 'User who created the dashboard',
        optional: true,
      },
      last_modified_at: {
        type: 'string',
        description: 'ISO timestamp when dashboard was last modified',
      },
      last_modified_by: {
        type: 'object',
        description: 'User who last modified the dashboard',
        optional: true,
      },
      tiles: {
        type: 'array',
        description: 'Tiles/widgets on the dashboard with their configurations',
      },
      filters: {
        type: 'object',
        description: 'Global filters applied to the dashboard',
      },
      tags: {
        type: 'array',
        description: 'Tags associated with the dashboard',
      },
      restriction_level: {
        type: 'number',
        description: 'Access restriction level for the dashboard',
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: get_event_definition.ts]---
Location: sim-main/apps/sim/tools/posthog/get_event_definition.ts

```typescript
import type { ToolConfig } from '@/tools/types'

interface PostHogGetEventDefinitionParams {
  projectId: string
  eventDefinitionId: string
  region: 'us' | 'eu'
  apiKey: string
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

export const getEventDefinitionTool: ToolConfig<PostHogGetEventDefinitionParams, EventDefinition> =
  {
    id: 'posthog_get_event_definition',
    name: 'PostHog Get Event Definition',
    description:
      'Get details of a specific event definition in PostHog. Returns comprehensive information about the event including metadata, usage statistics, and verification status.',
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
        description: 'Event Definition ID to retrieve',
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
    },

    request: {
      url: (params) => {
        const baseUrl = params.region === 'eu' ? 'https://eu.posthog.com' : 'https://us.posthog.com'
        return `${baseUrl}/api/projects/${params.projectId}/event_definitions/${params.eventDefinitionId}`
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
        description: 'Event description',
      },
      tags: {
        type: 'array',
        description: 'Tags associated with the event',
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

---[FILE: get_experiment.ts]---
Location: sim-main/apps/sim/tools/posthog/get_experiment.ts

```typescript
import type { ToolConfig } from '@/tools/types'

interface GetExperimentParams {
  projectId: string
  experimentId: string
  region: 'us' | 'eu'
  apiKey: string
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
  metrics: Array<Record<string, any>>
  metrics_secondary: Array<Record<string, any>>
}

interface GetExperimentResponse {
  experiment: Experiment
}

export const getExperimentTool: ToolConfig<GetExperimentParams, GetExperimentResponse> = {
  id: 'posthog_get_experiment',
  name: 'PostHog Get Experiment',
  description: 'Get details of a specific experiment',
  version: '1.0.0',

  params: {
    projectId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The PostHog project ID',
    },
    experimentId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The experiment ID',
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
  },

  request: {
    url: (params) => {
      const baseUrl = params.region === 'eu' ? 'https://eu.posthog.com' : 'https://us.posthog.com'
      return `${baseUrl}/api/projects/${params.projectId}/experiments/${params.experimentId}`
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
      experiment: data,
    }
  },

  outputs: {
    experiment: {
      type: 'object',
      description: 'Experiment details',
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
        metrics: { type: 'array', description: 'Primary metrics' },
        metrics_secondary: { type: 'array', description: 'Secondary metrics' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_feature_flag.ts]---
Location: sim-main/apps/sim/tools/posthog/get_feature_flag.ts

```typescript
import type { ToolConfig } from '@/tools/types'

interface GetFeatureFlagParams {
  projectId: string
  flagId: string
  region: 'us' | 'eu'
  apiKey: string
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
  usage_dashboard: number | null
  has_enriched_analytics: boolean
}

interface GetFeatureFlagResponse {
  flag: FeatureFlag
}

export const getFeatureFlagTool: ToolConfig<GetFeatureFlagParams, GetFeatureFlagResponse> = {
  id: 'posthog_get_feature_flag',
  name: 'PostHog Get Feature Flag',
  description: 'Get details of a specific feature flag',
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
  },

  request: {
    url: (params) => {
      const baseUrl = params.region === 'eu' ? 'https://eu.posthog.com' : 'https://us.posthog.com'
      return `${baseUrl}/api/projects/${params.projectId}/feature_flags/${params.flagId}`
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
      flag: data,
    }
  },

  outputs: {
    flag: {
      type: 'object',
      description: 'Feature flag details',
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
        usage_dashboard: {
          type: 'number',
          description: 'Usage dashboard ID',
          optional: true,
        },
        has_enriched_analytics: {
          type: 'boolean',
          description: 'Whether enriched analytics are enabled',
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_insight.ts]---
Location: sim-main/apps/sim/tools/posthog/get_insight.ts

```typescript
import type { ToolConfig } from '@/tools/types'

interface PostHogGetInsightParams {
  apiKey: string
  projectId: string
  insightId: string
  region: string
}

interface PostHogGetInsightResponse {
  success: boolean
  output: {
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
    tags: string[]
    favorited: boolean
  }
}

export const getInsightTool: ToolConfig<PostHogGetInsightParams, PostHogGetInsightResponse> = {
  id: 'posthog_get_insight',
  name: 'PostHog Get Insight',
  description:
    'Get a specific insight by ID from PostHog. Returns detailed insight configuration, filters, and metadata.',
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
    insightId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The insight ID to retrieve',
    },
    region: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'PostHog cloud region: "us" or "eu" (default: "us")',
      default: 'us',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = params.region === 'eu' ? 'https://eu.posthog.com' : 'https://us.posthog.com'
      return `${baseUrl}/api/projects/${params.projectId}/insights/${params.insightId}/`
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
        id: data.id,
        name: data.name || '',
        description: data.description || '',
        filters: data.filters || {},
        query: data.query || null,
        created_at: data.created_at,
        created_by: data.created_by || null,
        last_modified_at: data.last_modified_at,
        last_modified_by: data.last_modified_by || null,
        saved: data.saved || false,
        dashboards: data.dashboards || [],
        tags: data.tags || [],
        favorited: data.favorited || false,
      },
    }
  },

  outputs: {
    id: {
      type: 'number',
      description: 'Unique identifier for the insight',
    },
    name: {
      type: 'string',
      description: 'Name of the insight',
    },
    description: {
      type: 'string',
      description: 'Description of the insight',
    },
    filters: {
      type: 'object',
      description: 'Filter configuration for the insight',
    },
    query: {
      type: 'object',
      description: 'Query configuration for the insight',
      optional: true,
    },
    created_at: {
      type: 'string',
      description: 'ISO timestamp when insight was created',
    },
    created_by: {
      type: 'object',
      description: 'User who created the insight',
      optional: true,
    },
    last_modified_at: {
      type: 'string',
      description: 'ISO timestamp when insight was last modified',
    },
    last_modified_by: {
      type: 'object',
      description: 'User who last modified the insight',
      optional: true,
    },
    saved: {
      type: 'boolean',
      description: 'Whether the insight is saved',
    },
    dashboards: {
      type: 'array',
      description: 'IDs of dashboards this insight appears on',
    },
    tags: {
      type: 'array',
      description: 'Tags associated with the insight',
    },
    favorited: {
      type: 'boolean',
      description: 'Whether the insight is favorited',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_organization.ts]---
Location: sim-main/apps/sim/tools/posthog/get_organization.ts

```typescript
import type { ToolConfig } from '@/tools/types'

export interface PostHogGetOrganizationParams {
  organizationId: string
  apiKey: string
  region?: 'us' | 'eu'
}

export interface PostHogOrganizationDetail {
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
  domain_whitelist: string[]
  is_member_join_email_enabled: boolean
  metadata: Record<string, any>
  customer_id: string | null
  available_features: string[]
  usage: Record<string, any> | null
}

export interface PostHogGetOrganizationResponse {
  success: boolean
  output: {
    organization: PostHogOrganizationDetail
  }
  error?: string
}

export const getOrganizationTool: ToolConfig<
  PostHogGetOrganizationParams,
  PostHogGetOrganizationResponse
> = {
  id: 'posthog_get_organization',
  name: 'PostHog Get Organization',
  description:
    'Get detailed information about a specific organization by ID. Returns comprehensive organization settings, features, usage, and team information.',
  version: '1.0.0',

  params: {
    organizationId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Organization ID (UUID)',
    },
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
      return `${baseUrl}/api/organizations/${params.organizationId}/`
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
        organization: {
          id: data.id,
          name: data.name,
          slug: data.slug,
          created_at: data.created_at,
          updated_at: data.updated_at,
          membership_level: data.membership_level,
          plugins_access_level: data.plugins_access_level,
          teams: data.teams || [],
          available_product_features: data.available_product_features || [],
          domain_whitelist: data.domain_whitelist || [],
          is_member_join_email_enabled: data.is_member_join_email_enabled,
          metadata: data.metadata || {},
          customer_id: data.customer_id,
          available_features: data.available_features || [],
          usage: data.usage || null,
        },
      },
    }
  },

  outputs: {
    organization: {
      type: 'object',
      description: 'Detailed organization information with settings and features',
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
          description: 'Available product features with their limits and descriptions',
        },
        domain_whitelist: {
          type: 'array',
          description: 'Whitelisted domains for organization',
        },
        is_member_join_email_enabled: {
          type: 'boolean',
          description: 'Whether member join emails are enabled',
        },
        metadata: { type: 'object', description: 'Organization metadata' },
        customer_id: { type: 'string', description: 'Customer ID for billing' },
        available_features: {
          type: 'array',
          description: 'List of available feature flags for organization',
        },
        usage: { type: 'object', description: 'Organization usage statistics' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_person.ts]---
Location: sim-main/apps/sim/tools/posthog/get_person.ts

```typescript
import type { ToolConfig } from '@/tools/types'

export interface PostHogGetPersonParams {
  personalApiKey: string
  region?: 'us' | 'eu'
  projectId: string
  personId: string
}

export interface PostHogGetPersonResponse {
  success: boolean
  output: {
    person: {
      id: string
      name: string
      distinct_ids: string[]
      properties: Record<string, any>
      created_at: string
      uuid: string
    }
  }
}

export const getPersonTool: ToolConfig<PostHogGetPersonParams, PostHogGetPersonResponse> = {
  id: 'posthog_get_person',
  name: 'PostHog Get Person',
  description: 'Get detailed information about a specific person in PostHog by their ID or UUID.',
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
    personId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Person ID or UUID to retrieve',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = params.region === 'eu' ? 'https://eu.posthog.com' : 'https://us.posthog.com'
      return `${baseUrl}/api/projects/${params.projectId}/persons/${params.personId}/`
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
          person: {
            id: '',
            name: '',
            distinct_ids: [],
            properties: {},
            created_at: '',
            uuid: '',
          },
        },
        error: error || 'Failed to get person',
      }
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        person: {
          id: data.id,
          name: data.name || '',
          distinct_ids: data.distinct_ids || [],
          properties: data.properties || {},
          created_at: data.created_at,
          uuid: data.uuid,
        },
      },
    }
  },

  outputs: {
    person: {
      type: 'object',
      description: 'Person details including properties and identifiers',
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
}
```

--------------------------------------------------------------------------------

---[FILE: get_project.ts]---
Location: sim-main/apps/sim/tools/posthog/get_project.ts

```typescript
import type { ToolConfig } from '@/tools/types'

export interface PostHogGetProjectParams {
  projectId: string
  apiKey: string
  region?: 'us' | 'eu'
}

export interface PostHogProjectDetail {
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
  person_display_name_properties: string[]
  correlation_config: {
    excluded_person_property_names?: string[]
    excluded_event_names?: string[]
    excluded_event_property_names?: string[]
  }
  autocapture_opt_out: boolean
  autocapture_exceptions_opt_in: boolean
  session_recording_opt_in: boolean
  capture_console_log_opt_in: boolean
  capture_performance_opt_in: boolean
}

export interface PostHogGetProjectResponse {
  success: boolean
  output: {
    project: PostHogProjectDetail
  }
  error?: string
}

export const getProjectTool: ToolConfig<PostHogGetProjectParams, PostHogGetProjectResponse> = {
  id: 'posthog_get_project',
  name: 'PostHog Get Project',
  description:
    'Get detailed information about a specific project by ID. Returns comprehensive project configuration, settings, and feature flags.',
  version: '1.0.0',

  params: {
    projectId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Project ID (numeric ID or UUID)',
    },
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
      return `${baseUrl}/api/projects/${params.projectId}/`
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
        project: {
          id: data.id,
          uuid: data.uuid,
          organization: data.organization,
          api_token: data.api_token,
          app_urls: data.app_urls || [],
          name: data.name,
          slack_incoming_webhook: data.slack_incoming_webhook,
          created_at: data.created_at,
          updated_at: data.updated_at,
          anonymize_ips: data.anonymize_ips,
          completed_snippet_onboarding: data.completed_snippet_onboarding,
          ingested_event: data.ingested_event,
          test_account_filters: data.test_account_filters || [],
          is_demo: data.is_demo,
          timezone: data.timezone,
          data_attributes: data.data_attributes || [],
          person_display_name_properties: data.person_display_name_properties || [],
          correlation_config: data.correlation_config || {},
          autocapture_opt_out: data.autocapture_opt_out,
          autocapture_exceptions_opt_in: data.autocapture_exceptions_opt_in,
          session_recording_opt_in: data.session_recording_opt_in,
          capture_console_log_opt_in: data.capture_console_log_opt_in,
          capture_performance_opt_in: data.capture_performance_opt_in,
        },
      },
    }
  },

  outputs: {
    project: {
      type: 'object',
      description: 'Detailed project information with all configuration settings',
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
        person_display_name_properties: {
          type: 'array',
          description: 'Properties used for person display names',
        },
        correlation_config: {
          type: 'object',
          description: 'Configuration for correlation analysis',
        },
        autocapture_opt_out: { type: 'boolean', description: 'Whether autocapture is disabled' },
        autocapture_exceptions_opt_in: {
          type: 'boolean',
          description: 'Whether exception autocapture is enabled',
        },
        session_recording_opt_in: {
          type: 'boolean',
          description: 'Whether session recording is enabled',
        },
        capture_console_log_opt_in: {
          type: 'boolean',
          description: 'Whether console log capture is enabled',
        },
        capture_performance_opt_in: {
          type: 'boolean',
          description: 'Whether performance capture is enabled',
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

````
