---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 187
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 187 of 695)

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

---[FILE: restoreVersion.ts]---
Location: payload-main/packages/payload/src/collections/operations/restoreVersion.ts

```typescript
import { status as httpStatus } from 'http-status'

import type { FindOneArgs } from '../../database/types.js'
import type { JsonObject, PayloadRequest, PopulateType, SelectType } from '../../types/index.js'
import type { Collection, TypeWithID } from '../config/types.js'

import { executeAccess } from '../../auth/executeAccess.js'
import { hasWhereAccessResult } from '../../auth/types.js'
import { combineQueries } from '../../database/combineQueries.js'
import { APIError, Forbidden, NotFound } from '../../errors/index.js'
import { afterChange } from '../../fields/hooks/afterChange/index.js'
import { afterRead } from '../../fields/hooks/afterRead/index.js'
import { beforeChange } from '../../fields/hooks/beforeChange/index.js'
import { beforeValidate } from '../../fields/hooks/beforeValidate/index.js'
import { commitTransaction } from '../../utilities/commitTransaction.js'
import { deepCopyObjectSimple } from '../../utilities/deepCopyObject.js'
import { hasDraftValidationEnabled } from '../../utilities/getVersionsConfig.js'
import { initTransaction } from '../../utilities/initTransaction.js'
import { killTransaction } from '../../utilities/killTransaction.js'
import { sanitizeSelect } from '../../utilities/sanitizeSelect.js'
import { getLatestCollectionVersion } from '../../versions/getLatestCollectionVersion.js'
import { saveVersion } from '../../versions/saveVersion.js'
import { buildAfterOperation } from './utilities/buildAfterOperation.js'
import { buildBeforeOperation } from './utilities/buildBeforeOperation.js'

export type Arguments = {
  collection: Collection
  currentDepth?: number
  depth?: number
  disableErrors?: boolean
  disableTransaction?: boolean
  draft?: boolean
  id: number | string
  overrideAccess?: boolean
  populate?: PopulateType
  req: PayloadRequest
  select?: SelectType
  showHiddenFields?: boolean
}

export const restoreVersionOperation = async <
  TData extends JsonObject & TypeWithID = JsonObject & TypeWithID,
>(
  args: Arguments,
): Promise<TData> => {
  const {
    id,
    collection: { config: collectionConfig },
    depth,
    draft: draftArg = false,
    overrideAccess = false,
    populate,
    req,
    req: { fallbackLocale, locale, payload },
    select: incomingSelect,
    showHiddenFields,
  } = args

  try {
    const shouldCommit = !args.disableTransaction && (await initTransaction(args.req))

    // /////////////////////////////////////
    // beforeOperation - Collection
    // /////////////////////////////////////

    args = await buildBeforeOperation({
      args,
      collection: args.collection.config,
      operation: 'restoreVersion',
    })

    if (!id) {
      throw new APIError('Missing ID of version to restore.', httpStatus.BAD_REQUEST)
    }

    // /////////////////////////////////////
    // Retrieve original raw version
    // /////////////////////////////////////

    const { docs: versionDocs } = await req.payload.db.findVersions({
      collection: collectionConfig.slug,
      limit: 1,
      locale: locale!,
      pagination: false,
      req,
      where: { id: { equals: id } },
    })

    const [rawVersionToRestore] = versionDocs

    if (!rawVersionToRestore) {
      throw new NotFound(req.t)
    }

    const { parent: parentDocID, version: versionToRestoreWithLocales } = rawVersionToRestore

    // /////////////////////////////////////
    // Access
    // /////////////////////////////////////

    const accessResults = !overrideAccess
      ? await executeAccess({ id: parentDocID, req }, collectionConfig.access.update)
      : true
    const hasWherePolicy = hasWhereAccessResult(accessResults)

    // /////////////////////////////////////
    // Retrieve document
    // /////////////////////////////////////

    const findOneArgs: FindOneArgs = {
      collection: collectionConfig.slug,
      locale: locale!,
      req,
      where: combineQueries({ id: { equals: parentDocID } }, accessResults),
    }

    // Get the document from the non versioned collection
    const doc = await req.payload.db.findOne<TData>(findOneArgs)

    if (!doc && !hasWherePolicy) {
      throw new NotFound(req.t)
    }
    if (!doc && hasWherePolicy) {
      throw new Forbidden(req.t)
    }

    if (collectionConfig.trash && doc?.deletedAt) {
      throw new APIError(
        `Cannot restore a version of a trashed document (ID: ${parentDocID}). Restore the document first.`,
        httpStatus.FORBIDDEN,
      )
    }

    // /////////////////////////////////////
    // fetch previousDoc
    // /////////////////////////////////////
    const prevDocWithLocales = await getLatestCollectionVersion({
      id: parentDocID,
      config: collectionConfig,
      payload,
      query: findOneArgs,
      req,
    })

    // originalDoc with hoisted localized data
    const originalDoc = await afterRead({
      collection: collectionConfig,
      context: req.context,
      depth: 0,
      doc: deepCopyObjectSimple(prevDocWithLocales),
      draft: draftArg,
      fallbackLocale: null,
      global: null,
      locale: locale!,
      overrideAccess: true,
      req,
      showHiddenFields: true,
    })

    // version data with hoisted localized data
    const prevVersionDoc = await afterRead({
      collection: collectionConfig,
      context: req.context,
      depth: 0,
      doc: deepCopyObjectSimple(rawVersionToRestore.version),
      draft: draftArg,
      fallbackLocale: null,
      global: null,
      locale: locale!,
      overrideAccess: true,
      req,
      showHiddenFields: true,
    })

    // /////////////////////////////////////
    // beforeValidate - Fields
    // /////////////////////////////////////

    let data = await beforeValidate({
      id: parentDocID,
      collection: collectionConfig,
      context: req.context,
      data: deepCopyObjectSimple(prevVersionDoc),
      doc: originalDoc,
      global: null,
      operation: 'update',
      overrideAccess,
      req,
    })

    // /////////////////////////////////////
    // beforeValidate - Collection
    // /////////////////////////////////////

    if (collectionConfig.hooks?.beforeValidate?.length) {
      for (const hook of collectionConfig.hooks.beforeValidate) {
        data =
          (await hook({
            collection: collectionConfig,
            context: req.context,
            data,
            operation: 'update',
            originalDoc,
            req,
          })) || data
      }
    }

    // /////////////////////////////////////
    // beforeChange - Collection
    // /////////////////////////////////////

    if (collectionConfig.hooks?.beforeChange?.length) {
      for (const hook of collectionConfig.hooks.beforeChange) {
        data =
          (await hook({
            collection: collectionConfig,
            context: req.context,
            data,
            operation: 'update',
            originalDoc,
            req,
          })) || data
      }
    }

    // /////////////////////////////////////
    // beforeChange - Fields
    // /////////////////////////////////////

    let result = await beforeChange({
      id: parentDocID,
      collection: collectionConfig,
      context: req.context,
      data: { ...data, id: parentDocID },
      doc: originalDoc,
      docWithLocales: versionToRestoreWithLocales,
      global: null,
      operation: 'update',
      overrideAccess,
      req,
      skipValidation: draftArg && !hasDraftValidationEnabled(collectionConfig),
    })

    // /////////////////////////////////////
    // Update
    // /////////////////////////////////////

    const select = sanitizeSelect({
      fields: collectionConfig.flattenedFields,
      forceSelect: collectionConfig.forceSelect,
      select: incomingSelect,
    })

    // Ensure updatedAt date is always updated
    result.updatedAt = new Date().toISOString()
    // Ensure status respects restoreAsDraft arg
    result._status = draftArg ? 'draft' : result._status
    if (!draftArg) {
      result = await req.payload.db.updateOne({
        id: parentDocID,
        collection: collectionConfig.slug,
        data: result,
        req,
        select,
      })
    }

    // /////////////////////////////////////
    // Save restored doc as a new version
    // /////////////////////////////////////

    result = await saveVersion({
      id: parentDocID,
      autosave: false,
      collection: collectionConfig,
      docWithLocales: result,
      draft: draftArg,
      operation: 'restoreVersion',
      payload,
      req,
      select,
    })

    // /////////////////////////////////////
    // afterRead - Fields
    // /////////////////////////////////////

    result = await afterRead({
      collection: collectionConfig,
      context: req.context,
      depth: depth!,
      doc: result,
      // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
      draft: undefined,
      fallbackLocale: fallbackLocale!,
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
            req,
          })) || result
      }
    }

    // /////////////////////////////////////
    // afterChange - Fields
    // /////////////////////////////////////

    result = await afterChange({
      collection: collectionConfig,
      context: req.context,
      data: result,
      doc: result,
      global: null,
      operation: 'update',
      previousDoc: prevDocWithLocales,
      req,
    })

    // /////////////////////////////////////
    // afterChange - Collection
    // /////////////////////////////////////

    if (collectionConfig.hooks?.afterChange?.length) {
      for (const hook of collectionConfig.hooks.afterChange) {
        result =
          (await hook({
            collection: collectionConfig,
            context: req.context,
            data: result,
            doc: result,
            operation: 'update',
            previousDoc: prevDocWithLocales,
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
      operation: 'restoreVersion',
      result,
    })

    if (shouldCommit) {
      await commitTransaction(req)
    }

    return result
  } catch (error: unknown) {
    await killTransaction(req)
    throw error
  }
}
```

