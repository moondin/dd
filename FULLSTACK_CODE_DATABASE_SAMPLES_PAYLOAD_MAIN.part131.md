---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 131
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 131 of 695)

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

---[FILE: index.ts]---
Location: payload-main/packages/db-postgres/src/index.ts

```typescript
import type { DatabaseAdapterObj, Payload } from 'payload'

import {
  beginTransaction,
  buildCreateMigration,
  commitTransaction,
  count,
  countGlobalVersions,
  countVersions,
  create,
  createGlobal,
  createGlobalVersion,
  createSchemaGenerator,
  createVersion,
  deleteMany,
  deleteOne,
  deleteVersions,
  destroy,
  find,
  findDistinct,
  findGlobal,
  findGlobalVersions,
  findOne,
  findVersions,
  migrate,
  migrateDown,
  migrateFresh,
  migrateRefresh,
  migrateReset,
  migrateStatus,
  operatorMap,
  queryDrafts,
  rollbackTransaction,
  updateGlobal,
  updateGlobalVersion,
  updateJobs,
  updateMany,
  updateOne,
  updateVersion,
  upsert,
} from '@payloadcms/drizzle'
import {
  columnToCodeConverter,
  countDistinct,
  createDatabase,
  createExtensions,
  createJSONQuery,
  defaultDrizzleSnapshot,
  deleteWhere,
  dropDatabase,
  execute,
  init,
  insert,
  requireDrizzleKit,
} from '@payloadcms/drizzle/postgres'
import { pgEnum, pgSchema, pgTable } from 'drizzle-orm/pg-core'
import { createDatabaseAdapter, defaultBeginTransaction, findMigrationDir } from 'payload'
import pgDependency from 'pg'
import { fileURLToPath } from 'url'

import type { Args, PostgresAdapter } from './types.js'

import { connect } from './connect.js'

const filename = fileURLToPath(import.meta.url)

export function postgresAdapter(args: Args): DatabaseAdapterObj<PostgresAdapter> {
  const postgresIDType = args.idType || 'serial'
  const payloadIDType = postgresIDType === 'serial' ? 'number' : 'text'
  const allowIDOnCreate = args.allowIDOnCreate ?? false

  function adapter({ payload }: { payload: Payload }) {
    const migrationDir = findMigrationDir(args.migrationDir)
    let resolveInitializing
    let rejectInitializing
    let adapterSchema: PostgresAdapter['pgSchema']

    const initializing = new Promise<void>((res, rej) => {
      resolveInitializing = res
      rejectInitializing = rej
    })

    if (args.schemaName) {
      adapterSchema = pgSchema(args.schemaName)
    } else {
      // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
      adapterSchema = { enum: pgEnum, table: pgTable }
    }

    const extensions = (args.extensions ?? []).reduce(
      (acc, name) => {
        acc[name] = true
        return acc
      },
      {} as Record<string, boolean>,
    )

    return createDatabaseAdapter<PostgresAdapter>({
      name: 'postgres',
      afterSchemaInit: args.afterSchemaInit ?? [],
      allowIDOnCreate,
      beforeSchemaInit: args.beforeSchemaInit ?? [],
      blocksAsJSON: args.blocksAsJSON ?? false,
      createDatabase,
      createExtensions,
      createMigration: buildCreateMigration({
        executeMethod: 'execute',
        filename,
        sanitizeStatements({ sqlExecute, statements }) {
          return `${sqlExecute}\n ${statements.join('\n')}\`)`
        },
      }),
      defaultDrizzleSnapshot,
      disableCreateDatabase: args.disableCreateDatabase ?? false,
      // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
      drizzle: undefined,
      enums: {},
      extensions,
      features: {
        json: true,
      },
      fieldConstraints: {},
      findDistinct,
      generateSchema: createSchemaGenerator({
        columnToCodeConverter,
        corePackageSuffix: 'pg-core',
        defaultOutputFile: args.generateSchemaOutputFile,
        enumImport: 'pgEnum',
        schemaImport: 'pgSchema',
        tableImport: 'pgTable',
      }),
      idType: postgresIDType,
      initializing,
      localesSuffix: args.localesSuffix || '_locales',
      logger: args.logger,
      operators: operatorMap,
      pg: args.pg || pgDependency,
      pgSchema: adapterSchema,
      // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
      pool: undefined,
      poolOptions: args.pool,
      prodMigrations: args.prodMigrations,
      // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
      push: args.push,
      readReplicaOptions: args.readReplicas,
      relations: {},
      relationshipsSuffix: args.relationshipsSuffix || '_rels',
      schema: {},
      schemaName: args.schemaName,
      sessions: {},
      tableNameMap: new Map<string, string>(),
      tables: {},
      tablesFilter: args.tablesFilter,
      transactionOptions: args.transactionOptions || undefined,
      versionsSuffix: args.versionsSuffix || '_v',

      // DatabaseAdapter
      beginTransaction:
        args.transactionOptions === false ? defaultBeginTransaction() : beginTransaction,
      commitTransaction,
      connect,
      count,
      countDistinct,
      countGlobalVersions,
      countVersions,
      create,
      createGlobal,
      createGlobalVersion,
      createJSONQuery,
      createVersion,
      defaultIDType: payloadIDType,
      deleteMany,
      deleteOne,
      deleteVersions,
      deleteWhere,
      destroy,
      dropDatabase,
      execute,
      find,
      findGlobal,
      findGlobalVersions,
      findOne,
      findVersions,
      foreignKeys: new Set(),
      indexes: new Set<string>(),
      init,
      insert,
      migrate,
      migrateDown,
      migrateFresh,
      migrateRefresh,
      migrateReset,
      migrateStatus,
      migrationDir,
      packageName: '@payloadcms/db-postgres',
      payload,
      queryDrafts,
      rawRelations: {},
      rawTables: {},
      updateJobs,
      // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
      rejectInitializing,
      requireDrizzleKit,
      // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
      resolveInitializing,
      rollbackTransaction,
      updateGlobal,
      updateGlobalVersion,
      updateMany,
      updateOne,
      updateVersion,
      upsert,
    })
  }

  return {
    name: 'postgres',
    allowIDOnCreate,
    defaultIDType: payloadIDType,
    init: adapter,
  }
}

