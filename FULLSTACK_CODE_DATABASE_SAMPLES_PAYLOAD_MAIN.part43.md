---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 43
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 43 of 695)

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

---[FILE: collections.mdx]---
Location: payload-main/docs/hooks/collections.mdx

```text
---
title: Collection Hooks
label: Collections
order: 20
desc: You can add hooks to any Collection, several hook types are available including beforeChange, afterRead, afterDelete and more.
keywords: hooks, collections, config, configuration, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

Collection Hooks are [Hooks](./overview) that run on Documents within a specific [Collection](../configuration/collections). They allow you to execute your own logic during specific events of the Document lifecycle.

To add Hooks to a Collection, use the `hooks` property in your [Collection Config](../configuration/collections):

```ts
import type { CollectionConfig } from 'payload'

export const CollectionWithHooks: CollectionConfig = {
  // ...
  hooks: {
    // highlight-line
    // ...
  },
}
```

<Banner type="info">
  **Tip:** You can also set hooks on the field-level to isolate hook logic to
  specific fields. [More details](./fields).
</Banner>

## Config Options

All Collection Hooks accept an array of [synchronous or asynchronous functions](./overview#async-vs-synchronous). Each Collection Hook receives specific arguments based on its own type, and has the ability to modify specific outputs.

```ts
import type { CollectionConfig } from 'payload';

export const CollectionWithHooks: CollectionConfig = {
  // ...
  // highlight-start
  hooks: {
    beforeOperation: [(args) => {...}],
    beforeValidate: [(args) => {...}],
    beforeDelete: [(args) => {...}],
    beforeChange: [(args) => {...}],
    beforeRead: [(args) => {...}],
    afterChange: [(args) => {...}],
    afterRead: [(args) => {...}],
    afterDelete: [(args) => {...}],
    afterOperation: [(args) => {...}],
    afterError: [(args) => {....}],

    // Auth-enabled Hooks
    beforeLogin: [(args) => {...}],
    afterLogin: [(args) => {...}],
    afterLogout: [(args) => {...}],
    afterRefresh: [(args) => {...}],
    afterMe: [(args) => {...}],
    afterForgotPassword: [(args) => {...}],
    refresh: [(args) => {...}],
    me: [(args) => {...}],
  },
  // highlight-end
}
```

### beforeOperation

The `beforeOperation` hook can be used to modify the arguments that operations accept or execute side-effects that run before an operation begins.

```ts
import type { CollectionBeforeOperationHook } from 'payload'

const beforeOperationHook: CollectionBeforeOperationHook = async ({
  args,
  operation,
  req,
}) => {
  return args // return modified operation arguments as necessary
}
```

The following arguments are provided to the `beforeOperation` hook:

| Option           | Description                                                                                                                                                                                                                                                                               |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`collection`** | The [Collection](../configuration/collections) in which this Hook is running against. Available options include: `autosave`, `count`, `countVersions`, `create`, `delete`, `forgotPassword`, `login`, `read`, `readDistinct`, `refresh`, `resetPassword`, `restoreVersion`, and `update`. |
| **`context`**    | Custom context passed between Hooks. [More details](./context).                                                                                                                                                                                                                           |
| **`operation`**  | The name of the operation that this hook is running within.                                                                                                                                                                                                                               |
| **`req`**        | The [Web Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object. This is mocked for [Local API](../local-api/overview) operations.                                                                                                                                     |

### beforeValidate

Runs during the `create` and `update` operations. This hook allows you to add or format data before the incoming data is validated server-side.

Please do note that this does not run before client-side validation. If you render a custom field component in your front-end and provide it with a `validate` function, the order that validations will run in is:

1. `validate` runs on the client
2. if successful, `beforeValidate` runs on the server
3. `validate` runs on the server

```ts
import type { CollectionBeforeValidateHook } from 'payload'
import type { Post } from '@/payload-types'

