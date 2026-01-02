---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 693
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 693 of 933)

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

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/incidentio/index.ts

```typescript
import { actionsListTool } from '@/tools/incidentio/actions_list'
import { actionsShowTool } from '@/tools/incidentio/actions_show'
import { customFieldsCreateTool } from '@/tools/incidentio/custom_fields_create'
import { customFieldsDeleteTool } from '@/tools/incidentio/custom_fields_delete'
import { customFieldsListTool } from '@/tools/incidentio/custom_fields_list'
import { customFieldsShowTool } from '@/tools/incidentio/custom_fields_show'
import { customFieldsUpdateTool } from '@/tools/incidentio/custom_fields_update'
import { escalationPathsCreateTool } from '@/tools/incidentio/escalation_paths_create'
import { escalationPathsDeleteTool } from '@/tools/incidentio/escalation_paths_delete'
import { escalationPathsShowTool } from '@/tools/incidentio/escalation_paths_show'
import { escalationPathsUpdateTool } from '@/tools/incidentio/escalation_paths_update'
import { escalationsCreateTool } from '@/tools/incidentio/escalations_create'
import { escalationsListTool } from '@/tools/incidentio/escalations_list'
import { escalationsShowTool } from '@/tools/incidentio/escalations_show'
import { followUpsListTool } from '@/tools/incidentio/follow_ups_list'
import { followUpsShowTool } from '@/tools/incidentio/follow_ups_show'
import { incidentRolesCreateTool } from '@/tools/incidentio/incident_roles_create'
import { incidentRolesDeleteTool } from '@/tools/incidentio/incident_roles_delete'
import { incidentRolesListTool } from '@/tools/incidentio/incident_roles_list'
import { incidentRolesShowTool } from '@/tools/incidentio/incident_roles_show'
import { incidentRolesUpdateTool } from '@/tools/incidentio/incident_roles_update'
import { incidentStatusesListTool } from '@/tools/incidentio/incident_statuses_list'
import { incidentTimestampsListTool } from '@/tools/incidentio/incident_timestamps_list'
import { incidentTimestampsShowTool } from '@/tools/incidentio/incident_timestamps_show'
import { incidentTypesListTool } from '@/tools/incidentio/incident_types_list'
import { incidentUpdatesListTool } from '@/tools/incidentio/incident_updates_list'
import { incidentsCreateTool } from '@/tools/incidentio/incidents_create'
import { incidentsListTool } from '@/tools/incidentio/incidents_list'
import { incidentsShowTool } from '@/tools/incidentio/incidents_show'
import { incidentsUpdateTool } from '@/tools/incidentio/incidents_update'
import { scheduleEntriesListTool } from '@/tools/incidentio/schedule_entries_list'
import { scheduleOverridesCreateTool } from '@/tools/incidentio/schedule_overrides_create'
import { schedulesCreateTool } from '@/tools/incidentio/schedules_create'
import { schedulesDeleteTool } from '@/tools/incidentio/schedules_delete'
import { schedulesListTool } from '@/tools/incidentio/schedules_list'
import { schedulesShowTool } from '@/tools/incidentio/schedules_show'
import { schedulesUpdateTool } from '@/tools/incidentio/schedules_update'
import { severitiesListTool } from '@/tools/incidentio/severities_list'
import { usersListTool } from '@/tools/incidentio/users_list'
import { usersShowTool } from '@/tools/incidentio/users_show'
import { workflowsCreateTool } from '@/tools/incidentio/workflows_create'
import { workflowsDeleteTool } from '@/tools/incidentio/workflows_delete'
import { workflowsListTool } from '@/tools/incidentio/workflows_list'
import { workflowsShowTool } from '@/tools/incidentio/workflows_show'
import { workflowsUpdateTool } from '@/tools/incidentio/workflows_update'

export const incidentioIncidentsListTool = incidentsListTool
export const incidentioIncidentsCreateTool = incidentsCreateTool
export const incidentioIncidentsShowTool = incidentsShowTool
export const incidentioIncidentsUpdateTool = incidentsUpdateTool
export const incidentioActionsListTool = actionsListTool
export const incidentioActionsShowTool = actionsShowTool
export const incidentioFollowUpsListTool = followUpsListTool
export const incidentioFollowUpsShowTool = followUpsShowTool
export const incidentioWorkflowsListTool = workflowsListTool
export const incidentioWorkflowsCreateTool = workflowsCreateTool
export const incidentioWorkflowsShowTool = workflowsShowTool
export const incidentioWorkflowsUpdateTool = workflowsUpdateTool
export const incidentioWorkflowsDeleteTool = workflowsDeleteTool
export const incidentioCustomFieldsListTool = customFieldsListTool
export const incidentioCustomFieldsCreateTool = customFieldsCreateTool
export const incidentioCustomFieldsShowTool = customFieldsShowTool
export const incidentioCustomFieldsUpdateTool = customFieldsUpdateTool
export const incidentioCustomFieldsDeleteTool = customFieldsDeleteTool
export const incidentioUsersListTool = usersListTool
export const incidentioUsersShowTool = usersShowTool
export const incidentioSeveritiesListTool = severitiesListTool
export const incidentioIncidentStatusesListTool = incidentStatusesListTool
export const incidentioIncidentTypesListTool = incidentTypesListTool
export const incidentioEscalationsListTool = escalationsListTool
export const incidentioEscalationsCreateTool = escalationsCreateTool
export const incidentioEscalationsShowTool = escalationsShowTool
export const incidentioSchedulesListTool = schedulesListTool
export const incidentioSchedulesCreateTool = schedulesCreateTool
export const incidentioSchedulesShowTool = schedulesShowTool
export const incidentioSchedulesUpdateTool = schedulesUpdateTool
export const incidentioSchedulesDeleteTool = schedulesDeleteTool
export const incidentioIncidentRolesListTool = incidentRolesListTool
export const incidentioIncidentRolesCreateTool = incidentRolesCreateTool
export const incidentioIncidentRolesShowTool = incidentRolesShowTool
export const incidentioIncidentRolesUpdateTool = incidentRolesUpdateTool
export const incidentioIncidentRolesDeleteTool = incidentRolesDeleteTool
export const incidentioIncidentTimestampsListTool = incidentTimestampsListTool
export const incidentioIncidentTimestampsShowTool = incidentTimestampsShowTool
export const incidentioIncidentUpdatesListTool = incidentUpdatesListTool
export const incidentioScheduleEntriesListTool = scheduleEntriesListTool
export const incidentioScheduleOverridesCreateTool = scheduleOverridesCreateTool
export const incidentioEscalationPathsCreateTool = escalationPathsCreateTool
export const incidentioEscalationPathsShowTool = escalationPathsShowTool
export const incidentioEscalationPathsUpdateTool = escalationPathsUpdateTool
export const incidentioEscalationPathsDeleteTool = escalationPathsDeleteTool
```

