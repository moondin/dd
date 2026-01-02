---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 54
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 54 of 695)

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
Location: payload-main/docs/plugins/overview.mdx

```text
---
title: Plugins
label: Overview
order: 10
desc: Plugins provide a great way to modularize Payload functionalities into easy-to-use enhancements and extensions of your Payload apps.
keywords: plugins, config, configuration, extensions, custom, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

Payload Plugins take full advantage of the modularity of the [Payload Config](../configuration/overview), allowing developers to easily inject custom—sometimes complex—functionality into Payload apps from a very small touch-point. This is especially useful for sharing your work across multiple projects or with the greater Payload community.

There are many [Official Plugins](#official-plugins) available that solve for some of the most common use cases, such as the [Form Builder Plugin](./form-builder) or [SEO Plugin](./seo). There are also [Community Plugins](#community-plugins) available, maintained entirely by contributing members. To extend Payload's functionality in some other way, you can easily [build your own plugin](./build-your-own).

To configure Plugins, use the `plugins` property in your [Payload Config](../configuration/overview):

```ts
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  // highlight-start
  plugins: [
    // Add Plugins here
  ],
  // highlight-end
})
```

Writing Plugins is no more complex than writing regular JavaScript. If you know the basic concept of [callback functions](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function) or how [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) works, and are up to speed with Payload concepts, then writing a plugin will be a breeze.

<Banner type="success">
  Because we rely on a simple config-based structure, Payload Plugins simply
  take in an existing config and return a _modified_ config with new fields,
  hooks, collections, admin views, or anything else you can think of.
</Banner>

**Example use cases:**

- Automatically sync data from a specific collection to HubSpot or a similar CRM when data is added or changes
- Add password-protection functionality to certain documents
- Add a full e-commerce backend to any Payload app
- Add custom reporting views to Payload's Admin Panel
- Encrypt specific collections' data
- Add a full form builder implementation
- Integrate all `upload`-enabled collections with a third-party file host like S3 or Cloudinary
- Add custom endpoints or GraphQL queries / mutations with any type of custom functionality that you can think of

## Official Plugins

Payload maintains a set of Official Plugins that solve for some of the common use cases. These plugins are maintained by the Payload team and its contributors and are guaranteed to be stable and up-to-date.

- [Form Builder](./form-builder)
- [MCP](./mcp)
- [Multi-Tenant](./multi-tenant)
- [Nested Docs](./nested-docs)
- [Redirects](./redirects)
- [Search](./search)
- [Sentry](./sentry)
- [SEO](./seo)
- [Stripe](./stripe)
- [Import/Export](./import-export)
- [Ecommerce](../ecommerce/overview)

You can also [build your own plugin](./build-your-own) to easily extend Payload's functionality in some other way. Once your plugin is ready, consider [sharing it with the community](#community-plugins).

Plugins are changing every day, so be sure to check back often to see what new plugins may have been added. If you have a specific plugin you would like to see, please feel free to start a new [Discussion](https://github.com/payloadcms/payload/discussions).

<Banner type="warning">
  For a complete list of Official Plugins, visit the [Packages
  Directory](https://github.com/payloadcms/payload/tree/main/packages) of the
  [Payload Monorepo](https://github.com/payloadcms/payload).
</Banner>

## Community Plugins

Community Plugins are those that are maintained entirely by outside contributors. They are a great way to share your work across the ecosystem for others to use. You can discover Community Plugins by browsing the `payload-plugin` topic on [GitHub](https://github.com/topics/payload-plugin).

Some plugins have become so widely used that they are adopted as an [Official Plugin](#official-plugins), such as the [Lexical Plugin](https://github.com/AlessioGr/payload-plugin-lexical). If you have a plugin that you think should be an Official Plugin, please feel free to start a new [Discussion](https://github.com/payloadcms/payload/discussions).

<Banner type="warning">
  For maintainers building plugins for others to use, please add the
  `payload-plugin` topic on [GitHub](https://github.com/topics/payload-plugin)
  to help others find it.
</Banner>

## Example

The base [Payload Config](../configuration/overview) allows for a `plugins` property which takes an `array` of [Plugin Configs](./build-your-own).

```ts
import { buildConfig } from 'payload'
import { addLastModified } from './addLastModified.ts'

