---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 42
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 42 of 695)

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

---[FILE: installation.mdx]---
Location: payload-main/docs/getting-started/installation.mdx

```text
---
title: Installation
label: Installation
order: 30
desc: To quickly get started with Payload, simply run npx create-payload-app or install from scratch.
keywords: documentation, getting started, guide, Content Management System, cms, headless, javascript, node, react, nextjs
---

## Software Requirements

Payload requires the following software:

- Any JavaScript package manager (pnpm, npm, or yarn - pnpm is preferred)
- Node.js version 20.9.0+
- Any [compatible database](/docs/database/overview) (MongoDB, Postgres or SQLite)

<Banner type="warning">
  **Important:** Before proceeding any further, please ensure that you have the
  above requirements met.
</Banner>

## Quickstart with create-payload-app

To quickly scaffold a new Payload app in the fastest way possible, you can use [create-payload-app](https://npmjs.com/package/create-payload-app). To do so, run the following command:

```
npx create-payload-app
```

Then just follow the prompts! You'll get set up with a new folder and a functioning Payload app inside. You can then start [configuring your application](../configuration/overview).

## Adding to an existing app

Adding Payload to an existing Next.js app is super straightforward. You can either run the `npx create-payload-app` command inside your Next.js project's folder, or manually install Payload by following the steps below.

If you don't have a Next.js app already, but you still want to start a project from a blank Next.js app, you can create a new Next.js app using `npx create-next-app` - and then just follow the steps below to install Payload.

<Banner type="info">
  **Note:** Next.js version 15 or higher is required for Payload.
</Banner>

#### 1. Install the relevant packages

First, you'll want to add the required Payload packages to your project and can do so by running the command below:

```bash
pnpm i payload @payloadcms/next @payloadcms/richtext-lexical sharp graphql
```

<Banner type="warning">
  **Note:** Swap out `pnpm` for your package manager. If you are using npm, you
  might need to install using legacy peer deps: `npm i --legacy-peer-deps`.
</Banner>

Next, install a [Database Adapter](/docs/database/overview). Payload requires a Database Adapter to establish a database connection. Payload works with all types of databases, but the most common are MongoDB and Postgres.

To install a Database Adapter, you can run **one** of the following commands:

- To install the [MongoDB Adapter](../database/mongodb), run:

  ```bash
  pnpm i @payloadcms/db-mongodb
  ```

- To install the [Postgres Adapter](../database/postgres), run:

  ```bash
  pnpm i @payloadcms/db-postgres
  ```

- To install the [SQLite Adapter](../database/sqlite), run:
  ```bash
  pnpm i @payloadcms/db-sqlite
  ```

<Banner type="success">
  **Note:** New [Database Adapters](/docs/database/overview) are becoming
  available every day. Check the docs for the most up-to-date list of what's
  available.
</Banner>

#### 2. Copy Payload files into your Next.js app folder

Payload installs directly in your Next.js `/app` folder, and you'll need to place some files into that folder for Payload to run. You can copy these files from the [Blank Template](https://github.com/payloadcms/payload/tree/main/templates/blank/src/app/%28payload%29) on GitHub. Once you have the required Payload files in place in your `/app` folder, you should have something like this:

```plaintext
app/
├─ (payload)/
├── // Payload files
├─ (my-app)/
├── // Your app files
```

_For an exact reference of the `(payload)` directory, see [Project Structure](../admin/overview#project-structure)._

<Banner type="warning">
  You may need to copy all of your existing frontend files, including your
  existing root layout, into its own newly created [Route
  Group](https://nextjs.org/docs/app/building-your-application/routing/route-groups),
  i.e. `(my-app)`.
</Banner>

The files that Payload needs to have in your `/app` folder do not regenerate, and will never change. Once you slot them in, you never have to revisit them. They are not meant to be edited and simply import Payload dependencies from `@payloadcms/next` for the REST / GraphQL API and Admin Panel.

You can name the `(my-app)` folder anything you want. The name does not matter and will just be used to clarify your directory structure for yourself. Common names might be `(frontend)`, `(app)`, or similar. [More details](../admin/overview).

#### 3. Add the Payload Plugin to your Next.js config

Payload has a Next.js plugin that it uses to ensure compatibility with some of the packages Payload relies on, like `mongodb` or `drizzle-kit`.

To add the Payload Plugin, use `withPayload` in your `next.config.js`:

```js
import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  experimental: {
    reactCompiler: false,
  },
}

