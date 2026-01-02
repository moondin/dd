---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 308
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 308 of 695)

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

---[FILE: resetPassword.ts]---
Location: payload-main/packages/sdk/src/auth/resetPassword.ts

```typescript
import type { PayloadSDK } from '../index.js'
import type { AuthCollectionSlug, DataFromCollectionSlug, PayloadGeneratedTypes } from '../types.js'

export type ResetPasswordOptions<
  T extends PayloadGeneratedTypes,
  TSlug extends AuthCollectionSlug<T>,
> = {
  collection: TSlug
  data: {
    password: string
    token: string
  }
}

export type ResetPasswordResult<
  T extends PayloadGeneratedTypes,
  TSlug extends AuthCollectionSlug<T>,
> = {
  token?: string
  // @ts-expect-error auth collection and user collection
  user: DataFromCollectionSlug<T, TSlug>
}

export async function resetPassword<
  T extends PayloadGeneratedTypes,
  TSlug extends AuthCollectionSlug<T>,
>(
  sdk: PayloadSDK<T>,
  options: ResetPasswordOptions<T, TSlug>,
  init?: RequestInit,
): Promise<ResetPasswordResult<T, TSlug>> {
  const response = await sdk.request({
    init,
    json: options.data,
    method: 'POST',
    path: `/${options.collection}/reset-password`,
  })

  return response.json()
}
```

--------------------------------------------------------------------------------

---[FILE: verifyEmail.ts]---
Location: payload-main/packages/sdk/src/auth/verifyEmail.ts

```typescript
import type { PayloadSDK } from '../index.js'
import type { AuthCollectionSlug, PayloadGeneratedTypes } from '../types.js'

export type VerifyEmailOptions<
  T extends PayloadGeneratedTypes,
  TSlug extends AuthCollectionSlug<T>,
> = {
  collection: TSlug
  token: string
}

export async function verifyEmail<
  T extends PayloadGeneratedTypes,
  TSlug extends AuthCollectionSlug<T>,
>(
  sdk: PayloadSDK<T>,
  options: VerifyEmailOptions<T, TSlug>,
  init?: RequestInit,
): Promise<{ message: string }> {
  const response = await sdk.request({
    init,
    method: 'POST',
    path: `/${options.collection}/verify/${options.token}`,
  })

  return response.json()
}
```

--------------------------------------------------------------------------------

---[FILE: count.ts]---
Location: payload-main/packages/sdk/src/collections/count.ts

```typescript
import type { Where } from 'payload'

import type { PayloadSDK } from '../index.js'
import type { CollectionSlug, PayloadGeneratedTypes, TypedLocale } from '../types.js'

export type CountOptions<T extends PayloadGeneratedTypes, TSlug extends CollectionSlug<T>> = {
  /**
   * the Collection slug to operate against.
   */
  collection: TSlug
  /**
   *  Specify [locale](https://payloadcms.com/docs/configuration/localization) for any returned documents.
   */
  locale?: 'all' | TypedLocale<T>
  /**
   * A filter [query](https://payloadcms.com/docs/queries/overview)
   */
  where?: Where
}

export async function count<T extends PayloadGeneratedTypes, TSlug extends CollectionSlug<T>>(
  sdk: PayloadSDK<T>,
  options: CountOptions<T, TSlug>,
  init?: RequestInit,
): Promise<{ totalDocs: number }> {
  const response = await sdk.request({
    args: options,
    init,
    method: 'GET',
    path: `/${options.collection}/count`,
  })

  return response.json()
}
```

--------------------------------------------------------------------------------

---[FILE: create.ts]---
Location: payload-main/packages/sdk/src/collections/create.ts

