---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 44
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 44 of 695)

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

---[FILE: fields.mdx]---
Location: payload-main/docs/hooks/fields.mdx

```text
---
title: Field Hooks
label: Fields
order: 40
desc: Hooks can be added to any fields, and optionally modify the return value of the field before the operation continues.
keywords: hooks, fields, config, configuration, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

Field Hooks are [Hooks](./overview) that run on Documents on a per-field basis. They allow you to execute your own logic during specific events of the Document lifecycle. Field Hooks offer incredible potential for isolating your logic from the rest of your [Collection Hooks](./collections) and [Global Hooks](./globals).

To add Hooks to a Field, use the `hooks` property in your [Field Config](../fields/overview):

```ts
import type { Field } from 'payload'

export const FieldWithHooks: Field = {
  // ...
  hooks: {
    // highlight-line
    // ...
  },
}
```

## Config Options

All Field Hooks accept an array of synchronous or asynchronous functions. These functions can optionally modify the return value of the field before the operation continues. All Field Hooks are formatted to accept the same arguments, although some arguments may be `undefined` based on the specific hook type.

<Banner type="warning">
  **Important:** Due to GraphQL's typed nature, changing the type of data that
  you return from a field will produce errors in the [GraphQL
  API](../graphql/overview). If you need to change the shape or type of data,
  consider [Collection Hooks](./collections) or [Global Hooks](./globals)
  instead.
</Banner>

To add hooks to a Field, use the `hooks` property in your [Field Config](../fields/overview):

```ts
import type { Field } from 'payload';

const FieldWithHooks: Field = {
  name: 'name',
  type: 'text',
  // highlight-start
  hooks: {
    beforeValidate: [(args) => {...}],
    beforeChange: [(args) => {...}],
    beforeDuplicate: [(args) => {...}],
    afterChange: [(args) => {...}],
    afterRead: [(args) => {...}],
  }
  // highlight-end
}
```

The following arguments are provided to all Field Hooks:

| Option                      | Description                                                                                                                                                                                    |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`collection`**            | The [Collection](../configuration/collections) in which this Hook is running against. If the field belongs to a Global, this will be `null`.                                                   |
| **`context`**               | Custom context passed between Hooks. [More details](./context).                                                                                                                                |
| **`data`**                  | In the `afterRead` hook this is the full Document. In the `create` and `update` operations, this is the incoming data passed through the operation.                                            |
| **`field`**                 | The [Field](../fields/overview) which the Hook is running against.                                                                                                                             |
| **`findMany`**              | Boolean to denote if this hook is running against finding one, or finding many within the `afterRead` hook.                                                                                    |
| **`global`**                | The [Global](../configuration/globals) in which this Hook is running against. If the field belongs to a Collection, this will be `null`.                                                       |
| **`operation`**             | The name of the operation that this hook is running within. Useful within `beforeValidate`, `beforeChange`, and `afterChange` hooks to differentiate between `create` and `update` operations. |
| **`originalDoc`**           | In the `update` operation, this is the Document before changes were applied. In the `afterChange` hook, this is the resulting Document.                                                        |
| **`overrideAccess`**        | A boolean to denote if the current operation is overriding [Access Control](../access-control/overview).                                                                                       |
| **`path`**                  | The path to the [Field](../fields/overview) in the schema.                                                                                                                                     |
| **`previousDoc`**           | In the `afterChange` Hook, this is the Document before changes were applied.                                                                                                                   |
| **`previousSiblingDoc`**    | The sibling data of the Document before changes being applied, only in `beforeChange` and `afterChange` hook.                                                                                  |
| **`previousValue`**         | The previous value of the field, before changes, only in `beforeChange` and `afterChange` hooks.                                                                                               |
| **`req`**                   | The [Web Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object. This is mocked for [Local API](../local-api/overview) operations.                                          |
| **`schemaPath`**            | The path of the [Field](../fields/overview) in the schema.                                                                                                                                     |
| **`siblingData`**           | The data of sibling fields adjacent to the field that the Hook is running against.                                                                                                             |
| **`siblingDocWithLocales`** | The sibling data of the Document with all [Locales](../configuration/localization).                                                                                                            |
| **`siblingFields`**         | The sibling fields of the field which the hook is running against.                                                                                                                             |
| **`value`**                 | The value of the [Field](../fields/overview).                                                                                                                                                  |

<Banner type="success">
  **Tip:** It's a good idea to conditionally scope your logic based on which
  operation is executing. For example, if you are writing a `beforeChange` hook,
  you may want to perform different logic based on if the current `operation` is
  `create` or `update`.
</Banner>

### beforeValidate

Runs during the `create` and `update` operations. This hook allows you to add or format data before the incoming data is validated server-side.

Please do note that this does not run before client-side validation. If you render a custom field component in your front-end and provide it with a `validate` function, the order that validations will run in is:

1. `validate` runs on the client
2. if successful, `beforeValidate` runs on the server
3. `validate` runs on the server

```ts
import type { Field } from 'payload'

