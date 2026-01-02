---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 698
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 698 of 933)

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

---[FILE: delete_comment.ts]---
Location: sim-main/apps/sim/tools/jira/delete_comment.ts

```typescript
import { getJiraCloudId } from '@/tools/jira/utils'
import type { ToolConfig, ToolResponse } from '@/tools/types'

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

export const jiraDeleteCommentTool: ToolConfig<JiraDeleteCommentParams, JiraDeleteCommentResponse> =
  {
    id: 'jira_delete_comment',
    name: 'Jira Delete Comment',
    description: 'Delete a comment from a Jira issue',
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
        description: 'Jira issue key containing the comment (e.g., PROJ-123)',
      },
      commentId: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description: 'ID of the comment to delete',
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
      url: (params: JiraDeleteCommentParams) => {
        if (params.cloudId) {
          return `https://api.atlassian.com/ex/jira/${params.cloudId}/rest/api/3/issue/${params.issueKey}/comment/${params.commentId}`
        }
        return 'https://api.atlassian.com/oauth/token/accessible-resources'
      },
      method: (params: JiraDeleteCommentParams) => (params.cloudId ? 'DELETE' : 'GET'),
      headers: (params: JiraDeleteCommentParams) => {
        return {
          Accept: 'application/json',
          Authorization: `Bearer ${params.accessToken}`,
        }
      },
    },

    transformResponse: async (response: Response, params?: JiraDeleteCommentParams) => {
      if (!params?.cloudId) {
        const cloudId = await getJiraCloudId(params!.domain, params!.accessToken)
        // Make the actual request with the resolved cloudId
        const commentUrl = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue/${params?.issueKey}/comment/${params?.commentId}`
        const commentResponse = await fetch(commentUrl, {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${params?.accessToken}`,
          },
        })

        if (!commentResponse.ok) {
          let message = `Failed to delete comment from Jira issue (${commentResponse.status})`
          try {
            const err = await commentResponse.json()
            message = err?.errorMessages?.join(', ') || err?.message || message
          } catch (_e) {}
          throw new Error(message)
        }

        return {
          success: true,
          output: {
            ts: new Date().toISOString(),
            issueKey: params?.issueKey || 'unknown',
            commentId: params?.commentId || 'unknown',
            success: true,
          },
        }
      }

      // If cloudId was provided, process the response
      if (!response.ok) {
        let message = `Failed to delete comment from Jira issue (${response.status})`
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
          commentId: params?.commentId || 'unknown',
          success: true,
        },
      }
    },

    outputs: {
      ts: { type: 'string', description: 'Timestamp of the operation' },
      issueKey: { type: 'string', description: 'Issue key' },
      commentId: { type: 'string', description: 'Deleted comment ID' },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: delete_issue.ts]---
Location: sim-main/apps/sim/tools/jira/delete_issue.ts

