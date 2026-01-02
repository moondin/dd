---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 661
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 661 of 933)

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

---[FILE: list_monitors.ts]---
Location: sim-main/apps/sim/tools/datadog/list_monitors.ts

```typescript
import type { ListMonitorsParams, ListMonitorsResponse } from '@/tools/datadog/types'
import type { ToolConfig } from '@/tools/types'

export const listMonitorsTool: ToolConfig<ListMonitorsParams, ListMonitorsResponse> = {
  id: 'datadog_list_monitors',
  name: 'Datadog List Monitors',
  description: 'List all monitors in Datadog with optional filtering by name, tags, or state.',
  version: '1.0.0',

  params: {
    groupStates: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Comma-separated group states to filter by: alert, warn, no data, ok',
    },
    name: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter monitors by name (partial match)',
    },
    tags: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Comma-separated list of tags to filter by',
    },
    monitorTags: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Comma-separated list of monitor tags to filter by',
    },
    withDowntimes: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Include downtime data with monitors',
    },
    page: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Page number for pagination (0-indexed)',
    },
    pageSize: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of monitors per page (max 1000)',
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
      if (params.name) queryParams.set('name', params.name)
      if (params.tags) queryParams.set('tags', params.tags)
      if (params.monitorTags) queryParams.set('monitor_tags', params.monitorTags)
      if (params.withDowntimes) queryParams.set('with_downtimes', 'true')
      if (params.page !== undefined) queryParams.set('page', String(params.page))
      if (params.pageSize) queryParams.set('page_size', String(params.pageSize))

      const queryString = queryParams.toString()
      const url = `https://api.${site}/api/v1/monitor${queryString ? `?${queryString}` : ''}`
      console.log(
        '[Datadog List Monitors] URL:',
        url,
        'Site param:',
        params.site,
        'API Key present:',
        !!params.apiKey,
        'App Key present:',
        !!params.applicationKey
      )
      return url
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
          monitors: [],
        },
        error: errorData.errors?.[0] || `HTTP ${response.status}: ${response.statusText}`,
      }
    }

    const text = await response.text()
    let data: any
    try {
      data = JSON.parse(text)
    } catch (e) {
      return {
        success: false,
        output: { monitors: [] },
        error: `Failed to parse response: ${text.substring(0, 200)}`,
      }
    }

    if (!Array.isArray(data)) {
      return {
        success: false,
        output: { monitors: [] },
        error: `Expected array but got: ${typeof data} - ${JSON.stringify(data).substring(0, 200)}`,
      }
    }

    const monitors = data.map((m: any) => ({
      id: m.id,
      name: m.name,
      type: m.type,
      query: m.query,
      message: m.message,
      tags: m.tags,
      priority: m.priority,
      options: m.options,
      overall_state: m.overall_state,
      created: m.created,
      modified: m.modified,
      creator: m.creator,
    }))

    return {
      success: true,
      output: {
        monitors,
      },
    }
  },

  outputs: {
    monitors: {
      type: 'array',
      description: 'List of monitors',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', description: 'Monitor ID' },
          name: { type: 'string', description: 'Monitor name' },
          type: { type: 'string', description: 'Monitor type' },
          query: { type: 'string', description: 'Monitor query' },
          overall_state: { type: 'string', description: 'Current state' },
          tags: { type: 'array', description: 'Tags' },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: mute_monitor.ts]---
Location: sim-main/apps/sim/tools/datadog/mute_monitor.ts

```typescript
import type { MuteMonitorParams, MuteMonitorResponse } from '@/tools/datadog/types'
import type { ToolConfig } from '@/tools/types'

export const muteMonitorTool: ToolConfig<MuteMonitorParams, MuteMonitorResponse> = {
  id: 'datadog_mute_monitor',
  name: 'Datadog Mute Monitor',
  description: 'Mute a monitor to temporarily suppress notifications.',
  version: '1.0.0',

  params: {
    monitorId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The ID of the monitor to mute',
    },
    scope: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Scope to mute (e.g., "host:myhost"). If not specified, mutes all scopes.',
    },
    end: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Unix timestamp when the mute should end. If not specified, mutes indefinitely.',
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
      return `https://api.${site}/api/v1/monitor/${params.monitorId}/mute`
    },
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      'DD-API-KEY': params.apiKey,
      'DD-APPLICATION-KEY': params.applicationKey,
    }),
    body: (params) => {
      const body: Record<string, any> = {}
      if (params.scope) body.scope = params.scope
      if (params.end) body.end = params.end
      return body
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        output: {
          success: false,
        },
        error: errorData.errors?.[0] || `HTTP ${response.status}: ${response.statusText}`,
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
      description: 'Whether the monitor was successfully muted',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: query_logs.ts]---
