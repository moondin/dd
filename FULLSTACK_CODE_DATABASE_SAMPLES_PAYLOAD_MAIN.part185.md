---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 185
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 185 of 695)

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

---[FILE: delete.ts]---
Location: payload-main/packages/payload/src/collections/operations/delete.ts

```typescript
import { status as httpStatus } from 'http-status'

import type { AccessResult } from '../../config/types.js'
import type { CollectionSlug } from '../../index.js'
import type { PayloadRequest, PopulateType, SelectType, Where } from '../../types/index.js'
import type {
  BulkOperationResult,
  Collection,
  DataFromCollectionSlug,
  SelectFromCollectionSlug,
} from '../config/types.js'

import { executeAccess } from '../../auth/executeAccess.js'
import { combineQueries } from '../../database/combineQueries.js'
import { validateQueryPaths } from '../../database/queryValidation/validateQueryPaths.js'
import { sanitizeWhereQuery } from '../../database/sanitizeWhereQuery.js'
import { APIError } from '../../errors/index.js'
import { afterRead } from '../../fields/hooks/afterRead/index.js'
import { deleteUserPreferences } from '../../preferences/deleteUserPreferences.js'
import { deleteAssociatedFiles } from '../../uploads/deleteAssociatedFiles.js'
import { appendNonTrashedFilter } from '../../utilities/appendNonTrashedFilter.js'
import { checkDocumentLockStatus } from '../../utilities/checkDocumentLockStatus.js'
import { commitTransaction } from '../../utilities/commitTransaction.js'
import { hasScheduledPublishEnabled } from '../../utilities/getVersionsConfig.js'
import { initTransaction } from '../../utilities/initTransaction.js'
import { isErrorPublic } from '../../utilities/isErrorPublic.js'
import { killTransaction } from '../../utilities/killTransaction.js'
import { sanitizeSelect } from '../../utilities/sanitizeSelect.js'
import { deleteCollectionVersions } from '../../versions/deleteCollectionVersions.js'
import { deleteScheduledPublishJobs } from '../../versions/deleteScheduledPublishJobs.js'
import { buildAfterOperation } from './utilities/buildAfterOperation.js'
import { buildBeforeOperation } from './utilities/buildBeforeOperation.js'

export type Arguments = {
  collection: Collection
  depth?: number
  disableTransaction?: boolean
  overrideAccess?: boolean
  overrideLock?: boolean
  populate?: PopulateType
  req: PayloadRequest
  select?: SelectType
  showHiddenFields?: boolean
  trash?: boolean
  where: Where
}

export const deleteOperation = async <
  TSlug extends CollectionSlug,
  TSelect extends SelectFromCollectionSlug<TSlug>,
>(
  incomingArgs: Arguments,
): Promise<BulkOperationResult<TSlug, TSelect>> => {
  let args = incomingArgs

  try {
    const shouldCommit = !args.disableTransaction && (await initTransaction(args.req))
    // /////////////////////////////////////
    // beforeOperation - Collection
    // /////////////////////////////////////

    args = await buildBeforeOperation({
      args,
      collection: args.collection.config,
      operation: 'delete',
    })

    const {
      collection: { config: collectionConfig },
      depth,
      overrideAccess,
      overrideLock,
      populate,
      req: {
        fallbackLocale,
        locale,
        payload: { config },
        payload,
      },
      req,
      select: incomingSelect,
      showHiddenFields,
      trash = false,
      where,
    } = args

    if (!where) {
      throw new APIError("Missing 'where' query of documents to delete.", httpStatus.BAD_REQUEST)
    }

    // /////////////////////////////////////
    // Access
    // /////////////////////////////////////

    let accessResult: AccessResult

    if (!overrideAccess) {
      accessResult = await executeAccess({ req }, collectionConfig.access.delete)
    }

    await validateQueryPaths({
      collectionConfig,
      overrideAccess: overrideAccess!,
      req,
      where,
    })

    let fullWhere = combineQueries(where, accessResult!)

    // Exclude trashed documents when trash: false
    fullWhere = appendNonTrashedFilter({
      enableTrash: collectionConfig.trash,
      trash,
      where: fullWhere,
    })

    sanitizeWhereQuery({ fields: collectionConfig.flattenedFields, payload, where: fullWhere })

    const select = sanitizeSelect({
      fields: collectionConfig.flattenedFields,
      forceSelect: collectionConfig.forceSelect,
      select: incomingSelect,
    })

    // /////////////////////////////////////
    // Retrieve documents
    // /////////////////////////////////////

    const { docs } = await payload.db.find<DataFromCollectionSlug<TSlug>>({
      collection: collectionConfig.slug,
      locale: locale!,
      req,
      select,
      where: fullWhere,
    })

    const errors: BulkOperationResult<TSlug, TSelect>['errors'] = []

    const promises = docs.map(async (doc) => {
      let result

      const { id } = doc

      try {
        // /////////////////////////////////////
        // Handle potentially locked documents
        // /////////////////////////////////////

        await checkDocumentLockStatus({
          id,
          collectionSlug: collectionConfig.slug,
          lockErrorMessage: `Document with ID ${id} is currently locked and cannot be deleted.`,
          overrideLock,
          req,
        })

        // /////////////////////////////////////
        // beforeDelete - Collection
        // /////////////////////////////////////

        if (collectionConfig.hooks?.beforeDelete?.length) {
          for (const hook of collectionConfig.hooks.beforeDelete) {
            await hook({
              id,
              collection: collectionConfig,
              context: req.context,
              req,
            })
          }
        }

        await deleteAssociatedFiles({
          collectionConfig,
          config,
          doc,
          overrideDelete: true,
          req,
        })

        // /////////////////////////////////////
        // Delete versions
        // /////////////////////////////////////

        if (collectionConfig.versions) {
          await deleteCollectionVersions({
            id,
            slug: collectionConfig.slug,
            payload,
            req,
          })
        }

        // /////////////////////////////////////
        // Delete scheduled posts
        // /////////////////////////////////////
        if (hasScheduledPublishEnabled(collectionConfig)) {
          await deleteScheduledPublishJobs({
            id,
            slug: collectionConfig.slug,
            payload,
            req,
          })
        }

        // /////////////////////////////////////
        // Delete document
        // /////////////////////////////////////

        await payload.db.deleteOne({
          collection: collectionConfig.slug,
          req,
          returning: false,
          where: {
            id: {
              equals: id,
            },
          },
        })

        // /////////////////////////////////////
        // afterRead - Fields
        // /////////////////////////////////////

        result = await afterRead({
          collection: collectionConfig,
          context: req.context,
          depth: depth!,
          doc: result || doc,
          // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
          draft: undefined,
          fallbackLocale: fallbackLocale!,
          global: null,
          locale: locale!,
          overrideAccess: overrideAccess!,
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
                doc: result || doc,
                req,
              })) || result
          }
        }

        // /////////////////////////////////////
        // afterDelete - Collection
        // /////////////////////////////////////

        if (collectionConfig.hooks?.afterDelete?.length) {
          for (const hook of collectionConfig.hooks.afterDelete) {
            result =
              (await hook({
                id,
                collection: collectionConfig,
                context: req.context,
                doc: result,
                req,
              })) || result
          }
        }

        // /////////////////////////////////////
        // 8. Return results
        // /////////////////////////////////////

        return result
      } catch (error) {
        const isPublic = error instanceof Error ? isErrorPublic(error, config) : false

        errors.push({
          id: doc.id,
          isPublic,
          message: error instanceof Error ? error.message : 'Unknown error',
        })
      }
      return null
    })

    const awaitedDocs = await Promise.all(promises)

    // /////////////////////////////////////
    // Delete Preferences
    // /////////////////////////////////////

    await deleteUserPreferences({
      collectionConfig,
      ids: docs.map(({ id }) => id),
      payload,
      req,
    })

    let result = {
      docs: awaitedDocs.filter(Boolean),
      errors,
    }

    // /////////////////////////////////////
    // afterOperation - Collection
    // /////////////////////////////////////

    result = await buildAfterOperation({
      args,
      collection: collectionConfig,
      operation: 'delete',
      result,
    })

    if (shouldCommit) {
      await commitTransaction(req)
    }

    return result
  } catch (error: unknown) {
    await killTransaction(args.req)
    throw error
  }
}
```

