---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 699
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 699 of 933)

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

---[FILE: remove_watcher.ts]---
Location: sim-main/apps/sim/tools/jira/remove_watcher.ts

```typescript
import { getJiraCloudId } from '@/tools/jira/utils'
import type { ToolConfig, ToolResponse } from '@/tools/types'

export interface JiraRemoveWatcherParams {
  accessToken: string
  domain: string
  issueKey: string
  accountId: string
  cloudId?: string
}

export interface JiraRemoveWatcherResponse extends ToolResponse {
  output: {
    ts: string
    issueKey: string
    watcherAccountId: string
    success: boolean
  }
}

export const jiraRemoveWatcherTool: ToolConfig<JiraRemoveWatcherParams, JiraRemoveWatcherResponse> =
  {
    id: 'jira_remove_watcher',
    name: 'Jira Remove Watcher',
    description: 'Remove a watcher from a Jira issue',
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
        description: 'Jira issue key to remove watcher from (e.g., PROJ-123)',
      },
      accountId: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description: 'Account ID of the user to remove as watcher',
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
      url: (params: JiraRemoveWatcherParams) => {
        if (params.cloudId) {
          return `https://api.atlassian.com/ex/jira/${params.cloudId}/rest/api/3/issue/${params.issueKey}/watchers?accountId=${params.accountId}`
        }
        return 'https://api.atlassian.com/oauth/token/accessible-resources'
      },
      method: (params: JiraRemoveWatcherParams) => (params.cloudId ? 'DELETE' : 'GET'),
      headers: (params: JiraRemoveWatcherParams) => {
        return {
          Accept: 'application/json',
          Authorization: `Bearer ${params.accessToken}`,
        }
      },
    },

    transformResponse: async (response: Response, params?: JiraRemoveWatcherParams) => {
      if (!params?.cloudId) {
        const cloudId = await getJiraCloudId(params!.domain, params!.accessToken)
        // Make the actual request with the resolved cloudId
        const watcherUrl = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue/${params?.issueKey}/watchers?accountId=${params?.accountId}`
        const watcherResponse = await fetch(watcherUrl, {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${params?.accessToken}`,
          },
        })

        if (!watcherResponse.ok) {
          let message = `Failed to remove watcher from Jira issue (${watcherResponse.status})`
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
        let message = `Failed to remove watcher from Jira issue (${response.status})`
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
      watcherAccountId: { type: 'string', description: 'Removed watcher account ID' },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: retrieve.ts]---
Location: sim-main/apps/sim/tools/jira/retrieve.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { JiraRetrieveParams, JiraRetrieveResponse } from '@/tools/jira/types'
import { getJiraCloudId } from '@/tools/jira/utils'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('JiraRetrieveTool')

