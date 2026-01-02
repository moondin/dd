---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 785
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 785 of 933)

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

---[FILE: index.ts]---
Location: sim-main/apps/sim/triggers/calendly/index.ts

```typescript
export { calendlyInviteeCanceledTrigger } from './invitee_canceled'
export { calendlyInviteeCreatedTrigger } from './invitee_created'
export { calendlyRoutingFormSubmittedTrigger } from './routing_form_submitted'
export { calendlyWebhookTrigger } from './webhook'
```

--------------------------------------------------------------------------------

---[FILE: invitee_canceled.ts]---
Location: sim-main/apps/sim/triggers/calendly/invitee_canceled.ts

```typescript
import { CalendlyIcon } from '@/components/icons'
import { buildInviteeOutputs } from '@/triggers/calendly/utils'
import type { TriggerConfig } from '@/triggers/types'

export const calendlyInviteeCanceledTrigger: TriggerConfig = {
  id: 'calendly_invitee_canceled',
  name: 'Calendly Invitee Canceled',
  provider: 'calendly',
  description: 'Trigger workflow when someone cancels a scheduled event on Calendly',
  version: '1.0.0',
  icon: CalendlyIcon,

  subBlocks: [
    {
      id: 'apiKey',
      title: 'Personal Access Token',
      type: 'short-input',
      placeholder: 'Enter your Calendly personal access token',
      password: true,
      required: true,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'calendly_invitee_canceled',
      },
    },
    {
      id: 'organization',
      title: 'Organization URI',
      type: 'short-input',
      placeholder: 'https://api.calendly.com/organizations/XXXXXX',
      description:
        'Organization URI for the webhook subscription. Get this from "Get Current User" operation.',
      required: true,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'calendly_invitee_canceled',
      },
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      hideFromPreview: true,
      type: 'text',
      defaultValue: [
        '<strong>Note:</strong> This trigger requires a paid Calendly subscription (Professional, Teams, or Enterprise plan).',
        'Get your Personal Access Token from <strong>Settings > Integrations > API & Webhooks</strong> in your Calendly account.',
        'Use the "Get Current User" operation in a Calendly block to retrieve your Organization URI.',
        'The webhook will be automatically created in Calendly when you save this trigger.',
        'This webhook triggers when an invitee cancels an event. The payload includes cancellation details and reason.',
      ]
        .map(
          (instruction, index) =>
            `<div class="mb-3"><strong>${index + 1}.</strong> ${instruction}</div>`
        )
        .join(''),
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'calendly_invitee_canceled',
      },
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      hideFromPreview: true,
      mode: 'trigger',
      triggerId: 'calendly_invitee_canceled',
      condition: {
        field: 'selectedTriggerId',
        value: 'calendly_invitee_canceled',
      },
    },
  ],

  outputs: buildInviteeOutputs(),

  webhook: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Calendly-Webhook-Signature': 'v1,signature...',
      'User-Agent': 'Calendly-Webhook',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: invitee_created.ts]---
Location: sim-main/apps/sim/triggers/calendly/invitee_created.ts

```typescript
import { CalendlyIcon } from '@/components/icons'
import { buildInviteeOutputs, calendlyTriggerOptions } from '@/triggers/calendly/utils'
import type { TriggerConfig } from '@/triggers/types'

