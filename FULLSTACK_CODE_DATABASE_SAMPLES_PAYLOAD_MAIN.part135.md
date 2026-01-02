---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 135
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 135 of 695)

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
Location: payload-main/packages/drizzle/src/exports/types-deprecated.ts

```typescript
import type {
  BaseRawColumn as _BaseRawColumn,
  BuildDrizzleTable as _BuildDrizzleTable,
  BuildQueryJoinAliases as _BuildQueryJoinAliases,
  ChainedMethods as _ChainedMethods,
  ColumnToCodeConverter as _ColumnToCodeConverter,
  CountDistinct as _CountDistinct,
  CreateJSONQueryArgs as _CreateJSONQueryArgs,
  DeleteWhere as _DeleteWhere,
  DrizzleAdapter as _DrizzleAdapter,
  DrizzleTransaction as _DrizzleTransaction,
  DropDatabase as _DropDatabase,
  EnumRawColumn as _EnumRawColumn,
  Execute as _Execute,
  GenericColumn as _GenericColumn,
  GenericColumns as _GenericColumns,
  GenericPgColumn as _GenericPgColumn,
  GenericRelation as _GenericRelation,
  GenericTable as _GenericTable,
  IDType as _IDType,
  Insert as _Insert,
  IntegerRawColumn as _IntegerRawColumn,
  Migration as _Migration,
  PostgresDB as _PostgresDB,
  RawColumn as _RawColumn,
  RawForeignKey as _RawForeignKey,
  RawIndex as _RawIndex,
  RawRelation as _RawRelation,
  RawTable as _RawTable,
  RelationMap as _RelationMap,
  RequireDrizzleKit as _RequireDrizzleKit,
  SetColumnID as _SetColumnID,
  SQLiteDB as _SQLiteDB,
  TimestampRawColumn as _TimestampRawColumn,
  TransactionPg as _TransactionPg,
  TransactionSQLite as _TransactionSQLite,
  UUIDRawColumn as _UUIDRawColumn,
  VectorRawColumn as _VectorRawColumn,
} from '../types.js'

/**
 * @deprecated - import from `@payloadcms/drizzle` instead
 */
export type BaseRawColumn = _BaseRawColumn
/**
 * @deprecated - import from `@payloadcms/drizzle` instead
 */
export type BuildDrizzleTable = _BuildDrizzleTable
/**
 * @deprecated - import from `@payloadcms/drizzle` instead
 */
export type BuildQueryJoinAliases = _BuildQueryJoinAliases
/**
 * @deprecated - import from `@payloadcms/drizzle` instead
 */
export type ChainedMethods = _ChainedMethods
/**
 * @deprecated - import from `@payloadcms/drizzle` instead
 */
export type ColumnToCodeConverter = _ColumnToCodeConverter
/**
 * @deprecated - import from `@payloadcms/drizzle` instead
 */
export type CountDistinct = _CountDistinct
/**
 * @deprecated - import from `@payloadcms/drizzle` instead
 */
export type CreateJSONQueryArgs = _CreateJSONQueryArgs
/**
 * @deprecated - import from `@payloadcms/drizzle` instead
 */
export type DeleteWhere = _DeleteWhere
/**
 * @deprecated - import from `@payloadcms/drizzle` instead
 */
export type DrizzleAdapter = _DrizzleAdapter
/**
 * @deprecated - import from `@payloadcms/drizzle` instead
 */
export type DrizzleTransaction = _DrizzleTransaction
/**
 * @deprecated - import from `@payloadcms/drizzle` instead
 */
export type DropDatabase = _DropDatabase
/**
 * @deprecated - import from `@payloadcms/drizzle` instead
 */
export type EnumRawColumn = _EnumRawColumn
/**
 * @deprecated - import from `@payloadcms/drizzle` instead
 */
export type Execute<T> = _Execute<T>
/**
 * @deprecated - import from `@payloadcms/drizzle` instead
 */
export type GenericColumn = _GenericColumn
/**
 * @deprecated - import from `@payloadcms/drizzle` instead
 */
export type GenericColumns<T> = _GenericColumns<T>
/**
 * @deprecated - import from `@payloadcms/drizzle` instead
 */
export type GenericPgColumn = _GenericPgColumn
/**
 * @deprecated - import from `@payloadcms/drizzle` instead
 */
export type GenericRelation = _GenericRelation
/**
 * @deprecated - import from `@payloadcms/drizzle` instead
 */
export type GenericTable = _GenericTable
/**
 * @deprecated - import from `@payloadcms/drizzle` instead
 */
export type IDType = _IDType
/**
 * @deprecated - import from `@payloadcms/drizzle` instead
 */
export type Insert = _Insert
/**
 * @deprecated - import from `@payloadcms/drizzle` instead
 */
export type IntegerRawColumn = _IntegerRawColumn
/**
 * @deprecated - import from `@payloadcms/drizzle` instead
 */
export type Migration = _Migration
/**
 * @deprecated - import from `@payloadcms/drizzle` instead
 */
export type PostgresDB = _PostgresDB
/**
 * @deprecated - import from `@payloadcms/drizzle` instead
 */
export type RawColumn = _RawColumn
/**
 * @deprecated - import from `@payloadcms/drizzle` instead
 */
export type RawForeignKey = _RawForeignKey
/**
 * @deprecated - import from `@payloadcms/drizzle` instead
 */
export type RawIndex = _RawIndex
/**
 * @deprecated - import from `@payloadcms/drizzle` instead
 */
export type RawRelation = _RawRelation
/**
 * @deprecated - import from `@payloadcms/drizzle` instead
 */
export type RawTable = _RawTable
/**
 * @deprecated - import from `@payloadcms/drizzle` instead
 */
export type RelationMap = _RelationMap
/**
 * @deprecated - import from `@payloadcms/drizzle` instead
 */
export type RequireDrizzleKit = _RequireDrizzleKit
/**
 * @deprecated - import from `@payloadcms/drizzle` instead
 */
export type SetColumnID = _SetColumnID
/**
 * @deprecated - import from `@payloadcms/drizzle` instead
 */
export type SQLiteDB = _SQLiteDB
/**
 * @deprecated - import from `@payloadcms/drizzle` instead
 */
export type TimestampRawColumn = _TimestampRawColumn
/**
 * @deprecated - import from `@payloadcms/drizzle` instead
 */
export type TransactionPg = _TransactionPg
/**
 * @deprecated - import from `@payloadcms/drizzle` instead
 */
export type TransactionSQLite = _TransactionSQLite
/**
 * @deprecated - import from `@payloadcms/drizzle` instead
 */
export type UUIDRawColumn = _UUIDRawColumn
/**
 * @deprecated - import from `@payloadcms/drizzle` instead
 */
export type VectorRawColumn = _VectorRawColumn
```