--------------------------------------------------------------------------------

---[FILE: deleteByID.ts]---
Location: payload-main/packages/payload/src/collections/operations/deleteByID.ts

```typescript
import type { CollectionSlug } from '../../index.js'
import type {
  PayloadRequest,
  PopulateType,
  SelectType,
  TransformCollectionWithSelect,
} from '../../types/index.js'
import type { Collection, DataFromCollectionSlug } from '../config/types.js'

import { executeAccess } from '../../auth/executeAccess.js'
import { hasWhereAccessResult } from '../../auth/types.js'
import { combineQueries } from '../../database/combineQueries.js'
import { Forbidden, NotFound } from '../../errors/index.js'
import { afterRead } from '../../fields/hooks/afterRead/index.js'
import { deleteUserPreferences } from '../../preferences/deleteUserPreferences.js'
import { deleteAssociatedFiles } from '../../uploads/deleteAssociatedFiles.js'
import { appendNonTrashedFilter } from '../../utilities/appendNonTrashedFilter.js'
import { checkDocumentLockStatus } from '../../utilities/checkDocumentLockStatus.js'
import { commitTransaction } from '../../utilities/commitTransaction.js'
import { hasScheduledPublishEnabled } from '../../utilities/getVersionsConfig.js'
import { initTransaction } from '../../utilities/initTransaction.js'
import { killTransaction } from '../../utilities/killTransaction.js'
import { sanitizeSelect } from '../../utilities/sanitizeSelect.js'
import { deleteCollectionVersions } from '../../versions/deleteCollectionVersions.js'
import { deleteScheduledPublishJobs } from '../../versions/deleteScheduledPublishJobs.js'
import { buildAfterOperation } from './utilities/buildAfterOperation.js'
import { buildBeforeOperation } from './utilities/buildBeforeOperation.js'

export type Arguments = {
  collection: Collection
  depth?: number
  disableTransaction?: boolean
  id: number | string
  overrideAccess?: boolean
  overrideLock?: boolean
  populate?: PopulateType
  req: PayloadRequest
  select?: SelectType
  showHiddenFields?: boolean
  trash?: boolean
}

export const deleteByIDOperation = async <TSlug extends CollectionSlug, TSelect extends SelectType>(
  incomingArgs: Arguments,
): Promise<TransformCollectionWithSelect<TSlug, TSelect>> => {
  let args = incomingArgs

  try {
    const shouldCommit = !args.disableTransaction && (await initTransaction(args.req))

    // /////////////////////////////////////
    // beforeOperation - Collection
    // /////////////////////////////////////

    args = await buildBeforeOperation({
      args,
      collection: args.collection.config,
      operation: 'delete',
    })

    const {
      id,
      collection: { config: collectionConfig },
      depth,
      overrideAccess,
      overrideLock,
      populate,
      req: {
        fallbackLocale,
        locale,
        payload: { config },
        payload,
      },
      req,
      select: incomingSelect,
      showHiddenFields,
      trash = false,
    } = args

    // /////////////////////////////////////
    // Access
    // /////////////////////////////////////

    const accessResults = !overrideAccess
      ? await executeAccess({ id, req }, collectionConfig.access.delete)
      : true
    const hasWhereAccess = hasWhereAccessResult(accessResults)

    // /////////////////////////////////////
    // beforeDelete - Collection
    // /////////////////////////////////////

    if (collectionConfig.hooks?.beforeDelete?.length) {
      for (const hook of collectionConfig.hooks.beforeDelete) {
        await hook({
          id,
          collection: collectionConfig,
          context: req.context,
          req,
        })
      }
    }

    // /////////////////////////////////////
    // Retrieve document
    // /////////////////////////////////////

    let where = combineQueries({ id: { equals: id } }, accessResults)

    // Exclude trashed documents when trash: false
    where = appendNonTrashedFilter({
      enableTrash: collectionConfig.trash,
      trash,
      where,
    })

    const docToDelete = await req.payload.db.findOne({
      collection: collectionConfig.slug,
      locale: req.locale!,
      req,
      where,
    })

    if (!docToDelete && !hasWhereAccess) {
      throw new NotFound(req.t)
    }
    if (!docToDelete && hasWhereAccess) {
      throw new Forbidden(req.t)
    }

    // /////////////////////////////////////
    // Handle potentially locked documents
    // /////////////////////////////////////

    await checkDocumentLockStatus({
      id,
      collectionSlug: collectionConfig.slug,
      lockErrorMessage: `Document with ID ${id} is currently locked and cannot be deleted.`,
      overrideLock,
      req,
    })

    await deleteAssociatedFiles({
      collectionConfig,
      config,
      doc: docToDelete!,
      overrideDelete: true,
      req,
    })

    // /////////////////////////////////////
    // Delete versions
    // /////////////////////////////////////

    if (collectionConfig.versions) {
      await deleteCollectionVersions({
        id,
        slug: collectionConfig.slug,
        payload,
        req,
      })
    }

    // /////////////////////////////////////
    // Delete scheduled posts
    // /////////////////////////////////////
    if (hasScheduledPublishEnabled(collectionConfig)) {
      await deleteScheduledPublishJobs({
        id,
        slug: collectionConfig.slug,
        payload,
        req,
      })
    }

    const select = sanitizeSelect({
      fields: collectionConfig.flattenedFields,
      forceSelect: collectionConfig.forceSelect,
      select: incomingSelect,
    })

    // /////////////////////////////////////
    // Delete document
    // /////////////////////////////////////

    let result: DataFromCollectionSlug<TSlug> = await req.payload.db.deleteOne({
      collection: collectionConfig.slug,
      req,
      select,
      where: { id: { equals: id } },
    })

    // /////////////////////////////////////
    // Delete Preferences
    // /////////////////////////////////////

    await deleteUserPreferences({
      collectionConfig,
      ids: [id],
      payload,
      req,
    })

    // /////////////////////////////////////
    // afterRead - Fields
    // /////////////////////////////////////

    result = await afterRead({
      collection: collectionConfig,
      context: req.context,
      depth: depth!,
      doc: result,
      draft: undefined!,
      fallbackLocale: fallbackLocale!,
      global: null,
      locale: locale!,
      overrideAccess: overrideAccess!,
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
            req,
          })) || result
      }
    }

    // /////////////////////////////////////
    // afterDelete - Collection
    // /////////////////////////////////////

    if (collectionConfig.hooks?.afterDelete?.length) {
      for (const hook of collectionConfig.hooks.afterDelete) {
        result =
          (await hook({
            id,
            collection: collectionConfig,
            context: req.context,
            doc: result,
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
      operation: 'deleteByID',
      result,
    })

    // /////////////////////////////////////
    // 8. Return results
    // /////////////////////////////////////

    if (shouldCommit) {
      await commitTransaction(req)
    }

    return result as TransformCollectionWithSelect<TSlug, TSelect>
  } catch (error: unknown) {
    await killTransaction(args.req)
    throw error
  }
}
```

