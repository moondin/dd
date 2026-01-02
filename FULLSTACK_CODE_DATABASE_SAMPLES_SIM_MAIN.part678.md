---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 678
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 678 of 933)

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
Location: sim-main/apps/sim/tools/gitlab/update_issue.ts

```typescript
import type { GitLabUpdateIssueParams, GitLabUpdateIssueResponse } from '@/tools/gitlab/types'
import type { ToolConfig } from '@/tools/types'

export const gitlabUpdateIssueTool: ToolConfig<GitLabUpdateIssueParams, GitLabUpdateIssueResponse> =
  {
    id: 'gitlab_update_issue',
    name: 'GitLab Update Issue',
    description: 'Update an existing issue in a GitLab project',
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
      title: {
        type: 'string',
        required: false,
        description: 'New issue title',
      },
      description: {
        type: 'string',
        required: false,
        description: 'New issue description (Markdown supported)',
      },
      stateEvent: {
        type: 'string',
        required: false,
        description: 'State event (close or reopen)',
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
        return `https://gitlab.com/api/v4/projects/${encodedId}/issues/${params.issueIid}`
      },
      method: 'PUT',
      headers: (params) => ({
        'Content-Type': 'application/json',
        'PRIVATE-TOKEN': params.accessToken,
      }),
      body: (params) => {
        const body: Record<string, any> = {}

        if (params.title) body.title = params.title
        if (params.description !== undefined) body.description = params.description
        if (params.stateEvent) body.state_event = params.stateEvent
        if (params.labels !== undefined) body.labels = params.labels
        if (params.assigneeIds) body.assignee_ids = params.assigneeIds
        if (params.milestoneId !== undefined) body.milestone_id = params.milestoneId
        if (params.dueDate !== undefined) body.due_date = params.dueDate
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
        description: 'The updated GitLab issue',
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: update_merge_request.ts]---
Location: sim-main/apps/sim/tools/gitlab/update_merge_request.ts

```typescript
import type {
  GitLabUpdateMergeRequestParams,
  GitLabUpdateMergeRequestResponse,
} from '@/tools/gitlab/types'
import type { ToolConfig } from '@/tools/types'

export const gitlabUpdateMergeRequestTool: ToolConfig<
  GitLabUpdateMergeRequestParams,
  GitLabUpdateMergeRequestResponse
> = {
  id: 'gitlab_update_merge_request',
  name: 'GitLab Update Merge Request',
  description: 'Update an existing merge request in a GitLab project',
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
    title: {
      type: 'string',
      required: false,
      description: 'New merge request title',
    },
    description: {
      type: 'string',
      required: false,
      description: 'New merge request description',
    },
    stateEvent: {
      type: 'string',
      required: false,
      description: 'State event (close or reopen)',
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
    targetBranch: {
      type: 'string',
      required: false,
      description: 'New target branch',
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
      return `https://gitlab.com/api/v4/projects/${encodedId}/merge_requests/${params.mergeRequestIid}`
    },
    method: 'PUT',
    headers: (params) => ({
      'Content-Type': 'application/json',
      'PRIVATE-TOKEN': params.accessToken,
    }),
    body: (params) => {
      const body: Record<string, any> = {}

      if (params.title) body.title = params.title
      if (params.description !== undefined) body.description = params.description
      if (params.stateEvent) body.state_event = params.stateEvent
      if (params.labels !== undefined) body.labels = params.labels
      if (params.assigneeIds !== undefined) body.assignee_ids = params.assigneeIds
      if (params.milestoneId !== undefined) body.milestone_id = params.milestoneId
      if (params.targetBranch) body.target_branch = params.targetBranch
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
      description: 'The updated GitLab merge request',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: add_label.ts]---
Location: sim-main/apps/sim/tools/gmail/add_label.ts

