---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 45
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 45 of 695)

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

---[FILE: vercel-content-link.mdx]---
Location: payload-main/docs/integrations/vercel-content-link.mdx

```text
---
title: Vercel Content Link
label: Vercel Content Link
order: 10
desc: Payload + Vercel Content Link allows your editors to navigate directly from the content rendered on your front-end to the fields in Payload that control it.
keywords: vercel, vercel content link, content link, visual editing, content source maps, Content Management System, cms, headless, javascript, node, react, nextjs
---

[Vercel Content Link](https://vercel.com/docs/workflow-collaboration/edit-mode#content-link) will allow your editors to navigate directly from the content rendered on your front-end to the fields in Payload that control it. This requires no changes to your front-end code and very few changes to your Payload Config.

![Versions](/images/docs/vercel-visual-editing.jpg)

<Banner type="warning">
  Vercel Content Link is an enterprise-only feature and only available for
  deployments hosted on Vercel. If you are an existing enterprise customer,
  [contact our sales team](https://payloadcms.com/for-enterprise) for help with
  your integration.
</Banner>

## How it works

To power Vercel Content Link, Payload embeds Content Source Maps into its API responses. Content Source Maps are invisible, encoded JSON values that include a link back to the field in the CMS that generated the content. When rendered on the page, Vercel detects and decodes these values to display the Content Link interface.

For full details on how the encoding and decoding algorithm works, check out [`@vercel/stega`](https://www.npmjs.com/package/@vercel/stega).

## Getting Started

Setting up Payload with Vercel Content Link is easy. First, install the `@payloadcms/plugin-csm` plugin into your project. This plugin requires an API key to install, [contact our sales team](https://payloadcms.com/for-enterprise) if you don't already have one.

```bash
npm i @payloadcms/plugin-csm
```

Then in the `plugins` array of your Payload Config, call the plugin and enable any collections that require Content Source Maps.

```ts
import { buildConfig } from 'payload/config'
import contentSourceMaps from '@payloadcms/plugin-csm'

const config = buildConfig({
  collections: [
    {
      slug: 'pages',
      fields: [
        {
          name: 'slug',
          type: 'text',
        },
        {
          name: 'title',
          type: 'text',
        },
      ],
    },
  ],
  plugins: [
    contentSourceMaps({
      collections: ['pages'],
    }),
  ],
})

export default config
```

## Enabling Content Source Maps

Now in your Next.js app, you need to add the `encodeSourceMaps` query parameter to your API requests. This will tell Payload to include the Content Source Maps in the API response.

<Banner type="warning">
  **Note:** For performance reasons, this should only be done when in draft mode
  or on preview deployments.
</Banner>

#### REST API

If you're using the REST API, include the `?encodeSourceMaps=true` search parameter.

```ts
if (isDraftMode || process.env.VERCEL_ENV === 'preview') {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PAYLOAD_CMS_URL}/api/pages?encodeSourceMaps=true&where[slug][equals]=${slug}`,
  )
}
```

#### Local API

If you're using the Local API, include the `encodeSourceMaps` via the `context` property.

```ts
if (isDraftMode || process.env.VERCEL_ENV === 'preview') {
  const res = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: slug,
      },
    },
    context: {
      encodeSourceMaps: true,
    },
  })
}
```

And that's it! You are now ready to enter Edit Mode and begin visually editing your content.

## Edit Mode

To see Content Link on your site, you first need to visit any preview deployment on Vercel and login using the Vercel Toolbar. When Content Source Maps are detected on the page, a pencil icon will appear in the toolbar. Clicking this icon will enable Edit Mode, highlighting all editable fields on the page in blue.

![Versions](/images/docs/vercel-toolbar.jpg)

## Troubleshooting

### Date Fields

The plugin does not encode `date` fields by default, but for some cases like text that uses negative CSS letter-spacing, it may be necessary to split the encoded data out from the rendered text. This way you can safely use the cleaned data as expected.

```ts
import { vercelStegaSplit } from '@vercel/stega'
const { cleaned, encoded } = vercelStegaSplit(text)
```