const config = buildConfig({
  // ...
  // highlight-start
  plugins: [addLastModified],
  // highlight-end
})
```

<Banner type="warning">
  Payload Plugins are executed _after_ the incoming config is validated, but
  before it is sanitized and has had default options merged in. After all
  plugins are executed, the full config with all plugins will be sanitized.
</Banner>

Here is an example what the `addLastModified` plugin from above might look like. It adds a `lastModifiedBy` field to all Payload collections. For full details, see [how to build your own plugin](./build-your-own).

```ts
import { Config, Plugin } from 'payload'

export const addLastModified: Plugin = (incomingConfig: Config): Config => {
  // Find all incoming auth-enabled collections
  // so we can create a lastModifiedBy relationship field
  // to all auth collections
  const authEnabledCollections = incomingConfig.collections.filter(
    (collection) => Boolean(collection.auth),
  )

  // Spread the existing config
  const config: Config = {
    ...incomingConfig,
    collections: incomingConfig.collections.map((collection) => {
      // Spread each item that we are modifying,
      // and add our new field - complete with
      // hooks and proper admin UI config
      return {
        ...collection,
        fields: [
          ...collection.fields,
          {
            name: 'lastModifiedBy',
            type: 'relationship',
            relationTo: authEnabledCollections.map(({ slug }) => slug),
            hooks: {
              beforeChange: [
                ({ req }) => ({
                  value: req?.user?.id,
                  relationTo: req?.user?.collection,
                }),
              ],
            },
            admin: {
              position: 'sidebar',
              readOnly: true,
            },
          },
        ],
      }
    }),
  }

  return config
}
```

<Banner type="success">
  **Reminder:** See [how to build your own plugin](./build-your-own) for a more
  in-depth explication on how to create your own Payload Plugin.
</Banner>
```

--------------------------------------------------------------------------------

---[FILE: redirects.mdx]---
Location: payload-main/docs/plugins/redirects.mdx

```text
---
title: Redirects Plugin
label: Redirects
order: 70
desc: Automatically create redirects for your Payload application
keywords: plugins, redirects, redirect, plugin, payload, cms, seo, indexing, search, search engine
---

![https://www.npmjs.com/package/@payloadcms/plugin-redirects](https://img.shields.io/npm/v/@payloadcms/plugin-redirects)

This plugin allows you to easily manage redirects for your application from within your [Admin Panel](../admin/overview). It does so by adding a `redirects` collection to your config that allows you specify a redirect from one URL to another. Your front-end application can use this data to automatically redirect users to the correct page using proper HTTP status codes. This is useful for SEO, indexing, and search engine ranking when re-platforming or when changing your URL structure.

For example, if you have a page at `/about` and you want to change it to `/about-us`, you can create a redirect from the old page to the new one, then you can use this data to write HTTP redirects into your front-end application. This will ensure that users are redirected to the correct page without penalty because search engines are notified of the change at the request level. This is a very lightweight plugin that will allow you to integrate managed redirects for any front-end framework.

<Banner type="info">
  This plugin is completely open-source and the [source code can be found
  here](https://github.com/payloadcms/payload/tree/main/packages/plugin-redirects).
  If you need help, check out our [Community
  Help](https://payloadcms.com/community-help). If you think you've found a bug,
  please [open a new
  issue](https://github.com/payloadcms/payload/issues/new?assignees=&labels=plugin%3A%redirects&template=bug_report.md&title=plugin-redirects%3A)
  with as much detail as possible.
</Banner>

## Core features

- Adds a `redirects` collection to your config that:
  - includes a `from` and `to` fields
  - allows `to` to be a document reference

## Installation

Install the plugin using any JavaScript package manager like [pnpm](https://pnpm.io), [npm](https://npmjs.com), or [Yarn](https://yarnpkg.com):

```bash
  pnpm add @payloadcms/plugin-redirects