```typescript
import type { GmailLabelParams, GmailToolResponse } from '@/tools/gmail/types'
import type { ToolConfig } from '@/tools/types'

export const gmailAddLabelTool: ToolConfig<GmailLabelParams, GmailToolResponse> = {
  id: 'gmail_add_label',
  name: 'Gmail Add Label',
  description: 'Add label(s) to a Gmail message',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'google-email',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Access token for Gmail API',
    },
    messageId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'ID of the message to add labels to',
    },
    labelIds: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Comma-separated label IDs to add (e.g., INBOX, Label_123)',
    },
  },

  request: {
    url: '/api/tools/gmail/add-label',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params: GmailLabelParams) => ({
      accessToken: params.accessToken,
      messageId: params.messageId,
      labelIds: params.labelIds,
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (!data.success) {
      return {
        success: false,
        output: {
          content: data.error || 'Failed to add label(s)',
          metadata: {},
        },
        error: data.error,
      }
    }

    return {
      success: true,
      output: {
        content: data.output.content,
        metadata: data.output.metadata,
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Success message' },
    metadata: {
      type: 'object',
      description: 'Email metadata',
      properties: {
        id: { type: 'string', description: 'Gmail message ID' },
        threadId: { type: 'string', description: 'Gmail thread ID' },
        labelIds: { type: 'array', items: { type: 'string' }, description: 'Updated email labels' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: archive.ts]---
Location: sim-main/apps/sim/tools/gmail/archive.ts

```typescript
import type { GmailMarkReadParams, GmailToolResponse } from '@/tools/gmail/types'
import type { ToolConfig } from '@/tools/types'

