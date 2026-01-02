---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 694
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 694 of 933)

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
Location: sim-main/apps/sim/tools/incidentio/types.ts

```typescript
// Common types for incident.io tools
import type { ToolResponse } from '@/tools/types'

// Common parameters for all incident.io tools
export interface IncidentioBaseParams {
  apiKey: string
}

// Incident types
export interface IncidentioIncidentsListParams extends IncidentioBaseParams {
  page_size?: number
  after?: string
}

export interface IncidentioIncident {
  id: string
  name: string
  summary?: string
  description?: string
  mode?: string
  call_url?: string
  severity?: {
    id: string
    name: string
    rank: number
  }
  status?: {
    id: string
    name: string
    category: string
  }
  incident_type?: {
    id: string
    name: string
  }
  created_at: string
  updated_at: string
  incident_url?: string
  slack_channel_id?: string
  slack_channel_name?: string
  visibility?: string
}

export interface IncidentioIncidentsListResponse extends ToolResponse {
  output: {
    incidents: IncidentioIncident[]
    pagination_meta?: {
      after?: string
      page_size: number
      total_record_count?: number
    }
  }
}

export interface IncidentioIncidentsCreateParams extends IncidentioBaseParams {
  idempotency_key: string
  name?: string
  summary?: string
  severity_id: string
  incident_type_id?: string
  incident_status_id?: string
  visibility: string
}

export interface IncidentioIncidentsCreateResponse extends ToolResponse {
  output: {
    incident: IncidentioIncident
  }
}

export interface IncidentioIncidentsShowParams extends IncidentioBaseParams {
  id: string
}

export interface IncidentioIncidentDetailed extends IncidentioIncident {
  description?: string
  mode?: string
  permalink?: string
  custom_field_entries?: Array<{
    custom_field: {
      id: string
      name: string
      field_type: string
    }
    values: Array<{
      value_text?: string
      value_link?: string
      value_numeric?: string
    }>
  }>
  incident_role_assignments?: Array<{
    role: {
      id: string
      name: string
      role_type: string
    }
    assignee?: {
      id: string
      name: string
      email: string
    }
  }>
}

export interface IncidentioIncidentsShowResponse extends ToolResponse {
  output: {
    incident: IncidentioIncidentDetailed
  }
}

export interface IncidentioIncidentsUpdateParams extends IncidentioBaseParams {
  id: string
  name?: string
  summary?: string
  severity_id?: string
  incident_status_id?: string
  incident_type_id?: string
  notify_incident_channel: boolean
}

export interface IncidentioIncidentsUpdateResponse extends ToolResponse {
  output: {
    incident: IncidentioIncident
  }
}

// Action types
export interface IncidentioActionsListParams extends IncidentioBaseParams {
  incident_id?: string
  page_size?: number
}

export interface IncidentioAction {
  id: string
  description: string
  assignee?: {
    id: string
    name: string
    email: string
    role?: string
    slack_user_id?: string
  }
  status: string
  due_at?: string
  created_at: string
  updated_at: string
  incident_id?: string
  creator?: {
    id: string
    name: string
    email: string
  }
  completed_at?: string
  external_issue_reference?: {
    provider: string
    issue_name: string
    issue_permalink: string
  }
}

export interface IncidentioActionsListResponse extends ToolResponse {
  output: {
    actions: IncidentioAction[]
  }
}

export interface IncidentioActionsShowParams extends IncidentioBaseParams {
  id: string
}

export interface IncidentioActionsShowResponse extends ToolResponse {
  output: {
    action: IncidentioAction
  }
}

// Follow-up types
export interface IncidentioFollowUpsListParams extends IncidentioBaseParams {
  incident_id?: string
  page_size?: number
}

export interface IncidentioFollowUp {
  id: string
  title: string
  description?: string
  assignee?: {
    id: string
    name: string
    email: string
    role?: string
    slack_user_id?: string
  }
  status: string
  priority?: {
    id: string
    name: string
    description: string
    rank: number
  }
  created_at: string
  updated_at: string
  incident_id?: string
  creator?: {
    id: string
    name: string
    email: string
  }
  completed_at?: string
  labels?: string[]
  external_issue_reference?: {
    provider: string
    issue_name: string
    issue_permalink: string
  }
}

export interface IncidentioFollowUpsListResponse extends ToolResponse {
  output: {
    follow_ups: IncidentioFollowUp[]
  }
}

export interface IncidentioFollowUpsShowParams extends IncidentioBaseParams {
  id: string
}

export interface IncidentioFollowUpsShowResponse extends ToolResponse {
  output: {
    follow_up: IncidentioFollowUp
  }
}

// Workflow types
export interface Workflow {
  id: string
  name: string
  state: 'active' | 'draft' | 'disabled'
  folder?: string
  created_at?: string
  updated_at?: string
}

// Workflows List tool types
export interface WorkflowsListParams extends IncidentioBaseParams {
  page_size?: number
  after?: string
}

export interface WorkflowsListResponse extends ToolResponse {
  output: {
    workflows: Workflow[]
    pagination_meta?: {
      after?: string
      page_size: number
    }
  }
}

// Workflows Create tool types
export interface WorkflowsCreateParams extends IncidentioBaseParams {
  name: string
  folder?: string
  state?: 'active' | 'draft' | 'disabled'
  trigger?: string
  steps?: string
  condition_groups?: string
  runs_on_incidents?: 'newly_created' | 'newly_created_and_active' | 'active' | 'all'
  runs_on_incident_modes?: string
  include_private_incidents?: boolean
  continue_on_step_error?: boolean
  once_for?: string
  expressions?: string
  delay?: string
}

export interface WorkflowsCreateResponse extends ToolResponse {
  output: {
    workflow: Workflow
  }
}

// Workflows Show tool types
export interface WorkflowsShowParams extends IncidentioBaseParams {
  id: string
}

export interface WorkflowsShowResponse extends ToolResponse {
  output: {
    workflow: Workflow
  }
}

// Workflows Update tool types
export interface WorkflowsUpdateParams extends IncidentioBaseParams {
  id: string
  name?: string
  state?: 'active' | 'draft' | 'disabled'
  folder?: string
}

export interface WorkflowsUpdateResponse extends ToolResponse {
  output: {
    workflow: Workflow
  }
}

// Workflows Delete tool types
export interface WorkflowsDeleteParams extends IncidentioBaseParams {
  id: string
}

export interface WorkflowsDeleteResponse extends ToolResponse {
  output: {
    message: string
  }
}

// Custom field types
export type CustomFieldType = 'text' | 'single_select' | 'multi_select' | 'numeric' | 'link'

export interface CustomField {
  id: string
  name: string
  description?: string
  field_type: CustomFieldType
  created_at: string
  updated_at: string
  options?: CustomFieldOption[]
}

export interface CustomFieldOption {
  id: string
  value: string
  sort_key: number
}

// List custom fields
export interface CustomFieldsListParams extends IncidentioBaseParams {}

export interface CustomFieldsListResponse extends ToolResponse {
  output: {
    custom_fields: CustomField[]
  }
}

// Create custom field
export interface CustomFieldsCreateParams extends IncidentioBaseParams {
  name: string
  description?: string
  field_type: CustomFieldType
}

export interface CustomFieldsCreateResponse extends ToolResponse {
  output: {
    custom_field: CustomField
  }
}

// Show custom field
export interface CustomFieldsShowParams extends IncidentioBaseParams {
  id: string
}

export interface CustomFieldsShowResponse extends ToolResponse {
  output: {
    custom_field: CustomField
  }
}

// Update custom field
export interface CustomFieldsUpdateParams extends IncidentioBaseParams {
  id: string
  name?: string
  description?: string
}

export interface CustomFieldsUpdateResponse extends ToolResponse {
  output: {
    custom_field: CustomField
  }
}

// Delete custom field
export interface CustomFieldsDeleteParams extends IncidentioBaseParams {
  id: string
}

export interface CustomFieldsDeleteResponse extends ToolResponse {
  output: {
    message: string
  }
}

// Users list tool types
export interface IncidentioUsersListParams extends IncidentioBaseParams {
  page_size?: number
}

export interface IncidentioUser {
  id: string
  name: string
  email: string
  role: string
}

export interface IncidentioUsersListResponse extends ToolResponse {
  output: {
    users: IncidentioUser[]
  }
}

// Users show tool types
export interface IncidentioUsersShowParams extends IncidentioBaseParams {
  id: string
}

export interface IncidentioUsersShowResponse extends ToolResponse {
  output: {
    user: IncidentioUser
  }
}

// Severities list tool types
export interface IncidentioSeveritiesListParams extends IncidentioBaseParams {}

export interface IncidentioSeverity {
  id: string
  name: string
  description: string
  rank: number
}

export interface IncidentioSeveritiesListResponse extends ToolResponse {
  output: {
    severities: IncidentioSeverity[]
  }
}

// Incident statuses list tool types
export interface IncidentioIncidentStatusesListParams extends IncidentioBaseParams {}

export interface IncidentioIncidentStatus {
  id: string
  name: string
  description: string
  category: string
}

export interface IncidentioIncidentStatusesListResponse extends ToolResponse {
  output: {
    incident_statuses: IncidentioIncidentStatus[]
  }
}

// Incident types list tool types
export interface IncidentioIncidentTypesListParams extends IncidentioBaseParams {}

export interface IncidentioIncidentType {
  id: string
  name: string
  description: string
  is_default: boolean
}

export interface IncidentioIncidentTypesListResponse extends ToolResponse {
  output: {
    incident_types: IncidentioIncidentType[]
  }
}

export type IncidentioResponse =
  | IncidentioIncidentsListResponse
  | IncidentioIncidentsCreateResponse
  | IncidentioIncidentsShowResponse
  | IncidentioIncidentsUpdateResponse
  | IncidentioActionsListResponse
  | IncidentioActionsShowResponse
  | IncidentioFollowUpsListResponse
  | IncidentioFollowUpsShowResponse
  | WorkflowsListResponse
  | WorkflowsCreateResponse
  | WorkflowsShowResponse
  | WorkflowsUpdateResponse
  | WorkflowsDeleteResponse
  | CustomFieldsListResponse
  | CustomFieldsCreateResponse
  | CustomFieldsShowResponse
  | CustomFieldsUpdateResponse
  | CustomFieldsDeleteResponse
  | IncidentioUsersListResponse
  | IncidentioUsersShowResponse
  | IncidentioSeveritiesListResponse
  | IncidentioIncidentStatusesListResponse
  | IncidentioIncidentTypesListResponse
  | IncidentioEscalationsListResponse
  | IncidentioEscalationsCreateResponse
  | IncidentioEscalationsShowResponse
  | IncidentioSchedulesListResponse
  | IncidentioSchedulesCreateResponse
  | IncidentioSchedulesShowResponse
  | IncidentioSchedulesUpdateResponse
  | IncidentioSchedulesDeleteResponse
  | IncidentioIncidentRolesListResponse
  | IncidentioIncidentRolesCreateResponse
  | IncidentioIncidentRolesShowResponse
  | IncidentioIncidentRolesUpdateResponse
  | IncidentioIncidentRolesDeleteResponse
  | IncidentioIncidentTimestampsListResponse
  | IncidentioIncidentTimestampsShowResponse
  | IncidentioIncidentUpdatesListResponse
  | IncidentioScheduleEntriesListResponse
  | IncidentioScheduleOverridesCreateResponse
  | IncidentioEscalationPathsCreateResponse
  | IncidentioEscalationPathsShowResponse
  | IncidentioEscalationPathsUpdateResponse
  | IncidentioEscalationPathsDeleteResponse

// Escalations types
export interface IncidentioEscalationsListParams extends IncidentioBaseParams {
  page_size?: number
}

export interface IncidentioEscalation {
  id: string
  name: string
  created_at?: string
  updated_at?: string
}

export interface IncidentioEscalationsListResponse extends ToolResponse {
  output: {
    escalations: IncidentioEscalation[]
  }
}

export interface IncidentioEscalationsCreateParams extends IncidentioBaseParams {
  idempotency_key: string
  title: string
  escalation_path_id?: string
  user_ids?: string
}

export interface IncidentioEscalationsCreateResponse extends ToolResponse {
  output: {
    escalation: IncidentioEscalation
  }
}

export interface IncidentioEscalationsShowParams extends IncidentioBaseParams {
  id: string
}

export interface IncidentioEscalationsShowResponse extends ToolResponse {
  output: {
    escalation: IncidentioEscalation
  }
}

// Schedules types
export interface IncidentioSchedulesListParams extends IncidentioBaseParams {
  page_size?: number
  after?: string
}

export interface IncidentioSchedule {
  id: string
  name: string
  timezone: string
  created_at?: string
  updated_at?: string
}

export interface IncidentioSchedulesListResponse extends ToolResponse {
  output: {
    schedules: IncidentioSchedule[]
    pagination_meta?: {
      after?: string
      page_size: number
    }
  }
}

export interface IncidentioSchedulesCreateParams extends IncidentioBaseParams {
  name: string
  timezone: string
  config: string
}

export interface IncidentioSchedulesCreateResponse extends ToolResponse {
  output: {
    schedule: IncidentioSchedule
  }
}

export interface IncidentioSchedulesShowParams extends IncidentioBaseParams {
  id: string
}

export interface IncidentioSchedulesShowResponse extends ToolResponse {
  output: {
    schedule: IncidentioSchedule
  }
}

export interface IncidentioSchedulesUpdateParams extends IncidentioBaseParams {
  id: string
  name?: string
  timezone?: string
  config?: string
}

export interface IncidentioSchedulesUpdateResponse extends ToolResponse {
  output: {
    schedule: IncidentioSchedule
  }
}

export interface IncidentioSchedulesDeleteParams extends IncidentioBaseParams {
  id: string
}

export interface IncidentioSchedulesDeleteResponse extends ToolResponse {
  output: {
    message: string
  }
}

// Incident Roles types
export interface IncidentioIncidentRole {
  id: string
  name: string
  description?: string
  instructions: string
  shortform: string
  role_type: string
  required: boolean
  created_at: string
  updated_at: string
}

export interface IncidentioIncidentRolesListParams extends IncidentioBaseParams {}

export interface IncidentioIncidentRolesListResponse extends ToolResponse {
  output: {
    incident_roles: IncidentioIncidentRole[]
  }
}

export interface IncidentioIncidentRolesCreateParams extends IncidentioBaseParams {
  name: string
  description: string
  instructions: string
  shortform: string
}

export interface IncidentioIncidentRolesCreateResponse extends ToolResponse {
  output: {
    incident_role: IncidentioIncidentRole
  }
}

export interface IncidentioIncidentRolesShowParams extends IncidentioBaseParams {
  id: string
}

export interface IncidentioIncidentRolesShowResponse extends ToolResponse {
  output: {
    incident_role: IncidentioIncidentRole
  }
}

export interface IncidentioIncidentRolesUpdateParams extends IncidentioBaseParams {
  id: string
  name: string
  description: string
  instructions: string
  shortform: string
}

export interface IncidentioIncidentRolesUpdateResponse extends ToolResponse {
  output: {
    incident_role: IncidentioIncidentRole
  }
}

export interface IncidentioIncidentRolesDeleteParams extends IncidentioBaseParams {
  id: string
}

export interface IncidentioIncidentRolesDeleteResponse extends ToolResponse {
  output: {
    message: string
  }
}

// Incident Timestamps types
export interface IncidentioIncidentTimestamp {
  id: string
  name: string
  rank: number
  created_at: string
  updated_at: string
}

export interface IncidentioIncidentTimestampsListParams extends IncidentioBaseParams {}

export interface IncidentioIncidentTimestampsListResponse extends ToolResponse {
  output: {
    incident_timestamps: IncidentioIncidentTimestamp[]
  }
}

export interface IncidentioIncidentTimestampsShowParams extends IncidentioBaseParams {
  id: string
}

export interface IncidentioIncidentTimestampsShowResponse extends ToolResponse {
  output: {
    incident_timestamp: IncidentioIncidentTimestamp
  }
}

// Incident Updates types
export interface IncidentioIncidentUpdate {
  id: string
  incident_id: string
  message: string
  new_severity?: {
    id: string
    name: string
    rank: number
  }
  new_status?: {
    id: string
    name: string
    category: string
  }
  updater: {
    id: string
    name: string
    email: string
  }
  created_at: string
  updated_at: string
}

export interface IncidentioIncidentUpdatesListParams extends IncidentioBaseParams {
  incident_id?: string
  page_size?: number
  after?: string
}

export interface IncidentioIncidentUpdatesListResponse extends ToolResponse {
  output: {
    incident_updates: IncidentioIncidentUpdate[]
    pagination_meta?: {
      after?: string
      page_size: number
    }
  }
}

// Schedule Entries types
export interface IncidentioScheduleEntry {
  id: string
  schedule_id: string
  user: {
    id: string
    name: string
    email: string
  }
  start_at: string
  end_at: string
  layer_id: string
  created_at: string
  updated_at: string
}

export interface IncidentioScheduleEntriesListParams extends IncidentioBaseParams {
  schedule_id: string
  entry_window_start?: string
  entry_window_end?: string
  page_size?: number
  after?: string
}

export interface IncidentioScheduleEntriesListResponse extends ToolResponse {
  output: {
    schedule_entries: IncidentioScheduleEntry[]
    pagination_meta?: {
      after?: string
      after_url?: string
      page_size: number
    }
  }
}

// Schedule Overrides types
export interface IncidentioScheduleOverride {
  id: string
  rotation_id: string
  schedule_id: string
  user: {
    id: string
    name: string
    email: string
  }
  start_at: string
  end_at: string
  created_at: string
  updated_at: string
}

export interface IncidentioScheduleOverridesCreateParams extends IncidentioBaseParams {
  rotation_id: string
  schedule_id: string
  user_id?: string
  user_email?: string
  user_slack_id?: string
  start_at: string
  end_at: string
}

export interface IncidentioScheduleOverridesCreateResponse extends ToolResponse {
  output: {
    override: IncidentioScheduleOverride
  }
}

// Escalation Paths types
export interface IncidentioEscalationPathTarget {
  id: string
  type: string
  schedule_id?: string
  user_id?: string
  urgency: string
}

export interface IncidentioEscalationPathLevel {
  targets: IncidentioEscalationPathTarget[]
  time_to_ack_seconds: number
}

export interface IncidentioEscalationPath {
  id: string
  name: string
  path: IncidentioEscalationPathLevel[]
  working_hours?: Array<{
    weekday: string
    start_time: string
    end_time: string
  }>
  created_at: string
  updated_at: string
}

export interface IncidentioEscalationPathsCreateParams extends IncidentioBaseParams {
  name: string
  path: Array<{
    targets: Array<{
      id: string
      type: string
      schedule_id?: string
      user_id?: string
      urgency: string
    }>
    time_to_ack_seconds: number
  }>
  working_hours?: Array<{
    weekday: string
    start_time: string
    end_time: string
  }>
}

export interface IncidentioEscalationPathsCreateResponse extends ToolResponse {
  output: {
    escalation_path: IncidentioEscalationPath
  }
}

export interface IncidentioEscalationPathsShowParams extends IncidentioBaseParams {
  id: string
}

export interface IncidentioEscalationPathsShowResponse extends ToolResponse {
  output: {
    escalation_path: IncidentioEscalationPath
  }
}

export interface IncidentioEscalationPathsUpdateParams extends IncidentioBaseParams {
  id: string
  name?: string
  path?: Array<{
    targets: Array<{
      id: string
      type: string
      schedule_id?: string
      user_id?: string
      urgency: string
    }>
    time_to_ack_seconds: number
  }>
  working_hours?: Array<{
    weekday: string
    start_time: string
    end_time: string
  }>
}

export interface IncidentioEscalationPathsUpdateResponse extends ToolResponse {
  output: {
    escalation_path: IncidentioEscalationPath
  }
}

export interface IncidentioEscalationPathsDeleteParams extends IncidentioBaseParams {
  id: string
}

export interface IncidentioEscalationPathsDeleteResponse extends ToolResponse {
  output: {
    message: string
  }
}
```

