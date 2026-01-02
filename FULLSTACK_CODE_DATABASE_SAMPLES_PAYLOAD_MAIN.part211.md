---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 211
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 211 of 695)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - payload-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/payload-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: index.ts]---
Location: payload-main/packages/payload/src/queues/config/types/index.ts

```typescript
import type { CollectionConfig, Job } from '../../../index.js'
import type { Payload, PayloadRequest, Sort } from '../../../types/index.js'
import type { RunJobsSilent } from '../../localAPI.js'
import type { RunJobsArgs } from '../../operations/runJobs/index.js'
import type { JobStats } from '../global.js'
import type { TaskConfig } from './taskTypes.js'
import type { WorkflowConfig } from './workflowTypes.js'

export type AutorunCronConfig = {
  /**
   * If you want to autoRUn jobs from all queues, set this to true.
   * If you set this to true, the `queue` property will be ignored.
   *
   * @default false
   */
  allQueues?: boolean
  /**
   * The cron schedule for the job.
   * @default '* * * * *' (every minute).
   *
   * @example
   *     ┌───────────── (optional) second (0 - 59)
   *     │ ┌───────────── minute (0 - 59)
   *     │ │ ┌───────────── hour (0 - 23)
   *     │ │ │ ┌───────────── day of the month (1 - 31)
   *     │ │ │ │ ┌───────────── month (1 - 12)
   *     │ │ │ │ │ ┌───────────── day of the week (0 - 6) (Sunday to Saturday)
   *     │ │ │ │ │ │
   *     │ │ │ │ │ │
   *  - '* 0 * * * *' every hour at minute 0
   *  - '* 0 0 * * *' daily at midnight
   *  - '* 0 0 * * 0' weekly at midnight on Sundays
   *  - '* 0 0 1 * *' monthly at midnight on the 1st day of the month
   *  - '* 0/5 * * * *' every 5 minutes
   *  - '* * * * * *' every second
   */
  cron?: string
  /**
   * By default, the autorun will attempt to schedule jobs for tasks and workflows that have a `schedule` property, given
   * the queue name is the same.
   *
   * Set this to `true` to disable the scheduling of jobs automatically.
   *
   * @default false
   */
  disableScheduling?: boolean
  /**
   * The limit for the job. This can be overridden by the user. Defaults to 10.
   */
  limit?: number
  /**
   * The queue name for the job.
   *
   * @default 'default'
   */
  queue?: string
  /**
   * If set to true, the job system will not log any output to the console (for both info and error logs).
   * Can be an option for more granular control over logging.
   *
   * This will not automatically affect user-configured logs (e.g. if you call `console.log` or `payload.logger.info` in your job code).
   *
   * @default false
   */
  silent?: RunJobsSilent
}

export type RunJobAccessArgs = {
  req: PayloadRequest
}

export type RunJobAccess = (args: RunJobAccessArgs) => boolean | Promise<boolean>

export type QueueJobAccessArgs = {
  req: PayloadRequest
}

export type CancelJobAccessArgs = {
  req: PayloadRequest
}
export type CancelJobAccess = (args: CancelJobAccessArgs) => boolean | Promise<boolean>
export type QueueJobAccess = (args: QueueJobAccessArgs) => boolean | Promise<boolean>

export type SanitizedJobsConfig = {
  /**
   * If set to `true`, the job system is enabled and a payload-jobs collection exists.
   * This property is automatically set during sanitization.
   */
  enabled?: boolean
  /**
   * If set to `true`, at least one task or workflow has scheduling enabled.
   * This property is automatically set during sanitization.
   */
  scheduling?: boolean
  /**
   * If set to `true`, a payload-job-stats global exists.
   * This property is automatically set during sanitization.
   */
  stats?: boolean
} & JobsConfig
export type JobsConfig = {
  /**
   * Specify access control to determine who can interact with jobs.
   */
  access?: {
    /**
     * By default, all logged-in users can cancel jobs.
     */
    cancel?: CancelJobAccess
    /**
     * By default, all logged-in users can queue jobs.
     */
    queue?: QueueJobAccess
    /**
     * By default, all logged-in users can run jobs.
     */
    run?: RunJobAccess
  }
  /** Adds information about the parent job to the task log. This is useful for debugging and tracking the flow of tasks.
   *
   * In 4.0, this will default to `true`.
   *
   * @default false
   */
  addParentToTaskLog?: boolean
  /**
   * Allows you to configure cron jobs that automatically run queued jobs
   * at specified intervals. Note that this does not _queue_ new jobs - only
   * _runs_ jobs that are already in the specified queue.
   *
   * @remark this property should not be used on serverless platforms like Vercel
   */
  autoRun?:
    | ((payload: Payload) => AutorunCronConfig[] | Promise<AutorunCronConfig[]>)
    | AutorunCronConfig[]
  /**
   * Determine whether or not to delete a job after it has successfully completed.
   */
  deleteJobOnComplete?: boolean
  /**
   * Specify depth for retrieving jobs from the queue.
   * This should be as low as possible in order for job retrieval
   * to be as efficient as possible. Setting it to anything higher than
   * 0 will drastically affect performance, as less efficient database
   * queries will be used.
   *
   * @default 0
   * @deprecated - this will be removed in 4.0
   */
  depth?: number
  /**
   * Override any settings on the default Jobs collection. Accepts the default collection and allows you to return
   * a new collection.
   */
  jobsCollectionOverrides?: (args: { defaultJobsCollection: CollectionConfig }) => CollectionConfig
  /**
   * Adjust the job processing order using a Payload sort string. This can be set globally or per queue.
   *
   * FIFO would equal `createdAt` and LIFO would equal `-createdAt`.
   *
   * @default all jobs for all queues will be executed in FIFO order.
   */
  processingOrder?:
    | ((args: RunJobsArgs) => Promise<Sort> | Sort)
    | {
        default?: Sort
        queues: {
          [queue: string]: Sort
        }
      }
    | Sort
  /**
   * By default, the job system uses direct database calls for optimal performance.
   * If you added custom hooks to your jobs collection, you can set this to true to
   * use the standard Payload API for all job operations. This is discouraged, as it will
   * drastically affect performance.
   *
   * @default false
   * @deprecated - this will be removed in 4.0
   */
  runHooks?: boolean
  /**
   * A function that will be executed before Payload picks up jobs which are configured by the `jobs.autorun` function.
   * If this function returns true, jobs will be queried and picked up. If it returns false, jobs will not be run.
   * @default undefined - if this function is not defined, jobs will be run - as if () => true was passed.
   * @param payload
   * @returns boolean
   */
  shouldAutoRun?: (payload: Payload) => boolean | Promise<boolean>
  /**
   * Define all possible tasks here
   */
  tasks?: TaskConfig<any>[]
  /**
   * Define all the workflows here. Workflows orchestrate the flow of multiple tasks.
   */
  workflows?: WorkflowConfig<any>[]
}

export type Queueable = {
  scheduleConfig: ScheduleConfig
  taskConfig?: TaskConfig
  // If not set, queue it immediately
  waitUntil?: Date
  workflowConfig?: WorkflowConfig
}

type OptionalPromise<T> = Promise<T> | T

export type BeforeScheduleFn = (args: {
  defaultBeforeSchedule: BeforeScheduleFn
  /**
   * payload-job-stats global data
   */
  jobStats: JobStats
  queueable: Queueable
  req: PayloadRequest
}) => OptionalPromise<{
  input?: object
  shouldSchedule: boolean
  waitUntil?: Date
}>

export type AfterScheduleFn = (
  args: {
    defaultAfterSchedule: AfterScheduleFn
    /**
     * payload-job-stats global data. If the global does not exist, it will be null.
     */
    jobStats: JobStats | null
    queueable: Queueable
    req: PayloadRequest
  } & (
    | {
        error: Error
        job?: never
        status: 'error'
      }
    | {
        error?: never
        job: Job
        status: 'success'
      }
    | {
        error?: never
        job?: never
        /**
         * If the beforeSchedule hook returned `shouldSchedule: false`, this will be called with status `skipped`.
         */
        status: 'skipped'
      }
  ),
) => OptionalPromise<void>

export type ScheduleConfig = {
  /**
   * The cron for scheduling the job.
   *
   * @example
   *     ┌───────────── (optional) second (0 - 59)
   *     │ ┌───────────── minute (0 - 59)
   *     │ │ ┌───────────── hour (0 - 23)
   *     │ │ │ ┌───────────── day of the month (1 - 31)
   *     │ │ │ │ ┌───────────── month (1 - 12)
   *     │ │ │ │ │ ┌───────────── day of the week (0 - 6) (Sunday to Saturday)
   *     │ │ │ │ │ │
   *     │ │ │ │ │ │
   *  - '* 0 * * * *' every hour at minute 0
   *  - '* 0 0 * * *' daily at midnight
   *  - '* 0 0 * * 0' weekly at midnight on Sundays
   *  - '* 0 0 1 * *' monthly at midnight on the 1st day of the month
   *  - '* 0/5 * * * *' every 5 minutes
   *  - '* * * * * *' every second
   */
  cron: string
  hooks?: {
    /**
     * Functions that will be executed after the job has been successfully scheduled.
     *
     * @default By default, global update?? Unless global update should happen before
     */
    afterSchedule?: AfterScheduleFn
    /**
     * Functions that will be executed before the job is scheduled.
     * You can use this to control whether or not the job should be scheduled, or what input
     * data should be passed to the job.
     *
     * @default By default, this has one function that returns { shouldSchedule: true } if the following conditions are met:
     * - There currently is no job of the same type in the specified queue that is currently running
     * - There currently is no job of the same type in the specified queue that is scheduled to run in the future
     * - There currently is no job of the same type in the specified queue that failed previously but can be retried
     */
    beforeSchedule?: BeforeScheduleFn
  }
  /**
   * Queue to which the scheduled job will be added.
   */
  queue: string
}
```

