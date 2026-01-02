---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 686
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 686 of 933)

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

---[FILE: list_alert_rules.ts]---
Location: sim-main/apps/sim/tools/grafana/list_alert_rules.ts

```typescript
import type {
  GrafanaListAlertRulesParams,
  GrafanaListAlertRulesResponse,
} from '@/tools/grafana/types'
import type { ToolConfig } from '@/tools/types'

export const listAlertRulesTool: ToolConfig<
  GrafanaListAlertRulesParams,
  GrafanaListAlertRulesResponse
> = {
  id: 'grafana_list_alert_rules',
  name: 'Grafana List Alert Rules',
  description: 'List all alert rules in the Grafana instance',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Grafana Service Account Token',
    },
    baseUrl: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Grafana instance URL (e.g., https://your-grafana.com)',
    },
    organizationId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Organization ID for multi-org Grafana instances',
    },
  },

  request: {
    url: (params) => `${params.baseUrl.replace(/\/$/, '')}/api/v1/provisioning/alert-rules`,
    method: 'GET',
    headers: (params) => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.apiKey}`,
      }
      if (params.organizationId) {
        headers['X-Grafana-Org-Id'] = params.organizationId
      }
      return headers
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        rules: Array.isArray(data)
          ? data.map((rule: any) => ({
              uid: rule.uid,
              title: rule.title,
              condition: rule.condition,
              data: rule.data,
              updated: rule.updated,
              noDataState: rule.noDataState,
              execErrState: rule.execErrState,
              for: rule.for,
              annotations: rule.annotations || {},
              labels: rule.labels || {},
              isPaused: rule.isPaused || false,
              folderUID: rule.folderUID,
              ruleGroup: rule.ruleGroup,
              orgId: rule.orgId,
              namespace_uid: rule.namespace_uid,
              namespace_id: rule.namespace_id,
              provenance: rule.provenance || '',
            }))
          : [],
      },
    }
  },

  outputs: {
    rules: {
      type: 'array',
      description: 'List of alert rules',
      items: {
        type: 'object',
        properties: {
          uid: { type: 'string', description: 'Alert rule UID' },
          title: { type: 'string', description: 'Alert rule title' },
          condition: { type: 'string', description: 'Alert condition' },
          folderUID: { type: 'string', description: 'Parent folder UID' },
          ruleGroup: { type: 'string', description: 'Rule group name' },
          noDataState: { type: 'string', description: 'State when no data is returned' },
          execErrState: { type: 'string', description: 'State on execution error' },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_annotations.ts]---
Location: sim-main/apps/sim/tools/grafana/list_annotations.ts

```typescript
import type {
  GrafanaListAnnotationsParams,
  GrafanaListAnnotationsResponse,
} from '@/tools/grafana/types'
import type { ToolConfig } from '@/tools/types'

export const listAnnotationsTool: ToolConfig<
  GrafanaListAnnotationsParams,
  GrafanaListAnnotationsResponse
> = {
  id: 'grafana_list_annotations',
  name: 'Grafana List Annotations',
  description: 'Query annotations by time range, dashboard, or tags',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Grafana Service Account Token',
    },
    baseUrl: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Grafana instance URL (e.g., https://your-grafana.com)',
    },
    organizationId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Organization ID for multi-org Grafana instances',
    },
    from: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Start time in epoch milliseconds',
    },
    to: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'End time in epoch milliseconds',
    },
    dashboardUid: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Dashboard UID to query annotations from',
    },
    panelId: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by panel ID',
    },
    tags: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Comma-separated list of tags to filter by',
    },
    type: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Filter by type (alert or annotation)',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Maximum number of annotations to return',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = params.baseUrl.replace(/\/$/, '')
      const searchParams = new URLSearchParams()

      if (params.from) searchParams.set('from', String(params.from))
      if (params.to) searchParams.set('to', String(params.to))
      if (params.dashboardUid) searchParams.set('dashboardUID', params.dashboardUid)
      if (params.panelId) searchParams.set('panelId', String(params.panelId))
      if (params.tags) {
        params.tags.split(',').forEach((t) => searchParams.append('tags', t.trim()))
      }
      if (params.type) searchParams.set('type', params.type)
      if (params.limit) searchParams.set('limit', String(params.limit))

      const queryString = searchParams.toString()
      return `${baseUrl}/api/annotations${queryString ? `?${queryString}` : ''}`
    },
    method: 'GET',
    headers: (params) => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.apiKey}`,
      }
      if (params.organizationId) {
        headers['X-Grafana-Org-Id'] = params.organizationId
      }
      return headers
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        annotations: Array.isArray(data)
          ? data.map((a: any) => ({
              id: a.id,
              alertId: a.alertId,
              alertName: a.alertName,
              dashboardId: a.dashboardId,
              dashboardUID: a.dashboardUID,
              panelId: a.panelId,
              userId: a.userId,
              newState: a.newState,
              prevState: a.prevState,
              created: a.created,
              updated: a.updated,
              time: a.time,
              timeEnd: a.timeEnd,
              text: a.text,
              tags: a.tags || [],
              login: a.login,
              email: a.email,
              avatarUrl: a.avatarUrl,
              data: a.data,
            }))
          : [],
      },
    }
  },

  outputs: {
    annotations: {
      type: 'array',
      description: 'List of annotations',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', description: 'Annotation ID' },
          text: { type: 'string', description: 'Annotation text' },
          tags: { type: 'array', description: 'Annotation tags' },
          time: { type: 'number', description: 'Start time in epoch ms' },
          timeEnd: { type: 'number', description: 'End time in epoch ms' },
          dashboardUID: { type: 'string', description: 'Dashboard UID' },
          panelId: { type: 'number', description: 'Panel ID' },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_contact_points.ts]---
Location: sim-main/apps/sim/tools/grafana/list_contact_points.ts

```typescript
import type {
  GrafanaListContactPointsParams,
  GrafanaListContactPointsResponse,
} from '@/tools/grafana/types'
import type { ToolConfig } from '@/tools/types'

export const listContactPointsTool: ToolConfig<
  GrafanaListContactPointsParams,
  GrafanaListContactPointsResponse
> = {
  id: 'grafana_list_contact_points',
  name: 'Grafana List Contact Points',
  description: 'List all alert notification contact points',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Grafana Service Account Token',
    },
    baseUrl: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Grafana instance URL (e.g., https://your-grafana.com)',
    },
    organizationId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Organization ID for multi-org Grafana instances',
    },
  },

  request: {
    url: (params) => `${params.baseUrl.replace(/\/$/, '')}/api/v1/provisioning/contact-points`,
    method: 'GET',
    headers: (params) => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.apiKey}`,
      }
      if (params.organizationId) {
        headers['X-Grafana-Org-Id'] = params.organizationId
      }
      return headers
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        contactPoints: Array.isArray(data)
          ? data.map((cp: any) => ({
              uid: cp.uid,
              name: cp.name,
              type: cp.type,
              settings: cp.settings || {},
              disableResolveMessage: cp.disableResolveMessage || false,
              provenance: cp.provenance || '',
            }))
          : [],
      },
    }
  },

  outputs: {
    contactPoints: {
      type: 'array',
      description: 'List of contact points',
      items: {
        type: 'object',
        properties: {
          uid: { type: 'string', description: 'Contact point UID' },
          name: { type: 'string', description: 'Contact point name' },
          type: { type: 'string', description: 'Notification type (email, slack, etc.)' },
          settings: { type: 'object', description: 'Type-specific settings' },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_dashboards.ts]---
Location: sim-main/apps/sim/tools/grafana/list_dashboards.ts

```typescript
import type {
  GrafanaListDashboardsParams,
  GrafanaListDashboardsResponse,
} from '@/tools/grafana/types'
import type { ToolConfig } from '@/tools/types'

export const listDashboardsTool: ToolConfig<
  GrafanaListDashboardsParams,
  GrafanaListDashboardsResponse
> = {
  id: 'grafana_list_dashboards',
  name: 'Grafana List Dashboards',
  description: 'Search and list all dashboards',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Grafana Service Account Token',
    },
    baseUrl: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Grafana instance URL (e.g., https://your-grafana.com)',
    },
    organizationId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Organization ID for multi-org Grafana instances',
    },
    query: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Search query to filter dashboards by title',
    },
    tag: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by tag (comma-separated for multiple tags)',
    },
    folderIds: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Filter by folder IDs (comma-separated)',
    },
    starred: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Only return starred dashboards',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Maximum number of dashboards to return',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = params.baseUrl.replace(/\/$/, '')
      const searchParams = new URLSearchParams()
      searchParams.set('type', 'dash-db')

      if (params.query) searchParams.set('query', params.query)
      if (params.tag) {
        params.tag.split(',').forEach((t) => searchParams.append('tag', t.trim()))
      }
      if (params.folderIds) {
        params.folderIds.split(',').forEach((id) => searchParams.append('folderIds', id.trim()))
      }
      if (params.starred) searchParams.set('starred', 'true')
      if (params.limit) searchParams.set('limit', String(params.limit))

      return `${baseUrl}/api/search?${searchParams.toString()}`
    },
    method: 'GET',
    headers: (params) => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.apiKey}`,
      }
      if (params.organizationId) {
        headers['X-Grafana-Org-Id'] = params.organizationId
      }
      return headers
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        dashboards: Array.isArray(data)
          ? data.map((d: any) => ({
              id: d.id,
              uid: d.uid,
              title: d.title,
              uri: d.uri,
              url: d.url,
              slug: d.slug,
              type: d.type,
              tags: d.tags || [],
              isStarred: d.isStarred || false,
              folderId: d.folderId,
              folderUid: d.folderUid,
              folderTitle: d.folderTitle,
              folderUrl: d.folderUrl,
              sortMeta: d.sortMeta,
            }))
          : [],
      },
    }
  },

  outputs: {
    dashboards: {
      type: 'array',
      description: 'List of dashboard search results',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', description: 'Dashboard ID' },
          uid: { type: 'string', description: 'Dashboard UID' },
          title: { type: 'string', description: 'Dashboard title' },
          url: { type: 'string', description: 'Dashboard URL path' },
          tags: { type: 'array', description: 'Dashboard tags' },
          folderTitle: { type: 'string', description: 'Parent folder title' },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_data_sources.ts]---
Location: sim-main/apps/sim/tools/grafana/list_data_sources.ts

```typescript
import type {
  GrafanaListDataSourcesParams,
  GrafanaListDataSourcesResponse,
} from '@/tools/grafana/types'
import type { ToolConfig } from '@/tools/types'

export const listDataSourcesTool: ToolConfig<
  GrafanaListDataSourcesParams,
  GrafanaListDataSourcesResponse
> = {
  id: 'grafana_list_data_sources',
  name: 'Grafana List Data Sources',
  description: 'List all data sources configured in Grafana',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Grafana Service Account Token',
    },
    baseUrl: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Grafana instance URL (e.g., https://your-grafana.com)',
    },
    organizationId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Organization ID for multi-org Grafana instances',
    },
  },

  request: {
    url: (params) => `${params.baseUrl.replace(/\/$/, '')}/api/datasources`,
    method: 'GET',
    headers: (params) => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.apiKey}`,
      }
      if (params.organizationId) {
        headers['X-Grafana-Org-Id'] = params.organizationId
      }
      return headers
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        dataSources: Array.isArray(data)
          ? data.map((ds: any) => ({
              id: ds.id,
              uid: ds.uid,
              orgId: ds.orgId,
              name: ds.name,
              type: ds.type,
              typeName: ds.typeName,
              typeLogoUrl: ds.typeLogoUrl,
              access: ds.access,
              url: ds.url,
              user: ds.user,
              database: ds.database,
              basicAuth: ds.basicAuth || false,
              isDefault: ds.isDefault || false,
              jsonData: ds.jsonData || {},
              readOnly: ds.readOnly || false,
            }))
          : [],
      },
    }
  },

  outputs: {
    dataSources: {
      type: 'array',
      description: 'List of data sources',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', description: 'Data source ID' },
          uid: { type: 'string', description: 'Data source UID' },
          name: { type: 'string', description: 'Data source name' },
          type: { type: 'string', description: 'Data source type (prometheus, mysql, etc.)' },
          url: { type: 'string', description: 'Data source URL' },
          isDefault: { type: 'boolean', description: 'Whether this is the default data source' },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_folders.ts]---
Location: sim-main/apps/sim/tools/grafana/list_folders.ts

```typescript
import type { GrafanaListFoldersParams, GrafanaListFoldersResponse } from '@/tools/grafana/types'
import type { ToolConfig } from '@/tools/types'

export const listFoldersTool: ToolConfig<GrafanaListFoldersParams, GrafanaListFoldersResponse> = {
  id: 'grafana_list_folders',
  name: 'Grafana List Folders',
  description: 'List all folders in Grafana',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Grafana Service Account Token',
    },
    baseUrl: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Grafana instance URL (e.g., https://your-grafana.com)',
    },
    organizationId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Organization ID for multi-org Grafana instances',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Maximum number of folders to return',
    },
    page: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Page number for pagination',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = params.baseUrl.replace(/\/$/, '')
      const searchParams = new URLSearchParams()

      if (params.limit) searchParams.set('limit', String(params.limit))
      if (params.page) searchParams.set('page', String(params.page))

      const queryString = searchParams.toString()
      return `${baseUrl}/api/folders${queryString ? `?${queryString}` : ''}`
    },
    method: 'GET',
    headers: (params) => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.apiKey}`,
      }
      if (params.organizationId) {
        headers['X-Grafana-Org-Id'] = params.organizationId
      }
      return headers
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        folders: Array.isArray(data)
          ? data.map((f: any) => ({
              id: f.id,
              uid: f.uid,
              title: f.title,
              url: f.url,
              hasAcl: f.hasAcl || false,
              canSave: f.canSave || false,
              canEdit: f.canEdit || false,
              canAdmin: f.canAdmin || false,
              canDelete: f.canDelete || false,
              createdBy: f.createdBy || '',
              created: f.created || '',
              updatedBy: f.updatedBy || '',
              updated: f.updated || '',
              version: f.version || 0,
            }))
          : [],
      },
    }
  },

  outputs: {
    folders: {
      type: 'array',
      description: 'List of folders',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', description: 'Folder ID' },
          uid: { type: 'string', description: 'Folder UID' },
          title: { type: 'string', description: 'Folder title' },
          url: { type: 'string', description: 'Folder URL path' },
          hasAcl: { type: 'boolean', description: 'Whether the folder has custom ACL permissions' },
          canSave: { type: 'boolean', description: 'Whether the current user can save the folder' },
          canEdit: { type: 'boolean', description: 'Whether the current user can edit the folder' },
          canAdmin: { type: 'boolean', description: 'Whether the current user has admin rights' },
          canDelete: {
            type: 'boolean',
            description: 'Whether the current user can delete the folder',
          },
          createdBy: { type: 'string', description: 'Username of who created the folder' },
          created: { type: 'string', description: 'Timestamp when the folder was created' },
          updatedBy: { type: 'string', description: 'Username of who last updated the folder' },
          updated: { type: 'string', description: 'Timestamp when the folder was last updated' },
          version: { type: 'number', description: 'Version number of the folder' },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/grafana/types.ts

```typescript
// Common types for Grafana API tools
import type { ToolResponse } from '@/tools/types'

// Common parameters for all Grafana tools
export interface GrafanaBaseParams {
  apiKey: string
  baseUrl: string
  organizationId?: string
}

// Health Check types
export interface GrafanaHealthCheckParams extends GrafanaBaseParams {}

export interface GrafanaHealthCheckResponse extends ToolResponse {
  output: {
    commit: string
    database: string
    version: string
  }
}

export interface GrafanaDataSourceHealthParams extends GrafanaBaseParams {
  dataSourceId: string
}

export interface GrafanaDataSourceHealthResponse extends ToolResponse {
  output: {
    status: string
    message: string
  }
}

// Dashboard types
export interface GrafanaGetDashboardParams extends GrafanaBaseParams {
  dashboardUid: string
}

export interface GrafanaDashboardMeta {
  type: string
  canSave: boolean
  canEdit: boolean
  canAdmin: boolean
  canStar: boolean
  canDelete: boolean
  slug: string
  url: string
  expires: string
  created: string
  updated: string
  updatedBy: string
  createdBy: string
  version: number
  hasAcl: boolean
  isFolder: boolean
  folderId: number
  folderUid: string
  folderTitle: string
  folderUrl: string
  provisioned: boolean
  provisionedExternalId: string
}

export interface GrafanaDashboard {
  id: number
  uid: string
  title: string
  tags: string[]
  timezone: string
  schemaVersion: number
  version: number
  refresh: string
  panels: any[]
  templating: any
  annotations: any
  time: {
    from: string
    to: string
  }
}

export interface GrafanaGetDashboardResponse extends ToolResponse {
  output: {
    dashboard: GrafanaDashboard
    meta: GrafanaDashboardMeta
  }
}

export interface GrafanaListDashboardsParams extends GrafanaBaseParams {
  query?: string
  tag?: string
  folderIds?: string
  starred?: boolean
  limit?: number
}

export interface GrafanaDashboardSearchResult {
  id: number
  uid: string
  title: string
  uri: string
  url: string
  slug: string
  type: string
  tags: string[]
  isStarred: boolean
  folderId: number
  folderUid: string
  folderTitle: string
  folderUrl: string
  sortMeta: number
}

export interface GrafanaListDashboardsResponse extends ToolResponse {
  output: {
    dashboards: GrafanaDashboardSearchResult[]
  }
}

export interface GrafanaCreateDashboardParams extends GrafanaBaseParams {
  title: string
  folderUid?: string
  tags?: string
  timezone?: string
  refresh?: string
  panels?: string // JSON string of panels array
  overwrite?: boolean
  message?: string
}

export interface GrafanaCreateDashboardResponse extends ToolResponse {
  output: {
    id: number
    uid: string
    url: string
    status: string
    version: number
    slug: string
  }
}

export interface GrafanaUpdateDashboardParams extends GrafanaBaseParams {
  dashboardUid: string
  title?: string
  folderUid?: string
  tags?: string
  timezone?: string
  refresh?: string
  panels?: string // JSON string of panels array
  overwrite?: boolean
  message?: string
}

export interface GrafanaUpdateDashboardResponse extends ToolResponse {
  output: {
    id: number
    uid: string
    url: string
    status: string
    version: number
    slug: string
  }
}

export interface GrafanaDeleteDashboardParams extends GrafanaBaseParams {
  dashboardUid: string
}

export interface GrafanaDeleteDashboardResponse extends ToolResponse {
  output: {
    title: string
    message: string
    id: number
  }
}

// Alert Rule types
export interface GrafanaListAlertRulesParams extends GrafanaBaseParams {}

export interface GrafanaAlertRule {
  uid: string
  title: string
  condition: string
  data: any[]
  updated: string
  noDataState: string
  execErrState: string
  for: string
  annotations: Record<string, string>
  labels: Record<string, string>
  isPaused: boolean
  folderUID: string
  ruleGroup: string
  orgId: number
  namespace_uid: string
  namespace_id: number
  provenance: string
}

export interface GrafanaListAlertRulesResponse extends ToolResponse {
  output: {
    rules: GrafanaAlertRule[]
  }
}

export interface GrafanaGetAlertRuleParams extends GrafanaBaseParams {
  alertRuleUid: string
}

export interface GrafanaGetAlertRuleResponse extends ToolResponse {
  output: GrafanaAlertRule
}

export interface GrafanaCreateAlertRuleParams extends GrafanaBaseParams {
  title: string
  folderUid: string
  ruleGroup: string
  condition: string
  data: string // JSON string of data array
  forDuration?: string
  noDataState?: string
  execErrState?: string
  annotations?: string // JSON string
  labels?: string // JSON string
}

export interface GrafanaCreateAlertRuleResponse extends ToolResponse {
  output: GrafanaAlertRule
}

export interface GrafanaUpdateAlertRuleParams extends GrafanaBaseParams {
  alertRuleUid: string
  title?: string
  folderUid?: string
  ruleGroup?: string
  condition?: string
  data?: string // JSON string of data array
  forDuration?: string
  noDataState?: string
  execErrState?: string
  annotations?: string // JSON string
  labels?: string // JSON string
}

export interface GrafanaUpdateAlertRuleResponse extends ToolResponse {
  output: GrafanaAlertRule
}

export interface GrafanaDeleteAlertRuleParams extends GrafanaBaseParams {
  alertRuleUid: string
}

export interface GrafanaDeleteAlertRuleResponse extends ToolResponse {
  output: {
    message: string
  }
}

// Annotation types
export interface GrafanaCreateAnnotationParams extends GrafanaBaseParams {
  text: string
  tags?: string // comma-separated
  dashboardUid?: string
  panelId?: number
  time?: number // epoch ms
  timeEnd?: number // epoch ms
}

export interface GrafanaAnnotation {
  id: number
  alertId: number
  alertName: string
  dashboardId: number
  dashboardUID: string
  panelId: number
  userId: number
  newState: string
  prevState: string
  created: number
  updated: number
  time: number
  timeEnd: number
  text: string
  tags: string[]
  login: string
  email: string
  avatarUrl: string
  data: any
}

export interface GrafanaCreateAnnotationResponse extends ToolResponse {
  output: {
    id: number
    message: string
  }
}

export interface GrafanaListAnnotationsParams extends GrafanaBaseParams {
  from?: number
  to?: number
  dashboardUid?: string
  panelId?: number
  tags?: string // comma-separated
  type?: string
  limit?: number
}

export interface GrafanaListAnnotationsResponse extends ToolResponse {
  output: {
    annotations: GrafanaAnnotation[]
  }
}

export interface GrafanaUpdateAnnotationParams extends GrafanaBaseParams {
  annotationId: number
  text: string
  tags?: string // comma-separated
  time?: number
  timeEnd?: number
}

export interface GrafanaUpdateAnnotationResponse extends ToolResponse {
  output: {
    id: number
    message: string
  }
}

export interface GrafanaDeleteAnnotationParams extends GrafanaBaseParams {
  annotationId: number
}

export interface GrafanaDeleteAnnotationResponse extends ToolResponse {
  output: {
    message: string
  }
}

// Data Source types
export interface GrafanaListDataSourcesParams extends GrafanaBaseParams {}

export interface GrafanaDataSource {
  id: number
  uid: string
  orgId: number
  name: string
  type: string
  typeName: string
  typeLogoUrl: string
  access: string
  url: string
  user: string
  database: string
  basicAuth: boolean
  isDefault: boolean
  jsonData: any
  readOnly: boolean
}

export interface GrafanaListDataSourcesResponse extends ToolResponse {
  output: {
    dataSources: GrafanaDataSource[]
  }
}

export interface GrafanaGetDataSourceParams extends GrafanaBaseParams {
  dataSourceId: string
}

export interface GrafanaGetDataSourceResponse extends ToolResponse {
  output: GrafanaDataSource
}

// Folder types
export interface GrafanaListFoldersParams extends GrafanaBaseParams {
  limit?: number
  page?: number
}

export interface GrafanaFolder {
  id: number
  uid: string
  title: string
  url: string
  hasAcl: boolean
  canSave: boolean
  canEdit: boolean
  canAdmin: boolean
  canDelete: boolean
  createdBy: string
  created: string
  updatedBy: string
  updated: string
  version: number
}

export interface GrafanaListFoldersResponse extends ToolResponse {
  output: {
    folders: GrafanaFolder[]
  }
}

export interface GrafanaCreateFolderParams extends GrafanaBaseParams {
  title: string
  uid?: string
}

export interface GrafanaCreateFolderResponse extends ToolResponse {
  output: GrafanaFolder
}

// Contact Points types
export interface GrafanaListContactPointsParams extends GrafanaBaseParams {}

export interface GrafanaContactPoint {
  uid: string
  name: string
  type: string
  settings: Record<string, any>
  disableResolveMessage: boolean
  provenance: string
}

export interface GrafanaListContactPointsResponse extends ToolResponse {
  output: {
    contactPoints: GrafanaContactPoint[]
  }
}

// Union type for all Grafana responses
export type GrafanaResponse =
  | GrafanaHealthCheckResponse
  | GrafanaDataSourceHealthResponse
  | GrafanaGetDashboardResponse
  | GrafanaListDashboardsResponse
  | GrafanaCreateDashboardResponse
  | GrafanaUpdateDashboardResponse
  | GrafanaDeleteDashboardResponse
  | GrafanaListAlertRulesResponse
  | GrafanaGetAlertRuleResponse
  | GrafanaCreateAlertRuleResponse
  | GrafanaUpdateAlertRuleResponse
  | GrafanaDeleteAlertRuleResponse
  | GrafanaCreateAnnotationResponse
  | GrafanaListAnnotationsResponse
  | GrafanaUpdateAnnotationResponse
  | GrafanaDeleteAnnotationResponse
  | GrafanaListDataSourcesResponse
  | GrafanaGetDataSourceResponse
  | GrafanaListFoldersResponse
  | GrafanaCreateFolderResponse
  | GrafanaListContactPointsResponse
```

--------------------------------------------------------------------------------

---[FILE: update_alert_rule.ts]---
Location: sim-main/apps/sim/tools/grafana/update_alert_rule.ts

```typescript
import type { GrafanaUpdateAlertRuleParams } from '@/tools/grafana/types'
import type { ToolConfig, ToolResponse } from '@/tools/types'

// Using ToolResponse for intermediate state since this tool fetches existing data first
export const updateAlertRuleTool: ToolConfig<GrafanaUpdateAlertRuleParams, ToolResponse> = {
  id: 'grafana_update_alert_rule',
  name: 'Grafana Update Alert Rule',
  description: 'Update an existing alert rule. Fetches the current rule and merges your changes.',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Grafana Service Account Token',
    },
    baseUrl: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Grafana instance URL (e.g., https://your-grafana.com)',
    },
    organizationId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Organization ID for multi-org Grafana instances',
    },
    alertRuleUid: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The UID of the alert rule to update',
    },
    title: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New title for the alert rule',
    },
    folderUid: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New folder UID to move the alert to',
    },
    ruleGroup: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New rule group name',
    },
    condition: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New condition refId',
    },
    data: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New JSON array of query/expression data objects',
    },
    forDuration: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Duration to wait before firing (e.g., 5m, 1h)',
    },
    noDataState: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'State when no data is returned (NoData, Alerting, OK)',
    },
    execErrState: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'State on execution error (Alerting, OK)',
    },
    annotations: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'JSON object of annotations',
    },
    labels: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'JSON object of labels',
    },
  },

  request: {
    // First, GET the existing alert rule
    url: (params) =>
      `${params.baseUrl.replace(/\/$/, '')}/api/v1/provisioning/alert-rules/${params.alertRuleUid}`,
    method: 'GET',
    headers: (params) => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.apiKey}`,
      }
      if (params.organizationId) {
        headers['X-Grafana-Org-Id'] = params.organizationId
      }
      return headers
    },
  },

  transformResponse: async (response: Response) => {
    // Store the existing rule data for postProcess to use
    const data = await response.json()
    return {
      success: true,
      output: {
        _existingRule: data,
      },
    }
  },

  postProcess: async (result, params) => {
    // Merge user changes with existing rule and PUT the complete object
    const existingRule = result.output._existingRule

    if (!existingRule || !existingRule.uid) {
      return {
        success: false,
        output: {},
        error: 'Failed to fetch existing alert rule',
      }
    }

    // Build the updated rule by merging existing data with new params
    const updatedRule: Record<string, any> = {
      ...existingRule,
    }

    // Apply user's changes
    if (params.title) updatedRule.title = params.title
    if (params.folderUid) updatedRule.folderUID = params.folderUid
    if (params.ruleGroup) updatedRule.ruleGroup = params.ruleGroup
    if (params.condition) updatedRule.condition = params.condition
    if (params.forDuration) updatedRule.for = params.forDuration
    if (params.noDataState) updatedRule.noDataState = params.noDataState
    if (params.execErrState) updatedRule.execErrState = params.execErrState

    if (params.data) {
      try {
        updatedRule.data = JSON.parse(params.data)
      } catch {
        // Keep existing data if parse fails
      }
    }

    if (params.annotations) {
      try {
        updatedRule.annotations = {
          ...(existingRule.annotations || {}),
          ...JSON.parse(params.annotations),
        }
      } catch {
        // Keep existing annotations if parse fails
      }
    }

    if (params.labels) {
      try {
        updatedRule.labels = {
          ...(existingRule.labels || {}),
          ...JSON.parse(params.labels),
        }
      } catch {
        // Keep existing labels if parse fails
      }
    }

    // Make the PUT request with the complete merged object
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }
    if (params.organizationId) {
      headers['X-Grafana-Org-Id'] = params.organizationId
    }

    const updateResponse = await fetch(
      `${params.baseUrl.replace(/\/$/, '')}/api/v1/provisioning/alert-rules/${params.alertRuleUid}`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify(updatedRule),
      }
    )

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text()
      return {
        success: false,
        output: {},
        error: `Failed to update alert rule: ${errorText}`,
      }
    }

    const data = await updateResponse.json()

    return {
      success: true,
      output: {
        uid: data.uid,
        title: data.title,
        condition: data.condition,
        data: data.data,
        updated: data.updated,
        noDataState: data.noDataState,
        execErrState: data.execErrState,
        for: data.for,
        annotations: data.annotations || {},
        labels: data.labels || {},
        isPaused: data.isPaused || false,
        folderUID: data.folderUID,
        ruleGroup: data.ruleGroup,
        orgId: data.orgId,
        namespace_uid: data.namespace_uid,
        namespace_id: data.namespace_id,
        provenance: data.provenance || '',
      },
    }
  },

  outputs: {
    uid: {
      type: 'string',
      description: 'The UID of the updated alert rule',
    },
    title: {
      type: 'string',
      description: 'Alert rule title',
    },
    folderUID: {
      type: 'string',
      description: 'Parent folder UID',
    },
    ruleGroup: {
      type: 'string',
      description: 'Rule group name',
    },
  },
}
```

--------------------------------------------------------------------------------

````