export type {
  Args as PostgresAdapterArgs,
  GeneratedDatabaseSchema,
  PostgresAdapter,
} from './types.js'
export type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/drizzle/postgres'
export { geometryColumn } from '@payloadcms/drizzle/postgres'
export { sql } from 'drizzle-orm'
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/db-postgres/src/types.ts

```typescript
import type {
  BasePostgresAdapter,
  GenericEnum,
  MigrateDownArgs,
  MigrateUpArgs,
  PostgresSchemaHook,
} from '@payloadcms/drizzle/postgres'
import type { DrizzleAdapter } from '@payloadcms/drizzle/types'
import type { DrizzleConfig, ExtractTablesWithRelations } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import type {
  PgDatabase,
  PgQueryResultHKT,
  PgSchema,
  PgTableFn,
  PgTransactionConfig,
  PgWithReplicas,
} from 'drizzle-orm/pg-core'
import type { Pool, PoolConfig } from 'pg'

type PgDependency = typeof import('pg')

export type Args = {
  /**
   * Transform the schema after it's built.
   * You can use it to customize the schema with features that aren't supported by Payload.
   * Examples may include: composite indices, generated columns, vectors
   */
  afterSchemaInit?: PostgresSchemaHook[]
  /**
   * Enable this flag if you want to thread your own ID to create operation data, for example:
   * ```ts
   * // doc created with id 1
   * const doc = await payload.create({ collection: 'posts', data: {id: 1, title: "my title"}})
   * ```
   */
  allowIDOnCreate?: boolean
  /**
   * Transform the schema before it's built.
   * You can use it to preserve an existing database schema and if there are any collissions Payload will override them.
   * To generate Drizzle schema from the database, see [Drizzle Kit introspection](https://orm.drizzle.team/kit-docs/commands#introspect--pull)
   */
  beforeSchemaInit?: PostgresSchemaHook[]
  /**
   * Store blocks as JSON column instead of storing them in relational structure.
   */
  blocksAsJSON?: boolean
  /**
   * Pass `true` to disale auto database creation if it doesn't exist.
   * @default false
   */
  disableCreateDatabase?: boolean
  extensions?: string[]
  /** Generated schema from payload generate:db-schema file path */
  generateSchemaOutputFile?: string
  idType?: 'serial' | 'uuid'
  localesSuffix?: string
  logger?: DrizzleConfig['logger']
  migrationDir?: string
  pg?: PgDependency
  pool: PoolConfig
  prodMigrations?: {
    down: (args: MigrateDownArgs) => Promise<void>
    name: string
    up: (args: MigrateUpArgs) => Promise<void>
  }[]
  push?: boolean
  readReplicas?: string[]
  relationshipsSuffix?: string
  /**
   * The schema name to use for the database
   *
   * @experimental This only works when there are not other tables or enums of the same name in the database under a different schema. Awaiting fix from Drizzle.
   */
  schemaName?: string
  tablesFilter?: string[]
  transactionOptions?: false | PgTransactionConfig
  versionsSuffix?: string
}

export interface GeneratedDatabaseSchema {
  schemaUntyped: Record<string, unknown>
}

type ResolveSchemaType<T> = 'schema' extends keyof T
  ? T['schema']
  : GeneratedDatabaseSchema['schemaUntyped']

type Drizzle =
  | NodePgDatabase<ResolveSchemaType<GeneratedDatabaseSchema>>
  | PgWithReplicas<NodePgDatabase<ResolveSchemaType<GeneratedDatabaseSchema>>>

export type PostgresAdapter = {
  drizzle: Drizzle
  pg: PgDependency
  pool: Pool
  poolOptions: PoolConfig
} & BasePostgresAdapter

declare module 'payload' {
  export interface DatabaseAdapter
    extends Omit<Args, 'idType' | 'logger' | 'migrationDir' | 'pool'>,
      DrizzleAdapter {
    afterSchemaInit: PostgresSchemaHook[]

    beforeSchemaInit: PostgresSchemaHook[]
    beginTransaction: (options?: PgTransactionConfig) => Promise<null | number | string>
    drizzle: Drizzle
    enums: Record<string, GenericEnum>
    extensions: Record<string, boolean>
    /**
     * An object keyed on each table, with a key value pair where the constraint name is the key, followed by the dot-notation field name
     * Used for returning properly formed errors from unique fields
     */
    fieldConstraints: Record<string, Record<string, string>>
    idType: Args['idType']
    initializing: Promise<void>
    localesSuffix?: string
    logger: DrizzleConfig['logger']
    /** Optionally inject your own node-postgres. This is required if you wish to instrument the driver with @payloadcms/plugin-sentry. */
    pg?: PgDependency
    pgSchema?: { table: PgTableFn } | PgSchema
    pool: Pool
    poolOptions: Args['pool']
    prodMigrations?: {
      down: (args: MigrateDownArgs) => Promise<void>
      name: string
      up: (args: MigrateUpArgs) => Promise<void>
    }[]
    push: boolean
    rejectInitializing: () => void
    relationshipsSuffix?: string
    resolveInitializing: () => void
    schema: Record<string, unknown>
    schemaName?: Args['schemaName']
    tableNameMap: Map<string, string>
    tablesFilter?: string[]
    versionsSuffix?: string
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/db-postgres/src/drizzle-proxy/index.ts

```typescript
export * from 'drizzle-orm'
```

--------------------------------------------------------------------------------

---[FILE: node-postgres.ts]---
Location: payload-main/packages/db-postgres/src/drizzle-proxy/node-postgres.ts

```typescript
export * from 'drizzle-orm/node-postgres'
```

--------------------------------------------------------------------------------

---[FILE: pg-core.ts]---
Location: payload-main/packages/db-postgres/src/drizzle-proxy/pg-core.ts

```typescript
export * from 'drizzle-orm/pg-core'
```

--------------------------------------------------------------------------------

---[FILE: relations.ts]---
Location: payload-main/packages/db-postgres/src/drizzle-proxy/relations.ts

```typescript
export * from 'drizzle-orm/relations'
```

--------------------------------------------------------------------------------

---[FILE: migration-utils.ts]---
Location: payload-main/packages/db-postgres/src/exports/migration-utils.ts

```typescript
export { migratePostgresV2toV3 } from '@payloadcms/drizzle/postgres'
```

--------------------------------------------------------------------------------

---[FILE: types-deprecated.ts]---
Location: payload-main/packages/db-postgres/src/exports/types-deprecated.ts

```typescript
import type {
  Args as _Args,
  GeneratedDatabaseSchema as _GeneratedDatabaseSchema,
  PostgresAdapter as _PostgresAdapter,
} from '../types.js'

