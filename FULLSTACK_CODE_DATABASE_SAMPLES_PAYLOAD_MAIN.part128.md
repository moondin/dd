---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 128
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 128 of 695)

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

---[FILE: sanitizeQueryValue.ts]---
Location: payload-main/packages/db-mongodb/src/queries/sanitizeQueryValue.ts

```typescript
import type {
  FlattenedBlock,
  FlattenedBlocksField,
  FlattenedField,
  Operator,
  Payload,
  RelationshipField,
} from 'payload'

import { Types } from 'mongoose'
import { createArrayFromCommaDelineated } from 'payload'
import { fieldShouldBeLocalized } from 'payload/shared'

type SanitizeQueryValueArgs = {
  field: FlattenedField
  hasCustomID: boolean
  locale?: string
  operator: Operator
  parentIsLocalized: boolean
  path: string
  payload: Payload
  val: any
}

const buildExistsQuery = (formattedValue: unknown, path: string, treatEmptyString = true) => {
  if (formattedValue) {
    return {
      rawQuery: {
        $and: [
          { [path]: { $exists: true } },
          { [path]: { $ne: null } },
          ...(treatEmptyString ? [{ [path]: { $ne: '' } }] : []), // Treat empty string as null / undefined
        ],
      },
    }
  } else {
    return {
      rawQuery: {
        $or: [
          { [path]: { $exists: false } },
          { [path]: { $eq: null } },
          ...(treatEmptyString ? [{ [path]: { $eq: '' } }] : []), // Treat empty string as null / undefined
        ],
      },
    }
  }
}

// returns nestedField Field object from blocks.nestedField path because getLocalizedPaths splits them only for relationships
const getFieldFromSegments = ({
  field,
  payload,
  segments,
}: {
  field: FlattenedBlock | FlattenedField
  payload: Payload
  segments: string[]
}): FlattenedField | undefined => {
  if ('blocks' in field || 'blockReferences' in field) {
    const _field: FlattenedBlocksField = field as FlattenedBlocksField
    for (const _block of _field.blockReferences ?? _field.blocks) {
      const block: FlattenedBlock | undefined =
        typeof _block === 'string' ? payload.blocks[_block] : _block
      if (block) {
        const field = getFieldFromSegments({ field: block, payload, segments })
        if (field) {
          return field
        }
      }
    }
  }

  if ('fields' in field) {
    for (let i = 0; i < segments.length; i++) {
      const foundField = field.flattenedFields.find((each) => each.name === segments[i])

      if (!foundField) {
        break
      }

      if (foundField && segments.length - 1 === i) {
        return foundField
      }

      segments.shift()
      return getFieldFromSegments({ field: foundField, payload, segments })
    }
  }
}

export const sanitizeQueryValue = ({
  field,
  hasCustomID,
  locale,
  operator,
  parentIsLocalized,
  path,
  payload,
  val,
}: SanitizeQueryValueArgs):
  | {
      operator?: string
      rawQuery?: unknown
      val?: unknown
    }
  | undefined => {
  let formattedValue = val
  let formattedOperator = operator

  if (['array', 'blocks', 'group', 'tab'].includes(field.type) && path.includes('.')) {
    const segments = path.split('.')
    segments.shift()
    const foundField = getFieldFromSegments({ field, payload, segments })

    if (foundField) {
      field = foundField
    }
  }

  // Disregard invalid _ids
  if (path === '_id') {
    if (typeof val === 'string' && val.split(',').length === 1) {
      if (!hasCustomID) {
        const isValid = Types.ObjectId.isValid(val)

        if (!isValid) {
          return { operator: formattedOperator, val: undefined }
        } else {
          if (['in', 'not_in'].includes(operator)) {
            formattedValue = createArrayFromCommaDelineated(formattedValue).map(
              (id) => new Types.ObjectId(id),
            )
          } else {
            formattedValue = new Types.ObjectId(val)
          }
        }
      }

      if (field.type === 'number') {
        const parsedNumber = parseFloat(val)

        if (Number.isNaN(parsedNumber)) {
          return { operator: formattedOperator, val: undefined }
        }
      }
    } else if (Array.isArray(val) || (typeof val === 'string' && val.split(',').length > 1)) {
      if (typeof val === 'string') {
        formattedValue = createArrayFromCommaDelineated(val)
      }

      if (Array.isArray(formattedValue)) {
        formattedValue = formattedValue.reduce<unknown[]>((formattedValues, inVal) => {
          if (!hasCustomID) {
            if (Types.ObjectId.isValid(inVal)) {
              formattedValues.push(new Types.ObjectId(inVal))

              return formattedValues
            }
          }

          if (field.type === 'number') {
            const parsedNumber = parseFloat(inVal)
            if (!Number.isNaN(parsedNumber)) {
              formattedValues.push(parsedNumber)
            }
          } else {
            formattedValues.push(inVal)
          }

          return formattedValues
        }, [])
      }
    }
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

  if (['all', 'in', 'not_in'].includes(operator) && typeof formattedValue === 'string') {
    formattedValue = createArrayFromCommaDelineated(formattedValue)

    if (field.type === 'number' && Array.isArray(formattedValue)) {
      formattedValue = formattedValue.map((arrayVal) => parseFloat(arrayVal))
    }
  }

  if (field.type === 'number') {
    if (typeof formattedValue === 'string' && operator !== 'exists') {
      formattedValue = Number(val)
    }

    if (operator === 'exists') {
      formattedValue = val === 'true' ? true : val === 'false' ? false : Boolean(val)

      return buildExistsQuery(formattedValue, path)
    }
  }

  if (field.type === 'date' && typeof val === 'string' && operator !== 'exists') {
    formattedValue = new Date(val)
    if (Number.isNaN(Date.parse(formattedValue))) {
      return undefined
    }
  }

  if (['relationship', 'upload'].includes(field.type)) {
    if (val === 'null') {
      formattedValue = null
    }

    // Object equality requires the value to be the first key in the object that is being queried.
    if (
      operator === 'equals' &&
      formattedValue &&
      typeof formattedValue === 'object' &&
      formattedValue.value &&
      formattedValue.relationTo
    ) {
      const { value } = formattedValue
      const isValid = Types.ObjectId.isValid(value)

      if (isValid) {
        formattedValue.value = new Types.ObjectId(value)
      }

      let localizedPath = path

      if (
        fieldShouldBeLocalized({ field, parentIsLocalized }) &&
        payload.config.localization &&
        locale
      ) {
        localizedPath = `${path}.${locale}`
      }

      return {
        rawQuery: {
          $or: [
            {
              [localizedPath]: {
                $eq: {
                  // disable auto sort
                  /* eslint-disable */
                  value: formattedValue.value,
                  relationTo: formattedValue.relationTo,
                  /* eslint-enable */
                },
              },
            },
            {
              [localizedPath]: {
                $eq: {
                  relationTo: formattedValue.relationTo,
                  value: formattedValue.value,
                },
              },
            },
          ],
        },
      }
    }

    const relationTo = (field as RelationshipField).relationTo

    if (['in', 'not_in'].includes(operator) && Array.isArray(formattedValue)) {
      formattedValue = formattedValue.reduce((formattedValues, inVal) => {
        if (!inVal) {
          return formattedValues
        }

        if (typeof relationTo === 'string' && payload.collections[relationTo]?.customIDType) {
          if (payload.collections[relationTo].customIDType === 'number') {
            const parsedNumber = parseFloat(inVal)
            if (!Number.isNaN(parsedNumber)) {
              formattedValues.push(parsedNumber)
              return formattedValues
            }
          }

          formattedValues.push(inVal)
          return formattedValues
        }

        if (
          Array.isArray(relationTo) &&
          relationTo.some((relationTo) => !!payload.collections[relationTo]?.customIDType)
        ) {
          if (Types.ObjectId.isValid(inVal.toString())) {
            formattedValues.push(new Types.ObjectId(inVal))
          } else {
            formattedValues.push(inVal)
          }
          return formattedValues
        }

        if (Types.ObjectId.isValid(inVal.toString())) {
          formattedValues.push(new Types.ObjectId(inVal))
        }

        return formattedValues
      }, [])
    }

    if (
      ['contains', 'equals', 'like', 'not_equals'].includes(operator) &&
      (!Array.isArray(relationTo) || !path.endsWith('.relationTo'))
    ) {
      if (typeof relationTo === 'string') {
        const customIDType = payload.collections[relationTo]?.customIDType

        if (customIDType) {
          if (customIDType === 'number') {
            formattedValue = parseFloat(val)

            if (Number.isNaN(formattedValue)) {
              return { operator: formattedOperator, val: undefined }
            }
          }
        } else {
          if (!Types.ObjectId.isValid(formattedValue)) {
            return { operator: formattedOperator, val: undefined }
          }
          formattedValue = new Types.ObjectId(formattedValue)
        }
      } else {
        const hasCustomIDType = relationTo.some(
          (relationTo) => !!payload.collections[relationTo]?.customIDType,
        )

        if (hasCustomIDType) {
          if (typeof val === 'string') {
            const formattedNumber = Number(val)
            formattedValue = [Types.ObjectId.isValid(val) ? new Types.ObjectId(val) : val]
            formattedOperator = operator === 'not_equals' ? 'not_in' : 'in'
            if (!Number.isNaN(formattedNumber)) {
              formattedValue.push(formattedNumber)
            }
          }
        } else {
          if (!Types.ObjectId.isValid(formattedValue)) {
            return { operator: formattedOperator, val: undefined }
          }
          formattedValue = new Types.ObjectId(formattedValue)
        }
      }
    }

    if (
      operator === 'all' &&
      Array.isArray(relationTo) &&
      path.endsWith('.value') &&
      Array.isArray(formattedValue)
    ) {
      formattedValue.forEach((v, i) => {
        if (Types.ObjectId.isValid(v)) {
          formattedValue[i] = new Types.ObjectId(v)
        }
      })
    }
  }

  // Set up specific formatting necessary by operators

  if (operator === 'near') {
    let lng
    let lat
    let maxDistance
    let minDistance

    if (Array.isArray(formattedValue)) {
      ;[lng, lat, maxDistance, minDistance] = formattedValue
    }

    if (typeof formattedValue === 'string') {
      ;[lng, lat, maxDistance, minDistance] = createArrayFromCommaDelineated(formattedValue)
    }

    if (lng == null || lat == null || (maxDistance == null && minDistance == null)) {
      formattedValue = undefined
    } else {
      formattedValue = {
        $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
      }

      if (maxDistance && !Number.isNaN(Number(maxDistance))) {
        formattedValue.$maxDistance = parseFloat(maxDistance)
      }

      if (minDistance && !Number.isNaN(Number(minDistance))) {
        formattedValue.$minDistance = parseFloat(minDistance)
      }
    }
  }

  if (operator === 'within' || operator === 'intersects') {
    formattedValue = {
      $geometry: formattedValue,
    }
  }

  if (path !== '_id' || (path === '_id' && hasCustomID && field.type === 'text')) {
    if (operator === 'contains' && !Types.ObjectId.isValid(formattedValue)) {
      formattedValue = {
        $options: 'i',
        $regex: formattedValue.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&'),
      }
    }

    if (operator === 'exists') {
      formattedValue = formattedValue === 'true' || formattedValue === true

      // _id can't be empty string, will error Cast to ObjectId failed for value ""
      return buildExistsQuery(
        formattedValue,
        path,
        !['checkbox', 'relationship', 'upload'].includes(field.type),
      )
    }
  }

  if (
    (path === '_id' || path === 'parent') &&
    operator === 'like' &&
    formattedValue.length === 24 &&
    !hasCustomID
  ) {
    formattedOperator = 'equals'
  }

  if (operator === 'exists') {
    formattedValue = formattedValue === 'true' || formattedValue === true

    // Clearable fields
    if (['relationship', 'select', 'upload'].includes(field.type)) {
      if (formattedValue) {
        return {
          rawQuery: {
            $and: [{ [path]: { $exists: true } }, { [path]: { $ne: null } }],
          },
        }
      } else {
        return {
          rawQuery: {
            $or: [{ [path]: { $exists: false } }, { [path]: { $eq: null } }],
          },
        }
      }
    }
  }

  return { operator: formattedOperator, val: formattedValue }
}
```