--------------------------------------------------------------------------------

---[FILE: docAccess.ts]---
Location: payload-main/packages/payload/src/collections/operations/docAccess.ts

```typescript
import type { SanitizedCollectionPermission } from '../../auth/index.js'
import type { AllOperations, JsonObject, PayloadRequest } from '../../types/index.js'
import type { Collection } from '../config/types.js'

import { getEntityPermissions } from '../../utilities/getEntityPermissions/getEntityPermissions.js'
import { killTransaction } from '../../utilities/killTransaction.js'
import { sanitizePermissions } from '../../utilities/sanitizePermissions.js'

const allOperations: AllOperations[] = ['create', 'read', 'update', 'delete']

type Arguments = {
  collection: Collection
  /**
   * If the document data is passed, it will be used to check access instead of fetching the document from the database.
   */
  data?: JsonObject
  /**
   * When called for creating a new document, id is not provided.
   */
  id?: number | string
  req: PayloadRequest
}

export async function docAccessOperation(args: Arguments): Promise<SanitizedCollectionPermission> {
  const {
    id,
    collection: { config },
    data,
    req,
  } = args

  const collectionOperations = [...allOperations]

  if (
    config.auth &&
    typeof config.auth.maxLoginAttempts !== 'undefined' &&
    config.auth.maxLoginAttempts !== 0
  ) {
    collectionOperations.push('unlock')
  }

  if (config.versions) {
    collectionOperations.push('readVersions')
  }

  try {
    const result = await getEntityPermissions({
      id: id!,
      blockReferencesPermissions: {},
      data,
      entity: config,
      entityType: 'collection',
      fetchData: id ? true : (false as true),
      operations: collectionOperations,
      req,
    })

    const sanitizedPermissions = sanitizePermissions({
      collections: {
        [config.slug]: result,
      },
    })

    const collectionPermissions = sanitizedPermissions?.collections?.[config.slug]
    return collectionPermissions ?? { fields: {} }
  } catch (e: unknown) {
    await killTransaction(req)
    throw e
  }
}
```

