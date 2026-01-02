---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 497
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 497 of 933)

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

---[FILE: zep.ts]---
Location: sim-main/apps/sim/blocks/blocks/zep.ts

```typescript
import { ZepIcon } from '@/components/icons'
import { AuthMode, type BlockConfig } from '@/blocks/types'
import type { ZepResponse } from '@/tools/zep/types'

export const ZepBlock: BlockConfig<ZepResponse> = {
  type: 'zep',
  name: 'Zep',
  description: 'Long-term memory for AI agents',
  authMode: AuthMode.ApiKey,
  longDescription:
    'Integrate Zep for long-term memory management. Create threads, add messages, retrieve context with AI-powered summaries and facts extraction.',
  bgColor: '#E8E8E8',
  icon: ZepIcon,
  category: 'tools',
  docsLink: 'https://docs.sim.ai/tools/zep',
  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Create Thread', id: 'create_thread' },
        { label: 'Add Messages', id: 'add_messages' },
        { label: 'Get Context', id: 'get_context' },
        { label: 'Get Messages', id: 'get_messages' },
        { label: 'Get Threads', id: 'get_threads' },
        { label: 'Delete Thread', id: 'delete_thread' },
        { label: 'Add User', id: 'add_user' },
        { label: 'Get User', id: 'get_user' },
        { label: 'Get User Threads', id: 'get_user_threads' },
      ],
      placeholder: 'Select an operation',
      value: () => 'create_thread',
    },
    {
      id: 'threadId',
      title: 'Thread ID',
      type: 'short-input',
      placeholder: 'Enter unique thread identifier',
      condition: {
        field: 'operation',
        value: ['create_thread', 'add_messages', 'get_context', 'get_messages', 'delete_thread'],
      },
      required: true,
    },
    {
      id: 'userId',
      title: 'User ID',
      type: 'short-input',
      placeholder: 'Enter user identifier',
      condition: {
        field: 'operation',
        value: ['create_thread', 'add_user', 'get_user', 'get_user_threads'],
      },
      required: true,
    },
    {
      id: 'email',
      title: 'Email',
      type: 'short-input',
      placeholder: 'user@example.com',
      condition: {
        field: 'operation',
        value: 'add_user',
      },
    },
    {
      id: 'firstName',
      title: 'First Name',
      type: 'short-input',
      placeholder: 'John',
      condition: {
        field: 'operation',
        value: 'add_user',
      },
    },
    {
      id: 'lastName',
      title: 'Last Name',
      type: 'short-input',
      placeholder: 'Doe',
      condition: {
        field: 'operation',
        value: 'add_user',
      },
    },
    {
      id: 'metadata',
      title: 'Metadata',
      type: 'code',
      placeholder: '{"key": "value"}',
      language: 'json',
      condition: {
        field: 'operation',
        value: 'add_user',
      },
    },
    {
      id: 'messages',
      title: 'Messages',
      type: 'code',
      placeholder: '[{"role": "user", "content": "Hello!"}]',
      language: 'json',
      condition: {
        field: 'operation',
        value: 'add_messages',
      },
      required: true,
    },
    {
      id: 'mode',
      title: 'Context Mode',
      type: 'dropdown',
      options: [
        { label: 'Summary (Natural Language)', id: 'summary' },
        { label: 'Basic (Raw Facts)', id: 'basic' },
      ],
      placeholder: 'Select context mode',
      value: () => 'summary',
      condition: {
        field: 'operation',
        value: 'get_context',
      },
    },
    {
      id: 'apiKey',
      title: 'API Key',
      type: 'short-input',
      placeholder: 'Enter your Zep API key',
      password: true,
      required: true,
    },
    {
      id: 'limit',
      title: 'Result Limit',
      type: 'slider',
      min: 1,
      max: 100,
      step: 1,
      integer: true,
      condition: {
        field: 'operation',
        value: ['get_messages', 'get_threads'],
      },
    },
  ],
  tools: {
    access: [
      'zep_create_thread',
      'zep_get_threads',
      'zep_delete_thread',
      'zep_get_context',
      'zep_get_messages',
      'zep_add_messages',
      'zep_add_user',
      'zep_get_user',
      'zep_get_user_threads',
    ],
    config: {
      tool: (params: Record<string, any>) => {
        const operation = params.operation || 'create_thread'
        switch (operation) {
          case 'create_thread':
            return 'zep_create_thread'
          case 'add_messages':
            return 'zep_add_messages'
          case 'get_context':
            return 'zep_get_context'
          case 'get_messages':
            return 'zep_get_messages'
          case 'get_threads':
            return 'zep_get_threads'
          case 'delete_thread':
            return 'zep_delete_thread'
          case 'add_user':
            return 'zep_add_user'
          case 'get_user':
            return 'zep_get_user'
          case 'get_user_threads':
            return 'zep_get_user_threads'
          default:
            return 'zep_create_thread'
        }
      },
      params: (params: Record<string, any>) => {
        const errors: string[] = []

        // Validate required API key for all operations
        if (!params.apiKey) {
          errors.push('API Key is required')
        }

        const operation = params.operation || 'create_thread'

        // Validate operation-specific required fields
        if (
          [
            'create_thread',
            'add_messages',
            'get_context',
            'get_messages',
            'delete_thread',
          ].includes(operation)
        ) {
          if (!params.threadId) {
            errors.push('Thread ID is required')
          }
        }

        if (operation === 'create_thread' || operation === 'add_user') {
          if (!params.userId) {
            errors.push('User ID is required')
          }
        }

        if (operation === 'get_user' || operation === 'get_user_threads') {
          if (!params.userId) {
            errors.push('User ID is required')
          }
        }

        if (operation === 'add_messages') {
          if (!params.messages) {
            errors.push('Messages are required')
          } else if (!Array.isArray(params.messages) || params.messages.length === 0) {
            errors.push('Messages must be a non-empty array')
          } else {
            for (const msg of params.messages) {
              if (!msg.role || !msg.content) {
                errors.push("Each message must have 'role' and 'content' properties")
                break
              }
            }
          }
        }

        // Throw error if any required fields are missing
        if (errors.length > 0) {
          throw new Error(`Zep Block Error: ${errors.join(', ')}`)
        }

        // Build the result params
        const result: Record<string, any> = {
          apiKey: params.apiKey,
        }

        if (params.threadId) result.threadId = params.threadId
        if (params.userId) result.userId = params.userId
        if (params.mode) result.mode = params.mode
        if (params.limit) result.limit = Number(params.limit)
        if (params.email) result.email = params.email
        if (params.firstName) result.firstName = params.firstName
        if (params.lastName) result.lastName = params.lastName
        if (params.metadata) result.metadata = params.metadata

        // Add messages for add operation
        if (operation === 'add_messages' && params.messages) {
          result.messages = params.messages
        }

        return result
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    apiKey: { type: 'string', description: 'Zep API key' },
    threadId: { type: 'string', description: 'Thread identifier' },
    userId: { type: 'string', description: 'User identifier' },
    messages: { type: 'json', description: 'Message data array' },
    mode: { type: 'string', description: 'Context mode (summary or basic)' },
    limit: { type: 'number', description: 'Result limit' },
    email: { type: 'string', description: 'User email' },
    firstName: { type: 'string', description: 'User first name' },
    lastName: { type: 'string', description: 'User last name' },
    metadata: { type: 'json', description: 'User metadata' },
  },
  outputs: {
    // Thread operations
    threadId: { type: 'string', description: 'Thread identifier' },
    uuid: { type: 'string', description: 'Internal UUID' },
    createdAt: { type: 'string', description: 'Creation timestamp' },
    updatedAt: { type: 'string', description: 'Update timestamp' },
    threads: { type: 'json', description: 'Array of threads' },
    deleted: { type: 'boolean', description: 'Deletion status' },
    // Message operations
    messages: { type: 'json', description: 'Message data' },
    messageIds: { type: 'json', description: 'Array of added message UUIDs' },
    added: { type: 'boolean', description: 'Whether messages were added successfully' },
    // Context operations
    context: { type: 'string', description: 'User context string (summary or basic mode)' },
    // User operations
    userId: { type: 'string', description: 'User identifier' },
    email: { type: 'string', description: 'User email' },
    firstName: { type: 'string', description: 'User first name' },
    lastName: { type: 'string', description: 'User last name' },
    metadata: { type: 'json', description: 'User metadata' },
    // Counts
    totalCount: { type: 'number', description: 'Total number of items returned' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: zoom.ts]---
Location: sim-main/apps/sim/blocks/blocks/zoom.ts

```typescript
import { ZoomIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { ZoomResponse } from '@/tools/zoom/types'

export const ZoomBlock: BlockConfig<ZoomResponse> = {
  type: 'zoom',
  name: 'Zoom',
  description: 'Create and manage Zoom meetings and recordings',
  authMode: AuthMode.OAuth,
  longDescription:
    'Integrate Zoom into workflows. Create, list, update, and delete Zoom meetings. Get meeting details, invitations, recordings, and participants. Manage cloud recordings programmatically.',
  docsLink: 'https://docs.sim.ai/tools/zoom',
  category: 'tools',
  bgColor: '#2D8CFF',
  icon: ZoomIcon,
  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Create Meeting', id: 'zoom_create_meeting' },
        { label: 'List Meetings', id: 'zoom_list_meetings' },
        { label: 'Get Meeting', id: 'zoom_get_meeting' },
        { label: 'Update Meeting', id: 'zoom_update_meeting' },
        { label: 'Delete Meeting', id: 'zoom_delete_meeting' },
        { label: 'Get Meeting Invitation', id: 'zoom_get_meeting_invitation' },
        { label: 'List Recordings', id: 'zoom_list_recordings' },
        { label: 'Get Meeting Recordings', id: 'zoom_get_meeting_recordings' },
        { label: 'Delete Recording', id: 'zoom_delete_recording' },
        { label: 'List Past Participants', id: 'zoom_list_past_participants' },
      ],
      value: () => 'zoom_create_meeting',
    },
    {
      id: 'credential',
      title: 'Zoom Account',
      type: 'oauth-input',
      serviceId: 'zoom',
      requiredScopes: [
        'user:read:user',
        'meeting:write:meeting',
        'meeting:read:meeting',
        'meeting:read:list_meetings',
        'meeting:update:meeting',
        'meeting:delete:meeting',
        'meeting:read:invitation',
        'meeting:read:list_past_participants',
        'cloud_recording:read:list_user_recordings',
        'cloud_recording:read:list_recording_files',
        'cloud_recording:delete:recording_file',
      ],
      placeholder: 'Select Zoom account',
      required: true,
    },
    // User ID for create/list operations
    {
      id: 'userId',
      title: 'User ID',
      type: 'short-input',
      placeholder: 'me (or user ID/email)',
      required: true,
      condition: {
        field: 'operation',
        value: ['zoom_create_meeting', 'zoom_list_meetings', 'zoom_list_recordings'],
      },
    },
    // Meeting ID for get/update/delete/invitation/recordings/participants operations
    {
      id: 'meetingId',
      title: 'Meeting ID',
      type: 'short-input',
      placeholder: 'Enter meeting ID',
      required: true,
      condition: {
        field: 'operation',
        value: [
          'zoom_get_meeting',
          'zoom_update_meeting',
          'zoom_delete_meeting',
          'zoom_get_meeting_invitation',
          'zoom_get_meeting_recordings',
          'zoom_delete_recording',
          'zoom_list_past_participants',
        ],
      },
    },
    // Topic for create/update
    {
      id: 'topic',
      title: 'Topic',
      type: 'short-input',
      placeholder: 'Meeting topic',
      required: true,
      condition: {
        field: 'operation',
        value: ['zoom_create_meeting'],
      },
    },
    {
      id: 'topicUpdate',
      title: 'Topic',
      type: 'short-input',
      placeholder: 'Meeting topic (optional)',
      condition: {
        field: 'operation',
        value: ['zoom_update_meeting'],
      },
    },
    // Meeting type
    {
      id: 'type',
      title: 'Meeting Type',
      type: 'dropdown',
      options: [
        { label: 'Scheduled', id: '2' },
        { label: 'Instant', id: '1' },
        { label: 'Recurring (no fixed time)', id: '3' },
        { label: 'Recurring (fixed time)', id: '8' },
      ],
      value: () => '2',
      condition: {
        field: 'operation',
        value: ['zoom_create_meeting', 'zoom_update_meeting'],
      },
    },
    // Start time
    {
      id: 'startTime',
      title: 'Start Time',
      type: 'short-input',
      placeholder: '2025-06-03T10:00:00Z',
      condition: {
        field: 'operation',
        value: ['zoom_create_meeting', 'zoom_update_meeting'],
      },
    },
    // Duration
    {
      id: 'duration',
      title: 'Duration (minutes)',
      type: 'short-input',
      placeholder: '30',
      condition: {
        field: 'operation',
        value: ['zoom_create_meeting', 'zoom_update_meeting'],
      },
    },
    // Timezone
    {
      id: 'timezone',
      title: 'Timezone',
      type: 'short-input',
      placeholder: 'America/Los_Angeles',
      condition: {
        field: 'operation',
        value: ['zoom_create_meeting', 'zoom_update_meeting'],
      },
    },
    // Password
    {
      id: 'password',
      title: 'Password',
      type: 'short-input',
      placeholder: 'Meeting password',
      condition: {
        field: 'operation',
        value: ['zoom_create_meeting', 'zoom_update_meeting'],
      },
    },
    // Agenda
    {
      id: 'agenda',
      title: 'Agenda',
      type: 'long-input',
      placeholder: 'Meeting agenda',
      condition: {
        field: 'operation',
        value: ['zoom_create_meeting', 'zoom_update_meeting'],
      },
    },
    // Meeting settings
    {
      id: 'hostVideo',
      title: 'Host Video',
      type: 'switch',
      condition: {
        field: 'operation',
        value: ['zoom_create_meeting', 'zoom_update_meeting'],
      },
    },
    {
      id: 'participantVideo',
      title: 'Participant Video',
      type: 'switch',
      condition: {
        field: 'operation',
        value: ['zoom_create_meeting', 'zoom_update_meeting'],
      },
    },
    {
      id: 'joinBeforeHost',
      title: 'Join Before Host',
      type: 'switch',
      condition: {
        field: 'operation',
        value: ['zoom_create_meeting', 'zoom_update_meeting'],
      },
    },
    {
      id: 'muteUponEntry',
      title: 'Mute Upon Entry',
      type: 'switch',
      condition: {
        field: 'operation',
        value: ['zoom_create_meeting', 'zoom_update_meeting'],
      },
    },
    {
      id: 'waitingRoom',
      title: 'Waiting Room',
      type: 'switch',
      condition: {
        field: 'operation',
        value: ['zoom_create_meeting', 'zoom_update_meeting'],
      },
    },
    {
      id: 'autoRecording',
      title: 'Auto Recording',
      type: 'dropdown',
      options: [
        { label: 'None', id: 'none' },
        { label: 'Local', id: 'local' },
        { label: 'Cloud', id: 'cloud' },
      ],
      value: () => 'none',
      condition: {
        field: 'operation',
        value: ['zoom_create_meeting', 'zoom_update_meeting'],
      },
    },
    // List meetings filter
    {
      id: 'listType',
      title: 'Meeting Type Filter',
      type: 'dropdown',
      options: [
        { label: 'Scheduled', id: 'scheduled' },
        { label: 'Live', id: 'live' },
        { label: 'Upcoming', id: 'upcoming' },
        { label: 'Upcoming Meetings', id: 'upcoming_meetings' },
        { label: 'Previous Meetings', id: 'previous_meetings' },
      ],
      value: () => 'scheduled',
      condition: {
        field: 'operation',
        value: ['zoom_list_meetings'],
      },
    },
    // Pagination
    {
      id: 'pageSize',
      title: 'Page Size',
      type: 'short-input',
      placeholder: 'Number of results (max 300)',
      condition: {
        field: 'operation',
        value: ['zoom_list_meetings', 'zoom_list_recordings', 'zoom_list_past_participants'],
      },
    },
    {
      id: 'nextPageToken',
      title: 'Page Token',
      type: 'short-input',
      placeholder: 'Token for next page',
      condition: {
        field: 'operation',
        value: ['zoom_list_meetings', 'zoom_list_recordings', 'zoom_list_past_participants'],
      },
    },
    // Recording date range
    {
      id: 'fromDate',
      title: 'From Date',
      type: 'short-input',
      placeholder: 'yyyy-mm-dd (within last 6 months)',
      condition: {
        field: 'operation',
        value: ['zoom_list_recordings'],
      },
    },
    {
      id: 'toDate',
      title: 'To Date',
      type: 'short-input',
      placeholder: 'yyyy-mm-dd',
      condition: {
        field: 'operation',
        value: ['zoom_list_recordings'],
      },
    },
    // Recording ID for delete
    {
      id: 'recordingId',
      title: 'Recording ID',
      type: 'short-input',
      placeholder: 'Specific recording file ID (optional)',
      condition: {
        field: 'operation',
        value: ['zoom_delete_recording'],
      },
    },
    // Delete action
    {
      id: 'deleteAction',
      title: 'Delete Action',
      type: 'dropdown',
      options: [
        { label: 'Move to Trash', id: 'trash' },
        { label: 'Permanently Delete', id: 'delete' },
      ],
      value: () => 'trash',
      condition: {
        field: 'operation',
        value: ['zoom_delete_recording'],
      },
    },
    // Delete options
    {
      id: 'occurrenceId',
      title: 'Occurrence ID',
      type: 'short-input',
      placeholder: 'For recurring meetings',
      condition: {
        field: 'operation',
        value: ['zoom_get_meeting', 'zoom_delete_meeting'],
      },
    },
    {
      id: 'cancelMeetingReminder',
      title: 'Send Cancellation Email',
      type: 'switch',
      condition: {
        field: 'operation',
        value: ['zoom_delete_meeting'],
      },
    },
  ],
  tools: {
    access: [
      'zoom_create_meeting',
      'zoom_list_meetings',
      'zoom_get_meeting',
      'zoom_update_meeting',
      'zoom_delete_meeting',
      'zoom_get_meeting_invitation',
      'zoom_list_recordings',
      'zoom_get_meeting_recordings',
      'zoom_delete_recording',
      'zoom_list_past_participants',
    ],
    config: {
      tool: (params) => {
        return params.operation || 'zoom_create_meeting'
      },
      params: (params) => {
        const baseParams: Record<string, any> = {
          credential: params.credential,
        }

        switch (params.operation) {
          case 'zoom_create_meeting':
            if (!params.userId?.trim()) {
              throw new Error('User ID is required.')
            }
            if (!params.topic?.trim()) {
              throw new Error('Topic is required.')
            }
            return {
              ...baseParams,
              userId: params.userId.trim(),
              topic: params.topic.trim(),
              type: params.type ? Number(params.type) : 2,
              startTime: params.startTime,
              duration: params.duration ? Number(params.duration) : undefined,
              timezone: params.timezone,
              password: params.password,
              agenda: params.agenda,
              hostVideo: params.hostVideo,
              participantVideo: params.participantVideo,
              joinBeforeHost: params.joinBeforeHost,
              muteUponEntry: params.muteUponEntry,
              waitingRoom: params.waitingRoom,
              autoRecording: params.autoRecording !== 'none' ? params.autoRecording : undefined,
            }

          case 'zoom_list_meetings':
            if (!params.userId?.trim()) {
              throw new Error('User ID is required.')
            }
            return {
              ...baseParams,
              userId: params.userId.trim(),
              type: params.listType,
              pageSize: params.pageSize ? Number(params.pageSize) : undefined,
              nextPageToken: params.nextPageToken,
            }

          case 'zoom_get_meeting':
            if (!params.meetingId?.trim()) {
              throw new Error('Meeting ID is required.')
            }
            return {
              ...baseParams,
              meetingId: params.meetingId.trim(),
              occurrenceId: params.occurrenceId,
            }

          case 'zoom_update_meeting':
            if (!params.meetingId?.trim()) {
              throw new Error('Meeting ID is required.')
            }
            return {
              ...baseParams,
              meetingId: params.meetingId.trim(),
              topic: params.topicUpdate,
              type: params.type ? Number(params.type) : undefined,
              startTime: params.startTime,
              duration: params.duration ? Number(params.duration) : undefined,
              timezone: params.timezone,
              password: params.password,
              agenda: params.agenda,
              hostVideo: params.hostVideo,
              participantVideo: params.participantVideo,
              joinBeforeHost: params.joinBeforeHost,
              muteUponEntry: params.muteUponEntry,
              waitingRoom: params.waitingRoom,
              autoRecording: params.autoRecording !== 'none' ? params.autoRecording : undefined,
            }

          case 'zoom_delete_meeting':
            if (!params.meetingId?.trim()) {
              throw new Error('Meeting ID is required.')
            }
            return {
              ...baseParams,
              meetingId: params.meetingId.trim(),
              occurrenceId: params.occurrenceId,
              cancelMeetingReminder: params.cancelMeetingReminder,
            }

          case 'zoom_get_meeting_invitation':
            if (!params.meetingId?.trim()) {
              throw new Error('Meeting ID is required.')
            }
            return {
              ...baseParams,
              meetingId: params.meetingId.trim(),
            }

          case 'zoom_list_recordings':
            if (!params.userId?.trim()) {
              throw new Error('User ID is required.')
            }
            return {
              ...baseParams,
              userId: params.userId.trim(),
              from: params.fromDate,
              to: params.toDate,
              pageSize: params.pageSize ? Number(params.pageSize) : undefined,
              nextPageToken: params.nextPageToken,
            }

          case 'zoom_get_meeting_recordings':
            if (!params.meetingId?.trim()) {
              throw new Error('Meeting ID is required.')
            }
            return {
              ...baseParams,
              meetingId: params.meetingId.trim(),
            }

          case 'zoom_delete_recording':
            if (!params.meetingId?.trim()) {
              throw new Error('Meeting ID is required.')
            }
            return {
              ...baseParams,
              meetingId: params.meetingId.trim(),
              recordingId: params.recordingId,
              action: params.deleteAction,
            }

          case 'zoom_list_past_participants':
            if (!params.meetingId?.trim()) {
              throw new Error('Meeting ID is required.')
            }
            return {
              ...baseParams,
              meetingId: params.meetingId.trim(),
              pageSize: params.pageSize ? Number(params.pageSize) : undefined,
              nextPageToken: params.nextPageToken,
            }

          default:
            return baseParams
        }
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    credential: { type: 'string', description: 'Zoom access token' },
    userId: { type: 'string', description: 'User ID or email (use "me" for authenticated user)' },
    meetingId: { type: 'string', description: 'Meeting ID' },
    topic: { type: 'string', description: 'Meeting topic' },
    topicUpdate: { type: 'string', description: 'Meeting topic for update' },
    type: { type: 'string', description: 'Meeting type' },
    startTime: { type: 'string', description: 'Start time in ISO 8601 format' },
    duration: { type: 'string', description: 'Duration in minutes' },
    timezone: { type: 'string', description: 'Timezone' },
    password: { type: 'string', description: 'Meeting password' },
    agenda: { type: 'string', description: 'Meeting agenda' },
    hostVideo: { type: 'boolean', description: 'Host video on' },
    participantVideo: { type: 'boolean', description: 'Participant video on' },
    joinBeforeHost: { type: 'boolean', description: 'Allow join before host' },
    muteUponEntry: { type: 'boolean', description: 'Mute upon entry' },
    waitingRoom: { type: 'boolean', description: 'Enable waiting room' },
    autoRecording: { type: 'string', description: 'Auto recording setting' },
    listType: { type: 'string', description: 'Meeting type filter for list' },
    pageSize: { type: 'string', description: 'Page size for list' },
    nextPageToken: { type: 'string', description: 'Page token for pagination' },
    occurrenceId: { type: 'string', description: 'Occurrence ID for recurring meetings' },
    cancelMeetingReminder: { type: 'boolean', description: 'Send cancellation email' },
    fromDate: { type: 'string', description: 'Start date for recordings list (yyyy-mm-dd)' },
    toDate: { type: 'string', description: 'End date for recordings list (yyyy-mm-dd)' },
    recordingId: { type: 'string', description: 'Specific recording file ID' },
    deleteAction: { type: 'string', description: 'Delete action (trash or delete)' },
  },
  outputs: {
    // Success indicator
    success: { type: 'boolean', description: 'Operation success status' },
    // Meeting outputs
    meeting: { type: 'json', description: 'Meeting data (create_meeting, get_meeting)' },
    meetings: { type: 'json', description: 'List of meetings (list_meetings)' },
    // Invitation
    invitation: { type: 'string', description: 'Meeting invitation text (get_meeting_invitation)' },
    // Recording outputs
    recording: { type: 'json', description: 'Recording data (get_meeting_recordings)' },
    recordings: { type: 'json', description: 'List of recordings (list_recordings)' },
    // Participant outputs
    participants: { type: 'json', description: 'List of participants (list_past_participants)' },
    // Pagination
    pageInfo: { type: 'json', description: 'Pagination information' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: branded-layout.tsx]---
Location: sim-main/apps/sim/components/branded-layout.tsx
Signals: React

```typescript
'use client'

import { useEffect } from 'react'
import { getBrandConfig } from '@/lib/branding/branding'

interface BrandedLayoutProps {
  children: React.ReactNode
}

export function BrandedLayout({ children }: BrandedLayoutProps) {
  useEffect(() => {
    const config = getBrandConfig()

    // Update document title
    if (config.name !== 'Sim') {
      document.title = config.name
    }

    // Update favicon
    if (config.faviconUrl) {
      const faviconLink = document.querySelector("link[rel*='icon']") as HTMLLinkElement
      if (faviconLink) {
        faviconLink.href = config.faviconUrl
      }
    }

    // Load custom CSS if provided
    if (config.customCssUrl) {
      const customCssId = 'custom-brand-css'
      let customCssLink = document.getElementById(customCssId) as HTMLLinkElement

      if (!customCssLink) {
        customCssLink = document.createElement('link')
        customCssLink.id = customCssId
        customCssLink.rel = 'stylesheet'
        customCssLink.href = config.customCssUrl
        document.head.appendChild(customCssLink)
      }
    }
  }, [])

  return <>{children}</>
}
```

--------------------------------------------------------------------------------

````
