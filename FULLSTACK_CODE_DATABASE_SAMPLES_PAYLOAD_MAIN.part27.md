---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 27
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 27 of 695)

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

---[FILE: migrations.mdx]---
Location: payload-main/docs/database/migrations.mdx

```text
---
title: Migrations
label: Migrations
order: 20
keywords: database, migrations, ddl, sql, mongodb, postgres, documentation, Content Management System, cms, headless, typescript, node, react, nextjs
desc: Payload features first-party database migrations all done in TypeScript.
---

Payload exposes a full suite of migration controls available for your use. Migration commands are accessible via
the `npm run payload` command in your project directory.

Ensure you have an npm script called "payload" in your `package.json` file.

```json
{
  "scripts": {
    "payload": "cross-env PAYLOAD_CONFIG_PATH=src/payload.config.ts payload"
  }
}
```

<Banner>
  Note that you need to run Payload migrations through the package manager that
  you are using, because Payload should not be globally installed on your
  system.
</Banner>

## Migration file contents

Payload stores all created migrations in a folder that you can specify. By default, migrations are stored
in `./src/migrations`.

A migration file has two exports - an `up` function, which is called when a migration is executed, and a `down` function
that will be called if for some reason the migration fails to complete successfully. The `up` function should contain
all changes that you attempt to make within the migration, and the `down` should ideally revert any changes you make.

Here is an example migration file:

```ts
import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/your-db-adapter'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  // Perform changes to your database here.
  // You have access to `payload` as an argument, and
  // everything is done in TypeScript.
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  // Do whatever you need to revert changes if the `up` function fails
}
```

## Using Transactions

When migrations are run, each migration is performed in a new [transaction](/docs/database/transactions) for you. All
you need to do is pass the `req` object to any [Local API](/docs/local-api/overview) or direct database calls, such as
`payload.db.updateMany()`, to make database changes inside the transaction. Assuming no errors were thrown, the transaction is committed
after your `up` or `down` function runs. If the migration errors at any point or fails to commit, it is caught and the
transaction gets aborted. This way no change is made to the database if the migration fails.

### Using database directly with the transaction

Additionally, you can bypass Payload's layer entirely and perform operations directly on your underlying database within the active transaction:

### MongoDB:

```ts
import { type MigrateUpArgs } from '@payloadcms/db-mongodb'

