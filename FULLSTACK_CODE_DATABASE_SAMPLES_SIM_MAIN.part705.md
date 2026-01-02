---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 705
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 705 of 933)

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

---[FILE: get_active_cycle.ts]---
Location: sim-main/apps/sim/tools/linear/get_active_cycle.ts

```typescript
import type { LinearGetActiveCycleParams, LinearGetActiveCycleResponse } from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearGetActiveCycleTool: ToolConfig<
  LinearGetActiveCycleParams,
  LinearGetActiveCycleResponse
> = {
  id: 'linear_get_active_cycle',
  name: 'Linear Get Active Cycle',
  description: 'Get the currently active cycle for a team',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'linear',
  },

  params: {
    teamId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Team ID',
    },
  },

  request: {
    url: 'https://api.linear.app/graphql',
    method: 'POST',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Missing access token for Linear API request')
      }
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
    body: (params) => ({
      query: `
        query GetActiveCycle($id: String!) {
          team(id: $id) {
            activeCycle {
              id
              number
              name
              startsAt
              endsAt
              completedAt
              progress
              team {
                id
                name
              }
            }
          }
        }
      `,
      variables: {
        id: params.teamId,
      },
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to fetch active cycle',
        output: {},
      }
    }

    if (!data.data?.team) {
      return {
        success: false,
        error: 'Team not found',
        output: {},
      }
    }

    return {
      success: true,
      output: {
        cycle: data.data.team.activeCycle || null,
      },
    }
  },

  outputs: {
    cycle: {
      type: 'object',
      description: 'The active cycle (null if no active cycle)',
      properties: {
        id: { type: 'string', description: 'Cycle ID' },
        number: { type: 'number', description: 'Cycle number' },
        name: { type: 'string', description: 'Cycle name' },
        startsAt: { type: 'string', description: 'Start date' },
        endsAt: { type: 'string', description: 'End date' },
        progress: { type: 'number', description: 'Progress percentage' },
        team: { type: 'object', description: 'Team this cycle belongs to' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_customer.ts]---
Location: sim-main/apps/sim/tools/linear/get_customer.ts

```typescript
import type { LinearGetCustomerParams, LinearGetCustomerResponse } from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearGetCustomerTool: ToolConfig<LinearGetCustomerParams, LinearGetCustomerResponse> =
  {
    id: 'linear_get_customer',
    name: 'Linear Get Customer',
    description: 'Get a single customer by ID in Linear',
    version: '1.0.0',

    oauth: {
      required: true,
      provider: 'linear',
    },

    params: {
      customerId: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description: 'Customer ID to retrieve',
      },
    },

    request: {
      url: 'https://api.linear.app/graphql',
      method: 'POST',
      headers: (params) => {
        if (!params.accessToken) {
          throw new Error('Missing access token for Linear API request')
        }
        return {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${params.accessToken}`,
        }
      },
      body: (params) => ({
        query: `
        query GetCustomer($id: String!) {
          customer(id: $id) {
            id
            name
            domains
            externalIds
            logoUrl
            approximateNeedCount
            createdAt
            archivedAt
          }
        }
      `,
        variables: {
          id: params.customerId,
        },
      }),
    },

    transformResponse: async (response) => {
      const data = await response.json()

      if (data.errors) {
        return {
          success: false,
          error: data.errors[0]?.message || 'Failed to get customer',
          output: {},
        }
      }

      return {
        success: true,
        output: {
          customer: data.data.customer,
        },
      }
    },

    outputs: {
      customer: {
        type: 'object',
        description: 'The customer data',
        properties: {
          id: { type: 'string', description: 'Customer ID' },
          name: { type: 'string', description: 'Customer name' },
          domains: { type: 'array', description: 'Associated domains' },
          externalIds: { type: 'array', description: 'External IDs' },
          logoUrl: { type: 'string', description: 'Logo URL' },
          approximateNeedCount: { type: 'number', description: 'Number of customer needs' },
          createdAt: { type: 'string', description: 'Creation timestamp' },
          archivedAt: { type: 'string', description: 'Archive timestamp (null if not archived)' },
        },
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: get_cycle.ts]---
Location: sim-main/apps/sim/tools/linear/get_cycle.ts

```typescript
import type { LinearGetCycleParams, LinearGetCycleResponse } from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearGetCycleTool: ToolConfig<LinearGetCycleParams, LinearGetCycleResponse> = {
  id: 'linear_get_cycle',
  name: 'Linear Get Cycle',
  description: 'Get a single cycle by ID from Linear',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'linear',
  },

  params: {
    cycleId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Cycle ID',
    },
  },

  request: {
    url: 'https://api.linear.app/graphql',
    method: 'POST',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Missing access token for Linear API request')
      }
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
    body: (params) => ({
      query: `
        query GetCycle($id: String!) {
          cycle(id: $id) {
            id
            number
            name
            startsAt
            endsAt
            completedAt
            progress
            team {
              id
              name
            }
          }
        }
      `,
      variables: {
        id: params.cycleId,
      },
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to fetch cycle',
        output: {},
      }
    }

    return {
      success: true,
      output: {
        cycle: data.data.cycle,
      },
    }
  },

  outputs: {
    cycle: {
      type: 'object',
      description: 'The cycle with full details',
      properties: {
        id: { type: 'string', description: 'Cycle ID' },
        number: { type: 'number', description: 'Cycle number' },
        name: { type: 'string', description: 'Cycle name' },
        startsAt: { type: 'string', description: 'Start date' },
        endsAt: { type: 'string', description: 'End date' },
        progress: { type: 'number', description: 'Progress percentage' },
        team: { type: 'object', description: 'Team this cycle belongs to' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_issue.ts]---
Location: sim-main/apps/sim/tools/linear/get_issue.ts

```typescript
import type { LinearGetIssueParams, LinearGetIssueResponse } from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearGetIssueTool: ToolConfig<LinearGetIssueParams, LinearGetIssueResponse> = {
  id: 'linear_get_issue',
  name: 'Linear Get Issue',
  description: 'Get a single issue by ID from Linear with full details',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'linear',
  },

  params: {
    issueId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Linear issue ID',
    },
  },

  request: {
    url: 'https://api.linear.app/graphql',
    method: 'POST',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Missing access token for Linear API request')
      }
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
    body: (params) => ({
      query: `
        query GetIssue($id: String!) {
          issue(id: $id) {
            id
            title
            description
            priority
            estimate
            url
            createdAt
            updatedAt
            completedAt
            canceledAt
            archivedAt
            state {
              id
              name
              type
            }
            assignee {
              id
              name
              email
            }
            team {
              id
              name
            }
            project {
              id
              name
            }
            labels {
              nodes {
                id
                name
                color
              }
            }
          }
        }
      `,
      variables: {
        id: params.issueId,
      },
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to fetch issue',
        output: {},
      }
    }

    const issue = data.data.issue
    return {
      success: true,
      output: {
        issue: {
          id: issue.id,
          title: issue.title,
          description: issue.description,
          priority: issue.priority,
          estimate: issue.estimate,
          url: issue.url,
          createdAt: issue.createdAt,
          updatedAt: issue.updatedAt,
          completedAt: issue.completedAt,
          canceledAt: issue.canceledAt,
          archivedAt: issue.archivedAt,
          state: issue.state,
          assignee: issue.assignee,
          teamId: issue.team?.id,
          projectId: issue.project?.id,
          labels: issue.labels?.nodes || [],
        },
      },
    }
  },

  outputs: {
    issue: {
      type: 'object',
      description: 'The issue with full details',
      properties: {
        id: { type: 'string', description: 'Issue ID' },
        title: { type: 'string', description: 'Issue title' },
        description: { type: 'string', description: 'Issue description' },
        priority: { type: 'number', description: 'Issue priority (0-4)' },
        estimate: { type: 'number', description: 'Issue estimate in points' },
        url: { type: 'string', description: 'Issue URL' },
        state: { type: 'object', description: 'Issue state/status' },
        assignee: { type: 'object', description: 'Assigned user' },
        labels: { type: 'array', description: 'Issue labels' },
        createdAt: { type: 'string', description: 'Creation timestamp' },
        updatedAt: { type: 'string', description: 'Last update timestamp' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_project.ts]---
Location: sim-main/apps/sim/tools/linear/get_project.ts

```typescript
import type { LinearGetProjectParams, LinearGetProjectResponse } from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearGetProjectTool: ToolConfig<LinearGetProjectParams, LinearGetProjectResponse> = {
  id: 'linear_get_project',
  name: 'Linear Get Project',
  description: 'Get a single project by ID from Linear',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'linear',
  },

  params: {
    projectId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Linear project ID',
    },
  },

  request: {
    url: 'https://api.linear.app/graphql',
    method: 'POST',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Missing access token for Linear API request')
      }
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
    body: (params) => ({
      query: `
        query GetProject($id: String!) {
          project(id: $id) {
            id
            name
            description
            state
            priority
            startDate
            targetDate
            completedAt
            canceledAt
            archivedAt
            url
            lead {
              id
              name
            }
            teams {
              nodes {
                id
                name
              }
            }
          }
        }
      `,
      variables: {
        id: params.projectId,
      },
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to fetch project',
        output: {},
      }
    }

    const project = data.data.project
    return {
      success: true,
      output: {
        project: {
          id: project.id,
          name: project.name,
          description: project.description,
          state: project.state,
          priority: project.priority,
          startDate: project.startDate,
          targetDate: project.targetDate,
          completedAt: project.completedAt,
          canceledAt: project.canceledAt,
          archivedAt: project.archivedAt,
          url: project.url,
          lead: project.lead,
          teams: project.teams?.nodes || [],
        },
      },
    }
  },

  outputs: {
    project: {
      type: 'object',
      description: 'The project with full details',
      properties: {
        id: { type: 'string', description: 'Project ID' },
        name: { type: 'string', description: 'Project name' },
        description: { type: 'string', description: 'Project description' },
        state: { type: 'string', description: 'Project state' },
        priority: { type: 'number', description: 'Project priority' },
        startDate: { type: 'string', description: 'Start date' },
        targetDate: { type: 'string', description: 'Target completion date' },
        lead: { type: 'object', description: 'Project lead' },
        teams: { type: 'array', description: 'Associated teams' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_viewer.ts]---
Location: sim-main/apps/sim/tools/linear/get_viewer.ts

```typescript
import type { LinearGetViewerParams, LinearGetViewerResponse } from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearGetViewerTool: ToolConfig<LinearGetViewerParams, LinearGetViewerResponse> = {
  id: 'linear_get_viewer',
  name: 'Linear Get Current User',
  description: 'Get the currently authenticated user (viewer) information',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'linear',
  },

  params: {},

  request: {
    url: 'https://api.linear.app/graphql',
    method: 'POST',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Missing access token for Linear API request')
      }
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
    body: () => ({
      query: `
        query GetViewer {
          viewer {
            id
            name
            email
            displayName
            active
            admin
            avatarUrl
          }
        }
      `,
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to get viewer',
        output: {},
      }
    }

    return {
      success: true,
      output: {
        user: data.data.viewer,
      },
    }
  },

  outputs: {
    user: {
      type: 'object',
      description: 'The currently authenticated user',
      properties: {
        id: { type: 'string', description: 'User ID' },
        name: { type: 'string', description: 'User name' },
        email: { type: 'string', description: 'User email' },
        displayName: { type: 'string', description: 'Display name' },
        active: { type: 'boolean', description: 'Whether user is active' },
        admin: { type: 'boolean', description: 'Whether user is admin' },
        avatarUrl: { type: 'string', description: 'Avatar URL' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/linear/index.ts

```typescript
import { linearAddLabelToIssueTool } from '@/tools/linear/add_label_to_issue'
import { linearAddLabelToProjectTool } from '@/tools/linear/add_label_to_project'
import { linearArchiveIssueTool } from '@/tools/linear/archive_issue'
import { linearArchiveLabelTool } from '@/tools/linear/archive_label'
import { linearArchiveProjectTool } from '@/tools/linear/archive_project'
import { linearCreateAttachmentTool } from '@/tools/linear/create_attachment'
import { linearCreateCommentTool } from '@/tools/linear/create_comment'
import { linearCreateCustomerTool } from '@/tools/linear/create_customer'
import { linearCreateCustomerRequestTool } from '@/tools/linear/create_customer_request'
import { linearCreateCustomerStatusTool } from '@/tools/linear/create_customer_status'
import { linearCreateCustomerTierTool } from '@/tools/linear/create_customer_tier'
import { linearCreateCycleTool } from '@/tools/linear/create_cycle'
import { linearCreateFavoriteTool } from '@/tools/linear/create_favorite'
import { linearCreateIssueTool } from '@/tools/linear/create_issue'
import { linearCreateIssueRelationTool } from '@/tools/linear/create_issue_relation'
import { linearCreateLabelTool } from '@/tools/linear/create_label'
import { linearCreateProjectTool } from '@/tools/linear/create_project'
import { linearCreateProjectLabelTool } from '@/tools/linear/create_project_label'
import { linearCreateProjectLinkTool } from '@/tools/linear/create_project_link'
import { linearCreateProjectMilestoneTool } from '@/tools/linear/create_project_milestone'
import { linearCreateProjectStatusTool } from '@/tools/linear/create_project_status'
import { linearCreateProjectUpdateTool } from '@/tools/linear/create_project_update'
import { linearCreateWorkflowStateTool } from '@/tools/linear/create_workflow_state'
import { linearDeleteAttachmentTool } from '@/tools/linear/delete_attachment'
import { linearDeleteCommentTool } from '@/tools/linear/delete_comment'
import { linearDeleteCustomerTool } from '@/tools/linear/delete_customer'
import { linearDeleteCustomerStatusTool } from '@/tools/linear/delete_customer_status'
import { linearDeleteCustomerTierTool } from '@/tools/linear/delete_customer_tier'
import { linearDeleteIssueTool } from '@/tools/linear/delete_issue'
import { linearDeleteIssueRelationTool } from '@/tools/linear/delete_issue_relation'
import { linearDeleteProjectTool } from '@/tools/linear/delete_project'
import { linearDeleteProjectLabelTool } from '@/tools/linear/delete_project_label'
import { linearDeleteProjectMilestoneTool } from '@/tools/linear/delete_project_milestone'
import { linearDeleteProjectStatusTool } from '@/tools/linear/delete_project_status'
import { linearGetActiveCycleTool } from '@/tools/linear/get_active_cycle'
import { linearGetCustomerTool } from '@/tools/linear/get_customer'
import { linearGetCycleTool } from '@/tools/linear/get_cycle'
import { linearGetIssueTool } from '@/tools/linear/get_issue'
import { linearGetProjectTool } from '@/tools/linear/get_project'
import { linearGetViewerTool } from '@/tools/linear/get_viewer'
import { linearListAttachmentsTool } from '@/tools/linear/list_attachments'
import { linearListCommentsTool } from '@/tools/linear/list_comments'
import { linearListCustomerRequestsTool } from '@/tools/linear/list_customer_requests'
import { linearListCustomerStatusesTool } from '@/tools/linear/list_customer_statuses'
import { linearListCustomerTiersTool } from '@/tools/linear/list_customer_tiers'
import { linearListCustomersTool } from '@/tools/linear/list_customers'
import { linearListCyclesTool } from '@/tools/linear/list_cycles'
import { linearListFavoritesTool } from '@/tools/linear/list_favorites'
import { linearListIssueRelationsTool } from '@/tools/linear/list_issue_relations'
import { linearListLabelsTool } from '@/tools/linear/list_labels'
import { linearListNotificationsTool } from '@/tools/linear/list_notifications'
import { linearListProjectLabelsTool } from '@/tools/linear/list_project_labels'
import { linearListProjectMilestonesTool } from '@/tools/linear/list_project_milestones'
import { linearListProjectStatusesTool } from '@/tools/linear/list_project_statuses'
import { linearListProjectUpdatesTool } from '@/tools/linear/list_project_updates'
import { linearListProjectsTool } from '@/tools/linear/list_projects'
import { linearListTeamsTool } from '@/tools/linear/list_teams'
import { linearListUsersTool } from '@/tools/linear/list_users'
import { linearListWorkflowStatesTool } from '@/tools/linear/list_workflow_states'
import { linearMergeCustomersTool } from '@/tools/linear/merge_customers'
import { linearReadIssuesTool } from '@/tools/linear/read_issues'
import { linearRemoveLabelFromIssueTool } from '@/tools/linear/remove_label_from_issue'
import { linearRemoveLabelFromProjectTool } from '@/tools/linear/remove_label_from_project'
import { linearSearchIssuesTool } from '@/tools/linear/search_issues'
import { linearUnarchiveIssueTool } from '@/tools/linear/unarchive_issue'
import { linearUpdateAttachmentTool } from '@/tools/linear/update_attachment'
import { linearUpdateCommentTool } from '@/tools/linear/update_comment'
import { linearUpdateCustomerTool } from '@/tools/linear/update_customer'
import { linearUpdateCustomerRequestTool } from '@/tools/linear/update_customer_request'
import { linearUpdateCustomerStatusTool } from '@/tools/linear/update_customer_status'
import { linearUpdateCustomerTierTool } from '@/tools/linear/update_customer_tier'
import { linearUpdateIssueTool } from '@/tools/linear/update_issue'
import { linearUpdateLabelTool } from '@/tools/linear/update_label'
import { linearUpdateNotificationTool } from '@/tools/linear/update_notification'
import { linearUpdateProjectTool } from '@/tools/linear/update_project'
import { linearUpdateProjectLabelTool } from '@/tools/linear/update_project_label'
import { linearUpdateProjectMilestoneTool } from '@/tools/linear/update_project_milestone'
import { linearUpdateProjectStatusTool } from '@/tools/linear/update_project_status'
import { linearUpdateWorkflowStateTool } from '@/tools/linear/update_workflow_state'

export {
  linearReadIssuesTool,
  linearCreateIssueTool,
  linearGetIssueTool,
  linearUpdateIssueTool,
  linearArchiveIssueTool,
  linearUnarchiveIssueTool,
  linearDeleteIssueTool,
  linearAddLabelToIssueTool,
  linearRemoveLabelFromIssueTool,
  linearSearchIssuesTool,
  linearCreateCommentTool,
  linearUpdateCommentTool,
  linearDeleteCommentTool,
  linearListCommentsTool,
  linearListProjectsTool,
  linearGetProjectTool,
  linearCreateProjectTool,
  linearUpdateProjectTool,
  linearArchiveProjectTool,
  linearDeleteProjectTool,
  linearAddLabelToProjectTool,
  linearRemoveLabelFromProjectTool,
  linearListProjectLabelsTool,
  linearCreateProjectLabelTool,
  linearDeleteProjectLabelTool,
  linearUpdateProjectLabelTool,
  linearListProjectMilestonesTool,
  linearCreateProjectMilestoneTool,
  linearDeleteProjectMilestoneTool,
  linearUpdateProjectMilestoneTool,
  linearListProjectStatusesTool,
  linearCreateProjectStatusTool,
  linearDeleteProjectStatusTool,
  linearUpdateProjectStatusTool,
  linearListUsersTool,
  linearListTeamsTool,
  linearGetViewerTool,
  linearListLabelsTool,
  linearCreateLabelTool,
  linearUpdateLabelTool,
  linearArchiveLabelTool,
  linearListWorkflowStatesTool,
  linearCreateWorkflowStateTool,
  linearUpdateWorkflowStateTool,
  linearListCyclesTool,
  linearGetCycleTool,
  linearCreateCycleTool,
  linearGetActiveCycleTool,
  linearCreateAttachmentTool,
  linearListAttachmentsTool,
  linearUpdateAttachmentTool,
  linearDeleteAttachmentTool,
  linearCreateIssueRelationTool,
  linearListIssueRelationsTool,
  linearDeleteIssueRelationTool,
  linearCreateFavoriteTool,
  linearListFavoritesTool,
  linearCreateProjectUpdateTool,
  linearListProjectUpdatesTool,
  linearCreateProjectLinkTool,
  linearListNotificationsTool,
  linearUpdateNotificationTool,
  linearCreateCustomerTool,
  linearGetCustomerTool,
  linearUpdateCustomerTool,
  linearDeleteCustomerTool,
  linearListCustomersTool,
  linearMergeCustomersTool,
  linearListCustomerStatusesTool,
  linearCreateCustomerStatusTool,
  linearDeleteCustomerStatusTool,
  linearUpdateCustomerStatusTool,
  linearListCustomerTiersTool,
  linearCreateCustomerTierTool,
  linearDeleteCustomerTierTool,
  linearUpdateCustomerTierTool,
  linearCreateCustomerRequestTool,
  linearUpdateCustomerRequestTool,
  linearListCustomerRequestsTool,
}
```

--------------------------------------------------------------------------------

---[FILE: list_attachments.ts]---
Location: sim-main/apps/sim/tools/linear/list_attachments.ts

```typescript
import type {
  LinearListAttachmentsParams,
  LinearListAttachmentsResponse,
} from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearListAttachmentsTool: ToolConfig<
  LinearListAttachmentsParams,
  LinearListAttachmentsResponse
> = {
  id: 'linear_list_attachments',
  name: 'Linear List Attachments',
  description: 'List all attachments on an issue in Linear',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'linear',
  },

  params: {
    issueId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Issue ID',
    },
    first: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Number of attachments to return (default: 50)',
    },
    after: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Cursor for pagination',
    },
  },

  request: {
    url: 'https://api.linear.app/graphql',
    method: 'POST',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Missing access token for Linear API request')
      }
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
    body: (params) => ({
      query: `
        query ListAttachments($issueId: String!, $first: Int, $after: String) {
          issue(id: $issueId) {
            attachments(first: $first, after: $after) {
              nodes {
                id
                title
                subtitle
                url
                createdAt
                updatedAt
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
        }
      `,
      variables: {
        issueId: params.issueId,
        first: params.first ? Number(params.first) : 50,
        after: params.after,
      },
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to list attachments',
        output: {},
      }
    }

    if (!data.data?.issue) {
      return {
        success: false,
        error: 'Issue not found',
        output: {},
      }
    }

    const result = data.data.issue.attachments
    return {
      success: true,
      output: {
        attachments: result.nodes,
        pageInfo: {
          hasNextPage: result.pageInfo.hasNextPage,
          endCursor: result.pageInfo.endCursor,
        },
      },
    }
  },

  outputs: {
    attachments: {
      type: 'array',
      description: 'Array of attachments',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Attachment ID' },
          title: { type: 'string', description: 'Attachment title' },
          subtitle: { type: 'string', description: 'Attachment subtitle' },
          url: { type: 'string', description: 'Attachment URL' },
          createdAt: { type: 'string', description: 'Creation timestamp' },
        },
      },
    },
    pageInfo: {
      type: 'object',
      description: 'Pagination information',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_comments.ts]---
