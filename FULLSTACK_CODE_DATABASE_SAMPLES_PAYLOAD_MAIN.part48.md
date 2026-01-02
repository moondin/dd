---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 48
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 48 of 695)

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

---[FILE: server.mdx]---
Location: payload-main/docs/live-preview/server.mdx

```text
---
title: Server-side Live Preview
label: Server-side
order: 30
desc: Learn how to implement Live Preview in your server-side front-end application.
keywords: live preview, frontend, react, next.js, vue, nuxt.js, svelte, hook, useLivePreview
---

<Banner type="info">
  Server-side Live Preview is only for front-end frameworks that support the
  concept of Server Components, i.e. [React Server
  Components](https://react.dev/reference/rsc/server-components). If your
  front-end application is built with a client-side framework like the [Next.js
  Pages Router](https://nextjs.org/docs/pages), [React
  Router](https://reactrouter.com), [Vue 3](https://vuejs.org), etc., see
  [client-side Live Preview](./client).
</Banner>

Server-side Live Preview works by making a roundtrip to the server every time your document is saved, i.e. draft save, autosave, or publish. While using Live Preview, the Admin Panel emits a new `window.postMessage` event which your front-end application can use to invoke this process. In Next.js, this means simply calling `router.refresh()` which will hydrate the HTML using new data straight from the [Local API](../local-api/overview).

<Banner type="warning">
  It is recommended that you enable [Autosave](../versions/autosave) alongside
  Live Preview to make the experience feel more responsive.
</Banner>

If your front-end application is built with [React](#react), you can use the `RefreshRouteOnChange` function that Payload provides. In the future, all other major frameworks like Vue and Svelte will be officially supported. If you are using any of these frameworks today, you can still integrate with Live Preview yourself using the underlying tooling that Payload provides. See [building your own router refresh component](#building-your-own-router-refresh-component) for more information.

## React

If your front-end application is built with server-side [React](https://react.dev) like [Next.js App Router](https://nextjs.org/docs/app), you can use the `RefreshRouteOnSave` component that Payload provides.

First, install the `@payloadcms/live-preview-react` package:

```bash
npm install @payloadcms/live-preview-react
```

Then, render the `RefreshRouteOnSave` component anywhere in your `page.tsx`. Here's an example:

`page.tsx`:

```tsx
import { RefreshRouteOnSave } from './RefreshRouteOnSave.tsx'
import { getPayload } from 'payload'
import config from '../payload.config'

export default async function Page() {
  const payload = await getPayload({ config })

  const page = await payload.findByID({
    collection: 'pages',
    id: '123',
    draft: true,
    trash: true, // add this if trash is enabled in your collection and want to preview trashed documents
  })

  return (
    <Fragment>
      <RefreshRouteOnSave />
      <h1>{page.title}</h1>
    </Fragment>
  )
}
```

`RefreshRouteOnSave.tsx`:

```tsx
'use client'
import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation.js'
import React from 'react'

export const RefreshRouteOnSave: React.FC = () => {
  const router = useRouter()

  return (
    <PayloadLivePreview
      refresh={() => router.refresh()}
      serverURL={process.env.NEXT_PUBLIC_PAYLOAD_URL}
    />
  )
}
```

## Building your own router refresh component

No matter what front-end framework you are using, you can build your own component using the same underlying tooling that Payload provides.

First, install the base `@payloadcms/live-preview` package:

```bash
npm install @payloadcms/live-preview
```

This package provides the following functions:

| Path                  | Description                                                                                                                        |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **`ready`**           | Sends a `window.postMessage` event to the Admin Panel to indicate that the front-end is ready to receive messages.                 |
| **`isDocumentEvent`** | Checks if a `MessageEvent` originates from the Admin Panel and is a document-level event, i.e. draft save, autosave, publish, etc. |

With these functions, you can build your own hook using your front-end framework of choice:

```tsx
import { ready, isDocumentEvent } from '@payloadcms/live-preview'

// To build your own component:
// 1. Listen for document-level `window.postMessage` events sent from the Admin Panel
// 2. Tell the Admin Panel when it is ready to receive messages
// 3. Refresh the route every time a new document-level event is received
// 4. Unsubscribe from the `window.postMessage` events when it unmounts
```

Here is an example of what the same `RefreshRouteOnSave` React component from above looks like under the hood:

```tsx
'use client'

import type React from 'react'

