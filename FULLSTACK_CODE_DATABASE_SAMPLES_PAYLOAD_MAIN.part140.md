---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 140
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 140 of 695)

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

---[FILE: parseParams.ts]---
Location: payload-main/packages/drizzle/src/queries/parseParams.ts

```typescript
import type { SQL, Table } from 'drizzle-orm'
import type { FlattenedField, Operator, Sort, Where } from 'payload'

import { and, isNotNull, isNull, ne, notInArray, or, sql } from 'drizzle-orm'
import { PgUUID } from 'drizzle-orm/pg-core'
import { APIError, QueryError } from 'payload'
import { validOperatorSet } from 'payload/shared'

import type { DrizzleAdapter, GenericColumn } from '../types.js'
import type { BuildQueryJoinAliases } from './buildQuery.js'

import { getNameFromDrizzleTable } from '../utilities/getNameFromDrizzleTable.js'
import { isValidStringID } from '../utilities/isValidStringID.js'
import { DistinctSymbol } from '../utilities/rawConstraint.js'
import { buildAndOrConditions } from './buildAndOrConditions.js'
import { getTableColumnFromPath } from './getTableColumnFromPath.js'
import { sanitizeQueryValue } from './sanitizeQueryValue.js'

export type QueryContext = { rawSort?: SQL; sort: Sort }

type Args = {
  adapter: DrizzleAdapter
  aliasTable?: Table
  context: QueryContext
  fields: FlattenedField[]
  joins: BuildQueryJoinAliases
  locale?: string
  parentIsLocalized: boolean
  selectFields: Record<string, GenericColumn>
  selectLocale?: boolean
  tableName: string
  where: Where
}

export function parseParams({
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
}: Args): SQL {
  let result: SQL
  const constraints: SQL[] = []

  if (typeof where === 'object' && Object.keys(where).length > 0) {
    // We need to determine if the whereKey is an AND, OR, or a schema path
    for (const relationOrPath of Object.keys(where)) {
      if (relationOrPath) {
        const condition = where[relationOrPath]
        let conditionOperator: typeof and | typeof or
        if (relationOrPath.toLowerCase() === 'and') {
          conditionOperator = and
        } else if (relationOrPath.toLowerCase() === 'or') {
          conditionOperator = or
        }
        if (Array.isArray(condition)) {
          const builtConditions = buildAndOrConditions({
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
          if (builtConditions.length > 0) {
            result = conditionOperator(...builtConditions)
          }
        } else {
          // It's a path - and there can be multiple comparisons on a single path.
          // For example - title like 'test' and title not equal to 'tester'
          // So we need to loop on keys again here to handle each operator independently
          const pathOperators = where[relationOrPath]
          if (typeof pathOperators === 'object') {
            for (let operator of Object.keys(pathOperators)) {
              if (validOperatorSet.has(operator as Operator)) {
                const val = where[relationOrPath][operator]

                const {
                  columnName,
                  columns,
                  constraints: queryConstraints,
                  field,
                  getNotNullColumnByValue,
                  pathSegments,
                  rawColumn,
                  table,
                } = getTableColumnFromPath({
                  adapter,
                  aliasTable,
                  collectionPath: relationOrPath,
                  fields,
                  joins,
                  locale,
                  parentIsLocalized,
                  pathSegments: relationOrPath.replace(/__/g, '.').split('.'),
                  selectFields,
                  selectLocale,
                  tableName,
                  value: val,
                })

                const resolvedColumn =
                  rawColumn ||
                  (aliasTable && tableName === getNameFromDrizzleTable(table)
                    ? aliasTable[columnName]
                    : table[columnName])

                if (val === DistinctSymbol) {
                  selectFields['_selected'] = resolvedColumn
                  break
                }

                queryConstraints.forEach(({ columnName: col, table: constraintTable, value }) => {
                  if (typeof value === 'string' && value.indexOf('%') > -1) {
                    constraints.push(adapter.operators.like(constraintTable[col], value))
                  } else {
                    constraints.push(adapter.operators.equals(constraintTable[col], value))
                  }
                })

                if (
                  (['json', 'richText'].includes(field.type) ||
                    (field.type === 'blocks' && adapter.blocksAsJSON)) &&
                  Array.isArray(pathSegments) &&
                  pathSegments.length > 1
                ) {
                  if (adapter.name === 'postgres') {
                    const constraint = adapter.createJSONQuery({
                      column: rawColumn || table[columnName],
                      operator,
                      pathSegments,
                      value: val,
                    })

                    constraints.push(sql.raw(constraint))
                    break
                  }

                  const segments = pathSegments.slice(1)
                  segments.unshift(table[columnName].name)

                  if (field.type === 'richText') {
                    // use the table name from the nearest join to handle blocks, arrays, etc. or use the tableName arg
                    const jsonTable =
                      joins.length === 0
                        ? tableName
                        : joins[joins.length - 1].table[
                            Object.getOwnPropertySymbols(joins[joins.length - 1].table)[0]
                          ]
                    const jsonQuery = adapter.createJSONQuery({
                      operator,
                      pathSegments: segments,
                      table: jsonTable,
                      treatAsArray: ['children'],
                      treatRootAsArray: true,
                      value: val,
                    })

                    constraints.push(sql.raw(jsonQuery))
                    break
                  }

                  const jsonQuery = adapter.convertPathToJSONTraversal(pathSegments)
                  const operatorKeys: Record<string, { operator: string; wildcard: string }> = {
                    contains: { operator: 'like', wildcard: '%' },
                    equals: { operator: '=', wildcard: '' },
                    exists: { operator: val === true ? 'is not null' : 'is null', wildcard: '' },
                    in: { operator: 'in', wildcard: '' },
                    like: { operator: 'like', wildcard: '%' },
                    not_equals: { operator: '<>', wildcard: '' },
                    not_in: { operator: 'not in', wildcard: '' },
                    not_like: { operator: 'not like', wildcard: '%' },
                  }

                  let formattedValue = val
                  if (adapter.name === 'sqlite' && operator === 'equals' && !isNaN(val)) {
                    formattedValue = val
                  } else if (['in', 'not_in'].includes(operator) && Array.isArray(val)) {
                    formattedValue = `(${val.map((v) => `${v}`).join(',')})`
                  } else {
                    formattedValue = `'${operatorKeys[operator].wildcard}${val}${operatorKeys[operator].wildcard}'`
                  }
                  if (operator === 'exists') {
                    formattedValue = ''
                  }

                  let jsonQuerySelector = `${table[columnName].name}${jsonQuery}`

                  if (adapter.name === 'sqlite' && operator === 'not_like') {
                    jsonQuerySelector = `COALESCE(${table[columnName].name}${jsonQuery}, '')`
                  }

                  const rawSQLQuery = `${jsonQuerySelector} ${operatorKeys[operator].operator} ${formattedValue}`

                  constraints.push(sql.raw(rawSQLQuery))

                  break
                }

                if (getNotNullColumnByValue) {
                  const columnName = getNotNullColumnByValue(val)
                  if (columnName) {
                    constraints.push(isNotNull(table[columnName]))
                  } else {
                    throw new QueryError([{ path: relationOrPath }])
                  }
                  break
                }

                if (
                  operator === 'like' &&
                  (field.type === 'number' ||
                    field.type === 'relationship' ||
                    field.type === 'upload' ||
                    table[columnName].columnType === 'PgUUID')
                ) {
                  operator = 'equals'
                }

                if (operator === 'like') {
                  constraints.push(
                    and(
                      ...val
                        .split(' ')
                        .map((word) => adapter.operators.like(table[columnName], `%${word}%`)),
                    ),
                  )
                  break
                }

                const sanitizedQueryValue = sanitizeQueryValue({
                  adapter,
                  columns,
                  field,
                  isUUID: table?.[columnName] instanceof PgUUID,
                  operator,
                  relationOrPath,
                  val,
                })

                if (sanitizedQueryValue === null) {
                  break
                }

                const {
                  columns: queryColumns,
                  operator: queryOperator,
                  value: queryValue,
                } = sanitizedQueryValue

                // Handle polymorphic relationships by value
                if (queryColumns) {
                  if (!queryColumns.length) {
                    break
                  }

                  let wrapOperator = or

                  if (queryValue === null && ['equals', 'not_equals'].includes(operator)) {
                    if (operator === 'equals') {
                      wrapOperator = and
                    }

                    constraints.push(
                      wrapOperator(
                        ...queryColumns.map(({ rawColumn }) =>
                          operator === 'equals' ? isNull(rawColumn) : isNotNull(rawColumn),
                        ),
                      ),
                    )
                    break
                  }

                  if (['not_equals', 'not_in'].includes(operator)) {
                    wrapOperator = and
                  }

                  constraints.push(
                    wrapOperator(
                      ...queryColumns.map(({ rawColumn, value }) =>
                        adapter.operators[queryOperator](rawColumn, value),
                      ),
                    ),
                  )

                  break
                }

                if (queryOperator === 'not_equals' && queryValue !== null) {
                  constraints.push(
                    or(
                      isNull(resolvedColumn),
                      /* eslint-disable @typescript-eslint/no-explicit-any */
                      ne<any>(resolvedColumn, queryValue),
                    ),
                  )
                  break
                }

                if (
                  (field.type === 'relationship' || field.type === 'upload') &&
                  Array.isArray(queryValue) &&
                  operator === 'not_in'
                ) {
                  constraints.push(
                    sql`(${notInArray(table[columnName], queryValue)} OR
                    ${table[columnName]}
                    IS
                    NULL)`,
                  )

                  break
                }

                if (operator === 'equals' && queryValue === null) {
                  constraints.push(isNull(resolvedColumn))
                  break
                }

                if (operator === 'not_equals' && queryValue === null) {
                  constraints.push(isNotNull(resolvedColumn))
                  break
                }

                if (field.type === 'point' && adapter.name === 'postgres') {
                  switch (operator) {
                    case 'intersects': {
                      constraints.push(
                        sql`ST_Intersects(${table[columnName]}, ST_GeomFromGeoJSON(${JSON.stringify(queryValue)}))`,
                      )
                      break
                    }

                    case 'near': {
                      const [lng, lat, maxDistance, minDistance] = queryValue as number[]
                      const geoConstraints: SQL[] = []

                      if (typeof maxDistance === 'number' && !Number.isNaN(maxDistance)) {
                        geoConstraints.push(
                          sql`ST_DWithin(ST_Transform(${table[columnName]}, 3857), ST_Transform(ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326), 3857), ${maxDistance})`,
                        )
                      }

                      if (typeof minDistance === 'number' && !Number.isNaN(minDistance)) {
                        geoConstraints.push(
                          sql`ST_Distance(ST_Transform(${table[columnName]}, 3857), ST_Transform(ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326), 3857)) >= ${minDistance}`,
                        )
                      }
                      if (geoConstraints.length) {
                        context.sort = relationOrPath
                        context.rawSort = sql`${table[columnName]} <-> ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)`
                        constraints.push(and(...geoConstraints))
                      }
                      break
                    }

                    case 'within': {
                      constraints.push(
                        sql`ST_Within(${table[columnName]}, ST_GeomFromGeoJSON(${JSON.stringify(queryValue)}))`,
                      )
                      break
                    }

                    default:
                      break
                  }
                  break
                }

                const orConditions: SQL<unknown>[] = []
                let resolvedQueryValue = queryValue
                if (
                  operator === 'in' &&
                  Array.isArray(queryValue) &&
                  queryValue.some((v) => v === null)
                ) {
                  orConditions.push(isNull(resolvedColumn))
                  resolvedQueryValue = queryValue.filter((v) => v !== null)
                }

                let constraint = adapter.operators[queryOperator](
                  resolvedColumn,
                  resolvedQueryValue,
                )

                if (
                  adapter.limitedBoundParameters &&
                  (operator === 'in' || operator === 'not_in') &&
                  relationOrPath === 'id' &&
                  Array.isArray(queryValue)
                ) {
                  let isInvalid = false
                  for (const val of queryValue) {
                    if (typeof val === 'number' || val === null) {
                      continue
                    }
                    if (typeof val === 'string') {
                      if (!isValidStringID(val)) {
                        isInvalid = true
                        break
                      } else {
                        continue
                      }
                    }
                    isInvalid = true
                    break
                  }

                  if (isInvalid) {
                    throw new APIError(`Invalid ID value in ${JSON.stringify(queryValue)}`)
                  }

                  constraints.push(
                    sql.raw(
                      `${resolvedColumn.name} ${operator === 'in' ? 'IN' : 'NOT IN'} (${queryValue
                        .map((e) => {
                          if (e === null) {
                            return `NULL`
                          }

                          if (typeof e === 'number') {
                            return e
                          }

                          return `'${e}'`
                        })
                        .join(',')})`,
                    ),
                  )
                  break
                }

                if (orConditions.length) {
                  orConditions.push(constraint)
                  constraint = or(...orConditions)
                }
                constraints.push(constraint)
              }
            }
          }
        }
      }
    }
  }
  if (constraints.length > 0) {
    if (result) {
      result = and(result, ...constraints)
    } else {
      result = and(...constraints)
    }
  }
  if (constraints.length === 1 && !result) {
    ;[result] = constraints
  }

  return result
}
```