--------------------------------------------------------------------------------

---[FILE: taskTypes.ts]---
Location: payload-main/packages/payload/src/queues/config/types/taskTypes.ts

```typescript
import type { Field, Job, PayloadRequest, StringKeyOf, TypedJobs } from '../../../index.js'
import type { ScheduleConfig } from './index.js'
import type { SingleTaskStatus } from './workflowTypes.js'

export type TaskInputOutput = {
  input: object
  output: object
}
export type TaskHandlerResult<
  TTaskSlugOrInputOutput extends keyof TypedJobs['tasks'] | TaskInputOutput,
> =
  | {
      errorMessage?: string
      state: 'failed'
    }
  | {
      output: TTaskSlugOrInputOutput extends keyof TypedJobs['tasks']
        ? TypedJobs['tasks'][TTaskSlugOrInputOutput]['output']
        : TTaskSlugOrInputOutput extends TaskInputOutput // Check if it's actually TaskInputOutput type
          ? TTaskSlugOrInputOutput['output']
          : never
      state?: 'succeeded'
    }

export type TaskHandlerArgs<
  TTaskSlugOrInputOutput extends keyof TypedJobs['tasks'] | TaskInputOutput,
  TWorkflowSlug extends keyof TypedJobs['workflows'] = string,
> = {
  /**
   * Use this function to run a sub-task from within another task.
   */
  inlineTask: RunInlineTaskFunction
  input: TTaskSlugOrInputOutput extends keyof TypedJobs['tasks']
    ? TypedJobs['tasks'][TTaskSlugOrInputOutput]['input']
    : TTaskSlugOrInputOutput extends TaskInputOutput // Check if it's actually TaskInputOutput type
      ? TTaskSlugOrInputOutput['input']
      : never
  job: Job<TWorkflowSlug>
  req: PayloadRequest
  tasks: RunTaskFunctions
}

/**
 * Inline tasks in JSON workflows have no input, as they can just get the input from job.taskStatus
 */
export type TaskHandlerArgsNoInput<TWorkflowInput extends false | object = false> = {
  job: Job<TWorkflowInput>
  req: PayloadRequest
}

export type TaskHandler<
  TTaskSlugOrInputOutput extends keyof TypedJobs['tasks'] | TaskInputOutput,
  TWorkflowSlug extends keyof TypedJobs['workflows'] = string,
> = (
  args: TaskHandlerArgs<TTaskSlugOrInputOutput, TWorkflowSlug>,
) => Promise<TaskHandlerResult<TTaskSlugOrInputOutput>> | TaskHandlerResult<TTaskSlugOrInputOutput>

/**
 * @todo rename to TaskSlug in 4.0, similar to CollectionSlug
 */
export type TaskType = StringKeyOf<TypedJobs['tasks']>

// Extracts the type of `input` corresponding to each task
export type TaskInput<T extends keyof TypedJobs['tasks']> = TypedJobs['tasks'][T]['input']

export type TaskOutput<T extends keyof TypedJobs['tasks']> = TypedJobs['tasks'][T]['output']

export type TaskHandlerResults = {
  [TTaskSlug in keyof TypedJobs['tasks']]: {
    [id: string]: TaskHandlerResult<TTaskSlug>
  }
}

// Helper type to create correct argument type for the function corresponding to each task.
export type RunTaskFunctionArgs<TTaskSlug extends keyof TypedJobs['tasks']> = {
  input?: TaskInput<TTaskSlug>
  /**
   * Specify the number of times that this task should be retried if it fails for any reason.
   * If this is undefined, the task will either inherit the retries from the workflow or have no retries.
   * If this is 0, the task will not be retried.
   *
   * @default By default, tasks are not retried and `retries` is `undefined`.
   */
  retries?: number | RetryConfig | undefined
}

export type RunTaskFunction<TTaskSlug extends keyof TypedJobs['tasks']> = (
  taskID: string,
  taskArgs?: RunTaskFunctionArgs<TTaskSlug>,
) => Promise<TaskOutput<TTaskSlug>>

export type RunTaskFunctions = {
  [TTaskSlug in keyof TypedJobs['tasks']]: RunTaskFunction<TTaskSlug>
}

type MaybePromise<T> = Promise<T> | T

export type RunInlineTaskFunction = <TTaskInput extends object, TTaskOutput extends object>(
  taskID: string,
  taskArgs: {
    input?: TTaskInput
    /**
     * Specify the number of times that this task should be retried if it fails for any reason.
     * If this is undefined, the task will either inherit the retries from the workflow or have no retries.
     * If this is 0, the task will not be retried.
     *
     * @default By default, tasks are not retried and `retries` is `undefined`.
     */
    retries?: number | RetryConfig | undefined
    // This is the same as TaskHandler, but typed out explicitly in order to improve type inference
    task: (args: {
      inlineTask: RunInlineTaskFunction
      input: TTaskInput
      job: Job<any>
      req: PayloadRequest
      tasks: RunTaskFunctions
    }) => MaybePromise<
      | {
          errorMessage?: string
          state: 'failed'
        }
      | {
          output: TTaskOutput
          state?: 'succeeded'
        }
    >
  },
) => Promise<TTaskOutput>

export type TaskCallbackArgs = {
  /**
   * Input data passed to the task
   */
  input?: object
  job: Job
  req: PayloadRequest
  taskStatus: null | SingleTaskStatus<string>
}

export type ShouldRestoreFn = (
  args: { taskStatus: SingleTaskStatus<string> } & Omit<TaskCallbackArgs, 'taskStatus'>,
) => boolean | Promise<boolean>
export type TaskCallbackFn = (args: TaskCallbackArgs) => Promise<void> | void

export type RetryConfig = {
  /**
   * This controls how many times the task should be retried if it fails.
   *
   * @default undefined - attempts are either inherited from the workflow retry config or set to 0.
   */
  attempts?: number
  /**
   * The backoff strategy to use when retrying the task. This determines how long to wait before retrying the task.
   *
   * If this is set on a single task, the longest backoff time of a task will determine the time until the entire workflow is retried.
   */
  backoff?: {
    /**
     * Base delay between running jobs in ms
     */
    delay?: number
    /**
     * @default fixed
     *
     * The backoff strategy to use when retrying the task. This determines how long to wait before retrying the task.
     * If fixed (default) is used, the delay will be the same between each retry.
     *
     * If exponential is used, the delay will increase exponentially with each retry.
     *
     * @example
     * delay = 1000
     * attempts = 3
     * type = 'fixed'
     *
     * The task will be retried 3 times with a delay of 1000ms between each retry.
     *
     * @example
     * delay = 1000
     * attempts = 3
     * type = 'exponential'
     *
     * The task will be retried 3 times with a delay of 1000ms, 2000ms, and 4000ms between each retry.
     */
    type: 'exponential' | 'fixed'
  }
  /**
   * This controls whether the task output should be restored if the task previously succeeded and the workflow is being retried.
   *
   * If this is set to false, the task will be re-run even if it previously succeeded, ignoring the maximum number of retries.
   *
   * If this is set to true, the task will only be re-run if it previously failed.
   *
   * If this is a function, the return value of the function will determine whether the task should be re-run. This can be used for more complex restore logic,
   * e.g you may want to re-run a task up until a certain point and then restore it, or only re-run a task if the input has changed.
   *
   * @default true - the task output will be restored if the task previously succeeded.
   */
  shouldRestore?: boolean | ShouldRestoreFn
}

export type TaskConfig<
  TTaskSlugOrInputOutput extends keyof TypedJobs['tasks'] | TaskInputOutput = TaskType,
> = {
  /**
   * The function that should be responsible for running the job.
   * You can either pass a string-based path to the job function file, or the job function itself.
   *
   * If you are using large dependencies within your job, you might prefer to pass the string path
   * because that will avoid bundling large dependencies in your Next.js app. Passing a string path is an advanced feature
   * that may require a sophisticated build pipeline in order to work.
   */
  handler: string | TaskHandler<TTaskSlugOrInputOutput>
  /**
   * Define the input field schema - payload will generate a type for this schema.
   */
  inputSchema?: Field[]
  /**
   * You can use interfaceName to change the name of the interface that is generated for this task. By default, this is "Task" + the capitalized task slug.
   */
  interfaceName?: string
  /**
   * Define a human-friendly label for this task.
   */
  label?: string
  /**
   * Function to be executed if the task fails.
   */
  onFail?: TaskCallbackFn
  /**
   * Function to be executed if the task succeeds.
   */
  onSuccess?: TaskCallbackFn
  /**
   * Define the output field schema - payload will generate a type for this schema.
   */
  outputSchema?: Field[]
  /**
   * Specify the number of times that this step should be retried if it fails.
   * If this is undefined, the task will either inherit the retries from the workflow or have no retries.
   * If this is 0, the task will not be retried.
   *
   * @default By default, tasks are not retried and `retries` is `undefined`.
   */
  retries?: number | RetryConfig | undefined
  /**
   * Allows automatically scheduling this task to run regularly at a specified interval.
   */
  schedule?: ScheduleConfig[]
  /**
   * Define a slug-based name for this job. This slug needs to be unique among both tasks and workflows.
   */
  slug: TTaskSlugOrInputOutput extends keyof TypedJobs['tasks'] ? TTaskSlugOrInputOutput : string
}
```

