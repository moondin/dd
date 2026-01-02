---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 124
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 124 of 695)

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

---[FILE: destroy.ts]---
Location: payload-main/packages/db-mongodb/src/destroy.ts

```typescript
import type { Destroy } from 'payload'

import type { MongooseAdapter } from './index.js'

export const destroy: Destroy = async function destroy(this: MongooseAdapter) {
  await this.connection.close()

  for (const name of Object.keys(this.connection.models)) {
    this.connection.deleteModel(name)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: find.ts]---
Location: payload-main/packages/db-mongodb/src/find.ts

```typescript
import type { PaginateOptions, PipelineStage } from 'mongoose'
import type { Find } from 'payload'

import { flattenWhereToOperators } from 'payload'

import type { MongooseAdapter } from './index.js'

import { buildQuery } from './queries/buildQuery.js'
import { buildSortParam } from './queries/buildSortParam.js'
import { aggregatePaginate } from './utilities/aggregatePaginate.js'
import { buildJoinAggregation } from './utilities/buildJoinAggregation.js'
import { buildProjectionFromSelect } from './utilities/buildProjectionFromSelect.js'
import { getCollection } from './utilities/getEntity.js'
import { getSession } from './utilities/getSession.js'
import { resolveJoins } from './utilities/resolveJoins.js'
import { transform } from './utilities/transform.js'

export const find: Find = async function find(
  this: MongooseAdapter,
  {
    collection: collectionSlug,
    draftsEnabled,
    joins = {},
    limit = 0,
    locale,
    page,
    pagination,
    projection,
    req,
    select,
    sort: sortArg,
    where = {},
  },
) {
  const { collectionConfig, Model } = getCollection({ adapter: this, collectionSlug })

  let hasNearConstraint = false

  if (where) {
    const constraints = flattenWhereToOperators(where)
    hasNearConstraint = constraints.some((prop) => Object.keys(prop).some((key) => key === 'near'))
  }

  const sortAggregation: PipelineStage[] = []

  let sort
  if (!hasNearConstraint) {
    sort = buildSortParam({
      adapter: this,
      config: this.payload.config,
      fields: collectionConfig.flattenedFields,
      locale,
      sort: sortArg || collectionConfig.defaultSort,
      sortAggregation,
      timestamps: collectionConfig.timestamps || false,
    })
  }

  const query = await buildQuery({
    adapter: this,
    collectionSlug,
    fields: collectionConfig.flattenedFields,
    locale,
    where,
  })

  const session = await getSession(this, req)

  // useEstimatedCount is faster, but not accurate, as it ignores any filters. It is thus set to true if there are no filters.
  const useEstimatedCount = hasNearConstraint || !query || Object.keys(query).length === 0
  const paginationOptions: PaginateOptions = {
    lean: true,
    leanWithId: true,
    options: {
      session,
    },
    page,
    pagination,
    projection,
    sort,
    useEstimatedCount,
  }

  if (select) {
    paginationOptions.projection = buildProjectionFromSelect({
      adapter: this,
      fields: collectionConfig.flattenedFields,
      select,
    })
  }

  if (this.collation) {
    const defaultLocale = 'en'
    paginationOptions.collation = {
      locale: locale && locale !== 'all' && locale !== '*' ? locale : defaultLocale,
      ...this.collation,
    }
  }

  if (!useEstimatedCount && Object.keys(query).length === 0 && this.disableIndexHints !== true) {
    // Improve the performance of the countDocuments query which is used if useEstimatedCount is set to false by adding
    // a hint. By default, if no hint is provided, MongoDB does not use an indexed field to count the returned documents,
    // which makes queries very slow. This only happens when no query (filter) is provided. If one is provided, it uses
    // the correct indexed field
    paginationOptions.useCustomCountFn = () => {
      return Promise.resolve(
        Model.countDocuments(query, {
          hint: { _id: 1 },
          session,
        }),
      )
    }
  }

  if (limit >= 0) {
    paginationOptions.limit = limit
    // limit must also be set here, it's ignored when pagination is false

    paginationOptions.options!.limit = limit

    // Disable pagination if limit is 0
    if (limit === 0) {
      paginationOptions.pagination = false
    }
  }

  let result

  const aggregate = await buildJoinAggregation({
    adapter: this,
    collection: collectionSlug,
    collectionConfig,
    draftsEnabled,
    joins,
    locale,
    query,
  })

  if (aggregate || sortAggregation.length > 0) {
    result = await aggregatePaginate({
      adapter: this,
      collation: paginationOptions.collation,
      joinAggregation: aggregate,
      limit: paginationOptions.limit,
      Model,
      page: paginationOptions.page,
      pagination: paginationOptions.pagination,
      projection: paginationOptions.projection,
      query,
      session: paginationOptions.options?.session ?? undefined,
      sort: paginationOptions.sort as object,
      sortAggregation,
      useEstimatedCount: paginationOptions.useEstimatedCount,
    })
  } else {
    result = await Model.paginate(query, paginationOptions)
  }

  if (!this.useJoinAggregations) {
    await resolveJoins({
      adapter: this,
      collectionSlug,
      docs: result.docs as Record<string, unknown>[],
      joins,
      locale,
    })
  }

  transform({
    adapter: this,
    data: result.docs,
    fields: collectionConfig.fields,
    operation: 'read',
  })

  return result
}
```

--------------------------------------------------------------------------------

---[FILE: findDistinct.ts]---
Location: payload-main/packages/db-mongodb/src/findDistinct.ts

```typescript
import type { PipelineStage } from 'mongoose'
import type { FindDistinct, FlattenedField } from 'payload'