export async function up({
  session,
  payload,
  req,
}: MigrateUpArgs): Promise<void> {
  const posts = await payload.db.collections.posts.collection
    .find({ session })
    .toArray()
}
```

### Postgres:

```ts
import { type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  const { rows: posts } = await db.execute(sql`SELECT * from posts`)
}
```

### SQLite:

In SQLite, transactions are disabled by default. [More](./transactions).

```ts
import { type MigrateUpArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  const { rows: posts } = await db.run(sql`SELECT * from posts`)
}
```

## Migrations Directory

Each DB adapter has an optional property `migrationDir` where you can override where you want your migrations to be
stored/read. If this is not specified, Payload will check the default and possibly make a best effort to find your
migrations directory by searching in common locations ie. `./src/migrations`, `./dist/migrations`, `./migrations`, etc.

All database adapters should implement similar migration patterns, but there will be small differences based on the
adapter and its specific needs. Below is a list of all migration commands that should be supported by your database
adapter.

## Commands

### Migrate

The `migrate` command will run any migrations that have not yet been run.

```text
npm run payload migrate
```

### Create

Create a new migration file in the migrations directory. You can optionally name the migration that will be created. By
default, migrations will be named using a timestamp.

```text
npm run payload migrate:create optional-name-here
```

Flags:

- `--skip-empty`: with Postgres, it skips the "no schema changes detected. Would you like to create a blank migration file?" prompt which can be useful for generating migration in CI.
- `--force-accept-warning`: accepts any command prompts, creates a blank migration even if there weren't any changes to the schema.

### Status

The `migrate:status` command will check the status of migrations and output a table of which migrations have been run,
and which migrations have not yet run.

`payload migrate:status`

```text
npm run payload migrate:status
```

### Down

Roll back the last batch of migrations.

```text
npm run payload migrate:down
```

### Refresh

Roll back all migrations that have been run, and run them again.

```text
npm run payload migrate:refresh
```

### Reset

Roll back all migrations.

```text
npm run payload migrate:reset
```

### Fresh

Drops all entities from the database and re-runs all migrations from scratch.

```text
npm run payload migrate:fresh
```

## When to run migrations

Depending on which Database Adapter you use, your migration workflow might differ subtly.

In relational databases, migrations will be **required** for non-development database environments. But with MongoDB, you might only need to run migrations once in a while (or never even need them).

#### MongoDB#mongodb-migrations

In MongoDB, you'll only ever really need to run migrations for times where you change your database shape, and you have lots of existing data that you'd like to transform from Shape A to Shape B.

In this case, you can create a migration by running `pnpm payload migrate:create`, and then write the logic that you need to perform to migrate your documents to their new shape. You can then either run your migrations in CI before you build / deploy, or you can run them locally, against your production database, by using your production database connection string on your local computer and running the `pnpm payload migrate` command.

#### Postgres#postgres-migrations

In relational databases like Postgres, migrations are a bit more important, because each time you add a new field or a new collection, you'll need to update the shape of your database to match your Payload Config (otherwise you'll see errors upon trying to read / write your data).

That means that Postgres users of Payload should become familiar with the entire migration workflow from top to bottom.

Here is an overview of a common workflow for working locally against a development database, creating migrations, and then running migrations against your production database before deploying.

**1 - work locally using push mode**

Payload uses Drizzle ORM's powerful `push` mode to automatically sync data changes to your database for you while in development mode. By default, this is enabled and is the suggested workflow to using Postgres and Payload while doing local development.

You can disable this setting and solely use migrations to manage your local development database (pass `push: false` to your Postgres adapter), but if you do disable it, you may see frequent errors while running development mode. This is because Payload will have updated to your new data shape, but your local database will not have updated.

For this reason, we suggest that you leave `push` as its default setting and treat your local dev database as a sandbox.

For more information about push mode and prototyping in development, [click here](./postgres#prototyping-in-development-mode).

The typical workflow in Payload is to build out your Payload configs, install plugins, and make progress in development mode - allowing Drizzle to push your changes to your local database for you. Once you're finished, you can create a migration.

But importantly, you do not need to run migrations against your development database, because Drizzle will have already pushed your changes to your database for you.

<Banner type="warning">
  Warning: do not mix "push" and migrations with your local development
  database. If you use "push" locally, and then try to migrate, Payload will
  throw a warning, telling you that these two methods are not meant to be used
  interchangeably.
</Banner>

**2 - create a migration**

Once you're done with working in your Payload Config, you can create a migration. It's best practice to try and complete a specific task or fully build out a feature before you create a migration.

But once you're ready, you can run `pnpm payload migrate:create`, which will perform the following steps for you:

- We will look for any existing migrations, and automatically generate SQL changes necessary to convert your schema from its prior state to the new state of your Payload Config
- We will then create a new migration file in your `/migrations` folder that contains all the SQL necessary to be run

We won't immediately run this migration for you, however.

<Banner type="success">
  Tip: migrations created by Payload are relatively programmatic in nature, so
  there should not be any surprises, but before you check in the created
  migration it's a good idea to always double-check the contents of the
  migration files.
</Banner>

**3 - set up your build process to run migrations**

Generally, you want to run migrations before you build Payload for production. This typically happens in your CI pipeline and can usually be configured on platforms like Payload Cloud, Vercel, or Netlify by specifying your build script.

A common set of scripts in a `package.json`, set up to run migrations in CI, might look like this:

```js
  "scripts": {
    // For running in dev mode
    "dev": "next dev --turbo",

    // To build your Next + Payload app for production
    "build": "next build",

    // A "tie-in" to Payload's CLI for convenience
    // this helps you run `pnpm payload migrate:create` and similar
    "payload": "cross-env NODE_OPTIONS=--no-deprecation payload",

    // This command is what you'd set your `build script` to.
    // Notice how it runs `payload migrate` and then `pnpm build`?
    // This will run all migrations for you before building, in your CI,
    // against your production database
    "ci": "payload migrate && pnpm build",
  },