--------------------------------------------------------------------------------

---[FILE: workflowJSONTypes.ts]---
Location: payload-main/packages/payload/src/queues/config/types/workflowJSONTypes.ts

```typescript
import type { Job, TaskHandlerResult, TypedJobs } from '../../../index.js'
import type { RetryConfig, TaskHandlerArgsNoInput } from './taskTypes.js'

export type WorkflowStep<
  TTaskSlug extends keyof TypedJobs['tasks'],
  TWorkflowSlug extends false | keyof TypedJobs['workflows'] = false,
> = {
  /**
   * If this step is completed, the workflow will be marked as completed
   */
  completesJob?: boolean
  condition?: (args: { job: Job<TWorkflowSlug> }) => boolean
  /**
   * Each task needs to have a unique ID to track its status
   */
  id: string
  /**
   * Specify the number of times that this workflow should be retried if it fails for any reason.
   *
   * @default By default, workflows are not retried and `retries` is `0`.
   */
  retries?: number | RetryConfig
} & (
  | {
      inlineTask?: (
        args: TWorkflowSlug extends keyof TypedJobs['workflows']
          ? TaskHandlerArgsNoInput<TypedJobs['workflows'][TWorkflowSlug]['input']>
          : TaskHandlerArgsNoInput,
      ) => Promise<TaskHandlerResult<TTaskSlug>> | TaskHandlerResult<TTaskSlug>
    }
  | {
      input: (args: { job: Job<TWorkflowSlug> }) => TypedJobs['tasks'][TTaskSlug]['input']
      task: TTaskSlug
    }
)

type AllWorkflowSteps<TWorkflowSlug extends false | keyof TypedJobs['workflows'] = false> = {
  [TTaskSlug in keyof TypedJobs['tasks']]: WorkflowStep<TTaskSlug, TWorkflowSlug>
}[keyof TypedJobs['tasks']]

export type WorkflowJSON<TWorkflowSlug extends false | keyof TypedJobs['workflows'] = false> =
  Array<AllWorkflowSteps<TWorkflowSlug>>
```