export const jiraRetrieveTool: ToolConfig<JiraRetrieveParams, JiraRetrieveResponse> = {
  id: 'jira_retrieve',
  name: 'Jira Retrieve',
  description: 'Retrieve detailed information about a specific Jira issue',
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
      required: false,
      visibility: 'user-only',
      description: 'Jira project ID (optional; not required to retrieve a single issue).',
    },
    issueKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Jira issue key to retrieve (e.g., PROJ-123)',
    },
    cloudId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'Jira Cloud ID for the instance. If not provided, it will be fetched using the domain.',
    },
  },

  request: {
    url: (params: JiraRetrieveParams) => {
      if (params.cloudId) {
        // Request with broad expands; additional endpoints fetched in transform for completeness
        return `https://api.atlassian.com/ex/jira/${params.cloudId}/rest/api/3/issue/${params.issueKey}?expand=renderedFields,names,schema,transitions,operations,editmeta,changelog,versionedRepresentations`
      }
      // If no cloudId, use the accessible resources endpoint
      return 'https://api.atlassian.com/oauth/token/accessible-resources'
    },
    method: 'GET',
    headers: (params: JiraRetrieveParams) => {
      return {
        Accept: 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
  },

  transformResponse: async (response: Response, params?: JiraRetrieveParams) => {
    if (!params?.issueKey) {
      throw new Error(
        'Select a project to read issues, or provide an issue key to read a single issue.'
      )
    }

    // If we don't have a cloudId, resolve it robustly using the Jira utils helper
    if (!params?.cloudId) {
      const cloudId = await getJiraCloudId(params!.domain, params!.accessToken)
      // Now fetch the actual issue with the found cloudId
      const issueUrl = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue/${params?.issueKey}?expand=renderedFields,names,schema,transitions,operations,editmeta,changelog,versionedRepresentations`
      const issueResponse = await fetch(issueUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${params?.accessToken}`,
        },
      })

      if (!issueResponse.ok) {
        let message = `Failed to fetch Jira issue (${issueResponse.status})`
        try {
          const err = await issueResponse.json()
          message = err?.message || err?.errorMessages?.[0] || message
        } catch (_e) {}
        throw new Error(message)
      }

      const data = await issueResponse.json()

      // Fetch additional resources for a comprehensive view
      const base = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue/${params.issueKey}`
      const [commentsResp, worklogResp, watchersResp] = await Promise.all([
        fetch(`${base}/comment?maxResults=100&orderBy=-created`, {
          headers: { Accept: 'application/json', Authorization: `Bearer ${params!.accessToken}` },
        }),
        fetch(`${base}/worklog?maxResults=100`, {
          headers: { Accept: 'application/json', Authorization: `Bearer ${params!.accessToken}` },
        }),
        fetch(`${base}/watchers`, {
          headers: { Accept: 'application/json', Authorization: `Bearer ${params!.accessToken}` },
        }),
      ])

      try {
        if (commentsResp.ok) {
          const commentsData = await commentsResp.json()
          if (data?.fields) data.fields.comment = commentsData?.comments || data.fields.comment
        } else {
          logger.debug?.('Failed to fetch comments', { status: commentsResp.status })
        }
      } catch {}

      try {
        if (worklogResp.ok) {
          const worklogData = await worklogResp.json()
          if (data?.fields) data.fields.worklog = worklogData || data.fields.worklog
        } else {
          logger.debug?.('Failed to fetch worklog', { status: worklogResp.status })
        }
      } catch {}

      try {
        if (watchersResp.ok) {
          const watchersData = await watchersResp.json()
          if (data?.fields) {
            // Provide both common keys for compatibility
            ;(data.fields as any).watcher = watchersData
            ;(data.fields as any).watches = watchersData
          }
        } else {
          logger.debug?.('Failed to fetch watchers', { status: watchersResp.status })
        }
      } catch {}

      return {
        success: true,
        output: {
          ts: new Date().toISOString(),
          issueKey: data?.key,
          summary: data?.fields?.summary,
          description: data?.fields?.description,
          created: data?.fields?.created,
          updated: data?.fields?.updated,
          issue: data,
        },
      }
    }

    // If we have a cloudId, this response is the issue data
    if (!response.ok) {
      let message = `Failed to fetch Jira issue (${response.status})`
      try {
        const err = await response.json()
        message = err?.message || err?.errorMessages?.[0] || message
      } catch (_e) {}
      throw new Error(message)
    }
    const data = await response.json()

    // When cloudId was provided up-front, fetch additional data too
    try {
      const url = new URL(response.url)
      const match = url.pathname.match(/\/ex\/jira\/([^/]+)/)
      const cloudId = match?.[1]
      if (cloudId) {
        const base = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue/${params.issueKey}`
        const [commentsResp, worklogResp, watchersResp] = await Promise.all([
          fetch(`${base}/comment?maxResults=100&orderBy=-created`, {
            headers: { Accept: 'application/json', Authorization: `Bearer ${params!.accessToken}` },
          }),
          fetch(`${base}/worklog?maxResults=100`, {
            headers: { Accept: 'application/json', Authorization: `Bearer ${params!.accessToken}` },
          }),
          fetch(`${base}/watchers`, {
            headers: { Accept: 'application/json', Authorization: `Bearer ${params!.accessToken}` },
          }),
        ])

        try {
          if (commentsResp.ok) {
            const commentsData = await commentsResp.json()
            if (data?.fields) data.fields.comment = commentsData?.comments || data.fields.comment
          }
        } catch {}

        try {
          if (worklogResp.ok) {
            const worklogData = await worklogResp.json()
            if (data?.fields) data.fields.worklog = worklogData || data.fields.worklog
          }
        } catch {}

        try {
          if (watchersResp.ok) {
            const watchersData = await watchersResp.json()
            if (data?.fields) {
              ;(data.fields as any).watcher = watchersData
              ;(data.fields as any).watches = watchersData
            }
          }
        } catch {}
      }
    } catch {}

    return {
      success: true,
      output: {
        ts: new Date().toISOString(),
        issueKey: data?.key,
        summary: data?.fields?.summary,
        description: data?.fields?.description,
        created: data?.fields?.created,
        updated: data?.fields?.updated,
        issue: data,
      },
    }
  },

  outputs: {
    ts: { type: 'string', description: 'Timestamp of the operation' },
    issueKey: { type: 'string', description: 'Issue key (e.g., PROJ-123)' },
    summary: { type: 'string', description: 'Issue summary' },
    description: { type: 'json', description: 'Issue description content' },
    created: { type: 'string', description: 'Issue creation timestamp' },
    updated: { type: 'string', description: 'Issue last updated timestamp' },
    issue: { type: 'json', description: 'Complete issue object with all fields' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: search_issues.ts]---
Location: sim-main/apps/sim/tools/jira/search_issues.ts

```typescript
import type { JiraSearchIssuesParams, JiraSearchIssuesResponse } from '@/tools/jira/types'
import { getJiraCloudId } from '@/tools/jira/utils'
import type { ToolConfig } from '@/tools/types'

export const jiraSearchIssuesTool: ToolConfig<JiraSearchIssuesParams, JiraSearchIssuesResponse> = {
  id: 'jira_search_issues',
  name: 'Jira Search Issues',
  description: 'Search for Jira issues using JQL (Jira Query Language)',
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
    jql: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description:
        'JQL query string to search for issues (e.g., "project = PROJ AND status = Open")',
    },
    startAt: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'The index of the first result to return (for pagination)',
    },
    maxResults: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Maximum number of results to return (default: 50)',
    },
    fields: {
      type: 'array',
      required: false,
      visibility: 'user-or-llm',
      description:
        "Array of field names to return (default: ['summary', 'status', 'assignee', 'created', 'updated'])",
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
    url: (params: JiraSearchIssuesParams) => {
      if (params.cloudId) {
        const query = new URLSearchParams()
        if (params.jql) query.set('jql', params.jql)
        if (typeof params.startAt === 'number') query.set('startAt', String(params.startAt))
        if (typeof params.maxResults === 'number')
          query.set('maxResults', String(params.maxResults))
        if (Array.isArray(params.fields) && params.fields.length > 0)
          query.set('fields', params.fields.join(','))
        const qs = query.toString()
        return `https://api.atlassian.com/ex/jira/${params.cloudId}/rest/api/3/search/jql${qs ? `?${qs}` : ''}`
      }
      return 'https://api.atlassian.com/oauth/token/accessible-resources'
    },
    method: () => 'GET',
    headers: (params: JiraSearchIssuesParams) => {
      return {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
    body: () => undefined as any,
  },

  transformResponse: async (response: Response, params?: JiraSearchIssuesParams) => {
    if (!params?.cloudId) {
      const cloudId = await getJiraCloudId(params!.domain, params!.accessToken)
      const query = new URLSearchParams()
      if (params?.jql) query.set('jql', params.jql)
      if (typeof params?.startAt === 'number') query.set('startAt', String(params.startAt))
      if (typeof params?.maxResults === 'number') query.set('maxResults', String(params.maxResults))
      if (Array.isArray(params?.fields) && params.fields.length > 0)
        query.set('fields', params.fields.join(','))
      const searchUrl = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/search/jql?${query.toString()}`
      const searchResponse = await fetch(searchUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${params!.accessToken}`,
        },
        body: JSON.stringify({
          jql: params?.jql,
          startAt: params?.startAt ? Number(params.startAt) : 0,
          maxResults: params?.maxResults ? Number(params.maxResults) : 50,
          fields: params?.fields || ['summary', 'status', 'assignee', 'created', 'updated'],
        }),
      })

      if (!searchResponse.ok) {
        let message = `Failed to search Jira issues (${searchResponse.status})`
        try {
          const err = await searchResponse.json()
          message = err?.errorMessages?.join(', ') || err?.message || message
        } catch (_e) {}
        throw new Error(message)
      }

      const data = await searchResponse.json()

      return {
        success: true,
        output: {
          ts: new Date().toISOString(),
          total: data?.total || 0,
          startAt: data?.startAt || 0,
          maxResults: data?.maxResults || 0,
          issues: (data?.issues || []).map((issue: any) => ({
            key: issue.key,
            summary: issue.fields?.summary,
            status: issue.fields?.status?.name,
            assignee: issue.fields?.assignee?.displayName || issue.fields?.assignee?.accountId,
            created: issue.fields?.created,
            updated: issue.fields?.updated,
          })),
        },
      }
    }

    if (!response.ok) {
      let message = `Failed to search Jira issues (${response.status})`
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
        total: data?.total || 0,
        startAt: data?.startAt || 0,
        maxResults: data?.maxResults || 0,
        issues: (data?.issues || []).map((issue: any) => ({
          key: issue.key,
          summary: issue.fields?.summary,
          status: issue.fields?.status?.name,
          assignee: issue.fields?.assignee?.displayName || issue.fields?.assignee?.accountId,
          created: issue.fields?.created,
          updated: issue.fields?.updated,
        })),
      },
    }
  },

  outputs: {
    ts: { type: 'string', description: 'Timestamp of the operation' },
    total: { type: 'number', description: 'Total number of matching issues' },
    startAt: { type: 'number', description: 'Pagination start index' },
    maxResults: { type: 'number', description: 'Maximum results per page' },
    issues: {
      type: 'array',
      description: 'Array of matching issues with key, summary, status, assignee, created, updated',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: transition_issue.ts]---
Location: sim-main/apps/sim/tools/jira/transition_issue.ts

```typescript
import type { JiraTransitionIssueParams, JiraTransitionIssueResponse } from '@/tools/jira/types'
import { getJiraCloudId } from '@/tools/jira/utils'
import type { ToolConfig } from '@/tools/types'

export const jiraTransitionIssueTool: ToolConfig<
  JiraTransitionIssueParams,
  JiraTransitionIssueResponse
> = {
  id: 'jira_transition_issue',
  name: 'Jira Transition Issue',
  description: 'Move a Jira issue between workflow statuses (e.g., To Do -> In Progress)',
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
      description: 'Jira issue key to transition (e.g., PROJ-123)',
    },
    transitionId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description:
        'ID of the transition to execute (e.g., "11" for "To Do", "21" for "In Progress")',
    },
    comment: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Optional comment to add when transitioning the issue',
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
    url: (params: JiraTransitionIssueParams) => {
      if (params.cloudId) {
        return `https://api.atlassian.com/ex/jira/${params.cloudId}/rest/api/3/issue/${params.issueKey}/transitions`
      }
      return 'https://api.atlassian.com/oauth/token/accessible-resources'
    },
    method: (params: JiraTransitionIssueParams) => (params.cloudId ? 'POST' : 'GET'),
    headers: (params: JiraTransitionIssueParams) => {
      return {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
    body: (params: JiraTransitionIssueParams) => {
      if (!params.cloudId) return undefined as any
      const body: any = {
        transition: {
          id: params.transitionId,
        },
      }

      if (params.comment) {
        body.update = {
          comment: [
            {
              add: {
                body: {
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
                },
              },
            },
          ],
        }
      }

      return body
    },
  },

  transformResponse: async (response: Response, params?: JiraTransitionIssueParams) => {
    if (!params?.cloudId) {
      const cloudId = await getJiraCloudId(params!.domain, params!.accessToken)
      const transitionUrl = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue/${params!.issueKey}/transitions`

      const body: any = {
        transition: {
          id: params!.transitionId,
        },
      }

      if (params!.comment) {
        body.update = {
          comment: [
            {
              add: {
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
              },
            },
          ],
        }
      }

      const transitionResponse = await fetch(transitionUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${params!.accessToken}`,
        },
        body: JSON.stringify(body),
      })

      if (!transitionResponse.ok) {
        let message = `Failed to transition Jira issue (${transitionResponse.status})`
        try {
          const err = await transitionResponse.json()
          message = err?.errorMessages?.join(', ') || err?.message || message
        } catch (_e) {}
        throw new Error(message)
      }

      // Transition endpoint returns 204 No Content on success
      return {
        success: true,
        output: {
          ts: new Date().toISOString(),
          issueKey: params!.issueKey,
          transitionId: params!.transitionId,
          success: true,
        },
      }
    }

    if (!response.ok) {
      let message = `Failed to transition Jira issue (${response.status})`
      try {
        const err = await response.json()
        message = err?.errorMessages?.join(', ') || err?.message || message
      } catch (_e) {}
      throw new Error(message)
    }

    // Transition endpoint returns 204 No Content on success
    return {
      success: true,
      output: {
        ts: new Date().toISOString(),
        issueKey: params?.issueKey || 'unknown',
        transitionId: params?.transitionId || 'unknown',
        success: true,
      },
    }
  },

  outputs: {
    ts: { type: 'string', description: 'Timestamp of the operation' },
    issueKey: { type: 'string', description: 'Issue key that was transitioned' },
    transitionId: { type: 'string', description: 'Applied transition ID' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/jira/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface JiraRetrieveParams {
  accessToken: string
  issueKey: string
  domain: string
  cloudId?: string
}

export interface JiraRetrieveResponse extends ToolResponse {
  output: {
    ts: string
    issueKey: string
    summary: string
    description: string
    created: string
    updated: string
  }
}

export interface JiraRetrieveBulkParams {
  accessToken: string
  domain: string
  projectId: string
  cloudId?: string
}

export interface JiraRetrieveResponseBulk extends ToolResponse {
  output: {
    ts: string
    summary: string
    description: string
    created: string
    updated: string
  }[]
}

export interface JiraUpdateParams {
  accessToken: string
  domain: string
  projectId?: string
  issueKey: string
  summary?: string
  title?: string
  description?: string
  status?: string
  priority?: string
  assignee?: string
  cloudId?: string
}

export interface JiraUpdateResponse extends ToolResponse {
  output: {
    ts: string
    issueKey: string
    summary: string
    success: boolean
  }
}

export interface JiraWriteParams {
  accessToken: string
  domain: string
  projectId: string
  summary: string
  description?: string
  priority?: string
  assignee?: string
  cloudId?: string
  issueType: string
  parent?: { key: string }
}

export interface JiraWriteResponse extends ToolResponse {
  output: {
    ts: string
    issueKey: string
    summary: string
    success: boolean
    url: string
  }
}

export interface JiraIssue {
  key: string
  summary: string
  status: string
  priority?: string
  assignee?: string
  updated: string
}

export interface JiraProject {
  id: string
  key: string
  name: string
  url: string
}

export interface JiraCloudResource {
  id: string
  url: string
  name: string
  scopes: string[]
  avatarUrl: string
}

// Delete Issue
export interface JiraDeleteIssueParams {
  accessToken: string
  domain: string
  issueKey: string
  cloudId?: string
  deleteSubtasks?: boolean
}

export interface JiraDeleteIssueResponse extends ToolResponse {
  output: {
    ts: string
    issueKey: string
    success: boolean
  }
}

// Assign Issue
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

// Transition Issue
export interface JiraTransitionIssueParams {
  accessToken: string
  domain: string
  issueKey: string
  transitionId: string
  comment?: string
  cloudId?: string
}

export interface JiraTransitionIssueResponse extends ToolResponse {
  output: {
    ts: string
    issueKey: string
    transitionId: string
    success: boolean
  }
}

// Search Issues
export interface JiraSearchIssuesParams {
  accessToken: string
  domain: string
  jql: string
  startAt?: number
  maxResults?: number
  fields?: string[]
  cloudId?: string
}

export interface JiraSearchIssuesResponse extends ToolResponse {
  output: {
    ts: string
    total: number
    startAt: number
    maxResults: number
    issues: Array<{
      key: string
      summary: string
      status: string
      assignee?: string
      priority?: string
      created: string
      updated: string
    }>
  }
}

// Comments
export interface JiraAddCommentParams {
  accessToken: string
  domain: string
  issueKey: string
  body: string
  cloudId?: string
}

export interface JiraAddCommentResponse extends ToolResponse {
  output: {
    ts: string
    issueKey: string
    commentId: string
    body: string
    success: boolean
  }
}

export interface JiraGetCommentsParams {
  accessToken: string
  domain: string
  issueKey: string
  startAt?: number
  maxResults?: number
  cloudId?: string
}

export interface JiraGetCommentsResponse extends ToolResponse {
  output: {
    ts: string
    issueKey: string
    total: number
    comments: Array<{
      id: string
      author: string
      body: string
      created: string
      updated: string
    }>
  }
}

export interface JiraUpdateCommentParams {
  accessToken: string
  domain: string
  issueKey: string
  commentId: string
  body: string
  cloudId?: string
}

export interface JiraUpdateCommentResponse extends ToolResponse {
  output: {
    ts: string
    issueKey: string
    commentId: string
    body: string
    success: boolean
  }
}

export interface JiraDeleteCommentParams {
  accessToken: string
  domain: string
  issueKey: string
  commentId: string
  cloudId?: string
}

export interface JiraDeleteCommentResponse extends ToolResponse {
  output: {
    ts: string
    issueKey: string
    commentId: string
    success: boolean
  }
}

// Attachments
export interface JiraGetAttachmentsParams {
  accessToken: string
  domain: string
  issueKey: string
  cloudId?: string
}

export interface JiraGetAttachmentsResponse extends ToolResponse {
  output: {
    ts: string
    issueKey: string
    attachments: Array<{
      id: string
      filename: string
      author: string
      created: string
      size: number
      mimeType: string
      content: string
    }>
  }
}

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

// Worklogs
export interface JiraAddWorklogParams {
  accessToken: string
  domain: string
  issueKey: string
  timeSpentSeconds: number
  comment?: string
  started?: string
  cloudId?: string
}

export interface JiraAddWorklogResponse extends ToolResponse {
  output: {
    ts: string
    issueKey: string
    worklogId: string
    timeSpentSeconds: number
    success: boolean
  }
}

export interface JiraGetWorklogsParams {
  accessToken: string
  domain: string
  issueKey: string
  startAt?: number
  maxResults?: number
  cloudId?: string
}

export interface JiraGetWorklogsResponse extends ToolResponse {
  output: {
    ts: string
    issueKey: string
    total: number
    worklogs: Array<{
      id: string
      author: string
      timeSpentSeconds: number
      timeSpent: string
      comment?: string
      created: string
      updated: string
      started: string
    }>
  }
}

export interface JiraUpdateWorklogParams {
  accessToken: string
  domain: string
  issueKey: string
  worklogId: string
  timeSpentSeconds?: number
  comment?: string
  started?: string
  cloudId?: string
}

export interface JiraUpdateWorklogResponse extends ToolResponse {
  output: {
    ts: string
    issueKey: string
    worklogId: string
    success: boolean
  }
}

export interface JiraDeleteWorklogParams {
  accessToken: string
  domain: string
  issueKey: string
  worklogId: string
  cloudId?: string
}

export interface JiraDeleteWorklogResponse extends ToolResponse {
  output: {
    ts: string
    issueKey: string
    worklogId: string
    success: boolean
  }
}

// Issue Links
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
    success: boolean
  }
}

