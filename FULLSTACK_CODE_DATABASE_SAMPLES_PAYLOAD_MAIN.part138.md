---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 138
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 138 of 695)

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

---[FILE: traverseFields.ts]---
Location: payload-main/packages/drizzle/src/postgres/predefinedMigrations/v2-v3/fetchAndResave/traverseFields.ts

```typescript
import type { FlattenedField } from 'payload'

type Args = {
  doc: Record<string, unknown>
  fields: FlattenedField[]
  locale?: string
  path: string
  rows: Record<string, unknown>[]
}

export const traverseFields = ({ doc, fields, locale, path, rows }: Args) => {
  fields.forEach((field) => {
    switch (field.type) {
      case 'array': {
        const rowData = doc?.[field.name]

        if (field.localized && typeof rowData === 'object' && rowData !== null) {
          Object.entries(rowData).forEach(([locale, localeRows]) => {
            if (Array.isArray(localeRows)) {
              localeRows.forEach((row, i) => {
                return traverseFields({
                  doc: row as Record<string, unknown>,
                  fields: field.flattenedFields,
                  locale,
                  path: `${path ? `${path}.` : ''}${field.name}.${i}`,
                  rows,
                })
              })
            }
          })
        }

        if (Array.isArray(rowData)) {
          rowData.forEach((row, i) => {
            return traverseFields({
              doc: row as Record<string, unknown>,
              fields: field.flattenedFields,
              path: `${path ? `${path}.` : ''}${field.name}.${i}`,
              rows,
            })
          })
        }

        break
      }

      case 'blocks': {
        const rowData = doc?.[field.name]

        if (field.localized && typeof rowData === 'object' && rowData !== null) {
          Object.entries(rowData).forEach(([locale, localeRows]) => {
            if (Array.isArray(localeRows)) {
              localeRows.forEach((row, i) => {
                // Can ignore string blocks, as those were added in v3 and don't need to be migrated
                const matchedBlock = field.blocks.find(
                  (block) => typeof block !== 'string' && block.slug === row.blockType,
                )

                if (matchedBlock) {
                  return traverseFields({
                    doc: row as Record<string, unknown>,
                    fields: matchedBlock.flattenedFields,
                    locale,
                    path: `${path ? `${path}.` : ''}${field.name}.${i}`,
                    rows,
                  })
                }
              })
            }
          })
        }

        if (Array.isArray(rowData)) {
          rowData.forEach((row, i) => {
            // Can ignore string blocks, as those were added in v3 and don't need to be migrated
            const matchedBlock = field.blocks.find(
              (block) => typeof block !== 'string' && block.slug === row.blockType,
            )

            if (matchedBlock) {
              return traverseFields({
                doc: row as Record<string, unknown>,
                fields: matchedBlock.flattenedFields,
                path: `${path ? `${path}.` : ''}${field.name}.${i}`,
                rows,
              })
            }
          })
        }

        break
      }

      case 'group':
      case 'tab': {
        const newPath = `${path ? `${path}.` : ''}${field.name}`
        const newDoc = doc?.[field.name]

        if (typeof newDoc === 'object' && newDoc !== null) {
          if (field.localized) {
            Object.entries(newDoc).forEach(([locale, localeDoc]) => {
              return traverseFields({
                doc: localeDoc,
                fields: field.flattenedFields,
                locale,
                path: newPath,
                rows,
              })
            })
          } else {
            return traverseFields({
              doc: newDoc as Record<string, unknown>,
              fields: field.flattenedFields,
              path: newPath,
              rows,
            })
          }
        }

        break
      }

      case 'relationship':
      // falls through
      case 'upload': {
        if (typeof field.relationTo === 'string') {
          if (field.type === 'upload' || !field.hasMany) {
            const relationshipPath = `${path ? `${path}.` : ''}${field.name}`

            if (field.localized) {
              const matchedRelationshipsWithLocales = rows.filter(
                (row) => row.path === relationshipPath,
              )

              if (matchedRelationshipsWithLocales.length && !doc[field.name]) {
                doc[field.name] = {}
              }

              const newDoc = doc[field.name] as Record<string, unknown>

              matchedRelationshipsWithLocales.forEach((localeRow) => {
                if (typeof localeRow.locale === 'string') {
                  const [, id] = Object.entries(localeRow).find(
                    ([key, val]) =>
                      val !== null && !['id', 'locale', 'order', 'parent_id', 'path'].includes(key),
                  )

                  newDoc[localeRow.locale] = id
                }
              })
            } else {
              const matchedRelationship = rows.find((row) => {
                const matchesPath = row.path === relationshipPath

                if (locale) {
                  return matchesPath && locale === row.locale
                }

                return row.path === relationshipPath
              })

              if (matchedRelationship) {
                const [, id] = Object.entries(matchedRelationship).find(
                  ([key, val]) =>
                    val !== null && !['id', 'locale', 'order', 'parent_id', 'path'].includes(key),
                )

                doc[field.name] = id
              }
            }
          }
        }
        break
      }
    }
  })
}
```

