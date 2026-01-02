---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 129
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 129 of 695)

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

---[FILE: compatibilityOptions.ts]---
Location: payload-main/packages/db-mongodb/src/utilities/compatibilityOptions.ts

```typescript
import type { Args } from '../index.js'

/**
 * Each key is a mongo-compatible database and the value
 * is the recommended `mongooseAdapter` settings for compatibility.
 */
export const compatibilityOptions = {
  cosmosdb: {
    transactionOptions: false,
    useJoinAggregations: false,
    usePipelineInSortLookup: false,
  },
  documentdb: {
    disableIndexHints: true,
    useJoinAggregations: false,
  },
  firestore: {
    disableIndexHints: true,
    ensureIndexes: false,
    transactionOptions: false,
    useAlternativeDropDatabase: true,
    useBigIntForNumberIDs: true,
    useJoinAggregations: false,
    usePipelineInSortLookup: false,
  },
} satisfies Record<string, Partial<Args>>
```

--------------------------------------------------------------------------------

---[FILE: getDBName.ts]---
Location: payload-main/packages/db-mongodb/src/utilities/getDBName.ts

```typescript
import { APIError, type DBIdentifierName } from 'payload'

type Args = {
  config: {
    dbName?: DBIdentifierName
    enumName?: DBIdentifierName
    name?: string
    slug?: string
  }
  locales?: boolean
  target?: 'dbName' | 'enumName'
  versions?: boolean
}

/**
 * Used to name database enums and collections
 * Returns the collection or enum name for a given entity
 */
export const getDBName = ({
  config: { name, slug },
  config,
  target = 'dbName',
  versions = false,
}: Args): string => {
  let result: null | string = null
  let custom = config[target]

  if (!custom && target === 'enumName') {
    custom = config['dbName']
  }

  if (custom) {
    result = typeof custom === 'function' ? custom({}) : custom
  } else {
    result = name ?? slug ?? null
  }

  if (versions) {
    result = `_${result}_versions`
  }

  if (!result) {
    throw new APIError(`Assertion for DB name of ${name} ${slug} was failed.`)
  }

  return result
}
```

--------------------------------------------------------------------------------

---[FILE: getEntity.ts]---
Location: payload-main/packages/db-mongodb/src/utilities/getEntity.ts

```typescript
import type { Collection, SanitizedCollectionConfig, SanitizedGlobalConfig } from 'payload'

import { APIError } from 'payload'

import type { MongooseAdapter } from '../index.js'
import type { CollectionModel, GlobalModel } from '../types.js'

export const getCollection = ({
  adapter,
  collectionSlug,
  versions = false,
}: {
  adapter: MongooseAdapter
  collectionSlug: string
  versions?: boolean
}): {
  collectionConfig: SanitizedCollectionConfig
  customIDType: Collection['customIDType']

  Model: CollectionModel
} => {
  const collection = adapter.payload.collections[collectionSlug]

  if (!collection) {
    throw new APIError(
      `ERROR: Failed to retrieve collection with the slug "${collectionSlug}". Does not exist.`,
    )
  }

  if (versions) {
    const Model = adapter.versions[collectionSlug]

    if (!Model) {
      throw new APIError(
        `ERROR: Failed to retrieve collection version model with the slug "${collectionSlug}". Does not exist.`,
      )
    }

    return { collectionConfig: collection.config, customIDType: collection.customIDType, Model }
  }

  const Model = adapter.collections[collectionSlug]

  if (!Model) {
    throw new APIError(
      `ERROR: Failed to retrieve collection model with the slug "${collectionSlug}". Does not exist.`,
    )
  }

  return { collectionConfig: collection.config, customIDType: collection.customIDType, Model }
}

type BaseGetGlobalArgs = {
  adapter: MongooseAdapter
  globalSlug: string
}

interface GetGlobal {
  (args: { versions?: false | undefined } & BaseGetGlobalArgs): {
    globalConfig: SanitizedGlobalConfig
    Model: GlobalModel
  }
  (args: { versions?: true } & BaseGetGlobalArgs): {
    globalConfig: SanitizedGlobalConfig
    Model: CollectionModel
  }
}

export const getGlobal: GetGlobal = ({ adapter, globalSlug, versions = false }) => {
  const globalConfig = adapter.payload.config.globals.find((each) => each.slug === globalSlug)

  if (!globalConfig) {
    throw new APIError(
      `ERROR: Failed to retrieve global with the slug "${globalSlug}". Does not exist.`,
    )
  }

  if (versions) {
    const Model = adapter.versions[globalSlug]

    if (!Model) {
      throw new APIError(
        `ERROR: Failed to retrieve global version model with the slug "${globalSlug}". Does not exist.`,
      )
    }

    return { globalConfig, Model }
  }

  return { globalConfig, Model: adapter.globals } as any
}
```

