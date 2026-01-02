---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 184
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 184 of 695)

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
Location: payload-main/packages/payload/src/collections/endpoints/findByID.ts

```typescript
import { status as httpStatus } from 'http-status'

import type { PayloadHandler } from '../../config/types.js'

import { getRequestCollectionWithID } from '../../utilities/getRequestEntity.js'
import { headersWithCors } from '../../utilities/headersWithCors.js'
import { parseParams } from '../../utilities/parseParams/index.js'
import { findByIDOperation } from '../operations/findByID.js'

export const findByIDHandler: PayloadHandler = async (req) => {
  const { data: dataArg } = req
  const { id, collection } = getRequestCollectionWithID(req)

  const { data, depth, draft, flattenLocales, joins, populate, select, trash } = parseParams({
    ...req.query,
    ...dataArg,
  })

  const result = await findByIDOperation({
    id,
    collection,
    data,
    depth,
    draft,
    flattenLocales,
    joins,
    populate,
    req,
    select,
    trash,
  })

  return Response.json(result, {
    headers: headersWithCors({
      headers: new Headers(),
      req,
    }),
    status: httpStatus.OK,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: findDistinct.ts]---
Location: payload-main/packages/payload/src/collections/endpoints/findDistinct.ts

```typescript
import { status as httpStatus } from 'http-status'

import type { PayloadHandler } from '../../config/types.js'

import { APIError } from '../../errors/APIError.js'
import { getRequestCollection } from '../../utilities/getRequestEntity.js'
import { headersWithCors } from '../../utilities/headersWithCors.js'
import { parseParams } from '../../utilities/parseParams/index.js'
import { findDistinctOperation } from '../operations/findDistinct.js'

