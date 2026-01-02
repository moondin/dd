---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 51
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 51 of 695)

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
Location: payload-main/docs/performance/overview.mdx

```text
---
title: Performance
label: Overview
order: 10
desc: Ensure your Payload app runs as quickly and efficiently as possible.
keywords: performance, optimization, indexes, depth, select, block references, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

Payload is designed with performance in mind, but its customizability means that there are many ways to configure your app that can impact performance.

With this in mind, Payload provides several options and best practices to help you optimize your app's specific performance needs. This includes the database, APIs, and Admin Panel.

Whether you're building an app or troubleshooting an existing one, follow these guidelines to ensure that it runs as quickly and efficiently as possible.

## Building your application

### Database proximity

The proximity of your database to your server can significantly impact performance. Ensure that your database is hosted in the same region as your server to minimize latency and improve response times.

### Indexing your fields

If a particular field is queried often, build an [Index](../database/indexes) for that field to produce faster queries.

When your query runs, the database will not search the entire document to find that one field, but will instead use the index to quickly locate the data.

To learn more, see the [Indexes](../database/indexes) docs.

### Querying your data

There are several ways to optimize your [Queries](../queries/overview). Many of these options directly impact overall database overhead, response sizes, and/or computational load and can significantly improve performance.

When building queries, combine as many of these options together as possible. This will ensure your queries are as efficient as they can be.

To learn more, see the [Query Performance](../queries/overview#performance) docs.

### Optimizing your APIs

When querying data through Payload APIs, the request lifecycle includes running hooks, access control, validations, and other operations that can add significant overhead to the request.

To optimize your APIs, any custom logic should be as efficient as possible. This includes writing lightweight hooks, preventing memory leaks, offloading long-running tasks, and optimizing custom validations.

To learn more, see the [Hooks Performance](../hooks/overview#performance) docs.

### Writing efficient validations

If your validation functions are asynchronous or computationally heavy, ensure they only run when necessary.

To learn more, see the [Validation Performance](../fields/overview#validation-performance) docs.

### Optimizing custom components

When building custom components in the Admin Panel, ensure that they are as efficient as possible. This includes using React best practices such as memoization, lazy loading, and avoiding unnecessary re-renders.

To learn more, see the [Custom Components Performance](../admin/custom-components#performance) docs.

## Other Best Practices

### Block references

Use [Block References](../fields/blocks#block-references) to share the same block across multiple fields without bloating the config. This will reduce the number of fields to traverse when processing permissions, etc. and can significantly reduce the amount of data sent from the server to the client in the Admin Panel.

For example, if you have a block that is used in multiple fields, you can define it once and reference it in each field.

To do this, use the `blockReferences` option in your blocks field:

```ts
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  blocks: [
    {
      slug: 'TextBlock',
      fields: [
        {
          name: 'text',
          type: 'text',
        },
      ],
    },
  ],
  collections: [
    {
      slug: 'posts',
      fields: [
        {
          name: 'content',
          type: 'blocks',
          // highlight-start
          blockReferences: ['TextBlock'],
          blocks: [], // Required to be empty, for compatibility reasons
          // highlight-end
        },
      ],
    },
    {
      slug: 'pages',
      fields: [
        {
          name: 'content',
          type: 'blocks',
          // highlight-start
          blockReferences: ['TextBlock'],
          blocks: [], // Required to be empty, for compatibility reasons
          // highlight-end
        },
      ],
    },
  ],
})
```

### Using the cached Payload instance

Ensure that you do not instantiate Payload unnecessarily. Instead, Payload provides a caching mechanism to reuse the same instance across your app.

To do this, use the `getPayload` function to get the cached instance of Payload:

```ts
import { getPayload } from 'payload'
import config from '@payload-config'

