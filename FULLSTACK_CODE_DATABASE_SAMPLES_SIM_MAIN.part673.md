---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 673
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 673 of 933)

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

---[FILE: issue_comment.ts]---
Location: sim-main/apps/sim/tools/github/issue_comment.ts

```typescript
import type { CreateIssueCommentParams, IssueCommentResponse } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const issueCommentTool: ToolConfig<CreateIssueCommentParams, IssueCommentResponse> = {
  id: 'github_issue_comment',
  name: 'GitHub Issue Comment Creator',
  description: 'Create a comment on a GitHub issue',
  version: '1.0.0',

  params: {
    owner: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Repository owner',
    },
    repo: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Repository name',
    },
    issue_number: {
      type: 'number',
      required: true,
      visibility: 'user-or-llm',
      description: 'Issue number',
    },
    body: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Comment content',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'GitHub API token',
    },
  },

  request: {
    url: (params) =>
      `https://api.github.com/repos/${params.owner}/${params.repo}/issues/${params.issue_number}/comments`,
    method: 'POST',
    headers: (params) => ({
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${params.apiKey}`,
      'X-GitHub-Api-Version': '2022-11-28',
    }),
    body: (params) => ({
      body: params.body,
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    const content = `Comment created on issue #${data.issue_url.split('/').pop()}: "${data.body.substring(0, 100)}${data.body.length > 100 ? '...' : ''}"`

    return {
      success: true,
      output: {
        content,
        metadata: {
          id: data.id,
          html_url: data.html_url,
          body: data.body,
          created_at: data.created_at,
          updated_at: data.updated_at,
          user: {
            login: data.user.login,
            id: data.user.id,
          },
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Human-readable comment confirmation' },
    metadata: {
      type: 'object',
      description: 'Comment metadata',
      properties: {
        id: { type: 'number', description: 'Comment ID' },
        html_url: { type: 'string', description: 'GitHub web URL' },
        body: { type: 'string', description: 'Comment body' },
        created_at: { type: 'string', description: 'Creation timestamp' },
        updated_at: { type: 'string', description: 'Last update timestamp' },
        user: {
          type: 'object',
          description: 'User who created the comment',
          properties: {
            login: { type: 'string', description: 'User login' },
            id: { type: 'number', description: 'User ID' },
          },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: latest_commit.ts]---
Location: sim-main/apps/sim/tools/github/latest_commit.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { LatestCommitParams, LatestCommitResponse } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('GitHubLatestCommitTool')

export const latestCommitTool: ToolConfig<LatestCommitParams, LatestCommitResponse> = {
  id: 'github_latest_commit',
  name: 'GitHub Latest Commit',
  description: 'Retrieve the latest commit from a GitHub repository',
  version: '1.0.0',

  params: {
    owner: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Repository owner (user or organization)',
    },
    repo: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Repository name',
    },
    branch: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: "Branch name (defaults to the repository's default branch)",
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'GitHub API token',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = `https://api.github.com/repos/${params.owner}/${params.repo}`
      return params.branch ? `${baseUrl}/commits/${params.branch}` : `${baseUrl}/commits/HEAD`
    },
    method: 'GET',
    headers: (params) => ({
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${params.apiKey}`,
      'X-GitHub-Api-Version': '2022-11-28',
    }),
  },

  transformResponse: async (response, params) => {
    const data = await response.json()

    const content = `Latest commit: "${data.commit.message}" by ${data.commit.author.name} on ${data.commit.author.date}. SHA: ${data.sha}`

    const files = data.files || []
    const fileDetailsWithContent = []

    if (files.length > 0) {
      for (const file of files) {
        const fileDetail = {
          filename: file.filename,
          additions: file.additions,
          deletions: file.deletions,
          changes: file.changes,
          status: file.status,
          raw_url: file.raw_url,
          blob_url: file.blob_url,
          patch: file.patch,
          content: undefined as string | undefined,
        }

        if (file.status !== 'removed' && file.raw_url) {
          try {
            const contentResponse = await fetch(file.raw_url, {
              headers: {
                Authorization: `Bearer ${params?.apiKey}`,
                'X-GitHub-Api-Version': '2022-11-28',
              },
            })

            if (contentResponse.ok) {
              fileDetail.content = await contentResponse.text()
            }
          } catch (error) {
            logger.error(`Failed to fetch content for ${file.filename}:`, error)
          }
        }

        fileDetailsWithContent.push(fileDetail)
      }
    }

    return {
      success: true,
      output: {
        content,
        metadata: {
          sha: data.sha,
          html_url: data.html_url,
          commit_message: data.commit.message,
          author: {
            name: data.commit.author.name,
            login: data.author?.login || 'Unknown',
            avatar_url: data.author?.avatar_url || '',
            html_url: data.author?.html_url || '',
          },
          committer: {
            name: data.commit.committer.name,
            login: data.committer?.login || 'Unknown',
            avatar_url: data.committer?.avatar_url || '',
            html_url: data.committer?.html_url || '',
          },
          stats: data.stats
            ? {
                additions: data.stats.additions,
                deletions: data.stats.deletions,
                total: data.stats.total,
              }
            : undefined,
          files: fileDetailsWithContent.length > 0 ? fileDetailsWithContent : undefined,
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Human-readable commit summary' },
    metadata: {
      type: 'object',
      description: 'Commit metadata',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_branches.ts]---
Location: sim-main/apps/sim/tools/github/list_branches.ts

```typescript
import type { BranchListResponse, ListBranchesParams } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const listBranchesTool: ToolConfig<ListBranchesParams, BranchListResponse> = {
  id: 'github_list_branches',
  name: 'GitHub List Branches',
  description:
    'List all branches in a GitHub repository. Optionally filter by protected status and control pagination.',
  version: '1.0.0',

  params: {
    owner: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Repository owner (user or organization)',
    },
    repo: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Repository name',
    },
    protected: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter branches by protection status',
    },
    per_page: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Number of results per page (max 100, default 30)',
    },
    page: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Page number for pagination (default 1)',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'GitHub Personal Access Token',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = `https://api.github.com/repos/${params.owner}/${params.repo}/branches`
      const queryParams = new URLSearchParams()

      if (params.protected !== undefined) {
        queryParams.append('protected', params.protected.toString())
      }
      if (params.per_page) {
        queryParams.append('per_page', Number(params.per_page).toString())
      }
      if (params.page) {
        queryParams.append('page', Number(params.page).toString())
      }

      const query = queryParams.toString()
      return query ? `${baseUrl}?${query}` : baseUrl
    },
    method: 'GET',
    headers: (params) => ({
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${params.apiKey}`,
      'X-GitHub-Api-Version': '2022-11-28',
    }),
  },

  transformResponse: async (response) => {
    const branches = await response.json()

    const branchList = branches
      .map(
        (branch: any) =>
          `- ${branch.name} (SHA: ${branch.commit.sha.substring(0, 7)}${branch.protected ? ', Protected' : ''})`
      )
      .join('\n')

    const content = `Found ${branches.length} branch${branches.length !== 1 ? 'es' : ''}:
${branchList}`

    return {
      success: true,
      output: {
        content,
        metadata: {
          branches: branches.map((branch: any) => ({
            name: branch.name,
            commit: {
              sha: branch.commit.sha,
              url: branch.commit.url,
            },
            protected: branch.protected,
          })),
          total_count: branches.length,
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Human-readable list of branches' },
    metadata: {
      type: 'object',
      description: 'Branch list metadata',
      properties: {
        branches: {
          type: 'array',
          description: 'Array of branch objects',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Branch name' },
              commit: {
                type: 'object',
                description: 'Commit information',
                properties: {
                  sha: { type: 'string', description: 'Commit SHA' },
                  url: { type: 'string', description: 'Commit API URL' },
                },
              },
              protected: { type: 'boolean', description: 'Whether branch is protected' },
            },
          },
        },
        total_count: { type: 'number', description: 'Total number of branches' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_issues.ts]---
Location: sim-main/apps/sim/tools/github/list_issues.ts

```typescript
import type { IssuesListResponse, ListIssuesParams } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const listIssuesTool: ToolConfig<ListIssuesParams, IssuesListResponse> = {
  id: 'github_list_issues',
  name: 'GitHub List Issues',
  description:
    'List issues in a GitHub repository. Note: This includes pull requests as PRs are considered issues in GitHub',
  version: '1.0.0',

  params: {
    owner: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Repository owner',
    },
    repo: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Repository name',
    },
    state: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by state: open, closed, or all (default: open)',
      default: 'open',
    },
    assignee: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by assignee username',
    },
    creator: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by creator username',
    },
    labels: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Comma-separated list of label names to filter by',
    },
    sort: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Sort by: created, updated, or comments (default: created)',
      default: 'created',
    },
    direction: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Sort direction: asc or desc (default: desc)',
      default: 'desc',
    },
    per_page: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Results per page (max 100, default: 30)',
      default: 30,
    },
    page: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Page number (default: 1)',
      default: 1,
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'GitHub API token',
    },
  },

  request: {
    url: (params) => {
      const url = new URL(`https://api.github.com/repos/${params.owner}/${params.repo}/issues`)
      if (params.state) url.searchParams.append('state', params.state)
      if (params.assignee) url.searchParams.append('assignee', params.assignee)
      if (params.creator) url.searchParams.append('creator', params.creator)
      if (params.labels) url.searchParams.append('labels', params.labels)
      if (params.sort) url.searchParams.append('sort', params.sort)
      if (params.direction) url.searchParams.append('direction', params.direction)
      if (params.per_page) url.searchParams.append('per_page', Number(params.per_page).toString())
      if (params.page) url.searchParams.append('page', Number(params.page).toString())
      return url.toString()
    },
    method: 'GET',
    headers: (params) => ({
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${params.apiKey}`,
      'X-GitHub-Api-Version': '2022-11-28',
    }),
  },

  transformResponse: async (response) => {
    const issues = await response.json()

    const transformedIssues = issues.map((issue: any) => ({
      number: issue.number,
      title: issue.title,
      state: issue.state,
      html_url: issue.html_url,
      labels: issue.labels?.map((label: any) => label.name) || [],
      assignees: issue.assignees?.map((assignee: any) => assignee.login) || [],
      created_at: issue.created_at,
      updated_at: issue.updated_at,
    }))

    const content = `Found ${issues.length} issue(s):
${transformedIssues
  .map(
    (issue: any) =>
      `#${issue.number}: "${issue.title}" (${issue.state}) - ${issue.html_url}
  ${issue.labels.length > 0 ? `Labels: ${issue.labels.join(', ')}` : 'No labels'}
  ${issue.assignees.length > 0 ? `Assignees: ${issue.assignees.join(', ')}` : 'No assignees'}`
  )
  .join('\n\n')}`

    return {
      success: true,
      output: {
        content,
        metadata: {
          issues: transformedIssues,
          total_count: issues.length,
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Human-readable list of issues' },
    metadata: {
      type: 'object',
      description: 'Issues list metadata',
      properties: {
        issues: {
          type: 'array',
          description: 'Array of issues',
          items: {
            type: 'object',
            properties: {
              number: { type: 'number', description: 'Issue number' },
              title: { type: 'string', description: 'Issue title' },
              state: { type: 'string', description: 'Issue state' },
              html_url: { type: 'string', description: 'GitHub web URL' },
              labels: { type: 'array', description: 'Array of label names' },
              assignees: { type: 'array', description: 'Array of assignee usernames' },
              created_at: { type: 'string', description: 'Creation timestamp' },
              updated_at: { type: 'string', description: 'Last update timestamp' },
            },
          },
        },
        total_count: { type: 'number', description: 'Total number of issues returned' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_issue_comments.ts]---
Location: sim-main/apps/sim/tools/github/list_issue_comments.ts

```typescript
import type { CommentsListResponse, ListIssueCommentsParams } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const listIssueCommentsTool: ToolConfig<ListIssueCommentsParams, CommentsListResponse> = {
  id: 'github_list_issue_comments',
  name: 'GitHub Issue Comments Lister',
  description: 'List all comments on a GitHub issue',
  version: '1.0.0',

  params: {
    owner: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Repository owner',
    },
    repo: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Repository name',
    },
    issue_number: {
      type: 'number',
      required: true,
      visibility: 'user-or-llm',
      description: 'Issue number',
    },
    since: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Only show comments updated after this ISO 8601 timestamp',
    },
    per_page: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Number of results per page (max 100)',
      default: 30,
    },
    page: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Page number',
      default: 1,
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'GitHub API token',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = `https://api.github.com/repos/${params.owner}/${params.repo}/issues/${params.issue_number}/comments`
      const queryParams = new URLSearchParams()

      if (params.since) queryParams.append('since', params.since)
      if (params.per_page) queryParams.append('per_page', Number(params.per_page).toString())
      if (params.page) queryParams.append('page', Number(params.page).toString())

      const query = queryParams.toString()
      return query ? `${baseUrl}?${query}` : baseUrl
    },
    method: 'GET',
    headers: (params) => ({
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${params.apiKey}`,
      'X-GitHub-Api-Version': '2022-11-28',
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    const content = `Found ${data.length} comment${data.length !== 1 ? 's' : ''} on issue #${response.url.split('/').slice(-2, -1)[0]}${
      data.length > 0
        ? `\n\nRecent comments:\n${data
            .slice(0, 5)
            .map(
              (c: any) =>
                `- ${c.user.login} (${new Date(c.created_at).toLocaleDateString()}): "${c.body.substring(0, 80)}${c.body.length > 80 ? '...' : ''}"`
            )
            .join('\n')}`
        : ''
    }`

    return {
      success: true,
      output: {
        content,
        metadata: {
          comments: data.map((comment: any) => ({
            id: comment.id,
            body: comment.body,
            user: { login: comment.user.login },
            created_at: comment.created_at,
            html_url: comment.html_url,
          })),
          total_count: data.length,
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Human-readable comments summary' },
    metadata: {
      type: 'object',
      description: 'Comments list metadata',
      properties: {
        comments: {
          type: 'array',
          description: 'Array of comment objects',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', description: 'Comment ID' },
              body: { type: 'string', description: 'Comment body' },
              user: {
                type: 'object',
                description: 'User who created the comment',
                properties: {
                  login: { type: 'string', description: 'User login' },
                },
              },
              created_at: { type: 'string', description: 'Creation timestamp' },
              html_url: { type: 'string', description: 'GitHub web URL' },
            },
          },
        },
        total_count: { type: 'number', description: 'Total number of comments' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_projects.ts]---
Location: sim-main/apps/sim/tools/github/list_projects.ts

```typescript
import type { ListProjectsParams, ListProjectsResponse } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const listProjectsTool: ToolConfig<ListProjectsParams, ListProjectsResponse> = {
  id: 'github_list_projects',
  name: 'GitHub List Projects',
  description:
    'List GitHub Projects V2 for an organization or user. Returns up to 20 projects with their details including ID, title, number, URL, and status.',
  version: '1.0.0',

  params: {
    owner_type: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Owner type: "org" for organization or "user" for user',
    },
    owner_login: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Organization or user login name',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'GitHub Personal Access Token with project read permissions',
    },
  },

  request: {
    url: 'https://api.github.com/graphql',
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const ownerType = params.owner_type === 'org' ? 'organization' : 'user'
      const query = `
        query($login: String!) {
          ${ownerType}(login: $login) {
            projectsV2(first: 20) {
              nodes {
                id
                title
                number
                url
                closed
                public
                shortDescription
              }
              totalCount
            }
          }
        }
      `
      return {
        query,
        variables: {
          login: params.owner_login,
        },
      }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        output: {
          content: `GraphQL Error: ${data.errors[0].message}`,
          metadata: {
            projects: [],
            totalCount: 0,
          },
        },
        error: data.errors[0].message,
      }
    }

    const ownerData = data.data?.organization || data.data?.user
    if (!ownerData) {
      return {
        success: false,
        output: {
          content: 'No organization or user found',
          metadata: {
            projects: [],
            totalCount: 0,
          },
        },
        error: 'No organization or user found',
      }
    }

    const projectsData = ownerData.projectsV2
    const projects = projectsData.nodes.map((project: any) => ({
      id: project.id,
      title: project.title,
      number: project.number,
      url: project.url,
      closed: project.closed,
      public: project.public,
      shortDescription: project.shortDescription || '',
    }))

    let content = `Found ${projectsData.totalCount} project(s):\n\n`
    projects.forEach((project: any, index: number) => {
      content += `${index + 1}. ${project.title} (#${project.number})\n`
      content += `   ID: ${project.id}\n`
      content += `   URL: ${project.url}\n`
      content += `   Status: ${project.closed ? 'Closed' : 'Open'}\n`
      content += `   Visibility: ${project.public ? 'Public' : 'Private'}\n`
      if (project.shortDescription) {
        content += `   Description: ${project.shortDescription}\n`
      }
      content += '\n'
    })

    return {
      success: true,
      output: {
        content: content.trim(),
        metadata: {
          projects,
          totalCount: projectsData.totalCount,
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Human-readable list of projects' },
    metadata: {
      type: 'object',
      description: 'Projects metadata',
      properties: {
        projects: {
          type: 'array',
          description: 'Array of project objects',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', description: 'Project node ID' },
              title: { type: 'string', description: 'Project title' },
              number: { type: 'number', description: 'Project number' },
              url: { type: 'string', description: 'Project URL' },
              closed: { type: 'boolean', description: 'Whether project is closed' },
              public: { type: 'boolean', description: 'Whether project is public' },
              shortDescription: {
                type: 'string',
                description: 'Project short description',
              },
            },
          },
        },
        totalCount: { type: 'number', description: 'Total number of projects' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_prs.ts]---
Location: sim-main/apps/sim/tools/github/list_prs.ts

```typescript
import type { ListPRsParams, PRListResponse } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const listPRsTool: ToolConfig<ListPRsParams, PRListResponse> = {
  id: 'github_list_prs',
  name: 'GitHub List Pull Requests',
  description: 'List pull requests in a GitHub repository',
  version: '1.0.0',

  params: {
    owner: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Repository owner',
    },
    repo: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Repository name',
    },
    state: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by state: open, closed, or all',
      default: 'open',
    },
    head: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Filter by head user or branch name (format: user:ref-name or organization:ref-name)',
    },
    base: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by base branch name',
    },
    sort: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Sort by: created, updated, popularity, or long-running',
      default: 'created',
    },
    direction: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Sort direction: asc or desc',
      default: 'desc',
    },
    per_page: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Results per page (max 100)',
      default: 30,
    },
    page: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Page number',
      default: 1,
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'GitHub API token',
    },
  },

  request: {
    url: (params) => {
      const url = new URL(`https://api.github.com/repos/${params.owner}/${params.repo}/pulls`)
      if (params.state) url.searchParams.append('state', params.state)
      if (params.head) url.searchParams.append('head', params.head)
      if (params.base) url.searchParams.append('base', params.base)
      if (params.sort) url.searchParams.append('sort', params.sort)
      if (params.direction) url.searchParams.append('direction', params.direction)
      if (params.per_page) url.searchParams.append('per_page', Number(params.per_page).toString())
      if (params.page) url.searchParams.append('page', Number(params.page).toString())
      return url.toString()
    },
    method: 'GET',
    headers: (params) => ({
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${params.apiKey}`,
      'X-GitHub-Api-Version': '2022-11-28',
    }),
  },

  transformResponse: async (response) => {
    const prs = await response.json()

    const openCount = prs.filter((pr: any) => pr.state === 'open').length
    const closedCount = prs.filter((pr: any) => pr.state === 'closed').length

    const content = `Found ${prs.length} pull request(s)
Open: ${openCount}, Closed: ${closedCount}

${prs
  .map(
    (pr: any) =>
      `#${pr.number}: ${pr.title} (${pr.state})
  URL: ${pr.html_url}`
  )
  .join('\n\n')}`

    return {
      success: true,
      output: {
        content,
        metadata: {
          prs: prs.map((pr: any) => ({
            number: pr.number,
            title: pr.title,
            state: pr.state,
            html_url: pr.html_url,
            created_at: pr.created_at,
            updated_at: pr.updated_at,
          })),
          total_count: prs.length,
          open_count: openCount,
          closed_count: closedCount,
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Human-readable list of pull requests' },
    metadata: {
      type: 'object',
      description: 'Pull requests list metadata',
      properties: {
        prs: {
          type: 'array',
          description: 'Array of pull request summaries',
        },
        total_count: { type: 'number', description: 'Total number of PRs returned' },
        open_count: { type: 'number', description: 'Number of open PRs' },
        closed_count: { type: 'number', description: 'Number of closed PRs' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_pr_comments.ts]---
Location: sim-main/apps/sim/tools/github/list_pr_comments.ts

```typescript
import type { CommentsListResponse, ListPRCommentsParams } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const listPRCommentsTool: ToolConfig<ListPRCommentsParams, CommentsListResponse> = {
  id: 'github_list_pr_comments',
  name: 'GitHub PR Review Comments Lister',
  description: 'List all review comments on a GitHub pull request',
  version: '1.0.0',

  params: {
    owner: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Repository owner',
    },
    repo: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Repository name',
    },
    pullNumber: {
      type: 'number',
      required: true,
      visibility: 'user-or-llm',
      description: 'Pull request number',
    },
    sort: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Sort by created or updated',
      default: 'created',
    },
    direction: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Sort direction (asc or desc)',
      default: 'desc',
    },
    since: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Only show comments updated after this ISO 8601 timestamp',
    },
    per_page: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Number of results per page (max 100)',
      default: 30,
    },
    page: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Page number',
      default: 1,
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'GitHub API token',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = `https://api.github.com/repos/${params.owner}/${params.repo}/pulls/${params.pullNumber}/comments`
      const queryParams = new URLSearchParams()

      if (params.sort) queryParams.append('sort', params.sort)
      if (params.direction) queryParams.append('direction', params.direction)
      if (params.since) queryParams.append('since', params.since)
      if (params.per_page) queryParams.append('per_page', Number(params.per_page).toString())
      if (params.page) queryParams.append('page', Number(params.page).toString())

      const query = queryParams.toString()
      return query ? `${baseUrl}?${query}` : baseUrl
    },
    method: 'GET',
    headers: (params) => ({
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${params.apiKey}`,
      'X-GitHub-Api-Version': '2022-11-28',
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    const content = `Found ${data.length} review comment${data.length !== 1 ? 's' : ''} on PR #${response.url.split('/').slice(-2, -1)[0]}${
      data.length > 0
        ? `\n\nRecent review comments:\n${data
            .slice(0, 5)
            .map(
              (c: any) =>
                `- ${c.user.login} on ${c.path}${c.line ? `:${c.line}` : ''} (${new Date(c.created_at).toLocaleDateString()}): "${c.body.substring(0, 80)}${c.body.length > 80 ? '...' : ''}"`
            )
            .join('\n')}`
        : ''
    }`

    return {
      success: true,
      output: {
        content,
        metadata: {
          comments: data.map((comment: any) => ({
            id: comment.id,
            body: comment.body,
            user: { login: comment.user.login },
            created_at: comment.created_at,
            html_url: comment.html_url,
          })),
          total_count: data.length,
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Human-readable review comments summary' },
    metadata: {
      type: 'object',
      description: 'Review comments list metadata',
      properties: {
        comments: {
          type: 'array',
          description: 'Array of review comment objects',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', description: 'Comment ID' },
              body: { type: 'string', description: 'Comment body' },
              user: {
                type: 'object',
                description: 'User who created the comment',
                properties: {
                  login: { type: 'string', description: 'User login' },
                },
              },
              created_at: { type: 'string', description: 'Creation timestamp' },
              html_url: { type: 'string', description: 'GitHub web URL' },
            },
          },
        },
        total_count: { type: 'number', description: 'Total number of review comments' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

````
