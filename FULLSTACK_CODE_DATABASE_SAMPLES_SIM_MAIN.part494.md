---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 494
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 494 of 933)

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

---[FILE: wait.ts]---
Location: sim-main/apps/sim/blocks/blocks/wait.ts
Signals: React

```typescript
import type { SVGProps } from 'react'
import { createElement } from 'react'
import { PauseCircle } from 'lucide-react'
import type { BlockConfig } from '@/blocks/types'

const WaitIcon = (props: SVGProps<SVGSVGElement>) => createElement(PauseCircle, props)

export const WaitBlock: BlockConfig = {
  type: 'wait',
  name: 'Wait',
  description: 'Pause workflow execution for a specified time delay',
  longDescription:
    'Pauses workflow execution for a specified time interval. The wait executes a simple sleep for the configured duration.',
  bestPractices: `
  - Use for simple time delays (max 10 minutes)
  - Configure the wait amount and unit (seconds or minutes)
  - Time-based waits are interruptible via workflow cancellation
  - Enter a positive number for the wait amount
  `,
  category: 'blocks',
  bgColor: '#F59E0B',
  icon: WaitIcon,
  docsLink: 'https://docs.sim.ai/blocks/wait',
  subBlocks: [
    {
      id: 'timeValue',
      title: 'Wait Amount',
      type: 'short-input',
      description: 'Max: 600 seconds or 10 minutes',
      placeholder: '10',
      value: () => '10',
      required: true,
    },
    {
      id: 'timeUnit',
      title: 'Unit',
      type: 'dropdown',
      options: [
        { label: 'Seconds', id: 'seconds' },
        { label: 'Minutes', id: 'minutes' },
      ],
      value: () => 'seconds',
      required: true,
    },
  ],
  tools: {
    access: [],
  },
  inputs: {
    timeValue: {
      type: 'string',
      description: 'Wait duration value',
    },
    timeUnit: {
      type: 'string',
      description: 'Wait duration unit (seconds or minutes)',
    },
  },
  outputs: {
    waitDuration: {
      type: 'number',
      description: 'Wait duration in milliseconds',
    },
    status: {
      type: 'string',
      description: 'Status of the wait block (waiting, completed, cancelled)',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: wealthbox.ts]---
Location: sim-main/apps/sim/blocks/blocks/wealthbox.ts

```typescript
import { WealthboxIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { WealthboxResponse } from '@/tools/wealthbox/types'

export const WealthboxBlock: BlockConfig<WealthboxResponse> = {
  type: 'wealthbox',
  name: 'Wealthbox',
  description: 'Interact with Wealthbox',
  authMode: AuthMode.OAuth,
  longDescription:
    'Integrate Wealthbox into the workflow. Can read and write notes, read and write contacts, and read and write tasks.',
  docsLink: 'https://docs.sim.ai/tools/wealthbox',
  category: 'tools',
  bgColor: '#E0E0E0',
  icon: WealthboxIcon,
  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Read Note', id: 'read_note' },
        { label: 'Write Note', id: 'write_note' },
        { label: 'Read Contact', id: 'read_contact' },
        { label: 'Write Contact', id: 'write_contact' },
        { label: 'Read Task', id: 'read_task' },
        { label: 'Write Task', id: 'write_task' },
      ],
      value: () => 'read_note',
    },
    {
      id: 'credential',
      title: 'Wealthbox Account',
      type: 'oauth-input',
      serviceId: 'wealthbox',
      requiredScopes: ['login', 'data'],
      placeholder: 'Select Wealthbox account',
      required: true,
    },
    {
      id: 'noteId',
      title: 'Note ID',
      type: 'short-input',
      placeholder: 'Enter Note ID (optional)',
      condition: { field: 'operation', value: ['read_note'] },
    },
    {
      id: 'contactId',
      title: 'Select Contact',
      type: 'file-selector',
      serviceId: 'wealthbox',
      requiredScopes: ['login', 'data'],
      placeholder: 'Enter Contact ID',
      mode: 'basic',
      canonicalParamId: 'contactId',
      condition: { field: 'operation', value: ['read_contact', 'write_task', 'write_note'] },
    },
    {
      id: 'manualContactId',
      title: 'Contact ID',
      type: 'short-input',
      canonicalParamId: 'contactId',
      placeholder: 'Enter Contact ID',
      mode: 'advanced',
      condition: { field: 'operation', value: ['read_contact', 'write_task', 'write_note'] },
    },
    {
      id: 'taskId',
      title: 'Task ID',
      type: 'short-input',
      placeholder: 'Enter Task ID',
      mode: 'basic',
      canonicalParamId: 'taskId',
      condition: { field: 'operation', value: ['read_task'] },
    },
    {
      id: 'manualTaskId',
      title: 'Task ID',
      type: 'short-input',
      canonicalParamId: 'taskId',
      placeholder: 'Enter Task ID',
      mode: 'advanced',
      condition: { field: 'operation', value: ['read_task'] },
    },
    {
      id: 'title',
      title: 'Title',
      type: 'short-input',
      placeholder: 'Enter Title',
      condition: { field: 'operation', value: ['write_task'] },
      required: true,
    },
    {
      id: 'dueDate',
      title: 'Due Date',
      type: 'short-input',
      placeholder: 'Enter due date (e.g., 2015-05-24 11:00 AM -0400)',
      condition: { field: 'operation', value: ['write_task'] },
      required: true,
    },
    {
      id: 'firstName',
      title: 'First Name',
      type: 'short-input',
      placeholder: 'Enter First Name',
      condition: { field: 'operation', value: ['write_contact'] },
      required: true,
    },
    {
      id: 'lastName',
      title: 'Last Name',
      type: 'short-input',
      placeholder: 'Enter Last Name',
      condition: { field: 'operation', value: ['write_contact'] },
      required: true,
    },
    {
      id: 'emailAddress',
      title: 'Email Address',
      type: 'short-input',
      placeholder: 'Enter Email Address',
      condition: { field: 'operation', value: ['write_contact'] },
    },
    {
      id: 'content',
      title: 'Content',
      type: 'long-input',
      placeholder: 'Enter Content',
      condition: { field: 'operation', value: ['write_note', 'write_event', 'write_task'] },
      required: true,
    },
    {
      id: 'backgroundInformation',
      title: 'Background Information',
      type: 'long-input',
      placeholder: 'Enter Background Information',
      condition: { field: 'operation', value: ['write_contact'] },
    },
  ],
  tools: {
    access: [
      'wealthbox_read_note',
      'wealthbox_write_note',
      'wealthbox_read_contact',
      'wealthbox_write_contact',
      'wealthbox_read_task',
      'wealthbox_write_task',
    ],
    config: {
      tool: (params) => {
        switch (params.operation) {
          case 'read_note':
            return 'wealthbox_read_note'
          case 'write_note':
            return 'wealthbox_write_note'
          case 'read_contact':
            return 'wealthbox_read_contact'
          case 'write_contact':
            return 'wealthbox_write_contact'
          case 'read_task':
            return 'wealthbox_read_task'
          case 'write_task':
            return 'wealthbox_write_task'
          default:
            throw new Error(`Unknown operation: ${params.operation}`)
        }
      },
      params: (params) => {
        const { credential, operation, contactId, manualContactId, taskId, manualTaskId, ...rest } =
          params

        // Handle both selector and manual inputs
        const effectiveContactId = (contactId || manualContactId || '').trim()
        const effectiveTaskId = (taskId || manualTaskId || '').trim()

        const baseParams = {
          ...rest,
          credential,
        }

        if (operation === 'read_note' || operation === 'write_note') {
          return {
            ...baseParams,
            noteId: params.noteId,
            contactId: effectiveContactId,
          }
        }
        if (operation === 'read_contact') {
          if (!effectiveContactId) {
            throw new Error('Contact ID is required for contact operations')
          }
          return {
            ...baseParams,
            contactId: effectiveContactId,
          }
        }
        if (operation === 'read_task') {
          if (!taskId?.trim()) {
            throw new Error('Task ID is required for task operations')
          }
          return {
            ...baseParams,
            taskId: taskId.trim(),
          }
        }
        if (operation === 'write_task' || operation === 'write_note') {
          if (!contactId?.trim()) {
            throw new Error('Contact ID is required for this operation')
          }
          return {
            ...baseParams,
            contactId: contactId.trim(),
          }
        }

        return baseParams
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    credential: { type: 'string', description: 'Wealthbox access token' },
    noteId: { type: 'string', description: 'Note identifier' },
    contactId: { type: 'string', description: 'Contact identifier' },
    manualContactId: { type: 'string', description: 'Manual contact identifier' },
    taskId: { type: 'string', description: 'Task identifier' },
    manualTaskId: { type: 'string', description: 'Manual task identifier' },
    content: { type: 'string', description: 'Content text' },
    firstName: { type: 'string', description: 'First name' },
    lastName: { type: 'string', description: 'Last name' },
    emailAddress: { type: 'string', description: 'Email address' },
    backgroundInformation: { type: 'string', description: 'Background information' },
    title: { type: 'string', description: 'Task title' },
    dueDate: { type: 'string', description: 'Due date' },
  },
  outputs: {
    note: {
      type: 'json',
      description: 'Single note object with ID, content, creator, and linked contacts',
    },
    notes: { type: 'json', description: 'Array of note objects from bulk read operations' },
    contact: {
      type: 'json',
      description: 'Single contact object with name, email, phone, and background info',
    },
    contacts: { type: 'json', description: 'Array of contact objects from bulk read operations' },
    task: {
      type: 'json',
      description: 'Single task object with name, due date, description, and priority',
    },
    tasks: { type: 'json', description: 'Array of task objects from bulk read operations' },
    metadata: {
      type: 'json',
      description: 'Operation metadata including item IDs, types, and operation details',
    },
    success: {
      type: 'boolean',
      description: 'Boolean indicating whether the operation completed successfully',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: webflow.ts]---
Location: sim-main/apps/sim/blocks/blocks/webflow.ts

```typescript
import { WebflowIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { WebflowResponse } from '@/tools/webflow/types'
import { getTrigger } from '@/triggers'

export const WebflowBlock: BlockConfig<WebflowResponse> = {
  type: 'webflow',
  name: 'Webflow',
  description: 'Manage Webflow CMS collections',
  authMode: AuthMode.OAuth,
  longDescription:
    'Integrates Webflow CMS into the workflow. Can create, get, list, update, or delete items in Webflow CMS collections. Manage your Webflow content programmatically. Can be used in trigger mode to trigger workflows when collection items change or forms are submitted.',
  docsLink: 'https://docs.sim.ai/tools/webflow',
  category: 'tools',
  triggerAllowed: true,
  bgColor: '#E0E0E0',
  icon: WebflowIcon,
  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'List Items', id: 'list' },
        { label: 'Get Item', id: 'get' },
        { label: 'Create Item', id: 'create' },
        { label: 'Update Item', id: 'update' },
        { label: 'Delete Item', id: 'delete' },
      ],
      value: () => 'list',
    },
    {
      id: 'credential',
      title: 'Webflow Account',
      type: 'oauth-input',
      serviceId: 'webflow',
      requiredScopes: ['sites:read', 'sites:write', 'cms:read', 'cms:write'],
      placeholder: 'Select Webflow account',
      required: true,
    },
    {
      id: 'siteId',
      title: 'Site',
      type: 'project-selector',
      canonicalParamId: 'siteId',
      serviceId: 'webflow',
      placeholder: 'Select Webflow site',
      dependsOn: ['credential'],
      mode: 'basic',
      required: true,
    },
    {
      id: 'manualSiteId',
      title: 'Site ID',
      type: 'short-input',
      canonicalParamId: 'siteId',
      placeholder: 'Enter site ID',
      mode: 'advanced',
      required: true,
    },
    {
      id: 'collectionId',
      title: 'Collection',
      type: 'file-selector',
      canonicalParamId: 'collectionId',
      serviceId: 'webflow',
      placeholder: 'Select collection',
      dependsOn: ['credential', 'siteId'],
      mode: 'basic',
      required: true,
    },
    {
      id: 'manualCollectionId',
      title: 'Collection ID',
      type: 'short-input',
      canonicalParamId: 'collectionId',
      placeholder: 'Enter collection ID',
      mode: 'advanced',
      required: true,
    },
    {
      id: 'itemId',
      title: 'Item',
      type: 'file-selector',
      canonicalParamId: 'itemId',
      serviceId: 'webflow',
      placeholder: 'Select item',
      dependsOn: ['credential', 'collectionId'],
      mode: 'basic',
      condition: { field: 'operation', value: ['get', 'update', 'delete'] },
      required: true,
    },
    {
      id: 'manualItemId',
      title: 'Item ID',
      type: 'short-input',
      canonicalParamId: 'itemId',
      placeholder: 'Enter item ID',
      mode: 'advanced',
      condition: { field: 'operation', value: ['get', 'update', 'delete'] },
      required: true,
    },
    {
      id: 'offset',
      title: 'Offset',
      type: 'short-input',
      placeholder: 'Pagination offset (optional)',
      condition: { field: 'operation', value: 'list' },
    },
    {
      id: 'limit',
      title: 'Limit',
      type: 'short-input',
      placeholder: 'Max items to return (optional)',
      condition: { field: 'operation', value: 'list' },
    },
    {
      id: 'fieldData',
      title: 'Field Data',
      type: 'code',
      language: 'json',
      placeholder: 'Field data as JSON: `{ "name": "Item Name", "slug": "item-slug" }`',
      condition: { field: 'operation', value: ['create', 'update'] },
      required: true,
    },
    ...getTrigger('webflow_collection_item_created').subBlocks,
    ...getTrigger('webflow_collection_item_changed').subBlocks,
    ...getTrigger('webflow_collection_item_deleted').subBlocks,
  ],
  tools: {
    access: [
      'webflow_list_items',
      'webflow_get_item',
      'webflow_create_item',
      'webflow_update_item',
      'webflow_delete_item',
    ],
    config: {
      tool: (params) => {
        switch (params.operation) {
          case 'list':
            return 'webflow_list_items'
          case 'get':
            return 'webflow_get_item'
          case 'create':
            return 'webflow_create_item'
          case 'update':
            return 'webflow_update_item'
          case 'delete':
            return 'webflow_delete_item'
          default:
            throw new Error(`Invalid Webflow operation: ${params.operation}`)
        }
      },
      params: (params) => {
        const {
          credential,
          fieldData,
          siteId,
          manualSiteId,
          collectionId,
          manualCollectionId,
          itemId,
          manualItemId,
          ...rest
        } = params
        let parsedFieldData: any | undefined

        try {
          if (fieldData && (params.operation === 'create' || params.operation === 'update')) {
            parsedFieldData = JSON.parse(fieldData)
          }
        } catch (error: any) {
          throw new Error(`Invalid JSON input for ${params.operation} operation: ${error.message}`)
        }

        const effectiveSiteId = ((siteId as string) || (manualSiteId as string) || '').trim()
        const effectiveCollectionId = (
          (collectionId as string) ||
          (manualCollectionId as string) ||
          ''
        ).trim()
        const effectiveItemId = ((itemId as string) || (manualItemId as string) || '').trim()

        if (!effectiveSiteId) {
          throw new Error('Site ID is required')
        }

        if (!effectiveCollectionId) {
          throw new Error('Collection ID is required')
        }

        const baseParams = {
          credential,
          siteId: effectiveSiteId,
          collectionId: effectiveCollectionId,
          ...rest,
        }

        switch (params.operation) {
          case 'create':
          case 'update':
            if (params.operation === 'update' && !effectiveItemId) {
              throw new Error('Item ID is required for update operation')
            }
            return {
              ...baseParams,
              itemId: effectiveItemId || undefined,
              fieldData: parsedFieldData,
            }
          case 'get':
          case 'delete':
            if (!effectiveItemId) {
              throw new Error(`Item ID is required for ${params.operation} operation`)
            }
            return { ...baseParams, itemId: effectiveItemId }
          default:
            return baseParams
        }
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    credential: { type: 'string', description: 'Webflow OAuth access token' },
    siteId: { type: 'string', description: 'Webflow site identifier' },
    manualSiteId: { type: 'string', description: 'Manual site identifier' },
    collectionId: { type: 'string', description: 'Webflow collection identifier' },
    manualCollectionId: { type: 'string', description: 'Manual collection identifier' },
    itemId: { type: 'string', description: 'Item identifier' },
    manualItemId: { type: 'string', description: 'Manual item identifier' },
    offset: { type: 'number', description: 'Pagination offset' },
    limit: { type: 'number', description: 'Maximum items to return' },
    fieldData: { type: 'json', description: 'Item field data' },
  },
  outputs: {
    items: { type: 'json', description: 'Array of items (list operation)' },
    item: { type: 'json', description: 'Single item data (get/create/update operations)' },
    success: { type: 'boolean', description: 'Operation success status (delete operation)' },
    metadata: { type: 'json', description: 'Operation metadata' },
    // Trigger outputs
    siteId: { type: 'string', description: 'Site ID where event occurred' },
    workspaceId: { type: 'string', description: 'Workspace ID where event occurred' },
    collectionId: { type: 'string', description: 'Collection ID (for collection events)' },
    payload: { type: 'json', description: 'Event payload data (item data for collection events)' },
    name: { type: 'string', description: 'Form name (for form submissions)' },
    id: { type: 'string', description: 'Submission ID (for form submissions)' },
    submittedAt: { type: 'string', description: 'Submission timestamp (for form submissions)' },
    data: { type: 'json', description: 'Form field data (for form submissions)' },
    schema: { type: 'json', description: 'Form schema (for form submissions)' },
    formElementId: { type: 'string', description: 'Form element ID (for form submissions)' },
  },
  triggers: {
    enabled: true,
    available: [
      'webflow_collection_item_created',
      'webflow_collection_item_changed',
      'webflow_collection_item_deleted',
      'webflow_form_submission',
    ],
  },
}
```

--------------------------------------------------------------------------------

---[FILE: webhook.ts]---
Location: sim-main/apps/sim/blocks/blocks/webhook.ts

```typescript
import {
  AirtableIcon,
  DiscordIcon,
  GithubIcon,
  GmailIcon,
  MicrosoftTeamsIcon,
  OutlookIcon,
  SignalIcon,
  SlackIcon,
  StripeIcon,
  TelegramIcon,
  WebhookIcon,
  WhatsAppIcon,
} from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'

const getWebhookProviderIcon = (provider: string) => {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    slack: SlackIcon,
    gmail: GmailIcon,
    outlook: OutlookIcon,
    airtable: AirtableIcon,
    telegram: TelegramIcon,
    generic: SignalIcon,
    whatsapp: WhatsAppIcon,
    github: GithubIcon,
    discord: DiscordIcon,
    stripe: StripeIcon,
    microsoftteams: MicrosoftTeamsIcon,
  }

  return iconMap[provider.toLowerCase()]
}

export const WebhookBlock: BlockConfig = {
  type: 'webhook',
  name: 'Webhook',
  description: 'Trigger workflow execution from external webhooks',
  authMode: AuthMode.OAuth,
  category: 'triggers',
  icon: WebhookIcon,
  bgColor: '#10B981', // Green color for triggers
  docsLink: 'https://docs.sim.ai/triggers/webhook',
  triggerAllowed: true,
  hideFromToolbar: true, // Hidden for backwards compatibility - use generic webhook trigger instead

  subBlocks: [
    {
      id: 'webhookProvider',
      title: 'Webhook Provider',
      type: 'dropdown',
      options: [
        'slack',
        'gmail',
        'outlook',
        'airtable',
        'telegram',
        'generic',
        'whatsapp',
        'github',
        'discord',
        'stripe',
        'microsoftteams',
      ].map((provider) => {
        const providerLabels = {
          slack: 'Slack',
          gmail: 'Gmail',
          outlook: 'Outlook',
          airtable: 'Airtable',
          telegram: 'Telegram',
          generic: 'Generic',
          whatsapp: 'WhatsApp',
          github: 'GitHub',
          discord: 'Discord',
          stripe: 'Stripe',
          microsoftteams: 'Microsoft Teams',
        }

        const icon = getWebhookProviderIcon(provider)
        return {
          label: providerLabels[provider as keyof typeof providerLabels],
          id: provider,
          ...(icon && { icon }),
        }
      }),
      value: () => 'generic',
    },
    {
      id: 'gmailCredential',
      title: 'Gmail Account',
      type: 'oauth-input',
      serviceId: 'gmail',
      requiredScopes: [
        'https://www.googleapis.com/auth/gmail.modify',
        'https://www.googleapis.com/auth/gmail.labels',
      ],
      placeholder: 'Select Gmail account',
      condition: { field: 'webhookProvider', value: 'gmail' },
      required: true,
    },
    {
      id: 'outlookCredential',
      title: 'Microsoft Account',
      type: 'oauth-input',
      serviceId: 'outlook',
      requiredScopes: [
        'Mail.ReadWrite',
        'Mail.ReadBasic',
        'Mail.Read',
        'Mail.Send',
        'offline_access',
      ],
      placeholder: 'Select Microsoft account',
      condition: { field: 'webhookProvider', value: 'outlook' },
      required: true,
    },
    {
      id: 'webhookConfig',
      title: 'Webhook Configuration',
      type: 'webhook-config',
    },
  ],

  tools: {
    access: [], // No external tools needed
  },

  inputs: {}, // No inputs - webhook triggers receive data externally

  outputs: {}, // No outputs - webhook data is injected directly into workflow context
}
```

--------------------------------------------------------------------------------

---[FILE: whatsapp.ts]---
Location: sim-main/apps/sim/blocks/blocks/whatsapp.ts

```typescript
import { WhatsAppIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { WhatsAppResponse } from '@/tools/whatsapp/types'
import { getTrigger } from '@/triggers'

export const WhatsAppBlock: BlockConfig<WhatsAppResponse> = {
  type: 'whatsapp',
  name: 'WhatsApp',
  description: 'Send WhatsApp messages',
  authMode: AuthMode.ApiKey,
  longDescription: 'Integrate WhatsApp into the workflow. Can send messages.',
  docsLink: 'https://docs.sim.ai/tools/whatsapp',
  category: 'tools',
  bgColor: '#25D366',
  icon: WhatsAppIcon,
  triggerAllowed: true,
  subBlocks: [
    {
      id: 'phoneNumber',
      title: 'Recipient Phone Number',
      type: 'short-input',
      placeholder: 'Enter phone number with country code (e.g., +1234567890)',
      required: true,
    },
    {
      id: 'message',
      title: 'Message',
      type: 'long-input',
      placeholder: 'Enter your message',
      required: true,
    },
    {
      id: 'phoneNumberId',
      title: 'WhatsApp Phone Number ID',
      type: 'short-input',
      placeholder: 'Your WhatsApp Business Phone Number ID',
      required: true,
    },
    {
      id: 'accessToken',
      title: 'Access Token',
      type: 'short-input',
      placeholder: 'Your WhatsApp Business API Access Token',
      password: true,
      required: true,
    },
    ...getTrigger('whatsapp_webhook').subBlocks,
  ],
  tools: {
    access: ['whatsapp_send_message'],
    config: {
      tool: () => 'whatsapp_send_message',
    },
  },
  inputs: {
    phoneNumber: { type: 'string', description: 'Recipient phone number' },
    message: { type: 'string', description: 'Message text' },
    phoneNumberId: { type: 'string', description: 'WhatsApp phone number ID' },
    accessToken: { type: 'string', description: 'WhatsApp access token' },
  },
  outputs: {
    // Send operation outputs
    success: { type: 'boolean', description: 'Send success status' },
    messageId: { type: 'string', description: 'WhatsApp message identifier' },
    error: { type: 'string', description: 'Error information if sending fails' },
    // Webhook trigger outputs
    from: { type: 'string', description: 'Sender phone number' },
    to: { type: 'string', description: 'Recipient phone number' },
    text: { type: 'string', description: 'Message text content' },
    timestamp: { type: 'string', description: 'Message timestamp' },
    type: { type: 'string', description: 'Message type (text, image, etc.)' },
  },
  triggers: {
    enabled: true,
    available: ['whatsapp_webhook'],
  },
}
```

--------------------------------------------------------------------------------

---[FILE: wikipedia.ts]---
Location: sim-main/apps/sim/blocks/blocks/wikipedia.ts

```typescript
import { WikipediaIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import type { WikipediaResponse } from '@/tools/wikipedia/types'

export const WikipediaBlock: BlockConfig<WikipediaResponse> = {
  type: 'wikipedia',
  name: 'Wikipedia',
  description: 'Search and retrieve content from Wikipedia',
  longDescription:
    'Integrate Wikipedia into the workflow. Can get page summary, search pages, get page content, and get random page.',
  docsLink: 'https://docs.sim.ai/tools/wikipedia',
  category: 'tools',
  bgColor: '#000000',
  icon: WikipediaIcon,
  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Get Page Summary', id: 'wikipedia_summary' },
        { label: 'Search Pages', id: 'wikipedia_search' },
        { label: 'Get Page Content', id: 'wikipedia_content' },
        { label: 'Random Page', id: 'wikipedia_random' },
      ],
      value: () => 'wikipedia_summary',
    },
    // Page Summary operation inputs
    {
      id: 'pageTitle',
      title: 'Page Title',
      type: 'long-input',
      placeholder: 'Enter Wikipedia page title (e.g., "Python programming language")...',
      condition: { field: 'operation', value: 'wikipedia_summary' },
      required: true,
    },
    // Search Pages operation inputs
    {
      id: 'query',
      title: 'Search Query',
      type: 'long-input',
      placeholder: 'Enter search terms...',
      condition: { field: 'operation', value: 'wikipedia_search' },
      required: true,
    },
    {
      id: 'searchLimit',
      title: 'Max Results',
      type: 'short-input',
      placeholder: '10',
      condition: { field: 'operation', value: 'wikipedia_search' },
    },
    // Get Page Content operation inputs
    {
      id: 'pageTitle',
      title: 'Page Title',
      type: 'long-input',
      placeholder: 'Enter Wikipedia page title...',
      condition: { field: 'operation', value: 'wikipedia_content' },
      required: true,
    },
  ],
  tools: {
    access: ['wikipedia_summary', 'wikipedia_search', 'wikipedia_content', 'wikipedia_random'],
    config: {
      tool: (params) => {
        // Convert searchLimit to a number for search operation
        if (params.searchLimit) {
          params.searchLimit = Number(params.searchLimit)
        }

        switch (params.operation) {
          case 'wikipedia_summary':
            return 'wikipedia_summary'
          case 'wikipedia_search':
            return 'wikipedia_search'
          case 'wikipedia_content':
            return 'wikipedia_content'
          case 'wikipedia_random':
            return 'wikipedia_random'
          default:
            return 'wikipedia_summary'
        }
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    // Page Summary & Content operations
    pageTitle: { type: 'string', description: 'Wikipedia page title' },
    // Search operation
    query: { type: 'string', description: 'Search query terms' },
    searchLimit: { type: 'number', description: 'Maximum search results' },
  },
  outputs: {
    // Page Summary output
    summary: { type: 'json', description: 'Page summary data' },
    // Search output
    searchResults: { type: 'json', description: 'Search results data' },
    totalHits: { type: 'number', description: 'Total search hits' },
    // Page Content output
    content: { type: 'json', description: 'Page content data' },
    // Random Page output
    randomPage: { type: 'json', description: 'Random page data' },
  },
}
```

--------------------------------------------------------------------------------

````
