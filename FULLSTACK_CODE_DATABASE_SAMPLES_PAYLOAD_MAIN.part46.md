---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 46
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 46 of 695)

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

---[FILE: schedules.mdx]---
Location: payload-main/docs/jobs-queue/schedules.mdx

```text
---
title: Job Schedules
label: Schedules
order: 70
desc: Payload allows you to schedule jobs to run periodically
keywords: jobs queue, application framework, typescript, node, react, nextjs, scheduling, cron, schedule
---

Payload's `schedule` property lets you enqueue Jobs regularly according to a cron schedule - daily, weekly, hourly, or any custom interval. This is ideal for tasks or workflows that must repeat automatically and without manual intervention.

Scheduling Jobs differs significantly from running them:

- **Queueing**: Scheduling only creates (enqueues) the Job according to your cron expression. It does not immediately execute any business logic.
- **Running**: Execution happens separately through your Jobs runner - such as autorun, or manual invocation using `payload.jobs.run()` or the `payload-jobs/run` endpoint.

Use the `schedule` property specifically when you have recurring tasks or workflows. To enqueue a single Job to run once in the future, use the `waitUntil` property instead.

## When to use Schedules

Here's a quick guide to help you choose the right approach:

| Approach            | Use Case                                             | Example                                                               |
| ------------------- | ---------------------------------------------------- | --------------------------------------------------------------------- |
| **Schedule**        | Recurring tasks that run automatically on a schedule | Daily reports, weekly emails, hourly syncs                            |
| **waitUntil**       | One-time job in the future                           | Publish a post at 3pm tomorrow, send trial expiry email in 7 days     |
| **Collection Hook** | Job triggered by document changes                    | Send email when post is published, generate PDF when order is created |
| **Manual Queue**    | Job triggered by user action or API call             | User clicks "Generate Report" button                                  |

**Example comparison:**

```ts
// Bad practice - Using schedule for one-time future job
schedule: [{ cron: '0 15 * * *', queue: 'default' }] // Runs every day at 3pm

// Best practice - Use waitUntil for one-time future job
await payload.jobs.queue({
  task: 'publishPost',
  input: { postId: '123' },
  waitUntil: new Date('2024-12-25T15:00:00Z'), // Runs once at this specific time
})

// Best practice - Use schedule for recurring jobs
schedule: [{ cron: '0 0 * * *', queue: 'nightly' }] // Runs every day at midnight
```

## Handling schedules

Something needs to actually trigger the scheduling of jobs (execute the scheduling lifecycle seen below). By default, the `jobs.autorun` configuration, as well as the `/api/payload-jobs/run` will also handle scheduling for the queue specified in the `autorun` configuration.

You can disable this behavior by setting `disableScheduling: true` in your `autorun` configuration, or by passing `disableScheduling=true` to the `/api/payload-jobs/run` endpoint. This is useful if you want to handle scheduling manually, for example, by using a cron job or a serverless function that calls the `/api/payload-jobs/handle-schedules` endpoint or the `payload.jobs.handleSchedules()` local API method.

### Bin Scripts

Payload provides a set of bin scripts that can be used to handle schedules. If you're already using the `jobs:run` bin script, you can set it to also handle schedules by passing the `--handle-schedules` flag:

```sh
pnpm payload jobs:run --cron "*/5 * * * *" --queue myQueue --handle-schedules # This will both schedule jobs according to the configuration and run them
```

If you only want to handle schedules, you can use the dedicated `jobs:handle-schedules` bin script:

```sh
pnpm payload jobs:handle-schedules --cron "*/5 * * * *" --queue myQueue # or --all-queues
```

## Defining schedules on Tasks or Workflows

Schedules are defined using the `schedule` property:

```ts
export type ScheduleConfig = {
  cron: string // required, supports seconds precision
  queue: string // required, the queue to push Jobs onto
  hooks?: {
    // Optional hooks to customize scheduling behavior
    beforeSchedule?: BeforeScheduleFn
    afterSchedule?: AfterScheduleFn
  }
}
```

### Example schedule

The following example demonstrates scheduling a Job to enqueue every day at midnight:

```ts
import type { TaskConfig } from 'payload'