Location: sim-main/apps/sim/tools/linear/list_comments.ts

```typescript
import type { LinearListCommentsParams, LinearListCommentsResponse } from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearListCommentsTool: ToolConfig<
  LinearListCommentsParams,
  LinearListCommentsResponse
> = {
  id: 'linear_list_comments',
  name: 'Linear List Comments',
  description: 'List all comments on an issue in Linear',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'linear',
  },

  params: {
    issueId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Linear issue ID',
    },
    first: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Number of comments to return (default: 50)',
    },
    after: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Cursor for pagination',
    },
  },

  request: {
    url: 'https://api.linear.app/graphql',
    method: 'POST',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Missing access token for Linear API request')
      }
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
    body: (params) => ({
      query: `
        query ListComments($issueId: String!, $first: Int, $after: String) {
          issue(id: $issueId) {
            comments(first: $first, after: $after) {
              nodes {
                id
                body
                createdAt
                updatedAt
                user {
                  id
                  name
                  email
                }
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
        }
      `,
      variables: {
        issueId: params.issueId,
        first: params.first ? Number(params.first) : 50,
        after: params.after,
      },
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to list comments',
        output: {},
      }
    }

    if (!data.data?.issue) {
      return {
        success: false,
        error: 'Issue not found',
        output: {},
      }
    }

    const result = data.data.issue.comments
    return {
      success: true,
      output: {
        comments: result.nodes,
        pageInfo: {
          hasNextPage: result.pageInfo.hasNextPage,
          endCursor: result.pageInfo.endCursor,
        },
      },
    }
  },

  outputs: {
    comments: {
      type: 'array',
      description: 'Array of comments on the issue',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Comment ID' },
          body: { type: 'string', description: 'Comment text' },
          createdAt: { type: 'string', description: 'Creation timestamp' },
          updatedAt: { type: 'string', description: 'Last update timestamp' },
          user: { type: 'object', description: 'User who created the comment' },
        },
      },
    },
    pageInfo: {
      type: 'object',
      description: 'Pagination information',
      properties: {
        hasNextPage: { type: 'boolean', description: 'Whether there are more results' },
        endCursor: { type: 'string', description: 'Cursor for next page' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_customers.ts]---
Location: sim-main/apps/sim/tools/linear/list_customers.ts

```typescript
import type { LinearListCustomersParams, LinearListCustomersResponse } from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearListCustomersTool: ToolConfig<
  LinearListCustomersParams,
  LinearListCustomersResponse
> = {
  id: 'linear_list_customers',
  name: 'Linear List Customers',
  description: 'List all customers in Linear',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'linear',
  },

  params: {
    first: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Number of customers to return (default: 50)',
    },
    after: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Cursor for pagination',
    },
    includeArchived: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Include archived customers (default: false)',
    },
  },

  request: {
    url: 'https://api.linear.app/graphql',
    method: 'POST',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Missing access token for Linear API request')
      }
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
    body: (params) => ({
      query: `
        query ListCustomers($first: Int, $after: String, $includeArchived: Boolean) {
          customers(first: $first, after: $after, includeArchived: $includeArchived) {
            nodes {
              id
              name
              domains
              externalIds
              logoUrl
              approximateNeedCount
              createdAt
              archivedAt
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `,
      variables: {
        first: params.first || 50,
        after: params.after,
        includeArchived: params.includeArchived || false,
      },
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to list customers',
        output: {},
      }
    }

    const result = data.data.customers
    return {
      success: true,
      output: {
        customers: result.nodes,
        pageInfo: {
          hasNextPage: result.pageInfo.hasNextPage,
          endCursor: result.pageInfo.endCursor,
        },
      },
    }
  },

  outputs: {
    customers: {
      type: 'array',
      description: 'Array of customers',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Customer ID' },
          name: { type: 'string', description: 'Customer name' },
          domains: { type: 'array', description: 'Associated domains' },
          externalIds: { type: 'array', description: 'External IDs' },
          logoUrl: { type: 'string', description: 'Logo URL' },
          approximateNeedCount: { type: 'number', description: 'Number of customer needs' },
          createdAt: { type: 'string', description: 'Creation timestamp' },
          archivedAt: { type: 'string', description: 'Archive timestamp (null if not archived)' },
        },
      },
    },
    pageInfo: {
      type: 'object',
      description: 'Pagination information',
    },
  },
}
```

--------------------------------------------------------------------------------

````
