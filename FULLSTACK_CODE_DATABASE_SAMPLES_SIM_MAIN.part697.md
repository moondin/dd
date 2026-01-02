---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 697
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 697 of 933)

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

---[FILE: add_comment.ts]---
Location: sim-main/apps/sim/tools/jira/add_comment.ts

```typescript
import type { JiraAddCommentParams, JiraAddCommentResponse } from '@/tools/jira/types'
import { getJiraCloudId } from '@/tools/jira/utils'
import type { ToolConfig } from '@/tools/types'

export const jiraAddCommentTool: ToolConfig<JiraAddCommentParams, JiraAddCommentResponse> = {
  id: 'jira_add_comment',
  name: 'Jira Add Comment',
  description: 'Add a comment to a Jira issue',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'jira',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token for Jira',
    },
    domain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Jira domain (e.g., yourcompany.atlassian.net)',
    },
    issueKey: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Jira issue key to add comment to (e.g., PROJ-123)',
    },
    body: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Comment body text',
    },
    cloudId: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description:
        'Jira Cloud ID for the instance. If not provided, it will be fetched using the domain.',
    },
  },

  request: {
    url: (params: JiraAddCommentParams) => {
      if (params.cloudId) {
        return `https://api.atlassian.com/ex/jira/${params.cloudId}/rest/api/3/issue/${params.issueKey}/comment`
      }
      return 'https://api.atlassian.com/oauth/token/accessible-resources'
    },
    method: (params: JiraAddCommentParams) => (params.cloudId ? 'POST' : 'GET'),
    headers: (params: JiraAddCommentParams) => {
      return {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
    body: (params: JiraAddCommentParams) => {
      if (!params.cloudId) return undefined as any
      return {
        body: {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: params?.body || '',
                },
              ],
            },
          ],
        },
      }
    },
  },

  transformResponse: async (response: Response, params?: JiraAddCommentParams) => {
    if (!params?.cloudId) {
      const cloudId = await getJiraCloudId(params!.domain, params!.accessToken)
      // Make the actual request with the resolved cloudId
      const commentUrl = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue/${params?.issueKey}/comment`
      const commentResponse = await fetch(commentUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${params?.accessToken}`,
        },
        body: JSON.stringify({
          body: {
            type: 'doc',
            version: 1,
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: params?.body || '',
                  },
                ],
              },
            ],
          },
        }),
      })

      if (!commentResponse.ok) {
        let message = `Failed to add comment to Jira issue (${commentResponse.status})`
        try {
          const err = await commentResponse.json()
          message = err?.errorMessages?.join(', ') || err?.message || message
        } catch (_e) {}
        throw new Error(message)
      }

      const data = await commentResponse.json()

      return {
        success: true,
        output: {
          ts: new Date().toISOString(),
          issueKey: params?.issueKey || 'unknown',
          commentId: data?.id || 'unknown',
          body: params?.body || '',
          success: true,
        },
      }
    }

    // If cloudId was provided, process the response
    if (!response.ok) {
      let message = `Failed to add comment to Jira issue (${response.status})`
      try {
        const err = await response.json()
        message = err?.errorMessages?.join(', ') || err?.message || message
      } catch (_e) {}
      throw new Error(message)
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        ts: new Date().toISOString(),
        issueKey: params?.issueKey || 'unknown',
        commentId: data?.id || 'unknown',
        body: params?.body || '',
        success: true,
      },
    }
  },

  outputs: {
    ts: { type: 'string', description: 'Timestamp of the operation' },
    issueKey: { type: 'string', description: 'Issue key the comment was added to' },
    commentId: { type: 'string', description: 'Created comment ID' },
    body: { type: 'string', description: 'Comment text content' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: add_watcher.ts]---
Location: sim-main/apps/sim/tools/jira/add_watcher.ts

```typescript
import { getJiraCloudId } from '@/tools/jira/utils'
import type { ToolConfig, ToolResponse } from '@/tools/types'

export interface JiraAddWatcherParams {
  accessToken: string
  domain: string
  issueKey: string
  accountId: string
  cloudId?: string
}

export interface JiraAddWatcherResponse extends ToolResponse {
  output: {
    ts: string
    issueKey: string
    watcherAccountId: string
    success: boolean
  }
}

export const jiraAddWatcherTool: ToolConfig<JiraAddWatcherParams, JiraAddWatcherResponse> = {
  id: 'jira_add_watcher',
  name: 'Jira Add Watcher',
  description: 'Add a watcher to a Jira issue to receive notifications about updates',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'jira',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token for Jira',
    },
    domain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Jira domain (e.g., yourcompany.atlassian.net)',
    },
    issueKey: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Jira issue key to add watcher to (e.g., PROJ-123)',
    },
    accountId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Account ID of the user to add as watcher',
    },
    cloudId: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description:
        'Jira Cloud ID for the instance. If not provided, it will be fetched using the domain.',
    },
  },

  request: {
    url: (params: JiraAddWatcherParams) => {
      if (params.cloudId) {
        return `https://api.atlassian.com/ex/jira/${params.cloudId}/rest/api/3/issue/${params.issueKey}/watchers`
      }
      return 'https://api.atlassian.com/oauth/token/accessible-resources'
    },
    method: (params: JiraAddWatcherParams) => (params.cloudId ? 'POST' : 'GET'),
    headers: (params: JiraAddWatcherParams) => {
      return {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
    body: (params: JiraAddWatcherParams) => {
      if (!params.cloudId) return undefined as any
      return params.accountId as any
    },
  },

  transformResponse: async (response: Response, params?: JiraAddWatcherParams) => {
    if (!params?.cloudId) {
      const cloudId = await getJiraCloudId(params!.domain, params!.accessToken)
      // Make the actual request with the resolved cloudId
      const watcherUrl = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue/${params?.issueKey}/watchers`
      const watcherResponse = await fetch(watcherUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${params?.accessToken}`,
        },
        body: JSON.stringify(params?.accountId),
      })

      if (!watcherResponse.ok) {
        let message = `Failed to add watcher to Jira issue (${watcherResponse.status})`
        try {
          const err = await watcherResponse.json()
          message = err?.errorMessages?.join(', ') || err?.message || message
        } catch (_e) {}
        throw new Error(message)
      }

      return {
        success: true,
        output: {
          ts: new Date().toISOString(),
          issueKey: params?.issueKey || 'unknown',
          watcherAccountId: params?.accountId || 'unknown',
          success: true,
        },
      }
    }

    // If cloudId was provided, process the response
    if (!response.ok) {
      let message = `Failed to add watcher to Jira issue (${response.status})`
      try {
        const err = await response.json()
        message = err?.errorMessages?.join(', ') || err?.message || message
      } catch (_e) {}
      throw new Error(message)
    }

    return {
      success: true,
      output: {
        ts: new Date().toISOString(),
        issueKey: params?.issueKey || 'unknown',
        watcherAccountId: params?.accountId || 'unknown',
        success: true,
      },
    }
  },

  outputs: {
    ts: { type: 'string', description: 'Timestamp of the operation' },
    issueKey: { type: 'string', description: 'Issue key' },
    watcherAccountId: { type: 'string', description: 'Added watcher account ID' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: add_worklog.ts]---
Location: sim-main/apps/sim/tools/jira/add_worklog.ts

```typescript
import type { JiraAddWorklogParams, JiraAddWorklogResponse } from '@/tools/jira/types'
import { getJiraCloudId } from '@/tools/jira/utils'
import type { ToolConfig } from '@/tools/types'

export const jiraAddWorklogTool: ToolConfig<JiraAddWorklogParams, JiraAddWorklogResponse> = {
  id: 'jira_add_worklog',
  name: 'Jira Add Worklog',
  description: 'Add a time tracking worklog entry to a Jira issue',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'jira',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token for Jira',
    },
    domain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Jira domain (e.g., yourcompany.atlassian.net)',
    },
    issueKey: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Jira issue key to add worklog to (e.g., PROJ-123)',
    },
    timeSpentSeconds: {
      type: 'number',
      required: true,
      visibility: 'user-or-llm',
      description: 'Time spent in seconds',
    },
    comment: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Optional comment for the worklog entry',
    },
    started: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Optional start time in ISO format (defaults to current time)',
    },
    cloudId: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description:
        'Jira Cloud ID for the instance. If not provided, it will be fetched using the domain.',
    },
  },

  request: {
    url: (params: JiraAddWorklogParams) => {
      if (params.cloudId) {
        return `https://api.atlassian.com/ex/jira/${params.cloudId}/rest/api/3/issue/${params.issueKey}/worklog`
      }
      return 'https://api.atlassian.com/oauth/token/accessible-resources'
    },
    method: (params: JiraAddWorklogParams) => (params.cloudId ? 'POST' : 'GET'),
    headers: (params: JiraAddWorklogParams) => {
      return {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
    body: (params: JiraAddWorklogParams) => {
      if (!params.cloudId) return undefined as any
      return {
        timeSpentSeconds: Number(params.timeSpentSeconds),
        comment: params.comment
          ? {
              type: 'doc',
              version: 1,
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: params.comment,
                    },
                  ],
                },
              ],
            }
          : undefined,
        started:
          (params.started ? params.started.replace(/Z$/, '+0000') : undefined) ||
          new Date().toISOString().replace(/Z$/, '+0000'),
      }
    },
  },

  transformResponse: async (response: Response, params?: JiraAddWorklogParams) => {
    if (!params?.cloudId) {
      if (!params?.timeSpentSeconds || params.timeSpentSeconds <= 0) {
        throw new Error('timeSpentSeconds is required and must be greater than 0')
      }
      const cloudId = await getJiraCloudId(params!.domain, params!.accessToken)
      // Make the actual request with the resolved cloudId
      const worklogUrl = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue/${params?.issueKey}/worklog`
      const worklogResponse = await fetch(worklogUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${params?.accessToken}`,
        },
        body: JSON.stringify({
          timeSpentSeconds: params?.timeSpentSeconds ? Number(params.timeSpentSeconds) : 0,
          comment: params?.comment
            ? {
                type: 'doc',
                version: 1,
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        type: 'text',
                        text: params.comment,
                      },
                    ],
                  },
                ],
              }
            : undefined,
          // Preserve milliseconds and convert trailing Z to +0000 as required by Jira examples
          started:
            (params?.started ? params.started.replace(/Z$/, '+0000') : undefined) ||
            new Date().toISOString().replace(/Z$/, '+0000'),
        }),
      })

      if (!worklogResponse.ok) {
        let message = `Failed to add worklog to Jira issue (${worklogResponse.status})`
        try {
          const err = await worklogResponse.json()
          message = err?.errorMessages?.join(', ') || err?.message || message
        } catch (_e) {}
        throw new Error(message)
      }

      const data = await worklogResponse.json()

      return {
        success: true,
        output: {
          ts: new Date().toISOString(),
          issueKey: params?.issueKey || 'unknown',
          worklogId: data?.id || 'unknown',
          timeSpentSeconds: params?.timeSpentSeconds ? Number(params.timeSpentSeconds) : 0 || 0,
          success: true,
        },
      }
    }

    // If cloudId was provided, process the response
    if (!response.ok) {
      let message = `Failed to add worklog to Jira issue (${response.status})`
      try {
        const err = await response.json()
        message = err?.errorMessages?.join(', ') || err?.message || message
      } catch (_e) {}
      throw new Error(message)
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        ts: new Date().toISOString(),
        issueKey: params?.issueKey || 'unknown',
        worklogId: data?.id || 'unknown',
        timeSpentSeconds: params?.timeSpentSeconds ? Number(params.timeSpentSeconds) : 0 || 0,
        success: true,
      },
    }
  },

  outputs: {
    ts: { type: 'string', description: 'Timestamp of the operation' },
    issueKey: { type: 'string', description: 'Issue key the worklog was added to' },
    worklogId: { type: 'string', description: 'Created worklog ID' },
    timeSpentSeconds: { type: 'number', description: 'Time spent in seconds' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: assign_issue.ts]---
Location: sim-main/apps/sim/tools/jira/assign_issue.ts

```typescript
import { getJiraCloudId } from '@/tools/jira/utils'
import type { ToolConfig, ToolResponse } from '@/tools/types'

export interface JiraAssignIssueParams {
  accessToken: string
  domain: string
  issueKey: string
  accountId: string
  cloudId?: string
}

export interface JiraAssignIssueResponse extends ToolResponse {
  output: {
    ts: string
    issueKey: string
    assigneeId: string
    success: boolean
  }
}

export const jiraAssignIssueTool: ToolConfig<JiraAssignIssueParams, JiraAssignIssueResponse> = {
  id: 'jira_assign_issue',
  name: 'Jira Assign Issue',
  description: 'Assign a Jira issue to a user',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'jira',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token for Jira',
    },
    domain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Jira domain (e.g., yourcompany.atlassian.net)',
    },
    issueKey: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Jira issue key to assign (e.g., PROJ-123)',
    },
    accountId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description:
        'Account ID of the user to assign the issue to. Use "-1" for automatic assignment or null to unassign.',
    },
    cloudId: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description:
        'Jira Cloud ID for the instance. If not provided, it will be fetched using the domain.',
    },
  },

  request: {
    url: (params: JiraAssignIssueParams) => {
      if (params.cloudId) {
        return `https://api.atlassian.com/ex/jira/${params.cloudId}/rest/api/3/issue/${params.issueKey}/assignee`
      }
      return 'https://api.atlassian.com/oauth/token/accessible-resources'
    },
    method: (params: JiraAssignIssueParams) => (params.cloudId ? 'PUT' : 'GET'),
    headers: (params: JiraAssignIssueParams) => {
      return {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
    body: (params: JiraAssignIssueParams) => {
      if (!params.cloudId) return undefined as any
      return {
        accountId: params.accountId === 'null' ? null : params.accountId,
      }
    },
  },

  transformResponse: async (response: Response, params?: JiraAssignIssueParams) => {
    if (!params?.cloudId) {
      const cloudId = await getJiraCloudId(params!.domain, params!.accessToken)
      const assignUrl = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue/${params!.issueKey}/assignee`
      const assignResponse = await fetch(assignUrl, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${params!.accessToken}`,
        },
        body: JSON.stringify({
          accountId: params!.accountId === 'null' ? null : params!.accountId,
        }),
      })

      if (!assignResponse.ok) {
        let message = `Failed to assign Jira issue (${assignResponse.status})`
        try {
          const err = await assignResponse.json()
          message = err?.errorMessages?.join(', ') || err?.message || message
        } catch (_e) {}
        throw new Error(message)
      }

      return {
        success: true,
        output: {
          ts: new Date().toISOString(),
          issueKey: params?.issueKey || 'unknown',
          assigneeId: params?.accountId || 'unknown',
          success: true,
        },
      }
    }

    if (!response.ok) {
      let message = `Failed to assign Jira issue (${response.status})`
      try {
        const err = await response.json()
        message = err?.errorMessages?.join(', ') || err?.message || message
      } catch (_e) {}
      throw new Error(message)
    }

    return {
      success: true,
      output: {
        ts: new Date().toISOString(),
        issueKey: params?.issueKey || 'unknown',
        assigneeId: params?.accountId || 'unknown',
        success: true,
      },
    }
  },

  outputs: {
    ts: { type: 'string', description: 'Timestamp of the operation' },
    issueKey: { type: 'string', description: 'Issue key that was assigned' },
    assigneeId: { type: 'string', description: 'Account ID of the assignee' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: bulk_read.ts]---
Location: sim-main/apps/sim/tools/jira/bulk_read.ts

```typescript
import type { JiraRetrieveBulkParams, JiraRetrieveResponseBulk } from '@/tools/jira/types'
import type { ToolConfig } from '@/tools/types'

export const jiraBulkRetrieveTool: ToolConfig<JiraRetrieveBulkParams, JiraRetrieveResponseBulk> = {
  id: 'jira_bulk_read',
  name: 'Jira Bulk Read',
  description: 'Retrieve multiple Jira issues in bulk',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'jira',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token for Jira',
    },
    domain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Jira domain (e.g., yourcompany.atlassian.net)',
    },
    projectId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Jira project ID',
    },
    cloudId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Jira cloud ID',
    },
  },

  request: {
    url: (params: JiraRetrieveBulkParams) => {
      // Always return accessible resources endpoint; transformResponse will build search URLs
      return 'https://api.atlassian.com/oauth/token/accessible-resources'
    },
    method: 'GET',
    headers: (params: JiraRetrieveBulkParams) => ({
      Authorization: `Bearer ${params.accessToken}`,
      Accept: 'application/json',
    }),
    body: (params: JiraRetrieveBulkParams) =>
      params.cloudId
        ? {
            jql: '', // Will be set in transformResponse when we know the resolved project key
            startAt: 0,
            maxResults: 100,
            fields: ['summary', 'description', 'created', 'updated'],
          }
        : {},
  },

  transformResponse: async (response: Response, params?: JiraRetrieveBulkParams) => {
    const MAX_TOTAL = 1000
    const PAGE_SIZE = 100

    // Helper to extract description text safely (ADF can be nested)
    const extractDescription = (desc: any): string => {
      try {
        return (
          desc?.content?.[0]?.content?.[0]?.text ||
          desc?.content?.flatMap((c: any) => c?.content || [])?.find((c: any) => c?.text)?.text ||
          ''
        )
      } catch (_e) {
        return ''
      }
    }

    // Helper to resolve a project reference (id or key) to its canonical key
    const resolveProjectKey = async (cloudId: string, accessToken: string, ref: string) => {
      const refTrimmed = (ref || '').trim()
      if (!refTrimmed) return refTrimmed
      const url = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/project/${encodeURIComponent(refTrimmed)}`
      const resp = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' },
      })
      if (!resp.ok) {
        // If can't resolve, fall back to original ref (JQL can still work with id or key)
        return refTrimmed
      }
      const project = await resp.json()
      return project?.key || refTrimmed
    }

    // If we don't have a cloudId, look it up first
    if (!params?.cloudId) {
      const accessibleResources = await response.json()
      const normalizedInput = `https://${params?.domain}`.toLowerCase()
      const matchedResource = accessibleResources.find(
        (r: any) => r.url.toLowerCase() === normalizedInput
      )

      const projectKey = await resolveProjectKey(
        matchedResource.id,
        params!.accessToken,
        params!.projectId
      )
      const jql = `project = ${projectKey} ORDER BY updated DESC`

      let startAt = 0
      let collected: any[] = []
      let total = 0

      while (startAt < MAX_TOTAL) {
        const queryParams = new URLSearchParams({
          jql,
          fields: 'summary,description,created,updated',
          maxResults: String(PAGE_SIZE),
        })
        if (startAt > 0) {
          queryParams.set('startAt', String(startAt))
        }
        const url = `https://api.atlassian.com/ex/jira/${matchedResource.id}/rest/api/3/search/jql?${queryParams.toString()}`
        const pageResponse = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${params?.accessToken}`,
            Accept: 'application/json',
          },
        })

        const pageData = await pageResponse.json()
        const issues = pageData.issues || []
        total = pageData.total || issues.length
        collected = collected.concat(issues)

        if (collected.length >= Math.min(total, MAX_TOTAL) || issues.length === 0) break
        startAt += PAGE_SIZE
      }

      return {
        success: true,
        output: collected.slice(0, MAX_TOTAL).map((issue: any) => ({
          ts: new Date().toISOString(),
          summary: issue.fields?.summary,
          description: extractDescription(issue.fields?.description),
          created: issue.fields?.created,
          updated: issue.fields?.updated,
        })),
      }
    }

    // cloudId present: resolve project and paginate using the Search API
    // Resolve to canonical project key for consistent JQL
    const projectKey = await resolveProjectKey(
      params!.cloudId!,
      params!.accessToken,
      params!.projectId
    )

    const jql = `project = ${projectKey} ORDER BY updated DESC`

    // Always do full pagination with resolved key
    let collected: any[] = []
    let total = 0
    let startAt = 0
    while (startAt < MAX_TOTAL) {
      const queryParams = new URLSearchParams({
        jql,
        fields: 'summary,description,created,updated',
        maxResults: String(PAGE_SIZE),
      })
      if (startAt > 0) {
        queryParams.set('startAt', String(startAt))
      }
      const url = `https://api.atlassian.com/ex/jira/${params?.cloudId}/rest/api/3/search/jql?${queryParams.toString()}`
      const pageResponse = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${params?.accessToken}`,
          Accept: 'application/json',
        },
      })
      const pageData = await pageResponse.json()
      const issues = pageData.issues || []
      total = pageData.total || issues.length
      collected = collected.concat(issues)
      if (issues.length === 0 || collected.length >= Math.min(total, MAX_TOTAL)) break
      startAt += PAGE_SIZE
    }

    return {
      success: true,
      output: collected.slice(0, MAX_TOTAL).map((issue: any) => ({
        ts: new Date().toISOString(),
        summary: issue.fields?.summary,
        description: extractDescription(issue.fields?.description),
        created: issue.fields?.created,
        updated: issue.fields?.updated,
      })),
    }
  },

  outputs: {
    issues: {
      type: 'array',
      description:
        'Array of Jira issues with ts, summary, description, created, and updated timestamps',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_issue_link.ts]---
Location: sim-main/apps/sim/tools/jira/create_issue_link.ts

```typescript
import { getJiraCloudId } from '@/tools/jira/utils'
import type { ToolConfig, ToolResponse } from '@/tools/types'

export interface JiraCreateIssueLinkParams {
  accessToken: string
  domain: string
  inwardIssueKey: string
  outwardIssueKey: string
  linkType: string
  comment?: string
  cloudId?: string
}

export interface JiraCreateIssueLinkResponse extends ToolResponse {
  output: {
    ts: string
    inwardIssue: string
    outwardIssue: string
    linkType: string
    linkId?: string
    success: boolean
  }
}

export const jiraCreateIssueLinkTool: ToolConfig<
  JiraCreateIssueLinkParams,
  JiraCreateIssueLinkResponse
> = {
  id: 'jira_create_issue_link',
  name: 'Jira Create Issue Link',
  description: 'Create a link relationship between two Jira issues',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'jira',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token for Jira',
    },
    domain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Jira domain (e.g., yourcompany.atlassian.net)',
    },
    inwardIssueKey: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Jira issue key for the inward issue (e.g., PROJ-123)',
    },
    outwardIssueKey: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Jira issue key for the outward issue (e.g., PROJ-456)',
    },
    linkType: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The type of link relationship (e.g., "Blocks", "Relates to", "Duplicates")',
    },
    comment: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Optional comment to add to the issue link',
    },
    cloudId: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description:
        'Jira Cloud ID for the instance. If not provided, it will be fetched using the domain.',
    },
  },

  request: {
    url: (_params: JiraCreateIssueLinkParams) => {
      // Always discover first; actual POST happens in transformResponse
      return 'https://api.atlassian.com/oauth/token/accessible-resources'
    },
    method: () => 'GET',
    headers: (params: JiraCreateIssueLinkParams) => {
      return {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
    body: () => undefined as any,
  },

  transformResponse: async (response: Response, params?: JiraCreateIssueLinkParams) => {
    // Resolve cloudId
    const cloudId = params?.cloudId || (await getJiraCloudId(params!.domain, params!.accessToken))

    // Fetch and resolve link type by id/name/inward/outward (case-insensitive)
    const typesResp = await fetch(
      `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issueLinkType`,
      {
        method: 'GET',
        headers: { Accept: 'application/json', Authorization: `Bearer ${params!.accessToken}` },
      }
    )
    if (!typesResp.ok) {
      throw new Error(`Failed to fetch issue link types (${typesResp.status})`)
    }
    const typesData = await typesResp.json()
    const provided = (params!.linkType || '').trim().toLowerCase()
    let resolvedType: { id?: string; name?: string } | undefined
    const allTypes = Array.isArray(typesData?.issueLinkTypes) ? typesData.issueLinkTypes : []
    for (const t of allTypes) {
      const name = String(t?.name || '').toLowerCase()
      const inward = String(t?.inward || '').toLowerCase()
      const outward = String(t?.outward || '').toLowerCase()
      if (provided && (provided === name || provided === inward || provided === outward)) {
        resolvedType = t?.id ? { id: String(t.id) } : { name: t?.name }
        break
      }
    }
    if (!resolvedType && /^\d+$/.test(provided)) {
      resolvedType = { id: provided }
    }
    if (!resolvedType) {
      const available = allTypes
        .map((t: any) => `${t?.name} (inward: ${t?.inward}, outward: ${t?.outward})`)
        .join('; ')
      throw new Error(`Unknown issue link type "${params!.linkType}". Available: ${available}`)
    }

    // Create issue link
    const linkUrl = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issueLink`
    const linkResponse = await fetch(linkUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params!.accessToken}`,
      },
      body: JSON.stringify({
        type: resolvedType,
        inwardIssue: { key: params!.inwardIssueKey },
        outwardIssue: { key: params!.outwardIssueKey },
        comment: params?.comment
          ? {
              body: {
                type: 'doc',
                version: 1,
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        type: 'text',
                        text: params!.comment,
                      },
                    ],
                  },
                ],
              },
            }
          : undefined,
      }),
    })
    if (!linkResponse.ok) {
      let message = `Failed to create issue link (${linkResponse.status})`
      try {
        const err = await linkResponse.json()
        message = err?.errorMessages?.join(', ') || err?.message || message
      } catch (_e) {}
      throw new Error(message)
    }

    // Try to extract the newly created link ID from the Location header
    const location = linkResponse.headers.get('location') || linkResponse.headers.get('Location')
    let linkId: string | undefined
    if (location) {
      const match = location.match(/\/issueLink\/(\d+)/)
      if (match) linkId = match[1]
    }

    return {
      success: true,
      output: {
        ts: new Date().toISOString(),
        inwardIssue: params?.inwardIssueKey || 'unknown',
        outwardIssue: params?.outwardIssueKey || 'unknown',
        linkType: params?.linkType || 'unknown',
        linkId,
        success: true,
      },
    }
  },

  outputs: {
    ts: { type: 'string', description: 'Timestamp of the operation' },
    inwardIssue: { type: 'string', description: 'Inward issue key' },
    outwardIssue: { type: 'string', description: 'Outward issue key' },
    linkType: { type: 'string', description: 'Type of issue link' },
    linkId: { type: 'string', description: 'Created link ID' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_attachment.ts]---
Location: sim-main/apps/sim/tools/jira/delete_attachment.ts

```typescript
import { getJiraCloudId } from '@/tools/jira/utils'
import type { ToolConfig, ToolResponse } from '@/tools/types'

export interface JiraDeleteAttachmentParams {
  accessToken: string
  domain: string
  attachmentId: string
  cloudId?: string
}

export interface JiraDeleteAttachmentResponse extends ToolResponse {
  output: {
    ts: string
    attachmentId: string
    success: boolean
  }
}

export const jiraDeleteAttachmentTool: ToolConfig<
  JiraDeleteAttachmentParams,
  JiraDeleteAttachmentResponse
> = {
  id: 'jira_delete_attachment',
  name: 'Jira Delete Attachment',
  description: 'Delete an attachment from a Jira issue',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'jira',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token for Jira',
    },
    domain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Jira domain (e.g., yourcompany.atlassian.net)',
    },
    attachmentId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'ID of the attachment to delete',
    },
    cloudId: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description:
        'Jira Cloud ID for the instance. If not provided, it will be fetched using the domain.',
    },
  },

  request: {
    url: (params: JiraDeleteAttachmentParams) => {
      if (params.cloudId) {
        return `https://api.atlassian.com/ex/jira/${params.cloudId}/rest/api/3/attachment/${params.attachmentId}`
      }
      return 'https://api.atlassian.com/oauth/token/accessible-resources'
    },
    method: (params: JiraDeleteAttachmentParams) => (params.cloudId ? 'DELETE' : 'GET'),
    headers: (params: JiraDeleteAttachmentParams) => {
      return {
        Accept: 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
  },

  transformResponse: async (response: Response, params?: JiraDeleteAttachmentParams) => {
    if (!params?.cloudId) {
      const cloudId = await getJiraCloudId(params!.domain, params!.accessToken)
      // Make the actual request with the resolved cloudId
      const attachmentUrl = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/attachment/${params?.attachmentId}`
      const attachmentResponse = await fetch(attachmentUrl, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${params?.accessToken}`,
        },
      })

      if (!attachmentResponse.ok) {
        let message = `Failed to delete attachment from Jira issue (${attachmentResponse.status})`
        try {
          const err = await attachmentResponse.json()
          message = err?.errorMessages?.join(', ') || err?.message || message
        } catch (_e) {}
        throw new Error(message)
      }

      return {
        success: true,
        output: {
          ts: new Date().toISOString(),
          attachmentId: params?.attachmentId || 'unknown',
          success: true,
        },
      }
    }

    // If cloudId was provided, process the response
    if (!response.ok) {
      let message = `Failed to delete attachment from Jira issue (${response.status})`
      try {
        const err = await response.json()
        message = err?.errorMessages?.join(', ') || err?.message || message
      } catch (_e) {}
      throw new Error(message)
    }

    return {
      success: true,
      output: {
        ts: new Date().toISOString(),
        attachmentId: params?.attachmentId || 'unknown',
        success: true,
      },
    }
  },

  outputs: {
    ts: { type: 'string', description: 'Timestamp of the operation' },
    attachmentId: { type: 'string', description: 'Deleted attachment ID' },
  },
}
```

--------------------------------------------------------------------------------

````