--------------------------------------------------------------------------------

---[FILE: beginTransaction.ts]---
Location: payload-main/packages/db-mongodb/src/transactions/beginTransaction.ts

```typescript
import type { TransactionOptions } from 'mongodb'
import type { BeginTransaction } from 'payload'

import { APIError } from 'payload'
import { v4 as uuid } from 'uuid'

import type { MongooseAdapter } from '../index.js'

// Needs await to fulfill the interface
// @ts-expect-error TransactionOptions isn't compatible with BeginTransaction of the DatabaseAdapter interface.
// eslint-disable-next-line @typescript-eslint/require-await
export const beginTransaction: BeginTransaction = async function beginTransaction(
  this: MongooseAdapter,
  options: TransactionOptions,
) {
  if (!this.connection) {
    throw new APIError('beginTransaction called while no connection to the database exists')
  }

  const client = this.connection.getClient()
  const id = uuid()

  if (!this.sessions[id]) {
    // @ts-expect-error BaseDatabaseAdapter and MongoosAdapter (that extends Base) sessions aren't compatible.
    this.sessions[id] = client.startSession()
  }
  if (this.sessions[id]?.inTransaction()) {
    this.payload.logger.warn('beginTransaction called while transaction already exists')
  } else {
    this.sessions[id]?.startTransaction(options || (this.transactionOptions as TransactionOptions))
  }

  return id
}
```

