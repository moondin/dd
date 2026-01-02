---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 747
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 747 of 933)

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

---[FILE: releases_create.ts]---
Location: sim-main/apps/sim/tools/sentry/releases_create.ts

```typescript
import type { SentryCreateReleaseParams, SentryCreateReleaseResponse } from '@/tools/sentry/types'
import type { ToolConfig } from '@/tools/types'

export const createReleaseTool: ToolConfig<SentryCreateReleaseParams, SentryCreateReleaseResponse> =
  {
    id: 'sentry_releases_create',
    name: 'Create Release',
    description:
      'Create a new release in Sentry. A release is a version of your code deployed to an environment. Can include commit information and associated projects. Returns the created release details.',
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
      version: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description:
          'Version identifier for the release (e.g., "2.0.0", "my-app@1.0.0", or a git commit SHA)',
      },
      projects: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description: 'Comma-separated list of project slugs to associate with this release',
      },
      ref: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Git reference (commit SHA, tag, or branch) for this release',
      },
      url: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'URL pointing to the release (e.g., GitHub release page)',
      },
      dateReleased: {
        type: 'string',
        required: false,
        visibility: 'user-only',
        description:
          'ISO 8601 timestamp for when the release was deployed (defaults to current time)',
      },
      commits: {
        type: 'string',
        required: false,
        visibility: 'user-only',
        description:
          'JSON array of commit objects with id, repository (optional), and message (optional). Example: [{"id":"abc123","message":"Fix bug"}]',
      },
    },

    request: {
      url: (params) => `https://sentry.io/api/0/organizations/${params.organizationSlug}/releases/`,
      method: 'POST',
      headers: (params) => ({
        Authorization: `Bearer ${params.apiKey}`,
        'Content-Type': 'application/json',
      }),
      body: (params) => {
        const body: Record<string, any> = {
          version: params.version,
          projects: params.projects
            .split(',')
            .map((p: string) => p.trim())
            .filter((p: string) => p.length > 0),
        }

        if (params.ref && params.ref !== null && params.ref !== '') {
          body.ref = params.ref
        }

        if (params.url && params.url !== null && params.url !== '') {
          body.url = params.url
        }

        if (params.dateReleased && params.dateReleased !== null && params.dateReleased !== '') {
          body.dateReleased = params.dateReleased
        }

        if (params.commits && params.commits !== null && params.commits !== '') {
          try {
            body.commits = JSON.parse(params.commits)
          } catch (e) {
            // If JSON parsing fails, ignore commits parameter
          }
        }

        return body
      },
    },

    transformResponse: async (response: Response) => {
      const release = await response.json()

      return {
        success: true,
        output: {
          release: {
            id: release.id,
            version: release.version,
            shortVersion: release.shortVersion,
            ref: release.ref,
            url: release.url,
            dateReleased: release.dateReleased,
            dateCreated: release.dateCreated,
            dateStarted: release.dateStarted,
            data: release.data || {},
            newGroups: release.newGroups || 0,
            owner: release.owner
              ? {
                  id: release.owner.id,
                  name: release.owner.name,
                  email: release.owner.email,
                }
              : null,
            commitCount: release.commitCount || 0,
            lastCommit: release.lastCommit
              ? {
                  id: release.lastCommit.id,
                  message: release.lastCommit.message,
                  dateCreated: release.lastCommit.dateCreated,
                }
              : null,
            deployCount: release.deployCount || 0,
            lastDeploy: release.lastDeploy
              ? {
                  id: release.lastDeploy.id,
                  environment: release.lastDeploy.environment,
                  dateStarted: release.lastDeploy.dateStarted,
                  dateFinished: release.lastDeploy.dateFinished,
                }
              : null,
            authors:
              release.authors?.map((author: any) => ({
                id: author.id,
                name: author.name,
                email: author.email,
              })) || [],
            projects:
              release.projects?.map((project: any) => ({
                id: project.id,
                name: project.name,
                slug: project.slug,
                platform: project.platform,
              })) || [],
            firstEvent: release.firstEvent,
            lastEvent: release.lastEvent,
            versionInfo: {
              buildHash: release.versionInfo?.buildHash || null,
              version: {
                raw: release.versionInfo?.version?.raw || release.version,
              },
              package: release.versionInfo?.package || null,
            },
          },
        },
      }
    },

    outputs: {
      release: {
        type: 'object',
        description: 'The newly created Sentry release',
        properties: {
          id: { type: 'string', description: 'Unique release ID' },
          version: { type: 'string', description: 'Release version identifier' },
          shortVersion: { type: 'string', description: 'Shortened version identifier' },
          ref: { type: 'string', description: 'Git reference (commit SHA, tag, or branch)' },
          url: { type: 'string', description: 'URL to the release' },
          dateReleased: {
            type: 'string',
            description: 'When the release was deployed (ISO timestamp)',
          },
          dateCreated: {
            type: 'string',
            description: 'When the release was created (ISO timestamp)',
          },
          commitCount: { type: 'number', description: 'Number of commits in this release' },
          projects: {
            type: 'array',
            description: 'Projects associated with this release',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'Project ID' },
                name: { type: 'string', description: 'Project name' },
                slug: { type: 'string', description: 'Project slug' },
              },
            },
          },
        },
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: releases_deploy.ts]---
Location: sim-main/apps/sim/tools/sentry/releases_deploy.ts