### Blocks and array fields

All `blocks` and `array` fields by definition do not have plain text strings to encode. For this reason, they are automatically given an additional `_encodedSourceMap` property, which you can use to enable Content Link on entire _sections_ of your site.

You can then specify the editing container by adding the `data-vercel-edit-target` HTML attribute to any top-level element of your block.

```ts
<div data-vercel-edit-target>
  <span style={{ display: "none" }}>{_encodedSourceMap}</span>
  {children}
</div>
```
```

--------------------------------------------------------------------------------

---[FILE: jobs.mdx]---
Location: payload-main/docs/jobs-queue/jobs.mdx

```text
---
title: Jobs
label: Jobs
order: 50
desc: A Job is a set of work that is offloaded from your APIs and will be processed at a later date.
keywords: jobs queue, application framework, typescript, node, react, nextjs
---

Now that we have covered Tasks and Workflows, we can tie them together with a concept called a Job.

<Banner type="default">
  Whereas you define Workflows and Tasks, which control your business logic, a
  **Job** is an individual instance of either a Task or a Workflow which
  contains many tasks.
</Banner>

For example, let's say we have a Workflow or Task that describes the logic to sync information from Payload to a third-party system. This is how you'd declare how to sync that info, but it wouldn't do anything on its own. In order to run that task or workflow, you'd create a Job that references the corresponding Task or Workflow.

Jobs are stored in the Payload database in the `payload-jobs` collection, and you can decide to keep a running list of all jobs, or configure Payload to delete the job when it has been successfully executed.

#### Queuing a new job

In order to queue a job, you can use the `payload.jobs.queue` function.

Here's how you'd queue a new Job, which will run a `createPostAndUpdate` workflow:

```ts
const createdJob = await payload.jobs.queue({
  // Pass the name of the workflow
  workflow: 'createPostAndUpdate',
  // The input type will be automatically typed
  // according to the input you've defined for this workflow
  input: {
    title: 'my title',
  },
})
```

In addition to being able to queue new Jobs based on Workflows, you can also queue a job for a single Task:

```ts
const createdJob = await payload.jobs.queue({
  task: 'createPost',
  input: {
    title: 'my title',
  },
})
```

### Where to Queue Jobs

Jobs can be queued from anywhere in your application. Here are the most common scenarios:

#### From Collection Hooks

The most common place - queue jobs in response to document changes:

```ts
{
  slug: 'posts',
  hooks: {
    afterChange: [
      async ({ req, doc, operation }) => {
        // Only send notification for published posts
        if (operation === 'update' && doc.status === 'published') {
          await req.payload.jobs.queue({
            task: 'notifySubscribers',
            input: {
              postId: doc.id,
            },
          })
        }
      },
    ],
  },
}
```

#### From Field Hooks

Queue jobs based on specific field changes:

```ts
{
  name: 'featuredImage',
  type: 'upload',
  relationTo: 'media',
  hooks: {
    afterChange: [
      async ({ req, value, previousValue }) => {
        // Generate image variants when image changes
        if (value !== previousValue) {
          await req.payload.jobs.queue({
            task: 'generateImageVariants',
            input: {
              imageId: value,
            },
          })
        }
      },
    ],
  },
}
```

#### From Custom Endpoints

Queue jobs from your API routes:

```ts
export const POST = async (req: PayloadRequest) => {
  const job = await req.payload.jobs.queue({
    workflow: 'generateMonthlyReport',
    input: {
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
    },
  })

  return Response.json({
    message: 'Report generation queued',
    jobId: job.id,
  })
}
```

#### From Server Actions

Queue jobs from Next.js server actions:

```ts
'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

export async function scheduleEmail(userId: string) {
  const payload = await getPayload({ config })

  await payload.jobs.queue({
    task: 'sendEmail',
    input: { userId },
  })
}
```

### Job Options

When queuing a job, you can pass additional options:

```ts
await payload.jobs.queue({
  task: 'sendEmail',
  input: { userId: '123' },

  // Schedule the job to run in the future
  waitUntil: new Date('2024-12-25T00:00:00Z'),

  // Assign to a specific queue
  queue: 'high-priority',

  // Add custom metadata for tracking
  log: [
    {
      message: 'Email queued by admin',
      createdAt: new Date().toISOString(),
    },
  ],
})
```

#### Common options

- `waitUntil` - Schedule the job to run at a specific date/time in the future
- `queue` - Assign the job to a specific queue (defaults to `'default'`)
- `log` - Add custom log entries for debugging or tracking
- `req` - Pass the request context for access control

#### Check Job Status

After queuing a job, you can check its status:

```ts
const job = await payload.jobs.queue({
  task: 'processPayment',
  input: { orderId: '123' },
})

// Later, check the job status
const updatedJob = await payload.findByID({
  collection: 'payload-jobs',
  id: job.id,
})

console.log(updatedJob.completedAt) // When it finished
console.log(updatedJob.hasError) // If it failed
console.log(updatedJob.taskStatus) // Details of each task
```

#### Job Status Fields

Each job document contains:

```ts
{
  id: 'job_123',
  taskSlug: 'sendEmail',        // Or workflowSlug for workflows
  input: { userId: '123' },     // The input you provided
  completedAt: '2024-01-15...',  // When job completed (null if pending)
  hasError: false,              // True if job failed
  totalTried: 1,                // Number of attempts
  processing: false,            // True if currently running
  taskStatus: {                 // Status of each task (for workflows)
    sendEmail: {
      '1': {
        complete: true,
        output: { emailSent: true }
      }
    }
  },
  log: [                        // Execution log
    {
      message: 'Job started',
      createdAt: '...'
    }
  ]
}
```

#### Access Control

By default, Payload's job operations bypass access control when used from the Local API. You can enable access control by passing `overrideAccess: false` to any job operation.

To define custom access control for jobs, add an `access` property to your Jobs Config:

```ts
import type { SanitizedConfig } from 'payload'

const config: SanitizedConfig = {
  // ...
  jobs: {
    access: {
      // Control who can queue new jobs
      queue: ({ req }) => {
        return req.user?.roles?.includes('admin')
      },
      // Control who can run jobs
      run: ({ req }) => {
        return req.user?.roles?.includes('admin')
      },
      // Control who can cancel jobs
      cancel: ({ req }) => {
        return req.user?.roles?.includes('admin')
      },
    },
  },
}
```

Each access control function receives the current `req` object and should return a boolean. If no access control is defined, the default behavior allows any authenticated user to perform the operation.

To use access control in the Local API:

```ts
const req = await createLocalReq({ user }, payload)

await payload.jobs.queue({
  workflow: 'createPost',
  input: { title: 'My Post' },
  overrideAccess: false, // Enable access control
  req, // Pass the request with user context
})
```

<Banner type="warning">
  It is not recommended to modify the `payload-jobs` collection's access control
  directly, as that pattern may be deprecated in future versions. Instead—use
  the `access` property in your Jobs Config to control job operations.
</Banner>

#### Cancelling Jobs

Payload allows you to cancel jobs that are either queued or currently running. When cancelling a running job, the current task will finish executing, but no subsequent tasks will run. This happens because the job checks its cancellation status between tasks.

To cancel a specific job, use the `payload.jobs.cancelByID` method with the job's ID:

```ts
await payload.jobs.cancelByID({
  id: createdJob.id,
})
```

To cancel multiple jobs at once, use the `payload.jobs.cancel` method with a `Where` query:

```ts
await payload.jobs.cancel({
  where: {
    workflowSlug: {
      equals: 'createPost',
    },
  },
})
```
```

--------------------------------------------------------------------------------

---[FILE: overview.mdx]---
Location: payload-main/docs/jobs-queue/overview.mdx

```text
---
title: Jobs Queue
label: Overview
order: 10
desc: Payload provides all you need to run job queues, which are helpful to offload long-running processes into separate workers.
keywords: jobs queue, application framework, typescript, node, react, nextjs
---

Payload's Jobs Queue gives you a simple, yet powerful way to offload large or future tasks to separate compute resources which is a very powerful feature of many application frameworks.

