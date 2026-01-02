---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 796
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 796 of 933)

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

---[FILE: webhook.ts]---
Location: sim-main/apps/sim/triggers/linear/webhook.ts

```typescript
import { LinearIcon } from '@/components/icons'
import { linearSetupInstructions, userOutputs } from '@/triggers/linear/utils'
import type { TriggerConfig } from '@/triggers/types'

export const linearWebhookTrigger: TriggerConfig = {
  id: 'linear_webhook',
  name: 'Linear Webhook',
  provider: 'linear',
  description: 'Trigger workflow from any Linear webhook event',
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
        value: 'linear_webhook',
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
        value: 'linear_webhook',
      },
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      hideFromPreview: true,
      type: 'text',
      defaultValue: linearSetupInstructions(
        'all events',
        'This webhook will receive all Linear events. Use the <code>type</code> and <code>action</code> fields in the payload to filter and handle different event types.'
      ),
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_webhook',
      },
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      hideFromPreview: true,
      mode: 'trigger',
      triggerId: 'linear_webhook',
      condition: {
        field: 'selectedTriggerId',
        value: 'linear_webhook',
      },
    },
  ],

  outputs: {
    action: {
      type: 'string',
      description: 'Action performed (create, update, remove)',
    },
    type: {
      type: 'string',
      description: 'Entity type (Issue, Comment, Project, Cycle, IssueLabel, ProjectUpdate, etc.)',
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
      type: 'object',
      description: 'Complete entity data object',
    },
    updatedFrom: {
      type: 'object',
      description: 'Previous values for changed fields (only present on update)',
    },
  },

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

---[FILE: chat_webhook.ts]---
Location: sim-main/apps/sim/triggers/microsoftteams/chat_webhook.ts

```typescript
import { MicrosoftTeamsIcon } from '@/components/icons'
import type { TriggerConfig } from '@/triggers/types'

export const microsoftTeamsChatSubscriptionTrigger: TriggerConfig = {
  id: 'microsoftteams_chat_subscription',
  name: 'Microsoft Teams Chat',
  provider: 'microsoft-teams',
  description:
    'Trigger workflow from new messages in Microsoft Teams chats via Microsoft Graph subscriptions',
  version: '1.0.0',
  icon: MicrosoftTeamsIcon,

  subBlocks: [
    {
      id: 'triggerCredentials',
      title: 'Credentials',
      type: 'oauth-input',
      description: 'This trigger requires microsoft teams credentials to access your account.',
      serviceId: 'microsoft-teams',
      requiredScopes: [
        'openid',
        'profile',
        'email',
        'User.Read',
        'Chat.Read',
        'Chat.ReadWrite',
        'Chat.ReadBasic',
        'ChatMessage.Send',
        'Channel.ReadBasic.All',
        'ChannelMessage.Send',
        'ChannelMessage.Read.All',
        'ChannelMessage.ReadWrite',
        'ChannelMember.Read.All',
        'Group.Read.All',
        'Group.ReadWrite.All',
        'Team.ReadBasic.All',
        'TeamMember.Read.All',
        'offline_access',
        'Files.Read',
        'Sites.Read.All',
      ],
      required: true,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'microsoftteams_chat_subscription',
      },
    },
    {
      id: 'chatId',
      title: 'Chat ID',
      type: 'short-input',
      placeholder: 'Enter chat ID',
      description: 'The ID of the Teams chat to monitor',
      required: true,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'microsoftteams_chat_subscription',
      },
    },
    {
      id: 'includeAttachments',
      title: 'Include Attachments',
      type: 'switch',
      defaultValue: true,
      description: 'Fetch hosted contents and upload to storage',
      required: false,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'microsoftteams_chat_subscription',
      },
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      hideFromPreview: true,
      type: 'text',
      defaultValue: [
        'Connect your Microsoft Teams account and grant the required permissions.',
        'Enter the Chat ID of the Teams chat you want to monitor.',
        'We will create a Microsoft Graph change notification subscription that delivers chat message events to your Sim webhook URL.',
      ]
        .map(
          (instruction, index) =>
            `<div class="mb-3"><strong>${index + 1}.</strong> ${instruction}</div>`
        )
        .join(''),
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'microsoftteams_chat_subscription',
      },
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      hideFromPreview: true,
      mode: 'trigger',
      triggerId: 'microsoftteams_chat_subscription',
      condition: {
        field: 'selectedTriggerId',
        value: 'microsoftteams_chat_subscription',
      },
    },
  ],

  outputs: {
    message_id: { type: 'string', description: 'Message ID' },
    chat_id: { type: 'string', description: 'Chat ID' },
    from_name: { type: 'string', description: 'Sender display name' },
    text: { type: 'string', description: 'Message body (HTML or text)' },
    created_at: { type: 'string', description: 'Message timestamp' },
    attachments: { type: 'file[]', description: 'Uploaded attachments as files' },
  },

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
Location: sim-main/apps/sim/triggers/microsoftteams/index.ts