export const findDistinctHandler: PayloadHandler = async (req) => {
  const collection = getRequestCollection(req)

  const { depth, field, limit, page, sort, trash, where } = parseParams(req.query)

  if (!field) {
    throw new APIError('field must be specified', httpStatus.BAD_REQUEST)
  }

  const result = await findDistinctOperation({
    collection,
    depth,
    field,
    limit,
    page,
    req,
    sort,
    trash,
    where,
  })

  return Response.json(result, {
    headers: headersWithCors({
      headers: new Headers(),
      req,
    }),
    status: httpStatus.OK,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: findVersionByID.ts]---
Location: payload-main/packages/payload/src/collections/endpoints/findVersionByID.ts

```typescript
import { status as httpStatus } from 'http-status'

import type { PayloadHandler } from '../../config/types.js'

import { getRequestCollectionWithID } from '../../utilities/getRequestEntity.js'
import { headersWithCors } from '../../utilities/headersWithCors.js'
import { parseParams } from '../../utilities/parseParams/index.js'
import { findVersionByIDOperation } from '../operations/findVersionByID.js'

export const findVersionByIDHandler: PayloadHandler = async (req) => {
  const { depth, populate, select, trash } = parseParams(req.query)

  const { id, collection } = getRequestCollectionWithID(req)

  const result = await findVersionByIDOperation({
    id,
    collection,
    depth,
    populate,
    req,
    select,
    trash,
  })

  return Response.json(result, {
    headers: headersWithCors({
      headers: new Headers(),
      req,
    }),
    status: httpStatus.OK,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: findVersions.ts]---
Location: payload-main/packages/payload/src/collections/endpoints/findVersions.ts

```typescript
import { status as httpStatus } from 'http-status'

import type { PayloadHandler } from '../../config/types.js'

import { getRequestCollection } from '../../utilities/getRequestEntity.js'
import { headersWithCors } from '../../utilities/headersWithCors.js'
import { parseParams } from '../../utilities/parseParams/index.js'
import { findVersionsOperation } from '../operations/findVersions.js'

export const findVersionsHandler: PayloadHandler = async (req) => {
  const collection = getRequestCollection(req)

  const { depth, limit, page, pagination, populate, select, sort, trash, where } = parseParams(
    req.query,
  )

  const result = await findVersionsOperation({
    collection,
    depth,
    limit,
    page,
    pagination,
    populate,
    req,
    select,
    sort,
    trash,
    where,
  })

  return Response.json(result, {
    headers: headersWithCors({
      headers: new Headers(),
      req,
    }),
    status: httpStatus.OK,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/payload/src/collections/endpoints/index.ts

```typescript
import type { Endpoint } from '../../config/types.js'

import { wrapInternalEndpoints } from '../../utilities/wrapInternalEndpoints.js'
import { countHandler } from './count.js'
import { createHandler } from './create.js'
import { deleteHandler } from './delete.js'
import { deleteByIDHandler } from './deleteByID.js'
import { docAccessHandler } from './docAccess.js'
import { duplicateHandler } from './duplicate.js'
import { findHandler } from './find.js'
import { findByIDHandler } from './findByID.js'
// import { findDistinctHandler } from './findDistinct.js'
import { findVersionByIDHandler } from './findVersionByID.js'
import { findVersionsHandler } from './findVersions.js'
import { restoreVersionHandler } from './restoreVersion.js'
import { updateHandler } from './update.js'
import { updateByIDHandler } from './updateByID.js'

export const defaultCollectionEndpoints: Endpoint[] = [
  ...wrapInternalEndpoints([
    {
      handler: countHandler,
      method: 'get',
      path: '/count',
    },
    {
      handler: createHandler,
      method: 'post',
      path: '/',
    },
    {
      handler: deleteHandler,
      method: 'delete',
      path: '/',
    },
    {
      handler: deleteByIDHandler,
      method: 'delete',
      path: '/:id',
    },
    {
      handler: docAccessHandler,
      method: 'post',
      path: '/access/:id?',
    },
    {
      handler: findVersionsHandler,
      method: 'get',
      path: '/versions',
    },
    // Might be uncommented in the future
    // {
    //   handler: findDistinctHandler,
    //   method: 'get',
    //   path: '/distinct',
    // },
    {
      handler: duplicateHandler,
      method: 'post',
      path: '/:id/duplicate',
    },
    {
      handler: findHandler,
      method: 'get',
      path: '/',
    },
    {
      handler: findByIDHandler,
      method: 'get',
      path: '/:id',
    },
    {
      handler: findVersionByIDHandler,
      method: 'get',
      path: '/versions/:id',
    },
    {
      handler: restoreVersionHandler,
      method: 'post',
      path: '/versions/:id',
    },
    {
      handler: updateHandler,
      method: 'patch',
      path: '/',
    },
    {
      handler: updateByIDHandler,
      method: 'patch',
      path: '/:id',
    },
  ]),
]
```

--------------------------------------------------------------------------------

---[FILE: restoreVersion.ts]---
Location: payload-main/packages/payload/src/collections/endpoints/restoreVersion.ts

```typescript
import { status as httpStatus } from 'http-status'

import type { PayloadHandler } from '../../config/types.js'

import { getRequestCollectionWithID } from '../../utilities/getRequestEntity.js'
import { headersWithCors } from '../../utilities/headersWithCors.js'
import { parseParams } from '../../utilities/parseParams/index.js'
import { restoreVersionOperation } from '../operations/restoreVersion.js'

export const restoreVersionHandler: PayloadHandler = async (req) => {
  const { id, collection } = getRequestCollectionWithID(req)

  const { depth, draft, populate } = parseParams(req.query)

  const result = await restoreVersionOperation({
    id,
    collection,
    depth,
    draft,
    populate,
    req,
  })

  return Response.json(
    {
      ...result,
      message: req.t('version:restoredSuccessfully'),
    },
    {
      headers: headersWithCors({
        headers: new Headers(),
        req,
      }),
      status: httpStatus.OK,
    },
  )
}
```

--------------------------------------------------------------------------------

---[FILE: update.ts]---
Location: payload-main/packages/payload/src/collections/endpoints/update.ts

```typescript
import { getTranslation } from '@payloadcms/translations'
import { status as httpStatus } from 'http-status'

import type { PayloadHandler } from '../../config/types.js'

import { getRequestCollection } from '../../utilities/getRequestEntity.js'
import { headersWithCors } from '../../utilities/headersWithCors.js'
import { parseParams } from '../../utilities/parseParams/index.js'
import { updateOperation } from '../operations/update.js'

export const updateHandler: PayloadHandler = async (req) => {
  const collection = getRequestCollection(req)

  const { depth, draft, limit, overrideLock, populate, select, sort, trash, where } = parseParams(
    req.query,
  )

  const result = await updateOperation({
    collection,
    data: req.data!,
    depth,
    draft,
    limit,
    overrideLock: overrideLock ?? false,
    populate,
    req,
    select,
    sort,
    trash,
    where: where!,
  })

  const headers = headersWithCors({
    headers: new Headers(),
    req,
  })

  if (result.errors.length === 0) {
    const message = req.t('general:updatedCountSuccessfully', {
      count: result.docs.length,
      label: getTranslation(
        collection.config.labels[result.docs.length === 1 ? 'singular' : 'plural'],
        req.i18n,
      ),
    })

    return Response.json(
      {
        ...result,
        message,
      },
      {
        headers,
        status: httpStatus.OK,
      },
    )
  }

  result.errors = result.errors.map((error) =>
    error.isPublic
      ? error
      : {
          ...error,
          message: 'Something went wrong.',
        },
  )

  const total = result.docs.length + result.errors.length
  const message = req.t('error:unableToUpdateCount', {
    count: result.errors.length,
    label: getTranslation(collection.config.labels[total === 1 ? 'singular' : 'plural'], req.i18n),
    total,
  })

  return Response.json(
    {
      ...result,
      message,
    },
    {
      headers,
      status: httpStatus.BAD_REQUEST,
    },
  )
}
```

--------------------------------------------------------------------------------

---[FILE: updateByID.ts]---
Location: payload-main/packages/payload/src/collections/endpoints/updateByID.ts

```typescript
import { status as httpStatus } from 'http-status'

import type { PayloadHandler } from '../../config/types.js'

import { getRequestCollectionWithID } from '../../utilities/getRequestEntity.js'
import { headersWithCors } from '../../utilities/headersWithCors.js'
import { parseParams } from '../../utilities/parseParams/index.js'
import { updateByIDOperation } from '../operations/updateByID.js'

export const updateByIDHandler: PayloadHandler = async (req) => {
  const { id, collection } = getRequestCollectionWithID(req)

  const { autosave, depth, draft, overrideLock, populate, publishSpecificLocale, select, trash } =
    parseParams(req.query)

  const doc = await updateByIDOperation({
    id,
    autosave,
    collection,
    data: req.data!,
    depth,
    draft,
    overrideLock: overrideLock ?? false,
    populate,
    publishSpecificLocale,
    req,
    select,
    trash,
  })

  let message = req.t('general:updatedSuccessfully')

  if (draft) {
    message = req.t('version:draftSavedSuccessfully')
  }
  if (autosave) {
    message = req.t('version:autosavedSuccessfully')
  }

  return Response.json(
    {
      doc,
      message,
    },
    {
      headers: headersWithCors({
        headers: new Headers(),
        req,
      }),
      status: httpStatus.OK,
    },
  )
}
```

--------------------------------------------------------------------------------

---[FILE: count.ts]---
Location: payload-main/packages/payload/src/collections/operations/count.ts

```typescript
import type { AccessResult } from '../../config/types.js'
import type { CollectionSlug } from '../../index.js'
import type { PayloadRequest, Where } from '../../types/index.js'
import type { Collection } from '../config/types.js'

import { executeAccess } from '../../auth/executeAccess.js'
import { combineQueries } from '../../database/combineQueries.js'
import { validateQueryPaths } from '../../database/queryValidation/validateQueryPaths.js'
import { sanitizeWhereQuery } from '../../database/sanitizeWhereQuery.js'
import { appendNonTrashedFilter } from '../../utilities/appendNonTrashedFilter.js'
import { killTransaction } from '../../utilities/killTransaction.js'
import { buildAfterOperation } from './utilities/buildAfterOperation.js'
import { buildBeforeOperation } from './utilities/buildBeforeOperation.js'

export type Arguments = {
  collection: Collection
  disableErrors?: boolean
  overrideAccess?: boolean
  req?: PayloadRequest
  trash?: boolean
  where?: Where
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const countOperation = async <TSlug extends CollectionSlug>(
  incomingArgs: Arguments,
): Promise<{ totalDocs: number }> => {
  let args = incomingArgs

  try {
    // /////////////////////////////////////
    // beforeOperation - Collection
    // /////////////////////////////////////

    args = await buildBeforeOperation({
      args,
      collection: args.collection.config,
      operation: 'count',
    })

    const {
      collection: { config: collectionConfig },
      disableErrors,
      overrideAccess,
      req,
      trash = false,
      where,
    } = args

    const { payload } = req!

    // /////////////////////////////////////
    // Access
    // /////////////////////////////////////

    let accessResult: AccessResult

    if (!overrideAccess) {
      accessResult = await executeAccess({ disableErrors, req: req! }, collectionConfig.access.read)

      // If errors are disabled, and access returns false, return empty results
      if (accessResult === false) {
        return {
          totalDocs: 0,
        }
      }
    }

    let result: { totalDocs: number }

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
      req: req!,
      where: where!,
    })

    result = await payload.db.count({
      collection: collectionConfig.slug,
      req,
      where: fullWhere,
    })

    // /////////////////////////////////////
    // afterOperation - Collection
    // /////////////////////////////////////

    result = await buildAfterOperation({
      args,
      collection: collectionConfig,
      operation: 'count',
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

---[FILE: countVersions.ts]---
Location: payload-main/packages/payload/src/collections/operations/countVersions.ts

```typescript
import type { AccessResult } from '../../config/types.js'
import type { PayloadRequest, Where } from '../../types/index.js'
import type { Collection } from '../config/types.js'

import { executeAccess } from '../../auth/executeAccess.js'
import { combineQueries } from '../../database/combineQueries.js'
import { validateQueryPaths } from '../../database/queryValidation/validateQueryPaths.js'
import { sanitizeWhereQuery } from '../../database/sanitizeWhereQuery.js'
import { buildVersionCollectionFields, type CollectionSlug } from '../../index.js'
import { killTransaction } from '../../utilities/killTransaction.js'
import { buildAfterOperation } from './utilities/buildAfterOperation.js'
import { buildBeforeOperation } from './utilities/buildBeforeOperation.js'

export type Arguments = {
  collection: Collection
  disableErrors?: boolean
  overrideAccess?: boolean
  req?: PayloadRequest
  where?: Where
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const countVersionsOperation = async <TSlug extends CollectionSlug>(
  incomingArgs: Arguments,
): Promise<{ totalDocs: number }> => {
  let args = incomingArgs

  try {
    // /////////////////////////////////////
    // beforeOperation - Collection
    // /////////////////////////////////////

    args = await buildBeforeOperation({
      args,
      collection: args.collection.config,
      operation: 'countVersions',
    })

    const {
      collection: { config: collectionConfig },
      disableErrors,
      overrideAccess,
      req,
      where,
    } = args

    const { locale, payload } = req!

    // /////////////////////////////////////
    // Access
    // /////////////////////////////////////

    let accessResult: AccessResult

    if (!overrideAccess) {
      accessResult = await executeAccess(
        { disableErrors, req: req! },
        collectionConfig.access.readVersions,
      )

      // If errors are disabled, and access returns false, return empty results
      if (accessResult === false) {
        return {
          totalDocs: 0,
        }
      }
    }

    let result: { totalDocs: number }

    const fullWhere = combineQueries(where!, accessResult!)

    const versionFields = buildVersionCollectionFields(payload.config, collectionConfig, true)

    sanitizeWhereQuery({ fields: versionFields, payload, where: fullWhere })

    await validateQueryPaths({
      collectionConfig,
      overrideAccess: overrideAccess!,
      req: req!,
      versionFields,
      where: where!,
    })

    result = await payload.db.countVersions({
      collection: collectionConfig.slug,
      locale: locale!,
      req,
      where: fullWhere,
    })

    // /////////////////////////////////////
    // afterOperation - Collection
    // /////////////////////////////////////

    result = await buildAfterOperation({
      args,
      collection: collectionConfig,
      operation: 'countVersions',
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

---[FILE: create.ts]---
Location: payload-main/packages/payload/src/collections/operations/create.ts

```typescript
import crypto from 'crypto'

import type { CollectionSlug, JsonObject } from '../../index.js'
import type {
  Document,
  PayloadRequest,
  PopulateType,
  SelectType,
  TransformCollectionWithSelect,
} from '../../types/index.js'
import type {
  Collection,
  DataFromCollectionSlug,
  RequiredDataFromCollectionSlug,
  SelectFromCollectionSlug,
} from '../config/types.js'

import { ensureUsernameOrEmail } from '../../auth/ensureUsernameOrEmail.js'
import { executeAccess } from '../../auth/executeAccess.js'
import { sendVerificationEmail } from '../../auth/sendVerificationEmail.js'
import { registerLocalStrategy } from '../../auth/strategies/local/register.js'
import { getDuplicateDocumentData } from '../../duplicateDocument/index.js'
import { afterChange } from '../../fields/hooks/afterChange/index.js'
import { afterRead } from '../../fields/hooks/afterRead/index.js'
import { beforeChange } from '../../fields/hooks/beforeChange/index.js'
import { beforeValidate } from '../../fields/hooks/beforeValidate/index.js'
import { saveVersion } from '../../index.js'
import { generateFileData } from '../../uploads/generateFileData.js'
import { unlinkTempFiles } from '../../uploads/unlinkTempFiles.js'
import { uploadFiles } from '../../uploads/uploadFiles.js'
import { commitTransaction } from '../../utilities/commitTransaction.js'
import { hasDraftsEnabled, hasDraftValidationEnabled } from '../../utilities/getVersionsConfig.js'
import { initTransaction } from '../../utilities/initTransaction.js'
import { killTransaction } from '../../utilities/killTransaction.js'
import { sanitizeInternalFields } from '../../utilities/sanitizeInternalFields.js'
import { sanitizeSelect } from '../../utilities/sanitizeSelect.js'
import { buildAfterOperation } from './utilities/buildAfterOperation.js'
import { buildBeforeOperation } from './utilities/buildBeforeOperation.js'

export type Arguments<TSlug extends CollectionSlug> = {
  autosave?: boolean
  collection: Collection
  data: RequiredDataFromCollectionSlug<TSlug>
  depth?: number
  disableTransaction?: boolean
  disableVerificationEmail?: boolean
  draft?: boolean
  duplicateFromID?: DataFromCollectionSlug<TSlug>['id']
  overrideAccess?: boolean
  overwriteExistingFiles?: boolean
  populate?: PopulateType
  publishSpecificLocale?: string
  req: PayloadRequest
  select?: SelectType
  selectedLocales?: string[]
  showHiddenFields?: boolean
}

export const createOperation = async <
  TSlug extends CollectionSlug,
  TSelect extends SelectFromCollectionSlug<TSlug>,
>(
  incomingArgs: Arguments<TSlug>,
): Promise<TransformCollectionWithSelect<TSlug, TSelect>> => {
  let args = incomingArgs

  try {
    const shouldCommit = !args.disableTransaction && (await initTransaction(args.req))

    ensureUsernameOrEmail<TSlug>({
      authOptions: args.collection.config.auth,
      collectionSlug: args.collection.config.slug,
      data: args.data,
      operation: 'create',
      req: args.req,
    })

    // /////////////////////////////////////
    // beforeOperation - Collection
    // /////////////////////////////////////

    args = await buildBeforeOperation({
      args,
      collection: args.collection.config,
      operation: 'create',
    })

    if (args.publishSpecificLocale) {
      args.req.locale = args.publishSpecificLocale
    }

    const {
      autosave = false,
      collection: { config: collectionConfig },
      collection,
      depth,
      disableVerificationEmail,
      draft = false,
      duplicateFromID,
      overrideAccess,
      overwriteExistingFiles = false,
      populate,
      publishSpecificLocale,
      req: {
        fallbackLocale,
        locale,
        payload,
        payload: { config },
      },
      req,
      select: incomingSelect,
      selectedLocales,
      showHiddenFields,
    } = args

    let { data } = args

    const isSavingDraft = Boolean(draft && hasDraftsEnabled(collectionConfig))

    let duplicatedFromDocWithLocales: JsonObject = {}
    let duplicatedFromDoc: JsonObject = {}

    if (duplicateFromID) {
      const duplicateResult = await getDuplicateDocumentData({
        id: duplicateFromID,
        collectionConfig,
        draftArg: isSavingDraft,
        overrideAccess,
        req,
        selectedLocales,
      })

      duplicatedFromDoc = duplicateResult.duplicatedFromDoc
      duplicatedFromDocWithLocales = duplicateResult.duplicatedFromDocWithLocales
    }

    // /////////////////////////////////////
    // Access
    // /////////////////////////////////////

    if (!overrideAccess) {
      await executeAccess({ data, req }, collectionConfig.access.create)
    }

    // /////////////////////////////////////
    // Generate data for all files and sizes
    // /////////////////////////////////////

    const { data: newFileData, files: filesToUpload } = await generateFileData({
      collection,
      config,
      data,
      isDuplicating: Boolean(duplicateFromID),
      operation: 'create',
      originalDoc: duplicatedFromDoc,
      overwriteExistingFiles,
      req,
      throwOnMissingFile:
        !isSavingDraft && collection.config.upload.filesRequiredOnCreate !== false,
    })

    data = newFileData

    // /////////////////////////////////////
    // beforeValidate - Fields
    // /////////////////////////////////////

    data = await beforeValidate({
      collection: collectionConfig,
      context: req.context,
      data,
      doc: duplicatedFromDoc,
      global: null,
      operation: 'create',
      overrideAccess: overrideAccess!,
      req,
    })

    // /////////////////////////////////////
    // beforeValidate - Collections
    // /////////////////////////////////////

    if (collectionConfig.hooks.beforeValidate?.length) {
      for (const hook of collectionConfig.hooks.beforeValidate) {
        data =
          (await hook({
            collection: collectionConfig,
            context: req.context,
            data,
            operation: 'create',
            originalDoc: duplicatedFromDoc,
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
            operation: 'create',
            originalDoc: duplicatedFromDoc,
            req,
          })) || data
      }
    }

    // /////////////////////////////////////
    // beforeChange - Fields
    // /////////////////////////////////////

    const resultWithLocales = await beforeChange<JsonObject>({
      collection: collectionConfig,
      context: req.context,
      data,
      doc: duplicatedFromDoc,
      docWithLocales: duplicatedFromDocWithLocales,
      global: null,
      operation: 'create',
      overrideAccess,
      req,
      skipValidation: isSavingDraft && !hasDraftValidationEnabled(collectionConfig),
    })

    // /////////////////////////////////////
    // Write files to local storage
    // /////////////////////////////////////

    if (!collectionConfig.upload.disableLocalStorage) {
      await uploadFiles(payload, filesToUpload, req)
    }

    // /////////////////////////////////////
    // Create
    // /////////////////////////////////////

    let doc

    const select = sanitizeSelect({
      fields: collectionConfig.flattenedFields,
      forceSelect: collectionConfig.forceSelect,
      select: incomingSelect,
    })

    if (collectionConfig.auth && !collectionConfig.auth.disableLocalStrategy) {
      if (collectionConfig.auth.verify) {
        resultWithLocales._verified = Boolean(resultWithLocales._verified) || false
        resultWithLocales._verificationToken = crypto.randomBytes(20).toString('hex')
      }

      doc = await registerLocalStrategy({
        collection: collectionConfig,
        doc: resultWithLocales,
        password: data.password as string,
        payload: req.payload,
        req,
      })
    } else {
      doc = await payload.db.create({
        collection: collectionConfig.slug,
        data: resultWithLocales,
        req,
      })
    }

    const verificationToken = doc._verificationToken
    let result: Document = sanitizeInternalFields(doc)

    // /////////////////////////////////////
    // Create version
    // /////////////////////////////////////

    if (collectionConfig.versions) {
      await saveVersion({
        id: result.id,
        autosave,
        collection: collectionConfig,
        docWithLocales: result,
        operation: 'create',
        payload,
        publishSpecificLocale,
        req,
      })
    }

    // /////////////////////////////////////
    // Send verification email if applicable
    // /////////////////////////////////////

    if (collectionConfig.auth && collectionConfig.auth.verify && result.email) {
      await sendVerificationEmail({
        collection: { config: collectionConfig },
        config: payload.config,
        disableEmail: disableVerificationEmail!,
        email: payload.email,
        req,
        token: verificationToken,
        user: result,
      })
    }

    // /////////////////////////////////////
    // afterRead - Fields
    // /////////////////////////////////////

    result = await afterRead({
      collection: collectionConfig,
      context: req.context,
      depth: depth!,
      doc: result,
      draft,
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
    // afterChange - Fields
    // /////////////////////////////////////

    result = await afterChange({
      collection: collectionConfig,
      context: req.context,
      data,
      doc: result,
      global: null,
      operation: 'create',
      previousDoc: {},
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
            data,
            doc: result,
            operation: 'create',
            previousDoc: {},
            req: args.req,
          })) || result
      }
    }

    // /////////////////////////////////////
    // afterOperation - Collection
    // /////////////////////////////////////

    result = await buildAfterOperation<TSlug>({
      args,
      collection: collectionConfig,
      operation: 'create',
      result,
    })

    await unlinkTempFiles({ collectionConfig, config, req })

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

````
