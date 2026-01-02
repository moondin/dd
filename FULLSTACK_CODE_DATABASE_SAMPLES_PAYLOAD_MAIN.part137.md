---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 137
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 137 of 695)

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
Location: payload-main/packages/drizzle/src/postgres/init.ts

```typescript
import type { Init } from 'payload'

import type { BasePostgresAdapter } from './types.js'

import { buildDrizzleRelations } from '../schema/buildDrizzleRelations.js'
import { buildRawSchema } from '../schema/buildRawSchema.js'
import { executeSchemaHooks } from '../utilities/executeSchemaHooks.js'
import { buildDrizzleTable } from './schema/buildDrizzleTable.js'
import { setColumnID } from './schema/setColumnID.js'

export const init: Init = async function init(this: BasePostgresAdapter) {
  this.rawRelations = {}
  this.rawTables = {}

  buildRawSchema({
    adapter: this,
    setColumnID,
  })

  await executeSchemaHooks({ type: 'beforeSchemaInit', adapter: this })

  if (this.payload.config.localization) {
    this.enums.enum__locales = this.pgSchema.enum(
      '_locales',
      this.payload.config.localization.locales.map(({ code }) => code) as [string, ...string[]],
    )
  }

  for (const tableName in this.rawTables) {
    buildDrizzleTable({ adapter: this, rawTable: this.rawTables[tableName] })
  }

  buildDrizzleRelations({
    adapter: this,
  })

  await executeSchemaHooks({ type: 'afterSchemaInit', adapter: this })

  this.schema = {
    pgSchema: this.pgSchema,
    ...this.tables,
    ...this.relations,
    ...this.enums,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: insert.ts]---
Location: payload-main/packages/drizzle/src/postgres/insert.ts

```typescript
import type { TransactionPg } from '../types.js'
import type { Insert } from './types.js'

export const insert: Insert = async function insert({
  db,
  onConflictDoUpdate,
  tableName,
  values,
}): Promise<Record<string, unknown>[]> {
  const table = this.tables[tableName]
  let result

  if (onConflictDoUpdate) {
    result = await (db as TransactionPg)
      .insert(table)
      .values(values)
      .onConflictDoUpdate(onConflictDoUpdate)
      .returning()
  } else {
    result = await (db as TransactionPg).insert(table).values(values).returning()
  }

  return result
}
```

--------------------------------------------------------------------------------

---[FILE: requireDrizzleKit.ts]---
Location: payload-main/packages/drizzle/src/postgres/requireDrizzleKit.ts

```typescript
import { createRequire } from 'module'

import type { RequireDrizzleKit } from '../types.js'

const require = createRequire(import.meta.url)

