---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 746
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 746 of 933)

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

---[FILE: issues_list.ts]---
Location: sim-main/apps/sim/tools/sentry/issues_list.ts

```typescript
import type { SentryListIssuesParams, SentryListIssuesResponse } from '@/tools/sentry/types'
import type { ToolConfig } from '@/tools/types'

export const listIssuesTool: ToolConfig<SentryListIssuesParams, SentryListIssuesResponse> = {
  id: 'sentry_issues_list',
  name: 'List Issues',
  description:
    'List issues from Sentry for a specific organization and optionally a specific project. Returns issue details including status, error counts, and last seen timestamps.',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Sentry API authentication token',
    },
    organizationSlug: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The slug of the organization',
    },
    projectSlug: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Filter issues by specific project slug (optional)',
    },
    query: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Search query to filter issues. Supports Sentry search syntax (e.g., "is:unresolved", "level:error")',
    },
    statsPeriod: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'Time period for stats (e.g., "24h", "7d", "30d"). Defaults to 24h if not specified.',
    },
    cursor: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Pagination cursor for retrieving next page of results',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of issues to return per page (default: 25, max: 100)',
    },
    status: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Filter by issue status: unresolved, resolved, ignored, or muted',
    },
    sort: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Sort order: date, new, freq, priority, or user (default: date)',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = `https://sentry.io/api/0/organizations/${params.organizationSlug}/issues/`
      const queryParams: string[] = []

      if (params.projectSlug && params.projectSlug !== null && params.projectSlug !== '') {
        queryParams.push(`project=${encodeURIComponent(params.projectSlug)}`)
      }

      if (params.query && params.query !== null && params.query !== '') {
        queryParams.push(`query=${encodeURIComponent(params.query)}`)
      }

      if (params.statsPeriod && params.statsPeriod !== null && params.statsPeriod !== '') {
        queryParams.push(`statsPeriod=${encodeURIComponent(params.statsPeriod)}`)
      }

      if (params.cursor && params.cursor !== null && params.cursor !== '') {
        queryParams.push(`cursor=${encodeURIComponent(params.cursor)}`)
      }

      if (params.limit && params.limit !== null) {
        queryParams.push(`limit=${Number(params.limit)}`)
      }

      if (params.status && params.status !== null && params.status !== '') {
        queryParams.push(`query=${encodeURIComponent(`is:${params.status}`)}`)
      }

      if (params.sort && params.sort !== null && params.sort !== '') {
        queryParams.push(`sort=${encodeURIComponent(params.sort)}`)
      }

      return queryParams.length > 0 ? `${baseUrl}?${queryParams.join('&')}` : baseUrl
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    // Extract pagination info from Link header
    const linkHeader = response.headers.get('Link')
    let nextCursor: string | undefined
    let hasMore = false

    if (linkHeader) {
      // Parse Link header for next cursor
      // Format: <https://sentry.io/api/0/organizations/.../issues/?cursor=...>; rel="next"; results="true"
      const nextMatch = linkHeader.match(
        /<[^>]*cursor=([^&>]+)[^>]*>;\s*rel="next";\s*results="true"/
      )
      if (nextMatch) {
        nextCursor = decodeURIComponent(nextMatch[1])
        hasMore = true
      }
    }

    return {
      success: true,
      output: {
        issues: data.map((issue: any) => ({
          id: issue.id,
          shortId: issue.shortId,
          title: issue.title,
          culprit: issue.culprit,
          permalink: issue.permalink,
          logger: issue.logger,
          level: issue.level,
          status: issue.status,
          statusDetails: issue.statusDetails || {},
          isPublic: issue.isPublic,
          platform: issue.platform,
          project: {
            id: issue.project?.id || '',
            name: issue.project?.name || '',
            slug: issue.project?.slug || '',
            platform: issue.project?.platform || '',
          },
          type: issue.type,
          metadata: issue.metadata || {},
          numComments: issue.numComments || 0,
          assignedTo: issue.assignedTo
            ? {
                id: issue.assignedTo.id,
                name: issue.assignedTo.name,
                email: issue.assignedTo.email,
              }
            : null,
          isBookmarked: issue.isBookmarked,
          isSubscribed: issue.isSubscribed,
          subscriptionDetails: issue.subscriptionDetails,
          hasSeen: issue.hasSeen,
          annotations: issue.annotations || [],
          isUnhandled: issue.isUnhandled,
          count: issue.count,
          userCount: issue.userCount || 0,
          firstSeen: issue.firstSeen,
          lastSeen: issue.lastSeen,
          stats: issue.stats || {},
        })),
        nextCursor,
        hasMore,
      },
    }
  },

  outputs: {
    issues: {
      type: 'array',
      description: 'List of Sentry issues',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Unique issue ID' },
          shortId: { type: 'string', description: 'Short issue identifier' },
          title: { type: 'string', description: 'Issue title' },
          culprit: { type: 'string', description: 'Function or location that caused the issue' },
          permalink: { type: 'string', description: 'Direct link to the issue in Sentry' },
          logger: { type: 'string', description: 'Logger name that reported the issue' },
          level: { type: 'string', description: 'Severity level (error, warning, info, etc.)' },
          status: { type: 'string', description: 'Current issue status' },
          platform: { type: 'string', description: 'Platform where the issue occurred' },
          project: {
            type: 'object',
            description: 'Project information',
            properties: {
              id: { type: 'string', description: 'Project ID' },
              name: { type: 'string', description: 'Project name' },
              slug: { type: 'string', description: 'Project slug' },
              platform: { type: 'string', description: 'Project platform' },
            },
          },
          count: { type: 'string', description: 'Total number of occurrences' },
          userCount: { type: 'number', description: 'Number of unique users affected' },
          firstSeen: {
            type: 'string',
            description: 'When the issue was first seen (ISO timestamp)',
          },
          lastSeen: { type: 'string', description: 'When the issue was last seen (ISO timestamp)' },
        },
      },
    },
    nextCursor: {
      type: 'string',
      description: 'Cursor for the next page of results (if available)',
    },
    hasMore: {
      type: 'boolean',
      description: 'Whether there are more results available',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: issues_update.ts]---
