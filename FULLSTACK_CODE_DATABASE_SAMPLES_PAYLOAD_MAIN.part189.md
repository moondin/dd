---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 189
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 189 of 695)

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

---[FILE: findVersions.ts]---
Location: payload-main/packages/payload/src/collections/operations/local/findVersions.ts

```typescript
import type { PaginatedDocs } from '../../../database/types.js'
import type { CollectionSlug, Payload, RequestContext, TypedLocale } from '../../../index.js'
import type {
  Document,
  PayloadRequest,
  PopulateType,
  SelectType,
  Sort,
  Where,
} from '../../../types/index.js'
import type { CreateLocalReqOptions } from '../../../utilities/createLocalReq.js'
import type { TypeWithVersion } from '../../../versions/types.js'
import type { DataFromCollectionSlug } from '../../config/types.js'

import { APIError } from '../../../errors/index.js'
import { createLocalReq } from '../../../utilities/createLocalReq.js'
import { findVersionsOperation } from '../findVersions.js'

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
   * Whether the documents should be queried from the versions table/collection or not. [More](https://payloadcms.com/docs/versions/drafts#draft-api)
   */
  draft?: boolean
  /**
   * Specify a [fallback locale](https://payloadcms.com/docs/configuration/localization) to use for any returned documents.
   */
  fallbackLocale?: false | TypedLocale
  /**
   * The maximum related documents to be returned.
   * Defaults unless `defaultLimit` is specified for the collection config
   * @default 10
   */
  limit?: number
  /**
   * Specify [locale](https://payloadcms.com/docs/configuration/localization) for any returned documents.
   */
  locale?: 'all' | TypedLocale
  /**
   * Skip access control.
   * Set to `false` if you want to respect Access Control for the operation, for example when fetching data for the front-end.
   * @default true
   */
  overrideAccess?: boolean
  /**
   * Get a specific page number
   * @default 1
   */
  page?: number
  /**
   * Set to `false` to return all documents and avoid querying for document counts which introduces some overhead.
   * You can also combine that property with a specified `limit` to limit documents but avoid the count query.
   */
  pagination?: boolean
  /**
   * Specify [populate](https://payloadcms.com/docs/queries/select#populate) to control which fields to include to the result from populated documents.
   */
  populate?: PopulateType
  /**
   * The `PayloadRequest` object. You can pass it to thread the current [transaction](https://payloadcms.com/docs/database/transactions), user and locale to the operation.
   * Recommended to pass when using the Local API from hooks, as usually you want to execute the operation within the current transaction.
   */
  req?: Partial<PayloadRequest>
  /**
   * Specify [select](https://payloadcms.com/docs/queries/select) to control which fields to include to the result.
   */
  select?: SelectType
  /**
   * Opt-in to receiving hidden fields. By default, they are hidden from returned documents in accordance to your config.
   * @default false
   */
  showHiddenFields?: boolean
  /**
   * Sort the documents, can be a string or an array of strings
   * @example '-version.createdAt' // Sort DESC by createdAt
   * @example ['version.group', '-version.createdAt'] // sort by 2 fields, ASC group and DESC createdAt
   */
  sort?: Sort
  /**
   * When set to `true`, the query will include both normal and trashed (soft-deleted) documents.
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

export async function findVersionsLocal<TSlug extends CollectionSlug>(
  payload: Payload,
  options: Options<TSlug>,
): Promise<PaginatedDocs<TypeWithVersion<DataFromCollectionSlug<TSlug>>>> {
  const {
    collection: collectionSlug,
    depth,
    limit,
    overrideAccess = true,
    page,
    pagination = true,
    populate,
    select,
    showHiddenFields,
    sort,
    trash = false,
    where,
  } = options

  const collection = payload.collections[collectionSlug]

  if (!collection) {
    throw new APIError(
      `The collection with slug ${String(collectionSlug)} can't be found. Find Versions Operation.`,
    )
  }

  return findVersionsOperation({
    collection,
    depth,
    limit,
    overrideAccess,
    page,
    pagination,
    populate,
    req: await createLocalReq(options as CreateLocalReqOptions, payload),
    select,
    showHiddenFields,
    sort,
    trash,
    where,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: restoreVersion.ts]---
Location: payload-main/packages/payload/src/collections/operations/local/restoreVersion.ts

```typescript
import type { CollectionSlug, Payload, RequestContext, TypedLocale } from '../../../index.js'
import type { Document, PayloadRequest, PopulateType, SelectType } from '../../../types/index.js'
import type { CreateLocalReqOptions } from '../../../utilities/createLocalReq.js'
import type { DataFromCollectionSlug } from '../../config/types.js'

import { APIError } from '../../../errors/index.js'
import { createLocalReq } from '../../../utilities/createLocalReq.js'
import { restoreVersionOperation } from '../restoreVersion.js'

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
   * Whether the document should be queried from the versions table/collection or not. [More](https://payloadcms.com/docs/versions/drafts#draft-api)
   */
  draft?: boolean
  /**
   * Specify a [fallback locale](https://payloadcms.com/docs/configuration/localization) to use for any returned documents.
   */
  fallbackLocale?: false | TypedLocale
  /**
   * The ID of the version to restore.
   */
  id: string
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
   * Specify [populate](https://payloadcms.com/docs/queries/select#populate) to control which fields to include to the result from populated documents.
   */
  populate?: PopulateType
  /**
   * The `PayloadRequest` object. You can pass it to thread the current [transaction](https://payloadcms.com/docs/database/transactions), user and locale to the operation.
   * Recommended to pass when using the Local API from hooks, as usually you want to execute the operation within the current transaction.
   */
  req?: Partial<PayloadRequest>
  /**
   * Specify [select](https://payloadcms.com/docs/queries/select) to control which fields to include to the result.
   */
  select?: SelectType
  /**
   * Opt-in to receiving hidden fields. By default, they are hidden from returned documents in accordance to your config.
   * @default false
   */
  showHiddenFields?: boolean
  /**
   * If you set `overrideAccess` to `false`, you can pass a user to use against the access control checks.
   */
  user?: Document
}

export async function restoreVersionLocal<TSlug extends CollectionSlug>(
  payload: Payload,
  options: Options<TSlug>,
): Promise<DataFromCollectionSlug<TSlug>> {
  const {
    id,
    collection: collectionSlug,
    depth,
    overrideAccess = true,
    populate,
    select,
    showHiddenFields,
  } = options

  const collection = payload.collections[collectionSlug]

  if (!collection) {
    throw new APIError(
      `The collection with slug ${String(
        collectionSlug,
      )} can't be found. Restore Version Operation.`,
    )
  }

  const args = {
    id,
    collection,
    depth,
    overrideAccess,
    payload,
    populate,
    req: await createLocalReq(options as CreateLocalReqOptions, payload),
    select,
    showHiddenFields,
  }

  return restoreVersionOperation(args)
}
```

--------------------------------------------------------------------------------

---[FILE: update.ts]---
Location: payload-main/packages/payload/src/collections/operations/local/update.ts

```typescript
import type { DeepPartial } from 'ts-essentials'

