---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 186
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 186 of 695)

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

---[FILE: findByID.ts]---
Location: payload-main/packages/payload/src/collections/operations/findByID.ts

```typescript
import type { FindOneArgs } from '../../database/types.js'
import type { CollectionSlug, JoinQuery } from '../../index.js'
import type {
  ApplyDisableErrors,
  JsonObject,
  PayloadRequest,
  PopulateType,
  SelectType,
  TransformCollectionWithSelect,
} from '../../types/index.js'
import type {
  Collection,
  DataFromCollectionSlug,
  SelectFromCollectionSlug,
  TypeWithID,
} from '../config/types.js'

import { executeAccess } from '../../auth/executeAccess.js'
import { combineQueries } from '../../database/combineQueries.js'
import { sanitizeJoinQuery } from '../../database/sanitizeJoinQuery.js'
import { sanitizeWhereQuery } from '../../database/sanitizeWhereQuery.js'
import { NotFound } from '../../errors/index.js'
import { afterRead, type AfterReadArgs } from '../../fields/hooks/afterRead/index.js'
import { validateQueryPaths } from '../../index.js'
import { lockedDocumentsCollectionSlug } from '../../locked-documents/config.js'
import { appendNonTrashedFilter } from '../../utilities/appendNonTrashedFilter.js'
import { hasDraftsEnabled } from '../../utilities/getVersionsConfig.js'
import { killTransaction } from '../../utilities/killTransaction.js'
import { sanitizeSelect } from '../../utilities/sanitizeSelect.js'
import { replaceWithDraftIfAvailable } from '../../versions/drafts/replaceWithDraftIfAvailable.js'
import { buildAfterOperation } from './utilities/buildAfterOperation.js'
import { buildBeforeOperation } from './utilities/buildBeforeOperation.js'

export type FindByIDArgs = {
  collection: Collection
  currentDepth?: number
  /**
   * You may pass the document data directly which will skip the `db.findOne` database query.
   * This is useful if you want to use this endpoint solely for running hooks and populating data.
   */
  data?: Record<string, unknown>
  depth?: number
  disableErrors?: boolean
  draft?: boolean
  id: number | string
  includeLockStatus?: boolean
  joins?: JoinQuery
  overrideAccess?: boolean
  populate?: PopulateType
  req: PayloadRequest
  select?: SelectType
  showHiddenFields?: boolean
  trash?: boolean
} & Pick<AfterReadArgs<JsonObject>, 'flattenLocales'>

export const findByIDOperation = async <
  TSlug extends CollectionSlug,
  TDisableErrors extends boolean,
  TSelect extends SelectFromCollectionSlug<TSlug>,
>(
  incomingArgs: FindByIDArgs,
): Promise<ApplyDisableErrors<TransformCollectionWithSelect<TSlug, TSelect>, TDisableErrors>> => {
  let args = incomingArgs

  try {
    // /////////////////////////////////////
    // beforeOperation - Collection
    // /////////////////////////////////////

    args = await buildBeforeOperation({
      args,
      collection: args.collection.config,
      operation: 'read',
    })

    const {
      id,
      collection: { config: collectionConfig },
      currentDepth,
      depth,
      disableErrors,
      draft: replaceWithVersion = false,
      flattenLocales,
      includeLockStatus,
      joins,
      overrideAccess = false,
      populate,
      req: { fallbackLocale, locale, t },
      req,
      select: incomingSelect,
      showHiddenFields,
      trash = false,
    } = args

    const select = sanitizeSelect({
      fields: collectionConfig.flattenedFields,
      forceSelect: collectionConfig.forceSelect,
      select: incomingSelect,
    })

    // /////////////////////////////////////
    // Access
    // /////////////////////////////////////

    const accessResult = !overrideAccess
      ? await executeAccess({ id, disableErrors, req }, collectionConfig.access.read)
      : true

    // If errors are disabled, and access returns false, return null
    if (accessResult === false) {
      return null!
    }

    const where = { id: { equals: id } }

    let fullWhere = combineQueries(where, accessResult)

    // Exclude trashed documents when trash: false
    fullWhere = appendNonTrashedFilter({
      enableTrash: collectionConfig.trash,
      trash,
      where: fullWhere,
    })

    sanitizeWhereQuery({
      fields: collectionConfig.flattenedFields,
      payload: args.req.payload,
      where: fullWhere,
    })

    const sanitizedJoins = await sanitizeJoinQuery({
      collectionConfig,
      joins,
      overrideAccess,
      req,
    })

    // execute only if there's a custom ID and potentially overwriten access on id
    if (req.payload.collections[collectionConfig.slug]!.customIDType) {
      await validateQueryPaths({
        collectionConfig,
        overrideAccess,
        req,
        where,
      })
    }

    // /////////////////////////////////////
    // Find by ID
    // /////////////////////////////////////

    const findOneArgs: FindOneArgs = {
      collection: collectionConfig.slug,
      draftsEnabled: replaceWithVersion,
      joins: req.payloadAPI === 'GraphQL' ? false : sanitizedJoins,
      locale: locale!,
      req: {
        transactionID: req.transactionID,
      } as PayloadRequest,
      select,
      where: fullWhere,
    }

    if (!findOneArgs.where?.and?.[0]?.id) {
      throw new NotFound(t)
    }

    const docFromDB = await req.payload.db.findOne(findOneArgs)

    if (!docFromDB && !args.data) {
      if (!disableErrors) {
        throw new NotFound(req.t)
      }
      return null!
    }

    let result: DataFromCollectionSlug<TSlug> =
      (args.data as DataFromCollectionSlug<TSlug>) ?? docFromDB!

    // /////////////////////////////////////
    // Include Lock Status if required
    // /////////////////////////////////////

    if (includeLockStatus && id) {
      let lockStatus: (JsonObject & TypeWithID) | null = null

      try {
        const lockDocumentsProp = collectionConfig?.lockDocuments

        const lockDurationDefault = 300 // Default 5 minutes in seconds
        const lockDuration =
          typeof lockDocumentsProp === 'object' ? lockDocumentsProp.duration : lockDurationDefault
        const lockDurationInMilliseconds = lockDuration * 1000

        const lockedDocument = await req.payload.find({
          collection: lockedDocumentsCollectionSlug,
          depth: 1,
          limit: 1,
          overrideAccess: false,
          pagination: false,
          req,
          where: {
            and: [
              {
                'document.relationTo': {
                  equals: collectionConfig.slug,
                },
              },
              {
                'document.value': {
                  equals: id,
                },
              },
              // Query where the lock is newer than the current time minus lock time
              {
                updatedAt: {
                  greater_than: new Date(new Date().getTime() - lockDurationInMilliseconds),
                },
              },
            ],
          },
        })

        if (lockedDocument && lockedDocument.docs.length > 0) {
          lockStatus = lockedDocument.docs[0]!
        }
      } catch {
        // swallow error
      }

      result._isLocked = !!lockStatus
      result._userEditing = lockStatus?.user?.value ?? null
    }

    // /////////////////////////////////////
    // Replace document with draft if available
    // /////////////////////////////////////

    if (replaceWithVersion && hasDraftsEnabled(collectionConfig)) {
      result = await replaceWithDraftIfAvailable({
        accessResult,
        doc: result,
        entity: collectionConfig,
        entityType: 'collection',
        overrideAccess,
        req,
        select,
      })
    }

    // /////////////////////////////////////
    // beforeRead - Collection
    // /////////////////////////////////////

    if (collectionConfig.hooks?.beforeRead?.length) {
      for (const hook of collectionConfig.hooks.beforeRead) {
        result =
          (await hook({
            collection: collectionConfig,
            context: req.context,
            doc: result,
            query: findOneArgs.where,
            req,
          })) || result
      }
    }

    // /////////////////////////////////////
    // afterRead - Fields
    // /////////////////////////////////////

    result = await afterRead({
      collection: collectionConfig,
      context: req.context,
      currentDepth,
      depth: depth!,
      doc: result,
      draft: replaceWithVersion,
      fallbackLocale: fallbackLocale!,
      flattenLocales,
      global: null,
      locale: locale!,
      overrideAccess,
      populate,
      req,
      select,
      showHiddenFields: showHiddenFields!,
    })

    // /////////////////////////////////////
    // afterRead - Collection
    // /////////////////////////////////////

    if (collectionConfig.hooks?.afterRead?.length) {
      for (const hook of collectionConfig.hooks.afterRead) {
        result =
          (await hook({
            collection: collectionConfig,
            context: req.context,
            doc: result,
            query: findOneArgs.where,
            req,
          })) || result
      }
    }

    // /////////////////////////////////////
    // afterOperation - Collection
    // /////////////////////////////////////

    result = await buildAfterOperation({
      args,
      collection: collectionConfig,
      operation: 'findByID',
      result,
    })

    // /////////////////////////////////////
    // Return results
    // /////////////////////////////////////

    return result as ApplyDisableErrors<
      TransformCollectionWithSelect<TSlug, TSelect>,
      TDisableErrors
    >
  } catch (error: unknown) {
    await killTransaction(args.req)
    throw error
  }
}
```