```typescript
import { getJiraCloudId } from '@/tools/jira/utils'
import type { ToolConfig, ToolResponse } from '@/tools/types'

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

export const jiraDeleteIssueTool: ToolConfig<JiraDeleteIssueParams, JiraDeleteIssueResponse> = {
  id: 'jira_delete_issue',
  name: 'Jira Delete Issue',
  description: 'Delete a Jira issue',
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
      description: 'Jira issue key to delete (e.g., PROJ-123)',
    },
    deleteSubtasks: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Whether to delete subtasks. If false, parent issues with subtasks cannot be deleted.',
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
    url: (params: JiraDeleteIssueParams) => {
      if (params.cloudId) {
        const deleteSubtasksParam = params.deleteSubtasks ? '?deleteSubtasks=true' : ''
        return `https://api.atlassian.com/ex/jira/${params.cloudId}/rest/api/3/issue/${params.issueKey}${deleteSubtasksParam}`
      }
      return 'https://api.atlassian.com/oauth/token/accessible-resources'
    },
    method: (params: JiraDeleteIssueParams) => (params.cloudId ? 'DELETE' : 'GET'),
    headers: (params: JiraDeleteIssueParams) => {
      return {
        Accept: 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
  },

  transformResponse: async (response: Response, params?: JiraDeleteIssueParams) => {
    if (!params?.cloudId) {
      const cloudId = await getJiraCloudId(params!.domain, params!.accessToken)
      const deleteSubtasksParam = params!.deleteSubtasks ? '?deleteSubtasks=true' : ''
      const deleteUrl = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue/${params!.issueKey}${deleteSubtasksParam}`
      const deleteResponse = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${params!.accessToken}`,
        },
      })

      if (deleteResponse.status === 204) {
        return {
          success: true,
          output: {
            ts: new Date().toISOString(),
            issueKey: params?.issueKey || 'unknown',
            success: true,
          },
        }
      }

      if (!deleteResponse.ok) {
        let message = `Failed to delete Jira issue (${deleteResponse.status})`
        try {
          const contentType = deleteResponse.headers.get('content-type') || ''
          if (contentType.includes('application/json')) {
            const err = await deleteResponse.json()
            message = err?.errorMessages?.join(', ') || err?.message || message
          } else {
            const text = await deleteResponse.text()
            message = `${message} - Received HTML/text response. Check authentication and permissions. Response: ${text.substring(0, 200)}`
          }
        } catch (_e) {
          // If parsing fails, keep default message
        }
        throw new Error(message)
      }

      return {
        success: true,
        output: {
          ts: new Date().toISOString(),
          issueKey: params?.issueKey || 'unknown',
          success: true,
        },
      }
    }

    if (response.status === 204) {
      return {
        success: true,
        output: {
          ts: new Date().toISOString(),
          issueKey: params?.issueKey || 'unknown',
          success: true,
        },
      }
    }

    if (!response.ok) {
      let message = `Failed to delete Jira issue (${response.status})`
      try {
        const contentType = response.headers.get('content-type') || ''
        if (contentType.includes('application/json')) {
          const err = await response.json()
          message = err?.errorMessages?.join(', ') || err?.message || message
        } else {
          const text = await response.text()
          message = `${message} - Received HTML/text response. Check authentication and permissions. Response: ${text.substring(0, 200)}`
        }
      } catch (_e) {
        // If parsing fails, keep default message
      }
      throw new Error(message)
    }

    return {
      success: true,
      output: {
        ts: new Date().toISOString(),
        issueKey: params?.issueKey || 'unknown',
        success: true,
      },
    }
  },

  outputs: {
    ts: { type: 'string', description: 'Timestamp of the operation' },
    issueKey: { type: 'string', description: 'Deleted issue key' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_issue_link.ts]---
Location: sim-main/apps/sim/tools/jira/delete_issue_link.ts

```typescript
import { getJiraCloudId } from '@/tools/jira/utils'
import type { ToolConfig, ToolResponse } from '@/tools/types'

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

export const jiraDeleteIssueLinkTool: ToolConfig<
  JiraDeleteIssueLinkParams,
  JiraDeleteIssueLinkResponse
> = {
  id: 'jira_delete_issue_link',
  name: 'Jira Delete Issue Link',
  description: 'Delete a link between two Jira issues',
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
    linkId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'ID of the issue link to delete',
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
    url: (params: JiraDeleteIssueLinkParams) => {
      if (params.cloudId) {
        return `https://api.atlassian.com/ex/jira/${params.cloudId}/rest/api/3/issueLink/${params.linkId}`
      }
      return 'https://api.atlassian.com/oauth/token/accessible-resources'
    },
    method: (params: JiraDeleteIssueLinkParams) => (params.cloudId ? 'DELETE' : 'GET'),
    headers: (params: JiraDeleteIssueLinkParams) => {
      return {
        Accept: 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
  },

  transformResponse: async (response: Response, params?: JiraDeleteIssueLinkParams) => {
    if (!params?.cloudId) {
      const cloudId = await getJiraCloudId(params!.domain, params!.accessToken)
      // Make the actual request with the resolved cloudId
      const issueLinkUrl = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issueLink/${params?.linkId}`
      const issueLinkResponse = await fetch(issueLinkUrl, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${params?.accessToken}`,
        },
      })

      if (!issueLinkResponse.ok) {
        let message = `Failed to delete issue link (${issueLinkResponse.status})`
        try {
          const err = await issueLinkResponse.json()
          message = err?.errorMessages?.join(', ') || err?.message || message
        } catch (_e) {}
        throw new Error(message)
      }

      return {
        success: true,
        output: {
          ts: new Date().toISOString(),
          linkId: params?.linkId || 'unknown',
          success: true,
        },
      }
    }

    // If cloudId was provided, process the response
    if (!response.ok) {
      let message = `Failed to delete issue link (${response.status})`
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
        linkId: params?.linkId || 'unknown',
        success: true,
      },
    }
  },

  outputs: {
    ts: { type: 'string', description: 'Timestamp of the operation' },
    linkId: { type: 'string', description: 'Deleted link ID' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_worklog.ts]---
Location: sim-main/apps/sim/tools/jira/delete_worklog.ts

```typescript
import { getJiraCloudId } from '@/tools/jira/utils'
import type { ToolConfig, ToolResponse } from '@/tools/types'

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

export const jiraDeleteWorklogTool: ToolConfig<JiraDeleteWorklogParams, JiraDeleteWorklogResponse> =
  {
    id: 'jira_delete_worklog',
    name: 'Jira Delete Worklog',
    description: 'Delete a worklog entry from a Jira issue',
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
        description: 'Jira issue key containing the worklog (e.g., PROJ-123)',
      },
      worklogId: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description: 'ID of the worklog entry to delete',
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
      url: (params: JiraDeleteWorklogParams) => {
        if (params.cloudId) {
          return `https://api.atlassian.com/ex/jira/${params.cloudId}/rest/api/3/issue/${params.issueKey}/worklog/${params.worklogId}`
        }
        return 'https://api.atlassian.com/oauth/token/accessible-resources'
      },
      method: (params: JiraDeleteWorklogParams) => (params.cloudId ? 'DELETE' : 'GET'),
      headers: (params: JiraDeleteWorklogParams) => {
        return {
          Accept: 'application/json',
          Authorization: `Bearer ${params.accessToken}`,
        }
      },
    },

    transformResponse: async (response: Response, params?: JiraDeleteWorklogParams) => {
      if (!params?.cloudId) {
        const cloudId = await getJiraCloudId(params!.domain, params!.accessToken)
        // Make the actual request with the resolved cloudId
        const worklogUrl = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue/${params?.issueKey}/worklog/${params?.worklogId}`
        const worklogResponse = await fetch(worklogUrl, {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${params?.accessToken}`,
          },
        })

        if (!worklogResponse.ok) {
          let message = `Failed to delete worklog from Jira issue (${worklogResponse.status})`
          try {
            const err = await worklogResponse.json()
            message = err?.errorMessages?.join(', ') || err?.message || message
          } catch (_e) {}
          throw new Error(message)
        }

        return {
          success: true,
          output: {
            ts: new Date().toISOString(),
            issueKey: params?.issueKey || 'unknown',
            worklogId: params?.worklogId || 'unknown',
            success: true,
          },
        }
      }

      // If cloudId was provided, process the response
      if (!response.ok) {
        let message = `Failed to delete worklog from Jira issue (${response.status})`
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
          worklogId: params?.worklogId || 'unknown',
          success: true,
        },
      }
    },

    outputs: {
      ts: { type: 'string', description: 'Timestamp of the operation' },
      issueKey: { type: 'string', description: 'Issue key' },
      worklogId: { type: 'string', description: 'Deleted worklog ID' },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: get_attachments.ts]---