--------------------------------------------------------------------------------

---[FILE: schedules_create.ts]---
Location: sim-main/apps/sim/tools/incidentio/schedules_create.ts

```typescript
import type {
  IncidentioSchedulesCreateParams,
  IncidentioSchedulesCreateResponse,
} from '@/tools/incidentio/types'
import type { ToolConfig } from '@/tools/types'

export const schedulesCreateTool: ToolConfig<
  IncidentioSchedulesCreateParams,
  IncidentioSchedulesCreateResponse
> = {
  id: 'incidentio_schedules_create',
  name: 'Create Schedule',
  description: 'Create a new schedule in incident.io',
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
      description: 'Name of the schedule',
    },
    timezone: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Timezone for the schedule (e.g., America/New_York)',
    },
    config: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description:
        'Schedule configuration as JSON string with rotations. Example: {"rotations": [{"name": "Primary", "users": [{"id": "user_id"}], "handover_start_at": "2024-01-01T09:00:00Z", "handovers": [{"interval": 1, "interval_type": "weekly"}]}]}',
    },
  },

  request: {
    url: 'https://api.incident.io/v2/schedules',
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
    body: (params) => ({
      schedule: {
        name: params.name,
        timezone: params.timezone,
        config: typeof params.config === 'string' ? JSON.parse(params.config) : params.config,
      },
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        schedule: data.schedule || data,
      },
    }
  },

  outputs: {
    schedule: {
      type: 'object',
      description: 'The created schedule',
      properties: {
        id: { type: 'string', description: 'The schedule ID' },
        name: { type: 'string', description: 'The schedule name' },
        timezone: { type: 'string', description: 'The schedule timezone' },
        created_at: { type: 'string', description: 'When the schedule was created' },
        updated_at: { type: 'string', description: 'When the schedule was last updated' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: schedules_delete.ts]---
Location: sim-main/apps/sim/tools/incidentio/schedules_delete.ts

```typescript
import type {
  IncidentioSchedulesDeleteParams,
  IncidentioSchedulesDeleteResponse,
} from '@/tools/incidentio/types'
import type { ToolConfig } from '@/tools/types'

