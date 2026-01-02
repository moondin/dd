---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 795
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 795 of 933)

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

---[FILE: issue_updated.ts]---
Location: sim-main/apps/sim/triggers/linear/issue_updated.ts

```typescript
import { LinearIcon } from '@/components/icons'
import { buildIssueOutputs, linearSetupInstructions } from '@/triggers/linear/utils'
import type { TriggerConfig } from '@/triggers/types'

export const linearIssueUpdatedTrigger: TriggerConfig = {
  id: 'linear_issue_updated',
  name: 'Linear Issue Updated',
  provider: 'linear',
  description: 'Trigger workflow when an issue is updated in Linear',
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
        value: 'linear_issue_updated',
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
        value: 'linear_issue_updated',
      },
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      hideFromPreview: true,
      type: 'text',
      defaultValue: linearSetupInstructions('Issue (update)'),
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_issue_updated',
      },
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      hideFromPreview: true,
      mode: 'trigger',
      triggerId: 'linear_issue_updated',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_issue_updated',
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

---[FILE: label_created.ts]---
Location: sim-main/apps/sim/triggers/linear/label_created.ts

```typescript
import { LinearIcon } from '@/components/icons'
import { buildLabelOutputs, linearSetupInstructions } from '@/triggers/linear/utils'
import type { TriggerConfig } from '@/triggers/types'

export const linearLabelCreatedTrigger: TriggerConfig = {
  id: 'linear_label_created',
  name: 'Linear Label Created',
  provider: 'linear',
  description: 'Trigger workflow when a new label is created in Linear',
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
        value: 'linear_label_created',
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
        value: 'linear_label_created',
      },
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      hideFromPreview: true,
      type: 'text',
      defaultValue: linearSetupInstructions('IssueLabel (create)'),
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_label_created',
      },
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      hideFromPreview: true,
      mode: 'trigger',
      triggerId: 'linear_label_created',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_label_created',
      },
    },
  ],

  outputs: buildLabelOutputs(),

  webhook: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Linear-Event': 'IssueLabel',
      'Linear-Delivery': 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      'Linear-Signature': 'sha256...',
      'User-Agent': 'Linear-Webhook',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: label_updated.ts]---
Location: sim-main/apps/sim/triggers/linear/label_updated.ts

```typescript
import { LinearIcon } from '@/components/icons'
import { buildLabelOutputs, linearSetupInstructions } from '@/triggers/linear/utils'
import type { TriggerConfig } from '@/triggers/types'

export const linearLabelUpdatedTrigger: TriggerConfig = {
  id: 'linear_label_updated',
  name: 'Linear Label Updated',
  provider: 'linear',
  description: 'Trigger workflow when a label is updated in Linear',
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
        value: 'linear_label_updated',
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
        value: 'linear_label_updated',
      },
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      hideFromPreview: true,
      type: 'text',
      defaultValue: linearSetupInstructions('IssueLabel (update)'),
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_label_updated',
      },
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      hideFromPreview: true,
      mode: 'trigger',
      triggerId: 'linear_label_updated',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_label_updated',
      },
    },
  ],

  outputs: buildLabelOutputs(),

  webhook: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Linear-Event': 'IssueLabel',
      'Linear-Delivery': 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      'Linear-Signature': 'sha256...',
      'User-Agent': 'Linear-Webhook',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: project_created.ts]---
Location: sim-main/apps/sim/triggers/linear/project_created.ts

```typescript
import { LinearIcon } from '@/components/icons'
import { buildProjectOutputs, linearSetupInstructions } from '@/triggers/linear/utils'
import type { TriggerConfig } from '@/triggers/types'

