---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 151
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 151 of 695)

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

---[FILE: unlock.ts]---
Location: payload-main/packages/graphql/src/resolvers/auth/unlock.ts

```typescript
import type { Collection } from 'payload'

import { isolateObjectProperty, unlockOperation } from 'payload'

import type { Context } from '../types.js'

export function unlock(collection: Collection) {
  async function resolver(_, args, context: Context) {
    const options = {
      collection,
      data: { email: args.email, username: args.username },
      req: isolateObjectProperty(context.req, 'transactionID'),
    }

    const result = await unlockOperation(options)
    return result
  }

  return resolver
}
```

--------------------------------------------------------------------------------

---[FILE: verifyEmail.ts]---
Location: payload-main/packages/graphql/src/resolvers/auth/verifyEmail.ts

```typescript
import type { Collection } from 'payload'

import { isolateObjectProperty, verifyEmailOperation } from 'payload'

import type { Context } from '../types.js'

export function verifyEmail(collection: Collection) {
  async function resolver(_, args, context: Context) {
    if (args.locale) {
      context.req.locale = args.locale
    }
    if (args.fallbackLocale) {
      context.req.fallbackLocale = args.fallbackLocale
    }

    const options = {
      api: 'GraphQL',
      collection,
      req: isolateObjectProperty(context.req, 'transactionID'),
      token: args.token,
    }

    const success = await verifyEmailOperation(options)
    return success
  }

  return resolver
}
```

--------------------------------------------------------------------------------

---[FILE: count.ts]---
Location: payload-main/packages/graphql/src/resolvers/collections/count.ts

```typescript
import type { Collection, PayloadRequest, Where } from 'payload'

import { countOperation, isolateObjectProperty } from 'payload'

import type { Context } from '../types.js'

export type Resolver = (
  _: unknown,
  args: {
    data: Record<string, unknown>
    locale?: string
    trash?: boolean
    where?: Where
  },
  context: {
    req: PayloadRequest
  },
) => Promise<{ totalDocs: number }>

export function countResolver(collection: Collection): Resolver {
  return async function resolver(_, args, context: Context) {
    let { req } = context
    const locale = req.locale
    const fallbackLocale = req.fallbackLocale
    req = isolateObjectProperty(req, 'locale')
    req = isolateObjectProperty(req, 'fallbackLocale')
    req.locale = args.locale || locale
    req.fallbackLocale = fallbackLocale
    context.req = req

    const options = {
      collection,
      req: isolateObjectProperty(req, 'transactionID'),
      trash: args.trash,
      where: args.where,
    }

    const results = await countOperation(options)
    return results
  }
}
```

--------------------------------------------------------------------------------

---[FILE: create.ts]---
Location: payload-main/packages/graphql/src/resolvers/collections/create.ts

```typescript
import type {
  Collection,
  CollectionSlug,
  DataFromCollectionSlug,
  PayloadRequest,
  RequiredDataFromCollectionSlug,
} from 'payload'

import { createOperation, isolateObjectProperty } from 'payload'

import type { Context } from '../types.js'

export type Resolver<TSlug extends CollectionSlug> = (
  _: unknown,
  args: {
    data: RequiredDataFromCollectionSlug<TSlug>
    draft: boolean
    locale?: string
  },
  context: {
    req: PayloadRequest
  },
) => Promise<DataFromCollectionSlug<TSlug>>

export function createResolver<TSlug extends CollectionSlug>(
  collection: Collection,
): Resolver<TSlug> {
  return async function resolver(_, args, context: Context) {
    if (args.locale) {
      context.req.locale = args.locale
    }

    const result = await createOperation({
      collection,
      data: args.data,
      depth: 0,
      draft: args.draft,
      req: isolateObjectProperty(context.req, 'transactionID'),
    })

    return result
  }
}
```

--------------------------------------------------------------------------------

---[FILE: delete.ts]---
Location: payload-main/packages/graphql/src/resolvers/collections/delete.ts