export const SendDigestEmail: TaskConfig<'SendDigestEmail'> = {
  slug: 'SendDigestEmail',
  schedule: [
    {
      cron: '0 0 * * *', // Every day at midnight
      queue: 'nightly',
    },
  ],
  handler: async () => {
    await sendDigestToAllUsers()
  },
}
```

This configuration only queues the Job - it does not execute it immediately. To actually run the queued Job, you configure autorun in your Payload config (note that autorun should **not** be used on serverless platforms):

```ts
export default buildConfig({
  jobs: {
    autoRun: [
      {
        cron: '* * * * *', // Runs every minute
        queue: 'nightly',
      },
    ],
    tasks: [SendDigestEmail],
  },
})
```

That way, Payload's scheduler will automatically enqueue the job into the `nightly` queue every day at midnight. The autorun configuration will check the `nightly` queue every minute and execute any Jobs that are due to run.

## Scheduling lifecycle

Here's how the scheduling process operates in detail:

1. **Cron evaluation**: Payload (or your external trigger in `manual` mode) identifies which schedules are due to run. To do that, it will
   read the `payload-jobs-stats` global which contains information about the last time each scheduled task or workflow was run.
2. **BeforeSchedule hook**:
   - The default beforeSchedule hook checks how many active or runnable jobs of the same type that have been queued by the scheduling system currently exist.
     If such a job exists, it will skip scheduling a new one.
   - You can provide your own `beforeSchedule` hook to customize this behavior. For example, you might want to allow multiple overlapping Jobs or dynamically set the Job input data.
3. **Enqueue Job**: Payload queues up a new job. This job will have `waitUntil` set to the next scheduled time based on the cron expression.
4. **AfterSchedule hook**:
   - The default afterSchedule hook updates the `payload-jobs-stats` global metadata with the last scheduled time for the Job.
   - You can provide your own afterSchedule hook to it for custom logging, metrics, or other post-scheduling actions.

## Customizing concurrency and input

You may want more control over concurrency or dynamically set Job inputs at scheduling time. For instance, allowing multiple overlapping Jobs to be scheduled, even if a previously scheduled job has not completed yet, or preparing dynamic data to pass to your Job handler:

```ts
import { countRunnableOrActiveJobsForQueue } from 'payload'

schedule: [
  {
    cron: '* * * * *', // every minute
    queue: 'reports',
    hooks: {
      beforeSchedule: async ({ queueable, req }) => {
        const runnableOrActiveJobsForQueue =
          await countRunnableOrActiveJobsForQueue({
            queue: queueable.scheduleConfig.queue,
            req,
            taskSlug: queueable.taskConfig?.slug,
            workflowSlug: queueable.workflowConfig?.slug,
            onlyScheduled: true,
          })

        // Allow up to 3 simultaneous scheduled jobs and set dynamic input
        return {
          shouldSchedule: runnableOrActiveJobsForQueue < 3,
          input: { text: 'Hi there' },
        }
      },
    },
  },
]
```

This allows fine-grained control over how many Jobs can run simultaneously and provides dynamically computed input values each time a Job is scheduled.

## Scheduling in serverless environments

On serverless platforms, scheduling must be triggered externally since Payload does not automatically run cron schedules in ephemeral environments. You have two main ways to trigger scheduling manually:

- **Invoke via Payload's API:** `payload.jobs.handleSchedules()`
- **Use the REST API endpoint:** `/api/payload-jobs/handle-schedules`
- **Use the run endpoint, which also handles scheduling by default:** `GET /api/payload-jobs/run`

For example, on Vercel, you can set up a Vercel Cron to regularly trigger scheduling:

- **Vercel Cron Job:** Configure Vercel Cron to periodically call `GET /api/payload-jobs/handle-schedules`. If you would like to auto-run your scheduled jobs as well, you can use the `GET /api/payload-jobs/run` endpoint.

Once Jobs are queued, their execution depends entirely on your configured runner setup (e.g., autorun, or manual invocation).

## Common Schedule Patterns

Here are typical cron expressions for common scheduling needs:

```ts
// Every minute
schedule: [{ cron: '* * * * *', queue: 'frequent' }]

