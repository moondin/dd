---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 794
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 794 of 933)

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

---[FILE: utils.ts]---
Location: sim-main/apps/sim/triggers/jira/utils.ts

```typescript
import type { SubBlockConfig } from '@/blocks/types'
import type { TriggerOutput } from '@/triggers/types'

/**
 * Shared trigger dropdown options for all Jira triggers
 */
export const jiraTriggerOptions = [
  { label: 'Issue Created', id: 'jira_issue_created' },
  { label: 'Issue Updated', id: 'jira_issue_updated' },
  { label: 'Issue Deleted', id: 'jira_issue_deleted' },
  { label: 'Issue Commented', id: 'jira_issue_commented' },
  { label: 'Worklog Created', id: 'jira_worklog_created' },
  { label: 'Generic Webhook (All Events)', id: 'jira_webhook' },
]

/**
 * Common webhook subBlocks for Jira triggers
 * Used across all Jira webhook-based triggers
 */
export const jiraWebhookSubBlocks: SubBlockConfig[] = [
  {
    id: 'triggerCredentials',
    title: 'Jira Credentials',
    type: 'oauth-input',
    serviceId: 'jira',
    requiredScopes: [
      'read:jira-work',
      'read:jira-user',
      'manage:jira-webhook',
      'read:webhook:jira',
      'write:webhook:jira',
      'delete:webhook:jira',
      'read:issue-event:jira',
      'read:issue:jira',
      'read:issue.changelog:jira',
      'read:comment:jira',
      'read:comment.property:jira',
      'read:issue.property:jira',
      'read:issue-worklog:jira',
      'read:project:jira',
      'read:field:jira',
      'read:jql:jira',
    ],
    placeholder: 'Select Jira account',
    required: true,
    mode: 'trigger',
  },
  {
    id: 'webhookUrlDisplay',
    title: 'Webhook URL',
    type: 'short-input',
    readOnly: true,
    showCopyButton: true,
    useWebhookUrl: true,
    placeholder: 'Webhook URL will be generated after saving',
    mode: 'trigger',
    description: 'Copy this URL and use it when configuring the webhook in Jira',
  },
  {
    id: 'webhookSecret',
    title: 'Webhook Secret',
    type: 'short-input',
    placeholder: 'Enter webhook secret for validation',
    description: 'Optional secret to validate webhook deliveries from Jira using HMAC signature',
    password: true,
    required: false,
    mode: 'trigger',
  },
  {
    id: 'jiraDomain',
    title: 'Jira Domain',
    type: 'short-input',
    placeholder: 'your-company.atlassian.net',
    description: 'Your Jira Cloud domain',
    required: false,
    mode: 'trigger',
  },
]

/**
 * Generates setup instructions for Jira webhooks
 */
export function jiraSetupInstructions(eventType: string, additionalNotes?: string): string {
  const instructions = [
    '<strong>Note:</strong> You must have admin permissions in your Jira workspace to create webhooks.',
    'In Jira, navigate to <strong>Settings > System > WebHooks</strong>.',
    'Click <strong>"Create a WebHook"</strong> to add a new webhook.',
    'Paste the <strong>Webhook URL</strong> from above into the URL field.',
    'Optionally, enter the <strong>Webhook Secret</strong> from above into the secret field for added security.',
    `Select the events you want to trigger this workflow. For this trigger, select <strong>${eventType}</strong>.`,
    'Click <strong>"Create"</strong> to activate the webhook.',
  ]

  if (additionalNotes) {
    instructions.push(additionalNotes)
  }

  return instructions
    .map(
      (instruction, index) =>
        `<div class="mb-3">${index === 0 ? instruction : `<strong>${index}.</strong> ${instruction}`}</div>`
    )
    .join('')
}

function buildBaseWebhookOutputs(): Record<string, TriggerOutput> {
  return {
    webhookEvent: {
      type: 'string',
      description:
        'The webhook event type (e.g., jira:issue_created, comment_created, worklog_created)',
    },
    timestamp: {
      type: 'number',
      description: 'Timestamp of the webhook event',
    },

    issue: {
      id: {
        type: 'string',
        description: 'Jira issue ID',
      },
      key: {
        type: 'string',
        description: 'Jira issue key (e.g., PROJ-123)',
      },
      self: {
        type: 'string',
        description: 'REST API URL for this issue',
      },
      fields: {
        votes: {
          type: 'json',
          description: 'Votes on this issue',
        },
        labels: {
          type: 'array',
          description: 'Array of labels applied to this issue',
        },
        status: {
          name: {
            type: 'string',
            description: 'Status name',
          },
          id: {
            type: 'string',
            description: 'Status ID',
          },
          statusCategory: {
            type: 'json',
            description: 'Status category information',
          },
        },
        created: {
          type: 'string',
          description: 'Issue creation date (ISO format)',
        },
        creator: {
          displayName: {
            type: 'string',
            description: 'Creator display name',
          },
          accountId: {
            type: 'string',
            description: 'Creator account ID',
          },
          emailAddress: {
            type: 'string',
            description: 'Creator email address',
          },
        },
        duedate: {
          type: 'string',
          description: 'Due date for the issue',
        },
        project: {
          key: {
            type: 'string',
            description: 'Project key',
          },
          name: {
            type: 'string',
            description: 'Project name',
          },
          id: {
            type: 'string',
            description: 'Project ID',
          },
        },
        summary: {
          type: 'string',
          description: 'Issue summary/title',
        },
        updated: {
          type: 'string',
          description: 'Last updated date (ISO format)',
        },
        watches: {
          type: 'json',
          description: 'Watchers information',
        },
        assignee: {
          displayName: {
            type: 'string',
            description: 'Assignee display name',
          },
          accountId: {
            type: 'string',
            description: 'Assignee account ID',
          },
          emailAddress: {
            type: 'string',
            description: 'Assignee email address',
          },
        },
        priority: {
          name: {
            type: 'string',
            description: 'Priority name',
          },
          id: {
            type: 'string',
            description: 'Priority ID',
          },
        },
        progress: {
          type: 'json',
          description: 'Progress tracking information',
        },
        reporter: {
          displayName: {
            type: 'string',
            description: 'Reporter display name',
          },
          accountId: {
            type: 'string',
            description: 'Reporter account ID',
          },
          emailAddress: {
            type: 'string',
            description: 'Reporter email address',
          },
        },
        security: {
          type: 'string',
          description: 'Security level',
        },
        subtasks: {
          type: 'array',
          description: 'Array of subtask objects',
        },
        versions: {
          type: 'array',
          description: 'Array of affected versions',
        },
        issuetype: {
          name: {
            type: 'string',
            description: 'Issue type name',
          },
          id: {
            type: 'string',
            description: 'Issue type ID',
          },
        },
      },
    },

    webhook: {
      type: 'json',
      description: 'Webhook metadata including provider, path, and raw payload',
    },
  }
}

export function buildIssueOutputs(): Record<string, TriggerOutput> {
  return {
    ...buildBaseWebhookOutputs(),
    issue_event_type_name: {
      type: 'string',
      description: 'Issue event type name from Jira (only present in issue events)',
    },
  }
}

export function buildIssueUpdatedOutputs(): Record<string, TriggerOutput> {
  return {
    ...buildBaseWebhookOutputs(),
    issue_event_type_name: {
      type: 'string',
      description: 'Issue event type name from Jira (only present in issue events)',
    },
    changelog: {
      id: {
        type: 'string',
        description: 'Changelog ID',
      },
      items: {
        type: 'array',
        description:
          'Array of changed items. Each item contains field, fieldtype, from, fromString, to, toString',
      },
    },
  }
}

export function buildCommentOutputs(): Record<string, TriggerOutput> {
  return {
    ...buildBaseWebhookOutputs(),

    comment: {
      id: {
        type: 'string',
        description: 'Comment ID',
      },
      body: {
        type: 'string',
        description: 'Comment text/body',
      },
      author: {
        displayName: {
          type: 'string',
          description: 'Comment author display name',
        },
        accountId: {
          type: 'string',
          description: 'Comment author account ID',
        },
        emailAddress: {
          type: 'string',
          description: 'Comment author email address',
        },
      },
      created: {
        type: 'string',
        description: 'Comment creation date (ISO format)',
      },
      updated: {
        type: 'string',
        description: 'Comment last updated date (ISO format)',
      },
    },
  }
}

export function buildWorklogOutputs(): Record<string, TriggerOutput> {
  return {
    ...buildBaseWebhookOutputs(),

    worklog: {
      id: {
        type: 'string',
        description: 'Worklog entry ID',
      },
      author: {
        displayName: {
          type: 'string',
          description: 'Worklog author display name',
        },
        accountId: {
          type: 'string',
          description: 'Worklog author account ID',
        },
        emailAddress: {
          type: 'string',
          description: 'Worklog author email address',
        },
      },
      timeSpent: {
        type: 'string',
        description: 'Time spent (e.g., "2h 30m")',
      },
      timeSpentSeconds: {
        type: 'number',
        description: 'Time spent in seconds',
      },
      comment: {
        type: 'string',
        description: 'Worklog comment/description',
      },
      started: {
        type: 'string',
        description: 'When the work was started (ISO format)',
      },
    },
  }
}

export function isJiraEventMatch(
  triggerId: string,
  webhookEvent: string,
  issueEventTypeName?: string
): boolean {
  const eventMappings: Record<string, string[]> = {
    jira_issue_created: ['jira:issue_created', 'issue_created'],
    jira_issue_updated: ['jira:issue_updated', 'issue_updated', 'issue_generic'],
    jira_issue_deleted: ['jira:issue_deleted', 'issue_deleted'],
    jira_issue_commented: ['comment_created'],
    jira_worklog_created: ['worklog_created'],
    jira_worklog_updated: ['worklog_updated'],
    jira_worklog_deleted: ['worklog_deleted'],
    // Generic webhook accepts all events
    jira_webhook: ['*'],
  }

  const expectedEvents = eventMappings[triggerId]
  if (!expectedEvents) {
    return false
  }

  // Generic webhook accepts all events
  if (expectedEvents.includes('*')) {
    return true
  }

  // Check if webhookEvent or issueEventTypeName matches
  return (
    expectedEvents.includes(webhookEvent) ||
    (issueEventTypeName !== undefined && expectedEvents.includes(issueEventTypeName))
  )
}

export function extractIssueData(body: any) {
  return {
    webhookEvent: body.webhookEvent,
    timestamp: body.timestamp,
    issue_event_type_name: body.issue_event_type_name,
    issue: body.issue || {},
    changelog: body.changelog,
  }
}

export function extractCommentData(body: any) {
  return {
    webhookEvent: body.webhookEvent,
    timestamp: body.timestamp,
    issue: body.issue || {},
    comment: body.comment || {},
  }
}

export function extractWorklogData(body: any) {
  return {
    webhookEvent: body.webhookEvent,
    timestamp: body.timestamp,
    issue: body.issue || {},
    worklog: body.worklog || {},
  }
}
```