```

In the example above, we've specified a `ci` script which we can use as our "build script" in the platform that we are deploying to production with.

This will require that your build pipeline can connect to your database, and it will simply run the `payload migrate` command prior to starting the build process. By calling `payload migrate`, Payload will automatically execute any migrations in your `/migrations` folder that have not yet been executed against your production database, in the order that they were created.

If it fails, the deployment will be rejected. But now, with your build script set up to run your migrations, you will be all set! Next time you deploy, your CI will execute the required migrations for you, and your database will be caught up with the shape that your Payload Config requires.

## Running migrations in production

In certain cases, you might want to run migrations at runtime when the server starts. Running them during build time may be impossible due to not having access to your database connection while building or similar reasoning.

If you're using a long-running server or container where your Node server starts up one time and then stays initialized, you might prefer to run migrations on server startup instead of within your CI.

In order to run migrations at runtime, on initialization, you can pass your migrations to your database adapter under the `prodMigrations` key as follows:

```ts
// Import your migrations from the `index.ts` file
// that Payload generates for you
import { migrations } from './migrations'
import { buildConfig } from 'payload'

export default buildConfig({
  // your config here
  db: postgresAdapter({
    //  your adapter config here
    prodMigrations: migrations,
  }),
})
```

Passing your migrations as shown above will tell Payload, in production only, to execute any migrations that need to be run prior to completing the initialization of Payload. This is ideal for long-running services where Payload will only be initialized at startup.

<Banner type="warning">
  **Warning:** if Payload is instructed to run migrations in production, this
  may slow down serverless cold starts on platforms such as Vercel. Generally,
  this option should only be used for long-running servers / containers.
</Banner>

## Environment-Specific Configurations and Migrations

Your configuration may include environment-specific settings (e.g., enabling a plugin only in production). If you generate migrations without considering the environment, it can lead to discrepancies and issues. When running migrations locally, Payload uses the development environment, which might miss production-specific configurations. Similarly, running migrations in production could miss development-specific entities.

This is an easy oversight, so be mindful of any environment-specific logic in your config when handling migrations.

**Ways to address this:**

- Manually update your migration file after it is generated to include any environment-specific configurations.
- Temporarily enable any required production environment variables in your local setup when generating the migration to capture the necessary updates.
- Use separate migration files for each environment to ensure the correct migration is executed in the corresponding environment.
```

--------------------------------------------------------------------------------

---[FILE: mongodb.mdx]---
Location: payload-main/docs/database/mongodb.mdx

```text
---
title: MongoDB
label: MongoDB
order: 50
desc: Payload has supported MongoDB natively since we started. The flexible nature of MongoDB lends itself well to Payload's powerful fields.
keywords: MongoDB, documentation, typescript, Content Management System, cms, headless, javascript, node, react, nextjs
---

To use Payload with MongoDB, install the package `@payloadcms/db-mongodb`. It will come with everything you need to
store your Payload data in MongoDB.

Then from there, pass it to your Payload Config as follows:

```ts
import { mongooseAdapter } from '@payloadcms/db-mongodb'

