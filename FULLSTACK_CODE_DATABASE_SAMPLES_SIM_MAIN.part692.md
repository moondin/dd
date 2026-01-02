---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 692
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 692 of 933)

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

---[FILE: incidents_show.ts]---
Location: sim-main/apps/sim/tools/incidentio/incidents_show.ts

```typescript
import type {
  IncidentioIncidentsShowParams,
  IncidentioIncidentsShowResponse,
} from '@/tools/incidentio/types'
import type { ToolConfig } from '@/tools/types'

export const incidentsShowTool: ToolConfig<
  IncidentioIncidentsShowParams,
  IncidentioIncidentsShowResponse
> = {
  id: 'incidentio_incidents_show',
  name: 'incident.io Incidents Show',
  description:
    'Retrieve detailed information about a specific incident from incident.io by its ID. Returns full incident details including custom fields and role assignments.',
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
      description: 'ID of the incident to retrieve',
    },
  },

  request: {
    url: (params) => `https://api.incident.io/v2/incidents/${params.id}`,
    method: 'GET',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
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
          permalink: incident.permalink,
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
          custom_field_entries: incident.custom_field_entries?.map((entry: any) => ({
            custom_field: {
              id: entry.custom_field.id,
              name: entry.custom_field.name,
              field_type: entry.custom_field.field_type,
            },
            values: entry.values?.map((value: any) => ({
              value_text: value.value_text,
              value_link: value.value_link,
              value_numeric: value.value_numeric,
            })),
          })),
          incident_role_assignments: incident.incident_role_assignments?.map((assignment: any) => ({
            role: {
              id: assignment.role.id,
              name: assignment.role.name,
              role_type: assignment.role.role_type,
            },
            assignee: assignment.assignee
              ? {
                  id: assignment.assignee.id,
                  name: assignment.assignee.name,
                  email: assignment.assignee.email,
                }
              : undefined,
          })),
        },
      },
    }
  },

  outputs: {
    incident: {
      type: 'object',
      description: 'Detailed incident information',
      properties: {
        id: { type: 'string', description: 'Incident ID' },
        name: { type: 'string', description: 'Incident name' },
        summary: { type: 'string', description: 'Brief summary of the incident' },
        description: { type: 'string', description: 'Detailed description of the incident' },
        mode: { type: 'string', description: 'Incident mode (e.g., standard, retrospective)' },
        call_url: { type: 'string', description: 'URL for the incident call/bridge' },
        permalink: { type: 'string', description: 'Permanent link to the incident' },
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
        custom_field_entries: {
          type: 'array',
          description: 'Custom field values for the incident',
        },
        incident_role_assignments: {
          type: 'array',
          description: 'Role assignments for the incident',
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: incidents_update.ts]---
Location: sim-main/apps/sim/tools/incidentio/incidents_update.ts

```typescript
import type {
  IncidentioIncidentsUpdateParams,
  IncidentioIncidentsUpdateResponse,
} from '@/tools/incidentio/types'
import type { ToolConfig } from '@/tools/types'

export const incidentsUpdateTool: ToolConfig<
  IncidentioIncidentsUpdateParams,
  IncidentioIncidentsUpdateResponse
> = {
  id: 'incidentio_incidents_update',
  name: 'incident.io Incidents Update',
  description:
    'Update an existing incident in incident.io. Can update name, summary, severity, status, or type.',
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
      description: 'ID of the incident to update',
    },
    name: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated name of the incident',
    },
    summary: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated summary of the incident',
    },
    severity_id: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated severity ID for the incident',
    },
    incident_status_id: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated status ID for the incident',
    },
    incident_type_id: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated incident type ID',
    },
    notify_incident_channel: {
      type: 'boolean',
      required: true,
      visibility: 'user-or-llm',
      description: 'Whether to notify the incident channel about this update',
    },
  },

  request: {
    url: (params) => `https://api.incident.io/v2/incidents/${params.id}/actions/edit`,
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
    body: (params) => {
      // Create incident object
      const incident: Record<string, any> = {}

      if (params.name) incident.name = params.name
      if (params.summary) incident.summary = params.summary
      if (params.severity_id) incident.severity_id = params.severity_id
      if (params.incident_status_id) incident.incident_status_id = params.incident_status_id
      if (params.incident_type_id) incident.incident_type_id = params.incident_type_id

      // Wrap in incident object with required notify_incident_channel
      return {
        incident,
        notify_incident_channel: params.notify_incident_channel,
      }
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
      description: 'The updated incident object',
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

---[FILE: incident_roles_create.ts]---
Location: sim-main/apps/sim/tools/incidentio/incident_roles_create.ts

```typescript
import type {
  IncidentioIncidentRolesCreateParams,
  IncidentioIncidentRolesCreateResponse,
} from '@/tools/incidentio/types'
import type { ToolConfig } from '@/tools/types'

export const incidentRolesCreateTool: ToolConfig<
  IncidentioIncidentRolesCreateParams,
  IncidentioIncidentRolesCreateResponse
> = {
  id: 'incidentio_incident_roles_create',
  name: 'Create Incident Role',
  description: 'Create a new incident role in incident.io',
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
      description: 'Name of the incident role',
    },
    description: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Description of the incident role',
    },
    instructions: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Instructions for the incident role',
    },
    shortform: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Short form abbreviation for the role',
    },
  },

  request: {
    url: 'https://api.incident.io/v2/incident_roles',
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
    body: (params) => ({
      name: params.name,
      description: params.description,
      instructions: params.instructions,
      shortform: params.shortform,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        incident_role: data.incident_role || data,
      },
    }
  },

  outputs: {
    incident_role: {
      type: 'object',
      description: 'The created incident role',
      properties: {
        id: { type: 'string', description: 'The incident role ID' },
        name: { type: 'string', description: 'The incident role name' },
        description: {
          type: 'string',
          description: 'The incident role description',
          optional: true,
        },
        instructions: {
          type: 'string',
          description: 'Instructions for the role',
        },
        shortform: {
          type: 'string',
          description: 'Short form abbreviation of the role',
        },
        role_type: { type: 'string', description: 'The type of role' },
        required: { type: 'boolean', description: 'Whether the role is required' },
        created_at: { type: 'string', description: 'When the role was created' },
        updated_at: { type: 'string', description: 'When the role was last updated' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: incident_roles_delete.ts]---
Location: sim-main/apps/sim/tools/incidentio/incident_roles_delete.ts

```typescript
import type {
  IncidentioIncidentRolesDeleteParams,
  IncidentioIncidentRolesDeleteResponse,
} from '@/tools/incidentio/types'
import type { ToolConfig } from '@/tools/types'

export const incidentRolesDeleteTool: ToolConfig<
  IncidentioIncidentRolesDeleteParams,
  IncidentioIncidentRolesDeleteResponse
> = {
  id: 'incidentio_incident_roles_delete',
  name: 'Delete Incident Role',
  description: 'Delete an incident role in incident.io',
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
      description: 'The ID of the incident role to delete',
    },
  },

  request: {
    url: (params) => `https://api.incident.io/v2/incident_roles/${params.id}`,
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
        message: 'Incident role deleted successfully',
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

---[FILE: incident_roles_list.ts]---
Location: sim-main/apps/sim/tools/incidentio/incident_roles_list.ts

```typescript
import type {
  IncidentioIncidentRolesListParams,
  IncidentioIncidentRolesListResponse,
} from '@/tools/incidentio/types'
import type { ToolConfig } from '@/tools/types'

export const incidentRolesListTool: ToolConfig<
  IncidentioIncidentRolesListParams,
  IncidentioIncidentRolesListResponse
> = {
  id: 'incidentio_incident_roles_list',
  name: 'List Incident Roles',
  description: 'List all incident roles in incident.io',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'incident.io API Key',
    },
  },

  request: {
    url: 'https://api.incident.io/v2/incident_roles',
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
        incident_roles: data.incident_roles || data,
      },
    }
  },

  outputs: {
    incident_roles: {
      type: 'array',
      description: 'List of incident roles',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'The incident role ID' },
          name: { type: 'string', description: 'The incident role name' },
          description: {
            type: 'string',
            description: 'The incident role description',
            optional: true,
          },
          instructions: {
            type: 'string',
            description: 'Instructions for the role',
          },
          shortform: {
            type: 'string',
            description: 'Short form abbreviation of the role',
          },
          role_type: { type: 'string', description: 'The type of role' },
          required: { type: 'boolean', description: 'Whether the role is required' },
          created_at: { type: 'string', description: 'When the role was created' },
          updated_at: { type: 'string', description: 'When the role was last updated' },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: incident_roles_show.ts]---
Location: sim-main/apps/sim/tools/incidentio/incident_roles_show.ts

```typescript
import type {
  IncidentioIncidentRolesShowParams,
  IncidentioIncidentRolesShowResponse,
} from '@/tools/incidentio/types'
import type { ToolConfig } from '@/tools/types'

export const incidentRolesShowTool: ToolConfig<
  IncidentioIncidentRolesShowParams,
  IncidentioIncidentRolesShowResponse
> = {
  id: 'incidentio_incident_roles_show',
  name: 'Show Incident Role',
  description: 'Get details of a specific incident role in incident.io',
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
      description: 'The ID of the incident role',
    },
  },

  request: {
    url: (params) => `https://api.incident.io/v2/incident_roles/${params.id}`,
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
        incident_role: data.incident_role || data,
      },
    }
  },

  outputs: {
    incident_role: {
      type: 'object',
      description: 'The incident role details',
      properties: {
        id: { type: 'string', description: 'The incident role ID' },
        name: { type: 'string', description: 'The incident role name' },
        description: {
          type: 'string',
          description: 'The incident role description',
          optional: true,
        },
        instructions: {
          type: 'string',
          description: 'Instructions for the role',
        },
        shortform: {
          type: 'string',
          description: 'Short form abbreviation of the role',
        },
        role_type: { type: 'string', description: 'The type of role' },
        required: { type: 'boolean', description: 'Whether the role is required' },
        created_at: { type: 'string', description: 'When the role was created' },
        updated_at: { type: 'string', description: 'When the role was last updated' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: incident_roles_update.ts]---
Location: sim-main/apps/sim/tools/incidentio/incident_roles_update.ts

```typescript
import type {
  IncidentioIncidentRolesUpdateParams,
  IncidentioIncidentRolesUpdateResponse,
} from '@/tools/incidentio/types'
import type { ToolConfig } from '@/tools/types'

export const incidentRolesUpdateTool: ToolConfig<
  IncidentioIncidentRolesUpdateParams,
  IncidentioIncidentRolesUpdateResponse
> = {
  id: 'incidentio_incident_roles_update',
  name: 'Update Incident Role',
  description: 'Update an existing incident role in incident.io',
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
      description: 'The ID of the incident role to update',
    },
    name: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Name of the incident role',
    },
    description: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Description of the incident role',
    },
    instructions: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Instructions for the incident role',
    },
    shortform: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Short form abbreviation for the role',
    },
  },

  request: {
    url: (params) => `https://api.incident.io/v2/incident_roles/${params.id}`,
    method: 'PUT',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
    body: (params) => ({
      name: params.name,
      description: params.description,
      instructions: params.instructions,
      shortform: params.shortform,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        incident_role: data.incident_role || data,
      },
    }
  },

  outputs: {
    incident_role: {
      type: 'object',
      description: 'The updated incident role',
      properties: {
        id: { type: 'string', description: 'The incident role ID' },
        name: { type: 'string', description: 'The incident role name' },
        description: {
          type: 'string',
          description: 'The incident role description',
          optional: true,
        },
        instructions: {
          type: 'string',
          description: 'Instructions for the role',
        },
        shortform: {
          type: 'string',
          description: 'Short form abbreviation of the role',
        },
        role_type: { type: 'string', description: 'The type of role' },
        required: { type: 'boolean', description: 'Whether the role is required' },
        created_at: { type: 'string', description: 'When the role was created' },
        updated_at: { type: 'string', description: 'When the role was last updated' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: incident_statuses_list.ts]---
Location: sim-main/apps/sim/tools/incidentio/incident_statuses_list.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type {
  IncidentioIncidentStatusesListParams,
  IncidentioIncidentStatusesListResponse,
} from './types'

export const incidentStatusesListTool: ToolConfig<
  IncidentioIncidentStatusesListParams,
  IncidentioIncidentStatusesListResponse
> = {
  id: 'incidentio_incident_statuses_list',
  name: 'Incident.io Incident Statuses List',
  description:
    'List all incident statuses configured in your Incident.io workspace. Returns status details including id, name, description, and category.',
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
    url: 'https://api.incident.io/v1/incident_statuses',
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
        incident_statuses: data.incident_statuses.map((status: any) => ({
          id: status.id,
          name: status.name,
          description: status.description,
          category: status.category,
        })),
      },
    }
  },

  outputs: {
    incident_statuses: {
      type: 'array',
      description: 'List of incident statuses',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Unique identifier for the incident status' },
          name: { type: 'string', description: 'Name of the incident status' },
          description: { type: 'string', description: 'Description of the incident status' },
          category: { type: 'string', description: 'Category of the incident status' },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: incident_timestamps_list.ts]---
Location: sim-main/apps/sim/tools/incidentio/incident_timestamps_list.ts

```typescript
import type {
  IncidentioIncidentTimestampsListParams,
  IncidentioIncidentTimestampsListResponse,
} from '@/tools/incidentio/types'
import type { ToolConfig } from '@/tools/types'

export const incidentTimestampsListTool: ToolConfig<
  IncidentioIncidentTimestampsListParams,
  IncidentioIncidentTimestampsListResponse
> = {
  id: 'incidentio_incident_timestamps_list',
  name: 'List Incident Timestamps',
  description: 'List all incident timestamp definitions in incident.io',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'incident.io API Key',
    },
  },

  request: {
    url: 'https://api.incident.io/v2/incident_timestamps',
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
        incident_timestamps: data.incident_timestamps || data,
      },
    }
  },

  outputs: {
    incident_timestamps: {
      type: 'array',
      description: 'List of incident timestamp definitions',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'The timestamp ID' },
          name: { type: 'string', description: 'The timestamp name' },
          rank: { type: 'number', description: 'The rank/order of the timestamp' },
          created_at: { type: 'string', description: 'When the timestamp was created' },
          updated_at: { type: 'string', description: 'When the timestamp was last updated' },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: incident_timestamps_show.ts]---
Location: sim-main/apps/sim/tools/incidentio/incident_timestamps_show.ts

```typescript
import type {
  IncidentioIncidentTimestampsShowParams,
  IncidentioIncidentTimestampsShowResponse,
} from '@/tools/incidentio/types'
import type { ToolConfig } from '@/tools/types'

export const incidentTimestampsShowTool: ToolConfig<
  IncidentioIncidentTimestampsShowParams,
  IncidentioIncidentTimestampsShowResponse
> = {
  id: 'incidentio_incident_timestamps_show',
  name: 'Show Incident Timestamp',
  description: 'Get details of a specific incident timestamp definition in incident.io',
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
      description: 'The ID of the incident timestamp',
    },
  },

  request: {
    url: (params) => `https://api.incident.io/v2/incident_timestamps/${params.id}`,
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
        incident_timestamp: data.incident_timestamp || data,
      },
    }
  },

  outputs: {
    incident_timestamp: {
      type: 'object',
      description: 'The incident timestamp details',
      properties: {
        id: { type: 'string', description: 'The timestamp ID' },
        name: { type: 'string', description: 'The timestamp name' },
        rank: { type: 'number', description: 'The rank/order of the timestamp' },
        created_at: { type: 'string', description: 'When the timestamp was created' },
        updated_at: { type: 'string', description: 'When the timestamp was last updated' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: incident_types_list.ts]---
Location: sim-main/apps/sim/tools/incidentio/incident_types_list.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type {
  IncidentioIncidentTypesListParams,
  IncidentioIncidentTypesListResponse,
} from './types'

export const incidentTypesListTool: ToolConfig<
  IncidentioIncidentTypesListParams,
  IncidentioIncidentTypesListResponse
> = {
  id: 'incidentio_incident_types_list',
  name: 'Incident.io Incident Types List',
  description:
    'List all incident types configured in your Incident.io workspace. Returns type details including id, name, description, and default flag.',
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
    url: 'https://api.incident.io/v1/incident_types',
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
        incident_types: data.incident_types.map((type: any) => ({
          id: type.id,
          name: type.name,
          description: type.description,
          is_default: type.is_default,
        })),
      },
    }
  },

  outputs: {
    incident_types: {
      type: 'array',
      description: 'List of incident types',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Unique identifier for the incident type' },
          name: { type: 'string', description: 'Name of the incident type' },
          description: { type: 'string', description: 'Description of the incident type' },
          is_default: {
            type: 'boolean',
            description: 'Whether this is the default incident type',
          },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: incident_updates_list.ts]---
Location: sim-main/apps/sim/tools/incidentio/incident_updates_list.ts

```typescript
import type {
  IncidentioIncidentUpdatesListParams,
  IncidentioIncidentUpdatesListResponse,
} from '@/tools/incidentio/types'
import type { ToolConfig } from '@/tools/types'

export const incidentUpdatesListTool: ToolConfig<
  IncidentioIncidentUpdatesListParams,
  IncidentioIncidentUpdatesListResponse
> = {
  id: 'incidentio_incident_updates_list',
  name: 'List Incident Updates',
  description: 'List all updates for a specific incident in incident.io',
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
      description:
        'The ID of the incident to get updates for (optional - if not provided, returns all updates)',
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

      if (params.incident_id) {
        queryParams.push(`incident_id=${params.incident_id}`)
      }

      if (params.page_size) {
        queryParams.push(`page_size=${params.page_size}`)
      }

      if (params.after) {
        queryParams.push(`after=${params.after}`)
      }

      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : ''
      return `https://api.incident.io/v2/incident_updates${queryString}`
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
        incident_updates: data.incident_updates || data,
        pagination_meta: data.pagination_meta,
      },
    }
  },

  outputs: {
    incident_updates: {
      type: 'array',
      description: 'List of incident updates',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'The update ID' },
          incident_id: { type: 'string', description: 'The incident ID' },
          message: { type: 'string', description: 'The update message' },
          new_severity: {
            type: 'object',
            description: 'New severity if changed',
            optional: true,
            properties: {
              id: { type: 'string', description: 'Severity ID' },
              name: { type: 'string', description: 'Severity name' },
              rank: { type: 'number', description: 'Severity rank' },
            },
          },
          new_status: {
            type: 'object',
            description: 'New status if changed',
            optional: true,
            properties: {
              id: { type: 'string', description: 'Status ID' },
              name: { type: 'string', description: 'Status name' },
              category: { type: 'string', description: 'Status category' },
            },
          },
          updater: {
            type: 'object',
            description: 'User who created the update',
            properties: {
              id: { type: 'string', description: 'User ID' },
              name: { type: 'string', description: 'User name' },
              email: { type: 'string', description: 'User email' },
            },
          },
          created_at: { type: 'string', description: 'When the update was created' },
          updated_at: { type: 'string', description: 'When the update was last modified' },
        },
      },
    },
    pagination_meta: {
      type: 'object',
      description: 'Pagination information',
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

````