```typescript
import type { SelectType } from 'payload'

import type { PayloadSDK } from '../index.js'
import type {
  CollectionSlug,
  PayloadGeneratedTypes,
  PopulateType,
  RequiredDataFromCollectionSlug,
  TransformCollectionWithSelect,
  TypedLocale,
  UploadCollectionSlug,
} from '../types.js'

import { resolveFileFromOptions } from '../utilities/resolveFileFromOptions.js'

export type CreateOptions<
  T extends PayloadGeneratedTypes,
  TSlug extends CollectionSlug<T>,
  TSelect extends SelectType,
> = {
  /**
   * the Collection slug to operate against.
   */
  collection: TSlug
  /**
   * The data for the document to create.
   */
  data: RequiredDataFromCollectionSlug<T, TSlug>
  /**
   * [Control auto-population](https://payloadcms.com/docs/queries/depth) of nested relationship and upload fields.
   */
  depth?: number
  /**
   * Create a **draft** document. [More](https://payloadcms.com/docs/versions/drafts#draft-api)
   */
  draft?: boolean
  /**
   * Specify a [fallback locale](https://payloadcms.com/docs/configuration/localization) to use for any returned documents.
   */
  fallbackLocale?: false | TypedLocale<T>
  /** File Blob object or URL to the file. Only for upload collections */
  file?: TSlug extends UploadCollectionSlug<T> ? Blob | string : never
  /**
   * Specify [locale](https://payloadcms.com/docs/configuration/localization) for any returned documents.
   */
  locale?: 'all' | TypedLocale<T>
  /**
   * Specify [populate](https://payloadcms.com/docs/queries/select#populate) to control which fields to include to the result from populated documents.
   */
  populate?: PopulateType<T>
  /**
   * Specify [select](https://payloadcms.com/docs/queries/select) to control which fields to include to the result.
   */
  select?: TSelect
}

export async function create<
  T extends PayloadGeneratedTypes,
  TSlug extends CollectionSlug<T>,
  TSelect extends SelectType,
>(
  sdk: PayloadSDK<T>,
  options: CreateOptions<T, TSlug, TSelect>,
  init?: RequestInit,
): Promise<TransformCollectionWithSelect<T, TSlug, TSelect>> {
  let file: Blob | undefined = undefined

  if (options.file) {
    file = await resolveFileFromOptions(options.file)
  }

  const response = await sdk.request({
    args: options,
    file,
    init,
    json: options.data,
    method: 'POST',
    path: `/${options.collection}`,
  })

  const json = await response.json()

  return json.doc
}
```

--------------------------------------------------------------------------------

---[FILE: delete.ts]---
Location: payload-main/packages/sdk/src/collections/delete.ts

```typescript
import type { SelectType, Where } from 'payload'

import type { PayloadSDK } from '../index.js'
import type {
  BulkOperationResult,
  CollectionSlug,
  PayloadGeneratedTypes,
  PopulateType,
  SelectFromCollectionSlug,
  TransformCollectionWithSelect,
  TypedLocale,
} from '../types.js'

export type DeleteBaseOptions<
  T extends PayloadGeneratedTypes,
  TSlug extends CollectionSlug<T>,
  TSelect extends SelectType,
> = {
  /**
   * the Collection slug to operate against.
   */
  collection: TSlug
  /**
   * [Control auto-population](https://payloadcms.com/docs/queries/depth) of nested relationship and upload fields.
   */
  depth?: number
  draft?: boolean
  /**
   * Specify a [fallback locale](https://payloadcms.com/docs/configuration/localization) to use for any returned documents.
   */
  fallbackLocale?: false | TypedLocale<T>
  /**
   * Specify [locale](https://payloadcms.com/docs/configuration/localization) for any returned documents.
   */
  locale?: TypedLocale<T>
  /**
   * Specify [populate](https://payloadcms.com/docs/queries/select#populate) to control which fields to include to the result from populated documents.
   */
  populate?: PopulateType<T>
  /**
   * Specify [select](https://payloadcms.com/docs/queries/select) to control which fields to include to the result.
   */
  select?: TSelect
}

export type DeleteByIDOptions<
  T extends PayloadGeneratedTypes,
  TSlug extends CollectionSlug<T>,
  TSelect extends SelectFromCollectionSlug<T, TSlug>,
> = {
  /**
   * The ID of the document to delete.
   */
  id: number | string

  where?: never
} & DeleteBaseOptions<T, TSlug, TSelect>

export type DeleteManyOptions<
  T extends PayloadGeneratedTypes,
  TSlug extends CollectionSlug<T>,
  TSelect extends SelectFromCollectionSlug<T, TSlug>,
> = {
  id?: never
  /**
   * A filter [query](https://payloadcms.com/docs/queries/overview)
   */
  where: Where
} & DeleteBaseOptions<T, TSlug, TSelect>

export type DeleteOptions<
  T extends PayloadGeneratedTypes,
  TSlug extends CollectionSlug<T>,
  TSelect extends SelectFromCollectionSlug<T, TSlug>,
> = DeleteByIDOptions<T, TSlug, TSelect> | DeleteManyOptions<T, TSlug, TSelect>

export async function deleteOperation<
  T extends PayloadGeneratedTypes,
  TSlug extends CollectionSlug<T>,
  TSelect extends SelectFromCollectionSlug<T, TSlug>,
>(
  sdk: PayloadSDK<T>,
  options: DeleteOptions<T, TSlug, TSelect>,
  init?: RequestInit,
): Promise<
  BulkOperationResult<T, TSlug, TSelect> | TransformCollectionWithSelect<T, TSlug, TSelect>
> {
  const response = await sdk.request({
    args: options,
    init,
    method: 'DELETE',
    path: `/${options.collection}${options.id ? `/${options.id}` : ''}`,
  })

  const json = await response.json()

  if (options.id) {
    return json.doc
  }

  return json
}
```

