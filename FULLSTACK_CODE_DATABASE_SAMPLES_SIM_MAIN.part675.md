---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 675
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 675 of 933)

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

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/github/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

// Base parameters shared by all GitHub operations
export interface BaseGitHubParams {
  owner: string
  repo: string
  apiKey: string
}

// PR operation parameters
export interface PROperationParams extends BaseGitHubParams {
  pullNumber: number
}

// Comment operation parameters
export interface CreateCommentParams extends PROperationParams {
  body: string
  path?: string
  position?: number
  line?: number
  side?: string
  commitId?: string
  commentType?: 'pr_comment' | 'file_comment'
}

// Latest commit parameters
export interface LatestCommitParams extends BaseGitHubParams {
  branch?: string
}

// Create PR parameters
export interface CreatePRParams extends BaseGitHubParams {
  title: string
  head: string
  base: string
  body?: string
  draft?: boolean
}

// Update PR parameters
export interface UpdatePRParams extends BaseGitHubParams {
  pullNumber: number
  title?: string
  body?: string
  state?: 'open' | 'closed'
  base?: string
}

// Merge PR parameters
export interface MergePRParams extends BaseGitHubParams {
  pullNumber: number
  commit_title?: string
  commit_message?: string
  merge_method?: 'merge' | 'squash' | 'rebase'
}

// List PRs parameters
export interface ListPRsParams extends BaseGitHubParams {
  state?: 'open' | 'closed' | 'all'
  head?: string
  base?: string
  sort?: 'created' | 'updated' | 'popularity' | 'long-running'
  direction?: 'asc' | 'desc'
  per_page?: number
  page?: number
}

// Get PR files parameters
export interface GetPRFilesParams extends BaseGitHubParams {
  pullNumber: number
  per_page?: number
  page?: number
}

// Close PR parameters
export interface ClosePRParams extends BaseGitHubParams {
  pullNumber: number
}

// Request reviewers parameters
export interface RequestReviewersParams extends BaseGitHubParams {
  pullNumber: number
  reviewers: string
  team_reviewers?: string
}

// Response metadata interfaces
interface BasePRMetadata {
  number: number
  title: string
  state: string
  html_url: string
  diff_url: string
  created_at: string
  updated_at: string
}

interface PRFilesMetadata {
  files?: Array<{
    filename: string
    additions: number
    deletions: number
    changes: number
    patch?: string
    blob_url: string
    raw_url: string
    status: string
  }>
}

interface PRCommentsMetadata {
  comments?: Array<{
    id: number
    body: string
    path?: string
    line?: number
    commit_id: string
    created_at: string
    updated_at: string
    html_url: string
  }>
}

interface CommentMetadata {
  id: number
  html_url: string
  created_at: string
  updated_at: string
  path?: string
  line?: number
  side?: string
  commit_id?: string
}

interface CommitMetadata {
  sha: string
  html_url: string
  commit_message: string
  author: {
    name: string
    login: string
    avatar_url: string
    html_url: string
  }
  committer: {
    name: string
    login: string
    avatar_url: string
    html_url: string
  }
  stats?: {
    additions: number
    deletions: number
    total: number
  }
  files?: Array<{
    filename: string
    additions: number
    deletions: number
    changes: number
    status: string
    raw_url: string
    blob_url: string
    patch?: string
    content?: string
  }>
}

interface RepoMetadata {
  name: string
  description: string
  stars: number
  forks: number
  openIssues: number
  language: string
}

// PR operation response metadata
interface PRMetadata {
  number: number
  title: string
  state: string
  html_url: string
  merged: boolean
  draft: boolean
  created_at?: string
  updated_at?: string
  merge_commit_sha?: string
}

interface MergeResultMetadata {
  sha: string
  merged: boolean
  message: string
}

interface PRListMetadata {
  prs: Array<{
    number: number
    title: string
    state: string
    html_url: string
    created_at: string
    updated_at: string
  }>
  total_count: number
  open_count?: number
  closed_count?: number
}

interface PRFilesListMetadata {
  files: Array<{
    filename: string
    status: string
    additions: number
    deletions: number
    changes: number
    patch?: string
    blob_url: string
    raw_url: string
  }>
  total_count: number
}

interface ReviewersMetadata {
  requested_reviewers: Array<{
    login: string
    id: number
  }>
  requested_teams?: Array<{
    name: string
    id: number
  }>
}

