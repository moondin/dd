---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 458
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 458 of 933)

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

---[FILE: gmail.ts]---
Location: sim-main/apps/sim/blocks/blocks/gmail.ts

```typescript
import { GmailIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { GmailToolResponse } from '@/tools/gmail/types'
import { getTrigger } from '@/triggers'

export const GmailBlock: BlockConfig<GmailToolResponse> = {
  type: 'gmail',
  name: 'Gmail',
  description: 'Send, read, search, and move Gmail messages or trigger workflows from Gmail events',
  authMode: AuthMode.OAuth,
  longDescription:
    'Integrate Gmail into the workflow. Can send, read, search, and move emails. Can be used in trigger mode to trigger a workflow when a new email is received.',
  docsLink: 'https://docs.sim.ai/tools/gmail',
  category: 'tools',
  bgColor: '#E0E0E0',
  icon: GmailIcon,
  triggerAllowed: true,
  subBlocks: [
    // Operation selector
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Send Email', id: 'send_gmail' },
        { label: 'Read Email', id: 'read_gmail' },
        { label: 'Draft Email', id: 'draft_gmail' },
        { label: 'Search Email', id: 'search_gmail' },
        { label: 'Move Email', id: 'move_gmail' },
        { label: 'Mark as Read', id: 'mark_read_gmail' },
        { label: 'Mark as Unread', id: 'mark_unread_gmail' },
        { label: 'Archive Email', id: 'archive_gmail' },
        { label: 'Unarchive Email', id: 'unarchive_gmail' },
        { label: 'Delete Email', id: 'delete_gmail' },
        { label: 'Add Label', id: 'add_label_gmail' },
        { label: 'Remove Label', id: 'remove_label_gmail' },
      ],
      value: () => 'send_gmail',
    },
    // Gmail Credentials
    {
      id: 'credential',
      title: 'Gmail Account',
      type: 'oauth-input',
      serviceId: 'gmail',
      requiredScopes: [
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/gmail.modify',
        'https://www.googleapis.com/auth/gmail.labels',
      ],
      placeholder: 'Select Gmail account',
      required: true,
    },
    // Send Email Fields
    {
      id: 'to',
      title: 'To',
      type: 'short-input',
      placeholder: 'Recipient email address',
      condition: { field: 'operation', value: ['send_gmail', 'draft_gmail'] },
      required: true,
    },
    {
      id: 'subject',
      title: 'Subject',
      type: 'short-input',
      placeholder: 'Email subject',
      condition: { field: 'operation', value: ['send_gmail', 'draft_gmail'] },
      required: false,
    },
    {
      id: 'body',
      title: 'Body',
      type: 'long-input',
      placeholder: 'Email content',
      condition: { field: 'operation', value: ['send_gmail', 'draft_gmail'] },
      required: true,
    },
    {
      id: 'contentType',
      title: 'Content Type',
      type: 'dropdown',
      options: [
        { label: 'Plain Text', id: 'text' },
        { label: 'HTML', id: 'html' },
      ],
      condition: { field: 'operation', value: ['send_gmail', 'draft_gmail'] },
      value: () => 'text',
      required: false,
    },
    // File upload (basic mode)
    {
      id: 'attachmentFiles',
      title: 'Attachments',
      type: 'file-upload',
      canonicalParamId: 'attachments',
      placeholder: 'Upload files to attach',
      condition: { field: 'operation', value: ['send_gmail', 'draft_gmail'] },
      mode: 'basic',
      multiple: true,
      required: false,
    },
    // Variable reference (advanced mode)
    {
      id: 'attachments',
      title: 'Attachments',
      type: 'short-input',
      canonicalParamId: 'attachments',
      placeholder: 'Reference files from previous blocks',
      condition: { field: 'operation', value: ['send_gmail', 'draft_gmail'] },
      mode: 'advanced',
      required: false,
    },
    // Advanced Settings - Threading
    {
      id: 'threadId',
      title: 'Thread ID',
      type: 'short-input',
      placeholder: 'Thread ID to reply to (for threading)',
      condition: { field: 'operation', value: ['send_gmail', 'draft_gmail'] },
      mode: 'advanced',
      required: false,
    },
    {
      id: 'replyToMessageId',
      title: 'Reply to Message ID',
      type: 'short-input',
      placeholder: 'Gmail message ID (not RFC Message-ID) - use the "id" field from results',
      condition: { field: 'operation', value: ['send_gmail', 'draft_gmail'] },
      mode: 'advanced',
      required: false,
    },
    // Advanced Settings - Additional Recipients
    {
      id: 'cc',
      title: 'CC',
      type: 'short-input',
      placeholder: 'CC recipients (comma-separated)',
      condition: { field: 'operation', value: ['send_gmail', 'draft_gmail'] },
      mode: 'advanced',
      required: false,
    },
    {
      id: 'bcc',
      title: 'BCC',
      type: 'short-input',
      placeholder: 'BCC recipients (comma-separated)',
      condition: { field: 'operation', value: ['send_gmail', 'draft_gmail'] },
      mode: 'advanced',
      required: false,
    },
    // Label/folder selector (basic mode)
    {
      id: 'folder',
      title: 'Label',
      type: 'folder-selector',
      canonicalParamId: 'folder',
      serviceId: 'gmail',
      requiredScopes: ['https://www.googleapis.com/auth/gmail.labels'],
      placeholder: 'Select Gmail label/folder',
      dependsOn: ['credential'],
      mode: 'basic',
      condition: { field: 'operation', value: 'read_gmail' },
    },
    // Manual label/folder input (advanced mode)
    {
      id: 'manualFolder',
      title: 'Label/Folder',
      type: 'short-input',
      canonicalParamId: 'folder',
      placeholder: 'Enter Gmail label name (e.g., INBOX, SENT, or custom label)',
      mode: 'advanced',
      condition: { field: 'operation', value: 'read_gmail' },
    },
    {
      id: 'unreadOnly',
      title: 'Unread Only',
      type: 'switch',
      condition: { field: 'operation', value: 'read_gmail' },
    },
    {
      id: 'includeAttachments',
      title: 'Include Attachments',
      type: 'switch',
      condition: { field: 'operation', value: 'read_gmail' },
    },
    {
      id: 'messageId',
      title: 'Message ID',
      type: 'short-input',
      placeholder: 'Enter message ID to read (optional)',
      condition: {
        field: 'operation',
        value: 'read_gmail',
        and: {
          field: 'folder',
          value: '',
        },
      },
    },
    // Search Fields
    {
      id: 'query',
      title: 'Search Query',
      type: 'short-input',
      placeholder: 'Enter search terms',
      condition: { field: 'operation', value: 'search_gmail' },
      required: true,
    },
    {
      id: 'maxResults',
      title: 'Max Results',
      type: 'short-input',
      placeholder: 'Maximum number of results (default: 10)',
      condition: { field: 'operation', value: ['search_gmail', 'read_gmail'] },
    },
    // Move Email Fields
    {
      id: 'moveMessageId',
      title: 'Message ID',
      type: 'short-input',
      placeholder: 'ID of the email to move',
      condition: { field: 'operation', value: 'move_gmail' },
      required: true,
    },
    // Destination label selector (basic mode)
    {
      id: 'destinationLabel',
      title: 'Move To Label',
      type: 'folder-selector',
      canonicalParamId: 'addLabelIds',
      serviceId: 'gmail',
      requiredScopes: ['https://www.googleapis.com/auth/gmail.labels'],
      placeholder: 'Select destination label',
      dependsOn: ['credential'],
      mode: 'basic',
      condition: { field: 'operation', value: 'move_gmail' },
      required: true,
    },
    // Manual destination label input (advanced mode)
    {
      id: 'manualDestinationLabel',
      title: 'Move To Label',
      type: 'short-input',
      canonicalParamId: 'addLabelIds',
      placeholder: 'Enter label ID (e.g., INBOX, Label_123)',
      mode: 'advanced',
      condition: { field: 'operation', value: 'move_gmail' },
      required: true,
    },
    // Source label selector (basic mode)
    {
      id: 'sourceLabel',
      title: 'Remove From Label',
      type: 'folder-selector',
      canonicalParamId: 'removeLabelIds',
      serviceId: 'gmail',
      requiredScopes: ['https://www.googleapis.com/auth/gmail.labels'],
      placeholder: 'Select label to remove',
      dependsOn: ['credential'],
      mode: 'basic',
      condition: { field: 'operation', value: 'move_gmail' },
      required: false,
    },
    // Manual source label input (advanced mode)
    {
      id: 'manualSourceLabel',
      title: 'Remove From Label',
      type: 'short-input',
      canonicalParamId: 'removeLabelIds',
      placeholder: 'Enter label ID to remove (e.g., INBOX)',
      mode: 'advanced',
      condition: { field: 'operation', value: 'move_gmail' },
      required: false,
    },
    // Mark as Read/Unread, Archive/Unarchive, Delete - Message ID field
    {
      id: 'actionMessageId',
      title: 'Message ID',
      type: 'short-input',
      placeholder: 'ID of the email',
      condition: {
        field: 'operation',
        value: [
          'mark_read_gmail',
          'mark_unread_gmail',
          'archive_gmail',
          'unarchive_gmail',
          'delete_gmail',
        ],
      },
      required: true,
    },
    // Add/Remove Label - Message ID field
    {
      id: 'labelActionMessageId',
      title: 'Message ID',
      type: 'short-input',
      placeholder: 'ID of the email',
      condition: { field: 'operation', value: ['add_label_gmail', 'remove_label_gmail'] },
      required: true,
    },
    // Add/Remove Label - Label selector (basic mode)
    {
      id: 'labelManagement',
      title: 'Label',
      type: 'folder-selector',
      canonicalParamId: 'labelIds',
      serviceId: 'gmail',
      requiredScopes: ['https://www.googleapis.com/auth/gmail.labels'],
      placeholder: 'Select label',
      dependsOn: ['credential'],
      mode: 'basic',
      condition: { field: 'operation', value: ['add_label_gmail', 'remove_label_gmail'] },
      required: true,
    },
    // Add/Remove Label - Manual label input (advanced mode)
    {
      id: 'manualLabelManagement',
      title: 'Label',
      type: 'short-input',
      canonicalParamId: 'labelIds',
      placeholder: 'Enter label ID (e.g., INBOX, Label_123)',
      mode: 'advanced',
      condition: { field: 'operation', value: ['add_label_gmail', 'remove_label_gmail'] },
      required: true,
    },
    ...getTrigger('gmail_poller').subBlocks,
  ],
  tools: {
    access: [
      'gmail_send',
      'gmail_draft',
      'gmail_read',
      'gmail_search',
      'gmail_move',
      'gmail_mark_read',
      'gmail_mark_unread',
      'gmail_archive',
      'gmail_unarchive',
      'gmail_delete',
      'gmail_add_label',
      'gmail_remove_label',
    ],
    config: {
      tool: (params) => {
        switch (params.operation) {
          case 'send_gmail':
            return 'gmail_send'
          case 'draft_gmail':
            return 'gmail_draft'
          case 'search_gmail':
            return 'gmail_search'
          case 'read_gmail':
            return 'gmail_read'
          case 'move_gmail':
            return 'gmail_move'
          case 'mark_read_gmail':
            return 'gmail_mark_read'
          case 'mark_unread_gmail':
            return 'gmail_mark_unread'
          case 'archive_gmail':
            return 'gmail_archive'
          case 'unarchive_gmail':
            return 'gmail_unarchive'
          case 'delete_gmail':
            return 'gmail_delete'
          case 'add_label_gmail':
            return 'gmail_add_label'
          case 'remove_label_gmail':
            return 'gmail_remove_label'
          default:
            throw new Error(`Invalid Gmail operation: ${params.operation}`)
        }
      },
      params: (params) => {
        const {
          credential,
          folder,
          manualFolder,
          destinationLabel,
          manualDestinationLabel,
          sourceLabel,
          manualSourceLabel,
          moveMessageId,
          actionMessageId,
          labelActionMessageId,
          labelManagement,
          manualLabelManagement,
          ...rest
        } = params

        // Handle both selector and manual folder input
        const effectiveFolder = (folder || manualFolder || '').trim()

        if (rest.operation === 'read_gmail') {
          rest.folder = effectiveFolder || 'INBOX'
        }

        // Handle move operation
        if (rest.operation === 'move_gmail') {
          if (moveMessageId) {
            rest.messageId = moveMessageId
          }
          if (!rest.addLabelIds) {
            rest.addLabelIds = (destinationLabel || manualDestinationLabel || '').trim()
          }
          if (!rest.removeLabelIds) {
            rest.removeLabelIds = (sourceLabel || manualSourceLabel || '').trim()
          }
        }

        // Handle simple message ID operations
        if (
          [
            'mark_read_gmail',
            'mark_unread_gmail',
            'archive_gmail',
            'unarchive_gmail',
            'delete_gmail',
          ].includes(rest.operation)
        ) {
          if (actionMessageId) {
            rest.messageId = actionMessageId
          }
        }

        if (['add_label_gmail', 'remove_label_gmail'].includes(rest.operation)) {
          if (labelActionMessageId) {
            rest.messageId = labelActionMessageId
          }
          if (!rest.labelIds) {
            rest.labelIds = (labelManagement || manualLabelManagement || '').trim()
          }
        }

        return {
          ...rest,
          credential,
        }
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    credential: { type: 'string', description: 'Gmail access token' },
    // Send operation inputs
    to: { type: 'string', description: 'Recipient email address' },
    subject: { type: 'string', description: 'Email subject' },
    body: { type: 'string', description: 'Email content' },
    contentType: { type: 'string', description: 'Content type (text or html)' },
    threadId: { type: 'string', description: 'Thread ID to reply to (for threading)' },
    replyToMessageId: {
      type: 'string',
      description: 'Gmail message ID to reply to (use "id" field from results, not "messageId")',
    },
    cc: { type: 'string', description: 'CC recipients (comma-separated)' },
    bcc: { type: 'string', description: 'BCC recipients (comma-separated)' },
    attachments: { type: 'array', description: 'Files to attach (UserFile array)' },
    // Read operation inputs
    folder: { type: 'string', description: 'Gmail folder' },
    manualFolder: { type: 'string', description: 'Manual folder name' },
    readMessageId: { type: 'string', description: 'Message identifier for reading specific email' },
    unreadOnly: { type: 'boolean', description: 'Unread messages only' },
    includeAttachments: { type: 'boolean', description: 'Include email attachments' },
    // Search operation inputs
    query: { type: 'string', description: 'Search query' },
    maxResults: { type: 'number', description: 'Maximum results' },
    // Move operation inputs
    moveMessageId: { type: 'string', description: 'Message ID to move' },
    destinationLabel: { type: 'string', description: 'Destination label ID' },
    manualDestinationLabel: { type: 'string', description: 'Manual destination label ID' },
    sourceLabel: { type: 'string', description: 'Source label ID to remove' },
    manualSourceLabel: { type: 'string', description: 'Manual source label ID' },
    addLabelIds: { type: 'string', description: 'Label IDs to add' },
    removeLabelIds: { type: 'string', description: 'Label IDs to remove' },
    // Action operation inputs
    actionMessageId: { type: 'string', description: 'Message ID for actions' },
    labelActionMessageId: { type: 'string', description: 'Message ID for label actions' },
    labelManagement: { type: 'string', description: 'Label ID for management' },
    manualLabelManagement: { type: 'string', description: 'Manual label ID' },
    labelIds: { type: 'string', description: 'Label IDs for add/remove operations' },
  },
  outputs: {
    // Tool outputs
    content: { type: 'string', description: 'Response content' },
    metadata: { type: 'json', description: 'Email metadata' },
    attachments: { type: 'json', description: 'Email attachments array' },
    // Trigger outputs
    email_id: { type: 'string', description: 'Gmail message ID' },
    thread_id: { type: 'string', description: 'Gmail thread ID' },
    subject: { type: 'string', description: 'Email subject line' },
    from: { type: 'string', description: 'Sender email address' },
    to: { type: 'string', description: 'Recipient email address' },
    cc: { type: 'string', description: 'CC recipients (comma-separated)' },
    date: { type: 'string', description: 'Email date in ISO format' },
    body_text: { type: 'string', description: 'Plain text email body' },
    body_html: { type: 'string', description: 'HTML email body' },
    labels: { type: 'string', description: 'Email labels (comma-separated)' },
    has_attachments: { type: 'boolean', description: 'Whether email has attachments' },
    raw_email: { type: 'json', description: 'Complete raw email data from Gmail API (if enabled)' },
    timestamp: { type: 'string', description: 'Event timestamp' },
  },
  triggers: {
    enabled: true,
    available: ['gmail_poller'],
  },
}
```