--------------------------------------------------------------------------------

---[FILE: buildDrizzleTable.ts]---
Location: payload-main/packages/drizzle/src/postgres/schema/buildDrizzleTable.ts

```typescript
import type { ForeignKeyBuilder, IndexBuilder } from 'drizzle-orm/pg-core'

import {
  bit,
  boolean,
  foreignKey,
  halfvec,
  index,
  integer,
  jsonb,
  numeric,
  serial,
  sparsevec,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
  vector,
} from 'drizzle-orm/pg-core'

import type { RawColumn, RawTable } from '../../types.js'
import type { BasePostgresAdapter } from '../types.js'

import { geometryColumn } from './geometryColumn.js'

const rawColumnBuilderMap: Partial<Record<RawColumn['type'], any>> = {
  boolean,
  geometry: geometryColumn,
  integer,
  jsonb,
  numeric,
  serial,
  text,
  uuid,
  varchar,
}

export const buildDrizzleTable = ({
  adapter,
  rawTable,
}: {
  adapter: BasePostgresAdapter
  rawTable: RawTable
}) => {
  const columns: Record<string, any> = {}

  for (const [key, column] of Object.entries(rawTable.columns)) {
    switch (column.type) {
      case 'bit': {
        const builder = bit(column.name, { dimensions: column.dimensions })

        columns[key] = builder

        break
      }

      case 'enum':
        if ('locale' in column) {
          columns[key] = adapter.enums.enum__locales(column.name)
        } else {
          adapter.enums[column.enumName] = adapter.pgSchema.enum(
            column.enumName,
            column.options as [string, ...string[]],
          )
          columns[key] = adapter.enums[column.enumName](column.name)
        }
        break

      case 'halfvec': {
        const builder = halfvec(column.name, { dimensions: column.dimensions })

        columns[key] = builder
        break
      }

      case 'numeric': {
        columns[key] = numeric(column.name, { mode: 'number' })
        break
      }

      case 'sparsevec': {
        const builder = sparsevec(column.name, { dimensions: column.dimensions })

        columns[key] = builder

        break
      }

      case 'timestamp': {
        let builder = timestamp(column.name, {
          mode: column.mode,
          precision: column.precision,
          withTimezone: column.withTimezone,
        })

        if (column.defaultNow) {
          builder = builder.defaultNow()
        }

        columns[key] = builder
        break
      }

      case 'uuid': {
        let builder = uuid(column.name)

        if (column.defaultRandom) {
          builder = builder.defaultRandom()
        }

        columns[key] = builder
        break
      }

      case 'vector': {
        const builder = vector(column.name, { dimensions: column.dimensions })
        columns[key] = builder

        break
      }

      default:
        columns[key] = rawColumnBuilderMap[column.type](column.name)
        break
    }

    if (column.reference) {
      columns[key].references(() => adapter.tables[column.reference.table][column.reference.name], {
        onDelete: column.reference.onDelete,
      })
    }

    if (column.primaryKey) {
      columns[key].primaryKey()
    }

    if (column.notNull) {
      columns[key].notNull()
    }

    if (typeof column.default !== 'undefined') {
      let sanitizedDefault = column.default

      if (column.type === 'geometry' && Array.isArray(column.default)) {
        sanitizedDefault = `SRID=4326;POINT(${column.default[0]} ${column.default[1]})`
      }

      columns[key].default(sanitizedDefault)
    }

    if (column.type === 'geometry') {
      if (!adapter.extensions.postgis) {
        adapter.extensions.postgis = true
      }
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

  adapter.tables[rawTable.name] = adapter.pgSchema.table(
    rawTable.name,
    columns as any,
    extraConfig as any,
  )
}
```

