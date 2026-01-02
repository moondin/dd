---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 707
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 707 of 933)

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

---[FILE: list_project_updates.ts]---
Location: sim-main/apps/sim/tools/linear/list_project_updates.ts

```typescript
import type {
  LinearListProjectUpdatesParams,
  LinearListProjectUpdatesResponse,
} from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearListProjectUpdatesTool: ToolConfig<
  LinearListProjectUpdatesParams,
  LinearListProjectUpdatesResponse
> = {
  id: 'linear_list_project_updates',
  name: 'Linear List Project Updates',
  description: 'List all status updates for a project in Linear',
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
      description: 'Project ID',
    },
    first: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Number of updates to return (default: 50)',
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
        query ListProjectUpdates($projectId: String!, $first: Int, $after: String) {
          project(id: $projectId) {
            projectUpdates(first: $first, after: $after) {
              nodes {
                id
                body
                health
                createdAt
                user {
                  id
                  name
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
        projectId: params.projectId,
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
        error: data.errors[0]?.message || 'Failed to list project updates',
        output: {},
      }
    }

    if (!data.data?.project) {
      return {
        success: false,
        error: 'Project not found',
        output: {},
      }
    }

    const result = data.data.project.projectUpdates
    return {
      success: true,
      output: {
        updates: result.nodes,
        pageInfo: {
          hasNextPage: result.pageInfo.hasNextPage,
          endCursor: result.pageInfo.endCursor,
        },
      },
    }
  },

  outputs: {
    updates: {
      type: 'array',
      description: 'Array of project updates',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Update ID' },
          body: { type: 'string', description: 'Update message' },
          health: { type: 'string', description: 'Project health' },
          createdAt: { type: 'string', description: 'Creation timestamp' },
          user: { type: 'object', description: 'User who created the update' },
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

---[FILE: list_teams.ts]---
Location: sim-main/apps/sim/tools/linear/list_teams.ts

```typescript
import type { LinearListTeamsParams, LinearListTeamsResponse } from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearListTeamsTool: ToolConfig<LinearListTeamsParams, LinearListTeamsResponse> = {
  id: 'linear_list_teams',
  name: 'Linear List Teams',
  description: 'List all teams in the Linear workspace',
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
      description: 'Number of teams to return (default: 50)',
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
        query ListTeams($first: Int, $after: String) {
          teams(first: $first, after: $after) {
            nodes {
              id
              name
              key
              description
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `,
      variables: {
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
        error: data.errors[0]?.message || 'Failed to list teams',
        output: {},
      }
    }

    const result = data.data.teams
    return {
      success: true,
      output: {
        teams: result.nodes,
        pageInfo: {
          hasNextPage: result.pageInfo.hasNextPage,
          endCursor: result.pageInfo.endCursor,
        },
      },
    }
  },

  outputs: {
    teams: {
      type: 'array',
      description: 'Array of teams',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Team ID' },
          name: { type: 'string', description: 'Team name' },
          key: { type: 'string', description: 'Team key (used in issue identifiers)' },
          description: { type: 'string', description: 'Team description' },
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

---[FILE: list_users.ts]---
Location: sim-main/apps/sim/tools/linear/list_users.ts

```typescript
import type { LinearListUsersParams, LinearListUsersResponse } from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearListUsersTool: ToolConfig<LinearListUsersParams, LinearListUsersResponse> = {
  id: 'linear_list_users',
  name: 'Linear List Users',
  description: 'List all users in the Linear workspace',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'linear',
  },

  params: {
    includeDisabled: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Include disabled/inactive users',
    },
    first: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Number of users to return (default: 50)',
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
        query ListUsers($includeDisabled: Boolean, $first: Int, $after: String) {
          users(includeDisabled: $includeDisabled, first: $first, after: $after) {
            nodes {
              id
              name
              email
              displayName
              active
              admin
              avatarUrl
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `,
      variables: {
        includeDisabled: params.includeDisabled || false,
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
        error: data.errors[0]?.message || 'Failed to list users',
        output: {},
      }
    }

    const result = data.data.users
    return {
      success: true,
      output: {
        users: result.nodes,
        pageInfo: {
          hasNextPage: result.pageInfo.hasNextPage,
          endCursor: result.pageInfo.endCursor,
        },
      },
    }
  },

  outputs: {
    users: {
      type: 'array',
      description: 'Array of workspace users',
      items: {
        type: 'object',
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
    pageInfo: {
      type: 'object',
      description: 'Pagination information',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_workflow_states.ts]---
Location: sim-main/apps/sim/tools/linear/list_workflow_states.ts

```typescript
import type {
  LinearListWorkflowStatesParams,
  LinearListWorkflowStatesResponse,
} from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearListWorkflowStatesTool: ToolConfig<
  LinearListWorkflowStatesParams,
  LinearListWorkflowStatesResponse
> = {
  id: 'linear_list_workflow_states',
  name: 'Linear List Workflow States',
  description: 'List all workflow states (statuses) in Linear',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'linear',
  },

  params: {
    teamId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by team ID',
    },
    first: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Number of states to return (default: 50)',
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
    body: (params) => {
      const filter: Record<string, any> = {}
      if (params.teamId) {
        filter.team = { id: { eq: params.teamId } }
      }

      return {
        query: `
          query ListWorkflowStates($filter: WorkflowStateFilter, $first: Int, $after: String) {
            workflowStates(filter: $filter, first: $first, after: $after) {
              nodes {
                id
                name
                type
                color
                position
                team {
                  id
                  name
                }
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
        `,
        variables: {
          filter: Object.keys(filter).length > 0 ? filter : undefined,
          first: params.first ? Number(params.first) : 50,
          after: params.after,
        },
      }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to list workflow states',
        output: {},
      }
    }

    const result = data.data.workflowStates
    return {
      success: true,
      output: {
        states: result.nodes,
        pageInfo: {
          hasNextPage: result.pageInfo.hasNextPage,
          endCursor: result.pageInfo.endCursor,
        },
      },
    }
  },

  outputs: {
    states: {
      type: 'array',
      description: 'Array of workflow states',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'State ID' },
          name: { type: 'string', description: 'State name (e.g., "Todo", "In Progress")' },
          type: {
            type: 'string',
            description: 'State type (e.g., "unstarted", "started", "completed")',
          },
          color: { type: 'string', description: 'State color' },
          position: { type: 'number', description: 'State position in workflow' },
          team: { type: 'object', description: 'Team this state belongs to' },
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

---[FILE: merge_customers.ts]---
Location: sim-main/apps/sim/tools/linear/merge_customers.ts

```typescript
import type { LinearMergeCustomersParams, LinearMergeCustomersResponse } from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearMergeCustomersTool: ToolConfig<
  LinearMergeCustomersParams,
  LinearMergeCustomersResponse
> = {
  id: 'linear_merge_customers',
  name: 'Linear Merge Customers',
  description: 'Merge two customers in Linear by moving all data from source to target',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'linear',
  },

  params: {
    sourceCustomerId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Source customer ID (will be deleted after merge)',
    },
    targetCustomerId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Target customer ID (will receive all data)',
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
        mutation CustomerMerge($sourceCustomerId: String!, $targetCustomerId: String!) {
          customerMerge(sourceCustomerId: $sourceCustomerId, targetCustomerId: $targetCustomerId) {
            success
            customer {
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
        }
      `,
      variables: {
        sourceCustomerId: params.sourceCustomerId,
        targetCustomerId: params.targetCustomerId,
      },
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to merge customers',
        output: {},
      }
    }

    const result = data.data.customerMerge
    return {
      success: result.success,
      output: {
        customer: result.customer,
      },
    }
  },

  outputs: {
    customer: {
      type: 'object',
      description: 'The merged target customer',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: read_issues.ts]---
Location: sim-main/apps/sim/tools/linear/read_issues.ts

```typescript
import type { LinearReadIssuesParams, LinearReadIssuesResponse } from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearReadIssuesTool: ToolConfig<LinearReadIssuesParams, LinearReadIssuesResponse> = {
  id: 'linear_read_issues',
  name: 'Linear Issue Reader',
  description: 'Fetch and filter issues from Linear',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'linear',
  },

  params: {
    teamId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Linear team ID to filter by',
    },
    projectId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Linear project ID to filter by',
    },
    assigneeId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'User ID to filter by assignee',
    },
    stateId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Workflow state ID to filter by status',
    },
    priority: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Priority to filter by (0=No priority, 1=Urgent, 2=High, 3=Normal, 4=Low)',
    },
    labelIds: {
      type: 'array',
      required: false,
      visibility: 'user-or-llm',
      description: 'Array of label IDs to filter by',
    },
    createdAfter: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter issues created after this date (ISO 8601 format)',
    },
    updatedAfter: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter issues updated after this date (ISO 8601 format)',
    },
    includeArchived: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Include archived issues (default: false)',
    },
    first: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Number of issues to return (default: 50, max: 250)',
    },
    after: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Pagination cursor for next page',
    },
    orderBy: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Sort order: "createdAt" or "updatedAt" (default: "updatedAt")',
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
    body: (params) => {
      const filter: Record<string, any> = {}

      if (params.teamId != null && params.teamId !== '') {
        filter.team = { id: { eq: params.teamId } }
      }
      if (params.projectId != null && params.projectId !== '') {
        filter.project = { id: { eq: params.projectId } }
      }
      if (params.assigneeId != null && params.assigneeId !== '') {
        filter.assignee = { id: { eq: params.assigneeId } }
      }
      if (params.stateId != null && params.stateId !== '') {
        filter.state = { id: { eq: params.stateId } }
      }
      if (params.priority != null) {
        filter.priority = { eq: Number(params.priority) }
      }
      if (params.labelIds != null && Array.isArray(params.labelIds) && params.labelIds.length > 0) {
        filter.labels = { some: { id: { in: params.labelIds } } }
      }
      if (params.createdAfter != null && params.createdAfter !== '') {
        filter.createdAt = { gte: params.createdAfter }
      }
      if (params.updatedAfter != null && params.updatedAfter !== '') {
        filter.updatedAt = { gte: params.updatedAfter }
      }

      const variables: Record<string, any> = {}
      if (Object.keys(filter).length > 0) {
        variables.filter = filter
      }
      if (params.first != null) {
        variables.first = Math.min(Number(params.first), 250)
      }
      if (params.after != null && params.after !== '') {
        variables.after = params.after
      }
      if (params.includeArchived != null) {
        variables.includeArchived = params.includeArchived
      }
      if (params.orderBy != null) {
        variables.orderBy = params.orderBy
      }

      return {
        query: `
        query Issues(
          $filter: IssueFilter
          $first: Int
          $after: String
          $includeArchived: Boolean
          $orderBy: PaginationOrderBy
        ) {
          issues(
            filter: $filter
            first: $first
            after: $after
            includeArchived: $includeArchived
            orderBy: $orderBy
          ) {
            nodes {
              id
              title
              description
              priority
              estimate
              url
              dueDate
              createdAt
              updatedAt
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
              cycle {
                id
                number
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
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `,
        variables,
      }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to fetch issues',
        output: {},
      }
    }

    if (!data.data?.issues) {
      return {
        success: false,
        error: 'No issues data returned',
        output: {},
      }
    }

    const issues = data.data.issues.nodes || []
    const pageInfo = data.data.issues.pageInfo || {}

    return {
      success: true,
      output: {
        issues: issues.map((issue: any) => ({
          id: issue.id,
          title: issue.title,
          description: issue.description,
          priority: issue.priority,
          estimate: issue.estimate,
          url: issue.url,
          dueDate: issue.dueDate,
          createdAt: issue.createdAt,
          updatedAt: issue.updatedAt,
          state: issue.state,
          assignee: issue.assignee,
          teamId: issue.team?.id,
          teamName: issue.team?.name,
          projectId: issue.project?.id,
          projectName: issue.project?.name,
          cycleId: issue.cycle?.id,
          cycleNumber: issue.cycle?.number,
          cycleName: issue.cycle?.name,
          labels: issue.labels?.nodes || [],
        })),
        hasNextPage: pageInfo.hasNextPage,
        endCursor: pageInfo.endCursor,
      },
    }
  },

  outputs: {
    issues: {
      type: 'array',
      description: 'Array of filtered issues from Linear',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Issue ID' },
          title: { type: 'string', description: 'Issue title' },
          description: { type: 'string', description: 'Issue description' },
          priority: { type: 'number', description: 'Issue priority' },
          estimate: { type: 'number', description: 'Issue estimate' },
          url: { type: 'string', description: 'Issue URL' },
          dueDate: { type: 'string', description: 'Due date (YYYY-MM-DD)' },
          createdAt: { type: 'string', description: 'Creation timestamp' },
          updatedAt: { type: 'string', description: 'Last update timestamp' },
          state: { type: 'object', description: 'Issue state' },
          assignee: { type: 'object', description: 'Assigned user' },
          teamId: { type: 'string', description: 'Team ID' },
          teamName: { type: 'string', description: 'Team name' },
          projectId: { type: 'string', description: 'Project ID' },
          projectName: { type: 'string', description: 'Project name' },
          cycleId: { type: 'string', description: 'Cycle ID' },
          cycleNumber: { type: 'number', description: 'Cycle number' },
          cycleName: { type: 'string', description: 'Cycle name' },
          labels: { type: 'array', description: 'Issue labels' },
        },
      },
    },
    hasNextPage: {
      type: 'boolean',
      description: 'Whether there are more results available',
    },
    endCursor: {
      type: 'string',
      description: 'Cursor for fetching the next page (use as "after" parameter)',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: remove_label_from_issue.ts]---
Location: sim-main/apps/sim/tools/linear/remove_label_from_issue.ts

```typescript
import type {
  LinearRemoveLabelFromIssueParams,
  LinearRemoveLabelResponse,
} from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearRemoveLabelFromIssueTool: ToolConfig<
  LinearRemoveLabelFromIssueParams,
  LinearRemoveLabelResponse
> = {
  id: 'linear_remove_label_from_issue',
  name: 'Linear Remove Label from Issue',
  description: 'Remove a label from an issue in Linear',
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
    labelId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Label ID to remove from the issue',
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
        mutation RemoveLabelFromIssue($issueId: String!, $labelId: String!) {
          issueRemoveLabel(id: $issueId, labelId: $labelId) {
            success
            issue {
              id
            }
          }
        }
      `,
      variables: {
        issueId: params.issueId,
        labelId: params.labelId,
      },
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to remove label from issue',
        output: {},
      }
    }

    const result = data.data.issueRemoveLabel
    return {
      success: result.success,
      output: {
        success: result.success,
        issueId: result.issue?.id || '',
      },
    }
  },

  outputs: {
    success: {
      type: 'boolean',
      description: 'Whether the label was successfully removed',
    },
    issueId: {
      type: 'string',
      description: 'The ID of the issue',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: remove_label_from_project.ts]---
Location: sim-main/apps/sim/tools/linear/remove_label_from_project.ts

```typescript
import type {
  LinearRemoveLabelFromProjectParams,
  LinearRemoveLabelFromProjectResponse,
} from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearRemoveLabelFromProjectTool: ToolConfig<
  LinearRemoveLabelFromProjectParams,
  LinearRemoveLabelFromProjectResponse
> = {
  id: 'linear_remove_label_from_project',
  name: 'Linear Remove Label from Project',
  description: 'Remove a label from a project in Linear',
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
      description: 'Project ID',
    },
    labelId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Label ID to remove',
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
        mutation ProjectRemoveLabel($id: String!, $labelId: String!) {
          projectRemoveLabel(id: $id, labelId: $labelId) {
            success
            project {
              id
            }
          }
        }
      `,
      variables: {
        id: params.projectId,
        labelId: params.labelId,
      },
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to remove label from project',
        output: {},
      }
    }

    const result = data.data.projectRemoveLabel
    return {
      success: result.success,
      output: {
        success: result.success,
        projectId: result.project?.id,
      },
    }
  },

  outputs: {
    success: {
      type: 'boolean',
      description: 'Whether the label was removed successfully',
    },
    projectId: {
      type: 'string',
      description: 'The project ID',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: search_issues.ts]---
Location: sim-main/apps/sim/tools/linear/search_issues.ts

```typescript
import type { LinearSearchIssuesParams, LinearSearchIssuesResponse } from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearSearchIssuesTool: ToolConfig<
  LinearSearchIssuesParams,
  LinearSearchIssuesResponse
> = {
  id: 'linear_search_issues',
  name: 'Linear Search Issues',
  description: 'Search for issues in Linear using full-text search',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'linear',
  },

  params: {
    query: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Search query string',
    },
    teamId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by team ID',
    },
    includeArchived: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Include archived issues in search results',
    },
    first: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Number of results to return (default: 50)',
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
    body: (params) => {
      const filter: Record<string, any> = {}
      if (params.teamId) {
        filter.team = { id: { eq: params.teamId } }
      }

      return {
        query: `
          query SearchIssues($term: String!, $filter: IssueFilter, $first: Int, $includeArchived: Boolean) {
            searchIssues(term: $term, filter: $filter, first: $first, includeArchived: $includeArchived) {
              nodes {
                id
                title
                description
                priority
                estimate
                url
                createdAt
                updatedAt
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
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
        `,
        variables: {
          term: params.query,
          filter: Object.keys(filter).length > 0 ? filter : undefined,
          first: params.first || 50,
          includeArchived: params.includeArchived || false,
        },
      }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to search issues',
        output: {},
      }
    }

    const result = data.data.searchIssues
    return {
      success: true,
      output: {
        issues: result.nodes.map((issue: any) => ({
          id: issue.id,
          title: issue.title,
          description: issue.description,
          priority: issue.priority,
          estimate: issue.estimate,
          url: issue.url,
          createdAt: issue.createdAt,
          updatedAt: issue.updatedAt,
          archivedAt: issue.archivedAt,
          state: issue.state,
          assignee: issue.assignee,
          teamId: issue.team?.id,
          projectId: issue.project?.id,
          labels: issue.labels?.nodes || [],
        })),
        pageInfo: {
          hasNextPage: result.pageInfo.hasNextPage,
          endCursor: result.pageInfo.endCursor,
        },
      },
    }
  },

  outputs: {
    issues: {
      type: 'array',
      description: 'Array of matching issues',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Issue ID' },
          title: { type: 'string', description: 'Issue title' },
          description: { type: 'string', description: 'Issue description' },
          priority: { type: 'number', description: 'Issue priority' },
          state: { type: 'object', description: 'Issue state' },
          assignee: { type: 'object', description: 'Assigned user' },
          labels: { type: 'array', description: 'Issue labels' },
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

````