--------------------------------------------------------------------------------

---[FILE: buildFindManyArgs.ts]---
Location: payload-main/packages/drizzle/src/find/buildFindManyArgs.ts

```typescript
import type { DBQueryConfig } from 'drizzle-orm'
import type { FlattenedField, JoinQuery, SelectType } from 'payload'

import { getSelectMode } from 'payload/shared'

import type { BuildQueryJoinAliases, DrizzleAdapter } from '../types.js'

import { traverseFields } from './traverseFields.js'

type BuildFindQueryArgs = {
  adapter: DrizzleAdapter
  collectionSlug?: string
  depth: number
  draftsEnabled?: boolean
  fields: FlattenedField[]
  joinQuery?: JoinQuery
  /**
   * The joins array will be mutated by pushing any joins needed for the where queries of join field joins
   */
  joins?: BuildQueryJoinAliases
  locale?: string
  select?: SelectType
  tableName: string
  versions?: boolean
}

export type Result = {
  with?: {
    _locales?: DBQueryConfig<'many', true, any, any>
  } & DBQueryConfig<'many', true, any, any>
} & DBQueryConfig<'many', true, any, any>

// Generate the Drizzle query for findMany based on
// a collection field structure
export const buildFindManyArgs = ({
  adapter,
  collectionSlug,
  depth,
  draftsEnabled,
  fields,
  joinQuery,
  joins = [],
  locale,
  select,
  tableName,
  versions,
}: BuildFindQueryArgs): Result => {
  const result: Result = {
    extras: {},
    with: {},
  }

  if (select) {
    result.columns = {
      id: true,
    }
  }

  const _locales: Result = {
    columns: select
      ? { _locale: true }
      : {
          id: false,
          _parentID: false,
        },
    extras: {},
    with: {},
  }

  const withTabledFields = select
    ? {}
    : {
        numbers: true,
        rels: true,
        texts: true,
      }

  traverseFields({
    _locales,
    adapter,
    collectionSlug,
    currentArgs: result,
    currentTableName: tableName,
    depth,
    draftsEnabled,
    fields,
    joinQuery,
    joins,
    locale,
    path: '',
    select,
    selectMode: select ? getSelectMode(select) : undefined,
    tablePath: '',
    topLevelArgs: result,
    topLevelTableName: tableName,
    versions,
    withTabledFields,
  })

  if (adapter.tables[`${tableName}_texts`] && withTabledFields.texts) {
    result.with._texts = {
      columns: {
        id: false,
        parent: false,
      },
      orderBy: ({ order }, { asc: ASC }) => [ASC(order)],
    }
  }

  if (adapter.tables[`${tableName}_numbers`] && withTabledFields.numbers) {
    result.with._numbers = {
      columns: {
        id: false,
        parent: false,
      },
      orderBy: ({ order }, { asc: ASC }) => [ASC(order)],
    }
  }

  if (adapter.tables[`${tableName}${adapter.relationshipsSuffix}`] && withTabledFields.rels) {
    result.with._rels = {
      columns: {
        id: false,
        parent: false,
      },
      orderBy: ({ order }, { asc: ASC }) => [ASC(order)],
    }
  }

  if (
    adapter.tables[`${tableName}${adapter.localesSuffix}`] &&
    (!select || Object.keys(_locales.columns).length > 1)
  ) {
    result.with._locales = _locales
  }

  // Delete properties that are empty
  for (const key of Object.keys(result)) {
    if (!Object.keys(result[key]).length) {
      delete result[key]
    }
  }

  return result
}
```