```

## Basic Usage

In the `plugins` array of your [Payload Config](https://payloadcms.com/docs/configuration/overview), call the plugin with [options](#options):

```ts
import { buildConfig } from 'payload'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'

const config = buildConfig({
  collections: [
    {
      slug: 'pages',
      fields: [],
    },
  ],
  plugins: [
    redirectsPlugin({
      collections: ['pages'],
    }),
  ],
})

export default config
```

### Options

| Option                      | Type       | Description                                                                                             |
| --------------------------- | ---------- | ------------------------------------------------------------------------------------------------------- |
| `collections`               | `string[]` | An array of collection slugs to populate in the `to` field of each redirect.                            |
| `overrides`                 | `object`   | A partial collection config that allows you to override anything on the `redirects` collection.         |
| `redirectTypes`             | `string[]` | Provide an array of redirects if you want to provide options for the type of redirects to be supported. |
| `redirectTypeFieldOverride` | `Field`    | A partial Field config that allows you to override the Redirect Type field if enabled above.            |

Note that the fields in overrides take a function that receives the default fields and returns an array of fields. This allows you to add fields to the collection.

```ts
redirectsPlugin({
  collections: ['pages'],
  overrides: {
    fields: ({ defaultFields }) => {
      return [
        ...defaultFields,
        {
          type: 'text',
          name: 'customField',
        },
      ]
    },
  },
  redirectTypes: ['301', '302'],
  redirectTypeFieldOverride: {
    label: 'Redirect Type (Overridden)',
  },
})
```

## TypeScript

All types can be directly imported:

```ts
import { PluginConfig } from '@payloadcms/plugin-redirects/types'
```

## Examples

The [Templates Directory](https://github.com/payloadcms/payload/tree/main/templates) also contains an official [Website Template](https://github.com/payloadcms/payload/tree/main/templates/website) and [E-commerce Template](https://github.com/payloadcms/payload/tree/main/templates/ecommerce), both of which use this plugin.
```

--------------------------------------------------------------------------------

---[FILE: search.mdx]---
Location: payload-main/docs/plugins/search.mdx

```text
---
title: Search Plugin
label: Search
order: 80
desc: Generates records of your documents that are extremely fast to search on.
keywords: plugins, search, search plugin, search engine, search index, search results, search bar, search box, search field, search form, search input
---

![https://www.npmjs.com/package/@payloadcms/plugin-search](https://img.shields.io/npm/v/@payloadcms/plugin-search)

This plugin generates records of your documents that are extremely fast to search on. It does so by creating a new `search` collection that is indexed in the database then saving a static copy of each of your documents using only search-critical data. Search records are automatically created, synced, and deleted behind-the-scenes as you manage your application's documents.

For example, if you have a posts collection that is extremely large and complex, this would allow you to sync just the title, excerpt, and slug of each post so you can query on _that_ instead of the original post directly. Search records are static, so querying them also has the significant advantage of bypassing any hooks that may be present on the original documents. You define exactly what data is synced, and you can even modify or fallback this data before it is saved on a per-document basis.

To query search results, use all the existing Payload APIs that you are already familiar with. You can also prioritize search results by setting a custom priority for each collection. For example, you may want to list blog posts before pages. Or you may want one specific post to always appear first. Search records are given a `priority` field that can be used as the `?sort=` parameter in your queries.

This plugin is a great way to implement a fast, immersive search experience such as a search bar in a front-end application. Many applications may not need the power and complexity of a third-party service like Algolia or ElasticSearch. This plugin provides a first-party alternative that is easy to set up and runs entirely on your own database.

<Banner type="info">
  This plugin is completely open-source and the [source code can be found
  here](https://github.com/payloadcms/payload/tree/main/packages/plugin-search).
  If you need help, check out our [Community
  Help](https://payloadcms.com/community-help). If you think you've found a bug,
  please [open a new
  issue](https://github.com/payloadcms/payload/issues/new?assignees=&labels=plugin%3A%20search&template=bug_report.md&title=plugin-search%3A)
  with as much detail as possible.
</Banner>

## Core Features

- Automatically adds an indexed `search` collection to your database
- Automatically creates, syncs, and deletes search records as you manage your documents
- Saves only search-critical data that you define (e.g. title, excerpt, etc.)
- Allows you to query search results using first-party Payload APIs
- Allows you to query documents without triggering any of their underlying hooks
- Allows you to easily prioritize search results by collection or document
- Allows you to reindex search results by collection on demand

## Installation

Install the plugin using any JavaScript package manager like [pnpm](https://pnpm.io), [npm](https://npmjs.com), or [Yarn](https://yarnpkg.com):

```bash
  pnpm add @payloadcms/plugin-search