--------------------------------------------------------------------------------

---[FILE: findDistinct.ts]---
Location: payload-main/packages/payload/src/collections/operations/findDistinct.ts

```typescript
import httpStatus from 'http-status'

import type { AccessResult } from '../../config/types.js'
import type { PaginatedDistinctDocs } from '../../database/types.js'
import type { FlattenedField } from '../../fields/config/types.js'
import type { PayloadRequest, PopulateType, Sort, Where } from '../../types/index.js'
import type { Collection } from '../config/types.js'

import { executeAccess } from '../../auth/executeAccess.js'
import { combineQueries } from '../../database/combineQueries.js'
import { validateQueryPaths } from '../../database/queryValidation/validateQueryPaths.js'
import { sanitizeWhereQuery } from '../../database/sanitizeWhereQuery.js'
import { APIError } from '../../errors/APIError.js'
import { Forbidden } from '../../errors/Forbidden.js'
import { relationshipPopulationPromise } from '../../fields/hooks/afterRead/relationshipPopulationPromise.js'
import { appendNonTrashedFilter } from '../../utilities/appendNonTrashedFilter.js'
import { getFieldByPath } from '../../utilities/getFieldByPath.js'
import { killTransaction } from '../../utilities/killTransaction.js'
import { buildAfterOperation } from './utilities/buildAfterOperation.js'
import { buildBeforeOperation } from './utilities/buildBeforeOperation.js'

export type Arguments = {
  collection: Collection
  depth?: number
  disableErrors?: boolean
  field: string
  limit?: number
  locale?: string
  overrideAccess?: boolean
  page?: number
  populate?: PopulateType
  req?: PayloadRequest
  showHiddenFields?: boolean
  sort?: Sort
  trash?: boolean
  where?: Where
}
export const findDistinctOperation = async (
  incomingArgs: Arguments,
): Promise<PaginatedDistinctDocs<Record<string, unknown>>> => {
  let args = incomingArgs

  try {
    // /////////////////////////////////////
    // beforeOperation - Collection
    // /////////////////////////////////////

    args = await buildBeforeOperation({
      args,
      collection: args.collection.config,
      operation: 'readDistinct',
    })

    const {
      collection: { config: collectionConfig },
      disableErrors,
      overrideAccess,
      populate,
      showHiddenFields = false,
      trash = false,
      where,
    } = args

    const req = args.req!
    const { locale, payload } = req

    // /////////////////////////////////////
    // Access
    // /////////////////////////////////////

    let accessResult: AccessResult

    if (!overrideAccess) {
      accessResult = await executeAccess({ disableErrors, req }, collectionConfig.access.read)

      // If errors are disabled, and access returns false, return empty results
      if (accessResult === false) {
        return {
          hasNextPage: false,
          hasPrevPage: false,
          limit: args.limit || 0,
          nextPage: null,
          page: 1,
          pagingCounter: 1,
          prevPage: null,
          totalDocs: 0,
          totalPages: 0,
          values: [],
        }
      }
    }

    // /////////////////////////////////////
    // Find Distinct
    // /////////////////////////////////////

    let fullWhere = combineQueries(where!, accessResult!)
    sanitizeWhereQuery({ fields: collectionConfig.flattenedFields, payload, where: fullWhere })

    // Exclude trashed documents when trash: false
    fullWhere = appendNonTrashedFilter({
      enableTrash: collectionConfig.trash,
      trash,
      where: fullWhere,
    })

    await validateQueryPaths({
      collectionConfig,
      overrideAccess: overrideAccess!,
      req,
      where: where ?? {},
    })

    const fieldResult = getFieldByPath({
      config: payload.config,
      fields: collectionConfig.flattenedFields,
      includeRelationships: true,
      path: args.field,
    })

    if (!fieldResult) {
      throw new APIError(
        `Field ${args.field} was not found in the collection ${collectionConfig.slug}`,
        httpStatus.BAD_REQUEST,
      )
    }

    if (fieldResult.field.hidden && !showHiddenFields) {
      throw new Forbidden(req.t)
    }

    if (fieldResult.field.access?.read) {
      const hasAccess = await fieldResult.field.access.read({ req })
      if (!hasAccess) {
        throw new Forbidden(req.t)
      }
    }

    if ('virtual' in fieldResult.field && fieldResult.field.virtual) {
      if (typeof fieldResult.field.virtual !== 'string') {
        throw new APIError(
          `Cannot findDistinct by a virtual field that isn't linked to a relationship field.`,
        )
      }

      let relationPath: string = ''
      let currentFields: FlattenedField[] = collectionConfig.flattenedFields
      const fieldPathSegments = fieldResult.field.virtual.split('.')
      for (const segment of fieldResult.field.virtual.split('.')) {
        relationPath = `${relationPath}${segment}`
        fieldPathSegments.shift()
        const field = currentFields.find((e) => e.name === segment)!
        if (
          (field.type === 'relationship' || field.type === 'upload') &&
          typeof field.relationTo === 'string'
        ) {
          break
        }
        if ('flattenedFields' in field) {
          currentFields = field.flattenedFields
        }
      }

      const path = `${relationPath}.${fieldPathSegments.join('.')}`

      const result = await payload.findDistinct({
        collection: collectionConfig.slug,
        depth: args.depth,
        disableErrors,
        field: path,
        limit: args.limit,
        locale,
        overrideAccess,
        page: args.page,
        populate,
        req,
        showHiddenFields,
        sort: args.sort,
        trash,
        where,
      })

      for (const val of result.values) {
        val[args.field] = val[path]
        delete val[path]
      }

      return result
    }

    let result = await payload.db.findDistinct({
      collection: collectionConfig.slug,
      field: args.field,
      limit: args.limit,
      locale: locale!,
      page: args.page,
      req,
      sort: args.sort,
      where: fullWhere,
    })

    if (
      (fieldResult.field.type === 'relationship' || fieldResult.field.type === 'upload') &&
      args.depth
    ) {
      const populationPromises: Promise<void>[] = []
      const sanitizedField = { ...fieldResult.field }
      if (fieldResult.field.hasMany) {
        sanitizedField.hasMany = false
      }
      for (const doc of result.values) {
        populationPromises.push(
          relationshipPopulationPromise({
            currentDepth: 0,
            depth: args.depth,
            draft: false,
            fallbackLocale: req.fallbackLocale || null,
            field: sanitizedField,
            locale: req.locale || null,
            overrideAccess: args.overrideAccess ?? true,
            parentIsLocalized: false,
            populate,
            req,
            showHiddenFields: false,
            siblingDoc: doc,
          }),
        )
      }
      await Promise.all(populationPromises)
    }

    // /////////////////////////////////////
    // afterOperation - Collection
    // /////////////////////////////////////

    result = await buildAfterOperation({
      args,
      collection: collectionConfig,
      operation: 'findDistinct',
      result,
    })

    // /////////////////////////////////////
    // Return results
    // /////////////////////////////////////

    return result
  } catch (error: unknown) {
    await killTransaction(args.req!)
    throw error
  }
}
```

--------------------------------------------------------------------------------

---[FILE: findVersionByID.ts]---
Location: payload-main/packages/payload/src/collections/operations/findVersionByID.ts

```typescript
import { status as httpStatus } from 'http-status'

