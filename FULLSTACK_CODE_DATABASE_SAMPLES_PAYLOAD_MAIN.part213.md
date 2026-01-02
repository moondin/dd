---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 213
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 213 of 695)

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

---[FILE: getRunTaskFunction.ts]---
Location: payload-main/packages/payload/src/queues/operations/runJobs/runJob/getRunTaskFunction.ts

```typescript
import ObjectIdImport from 'bson-objectid'

import type { Job } from '../../../../index.js'
import type { JsonObject, PayloadRequest } from '../../../../types/index.js'
import type {
  RetryConfig,
  RunInlineTaskFunction,
  RunTaskFunction,
  RunTaskFunctions,
  TaskConfig,
  TaskHandler,
  TaskHandlerResult,
  TaskType,
} from '../../../config/types/taskTypes.js'
import type {
  JobLog,
  SingleTaskStatus,
  WorkflowConfig,
  WorkflowTypes,
} from '../../../config/types/workflowTypes.js'
import type { UpdateJobFunction } from './getUpdateJobFunction.js'

import { TaskError } from '../../../errors/index.js'
import { getCurrentDate } from '../../../utilities/getCurrentDate.js'
import { getTaskHandlerFromConfig } from './importHandlerPath.js'

const ObjectId = 'default' in ObjectIdImport ? ObjectIdImport.default : ObjectIdImport

export type TaskParent = {
  taskID: string
  taskSlug: string
}

export const getRunTaskFunction = <TIsInline extends boolean>(
  job: Job,
  workflowConfig: WorkflowConfig,
  req: PayloadRequest,
  isInline: TIsInline,
  updateJob: UpdateJobFunction,
  parent?: TaskParent,
): TIsInline extends true ? RunInlineTaskFunction : RunTaskFunctions => {
  const jobConfig = req.payload.config.jobs

  const runTask: <TTaskSlug extends string>(
    taskSlug: TTaskSlug,
  ) => TTaskSlug extends 'inline' ? RunInlineTaskFunction : RunTaskFunction<TTaskSlug> = (
    taskSlug,
  ) =>
    (async (
      taskID: Parameters<RunInlineTaskFunction>[0],
      {
        input,
        retries,
        // Only available for inline tasks:
        task,
      }: Parameters<RunInlineTaskFunction>[1] & Parameters<RunTaskFunction<string>>[1],
    ) => {
      const executedAt = getCurrentDate()

      let taskConfig: TaskConfig | undefined
      if (!isInline) {
        taskConfig = (jobConfig.tasks?.length &&
          jobConfig.tasks.find((t) => t.slug === taskSlug)) as TaskConfig<string>

        if (!taskConfig) {
          throw new Error(`Task ${taskSlug} not found in workflow ${job.workflowSlug}`)
        }
      }

      const retriesConfigFromPropsNormalized =
        retries == undefined || retries == null
          ? {}
          : typeof retries === 'number'
            ? { attempts: retries }
            : retries
      const retriesConfigFromTaskConfigNormalized = taskConfig
        ? typeof taskConfig.retries === 'number'
          ? { attempts: taskConfig.retries }
          : taskConfig.retries
        : {}

      const finalRetriesConfig: RetryConfig = {
        ...retriesConfigFromTaskConfigNormalized,
        ...retriesConfigFromPropsNormalized, // Retry config from props takes precedence
      }

      const taskStatus: null | SingleTaskStatus<string> = job?.taskStatus?.[taskSlug]
        ? job.taskStatus[taskSlug][taskID]!
        : null

      // Handle restoration of task if it succeeded in a previous run
      if (taskStatus && taskStatus.complete === true) {
        let shouldRestore = true
        if (finalRetriesConfig?.shouldRestore === false) {
          shouldRestore = false
        } else if (typeof finalRetriesConfig?.shouldRestore === 'function') {
          shouldRestore = await finalRetriesConfig.shouldRestore({
            input,
            job,
            req,
            taskStatus,
          })
        }
        if (shouldRestore) {
          return taskStatus.output
        }
      }

      const runner = isInline
        ? (task as TaskHandler<TaskType>)
        : await getTaskHandlerFromConfig(taskConfig)

      if (!runner || typeof runner !== 'function') {
        throw new TaskError({
          executedAt,
          input,
          job,
          message: isInline
            ? `Inline task with ID ${taskID} does not have a valid handler.`
            : `Task with slug ${taskSlug} in workflow ${job.workflowSlug} does not have a valid handler.`,
          parent,
          retriesConfig: finalRetriesConfig,
          taskConfig,
          taskID,
          taskSlug,
          taskStatus,
          workflowConfig,
        })
      }

      let taskHandlerResult: TaskHandlerResult<string>
      let output: JsonObject | undefined = {}

      try {
        taskHandlerResult = await runner({
          inlineTask: getRunTaskFunction(job, workflowConfig, req, true, updateJob, {
            taskID,
            taskSlug,
          }),
          input,
          job: job as unknown as Job<WorkflowTypes>,
          req,
          tasks: getRunTaskFunction(job, workflowConfig, req, false, updateJob, {
            taskID,
            taskSlug,
          }),
        })
      } catch (err: any) {
        throw new TaskError({
          executedAt,
          input: input!,
          job,
          message: err.message || 'Task handler threw an error',
          output,
          parent,
          retriesConfig: finalRetriesConfig,
          taskConfig,
          taskID,
          taskSlug,
          taskStatus,
          workflowConfig,
        })
      }

      if (taskHandlerResult.state === 'failed') {
        throw new TaskError({
          executedAt,
          input: input!,
          job,
          message: taskHandlerResult.errorMessage ?? 'Task handler returned a failed state',
          output,
          parent,
          retriesConfig: finalRetriesConfig,
          taskConfig,
          taskID,
          taskSlug,
          taskStatus,
          workflowConfig,
        })
      } else {
        output = taskHandlerResult.output
      }

      if (taskConfig?.onSuccess) {
        await taskConfig.onSuccess({
          input,
          job,
          req,
          taskStatus,
        })
      }

      const newLogItem: JobLog = {
        id: new ObjectId().toHexString(),
        completedAt: getCurrentDate().toISOString(),
        executedAt: executedAt.toISOString(),
        input,
        output,
        parent: jobConfig.addParentToTaskLog ? parent : undefined,
        state: 'succeeded',
        taskID,
        taskSlug,
      }

      await updateJob({
        log: {
          $push: newLogItem,
        } as any,
        // Set to null to skip main row update on postgres. 2 => 1 db round trips
        updatedAt: null as any,
      })

      return output
    }) as any

  if (isInline) {
    return runTask('inline') as TIsInline extends true ? RunInlineTaskFunction : RunTaskFunctions
  } else {
    const tasks: RunTaskFunctions = {}
    for (const task of jobConfig.tasks ?? []) {
      tasks[task.slug] = runTask(task.slug) as RunTaskFunction<string>
    }
    return tasks as TIsInline extends true ? RunInlineTaskFunction : RunTaskFunctions
  }
}
```