export interface JiraDeleteIssueLinkParams {
  accessToken: string
  domain: string
  linkId: string
  cloudId?: string
}

export interface JiraDeleteIssueLinkResponse extends ToolResponse {
  output: {
    ts: string
    linkId: string
    success: boolean
  }
}

// Watchers
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

export interface JiraRemoveWatcherParams {
  accessToken: string
  domain: string
  issueKey: string
  accountId: string
  cloudId?: string
}

export interface JiraRemoveWatcherResponse extends ToolResponse {
  output: {
    ts: string
    issueKey: string
    watcherAccountId: string
    success: boolean
  }
}

export type JiraResponse =
  | JiraRetrieveResponse
  | JiraUpdateResponse
  | JiraWriteResponse
  | JiraRetrieveResponseBulk
  | JiraDeleteIssueResponse
  | JiraAssignIssueResponse
  | JiraTransitionIssueResponse
  | JiraSearchIssuesResponse
  | JiraAddCommentResponse
  | JiraGetCommentsResponse
  | JiraUpdateCommentResponse
  | JiraDeleteCommentResponse
  | JiraGetAttachmentsResponse
  | JiraDeleteAttachmentResponse
  | JiraAddWorklogResponse
  | JiraGetWorklogsResponse
  | JiraUpdateWorklogResponse
  | JiraDeleteWorklogResponse
  | JiraCreateIssueLinkResponse
  | JiraDeleteIssueLinkResponse
  | JiraAddWatcherResponse
  | JiraRemoveWatcherResponse
