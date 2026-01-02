---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 706
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 706 of 933)

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

---[FILE: list_customer_requests.ts]---
Location: sim-main/apps/sim/tools/linear/list_customer_requests.ts

```typescript
import type {
  LinearListCustomerRequestsParams,
  LinearListCustomerRequestsResponse,
} from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearListCustomerRequestsTool: ToolConfig<
  LinearListCustomerRequestsParams,
  LinearListCustomerRequestsResponse
> = {
  id: 'linear_list_customer_requests',
  name: 'Linear List Customer Requests',
  description: 'List all customer requests (needs) in Linear',
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
      description: 'Number of customer requests to return (default: 50)',
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
      description: 'Include archived customer requests (default: false)',
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
        query ListCustomerNeeds($first: Int, $after: String, $includeArchived: Boolean) {
          customerNeeds(first: $first, after: $after, includeArchived: $includeArchived) {
            nodes {
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
        error: data.errors[0]?.message || 'Failed to list customer requests',
        output: {},
      }
    }

    const result = data.data.customerNeeds
    return {
      success: true,
      output: {
        customerNeeds: result.nodes,
        pageInfo: {
          hasNextPage: result.pageInfo.hasNextPage,
          endCursor: result.pageInfo.endCursor,
        },
      },
    }
  },

  outputs: {
    customerNeeds: {
      type: 'array',
      description: 'Array of customer requests',
      items: {
        type: 'object',
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
    pageInfo: {
      type: 'object',
      description: 'Pagination information',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_customer_statuses.ts]---
Location: sim-main/apps/sim/tools/linear/list_customer_statuses.ts

```typescript
import type {
  LinearListCustomerStatusesParams,
  LinearListCustomerStatusesResponse,
} from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearListCustomerStatusesTool: ToolConfig<
  LinearListCustomerStatusesParams,
  LinearListCustomerStatusesResponse
