---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 143
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 143 of 695)

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

---[FILE: init.ts]---
Location: payload-main/packages/drizzle/src/sqlite/init.ts

```typescript
import type { Init } from 'payload'

import type { DrizzleAdapter } from '../types.js'
import type { BaseSQLiteAdapter } from './types.js'

import { buildDrizzleRelations } from '../schema/buildDrizzleRelations.js'
import { buildRawSchema } from '../schema/buildRawSchema.js'
import { executeSchemaHooks } from '../utilities/executeSchemaHooks.js'
import { buildDrizzleTable } from './schema/buildDrizzleTable.js'
import { setColumnID } from './schema/setColumnID.js'

export const init: Init = async function init(this: BaseSQLiteAdapter) {
  let locales: string[] | undefined

  this.rawRelations = {}
  this.rawTables = {}

  if (this.payload.config.localization) {
    locales = this.payload.config.localization.locales.map(({ code }) => code)
  }

  const adapter = this as unknown as DrizzleAdapter

  buildRawSchema({
    adapter,
    setColumnID,
  })

  await executeSchemaHooks({ type: 'beforeSchemaInit', adapter: this })

  for (const tableName in this.rawTables) {
    buildDrizzleTable({ adapter, locales, rawTable: this.rawTables[tableName] })
  }

  buildDrizzleRelations({
    adapter,
  })

  await executeSchemaHooks({ type: 'afterSchemaInit', adapter: this })

  this.schema = {
    ...this.tables,
    ...this.relations,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: insert.ts]---
Location: payload-main/packages/drizzle/src/sqlite/insert.ts

```typescript
import type { BaseSQLiteAdapter, Insert } from './types.js'

export const insert: Insert = async function (
  // Here 'this' is not a parameter. See:
  // https://www.typescriptlang.org/docs/handbook/2/classes.html#this-parameters
  this: BaseSQLiteAdapter,
  { db, onConflictDoUpdate, tableName, values },
): Promise<Record<string, unknown>[]> {
  const table = this.tables[tableName]

  // Batch insert if limitedBoundParameters: true
  if (this.limitedBoundParameters && Array.isArray(values)) {
    const results: Record<string, unknown>[] = []
    const colsPerRow = Object.keys(values[0]).length
    const maxParams = 100
    const maxRowsPerBatch = Math.max(1, Math.floor(maxParams / colsPerRow))

    for (let i = 0; i < values.length; i += maxRowsPerBatch) {
      const batch = values.slice(i, i + maxRowsPerBatch)

      const batchResult = onConflictDoUpdate
        ? await db.insert(table).values(batch).onConflictDoUpdate(onConflictDoUpdate).returning()
        : await db.insert(table).values(batch).returning()

      results.push(...(batchResult as Record<string, unknown>[]))
    }

    return results
  }

  const result = onConflictDoUpdate
    ? await db.insert(table).values(values).onConflictDoUpdate(onConflictDoUpdate).returning()
    : await db.insert(table).values(values).returning()

  // See https://github.com/payloadcms/payload/pull/11831#discussion_r2010431908
  return result as Record<string, unknown>[]
}
```

--------------------------------------------------------------------------------

---[FILE: requireDrizzleKit.ts]---
Location: payload-main/packages/drizzle/src/sqlite/requireDrizzleKit.ts

```typescript
import { createRequire } from 'module'

import type { RequireDrizzleKit } from '../types.js'

const require = createRequire(import.meta.url)