```typescript
import type { Collection, CollectionSlug, DataFromCollectionSlug, PayloadRequest } from 'payload'

import { deleteByIDOperation, isolateObjectProperty } from 'payload'

import type { Context } from '../types.js'

export type Resolver<TSlug extends CollectionSlug> = (
  _: unknown,
  args: {
    draft: boolean
    fallbackLocale?: string
    id: number | string
    locale?: string
    trash?: boolean
  },
  context: {
    req: PayloadRequest
  },
) => Promise<DataFromCollectionSlug<TSlug>>

export function getDeleteResolver<TSlug extends CollectionSlug>(
  collection: Collection,
): Resolver<TSlug> {
  return async function resolver(_, args, context: Context) {
    let { req } = context
    const locale = req.locale
    const fallbackLocale = req.fallbackLocale
    req = isolateObjectProperty(req, 'locale')
    req = isolateObjectProperty(req, 'fallbackLocale')
    req.locale = args.locale || locale
    req.fallbackLocale = args.fallbackLocale || fallbackLocale
    if (!req.query) {
      req.query = {}
    }

    const draft: boolean =
      (args.draft ?? req.query?.draft === 'false')
        ? false
        : req.query?.draft === 'true'
          ? true
          : undefined
    if (typeof draft === 'boolean') {
      req.query.draft = String(draft)
    }

    context.req = req

    const options = {
      id: args.id,
      collection,
      depth: 0,
      req: isolateObjectProperty(req, 'transactionID'),
      trash: args.trash,
    }

    const result = await deleteByIDOperation(options)

    return result
  }
}
```

--------------------------------------------------------------------------------

---[FILE: docAccess.ts]---
Location: payload-main/packages/graphql/src/resolvers/collections/docAccess.ts

```typescript
import type {
  Collection,
  PayloadRequest,
  SanitizedCollectionPermission,
  SanitizedGlobalPermission,
} from 'payload'

import { docAccessOperation, isolateObjectProperty } from 'payload'

import type { Context } from '../types.js'

export type Resolver = (
  _: unknown,
  args: {
    id: number | string
  },
  context: {
    req: PayloadRequest
  },
) => Promise<SanitizedCollectionPermission | SanitizedGlobalPermission>

export function docAccessResolver(collection: Collection): Resolver {
  async function resolver(_, args, context: Context) {
    return docAccessOperation({
      id: args.id,
      collection,
      req: isolateObjectProperty(context.req, 'transactionID'),
    })
  }

  return resolver
}
```

--------------------------------------------------------------------------------

---[FILE: duplicate.ts]---
Location: payload-main/packages/graphql/src/resolvers/collections/duplicate.ts

```typescript
import type { Collection, CollectionSlug, DataFromCollectionSlug, PayloadRequest } from 'payload'

import { duplicateOperation, isolateObjectProperty } from 'payload'

import type { Context } from '../types.js'

export type Resolver<TData> = (
  _: unknown,
  args: {
    data: TData
    draft: boolean
    fallbackLocale?: string
    id: string
    locale?: string
  },
  context: {
    req: PayloadRequest
  },
) => Promise<TData>

export function duplicateResolver<TSlug extends CollectionSlug>(
  collection: Collection,
): Resolver<DataFromCollectionSlug<TSlug>> {
  return async function resolver(_, args, context: Context) {
    const { req } = context
    const locale = req.locale
    const fallbackLocale = req.fallbackLocale
    req.locale = args.locale || locale
    req.fallbackLocale = args.fallbackLocale || fallbackLocale
    context.req = req

    const result = await duplicateOperation({
      id: args.id,
      collection,
      data: args.data,
      depth: 0,
      draft: args.draft,
      req: isolateObjectProperty(req, 'transactionID'),
    })

    return result
  }
}
```

--------------------------------------------------------------------------------

---[FILE: find.ts]---
Location: payload-main/packages/graphql/src/resolvers/collections/find.ts