--------------------------------------------------------------------------------

---[FILE: webhook.ts]---
Location: sim-main/apps/sim/triggers/jira/webhook.ts

```typescript
import { JiraIcon } from '@/components/icons'
import { buildIssueOutputs, jiraSetupInstructions } from '@/triggers/jira/utils'
import type { TriggerConfig } from '@/triggers/types'

/**
 * Generic Jira Webhook Trigger
 * Captures all Jira webhook events
 */
export const jiraWebhookTrigger: TriggerConfig = {
  id: 'jira_webhook',
  name: 'Jira Webhook (All Events)',
  provider: 'jira',
  description: 'Trigger workflow on any Jira webhook event',
  version: '1.0.0',
  icon: JiraIcon,

  subBlocks: [
    {
      id: 'webhookUrlDisplay',
      title: 'Webhook URL',
      type: 'short-input',
      readOnly: true,
      showCopyButton: true,
      useWebhookUrl: true,
      placeholder: 'Webhook URL will be generated',
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'jira_webhook',
      },
    },
    {
      id: 'webhookSecret',
      title: 'Webhook Secret',
      type: 'short-input',
      placeholder: 'Enter a strong secret',
      description: 'Optional secret to validate webhook deliveries from Jira using HMAC signature',
      password: true,
      required: false,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'jira_webhook',
      },
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      hideFromPreview: true,
      type: 'text',
      defaultValue: jiraSetupInstructions('All Events'),
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'jira_webhook',
      },
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      hideFromPreview: true,
      mode: 'trigger',
      triggerId: 'jira_webhook',
      condition: {
        field: 'selectedTriggerId',
        value: 'jira_webhook',
      },
    },
  ],

  outputs: {
    ...buildIssueOutputs(),
    changelog: {
      id: {
        type: 'string',
        description: 'Changelog ID',
      },
      items: {
        type: 'array',
        description:
          'Array of changed items. Each item contains field, fieldtype, from, fromString, to, toString',
      },
    },
    comment: {
      id: {
        type: 'string',
        description: 'Comment ID',
      },
      body: {
        type: 'string',
        description: 'Comment text/body',
      },
      author: {
        displayName: {
          type: 'string',
          description: 'Comment author display name',
        },
        accountId: {
          type: 'string',
          description: 'Comment author account ID',
        },
        emailAddress: {
          type: 'string',
          description: 'Comment author email address',
        },
      },
      created: {
        type: 'string',
        description: 'Comment creation date (ISO format)',
      },
      updated: {
        type: 'string',
        description: 'Comment last updated date (ISO format)',
      },
    },
    worklog: {
      id: {
        type: 'string',
        description: 'Worklog entry ID',
      },
      author: {
        displayName: {
          type: 'string',
          description: 'Worklog author display name',
        },
        accountId: {
          type: 'string',
          description: 'Worklog author account ID',
        },
        emailAddress: {
          type: 'string',
          description: 'Worklog author email address',
        },
      },
      timeSpent: {
        type: 'string',
        description: 'Time spent (e.g., "2h 30m")',
      },
      timeSpentSeconds: {
        type: 'number',
        description: 'Time spent in seconds',
      },
      comment: {
        type: 'string',
        description: 'Worklog comment/description',
      },
      started: {
        type: 'string',
        description: 'When the work was started (ISO format)',
      },
    },
  },

  webhook: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Hub-Signature': 'sha256=...',
      'X-Atlassian-Webhook-Identifier': 'unique-webhook-id',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: worklog_created.ts]---
Location: sim-main/apps/sim/triggers/jira/worklog_created.ts

```typescript
import { JiraIcon } from '@/components/icons'
import { buildWorklogOutputs, jiraSetupInstructions } from '@/triggers/jira/utils'
import type { TriggerConfig } from '@/triggers/types'