--------------------------------------------------------------------------------

---[FILE: update.ts]---
Location: payload-main/packages/payload/src/collections/operations/update.ts

```typescript
import type { DeepPartial } from 'ts-essentials'

import { status as httpStatus } from 'http-status'

import type { AccessResult } from '../../config/types.js'
import type { PayloadRequest, PopulateType, SelectType, Sort, Where } from '../../types/index.js'
import type {
  BulkOperationResult,
  Collection,
  DataFromCollectionSlug,
  RequiredDataFromCollectionSlug,
  SelectFromCollectionSlug,
} from '../config/types.js'

import { executeAccess } from '../../auth/executeAccess.js'
import { combineQueries } from '../../database/combineQueries.js'
import { validateQueryPaths } from '../../database/queryValidation/validateQueryPaths.js'
import { sanitizeWhereQuery } from '../../database/sanitizeWhereQuery.js'
import { APIError } from '../../errors/index.js'
import { type CollectionSlug, deepCopyObjectSimple } from '../../index.js'
import { generateFileData } from '../../uploads/generateFileData.js'
import { unlinkTempFiles } from '../../uploads/unlinkTempFiles.js'
import { appendNonTrashedFilter } from '../../utilities/appendNonTrashedFilter.js'
import { commitTransaction } from '../../utilities/commitTransaction.js'
import { hasDraftsEnabled } from '../../utilities/getVersionsConfig.js'
import { initTransaction } from '../../utilities/initTransaction.js'
import { isErrorPublic } from '../../utilities/isErrorPublic.js'
import { killTransaction } from '../../utilities/killTransaction.js'
import { sanitizeSelect } from '../../utilities/sanitizeSelect.js'
import { buildVersionCollectionFields } from '../../versions/buildCollectionFields.js'
import { appendVersionToQueryKey } from '../../versions/drafts/appendVersionToQueryKey.js'
import { getQueryDraftsSort } from '../../versions/drafts/getQueryDraftsSort.js'
import { buildAfterOperation } from './utilities/buildAfterOperation.js'
import { buildBeforeOperation } from './utilities/buildBeforeOperation.js'
import { sanitizeSortQuery } from './utilities/sanitizeSortQuery.js'
import { updateDocument } from './utilities/update.js'

export type Arguments<TSlug extends CollectionSlug> = {
  autosave?: boolean
  collection: Collection
  data: DeepPartial<RequiredDataFromCollectionSlug<TSlug>>
  depth?: number
  disableTransaction?: boolean
  disableVerificationEmail?: boolean
  draft?: boolean
  limit?: number
  overrideAccess?: boolean
  overrideLock?: boolean
  overwriteExistingFiles?: boolean
  populate?: PopulateType
  publishSpecificLocale?: string
  req: PayloadRequest
  select?: SelectType
  showHiddenFields?: boolean
  /**
   * Sort the documents, can be a string or an array of strings
   * @example '-createdAt' // Sort DESC by createdAt
   * @example ['group', '-createdAt'] // sort by 2 fields, ASC group and DESC createdAt
   */
  sort?: Sort
  trash?: boolean
  where: Where
}

export const updateOperation = async <
  TSlug extends CollectionSlug,
  TSelect extends SelectFromCollectionSlug<TSlug>,
>(
  incomingArgs: Arguments<TSlug>,
): Promise<BulkOperationResult<TSlug, TSelect>> => {
  let args = incomingArgs

  if (args.collection.config.disableBulkEdit && !args.overrideAccess) {
    throw new APIError(`Collection ${args.collection.config.slug} has disabled bulk edit`, 403)
  }

  try {
    const shouldCommit = !args.disableTransaction && (await initTransaction(args.req))

    // /////////////////////////////////////
    // beforeOperation - Collection
    // /////////////////////////////////////

    args = await buildBeforeOperation({
      args,
      collection: args.collection.config,
      operation: 'update',
    })

    const {
      autosave = false,
      collection: { config: collectionConfig },
      collection,
      depth,
      draft: draftArg = false,
      limit = 0,
      overrideAccess,
      overrideLock,
      overwriteExistingFiles = false,
      populate,
      publishSpecificLocale,
      req: {
        fallbackLocale,
        locale,
        payload: { config },
        payload,
      },
      req,
      select: incomingSelect,
      showHiddenFields,
      sort: incomingSort,
      trash = false,
      where,
    } = args

    if (!where) {
      throw new APIError("Missing 'where' query of documents to update.", httpStatus.BAD_REQUEST)
    }

    const { data: bulkUpdateData } = args
    const shouldSaveDraft = Boolean(draftArg && hasDraftsEnabled(collectionConfig))

    // /////////////////////////////////////
    // Access
    // /////////////////////////////////////

    let accessResult: AccessResult
    if (!overrideAccess) {
      accessResult = await executeAccess({ req }, collectionConfig.access.update)
    }

    await validateQueryPaths({
      collectionConfig,
      overrideAccess: overrideAccess!,
      req,
      where,
    })

    // /////////////////////////////////////
    // Retrieve documents
    // /////////////////////////////////////

    let fullWhere = combineQueries(where, accessResult!)

    const isTrashAttempt =
      collectionConfig.trash &&
      typeof bulkUpdateData === 'object' &&
      bulkUpdateData !== null &&
      'deletedAt' in bulkUpdateData &&
      bulkUpdateData.deletedAt != null

    // Enforce delete access if performing a soft-delete (trash)
    if (isTrashAttempt && !overrideAccess) {
      const deleteAccessResult = await executeAccess({ req }, collectionConfig.access.delete)
      fullWhere = combineQueries(fullWhere, deleteAccessResult)
    }

    // Exclude trashed documents when trash: false
    fullWhere = appendNonTrashedFilter({
      enableTrash: collectionConfig.trash,
      trash,
      where: fullWhere,
    })

    sanitizeWhereQuery({ fields: collectionConfig.flattenedFields, payload, where: fullWhere })

    const sort = sanitizeSortQuery({
      fields: collection.config.flattenedFields,
      sort: incomingSort,
    })

    let docs

    if (hasDraftsEnabled(collectionConfig) && shouldSaveDraft) {
      const versionsWhere = appendVersionToQueryKey(fullWhere)

      await validateQueryPaths({
        collectionConfig: collection.config,
        overrideAccess: overrideAccess!,
        req,
        versionFields: buildVersionCollectionFields(payload.config, collection.config, true),
        where: appendVersionToQueryKey(where),
      })

      const query = await payload.db.queryDrafts<DataFromCollectionSlug<TSlug>>({
        collection: collectionConfig.slug,
        limit,
        locale: locale!,
        pagination: false,
        req,
        sort: getQueryDraftsSort({ collectionConfig, sort }),
        where: versionsWhere,
      })

      docs = query.docs
    } else {
      const query = await payload.db.find({
        collection: collectionConfig.slug,
        limit,
        locale: locale!,
        pagination: false,
        req,
        sort,
        where: fullWhere,
      })

      docs = query.docs
    }

    // /////////////////////////////////////
    // Generate data for all files and sizes
    // /////////////////////////////////////

    const { data, files: filesToUpload } = await generateFileData({
      collection,
      config,
      data: bulkUpdateData,
      operation: 'update',
      overwriteExistingFiles,
      req,
      throwOnMissingFile: false,
    })

    const errors: BulkOperationResult<TSlug, TSelect>['errors'] = []

    const promises = docs.map(async (docWithLocales) => {
      const { id } = docWithLocales

      try {
        const select = sanitizeSelect({
          fields: collectionConfig.flattenedFields,
          forceSelect: collectionConfig.forceSelect,
          select: incomingSelect,
        })

        // ///////////////////////////////////////////////
        // Update document, runs all document level hooks
        // ///////////////////////////////////////////////
        const updatedDoc = await updateDocument({
          id,
          accessResults: accessResult,
          autosave,
          collectionConfig,
          config,
          data: deepCopyObjectSimple(data),
          depth: depth!,
          docWithLocales,
          draftArg,
          fallbackLocale: fallbackLocale!,
          filesToUpload,
          locale: locale!,
          overrideAccess: overrideAccess!,
          overrideLock: overrideLock!,
          payload,
          populate,
          publishSpecificLocale,
          req,
          select: select!,
          showHiddenFields: showHiddenFields!,
        })

        return updatedDoc
      } catch (error) {
        const isPublic = error instanceof Error ? isErrorPublic(error, config) : false

        errors.push({
          id,
          isPublic,
          message: error instanceof Error ? error.message : 'Unknown error',
        })
      }
      return null
    })

    await unlinkTempFiles({
      collectionConfig,
      config,
      req,
    })

    const awaitedDocs = await Promise.all(promises)

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
      operation: 'update',
      // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
      result,
    })

    if (shouldCommit) {
      await commitTransaction(req)
    }

    // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
    return result
  } catch (error: unknown) {
    await killTransaction(args.req)
    throw error
  }
}
```

