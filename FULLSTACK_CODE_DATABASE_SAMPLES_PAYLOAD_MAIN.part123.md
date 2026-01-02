---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 123
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 123 of 695)

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

---[FILE: types.ts]---
Location: payload-main/packages/db-d1-sqlite/src/types.ts

```typescript
import type { ResultSet } from '@libsql/client'
import type { BuildQueryJoinAliases, DrizzleAdapter, extendDrizzleTable } from '@payloadcms/drizzle'
import type { BaseSQLiteAdapter, BaseSQLiteArgs } from '@payloadcms/drizzle/sqlite'
import type { DrizzleConfig, Relation, Relations, SQL } from 'drizzle-orm'
import type { AnyD1Database, DrizzleD1Database } from 'drizzle-orm/d1'
import type { LibSQLDatabase } from 'drizzle-orm/libsql'
import type {
  AnySQLiteColumn,
  SQLiteInsertOnConflictDoUpdateConfig,
  SQLiteTableWithColumns,
  SQLiteTransactionConfig,
} from 'drizzle-orm/sqlite-core'
import type { SQLiteRaw } from 'drizzle-orm/sqlite-core/query-builders/raw'
import type { Payload, PayloadRequest } from 'payload'

type SQLiteSchema = {
  relations: Record<string, GenericRelation>
  tables: Record<string, SQLiteTableWithColumns<any>>
}

type SQLiteSchemaHookArgs = {
  extendTable: typeof extendDrizzleTable
  schema: SQLiteSchema
}

export type SQLiteSchemaHook = (args: SQLiteSchemaHookArgs) => Promise<SQLiteSchema> | SQLiteSchema

export type Args = {
  binding: AnyD1Database
  /**
   * Experimental. Enables read replicas support with the `first-primary` strategy.
   *
   * @experimental
   * @example
   *
   * ```readReplicas: 'first-primary'```
   */
  readReplicas?: 'first-primary'
} & BaseSQLiteArgs

export type GenericColumns = {
  [x: string]: AnySQLiteColumn
}

export type GenericTable = SQLiteTableWithColumns<{
  columns: GenericColumns
  dialect: string
  name: string
  schema: string
}>

export type GenericRelation = Relations<string, Record<string, Relation<string>>>

export type CountDistinct = (args: {
  db: LibSQLDatabase
  joins: BuildQueryJoinAliases
  tableName: string
  where: SQL
}) => Promise<number>

export type DeleteWhere = (args: {
  db: LibSQLDatabase
  tableName: string
  where: SQL
}) => Promise<void>

export type DropDatabase = (args: { adapter: SQLiteD1Adapter }) => Promise<void>

export type Execute<T> = (args: {
  db?: LibSQLDatabase
  drizzle?: LibSQLDatabase
  raw?: string
  sql?: SQL<unknown>
}) => SQLiteRaw<Promise<T>> | SQLiteRaw<ResultSet>

export type Insert = (args: {
  db: LibSQLDatabase
  onConflictDoUpdate?: SQLiteInsertOnConflictDoUpdateConfig<any>
  tableName: string
  values: Record<string, unknown> | Record<string, unknown>[]
}) => Promise<Record<string, unknown>[]>

// Explicitly omit drizzle property for complete override in SQLiteAdapter, required in ts 5.5
type SQLiteDrizzleAdapter = Omit<
  DrizzleAdapter,
  | 'countDistinct'
  | 'deleteWhere'
  | 'drizzle'
  | 'dropDatabase'
  | 'execute'
  | 'idType'
  | 'insert'
  | 'operators'
  | 'relations'
>

export interface GeneratedDatabaseSchema {
  schemaUntyped: Record<string, unknown>
}

type ResolveSchemaType<T> = 'schema' extends keyof T
  ? T['schema']
  : GeneratedDatabaseSchema['schemaUntyped']

type Drizzle = { $client: AnyD1Database } & DrizzleD1Database<Record<string, any>>

export type SQLiteD1Adapter = {
  binding: Args['binding']
  client: AnyD1Database
  drizzle: Drizzle
  /**
   * Experimental. Enables read replicas support with the `first-primary` strategy.
   *
   * @example
   *
   * ```readReplicas: 'first-primary'```
   */
  readReplicas?: 'first-primary'
} & BaseSQLiteAdapter &
  SQLiteDrizzleAdapter

export type IDType = 'integer' | 'numeric' | 'text'

export type MigrateUpArgs = {
  /**
   * The SQLite Drizzle instance that you can use to execute SQL directly within the current transaction.
   * @example
   * ```ts
   * import { type MigrateUpArgs, sql } from '@payloadcms/db-sqlite'
   *
   * export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
   *   const { rows: posts } = await db.run(sql`SELECT * FROM posts`)
   * }
   * ```
   */
  db: Drizzle
  /**
   * The Payload instance that you can use to execute Local API methods
   * To use the current transaction you must pass `req` to arguments
   * @example
   * ```ts
   * import { type MigrateUpArgs } from '@payloadcms/db-sqlite'
   *
   * export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
   *   const posts = await payload.find({ collection: 'posts', req })
   * }
   * ```
   */
  payload: Payload
  /**
   * The `PayloadRequest` object that contains the current transaction
   */
  req: PayloadRequest
}
export type MigrateDownArgs = {
  /**
   * The SQLite Drizzle instance that you can use to execute SQL directly within the current transaction.
   * @example
   * ```ts
   * import { type MigrateDownArgs, sql } from '@payloadcms/db-sqlite'
   *
   * export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
   *   const { rows: posts } = await db.run(sql`SELECT * FROM posts`)
   * }
   * ```
   */
  db: Drizzle
  /**
   * The Payload instance that you can use to execute Local API methods
   * To use the current transaction you must pass `req` to arguments
   * @example
   * ```ts
   * import { type MigrateDownArgs } from '@payloadcms/db-sqlite'
   *
   * export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
   *   const posts = await payload.find({ collection: 'posts', req })
   * }
   * ```
   */
  payload: Payload
  /**
   * The `PayloadRequest` object that contains the current transaction
   */
  req: PayloadRequest
}

declare module 'payload' {
  export interface DatabaseAdapter
    extends Omit<Args, 'idType' | 'logger' | 'migrationDir' | 'pool'>,
      DrizzleAdapter {
    beginTransaction: (options?: SQLiteTransactionConfig) => Promise<null | number | string>
    drizzle: Drizzle
    /**
     * An object keyed on each table, with a key value pair where the constraint name is the key, followed by the dot-notation field name
     * Used for returning properly formed errors from unique fields
     */
    fieldConstraints: Record<string, Record<string, string>>
    idType: Args['idType']
    initializing: Promise<void>
    localesSuffix?: string
    logger: DrizzleConfig['logger']
    prodMigrations?: {
      down: (args: MigrateDownArgs) => Promise<void>
      name: string
      up: (args: MigrateUpArgs) => Promise<void>
    }[]
    push: boolean
    rejectInitializing: () => void
    relationshipsSuffix?: string
    resolveInitializing: () => void
    schema: Record<string, GenericRelation | GenericTable>
    tableNameMap: Map<string, string>
    transactionOptions: SQLiteTransactionConfig
    versionsSuffix?: string
  }
}
```