// Response types
export interface PullRequestResponse extends ToolResponse {
  output: {
    content: string
    metadata: BasePRMetadata & PRFilesMetadata & PRCommentsMetadata
  }
}

export interface CreateCommentResponse extends ToolResponse {
  output: {
    content: string
    metadata: CommentMetadata
  }
}

export interface LatestCommitResponse extends ToolResponse {
  output: {
    content: string
    metadata: CommitMetadata
  }
}

export interface RepoInfoResponse extends ToolResponse {
  output: {
    content: string
    metadata: RepoMetadata
  }
}

// Issue comment operation parameters
export interface CreateIssueCommentParams extends BaseGitHubParams {
  issue_number: number
  body: string
}

export interface ListIssueCommentsParams extends BaseGitHubParams {
  issue_number: number
  since?: string
  per_page?: number
  page?: number
}

export interface UpdateCommentParams extends BaseGitHubParams {
  comment_id: number
  body: string
}

export interface DeleteCommentParams extends BaseGitHubParams {
  comment_id: number
}

export interface ListPRCommentsParams extends BaseGitHubParams {
  pullNumber: number
  sort?: 'created' | 'updated'
  direction?: 'asc' | 'desc'
  since?: string
  per_page?: number
  page?: number
}

// Branch operation parameters
export interface ListBranchesParams extends BaseGitHubParams {
  protected?: boolean
  per_page?: number
  page?: number
}

export interface GetBranchParams extends BaseGitHubParams {
  branch: string
}

export interface CreateBranchParams extends BaseGitHubParams {
  branch: string
  sha: string // commit SHA to point to
}

export interface DeleteBranchParams extends BaseGitHubParams {
  branch: string
}

export interface GetBranchProtectionParams extends BaseGitHubParams {
  branch: string
}

export interface UpdateBranchProtectionParams extends BaseGitHubParams {
  branch: string
  required_status_checks: {
    strict: boolean
    contexts: string[]
  } | null
  enforce_admins: boolean
  required_pull_request_reviews: {
    required_approving_review_count?: number
    dismiss_stale_reviews?: boolean
    require_code_owner_reviews?: boolean
  } | null
  restrictions: {
    users: string[]
    teams: string[]
  } | null
}

// Issue comment response metadata
interface IssueCommentMetadata {
  id: number
  html_url: string
  body: string
  created_at: string
  updated_at: string
  user: {
    login: string
    id: number
  }
}

interface CommentsListMetadata {
  comments: Array<{
    id: number
    body: string
    user: { login: string }
    created_at: string
    html_url: string
  }>
  total_count: number
}

// Response types for new tools
export interface IssueCommentResponse extends ToolResponse {
  output: {
    content: string
    metadata: IssueCommentMetadata
  }
}

export interface CommentsListResponse extends ToolResponse {
  output: {
    content: string
    metadata: CommentsListMetadata
  }
}

export interface DeleteCommentResponse extends ToolResponse {
  output: {
    content: string
    metadata: {
      deleted: boolean
      comment_id: number
    }
  }
}

// New PR operation response types
export interface PRResponse extends ToolResponse {
  output: {
    content: string
    metadata: PRMetadata
  }
}

export interface MergeResultResponse extends ToolResponse {
  output: {
    content: string
    metadata: MergeResultMetadata
  }
}

export interface PRListResponse extends ToolResponse {
  output: {
    content: string
    metadata: PRListMetadata
  }
}

export interface PRFilesListResponse extends ToolResponse {
  output: {
    content: string
    metadata: PRFilesListMetadata
  }
}

export interface ReviewersResponse extends ToolResponse {
  output: {
    content: string
    metadata: ReviewersMetadata
  }
}

// Branch response metadata
interface BranchMetadata {
  name: string
  commit: {
    sha: string
    url: string
  }
  protected: boolean
}

interface BranchListMetadata {
  branches: Array<{
    name: string
    commit: {
      sha: string
      url: string
    }
    protected: boolean
  }>
  total_count: number
}

interface BranchProtectionMetadata {
  required_status_checks: {
    strict: boolean
    contexts: string[]
  } | null
  enforce_admins: {
    enabled: boolean
  }
  required_pull_request_reviews: {
    required_approving_review_count: number
    dismiss_stale_reviews: boolean
    require_code_owner_reviews: boolean
  } | null
  restrictions: {
    users: string[]
    teams: string[]
  } | null
}