Location: sim-main/apps/sim/tools/sentry/issues_update.ts

```typescript
import type { SentryUpdateIssueParams, SentryUpdateIssueResponse } from '@/tools/sentry/types'
import type { ToolConfig } from '@/tools/types'

export const updateIssueTool: ToolConfig<SentryUpdateIssueParams, SentryUpdateIssueResponse> = {
  id: 'sentry_issues_update',
  name: 'Update Issue',
  description:
    'Update a Sentry issue by changing its status, assignment, bookmark state, or other properties. Returns the updated issue details.',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Sentry API authentication token',
    },
    organizationSlug: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The slug of the organization',
    },
    issueId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The unique ID of the issue to update',
    },
    status: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'New status for the issue: resolved, unresolved, ignored, or resolvedInNextRelease',
    },
    assignedTo: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'User ID or email to assign the issue to. Use empty string to unassign.',
    },
    isBookmarked: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Whether to bookmark the issue',
    },
    isSubscribed: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Whether to subscribe to issue updates',
    },
    isPublic: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Whether the issue should be publicly visible',
    },
  },

  request: {
    url: (params) =>
      `https://sentry.io/api/0/organizations/${params.organizationSlug}/issues/${params.issueId}/`,
    method: 'PUT',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: Record<string, any> = {}

      if (params.status !== undefined && params.status !== null && params.status !== '') {
        body.status = params.status
      }

      if (params.assignedTo !== undefined && params.assignedTo !== null) {
        body.assignedTo = params.assignedTo === '' ? null : params.assignedTo
      }

      if (params.isBookmarked !== undefined && params.isBookmarked !== null) {
        body.isBookmarked = params.isBookmarked
      }

      if (params.isSubscribed !== undefined && params.isSubscribed !== null) {
        body.isSubscribed = params.isSubscribed
      }

      if (params.isPublic !== undefined && params.isPublic !== null) {
        body.isPublic = params.isPublic
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const issue = await response.json()

    return {
      success: true,
      output: {
        issue: {
          id: issue.id,
          shortId: issue.shortId,
          title: issue.title,
          culprit: issue.culprit,
          permalink: issue.permalink,
          logger: issue.logger,
          level: issue.level,
          status: issue.status,
          statusDetails: issue.statusDetails || {},
          isPublic: issue.isPublic,
          platform: issue.platform,
          project: {
            id: issue.project?.id || '',
            name: issue.project?.name || '',
            slug: issue.project?.slug || '',
            platform: issue.project?.platform || '',
          },
          type: issue.type,
          metadata: issue.metadata || {},
          numComments: issue.numComments || 0,
          assignedTo: issue.assignedTo
            ? {
                id: issue.assignedTo.id,
                name: issue.assignedTo.name,
                email: issue.assignedTo.email,
              }
            : null,
          isBookmarked: issue.isBookmarked,
          isSubscribed: issue.isSubscribed,
          subscriptionDetails: issue.subscriptionDetails,
          hasSeen: issue.hasSeen,
          annotations: issue.annotations || [],
          isUnhandled: issue.isUnhandled,
          count: issue.count,
          userCount: issue.userCount || 0,
          firstSeen: issue.firstSeen,
          lastSeen: issue.lastSeen,
          stats: issue.stats || {},
        },
      },
    }
  },

  outputs: {
    issue: {
      type: 'object',
      description: 'The updated Sentry issue',
      properties: {
        id: { type: 'string', description: 'Unique issue ID' },
        shortId: { type: 'string', description: 'Short issue identifier' },
        title: { type: 'string', description: 'Issue title' },
        status: { type: 'string', description: 'Updated issue status' },
        assignedTo: {
          type: 'object',
          description: 'User assigned to the issue (if any)',
          properties: {
            id: { type: 'string', description: 'User ID' },
            name: { type: 'string', description: 'User name' },
            email: { type: 'string', description: 'User email' },
          },
        },
        isBookmarked: { type: 'boolean', description: 'Whether the issue is bookmarked' },
        isSubscribed: { type: 'boolean', description: 'Whether the user is subscribed to updates' },
        isPublic: { type: 'boolean', description: 'Whether the issue is publicly visible' },
        permalink: { type: 'string', description: 'Direct link to the issue in Sentry' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: projects_create.ts]---
Location: sim-main/apps/sim/tools/sentry/projects_create.ts

```typescript
import type { SentryCreateProjectParams, SentryCreateProjectResponse } from '@/tools/sentry/types'
import type { ToolConfig } from '@/tools/types'

export const createProjectTool: ToolConfig<SentryCreateProjectParams, SentryCreateProjectResponse> =
  {
    id: 'sentry_projects_create',
    name: 'Create Project',
    description:
      'Create a new Sentry project in an organization. Requires a team to associate the project with. Returns the created project details.',
    version: '1.0.0',

    params: {
      apiKey: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'Sentry API authentication token',
      },
      organizationSlug: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'The slug of the organization',
      },
      name: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description: 'The name of the project',
      },
      teamSlug: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description: 'The slug of the team that will own this project',
      },
      slug: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'URL-friendly project identifier (auto-generated from name if not provided)',
      },
      platform: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description:
          'Platform/language for the project (e.g., javascript, python, node, react-native). If not specified, defaults to "other"',
      },
      defaultRules: {
        type: 'boolean',
        required: false,
        visibility: 'user-only',
        description: 'Whether to create default alert rules (default: true)',
      },
    },

    request: {
      url: (params) =>
        `https://sentry.io/api/0/teams/${params.organizationSlug}/${params.teamSlug}/projects/`,
      method: 'POST',
      headers: (params) => ({
        Authorization: `Bearer ${params.apiKey}`,
        'Content-Type': 'application/json',
      }),
      body: (params) => {
        const body: Record<string, any> = {
          name: params.name,
        }

        if (params.slug && params.slug !== null && params.slug !== '') {
          body.slug = params.slug
        }

        if (params.platform && params.platform !== null && params.platform !== '') {
          body.platform = params.platform
        }

        if (params.defaultRules !== undefined && params.defaultRules !== null) {
          body.default_rules = params.defaultRules
        }

        return body
      },
    },

    transformResponse: async (response: Response) => {
      const project = await response.json()

      return {
        success: true,
        output: {
          project: {
            id: project.id,
            slug: project.slug,
            name: project.name,
            platform: project.platform,
            dateCreated: project.dateCreated,
            isBookmarked: project.isBookmarked,
            isMember: project.isMember,
            features: project.features || [],
            firstEvent: project.firstEvent,
            firstTransactionEvent: project.firstTransactionEvent,
            access: project.access || [],
            hasAccess: project.hasAccess,
            hasMinifiedStackTrace: project.hasMinifiedStackTrace,
            hasMonitors: project.hasMonitors,
            hasProfiles: project.hasProfiles,
            hasReplays: project.hasReplays,
            hasSessions: project.hasSessions,
            isInternal: project.isInternal,
            organization: {
              id: project.organization?.id || '',
              slug: project.organization?.slug || '',
              name: project.organization?.name || '',
            },
            team: {
              id: project.team?.id || '',
              name: project.team?.name || '',
              slug: project.team?.slug || '',
            },
            teams:
              project.teams?.map((team: any) => ({
                id: team.id,
                name: team.name,
                slug: team.slug,
              })) || [],
            status: project.status,
            color: project.color,
            isPublic: project.isPublic,
          },
        },
      }
    },

    outputs: {
      project: {
        type: 'object',
        description: 'The newly created Sentry project',
        properties: {
          id: { type: 'string', description: 'Unique project ID' },
          slug: { type: 'string', description: 'URL-friendly project identifier' },
          name: { type: 'string', description: 'Project name' },
          platform: { type: 'string', description: 'Platform/language' },
          dateCreated: {
            type: 'string',
            description: 'When the project was created (ISO timestamp)',
          },
          organization: {
            type: 'object',
            description: 'Organization information',
            properties: {
              id: { type: 'string', description: 'Organization ID' },
              slug: { type: 'string', description: 'Organization slug' },
              name: { type: 'string', description: 'Organization name' },
            },
          },
          teams: {
            type: 'array',
            description: 'Teams associated with the project',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'Team ID' },
                name: { type: 'string', description: 'Team name' },
                slug: { type: 'string', description: 'Team slug' },
              },
            },
          },
        },
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: projects_get.ts]---
Location: sim-main/apps/sim/tools/sentry/projects_get.ts

