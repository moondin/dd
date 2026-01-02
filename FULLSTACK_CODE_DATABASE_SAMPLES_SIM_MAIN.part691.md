---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 691
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 691 of 933)

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

---[FILE: escalation_paths_create.ts]---
Location: sim-main/apps/sim/tools/incidentio/escalation_paths_create.ts

```typescript
import type {
  IncidentioEscalationPathsCreateParams,
  IncidentioEscalationPathsCreateResponse,
} from '@/tools/incidentio/types'
import type { ToolConfig } from '@/tools/types'

export const escalationPathsCreateTool: ToolConfig<
  IncidentioEscalationPathsCreateParams,
  IncidentioEscalationPathsCreateResponse
> = {
  id: 'incidentio_escalation_paths_create',
  name: 'Create Escalation Path',
  description: 'Create a new escalation path in incident.io',
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
      description: 'Name of the escalation path',
    },
    path: {
      type: 'json',
      required: true,
      visibility: 'user-or-llm',
      description:
        'Array of escalation levels with targets and time to acknowledge in seconds. Each level should have: targets (array of {id, type, schedule_id?, user_id?, urgency}) and time_to_ack_seconds (number)',
    },
    working_hours: {
      type: 'json',
      required: false,
      visibility: 'user-or-llm',
      description: 'Optional working hours configuration. Array of {weekday, start_time, end_time}',
    },
  },

  request: {
    url: 'https://api.incident.io/v2/escalation_paths',
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
    body: (params) => {
      const body: Record<string, any> = {
        name: params.name,
        path: params.path,
      }

      if (params.working_hours) {
        body.working_hours = params.working_hours
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        escalation_path: data.escalation_path || data,
      },
    }
  },

  outputs: {
    escalation_path: {
      type: 'object',
      description: 'The created escalation path',
      properties: {
        id: { type: 'string', description: 'The escalation path ID' },
        name: { type: 'string', description: 'The escalation path name' },
        path: {
          type: 'array',
          description: 'Array of escalation levels',
          items: {
            type: 'object',
            properties: {
              targets: {
                type: 'array',
                description: 'Targets for this level',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', description: 'Target ID' },
                    type: { type: 'string', description: 'Target type' },
                    schedule_id: {
                      type: 'string',
                      description: 'Schedule ID if type is schedule',
                      optional: true,
                    },
                    user_id: {
                      type: 'string',
                      description: 'User ID if type is user',
                      optional: true,
                    },
                    urgency: { type: 'string', description: 'Urgency level' },
                  },
                },
              },
              time_to_ack_seconds: {
                type: 'number',
                description: 'Time to acknowledge in seconds',
              },
            },
          },
        },
        working_hours: {
          type: 'array',
          description: 'Working hours configuration',
          optional: true,
          items: {
            type: 'object',
            properties: {
              weekday: { type: 'string', description: 'Day of week' },
              start_time: { type: 'string', description: 'Start time' },
              end_time: { type: 'string', description: 'End time' },
            },
          },
        },
        created_at: { type: 'string', description: 'When the path was created' },
        updated_at: { type: 'string', description: 'When the path was last updated' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: escalation_paths_delete.ts]---
Location: sim-main/apps/sim/tools/incidentio/escalation_paths_delete.ts

```typescript
import type {
  IncidentioEscalationPathsDeleteParams,
  IncidentioEscalationPathsDeleteResponse,
} from '@/tools/incidentio/types'
import type { ToolConfig } from '@/tools/types'

export const escalationPathsDeleteTool: ToolConfig<
  IncidentioEscalationPathsDeleteParams,
  IncidentioEscalationPathsDeleteResponse