const usernameField: Field = {
  name: 'username',
  type: 'text',
  hooks: {
    beforeValidate: [
      ({ value }) => {
        // Trim whitespace and convert to lowercase
        return value.trim().toLowerCase()
      },
    ],
  },
}
```

In this example, the `beforeValidate` hook is used to process the `username` field. The hook takes the incoming value of
the field and transforms it by trimming whitespace and converting it to lowercase. This ensures that the username is
stored in a consistent format in the database.

### beforeChange

Immediately following validation, `beforeChange` hooks will run within `create` and `update` operations. At this stage,
you can be confident that the field data that will be saved to the document is valid in accordance to your field
validations.

```ts
import type { Field } from 'payload'

const emailField: Field = {
  name: 'email',
  type: 'email',
  hooks: {
    beforeChange: [
      ({ value, operation }) => {
        if (operation === 'create') {
          // Perform additional validation or transformation for 'create' operation
        }
        return value
      },
    ],
  },
}
```

In the `emailField`, the `beforeChange` hook checks the `operation` type. If the operation is `create`, it performs
additional validation or transformation on the email field value. This allows for operation-specific logic to be applied
to the field.

### afterChange

The `afterChange` hook is executed after a field's value has been changed and saved in the database. This hook is useful
for post-processing or triggering side effects based on the new value of the field.

```ts
import type { Field } from 'payload'

const membershipStatusField: Field = {
  name: 'membershipStatus',
  type: 'select',
  options: [
    { label: 'Standard', value: 'standard' },
    { label: 'Premium', value: 'premium' },
    { label: 'VIP', value: 'vip' },
  ],
  hooks: {
    afterChange: [
      ({ value, previousValue, req }) => {
        if (value !== previousValue) {
          // Log or perform an action when the membership status changes
          console.log(
            `User ID ${req.user.id} changed their membership status from ${previousValue} to ${value}.`,
          )
          // Here, you can implement actions that could track conversions from one tier to another
        }
      },
    ],
  },
}
```

In this example, the `afterChange` hook is used with a `membershipStatusField`, which allows users to select their
membership level (Standard, Premium, VIP). The hook monitors changes in the membership status. When a change occurs, it
logs the update and can be used to trigger further actions, such as tracking conversion from one tier to another or
notifying them about changes in their membership benefits.

### afterRead

The `afterRead` hook is invoked after a field value is read from the database. This is ideal for formatting or
transforming the field data for output.

```ts
import type { Field } from 'payload'

const dateField: Field = {
  name: 'createdAt',
  type: 'date',
  hooks: {
    afterRead: [
      ({ value }) => {
        // Format date for display
        return new Date(value).toLocaleDateString()
      },
    ],
  },
}
```

Here, the `afterRead` hook for the `dateField` is used to format the date into a more readable format
using `toLocaleDateString()`. This hook modifies the way the date is presented to the user, making it more
user-friendly.

### beforeDuplicate

The `beforeDuplicate` field hook is called on each locale (when using localization), when duplicating a document. It may be used when documents having the
exact same properties may cause issue. This gives you a way to avoid duplicate names on `unique`, `required` fields or when external systems expect non-repeating values on documents.

This hook gets called before the `beforeValidate` and `beforeChange` hooks are called.

By Default, unique and required text fields Payload will append "- Copy" to the original document value. The default is not added if your field has its own, you must return non-unique values from your beforeDuplicate hook to avoid errors or enable the `disableDuplicate` option on the collection.
Here is an example of a number field with a hook that increments the number to avoid unique constraint errors when duplicating a document:

```ts
import type { Field } from 'payload'