export const calendlyInviteeCreatedTrigger: TriggerConfig = {
  id: 'calendly_invitee_created',
  name: 'Calendly Invitee Created',
  provider: 'calendly',
  description: 'Trigger workflow when someone schedules a new event on Calendly',
  version: '1.0.0',
  icon: CalendlyIcon,

  subBlocks: [
    {
      id: 'selectedTriggerId',
      title: 'Trigger Type',
      type: 'dropdown',
      mode: 'trigger',
      options: calendlyTriggerOptions,
      value: () => 'calendly_invitee_created',
      required: true,
    },
    {
      id: 'apiKey',
      title: 'Personal Access Token',
      type: 'short-input',
      placeholder: 'Enter your Calendly personal access token',
      password: true,
      required: true,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'calendly_invitee_created',
      },
    },
    {
      id: 'organization',
      title: 'Organization URI',
      type: 'short-input',
      placeholder: 'https://api.calendly.com/organizations/XXXXXX',
      description:
        'Organization URI for the webhook subscription. Get this from "Get Current User" operation.',
      required: true,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'calendly_invitee_created',
      },
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      hideFromPreview: true,
      type: 'text',
      defaultValue: [
        '<strong>Note:</strong> This trigger requires a paid Calendly subscription (Professional, Teams, or Enterprise plan).',
        'Get your Personal Access Token from <strong>Settings > Integrations > API & Webhooks</strong> in your Calendly account.',
        'Use the "Get Current User" operation in a Calendly block to retrieve your Organization URI.',
        'The webhook will be automatically created in Calendly when you save this trigger.',
        'This webhook triggers when an invitee schedules a new event. Rescheduling triggers both cancellation and creation events.',
      ]
        .map(
          (instruction, index) =>
            `<div class="mb-3"><strong>${index + 1}.</strong> ${instruction}</div>`
        )
        .join(''),
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'calendly_invitee_created',
      },
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      hideFromPreview: true,
      mode: 'trigger',
      triggerId: 'calendly_invitee_created',
      condition: {
        field: 'selectedTriggerId',
        value: 'calendly_invitee_created',
      },
    },
  ],

  outputs: buildInviteeOutputs(),

  webhook: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Calendly-Webhook-Signature': 'v1,signature...',
      'User-Agent': 'Calendly-Webhook',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: routing_form_submitted.ts]---
Location: sim-main/apps/sim/triggers/calendly/routing_form_submitted.ts

```typescript
import { CalendlyIcon } from '@/components/icons'
import { buildRoutingFormOutputs } from '@/triggers/calendly/utils'
import type { TriggerConfig } from '@/triggers/types'

export const calendlyRoutingFormSubmittedTrigger: TriggerConfig = {
  id: 'calendly_routing_form_submitted',
  name: 'Calendly Routing Form Submitted',
  provider: 'calendly',
  description: 'Trigger workflow when someone submits a Calendly routing form',
  version: '1.0.0',
  icon: CalendlyIcon,

  subBlocks: [
    {
      id: 'apiKey',
      title: 'Personal Access Token',
      type: 'short-input',
      placeholder: 'Enter your Calendly personal access token',
      password: true,
      required: true,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'calendly_routing_form_submitted',
      },
    },
    {
      id: 'organization',
      title: 'Organization URI',
      type: 'short-input',
      placeholder: 'https://api.calendly.com/organizations/XXXXXX',
      description:
        'Organization URI for the webhook subscription. Get this from "Get Current User" operation.',
      required: true,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'calendly_routing_form_submitted',
      },
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      hideFromPreview: true,
      type: 'text',
      defaultValue: [
        '<strong>Note:</strong> This trigger requires a paid Calendly subscription (Professional, Teams, or Enterprise plan).',
        'Get your Personal Access Token from <strong>Settings > Integrations > API & Webhooks</strong> in your Calendly account.',
        'Use the "Get Current User" operation in a Calendly block to retrieve your Organization URI.',
        'The webhook will be automatically created in Calendly when you save this trigger.',
        'This webhook triggers when someone submits a routing form, regardless of whether they book an event.',
      ]
        .map(
          (instruction, index) =>
            `<div class="mb-3"><strong>${index + 1}.</strong> ${instruction}</div>`
        )
        .join(''),
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'calendly_routing_form_submitted',
      },
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      hideFromPreview: true,
      mode: 'trigger',
      triggerId: 'calendly_routing_form_submitted',
      condition: {
        field: 'selectedTriggerId',
        value: 'calendly_routing_form_submitted',
      },
    },
  ],

  outputs: buildRoutingFormOutputs(),

  webhook: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Calendly-Webhook-Signature': 'v1,signature...',
      'User-Agent': 'Calendly-Webhook',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/triggers/calendly/utils.ts

```typescript
import type { TriggerOutput } from '@/triggers/types'

/**
 * Shared trigger dropdown options for all Calendly triggers
 */