// Every 5 minutes
schedule: [{ cron: '*/5 * * * *', queue: 'default' }]

// Every hour at minute 0
schedule: [{ cron: '0 * * * *', queue: 'hourly' }]

// Every day at midnight (00:00)
schedule: [{ cron: '0 0 * * *', queue: 'nightly' }]

// Every day at 2:30 AM
schedule: [{ cron: '30 2 * * *', queue: 'nightly' }]

// Every Monday at 9:00 AM
schedule: [{ cron: '0 9 * * 1', queue: 'weekly' }]

// First day of every month at midnight
schedule: [{ cron: '0 0 1 * *', queue: 'monthly' }]

// Every weekday (Mon-Fri) at 8:00 AM
schedule: [{ cron: '0 8 * * 1-5', queue: 'weekdays' }]

// Every 30 seconds (with seconds precision)
schedule: [{ cron: '*/30 * * * * *', queue: 'frequent' }]
```

**Cron format reference:**

```
* * * * * *
│ │ │ │ │ │
│ │ │ │ │ └─ Day of week (0-7, 0 and 7 = Sunday)
│ │ │ │ └─── Month (1-12)
│ │ │ └───── Day of month (1-31)
│ │ └─────── Hour (0-23)
│ └───────── Minute (0-59)
└─────────── Second (0-59, optional)
```

### Real-World Examples

**Daily digest email:**

```ts
export const DailyDigestTask: TaskConfig<'DailyDigest'> = {
  slug: 'DailyDigest',
  schedule: [
    {
      cron: '0 7 * * *', // Every day at 7:00 AM
      queue: 'emails',
    },
  ],
  handler: async ({ req }) => {
    const users = await req.payload.find({
      collection: 'users',
      where: { digestEnabled: { equals: true } },
    })

    for (const user of users.docs) {
      await sendDigestEmail(user.email)
    }

    return { output: { emailsSent: users.docs.length } }
  },
}
```

**Weekly report generation:**

```ts
export const WeeklyReportTask: TaskConfig<'WeeklyReport'> = {
  slug: 'WeeklyReport',
  schedule: [
    {
      cron: '0 9 * * 1', // Every Monday at 9:00 AM
      queue: 'reports',
    },
  ],
  handler: async ({ req }) => {
    const report = await generateWeeklyReport()
    await req.payload.create({
      collection: 'reports',
      data: report,
    })

    return { output: { reportId: report.id } }
  },
}
```

**Hourly data sync:**

```ts
export const SyncDataTask: TaskConfig<'SyncData'> = {
  slug: 'SyncData',
  schedule: [
    {
      cron: '0 * * * *', // Every hour
      queue: 'sync',
    },
  ],
  handler: async ({ req }) => {
    const data = await fetchFromExternalAPI()
    await req.payload.create({
      collection: 'synced-data',
      data,
    })

    return { output: { itemsSynced: data.length } }
  },
}
```

## Troubleshooting Schedules

Here are a few things to check when scheduled jobs are not being queued:

**Is schedule handling enabled?**

```ts
// Make sure autoRun doesn't disable scheduling
jobs: {
  autoRun: [
    {
      cron: '*/5 * * * *',
      queue: 'default',
      disableScheduling: false, // Should be false or omitted
    },
  ],
}
```

**Is the cron expression valid?**

```ts
// Invalid cron - 6 fields (with seconds) but missing day of week
schedule: [{ cron: '0 0 * * *', queue: 'default' }] // Missing 6th field

// Valid cron - 5 fields (standard format)
schedule: [{ cron: '0 0 * * *', queue: 'default' }]

// Valid cron - 6 fields (with seconds)
schedule: [{ cron: '0 0 0 * * *', queue: 'default' }]
```

Test your cron expressions at [crontab.guru](https://crontab.guru) (for 5-field format).

**Check the payload-jobs-stats global**

```ts
const stats = await payload.findGlobal({
  slug: 'payload-jobs-stats',
})