export const linearProjectCreatedTrigger: TriggerConfig = {
  id: 'linear_project_created',
  name: 'Linear Project Created',
  provider: 'linear',
  description: 'Trigger workflow when a new project is created in Linear',
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
        value: 'linear_project_created',
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
        value: 'linear_project_created',
      },
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      hideFromPreview: true,
      type: 'text',
      defaultValue: linearSetupInstructions('Project (create)'),
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_project_created',
      },
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      hideFromPreview: true,
      mode: 'trigger',
      triggerId: 'linear_project_created',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_project_created',
      },
    },
  ],

  outputs: buildProjectOutputs(),

  webhook: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Linear-Event': 'Project',
      'Linear-Delivery': 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      'Linear-Signature': 'sha256...',
      'User-Agent': 'Linear-Webhook',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: project_updated.ts]---
Location: sim-main/apps/sim/triggers/linear/project_updated.ts

```typescript
import { LinearIcon } from '@/components/icons'
import { buildProjectOutputs, linearSetupInstructions } from '@/triggers/linear/utils'
import type { TriggerConfig } from '@/triggers/types'

export const linearProjectUpdatedTrigger: TriggerConfig = {
  id: 'linear_project_updated',
  name: 'Linear Project Updated',
  provider: 'linear',
  description: 'Trigger workflow when a project is updated in Linear',
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
        value: 'linear_project_updated',
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
        value: 'linear_project_updated',
      },
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      hideFromPreview: true,
      type: 'text',
      defaultValue: linearSetupInstructions('Project (update)'),
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_project_updated',
      },
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      hideFromPreview: true,
      mode: 'trigger',
      triggerId: 'linear_project_updated',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_project_updated',
      },
    },
  ],

  outputs: buildProjectOutputs(),

  webhook: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Linear-Event': 'Project',
      'Linear-Delivery': 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      'Linear-Signature': 'sha256...',
      'User-Agent': 'Linear-Webhook',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: project_update_created.ts]---
Location: sim-main/apps/sim/triggers/linear/project_update_created.ts

```typescript
import { LinearIcon } from '@/components/icons'
import { buildProjectUpdateOutputs, linearSetupInstructions } from '@/triggers/linear/utils'
import type { TriggerConfig } from '@/triggers/types'

export const linearProjectUpdateCreatedTrigger: TriggerConfig = {
  id: 'linear_project_update_created',
  name: 'Linear Project Update Created',
  provider: 'linear',
  description: 'Trigger workflow when a new project update is posted in Linear',
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
        value: 'linear_project_update_created',
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
        value: 'linear_project_update_created',
      },
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      hideFromPreview: true,
      type: 'text',
      defaultValue: linearSetupInstructions('ProjectUpdate (create)'),
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_project_update_created',
      },
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      hideFromPreview: true,
      mode: 'trigger',
      triggerId: 'linear_project_update_created',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_project_update_created',
      },
    },
  ],

  outputs: buildProjectUpdateOutputs(),

  webhook: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Linear-Event': 'ProjectUpdate',
      'Linear-Delivery': 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      'Linear-Signature': 'sha256...',
      'User-Agent': 'Linear-Webhook',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/triggers/linear/utils.ts

