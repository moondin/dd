---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 209
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 209 of 695)

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
Location: payload-main/packages/payload/src/globals/operations/local/restoreVersion.ts

```typescript
import type { GlobalSlug, Payload, RequestContext, TypedLocale } from '../../../index.js'
import type { Document, PayloadRequest, PopulateType } from '../../../types/index.js'
import type { CreateLocalReqOptions } from '../../../utilities/createLocalReq.js'
import type { DataFromGlobalSlug } from '../../config/types.js'

import { APIError } from '../../../errors/index.js'
import { createLocalReq } from '../../../utilities/createLocalReq.js'
import { restoreVersionOperation } from '../restoreVersion.js'

export type Options<TSlug extends GlobalSlug> = {
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
   * Opt-in to receiving hidden fields. By default, they are hidden from returned documents in accordance to your config.
   * @default false
   */
  showHiddenFields?: boolean
  /**
   * the Global slug to operate against.
   */
  slug: TSlug
  /**
   * If you set `overrideAccess` to `false`, you can pass a user to use against the access control checks.
   */
  user?: Document
}

export async function restoreGlobalVersionLocal<TSlug extends GlobalSlug>(
  payload: Payload,
  options: Options<TSlug>,
): Promise<DataFromGlobalSlug<TSlug>> {
  const { id, slug: globalSlug, depth, overrideAccess = true, populate, showHiddenFields } = options

  const globalConfig = payload.globals.config.find((config) => config.slug === globalSlug)

  if (!globalConfig) {
    throw new APIError(`The global with slug ${String(globalSlug)} can't be found.`)
  }

  return restoreVersionOperation({
    id,
    depth,
    globalConfig,
    overrideAccess,
    populate,
    req: await createLocalReq(options as CreateLocalReqOptions, payload),
    showHiddenFields,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: update.ts]---
Location: payload-main/packages/payload/src/globals/operations/local/update.ts

```typescript
import type { DeepPartial } from 'ts-essentials'

import type {
  Document,
  PayloadRequest,
  PopulateType,
  SelectType,
  TransformGlobalWithSelect,
} from '../../../types/index.js'
import type { CreateLocalReqOptions } from '../../../utilities/createLocalReq.js'
import type { DataFromGlobalSlug, SelectFromGlobalSlug } from '../../config/types.js'

import { APIError } from '../../../errors/index.js'
import {
  deepCopyObjectSimple,
  type GlobalSlug,
  type Payload,
  type RequestContext,
  type TypedLocale,
} from '../../../index.js'
import { createLocalReq } from '../../../utilities/createLocalReq.js'
import { updateOperation } from '../update.js'

export type Options<TSlug extends GlobalSlug, TSelect extends SelectType> = {
  /**
   * [Context](https://payloadcms.com/docs/hooks/context), which will then be passed to `context` and `req.context`,
   * which can be read by hooks. Useful if you want to pass additional information to the hooks which
   * shouldn't be necessarily part of the document, for example a `triggerBeforeChange` option which can be read by the BeforeChange hook
   * to determine if it should run or not.
   */
  context?: RequestContext
  /**
   * The global data to update.
   */
  data: DeepPartial<Omit<DataFromGlobalSlug<TSlug>, 'id'>>
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
  fallbackLocale?: false | TypedLocale
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
   * If you are uploading a file and would like to replace
   * the existing file instead of generating a new filename,
   * you can set the following property to `true`
   */
  overrideLock?: boolean
  /**
   * Specify [populate](https://payloadcms.com/docs/queries/select#populate) to control which fields to include to the result from populated documents.
   */
  populate?: PopulateType
  /**
   * Publish the document / documents with a specific locale.
   */
  publishSpecificLocale?: TypedLocale
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
   * the Global slug to operate against.
   */
  slug: TSlug
  /**
   * If you set `overrideAccess` to `false`, you can pass a user to use against the access control checks.
   */
  user?: Document
}

export async function updateGlobalLocal<
  TSlug extends GlobalSlug,
  TSelect extends SelectFromGlobalSlug<TSlug>,
>(
  payload: Payload,
  options: Options<TSlug, TSelect>,
): Promise<TransformGlobalWithSelect<TSlug, TSelect>> {
  const {
    slug: globalSlug,
    data,
    depth,
    draft,
    overrideAccess = true,
    overrideLock,
    populate,
    publishSpecificLocale,
    select,
    showHiddenFields,
  } = options

  const globalConfig = payload.globals.config.find((config) => config.slug === globalSlug)

  if (!globalConfig) {
    throw new APIError(`The global with slug ${String(globalSlug)} can't be found.`)
  }

  return updateOperation<TSlug, TSelect>({
    slug: globalSlug as string,
    data: deepCopyObjectSimple(data), // Ensure mutation of data in create operation hooks doesn't affect the original data
    depth,
    draft,
    globalConfig,
    overrideAccess,
    overrideLock,
    populate,
    publishSpecificLocale: publishSpecificLocale!,
    req: await createLocalReq(options as CreateLocalReqOptions, payload),
    select,
    showHiddenFields,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/payload/src/kv/index.ts

```typescript
import type { CollectionConfig } from '../collections/config/types.js'
import type { Payload } from '../types/index.js'

export type KVStoreValue = NonNullable<unknown>

export interface KVAdapter {
  /**
   * Clears all entries in the store.
   * @returns A promise that resolves once the store is cleared.
   */
  clear(): Promise<void>

  /**
   * Deletes a value from the store by its key.
   * @param key - The key to delete.
   * @returns A promise that resolves once the key is deleted.
   */
  delete(key: string): Promise<void>

  /**
   * Retrieves a value from the store by its key.
   * @param key - The key to look up.
   * @returns A promise that resolves to the value, or `null` if not found.
   */
  get<T extends KVStoreValue>(key: string): Promise<null | T>

  /**
   * Checks if a key exists in the store.
   * @param key - The key to check.
   * @returns A promise that resolves to `true` if the key exists, otherwise `false`.
   */
  has(key: string): Promise<boolean>

  /**
   * Retrieves all the keys in the store.
   * @returns A promise that resolves to an array of keys.
   */
  keys(): Promise<string[]>

  /**
   * Sets a value in the store with the given key.
   * @param key - The key to associate with the value.
   * @param value - The value to store.
   * @returns A promise that resolves once the value is stored.
   */
  set(key: string, value: KVStoreValue): Promise<void>
}

export interface KVAdapterResult {
  init(args: { payload: Payload }): KVAdapter

  /** Adapter can create additional collection if needed */
  kvCollection?: CollectionConfig
}
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/packages/payload/src/kv/tsconfig.json

```json
// Use strict: true for new features. This overrides options only for this directory.
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "strict": true
  }
}
```

--------------------------------------------------------------------------------

---[FILE: DatabaseKVAdapter.ts]---
Location: payload-main/packages/payload/src/kv/adapters/DatabaseKVAdapter.ts

```typescript
import type { CollectionConfig } from '../../index.js'
import type { Payload, PayloadRequest } from '../../types/index.js'
import type { KVAdapter, KVAdapterResult, KVStoreValue } from '../index.js'