```typescript
import type { SentryCreateDeployParams, SentryCreateDeployResponse } from '@/tools/sentry/types'
import type { ToolConfig } from '@/tools/types'

export const createDeployTool: ToolConfig<SentryCreateDeployParams, SentryCreateDeployResponse> = {
  id: 'sentry_releases_deploy',
  name: 'Create Deploy',
  description:
    'Create a deploy record for a Sentry release in a specific environment. Deploys track when and where releases are deployed. Returns the created deploy details.',
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
    version: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Version identifier of the release being deployed',
    },
    environment: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description:
        'Environment name where the release is being deployed (e.g., "production", "staging")',
    },
    name: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Optional name for this deploy (e.g., "Deploy v2.0 to Production")',
    },
    url: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'URL pointing to the deploy (e.g., CI/CD pipeline URL)',
    },
    dateStarted: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'ISO 8601 timestamp for when the deploy started (defaults to current time)',
    },
    dateFinished: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'ISO 8601 timestamp for when the deploy finished',
    },
  },

  request: {
    url: (params) =>
      `https://sentry.io/api/0/organizations/${params.organizationSlug}/releases/${encodeURIComponent(params.version)}/deploys/`,
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: Record<string, any> = {
        environment: params.environment,
      }

      if (params.name && params.name !== null && params.name !== '') {
        body.name = params.name
      }

      if (params.url && params.url !== null && params.url !== '') {
        body.url = params.url
      }

      if (params.dateStarted && params.dateStarted !== null && params.dateStarted !== '') {
        body.dateStarted = params.dateStarted
      }

      if (params.dateFinished && params.dateFinished !== null && params.dateFinished !== '') {
        body.dateFinished = params.dateFinished
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const deploy = await response.json()

    return {
      success: true,
      output: {
        deploy: {
          id: deploy.id,
          environment: deploy.environment,
          name: deploy.name,
          url: deploy.url,
          dateStarted: deploy.dateStarted,
          dateFinished: deploy.dateFinished,
        },
      },
    }
  },

  outputs: {
    deploy: {
      type: 'object',
      description: 'The newly created deploy record',
      properties: {
        id: { type: 'string', description: 'Unique deploy ID' },
        environment: {
          type: 'string',
          description: 'Environment name where the release was deployed',
        },
        name: { type: 'string', description: 'Name of the deploy' },
        url: { type: 'string', description: 'URL pointing to the deploy' },
        dateStarted: {
          type: 'string',
          description: 'When the deploy started (ISO timestamp)',
        },
        dateFinished: {
          type: 'string',
          description: 'When the deploy finished (ISO timestamp)',
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: releases_list.ts]---
Location: sim-main/apps/sim/tools/sentry/releases_list.ts

```typescript
import type { SentryListReleasesParams, SentryListReleasesResponse } from '@/tools/sentry/types'
import type { ToolConfig } from '@/tools/types'

export const listReleasesTool: ToolConfig<SentryListReleasesParams, SentryListReleasesResponse> = {
  id: 'sentry_releases_list',
  name: 'List Releases',
  description:
    'List releases for a Sentry organization or project. Returns release details including version, commits, deploy information, and associated projects.',
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
      description: 'Filter releases by specific project slug (optional)',
    },
    query: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Search query to filter releases (e.g., version name pattern)',
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
      description: 'Number of releases to return per page (default: 25, max: 100)',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = `https://sentry.io/api/0/organizations/${params.organizationSlug}/releases/`
      const queryParams: string[] = []

      if (params.projectSlug && params.projectSlug !== null && params.projectSlug !== '') {
        queryParams.push(`project=${encodeURIComponent(params.projectSlug)}`)
      }

      if (params.query && params.query !== null && params.query !== '') {
        queryParams.push(`query=${encodeURIComponent(params.query)}`)
      }

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
        releases: data.map((release: any) => ({
          id: release.id,
          version: release.version,
          shortVersion: release.shortVersion,
          ref: release.ref,
          url: release.url,
          dateReleased: release.dateReleased,
          dateCreated: release.dateCreated,
          dateStarted: release.dateStarted,
          data: release.data || {},
          newGroups: release.newGroups || 0,
          owner: release.owner
            ? {
                id: release.owner.id,
                name: release.owner.name,
                email: release.owner.email,
              }
            : null,
          commitCount: release.commitCount || 0,
          lastCommit: release.lastCommit
            ? {
                id: release.lastCommit.id,
                message: release.lastCommit.message,
                dateCreated: release.lastCommit.dateCreated,
              }
            : null,
          deployCount: release.deployCount || 0,
          lastDeploy: release.lastDeploy
            ? {
                id: release.lastDeploy.id,
                environment: release.lastDeploy.environment,
                dateStarted: release.lastDeploy.dateStarted,
                dateFinished: release.lastDeploy.dateFinished,
              }
            : null,
          authors:
            release.authors?.map((author: any) => ({
              id: author.id,
              name: author.name,
              email: author.email,
            })) || [],
          projects:
            release.projects?.map((project: any) => ({
              id: project.id,
              name: project.name,
              slug: project.slug,
              platform: project.platform,
            })) || [],
          firstEvent: release.firstEvent,
          lastEvent: release.lastEvent,
          versionInfo: {
            buildHash: release.versionInfo?.buildHash || null,
            version: {
              raw: release.versionInfo?.version?.raw || release.version,
            },
            package: release.versionInfo?.package || null,
          },
        })),
        nextCursor,
        hasMore,
      },
    }
  },

  outputs: {
    releases: {
      type: 'array',
      description: 'List of Sentry releases',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Unique release ID' },
          version: { type: 'string', description: 'Release version identifier' },
          shortVersion: { type: 'string', description: 'Shortened version identifier' },
          ref: { type: 'string', description: 'Git reference (commit SHA, tag, or branch)' },
          url: { type: 'string', description: 'URL to the release (e.g., GitHub release page)' },
          dateReleased: {
            type: 'string',
            description: 'When the release was deployed (ISO timestamp)',
          },
          dateCreated: {
            type: 'string',
            description: 'When the release was created (ISO timestamp)',
          },
          newGroups: {
            type: 'number',
            description: 'Number of new issues introduced in this release',
          },
          owner: {
            type: 'object',
            description: 'Owner of the release',
            properties: {
              id: { type: 'string', description: 'User ID' },
              name: { type: 'string', description: 'User name' },
              email: { type: 'string', description: 'User email' },
            },
          },
          commitCount: { type: 'number', description: 'Number of commits in this release' },
          deployCount: { type: 'number', description: 'Number of deploys for this release' },
          projects: {
            type: 'array',
            description: 'Projects associated with this release',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'Project ID' },
                name: { type: 'string', description: 'Project name' },
                slug: { type: 'string', description: 'Project slug' },
                platform: { type: 'string', description: 'Project platform' },
              },
            },
          },
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

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/sentry/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