export default buildConfig({
  // Your config goes here
  collections: [
    // Collections go here
  ],
  // Configure the Mongoose adapter here
  db: mongooseAdapter({
    // Mongoose-specific arguments go here.
    // URL is required.
    url: process.env.DATABASE_URI,
  }),
})
```

## Options

| Option                       | Description                                                                                                                                                                                                                                                                                                  |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `autoPluralization`          | Tell Mongoose to auto-pluralize any collection names if it encounters any singular words used as collection `slug`s.                                                                                                                                                                                         |
| `connectOptions`             | Customize MongoDB connection options. Payload will connect to your MongoDB database using default options which you can override and extend to include all the [options](https://mongoosejs.com/docs/connections.html#options) available to mongoose.                                                        |
| `collectionsSchemaOptions`   | Customize Mongoose schema options for collections.                                                                                                                                                                                                                                                           |
| `disableIndexHints`          | Set to true to disable hinting to MongoDB to use 'id' as index. This is currently done when counting documents for pagination, as it increases the speed of the count function used in that query. Disabling this optimization might fix some problems with AWS DocumentDB. Defaults to false                |
| `migrationDir`               | Customize the directory that migrations are stored.                                                                                                                                                                                                                                                          |
| `transactionOptions`         | An object with configuration properties used in [transactions](https://www.mongodb.com/docs/manual/core/transactions/) or `false` which will disable the use of transactions.                                                                                                                                |
| `collation`                  | Enable language-specific string comparison with customizable options. Available on MongoDB 3.4+. Defaults locale to "en". Example: `{ strength: 3 }`. For a full list of collation options and their definitions, see the [MongoDB documentation](https://www.mongodb.com/docs/manual/reference/collation/). |
| `allowAdditionalKeys`        | By default, Payload strips all additional keys from MongoDB data that don't exist in the Payload schema. If you have some data that you want to include to the result but it doesn't exist in Payload, you can set this to `true`. Be careful as Payload access control _won't_ work for this data.          |
| `allowIDOnCreate`            | Set to `true` to use the `id` passed in data on the create API operations without using a custom ID field.                                                                                                                                                                                                   |
| `disableFallbackSort`        | Set to `true` to disable the adapter adding a fallback sort when sorting by non-unique fields, this can affect performance in some cases but it ensures a consistent order of results.                                                                                                                       |
| `useAlternativeDropDatabase` | Set to `true` to use an alternative `dropDatabase` implementation that calls `collection.deleteMany({})` on every collection instead of sending a raw `dropDatabase` command. Payload only uses `dropDatabase` for testing purposes. Defaults to `false`.                                                    |
| `useBigIntForNumberIDs`      | Set to `true` to use `BigInt` for custom ID fields of type `'number'`. Useful for databases that don't support `double` or `int32` IDs. Defaults to `false`.                                                                                                                                                 |
| `useJoinAggregations`        | Set to `false` to disable join aggregations (which use correlated subqueries) and instead populate join fields via multiple `find` queries. Defaults to `true`.                                                                                                                                              |
| `usePipelineInSortLookup`    | Set to `false` to disable the use of `pipeline` in the `$lookup` aggregation in sorting. Defaults to `true`.                                                                                                                                                                                                 |

## Access to Mongoose models

After Payload is initialized, this adapter exposes all of your Mongoose models and they are available for you to work
with directly.

You can access Mongoose models as follows:

- Collection models - `payload.db.collections[myCollectionSlug]`
- Globals model - `payload.db.globals`
- Versions model (both collections and globals) - `payload.db.versions[myEntitySlug]`

## Using other MongoDB implementations

You can import the `compatibilityOptions` object to get the recommended settings for other MongoDB implementations. Since these databases aren't officially supported by payload, you may still encounter issues even with these settings (please create an issue or PR if you believe these options should be updated):

```ts
import { mongooseAdapter, compatibilityOptions } from '@payloadcms/db-mongodb'

export default buildConfig({
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
    // For example, if you're using firestore:
    ...compatibilityOptions.firestore,
  }),
})
```

We export compatibility options for [DocumentDB](https://aws.amazon.com/documentdb/), [Azure Cosmos DB](https://azure.microsoft.com/en-us/products/cosmos-db) and [Firestore](https://cloud.google.com/firestore/mongodb-compatibility/docs/overview). Known limitations:

- Azure Cosmos DB does not support transactions that update two or more documents in different collections, which is a common case when using Payload (via hooks).
- Azure Cosmos DB requires the root config property `indexSortableFields` to be set to `true`.

## Using collation

There are situations where you may want to use language-specific string comparison, for example when sorting strings with accents or in different languages. MongoDB supports this via [collation](https://www.mongodb.com/docs/manual/reference/collation/).

We thread your locale automatically through to the MongoDB queries when collation is enabled in the adapter, so that when you sort by a field, it uses the correct language rules for that locale.

To enable collation, set the `collation` option in the adapter configuration:

```ts
import { mongooseAdapter } from '@payloadcms/db-mongodb'