/**
 * @deprecated - import from `@payloadcms/db-postgres` instead
 */
export type Args = _Args

/**
 * @deprecated - import from `@payloadcms/db-postgres` instead
 */
export type GeneratedDatabaseSchema = _GeneratedDatabaseSchema

/**
 * @deprecated - import from `@payloadcms/db-postgres` instead
 */
export type PostgresAdapter = _PostgresAdapter
```

--------------------------------------------------------------------------------

---[FILE: relationships-v2-v3.ts]---
Location: payload-main/packages/db-postgres/src/predefinedMigrations/relationships-v2-v3.ts

```typescript
const imports = `import { migratePostgresV2toV3 } from '@payloadcms/db-postgres/migration-utils'`
const upSQL = `   await migratePostgresV2toV3({
        // enables logging of changes that will be made to the database
        debug: false,
        payload,
        req,
        })
`

export { imports, upSQL }
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/packages/db-sqlite/.gitignore

```text
/migrations
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: payload-main/packages/db-sqlite/.prettierignore

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

---[FILE: .swcrc]---
Location: payload-main/packages/db-sqlite/.swcrc

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

---[FILE: bundle.js]---
Location: payload-main/packages/db-sqlite/bundle.js

```javascript
import * as esbuild from 'esbuild'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
import { commonjs } from '@hyrious/esbuild-plugin-commonjs'