interface RefMetadata {
  ref: string
  url: string
  sha: string
}

interface DeleteBranchMetadata {
  deleted: boolean
  branch: string
}

// Branch response types
export interface BranchResponse extends ToolResponse {
  output: {
    content: string
    metadata: BranchMetadata
  }
}

export interface BranchListResponse extends ToolResponse {
  output: {
    content: string
    metadata: BranchListMetadata
  }
}

export interface BranchProtectionResponse extends ToolResponse {
  output: {
    content: string
    metadata: BranchProtectionMetadata
  }
}

export interface RefResponse extends ToolResponse {
  output: {
    content: string
    metadata: RefMetadata
  }
}

export interface DeleteBranchResponse extends ToolResponse {
  output: {
    content: string
    metadata: DeleteBranchMetadata
  }
}

// GitHub Projects V2 parameters
export interface ListProjectsParams {
  owner_type: 'org' | 'user'
  owner_login: string
  apiKey: string
}

export interface GetProjectParams {
  owner_type: 'org' | 'user'
  owner_login: string
  project_number: number
  apiKey: string
}

export interface CreateProjectParams {
  owner_id: string // Node ID
  title: string
  apiKey: string
}

export interface UpdateProjectParams {
  project_id: string // Node ID
  title?: string
  shortDescription?: string
  project_public?: boolean
  closed?: boolean
  apiKey: string
}

export interface DeleteProjectParams {
  project_id: string
  apiKey: string
}

// GitHub Projects V2 response metadata
interface ProjectMetadata {
  id: string
  title: string
  number?: number
  url: string
  closed?: boolean
  public?: boolean
  shortDescription?: string
}

// GitHub Projects V2 response types
export interface ListProjectsResponse extends ToolResponse {
  output: {
    content: string
    metadata: {
      projects: ProjectMetadata[]
      totalCount: number
    }
  }
}

export interface ProjectResponse extends ToolResponse {
  output: {
    content: string
    metadata: ProjectMetadata
  }
}

// Workflow operation parameters
export interface ListWorkflowsParams extends BaseGitHubParams {
  per_page?: number
  page?: number
}

export interface GetWorkflowParams extends BaseGitHubParams {
  workflow_id: number | string
}

export interface TriggerWorkflowParams extends BaseGitHubParams {
  workflow_id: number | string
  ref: string // branch or tag name
  inputs?: Record<string, string>
}

export interface ListWorkflowRunsParams extends BaseGitHubParams {
  actor?: string
  branch?: string
  event?: string
  status?: string
  per_page?: number
  page?: number
}

export interface GetWorkflowRunParams extends BaseGitHubParams {
  run_id: number
}

export interface CancelWorkflowRunParams extends BaseGitHubParams {
  run_id: number
}

export interface RerunWorkflowParams extends BaseGitHubParams {
  run_id: number
  enable_debug_logging?: boolean
}

// Workflow response metadata interfaces
interface WorkflowMetadata {
  id: number
  name: string
  path: string
  state: string
  badge_url: string
}

interface WorkflowRunMetadata {
  id: number
  name: string
  status: string
  conclusion: string
  html_url: string
  run_number: number
}

interface ListWorkflowsMetadata {
  total_count: number
  workflows: Array<{
    id: number
    name: string
    path: string
    state: string
    badge_url: string
  }>
}

interface ListWorkflowRunsMetadata {
  total_count: number
  workflow_runs: Array<{
    id: number
    name: string
    status: string
    conclusion: string
    html_url: string
    run_number: number
  }>
}

// Workflow response types
export interface WorkflowResponse extends ToolResponse {
  output: {
    content: string
    metadata: WorkflowMetadata
  }
}

export interface WorkflowRunResponse extends ToolResponse {
  output: {
    content: string
    metadata: WorkflowRunMetadata
  }
}

export interface ListWorkflowsResponse extends ToolResponse {
  output: {
    content: string
    metadata: ListWorkflowsMetadata
  }
}

export interface ListWorkflowRunsResponse extends ToolResponse {
  output: {
    content: string
    metadata: ListWorkflowRunsMetadata
  }
}

export interface TriggerWorkflowResponse extends ToolResponse {
  output: {
    content: string
    metadata: Record<string, never>
  }
}