import { getFieldByPath } from 'payload'

import type { MongooseAdapter } from './index.js'

import { buildQuery } from './queries/buildQuery.js'
import { buildSortParam } from './queries/buildSortParam.js'
import { getCollection } from './utilities/getEntity.js'
import { getSession } from './utilities/getSession.js'

export const findDistinct: FindDistinct = async function (this: MongooseAdapter, args) {
  const { collectionConfig, Model } = getCollection({
    adapter: this,
    collectionSlug: args.collection,
  })

  const { where = {} } = args

  let sortAggregation: PipelineStage[] = []

  const sort = buildSortParam({
    adapter: this,
    config: this.payload.config,
    fields: collectionConfig.flattenedFields,
    locale: args.locale,
    sort: args.sort ?? args.field,
    sortAggregation,
    timestamps: true,
  })

  const query = await buildQuery({
    adapter: this,
    collectionSlug: args.collection,
    fields: collectionConfig.flattenedFields,
    locale: args.locale,
    where,
  })

  const fieldPathResult = getFieldByPath({
    config: this.payload.config,
    fields: collectionConfig.flattenedFields,
    includeRelationships: true,
    path: args.field,
  })
  let fieldPath = args.field
  if (fieldPathResult?.pathHasLocalized && args.locale) {
    fieldPath = fieldPathResult.localizedPath.replace('<locale>', args.locale)
  }

  const page = args.page || 1

  let sortProperty = Object.keys(sort)[0]! // assert because buildSortParam always returns at least 1 key.
  const sortDirection = sort[sortProperty] === 'asc' ? 1 : -1

  let currentFields = collectionConfig.flattenedFields
  let foundField: FlattenedField | null = null

  let rels: {
    fieldPath: string
    relationTo: string
  }[] = []

  let tempPath = ''
  let insideRelation = false

  const segments = args.field.split('.')

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    const field = currentFields.find((e) => e.name === segment)
    if (rels.length) {
      insideRelation = true
    }

    if (!field) {
      break
    }

    if (tempPath) {
      tempPath = `${tempPath}.${field.name}`
    } else {
      tempPath = field.name
    }

    if ('flattenedFields' in field) {
      currentFields = field.flattenedFields
      continue
    }

    if (
      (field.type === 'relationship' || field.type === 'upload') &&
      typeof field.relationTo === 'string'
    ) {
      if (i === segments.length - 2 && segments[i + 1] === 'id') {
        foundField = field
        fieldPath = tempPath
        break
      }
      rels.push({ fieldPath: tempPath, relationTo: field.relationTo })
      currentFields = this.payload.collections[field.relationTo]?.config
        .flattenedFields as FlattenedField[]
      continue
    }
    foundField = field
  }

  const resolvedField = foundField || fieldPathResult?.field
  const isHasManyValue = resolvedField && 'hasMany' in resolvedField && resolvedField

  let relationLookup: null | PipelineStage[] = null

  if (!insideRelation) {
    rels = []
  }

  if (rels.length) {
    if (sortProperty.startsWith('_')) {
      const sortWithoutRelationPrefix = sortProperty.replace(/^_+/, '')
      const lastFieldPath = rels.at(-1)?.fieldPath as string
      if (sortWithoutRelationPrefix.startsWith(lastFieldPath)) {
        sortProperty = sortWithoutRelationPrefix
      }
    }
    relationLookup = rels.reduce<PipelineStage[]>((acc, { fieldPath, relationTo }) => {
      sortAggregation = sortAggregation.filter((each) => {
        if ('$lookup' in each && each.$lookup.as.replace(/^_+/, '') === fieldPath) {
          return false
        }

        return true
      })
      const { Model: foreignModel } = getCollection({ adapter: this, collectionSlug: relationTo })
      acc.push({
        $lookup: {
          as: fieldPath,
          foreignField: '_id',
          from: foreignModel.collection.name,
          localField: fieldPath,
        },
      })
      acc.push({ $unwind: `$${fieldPath}` })
      return acc
    }, [])
  }

  let $unwind: any = ''
  let $group: any = null
  if (
    isHasManyValue &&
    sortAggregation.length &&
    sortAggregation[0] &&
    '$lookup' in sortAggregation[0]
  ) {
    $unwind = { path: `$${sortAggregation[0].$lookup.as}`, preserveNullAndEmptyArrays: true }
    $group = {
      _id: {
        _field: `$${sortAggregation[0].$lookup.as}._id`,
        _sort: `$${sortProperty}`,
      },
    }
  } else if (isHasManyValue) {
    $unwind = { path: `$${args.field}`, preserveNullAndEmptyArrays: true }
  }

  if (!$group) {
    $group = {
      _id: {
        _field: `$${fieldPath}`,
        ...(sortProperty === fieldPath
          ? {}
          : {
              _sort: `$${sortProperty}`,
            }),
      },
    }
  }

  const pipeline: PipelineStage[] = [
    {
      $match: query,
    },
    ...(sortAggregation.length > 0 ? sortAggregation : []),
    ...(relationLookup?.length ? relationLookup : []),
    ...($unwind
      ? [
          {
            $unwind,
          },
        ]
      : []),
    {
      $group,
    },
    {
      $sort: {
        [sortProperty === fieldPath ? '_id._field' : '_id._sort']: sortDirection,
      },
    },
  ]

  const session = await getSession(this, args.req)

  const getValues = async () => {
    return Model.aggregate(pipeline, { session }).then((res) =>
      res.map((each) => ({
        [args.field]: JSON.parse(JSON.stringify(each._id._field)),
      })),
    )
  }

  if (args.limit) {
    pipeline.push({
      $skip: (page - 1) * args.limit,
    })
    pipeline.push({ $limit: args.limit })

    // Build count pipeline with the same structure as the main pipeline
    // to ensure relationship lookups are included
    const countPipeline: PipelineStage[] = [
      {
        $match: query,
      },
      ...(sortAggregation.length > 0 ? sortAggregation : []),
      ...(relationLookup?.length ? relationLookup : []),
      ...($unwind
        ? [
            {
              $unwind,
            },
          ]
        : []),
      {
        $group,
      },
      { $count: 'count' },
    ]

    const totalDocs = await Model.aggregate(countPipeline, {
      session,
    }).then((res) => res[0]?.count ?? 0)
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
      values: await getValues(),
    }
  }

  const values = await getValues()

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
Location: payload-main/packages/db-mongodb/src/findGlobal.ts