import type { CollectionSlug, Payload, RequestContext, TypedLocale } from '../../../index.js'
import type {
  Document,
  PayloadRequest,
  PopulateType,
  SelectType,
  Sort,
  TransformCollectionWithSelect,
  Where,
} from '../../../types/index.js'
import type { File } from '../../../uploads/types.js'
import type { CreateLocalReqOptions } from '../../../utilities/createLocalReq.js'
import type {
  BulkOperationResult,
  RequiredDataFromCollectionSlug,
  SelectFromCollectionSlug,
} from '../../config/types.js'

import { APIError } from '../../../errors/index.js'
import { getFileByPath } from '../../../uploads/getFileByPath.js'
import { createLocalReq } from '../../../utilities/createLocalReq.js'
import { updateOperation } from '../update.js'
import { updateByIDOperation } from '../updateByID.js'

export type BaseOptions<TSlug extends CollectionSlug, TSelect extends SelectType> = {
  /**
   * Whether the current update should be marked as from autosave.
   * `versions.drafts.autosave` should be specified.
   */
  autosave?: boolean
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
   * The document / documents data to update.
   */
  data: DeepPartial<RequiredDataFromCollectionSlug<TSlug>>
  /**
   * [Control auto-population](https://payloadcms.com/docs/queries/depth) of nested relationship and upload fields.
   */
  depth?: number
  /**
   * When set to `true`, a [database transactions](https://payloadcms.com/docs/database/transactions) will not be initialized.
   * @default false
   */
  disableTransaction?: boolean
  /**
   * Update documents to a draft.
   */
  draft?: boolean
  /**
   * Specify a [fallback locale](https://payloadcms.com/docs/configuration/localization) to use for any returned documents.
   */
  fallbackLocale?: false | TypedLocale
  /**
   * A `File` object when updating a collection with `upload: true`.
   */
  file?: File
  /**
   * A file path when creating a collection with `upload: true`.
   */
  filePath?: string
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
   * By default, document locks are ignored (`true`). Set to `false` to enforce locks and prevent operations when a document is locked by another user. [More details](https://payloadcms.com/docs/admin/locked-documents).
   * @default true
   */
  overrideLock?: boolean
  /**
   * If you are uploading a file and would like to replace
   * the existing file instead of generating a new filename,
   * you can set the following property to `true`
   */
  overwriteExistingFiles?: boolean
  /**
   * Specify [populate](https://payloadcms.com/docs/queries/select#populate) to control which fields to include to the result from populated documents.
   */
  populate?: PopulateType
  /**
   * Publish the document / documents with a specific locale.
   */
  publishSpecificLocale?: string
  /**
   * The `PayloadRequest` object. You can pass it to thread the current [transaction](https://payloadcms.com/docs/database/transactions), user and locale to the operation.
   * Recommended to pass when using the Local API from hooks, as usually you want to execute the operation within the current transaction.
   */
  req?: Partial<PayloadRequest>
  /**
   * Specify [select](https://payloadcms.com/docs/queries/select) to control which fields to include to the result.
   */
  select?: TSelect
  /**
   * Opt-in to receiving hidden fields. By default, they are hidden from returned documents in accordance to your config.
   * @default false
   */
  showHiddenFields?: boolean
  /**
   * When set to `true`, the operation will update both normal and trashed (soft-deleted) documents.
   * To update only trashed documents, pass `trash: true` and combine with a `where` clause filtering by `deletedAt`.
   * By default (`false`), the update will only include normal documents and exclude those with a `deletedAt` field.
   * @default false
   */
  trash?: boolean
  /**
   * If you set `overrideAccess` to `false`, you can pass a user to use against the access control checks.
   */
  user?: Document
}

export type ByIDOptions<
  TSlug extends CollectionSlug,
  TSelect extends SelectFromCollectionSlug<TSlug>,
> = {
  /**
   * The ID of the document to update.
   */
  id: number | string
  /**
   * Limit documents to update
   */
  limit?: never
  /**
   * Sort the documents, can be a string or an array of strings
   * @example '-createdAt' // Sort DESC by createdAt
   * @example ['group', '-createdAt'] // sort by 2 fields, ASC group and DESC createdAt
   */
  sort?: never
  /**
   * A filter [query](https://payloadcms.com/docs/queries/overview)
   */
  where?: never
} & BaseOptions<TSlug, TSelect>

export type ManyOptions<
  TSlug extends CollectionSlug,
  TSelect extends SelectFromCollectionSlug<TSlug>,
> = {
  /**
   * The ID of the document to update.
   */
  id?: never
  /**
   * Limit documents to update
   */
  limit?: number
  /**
   * Sort the documents, can be a string or an array of strings
   * @example '-createdAt' // Sort DESC by createdAt
   * @example ['group', '-createdAt'] // sort by 2 fields, ASC group and DESC createdAt
   */
  sort?: Sort
  /**
   * A filter [query](https://payloadcms.com/docs/queries/overview)
   */
  where: Where
} & BaseOptions<TSlug, TSelect>

export type Options<
  TSlug extends CollectionSlug,
  TSelect extends SelectFromCollectionSlug<TSlug>,
> = ByIDOptions<TSlug, TSelect> | ManyOptions<TSlug, TSelect>

async function updateLocal<
  TSlug extends CollectionSlug,
  TSelect extends SelectFromCollectionSlug<TSlug>,
>(
  payload: Payload,
  options: ByIDOptions<TSlug, TSelect>,
): Promise<TransformCollectionWithSelect<TSlug, TSelect>>
async function updateLocal<
  TSlug extends CollectionSlug,
  TSelect extends SelectFromCollectionSlug<TSlug>,
>(
  payload: Payload,
  options: ManyOptions<TSlug, TSelect>,
): Promise<BulkOperationResult<TSlug, TSelect>>
async function updateLocal<
  TSlug extends CollectionSlug,
  TSelect extends SelectFromCollectionSlug<TSlug>,
>(
  payload: Payload,
  options: Options<TSlug, TSelect>,
): Promise<BulkOperationResult<TSlug, TSelect> | TransformCollectionWithSelect<TSlug, TSelect>>
async function updateLocal<
  TSlug extends CollectionSlug,
  TSelect extends SelectFromCollectionSlug<TSlug>,
>(
  payload: Payload,
  options: Options<TSlug, TSelect>,
): Promise<BulkOperationResult<TSlug, TSelect> | TransformCollectionWithSelect<TSlug, TSelect>> {
  const {
    id,
    autosave,
    collection: collectionSlug,
    data,
    depth,
    disableTransaction,
    draft,
    file,
    filePath,
    limit,
    overrideAccess = true,
    overrideLock,
    overwriteExistingFiles = false,
    populate,
    publishSpecificLocale,
    select,
    showHiddenFields,
    sort,
    trash = false,
    where,
  } = options

  const collection = payload.collections[collectionSlug]

  if (!collection) {
    throw new APIError(
      `The collection with slug ${String(collectionSlug)} can't be found. Update Operation.`,
    )
  }

  const req = await createLocalReq(options as CreateLocalReqOptions, payload)
  req.file = file ?? (await getFileByPath(filePath!))

  const args = {
    id,
    autosave,
    collection,
    data,
    depth,
    disableTransaction,
    draft,
    limit,
    overrideAccess,
    overrideLock,
    overwriteExistingFiles,
    payload,
    populate,
    publishSpecificLocale,
    req,
    select,
    showHiddenFields,
    sort,
    trash,
    where,
  }

  if (options.id) {
    // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
    return updateByIDOperation<TSlug, TSelect>(args)
  }
  // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
  return updateOperation<TSlug, TSelect>(args)
}

export { updateLocal }
```

--------------------------------------------------------------------------------

---[FILE: buildAfterOperation.ts]---
Location: payload-main/packages/payload/src/collections/operations/utilities/buildAfterOperation.ts

```typescript
import type { CollectionSlug } from '../../../index.js'
import type { AfterOperationArg, OperationMap, OperationResult } from './types.js'

export const buildAfterOperation = async <
  TOperationGeneric extends CollectionSlug,
  O extends keyof OperationMap<TOperationGeneric> = keyof OperationMap<TOperationGeneric>,
>(
  operationArgs: { operation: O } & Omit<AfterOperationArg<TOperationGeneric>, 'req'>,
): Promise<any | OperationResult<TOperationGeneric, O>> => {
  const { args, collection, operation, result } = operationArgs

  let newResult = result as OperationResult<TOperationGeneric, O>

  if (args.collection.config.hooks?.afterOperation?.length) {
    for (const hook of args.collection.config.hooks.afterOperation) {
      const hookResult = await hook({
        args,
        collection,
        operation,
        req: args.req,
        result: newResult,
      } as AfterOperationArg<TOperationGeneric>)

      if (hookResult !== undefined) {
        newResult = hookResult as OperationResult<TOperationGeneric, O>
      }
    }
  }

  return newResult
}
```

--------------------------------------------------------------------------------

---[FILE: buildBeforeOperation.ts]---
Location: payload-main/packages/payload/src/collections/operations/utilities/buildBeforeOperation.ts

```typescript
import type { CollectionSlug } from '../../../index.js'
import type { BeforeOperationArg, OperationArgs, OperationMap } from './types.js'

import { operationToHookOperation } from './types.js'
// Specific overloads with TArgs (these take priority over the general overload)
// Overload for 'read' operation (deprecated, backward compatibility)

/**
 * TODO V4: remove overloads and operations should be the literal operation that was called
 *
 * - `read`: replace with `find` and `findByID` in both operations
 * - `delete`: replace with `deleteByID` in deleteByID operation
 * - `update`: replace with `updateByID` in updateByID operation
 */

/**
 * @deprecated
 *
 * Should use `find` or `findByID`
 */
export async function buildBeforeOperation<TOperationGeneric extends CollectionSlug, TArgs>(
  operationArgs: {
    args: TArgs
    operation: 'read'
  } & Omit<BeforeOperationArg<TOperationGeneric>, 'args' | 'context' | 'operation' | 'req'>,
): Promise<TArgs>

/**
 * Overload for 'readDistinct' operation
 *
 * @deprecated - use `findDistinct`
 */
export async function buildBeforeOperation<TOperationGeneric extends CollectionSlug, TArgs>(
  operationArgs: {
    args: TArgs
    operation: 'readDistinct'
  } & Omit<BeforeOperationArg<TOperationGeneric>, 'args' | 'context' | 'operation' | 'req'>,
): Promise<TArgs>

// Overload for 'update' operation (can be called by both update and updateByID)
export async function buildBeforeOperation<TOperationGeneric extends CollectionSlug, TArgs>(
  operationArgs: {
    args: TArgs
    operation: 'update'
  } & Omit<BeforeOperationArg<TOperationGeneric>, 'args' | 'context' | 'operation' | 'req'>,
): Promise<TArgs>

// Overload for 'updateByID' operation
export async function buildBeforeOperation<TOperationGeneric extends CollectionSlug, TArgs>(
  operationArgs: {
    args: TArgs
    operation: 'updateByID'
  } & Omit<BeforeOperationArg<TOperationGeneric>, 'args' | 'context' | 'operation' | 'req'>,
): Promise<TArgs>

export async function buildBeforeOperation<TOperationGeneric extends CollectionSlug, TArgs>(
  operationArgs: {
    args: TArgs
    operation: 'delete'
  } & Omit<BeforeOperationArg<TOperationGeneric>, 'args' | 'context' | 'operation' | 'req'>,
): Promise<TArgs>

// Overload for 'deleteByID' operation
export async function buildBeforeOperation<TOperationGeneric extends CollectionSlug, TArgs>(
  operationArgs: {
    args: TArgs
    operation: 'deleteByID'
  } & Omit<BeforeOperationArg<TOperationGeneric>, 'args' | 'context' | 'operation' | 'req'>,
): Promise<TArgs>

// General overload for operations that exist in OperationMap (fallback)
export async function buildBeforeOperation<
  TOperationGeneric extends CollectionSlug,
  O extends keyof OperationMap<TOperationGeneric>,
>(
  operationArgs: { operation: O } & Omit<BeforeOperationArg<TOperationGeneric>, 'context' | 'req'>,
): Promise<OperationArgs<TOperationGeneric, O>>

// Implementation
export async function buildBeforeOperation<TOperationGeneric extends CollectionSlug>(
  operationArgs: Omit<BeforeOperationArg<TOperationGeneric>, 'context' | 'req'>,
): Promise<unknown> {
  const { args, collection, operation } = operationArgs

  let newArgs = args

  if (args.collection.config.hooks?.beforeOperation?.length) {
    // TODO: v4 should not need this mapping
    // Map the operation to the hook operation type for backward compatibility
    const hookOperation = operationToHookOperation[operation]

    for (const hook of args.collection.config.hooks.beforeOperation) {
      const hookResult = await hook({
        args: newArgs,
        collection,
        context: args.req!.context,
        operation: hookOperation,
        req: args.req!,
      } as BeforeOperationArg<TOperationGeneric>)

      if (hookResult !== undefined) {
        newArgs = hookResult
      }
    }
  }

  return newArgs
}
```

--------------------------------------------------------------------------------

---[FILE: sanitizeSortQuery.ts]---
Location: payload-main/packages/payload/src/collections/operations/utilities/sanitizeSortQuery.ts

```typescript
import type { FlattenedField } from '../../../fields/config/types.js'

const sanitizeSort = ({ fields, sort }: { fields: FlattenedField[]; sort: string }): string => {
  let sortProperty = sort
  let desc = false
  if (sort.indexOf('-') === 0) {
    desc = true
    sortProperty = sortProperty.substring(1)
  }

  const segments = sortProperty.split('.')

  for (const segment of segments) {
    const field = fields.find((each) => each.name === segment)
    if (!field) {
      return sort
    }

    if ('fields' in field) {
      fields = field.flattenedFields
      continue
    }

    if ('virtual' in field && typeof field.virtual === 'string') {
      return `${desc ? '-' : ''}${field.virtual}`
    }
  }

  return sort
}

/**
 * Sanitizes the sort parameter, for example virtual fields linked to relationships are replaced with the full path.
 */
export const sanitizeSortQuery = ({
  fields,
  sort,
}: {
  fields: FlattenedField[]
  sort?: string | string[]
}): string | string[] | undefined => {
  if (!sort) {
    return undefined
  }

  if (Array.isArray(sort)) {
    return sort.map((sort) => sanitizeSort({ fields, sort }))
  }

  return sanitizeSort({ fields, sort })
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/payload/src/collections/operations/utilities/types.ts

```typescript
import type { forgotPasswordOperation } from '../../../auth/operations/forgotPassword.js'
import type { loginOperation } from '../../../auth/operations/login.js'
import type { refreshOperation } from '../../../auth/operations/refresh.js'
import type { resetPasswordOperation } from '../../../auth/operations/resetPassword.js'
import type { unlockOperation } from '../../../auth/operations/unlock.js'
import type { CollectionSlug, RequestContext, restoreVersionOperation } from '../../../index.js'
import type { PayloadRequest } from '../../../types/index.js'
import type { SanitizedCollectionConfig, SelectFromCollectionSlug } from '../../config/types.js'
import type { countOperation } from '../count.js'
import type { countVersionsOperation } from '../countVersions.js'
import type { createOperation } from '../create.js'
import type { deleteOperation } from '../delete.js'
import type { deleteByIDOperation } from '../deleteByID.js'
import type { findOperation } from '../find.js'
import type { findByIDOperation } from '../findByID.js'
import type { findDistinctOperation } from '../findDistinct.js'
import type { findVersionByIDOperation } from '../findVersionByID.js'
import type { findVersionsOperation } from '../findVersions.js'
import type { updateOperation } from '../update.js'
import type { updateByIDOperation } from '../updateByID.js'

export type OperationMap<TOperationGeneric extends CollectionSlug> = {
  count: typeof countOperation<TOperationGeneric>
  countVersions: typeof countVersionsOperation<TOperationGeneric>
  create: typeof createOperation<TOperationGeneric, SelectFromCollectionSlug<TOperationGeneric>>
  delete: typeof deleteOperation<TOperationGeneric, SelectFromCollectionSlug<TOperationGeneric>>
  deleteByID: typeof deleteByIDOperation<
    TOperationGeneric,
    SelectFromCollectionSlug<TOperationGeneric>
  >
  find: typeof findOperation<TOperationGeneric, SelectFromCollectionSlug<TOperationGeneric>>
  findByID: typeof findByIDOperation<
    TOperationGeneric,
    boolean,
    SelectFromCollectionSlug<TOperationGeneric>
  >
  findDistinct: typeof findDistinctOperation
  findVersionByID: typeof findVersionByIDOperation
  findVersions: typeof findVersionsOperation
  forgotPassword: typeof forgotPasswordOperation
  login: typeof loginOperation<TOperationGeneric>
  refresh: typeof refreshOperation
  resetPassword: typeof resetPasswordOperation<TOperationGeneric>
  restoreVersion: typeof restoreVersionOperation
  unlock: typeof unlockOperation<TOperationGeneric>
  update: typeof updateOperation<TOperationGeneric, SelectFromCollectionSlug<TOperationGeneric>>
  updateByID: typeof updateByIDOperation<
    TOperationGeneric,
    SelectFromCollectionSlug<TOperationGeneric>
  >
}

export type AfterOperationArg<TOperationGeneric extends CollectionSlug> = {
  /** The collection which this hook is being run on */
  collection: SanitizedCollectionConfig
  req: PayloadRequest
} & (
  | {
      args: Parameters<OperationMap<TOperationGeneric>['count']>[0]
      operation: 'count'
      result: Awaited<ReturnType<OperationMap<TOperationGeneric>['count']>>
    }
  | {
      args: Parameters<OperationMap<TOperationGeneric>['countVersions']>[0]
      operation: 'countVersions'
      result: Awaited<ReturnType<OperationMap<TOperationGeneric>['countVersions']>>
    }
  | {
      args: Parameters<OperationMap<TOperationGeneric>['create']>[0]
      operation: 'create'
      result: Awaited<ReturnType<OperationMap<TOperationGeneric>['create']>>
    }
  | {
      args: Parameters<OperationMap<TOperationGeneric>['delete']>[0]
      operation: 'delete'
      result: Awaited<ReturnType<OperationMap<TOperationGeneric>['delete']>>
    }
  | {
      args: Parameters<OperationMap<TOperationGeneric>['deleteByID']>[0]
      operation: 'deleteByID'
      result: Awaited<ReturnType<OperationMap<TOperationGeneric>['deleteByID']>>
    }
  | {
      args: Parameters<OperationMap<TOperationGeneric>['find']>[0]
      /**
       * @deprecated Use 'find' or 'findByID' operation instead
       *
       * TODO: v4 - remove this union option
       */
      operation: 'read'
      result: Awaited<ReturnType<OperationMap<TOperationGeneric>['find']>>
    }
  | {
      args: Parameters<OperationMap<TOperationGeneric>['find']>[0]
      operation: 'find'
      result: Awaited<ReturnType<OperationMap<TOperationGeneric>['find']>>
    }
  | {
      args: Parameters<OperationMap<TOperationGeneric>['findByID']>[0]
      operation: 'findByID'
      result: Awaited<ReturnType<OperationMap<TOperationGeneric>['findByID']>>
    }
  | {
      args: Parameters<OperationMap<TOperationGeneric>['findDistinct']>[0]
      operation: 'findDistinct'
      result: Awaited<ReturnType<OperationMap<TOperationGeneric>['findDistinct']>>
    }
  | {
      args: Parameters<OperationMap<TOperationGeneric>['findVersionByID']>[0]
      operation: 'findVersionByID'
      result: Awaited<ReturnType<OperationMap<TOperationGeneric>['findVersionByID']>>
    }
  | {
      args: Parameters<OperationMap<TOperationGeneric>['findVersions']>[0]
      operation: 'findVersions'
      result: Awaited<ReturnType<OperationMap<TOperationGeneric>['findVersions']>>
    }
  | {
      args: Parameters<OperationMap<TOperationGeneric>['forgotPassword']>[0]
      operation: 'forgotPassword'
      result: Awaited<ReturnType<OperationMap<TOperationGeneric>['forgotPassword']>>
    }
  | {
      args: Parameters<OperationMap<TOperationGeneric>['login']>[0]
      operation: 'login'
      result: Awaited<ReturnType<OperationMap<TOperationGeneric>['login']>>
    }
  | {
      args: Parameters<OperationMap<TOperationGeneric>['refresh']>[0]
      operation: 'refresh'
      result: Awaited<ReturnType<OperationMap<TOperationGeneric>['refresh']>>
    }
  | {
      args: Parameters<OperationMap<TOperationGeneric>['resetPassword']>[0]
      operation: 'resetPassword'
      result: Awaited<ReturnType<OperationMap<TOperationGeneric>['resetPassword']>>
    }
  | {
      args: Parameters<OperationMap<TOperationGeneric>['restoreVersion']>[0]
      operation: 'restoreVersion'
      result: Awaited<ReturnType<OperationMap<TOperationGeneric>['restoreVersion']>>
    }
  | {
      args: Parameters<OperationMap<TOperationGeneric>['unlock']>[0]
      operation: 'unlock'
      result: Awaited<ReturnType<OperationMap<TOperationGeneric>['unlock']>>
    }
  | {
      args: Parameters<OperationMap<TOperationGeneric>['update']>[0]
      operation: 'update'
      result: Awaited<ReturnType<OperationMap<TOperationGeneric>['update']>>
    }
  | {
      args: Parameters<OperationMap<TOperationGeneric>['updateByID']>[0]
      operation: 'updateByID'
      result: Awaited<ReturnType<OperationMap<TOperationGeneric>['updateByID']>>
    }
)

export type OperationResult<
  TOperationGeneric extends CollectionSlug,
  O extends keyof OperationMap<TOperationGeneric>,
> = Awaited<ReturnType<OperationMap<TOperationGeneric>[O]>>

export type OperationArgs<
  TOperationGeneric extends CollectionSlug,
  O extends keyof OperationMap<TOperationGeneric>,
> = Parameters<OperationMap<TOperationGeneric>[O]>[0]

// Map internal operation names to HookOperationType
export const operationToHookOperation = {
  count: 'count',
  countVersions: 'countVersions',
  create: 'create',
  delete: 'delete',
  deleteByID: 'delete',
  find: 'read',
  findByID: 'read',
  findDistinct: 'readDistinct',
  findVersionByID: 'read',
  findVersions: 'read',
  forgotPassword: 'forgotPassword',
  login: 'login',
  read: 'read',
  readDistinct: 'readDistinct',
  refresh: 'refresh',
  resetPassword: 'resetPassword',
  restoreVersion: 'restoreVersion',
  unlock: 'unlock',
  update: 'update',
  updateByID: 'update',
} as const

export type BeforeOperationArg<TOperationGeneric extends CollectionSlug> = {
  /** The collection which this hook is being run on */
  collection: SanitizedCollectionConfig
  context: RequestContext
  req: PayloadRequest
} & (
  | {
      args:
        | Parameters<OperationMap<TOperationGeneric>['find']>[0]
        | Parameters<OperationMap<TOperationGeneric>['findByID']>[0]
      /**
       * @deprecated Use 'find' or 'findByID' operation instead
       *
       * TODO: v4 - remove this union option
       */
      operation: 'read'
    }
  | {
      args: Parameters<OperationMap<TOperationGeneric>['count']>[0]
      operation: 'count'
    }
  | {
      args: Parameters<OperationMap<TOperationGeneric>['countVersions']>[0]
      operation: 'countVersions'
    }
  | {
      args: Parameters<OperationMap<TOperationGeneric>['create']>[0]
      operation: 'create'
    }
  | {
      args: Parameters<OperationMap<TOperationGeneric>['delete']>[0]
      operation: 'delete'
    }
  | {
      args: Parameters<OperationMap<TOperationGeneric>['deleteByID']>[0]
      operation: 'deleteByID'
    }
  | {
      args: Parameters<OperationMap<TOperationGeneric>['find']>[0]
      operation: 'find'
    }
  | {
      args: Parameters<OperationMap<TOperationGeneric>['findByID']>[0]
      operation: 'findByID'
    }
  | {
      args: Parameters<OperationMap<TOperationGeneric>['findDistinct']>[0]
      /**
       * @deprecated Use 'findDistinct' operation instead
       *
       * TODO: v4 - remove this union option
       */
      operation: 'readDistinct'
    }
  | {
      args: Parameters<OperationMap<TOperationGeneric>['findDistinct']>[0]
      operation: 'findDistinct'
    }
  | {
      args: Parameters<OperationMap<TOperationGeneric>['findVersionByID']>[0]
      operation: 'findVersionByID'
    }
  | {
      args: Parameters<OperationMap<TOperationGeneric>['findVersions']>[0]
      operation: 'findVersions'
    }
  | {
      args: Parameters<OperationMap<TOperationGeneric>['forgotPassword']>[0]
      operation: 'forgotPassword'
    }
  | {
      args: Parameters<OperationMap<TOperationGeneric>['login']>[0]
      operation: 'login'
    }
  | {
      args: Parameters<OperationMap<TOperationGeneric>['refresh']>[0]
      operation: 'refresh'
    }
  | {
      args: Parameters<OperationMap<TOperationGeneric>['resetPassword']>[0]
      operation: 'resetPassword'
    }
  | {
      args: Parameters<OperationMap<TOperationGeneric>['restoreVersion']>[0]
      operation: 'restoreVersion'
    }
  | {
      args: Parameters<OperationMap<TOperationGeneric>['unlock']>[0]
      operation: 'unlock'
    }
  | {
      args: Parameters<OperationMap<TOperationGeneric>['update']>[0]
      operation: 'update'
    }
  | {
      args: Parameters<OperationMap<TOperationGeneric>['updateByID']>[0]
      operation: 'updateByID'
    }
)
```

--------------------------------------------------------------------------------

````