```

## Basic Usage

In the `plugins` array of your [Payload Config](https://payloadcms.com/docs/configuration/overview), call the plugin with [options](#options):

```js
import { buildConfig } from 'payload'
import { searchPlugin } from '@payloadcms/plugin-search'

const config = buildConfig({
  collections: [
    {
      slug: 'pages',
      fields: [],
    },
    {
      slug: 'posts',
      fields: [],
    },
  ],
  plugins: [
    searchPlugin({
      collections: ['pages', 'posts'],
      defaultPriorities: {
        pages: 10,
        posts: 20,
      },
    }),
  ],
})

export default config
```

### Options

#### `collections`

The `collections` property is an array of collection slugs to enable syncing to search. Enabled collections receive a `beforeChange` and `afterDelete` hook that creates, updates, and deletes its respective search record as it changes over time.

#### `localize`

By default, the search plugin will add `localization: true` to the `title` field of the newly added `search` collection if you have localization enabled. If you would like to disable this behavior, you can set this to `false`.

#### `defaultPriorities`

This plugin automatically adds a `priority` field to the `search` collection that can be used as the `?sort=` parameter in your queries. For example, you may want to list blog posts before pages. Or you may want one specific post to always take appear first.

The `defaultPriorities` property is used to set a fallback `priority` on search records during the `create` operation. It accepts an object with keys that are your collection slugs and values that can either be a number or a function that returns a number. The function receives the `doc` as an argument, which is the document being created.

```ts
// payload.config.ts
{
  // ...
  searchPlugin({
    defaultPriorities: {
      pages: ({ doc }) => (doc.title.startsWith('Hello, world!') ? 1 : 10),
      posts: 20,
    },
  }),
}
```

#### `searchOverrides`

This plugin automatically creates the `search` collection, but you can override anything on this collection via the `searchOverrides` property. It accepts anything from the [Payload Collection Config](https://payloadcms.com/docs/configuration/collections) and merges it in with the default `search` collection config provided by the plugin.

Note that the `fields` property is a function that receives an object with a `defaultFields` key. This is an array of fields that are automatically added to the `search` collection. You can modify this array or add new fields to it.

```ts
// payload.config.ts
{
  // ...
  searchPlugin({
    searchOverrides: {
      slug: 'search-results',
      fields: ({ defaultFields }) => [
        ...defaultFields,
        {
          name: 'excerpt',
          type: 'textarea',
          admin: {
            position: 'sidebar',
          },
        },
      ],
    },
  }),
}
```

#### `beforeSync`

Before creating or updating a search record, the `beforeSync` function runs. This is an [afterChange](https://payloadcms.com/docs/hooks/globals#afterchange) hook that allows you to modify the data or provide fallbacks before its search record is created or updated.

```ts
// payload.config.ts
{
  // ...
  searchPlugin({
    beforeSync: ({ originalDoc, searchDoc }) => ({
      ...searchDoc,
      // - Modify your docs in any way here, this can be async
      // - You also need to add the `excerpt` field in the `searchOverrides` config
      excerpt: originalDoc?.excerpt || 'This is a fallback excerpt',
    }),
  }),
}
```

#### `syncDrafts`

When `syncDrafts` is true, draft documents will be synced to search. This is false by default. You must have [Payload Drafts](https://payloadcms.com/docs/versions/drafts) enabled for this to apply.

#### `deleteDrafts`

If true, will delete documents from search whose status changes to draft. This is true by default. You must have [Payload Drafts](https://payloadcms.com/docs/versions/drafts) enabled for this to apply.

#### `reindexBatchSize`

A number that, when specified, will be used as the value to determine how many search documents to fetch for reindexing at a time in each batch. If not set, this will default to `50`.

### Collection reindexing

Collection reindexing allows you to recreate search documents from your search-enabled collections on demand. This is useful if you have existing documents that don't already have search indexes, commonly when adding `plugin-search` to an existing project. To get started, navigate to your search collection and click the pill in the top right actions slot of the list view labelled `Reindex`. This will open a popup with options to select one of your search-enabled collections, or all, for reindexing.

## TypeScript

All types can be directly imported:

```ts
import type { SearchConfig, BeforeSync } from '@payloadcms/plugin-search/types'
```
```