--------------------------------------------------------------------------------

---[FILE: users_list.ts]---
Location: sim-main/apps/sim/tools/incidentio/users_list.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { IncidentioUsersListParams, IncidentioUsersListResponse } from './types'

export const usersListTool: ToolConfig<IncidentioUsersListParams, IncidentioUsersListResponse> = {
  id: 'incidentio_users_list',
  name: 'Incident.io Users List',
  description:
    'List all users in your Incident.io workspace. Returns user details including id, name, email, and role.',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Incident.io API Key',
    },
    page_size: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of results to return per page (default: 25)',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = 'https://api.incident.io/v2/users'
      if (params.page_size) {
        return `${baseUrl}?page_size=${params.page_size}`
      }
      return baseUrl
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
        users: data.users.map((user: any) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        })),
      },
    }
  },

  outputs: {
    users: {
      type: 'array',
      description: 'List of users in the workspace',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Unique identifier for the user' },
          name: { type: 'string', description: 'Full name of the user' },
          email: { type: 'string', description: 'Email address of the user' },
          role: { type: 'string', description: 'Role of the user in the workspace' },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: users_show.ts]---
Location: sim-main/apps/sim/tools/incidentio/users_show.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { IncidentioUsersShowParams, IncidentioUsersShowResponse } from './types'

export const usersShowTool: ToolConfig<IncidentioUsersShowParams, IncidentioUsersShowResponse> = {
  id: 'incidentio_users_show',
  name: 'Incident.io Users Show',
  description:
    'Get detailed information about a specific user in your Incident.io workspace by their ID.',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Incident.io API Key',
    },
    id: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The unique identifier of the user to retrieve',
    },
  },

  request: {
    url: (params) => `https://api.incident.io/v2/users/${params.id}`,
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
        user: {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
        },
      },
    }
  },

  outputs: {
    user: {
      type: 'object',
      description: 'Details of the requested user',
      properties: {
        id: { type: 'string', description: 'Unique identifier for the user' },
        name: { type: 'string', description: 'Full name of the user' },
        email: { type: 'string', description: 'Email address of the user' },
        role: { type: 'string', description: 'Role of the user in the workspace' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: workflows_create.ts]---
Location: sim-main/apps/sim/tools/incidentio/workflows_create.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { WorkflowsCreateParams, WorkflowsCreateResponse } from './types'

export const workflowsCreateTool: ToolConfig<WorkflowsCreateParams, WorkflowsCreateResponse> = {
  id: 'incidentio_workflows_create',
  name: 'incident.io Workflows Create',
  description: 'Create a new workflow in incident.io.',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'incident.io API Key',
    },
    name: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Name of the workflow',
    },
    folder: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Folder to organize the workflow in',
    },
    state: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'State of the workflow (active, draft, or disabled)',
      default: 'draft',
    },
    trigger: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Trigger type for the workflow (e.g., "incident.updated", "incident.created")',
      default: 'incident.updated',
    },
    steps: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Array of workflow steps as JSON string. Example: [{"label": "Notify team", "name": "slack.post_message"}]',
      default: '[]',
    },
    condition_groups: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Array of condition groups as JSON string to control when the workflow runs. Example: [{"conditions": [{"operation": "one_of", "param_bindings": [], "subject": "incident.severity"}]}]',
      default: '[]',
    },
    runs_on_incidents: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'When to run the workflow: "newly_created" (only new incidents), "newly_created_and_active" (new and active incidents), "active" (only active incidents), or "all" (all incidents)',
      default: 'newly_created',
    },
    runs_on_incident_modes: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Array of incident modes to run on as JSON string. Example: ["standard", "retrospective"]',
      default: '["standard"]',
    },
    include_private_incidents: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Whether to include private incidents',
      default: true,
    },
    continue_on_step_error: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Whether to continue executing subsequent steps if a step fails',
      default: false,
    },
    once_for: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Array of fields to ensure the workflow runs only once per unique combination of these fields, as JSON string. Example: ["incident.id"]',
      default: '[]',
    },
    expressions: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Array of workflow expressions as JSON string for advanced workflow logic. Example: [{"label": "My expression", "operations": []}]',
      default: '[]',
    },
    delay: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Delay configuration as JSON string. Example: {"for_seconds": 60, "conditions_apply_over_delay": false}',
    },
  },

  request: {
    url: 'https://api.incident.io/v2/workflows',
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
    body: (params) => {
      // Helper function to safely parse JSON strings
      const parseJsonParam = (jsonString: string | undefined, defaultValue: any) => {
        if (!jsonString) return defaultValue
        try {
          return JSON.parse(jsonString)
        } catch (error) {
          console.warn(`Failed to parse JSON parameter: ${jsonString}`, error)
          return defaultValue
        }
      }

      // incident.io requires all these fields to create a workflow
      const body: Record<string, any> = {
        name: params.name,
        trigger: params.trigger || 'incident.updated',
        once_for: parseJsonParam(params.once_for, []),
        condition_groups: parseJsonParam(params.condition_groups, []),
        steps: parseJsonParam(params.steps, []),
        expressions: parseJsonParam(params.expressions, []),
        include_private_incidents: params.include_private_incidents ?? true,
        runs_on_incident_modes: parseJsonParam(params.runs_on_incident_modes, ['standard']),
        continue_on_step_error: params.continue_on_step_error ?? false,
        runs_on_incidents: params.runs_on_incidents || 'newly_created',
        state: params.state || 'draft',
      }

      if (params.folder) {
        body.folder = params.folder
      }

      if (params.delay) {
        body.delay = parseJsonParam(params.delay, undefined)
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        workflow: {
          id: data.workflow.id,
          name: data.workflow.name,
          state: data.workflow.state,
          folder: data.workflow.folder,
          created_at: data.workflow.created_at,
          updated_at: data.workflow.updated_at,
        },
      },
    }
  },

  outputs: {
    workflow: {
      type: 'object',
      description: 'The created workflow',
      properties: {
        id: { type: 'string', description: 'Unique identifier for the workflow' },
        name: { type: 'string', description: 'Name of the workflow' },
        state: {
          type: 'string',
          description: 'State of the workflow (active, draft, or disabled)',
        },
        folder: { type: 'string', description: 'Folder the workflow belongs to', optional: true },
        created_at: {
          type: 'string',
          description: 'When the workflow was created',
          optional: true,
        },
        updated_at: {
          type: 'string',
          description: 'When the workflow was last updated',
          optional: true,
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: workflows_delete.ts]---
Location: sim-main/apps/sim/tools/incidentio/workflows_delete.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { WorkflowsDeleteParams, WorkflowsDeleteResponse } from './types'

export const workflowsDeleteTool: ToolConfig<WorkflowsDeleteParams, WorkflowsDeleteResponse> = {
  id: 'incidentio_workflows_delete',
  name: 'incident.io Workflows Delete',
  description: 'Delete a workflow in incident.io.',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'incident.io API Key',
    },
    id: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The ID of the workflow to delete',
    },
  },

  request: {
    url: (params) => `https://api.incident.io/v2/workflows/${params.id}`,
    method: 'DELETE',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
  },

  transformResponse: async (response: Response) => {
    return {
      success: true,
      output: {
        message: 'Workflow deleted successfully',
      },
    }
  },

  outputs: {
    message: {
      type: 'string',
      description: 'Success message',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: workflows_list.ts]---
Location: sim-main/apps/sim/tools/incidentio/workflows_list.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { WorkflowsListParams, WorkflowsListResponse } from './types'

export const workflowsListTool: ToolConfig<WorkflowsListParams, WorkflowsListResponse> = {
  id: 'incidentio_workflows_list',
  name: 'incident.io Workflows List',
  description: 'List all workflows in your incident.io workspace.',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'incident.io API Key',
    },
    page_size: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of workflows to return per page',
    },
    after: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Pagination cursor to fetch the next page of results',
    },
  },

  request: {
    url: (params) => {
      const url = new URL('https://api.incident.io/v2/workflows')

      if (params.page_size) {
        url.searchParams.set('page_size', Number(params.page_size).toString())
      }

      if (params.after) {
        url.searchParams.set('after', params.after)
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
        workflows: data.workflows.map((workflow: any) => ({
          id: workflow.id,
          name: workflow.name,
          state: workflow.state,
          folder: workflow.folder,
          created_at: workflow.created_at,
          updated_at: workflow.updated_at,
        })),
        pagination_meta: data.pagination_meta
          ? {
              after: data.pagination_meta.after,
              page_size: data.pagination_meta.page_size,
            }
          : undefined,
      },
    }
  },

  outputs: {
    workflows: {
      type: 'array',
      description: 'List of workflows',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Unique identifier for the workflow' },
          name: { type: 'string', description: 'Name of the workflow' },
          state: {
            type: 'string',
            description: 'State of the workflow (active, draft, or disabled)',
          },
          folder: { type: 'string', description: 'Folder the workflow belongs to', optional: true },
          created_at: {
            type: 'string',
            description: 'When the workflow was created',
            optional: true,
          },
          updated_at: {
            type: 'string',
            description: 'When the workflow was last updated',
            optional: true,
          },
        },
      },
    },
    pagination_meta: {
      type: 'object',
      description: 'Pagination metadata',
      optional: true,
      properties: {
        after: { type: 'string', description: 'Cursor for next page', optional: true },
        page_size: { type: 'number', description: 'Number of results per page' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: workflows_show.ts]---
Location: sim-main/apps/sim/tools/incidentio/workflows_show.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { WorkflowsShowParams, WorkflowsShowResponse } from './types'

export const workflowsShowTool: ToolConfig<WorkflowsShowParams, WorkflowsShowResponse> = {
  id: 'incidentio_workflows_show',
  name: 'incident.io Workflows Show',
  description: 'Get details of a specific workflow in incident.io.',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'incident.io API Key',
    },
    id: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The ID of the workflow to retrieve',
    },
  },

  request: {
    url: (params) => `https://api.incident.io/v2/workflows/${params.id}`,
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
        workflow: {
          id: data.workflow.id,
          name: data.workflow.name,
          state: data.workflow.state,
          folder: data.workflow.folder,
          created_at: data.workflow.created_at,
          updated_at: data.workflow.updated_at,
        },
      },
    }
  },

  outputs: {
    workflow: {
      type: 'object',
      description: 'The workflow details',
      properties: {
        id: { type: 'string', description: 'Unique identifier for the workflow' },
        name: { type: 'string', description: 'Name of the workflow' },
        state: {
          type: 'string',
          description: 'State of the workflow (active, draft, or disabled)',
        },
        folder: { type: 'string', description: 'Folder the workflow belongs to', optional: true },
        created_at: {
          type: 'string',
          description: 'When the workflow was created',
          optional: true,
        },
        updated_at: {
          type: 'string',
          description: 'When the workflow was last updated',
          optional: true,
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

````
