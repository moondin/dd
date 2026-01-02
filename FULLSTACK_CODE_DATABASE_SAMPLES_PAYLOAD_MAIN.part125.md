---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 125
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 125 of 695)

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
Location: payload-main/packages/db-mongodb/src/init.ts

```typescript
import type { PaginateOptions } from 'mongoose'
import type { Init, SanitizedCollectionConfig } from 'payload'

import mongoose from 'mongoose'
import paginate from 'mongoose-paginate-v2'
import {
  buildVersionCollectionFields,
  buildVersionCompoundIndexes,
  buildVersionGlobalFields,
} from 'payload'

import type { MongooseAdapter } from './index.js'
import type { CollectionModel, GlobalModel } from './types.js'

import { buildCollectionSchema } from './models/buildCollectionSchema.js'
import { buildGlobalModel } from './models/buildGlobalModel.js'
import { buildSchema } from './models/buildSchema.js'
import { getBuildQueryPlugin } from './queries/getBuildQueryPlugin.js'
import { getDBName } from './utilities/getDBName.js'

export const init: Init = async function init(this: MongooseAdapter) {
  // Always create a scoped, **unopened** connection object
  // (no URI here; models compile per-connection and do not require an open socket)
  this.connection ??= mongoose.createConnection()

  if (this.afterCreateConnection) {
    await this.afterCreateConnection(this)
  }

  this.payload.config.collections.forEach((collection: SanitizedCollectionConfig) => {
    const schemaOptions = this.collectionsSchemaOptions?.[collection.slug]

    const schema = buildCollectionSchema(collection, this.payload, schemaOptions)
    if (collection.versions) {
      const versionModelName = getDBName({ config: collection, versions: true })

      const versionCollectionFields = buildVersionCollectionFields(this.payload.config, collection)

      const versionSchema = buildSchema({
        buildSchemaOptions: {
          disableUnique: true,
          draftsEnabled: true,
          indexSortableFields: this.payload.config.indexSortableFields,
          options: {
            minimize: false,
            timestamps: false,
            ...schemaOptions,
          },
        },
        compoundIndexes: buildVersionCompoundIndexes({ indexes: collection.sanitizedIndexes }),
        configFields: versionCollectionFields,
        payload: this.payload,
      })

      versionSchema.plugin<any, PaginateOptions>(paginate, { useEstimatedCount: true }).plugin(
        getBuildQueryPlugin({
          collectionSlug: collection.slug,
          versionsFields: buildVersionCollectionFields(this.payload.config, collection, true),
        }),
      )

      const versionCollectionName =
        this.autoPluralization === true && !collection.dbName ? undefined : versionModelName

      this.versions[collection.slug] = this.connection.model(
        versionModelName,
        versionSchema,
        versionCollectionName,
      ) as unknown as CollectionModel
    }

    const modelName = getDBName({ config: collection })
    const collectionName =
      this.autoPluralization === true && !collection.dbName ? undefined : modelName

    this.collections[collection.slug] = this.connection.model<any>(
      modelName,
      schema,
      collectionName,
    ) as CollectionModel
  })

  this.globals = buildGlobalModel(this) as GlobalModel

  this.payload.config.globals.forEach((global) => {
    if (global.versions) {
      const versionModelName = getDBName({ config: global, versions: true })

      const versionGlobalFields = buildVersionGlobalFields(this.payload.config, global)

      const versionSchema = buildSchema({
        buildSchemaOptions: {
          disableUnique: true,
          draftsEnabled: true,
          indexSortableFields: this.payload.config.indexSortableFields,
          options: {
            minimize: false,
            timestamps: false,
          },
        },
        configFields: versionGlobalFields,
        payload: this.payload,
      })

      versionSchema.plugin<any, PaginateOptions>(paginate, { useEstimatedCount: true }).plugin(
        getBuildQueryPlugin({
          versionsFields: buildVersionGlobalFields(this.payload.config, global, true),
        }),
      )

      this.versions[global.slug] = this.connection.model<any>(
        versionModelName,
        versionSchema,
        versionModelName,
      ) as CollectionModel
    }
  })
}
```

--------------------------------------------------------------------------------

---[FILE: migrateFresh.ts]---
Location: payload-main/packages/db-mongodb/src/migrateFresh.ts