Location: sim-main/apps/sim/tools/datadog/query_logs.ts

```typescript
import type { QueryLogsParams, QueryLogsResponse } from '@/tools/datadog/types'
import type { ToolConfig } from '@/tools/types'

export const queryLogsTool: ToolConfig<QueryLogsParams, QueryLogsResponse> = {
  id: 'datadog_query_logs',
  name: 'Datadog Query Logs',
  description:
    'Search and retrieve logs from Datadog. Use for troubleshooting, analysis, or monitoring.',
  version: '1.0.0',

  params: {
    query: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Log search query (e.g., "service:web-app status:error")',
    },
    from: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Start time in ISO-8601 format or relative (e.g., "now-1h")',
    },
    to: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'End time in ISO-8601 format or relative (e.g., "now")',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Maximum number of logs to return (default: 50, max: 1000)',
    },
    sort: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Sort order: timestamp (oldest first) or -timestamp (newest first)',
    },
    indexes: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comma-separated list of log indexes to search',
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
      return `https://api.${site}/api/v2/logs/events/search`
    },
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      'DD-API-KEY': params.apiKey,
      'DD-APPLICATION-KEY': params.applicationKey,
    }),
    body: (params) => {
      const body: Record<string, any> = {
        filter: {
          query: params.query,
          from: params.from,
          to: params.to,
        },
        page: {
          limit: params.limit || 50,
        },
      }

      if (params.sort) {
        body.sort = params.sort
      }

      if (params.indexes) {
        body.filter.indexes = params.indexes
          .split(',')
          .map((i: string) => i.trim())
          .filter((i: string) => i.length > 0)
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
          logs: [],
        },
        error: errorData.errors?.[0]?.detail || `HTTP ${response.status}: ${response.statusText}`,
      }
    }

    const data = await response.json()
    const logs = (data.data || []).map((log: any) => ({
      id: log.id,
      content: {
        timestamp: log.attributes?.timestamp,
        host: log.attributes?.host,
        service: log.attributes?.service,
        message: log.attributes?.message,
        status: log.attributes?.status,
        attributes: log.attributes?.attributes,
        tags: log.attributes?.tags,
      },
    }))

    return {
      success: true,
      output: {
        logs,
        nextLogId: data.meta?.page?.after,
      },
    }
  },

  outputs: {
    logs: {
      type: 'array',
      description: 'List of log entries',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Log ID' },
          content: {
            type: 'object',
            description: 'Log content',
            properties: {
              timestamp: { type: 'string', description: 'Log timestamp' },
              host: { type: 'string', description: 'Host name' },
              service: { type: 'string', description: 'Service name' },
              message: { type: 'string', description: 'Log message' },
              status: { type: 'string', description: 'Log status/level' },
            },
          },
        },
      },
    },
    nextLogId: {
      type: 'string',
      description: 'Cursor for pagination',
      optional: true,
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: query_timeseries.ts]---
Location: sim-main/apps/sim/tools/datadog/query_timeseries.ts

