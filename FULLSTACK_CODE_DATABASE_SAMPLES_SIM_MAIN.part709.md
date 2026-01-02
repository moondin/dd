---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 709
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 709 of 933)

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

---[FILE: update_customer.ts]---
Location: sim-main/apps/sim/tools/linear/update_customer.ts

```typescript
import type { LinearUpdateCustomerParams, LinearUpdateCustomerResponse } from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearUpdateCustomerTool: ToolConfig<
  LinearUpdateCustomerParams,
  LinearUpdateCustomerResponse
> = {
  id: 'linear_update_customer',
  name: 'Linear Update Customer',
  description: 'Update a customer in Linear',
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
      description: 'Customer ID to update',
    },
    name: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated customer name',
    },
    domains: {
      type: 'array',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated domains',
    },
    externalIds: {
      type: 'array',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated external IDs',
    },
    logoUrl: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated logo URL',
    },
    ownerId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated owner user ID',
    },
    revenue: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated annual revenue',
    },
    size: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated organization size',
    },
    statusId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated customer status ID',
    },
    tierId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated customer tier ID',
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

      if (params.name != null && params.name !== '') {
        input.name = params.name
      }
      if (params.domains != null && Array.isArray(params.domains) && params.domains.length > 0) {
        input.domains = params.domains
      }
      if (
        params.externalIds != null &&
        Array.isArray(params.externalIds) &&
        params.externalIds.length > 0
      ) {
        input.externalIds = params.externalIds
      }
      if (params.logoUrl != null && params.logoUrl !== '') {
        input.logoUrl = params.logoUrl
      }
      if (params.ownerId != null && params.ownerId !== '') {
        input.ownerId = params.ownerId
      }
      if (params.revenue != null) {
        input.revenue = params.revenue
      }
      if (params.size != null) {
        input.size = params.size
      }
      if (params.statusId != null && params.statusId !== '') {
        input.statusId = params.statusId
      }
      if (params.tierId != null && params.tierId !== '') {
        input.tierId = params.tierId
      }

      return {
        query: `
          mutation CustomerUpdate($id: String!, $input: CustomerUpdateInput!) {
            customerUpdate(id: $id, input: $input) {
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
          id: params.customerId,
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
        error: data.errors[0]?.message || 'Failed to update customer',
        output: {},
      }
    }

    const result = data.data.customerUpdate
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
      description: 'The updated customer',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_customer_request.ts]---
Location: sim-main/apps/sim/tools/linear/update_customer_request.ts

```typescript
import type {
  LinearUpdateCustomerRequestParams,
  LinearUpdateCustomerRequestResponse,
} from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearUpdateCustomerRequestTool: ToolConfig<
  LinearUpdateCustomerRequestParams,
  LinearUpdateCustomerRequestResponse
> = {
  id: 'linear_update_customer_request',
  name: 'Linear Update Customer Request',
  description:
    'Update a customer request (need) in Linear. Can change urgency, description, customer assignment, and linked issue.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'linear',
  },

  params: {
    customerNeedId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Customer request ID to update',
    },
    body: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated description of the customer request',
    },
    priority: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated urgency level: 0 = Not important, 1 = Important',
    },
    customerId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New customer ID to assign this request to',
    },
    issueId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New issue ID to link this request to',
    },
    projectId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New project ID to link this request to',
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

      // Optional fields with proper validation
      if (params.body != null && params.body !== '') {
        input.body = params.body
      }
      if (params.priority != null) {
        input.priority = params.priority
      }
      if (params.customerId != null && params.customerId !== '') {
        input.customerId = params.customerId
      }
      if (params.issueId != null && params.issueId !== '') {
        input.issueId = params.issueId
      }
      if (params.projectId != null && params.projectId !== '') {
        input.projectId = params.projectId
      }

      return {
        query: `
          mutation CustomerNeedUpdate($id: String!, $input: CustomerNeedUpdateInput!) {
            customerNeedUpdate(id: $id, input: $input) {
              success
              need {
                id
                body
                priority
                createdAt
                updatedAt
                archivedAt
                customer {
                  id
                  name
                }
                issue {
                  id
                  title
                }
                project {
                  id
                  name
                }
                creator {
                  id
                  name
                }
                url
              }
            }
          }
        `,
        variables: {
          id: params.customerNeedId,
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
        error: data.errors[0]?.message || 'Failed to update customer request',
        output: {},
      }
    }

    const result = data.data.customerNeedUpdate
    return {
      success: result.success,
      output: {
        customerNeed: result.need,
      },
    }
  },

  outputs: {
    customerNeed: {
      type: 'object',
      description: 'The updated customer request',
      properties: {
        id: { type: 'string', description: 'Customer request ID' },
        body: { type: 'string', description: 'Request description' },
        priority: {
          type: 'number',
          description: 'Urgency level (0 = Not important, 1 = Important)',
        },
        createdAt: { type: 'string', description: 'Creation timestamp' },
        updatedAt: { type: 'string', description: 'Last update timestamp' },
        archivedAt: { type: 'string', description: 'Archive timestamp (null if not archived)' },
        customer: { type: 'object', description: 'Assigned customer' },
        issue: { type: 'object', description: 'Linked issue (null if not linked)' },
        project: { type: 'object', description: 'Linked project (null if not linked)' },
        creator: { type: 'object', description: 'User who created the request' },
        url: { type: 'string', description: 'URL to the customer request' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_customer_status.ts]---
Location: sim-main/apps/sim/tools/linear/update_customer_status.ts

```typescript
import type {
  LinearUpdateCustomerStatusParams,
  LinearUpdateCustomerStatusResponse,
} from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearUpdateCustomerStatusTool: ToolConfig<
  LinearUpdateCustomerStatusParams,
  LinearUpdateCustomerStatusResponse