--------------------------------------------------------------------------------

---[FILE: d1.ts]---
Location: payload-main/packages/db-d1-sqlite/src/drizzle-proxy/d1.ts

```typescript
export * from 'drizzle-orm/d1'
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/db-d1-sqlite/src/drizzle-proxy/index.ts

```typescript
export * from 'drizzle-orm'
```

--------------------------------------------------------------------------------

---[FILE: relations.ts]---
Location: payload-main/packages/db-d1-sqlite/src/drizzle-proxy/relations.ts

```typescript
export * from 'drizzle-orm/relations'
```

--------------------------------------------------------------------------------

---[FILE: sqlite-core.ts]---
Location: payload-main/packages/db-d1-sqlite/src/drizzle-proxy/sqlite-core.ts

```typescript
export * from 'drizzle-orm/sqlite-core'
```

--------------------------------------------------------------------------------

---[FILE: types-deprecated.ts]---
Location: payload-main/packages/db-d1-sqlite/src/exports/types-deprecated.ts

```typescript
import type {
  Args as _Args,
  CountDistinct as _CountDistinct,
  DeleteWhere as _DeleteWhere,
  DropDatabase as _DropDatabase,
  Execute as _Execute,
  GeneratedDatabaseSchema as _GeneratedDatabaseSchema,
  GenericColumns as _GenericColumns,
  GenericRelation as _GenericRelation,
  GenericTable as _GenericTable,
  IDType as _IDType,
  Insert as _Insert,
  MigrateDownArgs as _MigrateDownArgs,
  MigrateUpArgs as _MigrateUpArgs,
  SQLiteD1Adapter as _SQLiteAdapter,
  SQLiteSchemaHook as _SQLiteSchemaHook,
} from '../types.js'

/**
 * @deprecated - import from `@payloadcms/db-sqlite` instead
 */
export type SQLiteAdapter = _SQLiteAdapter

/**
 * @deprecated - import from `@payloadcms/db-sqlite` instead
 */
export type Args = _Args
/**
 * @deprecated - import from `@payloadcms/db-sqlite` instead
 */
export type CountDistinct = _CountDistinct
/**
 * @deprecated - import from `@payloadcms/db-sqlite` instead
 */
export type DeleteWhere = _DeleteWhere
/**
 * @deprecated - import from `@payloadcms/db-sqlite` instead
 */
