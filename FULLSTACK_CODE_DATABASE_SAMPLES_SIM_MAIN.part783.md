---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 783
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 783 of 933)

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

---[FILE: get_meeting.ts]---
Location: sim-main/apps/sim/tools/zoom/get_meeting.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { ZoomGetMeetingParams, ZoomGetMeetingResponse } from '@/tools/zoom/types'

export const zoomGetMeetingTool: ToolConfig<ZoomGetMeetingParams, ZoomGetMeetingResponse> = {
  id: 'zoom_get_meeting',
  name: 'Zoom Get Meeting',
  description: 'Get details of a specific Zoom meeting',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'zoom',
    requiredScopes: ['meeting:read:meeting'],
  },

  params: {
    meetingId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The meeting ID',
    },
    occurrenceId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Occurrence ID for recurring meetings',
    },
    showPreviousOccurrences: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Show previous occurrences for recurring meetings',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = `https://api.zoom.us/v2/meetings/${encodeURIComponent(params.meetingId)}`
      const queryParams = new URLSearchParams()

      if (params.occurrenceId) {
        queryParams.append('occurrence_id', params.occurrenceId)
      }
      if (params.showPreviousOccurrences != null) {
        queryParams.append('show_previous_occurrences', String(params.showPreviousOccurrences))
      }

      const queryString = queryParams.toString()
      return queryString ? `${baseUrl}?${queryString}` : baseUrl
    },
    method: 'GET',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Missing access token for Zoom API request')
      }
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
  },

  transformResponse: async (response) => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        error: errorData.message || `Zoom API error: ${response.status} ${response.statusText}`,
        output: { meeting: {} as any },
      }
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        meeting: {
          id: data.id,
          uuid: data.uuid,
          host_id: data.host_id,
          host_email: data.host_email,
          topic: data.topic,
          type: data.type,
          status: data.status,
          start_time: data.start_time,
          duration: data.duration,
          timezone: data.timezone,
          agenda: data.agenda,
          created_at: data.created_at,
          start_url: data.start_url,
          join_url: data.join_url,
          password: data.password,
          h323_password: data.h323_password,
          pstn_password: data.pstn_password,
          encrypted_password: data.encrypted_password,
          settings: data.settings,
          recurrence: data.recurrence,
          occurrences: data.occurrences,
        },
      },
    }
  },

  outputs: {
    meeting: {
      type: 'object',
      description: 'The meeting details',
      properties: {
        id: { type: 'number', description: 'Meeting ID' },
        uuid: { type: 'string', description: 'Meeting UUID' },
        host_id: { type: 'string', description: 'Host user ID' },
        host_email: { type: 'string', description: 'Host email' },
        topic: { type: 'string', description: 'Meeting topic' },
        type: { type: 'number', description: 'Meeting type' },
        status: { type: 'string', description: 'Meeting status' },
        start_time: { type: 'string', description: 'Start time' },
        duration: { type: 'number', description: 'Duration in minutes' },
        timezone: { type: 'string', description: 'Timezone' },
        agenda: { type: 'string', description: 'Meeting agenda' },
        created_at: { type: 'string', description: 'Creation timestamp' },
        start_url: { type: 'string', description: 'Host start URL' },
        join_url: { type: 'string', description: 'Participant join URL' },
        password: { type: 'string', description: 'Meeting password' },
        settings: { type: 'object', description: 'Meeting settings' },
        recurrence: { type: 'object', description: 'Recurrence settings' },
        occurrences: { type: 'array', description: 'Meeting occurrences' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_meeting_invitation.ts]---
Location: sim-main/apps/sim/tools/zoom/get_meeting_invitation.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type {
  ZoomGetMeetingInvitationParams,
  ZoomGetMeetingInvitationResponse,
} from '@/tools/zoom/types'

export const zoomGetMeetingInvitationTool: ToolConfig<
  ZoomGetMeetingInvitationParams,
  ZoomGetMeetingInvitationResponse
> = {
  id: 'zoom_get_meeting_invitation',
  name: 'Zoom Get Meeting Invitation',
  description: 'Get the meeting invitation text for a Zoom meeting',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'zoom',
    requiredScopes: ['meeting:read:invitation'],
  },

  params: {
    meetingId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The meeting ID',
    },
  },

  request: {
    url: (params) =>
      `https://api.zoom.us/v2/meetings/${encodeURIComponent(params.meetingId)}/invitation`,
    method: 'GET',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Missing access token for Zoom API request')
      }
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
  },

  transformResponse: async (response) => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        error: errorData.message || `Zoom API error: ${response.status} ${response.statusText}`,
        output: { invitation: '' },
      }
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        invitation: data.invitation || '',
      },
    }
  },

  outputs: {
    invitation: {
      type: 'string',
      description: 'The meeting invitation text',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_meeting_recordings.ts]---
Location: sim-main/apps/sim/tools/zoom/get_meeting_recordings.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type {
  ZoomGetMeetingRecordingsParams,
  ZoomGetMeetingRecordingsResponse,
} from '@/tools/zoom/types'

export const zoomGetMeetingRecordingsTool: ToolConfig<
  ZoomGetMeetingRecordingsParams,
  ZoomGetMeetingRecordingsResponse
> = {
  id: 'zoom_get_meeting_recordings',
  name: 'Zoom Get Meeting Recordings',
  description: 'Get all recordings for a specific Zoom meeting',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'zoom',
    requiredScopes: ['cloud_recording:read:list_recording_files'],
  },

  params: {
    meetingId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The meeting ID or meeting UUID',
    },
    includeFolderItems: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Include items within a folder',
    },
    ttl: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Time to live for download URLs in seconds (max 604800)',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = `https://api.zoom.us/v2/meetings/${encodeURIComponent(params.meetingId)}/recordings`
      const queryParams = new URLSearchParams()

      if (params.includeFolderItems != null) {
        queryParams.append('include_folder_items', String(params.includeFolderItems))
      }
      if (params.ttl) {
        queryParams.append('ttl', String(params.ttl))
      }

      const queryString = queryParams.toString()
      return queryString ? `${baseUrl}?${queryString}` : baseUrl
    },
    method: 'GET',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Missing access token for Zoom API request')
      }
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
  },

  transformResponse: async (response) => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        error: errorData.message || `Zoom API error: ${response.status} ${response.statusText}`,
        output: { recording: {} as any },
      }
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        recording: {
          uuid: data.uuid,
          id: data.id,
          account_id: data.account_id,
          host_id: data.host_id,
          topic: data.topic,
          type: data.type,
          start_time: data.start_time,
          duration: data.duration,
          total_size: data.total_size,
          recording_count: data.recording_count,
          share_url: data.share_url,
          recording_files: (data.recording_files || []).map((file: any) => ({
            id: file.id,
            meeting_id: file.meeting_id,
            recording_start: file.recording_start,
            recording_end: file.recording_end,
            file_type: file.file_type,
            file_extension: file.file_extension,
            file_size: file.file_size,
            play_url: file.play_url,
            download_url: file.download_url,
            status: file.status,
            recording_type: file.recording_type,
          })),
        },
      },
    }
  },

  outputs: {
    recording: {
      type: 'object',
      description: 'The meeting recording with all files',
      properties: {
        uuid: { type: 'string', description: 'Meeting UUID' },
        id: { type: 'number', description: 'Meeting ID' },
        topic: { type: 'string', description: 'Meeting topic' },
        start_time: { type: 'string', description: 'Meeting start time' },
        duration: { type: 'number', description: 'Meeting duration in minutes' },
        total_size: { type: 'number', description: 'Total size of recordings in bytes' },
        share_url: { type: 'string', description: 'URL to share recordings' },
        recording_files: { type: 'array', description: 'List of recording files' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/zoom/index.ts

```typescript
// Zoom tools exports
export { zoomCreateMeetingTool } from './create_meeting'
export { zoomDeleteMeetingTool } from './delete_meeting'
export { zoomDeleteRecordingTool } from './delete_recording'
export { zoomGetMeetingTool } from './get_meeting'
export { zoomGetMeetingInvitationTool } from './get_meeting_invitation'
export { zoomGetMeetingRecordingsTool } from './get_meeting_recordings'
export { zoomListMeetingsTool } from './list_meetings'
export { zoomListPastParticipantsTool } from './list_past_participants'
export { zoomListRecordingsTool } from './list_recordings'
// Type exports
export type {
  ZoomCreateMeetingParams,
  ZoomCreateMeetingResponse,
  ZoomDeleteMeetingParams,
  ZoomDeleteMeetingResponse,
  ZoomDeleteRecordingParams,
  ZoomDeleteRecordingResponse,
  ZoomGetMeetingInvitationParams,
  ZoomGetMeetingInvitationResponse,
  ZoomGetMeetingParams,
  ZoomGetMeetingRecordingsParams,
  ZoomGetMeetingRecordingsResponse,
  ZoomGetMeetingResponse,
  ZoomListMeetingsParams,
  ZoomListMeetingsResponse,
  ZoomListPastParticipantsParams,
  ZoomListPastParticipantsResponse,
  ZoomListRecordingsParams,
  ZoomListRecordingsResponse,
  ZoomMeeting,
  ZoomMeetingSettings,
  ZoomMeetingType,
  ZoomParticipant,
  ZoomRecording,
  ZoomRecordingFile,
  ZoomResponse,
  ZoomUpdateMeetingParams,
  ZoomUpdateMeetingResponse,
} from './types'
export { zoomUpdateMeetingTool } from './update_meeting'
```

--------------------------------------------------------------------------------

---[FILE: list_meetings.ts]---
Location: sim-main/apps/sim/tools/zoom/list_meetings.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { ZoomListMeetingsParams, ZoomListMeetingsResponse } from '@/tools/zoom/types'

export const zoomListMeetingsTool: ToolConfig<ZoomListMeetingsParams, ZoomListMeetingsResponse> = {
  id: 'zoom_list_meetings',
  name: 'Zoom List Meetings',
  description: 'List all meetings for a Zoom user',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'zoom',
    requiredScopes: ['meeting:read:list_meetings'],
  },

  params: {
    userId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The user ID or email address. Use "me" for the authenticated user.',
    },
    type: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Meeting type filter: scheduled, live, upcoming, upcoming_meetings, or previous_meetings',
    },
    pageSize: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Number of records per page (max 300)',
    },
    nextPageToken: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Token for pagination to get next page of results',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = `https://api.zoom.us/v2/users/${encodeURIComponent(params.userId)}/meetings`
      const queryParams = new URLSearchParams()

      if (params.type) {
        queryParams.append('type', params.type)
      }
      if (params.pageSize) {
        queryParams.append('page_size', String(params.pageSize))
      }
      if (params.nextPageToken) {
        queryParams.append('next_page_token', params.nextPageToken)
      }

      const queryString = queryParams.toString()
      return queryString ? `${baseUrl}?${queryString}` : baseUrl
    },
    method: 'GET',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Missing access token for Zoom API request')
      }
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
  },

  transformResponse: async (response) => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        error: errorData.message || `Zoom API error: ${response.status} ${response.statusText}`,
        output: {
          meetings: [],
          pageInfo: {
            pageCount: 0,
            pageNumber: 0,
            pageSize: 0,
            totalRecords: 0,
          },
        },
      }
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        meetings: (data.meetings || []).map((meeting: any) => ({
          id: meeting.id,
          uuid: meeting.uuid,
          host_id: meeting.host_id,
          topic: meeting.topic,
          type: meeting.type,
          start_time: meeting.start_time,
          duration: meeting.duration,
          timezone: meeting.timezone,
          agenda: meeting.agenda,
          created_at: meeting.created_at,
          join_url: meeting.join_url,
        })),
        pageInfo: {
          pageCount: data.page_count || 0,
          pageNumber: data.page_number || 0,
          pageSize: data.page_size || 0,
          totalRecords: data.total_records || 0,
          nextPageToken: data.next_page_token,
        },
      },
    }
  },

  outputs: {
    meetings: {
      type: 'array',
      description: 'List of meetings',
    },
    pageInfo: {
      type: 'object',
      description: 'Pagination information',
      properties: {
        pageCount: { type: 'number', description: 'Total number of pages' },
        pageNumber: { type: 'number', description: 'Current page number' },
        pageSize: { type: 'number', description: 'Number of records per page' },
        totalRecords: { type: 'number', description: 'Total number of records' },
        nextPageToken: { type: 'string', description: 'Token for next page' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_past_participants.ts]---
Location: sim-main/apps/sim/tools/zoom/list_past_participants.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type {
  ZoomListPastParticipantsParams,
  ZoomListPastParticipantsResponse,
} from '@/tools/zoom/types'

export const zoomListPastParticipantsTool: ToolConfig<
  ZoomListPastParticipantsParams,
  ZoomListPastParticipantsResponse
> = {
  id: 'zoom_list_past_participants',
  name: 'Zoom List Past Participants',
  description: 'List participants from a past Zoom meeting',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'zoom',
    requiredScopes: ['meeting:read:list_past_participants'],
  },

  params: {
    meetingId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The past meeting ID or UUID',
    },
    pageSize: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Number of records per page (max 300)',
    },
    nextPageToken: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Token for pagination to get next page of results',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = `https://api.zoom.us/v2/past_meetings/${encodeURIComponent(params.meetingId)}/participants`
      const queryParams = new URLSearchParams()

      if (params.pageSize) {
        queryParams.append('page_size', String(params.pageSize))
      }
      if (params.nextPageToken) {
        queryParams.append('next_page_token', params.nextPageToken)
      }

      const queryString = queryParams.toString()
      return queryString ? `${baseUrl}?${queryString}` : baseUrl
    },
    method: 'GET',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Missing access token for Zoom API request')
      }
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
  },

  transformResponse: async (response) => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        error: errorData.message || `Zoom API error: ${response.status} ${response.statusText}`,
        output: {
          participants: [],
          pageInfo: {
            pageSize: 0,
            totalRecords: 0,
          },
        },
      }
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        participants: (data.participants || []).map((participant: any) => ({
          id: participant.id,
          user_id: participant.user_id,
          name: participant.name,
          user_email: participant.user_email,
          join_time: participant.join_time,
          leave_time: participant.leave_time,
          duration: participant.duration,
          attentiveness_score: participant.attentiveness_score,
          failover: participant.failover,
          status: participant.status,
        })),
        pageInfo: {
          pageSize: data.page_size || 0,
          totalRecords: data.total_records || 0,
          nextPageToken: data.next_page_token,
        },
      },
    }
  },

  outputs: {
    participants: {
      type: 'array',
      description: 'List of meeting participants',
    },
    pageInfo: {
      type: 'object',
      description: 'Pagination information',
      properties: {
        pageSize: { type: 'number', description: 'Number of records per page' },
        totalRecords: { type: 'number', description: 'Total number of records' },
        nextPageToken: { type: 'string', description: 'Token for next page' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_recordings.ts]---
Location: sim-main/apps/sim/tools/zoom/list_recordings.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { ZoomListRecordingsParams, ZoomListRecordingsResponse } from '@/tools/zoom/types'

export const zoomListRecordingsTool: ToolConfig<
  ZoomListRecordingsParams,
  ZoomListRecordingsResponse
> = {
  id: 'zoom_list_recordings',
  name: 'Zoom List Recordings',
  description: 'List all cloud recordings for a Zoom user',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'zoom',
    requiredScopes: ['cloud_recording:read:list_user_recordings'],
  },

  params: {
    userId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The user ID or email address. Use "me" for the authenticated user.',
    },
    from: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Start date in yyyy-mm-dd format (within last 6 months)',
    },
    to: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'End date in yyyy-mm-dd format',
    },
    pageSize: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Number of records per page (max 300)',
    },
    nextPageToken: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Token for pagination to get next page of results',
    },
    trash: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Set to true to list recordings from trash',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = `https://api.zoom.us/v2/users/${encodeURIComponent(params.userId)}/recordings`
      const queryParams = new URLSearchParams()

      if (params.from) {
        queryParams.append('from', params.from)
      }
      if (params.to) {
        queryParams.append('to', params.to)
      }
      if (params.pageSize) {
        queryParams.append('page_size', String(params.pageSize))
      }
      if (params.nextPageToken) {
        queryParams.append('next_page_token', params.nextPageToken)
      }
      if (params.trash) {
        queryParams.append('trash', 'true')
      }

      const queryString = queryParams.toString()
      return queryString ? `${baseUrl}?${queryString}` : baseUrl
    },
    method: 'GET',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Missing access token for Zoom API request')
      }
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
  },

  transformResponse: async (response) => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        error: errorData.message || `Zoom API error: ${response.status} ${response.statusText}`,
        output: {
          recordings: [],
          pageInfo: {
            from: '',
            to: '',
            pageSize: 0,
            totalRecords: 0,
          },
        },
      }
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        recordings: (data.meetings || []).map((recording: any) => ({
          uuid: recording.uuid,
          id: recording.id,
          account_id: recording.account_id,
          host_id: recording.host_id,
          topic: recording.topic,
          type: recording.type,
          start_time: recording.start_time,
          duration: recording.duration,
          total_size: recording.total_size,
          recording_count: recording.recording_count,
          share_url: recording.share_url,
          recording_files: recording.recording_files || [],
        })),
        pageInfo: {
          from: data.from || '',
          to: data.to || '',
          pageSize: data.page_size || 0,
          totalRecords: data.total_records || 0,
          nextPageToken: data.next_page_token,
        },
      },
    }
  },

  outputs: {
    recordings: {
      type: 'array',
      description: 'List of recordings',
    },
    pageInfo: {
      type: 'object',
      description: 'Pagination information',
      properties: {
        from: { type: 'string', description: 'Start date of query range' },
        to: { type: 'string', description: 'End date of query range' },
        pageSize: { type: 'number', description: 'Number of records per page' },
        totalRecords: { type: 'number', description: 'Total number of records' },
        nextPageToken: { type: 'string', description: 'Token for next page' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/zoom/types.ts

```typescript
// Common types for Zoom tools
import type { ToolResponse } from '@/tools/types'

// Common parameters for all Zoom tools
export interface ZoomBaseParams {
  accessToken: string
}

// Meeting types
export type ZoomMeetingType = 1 | 2 | 3 | 8 // 1=instant, 2=scheduled, 3=recurring no fixed time, 8=recurring fixed time

export interface ZoomMeetingSettings {
  host_video?: boolean
  participant_video?: boolean
  join_before_host?: boolean
  mute_upon_entry?: boolean
  watermark?: boolean
  audio?: 'both' | 'telephony' | 'voip'
  auto_recording?: 'local' | 'cloud' | 'none'
  waiting_room?: boolean
  meeting_authentication?: boolean
  approval_type?: 0 | 1 | 2 // 0=auto, 1=manual, 2=none
}

export interface ZoomMeeting {
  id: number
  uuid: string
  host_id: string
  host_email?: string
  topic: string
  type: ZoomMeetingType
  status?: string
  start_time?: string
  duration?: number
  timezone?: string
  agenda?: string
  created_at?: string
  start_url?: string
  join_url: string
  password?: string
  h323_password?: string
  pstn_password?: string
  encrypted_password?: string
  settings?: ZoomMeetingSettings
  recurrence?: {
    type: number
    repeat_interval?: number
    weekly_days?: string
    monthly_day?: number
    monthly_week?: number
    monthly_week_day?: number
    end_times?: number
    end_date_time?: string
  }
  occurrences?: Array<{
    occurrence_id: string
    start_time: string
    duration: number
    status: string
  }>
}

export interface ZoomMeetingListResponse {
  page_count: number
  page_number: number
  page_size: number
  total_records: number
  next_page_token?: string
  meetings: ZoomMeeting[]
}

// Create Meeting tool types
export interface ZoomCreateMeetingParams extends ZoomBaseParams {
  userId: string
  topic: string
  type?: ZoomMeetingType
  startTime?: string
  duration?: number
  timezone?: string
  password?: string
  agenda?: string
  hostVideo?: boolean
  participantVideo?: boolean
  joinBeforeHost?: boolean
  muteUponEntry?: boolean
  waitingRoom?: boolean
  autoRecording?: 'local' | 'cloud' | 'none'
}

export interface ZoomCreateMeetingResponse extends ToolResponse {
  output: {
    meeting: ZoomMeeting
  }
}

// List Meetings tool types
export interface ZoomListMeetingsParams extends ZoomBaseParams {
  userId: string
  type?: 'scheduled' | 'live' | 'upcoming' | 'upcoming_meetings' | 'previous_meetings'
  pageSize?: number
  nextPageToken?: string
}

export interface ZoomListMeetingsResponse extends ToolResponse {
  output: {
    meetings: ZoomMeeting[]
    pageInfo: {
      pageCount: number
      pageNumber: number
      pageSize: number
      totalRecords: number
      nextPageToken?: string
    }
  }
}

// Get Meeting tool types
export interface ZoomGetMeetingParams extends ZoomBaseParams {
  meetingId: string
  occurrenceId?: string
  showPreviousOccurrences?: boolean
}

export interface ZoomGetMeetingResponse extends ToolResponse {
  output: {
    meeting: ZoomMeeting
  }
}

// Update Meeting tool types
export interface ZoomUpdateMeetingParams extends ZoomBaseParams {
  meetingId: string
  topic?: string
  type?: ZoomMeetingType
  startTime?: string
  duration?: number
  timezone?: string
  password?: string
  agenda?: string
  hostVideo?: boolean
  participantVideo?: boolean
  joinBeforeHost?: boolean
  muteUponEntry?: boolean
  waitingRoom?: boolean
  autoRecording?: 'local' | 'cloud' | 'none'
}

export interface ZoomUpdateMeetingResponse extends ToolResponse {
  output: {
    success: boolean
  }
}

// Delete Meeting tool types
export interface ZoomDeleteMeetingParams extends ZoomBaseParams {
  meetingId: string
  occurrenceId?: string
  scheduleForReminder?: boolean
  cancelMeetingReminder?: boolean
}

export interface ZoomDeleteMeetingResponse extends ToolResponse {
  output: {
    success: boolean
  }
}

// Get Meeting Invitation tool types
export interface ZoomGetMeetingInvitationParams extends ZoomBaseParams {
  meetingId: string
}

export interface ZoomGetMeetingInvitationResponse extends ToolResponse {
  output: {
    invitation: string
  }
}

// Recording types
export interface ZoomRecordingFile {
  id: string
  meeting_id: string
  recording_start: string
  recording_end: string
  file_type: string
  file_extension: string
  file_size: number
  play_url?: string
  download_url?: string
  status: string
  recording_type: string
}

export interface ZoomRecording {
  uuid: string
  id: number
  account_id: string
  host_id: string
  topic: string
  type: number
  start_time: string
  duration: number
  total_size: number
  recording_count: number
  share_url?: string
  recording_files: ZoomRecordingFile[]
}

// List Recordings tool types
export interface ZoomListRecordingsParams extends ZoomBaseParams {
  userId: string
  from?: string
  to?: string
  pageSize?: number
  nextPageToken?: string
  trash?: boolean
  trashType?: 'meeting_recordings' | 'recording_file'
}

export interface ZoomListRecordingsResponse extends ToolResponse {
  output: {
    recordings: ZoomRecording[]
    pageInfo: {
      from: string
      to: string
      pageSize: number
      totalRecords: number
      nextPageToken?: string
    }
  }
}

// Get Meeting Recordings tool types
export interface ZoomGetMeetingRecordingsParams extends ZoomBaseParams {
  meetingId: string
  includeFolderItems?: boolean
  ttl?: number
}

export interface ZoomGetMeetingRecordingsResponse extends ToolResponse {
  output: {
    recording: ZoomRecording
  }
}

// Delete Recording tool types
export interface ZoomDeleteRecordingParams extends ZoomBaseParams {
  meetingId: string
  recordingId?: string
  action?: 'trash' | 'delete'
}

export interface ZoomDeleteRecordingResponse extends ToolResponse {
  output: {
    success: boolean
  }
}

// Participant types
export interface ZoomParticipant {
  id: string
  user_id?: string
  name: string
  user_email?: string
  join_time: string
  leave_time?: string
  duration: number
  attentiveness_score?: string
  failover?: boolean
  status?: string
}

// List Past Participants tool types
export interface ZoomListPastParticipantsParams extends ZoomBaseParams {
  meetingId: string
  pageSize?: number
  nextPageToken?: string
}

export interface ZoomListPastParticipantsResponse extends ToolResponse {
  output: {
    participants: ZoomParticipant[]
    pageInfo: {
      pageSize: number
      totalRecords: number
      nextPageToken?: string
    }
  }
}

// Combined response type for block
export type ZoomResponse =
  | ZoomCreateMeetingResponse
  | ZoomListMeetingsResponse
  | ZoomGetMeetingResponse
  | ZoomUpdateMeetingResponse
  | ZoomDeleteMeetingResponse
  | ZoomGetMeetingInvitationResponse
  | ZoomListRecordingsResponse
  | ZoomGetMeetingRecordingsResponse
  | ZoomDeleteRecordingResponse
  | ZoomListPastParticipantsResponse
```

--------------------------------------------------------------------------------

---[FILE: update_meeting.ts]---
Location: sim-main/apps/sim/tools/zoom/update_meeting.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { ZoomUpdateMeetingParams, ZoomUpdateMeetingResponse } from '@/tools/zoom/types'

export const zoomUpdateMeetingTool: ToolConfig<ZoomUpdateMeetingParams, ZoomUpdateMeetingResponse> =
  {
    id: 'zoom_update_meeting',
    name: 'Zoom Update Meeting',
    description: 'Update an existing Zoom meeting',
    version: '1.0.0',

    oauth: {
      required: true,
      provider: 'zoom',
      requiredScopes: ['meeting:update:meeting'],
    },

    params: {
      meetingId: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description: 'The meeting ID to update',
      },
      topic: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Meeting topic',
      },
      type: {
        type: 'number',
        required: false,
        visibility: 'user-or-llm',
        description:
          'Meeting type: 1=instant, 2=scheduled, 3=recurring no fixed time, 8=recurring fixed time',
      },
      startTime: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Meeting start time in ISO 8601 format (e.g., 2025-06-03T10:00:00Z)',
      },
      duration: {
        type: 'number',
        required: false,
        visibility: 'user-or-llm',
        description: 'Meeting duration in minutes',
      },
      timezone: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Timezone for the meeting (e.g., America/Los_Angeles)',
      },
      password: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Meeting password',
      },
      agenda: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Meeting agenda',
      },
      hostVideo: {
        type: 'boolean',
        required: false,
        visibility: 'user-or-llm',
        description: 'Start with host video on',
      },
      participantVideo: {
        type: 'boolean',
        required: false,
        visibility: 'user-or-llm',
        description: 'Start with participant video on',
      },
      joinBeforeHost: {
        type: 'boolean',
        required: false,
        visibility: 'user-or-llm',
        description: 'Allow participants to join before host',
      },
      muteUponEntry: {
        type: 'boolean',
        required: false,
        visibility: 'user-or-llm',
        description: 'Mute participants upon entry',
      },
      waitingRoom: {
        type: 'boolean',
        required: false,
        visibility: 'user-or-llm',
        description: 'Enable waiting room',
      },
      autoRecording: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Auto recording setting: local, cloud, or none',
      },
    },

    request: {
      url: (params) => `https://api.zoom.us/v2/meetings/${encodeURIComponent(params.meetingId)}`,
      method: 'PATCH',
      headers: (params) => {
        if (!params.accessToken) {
          throw new Error('Missing access token for Zoom API request')
        }
        return {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${params.accessToken}`,
        }
      },
      body: (params) => {
        const body: Record<string, any> = {}

        if (params.topic) {
          body.topic = params.topic
        }
        if (params.type != null) {
          body.type = params.type
        }
        if (params.startTime) {
          body.start_time = params.startTime
        }
        if (params.duration != null) {
          body.duration = params.duration
        }
        if (params.timezone) {
          body.timezone = params.timezone
        }
        if (params.password) {
          body.password = params.password
        }
        if (params.agenda) {
          body.agenda = params.agenda
        }

        // Build settings object
        const settings: Record<string, any> = {}
        if (params.hostVideo != null) {
          settings.host_video = params.hostVideo
        }
        if (params.participantVideo != null) {
          settings.participant_video = params.participantVideo
        }
        if (params.joinBeforeHost != null) {
          settings.join_before_host = params.joinBeforeHost
        }
        if (params.muteUponEntry != null) {
          settings.mute_upon_entry = params.muteUponEntry
        }
        if (params.waitingRoom != null) {
          settings.waiting_room = params.waitingRoom
        }
        if (params.autoRecording) {
          settings.auto_recording = params.autoRecording
        }

        if (Object.keys(settings).length > 0) {
          body.settings = settings
        }

        return body
      },
    },

    transformResponse: async (response) => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          error: errorData.message || `Zoom API error: ${response.status} ${response.statusText}`,
          output: { success: false },
        }
      }

      // Zoom returns 204 No Content on successful update
      return {
        success: true,
        output: {
          success: true,
        },
      }
    },

    outputs: {
      success: {
        type: 'boolean',
        description: 'Whether the meeting was updated successfully',
      },
    },
  }
```

--------------------------------------------------------------------------------

````