--------------------------------------------------------------------------------

---[FILE: updateByID.ts]---
Location: payload-main/packages/payload/src/collections/operations/updateByID.ts

```typescript
import type { DeepPartial } from 'ts-essentials'

import { status as httpStatus } from 'http-status'

import type { FindOneArgs } from '../../database/types.js'
import type {
  PayloadRequest,
  PopulateType,
  SelectType,
  TransformCollectionWithSelect,
} from '../../types/index.js'
import type {
  Collection,
  RequiredDataFromCollectionSlug,
  SelectFromCollectionSlug,
  TypeWithID,
} from '../config/types.js'

import { executeAccess } from '../../auth/executeAccess.js'
import { hasWhereAccessResult } from '../../auth/types.js'
import { combineQueries } from '../../database/combineQueries.js'
import { APIError, Forbidden, NotFound } from '../../errors/index.js'
import { type CollectionSlug, deepCopyObjectSimple } from '../../index.js'
import { generateFileData } from '../../uploads/generateFileData.js'
import { unlinkTempFiles } from '../../uploads/unlinkTempFiles.js'
import { appendNonTrashedFilter } from '../../utilities/appendNonTrashedFilter.js'
import { commitTransaction } from '../../utilities/commitTransaction.js'
import { initTransaction } from '../../utilities/initTransaction.js'
import { killTransaction } from '../../utilities/killTransaction.js'
import { sanitizeSelect } from '../../utilities/sanitizeSelect.js'
import { getLatestCollectionVersion } from '../../versions/getLatestCollectionVersion.js'
import { buildAfterOperation } from './utilities/buildAfterOperation.js'
import { buildBeforeOperation } from './utilities/buildBeforeOperation.js'
import { updateDocument } from './utilities/update.js'

export type Arguments<TSlug extends CollectionSlug> = {
  autosave?: boolean
  collection: Collection
  data: DeepPartial<RequiredDataFromCollectionSlug<TSlug>>
  depth?: number
  disableTransaction?: boolean
  disableVerificationEmail?: boolean
  draft?: boolean
  id: number | string
  overrideAccess?: boolean
  overrideLock?: boolean
  overwriteExistingFiles?: boolean
  populate?: PopulateType
  publishSpecificLocale?: string
  req: PayloadRequest
  select?: SelectType
  showHiddenFields?: boolean
  trash?: boolean
}

export const updateByIDOperation = async <
  TSlug extends CollectionSlug,
  TSelect extends SelectFromCollectionSlug<TSlug> = SelectType,
>(
  incomingArgs: Arguments<TSlug>,
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
      operation: 'update',
    })

    if (args.publishSpecificLocale) {
      args.req.locale = args.publishSpecificLocale
    }

    const {
      id,
      autosave = false,
      collection: { config: collectionConfig },
      collection,
      depth,
      draft: draftArg = false,
      overrideAccess,
      overrideLock,
      overwriteExistingFiles = false,
      populate,
      publishSpecificLocale,
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

    if (!id) {
      throw new APIError('Missing ID of document to update.', httpStatus.BAD_REQUEST)
    }

    const { data } = args

    // /////////////////////////////////////
    // Access
    // /////////////////////////////////////

    const accessResults = !overrideAccess
      ? await executeAccess({ id, data, req }, collectionConfig.access.update)
      : true
    const hasWherePolicy = hasWhereAccessResult(accessResults)

    // /////////////////////////////////////
    // Retrieve document
    // /////////////////////////////////////

    const where = { id: { equals: id } }

    let fullWhere = combineQueries(where, accessResults)

    const isTrashAttempt =
      collectionConfig.trash &&
      typeof data === 'object' &&
      data !== null &&
      'deletedAt' in data &&
      data.deletedAt != null

    if (isTrashAttempt && !overrideAccess) {
      const deleteAccessResult = await executeAccess({ req }, collectionConfig.access.delete)
      fullWhere = combineQueries(fullWhere, deleteAccessResult)
    }

    // Exclude trashed documents when trash: false
    fullWhere = appendNonTrashedFilter({
      enableTrash: collectionConfig.trash,
      trash,
      where: fullWhere,
    })

    const findOneArgs: FindOneArgs = {
      collection: collectionConfig.slug,
      locale: locale!,
      req,
      where: fullWhere,
    }

    const docWithLocales = await getLatestCollectionVersion<
      RequiredDataFromCollectionSlug<TSlug> & TypeWithID
    >({
      id,
      config: collectionConfig,
      payload,
      query: findOneArgs,
      req,
    })

    if (!docWithLocales && !hasWherePolicy) {
      throw new NotFound(req.t)
    }
    if (!docWithLocales && hasWherePolicy) {
      throw new Forbidden(req.t)
    }
    if (!docWithLocales) {
      throw new NotFound(req.t)
    }

    // /////////////////////////////////////
    // Generate data for all files and sizes
    // /////////////////////////////////////

    const { data: newFileData, files: filesToUpload } = await generateFileData({
      collection,
      config,
      data,
      operation: 'update',
      overwriteExistingFiles,
      req,
      throwOnMissingFile: false,
    })

    const select = sanitizeSelect({
      fields: collectionConfig.flattenedFields,
      forceSelect: collectionConfig.forceSelect,
      select: incomingSelect,
    })

    // ///////////////////////////////////////////////
    // Update document, runs all document level hooks
    // ///////////////////////////////////////////////

    let result = await updateDocument<TSlug, TSelect>({
      id,
      accessResults,
      autosave,
      collectionConfig,
      config,
      data: deepCopyObjectSimple(newFileData),
      depth: depth!,
      docWithLocales,
      draftArg,
      fallbackLocale: fallbackLocale!,
      filesToUpload,
      locale: locale!,
      overrideAccess: overrideAccess!,
      overrideLock: overrideLock!,
      payload,
      populate,
      publishSpecificLocale,
      req,
      select: select!,
      showHiddenFields: showHiddenFields!,
    })

    await unlinkTempFiles({
      collectionConfig,
      config,
      req,
    })

    // /////////////////////////////////////
    // afterOperation - Collection
    // /////////////////////////////////////

    result = (await buildAfterOperation({
      args,
      collection: collectionConfig,
      operation: 'updateByID',
      result,
    })) as TransformCollectionWithSelect<TSlug, TSelect>

    // /////////////////////////////////////
    // Return results
    // /////////////////////////////////////

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

---[FILE: count.ts]---
Location: payload-main/packages/payload/src/collections/operations/local/count.ts

```typescript
import type { CollectionSlug, Payload, RequestContext, TypedLocale } from '../../../index.js'
import type { Document, PayloadRequest, Where } from '../../../types/index.js'
import type { CreateLocalReqOptions } from '../../../utilities/createLocalReq.js'