/** Mocked `req`, we don't need to use transactions, neither we want `createLocalReq` overhead. */
const req = {} as PayloadRequest

export class DatabaseKVAdapter implements KVAdapter {
  constructor(
    readonly payload: Payload,
    readonly collectionSlug: string,
  ) {}

  async clear(): Promise<void> {
    await this.payload.db.deleteMany({
      collection: this.collectionSlug,
      req,
      where: {},
    })
  }

  async delete(key: string): Promise<void> {
    await this.payload.db.deleteOne({
      collection: this.collectionSlug,
      req,
      where: { key: { equals: key } },
    })
  }

  async get<T extends KVStoreValue>(key: string): Promise<null | T> {
    const doc = await this.payload.db.findOne<{
      data: T
      id: number | string
    }>({
      collection: this.collectionSlug,
      joins: false,
      req,
      select: {
        data: true,
        key: true,
      },
      where: { key: { equals: key } },
    })

    if (doc === null) {
      return null
    }

    return doc.data
  }

  async has(key: string): Promise<boolean> {
    const { totalDocs } = await this.payload.db.count({
      collection: this.collectionSlug,
      req,
      where: { key: { equals: key } },
    })

    return totalDocs > 0
  }

  async keys(): Promise<string[]> {
    const result = await this.payload.db.find<{ key: string }>({
      collection: this.collectionSlug,
      limit: 0,
      pagination: false,
      req,
      select: {
        key: true,
      },
    })

    return result.docs.map((each) => each.key)
  }