// Base parameter interface shared across all Sentry tools
export interface SentryBaseParams {
  apiKey: string
  organizationSlug: string
}

// ============================================================================
// ISSUE TYPES
// ============================================================================

export interface SentryIssue {
  id: string
  shortId: string
  title: string
  culprit: string
  permalink: string
  logger: string | null
  level: string
  status: string
  statusDetails: Record<string, any>
  isPublic: boolean
  platform: string
  project: {
    id: string
    name: string
    slug: string
    platform: string
  }
  type: string
  metadata: Record<string, any>
  numComments: number
  assignedTo: {
    id: string
    name: string
    email: string
  } | null
  isBookmarked: boolean
  isSubscribed: boolean
  subscriptionDetails: Record<string, any> | null
  hasSeen: boolean
  annotations: string[]
  isUnhandled: boolean
  count: string
  userCount: number
  firstSeen: string
  lastSeen: string
  stats: Record<string, any>
}

export interface SentryListIssuesParams extends SentryBaseParams {
  projectSlug?: string
  query?: string
  statsPeriod?: string
  cursor?: string
  limit?: number
  status?: string
  sort?: string
}

export interface SentryListIssuesResponse extends ToolResponse {
  output: {
    issues: SentryIssue[]
    nextCursor?: string
    hasMore: boolean
  }
}