--------------------------------------------------------------------------------

---[FILE: commitTransaction.ts]---
Location: payload-main/packages/db-mongodb/src/transactions/commitTransaction.ts

```typescript
import type { CommitTransaction } from 'payload'

import type { MongooseAdapter } from '../index.js'

export const commitTransaction: CommitTransaction = async function commitTransaction(
  this: MongooseAdapter,
  incomingID = '',
) {
  const transactionID = incomingID instanceof Promise ? await incomingID : incomingID

  if (!this.sessions[transactionID]) {
    return
  }

  if (!this.sessions[transactionID]?.inTransaction()) {
    // Clean up the orphaned session reference
    delete this.sessions[transactionID]
    return
  }

  const session = this.sessions[transactionID]

  // Delete from registry FIRST to prevent race conditions
  // This ensures other operations can't retrieve this session while we're ending it
  delete this.sessions[transactionID]

  await session.commitTransaction()
  try {
    await session.endSession()
  } catch (_) {
    // ending sessions is only best effort and won't impact anything if it fails since the transaction was committed
  }
}
```

--------------------------------------------------------------------------------

---[FILE: rollbackTransaction.ts]---
Location: payload-main/packages/db-mongodb/src/transactions/rollbackTransaction.ts

```typescript
import type { RollbackTransaction } from 'payload'

import type { MongooseAdapter } from '../index.js'

export const rollbackTransaction: RollbackTransaction = async function rollbackTransaction(
  this: MongooseAdapter,
  incomingID = '',
) {
  const transactionID = incomingID instanceof Promise ? await incomingID : incomingID

  // if multiple operations are using the same transaction, the first will flow through and delete the session.
  // subsequent calls should be ignored.
  if (!this.sessions[transactionID]) {
    return
  }

  // when session exists but is not inTransaction something unexpected is happening to the session
  if (!this.sessions[transactionID]?.inTransaction()) {
    this.payload.logger.warn('rollbackTransaction called when no transaction exists')
    delete this.sessions[transactionID]
    return
  }

  const session = this.sessions[transactionID]

  // Delete from registry FIRST to prevent race conditions
  // This ensures other operations can't retrieve this session while we're aborting it
  delete this.sessions[transactionID]

  // the first call for rollback should be aborted and deleted causing any other operations with the same transaction to fail
  try {
    await session.abortTransaction()
    await session.endSession()
  } catch (_error) {
    // ignore the error as it is likely a race condition from multiple errors
  }
}
```