```typescript
import type { GraphQLResolveInfo } from 'graphql'
import type { Collection, PaginatedDocs, Where } from 'payload'

import { findOperation, isolateObjectProperty } from 'payload'

import type { Context } from '../types.js'

import { buildSelectForCollectionMany } from '../../utilities/select.js'

export type Resolver = (
  _: unknown,
  args: {
    data: Record<string, unknown>
    draft: boolean
    fallbackLocale?: string
    limit?: number
    locale?: string
    page?: number
    pagination?: boolean
    select?: boolean
    sort?: string
    trash?: boolean
    where?: Where
  },
  context: Context,
  info: GraphQLResolveInfo,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => Promise<PaginatedDocs<any>>

export function findResolver(collection: Collection): Resolver {
  return async function resolver(_, args, context, info) {
    const req = (context.req = isolateObjectProperty(context.req, [
      'locale',
      'fallbackLocale',
      'transactionID',
    ]))
    const select = (context.select = args.select ? buildSelectForCollectionMany(info) : undefined)

    req.locale = args.locale || req.locale
    req.fallbackLocale = args.fallbackLocale || req.fallbackLocale
    req.query = req.query || {}

    const draft: boolean =
      (args.draft ?? req.query?.draft === 'false')
        ? false
        : req.query?.draft === 'true'
          ? true
          : undefined
    if (typeof draft === 'boolean') {
      req.query.draft = String(draft)
    }

    const { sort } = args

    const options = {
      collection,
      depth: 0,
      draft: args.draft,
      limit: args.limit,
      page: args.page,
      pagination: args.pagination,
      req,
      select,
      sort: sort && typeof sort === 'string' ? sort.split(',') : undefined,
      trash: args.trash,
      where: args.where,
    }

    const result = await findOperation(options)
    return result
  }
}
```

--------------------------------------------------------------------------------

---[FILE: findByID.ts]---
Location: payload-main/packages/graphql/src/resolvers/collections/findByID.ts

```typescript
import type { GraphQLResolveInfo } from 'graphql'
import type { Collection, CollectionSlug, DataFromCollectionSlug } from 'payload'

import { findByIDOperation, isolateObjectProperty } from 'payload'

import type { Context } from '../types.js'

import { buildSelectForCollection } from '../../utilities/select.js'

export type Resolver<TData> = (
  _: unknown,
  args: {
    draft: boolean
    fallbackLocale?: string
    id: string
    locale?: string
    select?: boolean
    trash?: boolean
  },
  context: Context,
  info: GraphQLResolveInfo,
) => Promise<TData>

export function findByIDResolver<TSlug extends CollectionSlug>(
  collection: Collection,
): Resolver<DataFromCollectionSlug<TSlug>> {
  return async function resolver(_, args, context, info) {
    const req = context.req = isolateObjectProperty(context.req, ['locale', 'fallbackLocale', 'transactionID'])
    const select = context.select = args.select ? buildSelectForCollection(info) : undefined

    req.locale = args.locale || req.locale
    req.fallbackLocale = args.fallbackLocale || req.fallbackLocale
    req.query = req.query || {}

    const draft: boolean =
      (args.draft ?? req.query?.draft === 'false')
        ? false
        : req.query?.draft === 'true'
          ? true
          : undefined
    if (typeof draft === 'boolean') {
      req.query.draft = String(draft)
    }

    const options = {
      id: args.id,
      collection,
      depth: 0,
      draft: args.draft,
      req,
      select,
      trash: args.trash,
    }

    const result = await findByIDOperation(options)
    return result
  }
}
```

--------------------------------------------------------------------------------

---[FILE: findVersionByID.ts]---
Location: payload-main/packages/graphql/src/resolvers/collections/findVersionByID.ts