/**
 * Jira Worklog Created Trigger
 * Triggers when a worklog entry is added to an issue
 */
export const jiraWorklogCreatedTrigger: TriggerConfig = {
  id: 'jira_worklog_created',
  name: 'Jira Worklog Created',
  provider: 'jira',
  description: 'Trigger workflow when time is logged on a Jira issue',
  version: '1.0.0',
  icon: JiraIcon,

  subBlocks: [
    {
      id: 'webhookUrlDisplay',
      title: 'Webhook URL',
      type: 'short-input',
      readOnly: true,
      showCopyButton: true,
      useWebhookUrl: true,
      placeholder: 'Webhook URL will be generated',
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'jira_worklog_created',
      },
    },
    {
      id: 'webhookSecret',
      title: 'Webhook Secret',
      type: 'short-input',
      placeholder: 'Enter a strong secret',
      description: 'Optional secret to validate webhook deliveries from Jira using HMAC signature',
      password: true,
      required: false,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'jira_worklog_created',
      },
    },
    {
      id: 'jqlFilter',
      title: 'JQL Filter',
      type: 'long-input',
      placeholder: 'project = PROJ',
      description: 'Filter which worklog entries trigger this workflow using JQL',
      required: false,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'jira_worklog_created',
      },
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      hideFromPreview: true,
      type: 'text',
      defaultValue: jiraSetupInstructions('worklog_created'),
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'jira_worklog_created',
      },
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      hideFromPreview: true,
      mode: 'trigger',
      triggerId: 'jira_worklog_created',
      condition: {
        field: 'selectedTriggerId',
        value: 'jira_worklog_created',
      },
    },
  ],

  outputs: buildWorklogOutputs(),

  webhook: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Hub-Signature': 'sha256=...',
      'X-Atlassian-Webhook-Identifier': 'unique-webhook-id',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: comment_created.ts]---