```typescript
import type { QueryOptions } from 'mongoose'
import type { FindGlobal } from 'payload'

import { combineQueries } from 'payload'

import type { MongooseAdapter } from './index.js'

import { buildQuery } from './queries/buildQuery.js'
import { buildProjectionFromSelect } from './utilities/buildProjectionFromSelect.js'
import { getGlobal } from './utilities/getEntity.js'
import { getSession } from './utilities/getSession.js'
import { transform } from './utilities/transform.js'

export const findGlobal: FindGlobal = async function findGlobal(
  this: MongooseAdapter,
  { slug: globalSlug, locale, req, select, where = {} },
) {
  const { globalConfig, Model } = getGlobal({ adapter: this, globalSlug })

  const fields = globalConfig.flattenedFields

  const query = await buildQuery({
    adapter: this,
    fields,
    globalSlug,
    locale,
    where: combineQueries({ globalType: { equals: globalSlug } }, where),
  })

  const options: QueryOptions = {
    lean: true,
    select: buildProjectionFromSelect({
      adapter: this,
      fields,
      select,
    }),
    session: await getSession(this, req),
  }

  const doc: any = await Model.findOne(query, {}, options)

  if (!doc) {
    return null
  }

  transform({
    adapter: this,
    data: doc,
    fields: globalConfig.fields,
    operation: 'read',
  })

  return doc
}
```