const beforeValidateHook: CollectionBeforeValidateHook<Post> = async ({
  data, // Typed as Partial<Post>
}) => {
  return data
}
```

The following arguments are provided to the `beforeValidate` hook:

| Option            | Description                                                                                                                                           |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`collection`**  | The [Collection](../configuration/collections) in which this Hook is running against.                                                                 |
| **`context`**     | Custom context passed between Hooks. [More details](./context).                                                                                       |
| **`data`**        | The incoming data passed through the operation.                                                                                                       |
| **`operation`**   | The name of the operation that this hook is running within.                                                                                           |
| **`originalDoc`** | The Document before changes are applied.                                                                                                              |
| **`req`**         | The [Web Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object. This is mocked for [Local API](../local-api/overview) operations. |

### beforeChange

Immediately before validation, beforeChange hooks will run during create and update operations. At this stage, the data should be treated as unvalidated user input. There is no guarantee that required fields exist or that fields are in the correct format. As such, using this data for side effects requires manual validation. You can optionally modify the shape of the data to be saved.

```ts
import type { CollectionBeforeChangeHook } from 'payload'
import type { Post } from '@/payload-types'

const beforeChangeHook: CollectionBeforeChangeHook<Post> = async ({
  data, // Typed as Partial<Post>
}) => {
  return data
}
```

The following arguments are provided to the `beforeChange` hook:

| Option            | Description                                                                                                                                           |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`collection`**  | The [Collection](../configuration/collections) in which this Hook is running against.                                                                 |
| **`context`**     | Custom context passed between hooks. [More details](./context).                                                                                       |
| **`data`**        | The incoming data passed through the operation.                                                                                                       |
| **`operation`**   | The name of the operation that this hook is running within.                                                                                           |
| **`originalDoc`** | The Document before changes are applied.                                                                                                              |
| **`req`**         | The [Web Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object. This is mocked for [Local API](../local-api/overview) operations. |

### afterChange

After a document is created or updated, the `afterChange` hook runs. This hook is helpful to recalculate statistics such as total sales within a global, syncing user profile changes to a CRM, and more.

```ts
import type { CollectionAfterChangeHook } from 'payload'
import type { Post } from '@/payload-types'

const afterChangeHook: CollectionAfterChangeHook<Post> = async ({
  doc, // Typed as Post
  previousDoc, // Typed as Post
}) => {
  return doc
}
```

The following arguments are provided to the `afterChange` hook:

| Option            | Description                                                                                                                                           |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`collection`**  | The [Collection](../configuration/collections) in which this Hook is running against.                                                                 |
| **`context`**     | Custom context passed between hooks. [More details](./context).                                                                                       |
| **`data`**        | The incoming data passed through the operation.                                                                                                       |
| **`doc`**         | The resulting Document after changes are applied.                                                                                                     |
| **`operation`**   | The name of the operation that this hook is running within.                                                                                           |
| **`previousDoc`** | The Document before changes were applied.                                                                                                             |
| **`req`**         | The [Web Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object. This is mocked for [Local API](../local-api/overview) operations. |

### beforeRead

Runs before `find` and `findByID` operations are transformed for output by `afterRead`. This hook fires before hidden fields are removed and before localized fields are flattened into the requested locale. Using this Hook will provide you with all locales and all hidden fields via the `doc` argument.

```ts
import type { CollectionBeforeReadHook } from 'payload'
import type { Post } from '@/payload-types'

const beforeReadHook: CollectionBeforeReadHook<Post> = async ({
  doc, // Typed as Post
}) => {
  return doc
}
```

The following arguments are provided to the `beforeRead` hook:

| Option           | Description                                                                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`collection`** | The [Collection](../configuration/collections) in which this Hook is running against.                                                                 |
| **`context`**    | Custom context passed between hooks. [More details](./context).                                                                                       |
| **`doc`**        | The resulting Document after changes are applied.                                                                                                     |
| **`query`**      | The [Query](../queries/overview) of the request.                                                                                                      |
| **`req`**        | The [Web Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object. This is mocked for [Local API](../local-api/overview) operations. |

### afterRead

Runs as the last step before documents are returned. Flattens locales, hides protected fields, and removes fields that users do not have access to.

```ts
import type { CollectionAfterReadHook } from 'payload'
import type { Post } from '@/payload-types'