--------------------------------------------------------------------------------

---[FILE: getUpdateJobFunction.ts]---
Location: payload-main/packages/payload/src/queues/operations/runJobs/runJob/getUpdateJobFunction.ts

```typescript
import type { Job } from '../../../../index.js'
import type { PayloadRequest } from '../../../../types/index.js'

import { JobCancelledError } from '../../../errors/index.js'
import { updateJob } from '../../../utilities/updateJob.js'

export type UpdateJobFunction = (jobData: Partial<Job>) => Promise<Job>

/**
 * Helper for updating a job that does the following, additionally to updating the job:
 * - Merges incoming data from the updated job into the original job object
 * - Handles job cancellation by throwing a `JobCancelledError` if the job was cancelled.
 */
export function getUpdateJobFunction(job: Job, req: PayloadRequest): UpdateJobFunction {
  return async (jobData) => {
    const updatedJob = await updateJob({
      id: job.id,
      data: jobData,
      depth: req.payload.config.jobs.depth,
      disableTransaction: true,
      req,
    })

    if (!updatedJob) {
      return job
    }

    // Update job object like this to modify the original object - that way, incoming changes (e.g. taskStatus field that will be re-generated through the hook) will be reflected in the calling function
    for (const key in updatedJob) {
      if (key === 'log') {
        // Add all new log entries to the original job.log object. Do not delete any existing log entries.
        // Do not update existing log entries, as existing log entries should be immutable.
        for (const logEntry of updatedJob?.log ?? []) {
          if (!job.log || !job.log.some((entry) => entry.id === logEntry.id)) {
            ;(job.log ??= []).push(logEntry)
          }
        }
      } else {
        ;(job as any)[key] = updatedJob[key as keyof Job]
      }
    }

    if ((updatedJob?.error as Record<string, unknown>)?.cancelled) {
      throw new JobCancelledError({ job })
    }

    return updatedJob
  }
}
```