--------------------------------------------------------------------------------

---[FILE: duplicate.ts]---
Location: payload-main/packages/payload/src/collections/operations/duplicate.ts

```typescript
import type { DeepPartial } from 'ts-essentials'

import type { CollectionSlug } from '../../index.js'
import type { TransformCollectionWithSelect } from '../../types/index.js'
import type { RequiredDataFromCollectionSlug, SelectFromCollectionSlug } from '../config/types.js'

import { type Arguments as CreateArguments, createOperation } from './create.js'

export type Arguments<TSlug extends CollectionSlug> = {
  data?: DeepPartial<RequiredDataFromCollectionSlug<TSlug>>
  id: number | string
} & Omit<CreateArguments<TSlug>, 'data' | 'duplicateFromID'>

export const duplicateOperation = async <
  TSlug extends CollectionSlug,
  TSelect extends SelectFromCollectionSlug<TSlug>,
>(
  incomingArgs: Arguments<TSlug>,
): Promise<TransformCollectionWithSelect<TSlug, TSelect>> => {
  const { id, ...args } = incomingArgs
  return createOperation({
    ...args,
    data: incomingArgs?.data || {},
    duplicateFromID: id,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: find.ts]---
Location: payload-main/packages/payload/src/collections/operations/find.ts

```typescript
import type { AccessResult } from '../../config/types.js'
import type { PaginatedDocs } from '../../database/types.js'
import type { CollectionSlug, JoinQuery } from '../../index.js'
import type {
  PayloadRequest,
  PopulateType,
  SelectType,
  Sort,
  TransformCollectionWithSelect,
  Where,
} from '../../types/index.js'
import type {
  Collection,
  DataFromCollectionSlug,
  SelectFromCollectionSlug,
} from '../config/types.js'