```typescript
export { microsoftTeamsChatSubscriptionTrigger } from './chat_webhook'
export { microsoftTeamsWebhookTrigger } from './webhook'
```

--------------------------------------------------------------------------------

---[FILE: webhook.ts]---
Location: sim-main/apps/sim/triggers/microsoftteams/webhook.ts

```typescript
import { MicrosoftTeamsIcon } from '@/components/icons'
import type { TriggerConfig } from '../types'

export const microsoftTeamsWebhookTrigger: TriggerConfig = {
  id: 'microsoftteams_webhook',
  name: 'Microsoft Teams Channel',
  provider: 'microsoft-teams',
  description: 'Trigger workflow from Microsoft Teams channel messages via outgoing webhooks',
  version: '1.0.0',
  icon: MicrosoftTeamsIcon,

  subBlocks: [
    {
      id: 'selectedTriggerId',
      title: 'Trigger Type',
      type: 'dropdown',
      mode: 'trigger',
      options: [
        { label: 'Microsoft Teams Channel', id: 'microsoftteams_webhook' },
        { label: 'Microsoft Teams Chat', id: 'microsoftteams_chat_subscription' },
      ],
      value: () => 'microsoftteams_webhook',
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
        value: 'microsoftteams_webhook',
      },
    },
    {
      id: 'hmacSecret',
      title: 'HMAC Secret',
      type: 'short-input',
      placeholder: 'Enter HMAC secret from Teams',
      description:
        'The security token provided by Teams when creating an outgoing webhook. Used to verify request authenticity.',
      password: true,
      required: true,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'microsoftteams_webhook',
      },
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      hideFromPreview: true,
      type: 'text',
      defaultValue: [
        'Open Microsoft Teams and go to the team where you want to add the webhook.',
        'Click the three dots (•••) next to the team name and select "Manage team".',
        'Go to the "Apps" tab and click "Create an outgoing webhook".',
        'Provide a name, description, and optionally a profile picture.',
        'Set the callback URL to your Sim webhook URL above.',
        'Copy the HMAC security token and paste it into the "HMAC Secret" field.',
        'Click "Create" to finish setup.',
      ]
        .map(
          (instruction, index) =>
            `<div class="mb-3"><strong>${index + 1}.</strong> ${instruction}</div>`
        )
        .join(''),
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'microsoftteams_webhook',
      },
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      hideFromPreview: true,
      mode: 'trigger',
      triggerId: 'microsoftteams_webhook',
      condition: {
        field: 'selectedTriggerId',
        value: 'microsoftteams_webhook',
      },
    },
  ],

  outputs: {
    from: {
      id: { type: 'string', description: 'Sender ID' },
      name: { type: 'string', description: 'Sender name' },
      aadObjectId: { type: 'string', description: 'AAD Object ID' },
    },
    message: {
      raw: {
        attachments: { type: 'array', description: 'Array of attachments' },
        channelData: {
          team: { id: { type: 'string', description: 'Team ID' } },
          tenant: { id: { type: 'string', description: 'Tenant ID' } },
          channel: { id: { type: 'string', description: 'Channel ID' } },
          teamsTeamId: { type: 'string', description: 'Teams team ID' },
          teamsChannelId: { type: 'string', description: 'Teams channel ID' },
        },
        conversation: {
          id: { type: 'string', description: 'Composite conversation ID' },
          name: { type: 'string', description: 'Conversation name (nullable)' },
          isGroup: { type: 'boolean', description: 'Is group conversation' },
          tenantId: { type: 'string', description: 'Tenant ID' },
          aadObjectId: { type: 'string', description: 'AAD Object ID (nullable)' },
          conversationType: { type: 'string', description: 'Conversation type (channel)' },
        },
        text: { type: 'string', description: 'Message text content' },
        messageType: { type: 'string', description: 'Message type' },
        channelId: { type: 'string', description: 'Channel ID (msteams)' },
        timestamp: { type: 'string', description: 'Timestamp' },
      },
    },
    activity: { type: 'object', description: 'Activity payload' },
    conversation: {
      id: { type: 'string', description: 'Composite conversation ID' },
      name: { type: 'string', description: 'Conversation name (nullable)' },
      isGroup: { type: 'boolean', description: 'Is group conversation' },
      tenantId: { type: 'string', description: 'Tenant ID' },
      aadObjectId: { type: 'string', description: 'AAD Object ID (nullable)' },
      conversationType: { type: 'string', description: 'Conversation type (channel)' },
    },
  },

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
Location: sim-main/apps/sim/triggers/outlook/index.ts

```typescript
export { outlookPollingTrigger } from './poller'
```

--------------------------------------------------------------------------------

---[FILE: poller.ts]---
Location: sim-main/apps/sim/triggers/outlook/poller.ts

```typescript
import { OutlookIcon } from '@/components/icons'
import { createLogger } from '@/lib/logs/console/logger'
import { useSubBlockStore } from '@/stores/workflows/subblock/store'
import type { TriggerConfig } from '@/triggers/types'