// Make sure you wrap your `nextConfig`
// with the `withPayload` plugin
export default withPayload(nextConfig) // highlight-line
```

<Banner type="warning">
  **Important:** Payload is a fully ESM project, and that means the
  `withPayload` function is an ECMAScript module.
</Banner>

To import the Payload Plugin, you need to make sure your `next.config` file is set up to use ESM.

You can do this in one of two ways:

1. Set your own project to use ESM, by adding `"type": "module"` to your `package.json` file
2. Give your Next.js config the `.mjs` file extension

In either case, all `require`s and `export`s in your `next.config` file will need to be converted to `import` / `export` if they are not set up that way already.

#### 4. Create a Payload Config and add it to your TypeScript config

Finally, you need to create a [Payload Config](../configuration/overview). Generally the Payload Config is located at the root of your repository, or next to your `/app` folder, and is named `payload.config.ts`.

Here's what Payload needs at a bare minimum:

```ts
import sharp from 'sharp'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { buildConfig } from 'payload'

export default buildConfig({
  // If you'd like to use Rich Text, pass your editor here
  editor: lexicalEditor(),

  // Define and configure your collections in this array
  collections: [],

  // Your Payload secret - should be a complex and secure string, unguessable
  secret: process.env.PAYLOAD_SECRET || '',
  // Whichever Database Adapter you're using should go here
  // Mongoose is shown as an example, but you can also use Postgres
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  // If you want to resize images, crop, set focal point, etc.
  // make sure to install it and pass it to the config.
  // This is optional - if you don't need to do these things,
  // you don't need it!
  sharp,
})
```

Although this is just the bare minimum config, there are _many_ more options that you can control here. To reference the full config and all of its options, [click here](/docs/configuration/overview).

Once you have a Payload Config, update your `tsconfig` to include a `path` that points to it:

```json
{
  "compilerOptions": {
    "paths": {
      "@payload-config": ["./payload.config.ts"]
    }
  }
}
```

#### 5. Fire it up!

After you've reached this point, it's time to boot up Payload. Start your project in your application's folder to get going. By default, the Next.js dev script is `pnpm dev` (or `npm run dev` if using npm).

After it starts, you can go to `http://localhost:3000/admin` to create your first Payload user!
```

--------------------------------------------------------------------------------

---[FILE: what-is-payload.mdx]---
Location: payload-main/docs/getting-started/what-is-payload.mdx

```text
---
title: What is Payload?
label: What is Payload?
order: 10
desc: Payload is a next-gen application framework that can be used as a Content Management System, enterprise tool framework, headless commerce platform, or digital asset management tool.
keywords: documentation, getting started, guide, Content Management System, cms, headless, javascript, node, react
---

<YouTube
  id="ftohATkHBi0"
  title="Introduction to Payload — The open-source Next.js backend"
/>

**Payload is the Next.js fullstack framework.** Write a Payload Config and instantly get:

- A full Admin Panel using React server / client components, matching the shape of your data and completely extensible with your own React components
- Automatic database schema, including direct DB access and ownership, with migrations, transactions, proper indexing, and more
- Instant REST, GraphQL, and straight-to-DB Node.js APIs
- Authentication which can be used in your own apps
- A deeply customizable access control pattern
- File storage and image management tools like cropping / focal point selection
- Live preview - see your frontend render content changes in realtime as you update
- Lots more

### Instant backend superpowers