--------------------------------------------------------------------------------

---[FILE: workflowTypes.ts]---
Location: payload-main/packages/payload/src/queues/config/types/workflowTypes.ts

```typescript
import type { Field } from '../../../fields/config/types.js'
import type {
  Job,
  PayloadRequest,
  StringKeyOf,
  TypedCollection,
  TypedJobs,
} from '../../../index.js'
import type { TaskParent } from '../../operations/runJobs/runJob/getRunTaskFunction.js'
import type { ScheduleConfig } from './index.js'
import type {
  RetryConfig,
  RunInlineTaskFunction,
  RunTaskFunctions,
  TaskInput,
  TaskOutput,
  TaskType,
} from './taskTypes.js'
import type { WorkflowJSON } from './workflowJSONTypes.js'

export type JobLog = {
  completedAt: string
  error?: unknown
  executedAt: string
  /**
   * ID added by the array field when the log is saved in the database
   */
  id: string
  input?: Record<string, any>
  output?: Record<string, any>
  /**
   * Sub-tasks (tasks that are run within a task) will have a parent task ID
   */
  parent?: TaskParent
  state: 'failed' | 'succeeded'
  taskID: string
  taskSlug: TaskType
}

/**
 * @deprecated - will be made private in 4.0. Please use the `Job` type instead.
 */
export type BaseJob<
  TWorkflowSlugOrInput extends false | keyof TypedJobs['workflows'] | object = false,
> = {
  completedAt?: null | string
  createdAt: string
  error?: unknown
  hasError?: boolean
  id: number | string
  input: TWorkflowSlugOrInput extends false
    ? object
    : TWorkflowSlugOrInput extends keyof TypedJobs['workflows']
      ? TypedJobs['workflows'][TWorkflowSlugOrInput]['input']
      : TWorkflowSlugOrInput
  log?: JobLog[]
  meta?: {
    [key: string]: unknown
    /**
     * If true, this job was queued by the scheduling system.
     */
    scheduled?: boolean
  }
  processing?: boolean
  queue?: string
  taskSlug?: null | TaskType
  taskStatus: JobTaskStatus
  totalTried: number
  updatedAt: string
  waitUntil?: null | string
  workflowSlug?: null | WorkflowTypes
}

/**
 * @todo rename to WorkflowSlug in 4.0, similar to CollectionSlug
 */
export type WorkflowTypes = StringKeyOf<TypedJobs['workflows']>

/**
 * @deprecated - will be removed in 4.0. Use `Job` type instead.
 */
export type RunningJob<TWorkflowSlugOrInput extends keyof TypedJobs['workflows'] | object> = {
  input: TWorkflowSlugOrInput extends keyof TypedJobs['workflows']
    ? TypedJobs['workflows'][TWorkflowSlugOrInput]['input']
    : TWorkflowSlugOrInput
  taskStatus: JobTaskStatus
} & Omit<TypedCollection['payload-jobs'], 'input' | 'taskStatus'>

/**
 * @deprecated - will be removed in 4.0. Use `Job` type instead.
 */
export type RunningJobSimple<TWorkflowInput extends object> = {
  input: TWorkflowInput
} & TypedCollection['payload-jobs']

// Simplified version of RunningJob that doesn't break TypeScript (TypeScript seems to stop evaluating RunningJob when it's too complex)
export type RunningJobFromTask<TTaskSlug extends keyof TypedJobs['tasks']> = {
  input: TypedJobs['tasks'][TTaskSlug]['input']
} & TypedCollection['payload-jobs']

export type WorkflowHandler<
  TWorkflowSlugOrInput extends false | keyof TypedJobs['workflows'] | object = false,
> = (args: {
  inlineTask: RunInlineTaskFunction
  job: Job<TWorkflowSlugOrInput>
  req: PayloadRequest
  tasks: RunTaskFunctions
}) => Promise<void>

export type SingleTaskStatus<T extends keyof TypedJobs['tasks']> = {
  complete: boolean
  input: TaskInput<T>
  output: TaskOutput<T>
  taskSlug: TaskType
  totalTried: number
}

/**
 * Task IDs mapped to their status
 */
export type JobTaskStatus = {
  // Wrap in taskSlug to improve typing
  [taskSlug in TaskType]: {
    [taskID: string]: SingleTaskStatus<taskSlug>
  }
}

export type WorkflowConfig<
  TWorkflowSlugOrInput extends false | keyof TypedJobs['workflows'] | object = false,
> = {
  /**
   * You can either pass a string-based path to the workflow function file, or the workflow function itself.
   *
   * If you are using large dependencies within your workflow control flow, you might prefer to pass the string path
   * because that will avoid bundling large dependencies in your Next.js app. Passing a string path is an advanced feature
   * that may require a sophisticated build pipeline in order to work.
   */
  handler:
    | string
    | WorkflowHandler<TWorkflowSlugOrInput>
    | WorkflowJSON<TWorkflowSlugOrInput extends object ? string : TWorkflowSlugOrInput>
  /**
   * Define the input field schema  - payload will generate a type for this schema.
   */
  inputSchema?: Field[]
  /**
   * You can use interfaceName to change the name of the interface that is generated for this workflow. By default, this is "Workflow" + the capitalized workflow slug.
   */
  interfaceName?: string
  /**
   * Define a human-friendly label for this workflow.
   */
  label?: string
  /**
   * Optionally, define the default queue name that this workflow should be tied to.
   * Defaults to "default".
   * Can be overridden when queuing jobs via Local API.
   */
  queue?: string
  /**
   * You can define `retries` on the workflow level, which will enforce that the workflow can only fail up to that number of retries. If a task does not have retries specified, it will inherit the retry count as specified on the workflow.
   *
   * You can specify `0` as `workflow` retries, which will disregard all `task` retry specifications and fail the entire workflow on any task failure.
   * You can leave `workflow` retries as undefined, in which case, the workflow will respect what each task dictates as their own retry count.
   *
   * @default undefined. By default, workflows retries are defined by their tasks
   */
  retries?: number | RetryConfig | undefined
  /**
   * Allows automatically scheduling this workflow to run regularly at a specified interval.
   */
  schedule?: ScheduleConfig[]
  /**
   * Define a slug-based name for this job.
   */
  slug: TWorkflowSlugOrInput extends keyof TypedJobs['workflows'] ? TWorkflowSlugOrInput : string
}
```