export interface SentryGetIssueParams extends SentryBaseParams {
  issueId: string
}

export interface SentryGetIssueResponse extends ToolResponse {
  output: {
    issue: SentryIssue
  }
}

export interface SentryUpdateIssueParams extends SentryBaseParams {
  issueId: string
  status?: string
  assignedTo?: string
  isBookmarked?: boolean
  isSubscribed?: boolean
  isPublic?: boolean
}

export interface SentryUpdateIssueResponse extends ToolResponse {
  output: {
    issue: SentryIssue
  }
}

// ============================================================================
// PROJECT TYPES
// ============================================================================

export interface SentryProject {
  id: string
  slug: string
  name: string
  platform: string
  dateCreated: string
  isBookmarked: boolean
  isMember: boolean
  features: string[]
  firstEvent: string | null
  firstTransactionEvent: boolean
  access: string[]
  hasAccess: boolean
  hasMinifiedStackTrace: boolean
  hasMonitors: boolean
  hasProfiles: boolean
  hasReplays: boolean
  hasSessions: boolean
  isInternal: boolean
  organization: {
    id: string
    slug: string
    name: string
  }
  team: {
    id: string
    name: string
    slug: string
  }
  teams: Array<{
    id: string
    name: string
    slug: string
  }>
  status: string
  color: string
  isPublic: boolean
}

export interface SentryListProjectsParams extends SentryBaseParams {
  cursor?: string
  limit?: number
}

export interface SentryListProjectsResponse extends ToolResponse {
  output: {
    projects: SentryProject[]
    nextCursor?: string
    hasMore: boolean
  }
}

export interface SentryGetProjectParams extends SentryBaseParams {
  projectSlug: string
}

export interface SentryGetProjectResponse extends ToolResponse {
  output: {
    project: SentryProject
  }
}

export interface SentryCreateProjectParams extends SentryBaseParams {
  name: string
  slug?: string
  platform?: string
  teamSlug: string
  defaultRules?: boolean
}

export interface SentryCreateProjectResponse extends ToolResponse {
  output: {
    project: SentryProject
  }
}

export interface SentryUpdateProjectParams extends SentryBaseParams {
  projectSlug: string
  name?: string
  slug?: string
  platform?: string
  isBookmarked?: boolean
  digestsMinDelay?: number
  digestsMaxDelay?: number
}

export interface SentryUpdateProjectResponse extends ToolResponse {
  output: {
    project: SentryProject
  }
}

// ============================================================================
// EVENT TYPES
// ============================================================================