No matter what you're building, Payload will give you backend superpowers. Your entire Payload config can be installed in one line into any existing Next.js app, and is designed to catapult your development process. Payload takes the most complex and time-consuming parts of any modern web app and makes them simple.

### Open source - deploy anywhere, including Vercel

It's fully open source with an MIT license and you can self-host anywhere that you can run a Node.js app. You can also deploy serverless to hosts like Vercel, right inside your existing Next.js application.

### Code-first and version controlled

In Payload, there are no "click ops" - as in clicking around in an Admin Panel to define your schema. In Payload, everything is done the right way—code-first and version controlled like a proper backend. But once developers define how Payload should work, non-technical users can independently make use of its Admin Panel to manage whatever they need to without having to know code whatsoever.

### Fully extensible

Even in spite of how much you get out of the box, you still have full control over every aspect of your app - be it database, admin UI, or anything else. Every part of Payload has been designed to be extensible and customizable with modern TypeScript / React. And you'll fully understand the code that you write.

## Use Cases

Payload started as a headless Content Management System (CMS), but since, we've seen our community leverage Payload in ways far outside of simply managing pages and blog posts. It's grown into a full-stack TypeScript app framework.

Large enterprises use Payload to power significant internal tools, retailers power their entire storefronts without the need for headless Shopify, and massive amounts of digital assets are stored + managed within Payload. Of course, websites large and small still use Payload for content management as well.

### Headless CMS

The biggest barrier in large web projects cited by marketers is engineering. On the flip side, engineers say the opposite. This is a big problem that has yet to be solved even though we have countless CMS options.

Payload has restored a little love back into the dev / marketer equation with features like Live Preview, redirects, form builders, visual editing, static A/B testing, and more. But even with all this focus on marketing efficiency, we aren't compromising on the developer experience. That way engineers and marketers alike can be proud of the products they build.

If you're building a website and your frontend is on Next.js, then Payload is a no-brainer.

<Banner type="success">
  Instead of going out and signing up for a SaaS vendor that makes it so you
  have to manage two completely separate concerns, with little to no native
  connection back and forth, just install Payload in your existing Next.js repo
  and instantly get a full CMS.
</Banner>

Get started with Payload as a CMS using our official Website template:

```
npx create-payload-app@latest -t website
```

### Enterprise Tool

When a large organization starts up a new software initiative, there's a lot of plumbing to take care of.

- Scaffold the data layer with an ORM or an app framework like Ruby on Rails or Laravel
- Implement their SSO provider for authentication
- Design an access control pattern for authorization
- Open up any REST endpoints required or implement GraphQL queries / mutations
- Implement a migrations workflow for the database as it changes over time
- Integrate with other third party solutions by crafting a system of webhooks or similar

And then there's the [Admin Panel](../admin/overview). Most enterprise tools require an admin UI, and building one from scratch can be the most time-consuming aspect of any new enterprise tool. There are off-the-shelf packages for app frameworks like Rails, but often the customization is so involved that using Material UI or similar from scratch might be better.

Then there are no-code admin builders that could be used. However, wiring up access control and the connection to the data layer, with proper version control, makes this a challenging task as well.

That's where Payload comes in. Payload instantly provides all of this out of the box, making complex internal tools extremely simple to both spin up and maintain over time. The only custom code that will need to be written is any custom business logic. That means Payload can expedite timelines, keep budgets low, and allow engineers to focus on their specific requirements rather than complex backend / admin UI plumbing.

Generally, the best place to start for a new enterprise tool is with a blank canvas, where you can define your own functionality:

```
npx create-payload-app@latest -t blank
```

### Headless Commerce

Companies who prioritize UX generally run into frontend constraints with traditional commerce vendors. These companies will then opt for frontend frameworks like Next.js which allow them to fine-tune their user experience as much as possible—promoting conversions, personalizing experiences, and optimizing for SEO.

