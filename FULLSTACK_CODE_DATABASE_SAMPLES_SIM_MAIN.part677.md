---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 677
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 677 of 933)

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

---[FILE: get_pipeline.ts]---
Location: sim-main/apps/sim/tools/gitlab/get_pipeline.ts

```typescript
import type { GitLabGetPipelineParams, GitLabGetPipelineResponse } from '@/tools/gitlab/types'
import type { ToolConfig } from '@/tools/types'

export const gitlabGetPipelineTool: ToolConfig<GitLabGetPipelineParams, GitLabGetPipelineResponse> =
  {
    id: 'gitlab_get_pipeline',
    name: 'GitLab Get Pipeline',
    description: 'Get details of a specific GitLab pipeline',
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
        return `https://gitlab.com/api/v4/projects/${encodedId}/pipelines/${params.pipelineId}`
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
        description: 'The GitLab pipeline details',
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: get_project.ts]---
Location: sim-main/apps/sim/tools/gitlab/get_project.ts

```typescript
import type { GitLabGetProjectParams, GitLabGetProjectResponse } from '@/tools/gitlab/types'
import type { ToolConfig } from '@/tools/types'

export const gitlabGetProjectTool: ToolConfig<GitLabGetProjectParams, GitLabGetProjectResponse> = {
  id: 'gitlab_get_project',
  name: 'GitLab Get Project',
  description: 'Get details of a specific GitLab project',
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
      description: 'Project ID or URL-encoded path (e.g., "namespace/project")',
    },
  },

  request: {
    url: (params) => {
      const encodedId = encodeURIComponent(String(params.projectId))
      return `https://gitlab.com/api/v4/projects/${encodedId}`
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

    const project = await response.json()

    return {
      success: true,
      output: {
        project,
      },
    }
  },

  outputs: {
    project: {
      type: 'object',
      description: 'The GitLab project details',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/gitlab/index.ts

```typescript
import { gitlabCancelPipelineTool } from '@/tools/gitlab/cancel_pipeline'
import { gitlabCreateIssueTool } from '@/tools/gitlab/create_issue'
import { gitlabCreateIssueNoteTool } from '@/tools/gitlab/create_issue_note'
import { gitlabCreateMergeRequestTool } from '@/tools/gitlab/create_merge_request'
import { gitlabCreateMergeRequestNoteTool } from '@/tools/gitlab/create_merge_request_note'
import { gitlabCreatePipelineTool } from '@/tools/gitlab/create_pipeline'
import { gitlabDeleteIssueTool } from '@/tools/gitlab/delete_issue'
import { gitlabGetIssueTool } from '@/tools/gitlab/get_issue'
import { gitlabGetMergeRequestTool } from '@/tools/gitlab/get_merge_request'
import { gitlabGetPipelineTool } from '@/tools/gitlab/get_pipeline'
import { gitlabGetProjectTool } from '@/tools/gitlab/get_project'
import { gitlabListIssuesTool } from '@/tools/gitlab/list_issues'
import { gitlabListMergeRequestsTool } from '@/tools/gitlab/list_merge_requests'
import { gitlabListPipelinesTool } from '@/tools/gitlab/list_pipelines'
import { gitlabListProjectsTool } from '@/tools/gitlab/list_projects'
import { gitlabMergeMergeRequestTool } from '@/tools/gitlab/merge_merge_request'
import { gitlabRetryPipelineTool } from '@/tools/gitlab/retry_pipeline'
import { gitlabUpdateIssueTool } from '@/tools/gitlab/update_issue'
import { gitlabUpdateMergeRequestTool } from '@/tools/gitlab/update_merge_request'

export {
  // Projects
  gitlabListProjectsTool,
  gitlabGetProjectTool,
  // Issues
  gitlabListIssuesTool,
  gitlabGetIssueTool,
  gitlabCreateIssueTool,
  gitlabUpdateIssueTool,
  gitlabDeleteIssueTool,
  gitlabCreateIssueNoteTool,
  // Merge Requests
  gitlabListMergeRequestsTool,
  gitlabGetMergeRequestTool,
  gitlabCreateMergeRequestTool,
  gitlabUpdateMergeRequestTool,
  gitlabMergeMergeRequestTool,
  gitlabCreateMergeRequestNoteTool,
  // Pipelines
  gitlabListPipelinesTool,
  gitlabGetPipelineTool,
  gitlabCreatePipelineTool,
  gitlabRetryPipelineTool,
  gitlabCancelPipelineTool,
}
```

--------------------------------------------------------------------------------

---[FILE: list_issues.ts]---
Location: sim-main/apps/sim/tools/gitlab/list_issues.ts

```typescript
import type { GitLabListIssuesParams, GitLabListIssuesResponse } from '@/tools/gitlab/types'
import type { ToolConfig } from '@/tools/types'

export const gitlabListIssuesTool: ToolConfig<GitLabListIssuesParams, GitLabListIssuesResponse> = {
  id: 'gitlab_list_issues',
  name: 'GitLab List Issues',
  description: 'List issues in a GitLab project',
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
    state: {
      type: 'string',
      required: false,
      description: 'Filter by state (opened, closed, all)',
    },
    labels: {
      type: 'string',
      required: false,
      description: 'Comma-separated list of label names',
    },
    assigneeId: {
      type: 'number',
      required: false,
      description: 'Filter by assignee user ID',
    },
    milestoneTitle: {
      type: 'string',
      required: false,
      description: 'Filter by milestone title',
    },
    search: {
      type: 'string',
      required: false,
      description: 'Search issues by title and description',
    },
    orderBy: {
      type: 'string',
      required: false,
      description: 'Order by field (created_at, updated_at)',
    },
    sort: {
      type: 'string',
      required: false,
      description: 'Sort direction (asc, desc)',
    },
    perPage: {
      type: 'number',
      required: false,
      description: 'Number of results per page (default 20, max 100)',
    },
    page: {
      type: 'number',
      required: false,
      description: 'Page number for pagination',
    },
  },

  request: {
    url: (params) => {
      const encodedId = encodeURIComponent(String(params.projectId))
      const queryParams = new URLSearchParams()

      if (params.state) queryParams.append('state', params.state)
      if (params.labels) queryParams.append('labels', params.labels)
      if (params.assigneeId) queryParams.append('assignee_id', String(params.assigneeId))
      if (params.milestoneTitle) queryParams.append('milestone', params.milestoneTitle)
      if (params.search) queryParams.append('search', params.search)
      if (params.orderBy) queryParams.append('order_by', params.orderBy)
      if (params.sort) queryParams.append('sort', params.sort)
      if (params.perPage) queryParams.append('per_page', String(params.perPage))
      if (params.page) queryParams.append('page', String(params.page))

      const query = queryParams.toString()
      return `https://gitlab.com/api/v4/projects/${encodedId}/issues${query ? `?${query}` : ''}`
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

    const issues = await response.json()
    const total = response.headers.get('x-total')

    return {
      success: true,
      output: {
        issues,
        total: total ? Number.parseInt(total, 10) : issues.length,
      },
    }
  },

  outputs: {
    issues: {
      type: 'array',
      description: 'List of GitLab issues',
    },
    total: {
      type: 'number',
      description: 'Total number of issues',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_merge_requests.ts]---
Location: sim-main/apps/sim/tools/gitlab/list_merge_requests.ts

```typescript
import type {
  GitLabListMergeRequestsParams,
  GitLabListMergeRequestsResponse,
} from '@/tools/gitlab/types'
import type { ToolConfig } from '@/tools/types'

export const gitlabListMergeRequestsTool: ToolConfig<
  GitLabListMergeRequestsParams,
  GitLabListMergeRequestsResponse
> = {
  id: 'gitlab_list_merge_requests',
  name: 'GitLab List Merge Requests',
  description: 'List merge requests in a GitLab project',
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
    state: {
      type: 'string',
      required: false,
      description: 'Filter by state (opened, closed, merged, all)',
    },
    labels: {
      type: 'string',
      required: false,
      description: 'Comma-separated list of label names',
    },
    sourceBranch: {
      type: 'string',
      required: false,
      description: 'Filter by source branch',
    },
    targetBranch: {
      type: 'string',
      required: false,
      description: 'Filter by target branch',
    },
    orderBy: {
      type: 'string',
      required: false,
      description: 'Order by field (created_at, updated_at)',
    },
    sort: {
      type: 'string',
      required: false,
      description: 'Sort direction (asc, desc)',
    },
    perPage: {
      type: 'number',
      required: false,
      description: 'Number of results per page (default 20, max 100)',
    },
    page: {
      type: 'number',
      required: false,
      description: 'Page number for pagination',
    },
  },

  request: {
    url: (params) => {
      const encodedId = encodeURIComponent(String(params.projectId))
      const queryParams = new URLSearchParams()

      if (params.state) queryParams.append('state', params.state)
      if (params.labels) queryParams.append('labels', params.labels)
      if (params.sourceBranch) queryParams.append('source_branch', params.sourceBranch)
      if (params.targetBranch) queryParams.append('target_branch', params.targetBranch)
      if (params.orderBy) queryParams.append('order_by', params.orderBy)
      if (params.sort) queryParams.append('sort', params.sort)
      if (params.perPage) queryParams.append('per_page', String(params.perPage))
      if (params.page) queryParams.append('page', String(params.page))

      const query = queryParams.toString()
      return `https://gitlab.com/api/v4/projects/${encodedId}/merge_requests${query ? `?${query}` : ''}`
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

    const mergeRequests = await response.json()
    const total = response.headers.get('x-total')

    return {
      success: true,
      output: {
        mergeRequests,
        total: total ? Number.parseInt(total, 10) : mergeRequests.length,
      },
    }
  },

  outputs: {
    mergeRequests: {
      type: 'array',
      description: 'List of GitLab merge requests',
    },
    total: {
      type: 'number',
      description: 'Total number of merge requests',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_pipelines.ts]---
Location: sim-main/apps/sim/tools/gitlab/list_pipelines.ts

```typescript
import type { GitLabListPipelinesParams, GitLabListPipelinesResponse } from '@/tools/gitlab/types'
import type { ToolConfig } from '@/tools/types'

export const gitlabListPipelinesTool: ToolConfig<
  GitLabListPipelinesParams,
  GitLabListPipelinesResponse
> = {
  id: 'gitlab_list_pipelines',
  name: 'GitLab List Pipelines',
  description: 'List pipelines in a GitLab project',
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
      required: false,
      description: 'Filter by ref (branch or tag)',
    },
    status: {
      type: 'string',
      required: false,
      description:
        'Filter by status (created, waiting_for_resource, preparing, pending, running, success, failed, canceled, skipped, manual, scheduled)',
    },
    orderBy: {
      type: 'string',
      required: false,
      description: 'Order by field (id, status, ref, updated_at, user_id)',
    },
    sort: {
      type: 'string',
      required: false,
      description: 'Sort direction (asc, desc)',
    },
    perPage: {
      type: 'number',
      required: false,
      description: 'Number of results per page (default 20, max 100)',
    },
    page: {
      type: 'number',
      required: false,
      description: 'Page number for pagination',
    },
  },

  request: {
    url: (params) => {
      const encodedId = encodeURIComponent(String(params.projectId))
      const queryParams = new URLSearchParams()

      if (params.ref) queryParams.append('ref', params.ref)
      if (params.status) queryParams.append('status', params.status)
      if (params.orderBy) queryParams.append('order_by', params.orderBy)
      if (params.sort) queryParams.append('sort', params.sort)
      if (params.perPage) queryParams.append('per_page', String(params.perPage))
      if (params.page) queryParams.append('page', String(params.page))

      const query = queryParams.toString()
      return `https://gitlab.com/api/v4/projects/${encodedId}/pipelines${query ? `?${query}` : ''}`
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

    const pipelines = await response.json()
    const total = response.headers.get('x-total')

    return {
      success: true,
      output: {
        pipelines,
        total: total ? Number.parseInt(total, 10) : pipelines.length,
      },
    }
  },

  outputs: {
    pipelines: {
      type: 'array',
      description: 'List of GitLab pipelines',
    },
    total: {
      type: 'number',
      description: 'Total number of pipelines',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_projects.ts]---
Location: sim-main/apps/sim/tools/gitlab/list_projects.ts

```typescript
import type { GitLabListProjectsParams, GitLabListProjectsResponse } from '@/tools/gitlab/types'
import type { ToolConfig } from '@/tools/types'

export const gitlabListProjectsTool: ToolConfig<
  GitLabListProjectsParams,
  GitLabListProjectsResponse
> = {
  id: 'gitlab_list_projects',
  name: 'GitLab List Projects',
  description: 'List GitLab projects accessible to the authenticated user',
  version: '1.0.0',

  params: {
    accessToken: {
      type: 'string',
      required: true,
      description: 'GitLab Personal Access Token',
    },
    owned: {
      type: 'boolean',
      required: false,
      description: 'Limit to projects owned by the current user',
    },
    membership: {
      type: 'boolean',
      required: false,
      description: 'Limit to projects the current user is a member of',
    },
    search: {
      type: 'string',
      required: false,
      description: 'Search projects by name',
    },
    visibility: {
      type: 'string',
      required: false,
      description: 'Filter by visibility (public, internal, private)',
    },
    orderBy: {
      type: 'string',
      required: false,
      description: 'Order by field (id, name, path, created_at, updated_at, last_activity_at)',
    },
    sort: {
      type: 'string',
      required: false,
      description: 'Sort direction (asc, desc)',
    },
    perPage: {
      type: 'number',
      required: false,
      description: 'Number of results per page (default 20, max 100)',
    },
    page: {
      type: 'number',
      required: false,
      description: 'Page number for pagination',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()
      if (params.owned) queryParams.append('owned', 'true')
      if (params.membership) queryParams.append('membership', 'true')
      if (params.search) queryParams.append('search', params.search)
      if (params.visibility) queryParams.append('visibility', params.visibility)
      if (params.orderBy) queryParams.append('order_by', params.orderBy)
      if (params.sort) queryParams.append('sort', params.sort)
      if (params.perPage) queryParams.append('per_page', String(params.perPage))
      if (params.page) queryParams.append('page', String(params.page))

      const query = queryParams.toString()
      return `https://gitlab.com/api/v4/projects${query ? `?${query}` : ''}`
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

    const projects = await response.json()
    const total = response.headers.get('x-total')

    return {
      success: true,
      output: {
        projects,
        total: total ? Number.parseInt(total, 10) : projects.length,
      },
    }
  },

  outputs: {
    projects: {
      type: 'array',
      description: 'List of GitLab projects',
    },
    total: {
      type: 'number',
      description: 'Total number of projects',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: merge_merge_request.ts]---
Location: sim-main/apps/sim/tools/gitlab/merge_merge_request.ts

```typescript
import type {
  GitLabMergeMergeRequestParams,
  GitLabMergeMergeRequestResponse,
} from '@/tools/gitlab/types'
import type { ToolConfig } from '@/tools/types'

export const gitlabMergeMergeRequestTool: ToolConfig<
  GitLabMergeMergeRequestParams,
  GitLabMergeMergeRequestResponse
> = {
  id: 'gitlab_merge_merge_request',
  name: 'GitLab Merge Merge Request',
  description: 'Merge a merge request in a GitLab project',
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
    mergeCommitMessage: {
      type: 'string',
      required: false,
      description: 'Custom merge commit message',
    },
    squashCommitMessage: {
      type: 'string',
      required: false,
      description: 'Custom squash commit message',
    },
    squash: {
      type: 'boolean',
      required: false,
      description: 'Squash commits before merging',
    },
    shouldRemoveSourceBranch: {
      type: 'boolean',
      required: false,
      description: 'Delete source branch after merge',
    },
    mergeWhenPipelineSucceeds: {
      type: 'boolean',
      required: false,
      description: 'Merge when pipeline succeeds',
    },
  },

  request: {
    url: (params) => {
      const encodedId = encodeURIComponent(String(params.projectId))
      return `https://gitlab.com/api/v4/projects/${encodedId}/merge_requests/${params.mergeRequestIid}/merge`
    },
    method: 'PUT',
    headers: (params) => ({
      'Content-Type': 'application/json',
      'PRIVATE-TOKEN': params.accessToken,
    }),
    body: (params) => {
      const body: Record<string, any> = {}

      if (params.mergeCommitMessage) body.merge_commit_message = params.mergeCommitMessage
      if (params.squashCommitMessage) body.squash_commit_message = params.squashCommitMessage
      if (params.squash !== undefined) body.squash = params.squash
      if (params.shouldRemoveSourceBranch !== undefined)
        body.should_remove_source_branch = params.shouldRemoveSourceBranch
      if (params.mergeWhenPipelineSucceeds !== undefined)
        body.merge_when_pipeline_succeeds = params.mergeWhenPipelineSucceeds

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
      description: 'The merged GitLab merge request',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: retry_pipeline.ts]---
Location: sim-main/apps/sim/tools/gitlab/retry_pipeline.ts

```typescript
import type { GitLabRetryPipelineParams, GitLabRetryPipelineResponse } from '@/tools/gitlab/types'
import type { ToolConfig } from '@/tools/types'

export const gitlabRetryPipelineTool: ToolConfig<
  GitLabRetryPipelineParams,
  GitLabRetryPipelineResponse
> = {
  id: 'gitlab_retry_pipeline',
  name: 'GitLab Retry Pipeline',
  description: 'Retry a failed GitLab pipeline',
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
      return `https://gitlab.com/api/v4/projects/${encodedId}/pipelines/${params.pipelineId}/retry`
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
      description: 'The retried GitLab pipeline',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/gitlab/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

// ===== Core Types =====

export interface GitLabProject {
  id: number
  name: string
  path: string
  path_with_namespace: string
  description?: string
  visibility: string
  web_url: string
  default_branch?: string
  created_at: string
  last_activity_at: string
  namespace?: {
    id: number
    name: string
    path: string
    kind: string
  }
  owner?: {
    id: number
    name: string
    username: string
  }
}

export interface GitLabIssue {
  id: number
  iid: number
  project_id: number
  title: string
  description?: string
  state: string
  created_at: string
  updated_at: string
  closed_at?: string
  labels: string[]
  milestone?: {
    id: number
    iid: number
    title: string
  }
  assignees?: Array<{
    id: number
    name: string
    username: string
  }>
  assignee?: {
    id: number
    name: string
    username: string
  }
  author: {
    id: number
    name: string
    username: string
  }
  web_url: string
  due_date?: string
  confidential: boolean
}

export interface GitLabMergeRequest {
  id: number
  iid: number
  project_id: number
  title: string
  description?: string
  state: string
  created_at: string
  updated_at: string
  merged_at?: string
  closed_at?: string
  source_branch: string
  target_branch: string
  source_project_id: number
  target_project_id: number
  labels: string[]
  milestone?: {
    id: number
    iid: number
    title: string
  }
  assignee?: {
    id: number
    name: string
    username: string
  }
  assignees?: Array<{
    id: number
    name: string
    username: string
  }>
  author: {
    id: number
    name: string
    username: string
  }
  merge_status: string
  web_url: string
  draft: boolean
  work_in_progress: boolean
  has_conflicts: boolean
  merge_when_pipeline_succeeds: boolean
}

export interface GitLabPipeline {
  id: number
  iid: number
  project_id: number
  sha: string
  ref: string
  status: string
  source: string
  created_at: string
  updated_at: string
  web_url: string
  user?: {
    id: number
    name: string
    username: string
  }
}

export interface GitLabBranch {
  name: string
  merged: boolean
  protected: boolean
  default: boolean
  developers_can_push: boolean
  developers_can_merge: boolean
  can_push: boolean
  web_url: string
  commit?: {
    id: string
    short_id: string
    title: string
    author_name: string
    authored_date: string
  }
}

export interface GitLabNote {
  id: number
  body: string
  author: {
    id: number
    name: string
    username: string
  }
  created_at: string
  updated_at: string
  system: boolean
  noteable_id: number
  noteable_type: string
  noteable_iid?: number
}

export interface GitLabUser {
  id: number
  name: string
  username: string
  email?: string
  state: string
  avatar_url: string
  web_url: string
}

export interface GitLabLabel {
  id: number
  name: string
  color: string
  description?: string
  text_color: string
}

export interface GitLabMilestone {
  id: number
  iid: number
  project_id: number
  title: string
  description?: string
  state: string
  created_at: string
  updated_at: string
  due_date?: string
  start_date?: string
  web_url: string
}

// ===== Common Parameters =====

interface GitLabBaseParams {
  accessToken: string
}

// ===== Project Parameters =====

export interface GitLabListProjectsParams extends GitLabBaseParams {
  owned?: boolean
  membership?: boolean
  search?: string
  visibility?: 'public' | 'internal' | 'private'
  orderBy?: 'id' | 'name' | 'path' | 'created_at' | 'updated_at' | 'last_activity_at'
  sort?: 'asc' | 'desc'
  perPage?: number
  page?: number
}

export interface GitLabGetProjectParams extends GitLabBaseParams {
  projectId: string | number
}

// ===== Issue Parameters =====

export interface GitLabListIssuesParams extends GitLabBaseParams {
  projectId: string | number
  state?: 'opened' | 'closed' | 'all'
  labels?: string
  assigneeId?: number
  milestoneTitle?: string
  search?: string
  orderBy?: 'created_at' | 'updated_at'
  sort?: 'asc' | 'desc'
  perPage?: number
  page?: number
}

export interface GitLabGetIssueParams extends GitLabBaseParams {
  projectId: string | number
  issueIid: number
}

export interface GitLabCreateIssueParams extends GitLabBaseParams {
  projectId: string | number
  title: string
  description?: string
  labels?: string
  assigneeIds?: number[]
  milestoneId?: number
  dueDate?: string
  confidential?: boolean
}

export interface GitLabUpdateIssueParams extends GitLabBaseParams {
  projectId: string | number
  issueIid: number
  title?: string
  description?: string
  stateEvent?: 'close' | 'reopen'
  labels?: string
  assigneeIds?: number[]
  milestoneId?: number
  dueDate?: string
  confidential?: boolean
}

export interface GitLabDeleteIssueParams extends GitLabBaseParams {
  projectId: string | number
  issueIid: number
}

// ===== Merge Request Parameters =====

export interface GitLabListMergeRequestsParams extends GitLabBaseParams {
  projectId: string | number
  state?: 'opened' | 'closed' | 'merged' | 'all'
  labels?: string
  sourceBranch?: string
  targetBranch?: string
  orderBy?: 'created_at' | 'updated_at'
  sort?: 'asc' | 'desc'
  perPage?: number
  page?: number
}

export interface GitLabGetMergeRequestParams extends GitLabBaseParams {
  projectId: string | number
  mergeRequestIid: number
}

export interface GitLabCreateMergeRequestParams extends GitLabBaseParams {
  projectId: string | number
  sourceBranch: string
  targetBranch: string
  title: string
  description?: string
  labels?: string
  assigneeIds?: number[]
  milestoneId?: number
  removeSourceBranch?: boolean
  squash?: boolean
  draft?: boolean
}

export interface GitLabUpdateMergeRequestParams extends GitLabBaseParams {
  projectId: string | number
  mergeRequestIid: number
  title?: string
  description?: string
  stateEvent?: 'close' | 'reopen'
  labels?: string
  assigneeIds?: number[]
  milestoneId?: number
  targetBranch?: string
  removeSourceBranch?: boolean
  squash?: boolean
  draft?: boolean
}

export interface GitLabMergeMergeRequestParams extends GitLabBaseParams {
  projectId: string | number
  mergeRequestIid: number
  mergeCommitMessage?: string
  squashCommitMessage?: string
  squash?: boolean
  shouldRemoveSourceBranch?: boolean
  mergeWhenPipelineSucceeds?: boolean
}

// ===== Pipeline Parameters =====

export interface GitLabListPipelinesParams extends GitLabBaseParams {
  projectId: string | number
  ref?: string
  status?:
    | 'created'
    | 'waiting_for_resource'
    | 'preparing'
    | 'pending'
    | 'running'
    | 'success'
    | 'failed'
    | 'canceled'
    | 'skipped'
    | 'manual'
    | 'scheduled'
  orderBy?: 'id' | 'status' | 'ref' | 'updated_at' | 'user_id'
  sort?: 'asc' | 'desc'
  perPage?: number
  page?: number
}

export interface GitLabGetPipelineParams extends GitLabBaseParams {
  projectId: string | number
  pipelineId: number
}

export interface GitLabCreatePipelineParams extends GitLabBaseParams {
  projectId: string | number
  ref: string
  variables?: Array<{ key: string; value: string; variable_type?: 'env_var' | 'file' }>
}

export interface GitLabRetryPipelineParams extends GitLabBaseParams {
  projectId: string | number
  pipelineId: number
}

export interface GitLabCancelPipelineParams extends GitLabBaseParams {
  projectId: string | number
  pipelineId: number
}

// ===== Branch Parameters =====

export interface GitLabListBranchesParams extends GitLabBaseParams {
  projectId: string | number
  search?: string
  perPage?: number
  page?: number
}

export interface GitLabGetBranchParams extends GitLabBaseParams {
  projectId: string | number
  branch: string
}

export interface GitLabCreateBranchParams extends GitLabBaseParams {
  projectId: string | number
  branch: string
  ref: string
}

export interface GitLabDeleteBranchParams extends GitLabBaseParams {
  projectId: string | number
  branch: string
}

// ===== Note/Comment Parameters =====

export interface GitLabListIssueNotesParams extends GitLabBaseParams {
  projectId: string | number
  issueIid: number
  orderBy?: 'created_at' | 'updated_at'
  sort?: 'asc' | 'desc'
  perPage?: number
  page?: number
}

export interface GitLabCreateIssueNoteParams extends GitLabBaseParams {
  projectId: string | number
  issueIid: number
  body: string
}

export interface GitLabListMergeRequestNotesParams extends GitLabBaseParams {
  projectId: string | number
  mergeRequestIid: number
  orderBy?: 'created_at' | 'updated_at'
  sort?: 'asc' | 'desc'
  perPage?: number
  page?: number
}

export interface GitLabCreateMergeRequestNoteParams extends GitLabBaseParams {
  projectId: string | number
  mergeRequestIid: number
  body: string
}

// ===== Label Parameters =====

export interface GitLabListLabelsParams extends GitLabBaseParams {
  projectId: string | number
  search?: string
  perPage?: number
  page?: number
}

export interface GitLabCreateLabelParams extends GitLabBaseParams {
  projectId: string | number
  name: string
  color: string
  description?: string
}

// ===== User Parameters =====

export interface GitLabGetCurrentUserParams extends GitLabBaseParams {}

export interface GitLabListUsersParams extends GitLabBaseParams {
  search?: string
  perPage?: number
  page?: number
}

// ===== Response Types =====

export interface GitLabListProjectsResponse extends ToolResponse {
  output: {
    projects?: GitLabProject[]
    total?: number
  }
}

export interface GitLabGetProjectResponse extends ToolResponse {
  output: {
    project?: GitLabProject
  }
}

export interface GitLabListIssuesResponse extends ToolResponse {
  output: {
    issues?: GitLabIssue[]
    total?: number
  }
}

export interface GitLabGetIssueResponse extends ToolResponse {
  output: {
    issue?: GitLabIssue
  }
}

export interface GitLabCreateIssueResponse extends ToolResponse {
  output: {
    issue?: GitLabIssue
  }
}

export interface GitLabUpdateIssueResponse extends ToolResponse {
  output: {
    issue?: GitLabIssue
  }
}

export interface GitLabDeleteIssueResponse extends ToolResponse {
  output: {
    success?: boolean
  }
}

export interface GitLabListMergeRequestsResponse extends ToolResponse {
  output: {
    mergeRequests?: GitLabMergeRequest[]
    total?: number
  }
}

export interface GitLabGetMergeRequestResponse extends ToolResponse {
  output: {
    mergeRequest?: GitLabMergeRequest
  }
}

export interface GitLabCreateMergeRequestResponse extends ToolResponse {
  output: {
    mergeRequest?: GitLabMergeRequest
  }
}

export interface GitLabUpdateMergeRequestResponse extends ToolResponse {
  output: {
    mergeRequest?: GitLabMergeRequest
  }
}

export interface GitLabMergeMergeRequestResponse extends ToolResponse {
  output: {
    mergeRequest?: GitLabMergeRequest
  }
}

export interface GitLabListPipelinesResponse extends ToolResponse {
  output: {
    pipelines?: GitLabPipeline[]
    total?: number
  }
}

export interface GitLabGetPipelineResponse extends ToolResponse {
  output: {
    pipeline?: GitLabPipeline
  }
}

export interface GitLabCreatePipelineResponse extends ToolResponse {
  output: {
    pipeline?: GitLabPipeline
  }
}

export interface GitLabRetryPipelineResponse extends ToolResponse {
  output: {
    pipeline?: GitLabPipeline
  }
}

export interface GitLabCancelPipelineResponse extends ToolResponse {
  output: {
    pipeline?: GitLabPipeline
  }
}

export interface GitLabListBranchesResponse extends ToolResponse {
  output: {
    branches?: GitLabBranch[]
    total?: number
  }
}

export interface GitLabGetBranchResponse extends ToolResponse {
  output: {
    branch?: GitLabBranch
  }
}

export interface GitLabCreateBranchResponse extends ToolResponse {
  output: {
    branch?: GitLabBranch
  }
}

export interface GitLabDeleteBranchResponse extends ToolResponse {
  output: {
    success?: boolean
  }
}

export interface GitLabListNotesResponse extends ToolResponse {
  output: {
    notes?: GitLabNote[]
    total?: number
  }
}

export interface GitLabCreateNoteResponse extends ToolResponse {
  output: {
    note?: GitLabNote
  }
}

export interface GitLabListLabelsResponse extends ToolResponse {
  output: {
    labels?: GitLabLabel[]
    total?: number
  }
}

export interface GitLabCreateLabelResponse extends ToolResponse {
  output: {
    label?: GitLabLabel
  }
}

export interface GitLabGetCurrentUserResponse extends ToolResponse {
  output: {
    user?: GitLabUser
  }
}

export interface GitLabListUsersResponse extends ToolResponse {
  output: {
    users?: GitLabUser[]
    total?: number
  }
}

// ===== Union Response Type =====

export type GitLabResponse =
  | GitLabListProjectsResponse
  | GitLabGetProjectResponse
  | GitLabListIssuesResponse
  | GitLabGetIssueResponse
  | GitLabCreateIssueResponse
  | GitLabUpdateIssueResponse
  | GitLabDeleteIssueResponse
  | GitLabListMergeRequestsResponse
  | GitLabGetMergeRequestResponse
  | GitLabCreateMergeRequestResponse
  | GitLabUpdateMergeRequestResponse
  | GitLabMergeMergeRequestResponse
  | GitLabListPipelinesResponse
  | GitLabGetPipelineResponse
  | GitLabCreatePipelineResponse
  | GitLabRetryPipelineResponse
  | GitLabCancelPipelineResponse
  | GitLabListBranchesResponse
  | GitLabGetBranchResponse
  | GitLabCreateBranchResponse
  | GitLabDeleteBranchResponse
  | GitLabListNotesResponse
  | GitLabCreateNoteResponse
  | GitLabListLabelsResponse
  | GitLabCreateLabelResponse
  | GitLabGetCurrentUserResponse
  | GitLabListUsersResponse
```

--------------------------------------------------------------------------------

````
