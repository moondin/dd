---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 190
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 190 of 695)

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

---[FILE: update.ts]---
Location: payload-main/packages/payload/src/collections/operations/utilities/update.ts

```typescript
import type { DeepPartial } from 'ts-essentials'

import type { Args } from '../../../fields/hooks/beforeChange/index.js'
import type {
  AccessResult,
  CollectionSlug,
  FileToSave,
  SanitizedConfig,
  TypedFallbackLocale,
} from '../../../index.js'
import type {
  JsonObject,
  Payload,
  PayloadRequest,
  PopulateType,
  SelectType,
  TransformCollectionWithSelect,
} from '../../../types/index.js'
import type {
  DataFromCollectionSlug,
  SanitizedCollectionConfig,
  SelectFromCollectionSlug,
  TypeWithID,
} from '../../config/types.js'

import { ensureUsernameOrEmail } from '../../../auth/ensureUsernameOrEmail.js'
import { generatePasswordSaltHash } from '../../../auth/strategies/local/generatePasswordSaltHash.js'
import { combineQueries } from '../../../database/combineQueries.js'
import { afterChange } from '../../../fields/hooks/afterChange/index.js'
import { afterRead } from '../../../fields/hooks/afterRead/index.js'
import { beforeChange } from '../../../fields/hooks/beforeChange/index.js'
import { beforeValidate } from '../../../fields/hooks/beforeValidate/index.js'
import { deepCopyObjectSimple, saveVersion } from '../../../index.js'
import { deleteAssociatedFiles } from '../../../uploads/deleteAssociatedFiles.js'
import { uploadFiles } from '../../../uploads/uploadFiles.js'
import { checkDocumentLockStatus } from '../../../utilities/checkDocumentLockStatus.js'
import {
  hasDraftsEnabled,
  hasDraftValidationEnabled,
} from '../../../utilities/getVersionsConfig.js'
import { getLatestCollectionVersion } from '../../../versions/getLatestCollectionVersion.js'

export type SharedUpdateDocumentArgs<TSlug extends CollectionSlug> = {
  accessResults: AccessResult
  autosave: boolean
  collectionConfig: SanitizedCollectionConfig
  config: SanitizedConfig
  data: DeepPartial<DataFromCollectionSlug<TSlug>>
  depth: number
  docWithLocales: JsonObject & TypeWithID
  draftArg: boolean
  fallbackLocale: TypedFallbackLocale
  filesToUpload: FileToSave[]
  id: number | string
  locale: string
  overrideAccess: boolean
  overrideLock: boolean
  payload: Payload
  populate?: PopulateType
  publishSpecificLocale?: string
  req: PayloadRequest
  select: SelectType
  showHiddenFields: boolean
}

/**
 * This function is used to update a document in the DB and return the result.
 *
 * It runs the following hooks in order:
 * - beforeValidate - Fields
 * - beforeValidate - Collection
 * - beforeChange - Collection
 * - beforeChange - Fields
 * - afterRead - Fields
 * - afterRead - Collection
 * - afterChange - Fields
 * - afterChange - Collection
 */
export const updateDocument = async <
  TSlug extends CollectionSlug,
  TSelect extends SelectFromCollectionSlug<TSlug> = SelectType,
>({
  id,
  accessResults,
  autosave,
  collectionConfig,
  config,
  data,
  depth,
  docWithLocales,
  draftArg,
  fallbackLocale,
  filesToUpload,
  locale,
  overrideAccess,
  overrideLock,
  payload,
  populate,
  publishSpecificLocale,
  req,
  select,
  showHiddenFields,
}: SharedUpdateDocumentArgs<TSlug>): Promise<TransformCollectionWithSelect<TSlug, TSelect>> => {
  const password = data?.password
  const isSavingDraft =
    Boolean(draftArg && hasDraftsEnabled(collectionConfig)) && data._status !== 'published'
  const shouldSavePassword = Boolean(
    password &&
      collectionConfig.auth &&
      (!collectionConfig.auth.disableLocalStrategy ||
        (typeof collectionConfig.auth.disableLocalStrategy === 'object' &&
          collectionConfig.auth.disableLocalStrategy.enableFields)) &&
      !isSavingDraft,
  )

  // /////////////////////////////////////
  // Handle potentially locked documents
  // /////////////////////////////////////

  await checkDocumentLockStatus({
    id,
    collectionSlug: collectionConfig.slug,
    lockErrorMessage: `Document with ID ${id} is currently locked by another user and cannot be updated.`,
    overrideLock,
    req,
  })

  const originalDoc = await afterRead({
    collection: collectionConfig,
    context: req.context,
    depth: 0,
    doc: deepCopyObjectSimple(docWithLocales),
    draft: draftArg,
    fallbackLocale: id ? null : fallbackLocale,
    global: null,
    locale,
    overrideAccess: true,
    req,
    showHiddenFields: true,
  })

  const isRestoringDraftFromTrash = Boolean(originalDoc?.deletedAt) && data?._status !== 'published'

  if (collectionConfig.auth) {
    ensureUsernameOrEmail<TSlug>({
      authOptions: collectionConfig.auth,
      collectionSlug: collectionConfig.slug,
      data,
      operation: 'update',
      originalDoc,
      req,
    })
  }

  // /////////////////////////////////////
  // Delete any associated files
  // /////////////////////////////////////

  await deleteAssociatedFiles({
    collectionConfig,
    config,
    doc: docWithLocales,
    files: filesToUpload,
    overrideDelete: false,
    req,
  })

  // /////////////////////////////////////
  // beforeValidate - Fields
  // /////////////////////////////////////

  data = await beforeValidate<DeepPartial<DataFromCollectionSlug<TSlug>>>({
    id,
    collection: collectionConfig,
    context: req.context,
    data,
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
  // Write files to local storage
  // /////////////////////////////////////

  if (!collectionConfig.upload.disableLocalStorage) {
    await uploadFiles(payload, filesToUpload, req)
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

  const beforeChangeArgs: Args<DataFromCollectionSlug<TSlug>> = {
    id,
    collection: collectionConfig,
    context: req.context,
    data: { ...data, id },
    doc: originalDoc,
    docWithLocales,
    global: null,
    operation: 'update',
    overrideAccess,
    req,
    skipValidation:
      // only skip validation for drafts when draft validation is false
      (isSavingDraft && !hasDraftValidationEnabled(collectionConfig)) ||
      // Skip validation for trash operations since they're just metadata updates
      (collectionConfig.trash && (Boolean(data?.deletedAt) || isRestoringDraftFromTrash)),
  }

  let result: JsonObject = await beforeChange(beforeChangeArgs)
  let snapshotToSave: JsonObject | undefined

  if (config.localization && collectionConfig.versions) {
    if (publishSpecificLocale) {
      snapshotToSave = deepCopyObjectSimple(result)

      // the published data to save to the main document
      result = await beforeChange({
        ...beforeChangeArgs,
        docWithLocales:
          (await getLatestCollectionVersion({
            id,
            config: collectionConfig,
            payload,
            published: true,
            query: {
              collection: collectionConfig.slug,
              locale,
              req,
              where: combineQueries({ id: { equals: id } }, accessResults),
            },
            req,
          })) || {},
      })
    }
  }

  // /////////////////////////////////////
  // Handle potential password update
  // /////////////////////////////////////

  const dataToUpdate: JsonObject = { ...result }

  if (shouldSavePassword && typeof password === 'string') {
    const { hash, salt } = await generatePasswordSaltHash({
      collection: collectionConfig,
      password,
      req,
    })
    dataToUpdate.salt = salt
    dataToUpdate.hash = hash
    delete dataToUpdate.password
    delete data.password
  }

  // /////////////////////////////////////
  // Update
  // /////////////////////////////////////

  if (!isSavingDraft) {
    // Ensure updatedAt date is always updated
    dataToUpdate.updatedAt = new Date().toISOString()
    result = await req.payload.db.updateOne({
      id,
      collection: collectionConfig.slug,
      data: dataToUpdate,
      locale,
      req,
    })
  }

  // /////////////////////////////////////
  // Create version
  // /////////////////////////////////////

  if (collectionConfig.versions) {
    result = await saveVersion({
      id,
      autosave,
      collection: collectionConfig,
      docWithLocales: result,
      draft: isSavingDraft,
      operation: 'update',
      payload,
      publishSpecificLocale,
      req,
      snapshot: snapshotToSave,
    })
  }

  // /////////////////////////////////////
  // afterRead - Fields
  // /////////////////////////////////////

  result = await afterRead({
    collection: collectionConfig,
    context: req.context,
    depth,
    doc: result,
    draft: draftArg,
    fallbackLocale,
    global: null,
    locale,
    overrideAccess,
    populate,
    req,
    select,
    showHiddenFields,
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
    operation: 'update',
    previousDoc: originalDoc,
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
          operation: 'update',
          previousDoc: originalDoc,
          req,
        })) || result
    }
  }

  return result as TransformCollectionWithSelect<TSlug, TSelect>
}
```