--------------------------------------------------------------------------------

---[FILE: sanitizeQueryValue.ts]---
Location: payload-main/packages/drizzle/src/queries/sanitizeQueryValue.ts

```typescript
import type { SQL } from 'drizzle-orm'

import { APIError, createArrayFromCommaDelineated, type Field, type TabAsField } from 'payload'
import { fieldAffectsData } from 'payload/shared'
import { validate as uuidValidate } from 'uuid'

import type { DrizzleAdapter } from '../types.js'

import { getCollectionIdType } from '../utilities/getCollectionIdType.js'
import { isPolymorphicRelationship } from '../utilities/isPolymorphicRelationship.js'
import { isRawConstraint } from '../utilities/rawConstraint.js'

type SanitizeQueryValueArgs = {
  adapter: DrizzleAdapter
  columns?: {
    idType: 'number' | 'text' | 'uuid'
    rawColumn: SQL<unknown>
  }[]
  field: Field | TabAsField
  isUUID: boolean
  operator: string
  relationOrPath: string
  val: any
}

type SanitizedColumn = {
  rawColumn: SQL<unknown>
  value: unknown
}

export const sanitizeQueryValue = ({
  adapter,
  columns,
  field,
  isUUID,
  operator: operatorArg,
  relationOrPath,
  val,
}: SanitizeQueryValueArgs): {
  columns?: SanitizedColumn[]
  operator: string
  value: unknown
} => {
  let operator = operatorArg
  let formattedValue = val
  let formattedColumns: SanitizedColumn[]

  if (!fieldAffectsData(field)) {
    return { operator, value: formattedValue }
  }

  if (isRawConstraint(val)) {
    return { operator, value: val.value }
  }
  if (
    (field.type === 'relationship' || field.type === 'upload') &&
    !relationOrPath.endsWith('relationTo') &&
    Array.isArray(formattedValue)
  ) {
    const allPossibleIDTypes: (number | string)[] = []
    formattedValue.forEach((val) => {
      if (adapter.idType !== 'uuid' && typeof val === 'string') {
        allPossibleIDTypes.push(val, parseInt(val))
      } else if (typeof val === 'string') {
        allPossibleIDTypes.push(val)
      } else {
        allPossibleIDTypes.push(val, String(val))
      }
    })
    formattedValue = allPossibleIDTypes
  }

  // Cast incoming values as proper searchable types
  if (field.type === 'checkbox' && typeof val === 'string') {
    if (val.toLowerCase() === 'true') {
      formattedValue = true
    }
    if (val.toLowerCase() === 'false') {
      formattedValue = false
    }
  }

  if (['all', 'in', 'not_in'].includes(operator)) {
    if (typeof formattedValue === 'string') {
      formattedValue = createArrayFromCommaDelineated(formattedValue)

      if (field.type === 'number') {
        formattedValue = formattedValue.map((arrayVal) => parseFloat(arrayVal))
      }
    } else if (typeof formattedValue === 'number') {
      formattedValue = [formattedValue]
    }

    if (!Array.isArray(formattedValue)) {
      return null
    }
  }

  if (field.type === 'number' && typeof formattedValue === 'string') {
    formattedValue = Number(val)

    if (Number.isNaN(formattedValue)) {
      formattedValue = null
    }
  }

  if (isUUID && typeof formattedValue === 'string') {
    if (!uuidValidate(val)) {
      formattedValue = null
    }
  }

  // Helper function to convert a single date value to ISO string
  const convertDateToISO = (item: unknown): unknown => {
    if (typeof item === 'string') {
      if (item === 'null' || item === '') {
        return null
      }
      const date = new Date(item)
      return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
    } else if (typeof item === 'number') {
      return new Date(item).toISOString()
    } else if (item instanceof Date) {
      return item.toISOString()
    }
    return item
  }

  if (field.type === 'date' && operator !== 'exists') {
    if (Array.isArray(formattedValue)) {
      // Handle arrays of dates for 'in' and 'not_in' operators
      formattedValue = formattedValue.map(convertDateToISO).filter((item) => item !== undefined)
    } else {
      const converted = convertDateToISO(val)
      if (converted === undefined) {
        return { operator, value: undefined }
      }
      formattedValue = converted
    }
  }

  if (field.type === 'relationship' || field.type === 'upload') {
    if (val === 'null') {
      formattedValue = null
    } else if (!(formattedValue === null || typeof formattedValue === 'boolean')) {
      // convert the value to the idType of the relationship
      let idType: 'number' | 'text'
      if (typeof field.relationTo === 'string') {
        idType = getCollectionIdType({
          adapter,
          collection: adapter.payload.collections[field.relationTo],
        })
      } else {
        if (isPolymorphicRelationship(val)) {
          if (operator !== 'equals') {
            throw new APIError(
              `Only 'equals' operator is supported for polymorphic relationship object notation. Given - ${operator}`,
            )
          }
          idType = getCollectionIdType({
            adapter,
            collection: adapter.payload.collections[val.relationTo],
          })

          if (isRawConstraint(val.value)) {
            return {
              operator,
              value: val.value.value,
            }
          }
          return {
            operator,
            value: idType === 'number' ? Number(val.value) : String(val.value),
          }
        }

        formattedColumns = columns
          .map(({ idType, rawColumn }) => {
            let formattedValue: number | number[] | string | string[]

            if (Array.isArray(val)) {
              formattedValue = val
                .map((eachVal) => {
                  let formattedValue: number | string

                  if (idType === 'number') {
                    formattedValue = Number(eachVal)

                    if (Number.isNaN(formattedValue)) {
                      return null
                    }
                  } else {
                    if (idType === 'uuid' && !uuidValidate(eachVal)) {
                      return null
                    }

                    formattedValue = String(eachVal)
                  }

                  return formattedValue
                })
                .filter(Boolean) as number[] | string[]
            } else if (idType === 'number') {
              formattedValue = Number(val)

              if (Number.isNaN(formattedValue)) {
                return null
              }
            } else {
              formattedValue = String(val)
            }

            return {
              rawColumn,
              value: formattedValue,
            }
          })
          .filter(Boolean)
      }
      if (Array.isArray(formattedValue)) {
        formattedValue = formattedValue.map((value) => {
          if (idType === 'number') {
            return Number(value)
          }
          if (idType === 'text') {
            return String(value)
          }
          return value
        })
      } else {
        if (idType === 'number') {
          formattedValue = Number(val)
        }
        if (idType === 'text') {
          formattedValue = String(val)
        }
      }
    }
  }

  if ('hasMany' in field && field.hasMany && operator === 'contains') {
    operator = 'equals'
  }

  if (operator === 'near' && field.type === 'point' && typeof formattedValue === 'string') {
    const [lng, lat, maxDistance, minDistance] = formattedValue.split(',')

    formattedValue = [Number(lng), Number(lat), Number(maxDistance), Number(minDistance)]
  }

  if (operator === 'contains') {
    formattedValue = `%${formattedValue}%`
  }

  if (operator === 'exists') {
    formattedValue = val === 'true' || val === true

    if (formattedValue) {
      operator = 'exists'
    } else {
      operator = 'isNull'
    }
  }

  return {
    columns: formattedColumns,
    operator,
    value: formattedValue,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: selectDistinct.ts]---
Location: payload-main/packages/drizzle/src/queries/selectDistinct.ts

```typescript
import type { QueryPromise, SQL } from 'drizzle-orm'
import type { SQLiteColumn, SQLiteSelect } from 'drizzle-orm/sqlite-core'