import { isDocumentEvent, ready } from '@payloadcms/live-preview'
import { useCallback, useEffect, useRef } from 'react'

export const RefreshRouteOnSave: React.FC<{
  apiRoute?: string
  depth?: number
  refresh: () => void
  serverURL: string
}> = (props) => {
  const { apiRoute, depth, refresh, serverURL } = props
  const hasSentReadyMessage = useRef<boolean>(false)

  const onMessage = useCallback(
    (event: MessageEvent) => {
      if (isDocumentEvent(event, serverURL)) {
        if (typeof refresh === 'function') {
          refresh()
        }
      }
    },
    [refresh, serverURL],
  )

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('message', onMessage)
    }

    if (!hasSentReadyMessage.current) {
      hasSentReadyMessage.current = true

      ready({
        serverURL,
      })
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('message', onMessage)
      }
    }
  }, [serverURL, onMessage, depth, apiRoute])

  return null
}
```

## Example

For a working demonstration of this, check out the official [Live Preview Example](https://github.com/payloadcms/payload/tree/main/examples/live-preview). There you will find a fully working example of how to implement Live Preview in your Next.js App Router application.

## Troubleshooting

#### Updates do not appear as fast as client-side Live Preview

If you are noticing that updates feel less snappy than client-side Live Preview (i.e. the `useLivePreview` hook), this is because of how the two differ in how they work—instead of emitting events against _form state_, server-side Live Preview refreshes the route after a new document is _saved_.

Use [Autosave](../versions/autosave) to mimic this effect server-side. Try decreasing the value of `versions.autoSave.interval` to make the experience feel more responsive:

```ts
// collection.ts
{
   versions: {
    drafts: {
      autosave: {
        interval: 375,
      },
    },
  },
}
```

#### Iframe refuses to connect

If your front-end application has set a [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) (CSP) that blocks the Admin Panel from loading your front-end application, the iframe will not be able to load your site. To resolve this, you can whitelist the Admin Panel's domain in your CSP by setting the `frame-ancestors` directive:

```plaintext
frame-ancestors: "self" localhost:* https://your-site.com;
```
```

--------------------------------------------------------------------------------

---[FILE: access-control.mdx]---
Location: payload-main/docs/local-api/access-control.mdx

```text
---
title: Respecting Access Control with Local API Operations
label: Access Control
order: 40
desc: Learn how to implement and enforce access control in Payload's Local API operations, ensuring that the right permissions are respected during data manipulation.
keywords: server functions, local API, Payload, CMS, access control, permissions, user context, server-side logic, custom workflows, data management, headless CMS, TypeScript, Node.js, backend
---

In Payload, local API operations **override access control by default**. This means that operations will run without checking if the current user has permission to perform the action. This is useful in certain scenarios where access control is not necessary, but it is important to be aware of when to enforce it for security reasons.

### Default Behavior: Access Control Skipped

By default, **local API operations skip access control**. This allows operations to execute without the system checking if the current user has appropriate permissions. This might be helpful in admin or server-side scripts where the user context is not required to perform the operation.

#### For example:

```ts
// Access control is this operation would be skipped by default
const test = await payload.create({
  collection: 'users',
  data: {
    email: 'test@test.com',
    password: 'test',
  },
})
```

### Respecting Access Control

If you want to respect access control and ensure that the operation is performed only if the user has appropriate permissions, you need to explicitly pass the `user` object and set the `overrideAccess` option to `false`.

- `overrideAccess: false`: This ensures that access control is **not skipped** and the operation respects the current user's permissions.
- `user`: Pass the authenticated user context to the operation. This ensures the system checks whether the user has the right permissions to perform the action.

```ts
const authedCreate = await payload.create({
  collection: 'users',
  overrideAccess: false, // This ensures access control will be applied
  user, // Pass the authenticated user to check permissions
  data: {
    email: 'test@test.com',
    password: 'test',
  },
})
```

This example will only allow the document to be created if the `user` we passed has the appropriate access control permissions.
```

--------------------------------------------------------------------------------

---[FILE: outside-nextjs.mdx]---
Location: payload-main/docs/local-api/outside-nextjs.mdx

