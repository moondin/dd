---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 676
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 676 of 933)

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

---[FILE: update_issue.ts]---
Location: sim-main/apps/sim/tools/github/update_issue.ts

```typescript
import type { IssueResponse, UpdateIssueParams } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const updateIssueTool: ToolConfig<UpdateIssueParams, IssueResponse> = {
  id: 'github_update_issue',
  name: 'GitHub Update Issue',
  description: 'Update an existing issue in a GitHub repository',
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
    title: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New issue title',
    },
    body: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New issue description/body',
    },
    state: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Issue state (open or closed)',
    },
    labels: {
      type: 'array',
      required: false,
      visibility: 'user-or-llm',
      description: 'Array of label names (replaces all existing labels)',
    },
    assignees: {
      type: 'array',
      required: false,
      visibility: 'user-or-llm',
      description: 'Array of usernames (replaces all existing assignees)',
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
      `https://api.github.com/repos/${params.owner}/${params.repo}/issues/${params.issue_number}`,
    method: 'PATCH',
    headers: (params) => ({
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${params.apiKey}`,
      'X-GitHub-Api-Version': '2022-11-28',
    }),
    body: (params) => {
      const body: any = {}
      if (params.title !== undefined) body.title = params.title
      if (params.body !== undefined) body.body = params.body
      if (params.state !== undefined) body.state = params.state
      if (params.labels !== undefined) body.labels = params.labels
      if (params.assignees !== undefined) body.assignees = params.assignees
      return body
    },
  },

  transformResponse: async (response) => {
    const issue = await response.json()

    const labels = issue.labels?.map((label: any) => label.name) || []

    const assignees = issue.assignees?.map((assignee: any) => assignee.login) || []

    const content = `Issue #${issue.number} updated: "${issue.title}"
State: ${issue.state}
URL: ${issue.html_url}
${labels.length > 0 ? `Labels: ${labels.join(', ')}` : ''}
${assignees.length > 0 ? `Assignees: ${assignees.join(', ')}` : ''}`

    return {
      success: true,
      output: {
        content,
        metadata: {
          number: issue.number,
          title: issue.title,
          state: issue.state,
          html_url: issue.html_url,
          labels,
          assignees,
          created_at: issue.created_at,
          updated_at: issue.updated_at,
          closed_at: issue.closed_at,
          body: issue.body,
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Human-readable issue update confirmation' },
    metadata: {
      type: 'object',
      description: 'Updated issue metadata',
      properties: {
        number: { type: 'number', description: 'Issue number' },
        title: { type: 'string', description: 'Issue title' },
        state: { type: 'string', description: 'Issue state (open/closed)' },
        html_url: { type: 'string', description: 'GitHub web URL' },
        labels: { type: 'array', description: 'Array of label names' },
        assignees: { type: 'array', description: 'Array of assignee usernames' },
        created_at: { type: 'string', description: 'Creation timestamp' },
        updated_at: { type: 'string', description: 'Last update timestamp' },
        closed_at: { type: 'string', description: 'Closed timestamp' },
        body: { type: 'string', description: 'Issue body/description' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_pr.ts]---
Location: sim-main/apps/sim/tools/github/update_pr.ts

```typescript
import type { PRResponse, UpdatePRParams } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const updatePRTool: ToolConfig<UpdatePRParams, PRResponse> = {
  id: 'github_update_pr',
  name: 'GitHub Update Pull Request',
  description: 'Update an existing pull request in a GitHub repository',
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
    title: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New pull request title',
    },
    body: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New pull request description (Markdown)',
    },
    state: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New state (open or closed)',
    },
    base: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New base branch name',
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
      `https://api.github.com/repos/${params.owner}/${params.repo}/pulls/${params.pullNumber}`,
    method: 'PATCH',
    headers: (params) => ({
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${params.apiKey}`,
      'X-GitHub-Api-Version': '2022-11-28',
    }),
    body: (params) => {
      const body: Record<string, any> = {}
      if (params.title !== undefined) body.title = params.title
      if (params.body !== undefined) body.body = params.body
      if (params.state !== undefined) body.state = params.state
      if (params.base !== undefined) body.base = params.base
      return body
    },
  },

  transformResponse: async (response) => {
    const pr = await response.json()

    const content = `PR #${pr.number} updated: "${pr.title}" (${pr.state})
URL: ${pr.html_url}`

    return {
      success: true,
      output: {
        content,
        metadata: {
          number: pr.number,
          title: pr.title,
          state: pr.state,
          html_url: pr.html_url,
          merged: pr.merged,
          draft: pr.draft,
          created_at: pr.created_at,
          updated_at: pr.updated_at,
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Human-readable PR update confirmation' },
    metadata: {
      type: 'object',
      description: 'Updated pull request metadata',
      properties: {
        number: { type: 'number', description: 'Pull request number' },
        title: { type: 'string', description: 'PR title' },
        state: { type: 'string', description: 'PR state (open/closed)' },
        html_url: { type: 'string', description: 'GitHub web URL' },
        merged: { type: 'boolean', description: 'Whether PR is merged' },
        draft: { type: 'boolean', description: 'Whether PR is draft' },
        created_at: { type: 'string', description: 'Creation timestamp' },
        updated_at: { type: 'string', description: 'Last update timestamp' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_project.ts]---
Location: sim-main/apps/sim/tools/github/update_project.ts

```typescript
import type { ProjectResponse, UpdateProjectParams } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const updateProjectTool: ToolConfig<UpdateProjectParams, ProjectResponse> = {
  id: 'github_update_project',
  name: 'GitHub Update Project',
  description:
    'Update an existing GitHub Project V2. Can update title, description, visibility (public), or status (closed). Requires the project Node ID.',
  version: '1.0.0',

  params: {
    project_id: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Project Node ID (format: PVT_...)',
    },
    title: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New project title',
    },
    shortDescription: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New project short description',
    },
    project_public: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Set project visibility (true = public, false = private)',
    },
    closed: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Set project status (true = closed, false = open)',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'GitHub Personal Access Token with project write permissions',
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
      const inputFields: string[] = ['projectId: $projectId']
      const variables: Record<string, any> = {
        projectId: params.project_id,
      }

      if (params.title !== undefined) {
        inputFields.push('title: $title')
        variables.title = params.title
      }
      if (params.shortDescription !== undefined) {
        inputFields.push('shortDescription: $shortDescription')
        variables.shortDescription = params.shortDescription
      }
      if (params.project_public !== undefined) {
        inputFields.push('public: $project_public')
        variables.project_public = params.project_public
      }
      if (params.closed !== undefined) {
        inputFields.push('closed: $closed')
        variables.closed = params.closed
      }

      const variableDefs = ['$projectId: ID!']
      if (params.title !== undefined) variableDefs.push('$title: String')
      if (params.shortDescription !== undefined) variableDefs.push('$shortDescription: String')
      if (params.project_public !== undefined) variableDefs.push('$project_public: Boolean')
      if (params.closed !== undefined) variableDefs.push('$closed: Boolean')

      const query = `
        mutation(${variableDefs.join(', ')}) {
          updateProjectV2(input: {
            ${inputFields.join('\n            ')}
          }) {
            projectV2 {
              id
              title
              number
              url
              closed
              public
              shortDescription
            }
          }
        }
      `
      return {
        query,
        variables,
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
            id: '',
            title: '',
            url: '',
          },
        },
        error: data.errors[0].message,
      }
    }

    const project = data.data?.updateProjectV2?.projectV2
    if (!project) {
      return {
        success: false,
        output: {
          content: 'Failed to update project',
          metadata: {
            id: '',
            title: '',
            url: '',
          },
        },
        error: 'Failed to update project',
      }
    }

    let content = `Project updated successfully!\n`
    content += `Title: ${project.title}\n`
    content += `ID: ${project.id}\n`
    content += `Number: ${project.number}\n`
    content += `URL: ${project.url}\n`
    content += `Status: ${project.closed ? 'Closed' : 'Open'}\n`
    content += `Visibility: ${project.public ? 'Public' : 'Private'}\n`
    if (project.shortDescription) {
      content += `Description: ${project.shortDescription}`
    }

    return {
      success: true,
      output: {
        content: content.trim(),
        metadata: {
          id: project.id,
          title: project.title,
          number: project.number,
          url: project.url,
          closed: project.closed,
          public: project.public,
          shortDescription: project.shortDescription || '',
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Human-readable confirmation message' },
    metadata: {
      type: 'object',
      description: 'Updated project metadata',
      properties: {
        id: { type: 'string', description: 'Project node ID' },
        title: { type: 'string', description: 'Project title' },
        number: { type: 'number', description: 'Project number', optional: true },
        url: { type: 'string', description: 'Project URL' },
        closed: { type: 'boolean', description: 'Whether project is closed', optional: true },
        public: { type: 'boolean', description: 'Whether project is public', optional: true },
        shortDescription: {
          type: 'string',
          description: 'Project short description',
          optional: true,
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_release.ts]---
Location: sim-main/apps/sim/tools/github/update_release.ts

```typescript
import type { ReleaseResponse, UpdateReleaseParams } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const updateReleaseTool: ToolConfig<UpdateReleaseParams, ReleaseResponse> = {
  id: 'github_update_release',
  name: 'GitHub Update Release',
  description:
    'Update an existing GitHub release. Modify tag name, target commit, title, description, draft status, or prerelease status.',
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
    release_id: {
      type: 'number',
      required: true,
      visibility: 'user-or-llm',
      description: 'The unique identifier of the release',
    },
    tag_name: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'The name of the tag',
    },
    target_commitish: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Specifies the commitish value for where the tag is created from',
    },
    name: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'The name of the release',
    },
    body: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Text describing the contents of the release (markdown supported)',
    },
    draft: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'true to set as draft, false to publish',
    },
    prerelease: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'true to identify as a prerelease, false for a full release',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'GitHub Personal Access Token',
    },
  },

  request: {
    url: (params) =>
      `https://api.github.com/repos/${params.owner}/${params.repo}/releases/${params.release_id}`,
    method: 'PATCH',
    headers: (params) => ({
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${params.apiKey}`,
      'X-GitHub-Api-Version': '2022-11-28',
    }),
    body: (params) => {
      const body: any = {}

      if (params.tag_name) {
        body.tag_name = params.tag_name
      }
      if (params.target_commitish) {
        body.target_commitish = params.target_commitish
      }
      if (params.name !== undefined) {
        body.name = params.name
      }
      if (params.body !== undefined) {
        body.body = params.body
      }
      if (params.draft !== undefined) {
        body.draft = params.draft
      }
      if (params.prerelease !== undefined) {
        body.prerelease = params.prerelease
      }

      return body
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    const releaseType = data.draft ? 'Draft' : data.prerelease ? 'Prerelease' : 'Release'
    const content = `${releaseType} updated: "${data.name || data.tag_name}"
Tag: ${data.tag_name}
URL: ${data.html_url}
Last updated: ${data.updated_at || data.created_at}
${data.published_at ? `Published: ${data.published_at}` : 'Not yet published'}
Download URLs:
- Tarball: ${data.tarball_url}
- Zipball: ${data.zipball_url}`

    return {
      success: true,
      output: {
        content,
        metadata: {
          id: data.id,
          tag_name: data.tag_name,
          name: data.name || data.tag_name,
          html_url: data.html_url,
          tarball_url: data.tarball_url,
          zipball_url: data.zipball_url,
          draft: data.draft,
          prerelease: data.prerelease,
          created_at: data.created_at,
          published_at: data.published_at,
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Human-readable release update summary' },
    metadata: {
      type: 'object',
      description: 'Updated release metadata including download URLs',
      properties: {
        id: { type: 'number', description: 'Release ID' },
        tag_name: { type: 'string', description: 'Git tag name' },
        name: { type: 'string', description: 'Release name' },
        html_url: { type: 'string', description: 'GitHub web URL for the release' },
        tarball_url: { type: 'string', description: 'URL to download release as tarball' },
        zipball_url: { type: 'string', description: 'URL to download release as zipball' },
        draft: { type: 'boolean', description: 'Whether this is a draft release' },
        prerelease: { type: 'boolean', description: 'Whether this is a prerelease' },
        created_at: { type: 'string', description: 'Creation timestamp' },
        published_at: { type: 'string', description: 'Publication timestamp' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: cancel_pipeline.ts]---
Location: sim-main/apps/sim/tools/gitlab/cancel_pipeline.ts

```typescript
import type { GitLabCancelPipelineParams, GitLabCancelPipelineResponse } from '@/tools/gitlab/types'
import type { ToolConfig } from '@/tools/types'

export const gitlabCancelPipelineTool: ToolConfig<
  GitLabCancelPipelineParams,
  GitLabCancelPipelineResponse
> = {
  id: 'gitlab_cancel_pipeline',
  name: 'GitLab Cancel Pipeline',
  description: 'Cancel a running GitLab pipeline',
  version: '1.0.0',

  params: {
    accessToken: {
      type: 'string',
      required: true,
      description: 'GitLab Personal Access Token',
    },
    projectId: {
      type: 'string',
      required: true,
      description: 'Project ID or URL-encoded path',
    },
    pipelineId: {
      type: 'number',
      required: true,
      description: 'Pipeline ID',
    },
  },

  request: {
    url: (params) => {
      const encodedId = encodeURIComponent(String(params.projectId))
      return `https://gitlab.com/api/v4/projects/${encodedId}/pipelines/${params.pipelineId}/cancel`
    },
    method: 'POST',
    headers: (params) => ({
      'PRIVATE-TOKEN': params.accessToken,
    }),
  },

  transformResponse: async (response) => {
    if (!response.ok) {
      const errorText = await response.text()
      return {
        success: false,
        error: `GitLab API error: ${response.status} ${errorText}`,
        output: {},
      }
    }

    const pipeline = await response.json()

    return {
      success: true,
      output: {
        pipeline,
      },
    }
  },

  outputs: {
    pipeline: {
      type: 'object',
      description: 'The cancelled GitLab pipeline',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_issue.ts]---
Location: sim-main/apps/sim/tools/gitlab/create_issue.ts

```typescript
import type { GitLabCreateIssueParams, GitLabCreateIssueResponse } from '@/tools/gitlab/types'
import type { ToolConfig } from '@/tools/types'

export const gitlabCreateIssueTool: ToolConfig<GitLabCreateIssueParams, GitLabCreateIssueResponse> =
  {
    id: 'gitlab_create_issue',
    name: 'GitLab Create Issue',
    description: 'Create a new issue in a GitLab project',
    version: '1.0.0',

    params: {
      accessToken: {
        type: 'string',
        required: true,
        description: 'GitLab Personal Access Token',
      },
      projectId: {
        type: 'string',
        required: true,
        description: 'Project ID or URL-encoded path',
      },
      title: {
        type: 'string',
        required: true,
        description: 'Issue title',
      },
      description: {
        type: 'string',
        required: false,
        description: 'Issue description (Markdown supported)',
      },
      labels: {
        type: 'string',
        required: false,
        description: 'Comma-separated list of label names',
      },
      assigneeIds: {
        type: 'array',
        required: false,
        description: 'Array of user IDs to assign',
      },
      milestoneId: {
        type: 'number',
        required: false,
        description: 'Milestone ID to assign',
      },
      dueDate: {
        type: 'string',
        required: false,
        description: 'Due date in YYYY-MM-DD format',
      },
      confidential: {
        type: 'boolean',
        required: false,
        description: 'Whether the issue is confidential',
      },
    },

    request: {
      url: (params) => {
        const encodedId = encodeURIComponent(String(params.projectId))
        return `https://gitlab.com/api/v4/projects/${encodedId}/issues`
      },
      method: 'POST',
      headers: (params) => ({
        'Content-Type': 'application/json',
        'PRIVATE-TOKEN': params.accessToken,
      }),
      body: (params) => {
        const body: Record<string, any> = {
          title: params.title,
        }

        if (params.description) body.description = params.description
        if (params.labels) body.labels = params.labels
        if (params.assigneeIds) body.assignee_ids = params.assigneeIds
        if (params.milestoneId) body.milestone_id = params.milestoneId
        if (params.dueDate) body.due_date = params.dueDate
        if (params.confidential !== undefined) body.confidential = params.confidential

        return body
      },
    },

    transformResponse: async (response) => {
      if (!response.ok) {
        const errorText = await response.text()
        return {
          success: false,
          error: `GitLab API error: ${response.status} ${errorText}`,
          output: {},
        }
      }

      const issue = await response.json()

      return {
        success: true,
        output: {
          issue,
        },
      }
    },

    outputs: {
      issue: {
        type: 'object',
        description: 'The created GitLab issue',
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: create_issue_note.ts]---
Location: sim-main/apps/sim/tools/gitlab/create_issue_note.ts

```typescript
import type { GitLabCreateIssueNoteParams, GitLabCreateNoteResponse } from '@/tools/gitlab/types'
import type { ToolConfig } from '@/tools/types'

export const gitlabCreateIssueNoteTool: ToolConfig<
  GitLabCreateIssueNoteParams,
  GitLabCreateNoteResponse
> = {
  id: 'gitlab_create_issue_note',
  name: 'GitLab Create Issue Comment',
  description: 'Add a comment to a GitLab issue',
  version: '1.0.0',

  params: {
    accessToken: {
      type: 'string',
      required: true,
      description: 'GitLab Personal Access Token',
    },
    projectId: {
      type: 'string',
      required: true,
      description: 'Project ID or URL-encoded path',
    },
    issueIid: {
      type: 'number',
      required: true,
      description: 'Issue internal ID (IID)',
    },
    body: {
      type: 'string',
      required: true,
      description: 'Comment body (Markdown supported)',
    },
  },

  request: {
    url: (params) => {
      const encodedId = encodeURIComponent(String(params.projectId))
      return `https://gitlab.com/api/v4/projects/${encodedId}/issues/${params.issueIid}/notes`
    },
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      'PRIVATE-TOKEN': params.accessToken,
    }),
    body: (params) => ({
      body: params.body,
    }),
  },

  transformResponse: async (response) => {
    if (!response.ok) {
      const errorText = await response.text()
      return {
        success: false,
        error: `GitLab API error: ${response.status} ${errorText}`,
        output: {},
      }
    }

    const note = await response.json()

    return {
      success: true,
      output: {
        note,
      },
    }
  },

  outputs: {
    note: {
      type: 'object',
      description: 'The created comment',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_merge_request.ts]---
Location: sim-main/apps/sim/tools/gitlab/create_merge_request.ts

```typescript
import type {
  GitLabCreateMergeRequestParams,
  GitLabCreateMergeRequestResponse,
} from '@/tools/gitlab/types'
import type { ToolConfig } from '@/tools/types'

export const gitlabCreateMergeRequestTool: ToolConfig<
  GitLabCreateMergeRequestParams,
  GitLabCreateMergeRequestResponse
> = {
  id: 'gitlab_create_merge_request',
  name: 'GitLab Create Merge Request',
  description: 'Create a new merge request in a GitLab project',
  version: '1.0.0',

  params: {
    accessToken: {
      type: 'string',
      required: true,
      description: 'GitLab Personal Access Token',
    },
    projectId: {
      type: 'string',
      required: true,
      description: 'Project ID or URL-encoded path',
    },
    sourceBranch: {
      type: 'string',
      required: true,
      description: 'Source branch name',
    },
    targetBranch: {
      type: 'string',
      required: true,
      description: 'Target branch name',
    },
    title: {
      type: 'string',
      required: true,
      description: 'Merge request title',
    },
    description: {
      type: 'string',
      required: false,
      description: 'Merge request description (Markdown supported)',
    },
    labels: {
      type: 'string',
      required: false,
      description: 'Comma-separated list of label names',
    },
    assigneeIds: {
      type: 'array',
      required: false,
      description: 'Array of user IDs to assign',
    },
    milestoneId: {
      type: 'number',
      required: false,
      description: 'Milestone ID to assign',
    },
    removeSourceBranch: {
      type: 'boolean',
      required: false,
      description: 'Delete source branch after merge',
    },
    squash: {
      type: 'boolean',
      required: false,
      description: 'Squash commits on merge',
    },
    draft: {
      type: 'boolean',
      required: false,
      description: 'Mark as draft (work in progress)',
    },
  },

  request: {
    url: (params) => {
      const encodedId = encodeURIComponent(String(params.projectId))
      return `https://gitlab.com/api/v4/projects/${encodedId}/merge_requests`
    },
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      'PRIVATE-TOKEN': params.accessToken,
    }),
    body: (params) => {
      const body: Record<string, any> = {
        source_branch: params.sourceBranch,
        target_branch: params.targetBranch,
        title: params.title,
      }

      if (params.description) body.description = params.description
      if (params.labels) body.labels = params.labels
      if (params.assigneeIds && params.assigneeIds.length > 0)
        body.assignee_ids = params.assigneeIds
      if (params.milestoneId) body.milestone_id = params.milestoneId
      if (params.removeSourceBranch !== undefined)
        body.remove_source_branch = params.removeSourceBranch
      if (params.squash !== undefined) body.squash = params.squash
      if (params.draft !== undefined) body.draft = params.draft

      return body
    },
  },

  transformResponse: async (response) => {
    if (!response.ok) {
      const errorText = await response.text()
      return {
        success: false,
        error: `GitLab API error: ${response.status} ${errorText}`,
        output: {},
      }
    }

    const mergeRequest = await response.json()

    return {
      success: true,
      output: {
        mergeRequest,
      },
    }
  },

  outputs: {
    mergeRequest: {
      type: 'object',
      description: 'The created GitLab merge request',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_merge_request_note.ts]---
Location: sim-main/apps/sim/tools/gitlab/create_merge_request_note.ts

```typescript
import type {
  GitLabCreateMergeRequestNoteParams,
  GitLabCreateNoteResponse,
} from '@/tools/gitlab/types'
import type { ToolConfig } from '@/tools/types'

export const gitlabCreateMergeRequestNoteTool: ToolConfig<
  GitLabCreateMergeRequestNoteParams,
  GitLabCreateNoteResponse
> = {
  id: 'gitlab_create_merge_request_note',
  name: 'GitLab Create Merge Request Comment',
  description: 'Add a comment to a GitLab merge request',
  version: '1.0.0',

  params: {
    accessToken: {
      type: 'string',
      required: true,
      description: 'GitLab Personal Access Token',
    },
    projectId: {
      type: 'string',
      required: true,
      description: 'Project ID or URL-encoded path',
    },
    mergeRequestIid: {
      type: 'number',
      required: true,
      description: 'Merge request internal ID (IID)',
    },
    body: {
      type: 'string',
      required: true,
      description: 'Comment body (Markdown supported)',
    },
  },

  request: {
    url: (params) => {
      const encodedId = encodeURIComponent(String(params.projectId))
      return `https://gitlab.com/api/v4/projects/${encodedId}/merge_requests/${params.mergeRequestIid}/notes`
    },
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      'PRIVATE-TOKEN': params.accessToken,
    }),
    body: (params) => ({
      body: params.body,
    }),
  },

  transformResponse: async (response) => {
    if (!response.ok) {
      const errorText = await response.text()
      return {
        success: false,
        error: `GitLab API error: ${response.status} ${errorText}`,
        output: {},
      }
    }

    const note = await response.json()

    return {
      success: true,
      output: {
        note,
      },
    }
  },

  outputs: {
    note: {
      type: 'object',
      description: 'The created comment',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_pipeline.ts]---
Location: sim-main/apps/sim/tools/gitlab/create_pipeline.ts

```typescript
import type { GitLabCreatePipelineParams, GitLabCreatePipelineResponse } from '@/tools/gitlab/types'
import type { ToolConfig } from '@/tools/types'

export const gitlabCreatePipelineTool: ToolConfig<
  GitLabCreatePipelineParams,
  GitLabCreatePipelineResponse
> = {
  id: 'gitlab_create_pipeline',
  name: 'GitLab Create Pipeline',
  description: 'Trigger a new pipeline in a GitLab project',
  version: '1.0.0',

  params: {
    accessToken: {
      type: 'string',
      required: true,
      description: 'GitLab Personal Access Token',
    },
    projectId: {
      type: 'string',
      required: true,
      description: 'Project ID or URL-encoded path',
    },
    ref: {
      type: 'string',
      required: true,
      description: 'Branch or tag to run the pipeline on',
    },
    variables: {
      type: 'array',
      required: false,
      description:
        'Array of variables for the pipeline (each with key, value, and optional variable_type)',
    },
  },

  request: {
    url: (params) => {
      const encodedId = encodeURIComponent(String(params.projectId))
      return `https://gitlab.com/api/v4/projects/${encodedId}/pipeline`
    },
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      'PRIVATE-TOKEN': params.accessToken,
    }),
    body: (params) => {
      const body: Record<string, any> = {
        ref: params.ref,
      }

      if (params.variables && params.variables.length > 0) {
        body.variables = params.variables
      }

      return body
    },
  },

  transformResponse: async (response) => {
    if (!response.ok) {
      const errorText = await response.text()
      return {
        success: false,
        error: `GitLab API error: ${response.status} ${errorText}`,
        output: {},
      }
    }

    const pipeline = await response.json()

    return {
      success: true,
      output: {
        pipeline,
      },
    }
  },

  outputs: {
    pipeline: {
      type: 'object',
      description: 'The created GitLab pipeline',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_issue.ts]---
Location: sim-main/apps/sim/tools/gitlab/delete_issue.ts

```typescript
import type { GitLabDeleteIssueParams, GitLabDeleteIssueResponse } from '@/tools/gitlab/types'
import type { ToolConfig } from '@/tools/types'

export const gitlabDeleteIssueTool: ToolConfig<GitLabDeleteIssueParams, GitLabDeleteIssueResponse> =
  {
    id: 'gitlab_delete_issue',
    name: 'GitLab Delete Issue',
    description: 'Delete an issue from a GitLab project',
    version: '1.0.0',

    params: {
      accessToken: {
        type: 'string',
        required: true,
        description: 'GitLab Personal Access Token',
      },
      projectId: {
        type: 'string',
        required: true,
        description: 'Project ID or URL-encoded path',
      },
      issueIid: {
        type: 'number',
        required: true,
        description: 'Issue internal ID (IID)',
      },
    },

    request: {
      url: (params) => {
        const encodedId = encodeURIComponent(String(params.projectId))
        return `https://gitlab.com/api/v4/projects/${encodedId}/issues/${params.issueIid}`
      },
      method: 'DELETE',
      headers: (params) => ({
        'PRIVATE-TOKEN': params.accessToken,
      }),
    },

    transformResponse: async (response) => {
      if (!response.ok) {
        const errorText = await response.text()
        return {
          success: false,
          error: `GitLab API error: ${response.status} ${errorText}`,
          output: {},
        }
      }

      return {
        success: true,
        output: {
          success: true,
        },
      }
    },

    outputs: {
      success: {
        type: 'boolean',
        description: 'Whether the issue was deleted successfully',
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: get_issue.ts]---
Location: sim-main/apps/sim/tools/gitlab/get_issue.ts

```typescript
import type { GitLabGetIssueParams, GitLabGetIssueResponse } from '@/tools/gitlab/types'
import type { ToolConfig } from '@/tools/types'

export const gitlabGetIssueTool: ToolConfig<GitLabGetIssueParams, GitLabGetIssueResponse> = {
  id: 'gitlab_get_issue',
  name: 'GitLab Get Issue',
  description: 'Get details of a specific GitLab issue',
  version: '1.0.0',

  params: {
    accessToken: {
      type: 'string',
      required: true,
      description: 'GitLab Personal Access Token',
    },
    projectId: {
      type: 'string',
      required: true,
      description: 'Project ID or URL-encoded path',
    },
    issueIid: {
      type: 'number',
      required: true,
      description: 'Issue number within the project (the # shown in GitLab UI)',
    },
  },

  request: {
    url: (params) => {
      const encodedId = encodeURIComponent(String(params.projectId))
      return `https://gitlab.com/api/v4/projects/${encodedId}/issues/${params.issueIid}`
    },
    method: 'GET',
    headers: (params) => ({
      'PRIVATE-TOKEN': params.accessToken,
    }),
  },

  transformResponse: async (response) => {
    if (!response.ok) {
      const errorText = await response.text()
      return {
        success: false,
        error: `GitLab API error: ${response.status} ${errorText}`,
        output: {},
      }
    }

    const issue = await response.json()

    return {
      success: true,
      output: {
        issue,
      },
    }
  },

  outputs: {
    issue: {
      type: 'object',
      description: 'The GitLab issue details',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_merge_request.ts]---
Location: sim-main/apps/sim/tools/gitlab/get_merge_request.ts

```typescript
import type {
  GitLabGetMergeRequestParams,
  GitLabGetMergeRequestResponse,
} from '@/tools/gitlab/types'
import type { ToolConfig } from '@/tools/types'

export const gitlabGetMergeRequestTool: ToolConfig<
  GitLabGetMergeRequestParams,
  GitLabGetMergeRequestResponse
> = {
  id: 'gitlab_get_merge_request',
  name: 'GitLab Get Merge Request',
  description: 'Get details of a specific GitLab merge request',
  version: '1.0.0',

  params: {
    accessToken: {
      type: 'string',
      required: true,
      description: 'GitLab Personal Access Token',
    },
    projectId: {
      type: 'string',
      required: true,
      description: 'Project ID or URL-encoded path',
    },
    mergeRequestIid: {
      type: 'number',
      required: true,
      description: 'Merge request internal ID (IID)',
    },
  },

  request: {
    url: (params) => {
      const encodedId = encodeURIComponent(String(params.projectId))
      return `https://gitlab.com/api/v4/projects/${encodedId}/merge_requests/${params.mergeRequestIid}`
    },
    method: 'GET',
    headers: (params) => ({
      'PRIVATE-TOKEN': params.accessToken,
    }),
  },

  transformResponse: async (response) => {
    if (!response.ok) {
      const errorText = await response.text()
      return {
        success: false,
        error: `GitLab API error: ${response.status} ${errorText}`,
        output: {},
      }
    }

    const mergeRequest = await response.json()

    return {
      success: true,
      output: {
        mergeRequest,
      },
    }
  },

  outputs: {
    mergeRequest: {
      type: 'object',
      description: 'The GitLab merge request details',
    },
  },
}
```

--------------------------------------------------------------------------------

````