--------------------------------------------------------------------------------

---[FILE: getSession.ts]---
Location: payload-main/packages/db-mongodb/src/utilities/getSession.ts

```typescript
import type { ClientSession } from 'mongoose'
import type { PayloadRequest } from 'payload'

import type { MongooseAdapter } from '../index.js'

/**
 * returns the session belonging to the transaction of the req.session if exists
 * @returns ClientSession
 */
export async function getSession(
  db: MongooseAdapter,
  req?: Partial<PayloadRequest>,
): Promise<ClientSession | undefined> {
  if (!req) {
    return
  }

  let transactionID = req.transactionID

  if (transactionID instanceof Promise) {
    transactionID = await req.transactionID
  }

  if (transactionID) {
    const session = db.sessions[transactionID]

    // Defensive check for race conditions where:
    // 1. Session was retrieved from db.sessions
    // 2. Another operation committed/rolled back and ended the session
    // 3. This operation tries to use the now-ended session
    // Note: This shouldn't normally happen as sessions are deleted from db.sessions
    // after commit/rollback, but can occur due to async timing where we hold
    // a reference to a session object that gets ended before we use it.
    if (session && !session.inTransaction()) {
      // Clean up the orphaned session reference
      delete db.sessions[transactionID]
      return undefined
    }

    return session
  }
}
```

--------------------------------------------------------------------------------

---[FILE: handleError.ts]---
Location: payload-main/packages/db-mongodb/src/utilities/handleError.ts

```typescript
import type { PayloadRequest } from 'payload'

import { ValidationError } from 'payload'

function extractFieldFromMessage(message: string) {
  // eslint-disable-next-line regexp/no-super-linear-backtracking
  const match = message.match(/index:\s*(.*?)_/)
  if (match && match[1]) {
    return match[1] // e.g., returns "email" from "index: email_1"
  }
  return null
}

export const handleError = ({
  collection,
  error,
  global,
  req,
}: {
  collection?: string
  error: unknown
  global?: string
  req?: Partial<PayloadRequest>
}) => {
  if (!error || typeof error !== 'object') {
    throw error
  }

  // Handle uniqueness error from MongoDB
  if ('code' in error && error.code === 11000) {
    let path: null | string = null

    if ('keyValue' in error && error.keyValue && typeof error.keyValue === 'object') {
      path = Object.keys(error.keyValue)[0] ?? ''
    } else if ('message' in error && typeof error.message === 'string') {
      path = extractFieldFromMessage(error.message)
    }

    throw new ValidationError(
      {
        collection,
        errors: [
          {
            message: req?.t ? req.t('error:valueMustBeUnique') : 'Value must be unique',
            path: path ?? '',
          },
        ],
        global,
      },
      req?.t,
    )
  }

  // eslint-disable-next-line @typescript-eslint/only-throw-error
  throw error
}
```

--------------------------------------------------------------------------------

---[FILE: isObjectID.ts]---
Location: payload-main/packages/db-mongodb/src/utilities/isObjectID.ts

```typescript
import type { Types } from 'mongoose'

export const isObjectID = (value: unknown): value is Types.ObjectId => {
  if (
    value &&
    typeof value === 'object' &&
    '_bsontype' in value &&
    value._bsontype === 'ObjectId' &&
    'toHexString' in value &&
    typeof value.toHexString === 'function'
  ) {
    return true
  }

  return false
}
```

--------------------------------------------------------------------------------

---[FILE: resolveJoins.ts]---
Location: payload-main/packages/db-mongodb/src/utilities/resolveJoins.ts

