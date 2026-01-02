---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 207
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 207 of 695)

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

---[FILE: sanitize.ts]---
Location: payload-main/packages/payload/src/globals/config/sanitize.ts

```typescript
import type { Config, SanitizedConfig } from '../../config/types.js'
import type { GlobalConfig, SanitizedGlobalConfig } from './types.js'

import { defaultAccess } from '../../auth/defaultAccess.js'
import { sanitizeFields } from '../../fields/config/sanitize.js'
import { fieldAffectsData } from '../../fields/config/types.js'
import { mergeBaseFields } from '../../fields/mergeBaseFields.js'
import { flattenAllFields } from '../../utilities/flattenAllFields.js'
import { toWords } from '../../utilities/formatLabels.js'
import { baseVersionFields } from '../../versions/baseFields.js'
import { versionDefaults } from '../../versions/defaults.js'
import { defaultGlobalEndpoints } from '../endpoints/index.js'

export const sanitizeGlobal = async (
  config: Config,
  global: GlobalConfig,
  /**
   * If this property is set, RichText fields won't be sanitized immediately. Instead, they will be added to this array as promises
   * so that you can sanitize them together, after the config has been sanitized.
   */
  richTextSanitizationPromises?: Array<(config: SanitizedConfig) => Promise<void>>,
  _validRelationships?: string[],
): Promise<SanitizedGlobalConfig> => {
  if (global._sanitized) {
    return global as SanitizedGlobalConfig
  }

  global._sanitized = true

  global.label = global.label || toWords(global.slug)

  // /////////////////////////////////
  // Ensure that collection has required object structure
  // /////////////////////////////////

  global.endpoints = global.endpoints ?? []

  if (!global.hooks) {
    global.hooks = {}
  }

  if (!global.access) {
    global.access = {}
  }

  if (!global.admin) {
    global.admin = {}
  }

  if (!global.access.read) {
    global.access.read = defaultAccess
  }

  if (!global.access.update) {
    global.access.update = defaultAccess
  }

  if (!global.hooks.beforeValidate) {
    global.hooks.beforeValidate = []
  }

  if (!global.hooks.beforeChange) {
    global.hooks.beforeChange = []
  }

  if (!global.hooks.afterChange) {
    global.hooks.afterChange = []
  }

  if (!global.hooks.beforeRead) {
    global.hooks.beforeRead = []
  }

  if (!global.hooks.afterRead) {
    global.hooks.afterRead = []
  }

  // Sanitize fields
  const validRelationships = _validRelationships ?? config.collections?.map((c) => c.slug) ?? []

  global.fields = await sanitizeFields({
    config,
    fields: global.fields,
    globalConfig: global,
    parentIsLocalized: false,
    richTextSanitizationPromises,
    validRelationships,
  })

  if (global.endpoints !== false) {
    if (!global.endpoints) {
      global.endpoints = []
    }

    for (const endpoint of defaultGlobalEndpoints) {
      global.endpoints.push(endpoint)
    }
  }

  if (global.versions) {
    if (global.versions === true) {
      global.versions = { drafts: false, max: 100 }
    }

    global.versions.max = typeof global.versions.max === 'number' ? global.versions.max : 100

    if (global.versions.drafts) {
      if (global.versions.drafts === true) {
        global.versions.drafts = {
          autosave: false,
          validate: false,
        }
      }

      if (global.versions.drafts.autosave === true) {
        global.versions.drafts.autosave = {
          interval: versionDefaults.autosaveInterval,
        }
      }

      if (global.versions.drafts.validate === undefined) {
        global.versions.drafts.validate = false
      }

      global.fields = mergeBaseFields(global.fields, baseVersionFields)
    }
  }

  if (!global.custom) {
    global.custom = {}
  }

  // /////////////////////////////////
  // Sanitize fields
  // /////////////////////////////////
  let hasUpdatedAt: boolean | null = null
  let hasCreatedAt: boolean | null = null
  global.fields.some((field) => {
    if (fieldAffectsData(field)) {
      if (field.name === 'updatedAt') {
        hasUpdatedAt = true
      }
      if (field.name === 'createdAt') {
        hasCreatedAt = true
      }
    }
    return hasCreatedAt && hasUpdatedAt
  })
  if (!hasUpdatedAt) {
    global.fields.push({
      name: 'updatedAt',
      type: 'date',
      admin: {
        disableBulkEdit: true,
        hidden: true,
      },
      label: ({ t }) => t('general:updatedAt'),
    })
  }
  if (!hasCreatedAt) {
    global.fields.push({
      name: 'createdAt',
      type: 'date',
      admin: {
        disableBulkEdit: true,
        hidden: true,
      },
      label: ({ t }) => t('general:createdAt'),
    })
  }

  ;(global as SanitizedGlobalConfig).flattenedFields = flattenAllFields({ fields: global.fields })

  return global as SanitizedGlobalConfig
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/payload/src/globals/config/types.ts

```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GraphQLNonNull, GraphQLObjectType } from 'graphql'
import type { DeepRequired, IsAny } from 'ts-essentials'

