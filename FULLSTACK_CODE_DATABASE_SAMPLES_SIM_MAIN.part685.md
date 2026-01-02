---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 685
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 685 of 933)

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
Location: sim-main/apps/sim/tools/google_vault/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface GoogleVaultCommonParams {
  accessToken: string
  matterId: string
}

// Exports
export interface GoogleVaultCreateMattersExportParams extends GoogleVaultCommonParams {
  exportName: string
  corpus: GoogleVaultCorpus
  accountEmails?: string // Comma-separated list or array handled in the tool
  orgUnitId?: string
  terms?: string
  startTime?: string
  endTime?: string
  timeZone?: string
  includeSharedDrives?: boolean
}

export interface GoogleVaultListMattersExportParams extends GoogleVaultCommonParams {
  pageSize?: number
  pageToken?: string
  exportId?: string // Short input to fetch a specific export
}

export interface GoogleVaultListMattersExportResponse extends ToolResponse {
  output: any
}

// Holds
// Simplified: default to BASIC_HOLD by omission in requests
export type GoogleVaultHoldView = 'BASIC_HOLD' | 'FULL_HOLD'

export type GoogleVaultCorpus = 'MAIL' | 'DRIVE' | 'GROUPS' | 'HANGOUTS_CHAT' | 'VOICE'

export interface GoogleVaultCreateMattersHoldsParams extends GoogleVaultCommonParams {
  holdName: string
  corpus: GoogleVaultCorpus
  accountEmails?: string // Comma-separated list or array handled in the tool
  orgUnitId?: string
}

export interface GoogleVaultListMattersHoldsParams extends GoogleVaultCommonParams {
  pageSize?: number
  pageToken?: string
  holdId?: string // Short input to fetch a specific hold
}

export interface GoogleVaultListMattersHoldsResponse extends ToolResponse {
  output: any
}
```

--------------------------------------------------------------------------------

---[FILE: create_alert_rule.ts]---
Location: sim-main/apps/sim/tools/grafana/create_alert_rule.ts

```typescript
import type {
  GrafanaCreateAlertRuleParams,
  GrafanaCreateAlertRuleResponse,
} from '@/tools/grafana/types'
import type { ToolConfig } from '@/tools/types'

export const createAlertRuleTool: ToolConfig<
  GrafanaCreateAlertRuleParams,
  GrafanaCreateAlertRuleResponse