But the challenge with using something like Next.js for headless commerce is that in order for non-technical users to manage the storefront, you instantly need to pair a headless commerce product with a headless CMS. Then, your editors need to bounce back and forth between different admin UIs for different functionality. The code required to seamlessly glue them together on the frontend becomes overly complex.

Payload can integrate with any payment processor like Stripe and its content authoring capabilities allow it to manage every aspect of a storefront—all in one place.

If you can build your storefront with a single backend, and only offload things like payment processing, the code will be simpler and the editing experience will be significantly streamlined. Manage products, catalogs, page content, media, and more—all in one spot.

### Digital Asset Management

Payload's API-first tagging, sorting, and querying engine lends itself perfectly to all types of content that a CMS might ordinarily store, but these strong fundamentals also make it a formidable Digital Asset Management (DAM) tool as well.

Similarly to the Ecommerce use case above, if an organization uses a CMS for its content but a separate DAM for its digital assets, administrators of both tools will need to juggle completely different services for tasks that are closely related. Two subscriptions will need to be managed, two sets of infrastructure will need to be provisioned, and two admin UIs need to be used / learned.

Payload flattens CMS and DAM into a single tool that makes no compromises on either side. Powerful features like folder-based organization, file versioning, bulk upload, and media access control allow Payload to simultaneously function as a full Digital Asset Management platform as well as a Content Management System at the same time.