export const calendlyTriggerOptions = [
  { label: 'Invitee Created', id: 'calendly_invitee_created' },
  { label: 'Invitee Canceled', id: 'calendly_invitee_canceled' },
  { label: 'Routing Form Submitted', id: 'calendly_routing_form_submitted' },
  { label: 'General Webhook (All Events)', id: 'calendly_webhook' },
]

/**
 * Generate setup instructions for a specific Calendly event type
 */
export function calendlySetupInstructions(eventType: string, additionalNotes?: string): string {
  const instructions = [
    '<strong>Note:</strong> Webhooks require a paid Calendly subscription (Professional, Teams, or Enterprise plan).',
    '<strong>Important:</strong> Calendly does not provide a UI for creating webhooks. You must create them programmatically using the API.',
    'Get your Calendly <strong>Personal Access Token</strong> from the Calendly dashboard under <strong>Integrations > API & Webhooks</strong>.',
    'In your workflow, add a Calendly block and select the <strong>"Create Webhook"</strong> operation.',
    'Enter your Personal Access Token in the Calendly block.',
    'Copy the <strong>Webhook URL</strong> shown above and paste it into the webhook URL field in the Create Webhook operation.',
    `Select the event types to monitor. For this trigger, select <strong>${eventType}</strong>.`,
    'Set the scope to <strong>Organization</strong> or <strong>User</strong> as needed (routing form submissions require organization scope).',
    'Run the workflow to create the webhook subscription. You can use the "List Webhooks" operation to verify it was created.',
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
 * Shared tracking output schema
 */
export const trackingOutputs = {
  utm_campaign: {
    type: 'string',
    description: 'UTM campaign parameter',
  },
  utm_source: {
    type: 'string',
    description: 'UTM source parameter',
  },
  utm_medium: {
    type: 'string',
    description: 'UTM medium parameter',
  },
  utm_content: {
    type: 'string',
    description: 'UTM content parameter',
  },
  utm_term: {
    type: 'string',
    description: 'UTM term parameter',
  },
  salesforce_uuid: {
    type: 'string',
    description: 'Salesforce UUID',
  },
} as const

/**
 * Shared questions and answers output schema
 */
export const questionsAndAnswersOutputs = {
  type: 'array',
  description: 'Questions and answers from the booking form',
  items: {
    question: {
      type: 'string',
      description: 'Question text',
    },
    answer: {
      type: 'string',
      description: 'Answer text',
    },
  },
} as const

/**
 * Build output schema for invitee events
 */
export function buildInviteeOutputs(): Record<string, TriggerOutput> {
  return {
    event: {
      type: 'string',
      description: 'Event type (invitee.created or invitee.canceled)',
    },
    created_at: {
      type: 'string',
      description: 'Webhook event creation timestamp',
    },
    created_by: {
      type: 'string',
      description: 'URI of the Calendly user who created this webhook',
    },
    payload: {
      uri: {
        type: 'string',
        description: 'Invitee URI',
      },
      email: {
        type: 'string',
        description: 'Invitee email address',
      },
      name: {
        type: 'string',
        description: 'Invitee full name',
      },
      first_name: {
        type: 'string',
        description: 'Invitee first name',
      },
      last_name: {
        type: 'string',
        description: 'Invitee last name',
      },
      status: {
        type: 'string',
        description: 'Invitee status (active or canceled)',
      },
      timezone: {
        type: 'string',
        description: 'Invitee timezone',
      },
      event: {
        type: 'string',
        description: 'Scheduled event URI',
      },
      questions_and_answers: questionsAndAnswersOutputs,
      tracking: trackingOutputs,
      text_reminder_number: {
        type: 'string',
        description: 'Phone number for text reminders',
      },
      rescheduled: {
        type: 'boolean',
        description: 'Whether this invitee rescheduled',
      },
      old_invitee: {
        type: 'string',
        description: 'URI of the old invitee (if rescheduled)',
      },
      new_invitee: {
        type: 'string',
        description: 'URI of the new invitee (if rescheduled)',
      },
      cancel_url: {
        type: 'string',
        description: 'URL to cancel the event',
      },
      reschedule_url: {
        type: 'string',
        description: 'URL to reschedule the event',
      },
      created_at: {
        type: 'string',
        description: 'Invitee creation timestamp',
      },
      updated_at: {
        type: 'string',
        description: 'Invitee last update timestamp',
      },
      canceled: {
        type: 'boolean',
        description: 'Whether the event was canceled',
      },
      cancellation: {
        type: 'object',
        description: 'Cancellation details',
        properties: {
          canceled_by: {
            type: 'string',
            description: 'Who canceled the event',
          },
          reason: {
            type: 'string',
            description: 'Cancellation reason',
          },
        },
      },
      payment: {
        type: 'object',
        description: 'Payment details',
        properties: {
          id: {
            type: 'string',
            description: 'Payment ID',
          },
          provider: {
            type: 'string',
            description: 'Payment provider',
          },
          amount: {
            type: 'number',
            description: 'Payment amount',
          },
          currency: {
            type: 'string',
            description: 'Payment currency',
          },
          terms: {
            type: 'string',
            description: 'Payment terms',
          },
          successful: {
            type: 'boolean',
            description: 'Whether payment was successful',
          },
        },
      },
      no_show: {
        type: 'object',
        description: 'No-show details',
        properties: {
          created_at: {
            type: 'string',
            description: 'No-show marked timestamp',
          },
        },
      },
      reconfirmation: {
        type: 'object',
        description: 'Reconfirmation details',
        properties: {
          created_at: {
            type: 'string',
            description: 'Reconfirmation timestamp',
          },
          confirmed_at: {
            type: 'string',
            description: 'Confirmation timestamp',
          },
        },
      },
    },
  } as any
}

/**
 * Build output schema for routing form submission events
 */
export function buildRoutingFormOutputs(): Record<string, TriggerOutput> {
  return {
    event: {
      type: 'string',
      description: 'Event type (routing_form_submission.created)',
    },
    created_at: {
      type: 'string',
      description: 'Webhook event creation timestamp',
    },
    created_by: {
      type: 'string',
      description: 'URI of the Calendly user who created this webhook',
    },
    payload: {
      uri: {
        type: 'string',
        description: 'Routing form submission URI',
      },
      routing_form: {
        type: 'string',
        description: 'Routing form URI',
      },
      submitter: {
        type: 'object',
        description: 'Submitter details',
        properties: {
          uri: {
            type: 'string',
            description: 'Submitter URI',
          },
          email: {
            type: 'string',
            description: 'Submitter email address',
          },
          name: {
            type: 'string',
            description: 'Submitter full name',
          },
        },
      },
      submitter_type: {
        type: 'string',
        description: 'Type of submitter',
      },
      questions_and_answers: questionsAndAnswersOutputs,
      tracking: trackingOutputs,
      result: {
        type: 'object',
        description: 'Routing result details',
        properties: {
          type: {
            type: 'string',
            description: 'Result type (event_type, custom_message, or external_url)',
          },
          value: {
            type: 'string',
            description: 'Result value (event type URI, message, or URL)',
          },
        },
      },
      created_at: {
        type: 'string',
        description: 'Submission creation timestamp',
      },
      updated_at: {
        type: 'string',
        description: 'Submission last update timestamp',
      },
    },
  } as any
}

/**
 * Check if a Calendly event matches the expected trigger configuration
 */
export function isCalendlyEventMatch(triggerId: string, eventType: string): boolean {
  const eventMap: Record<string, string> = {
    calendly_invitee_created: 'invitee.created',
    calendly_invitee_canceled: 'invitee.canceled',
    calendly_routing_form_submitted: 'routing_form_submission.created',
  }

  const expectedEvent = eventMap[triggerId]
  if (!expectedEvent) {
    return true // Unknown trigger or general webhook, allow through
  }

  return expectedEvent === eventType
}
```

--------------------------------------------------------------------------------

---[FILE: webhook.ts]---
Location: sim-main/apps/sim/triggers/calendly/webhook.ts

```typescript
import { CalendlyIcon } from '@/components/icons'
import type { TriggerConfig } from '@/triggers/types'

export const calendlyWebhookTrigger: TriggerConfig = {
  id: 'calendly_webhook',
  name: 'Calendly Webhook',
  provider: 'calendly',
  description: 'Trigger workflow from any Calendly webhook event',
  version: '1.0.0',
  icon: CalendlyIcon,

  subBlocks: [
    {
      id: 'apiKey',
      title: 'Personal Access Token',
      type: 'short-input',
      placeholder: 'Enter your Calendly personal access token',
      password: true,
      required: true,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'calendly_webhook',
      },
    },
    {
      id: 'organization',
      title: 'Organization URI',
      type: 'short-input',
      placeholder: 'https://api.calendly.com/organizations/XXXXXX',
      description:
        'Organization URI for the webhook subscription. Get this from "Get Current User" operation.',
      required: true,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'calendly_webhook',
      },
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      hideFromPreview: true,
      type: 'text',
      defaultValue: [
        '<strong>Note:</strong> This trigger requires a paid Calendly subscription (Professional, Teams, or Enterprise plan).',
        'Get your Personal Access Token from <strong>Settings > Integrations > API & Webhooks</strong> in your Calendly account.',
        'Use the "Get Current User" operation in a Calendly block to retrieve your Organization URI.',
        'The webhook will be automatically created in Calendly when you save this trigger.',
        'This webhook subscribes to all Calendly events (invitee created, invitee canceled, and routing form submitted). Use the <code>event</code> field in the payload to determine the event type.',
      ]
        .map(
          (instruction, index) =>
            `<div class="mb-3"><strong>${index + 1}.</strong> ${instruction}</div>`
        )
        .join(''),
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'calendly_webhook',
      },
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      hideFromPreview: true,
      mode: 'trigger',
      triggerId: 'calendly_webhook',
      condition: {
        field: 'selectedTriggerId',
        value: 'calendly_webhook',
      },
    },
  ],

  outputs: {
    event: {
      type: 'string',
      description:
        'Event type (invitee.created, invitee.canceled, or routing_form_submission.created)',
    },
    created_at: {
      type: 'string',
      description: 'Webhook event creation timestamp',
    },
    created_by: {
      type: 'string',
      description: 'URI of the Calendly user who created this webhook',
    },
    payload: {
      type: 'object',
      description: 'Complete event payload (structure varies by event type)',
    },
  },

  webhook: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Calendly-Webhook-Signature': 'v1,signature...',
      'User-Agent': 'Calendly-Webhook',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/triggers/generic/index.ts