--------------------------------------------------------------------------------

---[FILE: handleSchedules.ts]---
Location: payload-main/packages/payload/src/queues/endpoints/handleSchedules.ts

```typescript
import type { Endpoint } from '../../config/types.js'

import { handleSchedules } from '../operations/handleSchedules/index.js'
import { configHasJobs } from './run.js'

/**
 * GET /api/payload-jobs/handle-schedules endpoint
 *
 * This endpoint is GET instead of POST to allow it to be used in a Vercel Cron.
 */
export const handleSchedulesJobsEndpoint: Endpoint = {
  handler: async (req) => {
    const jobsConfig = req.payload.config.jobs

    if (!configHasJobs(jobsConfig)) {
      return Response.json(
        {
          message: 'No jobs to schedule.',
        },
        { status: 200 },
      )
    }

    const accessFn = jobsConfig.access?.run ?? (() => true)

    const hasAccess = await accessFn({ req })

    if (!hasAccess) {
      return Response.json(
        {
          message: req.i18n.t('error:unauthorized'),
        },
        { status: 401 },
      )
    }

    if (!jobsConfig.scheduling) {
      // There is no reason to call the handleSchedules endpoint if the stats global is not enabled (= no schedules defined)
      return Response.json(
        {
          message:
            'Cannot handle schedules because no tasks or workflows with schedules are defined.',
        },
        { status: 500 },
      )
    }

    const { allQueues, queue } = req.query as {
      allQueues?: 'false' | 'true'
      queue?: string
    }

    const runAllQueues = allQueues && !(typeof allQueues === 'string' && allQueues === 'false')

    const { errored, queued, skipped } = await handleSchedules({
      allQueues: runAllQueues,
      queue,
      req,
    })

    return Response.json(
      {
        errored,
        message: req.i18n.t('general:success'),
        queued,
        skipped,
      },
      { status: 200 },
    )
  },
  method: 'get',
  path: '/handle-schedules',
}
```

