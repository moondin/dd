---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 660
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 660 of 933)

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

---[FILE: launch_agent.ts]---
Location: sim-main/apps/sim/tools/cursor/launch_agent.ts

```typescript
import type { LaunchAgentParams, LaunchAgentResponse } from '@/tools/cursor/types'
import type { ToolConfig } from '@/tools/types'

export const launchAgentTool: ToolConfig<LaunchAgentParams, LaunchAgentResponse> = {
  id: 'cursor_launch_agent',
  name: 'Cursor Launch Agent',
  description:
    'Start a new cloud agent to work on a GitHub repository with the given instructions.',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Cursor API key',
    },
    repository: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'GitHub repository URL (e.g., https://github.com/your-org/your-repo)',
    },
    ref: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Branch, tag, or commit to work from (defaults to default branch)',
    },
    promptText: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The instruction text for the agent',
    },
    promptImages: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'JSON array of image objects with base64 data and dimensions',
    },
    model: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Model to use (leave empty for auto-selection)',
    },
    branchName: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Custom branch name for the agent to use',
    },
    autoCreatePr: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Automatically create a PR when the agent finishes',
    },
    openAsCursorGithubApp: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Open the PR as the Cursor GitHub App',
    },
    skipReviewerRequest: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Skip requesting reviewers on the PR',
    },
  },

  request: {
    url: () => 'https://api.cursor.com/v0/agents',
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(`${params.apiKey}:`).toString('base64')}`,
    }),
    body: (params) => {
      const body: Record<string, any> = {
        source: {
          repository: params.repository,
        },
        prompt: {
          text: params.promptText,
        },
      }

      if (params.ref) {
        body.source.ref = params.ref
      }

      if (params.promptImages) {
        try {
          body.prompt.images = JSON.parse(params.promptImages)
        } catch {
          body.prompt.images = []
        }
      }

      if (params.model) {
        body.model = params.model
      }

      const target: Record<string, any> = {}
      if (params.branchName) target.branchName = params.branchName
      if (typeof params.autoCreatePr === 'boolean') target.autoCreatePr = params.autoCreatePr
      if (typeof params.openAsCursorGithubApp === 'boolean')
        target.openAsCursorGithubApp = params.openAsCursorGithubApp
      if (typeof params.skipReviewerRequest === 'boolean')
        target.skipReviewerRequest = params.skipReviewerRequest

      if (Object.keys(target).length > 0) {
        body.target = target
      }

      return body
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()
    const agentUrl = `https://cursor.com/agents?selectedBcId=${data.id}`

    return {
      success: true,
      output: {
        content: 'Agent launched successfully!',
        metadata: {
          id: data.id,
          url: agentUrl,
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Success message with agent details' },
    metadata: {
      type: 'object',
      description: 'Launch result metadata',
      properties: {
        id: { type: 'string', description: 'Agent ID' },
        url: { type: 'string', description: 'Agent URL' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_agents.ts]---
Location: sim-main/apps/sim/tools/cursor/list_agents.ts

```typescript
import type { ListAgentsParams, ListAgentsResponse } from '@/tools/cursor/types'
import type { ToolConfig } from '@/tools/types'

export const listAgentsTool: ToolConfig<ListAgentsParams, ListAgentsResponse> = {
  id: 'cursor_list_agents',
  name: 'Cursor List Agents',
  description: 'List all cloud agents for the authenticated user with optional pagination.',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Cursor API key',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Number of agents to return (default: 20, max: 100)',
    },
    cursor: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Pagination cursor from previous response',
    },
  },

  request: {
    url: (params) => {
      const url = new URL('https://api.cursor.com/v0/agents')
      if (params.limit) url.searchParams.set('limit', String(params.limit))
      if (params.cursor) url.searchParams.set('cursor', params.cursor)
      return url.toString()
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Basic ${Buffer.from(`${params.apiKey}:`).toString('base64')}`,
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        content: `Found ${data.agents.length} agents`,
        metadata: {
          agents: data.agents,
          nextCursor: data.nextCursor,
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Human-readable list of agents' },
    metadata: {
      type: 'object',
      description: 'Agent list metadata',
      properties: {
        agents: {
          type: 'array',
          description: 'Array of agent objects',
        },
        nextCursor: {
          type: 'string',
          description: 'Pagination cursor for next page',
          optional: true,
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: stop_agent.ts]---
Location: sim-main/apps/sim/tools/cursor/stop_agent.ts

```typescript
import type { StopAgentParams, StopAgentResponse } from '@/tools/cursor/types'
import type { ToolConfig } from '@/tools/types'

export const stopAgentTool: ToolConfig<StopAgentParams, StopAgentResponse> = {
  id: 'cursor_stop_agent',
  name: 'Cursor Stop Agent',
  description: 'Stop a running cloud agent. This pauses the agent without deleting it.',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Cursor API key',
    },
    agentId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Unique identifier for the cloud agent (e.g., bc_abc123)',
    },
  },

  request: {
    url: (params) => `https://api.cursor.com/v0/agents/${params.agentId}/stop`,
    method: 'POST',
    headers: (params) => ({
      Authorization: `Basic ${Buffer.from(`${params.apiKey}:`).toString('base64')}`,
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    const content = `Agent ${data.id} has been stopped`

    return {
      success: true,
      output: {
        content,
        metadata: {
          id: data.id,
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Success message' },
    metadata: {
      type: 'object',
      description: 'Result metadata',
      properties: {
        id: { type: 'string', description: 'Agent ID' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/cursor/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface BaseCursorParams {
  apiKey: string
}

export interface ListAgentsParams extends BaseCursorParams {
  limit?: number
  cursor?: string
}

export interface GetAgentParams extends BaseCursorParams {
  agentId: string
}

export interface GetConversationParams extends BaseCursorParams {
  agentId: string
}

export interface LaunchAgentParams extends BaseCursorParams {
  repository: string
  ref?: string
  promptText: string
  promptImages?: string
  model?: string
  branchName?: string
  autoCreatePr?: boolean
  openAsCursorGithubApp?: boolean
  skipReviewerRequest?: boolean
}

export interface AddFollowupParams extends BaseCursorParams {
  agentId: string
  followupPromptText: string
  promptImages?: string
}

export interface StopAgentParams extends BaseCursorParams {
  agentId: string
}

export interface DeleteAgentParams extends BaseCursorParams {
  agentId: string
}

interface AgentSource {
  repository: string
  ref: string
}

interface AgentTarget {
  branchName: string
  url: string
  prUrl?: string
  autoCreatePr: boolean
  openAsCursorGithubApp: boolean
  skipReviewerRequest: boolean
}

interface AgentMetadata {
  id: string
  name: string
  status: 'RUNNING' | 'FINISHED' | 'STOPPED' | 'FAILED'
  source: AgentSource
  target: AgentTarget
  summary?: string
  createdAt: string
}

interface ConversationMessage {
  id: string
  type: 'user_message' | 'assistant_message'
  text: string
}

interface RepositoryMetadata {
  owner: string
  name: string
  repository: string
}

interface ApiKeyInfoMetadata {
  apiKeyName: string
  createdAt: string
  userEmail: string
}

export interface ListAgentsResponse extends ToolResponse {
  output: {
    content: string
    metadata: {
      agents: AgentMetadata[]
      nextCursor?: string
    }
  }
}

export interface GetAgentResponse extends ToolResponse {
  output: {
    content: string
    metadata: AgentMetadata
  }
}

export interface GetConversationResponse extends ToolResponse {
  output: {
    content: string
    metadata: {
      id: string
      messages: ConversationMessage[]
    }
  }
}

export interface LaunchAgentResponse extends ToolResponse {
  output: {
    content: string
    metadata: {
      id: string
      url: string
    }
  }
}

export interface AddFollowupResponse extends ToolResponse {
  output: {
    content: string
    metadata: {
      id: string
    }
  }
}

export interface StopAgentResponse extends ToolResponse {
  output: {
    content: string
    metadata: {
      id: string
    }
  }
}

export interface DeleteAgentResponse extends ToolResponse {
  output: {
    content: string
    metadata: {
      id: string
    }
  }
}

export interface GetApiKeyInfoResponse extends ToolResponse {
  output: {
    content: string
    metadata: ApiKeyInfoMetadata
  }
}

export interface ListModelsResponse extends ToolResponse {
  output: {
    content: string
    metadata: {
      models: string[]
    }
  }
}

export interface ListRepositoriesResponse extends ToolResponse {
  output: {
    content: string
    metadata: {
      repositories: RepositoryMetadata[]
    }
  }
}

export type CursorResponse =
  | ListAgentsResponse
  | GetAgentResponse
  | GetConversationResponse
  | LaunchAgentResponse
  | AddFollowupResponse
  | StopAgentResponse
  | DeleteAgentResponse
  | GetApiKeyInfoResponse
  | ListModelsResponse
  | ListRepositoriesResponse
```

--------------------------------------------------------------------------------

---[FILE: cancel_downtime.ts]---
Location: sim-main/apps/sim/tools/datadog/cancel_downtime.ts

```typescript
import type { CancelDowntimeParams, CancelDowntimeResponse } from '@/tools/datadog/types'
import type { ToolConfig } from '@/tools/types'

export const cancelDowntimeTool: ToolConfig<CancelDowntimeParams, CancelDowntimeResponse> = {
  id: 'datadog_cancel_downtime',
  name: 'Datadog Cancel Downtime',
  description: 'Cancel a scheduled downtime.',
  version: '1.0.0',

  params: {
    downtimeId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The ID of the downtime to cancel',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Datadog API key',
    },
    applicationKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Datadog Application key',
    },
    site: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Datadog site/region (default: datadoghq.com)',
    },
  },

  request: {
    url: (params) => {
      const site = params.site || 'datadoghq.com'
      return `https://api.${site}/api/v2/downtime/${params.downtimeId}`
    },
    method: 'DELETE',
    headers: (params) => ({
      'Content-Type': 'application/json',
      'DD-API-KEY': params.apiKey,
      'DD-APPLICATION-KEY': params.applicationKey,
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok && response.status !== 204) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        output: {
          success: false,
        },
        error: errorData.errors?.[0]?.detail || `HTTP ${response.status}: ${response.statusText}`,
      }
    }

    return {
      success: true,
      output: {
        success: true,
      },
    }
  },

  outputs: {
    success: {
      type: 'boolean',
      description: 'Whether the downtime was successfully canceled',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_downtime.ts]---
Location: sim-main/apps/sim/tools/datadog/create_downtime.ts

```typescript
import type { CreateDowntimeParams, CreateDowntimeResponse } from '@/tools/datadog/types'
import type { ToolConfig } from '@/tools/types'

export const createDowntimeTool: ToolConfig<CreateDowntimeParams, CreateDowntimeResponse> = {
  id: 'datadog_create_downtime',
  name: 'Datadog Create Downtime',
  description: 'Schedule a downtime to suppress monitor notifications during maintenance windows.',
  version: '1.0.0',

  params: {
    scope: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description:
        'Scope to apply downtime to (e.g., "host:myhost", "env:production", or "*" for all)',
    },
    message: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Message to display during downtime',
    },
    start: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Unix timestamp for downtime start (defaults to now)',
    },
    end: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Unix timestamp for downtime end',
    },
    timezone: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Timezone for the downtime (e.g., "America/New_York")',
    },
    monitorId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Specific monitor ID to mute',
    },
    monitorTags: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Comma-separated monitor tags to match (e.g., "team:backend,priority:high")',
    },
    muteFirstRecoveryNotification: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Mute the first recovery notification',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Datadog API key',
    },
    applicationKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Datadog Application key',
    },
    site: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Datadog site/region (default: datadoghq.com)',
    },
  },

  request: {
    url: (params) => {
      const site = params.site || 'datadoghq.com'
      return `https://api.${site}/api/v2/downtime`
    },
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      'DD-API-KEY': params.apiKey,
      'DD-APPLICATION-KEY': params.applicationKey,
    }),
    body: (params) => {
      const schedule: Record<string, any> = {}
      if (params.start) schedule.start = new Date(params.start * 1000).toISOString()
      if (params.end) schedule.end = new Date(params.end * 1000).toISOString()
      if (params.timezone) schedule.timezone = params.timezone

      const body: Record<string, any> = {
        data: {
          type: 'downtime',
          attributes: {
            scope: params.scope,
            schedule: Object.keys(schedule).length > 0 ? schedule : undefined,
          },
        },
      }

      if (params.message) body.data.attributes.message = params.message
      if (params.muteFirstRecoveryNotification !== undefined) {
        body.data.attributes.mute_first_recovery_notification = params.muteFirstRecoveryNotification
      }

      if (params.monitorId) {
        body.data.attributes.monitor_identifier = {
          monitor_id: Number.parseInt(params.monitorId, 10),
        }
      } else if (params.monitorTags) {
        body.data.attributes.monitor_identifier = {
          monitor_tags: params.monitorTags
            .split(',')
            .map((t: string) => t.trim())
            .filter((t: string) => t.length > 0),
        }
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        output: {
          downtime: {} as any,
        },
        error: errorData.errors?.[0]?.detail || `HTTP ${response.status}: ${response.statusText}`,
      }
    }

    const data = await response.json()
    const attrs = data.data?.attributes || {}
    return {
      success: true,
      output: {
        downtime: {
          id: data.data?.id,
          scope: attrs.scope ? [attrs.scope] : [],
          message: attrs.message,
          start: attrs.schedule?.start
            ? new Date(attrs.schedule.start).getTime() / 1000
            : undefined,
          end: attrs.schedule?.end ? new Date(attrs.schedule.end).getTime() / 1000 : undefined,
          timezone: attrs.schedule?.timezone,
          disabled: attrs.disabled,
          active: attrs.status === 'active',
          created: attrs.created ? new Date(attrs.created).getTime() / 1000 : undefined,
          modified: attrs.modified ? new Date(attrs.modified).getTime() / 1000 : undefined,
        },
      },
    }
  },

  outputs: {
    downtime: {
      type: 'object',
      description: 'The created downtime details',
      properties: {
        id: { type: 'number', description: 'Downtime ID' },
        scope: { type: 'array', description: 'Downtime scope' },
        message: { type: 'string', description: 'Downtime message' },
        start: { type: 'number', description: 'Start time (Unix timestamp)' },
        end: { type: 'number', description: 'End time (Unix timestamp)' },
        active: { type: 'boolean', description: 'Whether downtime is currently active' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_event.ts]---
Location: sim-main/apps/sim/tools/datadog/create_event.ts

```typescript
import type { CreateEventParams, CreateEventResponse } from '@/tools/datadog/types'
import type { ToolConfig } from '@/tools/types'

export const createEventTool: ToolConfig<CreateEventParams, CreateEventResponse> = {
  id: 'datadog_create_event',
  name: 'Datadog Create Event',
  description:
    'Post an event to the Datadog event stream. Use for deployment notifications, alerts, or any significant occurrences.',
  version: '1.0.0',

  params: {
    title: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Event title',
    },
    text: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Event body/description. Supports markdown.',
    },
    alertType: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Alert type: error, warning, info, success, user_update, recommendation, or snapshot',
    },
    priority: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Event priority: normal or low',
    },
    host: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Host name to associate with this event',
    },
    tags: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Comma-separated list of tags (e.g., "env:production,service:api")',
    },
    aggregationKey: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Key to aggregate events together',
    },
    sourceTypeName: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Source type name for the event',
    },
    dateHappened: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Unix timestamp when the event occurred (defaults to now)',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Datadog API key',
    },
    site: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Datadog site/region (default: datadoghq.com)',
    },
  },

  request: {
    url: (params) => {
      const site = params.site || 'datadoghq.com'
      return `https://api.${site}/api/v1/events`
    },
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      'DD-API-KEY': params.apiKey,
    }),
    body: (params) => {
      const body: Record<string, any> = {
        title: params.title,
        text: params.text,
      }

      if (params.alertType) body.alert_type = params.alertType
      if (params.priority) body.priority = params.priority
      if (params.host) body.host = params.host
      if (params.aggregationKey) body.aggregation_key = params.aggregationKey
      if (params.sourceTypeName) body.source_type_name = params.sourceTypeName
      if (params.dateHappened) body.date_happened = params.dateHappened

      if (params.tags) {
        body.tags = params.tags
          .split(',')
          .map((t: string) => t.trim())
          .filter((t: string) => t.length > 0)
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        output: {
          event: {} as any,
        },
        error: errorData.errors?.[0] || `HTTP ${response.status}: ${response.statusText}`,
      }
    }

    const data = await response.json()
    return {
      success: true,
      output: {
        event: {
          id: data.event?.id,
          title: data.event?.title,
          text: data.event?.text,
          date_happened: data.event?.date_happened,
          priority: data.event?.priority,
          alert_type: data.event?.alert_type,
          host: data.event?.host,
          tags: data.event?.tags,
          url: data.event?.url,
        },
      },
    }
  },

  outputs: {
    event: {
      type: 'object',
      description: 'The created event details',
      properties: {
        id: { type: 'number', description: 'Event ID' },
        title: { type: 'string', description: 'Event title' },
        text: { type: 'string', description: 'Event text' },
        date_happened: { type: 'number', description: 'Unix timestamp when event occurred' },
        priority: { type: 'string', description: 'Event priority' },
        alert_type: { type: 'string', description: 'Alert type' },
        host: { type: 'string', description: 'Associated host' },
        tags: { type: 'array', description: 'Event tags' },
        url: { type: 'string', description: 'URL to view the event in Datadog' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_monitor.ts]---
Location: sim-main/apps/sim/tools/datadog/create_monitor.ts

```typescript
import type { CreateMonitorParams, CreateMonitorResponse } from '@/tools/datadog/types'
import type { ToolConfig } from '@/tools/types'

export const createMonitorTool: ToolConfig<CreateMonitorParams, CreateMonitorResponse> = {
  id: 'datadog_create_monitor',
  name: 'Datadog Create Monitor',
  description:
    'Create a new monitor/alert in Datadog. Monitors can track metrics, service checks, events, and more.',
  version: '1.0.0',

  params: {
    name: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Monitor name',
    },
    type: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description:
        'Monitor type: metric alert, service check, event alert, process alert, log alert, query alert, composite, synthetics alert, slo alert',
    },
    query: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Monitor query (e.g., "avg(last_5m):avg:system.cpu.idle{*} < 20")',
    },
    message: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Message to include with notifications. Can include @-mentions and markdown.',
    },
    tags: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Comma-separated list of tags',
    },
    priority: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Monitor priority (1-5, where 1 is highest)',
    },
    options: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'JSON string of monitor options (thresholds, notify_no_data, renotify_interval, etc.)',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Datadog API key',
    },
    applicationKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Datadog Application key',
    },
    site: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Datadog site/region (default: datadoghq.com)',
    },
  },

  request: {
    url: (params) => {
      const site = params.site || 'datadoghq.com'
      return `https://api.${site}/api/v1/monitor`
    },
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      'DD-API-KEY': params.apiKey,
      'DD-APPLICATION-KEY': params.applicationKey,
    }),
    body: (params) => {
      const body: Record<string, any> = {
        name: params.name,
        type: params.type,
        query: params.query,
      }

      if (params.message) body.message = params.message
      if (params.priority) body.priority = params.priority

      if (params.tags) {
        body.tags = params.tags
          .split(',')
          .map((t: string) => t.trim())
          .filter((t: string) => t.length > 0)
      }

      if (params.options) {
        try {
          body.options =
            typeof params.options === 'string' ? JSON.parse(params.options) : params.options
        } catch {
          // If options parsing fails, skip it
        }
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        output: {
          monitor: {} as any,
        },
        error: errorData.errors?.[0] || `HTTP ${response.status}: ${response.statusText}`,
      }
    }

    const data = await response.json()
    return {
      success: true,
      output: {
        monitor: {
          id: data.id,
          name: data.name,
          type: data.type,
          query: data.query,
          message: data.message,
          tags: data.tags,
          priority: data.priority,
          options: data.options,
          overall_state: data.overall_state,
          created: data.created,
          modified: data.modified,
          creator: data.creator,
        },
      },
    }
  },

  outputs: {
    monitor: {
      type: 'object',
      description: 'The created monitor details',
      properties: {
        id: { type: 'number', description: 'Monitor ID' },
        name: { type: 'string', description: 'Monitor name' },
        type: { type: 'string', description: 'Monitor type' },
        query: { type: 'string', description: 'Monitor query' },
        message: { type: 'string', description: 'Notification message' },
        tags: { type: 'array', description: 'Monitor tags' },
        priority: { type: 'number', description: 'Monitor priority' },
        overall_state: { type: 'string', description: 'Current monitor state' },
        created: { type: 'string', description: 'Creation timestamp' },
        modified: { type: 'string', description: 'Last modification timestamp' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_monitor.ts]---
Location: sim-main/apps/sim/tools/datadog/get_monitor.ts

```typescript
import type { GetMonitorParams, GetMonitorResponse } from '@/tools/datadog/types'
import type { ToolConfig } from '@/tools/types'

export const getMonitorTool: ToolConfig<GetMonitorParams, GetMonitorResponse> = {
  id: 'datadog_get_monitor',
  name: 'Datadog Get Monitor',
  description: 'Retrieve details of a specific monitor by ID.',
  version: '1.0.0',

  params: {
    monitorId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The ID of the monitor to retrieve',
    },
    groupStates: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Comma-separated group states to include: alert, warn, no data, ok',
    },
    withDowntimes: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Include downtime data with the monitor',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Datadog API key',
    },
    applicationKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Datadog Application key',
    },
    site: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Datadog site/region (default: datadoghq.com)',
    },
  },

  request: {
    url: (params) => {
      const site = params.site || 'datadoghq.com'
      const queryParams = new URLSearchParams()

      if (params.groupStates) queryParams.set('group_states', params.groupStates)
      if (params.withDowntimes) queryParams.set('with_downtimes', 'true')

      const queryString = queryParams.toString()
      return `https://api.${site}/api/v1/monitor/${params.monitorId}${queryString ? `?${queryString}` : ''}`
    },
    method: 'GET',
    headers: (params) => ({
      'Content-Type': 'application/json',
      'DD-API-KEY': params.apiKey,
      'DD-APPLICATION-KEY': params.applicationKey,
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        output: {
          monitor: {} as any,
        },
        error: errorData.errors?.[0] || `HTTP ${response.status}: ${response.statusText}`,
      }
    }

    const data = await response.json()
    return {
      success: true,
      output: {
        monitor: {
          id: data.id,
          name: data.name,
          type: data.type,
          query: data.query,
          message: data.message,
          tags: data.tags,
          priority: data.priority,
          options: data.options,
          overall_state: data.overall_state,
          created: data.created,
          modified: data.modified,
          creator: data.creator,
        },
      },
    }
  },

  outputs: {
    monitor: {
      type: 'object',
      description: 'The monitor details',
      properties: {
        id: { type: 'number', description: 'Monitor ID' },
        name: { type: 'string', description: 'Monitor name' },
        type: { type: 'string', description: 'Monitor type' },
        query: { type: 'string', description: 'Monitor query' },
        message: { type: 'string', description: 'Notification message' },
        tags: { type: 'array', description: 'Monitor tags' },
        priority: { type: 'number', description: 'Monitor priority' },
        overall_state: { type: 'string', description: 'Current monitor state' },
        created: { type: 'string', description: 'Creation timestamp' },
        modified: { type: 'string', description: 'Last modification timestamp' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/datadog/index.ts

```typescript
import { cancelDowntimeTool } from '@/tools/datadog/cancel_downtime'
import { createDowntimeTool } from '@/tools/datadog/create_downtime'
import { createEventTool } from '@/tools/datadog/create_event'
import { createMonitorTool } from '@/tools/datadog/create_monitor'
import { getMonitorTool } from '@/tools/datadog/get_monitor'
import { listDowntimesTool } from '@/tools/datadog/list_downtimes'
import { listMonitorsTool } from '@/tools/datadog/list_monitors'
import { muteMonitorTool } from '@/tools/datadog/mute_monitor'
import { queryLogsTool } from '@/tools/datadog/query_logs'
import { queryTimeseriesTool } from '@/tools/datadog/query_timeseries'
import { sendLogsTool } from '@/tools/datadog/send_logs'
import { submitMetricsTool } from '@/tools/datadog/submit_metrics'

export const datadogSubmitMetricsTool = submitMetricsTool
export const datadogQueryTimeseriesTool = queryTimeseriesTool
export const datadogCreateEventTool = createEventTool
export const datadogCreateMonitorTool = createMonitorTool
export const datadogGetMonitorTool = getMonitorTool
export const datadogListMonitorsTool = listMonitorsTool
export const datadogMuteMonitorTool = muteMonitorTool
export const datadogQueryLogsTool = queryLogsTool
export const datadogSendLogsTool = sendLogsTool
export const datadogCreateDowntimeTool = createDowntimeTool
export const datadogListDowntimesTool = listDowntimesTool
export const datadogCancelDowntimeTool = cancelDowntimeTool
```

--------------------------------------------------------------------------------

---[FILE: list_downtimes.ts]---
Location: sim-main/apps/sim/tools/datadog/list_downtimes.ts

```typescript
import type { ListDowntimesParams, ListDowntimesResponse } from '@/tools/datadog/types'
import type { ToolConfig } from '@/tools/types'

export const listDowntimesTool: ToolConfig<ListDowntimesParams, ListDowntimesResponse> = {
  id: 'datadog_list_downtimes',
  name: 'Datadog List Downtimes',
  description: 'List all scheduled downtimes in Datadog.',
  version: '1.0.0',

  params: {
    currentOnly: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Only return currently active downtimes',
    },
    monitorId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by monitor ID',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Datadog API key',
    },
    applicationKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Datadog Application key',
    },
    site: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Datadog site/region (default: datadoghq.com)',
    },
  },

  request: {
    url: (params) => {
      const site = params.site || 'datadoghq.com'
      const queryParams = new URLSearchParams()

      if (params.currentOnly) queryParams.set('current_only', 'true')
      if (params.monitorId) queryParams.set('monitor_id', params.monitorId)

      const queryString = queryParams.toString()
      return `https://api.${site}/api/v2/downtime${queryString ? `?${queryString}` : ''}`
    },
    method: 'GET',
    headers: (params) => ({
      'Content-Type': 'application/json',
      'DD-API-KEY': params.apiKey,
      'DD-APPLICATION-KEY': params.applicationKey,
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        output: {
          downtimes: [],
        },
        error: errorData.errors?.[0]?.detail || `HTTP ${response.status}: ${response.statusText}`,
      }
    }

    const data = await response.json()
    const downtimes = (data.data || []).map((d: any) => {
      const attrs = d.attributes || {}
      return {
        id: d.id,
        scope: attrs.scope ? [attrs.scope] : [],
        message: attrs.message,
        start: attrs.schedule?.start ? new Date(attrs.schedule.start).getTime() / 1000 : undefined,
        end: attrs.schedule?.end ? new Date(attrs.schedule.end).getTime() / 1000 : undefined,
        timezone: attrs.schedule?.timezone,
        disabled: attrs.disabled,
        active: attrs.status === 'active',
        created: attrs.created ? new Date(attrs.created).getTime() / 1000 : undefined,
        modified: attrs.modified ? new Date(attrs.modified).getTime() / 1000 : undefined,
      }
    })

    return {
      success: true,
      output: {
        downtimes,
      },
    }
  },

  outputs: {
    downtimes: {
      type: 'array',
      description: 'List of downtimes',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', description: 'Downtime ID' },
          scope: { type: 'array', description: 'Downtime scope' },
          message: { type: 'string', description: 'Downtime message' },
          start: { type: 'number', description: 'Start time (Unix timestamp)' },
          end: { type: 'number', description: 'End time (Unix timestamp)' },
          active: { type: 'boolean', description: 'Whether downtime is currently active' },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

````
