---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 680
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 680 of 933)

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

---[FILE: invite.ts]---
Location: sim-main/apps/sim/tools/google_calendar/invite.ts

```typescript
import {
  CALENDAR_API_BASE,
  type GoogleCalendarInviteParams,
  type GoogleCalendarInviteResponse,
} from '@/tools/google_calendar/types'
import type { ToolConfig } from '@/tools/types'

export const inviteTool: ToolConfig<GoogleCalendarInviteParams, GoogleCalendarInviteResponse> = {
  id: 'google_calendar_invite',
  name: 'Google Calendar Invite Attendees',
  description: 'Invite attendees to an existing Google Calendar event',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'google-calendar',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Access token for Google Calendar API',
    },
    calendarId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Calendar ID (defaults to primary)',
    },
    eventId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Event ID to invite attendees to',
    },
    attendees: {
      type: 'array',
      required: true,
      visibility: 'user-or-llm',
      description: 'Array of attendee email addresses to invite',
    },
    sendUpdates: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'How to send updates to attendees: all, externalOnly, or none',
    },
    replaceExisting: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Whether to replace existing attendees or add to them (defaults to false)',
    },
  },

  request: {
    url: (params: GoogleCalendarInviteParams) => {
      const calendarId = params.calendarId || 'primary'
      return `${CALENDAR_API_BASE}/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(params.eventId)}`
    },
    method: 'GET',
    headers: (params: GoogleCalendarInviteParams) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response, params) => {
    const existingEvent = await response.json()

    // Validate required fields exist
    if (!existingEvent.start || !existingEvent.end || !existingEvent.summary) {
      throw new Error('Existing event is missing required fields (start, end, or summary)')
    }

    // Process new attendees - handle both string and array formats
    let newAttendeeList: string[] = []

    if (params?.attendees) {
      if (Array.isArray(params.attendees)) {
        // Already an array from block processing
        newAttendeeList = params.attendees.filter(
          (email: string) => email && email.trim().length > 0
        )
      } else if (
        typeof (params.attendees as any) === 'string' &&
        (params.attendees as any).trim().length > 0
      ) {
        // Fallback: process comma-separated string if block didn't convert it
        newAttendeeList = (params.attendees as any)
          .split(',')
          .map((email: string) => email.trim())
          .filter((email: string) => email.length > 0)
      }
    }

    // Calculate final attendees list
    const existingAttendees = existingEvent.attendees || []
    let finalAttendees: Array<any> = []

    // Handle replaceExisting properly - check for both boolean true and string "true"
    const shouldReplace =
      params?.replaceExisting === true || (params?.replaceExisting as any) === 'true'

    if (shouldReplace) {
      // Replace all attendees with just the new ones
      finalAttendees = newAttendeeList.map((email: string) => ({
        email,
        responseStatus: 'needsAction',
      }))
    } else {
      // Add to existing attendees (preserve all existing ones)

      // Start with ALL existing attendees - preserve them completely
      finalAttendees = [...existingAttendees]

      // Get set of existing emails for duplicate checking (case-insensitive)
      const existingEmails = new Set(
        existingAttendees.map((attendee: any) => attendee.email?.toLowerCase() || '')
      )

      // Add only new attendees that don't already exist
      for (const newEmail of newAttendeeList) {
        const emailLower = newEmail.toLowerCase()
        if (!existingEmails.has(emailLower)) {
          finalAttendees.push({
            email: newEmail,
            responseStatus: 'needsAction',
          })
        }
      }
    }

    // Use the complete existing event object and only modify the attendees field
    // This is crucial because the Google Calendar API update method "does not support patch semantics
    // and always updates the entire event resource" according to the documentation
    const updatedEvent = {
      ...existingEvent, // Start with the complete existing event to preserve all fields
      attendees: finalAttendees, // Only modify the attendees field
    }

    // Remove read-only fields that shouldn't be included in updates
    const readOnlyFields = [
      'id',
      'etag',
      'kind',
      'created',
      'updated',
      'htmlLink',
      'iCalUID',
      'sequence',
      'creator',
      'organizer',
    ]
    readOnlyFields.forEach((field) => {
      delete updatedEvent[field]
    })

    // Construct PUT URL with query parameters
    const calendarId = params?.calendarId || 'primary'
    const queryParams = new URLSearchParams()
    if (params?.sendUpdates !== undefined) {
      queryParams.append('sendUpdates', params.sendUpdates)
    }

    const queryString = queryParams.toString()
    const putUrl = `${CALENDAR_API_BASE}/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(params?.eventId || '')}${queryString ? `?${queryString}` : ''}`

    // Send PUT request to update the event
    const putResponse = await fetch(putUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${params?.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedEvent),
    })

    // Handle the PUT response
    if (!putResponse.ok) {
      const errorData = await putResponse.json()
      throw new Error(errorData.error?.message || 'Failed to invite attendees to calendar event')
    }

    const data = await putResponse.json()
    const totalAttendees = data.attendees?.length || 0

    // Calculate how many new attendees were actually added
    let newAttendeesAdded = 0

    if (shouldReplace) {
      newAttendeesAdded = newAttendeeList.length
    } else {
      // Count how many of the new emails weren't already in the existing list
      const existingEmails = new Set(
        existingAttendees.map((attendee: any) => attendee.email?.toLowerCase() || '')
      )
      newAttendeesAdded = newAttendeeList.filter(
        (email) => !existingEmails.has(email.toLowerCase())
      ).length
    }

    // Improved messaging about email delivery
    let baseMessage: string
    if (shouldReplace) {
      baseMessage = `Successfully updated event "${data.summary}" with ${totalAttendees} attendee${totalAttendees !== 1 ? 's' : ''}`
    } else {
      if (newAttendeesAdded > 0) {
        baseMessage = `Successfully added ${newAttendeesAdded} new attendee${newAttendeesAdded !== 1 ? 's' : ''} to event "${data.summary}" (total: ${totalAttendees})`
      } else {
        baseMessage = `No new attendees added to event "${data.summary}" - all specified attendees were already invited (total: ${totalAttendees})`
      }
    }

    const emailNote =
      params?.sendUpdates !== 'none'
        ? ` Email invitations are being sent asynchronously - delivery may take a few minutes and depends on recipients' Google Calendar settings.`
        : ` No email notifications will be sent as requested.`

    const content = baseMessage + emailNote

    return {
      success: true,
      output: {
        content,
        metadata: {
          id: data.id,
          htmlLink: data.htmlLink,
          status: data.status,
          summary: data.summary,
          description: data.description,
          location: data.location,
          start: data.start,
          end: data.end,
          attendees: data.attendees,
          creator: data.creator,
          organizer: data.organizer,
        },
      },
    }
  },

  outputs: {
    content: {
      type: 'string',
      description: 'Attendee invitation confirmation message with email delivery status',
    },
    metadata: {
      type: 'json',
      description: 'Updated event metadata including attendee list and details',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list.ts]---
Location: sim-main/apps/sim/tools/google_calendar/list.ts

```typescript
import {
  CALENDAR_API_BASE,
  type GoogleCalendarApiEventResponse,
  type GoogleCalendarApiListResponse,
  type GoogleCalendarListParams,
  type GoogleCalendarListResponse,
} from '@/tools/google_calendar/types'
import type { ToolConfig } from '@/tools/types'

export const listTool: ToolConfig<GoogleCalendarListParams, GoogleCalendarListResponse> = {
  id: 'google_calendar_list',
  name: 'Google Calendar List Events',
  description: 'List events from Google Calendar',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'google-calendar',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Access token for Google Calendar API',
    },
    calendarId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Calendar ID (defaults to primary)',
    },
    timeMin: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Lower bound for events (RFC3339 timestamp, e.g., 2025-06-03T00:00:00Z)',
    },
    timeMax: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Upper bound for events (RFC3339 timestamp, e.g., 2025-06-04T00:00:00Z)',
    },
    orderBy: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description: 'Order of events returned (startTime or updated)',
    },
    showDeleted: {
      type: 'boolean',
      required: false,
      visibility: 'hidden',
      description: 'Include deleted events',
    },
  },

  request: {
    url: (params: GoogleCalendarListParams) => {
      const calendarId = params.calendarId || 'primary'
      const queryParams = new URLSearchParams()

      if (params.timeMin) queryParams.append('timeMin', params.timeMin)
      if (params.timeMax) queryParams.append('timeMax', params.timeMax)
      queryParams.append('singleEvents', 'true')
      if (params.orderBy) queryParams.append('orderBy', params.orderBy)
      if (params.showDeleted !== undefined)
        queryParams.append('showDeleted', params.showDeleted.toString())

      const queryString = queryParams.toString()
      return `${CALENDAR_API_BASE}/calendars/${encodeURIComponent(calendarId)}/events${queryString ? `?${queryString}` : ''}`
    },
    method: 'GET',
    headers: (params: GoogleCalendarListParams) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const data: GoogleCalendarApiListResponse = await response.json()
    const events = data.items || []
    const eventsCount = events.length

    return {
      success: true,
      output: {
        content: `Found ${eventsCount} event${eventsCount !== 1 ? 's' : ''}`,
        metadata: {
          nextPageToken: data.nextPageToken,
          nextSyncToken: data.nextSyncToken,
          timeZone: data.timeZone,
          events: events.map((event: GoogleCalendarApiEventResponse) => ({
            id: event.id,
            htmlLink: event.htmlLink,
            status: event.status,
            summary: event.summary || 'No title',
            description: event.description,
            location: event.location,
            start: event.start,
            end: event.end,
            attendees: event.attendees,
            creator: event.creator,
            organizer: event.organizer,
          })),
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Summary of found events count' },
    metadata: {
      type: 'json',
      description: 'List of events with pagination tokens and event details',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: quick_add.ts]---
Location: sim-main/apps/sim/tools/google_calendar/quick_add.ts

```typescript
import {
  CALENDAR_API_BASE,
  type GoogleCalendarQuickAddParams,
  type GoogleCalendarQuickAddResponse,
} from '@/tools/google_calendar/types'
import type { ToolConfig } from '@/tools/types'

export const quickAddTool: ToolConfig<
  GoogleCalendarQuickAddParams,
  GoogleCalendarQuickAddResponse
> = {
  id: 'google_calendar_quick_add',
  name: 'Google Calendar Quick Add',
  description: 'Create events from natural language text',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'google-calendar',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Access token for Google Calendar API',
    },
    calendarId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Calendar ID (defaults to primary)',
    },
    text: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description:
        'Natural language text describing the event (e.g., "Meeting with John tomorrow at 3pm")',
    },
    attendees: {
      type: 'array',
      required: false,
      visibility: 'user-or-llm',
      description: 'Array of attendee email addresses (comma-separated string also accepted)',
    },
    sendUpdates: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'How to send updates to attendees: all, externalOnly, or none',
    },
  },

  request: {
    url: (params: GoogleCalendarQuickAddParams) => {
      const calendarId = params.calendarId || 'primary'
      const queryParams = new URLSearchParams()

      queryParams.append('text', params.text)

      if (params.sendUpdates !== undefined) {
        queryParams.append('sendUpdates', params.sendUpdates)
      }

      return `${CALENDAR_API_BASE}/calendars/${encodeURIComponent(calendarId)}/events/quickAdd?${queryParams.toString()}`
    },
    method: 'POST',
    headers: (params: GoogleCalendarQuickAddParams) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response, params) => {
    const data = await response.json()

    // Handle attendees if provided
    let finalEventData = data
    if (params?.attendees) {
      let attendeeList: string[] = []
      const attendees = params.attendees as string | string[]

      if (Array.isArray(attendees)) {
        attendeeList = attendees.filter((email: string) => email && email.trim().length > 0)
      } else if (typeof attendees === 'string' && attendees.trim().length > 0) {
        // Convert comma-separated string to array
        attendeeList = attendees
          .split(',')
          .map((email: string) => email.trim())
          .filter((email: string) => email.length > 0)
      }

      if (attendeeList.length > 0) {
        try {
          // Update the event with attendees
          const calendarId = params.calendarId || 'primary'
          const eventId = data.id

          // Prepare update data
          const updateData = {
            attendees: attendeeList.map((email: string) => ({ email })),
          }

          // Build update URL with sendUpdates if specified
          const updateQueryParams = new URLSearchParams()
          if (params.sendUpdates !== undefined) {
            updateQueryParams.append('sendUpdates', params.sendUpdates)
          }

          const updateUrl = `${CALENDAR_API_BASE}/calendars/${encodeURIComponent(calendarId)}/events/${eventId}${updateQueryParams.toString() ? `?${updateQueryParams.toString()}` : ''}`

          // Make the update request
          const updateResponse = await fetch(updateUrl, {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${params.accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
          })

          if (updateResponse.ok) {
            finalEventData = await updateResponse.json()
          } else {
            // If update fails, we still return the original event but log the error
            console.warn(
              'Failed to add attendees to quick-added event:',
              await updateResponse.text()
            )
          }
        } catch (error) {
          // If attendee update fails, we still return the original event
          console.warn('Error adding attendees to quick-added event:', error)
        }
      }
    }

    return {
      success: true,
      output: {
        content: `Event "${finalEventData?.summary || 'Untitled'}" created successfully ${finalEventData?.attendees?.length ? ` with ${finalEventData.attendees.length} attendee(s)` : ''}`,
        metadata: {
          id: finalEventData.id,
          htmlLink: finalEventData.htmlLink,
          status: finalEventData.status,
          summary: finalEventData.summary,
          description: finalEventData.description,
          location: finalEventData.location,
          start: finalEventData.start,
          end: finalEventData.end,
          attendees: finalEventData.attendees,
          creator: finalEventData.creator,
          organizer: finalEventData.organizer,
        },
      },
    }
  },

  outputs: {
    content: {
      type: 'string',
      description: 'Event creation confirmation message from natural language',
    },
    metadata: { type: 'json', description: 'Created event metadata including parsed details' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/google_calendar/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export const CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3'

// Shared attendee interface that matches Google Calendar API specification
export interface CalendarAttendee {
  id?: string
  email: string
  displayName?: string
  organizer?: boolean
  self?: boolean
  resource?: boolean
  optional?: boolean
  responseStatus: string
  comment?: string
  additionalGuests?: number
}

interface BaseGoogleCalendarParams {
  accessToken: string
  calendarId?: string // defaults to 'primary' if not provided
}

export interface GoogleCalendarCreateParams extends BaseGoogleCalendarParams {
  summary: string
  description?: string
  location?: string
  startDateTime: string
  endDateTime: string
  timeZone?: string
  attendees?: string[] // Array of email addresses
  sendUpdates?: 'all' | 'externalOnly' | 'none'
}

export interface GoogleCalendarListParams extends BaseGoogleCalendarParams {
  timeMin?: string // RFC3339 timestamp
  timeMax?: string // RFC3339 timestamp
  maxResults?: number
  singleEvents?: boolean
  orderBy?: 'startTime' | 'updated'
  showDeleted?: boolean
}

export interface GoogleCalendarGetParams extends BaseGoogleCalendarParams {
  eventId: string
}

export interface GoogleCalendarUpdateParams extends BaseGoogleCalendarParams {
  eventId: string
  summary?: string
  description?: string
  location?: string
  startDateTime?: string
  endDateTime?: string
  timeZone?: string
  attendees?: string[]
  sendUpdates?: 'all' | 'externalOnly' | 'none'
}

export interface GoogleCalendarDeleteParams extends BaseGoogleCalendarParams {
  eventId: string
  sendUpdates?: 'all' | 'externalOnly' | 'none'
}

export interface GoogleCalendarQuickAddParams extends BaseGoogleCalendarParams {
  text: string // Natural language text like "Meeting with John tomorrow at 3pm"
  attendees?: string[] // Array of email addresses (comma-separated string also accepted)
  sendUpdates?: 'all' | 'externalOnly' | 'none'
}

export interface GoogleCalendarInviteParams extends BaseGoogleCalendarParams {
  eventId: string
  attendees: string[] // Array of email addresses to invite
  sendUpdates?: 'all' | 'externalOnly' | 'none'
  replaceExisting?: boolean // Whether to replace existing attendees or add to them
}

export type GoogleCalendarToolParams =
  | GoogleCalendarCreateParams
  | GoogleCalendarListParams
  | GoogleCalendarGetParams
  | GoogleCalendarUpdateParams
  | GoogleCalendarDeleteParams
  | GoogleCalendarQuickAddParams
  | GoogleCalendarInviteParams

interface EventMetadata {
  id: string
  htmlLink: string
  status: string
  summary: string
  description?: string
  location?: string
  start: {
    dateTime?: string
    date?: string
    timeZone?: string
  }
  end: {
    dateTime?: string
    date?: string
    timeZone?: string
  }
  attendees?: CalendarAttendee[]
  creator?: {
    email: string
    displayName?: string
  }
  organizer?: {
    email: string
    displayName?: string
  }
}

interface ListMetadata {
  nextPageToken?: string
  nextSyncToken?: string
  events: EventMetadata[]
  timeZone: string
}

export interface GoogleCalendarToolResponse extends ToolResponse {
  output: {
    content: string
    metadata: EventMetadata | ListMetadata
  }
}

// Specific response types for each operation
export interface GoogleCalendarCreateResponse extends ToolResponse {
  output: {
    content: string
    metadata: EventMetadata
  }
}

export interface GoogleCalendarListResponse extends ToolResponse {
  output: {
    content: string
    metadata: ListMetadata
  }
}

export interface GoogleCalendarGetResponse extends ToolResponse {
  output: {
    content: string
    metadata: EventMetadata
  }
}

export interface GoogleCalendarQuickAddResponse extends ToolResponse {
  output: {
    content: string
    metadata: EventMetadata
  }
}

export interface GoogleCalendarUpdateResponse extends ToolResponse {
  output: {
    content: string
    metadata: EventMetadata
  }
}

export interface GoogleCalendarInviteResponse extends ToolResponse {
  output: {
    content: string
    metadata: EventMetadata
  }
}

export interface GoogleCalendarEvent {
  id: string
  status: string
  htmlLink: string
  created: string
  updated: string
  summary: string
  description?: string
  location?: string
  start: {
    dateTime?: string
    date?: string
    timeZone?: string
  }
  end: {
    dateTime?: string
    date?: string
    timeZone?: string
  }
  attendees?: CalendarAttendee[]
  creator?: {
    email: string
    displayName?: string
  }
  organizer?: {
    email: string
    displayName?: string
  }
  reminders?: {
    useDefault: boolean
    overrides?: Array<{
      method: string
      minutes: number
    }>
  }
}

export interface GoogleCalendarEventRequestBody {
  summary: string
  description?: string
  location?: string
  start: {
    dateTime: string
    timeZone?: string
  }
  end: {
    dateTime: string
    timeZone?: string
  }
  attendees?: Array<{
    email: string
  }>
}

export interface GoogleCalendarApiEventResponse {
  id: string
  status: string
  htmlLink: string
  created?: string
  updated?: string
  summary: string
  description?: string
  location?: string
  start: {
    dateTime?: string
    date?: string
    timeZone?: string
  }
  end: {
    dateTime?: string
    date?: string
    timeZone?: string
  }
  attendees?: CalendarAttendee[]
  creator?: {
    email: string
    displayName?: string
  }
  organizer?: {
    email: string
    displayName?: string
  }
  reminders?: {
    useDefault: boolean
    overrides?: Array<{
      method: string
      minutes: number
    }>
  }
}

export interface GoogleCalendarApiListResponse {
  kind: string
  etag: string
  summary: string
  description?: string
  updated: string
  timeZone: string
  accessRole: string
  defaultReminders: Array<{
    method: string
    minutes: number
  }>
  nextPageToken?: string
  nextSyncToken?: string
  items: GoogleCalendarApiEventResponse[]
}

export type GoogleCalendarResponse =
  | GoogleCalendarCreateResponse
  | GoogleCalendarListResponse
  | GoogleCalendarGetResponse
  | GoogleCalendarQuickAddResponse
  | GoogleCalendarInviteResponse
  | GoogleCalendarUpdateResponse
```

--------------------------------------------------------------------------------

---[FILE: update.ts]---
Location: sim-main/apps/sim/tools/google_calendar/update.ts

```typescript
import {
  CALENDAR_API_BASE,
  type GoogleCalendarToolResponse,
  type GoogleCalendarUpdateParams,
} from '@/tools/google_calendar/types'
import type { ToolConfig } from '@/tools/types'

export const updateTool: ToolConfig<GoogleCalendarUpdateParams, GoogleCalendarToolResponse> = {
  id: 'google_calendar_update',
  name: 'Google Calendar Update Event',
  description: 'Update an existing event in Google Calendar',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'google-calendar',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Access token for Google Calendar API',
    },
    calendarId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Calendar ID (defaults to primary)',
    },
    eventId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Event ID to update',
    },
    summary: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Event title/summary',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Event description',
    },
    location: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Event location',
    },
    startDateTime: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Start date and time (RFC3339 format, e.g., 2025-06-03T10:00:00-08:00)',
    },
    endDateTime: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'End date and time (RFC3339 format, e.g., 2025-06-03T11:00:00-08:00)',
    },
    timeZone: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Time zone (e.g., America/Los_Angeles)',
    },
    attendees: {
      type: 'array',
      required: false,
      visibility: 'user-or-llm',
      description: 'Array of attendee email addresses (replaces all existing attendees)',
    },
    sendUpdates: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'How to send updates to attendees: all, externalOnly, or none',
    },
  },

  request: {
    url: (params: GoogleCalendarUpdateParams) => {
      const calendarId = params.calendarId || 'primary'
      return `${CALENDAR_API_BASE}/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(params.eventId)}`
    },
    method: 'GET',
    headers: (params: GoogleCalendarUpdateParams) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response, params) => {
    const existingEvent = await response.json()

    // Start with the complete existing event to preserve all fields
    const updatedEvent = { ...existingEvent }

    // Apply updates only for fields that are provided and not empty
    if (
      params?.summary !== undefined &&
      params?.summary !== null &&
      params?.summary.trim() !== ''
    ) {
      updatedEvent.summary = params.summary
    }

    if (
      params?.description !== undefined &&
      params?.description !== null &&
      params?.description.trim() !== ''
    ) {
      updatedEvent.description = params.description
    }

    if (
      params?.location !== undefined &&
      params?.location !== null &&
      params?.location.trim() !== ''
    ) {
      updatedEvent.location = params.location
    }

    // Only update times if both start and end are provided (Google Calendar requires both)
    const hasStartTime =
      params?.startDateTime !== undefined &&
      params?.startDateTime !== null &&
      params?.startDateTime.trim() !== ''
    const hasEndTime =
      params?.endDateTime !== undefined &&
      params?.endDateTime !== null &&
      params?.endDateTime.trim() !== ''

    if (hasStartTime && hasEndTime) {
      updatedEvent.start = {
        dateTime: params.startDateTime,
      }
      updatedEvent.end = {
        dateTime: params.endDateTime,
      }
      if (params?.timeZone) {
        updatedEvent.start.timeZone = params.timeZone
        updatedEvent.end.timeZone = params.timeZone
      }
    }

    // Handle attendees update - this replaces all existing attendees
    if (params?.attendees !== undefined && params?.attendees !== null) {
      let attendeeList: string[] = []
      if (params.attendees) {
        const attendees = params.attendees as string | string[]
        if (Array.isArray(attendees)) {
          attendeeList = attendees.filter((email: string) => email && email.trim().length > 0)
        } else if (typeof attendees === 'string' && attendees.trim().length > 0) {
          // Convert comma-separated string to array
          attendeeList = attendees
            .split(',')
            .map((email: string) => email.trim())
            .filter((email: string) => email.length > 0)
        }
      }

      // Replace all attendees with the new list
      if (attendeeList.length > 0) {
        updatedEvent.attendees = attendeeList.map((email: string) => ({
          email,
          responseStatus: 'needsAction',
        }))
      } else {
        // If empty attendee list is provided, remove all attendees
        updatedEvent.attendees = []
      }
    }

    // Remove read-only fields that shouldn't be included in updates
    const readOnlyFields = [
      'id',
      'etag',
      'kind',
      'created',
      'updated',
      'htmlLink',
      'iCalUID',
      'sequence',
      'creator',
      'organizer',
    ]
    readOnlyFields.forEach((field) => {
      delete updatedEvent[field]
    })

    // Construct PUT URL with query parameters
    const calendarId = params?.calendarId || 'primary'
    const queryParams = new URLSearchParams()
    if (params?.sendUpdates !== undefined) {
      queryParams.append('sendUpdates', params.sendUpdates)
    }

    const queryString = queryParams.toString()
    const putUrl = `${CALENDAR_API_BASE}/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(params?.eventId || '')}${queryString ? `?${queryString}` : ''}`

    // Send PUT request to update the event
    const putResponse = await fetch(putUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${params?.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedEvent),
    })

    if (!putResponse.ok) {
      const errorData = await putResponse.json()
      throw new Error(errorData.error?.message || 'Failed to update calendar event')
    }

    const data = await putResponse.json()

    return {
      success: true,
      output: {
        content: `Event "${data.summary}" updated successfully`,
        metadata: {
          id: data.id,
          htmlLink: data.htmlLink,
          status: data.status,
          summary: data.summary,
          description: data.description,
          location: data.location,
          start: data.start,
          end: data.end,
          attendees: data.attendees,
          creator: data.creator,
          organizer: data.organizer,
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Event update confirmation message' },
    metadata: {
      type: 'json',
      description: 'Updated event metadata including ID, status, and details',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create.ts]---
Location: sim-main/apps/sim/tools/google_docs/create.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { GoogleDocsCreateResponse, GoogleDocsToolParams } from '@/tools/google_docs/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('GoogleDocsCreateTool')

export const createTool: ToolConfig<GoogleDocsToolParams, GoogleDocsCreateResponse> = {
  id: 'google_docs_create',
  name: 'Create Google Docs Document',
  description: 'Create a new Google Docs document',
  version: '1.0',

  oauth: {
    required: true,
    provider: 'google-docs',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Google Docs API',
    },
    title: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The title of the document to create',
    },
    content: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'The content of the document to create',
    },
    folderSelector: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Select the folder to create the document in',
    },
    folderId: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description: 'The ID of the folder to create the document in (internal use)',
    },
  },

  request: {
    url: () => {
      return 'https://www.googleapis.com/drive/v3/files?supportsAllDrives=true'
    },
    method: 'POST',
    headers: (params) => {
      // Validate access token
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
      }
    },
    body: (params) => {
      if (!params.title) {
        throw new Error('Title is required')
      }

      const requestBody: any = {
        name: params.title,
        mimeType: 'application/vnd.google-apps.document',
      }

      // Add parent folder if specified (prefer folderSelector over folderId)
      const folderId = params.folderSelector || params.folderId
      if (folderId) {
        requestBody.parents = [folderId]
      }

      return requestBody
    },
  },

  postProcess: async (result, params, executeTool) => {
    if (!result.success) {
      return result
    }

    const documentId = result.output.metadata.documentId

    if (params.content && documentId) {
      try {
        const writeParams = {
          accessToken: params.accessToken,
          documentId: documentId,
          content: params.content,
        }

        const writeResult = await executeTool('google_docs_write', writeParams)

        if (!writeResult.success) {
          logger.warn(
            'Failed to add content to document, but document was created:',
            writeResult.error
          )
        }
      } catch (error) {
        logger.warn('Error adding content to document:', { error })
        // Don't fail the overall operation if adding content fails
      }
    }

    return result
  },

  transformResponse: async (response: Response) => {
    try {
      // Get the response data
      const responseText = await response.text()
      const data = JSON.parse(responseText)

      const documentId = data.id
      const title = data.name

      const metadata = {
        documentId,
        title: title || 'Untitled Document',
        mimeType: 'application/vnd.google-apps.document',
        url: `https://docs.google.com/document/d/${documentId}/edit`,
      }

      return {
        success: true,
        output: {
          metadata,
        },
      }
    } catch (error) {
      logger.error('Google Docs create - Error processing response:', {
        error,
      })
      throw error
    }
  },

  outputs: {
    metadata: {
      type: 'json',
      description: 'Created document metadata including ID, title, and URL',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/google_docs/index.ts

```typescript
import { createTool } from '@/tools/google_docs/create'
import { readTool } from '@/tools/google_docs/read'
import { writeTool } from '@/tools/google_docs/write'

export const googleDocsReadTool = readTool
export const googleDocsWriteTool = writeTool
export const googleDocsCreateTool = createTool
```

--------------------------------------------------------------------------------

---[FILE: read.ts]---
Location: sim-main/apps/sim/tools/google_docs/read.ts

```typescript
import type { GoogleDocsReadResponse, GoogleDocsToolParams } from '@/tools/google_docs/types'
import { extractTextFromDocument } from '@/tools/google_docs/utils'
import type { ToolConfig } from '@/tools/types'

export const readTool: ToolConfig<GoogleDocsToolParams, GoogleDocsReadResponse> = {
  id: 'google_docs_read',
  name: 'Read Google Docs Document',
  description: 'Read content from a Google Docs document',
  version: '1.0',

  oauth: {
    required: true,
    provider: 'google-docs',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Google Docs API',
    },
    documentId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the document to read',
    },
  },

  request: {
    url: (params) => {
      // Ensure documentId is valid
      const documentId = params.documentId?.trim() || params.manualDocumentId?.trim()
      if (!documentId) {
        throw new Error('Document ID is required')
      }

      return `https://docs.googleapis.com/v1/documents/${documentId}`
    },
    method: 'GET',
    headers: (params) => {
      // Validate access token
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    // Extract document content from the response
    let content = ''
    if (data.body?.content) {
      content = extractTextFromDocument(data)
    }

    // Create document metadata
    const metadata = {
      documentId: data.documentId,
      title: data.title || 'Untitled Document',
      mimeType: 'application/vnd.google-apps.document',
      url: `https://docs.google.com/document/d/${data.documentId}/edit`,
    }

    return {
      success: true,
      output: {
        content,
        metadata,
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Extracted document text content' },
    metadata: { type: 'json', description: 'Document metadata including ID, title, and URL' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/google_docs/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface GoogleDocsMetadata {
  documentId: string
  title: string
  mimeType?: string
  createdTime?: string
  modifiedTime?: string
  url?: string
}

export interface GoogleDocsReadResponse extends ToolResponse {
  output: {
    content: string
    metadata: GoogleDocsMetadata
  }
}

export interface GoogleDocsWriteResponse extends ToolResponse {
  output: {
    updatedContent: boolean
    metadata: GoogleDocsMetadata
  }
}

export interface GoogleDocsCreateResponse extends ToolResponse {
  output: {
    metadata: GoogleDocsMetadata
  }
}

export interface GoogleDocsToolParams {
  accessToken: string
  documentId?: string
  manualDocumentId?: string
  title?: string
  content?: string
  folderId?: string
  folderSelector?: string
}

export type GoogleDocsResponse =
  | GoogleDocsReadResponse
  | GoogleDocsWriteResponse
  | GoogleDocsCreateResponse
```

--------------------------------------------------------------------------------

````