export const requireDrizzleKit: RequireDrizzleKit = () => {
  const {
    generateSQLiteDrizzleJson,
    generateSQLiteMigration,
    pushSQLiteSchema,
  } = require('drizzle-kit/api')

  return {
    generateDrizzleJson: generateSQLiteDrizzleJson,
    generateMigration: generateSQLiteMigration,
    pushSchema: pushSQLiteSchema,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/drizzle/src/sqlite/types.ts

```typescript
import type { Client, ResultSet } from '@libsql/client'
import type { DrizzleConfig, Relation, Relations, SQL } from 'drizzle-orm'
import type { DrizzleD1Database } from 'drizzle-orm/d1'
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

import type { Operators } from '../queries/operatorMap.js'
import type { BuildQueryJoinAliases, DrizzleAdapter } from '../types.js'
import type { extendDrizzleTable } from '../utilities/extendDrizzleTable.js'

type SQLiteSchema = {
  relations: Record<string, GenericRelation>
  tables: Record<string, SQLiteTableWithColumns<any>>
}

type SQLiteSchemaHookArgs = {
  extendTable: typeof extendDrizzleTable
  schema: SQLiteSchema
}

export type SQLiteSchemaHook = (args: SQLiteSchemaHookArgs) => Promise<SQLiteSchema> | SQLiteSchema

export type BaseSQLiteArgs = {
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
  /**
   * Store blocks as JSON column instead of storing them in a relational structure.
   */
  blocksAsJSON?: boolean
  /** Generated schema from payload generate:db-schema file path */
  generateSchemaOutputFile?: string
  idType?: 'number' | 'uuid'
  localesSuffix?: string
  logger?: DrizzleConfig['logger']
  migrationDir?: string
  prodMigrations?: {
    down: (args: MigrateDownArgs) => Promise<void>
    name: string
    up: (args: MigrateUpArgs) => Promise<void>
  }[]
  push?: boolean
  relationshipsSuffix?: string
  schemaName?: string
  transactionOptions?: false | SQLiteTransactionConfig
  versionsSuffix?: string
}

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

export type DropDatabase = (args: { adapter: BaseSQLiteAdapter }) => Promise<void>

export type Execute<T> = (args: {
  db?: DrizzleD1Database | LibSQLDatabase
  drizzle?: DrizzleD1Database | LibSQLDatabase
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

export type BaseSQLiteAdapter = {
  afterSchemaInit: SQLiteSchemaHook[]
  autoIncrement: boolean
  beforeSchemaInit: SQLiteSchemaHook[]
  client: Client
  countDistinct: CountDistinct
  defaultDrizzleSnapshot: any
  deleteWhere: DeleteWhere
  dropDatabase: DropDatabase
  execute: Execute<unknown>
  /**
   * An object keyed on each table, with a key value pair where the constraint name is the key, followed by the dot-notation field name
   * Used for returning properly formed errors from unique fields
   */
  fieldConstraints: Record<string, Record<string, string>>
  idType: BaseSQLiteArgs['idType']
  initializing: Promise<void>
  insert: Insert
  localesSuffix?: string
  logger: DrizzleConfig['logger']
  operators: Operators
  prodMigrations?: {
    down: (args: MigrateDownArgs) => Promise<void>
    name: string
    up: (args: MigrateUpArgs) => Promise<void>
  }[]
  push: boolean
  rejectInitializing: () => void
  relations: Record<string, GenericRelation>
  relationshipsSuffix?: string
  resolveInitializing: () => void
  schema: Record<string, GenericRelation | GenericTable>
  schemaName?: BaseSQLiteArgs['schemaName']
  tableNameMap: Map<string, string>
  tables: Record<string, GenericTable>
  transactionOptions: SQLiteTransactionConfig
  versionsSuffix?: string
} & SQLiteDrizzleAdapter

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
```

--------------------------------------------------------------------------------

---[FILE: convertPathToJSONTraversal.ts]---
Location: payload-main/packages/drizzle/src/sqlite/createJSONQuery/convertPathToJSONTraversal.ts

```typescript
export const convertPathToJSONTraversal = (incomingSegments: string[]): string => {
  const segments = [...incomingSegments]
  segments.shift()

  return segments.reduce((res, segment) => {
    const formattedSegment = Number.isNaN(parseInt(segment)) ? `'${segment}'` : segment
    return `${res}->>${formattedSegment}`
  }, '')
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/drizzle/src/sqlite/createJSONQuery/index.ts

```typescript
import type { CreateJSONQueryArgs } from '../../types.js'

type FromArrayArgs = {
  isRoot?: true
  operator: string
  pathSegments: string[]
  table: string
  treatAsArray?: string[]
  value: boolean | number | string
}

const fromArray = ({
  isRoot,
  operator,
  pathSegments,
  table,
  treatAsArray,
  value,
}: FromArrayArgs) => {
  const newPathSegments = pathSegments.slice(1)
  const alias = `${pathSegments[isRoot ? 0 : 1]}_alias_${newPathSegments.length}`

  return `EXISTS (
    SELECT 1
    FROM json_each(${table}.${pathSegments[0]}) AS ${alias}
    WHERE ${createJSONQuery({
      operator,
      pathSegments: newPathSegments,
      table: alias,
      treatAsArray,
      value,
    })}
  )`
}

type CreateConstraintArgs = {
  alias?: string
  operator: string
  pathSegments: string[]
  treatAsArray?: string[]
  value: boolean | number | string
}

const createConstraint = ({
  alias,
  operator,
  pathSegments,
  value,
}: CreateConstraintArgs): string => {
  const newAlias = `${pathSegments[0]}_alias_${pathSegments.length - 1}`

  if (operator === 'exists' && value === false) {
    operator = 'not_exists'
    value = true
  } else if (operator === 'not_exists' && value === false) {
    operator = 'exists'
    value = true
  }

  if (operator === 'exists') {
    if (pathSegments.length === 1) {
      return `EXISTS (SELECT 1 FROM json_each("${pathSegments[0]}") AS ${newAlias})`
    }

    return `EXISTS (
      SELECT 1
      FROM json_each(${alias}.value -> '${pathSegments[0]}') AS ${newAlias}
      WHERE ${newAlias}.key = '${pathSegments[1]}'
    )`
  }

  if (operator === 'not_exists') {
    if (pathSegments.length === 1) {
      return `NOT EXISTS (SELECT 1 FROM json_each("${pathSegments[0]}") AS ${newAlias})`
    }

    return `NOT EXISTS (
      SELECT 1
      FROM json_each(${alias}.value -> '${pathSegments[0]}') AS ${newAlias}
      WHERE ${newAlias}.key = '${pathSegments[1]}'
    )`
  }

  let formattedValue = value
  let formattedOperator = operator
  if (['contains', 'like'].includes(operator)) {
    formattedOperator = 'like'
    formattedValue = `%${value}%`
  } else if (['not_like', 'notlike'].includes(operator)) {
    formattedOperator = 'not like'
    formattedValue = `%${value}%`
  } else if (operator === 'equals') {
    formattedOperator = '='
  }

  if (pathSegments.length === 1) {
    return `EXISTS (SELECT 1 FROM json_each("${pathSegments[0]}") AS ${newAlias} WHERE ${newAlias}.value ${formattedOperator} '${formattedValue}')`
  }

  return `EXISTS (
  SELECT 1
  FROM json_each(${alias}.value -> '${pathSegments[0]}') AS ${newAlias}
  WHERE COALESCE(${newAlias}.value ->> '${pathSegments[1]}', '') ${formattedOperator} '${formattedValue}'
  )`
}

export const createJSONQuery = ({
  column,
  operator,
  pathSegments,
  rawColumn,
  table,
  treatAsArray,
  treatRootAsArray,
  value,
}: CreateJSONQueryArgs): string => {
  if ((operator === 'in' || operator === 'not_in') && Array.isArray(value)) {
    let sql = ''
    for (const [i, v] of value.entries()) {
      sql = `${sql}${createJSONQuery({ column, operator: operator === 'in' ? 'equals' : 'not_equals', pathSegments, rawColumn, table, treatAsArray, treatRootAsArray, value: v })} ${i === value.length - 1 ? '' : ` ${operator === 'in' ? 'OR' : 'AND'} `}`
    }
    return sql
  }

  if (treatAsArray?.includes(pathSegments[1]) && table) {
    return fromArray({
      operator,
      pathSegments,
      table,
      treatAsArray,
      value: value as CreateConstraintArgs['value'],
    })
  }

  return createConstraint({
    alias: table,
    operator,
    pathSegments,
    treatAsArray,
    value: value as CreateConstraintArgs['value'],
  })
}
```

--------------------------------------------------------------------------------

---[FILE: buildDrizzleTable.ts]---
Location: payload-main/packages/drizzle/src/sqlite/schema/buildDrizzleTable.ts

```typescript
import type { ForeignKeyBuilder, IndexBuilder } from 'drizzle-orm/sqlite-core'

import { sql } from 'drizzle-orm'
import {
  foreignKey,
  index,
  integer,
  numeric,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core'
import { v4 as uuidv4 } from 'uuid'

import type { BuildDrizzleTable, RawColumn } from '../../types.js'

const rawColumnBuilderMap: Partial<Record<RawColumn['type'], any>> = {
  integer,
  numeric,
  text,
}

export const buildDrizzleTable: BuildDrizzleTable = ({ adapter, locales, rawTable }) => {
  const columns: Record<string, any> = {}

  for (const [key, column] of Object.entries(rawTable.columns)) {
    switch (column.type) {
      case 'boolean': {
        columns[key] = integer(column.name, { mode: 'boolean' })
        break
      }

      case 'enum':
        if ('locale' in column) {
          columns[key] = text(column.name, { enum: locales as [string, ...string[]] })
        } else {
          columns[key] = text(column.name, { enum: column.options as [string, ...string[]] })
        }
        break

      case 'geometry':
      case 'jsonb': {
        columns[key] = text(column.name, { mode: 'json' })
        break
      }

      case 'numeric': {
        columns[key] = numeric(column.name, { mode: 'number' })
        break
      }

      case 'serial': {
        columns[key] = integer(column.name)
        break
      }

      case 'timestamp': {
        let builder = text(column.name)

        if (column.defaultNow) {
          builder = builder.default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`)
        }

        columns[key] = builder
        break
      }

      case 'uuid': {
        let builder = text(column.name, { length: 36 })

        if (column.defaultRandom) {
          builder = builder.$defaultFn(() => uuidv4())
        }

        columns[key] = builder
        break
      }

      case 'varchar': {
        columns[key] = text(column.name)
        break
      }

      default:
        columns[key] = rawColumnBuilderMap[column.type](column.name)
        break
    }

    if (column.reference) {
      const ref = column.reference
      columns[key].references(() => adapter.tables[ref.table][ref.name], {
        onDelete: ref.onDelete,
      })
    }

    if (column.primaryKey) {
      let args: Record<string, unknown> | undefined = undefined

      if (column.type === 'integer' && column.autoIncrement) {
        args = { autoIncrement: true }
      }

      columns[key].primaryKey(args)
    }

    if (column.notNull) {
      columns[key].notNull()
    }

    if (typeof column.default !== 'undefined') {
      let sanitizedDefault = column.default

      if (column.type === 'geometry' && Array.isArray(column.default)) {
        sanitizedDefault = JSON.stringify({
          type: 'Point',
          coordinates: [column.default[0], column.default[1]],
        })
      }

      columns[key].default(sanitizedDefault)
    }
  }

  const extraConfig = (cols: any) => {
    const config: Record<string, ForeignKeyBuilder | IndexBuilder> = {}

    if (rawTable.indexes) {
      for (const [key, rawIndex] of Object.entries(rawTable.indexes)) {
        let fn: any = index
        if (rawIndex.unique) {
          fn = uniqueIndex
        }

        if (Array.isArray(rawIndex.on)) {
          if (rawIndex.on.length) {
            config[key] = fn(rawIndex.name).on(...rawIndex.on.map((colName) => cols[colName]))
          }
        } else {
          config[key] = fn(rawIndex.name).on(cols[rawIndex.on])
        }
      }
    }

    if (rawTable.foreignKeys) {
      for (const [key, rawForeignKey] of Object.entries(rawTable.foreignKeys)) {
        let builder = foreignKey({
          name: rawForeignKey.name,
          columns: rawForeignKey.columns.map((colName) => cols[colName]) as any,
          foreignColumns: rawForeignKey.foreignColumns.map(
            (column) => adapter.tables[column.table][column.name],
          ),
        })

        if (rawForeignKey.onDelete) {
          builder = builder.onDelete(rawForeignKey.onDelete)
        }

        if (rawForeignKey.onUpdate) {
          builder = builder.onDelete(rawForeignKey.onUpdate)
        }

        config[key] = builder
      }
    }

    return config
  }

  adapter.tables[rawTable.name] = sqliteTable(rawTable.name, columns as any, extraConfig as any)
}
```

--------------------------------------------------------------------------------

---[FILE: setColumnID.ts]---
Location: payload-main/packages/drizzle/src/sqlite/schema/setColumnID.ts

```typescript
import type { SetColumnID } from '../../types.js'
import type { BaseSQLiteAdapter } from '../types.js'

export const setColumnID: SetColumnID = ({ adapter, columns, fields }) => {
  const idField = fields.find((field) => field.name === 'id')
  if (idField) {
    if (idField.type === 'number') {
      columns.id = {
        name: 'id',
        type: 'numeric',
        primaryKey: true,
      }
      return 'numeric'
    }

    if (idField.type === 'text') {
      columns.id = {
        name: 'id',
        type: 'text',
        primaryKey: true,
      }
      return 'text'
    }
  }

  if (adapter.idType === 'uuid') {
    columns.id = {
      name: 'id',
      type: 'uuid',
      defaultRandom: true,
      primaryKey: true,
    }

    return 'uuid'
  }

  columns.id = {
    name: 'id',
    type: 'integer',
    autoIncrement: (adapter as unknown as BaseSQLiteAdapter).autoIncrement,
    primaryKey: true,
  }

  return 'integer'
}
```

--------------------------------------------------------------------------------

---[FILE: beginTransaction.ts]---
Location: payload-main/packages/drizzle/src/transactions/beginTransaction.ts

```typescript
import type { BeginTransaction } from 'payload'

import { v4 as uuid } from 'uuid'

import type { DrizzleAdapter, DrizzleTransaction } from '../types.js'

export const beginTransaction: BeginTransaction = async function beginTransaction(
  this: DrizzleAdapter,
  options: DrizzleAdapter['transactionOptions'],
) {
  let id
  try {
    id = uuid()

    let reject: () => Promise<void>
    let resolve: () => Promise<void>
    let transaction: DrizzleTransaction

    let transactionReady: () => void

    // Await initialization here
    // Prevent race conditions where the adapter may be
    // re-initializing, and `this.drizzle` is potentially undefined
    await this.initializing

    // Drizzle only exposes a transactions API that is sufficient if you
    // can directly pass around the `tx` argument. But our operations are spread
    // over many files and we don't want to pass the `tx` around like that,
    // so instead, we "lift" up the `resolve` and `reject` methods
    // and will call them in our respective transaction methods
    const done = this.drizzle
      .transaction(async (tx) => {
        transaction = tx
        await new Promise<void>((res, rej) => {
          resolve = () => {
            res()
            return done
          }
          reject = () => {
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
            rej()
            return done
          }
          transactionReady()
        })
      }, options || this.transactionOptions)
      .catch(() => {
        // swallow
      })

    // Need to wait until the transaction is ready
    // before binding its `resolve` and `reject` methods below
    await new Promise<void>((resolve) => (transactionReady = resolve))

    this.sessions[id] = {
      db: transaction,
      reject,
      resolve,
    }
  } catch (err) {
    this.payload.logger.error({ err, msg: `Error: cannot begin transaction: ${err.message}` })
    throw new Error(`Error: cannot begin transaction: ${err.message}`)
  }

  return id
}
```

--------------------------------------------------------------------------------

---[FILE: commitTransaction.ts]---
Location: payload-main/packages/drizzle/src/transactions/commitTransaction.ts

```typescript
import type { CommitTransaction } from 'payload'

export const commitTransaction: CommitTransaction = async function commitTransaction(
  incomingID = '',
) {
  const transactionID = incomingID instanceof Promise ? await incomingID : incomingID

  // if the session was deleted it has already been aborted
  if (!this.sessions[transactionID]) {
    return
  }

  const session = this.sessions[transactionID]

  // Delete from registry FIRST to prevent race conditions
  // This ensures other operations can't retrieve this session while we're ending it
  delete this.sessions[transactionID]

  try {
    await session.resolve()
  } catch (_) {
    await session.reject()
  }
}
```

--------------------------------------------------------------------------------

---[FILE: rollbackTransaction.ts]---
Location: payload-main/packages/drizzle/src/transactions/rollbackTransaction.ts

```typescript
import type { RollbackTransaction } from 'payload'

export const rollbackTransaction: RollbackTransaction = async function rollbackTransaction(
  incomingID = '',
) {
  const transactionID = incomingID instanceof Promise ? await incomingID : incomingID

  // if multiple operations are using the same transaction, the first will flow through and delete the session.
  // subsequent calls should be ignored.
  if (!this.sessions[transactionID]) {
    return
  }

  const session = this.sessions[transactionID]

  // Delete from registry FIRST to prevent race conditions
  // This ensures other operations can't retrieve this session while we're ending it
  delete this.sessions[transactionID]

  // end the session promise in failure by calling reject
  await session.reject()
}
```

--------------------------------------------------------------------------------

---[FILE: hasManyNumber.ts]---
Location: payload-main/packages/drizzle/src/transform/read/hasManyNumber.ts

```typescript
import type { NumberField } from 'payload'

type Args = {
  field: NumberField
  locale?: string
  numberRows: Record<string, unknown>[]
  ref: Record<string, unknown>
  withinArrayOrBlockLocale?: string
}

export const transformHasManyNumber = ({
  field,
  locale,
  numberRows,
  ref,
  withinArrayOrBlockLocale,
}: Args) => {
  let result: unknown[]

  if (withinArrayOrBlockLocale) {
    result = numberRows.reduce((acc, { locale, number }) => {
      if (locale === withinArrayOrBlockLocale) {
        if (typeof number === 'string') {
          number = Number(number)
        }
        acc.push(number)
      }

      return acc
    }, [])
  } else {
    result = numberRows.map(({ number }) => {
      if (typeof number === 'string') {
        number = Number(number)
      }
      return number
    })
  }

  if (locale) {
    ref[field.name][locale] = result
  } else {
    ref[field.name] = result
  }
}
```

--------------------------------------------------------------------------------

---[FILE: hasManyText.ts]---
Location: payload-main/packages/drizzle/src/transform/read/hasManyText.ts

```typescript
import type { TextField } from 'payload'

type Args = {
  field: TextField
  locale?: string
  ref: Record<string, unknown>
  textRows: Record<string, unknown>[]
  withinArrayOrBlockLocale?: string
}

export const transformHasManyText = ({
  field,
  locale,
  ref,
  textRows,
  withinArrayOrBlockLocale,
}: Args) => {
  let result: unknown[]

  if (withinArrayOrBlockLocale) {
    result = textRows.reduce((acc, { locale, text }) => {
      if (locale === withinArrayOrBlockLocale) {
        acc.push(text)
      }

      return acc
    }, [])
  } else {
    result = textRows.map(({ text }) => text)
  }

  if (locale) {
    ref[field.name][locale] = result
  } else {
    ref[field.name] = result
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/drizzle/src/transform/read/index.ts

```typescript
import type { FlattenedField, JoinQuery, SanitizedConfig, TypeWithID } from 'payload'

import type { DrizzleAdapter } from '../../types.js'

import { createBlocksMap } from '../../utilities/createBlocksMap.js'
import { createPathMap } from '../../utilities/createRelationshipMap.js'
import { traverseFields } from './traverseFields.js'

type TransformArgs = {
  adapter: DrizzleAdapter
  config: SanitizedConfig
  data: Record<string, unknown>
  fallbackLocale?: false | string
  fields: FlattenedField[]
  joinQuery?: JoinQuery
  locale?: string
  parentIsLocalized?: boolean
  tableName: string
}

// This is the entry point to transform Drizzle output data
// into the shape Payload expects based on field schema
export const transform = <T extends Record<string, unknown> | TypeWithID>({
  adapter,
  config,
  data,
  fields,
  joinQuery,
  parentIsLocalized,
  tableName,
}: TransformArgs): T => {
  let relationships: Record<string, Record<string, unknown>[]> = {}
  let texts: Record<string, Record<string, unknown>[]> = {}
  let numbers: Record<string, Record<string, unknown>[]> = {}

  if ('_rels' in data) {
    relationships = createPathMap(data._rels)
    delete data._rels
  }

  if ('_texts' in data) {
    texts = createPathMap(data._texts)
    delete data._texts
  }

  if ('_numbers' in data) {
    numbers = createPathMap(data._numbers)
    delete data._numbers
  }

  const blocks = createBlocksMap(data)

  const deletions = []

  const result = traverseFields<T>({
    adapter,
    blocks,
    config,
    currentTableName: tableName,
    dataRef: {
      id: data.id,
    },
    deletions,
    fieldPrefix: '',
    fields,
    joinQuery,
    numbers,
    parentIsLocalized,
    path: '',
    relationships,
    table: data,
    tablePath: '',
    texts,
    topLevelTableName: tableName,
  })

  deletions.forEach((deletion) => deletion())

  return result
}
```

--------------------------------------------------------------------------------

---[FILE: relationship.ts]---
Location: payload-main/packages/drizzle/src/transform/read/relationship.ts

```typescript
import type { RelationshipField, UploadField } from 'payload'

type Args = {
  field: RelationshipField | UploadField
  locale?: string
  ref: Record<string, unknown>
  relations: Record<string, unknown>[]
  withinArrayOrBlockLocale?: string
}

export const transformRelationship = ({
  field,
  locale,
  ref,
  relations,
  withinArrayOrBlockLocale,
}: Args) => {
  let result: unknown

  if (!('hasMany' in field) || field.hasMany === false) {
    let relation = relations[0]

    if (withinArrayOrBlockLocale) {
      relation = relations.find((rel) => rel.locale === withinArrayOrBlockLocale)
    }

    if (relation) {
      // Handle hasOne Poly
      if (Array.isArray(field.relationTo)) {
        const matchedRelation = Object.entries(relation).find(([key, val]) => {
          return val !== null && !['id', 'locale', 'order', 'parent', 'path'].includes(key)
        })

        if (matchedRelation) {
          const relationTo = matchedRelation[0].replace('ID', '')

          result = {
            relationTo,
            value: matchedRelation[1],
          }
        }
      }
    }
  } else {
    const transformedRelations = []

    relations.forEach((relation) => {
      let matchedLocale = true

      if (withinArrayOrBlockLocale) {
        matchedLocale = relation.locale === withinArrayOrBlockLocale
      }

      // Handle hasMany
      if (!Array.isArray(field.relationTo)) {
        const relatedData = relation[`${field.relationTo}ID`]

        if (relatedData && matchedLocale) {
          transformedRelations.push(relatedData)
        }
      } else {
        // Handle hasMany Poly
        const matchedRelation = Object.entries(relation).find(
          ([key, val]) =>
            val !== null &&
            !['id', 'locale', 'order', 'parent', 'path'].includes(key) &&
            matchedLocale,
        )

        if (matchedRelation) {
          const relationTo = matchedRelation[0].replace('ID', '')

          transformedRelations.push({
            relationTo,
            value: matchedRelation[1],
          })
        }
      }
    })

    result = transformedRelations
  }

  if (locale) {
    ref[field.name][locale] = result
  } else {
    ref[field.name] = result
  }
}
```

--------------------------------------------------------------------------------

````