```typescript
import type { GraphQLResolveInfo } from 'graphql'
import type { Collection, TypeWithID, TypeWithVersion } from 'payload'

import { findVersionByIDOperation, isolateObjectProperty } from 'payload'

import type { Context } from '../types.js'

import { buildSelectForCollection } from '../../utilities/select.js'

export type Resolver<T extends TypeWithID = any> = (
  _: unknown,
  args: {
    fallbackLocale?: string
    id: number | string
    locale?: string
    select?: boolean
    trash?: boolean
  },
  context: Context,
  info: GraphQLResolveInfo,
) => Promise<TypeWithVersion<T>>

export function findVersionByIDResolver(collection: Collection): Resolver {
  return async function resolver(_, args, context, info) {
    const req = context.req = isolateObjectProperty(context.req, ['locale', 'fallbackLocale', 'transactionID'])
    const select = context.select = args.select ? buildSelectForCollection(info) : undefined

    req.locale = args.locale || req.locale
    req.fallbackLocale = args.fallbackLocale || req.fallbackLocale
    req.query = req.query || {}

    const options = {
      id: args.id,
      collection,
      depth: 0,
      req,
      select,
      trash: args.trash,
    }

    const result = await findVersionByIDOperation(options)
    return result
  }
}
```

--------------------------------------------------------------------------------

---[FILE: findVersions.ts]---
Location: payload-main/packages/graphql/src/resolvers/collections/findVersions.ts

```typescript
import type { GraphQLResolveInfo } from 'graphql'
import type { Collection, PaginatedDocs, Where } from 'payload'

import { findVersionsOperation, isolateObjectProperty } from 'payload'

import type { Context } from '../types.js'

import { buildSelectForCollectionMany } from '../../utilities/select.js'

export type Resolver = (
  _: unknown,
  args: {
    draft?: boolean
    fallbackLocale?: string
    limit?: number
    locale?: string
    page?: number
    pagination?: boolean
    select?: boolean
    sort?: string
    trash?: boolean
    where: Where
  },
  context: Context,
  info: GraphQLResolveInfo,
) => Promise<PaginatedDocs<any>>

export function findVersionsResolver(collection: Collection): Resolver {
  return async function resolver(_, args, context, info) {
    const req = (context.req = isolateObjectProperty(context.req, [
      'locale',
      'fallbackLocale',
      'transactionID',
    ]))
    const select = (context.select = args.select ? buildSelectForCollectionMany(info) : undefined)

    req.locale = args.locale || req.locale
    req.fallbackLocale = args.fallbackLocale || req.fallbackLocale
    req.query = req.query || {}

    const draft: boolean =
      (args.draft ?? req.query?.draft === 'false')
        ? false
        : req.query?.draft === 'true'
          ? true
          : undefined
    if (typeof draft === 'boolean') {
      req.query.draft = String(draft)
    }

    const { sort } = args

    const options = {
      collection,
      depth: 0,
      limit: args.limit,
      page: args.page,
      pagination: args.pagination,
      req,
      select,
      sort: sort && typeof sort === 'string' ? sort.split(',') : undefined,
      trash: args.trash,
      where: args.where,
    }

    const result = await findVersionsOperation(options)
    return result
  }
}
```

--------------------------------------------------------------------------------

---[FILE: restoreVersion.ts]---
Location: payload-main/packages/graphql/src/resolvers/collections/restoreVersion.ts

```typescript
import type { Collection, PayloadRequest } from 'payload'

import { isolateObjectProperty, restoreVersionOperation } from 'payload'

import type { Context } from '../types.js'

export type Resolver = (
  _: unknown,
  args: {
    draft?: boolean
    id: number | string
  },
  context: {
    req: PayloadRequest
  },
) => Promise<Document>

export function restoreVersionResolver(collection: Collection): Resolver {
  async function resolver(_, args, context: Context) {
    const options = {
      id: args.id,
      collection,
      depth: 0,
      draft: args.draft,
      req: isolateObjectProperty(context.req, 'transactionID'),
    }

    const result = await restoreVersionOperation(options)
    return result
  }

  return resolver
}
```