import { executeAccess } from '../../auth/executeAccess.js'
import { combineQueries } from '../../database/combineQueries.js'
import { validateQueryPaths } from '../../database/queryValidation/validateQueryPaths.js'
import { sanitizeJoinQuery } from '../../database/sanitizeJoinQuery.js'
import { sanitizeWhereQuery } from '../../database/sanitizeWhereQuery.js'
import { afterRead } from '../../fields/hooks/afterRead/index.js'
import { lockedDocumentsCollectionSlug } from '../../locked-documents/config.js'
import { appendNonTrashedFilter } from '../../utilities/appendNonTrashedFilter.js'
import { hasDraftsEnabled } from '../../utilities/getVersionsConfig.js'
import { killTransaction } from '../../utilities/killTransaction.js'
import { sanitizeSelect } from '../../utilities/sanitizeSelect.js'
import { buildVersionCollectionFields } from '../../versions/buildCollectionFields.js'
import { appendVersionToQueryKey } from '../../versions/drafts/appendVersionToQueryKey.js'
import { getQueryDraftsSelect } from '../../versions/drafts/getQueryDraftsSelect.js'
import { getQueryDraftsSort } from '../../versions/drafts/getQueryDraftsSort.js'
import { buildAfterOperation } from './utilities/buildAfterOperation.js'
import { buildBeforeOperation } from './utilities/buildBeforeOperation.js'
import { sanitizeSortQuery } from './utilities/sanitizeSortQuery.js'

