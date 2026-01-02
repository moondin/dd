---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 28
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 28 of 695)

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

---[FILE: postgres.mdx]---
Location: payload-main/docs/database/postgres.mdx

```text
---
title: Postgres
label: Postgres
order: 60
desc: Payload supports Postgres through an officially supported Drizzle Database Adapter.
keywords: Postgres, documentation, typescript, Content Management System, cms, headless, javascript, node, react, nextjs
---

To use Payload with Postgres, install the package `@payloadcms/db-postgres`. It leverages Drizzle ORM and `node-postgres` to interact with a Postgres database that you provide.

Alternatively, the `@payloadcms/db-vercel-postgres` package is also available and is optimized for use with Vercel.

It automatically manages changes to your database for you in development mode, and exposes a full suite of migration controls for you to leverage in order to keep other database environments in sync with your schema. DDL transformations are automatically generated.

To configure Payload to use Postgres, pass the `postgresAdapter` to your Payload Config as follows:

### Usage

`@payloadcms/db-postgres`:

```ts
import { postgresAdapter } from '@payloadcms/db-postgres'

export default buildConfig({
  // Configure the Postgres adapter here
  db: postgresAdapter({
    // Postgres-specific arguments go here.
    // `pool` is required.
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
})
```

`@payloadcms/db-vercel-postgres`:

```ts
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'

export default buildConfig({
  // Automatically uses process.env.POSTGRES_URL if no options are provided.
  db: vercelPostgresAdapter(),
  // Optionally, can accept the same options as the @vercel/postgres package.
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
})
```

<Banner type="info">
  **Note:** If you're using `vercelPostgresAdapter` and your
  `process.env.POSTGRES_URL` or `pool.connectionString` points to a local
  database (e.g hostname has `localhost` or `127.0.0.1`) we use the `pg` module
  for pooling instead of `@vercel/postgres`. This is because `@vercel/postgres`
  doesn't work with local databases, if you want to disable that behavior, you
  can pass `forceUseVercelPostgres: true` to the adapter's args and follow
  [Vercel
  guide](https://vercel.com/docs/storage/vercel-postgres/local-development#option-2:-local-postgres-instance-with-docker)
  for a Docker Neon DB setup.
</Banner>

## Options

| Option                      | Description                                                                                                                                                                      |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pool` \*                   | [Pool connection options](https://orm.drizzle.team/docs/quick-postgresql/node-postgres) that will be passed to Drizzle and `node-postgres` or to `@vercel/postgres`              |
| `push`                      | Disable Drizzle's [`db push`](https://orm.drizzle.team/kit-docs/overview#prototyping-with-db-push) in development mode. By default, `push` is enabled for development mode only. |
| `migrationDir`              | Customize the directory that migrations are stored.                                                                                                                              |
| `schemaName` (experimental) | A string for the postgres schema to use, defaults to 'public'.                                                                                                                   |
| `idType`                    | A string of 'serial', or 'uuid' that is used for the data type given to id columns.                                                                                              |
| `transactionOptions`        | A PgTransactionConfig object for transactions, or set to `false` to disable using transactions. [More details](https://orm.drizzle.team/docs/transactions)                       |
| `disableCreateDatabase`     | Pass `true` to disable auto database creation if it doesn't exist. Defaults to `false`.                                                                                          |
| `localesSuffix`             | A string appended to the end of table names for storing localized fields. Default is '\_locales'.                                                                                |
| `relationshipsSuffix`       | A string appended to the end of table names for storing relationships. Default is '\_rels'.                                                                                      |
| `versionsSuffix`            | A string appended to the end of table names for storing versions. Defaults to '\_v'.                                                                                             |
| `beforeSchemaInit`          | Drizzle schema hook. Runs before the schema is built. [More Details](#beforeschemainit)                                                                                          |
| `afterSchemaInit`           | Drizzle schema hook. Runs after the schema is built. [More Details](#afterschemainit)                                                                                            |
| `generateSchemaOutputFile`  | Override generated schema from `payload generate:db-schema` file path. Defaults to `{CWD}/src/payload-generated.schema.ts`                                                       |
| `allowIDOnCreate`           | Set to `true` to use the `id` passed in data on the create API operations without using a custom ID field.                                                                       |
| `readReplicas`              | An array of DB read replicas connection strings, can be used to offload read-heavy traffic.                                                                                      |
| `blocksAsJSON`              | Store blocks as a JSON column instead of using the relational structure which can improve performance with a large amount of blocks                                              |

## Access to Drizzle

After Payload is initialized, this adapter will expose the full power of Drizzle to you for use if you need it.

To ensure type-safety, you need to generate Drizzle schema first with:

```sh
npx payload generate:db-schema
```

Then, you can access Drizzle as follows:

```ts
import { posts } from './payload-generated-schema'
// To avoid installing Drizzle, you can import everything that drizzle has from our re-export path.
import { eq, sql, and } from '@payloadcms/db-postgres/drizzle'

// Drizzle's Querying API: https://orm.drizzle.team/docs/rqb
const posts = await payload.db.drizzle.query.posts.findMany()
// Drizzle's Select API https://orm.drizzle.team/docs/select
const result = await payload.db.drizzle
  .select()
  .from(posts)
  .where(
    and(eq(posts.id, 50), sql`lower(${posts.title}) = 'example post title'`),
  )
```

## Tables, relations, and enums

In addition to exposing Drizzle directly, all of the tables, Drizzle relations, and enum configs are exposed for you via the `payload.db` property as well.

- Tables - `payload.db.tables`
- Enums - `payload.db.enums`
- Relations - `payload.db.relations`

## Prototyping in development mode

Drizzle exposes two ways to work locally in development mode.

The first is [`db push`](https://orm.drizzle.team/kit-docs/overview#prototyping-with-db-push), which automatically pushes changes you make to your Payload Config (and therefore, Drizzle schema) to your database so you don't have to manually migrate every time you change your Payload Config. This only works in development mode, and should not be mixed with manually running [`migrate`](/docs/database/migrations) commands.

You will be warned if any changes that you make will entail data loss while in development mode. Push is enabled by default, but you can opt out if you'd like.

Alternatively, you can disable `push` and rely solely on migrations to keep your local database in sync with your Payload Config.

## Migration workflows

In Postgres, migrations are a fundamental aspect of working with Payload and you should become familiar with how they work.

For more information about migrations, [click here](./migrations#when-to-run-migrations).

## Drizzle schema hooks

### beforeSchemaInit

Runs before the schema is built. You can use this hook to extend your database structure with tables that won't be managed by Payload.

```ts
import { postgresAdapter } from '@payloadcms/db-postgres'
import {
  integer,
  pgTable,
  serial,
} from '@payloadcms/db-postgres/drizzle/pg-core'

postgresAdapter({
  beforeSchemaInit: [
    ({ schema, adapter }) => {
      return {
        ...schema,
        tables: {
          ...schema.tables,
          addedTable: pgTable('added_table', {
            id: serial('id').notNull(),
          }),
        },
      }
    },
  ],
})
```

One use case is preserving your existing database structure when migrating to Payload. By default, Payload drops the current database schema, which may not be desirable in this scenario.
To quickly generate the Drizzle schema from your database you can use [Drizzle Introspection](https://orm.drizzle.team/kit-docs/commands#introspect--pull)
You should get the `schema.ts` file which may look like this:

```ts
import {
  pgTable,
  uniqueIndex,
  serial,
  varchar,
  text,
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: text('full_name'),
  phone: varchar('phone', { length: 256 }),
})

export const countries = pgTable(
  'countries',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }),
  },
  (countries) => {
    return {
      nameIndex: uniqueIndex('name_idx').on(countries.name),
    }
  },
)
```

You can import them into your config and append to the schema with the `beforeSchemaInit` hook like this:

```ts
import { postgresAdapter } from '@payloadcms/db-postgres'
import { users, countries } from '../drizzle/schema'

postgresAdapter({
  beforeSchemaInit: [
    ({ schema, adapter }) => {
      return {
        ...schema,
        tables: {
          ...schema.tables,
          users,
          countries,
        },
      }
    },
  ],
})
```

Make sure Payload doesn't overlap table names with its collections. For example, if you already have a collection with slug "users", you should either change the slug or `dbName` to change the table name for this collection.

### afterSchemaInit

Runs after the Drizzle schema is built. You can use this hook to modify the schema with features that aren't supported by Payload, or if you want to add a column that you don't want to be in the Payload config.
To extend a table, Payload exposes `extendTable` utility to the args. You can refer to the [Drizzle documentation](https://orm.drizzle.team/docs/sql-schema-declaration).
The following example adds the `extra_integer_column` column and a composite index on `country` and `city` columns.

```ts
import { postgresAdapter } from '@payloadcms/db-postgres'
import { index, integer } from '@payloadcms/db-postgres/drizzle/pg-core'
import { buildConfig } from 'payload'

export default buildConfig({
  collections: [
    {
      slug: 'places',
      fields: [
        {
          name: 'country',
          type: 'text',
        },
        {
          name: 'city',
          type: 'text',
        },
      ],
    },
  ],
  db: postgresAdapter({
    afterSchemaInit: [
      ({ schema, extendTable, adapter }) => {
        extendTable({
          table: schema.tables.places,
          columns: {
            extraIntegerColumn: integer('extra_integer_column'),
          },
          extraConfig: (table) => ({
            country_city_composite_index: index(
              'country_city_composite_index',
            ).on(table.country, table.city),
          }),
        })

        return schema
      },
    ],
  }),
})
```

### Note for generated schema:

Columns and tables, added in schema hooks won't be added to the generated via `payload generate:db-schema` Drizzle schema.
If you want them to be there, you either have to edit this file manually or mutate the internal Payload "raw" SQL schema in the `beforeSchemaInit`:

```ts
import { postgresAdapter } from '@payloadcms/db-postgres'

postgresAdapter({
  beforeSchemaInit: [
    ({ schema, adapter }) => {
      // Add a new table
      adapter.rawTables.myTable = {
        name: 'my_table',
        columns: {
          my_id: {
            name: 'my_id',
            type: 'serial',
            primaryKey: true,
          },
        },
      }

      // Add a new column to generated by Payload table:
      adapter.rawTables.posts.columns.customColumn = {
        name: 'custom_column',
        // Note that Payload SQL doesn't support everything that Drizzle does.
        type: 'integer',
        notNull: true,
      }
      // Add a new index to generated by Payload table:
      adapter.rawTables.posts.indexes.customColumnIdx = {
        name: 'custom_column_idx',
        unique: true,
        on: ['custom_column'],
      }

      return schema
    },
  ],
})
```
```

--------------------------------------------------------------------------------

---[FILE: sqlite.mdx]---
Location: payload-main/docs/database/sqlite.mdx

```text
---
title: SQLite
label: SQLite
order: 70
desc: Payload supports SQLite through an officially supported Drizzle Database Adapter.
keywords: SQLite, documentation, typescript, Content Management System, cms, headless, javascript, node, react, nextjs
---

To use Payload with SQLite, install the package `@payloadcms/db-sqlite`. It leverages Drizzle ORM and `libSQL` to interact with a SQLite database that you provide.

It automatically manages changes to your database for you in development mode, and exposes a full suite of migration controls for you to leverage in order to keep other database environments in sync with your schema. DDL transformations are automatically generated.

To configure Payload to use SQLite, pass the `sqliteAdapter` to your Payload Config as follows:

```ts
import { sqliteAdapter } from '@payloadcms/db-sqlite'

export default buildConfig({
  // Your config goes here
  collections: [
    // Collections go here
  ],
  // Configure the SQLite adapter here
  db: sqliteAdapter({
    // SQLite-specific arguments go here.
    // `client.url` is required.
    client: {
      url: process.env.DATABASE_URL,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    },
  }),
})
```

## Options

| Option                     | Description                                                                                                                                                                      |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `client` \*                | [Client connection options](https://orm.drizzle.team/docs/get-started-sqlite#turso) that will be passed to `createClient` from `@libsql/client`.                                 |
| `push`                     | Disable Drizzle's [`db push`](https://orm.drizzle.team/kit-docs/overview#prototyping-with-db-push) in development mode. By default, `push` is enabled for development mode only. |
| `migrationDir`             | Customize the directory that migrations are stored.                                                                                                                              |
| `logger`                   | The instance of the logger to be passed to drizzle. By default Payload's will be used.                                                                                           |
| `idType`                   | A string of 'number', or 'uuid' that is used for the data type given to id columns.                                                                                              |
| `transactionOptions`       | A SQLiteTransactionConfig object for transactions, or set to `false` to disable using transactions. [More details](https://orm.drizzle.team/docs/transactions)                   |
| `localesSuffix`            | A string appended to the end of table names for storing localized fields. Default is '\_locales'.                                                                                |
| `relationshipsSuffix`      | A string appended to the end of table names for storing relationships. Default is '\_rels'.                                                                                      |
| `versionsSuffix`           | A string appended to the end of table names for storing versions. Defaults to '\_v'.                                                                                             |
| `beforeSchemaInit`         | Drizzle schema hook. Runs before the schema is built. [More Details](#beforeschemainit)                                                                                          |
| `afterSchemaInit`          | Drizzle schema hook. Runs after the schema is built. [More Details](#afterschemainit)                                                                                            |
| `generateSchemaOutputFile` | Override generated schema from `payload generate:db-schema` file path. Defaults to `{CWD}/src/payload-generated.schema.ts`                                                       |
| `autoIncrement`            | Pass `true` to enable SQLite [AUTOINCREMENT](https://www.sqlite.org/autoinc.html) for primary keys to ensure the same ID cannot be reused from deleted rows                      |
| `allowIDOnCreate`          | Set to `true` to use the `id` passed in data on the create API operations without using a custom ID field.                                                                       |
| `blocksAsJSON`             | Store blocks as a JSON column instead of using the relational structure which can improve performance with a large amount of blocks                                              |

## Access to Drizzle

After Payload is initialized, this adapter will expose the full power of Drizzle to you for use if you need it.

To ensure type-safety, you need to generate Drizzle schema first with:

```sh
npx payload generate:db-schema
```

Then, you can access Drizzle as follows:

```ts
// Import table from the generated file
import { posts } from './payload-generated-schema'
// To avoid installing Drizzle, you can import everything that drizzle has from our re-export path.
import { eq, sql, and } from '@payloadcms/db-sqlite/drizzle'

// Drizzle's Querying API: https://orm.drizzle.team/docs/rqb
const posts = await payload.db.drizzle.query.posts.findMany()
// Drizzle's Select API https://orm.drizzle.team/docs/select
const result = await payload.db.drizzle
  .select()
  .from(posts)
  .where(
    and(eq(posts.id, 50), sql`lower(${posts.title}) = 'example post title'`),
  )
```

## Tables and relations

In addition to exposing Drizzle directly, all of the tables and Drizzle relations are exposed for you via the `payload.db` property as well.

- Tables - `payload.db.tables`
- Relations - `payload.db.relations`

## Prototyping in development mode

Drizzle exposes two ways to work locally in development mode.

The first is [`db push`](https://orm.drizzle.team/kit-docs/overview#prototyping-with-db-push), which automatically pushes changes you make to your Payload Config (and therefore, Drizzle schema) to your database so you don't have to manually migrate every time you change your Payload Config. This only works in development mode, and should not be mixed with manually running [`migrate`](/docs/database/migrations) commands.

You will be warned if any changes that you make will entail data loss while in development mode. Push is enabled by default, but you can opt out if you'd like.

Alternatively, you can disable `push` and rely solely on migrations to keep your local database in sync with your Payload Config.

## Migration workflows

In SQLite, migrations are a fundamental aspect of working with Payload and you should become familiar with how they work.

For more information about migrations, [click here](./migrations#when-to-run-migrations).

## Drizzle schema hooks

### beforeSchemaInit

Runs before the schema is built. You can use this hook to extend your database structure with tables that won't be managed by Payload.

```ts
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { integer, sqliteTable } from '@payloadcms/db-sqlite/drizzle/sqlite-core'

sqliteAdapter({
  beforeSchemaInit: [
    ({ schema, adapter }) => {
      return {
        ...schema,
        tables: {
          ...schema.tables,
          addedTable: sqliteTable('added_table', {
            id: integer('id').primaryKey({ autoIncrement: true }),
          }),
        },
      }
    },
  ],
})
```

One use case is preserving your existing database structure when migrating to Payload. By default, Payload drops the current database schema, which may not be desirable in this scenario.
To quickly generate the Drizzle schema from your database you can use [Drizzle Introspection](https://orm.drizzle.team/kit-docs/commands#introspect--pull)
You should get the `schema.ts` file which may look like this:

```ts
import {
  sqliteTable,
  text,
  uniqueIndex,
  integer,
} from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  fullName: text('full_name'),
  phone: text('phone', { length: 256 }),
})

export const countries = sqliteTable(
  'countries',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name', { length: 256 }),
  },
  (countries) => {
    return {
      nameIndex: uniqueIndex('name_idx').on(countries.name),
    }
  },
)
```

You can import them into your config and append to the schema with the `beforeSchemaInit` hook like this:

```ts
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { users, countries } from '../drizzle/schema'

sqliteAdapter({
  beforeSchemaInit: [
    ({ schema, adapter }) => {
      return {
        ...schema,
        tables: {
          ...schema.tables,
          users,
          countries,
        },
      }
    },
  ],
})
```

Make sure Payload doesn't overlap table names with its collections. For example, if you already have a collection with slug "users", you should either change the slug or `dbName` to change the table name for this collection.

### afterSchemaInit

Runs after the Drizzle schema is built. You can use this hook to modify the schema with features that aren't supported by Payload, or if you want to add a column that you don't want to be in the Payload config.
To extend a table, Payload exposes `extendTable` utility to the args. You can refer to the [Drizzle documentation](https://orm.drizzle.team/docs/sql-schema-declaration).
The following example adds the `extra_integer_column` column and a composite index on `country` and `city` columns.

```ts
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { index, integer } from '@payloadcms/db-sqlite/drizzle/sqlite-core'
import { buildConfig } from 'payload'

export default buildConfig({
  collections: [
    {
      slug: 'places',
      fields: [
        {
          name: 'country',
          type: 'text',
        },
        {
          name: 'city',
          type: 'text',
        },
      ],
    },
  ],
  db: sqliteAdapter({
    afterSchemaInit: [
      ({ schema, extendTable, adapter }) => {
        extendTable({
          table: schema.tables.places,
          columns: {
            extraIntegerColumn: integer('extra_integer_column'),
          },
          extraConfig: (table) => ({
            country_city_composite_index: index(
              'country_city_composite_index',
            ).on(table.country, table.city),
          }),
        })

        return schema
      },
    ],
  }),
})
```

### Note for generated schema:

Columns and tables, added in schema hooks won't be added to the generated via `payload generate:db-schema` Drizzle schema.
If you want them to be there, you either have to edit this file manually or mutate the internal Payload "raw" SQL schema in the `beforeSchemaInit`:

```ts
import { sqliteAdapter } from '@payloadcms/db-sqlite'

sqliteAdapter({
  beforeSchemaInit: [
    ({ schema, adapter }) => {
      // Add a new table
      adapter.rawTables.myTable = {
        name: 'my_table',
        columns: {
          my_id: {
            name: 'my_id',
            type: 'integer',
            primaryKey: true,
          },
        },
      }

      // Add a new column to generated by Payload table:
      adapter.rawTables.posts.columns.customColumn = {
        name: 'custom_column',
        // Note that Payload SQL doesn't support everything that Drizzle does.
        type: 'integer',
        notNull: true,
      }
      // Add a new index to generated by Payload table:
      adapter.rawTables.posts.indexes.customColumnIdx = {
        name: 'custom_column_idx',
        unique: true,
        on: ['custom_column'],
      }

      return schema
    },
  ],
})
```

## D1 Database

<Banner type="warning">
  This adapter is currently in beta as it is new and could be subject to changes
  which may be considered breaking
</Banner>

We also provide a separate adapter to connect to [Cloudflare D1](https://developers.cloudflare.com/d1/), which is a serverless SQLite database.

To use it, install the package `@payloadcms/db-d1-sqlite` and configure it as follows:

```ts
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'

export default buildConfig({
  // Your config goes here
  collections: [
    // Collections go here
  ],
  // Configure the D1 adapter here
  db: sqliteD1Adapter({
    // D1-specific arguments go here.
    // `binding` is required and should match the D1 database binding name in your Cloudflare Worker environment.
    binding: cloudflare.env.D1,
  }),
})
```

It inherits the options from the SQLite adapter above with the exception of the connection options in favour of the `binding`.

You can see our [Cloudflare D1 template](https://github.com/payloadcms/payload/tree/main/templates/with-cloudflare-d1) for a full example of how to set this up.

### D1 Read Replicas

You can enable read replicas support with the `first-primary` strategy. This is experimental.

You must also enable it on your D1 database in the Cloudflare dashboard. Read more about it in the [Cloudflare documentation](https://developers.cloudflare.com/d1/best-practices/read-replication/).

<Banner type="info">
  All write queries are still forwarded to the primary database instance. Read
  replication only improves the response time for read query requests.
</Banner>

```ts
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'

export default buildConfig({
  collections: [],
  db: sqliteD1Adapter({
    binding: cloudflare.env.D1,
    // You can also enable read replicas support with the `first-primary` strategy.
    readReplicas: 'first-primary',
  }),
})
```

You can then verify that they're being used by checking the logs in your Cloudflare dashboard. You should see logs indicating whether a read or write operation was performed, and on which database instance.
```

--------------------------------------------------------------------------------

---[FILE: transactions.mdx]---
Location: payload-main/docs/database/transactions.mdx

```text
---
title: Transactions
label: Transactions
order: 30
keywords: database, transactions, sql, mongodb, postgres, documentation, Content Management System, cms, headless, typescript, node, react, nextjs
desc: Database transactions are fully supported within Payload.
---

Database transactions allow your application to make a series of database changes in an all-or-nothing commit. Consider an HTTP request that creates a new **Order** and has an `afterChange` hook to update the stock count of related **Items**. If an error occurs when updating an **Item** and an HTTP error is returned to the user, you would not want the new **Order** to be persisted or any other items to be changed either. This kind of interaction with the database is handled seamlessly with transactions.

By default, Payload will use transactions for all data changing operations, as long as it is supported by the configured database. Database changes are contained within all Payload operations and any errors thrown will result in all changes being rolled back without being committed. When transactions are not supported by the database, Payload will continue to operate as expected without them.

<Banner type="info">
  **Note:**

MongoDB requires a connection to a replicaset in order to make use of transactions.

</Banner>

<Banner type="info">
  **Note:**

Transactions in SQLite are disabled by default. You need to pass `transactionOptions: {}` to enable them.

</Banner>

The initial request made to Payload will begin a new transaction and attach it to the `req.transactionID`. If you have a `hook` that interacts with the database, you can opt in to using the same transaction by passing the `req` in the arguments. For example:

```ts
const afterChange: CollectionAfterChangeHook = async ({ req }) => {
  // because req.transactionID is assigned from Payload and passed through,
  // my-slug will only persist if the entire request is successful
  await req.payload.create({
    req,
    collection: 'my-slug',
    data: {
      some: 'data',
    },
  })
}
```

## Async Hooks with Transactions

Since Payload hooks can be async and be written to not await the result, it is possible to have an incorrect success response returned on a request that is rolled back. If you have a hook where you do not `await` the result, then you should **not** pass the `req.transactionID`.

```ts
const afterChange: CollectionAfterChangeHook = async ({ req }) => {
  // WARNING: an async call made with the same req, but NOT awaited,
  // may fail resulting in an OK response being returned with response data that is not committed
  const dangerouslyIgnoreAsync = req.payload.create({
    req,
    collection: 'my-slug',
    data: {
      some: 'other data',
    },
  })

  // Should this call fail, it will not rollback other changes
  // because the req (and its transactionID) is not passed through
  const safelyIgnoredAsync = req.payload.create({
    collection: 'my-slug',
    data: {
      some: 'other data',
    },
  })
}
```

## Direct Transaction Access

When writing your own scripts or custom endpoints, you may wish to have direct control over transactions. This is useful for interacting with your database outside of Payload's Local API.

The following functions can be used for managing transactions:

- `payload.db.beginTransaction` - Starts a new session and returns a transaction ID for use in other Payload Local API calls.
- `payload.db.commitTransaction` - Takes the identifier for the transaction, finalizes any changes.
- `payload.db.rollbackTransaction` - Takes the identifier for the transaction, discards any changes.

Payload uses the `req` object to pass the transaction ID through to the database adapter. If you are not using the `req` object, you can make a new object to pass the transaction ID directly to database adapter methods and Local API calls.
Example:

```ts
import payload from 'payload'
import config from './payload.config'

const standalonePayloadScript = async () => {
  // initialize Payload
  await payload.init({ config })

  const transactionID = await payload.db.beginTransaction()

  try {
    // Make an update using the Local API
    await payload.update({
      collection: 'posts',
      data: {
        some: 'data',
      },
      where: {
        slug: { equals: 'my-slug' },
      },
      req: { transactionID },
    })

    /*
      You can make additional db changes or run other functions
      that need to be committed on an all or nothing basis
     */

    // Commit the transaction
    await payload.db.commitTransaction(transactionID)
  } catch (error) {
    // Rollback the transaction
    await payload.db.rollbackTransaction(transactionID)
  }
}

standalonePayloadScript()
```

## Disabling Transactions

If you wish to disable transactions entirely, you can do so by passing `false` as the `transactionOptions` in your database adapter configuration. All the official Payload database adapters support this option.

In addition to allowing database transactions to be disabled at the adapter level. You can prevent Payload from using a transaction in direct calls to the Local API by adding `disableTransaction: true` to the args. For example:

```ts
await payload.update({
  collection: 'posts',
  data: {
    some: 'data',
  },
  where: {
    slug: { equals: 'my-slug' },
  },
  disableTransaction: true,
})
```
```

--------------------------------------------------------------------------------

````
