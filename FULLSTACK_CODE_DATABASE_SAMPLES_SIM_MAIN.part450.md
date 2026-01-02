---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 450
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 450 of 933)

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

---[FILE: browser_use.ts]---
Location: sim-main/apps/sim/blocks/blocks/browser_use.ts

```typescript
import { BrowserUseIcon } from '@/components/icons'
import { AuthMode, type BlockConfig } from '@/blocks/types'
import type { BrowserUseResponse } from '@/tools/browser_use/types'

export const BrowserUseBlock: BlockConfig<BrowserUseResponse> = {
  type: 'browser_use',
  name: 'Browser Use',
  description: 'Run browser automation tasks',
  authMode: AuthMode.ApiKey,
  longDescription:
    'Integrate Browser Use into the workflow. Can navigate the web and perform actions as if a real user was interacting with the browser.',
  docsLink: 'https://docs.sim.ai/tools/browser_use',
  category: 'tools',
  bgColor: '#E0E0E0',
  icon: BrowserUseIcon,
  subBlocks: [
    {
      id: 'task',
      title: 'Task',
      type: 'long-input',
      placeholder: 'Describe what the browser agent should do...',
      required: true,
    },
    {
      id: 'variables',
      title: 'Variables (Secrets)',
      type: 'table',
      columns: ['Key', 'Value'],
    },
    {
      id: 'model',
      title: 'Model',
      type: 'dropdown',
      options: [
        { label: 'Browser Use LLM', id: 'browser-use-llm' },
        { label: 'GPT-4o', id: 'gpt-4o' },
        { label: 'GPT-4o Mini', id: 'gpt-4o-mini' },
        { label: 'GPT-4.1', id: 'gpt-4.1' },
        { label: 'GPT-4.1 Mini', id: 'gpt-4.1-mini' },
        { label: 'O3', id: 'o3' },
        { label: 'O4 Mini', id: 'o4-mini' },
        { label: 'Gemini 2.5 Flash', id: 'gemini-2.5-flash' },
        { label: 'Gemini 2.5 Pro', id: 'gemini-2.5-pro' },
        { label: 'Gemini 3 Pro Preview', id: 'gemini-3-pro-preview' },
        { label: 'Gemini Flash Latest', id: 'gemini-flash-latest' },
        { label: 'Gemini Flash Lite Latest', id: 'gemini-flash-lite-latest' },
        { label: 'Claude 3.7 Sonnet', id: 'claude-3-7-sonnet-20250219' },
        { label: 'Claude Sonnet 4', id: 'claude-sonnet-4-20250514' },
        { label: 'Claude Sonnet 4.5', id: 'claude-sonnet-4-5-20250929' },
        { label: 'Claude Opus 4.5', id: 'claude-opus-4-5-20251101' },
        { label: 'Llama 4 Maverick', id: 'llama-4-maverick-17b-128e-instruct' },
      ],
    },
    {
      id: 'save_browser_data',
      title: 'Save Browser Data',
      type: 'switch',
      placeholder: 'Save browser data',
    },
    {
      id: 'apiKey',
      title: 'API Key',
      type: 'short-input',
      password: true,
      placeholder: 'Enter your BrowserUse API key',
      required: true,
    },
  ],
  tools: {
    access: ['browser_use_run_task'],
  },
  inputs: {
    task: { type: 'string', description: 'Browser automation task' },
    apiKey: { type: 'string', description: 'BrowserUse API key' },
    variables: { type: 'json', description: 'Task variables' },
    model: { type: 'string', description: 'AI model to use' },
    save_browser_data: { type: 'boolean', description: 'Save browser data' },
  },
  outputs: {
    id: { type: 'string', description: 'Task execution identifier' },
    success: { type: 'boolean', description: 'Task completion status' },
    output: { type: 'json', description: 'Task output data' },
    steps: { type: 'json', description: 'Execution steps taken' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: calendly.ts]---
Location: sim-main/apps/sim/blocks/blocks/calendly.ts

```typescript
import { CalendlyIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { ToolResponse } from '@/tools/types'
import { getTrigger } from '@/triggers'

export const CalendlyBlock: BlockConfig<ToolResponse> = {
  type: 'calendly',
  name: 'Calendly',
  description: 'Manage Calendly scheduling and events',
  authMode: AuthMode.ApiKey,
  triggerAllowed: true,
  longDescription:
    'Integrate Calendly into your workflow. Manage event types, scheduled events, invitees, and webhooks. Can also trigger workflows based on Calendly webhook events (invitee scheduled, invitee canceled, routing form submitted). Requires Personal Access Token.',
  docsLink: 'https://docs.sim.ai/tools/calendly',
  category: 'tools',
  bgColor: '#FFFFFF',
  icon: CalendlyIcon,
  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Get Current User', id: 'calendly_get_current_user' },
        { label: 'List Event Types', id: 'calendly_list_event_types' },
        { label: 'Get Event Type', id: 'calendly_get_event_type' },
        { label: 'List Scheduled Events', id: 'calendly_list_scheduled_events' },
        { label: 'Get Scheduled Event', id: 'calendly_get_scheduled_event' },
        { label: 'List Event Invitees', id: 'calendly_list_event_invitees' },
        { label: 'Cancel Event', id: 'calendly_cancel_event' },
      ],
      value: () => 'calendly_list_scheduled_events',
    },
    {
      id: 'apiKey',
      title: 'Personal Access Token',
      type: 'short-input',
      placeholder: 'Enter your Calendly personal access token',
      password: true,
      required: true,
    },
    // Get Event Type fields
    {
      id: 'eventTypeUuid',
      title: 'Event Type UUID',
      type: 'short-input',
      placeholder: 'Enter event type UUID or URI',
      required: true,
      condition: { field: 'operation', value: 'calendly_get_event_type' },
    },
    // List Event Types fields
    {
      id: 'user',
      title: 'User URI',
      type: 'short-input',
      placeholder: 'Filter by user URI',
      condition: {
        field: 'operation',
        value: ['calendly_list_event_types', 'calendly_list_scheduled_events'],
      },
    },
    {
      id: 'organization',
      title: 'Organization URI',
      type: 'short-input',
      placeholder: 'Filter by organization URI (optional)',
      condition: {
        field: 'operation',
        value: ['calendly_list_event_types', 'calendly_list_scheduled_events'],
      },
    },
    {
      id: 'active',
      title: 'Active Only',
      type: 'switch',
      description:
        'When enabled, shows only active event types. When disabled, shows all event types.',
      condition: { field: 'operation', value: 'calendly_list_event_types' },
    },
    // List Scheduled Events fields
    {
      id: 'invitee_email',
      title: 'Invitee Email',
      type: 'short-input',
      placeholder: 'Filter by invitee email',
      condition: { field: 'operation', value: 'calendly_list_scheduled_events' },
    },
    {
      id: 'min_start_time',
      title: 'Min Start Time',
      type: 'short-input',
      placeholder: 'ISO 8601 format (e.g., 2024-01-01T00:00:00Z)',
      condition: { field: 'operation', value: 'calendly_list_scheduled_events' },
    },
    {
      id: 'max_start_time',
      title: 'Max Start Time',
      type: 'short-input',
      placeholder: 'ISO 8601 format (e.g., 2024-12-31T23:59:59Z)',
      condition: { field: 'operation', value: 'calendly_list_scheduled_events' },
    },
    {
      id: 'status',
      title: 'Status',
      type: 'dropdown',
      options: [
        { label: 'All', id: '' },
        { label: 'Active', id: 'active' },
        { label: 'Canceled', id: 'canceled' },
      ],
      condition: {
        field: 'operation',
        value: ['calendly_list_scheduled_events', 'calendly_list_event_invitees'],
      },
    },
    // Get Scheduled Event / List Invitees / Cancel Event fields
    {
      id: 'eventUuid',
      title: 'Event UUID',
      type: 'short-input',
      placeholder: 'Enter scheduled event UUID or URI',
      required: true,
      condition: {
        field: 'operation',
        value: [
          'calendly_get_scheduled_event',
          'calendly_list_event_invitees',
          'calendly_cancel_event',
        ],
      },
    },
    // Cancel Event fields
    {
      id: 'reason',
      title: 'Cancellation Reason',
      type: 'long-input',
      placeholder: 'Reason for cancellation (optional)',
      condition: { field: 'operation', value: 'calendly_cancel_event' },
    },
    // List Event Invitees fields
    {
      id: 'email',
      title: 'Email',
      type: 'short-input',
      placeholder: 'Filter by invitee email',
      condition: { field: 'operation', value: 'calendly_list_event_invitees' },
    },
    // Pagination fields
    {
      id: 'count',
      title: 'Results Per Page',
      type: 'short-input',
      placeholder: 'Number of results (default: 20, max: 100)',
      condition: {
        field: 'operation',
        value: [
          'calendly_list_event_types',
          'calendly_list_scheduled_events',
          'calendly_list_event_invitees',
        ],
      },
    },
    {
      id: 'pageToken',
      title: 'Page Token',
      type: 'short-input',
      placeholder: 'Token for pagination',
      condition: {
        field: 'operation',
        value: [
          'calendly_list_event_types',
          'calendly_list_scheduled_events',
          'calendly_list_event_invitees',
        ],
      },
    },
    {
      id: 'sort',
      title: 'Sort Order',
      type: 'short-input',
      placeholder: 'e.g., "name:asc", "start_time:desc"',
      condition: {
        field: 'operation',
        value: [
          'calendly_list_event_types',
          'calendly_list_scheduled_events',
          'calendly_list_event_invitees',
        ],
      },
    },
    // Trigger SubBlocks
    ...getTrigger('calendly_invitee_created').subBlocks,
    ...getTrigger('calendly_invitee_canceled').subBlocks,
    ...getTrigger('calendly_routing_form_submitted').subBlocks,
    ...getTrigger('calendly_webhook').subBlocks,
  ],
  tools: {
    access: [
      'calendly_get_current_user',
      'calendly_list_event_types',
      'calendly_get_event_type',
      'calendly_list_scheduled_events',
      'calendly_get_scheduled_event',
      'calendly_list_event_invitees',
      'calendly_cancel_event',
    ],
    config: {
      tool: (params) => {
        return params.operation || 'calendly_list_scheduled_events'
      },
      params: (params) => {
        const { operation, events, ...rest } = params

        let parsedEvents: any | undefined

        try {
          if (events) parsedEvents = JSON.parse(events)
        } catch (error: any) {
          throw new Error(`Invalid JSON input for events: ${error.message}`)
        }

        return {
          ...rest,
          ...(parsedEvents && { events: parsedEvents }),
        }
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    apiKey: { type: 'string', description: 'Personal access token' },
    // Event Type params
    eventTypeUuid: { type: 'string', description: 'Event type UUID' },
    user: { type: 'string', description: 'User URI filter' },
    organization: { type: 'string', description: 'Organization URI' },
    active: { type: 'boolean', description: 'Filter by active status' },
    // Scheduled Event params
    eventUuid: { type: 'string', description: 'Scheduled event UUID' },
    invitee_email: { type: 'string', description: 'Filter by invitee email' },
    min_start_time: { type: 'string', description: 'Minimum start time (ISO 8601)' },
    max_start_time: { type: 'string', description: 'Maximum start time (ISO 8601)' },
    status: { type: 'string', description: 'Status filter (active or canceled)' },
    // Cancel Event params
    reason: { type: 'string', description: 'Cancellation reason' },
    // Invitees params
    email: { type: 'string', description: 'Filter by email' },
    // Pagination params
    count: { type: 'number', description: 'Results per page' },
    pageToken: { type: 'string', description: 'Pagination token' },
    sort: { type: 'string', description: 'Sort order' },
    // Webhook params
    webhookUuid: { type: 'string', description: 'Webhook UUID' },
    url: { type: 'string', description: 'Webhook callback URL' },
    events: { type: 'json', description: 'Array of event types' },
    scope: { type: 'string', description: 'Webhook scope' },
    signing_key: { type: 'string', description: 'Webhook signing key' },
  },
  outputs: {
    // Common outputs
    success: { type: 'boolean', description: 'Whether operation succeeded' },
    // User outputs
    resource: { type: 'json', description: 'Resource data (user, event type, event, etc.)' },
    // List outputs
    collection: { type: 'json', description: 'Array of items' },
    pagination: { type: 'json', description: 'Pagination information' },
    // Event details
    uri: { type: 'string', description: 'Resource URI' },
    name: { type: 'string', description: 'Resource name' },
    email: { type: 'string', description: 'Email address' },
    status: { type: 'string', description: 'Status' },
    start_time: { type: 'string', description: 'Event start time (ISO 8601)' },
    end_time: { type: 'string', description: 'Event end time (ISO 8601)' },
    location: { type: 'json', description: 'Event location details' },
    scheduling_url: { type: 'string', description: 'Scheduling page URL' },
    // Webhook outputs
    callback_url: { type: 'string', description: 'Webhook URL' },
    signing_key: { type: 'string', description: 'Webhook signing key' },
    // Delete outputs
    deleted: { type: 'boolean', description: 'Whether deletion succeeded' },
    message: { type: 'string', description: 'Status message' },
    // Trigger outputs
    event: { type: 'string', description: 'Webhook event type' },
    created_at: { type: 'string', description: 'Webhook event creation timestamp' },
    created_by: {
      type: 'string',
      description: 'URI of the Calendly user who created this webhook',
    },
    payload: { type: 'json', description: 'Complete webhook payload data' },
  },
  triggers: {
    enabled: true,
    available: [
      'calendly_invitee_created',
      'calendly_invitee_canceled',
      'calendly_routing_form_submitted',
      'calendly_webhook',
    ],
  },
}
```

--------------------------------------------------------------------------------

---[FILE: chat_trigger.ts]---
Location: sim-main/apps/sim/blocks/blocks/chat_trigger.ts
Signals: React

```typescript
import type { SVGProps } from 'react'
import { createElement } from 'react'
import { MessageCircle } from 'lucide-react'
import type { BlockConfig } from '@/blocks/types'

const ChatTriggerIcon = (props: SVGProps<SVGSVGElement>) => createElement(MessageCircle, props)

export const ChatTriggerBlock: BlockConfig = {
  type: 'chat_trigger',
  triggerAllowed: true,
  name: 'Chat',
  description: 'Legacy chat start block. Prefer the unified Start block.',
  longDescription: 'Chat trigger to run the workflow via deployed chat interfaces.',
  bestPractices: `
  - Can run the workflow manually to test implementation when this is the trigger point by passing in a message.
  `,
  category: 'triggers',
  hideFromToolbar: true,
  bgColor: '#6F3DFA',
  icon: ChatTriggerIcon,
  subBlocks: [],
  tools: {
    access: [],
  },
  inputs: {},
  outputs: {
    input: { type: 'string', description: 'User message' },
    conversationId: { type: 'string', description: 'Conversation ID' },
    files: { type: 'files', description: 'Uploaded files' },
  },
  triggers: {
    enabled: true,
    available: ['chat'],
  },
}
```

--------------------------------------------------------------------------------

---[FILE: clay.ts]---
Location: sim-main/apps/sim/blocks/blocks/clay.ts

```typescript
import { ClayIcon } from '@/components/icons'
import { AuthMode, type BlockConfig } from '@/blocks/types'
import type { ClayPopulateResponse } from '@/tools/clay/types'

export const ClayBlock: BlockConfig<ClayPopulateResponse> = {
  type: 'clay',
  name: 'Clay',
  description: 'Populate Clay workbook',
  authMode: AuthMode.ApiKey,
  longDescription: 'Integrate Clay into the workflow. Can populate a table with data.',
  docsLink: 'https://docs.sim.ai/tools/clay',
  category: 'tools',
  bgColor: '#E0E0E0',
  icon: ClayIcon,
  subBlocks: [
    {
      id: 'webhookURL',
      title: 'Webhook URL',
      type: 'short-input',
      placeholder: 'Enter Clay webhook URL',
      required: true,
    },
    {
      id: 'data',
      title: 'Data (JSON or Plain Text)',
      type: 'long-input',
      placeholder: 'Enter your JSON data to populate your Clay table',
      required: true,
      description: `JSON vs. Plain Text:
JSON: Best for populating multiple columns.
Plain Text: Best for populating a table in free-form style.
      `,
    },
    {
      id: 'authToken',
      title: 'Auth Token',
      type: 'short-input',
      placeholder: 'Enter your Clay webhook auth token',
      password: true,
      connectionDroppable: false,
      required: false,
      description:
        'Optional: If your Clay table has webhook authentication enabled, enter the auth token here. This will be sent in the x-clay-webhook-auth header.',
    },
  ],
  tools: {
    access: ['clay_populate'],
  },
  inputs: {
    authToken: { type: 'string', description: 'Clay authentication token' },
    webhookURL: { type: 'string', description: 'Clay webhook URL' },
    data: { type: 'json', description: 'Data to populate' },
  },
  outputs: {
    data: { type: 'json', description: 'Response data from Clay webhook' },
    metadata: {
      type: 'json',
      description: 'Webhook metadata including status, headers, timestamp, and content type',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: condition.ts]---
Location: sim-main/apps/sim/blocks/blocks/condition.ts

```typescript
import { ConditionalIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'

interface ConditionBlockOutput {
  success: boolean
  output: {
    conditionResult: boolean
    selectedPath: {
      blockId: string
      blockType: string
      blockTitle: string
    }
    selectedOption: string
  }
}

export const ConditionBlock: BlockConfig<ConditionBlockOutput> = {
  type: 'condition',
  name: 'Condition',
  description: 'Add a condition',
  longDescription:
    'This is a core workflow block. Add a condition to the workflow to branch the execution path based on a boolean expression.',
  bestPractices: `
  - Write the conditions using standard javascript syntax except referencing the outputs of previous blocks using <> syntax, and keep them as simple as possible. No hacky fallbacks.
  - Can reference workflow variables using <blockName.output> syntax as usual within conditions.
  `,
  docsLink: 'https://docs.sim.ai/blocks/condition',
  bgColor: '#FF752F',
  icon: ConditionalIcon,
  category: 'blocks',
  subBlocks: [
    {
      id: 'conditions',
      type: 'condition-input',
    },
  ],
  tools: {
    access: [],
  },
  inputs: {},
  outputs: {
    conditionResult: { type: 'boolean', description: 'Condition result' },
    selectedPath: { type: 'json', description: 'Selected execution path' },
    selectedOption: { type: 'string', description: 'Selected condition option ID' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: confluence.ts]---
Location: sim-main/apps/sim/blocks/blocks/confluence.ts

```typescript
import { ConfluenceIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { ConfluenceResponse } from '@/tools/confluence/types'

export const ConfluenceBlock: BlockConfig<ConfluenceResponse> = {
  type: 'confluence',
  name: 'Confluence',
  description: 'Interact with Confluence',
  authMode: AuthMode.OAuth,
  longDescription:
    'Integrate Confluence into the workflow. Can read, create, update, delete pages, manage comments, attachments, labels, and search content.',
  docsLink: 'https://docs.sim.ai/tools/confluence',
  category: 'tools',
  bgColor: '#E0E0E0',
  icon: ConfluenceIcon,
  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Read Page', id: 'read' },
        { label: 'Create Page', id: 'create' },
        { label: 'Update Page', id: 'update' },
        { label: 'Delete Page', id: 'delete' },
        { label: 'Search Content', id: 'search' },
        { label: 'Create Comment', id: 'create_comment' },
        { label: 'List Comments', id: 'list_comments' },
        { label: 'Update Comment', id: 'update_comment' },
        { label: 'Delete Comment', id: 'delete_comment' },
        { label: 'Upload Attachment', id: 'upload_attachment' },
        { label: 'List Attachments', id: 'list_attachments' },
        { label: 'Delete Attachment', id: 'delete_attachment' },
        { label: 'List Labels', id: 'list_labels' },
        { label: 'Get Space', id: 'get_space' },
        { label: 'List Spaces', id: 'list_spaces' },
      ],
      value: () => 'read',
    },
    {
      id: 'domain',
      title: 'Domain',
      type: 'short-input',
      placeholder: 'Enter Confluence domain (e.g., simstudio.atlassian.net)',
      required: true,
    },
    {
      id: 'credential',
      title: 'Confluence Account',
      type: 'oauth-input',
      serviceId: 'confluence',
      requiredScopes: [
        'read:confluence-content.all',
        'read:confluence-space.summary',
        'read:space:confluence',
        'read:space-details:confluence',
        'write:confluence-content',
        'write:confluence-space',
        'write:confluence-file',
        'read:content:confluence',
        'read:page:confluence',
        'write:page:confluence',
        'read:comment:confluence',
        'write:comment:confluence',
        'delete:comment:confluence',
        'read:attachment:confluence',
        'write:attachment:confluence',
        'delete:attachment:confluence',
        'delete:page:confluence',
        'read:label:confluence',
        'write:label:confluence',
        'search:confluence',
        'read:me',
        'offline_access',
      ],
      placeholder: 'Select Confluence account',
      required: true,
    },
    {
      id: 'pageId',
      title: 'Select Page',
      type: 'file-selector',
      canonicalParamId: 'pageId',
      serviceId: 'confluence',
      placeholder: 'Select Confluence page',
      dependsOn: ['credential', 'domain'],
      mode: 'basic',
    },
    {
      id: 'manualPageId',
      title: 'Page ID',
      type: 'short-input',
      canonicalParamId: 'pageId',
      placeholder: 'Enter Confluence page ID',
      mode: 'advanced',
    },
    {
      id: 'spaceId',
      title: 'Space ID',
      type: 'short-input',
      placeholder: 'Enter Confluence space ID',
      required: true,
      condition: { field: 'operation', value: ['create', 'get_space'] },
    },
    {
      id: 'title',
      title: 'Title',
      type: 'short-input',
      placeholder: 'Enter title for the page',
      condition: { field: 'operation', value: ['create', 'update'] },
    },
    {
      id: 'content',
      title: 'Content',
      type: 'long-input',
      placeholder: 'Enter content for the page',
      condition: { field: 'operation', value: ['create', 'update'] },
    },
    {
      id: 'parentId',
      title: 'Parent Page ID',
      type: 'short-input',
      placeholder: 'Enter parent page ID (optional)',
      condition: { field: 'operation', value: 'create' },
    },
    {
      id: 'query',
      title: 'Search Query',
      type: 'short-input',
      placeholder: 'Enter search query',
      required: true,
      condition: { field: 'operation', value: 'search' },
    },
    {
      id: 'comment',
      title: 'Comment Text',
      type: 'long-input',
      placeholder: 'Enter comment text',
      required: true,
      condition: { field: 'operation', value: ['create_comment', 'update_comment'] },
    },
    {
      id: 'commentId',
      title: 'Comment ID',
      type: 'short-input',
      placeholder: 'Enter comment ID',
      required: true,
      condition: { field: 'operation', value: ['update_comment', 'delete_comment'] },
    },
    {
      id: 'attachmentId',
      title: 'Attachment ID',
      type: 'short-input',
      placeholder: 'Enter attachment ID',
      required: true,
      condition: { field: 'operation', value: 'delete_attachment' },
    },
    {
      id: 'attachmentFile',
      title: 'File',
      type: 'file-upload',
      placeholder: 'Select file to upload',
      required: true,
      condition: { field: 'operation', value: 'upload_attachment' },
    },
    {
      id: 'attachmentFileName',
      title: 'File Name',
      type: 'short-input',
      placeholder: 'Optional custom file name',
      condition: { field: 'operation', value: 'upload_attachment' },
    },
    {
      id: 'attachmentComment',
      title: 'Comment',
      type: 'short-input',
      placeholder: 'Optional comment for the attachment',
      condition: { field: 'operation', value: 'upload_attachment' },
    },
    {
      id: 'labelName',
      title: 'Label Name',
      type: 'short-input',
      placeholder: 'Enter label name',
      required: true,
      condition: { field: 'operation', value: ['add_label', 'remove_label'] },
    },
    {
      id: 'limit',
      title: 'Limit',
      type: 'short-input',
      placeholder: 'Enter maximum number of results (default: 25)',
      condition: {
        field: 'operation',
        value: ['search', 'list_comments', 'list_attachments', 'list_spaces'],
      },
    },
  ],
  tools: {
    access: [
      'confluence_retrieve',
      'confluence_update',
      'confluence_create_page',
      'confluence_delete_page',
      'confluence_search',
      'confluence_create_comment',
      'confluence_list_comments',
      'confluence_update_comment',
      'confluence_delete_comment',
      'confluence_upload_attachment',
      'confluence_list_attachments',
      'confluence_delete_attachment',
      'confluence_list_labels',
      'confluence_get_space',
      'confluence_list_spaces',
    ],
    config: {
      tool: (params) => {
        switch (params.operation) {
          case 'read':
            return 'confluence_retrieve'
          case 'create':
            return 'confluence_create_page'
          case 'update':
            return 'confluence_update'
          case 'delete':
            return 'confluence_delete_page'
          case 'search':
            return 'confluence_search'
          case 'create_comment':
            return 'confluence_create_comment'
          case 'list_comments':
            return 'confluence_list_comments'
          case 'update_comment':
            return 'confluence_update_comment'
          case 'delete_comment':
            return 'confluence_delete_comment'
          case 'upload_attachment':
            return 'confluence_upload_attachment'
          case 'list_attachments':
            return 'confluence_list_attachments'
          case 'delete_attachment':
            return 'confluence_delete_attachment'
          case 'list_labels':
            return 'confluence_list_labels'
          case 'get_space':
            return 'confluence_get_space'
          case 'list_spaces':
            return 'confluence_list_spaces'
          default:
            return 'confluence_retrieve'
        }
      },
      params: (params) => {
        const {
          credential,
          pageId,
          manualPageId,
          operation,
          attachmentFile,
          attachmentFileName,
          attachmentComment,
          ...rest
        } = params

        const effectivePageId = (pageId || manualPageId || '').trim()

        const requiresPageId = [
          'read',
          'update',
          'delete',
          'create_comment',
          'list_comments',
          'list_attachments',
          'list_labels',
          'upload_attachment',
        ]

        const requiresSpaceId = ['create', 'get_space']

        if (requiresPageId.includes(operation) && !effectivePageId) {
          throw new Error('Page ID is required. Please select a page or enter a page ID manually.')
        }

        if (requiresSpaceId.includes(operation) && !rest.spaceId) {
          throw new Error('Space ID is required for this operation.')
        }

        if (operation === 'upload_attachment') {
          return {
            credential,
            pageId: effectivePageId,
            operation,
            file: attachmentFile,
            fileName: attachmentFileName,
            comment: attachmentComment,
            ...rest,
          }
        }

        return {
          credential,
          pageId: effectivePageId || undefined,
          operation,
          ...rest,
        }
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    domain: { type: 'string', description: 'Confluence domain' },
    credential: { type: 'string', description: 'Confluence access token' },
    pageId: { type: 'string', description: 'Page identifier' },
    manualPageId: { type: 'string', description: 'Manual page identifier' },
    spaceId: { type: 'string', description: 'Space identifier' },
    title: { type: 'string', description: 'Page title' },
    content: { type: 'string', description: 'Page content' },
    parentId: { type: 'string', description: 'Parent page identifier' },
    query: { type: 'string', description: 'Search query' },
    comment: { type: 'string', description: 'Comment text' },
    commentId: { type: 'string', description: 'Comment identifier' },
    attachmentId: { type: 'string', description: 'Attachment identifier' },
    attachmentFile: { type: 'json', description: 'File to upload as attachment' },
    attachmentFileName: { type: 'string', description: 'Custom file name for attachment' },
    attachmentComment: { type: 'string', description: 'Comment for the attachment' },
    labelName: { type: 'string', description: 'Label name' },
    limit: { type: 'number', description: 'Maximum number of results' },
  },
  outputs: {
    ts: { type: 'string', description: 'Timestamp' },
    pageId: { type: 'string', description: 'Page identifier' },
    content: { type: 'string', description: 'Page content' },
    title: { type: 'string', description: 'Page title' },
    url: { type: 'string', description: 'Page or resource URL' },
    success: { type: 'boolean', description: 'Operation success status' },
    deleted: { type: 'boolean', description: 'Deletion status' },
    added: { type: 'boolean', description: 'Addition status' },
    removed: { type: 'boolean', description: 'Removal status' },
    updated: { type: 'boolean', description: 'Update status' },
    results: { type: 'array', description: 'Search results' },
    comments: { type: 'array', description: 'List of comments' },
    attachments: { type: 'array', description: 'List of attachments' },
    labels: { type: 'array', description: 'List of labels' },
    spaces: { type: 'array', description: 'List of spaces' },
    commentId: { type: 'string', description: 'Comment identifier' },
    attachmentId: { type: 'string', description: 'Attachment identifier' },
    fileSize: { type: 'number', description: 'Attachment file size in bytes' },
    mediaType: { type: 'string', description: 'Attachment MIME type' },
    downloadUrl: { type: 'string', description: 'Attachment download URL' },
    labelName: { type: 'string', description: 'Label name' },
    spaceId: { type: 'string', description: 'Space identifier' },
    name: { type: 'string', description: 'Space name' },
    key: { type: 'string', description: 'Space key' },
    type: { type: 'string', description: 'Space or content type' },
    status: { type: 'string', description: 'Space status' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: cursor.ts]---
Location: sim-main/apps/sim/blocks/blocks/cursor.ts

```typescript
import { CursorIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { CursorResponse } from '@/tools/cursor/types'

export const CursorBlock: BlockConfig<CursorResponse> = {
  type: 'cursor',
  name: 'Cursor',
  description: 'Launch and manage Cursor cloud agents to work on GitHub repositories',
  longDescription:
    'Interact with Cursor Cloud Agents API to launch AI agents that can work on your GitHub repositories. Supports launching agents, adding follow-up instructions, checking status, viewing conversations, and managing agent lifecycle.',
  docsLink: 'https://cursor.com/docs/cloud-agent/api/endpoints',
  category: 'tools',
  bgColor: '#1E1E1E',
  icon: CursorIcon,
  authMode: AuthMode.ApiKey,
  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Launch Agent', id: 'cursor_launch_agent' },
        { label: 'Add Follow-up', id: 'cursor_add_followup' },
        { label: 'Get Agent Status', id: 'cursor_get_agent' },
        { label: 'Get Conversation', id: 'cursor_get_conversation' },
        { label: 'List Agents', id: 'cursor_list_agents' },
        { label: 'Stop Agent', id: 'cursor_stop_agent' },
        { label: 'Delete Agent', id: 'cursor_delete_agent' },
      ],
      value: () => 'cursor_launch_agent',
    },
    {
      id: 'repository',
      title: 'Repository URL',
      type: 'short-input',
      placeholder: 'https://github.com/your-org/your-repo',
      condition: { field: 'operation', value: 'cursor_launch_agent' },
      required: true,
    },
    {
      id: 'ref',
      title: 'Branch/Ref',
      type: 'short-input',
      placeholder: 'main (optional)',
      condition: { field: 'operation', value: 'cursor_launch_agent' },
    },
    {
      id: 'promptText',
      title: 'Prompt',
      type: 'long-input',
      placeholder: 'Describe the task for the agent...',
      condition: { field: 'operation', value: 'cursor_launch_agent' },
      required: true,
    },
    {
      id: 'model',
      title: 'Model',
      type: 'short-input',
      placeholder: 'Auto-selection by default',
      condition: { field: 'operation', value: 'cursor_launch_agent' },
    },
    {
      id: 'branchName',
      title: 'Branch Name',
      type: 'short-input',
      placeholder: 'Custom branch name (optional)',
      condition: { field: 'operation', value: 'cursor_launch_agent' },
    },
    {
      id: 'autoCreatePr',
      title: 'Auto Create PR',
      type: 'switch',
      condition: { field: 'operation', value: 'cursor_launch_agent' },
    },
    {
      id: 'openAsCursorGithubApp',
      title: 'Open as Cursor GitHub App',
      type: 'switch',
      condition: { field: 'operation', value: 'cursor_launch_agent' },
    },
    {
      id: 'skipReviewerRequest',
      title: 'Skip Reviewer Request',
      type: 'switch',
      condition: { field: 'operation', value: 'cursor_launch_agent' },
    },
    {
      id: 'agentId',
      title: 'Agent ID',
      type: 'short-input',
      placeholder: 'e.g., bc_abc123',
      condition: {
        field: 'operation',
        value: [
          'cursor_get_agent',
          'cursor_get_conversation',
          'cursor_add_followup',
          'cursor_stop_agent',
          'cursor_delete_agent',
        ],
      },
      required: true,
    },
    {
      id: 'followupPromptText',
      title: 'Follow-up Prompt',
      type: 'long-input',
      placeholder: 'Additional instructions for the agent...',
      condition: { field: 'operation', value: 'cursor_add_followup' },
      required: true,
    },
    {
      id: 'limit',
      title: 'Limit',
      type: 'short-input',
      placeholder: '20 (default, max 100)',
      condition: { field: 'operation', value: 'cursor_list_agents' },
    },
    {
      id: 'cursor',
      title: 'Pagination Cursor',
      type: 'short-input',
      placeholder: 'Cursor from previous response',
      condition: { field: 'operation', value: 'cursor_list_agents' },
    },
    {
      id: 'apiKey',
      title: 'API Key',
      type: 'short-input',
      placeholder: 'Enter Cursor API Key',
      password: true,
      required: true,
    },
  ],
  tools: {
    access: [
      'cursor_list_agents',
      'cursor_get_agent',
      'cursor_get_conversation',
      'cursor_launch_agent',
      'cursor_add_followup',
      'cursor_stop_agent',
      'cursor_delete_agent',
    ],
    config: {
      tool: (params) => params.operation || 'cursor_launch_agent',
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    repository: { type: 'string', description: 'GitHub repository URL' },
    ref: { type: 'string', description: 'Branch, tag, or commit reference' },
    promptText: { type: 'string', description: 'Instruction text for the agent' },
    followupPromptText: { type: 'string', description: 'Follow-up instruction text for the agent' },
    promptImages: { type: 'string', description: 'JSON array of image objects' },
    model: { type: 'string', description: 'Model to use (empty for auto-selection)' },
    branchName: { type: 'string', description: 'Custom branch name' },
    autoCreatePr: { type: 'boolean', description: 'Auto-create PR when done' },
    openAsCursorGithubApp: { type: 'boolean', description: 'Open PR as Cursor GitHub App' },
    skipReviewerRequest: { type: 'boolean', description: 'Skip reviewer request' },
    agentId: { type: 'string', description: 'Agent identifier' },
    limit: { type: 'number', description: 'Number of results to return' },
    cursor: { type: 'string', description: 'Pagination cursor' },
    apiKey: { type: 'string', description: 'Cursor API key' },
  },
  outputs: {
    content: { type: 'string', description: 'Human-readable response content' },
    metadata: { type: 'json', description: 'Response metadata' },
  },
}
```

--------------------------------------------------------------------------------

````
