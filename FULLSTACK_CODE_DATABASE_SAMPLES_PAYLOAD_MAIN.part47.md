---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 47
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 47 of 695)

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

---[FILE: workflows.mdx]---
Location: payload-main/docs/jobs-queue/workflows.mdx

```text
---
title: Workflows
label: Workflows
order: 40
desc: A Task is a distinct function declaration that can be run within Payload's Jobs Queue.
keywords: jobs queue, application framework, typescript, node, react, nextjs
---

<Banner type="default">
  A **"Workflow"** is an optional way to *combine multiple tasks together* in a
  way that can be gracefully retried from the point of failure.
</Banner>

They're most helpful when you have multiple tasks in a row, and you want to configure each task to be able to be retried if they fail.

If a task within a workflow fails, the Workflow will automatically "pick back up" on the task where it failed and **not re-execute any prior tasks that have already been executed**.

### Why use Workflows?

#### Single Task vs Workflow

If you only need to run one operation, use a single [Task](/docs/jobs-queue/tasks). But if you need multiple steps that depend on each other, use a Workflow.

**Example scenario:** When a user signs up, you need to:

1. Create their user profile
2. Send a welcome email
3. Add them to your email marketing list

Without a workflow, if step 2 fails, you'd have to:

- Re-run all three steps (wasting resources)
- Manually track which steps succeeded
- Risk creating duplicate profiles or sending duplicate emails

**With a workflow:**

- If step 2 fails, only step 2 retries (steps 1 and 3 don't re-run)
- All task outputs are automatically tracked
- The workflow "resumes" from the failure point

### Defining a workflow

The most important aspect of a Workflow is the `handler`, where you can declare when and how the tasks should run by simply calling the `runTask` function. If any task within the workflow, fails, the entire `handler` function will re-run.

However, importantly, tasks that have successfully been completed will simply re-return the cached and saved output without running again. The Workflow will pick back up where it failed and only task from the failure point onward will be re-executed.

To define a JS-based workflow, simply add a workflow to the `jobs.workflows` array in your Payload config. A workflow consists of the following fields:

| Option          | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `slug`          | Define a slug-based name for this workflow. This slug needs to be unique among both tasks and workflows.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `handler`       | The function that should be responsible for running the workflow. You can either pass a string-based path to the workflow function file, or workflow job function itself. If you are using large dependencies within your workflow, you might prefer to pass the string path because that will avoid bundling large dependencies in your Next.js app. Passing a string path is an advanced feature that may require a sophisticated build pipeline in order to work.                                                                                                                                                     |
| `inputSchema`   | Define the input field schema - Payload will generate a type for this schema.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `interfaceName` | You can use interfaceName to change the name of the interface that is generated for this workflow. By default, this is "Workflow" + the capitalized workflow slug.                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `label`         | Define a human-friendly label for this workflow.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `queue`         | Optionally, define the queue name that this workflow should be tied to. Defaults to "default".                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `retries`       | You can define `retries` on the workflow level, which will enforce that the workflow can only fail up to that number of retries. If a task does not have retries specified, it will inherit the retry count as specified on the workflow. You can specify `0` as `workflow` retries, which will disregard all `task` retry specifications and fail the entire workflow on any task failure. You can leave `workflow` retries as undefined, in which case, the workflow will respect what each task dictates as their own retry count. By default this is undefined, meaning workflows retries are defined by their tasks |

Example:

```ts
export default buildConfig({
  // ...
  jobs: {
    tasks: [
      // ...
    ]
    workflows: [
      {
        slug: 'createPostAndUpdate',

        // The arguments that the workflow will accept
        inputSchema: [
          {
            name: 'title',
            type: 'text',
            required: true,
          },
        ],

        // The handler that defines the "control flow" of the workflow
        // Notice how it uses the `tasks` argument to execute your predefined tasks.
        // These are strongly typed!
        handler: async ({ job, tasks }) => {

          // This workflow first runs a task called `createPost`.

          // You need to define a unique ID for this task invocation
          // that will always be the same if this workflow fails
          // and is re-executed in the future. Here, we hard-code it to '1'
          const output = await tasks.createPost('1', {
            input: {
              title: job.input.title,
            },
          })

          // Once the prior task completes, it will run a task
          // called `updatePost`
          await tasks.updatePost('2', {
            input: {
              post: job.taskStatus.createPost['1'].output.postID, // or output.postID
              title: job.input.title + '2',
            },
          })
        },
      } as WorkflowConfig<'updatePost'>
    ]
  }
})
```

#### Running tasks inline

In the above example, our workflow was executing tasks that we already had defined in our Payload config. But, you can also run tasks without predefining them.

To do this, you can use the `inlineTask` function.

The drawbacks of this approach are that tasks cannot be re-used across workflows as easily, and the **task data stored in the job** will not be typed. In the following example, the inline task data will be stored on the job under `job.taskStatus.inline['2']` but completely untyped, as types for dynamic tasks like these cannot be generated beforehand.

Example:

```ts
export default buildConfig({
  // ...
  jobs: {
    tasks: [
      // ...
    ]
    workflows: [
      {
        slug: 'createPostAndUpdate',
        inputSchema: [
          {
            name: 'title',
            type: 'text',
            required: true,
          },
        ],
        handler: async ({ job, tasks, inlineTask }) => {
          // Here, we run a predefined task.
          // The `createPost` handler arguments and return type
          // are both strongly typed
          const output = await tasks.createPost('1', {
            input: {
              title: job.input.title,
            },
          })

          // Here, this task is not defined in the Payload config
          // and is "inline". Its output will be stored on the Job in the database
          // however its arguments will be untyped.
          const { newPost } = await inlineTask('2', {
            task: async ({ req }) => {
              const newPost = await req.payload.update({
                collection: 'post',
                id: '2',
                req,
                retries: 3,
                data: {
                  title: 'updated!',
                },
              })
              return {
                output: {
                  newPost
                },
              }
            },
          })
        },
      } as WorkflowConfig<'updatePost'>
    ]
  }
})
```

### Understanding Workflow failure & recovery

One of the most powerful features of workflows is how they handle failures. Let's walk through what actually happens:

**Example workflow:**

```ts
handler: async ({ job, tasks }) => {
  await tasks.createProfile('step1', { input: { userId: '123' } })
  await tasks.sendEmail('step2', { input: { userId: '123' } })
  await tasks.addToList('step3', { input: { userId: '123' } })
}
```

#### Scenario: Email service is down

First execution attempt:

- Step 1 (`createProfile`) succeeds → Profile created in database
- Step 2 (`sendEmail`) fails → Email service timeout
- Step 3 (`addToList`) never runs → Workflow pauses

The job is marked for retry. Task 2 has `retries: 3`, so it will be attempted again.

Second execution attempt (automatic retry):

- Step 1 skipped → Returns cached output from first run (no duplicate profile)
- Step 2 retries → Email service is back up, succeeds!
- Step 3 runs → User added to mailing list

<Banner type="default">
  The entire handler function re-runs, but completed tasks return their cached
  results immediately without re-executing their logic.
</Banner>

### Accessing Task outputs

Tasks can pass data to subsequent tasks through their outputs:

```ts
handler: async ({ job, tasks }) => {
  // Task 1: Create a document and return its ID
  await tasks.createDocument('create-doc', {
    input: { title: 'My Document' },
  })

  // Access the output from task 1 in two ways:

  // Method 1: Through job.taskStatus
  const docId = job.taskStatus.createDocument['create-doc'].output.documentId

  // Method 2: Capture the return value directly
  const result = await tasks.createDocument('create-doc', {
    input: { title: 'My Document' },
  })
  const docId2 = result.output.documentId

  // Use the output in task 2
  await tasks.updateDocument('update-doc', {
    input: {
      documentId: docId,
      status: 'published',
    },
  })
}
```

**Task status structure:**

```ts
job.taskStatus = {
  [taskSlug]: {
    [taskId]: {
      input: {
        /* the input you passed */
      },
      output: {
        /* the output returned by the task */
      },
      complete: true,
      totalTried: 1,
    },
  },
}
```

### Workflow best practices

#### Use descriptive task IDs

```ts
// Hard to debug
await tasks.sendEmail('1', { input })
await tasks.updateUser('2', { input })