export type DropDatabase = _DropDatabase
/**
 * @deprecated - import from `@payloadcms/db-sqlite` instead
 */
export type Execute<T> = _Execute<T>
/**
 * @deprecated - import from `@payloadcms/db-sqlite` instead
 */
export type GeneratedDatabaseSchema = _GeneratedDatabaseSchema
/**
 * @deprecated - import from `@payloadcms/db-sqlite` instead
 */
export type GenericColumns = _GenericColumns
/**
 * @deprecated - import from `@payloadcms/db-sqlite` instead
 */
export type GenericRelation = _GenericRelation
/**
 * @deprecated - import from `@payloadcms/db-sqlite` instead
 */
export type GenericTable = _GenericTable
/**
 * @deprecated - import from `@payloadcms/db-sqlite` instead
 */
export type IDType = _IDType
/**
 * @deprecated - import from `@payloadcms/db-sqlite` instead
 */
export type Insert = _Insert
/**
 * @deprecated - import from `@payloadcms/db-sqlite` instead
 */
export type MigrateDownArgs = _MigrateDownArgs
/**
 * @deprecated - import from `@payloadcms/db-sqlite` instead
 */
export type MigrateUpArgs = _MigrateUpArgs
/**
 * @deprecated - import from `@payloadcms/db-sqlite` instead
 */
export type SQLiteSchemaHook = _SQLiteSchemaHook
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/packages/db-mongodb/.gitignore