export interface SentryEvent {
  id: string
  eventID: string
  projectID: string
  groupID: string
  message: string
  title: string
  location: string | null
  culprit: string
  dateCreated: string
  dateReceived: string
  user: {
    id: string
    email: string
    username: string
    ipAddress: string
    name: string
  } | null
  tags: Array<{
    key: string
    value: string
  }>
  contexts: Record<string, any>
  platform: string
  type: string
  metadata: Record<string, any>
  entries: Array<{
    type: string
    data: Record<string, any>
  }>
  errors: Array<{
    type: string
    message: string
    data: Record<string, any>
  }>
  dist: string | null
  fingerprints: string[]
  sdk: {
    name: string
    version: string
  } | null
}

export interface SentryListEventsParams extends SentryBaseParams {
  projectSlug: string
  issueId?: string
  query?: string
  cursor?: string
  limit?: number
  statsPeriod?: string
}

export interface SentryListEventsResponse extends ToolResponse {
  output: {
    events: SentryEvent[]
    nextCursor?: string
    hasMore: boolean
  }
}

export interface SentryGetEventParams extends SentryBaseParams {
  projectSlug: string
  eventId: string
}

export interface SentryGetEventResponse extends ToolResponse {
  output: {
    event: SentryEvent
  }
}

// ============================================================================
// RELEASE TYPES
// ============================================================================

export interface SentryRelease {
  id: string
  version: string
  shortVersion: string
  ref: string | null
  url: string | null
  dateReleased: string | null
  dateCreated: string
  dateStarted: string | null
  data: Record<string, any>
  newGroups: number
  owner: {
    id: string
    name: string
    email: string
  } | null
  commitCount: number
  lastCommit: {
    id: string
    message: string
    dateCreated: string
  } | null
  deployCount: number
  lastDeploy: {
    id: string
    environment: string
    dateStarted: string
    dateFinished: string
  } | null
  authors: Array<{
    id: string
    name: string
    email: string
  }>
  projects: Array<{
    id: string
    name: string
    slug: string
    platform: string
  }>
  firstEvent: string | null
  lastEvent: string | null
  versionInfo: {
    buildHash: string | null
    version: {
      raw: string
    }
    package: string | null
  }
}

export interface SentryListReleasesParams extends SentryBaseParams {
  projectSlug?: string
  query?: string
  cursor?: string
  limit?: number
}

export interface SentryListReleasesResponse extends ToolResponse {
  output: {
    releases: SentryRelease[]
    nextCursor?: string
    hasMore: boolean
  }
}

export interface SentryCreateReleaseParams extends SentryBaseParams {
  version: string
  ref?: string
  url?: string
  projects: string // Comma-separated list of project slugs
  dateReleased?: string
  commits?: string // JSON string of commit objects
}

export interface SentryCreateReleaseResponse extends ToolResponse {
  output: {
    release: SentryRelease
  }
}

export interface SentryCreateDeployParams extends SentryBaseParams {
  version: string
  environment: string
  name?: string
  url?: string
  dateStarted?: string
  dateFinished?: string
}

export interface SentryCreateDeployResponse extends ToolResponse {
  output: {
    deploy: {
      id: string
      environment: string
      name: string | null
      url: string | null
      dateStarted: string
      dateFinished: string | null
    }
  }
}

// ============================================================================
// UNION RESPONSE TYPE
// ============================================================================

export type SentryResponse =
  | SentryListIssuesResponse
  | SentryGetIssueResponse
  | SentryUpdateIssueResponse
  | SentryListProjectsResponse
  | SentryGetProjectResponse
  | SentryCreateProjectResponse
  | SentryUpdateProjectResponse
  | SentryListEventsResponse
  | SentryGetEventResponse
  | SentryListReleasesResponse
  | SentryCreateReleaseResponse
  | SentryCreateDeployResponse
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/serper/index.ts

```typescript
import { searchTool } from './search'

export const serperSearchTool = searchTool
```

--------------------------------------------------------------------------------

---[FILE: search.ts]---
Location: sim-main/apps/sim/tools/serper/search.ts