### Example use cases

#### Non-blocking workloads

You might need to perform some complex, slow-running logic in a Payload [Hook](/docs/hooks/overview) but you don't want that hook to "block" or slow down the response returned from the Payload API. Instead of running this logic directly in a hook, which would block your API response from returning until the expensive work is completed, you can queue a new Job and let it run at a later date.

Examples:

- Create vector embeddings from your documents, and keep them in sync as your documents change
- Send data to a third-party API on document change
- Trigger emails based on customer actions

#### Scheduled actions

If you need to schedule an action to be run or processed at a certain date in the future, you can queue a job with the `waitUntil` property set. This will make it so the job is not "picked up" until that `waitUntil` date has passed.

Examples:

- Process scheduled posts, where the scheduled date is at a time set in the future
- Unpublish posts at a given time
- Send a reminder email to a customer after X days of signing up for a trial

**Periodic sync or similar scheduled action**

Some applications may need to perform a regularly scheduled operation of some type. Jobs are perfect for this because you can execute their logic using `cron`, scheduled nightly, every twelve hours, or some similar time period.

Examples:

- You'd like to send emails to all customers on a regular, scheduled basis
- Periodically trigger a rebuild of your frontend at night
- Sync resources to or from a third-party API during non-peak times

#### Offloading complex operations

You may run into the need to perform computationally expensive functions which might slow down your main Payload API server(s). The Jobs Queue allows you to offload these tasks to a separate compute resource rather than slowing down the server(s) that run your Payload APIs. With Payload Task definitions, you can even keep large dependencies out of your main Next.js bundle by dynamically importing them only when they are used. This keeps your Next.js + Payload compilation fast and ensures large dependencies do not get bundled into your Payload production build.

Examples:

- You need to create (and then keep in sync) vector embeddings of your documents as they change, but you use an open source model to generate embeddings
- You have a PDF generator that needs to dynamically build and send PDF versions of documents to customers
- You need to use a headless browser to perform some type of logic
- You need to perform a series of actions, each of which depends on a prior action and should be run in as "durable" of a fashion as possible

### How it works

There are a few concepts that you should become familiarized with before using Payload's Jobs Queue. We recommend learning what each of these does in order to fully understand how to leverage the power of Payload's Jobs Queue.

1. [Tasks](/docs/jobs-queue/tasks)
1. [Workflows](/docs/jobs-queue/workflows)
1. [Jobs](/docs/jobs-queue/jobs)
1. [Queues](/docs/jobs-queue/queues)

All of these pieces work together in order to allow you to offload long-running, expensive, or future scheduled work from your main APIs.

Here's a quick overview:

- A Task is a specific function that performs business logic
- Workflows are groupings of specific tasks which should be run in-order, and can be retried from a specific point of failure
- A Job is an instance of a single task or workflow which will be executed
- A Queue is a way to segment your jobs into different "groups" - for example, some to run nightly, and others to run every 10 minutes

### Visualizing Jobs in the Admin UI

By default, the internal `payload-jobs` collection is hidden from the Payload Admin Panel. To make this collection visible for debugging or inspection purposes, you can override its configuration using `jobsCollectionOverrides`.

```ts
import { buildConfig } from 'payload'

export default buildConfig({
  // ... other config
  jobs: {
    // ... other job settings
    jobsCollectionOverrides: ({ defaultJobsCollection }) => {
      if (!defaultJobsCollection.admin) {
        defaultJobsCollection.admin = {}
      }

      defaultJobsCollection.admin.hidden = false
      return defaultJobsCollection
    },
  },
})
```
```

--------------------------------------------------------------------------------

---[FILE: queues.mdx]---
Location: payload-main/docs/jobs-queue/queues.mdx

```text
---
title: Queues
label: Queues
order: 60
desc: A Queue is a specific group of jobs which can be executed in the order that they were added.
keywords: jobs queue, application framework, typescript, node, react, nextjs
---