console.log(stats.lastScheduled) // Check when each task was last scheduled
```

### Scheduled Jobs queued but not running

This means scheduling is working, but execution isn't. See the [Queues troubleshooting](/docs/jobs-queue/queues#troubleshooting) section.

### Jobs running at wrong times

**Issue: Job scheduled for midnight but runs immediately**

This happens when `waitUntil` isn't set properly. Check your schedule config:

```ts
// The schedule property only queues the job
// The autoRun picks it up and runs it
schedule: [{ cron: '0 0 * * *', queue: 'nightly' }]

// Make sure autoRun checks the queue frequently enough
autoRun: [
  {
    cron: '* * * * *', // Check every minute
    queue: 'nightly',
  },
]
```

### Multiple instances of the same scheduled job

By default, Payload prevents duplicate scheduled jobs. If you're seeing duplicates:

**Are you running multiple servers without coordination?**

If multiple servers are handling schedules, they might each queue jobs. Solution: Only enable schedule handling on one server:

```ts
// Server 1 (handles schedules)
jobs: {
  shouldAutoRun: () => process.env.HANDLE_SCHEDULES === 'true',
  autoRun: [/* ... */],
}

// Server 2 (just processes jobs, no scheduling)
jobs: {
  shouldAutoRun: () => process.env.HANDLE_SCHEDULES !== 'true',
  autoRun: [{ disableScheduling: true }],
}
```

### Custom beforeSchedule hook

If you have a custom `beforeSchedule` hook, make sure it properly checks for existing jobs:

```ts
import { countRunnableOrActiveJobsForQueue } from 'payload'

hooks: {
  beforeSchedule: async ({ queueable, req }) => {
    const count = await countRunnableOrActiveJobsForQueue({
      queue: queueable.scheduleConfig.queue,
      req,
      taskSlug: queueable.taskConfig?.slug,
      onlyScheduled: true,
    })

    return {
      shouldSchedule: count === 0, // Only schedule if no jobs exist
    }
  },
}
```
```

--------------------------------------------------------------------------------

---[FILE: tasks.mdx]---
Location: payload-main/docs/jobs-queue/tasks.mdx

