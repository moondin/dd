---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 720
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 720 of 933)

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

---[FILE: update_task.ts]---
Location: sim-main/apps/sim/tools/microsoft_planner/update_task.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  MicrosoftPlannerToolParams,
  MicrosoftPlannerUpdateTaskResponse,
  PlannerTask,
} from '@/tools/microsoft_planner/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('MicrosoftPlannerUpdateTask')

export const updateTaskTool: ToolConfig<
  MicrosoftPlannerToolParams,
  MicrosoftPlannerUpdateTaskResponse
> = {
  id: 'microsoft_planner_update_task',
  name: 'Update Microsoft Planner Task',
  description: 'Update a task in Microsoft Planner',
  version: '1.0',
  errorExtractor: 'nested-error-object',

  oauth: {
    required: true,
    provider: 'microsoft-planner',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Microsoft Planner API',
    },
    taskId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the task to update',
    },
    etag: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ETag value from the task to update (If-Match header)',
    },
    title: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The new title of the task',
    },
    bucketId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The bucket ID to move the task to',
    },
    dueDateTime: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The due date and time for the task (ISO 8601 format)',
    },
    startDateTime: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The start date and time for the task (ISO 8601 format)',
    },
    percentComplete: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'The percentage of task completion (0-100)',
    },
    priority: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'The priority of the task (0-10)',
    },
    assigneeUserId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The user ID to assign the task to',
    },
  },

  request: {
    url: (params) => {
      if (!params.taskId) {
        throw new Error('Task ID is required')
      }
      return `https://graph.microsoft.com/v1.0/planner/tasks/${params.taskId}`
    },
    method: 'PATCH',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }
      if (!params.etag) {
        throw new Error('ETag is required for update operations')
      }

      let cleanedEtag = params.etag.trim()
      logger.info('ETag value received (raw):', { etag: params.etag, length: params.etag.length })

      while (cleanedEtag.startsWith('"') && cleanedEtag.endsWith('"')) {
        cleanedEtag = cleanedEtag.slice(1, -1)
        logger.info('Removed surrounding quotes:', cleanedEtag)
      }

      if (cleanedEtag.includes('\\"')) {
        cleanedEtag = cleanedEtag.replace(/\\"/g, '"')
        logger.info('Cleaned escaped quotes from etag:', {
          original: params.etag,
          cleaned: cleanedEtag,
        })
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
        'If-Match': cleanedEtag,
      }
    },
    body: (params) => {
      const body: Partial<PlannerTask> = {}

      if (params.title !== undefined && params.title !== null && params.title !== '') {
        body.title = params.title
      }

      if (params.bucketId !== undefined && params.bucketId !== null && params.bucketId !== '') {
        body.bucketId = params.bucketId
      }

      if (
        params.dueDateTime !== undefined &&
        params.dueDateTime !== null &&
        params.dueDateTime !== ''
      ) {
        body.dueDateTime = params.dueDateTime
      }

      if (
        params.startDateTime !== undefined &&
        params.startDateTime !== null &&
        params.startDateTime !== ''
      ) {
        body.startDateTime = params.startDateTime
      }

      if (params.percentComplete !== undefined && params.percentComplete !== null) {
        body.percentComplete = params.percentComplete
      }

      if (params.priority !== undefined) {
        body.priority = Number(params.priority)
      }

      if (
        params.assigneeUserId !== undefined &&
        params.assigneeUserId !== null &&
        params.assigneeUserId !== ''
      ) {
        body.assignments = {
          [params.assigneeUserId]: {
            '@odata.type': 'microsoft.graph.plannerAssignment',
            orderHint: ' !',
          },
        }
      }

      if (Object.keys(body).length === 0) {
        throw new Error('At least one field must be provided to update')
      }

      logger.info('Updating task with body:', body)
      return body
    },
  },

  transformResponse: async (response: Response, params?: MicrosoftPlannerToolParams) => {
    // Check if response has content before parsing
    const text = await response.text()
    if (!text || text.trim() === '') {
      logger.info('Update successful but no response body returned (204 No Content)')
      return {
        success: true,
        output: {
          message: 'Task updated successfully',
          task: {} as PlannerTask,
          taskId: params?.taskId || '',
          etag: params?.etag || '',
          metadata: {
            taskId: params?.taskId,
          },
        },
      }
    }

    const task = JSON.parse(text)
    logger.info('Updated task:', task)

    // Extract and clean the new etag for subsequent operations
    let newEtag = task['@odata.etag']
    if (newEtag && typeof newEtag === 'string' && newEtag.includes('\\"')) {
      newEtag = newEtag.replace(/\\"/g, '"')
    }

    const result: MicrosoftPlannerUpdateTaskResponse = {
      success: true,
      output: {
        message: 'Task updated successfully',
        task,
        taskId: task.id,
        etag: newEtag,
        metadata: {
          taskId: task.id,
          planId: task.planId,
          taskUrl: `https://graph.microsoft.com/v1.0/planner/tasks/${task.id}`,
        },
      },
    }

    return result
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the task was updated successfully' },
    message: { type: 'string', description: 'Success message when task is updated' },
    task: { type: 'object', description: 'The updated task object with all properties' },
    taskId: { type: 'string', description: 'ID of the updated task' },
    etag: {
      type: 'string',
      description: 'New ETag after update - use this for subsequent operations',
    },
    metadata: { type: 'object', description: 'Metadata including taskId, planId, and taskUrl' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_task_details.ts]---
Location: sim-main/apps/sim/tools/microsoft_planner/update_task_details.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  MicrosoftPlannerToolParams,
  MicrosoftPlannerUpdateTaskDetailsResponse,
} from '@/tools/microsoft_planner/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('MicrosoftPlannerUpdateTaskDetails')

export const updateTaskDetailsTool: ToolConfig<
  MicrosoftPlannerToolParams,
  MicrosoftPlannerUpdateTaskDetailsResponse
> = {
  id: 'microsoft_planner_update_task_details',
  name: 'Update Microsoft Planner Task Details',
  description:
    'Update task details including description, checklist items, and references in Microsoft Planner',
  version: '1.0',
  errorExtractor: 'nested-error-object',

  oauth: {
    required: true,
    provider: 'microsoft-planner',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Microsoft Planner API',
    },
    taskId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the task',
    },
    etag: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ETag value from the task details to update (If-Match header)',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The description of the task',
    },
    checklist: {
      type: 'object',
      required: false,
      visibility: 'user-only',
      description: 'Checklist items as a JSON object',
    },
    references: {
      type: 'object',
      required: false,
      visibility: 'user-only',
      description: 'References as a JSON object',
    },
    previewType: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Preview type: automatic, noPreview, checklist, description, or reference',
    },
  },

  request: {
    url: (params) => {
      if (!params.taskId) {
        throw new Error('Task ID is required')
      }
      return `https://graph.microsoft.com/v1.0/planner/tasks/${params.taskId}/details`
    },
    method: 'PATCH',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }
      if (!params.etag) {
        throw new Error('ETag is required for update operations')
      }

      let cleanedEtag = params.etag.trim()

      logger.info('ETag processing:', {
        original: params.etag,
        originalLength: params.etag.length,
      })

      while (cleanedEtag.startsWith('"') && cleanedEtag.endsWith('"')) {
        cleanedEtag = cleanedEtag.slice(1, -1)
        logger.info('Removed surrounding quotes:', cleanedEtag)
      }

      if (cleanedEtag.includes('\\"')) {
        cleanedEtag = cleanedEtag.replace(/\\"/g, '"')
        logger.info('Unescaped quotes:', cleanedEtag)
      }

      if (!/^W\/".+"$/.test(cleanedEtag)) {
        logger.warn(
          'Unexpected ETag format for If-Match. For plannerTaskDetails, use the ETag from GET /planner/tasks/{id}/details.',
          {
            cleanedEtag,
          }
        )
      }

      logger.info(`Using If-Match header: ${cleanedEtag}`)

      return {
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
        'If-Match': cleanedEtag,
      }
    },
    body: (params) => {
      const body: Record<string, any> = {}

      if (params.description !== undefined) {
        body.description = params.description
      }

      if (params.checklist) {
        body.checklist = params.checklist
      }

      if (params.references) {
        body.references = params.references
      }

      if (params.previewType) {
        body.previewType = params.previewType
      }

      if (Object.keys(body).length === 0) {
        throw new Error('At least one field must be provided to update')
      }

      logger.info('Updating task details with body:', body)
      return body
    },
  },

  transformResponse: async (response: Response) => {
    const taskDetails = await response.json()
    logger.info('Updated task details:', taskDetails)

    const result: MicrosoftPlannerUpdateTaskDetailsResponse = {
      success: true,
      output: {
        taskDetails,
        metadata: {
          taskId: taskDetails.id,
        },
      },
    }

    return result
  },

  outputs: {
    success: {
      type: 'boolean',
      description: 'Whether the task details were updated successfully',
    },
    taskDetails: {
      type: 'object',
      description: 'The updated task details object with all properties',
    },
    metadata: { type: 'object', description: 'Metadata including taskId' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_channel_message.ts]---
Location: sim-main/apps/sim/tools/microsoft_teams/delete_channel_message.ts

```typescript
import type {
  MicrosoftTeamsDeleteMessageParams,
  MicrosoftTeamsDeleteResponse,
} from '@/tools/microsoft_teams/types'
import type { ToolConfig } from '@/tools/types'

export const deleteChannelMessageTool: ToolConfig<
  MicrosoftTeamsDeleteMessageParams,
  MicrosoftTeamsDeleteResponse
> = {
  id: 'microsoft_teams_delete_channel_message',
  name: 'Delete Microsoft Teams Channel Message',
  description: 'Soft delete a message in a Microsoft Teams channel',
  version: '1.0',
  errorExtractor: 'nested-error-object',
  oauth: {
    required: true,
    provider: 'microsoft-teams',
  },
  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Microsoft Teams API',
    },
    teamId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the team',
    },
    channelId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the channel containing the message',
    },
    messageId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The ID of the message to delete',
    },
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the deletion was successful' },
    deleted: { type: 'boolean', description: 'Confirmation of deletion' },
    messageId: { type: 'string', description: 'ID of the deleted message' },
  },

  request: {
    url: (params) => {
      const teamId = params.teamId?.trim()
      const channelId = params.channelId?.trim()
      const messageId = params.messageId?.trim()
      if (!teamId || !channelId || !messageId) {
        throw new Error('Team ID, Channel ID, and Message ID are required')
      }
      return `https://graph.microsoft.com/v1.0/teams/${encodeURIComponent(teamId)}/channels/${encodeURIComponent(channelId)}/messages/${encodeURIComponent(messageId)}/softDelete`
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
  },

  transformResponse: async (_response: Response, params?: MicrosoftTeamsDeleteMessageParams) => {
    // Soft delete returns 204 No Content on success
    return {
      success: true,
      output: {
        deleted: true,
        messageId: params?.messageId || '',
        metadata: {
          messageId: params?.messageId || '',
          teamId: params?.teamId || '',
          channelId: params?.channelId || '',
        },
      },
    }
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_chat_message.ts]---
Location: sim-main/apps/sim/tools/microsoft_teams/delete_chat_message.ts

