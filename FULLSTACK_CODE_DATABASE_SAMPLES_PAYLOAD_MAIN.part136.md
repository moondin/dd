---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 136
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 136 of 695)

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
Location: payload-main/packages/drizzle/src/find/traverseFields.ts

```typescript
import type { LibSQLDatabase } from 'drizzle-orm/libsql'
import type { SQLiteSelect, SQLiteSelectBase } from 'drizzle-orm/sqlite-core'

import { and, asc, count, desc, eq, getTableName, or, sql } from 'drizzle-orm'
import {
  appendVersionToQueryKey,
  buildVersionCollectionFields,
  combineQueries,
  type FlattenedField,
  getFieldByPath,
  getQueryDraftsSort,
  type JoinQuery,
  type SelectMode,
  type SelectType,
  type Where,
} from 'payload'
import { fieldIsVirtual, fieldShouldBeLocalized, hasDraftsEnabled } from 'payload/shared'
import toSnakeCase from 'to-snake-case'

import type { BuildQueryJoinAliases, DrizzleAdapter } from '../types.js'
import type { Result } from './buildFindManyArgs.js'

import { buildQuery } from '../queries/buildQuery.js'
import { getTableAlias } from '../queries/getTableAlias.js'
import { operatorMap } from '../queries/operatorMap.js'
import { getArrayRelationName } from '../utilities/getArrayRelationName.js'
import { getNameFromDrizzleTable } from '../utilities/getNameFromDrizzleTable.js'
import { jsonAggBuildObject } from '../utilities/json.js'
import { rawConstraint } from '../utilities/rawConstraint.js'
import {
  InternalBlockTableNameIndex,
  resolveBlockTableName,
} from '../utilities/validateExistingBlockIsIdentical.js'

const flattenAllWherePaths = (where: Where, paths: { path: string; ref: any }[]) => {
  for (const k in where) {
    if (['AND', 'OR'].includes(k.toUpperCase())) {
      if (Array.isArray(where[k])) {
        for (const whereField of where[k]) {
          flattenAllWherePaths(whereField, paths)
        }
      }
    } else {
      // TODO: explore how to support arrays/relationship querying.
      paths.push({ path: k.split('.').join('_'), ref: where })
    }
  }
}

const buildSQLWhere = (where: Where, alias: string) => {
  for (const k in where) {
    if (['AND', 'OR'].includes(k.toUpperCase())) {
      if (Array.isArray(where[k])) {
        const op = 'AND' === k.toUpperCase() ? and : or
        const accumulated = []
        for (const whereField of where[k]) {
          accumulated.push(buildSQLWhere(whereField, alias))
        }
        return op(...accumulated)
      }
    } else {
      let payloadOperator = Object.keys(where[k])[0]

      const value = where[k][payloadOperator]
      if (payloadOperator === '$raw') {
        return sql.raw(value)
      }

      // Handle exists: false -> use isNull instead of isNotNull

      // This logic is duplicated from sanitizeQueryValue.ts because buildSQLWhere
      // is a simplified WHERE builder for polymorphic joins that doesn't have access
      // to field definitions needed by sanitizeQueryValue
      if (payloadOperator === 'exists' && value === false) {
        payloadOperator = 'isNull'
      }

      return operatorMap[payloadOperator](sql.raw(`"${alias}"."${k.split('.').join('_')}"`), value)
    }
  }
}

type SQLSelect = SQLiteSelectBase<any, any, any, any>

type TraverseFieldArgs = {
  _locales: Result
  adapter: DrizzleAdapter
  collectionSlug?: string
  currentArgs: Result
  currentTableName: string
  depth?: number
  draftsEnabled?: boolean
  fields: FlattenedField[]
  forceWithFields?: boolean
  joinQuery: JoinQuery
  joins?: BuildQueryJoinAliases
  locale?: string
  parentIsLocalized?: boolean
  path: string
  select?: SelectType
  selectAllOnCurrentLevel?: boolean
  selectMode?: SelectMode
  tablePath: string
  topLevelArgs: Record<string, unknown>
  topLevelTableName: string
  versions?: boolean
  withTabledFields: {
    numbers?: boolean
    rels?: boolean
    texts?: boolean
  }
}

export const traverseFields = ({
  _locales,
  adapter,
  collectionSlug,
  currentArgs,
  currentTableName,
  depth,
  draftsEnabled,
  fields,
  forceWithFields,
  joinQuery = {},
  joins,
  locale,
  parentIsLocalized = false,
  path,
  select,
  selectAllOnCurrentLevel = false,
  selectMode,
  tablePath,
  topLevelArgs,
  topLevelTableName,
  versions,
  withTabledFields,
}: TraverseFieldArgs) => {
  fields.forEach((field) => {
    if (fieldIsVirtual(field)) {
      return
    }

    const isFieldLocalized = fieldShouldBeLocalized({
      field,
      parentIsLocalized,
    })

    // handle simple relationship
    if (
      depth > 0 &&
      (field.type === 'upload' || field.type === 'relationship') &&
      !field.hasMany &&
      typeof field.relationTo === 'string'
    ) {
      if (isFieldLocalized) {
        _locales.with[`${path}${field.name}`] = true
      } else {
        currentArgs.with[`${path}${field.name}`] = true
      }
    }

    switch (field.type) {
      case 'array': {
        const arraySelect = selectAllOnCurrentLevel ? true : select?.[field.name]

        if (select) {
          if (
            (selectMode === 'include' && typeof arraySelect === 'undefined') ||
            (selectMode === 'exclude' && arraySelect === false)
          ) {
            break
          }
        }

        const withArray: Result = {
          columns:
            typeof arraySelect === 'object'
              ? {
                  id: true,
                  _order: true,
                }
              : {
                  _parentID: false,
                },
          orderBy: ({ _order }, { asc }) => [asc(_order)],
          with: {},
        }

        const arrayTableName = adapter.tableNameMap.get(
          `${currentTableName}_${tablePath}${toSnakeCase(field.name)}`,
        )

        if (typeof arraySelect === 'object') {
          if (adapter.tables[arrayTableName]._locale) {
            withArray.columns._locale = true
          }

          if (adapter.tables[arrayTableName]._uuid) {
            withArray.columns._uuid = true
          }
        }

        const arrayTableNameWithLocales = `${arrayTableName}${adapter.localesSuffix}`

        if (adapter.tables[arrayTableNameWithLocales]) {
          withArray.with._locales = {
            columns:
              typeof arraySelect === 'object'
                ? {
                    _locale: true,
                  }
                : {
                    id: false,
                    _parentID: false,
                  },
            with: {},
          }
        }

        const relationName = getArrayRelationName({
          field,
          path: `${path}${field.name}`,
          tableName: arrayTableName,
        })

        currentArgs.with[relationName] = withArray

        traverseFields({
          _locales: withArray.with._locales,
          adapter,
          currentArgs: withArray,
          currentTableName: arrayTableName,
          depth,
          draftsEnabled,
          fields: field.flattenedFields,
          forceWithFields,
          joinQuery,
          locale,
          parentIsLocalized: parentIsLocalized || field.localized,
          path: '',
          select: typeof arraySelect === 'object' ? arraySelect : undefined,
          selectMode,
          tablePath: '',
          topLevelArgs,
          topLevelTableName,
          withTabledFields,
        })

        if (
          typeof arraySelect === 'object' &&
          withArray.with._locales &&
          Object.keys(withArray.with._locales).length === 1
        ) {
          delete withArray.with._locales
        }

        break
      }

      case 'blocks': {
        const blocksSelect = selectAllOnCurrentLevel ? true : select?.[field.name]

        if (select) {
          if (
            (selectMode === 'include' && !blocksSelect) ||
            (selectMode === 'exclude' && blocksSelect === false)
          ) {
            break
          }
        }

        if (adapter.blocksAsJSON) {
          if (select || selectAllOnCurrentLevel) {
            const fieldPath = `${path}${field.name}`

            if ((isFieldLocalized || parentIsLocalized) && _locales) {
              _locales.columns[fieldPath] = true
            } else if (adapter.tables[currentTableName]?.[fieldPath]) {
              currentArgs.columns[fieldPath] = true
            }
          }

          break
        }

        ;(field.blockReferences ?? field.blocks).forEach((_block) => {
          const block = typeof _block === 'string' ? adapter.payload.blocks[_block] : _block
          const blockKey = `_blocks_${block.slug}${!block[InternalBlockTableNameIndex] ? '' : `_${block[InternalBlockTableNameIndex]}`}`

          let blockSelect: boolean | SelectType | undefined

          let blockSelectMode = selectMode

          if (selectMode === 'include' && blocksSelect === true) {
            blockSelect = true
          }

          if (typeof blocksSelect === 'object') {
            if (typeof blocksSelect[block.slug] === 'object') {
              blockSelect = blocksSelect[block.slug]
            } else if (
              (selectMode === 'include' && typeof blocksSelect[block.slug] === 'undefined') ||
              (selectMode === 'exclude' && blocksSelect[block.slug] === false)
            ) {
              blockSelect = {}
              blockSelectMode = 'include'
            } else if (selectMode === 'include' && Boolean(blocksSelect[block.slug])) {
              blockSelect = true
            }
          }

          if (!topLevelArgs[blockKey]) {
            const withBlock: Result = {
              columns:
                typeof blockSelect === 'object'
                  ? {
                      id: true,
                      _order: true,
                      _path: true,
                    }
                  : {
                      _parentID: false,
                    },
              orderBy: ({ _order }, { asc }) => [asc(_order)],
              with: {},
            }

            const tableName = resolveBlockTableName(
              block,
              adapter.tableNameMap.get(`${topLevelTableName}_blocks_${toSnakeCase(block.slug)}`),
            )

            if (typeof blockSelect === 'object') {
              if (adapter.tables[tableName]._locale) {
                withBlock.columns._locale = true
              }

              if (adapter.tables[tableName]._uuid) {
                withBlock.columns._uuid = true
              }
            }

            if (adapter.tables[`${tableName}${adapter.localesSuffix}`]) {
              withBlock.with._locales = {
                with: {},
              }

              if (typeof blockSelect === 'object') {
                withBlock.with._locales.columns = {
                  _locale: true,
                }
              }
            }
            topLevelArgs.with[blockKey] = withBlock

            traverseFields({
              _locales: withBlock.with._locales,
              adapter,
              currentArgs: withBlock,
              currentTableName: tableName,
              depth,
              draftsEnabled,
              fields: block.flattenedFields,
              forceWithFields: blockSelect === true,
              joinQuery,
              locale,
              parentIsLocalized: parentIsLocalized || field.localized,
              path: '',
              select: typeof blockSelect === 'object' ? blockSelect : undefined,
              selectMode: blockSelectMode,
              tablePath: '',
              topLevelArgs,
              topLevelTableName,
              withTabledFields,
            })

            if (
              typeof blockSelect === 'object' &&
              withBlock.with._locales &&
              Object.keys(withBlock.with._locales.columns).length === 1
            ) {
              delete withBlock.with._locales
            }
          }
        })

        break
      }

      case 'group':
      case 'tab': {
        const fieldSelect = select?.[field.name]

        if (fieldSelect === false) {
          break
        }

        traverseFields({
          _locales,
          adapter,
          collectionSlug,
          currentArgs,
          currentTableName,
          depth,
          draftsEnabled,
          fields: field.flattenedFields,
          forceWithFields,
          joinQuery,
          joins,
          locale,
          parentIsLocalized: parentIsLocalized || field.localized,
          path: `${path}${field.name}_`,
          select: typeof fieldSelect === 'object' ? fieldSelect : undefined,
          selectAllOnCurrentLevel:
            selectAllOnCurrentLevel ||
            fieldSelect === true ||
            (selectMode === 'exclude' && typeof fieldSelect === 'undefined'),
          selectMode,
          tablePath: `${tablePath}${toSnakeCase(field.name)}_`,
          topLevelArgs,
          topLevelTableName,
          versions,
          withTabledFields,
        })

        break
      }
      case 'join': {
        // when `joinsQuery` is false, do not join
        if (joinQuery === false) {
          break
        }

        if (
          (select && selectMode === 'include' && !select[field.name]) ||
          (selectMode === 'exclude' && select[field.name] === false)
        ) {
          break
        }

        const joinSchemaPath = `${path.replaceAll('_', '.')}${field.name}`

        if (joinQuery[joinSchemaPath] === false) {
          break
        }

        const {
          count: shouldCount = false,
          limit: limitArg = field.defaultLimit ?? 10,
          page,
          sort = field.defaultSort,
          where,
        } = joinQuery[joinSchemaPath] || {}
        let limit = limitArg

        if (limit !== 0) {
          // get an additional document and slice it later to determine if there is a next page
          limit += 1
        }

        const columnName = `${path.replaceAll('.', '_')}${field.name}`

        const db = adapter.drizzle as LibSQLDatabase

        if (Array.isArray(field.collection)) {
          let currentQuery: null | SQLSelect = null
          const onPath = field.on.split('.').join('_')

          if (Array.isArray(sort)) {
            throw new Error('Not implemented')
          }

          let sanitizedSort = sort

          if (!sanitizedSort) {
            if (
              field.collection.some((collection) =>
                adapter.payload.collections[collection].config.fields.some(
                  (f) => f.type === 'date' && f.name === 'createdAt',
                ),
              )
            ) {
              sanitizedSort = '-createdAt'
            } else {
              sanitizedSort = 'id'
            }
          }

          const sortOrder = sanitizedSort.startsWith('-') ? desc : asc
          sanitizedSort = sanitizedSort.replace('-', '')

          const sortPath = sanitizedSort.split('.').join('_')

          const wherePaths: { path: string; ref: any }[] = []

          if (where) {
            flattenAllWherePaths(where, wherePaths)
          }

          for (const collection of field.collection) {
            const joinCollectionTableName = adapter.tableNameMap.get(toSnakeCase(collection))

            const table = adapter.tables[joinCollectionTableName]

            const sortColumn = table[sortPath]

            const selectFields = {
              id: adapter.tables[joinCollectionTableName].id,
              parent: sql`${adapter.tables[joinCollectionTableName][onPath]}`.as(onPath),
              relationTo: sql`${collection}`.as('relationTo'),
              sortPath: sql`${sortColumn ? sortColumn : null}`.as('sortPath'),
            }

            const collectionQueryWhere: any[] = []
            // Select for WHERE and Fallback NULL
            for (const { path, ref } of wherePaths) {
              const collectioConfig = adapter.payload.collections[collection].config
              const field = getFieldByPath({ fields: collectioConfig.flattenedFields, path })

              if (field && field.field.type === 'select' && field.field.hasMany) {
                let tableName = adapter.tableNameMap.get(
                  `${toSnakeCase(collection)}_${toSnakeCase(path)}`,
                )
                let parentTable = getTableName(table)

                if (adapter.schemaName) {
                  tableName = `"${adapter.schemaName}"."${tableName}"`
                  parentTable = `"${adapter.schemaName}"."${parentTable}"`
                }

                if (adapter.name === 'postgres') {
                  selectFields[path] = sql
                    .raw(
                      `(select jsonb_agg(${tableName}.value) from ${tableName} where ${tableName}.parent_id = ${parentTable}.id)`,
                    )
                    .as(path)
                } else {
                  selectFields[path] = sql
                    .raw(
                      `(select json_group_array(${tableName}.value) from ${tableName} where ${tableName}.parent_id = ${parentTable}.id)`,
                    )
                    .as(path)
                }

                const constraint = ref[path]
                const operator = Object.keys(constraint)[0]
                const value: any = Object.values(constraint)[0]

                const query = adapter.createJSONQuery({
                  column: `"${path}"`,
                  operator,
                  pathSegments: [field.field.name],
                  table: parentTable,
                  value,
                })
                ref[path] = { $raw: query }
              } else if (adapter.tables[joinCollectionTableName][path]) {
                selectFields[path] = sql`${adapter.tables[joinCollectionTableName][path]}`.as(path)
                // Allow to filter by collectionSlug
              } else if (path !== 'relationTo') {
                // For timestamp fields like deletedAt, we need to cast to timestamp in Postgres
                // SQLite doesn't require explicit type casting for UNION queries
                if (path === 'deletedAt' && adapter.name === 'postgres') {
                  selectFields[path] = sql`null::timestamp with time zone`.as(path)
                } else {
                  selectFields[path] = sql`null`.as(path)
                }
              }
            }

            let query: any = db.select(selectFields).from(adapter.tables[joinCollectionTableName])
            if (collectionQueryWhere.length) {
              query = query.where(and(...collectionQueryWhere))
            }
            if (currentQuery === null) {
              currentQuery = query as unknown as SQLSelect
            } else {
              currentQuery = currentQuery.unionAll(query) as SQLSelect
            }
          }

          const subQueryAlias = `${columnName}_subquery`

          let sqlWhere = eq(
            sql.raw(`"${currentTableName}"."id"`),
            sql.raw(`"${subQueryAlias}"."${onPath}"`),
          )

          if (where && Object.keys(where).length > 0) {
            sqlWhere = and(sqlWhere, buildSQLWhere(where, subQueryAlias))
          }

          if (shouldCount) {
            currentArgs.extras[`${columnName}_count`] = sql`${db
              .select({ count: count() })
              .from(sql`${currentQuery.as(subQueryAlias)}`)
              .where(sqlWhere)}`.as(`${columnName}_count`)
          }

          currentQuery = currentQuery.orderBy(sortOrder(sql`"sortPath"`)) as SQLSelect

          if (page && limit !== 0) {
            const offset = (page - 1) * limit
            if (offset > 0) {
              currentQuery = currentQuery.offset(offset) as SQLSelect
            }
          }

          if (limit) {
            currentQuery = currentQuery.limit(limit) as SQLSelect
          }

          currentArgs.extras[columnName] = sql`${db
            .select({
              id: jsonAggBuildObject(adapter, {
                id: sql.raw(`"${subQueryAlias}"."id"`),
                relationTo: sql.raw(`"${subQueryAlias}"."relationTo"`),
              }),
            })
            .from(sql`${currentQuery.as(subQueryAlias)}`)
            .where(sqlWhere)}`.as(columnName)
        } else {
          const useDrafts =
            (versions || draftsEnabled) &&
            hasDraftsEnabled(adapter.payload.collections[field.collection].config)

          const fields = useDrafts
            ? buildVersionCollectionFields(
                adapter.payload.config,
                adapter.payload.collections[field.collection].config,
                true,
              )
            : adapter.payload.collections[field.collection].config.flattenedFields

          const joinCollectionTableName = adapter.tableNameMap.get(
            useDrafts
              ? `_${toSnakeCase(field.collection)}${adapter.versionsSuffix}`
              : toSnakeCase(field.collection),
          )

          const joins: BuildQueryJoinAliases = []

          const currentIDColumn = versions
            ? adapter.tables[currentTableName].parent
            : adapter.tables[currentTableName].id

          let joinQueryWhere: Where

          const currentIDRaw = sql.raw(
            `"${getNameFromDrizzleTable(currentIDColumn.table)}"."${currentIDColumn.name}"`,
          )

          if (Array.isArray(field.targetField.relationTo)) {
            joinQueryWhere = {
              [field.on]: {
                equals: {
                  relationTo: collectionSlug,
                  value: rawConstraint(currentIDRaw),
                },
              },
            }
          } else {
            joinQueryWhere = {
              [field.on]: {
                equals: rawConstraint(currentIDRaw),
              },
            }
          }

          if (where && Object.keys(where).length) {
            joinQueryWhere = {
              and: [joinQueryWhere, where],
            }
          }

          if (useDrafts) {
            joinQueryWhere = combineQueries(appendVersionToQueryKey(joinQueryWhere), {
              latest: { equals: true },
            })
          }

          const columnName = `${path.replaceAll('.', '_')}${field.name}`

          const subQueryAlias = `${columnName}_alias`

          const { newAliasTable } = getTableAlias({
            adapter,
            tableName: joinCollectionTableName,
          })

          const {
            orderBy,
            selectFields,
            where: subQueryWhere,
          } = buildQuery({
            adapter,
            aliasTable: newAliasTable,
            fields,
            joins,
            locale,
            parentIsLocalized,
            selectLocale: true,
            sort: useDrafts
              ? getQueryDraftsSort({
                  collectionConfig: adapter.payload.collections[field.collection].config,
                  sort,
                })
              : sort,
            tableName: joinCollectionTableName,
            where: joinQueryWhere,
          })

          for (let key in selectFields) {
            const val = selectFields[key]

            if (val.table && getNameFromDrizzleTable(val.table) === joinCollectionTableName) {
              delete selectFields[key]
              key = key.split('.').pop()
              selectFields[key] = newAliasTable[key]
            }
          }

          if (useDrafts) {
            selectFields.parent = newAliasTable.parent
          }

          let query: SQLiteSelect = db
            .select(selectFields as any)
            .from(newAliasTable)
            .where(subQueryWhere)
            .orderBy(() => orderBy.map(({ column, order }) => order(column)))
            .$dynamic()

          joins.forEach(({ type, condition, table }) => {
            query = query[type ?? 'leftJoin'](table, condition)
          })

          if (page && limit !== 0) {
            const offset = (page - 1) * limit - 1
            if (offset > 0) {
              query = query.offset(offset)
            }
          }

          if (limit !== 0) {
            query = query.limit(limit)
          }

          const subQuery = query.as(subQueryAlias)

          if (shouldCount) {
            let countSubquery: SQLiteSelect = db
              .select(selectFields as any)

              .from(newAliasTable)
              .where(subQueryWhere)
              .$dynamic()

            joins.forEach(({ type, condition, table }) => {
              countSubquery = countSubquery[type ?? 'leftJoin'](table, condition)
            })

            currentArgs.extras[`${columnName}_count`] = sql`${db
              .select({
                count: count(),
              })
              .from(sql`${countSubquery.as(`${subQueryAlias}_count_subquery`)}`)}`.as(
              `${subQueryAlias}_count`,
            )
          }

          currentArgs.extras[columnName] = sql`${db
            .select({
              result: jsonAggBuildObject(adapter, {
                id: sql.raw(`"${subQueryAlias}".${useDrafts ? 'parent_id' : 'id'}`),
                ...(selectFields._locale && {
                  locale: sql.raw(`"${subQueryAlias}".${selectFields._locale.name}`),
                }),
              }),
            })
            .from(sql`${subQuery}`)}`.as(subQueryAlias)
        }

        break
      }

      case 'point': {
        if (adapter.name === 'sqlite') {
          break
        }

        const args = isFieldLocalized ? _locales : currentArgs
        if (!args.columns) {
          args.columns = {}
        }

        if (!args.extras) {
          args.extras = {}
        }

        const name = `${path}${field.name}`

        // Drizzle handles that poorly. See https://github.com/drizzle-team/drizzle-orm/issues/2526
        // Additionally, this way we format the column value straight in the database using ST_AsGeoJSON
        args.columns[name] = false

        let shouldSelect = false

        if (select || selectAllOnCurrentLevel) {
          if (
            selectAllOnCurrentLevel ||
            (selectMode === 'include' && Boolean(select[field.name])) ||
            (selectMode === 'exclude' && typeof select[field.name] === 'undefined')
          ) {
            shouldSelect = true
          }
        } else {
          shouldSelect = true
        }
        const tableName = fieldShouldBeLocalized({ field, parentIsLocalized })
          ? `${currentTableName}${adapter.localesSuffix}`
          : currentTableName

        if (shouldSelect) {
          args.extras[name] = sql
            .raw(`ST_AsGeoJSON("${adapter.tables[tableName][name].name}")::jsonb`)
            .as(name)
        }
        break
      }

      case 'select': {
        if (select && !selectAllOnCurrentLevel) {
          if (
            (selectMode === 'include' && !select[field.name]) ||
            (selectMode === 'exclude' && select[field.name] === false)
          ) {
            break
          }
        }

        if (field.hasMany) {
          const withSelect: Result = {
            columns: {
              id: false,
              order: false,
              parent: false,
            },
            orderBy: ({ order }, { asc }) => [asc(order)],
          }

          currentArgs.with[`${path}${field.name}`] = withSelect
          break
        }

        if (select || selectAllOnCurrentLevel) {
          const fieldPath = `${path}${field.name}`

          if ((isFieldLocalized || parentIsLocalized) && _locales) {
            _locales.columns[fieldPath] = true
          } else if (adapter.tables[currentTableName]?.[fieldPath]) {
            currentArgs.columns[fieldPath] = true
          }
        }

        break
      }

      default: {
        if (forceWithFields) {
          if (
            (field.type === 'relationship' || field.type === 'upload') &&
            (field.hasMany || Array.isArray(field.relationTo))
          ) {
            withTabledFields.rels = true
          }

          if (field.type === 'number' && field.hasMany) {
            withTabledFields.numbers = true
          }

          if (field.type === 'text' && field.hasMany) {
            withTabledFields.texts = true
          }
        }

        if (!select && !selectAllOnCurrentLevel) {
          break
        }

        if (
          selectAllOnCurrentLevel ||
          (selectMode === 'include' && Boolean(select[field.name])) ||
          (selectMode === 'exclude' && typeof select[field.name] === 'undefined')
        ) {
          const fieldPath = `${path}${field.name}`

          if ((isFieldLocalized || parentIsLocalized) && _locales) {
            _locales.columns[fieldPath] = true
          } else if (adapter.tables[currentTableName]?.[fieldPath]) {
            currentArgs.columns[fieldPath] = true
          }

          if (
            !withTabledFields.rels &&
            (field.type === 'relationship' || field.type === 'upload') &&
            (field.hasMany || Array.isArray(field.relationTo))
          ) {
            withTabledFields.rels = true
          }

          if (!withTabledFields.numbers && field.type === 'number' && field.hasMany) {
            withTabledFields.numbers = true
          }

          if (!withTabledFields.texts && field.type === 'text' && field.hasMany) {
            withTabledFields.texts = true
          }
        }

        break
      }
    }
  })

  return topLevelArgs
}
```