> = {
  id: 'incidentio_escalation_paths_delete',
  name: 'Delete Escalation Path',
  description: 'Delete an escalation path in incident.io',
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
      description: 'The ID of the escalation path to delete',
    },
  },

  request: {
    url: (params) => `https://api.incident.io/v2/escalation_paths/${params.id}`,
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
        message: 'Escalation path deleted successfully',
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

---[FILE: escalation_paths_show.ts]---
Location: sim-main/apps/sim/tools/incidentio/escalation_paths_show.ts

```typescript
import type {
  IncidentioEscalationPathsShowParams,
  IncidentioEscalationPathsShowResponse,
} from '@/tools/incidentio/types'
import type { ToolConfig } from '@/tools/types'

export const escalationPathsShowTool: ToolConfig<
  IncidentioEscalationPathsShowParams,
  IncidentioEscalationPathsShowResponse
> = {
  id: 'incidentio_escalation_paths_show',
  name: 'Show Escalation Path',
  description: 'Get details of a specific escalation path in incident.io',
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
      description: 'The ID of the escalation path',
    },
  },

  request: {
    url: (params) => `https://api.incident.io/v2/escalation_paths/${params.id}`,
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
        escalation_path: data.escalation_path || data,
      },
    }
  },

  outputs: {
    escalation_path: {
      type: 'object',
      description: 'The escalation path details',
      properties: {
        id: { type: 'string', description: 'The escalation path ID' },
        name: { type: 'string', description: 'The escalation path name' },
        path: {
          type: 'array',
          description: 'Array of escalation levels',
          items: {
            type: 'object',
            properties: {
              targets: {
                type: 'array',
                description: 'Targets for this level',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', description: 'Target ID' },
                    type: { type: 'string', description: 'Target type' },
                    schedule_id: {
                      type: 'string',
                      description: 'Schedule ID if type is schedule',
                      optional: true,
                    },
                    user_id: {
                      type: 'string',
                      description: 'User ID if type is user',
                      optional: true,
                    },
                    urgency: { type: 'string', description: 'Urgency level' },
                  },
                },
              },
              time_to_ack_seconds: {
                type: 'number',
                description: 'Time to acknowledge in seconds',
              },
            },
          },
        },
        working_hours: {
          type: 'array',
          description: 'Working hours configuration',
          optional: true,
          items: {
            type: 'object',
            properties: {
              weekday: { type: 'string', description: 'Day of week' },
              start_time: { type: 'string', description: 'Start time' },
              end_time: { type: 'string', description: 'End time' },
            },
          },
        },
        created_at: { type: 'string', description: 'When the path was created' },
        updated_at: { type: 'string', description: 'When the path was last updated' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: escalation_paths_update.ts]---
Location: sim-main/apps/sim/tools/incidentio/escalation_paths_update.ts

```typescript
import type {
  IncidentioEscalationPathsUpdateParams,
  IncidentioEscalationPathsUpdateResponse,
} from '@/tools/incidentio/types'
import type { ToolConfig } from '@/tools/types'

export const escalationPathsUpdateTool: ToolConfig<
  IncidentioEscalationPathsUpdateParams,
  IncidentioEscalationPathsUpdateResponse
> = {
  id: 'incidentio_escalation_paths_update',
  name: 'Update Escalation Path',
  description: 'Update an existing escalation path in incident.io',
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
      description: 'The ID of the escalation path to update',
    },
    name: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New name for the escalation path',
    },
    path: {
      type: 'json',
      required: false,
      visibility: 'user-or-llm',
      description:
        'New escalation path configuration. Array of escalation levels with targets and time_to_ack_seconds',
    },
    working_hours: {
      type: 'json',
      required: false,
      visibility: 'user-or-llm',
      description: 'New working hours configuration. Array of {weekday, start_time, end_time}',
    },
  },

  request: {
    url: (params) => `https://api.incident.io/v2/escalation_paths/${params.id}`,
    method: 'PUT',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
    body: (params) => {
      const body: Record<string, any> = {}

      if (params.name !== undefined) {
        body.name = params.name
      }

      if (params.path !== undefined) {
        body.path = params.path
      }

      if (params.working_hours !== undefined) {
        body.working_hours = params.working_hours
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        escalation_path: data.escalation_path || data,
      },
    }
  },

  outputs: {
    escalation_path: {
      type: 'object',
      description: 'The updated escalation path',
      properties: {
        id: { type: 'string', description: 'The escalation path ID' },
        name: { type: 'string', description: 'The escalation path name' },
        path: {
          type: 'array',
          description: 'Array of escalation levels',
          items: {
            type: 'object',
            properties: {
              targets: {
                type: 'array',
                description: 'Targets for this level',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', description: 'Target ID' },
                    type: { type: 'string', description: 'Target type' },
                    schedule_id: {
                      type: 'string',
                      description: 'Schedule ID if type is schedule',
                      optional: true,
                    },
                    user_id: {
                      type: 'string',
                      description: 'User ID if type is user',
                      optional: true,
                    },
                    urgency: { type: 'string', description: 'Urgency level' },
                  },
                },
              },
              time_to_ack_seconds: {
                type: 'number',
                description: 'Time to acknowledge in seconds',
              },
            },
          },
        },
        working_hours: {
          type: 'array',
          description: 'Working hours configuration',
          optional: true,
          items: {
            type: 'object',
            properties: {
              weekday: { type: 'string', description: 'Day of week' },
              start_time: { type: 'string', description: 'Start time' },
              end_time: { type: 'string', description: 'End time' },
            },
          },
        },
        created_at: { type: 'string', description: 'When the path was created' },
        updated_at: { type: 'string', description: 'When the path was last updated' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: follow_ups_list.ts]---
Location: sim-main/apps/sim/tools/incidentio/follow_ups_list.ts

```typescript
import type {
  IncidentioFollowUpsListParams,
  IncidentioFollowUpsListResponse,
} from '@/tools/incidentio/types'
import type { ToolConfig } from '@/tools/types'

export const followUpsListTool: ToolConfig<
  IncidentioFollowUpsListParams,
  IncidentioFollowUpsListResponse
> = {
  id: 'incidentio_follow_ups_list',
  name: 'incident.io Follow-ups List',
  description: 'List follow-ups from incident.io. Optionally filter by incident ID.',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'incident.io API Key',
    },
    incident_id: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter follow-ups by incident ID',
    },
    page_size: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of follow-ups to return per page',
    },
  },

  request: {
    url: (params) => {
      const url = new URL('https://api.incident.io/v2/follow_ups')

      if (params.incident_id) {
        url.searchParams.append('incident_id', params.incident_id)
      }

      if (params.page_size) {
        url.searchParams.append('page_size', params.page_size.toString())
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
        follow_ups:
          data.follow_ups?.map((followUp: any) => ({
            id: followUp.id,
            title: followUp.title || '',
            description: followUp.description,
            assignee: followUp.assignee
              ? {
                  id: followUp.assignee.id,
                  name: followUp.assignee.name,
                  email: followUp.assignee.email,
                }
              : undefined,
            status: followUp.status,
            priority: followUp.priority
              ? {
                  id: followUp.priority.id,
                  name: followUp.priority.name,
                  description: followUp.priority.description,
                  rank: followUp.priority.rank,
                }
              : undefined,
            created_at: followUp.created_at,
            updated_at: followUp.updated_at,
            incident_id: followUp.incident_id,
            creator: followUp.creator
              ? {
                  id: followUp.creator.id,
                  name: followUp.creator.name,
                  email: followUp.creator.email,
                }
              : undefined,
            completed_at: followUp.completed_at,
            labels: followUp.labels || [],
            external_issue_reference: followUp.external_issue_reference
              ? {
                  provider: followUp.external_issue_reference.provider,
                  issue_name: followUp.external_issue_reference.issue_name,
                  issue_permalink: followUp.external_issue_reference.issue_permalink,
                }
              : undefined,
          })) || [],
      },
    }
  },

  outputs: {
    follow_ups: {
      type: 'array',
      description: 'List of follow-ups',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Follow-up ID' },
          title: { type: 'string', description: 'Follow-up title' },
          description: { type: 'string', description: 'Follow-up description' },
          assignee: {
            type: 'object',
            description: 'Assigned user',
            properties: {
              id: { type: 'string', description: 'User ID' },
              name: { type: 'string', description: 'User name' },
              email: { type: 'string', description: 'User email' },
            },
          },
          status: { type: 'string', description: 'Follow-up status' },
          priority: {
            type: 'object',
            description: 'Follow-up priority',
            optional: true,
            properties: {
              id: { type: 'string', description: 'Priority ID' },
              name: { type: 'string', description: 'Priority name' },
              description: { type: 'string', description: 'Priority description' },
              rank: { type: 'number', description: 'Priority rank' },
            },
          },
          created_at: { type: 'string', description: 'Creation timestamp' },
          updated_at: { type: 'string', description: 'Last update timestamp' },
          incident_id: { type: 'string', description: 'Associated incident ID' },
          creator: {
            type: 'object',
            description: 'User who created the follow-up',
            properties: {
              id: { type: 'string', description: 'User ID' },
              name: { type: 'string', description: 'User name' },
              email: { type: 'string', description: 'User email' },
            },
          },
          completed_at: { type: 'string', description: 'Completion timestamp' },
          labels: {
            type: 'array',
            description: 'Labels associated with the follow-up',
            items: { type: 'string' },
          },
          external_issue_reference: {
            type: 'object',
            description: 'External issue tracking reference',
            properties: {
              provider: { type: 'string', description: 'External provider name' },
              issue_name: { type: 'string', description: 'External issue name or ID' },
              issue_permalink: { type: 'string', description: 'Permalink to external issue' },
            },
          },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: follow_ups_show.ts]---
Location: sim-main/apps/sim/tools/incidentio/follow_ups_show.ts

```typescript
import type {
  IncidentioFollowUpsShowParams,
  IncidentioFollowUpsShowResponse,
} from '@/tools/incidentio/types'
import type { ToolConfig } from '@/tools/types'

export const followUpsShowTool: ToolConfig<
  IncidentioFollowUpsShowParams,
  IncidentioFollowUpsShowResponse
> = {
  id: 'incidentio_follow_ups_show',
  name: 'incident.io Follow-ups Show',
  description: 'Get detailed information about a specific follow-up from incident.io.',
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
      description: 'Follow-up ID',
    },
  },

  request: {
    url: (params) => `https://api.incident.io/v2/follow_ups/${params.id}`,
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
        follow_up: {
          id: data.follow_up.id,
          title: data.follow_up.title || '',
          description: data.follow_up.description,
          assignee: data.follow_up.assignee
            ? {
                id: data.follow_up.assignee.id,
                name: data.follow_up.assignee.name,
                email: data.follow_up.assignee.email,
              }
            : undefined,
          status: data.follow_up.status,
          priority: data.follow_up.priority
            ? {
                id: data.follow_up.priority.id,
                name: data.follow_up.priority.name,
                description: data.follow_up.priority.description,
                rank: data.follow_up.priority.rank,
              }
            : undefined,
          created_at: data.follow_up.created_at,
          updated_at: data.follow_up.updated_at,
          incident_id: data.follow_up.incident_id,
          creator: data.follow_up.creator
            ? {
                id: data.follow_up.creator.id,
                name: data.follow_up.creator.name,
                email: data.follow_up.creator.email,
              }
            : undefined,
          completed_at: data.follow_up.completed_at,
          labels: data.follow_up.labels || [],
          external_issue_reference: data.follow_up.external_issue_reference
            ? {
                provider: data.follow_up.external_issue_reference.provider,
                issue_name: data.follow_up.external_issue_reference.issue_name,
                issue_permalink: data.follow_up.external_issue_reference.issue_permalink,
              }
            : undefined,
        },
      },
    }
  },

  outputs: {
    follow_up: {
      type: 'object',
      description: 'Follow-up details',
      properties: {
        id: { type: 'string', description: 'Follow-up ID' },
        title: { type: 'string', description: 'Follow-up title' },
        description: { type: 'string', description: 'Follow-up description' },
        assignee: {
          type: 'object',
          description: 'Assigned user',
          properties: {
            id: { type: 'string', description: 'User ID' },
            name: { type: 'string', description: 'User name' },
            email: { type: 'string', description: 'User email' },
          },
        },
        status: { type: 'string', description: 'Follow-up status' },
        priority: {
          type: 'object',
          description: 'Follow-up priority',
          optional: true,
          properties: {
            id: { type: 'string', description: 'Priority ID' },
            name: { type: 'string', description: 'Priority name' },
            description: { type: 'string', description: 'Priority description' },
            rank: { type: 'number', description: 'Priority rank' },
          },
        },
        created_at: { type: 'string', description: 'Creation timestamp' },
        updated_at: { type: 'string', description: 'Last update timestamp' },
        incident_id: { type: 'string', description: 'Associated incident ID' },
        creator: {
          type: 'object',
          description: 'User who created the follow-up',
          properties: {
            id: { type: 'string', description: 'User ID' },
            name: { type: 'string', description: 'User name' },
            email: { type: 'string', description: 'User email' },
          },
        },
        completed_at: { type: 'string', description: 'Completion timestamp' },
        labels: {
          type: 'array',
          description: 'Labels associated with the follow-up',
          items: { type: 'string' },
        },
        external_issue_reference: {
          type: 'object',
          description: 'External issue tracking reference',
          properties: {
            provider: { type: 'string', description: 'External provider name' },
            issue_name: { type: 'string', description: 'External issue name or ID' },
            issue_permalink: { type: 'string', description: 'Permalink to external issue' },
          },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: incidents_create.ts]---
Location: sim-main/apps/sim/tools/incidentio/incidents_create.ts

```typescript
import type {
  IncidentioIncidentsCreateParams,
  IncidentioIncidentsCreateResponse,
} from '@/tools/incidentio/types'
import type { ToolConfig } from '@/tools/types'

export const incidentsCreateTool: ToolConfig<
  IncidentioIncidentsCreateParams,
  IncidentioIncidentsCreateResponse
> = {
  id: 'incidentio_incidents_create',
  name: 'incident.io Incidents Create',
  description:
    'Create a new incident in incident.io. Requires idempotency_key, severity_id, and visibility. Optionally accepts name, summary, type, and status.',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'incident.io API Key',
    },
    idempotency_key: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description:
        'Unique identifier to prevent duplicate incident creation. Use a UUID or unique string.',
    },
    name: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Name of the incident (optional)',
    },
    summary: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Brief summary of the incident',
    },
    severity_id: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'ID of the severity level (required)',
    },
    incident_type_id: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'ID of the incident type',
    },
    incident_status_id: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'ID of the initial incident status',
    },
    visibility: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Visibility of the incident: "public" or "private" (required)',
    },
  },

  request: {
    url: 'https://api.incident.io/v2/incidents',
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
    body: (params) => {
      const body: Record<string, any> = {
        idempotency_key: params.idempotency_key,
        severity_id: params.severity_id,
        visibility: params.visibility,
      }

      if (params.name) body.name = params.name
      if (params.summary) body.summary = params.summary
      if (params.incident_type_id) body.incident_type_id = params.incident_type_id
      if (params.incident_status_id) body.incident_status_id = params.incident_status_id

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()
    const incident = data.incident || data

    return {
      success: true,
      output: {
        incident: {
          id: incident.id,
          name: incident.name,
          summary: incident.summary,
          description: incident.description,
          mode: incident.mode,
          call_url: incident.call_url,
          severity: incident.severity
            ? {
                id: incident.severity.id,
                name: incident.severity.name,
                rank: incident.severity.rank,
              }
            : undefined,
          status: incident.incident_status
            ? {
                id: incident.incident_status.id,
                name: incident.incident_status.name,
                category: incident.incident_status.category,
              }
            : undefined,
          incident_type: incident.incident_type
            ? {
                id: incident.incident_type.id,
                name: incident.incident_type.name,
              }
            : undefined,
          created_at: incident.created_at,
          updated_at: incident.updated_at,
          incident_url: incident.incident_url,
          slack_channel_id: incident.slack_channel_id,
          slack_channel_name: incident.slack_channel_name,
          visibility: incident.visibility,
        },
      },
    }
  },

  outputs: {
    incident: {
      type: 'object',
      description: 'The created incident object',
      properties: {
        id: { type: 'string', description: 'Incident ID' },
        name: { type: 'string', description: 'Incident name' },
        summary: { type: 'string', description: 'Brief summary of the incident' },
        description: { type: 'string', description: 'Detailed description of the incident' },
        mode: { type: 'string', description: 'Incident mode (e.g., standard, retrospective)' },
        call_url: { type: 'string', description: 'URL for the incident call/bridge' },
        severity: {
          type: 'object',
          description: 'Severity of the incident',
          properties: {
            id: { type: 'string', description: 'Severity ID' },
            name: { type: 'string', description: 'Severity name' },
            rank: { type: 'number', description: 'Severity rank' },
          },
        },
        status: {
          type: 'object',
          description: 'Current status of the incident',
          properties: {
            id: { type: 'string', description: 'Status ID' },
            name: { type: 'string', description: 'Status name' },
            category: { type: 'string', description: 'Status category' },
          },
        },
        incident_type: {
          type: 'object',
          description: 'Type of the incident',
          properties: {
            id: { type: 'string', description: 'Type ID' },
            name: { type: 'string', description: 'Type name' },
          },
        },
        created_at: { type: 'string', description: 'Creation timestamp' },
        updated_at: { type: 'string', description: 'Last update timestamp' },
        incident_url: { type: 'string', description: 'URL to the incident' },
        slack_channel_id: { type: 'string', description: 'Associated Slack channel ID' },
        slack_channel_name: { type: 'string', description: 'Associated Slack channel name' },
        visibility: { type: 'string', description: 'Incident visibility' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: incidents_list.ts]---
Location: sim-main/apps/sim/tools/incidentio/incidents_list.ts

```typescript
import type {
  IncidentioIncidentsListParams,
  IncidentioIncidentsListResponse,
} from '@/tools/incidentio/types'
import type { ToolConfig } from '@/tools/types'

export const incidentsListTool: ToolConfig<
  IncidentioIncidentsListParams,
  IncidentioIncidentsListResponse
> = {
  id: 'incidentio_incidents_list',
  name: 'incident.io Incidents List',
  description:
    'List incidents from incident.io. Returns a list of incidents with their details including severity, status, and timestamps.',
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
      description: 'Number of incidents to return per page (default: 25)',
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
      const url = new URL('https://api.incident.io/v2/incidents')

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
        incidents:
          data.incidents?.map((incident: any) => ({
            id: incident.id,
            name: incident.name,
            summary: incident.summary,
            description: incident.description,
            mode: incident.mode,
            call_url: incident.call_url,
            severity: incident.severity
              ? {
                  id: incident.severity.id,
                  name: incident.severity.name,
                  rank: incident.severity.rank,
                }
              : undefined,
            status: incident.incident_status
              ? {
                  id: incident.incident_status.id,
                  name: incident.incident_status.name,
                  category: incident.incident_status.category,
                }
              : undefined,
            incident_type: incident.incident_type
              ? {
                  id: incident.incident_type.id,
                  name: incident.incident_type.name,
                }
              : undefined,
            created_at: incident.created_at,
            updated_at: incident.updated_at,
            incident_url: incident.incident_url,
            slack_channel_id: incident.slack_channel_id,
            slack_channel_name: incident.slack_channel_name,
            visibility: incident.visibility,
          })) || [],
        pagination_meta: data.pagination_meta
          ? {
              after: data.pagination_meta.after,
              page_size: data.pagination_meta.page_size,
              total_record_count: data.pagination_meta.total_record_count,
            }
          : undefined,
      },
    }
  },

  outputs: {
    incidents: {
      type: 'array',
      description: 'List of incidents',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Incident ID' },
          name: { type: 'string', description: 'Incident name' },
          summary: { type: 'string', description: 'Brief summary of the incident' },
          description: { type: 'string', description: 'Detailed description of the incident' },
          mode: { type: 'string', description: 'Incident mode (e.g., standard, retrospective)' },
          call_url: { type: 'string', description: 'URL for the incident call/bridge' },
          severity: {
            type: 'object',
            description: 'Severity of the incident',
            properties: {
              id: { type: 'string', description: 'Severity ID' },
              name: { type: 'string', description: 'Severity name' },
              rank: { type: 'number', description: 'Severity rank' },
            },
          },
          status: {
            type: 'object',
            description: 'Current status of the incident',
            properties: {
              id: { type: 'string', description: 'Status ID' },
              name: { type: 'string', description: 'Status name' },
              category: { type: 'string', description: 'Status category' },
            },
          },
          incident_type: {
            type: 'object',
            description: 'Type of the incident',
            properties: {
              id: { type: 'string', description: 'Type ID' },
              name: { type: 'string', description: 'Type name' },
            },
          },
          created_at: { type: 'string', description: 'Creation timestamp' },
          updated_at: { type: 'string', description: 'Last update timestamp' },
          incident_url: { type: 'string', description: 'URL to the incident' },
          slack_channel_id: { type: 'string', description: 'Associated Slack channel ID' },
          slack_channel_name: { type: 'string', description: 'Associated Slack channel name' },
          visibility: { type: 'string', description: 'Incident visibility' },
        },
      },
    },
    pagination_meta: {
      type: 'object',
      description: 'Pagination metadata',
      optional: true,
      properties: {
        after: { type: 'string', description: 'Cursor for the next page', optional: true },
        page_size: { type: 'number', description: 'Number of items per page' },
        total_record_count: {
          type: 'number',
          description: 'Total number of records available',
          optional: true,
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

````