--------------------------------------------------------------------------------

---[FILE: build.ts]---
Location: payload-main/packages/payload/src/config/build.ts

```typescript
import type { Config, SanitizedConfig } from './types.js'

import { sanitizeConfig } from './sanitize.js'

/**
 * @description Builds and validates Payload configuration
 * @param config Payload Config
 * @returns Built and sanitized Payload Config
 */
export async function buildConfig(config: Config): Promise<SanitizedConfig> {
  if (Array.isArray(config.plugins)) {
    let configAfterPlugins = config
    for (const plugin of config.plugins) {
      configAfterPlugins = await plugin(configAfterPlugins)
    }
    return await sanitizeConfig(configAfterPlugins)
  }

  return await sanitizeConfig(config)
}
```

--------------------------------------------------------------------------------

---[FILE: client.ts]---
Location: payload-main/packages/payload/src/config/client.ts

```typescript
import type { I18nClient } from '@payloadcms/translations'
import type { DeepPartial } from 'ts-essentials'

import type { ImportMap } from '../bin/generateImportMap/index.js'
import type { ClientBlock } from '../fields/config/types.js'
import type { BlockSlug, TypedUser } from '../index.js'
import type {
  RootLivePreviewConfig,
  SanitizedConfig,
  ServerOnlyLivePreviewProperties,
} from './types.js'

import {
  type ClientCollectionConfig,
  createClientCollectionConfigs,
} from '../collections/config/client.js'
import { createClientBlocks } from '../fields/config/client.js'
import { type ClientGlobalConfig, createClientGlobalConfigs } from '../globals/config/client.js'

export type ServerOnlyRootProperties = keyof Pick<
  SanitizedConfig,
  | 'bin'
  | 'cors'
  | 'csrf'
  | 'custom'
  | 'db'
  | 'editor'
  | 'email'
  | 'endpoints'
  | 'graphQL'
  | 'hooks'
  | 'i18n'
  | 'jobs'
  | 'kv'
  | 'logger'
  | 'onInit'
  | 'plugins'
  | 'queryPresets'
  | 'secret'
  | 'sharp'
  | 'typescript'
>

export type ServerOnlyRootAdminProperties = keyof Pick<SanitizedConfig['admin'], 'components'>

export type ClientConfig = {
  admin: {
    livePreview?: Omit<RootLivePreviewConfig, ServerOnlyLivePreviewProperties>
  } & Omit<SanitizedConfig['admin'], 'components' | 'dependencies' | 'livePreview'>
  blocks: ClientBlock[]
  blocksMap: Record<BlockSlug, ClientBlock>
  collections: ClientCollectionConfig[]
  custom?: Record<string, any>
  globals: ClientGlobalConfig[]
  unauthenticated?: boolean
} & Omit<SanitizedConfig, 'admin' | 'collections' | 'globals' | 'i18n' | ServerOnlyRootProperties>

export type UnauthenticatedClientConfig = {
  admin: {
    routes: ClientConfig['admin']['routes']
    user: ClientConfig['admin']['user']
  }
  collections: [
    {
      auth: ClientCollectionConfig['auth']
      slug: string
    },
  ]
  globals: []
  routes: ClientConfig['routes']
  serverURL: ClientConfig['serverURL']
  unauthenticated: true
}

export const serverOnlyAdminConfigProperties: readonly Partial<ServerOnlyRootAdminProperties>[] = []

export const serverOnlyConfigProperties: readonly Partial<ServerOnlyRootProperties>[] = [
  'endpoints',
  'db',
  'editor',
  'plugins',
  'sharp',
  'onInit',
  'secret',
  'hooks',
  'bin',
  'i18n',
  'typescript',
  'cors',
  'csrf',
  'email',
  'custom',
  'graphQL',
  'jobs',
  'logger',
  'kv',
  'queryPresets',
  // `admin`, `onInit`, `localization`, `collections`, and `globals` are all handled separately
]

export type CreateClientConfigArgs = {
  config: SanitizedConfig
  i18n: I18nClient
  importMap: ImportMap
  /**
   * If unauthenticated, the client config will omit some sensitive properties
   * such as field schemas, etc. This is useful for login and error pages where
   * the page source should not contain this information.
   *
   * For example, allow `true` to generate a client config for the "create first user" page
   * where there is no user yet, but the config should still be complete.
   */
  user: true | TypedUser
}

export const createUnauthenticatedClientConfig = ({
  clientConfig,
}: {
  /**
   * Send the previously generated client config to share memory when applicable.
   * E.g. the admin-enabled collection config can reference the existing collection rather than creating a new object.
   */
  clientConfig: ClientConfig
}): UnauthenticatedClientConfig => {
  /**
   * To share memory, find the admin user collection from the existing client config.
   */
  const adminUserCollection = clientConfig.collections.find(
    ({ slug }) => slug === clientConfig.admin.user,
  )!

  return {
    admin: {
      routes: clientConfig.admin.routes,
      user: clientConfig.admin.user,
    },
    collections: [
      {
        slug: adminUserCollection.slug,
        auth: adminUserCollection.auth,
      },
    ],
    globals: [],
    routes: clientConfig.routes,
    serverURL: clientConfig.serverURL,
    unauthenticated: true,
  }
}

export const createClientConfig = ({
  config,
  i18n,
  importMap,
}: CreateClientConfigArgs): ClientConfig => {
  const clientConfig = {} as DeepPartial<ClientConfig>

  for (const key in config) {
    if (serverOnlyConfigProperties.includes(key as any)) {
      continue
    }

    switch (key) {
      case 'admin':
        clientConfig.admin = {
          autoLogin: config.admin.autoLogin,
          autoRefresh: config.admin.autoRefresh,
          avatar: config.admin.avatar,
          custom: config.admin.custom,
          dateFormat: config.admin.dateFormat,
          importMap: config.admin.importMap,
          meta: config.admin.meta,
          routes: config.admin.routes,
          theme: config.admin.theme,
          timezones: config.admin.timezones,
          toast: config.admin.toast,
          user: config.admin.user,
        }

        if (config.admin.livePreview) {
          clientConfig.admin.livePreview = {}

          if (config.admin.livePreview.breakpoints) {
            clientConfig.admin.livePreview.breakpoints = config.admin.livePreview.breakpoints
          }

          if (config.admin.livePreview.collections) {
            clientConfig.admin.livePreview.collections = config.admin.livePreview.collections
          }

          if (config.admin.livePreview.globals) {
            clientConfig.admin.livePreview.globals = config.admin.livePreview.globals
          }
        }

        break

      case 'blocks': {
        ;(clientConfig.blocks as ClientBlock[]) = createClientBlocks({
          blocks: config.blocks!,
          defaultIDType: config.db.defaultIDType,
          i18n,
          importMap,
        }).filter((block) => typeof block !== 'string') as ClientBlock[]

        clientConfig.blocksMap = {}
        if (clientConfig.blocks?.length) {
          for (const block of clientConfig.blocks) {
            if (!block?.slug) {
              continue
            }

            clientConfig.blocksMap[block.slug] = block as ClientBlock
          }
        }

        break
      }

      case 'collections':
        ;(clientConfig.collections as ClientCollectionConfig[]) = createClientCollectionConfigs({
          collections: config.collections,
          defaultIDType: config.db.defaultIDType,
          i18n,
          importMap,
        })

        break

      case 'folders':
        if (config.folders) {
          clientConfig.folders = {
            slug: config.folders.slug,
            browseByFolder: config.folders.browseByFolder,
            debug: config.folders.debug,
            fieldName: config.folders.fieldName,
          }
        }

        break

      case 'globals':
        ;(clientConfig.globals as ClientGlobalConfig[]) = createClientGlobalConfigs({
          defaultIDType: config.db.defaultIDType,
          globals: config.globals,
          i18n,
          importMap,
        })

        break

      case 'localization':
        if (typeof config.localization === 'object' && config.localization) {
          clientConfig.localization = {}

          if (config.localization.defaultLocale) {
            clientConfig.localization.defaultLocale = config.localization.defaultLocale
          }

          if (config.localization.defaultLocalePublishOption) {
            clientConfig.localization.defaultLocalePublishOption =
              config.localization.defaultLocalePublishOption
          }

          if (config.localization.fallback) {
            clientConfig.localization.fallback = config.localization.fallback
          }

          if (config.localization.localeCodes) {
            clientConfig.localization.localeCodes = config.localization.localeCodes
          }

          if (config.localization.locales) {
            clientConfig.localization.locales = []

            for (const locale of config.localization.locales) {
              if (locale) {
                const clientLocale: Partial<(typeof config.localization.locales)[0]> = {}

                if (locale.code) {
                  clientLocale.code = locale.code
                }

                if (locale.fallbackLocale) {
                  clientLocale.fallbackLocale = locale.fallbackLocale
                }

                if (locale.label) {
                  clientLocale.label = locale.label
                }

                if (locale.rtl) {
                  clientLocale.rtl = locale.rtl
                }

                clientConfig.localization.locales.push(clientLocale)
              }
            }
          }
        }

        break

      default:
        ;(clientConfig as any)[key] = config[key as keyof SanitizedConfig]
    }
  }

  return clientConfig as ClientConfig
}
```