Queues are the final aspect of Payload's Jobs Queue and deal with how to _run your jobs_. Up to this point, all we've covered is how to queue up jobs to run, but so far, we aren't actually running any jobs.

<Banner type="default">
  A **Queue** is a grouping of jobs that should be executed in order of when
  they were added.
</Banner>

When you go to run jobs, Payload will query for any jobs that are added to the queue and then run them. By default, all queued jobs are added to the `default` queue.

**But, imagine if you wanted to have some jobs that run nightly, and other jobs which should run every five minutes.**

By specifying the `queue` name when you queue a new job using `payload.jobs.queue()`, you can queue certain jobs with `queue: 'nightly'`, and other jobs can be left as the default queue.

Then, you could configure two different runner strategies:

1. A `cron` that runs nightly, querying for jobs added to the `nightly` queue
2. Another that runs any jobs that were added to the `default` queue every ~5 minutes or so

## Executing jobs

As mentioned above, you can queue jobs, but the jobs won't run unless a worker picks up your jobs and runs them. This can be done in four ways:

### Cron jobs

The `jobs.autoRun` property allows you to configure cron jobs that automatically run queued jobs at specified intervals. Note that this does not _queue_ new jobs - only _runs_ jobs that are already in the specified queue.

**Example**:

```ts
export default buildConfig({
  // Other configurations...
  jobs: {
    tasks: [
      // your tasks here
    ],
    // autoRun can optionally be a function that receives `payload` as an argument
    autoRun: [
      {
        cron: '0 * * * *', // every hour at minute 0
        limit: 100, // limit jobs to process each run
        queue: 'hourly', // name of the queue
      },
      // add as many cron jobs as you want
    ],
    shouldAutoRun: async (payload) => {
      // Tell Payload if it should run jobs or not. This function is optional and will return true by default.
      // This function will be invoked each time Payload goes to pick up and run jobs.
      // If this function ever returns false, the cron schedule will be stopped.
      return true
    },
  },
})
```

<Banner type="warning">
  autoRun is intended for use with a dedicated server that is always running,
  and should not be used on serverless platforms like Vercel.
</Banner>

### Endpoint

You can execute jobs by making a fetch request to the `/api/payload-jobs/run` endpoint:

```ts
// Here, we're saying we want to run only 100 jobs for this invocation
// and we want to pull jobs from the `nightly` queue:
await fetch('/api/payload-jobs/run?limit=100&queue=nightly', {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
```

This endpoint is automatically mounted for you and is helpful in conjunction with serverless platforms like Vercel, where you might want to use Vercel Cron to invoke a serverless function that executes your jobs.

#### Query Parameters

- `limit`: The maximum number of jobs to run in this invocation (default: 10).
- `queue`: The name of the queue to run jobs from. If not specified, jobs will be run from the `default` queue.
- `allQueues`: If set to `true`, all jobs from all queues will be run. This will ignore the `queue` parameter.

#### Vercel Cron Example

If you're deploying on Vercel, you can add a `vercel.json` file in the root of your project that configures Vercel Cron to invoke the `run` endpoint on a cron schedule.

Here's an example of what this file will look like:

```json
{
  "crons": [
    {
      "path": "/api/payload-jobs/run",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

The configuration above schedules the endpoint `/api/payload-jobs/run` to be invoked every 5 minutes.

The last step will be to secure your `run` endpoint so that only the proper users can invoke the runner.

To do this, you can set an environment variable on your Vercel project called `CRON_SECRET`, which should be a random string—ideally 16 characters or longer.

Then, you can modify the `access` function for running jobs by ensuring that only Vercel can invoke your runner.

```ts
export default buildConfig({
  // Other configurations...
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    // Other job configurations...
  },
})
```

This works because Vercel automatically makes the `CRON_SECRET` environment variable available to the endpoint as the `Authorization` header when triggered by the Vercel Cron, ensuring that the jobs can be run securely.

After the project is deployed to Vercel, the Vercel Cron job will automatically trigger the `/api/payload-jobs/run` endpoint in the specified schedule, running the queued jobs in the background.

### Local API

If you want to process jobs programmatically from your server-side code, you can use the Local API:

**Run all jobs:**

```ts
// Run all jobs from the `default` queue - default limit is 10
const results = await payload.jobs.run()