--------------------------------------------------------------------------------

---[FILE: aggregatePaginate.ts]---
Location: payload-main/packages/db-mongodb/src/utilities/aggregatePaginate.ts

```typescript
import type { CollationOptions } from 'mongodb'
import type { ClientSession, Model, PipelineStage } from 'mongoose'
import type { PaginatedDocs } from 'payload'

import type { MongooseAdapter } from '../index.js'

export const aggregatePaginate = async ({
  adapter,
  collation,
  joinAggregation,
  limit,
  Model,
  page,
  pagination,
  projection,
  query,
  session,
  sort,
  sortAggregation,
  useEstimatedCount,
}: {
  adapter: MongooseAdapter
  collation?: CollationOptions
  joinAggregation?: PipelineStage[]
  limit?: number
  Model: Model<any>
  page?: number
  pagination?: boolean
  projection?: Record<string, boolean>
  query: Record<string, unknown>
  session?: ClientSession
  sort?: object
  sortAggregation?: PipelineStage[]
  useEstimatedCount?: boolean
}): Promise<PaginatedDocs<any>> => {
  const aggregation: PipelineStage[] = [{ $match: query }]

  if (sortAggregation && sortAggregation.length > 0) {
    for (const stage of sortAggregation) {
      aggregation.push(stage)
    }
  }

  if (sort) {
    const $sort: Record<string, -1 | 1> = {}

    Object.entries(sort).forEach(([key, value]) => {
      $sort[key] = value === 'desc' ? -1 : 1
    })

    aggregation.push({ $sort })
  }

  if (page) {
    aggregation.push({ $skip: (page - 1) * (limit ?? 0) })
  }

  if (limit) {
    aggregation.push({ $limit: limit })
  }

  if (joinAggregation) {
    for (const stage of joinAggregation) {
      aggregation.push(stage)
    }
  }

  if (projection) {
    aggregation.push({ $project: projection })
  }

  let countPromise: Promise<null | number> = Promise.resolve(null)

  if (pagination !== false && limit) {
    if (useEstimatedCount) {
      countPromise = Model.estimatedDocumentCount(query)
    } else {
      const hint = adapter.disableIndexHints !== true ? { _id: 1 } : undefined
      countPromise = Model.countDocuments(query, {
        collation,
        session,
        ...(hint ? { hint } : {}),
      })
    }
  }

  const [docs, countResult] = await Promise.all([
    Model.aggregate(aggregation, { collation, session }),
    countPromise,
  ])

  const count = countResult === null ? docs.length : countResult

  const totalPages =
    pagination !== false && typeof limit === 'number' && limit !== 0 ? Math.ceil(count / limit) : 1

  const hasPrevPage = typeof page === 'number' && pagination !== false && page > 1
  const hasNextPage = typeof page === 'number' && pagination !== false && totalPages > page
  const pagingCounter =
    typeof page === 'number' && pagination !== false && typeof limit === 'number'
      ? (page - 1) * limit + 1
      : 1

  const result: PaginatedDocs = {
    docs,
    hasNextPage,
    hasPrevPage,
    limit: limit ?? 0,
    nextPage: hasNextPage ? page + 1 : null,
    page,
    pagingCounter,
    prevPage: hasPrevPage ? page - 1 : null,
    totalDocs: count,
    totalPages,
  }

  return result
}
```

