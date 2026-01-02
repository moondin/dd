---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 674
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 674 of 933)

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

---[FILE: list_releases.ts]---
Location: sim-main/apps/sim/tools/github/list_releases.ts

```typescript
import type { ListReleasesParams, ListReleasesResponse } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const listReleasesTool: ToolConfig<ListReleasesParams, ListReleasesResponse> = {
  id: 'github_list_releases',
  name: 'GitHub List Releases',
  description:
    'List all releases for a GitHub repository. Returns release information including tags, names, and download URLs.',
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
      description: 'Page number of the results to fetch',
      default: 1,
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
      const url = new URL(`https://api.github.com/repos/${params.owner}/${params.repo}/releases`)
      if (params.per_page) {
        url.searchParams.append('per_page', Number(params.per_page).toString())
      }
      if (params.page) {
        url.searchParams.append('page', Number(params.page).toString())
      }
      return url.toString()
    },
    method: 'GET',
    headers: (params) => ({
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${params.apiKey}`,
      'X-GitHub-Api-Version': '2022-11-28',
    }),
  },

  transformResponse: async (response) => {
    const releases = await response.json()

    const totalReleases = releases.length
    const releasesList = releases
      .map(
        (release: any, index: number) =>
          `${index + 1}. ${release.name || release.tag_name} (${release.tag_name})
   ${release.draft ? '[DRAFT] ' : ''}${release.prerelease ? '[PRERELEASE] ' : ''}
   Published: ${release.published_at || 'Not published'}
   URL: ${release.html_url}`
      )
      .join('\n\n')

    const content = `Total releases: ${totalReleases}

${releasesList}

Summary of tags: ${releases.map((r: any) => r.tag_name).join(', ')}`

    return {
      success: true,
      output: {
        content,
        metadata: {
          total_count: totalReleases,
          releases: releases.map((release: any) => ({
            id: release.id,
            tag_name: release.tag_name,
            name: release.name || release.tag_name,
            html_url: release.html_url,
            tarball_url: release.tarball_url,
            zipball_url: release.zipball_url,
            draft: release.draft,
            prerelease: release.prerelease,
            created_at: release.created_at,
            published_at: release.published_at,
          })),
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Human-readable list of releases with summary' },
    metadata: {
      type: 'object',
      description: 'Releases metadata',
      properties: {
        total_count: { type: 'number', description: 'Total number of releases returned' },
        releases: {
          type: 'array',
          description: 'Array of release objects',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', description: 'Release ID' },
              tag_name: { type: 'string', description: 'Git tag name' },
              name: { type: 'string', description: 'Release name' },
              html_url: { type: 'string', description: 'GitHub web URL' },
              tarball_url: { type: 'string', description: 'Tarball download URL' },
              zipball_url: { type: 'string', description: 'Zipball download URL' },
              draft: { type: 'boolean', description: 'Is draft release' },
              prerelease: { type: 'boolean', description: 'Is prerelease' },
              created_at: { type: 'string', description: 'Creation timestamp' },
              published_at: { type: 'string', description: 'Publication timestamp' },
            },
          },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_workflows.ts]---
Location: sim-main/apps/sim/tools/github/list_workflows.ts

```typescript
import type { ListWorkflowsParams, ListWorkflowsResponse } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const listWorkflowsTool: ToolConfig<ListWorkflowsParams, ListWorkflowsResponse> = {
  id: 'github_list_workflows',
  name: 'GitHub List Workflows',
  description:
    'List all workflows in a GitHub repository. Returns workflow details including ID, name, path, state, and badge URL.',
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
    per_page: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Number of results per page (default: 30, max: 100)',
      default: 30,
    },
    page: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Page number of results to fetch (default: 1)',
      default: 1,
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
      const url = new URL(
        `https://api.github.com/repos/${params.owner}/${params.repo}/actions/workflows`
      )
      if (params.per_page) {
        url.searchParams.append('per_page', Number(params.per_page).toString())
      }
      if (params.page) {
        url.searchParams.append('page', Number(params.page).toString())
      }
      return url.toString()
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

    const stateCounts = data.workflows.reduce((acc: Record<string, number>, workflow: any) => {
      acc[workflow.state] = (acc[workflow.state] || 0) + 1
      return acc
    }, {})

    const statesSummary = Object.entries(stateCounts)
      .map(([state, count]) => `${count} ${state}`)
      .join(', ')

    const content = `Found ${data.total_count} workflow(s) in ${data.workflows[0]?.path.split('/')[0] || '.github/workflows'}
States: ${statesSummary}

Workflows:
${data.workflows
  .map(
    (w: any) =>
      `- ${w.name} (${w.state})
  Path: ${w.path}
  ID: ${w.id}
  Badge: ${w.badge_url}`
  )
  .join('\n')}`

    return {
      success: true,
      output: {
        content,
        metadata: {
          total_count: data.total_count,
          workflows: data.workflows.map((workflow: any) => ({
            id: workflow.id,
            name: workflow.name,
            path: workflow.path,
            state: workflow.state,
            badge_url: workflow.badge_url,
          })),
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Human-readable workflows summary' },
    metadata: {
      type: 'object',
      description: 'Workflows metadata',
      properties: {
        total_count: { type: 'number', description: 'Total number of workflows' },
        workflows: {
          type: 'array',
          description: 'Array of workflow objects',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', description: 'Workflow ID' },
              name: { type: 'string', description: 'Workflow name' },
              path: { type: 'string', description: 'Path to workflow file' },
              state: { type: 'string', description: 'Workflow state (active/disabled)' },
              badge_url: { type: 'string', description: 'Badge URL for workflow' },
            },
          },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_workflow_runs.ts]---
Location: sim-main/apps/sim/tools/github/list_workflow_runs.ts

```typescript
import type { ListWorkflowRunsParams, ListWorkflowRunsResponse } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const listWorkflowRunsTool: ToolConfig<ListWorkflowRunsParams, ListWorkflowRunsResponse> = {
  id: 'github_list_workflow_runs',
  name: 'GitHub List Workflow Runs',
  description:
    'List workflow runs for a repository. Supports filtering by actor, branch, event, and status. Returns run details including status, conclusion, and links.',
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
    actor: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by user who triggered the workflow',
    },
    branch: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by branch name',
    },
    event: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by event type (e.g., push, pull_request, workflow_dispatch)',
    },
    status: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by status (queued, in_progress, completed, waiting, requested, pending)',
    },
    per_page: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Number of results per page (default: 30, max: 100)',
      default: 30,
    },
    page: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Page number of results to fetch (default: 1)',
      default: 1,
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
      const url = new URL(
        `https://api.github.com/repos/${params.owner}/${params.repo}/actions/runs`
      )
      if (params.actor) {
        url.searchParams.append('actor', params.actor)
      }
      if (params.branch) {
        url.searchParams.append('branch', params.branch)
      }
      if (params.event) {
        url.searchParams.append('event', params.event)
      }
      if (params.status) {
        url.searchParams.append('status', params.status)
      }
      if (params.per_page) {
        url.searchParams.append('per_page', Number(params.per_page).toString())
      }
      if (params.page) {
        url.searchParams.append('page', Number(params.page).toString())
      }
      return url.toString()
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

    const statusCounts = data.workflow_runs.reduce((acc: Record<string, number>, run: any) => {
      acc[run.status] = (acc[run.status] || 0) + 1
      return acc
    }, {})

    const conclusionCounts = data.workflow_runs.reduce((acc: Record<string, number>, run: any) => {
      if (run.conclusion) {
        acc[run.conclusion] = (acc[run.conclusion] || 0) + 1
      }
      return acc
    }, {})

    const statusSummary = Object.entries(statusCounts)
      .map(([status, count]) => `${count} ${status}`)
      .join(', ')

    const conclusionSummary = Object.entries(conclusionCounts)
      .map(([conclusion, count]) => `${count} ${conclusion}`)
      .join(', ')

    const content = `Found ${data.total_count} workflow run(s)
Status: ${statusSummary}
${conclusionSummary ? `Conclusion: ${conclusionSummary}` : ''}

Recent runs:
${data.workflow_runs
  .slice(0, 10)
  .map(
    (run: any) =>
      `- Run #${run.run_number}: ${run.name} (${run.status}${run.conclusion ? ` - ${run.conclusion}` : ''})
  Branch: ${run.head_branch}
  Triggered by: ${run.triggering_actor?.login || 'Unknown'}
  URL: ${run.html_url}`
  )
  .join('\n')}`

    return {
      success: true,
      output: {
        content,
        metadata: {
          total_count: data.total_count,
          workflow_runs: data.workflow_runs.map((run: any) => ({
            id: run.id,
            name: run.name,
            status: run.status,
            conclusion: run.conclusion,
            html_url: run.html_url,
            run_number: run.run_number,
          })),
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Human-readable workflow runs summary' },
    metadata: {
      type: 'object',
      description: 'Workflow runs metadata',
      properties: {
        total_count: { type: 'number', description: 'Total number of workflow runs' },
        workflow_runs: {
          type: 'array',
          description: 'Array of workflow run objects',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', description: 'Workflow run ID' },
              name: { type: 'string', description: 'Workflow name' },
              status: { type: 'string', description: 'Run status' },
              conclusion: { type: 'string', description: 'Run conclusion' },
              html_url: { type: 'string', description: 'GitHub web URL' },
              run_number: { type: 'number', description: 'Run number' },
            },
          },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: merge_pr.ts]---
Location: sim-main/apps/sim/tools/github/merge_pr.ts

```typescript
import type { MergePRParams, MergeResultResponse } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const mergePRTool: ToolConfig<MergePRParams, MergeResultResponse> = {
  id: 'github_merge_pr',
  name: 'GitHub Merge Pull Request',
  description: 'Merge a pull request in a GitHub repository',
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
    commit_title: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Title for the merge commit',
    },
    commit_message: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Extra detail to append to merge commit message',
    },
    merge_method: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Merge method: merge, squash, or rebase',
      default: 'merge',
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
      `https://api.github.com/repos/${params.owner}/${params.repo}/pulls/${params.pullNumber}/merge`,
    method: 'PUT',
    headers: (params) => ({
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${params.apiKey}`,
      'X-GitHub-Api-Version': '2022-11-28',
    }),
    body: (params) => {
      const body: Record<string, any> = {}
      if (params.commit_title !== undefined) body.commit_title = params.commit_title
      if (params.commit_message !== undefined) body.commit_message = params.commit_message
      if (params.merge_method !== undefined) body.merge_method = params.merge_method
      return body
    },
  },

  transformResponse: async (response) => {
    if (response.status === 405) {
      const error = await response.json()
      return {
        success: false,
        error: error.message || 'Pull request is not mergeable',
        output: {
          content: '',
          metadata: {
            sha: '',
            merged: false,
            message: error.message || 'Pull request is not mergeable',
          },
        },
      }
    }

    const result = await response.json()

    const content = `PR merged successfully!
SHA: ${result.sha}
Message: ${result.message}`

    return {
      success: true,
      output: {
        content,
        metadata: {
          sha: result.sha,
          merged: result.merged,
          message: result.message,
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Human-readable merge confirmation' },
    metadata: {
      type: 'object',
      description: 'Merge result metadata',
      properties: {
        sha: { type: 'string', description: 'Merge commit SHA' },
        merged: { type: 'boolean', description: 'Whether merge was successful' },
        message: { type: 'string', description: 'Response message' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: pr.ts]---
Location: sim-main/apps/sim/tools/github/pr.ts

```typescript
import type { PROperationParams, PullRequestResponse } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const prTool: ToolConfig<PROperationParams, PullRequestResponse> = {
  id: 'github_pr',
  name: 'GitHub PR Reader',
  description: 'Fetch PR details including diff and files changed',
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
    method: 'GET',
    headers: (params) => ({
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
  },

  transformResponse: async (response) => {
    const pr = await response.json()

    const diffResponse = await fetch(pr.diff_url)
    const _diff = await diffResponse.text()

    const filesResponse = await fetch(
      `https://api.github.com/repos/${pr.base.repo.owner.login}/${pr.base.repo.name}/pulls/${pr.number}/files`
    )
    const files = await filesResponse.json()

    const content = `PR #${pr.number}: "${pr.title}" (${pr.state}) - Created: ${pr.created_at}, Updated: ${pr.updated_at}
Description: ${pr.body || 'No description'}
Files changed: ${files.length}
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
          diff_url: pr.diff_url,
          created_at: pr.created_at,
          updated_at: pr.updated_at,
          files: files.map((file: any) => ({
            filename: file.filename,
            additions: file.additions,
            deletions: file.deletions,
            changes: file.changes,
            patch: file.patch,
            blob_url: file.blob_url,
            raw_url: file.raw_url,
            status: file.status,
          })),
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Human-readable PR summary' },
    metadata: {
      type: 'object',
      description: 'Detailed PR metadata including file changes',
      properties: {
        number: { type: 'number', description: 'Pull request number' },
        title: { type: 'string', description: 'PR title' },
        state: { type: 'string', description: 'PR state (open/closed/merged)' },
        html_url: { type: 'string', description: 'GitHub web URL' },
        diff_url: { type: 'string', description: 'Raw diff URL' },
        created_at: { type: 'string', description: 'Creation timestamp' },
        updated_at: { type: 'string', description: 'Last update timestamp' },
        files: {
          type: 'array',
          description: 'Files changed in the PR',
          items: {
            type: 'object',
            properties: {
              filename: { type: 'string', description: 'File path' },
              additions: { type: 'number', description: 'Lines added' },
              deletions: { type: 'number', description: 'Lines deleted' },
              changes: { type: 'number', description: 'Total changes' },
              patch: { type: 'string', description: 'File diff patch' },
              blob_url: { type: 'string', description: 'GitHub blob URL' },
              raw_url: { type: 'string', description: 'Raw file URL' },
              status: { type: 'string', description: 'Change type (added/modified/deleted)' },
            },
          },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: remove_label.ts]---
Location: sim-main/apps/sim/tools/github/remove_label.ts

```typescript
import type { LabelsResponse, RemoveLabelParams } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const removeLabelTool: ToolConfig<RemoveLabelParams, LabelsResponse> = {
  id: 'github_remove_label',
  name: 'GitHub Remove Label',
  description: 'Remove a label from an issue in a GitHub repository',
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
    name: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Label name to remove',
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
      `https://api.github.com/repos/${params.owner}/${params.repo}/issues/${params.issue_number}/labels/${encodeURIComponent(params.name)}`,
    method: 'DELETE',
    headers: (params) => ({
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${params.apiKey}`,
      'X-GitHub-Api-Version': '2022-11-28',
    }),
  },

  transformResponse: async (response, params) => {
    if (!params) {
      return {
        success: false,
        error: 'Missing parameters',
        output: {
          content: '',
          metadata: {
            labels: [],
            issue_number: 0,
            html_url: '',
          },
        },
      }
    }

    const labelsData = await response.json()

    const labels = labelsData.map((label: any) => label.name)

    const content = `Label "${params.name}" removed from issue #${params.issue_number}
${labels.length > 0 ? `Remaining labels: ${labels.join(', ')}` : 'No labels remaining on this issue'}`

    return {
      success: true,
      output: {
        content,
        metadata: {
          labels,
          issue_number: params.issue_number,
          html_url: `https://github.com/${params.owner}/${params.repo}/issues/${params.issue_number}`,
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Human-readable label removal confirmation' },
    metadata: {
      type: 'object',
      description: 'Remaining labels metadata',
      properties: {
        labels: { type: 'array', description: 'Labels remaining on the issue after removal' },
        issue_number: { type: 'number', description: 'Issue number' },
        html_url: { type: 'string', description: 'GitHub issue URL' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: repo_info.ts]---
Location: sim-main/apps/sim/tools/github/repo_info.ts

```typescript
import type { BaseGitHubParams, RepoInfoResponse } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const repoInfoTool: ToolConfig<BaseGitHubParams, RepoInfoResponse> = {
  id: 'github_repo_info',
  name: 'GitHub Repository Info',
  description:
    'Retrieve comprehensive GitHub repository metadata including stars, forks, issues, and primary language. Supports both public and private repositories with optional authentication.',
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
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'GitHub Personal Access Token',
    },
  },

  request: {
    url: (params) => `https://api.github.com/repos/${params.owner}/${params.repo}`,
    method: 'GET',
    headers: (params) => ({
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${params.apiKey}`,
      'X-GitHub-Api-Version': '2022-11-28',
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    const content = `Repository: ${data.name}
Description: ${data.description || 'No description'}
Language: ${data.language || 'Not specified'}
Stars: ${data.stargazers_count}
Forks: ${data.forks_count}
Open Issues: ${data.open_issues_count}
URL: ${data.html_url}`

    return {
      success: true,
      output: {
        content,
        metadata: {
          name: data.name,
          description: data.description || '',
          stars: data.stargazers_count,
          forks: data.forks_count,
          openIssues: data.open_issues_count,
          language: data.language || 'Not specified',
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Human-readable repository summary' },
    metadata: {
      type: 'object',
      description: 'Repository metadata',
      properties: {
        name: { type: 'string', description: 'Repository name' },
        description: { type: 'string', description: 'Repository description' },
        stars: { type: 'number', description: 'Number of stars' },
        forks: { type: 'number', description: 'Number of forks' },
        openIssues: { type: 'number', description: 'Number of open issues' },
        language: { type: 'string', description: 'Primary programming language' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: request_reviewers.ts]---
Location: sim-main/apps/sim/tools/github/request_reviewers.ts

```typescript
import type { RequestReviewersParams, ReviewersResponse } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const requestReviewersTool: ToolConfig<RequestReviewersParams, ReviewersResponse> = {
  id: 'github_request_reviewers',
  name: 'GitHub Request Reviewers',
  description: 'Request reviewers for a pull request',
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
    reviewers: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Comma-separated list of user logins to request reviews from',
    },
    team_reviewers: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Comma-separated list of team slugs to request reviews from',
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
      `https://api.github.com/repos/${params.owner}/${params.repo}/pulls/${params.pullNumber}/requested_reviewers`,
    method: 'POST',
    headers: (params) => ({
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${params.apiKey}`,
      'X-GitHub-Api-Version': '2022-11-28',
    }),
    body: (params) => {
      const reviewersArray = params.reviewers
        .split(',')
        .map((r) => r.trim())
        .filter((r) => r)
      const body: Record<string, any> = {
        reviewers: reviewersArray,
      }
      if (params.team_reviewers) {
        const teamReviewersArray = params.team_reviewers
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t)
        if (teamReviewersArray.length > 0) {
          body.team_reviewers = teamReviewersArray
        }
      }
      return body
    },
  },

  transformResponse: async (response) => {
    const pr = await response.json()

    const reviewers = pr.requested_reviewers || []
    const teams = pr.requested_teams || []

    const reviewersList = reviewers.map((r: any) => r.login).join(', ')
    const teamsList = teams.map((t: any) => t.name).join(', ')

    let content = `Review requested for PR #${pr.number}
Reviewers: ${reviewersList || 'None'}`

    if (teamsList) {
      content += `
Team Reviewers: ${teamsList}`
    }

    return {
      success: true,
      output: {
        content,
        metadata: {
          requested_reviewers: reviewers.map((r: any) => ({
            login: r.login,
            id: r.id,
          })),
          requested_teams: teams.length
            ? teams.map((t: any) => ({
                name: t.name,
                id: t.id,
              }))
            : undefined,
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Human-readable reviewer request confirmation' },
    metadata: {
      type: 'object',
      description: 'Requested reviewers metadata',
      properties: {
        requested_reviewers: {
          type: 'array',
          description: 'Array of requested reviewer users',
          items: {
            type: 'object',
            properties: {
              login: { type: 'string', description: 'User login' },
              id: { type: 'number', description: 'User ID' },
            },
          },
        },
        requested_teams: {
          type: 'array',
          description: 'Array of requested reviewer teams',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Team name' },
              id: { type: 'number', description: 'Team ID' },
            },
          },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: rerun_workflow.ts]---
Location: sim-main/apps/sim/tools/github/rerun_workflow.ts

```typescript
import type { RerunWorkflowParams, RerunWorkflowResponse } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const rerunWorkflowTool: ToolConfig<RerunWorkflowParams, RerunWorkflowResponse> = {
  id: 'github_rerun_workflow',
  name: 'GitHub Rerun Workflow',
  description:
    'Rerun a workflow run. Optionally enable debug logging for the rerun. Returns 201 Created on success.',
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
    run_id: {
      type: 'number',
      required: true,
      visibility: 'user-or-llm',
      description: 'Workflow run ID to rerun',
    },
    enable_debug_logging: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Enable debug logging for the rerun (default: false)',
      default: false,
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
      `https://api.github.com/repos/${params.owner}/${params.repo}/actions/runs/${params.run_id}/rerun`,
    method: 'POST',
    headers: (params) => ({
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${params.apiKey}`,
      'X-GitHub-Api-Version': '2022-11-28',
    }),
    body: (params) => ({
      ...(params.enable_debug_logging !== undefined && {
        enable_debug_logging: params.enable_debug_logging,
      }),
    }),
  },

  transformResponse: async (response, params) => {
    if (!params) {
      return {
        success: false,
        error: 'Missing parameters',
        output: {
          content: '',
          metadata: {
            run_id: 0,
            status: 'error',
          },
        },
      }
    }

    const content = `Workflow run #${params.run_id} has been queued for rerun.${params.enable_debug_logging ? '\nDebug logging is enabled for this rerun.' : ''}
The rerun should start shortly.`

    return {
      success: true,
      output: {
        content,
        metadata: {
          run_id: params.run_id,
          status: 'rerun_initiated',
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Rerun confirmation message' },
    metadata: {
      type: 'object',
      description: 'Rerun metadata',
      properties: {
        run_id: { type: 'number', description: 'Workflow run ID' },
        status: { type: 'string', description: 'Rerun status (rerun_initiated)' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: trigger_workflow.ts]---
Location: sim-main/apps/sim/tools/github/trigger_workflow.ts

```typescript
import type { TriggerWorkflowParams, TriggerWorkflowResponse } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const triggerWorkflowTool: ToolConfig<TriggerWorkflowParams, TriggerWorkflowResponse> = {
  id: 'github_trigger_workflow',
  name: 'GitHub Trigger Workflow',
  description:
    'Trigger a workflow dispatch event for a GitHub Actions workflow. The workflow must have a workflow_dispatch trigger configured. Returns 204 No Content on success.',
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
    workflow_id: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Workflow ID (number) or workflow filename (e.g., "main.yaml")',
    },
    ref: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Git reference (branch or tag name) to run the workflow on',
    },
    inputs: {
      type: 'object',
      required: false,
      visibility: 'user-or-llm',
      description: 'Input keys and values configured in the workflow file',
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
      `https://api.github.com/repos/${params.owner}/${params.repo}/actions/workflows/${params.workflow_id}/dispatches`,
    method: 'POST',
    headers: (params) => ({
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${params.apiKey}`,
      'X-GitHub-Api-Version': '2022-11-28',
    }),
    body: (params) => ({
      ref: params.ref,
      ...(params.inputs && { inputs: params.inputs }),
    }),
  },

  transformResponse: async (response) => {
    const content = `Workflow dispatched successfully on ref: ${response.url.includes('ref') ? 'requested ref' : 'default branch'}
The workflow run should start shortly.`

    return {
      success: true,
      output: {
        content,
        metadata: {},
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Confirmation message' },
    metadata: {
      type: 'object',
      description: 'Empty metadata object (204 No Content response)',
    },
  },
}
```

--------------------------------------------------------------------------------

````