```text
---
title: Using Payload outside Next.js
label: Outside Next.js
order: 20
desc: Payload can be used outside of Next.js within standalone scripts or in other frameworks like Remix, SvelteKit, Nuxt, and similar.
keywords: local api, config, configuration, documentation, Content Management System, cms, headless, javascript, node, react, express
---

Payload can be used completely outside of Next.js which is helpful in cases like running scripts, using Payload in a separate backend service, or using Payload's Local API to fetch your data directly from your database in other frontend frameworks like SvelteKit, Remix, Nuxt, and similar.

<Banner>
  **Note:** Payload and all of its official packages are fully ESM. If you want
  to use Payload within your own projects, make sure you are writing your
  scripts in ESM format or dynamically importing the Payload Config.
</Banner>

## Importing the Payload Config outside of Next.js

Payload provides a convenient way to run standalone scripts, which can be useful for tasks like seeding your database or performing one-off operations.

In standalone scripts, you can simply import the Payload Config and use it right away. If you need an initialized copy of Payload, you can then use the `getPayload` function. This can be useful for tasks like seeding your database or performing other one-off operations.

```ts
import { getPayload } from 'payload'
import config from '@payload-config'

const seed = async () => {
  // Get a local copy of Payload by passing your config
  const payload = await getPayload({ config })

  const user = await payload.create({
    collection: 'users',
    data: {
      email: 'dev@payloadcms.com',
      password: 'some-password',
    },
  })

  const page = await payload.create({
    collection: 'pages',
    data: {
      title: 'My Homepage',
      // other data to seed here
    },
  })
}

// Call the function here to run your seed script
await seed()
```

You can then execute the script using `payload run`. Example: if you placed this standalone script in `src/seed.ts`, you would execute it like this:

```sh
payload run src/seed.ts
```

The `payload run` command does two things for you:

1. It loads the environment variables the same way Next.js loads them, eliminating the need for additional dependencies like `dotenv`. The usage of `dotenv` is not recommended, as Next.js loads environment variables differently. By using `payload run`, you ensure consistent environment variable handling across your Payload and Next.js setup.
2. It initializes tsx, allowing direct execution of TypeScript files manually installing tools like tsx or ts-node.

### Troubleshooting

If you encounter import-related errors, you have 2 options:

#### Option 1: enable swc mode by appending `--use-swc` to the `payload` command:

Example:

```sh
payload run src/seed.ts --use-swc
```

Note: Install @swc-node/register in your project first. While swc mode is faster than the default tsx mode, it might break for some imports.

#### Option 2: use an alternative runtime like bun

While we do not guarantee support for alternative runtimes, you are free to use them and disable Payload's own transpilation by appending the `--disable-transpile` flag to the `payload` command:

```sh
bunx --bun payload run src/seed.ts --disable-transpile
```

You will need to have bun installed on your system for this to work.
```

--------------------------------------------------------------------------------

---[FILE: overview.mdx]---
Location: payload-main/docs/local-api/overview.mdx