--------------------------------------------------------------------------------

---[FILE: run.ts]---
Location: payload-main/packages/payload/src/queues/endpoints/run.ts

```typescript
import type { Endpoint } from '../../config/types.js'
import type { SanitizedJobsConfig } from '../config/types/index.js'

import { runJobs, type RunJobsArgs } from '../operations/runJobs/index.js'

/**
 * /api/payload-jobs/run endpoint
 *
 * This endpoint is GET instead of POST to allow it to be used in a Vercel Cron.
 */
export const runJobsEndpoint: Endpoint = {
  handler: async (req) => {
    const jobsConfig = req.payload.config.jobs

    if (!configHasJobs(jobsConfig)) {
      return Response.json(
        {
          message: 'No jobs to run.',
        },
        { status: 200 },
      )
    }

    const accessFn = jobsConfig.access?.run ?? (() => true)

    const hasAccess = await accessFn({ req })

    if (!hasAccess) {
      return Response.json(
        {
          message: req.i18n.t('error:unauthorized'),
        },
        { status: 401 },
      )
    }

    const {
      allQueues,
      disableScheduling: disableSchedulingParam,
      limit,
      queue,
      silent: silentParam,
    } = req.query as {
      allQueues?: 'false' | 'true'
      disableScheduling?: 'false' | 'true'
      limit?: number
      queue?: string
      silent?: string
    }

    const silent = silentParam === 'true'

    const shouldHandleSchedules = disableSchedulingParam !== 'true'

    const runAllQueues = allQueues && !(typeof allQueues === 'string' && allQueues === 'false')

    if (shouldHandleSchedules && jobsConfig.scheduling) {
      // If should handle schedules and schedules are defined
      await req.payload.jobs.handleSchedules({ allQueues: runAllQueues, queue, req })
    }

    const runJobsArgs: RunJobsArgs = {
      queue,
      req,
      // Access is validated above, so it's safe to override here
      allQueues: runAllQueues,
      overrideAccess: true,
      silent,
    }

    if (typeof queue === 'string') {
      runJobsArgs.queue = queue
    }

    const parsedLimit = Number(limit)
    if (!isNaN(parsedLimit)) {
      runJobsArgs.limit = parsedLimit
    }

    let noJobsRemaining = false
    let remainingJobsFromQueried = 0
    try {
      const result = await runJobs(runJobsArgs)
      noJobsRemaining = !!result.noJobsRemaining
      remainingJobsFromQueried = result.remainingJobsFromQueried
    } catch (err) {
      req.payload.logger.error({
        err,
        msg: 'There was an error running jobs:',
        queue: runJobsArgs.queue,
      })

      return Response.json(
        {
          message: req.i18n.t('error:unknown'),
          noJobsRemaining: true,
          remainingJobsFromQueried,
        },
        { status: 500 },
      )
    }

    return Response.json(
      {
        message: req.i18n.t('general:success'),
        noJobsRemaining,
        remainingJobsFromQueried,
      },
      { status: 200 },
    )
  },
  method: 'get',
  path: '/run',
}

export const configHasJobs = (jobsConfig: SanitizedJobsConfig): boolean => {
  return Boolean(jobsConfig.tasks?.length || jobsConfig.workflows?.length)
}
```