--------------------------------------------------------------------------------

---[FILE: sentry.mdx]---
Location: payload-main/docs/plugins/sentry.mdx

```text
---
title: Sentry Plugin
label: Sentry
order: 90
desc: Integrate Sentry error tracking into your Payload application
keywords: plugins, sentry, error, tracking, monitoring, logging, bug, reporting, performance
---

![https://www.npmjs.com/package/@payloadcms/plugin-sentry](https://img.shields.io/npm/v/@payloadcms/plugin-sentry)

This plugin allows you to integrate [Sentry](https://sentry.io/) seamlessly with your [Payload](https://github.com/payloadcms/payload) application.

## What is Sentry?

Sentry is a powerful error tracking and performance monitoring tool that helps developers identify, diagnose, and resolve issues in their applications.

<Banner type="success">
  Sentry does smart stuff with error data to make bugs easier to find and fix. -
  [sentry.io](https://sentry.io/)
</Banner>

This multi-faceted software offers a range of features that will help you manage errors with greater ease and ultimately ensure your application is running smoothly:

## Core Features

- **Error Tracking**: Instantly captures and logs errors as they occur in your application
- **Performance Monitoring**: Tracks application performance to identify slowdowns and bottlenecks
- **Detailed Reports**: Provides comprehensive insights into errors, including stack traces and context
- **Alerts and Notifications**: Send and customize event-triggered notifications
- **Issue Grouping, Filtering and Search**: Automatically groups similar errors, and allows filtering and searching issues by custom criteria
- **Breadcrumbs**: Records user actions and events leading up to an error
- **Integrations**: Connects with various tools and services for enhanced workflow and issue management

<Banner type="info">
  This plugin is completely open-source and the [source code can be found
  here](https://github.com/payloadcms/payload/tree/main/packages/plugin-sentry).
  If you need help, check out our [Community
  Help](https://payloadcms.com/community-help). If you think you've found a bug,
  please [open a new
  issue](https://github.com/payloadcms/payload/issues/new?assignees=&labels=plugin%3A%20seo&template=bug_report.md&title=plugin-sentry%3A)
  with as much detail as possible.
</Banner>

## Installation

Install the plugin using any JavaScript package manager like [pnpm](https://pnpm.io), [npm](https://npmjs.com), or [Yarn](https://yarnpkg.com):

```bash
  pnpm add @payloadcms/plugin-sentry
```

## Sentry for Next.js setup

This plugin requires to complete the [Sentry + Next.js setup](https://docs.sentry.io/platforms/javascript/guides/nextjs/) before.

You can use either the [automatic setup](https://docs.sentry.io/platforms/javascript/guides/nextjs/#install) with the installation wizard:

```sh
npx @sentry/wizard@latest -i nextjs
```

Or the [Manual Setup](https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/)

## Basic Usage

In the `plugins` array of your [Payload Config](https://payloadcms.com/docs/configuration/overview), call the plugin and pass in your Sentry DSN as an option.

```ts
import { buildConfig } from 'payload'
import { sentryPlugin } from '@payloadcms/plugin-sentry'
import { Pages, Media } from './collections'

import * as Sentry from '@sentry/nextjs'

const config = buildConfig({
  collections: [Pages, Media],
  plugins: [sentryPlugin({ Sentry })],
})