--------------------------------------------------------------------------------

---[FILE: update.ts]---
Location: payload-main/packages/graphql/src/resolvers/collections/update.ts

```typescript
import type { Collection, CollectionSlug, DataFromCollectionSlug, PayloadRequest } from 'payload'

import { isolateObjectProperty, updateByIDOperation } from 'payload'

import type { Context } from '../types.js'

export type Resolver<TSlug extends CollectionSlug> = (
  _: unknown,
  args: {
    autosave: boolean
    data: DataFromCollectionSlug<TSlug>
    draft: boolean
    fallbackLocale?: string
    id: number | string
    locale?: string
    trash?: boolean
  },
  context: {
    req: PayloadRequest
  },
) => Promise<DataFromCollectionSlug<TSlug>>

export function updateResolver<TSlug extends CollectionSlug>(
  collection: Collection,
): Resolver<TSlug> {
  return async function resolver(_, args, context: Context) {
    let { req } = context
    const locale = req.locale
    const fallbackLocale = req.fallbackLocale
    req = isolateObjectProperty(req, 'locale')
    req = isolateObjectProperty(req, 'fallbackLocale')
    req.locale = args.locale || locale
    req.fallbackLocale = args.fallbackLocale || fallbackLocale
    if (!req.query) {
      req.query = {}
    }

    const draft: boolean =
      (args.draft ?? req.query?.draft === 'false')
        ? false
        : req.query?.draft === 'true'
          ? true
          : undefined
    if (typeof draft === 'boolean') {
      req.query.draft = String(draft)
    }

    context.req = req

    const options = {
      id: args.id,
      autosave: args.autosave,
      collection,
      data: args.data as any,
      depth: 0,
      draft: args.draft,
      req: isolateObjectProperty(req, 'transactionID'),
      trash: args.trash,
    }

    const result = await updateByIDOperation<TSlug>(options)

    return result
  }
}
```

--------------------------------------------------------------------------------

---[FILE: docAccess.ts]---
Location: payload-main/packages/graphql/src/resolvers/globals/docAccess.ts

```typescript
import type {
  PayloadRequest,
  SanitizedCollectionPermission,
  SanitizedGlobalConfig,
  SanitizedGlobalPermission,
} from 'payload'

import { docAccessOperationGlobal, isolateObjectProperty } from 'payload'

import type { Context } from '../types.js'

export type Resolver = (
  _: unknown,
  context: {
    req: PayloadRequest
  },
) => Promise<SanitizedCollectionPermission | SanitizedGlobalPermission>

export function docAccessResolver(global: SanitizedGlobalConfig): Resolver {
  async function resolver(_, context: Context) {
    return docAccessOperationGlobal({
      globalConfig: global,
      req: isolateObjectProperty(context.req, 'transactionID'),
    })
  }

  return resolver
}
```

--------------------------------------------------------------------------------

---[FILE: findOne.ts]---
Location: payload-main/packages/graphql/src/resolvers/globals/findOne.ts

```typescript
import type { GraphQLResolveInfo } from 'graphql'
import type { Document, SanitizedGlobalConfig } from 'payload'

import { findOneOperation, isolateObjectProperty } from 'payload'

import type { Context } from '../types.js'

import { buildSelectForCollection } from '../../utilities/select.js'

export type Resolver = (
  _: unknown,
  args: {
    draft?: boolean
    fallbackLocale?: string
    id: number | string
    locale?: string
    select?: boolean
  },
  context: Context,
  info: GraphQLResolveInfo
) => Promise<Document>

export function findOne(globalConfig: SanitizedGlobalConfig): Resolver {
  return async function resolver(_, args, context, info) {
    const req = context.req = isolateObjectProperty(context.req, ['locale', 'fallbackLocale', 'transactionID'])
    const select = context.select = args.select ? buildSelectForCollection(info) : undefined
    const { slug } = globalConfig

    req.locale = args.locale || req.locale
    req.fallbackLocale = args.fallbackLocale || req.fallbackLocale
    req.query = req.query || {}

    const options = {
      slug,
      depth: 0,
      draft: args.draft,
      globalConfig,
      req,
      select,
    }

    const result = await findOneOperation(options)
    return result
  }
}
```

