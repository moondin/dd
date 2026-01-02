---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 719
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 719 of 933)

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

---[FILE: delete_bucket.ts]---
Location: sim-main/apps/sim/tools/microsoft_planner/delete_bucket.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  MicrosoftPlannerDeleteBucketResponse,
  MicrosoftPlannerToolParams,
} from '@/tools/microsoft_planner/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('MicrosoftPlannerDeleteBucket')

export const deleteBucketTool: ToolConfig<
  MicrosoftPlannerToolParams,
  MicrosoftPlannerDeleteBucketResponse
> = {
  id: 'microsoft_planner_delete_bucket',
  name: 'Delete Microsoft Planner Bucket',
  description: 'Delete a bucket from Microsoft Planner',
  version: '1.0',

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
    bucketId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the bucket to delete',
    },
    etag: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ETag value from the bucket to delete (If-Match header)',
    },
  },

  request: {
    url: (params) => {
      if (!params.bucketId) {
        throw new Error('Bucket ID is required')
      }
      return `https://graph.microsoft.com/v1.0/planner/buckets/${params.bucketId}`
    },
    method: 'DELETE',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }
      if (!params.etag) {
        throw new Error('ETag is required for delete operations')
      }

      let cleanedEtag = params.etag.trim()

      while (cleanedEtag.startsWith('"') && cleanedEtag.endsWith('"')) {
        cleanedEtag = cleanedEtag.slice(1, -1)
        logger.info('Removed surrounding quotes:', cleanedEtag)
      }

      if (cleanedEtag.includes('\\"')) {
        cleanedEtag = cleanedEtag.replace(/\\"/g, '"')
        logger.info('Cleaned escaped quotes from etag')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
        'If-Match': cleanedEtag,
      }
    },
  },

  transformResponse: async (response: Response) => {
    logger.info('Bucket deleted successfully')

    const result: MicrosoftPlannerDeleteBucketResponse = {
      success: true,
      output: {
        deleted: true,
        metadata: {},
      },
    }

    return result
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the bucket was deleted successfully' },
    deleted: { type: 'boolean', description: 'Confirmation of deletion' },
    metadata: { type: 'object', description: 'Additional metadata' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_task.ts]---
Location: sim-main/apps/sim/tools/microsoft_planner/delete_task.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  MicrosoftPlannerDeleteTaskResponse,
  MicrosoftPlannerToolParams,
} from '@/tools/microsoft_planner/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('MicrosoftPlannerDeleteTask')

export const deleteTaskTool: ToolConfig<
  MicrosoftPlannerToolParams,
  MicrosoftPlannerDeleteTaskResponse
> = {
  id: 'microsoft_planner_delete_task',
  name: 'Delete Microsoft Planner Task',
  description: 'Delete a task from Microsoft Planner',
  version: '1.0',

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
      description: 'The ID of the task to delete',
    },
    etag: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ETag value from the task to delete (If-Match header)',
    },
  },

  request: {
    url: (params) => {
      if (!params.taskId) {
        throw new Error('Task ID is required')
      }
      return `https://graph.microsoft.com/v1.0/planner/tasks/${params.taskId}`
    },
    method: 'DELETE',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }
      if (!params.etag) {
        throw new Error('ETag is required for delete operations')
      }

      let cleanedEtag = params.etag.trim()

      while (cleanedEtag.startsWith('"') && cleanedEtag.endsWith('"')) {
        cleanedEtag = cleanedEtag.slice(1, -1)
        logger.info('Removed surrounding quotes:', cleanedEtag)
      }

      if (cleanedEtag.includes('\\"')) {
        cleanedEtag = cleanedEtag.replace(/\\"/g, '"')
        logger.info('Cleaned escaped quotes from etag')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
        'If-Match': cleanedEtag,
      }
    },
  },

  transformResponse: async (response: Response) => {
    logger.info('Task deleted successfully')

    const result: MicrosoftPlannerDeleteTaskResponse = {
      success: true,
      output: {
        deleted: true,
        metadata: {},
      },
    }

    return result
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the task was deleted successfully' },
    deleted: { type: 'boolean', description: 'Confirmation of deletion' },
    metadata: { type: 'object', description: 'Additional metadata' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_task_details.ts]---
Location: sim-main/apps/sim/tools/microsoft_planner/get_task_details.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  MicrosoftPlannerGetTaskDetailsResponse,
  MicrosoftPlannerToolParams,
} from '@/tools/microsoft_planner/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('MicrosoftPlannerGetTaskDetails')