```

--------------------------------------------------------------------------------

---[FILE: update.ts]---
Location: sim-main/apps/sim/tools/jira/update.ts

```typescript
import type { JiraUpdateParams, JiraUpdateResponse } from '@/tools/jira/types'
import type { ToolConfig } from '@/tools/types'

export const jiraUpdateTool: ToolConfig<JiraUpdateParams, JiraUpdateResponse> = {
  id: 'jira_update',
  name: 'Jira Update',
  description: 'Update a Jira issue',
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
      required: false,
      visibility: 'user-only',
      description:
        'Jira project ID to update issues in. If not provided, all issues will be retrieved.',
    },
    issueKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Jira issue key to update',
    },
    summary: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New summary for the issue',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New description for the issue',
    },
    status: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New status for the issue',
    },
    priority: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New priority for the issue',
    },
    assignee: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New assignee for the issue',
    },
    cloudId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'Jira Cloud ID for the instance. If not provided, it will be fetched using the domain.',
    },
  },

  request: {
    url: '/api/tools/jira/update',
    method: 'PUT',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      // Pass all parameters to the internal API route
      return {
        domain: params.domain,
        accessToken: params.accessToken,
        issueKey: params.issueKey,
        summary: params.summary,
        title: params.title, // Support both for backwards compatibility
        description: params.description,
        status: params.status,
        priority: params.priority,
        assignee: params.assignee,
        cloudId: params.cloudId,
      }
    },
  },

  transformResponse: async (response: Response) => {
    const responseText = await response.text()

    if (!responseText) {
      return {
        success: true,
        output: {
          ts: new Date().toISOString(),
          issueKey: 'unknown',
          summary: 'Issue updated successfully',
          success: true,
        },
      }
    }

    const data = JSON.parse(responseText)

    // The internal API route already returns the correct format
    if (data.success && data.output) {
      return data
    }

    // Fallback for unexpected response format
    return {
      success: data.success || false,
      output: data.output || {
        ts: new Date().toISOString(),
        issueKey: 'unknown',
        summary: 'Issue updated',
        success: false,
      },
      error: data.error,
    }
  },

  outputs: {
    ts: { type: 'string', description: 'Timestamp of the operation' },
    issueKey: { type: 'string', description: 'Updated issue key (e.g., PROJ-123)' },
    summary: { type: 'string', description: 'Issue summary after update' },
  },
}
```

--------------------------------------------------------------------------------

````