```typescript
import type { QueryTimeseriesParams, QueryTimeseriesResponse } from '@/tools/datadog/types'
import type { ToolConfig } from '@/tools/types'

export const queryTimeseriesTool: ToolConfig<QueryTimeseriesParams, QueryTimeseriesResponse> = {
  id: 'datadog_query_timeseries',
  name: 'Datadog Query Timeseries',
  description:
    'Query metric timeseries data from Datadog. Use for analyzing trends, creating reports, or retrieving metric values.',
  version: '1.0.0',

  params: {
    query: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Datadog metrics query (e.g., "avg:system.cpu.user{*}")',
    },
    from: {
      type: 'number',
      required: true,
      visibility: 'user-or-llm',
      description: 'Start time as Unix timestamp in seconds',
    },
    to: {
      type: 'number',
      required: true,
      visibility: 'user-or-llm',
      description: 'End time as Unix timestamp in seconds',
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
      const queryParams = new URLSearchParams({
        query: params.query,
        from: String(params.from),
        to: String(params.to),
      })
      return `https://api.${site}/api/v1/query?${queryParams.toString()}`
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
          series: [],
          status: 'error',
        },
        error: errorData.errors?.[0] || `HTTP ${response.status}: ${response.statusText}`,
      }
    }

    const data = await response.json()
    const series = (data.series || []).map((s: any) => ({
      metric: s.metric || s.expression,
      tags: s.tag_set || [],
      points: (s.pointlist || []).map((p: [number, number]) => ({
        timestamp: p[0] / 1000, // Convert from milliseconds to seconds
        value: p[1],
      })),
    }))

    return {
      success: true,
      output: {
        series,
        status: data.status || 'ok',
      },
    }
  },

  outputs: {
    series: {
      type: 'array',
      description: 'Array of timeseries data with metric name, tags, and data points',
    },
    status: {
      type: 'string',
      description: 'Query status',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: send_logs.ts]---
Location: sim-main/apps/sim/tools/datadog/send_logs.ts

```typescript
import type { SendLogsParams, SendLogsResponse } from '@/tools/datadog/types'
import type { ToolConfig } from '@/tools/types'

export const sendLogsTool: ToolConfig<SendLogsParams, SendLogsResponse> = {
  id: 'datadog_send_logs',
  name: 'Datadog Send Logs',
  description: 'Send log entries to Datadog for centralized logging and analysis.',
  version: '1.0.0',

  params: {
    logs: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description:
        'JSON array of log entries. Each entry should have message and optionally ddsource, ddtags, hostname, service.',
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
      // Logs API uses a different subdomain
      const logsHost =
        site === 'datadoghq.com'
          ? 'http-intake.logs.datadoghq.com'
          : site === 'datadoghq.eu'
            ? 'http-intake.logs.datadoghq.eu'
            : `http-intake.logs.${site}`
      return `https://${logsHost}/api/v2/logs`
    },
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      'DD-API-KEY': params.apiKey,
    }),
    body: (params) => {
      let logs: any[]
      try {
        logs = typeof params.logs === 'string' ? JSON.parse(params.logs) : params.logs
      } catch {
        throw new Error('Invalid JSON in logs parameter')
      }

      // Ensure each log entry has the required format
      return logs.map((log: any) => ({
        ddsource: log.ddsource || 'custom',
        ddtags: log.ddtags || '',
        hostname: log.hostname || '',
        message: log.message,
        service: log.service || '',
      }))
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        output: {
          success: false,
        },
        error: errorData.errors?.[0] || `HTTP ${response.status}: ${response.statusText}`,
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
      description: 'Whether the logs were sent successfully',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: submit_metrics.ts]---
Location: sim-main/apps/sim/tools/datadog/submit_metrics.ts