// Clear and maintainable
await tasks.sendEmail('send-welcome-email', { input })
await tasks.updateUser('mark-onboarding-complete', { input })
```

#### Keep tasks small and focused

```ts
// Task does too much
{
  slug: 'onboardUser',
  handler: async ({ input }) => {
    await createProfile(input)
    await sendEmail(input)
    await addToMailingList(input)
    // All-or-nothing - if email fails, everything fails
  }
}

// Separate tasks with individual retry logic
await tasks.createProfile('create-profile', { input })
await tasks.sendEmail('send-email', { input }) // Can retry independently
await tasks.addToMailingList('add-to-list', { input })
```

#### Pass IDs, not entire objects

```ts
// Passing large objects
await tasks.processUser('process', {
  input: {
    user: {
      /* entire user object with all fields */
    },
  },
})

// Pass just the ID
await tasks.processUser('process', {
  input: {
    userId: '123',
  },
})
// Task fetches what it needs: await req.payload.findByID(...)
```

#### Set appropriate retry counts

- **External APIs** (email, payment processors): Higher retries (3-5) - services can be temporarily unavailable
- **Database operations**: Lower retries (1-2) - usually succeed or fail permanently
- **Idempotent operations** (safe to run multiple times): Higher retries are safe
- **Non-idempotent operations** (creates, charges, sends): Lower retries to avoid duplicates

#### Handle errors with context

```ts
handler: async ({ input, req }) => {
  try {
    const result = await fetch('https://api.example.com/data')
    if (!result.ok) {
      throw new Error(`API returned ${result.status}: ${result.statusText}`)
    }
    return { output: { success: true } }
  } catch (error) {
    // Provide context about what failed and why
    throw new Error(
      `Failed to sync data for user ${input.userId}: ${error.message}`,
    )
  }
}
```
```