async function build() {
  const resultServer = await esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    platform: 'node',
    format: 'esm',
    outfile: 'dist/index.js',
    splitting: false,
    external: [
      '*.scss',
      '*.css',
      'drizzle-kit',
      'libsql',
      'pg',
      '@payloadcms/translations',
      '@payloadcms/drizzle',
      'payload',
      'payload/*',
    ],
    minify: true,
    metafile: true,
    tsconfig: path.resolve(dirname, './tsconfig.json'),
    plugins: [commonjs()],
    sourcemap: true,
  })
  console.log('db-sqlite bundled successfully')

  fs.writeFileSync('meta_server.json', JSON.stringify(resultServer.metafile))
}
await build()
```

--------------------------------------------------------------------------------

---[FILE: LICENSE.md]---
Location: payload-main/packages/db-sqlite/LICENSE.md

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
Location: payload-main/packages/db-sqlite/package.json

```json
{
  "name": "@payloadcms/db-sqlite",
  "version": "3.68.5",
  "description": "The officially supported SQLite database adapter for Payload",
  "homepage": "https://payloadcms.com",
  "repository": {
    "type": "git",
    "url": "https://github.com/payloadcms/payload.git",
    "directory": "packages/db-sqlite"
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
      "require": "./src/index.ts",
      "types": "./src/index.ts"
    },
    "./types": {
      "import": "./src/exports/types-deprecated.ts",
      "require": "./src/exports/types-deprecated.ts",
      "types": "./src/exports/types-deprecated.ts"
    },
    "./migration-utils": {
      "import": "./src/exports/migration-utils.ts",
      "require": "./src/exports/migration-utils.ts",
      "types": "./src/exports/migration-utils.ts"
    },
    "./drizzle": {
      "import": "./src/drizzle-proxy/index.ts",
      "types": "./src/drizzle-proxy/index.ts",
      "default": "./src/drizzle-proxy/index.ts"
    },
    "./drizzle/sqlite-core": {
      "import": "./src/drizzle-proxy/sqlite-core.ts",
      "types": "./src/drizzle-proxy/sqlite-core.ts",
      "default": "./src/drizzle-proxy/sqlite-core.ts"
    },
    "./drizzle/libsql": {
      "import": "./src/drizzle-proxy/libsql.ts",
      "types": "./src/drizzle-proxy/libsql.ts",
      "default": "./src/drizzle-proxy/libsql.ts"
    },
    "./drizzle/relations": {
      "import": "./src/drizzle-proxy/relations.ts",
      "types": "./src/drizzle-proxy/relations.ts",
      "default": "./src/drizzle-proxy/relations.ts"
    }
  },
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "files": [
    "dist",
    "mock.js"
  ],
  "scripts": {
    "build": "pnpm build:swc && pnpm build:types",
    "build:debug": "pnpm build",
    "build:swc": "swc ./src -d ./dist --config-file .swcrc --strip-leading-paths",
    "build:types": "tsc --emitDeclarationOnly --outDir dist",
    "clean": "rimraf -g {dist,*.tsbuildinfo}",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  },
  "dependencies": {
    "@libsql/client": "0.14.0",
    "@payloadcms/drizzle": "workspace:*",
    "console-table-printer": "2.12.1",
    "drizzle-kit": "0.31.7",
    "drizzle-orm": "0.44.7",
    "prompts": "2.4.2",
    "to-snake-case": "1.0.0",
    "uuid": "9.0.0"
  },
  "devDependencies": {
    "@payloadcms/eslint-config": "workspace:*",
    "@types/pg": "8.10.2",
    "@types/to-snake-case": "1.0.0",
    "@types/uuid": "10.0.0",
    "payload": "workspace:*"
  },
  "peerDependencies": {
    "payload": "workspace:*"
  },
  "publishConfig": {
    "exports": {
      ".": {
        "import": "./dist/index.js",
        "require": "./dist/index.js",
        "types": "./dist/index.d.ts"
      },
      "./types": {
        "import": "./dist/exports/types-deprecated.js",
        "require": "./dist/exports/types-deprecated.js",
        "types": "./dist/exports/types-deprecated.d.ts"
      },
      "./migration-utils": {
        "import": "./dist/exports/migration-utils.js",
        "require": "./dist/exports/migration-utils.js",
        "types": "./dist/exports/migration-utils.d.ts"
      },
      "./drizzle": {
        "import": "./dist/drizzle-proxy/index.js",
        "types": "./dist/drizzle-proxy/index.d.ts",
        "default": "./dist/drizzle-proxy/index.js"
      },
      "./drizzle/sqlite-core": {
        "import": "./dist/drizzle-proxy/sqlite-core.js",
        "types": "./dist/drizzle-proxy/sqlite-core.d.ts",
        "default": "./dist/drizzle-proxy/sqlite-core.js"
      },
      "./drizzle/libsql": {
        "import": "./dist/drizzle-proxy/libsql.js",
        "types": "./dist/drizzle-proxy/libsql.d.ts",
        "default": "./dist/drizzle-proxy/libsql.js"
      },
      "./drizzle/relations": {
        "import": "./dist/drizzle-proxy/relations.js",
        "types": "./dist/drizzle-proxy/relations.d.ts",
        "default": "./dist/drizzle-proxy/relations.js"
      }
    },
    "main": "./dist/index.js",
    "types": "./dist/index.d.ts"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: payload-main/packages/db-sqlite/README.md

```text
# Payload SQLite Adapter

Official SQLite adapter for [Payload](https://payloadcms.com).

- [Main Repository](https://github.com/payloadcms/payload)
- [Payload Docs](https://payloadcms.com/docs)

## Installation

```bash
npm install @payloadcms/db-sqlite
```

## Usage

```ts
import { buildConfig } from 'payload/config'
import { sqliteAdapter } from '@payloadcms/db-sqlite'

export default buildConfig({
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI,
    },
  }),
  // ...rest of config
})
```

More detailed usage can be found in the [Payload Docs](https://payloadcms.com/docs/configuration/overview).
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/packages/db-sqlite/tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "references": [
    {
      "path": "../payload"
    },
    {
      "path": "../translations"
    },
    {
      "path": "../drizzle"
    }
  ],
  "compilerOptions": {
    // Do not include DOM and DOM.Iterable as this is a server-only package.
    "lib": ["ES2022"],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: connect.ts]---
Location: payload-main/packages/db-sqlite/src/connect.ts

```typescript
import type { DrizzleAdapter } from '@payloadcms/drizzle/types'
import type { Connect, Migration } from 'payload'