const myFunction = async () => {
  const payload = await getPayload({ config })

  // use payload here
}
```

### When to make direct-to-db calls

<Banner type="warning">
  **Warning:** Direct database calls bypass all hooks and validations. Only use
  this method when you are certain that the operation is safe and does not
  require any of these features.
</Banner>

Making direct database calls can significantly improve performance by bypassing much of the request lifecycle such as hooks, validations, and other overhead associated with Payload APIs.

For example, this can be especially useful for the `update` operation, where Payload would otherwise need to make multiple API calls to fetch, update, and fetch again. Making a direct database call can reduce this to a single operation.

To do this, use the `payload.db` methods:

```ts
await payload.db.updateOne({
  collection: 'posts',
  id: post.id,
  data: {
    title: 'New Title',
  },
})
```

<Banner type="warning">
  **Note:** Direct database methods do not start a
  [transaction](../database/transactions). You have to start that yourself.
</Banner>

#### Returning

To prevent unnecessary database computation and reduce the size of the response, you can also set `returning: false` in your direct database calls if you don't need the updated document returned to you.

```ts
await payload.db.updateOne({
  collection: 'posts',
  id: post.id,
  data: { title: 'New Title' }, // See note above ^ about Postgres
  // highlight-start
  returning: false,
  // highlight-end
})
```

<Banner type="warning">
  **Note:** The `returning` option is only available on direct-to-db methods.
  E.g. those on the `payload.db` object. It is not exposed to the Local API.
</Banner>

### Avoid bundling the entire UI library in your front-end

If your front-end imports from `@payloadcms/ui`, ensure that you do not bundle the entire package as this can significantly increase your bundle size.

To do this, import using the full path to the specific component you need:

```ts
import { Button } from '@payloadcms/ui/elements/Button'
```

Custom components within the Admin Panel, however, do not have this same restriction and can import directly from `@payloadcms/ui`:

```ts
import { Button } from '@payloadcms/ui'
```

<Banner type="success">
  **Tip:** Use
  [`@next/bundle-analyzer`](https://nextjs.org/docs/app/guides/package-bundling)
  to analyze your component tree and identify unnecessary re-renders or large
  components that could be optimized.
</Banner>

## Optimizing local development

Everything mentioned above applies to local development as well, but there are a few additional steps you can take to optimize your local development experience.

### Enable Turbopack

<Banner type="warning">
  **Note:** In the future this will be the default. Use at your own risk.
</Banner>

Add `--turbo` to your dev script to significantly speed up your local development server start time.

```json
{
  "scripts": {
    "dev": "next dev --turbo"
  }
}
```

### Only bundle server packages in production

<Banner type="warning">
  **Note:** This is enabled by default in `create-payload-app` since v3.28.0. If
  you created your app after this version, you don't need to do anything.
</Banner>

By default, Next.js bundles both server and client code. However, during development, bundling certain server packages isn't necessary.

Payload has thousands of modules, slowing down compilation.

Setting this option skips bundling Payload server modules during development. Fewer files to compile means faster compilation speeds.

To do this, add the `devBundleServerPackages` option to `withPayload` in your `next.config.js` file:

```ts
const nextConfig = {
  // your existing next config
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
```
```

--------------------------------------------------------------------------------

---[FILE: build-your-own.mdx]---
Location: payload-main/docs/plugins/build-your-own.mdx

```text
---
title: Building Your Own Plugin
label: Build Your Own
order: 20
desc: Starting to build your own plugin? Find everything you need and learn best practices with the Payload plugin template.
keywords: plugins, template, config, configuration, extensions, custom, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

Building your own [Payload Plugin](./overview) is easy, and if you're already familiar with Payload then you'll have everything you need to get started. You can either start from scratch or use the [Plugin Template](#plugin-template) to get up and running quickly.

<Banner type="success">
  To use the template, run `npx create-payload-app@latest --template plugin`
  directly in your terminal.
</Banner>

Our plugin template includes everything you need to build a full life-cycle plugin:

- Example files and functions for extending the Payload Config
- A local dev environment to develop the plugin
- Test suite with integrated GitHub workflow

By abstracting your code into a plugin, you'll be able to reuse your feature across multiple projects and make it available for other developers to use.

## Plugins Recap

Here is a brief recap of how to integrate plugins with Payload, to learn more head back to the [plugin overview page](https://payloadcms.com/docs/plugins/overview).

### How to install a plugin

To install any plugin, simply add it to your Payload Config in the plugins array.

```
import samplePlugin from 'sample-plugin';

const config = buildConfig({
  plugins: [
    // Add plugins here
    samplePlugin({
		enabled: true,
    }),
  ],
});

export default config;
```

### Initialization

The initialization process goes in the following order:

1. Incoming config is validated
2. Plugins execute
3. Default options are integrated
4. Sanitization cleans and validates data
5. Final config gets initialized

## Plugin Template

In the [Payload Plugin Template](https://github.com/payloadcms/payload/tree/main/templates/plugin), you will see a common file structure that is used across plugins:

1. `/` root folder - general configuration
2. `/src` folder - everything related to the plugin
3. `/dev` folder - sanitized test project for development

### The root folder

In the root folder, you will see various files related to the configuration of the plugin. We set up our environment in a similar manner in Payload core and across other projects. The only two files you need to modify are:

- **README**.md - This contains instructions on how to use the template. When you are ready, update this to contain instructions on how to use your Plugin.
- **package**.json - Contains necessary scripts and dependencies. Overwrite the metadata in this file to describe your Plugin.

### The dev folder

The purpose of the **dev** folder is to provide a sanitized local Payload project so you can run and test your plugin while you are actively developing it.

Do **not** store any of the plugin functionality in this folder - it is purely an environment to _assist_ you with developing the plugin.

If you're starting from scratch, you can easily setup a dev environment like this:

```
mkdir dev
cd dev
npx create-payload-app@latest
```

If you're using the plugin template, the dev folder is built out for you and the `samplePlugin` has already been installed in `dev/payload.config.ts`.

```
  plugins: [
    // when you rename the plugin or add options, make sure to update it here
    samplePlugin({
      enabled: false,
    })
  ]
```

You can add to the `dev/payload.config.ts` and build out the dev project as needed to test your plugin.

When you're ready to start development, navigate into this folder with `cd dev`

And then start the project with `pnpm dev` and pull up `http://localhost:3000` in your browser.

## Testing

Another benefit of the dev folder is that you have the perfect environment established for testing.

A good test suite is essential to ensure quality and stability in your plugin. Payload typically uses [Jest](https://jestjs.io/); a popular testing framework, widely used for testing JavaScript and particularly for applications built with React.

Jest organizes tests into test suites and cases. We recommend creating tests based on the expected behavior of your plugin from start to finish. Read more about tests in the [Jest documentation.](https://jestjs.io/)

The plugin template provides a stubbed out test suite at `dev/plugin.spec.ts` which is ready to go - just add in your own test conditions and you're all set!

```
let payload: Payload

describe('Plugin tests', () => {
  // Example test to check for seeded data
  it('seeds data accordingly', async () => {
    const newCollectionQuery = await payload.find({
      collection: 'newCollection',
      sort: 'createdAt',
    })

    newCollection = newCollectionQuery.docs

    expect(newCollectionQuery.totalDocs).toEqual(1)
  })
})
```

## Seeding data

For development and testing, you will likely need some data to work with. You can streamline this process by seeding and dropping your database - instead of manually entering data.

In the plugin template, you can navigate to `dev/src/server.ts` and see an example seed function.

```
if (process.env.PAYLOAD_SEED === 'true') {
    await seed(payload)
}
```

A sample seed function has been created for you at `dev/src/seed`, update this file with additional data as needed.

```
export const seed = async (payload: Payload): Promise<void> => {
  payload.logger.info('Seeding data...')

  await payload.create({
    collection: 'new-collection',
    data: {
      title: 'Seeded title',
    },
  })

  // Add additional seed data here
}

```

## Building a Plugin

Now that we have our environment setup and dev project ready to go - it's time to build the plugin!

```
import type { Config } from 'payload'

export const samplePlugin =
  (pluginOptions: PluginTypes) =>
  (incomingConfig: Config): Config => {
    // create copy of incoming config
    let config = { ...incomingConfig }

    /**
    * This is where you could modify the
    * config based on the plugin options
    */

    // If you wanted to add a new collection:
    config.collections = [
      ...(config.collections || []),
      newCollection,
    ]

    // If you wanted to add a new global:
    config.globals = [
      ...(config.globals || []),
      newGlobal,
    ]

    /**
    * If you wanted to add a new field to a collection:
    *
    * 1. Loop over collections
    * 2. Find the collection you want to add the field to
    * 3. Add the field to the collection
    */

    // If you wanted to add to the onInit:
    config.onInit = async payload => {
      if (incomingConfig.onInit) await incomingConfig.onInit(payload)
      // Add additional onInit code here
    }

    // Finally, return the modified config
    return config
 }
```

To reiterate, the essence of a [Payload Plugin](./overview) is simply to extend the [Payload Config](../configuration/overview) - and that is exactly what we are doing in this file.

### Spread syntax

[Spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) (or the spread operator) is a feature in JavaScript that uses the dot notation **(...)** to spread elements from arrays, strings, or objects into various contexts.

We are going to use spread syntax to allow us to add data to existing arrays without losing the existing data. It is crucial to spread the existing data correctly, else this can cause adverse behavior and conflicts with Payload Config and other plugins.

Let's say you want to build a plugin that adds a new collection:

```
config.collections = [
  ...(config.collections || []),
 newCollection,
  // Add additional collections here
]
```

First, you need to spread the `config.collections` to ensure that we don't lose the existing collections. Then you can add any additional collections, just as you would in a regular Payload Config.

This same logic is applied to other array and object like properties such as admin, globals and hooks:

```
config.globals = [
  ...(config.globals || []),
  // Add additional globals here
]

config.hooks = {
  ...(config.hooks || {}),
  // Add additional hooks here
}
```

### Extending functions

Function properties cannot use spread syntax. The way to extend them is to execute the existing function if it exists and then run your additional functionality.

Here is an example extending the `onInit` property:

```
config.onInit = async payload => {
  if (incomingConfig.onInit) await incomingConfig.onInit(payload)

  // Add additional onInit code by using the onInitExtension function
  onInitExtension(pluginOptions, payload)
}
```

## Types

If your plugin has options, you should define and provide types for these options in a separate file which gets exported from the main `index.ts`.

```
export interface PluginTypes {
  /**
   * Enable or disable plugin
   * @default false
   */
  enabled?: boolean
}

```

If possible, include [JSDoc comments](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#types-1) to describe the options and their types. This allows a developer to see details about the options in their editor.

## Best practices

In addition to the setup covered above, here are other best practices to follow:

### Providing an enable / disable option

For a better user experience, provide a way to disable the plugin without uninstalling it.

### Include tests in your GitHub CI workflow

If you've configured tests for your package, integrate them into your workflow to run the tests each time you commit to the plugin repository. Learn more about [how to configure tests into your GitHub CI workflow.](https://docs.github.com/en/actions/use-cases-and-examples/building-and-testing/building-and-testing-nodejs)

### Publish your finished plugin to npm

The best way to share and allow others to use your plugin once it is complete is to publish an npm package. This process is straightforward and well documented, find out more about [creating and publishing a npm package here](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages/).

### Add payload-plugin topic tag

Apply the tag **payload-plugin** to your GitHub repository. This will boost the visibility of your plugin and ensure it gets listed with [existing Payload plugins](https://github.com/topics/payload-plugin).

### Use Semantic Versioning (SemVer)

With the [Semantic Versioning](https://semver.org/) (SemVer) system you release version numbers that reflect the nature of changes (major, minor, patch). Ensure all major versions reference their Payload compatibility.
```

--------------------------------------------------------------------------------

````