import type { PayloadRequest, PopulateType, SelectType } from '../../types/index.js'
import type { TypeWithVersion } from '../../versions/types.js'
import type { Collection, TypeWithID } from '../config/types.js'

import { executeAccess } from '../../auth/executeAccess.js'
import { combineQueries } from '../../database/combineQueries.js'
import { APIError, Forbidden, NotFound } from '../../errors/index.js'
import { afterRead } from '../../fields/hooks/afterRead/index.js'
import { appendNonTrashedFilter } from '../../utilities/appendNonTrashedFilter.js'
import { killTransaction } from '../../utilities/killTransaction.js'
import { sanitizeSelect } from '../../utilities/sanitizeSelect.js'
import { buildVersionCollectionFields } from '../../versions/buildCollectionFields.js'
import { getQueryDraftsSelect } from '../../versions/drafts/getQueryDraftsSelect.js'
import { buildAfterOperation } from './utilities/buildAfterOperation.js'
import { buildBeforeOperation } from './utilities/buildBeforeOperation.js'

export type Arguments = {
  collection: Collection
  currentDepth?: number
  depth?: number
  disableErrors?: boolean
  id: number | string
  overrideAccess?: boolean
  populate?: PopulateType
  req: PayloadRequest
  select?: SelectType
  showHiddenFields?: boolean
  trash?: boolean
}

