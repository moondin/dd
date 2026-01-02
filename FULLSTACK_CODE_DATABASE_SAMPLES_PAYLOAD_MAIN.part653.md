---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 653
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 653 of 695)

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

---[FILE: seed.ts]---
Location: payload-main/test/queues/seed.ts

```typescript
import type { Payload } from 'payload'

import { devUser } from '../credentials.js'
import { seedDB } from '../helpers/seed.js'

export const seed = async (_payload: Payload) => {
  await _payload.create({
    collection: 'users',
    data: {
      email: devUser.email,
      password: devUser.password,
    },
  })
}

export async function clearAndSeedEverything(_payload: Payload) {
  return await seedDB({
    _payload,
    collectionSlugs: [
      ..._payload.config.collections.map((collection) => collection.slug),
      'payload-jobs',
    ],
    seedFunction: seed,
    snapshotKey: 'queuesTest',
  })
}
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.eslint.json]---
Location: payload-main/test/queues/tsconfig.eslint.json

```json
{
  // extend your base config to share compilerOptions, etc
  //"extends": "./tsconfig.json",
  "compilerOptions": {
    // ensure that nobody can accidentally use this config for a build
    "noEmit": true
  },
  "include": [
    // whatever paths you intend to lint
    "./**/*.ts",
    "./**/*.tsx"
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/test/queues/tsconfig.json

```json
{
  "extends": "../tsconfig.json"
}
```

--------------------------------------------------------------------------------

---[FILE: utilities.ts]---
Location: payload-main/test/queues/utilities.ts

```typescript
import {
  _internal_jobSystemGlobals,
  countRunnableOrActiveJobsForQueue,
  createLocalReq,
  type Payload,
} from 'payload'

export async function waitUntilAutorunIsDone({
  payload,
  queue,
  onlyScheduled = false,
}: {
  onlyScheduled?: boolean
  payload: Payload
  queue: string
}): Promise<void> {
  const req = await createLocalReq({}, payload)

  return new Promise((resolve) => {
    const interval = setInterval(async () => {
      const count = await countRunnableOrActiveJobsForQueue({
        queue,
        req,
        onlyScheduled,
      })
      if (count === 0) {
        clearInterval(interval)
        resolve()
      }
    }, 200)
  })
}

export function timeFreeze() {
  const curDate = new Date()
  _internal_jobSystemGlobals.getCurrentDate = () => curDate
}

export function timeTravel(seconds: number) {
  const curDate = _internal_jobSystemGlobals.getCurrentDate()
  _internal_jobSystemGlobals.getCurrentDate = () => new Date(curDate.getTime() + seconds * 1000)
}

export async function withoutAutoRun<T>(fn: () => Promise<T>): Promise<T> {
  const originalValue = _internal_jobSystemGlobals.shouldAutoRun
  _internal_jobSystemGlobals.shouldAutoRun = false
  try {
    return await fn()
  } finally {
    _internal_jobSystemGlobals.shouldAutoRun = originalValue
  }
}

export async function withoutAutoSchedule<T>(fn: () => Promise<T>): Promise<T> {
  const originalValue = _internal_jobSystemGlobals.shouldAutoSchedule
  _internal_jobSystemGlobals.shouldAutoSchedule = false
  try {
    return await fn()
  } finally {
    _internal_jobSystemGlobals.shouldAutoSchedule = originalValue
  }
}
```

--------------------------------------------------------------------------------

---[FILE: externalTask.ts]---
Location: payload-main/test/queues/runners/externalTask.ts

```typescript
import type { TaskHandler } from 'payload'

export const externalTaskHandler: TaskHandler<'ExternalTask'> = async ({ input, req }) => {
  const newSimple = await req.payload.create({
    collection: 'simple',
    req,
    data: {
      title: input.message,
    },
  })
  return {
    output: {
      simpleID: newSimple.id,
    },
  }
}
```

--------------------------------------------------------------------------------

---[FILE: externalWorkflow.ts]---
Location: payload-main/test/queues/runners/externalWorkflow.ts

```typescript
import type { WorkflowHandler } from 'payload'

export const externalWorkflowHandler: WorkflowHandler<'externalWorkflow'> = async ({
  job,
  tasks,
}) => {
  await tasks.ExternalTask('1', {
    input: {
      message: job.input.message,
    },
  })
}
```

--------------------------------------------------------------------------------

---[FILE: updatePost.ts]---
Location: payload-main/test/queues/runners/updatePost.ts

```typescript
import type { TaskHandler } from 'payload'

export const updatePostStep1: TaskHandler<'UpdatePost'> = async ({ req, input }) => {
  const postID =
    typeof input.post === 'string' || typeof input.post === 'number' ? input.post : input.post.id

  if (!postID) {
    return {
      state: 'failed',
      output: null,
    }
  }

  await req.payload.update({
    collection: 'posts',
    id: postID,
    req,
    data: {
      jobStep1Ran: input.message,
    },
  })

  return {
    state: 'succeeded',
    output: {
      messageTwice: input.message + input.message,
    },
  }
}

export const updatePostStep2: TaskHandler<'UpdatePostStep2'> = async ({ req, input, job }) => {
  const postID =
    typeof input.post === 'string' || typeof input.post === 'number' ? input.post : input.post.id

  if (!postID) {
    return {
      state: 'failed',
      output: null,
    }
  }

  await req.payload.update({
    collection: 'posts',
    id: postID,
    req,
    data: {
      jobStep2Ran: input.messageTwice + job.taskStatus.UpdatePost?.['1']?.output?.messageTwice,
    },
  })

  return {
    state: 'succeeded',
    output: null,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: CreateSimpleRetries0Task.ts]---
Location: payload-main/test/queues/tasks/CreateSimpleRetries0Task.ts

```typescript
import type { TaskConfig } from 'payload'

export const CreateSimpleRetries0Task: TaskConfig<'CreateSimpleRetries0'> = {
  slug: 'CreateSimpleRetries0',
  retries: 0,
  inputSchema: [
    {
      name: 'message',
      type: 'text',
      required: true,
    },
    {
      name: 'shouldFail',
      type: 'checkbox',
    },
  ],
  outputSchema: [
    {
      name: 'simpleID',
      type: 'text',
      required: true,
    },
  ],
  handler: async ({ input, req }) => {
    if (input.shouldFail) {
      throw new Error('Failed on purpose')
    }
    const newSimple = await req.payload.create({
      collection: 'simple',
      req,
      data: {
        title: input.message,
      },
    })
    return {
      output: {
        simpleID: newSimple.id,
      },
    }
  },
}
```

--------------------------------------------------------------------------------

---[FILE: CreateSimpleRetriesUndefinedTask.ts]---
Location: payload-main/test/queues/tasks/CreateSimpleRetriesUndefinedTask.ts

```typescript
import type { TaskConfig } from 'payload'

export const CreateSimpleRetriesUndefinedTask: TaskConfig<'CreateSimpleRetriesUndefined'> = {
  slug: 'CreateSimpleRetriesUndefined',
  inputSchema: [
    {
      name: 'message',
      type: 'text',
      required: true,
    },
    {
      name: 'shouldFail',
      type: 'checkbox',
    },
  ],
  outputSchema: [
    {
      name: 'simpleID',
      type: 'text',
      required: true,
    },
  ],
  handler: async ({ input, req }) => {
    if (input.shouldFail) {
      throw new Error('Failed on purpose')
    }
    const newSimple = await req.payload.create({
      collection: 'simple',
      req,
      data: {
        title: input.message,
      },
    })
    return {
      output: {
        simpleID: newSimple.id,
      },
    }
  },
}
```

--------------------------------------------------------------------------------

---[FILE: CreateSimpleTask.ts]---
Location: payload-main/test/queues/tasks/CreateSimpleTask.ts

```typescript
import type { TaskConfig } from 'payload'

export const CreateSimpleTask: TaskConfig<'CreateSimple'> = {
  retries: 3,
  slug: 'CreateSimple',
  inputSchema: [
    {
      name: 'message',
      type: 'text',
      required: true,
    },
    {
      name: 'shouldFail',
      type: 'checkbox',
    },
  ],
  outputSchema: [
    {
      name: 'simpleID',
      type: 'text',
      required: true,
    },
  ],
  handler: async ({ input, req }) => {
    if (input.shouldFail) {
      throw new Error('Failed on purpose')
    }
    const newSimple = await req.payload.create({
      collection: 'simple',
      req,
      data: {
        title: input.message,
      },
    })
    return {
      output: {
        simpleID: newSimple.id,
      },
    }
  },
}
```

--------------------------------------------------------------------------------

---[FILE: CreateSimpleWithDuplicateMessageTask.ts]---
Location: payload-main/test/queues/tasks/CreateSimpleWithDuplicateMessageTask.ts

```typescript
import type { TaskConfig } from 'payload'

export const CreateSimpleWithDuplicateMessageTask: TaskConfig<'CreateSimpleWithDuplicateMessage'> =
  {
    retries: 2,
    slug: 'CreateSimpleWithDuplicateMessage',
    inputSchema: [
      {
        name: 'message',
        type: 'text',
        required: true,
      },
      {
        name: 'shouldFail',
        type: 'checkbox',
      },
    ],
    outputSchema: [
      {
        name: 'simpleID',
        type: 'text',
        required: true,
      },
    ],
    handler: async ({ input, req }) => {
      if (input.shouldFail) {
        throw new Error('Failed on purpose')
      }
      const newSimple = await req.payload.create({
        collection: 'simple',
        req,
        data: {
          title: input.message + input.message,
        },
      })
      return {
        output: {
          simpleID: newSimple.id,
        },
      }
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: DoNothingTask.ts]---
Location: payload-main/test/queues/tasks/DoNothingTask.ts

```typescript
/* eslint-disable @typescript-eslint/require-await */
import type { TaskConfig } from 'payload'

export const DoNothingTask: TaskConfig<'DoNothingTask'> = {
  retries: 2,
  slug: 'DoNothingTask',
  inputSchema: [
    {
      name: 'message',
      type: 'text',
      required: true,
    },
  ],
  outputSchema: [],
  handler: async ({ input }) => {
    return {
      state: 'succeeded',
      output: {
        message: input.message,
      },
    }
  },
}
```

--------------------------------------------------------------------------------

---[FILE: EverySecondMax2Task.ts]---
Location: payload-main/test/queues/tasks/EverySecondMax2Task.ts

```typescript
import {
  countRunnableOrActiveJobsForQueue,
  type TaskConfig,
  type TaskType,
  type WorkflowTypes,
} from 'payload'

export const EverySecondMax2Task: TaskConfig<'EverySecondMax2'> = {
  schedule: [
    {
      cron: '* * * * * *',
      queue: 'default',
      hooks: {
        beforeSchedule: async ({ queueable, req }) => {
          const runnableOrActiveJobsForQueue = await countRunnableOrActiveJobsForQueue({
            queue: queueable.scheduleConfig.queue,
            req,
            taskSlug: queueable.taskConfig?.slug as TaskType,
            workflowSlug: queueable.workflowConfig?.slug as WorkflowTypes,
            onlyScheduled: false, // Set to false, used to test it
          })

          return {
            input: {
              message: 'This task runs every second - max 2 per second',
            },
            shouldSchedule: runnableOrActiveJobsForQueue <= 1,
            waitUntil: queueable.waitUntil,
          }
        },
        afterSchedule: async (args) => {
          await args.defaultAfterSchedule(args) // Handles updating the payload-jobs-stats global
          args.req.payload.logger.info(
            'EverySecondMax2 task scheduled: ' +
              (args.status === 'success'
                ? String(args.job.id)
                : args.status === 'skipped'
                  ? 'skipped'
                  : 'error'),
          )
        },
      },
    },
  ],
  slug: 'EverySecondMax2',
  inputSchema: [
    {
      name: 'message',
      type: 'text',
      required: true,
    },
  ],
  handler: async ({ input, req }) => {
    req.payload.logger.info(input.message)

    await req.payload.create({
      collection: 'simple',
      data: {
        title: input.message,
      },
      req,
    })
    return {
      output: {},
    }
  },
}
```

--------------------------------------------------------------------------------

---[FILE: EverySecondTask.ts]---
Location: payload-main/test/queues/tasks/EverySecondTask.ts

```typescript
import type { TaskConfig } from 'payload'

export const EverySecondTask: TaskConfig<'EverySecond'> = {
  schedule: [
    {
      cron: '* * * * * *',
      queue: 'autorunSecond',
      hooks: {
        beforeSchedule: async (args) => {
          const result = await args.defaultBeforeSchedule(args) // Handles verifying that there are no jobs already scheduled or processing
          return {
            ...result,
            input: {
              message: 'This task runs every second',
            },
          }
        },
        afterSchedule: async (args) => {
          await args.defaultAfterSchedule(args) // Handles updating the payload-jobs-stats global
          args.req.payload.logger.info(
            'EverySecond task scheduled: ' +
              (args.status === 'success'
                ? String(args.job.id)
                : args.status === 'skipped'
                  ? 'skipped'
                  : 'error'),
          )
        },
      },
    },
  ],
  slug: 'EverySecond',
  inputSchema: [
    {
      name: 'message',
      type: 'text',
      required: true,
    },
  ],
  handler: async ({ input, req }) => {
    req.payload.logger.info(input.message)

    await req.payload.create({
      collection: 'simple',
      data: {
        title: input.message,
      },
      req,
    })
    return {
      output: {},
    }
  },
}
```

--------------------------------------------------------------------------------

---[FILE: ExternalTask.ts]---
Location: payload-main/test/queues/tasks/ExternalTask.ts

```typescript
import type { TaskConfig } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export const ExternalTask: TaskConfig<'ExternalTask'> = {
  retries: 2,
  slug: 'ExternalTask',
  inputSchema: [
    {
      name: 'message',
      type: 'text',
      required: true,
    },
  ],
  outputSchema: [
    {
      name: 'simpleID',
      type: 'text',
      required: true,
    },
  ],
  handler: path.resolve(dirname, '../runners/externalTask.ts') + '#externalTaskHandler',
}
```

--------------------------------------------------------------------------------

---[FILE: ReturnCustomErrorTask.ts]---
Location: payload-main/test/queues/tasks/ReturnCustomErrorTask.ts

```typescript
import type { TaskConfig } from 'payload'

export const ReturnCustomErrorTask: TaskConfig<'ReturnCustomError'> = {
  retries: 0,
  slug: 'ReturnCustomError',
  inputSchema: [
    {
      name: 'errorMessage',
      type: 'text',
      required: true,
    },
  ],
  outputSchema: [],
  handler: ({ input }) => {
    return {
      state: 'failed',
      errorMessage: input.errorMessage,
    }
  },
}
```

--------------------------------------------------------------------------------

---[FILE: ReturnErrorTask.ts]---
Location: payload-main/test/queues/tasks/ReturnErrorTask.ts

```typescript
import type { TaskConfig } from 'payload'

export const ReturnErrorTask: TaskConfig<'ReturnError'> = {
  retries: 0,
  slug: 'ReturnError',
  inputSchema: [],
  outputSchema: [],
  handler: () => {
    return {
      state: 'failed',
    }
  },
}
```

--------------------------------------------------------------------------------

---[FILE: ThrowErrorTask.ts]---
Location: payload-main/test/queues/tasks/ThrowErrorTask.ts

```typescript
import type { TaskConfig } from 'payload'

export const ThrowErrorTask: TaskConfig<'ThrowError'> = {
  retries: 0,
  slug: 'ThrowError',
  inputSchema: [],
  outputSchema: [],
  handler: () => {
    throw new Error('failed')
  },
}
```

--------------------------------------------------------------------------------

---[FILE: UpdatePostStep2Task.ts]---
Location: payload-main/test/queues/tasks/UpdatePostStep2Task.ts

```typescript
import type { TaskConfig } from 'payload'

import { updatePostStep2 } from '../runners/updatePost.js'

export const UpdatePostStep2Task: TaskConfig<'UpdatePostStep2'> = {
  retries: 2,
  slug: 'UpdatePostStep2',
  inputSchema: [
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      maxDepth: 0,
      required: true,
    },
    {
      name: 'messageTwice',
      type: 'text',
      required: true,
    },
  ],
  handler: updatePostStep2,
}
```

--------------------------------------------------------------------------------

---[FILE: UpdatePostTask.ts]---
Location: payload-main/test/queues/tasks/UpdatePostTask.ts

```typescript
import type { TaskConfig } from 'payload'

import { updatePostStep1 } from '../runners/updatePost.js'

export const UpdatePostTask: TaskConfig<'UpdatePost'> = {
  retries: 2,
  slug: 'UpdatePost',
  interfaceName: 'MyUpdatePostType',
  inputSchema: [
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      maxDepth: 0,
      required: true,
    },
    {
      name: 'message',
      type: 'text',
      required: true,
    },
  ],
  outputSchema: [
    {
      name: 'messageTwice',
      type: 'text',
      required: true,
    },
  ],
  handler: updatePostStep1,
}
```

--------------------------------------------------------------------------------

---[FILE: externalWorkflow.ts]---
Location: payload-main/test/queues/workflows/externalWorkflow.ts

```typescript
import type { WorkflowConfig } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const externalWorkflow: WorkflowConfig<'externalWorkflow'> = {
  slug: 'externalWorkflow',
  inputSchema: [
    {
      name: 'message',
      type: 'text',
      required: true,
    },
  ],
  handler: path.resolve(dirname, '../runners/externalWorkflow.ts') + '#externalWorkflowHandler',
}
```

--------------------------------------------------------------------------------

---[FILE: failsImmediately.ts]---
Location: payload-main/test/queues/workflows/failsImmediately.ts

```typescript
import type { WorkflowConfig } from 'payload'

export const failsImmediatelyWorkflow: WorkflowConfig<'failsImmediately'> = {
  slug: 'failsImmediately',
  inputSchema: [],
  retries: 0,
  handler: () => {
    throw new Error('This workflow fails immediately')
  },
}
```

--------------------------------------------------------------------------------

---[FILE: fastParallelTaskWorkflow.ts]---
Location: payload-main/test/queues/workflows/fastParallelTaskWorkflow.ts

```typescript
import type { WorkflowConfig } from 'payload'

export const fastParallelTaskWorkflow: WorkflowConfig<'fastParallelTask'> = {
  slug: 'fastParallelTask',
  inputSchema: [
    {
      name: 'amount',
      type: 'number',
      required: true,
    },
  ],
  handler: async ({ job, inlineTask }) => {
    const taskFunctions = []
    for (let i = 0; i < job.input.amount; i++) {
      const idx = i + 1
      taskFunctions.push(async () => {
        return await inlineTask(`fast parallel task ${idx}`, {
          input: {
            test: idx,
          },
          task: () => {
            return {
              output: {
                taskID: idx.toString(),
              },
            }
          },
        })
      })
    }

    await Promise.all(taskFunctions.map((f) => f()))
  },
}
```

--------------------------------------------------------------------------------

---[FILE: inlineTaskTest.ts]---
Location: payload-main/test/queues/workflows/inlineTaskTest.ts

```typescript
import type { WorkflowConfig } from 'payload'

export const inlineTaskTestWorkflow: WorkflowConfig<'inlineTaskTest'> = {
  slug: 'inlineTaskTest',
  inputSchema: [
    {
      name: 'message',
      type: 'text',
      required: true,
    },
  ],
  handler: async ({ job, inlineTask }) => {
    await inlineTask('1', {
      task: async ({ input, req }) => {
        const newSimple = await req.payload.create({
          collection: 'simple',
          req,
          data: {
            title: input.message,
          },
        })
        return {
          output: {
            simpleID: newSimple.id,
          },
        }
      },
      input: {
        message: job.input.message,
      },
    })
  },
}
```

--------------------------------------------------------------------------------

---[FILE: inlineTaskTestDelayed.ts]---
Location: payload-main/test/queues/workflows/inlineTaskTestDelayed.ts

```typescript
import type { WorkflowConfig } from 'payload'

export const inlineTaskTestDelayedWorkflow: WorkflowConfig<'inlineTaskTestDelayed'> = {
  slug: 'inlineTaskTestDelayed',
  inputSchema: [
    {
      name: 'message',
      type: 'text',
      required: true,
    },
  ],
  handler: async ({ job, inlineTask }) => {
    await inlineTask('1', {
      task: async ({ input, req }) => {
        // Wait 100ms
        await new Promise((resolve) => setTimeout(resolve, 100))

        const newSimple = await req.payload.create({
          collection: 'simple',
          req,
          data: {
            title: input.message,
          },
        })
        await new Promise((resolve) => setTimeout(resolve, 100))

        return {
          output: {
            simpleID: newSimple.id,
          },
        }
      },
      input: {
        message: job.input.message,
      },
    })
  },
}
```

--------------------------------------------------------------------------------

---[FILE: longRunning.ts]---
Location: payload-main/test/queues/workflows/longRunning.ts

```typescript
import type { WorkflowConfig } from 'payload'

/**
 * Should finish after 2 seconds
 */
export const longRunningWorkflow: WorkflowConfig<'longRunning'> = {
  slug: 'longRunning',
  inputSchema: [],
  handler: async ({ inlineTask }) => {
    for (let i = 0; i < 4; i += 1) {
      await inlineTask(String(i), {
        task: async () => {
          // Wait 500ms
          await new Promise((resolve) => setTimeout(resolve, 500))
          return {
            output: {},
          }
        },
      })
    }
  },
}
```

--------------------------------------------------------------------------------

---[FILE: noRetriesSet.ts]---
Location: payload-main/test/queues/workflows/noRetriesSet.ts

```typescript
import type { WorkflowConfig } from 'payload'

export const noRetriesSetWorkflow: WorkflowConfig<'workflowNoRetriesSet'> = {
  slug: 'workflowNoRetriesSet',
  inputSchema: [
    {
      name: 'message',
      type: 'text',
      required: true,
    },
  ],
  handler: async ({ job, tasks, req }) => {
    const updatedJob = await req.payload.update({
      collection: 'payload-jobs',
      data: {
        input: {
          ...job.input,
          amountRetried:
            // @ts-expect-error amountRetried is new arbitrary data and not in the type
            job.input.amountRetried !== undefined ? job.input.amountRetried + 1 : 0,
        },
      },
      id: job.id,
    })

    job.input = updatedJob.input as any

    await tasks.CreateSimple('1', {
      input: {
        message: job.input.message,
      },
    })

    // At this point there should always be one post created.
    // job.input.amountRetried will go up to 2 as CreatePost has 2 retries
    await tasks.CreateSimple('2', {
      input: {
        message: job.input.message,
        shouldFail: true,
      },
    })
    // This will never be reached
  },
}
```

--------------------------------------------------------------------------------

---[FILE: parallelTaskWorkflow.ts]---
Location: payload-main/test/queues/workflows/parallelTaskWorkflow.ts

```typescript
import type { WorkflowConfig } from 'payload'

export const parallelTaskWorkflow: WorkflowConfig<'parallelTask'> = {
  slug: 'parallelTask',
  inputSchema: [
    {
      name: 'amount',
      type: 'number',
      required: true,
    },
  ],
  handler: async ({ job, inlineTask }) => {
    const taskIDs = Array.from({ length: job.input.amount }, (_, i) => i + 1).map((i) =>
      i.toString(),
    )

    await Promise.all(
      taskIDs.map(async (taskID) => {
        return await inlineTask(`parallel task ${taskID}`, {
          task: async ({ req }) => {
            const newSimple = await req.payload.db.create({
              collection: 'simple',
              data: {
                title: 'parallel task ' + taskID,
              },
            })
            return {
              output: {
                simpleID: newSimple.id,
              },
            }
          },
        })
      }),
    )
  },
}
```

--------------------------------------------------------------------------------

---[FILE: retries0.ts]---
Location: payload-main/test/queues/workflows/retries0.ts

```typescript
import type { WorkflowConfig } from 'payload'

export const retries0Workflow: WorkflowConfig<'workflowRetries0'> = {
  slug: 'workflowRetries0',
  inputSchema: [
    {
      name: 'message',
      type: 'text',
      required: true,
    },
  ],
  retries: 0,
  handler: async ({ job, tasks, req }) => {
    const updatedJob = await req.payload.update({
      collection: 'payload-jobs',
      data: {
        input: {
          ...job.input,
          amountRetried:
            // @ts-expect-error amountRetried is new arbitrary data and not in the type
            job.input.amountRetried !== undefined ? job.input.amountRetried + 1 : 0,
        },
      },
      id: job.id,
    })
    job.input = updatedJob.input as any

    await tasks.CreateSimple('1', {
      input: {
        message: job.input.message,
      },
    })

    // At this point there should always be one post created.
    // job.input.amountRetried will go up to 2 as CreatePost has 2 retries
    await tasks.CreateSimple('2', {
      input: {
        message: job.input.message,
        shouldFail: true,
      },
    })
    // This will never be reached
  },
}
```

--------------------------------------------------------------------------------

---[FILE: retriesBackoffTest.ts]---
Location: payload-main/test/queues/workflows/retriesBackoffTest.ts

```typescript
import type { WorkflowConfig } from 'payload'

export const retriesBackoffTestWorkflow: WorkflowConfig<'retriesBackoffTest'> = {
  slug: 'retriesBackoffTest',
  inputSchema: [
    {
      name: 'message',
      type: 'text',
      required: true,
    },
  ],
  handler: async ({ job, inlineTask, req }) => {
    const newJob = await req.payload.update({
      collection: 'payload-jobs',
      data: {
        input: {
          ...job.input,
          amountRetried:
            // @ts-expect-error amountRetried is new arbitrary data and not in the type
            job.input.amountRetried !== undefined ? job.input.amountRetried + 1 : 0,
        },
      },
      id: job.id,
    })
    job.input = newJob.input as any

    await inlineTask('1', {
      task: async ({ req }) => {
        const totalTried = job?.taskStatus?.inline?.['1']?.totalTried || 0

        const { id } = await req.payload.create({
          collection: 'simple',
          req,
          data: {
            title: 'should not exist',
          },
        })

        // @ts-expect-error timeTried is new arbitrary data and not in the type
        if (!job.input.timeTried) {
          // @ts-expect-error timeTried is new arbitrary data and not in the type
          job.input.timeTried = {}
        }

        // @ts-expect-error timeTried is new arbitrary data and not in the type
        job.input.timeTried[totalTried] = new Date().toISOString()

        const updated = await req.payload.update({
          collection: 'payload-jobs',
          data: {
            input: job.input,
          },
          id: job.id,
        })
        job.input = updated.input as any

        if (totalTried < 4) {
          // Cleanup the post
          await req.payload.delete({
            collection: 'simple',
            id,
            req,
          })

          // Last try it should succeed
          throw new Error('Failed on purpose')
        }
        return {
          output: {},
        }
      },
      retries: {
        attempts: 4,
        backoff: {
          type: 'exponential',
          // Should retry in 300ms, then 600, then 1200, then 2400, then succeed
          delay: 300,
        },
      },
    })
  },
}
```

--------------------------------------------------------------------------------

---[FILE: retriesRollbackTest.ts]---
Location: payload-main/test/queues/workflows/retriesRollbackTest.ts

```typescript
import type { WorkflowConfig } from 'payload'

export const retriesRollbackTestWorkflow: WorkflowConfig<'retriesRollbackTest'> = {
  slug: 'retriesRollbackTest',
  inputSchema: [
    {
      name: 'message',
      type: 'text',
      required: true,
    },
  ],
  handler: async ({ job, inlineTask, req }) => {
    await req.payload.update({
      collection: 'payload-jobs',
      data: {
        input: {
          ...job.input,
          amountRetried:
            // @ts-expect-error amountRetried is new arbitrary data and not in the type
            job.input.amountRetried !== undefined ? job.input.amountRetried + 1 : 0,
        },
      },
      id: job.id,
    })

    await inlineTask('1', {
      task: async ({ req }) => {
        const newSimple = await req.payload.create({
          collection: 'simple',
          req,
          data: {
            title: job.input.message,
          },
        })
        return {
          output: {
            simpleID: newSimple.id,
          },
        }
      },
    })

    await inlineTask('2', {
      task: async ({ req }) => {
        await req.payload.create({
          collection: 'simple',
          req,
          data: {
            title: 'should not exist',
          },
        })
        // Fail afterwards, so that we can also test that transactions work (i.e. the job is rolled back)

        throw new Error('Failed on purpose')
      },
      retries: {
        attempts: 4,
      },
    })
  },
}
```

--------------------------------------------------------------------------------

---[FILE: retriesTest.ts]---
Location: payload-main/test/queues/workflows/retriesTest.ts

```typescript
import type { WorkflowConfig } from 'payload'

export const retriesTestWorkflow: WorkflowConfig<'retriesTest'> = {
  slug: 'retriesTest',
  inputSchema: [
    {
      name: 'message',
      type: 'text',
      required: true,
    },
  ],
  handler: async ({ job, tasks, req }) => {
    const updatedJob = await req.payload.update({
      collection: 'payload-jobs',
      data: {
        input: {
          ...job.input,
          amountRetried:
            // @ts-expect-error amountRetried is new arbitrary data and not in the type
            job.input.amountRetried !== undefined ? job.input.amountRetried + 1 : 0,
        },
      },
      id: job.id,
    })
    job.input = updatedJob.input as any

    await tasks.CreateSimple('1', {
      input: {
        message: job.input.message,
      },
    })

    // At this point there should always be one post created.
    // job.input.amountRetried will go up to 2 as CreatePost has 2 retries
    await tasks.CreateSimple('2', {
      input: {
        message: job.input.message,
        shouldFail: true,
      },
    })
    // This will never be reached
  },
}
```

--------------------------------------------------------------------------------

---[FILE: retriesWorkflowLevelTest.ts]---
Location: payload-main/test/queues/workflows/retriesWorkflowLevelTest.ts

```typescript
import type { WorkflowConfig } from 'payload'

export const retriesWorkflowLevelTestWorkflow: WorkflowConfig<'retriesWorkflowLevelTest'> = {
  slug: 'retriesWorkflowLevelTest',
  inputSchema: [
    {
      name: 'message',
      type: 'text',
      required: true,
    },
  ],
  retries: 2, // Even though CreateSimple has 3 retries, this workflow only has 2. Thus, it will only retry once
  handler: async ({ job, tasks, req }) => {
    const updatedJob = await req.payload.update({
      collection: 'payload-jobs',
      data: {
        input: {
          ...job.input,
          amountRetried:
            // @ts-expect-error amountRetried is new arbitrary data and not in the type
            job.input.amountRetried !== undefined ? job.input.amountRetried + 1 : 0,
        },
      },
      id: job.id,
    })
    job.input = updatedJob.input as any

    await tasks.CreateSimple('1', {
      input: {
        message: job.input.message,
      },
    })

    // At this point there should always be one post created.
    // job.input.amountRetried will go up to 2 as CreatePost has 2 retries
    await tasks.CreateSimple('2', {
      input: {
        message: job.input.message,
        shouldFail: true,
      },
    })
    // This will never be reached
  },
}
```

--------------------------------------------------------------------------------

---[FILE: subTask.ts]---
Location: payload-main/test/queues/workflows/subTask.ts

```typescript
import type { WorkflowConfig } from 'payload'

export const subTaskWorkflow: WorkflowConfig<'subTask'> = {
  slug: 'subTask',
  inputSchema: [
    {
      name: 'message',
      type: 'text',
      required: true,
    },
  ],
  handler: async ({ job, inlineTask }) => {
    await inlineTask('create two docs', {
      task: async ({ input, inlineTask }) => {
        const { newSimple } = await inlineTask('create doc 1', {
          task: async ({ req }) => {
            const newSimple = await req.payload.create({
              collection: 'simple',
              req,
              data: {
                title: input.message,
              },
            })
            return {
              output: {
                newSimple,
              },
            }
          },
        })

        const { newSimple2 } = await inlineTask('create doc 2', {
          task: async ({ req }) => {
            const newSimple2 = await req.payload.create({
              collection: 'simple',
              req,
              data: {
                title: input.message,
              },
            })
            return {
              output: {
                newSimple2,
              },
            }
          },
        })
        return {
          output: {
            simpleID1: newSimple.id,
            simpleID2: newSimple2.id,
          },
        }
      },
      input: {
        message: job.input.message,
      },
    })
  },
}
```

--------------------------------------------------------------------------------

---[FILE: subTaskFails.ts]---
Location: payload-main/test/queues/workflows/subTaskFails.ts

```typescript
import type { WorkflowConfig } from 'payload'

export const subTaskFailsWorkflow: WorkflowConfig<'subTaskFails'> = {
  slug: 'subTaskFails',
  inputSchema: [
    {
      name: 'message',
      type: 'text',
      required: true,
    },
  ],
  retries: 3,
  handler: async ({ job, inlineTask }) => {
    await inlineTask('create two docs', {
      task: async ({ input, inlineTask }) => {
        const { newSimple } = await inlineTask('create doc 1 - succeeds', {
          task: async ({ req }) => {
            const newSimple = await req.payload.create({
              collection: 'simple',
              req,
              data: {
                title: input.message,
              },
            })

            const updatedJob = await req.payload.update({
              collection: 'payload-jobs',
              data: {
                input: {
                  ...job.input,
                  amountTask1Retried:
                    // @ts-expect-error amountRetried is new arbitrary data and not in the type
                    job.input.amountTask1Retried !== undefined
                      ? // @ts-expect-error
                        job.input.amountTask1Retried + 1
                      : 0,
                },
              },
              id: job.id,
            })
            job.input = updatedJob.input as any

            return {
              output: {
                newSimple,
              },
            }
          },
        })

        await inlineTask('create doc 2 - fails', {
          task: async ({ req }) => {
            const updatedJob = await req.payload.update({
              collection: 'payload-jobs',
              data: {
                input: {
                  ...job.input,
                  amountTask2Retried:
                    // @ts-expect-error amountRetried is new arbitrary data and not in the type
                    job.input.amountTask2Retried !== undefined
                      ? // @ts-expect-error
                        job.input.amountTask2Retried + 1
                      : 0,
                },
              },
              id: job.id,
            })
            job.input = updatedJob.input as any

            throw new Error('Failed on purpose')
          },
        })
        return {
          output: {
            simpleID1: newSimple.id,
          },
        }
      },
      input: {
        message: job.input.message,
      },
    })
  },
}
```

--------------------------------------------------------------------------------

---[FILE: updatePost.ts]---
Location: payload-main/test/queues/workflows/updatePost.ts

```typescript
import type { WorkflowConfig } from 'payload'

export const updatePostWorkflow: WorkflowConfig<'updatePost'> = {
  slug: 'updatePost',
  interfaceName: 'MyUpdatePostWorkflowType',
  inputSchema: [
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      maxDepth: 0,
      required: true,
    },
    {
      name: 'message',
      type: 'text',
      required: true,
    },
  ],
  handler: async ({ job, tasks }) => {
    await tasks.UpdatePost('1', {
      input: {
        post: job.input.post,
        message: job.input.message,
      },
    })

    await tasks.UpdatePostStep2('2', {
      input: {
        // @ts-expect-error
        post: job.taskStatus.UpdatePost['1'].input.post,
        // @ts-expect-error
        messageTwice: job.taskStatus.UpdatePost['1'].output.messageTwice,
      },
    })
  },
}
```

--------------------------------------------------------------------------------

---[FILE: updatePostJSON.ts]---
Location: payload-main/test/queues/workflows/updatePostJSON.ts

```typescript
import type { WorkflowConfig } from 'payload'

export const updatePostJSONWorkflow: WorkflowConfig<'updatePostJSONWorkflow'> = {
  slug: 'updatePostJSONWorkflow',
  inputSchema: [
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      maxDepth: 0,
      required: true,
    },
    {
      name: 'message',
      type: 'text',
      required: true,
    },
  ],
  handler: [
    {
      task: 'UpdatePost',
      id: '1',
      input: ({ job }) => ({
        post: job.input.post,
        message: job.input.message,
      }),
    },
    {
      task: 'UpdatePostStep2',
      id: '2',
      input: ({ job }) => ({
        post: job.taskStatus.UpdatePost['1'].input.post,
        messageTwice: job.taskStatus.UpdatePost['1'].output.messageTwice,
      }),
      condition({ job }) {
        return !!job?.taskStatus?.UpdatePost?.['1']?.complete
      },
      completesJob: true,
    },
  ],
}
```

--------------------------------------------------------------------------------

````