```typescript
import type { SubmitMetricsParams, SubmitMetricsResponse } from '@/tools/datadog/types'
import type { ToolConfig } from '@/tools/types'

export const submitMetricsTool: ToolConfig<SubmitMetricsParams, SubmitMetricsResponse> = {
  id: 'datadog_submit_metrics',
  name: 'Datadog Submit Metrics',
  description:
    'Submit custom metrics to Datadog. Use for tracking application performance, business metrics, or custom monitoring data.',
  version: '1.0.0',

  params: {
    series: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description:
        'JSON array of metric series to submit. Each series should include metric name, type (gauge/rate/count), points (timestamp/value pairs), and optional tags.',
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
      return `https://api.${site}/api/v2/series`
    },
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      'DD-API-KEY': params.apiKey,
    }),
    body: (params) => {
      let series: any[]
      try {
        series = typeof params.series === 'string' ? JSON.parse(params.series) : params.series
      } catch {
        throw new Error('Invalid JSON in series parameter')
      }

      // Transform to Datadog API v2 format
      const formattedSeries = series.map((s: any) => ({
        metric: s.metric,
        type: s.type === 'gauge' ? 0 : s.type === 'rate' ? 1 : s.type === 'count' ? 2 : 3,
        points: s.points.map((p: any) => ({
          timestamp: p.timestamp,
          value: p.value,
        })),
        tags: s.tags || [],
        unit: s.unit,
        resources: s.resources || [{ name: 'host', type: 'host' }],
      }))

      return { series: formattedSeries }
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        output: {
          success: false,
          errors: [errorData.errors?.[0] || `HTTP ${response.status}: ${response.statusText}`],
        },
        error: errorData.errors?.[0] || `HTTP ${response.status}: ${response.statusText}`,
      }
    }

    const data = await response.json().catch(() => ({}))
    return {
      success: true,
      output: {
        success: true,
        errors: data.errors || [],
      },
    }
  },

  outputs: {
    success: {
      type: 'boolean',
      description: 'Whether the metrics were submitted successfully',
    },
    errors: {
      type: 'array',
      description: 'Any errors that occurred during submission',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/datadog/types.ts

```typescript
// Common types for Datadog tools
import type { ToolResponse } from '@/tools/types'

// Datadog Site/Region options
export type DatadogSite =
  | 'datadoghq.com'
  | 'us3.datadoghq.com'
  | 'us5.datadoghq.com'
  | 'datadoghq.eu'
  | 'ap1.datadoghq.com'
  | 'ddog-gov.com'

// Base parameters for write-only operations (only need API key)
export interface DatadogWriteOnlyParams {
  apiKey: string
  site?: DatadogSite
}

// Base parameters for read/manage operations (need both API key and Application key)
export interface DatadogBaseParams extends DatadogWriteOnlyParams {
  applicationKey: string
}

// ========================
// METRICS TYPES
// ========================

export type MetricType = 'gauge' | 'rate' | 'count' | 'distribution'

export interface MetricPoint {
  timestamp: number
  value: number
}

export interface MetricSeries {
  metric: string
  type?: MetricType
  points: MetricPoint[]
  tags?: string[]
  unit?: string
  resources?: { name: string; type: string }[]
}

export interface SubmitMetricsParams extends DatadogWriteOnlyParams {
  series: string // JSON string of MetricSeries[]
}

export interface SubmitMetricsOutput {
  success: boolean
  errors?: string[]
}

export interface SubmitMetricsResponse extends ToolResponse {
  output: SubmitMetricsOutput
}

export interface QueryTimeseriesParams extends DatadogBaseParams {
  query: string
  from: number // Unix timestamp in seconds
  to: number // Unix timestamp in seconds
}

export interface TimeseriesPoint {
  timestamp: number
  value: number
}

export interface TimeseriesResult {
  metric: string
  tags: string[]
  points: TimeseriesPoint[]
}

export interface QueryTimeseriesOutput {
  series: TimeseriesResult[]
  status: string
}

export interface QueryTimeseriesResponse extends ToolResponse {
  output: QueryTimeseriesOutput
}

export interface ListMetricsParams extends DatadogBaseParams {
  from?: number // Unix timestamp - only return metrics active since this time
  host?: string // Filter by host name
  tags?: string // Filter by tags (comma-separated)
}

export interface ListMetricsOutput {
  metrics: string[]
}

export interface ListMetricsResponse extends ToolResponse {
  output: ListMetricsOutput
}

export interface GetMetricMetadataParams extends DatadogBaseParams {
  metricName: string
}

export interface MetricMetadata {
  description?: string
  short_name?: string
  unit?: string
  per_unit?: string
  type?: string
  integration?: string
}

export interface GetMetricMetadataOutput {
  metadata: MetricMetadata
}

export interface GetMetricMetadataResponse extends ToolResponse {
  output: GetMetricMetadataOutput
}

// ========================
// EVENTS TYPES
// ========================

export type EventAlertType =
  | 'error'
  | 'warning'
  | 'info'
  | 'success'
  | 'user_update'
  | 'recommendation'
  | 'snapshot'
export type EventPriority = 'normal' | 'low'

export interface CreateEventParams extends DatadogWriteOnlyParams {
  title: string
  text: string
  alertType?: EventAlertType
  priority?: EventPriority
  host?: string
  tags?: string // Comma-separated tags
  aggregationKey?: string
  sourceTypeName?: string
  dateHappened?: number // Unix timestamp
}

export interface EventData {
  id: number
  title: string
  text: string
  date_happened: number
  priority: string
  alert_type: string
  host?: string
  tags?: string[]
  url?: string
}

export interface CreateEventOutput {
  event: EventData
}

export interface CreateEventResponse extends ToolResponse {
  output: CreateEventOutput
}

export interface GetEventParams extends DatadogBaseParams {
  eventId: string
}

export interface GetEventOutput {
  event: EventData
}

export interface GetEventResponse extends ToolResponse {
  output: GetEventOutput
}

export interface QueryEventsParams extends DatadogBaseParams {
  start: number // Unix timestamp
  end: number // Unix timestamp
  priority?: EventPriority
  sources?: string // Comma-separated source names
  tags?: string // Comma-separated tags
  unaggregated?: boolean
  excludeAggregate?: boolean
  page?: number
}

export interface QueryEventsOutput {
  events: EventData[]
}

export interface QueryEventsResponse extends ToolResponse {
  output: QueryEventsOutput
}

// ========================
// MONITORS TYPES
// ========================

export type MonitorType =
  | 'metric alert'
  | 'service check'
  | 'event alert'
  | 'process alert'
  | 'log alert'
  | 'query alert'
  | 'composite'
  | 'synthetics alert'
  | 'trace-analytics alert'
  | 'slo alert'

export interface MonitorThresholds {
  critical?: number
  critical_recovery?: number
  warning?: number
  warning_recovery?: number
  ok?: number
}

export interface MonitorOptions {
  notify_no_data?: boolean
  no_data_timeframe?: number
  notify_audit?: boolean
  renotify_interval?: number
  escalation_message?: string
  thresholds?: MonitorThresholds
  include_tags?: boolean
  require_full_window?: boolean
  timeout_h?: number
  evaluation_delay?: number
  new_group_delay?: number
  min_location_failed?: number
}

export interface CreateMonitorParams extends DatadogBaseParams {
  name: string
  type: MonitorType
  query: string
  message?: string
  tags?: string // Comma-separated tags
  priority?: number // 1-5
  options?: string // JSON string of MonitorOptions
}

export interface MonitorData {
  id: number
  name: string
  type: string
  query: string
  message?: string
  tags?: string[]
  priority?: number
  options?: MonitorOptions
  overall_state?: string
  created?: string
  modified?: string
  creator?: { email: string; handle: string; name: string }
}

export interface CreateMonitorOutput {
  monitor: MonitorData
}

export interface CreateMonitorResponse extends ToolResponse {
  output: CreateMonitorOutput
}

export interface GetMonitorParams extends DatadogBaseParams {
  monitorId: string
  groupStates?: string // Comma-separated states: alert, warn, no data
  withDowntimes?: boolean
}

export interface GetMonitorOutput {
  monitor: MonitorData
}

export interface GetMonitorResponse extends ToolResponse {
  output: GetMonitorOutput
}

export interface UpdateMonitorParams extends DatadogBaseParams {
  monitorId: string
  name?: string
  query?: string
  message?: string
  tags?: string // Comma-separated tags
  priority?: number
  options?: string // JSON string of MonitorOptions
}

export interface UpdateMonitorOutput {
  monitor: MonitorData
}

export interface UpdateMonitorResponse extends ToolResponse {
  output: UpdateMonitorOutput
}

export interface DeleteMonitorParams extends DatadogBaseParams {
  monitorId: string
  force?: boolean
}

export interface DeleteMonitorOutput {
  deleted_monitor_id: number
}

export interface DeleteMonitorResponse extends ToolResponse {
  output: DeleteMonitorOutput
}

export interface ListMonitorsParams extends DatadogBaseParams {
  groupStates?: string // Comma-separated states
  name?: string // Filter by name
  tags?: string // Filter by tags (comma-separated)
  monitorTags?: string // Filter by monitor tags
  withDowntimes?: boolean
  idOffset?: number
  page?: number
  pageSize?: number
}

export interface ListMonitorsOutput {
  monitors: MonitorData[]
}

export interface ListMonitorsResponse extends ToolResponse {
  output: ListMonitorsOutput
}

export interface MuteMonitorParams extends DatadogBaseParams {
  monitorId: string
  scope?: string // Scope to mute (e.g., "host:myhost")
  end?: number // Unix timestamp when mute ends
}

export interface MuteMonitorOutput {
  success: boolean
}

export interface MuteMonitorResponse extends ToolResponse {
  output: MuteMonitorOutput
}

export interface UnmuteMonitorParams extends DatadogBaseParams {
  monitorId: string
  scope?: string
  allScopes?: boolean
}

export interface UnmuteMonitorOutput {
  success: boolean
}

export interface UnmuteMonitorResponse extends ToolResponse {
  output: UnmuteMonitorOutput
}

// ========================
// LOGS TYPES
// ========================

export interface LogEntry {
  ddsource?: string
  ddtags?: string
  hostname?: string
  message: string
  service?: string
}

export interface SendLogsParams extends DatadogWriteOnlyParams {
  logs: string // JSON string of LogEntry[]
}

export interface SendLogsOutput {
  success: boolean
}

export interface SendLogsResponse extends ToolResponse {
  output: SendLogsOutput
}

export interface QueryLogsParams extends DatadogBaseParams {
  query: string
  from: string // ISO-8601 or relative (now-1h)
  to: string // ISO-8601 or relative (now)
  limit?: number
  sort?: 'timestamp' | '-timestamp'
  indexes?: string // Comma-separated index names
}

export interface LogData {
  id: string
  content: {
    timestamp: string
    host?: string
    service?: string
    message: string
    status?: string
    attributes?: Record<string, any>
    tags?: string[]
  }
}

export interface QueryLogsOutput {
  logs: LogData[]
  nextLogId?: string
}

export interface QueryLogsResponse extends ToolResponse {
  output: QueryLogsOutput
}

// ========================
// DOWNTIME TYPES
// ========================

export interface CreateDowntimeParams extends DatadogBaseParams {
  scope: string // Scope to apply downtime (e.g., "host:myhost" or "*")
  message?: string
  start?: number // Unix timestamp, defaults to now
  end?: number // Unix timestamp
  timezone?: string
  monitorId?: string // Monitor ID to mute
  monitorTags?: string // Comma-separated tags to match monitors
  muteFirstRecoveryNotification?: boolean
  notifyEndTypes?: string // Comma-separated: "canceled", "expired"
  recurrence?: string // JSON string of recurrence config
}

export interface DowntimeData {
  id: number
  scope: string[]
  message?: string
  start?: number
  end?: number
  timezone?: string
  monitor_id?: number
  monitor_tags?: string[]
  mute_first_recovery_notification?: boolean
  disabled?: boolean
  created?: number
  modified?: number
  creator_id?: number
  canceled?: number
  active?: boolean
}

export interface CreateDowntimeOutput {
  downtime: DowntimeData
}

export interface CreateDowntimeResponse extends ToolResponse {
  output: CreateDowntimeOutput
}

export interface ListDowntimesParams extends DatadogBaseParams {
  currentOnly?: boolean
  withCreator?: boolean
  monitorId?: string
}

export interface ListDowntimesOutput {
  downtimes: DowntimeData[]
}

export interface ListDowntimesResponse extends ToolResponse {
  output: ListDowntimesOutput
}

export interface CancelDowntimeParams extends DatadogBaseParams {
  downtimeId: string
}

export interface CancelDowntimeOutput {
  success: boolean
}

export interface CancelDowntimeResponse extends ToolResponse {
  output: CancelDowntimeOutput
}

// ========================
// SLO TYPES
// ========================

export type SloType = 'metric' | 'monitor' | 'time_slice'

export interface SloThreshold {
  timeframe: '7d' | '30d' | '90d' | 'custom'
  target: number // Target percentage (e.g., 99.9)
  target_display?: string
  warning?: number
  warning_display?: string
}

export interface CreateSloParams extends DatadogBaseParams {
  name: string
  type: SloType
  description?: string
  tags?: string // Comma-separated tags
  thresholds: string // JSON string of SloThreshold[]
  // For metric-based SLO
  query?: string // JSON string of { numerator: string, denominator: string }
  // For monitor-based SLO
  monitorIds?: string // Comma-separated monitor IDs
  groups?: string // Comma-separated group names
}

export interface SloData {
  id: string
  name: string
  type: string
  description?: string
  tags?: string[]
  thresholds: SloThreshold[]
  creator?: { email: string; handle: string; name: string }
  created_at?: number
  modified_at?: number
}

export interface CreateSloOutput {
  slo: SloData
}

export interface CreateSloResponse extends ToolResponse {
  output: CreateSloOutput
}

export interface GetSloHistoryParams extends DatadogBaseParams {
  sloId: string
  fromTs: number // Unix timestamp
  toTs: number // Unix timestamp
  target?: number // Target SLO percentage
}

export interface SloHistoryData {
  from_ts: number
  to_ts: number
  type: string
  type_id: number
  sli_value?: number
  overall: {
    name: string
    sli_value: number
    span_precision: number
    precision: { [key: string]: number }
  }
  series?: {
    times: number[]
    values: number[]
  }
}

export interface GetSloHistoryOutput {
  history: SloHistoryData
}

export interface GetSloHistoryResponse extends ToolResponse {
  output: GetSloHistoryOutput
}

// ========================
// DASHBOARD TYPES
// ========================

export type DashboardLayoutType = 'ordered' | 'free'

export interface CreateDashboardParams extends DatadogBaseParams {
  title: string
  layoutType: DashboardLayoutType
  description?: string
  widgets?: string // JSON string of widget definitions
  isReadOnly?: boolean
  notifyList?: string // Comma-separated user handles to notify
  templateVariables?: string // JSON string of template variable definitions
  tags?: string // Comma-separated tags
}

export interface DashboardData {
  id: string
  title: string
  layout_type: string
  description?: string
  url?: string
  author_handle?: string
  created_at?: string
  modified_at?: string
  is_read_only?: boolean
  tags?: string[]
}

export interface CreateDashboardOutput {
  dashboard: DashboardData
}

export interface CreateDashboardResponse extends ToolResponse {
  output: CreateDashboardOutput
}

export interface GetDashboardParams extends DatadogBaseParams {
  dashboardId: string
}

export interface GetDashboardOutput {
  dashboard: DashboardData
}

export interface GetDashboardResponse extends ToolResponse {
  output: GetDashboardOutput
}

export interface ListDashboardsParams extends DatadogBaseParams {
  filterShared?: boolean
  filterDeleted?: boolean
  count?: number
  start?: number
}

export interface DashboardSummary {
  id: string
  title: string
  description?: string
  layout_type: string
  url?: string
  author_handle?: string
  created_at?: string
  modified_at?: string
  is_read_only?: boolean
  popularity?: number
}

export interface ListDashboardsOutput {
  dashboards: DashboardSummary[]
  total?: number
}

export interface ListDashboardsResponse extends ToolResponse {
  output: ListDashboardsOutput
}

// ========================
// HOSTS TYPES
// ========================

export interface ListHostsParams extends DatadogBaseParams {
  filter?: string // Filter hosts by name, alias, or tag
  sortField?: string // Field to sort by
  sortDir?: 'asc' | 'desc'
  start?: number // Starting offset
  count?: number // Max hosts to return
  from?: number // Unix timestamp - hosts seen in last N seconds
  includeMutedHostsData?: boolean
  includeHostsMetadata?: boolean
}

export interface HostData {
  name: string
  id: number
  aliases?: string[]
  apps?: string[]
  aws_name?: string
  host_name?: string
  is_muted?: boolean
  last_reported_time?: number
  meta?: {
    agent_version?: string
    cpu_cores?: number
    gohai?: string
    machine?: string
    platform?: string
  }
  metrics?: {
    cpu?: number
    iowait?: number
    load?: number
  }
  mute_timeout?: number
  sources?: string[]
  tags_by_source?: Record<string, string[]>
  up?: boolean
}

export interface ListHostsOutput {
  hosts: HostData[]
  total_matching?: number
  total_returned?: number
}

export interface ListHostsResponse extends ToolResponse {
  output: ListHostsOutput
}

// ========================
// INCIDENTS TYPES
// ========================

export type IncidentSeverity = 'SEV-1' | 'SEV-2' | 'SEV-3' | 'SEV-4' | 'SEV-5' | 'UNKNOWN'
export type IncidentState = 'active' | 'stable' | 'resolved'

export interface CreateIncidentParams extends DatadogBaseParams {
  title: string
  customerImpacted: boolean
  severity?: IncidentSeverity
  fields?: string // JSON string of additional fields
}

export interface IncidentData {
  id: string
  type: string
  attributes: {
    title: string
    customer_impacted: boolean
    severity?: IncidentSeverity
    state?: IncidentState
    created?: string
    modified?: string
    resolved?: string
    detected?: string
    customer_impact_scope?: string
    customer_impact_start?: string
    customer_impact_end?: string
    public_id?: number
    time_to_detect?: number
    time_to_internal_response?: number
    time_to_repair?: number
    time_to_resolve?: number
  }
}

export interface CreateIncidentOutput {
  incident: IncidentData
}

export interface CreateIncidentResponse extends ToolResponse {
  output: CreateIncidentOutput
}

export interface ListIncidentsParams extends DatadogBaseParams {
  query?: string
  pageSize?: number
  pageOffset?: number
  include?: string // Comma-separated: users, attachments
}

export interface ListIncidentsOutput {
  incidents: IncidentData[]
}

export interface ListIncidentsResponse extends ToolResponse {
  output: ListIncidentsOutput
}

// Union type for all Datadog responses
export type DatadogResponse =
  | SubmitMetricsResponse
  | QueryTimeseriesResponse
  | ListMetricsResponse
  | GetMetricMetadataResponse
  | CreateEventResponse
  | GetEventResponse
  | QueryEventsResponse
  | CreateMonitorResponse
  | GetMonitorResponse
  | UpdateMonitorResponse
  | DeleteMonitorResponse
  | ListMonitorsResponse
  | MuteMonitorResponse
  | UnmuteMonitorResponse
  | SendLogsResponse
  | QueryLogsResponse
  | CreateDowntimeResponse
  | ListDowntimesResponse
  | CancelDowntimeResponse
  | CreateSloResponse
  | GetSloHistoryResponse
  | CreateDashboardResponse
  | GetDashboardResponse
  | ListDashboardsResponse
  | ListHostsResponse
  | CreateIncidentResponse
  | ListIncidentsResponse
```

--------------------------------------------------------------------------------

````
