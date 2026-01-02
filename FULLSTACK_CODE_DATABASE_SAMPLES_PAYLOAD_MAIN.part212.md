---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 212
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 212 of 695)

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

---[FILE: handleTaskError.ts]---
Location: payload-main/packages/payload/src/queues/errors/handleTaskError.ts

```typescript
import ObjectIdImport from 'bson-objectid'

import type { JobLog, PayloadRequest } from '../../index.js'
import type { RunJobsSilent } from '../localAPI.js'
import type { UpdateJobFunction } from '../operations/runJobs/runJob/getUpdateJobFunction.js'
import type { TaskError } from './index.js'

import { getCurrentDate } from '../utilities/getCurrentDate.js'
import { calculateBackoffWaitUntil } from './calculateBackoffWaitUntil.js'
import { getWorkflowRetryBehavior } from './getWorkflowRetryBehavior.js'

const ObjectId = 'default' in ObjectIdImport ? ObjectIdImport.default : ObjectIdImport

export async function handleTaskError({
  error,
  req,
  silent = false,
  updateJob,
}: {
  error: TaskError
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
}): Promise<{
  hasFinalError: boolean
}> {
  const {
    executedAt,
    input,
    job,
    output,
    parent,
    retriesConfig,
    taskConfig,
    taskID,
    taskSlug,
    taskStatus,
    workflowConfig,
  } = error.args

  if (taskConfig?.onFail) {
    await taskConfig.onFail({
      input,
      job,
      req,
      taskStatus,
    })
  }

  const errorJSON = {
    name: error.name,
    cancelled: Boolean('cancelled' in error && error.cancelled),
    message: error.message,
    stack: error.stack,
  }

  const currentDate = getCurrentDate()

  if (job.waitUntil) {
    // Check if waitUntil is in the past
    const waitUntil = new Date(job.waitUntil)
    if (waitUntil < currentDate) {
      // Outdated waitUntil, remove it
      delete job.waitUntil
    }
  }

  let maxRetries: number = 0

  if (retriesConfig?.attempts === undefined || retriesConfig?.attempts === null) {
    // Inherit retries from workflow config, if they are undefined and the workflow config has retries configured
    if (workflowConfig.retries !== undefined && workflowConfig.retries !== null) {
      maxRetries =
        typeof workflowConfig.retries === 'object'
          ? typeof workflowConfig.retries.attempts === 'number'
            ? workflowConfig.retries.attempts
            : 0
          : workflowConfig.retries
    } else {
      maxRetries = 0
    }
  } else {
    maxRetries = retriesConfig.attempts
  }

  const taskLogToPush: JobLog = {
    id: new ObjectId().toHexString(),
    completedAt: currentDate.toISOString(),
    error: errorJSON,
    executedAt: executedAt.toISOString(),
    input,
    output: output ?? {},
    parent: req.payload.config.jobs.addParentToTaskLog ? parent : undefined,
    state: 'failed',
    taskID,
    taskSlug,
  }

  if (!taskStatus?.complete && (taskStatus?.totalTried ?? 0) >= maxRetries) {
    /**
     * Task reached max retries => workflow will not retry
     */

    await updateJob({
      error: errorJSON,
      hasError: true,
      log: {
        $push: taskLogToPush,
      } as any,
      processing: false,
      totalTried: (job.totalTried ?? 0) + 1,
      waitUntil: job.waitUntil,
    })

    if (!silent || (typeof silent === 'object' && !silent.error)) {
      req.payload.logger.error({
        err: error,
        job,
        msg: `Error running task ${taskID}. Attempt ${job.totalTried} - max retries reached`,
        taskSlug,
      })
    }
    return {
      hasFinalError: true,
    }
  }

  /**
   * Task can retry:
   * - If workflow can retry, allow it to retry
   * - If workflow reached max retries, do not retry and set final error
   */

  // First set task waitUntil - if the workflow waitUntil is later, it will be updated later
  const taskWaitUntil: Date = calculateBackoffWaitUntil({
    retriesConfig,
    totalTried: taskStatus?.totalTried ?? 0,
  })

  // Update job's waitUntil only if this waitUntil is later than the current one
  if (!job.waitUntil || taskWaitUntil > new Date(job.waitUntil)) {
    job.waitUntil = taskWaitUntil.toISOString()
  }

  const { hasFinalError, maxWorkflowRetries, waitUntil } = getWorkflowRetryBehavior({
    job,
    retriesConfig: workflowConfig.retries,
  })

  if (!silent || (typeof silent === 'object' && !silent.error)) {
    req.payload.logger.error({
      err: error,
      job,
      msg: `Error running task ${taskID}. Attempt ${job.totalTried + 1}${maxWorkflowRetries !== undefined ? '/' + (maxWorkflowRetries + 1) : ''}`,
      taskSlug,
    })
  }

  // Update job's waitUntil only if this waitUntil is later than the current one
  if (waitUntil && (!job.waitUntil || waitUntil > new Date(job.waitUntil))) {
    job.waitUntil = waitUntil.toISOString()
  }

  // Tasks update the job if they error - but in case there is an unhandled error (e.g. in the workflow itself, not in a task)
  // we need to ensure the job is updated to reflect the error
  await updateJob({
    error: hasFinalError ? errorJSON : undefined,
    hasError: hasFinalError, // If reached max retries => final error. If hasError is true this job will not be retried
    log: {
      $push: taskLogToPush,
    } as any,
    processing: false,
    totalTried: (job.totalTried ?? 0) + 1,
    waitUntil: job.waitUntil,
  })

  return {
    hasFinalError,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: handleWorkflowError.ts]---
Location: payload-main/packages/payload/src/queues/errors/handleWorkflowError.ts

```typescript
import type { PayloadRequest } from '../../index.js'
import type { RunJobsSilent } from '../localAPI.js'
import type { UpdateJobFunction } from '../operations/runJobs/runJob/getUpdateJobFunction.js'
import type { WorkflowError } from './index.js'