```text
---
title: Tasks
label: Tasks
order: 30
desc: A Task is a distinct function declaration that can be run within Payload's Jobs Queue.
keywords: jobs queue, application framework, typescript, node, react, nextjs
---

<Banner type="default">
  A **"Task"** is a function definition that performs business logic and whose
  input and output are both strongly typed.
</Banner>

You can register Tasks on the Payload config, and then create [Jobs](/docs/jobs-queue/jobs) or [Workflows](/docs/jobs-queue/workflows) that use them. Think of Tasks like tidy, isolated "functions that do one specific thing".

Payload Tasks can be configured to be automatically retried if they fail, which makes them valuable for "durable" workflows like AI applications where LLMs can return non-deterministic results, and might need to be retried.

Tasks can either be defined within the `jobs.tasks` array in your Payload config, or they can be defined inline within a workflow.

### Defining tasks in the config

Simply add a task to the `jobs.tasks` array in your Payload config. A task consists of the following fields:

| Option          | Description                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `slug`          | Define a slug-based name for this job. This slug needs to be unique among both tasks and workflows.                                                                                                                                                                                                                                                                                                                                              |
| `handler`       | The function that should be responsible for running the job. You can either pass a string-based path to the job function file, or the job function itself. If you are using large dependencies within your job, you might prefer to pass the string path because that will avoid bundling large dependencies in your Next.js app. Passing a string path is an advanced feature that may require a sophisticated build pipeline in order to work. |
| `inputSchema`   | Define the input field schema - Payload will generate a type for this schema.                                                                                                                                                                                                                                                                                                                                                                    |
| `interfaceName` | You can use interfaceName to change the name of the interface that is generated for this task. By default, this is "Task" + the capitalized task slug.                                                                                                                                                                                                                                                                                           |
| `outputSchema`  | Define the output field schema - Payload will generate a type for this schema.                                                                                                                                                                                                                                                                                                                                                                   |
| `label`         | Define a human-friendly label for this task.                                                                                                                                                                                                                                                                                                                                                                                                     |
| `onFail`        | Function to be executed if the task fails.                                                                                                                                                                                                                                                                                                                                                                                                       |
| `onSuccess`     | Function to be executed if the task succeeds.                                                                                                                                                                                                                                                                                                                                                                                                    |
| `retries`       | Specify the number of times that this step should be retried if it fails. If this is undefined, the task will either inherit the retries from the workflow or have no retries. If this is 0, the task will not be retried. By default, this is undefined.                                                                                                                                                                                        |

The logic for the Task is defined in the `handler` - which can be defined as a function, or a path to a function. The `handler` will run once a worker picks up a Job that includes this task.

It should return an object with an `output` key, which should contain the output of the task as you've defined.

Example:

```ts
export default buildConfig({
  // ...
  jobs: {
    tasks: [
      {
        // Configure this task to automatically retry
        // up to two times
        retries: 2,

        // This is a unique identifier for the task

        slug: 'createPost',

        // These are the arguments that your Task will accept
        inputSchema: [
          {
            name: 'title',
            type: 'text',
            required: true,
          },
        ],

        // These are the properties that the function should output
        outputSchema: [
          {
            name: 'postID',
            type: 'text',
            required: true,
          },
        ],

        // This is the function that is run when the task is invoked
        handler: async ({ input, job, req }) => {
          const newPost = await req.payload.create({
            collection: 'post',
            req,
            data: {
              title: input.title,
            },
          })
          return {
            output: {
              postID: newPost.id,
            },
          }
        },
      } as TaskConfig<'createPost'>,
    ],
  },
})
```

### Common Task Patterns

#### Database Operations

Creating or updating documents based on other document changes:

```ts
{
  slug: 'updateRelatedPosts',
  retries: 2,
  inputSchema: [
    {
      name: 'categoryId',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
  ],
  handler: async ({ input, req }) => {
    const posts = await req.payload.find({
      collection: 'posts',
      where: {
        category: {
          equals: input.categoryId,
        },
      },
    })

    // Update all posts in this category
    for (const post of posts.docs) {
      await req.payload.update({
        collection: 'posts',
        id: post.id,
        data: {
          categoryUpdatedAt: new Date().toISOString(),
        },
      })
    }

    return {
      output: {
        postsUpdated: posts.docs.length,
      },
    }
  },
}
```

#### External API Calls

Calling third-party services without blocking your API:

```ts
{
  slug: 'syncToThirdParty',
  retries: 3,
  inputSchema: [
    {
      name: 'documentId',
      type: 'text',
      required: true,
    },
  ],
  handler: async ({ input, req }) => {
    const doc = await req.payload.findByID({
      collection: 'documents',
      id: input.documentId,
    })

    // Call external API
    const response = await fetch('https://api.example.com/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doc),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    return {
      output: {
        synced: true,
        apiResponse: await response.json(),
      },
    }
  },
}
```

#### Conditional Failure

Sometimes you want to fail a task based on business logic:

```ts
{
  slug: 'processPayment',
  retries: 1,
  inputSchema: [
    {
      name: 'orderId',
      type: 'text',
      required: true,
    },
  ],
  handler: async ({ input, req }) => {
    const order = await req.payload.findByID({
      collection: 'orders',
      id: input.orderId,
    })

    // Intentionally fail if order is already processed
    if (order.status === 'paid') {
      throw new Error('Order already processed')
    }

    // Process payment...

    return {
      output: {
        paymentId: 'payment-123',
      },
    }
  },
}

```

### Understanding Task Execution

#### When a task runs

1. The job is picked up from the queue by a worker
2. The handler function executes with the provided input
3. If successful, the output is stored and the job completes
4. If it throws an error, the task will retry (up to retries count)
5. After all retries are exhausted, the task and job fail

<Banner type="warning">
  Important: Tasks should be idempotent when possible - meaning running them
  multiple times with the same input produces the same result. This is because
  retries might cause the task to run more than once.
</Banner>

### Advanced: Handler File Paths

In addition to defining handlers as functions directly provided to your Payload config, you can also pass an _absolute path_ to where the handler is defined. If your task has large dependencies, and you are planning on executing your jobs in a separate process that has access to the filesystem, this could be a handy way to make sure that your Payload + Next.js app remains quick to compile and has minimal dependencies.

Keep in mind that this is an advanced feature that may require a sophisticated build pipeline, especially when using it in production or within Next.js, e.g. by calling opening the `/api/payload-jobs/run` endpoint. You will have to transpile the handler files separately and ensure they are available in the same location when the job is run. If you're using an endpoint to execute your jobs, it's recommended to define your handlers as functions directly in your Payload Config, or use import paths handlers outside of Next.js.

In general, this is an advanced use case. Here's how this would look:

`payload.config.ts:`

```ts
import { fileURLToPath } from 'node:url'
import path from 'path'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  jobs: {
    tasks: [
      {
        // ...
        // The #createPostHandler is a named export within the `createPost.ts` file
        handler:
          path.resolve(dirname, 'src/tasks/createPost.ts') +
          '#createPostHandler',
      },
    ],
  },
})
```

Then, the `createPost` file itself:

`src/tasks/createPost.ts:`

```ts
import type { TaskHandler } from 'payload'