  async set(key: string, data: KVStoreValue): Promise<void> {
    await this.payload.db.upsert({
      collection: this.collectionSlug,
      data: {
        data,
        key,
      },
      joins: false,
      req,
      select: {},
      where: { key: { equals: key } },
    })
  }
}

export type DatabaseKVAdapterOptions = {
  /** Override options for the generated collection */
  kvCollectionOverrides?: Partial<CollectionConfig>
}

export const databaseKVAdapter = (options: DatabaseKVAdapterOptions = {}): KVAdapterResult => {
  const collectionSlug = options.kvCollectionOverrides?.slug ?? 'payload-kv'
  return {
    init: ({ payload }) => new DatabaseKVAdapter(payload, collectionSlug),
    kvCollection: {
      slug: collectionSlug,
      access: {
        create: () => false,
        delete: () => false,
        read: () => false,
        update: () => false,
      },
      admin: {
        hidden: true,
      },
      fields: [
        {
          name: 'key',
          type: 'text',
          index: true,
          required: true,
          unique: true,
        },
        {
          name: 'data',
          type: 'json',
          required: true,
        },
      ],
      lockDocuments: false,
      timestamps: false,
      ...options.kvCollectionOverrides,
    },
  }
}
```

--------------------------------------------------------------------------------

---[FILE: InMemoryKVAdapter.ts]---
Location: payload-main/packages/payload/src/kv/adapters/InMemoryKVAdapter.ts

```typescript
/* eslint-disable @typescript-eslint/require-await */
import type { KVAdapter, KVAdapterResult, KVStoreValue } from '../index.js'

export class InMemoryKVAdapter implements KVAdapter {
  store = new Map<string, KVStoreValue>()

  async clear(): Promise<void> {
    this.store.clear()
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key)
  }

  async get<T extends KVStoreValue>(key: string): Promise<null | T> {
    const value = this.store.get(key) as T | undefined

    if (typeof value === 'undefined') {
      return null
    }

    return value
  }

  async has(key: string): Promise<boolean> {
    return this.store.has(key)
  }

  async keys(): Promise<string[]> {
    return Array.from(this.store.keys())
  }

  async set(key: string, value: KVStoreValue): Promise<void> {
    this.store.set(key, value)
  }
}

export const inMemoryKVAdapter = (): KVAdapterResult => {
  return {
    init: () => new InMemoryKVAdapter(),
  }
}
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: payload-main/packages/payload/src/locked-documents/config.ts

```typescript
import type { CollectionConfig } from '../collections/config/types.js'
import type { Config } from '../config/types.js'

import { defaultAccess } from '../auth/defaultAccess.js'

export const lockedDocumentsCollectionSlug = 'payload-locked-documents'

export const getLockedDocumentsCollection = (config: Config): CollectionConfig => ({
  slug: lockedDocumentsCollectionSlug,
  access: {
    create: defaultAccess,
    delete: defaultAccess,
    read: defaultAccess,
    update: defaultAccess,
  },
  admin: {
    hidden: true,
  },
  fields: [
    {
      name: 'document',
      type: 'relationship',
      index: true,
      maxDepth: 0,
      relationTo: [
        ...config
          .collections!.filter((collectionConfig) => collectionConfig.lockDocuments !== false)
          .map((collectionConfig) => collectionConfig.slug),
      ],
    },
    {
      name: 'globalSlug',
      type: 'text',
      index: true,
    },
    {
      name: 'user',
      type: 'relationship',
      maxDepth: 1,
      relationTo: config
        .collections!.filter((collectionConfig) => collectionConfig.auth)
        .map((collectionConfig) => collectionConfig.slug),
      required: true,
    },
  ],
  lockDocuments: false,
})
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: payload-main/packages/payload/src/preferences/config.ts

```typescript
import type { CollectionConfig } from '../collections/config/types.js'
import type { Access, Config } from '../config/types.js'

import { deleteHandler } from './requestHandlers/delete.js'
import { findByIDHandler } from './requestHandlers/findOne.js'
import { updateHandler } from './requestHandlers/update.js'

const preferenceAccess: Access = ({ req }) => {
  if (!req.user) {
    return false
  }

  return {
    'user.value': {
      equals: req?.user?.id,
    },
  }
}

export const preferencesCollectionSlug = 'payload-preferences'

