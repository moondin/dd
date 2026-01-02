---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 133
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 133 of 695)

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

---[FILE: create.ts]---
Location: payload-main/packages/drizzle/src/create.ts

```typescript
import type { Create } from 'payload'

import toSnakeCase from 'to-snake-case'

import type { DrizzleAdapter } from './types.js'

import { upsertRow } from './upsertRow/index.js'
import { getTransaction } from './utilities/getTransaction.js'

export const create: Create = async function create(
  this: DrizzleAdapter,
  { collection: collectionSlug, data, req, returning, select },
) {
  const collection = this.payload.collections[collectionSlug].config

  const tableName = this.tableNameMap.get(toSnakeCase(collection.slug))

  const db = await getTransaction(this, req)

  const result = await upsertRow({
    adapter: this,
    data,
    db,
    fields: collection.flattenedFields,
    ignoreResult: returning === false,
    operation: 'create',
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

---[FILE: createGlobal.ts]---
Location: payload-main/packages/drizzle/src/createGlobal.ts

```typescript
import type { CreateGlobalArgs } from 'payload'

import toSnakeCase from 'to-snake-case'

import type { DrizzleAdapter } from './types.js'

import { upsertRow } from './upsertRow/index.js'
import { getTransaction } from './utilities/getTransaction.js'