--------------------------------------------------------------------------------

---[FILE: findGlobalVersions.ts]---
Location: payload-main/packages/db-mongodb/src/findGlobalVersions.ts

```typescript
import type { PaginateOptions, QueryOptions } from 'mongoose'
import type { FindGlobalVersions } from 'payload'

import { APIError, buildVersionGlobalFields, flattenWhereToOperators } from 'payload'

import type { MongooseAdapter } from './index.js'

import { buildQuery } from './queries/buildQuery.js'
import { buildSortParam } from './queries/buildSortParam.js'
import { buildProjectionFromSelect } from './utilities/buildProjectionFromSelect.js'
import { getGlobal } from './utilities/getEntity.js'
import { getSession } from './utilities/getSession.js'
import { transform } from './utilities/transform.js'

export const findGlobalVersions: FindGlobalVersions = async function findGlobalVersions(
  this: MongooseAdapter,
  {
    global: globalSlug,
    limit = 0,
    locale,
    page,
    pagination,
    req,
    select,
    skip,
    sort: sortArg,
    where = {},
  },
) {
  const { globalConfig, Model } = getGlobal({ adapter: this, globalSlug, versions: true })

  const versionFields = buildVersionGlobalFields(this.payload.config, globalConfig, true)

  let hasNearConstraint = false

  if (where) {
    const constraints = flattenWhereToOperators(where)
    hasNearConstraint = constraints.some((prop) => Object.keys(prop).some((key) => key === 'near'))
  }

  let sort
  if (!hasNearConstraint) {
    sort = buildSortParam({
      adapter: this,
      config: this.payload.config,
      fields: versionFields,
      locale,
      sort: sortArg || '-updatedAt',
      timestamps: true,
    })
  }

  const query = await buildQuery({
    adapter: this,
    fields: versionFields,
    locale,
    where,
  })

  const session = await getSession(this, req)
  const options: QueryOptions = {
    limit,
    session,
    skip,
  }

  // useEstimatedCount is faster, but not accurate, as it ignores any filters. It is thus set to true if there are no filters.
  const useEstimatedCount = hasNearConstraint || !query || Object.keys(query).length === 0
  const paginationOptions: PaginateOptions = {
    lean: true,
    leanWithId: true,
    limit,
    options,
    page,
    pagination,
    projection: buildProjectionFromSelect({ adapter: this, fields: versionFields, select }),
    sort,
    useEstimatedCount,
  }

  if (this.collation) {
    const defaultLocale = 'en'
    paginationOptions.collation = {
      locale: locale && locale !== 'all' && locale !== '*' ? locale : defaultLocale,
      ...this.collation,
    }
  }

  if (!useEstimatedCount && Object.keys(query).length === 0 && this.disableIndexHints !== true) {
    // Improve the performance of the countDocuments query which is used if useEstimatedCount is set to false by adding
    // a hint. By default, if no hint is provided, MongoDB does not use an indexed field to count the returned documents,
    // which makes queries very slow. This only happens when no query (filter) is provided. If one is provided, it uses
    // the correct indexed field
    paginationOptions.useCustomCountFn = () => {
      return Promise.resolve(
        Model.countDocuments(query, {
          hint: { _id: 1 },
          session,
        }),
      )
    }
  }

  if (limit >= 0) {
    paginationOptions.limit = limit
    // limit must also be set here, it's ignored when pagination is false

    paginationOptions.options!.limit = limit

    // Disable pagination if limit is 0
    if (limit === 0) {
      paginationOptions.pagination = false
    }
  }

  const result = await Model.paginate(query, paginationOptions)

  transform({
    adapter: this,
    data: result.docs,
    fields: buildVersionGlobalFields(this.payload.config, globalConfig),
    operation: 'read',
  })

  return result
}
```

--------------------------------------------------------------------------------

---[FILE: findOne.ts]---
Location: payload-main/packages/db-mongodb/src/findOne.ts