export const createPostHandler: TaskHandler<'createPost'> = async ({
  input,
  job,
  req,
}) => {
  const newPost = await req.payload.create({
    collection: 'post',
    req,
    data: {
      title: input.title,
    },
  })
  return {
    output: {
      postID: newPost.id,
    },
  }
}
```

### Configuring task restoration

By default, if a task has passed previously and a workflow is re-run, the task will not be re-run. Instead, the output from the previous task run will be returned. This is to prevent unnecessary re-runs of tasks that have already passed.

You can configure this behavior through the `retries.shouldRestore` property. This property accepts a boolean or a function.

If `shouldRestore` is set to true, the task will only be re-run if it previously failed. This is the default behavior.

If `shouldRestore` is set to false, the task will be re-run even if it previously succeeded, ignoring the maximum number of retries.

If `shouldRestore` is a function, the return value of the function will determine whether the task should be re-run. This can be used for more complex restore logic, e.g you may want to re-run a task up to X amount of times and then restore it for consecutive runs, or only re-run a task if the input has changed.

Example:

```ts
export default buildConfig({
  // ...
  jobs: {
    tasks: [
      {
        slug: 'myTask',
        retries: {
          shouldRestore: false,
        },
        // ...
      } as TaskConfig<'myTask'>,
    ],
  },
})
```

Example - determine whether a task should be restored based on the input data:

```ts
export default buildConfig({
  // ...
  jobs: {
    tasks: [
      {
        slug: 'myTask',
        inputSchema: [
          {
            name: 'someDate',
            type: 'date',
            required: true,
          },
        ],
        retries: {
          shouldRestore: ({ input }) => {
            if (new Date(input.someDate) > new Date()) {
              return false
            }
            return true
          },
        },
        // ...
      } as TaskConfig<'myTask'>,
    ],
  },
})
```

### Nested tasks

You can run sub-tasks within an existing task, by using the `tasks` or `inlineTask` arguments passed to the task `handler` function:

```ts
export default buildConfig({
  // ...
  jobs: {
    // It is recommended to set `addParentToTaskLog` to `true` when using nested tasks, so that the parent task is included in the task log
    // This allows for better observability and debugging of the task execution
    addParentToTaskLog: true,
    tasks: [
      {
        slug: 'parentTask',
        inputSchema: [
          {
            name: 'text',
            type: 'text',
          },
        ],
        handler: async ({ input, req, tasks, inlineTask }) => {
          await inlineTask('Sub Task 1', {
            task: () => {
              // Do something
              return {
                output: {},
              }
            },
          })

          await tasks.CreateSimple('Sub Task 2', {
            input: { message: 'hello' },
          })

          return {
            output: {},
          }
        },
      } as TaskConfig<'parentTask'>,
    ],
  },
})
```
```

--------------------------------------------------------------------------------

````