```typescript
import type { SearchParams, SearchResponse, SearchResult } from '@/tools/serper/types'
import type { ToolConfig } from '@/tools/types'

export const searchTool: ToolConfig<SearchParams, SearchResponse> = {
  id: 'serper_search',
  name: 'Web Search',
  description:
    'A powerful web search tool that provides access to Google search results through Serper.dev API. Supports different types of searches including regular web search, news, places, and images, with each result containing relevant metadata like titles, URLs, snippets, and type-specific information.',
  version: '1.0.0',

  params: {
    query: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The search query',
    },
    num: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of results to return',
    },
    gl: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Country code for search results',
    },
    hl: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Language code for search results',
    },
    type: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Type of search to perform',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Serper API Key',
    },
  },

  request: {
    url: (params) => `https://google.serper.dev/${params.type || 'search'}`,
    method: 'POST',
    headers: (params) => ({
      'X-API-KEY': params.apiKey,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: Record<string, any> = {
        q: params.query,
      }

      // Only include optional parameters if they are explicitly set
      if (params.num) body.num = Number(params.num)
      if (params.gl) body.gl = params.gl
      if (params.hl) body.hl = params.hl

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    const searchType = response.url.split('/').pop() || 'search'
    let searchResults: SearchResult[] = []

    if (searchType === 'news') {
      searchResults =
        data.news?.map((item: any, index: number) => ({
          title: item.title,
          link: item.link,
          snippet: item.snippet,
          position: index + 1,
          date: item.date,
          imageUrl: item.imageUrl,
        })) || []
    } else if (searchType === 'places') {
      searchResults =
        data.places?.map((item: any, index: number) => ({
          title: item.title,
          link: item.link,
          snippet: item.snippet,
          position: index + 1,
          rating: item.rating,
          reviews: item.reviews,
          address: item.address,
        })) || []
    } else if (searchType === 'images') {
      searchResults =
        data.images?.map((item: any, index: number) => ({
          title: item.title,
          link: item.link,
          snippet: item.snippet,
          position: index + 1,
          imageUrl: item.imageUrl,
        })) || []
    } else {
      searchResults =
        data.organic?.map((item: any, index: number) => ({
          title: item.title,
          link: item.link,
          snippet: item.snippet,
          position: index + 1,
        })) || []
    }

    return {
      success: true,
      output: {
        searchResults,
      },
    }
  },

  outputs: {
    searchResults: {
      type: 'array',
      description:
        'Search results with titles, links, snippets, and type-specific metadata (date for news, rating for places, imageUrl for images)',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/serper/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface SearchParams {
  query: string
  apiKey: string
  num?: number
  gl?: string // country code
  hl?: string // language code
  type?: 'search' | 'news' | 'places' | 'images'
}

export interface SearchResult {
  title: string
  link: string
  snippet: string
  position: number
  imageUrl?: string
  date?: string
  rating?: string
  reviews?: string
  address?: string
}

export interface SearchResponse extends ToolResponse {
  output: {
    searchResults: SearchResult[]
  }
}
```

--------------------------------------------------------------------------------

---[FILE: create_record.ts]---
Location: sim-main/apps/sim/tools/servicenow/create_record.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ServiceNowCreateParams, ServiceNowCreateResponse } from '@/tools/servicenow/types'
import { createBasicAuthHeader } from '@/tools/servicenow/utils'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('ServiceNowCreateRecordTool')

export const createRecordTool: ToolConfig<ServiceNowCreateParams, ServiceNowCreateResponse> = {
  id: 'servicenow_create_record',
  name: 'Create ServiceNow Record',
  description: 'Create a new record in a ServiceNow table',
  version: '1.0.0',

  params: {
    instanceUrl: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ServiceNow instance URL (e.g., https://instance.service-now.com)',
    },
    username: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ServiceNow username',
    },
    password: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ServiceNow password',
    },
    tableName: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Table name (e.g., incident, task, sys_user)',
    },
    fields: {
      type: 'json',
      required: true,
      visibility: 'user-or-llm',
      description: 'Fields to set on the record (JSON object)',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = params.instanceUrl.replace(/\/$/, '')
      if (!baseUrl) {
        throw new Error('ServiceNow instance URL is required')
      }
      return `${baseUrl}/api/now/table/${params.tableName}`
    },
    method: 'POST',
    headers: (params) => {
      if (!params.username || !params.password) {
        throw new Error('ServiceNow username and password are required')
      }
      return {
        Authorization: createBasicAuthHeader(params.username, params.password),
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }
    },
    body: (params) => {
      if (!params.fields || typeof params.fields !== 'object') {
        throw new Error('Fields must be a JSON object')
      }
      return params.fields
    },
  },

  transformResponse: async (response: Response) => {
    try {
      const data = await response.json()

      if (!response.ok) {
        const error = data.error || data
        throw new Error(typeof error === 'string' ? error : error.message || JSON.stringify(error))
      }

      return {
        success: true,
        output: {
          record: data.result,
          metadata: {
            recordCount: 1,
          },
        },
      }
    } catch (error) {
      logger.error('ServiceNow create record - Error processing response:', { error })
      throw error
    }
  },

  outputs: {
    record: {
      type: 'json',
      description: 'Created ServiceNow record with sys_id and other fields',
    },
    metadata: {
      type: 'json',
      description: 'Operation metadata',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_record.ts]---
Location: sim-main/apps/sim/tools/servicenow/delete_record.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ServiceNowDeleteParams, ServiceNowDeleteResponse } from '@/tools/servicenow/types'
import { createBasicAuthHeader } from '@/tools/servicenow/utils'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('ServiceNowDeleteRecordTool')

export const deleteRecordTool: ToolConfig<ServiceNowDeleteParams, ServiceNowDeleteResponse> = {
  id: 'servicenow_delete_record',
  name: 'Delete ServiceNow Record',
  description: 'Delete a record from a ServiceNow table',
  version: '1.0.0',

  params: {
    instanceUrl: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ServiceNow instance URL (e.g., https://instance.service-now.com)',
    },
    username: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ServiceNow username',
    },
    password: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ServiceNow password',
    },
    tableName: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Table name',
    },
    sysId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Record sys_id to delete',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = params.instanceUrl.replace(/\/$/, '')
      if (!baseUrl) {
        throw new Error('ServiceNow instance URL is required')
      }
      return `${baseUrl}/api/now/table/${params.tableName}/${params.sysId}`
    },
    method: 'DELETE',
    headers: (params) => {
      if (!params.username || !params.password) {
        throw new Error('ServiceNow username and password are required')
      }
      return {
        Authorization: createBasicAuthHeader(params.username, params.password),
        Accept: 'application/json',
      }
    },
  },

  transformResponse: async (response: Response, params?: ServiceNowDeleteParams) => {
    try {
      if (!response.ok) {
        let errorData: any
        try {
          errorData = await response.json()
        } catch {
          errorData = { status: response.status, statusText: response.statusText }
        }
        throw new Error(
          typeof errorData === 'string'
            ? errorData
            : errorData.error?.message || JSON.stringify(errorData)
        )
      }

      return {
        success: true,
        output: {
          success: true,
          metadata: {
            deletedSysId: params?.sysId || '',
          },
        },
      }
    } catch (error) {
      logger.error('ServiceNow delete record - Error processing response:', { error })
      throw error
    }
  },

  outputs: {
    success: {
      type: 'boolean',
      description: 'Whether the deletion was successful',
    },
    metadata: {
      type: 'json',
      description: 'Operation metadata',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/servicenow/index.ts

```typescript
import { createRecordTool } from '@/tools/servicenow/create_record'
import { deleteRecordTool } from '@/tools/servicenow/delete_record'
import { readRecordTool } from '@/tools/servicenow/read_record'
import { updateRecordTool } from '@/tools/servicenow/update_record'

export {
  createRecordTool as servicenowCreateRecordTool,
  readRecordTool as servicenowReadRecordTool,
  updateRecordTool as servicenowUpdateRecordTool,
  deleteRecordTool as servicenowDeleteRecordTool,
}
```

--------------------------------------------------------------------------------

````