export default config
```

## Instrumenting Database Queries

If you want Sentry to capture Postgres query performance traces, you need to inject the Sentry-patched `pg` driver into the Postgres adapter. This ensures Sentry’s instrumentation hooks into your database calls.

```ts
import * as Sentry from '@sentry/nextjs'
import { buildConfig } from 'payload'
import { sentryPlugin } from '@payloadcms/plugin-sentry'
import { postgresAdapter } from '@payloadcms/db-postgres'
import pg from 'pg'

export default buildConfig({
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL },
    pg, // Inject the patched pg driver for Sentry instrumentation
  }),
  plugins: [sentryPlugin({ Sentry })],
})
```

## Options

- `Sentry` : Sentry | **required**

  The `Sentry` instance

<Banner type="warning">
  Make sure to complete the [Sentry for Next.js Setup](#sentry-for-nextjs-setup)
  before.
</Banner>

- `enabled`: boolean | optional

  Set to false to disable the plugin. Defaults to `true`.

- `context`: `(args: ContextArgs) => Partial<ScopeContext> | Promise<Partial<ScopeContext>>`

  Pass additional [contextual data](https://docs.sentry.io/platforms/javascript/enriching-events/context/#passing-context-directly) to Sentry

- `captureErrors`: number[] | optional

  By default, `Sentry.errorHandler` will capture only errors with a status code of 500 or higher. To capture additional error codes, pass the values as numbers in an array.

### Example

Configure any of these options by passing them to the plugin:

```ts
import { buildConfig } from 'payload'
import { sentryPlugin } from '@payloadcms/plugin-sentry'

import * as Sentry from '@sentry/nextjs'

import { Pages, Media } from './collections'

const config = buildConfig({
  collections: [Pages, Media],
  plugins: [
    sentryPlugin({
      options: {
        captureErrors: [400, 403],
        context: ({ defaultContext, req }) => {
          return {
            ...defaultContext,
            tags: {
              locale: req.locale,
            },
          }
        },
        debug: true,
      },
      Sentry,
    }),
  ],
})

export default config
```

## TypeScript

All types can be directly imported:

```ts
import { PluginOptions } from '@payloadcms/plugin-sentry'
```
```

--------------------------------------------------------------------------------

---[FILE: seo.mdx]---
Location: payload-main/docs/plugins/seo.mdx

```text
---
description: Manage SEO metadata from your Payload admin
keywords: plugins, seo, meta, search, engine, ranking, google
label: SEO
order: 100
title: SEO Plugin
---

![https://www.npmjs.com/package/@payloadcms/plugin-seo](https://img.shields.io/npm/v/@payloadcms/plugin-seo)

This plugin allows you to easily manage SEO metadata for your application from within your [Admin Panel](../admin/overview). When enabled on your [Collections](../configuration/collections) and [Globals](../configuration/globals), it adds a new `meta` field group containing `title`, `description`, and `image` by default. Your front-end application can then use this data to render meta tags however your application requires. For example, you would inject a `title` tag into the `<head>` of your page using `meta.title` as its content.

As users are editing documents within the Admin Panel, they have the option to "auto-generate" these fields. When clicked, this plugin will execute your own custom functions that re-generate the title, description, and image. This way you can build your own SEO writing assistance directly into your application. For example, you could append your site name onto the page title, or use the document's excerpt field as the description, or even integrate with some third-party API to generate the image using AI.

To help you visualize what your page might look like in a search engine, a preview is rendered on the page just beneath the meta fields. This preview is updated in real-time as you edit your metadata. There are also visual indicators to help you write effective meta, such as a character counter for the title and description fields. You can even inject your own custom fields into the `meta` field group as your application requires, like `og:title` or `json-ld`. If you've ever used something like Yoast SEO, this plugin might feel very familiar.

<Banner type="info">
  This plugin is completely open-source and the [source code can be found
  here](https://github.com/payloadcms/payload/tree/main/packages/plugin-seo). If
  you need help, check out our [Community
  Help](https://payloadcms.com/community-help). If you think you've found a bug,
  please [open a new
  issue](https://github.com/payloadcms/payload/issues/new?assignees=&labels=plugin%3A%20seo&template=bug_report.md&title=plugin-seo%3A)
  with as much detail as possible.
</Banner>

## Core features

- Adds a `meta` field group to every SEO-enabled collection or global
- Allows you to define custom functions to auto-generate metadata
- Displays hints and indicators to help content editors write effective meta
- Renders a snippet of what a search engine might display
- Extendable so you can define custom fields like `og:title` or `json-ld`
- Soon will support dynamic variable injection

## Installation

Install the plugin using any JavaScript package manager like [pnpm](https://pnpm.io), [npm](https://npmjs.com), or [Yarn](https://yarnpkg.com):

```bash
  pnpm add @payloadcms/plugin-seo