export const getPreferencesCollection = (config: Config): CollectionConfig => ({
  slug: preferencesCollectionSlug,
  access: {
    delete: preferenceAccess,
    read: preferenceAccess,
  },
  admin: {
    hidden: true,
  },
  endpoints: [
    {
      handler: findByIDHandler,
      method: 'get',
      path: '/:key',
    },
    {
      handler: deleteHandler,
      method: 'delete',
      path: '/:key',
    },
    {
      handler: updateHandler,
      method: 'post',
      path: '/:key',
    },
  ],
  fields: [
    {
      name: 'user',
      type: 'relationship',
      hooks: {
        beforeValidate: [
          ({ req }) => {
            if (!req?.user) {
              return null
            }

            return {
              relationTo: req?.user.collection,
              value: req?.user.id,
            }
          },
        ],
      },
      index: true,
      relationTo: config
        .collections!.filter((collectionConfig) => collectionConfig.auth)
        .map((collectionConfig) => collectionConfig.slug),
      required: true,
    },
    {
      name: 'key',
      type: 'text',
      index: true,
    },
    {
      name: 'value',
      type: 'json',
      validate: (value) => {
        if (value) {
          try {
            JSON.parse(JSON.stringify(value))
          } catch {
            return 'Invalid JSON'
          }
        }

        return true
      },
    },
  ],
  lockDocuments: false,
})
```

--------------------------------------------------------------------------------

---[FILE: deleteUserPreferences.ts]---
Location: payload-main/packages/payload/src/preferences/deleteUserPreferences.ts

```typescript
import type { SanitizedCollectionConfig } from '../collections/config/types.js'
import type { Payload } from '../index.js'
import type { PayloadRequest } from '../types/index.js'

import { preferencesCollectionSlug } from './config.js'