--------------------------------------------------------------------------------

---[FILE: findVersionByID.ts]---
Location: payload-main/packages/graphql/src/resolvers/globals/findVersionByID.ts

```typescript
import type { GraphQLResolveInfo } from 'graphql'
import type { Document, SanitizedGlobalConfig } from 'payload'

import { findVersionByIDOperationGlobal, isolateObjectProperty } from 'payload'

import type { Context } from '../types.js'

import { buildSelectForCollection } from '../../utilities/select.js'

export type Resolver = (
  _: unknown,
  args: {
    draft?: boolean
    fallbackLocale?: string
    id: number | string
    locale?: string
    select?: boolean
  },
  context: Context,
  info: GraphQLResolveInfo
) => Promise<Document>

export function findVersionByID(globalConfig: SanitizedGlobalConfig): Resolver {
  return async function resolver(_, args, context, info) {
    const req = context.req = isolateObjectProperty(context.req, ['locale', 'fallbackLocale', 'transactionID'])
    const select = context.select = args.select ? buildSelectForCollection(info) : undefined

    req.locale = args.locale || req.locale
    req.fallbackLocale = args.fallbackLocale || req.fallbackLocale
    req.query = req.query || {}

    const options = {
      id: args.id,
      depth: 0,
      draft: args.draft,
      globalConfig,
      req,
      select,
    }

    const result = await findVersionByIDOperationGlobal(options)
    return result
  }
}
```

--------------------------------------------------------------------------------

---[FILE: findVersions.ts]---
Location: payload-main/packages/graphql/src/resolvers/globals/findVersions.ts

```typescript
import type { GraphQLResolveInfo } from 'graphql'
import type { Document, SanitizedGlobalConfig, Where } from 'payload'

import { findVersionsOperationGlobal, isolateObjectProperty } from 'payload'

import type { Context } from '../types.js'

import { buildSelectForCollectionMany } from '../../utilities/select.js'

export type Resolver = (
  _: unknown,
  args: {
    fallbackLocale?: string
    limit?: number
    locale?: string
    page?: number
    pagination?: boolean
    select?: boolean
    sort?: string
    where: Where
  },
  context: Context,
  info: GraphQLResolveInfo,
) => Promise<Document>

export function findVersions(globalConfig: SanitizedGlobalConfig): Resolver {
  return async function resolver(_, args, context, info) {
    const req = (context.req = isolateObjectProperty(context.req, [
      'locale',
      'fallbackLocale',
      'transactionID',
    ]))
    const select = (context.select = args.select ? buildSelectForCollectionMany(info) : undefined)

    req.locale = args.locale || req.locale
    req.fallbackLocale = args.fallbackLocale || req.fallbackLocale
    req.query = req.query || {}

    const { sort } = args

    const options = {
      depth: 0,
      globalConfig,
      limit: args.limit,
      page: args.page,
      pagination: args.pagination,
      req,
      select,
      sort: sort && typeof sort === 'string' ? sort.split(',') : undefined,
      where: args.where,
    }

    const result = await findVersionsOperationGlobal(options)
    return result
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/graphql/src/resolvers/globals/index.ts

```typescript
import { findOne } from './findOne.js'
import { findVersionByID } from './findVersionByID.js'
import { findVersions } from './findVersions.js'
import { restoreVersion } from './restoreVersion.js'
import { update } from './update.js'

export { findOne, findVersionByID, findVersions, restoreVersion, update }
```

--------------------------------------------------------------------------------

---[FILE: restoreVersion.ts]---
Location: payload-main/packages/graphql/src/resolvers/globals/restoreVersion.ts

```typescript
import type { Document, PayloadRequest, SanitizedGlobalConfig } from 'payload'