```typescript
import { commitTransaction, initTransaction, killTransaction, readMigrationFiles } from 'payload'
import prompts from 'prompts'

import type { MongooseAdapter } from './index.js'

/**
 * Drop the current database and run all migrate up functions
 */
export async function migrateFresh(
  this: MongooseAdapter,
  { forceAcceptWarning = false }: { forceAcceptWarning?: boolean },
): Promise<void> {
  const { payload } = this

  if (!forceAcceptWarning) {
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

  await this.connection.dropDatabase()

  const migrationFiles = await readMigrationFiles({ payload })
  payload.logger.debug({
    msg: `Found ${migrationFiles.length} migration files.`,
  })

  const req = { payload }

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
        msg: `Error running migration ${migration.name}. Rolling back.`,
      })
      throw err
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: queryDrafts.ts]---
Location: payload-main/packages/db-mongodb/src/queryDrafts.ts

```typescript
import type { PaginateOptions, PipelineStage, QueryOptions } from 'mongoose'
import type { QueryDrafts } from 'payload'

import { buildVersionCollectionFields, combineQueries, flattenWhereToOperators } from 'payload'

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

export const queryDrafts: QueryDrafts = async function queryDrafts(
  this: MongooseAdapter,
  {
    collection: collectionSlug,
    joins,
    limit,
    locale,
    page,
    pagination,
    req,
    select,
    sort: sortArg,
    where = {},
  },
) {
  const { collectionConfig, Model } = getCollection({
    adapter: this,
    collectionSlug,
    versions: true,
  })

  let hasNearConstraint
  let sort

  if (where) {
    const constraints = flattenWhereToOperators(where)
    hasNearConstraint = constraints.some((prop) => Object.keys(prop).some((key) => key === 'near'))
  }

  const fields = buildVersionCollectionFields(this.payload.config, collectionConfig, true)

  const sortAggregation: PipelineStage[] = []
  if (!hasNearConstraint) {
    sort = buildSortParam({
      adapter: this,
      config: this.payload.config,
      fields,
      locale,
      sort: sortArg || collectionConfig.defaultSort,
      sortAggregation,
      timestamps: true,
      versions: true,
    })
  }

  const combinedWhere = combineQueries({ latest: { equals: true } }, where)

  const versionQuery = await buildQuery({
    adapter: this,
    fields,
    locale,
    where: combinedWhere,
  })

  const projection = buildProjectionFromSelect({
    adapter: this,
    fields,
    select,
  })

  const session = await getSession(this, req)
  const options: QueryOptions = {
    session,
  }

  // useEstimatedCount is faster, but not accurate, as it ignores any filters. It is thus set to true if there are no filters.
  const useEstimatedCount =
    hasNearConstraint || !versionQuery || Object.keys(versionQuery).length === 0
  const paginationOptions: PaginateOptions = {
    lean: true,
    leanWithId: true,
    options,
    page,
    pagination,
    projection,
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

  if (
    !useEstimatedCount &&
    Object.keys(versionQuery).length === 0 &&
    this.disableIndexHints !== true
  ) {
    // Improve the performance of the countDocuments query which is used if useEstimatedCount is set to false by adding
    // a hint. By default, if no hint is provided, MongoDB does not use an indexed field to count the returned documents,
    // which makes queries very slow. This only happens when no query (filter) is provided. If one is provided, it uses
    // the correct indexed field
    paginationOptions.useCustomCountFn = () => {
      return Promise.resolve(
        Model.countDocuments(versionQuery, {
          hint: { _id: 1 },
        }),
      )
    }
  }

  if (limit && limit > 0) {
    paginationOptions.limit = limit
    // limit must also be set here, it's ignored when pagination is false

    paginationOptions.options!.limit = limit
  }

  let result

  const aggregate = await buildJoinAggregation({
    adapter: this,
    collection: collectionSlug,
    collectionConfig,
    joins,
    locale,
    projection,
    query: versionQuery,
    versions: true,
  })

  // build join aggregation
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
      query: versionQuery,
      session: paginationOptions.options?.session ?? undefined,
      sort: paginationOptions.sort as object,
      sortAggregation,
      useEstimatedCount: paginationOptions.useEstimatedCount,
    })
  } else {
    result = await Model.paginate(versionQuery, paginationOptions)
  }

  if (!this.useJoinAggregations) {
    await resolveJoins({
      adapter: this,
      collectionSlug,
      docs: result.docs as Record<string, unknown>[],
      joins,
      locale,
      versions: true,
    })
  }

  transform({
    adapter: this,
    data: result.docs,
    fields: buildVersionCollectionFields(this.payload.config, collectionConfig),
    operation: 'read',
  })

  for (let i = 0; i < result.docs.length; i++) {
    const id = result.docs[i].parent
    result.docs[i] = result.docs[i].version ?? {}
    result.docs[i].id = id
  }

  return result
}
```

--------------------------------------------------------------------------------

---[FILE: testCredentials.ts]---
Location: payload-main/packages/db-mongodb/src/testCredentials.ts

```typescript
export const email = 'test@test.com'
export const password = 'test123'
export const connection = {
  name: 'payloadmemory',
  port: 27018,
  url: 'mongodb://127.0.0.1',
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/db-mongodb/src/types.ts

```typescript
import type { ClientSession } from 'mongodb'
import type { IndexDefinition, IndexOptions, Model, PaginateModel, SchemaOptions } from 'mongoose'
import type {
  ArrayField,
  BlocksField,
  CheckboxField,
  CodeField,
  CollapsibleField,
  DateField,
  EmailField,
  Field,
  GroupField,
  JoinField,
  JSONField,
  MigrationData,
  NumberField,
  Payload,
  PayloadRequest,
  PointField,
  RadioField,
  RelationshipField,
  RichTextField,
  RowField,
  SanitizedConfig,
  SelectField,
  TabsField,
  TextareaField,
  TextField,
  UploadField,
} from 'payload'

import type { BuildQueryArgs } from './queries/getBuildQueryPlugin.js'

export interface CollectionModel extends Model<any>, PaginateModel<any> {
  /** buildQuery is used to transform payload's where operator into what can be used by mongoose (e.g. id => _id) */
  buildQuery: (args: BuildQueryArgs) => Promise<Record<string, unknown>> // TODO: Delete this
}

export interface AuthCollectionModel extends CollectionModel {
  resetPasswordExpiration: Date
  resetPasswordToken: string
}

export type TypeOfIndex = {
  fields: IndexDefinition
  options?: IndexOptions
}

export interface GlobalModel extends Model<Document> {
  buildQuery: (query: unknown, locale?: string) => Promise<Record<string, unknown>>
}

export type BuildSchema<TSchema> = (args: {
  config: SanitizedConfig
  fields: Field[]
  options: BuildSchemaOptions
}) => TSchema

export type BuildSchemaOptions = {
  allowIDField?: boolean
  disableUnique?: boolean
  draftsEnabled?: boolean
  indexSortableFields?: boolean
  options?: SchemaOptions
}

export type FieldGenerator<TSchema, TField> = {
  config: SanitizedConfig
  field: TField
  options: BuildSchemaOptions
  schema: TSchema
}

export type FieldGeneratorFunction<TSchema, TField extends Field> = (
  args: FieldGenerator<TSchema, TField>,
) => void

/**
 * Object mapping types to a schema based on TSchema
 */
export type FieldToSchemaMap<TSchema> = {
  array: FieldGeneratorFunction<TSchema, ArrayField>
  blocks: FieldGeneratorFunction<TSchema, BlocksField>
  checkbox: FieldGeneratorFunction<TSchema, CheckboxField>
  code: FieldGeneratorFunction<TSchema, CodeField>
  collapsible: FieldGeneratorFunction<TSchema, CollapsibleField>
  date: FieldGeneratorFunction<TSchema, DateField>
  email: FieldGeneratorFunction<TSchema, EmailField>
  group: FieldGeneratorFunction<TSchema, GroupField>
  join: FieldGeneratorFunction<TSchema, JoinField>
  json: FieldGeneratorFunction<TSchema, JSONField>
  number: FieldGeneratorFunction<TSchema, NumberField>
  point: FieldGeneratorFunction<TSchema, PointField>
  radio: FieldGeneratorFunction<TSchema, RadioField>
  relationship: FieldGeneratorFunction<TSchema, RelationshipField>
  richText: FieldGeneratorFunction<TSchema, RichTextField>
  row: FieldGeneratorFunction<TSchema, RowField>
  select: FieldGeneratorFunction<TSchema, SelectField>
  tabs: FieldGeneratorFunction<TSchema, TabsField>
  text: FieldGeneratorFunction<TSchema, TextField>
  textarea: FieldGeneratorFunction<TSchema, TextareaField>
  upload: FieldGeneratorFunction<TSchema, UploadField>
}

export type MigrateUpArgs = {
  /**
   * The Payload instance that you can use to execute Local API methods
   * To use the current transaction you must pass `req` to arguments
   * @example
   * ```ts
   *  import { type MigrateUpArgs } from '@payloadcms/db-mongodb'
   *
   * export async function up({ session, payload, req }: MigrateUpArgs): Promise<void> {
   *   const posts = await payload.find({ collection: 'posts', req })
   * }
   * ```
   */
  payload: Payload
  /**
   * The `PayloadRequest` object that contains the current transaction
   */
  req: PayloadRequest
  /**
   * The MongoDB client session that you can use to execute MongoDB methods directly within the current transaction.
   * @example
   * ```ts
   * import { type MigrateUpArgs } from '@payloadcms/db-mongodb'
   *
   * export async function up({ session, payload, req }: MigrateUpArgs): Promise<void> {
   *   const { rows: posts } = await payload.db.collections.posts.collection.find({ session }).toArray()
   * }
   * ```
   */
  session?: ClientSession
}
export type MigrateDownArgs = {
  /**
   * The Payload instance that you can use to execute Local API methods
   * To use the current transaction you must pass `req` to arguments
   * @example
   * ```ts
   * import { type MigrateDownArgs } from '@payloadcms/db-mongodb'
   *
   * export async function down({ session, payload, req }: MigrateDownArgs): Promise<void> {
   *   const posts = await payload.find({ collection: 'posts', req })
   * }
   * ```
   */
  payload: Payload
  /**
   * The `PayloadRequest` object that contains the current transaction
   */
  req: PayloadRequest
  /**
   * The MongoDB client session that you can use to execute MongoDB methods directly within the current transaction.
   * @example
   * ```ts
   * import { type MigrateDownArgs } from '@payloadcms/db-mongodb'
   *
   * export async function down({ session, payload, req }: MigrateDownArgs): Promise<void> {
   *   const { rows: posts } = await payload.db.collections.posts.collection.find({ session }).toArray()
   * }
   * ```
   */
  session?: ClientSession
}

export type MongooseMigration = {
  down: (args: MigrateDownArgs) => Promise<void>
  up: (args: MigrateUpArgs) => Promise<void>
} & MigrationData
```

--------------------------------------------------------------------------------

---[FILE: updateGlobal.ts]---
Location: payload-main/packages/db-mongodb/src/updateGlobal.ts

```typescript
import type { MongooseUpdateQueryOptions } from 'mongoose'
import type { UpdateGlobal } from 'payload'

import type { MongooseAdapter } from './index.js'

import { buildProjectionFromSelect } from './utilities/buildProjectionFromSelect.js'
import { getGlobal } from './utilities/getEntity.js'
import { getSession } from './utilities/getSession.js'
import { transform } from './utilities/transform.js'

export const updateGlobal: UpdateGlobal = async function updateGlobal(
  this: MongooseAdapter,
  { slug: globalSlug, data, options: optionsArgs = {}, req, returning, select },
) {
  const { globalConfig, Model } = getGlobal({ adapter: this, globalSlug })

  const fields = globalConfig.fields

  transform({ adapter: this, data, fields, globalSlug, operation: 'write' })

  const options: MongooseUpdateQueryOptions = {
    ...optionsArgs,
    lean: true,
    new: true,
    projection: buildProjectionFromSelect({
      adapter: this,
      fields: globalConfig.flattenedFields,
      select,
    }),
    session: await getSession(this, req),
    // Timestamps are manually added by the write transform
    timestamps: false,
  }

  if (returning === false) {
    await Model.updateOne({ globalType: globalSlug }, data, options)
    return null
  }

  const result: any = await Model.findOneAndUpdate({ globalType: globalSlug }, data, options)

  transform({ adapter: this, data: result, fields, globalSlug, operation: 'read' })

  return result
}
```

--------------------------------------------------------------------------------

---[FILE: updateGlobalVersion.ts]---
Location: payload-main/packages/db-mongodb/src/updateGlobalVersion.ts

```typescript
import type { MongooseUpdateQueryOptions } from 'mongoose'
import type { JsonObject, UpdateGlobalVersionArgs } from 'payload'

import { buildVersionGlobalFields } from 'payload'

import type { MongooseAdapter } from './index.js'

import { buildQuery } from './queries/buildQuery.js'
import { buildProjectionFromSelect } from './utilities/buildProjectionFromSelect.js'
import { getGlobal } from './utilities/getEntity.js'
import { getSession } from './utilities/getSession.js'
import { transform } from './utilities/transform.js'

export async function updateGlobalVersion<T extends JsonObject = JsonObject>(
  this: MongooseAdapter,
  {
    id,
    global: globalSlug,
    locale,
    options: optionsArgs = {},
    req,
    returning,
    select,
    versionData,
    where,
  }: UpdateGlobalVersionArgs<T>,
) {
  const { globalConfig, Model } = getGlobal({ adapter: this, globalSlug, versions: true })
  const whereToUse = where || { id: { equals: id } }

  const fields = buildVersionGlobalFields(this.payload.config, globalConfig)
  const flattenedFields = buildVersionGlobalFields(this.payload.config, globalConfig, true)

  const query = await buildQuery({
    adapter: this,
    fields: flattenedFields,
    locale,
    where: whereToUse,
  })

  transform({ adapter: this, data: versionData, fields, operation: 'write' })

  const options: MongooseUpdateQueryOptions = {
    ...optionsArgs,
    lean: true,
    new: true,
    projection: buildProjectionFromSelect({
      adapter: this,
      fields: flattenedFields,
      select,
    }),
    session: await getSession(this, req),
    // Timestamps are manually added by the write transform
    timestamps: false,
  }

  if (returning === false) {
    await Model.updateOne(query, versionData, options)
    return null
  }

  const doc = await Model.findOneAndUpdate(query, versionData, options)

  if (!doc) {
    return null
  }

  transform({ adapter: this, data: doc, fields, operation: 'read' })

  return doc
}
```

--------------------------------------------------------------------------------

---[FILE: updateJobs.ts]---
Location: payload-main/packages/db-mongodb/src/updateJobs.ts

```typescript
import type { MongooseUpdateQueryOptions, UpdateQuery } from 'mongoose'
import type { Job, UpdateJobs, Where } from 'payload'

import type { MongooseAdapter } from './index.js'

import { buildQuery } from './queries/buildQuery.js'
import { buildSortParam } from './queries/buildSortParam.js'
import { getCollection } from './utilities/getEntity.js'
import { getSession } from './utilities/getSession.js'
import { handleError } from './utilities/handleError.js'
import { transform } from './utilities/transform.js'

export const updateJobs: UpdateJobs = async function updateMany(
  this: MongooseAdapter,
  { id, data, limit, req, returning, sort: sortArg, where: whereArg },
) {
  if (
    !(data?.log as object[])?.length &&
    !(data.log && typeof data.log === 'object' && '$push' in data.log)
  ) {
    delete data.log
  }

  const where = id ? { id: { equals: id } } : (whereArg as Where)

  const { collectionConfig, Model } = getCollection({
    adapter: this,
    collectionSlug: 'payload-jobs',
  })

  const sort: Record<string, unknown> | undefined = buildSortParam({
    adapter: this,
    config: this.payload.config,
    fields: collectionConfig.flattenedFields,
    sort: sortArg || collectionConfig.defaultSort,
    timestamps: true,
  })

  let query = await buildQuery({
    adapter: this,
    collectionSlug: collectionConfig.slug,
    fields: collectionConfig.flattenedFields,
    where,
  })

  let updateData: UpdateQuery<any> = data

  const $inc: Record<string, number> = {}
  const $push: Record<string, { $each: any[] } | any> = {}
  const $addToSet: Record<string, { $each: any[] } | any> = {}
  const $pull: Record<string, { $in: any[] } | any> = {}

  transform({
    $addToSet,
    $inc,
    $pull,
    $push,
    adapter: this,
    data,
    fields: collectionConfig.fields,
    operation: 'write',
  })

  const updateOps: UpdateQuery<any> = {}

  if (Object.keys($inc).length) {
    updateOps.$inc = $inc
  }
  if (Object.keys($push).length) {
    updateOps.$push = $push
  }
  if (Object.keys($addToSet).length) {
    updateOps.$addToSet = $addToSet
  }
  if (Object.keys($pull).length) {
    updateOps.$pull = $pull
  }
  if (Object.keys(updateOps).length) {
    updateOps.$set = updateData
    updateData = updateOps
  }

  const options: MongooseUpdateQueryOptions = {
    lean: true,
    new: true,
    session: await getSession(this, req),
    // Timestamps are manually added by the write transform
    timestamps: false,
  }

  let result: Job[] = []

  try {
    if (id) {
      if (returning === false) {
        await Model.updateOne(query, updateData, options)
        transform({ adapter: this, data, fields: collectionConfig.fields, operation: 'read' })

        return null
      } else {
        const doc = await Model.findOneAndUpdate(query, updateData, options)
        result = doc ? [doc] : []
      }
    } else {
      if (typeof limit === 'number' && limit > 0) {
        const documentsToUpdate = await Model.find(
          query,
          {},
          { ...options, limit, projection: { _id: 1 }, sort },
        )
        if (documentsToUpdate.length === 0) {
          return null
        }

        query = { _id: { $in: documentsToUpdate.map((doc) => doc._id) } }
      }

      await Model.updateMany(query, updateData, options)

      if (returning === false) {
        return null
      }

      result = await Model.find(
        query,
        {},
        {
          ...options,
          sort,
        },
      )
    }
  } catch (error) {
    handleError({ collection: collectionConfig.slug, error, req })
  }

  transform({
    adapter: this,
    data: result,
    fields: collectionConfig.fields,
    operation: 'read',
  })

  return result
}
```

--------------------------------------------------------------------------------

---[FILE: updateMany.ts]---
Location: payload-main/packages/db-mongodb/src/updateMany.ts

```typescript
import type { MongooseUpdateQueryOptions, UpdateQuery } from 'mongoose'

import { flattenWhereToOperators, type UpdateMany } from 'payload'

import type { MongooseAdapter } from './index.js'

import { buildQuery } from './queries/buildQuery.js'
import { buildSortParam } from './queries/buildSortParam.js'
import { buildProjectionFromSelect } from './utilities/buildProjectionFromSelect.js'
import { getCollection } from './utilities/getEntity.js'
import { getSession } from './utilities/getSession.js'
import { handleError } from './utilities/handleError.js'
import { transform } from './utilities/transform.js'

export const updateMany: UpdateMany = async function updateMany(
  this: MongooseAdapter,
  {
    collection: collectionSlug,
    data,
    limit,
    locale,
    options: optionsArgs = {},
    req,
    returning,
    select,
    sort: sortArg,
    where,
  },
) {
  let hasNearConstraint = false

  if (where) {
    const constraints = flattenWhereToOperators(where)
    hasNearConstraint = constraints.some((prop) => Object.keys(prop).some((key) => key === 'near'))
  }

  const { collectionConfig, Model } = getCollection({ adapter: this, collectionSlug })

  let sort: Record<string, unknown> | undefined
  if (!hasNearConstraint) {
    sort = buildSortParam({
      adapter: this,
      config: this.payload.config,
      fields: collectionConfig.flattenedFields,
      locale,
      sort: sortArg || collectionConfig.defaultSort,
      timestamps: true,
    })
  }

  let query = await buildQuery({
    adapter: this,
    collectionSlug,
    fields: collectionConfig.flattenedFields,
    locale,
    where,
  })

  const $inc: Record<string, number> = {}
  const $push: Record<string, { $each: any[] } | any> = {}
  const $addToSet: Record<string, { $each: any[] } | any> = {}
  const $pull: Record<string, { $in: any[] } | any> = {}

  transform({
    $addToSet,
    $inc,
    $pull,
    $push,
    adapter: this,
    data,
    fields: collectionConfig.fields,
    operation: 'write',
  })

  const updateOps: UpdateQuery<any> = {}

  if (Object.keys($inc).length) {
    updateOps.$inc = $inc
  }
  if (Object.keys($push).length) {
    updateOps.$push = $push
  }
  if (Object.keys($addToSet).length) {
    updateOps.$addToSet = $addToSet
  }
  if (Object.keys($pull).length) {
    updateOps.$pull = $pull
  }
  if (Object.keys(updateOps).length) {
    updateOps.$set = data
    data = updateOps
  }

  const options: MongooseUpdateQueryOptions = {
    ...optionsArgs,
    lean: true,
    new: true,
    projection: buildProjectionFromSelect({
      adapter: this,
      fields: collectionConfig.flattenedFields,
      select,
    }),
    session: await getSession(this, req),
    // Timestamps are manually added by the write transform
    timestamps: false,
  }

  try {
    if (typeof limit === 'number' && limit > 0) {
      const documentsToUpdate = await Model.find(
        query,
        {},
        { ...options, limit, projection: { _id: 1 }, sort },
      )
      if (documentsToUpdate.length === 0) {
        return null
      }

      query = { _id: { $in: documentsToUpdate.map((doc) => doc._id) } }
    }

    await Model.updateMany(query, data, options)
  } catch (error) {
    handleError({ collection: collectionSlug, error, req })
  }

  if (returning === false) {
    return null
  }

  const result = await Model.find(
    query,
    {},
    {
      ...options,
      sort,
    },
  )

  transform({
    adapter: this,
    data: result,
    fields: collectionConfig.fields,
    operation: 'read',
  })

  return result
}
```

--------------------------------------------------------------------------------

---[FILE: updateOne.ts]---
Location: payload-main/packages/db-mongodb/src/updateOne.ts

```typescript
import type { MongooseUpdateQueryOptions, UpdateQuery } from 'mongoose'
import type { UpdateOne } from 'payload'

import type { MongooseAdapter } from './index.js'

import { buildQuery } from './queries/buildQuery.js'
import { buildProjectionFromSelect } from './utilities/buildProjectionFromSelect.js'
import { getCollection } from './utilities/getEntity.js'
import { getSession } from './utilities/getSession.js'
import { handleError } from './utilities/handleError.js'
import { transform } from './utilities/transform.js'

export const updateOne: UpdateOne = async function updateOne(
  this: MongooseAdapter,
  {
    id,
    collection: collectionSlug,
    data,
    locale,
    options: optionsArgs = {},
    req,
    returning,
    select,
    where: whereArg = {},
  },
) {
  const { collectionConfig, Model } = getCollection({ adapter: this, collectionSlug })
  const where = id ? { id: { equals: id } } : whereArg
  const fields = collectionConfig.fields

  const query = await buildQuery({
    adapter: this,
    collectionSlug,
    fields: collectionConfig.flattenedFields,
    locale,
    where,
  })

  let result

  let updateData: UpdateQuery<any> = data

  const $inc: Record<string, number> = {}
  const $push: Record<string, { $each: any[] } | any> = {}
  const $addToSet: Record<string, { $each: any[] } | any> = {}
  const $pull: Record<string, { $in: any[] } | any> = {}

  transform({
    $addToSet,
    $inc,
    $pull,
    $push,
    adapter: this,
    data,
    fields,
    operation: 'write',
  })

  const updateOps: UpdateQuery<any> = {}

  if (Object.keys($inc).length) {
    updateOps.$inc = $inc
  }
  if (Object.keys($push).length) {
    updateOps.$push = $push
  }
  if (Object.keys($addToSet).length) {
    updateOps.$addToSet = $addToSet
  }
  if (Object.keys($pull).length) {
    updateOps.$pull = $pull
  }
  if (Object.keys(updateOps).length) {
    updateOps.$set = updateData
    updateData = updateOps
  }

  const options: MongooseUpdateQueryOptions = {
    ...optionsArgs,
    lean: true,
    new: true,
    projection: buildProjectionFromSelect({
      adapter: this,
      fields: collectionConfig.flattenedFields,
      select,
    }),
    session: await getSession(this, req),
    // Timestamps are manually added by the write transform
    timestamps: false,
  }

  try {
    if (returning === false) {
      await Model.updateOne(query, updateData, options)
      transform({ adapter: this, data, fields, operation: 'read' })
      return null
    } else {
      result = await Model.findOneAndUpdate(query, updateData, options)
    }
  } catch (error) {
    handleError({ collection: collectionSlug, error, req })
  }

  if (!result) {
    return null
  }

  transform({ adapter: this, data: result, fields, operation: 'read' })

  return result
}
```

--------------------------------------------------------------------------------

---[FILE: updateVersion.ts]---
Location: payload-main/packages/db-mongodb/src/updateVersion.ts

```typescript
import type { MongooseUpdateQueryOptions } from 'mongoose'

import { buildVersionCollectionFields, type UpdateVersion } from 'payload'

import type { MongooseAdapter } from './index.js'

import { buildQuery } from './queries/buildQuery.js'
import { buildProjectionFromSelect } from './utilities/buildProjectionFromSelect.js'
import { getCollection } from './utilities/getEntity.js'
import { getSession } from './utilities/getSession.js'
import { transform } from './utilities/transform.js'

export const updateVersion: UpdateVersion = async function updateVersion(
  this: MongooseAdapter,
  {
    id,
    collection: collectionSlug,
    locale,
    options: optionsArgs = {},
    req,
    returning,
    select,
    versionData,
    where,
  },
) {
  const { collectionConfig, Model } = getCollection({
    adapter: this,
    collectionSlug,
    versions: true,
  })

  const whereToUse = where || { id: { equals: id } }
  const fields = buildVersionCollectionFields(this.payload.config, collectionConfig)

  const flattenedFields = buildVersionCollectionFields(this.payload.config, collectionConfig, true)

  const query = await buildQuery({
    adapter: this,
    fields: flattenedFields,
    locale,
    where: whereToUse,
  })

  transform({ adapter: this, data: versionData, fields, operation: 'write' })

  const options: MongooseUpdateQueryOptions = {
    ...optionsArgs,
    lean: true,
    new: true,
    projection: buildProjectionFromSelect({
      adapter: this,
      fields: flattenedFields,
      select,
    }),
    session: await getSession(this, req),
    // Timestamps are manually added by the write transform
    timestamps: false,
  }

  if (returning === false) {
    await Model.updateOne(query, versionData, options)
    return null
  }

  const doc = await Model.findOneAndUpdate(query, versionData, options)

  if (!doc) {
    return null
  }

  transform({ adapter: this, data: doc, fields, operation: 'read' })

  return doc
}
```

--------------------------------------------------------------------------------

---[FILE: upsert.ts]---
Location: payload-main/packages/db-mongodb/src/upsert.ts

```typescript
import type { Upsert } from 'payload'

import type { MongooseAdapter } from './index.js'

export const upsert: Upsert = async function upsert(
  this: MongooseAdapter,
  { collection, data, locale, req, returning, select, where },
) {
  return this.updateOne({
    collection,
    data,
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

---[FILE: internal.ts]---
Location: payload-main/packages/db-mongodb/src/exports/internal.ts

```typescript
export { transform } from '../utilities/transform.js'
```

--------------------------------------------------------------------------------

---[FILE: migration-utils.ts]---
Location: payload-main/packages/db-mongodb/src/exports/migration-utils.ts

```typescript
export { migrateRelationshipsV2_V3 } from '../predefinedMigrations/migrateRelationshipsV2_V3.js'
export { migrateVersionsV1_V2 } from '../predefinedMigrations/migrateVersionsV1_V2.js'
```

--------------------------------------------------------------------------------

---[FILE: buildCollectionSchema.ts]---
Location: payload-main/packages/db-mongodb/src/models/buildCollectionSchema.ts

```typescript
import type { PaginateOptions, Schema } from 'mongoose'
import type { Payload, SanitizedCollectionConfig } from 'payload'

import paginate from 'mongoose-paginate-v2'

import { getBuildQueryPlugin } from '../queries/getBuildQueryPlugin.js'
import { buildSchema } from './buildSchema.js'

export const buildCollectionSchema = (
  collection: SanitizedCollectionConfig,
  payload: Payload,
  schemaOptions = {},
): Schema => {
  const schema = buildSchema({
    buildSchemaOptions: {
      draftsEnabled: Boolean(
        typeof collection?.versions === 'object' && collection.versions.drafts,
      ),
      indexSortableFields: payload.config.indexSortableFields,
      options: {
        minimize: false,
        timestamps: collection.timestamps !== false,
        ...schemaOptions,
      },
    },
    compoundIndexes: collection.sanitizedIndexes,
    configFields: collection.fields,
    payload,
  })

  if (Array.isArray(collection.upload.filenameCompoundIndex)) {
    const indexDefinition = collection.upload.filenameCompoundIndex.reduce<Record<string, 1>>(
      (acc, index) => {
        acc[index] = 1
        return acc
      },
      {},
    )

    schema.index(indexDefinition, { unique: true })
  }

  schema
    .plugin<any, PaginateOptions>(paginate, { useEstimatedCount: true })
    .plugin(getBuildQueryPlugin({ collectionSlug: collection.slug }))

  return schema
}
```

--------------------------------------------------------------------------------

---[FILE: buildGlobalModel.ts]---
Location: payload-main/packages/db-mongodb/src/models/buildGlobalModel.ts

```typescript
import mongoose from 'mongoose'

import type { MongooseAdapter } from '../index.js'
import type { GlobalModel } from '../types.js'

import { getBuildQueryPlugin } from '../queries/getBuildQueryPlugin.js'
import { buildSchema } from './buildSchema.js'

export const buildGlobalModel = (adapter: MongooseAdapter): GlobalModel | null => {
  if (adapter.payload.config.globals && adapter.payload.config.globals.length > 0) {
    const globalsSchema = new mongoose.Schema(
      {},
      { discriminatorKey: 'globalType', minimize: false, timestamps: true },
    )

    globalsSchema.plugin(getBuildQueryPlugin())

    const Globals = adapter.connection.model(
      'globals',
      globalsSchema,
      'globals',
    ) as unknown as GlobalModel

    Object.values(adapter.payload.config.globals).forEach((globalConfig) => {
      const globalSchema = buildSchema({
        buildSchemaOptions: {
          options: {
            minimize: false,
          },
        },
        configFields: globalConfig.fields,
        payload: adapter.payload,
      })
      Globals.discriminator(globalConfig.slug, globalSchema)
    })

    return Globals
  }

  return null
}
```

--------------------------------------------------------------------------------

````
