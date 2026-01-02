---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 670
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 670 of 933)

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

---[FILE: execute.ts]---
Location: sim-main/apps/sim/tools/function/execute.ts

```typescript
import { DEFAULT_EXECUTION_TIMEOUT_MS } from '@/lib/execution/constants'
import { DEFAULT_CODE_LANGUAGE } from '@/lib/execution/languages'
import type { CodeExecutionInput, CodeExecutionOutput } from '@/tools/function/types'
import type { ToolConfig } from '@/tools/types'

export const functionExecuteTool: ToolConfig<CodeExecutionInput, CodeExecutionOutput> = {
  id: 'function_execute',
  name: 'Function Execute',
  description:
    'Execute JavaScript code. fetch() is available. Code runs in async IIFE wrapper automatically. CRITICAL: Write plain statements with await/return, NOT wrapped in functions. Example for API call: const res = await fetch(url); const data = await res.json(); return data;',
  version: '1.0.0',

  params: {
    code: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description:
        'Raw JavaScript statements (NOT a function). Code is auto-wrapped in async context. MUST use fetch() for HTTP (NOT xhr/axios/request libs). Write like: await fetch(url) then return result. NO import/require statements.',
    },
    language: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Language to execute (javascript or python)',
      default: DEFAULT_CODE_LANGUAGE,
    },
    timeout: {
      type: 'number',
      required: false,
      visibility: 'hidden',
      description: 'Execution timeout in milliseconds',
      default: DEFAULT_EXECUTION_TIMEOUT_MS,
    },
    envVars: {
      type: 'object',
      required: false,
      visibility: 'hidden',
      description: 'Environment variables to make available during execution',
      default: {},
    },
    blockData: {
      type: 'object',
      required: false,
      visibility: 'hidden',
      description: 'Block output data for variable resolution',
      default: {},
    },
    blockNameMapping: {
      type: 'object',
      required: false,
      visibility: 'hidden',
      description: 'Mapping of block names to block IDs',
      default: {},
    },
    workflowVariables: {
      type: 'object',
      required: false,
      visibility: 'hidden',
      description: 'Workflow variables for <variable.name> resolution',
      default: {},
    },
  },

  request: {
    url: '/api/function/execute',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params: CodeExecutionInput) => {
      const codeContent = Array.isArray(params.code)
        ? params.code.map((c: { content: string }) => c.content).join('\n')
        : params.code

      return {
        code: codeContent,
        language: params.language || DEFAULT_CODE_LANGUAGE,
        timeout: params.timeout || DEFAULT_EXECUTION_TIMEOUT_MS,
        envVars: params.envVars || {},
        workflowVariables: params.workflowVariables || {},
        blockData: params.blockData || {},
        blockNameMapping: params.blockNameMapping || {},
        workflowId: params._context?.workflowId,
        isCustomTool: params.isCustomTool || false,
      }
    },
  },

  transformResponse: async (response: Response): Promise<CodeExecutionOutput> => {
    const result = await response.json()

    return {
      success: true,
      output: {
        result: result.output.result,
        stdout: result.output.stdout,
      },
    }
  },

  outputs: {
    result: { type: 'string', description: 'The result of the code execution' },
    stdout: { type: 'string', description: 'The standard output of the code execution' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/function/index.ts

```typescript
import { functionExecuteTool } from '@/tools/function/execute'

export { functionExecuteTool }
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/function/types.ts

```typescript
import type { CodeLanguage } from '@/lib/execution/languages'
import type { ToolResponse } from '@/tools/types'

export interface CodeExecutionInput {
  code: Array<{ content: string; id: string }> | string
  language?: CodeLanguage
  useLocalVM?: boolean
  timeout?: number
  memoryLimit?: number
  envVars?: Record<string, string>
  workflowVariables?: Record<string, unknown>
  blockData?: Record<string, unknown>
  blockNameMapping?: Record<string, string>
  _context?: {
    workflowId?: string
  }
  isCustomTool?: boolean
}

export interface CodeExecutionOutput extends ToolResponse {
  output: {
    result: any
    stdout: string
  }
}
```