const numberField: Field = {
  name: 'number',
  type: 'number',
  hooks: {
    // increment existing value by 1
    beforeDuplicate: [
      ({ value }) => {
        return (value ?? 0) + 1
      },
    ],
  },
}
```

## TypeScript

Payload exports a type for field hooks which can be accessed and used as follows:

```ts
import type { FieldHook } from 'payload'

// Field hook type is a generic that takes three arguments:
// 1: The document type
// 2: The value type
// 3: The sibling data type

type ExampleFieldHook = FieldHook<ExampleDocumentType, string, SiblingDataType>

const exampleFieldHook: ExampleFieldHook = (args) => {
  const {
    value, // Typed as `string` as shown above
    data, // Typed as a Partial of your ExampleDocumentType
    siblingData, // Typed as a Partial of SiblingDataType
    originalDoc, // Typed as ExampleDocumentType
    operation,
    req,
  } = args

  // Do something here...

  return value // should return a string as typed above, undefined, or null
}
```

### Practical Example with Generated Types

Here's a real-world example using generated Payload types:

```ts
import type { FieldHook } from 'payload'
import type { Post } from '@/payload-types'

// Hook for a text field in a Post collection
type PostTitleHook = FieldHook<Post, string, Post>

const slugifyTitle: PostTitleHook = ({
  value,
  data,
  siblingData,
  originalDoc,
}) => {
  // value is typed as string | undefined
  // data is typed as Partial<Post>
  // siblingData is typed as Partial<Post>
  // originalDoc is typed as Post | undefined

  // Generate slug from title if not provided
  if (!siblingData.slug && value) {
    const slug = value
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')

    return value
  }

  return value
}

// Hook for a relationship field
type PostAuthorHook = FieldHook<Post, string | number, Post>

const setDefaultAuthor: PostAuthorHook = ({ value, req }) => {
  // value is typed as string | number | undefined
  // Set current user as author if not provided
  if (!value && req.user) {
    return req.user.id
  }

  return value
}
```

<Banner type="success">
  **Tip:** When defining field hooks, use the three generic parameters for full
  type safety: document type, field value type, and sibling data type. This
  provides autocomplete and type checking for all hook arguments.
</Banner>
```

--------------------------------------------------------------------------------

---[FILE: globals.mdx]---
Location: payload-main/docs/hooks/globals.mdx

```text
---
title: Global Hooks
label: Globals
order: 30
desc: Hooks can be added to any Global and allow you to validate data, flatten locales, hide protected fields, remove fields and more.
keywords: hooks, globals, config, configuration, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

Global Hooks are [Hooks](./overview) that run on [Global](../configuration/globals) Documents. They allow you to execute your own logic during specific events of the Document lifecycle.

To add Hooks to a Global, use the `hooks` property in your [Global Config](../configuration/globals):

```ts
import type { GlobalConfig } from 'payload'