```typescript
import type { AggregateOptions, QueryOptions } from 'mongoose'

import { type FindOne } from 'payload'

import type { MongooseAdapter } from './index.js'

import { buildQuery } from './queries/buildQuery.js'
import { aggregatePaginate } from './utilities/aggregatePaginate.js'
import { buildJoinAggregation } from './utilities/buildJoinAggregation.js'
import { buildProjectionFromSelect } from './utilities/buildProjectionFromSelect.js'
import { getCollection } from './utilities/getEntity.js'
import { getSession } from './utilities/getSession.js'
import { resolveJoins } from './utilities/resolveJoins.js'
import { transform } from './utilities/transform.js'

export const findOne: FindOne = async function findOne(
  this: MongooseAdapter,
  { collection: collectionSlug, draftsEnabled, joins, locale, req, select, where = {} },
) {
  const { collectionConfig, Model } = getCollection({ adapter: this, collectionSlug })

  const query = await buildQuery({
    adapter: this,
    collectionSlug,
    fields: collectionConfig.flattenedFields,
    locale,
    where,
  })

  const projection = buildProjectionFromSelect({
    adapter: this,
    fields: collectionConfig.flattenedFields,
    select,
  })

  const aggregate = await buildJoinAggregation({
    adapter: this,
    collection: collectionSlug,
    collectionConfig,
    draftsEnabled,
    joins,
    locale,
    projection,
    query,
  })

  const session = await getSession(this, req)
  const options: AggregateOptions & QueryOptions = {
    lean: true,
    session,
  }

  let doc
  if (aggregate) {
    const { docs } = await aggregatePaginate({
      adapter: this,
      joinAggregation: aggregate,
      limit: 1,
      Model,
      pagination: false,
      projection,
      query,
      session,
    })
    doc = docs[0]
  } else {
    ;(options as Record<string, unknown>).projection = projection
    doc = await Model.findOne(query, {}, options)
  }

  if (doc && !this.useJoinAggregations) {
    await resolveJoins({
      adapter: this,
      collectionSlug,
      docs: [doc] as Record<string, unknown>[],
      joins,
      locale,
    })
  }

  if (!doc) {
    return null
  }

  transform({ adapter: this, data: doc, fields: collectionConfig.fields, operation: 'read' })

  return doc
}
```

--------------------------------------------------------------------------------

---[FILE: findVersions.ts]---
Location: payload-main/packages/db-mongodb/src/findVersions.ts

```typescript
import type { PaginateOptions, QueryOptions } from 'mongoose'
import type { FindVersions } from 'payload'

import { buildVersionCollectionFields, flattenWhereToOperators } from 'payload'

import type { MongooseAdapter } from './index.js'

import { buildQuery } from './queries/buildQuery.js'
import { buildSortParam } from './queries/buildSortParam.js'
import { buildProjectionFromSelect } from './utilities/buildProjectionFromSelect.js'
import { getCollection } from './utilities/getEntity.js'
import { getSession } from './utilities/getSession.js'
import { transform } from './utilities/transform.js'

export const findVersions: FindVersions = async function findVersions(
  this: MongooseAdapter,
  {
    collection: collectionSlug,
    limit = 0,
    locale,
    page,
    pagination,
    req = {},
    select,
    skip,
    sort: sortArg,
    where = {},
  },
) {
  const { collectionConfig, Model } = getCollection({
    adapter: this,
    collectionSlug,
    versions: true,
  })

  let hasNearConstraint = false

  if (where) {
    const constraints = flattenWhereToOperators(where)
    hasNearConstraint = constraints.some((prop) => Object.keys(prop).some((key) => key === 'near'))
  }

  let sort
  if (!hasNearConstraint) {
    sort = buildSortParam({
      adapter: this,
      config: this.payload.config,
      fields: collectionConfig.flattenedFields,
      locale,
      sort: sortArg || '-updatedAt',
      timestamps: true,
    })
  }

  const fields = buildVersionCollectionFields(this.payload.config, collectionConfig, true)

  const query = await buildQuery({
    adapter: this,
    fields,
    locale,
    where,
  })

  const session = await getSession(this, req)
  const options: QueryOptions = {
    limit,
    session,
    skip,
  }

  // useEstimatedCount is faster, but not accurate, as it ignores any filters. It is thus set to true if there are no filters.
  const useEstimatedCount = hasNearConstraint || !query || Object.keys(query).length === 0
  const paginationOptions: PaginateOptions = {
    lean: true,
    leanWithId: true,
    limit,
    options,
    page,
    pagination,
    projection: buildProjectionFromSelect({
      adapter: this,
      fields,
      select,
    }),
    sort,
    useEstimatedCount,
  }

  if (this.collation) {
    const defaultLocale = 'en'
    paginationOptions.collation = {
      locale: locale && locale !== 'all' && locale !== '*' ? locale : defaultLocale,
      ...this.collation,
    }
  }

  if (!useEstimatedCount && Object.keys(query).length === 0 && this.disableIndexHints !== true) {
    // Improve the performance of the countDocuments query which is used if useEstimatedCount is set to false by adding
    // a hint. By default, if no hint is provided, MongoDB does not use an indexed field to count the returned documents,
    // which makes queries very slow. This only happens when no query (filter) is provided. If one is provided, it uses
    // the correct indexed field
    paginationOptions.useCustomCountFn = () => {
      return Promise.resolve(
        Model.countDocuments(query, {
          hint: { _id: 1 },
          session,
        }),
      )
    }
  }

  if (limit >= 0) {
    paginationOptions.limit = limit
    // limit must also be set here, it's ignored when pagination is false

    paginationOptions.options!.limit = limit

    // Disable pagination if limit is 0
    if (limit === 0) {
      paginationOptions.pagination = false
    }
  }

  const result = await Model.paginate(query, paginationOptions)

  transform({
    adapter: this,
    data: result.docs,
    fields: buildVersionCollectionFields(this.payload.config, collectionConfig),
    operation: 'read',
  })

  return result
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/db-mongodb/src/index.ts

```typescript
import type { CollationOptions, TransactionOptions } from 'mongodb'
import type { MongoMemoryReplSet } from 'mongodb-memory-server'
import type {
  ClientSession,
  Connection,
  ConnectOptions,
  QueryOptions,
  SchemaOptions,
} from 'mongoose'
import type {
  BaseDatabaseAdapter,
  CollectionSlug,
  DatabaseAdapterObj,
  JsonObject,
  Payload,
  TypeWithVersion,
  UpdateGlobalArgs,
  UpdateGlobalVersionArgs,
  UpdateOneArgs,
  UpdateVersionArgs,
} from 'payload'