```text
---
title: Local API
label: Overview
order: 10
desc: The Payload Local API allows you to interact with your database and execute the same operations that are available through REST and GraphQL within Node, directly on your server.
keywords: local api, config, configuration, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

The Payload Local API gives you the ability to execute the same operations that are available through REST and GraphQL within Node, directly on your server. Here, you don't need to deal with server latency or network speed whatsoever and can interact directly with your database.

<Banner type="success">
  **Tip:**

The Local API is incredibly powerful when used in React Server Components and other similar server-side contexts. With other headless CMS, you need to request your data from third-party servers via an HTTP layer, which can add significant loading time to your server-rendered pages. With Payload, you don't have to leave your server to gather the data you need. It can be incredibly fast and is definitely a game changer.

</Banner>

Here are some common examples of how you can use the Local API:

- Fetching Payload data within React Server Components
- Seeding data via Node seed scripts that you write and maintain
- Opening custom Next.js route handlers which feature additional functionality but still rely on Payload
- Within [Access Control](../access-control/overview) and [Hooks](../hooks/overview)

## Accessing Payload

You can gain access to the currently running `payload` object via two ways:

#### Accessing from args or `req`

In most places within Payload itself, you can access `payload` directly from the arguments of [Hooks](../hooks/overview), [Access Control](../access-control/overview), [Validation](../fields/overview#validation) functions, and similar. This is the simplest way to access Payload in most cases. Most config functions take the `req` (Request) object, which has Payload bound to it (`req.payload`).

Example:

```ts
const afterChangeHook: CollectionAfterChangeHook = async ({
  req: { payload },
}) => {
  const posts = await payload.find({
    collection: 'posts',
  })
}
```

#### Importing it

If you want to import Payload in places where you don't have the option to access it from function arguments or `req`, you can import it and initialize it.

```ts
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })
```

If you're working in Next.js' development mode, Payload will work with Hot Module Replacement (HMR), and as you make changes to your Payload Config, your usage of Payload will always be in sync with your changes. In production, `getPayload` simply disables all HMR functionality so you don't need to write your code any differently. We handle optimization for you in production mode.

If you are accessing Payload via function arguments or `req.payload`, HMR is automatically supported if you are using it within Next.js.

For more information about using Payload outside of Next.js, [click here](./outside-nextjs).

## Local options available

You can specify more options within the Local API vs. REST or GraphQL due to the server-only context that they are executed in.

| Local Option         | Description                                                                                                                                                                                                                                                                                                                                                           |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `collection`         | Required for Collection operations. Specifies the Collection slug to operate against.                                                                                                                                                                                                                                                                                 |
| `data`               | The data to use within the operation. Required for `create`, `update`.                                                                                                                                                                                                                                                                                                |
| `depth`              | [Control auto-population](../queries/depth) of nested relationship and upload fields.                                                                                                                                                                                                                                                                                 |
| `locale`             | Specify [locale](/docs/configuration/localization) for any returned documents.                                                                                                                                                                                                                                                                                        |
| `select`             | Specify [select](../queries/select) to control which fields to include to the result.                                                                                                                                                                                                                                                                                 |
| `populate`           | Specify [populate](../queries/select#populate) to control which fields to include to the result from populated documents.                                                                                                                                                                                                                                             |
| `fallbackLocale`     | Specify a [fallback locale](/docs/configuration/localization) to use for any returned documents. This can be a single locale or array of locales.                                                                                                                                                                                                                     |
| `overrideAccess`     | Skip access control. By default, this property is set to true within all Local API operations.                                                                                                                                                                                                                                                                        |
| `overrideLock`       | By default, document locks are ignored (`true`). Set to `false` to enforce locks and prevent operations when a document is locked by another user. [More details](../admin/locked-documents).                                                                                                                                                                         |
| `user`               | If you set `overrideAccess` to `false`, you can pass a user to use against the access control checks.                                                                                                                                                                                                                                                                 |
| `showHiddenFields`   | Opt-in to receiving hidden fields. By default, they are hidden from returned documents in accordance to your config.                                                                                                                                                                                                                                                  |
| `pagination`         | Set to false to return all documents and avoid querying for document counts.                                                                                                                                                                                                                                                                                          |
| `context`            | [Context](/docs/hooks/context), which will then be passed to `context` and `req.context`, which can be read by hooks. Useful if you want to pass additional information to the hooks which shouldn't be necessarily part of the document, for example a `triggerBeforeChange` option which can be read by the BeforeChange hook to determine if it should run or not. |
| `disableErrors`      | When set to `true`, errors will not be thrown. Instead, the `findByID` operation will return `null`, and the `find` operation will return an empty documents array.                                                                                                                                                                                                   |
| `disableTransaction` | When set to `true`, a [database transactions](../database/transactions) will not be initialized.                                                                                                                                                                                                                                                                      |

_There are more options available on an operation by operation basis outlined below._

## Transactions

When your database uses transactions you need to thread req through to all local operations. Postgres uses transactions and MongoDB uses transactions when you are using replica sets. Passing req without transactions is still recommended.

```js
const post = await payload.find({
  collection: 'posts',
  req, // passing req is recommended
})
```

<Banner type="warning">
  **Note:**

By default, all access control checks are disabled in the Local API, but you can re-enable them if
you'd like, as well as pass a specific user to run the operation with.

</Banner>

## Collections

The following Collection operations are available through the Local API:

### Create#collection-create

```js
// The created Post document is returned
const post = await payload.create({
  collection: 'posts', // required
  data: {
    // required
    title: 'sure',
    description: 'maybe',
  },
  locale: 'en',
  fallbackLocale: false,
  user: dummyUserDoc,
  overrideAccess: true,
  showHiddenFields: false,

  // If creating verification-enabled auth doc,
  // you can optionally disable the email that is auto-sent
  disableVerificationEmail: true,

  // If your collection supports uploads, you can upload
  // a file directly through the Local API by providing
  // its full, absolute file path.
  filePath: path.resolve(__dirname, './path-to-image.jpg'),

  // Alternatively, you can directly pass a File,
  // if file is provided, filePath will be omitted
  file: uploadedFile,

  // If you want to create a document that is a duplicate of another document
  duplicateFromID: 'document-id-to-duplicate',
})
```

### Find#collection-find

```js
// Result will be a paginated set of Posts.
// See /docs/queries/pagination for more.
const result = await payload.find({
  collection: 'posts', // required
  depth: 2,
  page: 1,
  limit: 10,
  pagination: false, // If you want to disable pagination count, etc.
  where: {}, // pass a `where` query here
  sort: '-title',
  locale: 'en',
  fallbackLocale: false,
  user: dummyUser,
  overrideAccess: false,
  showHiddenFields: true,
})
```

<Banner type="info">
  `pagination`, `page`, and `limit` are three related properties [documented
  here](/docs/queries/pagination).
</Banner>

### Find by ID#collection-find-by-id

```js
// Result will be a Post document.
const result = await payload.findByID({
  collection: 'posts', // required
  id: '507f1f77bcf86cd799439011', // required
  depth: 2,
  locale: 'en',
  fallbackLocale: false,
  user: dummyUser,
  overrideAccess: false,
  showHiddenFields: true,
})
```

### Count#collection-count

```js
// Result will be an object with:
// {
//   totalDocs: 10, // count of the documents satisfies query
// }
const result = await payload.count({
  collection: 'posts', // required
  locale: 'en',
  where: {}, // pass a `where` query here
  user: dummyUser,
  overrideAccess: false,
})
```

### FindDistinct#collection-find-distinct

```js
// Result will be an object with:
// {
//   values: ['value-1', 'value-2'], // array of distinct values,
//   field: 'title', // the field
//   totalDocs: 10, // count of the distinct values satisfies query,
//   perPage: 10, // count of distinct values per page (based on provided limit)
// }
const result = await payload.findDistinct({
  collection: 'posts', // required
  locale: 'en',
  where: {}, // pass a `where` query here
  user: dummyUser,
  overrideAccess: false,
  field: 'title',
  sort: 'title',
})
```

### Update by ID#collection-update-by-id

```js
// Result will be the updated Post document.
const result = await payload.update({
  collection: 'posts', // required
  id: '507f1f77bcf86cd799439011', // required
  data: {
    // required
    title: 'sure',
    description: 'maybe',
  },
  depth: 2,
  locale: 'en',
  fallbackLocale: false,
  user: dummyUser,
  overrideAccess: false,
  overrideLock: false, // By default, document locks are ignored. Set to false to enforce locks.
  showHiddenFields: true,

  // If your collection supports uploads, you can upload
  // a file directly through the Local API by providing
  // its full, absolute file path.
  filePath: path.resolve(__dirname, './path-to-image.jpg'),

  // If you are uploading a file and would like to replace
  // the existing file instead of generating a new filename,
  // you can set the following property to `true`
  overwriteExistingFiles: true,
})
```

### Update Many#collection-update-many

```js
// Result will be an object with:
// {
//   docs: [], // each document that was updated
//   errors: [], // each error also includes the id of the document
// }
const result = await payload.update({
  collection: 'posts', // required
  where: {
    // required
    fieldName: { equals: 'value' },
  },
  data: {
    // required
    title: 'sure',
    description: 'maybe',
  },
  depth: 0,
  locale: 'en',
  fallbackLocale: false,
  user: dummyUser,
  overrideAccess: false,
  overrideLock: false, // By default, document locks are ignored. Set to false to enforce locks.
  showHiddenFields: true,

  // If your collection supports uploads, you can upload
  // a file directly through the Local API by providing
  // its full, absolute file path.
  filePath: path.resolve(__dirname, './path-to-image.jpg'),

  // If you are uploading a file and would like to replace
  // the existing file instead of generating a new filename,
  // you can set the following property to `true`
  overwriteExistingFiles: true,
})
```

### Delete#collection-delete

```js
// Result will be the now-deleted Post document.
const result = await payload.delete({
  collection: 'posts', // required
  id: '507f1f77bcf86cd799439011', // required
  depth: 2,
  locale: 'en',
  fallbackLocale: false,
  user: dummyUser,
  overrideAccess: false,
  overrideLock: false, // By default, document locks are ignored. Set to false to enforce locks.
  showHiddenFields: true,
})
```

### Delete Many#collection-delete-many

```js
// Result will be an object with:
// {
//   docs: [], // each document that is now deleted
//   errors: [], // any errors that occurred, including the id of the errored on document
// }
const result = await payload.delete({
  collection: 'posts', // required
  where: {
    // required
    fieldName: { equals: 'value' },
  },
  depth: 0,
  locale: 'en',
  fallbackLocale: false,
  user: dummyUser,
  overrideAccess: false,
  overrideLock: false, // By default, document locks are ignored. Set to false to enforce locks.
  showHiddenFields: true,
})
```

## Auth Operations

If a collection has [`Authentication`](/docs/authentication/overview) enabled, additional Local API operations will be
available:

### Auth

```js
// If you're using Next.js, you'll have to import headers from next/headers, like so:
// import { headers as nextHeaders } from 'next/headers'