Location: sim-main/apps/sim/triggers/linear/comment_created.ts

```typescript
import { LinearIcon } from '@/components/icons'
import { buildCommentOutputs, linearSetupInstructions } from '@/triggers/linear/utils'
import type { TriggerConfig } from '@/triggers/types'

export const linearCommentCreatedTrigger: TriggerConfig = {
  id: 'linear_comment_created',
  name: 'Linear Comment Created',
  provider: 'linear',
  description: 'Trigger workflow when a new comment is created in Linear',
  version: '1.0.0',
  icon: LinearIcon,

  subBlocks: [
    {
      id: 'webhookUrlDisplay',
      title: 'Webhook URL',
      type: 'short-input',
      readOnly: true,
      showCopyButton: true,
      useWebhookUrl: true,
      placeholder: 'Webhook URL will be generated',
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_comment_created',
      },
    },
    {
      id: 'webhookSecret',
      title: 'Webhook Secret',
      type: 'short-input',
      placeholder: 'Enter a strong secret',
      description: 'Validates that webhook deliveries originate from Linear.',
      password: true,
      required: false,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_comment_created',
      },
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      hideFromPreview: true,
      type: 'text',
      defaultValue: linearSetupInstructions('Comment (create)'),
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_comment_created',
      },
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      hideFromPreview: true,
      mode: 'trigger',
      triggerId: 'linear_comment_created',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_comment_created',
      },
    },
  ],

  outputs: buildCommentOutputs(),

  webhook: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Linear-Event': 'Comment',
      'Linear-Delivery': 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      'Linear-Signature': 'sha256...',
      'User-Agent': 'Linear-Webhook',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: comment_updated.ts]---
Location: sim-main/apps/sim/triggers/linear/comment_updated.ts

```typescript
import { LinearIcon } from '@/components/icons'
import { buildCommentOutputs, linearSetupInstructions } from '@/triggers/linear/utils'
import type { TriggerConfig } from '@/triggers/types'