export type Arguments = {
  collection: Collection
  currentDepth?: number
  depth?: number
  disableErrors?: boolean
  draft?: boolean
  includeLockStatus?: boolean
  joins?: JoinQuery
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

const lockDurationDefault = 300 // Default 5 minutes in seconds

export const findOperation = async <
  TSlug extends CollectionSlug,
  TSelect extends SelectFromCollectionSlug<TSlug>,
>(
  incomingArgs: Arguments,
): Promise<PaginatedDocs<TransformCollectionWithSelect<TSlug, TSelect>>> => {
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
      collection: { config: collectionConfig },
      collection,
      currentDepth,
      depth,
      disableErrors,
      draft: draftsEnabled,
      includeLockStatus,
      joins,
      limit,
      overrideAccess,
      page,
      pagination = true,
      populate,
      select: incomingSelect,
      showHiddenFields,
      sort: incomingSort,
      trash = false,
      where,
    } = args

    const req = args.req!
    const { fallbackLocale, locale, payload } = req

    const select = sanitizeSelect({
      fields: collectionConfig.flattenedFields,
      forceSelect: collectionConfig.forceSelect,
      select: incomingSelect,
    })

    // /////////////////////////////////////
    // Access
    // /////////////////////////////////////

    let accessResult: AccessResult

    if (!overrideAccess) {
      accessResult = await executeAccess({ disableErrors, req }, collectionConfig.access.read)

      // If errors are disabled, and access returns false, return empty results
      if (accessResult === false) {
        return {
          docs: [],
          hasNextPage: false,
          hasPrevPage: false,
          limit: limit!,
          nextPage: null,
          page: 1,
          pagingCounter: 1,
          prevPage: null,
          totalDocs: 0,
          totalPages: 1,
        }
      }
    }

    // /////////////////////////////////////
    // Find
    // /////////////////////////////////////

    const usePagination = pagination && limit !== 0
    const sanitizedLimit = limit ?? (usePagination ? 10 : 0)
    const sanitizedPage = page || 1

    let result: PaginatedDocs<DataFromCollectionSlug<TSlug>>

    let fullWhere = combineQueries(where!, accessResult!)
    sanitizeWhereQuery({ fields: collectionConfig.flattenedFields, payload, where: fullWhere })

    // Exclude trashed documents when trash: false
    fullWhere = appendNonTrashedFilter({
      enableTrash: collectionConfig.trash,
      trash,
      where: fullWhere,
    })

    const sort = sanitizeSortQuery({
      fields: collection.config.flattenedFields,
      sort: incomingSort,
    })

    const sanitizedJoins = await sanitizeJoinQuery({
      collectionConfig,
      joins,
      overrideAccess: overrideAccess!,
      req,
    })

    if (hasDraftsEnabled(collectionConfig) && draftsEnabled) {
      fullWhere = appendVersionToQueryKey(fullWhere)

      await validateQueryPaths({
        collectionConfig: collection.config,
        overrideAccess: overrideAccess!,
        req,
        versionFields: buildVersionCollectionFields(payload.config, collection.config, true),
        where: appendVersionToQueryKey(where),
      })

      result = await payload.db.queryDrafts<DataFromCollectionSlug<TSlug>>({
        collection: collectionConfig.slug,
        joins: req.payloadAPI === 'GraphQL' ? false : sanitizedJoins,
        limit: sanitizedLimit,
        locale: locale!,
        page: sanitizedPage,
        pagination: usePagination,
        req,
        select: getQueryDraftsSelect({ select }),
        sort: getQueryDraftsSort({
          collectionConfig,
          sort,
        }),
        where: fullWhere,
      })
    } else {
      await validateQueryPaths({
        collectionConfig,
        overrideAccess: overrideAccess!,
        req,
        where: where!,
      })

      result = await payload.db.find<DataFromCollectionSlug<TSlug>>({
        collection: collectionConfig.slug,
        draftsEnabled,
        joins: req.payloadAPI === 'GraphQL' ? false : sanitizedJoins,
        limit: sanitizedLimit,
        locale: locale!,
        page: sanitizedPage,
        pagination,
        req,
        select,
        sort,
        where: fullWhere,
      })
    }

    if (includeLockStatus) {
      try {
        const lockDocumentsProp = collectionConfig?.lockDocuments

        const lockDuration =
          typeof lockDocumentsProp === 'object' ? lockDocumentsProp.duration : lockDurationDefault
        const lockDurationInMilliseconds = lockDuration * 1000

        const now = new Date().getTime()

        const lockedDocuments = await payload.find({
          collection: lockedDocumentsCollectionSlug,
          depth: 1,
          limit: sanitizedLimit,
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
                  in: result.docs.map((doc) => doc.id),
                },
              },
              // Query where the lock is newer than the current time minus lock time
              {
                updatedAt: {
                  greater_than: new Date(now - lockDurationInMilliseconds),
                },
              },
            ],
          },
        })

        const lockedDocs = Array.isArray(lockedDocuments?.docs) ? lockedDocuments.docs : []

        // Filter out stale locks
        const validLockedDocs = lockedDocs.filter((lock) => {
          const lastEditedAt = new Date(lock?.updatedAt).getTime()
          return lastEditedAt + lockDurationInMilliseconds > now
        })

        for (const doc of result.docs) {
          const lockedDoc = validLockedDocs.find((lock) => lock?.document?.value === doc.id)
          doc._isLocked = !!lockedDoc
          doc._userEditing = lockedDoc ? lockedDoc?.user?.value : null
        }
      } catch (_err) {
        for (const doc of result.docs) {
          doc._isLocked = false
          doc._userEditing = null
        }
      }
    }

    // /////////////////////////////////////
    // beforeRead - Collection
    // /////////////////////////////////////

    if (collectionConfig?.hooks?.beforeRead?.length) {
      result.docs = await Promise.all(
        result.docs.map(async (doc) => {
          let docRef = doc

          for (const hook of collectionConfig.hooks.beforeRead) {
            docRef =
              (await hook({
                collection: collectionConfig,
                context: req.context,
                doc: docRef,
                query: fullWhere,
                req,
              })) || docRef
          }

          return docRef
        }),
      )
    }

    // /////////////////////////////////////
    // afterRead - Fields
    // /////////////////////////////////////

    result.docs = await Promise.all(
      result.docs.map(async (doc) =>
        afterRead<DataFromCollectionSlug<TSlug>>({
          collection: collectionConfig,
          context: req.context,
          currentDepth,
          depth: depth!,
          doc,
          draft: draftsEnabled!,
          fallbackLocale: fallbackLocale!,
          findMany: true,
          global: null,
          locale: locale!,
          overrideAccess: overrideAccess!,
          populate,
          req,
          select,
          showHiddenFields: showHiddenFields!,
        }),
      ),
    )

    // /////////////////////////////////////
    // afterRead - Collection
    // /////////////////////////////////////

    if (collectionConfig?.hooks?.afterRead?.length) {
      result.docs = await Promise.all(
        result.docs.map(async (doc) => {
          let docRef = doc

          for (const hook of collectionConfig.hooks.afterRead) {
            docRef =
              (await hook({
                collection: collectionConfig,
                context: req.context,
                doc: docRef,
                findMany: true,
                query: fullWhere,
                req,
              })) || doc
          }

          return docRef
        }),
      )
    }

    // /////////////////////////////////////
    // afterOperation - Collection
    // /////////////////////////////////////

    result = await buildAfterOperation({
      args,
      collection: collectionConfig,
      operation: 'find',
      result,
    })

    // /////////////////////////////////////
    // Return results
    // /////////////////////////////////////

    return result as PaginatedDocs<TransformCollectionWithSelect<TSlug, TSelect>>
  } catch (error: unknown) {
    await killTransaction(args.req!)
    throw error
  }
}
```

--------------------------------------------------------------------------------

````
