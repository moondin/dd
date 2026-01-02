---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 24
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 24 of 695)

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

---[FILE: overview.mdx]---
Location: payload-main/docs/configuration/overview.mdx

```text
---
title: The Payload Config
label: Overview
order: 10
desc: The Payload Config is central to everything that Payload does, from adding custom React components, to modifying collections, controlling localization and much more.
keywords: overview, config, configuration, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

Payload is a _config-based_, code-first CMS and application framework. The Payload Config is central to everything that Payload does, allowing for deep configuration of your application through a simple and intuitive API. The Payload Config is a fully-typed JavaScript object that can be infinitely extended upon.

Everything from your [Database](../database/overview) choice to the appearance of the [Admin Panel](../admin/overview) is fully controlled through the Payload Config. From here you can define [Fields](../fields/overview), add [Localization](./localization), enable [Authentication](../authentication/overview), configure [Access Control](../access-control/overview), and so much more.

The Payload Config is a `payload.config.ts` file typically located in the root of your project:

```ts
import { buildConfig } from 'payload'

export default buildConfig({
  // Your config goes here
})
```

The Payload Config is strongly typed and ties directly into Payload's TypeScript codebase. This means your IDE (such as VSCode) will provide helpful information like type-ahead suggestions while you write your config.

<Banner type="success">
  **Tip:** The location of your Payload Config can be customized. [More
  details](#customizing-the-config-location).
</Banner>

## Config Options

To author your Payload Config, first determine which [Database](../database/overview) you'd like to use, then use [Collections](./collections) or [Globals](./globals) to define the schema of your data through [Fields](../fields/overview).

Here is one of the simplest possible Payload configs:

```ts
import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET,
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
  collections: [
    {
      slug: 'pages',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
      ],
    },
  ],
})
```

<Banner type="success">
  **Note:** For more complex examples, see the
  [Templates](https://github.com/payloadcms/payload/tree/main/templates) and
  [Examples](https://github.com/payloadcms/payload/tree/main/examples)
  directories in the Payload repository.
</Banner>

The following options are available:

| Option                     | Description                                                                                                                                                                                    |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`admin`**                | The configuration options for the Admin Panel, including Custom Components, Live Preview, etc. [More details](../admin/overview#admin-options).                                                |
| **`bin`**                  | Register custom bin scripts for Payload to execute. [More Details](#custom-bin-scripts).                                                                                                       |
| **`editor`**               | The Rich Text Editor which will be used by `richText` fields. [More details](../rich-text/overview).                                                                                           |
| **`db`** \*                | The Database Adapter which will be used by Payload. [More details](../database/overview).                                                                                                      |
| **`serverURL`**            | A string used to define the absolute URL of your app. This includes the protocol, for example `https://example.com`. No paths allowed, only protocol, domain and (optionally) port.            |
| **`collections`**          | An array of Collections for Payload to manage. [More details](./collections).                                                                                                                  |
| **`compatibility`**        | Compatibility flags for earlier versions of Payload. [More details](#compatibility-flags).                                                                                                     |
| **`globals`**              | An array of Globals for Payload to manage. [More details](./globals).                                                                                                                          |
| **`cors`**                 | Cross-origin resource sharing (CORS) is a mechanism that accept incoming requests from given domains. You can also customize the `Access-Control-Allow-Headers` header. [More details](#cors). |
| **`localization`**         | Opt-in to translate your content into multiple locales. [More details](./localization).                                                                                                        |
| **`logger`**               | Logger options, logger options with a destination stream, or an instantiated logger instance. [More details](https://getpino.io/#/docs/api?id=options).                                        |
| **`loggingLevels`**        | An object to override the level to use in the logger for Payload's errors.                                                                                                                     |
| **`graphQL`**              | Manage GraphQL-specific functionality, including custom queries and mutations, query complexity limits, etc. [More details](../graphql/overview#graphql-options).                              |
| **`cookiePrefix`**         | A string that will be prefixed to all cookies that Payload sets.                                                                                                                               |
| **`csrf`**                 | A whitelist array of URLs to allow Payload to accept cookies from. [More details](../authentication/cookies#csrf-attacks).                                                                     |
| **`defaultDepth`**         | If a user does not specify `depth` while requesting a resource, this depth will be used. [More details](../queries/depth).                                                                     |
| **`defaultMaxTextLength`** | The maximum allowed string length to be permitted application-wide. Helps to prevent malicious public document creation.                                                                       |
| `folders`                  | An optional object to configure global folder settings. [More details](../folders/overview).                                                                                                   |
| `queryPresets`             | An object that to configure Collection Query Presets. [More details](../query-presets/overview).                                                                                               |
| **`maxDepth`**             | The maximum allowed depth to be permitted application-wide. This setting helps prevent against malicious queries. Defaults to `10`. [More details](../queries/depth).                          |
| **`indexSortableFields`**  | Automatically index all sortable top-level fields in the database to improve sort performance and add database compatibility for Azure Cosmos and similar.                                     |
| **`upload`**               | Base Payload upload configuration. [More details](../upload/overview#payload-wide-upload-options).                                                                                             |
| **`routes`**               | Control the routing structure that Payload binds itself to. [More details](../admin/overview#root-level-routes).                                                                               |
| **`email`**                | Configure the Email Adapter for Payload to use. [More details](../email/overview).                                                                                                             |
| **`onInit`**               | A function that is called immediately following startup that receives the Payload instance as its only argument.                                                                               |
| **`debug`**                | Enable to expose more detailed error information.                                                                                                                                              |
| **`telemetry`**            | Disable Payload telemetry by passing `false`. [More details](#telemetry).                                                                                                                      |
| **`hooks`**                | An array of Root Hooks. [More details](../hooks/overview).                                                                                                                                     |
| **`plugins`**              | An array of Plugins. [More details](../plugins/overview).                                                                                                                                      |
| **`endpoints`**            | An array of Custom Endpoints added to the Payload router. [More details](../rest-api/overview#custom-endpoints).                                                                               |
| **`custom`**               | Extension point for adding custom data (e.g. for plugins).                                                                                                                                     |
| **`i18n`**                 | Internationalization configuration. Pass all i18n languages you'd like the admin UI to support. Defaults to English-only. [More details](./i18n).                                              |
| **`secret`** \*            | A secure, unguessable string that Payload will use for any encryption workflows - for example, password salt / hashing.                                                                        |
| **`sharp`**                | If you would like Payload to offer cropping, focal point selection, and automatic media resizing, install and pass the Sharp module to the config here.                                        |
| **`typescript`**           | Configure TypeScript settings here. [More details](#typescript).                                                                                                                               |

_\* An asterisk denotes that a property is required._

<Banner type="warning">
  **Note:** Some properties are removed from the client-side bundle. [More
  details](../custom-components/overview#accessing-the-payload-config).
</Banner>

### TypeScript Config

Payload exposes a variety of TypeScript settings that you can leverage. These settings are used to auto-generate TypeScript interfaces for your [Collections](./collections) and [Globals](./globals), and to ensure that Payload uses your [Generated Types](../typescript/overview) for all [Local API](../local-api/overview) methods.

To customize the TypeScript settings, use the `typescript` property in your Payload Config:

```ts
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  // highlight-start
  typescript: {
    // ...
  },
  // highlight-end
})
```

The following options are available:

| Option             | Description                                                                                                                                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`autoGenerate`** | By default, Payload will auto-generate TypeScript interfaces for all collections and globals that your config defines. Opt out by setting `typescript.autoGenerate: false`. [More details](../typescript/overview). |
| **`declare`**      | By default, Payload adds a `declare` block to your generated types, which makes sure that Payload uses your generated types for all Local API methods. Opt out by setting `typescript.declare: false`.              |
| **`outputFile`**   | Control the output path and filename of Payload's auto-generated types by defining the `typescript.outputFile` property to a full, absolute path.                                                                   |

## Config Location

For Payload command-line scripts, we need to be able to locate your Payload Config. We'll check a variety of locations for the presence of `payload.config.ts` by default, including:

1. The root current working directory
1. The `compilerOptions` in your `tsconfig`\*
1. The `dist` directory\*

_\* Config location detection is different between development and production environments. See below for more details._

<Banner type="warning">
  **Important:** Ensure your `tsconfig.json` is properly configured for Payload
  to auto-detect your config location. If it does not exist, or does not specify
  the proper `compilerOptions`, Payload will default to the current working
  directory.
</Banner>

**Development Mode**

In development mode, if the configuration file is not found at the root, Payload will attempt to read your `tsconfig.json`, and attempt to find the config file specified in the `rootDir`:

```json
{
  // ...
  // highlight-start
  "compilerOptions": {
    "rootDir": "src"
  }
  // highlight-end
}
```

**Production Mode**

In production mode, Payload will first attempt to find the config file in the `outDir` of your `tsconfig.json`, and if not found, will fallback to the `rootDir` directory:

```json
{
  // ...
  // highlight-start
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  }
  // highlight-end
}
```

If none was in either location, Payload will finally check the `dist` directory.

### Customizing the Config Location

In addition to the above automated detection, you can specify your own location for the Payload Config. This can be useful in situations where your config is not in a standard location, or you wish to switch between multiple configurations. To do this, Payload exposes an [Environment Variable](../configuration/environment-vars) to bypass all automatic config detection.

To use a custom config location, set the `PAYLOAD_CONFIG_PATH` environment variable:

```json
{
  "scripts": {
    "payload": "PAYLOAD_CONFIG_PATH=/path/to/custom-config.ts payload"
  }
}
```

<Banner type="info">
  **Tip:** `PAYLOAD_CONFIG_PATH` can be either an absolute path, or path
  relative to your current working directory.
</Banner>

## Telemetry

Payload collects **completely anonymous** telemetry data about general usage. This data is super important to us and helps us accurately understand how we're growing and what we can do to build the software into everything that it can possibly be. The telemetry that we collect also help us demonstrate our growth in an accurate manner, which helps us as we seek investment to build and scale our team. If we can accurately demonstrate our growth, we can more effectively continue to support Payload as free and open-source software. To opt out of telemetry, you can pass `telemetry: false` within your Payload Config.

For more information about what we track, take a look at our [privacy policy](/privacy).

## Cross-origin resource sharing (CORS)#cors

Cross-origin resource sharing (CORS) can be configured with either a whitelist array of URLS to allow CORS requests from, a wildcard string (`*`) to accept incoming requests from any domain, or an object with the following properties:

| Option        | Description                                                                                                                             |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **`origins`** | Either a whitelist array of URLS to allow CORS requests from, or a wildcard string (`'*'`) to accept incoming requests from any domain. |
| **`headers`** | A list of allowed headers that will be appended in `Access-Control-Allow-Headers`.                                                      |

Here's an example showing how to allow incoming requests from any domain:

```ts
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  // highlight-start
  cors: '*',
  // highlight-end
})
```

Here's an example showing how to append a new header (`x-custom-header`) in `Access-Control-Allow-Headers`:

```ts
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  // highlight-start
  cors: {
    origins: ['http://localhost:3000'],
    headers: ['x-custom-header'],
  },
  // highlight-end
})
```

## TypeScript

You can import types from Payload to help make writing your config easier and type-safe. There are two main types that represent the Payload Config, `Config` and `SanitizedConfig`.

The `Config` type represents a raw Payload Config in its full form. Only the bare minimum properties are marked as required. The `SanitizedConfig` type represents a Payload Config after it has been fully sanitized. Generally, this is only used internally by Payload.

```ts
import type { Config, SanitizedConfig } from 'payload'
```

## Server vs. Client

The Payload Config only lives on the server and is not allowed to contain any client-side code. That way, you can load up the Payload Config in any server environment or standalone script, without having to use Bundlers or Node.js loaders to handle importing client-only modules (e.g. scss files or React Components) without any errors.

Behind the curtains, the Next.js-based Admin Panel generates a ClientConfig, which strips away any server-only code and enriches the config with React Components.

## Compatibility flags

The Payload Config can accept compatibility flags for running the newest versions but with older databases. You should only use these flags if you need to, and should confirm that you need to prior to enabling these flags.

`allowLocalizedWithinLocalized`

Payload localization works on a field-by-field basis. As you can nest fields within other fields, you could potentially nest a localized field within a localized field—but this would be redundant and unnecessary. There would be no reason to define a localized field within a localized parent field, given that the entire data structure from the parent field onward would be localized.

By default, Payload will remove the `localized: true` property from sub-fields if a parent field is localized. Set this compatibility flag to `true` only if you have an existing Payload MongoDB database from pre-3.0, and you have nested localized fields that you would like to maintain without migrating.

## Custom bin scripts

Using the `bin` configuration property, you can inject your own scripts to `npx payload`.
Example for `pnpm payload seed`:

Step 1: create `seed.ts` file in the same folder with `payload.config.ts` with:

```ts
import type { SanitizedConfig } from 'payload'

import payload from 'payload'

// Script must define a "script" function export that accepts the sanitized config
export const script = async (config: SanitizedConfig) => {
  await payload.init({ config })
  await payload.create({
    collection: 'pages',
    data: { title: 'my title' },
  })
  payload.logger.info('Successfully seeded!')
  process.exit(0)
}
```

Step 2: add the `seed` script to `bin`:

```ts
export default buildConfig({
  bin: [
    {
      scriptPath: path.resolve(dirname, 'seed.ts'),
      key: 'seed',
    },
  ],
})
```

Now you can run the command using:

```sh
pnpm payload seed
```

## Running bin scripts on a schedule

Every bin script supports being run on a schedule using cron syntax. Simply pass the `--cron` flag followed by the cron expression when running the script. Example:

```sh
pnpm payload run ./myScript.ts --cron "0 * * * *"
```

This will use the `run` bin script to execute the specified script on the defined schedule.
```

--------------------------------------------------------------------------------

---[FILE: custom-providers.mdx]---
Location: payload-main/docs/custom-components/custom-providers.mdx

```text
---
title: Swap in your own React Context providers
label: Custom Providers
order: 30
desc:
keywords: admin, components, custom, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

As you add more and more [Custom Components](./overview) to your [Admin Panel](../admin/overview), you may find it helpful to add additional [React Context](https://react.dev/learn/scaling-up-with-reducer-and-context)(s) to your app. Payload allows you to inject your own context providers where you can export your own custom hooks, etc.

To add a Custom Provider, use the `admin.components.providers` property in your [Payload Config](../configuration/overview):

```ts
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  admin: {
    components: {
      providers: ['/path/to/MyProvider'], // highlight-line
    },
  },
})
```

Then build your Custom Provider as follows:

```tsx
'use client'
import React, { createContext, use } from 'react'

const MyCustomContext = React.createContext(myCustomValue)

export function MyProvider({ children }: { children: React.ReactNode }) {
  return <MyCustomContext value={myCustomValue}>{children}</MyCustomContext>
}

export const useMyCustomContext = () => use(MyCustomContext)
```

_For details on how to build Custom Components, see [Building Custom Components](./overview#building-custom-components)._

<Banner type="warning">
  **Reminder:** React Context exists only within Client Components. This means
  they must include the `use client` directive at the top of their files and
  cannot contain server-only code. To use a Server Component here, simply _wrap_
  your Client Component with it.
</Banner>
```

--------------------------------------------------------------------------------

---[FILE: custom-views.mdx]---
Location: payload-main/docs/custom-components/custom-views.mdx

```text
---
title: Customizing Views
label: Customizing Views
order: 40
desc:
keywords:
---

Views are the individual pages that make up the [Admin Panel](../admin/overview), such as the Dashboard, [List View](./list-view), and [Edit View](./edit-view). One of the most powerful ways to customize the Admin Panel is to create Custom Views. These are [Custom Components](./overview) that can either replace built-in views or be entirely new.

There are four types of views within the Admin Panel:

- [Root Views](#root-views)
- [Collection Views](#collection-views)
- [Global Views](#global-views)
- [Document Views](./document-views)

To swap in your own Custom View, first determine the scope that corresponds to what you are trying to accomplish, consult the list of available components, then [author your React component(s)](#building-custom-views) accordingly.

## Configuration

### Replacing Views

To customize views, use the `admin.components.views` property in your [Payload Config](../configuration/overview). This is an object with keys for each view you want to customize. Each key corresponds to the view you want to customize.

The exact list of available keys depends on the scope of the view you are customizing, depending on whether it's a [Root View](#root-views), [Collection View](#collection-views), or [Global View](#global-views). Regardless of the scope, the principles are the same.

Here is an example of how to swap out a built-in view:

```ts
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  admin: {
    components: {
      views: {
        // highlight-start
        dashboard: {
          Component: '/path/to/MyCustomDashboard',
        },
        // highlight-end
      },
    },
  },
})
```

For more granular control, pass a configuration object instead. Payload exposes the following properties for each view:

| Property       | Description                                                                                                                                                                         |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Component` \* | Pass in the component path that should be rendered when a user navigates to this route.                                                                                             |
| `path` \*      | Any valid URL path or array of paths that [`path-to-regexp`](https://www.npmjs.com/package/path-to-regex) understands. Must begin with a forward slash (`/`).                       |
| `exact`        | Boolean. When true, will only match if the path matches the `usePathname()` exactly.                                                                                                |
| `strict`       | When true, a path that has a trailing slash will only match a `location.pathname` with a trailing slash. This has no effect when there are additional URL segments in the pathname. |
| `sensitive`    | When true, will match if the path is case sensitive.                                                                                                                                |
| `meta`         | Page metadata overrides to apply to this view within the Admin Panel. [More details](../admin/metadata).                                                                            |

_\* An asterisk denotes that a property is required._

### Adding New Views

To add a _new_ view to the [Admin Panel](../admin/overview), simply add your own key to the `views` object. This is true for all view scopes.

New views require at least the `Component` and `path` properties:

```ts
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  admin: {
    components: {
      views: {
        // highlight-start
        myCustomView: {
          Component: '/path/to/MyCustomView#MyCustomViewComponent',
          path: '/my-custom-view',
        },
        // highlight-end
      },
    },
  },
})
```

<Banner type="warning">
  **Note:** Routes are cascading, so unless explicitly given the `exact`
  property, they will match on URLs that simply _start_ with the route's path.
  This is helpful when creating catch-all routes in your application.
  Alternatively, define your nested route _before_ your parent route.
</Banner>

## Building Custom Views

Custom Views are simply [Custom Components](./overview) rendered at the page-level. Custom Views can either [replace existing views](#replacing-views) or [add entirely new ones](#adding-new-views). The process is generally the same regardless of the type of view you are customizing.

To understand how to build Custom Views, first review the [Building Custom Components](./overview#building-custom-components) guide. Once you have a Custom Component ready, you can use it as a Custom View.

```ts
import type { CollectionConfig } from 'payload'

export const MyCollectionConfig: CollectionConfig = {
  // ...
  admin: {
    components: {
      views: {
        // highlight-start
        edit: {
          Component: '/path/to/MyCustomView', // highlight-line
        },
        // highlight-end
      },
    },
  },
}
```

### Default Props

Your Custom Views will be provided with the following props:

| Prop             | Description                                                                                                                        |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `initPageResult` | An object containing `req`, `payload`, `permissions`, etc.                                                                         |
| `clientConfig`   | The Client Config object. [More details](./overview#accessing-the-payload-config).                                                 |
| `importMap`      | The import map object.                                                                                                             |
| `params`         | An object containing the [Dynamic Route Parameters](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes). |
| `searchParams`   | An object containing the [Search Parameters](https://developer.mozilla.org/docs/Learn/Common_questions/What_is_a_URL#parameters).  |
| `doc`            | The document being edited. Only available in Document Views. [More details](./document-views).                                     |
| `i18n`           | The [i18n](../configuration/i18n) object.                                                                                          |
| `payload`        | The [Payload](../local-api/overview) class.                                                                                        |

<Banner type="warning">
  **Note:** Some views may receive additional props, such as [Collection
  Views](#collection-views) and [Global Views](#global-views). See the relevant
  section for more details.
</Banner>

Here is an example of a Custom View component:

```tsx
import type { AdminViewServerProps } from 'payload'

import { Gutter } from '@payloadcms/ui'
import React from 'react'

export function MyCustomView(props: AdminViewServerProps) {
  return (
    <Gutter>
      <h1>Custom Default Root View</h1>
      <p>This view uses the Default Template.</p>
    </Gutter>
  )
}
```

<Banner type="success">
  **Tip:** For consistent layout and navigation, you may want to wrap your
  Custom View with one of the built-in [Templates](./overview#templates).
</Banner>

### View Templates

Your Custom Root Views can optionally use one of the templates that Payload provides. The most common of these is the Default Template which provides the basic layout and navigation.

Here is an example of how to use the Default Template in your Custom View:

```tsx
import type { AdminViewServerProps } from 'payload'

import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import React from 'react'

export function MyCustomView({
  initPageResult,
  params,
  searchParams,
}: AdminViewServerProps) {
  return (
    <DefaultTemplate
      i18n={initPageResult.req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={initPageResult.req.payload}
      permissions={initPageResult.permissions}
      searchParams={searchParams}
      user={initPageResult.req.user || undefined}
      visibleEntities={initPageResult.visibleEntities}
    >
      <Gutter>
        <h1>Custom Default Root View</h1>
        <p>This view uses the Default Template.</p>
      </Gutter>
    </DefaultTemplate>
  )
}
```

### Securing Custom Views

All Custom Views are public by default. It's up to you to secure your custom views. If your view requires a user to be logged in or to have certain access rights, you should handle that within your view component yourself.

Here is how you might secure a Custom View:

```tsx
import type { AdminViewServerProps } from 'payload'

import { Gutter } from '@payloadcms/ui'
import React from 'react'

export function MyCustomView({ initPageResult }: AdminViewServerProps) {
  const {
    req: { user },
  } = initPageResult

  if (!user) {
    return <p>You must be logged in to view this page.</p>
  }

  return (
    <Gutter>
      <h1>Custom Default Root View</h1>
      <p>This view uses the Default Template.</p>
    </Gutter>
  )
}
```

## Root Views

Root Views are the main views of the [Admin Panel](../admin/overview). These are views that are scoped directly under the `/admin` route, such as the Dashboard or Account views.

To [swap out](#replacing-views) Root Views with your own, or to [create entirely new ones](#adding-new-views), use the `admin.components.views` property at the root of your [Payload Config](../configuration/overview):

```ts
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  admin: {
    components: {
      views: {
        // highlight-start
        dashboard: {
          Component: '/path/to/Dashboard',
        },
        // highlight-end
        // Other options include:
        // - account
        // - [key: string]
        // See below for more details
      },
    },
  },
})
```

_For details on how to build Custom Views, including all available props, see [Building Custom Views](#building-custom-views)._

The following options are available:

| Property    | Description                                                                                     |
| ----------- | ----------------------------------------------------------------------------------------------- |
| `account`   | The Account view is used to show the currently logged in user's Account page.                   |
| `dashboard` | The main landing page of the Admin Panel.                                                       |
| `[key]`     | Any other key can be used to add a completely new Root View. [More details](#adding-new-views). |

## Collection Views

Collection Views are views that are scoped under the `/collections` route, such as the Collection List and Document Edit views.

To [swap out](#replacing-views) Collection Views with your own, or to [create entirely new ones](#adding-new-views), use the `admin.components.views` property of your [Collection Config](../configuration/collections):

```ts
import type { CollectionConfig } from 'payload'

export const MyCollectionConfig: CollectionConfig = {
  // ...
  admin: {
    components: {
      views: {
        // highlight-start
        edit: {
          default: {
            Component: '/path/to/MyCustomCollectionView',
          },
        },
        // highlight-end
        // Other options include:
        // - list
        // - [key: string]
        // See below for more details
      },
    },
  },
}
```

<Banner type="success">
  **Reminder:** The `edit` key is comprised of various nested views, known as
  Document Views, that relate to the same Collection Document. [More
  details](./document-views).
</Banner>

The following options are available:

| Property | Description                                                                                                                                     |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `edit`   | The Edit View corresponds to a single Document for any given Collection and consists of various nested views. [More details](./document-views). |
| `list`   | The List View is used to show a list of Documents for any given Collection. [More details](#list-view).                                         |
| `[key]`  | Any other key can be used to add a completely new Collection View. [More details](#adding-new-views).                                           |

_For details on how to build Custom Views, including all available props, see [Building Custom Views](#building-custom-views)._

## Global Views

Global Views are views that are scoped under the `/globals` route, such as the Edit View.

To [swap out](#replacing-views) Global Views with your own or [create entirely new ones](#adding-new-views), use the `admin.components.views` property in your [Global Config](../configuration/globals):

```ts
import type { SanitizedGlobalConfig } from 'payload'

export const MyGlobalConfig: SanitizedGlobalConfig = {
  // ...
  admin: {
    components: {
      views: {
        // highlight-start
        edit: {
          default: {
            Component: '/path/to/MyCustomGlobalView',
          },
        },
        // highlight-end
        // Other options include:
        // - [key: string]
        // See below for more details
      },
    },
  },
}
```

<Banner type="success">
  **Reminder:** The `edit` key is comprised of various nested views, known as
  Document Views, that relate to the same Global Document. [More
  details](./document-views).
</Banner>

The following options are available:

| Property | Description                                                                                                                             |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `edit`   | The Edit View represents a single Document for any given Global and consists of various nested views. [More details](./document-views). |
| `[key]`  | Any other key can be used to add a completely new Global View. [More details](#adding-new-views).                                       |

_For details on how to build Custom Views, including all available props, see [Building Custom Views](#building-custom-views)._
```

--------------------------------------------------------------------------------

````