import mongoose from 'mongoose'
import { createDatabaseAdapter, defaultBeginTransaction, findMigrationDir } from 'payload'

import type {
  CollectionModel,
  GlobalModel,
  MigrateDownArgs,
  MigrateUpArgs,
  MongooseMigration,
} from './types.js'

import { connect } from './connect.js'
import { count } from './count.js'
import { countGlobalVersions } from './countGlobalVersions.js'
import { countVersions } from './countVersions.js'
import { create } from './create.js'
import { createGlobal } from './createGlobal.js'
import { createGlobalVersion } from './createGlobalVersion.js'
import { createMigration } from './createMigration.js'
import { createVersion } from './createVersion.js'
import { deleteMany } from './deleteMany.js'
import { deleteOne } from './deleteOne.js'
import { deleteVersions } from './deleteVersions.js'
import { destroy } from './destroy.js'
import { find } from './find.js'
import { findDistinct } from './findDistinct.js'
import { findGlobal } from './findGlobal.js'
import { findGlobalVersions } from './findGlobalVersions.js'
import { findOne } from './findOne.js'
import { findVersions } from './findVersions.js'
import { init } from './init.js'
import { migrateFresh } from './migrateFresh.js'
import { queryDrafts } from './queryDrafts.js'
import { beginTransaction } from './transactions/beginTransaction.js'
import { commitTransaction } from './transactions/commitTransaction.js'
import { rollbackTransaction } from './transactions/rollbackTransaction.js'
import { updateGlobal } from './updateGlobal.js'
import { updateGlobalVersion } from './updateGlobalVersion.js'
import { updateJobs } from './updateJobs.js'
import { updateMany } from './updateMany.js'
import { updateOne } from './updateOne.js'
import { updateVersion } from './updateVersion.js'
import { upsert } from './upsert.js'

export type { MigrateDownArgs, MigrateUpArgs } from './types.js'

export interface Args {
  afterCreateConnection?: (adapter: MongooseAdapter) => Promise<void> | void
  afterOpenConnection?: (adapter: MongooseAdapter) => Promise<void> | void
  /**
   * By default, Payload strips all additional keys from MongoDB data that don't exist
   * in the Payload schema. If you have some data that you want to include to the result
   * but it doesn't exist in Payload, you can enable this flag
   * @default false
   */
  allowAdditionalKeys?: boolean
  /**
   * Enable this flag if you want to thread your own ID to create operation data, for example:
   * ```ts
   * import { Types } from 'mongoose'
   *
   * const id = new Types.ObjectId().toHexString()
   * const doc = await payload.create({ collection: 'posts', data: {id, title: "my title"}})
   * assertEq(doc.id, id)
   * ```
   */
  allowIDOnCreate?: boolean
  /** Set to false to disable auto-pluralization of collection names, Defaults to true */
  autoPluralization?: boolean