export const gmailArchiveTool: ToolConfig<GmailMarkReadParams, GmailToolResponse> = {
  id: 'gmail_archive',
  name: 'Gmail Archive',
  description: 'Archive a Gmail message (remove from inbox)',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'google-email',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Access token for Gmail API',
    },
    messageId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'ID of the message to archive',
    },
  },

  request: {
    url: '/api/tools/gmail/archive',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params: GmailMarkReadParams) => ({
      accessToken: params.accessToken,
      messageId: params.messageId,
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (!data.success) {
      return {
        success: false,
        output: {
          content: data.error || 'Failed to archive email',
          metadata: {},
        },
        error: data.error,
      }
    }

    return {
      success: true,
      output: {
        content: data.output.content,
        metadata: data.output.metadata,
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Success message' },
    metadata: {
      type: 'object',
      description: 'Email metadata',
      properties: {
        id: { type: 'string', description: 'Gmail message ID' },
        threadId: { type: 'string', description: 'Gmail thread ID' },
        labelIds: { type: 'array', items: { type: 'string' }, description: 'Updated email labels' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete.ts]---
Location: sim-main/apps/sim/tools/gmail/delete.ts

```typescript
import type { GmailMarkReadParams, GmailToolResponse } from '@/tools/gmail/types'
import type { ToolConfig } from '@/tools/types'

export const gmailDeleteTool: ToolConfig<GmailMarkReadParams, GmailToolResponse> = {
  id: 'gmail_delete',
  name: 'Gmail Delete',
  description: 'Delete a Gmail message (move to trash)',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'google-email',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Access token for Gmail API',
    },
    messageId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'ID of the message to delete',
    },
  },

  request: {
    url: '/api/tools/gmail/delete',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params: GmailMarkReadParams) => ({
      accessToken: params.accessToken,
      messageId: params.messageId,
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (!data.success) {
      return {
        success: false,
        output: {
          content: data.error || 'Failed to delete email',
          metadata: {},
        },
        error: data.error,
      }
    }

    return {
      success: true,
      output: {
        content: data.output.content,
        metadata: data.output.metadata,
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Success message' },
    metadata: {
      type: 'object',
      description: 'Email metadata',
      properties: {
        id: { type: 'string', description: 'Gmail message ID' },
        threadId: { type: 'string', description: 'Gmail thread ID' },
        labelIds: { type: 'array', items: { type: 'string' }, description: 'Updated email labels' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: draft.ts]---
Location: sim-main/apps/sim/tools/gmail/draft.ts

```typescript
import type { GmailSendParams, GmailToolResponse } from '@/tools/gmail/types'
import type { ToolConfig } from '@/tools/types'

export const gmailDraftTool: ToolConfig<GmailSendParams, GmailToolResponse> = {
  id: 'gmail_draft',
  name: 'Gmail Draft',
  description: 'Draft emails using Gmail',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'google-email',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Access token for Gmail API',
    },
    to: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Recipient email address',
    },
    subject: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Email subject',
    },
    body: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Email body content',
    },
    contentType: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Content type for the email body (text or html)',
    },
    threadId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Thread ID to reply to (for threading)',
    },
    replyToMessageId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Gmail message ID to reply to - use the "id" field from Gmail Read results (not the RFC "messageId")',
    },
    cc: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'CC recipients (comma-separated)',
    },
    bcc: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'BCC recipients (comma-separated)',
    },
    attachments: {
      type: 'file[]',
      required: false,
      visibility: 'user-only',
      description: 'Files to attach to the email draft',
    },
  },

  request: {
    url: '/api/tools/gmail/draft',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params: GmailSendParams) => ({
      accessToken: params.accessToken,
      to: params.to,
      subject: params.subject,
      body: params.body,
      contentType: params.contentType || 'text',
      threadId: params.threadId,
      replyToMessageId: params.replyToMessageId,
      cc: params.cc,
      bcc: params.bcc,
      attachments: params.attachments,
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (!data.success) {
      return {
        success: false,
        output: {
          content: data.error || 'Failed to create draft',
          metadata: {},
        },
        error: data.error,
      }
    }

    return {
      success: true,
      output: {
        content: data.output.content,
        metadata: data.output.metadata,
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Success message' },
    metadata: {
      type: 'object',
      description: 'Draft metadata',
      properties: {
        id: { type: 'string', description: 'Draft ID' },
        message: {
          type: 'object',
          description: 'Message metadata',
          properties: {
            id: { type: 'string', description: 'Gmail message ID' },
            threadId: { type: 'string', description: 'Gmail thread ID' },
            labelIds: { type: 'array', items: { type: 'string' }, description: 'Email labels' },
          },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/gmail/index.ts

```typescript
import { gmailAddLabelTool } from '@/tools/gmail/add_label'
import { gmailArchiveTool } from '@/tools/gmail/archive'
import { gmailDeleteTool } from '@/tools/gmail/delete'
import { gmailDraftTool } from '@/tools/gmail/draft'
import { gmailMarkReadTool } from '@/tools/gmail/mark_read'
import { gmailMarkUnreadTool } from '@/tools/gmail/mark_unread'
import { gmailMoveTool } from '@/tools/gmail/move'
import { gmailReadTool } from '@/tools/gmail/read'
import { gmailRemoveLabelTool } from '@/tools/gmail/remove_label'
import { gmailSearchTool } from '@/tools/gmail/search'
import { gmailSendTool } from '@/tools/gmail/send'
import { gmailUnarchiveTool } from '@/tools/gmail/unarchive'

export {
  gmailSendTool,
  gmailReadTool,
  gmailSearchTool,
  gmailDraftTool,
  gmailMoveTool,
  gmailMarkReadTool,
  gmailMarkUnreadTool,
  gmailArchiveTool,
  gmailUnarchiveTool,
  gmailDeleteTool,
  gmailAddLabelTool,
  gmailRemoveLabelTool,
}
```

--------------------------------------------------------------------------------

---[FILE: mark_read.ts]---
Location: sim-main/apps/sim/tools/gmail/mark_read.ts

```typescript
import type { GmailMarkReadParams, GmailToolResponse } from '@/tools/gmail/types'
import type { ToolConfig } from '@/tools/types'

export const gmailMarkReadTool: ToolConfig<GmailMarkReadParams, GmailToolResponse> = {
  id: 'gmail_mark_read',
  name: 'Gmail Mark as Read',
  description: 'Mark a Gmail message as read',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'google-email',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Access token for Gmail API',
    },
    messageId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'ID of the message to mark as read',
    },
  },

  request: {
    url: '/api/tools/gmail/mark-read',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params: GmailMarkReadParams) => ({
      accessToken: params.accessToken,
      messageId: params.messageId,
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (!data.success) {
      return {
        success: false,
        output: {
          content: data.error || 'Failed to mark email as read',
          metadata: {},
        },
        error: data.error,
      }
    }

    return {
      success: true,
      output: {
        content: data.output.content,
        metadata: data.output.metadata,
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Success message' },
    metadata: {
      type: 'object',
      description: 'Email metadata',
      properties: {
        id: { type: 'string', description: 'Gmail message ID' },
        threadId: { type: 'string', description: 'Gmail thread ID' },
        labelIds: { type: 'array', items: { type: 'string' }, description: 'Updated email labels' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: mark_unread.ts]---
Location: sim-main/apps/sim/tools/gmail/mark_unread.ts

```typescript
import type { GmailMarkReadParams, GmailToolResponse } from '@/tools/gmail/types'
import type { ToolConfig } from '@/tools/types'

export const gmailMarkUnreadTool: ToolConfig<GmailMarkReadParams, GmailToolResponse> = {
  id: 'gmail_mark_unread',
  name: 'Gmail Mark as Unread',
  description: 'Mark a Gmail message as unread',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'google-email',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Access token for Gmail API',
    },
    messageId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'ID of the message to mark as unread',
    },
  },

  request: {
    url: '/api/tools/gmail/mark-unread',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params: GmailMarkReadParams) => ({
      accessToken: params.accessToken,
      messageId: params.messageId,
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (!data.success) {
      return {
        success: false,
        output: {
          content: data.error || 'Failed to mark email as unread',
          metadata: {},
        },
        error: data.error,
      }
    }

    return {
      success: true,
      output: {
        content: data.output.content,
        metadata: data.output.metadata,
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Success message' },
    metadata: {
      type: 'object',
      description: 'Email metadata',
      properties: {
        id: { type: 'string', description: 'Gmail message ID' },
        threadId: { type: 'string', description: 'Gmail thread ID' },
        labelIds: { type: 'array', items: { type: 'string' }, description: 'Updated email labels' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: move.ts]---
Location: sim-main/apps/sim/tools/gmail/move.ts

```typescript
import type { GmailMoveParams, GmailToolResponse } from '@/tools/gmail/types'
import type { ToolConfig } from '@/tools/types'

export const gmailMoveTool: ToolConfig<GmailMoveParams, GmailToolResponse> = {
  id: 'gmail_move',
  name: 'Gmail Move',
  description: 'Move emails between Gmail labels/folders',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'google-email',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Access token for Gmail API',
    },
    messageId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'ID of the message to move',
    },
    addLabelIds: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Comma-separated label IDs to add (e.g., INBOX, Label_123)',
    },
    removeLabelIds: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Comma-separated label IDs to remove (e.g., INBOX, SPAM)',
    },
  },

  request: {
    url: '/api/tools/gmail/move',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params: GmailMoveParams) => ({
      accessToken: params.accessToken,
      messageId: params.messageId,
      addLabelIds: params.addLabelIds,
      removeLabelIds: params.removeLabelIds,
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (!data.success) {
      return {
        success: false,
        output: {
          content: data.error || 'Failed to move email',
          metadata: {},
        },
        error: data.error,
      }
    }

    return {
      success: true,
      output: {
        content: data.output.content,
        metadata: data.output.metadata,
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Success message' },
    metadata: {
      type: 'object',
      description: 'Email metadata',
      properties: {
        id: { type: 'string', description: 'Gmail message ID' },
        threadId: { type: 'string', description: 'Gmail thread ID' },
        labelIds: { type: 'array', items: { type: 'string' }, description: 'Updated email labels' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: read.ts]---
Location: sim-main/apps/sim/tools/gmail/read.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { GmailAttachment, GmailReadParams, GmailToolResponse } from '@/tools/gmail/types'
import {
  createMessagesSummary,
  GMAIL_API_BASE,
  processMessage,
  processMessageForSummary,
} from '@/tools/gmail/utils'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('GmailReadTool')

export const gmailReadTool: ToolConfig<GmailReadParams, GmailToolResponse> = {
  id: 'gmail_read',
  name: 'Gmail Read',
  description: 'Read emails from Gmail',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'google-email',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Access token for Gmail API',
    },
    messageId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'ID of the message to read',
    },
    folder: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Folder/label to read emails from',
    },
    unreadOnly: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Only retrieve unread messages',
    },
    maxResults: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Maximum number of messages to retrieve (default: 1, max: 10)',
    },
    includeAttachments: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Download and include email attachments',
    },
  },

  request: {
    url: (params) => {
      // If a specific message ID is provided, fetch that message directly with full format
      if (params.messageId) {
        return `${GMAIL_API_BASE}/messages/${params.messageId}?format=full`
      }

      // Otherwise, list messages from the specified folder or INBOX by default
      const url = new URL(`${GMAIL_API_BASE}/messages`)

      // Build query parameters for the folder/label
      const queryParams = []

      // Add unread filter if specified
      if (params.unreadOnly) {
        queryParams.push('is:unread')
      }

      if (params.folder) {
        // If it's a system label like INBOX, SENT, etc., use it directly
        if (['INBOX', 'SENT', 'DRAFT', 'TRASH', 'SPAM'].includes(params.folder)) {
          queryParams.push(`in:${params.folder.toLowerCase()}`)
        } else {
          // Otherwise, it's a user-defined label
          queryParams.push(`label:${params.folder}`)
        }
      } else {
        // Default to INBOX if no folder is specified
        queryParams.push('in:inbox')
      }

      // Only add query if we have parameters
      if (queryParams.length > 0) {
        url.searchParams.append('q', queryParams.join(' '))
      }

      // Set max results (default to 1 for simplicity, max 10)
      const maxResults = params.maxResults ? Math.min(Number(params.maxResults), 10) : 1
      url.searchParams.append('maxResults', maxResults.toString())

      return url.toString()
    },
    method: 'GET',
    headers: (params: GmailReadParams) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response, params?: GmailReadParams) => {
    const data = await response.json()

    // If we're fetching a single message directly (by ID)
    if (params?.messageId) {
      return await processMessage(data, params)
    }

    // If we're listing messages, we need to fetch each message's details
    if (data.messages && Array.isArray(data.messages)) {
      // Return a message if no emails found
      if (data.messages.length === 0) {
        return {
          success: true,
          output: {
            content: 'No messages found in the selected folder.',
            metadata: {
              results: [], // Use SearchMetadata format
            },
          },
        }
      }

      // For agentic workflows, we'll fetch the first message by default
      // If maxResults > 1, we'll return a summary of messages found
      const maxResults = params?.maxResults ? Math.min(Number(params.maxResults), 10) : 1

      if (maxResults === 1) {
        try {
          // Get the first message details
          const messageId = data.messages[0].id
          const messageResponse = await fetch(
            `${GMAIL_API_BASE}/messages/${messageId}?format=full`,
            {
              headers: {
                Authorization: `Bearer ${params?.accessToken || ''}`,
                'Content-Type': 'application/json',
              },
            }
          )

          if (!messageResponse.ok) {
            const errorData = await messageResponse.json()
            throw new Error(errorData.error?.message || 'Failed to fetch message details')
          }

          const message = await messageResponse.json()
          return await processMessage(message, params)
        } catch (error: any) {
          return {
            success: true,
            output: {
              content: `Found messages but couldn't retrieve details: ${error.message || 'Unknown error'}`,
              metadata: {
                results: data.messages.map((msg: any) => ({
                  id: msg.id,
                  threadId: msg.threadId,
                })),
              },
            },
          }
        }
      } else {
        // If maxResults > 1, fetch details for all messages
        try {
          const messagePromises = data.messages.slice(0, maxResults).map(async (msg: any) => {
            const messageResponse = await fetch(
              `${GMAIL_API_BASE}/messages/${msg.id}?format=full`,
              {
                headers: {
                  Authorization: `Bearer ${params?.accessToken || ''}`,
                  'Content-Type': 'application/json',
                },
              }
            )

            if (!messageResponse.ok) {
              throw new Error(`Failed to fetch details for message ${msg.id}`)
            }

            return await messageResponse.json()
          })

          const messages = await Promise.all(messagePromises)

          // Create summary from processed messages first
          const summaryMessages = messages.map(processMessageForSummary)

          const allAttachments: GmailAttachment[] = []
          if (params?.includeAttachments) {
            for (const msg of messages) {
              try {
                const processedResult = await processMessage(msg, params)
                if (
                  processedResult.output.attachments &&
                  processedResult.output.attachments.length > 0
                ) {
                  allAttachments.push(...processedResult.output.attachments)
                }
              } catch (error: any) {
                logger.error(`Error processing message ${msg.id} for attachments:`, error)
              }
            }
          }

          return {
            success: true,
            output: {
              content: createMessagesSummary(summaryMessages),
              metadata: {
                results: summaryMessages.map((msg) => ({
                  id: msg.id,
                  threadId: msg.threadId,
                  subject: msg.subject,
                  from: msg.from,
                  to: msg.to,
                  date: msg.date,
                })),
              },
              attachments: allAttachments,
            },
          }
        } catch (error: any) {
          return {
            success: true,
            output: {
              content: `Found ${data.messages.length} messages but couldn't retrieve all details: ${error.message || 'Unknown error'}`,
              metadata: {
                results: data.messages.map((msg: any) => ({
                  id: msg.id,
                  threadId: msg.threadId,
                })),
              },
              attachments: [],
            },
          }
        }
      }
    }

    // Fallback for unexpected response format
    return {
      success: true,
      output: {
        content: 'Unexpected response format from Gmail API',
        metadata: {
          results: [],
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Text content of the email' },
    metadata: { type: 'json', description: 'Metadata of the email' },
    attachments: { type: 'file[]', description: 'Attachments of the email' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: remove_label.ts]---
Location: sim-main/apps/sim/tools/gmail/remove_label.ts

```typescript
import type { GmailLabelParams, GmailToolResponse } from '@/tools/gmail/types'
import type { ToolConfig } from '@/tools/types'

export const gmailRemoveLabelTool: ToolConfig<GmailLabelParams, GmailToolResponse> = {
  id: 'gmail_remove_label',
  name: 'Gmail Remove Label',
  description: 'Remove label(s) from a Gmail message',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'google-email',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Access token for Gmail API',
    },
    messageId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'ID of the message to remove labels from',
    },
    labelIds: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Comma-separated label IDs to remove (e.g., INBOX, Label_123)',
    },
  },

  request: {
    url: '/api/tools/gmail/remove-label',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params: GmailLabelParams) => ({
      accessToken: params.accessToken,
      messageId: params.messageId,
      labelIds: params.labelIds,
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (!data.success) {
      return {
        success: false,
        output: {
          content: data.error || 'Failed to remove label(s)',
          metadata: {},
        },
        error: data.error,
      }
    }

    return {
      success: true,
      output: {
        content: data.output.content,
        metadata: data.output.metadata,
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Success message' },
    metadata: {
      type: 'object',
      description: 'Email metadata',
      properties: {
        id: { type: 'string', description: 'Gmail message ID' },
        threadId: { type: 'string', description: 'Gmail thread ID' },
        labelIds: { type: 'array', items: { type: 'string' }, description: 'Updated email labels' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

````