import { createClient } from '@libsql/client'
import { pushDevSchema } from '@payloadcms/drizzle'
import { drizzle } from 'drizzle-orm/libsql'

import type { SQLiteAdapter } from './types.js'

export const connect: Connect = async function connect(
  this: SQLiteAdapter,
  options = {
    hotReload: false,
  },
) {
  const { hotReload } = options

  try {
    if (!this.client) {
      this.client = createClient(this.clientConfig)
    }

    const logger = this.logger || false
    this.drizzle = drizzle(this.client, { logger, schema: this.schema })

    if (!hotReload) {
      if (process.env.PAYLOAD_DROP_DATABASE === 'true') {
        this.payload.logger.info(`---- DROPPING TABLES ----`)
        await this.dropDatabase({ adapter: this })
        this.payload.logger.info('---- DROPPED TABLES ----')
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    this.payload.logger.error({ err, msg: `Error: cannot connect to SQLite: ${message}` })
    if (typeof this.rejectInitializing === 'function') {
      this.rejectInitializing()
    }
    throw new Error(`Error: cannot connect to SQLite: ${message}`)
  }

  // Only push schema if not in production
  if (
    process.env.NODE_ENV !== 'production' &&
    process.env.PAYLOAD_MIGRATING !== 'true' &&
    this.push !== false
  ) {
    await pushDevSchema(this as unknown as DrizzleAdapter)
  }

  if (typeof this.resolveInitializing === 'function') {
    this.resolveInitializing()
  }

  if (process.env.NODE_ENV === 'production' && this.prodMigrations) {
    await this.migrate({ migrations: this.prodMigrations as Migration[] })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/db-sqlite/src/index.ts

```typescript
import type { Operators } from '@payloadcms/drizzle'
import type { DatabaseAdapterObj, Payload } from 'payload'

import {
  beginTransaction,
  buildCreateMigration,
  commitTransaction,
  count,
  countGlobalVersions,
  countVersions,
  create,
  createGlobal,
  createGlobalVersion,
  createSchemaGenerator,
  createVersion,
  deleteMany,
  deleteOne,
  deleteVersions,
  destroy,
  find,
  findDistinct,
  findGlobal,
  findGlobalVersions,
  findOne,
  findVersions,
  migrate,
  migrateDown,
  migrateFresh,
  migrateRefresh,
  migrateReset,
  migrateStatus,
  operatorMap,
  queryDrafts,
  rollbackTransaction,
  updateGlobal,
  updateGlobalVersion,
  updateJobs,
  updateMany,
  updateOne,
  updateVersion,
  upsert,
} from '@payloadcms/drizzle'
import {
  columnToCodeConverter,
  convertPathToJSONTraversal,
  countDistinct,
  createJSONQuery,
  defaultDrizzleSnapshot,
  deleteWhere,
  dropDatabase,
  execute,
  init,
  insert,
  requireDrizzleKit,
} from '@payloadcms/drizzle/sqlite'
import { like, notLike } from 'drizzle-orm'
import { createDatabaseAdapter, defaultBeginTransaction, findMigrationDir } from 'payload'
import { fileURLToPath } from 'url'

import type { Args, SQLiteAdapter } from './types.js'

import { connect } from './connect.js'

const filename = fileURLToPath(import.meta.url)

export function sqliteAdapter(args: Args): DatabaseAdapterObj<SQLiteAdapter> {
  const sqliteIDType = args.idType || 'number'
  const payloadIDType = sqliteIDType === 'uuid' ? 'text' : 'number'
  const allowIDOnCreate = args.allowIDOnCreate ?? false

  function adapter({ payload }: { payload: Payload }) {
    const migrationDir = findMigrationDir(args.migrationDir)
    let resolveInitializing: () => void = () => {}
    let rejectInitializing: () => void = () => {}

    const initializing = new Promise<void>((res, rej) => {
      resolveInitializing = res
      rejectInitializing = rej
    })

    // sqlite's like operator is case-insensitive, so we overwrite the DrizzleAdapter operators to not use ilike
    const operators = {
      ...operatorMap,
      contains: like,
      like,
      not_like: notLike,
    } as unknown as Operators

    return createDatabaseAdapter<SQLiteAdapter>({
      name: 'sqlite',
      afterSchemaInit: args.afterSchemaInit ?? [],
      allowIDOnCreate,
      autoIncrement: args.autoIncrement ?? false,
      beforeSchemaInit: args.beforeSchemaInit ?? [],
      blocksAsJSON: args.blocksAsJSON ?? false,
      // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
      client: undefined,
      clientConfig: args.client,
      defaultDrizzleSnapshot,
      // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
      drizzle: undefined,
      features: {
        json: true,
      },
      fieldConstraints: {},
      findDistinct,
      generateSchema: createSchemaGenerator({
        columnToCodeConverter,
        corePackageSuffix: 'sqlite-core',
        defaultOutputFile: args.generateSchemaOutputFile,
        tableImport: 'sqliteTable',
      }),
      idType: sqliteIDType,
      initializing,
      localesSuffix: args.localesSuffix || '_locales',
      logger: args.logger,
      operators,
      prodMigrations: args.prodMigrations,
      // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
      push: args.push,
      rawRelations: {},
      rawTables: {},
      relations: {},
      relationshipsSuffix: args.relationshipsSuffix || '_rels',
      schema: {},
      schemaName: args.schemaName,
      sessions: {},
      tableNameMap: new Map<string, string>(),
      tables: {},
      // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
      transactionOptions: args.transactionOptions || undefined,
      updateJobs,
      updateMany,
      versionsSuffix: args.versionsSuffix || '_v',
      // DatabaseAdapter
      beginTransaction: args.transactionOptions ? beginTransaction : defaultBeginTransaction(),
      commitTransaction,
      connect,
      convertPathToJSONTraversal,
      count,
      countDistinct,
      countGlobalVersions,
      countVersions,
      create,
      createGlobal,
      createGlobalVersion,
      createJSONQuery,
      createMigration: buildCreateMigration({
        executeMethod: 'run',
        filename,
        sanitizeStatements({ sqlExecute, statements }) {
          return statements
            .map((statement) => `${sqlExecute}${statement?.replaceAll('`', '\\`')}\`)`)
            .join('\n')
        },
      }),
      createVersion,
      defaultIDType: payloadIDType,
      deleteMany,
      deleteOne,
      deleteVersions,
      deleteWhere,
      destroy,
      dropDatabase,
      execute,
      find,
      findGlobal,
      findGlobalVersions,
      findOne,
      findVersions,
      foreignKeys: new Set(),
      indexes: new Set<string>(),
      init,
      insert,
      migrate,
      migrateDown,
      migrateFresh,
      migrateRefresh,
      migrateReset,
      migrateStatus,
      migrationDir,
      packageName: '@payloadcms/db-sqlite',
      payload,
      queryDrafts,
      rejectInitializing,
      requireDrizzleKit,
      resolveInitializing,
      rollbackTransaction,
      updateGlobal,
      updateGlobalVersion,
      updateOne,
      updateVersion,
      upsert,
    })
  }

  return {
    name: 'sqlite',
    allowIDOnCreate,
    defaultIDType: payloadIDType,
    init: adapter,
  }
}