```typescript
export { genericWebhookTrigger } from './webhook'
```

--------------------------------------------------------------------------------

---[FILE: webhook.ts]---
Location: sim-main/apps/sim/triggers/generic/webhook.ts

```typescript
import { WebhookIcon } from '@/components/icons'
import type { TriggerConfig } from '@/triggers/types'

export const genericWebhookTrigger: TriggerConfig = {
  id: 'generic_webhook',
  name: 'Generic Webhook',
  provider: 'generic',
  description: 'Receive webhooks from any service or API',
  version: '1.0.0',
  icon: WebhookIcon,

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
    },
    {
      id: 'requireAuth',
      title: 'Require Authentication',
      type: 'switch',
      description: 'Require authentication for all webhook requests',
      defaultValue: false,
      mode: 'trigger',
    },
    {
      id: 'token',
      title: 'Authentication Token',
      type: 'short-input',
      placeholder: 'Enter an auth token',
      description: 'Token used to authenticate webhook requests via Bearer token or custom header',
      password: true,
      required: false,
      mode: 'trigger',
    },
    {
      id: 'secretHeaderName',
      title: 'Secret Header Name (Optional)',
      type: 'short-input',
      placeholder: 'X-Secret-Key',
      description:
        'Custom HTTP header name for the auth token. If blank, uses "Authorization: Bearer TOKEN"',
      required: false,
      mode: 'trigger',
    },
    {
      id: 'inputFormat',
      title: 'Input Format',
      type: 'input-format',
      description:
        'Define the expected JSON input schema for this webhook (optional). Use type "files" for file uploads.',
      mode: 'trigger',
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      hideFromPreview: true,
      type: 'text',
      defaultValue: [
        'Copy the webhook URL and use it in your external service or API.',
        'Configure your service to send webhooks to this URL.',
        'The webhook will receive any HTTP method (GET, POST, PUT, DELETE, etc.).',
        'All request data (headers, body, query parameters) will be available in your workflow.',
        'If authentication is enabled, include the token in requests using either the custom header or "Authorization: Bearer TOKEN".',
        'Common fields like "event", "id", and "data" will be automatically extracted from the payload when available.',
      ]
        .map(
          (instruction, index) =>
            `<div class="mb-3"><strong>${index + 1}.</strong> ${instruction}</div>`
        )
        .join(''),
      mode: 'trigger',
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      hideFromPreview: true,
      mode: 'trigger',
      triggerId: 'generic_webhook',
    },
  ],

  outputs: {},

  webhook: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/triggers/github/index.ts

```typescript
export { githubIssueClosedTrigger } from './issue_closed'
export { githubIssueCommentTrigger } from './issue_comment'
export { githubIssueOpenedTrigger } from './issue_opened'
export { githubPRClosedTrigger } from './pr_closed'
export { githubPRCommentTrigger } from './pr_comment'
export { githubPRMergedTrigger } from './pr_merged'
export { githubPROpenedTrigger } from './pr_opened'
export { githubPRReviewedTrigger } from './pr_reviewed'
export { githubPushTrigger } from './push'
export { githubReleasePublishedTrigger } from './release_published'
export { githubWebhookTrigger } from './webhook'
export { githubWorkflowRunTrigger } from './workflow_run'
```

--------------------------------------------------------------------------------

---[FILE: issue_closed.ts]---
Location: sim-main/apps/sim/triggers/github/issue_closed.ts

```typescript
import { GithubIcon } from '@/components/icons'
import type { TriggerConfig } from '@/triggers/types'