--------------------------------------------------------------------------------

---[FILE: defaults.ts]---
Location: payload-main/packages/payload/src/config/defaults.ts

```typescript
import type { JobsConfig } from '../queues/config/types/index.js'
import type { Config } from './types.js'

import { defaultAccess } from '../auth/defaultAccess.js'
import { foldersSlug, parentFolderFieldName } from '../folders/constants.js'
import { databaseKVAdapter } from '../kv/adapters/DatabaseKVAdapter.js'

/**
 * @deprecated - remove in 4.0. This is error-prone, as mutating this object will affect any objects that use the defaults as a base.
 */
export const defaults: Omit<Config, 'db' | 'editor' | 'secret'> = {
  admin: {
    avatar: 'gravatar',
    components: {},
    custom: {},
    dateFormat: 'MMMM do yyyy, h:mm a',
    dependencies: {},
    importMap: {
      baseDir: `${typeof process?.cwd === 'function' ? process.cwd() : ''}`,
    },
    meta: {
      defaultOGImageType: 'dynamic',
      robots: 'noindex, nofollow',
      titleSuffix: '- Payload',
    },
    routes: {
      account: '/account',
      browseByFolder: '/browse-by-folder',
      createFirstUser: '/create-first-user',
      forgot: '/forgot',
      inactivity: '/logout-inactivity',
      login: '/login',
      logout: '/logout',
      reset: '/reset',
      unauthorized: '/unauthorized',
    },
    theme: 'all',
  },
  auth: {
    jwtOrder: ['JWT', 'Bearer', 'cookie'],
  },
  bin: [],
  collections: [],
  cookiePrefix: 'payload',
  cors: [],
  csrf: [],
  custom: {},
  defaultDepth: 2,
  defaultMaxTextLength: 40000,
  endpoints: [],
  globals: [],
  graphQL: {
    disablePlaygroundInProduction: true,
    maxComplexity: 1000,
    schemaOutputFile: `${typeof process?.cwd === 'function' ? process.cwd() : ''}/schema.graphql`,
  },
  hooks: {},
  i18n: {},
  jobs: {
    access: {
      cancel: defaultAccess,
      queue: defaultAccess,
      run: defaultAccess,
    },
    deleteJobOnComplete: true,
    depth: 0,
  } as JobsConfig,

  localization: false,
  maxDepth: 10,
  routes: {
    admin: '/admin',
    api: '/api',
    graphQL: '/graphql',
    graphQLPlayground: '/graphql-playground',
  },
  serverURL: '',
  telemetry: true,
  typescript: {
    autoGenerate: true,
    outputFile: `${typeof process?.cwd === 'function' ? process.cwd() : ''}/payload-types.ts`,
  },
  upload: {},
}

export const addDefaultsToConfig = (config: Config): Config => {
  config.admin = {
    avatar: 'gravatar',
    components: {},
    custom: {},
    dateFormat: 'MMMM do yyyy, h:mm a',
    dependencies: {},
    theme: 'all',
    ...(config.admin || {}),
    importMap: {
      baseDir: `${typeof process?.cwd === 'function' ? process.cwd() : ''}`,
      ...(config?.admin?.importMap || {}),
    },
    meta: {
      defaultOGImageType: 'dynamic',
      robots: 'noindex, nofollow',
      titleSuffix: '- Payload',
      ...(config?.admin?.meta || {}),
    },
    routes: {
      account: '/account',
      browseByFolder: '/browse-by-folder',
      createFirstUser: '/create-first-user',
      forgot: '/forgot',
      inactivity: '/logout-inactivity',
      login: '/login',
      logout: '/logout',
      reset: '/reset',
      unauthorized: '/unauthorized',
      ...(config?.admin?.routes || {}),
    },
  }

  config.bin = config.bin ?? []
  config.collections = config.collections ?? []
  config.cookiePrefix = config.cookiePrefix ?? 'payload'
  config.cors = config.cors ?? []
  config.csrf = config.csrf ?? []
  config.custom = config.custom ?? {}
  config.defaultDepth = config.defaultDepth ?? 2
  config.defaultMaxTextLength = config.defaultMaxTextLength ?? 40000
  config.endpoints = config.endpoints ?? []
  config.globals = config.globals ?? []
  config.graphQL = {
    disableIntrospectionInProduction: true,
    disablePlaygroundInProduction: true,
    maxComplexity: 1000,
    schemaOutputFile: `${typeof process?.cwd === 'function' ? process.cwd() : ''}/schema.graphql`,
    ...(config.graphQL || {}),
  }
  config.hooks = config.hooks ?? {}
  config.i18n = config.i18n ?? {}
  config.jobs = {
    deleteJobOnComplete: true,
    depth: 0,
    ...(config.jobs || {}),
    access: {
      cancel: defaultAccess,
      queue: defaultAccess,
      run: defaultAccess,
      ...(config.jobs?.access || {}),
    },
  } as JobsConfig
  config.localization = config.localization ?? false
  config.maxDepth = config.maxDepth ?? 10
  config.routes = {
    admin: '/admin',
    api: (process.env.NEXT_BASE_PATH ?? '') + '/api',
    graphQL: '/graphql',
    graphQLPlayground: '/graphql-playground',
    ...(config.routes || {}),
  }
  config.serverURL = config.serverURL ?? ''
  config.telemetry = config.telemetry ?? true
  config.typescript = {
    autoGenerate: true,
    outputFile: `${typeof process?.cwd === 'function' ? process.cwd() : ''}/payload-types.ts`,
    ...(config.typescript || {}),
  }
  config.upload = config.upload ?? {}

  config.auth = {
    jwtOrder: ['JWT', 'Bearer', 'cookie'],
    ...(config.auth || {}),
  }

  config.kv = config.kv ?? databaseKVAdapter()

  if (config.kv?.kvCollection) {
    config.collections.push(config.kv.kvCollection)
  }

  if (
    config.folders !== false &&
    config.collections.some((collection) => Boolean(collection.folders))
  ) {
    config.folders = {
      slug: config.folders?.slug ?? foldersSlug,
      browseByFolder: config.folders?.browseByFolder ?? true,
      collectionOverrides: config.folders?.collectionOverrides || undefined,
      collectionSpecific: config.folders?.collectionSpecific ?? true,
      debug: config.folders?.debug ?? false,
      fieldName: config.folders?.fieldName ?? parentFolderFieldName,
    }
  } else {
    config.folders = false
  }

  return config
}
```