import { APIError } from '../../../errors/index.js'
import { createLocalReq } from '../../../utilities/createLocalReq.js'
import { countOperation } from '../count.js'

export type Options<TSlug extends CollectionSlug> = {
  /**
   * the Collection slug to operate against.
   */
  collection: TSlug
  /**
   * [Context](https://payloadcms.com/docs/hooks/context), which will then be passed to `context` and `req.context`,
   * which can be read by hooks. Useful if you want to pass additional information to the hooks which
   * shouldn't be necessarily part of the document, for example a `triggerBeforeChange` option which can be read by the BeforeChange hook
   * to determine if it should run or not.
   */
  context?: RequestContext
  /**
   * [Control auto-population](https://payloadcms.com/docs/queries/depth) of nested relationship and upload fields.
   */
  depth?: number
  /**
   * When set to `true`, errors will not be thrown.
   */
  disableErrors?: boolean
  /**
   *  Specify [locale](https://payloadcms.com/docs/configuration/localization) for any returned documents.
   */
  locale?: TypedLocale
  /**
   * Skip access control.
   * Set to `false` if you want to respect Access Control for the operation, for example when fetching data for the front-end.
   * @default true
   */
  overrideAccess?: boolean
  /**
   * The `PayloadRequest` object. You can pass it to thread the current [transaction](https://payloadcms.com/docs/database/transactions), user and locale to the operation.
   * Recommended to pass when using the Local API from hooks, as usually you want to execute the operation within the current transaction.
   */
  req?: Partial<PayloadRequest>
  /**
   * When set to `true`, the query will include both normal and trashed documents.
   * To query only trashed documents, pass `trash: true` and combine with a `where` clause filtering by `deletedAt`.
   * By default (`false`), the query will only include normal documents and exclude those with a `deletedAt` field.
   *
   * This argument has no effect unless `trash` is enabled on the collection.
   * @default false
   */
  trash?: boolean
  /**
   * If you set `overrideAccess` to `false`, you can pass a user to use against the access control checks.
   */
  user?: Document
  /**
   * A filter [query](https://payloadcms.com/docs/queries/overview)
   */
  where?: Where
}