// You can customize the queue name and limit by passing them as arguments:
await payload.jobs.run({ queue: 'nightly', limit: 100 })

// Run all jobs from all queues:
await payload.jobs.run({ allQueues: true })

// You can provide a where clause to filter the jobs that should be run:
await payload.jobs.run({
  where: { 'input.message': { equals: 'secret' } },
})
```

**Run a single job:**

```ts
const results = await payload.jobs.runByID({
  id: myJobID,
})
```

### Bin script

Finally, you can process jobs via the bin script that comes with Payload out of the box. By default, this script will run jobs from the `default` queue, with a limit of 10 jobs per invocation:

```sh
pnpm payload jobs:run
```

You can override the default queue and limit by passing the `--queue` and `--limit` flags:

```sh
pnpm payload jobs:run --queue myQueue --limit 15
```

If you want to run all jobs from all queues, you can pass the `--all-queues` flag:

```sh
pnpm payload jobs:run --all-queues
```

In addition, the bin script allows you to pass a `--cron` flag to the `jobs:run` command to run the jobs on a scheduled, cron basis:

```sh
pnpm payload jobs:run --cron "*/5 * * * *"
```

You can also pass `--handle-schedules` flag to the `jobs:run` command to make it schedule jobs according to configured schedules:

```sh
pnpm payload jobs:run --cron "*/5 * * * *" --queue myQueue --handle-schedules # This will both schedule jobs according to the configuration and run them
```

## Processing Order

By default, jobs are processed first in, first out (FIFO). This means that the first job added to the queue will be the first one processed. However, you can also configure the order in which jobs are processed.

### Jobs Configuration

You can configure the order in which jobs are processed in the jobs configuration by passing the `processingOrder` property. This mimics the Payload [sort](../queries/sort) property that's used for functionality such as `payload.find()`.

```ts
export default buildConfig({
  // Other configurations...
  jobs: {
    tasks: [
      // your tasks here
    ],
    processingOrder: '-createdAt', // Process jobs in reverse order of creation = LIFO
  },
})
```

You can also set this on a queue-by-queue basis:

```ts
export default buildConfig({
  // Other configurations...
  jobs: {
    tasks: [
      // your tasks here
    ],
    processingOrder: {
      default: 'createdAt', // FIFO
      queues: {
        nightly: '-createdAt', // LIFO
        myQueue: '-createdAt', // LIFO
      },
    },
  },
})
```

If you need even more control over the processing order, you can pass a function that returns the processing order - this function will be called every time a queue starts processing jobs.

```ts
export default buildConfig({
  // Other configurations...
  jobs: {
    tasks: [
      // your tasks here
    ],
    processingOrder: ({ queue }) => {
      if (queue === 'myQueue') {
        return '-createdAt' // LIFO
      }
      return 'createdAt' // FIFO
    },
  },
})
```

### Local API

You can configure the order in which jobs are processed in the `payload.jobs.queue` method by passing the `processingOrder` property.

```ts
const createdJob = await payload.jobs.queue({
  workflow: 'createPostAndUpdate',
  input: {
    title: 'my title',
  },
  processingOrder: '-createdAt', // Process jobs in reverse order of creation = LIFO
})
```

## Common Queue Strategies

Here are typical patterns for organizing your queues:

### Priority-Based Queues

Separate jobs by priority to ensure critical tasks run quickly:

```ts
export default buildConfig({
  jobs: {
    tasks: [
      /* ... */
    ],
    autoRun: [
      {
        cron: '* * * * *', // Every minute
        limit: 100,
        queue: 'critical',
      },
      {
        cron: '*/5 * * * *', // Every 5 minutes
        limit: 50,
        queue: 'default',
      },
      {
        cron: '0 2 * * *', // Daily at 2 AM
        limit: 1000,
        queue: 'batch',
      },
    ],
  },
})
```

Then queue jobs to appropriate queues:

```ts
// Critical: Password resets, payment confirmations
await payload.jobs.queue({
  task: 'sendPasswordReset',
  input: { userId: '123' },
  queue: 'critical',
})