export const findVersionByIDOperation = async <TData extends TypeWithID = any>(
  args: Arguments,
): Promise<TypeWithVersion<TData>> => {
  const {
    id,
    collection: { config: collectionConfig },
    currentDepth,
    depth,
    disableErrors,
    overrideAccess,
    populate,
    req: { fallbackLocale, locale, payload },
    req,
    select: incomingSelect,
    showHiddenFields,
    trash = false,
  } = args

  if (!id) {
    throw new APIError('Missing ID of version.', httpStatus.BAD_REQUEST)
  }

  try {
    // /////////////////////////////////////
    // beforeOperation - Collection
    // /////////////////////////////////////

    args = await buildBeforeOperation({
      args,
      collection: collectionConfig,
      operation: 'findVersionByID',
    })

    // /////////////////////////////////////
    // Access
    // /////////////////////////////////////

    const accessResults = !overrideAccess
      ? await executeAccess({ id, disableErrors, req }, collectionConfig.access.readVersions)
      : true

    // If errors are disabled, and access returns false, return null
    if (accessResults === false) {
      return null!
    }

    const hasWhereAccess = typeof accessResults === 'object'

    const where = { id: { equals: id } }

    let fullWhere = combineQueries(where, accessResults)

    fullWhere = appendNonTrashedFilter({
      deletedAtPath: 'version.deletedAt',
      enableTrash: collectionConfig.trash,
      trash,
      where: fullWhere,
    })

    // /////////////////////////////////////
    // Find by ID
    // /////////////////////////////////////

    const select = sanitizeSelect({
      fields: buildVersionCollectionFields(payload.config, collectionConfig, true),
      forceSelect: getQueryDraftsSelect({ select: collectionConfig.forceSelect }),
      select: incomingSelect,
      versions: true,
    })

    const versionsQuery = await payload.db.findVersions<TData>({
      collection: collectionConfig.slug,
      limit: 1,
      locale: locale!,
      pagination: false,
      req,
      select,
      where: fullWhere,
    })

    let result = versionsQuery.docs[0]!

    if (!result) {
      if (!disableErrors) {
        if (!hasWhereAccess) {
          throw new NotFound(req.t)
        }
        if (hasWhereAccess) {
          throw new Forbidden(req.t)
        }
      }

      return null!
    }

    if (!result.version) {
      // Fallback if not selected
      ;(result as any).version = {}
    }

    // /////////////////////////////////////
    // beforeRead - Collection
    // /////////////////////////////////////

    if (collectionConfig.hooks?.beforeRead?.length) {
      for (const hook of collectionConfig.hooks.beforeRead) {
        result.version =
          (await hook({
            collection: collectionConfig,
            context: req.context,
            doc: result.version,
            query: fullWhere,
            req,
          })) || result.version
      }
    }

    // /////////////////////////////////////
    // afterRead - Fields
    // /////////////////////////////////////

    result.version = await afterRead({
      collection: collectionConfig,
      context: req.context,
      currentDepth,
      depth: depth!,
      doc: result.version,
      // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
      draft: undefined,
      fallbackLocale: fallbackLocale!,
      global: null,
      locale: locale!,
      overrideAccess: overrideAccess!,
      populate,
      req,
      select: typeof select?.version === 'object' ? select.version : undefined,
      showHiddenFields: showHiddenFields!,
    })

    // /////////////////////////////////////
    // afterRead - Collection
    // /////////////////////////////////////

    if (collectionConfig.hooks?.afterRead?.length) {
      for (const hook of collectionConfig.hooks.afterRead) {
        result.version =
          (await hook({
            collection: collectionConfig,
            context: req.context,
            doc: result.version,
            query: fullWhere,
            req,
          })) || result.version
      }
    }

    // /////////////////////////////////////
    // afterOperation - Collection
    // /////////////////////////////////////

    result = await buildAfterOperation({
      args,
      collection: collectionConfig,
      operation: 'findVersionByID',
      result,
    })

    // /////////////////////////////////////
    // Return results
    // /////////////////////////////////////

    return result
  } catch (error: unknown) {
    await killTransaction(req)
    throw error
  }
}
```

--------------------------------------------------------------------------------

---[FILE: findVersions.ts]---
Location: payload-main/packages/payload/src/collections/operations/findVersions.ts

```typescript
import type { AccessResult } from '../../config/types.js'
import type { PaginatedDocs } from '../../database/types.js'
import type { PayloadRequest, PopulateType, SelectType, Sort, Where } from '../../types/index.js'
import type { TypeWithVersion } from '../../versions/types.js'
import type { Collection } from '../config/types.js'