import type {
  CustomPreviewButton,
  CustomPublishButton,
  CustomSaveButton,
  CustomSaveDraftButton,
} from '../../admin/types.js'
import type {
  Access,
  CustomComponent,
  EditConfig,
  Endpoint,
  EntityDescription,
  EntityDescriptionComponent,
  GeneratePreviewURL,
  LabelFunction,
  LivePreviewConfig,
  MetaConfig,
  StaticLabel,
} from '../../config/types.js'
import type { DBIdentifierName } from '../../database/types.js'
import type { Field, FlattenedField } from '../../fields/config/types.js'
import type {
  GlobalAdminCustom,
  GlobalCustom,
  GlobalSlug,
  RequestContext,
  TypedGlobal,
  TypedGlobalSelect,
} from '../../index.js'
import type { PayloadRequest, SelectIncludeType, Where } from '../../types/index.js'
import type { IncomingGlobalVersions, SanitizedGlobalVersions } from '../../versions/types.js'

export type DataFromGlobalSlug<TSlug extends GlobalSlug> = TypedGlobal[TSlug]

export type SelectFromGlobalSlug<TSlug extends GlobalSlug> = TypedGlobalSelect[TSlug]

export type BeforeValidateHook = (args: {
  context: RequestContext
  data?: any
  /** The global which this hook is being run on */
  global: SanitizedGlobalConfig
  originalDoc?: any
  req: PayloadRequest
}) => any

export type BeforeChangeHook = (args: {
  context: RequestContext
  data: any
  /** The global which this hook is being run on */
  global: SanitizedGlobalConfig
  originalDoc?: any
  req: PayloadRequest
}) => any

export type AfterChangeHook = (args: {
  context: RequestContext
  data: any
  doc: any
  /** The global which this hook is being run on */
  global: SanitizedGlobalConfig
  previousDoc: any
  req: PayloadRequest
}) => any

export type BeforeReadHook = (args: {
  context: RequestContext
  doc: any
  /** The global which this hook is being run on */
  global: SanitizedGlobalConfig
  req: PayloadRequest
}) => any

export type AfterReadHook = (args: {
  context: RequestContext
  doc: any
  findMany?: boolean
  /** The global which this hook is being run on */
  global: SanitizedGlobalConfig
  query?: Where
  req: PayloadRequest
}) => any

export type HookOperationType = 'countVersions' | 'read' | 'restoreVersion' | 'update'

export type BeforeOperationHook = (args: {
  args?: any
  context: RequestContext
  /**
   * The Global which this hook is being run on
   * */
  global: SanitizedGlobalConfig
  /**
   * Hook operation being performed
   */
  operation: HookOperationType
  req: PayloadRequest
}) => any

export type GlobalAdminOptions = {
  /**
   * Custom admin components
   */
  components?: {
    elements?: {
      /**
       * Inject custom components before the document controls
       */
      beforeDocumentControls?: CustomComponent[]
      Description?: EntityDescriptionComponent
      /**
       * Replaces the "Preview" button
       */
      PreviewButton?: CustomPreviewButton
      /**
       * Replaces the "Publish" button
       * + drafts must be enabled
       */
      PublishButton?: CustomPublishButton
      /**
       * Replaces the "Save" button
       * + drafts must be disabled
       */
      SaveButton?: CustomSaveButton
      /**
       * Replaces the "Save Draft" button
       * + drafts must be enabled
       * + autosave must be disabled
       */
      SaveDraftButton?: CustomSaveDraftButton
    }
    views?: {
      /**
       * Set to a React component to replace the entire Edit View, including all nested routes.
       * Set to an object to replace or modify individual nested routes, or to add new ones.
       */
      edit?: EditConfig
    }
  }
  /** Extension point to add your custom data. Available in server and client. */
  custom?: GlobalAdminCustom
  /**
   * Custom description for collection
   */
  description?: EntityDescription
  /**
   * Specify a navigational group for globals in the admin sidebar.
   * - Provide a string to place the entity in a custom group.
   * - Provide a record to define localized group names.
   * - Set to `false` to exclude the entity from the sidebar / dashboard without disabling its routes.
   */
  group?: false | Record<string, string> | string
  /**
   * Exclude the global from the admin nav and routes
   */
  hidden?: ((args: { user: PayloadRequest['user'] }) => boolean) | boolean
  /**
   * Hide the API URL within the Edit View
   */
  hideAPIURL?: boolean
  /**
   * Live preview options
   */
  livePreview?: LivePreviewConfig
  meta?: MetaConfig
  /**
   * Function to generate custom preview URL
   */
  preview?: GeneratePreviewURL
}