--------------------------------------------------------------------------------

---[FILE: geometryColumn.ts]---
Location: payload-main/packages/drizzle/src/postgres/schema/geometryColumn.ts

```typescript
// Uses custom one instead of geometry() from drizzle-orm/pg-core because it's broken on pushDevSchema
// Why?
// It tries to give us a prompt "you're about to change.. from geometry(Point) to geometry(point)"
import { customType } from 'drizzle-orm/pg-core'
import { parseEWKB } from 'drizzle-orm/pg-core/columns/postgis_extension/utils'

type Point = [number, number]

export const geometryColumn = (name: string) =>
  customType<{ data: Point; driverData: string }>({
    dataType() {
      return `geometry(Point)`
    },
    fromDriver(value: string) {
      return parseEWKB(value)
    },
    toDriver(value: Point) {
      return `SRID=4326;point(${value[0]} ${value[1]})`
    },
  })(name)
```

--------------------------------------------------------------------------------

---[FILE: setColumnID.ts]---
Location: payload-main/packages/drizzle/src/postgres/schema/setColumnID.ts

```typescript
import type { SetColumnID } from '../../types.js'

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
        type: 'varchar',
        primaryKey: true,
      }
      return 'varchar'
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
    type: 'serial',
    primaryKey: true,
  }

  return 'integer'
}
```

--------------------------------------------------------------------------------

---[FILE: addJoinTable.ts]---
Location: payload-main/packages/drizzle/src/queries/addJoinTable.ts

```typescript
import { type SQL } from 'drizzle-orm'
import { type PgTableWithColumns } from 'drizzle-orm/pg-core'

import type { GenericTable } from '../types.js'
import type { BuildQueryJoinAliases } from './buildQuery.js'

import { getNameFromDrizzleTable } from '../utilities/getNameFromDrizzleTable.js'

export const addJoinTable = ({
  type,
  condition,
  joins,
  queryPath,
  table,
}: {
  condition: SQL
  joins: BuildQueryJoinAliases
  queryPath?: string
  table: GenericTable | PgTableWithColumns<any>
  type?: 'innerJoin' | 'leftJoin' | 'rightJoin'
}) => {
  const name = getNameFromDrizzleTable(table)

  if (!joins.some((eachJoin) => getNameFromDrizzleTable(eachJoin.table) === name)) {
    joins.push({ type, condition, queryPath, table })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: buildAndOrConditions.ts]---
Location: payload-main/packages/drizzle/src/queries/buildAndOrConditions.ts

```typescript
import type { SQL, Table } from 'drizzle-orm'
import type { FlattenedField, Where } from 'payload'

import type { DrizzleAdapter, GenericColumn } from '../types.js'
import type { BuildQueryJoinAliases } from './buildQuery.js'
import type { QueryContext } from './parseParams.js'

import { parseParams } from './parseParams.js'

