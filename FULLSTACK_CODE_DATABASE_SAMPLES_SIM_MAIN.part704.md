---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 704
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 704 of 933)

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

---[FILE: create_project_link.ts]---
Location: sim-main/apps/sim/tools/linear/create_project_link.ts

```typescript
import type {
  LinearCreateProjectLinkParams,
  LinearCreateProjectLinkResponse,
} from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearCreateProjectLinkTool: ToolConfig<
  LinearCreateProjectLinkParams,
  LinearCreateProjectLinkResponse
> = {
  id: 'linear_create_project_link',
  name: 'Linear Create Project Link',
  description: 'Add an external link to a project in Linear',
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
      description: 'Project ID to add link to',
    },
    url: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'URL of the external link',
    },
    label: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Link label/title',
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
        url: params.url,
      }

      if (params.label != null && params.label !== '') input.label = params.label

      return {
        query: `
          mutation CreateProjectLink($input: ProjectLinkCreateInput!) {
            projectLinkCreate(input: $input) {
              success
              projectLink {
                id
                url
                label
                createdAt
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
        error: data.errors[0]?.message || 'Failed to create project link',
        output: {},
      }
    }

    const result = data.data.projectLinkCreate
    if (!result.success) {
      return {
        success: false,
        error: 'Project link creation was not successful',
        output: {},
      }
    }

    return {
      success: true,
      output: {
        link: result.projectLink,
      },
    }
  },

  outputs: {
    link: {
      type: 'object',
      description: 'The created project link',
      properties: {
        id: { type: 'string', description: 'Link ID' },
        url: { type: 'string', description: 'Link URL' },
        label: { type: 'string', description: 'Link label' },
        createdAt: { type: 'string', description: 'Creation timestamp' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_project_milestone.ts]---
Location: sim-main/apps/sim/tools/linear/create_project_milestone.ts

```typescript
import type {
  LinearCreateProjectMilestoneParams,
  LinearCreateProjectMilestoneResponse,
} from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearCreateProjectMilestoneTool: ToolConfig<
  LinearCreateProjectMilestoneParams,
  LinearCreateProjectMilestoneResponse
> = {
  id: 'linear_create_project_milestone',
  name: 'Linear Create Project Milestone',
  description: 'Create a new project milestone in Linear',
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
    name: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Milestone name',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Milestone description',
    },
    targetDate: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Target date (ISO 8601)',
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

      if (params.description != null && params.description !== '') {
        input.description = params.description
      }
      if (params.targetDate != null && params.targetDate !== '') {
        input.targetDate = params.targetDate
      }

      return {
        query: `
          mutation ProjectMilestoneCreate($input: ProjectMilestoneCreateInput!) {
            projectMilestoneCreate(input: $input) {
              success
              projectMilestone {
                id
                name
                description
                projectId
                targetDate
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
        error: data.errors[0]?.message || 'Failed to create project milestone',
        output: {},
      }
    }

    const result = data.data.projectMilestoneCreate
    if (!result.success) {
      return {
        success: false,
        error: 'Project milestone creation was not successful',
        output: {},
      }
    }

    return {
      success: true,
      output: {
        projectMilestone: result.projectMilestone,
      },
    }
  },

  outputs: {
    projectMilestone: {
      type: 'object',
      description: 'The created project milestone',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_project_status.ts]---
Location: sim-main/apps/sim/tools/linear/create_project_status.ts

```typescript
import type {
  LinearCreateProjectStatusParams,
  LinearCreateProjectStatusResponse,
} from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearCreateProjectStatusTool: ToolConfig<
  LinearCreateProjectStatusParams,
  LinearCreateProjectStatusResponse
> = {
  id: 'linear_create_project_status',
  name: 'Linear Create Project Status',
  description: 'Create a new project status in Linear',
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
      description: 'The project to create the status for',
    },
    name: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Project status name',
    },
    color: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Status color (hex code)',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Status description',
    },
    indefinite: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Whether the status is indefinite',
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
        projectId: params.projectId,
        name: params.name,
        color: params.color,
      }

      if (params.description != null && params.description !== '') {
        input.description = params.description
      }
      if (params.indefinite != null) {
        input.indefinite = params.indefinite
      }
      if (params.position != null) {
        input.position = params.position
      }

      return {
        query: `
          mutation ProjectStatusCreate($input: ProjectStatusCreateInput!) {
            projectStatusCreate(input: $input) {
              success
              status {
                id
                name
                description
                color
                indefinite
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
        error: data.errors[0]?.message || 'Failed to create project status',
        output: {},
      }
    }

    const result = data.data.projectStatusCreate
    if (!result.success) {
      return {
        success: false,
        error: 'Project status creation was not successful',
        output: {},
      }
    }

    return {
      success: true,
      output: {
        projectStatus: result.status,
      },
    }
  },

  outputs: {
    projectStatus: {
      type: 'object',
      description: 'The created project status',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_project_update.ts]---
Location: sim-main/apps/sim/tools/linear/create_project_update.ts

```typescript
import type {
  LinearCreateProjectUpdateParams,
  LinearCreateProjectUpdateResponse,
} from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearCreateProjectUpdateTool: ToolConfig<
  LinearCreateProjectUpdateParams,
  LinearCreateProjectUpdateResponse
> = {
  id: 'linear_create_project_update',
  name: 'Linear Create Project Update',
  description: 'Post a status update for a project in Linear',
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
      description: 'Project ID to post update for',
    },
    body: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Update message (supports Markdown)',
    },
    health: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Project health: "onTrack", "atRisk", or "offTrack"',
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
        body: params.body,
      }

      if (params.health != null && params.health !== '') input.health = params.health

      return {
        query: `
          mutation CreateProjectUpdate($input: ProjectUpdateCreateInput!) {
            projectUpdateCreate(input: $input) {
              success
              projectUpdate {
                id
                body
                health
                createdAt
                user {
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
        error: data.errors[0]?.message || 'Failed to create project update',
        output: {},
      }
    }

    const result = data.data.projectUpdateCreate
    if (!result.success) {
      return {
        success: false,
        error: 'Project update creation was not successful',
        output: {},
      }
    }

    return {
      success: true,
      output: {
        update: result.projectUpdate,
      },
    }
  },

  outputs: {
    update: {
      type: 'object',
      description: 'The created project update',
      properties: {
        id: { type: 'string', description: 'Update ID' },
        body: { type: 'string', description: 'Update message' },
        health: { type: 'string', description: 'Project health status' },
        createdAt: { type: 'string', description: 'Creation timestamp' },
        user: { type: 'object', description: 'User who created the update' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_workflow_state.ts]---
Location: sim-main/apps/sim/tools/linear/create_workflow_state.ts

```typescript
import type {
  LinearCreateWorkflowStateParams,
  LinearCreateWorkflowStateResponse,
} from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearCreateWorkflowStateTool: ToolConfig<
  LinearCreateWorkflowStateParams,
  LinearCreateWorkflowStateResponse
> = {
  id: 'linear_create_workflow_state',
  name: 'Linear Create Workflow State',
  description: 'Create a new workflow state (status) in Linear',
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
      description: 'Team ID to create the state in',
    },
    name: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'State name (e.g., "In Review")',
    },
    color: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'State color (hex format)',
    },
    type: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'State type: "backlog", "unstarted", "started", "completed", or "canceled"',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'State description',
    },
    position: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Position in the workflow',
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
        name: params.name,
        type: params.type,
      }

      if (params.color != null && params.color !== '') {
        input.color = params.color
      }
      if (params.description != null && params.description !== '') {
        input.description = params.description
      }
      if (params.position != null) {
        input.position = Number(params.position)
      }

      return {
        query: `
          mutation CreateWorkflowState($input: WorkflowStateCreateInput!) {
            workflowStateCreate(input: $input) {
              success
              workflowState {
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
        error: data.errors[0]?.message || 'Failed to create workflow state',
        output: {},
      }
    }

    const result = data.data.workflowStateCreate
    if (!result.success) {
      return {
        success: false,
        error: 'Workflow state creation was not successful',
        output: {},
      }
    }

    return {
      success: true,
      output: {
        state: result.workflowState,
      },
    }
  },

  outputs: {
    state: {
      type: 'object',
      description: 'The created workflow state',
      properties: {
        id: { type: 'string', description: 'State ID' },
        name: { type: 'string', description: 'State name' },
        type: { type: 'string', description: 'State type' },
        color: { type: 'string', description: 'State color' },
        position: { type: 'number', description: 'State position' },
        team: { type: 'object', description: 'Team this state belongs to' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_attachment.ts]---
Location: sim-main/apps/sim/tools/linear/delete_attachment.ts

```typescript
import type {
  LinearDeleteAttachmentParams,
  LinearDeleteAttachmentResponse,
} from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearDeleteAttachmentTool: ToolConfig<
  LinearDeleteAttachmentParams,
  LinearDeleteAttachmentResponse
> = {
  id: 'linear_delete_attachment',
  name: 'Linear Delete Attachment',
  description: 'Delete an attachment from Linear',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'linear',
  },

  params: {
    attachmentId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Attachment ID to delete',
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
        mutation DeleteAttachment($id: String!) {
          attachmentDelete(id: $id) {
            success
          }
        }
      `,
      variables: {
        id: params.attachmentId,
      },
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to delete attachment',
        output: {},
      }
    }

    return {
      success: data.data.attachmentDelete.success,
      output: {
        success: data.data.attachmentDelete.success,
      },
    }
  },

  outputs: {
    success: {
      type: 'boolean',
      description: 'Whether the delete operation was successful',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_comment.ts]---
Location: sim-main/apps/sim/tools/linear/delete_comment.ts

```typescript
import type { LinearDeleteCommentParams, LinearDeleteCommentResponse } from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearDeleteCommentTool: ToolConfig<
  LinearDeleteCommentParams,
  LinearDeleteCommentResponse
> = {
  id: 'linear_delete_comment',
  name: 'Linear Delete Comment',
  description: 'Delete a comment from Linear',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'linear',
  },

  params: {
    commentId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Comment ID to delete',
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
        mutation DeleteComment($id: String!) {
          commentDelete(id: $id) {
            success
          }
        }
      `,
      variables: {
        id: params.commentId,
      },
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to delete comment',
        output: {},
      }
    }

    return {
      success: data.data.commentDelete.success,
      output: {
        success: data.data.commentDelete.success,
      },
    }
  },

  outputs: {
    success: {
      type: 'boolean',
      description: 'Whether the delete operation was successful',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_customer.ts]---
Location: sim-main/apps/sim/tools/linear/delete_customer.ts

```typescript
import type { LinearDeleteCustomerParams, LinearDeleteCustomerResponse } from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearDeleteCustomerTool: ToolConfig<
  LinearDeleteCustomerParams,
  LinearDeleteCustomerResponse
> = {
  id: 'linear_delete_customer',
  name: 'Linear Delete Customer',
  description: 'Delete a customer in Linear',
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
      description: 'Customer ID to delete',
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
        mutation CustomerDelete($id: String!) {
          customerDelete(id: $id) {
            success
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
        error: data.errors[0]?.message || 'Failed to delete customer',
        output: {},
      }
    }

    const result = data.data.customerDelete
    return {
      success: result.success,
      output: {
        success: result.success,
      },
    }
  },

  outputs: {
    success: {
      type: 'boolean',
      description: 'Whether the deletion was successful',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_customer_status.ts]---
Location: sim-main/apps/sim/tools/linear/delete_customer_status.ts

```typescript
import type {
  LinearDeleteCustomerStatusParams,
  LinearDeleteCustomerStatusResponse,
} from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearDeleteCustomerStatusTool: ToolConfig<
  LinearDeleteCustomerStatusParams,
  LinearDeleteCustomerStatusResponse
> = {
  id: 'linear_delete_customer_status',
  name: 'Linear Delete Customer Status',
  description: 'Delete a customer status in Linear',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'linear',
  },

  params: {
    statusId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Customer status ID to delete',
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
        mutation CustomerStatusDelete($id: String!) {
          customerStatusDelete(id: $id) {
            success
          }
        }
      `,
      variables: {
        id: params.statusId,
      },
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to delete customer status',
        output: {},
      }
    }

    const result = data.data.customerStatusDelete
    return {
      success: result.success,
      output: {
        success: result.success,
      },
    }
  },

  outputs: {
    success: {
      type: 'boolean',
      description: 'Whether the deletion was successful',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_customer_tier.ts]---
Location: sim-main/apps/sim/tools/linear/delete_customer_tier.ts

```typescript
import type {
  LinearDeleteCustomerTierParams,
  LinearDeleteCustomerTierResponse,
} from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearDeleteCustomerTierTool: ToolConfig<
  LinearDeleteCustomerTierParams,
  LinearDeleteCustomerTierResponse
> = {
  id: 'linear_delete_customer_tier',
  name: 'Linear Delete Customer Tier',
  description: 'Delete a customer tier in Linear',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'linear',
  },

  params: {
    tierId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Customer tier ID to delete',
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
        mutation CustomerTierDelete($id: String!) {
          customerTierDelete(id: $id) {
            success
          }
        }
      `,
      variables: {
        id: params.tierId,
      },
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to delete customer tier',
        output: {},
      }
    }

    const result = data.data.customerTierDelete
    return {
      success: result.success,
      output: {
        success: result.success,
      },
    }
  },

  outputs: {
    success: {
      type: 'boolean',
      description: 'Whether the deletion was successful',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_issue.ts]---
Location: sim-main/apps/sim/tools/linear/delete_issue.ts

```typescript
import type { LinearDeleteIssueParams, LinearDeleteIssueResponse } from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearDeleteIssueTool: ToolConfig<LinearDeleteIssueParams, LinearDeleteIssueResponse> =
  {
    id: 'linear_delete_issue',
    name: 'Linear Delete Issue',
    description: 'Delete (trash) an issue in Linear',
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
        description: 'Linear issue ID to delete',
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
        mutation DeleteIssue($id: String!) {
          issueDelete(id: $id) {
            success
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
          error: data.errors[0]?.message || 'Failed to delete issue',
          output: {},
        }
      }

      return {
        success: data.data.issueDelete.success,
        output: {
          success: data.data.issueDelete.success,
        },
      }
    },

    outputs: {
      success: {
        type: 'boolean',
        description: 'Whether the delete operation was successful',
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: delete_issue_relation.ts]---
Location: sim-main/apps/sim/tools/linear/delete_issue_relation.ts

```typescript
import type {
  LinearDeleteIssueRelationParams,
  LinearDeleteIssueRelationResponse,
} from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearDeleteIssueRelationTool: ToolConfig<
  LinearDeleteIssueRelationParams,
  LinearDeleteIssueRelationResponse
> = {
  id: 'linear_delete_issue_relation',
  name: 'Linear Delete Issue Relation',
  description: 'Remove a relation between two issues in Linear',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'linear',
  },

  params: {
    relationId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Relation ID to delete',
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
        mutation DeleteIssueRelation($id: String!) {
          issueRelationDelete(id: $id) {
            success
          }
        }
      `,
      variables: {
        id: params.relationId,
      },
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to delete issue relation',
        output: {},
      }
    }

    return {
      success: data.data.issueRelationDelete.success,
      output: {
        success: data.data.issueRelationDelete.success,
      },
    }
  },

  outputs: {
    success: {
      type: 'boolean',
      description: 'Whether the delete operation was successful',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_project.ts]---
Location: sim-main/apps/sim/tools/linear/delete_project.ts

```typescript
import type { LinearDeleteProjectParams, LinearDeleteProjectResponse } from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearDeleteProjectTool: ToolConfig<
  LinearDeleteProjectParams,
  LinearDeleteProjectResponse
> = {
  id: 'linear_delete_project',
  name: 'Linear Delete Project',
  description: 'Delete a project in Linear',
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
      description: 'Project ID to delete',
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
        mutation ProjectDelete($id: String!) {
          projectDelete(id: $id) {
            success
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
        error: data.errors[0]?.message || 'Failed to delete project',
        output: {},
      }
    }

    const result = data.data.projectDelete
    return {
      success: result.success,
      output: {
        success: result.success,
      },
    }
  },

  outputs: {
    success: {
      type: 'boolean',
      description: 'Whether the deletion was successful',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_project_label.ts]---
Location: sim-main/apps/sim/tools/linear/delete_project_label.ts

```typescript
import type {
  LinearDeleteProjectLabelParams,
  LinearDeleteProjectLabelResponse,
} from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearDeleteProjectLabelTool: ToolConfig<
  LinearDeleteProjectLabelParams,
  LinearDeleteProjectLabelResponse
> = {
  id: 'linear_delete_project_label',
  name: 'Linear Delete Project Label',
  description: 'Delete a project label in Linear',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'linear',
  },

  params: {
    labelId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Project label ID to delete',
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
        mutation ProjectLabelDelete($id: String!) {
          projectLabelDelete(id: $id) {
            success
          }
        }
      `,
      variables: {
        id: params.labelId,
      },
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to delete project label',
        output: {},
      }
    }

    const result = data.data.projectLabelDelete
    return {
      success: result.success,
      output: {
        success: result.success,
      },
    }
  },

  outputs: {
    success: {
      type: 'boolean',
      description: 'Whether the deletion was successful',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_project_milestone.ts]---
Location: sim-main/apps/sim/tools/linear/delete_project_milestone.ts

```typescript
import type {
  LinearDeleteProjectMilestoneParams,
  LinearDeleteProjectMilestoneResponse,
} from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearDeleteProjectMilestoneTool: ToolConfig<
  LinearDeleteProjectMilestoneParams,
  LinearDeleteProjectMilestoneResponse
> = {
  id: 'linear_delete_project_milestone',
  name: 'Linear Delete Project Milestone',
  description: 'Delete a project milestone in Linear',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'linear',
  },

  params: {
    milestoneId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Project milestone ID to delete',
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
        mutation ProjectMilestoneDelete($id: String!) {
          projectMilestoneDelete(id: $id) {
            success
          }
        }
      `,
      variables: {
        id: params.milestoneId,
      },
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to delete project milestone',
        output: {},
      }
    }

    const result = data.data.projectMilestoneDelete
    return {
      success: result.success,
      output: {
        success: result.success,
      },
    }
  },

  outputs: {
    success: {
      type: 'boolean',
      description: 'Whether the deletion was successful',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_project_status.ts]---
Location: sim-main/apps/sim/tools/linear/delete_project_status.ts

```typescript
import type {
  LinearDeleteProjectStatusParams,
  LinearDeleteProjectStatusResponse,
} from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearDeleteProjectStatusTool: ToolConfig<
  LinearDeleteProjectStatusParams,
  LinearDeleteProjectStatusResponse
> = {
  id: 'linear_delete_project_status',
  name: 'Linear Delete Project Status',
  description: 'Delete a project status in Linear',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'linear',
  },

  params: {
    statusId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Project status ID to delete',
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
        mutation ProjectStatusDelete($id: String!) {
          projectStatusDelete(id: $id) {
            success
          }
        }
      `,
      variables: {
        id: params.statusId,
      },
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to delete project status',
        output: {},
      }
    }

    const result = data.data.projectStatusDelete
    return {
      success: result.success,
      output: {
        success: result.success,
      },
    }
  },

  outputs: {
    success: {
      type: 'boolean',
      description: 'Whether the deletion was successful',
    },
  },
}
```

--------------------------------------------------------------------------------

````
