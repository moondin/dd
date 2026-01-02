---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 703
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 703 of 933)

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

---[FILE: create_customer_status.ts]---
Location: sim-main/apps/sim/tools/linear/create_customer_status.ts

```typescript
import type {
  LinearCreateCustomerStatusParams,
  LinearCreateCustomerStatusResponse,
} from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearCreateCustomerStatusTool: ToolConfig<
  LinearCreateCustomerStatusParams,
  LinearCreateCustomerStatusResponse
> = {
  id: 'linear_create_customer_status',
  name: 'Linear Create Customer Status',
  description: 'Create a new customer status in Linear',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'linear',
  },

  params: {
    name: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Customer status name',
    },
    color: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Status color (hex code)',
    },
    displayName: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Display name for the status',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Status description',
    },
    position: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Position in status list',
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
      const input: Record<string, any> = {
        name: params.name,
        color: params.color,
      }

      if (params.displayName != null && params.displayName !== '') {
        input.displayName = params.displayName
      }
      if (params.description != null && params.description !== '') {
        input.description = params.description
      }
      if (params.position != null) {
        input.position = params.position
      }

      return {
        query: `
          mutation CustomerStatusCreate($input: CustomerStatusCreateInput!) {
            customerStatusCreate(input: $input) {
              success
              status {
                id
                name
                displayName
                description
                color
                position
                createdAt
                archivedAt
              }
            }
          }
        `,
        variables: {
          input,
        },
      }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to create customer status',
        output: {},
      }
    }

    const result = data.data.customerStatusCreate
    if (!result.success) {
      return {
        success: false,
        error: 'Customer status creation was not successful',
        output: {},
      }
    }

    return {
      success: true,
      output: {
        customerStatus: result.status,
      },
    }
  },

  outputs: {
    customerStatus: {
      type: 'object',
      description: 'The created customer status',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_customer_tier.ts]---
Location: sim-main/apps/sim/tools/linear/create_customer_tier.ts

```typescript
import type {
  LinearCreateCustomerTierParams,
  LinearCreateCustomerTierResponse,
} from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearCreateCustomerTierTool: ToolConfig<
  LinearCreateCustomerTierParams,
  LinearCreateCustomerTierResponse