type Args = {
  collectionConfig: SanitizedCollectionConfig
  /**
   * User IDs to delete
   */
  ids: (number | string)[]
  payload: Payload
  req: PayloadRequest
}
export const deleteUserPreferences = async ({ collectionConfig, ids, payload, req }: Args) => {
  if (collectionConfig.auth) {
    await payload.db.deleteMany({
      collection: preferencesCollectionSlug,
      req,
      where: {
        or: [
          {
            and: [
              {
                'user.value': { in: ids },
              },
              {
                'user.relationTo': { equals: collectionConfig.slug },
              },
            ],
          },
          {
            key: { in: ids.map((id) => `collection-${collectionConfig.slug}-${id}`) },
          },
        ],
      },
    })
  } else {
    await payload.db.deleteMany({
      collection: preferencesCollectionSlug,
      req,
      where: {
        key: { in: ids.map((id) => `collection-${collectionConfig.slug}-${id}`) },
      },
    })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/payload/src/preferences/types.ts

```typescript
import type { DefaultDocumentIDType } from '../index.js'
import type { PayloadRequest } from '../types/index.js'

export type PreferenceRequest = {
  key: string
  overrideAccess?: boolean
  req: PayloadRequest
  user: PayloadRequest['user']
}

export type PreferenceUpdateRequest = { value: unknown } & PreferenceRequest

export type CollapsedPreferences = string[]

export type TabsPreferences = Array<{
  [path: string]: number
}>

export type InsideFieldsPreferences = {
  collapsed: CollapsedPreferences
  tabIndex: number
}

export type FieldsPreferences = {
  [key: string]: InsideFieldsPreferences
}

export type DocumentPreferences = {
  fields: FieldsPreferences
}

export type ColumnPreference = {
  accessor: string
  active: boolean
}

export type CollectionPreferences = {
  columns?: ColumnPreference[]
  editViewType?: 'default' | 'live-preview'
  groupBy?: string
  limit?: number
  listViewType?: 'folders' | 'list'
  preset?: DefaultDocumentIDType
  sort?: string
}
```

--------------------------------------------------------------------------------

---[FILE: delete.ts]---
Location: payload-main/packages/payload/src/preferences/operations/delete.ts

```typescript
import type { Document, Where } from '../../types/index.js'
import type { PreferenceRequest } from '../types.js'

import { NotFound } from '../../errors/NotFound.js'
import { UnauthorizedError } from '../../errors/UnauthorizedError.js'
import { preferencesCollectionSlug } from '../config.js'

export async function deleteOperation(args: PreferenceRequest): Promise<Document> {
  const {
    key,
    req: { payload },
    req,
    user,
  } = args

  if (!user) {
    throw new UnauthorizedError(req.t)
  }

  const where: Where = {
    and: [
      { key: { equals: key } },
      { 'user.value': { equals: user.id } },
      { 'user.relationTo': { equals: user.collection } },
    ],
  }

  const result = await payload.db.deleteOne({
    collection: preferencesCollectionSlug,
    req,
    where,
  })

  if (result) {
    return result
  }
  throw new NotFound(req.t)
}
```

--------------------------------------------------------------------------------

---[FILE: findOne.ts]---
Location: payload-main/packages/payload/src/preferences/operations/findOne.ts

```typescript
import type { TypedCollection } from '../../index.js'
import type { Where } from '../../types/index.js'
import type { PreferenceRequest } from '../types.js'

import { preferencesCollectionSlug } from '../config.js'

export async function findOne(args: PreferenceRequest): Promise<TypedCollection['_preference']> {
  const {
    key,
    req: { payload },
    req,
    user,
  } = args

  if (!user) {
    return null!
  }

  const where: Where = {
    and: [
      { key: { equals: key } },
      { 'user.value': { equals: user.id } },
      { 'user.relationTo': { equals: user.collection } },
    ],
  }

  const { docs } = await payload.db.find({
    collection: preferencesCollectionSlug,
    limit: 1,
    pagination: false,
    req,
    sort: '-updatedAt',
    where,
  })

  return docs?.[0] || null!
}
```

--------------------------------------------------------------------------------

---[FILE: update.ts]---
Location: payload-main/packages/payload/src/preferences/operations/update.ts

```typescript
import type { Where } from '../../types/index.js'
import type { PreferenceUpdateRequest } from '../types.js'

import { UnauthorizedError } from '../../errors/UnauthorizedError.js'
import { preferencesCollectionSlug } from '../config.js'

export async function update(args: PreferenceUpdateRequest) {
  const {
    key,
    req: { payload },
    req,
    user,
    value,
  } = args

  if (!user) {
    throw new UnauthorizedError(req.t)
  }

  const where: Where = {
    and: [
      { key: { equals: key } },
      { 'user.value': { equals: user.id } },
      { 'user.relationTo': { equals: user.collection } },
    ],
  }

  const preference = {
    key,
    user: {
      relationTo: user.collection,
      value: user.id,
    },
    value,
  }

  return await payload.db.upsert({
    collection: preferencesCollectionSlug,
    data: preference,
    req,
    where,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: delete.ts]---
Location: payload-main/packages/payload/src/preferences/requestHandlers/delete.ts

```typescript
import { status as httpStatus } from 'http-status'

import type { PayloadHandler } from '../../config/types.js'
import type { PayloadRequest } from '../../types/index.js'

import { deleteOperation } from '../operations/delete.js'

export const deleteHandler: PayloadHandler = async (incomingReq): Promise<Response> => {
  // We cannot import the addDataAndFileToRequest utility here from the 'next' package because of dependency issues
  // However that utility should be used where possible instead of manually appending the data
  let data

  try {
    data = await incomingReq.json?.()
  } catch (ignore) {
    data = {}
  }

  const reqWithData: PayloadRequest = incomingReq

  if (data) {
    reqWithData.data = data
    // @ts-expect-error
    reqWithData.json = () => Promise.resolve(data)
  }

  const result = await deleteOperation({
    key: reqWithData.routeParams?.key as string,
    req: reqWithData,
    user: reqWithData.user,
  })

  return Response.json(
    {
      ...result,
      message: reqWithData.t('general:deletedSuccessfully'),
    },
    {
      status: httpStatus.OK,
    },
  )
}
```

--------------------------------------------------------------------------------

---[FILE: findOne.ts]---
Location: payload-main/packages/payload/src/preferences/requestHandlers/findOne.ts

```typescript
import { status as httpStatus } from 'http-status'

import type { PayloadHandler } from '../../config/types.js'
import type { PayloadRequest } from '../../types/index.js'

import { findOne } from '../operations/findOne.js'

export const findByIDHandler: PayloadHandler = async (incomingReq): Promise<Response> => {
  // We cannot import the addDataAndFileToRequest utility here from the 'next' package because of dependency issues
  // However that utility should be used where possible instead of manually appending the data
  let data

  try {
    data = await incomingReq.json?.()
  } catch (ignore) {
    data = {}
  }

  const reqWithData: PayloadRequest = incomingReq

  if (data) {
    reqWithData.data = data
    // @ts-expect-error
    reqWithData.json = () => Promise.resolve(data)
  }

  const result = await findOne({
    key: reqWithData.routeParams?.key as string,
    req: reqWithData,
    user: reqWithData.user,
  })

  return Response.json(
    {
      ...(result
        ? result
        : {
            message: reqWithData.t('general:notFound'),
            value: null,
          }),
    },
    {
      status: httpStatus.OK,
    },
  )
}
```

--------------------------------------------------------------------------------

---[FILE: update.ts]---
Location: payload-main/packages/payload/src/preferences/requestHandlers/update.ts

```typescript
import { status as httpStatus } from 'http-status'

import type { PayloadHandler } from '../../config/types.js'
import type { PayloadRequest } from '../../types/index.js'

import { update } from '../operations/update.js'

export const updateHandler: PayloadHandler = async (incomingReq) => {
  // We cannot import the addDataAndFileToRequest utility here from the 'next' package because of dependency issues
  // However that utility should be used where possible instead of manually appending the data
  let data

  try {
    data = await incomingReq.json?.()
  } catch (_err) {
    data = {}
  }

  const reqWithData: PayloadRequest = incomingReq

  if (data) {
    reqWithData.data = data
    // @ts-expect-error
    reqWithData.json = () => Promise.resolve(data)
  }

  const doc = await update({
    key: reqWithData.routeParams?.key as string,
    req: reqWithData,
    user: reqWithData?.user,
    value: reqWithData.data?.value || reqWithData.data,
  })

  return Response.json(
    {
      doc,
      message: reqWithData.t('general:updatedSuccessfully'),
    },
    {
      status: httpStatus.OK,
    },
  )
}
```

--------------------------------------------------------------------------------

---[FILE: access.ts]---
Location: payload-main/packages/payload/src/query-presets/access.ts

```typescript
import type { Access, Config } from '../config/types.js'
import type { Operation } from '../types/index.js'

import { defaultAccess } from '../auth/defaultAccess.js'

const operations: Operation[] = ['delete', 'read', 'update', 'create'] as const

const defaultCollectionAccess = {
  create: defaultAccess,
  delete: defaultAccess,
  read: defaultAccess,
  unlock: defaultAccess,
  update: defaultAccess,
}

export const getAccess = (config: Config): Record<Operation, Access> =>
  operations.reduce(
    (acc, operation) => {
      acc[operation] = async (args) => {
        const { req } = args

        const collectionAccess = config?.queryPresets?.access?.[operation]
          ? await config.queryPresets.access[operation](args)
          : defaultCollectionAccess?.[operation]
            ? defaultCollectionAccess[operation](args)
            : true

        // If collection-level access control is `false`, no need to continue to document-level access
        if (collectionAccess === false) {
          return false
        }

        // The `create` operation does not affect the document-level access control
        if (operation === 'create') {
          return collectionAccess
        }

        return {
          and: [
            {
              or: [
                // Default access control ensures a user exists, but custom access control may not
                ...(req?.user
                  ? [
                      {
                        and: [
                          {
                            [`access.${operation}.users`]: {
                              in: [req.user.id],
                            },
                          },
                          {
                            [`access.${operation}.constraint`]: {
                              in: ['onlyMe', 'specificUsers'],
                            },
                          },
                        ],
                      },
                    ]
                  : []),
                {
                  [`access.${operation}.constraint`]: {
                    equals: 'everyone',
                  },
                },
                ...(await Promise.all(
                  (config?.queryPresets?.constraints?.[operation] || []).map(async (constraint) => {
                    const constraintAccess = constraint.access
                      ? await constraint.access(args)
                      : undefined

                    return {
                      and: [
                        ...(typeof constraintAccess === 'object'
                          ? [constraintAccess]
                          : constraintAccess === false
                            ? [
                                {
                                  id: {
                                    equals: null,
                                  },
                                },
                              ]
                            : []),
                        {
                          [`access.${operation}.constraint`]: {
                            equals: constraint.value,
                          },
                        },
                      ],
                    }
                  }),
                )),
              ],
            },
            ...(typeof collectionAccess === 'object' ? [collectionAccess] : []),
          ],
        }
      }

      return acc
    },
    {} as Record<Operation, Access>,
  )
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: payload-main/packages/payload/src/query-presets/config.ts

```typescript
import type { CollectionConfig } from '../collections/config/types.js'
import type { Config } from '../config/types.js'
import type { Option } from '../fields/config/types.js'

import { transformWhereQuery } from '../utilities/transformWhereQuery.js'
import { validateWhereQuery } from '../utilities/validateWhereQuery.js'
import { getAccess } from './access.js'
import { getConstraints } from './constraints.js'
import { operations, type QueryPreset } from './types.js'

export const queryPresetsCollectionSlug = 'payload-query-presets'

export const getQueryPresetsConfig = (config: Config): CollectionConfig => ({
  slug: queryPresetsCollectionSlug,
  access: getAccess(config),
  admin: {
    defaultColumns: ['title', 'isShared', 'access', 'where', 'columns', 'groupBy'],
    hidden: true,
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'isShared',
      type: 'checkbox',
      defaultValue: false,
      validate: (isShared, { data }) => {
        const typedData = data as QueryPreset

        // ensure the `isShared` is only true if all constraints are 'onlyMe'
        if (typedData?.access) {
          const someOperationsAreShared = Object.values(typedData.access).some(
            (operation) => operation.constraint !== 'onlyMe',
          )

          if (!isShared && someOperationsAreShared) {
            return 'If any constraint is not "onlyMe", the preset must be shared'
          }
        }

        return true
      },
    },
    getConstraints(config),
    {
      name: 'where',
      type: 'json',
      admin: {
        components: {
          Cell: '@payloadcms/ui#QueryPresetsWhereCell',
          Field: '@payloadcms/ui#QueryPresetsWhereField',
        },
      },
      hooks: {
        beforeValidate: [
          ({ data }) => {
            // transform the "where" query here so that the client-side doesn't have to
            if (data?.where) {
              if (validateWhereQuery(data.where)) {
                return data.where
              } else {
                return transformWhereQuery(data.where)
              }
            }

            return data?.where
          },
        ],
      },
      label: 'Filters',
    },
    {
      name: 'columns',
      type: 'json',
      admin: {
        components: {
          Cell: '@payloadcms/ui#QueryPresetsColumnsCell',
          Field: '@payloadcms/ui#QueryPresetsColumnField',
        },
      },
      validate: (value) => {
        if (value) {
          try {
            JSON.parse(JSON.stringify(value))
          } catch {
            return 'Invalid JSON'
          }
        }

        return true
      },
    },
    {
      name: 'groupBy',
      type: 'text',
      admin: {
        components: {
          Cell: '@payloadcms/ui#QueryPresetsGroupByCell',
          Field: '@payloadcms/ui#QueryPresetsGroupByField',
        },
      },
      label: 'Group By',
    },
    {
      name: 'relatedCollection',
      type: 'select',
      admin: {
        hidden: true,
      },
      options: config.collections
        ? config.collections.reduce((acc, collection) => {
            if (collection.enableQueryPresets) {
              acc.push({
                label: collection.labels?.plural || collection.slug,
                value: collection.slug,
              })
            }
            return acc
          }, [] as Option[])
        : [],
      required: true,
    },
    {
      name: 'isTemp',
      type: 'checkbox',
      admin: {
        description:
          "This is a temporary field used to determine if updating the preset would remove the user's access to it. When `true`, this record will be deleted after running the preset's `validate` function.",
        disabled: true,
        hidden: true,
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        // TODO: type this
        const typedData = data as any

        if (operation === 'create' || operation === 'update') {
          // Ensure all operations have a constraint
          operations.forEach((operation) => {
            if (!typedData.access) {
              typedData.access = {}
            }

            if (!typedData.access?.[operation]) {
              typedData[operation] = {}
            }

            // Ensure all operations have a constraint
            if (!typedData.access[operation]?.constraint) {
              typedData.access[operation] = {
                ...typedData.access[operation],
                constraint: 'onlyMe',
              }
            }
          })

          // If at least one constraint is not `onlyMe` then `isShared` must be true
          if (typedData?.access) {
            const someOperationsAreShared = Object.values(typedData.access).some(
              // TODO: remove the `any` here
              (operation: any) => operation.constraint !== 'onlyMe',
            )

            typedData.isShared = someOperationsAreShared
          }
        }

        return typedData
      },
    ],
  },
  labels: {
    plural: 'Presets',
    singular: 'Preset',
    ...(config.queryPresets?.labels || {}),
  },
  lockDocuments: false,
})
```

--------------------------------------------------------------------------------

````