export const linearCommentUpdatedTrigger: TriggerConfig = {
  id: 'linear_comment_updated',
  name: 'Linear Comment Updated',
  provider: 'linear',
  description: 'Trigger workflow when a comment is updated in Linear',
  version: '1.0.0',
  icon: LinearIcon,

  subBlocks: [
    {
      id: 'webhookUrlDisplay',
      title: 'Webhook URL',
      type: 'short-input',
      readOnly: true,
      showCopyButton: true,
      useWebhookUrl: true,
      placeholder: 'Webhook URL will be generated',
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_comment_updated',
      },
    },
    {
      id: 'webhookSecret',
      title: 'Webhook Secret',
      type: 'short-input',
      placeholder: 'Enter a strong secret',
      description: 'Validates that webhook deliveries originate from Linear.',
      password: true,
      required: false,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_comment_updated',
      },
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      hideFromPreview: true,
      type: 'text',
      defaultValue: linearSetupInstructions('Comment (update)'),
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_comment_updated',
      },
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      hideFromPreview: true,
      mode: 'trigger',
      triggerId: 'linear_comment_updated',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_comment_updated',
      },
    },
  ],

  outputs: buildCommentOutputs(),

  webhook: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Linear-Event': 'Comment',
      'Linear-Delivery': 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      'Linear-Signature': 'sha256...',
      'User-Agent': 'Linear-Webhook',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: customer_request_created.ts]---