> = {
  id: 'linear_create_customer_tier',
  name: 'Linear Create Customer Tier',
  description: 'Create a new customer tier in Linear',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'linear',
  },

  params: {
    name: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Customer tier name',
    },
    color: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Tier color (hex code)',
    },
    displayName: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Display name for the tier',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Tier description',
    },
    position: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Position in tier list',
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
      const input: Record<string, any> = {
        name: params.name,
        color: params.color,
      }

      if (params.displayName != null && params.displayName !== '') {
        input.displayName = params.displayName
      }
      if (params.description != null && params.description !== '') {
        input.description = params.description
      }
      if (params.position != null) {
        input.position = params.position
      }

      return {
        query: `
          mutation CustomerTierCreate($input: CustomerTierCreateInput!) {
            customerTierCreate(input: $input) {
              success
              customerTier {
                id
                name
                displayName
                description
                color
                position
                createdAt
                archivedAt
              }
            }
          }
        `,
        variables: {
          input,
        },
      }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to create customer tier',
        output: {},
      }
    }

    const result = data.data.customerTierCreate
    if (!result.success) {
      return {
        success: false,
        error: 'Customer tier creation was not successful',
        output: {},
      }
    }

    return {
      success: true,
      output: {
        customerTier: result.customerTier,
      },
    }
  },

  outputs: {
    customerTier: {
      type: 'object',
      description: 'The created customer tier',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_cycle.ts]---
Location: sim-main/apps/sim/tools/linear/create_cycle.ts

```typescript
import type { LinearCreateCycleParams, LinearCreateCycleResponse } from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearCreateCycleTool: ToolConfig<LinearCreateCycleParams, LinearCreateCycleResponse> =
  {
    id: 'linear_create_cycle',
    name: 'Linear Create Cycle',
    description: 'Create a new cycle (sprint/iteration) in Linear',
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
        description: 'Team ID to create the cycle in',
      },
      startsAt: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description: 'Cycle start date (ISO format)',
      },
      endsAt: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description: 'Cycle end date (ISO format)',
      },
      name: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Cycle name (optional, will be auto-generated if not provided)',
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
        const input: Record<string, any> = {
          teamId: params.teamId,
          startsAt: params.startsAt,
          endsAt: params.endsAt,
        }

        if (params.name != null && params.name !== '') input.name = params.name

        return {
          query: `
          mutation CreateCycle($input: CycleCreateInput!) {
            cycleCreate(input: $input) {
              success
              cycle {
                id
                number
                name
                startsAt
                endsAt
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
            input,
          },
        }
      },
    },

    transformResponse: async (response) => {
      const data = await response.json()

      if (data.errors) {
        return {
          success: false,
          error: data.errors[0]?.message || 'Failed to create cycle',
          output: {},
        }
      }

      const result = data.data.cycleCreate
      if (!result.success) {
        return {
          success: false,
          error: 'Cycle creation was not successful',
          output: {},
        }
      }

      return {
        success: true,
        output: {
          cycle: result.cycle,
        },
      }
    },

    outputs: {
      cycle: {
        type: 'object',
        description: 'The created cycle',
        properties: {
          id: { type: 'string', description: 'Cycle ID' },
          number: { type: 'number', description: 'Cycle number' },
          name: { type: 'string', description: 'Cycle name' },
          startsAt: { type: 'string', description: 'Start date' },
          endsAt: { type: 'string', description: 'End date' },
          team: { type: 'object', description: 'Team this cycle belongs to' },
        },
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: create_favorite.ts]---
Location: sim-main/apps/sim/tools/linear/create_favorite.ts

```typescript
import type { LinearCreateFavoriteParams, LinearCreateFavoriteResponse } from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearCreateFavoriteTool: ToolConfig<
  LinearCreateFavoriteParams,
  LinearCreateFavoriteResponse
> = {
  id: 'linear_create_favorite',
  name: 'Linear Create Favorite',
  description: 'Bookmark an issue, project, cycle, or label in Linear',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'linear',
  },

  params: {
    issueId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Issue ID to favorite',
    },
    projectId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Project ID to favorite',
    },
    cycleId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Cycle ID to favorite',
    },
    labelId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Label ID to favorite',
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
      const input: Record<string, any> = {}

      if (params.issueId != null && params.issueId !== '') input.issueId = params.issueId
      if (params.projectId != null && params.projectId !== '') input.projectId = params.projectId
      if (params.cycleId != null && params.cycleId !== '') input.cycleId = params.cycleId
      if (params.labelId != null && params.labelId !== '') input.labelId = params.labelId

      if (Object.keys(input).length === 0) {
        throw new Error('At least one ID (issue, project, cycle, or label) must be provided')
      }

      return {
        query: `
          mutation CreateFavorite($input: FavoriteCreateInput!) {
            favoriteCreate(input: $input) {
              success
              favorite {
                id
                type
                issue {
                  id
                  title
                }
                project {
                  id
                  name
                }
                cycle {
                  id
                  name
                }
              }
            }
          }
        `,
        variables: {
          input,
        },
      }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to create favorite',
        output: {},
      }
    }

    const result = data.data.favoriteCreate
    if (!result.success) {
      return {
        success: false,
        error: 'Favorite creation was not successful',
        output: {},
      }
    }

    return {
      success: true,
      output: {
        favorite: result.favorite,
      },
    }
  },

  outputs: {
    favorite: {
      type: 'object',
      description: 'The created favorite',
      properties: {
        id: { type: 'string', description: 'Favorite ID' },
        type: { type: 'string', description: 'Favorite type' },
        issue: { type: 'object', description: 'Favorited issue (if applicable)' },
        project: { type: 'object', description: 'Favorited project (if applicable)' },
        cycle: { type: 'object', description: 'Favorited cycle (if applicable)' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_issue.ts]---
Location: sim-main/apps/sim/tools/linear/create_issue.ts

```typescript
import type { LinearCreateIssueParams, LinearCreateIssueResponse } from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearCreateIssueTool: ToolConfig<LinearCreateIssueParams, LinearCreateIssueResponse> =
  {
    id: 'linear_create_issue',
    name: 'Linear Issue Writer',
    description: 'Create a new issue in Linear',
    version: '1.0.0',

    oauth: {
      required: true,
      provider: 'linear',
    },

    params: {
      teamId: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'Linear team ID',
      },
      projectId: {
        type: 'string',
        required: false,
        visibility: 'user-only',
        description: 'Linear project ID',
      },
      title: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description: 'Issue title',
      },
      description: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Issue description',
      },
      stateId: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Workflow state ID (status)',
      },
      assigneeId: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'User ID to assign the issue to',
      },
      priority: {
        type: 'number',
        required: false,
        visibility: 'user-or-llm',
        description: 'Priority (0=No priority, 1=Urgent, 2=High, 3=Normal, 4=Low)',
      },
      estimate: {
        type: 'number',
        required: false,
        visibility: 'user-or-llm',
        description: 'Estimate in points',
      },
      labelIds: {
        type: 'array',
        required: false,
        visibility: 'user-or-llm',
        description: 'Array of label IDs to set on the issue',
      },
      cycleId: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Cycle ID to assign the issue to',
      },
      parentId: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Parent issue ID (for creating sub-issues)',
      },
      dueDate: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Due date in ISO 8601 format (date only: YYYY-MM-DD)',
      },
      subscriberIds: {
        type: 'array',
        required: false,
        visibility: 'user-or-llm',
        description: 'Array of user IDs to subscribe to the issue',
      },
      projectMilestoneId: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Project milestone ID to associate with the issue',
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
        if (!params.title || !params.title.trim()) {
          throw new Error('Title is required to create a Linear issue')
        }

        const input: Record<string, any> = {
          teamId: params.teamId,
          title: params.title,
        }

        if (params.projectId != null && params.projectId !== '') {
          input.projectId = params.projectId
        }
        if (params.description != null && params.description !== '') {
          input.description = params.description
        }
        if (params.stateId != null && params.stateId !== '') {
          input.stateId = params.stateId
        }
        if (params.assigneeId != null && params.assigneeId !== '') {
          input.assigneeId = params.assigneeId
        }
        if (params.priority != null) {
          input.priority = Number(params.priority)
        }
        if (params.estimate != null) {
          input.estimate = Number(params.estimate)
        }
        if (params.labelIds != null && Array.isArray(params.labelIds)) {
          input.labelIds = params.labelIds
        }
        if (params.cycleId != null && params.cycleId !== '') {
          input.cycleId = params.cycleId
        }
        if (params.parentId != null && params.parentId !== '') {
          input.parentId = params.parentId
        }
        if (params.dueDate != null && params.dueDate !== '') {
          input.dueDate = params.dueDate
        }
        if (params.subscriberIds != null && Array.isArray(params.subscriberIds)) {
          input.subscriberIds = params.subscriberIds
        }
        if (params.projectMilestoneId != null && params.projectMilestoneId !== '') {
          input.projectMilestoneId = params.projectMilestoneId
        }

        return {
          query: `
        mutation CreateIssue($input: IssueCreateInput!) {
          issueCreate(input: $input) {
            issue {
              id
              title
              description
              priority
              estimate
              url
              dueDate
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
              team { id }
              project { id }
              cycle {
                id
                number
                name
              }
              parent {
                id
                title
              }
              projectMilestone {
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
        }
      `,
          variables: {
            input,
          },
        }
      },
    },

    transformResponse: async (response) => {
      const data = await response.json()

      if (data.errors) {
        return {
          success: false,
          error: data.errors[0]?.message || 'Failed to create issue',
          output: {},
        }
      }

      const result = data.data?.issueCreate
      if (!result) {
        return {
          success: false,
          error: 'Issue creation was not successful',
          output: {},
        }
      }

      const issue = result.issue
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
            dueDate: issue.dueDate,
            state: issue.state,
            assignee: issue.assignee,
            teamId: issue.team?.id,
            projectId: issue.project?.id,
            cycleId: issue.cycle?.id,
            cycleNumber: issue.cycle?.number,
            cycleName: issue.cycle?.name,
            parentId: issue.parent?.id,
            parentTitle: issue.parent?.title,
            projectMilestoneId: issue.projectMilestone?.id,
            projectMilestoneName: issue.projectMilestone?.name,
            labels: issue.labels?.nodes || [],
          },
        },
      }
    },

    outputs: {
      issue: {
        type: 'object',
        description: 'The created issue with all its properties',
        properties: {
          id: { type: 'string', description: 'Issue ID' },
          title: { type: 'string', description: 'Issue title' },
          description: { type: 'string', description: 'Issue description' },
          priority: { type: 'number', description: 'Issue priority' },
          estimate: { type: 'number', description: 'Issue estimate' },
          url: { type: 'string', description: 'Issue URL' },
          dueDate: { type: 'string', description: 'Due date (YYYY-MM-DD)' },
          state: { type: 'object', description: 'Issue state' },
          assignee: { type: 'object', description: 'Assigned user' },
          teamId: { type: 'string', description: 'Team ID' },
          projectId: { type: 'string', description: 'Project ID' },
          cycleId: { type: 'string', description: 'Cycle ID' },
          cycleNumber: { type: 'number', description: 'Cycle number' },
          cycleName: { type: 'string', description: 'Cycle name' },
          parentId: { type: 'string', description: 'Parent issue ID' },
          parentTitle: { type: 'string', description: 'Parent issue title' },
          projectMilestoneId: { type: 'string', description: 'Project milestone ID' },
          projectMilestoneName: { type: 'string', description: 'Project milestone name' },
          labels: { type: 'array', description: 'Issue labels' },
        },
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: create_issue_relation.ts]---
Location: sim-main/apps/sim/tools/linear/create_issue_relation.ts

```typescript
import type {
  LinearCreateIssueRelationParams,
  LinearCreateIssueRelationResponse,
} from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearCreateIssueRelationTool: ToolConfig<
  LinearCreateIssueRelationParams,
  LinearCreateIssueRelationResponse
> = {
  id: 'linear_create_issue_relation',
  name: 'Linear Create Issue Relation',
  description: 'Link two issues together in Linear (blocks, relates to, duplicates)',
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
      description: 'Source issue ID',
    },
    relatedIssueId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Target issue ID to link to',
    },
    type: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description:
        'Relation type: "blocks", "duplicate", or "related". Note: When creating "blocks" from A to B, the inverse relation (B blocked by A) is automatically created.',
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
        mutation CreateIssueRelation($input: IssueRelationCreateInput!) {
          issueRelationCreate(input: $input) {
            success
            issueRelation {
              id
              type
              issue {
                id
                title
              }
              relatedIssue {
                id
                title
              }
            }
          }
        }
      `,
      variables: {
        input: {
          issueId: params.issueId,
          relatedIssueId: params.relatedIssueId,
          type: params.type,
        },
      },
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to create issue relation',
        output: {},
      }
    }

    const result = data.data.issueRelationCreate
    if (!result.success) {
      return {
        success: false,
        error: 'Issue relation creation was not successful',
        output: {},
      }
    }

    return {
      success: true,
      output: {
        relation: result.issueRelation,
      },
    }
  },

  outputs: {
    relation: {
      type: 'object',
      description: 'The created issue relation',
      properties: {
        id: { type: 'string', description: 'Relation ID' },
        type: { type: 'string', description: 'Relation type' },
        issue: { type: 'object', description: 'Source issue' },
        relatedIssue: { type: 'object', description: 'Target issue' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_label.ts]---
Location: sim-main/apps/sim/tools/linear/create_label.ts

```typescript
import type { LinearCreateLabelParams, LinearCreateLabelResponse } from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearCreateLabelTool: ToolConfig<LinearCreateLabelParams, LinearCreateLabelResponse> =
  {
    id: 'linear_create_label',
    name: 'Linear Create Label',
    description: 'Create a new label in Linear',
    version: '1.0.0',

    oauth: {
      required: true,
      provider: 'linear',
    },

    params: {
      name: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description: 'Label name',
      },
      color: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Label color (hex format, e.g., "#ff0000")',
      },
      description: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Label description',
      },
      teamId: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Team ID (if omitted, creates workspace label)',
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
        const input: Record<string, any> = {
          name: params.name,
        }

        if (params.color != null && params.color !== '') input.color = params.color
        if (params.description != null && params.description !== '')
          input.description = params.description
        if (params.teamId != null && params.teamId !== '') input.teamId = params.teamId

        return {
          query: `
          mutation CreateLabel($input: IssueLabelCreateInput!) {
            issueLabelCreate(input: $input) {
              success
              issueLabel {
                id
                name
                color
                description
                team {
                  id
                  name
                }
              }
            }
          }
        `,
          variables: {
            input,
          },
        }
      },
    },

    transformResponse: async (response) => {
      const data = await response.json()

      if (data.errors) {
        return {
          success: false,
          error: data.errors[0]?.message || 'Failed to create label',
          output: {},
        }
      }

      const result = data.data.issueLabelCreate
      if (!result.success) {
        return {
          success: false,
          error: 'Label creation was not successful',
          output: {},
        }
      }

      return {
        success: true,
        output: {
          label: result.issueLabel,
        },
      }
    },

    outputs: {
      label: {
        type: 'object',
        description: 'The created label',
        properties: {
          id: { type: 'string', description: 'Label ID' },
          name: { type: 'string', description: 'Label name' },
          color: { type: 'string', description: 'Label color' },
          description: { type: 'string', description: 'Label description' },
          team: { type: 'object', description: 'Team this label belongs to' },
        },
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: create_project.ts]---
Location: sim-main/apps/sim/tools/linear/create_project.ts

```typescript
import type { LinearCreateProjectParams, LinearCreateProjectResponse } from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearCreateProjectTool: ToolConfig<
  LinearCreateProjectParams,
  LinearCreateProjectResponse
> = {
  id: 'linear_create_project',
  name: 'Linear Create Project',
  description: 'Create a new project in Linear',
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
      description: 'Team ID to create the project in',
    },
    name: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Project name',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Project description',
    },
    leadId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'User ID of the project lead',
    },
    startDate: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Project start date (ISO format)',
    },
    targetDate: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Project target date (ISO format)',
    },
    priority: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Project priority (0-4)',
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
      const input: Record<string, any> = {
        teamIds: [params.teamId],
        name: params.name,
      }

      if (params.description != null && params.description !== '') {
        input.description = params.description
      }
      if (params.leadId != null && params.leadId !== '') {
        input.leadId = params.leadId
      }
      if (params.startDate != null && params.startDate !== '') {
        input.startDate = params.startDate
      }
      if (params.targetDate != null && params.targetDate !== '') {
        input.targetDate = params.targetDate
      }
      if (params.priority != null) {
        input.priority = Number(params.priority)
      }

      return {
        query: `
          mutation CreateProject($input: ProjectCreateInput!) {
            projectCreate(input: $input) {
              success
              project {
                id
                name
                description
                state
                priority
                startDate
                targetDate
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
          }
        `,
        variables: {
          input,
        },
      }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to create project',
        output: {},
      }
    }

    const result = data.data.projectCreate
    if (!result.success) {
      return {
        success: false,
        error: 'Project creation was not successful',
        output: {},
      }
    }

    const project = result.project
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
      description: 'The created project',
      properties: {
        id: { type: 'string', description: 'Project ID' },
        name: { type: 'string', description: 'Project name' },
        description: { type: 'string', description: 'Project description' },
        state: { type: 'string', description: 'Project state' },
        priority: { type: 'number', description: 'Project priority' },
        lead: { type: 'object', description: 'Project lead' },
        teams: { type: 'array', description: 'Associated teams' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_project_label.ts]---
Location: sim-main/apps/sim/tools/linear/create_project_label.ts

```typescript
import type {
  LinearCreateProjectLabelParams,
  LinearCreateProjectLabelResponse,
} from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearCreateProjectLabelTool: ToolConfig<
  LinearCreateProjectLabelParams,
  LinearCreateProjectLabelResponse
> = {
  id: 'linear_create_project_label',
  name: 'Linear Create Project Label',
  description: 'Create a new project label in Linear',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'linear',
  },

  params: {
    projectId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The project for this label',
    },
    name: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Project label name',
    },
    color: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Label color (hex code)',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Label description',
    },
    isGroup: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Whether this is a label group',
    },
    parentId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Parent label group ID',
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
      const input: Record<string, any> = {
        projectId: params.projectId,
        name: params.name,
      }

      if (params.color != null && params.color !== '') {
        input.color = params.color
      }
      if (params.description != null && params.description !== '') {
        input.description = params.description
      }
      if (params.isGroup != null) {
        input.isGroup = params.isGroup
      }
      if (params.parentId != null && params.parentId !== '') {
        input.parentId = params.parentId
      }

      return {
        query: `
          mutation ProjectLabelCreate($input: ProjectLabelCreateInput!) {
            projectLabelCreate(input: $input) {
              success
              projectLabel {
                id
                name
                description
                color
                isGroup
                createdAt
                archivedAt
              }
            }
          }
        `,
        variables: {
          input,
        },
      }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to create project label',
        output: {},
      }
    }

    const result = data.data.projectLabelCreate
    if (!result.success) {
      return {
        success: false,
        error: 'Project label creation was not successful',
        output: {},
      }
    }

    return {
      success: true,
      output: {
        projectLabel: result.projectLabel,
      },
    }
  },

  outputs: {
    projectLabel: {
      type: 'object',
      description: 'The created project label',
    },
  },
}
```

--------------------------------------------------------------------------------

````