import type {
  DrizzleAdapter,
  DrizzleTransaction,
  GenericColumn,
  GenericPgColumn,
  TransactionPg,
  TransactionSQLite,
} from '../types.js'
import type { BuildQueryJoinAliases } from './buildQuery.js'

type Args = {
  adapter: DrizzleAdapter
  db: DrizzleAdapter['drizzle'] | DrizzleTransaction
  forceRun?: boolean
  joins: BuildQueryJoinAliases
  query?: (args: { query: SQLiteSelect }) => SQLiteSelect
  selectFields: Record<string, GenericColumn>
  tableName: string
  where: SQL
}

/**
 * Selects distinct records from a table only if there are joins that need to be used, otherwise return null
 */
export const selectDistinct = ({
  adapter,
  db,
  forceRun,
  joins,
  query: queryModifier = ({ query }) => query,
  selectFields,
  tableName,
  where,
}: Args): QueryPromise<{ id: number | string }[] & Record<string, GenericColumn>> => {
  if (forceRun || Object.keys(joins).length > 0) {
    let query: SQLiteSelect
    const table = adapter.tables[tableName]

    if (adapter.name === 'postgres') {
      query = (db as TransactionPg)
        .selectDistinct(selectFields as Record<string, GenericPgColumn>)
        .from(table)
        .$dynamic() as unknown as SQLiteSelect
    }
    if (adapter.name === 'sqlite') {
      query = (db as TransactionSQLite)
        .selectDistinct(selectFields as Record<string, SQLiteColumn>)
        .from(table)
        .$dynamic()
    }

    if (where) {
      query = query.where(where)
    }

    joins.forEach(({ type, condition, table }) => {
      query = query[type ?? 'leftJoin'](table, condition)
    })

    return queryModifier({
      query,
    }) as unknown as QueryPromise<{ id: number | string }[] & Record<string, GenericColumn>>
  }
}
```

--------------------------------------------------------------------------------

````