--------------------------------------------------------------------------------

---[FILE: columnToCodeConverter.ts]---
Location: payload-main/packages/drizzle/src/postgres/columnToCodeConverter.ts

```typescript
import type { ColumnToCodeConverter } from '../types.js'
export const columnToCodeConverter: ColumnToCodeConverter = ({
  adapter,
  addEnum,
  addImport,
  column,
  tableKey,
}) => {
  let columnBuilderFn: string = column.type

  if (column.type === 'geometry') {
    columnBuilderFn = 'geometryColumn'
    addImport(adapter.packageName, columnBuilderFn)
  } else if (column.type === 'enum') {
    if ('locale' in column) {
      columnBuilderFn = `enum__locales`
    } else {
      addEnum(column.enumName, column.options)
      columnBuilderFn = column.enumName
    }
  } else {
    addImport(`${adapter.packageName}/drizzle/pg-core`, columnBuilderFn)
  }

  const columnBuilderArgsArray: string[] = []

  switch (column.type) {
    case 'bit':
    case 'halfvec':
    case 'sparsevec':
    case 'vector': {
      if (column.dimensions) {
        columnBuilderArgsArray.push(`dimensions: ${column.dimensions}`)
      }
      break
    }
    case 'numeric': {
      columnBuilderArgsArray.push("mode: 'number'")
      break
    }
    case 'timestamp': {
      columnBuilderArgsArray.push(`mode: '${column.mode}'`)
      if (column.withTimezone) {
        columnBuilderArgsArray.push('withTimezone: true')
      }

      if (typeof column.precision === 'number') {
        columnBuilderArgsArray.push(`precision: ${column.precision}`)
      }
      break
    }
  }

  let columnBuilderArgs = ''

  if (columnBuilderArgsArray.length) {
    columnBuilderArgs = `, {${columnBuilderArgsArray.join(',')}}`
  }

  let code = `${columnBuilderFn}('${column.name}'${columnBuilderArgs})`

  if (column.type === 'timestamp' && column.defaultNow) {
    code = `${code}.defaultNow()`
  }

  if (column.type === 'uuid' && column.defaultRandom) {
    code = `${code}.defaultRandom()`
  }

  if (column.notNull) {
    code = `${code}.notNull()`
  }

  if (column.primaryKey) {
    code = `${code}.primaryKey()`
  }

  if (typeof column.default !== 'undefined') {
    let sanitizedDefault = column.default

    if (column.type === 'geometry') {
      sanitizedDefault = `sql\`${column.default}\``
    } else if (column.type === 'jsonb') {
      sanitizedDefault = `sql\`'${JSON.stringify(column.default)}'::jsonb\``
    } else if (column.type === 'numeric') {
      sanitizedDefault = `${column.default}`
    } else if (typeof column.default === 'string') {
      sanitizedDefault = `${JSON.stringify(column.default)}`
    }

    code = `${code}.default(${sanitizedDefault})`
  }

  if (column.reference) {
    let callback = `()`

    if (column.reference.table === tableKey) {
      addImport(`${adapter.packageName}/drizzle/pg-core`, 'type AnyPgColumn')
      callback = `${callback}: AnyPgColumn`
    }

    callback = `${callback} => ${column.reference.table}.${column.reference.name}`

    code = `${code}.references(${callback}, {
      ${column.reference.onDelete ? `onDelete: '${column.reference.onDelete}'` : ''}
  })`
  }

  return code
}
```

--------------------------------------------------------------------------------

---[FILE: countDistinct.ts]---
Location: payload-main/packages/drizzle/src/postgres/countDistinct.ts

```typescript
import type { PgTableWithColumns } from 'drizzle-orm/pg-core'