export function buildAndOrConditions({
  adapter,
  aliasTable,
  context,
  fields,
  joins,
  locale,
  parentIsLocalized,
  selectFields,
  selectLocale,
  tableName,
  where,
}: {
  adapter: DrizzleAdapter
  aliasTable?: Table
  collectionSlug?: string
  context: QueryContext
  fields: FlattenedField[]
  globalSlug?: string
  joins: BuildQueryJoinAliases
  locale?: string
  parentIsLocalized: boolean
  selectFields: Record<string, GenericColumn>
  selectLocale?: boolean
  tableName: string
  where: Where[]
}): SQL[] {
  const completedConditions = []
  // Loop over all AND / OR operations and add them to the AND / OR query param
  // Operations should come through as an array

  for (const condition of where) {
    // If the operation is properly formatted as an object
    if (typeof condition === 'object') {
      const result = parseParams({
        adapter,
        aliasTable,
        context,
        fields,
        joins,
        locale,
        parentIsLocalized,
        selectFields,
        selectLocale,
        tableName,
        where: condition,
      })
      if (result && Object.keys(result).length > 0) {
        completedConditions.push(result)
      }
    }
  }
  return completedConditions
}
```

--------------------------------------------------------------------------------

---[FILE: buildOrderBy.ts]---
Location: payload-main/packages/drizzle/src/queries/buildOrderBy.ts

```typescript
import type { SQL, Table } from 'drizzle-orm'
import type { FlattenedField, Sort } from 'payload'

import { asc, desc } from 'drizzle-orm'

import type { DrizzleAdapter, GenericColumn } from '../types.js'
import type { BuildQueryJoinAliases, BuildQueryResult } from './buildQuery.js'

import { getNameFromDrizzleTable } from '../utilities/getNameFromDrizzleTable.js'
import { getTableColumnFromPath } from './getTableColumnFromPath.js'

type Args = {
  adapter: DrizzleAdapter
  aliasTable?: Table
  fields: FlattenedField[]
  joins: BuildQueryJoinAliases
  locale?: string
  parentIsLocalized: boolean
  rawSort?: SQL
  selectFields: Record<string, GenericColumn>
  sort?: Sort
  tableName: string
}

/**
 * Gets the order by column and direction constructed from the sort argument adds the column to the select fields and joins if necessary
 */
export const buildOrderBy = ({
  adapter,
  aliasTable,
  fields,
  joins,
  locale,
  parentIsLocalized,
  rawSort,
  selectFields,
  sort,
  tableName,
}: Args): BuildQueryResult['orderBy'] => {
  const orderBy: BuildQueryResult['orderBy'] = []

  const createdAt = adapter.tables[tableName]?.createdAt

  if (!sort) {
    if (createdAt) {
      sort = '-createdAt'
    } else {
      sort = '-id'
    }
  }

  if (typeof sort === 'string') {
    sort = [sort]
  }

  // In the case of Mongo, when sorting by a field that is not unique, the results are not guaranteed to be in the same order each time.
  // So we add a fallback sort to ensure that the results are always in the same order.
  let fallbackSort = '-id'

  if (createdAt) {
    fallbackSort = '-createdAt'
  }

  if (!(sort.includes(fallbackSort) || sort.includes(fallbackSort.replace('-', '')))) {
    sort.push(fallbackSort)
  }

  for (const sortItem of sort) {
    let sortProperty: string
    let sortDirection: 'asc' | 'desc'
    if (sortItem[0] === '-') {
      sortProperty = sortItem.substring(1)
      sortDirection = 'desc'
    } else {
      sortProperty = sortItem
      sortDirection = 'asc'
    }
    try {
      const { columnName: sortTableColumnName, table: sortTable } = getTableColumnFromPath({
        adapter,
        collectionPath: sortProperty,
        fields,
        joins,
        locale,
        parentIsLocalized,
        pathSegments: sortProperty.replace(/__/g, '.').split('.'),
        selectFields,
        tableName,
        value: sortProperty,
      })
      if (sortTable?.[sortTableColumnName]) {
        let order = sortDirection === 'asc' ? asc : desc

        if (rawSort) {
          order = () => rawSort
        }

        orderBy.push({
          column:
            aliasTable && tableName === getNameFromDrizzleTable(sortTable)
              ? aliasTable[sortTableColumnName]
              : sortTable[sortTableColumnName],
          order,
        })

        selectFields[sortTableColumnName] = sortTable[sortTableColumnName]
      }
    } catch (_) {
      // continue
    }
  }

  return orderBy
}
```

--------------------------------------------------------------------------------

---[FILE: buildQuery.ts]---
Location: payload-main/packages/drizzle/src/queries/buildQuery.ts

```typescript
import type { asc, desc, SQL, Table } from 'drizzle-orm'
import type { PgTableWithColumns } from 'drizzle-orm/pg-core'
import type { FlattenedField, Sort, Where } from 'payload'