```typescript
import type { JoinQuery, SanitizedJoins, Where } from 'payload'

import {
  appendVersionToQueryKey,
  buildVersionCollectionFields,
  combineQueries,
  getQueryDraftsSort,
} from 'payload'
import { fieldShouldBeLocalized } from 'payload/shared'

import type { MongooseAdapter } from '../index.js'

import { buildQuery } from '../queries/buildQuery.js'
import { buildSortParam } from '../queries/buildSortParam.js'
import { transform } from './transform.js'

export type ResolveJoinsArgs = {
  /** The MongoDB adapter instance */
  adapter: MongooseAdapter
  /** The slug of the collection being queried */
  collectionSlug: string
  /** Array of documents to resolve joins for */
  docs: Record<string, unknown>[]
  /** Join query specifications (which joins to resolve and how) */
  joins?: JoinQuery
  /** Optional locale for localized queries */
  locale?: string
  /** Optional projection for the join query */
  projection?: Record<string, true>
  /** Whether to resolve versions instead of published documents */
  versions?: boolean
}

/**
 * Resolves join relationships for a collection of documents.
 * This function fetches related documents based on join configurations and
 * attaches them to the original documents with pagination support.
 */
export async function resolveJoins({
  adapter,
  collectionSlug,
  docs,
  joins,
  locale,
  projection,
  versions = false,
}: ResolveJoinsArgs): Promise<void> {
  // Early return if no joins are specified or no documents to process
  if (!joins || docs.length === 0) {
    return
  }

  // Get the collection configuration from the adapter
  const collectionConfig = adapter.payload.collections[collectionSlug]?.config
  if (!collectionConfig) {
    return
  }

  // Build a map of join paths to their configurations for quick lookup
  // This flattens the nested join structure into a single map keyed by join path
  const joinMap: Record<string, { targetCollection: string } & SanitizedJoin> = {}

  // Add regular joins
  for (const [target, joinList] of Object.entries(collectionConfig.joins)) {
    for (const join of joinList) {
      joinMap[join.joinPath] = { ...join, targetCollection: target }
    }
  }

  // Add polymorphic joins
  for (const join of collectionConfig.polymorphicJoins || []) {
    // For polymorphic joins, we use the collections array as the target
    joinMap[join.joinPath] = { ...join, targetCollection: join.field.collection as string }
  }

  // Process each requested join concurrently
  const joinPromises = Object.entries(joins).map(async ([joinPath, joinQuery]) => {
    if (!joinQuery) {
      return null
    }

    // If a projection is provided, and the join path is not in the projection, skip it
    if (projection && !projection[joinPath]) {
      return null
    }

    // Get the join definition from our map
    const joinDef = joinMap[joinPath]
    if (!joinDef) {
      return null
    }

    // Normalize collections to always be an array for unified processing
    const allCollections = Array.isArray(joinDef.field.collection)
      ? joinDef.field.collection
      : [joinDef.field.collection]

    // Use the provided locale or fall back to the default locale for localized fields
    const localizationConfig = adapter.payload.config.localization
    const effectiveLocale =
      locale ||
      (typeof localizationConfig === 'object' &&
        localizationConfig &&
        localizationConfig.defaultLocale)

    // Extract relationTo filter from the where clause to determine which collections to query
    const relationToFilter = extractRelationToFilter(joinQuery.where || {})

    // Determine which collections to query based on relationTo filter
    const collections = relationToFilter
      ? allCollections.filter((col) => relationToFilter.includes(col))
      : allCollections

    // Check if this is a polymorphic collection join (where field.collection is an array)
    const isPolymorphicJoin = Array.isArray(joinDef.field.collection)

    // Apply pagination settings
    const limit = joinQuery.limit ?? joinDef.field.defaultLimit ?? 10
    const page = joinQuery.page ?? 1
    const skip = (page - 1) * limit

    // Process collections concurrently
    const collectionPromises = collections.map(async (joinCollectionSlug) => {
      const targetConfig = adapter.payload.collections[joinCollectionSlug]?.config
      if (!targetConfig) {
        return null
      }

      const useDrafts = versions && Boolean(targetConfig.versions?.drafts)
      let JoinModel
      if (useDrafts) {
        JoinModel = adapter.versions[targetConfig.slug]
      } else {
        JoinModel = adapter.collections[targetConfig.slug]
      }

      if (!JoinModel) {
        return null
      }

      // Extract all parent document IDs to use in the join query
      const parentIDs = docs.map((d) => (versions ? (d.parent ?? d._id ?? d.id) : (d._id ?? d.id)))

      // Build the base query
      let whereQuery: null | Record<string, unknown> = null
      whereQuery = isPolymorphicJoin
        ? filterWhereForCollection(
            joinQuery.where || {},
            targetConfig.flattenedFields,
            true, // exclude relationTo for individual collections
          )
        : joinQuery.where || {}

      // Skip this collection if the WHERE clause cannot be satisfied for polymorphic collection joins
      if (whereQuery === null) {
        return null
      }
      whereQuery = useDrafts
        ? await JoinModel.buildQuery({
            locale,
            payload: adapter.payload,
            where: combineQueries(appendVersionToQueryKey(whereQuery as Where), {
              latest: {
                equals: true,
              },
            }),
          })
        : await buildQuery({
            adapter,
            collectionSlug: joinCollectionSlug,
            fields: targetConfig.flattenedFields,
            locale,
            where: whereQuery as Where,
          })

      // Handle localized paths and version prefixes
      let dbFieldName = joinDef.field.on

      if (effectiveLocale && typeof localizationConfig === 'object' && localizationConfig) {
        const pathSegments = joinDef.field.on.split('.')
        const transformedSegments: string[] = []
        const fields = useDrafts
          ? buildVersionCollectionFields(adapter.payload.config, targetConfig, true)
          : targetConfig.flattenedFields

        for (let i = 0; i < pathSegments.length; i++) {
          const segment = pathSegments[i]!
          transformedSegments.push(segment)

          // Check if this segment corresponds to a localized field
          const fieldAtSegment = fields.find((f) => f.name === segment)
          if (fieldAtSegment && fieldAtSegment.localized) {
            transformedSegments.push(effectiveLocale)
          }
        }

        dbFieldName = transformedSegments.join('.')
      }

      // Add version prefix for draft queries
      if (useDrafts) {
        dbFieldName = `version.${dbFieldName}`
      }

      // Check if the target field is a polymorphic relationship
      const isPolymorphic = joinDef.targetField
        ? Array.isArray(joinDef.targetField.relationTo)
        : false

      if (isPolymorphic) {
        // For polymorphic relationships, we need to match both relationTo and value
        whereQuery[`${dbFieldName}.relationTo`] = collectionSlug
        whereQuery[`${dbFieldName}.value`] = { $in: parentIDs }
      } else {
        // For regular relationships and polymorphic collection joins
        whereQuery[dbFieldName] = { $in: parentIDs }
      }

      // Build the sort parameters for the query
      const fields = useDrafts
        ? buildVersionCollectionFields(adapter.payload.config, targetConfig, true)
        : targetConfig.flattenedFields

      const sort = buildSortParam({
        adapter,
        config: adapter.payload.config,
        fields,
        locale,
        sort: useDrafts
          ? getQueryDraftsSort({
              collectionConfig: targetConfig,
              sort: joinQuery.sort || joinDef.field.defaultSort || targetConfig.defaultSort,
            })
          : joinQuery.sort || joinDef.field.defaultSort || targetConfig.defaultSort,
        timestamps: true,
      })

      const projection = buildJoinProjection(dbFieldName, useDrafts, sort)

      const [results, dbCount] = await Promise.all([
        JoinModel.find(whereQuery, projection, {
          sort,
          ...(isPolymorphicJoin ? {} : { limit, skip }),
        }).lean(),
        isPolymorphicJoin ? Promise.resolve(0) : JoinModel.countDocuments(whereQuery),
      ])

      const count = isPolymorphicJoin ? results.length : dbCount

      transform({
        adapter,
        data: results,
        fields: useDrafts
          ? buildVersionCollectionFields(adapter.payload.config, targetConfig, false)
          : targetConfig.fields,
        operation: 'read',
      })

      // Return results with collection info for grouping
      return {
        collectionSlug: joinCollectionSlug,
        count,
        dbFieldName,
        results,
        sort,
        useDrafts,
      }
    })

    const collectionResults = await Promise.all(collectionPromises)

    // Group the results by parent ID
    const grouped: Record<
      string,
      {
        docs: Record<string, unknown>[]
        sort: Record<string, string>
      }
    > = {}

    let totalCount = 0
    for (const collectionResult of collectionResults) {
      if (!collectionResult) {
        continue
      }

      const { collectionSlug, count, dbFieldName, results, sort, useDrafts } = collectionResult

      totalCount += count

      for (const result of results) {
        if (useDrafts) {
          result.id = result.parent
        }

        const parentValues = getByPathWithArrays(result, dbFieldName) as (
          | { relationTo: string; value: number | string }
          | number
          | string
        )[]

        if (parentValues.length === 0) {
          continue
        }

        for (let parentValue of parentValues) {
          if (!parentValue) {
            continue
          }

          if (typeof parentValue === 'object') {
            parentValue = parentValue.value
          }

          const joinData = {
            relationTo: collectionSlug,
            value: result.id,
          }

          const parentKey = parentValue as string
          if (!grouped[parentKey]) {
            grouped[parentKey] = {
              docs: [],
              sort,
            }
          }

          // Always store the ObjectID reference in polymorphic format
          grouped[parentKey].docs.push({
            ...result,
            __joinData: joinData,
          })
        }
      }
    }

    for (const results of Object.values(grouped)) {
      results.docs.sort((a, b) => {
        for (const [fieldName, sortOrder] of Object.entries(results.sort)) {
          const sort = sortOrder === 'asc' ? 1 : -1
          const aValue = a[fieldName] as Date | number | string
          const bValue = b[fieldName] as Date | number | string
          if (aValue < bValue) {
            return -1 * sort
          }
          if (aValue > bValue) {
            return 1 * sort
          }
        }
        return 0
      })
      results.docs = results.docs.map(
        (doc) => (isPolymorphicJoin ? doc.__joinData : doc.id) as Record<string, unknown>,
      )
    }

    // Determine if the join field should be localized
    const localeSuffix =
      fieldShouldBeLocalized({
        field: joinDef.field,
        parentIsLocalized: joinDef.parentIsLocalized,
      }) &&
      adapter.payload.config.localization &&
      effectiveLocale
        ? `.${effectiveLocale}`
        : ''

    // Adjust the join path with locale suffix if needed
    const localizedJoinPath = `${joinPath}${localeSuffix}`

    return {
      grouped,
      isPolymorphicJoin,
      joinQuery,
      limit,
      localizedJoinPath,
      page,
      skip,
      totalCount,
    }
  })

  // Wait for all join operations to complete
  const joinResults = await Promise.all(joinPromises)

  // Process the results and attach them to documents
  for (const joinResult of joinResults) {
    if (!joinResult) {
      continue
    }

    const { grouped, isPolymorphicJoin, joinQuery, limit, localizedJoinPath, skip, totalCount } =
      joinResult

    // Attach the joined data to each parent document
    for (const doc of docs) {
      const id = (versions ? (doc.parent ?? doc._id ?? doc.id) : (doc._id ?? doc.id)) as string
      const all = grouped[id]?.docs || []

      // Calculate the slice for pagination
      // When limit is 0, it means unlimited - return all results
      const slice = isPolymorphicJoin
        ? limit === 0
          ? all
          : all.slice(skip, skip + limit)
        : // For non-polymorphic joins, we assume that page and limit were applied at the database level
          all

      // Create the join result object with pagination metadata
      const value: Record<string, unknown> = {
        docs: slice,
        hasNextPage: limit === 0 ? false : totalCount > skip + slice.length,
      }

      // Include total count if requested
      if (joinQuery.count) {
        value.totalDocs = totalCount
      }

      // Navigate to the correct nested location in the document and set the join data
      // This handles nested join paths like "user.posts" by creating intermediate objects
      const segments = localizedJoinPath.split('.')
      let ref: Record<string, unknown>
      if (versions) {
        if (!doc.version) {
          doc.version = {}
        }
        ref = doc.version as Record<string, unknown>
      } else {
        ref = doc
      }

      for (let i = 0; i < segments.length - 1; i++) {
        const seg = segments[i]!
        if (!ref[seg]) {
          ref[seg] = {}
        }
        ref = ref[seg] as Record<string, unknown>
      }
      // Set the final join data at the target path
      ref[segments[segments.length - 1]!] = value
    }
  }
}

/**
 * Extracts relationTo filter values from a WHERE clause
 *
 * @purpose When you have a polymorphic join field that can reference multiple collection types (e.g. the documentsAndFolders join field on
 * folders that points to all folder-enabled collections), Payload needs to decide which collections to actually query. Without filtering,
 * it would query ALL possible collections even when the WHERE clause clearly indicates it only needs specific ones.
 *
 * extractRelationToFilter analyzes the WHERE clause to extract relationTo conditions and returns only the collection slugs that
 * could possibly match, avoiding unnecessary database queries.
 *
 * @description The function recursively traverses a WHERE clause looking for relationTo conditions in these patterns:
 *
 * 1. Direct conditions: { relationTo: { equals: 'posts' } }
 * 2. IN conditions: { relationTo: { in: ['posts', 'media'] } }
 * 3. Nested in AND/OR: Recursively searches through logical operators

 * @param where - The WHERE clause to search
 * @returns Array of collection slugs if relationTo filter found, null otherwise
 */
function extractRelationToFilter(where: Record<string, unknown>): null | string[] {
  if (!where || typeof where !== 'object') {
    return null
  }

  // Check for direct relationTo conditions
  if (where.relationTo && typeof where.relationTo === 'object') {
    const relationTo = where.relationTo as Record<string, unknown>
    if (relationTo.in && Array.isArray(relationTo.in)) {
      return relationTo.in as string[]
    }
    if (relationTo.equals) {
      return [relationTo.equals as string]
    }
  }

  // Check for relationTo in logical operators
  if (where.and && Array.isArray(where.and)) {
    const allResults: string[] = []
    for (const condition of where.and) {
      const result = extractRelationToFilter(condition)
      if (result) {
        allResults.push(...result)
      }
    }
    if (allResults.length > 0) {
      return [...new Set(allResults)] // Remove duplicates
    }
  }

  if (where.or && Array.isArray(where.or)) {
    const allResults: string[] = []
    for (const condition of where.or) {
      const result = extractRelationToFilter(condition)
      if (result) {
        allResults.push(...result)
      }
    }
    if (allResults.length > 0) {
      return [...new Set(allResults)] // Remove duplicates
    }
  }

  return null
}

/**
 * Filters a WHERE clause to only include fields that exist in the target collection
 * This is needed for polymorphic joins where different collections have different fields
 * @param where - The original WHERE clause
 * @param availableFields - The fields available in the target collection
 * @param excludeRelationTo - Whether to exclude relationTo field (for individual collections)
 * @returns A filtered WHERE clause, or null if the query cannot match this collection
 */
function filterWhereForCollection(
  where: Record<string, unknown>,
  availableFields: Array<{ name: string }>,
  excludeRelationTo: boolean = false,
): null | Record<string, unknown> {
  if (!where || typeof where !== 'object') {
    return where
  }

  const fieldNames = new Set(availableFields.map((f) => f.name))
  // Add special fields that are available in polymorphic relationships
  if (!excludeRelationTo) {
    fieldNames.add('relationTo')
  }

  const filtered: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(where)) {
    if (key === 'and') {
      // Handle AND operator - all conditions must be satisfiable
      if (Array.isArray(value)) {
        const filteredConditions: Record<string, unknown>[] = []

        for (const condition of value) {
          const filteredCondition = filterWhereForCollection(
            condition,
            availableFields,
            excludeRelationTo,
          )

          // If any condition in AND cannot be satisfied, the whole AND fails
          if (filteredCondition === null) {
            return null
          }

          if (Object.keys(filteredCondition).length > 0) {
            filteredConditions.push(filteredCondition)
          }
        }

        if (filteredConditions.length > 0) {
          filtered[key] = filteredConditions
        }
      }
    } else if (key === 'or') {
      // Handle OR operator - at least one condition must be satisfiable
      if (Array.isArray(value)) {
        const filteredConditions = value
          .map((condition) =>
            filterWhereForCollection(condition, availableFields, excludeRelationTo),
          )
          .filter((condition) => condition !== null && Object.keys(condition).length > 0)

        if (filteredConditions.length > 0) {
          filtered[key] = filteredConditions
        }
        // If no OR conditions can be satisfied, we still continue (OR is more permissive)
      }
    } else if (key === 'relationTo' && excludeRelationTo) {
      // Skip relationTo field for non-polymorphic collections
      continue
    } else if (fieldNames.has(key)) {
      // Include the condition if the field exists in this collection
      filtered[key] = value
    } else {
      // Field doesn't exist in this collection - this makes the query unsatisfiable
      return null
    }
  }

  return filtered
}

type SanitizedJoin = SanitizedJoins[string][number]

/**
 * Builds projection for join queries
 */
function buildJoinProjection(
  baseFieldName: string,
  useDrafts: boolean,
  sort: Record<string, string>,
): Record<string, 1> {
  const projection: Record<string, 1> = {
    _id: 1,
    [baseFieldName]: 1,
  }

  if (useDrafts) {
    projection.parent = 1
  }

  for (const fieldName of Object.keys(sort)) {
    projection[fieldName] = 1
  }

  return projection
}

/**
 * Enhanced utility function to safely traverse nested object properties using dot notation
 * Handles arrays by searching through array elements for matching values
 * @param doc - The document to traverse
 * @param path - Dot-separated path (e.g., "array.category")
 * @returns Array of values found at the specified path (for arrays) or single value
 */
function getByPathWithArrays(doc: unknown, path: string): unknown[] {
  const segments = path.split('.')
  let current = doc

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]!

    if (current === undefined || current === null) {
      return []
    }

    // Get the value at the current segment
    const value = (current as Record<string, unknown>)[segment]

    if (value === undefined || value === null) {
      return []
    }

    // If this is the last segment, return the value(s)
    if (i === segments.length - 1) {
      return Array.isArray(value) ? value : [value]
    }

    // If the value is an array and we have more segments to traverse
    if (Array.isArray(value)) {
      const remainingPath = segments.slice(i + 1).join('.')
      const results: unknown[] = []

      // Search through each array element
      for (const item of value) {
        if (item && typeof item === 'object') {
          const subResults = getByPathWithArrays(item, remainingPath)
          results.push(...subResults)
        }
      }

      return results
    }

    // Continue traversing
    current = value
  }

  return []
}
```