  /**
   * If enabled, collation allows for language-specific rules for string comparison.
   * This configuration can include the following options:
   *
   * - `strength` (number): Comparison level (1: Primary, 2: Secondary, 3: Tertiary (default), 4: Quaternary, 5: Identical)
   * - `caseLevel` (boolean): Include case comparison at strength level 1 or 2.
   * - `caseFirst` (string): Sort order of case differences during tertiary level comparisons ("upper", "lower", "off").
   * - `numericOrdering` (boolean): Compare numeric strings as numbers.
   * - `alternate` (string): Consider whitespace and punctuation as base characters ("non-ignorable", "shifted").
   * - `maxVariable` (string): Characters considered ignorable when `alternate` is "shifted" ("punct", "space").
   * - `backwards` (boolean): Sort strings with diacritics from back of the string.
   * - `normalization` (boolean): Check if text requires normalization and perform normalization.
   *
   * Available on MongoDB version 3.4 and up.
   * The locale that gets passed is your current project's locale but defaults to "en".
   *
   * Example:
   * {
   *   strength: 3
   * }
   *
   * Defaults to disabled.
   */
  collation?: Omit<CollationOptions, 'locale'>

  collectionsSchemaOptions?: Partial<Record<CollectionSlug, SchemaOptions>>
  /** Extra configuration options */
  connectOptions?: {
    /**
     * Set false to disable $facet aggregation in non-supporting databases, Defaults to true
     * @deprecated Payload doesn't use `$facet` anymore anywhere.
     */
    useFacet?: boolean
  } & ConnectOptions
  /**
   * We add a secondary sort based on `createdAt` to ensure that results are always returned in the same order when sorting by a non-unique field.
   * This is because MongoDB does not guarantee the order of results, however in very large datasets this could affect performance.
   *
   * Set to `true` to disable this behaviour.
   */
  disableFallbackSort?: boolean
  /** Set to true to disable hinting to MongoDB to use 'id' as index. This is currently done when counting documents for pagination. Disabling this optimization might fix some problems with AWS DocumentDB. Defaults to false */
  disableIndexHints?: boolean
  /**
   * Set to `true` to ensure that indexes are ready before completing connection.
   * NOTE: not recommended for production. This can slow down the initialization of Payload.
   */
  ensureIndexes?: boolean
  migrationDir?: string
  /**
   * typed as any to avoid dependency
   */
  mongoMemoryServer?: MongoMemoryReplSet
  prodMigrations?: MongooseMigration[]

  transactionOptions?: false | TransactionOptions

  /** The URL to connect to MongoDB or false to start payload and prevent connecting */
  url: false | string

  /**
   * Set to `true` to use an alternative `dropDatabase` implementation that calls `collection.deleteMany({})` on every collection instead of sending a raw `dropDatabase` command.
   * Payload only uses `dropDatabase` for testing purposes.
   * @default false
   */
  useAlternativeDropDatabase?: boolean

  /**
   * Set to `true` to use `BigInt` for custom ID fields of type `'number'`.
   * Useful for databases that don't support `double` or `int32` IDs.
   * @default false
   */
  useBigIntForNumberIDs?: boolean
  /**
   * Set to `false` to disable join aggregations (which use correlated subqueries) and instead populate join fields via multiple `find` queries.
   * @default true
   */
  useJoinAggregations?: boolean
  /**
   * Set to `false` to disable the use of `pipeline` in the `$lookup` aggregation in sorting.
   * @default true
   */
  usePipelineInSortLookup?: boolean
}

export type MongooseAdapter = {
  afterCreateConnection?: (adapter: MongooseAdapter) => Promise<void> | void
  afterOpenConnection?: (adapter: MongooseAdapter) => Promise<void> | void
  collections: {
    [slug: string]: CollectionModel
  }
  connection: Connection
  ensureIndexes: boolean
  globals: GlobalModel
  mongoMemoryServer: MongoMemoryReplSet
  prodMigrations?: {
    down: (args: MigrateDownArgs) => Promise<void>
    name: string
    up: (args: MigrateUpArgs) => Promise<void>
  }[]
  sessions: Record<number | string, ClientSession>
  useAlternativeDropDatabase: boolean
  useBigIntForNumberIDs: boolean
  useJoinAggregations: boolean
  usePipelineInSortLookup: boolean
  versions: {
    [slug: string]: CollectionModel
  }
} & Args &
  BaseDatabaseAdapter