const afterReadHook: CollectionAfterReadHook<Post> = async ({
  doc, // Typed as Post
}) => {
  return doc
}
```

The following arguments are provided to the `afterRead` hook:

| Option           | Description                                                                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`collection`** | The [Collection](../configuration/collections) in which this Hook is running against.                                                                 |
| **`context`**    | Custom context passed between hooks. [More details](./context).                                                                                       |
| **`doc`**        | The resulting Document after changes are applied.                                                                                                     |
| **`query`**      | The [Query](../queries/overview) of the request.                                                                                                      |
| **`req`**        | The [Web Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object. This is mocked for [Local API](../local-api/overview) operations. |

### beforeDelete

Runs before the `delete` operation. Returned values are discarded.

```ts
import type { CollectionBeforeDeleteHook } from 'payload';

const beforeDeleteHook: CollectionBeforeDeleteHook = async ({
  req,
  id,
}) => {...}
```

The following arguments are provided to the `beforeDelete` hook:

| Option           | Description                                                                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`collection`** | The [Collection](../configuration/collections) in which this Hook is running against.                                                                 |
| **`context`**    | Custom context passed between hooks. [More details](./context).                                                                                       |
| **`id`**         | The ID of the Document being deleted.                                                                                                                 |
| **`req`**        | The [Web Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object. This is mocked for [Local API](../local-api/overview) operations. |

### afterDelete

Runs immediately after the `delete` operation removes records from the database. Returned values are discarded.

```ts
import type { CollectionAfterDeleteHook } from 'payload';

const afterDeleteHook: CollectionAfterDeleteHook = async ({
  req,
  id,
  doc,
}) => {...}
```

The following arguments are provided to the `afterDelete` hook:

| Option           | Description                                                                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`collection`** | The [Collection](../configuration/collections) in which this Hook is running against.                                                                 |
| **`context`**    | Custom context passed between hooks. [More details](./context).                                                                                       |
| **`doc`**        | The resulting Document after changes are applied.                                                                                                     |
| **`id`**         | The ID of the Document that was deleted.                                                                                                              |
| **`req`**        | The [Web Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object. This is mocked for [Local API](../local-api/overview) operations. |

### afterOperation

The `afterOperation` hook can be used to modify the result of operations or execute side-effects that run after an operation has completed.

Available Collection operations include `create`, `find`, `findByID`, `update`, `updateByID`, `delete`, `deleteByID`, `login`, `refresh`, and `forgotPassword`.

```ts
import type { CollectionAfterOperationHook } from 'payload'

const afterOperationHook: CollectionAfterOperationHook = async ({ result }) => {
  return result
}
```

The following arguments are provided to the `afterOperation` hook:

| Option           | Description                                                                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`args`**       | The arguments passed into the operation.                                                                                                              |
| **`collection`** | The [Collection](../configuration/collections) in which this Hook is running against.                                                                 |
| **`req`**        | The [Web Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object. This is mocked for [Local API](../local-api/overview) operations. |
| **`operation`**  | The name of the operation that this hook is running within.                                                                                           |
| **`result`**     | The result of the operation, before modifications.                                                                                                    |

### afterError

The `afterError` Hook is triggered when an error occurs in the Payload application. This can be useful for logging errors to a third-party service, sending an email to the development team, logging the error to Sentry or DataDog, etc. The output can be used to transform the result object / status code.

```ts
import type { CollectionAfterErrorHook } from 'payload';