export const requireDrizzleKit: RequireDrizzleKit = () => {
  const {
    generateDrizzleJson,
    generateMigration,
    pushSchema,
    upPgSnapshot,
  } = require('drizzle-kit/api')

  return {
    generateDrizzleJson,
    generateMigration,
    pushSchema,
    upSnapshot: upPgSnapshot,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/drizzle/src/postgres/types.ts

```typescript
import type { DrizzleSnapshotJSON } from 'drizzle-kit/api'
import type {
  ColumnBaseConfig,
  ColumnDataType,
  DrizzleConfig,
  Relation,
  Relations,
  SQL,
} from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import type {
  ForeignKeyBuilder,
  IndexBuilder,
  PgColumn,
  PgEnum,
  pgEnum,
  PgInsertOnConflictDoUpdateConfig,
  PgSchema,
  PgTableWithColumns,
  UniqueConstraintBuilder,
} from 'drizzle-orm/pg-core'
import type { PgTableFn } from 'drizzle-orm/pg-core/table'
import type { SQLiteColumn } from 'drizzle-orm/sqlite-core'
import type { Payload, PayloadRequest } from 'payload'
import type { ClientConfig, QueryResult } from 'pg'

import type { extendDrizzleTable, Operators } from '../index.js'
import type { BuildQueryJoinAliases, DrizzleAdapter, TransactionPg } from '../types.js'

export type BaseExtraConfig = Record<
  string,
  (cols: GenericColumns) => ForeignKeyBuilder | IndexBuilder | UniqueConstraintBuilder
>

export type RelationMap = Map<
  string,
  {
    localized: boolean
    relationName?: string
    target: string
    type: 'many' | 'one'
  }
>

export type GenericColumn = PgColumn<
  ColumnBaseConfig<ColumnDataType, string>,
  Record<string, unknown>
>

export type GenericColumns = {
  [x: string]: GenericColumn
}

export type GenericTable = PgTableWithColumns<{
  columns: GenericColumns
  dialect: string
  name: string
  schema: string
}>

export type GenericEnum = PgEnum<[string, ...string[]]>

export type GenericRelation = Relations<string, Record<string, Relation<string>>>

export type PostgresDB = NodePgDatabase<Record<string, unknown>>

export type CountDistinct = (args: {
  column?: PgColumn<any> | SQLiteColumn<any>
  db: PostgresDB | TransactionPg
  joins: BuildQueryJoinAliases
  tableName: string
  where: SQL
}) => Promise<number>

export type DeleteWhere = (args: {
  db: PostgresDB | TransactionPg
  tableName: string
  where: SQL
}) => Promise<void>

export type DropDatabase = (args: { adapter: BasePostgresAdapter }) => Promise<void>

export type Execute<T> = (args: {
  db?: PostgresDB | TransactionPg
  drizzle?: PostgresDB
  raw?: string
  sql?: SQL<unknown>
}) => Promise<QueryResult<Record<string, T>>>

export type Insert = (args: {
  db: PostgresDB | TransactionPg
  onConflictDoUpdate?: PgInsertOnConflictDoUpdateConfig<any>
  tableName: string
  values: Record<string, unknown> | Record<string, unknown>[]
}) => Promise<Record<string, unknown>[]>

export type CreateDatabase = (args?: {
  /**
   * Name of a database, defaults to the current one
   */
  name?: string
  /**
   * Schema to create in addition to 'public'. Defaults from adapter.schemaName if exists.
   */
  schemaName?: string
}) => Promise<boolean>

type Schema =
  | {
      enum: typeof pgEnum
      table: PgTableFn<string>
    }
  | PgSchema

type PostgresSchema = {
  enums: Record<string, GenericEnum>
  relations: Record<string, GenericRelation>
  tables: Record<string, PgTableWithColumns<any>>
}

type PostgresSchemaHookArgs = {
  adapter: PostgresDrizzleAdapter
  extendTable: typeof extendDrizzleTable
  schema: PostgresSchema
}

export type PostgresSchemaHook = (
  args: PostgresSchemaHookArgs,
) => PostgresSchema | Promise<PostgresSchema>

export type BasePostgresAdapter = {
  afterSchemaInit: PostgresSchemaHook[]
  beforeSchemaInit: PostgresSchemaHook[]
  countDistinct: CountDistinct
  createDatabase: CreateDatabase
  createExtensions: () => Promise<void>
  defaultDrizzleSnapshot: DrizzleSnapshotJSON
  deleteWhere: DeleteWhere
  disableCreateDatabase: boolean
  drizzle: PostgresDB
  dropDatabase: DropDatabase
  enums: Record<string, GenericEnum>
  execute: Execute<unknown>
  extensions: Record<string, boolean>
  /**
   * An object keyed on each table, with a key value pair where the constraint name is the key, followed by the dot-notation field name
   * Used for returning properly formed errors from unique fields
   */
  fieldConstraints: Record<string, Record<string, string>>
  idType: 'serial' | 'uuid'
  initializing: Promise<void>
  insert: Insert
  localesSuffix?: string
  logger: DrizzleConfig['logger']
  operators: Operators
  pgSchema: Schema
  poolOptions?: ClientConfig
  prodMigrations?: {
    down: (args: MigrateDownArgs) => Promise<void>
    name: string
    up: (args: MigrateUpArgs) => Promise<void>
  }[]
  push: boolean
  readReplicaOptions?: string[]
  rejectInitializing: () => void
  relations: Record<string, GenericRelation>
  relationshipsSuffix?: string
  resolveInitializing: () => void
  schemaName?: string
  sessions: {
    [id: string]: {
      db: PostgresDB | TransactionPg
      reject: () => Promise<void>
      resolve: () => Promise<void>
    }
  }
  tableNameMap: Map<string, string>
  tables: Record<string, GenericTable>
  tablesFilter?: string[]
  versionsSuffix?: string
} & PostgresDrizzleAdapter

export type PostgresDrizzleAdapter = Omit<
  DrizzleAdapter,
  | 'countDistinct'
  | 'deleteWhere'
  | 'drizzle'
  | 'dropDatabase'
  | 'execute'
  | 'insert'
  | 'operators'
  | 'relations'
>

export type IDType = 'integer' | 'numeric' | 'uuid' | 'varchar'

export type MigrateUpArgs = {
  /**
   * The Postgres Drizzle instance that you can use to execute SQL directly within the current transaction.
   * @example
   * ```ts
   * import { type MigrateUpArgs, sql } from '@payloadcms/db-postgres'
   *
   * export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
   *   const { rows: posts } = await db.execute(sql`SELECT * FROM posts`)
   * }
   * ```
   */
  db: PostgresDB
  /**
   * The Payload instance that you can use to execute Local API methods
   * To use the current transaction you must pass `req` to arguments
   * @example
   * ```ts
   * import { type MigrateUpArgs, sql } from '@payloadcms/db-postgres'
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
   * The Postgres Drizzle instance that you can use to execute SQL directly within the current transaction.
   * @example
   * ```ts
   * import { type MigrateDownArgs, sql } from '@payloadcms/db-postgres'
   *
   * export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
   *   const { rows: posts } = await db.execute(sql`SELECT * FROM posts`)
   * }
   * ```
   */
  db: PostgresDB
  /**
   * The Payload instance that you can use to execute Local API methods
   * To use the current transaction you must pass `req` to arguments
   * @example
   * ```ts
   * import { type MigrateDownArgs } from '@payloadcms/db-postgres'
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

---[FILE: index.ts]---
Location: payload-main/packages/drizzle/src/postgres/createJSONQuery/index.ts

```typescript
import type { CreateJSONQueryArgs } from '../../types.js'

const operatorMap: Record<string, string> = {
  contains: '~',
  equals: '==',
  in: 'in',
  like: 'like_regex',
  not_equals: '!=',
  not_in: 'in',
  not_like: '!like_regex',
}

const sanitizeValue = (value: unknown, operator?: string) => {
  if (typeof value === 'string') {
    // ignore casing with like or not_like
    return `"${['like', 'not_like'].includes(operator) ? '(?i)' : ''}${value}"`
  }

  return value as string
}

export const createJSONQuery = ({ column, operator, pathSegments, value }: CreateJSONQueryArgs) => {
  const columnName = typeof column === 'object' ? column.name : column
  const jsonPaths = pathSegments
    .slice(1)
    .map((key) => {
      return `${key}[*]`
    })
    .join('.')

  const fullPath = pathSegments.length === 1 ? '$[*]' : `$.${jsonPaths}`

  let sql = ''

  if (['in', 'not_in'].includes(operator) && Array.isArray(value)) {
    sql = '('
    value.forEach((item, i) => {
      sql = `${sql}${createJSONQuery({ column, operator: operator === 'in' ? 'equals' : 'not_equals', pathSegments, value: item })}${i === value.length - 1 ? '' : ` ${operator === 'in' ? 'OR' : 'AND'} `}`
    })
    sql = `${sql})`
  } else if (operator === 'exists') {
    sql = `${value === false ? 'NOT ' : ''}jsonb_path_exists(${columnName}, '${fullPath}')`
  } else if (['not_like'].includes(operator)) {
    const mappedOperator = operatorMap[operator]

    sql = `NOT jsonb_path_exists(${columnName}, '${fullPath} ? (@ ${mappedOperator.substring(1)} ${sanitizeValue(value, operator)})')`
  } else {
    sql = `jsonb_path_exists(${columnName}, '${fullPath} ? (@ ${operatorMap[operator]} ${sanitizeValue(value, operator)})')`
  }

  return sql
}
```

--------------------------------------------------------------------------------

---[FILE: groupUpSQLStatements.ts]---
Location: payload-main/packages/drizzle/src/postgres/predefinedMigrations/v2-v3/groupUpSQLStatements.ts

```typescript
export type Groups =
  | 'addColumn'
  | 'addConstraint'
  | 'alterType'
  | 'createIndex'
  | 'createTable'
  | 'createType'
  | 'disableRowSecurity'
  | 'dropColumn'
  | 'dropConstraint'
  | 'dropIndex'
  | 'dropTable'
  | 'dropType'
  | 'notNull'
  | 'renameColumn'
  | 'setDefault'

/**
 * Convert an "ADD COLUMN" statement to an "ALTER COLUMN" statement.
 * Works with or without a schema name.
 *
 * Examples:
 * 'ALTER TABLE "pages_blocks_my_block" ADD COLUMN "person_id" integer NOT NULL;'
 * => 'ALTER TABLE "pages_blocks_my_block" ALTER COLUMN "person_id" SET NOT NULL;'
 *
 * 'ALTER TABLE "public"."pages_blocks_my_block" ADD COLUMN "person_id" integer NOT NULL;'
 * => 'ALTER TABLE "public"."pages_blocks_my_block" ALTER COLUMN "person_id" SET NOT NULL;'
 */
function convertAddColumnToAlterColumn(sql) {
  // Regular expression to match the ADD COLUMN statement with its constraints
  const regex = /ALTER TABLE ((?:"[^"]+"\.)?"[^"]+") ADD COLUMN ("[^"]+") [^;]*?NOT NULL;/i

  // Replace the matched part with "ALTER COLUMN ... SET NOT NULL;"
  return sql.replace(regex, 'ALTER TABLE $1 ALTER COLUMN $2 SET NOT NULL;')
}

export const groupUpSQLStatements = (list: string[]): Record<Groups, string[]> => {
  const groups = {
    /**
     * example: ALTER TABLE "posts" ADD COLUMN "category_id" integer
     */
    addColumn: 'ADD COLUMN',

    /**
     * example:
     *  DO $$ BEGIN
     *   ALTER TABLE "pages_blocks_my_block" ADD CONSTRAINT "pages_blocks_my_block_person_id_users_id_fk" FOREIGN KEY ("person_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
     *  EXCEPTION
     *   WHEN duplicate_object THEN null;
     *  END $$;
     */
    addConstraint: 'ADD CONSTRAINT',

    /**
     * example: CREATE TABLE IF NOT EXISTS "payload_locked_documents" (
     *  "id" serial PRIMARY KEY NOT NULL,
     *  "global_slug" varchar,
     *  "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
     *  "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
     * );
     */
    createTable: 'CREATE TABLE',

    /**
     * example: ALTER TABLE "_posts_v_rels" DROP COLUMN IF EXISTS "posts_id";
     */
    dropColumn: 'DROP COLUMN',

    /**
     * example: ALTER TABLE "_posts_v_rels" DROP CONSTRAINT "_posts_v_rels_posts_fk";
     */
    dropConstraint: 'DROP CONSTRAINT',

    /**
     * example: DROP TABLE "pages_rels";
     */
    dropTable: 'DROP TABLE',

    /**
     * example: ALTER TABLE "pages_blocks_my_block" ALTER COLUMN "person_id" SET NOT NULL;
     */
    notNull: 'NOT NULL',

    /**
     * example: CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('en', 'es');
     */
    createType: 'CREATE TYPE',

    /**
     * example: ALTER TYPE "public"."enum_pages_blocks_cta" ADD VALUE 'copy';
     */
    alterType: 'ALTER TYPE',

    /**
     * example: ALTER TABLE "categories_rels" DISABLE ROW LEVEL SECURITY;
     */
    disableRowSecurity: 'DISABLE ROW LEVEL SECURITY;',

    /**
     * example: DROP INDEX IF EXISTS "pages_title_idx";
     */
    dropIndex: 'DROP INDEX IF EXISTS',

    /**
     * example: ALTER TABLE "pages" ALTER COLUMN "_status" SET DEFAULT 'draft';
     */
    setDefault: 'SET DEFAULT',

    /**
     * example: CREATE INDEX IF NOT EXISTS "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
     */
    createIndex: 'INDEX IF NOT EXISTS',

    /**
     * example: DROP TYPE "public"."enum__pages_v_published_locale";
     */
    dropType: 'DROP TYPE',

    /**
     * columns were renamed from camelCase to snake_case
     * example: ALTER TABLE "forms" RENAME COLUMN "confirmationType" TO "confirmation_type";
     */
    renameColumn: 'RENAME COLUMN',
  }

  const result = Object.keys(groups).reduce((result, group: Groups) => {
    result[group] = []
    return result
  }, {}) as Record<Groups, string[]>

  // push multi-line changes to a single grouping
  let isCreateTable = false

  for (const line of list) {
    if (isCreateTable) {
      result.createTable.push(line)
      if (line.includes(');')) {
        isCreateTable = false
      }
      continue
    }
    Object.entries(groups).some(([key, value]) => {
      if (line.endsWith('NOT NULL;')) {
        // split up the ADD COLUMN and ALTER COLUMN NOT NULL statements
        // example: ALTER TABLE "pages_blocks_my_block" ADD COLUMN "person_id" integer NOT NULL;
        // becomes two separate statements:
        //  1. ALTER TABLE "pages_blocks_my_block" ADD COLUMN "person_id" integer;
        //  2.  ALTER TABLE "pages_blocks_my_block" ALTER COLUMN "person_id" SET NOT NULL;
        result.addColumn.push(line.replace(' NOT NULL;', ';'))
        result.notNull.push(convertAddColumnToAlterColumn(line))
        return true
      }
      if (line.includes(value)) {
        let statement = line
        if (key === 'dropConstraint') {
          statement = line.replace('" DROP CONSTRAINT "', '" DROP CONSTRAINT IF EXISTS "')
        }
        result[key].push(statement)
        return true
      }
    })
  }

  return result
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/drizzle/src/postgres/predefinedMigrations/v2-v3/index.ts

```typescript
import type { DrizzleSnapshotJSON } from 'drizzle-kit/api'
import type { Payload, PayloadRequest } from 'payload'

import { sql } from 'drizzle-orm'
import fs from 'fs'
import { buildVersionCollectionFields, buildVersionGlobalFields } from 'payload'
import toSnakeCase from 'to-snake-case'

import type { BasePostgresAdapter } from '../../types.js'
import type { PathsToQuery } from './types.js'

import { getTransaction } from '../../../utilities/getTransaction.js'
import { groupUpSQLStatements } from './groupUpSQLStatements.js'
import { migrateRelationships } from './migrateRelationships.js'
import { traverseFields } from './traverseFields.js'

type Args = {
  debug?: boolean
  payload: Payload
  req?: Partial<PayloadRequest>
}

const runStatementGroup = async ({ adapter, db, debug, statements }) => {
  const addColumnsStatement = statements.join('\n')

  if (debug) {
    adapter.payload.logger.info(debug)
    adapter.payload.logger.info(addColumnsStatement)
  }

  await db.execute(sql.raw(addColumnsStatement))
}

/**
 * Moves upload and relationship columns from the join table and into the tables while moving data
 * This is done in the following order:
 *    ADD COLUMNs
 *    -- manipulate data to move relationships to new columns
 *    ADD CONSTRAINTs
 *    NOT NULLs
 *    DROP TABLEs
 *    DROP CONSTRAINTs
 *    DROP COLUMNs
 * @param debug
 * @param payload
 * @param req
 */
export const migratePostgresV2toV3 = async ({ debug, payload, req }: Args) => {
  const adapter = payload.db as unknown as BasePostgresAdapter
  const dir = payload.db.migrationDir

  // get the drizzle migrateUpSQL from drizzle using the last schema
  const { generateDrizzleJson, generateMigration, upSnapshot } = adapter.requireDrizzleKit()
  const drizzleJsonAfter = generateDrizzleJson(adapter.schema) as DrizzleSnapshotJSON

  // Get the previous migration snapshot
  const previousSnapshot = fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.json') && !file.endsWith('relationships_v2_v3.json'))
    .sort()
    .reverse()?.[0]

  if (!previousSnapshot) {
    throw new Error(
      `No previous migration schema file found! A prior migration from v2 is required to migrate to v3.`,
    )
  }

  let drizzleJsonBefore = JSON.parse(
    fs.readFileSync(`${dir}/${previousSnapshot}`, 'utf8'),
  ) as DrizzleSnapshotJSON

  if (upSnapshot && drizzleJsonBefore.version < drizzleJsonAfter.version) {
    drizzleJsonBefore = upSnapshot(drizzleJsonBefore)
  }

  const generatedSQL = await generateMigration(drizzleJsonBefore, drizzleJsonAfter)

  if (!generatedSQL.length) {
    payload.logger.info(`No schema changes needed.`)
    process.exit(0)
  }

  const sqlUpStatements = groupUpSQLStatements(generatedSQL)

  const db = await getTransaction(adapter, req)

  await runStatementGroup({
    adapter,
    db,
    debug: debug ? 'CREATING TYPES' : null,
    statements: sqlUpStatements.createType,
  })

  await runStatementGroup({
    adapter,
    db,
    debug: debug ? 'ALTERING TYPES' : null,
    statements: sqlUpStatements.alterType,
  })

  await runStatementGroup({
    adapter,
    db,
    debug: debug ? 'CREATING TABLES' : null,
    statements: sqlUpStatements.createTable,
  })

  await runStatementGroup({
    adapter,
    db,
    debug: debug ? 'RENAMING COLUMNS' : null,
    statements: sqlUpStatements.renameColumn,
  })

  await runStatementGroup({
    adapter,
    db,
    debug: debug ? 'CREATING NEW RELATIONSHIP COLUMNS' : null,
    statements: sqlUpStatements.addColumn,
  })

  // SET DEFAULTS
  await runStatementGroup({
    adapter,
    db,
    debug: debug ? 'SETTING DEFAULTS' : null,
    statements: sqlUpStatements.setDefault,
  })

  await runStatementGroup({
    adapter,
    db,
    debug: debug ? 'CREATING INDEXES' : null,
    statements: sqlUpStatements.createIndex,
  })

  for (const collection of payload.config.collections) {
    if (collection.slug === 'payload-locked-documents') {
      continue
    }
    const tableName = adapter.tableNameMap.get(toSnakeCase(collection.slug))
    const pathsToQuery: PathsToQuery = new Set()

    traverseFields({
      adapter,
      collectionSlug: collection.slug,
      columnPrefix: '',
      db,
      disableNotNull: false,
      fields: collection.flattenedFields,
      isVersions: false,
      newTableName: tableName,
      parentTableName: tableName,
      path: '',
      pathsToQuery,
      payload,
      rootTableName: tableName,
    })

    await migrateRelationships({
      adapter,
      collectionSlug: collection.slug,
      db,
      debug,
      fields: collection.flattenedFields,
      isVersions: false,
      pathsToQuery,
      payload,
      req,
      tableName,
    })

    if (collection.versions) {
      const versionsTableName = adapter.tableNameMap.get(
        `_${toSnakeCase(collection.slug)}${adapter.versionsSuffix}`,
      )
      const versionFields = buildVersionCollectionFields(payload.config, collection, true)
      const versionPathsToQuery: PathsToQuery = new Set()

      traverseFields({
        adapter,
        collectionSlug: collection.slug,
        columnPrefix: '',
        db,
        disableNotNull: true,
        fields: versionFields,
        isVersions: true,
        newTableName: versionsTableName,
        parentTableName: versionsTableName,
        path: '',
        pathsToQuery: versionPathsToQuery,
        payload,
        rootTableName: versionsTableName,
      })

      await migrateRelationships({
        adapter,
        collectionSlug: collection.slug,
        db,
        debug,
        fields: versionFields,
        isVersions: true,
        pathsToQuery: versionPathsToQuery,
        payload,
        req,
        tableName: versionsTableName,
      })
    }
  }

  for (const global of payload.config.globals) {
    const tableName = adapter.tableNameMap.get(toSnakeCase(global.slug))

    const pathsToQuery: PathsToQuery = new Set()

    traverseFields({
      adapter,
      columnPrefix: '',
      db,
      disableNotNull: false,
      fields: global.flattenedFields,
      globalSlug: global.slug,
      isVersions: false,
      newTableName: tableName,
      parentTableName: tableName,
      path: '',
      pathsToQuery,
      payload,
      rootTableName: tableName,
    })

    await migrateRelationships({
      adapter,
      db,
      debug,
      fields: global.flattenedFields,
      globalSlug: global.slug,
      isVersions: false,
      pathsToQuery,
      payload,
      req,
      tableName,
    })

    if (global.versions) {
      const versionsTableName = adapter.tableNameMap.get(
        `_${toSnakeCase(global.slug)}${adapter.versionsSuffix}`,
      )

      const versionFields = buildVersionGlobalFields(payload.config, global, true)

      const versionPathsToQuery: PathsToQuery = new Set()

      traverseFields({
        adapter,
        columnPrefix: '',
        db,
        disableNotNull: true,
        fields: versionFields,
        globalSlug: global.slug,
        isVersions: true,
        newTableName: versionsTableName,
        parentTableName: versionsTableName,
        path: '',
        pathsToQuery: versionPathsToQuery,
        payload,
        rootTableName: versionsTableName,
      })

      await migrateRelationships({
        adapter,
        db,
        debug,
        fields: versionFields,
        globalSlug: global.slug,
        isVersions: true,
        pathsToQuery: versionPathsToQuery,
        payload,
        req,
        tableName: versionsTableName,
      })
    }
  }

  // ADD CONSTRAINT
  await runStatementGroup({
    adapter,
    db,
    debug: debug ? 'ADDING CONSTRAINTS' : null,
    statements: sqlUpStatements.addConstraint,
  })

  // NOT NULL
  await runStatementGroup({
    adapter,
    db,
    debug: debug ? 'NOT NULL CONSTRAINTS' : null,
    statements: sqlUpStatements.notNull,
  })

  // DROP TABLE
  await runStatementGroup({
    adapter,
    db,
    debug: debug ? 'DROPPING TABLES' : null,
    statements: sqlUpStatements.dropTable,
  })

  // DROP INDEX
  await runStatementGroup({
    adapter,
    db,
    debug: debug ? 'DROPPING INDEXES' : null,
    statements: sqlUpStatements.dropIndex,
  })

  // DROP CONSTRAINT
  await runStatementGroup({
    adapter,
    db,
    debug: debug ? 'DROPPING CONSTRAINTS' : null,
    statements: sqlUpStatements.dropConstraint,
  })

  // DROP COLUMN
  await runStatementGroup({
    adapter,
    db,
    debug: debug ? 'DROPPING COLUMNS' : null,
    statements: sqlUpStatements.dropColumn,
  })

  // DROP TYPES
  await runStatementGroup({
    adapter,
    db,
    debug: debug ? 'DROPPING TYPES' : null,
    statements: sqlUpStatements.dropType,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: migrateRelationships.ts]---
Location: payload-main/packages/drizzle/src/postgres/predefinedMigrations/v2-v3/migrateRelationships.ts

```typescript
import type { PgSchema } from 'drizzle-orm/pg-core'
import type { FlattenedField, Payload, PayloadRequest } from 'payload'

import { sql } from 'drizzle-orm'

import type { BasePostgresAdapter, PostgresDB } from '../../types.js'
import type { DocsToResave, PathsToQuery } from './types.js'

import { fetchAndResave } from './fetchAndResave/index.js'

type Args = {
  adapter: BasePostgresAdapter
  collectionSlug?: string
  db: PostgresDB
  debug: boolean
  fields: FlattenedField[]
  globalSlug?: string
  isVersions: boolean
  pathsToQuery: PathsToQuery
  payload: Payload
  req?: Partial<PayloadRequest>
  tableName: string
}

export const migrateRelationships = async ({
  adapter,
  collectionSlug,
  db,
  debug,
  fields,
  globalSlug,
  isVersions,
  pathsToQuery,
  payload,
  req,
  tableName,
}: Args) => {
  if (pathsToQuery.size === 0) {
    return
  }

  let offset = 0

  let paginationResult

  const schemaName = (adapter.pgSchema as PgSchema).schemaName ?? 'public'

  const where = Array.from(pathsToQuery).reduce((statement, path, i) => {
    return (statement += `
"${schemaName}"."${tableName}${adapter.relationshipsSuffix}"."path" LIKE '${path}'${pathsToQuery.size !== i + 1 ? ' OR' : ''}
`)
  }, '')

  while (typeof paginationResult === 'undefined' || paginationResult.rows.length > 0) {
    const paginationStatement = `SELECT DISTINCT parent_id FROM "${schemaName}"."${tableName}${adapter.relationshipsSuffix}" WHERE
    ${where} ORDER BY parent_id LIMIT 500 OFFSET ${offset * 500};
  `

    paginationResult = await db.execute(sql.raw(`${paginationStatement}`))

    if (paginationResult.rows.length === 0) {
      return
    }

    offset += 1

    const statement = `SELECT * FROM "${schemaName}"."${tableName}${adapter.relationshipsSuffix}" WHERE
    (${where}) AND parent_id IN (${paginationResult.rows.map((row) => `'${row.parent_id}'`).join(', ')});
`
    if (debug) {
      payload.logger.info('FINDING ROWS TO MIGRATE')
      payload.logger.info(statement)
    }

    const result = await db.execute(sql.raw(`${statement}`))

    const docsToResave: DocsToResave = {}

    result.rows.forEach((row) => {
      const parentID = row.parent_id

      if (typeof parentID === 'string' || typeof parentID === 'number') {
        if (!docsToResave[parentID]) {
          docsToResave[parentID] = []
        }
        docsToResave[parentID].push(row)
      }
    })

    await fetchAndResave({
      adapter,
      collectionSlug,
      db,
      debug,
      docsToResave,
      fields,
      globalSlug,
      isVersions,
      payload,
      req,
      tableName,
    })
  }

  const deleteStatement = `DELETE FROM "${schemaName}"."${tableName}${adapter.relationshipsSuffix}" WHERE ${where}`
  if (debug) {
    payload.logger.info('DELETING ROWS')
    payload.logger.info(deleteStatement)
  }
  await db.execute(sql.raw(`${deleteStatement}`))
}
```

--------------------------------------------------------------------------------

---[FILE: traverseFields.ts]---
Location: payload-main/packages/drizzle/src/postgres/predefinedMigrations/v2-v3/traverseFields.ts

```typescript
import type { FlattenedField, Payload } from 'payload'

import toSnakeCase from 'to-snake-case'

import type { BasePostgresAdapter, PostgresDB } from '../../types.js'
import type { PathsToQuery } from './types.js'

type Args = {
  adapter: BasePostgresAdapter
  collectionSlug?: string
  columnPrefix: string
  db: PostgresDB
  disableNotNull: boolean
  fields: FlattenedField[]
  globalSlug?: string
  isVersions: boolean
  newTableName: string
  parentTableName: string
  path: string
  pathsToQuery: PathsToQuery
  payload: Payload
  rootTableName: string
}

export const traverseFields = (args: Args) => {
  args.fields.forEach((field) => {
    switch (field.type) {
      case 'array': {
        const newTableName = args.adapter.tableNameMap.get(
          `${args.newTableName}_${toSnakeCase(field.name)}`,
        )

        return traverseFields({
          ...args,
          columnPrefix: '',
          fields: field.flattenedFields,
          newTableName,
          parentTableName: newTableName,
          path: `${args.path ? `${args.path}.` : ''}${field.name}.%`,
        })
      }

      case 'blocks': {
        return field.blocks.forEach((block) => {
          // Can ignore string blocks, as those were added in v3 and don't need to be migrated
          if (typeof block === 'string') {
            return
          }

          const newTableName = args.adapter.tableNameMap.get(
            `${args.rootTableName}_blocks_${toSnakeCase(block.slug)}`,
          )

          traverseFields({
            ...args,
            columnPrefix: '',
            fields: block.flattenedFields,
            newTableName,
            parentTableName: newTableName,
            path: `${args.path ? `${args.path}.` : ''}${field.name}.%`,
          })
        })
      }

      case 'group':
      case 'tab': {
        let newTableName = `${args.newTableName}_${toSnakeCase(field.name)}`

        if (field.localized && args.payload.config.localization) {
          newTableName += args.adapter.localesSuffix
        }

        return traverseFields({
          ...args,
          columnPrefix: `${args.columnPrefix}${toSnakeCase(field.name)}_`,
          fields: field.flattenedFields,
          newTableName,
          path: `${args.path ? `${args.path}.` : ''}${field.name}`,
        })
      }

      case 'relationship':
      case 'upload': {
        if (typeof field.relationTo === 'string') {
          if (field.type === 'upload' || !field.hasMany) {
            args.pathsToQuery.add(`${args.path ? `${args.path}.` : ''}${field.name}`)
          }
        }

        return null
      }
    }
  })
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/drizzle/src/postgres/predefinedMigrations/v2-v3/types.ts

```typescript
/**
 * Set of all paths which should be moved
 * This will be built up into one WHERE query
 */
export type PathsToQuery = Set<string>

export type DocsToResave = {
  [id: number | string]: Record<string, unknown>[]
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/drizzle/src/postgres/predefinedMigrations/v2-v3/fetchAndResave/index.ts

```typescript
import type { FlattenedField, Payload, PayloadRequest } from 'payload'

import type { BasePostgresAdapter, PostgresDB } from '../../../types.js'
import type { DocsToResave } from '../types.js'

import { upsertRow } from '../../../../upsertRow/index.js'
import { traverseFields } from './traverseFields.js'

type Args = {
  adapter: BasePostgresAdapter
  collectionSlug?: string
  db: PostgresDB
  debug: boolean
  docsToResave: DocsToResave
  fields: FlattenedField[]
  globalSlug?: string
  isVersions: boolean
  payload: Payload
  req?: Partial<PayloadRequest>
  tableName: string
}

export const fetchAndResave = async ({
  adapter,
  collectionSlug,
  db,
  debug,
  docsToResave,
  fields,
  globalSlug,
  isVersions,
  payload,
  req,
  tableName,
}: Args) => {
  for (const [id, rows] of Object.entries(docsToResave)) {
    if (collectionSlug) {
      const collectionConfig = payload.collections[collectionSlug].config

      if (collectionConfig) {
        if (isVersions) {
          const doc = await payload.findVersionByID({
            id,
            collection: collectionSlug,
            depth: 0,
            fallbackLocale: null,
            locale: 'all',
            req,
            showHiddenFields: true,
          })

          if (debug) {
            payload.logger.info(
              `The collection "${collectionConfig.slug}" version with ID ${id} will be migrated`,
            )
          }

          traverseFields({
            doc,
            fields,
            path: '',
            rows,
          })

          try {
            await upsertRow({
              id: doc.id,
              adapter,
              data: doc,
              db,
              fields,
              ignoreResult: true,
              operation: 'update',
              req,
              tableName,
            })
          } catch (err) {
            payload.logger.error(
              `"${collectionConfig.slug}" version with ID ${doc.id} FAILED TO MIGRATE`,
            )

            throw err
          }

          if (debug) {
            payload.logger.info(
              `"${collectionConfig.slug}" version with ID ${doc.id} migrated successfully!`,
            )
          }
        } else {
          const doc = await payload.findByID({
            id,
            collection: collectionSlug,
            depth: 0,
            fallbackLocale: null,
            locale: 'all',
            req,
            showHiddenFields: true,
          })

          if (debug) {
            payload.logger.info(
              `The collection "${collectionConfig.slug}" with ID ${doc.id} will be migrated`,
            )
          }

          traverseFields({
            doc,
            fields,
            path: '',
            rows,
          })

          try {
            await upsertRow({
              id: doc.id,
              adapter,
              data: doc,
              db,
              fields,
              ignoreResult: true,
              operation: 'update',
              req,
              tableName,
            })
          } catch (err) {
            payload.logger.error(
              `The collection "${collectionConfig.slug}" with ID ${doc.id} has FAILED TO MIGRATE`,
            )

            throw err
          }

          if (debug) {
            payload.logger.info(
              `The collection "${collectionConfig.slug}" with ID ${doc.id} has migrated successfully!`,
            )
          }
        }
      }
    }

    if (globalSlug) {
      const globalConfig = payload.config.globals?.find((global) => global.slug === globalSlug)

      if (globalConfig) {
        if (isVersions) {
          const { docs } = await payload.findGlobalVersions({
            slug: globalSlug,
            depth: 0,
            fallbackLocale: null,
            limit: 0,
            locale: 'all',
            req,
            showHiddenFields: true,
          })

          if (debug) {
            payload.logger.info(`${docs.length} global "${globalSlug}" versions will be migrated`)
          }

          for (const doc of docs) {
            traverseFields({
              doc,
              fields,
              path: '',
              rows,
            })

            try {
              await upsertRow({
                id: doc.id,
                adapter,
                data: doc,
                db,
                fields,
                ignoreResult: true,
                operation: 'update',
                req,
                tableName,
              })
            } catch (err) {
              payload.logger.error(`"${globalSlug}" version with ID ${doc.id} FAILED TO MIGRATE`)

              throw err
            }

            if (debug) {
              payload.logger.info(
                `"${globalSlug}" version with ID ${doc.id} migrated successfully!`,
              )
            }
          }
        } else {
          const doc = await payload.findGlobal({
            slug: globalSlug,
            depth: 0,
            fallbackLocale: null,
            locale: 'all',
            req,
            showHiddenFields: true,
          })

          traverseFields({
            doc,
            fields,
            path: '',
            rows,
          })

          try {
            await upsertRow({
              adapter,
              data: doc,
              db,
              fields,
              ignoreResult: true,
              operation: 'update',
              req,
              tableName,
            })
          } catch (err) {
            payload.logger.error(`The global "${globalSlug}" has FAILED TO MIGRATE`)

            throw err
          }

          if (debug) {
            payload.logger.info(`The global "${globalSlug}" has migrated successfully!`)
          }
        }
      }
    }
  }
}
```

--------------------------------------------------------------------------------

````