export const GlobalWithHooks: GlobalConfig = {
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

All Global Hooks accept an array of [synchronous or asynchronous functions](./overview#async-vs-synchronous). Each Global Hook receives specific arguments based on its own type, and has the ability to modify specific outputs.

```ts
import type { GlobalConfig } from 'payload';

const GlobalWithHooks: GlobalConfig = {
  // ...
  // highlight-start
  hooks: {
    beforeOperation: [(args) => {...}],
    beforeValidate: [(args) => {...}],
    beforeChange: [(args) => {...}],
    beforeRead: [(args) => {...}],
    afterChange: [(args) => {...}],
    afterRead: [(args) => {...}],
  }
  // highlight-end
}
```

### beforeOperation

The `beforeOperation` hook can be used to modify the arguments that operations accept or execute side-effects that run before an operation begins.

```ts
import type { GlobalBeforeOperationHook } from 'payload'

const beforeOperationHook: GlobalBeforeOperationHook = async ({
  args,
  operation,
  req,
}) => {
  return args // return modified operation arguments as necessary
}
```

The following arguments are provided to the `beforeOperation` hook:

| Option          | Description                                                                                                                                                         |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`global`**    | The [Global](../configuration/globals) in which this Hook is running against. Available operation include: `countVersions`, `read`, `restoreVersion`, and `update`. |
| **`context`**   | Custom context passed between Hooks. [More details](./context).                                                                                                     |
| **`operation`** | The name of the operation that this hook is running within.                                                                                                         |
| **`req`**       | The [Web Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object. This is mocked for [Local API](../local-api/overview) operations.               |

### beforeValidate

Runs during the `update` operation. This hook allows you to add or format data before the incoming data is validated server-side.

Please do note that this does not run before client-side validation. If you render a custom field component in your front-end and provide it with a `validate` function, the order that validations will run in is:

1. `validate` runs on the client
2. if successful, `beforeValidate` runs on the server
3. `validate` runs on the server

```ts
import type { GlobalBeforeValidateHook } from 'payload'
import type { SiteSettings } from '@/payload-types'

const beforeValidateHook: GlobalBeforeValidateHook<SiteSettings> = async ({
  data, // Typed as Partial<SiteSettings>
  req,
  originalDoc, // Typed as SiteSettings
}) => {
  return data
}
```

The following arguments are provided to the `beforeValidate` hook:

| Option            | Description                                                                                                                                           |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`global`**      | The [Global](../configuration/globals) in which this Hook is running against.                                                                         |
| **`context`**     | Custom context passed between Hooks. [More details](./context).                                                                                       |
| **`data`**        | The incoming data passed through the operation.                                                                                                       |
| **`originalDoc`** | The Document before changes are applied.                                                                                                              |
| **`req`**         | The [Web Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object. This is mocked for [Local API](../local-api/overview) operations. |

### beforeChange

Immediately following validation, `beforeChange` hooks will run within the `update` operation. At this stage, you can be confident that the data that will be saved to the document is valid in accordance to your field validations. You can optionally modify the shape of data to be saved.

```ts
import type { GlobalBeforeChangeHook } from 'payload'
import type { SiteSettings } from '@/payload-types'

const beforeChangeHook: GlobalBeforeChangeHook<SiteSettings> = async ({
  data, // Typed as Partial<SiteSettings>
  req,
  originalDoc, // Typed as SiteSettings
}) => {
  return data
}
```

The following arguments are provided to the `beforeChange` hook:

| Option            | Description                                                                                                                                           |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`global`**      | The [Global](../configuration/globals) in which this Hook is running against.                                                                         |
| **`context`**     | Custom context passed between hooks. [More details](./context).                                                                                       |
| **`data`**        | The incoming data passed through the operation.                                                                                                       |
| **`originalDoc`** | The Document before changes are applied.                                                                                                              |
| **`req`**         | The [Web Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object. This is mocked for [Local API](../local-api/overview) operations. |

### afterChange

After a global is updated, the `afterChange` hook runs. Use this hook to purge caches of your applications, sync site data to CRMs, and more.

```ts
import type { GlobalAfterChangeHook } from 'payload'
import type { SiteSettings } from '@/payload-types'

const afterChangeHook: GlobalAfterChangeHook<SiteSettings> = async ({
  doc, // Typed as SiteSettings
  previousDoc, // Typed as SiteSettings
  req,
}) => {
  return doc
}
```

The following arguments are provided to the `afterChange` hook:

| Option            | Description                                                                                                                                           |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`global`**      | The [Global](../configuration/globals) in which this Hook is running against.                                                                         |
| **`context`**     | Custom context passed between hooks. [More details](./context).                                                                                       |
| **`data`**        | The incoming data passed through the operation.                                                                                                       |
| **`doc`**         | The resulting Document after changes are applied.                                                                                                     |
| **`previousDoc`** | The Document before changes were applied.                                                                                                             |
| **`req`**         | The [Web Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object. This is mocked for [Local API](../local-api/overview) operations. |

### beforeRead

Runs before `findOne` global operation is transformed for output by `afterRead`. This hook fires before hidden fields are removed and before localized fields are flattened into the requested locale. Using this Hook will provide you with all locales and all hidden fields via the `doc` argument.

```ts
import type { GlobalBeforeReadHook } from 'payload'

const beforeReadHook: GlobalBeforeReadHook = async ({
  doc,
  req,
}) => {...}
```

The following arguments are provided to the `beforeRead` hook:

| Option        | Description                                                                                                                                           |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`global`**  | The [Global](../configuration/globals) in which this Hook is running against.                                                                         |
| **`context`** | Custom context passed between hooks. [More details](./context).                                                                                       |
| **`doc`**     | The resulting Document after changes are applied.                                                                                                     |
| **`req`**     | The [Web Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object. This is mocked for [Local API](../local-api/overview) operations. |

### afterRead

Runs as the last step before a global is returned. Flattens locales, hides protected fields, and removes fields that users do not have access to.

```ts
import type { GlobalAfterReadHook } from 'payload'
import type { SiteSettings } from '@/payload-types'

const afterReadHook: GlobalAfterReadHook<SiteSettings> = async ({
  doc, // Typed as SiteSettings
  req,
  findMany,
}) => {
  return doc
}
```

The following arguments are provided to the `afterRead` hook:

| Option         | Description                                                                                                                                           |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`global`**   | The [Global](../configuration/globals) in which this Hook is running against.                                                                         |
| **`context`**  | Custom context passed between hooks. [More details](./context).                                                                                       |
| **`findMany`** | Boolean to denote if this hook is running against finding one, or finding many (useful in versions).                                                  |
| **`doc`**      | The resulting Document after changes are applied.                                                                                                     |
| **`query`**    | The [Query](../queries/overview) of the request.                                                                                                      |
| **`req`**      | The [Web Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object. This is mocked for [Local API](../local-api/overview) operations. |

## TypeScript

Payload exports a type for each Global hook which can be accessed as follows:

```ts
import type {
  GlobalBeforeValidateHook,
  GlobalBeforeChangeHook,
  GlobalAfterChangeHook,
  GlobalBeforeReadHook,
  GlobalAfterReadHook,
} from 'payload'
```

You can also pass a generic type to each hook for strongly-typed `doc`, `previousDoc`, and `data` properties:

```ts
import type { GlobalAfterChangeHook } from 'payload'
import type { SiteSettings } from '@/payload-types'

const afterChangeHook: GlobalAfterChangeHook<SiteSettings> = async ({
  doc, // Typed as SiteSettings
  previousDoc, // Typed as SiteSettings
}) => {
  return doc
}
```
```

--------------------------------------------------------------------------------

---[FILE: overview.mdx]---
Location: payload-main/docs/hooks/overview.mdx

```text
---
title: Hooks Overview
label: Overview
order: 10
desc: Hooks allow you to add your own logic to Payload, including integrating with third-party APIs, adding auto-generated data, or modifying Payload's base functionality.
keywords: hooks, overview, config, configuration, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

Hooks allow you to execute your own side effects during specific events of the Document lifecycle. They allow you to do things like mutate data, perform business logic, integrate with third-parties, or anything else, all during precise moments within your application.

With Hooks, you can transform Payload from a traditional CMS into a fully-fledged application framework. There are many use cases for Hooks, including:

- Modify data before it is read or updated
- Encrypt and decrypt sensitive data
- Integrate with a third-party CRM like HubSpot or Salesforce
- Send a copy of uploaded files to Amazon S3 or similar
- Process orders through a payment provider like Stripe
- Send emails when contact forms are submitted
- Track data ownership or changes over time

There are four main types of Hooks in Payload:

- [Root Hooks](#root-hooks)
- [Collection Hooks](/docs/hooks/collections)
- [Global Hooks](/docs/hooks/globals)
- [Field Hooks](/docs/hooks/fields)

<Banner type="warning">
  **Reminder:** Payload also ships a set of _React_ hooks that you can use in
  your frontend application. Although they share a common name, these are very
  different things and should not be confused. [More
  details](../admin/react-hooks).
</Banner>

## Root Hooks

Root Hooks are not associated with any specific Collection, Global, or Field. They are useful for globally-oriented side effects, such as when an error occurs at the application level.

To add Root Hooks, use the `hooks` property in your [Payload Config](/docs/configuration/overview):

```ts
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  // highlight-start
  hooks: {
    afterError:[() => {...}]
  },
  // highlight-end
})
```

The following options are available:

| Option           | Description                                            |
| ---------------- | ------------------------------------------------------ |
| **`afterError`** | Runs after an error occurs in the Payload application. |

### afterError

The `afterError` Hook is triggered when an error occurs in the Payload application. This can be useful for logging errors to a third-party service, sending an email to the development team, logging the error to Sentry or DataDog, etc. The output can be used to transform the result object / status code.

```ts
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  hooks: {
    afterError: [
      async ({ error }) => {
        // Do something
      },
    ],
  },
})
```

The following arguments are provided to the `afterError` Hook:

| Argument            | Description                                                                                                                                                                                     |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`error`**         | The error that occurred.                                                                                                                                                                        |
| **`context`**       | Custom context passed between Hooks. [More details](./context).                                                                                                                                 |
| **`graphqlResult`** | The GraphQL result object, available if the hook is executed within a GraphQL context.                                                                                                          |
| **`req`**           | The `PayloadRequest` object that extends [Web Request](https://developer.mozilla.org/en-US/docs/Web/API/Request). Contains currently authenticated `user` and the Local API instance `payload`. |
| **`collection`**    | The [Collection](../configuration/collections) in which this Hook is running against. This will be `undefined` if the hook is executed from a non-collection endpoint or GraphQL.               |
| **`result`**        | The formatted error result object, available if the hook is executed from a REST context.                                                                                                       |

## Awaited vs. non-blocking hooks

Hooks can either block the request until they finish or run without blocking it. What matters is whether your hook returns a Promise.

Awaited (blocking): If your hook returns a Promise (for example, if it’s declared async), Payload will wait for it to resolve before continuing that lifecycle step. Use this when your hook needs to modify data or influence the response. Hooks that return Promises run in series at the same lifecycle stage.

Non-blocking (sometimes called “fire-and-forget”): If your hook does not return a Promise (returns nothing), Payload will not wait for it to finish. This can be useful for side-effects that don’t affect the outcome of the operation, but keep in mind that any work started this way might continue after the request has already completed.

**Declaring a function with async does not make it “synchronous.” The async keyword simply makes the function return a Promise automatically — which is why Payload then awaits it.**

<Banner type="success">
  **Tip:** If your hook executes a long-running task that doesn't affect the
  response in any way, consider [offloading it to the job
  queue](#offloading-long-running-tasks). That will free up the request to
  continue processing without waiting for the task to complete.
</Banner>

**Awaited**

```ts
const beforeChange = async ({ data }) => {
  const enriched = await fetchProfile(data.userId) // Payload waits here
  return { ...data, profile: enriched }
}
```

**Non-blocking**

```ts
const afterChange = ({ doc }) => {
  // Trigger side-effect without blocking
  void pingAnalyticsService(doc.id)
  // No return → Payload does not wait
}
```

## Server-only Execution

Hooks are only triggered on the server and are automatically excluded from the client-side bundle. This means that you can safely use sensitive business logic in your Hooks without worrying about exposing it to the client.

## Performance

Hooks are a powerful way to customize the behavior of your APIs, but some hooks are run very often and can add significant overhead to your requests if not optimized.

When building hooks, combine together as many of these strategies as possible to ensure your hooks are as performant as they can be.

<Banner type="success">
  For more performance tips, see the [Performance
  documentation](../performance/overview).
</Banner>

### Writing efficient hooks

Consider when hooks are run. One common pitfall is putting expensive logic in hooks that run very often.

For example, the `read` operation runs on every read request, so avoid putting expensive logic in a `beforeRead` or `afterRead` hook.

```ts
{
  hooks: {
    beforeRead: [
      async () => {
        // This runs on every read request - avoid expensive logic here
        await doSomethingExpensive()
        return data
      },
    ],
  },
}
```

Instead, you might want to use a `beforeChange` or `afterChange` hook, which only runs when a document is created or updated.

```ts
{
  hooks: {
    beforeChange: [
      async ({ context }) => {
        // This is more acceptable here, although still should be mindful of performance
        await doSomethingExpensive()
        // ...
      },
    ]
  },
}
```

### Using Hook Context

Use [Hook Context](./context) to avoid infinite loops or to prevent repeating expensive operations across multiple hooks in the same request.

```ts
{
  hooks: {
    beforeChange: [
      async ({ context }) => {
        const somethingExpensive = await doSomethingExpensive()
        context.somethingExpensive = somethingExpensive
        // ...
      },
    ],
  },
}
```

To learn more, see the [Hook Context documentation](./context).

### Offloading to the jobs queue

If your hooks perform any long-running tasks that don't directly affect the request lifecycle, consider offloading them to the [jobs queue](../jobs-queue/overview). This will free up the request to continue processing without waiting for the task to complete.

```ts
{
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        // Offload to job queue
        await req.payload.jobs.queue(...)
        // ...
      },
    ],
  },
}
```

To learn more, see the [Job Queue documentation](../jobs-queue/overview).
```

--------------------------------------------------------------------------------

````