```

## Basic Usage

In the `plugins` array of your [Payload Config](../configuration/overview), call the plugin with [options](#options):

```ts
import { buildConfig } from 'payload';
import { seoPlugin } from '@payloadcms/plugin-seo';

const config = buildConfig({
  collections: [
    {
      slug: 'pages',
      fields: []
    },
    {
      slug: 'media',
      upload: {
        staticDir: // path to your static directory,
      },
      fields: []
    }
  ],
  plugins: [
    seoPlugin({
      collections: [
        'pages',
      ],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => `Website.com — ${doc.title}`,
      generateDescription: ({ doc }) => doc.excerpt
    })
  ]
});

export default config;
```

### Options

##### `collections`

An array of collections slugs to enable SEO. Enabled collections receive a `meta` field which is an object of title, description, and image subfields.

##### `globals`

An array of global slugs to enable SEO. Enabled globals receive a `meta` field which is an object of title, description, and image subfields.

##### `fields`

A function that takes in the default fields via an object and expects an array of fields in return. You can use this to modify existing fields or add new ones.

```ts
// payload.config.ts
{
  // ...
  seoPlugin({
    fields: ({ defaultFields }) => [
      ...defaultFields,
      {
        name: 'customField',
        type: 'text',
      },
    ],
  })
}
```

##### `uploadsCollection`

Set the `uploadsCollection` to your application's upload-enabled collection slug. This is used to provide an `image` field on the `meta` field group.

##### `tabbedUI`

When the `tabbedUI` property is `true`, it appends an `SEO` tab onto your config using Payload's [Tabs Field](../fields/tabs). If your collection is not already tab-enabled, meaning the first field in your config is not of type `tabs`, then one will be created for you called `Content`. Defaults to `false`.
Note that the order of plugins or fields in your config may affect whether or not the plugin can smartly merge tabs with your existing fields. If you have a complex structure we recommend you [make use of the fields directly](#direct-use-of-fields) instead of relying on this config option.

<Banner type="info">
  If you wish to continue to use top-level or sidebar fields with `tabbedUI`,
  you must not let the default `Content` tab get created for you (see the note
  above). Instead, you must define the first field of your config with type
  `tabs` and place all other fields adjacent to this one.
</Banner>

##### `generateTitle`

A function that allows you to return any meta title, including from the document's content.

```ts
// payload.config.ts
{
  // ...
  seoPlugin({
    generateTitle: ({ doc }) => `Website.com — ${doc?.title}`,
  })
}
```

All "generate" functions receive the following arguments:

| Argument                   | Description                                                           |
| -------------------------- | --------------------------------------------------------------------- |
| **`collectionConfig`**     | The configuration of the collection.                                  |
| **`collectionSlug`**       | The slug of the collection.                                           |
| **`doc`**                  | The data of the current document.                                     |
| **`docPermissions`**       | The permissions of the document.                                      |
| **`globalConfig`**         | The configuration of the global.                                      |
| **`globalSlug`**           | The slug of the global.                                               |
| **`hasPublishPermission`** | Whether the user has permission to publish the document.              |
| **`hasSavePermission`**    | Whether the user has permission to save the document.                 |
| **`id`**                   | The ID of the document.                                               |
| **`initialData`**          | The initial data of the document.                                     |
| **`initialState`**         | The initial state of the document.                                    |
| **`locale`**               | The locale of the document.                                           |
| **`preferencesKey`**       | The preferences key of the document.                                  |
| **`publishedDoc`**         | The published document.                                               |
| **`req`**                  | The Payload request object containing `user`, `payload`, `i18n`, etc. |
| **`title`**                | The title of the document.                                            |
| **`versionsCount`**        | The number of versions of the document.                               |

##### `generateDescription`

A function that allows you to return any meta description, including from the document's content.

```ts
// payload.config.ts
{
  // ...
  seoPlugin({
    generateDescription: ({ doc }) => doc?.excerpt,
  })
}
```

For a full list of arguments, see the [`generateTitle`](#generatetitle) function.

##### `generateImage`

A function that allows you to return any meta image, including from the document's content.

```ts
// payload.config.ts
{
  // ...
  seoPlugin({
    generateImage: ({ doc }) => doc?.featuredImage,
  })
}
```

For a full list of arguments, see the [`generateTitle`](#generatetitle) function.

##### `generateURL`

A function called by the search preview component to display the actual URL of your page.

```ts
// payload.config.ts
{
  // ...
  seoPlugin({
    generateURL: ({ doc, collectionSlug }) =>
      `https://yoursite.com/${collectionSlug}/${doc?.slug}`,
  })
}
```

For a full list of arguments, see the [`generateTitle`](#generatetitle) function.

#### `interfaceName`

Rename the meta group interface name that is generated for TypeScript and GraphQL.

```ts
// payload.config.ts
{
  // ...
  seoPlugin({
    interfaceName: 'customInterfaceNameSEO',
  })
}
```

## Direct use of fields

There is the option to directly import any of the fields from the plugin so that you can include them anywhere as needed.

<Banner type="info">
  You will still need to configure the plugin in the Payload Config in order to
  configure the generation functions. Since these fields are imported and used
  directly, they don't have access to the plugin config so they may need
  additional arguments to work the same way.
</Banner>

```ts
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