import type { DrizzleAdapter, GenericColumn, GenericTable } from '../types.js'
import type { QueryContext } from './parseParams.js'

import { buildOrderBy } from './buildOrderBy.js'
import { parseParams } from './parseParams.js'

export type BuildQueryJoinAliases = {
  condition: SQL
  queryPath?: string
  table: GenericTable | PgTableWithColumns<any>
  type?: 'innerJoin' | 'leftJoin' | 'rightJoin'
}[]

type BuildQueryArgs = {
  adapter: DrizzleAdapter
  aliasTable?: Table
  fields: FlattenedField[]
  joins?: BuildQueryJoinAliases
  locale?: string
  parentIsLocalized?: boolean
  selectLocale?: boolean
  sort?: Sort
  tableName: string
  where: Where
}

export type BuildQueryResult = {
  joins: BuildQueryJoinAliases
  orderBy: {
    column: GenericColumn
    order: typeof asc | typeof desc
  }[]
  selectFields: Record<string, GenericColumn>
  where: SQL
}

export const buildQuery = function buildQuery({
  adapter,
  aliasTable,
  fields,
  joins = [],
  locale,
  parentIsLocalized,
  selectLocale,
  sort,
  tableName,
  where: incomingWhere,
}: BuildQueryArgs): BuildQueryResult {
  const selectFields: Record<string, GenericColumn> = {
    id: adapter.tables[tableName].id,
  }

  let where: SQL

  const context: QueryContext = { sort }
  if (incomingWhere && Object.keys(incomingWhere).length > 0) {
    where = parseParams({
      adapter,
      aliasTable,
      context,
      fields,
      joins,
      locale,
      parentIsLocalized,
      selectFields,
      selectLocale,
      tableName,
      where: incomingWhere,
    })
  }

  const orderBy = buildOrderBy({
    adapter,
    aliasTable,
    fields,
    joins,
    locale,
    parentIsLocalized,
    rawSort: context.rawSort,
    selectFields,
    sort: context.sort,
    tableName,
  })

  return {
    joins,
    orderBy,
    selectFields,
    where,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: getTableAlias.ts]---
Location: payload-main/packages/drizzle/src/queries/getTableAlias.ts

```typescript
import type { PgTableWithColumns } from 'drizzle-orm/pg-core'
import type { SQLiteTableWithColumns } from 'drizzle-orm/sqlite-core'

import { alias } from 'drizzle-orm/pg-core'
import { alias as aliasSQLite } from 'drizzle-orm/sqlite-core/alias'
import toSnakeCase from 'to-snake-case'
import { v4 as uuid } from 'uuid'

import type { DrizzleAdapter } from '../types.js'

type Table = PgTableWithColumns<any> | SQLiteTableWithColumns<any>
export const getTableAlias = ({
  adapter,
  tableName,
}: {
  adapter: DrizzleAdapter
  tableName: string
}): {
  newAliasTable: Table
  newAliasTableName: string
} => {
  const newAliasTableName = toSnakeCase(uuid())
  let newAliasTable

  if (adapter.name === 'postgres') {
    newAliasTable = alias(adapter.tables[tableName], newAliasTableName)
  }
  if (adapter.name === 'sqlite') {
    newAliasTable = aliasSQLite(adapter.tables[tableName], newAliasTableName)
  }

  return { newAliasTable, newAliasTableName }
}
```

--------------------------------------------------------------------------------

````