export async function createGlobal<T extends Record<string, unknown>>(
  this: DrizzleAdapter,
  { slug, data, req, returning }: CreateGlobalArgs,
): Promise<T> {
  const globalConfig = this.payload.globals.config.find((config) => config.slug === slug)

  const tableName = this.tableNameMap.get(toSnakeCase(globalConfig.slug))

  data.createdAt = new Date().toISOString()

  const db = await getTransaction(this, req)

  const result = await upsertRow<{ globalType: string } & T>({
    adapter: this,
    data,
    db,
    fields: globalConfig.flattenedFields,
    ignoreResult: returning === false,
    operation: 'create',
    req,
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

---[FILE: createGlobalVersion.ts]---
Location: payload-main/packages/drizzle/src/createGlobalVersion.ts

```typescript
import type { CreateGlobalVersionArgs, JsonObject, TypeWithVersion } from 'payload'

import { sql } from 'drizzle-orm'
import { buildVersionGlobalFields } from 'payload'
import { hasDraftsEnabled } from 'payload/shared'
import toSnakeCase from 'to-snake-case'

import type { DrizzleAdapter } from './types.js'

import { upsertRow } from './upsertRow/index.js'
import { getTransaction } from './utilities/getTransaction.js'

export async function createGlobalVersion<T extends JsonObject = JsonObject>(
  this: DrizzleAdapter,
  {
    autosave,
    createdAt,
    globalSlug,
    publishedLocale,
    req,
    returning,
    select,
    snapshot,
    updatedAt,
    versionData,
  }: CreateGlobalVersionArgs,
): Promise<TypeWithVersion<T>> {
  const global = this.payload.globals.config.find(({ slug }) => slug === globalSlug)

  const tableName = this.tableNameMap.get(`_${toSnakeCase(global.slug)}${this.versionsSuffix}`)

  const db = await getTransaction(this, req)

  const result = await upsertRow<TypeWithVersion<T>>({
    adapter: this,
    data: {
      autosave,
      createdAt,
      latest: true,
      publishedLocale,
      snapshot,
      updatedAt,
      version: versionData,
    },
    db,
    fields: buildVersionGlobalFields(this.payload.config, global, true),
    ignoreResult: returning === false ? 'idOnly' : false,
    operation: 'create',
    req,
    select,
    tableName,
  })

  const table = this.tables[tableName]
  if (hasDraftsEnabled(global)) {
    await this.execute({
      db,
      sql: sql`
          UPDATE ${table}
          SET latest = false
          WHERE ${table.id} != ${result.id};
        `,
    })
  }

  if (returning === false) {
    return null
  }

  return result
}
```

--------------------------------------------------------------------------------

---[FILE: createTableName.ts]---
Location: payload-main/packages/drizzle/src/createTableName.ts

```typescript
import type { DBIdentifierName } from 'payload'

import { APIError } from 'payload'
import toSnakeCase from 'to-snake-case'

import type { DrizzleAdapter } from './types.js'

type Args = {
  adapter: Pick<DrizzleAdapter, 'tableNameMap' | 'versionsSuffix'>
  /** The collection, global or field config **/
  config: {
    dbName?: DBIdentifierName
    enumName?: DBIdentifierName
    name?: string
    slug?: string
  }
  /** For nested tables passed for the user custom dbName functions to handle their own iterations */
  parentTableName?: string
  /** For sub tables (array for example) this needs to include the parentTableName */
  prefix?: string
  /** For tables based on fields that could have both enumName and dbName (ie: select with hasMany), default: 'dbName' */
  target?: 'dbName' | 'enumName'
  /** Throws error if true for postgres when table and enum names exceed 63 characters */
  throwValidationError?: boolean
  /** Adds the versions suffix to the default table name - should only be used on the base collection to avoid duplicate suffixing */
  versions?: boolean
  /** Adds the versions suffix to custom dbName only - this is used while creating blocks / selects / arrays / etc */
  versionsCustomName?: boolean
}

/**
 * Used to name database enums and tables
 * Returns the table or enum name for a given entity
 */
export const createTableName = ({
  adapter,
  config: { name, slug },
  config,
  parentTableName,
  prefix = '',
  target = 'dbName',
  throwValidationError = false,
  versions = false,
  versionsCustomName = false,
}: Args): string => {
  let customNameDefinition = config[target]

  let defaultTableName = `${prefix}${toSnakeCase(name ?? slug)}`

  if (versions) {
    defaultTableName = `_${defaultTableName}${adapter.versionsSuffix}`
  }

  let customTableNameResult: string

  if (!customNameDefinition && target === 'enumName') {
    customNameDefinition = config['dbName']
  }

  if (customNameDefinition) {
    customTableNameResult =
      typeof customNameDefinition === 'function'
        ? customNameDefinition({ tableName: parentTableName })
        : customNameDefinition

    if (versionsCustomName) {
      customTableNameResult = `_${customTableNameResult}${adapter.versionsSuffix}`
    }
  }

  const result = customTableNameResult || defaultTableName

  adapter.tableNameMap.set(defaultTableName, result)

  if (!throwValidationError) {
    return result
  }

  if (result.length > 63) {
    throw new APIError(
      `Exceeded max identifier length for table or enum name of 63 characters. Invalid name: ${result}.
Tip: You can use the dbName property to reduce the table name length.
      `,
    )
  }

  return result
}
```

--------------------------------------------------------------------------------

---[FILE: createVersion.ts]---
Location: payload-main/packages/drizzle/src/createVersion.ts

```typescript
import type { CreateVersionArgs, JsonObject, TypeWithVersion } from 'payload'

import { sql } from 'drizzle-orm'
import { buildVersionCollectionFields } from 'payload'
import { hasDraftsEnabled } from 'payload/shared'
import toSnakeCase from 'to-snake-case'

import type { DrizzleAdapter } from './types.js'

import { upsertRow } from './upsertRow/index.js'
import { getTransaction } from './utilities/getTransaction.js'

export async function createVersion<T extends JsonObject = JsonObject>(
  this: DrizzleAdapter,
  {
    autosave,
    collectionSlug,
    createdAt,
    parent,
    publishedLocale,
    req,
    returning,
    select,
    snapshot,
    updatedAt,
    versionData,
  }: CreateVersionArgs<T>,
): Promise<TypeWithVersion<T>> {
  const collection = this.payload.collections[collectionSlug].config
  const defaultTableName = toSnakeCase(collection.slug)

  const tableName = this.tableNameMap.get(`_${defaultTableName}${this.versionsSuffix}`)

  const version = { ...versionData }
  if (version.id) {
    delete version.id
  }

  const data: Record<string, unknown> = {
    autosave,
    createdAt,
    latest: true,
    parent,
    publishedLocale,
    snapshot,
    updatedAt,
    version,
  }

  const db = await getTransaction(this, req)

  const result = await upsertRow<TypeWithVersion<T>>({
    adapter: this,
    data,
    db,
    fields: buildVersionCollectionFields(this.payload.config, collection, true),
    operation: 'create',
    req,
    select,
    tableName,
  })

  const table = this.tables[tableName]

  if (hasDraftsEnabled(collection)) {
    await this.execute({
      db,
      sql: sql`
        UPDATE ${table}
        SET latest = false
        WHERE ${table.id} != ${result.id}
          AND ${table.parent} = ${parent}
          AND ${table.updatedAt} < ${result.updatedAt}
      `,
    })
  }

  if (returning === false) {
    return null
  }

  return result
}
```

--------------------------------------------------------------------------------

---[FILE: deleteMany.ts]---
Location: payload-main/packages/drizzle/src/deleteMany.ts

```typescript
import type { DeleteMany } from 'payload'

import { inArray } from 'drizzle-orm'
import toSnakeCase from 'to-snake-case'

import type { DrizzleAdapter } from './types.js'

import { findMany } from './find/findMany.js'
import { buildQuery } from './queries/buildQuery.js'
import { getTransaction } from './utilities/getTransaction.js'

export const deleteMany: DeleteMany = async function deleteMany(
  this: DrizzleAdapter,
  { collection, req, where: whereArg },
) {
  const collectionConfig = this.payload.collections[collection].config

  const tableName = this.tableNameMap.get(toSnakeCase(collectionConfig.slug))

  const table = this.tables[tableName]

  const { joins, where } = buildQuery({
    adapter: this,
    fields: collectionConfig.flattenedFields,
    locale: req?.locale,
    tableName,
    where: whereArg,
  })

  let whereToUse = where

  if (joins?.length) {
    // Difficult to support joins (through where referencing other tables) in deleteMany. => 2 separate queries.
    // We can look into supporting this using one single query (through a subquery) in the future, though that's difficult to do in a generic way.
    const result = await findMany({
      adapter: this,
      fields: collectionConfig.flattenedFields,
      joins: false,
      limit: 0,
      locale: req?.locale,
      page: 1,
      pagination: false,
      req,
      select: {
        id: true,
      },
      tableName,
      where: whereArg,
    })

    whereToUse = inArray(
      table.id,
      result.docs.map((doc) => doc.id),
    )
  }

  const db = await getTransaction(this, req)

  await this.deleteWhere({
    db,
    tableName,
    where: whereToUse,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: deleteOne.ts]---
Location: payload-main/packages/drizzle/src/deleteOne.ts

```typescript
import type { DeleteOne } from 'payload'

import { eq } from 'drizzle-orm'
import toSnakeCase from 'to-snake-case'

import type { DrizzleAdapter } from './types.js'

import { buildFindManyArgs } from './find/buildFindManyArgs.js'
import { buildQuery } from './queries/buildQuery.js'
import { selectDistinct } from './queries/selectDistinct.js'
import { transform } from './transform/read/index.js'
import { getTransaction } from './utilities/getTransaction.js'

export const deleteOne: DeleteOne = async function deleteOne(
  this: DrizzleAdapter,
  { collection: collectionSlug, req, returning, select, where: whereArg },
) {
  const collection = this.payload.collections[collectionSlug].config

  const tableName = this.tableNameMap.get(toSnakeCase(collection.slug))

  let docToDelete: Record<string, unknown>

  const { joins, selectFields, where } = buildQuery({
    adapter: this,
    fields: collection.flattenedFields,
    locale: req?.locale,
    tableName,
    where: whereArg,
  })

  const db = await getTransaction(this, req)

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
    docToDelete = await db.query[tableName].findFirst({
      where: eq(this.tables[tableName].id, selectDistinctResult[0].id),
    })
  } else {
    const findManyArgs = buildFindManyArgs({
      adapter: this,
      depth: 0,
      fields: collection.flattenedFields,
      joinQuery: false,
      select,
      tableName,
    })

    findManyArgs.where = where

    docToDelete = await db.query[tableName].findFirst(findManyArgs)
  }

  if (!docToDelete) {
    return null
  }

  const result =
    returning === false
      ? null
      : transform({
          adapter: this,
          config: this.payload.config,
          data: docToDelete,
          fields: collection.flattenedFields,
          joinQuery: false,
          tableName,
        })

  await this.deleteWhere({
    db,
    tableName,
    where: eq(this.tables[tableName].id, docToDelete.id),
  })

  return result
}
```

--------------------------------------------------------------------------------

---[FILE: deleteVersions.ts]---
Location: payload-main/packages/drizzle/src/deleteVersions.ts

```typescript
import type { DeleteVersions, FlattenedField, SanitizedCollectionConfig } from 'payload'

import { inArray } from 'drizzle-orm'
import { APIError, buildVersionCollectionFields, buildVersionGlobalFields } from 'payload'
import toSnakeCase from 'to-snake-case'

import type { DrizzleAdapter } from './types.js'

import { findMany } from './find/findMany.js'
import { getTransaction } from './utilities/getTransaction.js'

export const deleteVersions: DeleteVersions = async function deleteVersion(
  this: DrizzleAdapter,
  { collection: collectionSlug, globalSlug, locale, req, where: where },
) {
  let tableName: string
  let fields: FlattenedField[]

  if (globalSlug) {
    const globalConfig = this.payload.globals.config.find(({ slug }) => slug === globalSlug)
    tableName = this.tableNameMap.get(`_${toSnakeCase(globalSlug)}${this.versionsSuffix}`)
    fields = buildVersionGlobalFields(this.payload.config, globalConfig, true)
  } else if (collectionSlug) {
    const collectionConfig: SanitizedCollectionConfig =
      this.payload.collections[collectionSlug].config
    tableName = this.tableNameMap.get(
      `_${toSnakeCase(collectionConfig.slug)}${this.versionsSuffix}`,
    )
    fields = buildVersionCollectionFields(this.payload.config, collectionConfig, true)
  } else {
    throw new APIError('Either collection or globalSlug must be passed.')
  }

  const { docs } = await findMany({
    adapter: this,
    fields,
    joins: false,
    limit: 0,
    locale,
    page: 1,
    pagination: false,
    req,
    tableName,
    where,
  })

  const ids = []

  docs.forEach((doc) => {
    ids.push(doc.id)
  })

  if (ids.length > 0) {
    const db = await getTransaction(this, req)

    await this.deleteWhere({
      db,
      tableName,
      where: inArray(this.tables[tableName].id, ids),
    })
  }

  return docs
}
```

--------------------------------------------------------------------------------

---[FILE: destroy.ts]---
Location: payload-main/packages/drizzle/src/destroy.ts

```typescript
import type { Destroy } from 'payload'

import type { DrizzleAdapter } from './types.js'

// eslint-disable-next-line @typescript-eslint/require-await
export const destroy: Destroy = async function destroy(this: DrizzleAdapter) {
  if (this.enums) {
    this.enums = {}
  }
  this.schema = {}
  this.tables = {}
  this.relations = {}
  this.fieldConstraints = {}
  this.drizzle = undefined
  this.initializing = new Promise((res, rej) => {
    this.resolveInitializing = res
    this.rejectInitializing = rej
  })
}
```

--------------------------------------------------------------------------------

---[FILE: find.ts]---
Location: payload-main/packages/drizzle/src/find.ts

```typescript
import type { Find, SanitizedCollectionConfig } from 'payload'

import toSnakeCase from 'to-snake-case'

import type { DrizzleAdapter } from './types.js'

import { findMany } from './find/findMany.js'

export const find: Find = async function find(
  this: DrizzleAdapter,
  {
    collection,
    draftsEnabled,
    joins,
    limit,
    locale,
    page = 1,
    pagination,
    req,
    select,
    sort: sortArg,
    where,
  },
) {
  const collectionConfig: SanitizedCollectionConfig = this.payload.collections[collection].config
  const sort = sortArg !== undefined && sortArg !== null ? sortArg : collectionConfig.defaultSort

  const tableName = this.tableNameMap.get(toSnakeCase(collectionConfig.slug))

  return findMany({
    adapter: this,
    collectionSlug: collectionConfig.slug,
    draftsEnabled,
    fields: collectionConfig.flattenedFields,
    joins,
    limit,
    locale,
    page,
    pagination,
    req,
    select,
    sort,
    tableName,
    where,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: findDistinct.ts]---
Location: payload-main/packages/drizzle/src/findDistinct.ts

```typescript
import { type FindDistinct, getFieldByPath, type SanitizedCollectionConfig } from 'payload'
import toSnakeCase from 'to-snake-case'

import type { DrizzleAdapter, GenericColumn } from './types.js'

import { buildQuery } from './queries/buildQuery.js'
import { selectDistinct } from './queries/selectDistinct.js'
import { getTransaction } from './utilities/getTransaction.js'
import { DistinctSymbol } from './utilities/rawConstraint.js'

export const findDistinct: FindDistinct = async function (this: DrizzleAdapter, args) {
  const collectionConfig: SanitizedCollectionConfig =
    this.payload.collections[args.collection].config
  const page = args.page || 1
  const offset = args.limit ? (page - 1) * args.limit : undefined
  const tableName = this.tableNameMap.get(toSnakeCase(collectionConfig.slug))

  const { joins, orderBy, selectFields, where } = buildQuery({
    adapter: this,
    fields: collectionConfig.flattenedFields,
    locale: args.locale,
    sort: args.sort ?? args.field,
    tableName,
    where: {
      and: [
        args.where ?? {},
        {
          [args.field]: {
            equals: DistinctSymbol,
          },
        },
      ],
    },
  })

  orderBy.pop()

  const db = await getTransaction(this, args.req)

  const selectDistinctResult = await selectDistinct({
    adapter: this,
    db,
    forceRun: true,
    joins,
    query: ({ query }) => {
      query = query.orderBy(() => orderBy.map(({ column, order }) => order(column)))

      if (args.limit) {
        if (offset) {
          query = query.offset(offset)
        }

        query = query.limit(args.limit)
      }

      return query
    },
    selectFields: {
      _selected: selectFields['_selected'],
      ...(orderBy.length &&
        (orderBy[0].column === selectFields['_selected'] ? {} : { _order: orderBy[0]?.column })),
    } as Record<string, GenericColumn>,
    tableName,
    where,
  })

  const field = getFieldByPath({
    config: this.payload.config,
    fields: collectionConfig.flattenedFields,
    includeRelationships: true,
    path: args.field,
  })?.field

  if (field && 'relationTo' in field && Array.isArray(field.relationTo)) {
    for (const row of selectDistinctResult as any) {
      const json = JSON.parse(row._selected)
      const relationTo = Object.keys(json).find((each) => Boolean(json[each]))
      const value = json[relationTo]

      if (!value) {
        row._selected = null
      } else {
        row._selected = { relationTo, value }
      }
    }
  }

  const values = selectDistinctResult.map((each) => ({
    [args.field]: (each as Record<string, any>)._selected,
  }))

  if (args.limit) {
    const totalDocs = await this.countDistinct({
      column: selectFields['_selected'],
      db,
      joins,
      tableName,
      where,
    })

    const totalPages = Math.ceil(totalDocs / args.limit)
    const hasPrevPage = page > 1
    const hasNextPage = totalPages > page
    const pagingCounter = (page - 1) * args.limit + 1

    return {
      hasNextPage,
      hasPrevPage,
      limit: args.limit,
      nextPage: hasNextPage ? page + 1 : null,
      page,
      pagingCounter,
      prevPage: hasPrevPage ? page - 1 : null,
      totalDocs,
      totalPages,
      values,
    }
  }

  return {
    hasNextPage: false,
    hasPrevPage: false,
    limit: 0,
    page: 1,
    pagingCounter: 1,
    totalDocs: values.length,
    totalPages: 1,
    values,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: findGlobal.ts]---
Location: payload-main/packages/drizzle/src/findGlobal.ts

```typescript
import type { FindGlobal } from 'payload'

import toSnakeCase from 'to-snake-case'

import type { DrizzleAdapter } from './types.js'

import { findMany } from './find/findMany.js'

export const findGlobal: FindGlobal = async function findGlobal(
  this: DrizzleAdapter,
  { slug, locale, req, select, where },
) {
  const globalConfig = this.payload.globals.config.find((config) => config.slug === slug)

  const tableName = this.tableNameMap.get(toSnakeCase(globalConfig.slug))

  const {
    docs: [doc],
  } = await findMany({
    adapter: this,
    fields: globalConfig.flattenedFields,
    limit: 1,
    locale,
    pagination: false,
    req,
    select,
    tableName,
    where,
  })

  if (doc) {
    doc.globalType = slug
    return doc
  }

  return {}
}
```

--------------------------------------------------------------------------------

---[FILE: findGlobalVersions.ts]---
Location: payload-main/packages/drizzle/src/findGlobalVersions.ts

```typescript
import type { FindGlobalVersions, SanitizedGlobalConfig } from 'payload'

import { buildVersionGlobalFields } from 'payload'
import toSnakeCase from 'to-snake-case'

import type { DrizzleAdapter } from './types.js'

import { findMany } from './find/findMany.js'

export const findGlobalVersions: FindGlobalVersions = async function findGlobalVersions(
  this: DrizzleAdapter,
  { global, limit, locale, page, pagination, req, select, skip, sort: sortArg, where },
) {
  const globalConfig: SanitizedGlobalConfig = this.payload.globals.config.find(
    ({ slug }) => slug === global,
  )
  const sort = sortArg !== undefined && sortArg !== null ? sortArg : '-createdAt'

  const tableName = this.tableNameMap.get(
    `_${toSnakeCase(globalConfig.slug)}${this.versionsSuffix}`,
  )

  const fields = buildVersionGlobalFields(this.payload.config, globalConfig, true)

  return findMany({
    adapter: this,
    fields,
    limit,
    locale,
    page,
    pagination,
    req,
    select,
    skip,
    sort,
    tableName,
    where,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: findOne.ts]---
Location: payload-main/packages/drizzle/src/findOne.ts

```typescript
import type { FindOneArgs, SanitizedCollectionConfig, TypeWithID } from 'payload'

import toSnakeCase from 'to-snake-case'

import type { DrizzleAdapter } from './types.js'

import { findMany } from './find/findMany.js'

export async function findOne<T extends TypeWithID>(
  this: DrizzleAdapter,
  { collection, draftsEnabled, joins, locale, req, select, where }: FindOneArgs,
): Promise<null | T> {
  const collectionConfig: SanitizedCollectionConfig = this.payload.collections[collection].config

  const tableName = this.tableNameMap.get(toSnakeCase(collectionConfig.slug))

  const { docs } = await findMany({
    adapter: this,
    collectionSlug: collection,
    draftsEnabled,
    fields: collectionConfig.flattenedFields,
    joins,
    limit: 1,
    locale,
    page: 1,
    pagination: false,
    req,
    select,
    sort: undefined,
    tableName,
    where,
  })

  return docs?.[0] || null
}
```

--------------------------------------------------------------------------------

---[FILE: findVersions.ts]---
Location: payload-main/packages/drizzle/src/findVersions.ts

```typescript
import type { FindVersions, SanitizedCollectionConfig } from 'payload'

import { buildVersionCollectionFields } from 'payload'
import toSnakeCase from 'to-snake-case'

import type { DrizzleAdapter } from './types.js'

import { findMany } from './find/findMany.js'

export const findVersions: FindVersions = async function findVersions(
  this: DrizzleAdapter,
  { collection, limit, locale, page, pagination, req, select, skip, sort: sortArg, where },
) {
  const collectionConfig: SanitizedCollectionConfig = this.payload.collections[collection].config
  const sort = sortArg !== undefined && sortArg !== null ? sortArg : collectionConfig.defaultSort

  const tableName = this.tableNameMap.get(
    `_${toSnakeCase(collectionConfig.slug)}${this.versionsSuffix}`,
  )

  const fields = buildVersionCollectionFields(this.payload.config, collectionConfig, true)

  return findMany({
    adapter: this,
    fields,
    joins: false,
    limit,
    locale,
    page,
    pagination,
    req,
    select,
    skip,
    sort,
    tableName,
    where,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/drizzle/src/index.ts

```typescript
export { count } from './count.js'
export { countGlobalVersions } from './countGlobalVersions.js'
export { countVersions } from './countVersions.js'
export { create } from './create.js'
export { createGlobal } from './createGlobal.js'
export { createGlobalVersion } from './createGlobalVersion.js'
export { createTableName } from './createTableName.js'
export { createVersion } from './createVersion.js'
export { deleteMany } from './deleteMany.js'
export { deleteOne } from './deleteOne.js'
export { deleteVersions } from './deleteVersions.js'
export { destroy } from './destroy.js'
export { find } from './find.js'
export { chainMethods } from './find/chainMethods.js'
export { findDistinct } from './findDistinct.js'
export { findGlobal } from './findGlobal.js'
export { findGlobalVersions } from './findGlobalVersions.js'
export { findOne } from './findOne.js'
export { findVersions } from './findVersions.js'
export { migrate } from './migrate.js'
export { migrateDown } from './migrateDown.js'
export { migrateFresh } from './migrateFresh.js'
export { migrateRefresh } from './migrateRefresh.js'
export { migrateReset } from './migrateReset.js'
export { migrateStatus } from './migrateStatus.js'
export { buildQuery } from './queries/buildQuery.js'
export { operatorMap } from './queries/operatorMap.js'
export type { Operators } from './queries/operatorMap.js'
export { parseParams } from './queries/parseParams.js'
export { queryDrafts } from './queryDrafts.js'
export { buildDrizzleRelations } from './schema/buildDrizzleRelations.js'
export { buildRawSchema } from './schema/buildRawSchema.js'
export { beginTransaction } from './transactions/beginTransaction.js'
export { commitTransaction } from './transactions/commitTransaction.js'
export { rollbackTransaction } from './transactions/rollbackTransaction.js'
export type {
  BaseRawColumn,
  BuildDrizzleTable,
  BuildQueryJoinAliases,
  ChainedMethods,
  ColumnToCodeConverter,
  CountDistinct,
  CreateJSONQueryArgs,
  DeleteWhere,
  DrizzleAdapter,
  DrizzleTransaction,
  DropDatabase,
  EnumRawColumn,
  Execute,
  GenericColumn,
  GenericColumns,
  GenericPgColumn,
  GenericRelation,
  GenericTable,
  IDType,
  Insert,
  IntegerRawColumn,
  Migration,
  PostgresDB,
  RawColumn,
  RawForeignKey,
  RawIndex,
  RawRelation,
  RawTable,
  RelationMap,
  RequireDrizzleKit,
  SetColumnID,
  SQLiteDB,
  TimestampRawColumn,
  TransactionPg,
  TransactionSQLite,
  UUIDRawColumn,
  VectorRawColumn,
} from './types.js'
export { updateGlobal } from './updateGlobal.js'
export { updateGlobalVersion } from './updateGlobalVersion.js'
export { updateJobs } from './updateJobs.js'
export { updateMany } from './updateMany.js'
export { updateOne } from './updateOne.js'
export { updateVersion } from './updateVersion.js'
export { upsert } from './upsert.js'
export { upsertRow } from './upsertRow/index.js'
export { buildCreateMigration } from './utilities/buildCreateMigration.js'
export { buildIndexName } from './utilities/buildIndexName.js'
export { createSchemaGenerator } from './utilities/createSchemaGenerator.js'
export { executeSchemaHooks } from './utilities/executeSchemaHooks.js'
export { extendDrizzleTable } from './utilities/extendDrizzleTable.js'
export { hasLocalesTable } from './utilities/hasLocalesTable.js'
export { pushDevSchema } from './utilities/pushDevSchema.js'
export { validateExistingBlockIsIdentical } from './utilities/validateExistingBlockIsIdentical.js'
import { findMigrationDir as payloadFindMigrationDir } from 'payload'

/**
 * @deprecated remove in 4.0
 * use
 * ```ts
 * import { findMigrationDir } from 'payload'
 * ```
 */
export const findMigrationDir = payloadFindMigrationDir
```

--------------------------------------------------------------------------------

---[FILE: migrate.ts]---
Location: payload-main/packages/drizzle/src/migrate.ts

```typescript
import type { Payload } from 'payload'

import {
  commitTransaction,
  createLocalReq,
  initTransaction,
  killTransaction,
  readMigrationFiles,
} from 'payload'
import prompts from 'prompts'

import type { DrizzleAdapter, Migration } from './types.js'

import { getTransaction } from './utilities/getTransaction.js'
import { migrationTableExists } from './utilities/migrationTableExists.js'
import { parseError } from './utilities/parseError.js'

export const migrate: DrizzleAdapter['migrate'] = async function migrate(
  this: DrizzleAdapter,
  args,
): Promise<void> {
  const { payload } = this
  const migrationFiles = args?.migrations || (await readMigrationFiles({ payload }))

  if (!migrationFiles.length) {
    payload.logger.info({ msg: 'No migrations to run.' })
    return
  }

  if ('createExtensions' in this && typeof this.createExtensions === 'function') {
    await this.createExtensions()
  }

  let latestBatch = 0
  let migrationsInDB = []

  const hasMigrationTable = await migrationTableExists(this)

  if (hasMigrationTable) {
    ;({ docs: migrationsInDB } = await payload.find({
      collection: 'payload-migrations',
      limit: 0,
      sort: '-name',
    }))

    if (migrationsInDB.find((m) => m.batch === -1)) {
      const { confirm: runMigrations } = await prompts(
        {
          name: 'confirm',
          type: 'confirm',
          initial: false,
          message:
            "It looks like you've run Payload in dev mode, meaning you've dynamically pushed changes to your database.\n\n" +
            "If you'd like to run migrations, data loss will occur. Would you like to proceed?",
        },
        {
          onCancel: () => {
            process.exit(0)
          },
        },
      )

      if (!runMigrations) {
        process.exit(0)
      }
      // ignore the dev migration so that the latest batch number increments correctly
      migrationsInDB = migrationsInDB.filter((m) => m.batch !== -1)
    }

    if (Number(migrationsInDB?.[0]?.batch) > 0) {
      latestBatch = Number(migrationsInDB[0]?.batch)
    }
  }

  const newBatch = latestBatch + 1

  // Execute 'up' function for each migration sequentially
  for (const migration of migrationFiles) {
    const alreadyRan = migrationsInDB.find((existing) => existing.name === migration.name)

    // If already ran, skip
    if (alreadyRan) {
      continue
    }

    await runMigrationFile(payload, migration, newBatch)
  }
}

async function runMigrationFile(payload: Payload, migration: Migration, batch: number) {
  const start = Date.now()
  const req = await createLocalReq({}, payload)

  payload.logger.info({ msg: `Migrating: ${migration.name}` })

  try {
    await initTransaction(req)
    const db = await getTransaction(payload.db as DrizzleAdapter, req)
    await migration.up({ db, payload, req })
    payload.logger.info({ msg: `Migrated:  ${migration.name} (${Date.now() - start}ms)` })
    await payload.create({
      collection: 'payload-migrations',
      data: {
        name: migration.name,
        batch,
      },
      req,
    })
    await commitTransaction(req)
  } catch (err: unknown) {
    await killTransaction(req)
    payload.logger.error({
      err,
      msg: parseError(err, `Error running migration ${migration.name}`),
    })
    process.exit(1)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: migrateDown.ts]---
Location: payload-main/packages/drizzle/src/migrateDown.ts

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

export async function migrateDown(this: DrizzleAdapter): Promise<void> {
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

  const latestBatchMigrations = existingMigrations.filter(({ batch }) => batch === latestBatch)

  for (const migration of latestBatchMigrations) {
    const migrationFile = migrationFiles.find((m) => m.name === migration.name)
    if (!migrationFile) {
      throw new Error(`Migration ${migration.name} not found locally.`)
    }

    const start = Date.now()
    const req = await createLocalReq({}, payload)

    try {
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
      await killTransaction(req)

      payload.logger.error({
        err,
        msg: parseError(err, `Error migrating down ${migrationFile.name}. Rolling back.`),
      })
      process.exit(1)
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: migrateFresh.ts]---
Location: payload-main/packages/drizzle/src/migrateFresh.ts

```typescript
import {
  commitTransaction,
  createLocalReq,
  initTransaction,
  killTransaction,
  readMigrationFiles,
} from 'payload'
import prompts from 'prompts'

import type { DrizzleAdapter } from './types.js'

import { getTransaction } from './utilities/getTransaction.js'
import { parseError } from './utilities/parseError.js'

/**
 * Drop the current database and run all migrate up functions
 */
export async function migrateFresh(
  this: DrizzleAdapter,
  { forceAcceptWarning = false },
): Promise<void> {
  const { payload } = this

  if (forceAcceptWarning === false) {
    const { confirm: acceptWarning } = await prompts(
      {
        name: 'confirm',
        type: 'confirm',
        initial: false,
        message: `WARNING: This will drop your database and run all migrations. Are you sure you want to proceed?`,
      },
      {
        onCancel: () => {
          process.exit(0)
        },
      },
    )

    if (!acceptWarning) {
      process.exit(0)
    }
  }

  payload.logger.info({
    msg: `Dropping database.`,
  })

  await this.dropDatabase({ adapter: this })

  const migrationFiles = await readMigrationFiles({ payload })
  payload.logger.debug({
    msg: `Found ${migrationFiles.length} migration files.`,
  })

  const req = await createLocalReq({}, payload)

  if ('createExtensions' in this && typeof this.createExtensions === 'function') {
    await this.createExtensions()
  }

  // Run all migrate up
  for (const migration of migrationFiles) {
    payload.logger.info({ msg: `Migrating: ${migration.name}` })
    try {
      const start = Date.now()
      await initTransaction(req)
      const db = await getTransaction(this, req)
      await migration.up({ db, payload, req })
      await payload.create({
        collection: 'payload-migrations',
        data: {
          name: migration.name,
          batch: 1,
        },
        req,
      })
      await commitTransaction(req)

      payload.logger.info({ msg: `Migrated:  ${migration.name} (${Date.now() - start}ms)` })
    } catch (err: unknown) {
      await killTransaction(req)
      payload.logger.error({
        err,
        msg: parseError(err, `Error running migration ${migration.name}. Rolling back`),
      })
      process.exit(1)
    }
  }
}
```

--------------------------------------------------------------------------------

````