> = {
  id: 'linear_update_customer_status',
  name: 'Linear Update Customer Status',
  description: 'Update a customer status in Linear',
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
      description: 'Customer status ID to update',
    },
    name: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated status name',
    },
    color: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated status color',
    },
    displayName: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated display name',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated description',
    },
    position: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated position',
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

      if (params.name != null && params.name !== '') {
        input.name = params.name
      }
      if (params.color != null && params.color !== '') {
        input.color = params.color
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
          mutation CustomerStatusUpdate($id: String!, $input: CustomerStatusUpdateInput!) {
            customerStatusUpdate(id: $id, input: $input) {
              success
              customerStatus {
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
          id: params.statusId,
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
        error: data.errors[0]?.message || 'Failed to update customer status',
        output: {},
      }
    }

    const result = data.data.customerStatusUpdate
    return {
      success: result.success,
      output: {
        customerStatus: result.customerStatus,
      },
    }
  },

  outputs: {
    customerStatus: {
      type: 'object',
      description: 'The updated customer status',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_customer_tier.ts]---
Location: sim-main/apps/sim/tools/linear/update_customer_tier.ts

```typescript
import type {
  LinearUpdateCustomerTierParams,
  LinearUpdateCustomerTierResponse,
} from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearUpdateCustomerTierTool: ToolConfig<
  LinearUpdateCustomerTierParams,
  LinearUpdateCustomerTierResponse
> = {
  id: 'linear_update_customer_tier',
  name: 'Linear Update Customer Tier',
  description: 'Update a customer tier in Linear',
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
      description: 'Customer tier ID to update',
    },
    name: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated tier name',
    },
    color: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated tier color',
    },
    displayName: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated display name',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated description',
    },
    position: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated position',
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

      if (params.name != null && params.name !== '') {
        input.name = params.name
      }
      if (params.color != null && params.color !== '') {
        input.color = params.color
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
          mutation CustomerTierUpdate($id: String!, $input: CustomerTierUpdateInput!) {
            customerTierUpdate(id: $id, input: $input) {
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
          id: params.tierId,
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
        error: data.errors[0]?.message || 'Failed to update customer tier',
        output: {},
      }
    }

    const result = data.data.customerTierUpdate
    return {
      success: result.success,
      output: {
        customerTier: result.customerTier,
      },
    }
  },

  outputs: {
    customerTier: {
      type: 'object',
      description: 'The updated customer tier',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_issue.ts]---
Location: sim-main/apps/sim/tools/linear/update_issue.ts

```typescript
import type { LinearUpdateIssueParams, LinearUpdateIssueResponse } from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearUpdateIssueTool: ToolConfig<LinearUpdateIssueParams, LinearUpdateIssueResponse> =
  {
    id: 'linear_update_issue',
    name: 'Linear Update Issue',
    description: 'Update an existing issue in Linear',
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
        description: 'Linear issue ID to update',
      },
      title: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'New issue title',
      },
      description: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'New issue description',
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
        description: 'Array of label IDs to set on the issue (replaces all existing labels)',
      },
      projectId: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Project ID to move the issue to',
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
        description: 'Parent issue ID (for making this a sub-issue)',
      },
      dueDate: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Due date in ISO 8601 format (date only: YYYY-MM-DD)',
      },
      addedLabelIds: {
        type: 'array',
        required: false,
        visibility: 'user-or-llm',
        description: 'Array of label IDs to add to the issue (without replacing existing labels)',
      },
      removedLabelIds: {
        type: 'array',
        required: false,
        visibility: 'user-or-llm',
        description: 'Array of label IDs to remove from the issue',
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

        if (params.title != null && params.title !== '') {
          input.title = params.title
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
        if (params.projectId != null && params.projectId !== '') {
          input.projectId = params.projectId
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
        if (params.addedLabelIds != null && Array.isArray(params.addedLabelIds)) {
          input.addedLabelIds = params.addedLabelIds
        }
        if (params.removedLabelIds != null && Array.isArray(params.removedLabelIds)) {
          input.removedLabelIds = params.removedLabelIds
        }

        return {
          query: `
          mutation UpdateIssue($id: String!, $input: IssueUpdateInput!) {
            issueUpdate(id: $id, input: $input) {
              success
              issue {
                id
                title
                description
                priority
                estimate
                url
                updatedAt
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
                team {
                  id
                }
                project {
                  id
                }
                cycle {
                  id
                  number
                  name
                }
                parent {
                  id
                  title
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
            id: params.issueId,
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
          error: data.errors[0]?.message || 'Failed to update issue',
          output: {},
        }
      }

      const result = data.data.issueUpdate
      if (!result.success) {
        return {
          success: false,
          error: 'Issue update was not successful',
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
            updatedAt: issue.updatedAt,
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
            labels: issue.labels?.nodes || [],
          },
        },
      }
    },

    outputs: {
      issue: {
        type: 'object',
        description: 'The updated issue',
        properties: {
          id: { type: 'string', description: 'Issue ID' },
          title: { type: 'string', description: 'Issue title' },
          description: { type: 'string', description: 'Issue description' },
          priority: { type: 'number', description: 'Issue priority' },
          estimate: { type: 'number', description: 'Issue estimate' },
          state: { type: 'object', description: 'Issue state' },
          assignee: { type: 'object', description: 'Assigned user' },
          labels: { type: 'array', description: 'Issue labels' },
          updatedAt: { type: 'string', description: 'Last update timestamp' },
          dueDate: { type: 'string', description: 'Due date (YYYY-MM-DD)' },
          projectId: { type: 'string', description: 'Project ID' },
          cycleId: { type: 'string', description: 'Cycle ID' },
          cycleNumber: { type: 'number', description: 'Cycle number' },
          cycleName: { type: 'string', description: 'Cycle name' },
          parentId: { type: 'string', description: 'Parent issue ID' },
          parentTitle: { type: 'string', description: 'Parent issue title' },
        },
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: update_label.ts]---
Location: sim-main/apps/sim/tools/linear/update_label.ts

```typescript
import type { LinearUpdateLabelParams, LinearUpdateLabelResponse } from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearUpdateLabelTool: ToolConfig<LinearUpdateLabelParams, LinearUpdateLabelResponse> =
  {
    id: 'linear_update_label',
    name: 'Linear Update Label',
    description: 'Update an existing label in Linear',
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
        description: 'Label ID to update',
      },
      name: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'New label name',
      },
      color: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'New label color (hex format)',
      },
      description: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'New label description',
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

        if (params.name != null && params.name !== '') input.name = params.name
        if (params.color != null && params.color !== '') input.color = params.color
        if (params.description != null && params.description !== '')
          input.description = params.description

        return {
          query: `
          mutation UpdateLabel($id: String!, $input: IssueLabelUpdateInput!) {
            issueLabelUpdate(id: $id, input: $input) {
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
            id: params.labelId,
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
          error: data.errors[0]?.message || 'Failed to update label',
          output: {},
        }
      }

      const result = data.data.issueLabelUpdate
      if (!result.success) {
        return {
          success: false,
          error: 'Label update was not successful',
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
        description: 'The updated label',
        properties: {
          id: { type: 'string', description: 'Label ID' },
          name: { type: 'string', description: 'Label name' },
          color: { type: 'string', description: 'Label color' },
          description: { type: 'string', description: 'Label description' },
        },
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: update_notification.ts]---
Location: sim-main/apps/sim/tools/linear/update_notification.ts

```typescript
import type {
  LinearUpdateNotificationParams,
  LinearUpdateNotificationResponse,
} from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearUpdateNotificationTool: ToolConfig<
  LinearUpdateNotificationParams,
  LinearUpdateNotificationResponse
> = {
  id: 'linear_update_notification',
  name: 'Linear Update Notification',
  description: 'Mark a notification as read or unread in Linear',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'linear',
  },

  params: {
    notificationId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Notification ID to update',
    },
    readAt: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Timestamp to mark as read (ISO format). Pass null or omit to mark as unread',
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

      // If readAt is provided, use it; if explicitly null, mark as unread; if omitted, mark as read now
      if (params.readAt !== undefined) {
        input.readAt = params.readAt
      } else {
        input.readAt = new Date().toISOString()
      }

      return {
        query: `
          mutation UpdateNotification($id: String!, $input: NotificationUpdateInput!) {
            notificationUpdate(id: $id, input: $input) {
              success
              notification {
                id
                type
                createdAt
                readAt
                issue {
                  id
                  title
                }
              }
            }
          }
        `,
        variables: {
          id: params.notificationId,
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
        error: data.errors[0]?.message || 'Failed to update notification',
        output: {},
      }
    }

    const result = data.data.notificationUpdate
    if (!result.success) {
      return {
        success: false,
        error: 'Notification update was not successful',
        output: {},
      }
    }

    return {
      success: true,
      output: {
        notification: result.notification,
      },
    }
  },

  outputs: {
    notification: {
      type: 'object',
      description: 'The updated notification',
      properties: {
        id: { type: 'string', description: 'Notification ID' },
        type: { type: 'string', description: 'Notification type' },
        createdAt: { type: 'string', description: 'Creation timestamp' },
        readAt: { type: 'string', description: 'Read timestamp' },
        issue: { type: 'object', description: 'Related issue' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_project.ts]---
Location: sim-main/apps/sim/tools/linear/update_project.ts

```typescript
import type { LinearUpdateProjectParams, LinearUpdateProjectResponse } from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearUpdateProjectTool: ToolConfig<
  LinearUpdateProjectParams,
  LinearUpdateProjectResponse
> = {
  id: 'linear_update_project',
  name: 'Linear Update Project',
  description: 'Update an existing project in Linear',
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
      description: 'Project ID to update',
    },
    name: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New project name',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New project description',
    },
    state: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Project state (planned, started, completed, canceled)',
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
      description: 'Project start date (ISO format: YYYY-MM-DD)',
    },
    targetDate: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Project target date (ISO format: YYYY-MM-DD)',
    },
    priority: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Project priority (0=No priority, 1=Urgent, 2=High, 3=Normal, 4=Low)',
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

      if (params.name != null && params.name !== '') {
        input.name = params.name
      }
      if (params.description != null && params.description !== '') {
        input.description = params.description
      }
      if (params.state != null && params.state !== '') {
        input.state = params.state
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
          mutation UpdateProject($id: String!, $input: ProjectUpdateInput!) {
            projectUpdate(id: $id, input: $input) {
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
          id: params.projectId,
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
        error: data.errors[0]?.message || 'Failed to update project',
        output: {},
      }
    }

    const result = data.data.projectUpdate
    if (!result.success) {
      return {
        success: false,
        error: 'Project update was not successful',
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
      description: 'The updated project',
      properties: {
        id: { type: 'string', description: 'Project ID' },
        name: { type: 'string', description: 'Project name' },
        description: { type: 'string', description: 'Project description' },
        state: { type: 'string', description: 'Project state' },
        priority: { type: 'number', description: 'Project priority' },
        startDate: { type: 'string', description: 'Project start date' },
        targetDate: { type: 'string', description: 'Project target date' },
        lead: { type: 'object', description: 'Project lead' },
        teams: { type: 'array', description: 'Associated teams' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

````