```typescript
import type {
  MicrosoftTeamsDeleteMessageParams,
  MicrosoftTeamsDeleteResponse,
} from '@/tools/microsoft_teams/types'
import type { ToolConfig } from '@/tools/types'

export const deleteChatMessageTool: ToolConfig<
  MicrosoftTeamsDeleteMessageParams,
  MicrosoftTeamsDeleteResponse
> = {
  id: 'microsoft_teams_delete_chat_message',
  name: 'Delete Microsoft Teams Chat Message',
  description: 'Soft delete a message in a Microsoft Teams chat',
  version: '1.0',
  errorExtractor: 'nested-error-object',
  oauth: {
    required: true,
    provider: 'microsoft-teams',
  },
  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Microsoft Teams API',
    },
    chatId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the chat containing the message',
    },
    messageId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The ID of the message to delete',
    },
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the deletion was successful' },
    deleted: { type: 'boolean', description: 'Confirmation of deletion' },
    messageId: { type: 'string', description: 'ID of the deleted message' },
  },

  request: {
    url: (params) => {
      const chatId = params.chatId?.trim()
      const messageId = params.messageId?.trim()
      if (!chatId || !messageId) {
        throw new Error('Chat ID and Message ID are required')
      }
      return '/api/tools/microsoft_teams/delete_chat_message'
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
      return {
        accessToken: params.accessToken,
        chatId: params.chatId,
        messageId: params.messageId,
      }
    },
  },

  transformResponse: async (_response: Response, params?: MicrosoftTeamsDeleteMessageParams) => {
    // Soft delete returns 204 No Content on success
    return {
      success: true,
      output: {
        deleted: true,
        messageId: params?.messageId || '',
        metadata: {
          messageId: params?.messageId || '',
          chatId: params?.chatId || '',
        },
      },
    }
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_message.ts]---
Location: sim-main/apps/sim/tools/microsoft_teams/get_message.ts

```typescript
import type {
  MicrosoftTeamsGetMessageParams,
  MicrosoftTeamsReadResponse,
} from '@/tools/microsoft_teams/types'
import type { ToolConfig } from '@/tools/types'