import { isolateObjectProperty, restoreVersionOperationGlobal } from 'payload'

import type { Context } from '../types.js'

type Resolver = (
  _: unknown,
  args: {
    draft?: boolean
    id: number | string
  },
  context: {
    req: PayloadRequest
  },
) => Promise<Document>
export function restoreVersion(globalConfig: SanitizedGlobalConfig): Resolver {
  return async function resolver(_, args, context: Context) {
    const options = {
      id: args.id,
      depth: 0,
      draft: args.draft,
      globalConfig,
      req: isolateObjectProperty(context.req, 'transactionID'),
    }

    const result = await restoreVersionOperationGlobal(options)
    return result
  }
}
```

--------------------------------------------------------------------------------

---[FILE: update.ts]---
Location: payload-main/packages/graphql/src/resolvers/globals/update.ts

```typescript
import type {
  DataFromGlobalSlug,
  GlobalSlug,
  PayloadRequest,
  SanitizedGlobalConfig,
  SelectType,
} from 'payload'
import type { DeepPartial } from 'ts-essentials'

import { isolateObjectProperty, updateOperationGlobal } from 'payload'

import type { Context } from '../types.js'

type Resolver<TSlug extends GlobalSlug> = (
  _: unknown,
  args: {
    data?: DeepPartial<Omit<DataFromGlobalSlug<TSlug>, 'id'>>
    draft?: boolean
    fallbackLocale?: string
    locale?: string
  },
  context: {
    req: PayloadRequest
  },
) => Promise<DataFromGlobalSlug<TSlug>>

export function update<TSlug extends GlobalSlug>(
  globalConfig: SanitizedGlobalConfig,
): Resolver<TSlug> {
  return async function resolver(_, args, context: Context) {
    if (args.locale) {
      context.req.locale = args.locale
    }
    if (args.fallbackLocale) {
      context.req.fallbackLocale = args.fallbackLocale
    }

    const { slug } = globalConfig

    const options = {
      slug,
      data: args.data,
      depth: 0,
      draft: args.draft,
      globalConfig,
      req: isolateObjectProperty(context.req, 'transactionID'),
    }

    const result = await updateOperationGlobal<TSlug, SelectType>(options)
    return result
  }
}
```

--------------------------------------------------------------------------------

---[FILE: buildFallbackLocaleInputType.ts]---
Location: payload-main/packages/graphql/src/schema/buildFallbackLocaleInputType.ts

```typescript
import type { SanitizedLocalizationConfig } from 'payload'

import { GraphQLEnumType } from 'graphql'

import { formatName } from '../utilities/formatName.js'

export const buildFallbackLocaleInputType = (
  localization: SanitizedLocalizationConfig,
): GraphQLEnumType => {
  return new GraphQLEnumType({
    name: 'FallbackLocaleInputType',
    values: [...localization.localeCodes, 'none'].reduce(
      (values, locale) => ({
        ...values,
        [formatName(locale)]: {
          value: locale,
        },
      }),
      {},
    ),
  })
}
```

--------------------------------------------------------------------------------

---[FILE: buildLocaleInputType.ts]---
Location: payload-main/packages/graphql/src/schema/buildLocaleInputType.ts

```typescript
import type { GraphQLScalarType } from 'graphql'
import type { SanitizedLocalizationConfig } from 'payload'

import { GraphQLEnumType } from 'graphql'

import { formatName } from '../utilities/formatName.js'

export const buildLocaleInputType = (
  localization: SanitizedLocalizationConfig,
): GraphQLEnumType | GraphQLScalarType => {
  return new GraphQLEnumType({
    name: 'LocaleInputType',
    values: localization.localeCodes.reduce(
      (values, locale) => ({
        ...values,
        [formatName(locale)]: {
          value: locale,
        },
      }),
      {},
    ),
  })
}
```

--------------------------------------------------------------------------------

````