export type GlobalConfig<TSlug extends GlobalSlug = any> = {
  /**
   * Do not set this property manually. This is set to true during sanitization, to avoid
   * sanitizing the same global multiple times.
   */
  _sanitized?: boolean
  access?: {
    read?: Access
    readDrafts?: Access
    readVersions?: Access
    update?: Access
  }
  admin?: GlobalAdminOptions
  /** Extension point to add your custom data. Server only. */
  custom?: GlobalCustom
  /**
   * Customize the SQL table name
   */
  dbName?: DBIdentifierName
  endpoints?: false | Omit<Endpoint, 'root'>[]
  fields: Field[]
  /**
   * Specify which fields should be selected always, regardless of the `select` query which can be useful that the field exists for access control / hooks
   */
  forceSelect?: IsAny<SelectFromGlobalSlug<TSlug>> extends true
    ? SelectIncludeType
    : SelectFromGlobalSlug<TSlug>
  graphQL?:
    | {
        disableMutations?: true
        disableQueries?: true
        name?: string
      }
    | false
  hooks?: {
    afterChange?: AfterChangeHook[]
    afterRead?: AfterReadHook[]
    beforeChange?: BeforeChangeHook[]
    beforeOperation?: BeforeOperationHook[]
    beforeRead?: BeforeReadHook[]
    beforeValidate?: BeforeValidateHook[]
  }
  label?: LabelFunction | StaticLabel
  /**
   * Enables / Disables the ability to lock documents while editing
   * @default true
   */
  lockDocuments?:
    | {
        duration: number
      }
    | false
  slug: string
  /**
   * Options used in typescript generation
   */
  typescript?: {
    /**
     * Typescript generation name given to the interface type
     */
    interface?: string
  }
  versions?: boolean | IncomingGlobalVersions
}

export interface SanitizedGlobalConfig
  extends Omit<DeepRequired<GlobalConfig>, 'endpoints' | 'fields' | 'slug' | 'versions'> {
  endpoints: Endpoint[] | false
  fields: Field[]
  /**
   * Fields in the database schema structure
   * Rows / collapsible / tabs w/o name `fields` merged to top, UIs are excluded
   */
  flattenedFields: FlattenedField[]
  slug: GlobalSlug
  versions?: SanitizedGlobalVersions
}

export type Globals = {
  config: SanitizedGlobalConfig[]
  graphQL?:
    | {
        [slug: string]: {
          mutationInputType: GraphQLNonNull<any>
          type: GraphQLObjectType
          versionType?: GraphQLObjectType
        }
      }
    | false
}
```

--------------------------------------------------------------------------------

---[FILE: docAccess.ts]---
Location: payload-main/packages/payload/src/globals/endpoints/docAccess.ts

```typescript
import { status as httpStatus } from 'http-status'

import type { PayloadHandler } from '../../config/types.js'

import { getRequestGlobal } from '../../utilities/getRequestEntity.js'
import { headersWithCors } from '../../utilities/headersWithCors.js'
import { docAccessOperation } from '../operations/docAccess.js'