export const githubIssueClosedTrigger: TriggerConfig = {
  id: 'github_issue_closed',
  name: 'GitHub Issue Closed',
  provider: 'github',
  description: 'Trigger workflow when an issue is closed in a GitHub repository',
  version: '1.0.0',
  icon: GithubIcon,

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
        value: 'github_issue_closed',
      },
    },
    {
      id: 'contentType',
      title: 'Content Type',
      type: 'dropdown',
      options: [
        { label: 'application/json', id: 'application/json' },
        {
          label: 'application/x-www-form-urlencoded',
          id: 'application/x-www-form-urlencoded',
        },
      ],
      defaultValue: 'application/json',
      description: 'Format GitHub will use when sending the webhook payload.',
      required: true,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'github_issue_closed',
      },
    },
    {
      id: 'webhookSecret',
      title: 'Webhook Secret',
      type: 'short-input',
      placeholder: 'Generate or enter a strong secret',
      description: 'Validates that webhook deliveries originate from GitHub.',
      password: true,
      required: false,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'github_issue_closed',
      },
    },
    {
      id: 'sslVerification',
      title: 'SSL Verification',
      type: 'dropdown',
      options: [
        { label: 'Enabled', id: 'enabled' },
        { label: 'Disabled', id: 'disabled' },
      ],
      defaultValue: 'enabled',
      description: 'GitHub verifies SSL certificates when delivering webhooks.',
      required: true,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'github_issue_closed',
      },
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      hideFromPreview: true,
      type: 'text',
      defaultValue: [
        'Go to your GitHub Repository > Settings > Webhooks.',
        'Click "Add webhook".',
        'Paste the <strong>Webhook URL</strong> above into the "Payload URL" field.',
        'Select your chosen Content Type from the dropdown.',
        'Enter the <strong>Webhook Secret</strong> into the "Secret" field if you\'ve configured one.',
        'Set SSL verification according to your selection.',
        'Select "Let me select individual events" and check <strong>issues</strong> (<strong>closed</strong> action).',
        'Ensure "Active" is checked and click "Add webhook".',
      ]
        .map(
          (instruction, index) =>
            `<div class="mb-3"><strong>${index + 1}.</strong> ${instruction}</div>`
        )
        .join(''),
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'github_issue_closed',
      },
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      hideFromPreview: true,
      mode: 'trigger',
      triggerId: 'github_issue_closed',
      condition: {
        field: 'selectedTriggerId',
        value: 'github_issue_closed',
      },
    },
  ],

  outputs: {
    action: {
      type: 'string',
      description: 'Action performed (opened, closed, reopened, edited, etc.)',
    },
    issue: {
      id: {
        type: 'number',
        description: 'Issue ID',
      },
      node_id: {
        type: 'string',
        description: 'Issue node ID',
      },
      number: {
        type: 'number',
        description: 'Issue number',
      },
      title: {
        type: 'string',
        description: 'Issue title',
      },
      body: {
        type: 'string',
        description: 'Issue body/description',
      },
      state: {
        type: 'string',
        description: 'Issue state (open, closed)',
      },
      state_reason: {
        type: 'string',
        description: 'Reason for state (completed, not_planned, reopened)',
      },
      html_url: {
        type: 'string',
        description: 'Issue HTML URL',
      },
      user: {
        login: {
          type: 'string',
          description: 'Username',
        },
        id: {
          type: 'number',
          description: 'User ID',
        },
        node_id: {
          type: 'string',
          description: 'User node ID',
        },
        avatar_url: {
          type: 'string',
          description: 'Avatar URL',
        },
        html_url: {
          type: 'string',
          description: 'Profile URL',
        },
        user_type: {
          type: 'string',
          description: 'User type (User, Bot, Organization)',
        },
      },
      labels: {
        type: 'array',
        description: 'Array of label objects',
      },
      assignees: {
        type: 'array',
        description: 'Array of assigned users',
      },
      milestone: {
        type: 'object',
        description: 'Milestone object if assigned',
      },
      created_at: {
        type: 'string',
        description: 'Issue creation timestamp',
      },
      updated_at: {
        type: 'string',
        description: 'Issue last update timestamp',
      },
      closed_at: {
        type: 'string',
        description: 'Issue closed timestamp',
      },
    },
    repository: {
      id: {
        type: 'number',
        description: 'Repository ID',
      },
      node_id: {
        type: 'string',
        description: 'Repository node ID',
      },
      name: {
        type: 'string',
        description: 'Repository name',
      },
      full_name: {
        type: 'string',
        description: 'Repository full name (owner/repo)',
      },
      private: {
        type: 'boolean',
        description: 'Whether the repository is private',
      },
      html_url: {
        type: 'string',
        description: 'Repository HTML URL',
      },
      repo_description: {
        type: 'string',
        description: 'Repository description',
      },
      fork: {
        type: 'boolean',
        description: 'Whether the repository is a fork',
      },
      url: {
        type: 'string',
        description: 'Repository API URL',
      },
      homepage: {
        type: 'string',
        description: 'Repository homepage URL',
      },
      size: {
        type: 'number',
        description: 'Repository size in KB',
      },
      stargazers_count: {
        type: 'number',
        description: 'Number of stars',
      },
      watchers_count: {
        type: 'number',
        description: 'Number of watchers',
      },
      language: {
        type: 'string',
        description: 'Primary programming language',
      },
      forks_count: {
        type: 'number',
        description: 'Number of forks',
      },
      open_issues_count: {
        type: 'number',
        description: 'Number of open issues',
      },
      default_branch: {
        type: 'string',
        description: 'Default branch name',
      },
      owner: {
        login: {
          type: 'string',
          description: 'Owner username',
        },
        id: {
          type: 'number',
          description: 'Owner ID',
        },
        avatar_url: {
          type: 'string',
          description: 'Owner avatar URL',
        },
        html_url: {
          type: 'string',
          description: 'Owner profile URL',
        },
        owner_type: {
          type: 'string',
          description: 'Owner type (User, Organization)',
        },
      },
    },
    sender: {
      login: {
        type: 'string',
        description: 'Username',
      },
      id: {
        type: 'number',
        description: 'User ID',
      },
      node_id: {
        type: 'string',
        description: 'User node ID',
      },
      avatar_url: {
        type: 'string',
        description: 'Avatar URL',
      },
      html_url: {
        type: 'string',
        description: 'Profile URL',
      },
      user_type: {
        type: 'string',
        description: 'User type (User, Bot, Organization)',
      },
    },
  },

  webhook: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-GitHub-Event': 'issues',
      'X-GitHub-Delivery': 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      'X-Hub-Signature-256': 'sha256=...',
    },
  },
}
```

--------------------------------------------------------------------------------

````