// Default: Welcome emails, notifications
await payload.jobs.queue({
  task: 'sendWelcomeEmail',
  input: { userId: '123' },
  queue: 'default',
})

// Batch: Analytics, reports, cleanups
await payload.jobs.queue({
  task: 'generateAnalytics',
  input: { date: new Date() },
  queue: 'batch',
})
```

### Environment-Based Execution

Only run jobs on specific servers:

```ts
export default buildConfig({
  jobs: {
    tasks: [
      /* ... */
    ],
    shouldAutoRun: async (payload) => {
      // Only run jobs if this env var is set
      return process.env.ENABLE_JOB_WORKERS === 'true'
    },
    autoRun: [
      {
        cron: '*/5 * * * *',
        limit: 50,
        queue: 'default',
      },
    ],
  },
})
```

**Use cases:**

- Dedicate specific servers to job processing
- Disable job processing during deployments
- Scale job workers independently from API servers

### Feature-Based Queues

Group jobs by feature or domain:

```ts
autoRun: [
  { cron: '*/2 * * * *', queue: 'emails', limit: 100 },
  { cron: '*/10 * * * *', queue: 'images', limit: 50 },
  { cron: '0 * * * *', queue: 'analytics', limit: 1000 },
]
```

This makes it easy to:

- Monitor specific features
- Scale individual features independently
- Pause/resume specific types of work

## Choosing an Execution Method

Here's a quick guide to help you choose:

| Method                    | Best For                               | Pros                                   | Cons                                               |
| ------------------------- | -------------------------------------- | -------------------------------------- | -------------------------------------------------- |
| **Cron jobs** (`autoRun`) | Dedicated servers, long-running apps   | Simple setup, automatic execution      | Not for serverless, requires always-running server |
| **Endpoint**              | Serverless platforms (Vercel, Netlify) | Works with serverless, easy to trigger | Requires external cron (Vercel Cron, etc.)         |
| **Local API**             | Custom scheduling, testing             | Full control, good for tests           | Must implement your own scheduling                 |
| **Bin script**            | Development, manual execution          | Quick testing, manual control          | Manual invocation only                             |

**Recommendations:**

- **Production (Serverless):** Use Endpoint + Vercel Cron
- **Production (Server):** Use Cron jobs (`autoRun`)
- **Development:** Use Bin script or Local API
- **Testing:** Use Local API with `payload.jobs.runByID()`

## Troubleshooting

Jobs aren't running

**Is `shouldAutoRun` returning true?**

```ts
jobs: {
  shouldAutoRun: async (payload) => {
    console.log('shouldAutoRun called') // Add logging
    return true
  },
}
```

**Is `autoRun` configured correctly?**

```ts
// invalid cron syntax
autoRun: [{ cron: 'every 5 minutes' }]

// valid cron syntax
autoRun: [{ cron: '*/5 * * * *' }]
```

**Are jobs in the correct queue?**

```ts
// Queuing to 'critical' queue
await payload.jobs.queue({ task: 'myTask', queue: 'critical' })

// But autoRun only processes 'default' queue
autoRun: [{ queue: 'default' }] // won't pick up the job
```

**Check the jobs collection**

Enable the jobs collection in admin:

```ts
jobsCollectionOverrides: ({ defaultJobsCollection }) => ({
  ...defaultJobsCollection,
  admin: {
    ...defaultJobsCollection.admin,
    hidden: false,
  },
})
```

Look for jobs with:

- `processing: true` but stuck → Worker may have crashed
- `hasError: true` → Check the `log` field for errors
- `completedAt: null` → Job hasn't run yet

### Jobs running but failing

Check the job logs in the `payload-jobs` collection:

```ts
const job = await payload.findByID({
  collection: 'payload-jobs',
  id: jobId,
})