--------------------------------------------------------------------------------

---[FILE: find.ts]---
Location: payload-main/packages/payload/src/config/find.ts

```typescript
import { getTsconfig } from 'get-tsconfig'
import path from 'path'

import { findUpSync } from '../utilities/findUp.js'

/**
 * List of all filenames to detect as a Payload configuration file.
 */
export const payloadConfigFileNames = ['payload.config.js', 'payload.config.ts']

/**
 * Returns the source and output paths from the nearest tsconfig.json file.
 * If no tsconfig.json file is found, returns the current working directory.
 * @returns An object containing the source and output paths.
 */
const getTSConfigPaths = (): {
  configPath?: string
  outPath?: string
  rootPath?: string
  srcPath?: string
  tsConfigPath?: string
} => {
  const tsConfigResult = getTsconfig()!
  const tsConfig = tsConfigResult.config
  const tsConfigDir = path.dirname(tsConfigResult.path)

  try {
    const rootConfigDir = path.resolve(tsConfigDir, tsConfig.compilerOptions!.baseUrl || '')
    const srcPath = tsConfig.compilerOptions?.rootDir || path.resolve(process.cwd(), 'src')
    const outPath = tsConfig.compilerOptions?.outDir || path.resolve(process.cwd(), 'dist')
    let configPath = tsConfig.compilerOptions?.paths?.['@payload-config']?.[0]

    if (configPath) {
      configPath = path.resolve(rootConfigDir, configPath)
    }
    return {
      configPath,
      outPath,
      rootPath: rootConfigDir,
      srcPath,
      tsConfigPath: tsConfigResult.path,
    }
  } catch (error) {
    console.error(`Error parsing tsconfig.json: ${error}`) // Do not throw the error, as we can still continue with the other config path finding methods
    return {
      rootPath: process.cwd(),
    }
  }
}

/**
 * Searches for a Payload configuration file.
 * @returns The absolute path to the Payload configuration file.
 * @throws An error if no configuration file is found.
 */
export const findConfig = (): string => {
  // If the developer has specified a config path,
  // format it if relative and use it directly if absolute
  if (process.env.PAYLOAD_CONFIG_PATH) {
    if (path.isAbsolute(process.env.PAYLOAD_CONFIG_PATH)) {
      return process.env.PAYLOAD_CONFIG_PATH
    }

    return path.resolve(process.cwd(), process.env.PAYLOAD_CONFIG_PATH)
  }

  const { configPath, outPath, rootPath, srcPath } = getTSConfigPaths()

  // if configPath is absolute file, not folder, return it
  if (configPath && (path.extname(configPath) === '.js' || path.extname(configPath) === '.ts')) {
    return configPath
  }

  const searchPaths =
    process.env.NODE_ENV === 'production'
      ? [configPath, outPath, srcPath, rootPath]
      : [configPath, srcPath, rootPath]

  for (const searchPath of searchPaths) {
    if (!searchPath) {
      continue
    }

    const configPath = findUpSync({
      dir: searchPath,
      fileNames: payloadConfigFileNames,
    })

    if (configPath) {
      return configPath
    }
  }

  // If no config file is found in the directories defined by tsconfig.json,
  // try searching in the 'src' and 'dist' directory as a last resort, as they are most commonly used
  if (process.env.NODE_ENV === 'production') {
    const distConfigPath = findUpSync({
      dir: path.resolve(process.cwd(), 'dist'),
      fileNames: ['payload.config.js'],
    })

    if (distConfigPath) {
      return distConfigPath
    }
  } else {
    const srcConfigPath = findUpSync({
      dir: path.resolve(process.cwd(), 'src'),
      fileNames: payloadConfigFileNames,
    })

    if (srcConfigPath) {
      return srcConfigPath
    }
  }

  throw new Error(
    'Error: cannot find Payload config. Please create a configuration file located at the root of your current working directory called "payload.config.js" or "payload.config.ts".',
  )
}
```

--------------------------------------------------------------------------------

````