export interface CancelWorkflowRunResponse extends ToolResponse {
  output: {
    content: string
    metadata: {
      run_id: number
      status: string
    }
  }
}

export interface RerunWorkflowResponse extends ToolResponse {
  output: {
    content: string
    metadata: {
      run_id: number
      status: string
    }
  }
}

export type GitHubResponse =
  | PullRequestResponse
  | CreateCommentResponse
  | LatestCommitResponse
  | RepoInfoResponse
  | IssueCommentResponse
  | CommentsListResponse
  | DeleteCommentResponse
  | PRResponse
  | MergeResultResponse
  | PRListResponse
  | PRFilesListResponse
  | ReviewersResponse
  | ListProjectsResponse
  | ProjectResponse
  | BranchResponse
  | BranchListResponse
  | BranchProtectionResponse
  | RefResponse
  | DeleteBranchResponse
  | WorkflowResponse
  | WorkflowRunResponse
  | ListWorkflowsResponse
  | ListWorkflowRunsResponse
  | TriggerWorkflowResponse
  | CancelWorkflowRunResponse
  | RerunWorkflowResponse
  | IssueResponse
  | IssuesListResponse
  | LabelsResponse

// Release operation parameters
export interface CreateReleaseParams extends BaseGitHubParams {
  tag_name: string
  target_commitish?: string
  name?: string
  body?: string
  draft?: boolean
  prerelease?: boolean
}

export interface UpdateReleaseParams extends BaseGitHubParams {
  release_id: number
  tag_name?: string
  target_commitish?: string
  name?: string
  body?: string
  draft?: boolean
  prerelease?: boolean
}

export interface ListReleasesParams extends BaseGitHubParams {
  per_page?: number
  page?: number
}

export interface GetReleaseParams extends BaseGitHubParams {
  release_id: number
}

export interface DeleteReleaseParams extends BaseGitHubParams {
  release_id: number
}

// Release metadata interface
interface ReleaseMetadata {
  id: number
  tag_name: string
  name: string
  html_url: string
  tarball_url: string
  zipball_url: string
  draft: boolean
  prerelease: boolean
  created_at: string
  published_at: string
}

// Response types for releases
export interface ReleaseResponse extends ToolResponse {
  output: {
    content: string
    metadata: ReleaseMetadata
  }
}

export interface ListReleasesResponse extends ToolResponse {
  output: {
    content: string
    metadata: {
      total_count: number
      releases: Array<ReleaseMetadata>
    }
  }
}

export interface DeleteReleaseResponse extends ToolResponse {
  output: {
    content: string
    metadata: {
      deleted: boolean
      release_id: number
    }
  }
}

// Issue operation parameters
export interface CreateIssueParams extends BaseGitHubParams {
  title: string
  body?: string
  assignees?: string
  labels?: string
  milestone?: number
}

export interface UpdateIssueParams extends BaseGitHubParams {
  issue_number: number
  title?: string
  body?: string
  state?: 'open' | 'closed'
  labels?: string[]
  assignees?: string[]
}

export interface ListIssuesParams extends BaseGitHubParams {
  state?: 'open' | 'closed' | 'all'
  assignee?: string
  creator?: string
  labels?: string
  sort?: 'created' | 'updated' | 'comments'
  direction?: 'asc' | 'desc'
  per_page?: number
  page?: number
}

export interface GetIssueParams extends BaseGitHubParams {
  issue_number: number
}

export interface CloseIssueParams extends BaseGitHubParams {
  issue_number: number
  state_reason?: 'completed' | 'not_planned'
}

export interface AddLabelsParams extends BaseGitHubParams {
  issue_number: number
  labels: string
}

export interface RemoveLabelParams extends BaseGitHubParams {
  issue_number: number
  name: string
}

export interface AddAssigneesParams extends BaseGitHubParams {
  issue_number: number
  assignees: string
}

// Issue response metadata
interface IssueMetadata {
  number: number
  title: string
  state: string
  html_url: string
  labels: string[]
  assignees: string[]
  created_at?: string
  updated_at?: string
  closed_at?: string
  body?: string
}

interface IssuesListMetadata {
  issues: Array<{
    number: number
    title: string
    state: string
    html_url: string
    labels: string[]
    assignees: string[]
    created_at: string
    updated_at: string
  }>
  total_count: number
  page?: number
}

