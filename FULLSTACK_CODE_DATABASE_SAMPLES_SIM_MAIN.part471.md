---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 471
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 471 of 933)

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

---[FILE: microsoft_planner.ts]---
Location: sim-main/apps/sim/blocks/blocks/microsoft_planner.ts

```typescript
import { MicrosoftPlannerIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { MicrosoftPlannerResponse } from '@/tools/microsoft_planner/types'

interface MicrosoftPlannerBlockParams {
  credential: string
  accessToken?: string
  planId?: string
  taskId?: string
  bucketId?: string
  groupId?: string
  title?: string
  name?: string
  description?: string
  dueDateTime?: string
  startDateTime?: string
  assigneeUserId?: string
  priority?: number
  percentComplete?: number
  etag?: string
  checklist?: string
  references?: string
  previewType?: string
  [key: string]: string | number | boolean | undefined
}

export const MicrosoftPlannerBlock: BlockConfig<MicrosoftPlannerResponse> = {
  type: 'microsoft_planner',
  name: 'Microsoft Planner',
  description: 'Manage tasks, plans, and buckets in Microsoft Planner',
  authMode: AuthMode.OAuth,
  longDescription:
    'Integrate Microsoft Planner into the workflow. Manage tasks, plans, buckets, and task details including checklists and references.',
  docsLink: 'https://docs.sim.ai/tools/microsoft_planner',
  category: 'tools',
  bgColor: '#E0E0E0',
  icon: MicrosoftPlannerIcon,
  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Read Task', id: 'read_task' },
        { label: 'Create Task', id: 'create_task' },
        { label: 'Update Task', id: 'update_task' },
        { label: 'Delete Task', id: 'delete_task' },
        { label: 'List Plans', id: 'list_plans' },
        { label: 'Read Plan', id: 'read_plan' },
        { label: 'List Buckets', id: 'list_buckets' },
        { label: 'Read Bucket', id: 'read_bucket' },
        { label: 'Create Bucket', id: 'create_bucket' },
        { label: 'Update Bucket', id: 'update_bucket' },
        { label: 'Delete Bucket', id: 'delete_bucket' },
        { label: 'Get Task Details', id: 'get_task_details' },
        { label: 'Update Task Details', id: 'update_task_details' },
      ],
    },
    {
      id: 'credential',
      title: 'Microsoft Account',
      type: 'oauth-input',
      serviceId: 'microsoft-planner',
      requiredScopes: [
        'openid',
        'profile',
        'email',
        'Group.ReadWrite.All',
        'Group.Read.All',
        'Tasks.ReadWrite',
        'offline_access',
      ],
      placeholder: 'Select Microsoft account',
    },

    // Plan ID - for various operations
    {
      id: 'planId',
      title: 'Plan ID',
      type: 'short-input',
      placeholder: 'Enter the plan ID',
      condition: {
        field: 'operation',
        value: ['create_task', 'read_task', 'read_plan', 'list_buckets', 'create_bucket'],
      },
      dependsOn: ['credential'],
    },

    // Task ID selector - for read_task
    {
      id: 'taskId',
      title: 'Task ID',
      type: 'file-selector',
      placeholder: 'Select a task',
      serviceId: 'microsoft-planner',
      condition: { field: 'operation', value: ['read_task'] },
      dependsOn: ['credential', 'planId'],
      mode: 'basic',
      canonicalParamId: 'taskId',
    },

    // Manual Task ID - for read_task advanced mode
    {
      id: 'manualTaskId',
      title: 'Manual Task ID',
      type: 'short-input',
      placeholder: 'Enter the task ID',
      condition: { field: 'operation', value: ['read_task'] },
      dependsOn: ['credential', 'planId'],
      mode: 'advanced',
      canonicalParamId: 'taskId',
    },

    // Task ID for update/delete operations
    {
      id: 'taskIdForUpdate',
      title: 'Task ID',
      type: 'short-input',
      placeholder: 'Enter the task ID',
      condition: {
        field: 'operation',
        value: ['update_task', 'delete_task', 'get_task_details', 'update_task_details'],
      },
      dependsOn: ['credential'],
      canonicalParamId: 'taskId',
    },

    // Bucket ID for bucket operations
    {
      id: 'bucketIdForRead',
      title: 'Bucket ID',
      type: 'short-input',
      placeholder: 'Enter the bucket ID',
      condition: { field: 'operation', value: ['read_bucket', 'update_bucket', 'delete_bucket'] },
      dependsOn: ['credential'],
      canonicalParamId: 'bucketId',
    },

    // ETag for update/delete operations
    {
      id: 'etag',
      title: 'ETag',
      type: 'short-input',
      placeholder: 'Etag of the item',
      required: true,
      condition: {
        field: 'operation',
        value: [
          'update_task',
          'delete_task',
          'update_bucket',
          'delete_bucket',
          'update_task_details',
        ],
      },
      dependsOn: ['credential'],
    },

    // Task fields for create/update
    {
      id: 'title',
      title: 'Task Title',
      type: 'short-input',
      placeholder: 'Enter the task title',
      condition: { field: 'operation', value: ['create_task', 'update_task'] },
    },

    // Name for bucket operations
    {
      id: 'name',
      title: 'Bucket Name',
      type: 'short-input',
      placeholder: 'Enter the bucket name',
      condition: { field: 'operation', value: ['create_bucket', 'update_bucket'] },
    },

    // Description for task details
    {
      id: 'description',
      title: 'Description',
      type: 'long-input',
      placeholder: 'Enter task description',
      condition: { field: 'operation', value: ['create_task', 'update_task_details'] },
    },

    // Due Date
    {
      id: 'dueDateTime',
      title: 'Due Date',
      type: 'short-input',
      placeholder: 'Enter due date in ISO 8601 format (e.g., 2024-12-31T23:59:59Z)',
      condition: { field: 'operation', value: ['create_task', 'update_task'] },
    },

    // Start Date
    {
      id: 'startDateTime',
      title: 'Start Date',
      type: 'short-input',
      placeholder: 'Enter start date in ISO 8601 format (optional)',
      condition: { field: 'operation', value: ['update_task'] },
    },

    // Assignee
    {
      id: 'assigneeUserId',
      title: 'Assignee User ID',
      type: 'short-input',
      placeholder: 'Enter the user ID to assign this task to (optional)',
      condition: { field: 'operation', value: ['create_task', 'update_task'] },
    },

    // Bucket ID for task
    {
      id: 'bucketId',
      title: 'Bucket ID',
      type: 'short-input',
      placeholder: 'Enter the bucket ID to organize the task (optional)',
      condition: { field: 'operation', value: ['create_task', 'update_task'] },
    },

    // Priority
    {
      id: 'priority',
      title: 'Priority',
      type: 'short-input',
      placeholder: 'Enter priority (0-10, optional)',
      condition: { field: 'operation', value: ['update_task'] },
    },

    // Percent Complete
    {
      id: 'percentComplete',
      title: 'Percent Complete',
      type: 'short-input',
      placeholder: 'Enter completion percentage (0-100, optional)',
      condition: { field: 'operation', value: ['update_task'] },
    },

    // Checklist for task details
    {
      id: 'checklist',
      title: 'Checklist (JSON)',
      type: 'long-input',
      placeholder: 'Enter checklist as JSON object (optional)',
      condition: { field: 'operation', value: ['update_task_details'] },
    },

    // References for task details
    {
      id: 'references',
      title: 'References (JSON)',
      type: 'long-input',
      placeholder: 'Enter references as JSON object (optional)',
      condition: { field: 'operation', value: ['update_task_details'] },
    },

    // Preview Type
    {
      id: 'previewType',
      title: 'Preview Type',
      type: 'short-input',
      placeholder: 'Enter preview type (automatic, noPreview, checklist, description, reference)',
      condition: { field: 'operation', value: ['update_task_details'] },
    },
  ],
  tools: {
    access: [
      'microsoft_planner_read_task',
      'microsoft_planner_create_task',
      'microsoft_planner_update_task',
      'microsoft_planner_delete_task',
      'microsoft_planner_list_plans',
      'microsoft_planner_read_plan',
      'microsoft_planner_list_buckets',
      'microsoft_planner_read_bucket',
      'microsoft_planner_create_bucket',
      'microsoft_planner_update_bucket',
      'microsoft_planner_delete_bucket',
      'microsoft_planner_get_task_details',
      'microsoft_planner_update_task_details',
    ],
    config: {
      tool: (params) => {
        switch (params.operation) {
          case 'read_task':
            return 'microsoft_planner_read_task'
          case 'create_task':
            return 'microsoft_planner_create_task'
          case 'update_task':
            return 'microsoft_planner_update_task'
          case 'delete_task':
            return 'microsoft_planner_delete_task'
          case 'list_plans':
            return 'microsoft_planner_list_plans'
          case 'read_plan':
            return 'microsoft_planner_read_plan'
          case 'list_buckets':
            return 'microsoft_planner_list_buckets'
          case 'read_bucket':
            return 'microsoft_planner_read_bucket'
          case 'create_bucket':
            return 'microsoft_planner_create_bucket'
          case 'update_bucket':
            return 'microsoft_planner_update_bucket'
          case 'delete_bucket':
            return 'microsoft_planner_delete_bucket'
          case 'get_task_details':
            return 'microsoft_planner_get_task_details'
          case 'update_task_details':
            return 'microsoft_planner_update_task_details'
          default:
            throw new Error(`Invalid Microsoft Planner operation: ${params.operation}`)
        }
      },
      params: (params) => {
        const {
          credential,
          operation,
          groupId,
          planId,
          taskId,
          manualTaskId,
          taskIdForUpdate,
          bucketId,
          bucketIdForRead,
          title,
          name,
          description,
          dueDateTime,
          startDateTime,
          assigneeUserId,
          priority,
          percentComplete,
          etag,
          checklist,
          references,
          previewType,
          ...rest
        } = params

        const baseParams: MicrosoftPlannerBlockParams = {
          ...rest,
          credential,
        }

        // Handle different task ID fields
        const effectiveTaskId = (taskIdForUpdate || taskId || manualTaskId || '').trim()
        const effectiveBucketId = (bucketIdForRead || bucketId || '').trim()

        // List Plans
        if (operation === 'list_plans') {
          return baseParams
        }

        // Read Plan
        if (operation === 'read_plan') {
          if (!planId?.trim()) {
            throw new Error('Plan ID is required to read a plan.')
          }
          return {
            ...baseParams,
            planId: planId.trim(),
          }
        }

        // List Buckets
        if (operation === 'list_buckets') {
          if (!planId?.trim()) {
            throw new Error('Plan ID is required to list buckets.')
          }
          return {
            ...baseParams,
            planId: planId.trim(),
          }
        }

        // Read Bucket
        if (operation === 'read_bucket') {
          if (!effectiveBucketId) {
            throw new Error('Bucket ID is required to read a bucket.')
          }
          return {
            ...baseParams,
            bucketId: effectiveBucketId,
          }
        }

        // Create Bucket
        if (operation === 'create_bucket') {
          if (!planId?.trim()) {
            throw new Error('Plan ID is required to create a bucket.')
          }
          if (!name?.trim()) {
            throw new Error('Bucket name is required to create a bucket.')
          }
          return {
            ...baseParams,
            planId: planId.trim(),
            name: name.trim(),
          }
        }

        // Update Bucket
        if (operation === 'update_bucket') {
          if (!effectiveBucketId) {
            throw new Error('Bucket ID is required to update a bucket.')
          }
          if (!etag?.trim()) {
            throw new Error('ETag is required to update a bucket.')
          }
          const updateBucketParams: MicrosoftPlannerBlockParams = {
            ...baseParams,
            bucketId: effectiveBucketId,
            etag: etag.trim(),
          }
          if (name?.trim()) {
            updateBucketParams.name = name.trim()
          }
          return updateBucketParams
        }

        // Delete Bucket
        if (operation === 'delete_bucket') {
          if (!effectiveBucketId) {
            throw new Error('Bucket ID is required to delete a bucket.')
          }
          if (!etag?.trim()) {
            throw new Error('ETag is required to delete a bucket.')
          }
          return {
            ...baseParams,
            bucketId: effectiveBucketId,
            etag: etag.trim(),
          }
        }

        // Read Task
        if (operation === 'read_task') {
          const readParams: MicrosoftPlannerBlockParams = { ...baseParams }
          const readTaskId = (taskId || manualTaskId || '').trim()

          if (readTaskId) {
            readParams.taskId = readTaskId
          } else if (planId?.trim()) {
            readParams.planId = planId.trim()
          }

          return readParams
        }

        // Create Task
        if (operation === 'create_task') {
          if (!planId?.trim()) {
            throw new Error('Plan ID is required to create a task.')
          }
          if (!title?.trim()) {
            throw new Error('Task title is required to create a task.')
          }

          const createParams: MicrosoftPlannerBlockParams = {
            ...baseParams,
            planId: planId.trim(),
            title: title.trim(),
          }

          if (description?.trim()) {
            createParams.description = description.trim()
          }
          if (dueDateTime?.trim()) {
            createParams.dueDateTime = dueDateTime.trim()
          }
          if (assigneeUserId?.trim()) {
            createParams.assigneeUserId = assigneeUserId.trim()
          }
          if (effectiveBucketId) {
            createParams.bucketId = effectiveBucketId
          }

          return createParams
        }

        // Update Task
        if (operation === 'update_task') {
          if (!effectiveTaskId) {
            throw new Error('Task ID is required to update a task.')
          }
          if (!etag?.trim()) {
            throw new Error('ETag is required to update a task.')
          }

          const updateParams: MicrosoftPlannerBlockParams = {
            ...baseParams,
            taskId: effectiveTaskId,
            etag: etag.trim(),
          }

          if (title?.trim()) {
            updateParams.title = title.trim()
          }
          if (effectiveBucketId) {
            updateParams.bucketId = effectiveBucketId
          }
          if (dueDateTime?.trim()) {
            updateParams.dueDateTime = dueDateTime.trim()
          }
          if (startDateTime?.trim()) {
            updateParams.startDateTime = startDateTime.trim()
          }
          if (assigneeUserId?.trim()) {
            updateParams.assigneeUserId = assigneeUserId.trim()
          }
          if (priority !== undefined) {
            updateParams.priority = Number(priority)
          }
          if (percentComplete !== undefined) {
            updateParams.percentComplete = Number(percentComplete)
          }

          return updateParams
        }

        // Delete Task
        if (operation === 'delete_task') {
          if (!effectiveTaskId) {
            throw new Error('Task ID is required to delete a task.')
          }
          if (!etag?.trim()) {
            throw new Error('ETag is required to delete a task.')
          }
          return {
            ...baseParams,
            taskId: effectiveTaskId,
            etag: etag.trim(),
          }
        }

        // Get Task Details
        if (operation === 'get_task_details') {
          if (!effectiveTaskId) {
            throw new Error('Task ID is required to get task details.')
          }
          return {
            ...baseParams,
            taskId: effectiveTaskId,
          }
        }

        // Update Task Details
        if (operation === 'update_task_details') {
          if (!effectiveTaskId) {
            throw new Error('Task ID is required to update task details.')
          }
          if (!etag?.trim()) {
            throw new Error('ETag is required to update task details.')
          }

          const updateDetailsParams: MicrosoftPlannerBlockParams = {
            ...baseParams,
            taskId: effectiveTaskId,
            etag: etag.trim(),
          }

          if (description?.trim()) {
            updateDetailsParams.description = description.trim()
          }
          if (checklist?.trim()) {
            updateDetailsParams.checklist = checklist.trim()
          }
          if (references?.trim()) {
            updateDetailsParams.references = references.trim()
          }
          if (previewType?.trim()) {
            updateDetailsParams.previewType = previewType.trim()
          }

          return updateDetailsParams
        }

        return baseParams
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    credential: { type: 'string', description: 'Microsoft account credential' },
    groupId: { type: 'string', description: 'Microsoft 365 group ID' },
    planId: { type: 'string', description: 'Plan ID' },
    taskId: { type: 'string', description: 'Task ID' },
    manualTaskId: { type: 'string', description: 'Manual Task ID' },
    taskIdForUpdate: { type: 'string', description: 'Task ID for update operations' },
    bucketId: { type: 'string', description: 'Bucket ID' },
    bucketIdForRead: { type: 'string', description: 'Bucket ID for read operations' },
    title: { type: 'string', description: 'Task title' },
    name: { type: 'string', description: 'Bucket name' },
    description: { type: 'string', description: 'Task or task details description' },
    dueDateTime: { type: 'string', description: 'Due date' },
    startDateTime: { type: 'string', description: 'Start date' },
    assigneeUserId: { type: 'string', description: 'Assignee user ID' },
    priority: { type: 'number', description: 'Task priority (0-10)' },
    percentComplete: { type: 'number', description: 'Task completion percentage (0-100)' },
    etag: { type: 'string', description: 'ETag for update/delete operations' },
    checklist: { type: 'string', description: 'Checklist items as JSON' },
    references: { type: 'string', description: 'References as JSON' },
    previewType: { type: 'string', description: 'Preview type for task details' },
  },
  outputs: {
    message: {
      type: 'string',
      description: 'Success message from the operation',
    },
    task: {
      type: 'json',
      description:
        'The Microsoft Planner task object, including details such as id, title, description, status, due date, and assignees.',
    },
    tasks: {
      type: 'json',
      description: 'Array of Microsoft Planner tasks',
    },
    taskId: {
      type: 'string',
      description: 'ID of the task',
    },
    etag: {
      type: 'string',
      description: 'ETag of the resource - use this for update/delete operations',
    },
    plan: {
      type: 'json',
      description: 'The Microsoft Planner plan object',
    },
    plans: {
      type: 'json',
      description: 'Array of Microsoft Planner plans',
    },
    bucket: {
      type: 'json',
      description: 'The Microsoft Planner bucket object',
    },
    buckets: {
      type: 'json',
      description: 'Array of Microsoft Planner buckets',
    },
    taskDetails: {
      type: 'json',
      description: 'The Microsoft Planner task details including checklist and references',
    },
    deleted: {
      type: 'boolean',
      description: 'Confirmation of deletion',
    },
    metadata: {
      type: 'json',
      description:
        'Additional metadata about the operation, such as timestamps, request status, or other relevant information.',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: microsoft_teams.ts]---
Location: sim-main/apps/sim/blocks/blocks/microsoft_teams.ts

```typescript
import { MicrosoftTeamsIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { MicrosoftTeamsResponse } from '@/tools/microsoft_teams/types'
import { getTrigger } from '@/triggers'

export const MicrosoftTeamsBlock: BlockConfig<MicrosoftTeamsResponse> = {
  type: 'microsoft_teams',
  name: 'Microsoft Teams',
  description: 'Manage messages, reactions, and members in Teams',
  authMode: AuthMode.OAuth,
  longDescription:
    'Integrate Microsoft Teams into the workflow. Read, write, update, and delete chat and channel messages. Reply to messages, add reactions, and list team/channel members. Can be used in trigger mode to trigger a workflow when a message is sent to a chat or channel. To mention users in messages, wrap their name in `<at>` tags: `<at>userName</at>`',
  docsLink: 'https://docs.sim.ai/tools/microsoft_teams',
  category: 'tools',
  triggerAllowed: true,
  bgColor: '#E0E0E0',
  icon: MicrosoftTeamsIcon,
  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Read Chat Messages', id: 'read_chat' },
        { label: 'Write Chat Message', id: 'write_chat' },
        { label: 'Update Chat Message', id: 'update_chat_message' },
        { label: 'Delete Chat Message', id: 'delete_chat_message' },
        { label: 'Read Channel Messages', id: 'read_channel' },
        { label: 'Write Channel Message', id: 'write_channel' },
        { label: 'Update Channel Message', id: 'update_channel_message' },
        { label: 'Delete Channel Message', id: 'delete_channel_message' },
        { label: 'Reply to Channel Message', id: 'reply_to_message' },
        { label: 'Get Message', id: 'get_message' },
        { label: 'Add Reaction', id: 'set_reaction' },
        { label: 'Remove Reaction', id: 'unset_reaction' },
        { label: 'List Team Members', id: 'list_team_members' },
        { label: 'List Channel Members', id: 'list_channel_members' },
      ],
      value: () => 'read_chat',
    },
    {
      id: 'credential',
      title: 'Microsoft Account',
      type: 'oauth-input',
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
      placeholder: 'Select Microsoft account',
      required: true,
    },
    {
      id: 'teamId',
      title: 'Select Team',
      type: 'file-selector',
      canonicalParamId: 'teamId',
      serviceId: 'microsoft-teams',
      requiredScopes: [],
      placeholder: 'Select a team',
      dependsOn: ['credential'],
      mode: 'basic',
      condition: {
        field: 'operation',
        value: [
          'read_channel',
          'write_channel',
          'update_channel_message',
          'delete_channel_message',
          'reply_to_message',
          'list_team_members',
          'list_channel_members',
        ],
      },
    },
    {
      id: 'manualTeamId',
      title: 'Team ID',
      type: 'short-input',
      canonicalParamId: 'teamId',
      placeholder: 'Enter team ID',
      mode: 'advanced',
      condition: {
        field: 'operation',
        value: [
          'read_channel',
          'write_channel',
          'update_channel_message',
          'delete_channel_message',
          'reply_to_message',
          'list_team_members',
          'list_channel_members',
        ],
      },
    },
    {
      id: 'chatId',
      title: 'Select Chat',
      type: 'file-selector',
      canonicalParamId: 'chatId',
      serviceId: 'microsoft-teams',
      requiredScopes: [],
      placeholder: 'Select a chat',
      dependsOn: ['credential'],
      mode: 'basic',
      condition: {
        field: 'operation',
        value: ['read_chat', 'write_chat', 'update_chat_message', 'delete_chat_message'],
      },
    },
    {
      id: 'manualChatId',
      title: 'Chat ID',
      type: 'short-input',
      canonicalParamId: 'chatId',
      placeholder: 'Enter chat ID',
      mode: 'advanced',
      condition: {
        field: 'operation',
        value: ['read_chat', 'write_chat', 'update_chat_message', 'delete_chat_message'],
      },
    },
    {
      id: 'channelId',
      title: 'Select Channel',
      type: 'file-selector',
      canonicalParamId: 'channelId',
      serviceId: 'microsoft-teams',
      requiredScopes: [],
      placeholder: 'Select a channel',
      dependsOn: ['credential', 'teamId'],
      mode: 'basic',
      condition: {
        field: 'operation',
        value: [
          'read_channel',
          'write_channel',
          'update_channel_message',
          'delete_channel_message',
          'reply_to_message',
          'list_channel_members',
        ],
      },
    },
    {
      id: 'manualChannelId',
      title: 'Channel ID',
      type: 'short-input',
      canonicalParamId: 'channelId',
      placeholder: 'Enter channel ID',
      mode: 'advanced',
      condition: {
        field: 'operation',
        value: [
          'read_channel',
          'write_channel',
          'update_channel_message',
          'delete_channel_message',
          'reply_to_message',
          'list_channel_members',
        ],
      },
    },
    {
      id: 'messageId',
      title: 'Message ID',
      type: 'short-input',
      placeholder: 'Enter message ID',
      condition: {
        field: 'operation',
        value: [
          'update_chat_message',
          'delete_chat_message',
          'update_channel_message',
          'delete_channel_message',
          'reply_to_message',
          'get_message',
          'set_reaction',
          'unset_reaction',
        ],
      },
      required: true,
    },
    {
      id: 'content',
      title: 'Message',
      type: 'long-input',
      placeholder: 'Enter message content',
      condition: {
        field: 'operation',
        value: [
          'write_chat',
          'write_channel',
          'update_chat_message',
          'update_channel_message',
          'reply_to_message',
        ],
      },
      required: true,
    },
    {
      id: 'reactionType',
      title: 'Reaction',
      type: 'short-input',
      placeholder: 'Enter emoji (e.g., ❤️, 👍, 😊)',
      condition: {
        field: 'operation',
        value: ['set_reaction', 'unset_reaction'],
      },
      required: true,
    },
    {
      id: 'includeAttachments',
      title: 'Include Attachments',
      type: 'switch',
      condition: { field: 'operation', value: ['read_chat', 'read_channel'] },
    },
    // File upload (basic mode)
    {
      id: 'attachmentFiles',
      title: 'Attachments',
      type: 'file-upload',
      canonicalParamId: 'files',
      placeholder: 'Upload files to attach',
      condition: { field: 'operation', value: ['write_chat', 'write_channel'] },
      mode: 'basic',
      multiple: true,
      required: false,
    },
    // Variable reference (advanced mode)
    {
      id: 'files',
      title: 'File Attachments',
      type: 'short-input',
      canonicalParamId: 'files',
      placeholder: 'Reference files from previous blocks',
      condition: { field: 'operation', value: ['write_chat', 'write_channel'] },
      mode: 'advanced',
      required: false,
    },
    ...getTrigger('microsoftteams_webhook').subBlocks,
    ...getTrigger('microsoftteams_chat_subscription').subBlocks,
  ],
  tools: {
    access: [
      'microsoft_teams_read_chat',
      'microsoft_teams_write_chat',
      'microsoft_teams_read_channel',
      'microsoft_teams_write_channel',
      'microsoft_teams_update_chat_message',
      'microsoft_teams_update_channel_message',
      'microsoft_teams_delete_chat_message',
      'microsoft_teams_delete_channel_message',
      'microsoft_teams_reply_to_message',
      'microsoft_teams_get_message',
      'microsoft_teams_set_reaction',
      'microsoft_teams_unset_reaction',
      'microsoft_teams_list_team_members',
      'microsoft_teams_list_channel_members',
    ],
    config: {
      tool: (params) => {
        switch (params.operation) {
          case 'read_chat':
            return 'microsoft_teams_read_chat'
          case 'write_chat':
            return 'microsoft_teams_write_chat'
          case 'read_channel':
            return 'microsoft_teams_read_channel'
          case 'write_channel':
            return 'microsoft_teams_write_channel'
          case 'update_chat_message':
            return 'microsoft_teams_update_chat_message'
          case 'update_channel_message':
            return 'microsoft_teams_update_channel_message'
          case 'delete_chat_message':
            return 'microsoft_teams_delete_chat_message'
          case 'delete_channel_message':
            return 'microsoft_teams_delete_channel_message'
          case 'reply_to_message':
            return 'microsoft_teams_reply_to_message'
          case 'get_message':
            return 'microsoft_teams_get_message'
          case 'set_reaction':
            return 'microsoft_teams_set_reaction'
          case 'unset_reaction':
            return 'microsoft_teams_unset_reaction'
          case 'list_team_members':
            return 'microsoft_teams_list_team_members'
          case 'list_channel_members':
            return 'microsoft_teams_list_channel_members'
          default:
            return 'microsoft_teams_read_chat'
        }
      },
      params: (params) => {
        const {
          credential,
          operation,
          teamId,
          manualTeamId,
          chatId,
          manualChatId,
          channelId,
          manualChannelId,
          attachmentFiles,
          files,
          messageId,
          reactionType,
          includeAttachments,
          ...rest
        } = params

        const effectiveTeamId = (teamId || manualTeamId || '').trim()
        const effectiveChatId = (chatId || manualChatId || '').trim()
        const effectiveChannelId = (channelId || manualChannelId || '').trim()

        const baseParams: Record<string, any> = {
          ...rest,
          credential,
        }

        if ((operation === 'read_chat' || operation === 'read_channel') && includeAttachments) {
          baseParams.includeAttachments = true
        }

        // Add files if provided
        const fileParam = attachmentFiles || files
        if (fileParam && (operation === 'write_chat' || operation === 'write_channel')) {
          baseParams.files = fileParam
        }

        // Add messageId if provided
        if (messageId) {
          baseParams.messageId = messageId
        }

        // Add reactionType if provided
        if (reactionType) {
          baseParams.reactionType = reactionType
        }

        // Chat operations
        if (
          operation === 'read_chat' ||
          operation === 'write_chat' ||
          operation === 'update_chat_message' ||
          operation === 'delete_chat_message'
        ) {
          if (!effectiveChatId) {
            throw new Error('Chat ID is required. Please select a chat or enter a chat ID.')
          }
          return { ...baseParams, chatId: effectiveChatId }
        }

        // Channel operations
        if (
          operation === 'read_channel' ||
          operation === 'write_channel' ||
          operation === 'update_channel_message' ||
          operation === 'delete_channel_message' ||
          operation === 'reply_to_message'
        ) {
          if (!effectiveTeamId) {
            throw new Error('Team ID is required for channel operations.')
          }
          if (!effectiveChannelId) {
            throw new Error('Channel ID is required for channel operations.')
          }
          return { ...baseParams, teamId: effectiveTeamId, channelId: effectiveChannelId }
        }

        // Team member operations
        if (operation === 'list_team_members') {
          if (!effectiveTeamId) {
            throw new Error('Team ID is required for team member operations.')
          }
          return { ...baseParams, teamId: effectiveTeamId }
        }

        // Channel member operations
        if (operation === 'list_channel_members') {
          if (!effectiveTeamId) {
            throw new Error('Team ID is required for channel member operations.')
          }
          if (!effectiveChannelId) {
            throw new Error('Channel ID is required for channel member operations.')
          }
          return { ...baseParams, teamId: effectiveTeamId, channelId: effectiveChannelId }
        }

        // Operations that work with either chat or channel (get_message, reactions)
        // These tools handle the routing internally based on what IDs are provided
        if (
          operation === 'get_message' ||
          operation === 'set_reaction' ||
          operation === 'unset_reaction'
        ) {
          if (effectiveChatId) {
            return { ...baseParams, chatId: effectiveChatId }
          }
          if (effectiveTeamId && effectiveChannelId) {
            return { ...baseParams, teamId: effectiveTeamId, channelId: effectiveChannelId }
          }
          throw new Error(
            'Either Chat ID or both Team ID and Channel ID are required for this operation.'
          )
        }

        return baseParams
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    credential: { type: 'string', description: 'Microsoft Teams access token' },
    messageId: {
      type: 'string',
      description: 'Message identifier for update/delete/reply/reaction operations',
    },
    chatId: { type: 'string', description: 'Chat identifier' },
    manualChatId: { type: 'string', description: 'Manual chat identifier' },
    channelId: { type: 'string', description: 'Channel identifier' },
    manualChannelId: { type: 'string', description: 'Manual channel identifier' },
    teamId: { type: 'string', description: 'Team identifier' },
    manualTeamId: { type: 'string', description: 'Manual team identifier' },
    content: {
      type: 'string',
      description: 'Message content. Mention users with <at>userName</at>',
    },
    reactionType: { type: 'string', description: 'Emoji reaction (e.g., ❤️, 👍, 😊)' },
    includeAttachments: {
      type: 'boolean',
      description: 'Download and include message attachments',
    },
    attachmentFiles: { type: 'json', description: 'Files to attach (UI upload)' },
    files: { type: 'array', description: 'Files to attach (UserFile array)' },
  },
  outputs: {
    content: { type: 'string', description: 'Formatted message content from chat/channel' },
    metadata: { type: 'json', description: 'Message metadata with full details' },
    messageCount: { type: 'number', description: 'Number of messages retrieved' },
    messages: { type: 'json', description: 'Array of message objects' },
    totalAttachments: { type: 'number', description: 'Total number of attachments' },
    attachmentTypes: { type: 'json', description: 'Array of attachment content types' },
    attachments: { type: 'array', description: 'Downloaded message attachments' },
    updatedContent: {
      type: 'boolean',
      description: 'Whether content was successfully updated/sent',
    },
    deleted: { type: 'boolean', description: 'Whether message was successfully deleted' },
    messageId: { type: 'string', description: 'ID of the created/sent/deleted message' },
    createdTime: { type: 'string', description: 'Timestamp when message was created' },
    url: { type: 'string', description: 'Web URL to the message' },
    sender: { type: 'string', description: 'Message sender display name' },
    messageTimestamp: { type: 'string', description: 'Individual message timestamp' },
    messageType: {
      type: 'string',
      description: 'Type of message (message, systemEventMessage, etc.)',
    },
    reactionType: { type: 'string', description: 'Emoji reaction that was added/removed' },
    success: { type: 'boolean', description: 'Whether the operation was successful' },
    members: { type: 'json', description: 'Array of team/channel member objects' },
    memberCount: { type: 'number', description: 'Total number of members' },
    type: { type: 'string', description: 'Type of Teams message' },
    id: { type: 'string', description: 'Unique message identifier' },
    timestamp: { type: 'string', description: 'Message timestamp' },
    localTimestamp: { type: 'string', description: 'Local timestamp of the message' },
    serviceUrl: { type: 'string', description: 'Microsoft Teams service URL' },
    channelId: { type: 'string', description: 'Teams channel ID where the event occurred' },
    from_id: { type: 'string', description: 'User ID who sent the message' },
    from_name: { type: 'string', description: 'Username who sent the message' },
    conversation_id: { type: 'string', description: 'Conversation/thread ID' },
    text: { type: 'string', description: 'Message text content' },
  },
  triggers: {
    enabled: true,
    available: ['microsoftteams_webhook'],
  },
}
```

--------------------------------------------------------------------------------

````