export const schedulesDeleteTool: ToolConfig<
  IncidentioSchedulesDeleteParams,
  IncidentioSchedulesDeleteResponse
> = {
  id: 'incidentio_schedules_delete',
  name: 'Delete Schedule',
  description: 'Delete a schedule in incident.io',
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
      description: 'The ID of the schedule to delete',
    },
  },

  request: {
    url: (params) => `https://api.incident.io/v2/schedules/${params.id}`,
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
        message: 'Schedule deleted successfully',
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

---[FILE: schedules_list.ts]---
Location: sim-main/apps/sim/tools/incidentio/schedules_list.ts

```typescript
import type {
  IncidentioSchedulesListParams,
  IncidentioSchedulesListResponse,
} from '@/tools/incidentio/types'
import type { ToolConfig } from '@/tools/types'

export const schedulesListTool: ToolConfig<
  IncidentioSchedulesListParams,
  IncidentioSchedulesListResponse
> = {
  id: 'incidentio_schedules_list',
  name: 'List Schedules',
  description: 'List all schedules in incident.io',
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
      description: 'Number of results per page (default: 25)',
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
      const url = new URL('https://api.incident.io/v2/schedules')
      if (params.page_size) {
        url.searchParams.append('page_size', params.page_size.toString())
      }
      if (params.after) {
        url.searchParams.append('after', params.after)
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
        schedules: data.schedules || [],
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
    schedules: {
      type: 'array',
      description: 'List of schedules',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'The schedule ID' },
          name: { type: 'string', description: 'The schedule name' },
          timezone: { type: 'string', description: 'The schedule timezone' },
          created_at: { type: 'string', description: 'When the schedule was created' },
          updated_at: { type: 'string', description: 'When the schedule was last updated' },
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

---[FILE: schedules_show.ts]---
Location: sim-main/apps/sim/tools/incidentio/schedules_show.ts

```typescript
import type {
  IncidentioSchedulesShowParams,
  IncidentioSchedulesShowResponse,
} from '@/tools/incidentio/types'
import type { ToolConfig } from '@/tools/types'

export const schedulesShowTool: ToolConfig<
  IncidentioSchedulesShowParams,
  IncidentioSchedulesShowResponse
> = {
  id: 'incidentio_schedules_show',
  name: 'Show Schedule',
  description: 'Get details of a specific schedule in incident.io',
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
      description: 'The ID of the schedule',
    },
  },

  request: {
    url: (params) => `https://api.incident.io/v2/schedules/${params.id}`,
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
        schedule: data.schedule || data,
      },
    }
  },

  outputs: {
    schedule: {
      type: 'object',
      description: 'The schedule details',
      properties: {
        id: { type: 'string', description: 'The schedule ID' },
        name: { type: 'string', description: 'The schedule name' },
        timezone: { type: 'string', description: 'The schedule timezone' },
        created_at: { type: 'string', description: 'When the schedule was created' },
        updated_at: { type: 'string', description: 'When the schedule was last updated' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: schedules_update.ts]---
Location: sim-main/apps/sim/tools/incidentio/schedules_update.ts

```typescript
import type {
  IncidentioSchedulesUpdateParams,
  IncidentioSchedulesUpdateResponse,
} from '@/tools/incidentio/types'
import type { ToolConfig } from '@/tools/types'

export const schedulesUpdateTool: ToolConfig<
  IncidentioSchedulesUpdateParams,
  IncidentioSchedulesUpdateResponse
> = {
  id: 'incidentio_schedules_update',
  name: 'Update Schedule',
  description: 'Update an existing schedule in incident.io',
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
      description: 'The ID of the schedule to update',
    },
    name: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New name for the schedule',
    },
    timezone: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New timezone for the schedule (e.g., America/New_York)',
    },
    config: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Schedule configuration as JSON string with rotations. Example: {"rotations": [{"name": "Primary", "users": [{"id": "user_id"}], "handover_start_at": "2024-01-01T09:00:00Z", "handovers": [{"interval": 1, "interval_type": "weekly"}]}]}',
    },
  },

  request: {
    url: (params) => `https://api.incident.io/v2/schedules/${params.id}`,
    method: 'PUT',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
    body: (params) => {
      const schedule: Record<string, any> = {}
      if (params.name) schedule.name = params.name
      if (params.timezone) schedule.timezone = params.timezone
      if (params.config) {
        schedule.config =
          typeof params.config === 'string' ? JSON.parse(params.config) : params.config
      }
      return { schedule }
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        schedule: data.schedule || data,
      },
    }
  },

  outputs: {
    schedule: {
      type: 'object',
      description: 'The updated schedule',
      properties: {
        id: { type: 'string', description: 'The schedule ID' },
        name: { type: 'string', description: 'The schedule name' },
        timezone: { type: 'string', description: 'The schedule timezone' },
        created_at: { type: 'string', description: 'When the schedule was created' },
        updated_at: { type: 'string', description: 'When the schedule was last updated' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: schedule_entries_list.ts]---
Location: sim-main/apps/sim/tools/incidentio/schedule_entries_list.ts

```typescript
import type {
  IncidentioScheduleEntriesListParams,
  IncidentioScheduleEntriesListResponse,
} from '@/tools/incidentio/types'
import type { ToolConfig } from '@/tools/types'

export const scheduleEntriesListTool: ToolConfig<
  IncidentioScheduleEntriesListParams,
  IncidentioScheduleEntriesListResponse
> = {
  id: 'incidentio_schedule_entries_list',
  name: 'List Schedule Entries',
  description: 'List all entries for a specific schedule in incident.io',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'incident.io API Key',
    },
    schedule_id: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The ID of the schedule to get entries for',
    },
    entry_window_start: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Start date/time to filter entries (ISO 8601 format)',
    },
    entry_window_end: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'End date/time to filter entries (ISO 8601 format)',
    },
    page_size: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Number of results to return per page',
    },
    after: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Cursor for pagination',
    },
  },

  request: {
    url: (params) => {
      const queryParams: string[] = []

      queryParams.push(`schedule_id=${params.schedule_id}`)

      if (params.entry_window_start) {
        queryParams.push(`entry_window_start=${encodeURIComponent(params.entry_window_start)}`)
      }

      if (params.entry_window_end) {
        queryParams.push(`entry_window_end=${encodeURIComponent(params.entry_window_end)}`)
      }

      if (params.page_size) {
        queryParams.push(`page_size=${params.page_size}`)
      }

      if (params.after) {
        queryParams.push(`after=${params.after}`)
      }

      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : ''
      return `https://api.incident.io/v2/schedule_entries${queryString}`
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
        schedule_entries: data.schedule_entries || data,
        pagination_meta: data.pagination_meta,
      },
    }
  },

  outputs: {
    schedule_entries: {
      type: 'array',
      description: 'List of schedule entries',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'The entry ID' },
          schedule_id: { type: 'string', description: 'The schedule ID' },
          user: {
            type: 'object',
            description: 'User assigned to this entry',
            properties: {
              id: { type: 'string', description: 'User ID' },
              name: { type: 'string', description: 'User name' },
              email: { type: 'string', description: 'User email' },
            },
          },
          start_at: { type: 'string', description: 'When the entry starts' },
          end_at: { type: 'string', description: 'When the entry ends' },
          layer_id: { type: 'string', description: 'The schedule layer ID' },
          created_at: { type: 'string', description: 'When the entry was created' },
          updated_at: { type: 'string', description: 'When the entry was last updated' },
        },
      },
    },
    pagination_meta: {
      type: 'object',
      description: 'Pagination information',
      optional: true,
      properties: {
        after: { type: 'string', description: 'Cursor for next page', optional: true },
        after_url: { type: 'string', description: 'URL for next page', optional: true },
        page_size: { type: 'number', description: 'Number of results per page' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: schedule_overrides_create.ts]---
Location: sim-main/apps/sim/tools/incidentio/schedule_overrides_create.ts

```typescript
import type {
  IncidentioScheduleOverridesCreateParams,
  IncidentioScheduleOverridesCreateResponse,
} from '@/tools/incidentio/types'
import type { ToolConfig } from '@/tools/types'

export const scheduleOverridesCreateTool: ToolConfig<
  IncidentioScheduleOverridesCreateParams,
  IncidentioScheduleOverridesCreateResponse
> = {
  id: 'incidentio_schedule_overrides_create',
  name: 'Create Schedule Override',
  description: 'Create a new schedule override in incident.io',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'incident.io API Key',
    },
    rotation_id: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The ID of the rotation to override',
    },
    schedule_id: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The ID of the schedule',
    },
    user_id: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'The ID of the user to assign (provide one of: user_id, user_email, or user_slack_id)',
    },
    user_email: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'The email of the user to assign (provide one of: user_id, user_email, or user_slack_id)',
    },
    user_slack_id: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'The Slack ID of the user to assign (provide one of: user_id, user_email, or user_slack_id)',
    },
    start_at: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'When the override starts (ISO 8601 format)',
    },
    end_at: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'When the override ends (ISO 8601 format)',
    },
  },

  request: {
    url: 'https://api.incident.io/v2/schedule_overrides',
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
    body: (params) => {
      const user: { id?: string; email?: string; slack_user_id?: string } = {}
      if (params.user_id) user.id = params.user_id
      if (params.user_email) user.email = params.user_email
      if (params.user_slack_id) user.slack_user_id = params.user_slack_id

      return {
        rotation_id: params.rotation_id,
        schedule_id: params.schedule_id,
        user,
        start_at: params.start_at,
        end_at: params.end_at,
      }
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        override: data.override || data,
      },
    }
  },

  outputs: {
    override: {
      type: 'object',
      description: 'The created schedule override',
      properties: {
        id: { type: 'string', description: 'The override ID' },
        rotation_id: { type: 'string', description: 'The rotation ID' },
        schedule_id: { type: 'string', description: 'The schedule ID' },
        user: {
          type: 'object',
          description: 'User assigned to this override',
          properties: {
            id: { type: 'string', description: 'User ID' },
            name: { type: 'string', description: 'User name' },
            email: { type: 'string', description: 'User email' },
          },
        },
        start_at: { type: 'string', description: 'When the override starts' },
        end_at: { type: 'string', description: 'When the override ends' },
        created_at: { type: 'string', description: 'When the override was created' },
        updated_at: { type: 'string', description: 'When the override was last updated' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: severities_list.ts]---
Location: sim-main/apps/sim/tools/incidentio/severities_list.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { IncidentioSeveritiesListParams, IncidentioSeveritiesListResponse } from './types'

export const severitiesListTool: ToolConfig<
  IncidentioSeveritiesListParams,
  IncidentioSeveritiesListResponse
> = {
  id: 'incidentio_severities_list',
  name: 'Incident.io Severities List',
  description:
    'List all severity levels configured in your Incident.io workspace. Returns severity details including id, name, description, and rank.',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Incident.io API Key',
    },
  },

  request: {
    url: 'https://api.incident.io/v1/severities',
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
        severities: data.severities.map((severity: any) => ({
          id: severity.id,
          name: severity.name,
          description: severity.description,
          rank: severity.rank,
        })),
      },
    }
  },

  outputs: {
    severities: {
      type: 'array',
      description: 'List of severity levels',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Unique identifier for the severity level' },
          name: { type: 'string', description: 'Name of the severity level' },
          description: { type: 'string', description: 'Description of the severity level' },
          rank: { type: 'number', description: 'Rank/order of the severity level' },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

````