import { count, sql } from 'drizzle-orm'

import type { BasePostgresAdapter, CountDistinct } from './types.js'

export const countDistinct: CountDistinct = async function countDistinct(
  this: BasePostgresAdapter,
  { column, db, joins, tableName, where },
) {
  // When we don't have any joins - use a simple COUNT(*) query.
  if (joins.length === 0) {
    const countResult = await db
      .select({
        count: column ? count(sql`DISTINCT ${column}`) : count(),
      })
      .from(this.tables[tableName])
      .where(where)

    return Number(countResult?.[0]?.count ?? 0)
  }

  let query = db
    .select({
      count: sql`COUNT(1) OVER()`,
    })
    .from(this.tables[tableName])
    .where(where)
    .groupBy(column || this.tables[tableName].id)
    .limit(1)
    .$dynamic()

  joins.forEach(({ type, condition, table }) => {
    query = query[type ?? 'leftJoin'](table as PgTableWithColumns<any>, condition)
  })

  // When we have any joins, we need to count each individual ID only once.
  // COUNT(*) doesn't work for this well in this case, as it also counts joined tables.
  // SELECT (COUNT DISTINCT id) has a very slow performance on large tables.
  // Instead, COUNT (GROUP BY id) can be used which is still slower than COUNT(*) but acceptable.
  const countResult = await query

  return Number(countResult?.[0]?.count ?? 0)
}
```

--------------------------------------------------------------------------------

---[FILE: createDatabase.ts]---
Location: payload-main/packages/drizzle/src/postgres/createDatabase.ts

```typescript
import type { ClientConfig } from 'pg'