--------------------------------------------------------------------------------

---[FILE: find.ts]---
Location: payload-main/packages/sdk/src/collections/find.ts

```typescript
import type { PaginatedDocs, SelectType, Sort, Where } from 'payload'

import type { PayloadSDK } from '../index.js'
import type {
  CollectionSlug,
  JoinQuery,
  PayloadGeneratedTypes,
  PopulateType,
  TransformCollectionWithSelect,
  TypedLocale,
} from '../types.js'

export type FindOptions<
  T extends PayloadGeneratedTypes,
  TSlug extends CollectionSlug<T>,
  TSelect extends SelectType,
> = {
  /**
   * the Collection slug to operate against.
   */
  collection: TSlug
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
  fallbackLocale?: false | TypedLocale<T>
  /**
   * The [Join Field Query](https://payloadcms.com/docs/fields/join#query-options).
   * Pass `false` to disable all join fields from the result.
   */
  joins?: JoinQuery<T, TSlug>
  /**
   * The maximum related documents to be returned.
   * Defaults unless `defaultLimit` is specified for the collection config
   * @default 10
   */
  limit?: number
  /**
   * Specify [locale](https://payloadcms.com/docs/configuration/localization) for any returned documents.
   */
  locale?: 'all' | TypedLocale<T>
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
  populate?: PopulateType<T>
  /**
   * Specify [select](https://payloadcms.com/docs/queries/select) to control which fields to include to the result.
   */
  select?: TSelect
  /**
   * Sort the documents, can be a string or an array of strings
   * @example '-createdAt' // Sort DESC by createdAt
   * @example ['group', '-createdAt'] // sort by 2 fields, ASC group and DESC createdAt
   */
  sort?: Sort
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
   * A filter [query](https://payloadcms.com/docs/queries/overview)
   */
  where?: Where
}

export async function find<
  T extends PayloadGeneratedTypes,
  TSlug extends CollectionSlug<T>,
  TSelect extends SelectType,
>(
  sdk: PayloadSDK<T>,
  options: FindOptions<T, TSlug, TSelect>,
  init?: RequestInit,
): Promise<PaginatedDocs<TransformCollectionWithSelect<T, TSlug, TSelect>>> {
  const response = await sdk.request({
    args: options,
    init,
    method: 'GET',
    path: `/${options.collection}`,
  })

  return response.json()
}
```

--------------------------------------------------------------------------------

---[FILE: findByID.ts]---
Location: payload-main/packages/sdk/src/collections/findByID.ts

```typescript
import type { ApplyDisableErrors, SelectType } from 'payload'

import type { PayloadSDK } from '../index.js'
import type {
  CollectionSlug,
  JoinQuery,
  PayloadGeneratedTypes,
  PopulateType,
  TransformCollectionWithSelect,
  TypedLocale,
} from '../types.js'

export type FindByIDOptions<
  T extends PayloadGeneratedTypes,
  TSlug extends CollectionSlug<T>,
  TDisableErrors extends boolean,
  TSelect extends SelectType,
> = {
  /**
   * the Collection slug to operate against.
   */
  collection: TSlug
  /**
   * [Control auto-population](https://payloadcms.com/docs/queries/depth) of nested relationship and upload fields.
   */
  depth?: number
  /**
   * When set to `true`, errors will not be thrown.
   * `null` will be returned instead, if the document on this ID was not found.
   */
  disableErrors?: TDisableErrors
  /**
   * Whether the document should be queried from the versions table/collection or not. [More](https://payloadcms.com/docs/versions/drafts#draft-api)
   */
  draft?: boolean
  /**
   * Specify a [fallback locale](https://payloadcms.com/docs/configuration/localization) to use for any returned documents.
   */
  fallbackLocale?: false | TypedLocale<T>
  /**
   * The ID of the document to find.
   */
  id: number | string
  /**
   * The [Join Field Query](https://payloadcms.com/docs/fields/join#query-options).
   * Pass `false` to disable all join fields from the result.
   */
  joins?: JoinQuery<T, TSlug>
  /**
   * Specify [locale](https://payloadcms.com/docs/configuration/localization) for any returned documents.
   */
  locale?: 'all' | TypedLocale<T>
  /**
   * Specify [populate](https://payloadcms.com/docs/queries/select#populate) to control which fields to include to the result from populated documents.
   */
  populate?: PopulateType<T>
  /**
   * Specify [select](https://payloadcms.com/docs/queries/select) to control which fields to include to the result.
   */
  select?: TSelect
}

export async function findByID<
  T extends PayloadGeneratedTypes,
  TSlug extends CollectionSlug<T>,
  TDisableErrors extends boolean,
  TSelect extends SelectType,
>(
  sdk: PayloadSDK<T>,
  options: FindByIDOptions<T, TSlug, TDisableErrors, TSelect>,
  init?: RequestInit,
): Promise<ApplyDisableErrors<TransformCollectionWithSelect<T, TSlug, TSelect>, TDisableErrors>> {
  try {
    const response = await sdk.request({
      args: options,
      init,
      method: 'GET',
      path: `/${options.collection}/${options.id}`,
    })

    if (response.ok) {
      return response.json()
    } else {
      throw new Error()
    }
  } catch {
    if (options.disableErrors) {
      // @ts-expect-error generic nullable
      return null
    }

    throw new Error(`Error retrieving the document ${options.collection}/${options.id}`)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: findVersionByID.ts]---
Location: payload-main/packages/sdk/src/collections/findVersionByID.ts

```typescript
import type { ApplyDisableErrors, SelectType, TypeWithVersion } from 'payload'