--------------------------------------------------------------------------------

---[FILE: client.mdx]---
Location: payload-main/docs/live-preview/client.mdx

```text
---
title: Client-side Live Preview
label: Client-side
order: 40
desc: Learn how to implement Live Preview in your client-side front-end application.
keywords: live preview, frontend, react, next.js, vue, nuxt.js, svelte, hook, useLivePreview
---

<Banner type="info">
  If your front-end application supports Server Components like the [Next.js App
  Router](https://nextjs.org/docs/app), etc., we suggest setting up [server-side
  Live Preview](./server) instead.
</Banner>

While using Live Preview, the [Admin Panel](../admin/overview) emits a new `window.postMessage` event every time your document has changed. Your front-end application can listen for these events and re-render accordingly.

If your front-end application is built with [React](#react) or [Vue](#vue), use the `useLivePreview` hooks that Payload provides. In the future, all other major frameworks like Svelte will be officially supported. If you are using any of these frameworks today, you can still integrate with Live Preview yourself using the underlying tooling that Payload provides. See [building your own hook](#building-your-own-hook) for more information.

By default, all hooks accept the following args:

| Path               | Description                                                                            |
| ------------------ | -------------------------------------------------------------------------------------- |
| **`serverURL`** \* | The URL of your Payload server.                                                        |
| **`initialData`**  | The initial data of the document. The live data will be merged in as changes are made. |
| **`depth`**        | The depth of the relationships to fetch. Defaults to `0`.                              |
| **`apiRoute`**     | The path of your API route as defined in `routes.api`. Defaults to `/api`.             |

_\* An asterisk denotes that a property is required._

And return the following values:

| Path            | Description                                                      |
| --------------- | ---------------------------------------------------------------- |
| **`data`**      | The live data of the document, merged with the initial data.     |
| **`isLoading`** | A boolean that indicates whether or not the document is loading. |

<Banner type="info">
  If your front-end is tightly coupled to required fields, you should ensure
  that your UI does not break when these fields are removed. For example, if you
  are rendering something like `data.relatedPosts[0].title`, your page will
  break once you remove the first related post. To get around this, use
  conditional logic, optional chaining, or default values in your UI where
  needed. For example, `data?.relatedPosts?.[0]?.title`.
</Banner>

<Banner type="info">
  It is important that the `depth` argument matches exactly with the depth of
  your initial page request. The depth property is used to populated
  relationships and uploads beyond their IDs. See [Depth](../queries/depth) for
  more information.
</Banner>

## Frameworks

Live Preview will work with any front-end framework that supports the native [`window.postMessage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) API. By default, Payload officially supports the most popular frameworks, including:

- [React](#react)
- [Vue](#vue)

If your framework is not listed, you can still integrate with Live Preview using the underlying tooling that Payload provides. [More details](#building-your-own-hook).

### React

If your front-end application is built with client-side [React](https://react.dev) like [Next.js Pages Router](https://nextjs.org/docs/pages), you can use the `useLivePreview` hook that Payload provides.

First, install the `@payloadcms/live-preview-react` package:

```bash
npm install @payloadcms/live-preview-react
```

Then, use the `useLivePreview` hook in your React component:

```tsx
'use client'
import { useLivePreview } from '@payloadcms/live-preview-react'
import { Page as PageType } from '@/payload-types'

// Fetch the page in a server component, pass it to the client component, then thread it through the hook
// The hook will take over from there and keep the preview in sync with the changes you make
// The `data` property will contain the live data of the document
export const PageClient: React.FC<{
  page: {
    title: string
  }
}> = ({ page: initialPage }) => {
  const { data } = useLivePreview<PageType>({
    initialData: initialPage,
    serverURL: PAYLOAD_SERVER_URL,
    depth: 2,
  })

  return <h1>{data.title}</h1>
}
```

<Banner type="warning">
  **Reminder:** If you are using [React Server
  Components](https://react.dev/reference/rsc/server-components), we strongly
  suggest setting up [server-side Live Preview](./server) instead.
</Banner>

### Vue

If your front-end application is built with [Vue 3](https://vuejs.org) or [Nuxt 3](https://nuxt.js), you can use the `useLivePreview` composable that Payload provides.

First, install the `@payloadcms/live-preview-vue` package:

```bash
npm install @payloadcms/live-preview-vue
```

Then, use the `useLivePreview` hook in your Vue component:

```ts
<script setup lang="ts">
import type { PageData } from '~/types';
import { defineProps } from 'vue';
import { useLivePreview } from '@payloadcms/live-preview-vue';

// Fetch the initial data on the parent component or using async state
const props = defineProps<{ initialData: PageData }>();

// The hook will take over from here and keep the preview in sync with the changes you make.
// The `data` property will contain the live data of the document only when viewed from the Preview view of the Admin UI.
const { data } = useLivePreview<PageData>({
  initialData: props.initialData,
  serverURL: "<PAYLOAD_SERVER_URL>",
  depth: 2,
});
</script>

<template>
  <h1>{{ data.title }}</h1>
</template>
```

## Building your own hook

No matter what front-end framework you are using, you can build your own hook using the same underlying tooling that Payload provides.

First, install the base `@payloadcms/live-preview` package:

```bash
npm install @payloadcms/live-preview
```

This package provides the following functions:

| Path                     | Description                                                                                                        |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| **`subscribe`**          | Subscribes to the Admin Panel's `window.postMessage` events and calls the provided callback function.              |
| **`unsubscribe`**        | Unsubscribes from the Admin Panel's `window.postMessage` events.                                                   |
| **`ready`**              | Sends a `window.postMessage` event to the Admin Panel to indicate that the front-end is ready to receive messages. |
| **`isLivePreviewEvent`** | Checks if a `MessageEvent` originates from the Admin Panel and is a Live Preview event, i.e. debounced form state. |

The `subscribe` function takes the following args:

| Path               | Description                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------- |
| **`callback`** \*  | A callback function that is called with `data` every time a change is made to the document. |
| **`serverURL`** \* | The URL of your Payload server.                                                             |
| **`initialData`**  | The initial data of the document. The live data will be merged in as changes are made.      |
| **`depth`**        | The depth of the relationships to fetch. Defaults to `0`.                                   |

With these functions, you can build your own hook using your front-end framework of choice:

```tsx
import { subscribe, unsubscribe } from '@payloadcms/live-preview'

// To build your own hook, subscribe to Live Preview events using the `subscribe` function
// It handles everything from:
// 1. Listening to `window.postMessage` events
// 2. Merging initial data with active form state
// 3. Populating relationships and uploads
// 4. Calling the `onChange` callback with the result
// Your hook should also:
// 1. Tell the Admin Panel when it is ready to receive messages
// 2. Handle the results of the `onChange` callback to update the UI
// 3. Unsubscribe from the `window.postMessage` events when it unmounts
```

Here is an example of what the same `useLivePreview` React hook from above looks like under the hood:

```tsx
import { subscribe, unsubscribe, ready } from '@payloadcms/live-preview'
import { useCallback, useEffect, useState, useRef } from 'react'

export const useLivePreview = <T extends any>(props: {
  depth?: number
  initialData: T
  serverURL: string
}): {
  data: T
  isLoading: boolean
} => {
  const { depth = 0, initialData, serverURL } = props
  const [data, setData] = useState<T>(initialData)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const hasSentReadyMessage = useRef<boolean>(false)

  const onChange = useCallback((mergedData) => {
    // When a change is made, the `onChange` callback will be called with the merged data
    // Set this merged data into state so that React will re-render the UI
    setData(mergedData)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Listen for `window.postMessage` events from the Admin Panel
    // When a change is made, the `onChange` callback will be called with the merged data
    const subscription = subscribe({
      callback: onChange,
      depth,
      initialData,
      serverURL,
    })

    // Once subscribed, send a `ready` message back up to the Admin Panel
    // This will indicate that the front-end is ready to receive messages
    if (!hasSentReadyMessage.current) {
      hasSentReadyMessage.current = true

      ready({
        serverURL,
      })
    }

    // When the component unmounts, unsubscribe from the `window.postMessage` events
    return () => {
      unsubscribe(subscription)
    }
  }, [serverURL, onChange, depth, initialData])

  return {
    data,
    isLoading,
  }
}
```

<Banner type="info">
  When building your own hook, ensure that the args and return values are
  consistent with the ones listed at the top of this document. This will ensure
  that all hooks follow the same API.
</Banner>

## Example

For a working demonstration of this, check out the official [Live Preview Example](https://github.com/payloadcms/payload/tree/main/examples/live-preview). There you will find an example of a fully integrated Next.js App Router front-end that runs on the same server as Payload.

## Troubleshooting

#### Relationships and/or uploads are not populating

If you are using relationships or uploads in your front-end application, and your front-end application runs on a different domain than your Payload server, you may need to configure [CORS](../configuration/overview#cors) to allow requests to be made between the two domains. This includes sites that are running on a different port or subdomain. Similarly, if you are protecting resources behind user authentication, you may also need to configure [CSRF](../authentication/cookies#csrf-prevention) to allow cookies to be sent between the two domains. For example:

```ts
// payload.config.ts
{
  // ...
  // If your site is running on a different domain than your Payload server,
  // This will allow requests to be made between the two domains
  cors: [
    'http://localhost:3001' // Your front-end application
  ],
  // If you are protecting resources behind user authentication,
  // This will allow cookies to be sent between the two domains
  csrf: [
    'http://localhost:3001' // Your front-end application
  ],
}
```

#### Relationships and/or uploads disappear after editing a document

It is possible that either you are setting an improper [`depth`](../queries/depth) in your initial request and/or your `useLivePreview` hook, or they're mismatched. Ensure that the `depth` parameter is set to the correct value, and that it matches exactly in both places. For example:

```tsx
// Your initial request
const { docs } = await payload.find({
  collection: 'pages',
  depth: 1, // Ensure this is set to the proper depth for your application
  where: {
    slug: {
      equals: 'home',
    },
  },
})
```

```tsx
// Your hook
const { data } = useLivePreview<PageType>({
  initialData: initialPage,
  serverURL: PAYLOAD_SERVER_URL,
  depth: 1, // Ensure this matches the depth of your initial request
})
```

#### Iframe refuses to connect

If your front-end application has set a [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) (CSP) that blocks the Admin Panel from loading your front-end application, the iframe will not be able to load your site. To resolve this, you can whitelist the Admin Panel's domain in your CSP by setting the `frame-ancestors` directive:

```plaintext
frame-ancestors: "self" localhost:* https://your-site.com;
```
```

--------------------------------------------------------------------------------

---[FILE: frontend.mdx]---
Location: payload-main/docs/live-preview/frontend.mdx

```text
---
title: Implementing Live Preview in your frontend
label: Frontend
order: 20
desc: Learn how to implement Live Preview in your front-end application.
keywords: live preview, frontend, react, next.js, vue, nuxt.js, svelte, hook, useLivePreview
---

There are two ways to use Live Preview in your own application depending on whether your front-end framework supports Server Components:

- [Server-side Live Preview (suggested)](./server)
- [Client-side Live Preview](./client)

<Banner type="info">
  We suggest using server-side Live Preview if your framework supports Server
  Components, it is both simpler to setup and more performant to run than the
  client-side alternative.
</Banner>
```

--------------------------------------------------------------------------------

---[FILE: overview.mdx]---
Location: payload-main/docs/live-preview/overview.mdx

```text
---
title: Live Preview
label: Overview
order: 10
desc: With Live Preview you can render your front-end application directly within the Admin Panel. Your changes take effect as you type. No save needed.
keywords: live preview, preview, live, iframe, iframe preview, visual editing, design
---

With Live Preview you can render your front-end application directly within the [Admin Panel](../admin/overview). As you type, your changes take effect in real-time. No need to save a draft or publish your changes. This works in both [Server-side](./server) as well as [Client-side](./client) environments.

Live Preview works by rendering an iframe on the page that loads your front-end application. The Admin Panel communicates with your app through [`window.postMessage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) events. These events are emitted every time a change is made to the Document. Your app then listens for these events and re-renders itself with the data it receives.

To add Live Preview, use the `admin.livePreview` property in your [Payload Config](../configuration/overview):

```ts
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  admin: {
    // ...
    // highlight-start
    livePreview: {
      url: 'http://localhost:3000',
      collections: ['pages'],
    },
    // highlight-end
  },
})
```

<Banner type="warning">
  **Reminder:** Alternatively, you can define the `admin.livePreview` property
  on individual [Collection Admin
  Configs](../configuration/collections#admin-options) and [Global Admin
  Configs](../configuration/globals#admin-options). Settings defined here will
  be merged into the top-level as overrides.
</Banner>

## Options

Setting up Live Preview is easy. This can be done either globally through the [Root Admin Config](../admin/overview), or on individual [Collection Admin Configs](../configuration/collections#admin-options) and [Global Admin Configs](../configuration/globals#admin-options). Once configured, a new "Live Preview" button will appear at the top of enabled Documents. Toggling this button opens the preview window and loads your front-end application.

The following options are available:

| Path              | Description                                                                                                                                           |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`url`**         | String, or function that returns a string, pointing to your front-end application. This value is used as the iframe `src`. [More details](#url).      |
| **`breakpoints`** | Array of breakpoints to be used as “device sizes” in the preview window. Each item appears as an option in the toolbar. [More details](#breakpoints). |
| **`collections`** | Array of collection slugs to enable Live Preview on.                                                                                                  |
| **`globals`**     | Array of global slugs to enable Live Preview on.                                                                                                      |

### URL

The `url` property resolves to a string that points to your front-end application. This value is used as the `src` attribute of the iframe rendering your front-end. Once loaded, the Admin Panel will communicate directly with your app through `window.postMessage` events.

To set the URL, use the `admin.livePreview.url` property in your [Payload Config](../configuration/overview):

```ts
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  admin: {
    // ...
    livePreview: {
      url: 'http://localhost:3000', // highlight-line
      collections: ['pages'],
    },
  },
})
```

#### Dynamic URLs

You can also pass a function in order to dynamically format URLs. This is useful for multi-tenant applications, localization, or any other scenario where the URL needs to be generated based on the Document being edited.

This is also useful for conditionally rendering Live Preview, similar to access control. See [Conditional Rendering](./conditional-rendering) for more details.

To set dynamic URLs, set the `admin.livePreview.url` property in your [Payload Config](../configuration/overview) to a function:

```ts
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  admin: {
    // ...
    livePreview: {
      // highlight-start
      url: ({ data, collectionConfig, locale }) =>
        `${data.tenant.url}${
          collectionConfig.slug === 'posts'
            ? `/posts/${data.slug}`
            : `${data.slug !== 'home' ? `/${data.slug}` : ''}`
        }${locale ? `?locale=${locale?.code}` : ''}`, // Localization query param
      collections: ['pages'],
    },
    // highlight-end
  },
})
```

The following arguments are provided to the `url` function:

| Path                   | Description                                                                                                           |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **`data`**             | The data of the Document being edited. This includes changes that have not yet been saved.                            |
| **`locale`**           | The locale currently being edited (if applicable). [More details](../configuration/localization).                     |
| **`collectionConfig`** | The Collection Admin Config of the Document being edited. [More details](../configuration/collections#admin-options). |
| **`globalConfig`**     | The Global Admin Config of the Document being edited. [More details](../configuration/globals#admin-options).         |
| **`req`**              | The Payload Request object.                                                                                           |

You can return either an absolute URL or relative URL from this function. If you don't know the URL of your frontend at build-time, you can return a relative URL, and in that case, Payload will automatically construct an absolute URL by injecting the protocol, domain, and port from your browser window. Returning a relative URL is helpful for platforms like Vercel where you may have preview deployment URLs that are unknown at build time.

If your application requires a fully qualified URL, or you are attempting to preview with a frontend on a different domain, you can use the `req` property to build this URL:

```ts
url: ({ data, req }) => `${req.protocol}//${req.host}/${data.slug}`
```

#### Conditional Rendering

You can conditionally render Live Preview by returning `undefined` or `null` from the `url` function. This is similar to access control, where you may want to restrict who can use Live Preview based on certain criteria, such as the current user or document data.

For example, you could check the user's role and only enable Live Preview if they have the appropriate permissions:

```ts
url: ({ req }) => (req.user?.role === 'admin' ? '/hello-world' : null)
```

### Breakpoints

The breakpoints property is an array of objects which are used as “device sizes” in the preview window. Each item will render as an option in the toolbar. When selected, the preview window will resize to the exact dimensions specified in that breakpoint.

To set breakpoints, use the `admin.livePreview.breakpoints` property in your [Payload Config](../configuration/overview):

```ts
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  admin: {
    // ...
    livePreview: {
      url: 'http://localhost:3000',
      // highlight-start
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
      ],
      // highlight-end
    },
  },
})
```

The following options are available for each breakpoint:

| Path            | Description                                                                 |
| --------------- | --------------------------------------------------------------------------- |
| **`label`** \*  | The label to display in the drop-down. This is what the user will see.      |
| **`name`** \*   | The name of the breakpoint.                                                 |
| **`width`** \*  | The width of the breakpoint. This is used to set the width of the iframe.   |
| **`height`** \* | The height of the breakpoint. This is used to set the height of the iframe. |

_\* An asterisk denotes that a property is required._

The "Responsive" option is always available in the drop-down and requires no additional configuration. This is the default breakpoint that will be used on initial load. This option styles the iframe with a width and height of `100%` so that it fills the screen at its maximum size and automatically resizes as the window changes size.

You may also explicitly resize the Live Preview by using the corresponding inputs in the toolbar. This will temporarily override the breakpoint selection to "Custom" until a predefined breakpoint is selected once again.

If you prefer to freely resize the Live Preview without the use of breakpoints, you can open it in a new window by clicking the button in the toolbar. This will close the iframe and open a new window which can be resized as you wish. Closing it will automatically re-open the iframe.

## Example

For a working demonstration of this, check out the official [Live Preview Example](https://github.com/payloadcms/payload/tree/main/examples/live-preview).
```

--------------------------------------------------------------------------------

````