interface LabelsMetadata {
  labels: string[]
  issue_number: number
  html_url: string
}

// Issue response types
export interface IssueResponse extends ToolResponse {
  output: {
    content: string
    metadata: IssueMetadata
  }
}

export interface IssuesListResponse extends ToolResponse {
  output: {
    content: string
    metadata: IssuesListMetadata
  }
}

export interface LabelsResponse extends ToolResponse {
  output: {
    content: string
    metadata: LabelsMetadata
  }
}

export interface GetFileContentParams extends BaseGitHubParams {
  path: string
  ref?: string // branch, tag, or commit SHA
}

export interface CreateFileParams extends BaseGitHubParams {
  path: string
  message: string
  content: string // Plain text (will be Base64 encoded internally)
  branch?: string
}

export interface UpdateFileParams extends BaseGitHubParams {
  path: string
  message: string
  content: string // Plain text (will be Base64 encoded internally)
  sha: string // Required for update
  branch?: string
}

export interface DeleteFileParams extends BaseGitHubParams {
  path: string
  message: string
  sha: string // Required
  branch?: string
}

export interface GetTreeParams extends BaseGitHubParams {
  path?: string
  ref?: string
}

// File/Content metadata interfaces
export interface FileContentMetadata {
  name: string
  path: string
  sha: string
  size: number
  type: 'file' | 'dir'
  download_url?: string
  html_url?: string
}

export interface FileCommitMetadata {
  sha: string
  message: string
  author: {
    name: string
    email: string
    date: string
  }
  committer: {
    name: string
    email: string
    date: string
  }
  html_url: string
}

export interface TreeItemMetadata {
  name: string
  path: string
  sha: string
  size: number
  type: 'file' | 'dir' | 'symlink' | 'submodule'
  download_url?: string
  html_url?: string
}

// Response types
export interface FileContentResponse extends ToolResponse {
  output: {
    content: string
    metadata: FileContentMetadata
  }
}

export interface FileOperationResponse extends ToolResponse {
  output: {
    content: string
    metadata: {
      file: FileContentMetadata
      commit: FileCommitMetadata
    }
  }
}

export interface DeleteFileResponse extends ToolResponse {
  output: {
    content: string
    metadata: {
      deleted: boolean
      path: string
      commit: FileCommitMetadata
    }
  }
}

