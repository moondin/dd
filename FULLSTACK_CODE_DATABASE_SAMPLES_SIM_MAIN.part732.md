---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 732
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 732 of 933)

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

---[FILE: create_cohort.ts]---
Location: sim-main/apps/sim/tools/posthog/create_cohort.ts

```typescript
import type { ToolConfig } from '@/tools/types'

interface PostHogCreateCohortParams {
  apiKey: string
  projectId: string
  region: string
  name: string
  description?: string
  filters?: string
  query?: string
  is_static?: boolean
  groups?: string
}

interface PostHogCreateCohortResponse {
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
    count: number
    is_static: boolean
    version: number
  }
}

export const createCohortTool: ToolConfig<PostHogCreateCohortParams, PostHogCreateCohortResponse> =
  {
    id: 'posthog_create_cohort',
    name: 'PostHog Create Cohort',
    description:
      'Create a new cohort in PostHog. Requires cohort name and filter or query configuration.',
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
      name: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description:
          'Name for the cohort (optional - PostHog will use "Untitled cohort" if not provided)',
      },
      description: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Description of the cohort',
      },
      filters: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'JSON string of filter configuration for the cohort',
      },
      query: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'JSON string of query configuration for the cohort',
      },
      is_static: {
        type: 'boolean',
        required: false,
        visibility: 'user-or-llm',
        description: 'Whether the cohort is static (default: false)',
        default: false,
      },
      groups: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'JSON string of groups that define the cohort',
      },
    },

    request: {
      url: (params) => {
        const baseUrl = params.region === 'eu' ? 'https://eu.posthog.com' : 'https://us.posthog.com'
        return `${baseUrl}/api/projects/${params.projectId}/cohorts/`
      },
      method: 'POST',
      headers: (params) => ({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.apiKey}`,
      }),
      body: (params) => {
        const body: Record<string, any> = {
          name: params.name,
        }

        if (params.description) {
          body.description = params.description
        }

        if (params.filters) {
          try {
            body.filters = JSON.parse(params.filters)
          } catch (e) {
            body.filters = {}
          }
        }

        if (params.query) {
          try {
            body.query = JSON.parse(params.query)
          } catch (e) {
            body.query = null
          }
        }

        if (params.is_static !== undefined) {
          body.is_static = params.is_static
        }

        if (params.groups) {
          try {
            body.groups = JSON.parse(params.groups)
          } catch (e) {
            body.groups = []
          }
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
          name: data.name || '',
          description: data.description || '',
          groups: data.groups || [],
          deleted: data.deleted || false,
          filters: data.filters || {},
          query: data.query || null,
          created_at: data.created_at,
          created_by: data.created_by || null,
          is_calculating: data.is_calculating || false,
          count: data.count || 0,
          is_static: data.is_static || false,
          version: data.version || 0,
        },
      }
    },

    outputs: {
      id: {
        type: 'number',
        description: 'Unique identifier for the created cohort',
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

---[FILE: create_experiment.ts]---
Location: sim-main/apps/sim/tools/posthog/create_experiment.ts

```typescript
import type { ToolConfig } from '@/tools/types'

interface CreateExperimentParams {
  projectId: string
  region: 'us' | 'eu'
  apiKey: string
  name: string
  description?: string
  featureFlagKey: string
  parameters?: string
  filters?: string
  variants?: string
  startDate?: string
  endDate?: string
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

interface CreateExperimentResponse {
  experiment: Experiment
}

export const createExperimentTool: ToolConfig<CreateExperimentParams, CreateExperimentResponse> = {
  id: 'posthog_create_experiment',
  name: 'PostHog Create Experiment',
  description: 'Create a new experiment in PostHog',
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
    name: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Experiment name (optional)',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Experiment description',
    },
    featureFlagKey: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Feature flag key to use for the experiment',
    },
    parameters: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Experiment parameters as JSON string',
    },
    filters: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Experiment filters as JSON string',
    },
    variants: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Experiment variants as JSON string',
    },
    startDate: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Experiment start date (ISO format)',
    },
    endDate: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Experiment end date (ISO format)',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = params.region === 'eu' ? 'https://eu.posthog.com' : 'https://us.posthog.com'
      return `${baseUrl}/api/projects/${params.projectId}/experiments/`
    },
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: Record<string, any> = {
        name: params.name,
        feature_flag_key: params.featureFlagKey,
      }

      if (params.description !== undefined) {
        body.description = params.description
      }

      if (params.parameters) {
        try {
          body.parameters = JSON.parse(params.parameters)
        } catch {
          body.parameters = {}
        }
      }

      if (params.filters) {
        try {
          body.filters = JSON.parse(params.filters)
        } catch {
          body.filters = {}
        }
      }

      if (params.variants) {
        try {
          body.variants = JSON.parse(params.variants)
        } catch {
          body.variants = {}
        }
      }

      if (params.startDate !== undefined) {
        body.start_date = params.startDate
      }

      if (params.endDate !== undefined) {
        body.end_date = params.endDate
      }

      return body
    },
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
      description: 'Created experiment',
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
}
```

--------------------------------------------------------------------------------

---[FILE: create_feature_flag.ts]---
Location: sim-main/apps/sim/tools/posthog/create_feature_flag.ts

```typescript
import type { ToolConfig } from '@/tools/types'

interface CreateFeatureFlagParams {
  projectId: string
  region: 'us' | 'eu'
  apiKey: string
  name: string
  key: string
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

interface CreateFeatureFlagResponse {
  flag: FeatureFlag
}

export const createFeatureFlagTool: ToolConfig<CreateFeatureFlagParams, CreateFeatureFlagResponse> =
  {
    id: 'posthog_create_feature_flag',
    name: 'PostHog Create Feature Flag',
    description: 'Create a new feature flag in PostHog',
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
      name: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Feature flag name (optional - can be empty)',
      },
      key: {
        type: 'string',
        required: true,
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
        description: 'Whether the flag is active (default: true)',
        default: true,
      },
      ensureExperienceContinuity: {
        type: 'boolean',
        required: false,
        visibility: 'user-or-llm',
        description: 'Whether to ensure experience continuity (default: false)',
        default: false,
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
        return `${baseUrl}/api/projects/${params.projectId}/feature_flags/`
      },
      method: 'POST',
      headers: (params) => ({
        Authorization: `Bearer ${params.apiKey}`,
        'Content-Type': 'application/json',
      }),
      body: (params) => {
        const body: Record<string, any> = {
          name: params.name,
          key: params.key,
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
        description: 'Created feature flag',
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

---[FILE: create_insight.ts]---
Location: sim-main/apps/sim/tools/posthog/create_insight.ts

```typescript
import type { ToolConfig } from '@/tools/types'

interface PostHogCreateInsightParams {
  apiKey: string
  projectId: string
  region: string
  name: string
  description?: string
  filters?: string
  query?: string
  dashboards?: string
  tags?: string
}

interface PostHogCreateInsightResponse {
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
    saved: boolean
    dashboards: number[]
    tags: string[]
  }
}

export const createInsightTool: ToolConfig<
  PostHogCreateInsightParams,
  PostHogCreateInsightResponse
> = {
  id: 'posthog_create_insight',
  name: 'PostHog Create Insight',
  description:
    'Create a new insight in PostHog. Requires insight name and configuration filters or query.',
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
    name: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Name for the insight (optional - PostHog will generate a derived name if not provided)',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Description of the insight',
    },
    filters: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'JSON string of filter configuration for the insight',
    },
    query: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'JSON string of query configuration for the insight',
    },
    dashboards: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Comma-separated list of dashboard IDs to add this insight to',
    },
    tags: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Comma-separated list of tags for the insight',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = params.region === 'eu' ? 'https://eu.posthog.com' : 'https://us.posthog.com'
      return `${baseUrl}/api/projects/${params.projectId}/insights/`
    },
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
    body: (params) => {
      const body: Record<string, any> = {
        name: params.name,
      }

      if (params.description) {
        body.description = params.description
      }

      if (params.filters) {
        try {
          body.filters = JSON.parse(params.filters)
        } catch (e) {
          body.filters = {}
        }
      }

      if (params.query) {
        try {
          body.query = JSON.parse(params.query)
        } catch (e) {
          body.query = null
        }
      }

      if (params.dashboards) {
        body.dashboards = params.dashboards
          .split(',')
          .map((id: string) => Number(id.trim()))
          .filter((id: number) => !Number.isNaN(id))
      }

      if (params.tags) {
        body.tags = params.tags
          .split(',')
          .map((tag: string) => tag.trim())
          .filter((tag: string) => tag.length > 0)
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
        name: data.name || '',
        description: data.description || '',
        filters: data.filters || {},
        query: data.query || null,
        created_at: data.created_at,
        created_by: data.created_by || null,
        last_modified_at: data.last_modified_at,
        saved: data.saved || false,
        dashboards: data.dashboards || [],
        tags: data.tags || [],
      },
    }
  },

  outputs: {
    id: {
      type: 'number',
      description: 'Unique identifier for the created insight',
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
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_survey.ts]---
Location: sim-main/apps/sim/tools/posthog/create_survey.ts

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

interface PostHogCreateSurveyParams {
  apiKey: string
  projectId: string
  region?: 'us' | 'eu'
  name: string
  description?: string
  type?: 'popover' | 'api'
  questions: string // JSON string of questions array
  startDate?: string
  endDate?: string
  appearance?: string // JSON string of appearance config
  conditions?: string // JSON string of conditions
  targetingFlagFilters?: string // JSON string of targeting filters
  linkedFlagId?: string
  responsesLimit?: number
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

interface PostHogCreateSurveyResponse {
  success: boolean
  output: {
    survey: PostHogSurvey
  }
}

export const createSurveyTool: ToolConfig<PostHogCreateSurveyParams, PostHogCreateSurveyResponse> =
  {
    id: 'posthog_create_survey',
    name: 'PostHog Create Survey',
    description:
      'Create a new survey in PostHog. Supports question types: Basic (open), Link, Rating, and Multiple Choice.',
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
      name: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Survey name (optional)',
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
        description:
          'Survey type: popover (in-app) or api (custom implementation) (default: popover)',
        default: 'popover',
      },
      questions: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description:
          'JSON string of survey questions array. Each question must have type (open/link/rating/multiple_choice) and question text. Rating questions can have scale (1-10), lowerBoundLabel, upperBoundLabel. Multiple choice questions need choices array. Link questions can have buttonText.',
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
    },

    request: {
      url: (params) => {
        const baseUrl = params.region === 'eu' ? 'https://eu.posthog.com' : 'https://us.posthog.com'
        return `${baseUrl}/api/projects/${params.projectId}/surveys/`
      },
      method: 'POST',
      headers: (params) => ({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.apiKey}`,
      }),
      body: (params) => {
        const body: Record<string, any> = {
          name: params.name,
          type: params.type || 'popover',
          questions: JSON.parse(params.questions),
        }

        if (params.description) body.description = params.description
        if (params.startDate) body.start_date = params.startDate
        if (params.endDate) body.end_date = params.endDate
        if (params.appearance) body.appearance = JSON.parse(params.appearance)
        if (params.conditions) body.conditions = JSON.parse(params.conditions)
        if (params.targetingFlagFilters) {
          body.targeting_flag_filters = JSON.parse(params.targetingFlagFilters)
        }
        if (params.linkedFlagId) body.linked_flag_id = params.linkedFlagId
        if (params.responsesLimit) body.responses_limit = params.responsesLimit

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
        description: 'Created survey details',
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
        },
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: delete_feature_flag.ts]---
Location: sim-main/apps/sim/tools/posthog/delete_feature_flag.ts

```typescript
import type { ToolConfig } from '@/tools/types'

interface DeleteFeatureFlagParams {
  projectId: string
  flagId: string
  region: 'us' | 'eu'
  apiKey: string
}

interface DeleteFeatureFlagResponse {
  success: boolean
  message: string
}

export const deleteFeatureFlagTool: ToolConfig<DeleteFeatureFlagParams, DeleteFeatureFlagResponse> =
  {
    id: 'posthog_delete_feature_flag',
    name: 'PostHog Delete Feature Flag',
    description: 'Delete a feature flag from PostHog',
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
        description: 'The feature flag ID to delete',
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
      method: 'DELETE',
      headers: (params) => ({
        Authorization: `Bearer ${params.apiKey}`,
        'Content-Type': 'application/json',
      }),
    },

    transformResponse: async (response: Response) => {
      return {
        success: true,
        message: 'Feature flag deleted successfully',
      }
    },

    outputs: {
      success: {
        type: 'boolean',
        description: 'Whether the deletion was successful',
      },
      message: {
        type: 'string',
        description: 'Confirmation message',
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: delete_person.ts]---
Location: sim-main/apps/sim/tools/posthog/delete_person.ts

```typescript
import type { ToolConfig } from '@/tools/types'

export interface PostHogDeletePersonParams {
  personalApiKey: string
  region?: 'us' | 'eu'
  projectId: string
  personId: string
}

export interface PostHogDeletePersonResponse {
  success: boolean
  output: {
    status: string
  }
}

export const deletePersonTool: ToolConfig<PostHogDeletePersonParams, PostHogDeletePersonResponse> =
  {
    id: 'posthog_delete_person',
    name: 'PostHog Delete Person',
    description:
      'Delete a person from PostHog. This will remove all associated events and data. Use with caution.',
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
        description: 'Person ID or UUID to delete',
      },
    },

    request: {
      url: (params) => {
        const baseUrl = params.region === 'eu' ? 'https://eu.posthog.com' : 'https://us.posthog.com'
        return `${baseUrl}/api/projects/${params.projectId}/persons/${params.personId}/`
      },
      method: 'DELETE',
      headers: (params) => ({
        Authorization: `Bearer ${params.personalApiKey}`,
        'Content-Type': 'application/json',
      }),
    },

    transformResponse: async (response: Response) => {
      if (response.ok || response.status === 204) {
        return {
          success: true,
          output: {
            status: 'Person deleted successfully',
          },
        }
      }

      const error = await response.text()
      return {
        success: false,
        output: {
          status: 'Failed to delete person',
        },
        error: error || 'Unknown error occurred',
      }
    },

    outputs: {
      status: {
        type: 'string',
        description: 'Status message indicating whether the person was deleted successfully',
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: evaluate_flags.ts]---
Location: sim-main/apps/sim/tools/posthog/evaluate_flags.ts

```typescript
import type { ToolConfig } from '@/tools/types'

interface EvaluateFlagsParams {
  region: 'us' | 'eu'
  projectApiKey: string
  distinctId: string
  groups?: string
  personProperties?: string
  groupProperties?: string
}

interface FlagEvaluation {
  [key: string]: boolean | string
}

interface EvaluateFlagsResponse {
  featureFlags: FlagEvaluation
  featureFlagPayloads: Record<string, any>
  errorsWhileComputingFlags: boolean
}

export const evaluateFlagsTool: ToolConfig<EvaluateFlagsParams, EvaluateFlagsResponse> = {
  id: 'posthog_evaluate_flags',
  name: 'PostHog Evaluate Feature Flags',
  description:
    'Evaluate feature flags for a specific user or group. This is a public endpoint that uses the project API key.',
  version: '1.0.0',

  params: {
    region: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'PostHog cloud region: us or eu',
    },
    projectApiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'PostHog Project API Key (not personal API key)',
    },
    distinctId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The distinct ID of the user to evaluate flags for',
    },
    groups: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Groups as JSON string (e.g., {"company": "company_id_in_your_db"})',
    },
    personProperties: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Person properties as JSON string',
    },
    groupProperties: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Group properties as JSON string',
    },
  },

  request: {
    url: (params) => {
      const baseUrl =
        params.region === 'eu' ? 'https://eu.i.posthog.com' : 'https://us.i.posthog.com'
      return `${baseUrl}/decide?v=3`
    },
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.projectApiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: Record<string, any> = {
        distinct_id: params.distinctId,
      }

      if (params.groups) {
        try {
          body.groups = JSON.parse(params.groups)
        } catch {
          body.groups = {}
        }
      }

      if (params.personProperties) {
        try {
          body.person_properties = JSON.parse(params.personProperties)
        } catch {
          body.person_properties = {}
        }
      }

      if (params.groupProperties) {
        try {
          body.group_properties = JSON.parse(params.groupProperties)
        } catch {
          body.group_properties = {}
        }
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      featureFlags: data.featureFlags || {},
      featureFlagPayloads: data.featureFlagPayloads || {},
      errorsWhileComputingFlags: data.errorsWhileComputingFlags || false,
    }
  },

  outputs: {
    featureFlags: {
      type: 'object',
      description:
        'Feature flag evaluations (key-value pairs where values are boolean or string variants)',
    },
    featureFlagPayloads: {
      type: 'object',
      description: 'Additional payloads attached to feature flags',
    },
    errorsWhileComputingFlags: {
      type: 'boolean',
      description: 'Whether there were errors while computing flags',
    },
  },
}
```

--------------------------------------------------------------------------------

````