[Click here](https://payloadcms.com/use-cases/digital-asset-management) for more information on how to get started with Payload as a DAM.

## Choosing a Framework

Payload is a great choice for applications of all sizes and types, but it might not be the right choice for every project. Here are some guidelines to help you decide if Payload is the right choice for your project.

### When Payload might be for you

- If data ownership and privacy are important to you, and you don't want to allow another proprietary SaaS vendor to host and own your data
- If you're building a Next.js site that needs a CMS
- If you need to re-use your data outside of a SaaS API
- If what you're building has custom business logic requirements outside of a typical headless CMS
- You want to deploy serverless on platforms like Vercel

### When Payload might not be for you

- If you can manage your project fully with code, and don't need an admin UI
- If you are building a website that fits within the limits of a tool like Webflow or Framer
- If you already have a full database and just need to visualize the data somehow
- If you are confident that you won't need code / data ownership at any point in the future

Ready to get started? First, let's review some high-level concepts that are used in Payload.
```

--------------------------------------------------------------------------------

---[FILE: extending.mdx]---
Location: payload-main/docs/graphql/extending.mdx

```text
---
title: Adding your own Queries and Mutations
label: Custom Queries and Mutations
order: 20
desc: Payload allows you to add your own GraphQL queries and mutations, simply set up GraphQL in your main Payload Config by following these instructions.
keywords: graphql, resolvers, mutations, custom, queries, config, configuration, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

You can add your own GraphQL queries and mutations to Payload, making use of all the types that Payload has defined for you.

To do so, add your queries and mutations to the main Payload Config as follows:

| Config Path         | Description                                                                 |
| ------------------- | --------------------------------------------------------------------------- |
| `graphQL.queries`   | Function that returns an object containing keys to custom GraphQL queries   |
| `graphQL.mutations` | Function that returns an object containing keys to custom GraphQL mutations |

The above properties each receive a function that is defined with the following arguments:

**`GraphQL`**

This is Payload's GraphQL dependency. You should not install your own copy of GraphQL as a dependency due to underlying restrictions based on how GraphQL works. Instead, you can use the Payload-provided copy via this argument.

**`payload`**

This is a copy of the currently running Payload instance, which provides you with existing GraphQL types for all of your Collections and Globals - among other things.

## Return value

Both `graphQL.queries` and `graphQL.mutations` functions should return an object with properties equal to your newly written GraphQL queries and mutations.

## Example

`payload.config.js`:

```ts
import { buildConfig } from 'payload'
import myCustomQueryResolver from './graphQL/resolvers/myCustomQueryResolver'

export default buildConfig({
  graphQL: {
    // highlight-start
    queries: (GraphQL, payload) => {
      return {
        MyCustomQuery: {
          type: new GraphQL.GraphQLObjectType({
            name: 'MyCustomQuery',
            fields: {
              text: {
                type: GraphQL.GraphQLString,
              },
              someNumberField: {
                type: GraphQL.GraphQLFloat,
              },
            },
          }),
          args: {
            argNameHere: {
              type: new GraphQL.GraphQLNonNull(GraphQLString),
            },
          },
          resolve: myCustomQueryResolver,
        },
      }
    },
    // highlight-end
  },
})
```

## Resolver function

In your resolver, make sure you set `depth: 0` if you're returning data directly from the Local API so that GraphQL can correctly resolve queries to nested values such as relationship data.

Your function will receive four arguments you can make use of:

Example

```ts
;async (obj, args, context, info) => {}
```

**`obj`**

The previous object. Not very often used and usually discarded.

**`args`**

The available arguments from your query or mutation will be available to you here, these must be configured via the custom operation first.

**`context`**

An object containing the `req` and `res` objects that will provide you with the `payload`, `user` instances and more, like any other Payload API handler.

**`info`**

Contextual information about the currently running GraphQL operation. You can get schema information from this as well as contextual information about where this resolver function is being run.

## Types

We've exposed a few types and utilities to help you extend the API further. Payload uses the GraphQL.js package for which you can view the full list of available types in the [official documentation](https://graphql.org/graphql-js/type/).

**`GraphQLJSON`** & **`GraphQLJSONObject`**

```ts
import { GraphQLJSON, GraphQLJSONObject } from '@payloadcms/graphql/types'
```

**`GraphQL`**

You can directly import the GraphQL package used by Payload, most useful for typing.

```ts
import { GraphQL } from '@payloadcms/graphql/types'
```

<Banner type="warning">
  For queries, mutations and handlers make sure you use the `GraphQL` and
  `payload` instances provided via arguments.
</Banner>

**`buildPaginatedListType`**

This is a utility function that allows you to build a new GraphQL type for a paginated result similar to the Payload's generated schema.
It takes in two arguments, the first for the name of this new schema type and the second for the GraphQL type to be used in the docs parameter.

Example

```ts
import { buildPaginatedListType } from '@payloadcms/graphql/types'

export const getMyPosts = (GraphQL, payload) => {
  return {
    args: {},
    resolve: Resolver,
    // The name of your new type has to be unique
    type: buildPaginatedListType(
      'AuthorPosts',
      payload.collections['posts'].graphQL?.type,
    ),
  }
}
```

**`payload.collections.slug.graphQL`**

If you want to extend more of the provided API then the `graphQL` object on your collection slug will contain additional types to help you re-use code for types, mutations and queries.

```ts
graphQL?: {
  type: GraphQLObjectType
  paginatedType: GraphQLObjectType
  JWT: GraphQLObjectType
  versionType: GraphQLObjectType
  whereInputType: GraphQLInputObjectType
  mutationInputType: GraphQLNonNull<any>
  updateMutationInputType: GraphQLNonNull<any>
}
```

## Best practices

There are a few ways to structure your code, we recommend using a dedicated `graphql` directory so you can keep all of your logic in one place. You have total freedom of how you want to structure this but a common pattern is to group functions by type and with their resolver.

Example

```
src/graphql
---- queries/
     index.ts
    -- myCustomQuery/
       index.ts
       resolver.ts

---- mutations/
```
```

--------------------------------------------------------------------------------

---[FILE: graphql-schema.mdx]---
Location: payload-main/docs/graphql/graphql-schema.mdx

```text
---
title: GraphQL Schema
label: GraphQL Schema
order: 30
desc: Output your own GraphQL schema based on your collections and globals to a file.
keywords: headless cms, typescript, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

In Payload the schema is controlled by your collections and globals. All you need to do is run the generate command and the entire schema will be created for you.

## Schema generation script

Install `@payloadcms/graphql` as a dev dependency:

```bash
pnpm add @payloadcms/graphql -D
```

Run the following command to generate the schema:

```bash
pnpm payload-graphql generate:schema
```

## Custom Field Schemas

For `array`, `block`, `group` and named `tab` fields, you can generate top level reusable interfaces. The following group field config:

```ts
{
  type: 'group',
  name: 'meta',
  interfaceName: 'SharedMeta', // highlight-line
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'description',
      type: 'text',
    },
  ],
}
```

will generate:

```ts
// A top level reusable type will be generated
type SharedMeta {
  title: String
  description: String
}

// And will be referenced inside the generated schema
type Collection1 {
  // ...other fields
  meta: SharedMeta
}
```

The above example outputs all your definitions to a file relative from your Payload config as `./graphql/schema.graphql`. By default, the file will be output to your current working directory as `schema.graphql`.

### Adding an npm script

<Banner type="warning">
  **Important**

Payload needs to be able to find your config to generate your GraphQL schema.

</Banner>

Payload will automatically try and locate your config, but might not always be able to find it. For example, if you are working in a `/src` directory or similar, you need to tell Payload where to find your config manually by using an environment variable.

If this applies to you, create an npm script to make generating types easier:

```json
// package.json

{
  "scripts": {
    "generate:graphQLSchema": "cross-env PAYLOAD_CONFIG_PATH=src/payload.config.ts payload-graphql generate:schema"
  }
}
```

Now you can run `pnpm generate:graphQLSchema` to easily generate your schema.
```

--------------------------------------------------------------------------------

---[FILE: overview.mdx]---
Location: payload-main/docs/graphql/overview.mdx

```text
---
title: GraphQL Overview
label: Overview
order: 10
desc: Payload ships with a fully featured and extensible GraphQL API, which can be used in addition to the REST and Local APIs to give you more flexibility.
keywords: graphql, resolvers, mutations, config, configuration, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

In addition to its REST and Local APIs, Payload ships with a fully featured and extensible GraphQL API.

By default, the GraphQL API is exposed via `/api/graphql`, but you can customize this URL via specifying your `routes` within the main Payload Config.

The labels you provide for your Collections and Globals are used to name the GraphQL types that are created to correspond to your config. Special characters and spaces are removed.

## GraphQL Options

At the top of your Payload Config you can define all the options to manage GraphQL.

| Option                             | Description                                                                                                                                                |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mutations`                        | Any custom Mutations to be added in addition to what Payload provides. [More](/docs/graphql/extending)                                                     |
| `queries`                          | Any custom Queries to be added in addition to what Payload provides. [More](/docs/graphql/extending)                                                       |
| `maxComplexity`                    | A number used to set the maximum allowed complexity allowed by requests [More](/docs/graphql/overview#query-complexity-limits)                             |
| `disablePlaygroundInProduction`    | A boolean that if false will enable the GraphQL playground in production environments, defaults to true. [More](/docs/graphql/overview#graphql-playground) |
| `disableIntrospectionInProduction` | A boolean that if false will enable the GraphQL introspection in production environments, defaults to true.                                                |
| `disable`                          | A boolean that if true will disable the GraphQL entirely, defaults to false.                                                                               |
| `validationRules`                  | A function that takes the ExecutionArgs and returns an array of ValidationRules.                                                                           |

## Collections

Everything that can be done to a Collection via the REST or Local API can be done with GraphQL (outside of uploading files, which is REST-only). If you have a collection as follows:

```ts
import type { CollectionConfig } from 'payload'

export const PublicUser: CollectionConfig = {
  slug: 'public-users',
  auth: true, // Auth is enabled
  fields: [
    ...
  ],
}
```

**Payload will automatically open up the following queries:**

| Query Name         | Operation           |
| ------------------ | ------------------- |
| `PublicUser`       | `findByID`          |
| `PublicUsers`      | `find`              |
| `countPublicUsers` | `count`             |
| `mePublicUser`     | `me` auth operation |

**And the following mutations:**

| Query Name                 | Operation                       |
| -------------------------- | ------------------------------- |
| `createPublicUser`         | `create`                        |
| `updatePublicUser`         | `update`                        |
| `deletePublicUser`         | `delete`                        |
| `forgotPasswordPublicUser` | `forgotPassword` auth operation |
| `resetPasswordPublicUser`  | `resetPassword` auth operation  |
| `unlockPublicUser`         | `unlock` auth operation         |
| `verifyPublicUser`         | `verify` auth operation         |
| `loginPublicUser`          | `login` auth operation          |
| `logoutPublicUser`         | `logout` auth operation         |
| `refreshTokenPublicUser`   | `refresh` auth operation        |

## Globals

Globals are also fully supported. For example:

```ts
import type { GlobalConfig } from 'payload';

const Header: GlobalConfig = {
  slug: 'header',
  fields: [
    ...
  ],
}
```

**Payload will open the following query:**

| Query Name | Operation |
| ---------- | --------- |
| `Header`   | `findOne` |

**And the following mutation:**

| Query Name     | Operation |
| -------------- | --------- |
| `updateHeader` | `update`  |

## Preferences

User [preferences](../admin/preferences) for the [Admin Panel](../admin/overview) are also available to GraphQL the same way as other collection schemas are generated. To query preferences you must supply an authorization token in the header and only the preferences of that user will be accessible.

**Payload will open the following query:**

| Query Name   | Operation |
| ------------ | --------- |
| `Preference` | `findOne` |

**And the following mutations:**

| Query Name         | Operation |
| ------------------ | --------- |
| `updatePreference` | `update`  |
| `deletePreference` | `delete`  |

## GraphQL Playground

GraphQL Playground is enabled by default for development purposes, but disabled in production. You can enable it in production by passing `graphQL.disablePlaygroundInProduction` a `false` setting in the main Payload Config.

You can even log in using the `login[collection-singular-label-here]` mutation to use the Playground as an authenticated user.

<Banner type="success">
  **Tip:**

To see more regarding how the above queries and mutations are used, visit your GraphQL playground
(by default at
[`${SERVER_URL}/api/graphql-playground`](http://localhost:3000/api/graphql-playground))
while your server is running. There, you can use the "Schema" and "Docs" buttons on the right to
see a ton of detail about how GraphQL operates within Payload.

</Banner>

## Custom Validation Rules

You can add custom validation rules to your GraphQL API by defining a `validationRules` function in your Payload Config. This function should return an array of [Validation Rules](https://graphql.org/graphql-js/validation/#validation-rules) that will be applied to all incoming queries and mutations.

```ts
import { GraphQL } from '@payloadcms/graphql/types'
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  graphQL: {
    validationRules: (args) => [NoProductionIntrospection],
  },
  // ...
})

const NoProductionIntrospection: GraphQL.ValidationRule = (context) => ({
  Field(node) {
    if (process.env.NODE_ENV === 'production') {
      if (node.name.value === '__schema' || node.name.value === '__type') {
        context.reportError(
          new GraphQL.GraphQLError(
            'GraphQL introspection is not allowed, but the query contained __schema or __type',
            { nodes: [node] },
          ),
        )
      }
    }
  },
})
```

## Query complexity limits

Payload comes with a built-in query complexity limiter to prevent bad people from trying to slow down your server by running massive queries. To learn more, [click here](/docs/production/preventing-abuse#limiting-graphql-complexity).

## Field complexity

You can define custom complexity for `relationship`, `upload` and `join` type fields. This is useful if you want to assign a higher complexity to a field that is more expensive to resolve. This can help prevent users from running queries that are too complex.

```ts
const fieldWithComplexity = {
  name: 'authors',
  type: 'relationship',
  relationship: 'authors',
  graphQL: {
    complexity: 100, // highlight-line
  },
}
```
```

--------------------------------------------------------------------------------

````