Location: sim-main/apps/sim/triggers/linear/customer_request_created.ts

```typescript
import { LinearIcon } from '@/components/icons'
import { buildCustomerRequestOutputs, linearSetupInstructions } from '@/triggers/linear/utils'
import type { TriggerConfig } from '@/triggers/types'

export const linearCustomerRequestCreatedTrigger: TriggerConfig = {
  id: 'linear_customer_request_created',
  name: 'Linear Customer Request Created',
  provider: 'linear',
  description: 'Trigger workflow when a new customer request is created in Linear',
  version: '1.0.0',
  icon: LinearIcon,

  subBlocks: [
    {
      id: 'webhookUrlDisplay',
      title: 'Webhook URL',
      type: 'short-input',
      readOnly: true,
      showCopyButton: true,
      useWebhookUrl: true,
      placeholder: 'Webhook URL will be generated',
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_customer_request_created',
      },
    },
    {
      id: 'webhookSecret',
      title: 'Webhook Secret',
      type: 'short-input',
      placeholder: 'Enter a strong secret',
      description: 'Validates that webhook deliveries originate from Linear.',
      password: true,
      required: false,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_customer_request_created',
      },
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      hideFromPreview: true,
      type: 'text',
      defaultValue: linearSetupInstructions('Customer Requests'),
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_customer_request_created',
      },
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      hideFromPreview: true,
      mode: 'trigger',
      triggerId: 'linear_customer_request_created',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_customer_request_created',
      },
    },
  ],

  outputs: buildCustomerRequestOutputs(),

  webhook: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Linear-Event': 'CustomerNeed',
      'Linear-Delivery': 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      'Linear-Signature': 'sha256...',
      'User-Agent': 'Linear-Webhook',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: customer_request_updated.ts]---
Location: sim-main/apps/sim/triggers/linear/customer_request_updated.ts

```typescript
import { LinearIcon } from '@/components/icons'
import { buildCustomerRequestOutputs, linearSetupInstructions } from '@/triggers/linear/utils'
import type { TriggerConfig } from '@/triggers/types'

export const linearCustomerRequestUpdatedTrigger: TriggerConfig = {
  id: 'linear_customer_request_updated',
  name: 'Linear Customer Request Updated',
  provider: 'linear',
  description: 'Trigger workflow when a customer request is updated in Linear',
  version: '1.0.0',
  icon: LinearIcon,

  subBlocks: [
    {
      id: 'webhookUrlDisplay',
      title: 'Webhook URL',
      type: 'short-input',
      readOnly: true,
      showCopyButton: true,
      useWebhookUrl: true,
      placeholder: 'Webhook URL will be generated',
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_customer_request_updated',
      },
    },
    {
      id: 'webhookSecret',
      title: 'Webhook Secret',
      type: 'short-input',
      placeholder: 'Enter a strong secret',
      description: 'Validates that webhook deliveries originate from Linear.',
      password: true,
      required: false,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_customer_request_updated',
      },
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      hideFromPreview: true,
      type: 'text',
      defaultValue: linearSetupInstructions('CustomerNeed (update)'),
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_customer_request_updated',
      },
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      hideFromPreview: true,
      mode: 'trigger',
      triggerId: 'linear_customer_request_updated',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_customer_request_updated',
      },
    },
  ],

  outputs: buildCustomerRequestOutputs(),

  webhook: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Linear-Event': 'CustomerNeed',
      'Linear-Delivery': 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      'Linear-Signature': 'sha256...',
      'User-Agent': 'Linear-Webhook',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: cycle_created.ts]---
Location: sim-main/apps/sim/triggers/linear/cycle_created.ts