const logger = createLogger('OutlookPollingTrigger')

export const outlookPollingTrigger: TriggerConfig = {
  id: 'outlook_poller',
  name: 'Outlook Email Trigger',
  provider: 'outlook',
  description: 'Triggers when new emails are received in Outlook (requires Microsoft credentials)',
  version: '1.0.0',
  icon: OutlookIcon,

  subBlocks: [
    {
      id: 'triggerCredentials',
      title: 'Credentials',
      type: 'oauth-input',
      description: 'This trigger requires outlook credentials to access your account.',
      serviceId: 'outlook',
      requiredScopes: [],
      required: true,
      mode: 'trigger',
    },
    {
      id: 'folderIds',
      title: 'Outlook Folders to Monitor',
      type: 'dropdown',
      multiSelect: true,
      placeholder: 'Select Outlook folders to monitor for new emails',
      description: 'Choose which Outlook folders to monitor. Leave empty to monitor all emails.',
      required: false,
      options: [], // Will be populated dynamically
      fetchOptions: async (blockId: string, subBlockId: string) => {
        const credentialId = useSubBlockStore.getState().getValue(blockId, 'triggerCredentials') as
          | string
          | null
        if (!credentialId) {
          throw new Error('No Outlook credential selected')
        }
        try {
          const response = await fetch(`/api/tools/outlook/folders?credentialId=${credentialId}`)
          if (!response.ok) {
            throw new Error('Failed to fetch Outlook folders')
          }
          const data = await response.json()
          if (data.folders && Array.isArray(data.folders)) {
            return data.folders.map((folder: { id: string; name: string }) => ({
              id: folder.id,
              label: folder.name,
            }))
          }
          return []
        } catch (error) {
          logger.error('Error fetching Outlook folders:', error)
          throw error
        }
      },
      dependsOn: ['triggerCredentials'],
      mode: 'trigger',
    },
    {
      id: 'folderFilterBehavior',
      title: 'Folder Filter Behavior',
      type: 'dropdown',
      options: [
        { label: 'INCLUDE', id: 'INCLUDE' },
        { label: 'EXCLUDE', id: 'EXCLUDE' },
      ],
      defaultValue: 'INCLUDE',
      description:
        'Include only emails from selected folders, or exclude emails from selected folders',
      required: true,
      mode: 'trigger',
    },
    {
      id: 'markAsRead',
      title: 'Mark as Read',
      type: 'switch',
      defaultValue: false,
      description: 'Automatically mark emails as read after processing',
      required: false,
      mode: 'trigger',
    },
    {
      id: 'includeAttachments',
      title: 'Include Attachments',
      type: 'switch',
      defaultValue: false,
      description: 'Download and include email attachments in the trigger payload',
      required: false,
      mode: 'trigger',
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      hideFromPreview: true,
      type: 'text',
      defaultValue: [
        'Connect your Microsoft account using OAuth credentials',
        'Configure which Outlook folders to monitor (optional)',
        'The system will automatically check for new emails and trigger your workflow',
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
      triggerId: 'outlook_poller',
    },
  ],

  outputs: {
    email: {
      id: {
        type: 'string',
        description: 'Outlook message ID',
      },
      conversationId: {
        type: 'string',
        description: 'Outlook conversation ID',
      },
      subject: {
        type: 'string',
        description: 'Email subject line',
      },
      from: {
        type: 'string',
        description: 'Sender email address',
      },
      to: {
        type: 'string',
        description: 'Recipient email address',
      },
      cc: {
        type: 'string',
        description: 'CC recipients',
      },
      date: {
        type: 'string',
        description: 'Email date in ISO format',
      },
      bodyText: {
        type: 'string',
        description: 'Plain text email body',
      },
      bodyHtml: {
        type: 'string',
        description: 'HTML email body',
      },
      hasAttachments: {
        type: 'boolean',
        description: 'Whether email has attachments',
      },
      attachments: {
        type: 'file[]',
        description: 'Array of email attachments as files (if includeAttachments is enabled)',
      },
      isRead: {
        type: 'boolean',
        description: 'Whether email is read',
      },
      folderId: {
        type: 'string',
        description: 'Outlook folder ID where email is located',
      },
      messageId: {
        type: 'string',
        description: 'Message ID for threading',
      },
      threadId: {
        type: 'string',
        description: 'Thread ID for conversation threading',
      },
    },
    timestamp: {
      type: 'string',
      description: 'Event timestamp',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/triggers/rss/index.ts

```typescript
export { rssPollingTrigger } from './poller'
```

--------------------------------------------------------------------------------

---[FILE: poller.ts]---
Location: sim-main/apps/sim/triggers/rss/poller.ts

```typescript
import { RssIcon } from '@/components/icons'
import type { TriggerConfig } from '@/triggers/types'

export const rssPollingTrigger: TriggerConfig = {
  id: 'rss_poller',
  name: 'RSS Feed Trigger',
  provider: 'rss',
  description: 'Triggers when new items are published to an RSS feed',
  version: '1.0.0',
  icon: RssIcon,

  subBlocks: [
    {
      id: 'feedUrl',
      title: 'Feed URL',
      type: 'short-input',
      placeholder: 'https://example.com/feed.xml',
      description: 'The URL of the RSS or Atom feed to monitor',
      required: true,
      mode: 'trigger',
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      hideFromPreview: true,
      type: 'text',
      defaultValue: [
        'Enter the URL of any RSS or Atom feed you want to monitor',
        'The feed will be checked every minute for new items',
        'When a new item is published, your workflow will be triggered with the item data',
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
      triggerId: 'rss_poller',
    },
  ],

  outputs: {
    item: {
      title: {
        type: 'string',
        description: 'Item title',
      },
      link: {
        type: 'string',
        description: 'Item link/URL',
      },
      pubDate: {
        type: 'string',
        description: 'Publication date',
      },
      guid: {
        type: 'string',
        description: 'Unique identifier',
      },
      summary: {
        type: 'string',
        description: 'Item description/summary',
      },
      content: {
        type: 'string',
        description: 'Full content (content:encoded)',
      },
      contentSnippet: {
        type: 'string',
        description: 'Content snippet without HTML',
      },
      author: {
        type: 'string',
        description: 'Author name',
      },
      categories: {
        type: 'json',
        description: 'Categories/tags array',
      },
      enclosure: {
        type: 'json',
        description: 'Media attachment info (url, type, length)',
      },
      isoDate: {
        type: 'string',
        description: 'Publication date in ISO format',
      },
    },
    feed: {
      title: {
        type: 'string',
        description: 'Feed title',
      },
      link: {
        type: 'string',
        description: 'Feed website link',
      },
      feedDescription: {
        type: 'string',
        description: 'Feed description',
      },
    },
    timestamp: {
      type: 'string',
      description: 'Event timestamp',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/triggers/slack/index.ts

```typescript
export { slackWebhookTrigger } from './webhook'
```

--------------------------------------------------------------------------------

---[FILE: webhook.ts]---
Location: sim-main/apps/sim/triggers/slack/webhook.ts

```typescript
import { SlackIcon } from '@/components/icons'
import type { TriggerConfig } from '@/triggers/types'

export const slackWebhookTrigger: TriggerConfig = {
  id: 'slack_webhook',
  name: 'Slack Webhook',
  provider: 'slack',
  description: 'Trigger workflow from Slack events like mentions, messages, and reactions',
  version: '1.0.0',
  icon: SlackIcon,

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
      id: 'signingSecret',
      title: 'Signing Secret',
      type: 'short-input',
      placeholder: 'Enter your Slack app signing secret',
      description: 'The signing secret from your Slack app to validate request authenticity.',
      password: true,
      required: true,
      mode: 'trigger',
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      type: 'text',
      defaultValue: [
        'Go to <a href="https://api.slack.com/apps" target="_blank" rel="noopener noreferrer" class="text-muted-foreground underline transition-colors hover:text-muted-foreground/80">Slack Apps page</a>',
        'If you don\'t have an app:<br><ul class="mt-1 ml-5 list-disc"><li>Create an app from scratch</li><li>Give it a name and select your workspace</li></ul>',
        'Go to "Basic Information", find the "Signing Secret", and paste it in the field above.',
        'Go to "OAuth & Permissions" and add bot token scopes:<br><ul class="mt-1 ml-5 list-disc"><li><code>app_mentions:read</code> - For viewing messages that tag your bot with an @</li><li><code>chat:write</code> - To send messages to channels your bot is a part of</li></ul>',
        'Go to "Event Subscriptions":<br><ul class="mt-1 ml-5 list-disc"><li>Enable events</li><li>Under "Subscribe to Bot Events", add <code>app_mention</code> to listen to messages that mention your bot</li><li>Paste the Webhook URL above into the "Request URL" field</li></ul>',
        'Go to "Install App" in the left sidebar and install the app into your desired Slack workspace and channel.',
        'Save changes in both Slack and here.',
      ]
        .map(
          (instruction, index) =>
            `<div class="mb-3"><strong>${index + 1}.</strong> ${instruction}</div>`
        )
        .join(''),
      hideFromPreview: true,
      mode: 'trigger',
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      hideFromPreview: true,
      mode: 'trigger',
      triggerId: 'slack_webhook',
    },
  ],

  outputs: {
    event: {
      event_type: {
        type: 'string',
        description: 'Type of Slack event (e.g., app_mention, message)',
      },
      channel: {
        type: 'string',
        description: 'Slack channel ID where the event occurred',
      },
      channel_name: {
        type: 'string',
        description: 'Human-readable channel name',
      },
      user: {
        type: 'string',
        description: 'User ID who triggered the event',
      },
      user_name: {
        type: 'string',
        description: 'Username who triggered the event',
      },
      text: {
        type: 'string',
        description: 'Message text content',
      },
      timestamp: {
        type: 'string',
        description: 'Message timestamp from the triggering event',
      },
      thread_ts: {
        type: 'string',
        description: 'Parent thread timestamp (if message is in a thread)',
      },
      team_id: {
        type: 'string',
        description: 'Slack workspace/team ID',
      },
      event_id: {
        type: 'string',
        description: 'Unique event identifier',
      },
    },
  },

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
Location: sim-main/apps/sim/triggers/stripe/index.ts

```typescript
export { stripeWebhookTrigger } from './webhook'
```

--------------------------------------------------------------------------------

---[FILE: webhook.ts]---
Location: sim-main/apps/sim/triggers/stripe/webhook.ts

```typescript
import { StripeIcon } from '@/components/icons'
import type { TriggerConfig } from '@/triggers/types'

export const stripeWebhookTrigger: TriggerConfig = {
  id: 'stripe_webhook',
  name: 'Stripe Webhook',
  provider: 'stripe',
  description: 'Triggers when Stripe events occur (payments, subscriptions, invoices, etc.)',
  version: '1.0.0',
  icon: StripeIcon,

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
      id: 'eventTypes',
      title: 'Event Types to Listen For',
      type: 'dropdown',
      multiSelect: true,
      options: [
        // Payment Intents
        { label: 'payment_intent.succeeded', id: 'payment_intent.succeeded' },
        { label: 'payment_intent.created', id: 'payment_intent.created' },
        { label: 'payment_intent.payment_failed', id: 'payment_intent.payment_failed' },
        { label: 'payment_intent.canceled', id: 'payment_intent.canceled' },
        {
          label: 'payment_intent.amount_capturable_updated',
          id: 'payment_intent.amount_capturable_updated',
        },
        { label: 'payment_intent.processing', id: 'payment_intent.processing' },
        { label: 'payment_intent.requires_action', id: 'payment_intent.requires_action' },

        // Charges
        { label: 'charge.succeeded', id: 'charge.succeeded' },
        { label: 'charge.failed', id: 'charge.failed' },
        { label: 'charge.captured', id: 'charge.captured' },
        { label: 'charge.refunded', id: 'charge.refunded' },
        { label: 'charge.updated', id: 'charge.updated' },
        { label: 'charge.dispute.created', id: 'charge.dispute.created' },
        { label: 'charge.dispute.closed', id: 'charge.dispute.closed' },
        { label: 'charge.expired', id: 'charge.expired' },
        { label: 'charge.dispute.funds_withdrawn', id: 'charge.dispute.funds_withdrawn' },
        { label: 'charge.dispute.funds_reinstated', id: 'charge.dispute.funds_reinstated' },

        // Customers
        { label: 'customer.created', id: 'customer.created' },
        { label: 'customer.updated', id: 'customer.updated' },
        { label: 'customer.deleted', id: 'customer.deleted' },
        { label: 'customer.source.created', id: 'customer.source.created' },
        { label: 'customer.source.updated', id: 'customer.source.updated' },
        { label: 'customer.source.deleted', id: 'customer.source.deleted' },
        { label: 'customer.subscription.created', id: 'customer.subscription.created' },
        { label: 'customer.subscription.updated', id: 'customer.subscription.updated' },
        { label: 'customer.subscription.deleted', id: 'customer.subscription.deleted' },
        { label: 'customer.discount.created', id: 'customer.discount.created' },
        { label: 'customer.discount.deleted', id: 'customer.discount.deleted' },
        { label: 'customer.discount.updated', id: 'customer.discount.updated' },

        // Subscriptions
        {
          label: 'customer.subscription.trial_will_end',
          id: 'customer.subscription.trial_will_end',
        },
        { label: 'customer.subscription.paused', id: 'customer.subscription.paused' },
        { label: 'customer.subscription.resumed', id: 'customer.subscription.resumed' },

        // Invoices
        { label: 'invoice.created', id: 'invoice.created' },
        { label: 'invoice.finalized', id: 'invoice.finalized' },
        { label: 'invoice.finalization_failed', id: 'invoice.finalization_failed' },
        { label: 'invoice.paid', id: 'invoice.paid' },
        { label: 'invoice.payment_failed', id: 'invoice.payment_failed' },
        { label: 'invoice.payment_succeeded', id: 'invoice.payment_succeeded' },
        { label: 'invoice.payment_action_required', id: 'invoice.payment_action_required' },
        { label: 'invoice.sent', id: 'invoice.sent' },
        { label: 'invoice.upcoming', id: 'invoice.upcoming' },
        { label: 'invoice.updated', id: 'invoice.updated' },
        { label: 'invoice.voided', id: 'invoice.voided' },
        { label: 'invoice.marked_uncollectible', id: 'invoice.marked_uncollectible' },
        { label: 'invoice.overdue', id: 'invoice.overdue' },

        // Products & Prices
        { label: 'product.created', id: 'product.created' },
        { label: 'product.updated', id: 'product.updated' },
        { label: 'product.deleted', id: 'product.deleted' },
        { label: 'price.created', id: 'price.created' },
        { label: 'price.updated', id: 'price.updated' },
        { label: 'price.deleted', id: 'price.deleted' },

        // Payment Methods
        { label: 'payment_method.attached', id: 'payment_method.attached' },
        { label: 'payment_method.detached', id: 'payment_method.detached' },
        { label: 'payment_method.updated', id: 'payment_method.updated' },
        {
          label: 'payment_method.automatically_updated',
          id: 'payment_method.automatically_updated',
        },

        // Setup Intents
        { label: 'setup_intent.succeeded', id: 'setup_intent.succeeded' },
        { label: 'setup_intent.setup_failed', id: 'setup_intent.setup_failed' },
        { label: 'setup_intent.canceled', id: 'setup_intent.canceled' },

        // Refunds
        { label: 'refund.created', id: 'refund.created' },
        { label: 'refund.updated', id: 'refund.updated' },
        { label: 'refund.failed', id: 'refund.failed' },

        // Checkout Sessions
        { label: 'checkout.session.completed', id: 'checkout.session.completed' },
        { label: 'checkout.session.expired', id: 'checkout.session.expired' },
        {
          label: 'checkout.session.async_payment_succeeded',
          id: 'checkout.session.async_payment_succeeded',
        },
        {
          label: 'checkout.session.async_payment_failed',
          id: 'checkout.session.async_payment_failed',
        },

        // Payouts
        { label: 'payout.created', id: 'payout.created' },
        { label: 'payout.updated', id: 'payout.updated' },
        { label: 'payout.paid', id: 'payout.paid' },
        { label: 'payout.failed', id: 'payout.failed' },
        { label: 'payout.canceled', id: 'payout.canceled' },

        // Coupons
        { label: 'coupon.created', id: 'coupon.created' },
        { label: 'coupon.updated', id: 'coupon.updated' },
        { label: 'coupon.deleted', id: 'coupon.deleted' },

        // Credit Notes
        { label: 'credit_note.created', id: 'credit_note.created' },
        { label: 'credit_note.updated', id: 'credit_note.updated' },
        { label: 'credit_note.voided', id: 'credit_note.voided' },

        // Account
        { label: 'account.updated', id: 'account.updated' },
        { label: 'account.application.deauthorized', id: 'account.application.deauthorized' },

        // Balance
        { label: 'balance.available', id: 'balance.available' },
      ],
      placeholder: 'Leave empty to receive all events',
      description:
        'Select specific Stripe events to filter. Leave empty to receive all events from Stripe.',
      mode: 'trigger',
    },
    {
      id: 'webhookSecret',
      title: 'Webhook Signing Secret',
      type: 'short-input',
      placeholder: 'whsec_...',
      description:
        'Your webhook signing secret from Stripe Dashboard. Used to verify webhook authenticity.',
      password: true,
      mode: 'trigger',
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      hideFromPreview: true,
      type: 'text',
      defaultValue: [
        'Go to your Stripe Dashboard at <a href="https://dashboard.stripe.com/webhooks" target="_blank" rel="noopener noreferrer">https://dashboard.stripe.com/webhooks</a>',
        'Click "Add destination" button',
        'In "Events to send", select the events you want to listen to (must match the events selected above, or select "Select all events" to receive everything)',
        'Select `Webhook Endpoint`, press continue, and paste the <strong>Webhook URL</strong> above into the "Endpoint URL" field',
        'Click "Create Destination" to save',
        'After creating the endpoint, click "Reveal" next to "Signing secret" and copy it',
        'Paste the signing secret into the <strong>Webhook Signing Secret</strong> field above',
        'Click "Save" to activate your webhook trigger',
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
      triggerId: 'stripe_webhook',
    },
  ],

  outputs: {
    id: {
      type: 'string',
      description: 'Unique identifier for the event',
    },
    type: {
      type: 'string',
      description: 'Event type (e.g., payment_intent.succeeded, customer.created, invoice.paid)',
    },
    object: {
      type: 'string',
      description: 'Always "event"',
    },
    api_version: {
      type: 'string',
      description: 'Stripe API version used to render the event',
    },
    created: {
      type: 'number',
      description: 'Unix timestamp when the event was created',
    },
    data: {
      type: 'json',
      description: 'Event data containing the affected Stripe object',
    },
    livemode: {
      type: 'boolean',
      description: 'Whether this event occurred in live mode (true) or test mode (false)',
    },
    pending_webhooks: {
      type: 'number',
      description: 'Number of webhooks yet to be delivered for this event',
    },
    request: {
      type: 'json',
      description: 'Information about the request that triggered this event',
    },
  },

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
Location: sim-main/apps/sim/triggers/telegram/index.ts

```typescript
export { telegramWebhookTrigger } from './webhook'
```

--------------------------------------------------------------------------------

````