import { getCurrentDate } from '../utilities/getCurrentDate.js'
import { getWorkflowRetryBehavior } from './getWorkflowRetryBehavior.js'

/**
 * This is called if a workflow catches an error. It determines if it's a final error
 * or not and handles logging.
 * A Workflow error = error that happens anywhere in between running tasks.
 *
 * This function assumes that the error is not a TaskError, but a WorkflowError. If a task errors,
 * only a TaskError should be thrown, not a WorkflowError.
 */
export async function handleWorkflowError({
  error,
  req,
  silent = false,
  updateJob,
}: {
  error: WorkflowError
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
}): Promise<{
  hasFinalError: boolean
}> {
  const { job, workflowConfig } = error.args

  const errorJSON = {
    name: error.name,
    cancelled: Boolean('cancelled' in error && error.cancelled),
    message: error.message,
    stack: error.stack,
  }

  const { hasFinalError, maxWorkflowRetries, waitUntil } = getWorkflowRetryBehavior({
    job,
    retriesConfig: workflowConfig.retries!,
  })

  if (!hasFinalError) {
    if (job.waitUntil) {
      // Check if waitUntil is in the past
      const waitUntil = new Date(job.waitUntil)
      if (waitUntil < getCurrentDate()) {
        // Outdated waitUntil, remove it
        delete job.waitUntil
      }
    }

    // Update job's waitUntil only if this waitUntil is later than the current one
    if (waitUntil && (!job.waitUntil || waitUntil > new Date(job.waitUntil))) {
      job.waitUntil = waitUntil.toISOString()
    }
  }

  const jobLabel = job.workflowSlug || `Task: ${job.taskSlug}`

  if (!silent || (typeof silent === 'object' && !silent.error)) {
    req.payload.logger.error({
      err: error,
      msg: `Error running job ${jobLabel} id: ${job.id} attempt ${job.totalTried + 1}${maxWorkflowRetries !== undefined ? '/' + (maxWorkflowRetries + 1) : ''}`,
    })
  }

  // Tasks update the job if they error - but in case there is an unhandled error (e.g. in the workflow itself, not in a task)
  // we need to ensure the job is updated to reflect the error
  await updateJob({
    error: errorJSON,
    hasError: hasFinalError, // If reached max retries => final error. If hasError is true this job will not be retried
    processing: false,
    totalTried: (job.totalTried ?? 0) + 1,
    waitUntil: job.waitUntil,
  })

  return {
    hasFinalError,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/payload/src/queues/errors/index.ts

```typescript
import type { Job, SingleTaskStatus, WorkflowConfig } from '../../index.js'
import type { RetryConfig, TaskConfig } from '../config/types/taskTypes.js'
import type { TaskParent } from '../operations/runJobs/runJob/getRunTaskFunction.js'

export type TaskErrorArgs = {
  executedAt: Date
  input?: object
  job: Job
  message: string
  output?: object
  parent?: TaskParent
  retriesConfig: RetryConfig
  taskConfig?: TaskConfig<string>
  taskID: string
  taskSlug: string
  taskStatus: null | SingleTaskStatus<string>
  workflowConfig: WorkflowConfig
}

export type WorkflowErrorArgs = {
  job: Job
  message: string
  workflowConfig: WorkflowConfig
}

export class TaskError extends Error {
  args: TaskErrorArgs
  constructor(args: TaskErrorArgs) {
    super(args.message)
    this.args = args
  }
}
export class WorkflowError extends Error {
  args: WorkflowErrorArgs

  constructor(args: WorkflowErrorArgs) {
    super(args.message)
    this.args = args
  }
}

export class JobCancelledError extends Error {
  args: {
    job: Job
  }

  constructor(args: { job: Job }) {
    super(`Job ${args.job.id} was cancelled`)
    this.args = args
  }
}
```

--------------------------------------------------------------------------------

---[FILE: countRunnableOrActiveJobsForQueue.ts]---
Location: payload-main/packages/payload/src/queues/operations/handleSchedules/countRunnableOrActiveJobsForQueue.ts

```typescript
import type { PayloadRequest, Where } from '../../../types/index.js'
import type { TaskType } from '../../config/types/taskTypes.js'
import type { WorkflowTypes } from '../../config/types/workflowTypes.js'

/**
 * Gets all queued jobs that can be run. This means they either:
 * - failed but do not have a definitive error => can be retried
 * - are currently processing
 * - have not been started yet
 */
export async function countRunnableOrActiveJobsForQueue({
  onlyScheduled = false,
  queue,
  req,
  taskSlug,
  workflowSlug,
}: {
  /**
   * If true, this counts only jobs that have been created through the scheduling system.
   *
   * @default false
   */
  onlyScheduled?: boolean
  queue: string
  req: PayloadRequest
  taskSlug?: TaskType
  workflowSlug?: WorkflowTypes
}): Promise<number> {
  const and: Where[] = [
    {
      queue: {
        equals: queue,
      },
    },

    {
      completedAt: { exists: false },
    },
    {
      error: { exists: false },
    },
  ]

  if (taskSlug) {
    and.push({
      taskSlug: {
        equals: taskSlug,
      },
    })
  } else if (workflowSlug) {
    and.push({
      workflowSlug: {
        equals: workflowSlug,
      },
    })
  }
  if (onlyScheduled) {
    and.push({
      'meta.scheduled': {
        equals: true,
      },
    })
  }

  const runnableOrActiveJobsForQueue = await req.payload.db.count({
    collection: 'payload-jobs',
    req,
    where: {
      and,
    },
  })

  return runnableOrActiveJobsForQueue.totalDocs
}
```

--------------------------------------------------------------------------------

---[FILE: defaultAfterSchedule.ts]---
Location: payload-main/packages/payload/src/queues/operations/handleSchedules/defaultAfterSchedule.ts

```typescript
import type { AfterScheduleFn } from '../../config/types/index.js'

import { type JobStats, jobStatsGlobalSlug } from '../../config/global.js'
import { getCurrentDate } from '../../utilities/getCurrentDate.js'

type JobStatsScheduledRuns = NonNullable<
  NonNullable<NonNullable<JobStats['stats']>['scheduledRuns']>['queues']
>[string]

export const defaultAfterSchedule: AfterScheduleFn = async ({ jobStats, queueable, req }) => {
  const existingQueuesConfig =
    jobStats?.stats?.scheduledRuns?.queues?.[queueable.scheduleConfig.queue] || {}

  const queueConfig: JobStatsScheduledRuns = {
    ...existingQueuesConfig,
  }
  if (queueable.taskConfig) {
    ;(queueConfig.tasks ??= {})[queueable.taskConfig.slug] = {
      lastScheduledRun: getCurrentDate().toISOString(),
    }
  } else if (queueable.workflowConfig) {
    ;(queueConfig.workflows ??= {})[queueable.workflowConfig.slug] = {
      lastScheduledRun: getCurrentDate().toISOString(),
    }
  }

  // Add to payload-jobs-stats global regardless of the status
  if (jobStats) {
    await req.payload.db.updateGlobal({
      slug: jobStatsGlobalSlug,
      data: {
        ...(jobStats || {}),
        stats: {
          ...(jobStats?.stats || {}),
          scheduledRuns: {
            ...(jobStats?.stats?.scheduledRuns || {}),
            queues: {
              ...(jobStats?.stats?.scheduledRuns?.queues || {}),
              [queueable.scheduleConfig.queue]: queueConfig,
            },
          },
        },
        updatedAt: new Date().toISOString(),
      } as JobStats,
      req,
      returning: false,
    })
  } else {
    await req.payload.db.createGlobal({
      slug: jobStatsGlobalSlug,
      data: {
        createdAt: getCurrentDate().toISOString(),
        stats: {
          scheduledRuns: {
            queues: {
              [queueable.scheduleConfig.queue]: queueConfig,
            },
          },
        },
      } as JobStats,
      req,
      returning: false,
    })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: defaultBeforeSchedule.ts]---
Location: payload-main/packages/payload/src/queues/operations/handleSchedules/defaultBeforeSchedule.ts

```typescript
import type { BeforeScheduleFn } from '../../config/types/index.js'

import { countRunnableOrActiveJobsForQueue } from './countRunnableOrActiveJobsForQueue.js'

export const defaultBeforeSchedule: BeforeScheduleFn = async ({ queueable, req }) => {
  // All tasks in that queue that are either currently processing or can be run
  const runnableOrActiveJobsForQueue = await countRunnableOrActiveJobsForQueue({
    onlyScheduled: true,
    queue: queueable.scheduleConfig.queue,
    req,
    taskSlug: queueable.taskConfig?.slug,
    workflowSlug: queueable.workflowConfig?.slug,
  })

  return {
    input: {},
    shouldSchedule: runnableOrActiveJobsForQueue === 0,
    waitUntil: queueable.waitUntil,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: getQueuesWithSchedules.ts]---
Location: payload-main/packages/payload/src/queues/operations/handleSchedules/getQueuesWithSchedules.ts

```typescript
import type { SanitizedJobsConfig, ScheduleConfig } from '../../config/types/index.js'
import type { TaskConfig } from '../../config/types/taskTypes.js'
import type { WorkflowConfig } from '../../config/types/workflowTypes.js'

type QueuesWithSchedules = {
  [queue: string]: {
    schedules: {
      scheduleConfig: ScheduleConfig
      taskConfig?: TaskConfig
      workflowConfig?: WorkflowConfig
    }[]
  }
}

export const getQueuesWithSchedules = ({
  jobsConfig,
}: {
  jobsConfig: SanitizedJobsConfig
}): QueuesWithSchedules => {
  const tasksWithSchedules =
    jobsConfig.tasks?.filter((task) => {
      return task.schedule?.length
    }) ?? []

  const workflowsWithSchedules =
    jobsConfig.workflows?.filter((workflow) => {
      return workflow.schedule?.length
    }) ?? []

  const queuesWithSchedules: QueuesWithSchedules = {}

  for (const task of tasksWithSchedules) {
    for (const schedule of task.schedule ?? []) {
      ;(queuesWithSchedules[schedule.queue] ??= { schedules: [] }).schedules.push({
        scheduleConfig: schedule,
        taskConfig: task,
      })
    }
  }
  for (const workflow of workflowsWithSchedules) {
    for (const schedule of workflow.schedule ?? []) {
      ;(queuesWithSchedules[schedule.queue] ??= { schedules: [] }).schedules.push({
        scheduleConfig: schedule,
        workflowConfig: workflow,
      })
    }
  }

  return queuesWithSchedules
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/payload/src/queues/operations/handleSchedules/index.ts

```typescript
import { Cron } from 'croner'

import type { Job, TaskConfig, WorkflowConfig } from '../../../index.js'
import type { PayloadRequest } from '../../../types/index.js'
import type { BeforeScheduleFn, Queueable, ScheduleConfig } from '../../config/types/index.js'

import { type JobStats, jobStatsGlobalSlug } from '../../config/global.js'
import { defaultAfterSchedule } from './defaultAfterSchedule.js'
import { defaultBeforeSchedule } from './defaultBeforeSchedule.js'
import { getQueuesWithSchedules } from './getQueuesWithSchedules.js'

export type HandleSchedulesResult = {
  errored: Queueable[]
  queued: Queueable[]
  skipped: Queueable[]
}

/**
 * On vercel, we cannot auto-schedule jobs using a Cron - instead, we'll use this same endpoint that can
 * also be called from Vercel Cron for auto-running jobs.
 *
 * The benefit of doing it like this instead of a separate endpoint is that we can run jobs immediately
 * after they are scheduled
 */
export async function handleSchedules({
  allQueues = false,
  queue: _queue,
  req,
}: {
  /**
   * If you want to schedule jobs from all queues, set this to true.
   * If you set this to true, the `queue` property will be ignored.
   *
   * @default false
   */
  allQueues?: boolean
  /**
   * If you want to only schedule jobs that are set to schedule in a specific queue, set this to the queue name.
   *
   * @default jobs from the `default` queue will be executed.
   */
  queue?: string
  req: PayloadRequest
}): Promise<HandleSchedulesResult> {
  const queue = _queue ?? 'default'
  const jobsConfig = req.payload.config.jobs
  const queuesWithSchedules = getQueuesWithSchedules({
    jobsConfig,
  })

  if (Object.keys(queuesWithSchedules).length === 0) {
    // No schedules defined => return early, before fetching jobsStatsGlobal, as the global may not even exist
    return {
      errored: [],
      queued: [],
      skipped: [],
    }
  }

  const stats: JobStats = await req.payload.db.findGlobal({
    slug: jobStatsGlobalSlug,
    req,
  })

  /**
   * Almost last step! Tasks and Workflows added here just need to be constraint-checked (e.g max. 1 running task etc.),
   * before we can queue them
   */
  const queueables: Queueable[] = []

  // Need to know when that particular job was last scheduled in that particular queue

  for (const [queueName, { schedules }] of Object.entries(queuesWithSchedules)) {
    if (!allQueues && queueName !== queue) {
      // If a queue is specified, only schedule jobs for that queue
      continue
    }
    for (const schedulable of schedules) {
      const queuable = checkQueueableTimeConstraints({
        queue: queueName,
        scheduleConfig: schedulable.scheduleConfig,
        stats,
        taskConfig: schedulable.taskConfig,
        workflowConfig: schedulable.workflowConfig,
      })
      if (queuable) {
        queueables.push(queuable)
      }
    }
  }

  const queued: Queueable[] = []
  const skipped: Queueable[] = []
  const errored: Queueable[] = []

  /**
   * Now queue, but check for constraints (= beforeSchedule) first.
   * Default constraint (= defaultBeforeSchedule): max. 1 running / scheduled task or workflow per queue
   */
  for (const queueable of queueables) {
    const { status } = await scheduleQueueable({
      queueable,
      req,
      stats,
    })
    switch (status) {
      case 'error':
        errored.push(queueable)
        break
      case 'skipped':
        skipped.push(queueable)
        break
      case 'success':
        queued.push(queueable)
        break
    }
  }
  return {
    errored,
    queued,
    skipped,
  }
}

export function checkQueueableTimeConstraints({
  queue,
  scheduleConfig,
  stats,
  taskConfig,
  workflowConfig,
}: {
  queue: string
  scheduleConfig: ScheduleConfig
  stats: JobStats
  taskConfig?: TaskConfig
  workflowConfig?: WorkflowConfig
}): false | Queueable {
  const queueScheduleStats = stats?.stats?.scheduledRuns?.queues?.[queue]

  const lastScheduledRun = taskConfig
    ? queueScheduleStats?.tasks?.[taskConfig.slug]?.lastScheduledRun
    : queueScheduleStats?.workflows?.[workflowConfig?.slug ?? '']?.lastScheduledRun

  const nextRun = new Cron(scheduleConfig.cron).nextRun(lastScheduledRun ?? undefined)

  if (!nextRun) {
    return false
  }
  return {
    scheduleConfig,
    taskConfig,
    waitUntil: nextRun,
    workflowConfig,
  }
}

export async function scheduleQueueable({
  queueable,
  req,
  stats,
}: {
  queueable: Queueable
  req: PayloadRequest
  stats: JobStats
}): Promise<{
  job?: Job<false>
  status: 'error' | 'skipped' | 'success'
}> {
  if (!queueable.taskConfig && !queueable.workflowConfig) {
    return {
      status: 'error',
    }
  }

  const beforeScheduleFn = queueable.scheduleConfig.hooks?.beforeSchedule
  const afterScheduleFN = queueable.scheduleConfig.hooks?.afterSchedule

  try {
    const beforeScheduleResult: Awaited<ReturnType<BeforeScheduleFn>> = await (
      beforeScheduleFn ?? defaultBeforeSchedule
    )({
      // @ts-expect-error we know defaultBeforeSchedule will never call itself => pass null
      defaultBeforeSchedule: beforeScheduleFn ? defaultBeforeSchedule : null,
      jobStats: stats,
      queueable,
      req,
    })

    if (!beforeScheduleResult.shouldSchedule) {
      await (afterScheduleFN ?? defaultAfterSchedule)({
        // @ts-expect-error we know defaultAfterchedule will never call itself => pass null
        defaultAfterSchedule: afterScheduleFN ? defaultAfterSchedule : null,
        jobStats: stats,
        queueable,
        req,
        status: 'skipped',
      })
      return {
        status: 'skipped',
      }
    }

    const job = (await req.payload.jobs.queue({
      input: beforeScheduleResult.input ?? {},
      meta: {
        scheduled: true,
      },
      queue: queueable.scheduleConfig.queue,
      req,
      task: queueable?.taskConfig?.slug,
      waitUntil: beforeScheduleResult.waitUntil,
      workflow: queueable.workflowConfig?.slug,
    } as Parameters<typeof req.payload.jobs.queue>[0])) as unknown as Job<false>

    await (afterScheduleFN ?? defaultAfterSchedule)({
      // @ts-expect-error we know defaultAfterchedule will never call itself => pass null
      defaultAfterSchedule: afterScheduleFN ? defaultAfterSchedule : null,
      job,
      jobStats: stats,
      queueable,
      req,
      status: 'success',
    })
    return {
      status: 'success',
    }
  } catch (error) {
    await (afterScheduleFN ?? defaultAfterSchedule)({
      // @ts-expect-error we know defaultAfterchedule will never call itself => pass null
      defaultAfterSchedule: afterScheduleFN ? defaultAfterSchedule : null,
      error: error as Error,
      jobStats: stats,
      queueable,
      req,
      status: 'error',
    })
    return {
      status: 'error',
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/payload/src/queues/operations/runJobs/index.ts

```typescript
import type { Job } from '../../../index.js'
import type { PayloadRequest, Sort, Where } from '../../../types/index.js'
import type { WorkflowJSON } from '../../config/types/workflowJSONTypes.js'
import type { WorkflowConfig, WorkflowHandler } from '../../config/types/workflowTypes.js'
import type { RunJobsSilent } from '../../localAPI.js'
import type { RunJobResult } from './runJob/index.js'

import { Forbidden } from '../../../errors/Forbidden.js'
import { isolateObjectProperty } from '../../../utilities/isolateObjectProperty.js'
import { jobsCollectionSlug } from '../../config/collection.js'
import { JobCancelledError } from '../../errors/index.js'
import { getCurrentDate } from '../../utilities/getCurrentDate.js'
import { updateJob, updateJobs } from '../../utilities/updateJob.js'
import { getUpdateJobFunction } from './runJob/getUpdateJobFunction.js'
import { importHandlerPath } from './runJob/importHandlerPath.js'
import { runJob } from './runJob/index.js'
import { runJSONJob } from './runJSONJob/index.js'

export type RunJobsArgs = {
  /**
   * If you want to run jobs from all queues, set this to true.
   * If you set this to true, the `queue` property will be ignored.
   *
   * @default false
   */
  allQueues?: boolean
  /**
   * ID of the job to run
   */
  id?: number | string
  /**
   * The maximum number of jobs to run in this invocation
   *
   * @default 10
   */
  limit?: number
  overrideAccess?: boolean
  /**
   * Adjust the job processing order
   *
   * FIFO would equal `createdAt` and LIFO would equal `-createdAt`.
   *
   * @default all jobs for all queues will be executed in FIFO order.
   */
  processingOrder?: Sort
  /**
   * If you want to run jobs from a specific queue, set this to the queue name.
   *
   * @default jobs from the `default` queue will be executed.
   */
  queue?: string
  req: PayloadRequest
  /**
   * By default, jobs are run in parallel.
   * If you want to run them in sequence, set this to true.
   */
  sequential?: boolean
  /**
   * If set to true, the job system will not log any output to the console (for both info and error logs).
   * Can be an option for more granular control over logging.
   *
   * This will not automatically affect user-configured logs (e.g. if you call `console.log` or `payload.logger.info` in your job code).
   *
   * @default false
   */
  silent?: RunJobsSilent
  where?: Where
}

export type RunJobsResult = {
  jobStatus?: Record<string, RunJobResult>
  /**
   * If this is false, there for sure are no jobs remaining, regardless of the limit
   */
  noJobsRemaining?: boolean
  /**
   * Out of the jobs that were queried & processed (within the set limit), how many are remaining and retryable?
   */
  remainingJobsFromQueried: number
}

export const runJobs = async (args: RunJobsArgs): Promise<RunJobsResult> => {
  const {
    id,
    allQueues = false,
    limit = 10,
    overrideAccess,
    processingOrder,
    queue = 'default',
    req,
    req: {
      payload,
      payload: {
        config: { jobs: jobsConfig },
      },
    },
    sequential,
    silent = false,
    where: whereFromProps,
  } = args

  if (!overrideAccess) {
    /**
     * By default, jobsConfig.access.run will be `defaultAccess` which is a function that returns `true` if the user is logged in.
     */
    const accessFn = jobsConfig?.access?.run ?? (() => true)
    const hasAccess = await accessFn({ req })
    if (!hasAccess) {
      throw new Forbidden(req.t)
    }
  }
  const and: Where[] = [
    {
      completedAt: {
        exists: false,
      },
    },
    {
      hasError: {
        not_equals: true,
      },
    },
    {
      processing: {
        equals: false,
      },
    },
    {
      or: [
        {
          waitUntil: {
            exists: false,
          },
        },
        {
          waitUntil: {
            less_than: getCurrentDate().toISOString(),
          },
        },
      ],
    },
  ]

  if (allQueues !== true) {
    and.push({
      queue: {
        equals: queue ?? 'default',
      },
    })
  }

  if (whereFromProps) {
    and.push(whereFromProps)
  }

  // Find all jobs and ensure we set job to processing: true as early as possible to reduce the chance of
  // the same job being picked up by another worker
  let jobs: Job[] = []

  if (id) {
    // Only one job to run
    const job = await updateJob({
      id,
      data: {
        processing: true,
      },
      depth: jobsConfig.depth,
      disableTransaction: true,
      req,
      returning: true,
    })
    if (job) {
      jobs = [job]
    }
  } else {
    let defaultProcessingOrder: Sort =
      payload.collections[jobsCollectionSlug]?.config.defaultSort ?? 'createdAt'

    const processingOrderConfig = jobsConfig.processingOrder
    if (typeof processingOrderConfig === 'function') {
      defaultProcessingOrder = await processingOrderConfig(args)
    } else if (typeof processingOrderConfig === 'object' && !Array.isArray(processingOrderConfig)) {
      if (
        !allQueues &&
        queue &&
        processingOrderConfig.queues &&
        processingOrderConfig.queues[queue]
      ) {
        defaultProcessingOrder = processingOrderConfig.queues[queue]
      } else if (processingOrderConfig.default) {
        defaultProcessingOrder = processingOrderConfig.default
      }
    } else if (typeof processingOrderConfig === 'string') {
      defaultProcessingOrder = processingOrderConfig
    }
    const updatedDocs = await updateJobs({
      data: {
        processing: true,
      },
      depth: jobsConfig.depth,
      disableTransaction: true,
      limit,
      req,
      returning: true,
      sort: processingOrder ?? defaultProcessingOrder,
      where: { and },
    })

    if (updatedDocs) {
      jobs = updatedDocs
    }
  }

  /**
   * Just for logging purposes, we want to know how many jobs are new and how many are existing (= already been tried).
   * This is only for logs - in the end we still want to run all jobs, regardless of whether they are new or existing.
   */
  const { existingJobs, newJobs } = jobs.reduce(
    (acc, job) => {
      if (job.totalTried > 0) {
        acc.existingJobs.push(job)
      } else {
        acc.newJobs.push(job)
      }
      return acc
    },
    { existingJobs: [] as Job[], newJobs: [] as Job[] },
  )

  if (!jobs.length) {
    return {
      noJobsRemaining: true,
      remainingJobsFromQueried: 0,
    }
  }

  if (!silent || (typeof silent === 'object' && !silent.info)) {
    payload.logger.info({
      msg: `Running ${jobs.length} jobs.`,
      new: newJobs?.length,
      retrying: existingJobs?.length,
    })
  }

  const successfullyCompletedJobs: (number | string)[] = []

  const runSingleJob = async (
    job: Job,
  ): Promise<{
    id: number | string
    result: RunJobResult
  }> => {
    if (!job.workflowSlug && !job.taskSlug) {
      throw new Error('Job must have either a workflowSlug or a taskSlug')
    }
    const jobReq = isolateObjectProperty(req, 'transactionID')

    const workflowConfig: WorkflowConfig =
      job.workflowSlug && jobsConfig.workflows?.length
        ? jobsConfig.workflows.find(({ slug }) => slug === job.workflowSlug)!
        : {
            slug: 'singleTask',
            handler: async ({ job, tasks }) => {
              await tasks[job.taskSlug as string]!('1', {
                input: job.input,
              })
            },
          }

    if (!workflowConfig) {
      return {
        id: job.id,
        result: {
          status: 'error',
        },
      } // Skip jobs with no workflow configuration
    }

    try {
      const updateJob = getUpdateJobFunction(job, jobReq)

      // the runner will either be passed to the config
      // OR it will be a path, which we will need to import via eval to avoid
      // Next.js compiler dynamic import expression errors
      let workflowHandler: WorkflowHandler | WorkflowJSON
      if (
        typeof workflowConfig.handler === 'function' ||
        (typeof workflowConfig.handler === 'object' && Array.isArray(workflowConfig.handler))
      ) {
        workflowHandler = workflowConfig.handler
      } else {
        workflowHandler = await importHandlerPath<typeof workflowHandler>(workflowConfig.handler)

        if (!workflowHandler) {
          const jobLabel = job.workflowSlug || `Task: ${job.taskSlug}`
          const errorMessage = `Can't find runner while importing with the path ${workflowConfig.handler} in job type ${jobLabel}.`
          if (!silent || (typeof silent === 'object' && !silent.error)) {
            payload.logger.error(errorMessage)
          }

          await updateJob({
            error: {
              error: errorMessage,
            },
            hasError: true,
            processing: false,
          })

          return {
            id: job.id,
            result: {
              status: 'error-reached-max-retries',
            },
          }
        }
      }

      if (typeof workflowHandler === 'function') {
        const result = await runJob({
          job,
          req: jobReq,
          silent,
          updateJob,
          workflowConfig,
          workflowHandler,
        })

        if (result.status === 'success') {
          successfullyCompletedJobs.push(job.id)
        }

        return { id: job.id, result }
      } else {
        const result = await runJSONJob({
          job,
          req: jobReq,
          silent,
          updateJob,
          workflowConfig,
          workflowHandler,
        })

        if (result.status === 'success') {
          successfullyCompletedJobs.push(job.id)
        }

        return { id: job.id, result }
      }
    } catch (error) {
      if (error instanceof JobCancelledError) {
        return {
          id: job.id,
          result: {
            status: 'error-reached-max-retries',
          },
        }
      }
      throw error
    }
  }

  let resultsArray: { id: number | string; result: RunJobResult }[] = []
  if (sequential) {
    for (const job of jobs) {
      const result = await runSingleJob(job)
      if (result) {
        resultsArray.push(result)
      }
    }
  } else {
    const jobPromises = jobs.map(runSingleJob)
    resultsArray = (await Promise.all(jobPromises)) as {
      id: number | string
      result: RunJobResult
    }[]
  }

  if (jobsConfig.deleteJobOnComplete && successfullyCompletedJobs.length) {
    try {
      if (jobsConfig.runHooks) {
        await payload.delete({
          collection: jobsCollectionSlug,
          depth: 0, // can be 0 since we're not returning anything
          disableTransaction: true,
          where: { id: { in: successfullyCompletedJobs } },
        })
      } else {
        await payload.db.deleteMany({
          collection: jobsCollectionSlug,
          where: { id: { in: successfullyCompletedJobs } },
        })
      }
    } catch (err) {
      if (!silent || (typeof silent === 'object' && !silent.error)) {
        payload.logger.error({
          err,
          msg: `Failed to delete jobs ${successfullyCompletedJobs.join(', ')} on complete`,
        })
      }
    }
  }

  const resultsObject: RunJobsResult['jobStatus'] = resultsArray.reduce(
    (acc, cur) => {
      if (cur !== null) {
        // Check if there's a valid result to include
        acc[cur.id] = cur.result
      }
      return acc
    },
    {} as Record<string, RunJobResult>,
  )

  let remainingJobsFromQueried = 0
  for (const jobID in resultsObject) {
    const jobResult = resultsObject[jobID]
    if (jobResult?.status === 'error') {
      remainingJobsFromQueried++ // Can be retried
    }
  }

  return {
    jobStatus: resultsObject,
    remainingJobsFromQueried,
  }
}
```

--------------------------------------------------------------------------------

````