--------------------------------------------------------------------------------

---[FILE: importHandlerPath.ts]---
Location: payload-main/packages/payload/src/queues/operations/runJobs/runJob/importHandlerPath.ts

```typescript
import { pathToFileURL } from 'url'

import type { TaskConfig, TaskHandler, TaskType } from '../../../config/types/taskTypes.js'

/**
 * Imports a handler function from a given path.
 */
export async function importHandlerPath<T>(path: string): Promise<T> {
  let runner!: T
  const [runnerPath, runnerImportName] = path.split('#')

  let runnerModule
  try {
    // We need to check for `require` for compatibility with outdated frameworks that do not
    // properly support ESM, like Jest. This is not done to support projects without "type": "module" set
    runnerModule =
      typeof require === 'function'
        ? await eval(`require('${runnerPath!.replaceAll('\\', '/')}')`)
        : await eval(`import('${pathToFileURL(runnerPath!).href}')`)
  } catch (e) {
    throw new Error(
      `Error importing job queue handler module for path ${path}. This is an advanced feature that may require a sophisticated build pipeline, especially when using it in production or within Next.js, e.g. by calling opening the /api/payload-jobs/run endpoint. You will have to transpile the handler files separately and ensure they are available in the same location when the job is run. If you're using an endpoint to execute your jobs, it's recommended to define your handlers as functions directly in your Payload Config, or use import paths handlers outside of Next.js. Import Error: \n${e instanceof Error ? e.message : 'Unknown error'}`,
    )
  }

  // If the path has indicated an #exportName, try to get it
  if (runnerImportName && runnerModule[runnerImportName]) {
    runner = runnerModule[runnerImportName]
  }

  // If there is a default export, use it
  if (!runner && runnerModule.default) {
    runner = runnerModule.default
  }

  // Finally, use whatever was imported
  if (!runner) {
    runner = runnerModule
  }

  return runner
}

/**
 * The `handler` property of a task config can either be a function or a path to a module that exports a function.
 * This function resolves the handler to a function, either by importing it from the path or returning the function directly
 * if it is already a function.
 */
export async function getTaskHandlerFromConfig(taskConfig?: TaskConfig) {
  if (!taskConfig) {
    throw new Error('Task config is required to get the task handler')
  }
  if (typeof taskConfig.handler === 'function') {
    return taskConfig.handler
  } else {
    return await importHandlerPath<TaskHandler<TaskType>>(taskConfig.handler)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/payload/src/queues/operations/runJobs/runJob/index.ts

```typescript
import type { Job } from '../../../../index.js'
import type { PayloadRequest } from '../../../../types/index.js'
import type { WorkflowConfig, WorkflowHandler } from '../../../config/types/workflowTypes.js'
import type { RunJobsSilent } from '../../../localAPI.js'
import type { UpdateJobFunction } from './getUpdateJobFunction.js'

import { handleTaskError } from '../../../errors/handleTaskError.js'
import { handleWorkflowError } from '../../../errors/handleWorkflowError.js'
import { JobCancelledError, TaskError, WorkflowError } from '../../../errors/index.js'
import { getCurrentDate } from '../../../utilities/getCurrentDate.js'
import { getRunTaskFunction } from './getRunTaskFunction.js'

type Args = {
  job: Job
  req: PayloadRequest
  /**
   * If set to true, the job system will not log any output to the console (for both info and error logs).
   * Can be an option for more granular control over logging.
   *
   * This will not automatically affect user-configured logs (e.g. if you call `console.log` or `payload.logger.info` in your job code).
   *
   * @default false
   */
  silent?: RunJobsSilent
  updateJob: UpdateJobFunction
  workflowConfig: WorkflowConfig
  workflowHandler: WorkflowHandler
}

export type JobRunStatus = 'error' | 'error-reached-max-retries' | 'success'

export type RunJobResult = {
  status: JobRunStatus
}