--------------------------------------------------------------------------------

---[FILE: add_assignees.ts]---
Location: sim-main/apps/sim/tools/github/add_assignees.ts

```typescript
import type { AddAssigneesParams, IssueResponse } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const addAssigneesTool: ToolConfig<AddAssigneesParams, IssueResponse> = {
  id: 'github_add_assignees',
  name: 'GitHub Add Assignees',
  description: 'Add assignees to an issue in a GitHub repository',
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
    assignees: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Comma-separated list of usernames to assign to the issue',
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
      `https://api.github.com/repos/${params.owner}/${params.repo}/issues/${params.issue_number}/assignees`,
    method: 'POST',
    headers: (params) => ({
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${params.apiKey}`,
      'X-GitHub-Api-Version': '2022-11-28',
    }),
    body: (params) => {
      const assigneesArray = params.assignees
        .split(',')
        .map((a) => a.trim())
        .filter((a) => a)
      return {
        assignees: assigneesArray,
      }
    },
  },

  transformResponse: async (response) => {
    const issue = await response.json()
    const labels = issue.labels?.map((label: any) => label.name) || []
    const assignees = issue.assignees?.map((assignee: any) => assignee.login) || []
    const content = `Assignees added to issue #${issue.number}: "${issue.title}"
All assignees: ${assignees.join(', ')}
URL: ${issue.html_url}`

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
          body: issue.body,
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Human-readable assignees confirmation' },
    metadata: {
      type: 'object',
      description: 'Updated issue metadata with assignees',
      properties: {
        number: { type: 'number', description: 'Issue number' },
        title: { type: 'string', description: 'Issue title' },
        state: { type: 'string', description: 'Issue state (open/closed)' },
        html_url: { type: 'string', description: 'GitHub web URL' },
        labels: { type: 'array', description: 'Array of label names' },
        assignees: { type: 'array', description: 'All assignees on the issue' },
        created_at: { type: 'string', description: 'Creation timestamp' },
        updated_at: { type: 'string', description: 'Last update timestamp' },
        body: { type: 'string', description: 'Issue body/description' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: add_labels.ts]---
Location: sim-main/apps/sim/tools/github/add_labels.ts

```typescript
import type { AddLabelsParams, LabelsResponse } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const addLabelsTool: ToolConfig<AddLabelsParams, LabelsResponse> = {
  id: 'github_add_labels',
  name: 'GitHub Add Labels',
  description: 'Add labels to an issue in a GitHub repository',
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
    labels: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Comma-separated list of label names to add to the issue',
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
      `https://api.github.com/repos/${params.owner}/${params.repo}/issues/${params.issue_number}/labels`,
    method: 'POST',
    headers: (params) => ({
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${params.apiKey}`,
      'X-GitHub-Api-Version': '2022-11-28',
    }),
    body: (params) => {
      const labelsArray = params.labels
        .split(',')
        .map((l) => l.trim())
        .filter((l) => l)
      return {
        labels: labelsArray,
      }
    },
  },

  transformResponse: async (response) => {
    const labelsData = await response.json()

    const labels = labelsData.map((label: any) => label.name)

    const content = `Labels added to issue successfully!
All labels on issue: ${labels.join(', ')}`

    return {
      success: true,
      output: {
        content,
        metadata: {
          labels,
          issue_number: 0, // Will be filled from params in actual implementation
          html_url: '', // Will be constructed from params
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Human-readable labels confirmation' },
    metadata: {
      type: 'object',
      description: 'Labels metadata',
      properties: {
        labels: { type: 'array', description: 'All labels currently on the issue' },
        issue_number: { type: 'number', description: 'Issue number' },
        html_url: { type: 'string', description: 'GitHub issue URL' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: cancel_workflow_run.ts]---
Location: sim-main/apps/sim/tools/github/cancel_workflow_run.ts

```typescript
import type { CancelWorkflowRunParams, CancelWorkflowRunResponse } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const cancelWorkflowRunTool: ToolConfig<CancelWorkflowRunParams, CancelWorkflowRunResponse> =
  {
    id: 'github_cancel_workflow_run',
    name: 'GitHub Cancel Workflow Run',
    description:
      'Cancel a workflow run. Returns 202 Accepted if cancellation is initiated, or 409 Conflict if the run cannot be cancelled (already completed).',
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
        description: 'Workflow run ID to cancel',
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
        `https://api.github.com/repos/${params.owner}/${params.repo}/actions/runs/${params.run_id}/cancel`,
      method: 'POST',
      headers: (params) => ({
        Accept: 'application/vnd.github+json',
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
              run_id: 0,
              status: 'error',
            },
          },
        }
      }

      if (response.status === 202) {
        const content = `Workflow run #${params.run_id} cancellation initiated successfully.
The run will be cancelled shortly.`

        return {
          success: true,
          output: {
            content,
            metadata: {
              run_id: params.run_id,
              status: 'cancellation_initiated',
            },
          },
        }
      }
      if (response.status === 409) {
        const content = `Cannot cancel workflow run #${params.run_id}.
The run may have already completed or been cancelled.`

        return {
          success: false,
          output: {
            content,
            metadata: {
              run_id: params.run_id,
              status: 'cannot_cancel',
            },
          },
        }
      }

      const content = `Workflow run #${params.run_id} cancellation request processed.`

      return {
        success: true,
        output: {
          content,
          metadata: {
            run_id: params.run_id,
            status: 'processed',
          },
        },
      }
    },

    outputs: {
      content: { type: 'string', description: 'Cancellation status message' },
      metadata: {
        type: 'object',
        description: 'Cancellation metadata',
        properties: {
          run_id: { type: 'number', description: 'Workflow run ID' },
          status: {
            type: 'string',
            description: 'Cancellation status (cancellation_initiated, cannot_cancel, processed)',
          },
        },
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: close_issue.ts]---
Location: sim-main/apps/sim/tools/github/close_issue.ts

```typescript
import type { CloseIssueParams, IssueResponse } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const closeIssueTool: ToolConfig<CloseIssueParams, IssueResponse> = {
  id: 'github_close_issue',
  name: 'GitHub Close Issue',
  description: 'Close an issue in a GitHub repository',
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
    state_reason: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Reason for closing: completed or not_planned',
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
      const body: any = {
        state: 'closed',
      }
      if (params.state_reason) {
        body.state_reason = params.state_reason
      }
      return body
    },
  },

  transformResponse: async (response) => {
    const issue = await response.json()

    const labels = issue.labels?.map((label: any) => label.name) || []

    const assignees = issue.assignees?.map((assignee: any) => assignee.login) || []

    const content = `Issue #${issue.number} closed: "${issue.title}"
State: ${issue.state}
${issue.state_reason ? `Reason: ${issue.state_reason}` : ''}
Closed at: ${issue.closed_at}
URL: ${issue.html_url}`

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
    content: { type: 'string', description: 'Human-readable issue close confirmation' },
    metadata: {
      type: 'object',
      description: 'Closed issue metadata',
      properties: {
        number: { type: 'number', description: 'Issue number' },
        title: { type: 'string', description: 'Issue title' },
        state: { type: 'string', description: 'Issue state (closed)' },
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

---[FILE: close_pr.ts]---
Location: sim-main/apps/sim/tools/github/close_pr.ts

```typescript
import type { ClosePRParams, PRResponse } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const closePRTool: ToolConfig<ClosePRParams, PRResponse> = {
  id: 'github_close_pr',
  name: 'GitHub Close Pull Request',
  description: 'Close a pull request in a GitHub repository',
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
    method: 'PATCH',
    headers: (params) => ({
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${params.apiKey}`,
      'X-GitHub-Api-Version': '2022-11-28',
    }),
    body: () => ({
      state: 'closed',
    }),
  },

  transformResponse: async (response) => {
    const pr = await response.json()

    const content = `PR #${pr.number} closed: "${pr.title}"
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
    content: { type: 'string', description: 'Human-readable PR close confirmation' },
    metadata: {
      type: 'object',
      description: 'Closed pull request metadata',
      properties: {
        number: { type: 'number', description: 'Pull request number' },
        title: { type: 'string', description: 'PR title' },
        state: { type: 'string', description: 'PR state (should be closed)' },
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

---[FILE: comment.ts]---
Location: sim-main/apps/sim/tools/github/comment.ts

```typescript
import type { CreateCommentParams, CreateCommentResponse } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const commentTool: ToolConfig<CreateCommentParams, CreateCommentResponse> = {
  id: 'github_comment',
  name: 'GitHub PR Commenter',
  description: 'Create comments on GitHub PRs',
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
    body: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Comment content',
    },
    pullNumber: {
      type: 'number',
      required: true,
      visibility: 'user-or-llm',
      description: 'Pull request number',
    },
    path: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'File path for review comment',
    },
    position: {
      type: 'number',
      required: false,
      visibility: 'hidden',
      description: 'Line number for review comment',
    },
    commentType: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Type of comment (pr_comment or file_comment)',
    },
    line: {
      type: 'number',
      required: false,
      visibility: 'hidden',
      description: 'Line number for review comment',
    },
    side: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description: 'Side of the diff (LEFT or RIGHT)',
      default: 'RIGHT',
    },
    commitId: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description: 'The SHA of the commit to comment on',
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
      if (params.path) {
        return `https://api.github.com/repos/${params.owner}/${params.repo}/pulls/${params.pullNumber}/comments`
      }
      return `https://api.github.com/repos/${params.owner}/${params.repo}/pulls/${params.pullNumber}/reviews`
    },
    method: 'POST',
    headers: (params) => ({
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${params.apiKey}`,
      'X-GitHub-Api-Version': '2022-11-28',
    }),
    body: (params) => {
      if (params.commentType === 'file_comment') {
        return {
          body: params.body,
          commit_id: params.commitId,
          path: params.path,
          line: params.line || params.position,
          side: params.side || 'RIGHT',
        }
      }
      return {
        body: params.body,
        event: 'COMMENT',
      }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    // Create a human-readable content string
    const content = `Comment created: "${data.body}"`

    return {
      success: true,
      output: {
        content,
        metadata: {
          id: data.id,
          html_url: data.html_url,
          created_at: data.created_at,
          updated_at: data.updated_at,
          path: data.path,
          line: data.line || data.position,
          side: data.side,
          commit_id: data.commit_id,
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Human-readable comment confirmation' },
    metadata: {
      type: 'object',
      description: 'Comment metadata',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_branch.ts]---
Location: sim-main/apps/sim/tools/github/create_branch.ts

```typescript
import type { CreateBranchParams, RefResponse } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const createBranchTool: ToolConfig<CreateBranchParams, RefResponse> = {
  id: 'github_create_branch',
  name: 'GitHub Create Branch',
  description:
    'Create a new branch in a GitHub repository by creating a git reference pointing to a specific commit SHA.',
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
      description: 'Name of the branch to create',
    },
    sha: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Commit SHA to point the branch to',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'GitHub Personal Access Token',
    },
  },

  request: {
    url: (params) => `https://api.github.com/repos/${params.owner}/${params.repo}/git/refs`,
    method: 'POST',
    headers: (params) => ({
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${params.apiKey}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      ref: `refs/heads/${params.branch}`,
      sha: params.sha,
    }),
  },

  transformResponse: async (response) => {
    const ref = await response.json()

    // Create a human-readable content string
    const content = `Branch created successfully:
Branch: ${ref.ref.replace('refs/heads/', '')}
SHA: ${ref.object.sha}
URL: ${ref.url}`

    return {
      success: true,
      output: {
        content,
        metadata: {
          ref: ref.ref,
          url: ref.url,
          sha: ref.object.sha,
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Human-readable branch creation confirmation' },
    metadata: {
      type: 'object',
      description: 'Git reference metadata',
      properties: {
        ref: { type: 'string', description: 'Full reference name (refs/heads/branch)' },
        url: { type: 'string', description: 'API URL for the reference' },
        sha: { type: 'string', description: 'Commit SHA the branch points to' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_file.ts]---
Location: sim-main/apps/sim/tools/github/create_file.ts

```typescript
import type { CreateFileParams, FileOperationResponse } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const createFileTool: ToolConfig<CreateFileParams, FileOperationResponse> = {
  id: 'github_create_file',
  name: 'GitHub Create File',
  description:
    'Create a new file in a GitHub repository. The file content will be automatically Base64 encoded. Supports files up to 1MB.',
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
      description: 'Path where the file will be created (e.g., "src/newfile.ts")',
    },
    message: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Commit message for this file creation',
    },
    content: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'File content (plain text, will be Base64 encoded automatically)',
    },
    branch: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Branch to create the file in (defaults to repository default branch)',
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
      }

      if (params.branch) {
        body.branch = params.branch
      }

      return body
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    const content = `File created successfully!

Path: ${data.content.path}
Name: ${data.content.name}
Size: ${data.content.size} bytes
SHA: ${data.content.sha}

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
    content: { type: 'string', description: 'Human-readable file creation confirmation' },
    metadata: {
      type: 'object',
      description: 'File and commit metadata',
      properties: {
        file: {
          type: 'object',
          description: 'Created file information',
          properties: {
            name: { type: 'string', description: 'File name' },
            path: { type: 'string', description: 'Full path in repository' },
            sha: { type: 'string', description: 'Git blob SHA' },
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

---[FILE: create_issue.ts]---
Location: sim-main/apps/sim/tools/github/create_issue.ts

```typescript
import type { CreateIssueParams, IssueResponse } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const createIssueTool: ToolConfig<CreateIssueParams, IssueResponse> = {
  id: 'github_create_issue',
  name: 'GitHub Create Issue',
  description: 'Create a new issue in a GitHub repository',
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
    title: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Issue title',
    },
    body: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Issue description/body',
    },
    assignees: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Comma-separated list of usernames to assign to this issue',
    },
    labels: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Comma-separated list of label names to add to this issue',
    },
    milestone: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Milestone number to associate with this issue',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'GitHub API token',
    },
  },

  request: {
    url: (params) => `https://api.github.com/repos/${params.owner}/${params.repo}/issues`,
    method: 'POST',
    headers: (params) => ({
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${params.apiKey}`,
      'X-GitHub-Api-Version': '2022-11-28',
    }),
    body: (params) => {
      const body: any = {
        title: params.title,
      }
      if (params.body) body.body = params.body
      if (params.assignees) {
        const assigneesArray = params.assignees
          .split(',')
          .map((a) => a.trim())
          .filter((a) => a)
        if (assigneesArray.length > 0) body.assignees = assigneesArray
      }
      if (params.labels) {
        const labelsArray = params.labels
          .split(',')
          .map((l) => l.trim())
          .filter((l) => l)
        if (labelsArray.length > 0) body.labels = labelsArray
      }
      if (params.milestone) body.milestone = params.milestone
      return body
    },
  },

  transformResponse: async (response) => {
    const issue = await response.json()

    const labels = issue.labels?.map((label: any) => label.name) || []

    const assignees = issue.assignees?.map((assignee: any) => assignee.login) || []

    const content = `Issue #${issue.number} created: "${issue.title}"
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
          body: issue.body,
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Human-readable issue creation confirmation' },
    metadata: {
      type: 'object',
      description: 'Issue metadata',
      properties: {
        number: { type: 'number', description: 'Issue number' },
        title: { type: 'string', description: 'Issue title' },
        state: { type: 'string', description: 'Issue state (open/closed)' },
        html_url: { type: 'string', description: 'GitHub web URL' },
        labels: { type: 'array', description: 'Array of label names' },
        assignees: { type: 'array', description: 'Array of assignee usernames' },
        created_at: { type: 'string', description: 'Creation timestamp' },
        updated_at: { type: 'string', description: 'Last update timestamp' },
        body: { type: 'string', description: 'Issue body/description' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

````