> = {
  id: 'linear_list_customer_statuses',
  name: 'Linear List Customer Statuses',
  description: 'List all customer statuses in Linear',
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
        query CustomerStatuses {
          customerStatuses {
            nodes {
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
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to list customer statuses',
        output: {},
      }
    }

    return {
      success: true,
      output: {
        customerStatuses: data.data.customerStatuses.nodes,
      },
    }
  },

  outputs: {
    customerStatuses: {
      type: 'array',
      description: 'List of customer statuses',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_customer_tiers.ts]---
Location: sim-main/apps/sim/tools/linear/list_customer_tiers.ts

```typescript
import type {
  LinearListCustomerTiersParams,
  LinearListCustomerTiersResponse,
} from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearListCustomerTiersTool: ToolConfig<
  LinearListCustomerTiersParams,
  LinearListCustomerTiersResponse
> = {
  id: 'linear_list_customer_tiers',
  name: 'Linear List Customer Tiers',
  description: 'List all customer tiers in Linear',
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
        query CustomerTiers {
          customerTiers {
            nodes {
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
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to list customer tiers',
        output: {},
      }
    }

    return {
      success: true,
      output: {
        customerTiers: data.data.customerTiers.nodes,
      },
    }
  },

  outputs: {
    customerTiers: {
      type: 'array',
      description: 'List of customer tiers',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_cycles.ts]---
Location: sim-main/apps/sim/tools/linear/list_cycles.ts

```typescript
import type { LinearListCyclesParams, LinearListCyclesResponse } from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearListCyclesTool: ToolConfig<LinearListCyclesParams, LinearListCyclesResponse> = {
  id: 'linear_list_cycles',
  name: 'Linear List Cycles',
  description: 'List cycles (sprints/iterations) in Linear',
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
      description: 'Number of cycles to return (default: 50)',
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
          query ListCycles($filter: CycleFilter, $first: Int, $after: String) {
            cycles(filter: $filter, first: $first, after: $after) {
              nodes {
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
        error: data.errors[0]?.message || 'Failed to list cycles',
        output: {},
      }
    }

    const result = data.data.cycles
    return {
      success: true,
      output: {
        cycles: result.nodes,
        pageInfo: {
          hasNextPage: result.pageInfo.hasNextPage,
          endCursor: result.pageInfo.endCursor,
        },
      },
    }
  },

  outputs: {
    cycles: {
      type: 'array',
      description: 'Array of cycles',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Cycle ID' },
          number: { type: 'number', description: 'Cycle number' },
          name: { type: 'string', description: 'Cycle name' },
          startsAt: { type: 'string', description: 'Start date' },
          endsAt: { type: 'string', description: 'End date' },
          completedAt: { type: 'string', description: 'Completion date' },
          progress: { type: 'number', description: 'Progress percentage (0-1)' },
          team: { type: 'object', description: 'Team this cycle belongs to' },
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

---[FILE: list_favorites.ts]---
Location: sim-main/apps/sim/tools/linear/list_favorites.ts

```typescript
import type { LinearListFavoritesParams, LinearListFavoritesResponse } from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearListFavoritesTool: ToolConfig<
  LinearListFavoritesParams,
  LinearListFavoritesResponse
> = {
  id: 'linear_list_favorites',
  name: 'Linear List Favorites',
  description: 'List all bookmarked items for the current user in Linear',
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
      description: 'Number of favorites to return (default: 50)',
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
        query ListFavorites($first: Int, $after: String) {
          favorites(first: $first, after: $after) {
            nodes {
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
        error: data.errors[0]?.message || 'Failed to list favorites',
        output: {},
      }
    }

    const result = data.data.favorites
    return {
      success: true,
      output: {
        favorites: result.nodes,
        pageInfo: {
          hasNextPage: result.pageInfo.hasNextPage,
          endCursor: result.pageInfo.endCursor,
        },
      },
    }
  },

  outputs: {
    favorites: {
      type: 'array',
      description: 'Array of favorited items',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Favorite ID' },
          type: { type: 'string', description: 'Favorite type' },
          issue: { type: 'object', description: 'Favorited issue' },
          project: { type: 'object', description: 'Favorited project' },
          cycle: { type: 'object', description: 'Favorited cycle' },
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

---[FILE: list_issue_relations.ts]---
Location: sim-main/apps/sim/tools/linear/list_issue_relations.ts

```typescript
import type {
  LinearListIssueRelationsParams,
  LinearListIssueRelationsResponse,
} from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearListIssueRelationsTool: ToolConfig<
  LinearListIssueRelationsParams,
  LinearListIssueRelationsResponse
> = {
  id: 'linear_list_issue_relations',
  name: 'Linear List Issue Relations',
  description: 'List all relations (dependencies) for an issue in Linear',
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
      description: 'Number of relations to return (default: 50)',
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
        query ListIssueRelations($issueId: String!, $first: Int, $after: String) {
          issue(id: $issueId) {
            relations(first: $first, after: $after) {
              nodes {
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
        error: data.errors[0]?.message || 'Failed to list issue relations',
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

    const result = data.data.issue.relations
    return {
      success: true,
      output: {
        relations: result.nodes,
        pageInfo: {
          hasNextPage: result.pageInfo.hasNextPage,
          endCursor: result.pageInfo.endCursor,
        },
      },
    }
  },

  outputs: {
    relations: {
      type: 'array',
      description: 'Array of issue relations',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Relation ID' },
          type: { type: 'string', description: 'Relation type' },
          issue: { type: 'object', description: 'Source issue' },
          relatedIssue: { type: 'object', description: 'Target issue' },
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

---[FILE: list_labels.ts]---
Location: sim-main/apps/sim/tools/linear/list_labels.ts

```typescript
import type { LinearListLabelsParams, LinearListLabelsResponse } from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearListLabelsTool: ToolConfig<LinearListLabelsParams, LinearListLabelsResponse> = {
  id: 'linear_list_labels',
  name: 'Linear List Labels',
  description: 'List all labels in Linear workspace or team',
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
      description: 'Number of labels to return (default: 50)',
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
          query ListLabels($filter: IssueLabelFilter, $first: Int, $after: String) {
            issueLabels(filter: $filter, first: $first, after: $after) {
              nodes {
                id
                name
                color
                description
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
        error: data.errors[0]?.message || 'Failed to list labels',
        output: {},
      }
    }

    const result = data.data.issueLabels
    return {
      success: true,
      output: {
        labels: result.nodes,
        pageInfo: {
          hasNextPage: result.pageInfo.hasNextPage,
          endCursor: result.pageInfo.endCursor,
        },
      },
    }
  },

  outputs: {
    labels: {
      type: 'array',
      description: 'Array of labels',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Label ID' },
          name: { type: 'string', description: 'Label name' },
          color: { type: 'string', description: 'Label color (hex)' },
          description: { type: 'string', description: 'Label description' },
          team: { type: 'object', description: 'Team this label belongs to' },
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

---[FILE: list_notifications.ts]---
Location: sim-main/apps/sim/tools/linear/list_notifications.ts

```typescript
import type {
  LinearListNotificationsParams,
  LinearListNotificationsResponse,
} from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearListNotificationsTool: ToolConfig<
  LinearListNotificationsParams,
  LinearListNotificationsResponse
> = {
  id: 'linear_list_notifications',
  name: 'Linear List Notifications',
  description: 'List notifications for the current user in Linear',
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
      description: 'Number of notifications to return (default: 50)',
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
        query ListNotifications($first: Int, $after: String) {
          notifications(first: $first, after: $after) {
            nodes {
              id
              type
              createdAt
              readAt
              ... on IssueNotification {
                issue {
                  id
                  title
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
        error: data.errors[0]?.message || 'Failed to list notifications',
        output: {},
      }
    }

    const result = data.data.notifications
    return {
      success: true,
      output: {
        notifications: result.nodes,
        pageInfo: {
          hasNextPage: result.pageInfo.hasNextPage,
          endCursor: result.pageInfo.endCursor,
        },
      },
    }
  },

  outputs: {
    notifications: {
      type: 'array',
      description: 'Array of notifications',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Notification ID' },
          type: { type: 'string', description: 'Notification type' },
          createdAt: { type: 'string', description: 'Creation timestamp' },
          readAt: { type: 'string', description: 'Read timestamp (null if unread)' },
          issue: { type: 'object', description: 'Related issue' },
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

---[FILE: list_projects.ts]---
Location: sim-main/apps/sim/tools/linear/list_projects.ts

```typescript
import type { LinearListProjectsParams, LinearListProjectsResponse } from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearListProjectsTool: ToolConfig<
  LinearListProjectsParams,
  LinearListProjectsResponse
> = {
  id: 'linear_list_projects',
  name: 'Linear List Projects',
  description: 'List projects in Linear with optional filtering',
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
    includeArchived: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Include archived projects',
    },
    first: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Number of projects to return (default: 50)',
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
      // Note: ProjectFilter does not support filtering by team directly
      // We need to filter projects client-side by team if teamId is provided
      return {
        query: `
          query ListProjects($first: Int, $after: String, $includeArchived: Boolean) {
            projects(first: $first, after: $after, includeArchived: $includeArchived) {
              nodes {
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
      }
    },
  },

  transformResponse: async (response, params) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to list projects',
        output: {},
      }
    }

    const result = data.data.projects
    let projects = result.nodes.map((project: any) => ({
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
    }))

    // Filter by teamId client-side if provided
    if (params?.teamId) {
      projects = projects.filter((project: any) =>
        project.teams.some((team: any) => team.id === params.teamId)
      )
    }

    return {
      success: true,
      output: {
        projects,
        pageInfo: {
          hasNextPage: result.pageInfo.hasNextPage,
          endCursor: result.pageInfo.endCursor,
        },
      },
    }
  },

  outputs: {
    projects: {
      type: 'array',
      description: 'Array of projects',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Project ID' },
          name: { type: 'string', description: 'Project name' },
          description: { type: 'string', description: 'Project description' },
          state: { type: 'string', description: 'Project state' },
          priority: { type: 'number', description: 'Project priority' },
          lead: { type: 'object', description: 'Project lead' },
          teams: { type: 'array', description: 'Teams associated with project' },
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

---[FILE: list_project_labels.ts]---
Location: sim-main/apps/sim/tools/linear/list_project_labels.ts

```typescript
import type {
  LinearListProjectLabelsParams,
  LinearListProjectLabelsResponse,
} from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearListProjectLabelsTool: ToolConfig<
  LinearListProjectLabelsParams,
  LinearListProjectLabelsResponse
> = {
  id: 'linear_list_project_labels',
  name: 'Linear List Project Labels',
  description: 'List all project labels in Linear',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'linear',
  },

  params: {
    projectId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Optional project ID to filter labels for a specific project',
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
      // If projectId is provided, query the specific project's labels
      if (params.projectId?.trim()) {
        return {
          query: `
            query ProjectWithLabels($id: String!) {
              project(id: $id) {
                id
                name
                labels {
                  nodes {
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
            }
          `,
          variables: {
            id: params.projectId.trim(),
          },
        }
      }

      // Otherwise, list all project labels
      return {
        query: `
          query ProjectLabels {
            projectLabels {
              nodes {
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
      }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to list project labels',
        output: {},
      }
    }

    // Handle project-specific query response
    if (data.data.project) {
      return {
        success: true,
        output: {
          projectLabels: data.data.project.labels.nodes,
        },
      }
    }

    // Handle global projectLabels query response
    return {
      success: true,
      output: {
        projectLabels: data.data.projectLabels.nodes,
      },
    }
  },

  outputs: {
    projectLabels: {
      type: 'array',
      description: 'List of project labels',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_project_milestones.ts]---
Location: sim-main/apps/sim/tools/linear/list_project_milestones.ts

```typescript
import type {
  LinearListProjectMilestonesParams,
  LinearListProjectMilestonesResponse,
} from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearListProjectMilestonesTool: ToolConfig<
  LinearListProjectMilestonesParams,
  LinearListProjectMilestonesResponse
> = {
  id: 'linear_list_project_milestones',
  name: 'Linear List Project Milestones',
  description: 'List all milestones for a project in Linear',
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
      description: 'Project ID to list milestones for',
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
        query Project($id: String!) {
          project(id: $id) {
            projectMilestones {
              nodes {
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
        error: data.errors[0]?.message || 'Failed to list project milestones',
        output: {},
      }
    }

    return {
      success: true,
      output: {
        projectMilestones: data.data.project?.projectMilestones?.nodes || [],
      },
    }
  },

  outputs: {
    projectMilestones: {
      type: 'array',
      description: 'List of project milestones',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_project_statuses.ts]---
Location: sim-main/apps/sim/tools/linear/list_project_statuses.ts

```typescript
import type {
  LinearListProjectStatusesParams,
  LinearListProjectStatusesResponse,
} from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearListProjectStatusesTool: ToolConfig<
  LinearListProjectStatusesParams,
  LinearListProjectStatusesResponse
> = {
  id: 'linear_list_project_statuses',
  name: 'Linear List Project Statuses',
  description: 'List all project statuses in Linear',
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
        query ProjectStatuses {
          projectStatuses {
            nodes {
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
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to list project statuses',
        output: {},
      }
    }

    return {
      success: true,
      output: {
        projectStatuses: data.data.projectStatuses.nodes,
      },
    }
  },

  outputs: {
    projectStatuses: {
      type: 'array',
      description: 'List of project statuses',
    },
  },
}
```

--------------------------------------------------------------------------------

````