export const runJob = async ({
  job,
  req,
  silent,
  updateJob,
  workflowConfig,
  workflowHandler,
}: Args): Promise<RunJobResult> => {
  // Run the job
  try {
    await workflowHandler({
      inlineTask: getRunTaskFunction(job, workflowConfig, req, true, updateJob),
      job,
      req,
      tasks: getRunTaskFunction(job, workflowConfig, req, false, updateJob),
    })
  } catch (error) {
    if (error instanceof JobCancelledError) {
      throw error // Job cancellation is handled in a top-level error handler, as higher up code may themselves throw this error
    }
    if (error instanceof TaskError) {
      const { hasFinalError } = await handleTaskError({
        error,
        req,
        silent,
        updateJob,
      })

      return {
        status: hasFinalError ? 'error-reached-max-retries' : 'error',
      }
    }

    const { hasFinalError } = await handleWorkflowError({
      error:
        error instanceof WorkflowError
          ? error
          : new WorkflowError({
              job,
              message:
                typeof error === 'object' && error && 'message' in error
                  ? (error.message as string)
                  : 'An unhandled error occurred',
              workflowConfig,
            }),
      req,
      silent,
      updateJob,
    })

    return {
      status: hasFinalError ? 'error-reached-max-retries' : 'error',
    }
  }

  // Workflow has completed successfully
  // Do not update the job log here, as that would result in unnecessary db calls when using postgres.
  // Solely updating simple fields here will result in optimized db calls.
  // Job log modifications are already updated at the end of the runTask function.
  await updateJob({
    completedAt: getCurrentDate().toISOString(),
    processing: false,
    totalTried: (job.totalTried ?? 0) + 1,
  })

  return {
    status: 'success',
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/payload/src/queues/operations/runJobs/runJSONJob/index.ts

```typescript
import type { Job } from '../../../../index.js'
import type { PayloadRequest } from '../../../../types/index.js'
import type { WorkflowJSON, WorkflowStep } from '../../../config/types/workflowJSONTypes.js'
import type { WorkflowConfig } from '../../../config/types/workflowTypes.js'
import type { RunJobsSilent } from '../../../localAPI.js'
import type { UpdateJobFunction } from '../runJob/getUpdateJobFunction.js'
import type { JobRunStatus } from '../runJob/index.js'

import { handleWorkflowError } from '../../../errors/handleWorkflowError.js'
import { WorkflowError } from '../../../errors/index.js'
import { getCurrentDate } from '../../../utilities/getCurrentDate.js'
import { getRunTaskFunction } from '../runJob/getRunTaskFunction.js'

type Args = {
  job: Job
  req: PayloadRequest
  /**
   * If set to true, the job system will not log any output to the console (for both info and error logs).
   * Can be an option for more granular control over logging.
   *
   * This will not automatically affect user-configured logs (e.g. if you call `console.log` or `payload.logger.info` in your job code).
   *
   * @default false
   */
  silent?: RunJobsSilent
  updateJob: UpdateJobFunction
  workflowConfig: WorkflowConfig
  workflowHandler: WorkflowJSON
}

export type RunJSONJobResult = {
  status: JobRunStatus
}

export const runJSONJob = async ({
  job,
  req,
  silent = false,
  updateJob,
  workflowConfig,
  workflowHandler,
}: Args): Promise<RunJSONJobResult> => {
  const stepsToRun: WorkflowStep<string>[] = []

  for (const step of workflowHandler) {
    if ('task' in step) {
      if (job?.taskStatus?.[step.task]?.[step.id]?.complete) {
        continue
      }
    } else {
      if (job?.taskStatus?.['inline']?.[step.id]?.complete) {
        continue
      }
    }
    if (step.condition && !step.condition({ job })) {
      continue
    }
    stepsToRun.push(step)
  }

  const tasks = getRunTaskFunction(job, workflowConfig, req, false, updateJob)
  const inlineTask = getRunTaskFunction(job, workflowConfig, req, true, updateJob)

  // Run the job
  try {
    await Promise.all(
      stepsToRun.map(async (step) => {
        if ('task' in step) {
          await tasks[step.task]!(step.id, {
            input: step.input ? step.input({ job }) : {},
            retries: step.retries,
          })
        } else {
          await inlineTask(step.id, {
            retries: step.retries,
            task: step.inlineTask as any, // TODO: Fix type
          })
        }
      }),
    )
  } catch (error) {
    const { hasFinalError } = await handleWorkflowError({
      error:
        error instanceof WorkflowError
          ? error
          : new WorkflowError({
              job,
              message:
                typeof error === 'object' && error && 'message' in error
                  ? (error.message as string)
                  : 'An unhandled error occurred',
              workflowConfig,
            }),
      silent,

      req,
      updateJob,
    })

    return {
      status: hasFinalError ? 'error-reached-max-retries' : 'error',
    }
  }

  // Check if workflow has completed
  let workflowCompleted = false
  for (const [slug, map] of Object.entries(job.taskStatus)) {
    for (const [id, taskStatus] of Object.entries(map)) {
      if (taskStatus.complete) {
        const step = workflowHandler.find((step) => {
          if ('task' in step) {
            return step.task === slug && step.id === id
          } else {
            return step.id === id && slug === 'inline'
          }
        })
        if (step?.completesJob) {
          workflowCompleted = true
          break
        }
      }
    }
  }

  if (workflowCompleted) {
    await updateJob({
      completedAt: getCurrentDate().toISOString(),
      processing: false,
      totalTried: (job.totalTried ?? 0) + 1,
    })

    return {
      status: 'success',
    }
  } else {
    // Retry the job - no need to bump processing or totalTried as this does not count as a retry. A condition of a different task might have just opened up!
    return await runJSONJob({
      job,
      req,
      updateJob,
      workflowConfig,
      workflowHandler,
    })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: getCurrentDate.ts]---
Location: payload-main/packages/payload/src/queues/utilities/getCurrentDate.ts

```typescript
/**
 * Globals that are used by our integration tests to modify the behavior of the job system during runtime.
 * This is useful to avoid having to wait for the cron jobs to run, or to pause auto-running jobs.
 */
export const _internal_jobSystemGlobals = {
  getCurrentDate: () => {
    return new Date()
  },
  shouldAutoRun: true,
  shouldAutoSchedule: true,
}

export function _internal_resetJobSystemGlobals() {
  _internal_jobSystemGlobals.getCurrentDate = () => new Date()
  _internal_jobSystemGlobals.shouldAutoRun = true
  _internal_jobSystemGlobals.shouldAutoSchedule = true
}

export const getCurrentDate: () => Date = () => {
  return _internal_jobSystemGlobals.getCurrentDate()
}
```

--------------------------------------------------------------------------------

---[FILE: getJobTaskStatus.ts]---
Location: payload-main/packages/payload/src/queues/utilities/getJobTaskStatus.ts

```typescript
import type { Job } from '../../index.js'
import type { JobTaskStatus } from '../config/types/workflowTypes.js'

type Args = {
  jobLog: Job['log']
}

export const getJobTaskStatus = ({ jobLog }: Args): JobTaskStatus => {
  const taskStatus: JobTaskStatus = {}

  if (!jobLog || !Array.isArray(jobLog)) {
    return taskStatus
  }

  // First, add (in order) the steps from the config to
  // our status map
  for (const loggedJob of jobLog) {
    if (!taskStatus[loggedJob.taskSlug]) {
      taskStatus[loggedJob.taskSlug] = {}
    }
    if (!taskStatus[loggedJob.taskSlug]?.[loggedJob.taskID]) {
      taskStatus[loggedJob.taskSlug]![loggedJob.taskID] = {
        complete: loggedJob.state === 'succeeded',
        input: loggedJob.input,
        output: loggedJob.output,
        taskSlug: loggedJob.taskSlug,
        totalTried: 1,
      }
    } else {
      const newTaskStatus = taskStatus[loggedJob.taskSlug]![loggedJob.taskID]!
      newTaskStatus.totalTried += 1

      if (loggedJob.state === 'succeeded') {
        newTaskStatus.complete = true
        // As the task currently saved in taskStatus has likely failed and thus has no
        // Output data, we need to update it with the new data from the successful task
        newTaskStatus.output = loggedJob.output
        newTaskStatus.input = loggedJob.input
        newTaskStatus.taskSlug = loggedJob.taskSlug
      }
      taskStatus[loggedJob.taskSlug]![loggedJob.taskID] = newTaskStatus
    }
  }

  return taskStatus
}
```

--------------------------------------------------------------------------------

---[FILE: updateJob.ts]---
Location: payload-main/packages/payload/src/queues/utilities/updateJob.ts

```typescript
import type { ManyOptions } from '../../collections/operations/local/update.js'
import type { UpdateJobsArgs } from '../../database/types.js'
import type { Job } from '../../index.js'
import type { PayloadRequest, Sort, Where } from '../../types/index.js'

import { jobAfterRead, jobsCollectionSlug } from '../config/collection.js'

type BaseArgs = {
  data: Partial<Job>
  depth?: number
  disableTransaction?: boolean
  limit?: number
  req: PayloadRequest
  returning?: boolean
}

type ArgsByID = {
  id: number | string
  limit?: never
  sort?: never
  where?: never
}

type ArgsWhere = {
  id?: never
  limit?: number
  sort?: Sort
  where: Where
}

type RunJobsArgs = (ArgsByID | ArgsWhere) & BaseArgs

/**
 * Convenience method for updateJobs by id
 */
export async function updateJob(args: ArgsByID & BaseArgs) {
  const result = await updateJobs(args)
  if (result) {
    return result[0]
  }
}

/**
 * Helper for updating jobs in the most performant way possible.
 * Handles deciding whether it can used direct db methods or not, and if so,
 * manually runs the afterRead hook that populates the `taskStatus` property.
 */
export async function updateJobs({
  id,
  data,
  depth,
  disableTransaction,
  limit: limitArg,
  req,
  returning,
  sort,
  where: whereArg,
}: RunJobsArgs): Promise<Job[] | null> {
  const limit = id ? 1 : limitArg
  const where = id ? { id: { equals: id } } : whereArg

  if (depth || req.payload.config?.jobs?.runHooks) {
    const result = await req.payload.update({
      id,
      collection: jobsCollectionSlug,
      data,
      depth,
      disableTransaction,
      limit,
      req,
      where,
    } as ManyOptions<any, any>)
    if (returning === false || !result) {
      return null
    }
    return result.docs as Job[]
  }

  const jobReq = {
    transactionID:
      req.payload.db.name !== 'mongoose'
        ? ((await req.payload.db.beginTransaction()) as string)
        : undefined,
  }

  if (typeof data.updatedAt === 'undefined') {
    // Ensure updatedAt date is always updated
    data.updatedAt = new Date().toISOString()
  }

  const args: UpdateJobsArgs = id
    ? {
        id,
        data,
        req: jobReq,
        returning,
      }
    : {
        data,
        limit,
        req: jobReq,
        returning,
        sort,
        where: where as Where,
      }

  const updatedJobs: Job[] | null = await req.payload.db.updateJobs(args)

  if (req.payload.db.name !== 'mongoose' && jobReq.transactionID) {
    await req.payload.db.commitTransaction(jobReq.transactionID)
  }

  if (returning === false || !updatedJobs?.length) {
    return null
  }

  return updatedJobs.map((updatedJob) => {
    return jobAfterRead({
      config: req.payload.config,
      doc: updatedJob,
    })
  })
}
```

--------------------------------------------------------------------------------

---[FILE: getLocalI18n.ts]---
Location: payload-main/packages/payload/src/translations/getLocalI18n.ts

```typescript
import type { AcceptedLanguages } from '@payloadcms/translations'

import { initI18n } from '@payloadcms/translations'

import type { SanitizedConfig } from '../config/types.js'

export const getLocalI18n = async ({
  config,
  language,
}: {
  config: SanitizedConfig
  language: AcceptedLanguages
}) =>
  initI18n({
    config: config.i18n,
    context: 'api',
    language,
  })
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: payload-main/packages/payload/src/types/constants.ts

```typescript
export const validOperators = [
  'equals',
  'contains',
  'not_equals',
  'in',
  'all',
  'not_in',
  'exists',
  'greater_than',
  'greater_than_equal',
  'less_than',
  'less_than_equal',
  'like',
  'not_like',
  'within',
  'intersects',
  'near',
] as const

export type Operator = (typeof validOperators)[number]

export const validOperatorSet = new Set<Operator>(validOperators)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/payload/src/types/index.ts

```typescript
import type { I18n, TFunction } from '@payloadcms/translations'
import type DataLoader from 'dataloader'
import type { OptionalKeys, RequiredKeys } from 'ts-essentials'
import type { URL } from 'url'

import type {
  DataFromCollectionSlug,
  TypeWithID,
  TypeWithTimestamps,
} from '../collections/config/types.js'
import type payload from '../index.js'
import type {
  CollectionSlug,
  DataFromGlobalSlug,
  GlobalSlug,
  Payload,
  RequestContext,
  TypedCollectionJoins,
  TypedCollectionSelect,
  TypedFallbackLocale,
  TypedLocale,
  TypedUser,
} from '../index.js'
import type { Operator } from './constants.js'
export type { Payload } from '../index.js'

export type CustomPayloadRequestProperties = {
  context: RequestContext
  /** The locale that should be used for a field when it is not translated to the requested locale */
  fallbackLocale?: TypedFallbackLocale
  i18n: I18n
  /**
   * The requested locale if specified
   * Only available for localized collections
   *
   * Suppressing warning below as it is a valid use case - won't be an issue if generated types exist
   */
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  locale?: 'all' | TypedLocale
  /**
   * The payload object
   */
  payload: typeof payload
  /**
   * The context in which the request is being made
   */
  payloadAPI: 'GraphQL' | 'local' | 'REST'
  /** Optimized document loader */
  payloadDataLoader: {
    /**
     * Wraps `payload.find` with a cache to deduplicate requests
     * @experimental This is may be replaced by a more robust cache strategy in future versions
     * By calling this method with the same arguments many times in one request, it will only be handled one time
     * const result = await req.payloadDataLoader.find({
     *  collection,
     *  req,
     *  where: findWhere,
     * })
     */
    find: Payload['find']
  } & DataLoader<string, TypeWithID>
  /** Resized versions of the image that was uploaded during this request */
  payloadUploadSizes?: Record<string, Buffer>
  /** Query params on the request */
  query: Record<string, unknown>
  /** Any response headers that are required to be set when a response is sent */
  responseHeaders?: Headers
  /** The route parameters
   * @example
   * /:collection/:id -> /posts/123
   * { collection: 'posts', id: '123' }
   */
  routeParams?: Record<string, unknown>
  /** Translate function - duplicate of i18n.t */
  t: TFunction
  /**
   * Identifier for the database transaction for interactions in a single, all-or-nothing operation.
   * Can also be used to ensure consistency when multiple operations try to create a transaction concurrently on the same request.
   */
  transactionID?: number | Promise<number | string> | string
  /**
   * Used to ensure consistency when multiple operations try to create a transaction concurrently on the same request
   * @deprecated This is not used anywhere, instead `transactionID` is used for the above. Will be removed in next major version.
   */
  transactionIDPromise?: Promise<void>
  /** The signed-in user */
  user: null | TypedUser
} & Pick<
  URL,
  'hash' | 'host' | 'href' | 'origin' | 'pathname' | 'port' | 'protocol' | 'search' | 'searchParams'
>
type PayloadRequestData = {
  /**
   * Data from the request body
   *
   * Within Payload operations, i.e. hooks, data will be there
   * BUT in custom endpoints it will not be, you will need to
   * use either:
   *  1. `const data = await req.json()`
   *
   *  2. import { addDataAndFileToRequest } from 'payload'
   *    `await addDataAndFileToRequest(req)`
   *
   * You should not expect this object to be the document data. It is the request data.
   * */
  data?: JsonObject
  /** The file on the request, same rules apply as the `data` property */
  file?: {
    /**
     * Context of the file when it was uploaded via client side.
     */
    clientUploadContext?: unknown
    data: Buffer
    mimetype: string
    name: string
    size: number
    tempFilePath?: string
  }
}
export interface PayloadRequest
  extends CustomPayloadRequestProperties,
    Partial<Request>,
    PayloadRequestData {
  headers: Request['headers']
}

export type { Operator }

// Makes it so things like passing new Date() will error
export type JsonValue = JsonArray | JsonObject | unknown //Date | JsonArray | JsonObject | boolean | null | number | string // TODO: Evaluate proper, strong type for this

export type JsonArray = Array<JsonValue>

export interface JsonObject {
  [key: string]: any
}

export type WhereField = {
  // any json-serializable value
  [key in Operator]?: JsonValue
}

export type Where = {
  [key: string]: Where[] | WhereField
  // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
  and?: Where[]
  // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
  or?: Where[]
}

export type Sort = Array<string> | string

type SerializableValue = boolean | number | object | string
export type DefaultValue =
  | ((args: {
      locale?: TypedLocale
      req: PayloadRequest
      user: PayloadRequest['user']
    }) => SerializableValue)
  | SerializableValue

/**
 * Applies pagination for join fields for including collection relationships
 */
export type JoinQuery<TSlug extends CollectionSlug = string> =
  TypedCollectionJoins[TSlug] extends Record<string, string>
    ?
        | false
        | Partial<{
            [K in keyof TypedCollectionJoins[TSlug]]:
              | {
                  count?: boolean
                  limit?: number
                  page?: number
                  sort?: string
                  where?: Where
                }
              | false
          }>
    : never

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Document = any

export type Operation = 'create' | 'delete' | 'read' | 'update'
export type VersionOperations = 'readVersions'
export type AuthOperations = 'unlock'
export type AllOperations = AuthOperations | Operation | VersionOperations

export function docHasTimestamps(doc: any): doc is TypeWithTimestamps {
  return doc?.createdAt && doc?.updatedAt
}

export type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N // This is a commonly used trick to detect 'any'
export type IsAny<T> = IfAny<T, true, false>
export type ReplaceAny<T, DefaultType> = IsAny<T> extends true ? DefaultType : T

export type SelectIncludeType = {
  [k: string]: SelectIncludeType | true
}

export type SelectExcludeType = {
  [k: string]: false | SelectExcludeType
}

export type SelectMode = 'exclude' | 'include'

export type SelectType = SelectExcludeType | SelectIncludeType

export type ApplyDisableErrors<T, DisableErrors = false> = false extends DisableErrors
  ? T
  : null | T

export type TransformDataWithSelect<
  Data extends Record<string, any>,
  Select extends SelectType,
> = Select extends never
  ? Data
  : string extends keyof Select
    ? Data
    : // START Handle types when they aren't generated
      // For example in any package in this repository outside of tests / plugins
      // This stil gives us autocomplete when using include select mode, i.e select: {title :true} returns type {title: any, id: string | number}
      string extends keyof Omit<Data, 'id'>
      ? Select extends SelectIncludeType
        ? {
            [K in Data extends TypeWithID ? 'id' | keyof Select : keyof Select]: K extends 'id'
              ? number | string
              : unknown
          }
        : Data
      : // END Handle types when they aren't generated
        // Handle include mode
        Select extends SelectIncludeType
        ? {
            [K in keyof Data as K extends keyof Select
              ? Select[K] extends object | true
                ? K
                : never
              : // select 'id' always
                K extends 'id'
                ? K
                : never]: Data[K]
          }
        : // Handle exclude mode
          {
            [K in keyof Data as K extends keyof Select
              ? Select[K] extends object | undefined
                ? K
                : never
              : K]: Data[K]
          }

export type TransformCollectionWithSelect<
  TSlug extends CollectionSlug,
  TSelect extends SelectType,
> = TSelect extends SelectType
  ? TransformDataWithSelect<DataFromCollectionSlug<TSlug>, TSelect>
  : DataFromCollectionSlug<TSlug>

export type TransformGlobalWithSelect<
  TSlug extends GlobalSlug,
  TSelect extends SelectType,
> = TSelect extends SelectType
  ? TransformDataWithSelect<DataFromGlobalSlug<TSlug>, TSelect>
  : DataFromGlobalSlug<TSlug>

export type PopulateType = Partial<TypedCollectionSelect>

export type ResolvedFilterOptions = { [collection: string]: Where }

export type PickPreserveOptional<T, K extends keyof T> = Partial<
  Pick<T, Extract<K, OptionalKeys<T>>>
> &
  Pick<T, Extract<K, RequiredKeys<T>>>
```

--------------------------------------------------------------------------------

---[FILE: canResizeImage.ts]---
Location: payload-main/packages/payload/src/uploads/canResizeImage.ts

```typescript
export function canResizeImage(mimeType: string): boolean {
  return (
    ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/tiff', 'image/avif'].indexOf(
      mimeType,
    ) > -1
  )
}
```

--------------------------------------------------------------------------------

---[FILE: checkFileAccess.ts]---
Location: payload-main/packages/payload/src/uploads/checkFileAccess.ts

```typescript
import type { Collection, TypeWithID } from '../collections/config/types.js'
import type { PayloadRequest, Where } from '../types/index.js'

import { executeAccess } from '../auth/executeAccess.js'
import { Forbidden } from '../errors/Forbidden.js'

export const checkFileAccess = async ({
  collection,
  filename,
  req,
}: {
  collection: Collection
  filename: string
  req: PayloadRequest
}): Promise<TypeWithID | undefined> => {
  if (filename.includes('../') || filename.includes('..\\')) {
    throw new Forbidden(req.t)
  }
  const { config } = collection

  const accessResult = await executeAccess(
    { data: { filename }, isReadingStaticFile: true, req },
    config.access.read,
  )

  if (typeof accessResult === 'object') {
    const queryToBuild: Where = {
      and: [
        {
          or: [
            {
              filename: {
                equals: filename,
              },
            },
          ],
        },
        accessResult,
      ],
    }

    if (config.upload.imageSizes) {
      config.upload.imageSizes.forEach(({ name }) => {
        queryToBuild.and?.[0]?.or?.push({
          [`sizes.${name}.filename`]: {
            equals: filename,
          },
        })
      })
    }

    const doc = await req.payload.db.findOne({
      collection: config.slug,
      req,
      where: queryToBuild,
    })

    if (!doc) {
      throw new Forbidden(req.t)
    }

    return doc
  }
}
```

--------------------------------------------------------------------------------

````