--------------------------------------------------------------------------------

---[FILE: buildJoinAggregation.ts]---
Location: payload-main/packages/db-mongodb/src/utilities/buildJoinAggregation.ts

```typescript
import type { PipelineStage } from 'mongoose'

import {
  APIError,
  appendVersionToQueryKey,
  buildVersionCollectionFields,
  type CollectionSlug,
  combineQueries,
  type FlattenedField,
  getQueryDraftsSort,
  type JoinQuery,
  type SanitizedCollectionConfig,
} from 'payload'
import { fieldShouldBeLocalized, hasDraftsEnabled } from 'payload/shared'

import type { MongooseAdapter } from '../index.js'
import type { CollectionModel } from '../types.js'

import { buildQuery } from '../queries/buildQuery.js'
import { buildSortParam } from '../queries/buildSortParam.js'
import { getCollection } from './getEntity.js'

type BuildJoinAggregationArgs = {
  adapter: MongooseAdapter
  collection: CollectionSlug
  collectionConfig: SanitizedCollectionConfig
  draftsEnabled?: boolean
  joins?: JoinQuery
  locale?: string
  projection?: Record<string, true>
  // the where clause for the top collection
  query?: Record<string, unknown>
  /** whether the query is from drafts */
  versions?: boolean
}

export const buildJoinAggregation = async ({
  adapter,
  collection,
  collectionConfig,
  draftsEnabled,
  joins,
  locale,
  projection,
  versions,
}: BuildJoinAggregationArgs): Promise<PipelineStage[] | undefined> => {
  if (!adapter.useJoinAggregations) {
    return
  }
  if (
    (Object.keys(collectionConfig.joins).length === 0 &&
      collectionConfig.polymorphicJoins.length == 0) ||
    joins === false
  ) {
    return
  }

  const joinConfig = adapter.payload.collections[collection]?.config?.joins

  if (!joinConfig) {
    throw new APIError(`Could not retrieve sanitized join config for ${collection}.`)
  }

  const aggregate: PipelineStage[] = []
  const polymorphicJoinsConfig = adapter.payload.collections[collection]?.config?.polymorphicJoins

  if (!polymorphicJoinsConfig) {
    throw new APIError(`Could not retrieve sanitized polymorphic joins config for ${collection}.`)
  }

  for (const join of polymorphicJoinsConfig) {
    if (projection && !projection[join.joinPath]) {
      continue
    }

    if (joins?.[join.joinPath] === false) {
      continue
    }

    const {
      count = false,
      limit: limitJoin = join.field.defaultLimit ?? 10,
      page,
      sort: sortJoin = join.field.defaultSort || collectionConfig.defaultSort,
      where: whereJoin = {},
    } = joins?.[join.joinPath] || {}

    const aggregatedFields: FlattenedField[] = []
    for (const collectionSlug of join.field.collection) {
      const { collectionConfig } = getCollection({ adapter, collectionSlug })

      for (const field of collectionConfig.flattenedFields) {
        if (!aggregatedFields.some((eachField) => eachField.name === field.name)) {
          aggregatedFields.push(field)
        }
      }
    }

    const sort = buildSortParam({
      adapter,
      config: adapter.payload.config,
      fields: aggregatedFields,
      locale,
      sort: sortJoin,
      timestamps: true,
    })

    const $match = await buildQuery({
      adapter,
      fields: aggregatedFields,
      locale,
      where: whereJoin,
    })

    const sortProperty = Object.keys(sort)[0]! // assert because buildSortParam always returns at least 1 key.
    const sortDirection = sort[sortProperty] === 'asc' ? 1 : -1

    const projectSort = sortProperty !== '_id' && sortProperty !== 'relationTo'

    const aliases: string[] = []

    const as = join.joinPath

    for (const collectionSlug of join.field.collection) {
      const alias = `${as}.docs.${collectionSlug}`
      aliases.push(alias)

      const basePipeline = [
        {
          $addFields: {
            relationTo: {
              $literal: collectionSlug,
            },
          },
        },
        {
          $match: {
            $and: [
              {
                $expr: {
                  $eq: [`$${join.field.on}`, '$$root_id_'],
                },
              },
              $match,
            ],
          },
        },
      ]

      const { Model: JoinModel } = getCollection({ adapter, collectionSlug })

      aggregate.push({
        $lookup: {
          as: alias,
          from: JoinModel.collection.name,
          let: {
            root_id_: '$_id',
          },
          pipeline: [
            ...basePipeline,
            {
              $sort: {
                [sortProperty]: sortDirection,
              },
            },
            {
              // Unfortunately, we can't use $skip here because we can lose data, instead we do $slice then
              $limit: page ? page * limitJoin : limitJoin,
            },
            {
              $project: {
                value: '$_id',
                ...(projectSort && {
                  [sortProperty]: 1,
                }),
                relationTo: 1,
              },
            },
          ],
        },
      })

      if (count) {
        aggregate.push({
          $lookup: {
            as: `${as}.totalDocs.${alias}`,
            from: JoinModel.collection.name,
            let: {
              root_id_: '$_id',
            },
            pipeline: [
              ...basePipeline,
              {
                $count: 'result',
              },
            ],
          },
        })
      }
    }

    aggregate.push({
      $addFields: {
        [`${as}.docs`]: {
          $concatArrays: aliases.map((alias) => `$${alias}`),
        },
      },
    })

    if (count) {
      aggregate.push({
        $addFields: {
          [`${as}.totalDocs`]: {
            $add: aliases.map((alias) => ({
              $ifNull: [
                {
                  $first: `$${as}.totalDocs.${alias}.result`,
                },
                0,
              ],
            })),
          },
        },
      })
    }

    aggregate.push({
      $set: {
        [`${as}.docs`]: {
          $sortArray: {
            input: `$${as}.docs`,
            sortBy: {
              [sortProperty]: sortDirection,
            },
          },
        },
      },
    })

    const sliceValue = page ? [(page - 1) * limitJoin, limitJoin] : [limitJoin]

    aggregate.push({
      $addFields: {
        [`${as}.hasNextPage`]: {
          $gt: [{ $size: `$${as}.docs` }, limitJoin || Number.MAX_VALUE],
        },
      },
    })

    aggregate.push({
      $set: {
        [`${as}.docs`]: {
          $slice: [`$${as}.docs`, ...sliceValue],
        },
      },
    })
  }

  for (const slug of Object.keys(joinConfig)) {
    const joinsList = joinConfig[slug]

    if (!joinsList) {
      throw new APIError(`Failed to retrieve array of joins for ${slug} in collectio ${collection}`)
    }

    for (const join of joinsList) {
      if (projection && !projection[join.joinPath]) {
        continue
      }

      if (joins?.[join.joinPath] === false) {
        continue
      }

      const collectionConfig = adapter.payload.collections[join.field.collection as string]?.config

      if (!collectionConfig) {
        throw new APIError(
          `Collection config for ${join.field.collection.toString()} was not found`,
        )
      }

      let JoinModel: CollectionModel | undefined

      const useDrafts = (draftsEnabled || versions) && hasDraftsEnabled(collectionConfig)

      if (useDrafts) {
        JoinModel = adapter.versions[collectionConfig.slug]
      } else {
        JoinModel = adapter.collections[collectionConfig.slug]
      }

      if (!JoinModel) {
        throw new APIError(`Join Model was not found for ${collectionConfig.slug}`)
      }

      const {
        count,
        limit: limitJoin = join.field.defaultLimit ?? 10,
        page,
        sort: sortJoin = join.field.defaultSort || collectionConfig.defaultSort,
        where: whereJoin = {},
      } = joins?.[join.joinPath] || {}

      if (Array.isArray(join.field.collection)) {
        throw new Error('Unreachable')
      }

      const fields = useDrafts
        ? buildVersionCollectionFields(adapter.payload.config, collectionConfig, true)
        : collectionConfig.flattenedFields

      const sort = buildSortParam({
        adapter,
        config: adapter.payload.config,
        fields,
        locale,
        sort: useDrafts ? getQueryDraftsSort({ collectionConfig, sort: sortJoin }) : sortJoin,
        timestamps: true,
      })
      const sortProperty = Object.keys(sort)[0]!
      const sortDirection = sort[sortProperty] === 'asc' ? 1 : -1

      const $match = await JoinModel.buildQuery({
        locale,
        payload: adapter.payload,
        where: useDrafts
          ? combineQueries(appendVersionToQueryKey(whereJoin), {
              latest: {
                equals: true,
              },
            })
          : whereJoin,
      })

      const pipeline: Exclude<PipelineStage, PipelineStage.Merge | PipelineStage.Out>[] = [
        { $match },
        {
          $sort: { [sortProperty]: sortDirection },
        },
      ]

      if (page) {
        pipeline.push({
          $skip: (page - 1) * limitJoin,
        })
      }

      if (limitJoin > 0) {
        pipeline.push({
          $limit: limitJoin + 1,
        })
      }

      let polymorphicSuffix = ''
      if (Array.isArray(join.targetField.relationTo)) {
        polymorphicSuffix = '.value'
      }

      const addTotalDocsAggregation = (as: string, foreignField: string) =>
        aggregate.push(
          {
            $lookup: {
              as: `${as}.totalDocs`,
              foreignField,
              from: JoinModel.collection.name,
              localField: versions ? 'parent' : '_id',
              pipeline: [
                {
                  $match,
                },
                {
                  $count: 'result',
                },
              ],
            },
          },
          {
            $addFields: {
              [`${as}.totalDocs`]: { $ifNull: [{ $first: `$${as}.totalDocs.result` }, 0] },
            },
          },
        )

      let foreignFieldPrefix = ''

      if (useDrafts) {
        foreignFieldPrefix = 'version.'
      }

      if (adapter.payload.config.localization && locale === 'all') {
        adapter.payload.config.localization.localeCodes.forEach((code) => {
          const as = `${versions ? `version.${join.joinPath}` : join.joinPath}${code}`

          aggregate.push(
            {
              $lookup: {
                as: `${as}.docs`,
                foreignField: `${foreignFieldPrefix}${join.field.on}${code}${polymorphicSuffix}`,
                from: JoinModel.collection.name,
                localField: versions ? 'parent' : '_id',
                pipeline,
              },
            },
            {
              $addFields: {
                [`${as}.docs`]: {
                  $map: {
                    as: 'doc',
                    in: useDrafts ? `$$doc.parent` : '$$doc._id',
                    input: `$${as}.docs`,
                  },
                }, // Slicing the docs to match the limit
                [`${as}.hasNextPage`]: limitJoin
                  ? { $gt: [{ $size: `$${as}.docs` }, limitJoin] }
                  : false,
                // Boolean indicating if more docs than limit
              },
            },
          )

          if (limitJoin > 0) {
            aggregate.push({
              $addFields: {
                [`${as}.docs`]: {
                  $slice: [`$${as}.docs`, limitJoin],
                },
              },
            })
          }

          if (count) {
            addTotalDocsAggregation(
              as,
              `${foreignFieldPrefix}${join.field.on}${code}${polymorphicSuffix}`,
            )
          }
        })
      } else {
        const localeSuffix =
          fieldShouldBeLocalized({
            field: join.field,
            parentIsLocalized: join.parentIsLocalized,
          }) &&
          adapter.payload.config.localization &&
          locale
            ? `.${locale}`
            : ''
        const as = `${versions ? `version.${join.joinPath}` : join.joinPath}${localeSuffix}`

        let foreignField: string

        if (join.getForeignPath) {
          foreignField = `${join.getForeignPath({ locale })}${polymorphicSuffix}`
        } else {
          foreignField = `${join.field.on}${polymorphicSuffix}`
        }

        aggregate.push(
          {
            $lookup: {
              as: `${as}.docs`,
              foreignField: `${foreignFieldPrefix}${foreignField}`,
              from: JoinModel.collection.name,
              localField: versions ? 'parent' : '_id',
              pipeline,
            },
          },
          {
            $addFields: {
              [`${as}.docs`]: {
                $map: {
                  as: 'doc',
                  in: useDrafts ? `$$doc.parent` : '$$doc._id',
                  input: `$${as}.docs`,
                },
              }, // Slicing the docs to match the limit
              [`${as}.hasNextPage`]: {
                $gt: [{ $size: `$${as}.docs` }, limitJoin || Number.MAX_VALUE],
              }, // Boolean indicating if more docs than limit
            },
          },
        )

        if (count) {
          addTotalDocsAggregation(as, `${foreignFieldPrefix}${foreignField}`)
        }

        if (limitJoin > 0) {
          aggregate.push({
            $addFields: {
              [`${as}.docs`]: {
                $slice: [`$${as}.docs`, limitJoin],
              },
            },
          })
        }
      }
    }
  }

  return aggregate
}
```

