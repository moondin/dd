---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 134
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 134 of 695)

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

---[FILE: migrateRefresh.ts]---
Location: payload-main/packages/drizzle/src/migrateRefresh.ts

```typescript
import {
  commitTransaction,
  createLocalReq,
  getMigrations,
  initTransaction,
  killTransaction,
  readMigrationFiles,
} from 'payload'

import type { DrizzleAdapter } from './types.js'

import { getTransaction } from './utilities/getTransaction.js'
import { migrationTableExists } from './utilities/migrationTableExists.js'
import { parseError } from './utilities/parseError.js'

/**
 * Run all migration down functions before running up
 */
export async function migrateRefresh(this: DrizzleAdapter) {
  const { payload } = this
  const migrationFiles = await readMigrationFiles({ payload })

  const { existingMigrations, latestBatch } = await getMigrations({
    payload,
  })

  if (!existingMigrations?.length) {
    payload.logger.info({ msg: 'No migrations to rollback.' })
    return
  }

  payload.logger.info({
    msg: `Rolling back batch ${latestBatch} consisting of ${existingMigrations.length} migration(s).`,
  })

  const req = await createLocalReq({}, payload)

  // Reverse order of migrations to rollback
  existingMigrations.reverse()

  for (const migration of existingMigrations) {
    try {
      const migrationFile = migrationFiles.find((m) => m.name === migration.name)
      if (!migrationFile) {
        throw new Error(`Migration ${migration.name} not found locally.`)
      }

      payload.logger.info({ msg: `Migrating down: ${migration.name}` })
      const start = Date.now()
      await initTransaction(req)
      const db = await getTransaction(this, req)
      await migrationFile.down({ db, payload, req })
      payload.logger.info({
        msg: `Migrated down:  ${migration.name} (${Date.now() - start}ms)`,
      })

      const tableExists = await migrationTableExists(this, db)
      if (tableExists) {
        await payload.delete({
          collection: 'payload-migrations',
          req,
          where: {
            name: {
              equals: migration.name,
            },
          },
        })
      }
      await commitTransaction(req)
    } catch (err: unknown) {
      await killTransaction(req)
      payload.logger.error({
        err,
        msg: parseError(err, `Error running migration ${migration.name}. Rolling back.`),
      })
      process.exit(1)
    }
  }

  // Run all migrate up
  for (const migration of migrationFiles) {
    payload.logger.info({ msg: `Migrating: ${migration.name}` })
    try {
      const start = Date.now()
      await initTransaction(req)
      await migration.up({ payload, req })
      await payload.create({
        collection: 'payload-migrations',
        data: {
          name: migration.name,
          executed: true,
        },
        req,
      })
      await commitTransaction(req)

      payload.logger.info({ msg: `Migrated:  ${migration.name} (${Date.now() - start}ms)` })
    } catch (err: unknown) {
      await killTransaction(req)
      payload.logger.error({
        err,
        msg: parseError(err, `Error running migration ${migration.name}. Rolling back.`),
      })
      process.exit(1)
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: migrateReset.ts]---
Location: payload-main/packages/drizzle/src/migrateReset.ts

```typescript
import {
  commitTransaction,
  createLocalReq,
  getMigrations,
  initTransaction,
  killTransaction,
  readMigrationFiles,
} from 'payload'

import type { DrizzleAdapter } from './types.js'

import { getTransaction } from './utilities/getTransaction.js'
import { migrationTableExists } from './utilities/migrationTableExists.js'

/**
 * Run all migrate down functions
 */
