---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 132
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 132 of 695)

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

---[FILE: types-deprecated.ts]---
Location: payload-main/packages/db-sqlite/src/exports/types-deprecated.ts

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
  SQLiteAdapter as _SQLiteAdapter,
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
Location: payload-main/packages/db-vercel-postgres/.gitignore

```text
/migrations
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: payload-main/packages/db-vercel-postgres/.prettierignore

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
Location: payload-main/packages/db-vercel-postgres/.swcrc

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

---[FILE: license.md]---
Location: payload-main/packages/db-vercel-postgres/license.md

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
Location: payload-main/packages/db-vercel-postgres/package.json

```json
{
  "name": "@payloadcms/db-vercel-postgres",
  "version": "3.68.5",
  "description": "Vercel Postgres adapter for Payload",
  "homepage": "https://payloadcms.com",
  "repository": {
    "type": "git",
    "url": "https://github.com/payloadcms/payload.git",
    "directory": "packages/db-vercel-postgres"
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
    "./types": {
      "import": "./src/exports/types-deprecated.ts",
      "types": "./src/exports/types-deprecated.ts",
      "default": "./src/exports/types-deprecated.ts"
    },
    "./migration-utils": {
      "import": "./src/exports/migration-utils.ts",
      "types": "./src/exports/migration-utils.ts",
      "default": "./src/exports/migration-utils.ts"
    },
    "./drizzle": {
      "import": "./src/drizzle-proxy/index.ts",
      "types": "./src/drizzle-proxy/index.ts",
      "default": "./src/drizzle-proxy/index.ts"
    },
    "./drizzle/pg-core": {
      "import": "./src/drizzle-proxy/pg-core.ts",
      "types": "./src/drizzle-proxy/pg-core.ts",
      "default": "./src/drizzle-proxy/pg-core.ts"
    },
    "./drizzle/node-postgres": {
      "import": "./src/drizzle-proxy/node-postgres.ts",
      "types": "./src/drizzle-proxy/node-postgres.ts",
      "default": "./src/drizzle-proxy/node-postgres.ts"
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
    "build": "rimraf .dist && rimraf tsconfig.tsbuildinfo  && pnpm build:types && pnpm build:swc && pnpm build:esbuild && pnpm renamePredefinedMigrations",
    "build:debug": "pnpm build",
    "build:esbuild": "echo skipping esbuild",
    "build:swc": "swc ./src -d ./dist --config-file .swcrc --strip-leading-paths",
    "build:types": "tsc --emitDeclarationOnly --outDir dist",
    "clean": "rimraf -g {dist,*.tsbuildinfo}",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "renamePredefinedMigrations": "node --no-deprecation --import @swc-node/register/esm-register ./scripts/renamePredefinedMigrations.ts"
  },
  "dependencies": {
    "@payloadcms/drizzle": "workspace:*",
    "@vercel/postgres": "^0.9.0",
    "console-table-printer": "2.12.1",
    "drizzle-kit": "0.31.7",
    "drizzle-orm": "0.44.7",
    "pg": "8.16.3",
    "prompts": "2.4.2",
    "to-snake-case": "1.0.0",
    "uuid": "10.0.0"
  },
  "devDependencies": {
    "@hyrious/esbuild-plugin-commonjs": "0.2.6",
    "@payloadcms/eslint-config": "workspace:*",
    "@types/pg": "8.10.2",
    "@types/to-snake-case": "1.0.0",
    "esbuild": "0.25.5",
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
      "./types": {
        "import": "./dist/exports/types-deprecated.js",
        "types": "./dist/exports/types-deprecated.d.ts",
        "default": "./dist/exports/types-deprecated.js"
      },
      "./migration-utils": {
        "import": "./dist/exports/migration-utils.js",
        "types": "./dist/exports/migration-utils.d.ts",
        "default": "./dist/exports/migration-utils.js"
      },
      "./drizzle": {
        "import": "./dist/drizzle-proxy/index.js",
        "types": "./dist/drizzle-proxy/index.d.ts",
        "default": "./dist/drizzle-proxy/index.js"
      },
      "./drizzle/pg-core": {
        "import": "./dist/drizzle-proxy/pg-core.js",
        "types": "./dist/drizzle-proxy/pg-core.d.ts",
        "default": "./dist/drizzle-proxy/pg-core.js"
      },
      "./drizzle/node-postgres": {
        "import": "./dist/drizzle-proxy/node-postgres.js",
        "types": "./dist/drizzle-proxy/node-postgres.d.ts",
        "default": "./dist/drizzle-proxy/node-postgres.js"
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
Location: payload-main/packages/db-vercel-postgres/README.md

```text
# Payload Postgres Adapter

[Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) adapter for [Payload](https://payloadcms.com).

- [Main Repository](https://github.com/payloadcms/payload)
- [Payload Docs](https://payloadcms.com/docs)

## Installation

```bash
npm install @payloadcms/db-vercel-postgres
```

## Usage

### Explicit Connection String

```ts
import { buildConfig } from 'payload'
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'

export default buildConfig({
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
  // ...rest of config
})
```

### Automatic Connection String Detection

Have Vercel automatically detect from environment variable (typically `process.env.POSTGRES_URL`)

```ts
export default buildConfig({
  db: postgresAdapter(),
  // ...rest of config
})
```

More detailed usage can be found in the [Payload Docs](https://payloadcms.com/docs/configuration/overview).
```

--------------------------------------------------------------------------------

---[FILE: relationships-v2-v3.mjs]---
Location: payload-main/packages/db-vercel-postgres/relationships-v2-v3.mjs

```text
const imports = `import { migratePostgresV2toV3 } from '@payloadcms/migratePostgresV2toV3'`
const up = `   await migratePostgresV2toV3({
        // enables logging of changes that will be made to the database
        debug: false,
        // skips calls that modify schema or data
        dryRun: false,
        payload,
        req,
        })
`
export { imports, up }

//# sourceMappingURL=relationships-v2-v3.js.map
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/packages/db-vercel-postgres/tsconfig.json

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

---[FILE: renamePredefinedMigrations.ts]---
Location: payload-main/packages/db-vercel-postgres/scripts/renamePredefinedMigrations.ts

```typescript
import fs from 'fs'
import path from 'path'

/**
 * Changes built .js files to .mjs to for ESM imports
 */
const rename = () => {
  fs.readdirSync(path.resolve('./dist/predefinedMigrations'))
    .filter((f) => {
      return f.endsWith('.js')
    })
    .forEach((file) => {
      const newPath = path.join('./dist/predefinedMigrations', file)
      fs.renameSync(newPath, newPath.replace('.js', '.mjs'))
    })
  console.log('done')
}

rename()
```

--------------------------------------------------------------------------------

---[FILE: connect.ts]---
Location: payload-main/packages/db-vercel-postgres/src/connect.ts

```typescript
import type { DrizzleAdapter } from '@payloadcms/drizzle/types'
import type { Connect, Migration } from 'payload'

import { pushDevSchema } from '@payloadcms/drizzle'
import { sql, VercelPool } from '@vercel/postgres'
import { drizzle } from 'drizzle-orm/node-postgres'
import { withReplicas } from 'drizzle-orm/pg-core'
import pg from 'pg'

import type { VercelPostgresAdapter } from './types.js'

export const connect: Connect = async function connect(
  this: VercelPostgresAdapter,
  options = {
    hotReload: false,
  },
) {
  const { hotReload } = options

  try {
    const logger = this.logger || false

    let client: pg.Pool | VercelPool

    const connectionString = this.poolOptions?.connectionString ?? process.env.POSTGRES_URL

    // Use non-vercel postgres for local database
    if (
      !this.forceUseVercelPostgres &&
      connectionString &&
      ['127.0.0.1', 'localhost'].includes(new URL(connectionString).hostname)
    ) {
      client = new pg.Pool(
        this.poolOptions ?? {
          connectionString,
        },
      )
    } else {
      client = this.poolOptions ? new VercelPool(this.poolOptions) : sql
    }

    // Passed the poolOptions if provided,
    // else have vercel/postgres detect the connection string from the environment
    this.drizzle = drizzle({
      client,
      logger,
      schema: this.schema,
    })

    if (this.readReplicaOptions) {
      const readReplicas = this.readReplicaOptions.map((connectionString) => {
        const options = {
          ...this.poolOptions,
          connectionString,
        }
        const pool = new VercelPool(options)
        return drizzle({ client: pool, logger, schema: this.schema })
      })
      const myReplicas = withReplicas(this.drizzle, readReplicas as any)
      this.drizzle = myReplicas
    }

    if (!hotReload) {
      if (process.env.PAYLOAD_DROP_DATABASE === 'true') {
        this.payload.logger.info(`---- DROPPING TABLES SCHEMA(${this.schemaName || 'public'}) ----`)
        await this.dropDatabase({ adapter: this })
        this.payload.logger.info('---- DROPPED TABLES ----')
      }
    }
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    if (err.message?.match(/database .* does not exist/i) && !this.disableCreateDatabase) {
      // capitalize first char of the err msg
      this.payload.logger.info(
        `${err.message.charAt(0).toUpperCase() + err.message.slice(1)}, creating...`,
      )
      const isCreated = await this.createDatabase()

      if (isCreated) {
        await this.connect?.(options)
        return
      }
    } else {
      this.payload.logger.error({
        err,
        msg: `Error: cannot connect to Postgres. Details: ${err.message}`,
      })
    }

    if (typeof this.rejectInitializing === 'function') {
      this.rejectInitializing()
    }
    throw new Error(`Error: cannot connect to Postgres: ${err.message}`)
  }

  await this.createExtensions()

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
Location: payload-main/packages/db-vercel-postgres/src/index.ts

```typescript
import type { PgTableFn } from 'drizzle-orm/pg-core'
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
import { fileURLToPath } from 'url'

import type { Args, VercelPostgresAdapter } from './types.js'

import { connect } from './connect.js'

const filename = fileURLToPath(import.meta.url)

export function vercelPostgresAdapter(args: Args = {}): DatabaseAdapterObj<VercelPostgresAdapter> {
  const postgresIDType = args.idType || 'serial'
  const payloadIDType = postgresIDType === 'serial' ? 'number' : 'text'
  const allowIDOnCreate = args.allowIDOnCreate ?? false

  function adapter({ payload }: { payload: Payload }) {
    const migrationDir = findMigrationDir(args.migrationDir)
    let resolveInitializing
    let rejectInitializing
    let adapterSchema: VercelPostgresAdapter['pgSchema']

    const initializing = new Promise<void>((res, rej) => {
      resolveInitializing = res
      rejectInitializing = rej
    })

    if (args.schemaName) {
      adapterSchema = pgSchema(args.schemaName)
    } else {
      adapterSchema = { enum: pgEnum, table: pgTable as unknown as PgTableFn<string> }
    }

    const extensions = (args.extensions ?? []).reduce<Record<string, boolean>>((acc, name) => {
      acc[name] = true
      return acc
    }, {})

    return createDatabaseAdapter<VercelPostgresAdapter>({
      name: 'postgres',
      afterSchemaInit: args.afterSchemaInit ?? [],
      allowIDOnCreate,
      beforeSchemaInit: args.beforeSchemaInit ?? [],
      blocksAsJSON: args.blocksAsJSON ?? false,
      createDatabase,
      createExtensions,
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
      forceUseVercelPostgres: args.forceUseVercelPostgres ?? false,
      foreignKeys: new Set(),
      generateSchema: createSchemaGenerator({
        columnToCodeConverter,
        corePackageSuffix: 'pg-core',
        defaultOutputFile: args.generateSchemaOutputFile,
        enumImport: 'pgEnum',
        schemaImport: 'pgSchema',
        tableImport: 'pgTable',
      }),
      idType: postgresIDType,
      indexes: new Set<string>(),
      initializing,
      localesSuffix: args.localesSuffix || '_locales',
      logger: args.logger,
      operators: operatorMap,
      pgSchema: adapterSchema,
      pool: undefined,
      poolOptions: args.pool,
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
      tablesFilter: args.tablesFilter,
      transactionOptions: args.transactionOptions || undefined,
      updateJobs,
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
      createMigration: buildCreateMigration({
        executeMethod: 'execute',
        filename,
        sanitizeStatements({ sqlExecute, statements }) {
          return `${sqlExecute}\n ${statements.join('\n')}\`)`
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
      findDistinct,
      findGlobal,
      findGlobalVersions,
      findOne,
      findVersions,
      init,
      insert,
      migrate,
      migrateDown,
      migrateFresh,
      migrateRefresh,
      migrateReset,
      migrateStatus,
      migrationDir,
      packageName: '@payloadcms/db-vercel-postgres',
      payload,
      queryDrafts,
      readReplicaOptions: args.readReplicas,
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

/**
 * @todo deprecate /types subpath export in 4.0
 */
export type {
  Args as VercelPostgresAdapterArgs,
  GeneratedDatabaseSchema,
  VercelPostgresAdapter,
} from './types.js'
export type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/drizzle/postgres'
export { geometryColumn } from '@payloadcms/drizzle/postgres'
export { sql } from 'drizzle-orm'
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/db-vercel-postgres/src/types.ts

```typescript
import type {
  BasePostgresAdapter,
  GenericEnum,
  MigrateDownArgs,
  MigrateUpArgs,
  PostgresDB,
  PostgresSchemaHook,
} from '@payloadcms/drizzle/postgres'
import type { DrizzleAdapter } from '@payloadcms/drizzle/types'
import type { VercelPool, VercelPostgresPoolConfig } from '@vercel/postgres'
import type { DrizzleConfig } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import type { PgSchema, PgTableFn, PgTransactionConfig } from 'drizzle-orm/pg-core'

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
  connectionString?: string
  /**
   * Pass `true` to disale auto database creation if it doesn't exist.
   * @default false
   */
  disableCreateDatabase?: boolean
  extensions?: string[]
  /**
   * By default, we connect to a local database using the `pg` module instead of `@vercel/postgres`.
   * This is because `@vercel/postgres` doesn't work with local databases.
   * If you still want to use `@vercel/postgres` even locally you can pass `true` here
   * and you'd to spin up the database with a special Neon's Docker Compose setup - https://vercel.com/docs/storage/vercel-postgres/local-development#option-2:-local-postgres-instance-with-docker
   */
  forceUseVercelPostgres?: boolean
  /** Generated schema from payload generate:db-schema file path */
  generateSchemaOutputFile?: string
  idType?: 'serial' | 'uuid'
  localesSuffix?: string
  logger?: DrizzleConfig['logger']
  migrationDir?: string
  /**
   * Optional pool configuration for Vercel Postgres
   * If not provided, vercel/postgres will attempt to use the Vercel environment variables
   */
  pool?: VercelPostgresPoolConfig
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

type Drizzle = NodePgDatabase<ResolveSchemaType<GeneratedDatabaseSchema>>

export type VercelPostgresAdapter = {
  drizzle: Drizzle
  forceUseVercelPostgres?: boolean
  pool?: VercelPool
  poolOptions?: Args['pool']
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
    extensionsFilter: Set<string>
    /**
     * An object keyed on each table, with a key value pair where the constraint name is the key, followed by the dot-notation field name
     * Used for returning properly formed errors from unique fields
     */
    fieldConstraints: Record<string, Record<string, string>>
    idType: Args['idType']
    initializing: Promise<void>
    localesSuffix?: string
    logger: DrizzleConfig['logger']
    pgSchema?: { table: PgTableFn } | PgSchema
    pool: VercelPool
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
Location: payload-main/packages/db-vercel-postgres/src/drizzle-proxy/index.ts

```typescript
export * from 'drizzle-orm'
```

--------------------------------------------------------------------------------

---[FILE: node-postgres.ts]---
Location: payload-main/packages/db-vercel-postgres/src/drizzle-proxy/node-postgres.ts

```typescript
export * from 'drizzle-orm/node-postgres'
```

--------------------------------------------------------------------------------

---[FILE: pg-core.ts]---
Location: payload-main/packages/db-vercel-postgres/src/drizzle-proxy/pg-core.ts

```typescript
export * from 'drizzle-orm/pg-core'
```

--------------------------------------------------------------------------------

---[FILE: relations.ts]---
Location: payload-main/packages/db-vercel-postgres/src/drizzle-proxy/relations.ts

```typescript
export * from 'drizzle-orm/relations'
```

--------------------------------------------------------------------------------

---[FILE: migration-utils.ts]---
Location: payload-main/packages/db-vercel-postgres/src/exports/migration-utils.ts

```typescript
export { migratePostgresV2toV3 } from '@payloadcms/drizzle/postgres'
```

--------------------------------------------------------------------------------

---[FILE: types-deprecated.ts]---
Location: payload-main/packages/db-vercel-postgres/src/exports/types-deprecated.ts

```typescript
import type {
  Args as _Args,
  GeneratedDatabaseSchema as _GeneratedDatabaseSchema,
  VercelPostgresAdapter as _VercelPostgresAdapter,
} from '../types.js'

/**
 * @deprecated - import from `@payloadcms/db-vercel-postgres` instead
 */
export type Args = _Args

/**
 * @deprecated - import from `@payloadcms/db-vercel-postgres` instead
 */
export type GeneratedDatabaseSchema = _GeneratedDatabaseSchema

/**
 * @deprecated - import from `@payloadcms/db-vercel-postgres` instead
 */
export type VercelPostgresAdapter = _VercelPostgresAdapter
```

--------------------------------------------------------------------------------

---[FILE: relationships-v2-v3.ts]---
Location: payload-main/packages/db-vercel-postgres/src/predefinedMigrations/relationships-v2-v3.ts

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

---[FILE: .eslintrc.cjs]---
Location: payload-main/packages/drizzle/.eslintrc.cjs

```text
/** @type {import('eslint').Linter.Config} */
module.exports = {
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
}
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: payload-main/packages/drizzle/.prettierignore

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
Location: payload-main/packages/drizzle/.swcrc

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
Location: payload-main/packages/drizzle/LICENSE.md

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
Location: payload-main/packages/drizzle/package.json

```json
{
  "name": "@payloadcms/drizzle",
  "version": "3.68.5",
  "description": "A library of shared functions used by different payload database adapters",
  "homepage": "https://payloadcms.com",
  "repository": {
    "type": "git",
    "url": "https://github.com/payloadcms/payload.git",
    "directory": "packages/drizzle"
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
    "./postgres": {
      "import": "./src/exports/postgres.ts",
      "types": "./src/exports/postgres.ts",
      "default": "./src/exports/postgres.ts"
    },
    "./sqlite": {
      "import": "./src/exports/sqlite.ts",
      "types": "./src/exports/sqlite.ts",
      "default": "./src/exports/sqlite.ts"
    },
    "./types": {
      "import": "./src/exports/types-deprecated.ts",
      "types": "./src/exports/types-deprecated.ts",
      "default": "./src/exports/types-deprecated.ts"
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
    "console-table-printer": "2.12.1",
    "dequal": "2.0.3",
    "drizzle-orm": "0.44.7",
    "prompts": "2.4.2",
    "to-snake-case": "1.0.0",
    "uuid": "9.0.0"
  },
  "devDependencies": {
    "@libsql/client": "0.14.0",
    "@payloadcms/eslint-config": "workspace:*",
    "@types/pg": "8.10.2",
    "@types/to-snake-case": "1.0.0",
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
      "./postgres": {
        "import": "./dist/exports/postgres.js",
        "types": "./dist/exports/postgres.d.ts",
        "default": "./dist/exports/postgres.js"
      },
      "./sqlite": {
        "import": "./dist/exports/sqlite.js",
        "types": "./dist/exports/sqlite.d.ts",
        "default": "./dist/exports/sqlite.js"
      },
      "./types": {
        "import": "./dist/exports/types-deprecated.js",
        "types": "./dist/exports/types-deprecated.d.ts",
        "default": "./dist/exports/types-deprecated.js"
      }
    },
    "main": "./dist/index.js",
    "types": "./dist/index.d.ts"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: payload-main/packages/drizzle/README.md

```text
# Payload Drizzle Adapter

The Drizzle package is used by db-postgres and db-sqlite for shared functionality of SQL databases. It is not meant to be used directly in Payload projects.
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/packages/drizzle/tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    /* TODO: remove the following lines */
    "strict": false,
    "noUncheckedIndexedAccess": false,
    // Do not include DOM and DOM.Iterable as this is a server-only package.
    "lib": ["ES2022"],
  },
  "references": [{ "path": "../payload" }, { "path": "../translations" }]
}
```

--------------------------------------------------------------------------------

---[FILE: count.ts]---
Location: payload-main/packages/drizzle/src/count.ts

```typescript
import type { Count, SanitizedCollectionConfig } from 'payload'

import toSnakeCase from 'to-snake-case'

import type { DrizzleAdapter } from './types.js'

import { buildQuery } from './queries/buildQuery.js'
import { getTransaction } from './utilities/getTransaction.js'

export const count: Count = async function count(
  this: DrizzleAdapter,
  { collection, locale, req, where: whereArg },
) {
  const collectionConfig: SanitizedCollectionConfig = this.payload.collections[collection].config

  const tableName = this.tableNameMap.get(toSnakeCase(collectionConfig.slug))

  const { joins, where } = buildQuery({
    adapter: this,
    fields: collectionConfig.flattenedFields,
    locale,
    tableName,
    where: whereArg,
  })

  const db = await getTransaction(this, req)

  const countResult = await this.countDistinct({
    db,
    joins,
    tableName,
    where,
  })

  return { totalDocs: countResult }
}
```

--------------------------------------------------------------------------------

---[FILE: countGlobalVersions.ts]---
Location: payload-main/packages/drizzle/src/countGlobalVersions.ts

```typescript
import type { CountGlobalVersions, SanitizedGlobalConfig } from 'payload'

import { buildVersionGlobalFields } from 'payload'
import toSnakeCase from 'to-snake-case'

import type { DrizzleAdapter } from './types.js'

import { buildQuery } from './queries/buildQuery.js'
import { getTransaction } from './utilities/getTransaction.js'

export const countGlobalVersions: CountGlobalVersions = async function countGlobalVersions(
  this: DrizzleAdapter,
  { global, locale, req, where: whereArg },
) {
  const globalConfig: SanitizedGlobalConfig = this.payload.globals.config.find(
    ({ slug }) => slug === global,
  )

  const tableName = this.tableNameMap.get(
    `_${toSnakeCase(globalConfig.slug)}${this.versionsSuffix}`,
  )

  const fields = buildVersionGlobalFields(this.payload.config, globalConfig, true)

  const { joins, where } = buildQuery({
    adapter: this,
    fields,
    locale,
    tableName,
    where: whereArg,
  })

  const db = await getTransaction(this, req)

  const countResult = await this.countDistinct({
    db,
    joins,
    tableName,
    where,
  })

  return { totalDocs: countResult }
}
```

--------------------------------------------------------------------------------

---[FILE: countVersions.ts]---
Location: payload-main/packages/drizzle/src/countVersions.ts

```typescript
import type { CountVersions, SanitizedCollectionConfig } from 'payload'

import { buildVersionCollectionFields } from 'payload'
import toSnakeCase from 'to-snake-case'

import type { DrizzleAdapter } from './types.js'

import { buildQuery } from './queries/buildQuery.js'
import { getTransaction } from './utilities/getTransaction.js'

export const countVersions: CountVersions = async function countVersions(
  this: DrizzleAdapter,
  { collection, locale, req, where: whereArg },
) {
  const collectionConfig: SanitizedCollectionConfig = this.payload.collections[collection].config

  const tableName = this.tableNameMap.get(
    `_${toSnakeCase(collectionConfig.slug)}${this.versionsSuffix}`,
  )

  const fields = buildVersionCollectionFields(this.payload.config, collectionConfig, true)

  const { joins, where } = buildQuery({
    adapter: this,
    fields,
    locale,
    tableName,
    where: whereArg,
  })

  const db = await getTransaction(this, req)

  const countResult = await this.countDistinct({
    db,
    joins,
    tableName,
    where,
  })

  return { totalDocs: countResult }
}
```

--------------------------------------------------------------------------------

````