--------------------------------------------------------------------------------

---[FILE: chainMethods.ts]---
Location: payload-main/packages/drizzle/src/find/chainMethods.ts

```typescript
/**
 * @deprecated - will be removed in 4.0. Use query + $dynamic() instead: https://orm.drizzle.team/docs/dynamic-query-building
 */
export type ChainedMethods = {
  args: unknown[]
  method: string
}[]

/**
 * Call and returning methods that would normally be chained together but cannot be because of control logic
 * @param methods
 * @param query
 *
 * @deprecated - will be removed in 4.0. Use query + $dynamic() instead: https://orm.drizzle.team/docs/dynamic-query-building
 */
const chainMethods = <T>({ methods, query }: { methods: ChainedMethods; query: T }): T => {
  return methods.reduce((query, { args, method }) => {
    return query[method](...args)
  }, query)
}

export { chainMethods }
```

--------------------------------------------------------------------------------

---[FILE: findMany.ts]---
Location: payload-main/packages/drizzle/src/find/findMany.ts

```typescript
import type { FindArgs, FlattenedField, TypeWithID } from 'payload'

import { inArray } from 'drizzle-orm'

import type { DrizzleAdapter } from '../types.js'

import { buildQuery } from '../queries/buildQuery.js'
import { selectDistinct } from '../queries/selectDistinct.js'
import { transform } from '../transform/read/index.js'
import { getNameFromDrizzleTable } from '../utilities/getNameFromDrizzleTable.js'
import { getTransaction } from '../utilities/getTransaction.js'
import { buildFindManyArgs } from './buildFindManyArgs.js'

type Args = {
  adapter: DrizzleAdapter
  collectionSlug?: string
  fields: FlattenedField[]
  tableName: string
  versions?: boolean
} & Omit<FindArgs, 'collection'>

export const findMany = async function find({
  adapter,
  collectionSlug,
  draftsEnabled,
  fields,
  joins: joinQuery,
  limit: limitArg,
  locale,
  page = 1,
  pagination,
  req,
  select,
  skip,
  sort,
  tableName,
  versions,
  where: whereArg,
}: Args) {
  let limit = limitArg
  let totalDocs: number
  let totalPages: number
  let hasPrevPage: boolean
  let hasNextPage: boolean
  let pagingCounter: number
  const offset = skip || (page - 1) * limit

  if (limit === 0) {
    pagination = false
    limit = undefined
  }

  const { joins, orderBy, selectFields, where } = buildQuery({
    adapter,
    fields,
    locale,
    sort,
    tableName,
    where: whereArg,
  })

  const orderedIDMap: Record<number | string, number> = {}
  let orderedIDs: (number | string)[]

  const findManyArgs = buildFindManyArgs({
    adapter,
    collectionSlug,
    depth: 0,
    draftsEnabled,
    fields,
    joinQuery,
    joins,
    locale,
    select,
    tableName,
    versions,
  })

  if (orderBy) {
    for (const key in selectFields) {
      const column = selectFields[key]
      if (!column || column.primary) {
        continue
      }

      if (
        !orderBy.some(
          (col) =>
            col.column.name === column.name &&
            getNameFromDrizzleTable(col.column.table) === getNameFromDrizzleTable(column.table),
        )
      ) {
        delete selectFields[key]
      }
    }
  }

  const db = await getTransaction(adapter, req)

  const selectDistinctResult = await selectDistinct({
    adapter,
    db,
    joins,
    query: ({ query }) => {
      if (orderBy) {
        query = query.orderBy(() => orderBy.map(({ column, order }) => order(column)))
      }
      return query.offset(offset).limit(limit)
    },
    selectFields,
    tableName,
    where,
  })

  if (selectDistinctResult) {
    if (selectDistinctResult.length === 0) {
      return {
        docs: [],
        hasNextPage: false,
        hasPrevPage: false,
        limit,
        nextPage: null,
        page: 1,
        pagingCounter: 0,
        prevPage: null,
        totalDocs: 0,
        totalPages: 0,
      }
    } else {
      // set the id in an object for sorting later
      selectDistinctResult.forEach(({ id }, i) => {
        orderedIDMap[id] = i
      })
      orderedIDs = Object.keys(orderedIDMap)
      findManyArgs.where = inArray(adapter.tables[tableName].id, orderedIDs)
    }
  } else {
    findManyArgs.limit = limit
    findManyArgs.offset = offset
    findManyArgs.orderBy = () => orderBy.map(({ column, order }) => order(column))

    if (where) {
      findManyArgs.where = where
    }
  }

  const findPromise = db.query[tableName].findMany(findManyArgs)

  if (pagination !== false && (orderedIDs ? orderedIDs?.length <= limit : true)) {
    totalDocs = await adapter.countDistinct({
      db,
      joins,
      tableName,
      where,
    })

    totalPages = typeof limit === 'number' && limit !== 0 ? Math.ceil(totalDocs / limit) : 1
    hasPrevPage = page > 1
    hasNextPage = totalPages > page
    pagingCounter = (page - 1) * limit + 1
  }

  const rawDocs = await findPromise
  // sort rawDocs from selectQuery
  if (Object.keys(orderedIDMap).length > 0) {
    rawDocs.sort((a, b) => orderedIDMap[a.id] - orderedIDMap[b.id])
  }

  if (pagination === false || !totalDocs) {
    totalDocs = rawDocs.length
    totalPages = 1
    pagingCounter = 1
    hasPrevPage = false
    hasNextPage = false
  }

  const docs = rawDocs.map((data: TypeWithID) => {
    return transform({
      adapter,
      config: adapter.payload.config,
      data,
      fields,
      joinQuery,
      tableName,
    })
  })

  return {
    docs,
    hasNextPage,
    hasPrevPage,
    limit: limitArg,
    nextPage: hasNextPage ? page + 1 : null,
    page,
    pagingCounter,
    prevPage: hasPrevPage ? page - 1 : null,
    totalDocs,
    totalPages,
  }
}
```

--------------------------------------------------------------------------------

````