export async function migrateReset(this: DrizzleAdapter): Promise<void> {
  const { payload } = this
  const migrationFiles = await readMigrationFiles({ payload })

  const { existingMigrations } = await getMigrations({ payload })

  if (!existingMigrations?.length) {
    payload.logger.info({ msg: 'No migrations to reset.' })
    return
  }

  const req = await createLocalReq({}, payload)

  existingMigrations.reverse()

  // Rollback all migrations in order
  for (const migration of existingMigrations) {
    const migrationFile = migrationFiles.find((m) => m.name === migration.name)
    try {
      if (!migrationFile) {
        throw new Error(`Migration ${migration.name} not found locally.`)
      }

      const start = Date.now()
      payload.logger.info({ msg: `Migrating down: ${migrationFile.name}` })
      await initTransaction(req)
      const db = await getTransaction(this, req)
      await migrationFile.down({ db, payload, req })
      payload.logger.info({
        msg: `Migrated down:  ${migrationFile.name} (${Date.now() - start}ms)`,
      })

      const tableExists = await migrationTableExists(this, db)
      if (tableExists) {
        await payload.delete({
          id: migration.id,
          collection: 'payload-migrations',
          req,
        })
      }

      await commitTransaction(req)
    } catch (err: unknown) {
      let msg = `Error running migration ${migrationFile.name}.`

      if (err instanceof Error) {
        msg += ` ${err.message}`
      }

      await killTransaction(req)
      payload.logger.error({
        err,
        msg,
      })
      process.exit(1)
    }
  }

  // Delete dev migration

  const tableExists = await migrationTableExists(this)
  if (tableExists) {
    try {
      await payload.delete({
        collection: 'payload-migrations',
        where: {
          batch: {
            equals: -1,
          },
        },
      })
    } catch (err: unknown) {
      payload.logger.error({ err, msg: 'Error deleting dev migration' })
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: migrateStatus.ts]---
Location: payload-main/packages/drizzle/src/migrateStatus.ts

```typescript
import { Table } from 'console-table-printer'
import { getMigrations, readMigrationFiles } from 'payload'

import type { DrizzleAdapter } from './types.js'

import { migrationTableExists } from './utilities/migrationTableExists.js'

export async function migrateStatus(this: DrizzleAdapter): Promise<void> {
  const { payload } = this
  const migrationFiles = await readMigrationFiles({ payload })

  payload.logger.debug({
    msg: `Found ${migrationFiles.length} migration files.`,
  })

  let existingMigrations = []
  const hasMigrationTable = await migrationTableExists(this)

  if (hasMigrationTable) {
    ;({ existingMigrations } = await getMigrations({ payload }))
  }

  if (!migrationFiles.length) {
    payload.logger.info({ msg: 'No migrations found.' })
    return
  }

  // Compare migration files to existing migrations
  const statuses = migrationFiles.map((migration) => {
    const existingMigration = existingMigrations.find((m) => m.name === migration.name)
    return {
      Name: migration.name,

      Batch: existingMigration?.batch,
      Ran: existingMigration ? 'Yes' : 'No',
    }
  })

  const p = new Table()

  statuses.forEach((s) => {
    p.addRow(s, {
      color: s.Ran === 'Yes' ? 'green' : 'red',
    })
  })
  p.printTable()
}
```

--------------------------------------------------------------------------------

---[FILE: queryDrafts.ts]---
Location: payload-main/packages/drizzle/src/queryDrafts.ts

```typescript
import type { QueryDrafts, SanitizedCollectionConfig } from 'payload'

import { buildVersionCollectionFields, combineQueries } from 'payload'
import toSnakeCase from 'to-snake-case'

import type { DrizzleAdapter } from './types.js'

import { findMany } from './find/findMany.js'

export const queryDrafts: QueryDrafts = async function queryDrafts(
  this: DrizzleAdapter,
  { collection, joins, limit, locale, page = 1, pagination, req, select, sort, where },
) {
  const collectionConfig: SanitizedCollectionConfig = this.payload.collections[collection].config
  const tableName = this.tableNameMap.get(
    `_${toSnakeCase(collectionConfig.slug)}${this.versionsSuffix}`,
  )
  const fields = buildVersionCollectionFields(this.payload.config, collectionConfig, true)

  const combinedWhere = combineQueries({ latest: { equals: true } }, where)

  const result = await findMany({
    adapter: this,
    collectionSlug: collection,
    fields,
    joins,
    limit,
    locale,
    page,
    pagination,
    req,
    select,
    sort,
    tableName,
    versions: true,
    where: combinedWhere,
  })

  return {
    ...result,
    docs: result.docs.map((doc) => {
      doc = {
        id: doc.parent,
        ...doc.version,
      }

      return doc
    }),
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/drizzle/src/types.ts

```typescript
import type {
  Column,
  ColumnBaseConfig,
  ColumnDataType,
  DrizzleConfig,
  ExtractTablesWithRelations,
  Relation,
  Relations,
  SQL,
  TableRelationalConfig,
} from 'drizzle-orm'
import type { LibSQLDatabase } from 'drizzle-orm/libsql'
import type { NodePgDatabase, NodePgQueryResultHKT } from 'drizzle-orm/node-postgres'
import type {
  PgColumn,
  PgTable,
  PgTransaction,
  Precision,
  UpdateDeleteAction,
} from 'drizzle-orm/pg-core'
import type { SQLiteColumn, SQLiteTable, SQLiteTransaction } from 'drizzle-orm/sqlite-core'
import type { Result } from 'drizzle-orm/sqlite-core/session'
import type {
  BaseDatabaseAdapter,
  FlattenedField,
  MigrationData,
  Payload,
  PayloadRequest,
} from 'payload'

import type { BuildQueryJoinAliases } from './queries/buildQuery.js'

export { BuildQueryJoinAliases }

import type { ResultSet } from '@libsql/client'
import type { DrizzleSnapshotJSON } from 'drizzle-kit/api'
import type { SQLiteRaw } from 'drizzle-orm/sqlite-core/query-builders/raw'
import type { QueryResult } from 'pg'

import type { Operators } from './queries/operatorMap.js'

export type PostgresDB = NodePgDatabase<Record<string, unknown>>

export type SQLiteDB = LibSQLDatabase<
  Record<string, GenericRelation | GenericTable> & Record<string, unknown>
>

export type GenericPgColumn = PgColumn<
  ColumnBaseConfig<ColumnDataType, string>,
  Record<string, unknown>
>

export type GenericColumns<T> = {
  [x: string]: T
}

type GenericPgTable = PgTable<{
  columns: GenericColumns<GenericPgColumn>
  dialect: string
  name: string
  schema: undefined
}>

type GenericSQLiteTable = SQLiteTable<{
  columns: GenericColumns<SQLiteColumn>
  dialect: string
  name: string
  schema: undefined
}>

export type GenericColumn = GenericPgColumn | SQLiteColumn

export type GenericTable = GenericPgTable | GenericSQLiteTable

export type GenericRelation = Relations<string, Record<string, Relation<string>>>

export type TransactionSQLite = SQLiteTransaction<
  'async',
  Result<'async', unknown>,
  Record<string, unknown>,
  { tsName: TableRelationalConfig }
>
export type TransactionPg = PgTransaction<
  NodePgQueryResultHKT,
  Record<string, unknown>,
  ExtractTablesWithRelations<Record<string, unknown>>
>

export type DrizzleTransaction = TransactionPg | TransactionSQLite

export type CountDistinct = (args: {
  column?: PgColumn<any> | SQLiteColumn<any>
  db: DrizzleTransaction | LibSQLDatabase | PostgresDB
  joins: BuildQueryJoinAliases
  tableName: string
  where: SQL
}) => Promise<number>

export type DeleteWhere = (args: {
  db: DrizzleTransaction | LibSQLDatabase | PostgresDB
  tableName: string
  where: SQL
}) => Promise<void>

export type DropDatabase = (args: { adapter: DrizzleAdapter }) => Promise<void>

export type Execute<T> = (args: {
  db?: DrizzleTransaction | LibSQLDatabase | PostgresDB
  drizzle?: LibSQLDatabase | PostgresDB
  raw?: string
  sql?: SQL<unknown>
}) =>
  | Promise<QueryResult<Record<string, T>>>
  | SQLiteRaw<Promise<{ rows: T[] }>>
  | SQLiteRaw<ResultSet>

export type Insert = (args: {
  db: DrizzleTransaction | LibSQLDatabase | PostgresDB
  onConflictDoUpdate?: unknown
  tableName: string
  values: Record<string, unknown> | Record<string, unknown>[]
}) => Promise<Record<string, unknown>[]>

export type RequireDrizzleKit = () => {
  generateDrizzleJson: (
    args: Record<string, unknown>,
  ) => DrizzleSnapshotJSON | Promise<DrizzleSnapshotJSON>
  generateMigration: (prev: DrizzleSnapshotJSON, cur: DrizzleSnapshotJSON) => Promise<string[]>
  pushSchema: (
    schema: Record<string, unknown>,
    drizzle: DrizzleAdapter['drizzle'],
    filterSchema?: string[],
    tablesFilter?: string[],
    extensionsFilter?: string[],
  ) => Promise<{ apply; hasDataLoss; warnings }>
  upSnapshot?: (snapshot: Record<string, unknown>) => DrizzleSnapshotJSON
}

export type Migration = {
  down: ({
    db,
    payload,
    req,
  }: {
    db?: DrizzleTransaction | LibSQLDatabase<Record<string, never>> | PostgresDB
    payload: Payload
    req: PayloadRequest
  }) => Promise<void>
  up: ({
    db,
    payload,
    req,
  }: {
    db?: DrizzleTransaction | LibSQLDatabase | PostgresDB
    payload: Payload
    req: PayloadRequest
  }) => Promise<void>
} & MigrationData

export type CreateJSONQueryArgs = {
  column?: Column | string
  operator: string
  pathSegments: string[]
  rawColumn?: SQL<unknown>
  table?: string
  treatAsArray?: string[]
  treatRootAsArray?: boolean
  value: boolean | number | number[] | string | string[]
}

/**
 * Abstract relation link
 */
export type RawRelation =
  | {
      fields: { name: string; table: string }[]
      references: string[]
      relationName?: string
      to: string
      type: 'one'
    }
  | {
      relationName?: string
      to: string
      type: 'many'
    }

/**
 * Abstract SQL table that later gets converted by database specific implementation to Drizzle
 */
export type RawTable = {
  columns: Record<string, RawColumn>
  foreignKeys?: Record<string, RawForeignKey>
  indexes?: Record<string, RawIndex>
  name: string
}

/**
 * Abstract SQL foreign key that later gets converted by database specific implementation to Drizzle
 */
export type RawForeignKey = {
  columns: string[]
  foreignColumns: { name: string; table: string }[]
  name: string
  onDelete?: UpdateDeleteAction
  onUpdate?: UpdateDeleteAction
}

/**
 * Abstract SQL index that later gets converted by database specific implementation to Drizzle
 */
export type RawIndex = {
  name: string
  on: string | string[]
  unique?: boolean
}

/**
 * Abstract SQL column that later gets converted by database specific implementation to Drizzle
 */
export type BaseRawColumn = {
  default?: any
  name: string
  notNull?: boolean
  primaryKey?: boolean
  reference?: {
    name: string
    onDelete: UpdateDeleteAction
    table: string
  }
}

/**
 * Postgres: native timestamp type
 * SQLite: text column, defaultNow achieved through strftime('%Y-%m-%dT%H:%M:%fZ', 'now'). withTimezone/precision have no any effect.
 */
export type TimestampRawColumn = {
  defaultNow?: boolean
  mode: 'date' | 'string'
  precision: Precision
  type: 'timestamp'
  withTimezone?: boolean
} & BaseRawColumn

/**
 * Postgres: native UUID type and db lavel defaultRandom
 * SQLite: text type and defaultRandom in the app level
 */
export type UUIDRawColumn = {
  defaultRandom?: boolean
  type: 'uuid'
} & BaseRawColumn

/**
 * Accepts either `locale: true` to have options from locales or `options` string array
 * Postgres: native enums
 * SQLite: text column with checks.
 */
export type EnumRawColumn = (
  | {
      enumName: string
      options: string[]
      type: 'enum'
    }
  | {
      locale: true
      type: 'enum'
    }
) &
  BaseRawColumn

export type IntegerRawColumn = {
  /**
   * SQLite only.
   * Enable [AUTOINCREMENT](https://www.sqlite.org/autoinc.html) for primary key to ensure that the same ID cannot be reused from previously deleted rows.
   */
  autoIncrement?: boolean
  type: 'integer'
} & BaseRawColumn

export type VectorRawColumn = {
  dimensions?: number
  type: 'vector'
} & BaseRawColumn

export type HalfVecRawColumn = {
  dimensions?: number
  type: 'halfvec'
} & BaseRawColumn

export type SparseVecRawColumn = {
  dimensions?: number
  type: 'sparsevec'
} & BaseRawColumn

export type BinaryVecRawColumn = {
  dimensions?: number
  type: 'bit'
} & BaseRawColumn

export type RawColumn =
  | ({
      type: 'boolean' | 'geometry' | 'jsonb' | 'numeric' | 'serial' | 'text' | 'varchar'
    } & BaseRawColumn)
  | BinaryVecRawColumn
  | EnumRawColumn
  | HalfVecRawColumn
  | IntegerRawColumn
  | SparseVecRawColumn
  | TimestampRawColumn
  | UUIDRawColumn
  | VectorRawColumn

export type IDType = 'integer' | 'numeric' | 'text' | 'uuid' | 'varchar'

export type SetColumnID = (args: {
  adapter: DrizzleAdapter
  columns: Record<string, RawColumn>
  fields: FlattenedField[]
}) => IDType

export type ColumnToCodeConverter = (args: {
  adapter: DrizzleAdapter
  addEnum: (name: string, options: string[]) => void
  addImport: (from: string, name: string) => void
  column: RawColumn
  locales?: string[]
  tableKey: string
}) => string

export type BuildDrizzleTable<T extends DrizzleAdapter = DrizzleAdapter> = (args: {
  adapter: T
  locales: string[]
  rawTable: RawTable
}) => void

export interface DrizzleAdapter extends BaseDatabaseAdapter {
  blocksAsJSON?: boolean
  convertPathToJSONTraversal?: (incomingSegments: string[]) => string
  countDistinct: CountDistinct
  createJSONQuery: (args: CreateJSONQueryArgs) => string
  defaultDrizzleSnapshot: Record<string, unknown>
  deleteWhere: DeleteWhere
  drizzle: LibSQLDatabase | PostgresDB
  dropDatabase: DropDatabase
  enums?: never | Record<string, unknown>
  execute: Execute<unknown>

  features: {
    json?: boolean
  }
  /**
   * An object keyed on each table, with a key value pair where the constraint name is the key, followed by the dot-notation field name
   * Used for returning properly formed errors from unique fields
   */
  fieldConstraints: Record<string, Record<string, string>>
  foreignKeys: Set<string>
  idType: 'serial' | 'uuid'
  indexes: Set<string>
  initializing: Promise<void>
  insert: Insert
  limitedBoundParameters?: boolean
  localesSuffix?: string
  logger: DrizzleConfig['logger']
  operators: Operators
  push: boolean
  rawRelations: Record<string, Record<string, RawRelation>>
  rawTables: Record<string, RawTable>
  rejectInitializing: () => void

  relations: Record<string, GenericRelation>
  relationshipsSuffix?: string
  requireDrizzleKit: RequireDrizzleKit
  resolveInitializing: () => void
  schema: Record<string, unknown>

  schemaName?: string
  sessions: {
    [id: string]: {
      db: DrizzleTransaction
      reject: () => Promise<void>
      resolve: () => Promise<void>
    }
  }
  tableNameMap: Map<string, string>
  tables: Record<string, any>
  transactionOptions: unknown
  versionsSuffix?: string
}

export type RelationMap = Map<
  string,
  {
    localized: boolean
    relationName?: string
    target: string
    type: 'many' | 'one'
  }
>

/**
 * @deprecated - will be removed in 4.0. Use query + $dynamic() instead: https://orm.drizzle.team/docs/dynamic-query-building
 */
export type { ChainedMethods } from './find/chainMethods.js'
```

--------------------------------------------------------------------------------

---[FILE: updateGlobal.ts]---
Location: payload-main/packages/drizzle/src/updateGlobal.ts

```typescript
import type { UpdateGlobalArgs } from 'payload'

import toSnakeCase from 'to-snake-case'

import type { DrizzleAdapter } from './types.js'

import { upsertRow } from './upsertRow/index.js'
import { getTransaction } from './utilities/getTransaction.js'

export async function updateGlobal<T extends Record<string, unknown>>(
  this: DrizzleAdapter,
  { slug, data, req, returning, select }: UpdateGlobalArgs,
): Promise<T> {
  const globalConfig = this.payload.globals.config.find((config) => config.slug === slug)
  const tableName = this.tableNameMap.get(toSnakeCase(globalConfig.slug))

  const db = await getTransaction(this, req)
  const existingGlobal = await db.query[tableName].findFirst({})

  const result = await upsertRow<{ globalType: string } & T>({
    ...(existingGlobal ? { id: existingGlobal.id, operation: 'update' } : { operation: 'create' }),
    adapter: this,
    data,
    db,
    fields: globalConfig.flattenedFields,
    ignoreResult: returning === false,
    req,
    select,
    tableName,
  })

  if (returning === false) {
    return null
  }

  result.globalType = slug

  return result
}
```

--------------------------------------------------------------------------------

---[FILE: updateGlobalVersion.ts]---
Location: payload-main/packages/drizzle/src/updateGlobalVersion.ts

```typescript
import type {
  JsonObject,
  SanitizedGlobalConfig,
  TypeWithVersion,
  UpdateGlobalVersionArgs,
} from 'payload'

import { buildVersionGlobalFields } from 'payload'
import toSnakeCase from 'to-snake-case'

import type { DrizzleAdapter } from './types.js'

import { buildQuery } from './queries/buildQuery.js'
import { upsertRow } from './upsertRow/index.js'
import { getTransaction } from './utilities/getTransaction.js'

export async function updateGlobalVersion<T extends JsonObject = JsonObject>(
  this: DrizzleAdapter,
  {
    id,
    global,
    locale,
    req,
    returning,
    select,
    versionData,
    where: whereArg,
  }: UpdateGlobalVersionArgs<T>,
): Promise<TypeWithVersion<T>> {
  const globalConfig: SanitizedGlobalConfig = this.payload.globals.config.find(
    ({ slug }) => slug === global,
  )
  const whereToUse = whereArg || { id: { equals: id } }

  const tableName = this.tableNameMap.get(
    `_${toSnakeCase(globalConfig.slug)}${this.versionsSuffix}`,
  )

  const fields = buildVersionGlobalFields(this.payload.config, globalConfig, true)

  const { where } = buildQuery({
    adapter: this,
    fields,
    locale,
    tableName,
    where: whereToUse,
  })

  const db = await getTransaction(this, req)

  const result = await upsertRow<TypeWithVersion<T>>({
    id,
    adapter: this,
    data: versionData,
    db,
    fields,
    ignoreResult: returning === false,
    operation: 'update',
    req,
    select,
    tableName,
    where,
  })

  if (returning === false) {
    return null
  }

  return result
}
```

--------------------------------------------------------------------------------

---[FILE: updateJobs.ts]---
Location: payload-main/packages/drizzle/src/updateJobs.ts

```typescript
import type { UpdateJobs, Where } from 'payload'

import toSnakeCase from 'to-snake-case'

import type { DrizzleAdapter } from './types.js'

import { findMany } from './find/findMany.js'
import { upsertRow } from './upsertRow/index.js'
import { shouldUseOptimizedUpsertRow } from './upsertRow/shouldUseOptimizedUpsertRow.js'
import { getTransaction } from './utilities/getTransaction.js'

export const updateJobs: UpdateJobs = async function updateMany(
  this: DrizzleAdapter,
  { id, data, limit: limitArg, req, returning, sort: sortArg, where: whereArg },
) {
  if (
    !(data?.log as object[])?.length &&
    !(data.log && typeof data.log === 'object' && '$push' in data.log)
  ) {
    delete data.log
  }

  const whereToUse: Where = id ? { id: { equals: id } } : whereArg
  const limit = id ? 1 : limitArg

  const collection = this.payload.collections['payload-jobs'].config
  const tableName = this.tableNameMap.get(toSnakeCase(collection.slug))
  const sort = sortArg !== undefined && sortArg !== null ? sortArg : collection.defaultSort

  const useOptimizedUpsertRow = shouldUseOptimizedUpsertRow({
    data,
    fields: collection.flattenedFields,
  })

  if (useOptimizedUpsertRow && id) {
    const db = await getTransaction(this, req)

    const result = await upsertRow({
      id,
      adapter: this,
      data,
      db,
      fields: collection.flattenedFields,
      ignoreResult: returning === false,
      operation: 'update',
      req,
      tableName,
    })

    return returning === false ? null : [result]
  }

  const jobs = await findMany({
    adapter: this,
    collectionSlug: 'payload-jobs',
    fields: collection.flattenedFields,
    limit: id ? 1 : limit,
    pagination: false,
    req,
    sort,
    tableName,
    where: whereToUse,
  })
  if (!jobs.docs.length) {
    return []
  }

  const db = await getTransaction(this, req)

  const results = []

  // TODO: We need to batch this to reduce the amount of db calls. This can get very slow if we are updating a lot of rows.
  for (const job of jobs.docs) {
    const updateData = useOptimizedUpsertRow
      ? data
      : {
          ...job,
          ...data,
        }

    const result = await upsertRow({
      id: job.id,
      adapter: this,
      data: updateData,
      db,
      fields: collection.flattenedFields,
      ignoreResult: returning === false,
      operation: 'update',
      req,
      tableName,
    })

    results.push(result)
  }

  if (returning === false) {
    return null
  }

  return results
}
```

--------------------------------------------------------------------------------

---[FILE: updateMany.ts]---
Location: payload-main/packages/drizzle/src/updateMany.ts

```typescript
import type { LibSQLDatabase } from 'drizzle-orm/libsql'
import type { UpdateMany } from 'payload'

import toSnakeCase from 'to-snake-case'

import type { DrizzleAdapter } from './types.js'

import { buildQuery } from './queries/buildQuery.js'
import { selectDistinct } from './queries/selectDistinct.js'
import { upsertRow } from './upsertRow/index.js'
import { getTransaction } from './utilities/getTransaction.js'

export const updateMany: UpdateMany = async function updateMany(
  this: DrizzleAdapter,
  {
    collection: collectionSlug,
    data,
    joins: joinQuery,
    limit,
    locale,
    req,
    returning,
    select,
    sort: sortArg,
    where: whereToUse,
  },
) {
  const collection = this.payload.collections[collectionSlug].config
  const tableName = this.tableNameMap.get(toSnakeCase(collection.slug))

  const sort = sortArg !== undefined && sortArg !== null ? sortArg : collection.defaultSort

  const { joins, orderBy, selectFields, where } = buildQuery({
    adapter: this,
    fields: collection.flattenedFields,
    locale,
    sort,
    tableName,
    where: whereToUse,
  })

  const db = await getTransaction(this, req)

  let idsToUpdate: (number | string)[] = []

  const selectDistinctResult = await selectDistinct({
    adapter: this,
    db,
    joins,
    query: ({ query }) =>
      orderBy ? query.orderBy(() => orderBy.map(({ column, order }) => order(column))) : query,
    selectFields,
    tableName,
    where,
  })

  if (selectDistinctResult?.[0]?.id) {
    idsToUpdate = selectDistinctResult?.map((doc) => doc.id)
  } else if (whereToUse && !joins.length) {
    // If id wasn't passed but `where` without any joins, retrieve it with findFirst

    const _db = db as LibSQLDatabase

    const table = this.tables[tableName]

    let query = _db.select({ id: table.id }).from(table).where(where).$dynamic()

    if (typeof limit === 'number' && limit > 0) {
      query = query.limit(limit)
    }

    if (orderBy) {
      query = query.orderBy(() => orderBy.map(({ column, order }) => order(column)))
    }

    const docsToUpdate = await query

    idsToUpdate = docsToUpdate?.map((doc) => doc.id)
  }

  if (!idsToUpdate.length) {
    return []
  }

  const results = []

  // TODO: We need to batch this to reduce the amount of db calls. This can get very slow if we are updating a lot of rows.
  for (const idToUpdate of idsToUpdate) {
    const result = await upsertRow({
      id: idToUpdate,
      adapter: this,
      data,
      db,
      fields: collection.flattenedFields,
      ignoreResult: returning === false,
      joinQuery,
      operation: 'update',
      req,
      select,
      tableName,
    })
    results.push(result)
  }

  if (returning === false) {
    return null
  }

  return results
}
```

--------------------------------------------------------------------------------

---[FILE: updateOne.ts]---
Location: payload-main/packages/drizzle/src/updateOne.ts

```typescript
import type { LibSQLDatabase } from 'drizzle-orm/libsql'
import type { UpdateOne } from 'payload'

import toSnakeCase from 'to-snake-case'

import type { DrizzleAdapter } from './types.js'

import { buildQuery } from './queries/buildQuery.js'
import { selectDistinct } from './queries/selectDistinct.js'
import { upsertRow } from './upsertRow/index.js'
import { getTransaction } from './utilities/getTransaction.js'

export const updateOne: UpdateOne = async function updateOne(
  this: DrizzleAdapter,
  {
    id,
    collection: collectionSlug,
    data,
    joins: joinQuery,
    locale,
    options = { upsert: false },
    req,
    returning,
    select,
    where: whereArg,
  },
) {
  const collection = this.payload.collections[collectionSlug].config
  const tableName = this.tableNameMap.get(toSnakeCase(collection.slug))
  let idToUpdate = id

  const db = await getTransaction(this, req)

  if (!idToUpdate) {
    const { joins, selectFields, where } = buildQuery({
      adapter: this,
      fields: collection.flattenedFields,
      locale,
      tableName,
      where: whereArg,
    })

    // selectDistinct will only return if there are joins
    const selectDistinctResult = await selectDistinct({
      adapter: this,
      db,
      joins,
      query: ({ query }) => query.limit(1),
      selectFields,
      tableName,
      where,
    })

    if (selectDistinctResult?.[0]?.id) {
      idToUpdate = selectDistinctResult?.[0]?.id
      // If id wasn't passed but `where` without any joins, retrieve it with findFirst
    } else if (whereArg && !joins.length) {
      const table = this.tables[tableName]

      const docsToUpdate = await (db as LibSQLDatabase)
        .select({
          id: table.id,
        })
        .from(table)
        .where(where)
        .limit(1)
      idToUpdate = docsToUpdate?.[0]?.id
    }
  }

  if (!idToUpdate && !options.upsert) {
    // TODO: In 4.0, if returning === false, we should differentiate between:
    // - No document found to update
    // - Document found, but returning === false
    return null
  }

  const result = await upsertRow({
    id: idToUpdate,
    adapter: this,
    data,
    db,
    fields: collection.flattenedFields,
    ignoreResult: returning === false,
    joinQuery,
    operation: 'update',
    req,
    select,
    tableName,
  })

  if (returning === false) {
    return null
  }

  return result
}
```

--------------------------------------------------------------------------------

---[FILE: updateVersion.ts]---
Location: payload-main/packages/drizzle/src/updateVersion.ts

```typescript
import type {
  JsonObject,
  SanitizedCollectionConfig,
  TypeWithVersion,
  UpdateVersionArgs,
} from 'payload'

import { buildVersionCollectionFields } from 'payload'
import toSnakeCase from 'to-snake-case'

import type { DrizzleAdapter } from './types.js'

import { buildQuery } from './queries/buildQuery.js'
import { upsertRow } from './upsertRow/index.js'
import { getTransaction } from './utilities/getTransaction.js'

export async function updateVersion<T extends JsonObject = JsonObject>(
  this: DrizzleAdapter,
  {
    id,
    collection,
    locale,
    req,
    returning,
    select,
    versionData,
    where: whereArg,
  }: UpdateVersionArgs<T>,
): Promise<TypeWithVersion<T>> {
  const collectionConfig: SanitizedCollectionConfig = this.payload.collections[collection].config
  const whereToUse = whereArg || { id: { equals: id } }
  const tableName = this.tableNameMap.get(
    `_${toSnakeCase(collectionConfig.slug)}${this.versionsSuffix}`,
  )

  const fields = buildVersionCollectionFields(this.payload.config, collectionConfig, true)

  const { where } = buildQuery({
    adapter: this,
    fields,
    locale,
    tableName,
    where: whereToUse,
  })

  const db = await getTransaction(this, req)

  const result = await upsertRow<TypeWithVersion<T>>({
    id,
    adapter: this,
    data: versionData,
    db,
    fields,
    ignoreResult: returning === false,
    joinQuery: false,
    operation: 'update',
    req,
    select,
    tableName,
    where,
  })

  if (returning === false) {
    return null
  }

  return result
}
```

--------------------------------------------------------------------------------

---[FILE: upsert.ts]---
Location: payload-main/packages/drizzle/src/upsert.ts

```typescript
import type { Upsert } from 'payload'

import type { DrizzleAdapter } from './types.js'

export const upsert: Upsert = async function upsert(
  this: DrizzleAdapter,
  { collection, data, joins, locale, req, returning, select, where },
) {
  return this.updateOne({
    collection,
    data,
    joins,
    locale,
    options: { upsert: true },
    req,
    returning,
    select,
    where,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: postgres.ts]---
Location: payload-main/packages/drizzle/src/exports/postgres.ts

```typescript
export { columnToCodeConverter } from '../postgres/columnToCodeConverter.js'
export { countDistinct } from '../postgres/countDistinct.js'
export { createDatabase } from '../postgres/createDatabase.js'
export { createExtensions } from '../postgres/createExtensions.js'
export { createJSONQuery } from '../postgres/createJSONQuery/index.js'
export { defaultDrizzleSnapshot } from '../postgres/defaultSnapshot.js'
export { deleteWhere } from '../postgres/deleteWhere.js'
export { dropDatabase } from '../postgres/dropDatabase.js'
export { execute } from '../postgres/execute.js'
export { init } from '../postgres/init.js'
export { insert } from '../postgres/insert.js'
export { migratePostgresV2toV3 } from '../postgres/predefinedMigrations/v2-v3/index.js'
export { requireDrizzleKit } from '../postgres/requireDrizzleKit.js'
export { geometryColumn } from '../postgres/schema/geometryColumn.js'
export * from '../postgres/types.js'
```

--------------------------------------------------------------------------------

---[FILE: sqlite.ts]---
Location: payload-main/packages/drizzle/src/exports/sqlite.ts

```typescript
export { columnToCodeConverter } from '../sqlite/columnToCodeConverter.js'
export { countDistinct } from '../sqlite/countDistinct.js'
export { convertPathToJSONTraversal } from '../sqlite/createJSONQuery/convertPathToJSONTraversal.js'
export { createJSONQuery } from '../sqlite/createJSONQuery/index.js'
export { defaultDrizzleSnapshot } from '../sqlite/defaultSnapshot.js'
export { deleteWhere } from '../sqlite/deleteWhere.js'
export { dropDatabase } from '../sqlite/dropDatabase.js'
export { execute } from '../sqlite/execute.js'
export { init } from '../sqlite/init.js'
export { insert } from '../sqlite/insert.js'
export { requireDrizzleKit } from '../sqlite/requireDrizzleKit.js'
export * from '../sqlite/types.js'
```

--------------------------------------------------------------------------------

````