Location: sim-main/apps/sim/tools/jira/get_attachments.ts

```typescript
import type { JiraGetAttachmentsParams, JiraGetAttachmentsResponse } from '@/tools/jira/types'
import { getJiraCloudId } from '@/tools/jira/utils'
import type { ToolConfig } from '@/tools/types'

export const jiraGetAttachmentsTool: ToolConfig<
  JiraGetAttachmentsParams,
  JiraGetAttachmentsResponse
> = {
  id: 'jira_get_attachments',
  name: 'Jira Get Attachments',
  description: 'Get all attachments from a Jira issue',
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
      description: 'Jira issue key to get attachments from (e.g., PROJ-123)',
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
    url: (params: JiraGetAttachmentsParams) => {
      if (params.cloudId) {
        return `https://api.atlassian.com/ex/jira/${params.cloudId}/rest/api/3/issue/${params.issueKey}?fields=attachment`
      }
      return 'https://api.atlassian.com/oauth/token/accessible-resources'
    },
    method: 'GET',
    headers: (params: JiraGetAttachmentsParams) => {
      return {
        Accept: 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
  },

  transformResponse: async (response: Response, params?: JiraGetAttachmentsParams) => {
    if (!params?.cloudId) {
      const cloudId = await getJiraCloudId(params!.domain, params!.accessToken)
      // Make the actual request with the resolved cloudId
      const attachmentsUrl = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue/${params?.issueKey}?fields=attachment`
      const attachmentsResponse = await fetch(attachmentsUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${params?.accessToken}`,
        },
      })

      if (!attachmentsResponse.ok) {
        let message = `Failed to get attachments from Jira issue (${attachmentsResponse.status})`
        try {
          const err = await attachmentsResponse.json()
          message = err?.errorMessages?.join(', ') || err?.message || message
        } catch (_e) {}
        throw new Error(message)
      }

      const data = await attachmentsResponse.json()

      return {
        success: true,
        output: {
          ts: new Date().toISOString(),
          issueKey: params?.issueKey || 'unknown',
          attachments: (data?.fields?.attachment || []).map((att: any) => ({
            id: att.id,
            filename: att.filename,
            size: att.size,
            mimeType: att.mimeType,
            created: att.created,
            author: att.author?.displayName || att.author?.accountId || 'Unknown',
          })),
        },
      }
    }

    // If cloudId was provided, process the response
    if (!response.ok) {
      let message = `Failed to get attachments from Jira issue (${response.status})`
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
        attachments: (data?.fields?.attachment || []).map((att: any) => ({
          id: att.id,
          filename: att.filename,
          size: att.size,
          mimeType: att.mimeType,
          created: att.created,
          author: att.author?.displayName || att.author?.accountId || 'Unknown',
        })),
      },
    }
  },

  outputs: {
    ts: { type: 'string', description: 'Timestamp of the operation' },
    issueKey: { type: 'string', description: 'Issue key' },
    attachments: {
      type: 'array',
      description: 'Array of attachments with id, filename, size, mimeType, created, author',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_comments.ts]---
Location: sim-main/apps/sim/tools/jira/get_comments.ts

```typescript
import { getJiraCloudId } from '@/tools/jira/utils'
import type { ToolConfig, ToolResponse } from '@/tools/types'

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

export const jiraGetCommentsTool: ToolConfig<JiraGetCommentsParams, JiraGetCommentsResponse> = {
  id: 'jira_get_comments',
  name: 'Jira Get Comments',
  description: 'Get all comments from a Jira issue',
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
      description: 'Jira issue key to get comments from (e.g., PROJ-123)',
    },
    startAt: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Index of the first comment to return (default: 0)',
    },
    maxResults: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Maximum number of comments to return (default: 50)',
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
    url: (params: JiraGetCommentsParams) => {
      if (params.cloudId) {
        const startAt = params.startAt || 0
        const maxResults = params.maxResults || 50
        return `https://api.atlassian.com/ex/jira/${params.cloudId}/rest/api/3/issue/${params.issueKey}/comment?startAt=${startAt}&maxResults=${maxResults}`
      }
      return 'https://api.atlassian.com/oauth/token/accessible-resources'
    },
    method: 'GET',
    headers: (params: JiraGetCommentsParams) => {
      return {
        Accept: 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
  },

  transformResponse: async (response: Response, params?: JiraGetCommentsParams) => {
    // Extract text from Atlassian Document Format
    const extractText = (content: any): string => {
      if (!content) return ''
      if (typeof content === 'string') return content
      if (Array.isArray(content)) {
        return content.map(extractText).join(' ')
      }
      if (content.type === 'text') return content.text || ''
      if (content.content) return extractText(content.content)
      return ''
    }

    if (!params?.cloudId) {
      const cloudId = await getJiraCloudId(params!.domain, params!.accessToken)
      // Make the actual request with the resolved cloudId
      const startAt = params?.startAt || 0
      const maxResults = params?.maxResults || 50
      const commentsUrl = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue/${params?.issueKey}/comment?startAt=${startAt}&maxResults=${maxResults}`
      const commentsResponse = await fetch(commentsUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${params?.accessToken}`,
        },
      })

      if (!commentsResponse.ok) {
        let message = `Failed to get comments from Jira issue (${commentsResponse.status})`
        try {
          const err = await commentsResponse.json()
          message = err?.errorMessages?.join(', ') || err?.message || message
        } catch (_e) {}
        throw new Error(message)
      }

      const data = await commentsResponse.json()

      return {
        success: true,
        output: {
          ts: new Date().toISOString(),
          issueKey: params?.issueKey || 'unknown',
          total: data.total || 0,
          comments: (data.comments || []).map((comment: any) => ({
            id: comment.id,
            author: comment.author?.displayName || comment.author?.accountId || 'Unknown',
            body: extractText(comment.body),
            created: comment.created,
            updated: comment.updated,
          })),
        },
      }
    }

    // If cloudId was provided, process the response
    if (!response.ok) {
      let message = `Failed to get comments from Jira issue (${response.status})`
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
        total: data.total || 0,
        comments: (data.comments || []).map((comment: any) => ({
          id: comment.id,
          author: comment.author?.displayName || comment.author?.accountId || 'Unknown',
          body: extractText(comment.body),
          created: comment.created,
          updated: comment.updated,
        })),
      },
    }
  },

  outputs: {
    ts: { type: 'string', description: 'Timestamp of the operation' },
    issueKey: { type: 'string', description: 'Issue key' },
    total: { type: 'number', description: 'Total number of comments' },
    comments: {
      type: 'array',
      description: 'Array of comments with id, author, body, created, updated',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_worklogs.ts]---
Location: sim-main/apps/sim/tools/jira/get_worklogs.ts

```typescript
import { getJiraCloudId } from '@/tools/jira/utils'
import type { ToolConfig, ToolResponse } from '@/tools/types'

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

export const jiraGetWorklogsTool: ToolConfig<JiraGetWorklogsParams, JiraGetWorklogsResponse> = {
  id: 'jira_get_worklogs',
  name: 'Jira Get Worklogs',
  description: 'Get all worklog entries from a Jira issue',
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
      description: 'Jira issue key to get worklogs from (e.g., PROJ-123)',
    },
    startAt: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Index of the first worklog to return (default: 0)',
    },
    maxResults: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Maximum number of worklogs to return (default: 50)',
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
    url: (params: JiraGetWorklogsParams) => {
      if (params.cloudId) {
        const startAt = params.startAt || 0
        const maxResults = params.maxResults || 50
        return `https://api.atlassian.com/ex/jira/${params.cloudId}/rest/api/3/issue/${params.issueKey}/worklog?startAt=${startAt}&maxResults=${maxResults}`
      }
      return 'https://api.atlassian.com/oauth/token/accessible-resources'
    },
    method: 'GET',
    headers: (params: JiraGetWorklogsParams) => {
      return {
        Accept: 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
  },

  transformResponse: async (response: Response, params?: JiraGetWorklogsParams) => {
    // Extract text from Atlassian Document Format
    const extractText = (content: any): string => {
      if (!content) return ''
      if (typeof content === 'string') return content
      if (Array.isArray(content)) {
        return content.map(extractText).join(' ')
      }
      if (content.type === 'text') return content.text || ''
      if (content.content) return extractText(content.content)
      return ''
    }

    if (!params?.cloudId) {
      const cloudId = await getJiraCloudId(params!.domain, params!.accessToken)
      // Make the actual request with the resolved cloudId
      const startAt = params?.startAt || 0
      const maxResults = params?.maxResults || 50
      const worklogsUrl = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue/${params?.issueKey}/worklog?startAt=${startAt}&maxResults=${maxResults}`
      const worklogsResponse = await fetch(worklogsUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${params?.accessToken}`,
        },
      })

      if (!worklogsResponse.ok) {
        let message = `Failed to get worklogs from Jira issue (${worklogsResponse.status})`
        try {
          const err = await worklogsResponse.json()
          message = err?.errorMessages?.join(', ') || err?.message || message
        } catch (_e) {}
        throw new Error(message)
      }

      const data = await worklogsResponse.json()

      return {
        success: true,
        output: {
          ts: new Date().toISOString(),
          issueKey: params?.issueKey || 'unknown',
          total: data.total || 0,
          worklogs: (data.worklogs || []).map((worklog: any) => ({
            id: worklog.id,
            author: worklog.author?.displayName || worklog.author?.accountId || 'Unknown',
            timeSpentSeconds: worklog.timeSpentSeconds,
            timeSpent: worklog.timeSpent,
            comment: worklog.comment ? extractText(worklog.comment) : undefined,
            created: worklog.created,
            updated: worklog.updated,
            started: worklog.started,
          })),
        },
      }
    }

    // If cloudId was provided, process the response
    if (!response.ok) {
      let message = `Failed to get worklogs from Jira issue (${response.status})`
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
        total: data.total || 0,
        worklogs: (data.worklogs || []).map((worklog: any) => ({
          id: worklog.id,
          author: worklog.author?.displayName || worklog.author?.accountId || 'Unknown',
          timeSpentSeconds: worklog.timeSpentSeconds,
          timeSpent: worklog.timeSpent,
          comment: worklog.comment ? extractText(worklog.comment) : undefined,
          created: worklog.created,
          updated: worklog.updated,
          started: worklog.started,
        })),
      },
    }
  },

  outputs: {
    ts: { type: 'string', description: 'Timestamp of the operation' },
    issueKey: { type: 'string', description: 'Issue key' },
    total: { type: 'number', description: 'Total number of worklogs' },
    worklogs: {
      type: 'array',
      description:
        'Array of worklogs with id, author, timeSpentSeconds, timeSpent, comment, created, updated, started',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/jira/index.ts

```typescript
import { jiraAddCommentTool } from '@/tools/jira/add_comment'
import { jiraAddWatcherTool } from '@/tools/jira/add_watcher'
import { jiraAddWorklogTool } from '@/tools/jira/add_worklog'
import { jiraAssignIssueTool } from '@/tools/jira/assign_issue'
import { jiraBulkRetrieveTool } from '@/tools/jira/bulk_read'
import { jiraCreateIssueLinkTool } from '@/tools/jira/create_issue_link'
import { jiraDeleteAttachmentTool } from '@/tools/jira/delete_attachment'
import { jiraDeleteCommentTool } from '@/tools/jira/delete_comment'
import { jiraDeleteIssueTool } from '@/tools/jira/delete_issue'
import { jiraDeleteIssueLinkTool } from '@/tools/jira/delete_issue_link'
import { jiraDeleteWorklogTool } from '@/tools/jira/delete_worklog'
import { jiraGetAttachmentsTool } from '@/tools/jira/get_attachments'
import { jiraGetCommentsTool } from '@/tools/jira/get_comments'
import { jiraGetWorklogsTool } from '@/tools/jira/get_worklogs'
import { jiraRemoveWatcherTool } from '@/tools/jira/remove_watcher'
import { jiraRetrieveTool } from '@/tools/jira/retrieve'
import { jiraSearchIssuesTool } from '@/tools/jira/search_issues'
import { jiraTransitionIssueTool } from '@/tools/jira/transition_issue'
import { jiraUpdateTool } from '@/tools/jira/update'
import { jiraUpdateCommentTool } from '@/tools/jira/update_comment'
import { jiraUpdateWorklogTool } from '@/tools/jira/update_worklog'
import { jiraWriteTool } from '@/tools/jira/write'

export {
  jiraRetrieveTool,
  jiraUpdateTool,
  jiraWriteTool,
  jiraBulkRetrieveTool,
  jiraDeleteIssueTool,
  jiraAssignIssueTool,
  jiraTransitionIssueTool,
  jiraSearchIssuesTool,
  jiraAddCommentTool,
  jiraGetCommentsTool,
  jiraUpdateCommentTool,
  jiraDeleteCommentTool,
  jiraGetAttachmentsTool,
  jiraDeleteAttachmentTool,
  jiraAddWorklogTool,
  jiraGetWorklogsTool,
  jiraUpdateWorklogTool,
  jiraDeleteWorklogTool,
  jiraCreateIssueLinkTool,
  jiraDeleteIssueLinkTool,
  jiraAddWatcherTool,
  jiraRemoveWatcherTool,
}
```

--------------------------------------------------------------------------------

````