export async function countLocal<TSlug extends CollectionSlug>(
  payload: Payload,
  options: Options<TSlug>,
): Promise<{ totalDocs: number }> {
  const {
    collection: collectionSlug,
    disableErrors,
    overrideAccess = true,
    trash = false,
    where,
  } = options

  const collection = payload.collections[collectionSlug]

  if (!collection) {
    throw new APIError(
      `The collection with slug ${String(collectionSlug)} can't be found. Count Operation.`,
    )
  }

  return countOperation<TSlug>({
    collection,
    disableErrors,
    overrideAccess,
    req: await createLocalReq(options as CreateLocalReqOptions, payload),
    trash,
    where,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: countVersions.ts]---
Location: payload-main/packages/payload/src/collections/operations/local/countVersions.ts

```typescript
import type { CollectionSlug, Payload, RequestContext, TypedLocale } from '../../../index.js'
import type { Document, PayloadRequest, Where } from '../../../types/index.js'
import type { CreateLocalReqOptions } from '../../../utilities/createLocalReq.js'

import { APIError } from '../../../errors/index.js'
import { createLocalReq } from '../../../utilities/createLocalReq.js'
import { countVersionsOperation } from '../countVersions.js'

export type Options<TSlug extends CollectionSlug> = {
  /**
   * the Collection slug to operate against.
   */
  collection: TSlug
  /**
   * [Context](https://payloadcms.com/docs/hooks/context), which will then be passed to `context` and `req.context`,
   * which can be read by hooks. Useful if you want to pass additional information to the hooks which
   * shouldn't be necessarily part of the document, for example a `triggerBeforeChange` option which can be read by the BeforeChange hook
   * to determine if it should run or not.
   */
  context?: RequestContext
  /**
   * [Control auto-population](https://payloadcms.com/docs/queries/depth) of nested relationship and upload fields.
   */
  depth?: number
  /**
   * When set to `true`, errors will not be thrown.
   */
  disableErrors?: boolean
  /**
   * Specify [locale](https://payloadcms.com/docs/configuration/localization) for any returned documents.
   */
  locale?: TypedLocale
  /**
   * Skip access control.
   * Set to `false` if you want to respect Access Control for the operation, for example when fetching data for the front-end.
   * @default true
   */
  overrideAccess?: boolean
  /**
   * The `PayloadRequest` object. You can pass it to thread the current [transaction](https://payloadcms.com/docs/database/transactions), user and locale to the operation.
   * Recommended to pass when using the Local API from hooks, as usually you want to execute the operation within the current transaction.
   */
  req?: Partial<PayloadRequest>
  /**
   * If you set `overrideAccess` to `false`, you can pass a user to use against the access control checks.
   */
  user?: Document
  /**
   * A filter [query](https://payloadcms.com/docs/queries/overview)
   */
  where?: Where
}

export async function countVersionsLocal<TSlug extends CollectionSlug>(
  payload: Payload,
  options: Options<TSlug>,
): Promise<{ totalDocs: number }> {
  const { collection: collectionSlug, disableErrors, overrideAccess = true, where } = options

  const collection = payload.collections[collectionSlug]

  if (!collection) {
    throw new APIError(
      `The collection with slug ${String(collectionSlug)} can't be found. Count Versions Operation.`,
    )
  }

  return countVersionsOperation<TSlug>({
    collection,
    disableErrors,
    overrideAccess,
    req: await createLocalReq(options as CreateLocalReqOptions, payload),
    where,
  })
}
```

--------------------------------------------------------------------------------

````