export interface TreeResponse extends ToolResponse {
  output: {
    content: string
    metadata: {
      path: string
      items: TreeItemMetadata[]
      total_count: number
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: update_branch_protection.ts]---
Location: sim-main/apps/sim/tools/github/update_branch_protection.ts

```typescript
import type { BranchProtectionResponse, UpdateBranchProtectionParams } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const updateBranchProtectionTool: ToolConfig<
  UpdateBranchProtectionParams,
  BranchProtectionResponse
> = {
  id: 'github_update_branch_protection',
  name: 'GitHub Update Branch Protection',
  description:
    'Update branch protection rules for a specific branch, including status checks, review requirements, admin enforcement, and push restrictions.',
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
      required: true,
      visibility: 'user-or-llm',
      description: 'Branch name',
    },
    required_status_checks: {
      type: 'object',
      required: true,
      visibility: 'user-or-llm',
      description:
        'Required status check configuration (null to disable). Object with strict (boolean) and contexts (string array)',
    },
    enforce_admins: {
      type: 'boolean',
      required: true,
      visibility: 'user-or-llm',
      description: 'Whether to enforce restrictions for administrators',
    },
    required_pull_request_reviews: {
      type: 'object',
      required: true,
      visibility: 'user-or-llm',
      description:
        'PR review requirements (null to disable). Object with optional required_approving_review_count, dismiss_stale_reviews, require_code_owner_reviews',
    },
    restrictions: {
      type: 'object',
      required: true,
      visibility: 'user-or-llm',
      description:
        'Push restrictions (null to disable). Object with users (string array) and teams (string array)',
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
      `https://api.github.com/repos/${params.owner}/${params.repo}/branches/${params.branch}/protection`,
    method: 'PUT',
    headers: (params) => ({
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${params.apiKey}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: any = {
        required_status_checks: params.required_status_checks,
        enforce_admins: params.enforce_admins,
        required_pull_request_reviews: params.required_pull_request_reviews,
        restrictions: params.restrictions,
      }

      return body
    },
  },

  transformResponse: async (response) => {
    const protection = await response.json()

    let content = `Branch Protection updated successfully for "${protection.url.split('/branches/')[1].split('/protection')[0]}":

Enforce Admins: ${protection.enforce_admins?.enabled ? 'Yes' : 'No'}`

    if (protection.required_status_checks) {
      content += `\n\nRequired Status Checks:
- Strict: ${protection.required_status_checks.strict}
- Contexts: ${protection.required_status_checks.contexts.length > 0 ? protection.required_status_checks.contexts.join(', ') : 'None'}`
    } else {
      content += '\n\nRequired Status Checks: Disabled'
    }

    if (protection.required_pull_request_reviews) {
      content += `\n\nRequired Pull Request Reviews:
- Required Approving Reviews: ${protection.required_pull_request_reviews.required_approving_review_count || 0}
- Dismiss Stale Reviews: ${protection.required_pull_request_reviews.dismiss_stale_reviews ? 'Yes' : 'No'}
- Require Code Owner Reviews: ${protection.required_pull_request_reviews.require_code_owner_reviews ? 'Yes' : 'No'}`
    } else {
      content += '\n\nRequired Pull Request Reviews: Disabled'
    }

    if (protection.restrictions) {
      const users = protection.restrictions.users?.map((u: any) => u.login) || []
      const teams = protection.restrictions.teams?.map((t: any) => t.slug) || []
      content += `\n\nRestrictions:
- Users: ${users.length > 0 ? users.join(', ') : 'None'}
- Teams: ${teams.length > 0 ? teams.join(', ') : 'None'}`
    } else {
      content += '\n\nRestrictions: Disabled'
    }

    return {
      success: true,
      output: {
        content,
        metadata: {
          required_status_checks: protection.required_status_checks
            ? {
                strict: protection.required_status_checks.strict,
                contexts: protection.required_status_checks.contexts,
              }
            : null,
          enforce_admins: {
            enabled: protection.enforce_admins?.enabled || false,
          },
          required_pull_request_reviews: protection.required_pull_request_reviews
            ? {
                required_approving_review_count:
                  protection.required_pull_request_reviews.required_approving_review_count || 0,
                dismiss_stale_reviews:
                  protection.required_pull_request_reviews.dismiss_stale_reviews || false,
                require_code_owner_reviews:
                  protection.required_pull_request_reviews.require_code_owner_reviews || false,
              }
            : null,
          restrictions: protection.restrictions
            ? {
                users: protection.restrictions.users?.map((u: any) => u.login) || [],
                teams: protection.restrictions.teams?.map((t: any) => t.slug) || [],
              }
            : null,
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Human-readable branch protection update summary' },
    metadata: {
      type: 'object',
      description: 'Updated branch protection configuration',
      properties: {
        required_status_checks: {
          type: 'object',
          description: 'Status check requirements (null if disabled)',
          properties: {
            strict: { type: 'boolean', description: 'Require branches to be up to date' },
            contexts: {
              type: 'array',
              description: 'Required status check contexts',
              items: { type: 'string' },
            },
          },
        },
        enforce_admins: {
          type: 'object',
          description: 'Admin enforcement settings',
          properties: {
            enabled: { type: 'boolean', description: 'Enforce for administrators' },
          },
        },
        required_pull_request_reviews: {
          type: 'object',
          description: 'Pull request review requirements (null if disabled)',
          properties: {
            required_approving_review_count: {
              type: 'number',
              description: 'Number of approving reviews required',
            },
            dismiss_stale_reviews: {
              type: 'boolean',
              description: 'Dismiss stale pull request approvals',
            },
            require_code_owner_reviews: {
              type: 'boolean',
              description: 'Require review from code owners',
            },
          },
        },
        restrictions: {
          type: 'object',
          description: 'Push restrictions (null if disabled)',
          properties: {
            users: {
              type: 'array',
              description: 'Users who can push',
              items: { type: 'string' },
            },
            teams: {
              type: 'array',
              description: 'Teams who can push',
              items: { type: 'string' },
            },
          },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_comment.ts]---
Location: sim-main/apps/sim/tools/github/update_comment.ts

```typescript
import type { IssueCommentResponse, UpdateCommentParams } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const updateCommentTool: ToolConfig<UpdateCommentParams, IssueCommentResponse> = {
  id: 'github_update_comment',
  name: 'GitHub Comment Updater',
  description: 'Update an existing comment on a GitHub issue or pull request',
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
    comment_id: {
      type: 'number',
      required: true,
      visibility: 'user-or-llm',
      description: 'Comment ID',
    },
    body: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Updated comment content',
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
      `https://api.github.com/repos/${params.owner}/${params.repo}/issues/comments/${params.comment_id}`,
    method: 'PATCH',
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

    const content = `Comment #${data.id} updated: "${data.body.substring(0, 100)}${data.body.length > 100 ? '...' : ''}"`

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
    content: { type: 'string', description: 'Human-readable update confirmation' },
    metadata: {
      type: 'object',
      description: 'Updated comment metadata',
      properties: {
        id: { type: 'number', description: 'Comment ID' },
        html_url: { type: 'string', description: 'GitHub web URL' },
        body: { type: 'string', description: 'Updated comment body' },
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

---[FILE: update_file.ts]---
Location: sim-main/apps/sim/tools/github/update_file.ts

```typescript
import type { FileOperationResponse, UpdateFileParams } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const updateFileTool: ToolConfig<UpdateFileParams, FileOperationResponse> = {
  id: 'github_update_file',
  name: 'GitHub Update File',
  description:
    'Update an existing file in a GitHub repository. Requires the file SHA. Content will be automatically Base64 encoded. Supports files up to 1MB.',
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
    path: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Path to the file to update (e.g., "src/index.ts")',
    },
    message: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Commit message for this file update',
    },
    content: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'New file content (plain text, will be Base64 encoded automatically)',
    },
    sha: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The blob SHA of the file being replaced (get from github_get_file_content)',
    },
    branch: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Branch to update the file in (defaults to repository default branch)',
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
      `https://api.github.com/repos/${params.owner}/${params.repo}/contents/${params.path}`,
    method: 'PUT',
    headers: (params) => ({
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${params.apiKey}`,
      'X-GitHub-Api-Version': '2022-11-28',
    }),
    body: (params) => {
      const base64Content = Buffer.from(params.content).toString('base64')

      const body: Record<string, any> = {
        message: params.message,
        content: base64Content,
        sha: params.sha, // Required for update
      }

      if (params.branch) {
        body.branch = params.branch
      }

      return body
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    const content = `File updated successfully!

Path: ${data.content.path}
Name: ${data.content.name}
Size: ${data.content.size} bytes
New SHA: ${data.content.sha}

Commit:
- SHA: ${data.commit.sha}
- Message: ${data.commit.message}
- Author: ${data.commit.author.name}
- Date: ${data.commit.author.date}

View file: ${data.content.html_url}`

    return {
      success: true,
      output: {
        content,
        metadata: {
          file: {
            name: data.content.name,
            path: data.content.path,
            sha: data.content.sha,
            size: data.content.size,
            type: data.content.type,
            download_url: data.content.download_url,
            html_url: data.content.html_url,
          },
          commit: {
            sha: data.commit.sha,
            message: data.commit.message,
            author: {
              name: data.commit.author.name,
              email: data.commit.author.email,
              date: data.commit.author.date,
            },
            committer: {
              name: data.commit.committer.name,
              email: data.commit.committer.email,
              date: data.commit.committer.date,
            },
            html_url: data.commit.html_url,
          },
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Human-readable file update confirmation' },
    metadata: {
      type: 'object',
      description: 'Updated file and commit metadata',
      properties: {
        file: {
          type: 'object',
          description: 'Updated file information',
          properties: {
            name: { type: 'string', description: 'File name' },
            path: { type: 'string', description: 'Full path in repository' },
            sha: { type: 'string', description: 'New git blob SHA' },
            size: { type: 'number', description: 'File size in bytes' },
            type: { type: 'string', description: 'Content type' },
            download_url: { type: 'string', description: 'Direct download URL' },
            html_url: { type: 'string', description: 'GitHub web UI URL' },
          },
        },
        commit: {
          type: 'object',
          description: 'Commit information',
          properties: {
            sha: { type: 'string', description: 'Commit SHA' },
            message: { type: 'string', description: 'Commit message' },
            author: {
              type: 'object',
              description: 'Author information',
            },
            committer: {
              type: 'object',
              description: 'Committer information',
            },
            html_url: { type: 'string', description: 'Commit URL' },
          },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

````