```typescript
import type { TriggerOutput } from '@/triggers/types'

/**
 * Shared trigger dropdown options for all Linear triggers
 */
export const linearTriggerOptions = [
  { label: 'Issue Created', id: 'linear_issue_created' },
  { label: 'Issue Updated', id: 'linear_issue_updated' },
  { label: 'Issue Removed', id: 'linear_issue_removed' },
  { label: 'Comment Created', id: 'linear_comment_created' },
  { label: 'Comment Updated', id: 'linear_comment_updated' },
  { label: 'Project Created', id: 'linear_project_created' },
  { label: 'Project Updated', id: 'linear_project_updated' },
  { label: 'Cycle Created', id: 'linear_cycle_created' },
  { label: 'Cycle Updated', id: 'linear_cycle_updated' },
  { label: 'Label Created', id: 'linear_label_created' },
  { label: 'Label Updated', id: 'linear_label_updated' },
  { label: 'Project Update Created', id: 'linear_project_update_created' },
  { label: 'Customer Request Created', id: 'linear_customer_request_created' },
  { label: 'Customer Request Updated', id: 'linear_customer_request_updated' },
  { label: 'General Webhook (All Events)', id: 'linear_webhook' },
]

/**
 * Generate setup instructions for a specific Linear event type
 */
export function linearSetupInstructions(eventType: string, additionalNotes?: string): string {
  const instructions = [
    '<strong>Note:</strong> You must have admin permissions in your Linear workspace to create webhooks.',
    'In Linear, navigate to <strong>Settings > Administration > API</strong>.',
    'Scroll down to the <strong>Webhooks</strong> section and click <strong>"Create webhook"</strong>.',
    'Paste the <strong>Webhook URL</strong> from above into the URL field.',
    'Optionally, enter the <strong>Webhook Secret</strong> from above into the secret field for added security.',
    `Select the resource types this webhook should listen to. For this trigger, select <strong>${eventType}</strong>.`,
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

/**
 * Shared user/actor output schema
 * Note: Linear webhooks only include id, name, and type in actor objects
 */
export const userOutputs = {
  id: {
    type: 'string',
    description: 'User ID',
  },
  name: {
    type: 'string',
    description: 'User display name',
  },
  user_type: {
    type: 'string',
    description: 'Actor type (user, bot, etc.)',
  },
} as const

/**
 * Shared team output schema
 */
export const teamOutputs = {
  id: {
    type: 'string',
    description: 'Team ID',
  },
  name: {
    type: 'string',
    description: 'Team name',
  },
  key: {
    type: 'string',
    description: 'Team key (used in issue identifiers)',
  },
  description: {
    type: 'string',
    description: 'Team description',
  },
  private: {
    type: 'boolean',
    description: 'Whether the team is private',
  },
  timezone: {
    type: 'string',
    description: 'Team timezone',
  },
} as const

/**
 * Shared state output schema
 */
export const stateOutputs = {
  id: {
    type: 'string',
    description: 'State ID',
  },
  name: {
    type: 'string',
    description: 'State name',
  },
  type: {
    type: 'string',
    description: 'State type (backlog, unstarted, started, completed, canceled)',
  },
  color: {
    type: 'string',
    description: 'State color',
  },
  position: {
    type: 'number',
    description: 'State position in the workflow',
  },
} as const

/**
 * Build output schema for issue events
 */
export function buildIssueOutputs(): Record<string, TriggerOutput> {
  return {
    action: {
      type: 'string',
      description: 'Action performed (create, update, remove)',
    },
    type: {
      type: 'string',
      description: 'Entity type (Issue)',
    },
    webhookId: {
      type: 'string',
      description: 'Webhook ID',
    },
    webhookTimestamp: {
      type: 'number',
      description: 'Webhook timestamp (milliseconds)',
    },
    organizationId: {
      type: 'string',
      description: 'Organization ID',
    },
    createdAt: {
      type: 'string',
      description: 'Event creation timestamp',
    },
    actor: userOutputs,
    data: {
      id: {
        type: 'string',
        description: 'Issue ID',
      },
      title: {
        type: 'string',
        description: 'Issue title',
      },
      description: {
        type: 'string',
        description: 'Issue description',
      },
      identifier: {
        type: 'string',
        description: 'Issue identifier (e.g., ENG-123)',
      },
      number: {
        type: 'number',
        description: 'Issue number',
      },
      priority: {
        type: 'number',
        description: 'Issue priority (0 = None, 1 = Urgent, 2 = High, 3 = Medium, 4 = Low)',
      },
      estimate: {
        type: 'number',
        description: 'Issue estimate',
      },
      sortOrder: {
        type: 'number',
        description: 'Issue sort order',
      },
      teamId: {
        type: 'string',
        description: 'Team ID',
      },
      stateId: {
        type: 'string',
        description: 'Workflow state ID',
      },
      assigneeId: {
        type: 'string',
        description: 'Assignee user ID',
      },
      creatorId: {
        type: 'string',
        description: 'Creator user ID',
      },
      projectId: {
        type: 'string',
        description: 'Project ID',
      },
      cycleId: {
        type: 'string',
        description: 'Cycle ID',
      },
      parentId: {
        type: 'string',
        description: 'Parent issue ID (for sub-issues)',
      },
      labelIds: {
        type: 'array',
        description: 'Array of label IDs',
      },
      subscriberIds: {
        type: 'array',
        description: 'Array of subscriber user IDs',
      },
      url: {
        type: 'string',
        description: 'Issue URL',
      },
      branchName: {
        type: 'string',
        description: 'Git branch name',
      },
      customerTicketCount: {
        type: 'number',
        description: 'Number of customer tickets',
      },
      dueDate: {
        type: 'string',
        description: 'Issue due date',
      },
      snoozedUntilAt: {
        type: 'string',
        description: 'Snoozed until timestamp',
      },
      archivedAt: {
        type: 'string',
        description: 'Archived timestamp',
      },
      canceledAt: {
        type: 'string',
        description: 'Canceled timestamp',
      },
      completedAt: {
        type: 'string',
        description: 'Completed timestamp',
      },
      startedAt: {
        type: 'string',
        description: 'Started timestamp',
      },
      triagedAt: {
        type: 'string',
        description: 'Triaged timestamp',
      },
      createdAt: {
        type: 'string',
        description: 'Issue creation timestamp',
      },
      updatedAt: {
        type: 'string',
        description: 'Issue last update timestamp',
      },
      autoArchivedAt: {
        type: 'string',
        description: 'Auto-archived timestamp',
      },
      autoClosedAt: {
        type: 'string',
        description: 'Auto-closed timestamp',
      },
      previousIdentifiers: {
        type: 'array',
        description: 'Array of previous issue identifiers (when an issue is moved between teams)',
      },
      integrationSourceType: {
        type: 'string',
        description: 'Integration source type (if created from an integration)',
      },
      slaStartedAt: {
        type: 'string',
        description: 'SLA timer started timestamp',
      },
      slaBreachesAt: {
        type: 'string',
        description: 'SLA breach timestamp',
      },
    },
    updatedFrom: {
      type: 'object',
      description: 'Previous values for changed fields (only present on update)',
    },
  } as any
}

/**
 * Build output schema for comment events
 */
export function buildCommentOutputs(): Record<string, TriggerOutput> {
  return {
    action: {
      type: 'string',
      description: 'Action performed (create, update, remove)',
    },
    type: {
      type: 'string',
      description: 'Entity type (Comment)',
    },
    webhookId: {
      type: 'string',
      description: 'Webhook ID',
    },
    webhookTimestamp: {
      type: 'number',
      description: 'Webhook timestamp (milliseconds)',
    },
    organizationId: {
      type: 'string',
      description: 'Organization ID',
    },
    createdAt: {
      type: 'string',
      description: 'Event creation timestamp',
    },
    actor: userOutputs,
    data: {
      id: {
        type: 'string',
        description: 'Comment ID',
      },
      body: {
        type: 'string',
        description: 'Comment body text',
      },
      url: {
        type: 'string',
        description: 'Comment URL',
      },
      issueId: {
        type: 'string',
        description: 'Issue ID this comment belongs to',
      },
      userId: {
        type: 'string',
        description: 'User ID of the comment author',
      },
      editedAt: {
        type: 'string',
        description: 'Last edited timestamp',
      },
      createdAt: {
        type: 'string',
        description: 'Comment creation timestamp',
      },
      updatedAt: {
        type: 'string',
        description: 'Comment last update timestamp',
      },
      archivedAt: {
        type: 'string',
        description: 'Archived timestamp',
      },
      resolvedAt: {
        type: 'string',
        description: 'Resolved timestamp (for comment threads)',
      },
      parent: {
        type: 'object',
        description: 'Parent comment object (if this is a reply)',
      },
      reactionData: {
        type: 'object',
        description: 'Reaction data for the comment',
      },
    },
    updatedFrom: {
      type: 'object',
      description: 'Previous values for changed fields (only present on update)',
    },
  } as any
}

/**
 * Build output schema for project events
 */
export function buildProjectOutputs(): Record<string, TriggerOutput> {
  return {
    action: {
      type: 'string',
      description: 'Action performed (create, update, remove)',
    },
    type: {
      type: 'string',
      description: 'Entity type (Project)',
    },
    webhookId: {
      type: 'string',
      description: 'Webhook ID',
    },
    webhookTimestamp: {
      type: 'number',
      description: 'Webhook timestamp (milliseconds)',
    },
    organizationId: {
      type: 'string',
      description: 'Organization ID',
    },
    createdAt: {
      type: 'string',
      description: 'Event creation timestamp',
    },
    actor: userOutputs,
    data: {
      id: {
        type: 'string',
        description: 'Project ID',
      },
      name: {
        type: 'string',
        description: 'Project name',
      },
      description: {
        type: 'string',
        description: 'Project description',
      },
      icon: {
        type: 'string',
        description: 'Project icon',
      },
      color: {
        type: 'string',
        description: 'Project color',
      },
      state: {
        type: 'string',
        description: 'Project state (planned, started, completed, canceled, backlog)',
      },
      slugId: {
        type: 'string',
        description: 'Project slug ID',
      },
      url: {
        type: 'string',
        description: 'Project URL',
      },
      leadId: {
        type: 'string',
        description: 'Project lead user ID',
      },
      creatorId: {
        type: 'string',
        description: 'Creator user ID',
      },
      memberIds: {
        type: 'array',
        description: 'Array of member user IDs',
      },
      teamIds: {
        type: 'array',
        description: 'Array of team IDs',
      },
      priority: {
        type: 'number',
        description: 'Project priority',
      },
      sortOrder: {
        type: 'number',
        description: 'Project sort order',
      },
      startDate: {
        type: 'string',
        description: 'Project start date',
      },
      targetDate: {
        type: 'string',
        description: 'Project target date',
      },
      startedAt: {
        type: 'string',
        description: 'Started timestamp',
      },
      completedAt: {
        type: 'string',
        description: 'Completed timestamp',
      },
      canceledAt: {
        type: 'string',
        description: 'Canceled timestamp',
      },
      archivedAt: {
        type: 'string',
        description: 'Archived timestamp',
      },
      createdAt: {
        type: 'string',
        description: 'Project creation timestamp',
      },
      updatedAt: {
        type: 'string',
        description: 'Project last update timestamp',
      },
      progress: {
        type: 'number',
        description: 'Project progress (0-1)',
      },
      scope: {
        type: 'number',
        description: 'Project scope estimate',
      },
      statusId: {
        type: 'string',
        description: 'Project status ID',
      },
      bodyData: {
        type: 'object',
        description: 'Project body data (rich text content)',
      },
    },
    updatedFrom: {
      type: 'object',
      description: 'Previous values for changed fields (only present on update)',
    },
  } as any
}

/**
 * Build output schema for cycle events
 */
export function buildCycleOutputs(): Record<string, TriggerOutput> {
  return {
    action: {
      type: 'string',
      description: 'Action performed (create, update, remove)',
    },
    type: {
      type: 'string',
      description: 'Entity type (Cycle)',
    },
    webhookId: {
      type: 'string',
      description: 'Webhook ID',
    },
    webhookTimestamp: {
      type: 'number',
      description: 'Webhook timestamp (milliseconds)',
    },
    organizationId: {
      type: 'string',
      description: 'Organization ID',
    },
    createdAt: {
      type: 'string',
      description: 'Event creation timestamp',
    },
    actor: userOutputs,
    data: {
      id: {
        type: 'string',
        description: 'Cycle ID',
      },
      number: {
        type: 'number',
        description: 'Cycle number',
      },
      name: {
        type: 'string',
        description: 'Cycle name',
      },
      description: {
        type: 'string',
        description: 'Cycle description',
      },
      teamId: {
        type: 'string',
        description: 'Team ID',
      },
      startsAt: {
        type: 'string',
        description: 'Cycle start date',
      },
      endsAt: {
        type: 'string',
        description: 'Cycle end date',
      },
      completedAt: {
        type: 'string',
        description: 'Completed timestamp',
      },
      archivedAt: {
        type: 'string',
        description: 'Archived timestamp',
      },
      autoArchivedAt: {
        type: 'string',
        description: 'Auto-archived timestamp',
      },
      createdAt: {
        type: 'string',
        description: 'Cycle creation timestamp',
      },
      updatedAt: {
        type: 'string',
        description: 'Cycle last update timestamp',
      },
      progress: {
        type: 'number',
        description: 'Cycle progress (0-1)',
      },
      scopeHistory: {
        type: 'array',
        description: 'History of scope changes',
      },
      completedScopeHistory: {
        type: 'array',
        description: 'History of completed scope',
      },
      inProgressScopeHistory: {
        type: 'array',
        description: 'History of in-progress scope',
      },
    },
    updatedFrom: {
      type: 'object',
      description: 'Previous values for changed fields (only present on update)',
    },
  } as any
}

/**
 * Build output schema for label events
 */
export function buildLabelOutputs(): Record<string, TriggerOutput> {
  return {
    action: {
      type: 'string',
      description: 'Action performed (create, update, remove)',
    },
    type: {
      type: 'string',
      description: 'Entity type (IssueLabel)',
    },
    webhookId: {
      type: 'string',
      description: 'Webhook ID',
    },
    webhookTimestamp: {
      type: 'number',
      description: 'Webhook timestamp (milliseconds)',
    },
    organizationId: {
      type: 'string',
      description: 'Organization ID',
    },
    createdAt: {
      type: 'string',
      description: 'Event creation timestamp',
    },
    actor: userOutputs,
    data: {
      id: {
        type: 'string',
        description: 'Label ID',
      },
      name: {
        type: 'string',
        description: 'Label name',
      },
      description: {
        type: 'string',
        description: 'Label description',
      },
      color: {
        type: 'string',
        description: 'Label color (hex code)',
      },
      organizationId: {
        type: 'string',
        description: 'Organization ID',
      },
      teamId: {
        type: 'string',
        description: 'Team ID (if team-specific label)',
      },
      creatorId: {
        type: 'string',
        description: 'Creator user ID',
      },
      isGroup: {
        type: 'boolean',
        description: 'Whether this is a label group',
      },
      parentId: {
        type: 'string',
        description: 'Parent label ID (for nested labels)',
      },
      archivedAt: {
        type: 'string',
        description: 'Archived timestamp',
      },
      createdAt: {
        type: 'string',
        description: 'Label creation timestamp',
      },
      updatedAt: {
        type: 'string',
        description: 'Label last update timestamp',
      },
    },
    updatedFrom: {
      type: 'object',
      description: 'Previous values for changed fields (only present on update)',
    },
  } as any
}

/**
 * Build output schema for project update events
 */
export function buildProjectUpdateOutputs(): Record<string, TriggerOutput> {
  return {
    action: {
      type: 'string',
      description: 'Action performed (create, update, remove)',
    },
    type: {
      type: 'string',
      description: 'Entity type (ProjectUpdate)',
    },
    webhookId: {
      type: 'string',
      description: 'Webhook ID',
    },
    webhookTimestamp: {
      type: 'number',
      description: 'Webhook timestamp (milliseconds)',
    },
    organizationId: {
      type: 'string',
      description: 'Organization ID',
    },
    createdAt: {
      type: 'string',
      description: 'Event creation timestamp',
    },
    actor: userOutputs,
    data: {
      id: {
        type: 'string',
        description: 'Project update ID',
      },
      body: {
        type: 'string',
        description: 'Update body content',
      },
      url: {
        type: 'string',
        description: 'Project update URL',
      },
      projectId: {
        type: 'string',
        description: 'Project ID',
      },
      userId: {
        type: 'string',
        description: 'User ID of the author',
      },
      health: {
        type: 'string',
        description: 'Project health (onTrack, atRisk, offTrack)',
      },
      editedAt: {
        type: 'string',
        description: 'Last edited timestamp',
      },
      createdAt: {
        type: 'string',
        description: 'Update creation timestamp',
      },
      updatedAt: {
        type: 'string',
        description: 'Update last update timestamp',
      },
    },
    updatedFrom: {
      type: 'object',
      description: 'Previous values for changed fields (only present on update)',
    },
  } as any
}

/**
 * Build output schema for customer request events
 */
export function buildCustomerRequestOutputs(): Record<string, TriggerOutput> {
  return {
    action: {
      type: 'string',
      description: 'Action performed (create, update, remove)',
    },
    type: {
      type: 'string',
      description: 'Entity type (CustomerNeed)',
    },
    webhookId: {
      type: 'string',
      description: 'Webhook ID',
    },
    webhookTimestamp: {
      type: 'number',
      description: 'Webhook timestamp (milliseconds)',
    },
    organizationId: {
      type: 'string',
      description: 'Organization ID',
    },
    createdAt: {
      type: 'string',
      description: 'Event creation timestamp',
    },
    actor: userOutputs,
    data: {
      id: {
        type: 'string',
        description: 'Customer request ID',
      },
      body: {
        type: 'string',
        description: 'Request body content (Markdown)',
      },
      priority: {
        type: 'number',
        description: 'Request priority (0 = Not important, 1 = Important)',
      },
      customerId: {
        type: 'string',
        description: 'Customer ID',
      },
      issueId: {
        type: 'string',
        description: 'Linked issue ID',
      },
      projectId: {
        type: 'string',
        description: 'Associated project ID',
      },
      creatorId: {
        type: 'string',
        description: 'Creator user ID',
      },
      url: {
        type: 'string',
        description: 'Customer request URL',
      },
      createdAt: {
        type: 'string',
        description: 'Request creation timestamp',
      },
      updatedAt: {
        type: 'string',
        description: 'Request last update timestamp',
      },
      archivedAt: {
        type: 'string',
        description: 'Archived timestamp',
      },
    },
    updatedFrom: {
      type: 'object',
      description: 'Previous values for changed fields (only present on update)',
    },
  } as any
}

/**
 * Check if a Linear event matches the expected trigger configuration
 */
export function isLinearEventMatch(triggerId: string, eventType: string, action?: string): boolean {
  const eventMap: Record<string, { type: string; actions?: string[] }> = {
    linear_issue_created: { type: 'Issue', actions: ['create'] },
    linear_issue_updated: { type: 'Issue', actions: ['update'] },
    linear_issue_removed: { type: 'Issue', actions: ['remove'] },
    linear_comment_created: { type: 'Comment', actions: ['create'] },
    linear_comment_updated: { type: 'Comment', actions: ['update'] },
    linear_project_created: { type: 'Project', actions: ['create'] },
    linear_project_updated: { type: 'Project', actions: ['update'] },
    linear_cycle_created: { type: 'Cycle', actions: ['create'] },
    linear_cycle_updated: { type: 'Cycle', actions: ['update'] },
    linear_label_created: { type: 'IssueLabel', actions: ['create'] },
    linear_label_updated: { type: 'IssueLabel', actions: ['update'] },
    linear_project_update_created: { type: 'ProjectUpdate', actions: ['create'] },
    linear_customer_request_created: { type: 'CustomerNeed', actions: ['create'] },
    linear_customer_request_updated: { type: 'CustomerNeed', actions: ['update'] },
  }

  const config = eventMap[triggerId]
  if (!config) {
    return true // Unknown trigger, allow through
  }

  // Check event type
  if (config.type !== eventType) {
    return false
  }

  // Check action if specified
  if (config.actions && action && !config.actions.includes(action)) {
    return false
  }

  return true
}
```

--------------------------------------------------------------------------------

````