const afterErrorHook: CollectionAfterErrorHook = async ({
  req,
  id,
  doc,
}) => {...}
```

The following arguments are provided to the `afterError` Hook:

| Argument            | Description                                                                                                                                                                                     |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`error`**         | The error that occurred.                                                                                                                                                                        |
| **`context`**       | Custom context passed between Hooks. [More details](./context).                                                                                                                                 |
| **`graphqlResult`** | The GraphQL result object, available if the hook is executed within a GraphQL context.                                                                                                          |
| **`req`**           | The `PayloadRequest` object that extends [Web Request](https://developer.mozilla.org/en-US/docs/Web/API/Request). Contains currently authenticated `user` and the Local API instance `payload`. |
| **`collection`**    | The [Collection](../configuration/collections) in which this Hook is running against.                                                                                                           |
| **`result`**        | The formatted error result object, available if the hook is executed from a REST context.                                                                                                       |

### beforeLogin

For [Auth-enabled Collections](../authentication/overview), this hook runs during `login` operations where a user with the provided credentials exist, but before a token is generated and added to the response. You can optionally modify the user that is returned, or throw an error in order to deny the login operation.

```ts
import type { CollectionBeforeLoginHook } from 'payload'

const beforeLoginHook: CollectionBeforeLoginHook = async ({ user }) => {
  return user
}
```

The following arguments are provided to the `beforeLogin` hook:

| Option           | Description                                                                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`collection`** | The [Collection](../configuration/collections) in which this Hook is running against.                                                                 |
| **`context`**    | Custom context passed between hooks. [More details](./context).                                                                                       |
| **`req`**        | The [Web Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object. This is mocked for [Local API](../local-api/overview) operations. |
| **`user`**       | The user being logged in.                                                                                                                             |

### afterLogin

For [Auth-enabled Collections](../authentication/overview), this hook runs after successful `login` operations. You can optionally modify the user that is returned.

```ts
import type { CollectionAfterLoginHook } from 'payload';

const afterLoginHook: CollectionAfterLoginHook = async ({
  user,
  token,
}) => {...}
```

The following arguments are provided to the `afterLogin` hook:

| Option           | Description                                                                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`collection`** | The [Collection](../configuration/collections) in which this Hook is running against.                                                                 |
| **`context`**    | Custom context passed between hooks. [More details](./context).                                                                                       |
| **`req`**        | The [Web Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object. This is mocked for [Local API](../local-api/overview) operations. |
| **`token`**      | The token generated for the user.                                                                                                                     |
| **`user`**       | The user being logged in.                                                                                                                             |

### afterLogout

For [Auth-enabled Collections](../authentication/overview), this hook runs after `logout` operations.

```ts
import type { CollectionAfterLogoutHook } from 'payload';

const afterLogoutHook: CollectionAfterLogoutHook = async ({
  req,
}) => {...}
```

The following arguments are provided to the `afterLogout` hook:

| Option           | Description                                                                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`collection`** | The [Collection](../configuration/collections) in which this Hook is running against.                                                                 |
| **`context`**    | Custom context passed between hooks. [More details](./context).                                                                                       |
| **`req`**        | The [Web Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object. This is mocked for [Local API](../local-api/overview) operations. |

### afterMe

For [Auth-enabled Collections](../authentication/overview), this hook runs after `me` operations.

```ts
import type { CollectionAfterMeHook } from 'payload';

const afterMeHook: CollectionAfterMeHook = async ({
  req,
  response,
}) => {...}
```

The following arguments are provided to the `afterMe` hook:

| Option           | Description                                                                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`collection`** | The [Collection](../configuration/collections) in which this Hook is running against.                                                                 |
| **`context`**    | Custom context passed between hooks. [More details](./context).                                                                                       |
| **`req`**        | The [Web Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object. This is mocked for [Local API](../local-api/overview) operations. |
| **`response`**   | The response to return.                                                                                                                               |

### afterRefresh

For [Auth-enabled Collections](../authentication/overview), this hook runs after `refresh` operations.

```ts
import type { CollectionAfterRefreshHook } from 'payload';