```text
/migrations
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: payload-main/packages/db-mongodb/.prettierignore

```text
.tmp
**/.git
**/.hg
**/.pnp.*
**/.svn
**/.yarn/**
**/build
**/dist/**
**/node_modules
**/temp
```

--------------------------------------------------------------------------------

---[FILE: .swcrc-build]---
Location: payload-main/packages/db-mongodb/.swcrc-build

```text
{
  "$schema": "https://json.schemastore.org/swcrc",
  "sourceMaps": true,
  "jsc": {
    "target": "esnext",
    "parser": {
      "syntax": "typescript",
      "tsx": true,
      "dts": true
    }
  },
  "module": {
    "type": "es6"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: LICENSE.md]---
Location: payload-main/packages/db-mongodb/LICENSE.md

```text
MIT License

Copyright (c) 2018-2025 Payload CMS, Inc. <info@payloadcms.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: payload-main/packages/db-mongodb/package.json

```json
{
  "name": "@payloadcms/db-mongodb",
  "version": "3.68.5",
  "description": "The officially supported MongoDB database adapter for Payload",
  "homepage": "https://payloadcms.com",
  "repository": {
    "type": "git",
    "url": "https://github.com/payloadcms/payload.git",
    "directory": "packages/db-mongodb"
  },
  "license": "MIT",
  "author": "Payload <dev@payloadcms.com> (https://payloadcms.com)",
  "maintainers": [
    {
      "name": "Payload",
      "email": "info@payloadcms.com",
      "url": "https://payloadcms.com"
    }
  ],
  "sideEffects": false,
  "type": "module",
  "exports": {
    ".": {
      "import": "./src/index.ts",
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    },
    "./migration-utils": {
      "import": "./src/exports/migration-utils.ts",
      "types": "./src/exports/migration-utils.ts",
      "default": "./src/exports/migration-utils.ts"
    },
    "./internal": {
      "import": "./src/exports/internal.ts",
      "types": "./src/exports/internal.ts",
      "default": "./src/exports/internal.ts"
    }
  },
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "files": [
    "dist",
    "predefinedMigrations"
  ],
  "scripts": {
    "build": "pnpm build:types && pnpm build:swc",
    "build:debug": "pnpm build",
    "build:swc": "swc ./src -d ./dist --config-file .swcrc-build --strip-leading-paths",
    "build:types": "tsc --emitDeclarationOnly --outDir dist",
    "clean": "rimraf -g {dist,*.tsbuildinfo}",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  },
  "dependencies": {
    "mongoose": "8.15.1",
    "mongoose-paginate-v2": "1.8.5",
    "prompts": "2.4.2",
    "uuid": "10.0.0"
  },
  "devDependencies": {
    "@payloadcms/eslint-config": "workspace:*",
    "@types/mongoose-aggregate-paginate-v2": "1.0.12",
    "@types/prompts": "^2.4.5",
    "@types/uuid": "10.0.0",
    "mongodb": "6.16.0",
    "mongodb-memory-server": "10.1.4",
    "payload": "workspace:*"
  },
  "peerDependencies": {
    "payload": "workspace:*"
  },
  "publishConfig": {
    "exports": {
      ".": {
        "import": "./dist/index.js",
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "./migration-utils": {
        "import": "./dist/exports/migration-utils.js",
        "types": "./dist/exports/migration-utils.d.ts",
        "default": "./dist/exports/migration-utils.js"
      },
      "./internal": {
        "import": "./dist/exports/internal.js",
        "types": "./dist/exports/internal.d.ts",
        "default": "./dist/exports/internal.js"
      }
    },
    "main": "./dist/index.js",
    "types": "./dist/index.d.ts"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: payload-main/packages/db-mongodb/README.md

```text
# Payload MongoDB Adapter

Official MongoDB adapter for [Payload](https://payloadcms.com).

- [Main Repository](https://github.com/payloadcms/payload)
- [Payload Docs](https://payloadcms.com/docs)

## Installation

```bash
npm install @payloadcms/db-mongodb
```

## Usage

```ts
import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'

export default buildConfig({
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
  // ...rest of config
})
```

More detailed usage can be found in the [Payload Docs](https://payloadcms.com/docs/configuration/overview).
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/packages/db-mongodb/tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "references": [{ "path": "../payload" }, { "path": "../translations" }],
  "compilerOptions": {
    // Do not include DOM and DOM.Iterable as this is a server-only package.
    "lib": ["ES2022"],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: connect.ts]---
Location: payload-main/packages/db-mongodb/src/connect.ts

```typescript
import type { ConnectOptions } from 'mongoose'
import type { Connect, Migration } from 'payload'

import mongoose from 'mongoose'
import { defaultBeginTransaction } from 'payload'

import type { MongooseAdapter } from './index.js'

export const connect: Connect = async function connect(
  this: MongooseAdapter,
  options = {
    hotReload: false,
  },
) {
  const { hotReload } = options

  if (this.url === false) {
    return
  }

  if (typeof this.url !== 'string') {
    throw new Error('Error: missing MongoDB connection URL.')
  }

  const urlToConnect = this.url

  const connectionOptions: { useFacet: undefined } & ConnectOptions = {
    autoIndex: true,
    ...this.connectOptions,
    useFacet: undefined,
  }

  if (hotReload) {
    connectionOptions.autoIndex = false
  }

  try {
    if (!this.connection) {
      this.connection = await mongoose.createConnection(urlToConnect, connectionOptions).asPromise()
      if (this.afterCreateConnection) {
        await this.afterCreateConnection(this)
      }
    }

    await this.connection.openUri(urlToConnect, connectionOptions)

    if (this.afterOpenConnection) {
      await this.afterOpenConnection(this)
    }

    if (this.useAlternativeDropDatabase) {
      if (this.connection.db) {
        // Firestore doesn't support dropDatabase, so we monkey patch
        // dropDatabase to delete all documents from all collections instead
        this.connection.db.dropDatabase = async function (): Promise<boolean> {
          const existingCollections = await this.listCollections().toArray()
          await Promise.all(
            existingCollections.map(async (collectionInfo) => {
              const collection = this.collection(collectionInfo.name)
              await collection.deleteMany({})
            }),
          )
          return true
        }
        this.connection.dropDatabase = async function () {
          await this.db?.dropDatabase()
        }
      }
    }

    // If we are running a replica set with MongoDB Memory Server,
    // wait until the replica set elects a primary before proceeding
    if (this.mongoMemoryServer) {
      this.payload.logger.info(
        'Waiting for MongoDB Memory Server replica set to elect a primary...',
      )
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }

    if (!this.connection.getClient().options.replicaSet) {
      this.transactionOptions = false
      this.beginTransaction = defaultBeginTransaction()
    }

    if (!hotReload) {
      if (process.env.PAYLOAD_DROP_DATABASE === 'true') {
        this.payload.logger.info('---- DROPPING DATABASE ----')
        await this.connection.dropDatabase()

        this.payload.logger.info('---- DROPPED DATABASE ----')
      }
    }

    if (this.ensureIndexes) {
      await Promise.all(
        this.payload.config.collections.map(async (coll) => {
          await this.collections[coll.slug]?.ensureIndexes()
        }),
      )
    }

    if (process.env.NODE_ENV === 'production' && this.prodMigrations) {
      await this.migrate({ migrations: this.prodMigrations as unknown as Migration[] })
    }
  } catch (err) {
    let msg = `Error: cannot connect to MongoDB.`

    if (typeof err === 'object' && err && 'message' in err && typeof err.message === 'string') {
      msg = `${msg} Details: ${err.message}`
    }

    this.payload.logger.error({
      err,
      msg,
    })
    throw new Error(`Error: cannot connect to MongoDB: ${msg}`)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: count.ts]---
Location: payload-main/packages/db-mongodb/src/count.ts

```typescript
import type { CountOptions } from 'mongodb'
import type { Count } from 'payload'

import { flattenWhereToOperators } from 'payload'

import type { MongooseAdapter } from './index.js'

import { buildQuery } from './queries/buildQuery.js'
import { getCollection } from './utilities/getEntity.js'
import { getSession } from './utilities/getSession.js'

export const count: Count = async function count(
  this: MongooseAdapter,
  { collection: collectionSlug, locale, req, where = {} },
) {
  const { collectionConfig, Model } = getCollection({ adapter: this, collectionSlug })

  let hasNearConstraint = false

  if (where) {
    const constraints = flattenWhereToOperators(where)
    hasNearConstraint = constraints.some((prop) => Object.keys(prop).some((key) => key === 'near'))
  }

  const query = await buildQuery({
    adapter: this,
    collectionSlug,
    fields: collectionConfig.flattenedFields,
    locale,
    where,
  })

  // useEstimatedCount is faster, but not accurate, as it ignores any filters. It is thus set to true if there are no filters.
  const useEstimatedCount = hasNearConstraint || !query || Object.keys(query).length === 0

  const options: CountOptions = {
    session: await getSession(this, req),
  }

  if (!useEstimatedCount && Object.keys(query).length === 0 && this.disableIndexHints !== true) {
    // Improve the performance of the countDocuments query which is used if useEstimatedCount is set to false by adding
    // a hint. By default, if no hint is provided, MongoDB does not use an indexed field to count the returned documents,
    // which makes queries very slow. This only happens when no query (filter) is provided. If one is provided, it uses
    // the correct indexed field
    options.hint = {
      _id: 1,
    }
  }

  let result: number
  if (useEstimatedCount) {
    result = await Model.estimatedDocumentCount({ session: options.session })
  } else {
    result = await Model.countDocuments(query, options)
  }

  return {
    totalDocs: result,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: countGlobalVersions.ts]---
Location: payload-main/packages/db-mongodb/src/countGlobalVersions.ts

```typescript
import type { CountOptions } from 'mongodb'
import type { CountGlobalVersions } from 'payload'

import { buildVersionGlobalFields, flattenWhereToOperators } from 'payload'

import type { MongooseAdapter } from './index.js'

import { buildQuery } from './queries/buildQuery.js'
import { getGlobal } from './utilities/getEntity.js'
import { getSession } from './utilities/getSession.js'

export const countGlobalVersions: CountGlobalVersions = async function countGlobalVersions(
  this: MongooseAdapter,
  { global: globalSlug, locale, req, where = {} },
) {
  const { globalConfig, Model } = getGlobal({ adapter: this, globalSlug, versions: true })

  let hasNearConstraint = false

  if (where) {
    const constraints = flattenWhereToOperators(where)
    hasNearConstraint = constraints.some((prop) => Object.keys(prop).some((key) => key === 'near'))
  }

  const query = await buildQuery({
    adapter: this,
    fields: buildVersionGlobalFields(this.payload.config, globalConfig, true),
    locale,
    where,
  })

  // useEstimatedCount is faster, but not accurate, as it ignores any filters. It is thus set to true if there are no filters.
  const useEstimatedCount = hasNearConstraint || !query || Object.keys(query).length === 0

  const options: CountOptions = {
    session: await getSession(this, req),
  }

  if (!useEstimatedCount && Object.keys(query).length === 0 && this.disableIndexHints !== true) {
    // Improve the performance of the countDocuments query which is used if useEstimatedCount is set to false by adding
    // a hint. By default, if no hint is provided, MongoDB does not use an indexed field to count the returned documents,
    // which makes queries very slow. This only happens when no query (filter) is provided. If one is provided, it uses
    // the correct indexed field
    options.hint = {
      _id: 1,
    }
  }

  let result: number
  if (useEstimatedCount) {
    result = await Model.estimatedDocumentCount({ session: options.session })
  } else {
    result = await Model.countDocuments(query, options)
  }

  return {
    totalDocs: result,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: countVersions.ts]---
Location: payload-main/packages/db-mongodb/src/countVersions.ts

```typescript
import type { CountOptions } from 'mongodb'
import type { CountVersions } from 'payload'

import { buildVersionCollectionFields, flattenWhereToOperators } from 'payload'

import type { MongooseAdapter } from './index.js'

import { buildQuery } from './queries/buildQuery.js'
import { getCollection } from './utilities/getEntity.js'
import { getSession } from './utilities/getSession.js'

export const countVersions: CountVersions = async function countVersions(
  this: MongooseAdapter,
  { collection: collectionSlug, locale, req, where = {} },
) {
  const { collectionConfig, Model } = getCollection({
    adapter: this,
    collectionSlug,
    versions: true,
  })

  let hasNearConstraint = false

  if (where) {
    const constraints = flattenWhereToOperators(where)
    hasNearConstraint = constraints.some((prop) => Object.keys(prop).some((key) => key === 'near'))
  }

  const query = await buildQuery({
    adapter: this,
    fields: buildVersionCollectionFields(this.payload.config, collectionConfig, true),
    locale,
    where,
  })

  // useEstimatedCount is faster, but not accurate, as it ignores any filters. It is thus set to true if there are no filters.
  const useEstimatedCount = hasNearConstraint || !query || Object.keys(query).length === 0

  const options: CountOptions = {
    session: await getSession(this, req),
  }

  if (!useEstimatedCount && Object.keys(query).length === 0 && this.disableIndexHints !== true) {
    // Improve the performance of the countDocuments query which is used if useEstimatedCount is set to false by adding
    // a hint. By default, if no hint is provided, MongoDB does not use an indexed field to count the returned documents,
    // which makes queries very slow. This only happens when no query (filter) is provided. If one is provided, it uses
    // the correct indexed field
    options.hint = {
      _id: 1,
    }
  }

  let result: number
  if (useEstimatedCount) {
    result = await Model.estimatedDocumentCount({ session: options.session })
  } else {
    result = await Model.countDocuments(query, options)
  }

  return {
    totalDocs: result,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: create.ts]---
Location: payload-main/packages/db-mongodb/src/create.ts

```typescript
import type { Create } from 'payload'

import { type CreateOptions, Types } from 'mongoose'

import type { MongooseAdapter } from './index.js'

import { getCollection } from './utilities/getEntity.js'
import { getSession } from './utilities/getSession.js'
import { handleError } from './utilities/handleError.js'
import { transform } from './utilities/transform.js'

export const create: Create = async function create(
  this: MongooseAdapter,
  { collection: collectionSlug, data, req, returning },
) {
  const { collectionConfig, customIDType, Model } = getCollection({ adapter: this, collectionSlug })

  let doc

  if (!data.createdAt) {
    data.createdAt = new Date().toISOString()
  }

  transform({
    adapter: this,
    data,
    fields: collectionConfig.fields,
    operation: 'write',
  })

  if (customIDType) {
    data._id = data.id
  } else if (this.allowIDOnCreate && data.id) {
    try {
      data._id = new Types.ObjectId(data.id as string)
    } catch (error) {
      this.payload.logger.error(
        `It appears you passed ID to create operation data but it cannot be sanitized to ObjectID, value - ${JSON.stringify(data.id)}`,
      )
      throw error
    }
  }

  const options: CreateOptions = {
    session: await getSession(this, req),
    // Timestamps are manually added by the write transform
    timestamps: false,
  }

  try {
    ;[doc] = await Model.create([data], options)
  } catch (error) {
    handleError({ collection: collectionSlug, error, req })
  }
  if (returning === false) {
    return null
  }

  doc = doc.toObject()

  transform({
    adapter: this,
    data: doc,
    fields: collectionConfig.fields,
    operation: 'read',
  })

  return doc
}
```

--------------------------------------------------------------------------------

---[FILE: createGlobal.ts]---
Location: payload-main/packages/db-mongodb/src/createGlobal.ts

```typescript
import type { CreateOptions } from 'mongoose'

import { type CreateGlobal } from 'payload'

import type { MongooseAdapter } from './index.js'

import { getGlobal } from './utilities/getEntity.js'
import { getSession } from './utilities/getSession.js'
import { transform } from './utilities/transform.js'

export const createGlobal: CreateGlobal = async function createGlobal(
  this: MongooseAdapter,
  { slug: globalSlug, data, req, returning },
) {
  const { globalConfig, Model } = getGlobal({ adapter: this, globalSlug })

  if (!data.createdAt) {
    ;(data as any).createdAt = new Date().toISOString()
  }

  transform({
    adapter: this,
    data,
    fields: globalConfig.fields,
    globalSlug,
    operation: 'write',
  })

  const options: CreateOptions = {
    session: await getSession(this, req),
    // Timestamps are manually added by the write transform
    timestamps: false,
  }

  let [result] = (await Model.create([data], options)) as any
  if (returning === false) {
    return null
  }

  result = result.toObject()

  transform({
    adapter: this,
    data: result,
    fields: globalConfig.fields,
    operation: 'read',
  })

  return result
}
```

--------------------------------------------------------------------------------

---[FILE: createGlobalVersion.ts]---
Location: payload-main/packages/db-mongodb/src/createGlobalVersion.ts

```typescript
import { buildVersionGlobalFields, type CreateGlobalVersion } from 'payload'

import type { MongooseAdapter } from './index.js'

import { getGlobal } from './utilities/getEntity.js'
import { getSession } from './utilities/getSession.js'
import { transform } from './utilities/transform.js'

export const createGlobalVersion: CreateGlobalVersion = async function createGlobalVersion(
  this: MongooseAdapter,
  {
    autosave,
    createdAt,
    globalSlug,
    publishedLocale,
    req,
    returning,
    snapshot,
    updatedAt,
    versionData,
  },
) {
  const { globalConfig, Model } = getGlobal({ adapter: this, globalSlug, versions: true })

  const data = {
    autosave,
    createdAt,
    latest: true,
    publishedLocale,
    snapshot,
    updatedAt,
    version: versionData,
  }
  if (!data.createdAt) {
    data.createdAt = new Date().toISOString()
  }

  const fields = buildVersionGlobalFields(this.payload.config, globalConfig)

  transform({
    adapter: this,
    data,
    fields,
    operation: 'write',
  })

  const options = {
    session: await getSession(this, req),
    // Timestamps are manually added by the write transform
    timestamps: false,
  }

  let [doc] = await Model.create([data], options, req)

  await Model.updateMany(
    {
      $and: [
        {
          _id: {
            $ne: doc._id,
          },
        },
        {
          latest: {
            $eq: true,
          },
        },
      ],
    },
    { $unset: { latest: 1 } },
    options,
  )

  if (returning === false) {
    return null
  }

  doc = doc.toObject()

  transform({
    adapter: this,
    data: doc,
    fields,
    operation: 'read',
  })

  return doc
}
```

--------------------------------------------------------------------------------

---[FILE: createMigration.ts]---
Location: payload-main/packages/db-mongodb/src/createMigration.ts

```typescript
import type { CreateMigration, MigrationTemplateArgs } from 'payload'

import fs from 'fs'
import path from 'path'
import { getPredefinedMigration, writeMigrationIndex } from 'payload'
import { fileURLToPath } from 'url'

const migrationTemplate = ({ downSQL, imports, upSQL }: MigrationTemplateArgs): string => `import {
  MigrateDownArgs,
  MigrateUpArgs,
} from '@payloadcms/db-mongodb'
${imports ?? ''}
export async function up({ payload, req, session }: MigrateUpArgs): Promise<void> {
${upSQL ?? `  // Migration code`}
}

export async function down({ payload, req, session }: MigrateDownArgs): Promise<void> {
${downSQL ?? `  // Migration code`}
}
`

export const createMigration: CreateMigration = async function createMigration({
  file,
  migrationName,
  payload,
  skipEmpty,
}) {
  const filename = fileURLToPath(import.meta.url)
  const dirname = path.dirname(filename)

  const dir = payload.db.migrationDir
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
  const predefinedMigration = await getPredefinedMigration({
    dirname,
    file,
    migrationName,
    payload,
  })

  const migrationFileContent = migrationTemplate(predefinedMigration)

  const [yyymmdd, hhmmss] = new Date().toISOString().split('T')

  const formattedDate = yyymmdd!.replace(/\D/g, '')
  const formattedTime = hhmmss!.split('.')[0]!.replace(/\D/g, '')

  const timestamp = `${formattedDate}_${formattedTime}`

  const formattedName = migrationName?.replace(/\W/g, '_')
  const fileName = migrationName ? `${timestamp}_${formattedName}.ts` : `${timestamp}_migration.ts`
  const filePath = `${dir}/${fileName}`

  if (!skipEmpty) {
    fs.writeFileSync(filePath, migrationFileContent)
  }

  writeMigrationIndex({ migrationsDir: payload.db.migrationDir })

  payload.logger.info({ msg: `Migration created at ${filePath}` })
}
```

--------------------------------------------------------------------------------

---[FILE: createVersion.ts]---
Location: payload-main/packages/db-mongodb/src/createVersion.ts

```typescript
import { buildVersionCollectionFields, type CreateVersion } from 'payload'

import type { MongooseAdapter } from './index.js'

import { getCollection } from './utilities/getEntity.js'
import { getSession } from './utilities/getSession.js'
import { transform } from './utilities/transform.js'

export const createVersion: CreateVersion = async function createVersion(
  this: MongooseAdapter,
  {
    autosave,
    collectionSlug,
    createdAt,
    parent,
    publishedLocale,
    req,
    returning,
    snapshot,
    updatedAt,
    versionData,
  },
) {
  const { collectionConfig, Model } = getCollection({
    adapter: this,
    collectionSlug,
    versions: true,
  })

  const data = {
    autosave,
    createdAt,
    latest: true,
    parent,
    publishedLocale,
    snapshot,
    updatedAt,
    version: versionData,
  }
  if (!data.createdAt) {
    data.createdAt = new Date().toISOString()
  }

  const fields = buildVersionCollectionFields(this.payload.config, collectionConfig)

  transform({
    adapter: this,
    data,
    fields,
    operation: 'write',
  })

  const options = {
    session: await getSession(this, req),
    // Timestamps are manually added by the write transform
    timestamps: false,
  }

  let [doc] = await Model.create([data], options, req)

  const parentQuery = {
    $or: [
      {
        parent: {
          $eq: data.parent,
        },
      },
    ],
  }

  await Model.updateMany(
    {
      $and: [
        {
          _id: {
            $ne: doc._id,
          },
        },
        parentQuery,
        {
          latest: {
            $eq: true,
          },
        },
        {
          updatedAt: {
            $lt: new Date(doc.updatedAt),
          },
        },
      ],
    },
    { $unset: { latest: 1 } },
    options,
  )

  if (returning === false) {
    return null
  }

  doc = doc.toObject()

  transform({
    adapter: this,
    data: doc,
    fields,
    operation: 'read',
  })

  return doc
}
```

--------------------------------------------------------------------------------

---[FILE: deleteMany.ts]---
Location: payload-main/packages/db-mongodb/src/deleteMany.ts

```typescript
import type { DeleteOptions } from 'mongodb'

import { type DeleteMany } from 'payload'

import type { MongooseAdapter } from './index.js'

import { buildQuery } from './queries/buildQuery.js'
import { getCollection } from './utilities/getEntity.js'
import { getSession } from './utilities/getSession.js'

export const deleteMany: DeleteMany = async function deleteMany(
  this: MongooseAdapter,
  { collection: collectionSlug, req, where },
) {
  const { collectionConfig, Model } = getCollection({ adapter: this, collectionSlug })

  const query = await buildQuery({
    adapter: this,
    collectionSlug,
    fields: collectionConfig.flattenedFields,
    where,
  })

  const options: DeleteOptions = {
    session: await getSession(this, req),
  }

  await Model.deleteMany(query, options)
}
```

--------------------------------------------------------------------------------

---[FILE: deleteOne.ts]---
Location: payload-main/packages/db-mongodb/src/deleteOne.ts

```typescript
import type { MongooseUpdateQueryOptions } from 'mongoose'
import type { DeleteOne } from 'payload'

import type { MongooseAdapter } from './index.js'

import { buildQuery } from './queries/buildQuery.js'
import { buildProjectionFromSelect } from './utilities/buildProjectionFromSelect.js'
import { getCollection } from './utilities/getEntity.js'
import { getSession } from './utilities/getSession.js'
import { transform } from './utilities/transform.js'

export const deleteOne: DeleteOne = async function deleteOne(
  this: MongooseAdapter,
  { collection: collectionSlug, req, returning, select, where },
) {
  const { collectionConfig, Model } = getCollection({ adapter: this, collectionSlug })

  const query = await buildQuery({
    adapter: this,
    collectionSlug,
    fields: collectionConfig.flattenedFields,
    where,
  })

  const options: MongooseUpdateQueryOptions = {
    projection: buildProjectionFromSelect({
      adapter: this,
      fields: collectionConfig.flattenedFields,
      select,
    }),
    session: await getSession(this, req),
  }

  if (returning === false) {
    await Model.deleteOne(query, options)?.lean()
    return null
  }

  const doc = await Model.findOneAndDelete(query, options)?.lean()

  if (!doc) {
    return null
  }

  transform({
    adapter: this,
    data: doc,
    fields: collectionConfig.fields,
    operation: 'read',
  })

  return doc
}
```

--------------------------------------------------------------------------------

---[FILE: deleteVersions.ts]---
Location: payload-main/packages/db-mongodb/src/deleteVersions.ts

```typescript
import type { DeleteVersions, FlattenedField } from 'payload'

import { APIError, buildVersionCollectionFields, buildVersionGlobalFields } from 'payload'

import type { MongooseAdapter } from './index.js'
import type { CollectionModel } from './types.js'

import { buildQuery } from './queries/buildQuery.js'
import { getCollection, getGlobal } from './utilities/getEntity.js'
import { getSession } from './utilities/getSession.js'

export const deleteVersions: DeleteVersions = async function deleteVersions(
  this: MongooseAdapter,
  { collection: collectionSlug, globalSlug, locale, req, where },
) {
  let fields: FlattenedField[]
  let VersionsModel: CollectionModel

  if (globalSlug) {
    const { globalConfig, Model } = getGlobal({
      adapter: this,
      globalSlug,
      versions: true,
    })
    fields = buildVersionGlobalFields(this.payload.config, globalConfig, true)
    VersionsModel = Model
  } else if (collectionSlug) {
    const { collectionConfig, Model } = getCollection({
      adapter: this,
      collectionSlug,
      versions: true,
    })
    fields = buildVersionCollectionFields(this.payload.config, collectionConfig, true)
    VersionsModel = Model
  } else {
    throw new APIError('Either collection or globalSlug must be passed.')
  }

  const query = await buildQuery({
    adapter: this,
    fields,
    locale,
    where,
  })

  const session = await getSession(this, req)

  await VersionsModel.deleteMany(query, { session })
}
```

--------------------------------------------------------------------------------

````