export const docAccessHandler: PayloadHandler = async (req) => {
  const globalConfig = getRequestGlobal(req)
  const result = await docAccessOperation({
    globalConfig,
    req,
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

---[FILE: findOne.ts]---
Location: payload-main/packages/payload/src/globals/endpoints/findOne.ts

```typescript
import { status as httpStatus } from 'http-status'

import type { PayloadHandler } from '../../config/types.js'

import { getRequestGlobal } from '../../utilities/getRequestEntity.js'
import { headersWithCors } from '../../utilities/headersWithCors.js'
import { isNumber } from '../../utilities/isNumber.js'
import { sanitizePopulateParam } from '../../utilities/sanitizePopulateParam.js'
import { sanitizeSelectParam } from '../../utilities/sanitizeSelectParam.js'
import { findOneOperation } from '../operations/findOne.js'

export const findOneHandler: PayloadHandler = async (req) => {
  const globalConfig = getRequestGlobal(req)
  const { data, searchParams } = req
  const depth = data ? data.depth : searchParams.get('depth')
  const flattenLocales = data
    ? data.flattenLocales
    : searchParams.has('flattenLocales')
      ? searchParams.get('flattenLocales') === 'true'
      : // flattenLocales should be undfined if not provided, so that the default (true) is applied in the operation
        undefined

  const result = await findOneOperation({
    slug: globalConfig.slug,
    data: data
      ? data?.data
      : searchParams.get('data')
        ? JSON.parse(searchParams.get('data') as string)
        : undefined,
    depth: isNumber(depth) ? Number(depth) : undefined,
    draft: data ? data.draft : searchParams.get('draft') === 'true',
    flattenLocales,
    globalConfig,
    populate: sanitizePopulateParam(req.query.populate),
    req,
    select: sanitizeSelectParam(req.query.select),
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
Location: payload-main/packages/payload/src/globals/endpoints/findVersionByID.ts

```typescript
import { status as httpStatus } from 'http-status'

import type { PayloadHandler } from '../../config/types.js'

import { getRequestGlobal } from '../../utilities/getRequestEntity.js'
import { headersWithCors } from '../../utilities/headersWithCors.js'
import { isNumber } from '../../utilities/isNumber.js'
import { sanitizePopulateParam } from '../../utilities/sanitizePopulateParam.js'
import { sanitizeSelectParam } from '../../utilities/sanitizeSelectParam.js'
import { findVersionByIDOperation } from '../operations/findVersionByID.js'

export const findVersionByIDHandler: PayloadHandler = async (req) => {
  const globalConfig = getRequestGlobal(req)
  const { searchParams } = req
  const depth = searchParams.get('depth')

  const result = await findVersionByIDOperation({
    id: req.routeParams!.id as string,
    depth: isNumber(depth) ? Number(depth) : undefined,
    globalConfig,
    populate: sanitizePopulateParam(req.query.populate),
    req,
    select: sanitizeSelectParam(req.query.select),
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
Location: payload-main/packages/payload/src/globals/endpoints/findVersions.ts

```typescript
import { status as httpStatus } from 'http-status'

import type { PayloadHandler } from '../../config/types.js'
import type { Where } from '../../types/index.js'

import { getRequestGlobal } from '../../utilities/getRequestEntity.js'
import { headersWithCors } from '../../utilities/headersWithCors.js'
import { isNumber } from '../../utilities/isNumber.js'
import { sanitizePopulateParam } from '../../utilities/sanitizePopulateParam.js'
import { sanitizeSelectParam } from '../../utilities/sanitizeSelectParam.js'
import { findVersionsOperation } from '../operations/findVersions.js'

export const findVersionsHandler: PayloadHandler = async (req) => {
  const globalConfig = getRequestGlobal(req)
  const { depth, limit, page, pagination, populate, select, sort, where } = req.query as {
    depth?: string
    limit?: string
    page?: string
    pagination?: string
    populate?: Record<string, unknown>
    select?: Record<string, unknown>
    sort?: string
    where?: Where
  }

  const result = await findVersionsOperation({
    depth: isNumber(depth) ? Number(depth) : undefined,
    globalConfig,
    limit: isNumber(limit) ? Number(limit) : undefined,
    page: isNumber(page) ? Number(page) : undefined,
    pagination: pagination === 'false' ? false : undefined,
    populate: sanitizePopulateParam(populate),
    req,
    select: sanitizeSelectParam(select),
    sort: typeof sort === 'string' ? sort.split(',') : undefined,
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
Location: payload-main/packages/payload/src/globals/endpoints/index.ts

```typescript
import type { Endpoint } from '../../config/types.js'

import { wrapInternalEndpoints } from '../../utilities/wrapInternalEndpoints.js'
import { docAccessHandler } from './docAccess.js'
import { findOneHandler } from './findOne.js'
import { findVersionByIDHandler } from './findVersionByID.js'
import { findVersionsHandler } from './findVersions.js'
import { restoreVersionHandler } from './restoreVersion.js'
import { updateHandler } from './update.js'

export const defaultGlobalEndpoints: Endpoint[] = wrapInternalEndpoints([
  {
    handler: docAccessHandler,
    method: 'post',
    path: '/access',
  },
  {
    handler: findOneHandler,
    method: 'get',
    path: '/',
  },
  {
    handler: findVersionByIDHandler,
    method: 'get',
    path: '/versions/:id',
  },
  {
    handler: findVersionsHandler,
    method: 'get',
    path: '/versions',
  },
  {
    handler: restoreVersionHandler,
    method: 'post',
    path: '/versions/:id',
  },
  {
    handler: updateHandler,
    method: 'post',
    path: '/',
  },
])
```

--------------------------------------------------------------------------------

---[FILE: restoreVersion.ts]---
Location: payload-main/packages/payload/src/globals/endpoints/restoreVersion.ts

```typescript
import { status as httpStatus } from 'http-status'

import type { PayloadHandler } from '../../config/types.js'

import { restoreVersionOperationGlobal, sanitizePopulateParam } from '../../index.js'
import { getRequestGlobal } from '../../utilities/getRequestEntity.js'
import { headersWithCors } from '../../utilities/headersWithCors.js'
import { isNumber } from '../../utilities/isNumber.js'

export const restoreVersionHandler: PayloadHandler = async (req) => {
  const globalConfig = getRequestGlobal(req)
  const { searchParams } = req
  const depth = searchParams.get('depth')
  const draft = searchParams.get('draft')

  const doc = await restoreVersionOperationGlobal({
    id: req.routeParams!.id as string,
    depth: isNumber(depth) ? Number(depth) : undefined,
    draft: draft === 'true' ? true : undefined,
    globalConfig,
    populate: sanitizePopulateParam(req.query.populate),
    req,
  })

  return Response.json(
    {
      doc,
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
Location: payload-main/packages/payload/src/globals/endpoints/update.ts

```typescript
import { status as httpStatus } from 'http-status'

import type { PayloadHandler } from '../../config/types.js'

import { getRequestGlobal } from '../../utilities/getRequestEntity.js'
import { headersWithCors } from '../../utilities/headersWithCors.js'
import { isNumber } from '../../utilities/isNumber.js'
import { sanitizePopulateParam } from '../../utilities/sanitizePopulateParam.js'
import { sanitizeSelectParam } from '../../utilities/sanitizeSelectParam.js'
import { updateOperation } from '../operations/update.js'

export const updateHandler: PayloadHandler = async (req) => {
  const globalConfig = getRequestGlobal(req)
  const { searchParams } = req
  const depth = searchParams.get('depth')
  const draft = searchParams.get('draft') === 'true'
  const autosave = searchParams.get('autosave') === 'true'
  const publishSpecificLocale = req.query.publishSpecificLocale as string | undefined

  const result = await updateOperation({
    slug: globalConfig.slug,
    autosave,
    data: req.data!,
    depth: isNumber(depth) ? Number(depth) : undefined,
    draft,
    globalConfig,
    populate: sanitizePopulateParam(req.query.populate),
    publishSpecificLocale,
    req,
    select: sanitizeSelectParam(req.query.select),
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
      message,
      result,
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

---[FILE: countGlobalVersions.ts]---
Location: payload-main/packages/payload/src/globals/operations/countGlobalVersions.ts

```typescript
import type { AccessResult } from '../../config/types.js'
import type { PayloadRequest, Where } from '../../types/index.js'

import { executeAccess } from '../../auth/executeAccess.js'
import { combineQueries } from '../../database/combineQueries.js'
import { validateQueryPaths } from '../../database/queryValidation/validateQueryPaths.js'
import {
  buildVersionGlobalFields,
  type GlobalSlug,
  type SanitizedGlobalConfig,
} from '../../index.js'
import { killTransaction } from '../../utilities/killTransaction.js'

export type Arguments = {
  disableErrors?: boolean
  global: SanitizedGlobalConfig
  overrideAccess?: boolean
  req?: PayloadRequest
  where?: Where
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const countGlobalVersionsOperation = async <TSlug extends GlobalSlug>(
  args: Arguments,
): Promise<{ totalDocs: number }> => {
  try {
    const { disableErrors, global, overrideAccess, where } = args
    const req = args.req!
    const { payload } = req

    // /////////////////////////////////////
    // beforeOperation - Global
    // /////////////////////////////////////

    if (global.hooks?.beforeOperation?.length) {
      for (const hook of global.hooks.beforeOperation) {
        args =
          (await hook({
            args,
            context: req.context,
            global,
            operation: 'countVersions',
            req,
          })) || args
      }
    }

    // /////////////////////////////////////
    // Access
    // /////////////////////////////////////

    let accessResult: AccessResult

    if (!overrideAccess) {
      accessResult = await executeAccess({ disableErrors, req }, global.access.readVersions)

      // If errors are disabled, and access returns false, return empty results
      if (accessResult === false) {
        return {
          totalDocs: 0,
        }
      }
    }

    const fullWhere = combineQueries(where!, accessResult!)

    const versionFields = buildVersionGlobalFields(payload.config, global, true)

    await validateQueryPaths({
      globalConfig: global,
      overrideAccess: overrideAccess!,
      req,
      versionFields,
      where: where!,
    })

    const result = await payload.db.countGlobalVersions({
      global: global.slug,
      req,
      where: fullWhere,
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

---[FILE: docAccess.ts]---
Location: payload-main/packages/payload/src/globals/operations/docAccess.ts

```typescript
import type { SanitizedGlobalPermission } from '../../auth/index.js'
import type { AllOperations, JsonObject, PayloadRequest } from '../../types/index.js'
import type { SanitizedGlobalConfig } from '../config/types.js'

import { commitTransaction } from '../../utilities/commitTransaction.js'
import { getEntityPermissions } from '../../utilities/getEntityPermissions/getEntityPermissions.js'
import { initTransaction } from '../../utilities/initTransaction.js'
import { killTransaction } from '../../utilities/killTransaction.js'
import { sanitizePermissions } from '../../utilities/sanitizePermissions.js'

type Arguments = {
  /**
   * If the document data is passed, it will be used to check access instead of fetching the document from the database.
   */
  data?: JsonObject
  globalConfig: SanitizedGlobalConfig
  req: PayloadRequest
}

export const docAccessOperation = async (args: Arguments): Promise<SanitizedGlobalPermission> => {
  const { data, globalConfig, req } = args

  const globalOperations: AllOperations[] = ['read', 'update']

  if (globalConfig.versions) {
    globalOperations.push('readVersions')
  }

  try {
    const result = await getEntityPermissions({
      id: undefined,
      blockReferencesPermissions: {},
      data,
      entity: globalConfig,
      entityType: 'global',
      fetchData: true,
      operations: globalOperations,
      req,
    })

    const sanitizedPermissions = sanitizePermissions({
      globals: {
        [globalConfig.slug]: result,
      },
    })

    const globalPermissions = sanitizedPermissions?.globals?.[globalConfig.slug]
    return globalPermissions ?? { fields: {} }
  } catch (e: unknown) {
    await killTransaction(req)
    throw e
  }
}
```

--------------------------------------------------------------------------------

---[FILE: findOne.ts]---
Location: payload-main/packages/payload/src/globals/operations/findOne.ts

```typescript
import type { AccessResult } from '../../config/types.js'
import type {
  JsonObject,
  PayloadRequest,
  PopulateType,
  SelectType,
  Where,
} from '../../types/index.js'
import type { SanitizedGlobalConfig } from '../config/types.js'

import { executeAccess } from '../../auth/executeAccess.js'
import { NotFound } from '../../errors/NotFound.js'
import { afterRead, type AfterReadArgs } from '../../fields/hooks/afterRead/index.js'
import { lockedDocumentsCollectionSlug } from '../../locked-documents/config.js'
import { getSelectMode } from '../../utilities/getSelectMode.js'
import { hasDraftsEnabled } from '../../utilities/getVersionsConfig.js'
import { killTransaction } from '../../utilities/killTransaction.js'
import { sanitizeSelect } from '../../utilities/sanitizeSelect.js'
import { replaceWithDraftIfAvailable } from '../../versions/drafts/replaceWithDraftIfAvailable.js'

export type GlobalFindOneArgs = {
  /**
   * You may pass the document data directly which will skip the `db.findOne` database query.
   * This is useful if you want to use this endpoint solely for running hooks and populating data.
   */
  data?: Record<string, unknown>
  depth?: number
  draft?: boolean
  globalConfig: SanitizedGlobalConfig
  includeLockStatus?: boolean
  overrideAccess?: boolean
  populate?: PopulateType
  req: PayloadRequest
  select?: SelectType
  showHiddenFields?: boolean
  slug: string
} & Pick<AfterReadArgs<JsonObject>, 'flattenLocales'>

export const findOneOperation = async <T extends Record<string, unknown>>(
  args: GlobalFindOneArgs,
): Promise<T> => {
  const {
    slug,
    depth,
    draft: replaceWithVersion = false,
    flattenLocales,
    globalConfig,
    includeLockStatus,
    overrideAccess = false,
    populate,
    req: { fallbackLocale, locale },
    req,
    select: incomingSelect,
    showHiddenFields,
  } = args

  try {
    // /////////////////////////////////////
    // beforeOperation - Global
    // /////////////////////////////////////

    if (globalConfig.hooks?.beforeOperation?.length) {
      for (const hook of globalConfig.hooks.beforeOperation) {
        args =
          (await hook({
            args,
            context: args.req.context,
            global: globalConfig,
            operation: 'read',
            req: args.req,
          })) || args
      }
    }

    // /////////////////////////////////////
    // Retrieve and execute access
    // /////////////////////////////////////

    let accessResult!: AccessResult

    if (!overrideAccess) {
      accessResult = await executeAccess({ req }, globalConfig.access.read)
    }

    if (accessResult === false) {
      throw new NotFound(req.t)
    }

    const select = sanitizeSelect({
      fields: globalConfig.flattenedFields,
      forceSelect: globalConfig.forceSelect,
      select: incomingSelect,
    })

    // /////////////////////////////////////
    // Perform database operation
    // /////////////////////////////////////

    const docFromDB = await req.payload.db.findGlobal({
      slug,
      locale: locale!,
      req,
      select,
      where: overrideAccess ? undefined : (accessResult as Where),
    })

    // Check if no document was returned (Postgres returns {} instead of null)
    const hasDoc = docFromDB && Object.keys(docFromDB).length > 0

    if (!hasDoc && !args.data && !overrideAccess && accessResult !== true) {
      return {} as any
    }

    let doc = (args.data as any) ?? (hasDoc ? docFromDB : null) ?? {}

    // /////////////////////////////////////
    // Include Lock Status if required
    // /////////////////////////////////////
    if (includeLockStatus && slug) {
      let lockStatus: JsonObject | null = null

      try {
        const lockDocumentsProp = globalConfig?.lockDocuments

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
                globalSlug: {
                  equals: slug,
                },
              },
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

      doc._isLocked = !!lockStatus
      doc._userEditing = lockStatus?.user?.value ?? null
    }

    // /////////////////////////////////////
    // Replace document with draft if available
    // /////////////////////////////////////

    if (replaceWithVersion && hasDraftsEnabled(globalConfig)) {
      doc = await replaceWithDraftIfAvailable({
        accessResult,
        doc,
        entity: globalConfig,
        entityType: 'global',
        overrideAccess,
        req,
        select,
      })
    }

    // /////////////////////////////////////
    // Execute before global hook
    // /////////////////////////////////////

    if (globalConfig.hooks?.beforeRead?.length) {
      for (const hook of globalConfig.hooks.beforeRead) {
        doc =
          (await hook({
            context: req.context,
            doc,
            global: globalConfig,
            req,
          })) || doc
      }
    }

    // /////////////////////////////////////
    // Execute globalType field if not selected
    // /////////////////////////////////////
    if (select && doc.globalType) {
      const selectMode = getSelectMode(select)
      if (
        (selectMode === 'include' && !select['globalType']) ||
        (selectMode === 'exclude' && select['globalType'] === false)
      ) {
        delete doc['globalType']
      }
    }

    // /////////////////////////////////////
    // Execute field-level hooks and access
    // /////////////////////////////////////

    doc = await afterRead({
      collection: null,
      context: req.context,
      depth: depth!,
      doc,
      draft: replaceWithVersion,
      fallbackLocale: fallbackLocale!,
      flattenLocales,
      global: globalConfig,
      locale: locale!,
      overrideAccess,
      populate,
      req,
      select,
      showHiddenFields: showHiddenFields!,
    })

    // /////////////////////////////////////
    // Execute after global hook
    // /////////////////////////////////////

    if (globalConfig.hooks?.afterRead?.length) {
      for (const hook of globalConfig.hooks.afterRead) {
        doc =
          (await hook({
            context: req.context,
            doc,
            global: globalConfig,
            req,
          })) || doc
      }
    }

    // /////////////////////////////////////
    // Return results
    // /////////////////////////////////////

    return doc
  } catch (error: unknown) {
    await killTransaction(req)
    throw error
  }
}
```

--------------------------------------------------------------------------------

---[FILE: findVersionByID.ts]---
Location: payload-main/packages/payload/src/globals/operations/findVersionByID.ts

```typescript
import type { FindGlobalVersionsArgs } from '../../database/types.js'
import type { PayloadRequest, PopulateType, SelectType } from '../../types/index.js'
import type { TypeWithVersion } from '../../versions/types.js'
import type { SanitizedGlobalConfig } from '../config/types.js'

import { executeAccess } from '../../auth/executeAccess.js'
import { combineQueries } from '../../database/combineQueries.js'
import { Forbidden, NotFound } from '../../errors/index.js'
import { afterRead } from '../../fields/hooks/afterRead/index.js'
import { deepCopyObjectSimple } from '../../utilities/deepCopyObject.js'
import { killTransaction } from '../../utilities/killTransaction.js'
import { sanitizeSelect } from '../../utilities/sanitizeSelect.js'
import { buildVersionGlobalFields } from '../../versions/buildGlobalFields.js'
import { getQueryDraftsSelect } from '../../versions/drafts/getQueryDraftsSelect.js'

export type Arguments = {
  currentDepth?: number
  depth?: number
  disableErrors?: boolean
  globalConfig: SanitizedGlobalConfig
  id: number | string
  overrideAccess?: boolean
  populate?: PopulateType
  req: PayloadRequest
  select?: SelectType
  showHiddenFields?: boolean
}

export const findVersionByIDOperation = async <T extends TypeWithVersion<T> = any>(
  args: Arguments,
): Promise<T> => {
  const {
    id,
    currentDepth,
    depth,
    disableErrors,
    globalConfig,
    overrideAccess,
    populate,
    req: { fallbackLocale, locale, payload },
    req,
    select: incomingSelect,
    showHiddenFields,
  } = args

  try {
    // /////////////////////////////////////
    // Access
    // /////////////////////////////////////

    const accessResults = !overrideAccess
      ? await executeAccess({ id, disableErrors, req }, globalConfig.access.readVersions)
      : true

    // If errors are disabled, and access returns false, return null
    if (accessResults === false) {
      return null!
    }

    const hasWhereAccess = typeof accessResults === 'object'

    const select = sanitizeSelect({
      fields: buildVersionGlobalFields(payload.config, globalConfig, true),
      forceSelect: getQueryDraftsSelect({ select: globalConfig.forceSelect }),
      select: incomingSelect,
      versions: true,
    })

    const findGlobalVersionsArgs: FindGlobalVersionsArgs = {
      global: globalConfig.slug,
      limit: 1,
      locale: locale!,
      req,
      select,
      where: combineQueries({ id: { equals: id } }, accessResults),
    }

    // /////////////////////////////////////
    // Find by ID
    // /////////////////////////////////////

    if (!findGlobalVersionsArgs.where?.and?.[0]?.id) {
      throw new NotFound(req.t)
    }

    const { docs: results } = await payload.db.findGlobalVersions(findGlobalVersionsArgs)
    if (!results || results?.length === 0) {
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

    // Clone the result - it may have come back memoized
    let result: any = deepCopyObjectSimple(results[0])

    if (!result.version) {
      result.version = {}
    }

    // Patch globalType onto version doc
    result.version.globalType = globalConfig.slug

    // /////////////////////////////////////
    // beforeRead - Collection
    // /////////////////////////////////////

    if (globalConfig.hooks?.beforeRead?.length) {
      for (const hook of globalConfig.hooks.beforeRead) {
        result =
          (await hook({
            context: req.context,
            doc: result.version,
            global: globalConfig,
            req,
          })) || result.version
      }
    }

    // /////////////////////////////////////
    // afterRead - Fields
    // /////////////////////////////////////

    result.version = await afterRead({
      collection: null,
      context: req.context,
      currentDepth,
      depth: depth!,
      doc: result.version,
      draft: undefined!,
      fallbackLocale: fallbackLocale!,
      global: globalConfig,
      locale: locale!,
      overrideAccess: overrideAccess!,
      populate,
      req,
      select: typeof select?.version === 'object' ? select.version : undefined,
      showHiddenFields: showHiddenFields!,
    })

    // /////////////////////////////////////
    // afterRead - Global
    // /////////////////////////////////////

    if (globalConfig.hooks?.afterRead?.length) {
      for (const hook of globalConfig.hooks.afterRead) {
        result.version =
          (await hook({
            context: req.context,
            doc: result.version,
            global: globalConfig,
            query: findGlobalVersionsArgs.where,
            req,
          })) || result.version
      }
    }

    return result
  } catch (error: unknown) {
    await killTransaction(req)
    throw error
  }
}
```

--------------------------------------------------------------------------------

````