export const getMessageTool: ToolConfig<
  MicrosoftTeamsGetMessageParams,
  MicrosoftTeamsReadResponse
> = {
  id: 'microsoft_teams_get_message',
  name: 'Get Microsoft Teams Message',
  description: 'Get a specific message from a Microsoft Teams chat or channel',
  version: '1.0',
  errorExtractor: 'nested-error-object',
  oauth: {
    required: true,
    provider: 'microsoft-teams',
  },
  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Microsoft Teams API',
    },
    teamId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The ID of the team (for channel messages)',
    },
    channelId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The ID of the channel (for channel messages)',
    },
    chatId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The ID of the chat (for chat messages)',
    },
    messageId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The ID of the message to retrieve',
    },
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the retrieval was successful' },
    content: { type: 'string', description: 'The message content' },
    metadata: { type: 'object', description: 'Message metadata including sender, timestamp, etc.' },
  },

  request: {
    url: (params) => {
      const messageId = params.messageId?.trim()
      if (!messageId) {
        throw new Error('Message ID is required')
      }

      // Check if it's a channel or chat message
      if (params.teamId && params.channelId) {
        const teamId = params.teamId.trim()
        const channelId = params.channelId.trim()
        return `https://graph.microsoft.com/v1.0/teams/${encodeURIComponent(teamId)}/channels/${encodeURIComponent(channelId)}/messages/${encodeURIComponent(messageId)}`
      }
      if (params.chatId) {
        const chatId = params.chatId.trim()
        return `https://graph.microsoft.com/v1.0/chats/${encodeURIComponent(chatId)}/messages/${encodeURIComponent(messageId)}`
      }

      throw new Error('Either (teamId and channelId) or chatId is required')
    },
    method: 'GET',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }
      return {
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
  },

  transformResponse: async (response: Response, params?: MicrosoftTeamsGetMessageParams) => {
    const data = await response.json()

    const metadata = {
      messageId: data.id || params?.messageId || '',
      content: data.body?.content || '',
      createdTime: data.createdDateTime || '',
      url: data.webUrl || '',
      teamId: params?.teamId,
      channelId: params?.channelId,
      chatId: params?.chatId,
      messages: [
        {
          id: data.id || '',
          content: data.body?.content || '',
          sender: data.from?.user?.displayName || 'Unknown',
          timestamp: data.createdDateTime || '',
          messageType: data.messageType || 'message',
          attachments: data.attachments || [],
        },
      ],
      messageCount: 1,
    }

    return {
      success: true,
      output: {
        content: data.body?.content || '',
        metadata,
      },
    }
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/microsoft_teams/index.ts

```typescript
import { deleteChannelMessageTool } from '@/tools/microsoft_teams/delete_channel_message'
import { deleteChatMessageTool } from '@/tools/microsoft_teams/delete_chat_message'
import { getMessageTool } from '@/tools/microsoft_teams/get_message'
import { listChannelMembersTool } from '@/tools/microsoft_teams/list_channel_members'
import { listTeamMembersTool } from '@/tools/microsoft_teams/list_team_members'
import { readChannelTool } from '@/tools/microsoft_teams/read_channel'
import { readChatTool } from '@/tools/microsoft_teams/read_chat'
import { replyToMessageTool } from '@/tools/microsoft_teams/reply_to_message'
import { setReactionTool } from '@/tools/microsoft_teams/set_reaction'
import { unsetReactionTool } from '@/tools/microsoft_teams/unset_reaction'
import { updateChannelMessageTool } from '@/tools/microsoft_teams/update_channel_message'
import { updateChatMessageTool } from '@/tools/microsoft_teams/update_chat_message'
import { writeChannelTool } from '@/tools/microsoft_teams/write_channel'
import { writeChatTool } from '@/tools/microsoft_teams/write_chat'

export const microsoftTeamsReadChannelTool = readChannelTool
export const microsoftTeamsReadChatTool = readChatTool
export const microsoftTeamsGetMessageTool = getMessageTool
export const microsoftTeamsWriteChannelTool = writeChannelTool
export const microsoftTeamsWriteChatTool = writeChatTool
export const microsoftTeamsUpdateChatMessageTool = updateChatMessageTool
export const microsoftTeamsUpdateChannelMessageTool = updateChannelMessageTool
export const microsoftTeamsDeleteChatMessageTool = deleteChatMessageTool
export const microsoftTeamsDeleteChannelMessageTool = deleteChannelMessageTool
export const microsoftTeamsReplyToMessageTool = replyToMessageTool
export const microsoftTeamsSetReactionTool = setReactionTool
export const microsoftTeamsUnsetReactionTool = unsetReactionTool
export const microsoftTeamsListTeamMembersTool = listTeamMembersTool
export const microsoftTeamsListChannelMembersTool = listChannelMembersTool
```

--------------------------------------------------------------------------------

---[FILE: list_channel_members.ts]---
Location: sim-main/apps/sim/tools/microsoft_teams/list_channel_members.ts

```typescript
import type {
  MicrosoftTeamsListMembersResponse,
  MicrosoftTeamsToolParams,
} from '@/tools/microsoft_teams/types'
import type { ToolConfig } from '@/tools/types'

export const listChannelMembersTool: ToolConfig<
  MicrosoftTeamsToolParams,
  MicrosoftTeamsListMembersResponse
> = {
  id: 'microsoft_teams_list_channel_members',
  name: 'List Microsoft Teams Channel Members',
  description: 'List all members of a Microsoft Teams channel',
  version: '1.0',
  errorExtractor: 'nested-error-object',
  oauth: {
    required: true,
    provider: 'microsoft-teams',
  },
  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Microsoft Teams API',
    },
    teamId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the team',
    },
    channelId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the channel',
    },
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the listing was successful' },
    members: { type: 'array', description: 'Array of channel members' },
    memberCount: { type: 'number', description: 'Total number of members' },
  },

  request: {
    url: (params) => {
      const teamId = params.teamId?.trim()
      const channelId = params.channelId?.trim()
      if (!teamId || !channelId) {
        throw new Error('Team ID and Channel ID are required')
      }
      return `https://graph.microsoft.com/v1.0/teams/${encodeURIComponent(teamId)}/channels/${encodeURIComponent(channelId)}/members`
    },
    method: 'GET',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }
      return {
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
  },

  transformResponse: async (response: Response, params?: MicrosoftTeamsToolParams) => {
    const data = await response.json()

    const members = (data.value || []).map((member: any) => ({
      id: member.id || '',
      displayName: member.displayName || '',
      email: member.email || member.userId || '',
      userId: member.userId || '',
      roles: member.roles || [],
    }))

    return {
      success: true,
      output: {
        members,
        memberCount: members.length,
        metadata: {
          teamId: params?.teamId || '',
          channelId: params?.channelId || '',
        },
      },
    }
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_team_members.ts]---
Location: sim-main/apps/sim/tools/microsoft_teams/list_team_members.ts