--------------------------------------------------------------------------------

---[FILE: calculateBackoffWaitUntil.ts]---
Location: payload-main/packages/payload/src/queues/errors/calculateBackoffWaitUntil.ts

```typescript
import type { RetryConfig } from '../config/types/taskTypes.js'

import { getCurrentDate } from '../utilities/getCurrentDate.js'

export function calculateBackoffWaitUntil({
  retriesConfig,
  totalTried,
}: {
  retriesConfig: number | RetryConfig
  totalTried: number
}): Date {
  let waitUntil: Date = getCurrentDate()
  if (typeof retriesConfig === 'object') {
    if (retriesConfig.backoff) {
      if (retriesConfig.backoff.type === 'fixed') {
        waitUntil = retriesConfig.backoff.delay
          ? new Date(getCurrentDate().getTime() + retriesConfig.backoff.delay)
          : getCurrentDate()
      } else if (retriesConfig.backoff.type === 'exponential') {
        // 2 ^ (attempts - 1) * delay (current attempt is not included in totalTried, thus no need for -1)
        const delay = retriesConfig.backoff.delay ? retriesConfig.backoff.delay : 0
        waitUntil = new Date(getCurrentDate().getTime() + Math.pow(2, totalTried) * delay)
      }
    }
  }

  /*
  const differenceInMSBetweenNowAndWaitUntil = waitUntil.getTime() - getCurrentDate().getTime()

  const differenceInSBetweenNowAndWaitUntil = differenceInMSBetweenNowAndWaitUntil / 1000
  console.log('Calculated backoff', {
    differenceInMSBetweenNowAndWaitUntil,
    differenceInSBetweenNowAndWaitUntil,
    retriesConfig,
    totalTried,
  })*/
  return waitUntil
}
```