// Used as fields
MetaImageField({
  // the upload collection slug
  relationTo: 'media',

  // if the `generateImage` function is configured
  hasGenerateFn: true,
})

MetaDescriptionField({
  // if the `generateDescription` function is configured
  hasGenerateFn: true,
})

MetaTitleField({
  // if the `generateTitle` function is configured
  hasGenerateFn: true,
})

PreviewField({
  // if the `generateUrl` function is configured
  hasGenerateFn: true,

  // field paths to match the target field for data
  titlePath: 'meta.title',
  descriptionPath: 'meta.description',
})

OverviewField({
  // field paths to match the target field for data
  titlePath: 'meta.title',
  descriptionPath: 'meta.description',
  imagePath: 'meta.image',
})
```

<Banner type="info">
  Tip: You can override the length rules by changing the minLength and maxLength
  props on the fields. In the case of the OverviewField you can use
  `titleOverrides` and `descriptionOverrides` to override the length rules.
</Banner>

## TypeScript

All types can be directly imported:

```ts
import type {
  PluginConfig,
  GenerateTitle,
  GenerateDescription
  GenerateURL
} from '@payloadcms/plugin-seo/types';
```

You can then pass the collections from your generated Payload types into the generation types, for example:

```ts
import type { Page } from './payload-types.ts'

import type { GenerateTitle } from '@payloadcms/plugin-seo/types'

const generateTitle: GenerateTitle<Page> = async ({ doc, locale }) => {
  return `Website.com — ${doc?.title}`
}
```

## Examples

The [Templates Directory](https://github.com/payloadcms/payload/tree/main/templates) contains an official [Website Template](https://github.com/payloadcms/payload/tree/main/templates/website) and [E-commerce Template](https://github.com/payloadcms/payload/tree/main/templates/ecommere) which demonstrates exactly how to configure this plugin in Payload and implement it on your front-end.

## Screenshots

![image](https://user-images.githubusercontent.com/70709113/163850633-f3da5f8e-2527-4688-bc79-17233307a883.png)
```

--------------------------------------------------------------------------------

````