import { executeAccess } from '../../auth/executeAccess.js'
import { combineQueries } from '../../database/combineQueries.js'
import { validateQueryPaths } from '../../database/queryValidation/validateQueryPaths.js'
import { sanitizeWhereQuery } from '../../database/sanitizeWhereQuery.js'
import { afterRead } from '../../fields/hooks/afterRead/index.js'
import { appendNonTrashedFilter } from '../../utilities/appendNonTrashedFilter.js'
import { killTransaction } from '../../utilities/killTransaction.js'
import { sanitizeInternalFields } from '../../utilities/sanitizeInternalFields.js'
import { sanitizeSelect } from '../../utilities/sanitizeSelect.js'
import { buildVersionCollectionFields } from '../../versions/buildCollectionFields.js'
import { getQueryDraftsSelect } from '../../versions/drafts/getQueryDraftsSelect.js'
import { buildAfterOperation } from './utilities/buildAfterOperation.js'
import { buildBeforeOperation } from './utilities/buildBeforeOperation.js'

export type Arguments = {
  collection: Collection
  depth?: number
  limit?: number
  overrideAccess?: boolean
  page?: number
  pagination?: boolean
  populate?: PopulateType
  req?: PayloadRequest
  select?: SelectType
  showHiddenFields?: boolean
  sort?: Sort
  trash?: boolean
  where?: Where
}