const afterRefreshHook: CollectionAfterRefreshHook = async ({
  token,
}) => {...}
```

The following arguments are provided to the `afterRefresh` hook:

| Option           | Description                                                                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`collection`** | The [Collection](../configuration/collections) in which this Hook is running against.                                                                 |
| **`context`**    | Custom context passed between hooks. [More details](./context).                                                                                       |
| **`exp`**        | The expiration time of the token.                                                                                                                     |
| **`req`**        | The [Web Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object. This is mocked for [Local API](../local-api/overview) operations. |
| **`token`**      | The newly refreshed user token.                                                                                                                       |

### afterForgotPassword

For [Auth-enabled Collections](../authentication/overview), this hook runs after successful `forgotPassword` operations. Returned values are discarded.

```ts
import type { CollectionAfterForgotPasswordHook } from 'payload'

const afterForgotPasswordHook: CollectionAfterForgotPasswordHook = async ({
  args,
  context,
  collection,
}) => {...}
```

The following arguments are provided to the `afterForgotPassword` hook:

| Option           | Description                                                                           |
| ---------------- | ------------------------------------------------------------------------------------- |
| **`args`**       | The arguments passed into the operation.                                              |
| **`collection`** | The [Collection](../configuration/collections) in which this Hook is running against. |
| **`context`**    | Custom context passed between hooks. [More details](./context).                       |

### refresh

For [Auth-enabled Collections](../authentication/overview), this hook allows you to optionally replace the default behavior of the `refresh` operation with your own. If you optionally return a value from your hook, the operation will not perform its own logic and continue.

```ts
import type { CollectionRefreshHook } from 'payload'

const myRefreshHook: CollectionRefreshHook = async ({
  args,
  user,
}) => {...}
```

The following arguments are provided to the `afterRefresh` hook:

| Option     | Description                              |
| ---------- | ---------------------------------------- |
| **`args`** | The arguments passed into the operation. |
| **`user`** | The user being logged in.                |

### me

For [Auth-enabled Collections](../authentication/overview), this hook allows you to optionally replace the default behavior of the `me` operation with your own. If you optionally return a value from your hook, the operation will not perform its own logic and continue.

```ts
import type { CollectionMeHook } from 'payload'

const meHook: CollectionMeHook = async ({
  args,
  user,
}) => {...}
```

The following arguments are provided to the `me` hook:

| Option     | Description                              |
| ---------- | ---------------------------------------- |
| **`args`** | The arguments passed into the operation. |
| **`user`** | The user being logged in.                |

## TypeScript

Payload exports a type for each Collection hook which can be accessed as follows:

```ts
import type {
  CollectionBeforeOperationHook,
  CollectionBeforeValidateHook,
  CollectionBeforeChangeHook,
  CollectionAfterChangeHook,
  CollectionAfterReadHook,
  CollectionBeforeReadHook,
  CollectionBeforeDeleteHook,
  CollectionAfterDeleteHook,
  CollectionBeforeLoginHook,
  CollectionAfterLoginHook,
  CollectionAfterLogoutHook,
  CollectionAfterRefreshHook,
  CollectionAfterMeHook,
  CollectionAfterForgotPasswordHook,
  CollectionRefreshHook,
  CollectionMeHook,
} from 'payload'
```

You can also pass a generic type to each hook for strongly-typed `doc`, `previousDoc`, and `data` properties:

```ts
import type { CollectionAfterChangeHook } from 'payload'
import type { Post } from '@/payload-types'

const afterChangeHook: CollectionAfterChangeHook<Post> = async ({
  doc, // Typed as Post
  previousDoc, // Typed as Post
}) => {
  return doc
}
```
```

--------------------------------------------------------------------------------

---[FILE: context.mdx]---
Location: payload-main/docs/hooks/context.mdx