import type { BasePostgresAdapter } from './types.js'

const setConnectionStringDatabase = ({
  connectionString,
  database,
}: {
  connectionString: string
  database: string
}): string => {
  const connectionURL = new URL(connectionString)
  const newConnectionURL = new URL(connectionURL)
  newConnectionURL.pathname = `/${database}`

  return newConnectionURL.toString()
}

type Args = {
  /**
   * Name of a database, defaults to the current one
   */
  name?: string
  /**
   * Schema to create in addition to 'public'. Defaults to adapter.schemaName if exists.
   */
  schemaName?: string
}
export const createDatabase = async function (this: BasePostgresAdapter, args: Args = {}) {
  // POSTGRES_URL - default Vercel env
  const connectionString =
    this.poolOptions?.connectionString ?? process.env.POSTGRES_URL ?? process.env.DATABASE_URL
  let managementClientConfig: ClientConfig = {}
  let dbName = args.name
  const schemaName = this.schemaName || 'public'

  if (connectionString) {
    if (!dbName) {
      dbName = new URL(connectionString).pathname.slice(1)
    }

    managementClientConfig.connectionString = setConnectionStringDatabase({
      connectionString,
      database: 'postgres',
    })
  } else {
    if (!dbName) {
      dbName = this.poolOptions.database
    }

    managementClientConfig = {
      ...this.poolOptions,
      database: 'postgres',
    }
  }

  // import pg only when createDatabase is used
  const pg = await import('pg').then((mod) => mod.default)

  const managementClient = new pg.Client(managementClientConfig)

  try {
    await managementClient.connect()
    await managementClient.query(`CREATE DATABASE "${dbName}"`)

    this.payload.logger.info(`Created database "${dbName}"`)

    if (schemaName !== 'public') {
      let createdDatabaseConfig: ClientConfig = {}

      if (connectionString) {
        createdDatabaseConfig.connectionString = setConnectionStringDatabase({
          connectionString,
          database: dbName,
        })
      } else {
        createdDatabaseConfig = {
          ...this.poolOptions,
          database: dbName,
        }
      }

      const createdDatabaseClient = new pg.Client(createdDatabaseConfig)

      try {
        await createdDatabaseClient.connect()

        await createdDatabaseClient.query(`CREATE SCHEMA ${schemaName}`)
        this.payload.logger.info(`Created schema "${dbName}.${schemaName}"`)
      } catch (err) {
        this.payload.logger.error({
          err,
          msg: `Error: failed to create schema "${dbName}.${schemaName}". Details: ${err.message}`,
        })
      } finally {
        await createdDatabaseClient.end()
      }
    }

    return true
  } catch (err) {
    this.payload.logger.error({
      err,
      msg: `Error: failed to create database ${dbName}. Details: ${err.message}`,
    })

    return false
  } finally {
    await managementClient.end()
  }
}
```

--------------------------------------------------------------------------------

---[FILE: createExtensions.ts]---
Location: payload-main/packages/drizzle/src/postgres/createExtensions.ts

```typescript
import type { BasePostgresAdapter } from './types.js'