declare module 'payload' {
  export interface DatabaseAdapter
    extends Omit<BaseDatabaseAdapter, 'sessions'>,
      Omit<Args, 'migrationDir'> {
    collections: {
      [slug: string]: CollectionModel
    }
    connection: Connection
    ensureIndexes: boolean
    globals: GlobalModel
    mongoMemoryServer: MongoMemoryReplSet
    prodMigrations?: {
      down: (args: MigrateDownArgs) => Promise<void>
      name: string
      up: (args: MigrateUpArgs) => Promise<void>
    }[]
    sessions: Record<number | string, ClientSession>
    transactionOptions: TransactionOptions
    updateGlobal: <T extends Record<string, unknown>>(
      args: { options?: QueryOptions } & UpdateGlobalArgs<T>,
    ) => Promise<T>
    updateGlobalVersion: <T extends JsonObject = JsonObject>(
      args: { options?: QueryOptions } & UpdateGlobalVersionArgs<T>,
    ) => Promise<TypeWithVersion<T>>

    updateOne: (args: { options?: QueryOptions } & UpdateOneArgs) => Promise<Document>
    updateVersion: <T extends JsonObject = JsonObject>(
      args: { options?: QueryOptions } & UpdateVersionArgs<T>,
    ) => Promise<TypeWithVersion<T>>
    useAlternativeDropDatabase: boolean
    useBigIntForNumberIDs: boolean
    useJoinAggregations: boolean
    usePipelineInSortLookup: boolean
    versions: {
      [slug: string]: CollectionModel
    }
  }
}

export function mongooseAdapter({
  afterCreateConnection,
  afterOpenConnection,
  allowAdditionalKeys = false,
  allowIDOnCreate = false,
  autoPluralization = true,
  collation,
  collectionsSchemaOptions = {},
  connectOptions,
  disableFallbackSort = false,
  disableIndexHints = false,
  ensureIndexes = false,
  migrationDir: migrationDirArg,
  mongoMemoryServer,
  prodMigrations,
  transactionOptions = {},
  url,
  useAlternativeDropDatabase = false,
  useBigIntForNumberIDs = false,
  useJoinAggregations = true,
  usePipelineInSortLookup = true,
}: Args): DatabaseAdapterObj {
  function adapter({ payload }: { payload: Payload }) {
    const migrationDir = findMigrationDir(migrationDirArg)
    mongoose.set('strictQuery', false)

    return createDatabaseAdapter<MongooseAdapter>({
      name: 'mongoose',

      // Mongoose-specific
      afterCreateConnection,
      afterOpenConnection,
      autoPluralization,
      collation,
      collections: {},
      // @ts-expect-error initialize without a connection
      connection: undefined,
      connectOptions: connectOptions || {},
      disableIndexHints,
      ensureIndexes,
      // @ts-expect-error don't have globals model yet
      globals: undefined,
      // @ts-expect-error Should not be required
      mongoMemoryServer,
      sessions: {},
      transactionOptions: transactionOptions === false ? undefined : transactionOptions,
      updateJobs,
      updateMany,
      url,
      versions: {},
      // DatabaseAdapter
      allowAdditionalKeys,
      allowIDOnCreate,
      beginTransaction: transactionOptions === false ? defaultBeginTransaction() : beginTransaction,
      collectionsSchemaOptions,
      commitTransaction,
      connect,
      count,
      countGlobalVersions,
      countVersions,
      create,
      createGlobal,
      createGlobalVersion,
      createMigration,
      createVersion,
      defaultIDType: 'text',
      deleteMany,
      deleteOne,
      deleteVersions,
      destroy,
      disableFallbackSort,
      find,
      findDistinct,
      findGlobal,
      findGlobalVersions,
      findOne,
      findVersions,
      init,
      migrateFresh,
      migrationDir,
      packageName: '@payloadcms/db-mongodb',
      payload,
      prodMigrations,
      queryDrafts,
      rollbackTransaction,
      updateGlobal,
      updateGlobalVersion,
      updateOne,
      updateVersion,
      upsert,
      useAlternativeDropDatabase,
      useBigIntForNumberIDs,
      useJoinAggregations,
      usePipelineInSortLookup,
    })
  }

  return {
    name: 'mongoose',
    allowIDOnCreate,
    defaultIDType: 'text',
    init: adapter,
  }
}

export { compatibilityOptions } from './utilities/compatibilityOptions.js'
```

--------------------------------------------------------------------------------

````