```text
---
title: Context
label: Context
order: 50
desc: Context allows you to pass in extra data that can be shared between hooks
keywords: hooks, context, payload context, payloadcontext, data, extra data, shared data, shared, extra
---

The `context` object is used to share data across different Hooks. This persists throughout the entire lifecycle of a request and is available within every Hook. By setting properties to `req.context`, you can effectively share logic across multiple Hooks.

## When To Use Context

Context gives you a way forward on otherwise difficult problems such as:

1. **Passing data between Hooks**: Needing data in multiple Hooks from a 3rd party API, it could be retrieved and used in `beforeChange` and later used again in an `afterChange` hook without having to fetch it twice.
2. **Preventing infinite loops**: Calling `payload.update()` on the same document that triggered an `afterChange` hook will create an infinite loop, control the flow by assigning a no-op condition to context
3. **Passing data to Local API**: Setting values on the `req.context` and pass it to `payload.create()` you can provide additional data to hooks without adding extraneous fields.
4. **Passing data between hooks and middleware or custom endpoints**: Hooks could set context across multiple collections and then be used in a final `postMiddleware`.

## How To Use Context

Let's see examples on how context can be used in the first two scenarios mentioned above:

### Passing Data Between Hooks

To pass data between hooks, you can assign values to context in an earlier hook in the lifecycle of a request and expect it in the context of a later hook.

For example:

```ts
import type { CollectionConfig } from 'payload'

const Customer: CollectionConfig = {
  slug: 'customers',
  hooks: {
    beforeChange: [
      async ({ context, data }) => {
        // assign the customerData to context for use later
        context.customerData = await fetchCustomerData(data.customerID)
        return {
          ...data,
          // some data we use here
          name: context.customerData.name,
        }
      },
    ],
    afterChange: [
      async ({ context, doc, req }) => {
        // use context.customerData without needing to fetch it again
        if (context.customerData.contacted === false) {
          createTodo('Call Customer', context.customerData)
        }
      },
    ],
  },
  fields: [
    /* ... */
  ],
}
```

### Preventing Infinite Loops

Let's say you have an `afterChange` hook, and you want to do a calculation inside the hook (as the document ID needed for the calculation is available in the `afterChange` hook, but not in the `beforeChange` hook). Once that's done, you want to update the document with the result of the calculation.

Bad example:

```ts
import type { CollectionConfig } from 'payload'

const Customer: CollectionConfig = {
  slug: 'customers',
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        await req.payload.update({
          // DANGER: updating the same slug as the collection in an afterChange will create an infinite loop!
          collection: 'customers',
          id: doc.id,
          data: {
            ...(await fetchCustomerData(data.customerID)),
          },
        })
      },
    ],
  },
  fields: [
    /* ... */
  ],
}
```

Instead of the above, we need to tell the `afterChange` hook to not run again if it performs the update (and thus not update itself again). We can solve that with context.

Fixed example:

```ts
import type { CollectionConfig } from 'payload'

const MyCollection: CollectionConfig = {
  slug: 'slug',
  hooks: {
    afterChange: [
      async ({ context, doc, req }) => {
        // return if flag was previously set
        if (context.triggerAfterChange === false) {
          return
        }
        await req.payload.update({
          collection: contextHooksSlug,
          id: doc.id,
          data: {
            ...(await fetchCustomerData(data.customerID)),
          },
          context: {
            // set a flag to prevent from running again
            triggerAfterChange: false,
          },
        })
      },
    ],
  },
  fields: [
    /* ... */
  ],
}
```

## TypeScript

The default TypeScript interface for `context` is `{ [key: string]: unknown }`. If you prefer a more strict typing in your project or when authoring plugins for others, you can override this using the `declare module` syntax.

This is known as [module augmentation / declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation), a TypeScript feature which allows us to add properties to existing types. Simply put this in any `.ts` or `.d.ts` file:

```ts
declare module 'payload' {
  // Augment the RequestContext interface to include your custom properties
  export interface RequestContext {
    myObject?: string
    // ...
  }
}
```

This will add the property `myObject` with a type of string to every context object. Make sure to follow this example correctly, as module augmentation can mess up your types if you do it wrong.
```

--------------------------------------------------------------------------------

````