// you'll also have to await headers inside your function, or component, like so:
// const headers = await nextHeaders()

// If you're using Payload outside of Next.js, you'll have to provide headers accordingly.

// result will be formatted as follows:
// {
//    permissions: { ... }, // object containing current user's permissions
//    user: { ... }, // currently logged in user's document
//    responseHeaders: { ... } // returned headers from the response
// }

const result = await payload.auth({ headers, canSetHeaders: false })
```

### Login

```js
// result will be formatted as follows:
// {
//   token: 'o38jf0q34jfij43f3f...', // JWT used for auth
//   user: { ... } // the user document that just logged in
//   exp: 1609619861 // the UNIX timestamp when the JWT will expire
// }

const result = await payload.login({
  collection: 'users', // required
  data: {
    // required
    email: 'dev@payloadcms.com',
    password: 'rip',
  },
  req: req, // optional, pass a Request object to be provided to all hooks
  depth: 2,
  locale: 'en',
  fallbackLocale: false,
  overrideAccess: false,
  showHiddenFields: true,
})
```

### Forgot Password

```js
// Returned token will allow for a password reset
const token = await payload.forgotPassword({
  collection: 'users', // required
  data: {
    // required
    email: 'dev@payloadcms.com',
  },
  req: req, // pass a Request object to be provided to all hooks
})
```

### Reset Password

```js
// Result will be formatted as follows:
// {
//   token: 'o38jf0q34jfij43f3f...', // JWT used for auth
//   user: { ... } // the user document that just logged in
// }
const result = await payload.resetPassword({
  collection: 'users', // required
  data: {
    // required
    password: req.body.password, // the new password to set
    token: 'afh3o2jf2p3f...', // the token generated from the forgotPassword operation
  },
  req: req, // optional, pass a Request object to be provided to all hooks
})
```

### Unlock

```js
// Returned result will be a boolean representing success or failure
const result = await payload.unlock({
  collection: 'users', // required
  data: {
    // required
    email: 'dev@payloadcms.com',
  },
  req: req, // optional, pass a Request object to be provided to all hooks
  overrideAccess: true,
})
```

### Verify

```js
// Returned result will be a boolean representing success or failure
const result = await payload.verifyEmail({
  collection: 'users', // required
  token: 'afh3o2jf2p3f...', // the token saved on the user as `_verificationToken`
})
```

## Globals

The following Global operations are available through the Local API:

### Find#global-find

```js
// Result will be the Header Global.
const result = await payload.findGlobal({
  slug: 'header', // required
  depth: 2,
  locale: 'en',
  fallbackLocale: false,
  user: dummyUser,
  overrideAccess: false,
  showHiddenFields: true,
})
```

### Update#global-update

```js
// Result will be the updated Header Global.
const result = await payload.updateGlobal({
  slug: 'header', // required
  data: {
    // required
    nav: [
      {
        url: 'https://google.com',
      },
      {
        url: 'https://payloadcms.com',
      },
    ],
  },
  depth: 2,
  locale: 'en',
  fallbackLocale: false,
  user: dummyUser,
  overrideAccess: false,
  overrideLock: false, // By default, document locks are ignored. Set to false to enforce locks.
  showHiddenFields: true,
})
```

## TypeScript

Local API calls will automatically infer your [generated types](/docs/typescript/generating-types).

Here is an example of usage:

```ts
// Properly inferred as `Post` type
const post = await payload.create({
  collection: 'posts',

  // Data will now be typed as Post and give you type hints
  data: {
    title: 'my title',
    description: 'my description',
  },
})
```
```

--------------------------------------------------------------------------------

````