export const findVersionsOperation = async <TData extends TypeWithVersion<TData>>(
  args: Arguments,
): Promise<PaginatedDocs<TData>> => {
  try {
    // /////////////////////////////////////
    // beforeOperation - Collection
    // /////////////////////////////////////

    args = await buildBeforeOperation({
      args,
      collection: args.collection.config,
      operation: 'findVersions',
    })

    const {
      collection: { config: collectionConfig },
      depth,
      limit,
      overrideAccess,
      page,
      pagination = true,
      populate,
      select: incomingSelect,
      showHiddenFields,
      sort,
      trash = false,
      where,
    } = args

    const req = args.req!
    const { fallbackLocale, locale, payload } = req

    // /////////////////////////////////////
    // Access
    // /////////////////////////////////////

    let accessResults!: AccessResult

    if (!overrideAccess) {
      accessResults = await executeAccess({ req }, collectionConfig.access.readVersions)
    }

    const versionFields = buildVersionCollectionFields(payload.config, collectionConfig, true)

    await validateQueryPaths({
      collectionConfig,
      overrideAccess: overrideAccess!,
      req,
      versionFields,
      where: where!,
    })

    let fullWhere = combineQueries(where!, accessResults)

    // Exclude trashed documents when trash: false
    fullWhere = appendNonTrashedFilter({
      deletedAtPath: 'version.deletedAt',
      enableTrash: collectionConfig.trash,
      trash,
      where: fullWhere,
    })

    sanitizeWhereQuery({ fields: versionFields, payload, where: fullWhere })

    const select = sanitizeSelect({
      fields: versionFields,
      forceSelect: getQueryDraftsSelect({ select: collectionConfig.forceSelect }),
      select: incomingSelect,
      versions: true,
    })

    // /////////////////////////////////////
    // Find
    // /////////////////////////////////////

    const usePagination = pagination && limit !== 0
    const sanitizedLimit = limit ?? (usePagination ? 10 : 0)
    const sanitizedPage = page || 1

    const paginatedDocs = await payload.db.findVersions<TData>({
      collection: collectionConfig.slug,
      limit: sanitizedLimit,
      locale: locale!,
      page: sanitizedPage,
      pagination,
      req,
      select,
      sort,
      where: fullWhere,
    })

    // /////////////////////////////////////
    // beforeRead - Collection
    // /////////////////////////////////////
    let result: PaginatedDocs<TData> = paginatedDocs as unknown as PaginatedDocs<TData>
    result.docs = (await Promise.all(
      paginatedDocs.docs.map(async (doc) => {
        const docRef = doc
        // Fallback if not selected
        if (!docRef.version) {
          ;(docRef as any).version = {}
        }

        if (collectionConfig.hooks?.beforeRead?.length) {
          for (const hook of collectionConfig.hooks.beforeRead) {
            docRef.version =
              (await hook({
                collection: collectionConfig,
                context: req.context,
                doc: docRef.version,
                query: fullWhere,
                req,
              })) || docRef.version
          }
        }

        return docRef
      }),
    )) as TData[]
    // /////////////////////////////////////
    // afterRead - Fields
    // /////////////////////////////////////

    result.docs = await Promise.all(
      result.docs.map(async (data) => {
        data.version = await afterRead({
          collection: collectionConfig,
          context: req.context,
          depth: depth!,
          doc: data.version,
          // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
          draft: undefined,
          fallbackLocale: fallbackLocale!,
          findMany: true,
          global: null,
          locale: locale!,
          overrideAccess: overrideAccess!,
          populate,
          req,
          select: typeof select?.version === 'object' ? select.version : undefined,
          showHiddenFields: showHiddenFields!,
        })
        return data
      }),
    )

    // /////////////////////////////////////
    // afterRead - Collection
    // /////////////////////////////////////

    if (collectionConfig.hooks.afterRead?.length) {
      result.docs = await Promise.all(
        result.docs.map(async (doc) => {
          const docRef = doc

          for (const hook of collectionConfig.hooks.afterRead) {
            docRef.version =
              (await hook({
                collection: collectionConfig,
                context: req.context,
                doc: doc.version,
                findMany: true,
                query: fullWhere,
                req,
              })) || doc.version
          }

          return docRef
        }),
      )
    }

    // /////////////////////////////////////
    // Return results
    // /////////////////////////////////////
    result.docs = result.docs.map((doc) => sanitizeInternalFields<TData>(doc))

    // /////////////////////////////////////
    // afterOperation - Collection
    // /////////////////////////////////////

    result = await buildAfterOperation({
      args,
      collection: collectionConfig,
      operation: 'findVersions',
      result,
    })

    return result
  } catch (error: unknown) {
    await killTransaction(args.req!)
    throw error
  }
}
```

--------------------------------------------------------------------------------

````