import type { PayloadSDK } from '../index.js'
import type {
  CollectionSlug,
  DataFromCollectionSlug,
  PayloadGeneratedTypes,
  PopulateType,
  TypedLocale,
} from '../types.js'

export type FindVersionByIDOptions<
  T extends PayloadGeneratedTypes,
  TSlug extends CollectionSlug<T>,
  TDisableErrors extends boolean,
> = {
  /**
   * the Collection slug to operate against.
   */
  collection: TSlug
  /**
   * [Control auto-population](https://payloadcms.com/docs/queries/depth) of nested relationship and upload fields.
   */
  depth?: number
  /**
   * When set to `true`, errors will not be thrown.
   * `null` will be returned instead, if the document on this ID was not found.
   */
  disableErrors?: TDisableErrors
  /**
   * Whether the document should be queried from the versions table/collection or not. [More](https://payloadcms.com/docs/versions/drafts#draft-api)
   */
  draft?: boolean
  /**
   * Specify a [fallback locale](https://payloadcms.com/docs/configuration/localization) to use for any returned documents.
   */
  fallbackLocale?: false | TypedLocale<T>
  /**
   * The ID of the version to find.
   */
  id: number | string
  /**
   * Specify [locale](https://payloadcms.com/docs/configuration/localization) for any returned documents.
   */
  locale?: 'all' | TypedLocale<T>
  /**
   * Specify [populate](https://payloadcms.com/docs/queries/select#populate) to control which fields to include to the result from populated documents.
   */
  populate?: PopulateType<T>
  /**
   * Specify [select](https://payloadcms.com/docs/queries/select) to control which fields to include to the result.
   */
  select?: SelectType
  /**
   * When set to `true`, the operation will return a document by ID, even if it is trashed (soft-deleted).
   * By default (`false`), the operation will exclude trashed documents.
   * To fetch a trashed document, set `trash: true`.
   *
   * This argument has no effect unless `trash` is enabled on the collection.
   * @default false
   */
  trash?: boolean
}

export async function findVersionByID<
  T extends PayloadGeneratedTypes,
  TSlug extends CollectionSlug<T>,
  TDisableErrors extends boolean,