--------------------------------------------------------------------------------

---[FILE: google.ts]---
Location: sim-main/apps/sim/blocks/blocks/google.ts

```typescript
import { GoogleIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { GoogleSearchResponse } from '@/tools/google/types'

export const GoogleSearchBlock: BlockConfig<GoogleSearchResponse> = {
  type: 'google_search',
  name: 'Google Search',
  description: 'Search the web',
  authMode: AuthMode.ApiKey,
  longDescription: 'Integrate Google Search into the workflow. Can search the web.',
  docsLink: 'https://docs.sim.ai/tools/google_search',
  category: 'tools',
  bgColor: '#E0E0E0',
  icon: GoogleIcon,

  subBlocks: [
    {
      id: 'query',
      title: 'Search Query',
      type: 'long-input',
      placeholder: 'Enter your search query',
      required: true,
    },
    {
      id: 'searchEngineId',
      title: 'Custom Search Engine ID',
      type: 'short-input',
      placeholder: 'Enter your Custom Search Engine ID',
      required: true,
    },
    {
      id: 'apiKey',
      title: 'API Key',
      type: 'short-input',
      placeholder: 'Enter your Google API key',
      password: true,
      required: true,
    },
    {
      id: 'num',
      title: 'Number of Results',
      type: 'short-input',
      placeholder: '10',
      required: true,
    },
  ],

  tools: {
    access: ['google_search'],
    config: {
      tool: () => 'google_search',
      params: (params) => ({
        query: params.query,
        apiKey: params.apiKey,
        searchEngineId: params.searchEngineId,
        num: params.num || undefined,
      }),
    },
  },

  inputs: {
    query: { type: 'string', description: 'Search query terms' },
    apiKey: { type: 'string', description: 'Google API key' },
    searchEngineId: { type: 'string', description: 'Custom search engine ID' },
    num: { type: 'string', description: 'Number of results' },
  },

  outputs: {
    items: { type: 'json', description: 'Search result items' },
    searchInformation: { type: 'json', description: 'Search metadata' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: google_calendar.ts]---
Location: sim-main/apps/sim/blocks/blocks/google_calendar.ts

```typescript
import { GoogleCalendarIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { GoogleCalendarResponse } from '@/tools/google_calendar/types'

export const GoogleCalendarBlock: BlockConfig<GoogleCalendarResponse> = {
  type: 'google_calendar',
  name: 'Google Calendar',
  description: 'Manage Google Calendar events',
  authMode: AuthMode.OAuth,
  longDescription:
    'Integrate Google Calendar into the workflow. Can create, read, update, and list calendar events.',
  docsLink: 'https://docs.sim.ai/tools/google_calendar',
  category: 'tools',
  bgColor: '#E0E0E0',
  icon: GoogleCalendarIcon,
  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Create Event', id: 'create' },
        { label: 'List Events', id: 'list' },
        { label: 'Get Event', id: 'get' },
        { label: 'Quick Add (Natural Language)', id: 'quick_add' },
        { label: 'Invite Attendees', id: 'invite' },
      ],
      value: () => 'create',
    },
    {
      id: 'credential',
      title: 'Google Calendar Account',
      type: 'oauth-input',
      required: true,
      serviceId: 'google-calendar',
      requiredScopes: ['https://www.googleapis.com/auth/calendar'],
      placeholder: 'Select Google Calendar account',
    },
    // Calendar selector (basic mode)
    {
      id: 'calendarId',
      title: 'Calendar',
      type: 'file-selector',
      canonicalParamId: 'calendarId',
      serviceId: 'google-calendar',
      requiredScopes: ['https://www.googleapis.com/auth/calendar'],
      placeholder: 'Select calendar',
      dependsOn: ['credential'],
      mode: 'basic',
    },
    // Manual calendar ID input (advanced mode)
    {
      id: 'manualCalendarId',
      title: 'Calendar ID',
      type: 'short-input',
      canonicalParamId: 'calendarId',
      placeholder: 'Enter calendar ID (e.g., primary or calendar@gmail.com)',
      mode: 'advanced',
    },

    // Create Event Fields
    {
      id: 'summary',
      title: 'Event Title',
      type: 'short-input',
      placeholder: 'Meeting with team',
      condition: { field: 'operation', value: 'create' },
      required: true,
    },
    {
      id: 'description',
      title: 'Description',
      type: 'long-input',
      placeholder: 'Event description',
      condition: { field: 'operation', value: 'create' },
    },
    {
      id: 'location',
      title: 'Location',
      type: 'short-input',
      placeholder: 'Conference Room A',
      condition: { field: 'operation', value: 'create' },
    },
    {
      id: 'startDateTime',
      title: 'Start Date & Time',
      type: 'short-input',
      placeholder: '2025-06-03T10:00:00-08:00',
      condition: { field: 'operation', value: 'create' },
      required: true,
    },
    {
      id: 'endDateTime',
      title: 'End Date & Time',
      type: 'short-input',
      placeholder: '2025-06-03T11:00:00-08:00',
      condition: { field: 'operation', value: 'create' },
      required: true,
    },
    {
      id: 'attendees',
      title: 'Attendees (comma-separated emails)',
      type: 'short-input',
      placeholder: 'john@example.com, jane@example.com',
      condition: { field: 'operation', value: 'create' },
    },

    // List Events Fields
    {
      id: 'timeMin',
      title: 'Start Time Filter',
      type: 'short-input',
      placeholder: '2025-06-03T00:00:00Z',
      condition: { field: 'operation', value: 'list' },
    },
    {
      id: 'timeMax',
      title: 'End Time Filter',
      type: 'short-input',
      placeholder: '2025-06-04T00:00:00Z',
      condition: { field: 'operation', value: 'list' },
    },

    // Get Event Fields
    {
      id: 'eventId',
      title: 'Event ID',
      type: 'short-input',
      placeholder: 'Event ID',
      condition: { field: 'operation', value: ['get', 'invite'] },
      required: true,
    },

    // Invite Attendees Fields
    {
      id: 'attendees',
      title: 'Attendees (comma-separated emails)',
      type: 'short-input',
      placeholder: 'john@example.com, jane@example.com',
      condition: { field: 'operation', value: 'invite' },
    },
    {
      id: 'replaceExisting',
      title: 'Replace Existing Attendees',
      type: 'dropdown',
      condition: { field: 'operation', value: 'invite' },
      options: [
        { label: 'Add to existing attendees', id: 'false' },
        { label: 'Replace all attendees', id: 'true' },
      ],
    },

    // Quick Add Fields
    {
      id: 'text',
      title: 'Natural Language Event',
      type: 'long-input',
      placeholder: 'Meeting with John tomorrow at 3pm for 1 hour',
      condition: { field: 'operation', value: 'quick_add' },
      required: true,
    },
    {
      id: 'attendees',
      title: 'Attendees (comma-separated emails)',
      type: 'short-input',
      placeholder: 'john@example.com, jane@example.com',
      condition: { field: 'operation', value: 'quick_add' },
      required: true,
    },

    // Notification setting (for create, quick_add, invite)
    {
      id: 'sendUpdates',
      title: 'Send Email Notifications',
      type: 'dropdown',
      condition: {
        field: 'operation',
        value: ['create', 'quick_add', 'invite'],
      },
      options: [
        { label: 'All attendees', id: 'all' },
        { label: 'External attendees only', id: 'externalOnly' },
        { label: 'None (no emails sent)', id: 'none' },
      ],
    },
  ],
  tools: {
    access: [
      'google_calendar_create',
      'google_calendar_list',
      'google_calendar_get',
      'google_calendar_quick_add',
      'google_calendar_invite',
    ],
    config: {
      tool: (params) => {
        switch (params.operation) {
          case 'create':
            return 'google_calendar_create'
          case 'list':
            return 'google_calendar_list'
          case 'get':
            return 'google_calendar_get'
          case 'quick_add':
            return 'google_calendar_quick_add'
          case 'invite':
            return 'google_calendar_invite'
          default:
            throw new Error(`Invalid Google Calendar operation: ${params.operation}`)
        }
      },
      params: (params) => {
        const {
          credential,
          operation,
          attendees,
          replaceExisting,
          calendarId,
          manualCalendarId,
          ...rest
        } = params

        // Handle calendar ID (selector or manual)
        const effectiveCalendarId = (calendarId || manualCalendarId || '').trim()

        const processedParams: Record<string, any> = {
          ...rest,
          calendarId: effectiveCalendarId || 'primary',
        }

        // Convert comma-separated attendees string to array, only if it has content
        if (attendees && typeof attendees === 'string' && attendees.trim().length > 0) {
          const attendeeList = attendees
            .split(',')
            .map((email) => email.trim())
            .filter((email) => email.length > 0)

          // Only add attendees if we have valid entries
          if (attendeeList.length > 0) {
            processedParams.attendees = attendeeList
          }
        }

        // Convert replaceExisting string to boolean for invite operation
        if (operation === 'invite' && replaceExisting !== undefined) {
          processedParams.replaceExisting = replaceExisting === 'true'
        }

        // Set default sendUpdates to 'all' if not specified for operations that support it
        if (['create', 'quick_add', 'invite'].includes(operation) && !processedParams.sendUpdates) {
          processedParams.sendUpdates = 'all'
        }

        return {
          credential,
          ...processedParams,
        }
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    credential: { type: 'string', description: 'Google Calendar access token' },
    calendarId: { type: 'string', description: 'Calendar identifier' },
    manualCalendarId: { type: 'string', description: 'Manual calendar identifier' },

    // Create operation inputs
    summary: { type: 'string', description: 'Event title' },
    description: { type: 'string', description: 'Event description' },
    location: { type: 'string', description: 'Event location' },
    startDateTime: { type: 'string', description: 'Event start time' },
    endDateTime: { type: 'string', description: 'Event end time' },
    attendees: { type: 'string', description: 'Attendee email list' },

    // List operation inputs
    timeMin: { type: 'string', description: 'Start time filter' },
    timeMax: { type: 'string', description: 'End time filter' },

    // Get/Invite operation inputs
    eventId: { type: 'string', description: 'Event identifier' },

    // Quick add inputs
    text: { type: 'string', description: 'Natural language event' },

    // Invite specific inputs
    replaceExisting: { type: 'string', description: 'Replace existing attendees' },

    // Common inputs
    sendUpdates: { type: 'string', description: 'Send email notifications' },
  },
  outputs: {
    content: { type: 'string', description: 'Operation response content' },
    metadata: { type: 'json', description: 'Event metadata' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: google_docs.ts]---
Location: sim-main/apps/sim/blocks/blocks/google_docs.ts

```typescript
import { GoogleDocsIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { GoogleDocsResponse } from '@/tools/google_docs/types'

export const GoogleDocsBlock: BlockConfig<GoogleDocsResponse> = {
  type: 'google_docs',
  name: 'Google Docs',
  description: 'Read, write, and create documents',
  authMode: AuthMode.OAuth,
  longDescription:
    'Integrate Google Docs into the workflow. Can read, write, and create documents.',
  docsLink: 'https://docs.sim.ai/tools/google_docs',
  category: 'tools',
  bgColor: '#E0E0E0',
  icon: GoogleDocsIcon,
  subBlocks: [
    // Operation selector
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Read Document', id: 'read' },
        { label: 'Write to Document', id: 'write' },
        { label: 'Create Document', id: 'create' },
      ],
      value: () => 'read',
    },
    // Google Docs Credentials
    {
      id: 'credential',
      title: 'Google Account',
      type: 'oauth-input',
      required: true,
      serviceId: 'google-docs',
      requiredScopes: [
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive',
      ],
      placeholder: 'Select Google account',
    },
    // Document selector (basic mode)
    {
      id: 'documentId',
      title: 'Select Document',
      type: 'file-selector',
      canonicalParamId: 'documentId',
      serviceId: 'google-docs',
      requiredScopes: [],
      mimeType: 'application/vnd.google-apps.document',
      placeholder: 'Select a document',
      dependsOn: ['credential'],
      mode: 'basic',
      condition: { field: 'operation', value: ['read', 'write'] },
    },
    // Manual document ID input (advanced mode)
    {
      id: 'manualDocumentId',
      title: 'Document ID',
      type: 'short-input',
      canonicalParamId: 'documentId',
      placeholder: 'Enter document ID',
      dependsOn: ['credential'],
      mode: 'advanced',
      condition: { field: 'operation', value: ['read', 'write'] },
    },
    // Create-specific Fields
    {
      id: 'title',
      title: 'Document Title',
      type: 'short-input',
      placeholder: 'Enter title for the new document',
      condition: { field: 'operation', value: 'create' },
      required: true,
    },
    // Folder selector (basic mode)
    {
      id: 'folderSelector',
      title: 'Select Parent Folder',
      type: 'file-selector',
      canonicalParamId: 'folderId',
      serviceId: 'google-docs',
      requiredScopes: [],
      mimeType: 'application/vnd.google-apps.folder',
      placeholder: 'Select a parent folder',
      dependsOn: ['credential'],
      mode: 'basic',
      condition: { field: 'operation', value: 'create' },
    },
    // Manual folder ID input (advanced mode)
    {
      id: 'folderId',
      title: 'Parent Folder ID',
      type: 'short-input',
      canonicalParamId: 'folderId',
      placeholder: 'Enter parent folder ID (leave empty for root folder)',
      dependsOn: ['credential'],
      mode: 'advanced',
      condition: { field: 'operation', value: 'create' },
    },
    // Content Field for write operation
    {
      id: 'content',
      title: 'Content',
      type: 'long-input',
      placeholder: 'Enter document content',
      condition: { field: 'operation', value: 'write' },
      required: true,
    },
    // Content Field for create operation
    {
      id: 'content',
      title: 'Content',
      type: 'long-input',
      placeholder: 'Enter document content',
      condition: { field: 'operation', value: 'create' },
    },
  ],
  tools: {
    access: ['google_docs_read', 'google_docs_write', 'google_docs_create'],
    config: {
      tool: (params) => {
        switch (params.operation) {
          case 'read':
            return 'google_docs_read'
          case 'write':
            return 'google_docs_write'
          case 'create':
            return 'google_docs_create'
          default:
            throw new Error(`Invalid Google Docs operation: ${params.operation}`)
        }
      },
      params: (params) => {
        const { credential, documentId, manualDocumentId, folderSelector, folderId, ...rest } =
          params

        const effectiveDocumentId = (documentId || manualDocumentId || '').trim()
        const effectiveFolderId = (folderSelector || folderId || '').trim()

        return {
          ...rest,
          documentId: effectiveDocumentId || undefined,
          folderId: effectiveFolderId || undefined,
          credential,
        }
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    credential: { type: 'string', description: 'Google Docs access token' },
    documentId: { type: 'string', description: 'Document identifier' },
    manualDocumentId: { type: 'string', description: 'Manual document identifier' },
    title: { type: 'string', description: 'Document title' },
    folderSelector: { type: 'string', description: 'Selected folder' },
    folderId: { type: 'string', description: 'Folder identifier' },
    content: { type: 'string', description: 'Document content' },
  },
  outputs: {
    content: { type: 'string', description: 'Document content' },
    metadata: { type: 'json', description: 'Document metadata' },
    updatedContent: { type: 'boolean', description: 'Content update status' },
  },
}
```

--------------------------------------------------------------------------------

````
