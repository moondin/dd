---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 773
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 773 of 933)

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

---[FILE: read_note.ts]---
Location: sim-main/apps/sim/tools/wealthbox/read_note.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import type { WealthboxReadParams, WealthboxReadResponse } from '@/tools/wealthbox/types'

const logger = createLogger('WealthboxReadNote')

export const wealthboxReadNoteTool: ToolConfig<WealthboxReadParams, WealthboxReadResponse> = {
  id: 'wealthbox_read_note',
  name: 'Read Wealthbox Note',
  description: 'Read content from a Wealthbox note',
  version: '1.0.0',

  params: {
    accessToken: {
      type: 'string',
      required: true,
      description: 'The access token for the Wealthbox API',
      visibility: 'hidden',
    },
    noteId: {
      type: 'string',
      required: false,
      description: 'The ID of the note to read',
      visibility: 'user-only',
    },
  },

  request: {
    url: (params) => {
      const noteId = params.noteId?.trim()
      let url = 'https://api.crmworkspace.com/v1/notes'
      if (noteId) {
        url = `https://api.crmworkspace.com/v1/notes/${noteId}`
      }
      return url
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

  transformResponse: async (response: Response, params?: WealthboxReadParams) => {
    const data = await response.json()

    // Format note information into readable content
    const note = data
    let content = `Note Content: ${note.content || 'No content available'}`

    if (note.created_at) {
      content += `\nCreated: ${new Date(note.created_at).toLocaleString()}`
    }

    if (note.updated_at) {
      content += `\nUpdated: ${new Date(note.updated_at).toLocaleString()}`
    }

    if (note.visible_to) {
      content += `\nVisible to: ${note.visible_to}`
    }

    if (note.linked_to && note.linked_to.length > 0) {
      content += '\nLinked to:'
      note.linked_to.forEach((link: any) => {
        content += `\n  - ${link.name} (${link.type})`
      })
    }

    if (note.tags && note.tags.length > 0) {
      content += '\nTags:'
      note.tags.forEach((tag: any) => {
        content += `\n  - ${tag.name}`
      })
    }

    return {
      success: true,
      output: {
        content,
        note,
        metadata: {
          operation: 'read_note' as const,
          noteId: params?.noteId || note.id?.toString() || '',
          itemType: 'note' as const,
        },
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Note data and metadata',
      properties: {
        content: { type: 'string', description: 'Formatted note information' },
        note: { type: 'object', description: 'Raw note data from Wealthbox' },
        metadata: {
          type: 'object',
          description: 'Operation metadata',
          properties: {
            operation: { type: 'string', description: 'The operation performed' },
            noteId: { type: 'string', description: 'ID of the note' },
            itemType: { type: 'string', description: 'Type of item (note)' },
          },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: read_task.ts]---
Location: sim-main/apps/sim/tools/wealthbox/read_task.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { WealthboxReadParams, WealthboxReadResponse } from '@/tools/wealthbox/types'

export const wealthboxReadTaskTool: ToolConfig<WealthboxReadParams, WealthboxReadResponse> = {
  id: 'wealthbox_read_task',
  name: 'Read Wealthbox Task',
  description: 'Read content from a Wealthbox task',
  version: '1.0.0',

  params: {
    accessToken: {
      type: 'string',
      required: true,
      description: 'The access token for the Wealthbox API',
      visibility: 'hidden',
    },
    taskId: {
      type: 'string',
      required: false,
      description: 'The ID of the task to read',
      visibility: 'user-only',
    },
  },

  request: {
    url: (params) => {
      const taskId = params.taskId?.trim()
      let url = 'https://api.crmworkspace.com/v1/tasks'
      if (taskId) {
        url = `https://api.crmworkspace.com/v1/tasks/${taskId}`
      }
      return url
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

  transformResponse: async (response: Response, params?: WealthboxReadParams) => {
    const data = await response.json()

    // Format task information into readable content
    const task = data
    let content = `Task: ${task.name || 'Unnamed task'}`

    if (task.due_date) {
      content += `\nDue Date: ${new Date(task.due_date).toLocaleDateString()}`
    }

    if (task.complete !== undefined) {
      content += `\nStatus: ${task.complete ? 'Complete' : 'Incomplete'}`
    }

    if (task.priority) {
      content += `\nPriority: ${task.priority}`
    }

    if (task.category) {
      content += `\nCategory: ${task.category}`
    }

    if (task.visible_to) {
      content += `\nVisible to: ${task.visible_to}`
    }

    if (task.linked_to && task.linked_to.length > 0) {
      content += '\nLinked to:'
      task.linked_to.forEach((link: any) => {
        content += `\n  - ${link.name} (${link.type})`
      })
    }

    return {
      success: true,
      output: {
        content,
        task,
        metadata: {
          operation: 'read_task' as const,
          taskId: params?.taskId || task.id?.toString() || '',
          itemType: 'task' as const,
        },
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Task data and metadata',
      properties: {
        content: { type: 'string', description: 'Formatted task information' },
        task: { type: 'object', description: 'Raw task data from Wealthbox' },
        metadata: {
          type: 'object',
          description: 'Operation metadata',
          properties: {
            operation: { type: 'string', description: 'The operation performed' },
            taskId: { type: 'string', description: 'ID of the task' },
            itemType: { type: 'string', description: 'Type of item (task)' },
          },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/wealthbox/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface WealthboxNote {
  id: number
  creator: number
  created_at: string
  updated_at: string
  content: string
  linked_to: Array<{
    id: number
    type: string
    name: string
  }>
  visible_to: string
  tags: Array<{
    id: number
    name: string
  }>
}

export interface WealthboxContact {
  id: number
  first_name: string
  last_name: string
  company_name?: string
  background_information?: string
  email_addresses?: Array<{
    address: string
    principal: boolean
    kind: string
  }>
  phone_numbers?: Array<{
    address: string
    principal: boolean
    extension?: string
    kind: string
  }>
}

export interface WealthboxTask {
  id: number
  name: string
  due_date: string
  description?: string
  complete?: boolean
  category?: number
  priority?: 'Low' | 'Medium' | 'High'
  linked_to?: Array<{
    id: number
    type: string
    name: string
  }>
  visible_to?: string
}

// Unified metadata structure
export interface WealthboxMetadata {
  operation:
    | 'read_note'
    | 'write_note'
    | 'read_contact'
    | 'write_contact'
    | 'read_task'
    | 'write_task'
  itemId?: string
  contactId?: string
  itemType: 'note' | 'contact' | 'task'
  totalItems?: number
}

// Unified output structure for all operations
interface WealthboxUniformOutput {
  // Single items (for write operations and single reads)
  note?: WealthboxNote
  contact?: WealthboxContact
  task?: WealthboxTask

  // Arrays (for bulk read operations)
  notes?: WealthboxNote[]
  contacts?: WealthboxContact[]
  tasks?: WealthboxTask[]

  // Operation result indicators
  success?: boolean
  metadata: WealthboxMetadata
}

// Both response types use identical structure
export interface WealthboxReadResponse extends ToolResponse {
  output: WealthboxUniformOutput
}

export interface WealthboxWriteResponse extends ToolResponse {
  output: WealthboxUniformOutput
}

// Unified parameter types
export interface WealthboxReadParams {
  accessToken: string
  operation: 'read_note' | 'read_contact' | 'read_task'
  noteId?: string
  contactId?: string
  taskId?: string
}

export interface WealthboxWriteParams {
  accessToken: string
  operation: 'write_note' | 'write_contact' | 'write_task'

  // IDs (optional for creating new items)
  noteId?: string
  contactId?: string
  taskId?: string

  // Note fields
  content?: string
  linkedTo?: Array<{
    id: number
    type: string
    name: string
  }>
  visibleTo?: string
  tags?: Array<{
    id: number
    name: string
  }>

  // Contact fields
  firstName?: string
  lastName?: string
  backgroundInformation?: string
  emailAddress?: string

  // Task fields
  title?: string
  description?: string
  dueDate?: string
  complete?: boolean
  category?: number
  priority?: 'Low' | 'Medium' | 'High'
}

export interface WealthboxTaskRequestBody {
  name: string
  due_date: string
  description?: string // Add this field
  complete?: boolean
  category?: number
  linked_to?: Array<{
    id: number
    type: string
  }>
}

export type WealthboxResponse = WealthboxReadResponse | WealthboxWriteResponse
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/tools/wealthbox/utils.ts

```typescript
import type {
  WealthboxTaskRequestBody,
  WealthboxWriteParams,
  WealthboxWriteResponse,
} from '@/tools/wealthbox/types'

// Utility function to safely convert to string and trim
const safeStringify = (value: any): string => {
  if (value === null || value === undefined) {
    return ''
  }

  if (typeof value === 'string') {
    return value
  }

  return JSON.stringify(value)
}

// Utility function to validate parameters and build contact body
export const validateAndBuildContactBody = (params: WealthboxWriteParams): Record<string, any> => {
  // Validate required fields with safe stringification
  const firstName = safeStringify(params.firstName).trim()
  const lastName = safeStringify(params.lastName).trim()

  if (!firstName) {
    throw new Error('First name is required')
  }
  if (!lastName) {
    throw new Error('Last name is required')
  }

  const body: Record<string, any> = {
    first_name: firstName,
    last_name: lastName,
  }

  // Add optional fields with safe stringification
  const emailAddress = safeStringify(params.emailAddress).trim()
  if (emailAddress) {
    body.email_addresses = [
      {
        address: emailAddress,
        kind: 'email',
        principal: true,
      },
    ]
  }

  const backgroundInformation = safeStringify(params.backgroundInformation).trim()
  if (backgroundInformation) {
    body.background_information = backgroundInformation
  }

  return body
}

export // Utility function to validate parameters and build note body
const validateAndBuildNoteBody = (params: WealthboxWriteParams): Record<string, any> => {
  // Handle content conversion - stringify if not already a string
  let content: string

  if (params.content === null || params.content === undefined) {
    throw new Error('Note content is required')
  }

  if (typeof params.content === 'string') {
    content = params.content
  } else {
    content = JSON.stringify(params.content)
  }

  content = content.trim()

  if (!content) {
    throw new Error('Note content is required')
  }

  const body: Record<string, any> = {
    content: content,
  }

  // Handle contact linking
  if (params.contactId?.trim()) {
    body.linked_to = [
      {
        id: Number.parseInt(params.contactId.trim()),
        type: 'Contact',
      },
    ]
  }

  return body
}

// Utility function to handle API errors
export const handleApiError = (response: Response, errorText: string): never => {
  throw new Error(
    `Failed to create Wealthbox note: ${response.status} ${response.statusText} - ${errorText}`
  )
}

// Utility function to format note response
export const formatNoteResponse = (data: any): WealthboxWriteResponse => {
  if (!data) {
    return {
      success: false,
      output: {
        note: undefined,
        metadata: {
          operation: 'write_note' as const,
          itemType: 'note' as const,
        },
      },
    }
  }

  return {
    success: true,
    output: {
      note: data,
      success: true,
      metadata: {
        operation: 'write_note' as const,
        itemId: data.id?.toString() || '',
        itemType: 'note' as const,
      },
    },
  }
}

export const formatTaskResponse = (
  data: any,
  params?: WealthboxWriteParams
): WealthboxWriteResponse => {
  if (!data) {
    return {
      success: false,
      output: {
        task: undefined,
        metadata: {
          operation: 'write_task' as const,
          itemType: 'task' as const,
        },
      },
    }
  }

  return {
    success: true,
    output: {
      task: data,
      success: true,
      metadata: {
        operation: 'write_task' as const,
        itemId: data.id?.toString() || params?.taskId || '',
        itemType: 'task' as const,
      },
    },
  }
}

export // Utility function to validate parameters and build task body
const validateAndBuildTaskBody = (params: WealthboxWriteParams): WealthboxTaskRequestBody => {
  // Validate required fields with safe stringification
  const title = safeStringify(params.title).trim()
  const dueDate = safeStringify(params.dueDate).trim()

  if (!title) {
    throw new Error('Task title is required')
  }
  if (!dueDate) {
    throw new Error('Due date is required')
  }

  const body: WealthboxTaskRequestBody = {
    name: title,
    due_date: dueDate,
  }

  // Add optional fields with safe stringification
  const description = safeStringify(params.description).trim()
  if (description) {
    body.description = description
  }

  if (params.complete !== undefined) {
    body.complete = params.complete
  }

  if (params.category !== undefined) {
    body.category = params.category
  }

  // Handle contact linking with safe stringification
  const contactId = safeStringify(params.contactId).trim()
  if (contactId) {
    body.linked_to = [
      {
        id: Number.parseInt(contactId),
        type: 'Contact',
      },
    ]
  }

  return body
}
```

--------------------------------------------------------------------------------

---[FILE: write_contact.ts]---
Location: sim-main/apps/sim/tools/wealthbox/write_contact.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { WealthboxWriteParams, WealthboxWriteResponse } from '@/tools/wealthbox/types'
import { validateAndBuildContactBody } from '@/tools/wealthbox/utils'

export const wealthboxWriteContactTool: ToolConfig<WealthboxWriteParams, WealthboxWriteResponse> = {
  id: 'wealthbox_write_contact',
  name: 'Write Wealthbox Contact',
  description: 'Create a new Wealthbox contact',
  version: '1.0.0',

  params: {
    accessToken: {
      type: 'string',
      required: true,
      description: 'The access token for the Wealthbox API',
      visibility: 'hidden',
    },
    firstName: {
      type: 'string',
      required: true,
      description: 'The first name of the contact',
      visibility: 'user-or-llm',
    },
    lastName: {
      type: 'string',
      required: true,
      description: 'The last name of the contact',
      visibility: 'user-or-llm',
    },
    emailAddress: {
      type: 'string',
      required: false,
      description: 'The email address of the contact',
      visibility: 'user-or-llm',
    },
    backgroundInformation: {
      type: 'string',
      required: false,
      description: 'Background information about the contact',
      visibility: 'user-or-llm',
    },
  },

  request: {
    url: 'https://api.crmworkspace.com/v1/contacts',
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
      return validateAndBuildContactBody(params)
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    // Format contact information into readable content
    const contact = data
    let content = `Contact created: ${contact.first_name || ''} ${contact.last_name || ''}`.trim()

    if (contact.background_information) {
      content += `\nBackground: ${contact.background_information}`
    }

    if (contact.email_addresses && contact.email_addresses.length > 0) {
      content += '\nEmail Addresses:'
      contact.email_addresses.forEach((email: any) => {
        content += `\n  - ${email.address}${email.principal ? ' (Primary)' : ''} (${email.kind})`
      })
    }

    if (contact.phone_numbers && contact.phone_numbers.length > 0) {
      content += '\nPhone Numbers:'
      contact.phone_numbers.forEach((phone: any) => {
        content += `\n  - ${phone.address}${phone.extension ? ` ext. ${phone.extension}` : ''}${phone.principal ? ' (Primary)' : ''} (${phone.kind})`
      })
    }

    return {
      success: true,
      output: {
        content,
        contact,
        success: true,
        metadata: {
          operation: 'write_contact' as const,
          contactId: contact.id?.toString() || '',
          itemType: 'contact' as const,
        },
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Created or updated contact data and metadata',
      properties: {
        contact: { type: 'object', description: 'Raw contact data from Wealthbox' },
        success: { type: 'boolean', description: 'Operation success indicator' },
        metadata: {
          type: 'object',
          description: 'Operation metadata',
          properties: {
            operation: { type: 'string', description: 'The operation performed' },
            itemId: { type: 'string', description: 'ID of the created/updated contact' },
            itemType: { type: 'string', description: 'Type of item (contact)' },
          },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: write_note.ts]---
Location: sim-main/apps/sim/tools/wealthbox/write_note.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { WealthboxWriteParams, WealthboxWriteResponse } from '@/tools/wealthbox/types'
import { formatNoteResponse, validateAndBuildNoteBody } from '@/tools/wealthbox/utils'

export const wealthboxWriteNoteTool: ToolConfig<WealthboxWriteParams, WealthboxWriteResponse> = {
  id: 'wealthbox_write_note',
  name: 'Write Wealthbox Note',
  description: 'Create or update a Wealthbox note',
  version: '1.0.0',

  params: {
    accessToken: {
      type: 'string',
      required: true,
      description: 'The access token for the Wealthbox API',
      visibility: 'hidden',
    },
    content: {
      type: 'string',
      required: true,
      description: 'The main body of the note',
      visibility: 'user-or-llm',
    },
    contactId: {
      type: 'string',
      required: false,
      description: 'ID of contact to link to this note',
      visibility: 'user-only',
    },
  },

  request: {
    url: 'https://api.crmworkspace.com/v1/notes',
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
      return validateAndBuildNoteBody(params)
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()
    return formatNoteResponse(data)
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Created or updated note data and metadata',
      properties: {
        note: { type: 'object', description: 'Raw note data from Wealthbox' },
        success: { type: 'boolean', description: 'Operation success indicator' },
        metadata: {
          type: 'object',
          description: 'Operation metadata',
          properties: {
            operation: { type: 'string', description: 'The operation performed' },
            itemId: { type: 'string', description: 'ID of the created/updated note' },
            itemType: { type: 'string', description: 'Type of item (note)' },
          },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: write_task.ts]---
Location: sim-main/apps/sim/tools/wealthbox/write_task.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { WealthboxWriteParams, WealthboxWriteResponse } from '@/tools/wealthbox/types'
import { formatTaskResponse, validateAndBuildTaskBody } from '@/tools/wealthbox/utils'

export const wealthboxWriteTaskTool: ToolConfig<WealthboxWriteParams, WealthboxWriteResponse> = {
  id: 'wealthbox_write_task',
  name: 'Write Wealthbox Task',
  description: 'Create or update a Wealthbox task',
  version: '1.0.0',

  params: {
    accessToken: {
      type: 'string',
      required: true,
      description: 'The access token for the Wealthbox API',
      visibility: 'hidden',
    },
    title: {
      type: 'string',
      required: true,
      description: 'The name/title of the task',
      visibility: 'user-or-llm',
    },
    dueDate: {
      type: 'string',
      required: true,
      description:
        'The due date and time of the task (format: "YYYY-MM-DD HH:MM AM/PM -HHMM", e.g., "2015-05-24 11:00 AM -0400")',
      visibility: 'user-or-llm',
    },
    contactId: {
      type: 'string',
      required: false,
      description: 'ID of contact to link to this task',
      visibility: 'user-only',
    },
    description: {
      type: 'string',
      required: false,
      description: 'Description or notes about the task',
      visibility: 'user-or-llm',
    },
  },

  request: {
    url: (params) => {
      const taskId = params.taskId?.trim()
      if (taskId) {
        return `https://api.crmworkspace.com/v1/tasks/${taskId}`
      }
      return 'https://api.crmworkspace.com/v1/tasks'
    },
    method: 'POST',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
      }
    },
    body: (params) => {
      return validateAndBuildTaskBody(params)
    },
  },

  transformResponse: async (response: Response, params?: WealthboxWriteParams) => {
    const data = await response.json()
    return formatTaskResponse(data, params)
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Created or updated task data and metadata',
      properties: {
        task: { type: 'object', description: 'Raw task data from Wealthbox' },
        success: { type: 'boolean', description: 'Operation success indicator' },
        metadata: {
          type: 'object',
          description: 'Operation metadata',
          properties: {
            operation: { type: 'string', description: 'The operation performed' },
            itemId: { type: 'string', description: 'ID of the created/updated task' },
            itemType: { type: 'string', description: 'Type of item (task)' },
          },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_item.ts]---
Location: sim-main/apps/sim/tools/webflow/create_item.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { WebflowCreateItemParams, WebflowCreateItemResponse } from '@/tools/webflow/types'

export const webflowCreateItemTool: ToolConfig<WebflowCreateItemParams, WebflowCreateItemResponse> =
  {
    id: 'webflow_create_item',
    name: 'Webflow Create Item',
    description: 'Create a new item in a Webflow CMS collection',
    version: '1.0.0',

    oauth: {
      required: true,
      provider: 'webflow',
    },

    params: {
      accessToken: {
        type: 'string',
        required: true,
        visibility: 'hidden',
        description: 'OAuth access token',
      },
      siteId: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'ID of the Webflow site',
      },
      collectionId: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'ID of the collection',
      },
      fieldData: {
        type: 'json',
        required: true,
        visibility: 'user-or-llm',
        description:
          'Field data for the new item as a JSON object. Keys should match collection field names.',
      },
    },

    request: {
      url: (params) => `https://api.webflow.com/v2/collections/${params.collectionId}/items`,
      method: 'POST',
      headers: (params) => ({
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
      }),
      body: (params) => ({
        fieldData: params.fieldData,
      }),
    },

    transformResponse: async (response) => {
      const data = await response.json()
      return {
        success: true,
        output: {
          item: data,
          metadata: {
            itemId: data.id || 'unknown',
          },
        },
      }
    },

    outputs: {
      item: {
        type: 'json',
        description: 'The created item object',
      },
      metadata: {
        type: 'json',
        description: 'Metadata about the created item',
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: delete_item.ts]---
Location: sim-main/apps/sim/tools/webflow/delete_item.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { WebflowDeleteItemParams, WebflowDeleteItemResponse } from '@/tools/webflow/types'

export const webflowDeleteItemTool: ToolConfig<WebflowDeleteItemParams, WebflowDeleteItemResponse> =
  {
    id: 'webflow_delete_item',
    name: 'Webflow Delete Item',
    description: 'Delete an item from a Webflow CMS collection',
    version: '1.0.0',

    oauth: {
      required: true,
      provider: 'webflow',
    },

    params: {
      accessToken: {
        type: 'string',
        required: true,
        visibility: 'hidden',
        description: 'OAuth access token',
      },
      siteId: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'ID of the Webflow site',
      },
      collectionId: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'ID of the collection',
      },
      itemId: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'ID of the item to delete',
      },
    },

    request: {
      url: (params) =>
        `https://api.webflow.com/v2/collections/${params.collectionId}/items/${params.itemId}`,
      method: 'DELETE',
      headers: (params) => ({
        Authorization: `Bearer ${params.accessToken}`,
      }),
    },

    transformResponse: async (response) => {
      const isSuccess = response.status === 204 || response.ok

      return {
        success: isSuccess,
        output: {
          success: isSuccess,
          metadata: {
            deleted: isSuccess,
          },
        },
      }
    },

    outputs: {
      success: {
        type: 'boolean',
        description: 'Whether the deletion was successful',
      },
      metadata: {
        type: 'json',
        description: 'Metadata about the deletion',
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: get_item.ts]---
Location: sim-main/apps/sim/tools/webflow/get_item.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { WebflowGetItemParams, WebflowGetItemResponse } from '@/tools/webflow/types'

export const webflowGetItemTool: ToolConfig<WebflowGetItemParams, WebflowGetItemResponse> = {
  id: 'webflow_get_item',
  name: 'Webflow Get Item',
  description: 'Get a single item from a Webflow CMS collection',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'webflow',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token',
    },
    siteId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ID of the Webflow site',
    },
    collectionId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ID of the collection',
    },
    itemId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ID of the item to retrieve',
    },
  },

  request: {
    url: (params) =>
      `https://api.webflow.com/v2/collections/${params.collectionId}/items/${params.itemId}`,
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        item: data,
        metadata: {
          itemId: data.id || 'unknown',
        },
      },
    }
  },

  outputs: {
    item: {
      type: 'json',
      description: 'The retrieved item object',
    },
    metadata: {
      type: 'json',
      description: 'Metadata about the retrieved item',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/webflow/index.ts

```typescript
import { webflowCreateItemTool } from '@/tools/webflow/create_item'
import { webflowDeleteItemTool } from '@/tools/webflow/delete_item'
import { webflowGetItemTool } from '@/tools/webflow/get_item'
import { webflowListItemsTool } from '@/tools/webflow/list_items'
import { webflowUpdateItemTool } from '@/tools/webflow/update_item'

export {
  webflowCreateItemTool,
  webflowDeleteItemTool,
  webflowGetItemTool,
  webflowListItemsTool,
  webflowUpdateItemTool,
}
```

--------------------------------------------------------------------------------

---[FILE: list_items.ts]---
Location: sim-main/apps/sim/tools/webflow/list_items.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { WebflowListItemsParams, WebflowListItemsResponse } from '@/tools/webflow/types'

export const webflowListItemsTool: ToolConfig<WebflowListItemsParams, WebflowListItemsResponse> = {
  id: 'webflow_list_items',
  name: 'Webflow List Items',
  description: 'List all items from a Webflow CMS collection',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'webflow',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token',
    },
    siteId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ID of the Webflow site',
    },
    collectionId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ID of the collection',
    },
    offset: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Offset for pagination (optional)',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Maximum number of items to return (optional, default: 100)',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = `https://api.webflow.com/v2/collections/${params.collectionId}/items`
      const queryParams = new URLSearchParams()

      if (params.offset) {
        queryParams.append('offset', Number(params.offset).toString())
      }
      if (params.limit) {
        queryParams.append('limit', Number(params.limit).toString())
      }

      const query = queryParams.toString()
      return query ? `${baseUrl}?${query}` : baseUrl
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        items: data.items || [],
        metadata: {
          itemCount: (data.items || []).length,
          offset: data.offset,
          limit: data.limit,
        },
      },
    }
  },

  outputs: {
    items: {
      type: 'json',
      description: 'Array of collection items',
    },
    metadata: {
      type: 'json',
      description: 'Metadata about the query',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/webflow/types.ts

```typescript
export interface WebflowBaseParams {
  accessToken: string
  siteId: string
  collectionId: string
}

export interface WebflowListItemsParams extends WebflowBaseParams {
  offset?: number
  limit?: number
}

export interface WebflowListItemsOutput {
  items: any[]
  metadata: {
    itemCount: number
    offset?: number
    limit?: number
  }
}

export interface WebflowListItemsResponse {
  success: boolean
  output: WebflowListItemsOutput
}

export interface WebflowGetItemParams extends WebflowBaseParams {
  itemId: string
}

export interface WebflowGetItemOutput {
  item: any
  metadata: {
    itemId: string
  }
}

export interface WebflowGetItemResponse {
  success: boolean
  output: WebflowGetItemOutput
}

export interface WebflowCreateItemParams extends WebflowBaseParams {
  fieldData: Record<string, any>
}

export interface WebflowCreateItemOutput {
  item: any
  metadata: {
    itemId: string
  }
}

export interface WebflowCreateItemResponse {
  success: boolean
  output: WebflowCreateItemOutput
}

export interface WebflowUpdateItemParams extends WebflowBaseParams {
  itemId: string
  fieldData: Record<string, any>
}

export interface WebflowUpdateItemOutput {
  item: any
  metadata: {
    itemId: string
  }
}

export interface WebflowUpdateItemResponse {
  success: boolean
  output: WebflowUpdateItemOutput
}

export interface WebflowDeleteItemParams extends WebflowBaseParams {
  itemId: string
}

export interface WebflowDeleteItemOutput {
  success: boolean
  metadata: {
    deleted: boolean
  }
}

export interface WebflowDeleteItemResponse {
  success: boolean
  output: WebflowDeleteItemOutput
}

export type WebflowResponse =
  | WebflowListItemsResponse
  | WebflowGetItemResponse
  | WebflowCreateItemResponse
  | WebflowUpdateItemResponse
  | WebflowDeleteItemResponse
```

--------------------------------------------------------------------------------

---[FILE: update_item.ts]---
Location: sim-main/apps/sim/tools/webflow/update_item.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { WebflowUpdateItemParams, WebflowUpdateItemResponse } from '@/tools/webflow/types'

export const webflowUpdateItemTool: ToolConfig<WebflowUpdateItemParams, WebflowUpdateItemResponse> =
  {
    id: 'webflow_update_item',
    name: 'Webflow Update Item',
    description: 'Update an existing item in a Webflow CMS collection',
    version: '1.0.0',

    oauth: {
      required: true,
      provider: 'webflow',
    },

    params: {
      accessToken: {
        type: 'string',
        required: true,
        visibility: 'hidden',
        description: 'OAuth access token',
      },
      siteId: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'ID of the Webflow site',
      },
      collectionId: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'ID of the collection',
      },
      itemId: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'ID of the item to update',
      },
      fieldData: {
        type: 'json',
        required: true,
        visibility: 'user-or-llm',
        description:
          'Field data to update as a JSON object. Only include fields you want to change.',
      },
    },

    request: {
      url: (params) =>
        `https://api.webflow.com/v2/collections/${params.collectionId}/items/${params.itemId}`,
      method: 'PATCH',
      headers: (params) => ({
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
      }),
      body: (params) => ({
        fieldData: params.fieldData,
      }),
    },

    transformResponse: async (response) => {
      const data = await response.json()
      return {
        success: true,
        output: {
          item: data,
          metadata: {
            itemId: data.id || 'unknown',
          },
        },
      }
    },

    outputs: {
      item: {
        type: 'json',
        description: 'The updated item object',
      },
      metadata: {
        type: 'json',
        description: 'Metadata about the updated item',
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/whatsapp/index.ts

```typescript
import { sendMessageTool } from '@/tools/whatsapp/send_message'

export const whatsappSendMessageTool = sendMessageTool
```

--------------------------------------------------------------------------------

````