```typescript
import { LinearIcon } from '@/components/icons'
import { buildCycleOutputs, linearSetupInstructions } from '@/triggers/linear/utils'
import type { TriggerConfig } from '@/triggers/types'

export const linearCycleCreatedTrigger: TriggerConfig = {
  id: 'linear_cycle_created',
  name: 'Linear Cycle Created',
  provider: 'linear',
  description: 'Trigger workflow when a new cycle is created in Linear',
  version: '1.0.0',
  icon: LinearIcon,

  subBlocks: [
    {
      id: 'webhookUrlDisplay',
      title: 'Webhook URL',
      type: 'short-input',
      readOnly: true,
      showCopyButton: true,
      useWebhookUrl: true,
      placeholder: 'Webhook URL will be generated',
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_cycle_created',
      },
    },
    {
      id: 'webhookSecret',
      title: 'Webhook Secret',
      type: 'short-input',
      placeholder: 'Enter a strong secret',
      description: 'Validates that webhook deliveries originate from Linear.',
      password: true,
      required: false,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_cycle_created',
      },
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      hideFromPreview: true,
      type: 'text',
      defaultValue: linearSetupInstructions('Cycle (create)'),
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_cycle_created',
      },
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      hideFromPreview: true,
      mode: 'trigger',
      triggerId: 'linear_cycle_created',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_cycle_created',
      },
    },
  ],

  outputs: buildCycleOutputs(),

  webhook: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Linear-Event': 'Cycle',
      'Linear-Delivery': 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      'Linear-Signature': 'sha256...',
      'User-Agent': 'Linear-Webhook',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: cycle_updated.ts]---
Location: sim-main/apps/sim/triggers/linear/cycle_updated.ts

```typescript
import { LinearIcon } from '@/components/icons'
import { buildCycleOutputs, linearSetupInstructions } from '@/triggers/linear/utils'
import type { TriggerConfig } from '@/triggers/types'

export const linearCycleUpdatedTrigger: TriggerConfig = {
  id: 'linear_cycle_updated',
  name: 'Linear Cycle Updated',
  provider: 'linear',
  description: 'Trigger workflow when a cycle is updated in Linear',
  version: '1.0.0',
  icon: LinearIcon,

  subBlocks: [
    {
      id: 'webhookUrlDisplay',
      title: 'Webhook URL',
      type: 'short-input',
      readOnly: true,
      showCopyButton: true,
      useWebhookUrl: true,
      placeholder: 'Webhook URL will be generated',
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_cycle_updated',
      },
    },
    {
      id: 'webhookSecret',
      title: 'Webhook Secret',
      type: 'short-input',
      placeholder: 'Enter a strong secret',
      description: 'Validates that webhook deliveries originate from Linear.',
      password: true,
      required: false,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_cycle_updated',
      },
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      hideFromPreview: true,
      type: 'text',
      defaultValue: linearSetupInstructions('Cycle (update)'),
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_cycle_updated',
      },
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      hideFromPreview: true,
      mode: 'trigger',
      triggerId: 'linear_cycle_updated',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_cycle_updated',
      },
    },
  ],

  outputs: buildCycleOutputs(),

  webhook: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Linear-Event': 'Cycle',
      'Linear-Delivery': 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      'Linear-Signature': 'sha256...',
      'User-Agent': 'Linear-Webhook',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/triggers/linear/index.ts

```typescript
export { linearCommentCreatedTrigger } from './comment_created'
export { linearCommentUpdatedTrigger } from './comment_updated'
export { linearCustomerRequestCreatedTrigger } from './customer_request_created'
export { linearCustomerRequestUpdatedTrigger } from './customer_request_updated'
export { linearCycleCreatedTrigger } from './cycle_created'
export { linearCycleUpdatedTrigger } from './cycle_updated'
export { linearIssueCreatedTrigger } from './issue_created'
export { linearIssueRemovedTrigger } from './issue_removed'
export { linearIssueUpdatedTrigger } from './issue_updated'
export { linearLabelCreatedTrigger } from './label_created'
export { linearLabelUpdatedTrigger } from './label_updated'
export { linearProjectCreatedTrigger } from './project_created'
export { linearProjectUpdateCreatedTrigger } from './project_update_created'
export { linearProjectUpdatedTrigger } from './project_updated'
export { linearWebhookTrigger } from './webhook'
```