console.log(job.log) // View execution log
console.log(job.processingErrors) // View errors
```

### Jobs running too slowly

**Increase limit**

```ts
autoRun: [
  { cron: '*/5 * * * *', limit: 100 }, // Process more jobs per run
]
```

**Run more frequently**

```ts
autoRun: [
  { cron: '* * * * *', limit: 50 }, // Run every minute instead of every 5
]
```

**Add more workers**

Scale horizontally by running multiple servers with `ENABLE_JOB_WORKERS=true`.
```

--------------------------------------------------------------------------------

---[FILE: quick-start-example.mdx]---
Location: payload-main/docs/jobs-queue/quick-start-example.mdx

```text
---
title: Quick Start Example
label: Quick Start Example
order: 20
desc: A Queue is a specific group of jobs which can be executed in the order that they were added.
keywords: jobs queue, application framework, typescript, node, react, nextjs
---

Let's walk through a practical example of setting up a simple job queue. We'll create a task that sends a welcome email when a user signs up.

You might wonder: "Why not just send the email directly in the `afterChange` hook?"

- **Non-blocking**: If your email service takes 2-3 seconds to send, your API response would be delayed. With jobs, the API returns immediately.
- **Resilience**: If the email service is temporarily down, the hook would fail and potentially block the user creation. Jobs can retry automatically.
- **Scalability**: As your app grows, you can move job processing to dedicated servers, keeping your API fast.
- **Monitoring**: All jobs are tracked in the database, so you can see if emails failed and why.

Now let's build this example step by step.

### Step 1: Define a Task

First, create a task in your `payload.config.ts`:

```ts
import { buildConfig } from 'payload'

export default buildConfig({
  // ... other config
  jobs: {
    tasks: [
      {
        slug: 'sendWelcomeEmail',
        retries: 3,
        inputSchema: [
          {
            name: 'userEmail',
            type: 'email',
            required: true,
          },
          {
            name: 'userName',
            type: 'text',
            required: true,
          },
        ],
        handler: async ({ input, req }) => {
          // Send email using your email service
          await req.payload.sendEmail({
            to: input.userEmail,
            subject: 'Welcome!',
            text: `Hi ${input.userName}, welcome to our platform!`,
          })

          return {
            output: {
              emailSent: true,
            },
          }
        },
      },
    ],
  },
})
```

This defines a reusable task with a unique `slug`, an `inputSchema` that validates and types the input data, and a `handler` function containing the work to be performed. The `retries` option ensures the task will automatically retry up to 3 times if it fails. Learn more about [Tasks](/docs/jobs-queue/tasks).

### Step 2: Queue the Job trigger

```ts
{
  slug: 'users',
  hooks: {
    afterChange: [
      async ({ req, doc, operation }) => {
        // Only send welcome email for new users
        if (operation === 'create') {
          await req.payload.jobs.queue({
            task: 'sendWelcomeEmail',
            input: {
              userEmail: doc.email,
              userName: doc.name,
            },
          })
        }
      },
    ],
  },
  // ... fields
}
```

This uses [`payload.jobs.queue()`](/docs/jobs-queue/jobs#queuing-a-new-job) to create a job instance from the task definition. The job is added to the queue immediately but runs asynchronously, so the API response returns right away without waiting for the email to send. Jobs are stored in the database as documents in the `payload-jobs` collection.

### Step 3: Run the Jobs

```ts
export default buildConfig({
  // ... other config
  jobs: {
    tasks: [
      /* ... */
    ],
    autoRun: [
      {
        cron: '*/5 * * * *', // Run every 5 minutes
      },
    ],
  },
})
```

The [`autoRun`](/docs/jobs-queue/workflows#autorun) configuration automatically processes queued jobs on a schedule using cron syntax. In this example, Payload checks for pending jobs every 5 minutes and executes them. Alternatively, you can [manually trigger job processing](/docs/jobs-queue/workflows#manual-run) with `payload.jobs.run()` or run jobs in [separate worker processes](/docs/jobs-queue/workflows#inline-vs-workers) for better scalability.

That's it! Now when users sign up, a job is queued and will be processed within 5 minutes without blocking the API response.
```

--------------------------------------------------------------------------------

````