--------------------------------------------------------------------------------

---[FILE: transform.spec.ts]---
Location: payload-main/packages/db-mongodb/src/utilities/transform.spec.ts

```typescript
import { flattenAllFields, type Field, type SanitizedConfig } from 'payload'

import { Types } from 'mongoose'

import { transform } from './transform.js'
import type { MongooseAdapter } from '../index.js'

const flattenRelationshipValues = (obj: Record<string, any>, prefix = ''): Record<string, any> => {
  return Object.keys(obj).reduce(
    (acc, key) => {
      const fullKey = prefix ? `${prefix}.${key}` : key
      const value = obj[key]

      if (value && typeof value === 'object' && !(value instanceof Types.ObjectId)) {
        Object.assign(acc, flattenRelationshipValues(value, fullKey))
        // skip relationTo and blockType
      } else if (!fullKey.endsWith('relationTo') && !fullKey.endsWith('blockType')) {
        acc[fullKey] = value
      }

      return acc
    },
    {} as Record<string, any>,
  )
}

const relsFields: Field[] = [
  {
    name: 'rel_1',
    type: 'relationship',
    relationTo: 'rels',
  },
  {
    name: 'rel_1_l',
    type: 'relationship',
    localized: true,
    relationTo: 'rels',
  },
  {
    name: 'rel_2',
    type: 'relationship',
    hasMany: true,
    relationTo: 'rels',
  },
  {
    name: 'rel_2_l',
    type: 'relationship',
    hasMany: true,
    localized: true,
    relationTo: 'rels',
  },
  {
    name: 'rel_3',
    type: 'relationship',
    relationTo: ['rels'],
  },
  {
    name: 'rel_3_l',
    type: 'relationship',
    localized: true,
    relationTo: ['rels'],
  },
  {
    name: 'rel_4',
    type: 'relationship',
    hasMany: true,
    relationTo: ['rels'],
  },
  {
    name: 'rel_4_l',
    type: 'relationship',
    hasMany: true,
    localized: true,
    relationTo: ['rels'],
  },
]

const referenceBlockFields: Field[] = [
  ...relsFields,
  {
    name: 'group',
    type: 'group',
    fields: relsFields,
  },
  {
    name: 'array',
    type: 'array',
    fields: relsFields,
  },
]

const config = {
  blocks: [
    {
      slug: 'reference-block',
      fields: referenceBlockFields,
      flattenedFields: flattenAllFields({ fields: referenceBlockFields }),
    },
  ],
  collections: [
    {
      slug: 'docs',
      fields: [
        ...relsFields,
        {
          name: 'array',
          type: 'array',
          fields: [
            {
              name: 'array',
              type: 'array',
              fields: relsFields,
            },
            {
              name: 'blocks',
              type: 'blocks',
              blocks: [{ slug: 'block', fields: relsFields }],
            },
            ...relsFields,
          ],
        },
        {
          name: 'arrayLocalized',
          type: 'array',
          fields: [
            {
              name: 'array',
              type: 'array',
              fields: relsFields,
            },
            {
              name: 'blocks',
              type: 'blocks',
              blocks: [{ slug: 'block', fields: relsFields }],
            },
            ...relsFields,
          ],
          localized: true,
        },
        {
          name: 'blocks',
          type: 'blocks',
          blocks: [
            {
              slug: 'block',
              fields: [
                ...relsFields,
                {
                  name: 'group',
                  type: 'group',
                  fields: relsFields,
                },
                {
                  name: 'array',
                  type: 'array',
                  fields: relsFields,
                },
              ],
            },
          ],
        },
        {
          name: 'blockReferences',
          type: 'blocks',
          blockReferences: ['reference-block'],
        },
        {
          name: 'group',
          type: 'group',
          fields: [
            ...relsFields,
            {
              name: 'array',
              type: 'array',
              fields: relsFields,
            },
          ],
        },
        {
          name: 'groupLocalized',
          type: 'group',
          fields: [
            ...relsFields,
            {
              name: 'array',
              type: 'array',
              fields: relsFields,
            },
          ],
          localized: true,
        },
        {
          name: 'groupAndRow',
          type: 'group',
          fields: [
            {
              type: 'row',
              fields: [
                ...relsFields,
                {
                  type: 'array',
                  name: 'array',
                  fields: relsFields,
                },
              ],
            },
          ],
        },
        {
          type: 'tabs',
          tabs: [
            {
              name: 'tab',
              fields: relsFields,
            },
            {
              name: 'tabLocalized',
              fields: relsFields,
              localized: true,
            },
            {
              label: 'another',
              fields: [
                {
                  type: 'tabs',
                  tabs: [
                    {
                      name: 'nestedTab',
                      fields: relsFields,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      slug: 'rels',
      fields: [],
    },
  ],
  localization: {
    defaultLocale: 'en',
    localeCodes: ['en', 'es'],
    locales: [
      { code: 'en', label: 'EN' },
      { code: 'es', label: 'ES' },
    ],
  },
} as SanitizedConfig

const relsData = {
  rel_1: new Types.ObjectId().toHexString(),
  rel_1_l: {
    en: new Types.ObjectId().toHexString(),
    es: new Types.ObjectId().toHexString(),
  },
  rel_2: [new Types.ObjectId().toHexString()],
  rel_2_l: {
    en: [new Types.ObjectId().toHexString()],
    es: [new Types.ObjectId().toHexString()],
  },
  rel_3: {
    relationTo: 'rels',
    value: new Types.ObjectId().toHexString(),
  },
  rel_3_l: {
    en: {
      relationTo: 'rels',
      value: new Types.ObjectId().toHexString(),
    },
    es: {
      relationTo: 'rels',
      value: new Types.ObjectId().toHexString(),
    },
  },
  rel_4: [
    {
      relationTo: 'rels',
      value: new Types.ObjectId().toHexString(),
    },
  ],
  rel_4_l: {
    en: [
      {
        relationTo: 'rels',
        value: new Types.ObjectId().toHexString(),
      },
    ],
    es: [
      {
        relationTo: 'rels',
        value: new Types.ObjectId().toHexString(),
      },
    ],
  },
}

describe('transform', () => {
  it('should sanitize relationships', () => {
    const data = {
      ...relsData,
      array: [
        {
          ...relsData,
          array: [{ ...relsData }],
          blocks: [
            {
              blockType: 'block',
              ...relsData,
            },
          ],
        },
      ],
      arrayLocalized: {
        en: [
          {
            ...relsData,
            array: [{ ...relsData }],
            blocks: [
              {
                blockType: 'block',
                ...relsData,
              },
            ],
          },
        ],
        es: [
          {
            ...relsData,
            array: [{ ...relsData }],
            blocks: [
              {
                blockType: 'block',
                ...relsData,
              },
            ],
          },
        ],
      },
      blocks: [
        {
          blockType: 'block',
          ...relsData,
          array: [{ ...relsData }],
          group: { ...relsData },
        },
      ],
      blockReferences: [
        {
          blockType: 'reference-block',
          array: [{ ...relsData }],
          group: { ...relsData },
          ...relsData,
        },
      ],
      group: {
        ...relsData,
        array: [{ ...relsData }],
      },
      groupAndRow: {
        ...relsData,
        array: [{ ...relsData }],
      },
      groupLocalized: {
        en: {
          ...relsData,
          array: [{ ...relsData }],
        },
        es: {
          ...relsData,
          array: [{ ...relsData }],
        },
      },
      tab: { ...relsData },
      tabLocalized: {
        en: { ...relsData },
        es: { ...relsData },
      },
      nestedTab: { ...relsData },
    }
    const flattenValuesBefore = Object.values(flattenRelationshipValues(data))

    const mockAdapter = {
      payload: {
        config,
      },
    } as MongooseAdapter

    transform({
      adapter: mockAdapter,
      operation: 'write',
      data,
      fields: config.collections[0].fields,
    })
    if ('updatedAt' in data) {
      delete data.updatedAt
    }

    const flattenValuesAfter = Object.values(flattenRelationshipValues(data))

    flattenValuesAfter.forEach((value, i) => {
      expect(value).toBeInstanceOf(Types.ObjectId)
      expect(flattenValuesBefore[i]).toBe(value.toHexString())
    })
  })
})
```

--------------------------------------------------------------------------------

````