export default buildConfig({
  // Your config goes here
  collections: [
    // Collections go here
  ],
  // Configure the Mongoose adapter here
  db: mongooseAdapter({
    // Mongoose-specific arguments go here.
    // URL is required.
    url: process.env.DATABASE_URI,
    collation: {
      // Set any MongoDB collation options here.
      // The locale will be set automatically based on the request locale.
      strength: 1, // Example option
    },
  }),
})
```

<Banner type="warning">
  Collation will affect things like sort based on the locale being used. Please
  test thoroughly before using in production as it can affect your queries.
</Banner>
```

--------------------------------------------------------------------------------

---[FILE: overview.mdx]---
Location: payload-main/docs/database/overview.mdx

```text
---
title: Database
label: Overview
order: 10
keywords: database, mongodb, postgres, documentation, Content Management System, cms, headless, typescript, node, react, nextjs
desc: With Payload, you bring your own database and own your data. You have full control.
---

Payload is database agnostic, meaning you can use any type of database behind Payload's familiar APIs. Payload is designed to interact with your database through a Database Adapter, which is a thin layer that translates Payload's internal data structures into your database's native data structures.

Currently, Payload officially supports the following Database Adapters:

- [MongoDB](/docs/database/mongodb) with [Mongoose](https://mongoosejs.com/)
- [Postgres](/docs/database/postgres) with [Drizzle](https://drizzle.team/)
- [SQLite](/docs/database/sqlite) with [Drizzle](https://drizzle.team/)

To configure a Database Adapter, use the `db` property in your [Payload Config](../configuration/overview):

```ts
import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'

export default buildConfig({
  // ...
  // highlight-start
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
  // highlight-end
})
```

<Banner type="warning">
  **Reminder:** The Database Adapter is an external dependency and must be
  installed in your project separately from Payload. You can find the
  installation instructions for each Database Adapter in their respective
  documentation.
</Banner>

## Selecting a Database

There are several factors to consider when choosing which database technology and hosting option is right for your project and workload. Payload can theoretically support any database, but it's up to you to decide which database to use.

There are two main categories of databases to choose from:

- [Non-Relational Databases](#non-relational-databases)
- [Relational Databases](#relational-databases)

### Non-Relational Databases

If your project has a lot of dynamic fields, and you are comfortable with allowing Payload to enforce data integrity across your documents, MongoDB is a great choice. With it, your Payload documents are stored as _one_ document in your database—no matter if you have localization enabled, how many block or array fields you have, etc. This means that the shape of your data in your database will very closely reflect your field schema, and there is minimal complexity involved in storing or retrieving your data.

You should prefer MongoDB if:

- You prefer simplicity within your database
- You don't want to deal with keeping production / staging databases in sync via [DDL changes](https://en.wikipedia.org/wiki/Data_definition_language)
- Most (or everything) in your project is [Localized](../configuration/localization)
- You leverage a lot of [Arrays](../fields/array), [Blocks](../fields/blocks), or `hasMany` [Select](../fields/select) fields

### Relational Databases

Many projects might call for more rigid database architecture where the shape of your data is strongly enforced at the database level. For example, if you know the shape of your data and it's relatively "flat", and you don't anticipate it to change often, your workload might suit relational databases like Postgres very well.

You should prefer a relational DB like Postgres or SQLite if:

- You are comfortable with [Migrations](./migrations)
- You require enforced data consistency at the database level
- You have a lot of relationships between collections and require relationships to be enforced

## Payload Differences

It's important to note that nearly every Payload feature is available in all of our officially supported Database Adapters, including [Localization](../configuration/localization), [Arrays](../fields/array), [Blocks](../fields/blocks), etc. The only thing that is not supported in SQLite yet is the [Point Field](/docs/fields/point), but that should be added soon.

It's up to you to choose which database you would like to use based on the requirements of your project. Payload has no opinion on which database you should ultimately choose.
```

--------------------------------------------------------------------------------

````
