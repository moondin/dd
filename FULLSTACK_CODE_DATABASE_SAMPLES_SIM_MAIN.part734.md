---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 734
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 734 of 933)

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

---[FILE: get_property_definition.ts]---
Location: sim-main/apps/sim/tools/posthog/get_property_definition.ts

```typescript
import type { ToolConfig } from '@/tools/types'

interface PostHogGetPropertyDefinitionParams {
  projectId: string
  propertyDefinitionId: string
  region: 'us' | 'eu'
  apiKey: string
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

export const getPropertyDefinitionTool: ToolConfig<
  PostHogGetPropertyDefinitionParams,
  PropertyDefinition
> = {
  id: 'posthog_get_property_definition',
  name: 'PostHog Get Property Definition',
  description:
    'Get details of a specific property definition in PostHog. Returns comprehensive information about the property including metadata, type, usage statistics, and verification status.',
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
      description: 'Property Definition ID to retrieve',
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
      return `${baseUrl}/api/projects/${params.projectId}/property_definitions/${params.propertyDefinitionId}`
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
      description: 'Property description',
    },
    tags: {
      type: 'array',
      description: 'Tags associated with the property',
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

---[FILE: get_session_recording.ts]---
Location: sim-main/apps/sim/tools/posthog/get_session_recording.ts

```typescript
import type { ToolConfig } from '@/tools/types'

interface PostHogGetSessionRecordingParams {
  apiKey: string
  projectId: string
  recordingId: string
  region?: 'us' | 'eu'
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
  start_url?: string
  person?: {
    id: string
    name?: string
    properties?: Record<string, any>
  }
  matching_events?: Array<{
    id: string
    event: string
    timestamp: string
    properties: Record<string, any>
  }>
  snapshot_data_by_window_id?: Record<string, any>
}

interface PostHogGetSessionRecordingResponse {
  success: boolean
  output: {
    recording: PostHogSessionRecording
  }
}

export const getSessionRecordingTool: ToolConfig<
  PostHogGetSessionRecordingParams,
  PostHogGetSessionRecordingResponse