/**
 * @todo deprecate /types subpath export in 4.0
 */
export type {
  Args as SQLiteAdapterArgs,
  CountDistinct,
  DeleteWhere,
  DropDatabase,
  Execute,
  GeneratedDatabaseSchema,
  GenericColumns,
  GenericRelation,
  GenericTable,
  IDType,
  Insert,
  MigrateDownArgs,
  MigrateUpArgs,
  SQLiteAdapter,
  SQLiteSchemaHook,
} from './types.js'

export { sql } from 'drizzle-orm'
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/db-sqlite/src/types.ts

```typescript
import type { Client, Config, ResultSet } from '@libsql/client'
import type { extendDrizzleTable, Operators } from '@payloadcms/drizzle'
import type { BaseSQLiteAdapter, BaseSQLiteArgs } from '@payloadcms/drizzle/sqlite'
import type { BuildQueryJoinAliases, DrizzleAdapter } from '@payloadcms/drizzle/types'
import type { DrizzleConfig, Relation, Relations, SQL } from 'drizzle-orm'
import type { LibSQLDatabase } from 'drizzle-orm/libsql'
import type {
  AnySQLiteColumn,
  SQLiteColumn,
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
  /**
   * Transform the schema after it's built.
   * You can use it to customize the schema with features that aren't supported by Payload.
   * Examples may include: composite indices, generated columns, vectors
   */
  afterSchemaInit?: SQLiteSchemaHook[]
  /**
   * Enable this flag if you want to thread your own ID to create operation data, for example:
   * ```ts
   * // doc created with id 1
   * const doc = await payload.create({ collection: 'posts', data: {id: 1, title: "my title"}})
   * ```
   */
  allowIDOnCreate?: boolean
  /**
   * Enable [AUTOINCREMENT](https://www.sqlite.org/autoinc.html) for Primary Keys.
   * This ensures that the same ID cannot be reused from previously deleted rows.
   */
  autoIncrement?: boolean
  /**
   * Transform the schema before it's built.
   * You can use it to preserve an existing database schema and if there are any collissions Payload will override them.
   * To generate Drizzle schema from the database, see [Drizzle Kit introspection](https://orm.drizzle.team/kit-docs/commands#introspect--pull)
   */
  beforeSchemaInit?: SQLiteSchemaHook[]
  client: Config
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
  column?: SQLiteColumn<any>
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

export type DropDatabase = (args: { adapter: SQLiteAdapter }) => Promise<void>

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

type Drizzle = { $client: Client } & LibSQLDatabase<ResolveSchemaType<GeneratedDatabaseSchema>>

export type SQLiteAdapter = {
  client: Client
  clientConfig: Args['client']
  drizzle: Drizzle
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

---[FILE: index.ts]---
Location: payload-main/packages/db-sqlite/src/drizzle-proxy/index.ts

```typescript
export * from 'drizzle-orm'
```

--------------------------------------------------------------------------------

---[FILE: libsql.ts]---
Location: payload-main/packages/db-sqlite/src/drizzle-proxy/libsql.ts

```typescript
export * from 'drizzle-orm/libsql'
```

--------------------------------------------------------------------------------

---[FILE: relations.ts]---
Location: payload-main/packages/db-sqlite/src/drizzle-proxy/relations.ts

```typescript
export * from 'drizzle-orm/relations'
```

--------------------------------------------------------------------------------

---[FILE: sqlite-core.ts]---
Location: payload-main/packages/db-sqlite/src/drizzle-proxy/sqlite-core.ts

```typescript
export * from 'drizzle-orm/sqlite-core'
```

--------------------------------------------------------------------------------

````