> = {
  id: 'grafana_create_alert_rule',
  name: 'Grafana Create Alert Rule',
  description: 'Create a new alert rule',
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
    title: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The title of the alert rule',
    },
    folderUid: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The UID of the folder to create the alert in',
    },
    ruleGroup: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The name of the rule group',
    },
    condition: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The refId of the query or expression to use as the alert condition',
    },
    data: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'JSON array of query/expression data objects',
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
    url: (params) => `${params.baseUrl.replace(/\/$/, '')}/api/v1/provisioning/alert-rules`,
    method: 'POST',
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
    body: (params) => {
      let dataArray: any[] = []
      try {
        dataArray = JSON.parse(params.data)
      } catch {
        throw new Error('Invalid JSON for data parameter')
      }

      const body: Record<string, any> = {
        title: params.title,
        folderUID: params.folderUid,
        ruleGroup: params.ruleGroup,
        condition: params.condition,
        data: dataArray,
        for: params.forDuration || '5m',
        noDataState: params.noDataState || 'NoData',
        execErrState: params.execErrState || 'Alerting',
      }

      if (params.annotations) {
        try {
          body.annotations = JSON.parse(params.annotations)
        } catch {
          body.annotations = {}
        }
      }

      if (params.labels) {
        try {
          body.labels = JSON.parse(params.labels)
        } catch {
          body.labels = {}
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
      description: 'The UID of the created alert rule',
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

---[FILE: create_annotation.ts]---
Location: sim-main/apps/sim/tools/grafana/create_annotation.ts

```typescript
import type {
  GrafanaCreateAnnotationParams,
  GrafanaCreateAnnotationResponse,
} from '@/tools/grafana/types'
import type { ToolConfig } from '@/tools/types'

export const createAnnotationTool: ToolConfig<
  GrafanaCreateAnnotationParams,
  GrafanaCreateAnnotationResponse
> = {
  id: 'grafana_create_annotation',
  name: 'Grafana Create Annotation',
  description: 'Create an annotation on a dashboard or as a global annotation',
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
    text: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The text content of the annotation',
    },
    tags: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Comma-separated list of tags',
    },
    dashboardUid: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'UID of the dashboard to add the annotation to',
    },
    panelId: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'ID of the panel to add the annotation to',
    },
    time: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Start time in epoch milliseconds (defaults to now)',
    },
    timeEnd: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'End time in epoch milliseconds (for range annotations)',
    },
  },

  request: {
    url: (params) => `${params.baseUrl.replace(/\/$/, '')}/api/annotations`,
    method: 'POST',
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
    body: (params) => {
      const body: Record<string, any> = {
        text: params.text,
        time: params.time || Date.now(),
      }

      if (params.tags) {
        body.tags = params.tags
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t)
      }

      if (params.dashboardUid) {
        body.dashboardUID = params.dashboardUid
      }

      if (params.panelId) {
        body.panelId = params.panelId
      }

      if (params.timeEnd) {
        body.timeEnd = params.timeEnd
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
        message: data.message || 'Annotation created successfully',
      },
    }
  },

  outputs: {
    id: {
      type: 'number',
      description: 'The ID of the created annotation',
    },
    message: {
      type: 'string',
      description: 'Confirmation message',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_dashboard.ts]---
Location: sim-main/apps/sim/tools/grafana/create_dashboard.ts

```typescript
import type {
  GrafanaCreateDashboardParams,
  GrafanaCreateDashboardResponse,
} from '@/tools/grafana/types'
import type { ToolConfig } from '@/tools/types'

export const createDashboardTool: ToolConfig<
  GrafanaCreateDashboardParams,
  GrafanaCreateDashboardResponse
> = {
  id: 'grafana_create_dashboard',
  name: 'Grafana Create Dashboard',
  description: 'Create a new dashboard',
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
    title: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The title of the new dashboard',
    },
    folderUid: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'The UID of the folder to create the dashboard in',
    },
    tags: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Comma-separated list of tags',
    },
    timezone: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Dashboard timezone (e.g., browser, utc)',
    },
    refresh: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Auto-refresh interval (e.g., 5s, 1m, 5m)',
    },
    panels: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'JSON array of panel configurations',
    },
    overwrite: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Overwrite existing dashboard with same title',
    },
    message: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Commit message for the dashboard version',
    },
  },

  request: {
    url: (params) => `${params.baseUrl.replace(/\/$/, '')}/api/dashboards/db`,
    method: 'POST',
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
    body: (params) => {
      const dashboard: Record<string, any> = {
        title: params.title,
        tags: params.tags
          ? params.tags
              .split(',')
              .map((t) => t.trim())
              .filter((t) => t)
          : [],
        timezone: params.timezone || 'browser',
        schemaVersion: 39,
        version: 0,
        refresh: params.refresh || '',
      }

      if (params.panels) {
        try {
          dashboard.panels = JSON.parse(params.panels)
        } catch {
          dashboard.panels = []
        }
      } else {
        dashboard.panels = []
      }

      const body: Record<string, any> = {
        dashboard,
        overwrite: params.overwrite || false,
      }

      if (params.folderUid) {
        body.folderUid = params.folderUid
      }

      if (params.message) {
        body.message = params.message
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
        uid: data.uid,
        url: data.url,
        status: data.status,
        version: data.version,
        slug: data.slug,
      },
    }
  },

  outputs: {
    id: {
      type: 'number',
      description: 'The numeric ID of the created dashboard',
    },
    uid: {
      type: 'string',
      description: 'The UID of the created dashboard',
    },
    url: {
      type: 'string',
      description: 'The URL path to the dashboard',
    },
    status: {
      type: 'string',
      description: 'Status of the operation (success)',
    },
    version: {
      type: 'number',
      description: 'The version number of the dashboard',
    },
    slug: {
      type: 'string',
      description: 'URL-friendly slug of the dashboard',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_folder.ts]---
Location: sim-main/apps/sim/tools/grafana/create_folder.ts

```typescript
import type { GrafanaCreateFolderParams, GrafanaCreateFolderResponse } from '@/tools/grafana/types'
import type { ToolConfig } from '@/tools/types'

export const createFolderTool: ToolConfig<GrafanaCreateFolderParams, GrafanaCreateFolderResponse> =
  {
    id: 'grafana_create_folder',
    name: 'Grafana Create Folder',
    description: 'Create a new folder in Grafana',
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
      title: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description: 'The title of the new folder',
      },
      uid: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Optional UID for the folder (auto-generated if not provided)',
      },
    },

    request: {
      url: (params) => `${params.baseUrl.replace(/\/$/, '')}/api/folders`,
      method: 'POST',
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
      body: (params) => {
        const body: Record<string, any> = {
          title: params.title,
        }

        if (params.uid) {
          body.uid = params.uid
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
          uid: data.uid,
          title: data.title,
          url: data.url,
          hasAcl: data.hasAcl || false,
          canSave: data.canSave || false,
          canEdit: data.canEdit || false,
          canAdmin: data.canAdmin || false,
          canDelete: data.canDelete || false,
          createdBy: data.createdBy || '',
          created: data.created || '',
          updatedBy: data.updatedBy || '',
          updated: data.updated || '',
          version: data.version || 0,
        },
      }
    },

    outputs: {
      id: {
        type: 'number',
        description: 'The numeric ID of the created folder',
      },
      uid: {
        type: 'string',
        description: 'The UID of the created folder',
      },
      title: {
        type: 'string',
        description: 'The title of the created folder',
      },
      url: {
        type: 'string',
        description: 'The URL path to the folder',
      },
      hasAcl: {
        type: 'boolean',
        description: 'Whether the folder has custom ACL permissions',
      },
      canSave: {
        type: 'boolean',
        description: 'Whether the current user can save the folder',
      },
      canEdit: {
        type: 'boolean',
        description: 'Whether the current user can edit the folder',
      },
      canAdmin: {
        type: 'boolean',
        description: 'Whether the current user has admin rights on the folder',
      },
      canDelete: {
        type: 'boolean',
        description: 'Whether the current user can delete the folder',
      },
      createdBy: {
        type: 'string',
        description: 'Username of who created the folder',
      },
      created: {
        type: 'string',
        description: 'Timestamp when the folder was created',
      },
      updatedBy: {
        type: 'string',
        description: 'Username of who last updated the folder',
      },
      updated: {
        type: 'string',
        description: 'Timestamp when the folder was last updated',
      },
      version: {
        type: 'number',
        description: 'Version number of the folder',
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: delete_alert_rule.ts]---
Location: sim-main/apps/sim/tools/grafana/delete_alert_rule.ts

```typescript
import type {
  GrafanaDeleteAlertRuleParams,
  GrafanaDeleteAlertRuleResponse,
} from '@/tools/grafana/types'
import type { ToolConfig } from '@/tools/types'

export const deleteAlertRuleTool: ToolConfig<
  GrafanaDeleteAlertRuleParams,
  GrafanaDeleteAlertRuleResponse
> = {
  id: 'grafana_delete_alert_rule',
  name: 'Grafana Delete Alert Rule',
  description: 'Delete an alert rule by its UID',
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
      description: 'The UID of the alert rule to delete',
    },
  },

  request: {
    url: (params) =>
      `${params.baseUrl.replace(/\/$/, '')}/api/v1/provisioning/alert-rules/${params.alertRuleUid}`,
    method: 'DELETE',
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

  transformResponse: async () => {
    return {
      success: true,
      output: {
        message: 'Alert rule deleted successfully',
      },
    }
  },

  outputs: {
    message: {
      type: 'string',
      description: 'Confirmation message',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_annotation.ts]---
Location: sim-main/apps/sim/tools/grafana/delete_annotation.ts

```typescript
import type {
  GrafanaDeleteAnnotationParams,
  GrafanaDeleteAnnotationResponse,
} from '@/tools/grafana/types'
import type { ToolConfig } from '@/tools/types'

export const deleteAnnotationTool: ToolConfig<
  GrafanaDeleteAnnotationParams,
  GrafanaDeleteAnnotationResponse
> = {
  id: 'grafana_delete_annotation',
  name: 'Grafana Delete Annotation',
  description: 'Delete an annotation by its ID',
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
    annotationId: {
      type: 'number',
      required: true,
      visibility: 'user-or-llm',
      description: 'The ID of the annotation to delete',
    },
  },

  request: {
    url: (params) => `${params.baseUrl.replace(/\/$/, '')}/api/annotations/${params.annotationId}`,
    method: 'DELETE',
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
        message: data.message || 'Annotation deleted successfully',
      },
    }
  },

  outputs: {
    message: {
      type: 'string',
      description: 'Confirmation message',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_dashboard.ts]---
Location: sim-main/apps/sim/tools/grafana/delete_dashboard.ts

```typescript
import type {
  GrafanaDeleteDashboardParams,
  GrafanaDeleteDashboardResponse,
} from '@/tools/grafana/types'
import type { ToolConfig } from '@/tools/types'

export const deleteDashboardTool: ToolConfig<
  GrafanaDeleteDashboardParams,
  GrafanaDeleteDashboardResponse
> = {
  id: 'grafana_delete_dashboard',
  name: 'Grafana Delete Dashboard',
  description: 'Delete a dashboard by its UID',
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
    dashboardUid: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The UID of the dashboard to delete',
    },
  },

  request: {
    url: (params) =>
      `${params.baseUrl.replace(/\/$/, '')}/api/dashboards/uid/${params.dashboardUid}`,
    method: 'DELETE',
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
        title: data.title || '',
        message: data.message || 'Dashboard deleted',
        id: data.id || 0,
      },
    }
  },

  outputs: {
    title: {
      type: 'string',
      description: 'The title of the deleted dashboard',
    },
    message: {
      type: 'string',
      description: 'Confirmation message',
    },
    id: {
      type: 'number',
      description: 'The ID of the deleted dashboard',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_alert_rule.ts]---
Location: sim-main/apps/sim/tools/grafana/get_alert_rule.ts

```typescript
import type { GrafanaGetAlertRuleParams, GrafanaGetAlertRuleResponse } from '@/tools/grafana/types'
import type { ToolConfig } from '@/tools/types'

export const getAlertRuleTool: ToolConfig<GrafanaGetAlertRuleParams, GrafanaGetAlertRuleResponse> =
  {
    id: 'grafana_get_alert_rule',
    name: 'Grafana Get Alert Rule',
    description: 'Get a specific alert rule by its UID',
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
        description: 'The UID of the alert rule to retrieve',
      },
    },

    request: {
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
      const data = await response.json()

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
        description: 'Alert rule UID',
      },
      title: {
        type: 'string',
        description: 'Alert rule title',
      },
      condition: {
        type: 'string',
        description: 'Alert condition',
      },
      data: {
        type: 'json',
        description: 'Alert rule query data',
      },
      folderUID: {
        type: 'string',
        description: 'Parent folder UID',
      },
      ruleGroup: {
        type: 'string',
        description: 'Rule group name',
      },
      noDataState: {
        type: 'string',
        description: 'State when no data is returned',
      },
      execErrState: {
        type: 'string',
        description: 'State on execution error',
      },
      annotations: {
        type: 'json',
        description: 'Alert annotations',
      },
      labels: {
        type: 'json',
        description: 'Alert labels',
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: get_dashboard.ts]---
Location: sim-main/apps/sim/tools/grafana/get_dashboard.ts

```typescript
import type { GrafanaGetDashboardParams, GrafanaGetDashboardResponse } from '@/tools/grafana/types'
import type { ToolConfig } from '@/tools/types'

export const getDashboardTool: ToolConfig<GrafanaGetDashboardParams, GrafanaGetDashboardResponse> =
  {
    id: 'grafana_get_dashboard',
    name: 'Grafana Get Dashboard',
    description: 'Get a dashboard by its UID',
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
      dashboardUid: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description: 'The UID of the dashboard to retrieve',
      },
    },

    request: {
      url: (params) =>
        `${params.baseUrl.replace(/\/$/, '')}/api/dashboards/uid/${params.dashboardUid}`,
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
          dashboard: data.dashboard,
          meta: data.meta,
        },
      }
    },

    outputs: {
      dashboard: {
        type: 'json',
        description: 'The full dashboard JSON object',
      },
      meta: {
        type: 'json',
        description: 'Dashboard metadata (version, permissions, etc.)',
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: get_data_source.ts]---
Location: sim-main/apps/sim/tools/grafana/get_data_source.ts

```typescript
import type {
  GrafanaGetDataSourceParams,
  GrafanaGetDataSourceResponse,
} from '@/tools/grafana/types'
import type { ToolConfig } from '@/tools/types'

export const getDataSourceTool: ToolConfig<
  GrafanaGetDataSourceParams,
  GrafanaGetDataSourceResponse
> = {
  id: 'grafana_get_data_source',
  name: 'Grafana Get Data Source',
  description: 'Get a data source by its ID or UID',
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
    dataSourceId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The ID or UID of the data source to retrieve',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = params.baseUrl.replace(/\/$/, '')
      // Check if it looks like a UID (contains non-numeric characters) or ID
      const isUid = /[^0-9]/.test(params.dataSourceId)
      if (isUid) {
        return `${baseUrl}/api/datasources/uid/${params.dataSourceId}`
      }
      return `${baseUrl}/api/datasources/${params.dataSourceId}`
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
        id: data.id,
        uid: data.uid,
        orgId: data.orgId,
        name: data.name,
        type: data.type,
        typeName: data.typeName,
        typeLogoUrl: data.typeLogoUrl,
        access: data.access,
        url: data.url,
        user: data.user,
        database: data.database,
        basicAuth: data.basicAuth || false,
        isDefault: data.isDefault || false,
        jsonData: data.jsonData || {},
        readOnly: data.readOnly || false,
      },
    }
  },

  outputs: {
    id: {
      type: 'number',
      description: 'Data source ID',
    },
    uid: {
      type: 'string',
      description: 'Data source UID',
    },
    name: {
      type: 'string',
      description: 'Data source name',
    },
    type: {
      type: 'string',
      description: 'Data source type',
    },
    url: {
      type: 'string',
      description: 'Data source connection URL',
    },
    database: {
      type: 'string',
      description: 'Database name (if applicable)',
    },
    isDefault: {
      type: 'boolean',
      description: 'Whether this is the default data source',
    },
    jsonData: {
      type: 'json',
      description: 'Additional data source configuration',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/grafana/index.ts

```typescript
import { createAlertRuleTool } from '@/tools/grafana/create_alert_rule'
import { createAnnotationTool } from '@/tools/grafana/create_annotation'
import { createDashboardTool } from '@/tools/grafana/create_dashboard'
import { createFolderTool } from '@/tools/grafana/create_folder'
import { deleteAlertRuleTool } from '@/tools/grafana/delete_alert_rule'
import { deleteAnnotationTool } from '@/tools/grafana/delete_annotation'
import { deleteDashboardTool } from '@/tools/grafana/delete_dashboard'
import { getAlertRuleTool } from '@/tools/grafana/get_alert_rule'
import { getDashboardTool } from '@/tools/grafana/get_dashboard'
import { getDataSourceTool } from '@/tools/grafana/get_data_source'
import { listAlertRulesTool } from '@/tools/grafana/list_alert_rules'
import { listAnnotationsTool } from '@/tools/grafana/list_annotations'
import { listContactPointsTool } from '@/tools/grafana/list_contact_points'
import { listDashboardsTool } from '@/tools/grafana/list_dashboards'
import { listDataSourcesTool } from '@/tools/grafana/list_data_sources'
import { listFoldersTool } from '@/tools/grafana/list_folders'
import { updateAlertRuleTool } from '@/tools/grafana/update_alert_rule'
import { updateAnnotationTool } from '@/tools/grafana/update_annotation'
import { updateDashboardTool } from '@/tools/grafana/update_dashboard'

// Dashboard tools
export const grafanaGetDashboardTool = getDashboardTool
export const grafanaListDashboardsTool = listDashboardsTool
export const grafanaCreateDashboardTool = createDashboardTool
export const grafanaUpdateDashboardTool = updateDashboardTool
export const grafanaDeleteDashboardTool = deleteDashboardTool

// Alert tools
export const grafanaListAlertRulesTool = listAlertRulesTool
export const grafanaGetAlertRuleTool = getAlertRuleTool
export const grafanaCreateAlertRuleTool = createAlertRuleTool
export const grafanaUpdateAlertRuleTool = updateAlertRuleTool
export const grafanaDeleteAlertRuleTool = deleteAlertRuleTool
export const grafanaListContactPointsTool = listContactPointsTool

// Annotation tools
export const grafanaCreateAnnotationTool = createAnnotationTool
export const grafanaListAnnotationsTool = listAnnotationsTool
export const grafanaUpdateAnnotationTool = updateAnnotationTool
export const grafanaDeleteAnnotationTool = deleteAnnotationTool

// Data Source tools
export const grafanaListDataSourcesTool = listDataSourcesTool
export const grafanaGetDataSourceTool = getDataSourceTool

// Folder tools
export const grafanaListFoldersTool = listFoldersTool
export const grafanaCreateFolderTool = createFolderTool
```

--------------------------------------------------------------------------------

````