--------------------------------------------------------------------------------

---[FILE: issue_created.ts]---
Location: sim-main/apps/sim/triggers/linear/issue_created.ts

```typescript
import { LinearIcon } from '@/components/icons'
import {
  buildIssueOutputs,
  linearSetupInstructions,
  linearTriggerOptions,
} from '@/triggers/linear/utils'
import type { TriggerConfig } from '@/triggers/types'

export const linearIssueCreatedTrigger: TriggerConfig = {
  id: 'linear_issue_created',
  name: 'Linear Issue Created',
  provider: 'linear',
  description: 'Trigger workflow when a new issue is created in Linear',
  version: '1.0.0',
  icon: LinearIcon,

  subBlocks: [
    {
      id: 'selectedTriggerId',
      title: 'Trigger Type',
      type: 'dropdown',
      mode: 'trigger',
      options: linearTriggerOptions,
      value: () => 'linear_issue_created',
      required: true,
    },
    {
      id: 'webhookUrlDisplay',
      title: 'Webhook URL',
      type: 'short-input',
      readOnly: true,
      showCopyButton: true,
      useWebhookUrl: true,
      placeholder: 'Webhook URL will be generated',
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_issue_created',
      },
    },
    {
      id: 'webhookSecret',
      title: 'Webhook Secret',
      type: 'short-input',
      placeholder: 'Enter a strong secret',
      description: 'Validates that webhook deliveries originate from Linear.',
      password: true,
      required: false,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_issue_created',
      },
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      hideFromPreview: true,
      type: 'text',
      defaultValue: linearSetupInstructions('Issue (create)'),
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_issue_created',
      },
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      hideFromPreview: true,
      mode: 'trigger',
      triggerId: 'linear_issue_created',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_issue_created',
      },
    },
  ],

  outputs: buildIssueOutputs(),

  webhook: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Linear-Event': 'Issue',
      'Linear-Delivery': 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      'Linear-Signature': 'sha256...',
      'User-Agent': 'Linear-Webhook',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: issue_removed.ts]---
Location: sim-main/apps/sim/triggers/linear/issue_removed.ts

```typescript
import { LinearIcon } from '@/components/icons'
import { buildIssueOutputs, linearSetupInstructions } from '@/triggers/linear/utils'
import type { TriggerConfig } from '@/triggers/types'

export const linearIssueRemovedTrigger: TriggerConfig = {
  id: 'linear_issue_removed',
  name: 'Linear Issue Removed',
  provider: 'linear',
  description: 'Trigger workflow when an issue is removed/deleted in Linear',
  version: '1.0.0',
  icon: LinearIcon,

  subBlocks: [
    {
      id: 'webhookUrlDisplay',
      title: 'Webhook URL',
      type: 'short-input',
      readOnly: true,
      showCopyButton: true,
      useWebhookUrl: true,
      placeholder: 'Webhook URL will be generated',
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_issue_removed',
      },
    },
    {
      id: 'webhookSecret',
      title: 'Webhook Secret',
      type: 'short-input',
      placeholder: 'Enter a strong secret',
      description: 'Validates that webhook deliveries originate from Linear.',
      password: true,
      required: false,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_issue_removed',
      },
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      hideFromPreview: true,
      type: 'text',
      defaultValue: linearSetupInstructions('Issue (remove)'),
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_issue_removed',
      },
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      hideFromPreview: true,
      mode: 'trigger',
      triggerId: 'linear_issue_removed',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_issue_removed',
      },
    },
  ],

  outputs: buildIssueOutputs(),

  webhook: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Linear-Event': 'Issue',
      'Linear-Delivery': 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      'Linear-Signature': 'sha256...',
      'User-Agent': 'Linear-Webhook',
    },
  },
}
```

--------------------------------------------------------------------------------

````