--------------------------------------------------------------------------------

---[FILE: buildProjectionFromSelect.ts]---
Location: payload-main/packages/db-mongodb/src/utilities/buildProjectionFromSelect.ts

```typescript
import type {
  FieldAffectingData,
  FlattenedField,
  SelectIncludeType,
  SelectMode,
  SelectType,
} from 'payload'

import {
  deepCopyObjectSimple,
  fieldAffectsData,
  fieldShouldBeLocalized,
  getSelectMode,
} from 'payload/shared'

import type { MongooseAdapter } from '../index.js'

const addFieldToProjection = ({
  adapter,
  databaseSchemaPath,
  field,
  parentIsLocalized,
  projection,
}: {
  adapter: MongooseAdapter
  databaseSchemaPath: string
  field: FieldAffectingData
  parentIsLocalized: boolean
  projection: Record<string, true>
}) => {
  const { config } = adapter.payload

  if (parentIsLocalized && config.localization) {
    for (const locale of config.localization.localeCodes) {
      const localeDatabaseSchemaPath = databaseSchemaPath.replace('<locale>', locale)
      projection[`${localeDatabaseSchemaPath}${field.name}`] = true
    }
  } else {
    projection[`${databaseSchemaPath}${field.name}`] = true
  }
}

const traverseFields = ({
  adapter,
  databaseSchemaPath = '',
  fields,
  parentIsLocalized = false,
  projection,
  select,
  selectAllOnCurrentLevel = false,
  selectMode,
}: {
  adapter: MongooseAdapter
  databaseSchemaPath?: string
  fields: FlattenedField[]
  parentIsLocalized?: boolean
  projection: Record<string, true>
  select: SelectType
  selectAllOnCurrentLevel?: boolean
  selectMode: SelectMode
}) => {
  for (const field of fields) {
    if (fieldAffectsData(field)) {
      if (selectMode === 'include') {
        if (select[field.name] === true || selectAllOnCurrentLevel) {
          addFieldToProjection({
            adapter,
            databaseSchemaPath,
            field,
            parentIsLocalized,
            projection,
          })
          continue
        }

        if (!select[field.name]) {
          continue
        }
      }

      if (selectMode === 'exclude') {
        if (typeof select[field.name] === 'undefined') {
          addFieldToProjection({
            adapter,
            databaseSchemaPath,
            field,
            parentIsLocalized,
            projection,
          })
          continue
        }

        if (select[field.name] === false) {
          continue
        }
      }
    }

    let fieldDatabaseSchemaPath = databaseSchemaPath

    if (fieldAffectsData(field)) {
      fieldDatabaseSchemaPath = `${databaseSchemaPath}${field.name}.`

      if (fieldShouldBeLocalized({ field, parentIsLocalized })) {
        fieldDatabaseSchemaPath = `${fieldDatabaseSchemaPath}<locale>.`
      }
    }

    switch (field.type) {
      case 'array':
      case 'group':
      case 'tab': {
        const fieldSelect = select[field.name] as SelectType

        if (field.type === 'array' && selectMode === 'include') {
          fieldSelect.id = true
        }

        traverseFields({
          adapter,
          databaseSchemaPath: fieldDatabaseSchemaPath,
          fields: field.flattenedFields,
          parentIsLocalized: parentIsLocalized || field.localized,
          projection,
          select: fieldSelect,
          selectMode,
        })

        break
      }
      case 'blocks': {
        const blocksSelect = select[field.name] as SelectType

        for (const _block of field.blockReferences ?? field.blocks) {
          const block = typeof _block === 'string' ? adapter.payload.blocks[_block] : _block

          if (!block) {
            continue
          }

          if (
            (selectMode === 'include' && blocksSelect[block.slug] === true) ||
            (selectMode === 'exclude' && typeof blocksSelect[block.slug] === 'undefined')
          ) {
            traverseFields({
              adapter,
              databaseSchemaPath: fieldDatabaseSchemaPath,
              fields: block.flattenedFields,
              parentIsLocalized: parentIsLocalized || field.localized,
              projection,
              select: {},
              selectAllOnCurrentLevel: true,
              selectMode: 'include',
            })
            continue
          }

          let blockSelectMode = selectMode

          if (selectMode === 'exclude' && blocksSelect[block.slug] === false) {
            blockSelectMode = 'include'
          }

          if (typeof blocksSelect[block.slug] !== 'object') {
            blocksSelect[block.slug] = {}
          }

          if (blockSelectMode === 'include' && typeof blocksSelect[block.slug] === 'object') {
            const blockSelect = blocksSelect[block.slug] as SelectIncludeType
            blockSelect.id = true
            blockSelect.blockType = true
          }

          traverseFields({
            adapter,
            databaseSchemaPath: fieldDatabaseSchemaPath,
            fields: block.flattenedFields,
            parentIsLocalized: parentIsLocalized || field.localized,
            projection,
            select: blocksSelect[block.slug] as SelectType,
            selectMode: blockSelectMode,
          })
        }

        break
      }

      default:
        break
    }
  }
}

export const buildProjectionFromSelect = ({
  adapter,
  fields,
  select,
}: {
  adapter: MongooseAdapter
  fields: FlattenedField[]
  select?: SelectType
}): Record<string, true> | undefined => {
  if (!select) {
    return
  }

  const projection: Record<string, true> = {
    _id: true,
  }

  traverseFields({
    adapter,
    fields,
    projection,
    // Clone to safely mutate it later
    select: deepCopyObjectSimple(select),
    selectMode: getSelectMode(select),
  })

  return projection
}
```

--------------------------------------------------------------------------------

````