--------------------------------------------------------------------------------

---[FILE: getWorkflowRetryBehavior.ts]---
Location: payload-main/packages/payload/src/queues/errors/getWorkflowRetryBehavior.ts

```typescript
import type { Job } from '../../index.js'
import type { RetryConfig } from '../config/types/taskTypes.js'

import { calculateBackoffWaitUntil } from './calculateBackoffWaitUntil.js'

/**
 * Assuming there is no task that has already reached max retries,
 * this function determines if the workflow should retry the job
 * and if so, when it should retry.
 */
export function getWorkflowRetryBehavior({
  job,
  retriesConfig,
}: {
  job: Job
  retriesConfig?: number | RetryConfig
}):
  | {
      hasFinalError: false
      maxWorkflowRetries?: number
      waitUntil?: Date
    }
  | {
      hasFinalError: true
      maxWorkflowRetries?: number
      waitUntil?: Date
    } {
  const maxWorkflowRetries = (
    typeof retriesConfig === 'object' ? retriesConfig.attempts : retriesConfig
  )!

  if (
    maxWorkflowRetries !== undefined &&
    maxWorkflowRetries !== null &&
    job.totalTried >= maxWorkflowRetries
  ) {
    return {
      hasFinalError: true,
      maxWorkflowRetries,
    }
  }

  if (!retriesConfig) {
    // No retries provided => assuming no task reached max retries, we can retry
    return {
      hasFinalError: false,
      maxWorkflowRetries: undefined,
      waitUntil: undefined,
    }
  }

  // Job will retry. Let's determine when!
  const waitUntil: Date = calculateBackoffWaitUntil({
    retriesConfig,
    totalTried: job.totalTried ?? 0,
  })

  return {
    hasFinalError: false,
    maxWorkflowRetries,
    waitUntil,
  }
}
```

--------------------------------------------------------------------------------

````