>(
  sdk: PayloadSDK<T>,
  options: FindVersionByIDOptions<T, TSlug, TDisableErrors>,
  init?: RequestInit,
): Promise<ApplyDisableErrors<TypeWithVersion<DataFromCollectionSlug<T, TSlug>>, TDisableErrors>> {
  try {
    const response = await sdk.request({
      args: options,
      init,
      method: 'GET',
      path: `/${options.collection}/versions/${options.id}`,
    })

    if (response.ok) {
      return response.json()
    } else {
      throw new Error()
    }
  } catch {
    if (options.disableErrors) {
      // @ts-expect-error generic nullable
      return null
    }

    throw new Error(`Error retrieving the version document ${options.collection}/${options.id}`)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: findVersions.ts]---
Location: payload-main/packages/sdk/src/collections/findVersions.ts

```typescript
import type { PaginatedDocs, SelectType, Sort, TypeWithVersion, Where } from 'payload'

import type { PayloadSDK } from '../index.js'
import type {
  CollectionSlug,
  DataFromCollectionSlug,
  PayloadGeneratedTypes,
  PopulateType,
  TypedLocale,
} from '../types.js'

export type FindVersionsOptions<
  T extends PayloadGeneratedTypes,
  TSlug extends CollectionSlug<T>,
> = {
  /**
   * the Collection slug to operate against.
   */
  collection: TSlug
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
  fallbackLocale?: false | TypedLocale<T>
  /**
   * The maximum related documents to be returned.
   * Defaults unless `defaultLimit` is specified for the collection config
   * @default 10
   */
  limit?: number
  /**
   * Specify [locale](https://payloadcms.com/docs/configuration/localization) for any returned documents.
   */
  locale?: 'all' | TypedLocale<T>
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
  populate?: PopulateType<T>
  /**
   * Specify [select](https://payloadcms.com/docs/queries/select) to control which fields to include to the result.
   */
  select?: SelectType
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
   * A filter [query](https://payloadcms.com/docs/queries/overview)
   */
  where?: Where
}

export async function findVersions<
  T extends PayloadGeneratedTypes,
  TSlug extends CollectionSlug<T>,
>(
  sdk: PayloadSDK<T>,
  options: FindVersionsOptions<T, TSlug>,
  init?: RequestInit,
): Promise<PaginatedDocs<TypeWithVersion<DataFromCollectionSlug<T, TSlug>>>> {
  const response = await sdk.request({
    args: options,
    init,
    method: 'GET',
    path: `/${options.collection}/versions`,
  })

  return response.json()
}
```

--------------------------------------------------------------------------------

---[FILE: restoreVersion.ts]---
Location: payload-main/packages/sdk/src/collections/restoreVersion.ts

```typescript
import type { PayloadSDK } from '../index.js'
import type {
  CollectionSlug,
  DataFromCollectionSlug,
  PayloadGeneratedTypes,
  PopulateType,
  TypedLocale,
} from '../types.js'

export type RestoreVersionByIDOptions<
  T extends PayloadGeneratedTypes,
  TSlug extends CollectionSlug<T>,
> = {
  /**
   * the Collection slug to operate against.
   */
  collection: TSlug
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
  fallbackLocale?: false | TypedLocale<T>
  /**
   * The ID of the version to restore.
   */
  id: number | string
  /**
   * Specify [locale](https://payloadcms.com/docs/configuration/localization) for any returned documents.
   */
  locale?: 'all' | TypedLocale<T>
  /**
   * Specify [populate](https://payloadcms.com/docs/queries/select#populate) to control which fields to include to the result from populated documents.
   */
  populate?: PopulateType<T>
}

export async function restoreVersion<
  T extends PayloadGeneratedTypes,
  TSlug extends CollectionSlug<T>,
>(
  sdk: PayloadSDK<T>,
  options: RestoreVersionByIDOptions<T, TSlug>,
  init?: RequestInit,
): Promise<DataFromCollectionSlug<T, TSlug>> {
  const response = await sdk.request({
    args: options,
    init,
    method: 'POST',
    path: `/${options.collection}/versions/${options.id}`,
  })

  return response.json()
}
```

--------------------------------------------------------------------------------

---[FILE: update.ts]---
Location: payload-main/packages/sdk/src/collections/update.ts

```typescript
import type { SelectType, Where } from 'payload'
import type { DeepPartial } from 'ts-essentials'

import type { PayloadSDK } from '../index.js'
import type {
  BulkOperationResult,
  CollectionSlug,
  PayloadGeneratedTypes,
  PopulateType,
  RequiredDataFromCollectionSlug,
  SelectFromCollectionSlug,
  TransformCollectionWithSelect,
  TypedLocale,
  UploadCollectionSlug,
} from '../types.js'

import { resolveFileFromOptions } from '../utilities/resolveFileFromOptions.js'

export type UpdateBaseOptions<
  T extends PayloadGeneratedTypes,
  TSlug extends CollectionSlug<T>,
  TSelect extends SelectType,
> = {
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
   * The document / documents data to update.
   */
  data: DeepPartial<RequiredDataFromCollectionSlug<T, TSlug>>
  /**
   * [Control auto-population](https://payloadcms.com/docs/queries/depth) of nested relationship and upload fields.
   */
  depth?: number
  /**
   * Update documents to a draft.
   */
  draft?: boolean
  /**
   * Specify a [fallback locale](https://payloadcms.com/docs/configuration/localization) to use for any returned documents.
   */
  fallbackLocale?: false | TypedLocale<T>
  /** File Blob object or URL to the file. Only for upload collections */
  file?: TSlug extends UploadCollectionSlug<T> ? Blob | string : never
  /**
   * Specify [locale](https://payloadcms.com/docs/configuration/localization) for any returned documents.
   */
  locale?: TypedLocale<T>
  /**
   * Specify [populate](https://payloadcms.com/docs/queries/select#populate) to control which fields to include to the result from populated documents.
   */
  populate?: PopulateType<T>
  /**
   * Publish the document / documents with a specific locale.
   */
  publishSpecificLocale?: string
  /**
   * Specify [select](https://payloadcms.com/docs/queries/select) to control which fields to include to the result.
   */
  select?: TSelect
}

export type UpdateByIDOptions<
  T extends PayloadGeneratedTypes,
  TSlug extends CollectionSlug<T>,
  TSelect extends SelectFromCollectionSlug<T, TSlug>,
> = {
  id: number | string
  limit?: never
  where?: never
} & UpdateBaseOptions<T, TSlug, TSelect>

export type UpdateManyOptions<
  T extends PayloadGeneratedTypes,
  TSlug extends CollectionSlug<T>,
  TSelect extends SelectFromCollectionSlug<T, TSlug>,
> = {
  id?: never
  limit?: number
  where: Where
} & UpdateBaseOptions<T, TSlug, TSelect>

export type UpdateOptions<
  T extends PayloadGeneratedTypes,
  TSlug extends CollectionSlug<T>,
  TSelect extends SelectFromCollectionSlug<T, TSlug>,
> = UpdateByIDOptions<T, TSlug, TSelect> | UpdateManyOptions<T, TSlug, TSelect>

export async function update<
  T extends PayloadGeneratedTypes,
  TSlug extends CollectionSlug<T>,
  TSelect extends SelectFromCollectionSlug<T, TSlug>,
>(
  sdk: PayloadSDK<T>,
  options: UpdateOptions<T, TSlug, TSelect>,
  init?: RequestInit,
): Promise<
  BulkOperationResult<T, TSlug, TSelect> | TransformCollectionWithSelect<T, TSlug, TSelect>
> {
  let file: Blob | undefined = undefined

  if (options.file) {
    file = await resolveFileFromOptions(options.file)
  }

  const response = await sdk.request({
    args: options,
    file,
    init,
    json: options.data,
    method: 'PATCH',
    path: `/${options.collection}${options.id ? `/${options.id}` : ''}`,
  })

  const json = await response.json()

  if (options.id) {
    return json.doc
  }

  return json
}
```

--------------------------------------------------------------------------------

---[FILE: findOne.ts]---
Location: payload-main/packages/sdk/src/globals/findOne.ts

```typescript
import type { SelectType } from 'payload'

import type { PayloadSDK } from '../index.js'
import type {
  GlobalSlug,
  PayloadGeneratedTypes,
  PopulateType,
  SelectFromGlobalSlug,
  TransformGlobalWithSelect,
  TypedLocale,
} from '../types.js'

export type FindGlobalOptions<
  T extends PayloadGeneratedTypes,
  TSlug extends GlobalSlug<T>,
  TSelect extends SelectType,
> = {
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
  fallbackLocale?: false | TypedLocale<T>
  /**
   * Specify [locale](https://payloadcms.com/docs/configuration/localization) for any returned documents.
   */
  locale?: 'all' | TypedLocale<T>
  /**
   * Specify [populate](https://payloadcms.com/docs/queries/select#populate) to control which fields to include to the result from populated documents.
   */
  populate?: PopulateType<T>
  /**
   * Specify [select](https://payloadcms.com/docs/queries/select) to control which fields to include to the result.
   */
  select?: TSelect
  /**
   * the Global slug to operate against.
   */
  slug: TSlug
}

export async function findGlobal<
  T extends PayloadGeneratedTypes,
  TSlug extends GlobalSlug<T>,
  TSelect extends SelectFromGlobalSlug<T, TSlug>,
>(
  sdk: PayloadSDK<T>,
  options: FindGlobalOptions<T, TSlug, TSelect>,
  init?: RequestInit,
): Promise<TransformGlobalWithSelect<T, TSlug, TSelect>> {
  const response = await sdk.request({
    args: options,
    init,
    method: 'GET',
    path: `/globals/${options.slug}`,
  })

  return response.json()
}
```

--------------------------------------------------------------------------------

---[FILE: findVersionByID.ts]---
Location: payload-main/packages/sdk/src/globals/findVersionByID.ts

```typescript
import type { ApplyDisableErrors, SelectType, TypeWithVersion } from 'payload'

import type { PayloadSDK } from '../index.js'
import type {
  DataFromGlobalSlug,
  GlobalSlug,
  PayloadGeneratedTypes,
  PopulateType,
  TypedLocale,
} from '../types.js'

export type FindGlobalVersionByIDOptions<
  T extends PayloadGeneratedTypes,
  TSlug extends GlobalSlug<T>,
  TDisableErrors extends boolean,
> = {
  /**
   * [Control auto-population](https://payloadcms.com/docs/queries/depth) of nested relationship and upload fields.
   */
  depth?: number
  /**
   * When set to `true`, errors will not be thrown.
   * `null` will be returned instead, if the document on this ID was not found.
   */
  disableErrors?: TDisableErrors
  draft?: boolean
  /**
   * Specify a [fallback locale](https://payloadcms.com/docs/configuration/localization) to use for any returned documents.
   */
  fallbackLocale?: false | TypedLocale<T>
  /**
   * The ID of the version to find.
   */
  id: number | string
  /**
   * Specify [locale](https://payloadcms.com/docs/configuration/localization) for any returned documents.
   */
  locale?: 'all' | TypedLocale<T>
  /**
   * Specify [populate](https://payloadcms.com/docs/queries/select#populate) to control which fields to include to the result from populated documents.
   */
  populate?: PopulateType<T>
  /**
   * Specify [select](https://payloadcms.com/docs/queries/select) to control which fields to include to the result.
   */
  select?: SelectType
  /**
   * the Global slug to operate against.
   */
  slug: TSlug
}

export async function findGlobalVersionByID<
  T extends PayloadGeneratedTypes,
  TSlug extends GlobalSlug<T>,
  TDisableErrors extends boolean,
>(
  sdk: PayloadSDK<T>,
  options: FindGlobalVersionByIDOptions<T, TSlug, TDisableErrors>,
  init?: RequestInit,
): Promise<ApplyDisableErrors<TypeWithVersion<DataFromGlobalSlug<T, TSlug>>, TDisableErrors>> {
  try {
    const response = await sdk.request({
      args: options,
      init,
      method: 'GET',
      path: `/globals/${options.slug}/versions/${options.id}`,
    })

    if (response.ok) {
      return response.json()
    } else {
      throw new Error()
    }
  } catch {
    if (options.disableErrors) {
      // @ts-expect-error generic nullable
      return null
    }

    throw new Error(`Error retrieving the version document ${options.slug}/${options.id}`)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: findVersions.ts]---
Location: payload-main/packages/sdk/src/globals/findVersions.ts

```typescript
import type { PaginatedDocs, SelectType, Sort, TypeWithVersion, Where } from 'payload'

import type { PayloadSDK } from '../index.js'
import type {
  DataFromGlobalSlug,
  GlobalSlug,
  PayloadGeneratedTypes,
  PopulateType,
  TypedLocale,
} from '../types.js'

export type FindGlobalVersionsOptions<
  T extends PayloadGeneratedTypes,
  TSlug extends GlobalSlug<T>,
> = {
  /**
   * [Control auto-population](https://payloadcms.com/docs/queries/depth) of nested relationship and upload fields.
   */
  depth?: number
  draft?: boolean
  /**
   * Specify a [fallback locale](https://payloadcms.com/docs/configuration/localization) to use for any returned documents.
   */
  fallbackLocale?: false | TypedLocale<T>
  /**
   * The maximum related documents to be returned.
   * Defaults unless `defaultLimit` is specified for the collection config
   * @default 10
   */
  limit?: number
  /**
   * Specify [locale](https://payloadcms.com/docs/configuration/localization) for any returned documents.
   */
  locale?: 'all' | TypedLocale<T>
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
  populate?: PopulateType<T>
  /**
   * Specify [select](https://payloadcms.com/docs/queries/select) to control which fields to include to the result.
   */
  select?: SelectType
  /**
   * the Global slug to operate against.
   */
  slug: TSlug
  /**
   * Sort the documents, can be a string or an array of strings
   * @example '-version.createdAt' // Sort DESC by createdAt
   * @example ['version.group', '-version.createdAt'] // sort by 2 fields, ASC group and DESC createdAt
   */
  sort?: Sort
  /**
   * A filter [query](https://payloadcms.com/docs/queries/overview)
   */
  where?: Where
}

export async function findGlobalVersions<
  T extends PayloadGeneratedTypes,
  TSlug extends GlobalSlug<T>,
>(
  sdk: PayloadSDK<T>,
  options: FindGlobalVersionsOptions<T, TSlug>,
  init?: RequestInit,
): Promise<PaginatedDocs<TypeWithVersion<DataFromGlobalSlug<T, TSlug>>>> {
  const response = await sdk.request({
    args: options,
    init,
    method: 'GET',
    path: `/globals/${options.slug}/versions`,
  })

  return response.json()
}
```

--------------------------------------------------------------------------------

---[FILE: restoreVersion.ts]---
Location: payload-main/packages/sdk/src/globals/restoreVersion.ts

```typescript
import type { TypeWithVersion } from 'payload'

import type { PayloadSDK } from '../index.js'
import type {
  DataFromGlobalSlug,
  GlobalSlug,
  PayloadGeneratedTypes,
  PopulateType,
  TypedLocale,
} from '../types.js'

export type RestoreGlobalVersionByIDOptions<
  T extends PayloadGeneratedTypes,
  TSlug extends GlobalSlug<T>,
> = {
  /**
   * [Control auto-population](https://payloadcms.com/docs/queries/depth) of nested relationship and upload fields.
   */
  depth?: number
  draft?: boolean
  /**
   * Specify a [fallback locale](https://payloadcms.com/docs/configuration/localization) to use for any returned documents.
   */
  fallbackLocale?: false | TypedLocale<T>
  /**
   * The ID of the version to restore.
   */
  id: number | string
  /**
   * Specify [locale](https://payloadcms.com/docs/configuration/localization) for any returned documents.
   */
  locale?: 'all' | TypedLocale<T>
  /**
   * Specify [populate](https://payloadcms.com/docs/queries/select#populate) to control which fields to include to the result from populated documents.
   */
  populate?: PopulateType<T>
  /**
   * the Global slug to operate against.
   */
  slug: TSlug
}

export async function restoreGlobalVersion<
  T extends PayloadGeneratedTypes,
  TSlug extends GlobalSlug<T>,
>(
  sdk: PayloadSDK<T>,
  options: RestoreGlobalVersionByIDOptions<T, TSlug>,
  init?: RequestInit,
): Promise<TypeWithVersion<DataFromGlobalSlug<T, TSlug>>> {
  const response = await sdk.request({
    args: options,
    init,
    method: 'POST',
    path: `/globals/${options.slug}/versions/${options.id}`,
  })

  const { doc } = await response.json()

  return doc
}
```

--------------------------------------------------------------------------------

---[FILE: update.ts]---
Location: payload-main/packages/sdk/src/globals/update.ts

```typescript
import type { SelectType } from 'payload'
import type { DeepPartial } from 'ts-essentials'

import type { PayloadSDK } from '../index.js'
import type {
  DataFromGlobalSlug,
  GlobalSlug,
  PayloadGeneratedTypes,
  PopulateType,
  SelectFromGlobalSlug,
  TransformGlobalWithSelect,
  TypedLocale,
} from '../types.js'

export type UpdateGlobalOptions<
  T extends PayloadGeneratedTypes,
  TSlug extends GlobalSlug<T>,
  TSelect extends SelectType,
> = {
  /**
   * The global data to update.
   */
  data: DeepPartial<Omit<DataFromGlobalSlug<T, TSlug>, 'id'>>
  /**
   * [Control auto-population](https://payloadcms.com/docs/queries/depth) of nested relationship and upload fields.
   */
  depth?: number
  /**
   * Update documents to a draft.
   */
  draft?: boolean
  /**
   * Specify a [fallback locale](https://payloadcms.com/docs/configuration/localization) to use for any returned documents.
   */
  fallbackLocale?: false | TypedLocale<T>
  /**
   * Specify [locale](https://payloadcms.com/docs/configuration/localization) for any returned documents.
   */
  locale?: 'all' | TypedLocale<T>
  /**
   * Specify [populate](https://payloadcms.com/docs/queries/select#populate) to control which fields to include to the result from populated documents.
   */
  populate?: PopulateType<T>
  /**
   * Publish the document / documents with a specific locale.
   */
  publishSpecificLocale?: TypedLocale<T>
  /**
   * Specify [select](https://payloadcms.com/docs/queries/select) to control which fields to include to the result.
   */
  select?: TSelect
  /**
   * the Global slug to operate against.
   */
  slug: TSlug
}

export async function updateGlobal<
  T extends PayloadGeneratedTypes,
  TSlug extends GlobalSlug<T>,
  TSelect extends SelectFromGlobalSlug<T, TSlug>,
>(
  sdk: PayloadSDK<T>,
  options: UpdateGlobalOptions<T, TSlug, TSelect>,
  init?: RequestInit,
): Promise<TransformGlobalWithSelect<T, TSlug, TSelect>> {
  const response = await sdk.request({
    args: options,
    init,
    json: options.data,
    method: 'POST',
    path: `/globals/${options.slug}`,
  })

  const { result } = await response.json()

  return result
}
```

--------------------------------------------------------------------------------

````