```typescript
import type {
  MicrosoftTeamsListMembersResponse,
  MicrosoftTeamsToolParams,
} from '@/tools/microsoft_teams/types'
import type { ToolConfig } from '@/tools/types'

export const listTeamMembersTool: ToolConfig<
  MicrosoftTeamsToolParams,
  MicrosoftTeamsListMembersResponse
> = {
  id: 'microsoft_teams_list_team_members',
  name: 'List Microsoft Teams Team Members',
  description: 'List all members of a Microsoft Teams team',
  version: '1.0',
  errorExtractor: 'nested-error-object',
  oauth: {
    required: true,
    provider: 'microsoft-teams',
  },
  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Microsoft Teams API',
    },
    teamId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the team',
    },
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the listing was successful' },
    members: { type: 'array', description: 'Array of team members' },
    memberCount: { type: 'number', description: 'Total number of members' },
  },

  request: {
    url: (params) => {
      const teamId = params.teamId?.trim()
      if (!teamId) {
        throw new Error('Team ID is required')
      }
      return `https://graph.microsoft.com/v1.0/teams/${encodeURIComponent(teamId)}/members`
    },
    method: 'GET',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }
      return {
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
  },

  transformResponse: async (response: Response, params?: MicrosoftTeamsToolParams) => {
    const data = await response.json()

    const members = (data.value || []).map((member: any) => ({
      id: member.id || '',
      displayName: member.displayName || '',
      email: member.email || member.userId || '',
      userId: member.userId || '',
      roles: member.roles || [],
    }))

    return {
      success: true,
      output: {
        members,
        memberCount: members.length,
        metadata: {
          teamId: params?.teamId || '',
        },
      },
    }
  },
}
```

--------------------------------------------------------------------------------

---[FILE: read_channel.ts]---
Location: sim-main/apps/sim/tools/microsoft_teams/read_channel.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  MicrosoftTeamsReadResponse,
  MicrosoftTeamsToolParams,
} from '@/tools/microsoft_teams/types'
import {
  downloadAllReferenceAttachments,
  extractMessageAttachments,
  fetchHostedContentsForChannelMessage,
} from '@/tools/microsoft_teams/utils'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('MicrosoftTeamsReadChannel')

export const readChannelTool: ToolConfig<MicrosoftTeamsToolParams, MicrosoftTeamsReadResponse> = {
  id: 'microsoft_teams_read_channel',
  name: 'Read Microsoft Teams Channel',
  description: 'Read content from a Microsoft Teams channel',
  version: '1.0',
  errorExtractor: 'nested-error-object',

  oauth: {
    required: true,
    provider: 'microsoft-teams',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Microsoft Teams API',
    },
    teamId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the team to read from',
    },
    channelId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the channel to read from',
    },
    includeAttachments: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Download and include message attachments (hosted contents) into storage',
    },
  },

  request: {
    url: (params) => {
      const teamId = params.teamId?.trim()
      if (!teamId) {
        throw new Error('Team ID is required')
      }

      const channelId = params.channelId?.trim()
      if (!channelId) {
        throw new Error('Channel ID is required')
      }

      const encodedTeamId = encodeURIComponent(teamId)
      const encodedChannelId = encodeURIComponent(channelId)

      const url = `https://graph.microsoft.com/v1.0/teams/${encodedTeamId}/channels/${encodedChannelId}/messages`

      return url
    },
    method: 'GET',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
  },

  transformResponse: async (response: Response, params?: MicrosoftTeamsToolParams) => {
    const data = await response.json()

    const messages = data.value || []

    if (messages.length === 0) {
      return {
        success: true,
        output: {
          content: 'No messages found in this channel.',
          metadata: {
            teamId: '',
            channelId: '',
            messageCount: 0,
            messages: [],
            totalAttachments: 0,
            attachmentTypes: [],
          },
        },
      }
    }

    const processedMessages = await Promise.all(
      messages.map(async (message: any, index: number) => {
        try {
          const content = message.body?.content || 'No content'
          const messageId = message.id

          const attachments = extractMessageAttachments(message)

          let sender = 'Unknown'
          if (message.from?.user?.displayName) {
            sender = message.from.user.displayName
          } else if (message.messageType === 'systemEventMessage') {
            sender = 'System'
          }

          let uploaded: any[] = []
          if (
            params?.includeAttachments &&
            params.accessToken &&
            params.teamId &&
            params.channelId &&
            messageId
          ) {
            try {
              const hostedContents = await fetchHostedContentsForChannelMessage({
                accessToken: params.accessToken,
                teamId: params.teamId,
                channelId: params.channelId,
                messageId,
              })
              uploaded.push(...hostedContents)

              const referenceFiles = await downloadAllReferenceAttachments({
                accessToken: params.accessToken,
                attachments,
              })
              uploaded.push(...referenceFiles)
            } catch (_e) {
              uploaded = []
            }
          }

          return {
            id: messageId,
            content: content,
            sender,
            timestamp: message.createdDateTime,
            messageType: message.messageType || 'message',
            attachments,
            uploadedFiles: uploaded,
          }
        } catch (error) {
          logger.error(`Error processing message at index ${index}:`, error)
          return {
            id: message.id || `unknown-${index}`,
            content: 'Error processing message',
            sender: 'Unknown',
            timestamp: message.createdDateTime || new Date().toISOString(),
            messageType: 'error',
            attachments: [],
          }
        }
      })
    )

    const formattedMessages = processedMessages
      .map((message: any) => {
        const sender = message.sender
        const timestamp = message.timestamp
          ? new Date(message.timestamp).toLocaleString()
          : 'Unknown time'

        return `[${timestamp}] ${sender}: ${message.content}`
      })
      .join('\n\n')

    const allAttachments = processedMessages.flatMap((msg: any) => msg.attachments || [])
    const attachmentTypes: string[] = []
    const seenTypes = new Set<string>()

    allAttachments.forEach((att: any) => {
      if (
        att.contentType &&
        typeof att.contentType === 'string' &&
        !seenTypes.has(att.contentType)
      ) {
        attachmentTypes.push(att.contentType)
        seenTypes.add(att.contentType)
      }
    })

    const metadata = {
      teamId: messages[0]?.channelIdentity?.teamId || params?.teamId || '',
      channelId: messages[0]?.channelIdentity?.channelId || params?.channelId || '',
      messageCount: messages.length,
      totalAttachments: allAttachments.length,
      attachmentTypes,
      messages: processedMessages,
    }

    const flattenedUploads = processedMessages.flatMap((m: any) => m.uploadedFiles || [])

    return {
      success: true,
      output: {
        content: formattedMessages,
        metadata,
        attachments: flattenedUploads,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Teams channel read operation success status' },
    messageCount: { type: 'number', description: 'Number of messages retrieved from channel' },
    teamId: { type: 'string', description: 'ID of the team that was read from' },
    channelId: { type: 'string', description: 'ID of the channel that was read from' },
    messages: { type: 'array', description: 'Array of channel message objects' },
    attachmentCount: { type: 'number', description: 'Total number of attachments found' },
    attachmentTypes: { type: 'array', description: 'Types of attachments found' },
    content: { type: 'string', description: 'Formatted content of channel messages' },
    attachments: {
      type: 'file[]',
      description: 'Uploaded attachments for convenience (flattened)',
    },
  },
}
```

--------------------------------------------------------------------------------

````