```typescript
import type { SentryGetProjectParams, SentryGetProjectResponse } from '@/tools/sentry/types'
import type { ToolConfig } from '@/tools/types'

export const getProjectTool: ToolConfig<SentryGetProjectParams, SentryGetProjectResponse> = {
  id: 'sentry_projects_get',
  name: 'Get Project',
  description:
    'Retrieve detailed information about a specific Sentry project by its slug. Returns complete project details including teams, features, and configuration.',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Sentry API authentication token',
    },
    organizationSlug: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The slug of the organization',
    },
    projectSlug: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The ID or slug of the project to retrieve',
    },
  },

  request: {
    url: (params) =>
      `https://sentry.io/api/0/projects/${params.organizationSlug}/${params.projectSlug}/`,
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const project = await response.json()

    return {
      success: true,
      output: {
        project: {
          id: project.id,
          slug: project.slug,
          name: project.name,
          platform: project.platform,
          dateCreated: project.dateCreated,
          isBookmarked: project.isBookmarked,
          isMember: project.isMember,
          features: project.features || [],
          firstEvent: project.firstEvent,
          firstTransactionEvent: project.firstTransactionEvent,
          access: project.access || [],
          hasAccess: project.hasAccess,
          hasMinifiedStackTrace: project.hasMinifiedStackTrace,
          hasMonitors: project.hasMonitors,
          hasProfiles: project.hasProfiles,
          hasReplays: project.hasReplays,
          hasSessions: project.hasSessions,
          isInternal: project.isInternal,
          organization: {
            id: project.organization?.id || '',
            slug: project.organization?.slug || '',
            name: project.organization?.name || '',
          },
          team: {
            id: project.team?.id || '',
            name: project.team?.name || '',
            slug: project.team?.slug || '',
          },
          teams:
            project.teams?.map((team: any) => ({
              id: team.id,
              name: team.name,
              slug: team.slug,
            })) || [],
          status: project.status,
          color: project.color,
          isPublic: project.isPublic,
        },
      },
    }
  },

  outputs: {
    project: {
      type: 'object',
      description: 'Detailed information about the Sentry project',
      properties: {
        id: { type: 'string', description: 'Unique project ID' },
        slug: { type: 'string', description: 'URL-friendly project identifier' },
        name: { type: 'string', description: 'Project name' },
        platform: { type: 'string', description: 'Platform/language (e.g., javascript, python)' },
        dateCreated: {
          type: 'string',
          description: 'When the project was created (ISO timestamp)',
        },
        isBookmarked: { type: 'boolean', description: 'Whether the project is bookmarked' },
        isMember: { type: 'boolean', description: 'Whether the user is a member of the project' },
        features: {
          type: 'array',
          description: 'Enabled features for the project',
          items: { type: 'string' },
        },
        firstEvent: {
          type: 'string',
          description: 'When the first event was received (ISO timestamp)',
        },
        organization: {
          type: 'object',
          description: 'Organization information',
          properties: {
            id: { type: 'string', description: 'Organization ID' },
            slug: { type: 'string', description: 'Organization slug' },
            name: { type: 'string', description: 'Organization name' },
          },
        },
        teams: {
          type: 'array',
          description: 'Teams associated with the project',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', description: 'Team ID' },
              name: { type: 'string', description: 'Team name' },
              slug: { type: 'string', description: 'Team slug' },
            },
          },
        },
        status: { type: 'string', description: 'Project status' },
        color: { type: 'string', description: 'Project color code' },
        isPublic: { type: 'boolean', description: 'Whether the project is publicly visible' },
        hasAccess: { type: 'boolean', description: 'Whether the user has access to this project' },
        hasMonitors: {
          type: 'boolean',
          description: 'Whether the project has monitors configured',
        },
        hasProfiles: { type: 'boolean', description: 'Whether the project has profiling enabled' },
        hasReplays: {
          type: 'boolean',
          description: 'Whether the project has session replays enabled',
        },
        hasSessions: { type: 'boolean', description: 'Whether the project has sessions enabled' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: projects_list.ts]---
Location: sim-main/apps/sim/tools/sentry/projects_list.ts

```typescript
import type { SentryListProjectsParams, SentryListProjectsResponse } from '@/tools/sentry/types'
import type { ToolConfig } from '@/tools/types'

export const listProjectsTool: ToolConfig<SentryListProjectsParams, SentryListProjectsResponse> = {
  id: 'sentry_projects_list',
  name: 'List Projects',
  description:
    'List all projects in a Sentry organization. Returns project details including name, platform, teams, and configuration.',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Sentry API authentication token',
    },
    organizationSlug: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The slug of the organization',
    },
    cursor: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Pagination cursor for retrieving next page of results',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of projects to return per page (default: 25, max: 100)',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = `https://sentry.io/api/0/organizations/${params.organizationSlug}/projects/`
      const queryParams: string[] = []

      if (params.cursor && params.cursor !== null && params.cursor !== '') {
        queryParams.push(`cursor=${encodeURIComponent(params.cursor)}`)
      }

      if (params.limit && params.limit !== null) {
        queryParams.push(`limit=${Number(params.limit)}`)
      }

      return queryParams.length > 0 ? `${baseUrl}?${queryParams.join('&')}` : baseUrl
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    // Extract pagination info from Link header
    const linkHeader = response.headers.get('Link')
    let nextCursor: string | undefined
    let hasMore = false

    if (linkHeader) {
      const nextMatch = linkHeader.match(
        /<[^>]*cursor=([^&>]+)[^>]*>;\s*rel="next";\s*results="true"/
      )
      if (nextMatch) {
        nextCursor = decodeURIComponent(nextMatch[1])
        hasMore = true
      }
    }

    return {
      success: true,
      output: {
        projects: data.map((project: any) => ({
          id: project.id,
          slug: project.slug,
          name: project.name,
          platform: project.platform,
          dateCreated: project.dateCreated,
          isBookmarked: project.isBookmarked,
          isMember: project.isMember,
          features: project.features || [],
          firstEvent: project.firstEvent,
          firstTransactionEvent: project.firstTransactionEvent,
          access: project.access || [],
          hasAccess: project.hasAccess,
          hasMinifiedStackTrace: project.hasMinifiedStackTrace,
          hasMonitors: project.hasMonitors,
          hasProfiles: project.hasProfiles,
          hasReplays: project.hasReplays,
          hasSessions: project.hasSessions,
          isInternal: project.isInternal,
          organization: {
            id: project.organization?.id || '',
            slug: project.organization?.slug || '',
            name: project.organization?.name || '',
          },
          team: {
            id: project.team?.id || '',
            name: project.team?.name || '',
            slug: project.team?.slug || '',
          },
          teams:
            project.teams?.map((team: any) => ({
              id: team.id,
              name: team.name,
              slug: team.slug,
            })) || [],
          status: project.status,
          color: project.color,
          isPublic: project.isPublic,
        })),
        nextCursor,
        hasMore,
      },
    }
  },

  outputs: {
    projects: {
      type: 'array',
      description: 'List of Sentry projects',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Unique project ID' },
          slug: { type: 'string', description: 'URL-friendly project identifier' },
          name: { type: 'string', description: 'Project name' },
          platform: { type: 'string', description: 'Platform/language (e.g., javascript, python)' },
          dateCreated: {
            type: 'string',
            description: 'When the project was created (ISO timestamp)',
          },
          isBookmarked: { type: 'boolean', description: 'Whether the project is bookmarked' },
          isMember: { type: 'boolean', description: 'Whether the user is a member of the project' },
          features: { type: 'array', description: 'Enabled features for the project' },
          organization: {
            type: 'object',
            description: 'Organization information',
            properties: {
              id: { type: 'string', description: 'Organization ID' },
              slug: { type: 'string', description: 'Organization slug' },
              name: { type: 'string', description: 'Organization name' },
            },
          },
          teams: {
            type: 'array',
            description: 'Teams associated with the project',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'Team ID' },
                name: { type: 'string', description: 'Team name' },
                slug: { type: 'string', description: 'Team slug' },
              },
            },
          },
          status: { type: 'string', description: 'Project status' },
          isPublic: { type: 'boolean', description: 'Whether the project is publicly visible' },
        },
      },
    },
    nextCursor: {
      type: 'string',
      description: 'Cursor for the next page of results (if available)',
    },
    hasMore: {
      type: 'boolean',
      description: 'Whether there are more results available',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: projects_update.ts]---