> = {
  id: 'posthog_get_session_recording',
  name: 'PostHog Get Session Recording',
  description: 'Get details of a specific session recording in PostHog by ID.',
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
    recordingId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Session recording ID to retrieve',
    },
    region: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'PostHog cloud region: us or eu (default: us)',
      default: 'us',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = params.region === 'eu' ? 'https://eu.posthog.com' : 'https://us.posthog.com'
      return `${baseUrl}/api/projects/${params.projectId}/session_recordings/${params.recordingId}/`
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
        recording: data,
      },
    }
  },

  outputs: {
    recording: {
      type: 'object',
      description: 'Session recording details',
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
        start_url: { type: 'string', description: 'Starting URL of the recording' },
        person: { type: 'object', description: 'Person information' },
        matching_events: { type: 'array', description: 'Events that occurred during recording' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_survey.ts]---
Location: sim-main/apps/sim/tools/posthog/get_survey.ts

```typescript
import type { ToolConfig } from '@/tools/types'

interface PostHogGetSurveyParams {
  apiKey: string
  projectId: string
  surveyId: string
  region?: 'us' | 'eu'
}

interface PostHogSurveyQuestion {
  type: 'open' | 'link' | 'rating' | 'multiple_choice'
  question: string
  description?: string
  choices?: string[]
  scale?: number
  lowerBoundLabel?: string
  upperBoundLabel?: string
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
  current_iteration?: number
}

interface PostHogGetSurveyResponse {
  success: boolean
  output: {
    survey: PostHogSurvey
  }
}

export const getSurveyTool: ToolConfig<PostHogGetSurveyParams, PostHogGetSurveyResponse> = {
  id: 'posthog_get_survey',
  name: 'PostHog Get Survey',
  description: 'Get details of a specific survey in PostHog by ID.',
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
      description: 'Survey ID to retrieve',
    },
    region: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'PostHog cloud region: us or eu (default: us)',
      default: 'us',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = params.region === 'eu' ? 'https://eu.posthog.com' : 'https://us.posthog.com'
      return `${baseUrl}/api/projects/${params.projectId}/surveys/${params.surveyId}/`
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
        survey: data,
      },
    }
  },

  outputs: {
    survey: {
      type: 'object',
      description: 'Survey details',
      properties: {
        id: { type: 'string', description: 'Survey ID' },
        name: { type: 'string', description: 'Survey name' },
        description: { type: 'string', description: 'Survey description' },
        type: { type: 'string', description: 'Survey type (popover or api)' },
        questions: {
          type: 'array',
          description: 'Survey questions',
        },
        appearance: {
          type: 'object',
          description: 'Survey appearance configuration',
        },
        conditions: {
          type: 'object',
          description: 'Survey display conditions',
        },
        created_at: { type: 'string', description: 'Creation timestamp' },
        created_by: { type: 'object', description: 'Creator information' },
        start_date: { type: 'string', description: 'Survey start date' },
        end_date: { type: 'string', description: 'Survey end date' },
        archived: { type: 'boolean', description: 'Whether survey is archived' },
        responses_limit: { type: 'number', description: 'Maximum number of responses' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/posthog/index.ts

```typescript
// Core Data Operations

import { batchEventsTool } from '@/tools/posthog/batch_events'
import { captureEventTool } from '@/tools/posthog/capture_event'
import { createAnnotationTool } from '@/tools/posthog/create_annotation'
import { createCohortTool } from '@/tools/posthog/create_cohort'
import { createExperimentTool } from '@/tools/posthog/create_experiment'
import { createFeatureFlagTool } from '@/tools/posthog/create_feature_flag'
import { createInsightTool } from '@/tools/posthog/create_insight'
import { createSurveyTool } from '@/tools/posthog/create_survey'
import { deleteFeatureFlagTool } from '@/tools/posthog/delete_feature_flag'
import { deletePersonTool } from '@/tools/posthog/delete_person'
import { evaluateFlagsTool } from '@/tools/posthog/evaluate_flags'
import { getCohortTool } from '@/tools/posthog/get_cohort'
import { getDashboardTool } from '@/tools/posthog/get_dashboard'
import { getEventDefinitionTool } from '@/tools/posthog/get_event_definition'
import { getExperimentTool } from '@/tools/posthog/get_experiment'
import { getFeatureFlagTool } from '@/tools/posthog/get_feature_flag'
import { getInsightTool } from '@/tools/posthog/get_insight'
import { getOrganizationTool } from '@/tools/posthog/get_organization'
import { getPersonTool } from '@/tools/posthog/get_person'
import { getProjectTool } from '@/tools/posthog/get_project'
import { getPropertyDefinitionTool } from '@/tools/posthog/get_property_definition'
import { getSessionRecordingTool } from '@/tools/posthog/get_session_recording'
import { getSurveyTool } from '@/tools/posthog/get_survey'
import { listActionsTool } from '@/tools/posthog/list_actions'
import { listAnnotationsTool } from '@/tools/posthog/list_annotations'
import { listCohortsTool } from '@/tools/posthog/list_cohorts'
import { listDashboardsTool } from '@/tools/posthog/list_dashboards'
// Data Management
import { listEventDefinitionsTool } from '@/tools/posthog/list_event_definitions'
import { listEventsTool } from '@/tools/posthog/list_events'
import { listExperimentsTool } from '@/tools/posthog/list_experiments'
// Feature Management
import { listFeatureFlagsTool } from '@/tools/posthog/list_feature_flags'
// Analytics
import { listInsightsTool } from '@/tools/posthog/list_insights'
import { listOrganizationsTool } from '@/tools/posthog/list_organizations'
import { listPersonsTool } from '@/tools/posthog/list_persons'
// Configuration
import { listProjectsTool } from '@/tools/posthog/list_projects'
import { listPropertyDefinitionsTool } from '@/tools/posthog/list_property_definitions'
import { listRecordingPlaylistsTool } from '@/tools/posthog/list_recording_playlists'
import { listSessionRecordingsTool } from '@/tools/posthog/list_session_recordings'
// Engagement
import { listSurveysTool } from '@/tools/posthog/list_surveys'
import { queryTool } from '@/tools/posthog/query'
import { updateEventDefinitionTool } from '@/tools/posthog/update_event_definition'
import { updateFeatureFlagTool } from '@/tools/posthog/update_feature_flag'
import { updatePropertyDefinitionTool } from '@/tools/posthog/update_property_definition'
import { updateSurveyTool } from '@/tools/posthog/update_survey'

// Export all tools with posthog prefix
export const posthogCaptureEventTool = captureEventTool
export const posthogBatchEventsTool = batchEventsTool
export const posthogListEventsTool = listEventsTool
export const posthogListPersonsTool = listPersonsTool
export const posthogGetPersonTool = getPersonTool
export const posthogDeletePersonTool = deletePersonTool
export const posthogQueryTool = queryTool

export const posthogListInsightsTool = listInsightsTool
export const posthogGetInsightTool = getInsightTool
export const posthogCreateInsightTool = createInsightTool
export const posthogListDashboardsTool = listDashboardsTool
export const posthogGetDashboardTool = getDashboardTool
export const posthogListActionsTool = listActionsTool
export const posthogListCohortsTool = listCohortsTool
export const posthogGetCohortTool = getCohortTool
export const posthogCreateCohortTool = createCohortTool
export const posthogListAnnotationsTool = listAnnotationsTool
export const posthogCreateAnnotationTool = createAnnotationTool

export const posthogListFeatureFlagsTool = listFeatureFlagsTool
export const posthogGetFeatureFlagTool = getFeatureFlagTool
export const posthogCreateFeatureFlagTool = createFeatureFlagTool
export const posthogUpdateFeatureFlagTool = updateFeatureFlagTool
export const posthogDeleteFeatureFlagTool = deleteFeatureFlagTool
export const posthogEvaluateFlagsTool = evaluateFlagsTool
export const posthogListExperimentsTool = listExperimentsTool
export const posthogGetExperimentTool = getExperimentTool
export const posthogCreateExperimentTool = createExperimentTool

export const posthogListSurveysTool = listSurveysTool
export const posthogGetSurveyTool = getSurveyTool
export const posthogCreateSurveyTool = createSurveyTool
export const posthogUpdateSurveyTool = updateSurveyTool
export const posthogListSessionRecordingsTool = listSessionRecordingsTool
export const posthogGetSessionRecordingTool = getSessionRecordingTool
export const posthogListRecordingPlaylistsTool = listRecordingPlaylistsTool

export const posthogListEventDefinitionsTool = listEventDefinitionsTool
export const posthogGetEventDefinitionTool = getEventDefinitionTool
export const posthogUpdateEventDefinitionTool = updateEventDefinitionTool
export const posthogListPropertyDefinitionsTool = listPropertyDefinitionsTool
export const posthogGetPropertyDefinitionTool = getPropertyDefinitionTool
export const posthogUpdatePropertyDefinitionTool = updatePropertyDefinitionTool

export const posthogListProjectsTool = listProjectsTool
export const posthogGetProjectTool = getProjectTool
export const posthogListOrganizationsTool = listOrganizationsTool
export const posthogGetOrganizationTool = getOrganizationTool
```

--------------------------------------------------------------------------------

---[FILE: list_actions.ts]---
Location: sim-main/apps/sim/tools/posthog/list_actions.ts

```typescript
import type { ToolConfig } from '@/tools/types'

interface PostHogListActionsParams {
  apiKey: string
  projectId: string
  region: string
  limit?: number
  offset?: number
}

interface PostHogListActionsResponse {
  success: boolean
  output: {
    count: number
    next: string | null
    previous: string | null
    results: Array<{
      id: number
      name: string
      description: string
      tags: string[]
      post_to_slack: boolean
      slack_message_format: string
      steps: Array<Record<string, any>>
      created_at: string
      created_by: Record<string, any> | null
      deleted: boolean
      is_calculating: boolean
      last_calculated_at: string
    }>
  }
}

export const listActionsTool: ToolConfig<PostHogListActionsParams, PostHogListActionsResponse> = {
  id: 'posthog_list_actions',
  name: 'PostHog List Actions',
  description:
    'List all actions in a PostHog project. Returns action definitions, steps, and metadata.',
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
      let url = `${baseUrl}/api/projects/${params.projectId}/actions/`

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
        results: (data.results || []).map((action: any) => ({
          id: action.id,
          name: action.name || '',
          description: action.description || '',
          tags: action.tags || [],
          post_to_slack: action.post_to_slack || false,
          slack_message_format: action.slack_message_format || '',
          steps: action.steps || [],
          created_at: action.created_at,
          created_by: action.created_by || null,
          deleted: action.deleted || false,
          is_calculating: action.is_calculating || false,
          last_calculated_at: action.last_calculated_at || '',
        })),
      },
    }
  },

  outputs: {
    count: {
      type: 'number',
      description: 'Total number of actions in the project',
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
      description: 'List of actions with their definitions and metadata',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', description: 'Unique identifier for the action' },
          name: { type: 'string', description: 'Name of the action' },
          description: { type: 'string', description: 'Description of the action' },
          tags: { type: 'array', description: 'Tags associated with the action' },
          post_to_slack: {
            type: 'boolean',
            description: 'Whether to post this action to Slack',
          },
          slack_message_format: {
            type: 'string',
            description: 'Format string for Slack messages',
          },
          steps: { type: 'array', description: 'Steps that define the action' },
          created_at: { type: 'string', description: 'ISO timestamp when action was created' },
          created_by: { type: 'object', description: 'User who created the action' },
          deleted: { type: 'boolean', description: 'Whether the action is deleted' },
          is_calculating: {
            type: 'boolean',
            description: 'Whether the action is being calculated',
          },
          last_calculated_at: {
            type: 'string',
            description: 'ISO timestamp of last calculation',
          },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_annotations.ts]---
Location: sim-main/apps/sim/tools/posthog/list_annotations.ts

```typescript
import type { ToolConfig } from '@/tools/types'

interface PostHogListAnnotationsParams {
  apiKey: string
  projectId: string
  region: string
  limit?: number
  offset?: number
}

interface PostHogListAnnotationsResponse {
  success: boolean
  output: {
    count: number
    next: string | null
    previous: string | null
    results: Array<{
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
    }>
  }
}

export const listAnnotationsTool: ToolConfig<
  PostHogListAnnotationsParams,
  PostHogListAnnotationsResponse
> = {
  id: 'posthog_list_annotations',
  name: 'PostHog List Annotations',
  description:
    'List all annotations in a PostHog project. Returns annotation content, timestamps, and associated insights.',
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
      let url = `${baseUrl}/api/projects/${params.projectId}/annotations/`

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
        results: (data.results || []).map((annotation: any) => ({
          id: annotation.id,
          content: annotation.content || '',
          date_marker: annotation.date_marker,
          created_at: annotation.created_at,
          updated_at: annotation.updated_at,
          created_by: annotation.created_by || null,
          dashboard_item: annotation.dashboard_item || null,
          insight_short_id: annotation.insight_short_id || null,
          insight_name: annotation.insight_name || null,
          scope: annotation.scope || '',
          deleted: annotation.deleted || false,
        })),
      },
    }
  },

  outputs: {
    count: {
      type: 'number',
      description: 'Total number of annotations in the project',
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
      description: 'List of annotations with their content and metadata',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', description: 'Unique identifier for the annotation' },
          content: { type: 'string', description: 'Content/text of the annotation' },
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
          created_by: { type: 'object', description: 'User who created the annotation' },
          dashboard_item: {
            type: 'number',
            description: 'ID of dashboard item this annotation is attached to',
          },
          insight_short_id: {
            type: 'string',
            description: 'Short ID of the insight this annotation is attached to',
          },
          insight_name: {
            type: 'string',
            description: 'Name of the insight this annotation is attached to',
          },
          scope: { type: 'string', description: 'Scope of the annotation (project or dashboard)' },
          deleted: { type: 'boolean', description: 'Whether the annotation is deleted' },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_cohorts.ts]---
Location: sim-main/apps/sim/tools/posthog/list_cohorts.ts

```typescript
import type { ToolConfig } from '@/tools/types'

interface PostHogListCohortsParams {
  apiKey: string
  projectId: string
  region: string
  limit?: number
  offset?: number
}

interface PostHogListCohortsResponse {
  success: boolean
  output: {
    count: number
    next: string | null
    previous: string | null
    results: Array<{
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
    }>
  }
}

export const listCohortsTool: ToolConfig<PostHogListCohortsParams, PostHogListCohortsResponse> = {
  id: 'posthog_list_cohorts',
  name: 'PostHog List Cohorts',
  description:
    'List all cohorts in a PostHog project. Returns cohort definitions, filters, and user counts.',
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
      let url = `${baseUrl}/api/projects/${params.projectId}/cohorts/`

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
        results: (data.results || []).map((cohort: any) => ({
          id: cohort.id,
          name: cohort.name || '',
          description: cohort.description || '',
          groups: cohort.groups || [],
          deleted: cohort.deleted || false,
          filters: cohort.filters || {},
          query: cohort.query || null,
          created_at: cohort.created_at,
          created_by: cohort.created_by || null,
          is_calculating: cohort.is_calculating || false,
          last_calculation: cohort.last_calculation || '',
          errors_calculating: cohort.errors_calculating || 0,
          count: cohort.count || 0,
          is_static: cohort.is_static || false,
        })),
      },
    }
  },

  outputs: {
    count: {
      type: 'number',
      description: 'Total number of cohorts in the project',
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
      description: 'List of cohorts with their definitions and metadata',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', description: 'Unique identifier for the cohort' },
          name: { type: 'string', description: 'Name of the cohort' },
          description: { type: 'string', description: 'Description of the cohort' },
          groups: { type: 'array', description: 'Groups that define the cohort' },
          deleted: { type: 'boolean', description: 'Whether the cohort is deleted' },
          filters: { type: 'object', description: 'Filter configuration for the cohort' },
          query: { type: 'object', description: 'Query configuration for the cohort' },
          created_at: { type: 'string', description: 'ISO timestamp when cohort was created' },
          created_by: { type: 'object', description: 'User who created the cohort' },
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
          count: { type: 'number', description: 'Number of users in the cohort' },
          is_static: { type: 'boolean', description: 'Whether the cohort is static' },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_dashboards.ts]---
Location: sim-main/apps/sim/tools/posthog/list_dashboards.ts

```typescript
import type { ToolConfig } from '@/tools/types'

interface PostHogListDashboardsParams {
  apiKey: string
  projectId: string
  region: string
  limit?: number
  offset?: number
}

interface PostHogListDashboardsResponse {
  success: boolean
  output: {
    count: number
    next: string | null
    previous: string | null
    results: Array<{
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
    }>
  }
}

export const listDashboardsTool: ToolConfig<
  PostHogListDashboardsParams,
  PostHogListDashboardsResponse
> = {
  id: 'posthog_list_dashboards',
  name: 'PostHog List Dashboards',
  description:
    'List all dashboards in a PostHog project. Returns dashboard configurations, tiles, and metadata.',
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
      let url = `${baseUrl}/api/projects/${params.projectId}/dashboards/`

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
        results: (data.results || []).map((dashboard: any) => ({
          id: dashboard.id,
          name: dashboard.name || '',
          description: dashboard.description || '',
          pinned: dashboard.pinned || false,
          created_at: dashboard.created_at,
          created_by: dashboard.created_by || null,
          last_modified_at: dashboard.last_modified_at,
          last_modified_by: dashboard.last_modified_by || null,
          tiles: dashboard.tiles || [],
          filters: dashboard.filters || {},
          tags: dashboard.tags || [],
        })),
      },
    }
  },

  outputs: {
    count: {
      type: 'number',
      description: 'Total number of dashboards in the project',
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
      description: 'List of dashboards with their configurations and metadata',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', description: 'Unique identifier for the dashboard' },
          name: { type: 'string', description: 'Name of the dashboard' },
          description: { type: 'string', description: 'Description of the dashboard' },
          pinned: { type: 'boolean', description: 'Whether the dashboard is pinned' },
          created_at: { type: 'string', description: 'ISO timestamp when dashboard was created' },
          created_by: { type: 'object', description: 'User who created the dashboard' },
          last_modified_at: {
            type: 'string',
            description: 'ISO timestamp when dashboard was last modified',
          },
          last_modified_by: {
            type: 'object',
            description: 'User who last modified the dashboard',
          },
          tiles: { type: 'array', description: 'Tiles/widgets on the dashboard' },
          filters: { type: 'object', description: 'Global filters for the dashboard' },
          tags: { type: 'array', description: 'Tags associated with the dashboard' },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

````