export const createExtensions = async function (this: BasePostgresAdapter): Promise<void> {
  for (const extension in this.extensions) {
    if (this.extensions[extension]) {
      try {
        await this.drizzle.execute(`CREATE EXTENSION IF NOT EXISTS "${extension}"`)
      } catch (err) {
        this.payload.logger.error({ err, msg: `Failed to create extension ${extension}` })
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: defaultSnapshot.ts]---
Location: payload-main/packages/drizzle/src/postgres/defaultSnapshot.ts

```typescript
import type { DrizzleSnapshotJSON } from 'drizzle-kit/api'

export const defaultDrizzleSnapshot: DrizzleSnapshotJSON = {
  id: '00000000-0000-0000-0000-000000000000',
  _meta: {
    columns: {},
    schemas: {},
    tables: {},
  },
  dialect: 'postgresql',
  enums: {},
  policies: {},
  prevId: '00000000-0000-0000-0000-00000000000',
  roles: {},
  schemas: {},
  sequences: {},
  tables: {},
  version: '7',
  views: {},
}
```

--------------------------------------------------------------------------------

---[FILE: deleteWhere.ts]---
Location: payload-main/packages/drizzle/src/postgres/deleteWhere.ts

```typescript
import type { TransactionPg } from '../types.js'
import type { DeleteWhere } from './types.js'

export const deleteWhere: DeleteWhere = async function deleteWhere({ db, tableName, where }) {
  const table = this.tables[tableName]
  await (db as TransactionPg).delete(table).where(where)
}
```

--------------------------------------------------------------------------------

---[FILE: dropDatabase.ts]---
Location: payload-main/packages/drizzle/src/postgres/dropDatabase.ts

```typescript
import type { DropDatabase } from './types.js'

export const dropDatabase: DropDatabase = async function dropDatabase({ adapter }) {
  await adapter.execute({
    drizzle: adapter.drizzle,
    raw: `drop schema if exists ${this.schemaName || 'public'} cascade;
    create schema ${this.schemaName || 'public'};`,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: execute.ts]---
Location: payload-main/packages/drizzle/src/postgres/execute.ts

```typescript
import { sql } from 'drizzle-orm'

import type { Execute } from './types.js'

export const execute: Execute<any> = function execute({ db, drizzle, raw, sql: statement }) {
  const executeFrom = db ?? drizzle

  if (raw) {
    return executeFrom.execute(sql.raw(raw))
  } else {
    return executeFrom.execute(sql`${statement}`)
  }
}
```

--------------------------------------------------------------------------------

````