Location: sim-main/apps/sim/tools/sentry/projects_update.ts

```typescript
import type { SentryUpdateProjectParams, SentryUpdateProjectResponse } from '@/tools/sentry/types'
import type { ToolConfig } from '@/tools/types'

export const updateProjectTool: ToolConfig<SentryUpdateProjectParams, SentryUpdateProjectResponse> =
  {
    id: 'sentry_projects_update',
    name: 'Update Project',
    description:
      'Update a Sentry project by changing its name, slug, platform, or other settings. Returns the updated project details.',
    version: '1.0.0',

    params: {
      apiKey: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'Sentry API authentication token',
      },
      organizationSlug: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'The slug of the organization',
      },
      projectSlug: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description: 'The slug of the project to update',
      },
      name: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'New name for the project',
      },
      slug: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'New URL-friendly project identifier',
      },
      platform: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'New platform/language for the project (e.g., javascript, python, node)',
      },
      isBookmarked: {
        type: 'boolean',
        required: false,
        visibility: 'user-or-llm',
        description: 'Whether to bookmark the project',
      },
      digestsMinDelay: {
        type: 'number',
        required: false,
        visibility: 'user-only',
        description: 'Minimum delay (in seconds) for digest notifications',
      },
      digestsMaxDelay: {
        type: 'number',
        required: false,
        visibility: 'user-only',
        description: 'Maximum delay (in seconds) for digest notifications',
      },
    },

    request: {
      url: (params) =>
        `https://sentry.io/api/0/projects/${params.organizationSlug}/${params.projectSlug}/`,
      method: 'PUT',
      headers: (params) => ({
        Authorization: `Bearer ${params.apiKey}`,
        'Content-Type': 'application/json',
      }),
      body: (params) => {
        const body: Record<string, any> = {}

        if (params.name !== undefined && params.name !== null && params.name !== '') {
          body.name = params.name
        }

        if (params.slug !== undefined && params.slug !== null && params.slug !== '') {
          body.slug = params.slug
        }

        if (params.platform !== undefined && params.platform !== null && params.platform !== '') {
          body.platform = params.platform
        }

        if (params.isBookmarked !== undefined && params.isBookmarked !== null) {
          body.isBookmarked = params.isBookmarked
        }

        if (params.digestsMinDelay !== undefined && params.digestsMinDelay !== null) {
          body.digestsMinDelay = Number(params.digestsMinDelay)
        }

        if (params.digestsMaxDelay !== undefined && params.digestsMaxDelay !== null) {
          body.digestsMaxDelay = Number(params.digestsMaxDelay)
        }

        return body
      },
    },

    transformResponse: async (response: Response) => {
      const project = await response.json()

      return {
        success: true,
        output: {
          project: {
            id: project.id,
            slug: project.slug,
            name: project.name,
            platform: project.platform,
            dateCreated: project.dateCreated,
            isBookmarked: project.isBookmarked,
            isMember: project.isMember,
            features: project.features || [],
            firstEvent: project.firstEvent,
            firstTransactionEvent: project.firstTransactionEvent,
            access: project.access || [],
            hasAccess: project.hasAccess,
            hasMinifiedStackTrace: project.hasMinifiedStackTrace,
            hasMonitors: project.hasMonitors,
            hasProfiles: project.hasProfiles,
            hasReplays: project.hasReplays,
            hasSessions: project.hasSessions,
            isInternal: project.isInternal,
            organization: {
              id: project.organization?.id || '',
              slug: project.organization?.slug || '',
              name: project.organization?.name || '',
            },
            team: {
              id: project.team?.id || '',
              name: project.team?.name || '',
              slug: project.team?.slug || '',
            },
            teams:
              project.teams?.map((team: any) => ({
                id: team.id,
                name: team.name,
                slug: team.slug,
              })) || [],
            status: project.status,
            color: project.color,
            isPublic: project.isPublic,
          },
        },
      }
    },

    outputs: {
      project: {
        type: 'object',
        description: 'The updated Sentry project',
        properties: {
          id: { type: 'string', description: 'Unique project ID' },
          slug: { type: 'string', description: 'URL-friendly project identifier' },
          name: { type: 'string', description: 'Project name' },
          platform: { type: 'string', description: 'Platform/language' },
          isBookmarked: { type: 'boolean', description: 'Whether the project is bookmarked' },
          organization: {
            type: 'object',
            description: 'Organization information',
            properties: {
              id: { type: 'string', description: 'Organization ID' },
              slug: { type: 'string', description: 'Organization slug' },
              name: { type: 'string', description: 'Organization name' },
            },
          },
          teams: {
            type: 'array',
            description: 'Teams associated with the project',
          },
        },
      },
    },
  }
```

--------------------------------------------------------------------------------

````