export const getTaskDetailsTool: ToolConfig<
  MicrosoftPlannerToolParams,
  MicrosoftPlannerGetTaskDetailsResponse
> = {
  id: 'microsoft_planner_get_task_details',
  name: 'Get Microsoft Planner Task Details',
  description: 'Get detailed information about a task including checklist and references',
  version: '1.0',

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
  },

  request: {
    url: (params) => {
      if (!params.taskId) {
        throw new Error('Task ID is required')
      }
      return `https://graph.microsoft.com/v1.0/planner/tasks/${params.taskId}/details`
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

  transformResponse: async (response: Response) => {
    const taskDetails = await response.json()
    logger.info('Task details retrieved:', taskDetails)

    const etag = taskDetails['@odata.etag'] || ''

    const result: MicrosoftPlannerGetTaskDetailsResponse = {
      success: true,
      output: {
        taskDetails,
        etag,
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
      description: 'Whether the task details were retrieved successfully',
    },
    taskDetails: {
      type: 'object',
      description: 'The task details including description, checklist, and references',
    },
    etag: {
      type: 'string',
      description: 'The ETag value for this task details - use this for update operations',
    },
    metadata: { type: 'object', description: 'Metadata including taskId' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/microsoft_planner/index.ts

```typescript
import { createBucketTool } from '@/tools/microsoft_planner/create_bucket'
import { createTaskTool } from '@/tools/microsoft_planner/create_task'
import { deleteBucketTool } from '@/tools/microsoft_planner/delete_bucket'
import { deleteTaskTool } from '@/tools/microsoft_planner/delete_task'
import { getTaskDetailsTool } from '@/tools/microsoft_planner/get_task_details'
import { listBucketsTool } from '@/tools/microsoft_planner/list_buckets'
import { listPlansTool } from '@/tools/microsoft_planner/list_plans'
import { readBucketTool } from '@/tools/microsoft_planner/read_bucket'
import { readPlanTool } from '@/tools/microsoft_planner/read_plan'
import { readTaskTool } from '@/tools/microsoft_planner/read_task'
import { updateBucketTool } from '@/tools/microsoft_planner/update_bucket'
import { updateTaskTool } from '@/tools/microsoft_planner/update_task'
import { updateTaskDetailsTool } from '@/tools/microsoft_planner/update_task_details'

export const microsoftPlannerCreateTaskTool = createTaskTool
export const microsoftPlannerReadTaskTool = readTaskTool
export const microsoftPlannerUpdateTaskTool = updateTaskTool
export const microsoftPlannerDeleteTaskTool = deleteTaskTool
export const microsoftPlannerListPlansTool = listPlansTool
export const microsoftPlannerReadPlanTool = readPlanTool
export const microsoftPlannerListBucketsTool = listBucketsTool
export const microsoftPlannerReadBucketTool = readBucketTool
export const microsoftPlannerCreateBucketTool = createBucketTool
export const microsoftPlannerUpdateBucketTool = updateBucketTool
export const microsoftPlannerDeleteBucketTool = deleteBucketTool
export const microsoftPlannerGetTaskDetailsTool = getTaskDetailsTool
export const microsoftPlannerUpdateTaskDetailsTool = updateTaskDetailsTool
```

--------------------------------------------------------------------------------

---[FILE: list_buckets.ts]---
Location: sim-main/apps/sim/tools/microsoft_planner/list_buckets.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  MicrosoftPlannerListBucketsResponse,
  MicrosoftPlannerToolParams,
} from '@/tools/microsoft_planner/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('MicrosoftPlannerListBuckets')

export const listBucketsTool: ToolConfig<
  MicrosoftPlannerToolParams,
  MicrosoftPlannerListBucketsResponse
> = {
  id: 'microsoft_planner_list_buckets',
  name: 'List Microsoft Planner Buckets',
  description: 'List all buckets in a Microsoft Planner plan',
  version: '1.0',

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
    planId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the plan',
    },
  },

  request: {
    url: (params) => {
      if (!params.planId) {
        throw new Error('Plan ID is required')
      }
      return `https://graph.microsoft.com/v1.0/planner/plans/${params.planId}/buckets`
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

  transformResponse: async (response: Response) => {
    const data = await response.json()
    logger.info('List buckets response:', data)

    const buckets = data.value || []

    const result: MicrosoftPlannerListBucketsResponse = {
      success: true,
      output: {
        buckets,
        metadata: {
          planId: buckets.length > 0 ? buckets[0].planId : undefined,
          count: buckets.length,
        },
      },
    }

    return result
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether buckets were retrieved successfully' },
    buckets: { type: 'array', description: 'Array of bucket objects' },
    metadata: { type: 'object', description: 'Metadata including planId and count' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_plans.ts]---
Location: sim-main/apps/sim/tools/microsoft_planner/list_plans.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  MicrosoftPlannerListPlansResponse,
  MicrosoftPlannerToolParams,
} from '@/tools/microsoft_planner/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('MicrosoftPlannerListPlans')

export const listPlansTool: ToolConfig<
  MicrosoftPlannerToolParams,
  MicrosoftPlannerListPlansResponse
> = {
  id: 'microsoft_planner_list_plans',
  name: 'List Microsoft Planner Plans',
  description: 'List all plans shared with the current user',
  version: '1.0',

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
  },

  request: {
    url: () => {
      return 'https://graph.microsoft.com/v1.0/me/planner/plans'
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

  transformResponse: async (response: Response) => {
    const data = await response.json()
    logger.info('List plans response:', data)

    const plans = data.value || []

    const result: MicrosoftPlannerListPlansResponse = {
      success: true,
      output: {
        plans,
        metadata: {
          count: plans.length,
          userId: 'me',
        },
      },
    }

    return result
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether plans were retrieved successfully' },
    plans: { type: 'array', description: 'Array of plan objects shared with the current user' },
    metadata: { type: 'object', description: 'Metadata including userId and count' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: read_bucket.ts]---
Location: sim-main/apps/sim/tools/microsoft_planner/read_bucket.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  MicrosoftPlannerReadBucketResponse,
  MicrosoftPlannerToolParams,
} from '@/tools/microsoft_planner/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('MicrosoftPlannerReadBucket')

export const readBucketTool: ToolConfig<
  MicrosoftPlannerToolParams,
  MicrosoftPlannerReadBucketResponse
> = {
  id: 'microsoft_planner_read_bucket',
  name: 'Read Microsoft Planner Bucket',
  description: 'Get details of a specific bucket',
  version: '1.0',

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
    bucketId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the bucket to retrieve',
    },
  },

  request: {
    url: (params) => {
      if (!params.bucketId) {
        throw new Error('Bucket ID is required')
      }
      return `https://graph.microsoft.com/v1.0/planner/buckets/${params.bucketId}`
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

  transformResponse: async (response: Response) => {
    const bucket = await response.json()
    logger.info('Read bucket response:', bucket)

    const result: MicrosoftPlannerReadBucketResponse = {
      success: true,
      output: {
        bucket,
        metadata: {
          bucketId: bucket.id,
          planId: bucket.planId,
        },
      },
    }

    return result
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the bucket was retrieved successfully' },
    bucket: { type: 'object', description: 'The bucket object with all properties' },
    metadata: { type: 'object', description: 'Metadata including bucketId and planId' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: read_plan.ts]---
Location: sim-main/apps/sim/tools/microsoft_planner/read_plan.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  MicrosoftPlannerReadPlanResponse,
  MicrosoftPlannerToolParams,
} from '@/tools/microsoft_planner/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('MicrosoftPlannerReadPlan')

export const readPlanTool: ToolConfig<
  MicrosoftPlannerToolParams,
  MicrosoftPlannerReadPlanResponse
> = {
  id: 'microsoft_planner_read_plan',
  name: 'Read Microsoft Planner Plan',
  description: 'Get details of a specific Microsoft Planner plan',
  version: '1.0',

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
    planId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the plan to retrieve',
    },
  },

  request: {
    url: (params) => {
      if (!params.planId) {
        throw new Error('Plan ID is required')
      }
      return `https://graph.microsoft.com/v1.0/planner/plans/${params.planId}`
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

  transformResponse: async (response: Response) => {
    const plan = await response.json()
    logger.info('Read plan response:', plan)

    const result: MicrosoftPlannerReadPlanResponse = {
      success: true,
      output: {
        plan,
        metadata: {
          planId: plan.id,
          planUrl: `https://graph.microsoft.com/v1.0/planner/plans/${plan.id}`,
        },
      },
    }

    return result
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the plan was retrieved successfully' },
    plan: { type: 'object', description: 'The plan object with all properties' },
    metadata: { type: 'object', description: 'Metadata including planId and planUrl' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: read_task.ts]---
Location: sim-main/apps/sim/tools/microsoft_planner/read_task.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  MicrosoftPlannerReadResponse,
  MicrosoftPlannerToolParams,
} from '@/tools/microsoft_planner/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('MicrosoftPlannerReadTask')

export const readTaskTool: ToolConfig<MicrosoftPlannerToolParams, MicrosoftPlannerReadResponse> = {
  id: 'microsoft_planner_read_task',
  name: 'Read Microsoft Planner Tasks',
  description:
    'Read tasks from Microsoft Planner - get all user tasks or all tasks from a specific plan',
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
    planId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The ID of the plan to get tasks from (if not provided, gets all user tasks)',
    },
    taskId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The ID of the task to get',
    },
  },

  request: {
    url: (params) => {
      let finalUrl: string

      // If taskId is provided, get specific task
      if (params.taskId) {
        // Validate and clean task ID
        const cleanTaskId = params.taskId.trim()
        if (!cleanTaskId) {
          throw new Error('Task ID cannot be empty')
        }

        // Log the task ID for debugging
        logger.info('Fetching task with ID:', cleanTaskId)
        logger.info('Task ID length:', cleanTaskId.length)
        logger.info('Task ID has special chars:', /[^a-zA-Z0-9_-]/.test(cleanTaskId))

        finalUrl = `https://graph.microsoft.com/v1.0/planner/tasks/${cleanTaskId}`
      }
      // Else if planId is provided, get tasks from plan
      else if (params.planId) {
        const cleanPlanId = params.planId.trim()
        if (!cleanPlanId) {
          throw new Error('Plan ID cannot be empty')
        }
        logger.info('Fetching tasks for plan:', cleanPlanId)
        finalUrl = `https://graph.microsoft.com/v1.0/planner/plans/${cleanPlanId}/tasks`
      }
      // Else get all user tasks
      else {
        logger.info('Fetching all user tasks')
        finalUrl = 'https://graph.microsoft.com/v1.0/me/planner/tasks'
      }

      logger.info('Microsoft Planner URL:', finalUrl)
      return finalUrl
    },
    method: 'GET',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }

      logger.info('Access token present:', !!params.accessToken)
      logger.info('Access token length:', params.accessToken.length)

      return {
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
      }
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()
    logger.info('Raw response data:', data)

    const rawTasks = data.value ? data.value : Array.isArray(data) ? data : [data]

    const tasks = rawTasks.map((task: any) => {
      let etagValue = task['@odata.etag']
      logger.info('ETag value extracted (raw):', {
        raw: etagValue,
        type: typeof etagValue,
        length: etagValue?.length,
      })

      if (etagValue && typeof etagValue === 'string') {
        if (etagValue.includes('\\"')) {
          etagValue = etagValue.replace(/\\"/g, '"')
          logger.info('Unescaped etag quotes:', { cleaned: etagValue })
        }
      }

      return {
        id: task.id,
        title: task.title,
        planId: task.planId,
        bucketId: task.bucketId,
        percentComplete: task.percentComplete,
        priority: task.priority,
        dueDateTime: task.dueDateTime,
        createdDateTime: task.createdDateTime,
        completedDateTime: task.completedDateTime,
        hasDescription: task.hasDescription,
        assignments: task.assignments ? Object.keys(task.assignments) : [],
        etag: etagValue,
      }
    })

    const result: MicrosoftPlannerReadResponse = {
      success: true,
      output: {
        tasks,
        metadata: {
          planId: tasks.length > 0 ? tasks[0].planId : '',
          userId: data.value ? undefined : 'me',
          planUrl:
            tasks.length > 0
              ? `https://graph.microsoft.com/v1.0/planner/plans/${tasks[0].planId}`
              : undefined,
        },
      },
    }

    logger.info('Successfully transformed response with', tasks.length, 'tasks')
    return result
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether tasks were retrieved successfully' },
    tasks: { type: 'array', description: 'Array of task objects with filtered properties' },
    metadata: { type: 'object', description: 'Metadata including planId, userId, and planUrl' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/microsoft_planner/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface PlannerIdentitySet {
  user?: {
    displayName?: string
    id?: string
  }
  application?: {
    displayName?: string
    id?: string
  }
}

export interface PlannerAssignment {
  '@odata.type': string
  assignedDateTime?: string
  orderHint?: string
  assignedBy?: PlannerIdentitySet
}

export interface PlannerReference {
  alias?: string
  lastModifiedBy?: PlannerIdentitySet
  lastModifiedDateTime?: string
  previewPriority?: string
  type?: string
}

export interface PlannerChecklistItem {
  '@odata.type': string
  isChecked?: boolean
  title?: string
  orderHint?: string
  lastModifiedBy?: PlannerIdentitySet
  lastModifiedDateTime?: string
}

export interface PlannerContainer {
  containerId?: string
  type?: string
  url?: string
}

export interface PlannerTask {
  id?: string
  planId: string
  title: string
  orderHint?: string
  assigneePriority?: string
  percentComplete?: number
  startDateTime?: string
  createdDateTime?: string
  dueDateTime?: string
  hasDescription?: boolean
  previewType?: string
  completedDateTime?: string
  completedBy?: PlannerIdentitySet
  referenceCount?: number
  checklistItemCount?: number
  activeChecklistItemCount?: number
  conversationThreadId?: string
  priority?: number
  assignments?: Record<string, PlannerAssignment>
  bucketId?: string
  details?: {
    description?: string
    references?: Record<string, PlannerReference>
    checklist?: Record<string, PlannerChecklistItem>
  }
}

export interface PlannerBucket {
  id: string
  name: string
  planId: string
  orderHint?: string
  '@odata.etag'?: string
}

export interface PlannerPlan {
  id: string
  title: string
  owner?: string
  createdDateTime?: string
  container?: PlannerContainer
  '@odata.etag'?: string
}

export interface PlannerTaskDetails {
  id: string
  description?: string
  previewType?: string
  references?: Record<string, PlannerReference>
  checklist?: Record<string, PlannerChecklistItem>
  '@odata.etag'?: string
}

export interface MicrosoftPlannerMetadata {
  planId?: string
  taskId?: string
  userId?: string
  planUrl?: string
  taskUrl?: string
  bucketId?: string
  groupId?: string
  count?: number
}

export interface MicrosoftPlannerReadResponse extends ToolResponse {
  output: {
    tasks?: PlannerTask[]
    task?: PlannerTask
    plan?: PlannerPlan
    metadata: MicrosoftPlannerMetadata
  }
}

export interface MicrosoftPlannerCreateResponse extends ToolResponse {
  output: {
    task: PlannerTask
    metadata: MicrosoftPlannerMetadata
  }
}

export interface MicrosoftPlannerUpdateTaskResponse extends ToolResponse {
  output: {
    message: string
    task: PlannerTask
    taskId: string
    etag: string
    metadata: MicrosoftPlannerMetadata
  }
}

export interface MicrosoftPlannerDeleteTaskResponse extends ToolResponse {
  output: {
    deleted: boolean
    metadata: MicrosoftPlannerMetadata
  }
}

export interface MicrosoftPlannerListPlansResponse extends ToolResponse {
  output: {
    plans: PlannerPlan[]
    metadata: MicrosoftPlannerMetadata
  }
}

export interface MicrosoftPlannerReadPlanResponse extends ToolResponse {
  output: {
    plan: PlannerPlan
    metadata: MicrosoftPlannerMetadata
  }
}

export interface MicrosoftPlannerListBucketsResponse extends ToolResponse {
  output: {
    buckets: PlannerBucket[]
    metadata: MicrosoftPlannerMetadata
  }
}

export interface MicrosoftPlannerReadBucketResponse extends ToolResponse {
  output: {
    bucket: PlannerBucket
    metadata: MicrosoftPlannerMetadata
  }
}

export interface MicrosoftPlannerCreateBucketResponse extends ToolResponse {
  output: {
    bucket: PlannerBucket
    metadata: MicrosoftPlannerMetadata
  }
}

export interface MicrosoftPlannerUpdateBucketResponse extends ToolResponse {
  output: {
    bucket: PlannerBucket
    metadata: MicrosoftPlannerMetadata
  }
}

export interface MicrosoftPlannerDeleteBucketResponse extends ToolResponse {
  output: {
    deleted: boolean
    metadata: MicrosoftPlannerMetadata
  }
}

export interface MicrosoftPlannerGetTaskDetailsResponse extends ToolResponse {
  output: {
    taskDetails: PlannerTaskDetails
    etag: string
    metadata: MicrosoftPlannerMetadata
  }
}

export interface MicrosoftPlannerUpdateTaskDetailsResponse extends ToolResponse {
  output: {
    taskDetails: PlannerTaskDetails
    metadata: MicrosoftPlannerMetadata
  }
}

export interface MicrosoftPlannerToolParams {
  accessToken: string
  planId?: string
  taskId?: string
  title?: string
  description?: string
  dueDateTime?: string
  startDateTime?: string
  assigneeUserId?: string
  bucketId?: string
  priority?: number
  percentComplete?: number
  groupId?: string
  name?: string
  etag?: string
  checklist?: Record<string, any>
  references?: Record<string, any>
  previewType?: string
}

export type MicrosoftPlannerResponse =
  | MicrosoftPlannerReadResponse
  | MicrosoftPlannerCreateResponse
  | MicrosoftPlannerUpdateTaskResponse
  | MicrosoftPlannerDeleteTaskResponse
  | MicrosoftPlannerListPlansResponse
  | MicrosoftPlannerReadPlanResponse
  | MicrosoftPlannerListBucketsResponse
  | MicrosoftPlannerReadBucketResponse
  | MicrosoftPlannerCreateBucketResponse
  | MicrosoftPlannerUpdateBucketResponse
  | MicrosoftPlannerDeleteBucketResponse
  | MicrosoftPlannerGetTaskDetailsResponse
  | MicrosoftPlannerUpdateTaskDetailsResponse
```

--------------------------------------------------------------------------------

---[FILE: update_bucket.ts]---
Location: sim-main/apps/sim/tools/microsoft_planner/update_bucket.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  MicrosoftPlannerToolParams,
  MicrosoftPlannerUpdateBucketResponse,
} from '@/tools/microsoft_planner/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('MicrosoftPlannerUpdateBucket')

export const updateBucketTool: ToolConfig<
  MicrosoftPlannerToolParams,
  MicrosoftPlannerUpdateBucketResponse
> = {
  id: 'microsoft_planner_update_bucket',
  name: 'Update Microsoft Planner Bucket',
  description: 'Update a bucket in Microsoft Planner',
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
    bucketId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the bucket to update',
    },
    name: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The new name of the bucket',
    },
    etag: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ETag value from the bucket to update (If-Match header)',
    },
  },

  request: {
    url: (params) => {
      if (!params.bucketId) {
        throw new Error('Bucket ID is required')
      }
      return `https://graph.microsoft.com/v1.0/planner/buckets/${params.bucketId}`
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

      while (cleanedEtag.startsWith('"') && cleanedEtag.endsWith('"')) {
        cleanedEtag = cleanedEtag.slice(1, -1)
        logger.info('Removed surrounding quotes:', cleanedEtag)
      }

      if (cleanedEtag.includes('\\"')) {
        cleanedEtag = cleanedEtag.replace(/\\"/g, '"')
        logger.info('Cleaned escaped quotes from etag')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
        'If-Match': cleanedEtag,
      }
    },
    body: (params) => {
      const body: Record<string, any> = {}

      if (params.name) {
        body.name = params.name
      }

      if (Object.keys(body).length === 0) {
        throw new Error('At least one field must be provided to update')
      }

      logger.info('Updating bucket with body:', body)
      return body
    },
  },

  transformResponse: async (response: Response) => {
    const bucket = await response.json()
    logger.info('Updated bucket:', bucket)

    const result: MicrosoftPlannerUpdateBucketResponse = {
      success: true,
      output: {
        bucket,
        metadata: {
          bucketId: bucket.id,
          planId: bucket.planId,
        },
      },
    }

    return result
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the bucket was updated successfully' },
    bucket: { type: 'object', description: 'The updated bucket object with all properties' },
    metadata: { type: 'object', description: 'Metadata including bucketId and planId' },
  },
}
```

--------------------------------------------------------------------------------

````
