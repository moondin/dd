---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 182
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 182 of 695)

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

---[FILE: addPayloadComponentToImportMap.ts]---
Location: payload-main/packages/payload/src/bin/generateImportMap/utilities/addPayloadComponentToImportMap.ts

```typescript
import crypto from 'crypto'
import path from 'path'

import type { PayloadComponent } from '../../../config/types.js'
import type { Imports, InternalImportMap } from '../index.js'

import { parsePayloadComponent } from './parsePayloadComponent.js'

/**
 * Normalizes the component path based on the import map's base directory path.
 */
function getAdjustedComponentPath(importMapToBaseDirPath: string, componentPath: string): string {
  // Normalize input paths to use forward slashes
  const normalizedBasePath = importMapToBaseDirPath.replace(/\\/g, '/')
  const normalizedComponentPath = componentPath.replace(/\\/g, '/')

  // Base path starts with './' - preserve the './' prefix
  // => import map is in a subdirectory of the base directory, or in the same directory as the base directory
  if (normalizedBasePath.startsWith('./')) {
    // Remove './' from component path if it exists
    const cleanComponentPath = normalizedComponentPath.startsWith('./')
      ? normalizedComponentPath.substring(2)
      : normalizedComponentPath

    // Join the paths to preserve the './' prefix
    return `${normalizedBasePath}${cleanComponentPath}`
  }

  return path.posix.join(normalizedBasePath, normalizedComponentPath)
}

/**
 * Adds a payload component to the import map.
 */
export function addPayloadComponentToImportMap({
  importMap,
  importMapToBaseDirPath,
  imports,
  payloadComponent,
}: {
  importMap: InternalImportMap
  importMapToBaseDirPath: string
  imports: Imports
  payloadComponent: PayloadComponent
}): {
  path: string
  specifier: string
} | null {
  if (!payloadComponent) {
    return null
  }
  const { exportName, path: componentPath } = parsePayloadComponent(payloadComponent)

  if (importMap[componentPath + '#' + exportName]) {
    return null
  }

  const importIdentifier =
    exportName + '_' + crypto.createHash('md5').update(componentPath).digest('hex')

  importMap[componentPath + '#' + exportName] = importIdentifier

  const isRelativePath = componentPath.startsWith('.') || componentPath.startsWith('/')

  if (isRelativePath) {
    const adjustedComponentPath = getAdjustedComponentPath(importMapToBaseDirPath, componentPath)

    imports[importIdentifier] = {
      path: adjustedComponentPath,
      specifier: exportName,
    }
    return {
      path: adjustedComponentPath,
      specifier: exportName,
    }
  } else {
    // Tsconfig alias or package import, e.g. '@payloadcms/ui' or '@/components/MyComponent'
    imports[importIdentifier] = {
      path: componentPath,
      specifier: exportName,
    }
    return {
      path: componentPath,
      specifier: exportName,
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: getFromImportMap.ts]---
Location: payload-main/packages/payload/src/bin/generateImportMap/utilities/getFromImportMap.ts

```typescript
import type { PayloadComponent } from '../../../config/types.js'
import type { ImportMap } from '../index.js'

import { parsePayloadComponent } from './parsePayloadComponent.js'

export const getFromImportMap = <TOutput>(args: {
  importMap: ImportMap
  PayloadComponent: PayloadComponent
  schemaPath?: string
  silent?: boolean
}): TOutput => {
  const { importMap, PayloadComponent, schemaPath, silent } = args

  const { exportName, path } = parsePayloadComponent(PayloadComponent)

  const key = path + '#' + exportName

  const importMapEntry = importMap[key]

  if (!importMapEntry && !silent) {
    // eslint-disable-next-line no-console
    console.error(
      `getFromImportMap: PayloadComponent not found in importMap`,
      {
        key,
        PayloadComponent,
        schemaPath,
      },
      'You may need to run the `payload generate:importmap` command to generate the importMap ahead of runtime.',
    )
  }

  return importMapEntry
}
```

--------------------------------------------------------------------------------

---[FILE: getImportMapToBaseDirPath.ts]---
Location: payload-main/packages/payload/src/bin/generateImportMap/utilities/getImportMapToBaseDirPath.ts

```typescript
import path from 'path'

/**
 * Returns the path that navigates from the import map file to the base directory.
 * This can then be prepended to relative paths in the import map to get the full, absolute path.
 */
export function getImportMapToBaseDirPath({
  baseDir,
  importMapPath,
}: {
  /**
   * Absolute path to the base directory
   */
  baseDir: string
  /**
   * Absolute path to the import map file
   */
  importMapPath: string
}): string {
  const importMapDir = path.dirname(importMapPath)

  // 1. Direct relative path from `importMapDir` -> `baseDir`
  let relativePath = path.relative(importMapDir, baseDir).replace(/\\/g, '/')

  // 2. If they're the same directory, path.relative will be "", so use "./"
  if (!relativePath) {
    relativePath = './'
  } // Add ./ prefix for subdirectories of the current directory
  else if (!relativePath.startsWith('.') && !relativePath.startsWith('/')) {
    relativePath = `./${relativePath}`
  }

  // 3. For consistency ensure a trailing slash
  if (!relativePath.endsWith('/')) {
    relativePath += '/'
  }

  return relativePath
}
```

--------------------------------------------------------------------------------

---[FILE: parsePayloadComponent.ts]---
Location: payload-main/packages/payload/src/bin/generateImportMap/utilities/parsePayloadComponent.ts

```typescript
import type { PayloadComponent } from '../../../config/types.js'

export function parsePayloadComponent(PayloadComponent: PayloadComponent): {
  exportName: string
  path: string
} {
  if (!PayloadComponent) {
    return null!
  }

  const pathAndMaybeExport =
    typeof PayloadComponent === 'string' ? PayloadComponent : PayloadComponent.path

  let path: string
  let exportName: string

  if (pathAndMaybeExport.includes('#')) {
    ;[path, exportName] = pathAndMaybeExport.split('#', 2) as [string, string]
  } else {
    path = pathAndMaybeExport
    exportName = 'default'
  }

  if (typeof PayloadComponent === 'object' && PayloadComponent.exportName) {
    exportName = PayloadComponent.exportName
  }

  return { exportName, path }
}
```

--------------------------------------------------------------------------------

---[FILE: resolveImportMapFilePath.ts]---
Location: payload-main/packages/payload/src/bin/generateImportMap/utilities/resolveImportMapFilePath.ts

```typescript
import fs from 'fs/promises'
import path from 'path'

async function pathOrFileExists(path: string): Promise<boolean> {
  try {
    await fs.access(path)
    return true
  } catch {
    return false
  }
}

/**
 * Returns the path to the import map file. If the import map file is not found, it throws an error.
 */
export async function resolveImportMapFilePath({
  adminRoute = '/admin',
  importMapFile,
  rootDir,
}: {
  adminRoute?: string
  importMapFile?: string
  rootDir: string
}): Promise<Error | string> {
  let importMapFilePath: string | undefined = undefined

  if (importMapFile?.length) {
    if (!(await pathOrFileExists(importMapFile))) {
      try {
        await fs.writeFile(importMapFile, '', { flag: 'wx' })
      } catch (err) {
        return new Error(
          `Could not find the import map file at ${importMapFile}${err instanceof Error && err?.message ? `: ${err.message}` : ''}`,
        )
      }
    }
    importMapFilePath = importMapFile
  } else {
    const appLocation = path.resolve(rootDir, `app/(payload)${adminRoute}/`)
    const srcAppLocation = path.resolve(rootDir, `src/app/(payload)${adminRoute}/`)

    if (appLocation && (await pathOrFileExists(appLocation))) {
      importMapFilePath = path.resolve(appLocation, 'importMap.js')
      if (!(await pathOrFileExists(importMapFilePath))) {
        await fs.writeFile(importMapFilePath, '', { flag: 'wx' })
      }
    } else if (srcAppLocation && (await pathOrFileExists(srcAppLocation))) {
      importMapFilePath = path.resolve(srcAppLocation, 'importMap.js')
      if (!(await pathOrFileExists(importMapFilePath))) {
        await fs.writeFile(importMapFilePath, '', { flag: 'wx' })
      }
    } else {
      return new Error(
        `Could not find Payload import map folder. Looked in ${appLocation} and ${srcAppLocation}`,
      )
    }
  }
  return importMapFilePath
}
```

--------------------------------------------------------------------------------

---[FILE: dataloader.ts]---
Location: payload-main/packages/payload/src/collections/dataloader.ts

```typescript
import type { BatchLoadFn } from 'dataloader'

import DataLoader from 'dataloader'

import type { FindArgs } from '../database/types.js'
import type { Payload, TypedFallbackLocale } from '../index.js'
import type { PayloadRequest, PopulateType, SelectType } from '../types/index.js'
import type { TypeWithID } from './config/types.js'
import type { Options } from './operations/local/find.js'

import { isValidID } from '../utilities/isValidID.js'

// Payload uses `dataloader` to solve the classic GraphQL N+1 problem.

// We keep a list of all documents requested to be populated for any given request
// and then batch together documents within the same collection,
// making only 1 find per each collection, rather than `findByID` per each requested doc.

// This dramatically improves performance for REST and Local API `depth` populations,
// and also ensures complex GraphQL queries perform lightning-fast.

const batchAndLoadDocs =
  (req: PayloadRequest): BatchLoadFn<string, TypeWithID> =>
  async (keys: readonly string[]): Promise<TypeWithID[]> => {
    const { payload } = req

    // Create docs array of same length as keys, using null as value
    // We will replace nulls with injected docs as they are retrieved
    const docs: (null | TypeWithID)[] = keys.map(() => null)

    /**
    * Batch IDs by their `find` args
    * so we can make one find query per combination of collection, depth, locale, and fallbackLocale.
    *
    * Resulting shape will be as follows:
      {
        // key is stringified set of find args
        '[null,"pages",2,0,"es","en",false,false]': [
          // value is array of IDs to find with these args
          'q34tl23462346234524',
          '435523540194324280',
          '2346245j35l3j5234532li',
        ],
        // etc
      };
    *
    **/

    const batchByFindArgs: Record<string, string[]> = {}

    for (const key of keys) {
      const [
        transactionID,
        collection,
        id,
        depth,
        currentDepth,
        locale,
        fallbackLocale,
        overrideAccess,
        showHiddenFields,
        draft,
        select,
        populate,
      ] = JSON.parse(key)

      const batchKeyArray = [
        transactionID,
        collection,
        depth,
        currentDepth,
        locale,
        fallbackLocale,
        overrideAccess,
        showHiddenFields,
        draft,
        select,
        populate,
      ]

      const batchKey = JSON.stringify(batchKeyArray)

      const idType = payload.collections?.[collection]?.customIDType || payload.db.defaultIDType
      const sanitizedID = idType === 'number' ? parseFloat(id) : id

      if (isValidID(sanitizedID, idType)) {
        batchByFindArgs[batchKey] = [...(batchByFindArgs[batchKey] || []), sanitizedID]
      }
    }

    // Run find requests one after another, so as to not hang transactions

    for (const [batchKey, ids] of Object.entries(batchByFindArgs)) {
      const [
        transactionID,
        collection,
        depth,
        currentDepth,
        locale,
        fallbackLocale,
        overrideAccess,
        showHiddenFields,
        draft,
        select,
        populate,
      ] = JSON.parse(batchKey)

      req.transactionID = transactionID

      const result = await payload.find({
        collection,
        currentDepth,
        depth,
        disableErrors: true,
        draft,
        fallbackLocale,
        locale,
        overrideAccess: Boolean(overrideAccess),
        pagination: false,
        populate,
        req,
        select,
        showHiddenFields: Boolean(showHiddenFields),
        where: {
          id: {
            in: ids,
          },
        },
      })

      // For each returned doc, find index in original keys
      // Inject doc within docs array if index exists
      for (const doc of result.docs) {
        const docKey = createDataloaderCacheKey({
          collectionSlug: collection,
          currentDepth,
          depth,
          docID: doc.id,
          draft,
          fallbackLocale,
          locale,
          overrideAccess,
          populate,
          select,
          showHiddenFields,
          transactionID: req.transactionID!,
        })
        const docsIndex = keys.findIndex((key) => key === docKey)

        if (docsIndex > -1) {
          docs[docsIndex] = doc
        }
      }
    }

    // Return docs array,
    // which has now been injected with all fetched docs
    // and should match the length of the incoming keys arg
    return docs as TypeWithID[]
  }

export const getDataLoader = (req: PayloadRequest) => {
  const findQueries = new Map()
  const dataLoader = new DataLoader(batchAndLoadDocs(req)) as PayloadRequest['payloadDataLoader']

  dataLoader.find = ((args: FindArgs) => {
    const key = createFindDataloaderCacheKey(args)
    const cached = findQueries.get(key)
    if (cached) {
      return cached
    }
    const request = req.payload.find(args)
    findQueries.set(key, request)
    return request
  }) as Payload['find']

  return dataLoader
}

const createFindDataloaderCacheKey = ({
  collection,
  currentDepth,
  depth,
  disableErrors,
  draft,
  includeLockStatus,
  joins,
  limit,
  overrideAccess,
  page,
  pagination,
  populate,
  req,
  select,
  showHiddenFields,
  sort,
  where,
}: Options<string, SelectType>): string =>
  JSON.stringify([
    collection,
    currentDepth,
    depth,
    disableErrors,
    draft,
    includeLockStatus,
    joins,
    limit,
    overrideAccess,
    page,
    pagination,
    populate,
    req?.locale,
    req?.fallbackLocale,
    req?.user?.id,
    req?.transactionID,
    select,
    showHiddenFields,
    sort,
    where,
  ])

type CreateCacheKeyArgs = {
  collectionSlug: string
  currentDepth: number
  depth: number
  docID: number | string
  draft: boolean
  fallbackLocale: TypedFallbackLocale
  locale: string | string[]
  overrideAccess: boolean
  populate?: PopulateType
  select?: SelectType
  showHiddenFields: boolean
  transactionID: number | Promise<number | string> | string
}
export const createDataloaderCacheKey = ({
  collectionSlug,
  currentDepth,
  depth,
  docID,
  draft,
  fallbackLocale,
  locale,
  overrideAccess,
  populate,
  select,
  showHiddenFields,
  transactionID,
}: CreateCacheKeyArgs): string =>
  JSON.stringify([
    transactionID,
    collectionSlug,
    docID,
    depth,
    currentDepth,
    locale,
    fallbackLocale,
    overrideAccess,
    showHiddenFields,
    draft,
    select,
    populate,
  ])
```

--------------------------------------------------------------------------------

---[FILE: client.ts]---
Location: payload-main/packages/payload/src/collections/config/client.ts

```typescript
import type { I18nClient, TFunction } from '@payloadcms/translations'

import type { StaticDescription } from '../../admin/types.js'
import type { ImportMap } from '../../bin/generateImportMap/index.js'
import type {
  LivePreviewConfig,
  ServerOnlyLivePreviewProperties,
  StaticLabel,
} from '../../config/types.js'
import type { ClientField } from '../../fields/config/client.js'
import type { Payload } from '../../types/index.js'
import type { SanitizedUploadConfig } from '../../uploads/types.js'
import type { SanitizedCollectionConfig } from './types.js'

import { createClientFields } from '../../fields/config/client.js'

export type ServerOnlyCollectionProperties = keyof Pick<
  SanitizedCollectionConfig,
  | 'access'
  | 'custom'
  | 'endpoints'
  | 'flattenedFields'
  | 'hooks'
  | 'indexes'
  | 'joins'
  | 'polymorphicJoins'
  | 'sanitizedIndexes'
>

export type ServerOnlyCollectionAdminProperties = keyof Pick<
  SanitizedCollectionConfig['admin'],
  'baseFilter' | 'baseListFilter' | 'components' | 'formatDocURL' | 'hidden'
>

export type ServerOnlyUploadProperties = keyof Pick<
  SanitizedCollectionConfig['upload'],
  | 'adminThumbnail'
  | 'externalFileHeaderFilter'
  | 'handlers'
  | 'modifyResponseHeaders'
  | 'withMetadata'
>

export type ClientCollectionConfig = {
  admin: {
    description?: StaticDescription
    livePreview?: Omit<LivePreviewConfig, ServerOnlyLivePreviewProperties>
    preview?: boolean
  } & Omit<
    SanitizedCollectionConfig['admin'],
    | 'components'
    | 'description'
    | 'formatDocURL'
    | 'joins'
    | 'livePreview'
    | 'preview'
    | ServerOnlyCollectionAdminProperties
  >
  auth?: { verify?: true } & Omit<
    SanitizedCollectionConfig['auth'],
    'forgotPassword' | 'strategies' | 'verify'
  >
  fields: ClientField[]
  labels: {
    plural: StaticLabel
    singular: StaticLabel
  }
} & Omit<
  SanitizedCollectionConfig,
  'admin' | 'auth' | 'fields' | 'labels' | ServerOnlyCollectionProperties
>

const serverOnlyCollectionProperties: Partial<ServerOnlyCollectionProperties>[] = [
  'hooks',
  'access',
  'endpoints',
  'custom',
  'joins',
  'polymorphicJoins',
  'flattenedFields',
  'indexes',
  'sanitizedIndexes',
  // `upload`
  // `admin`
  // are all handled separately
]

const serverOnlyUploadProperties: Partial<ServerOnlyUploadProperties>[] = [
  'adminThumbnail',
  'externalFileHeaderFilter',
  'handlers',
  'modifyResponseHeaders',
  'withMetadata',
]

const serverOnlyCollectionAdminProperties: Partial<ServerOnlyCollectionAdminProperties>[] = [
  'hidden',
  'baseFilter',
  'baseListFilter',
  'components',
  'formatDocURL',
  // 'preview' is handled separately
  // `livePreview` is handled separately
]

export const createClientCollectionConfig = ({
  collection,
  defaultIDType,
  i18n,
  importMap,
}: {
  collection: SanitizedCollectionConfig
  defaultIDType: Payload['config']['db']['defaultIDType']
  i18n: I18nClient
  importMap: ImportMap
}): ClientCollectionConfig => {
  const clientCollection = {} as Partial<ClientCollectionConfig>

  for (const key in collection) {
    if (serverOnlyCollectionProperties.includes(key as any)) {
      continue
    }
    switch (key) {
      case 'admin':
        if (!collection.admin) {
          break
        }

        clientCollection.admin = {} as ClientCollectionConfig['admin']

        for (const adminKey in collection.admin) {
          if (serverOnlyCollectionAdminProperties.includes(adminKey as any)) {
            continue
          }

          switch (adminKey) {
            case 'description':
              if (
                typeof collection.admin.description === 'string' ||
                typeof collection.admin.description === 'object'
              ) {
                if (collection.admin.description) {
                  clientCollection.admin.description = collection.admin.description
                }
              } else if (typeof collection.admin.description === 'function') {
                const description = collection.admin.description({ t: i18n.t as TFunction })

                if (description) {
                  clientCollection.admin.description = description
                }
              }
              break

            case 'livePreview':
              clientCollection.admin.livePreview = {}

              if (collection.admin.livePreview?.breakpoints) {
                clientCollection.admin.livePreview.breakpoints =
                  collection.admin.livePreview.breakpoints
              }

              break

            case 'preview':
              if (collection.admin.preview) {
                clientCollection.admin.preview = true
              }

              break

            default:
              ;(clientCollection as any).admin[adminKey] =
                collection.admin[adminKey as keyof SanitizedCollectionConfig['admin']]
          }
        }

        break

      case 'auth':
        if (!collection.auth) {
          break
        }

        clientCollection.auth = {} as { verify?: true } & SanitizedCollectionConfig['auth']

        if (collection.auth.cookies) {
          clientCollection.auth.cookies = collection.auth.cookies
        }

        if (collection.auth.depth !== undefined) {
          // Check for undefined as it can be a number (0)
          clientCollection.auth.depth = collection.auth.depth
        }

        if (collection.auth.disableLocalStrategy) {
          clientCollection.auth.disableLocalStrategy = collection.auth.disableLocalStrategy
        }

        if (collection.auth.lockTime !== undefined) {
          // Check for undefined as it can be a number (0)
          clientCollection.auth.lockTime = collection.auth.lockTime
        }

        if (collection.auth.loginWithUsername) {
          clientCollection.auth.loginWithUsername = collection.auth.loginWithUsername
        }

        if (collection.auth.maxLoginAttempts !== undefined) {
          // Check for undefined as it can be a number (0)
          clientCollection.auth.maxLoginAttempts = collection.auth.maxLoginAttempts
        }

        if (collection.auth.removeTokenFromResponses) {
          clientCollection.auth.removeTokenFromResponses = collection.auth.removeTokenFromResponses
        }

        if (collection.auth.useAPIKey) {
          clientCollection.auth.useAPIKey = collection.auth.useAPIKey
        }

        if (collection.auth.tokenExpiration) {
          clientCollection.auth.tokenExpiration = collection.auth.tokenExpiration
        }

        if (collection.auth.verify) {
          clientCollection.auth.verify = true
        }

        break

      case 'fields':
        clientCollection.fields = createClientFields({
          defaultIDType,
          fields: collection.fields,
          i18n,
          importMap,
        })

        break

      case 'labels':
        clientCollection.labels = {
          plural:
            typeof collection.labels.plural === 'function'
              ? collection.labels.plural({ i18n, t: i18n.t as TFunction })
              : collection.labels.plural,
          singular:
            typeof collection.labels.singular === 'function'
              ? collection.labels.singular({ i18n, t: i18n.t as TFunction })
              : collection.labels.singular,
        }

        break

      case 'upload':
        if (!collection.upload) {
          break
        }

        clientCollection.upload = {} as SanitizedUploadConfig

        for (const uploadKey in collection.upload) {
          if (serverOnlyUploadProperties.includes(uploadKey as any)) {
            continue
          }

          if (uploadKey === 'imageSizes') {
            clientCollection.upload.imageSizes = collection.upload.imageSizes?.map((size) => {
              const sanitizedSize = { ...size }
              if ('generateImageName' in sanitizedSize) {
                delete sanitizedSize.generateImageName
              }
              return sanitizedSize
            })
          } else {
            ;(clientCollection.upload as any)[uploadKey] =
              collection.upload[uploadKey as keyof SanitizedUploadConfig]
          }
        }

        break

      default:
        ;(clientCollection as any)[key] = collection[key as keyof SanitizedCollectionConfig]
    }
  }

  return clientCollection as ClientCollectionConfig
}

export const createClientCollectionConfigs = ({
  collections,
  defaultIDType,
  i18n,
  importMap,
}: {
  collections: SanitizedCollectionConfig[]
  defaultIDType: Payload['config']['db']['defaultIDType']
  i18n: I18nClient
  importMap: ImportMap
}): ClientCollectionConfig[] => {
  const clientCollections = new Array(collections.length)

  for (let i = 0; i < collections.length; i++) {
    const collection = collections[i]!

    clientCollections[i] = createClientCollectionConfig({
      collection,
      defaultIDType,
      i18n,
      importMap,
    })
  }

  return clientCollections
}
```

--------------------------------------------------------------------------------

---[FILE: defaults.ts]---
Location: payload-main/packages/payload/src/collections/config/defaults.ts

```typescript
import type { IncomingAuthType, LoginWithUsernameOptions } from '../../auth/types.js'
import type { CollectionConfig } from './types.js'

import { defaultAccess } from '../../auth/defaultAccess.js'

/**
 * @deprecated - remove in 4.0. This is error-prone, as mutating this object will affect any objects that use the defaults as a base.
 */
export const defaults: Partial<CollectionConfig> = {
  access: {
    create: defaultAccess,
    delete: defaultAccess,
    read: defaultAccess,
    unlock: defaultAccess,
    update: defaultAccess,
  },
  admin: {
    components: {},
    custom: {},
    enableRichTextLink: true,
    enableRichTextRelationship: true,
    pagination: {
      defaultLimit: 10,
      limits: [5, 10, 25, 50, 100],
    },
    useAsTitle: 'id',
  },
  auth: false,
  custom: {},
  endpoints: [],
  fields: [],
  hooks: {
    afterChange: [],
    afterDelete: [],
    afterForgotPassword: [],
    afterLogin: [],
    afterLogout: [],
    afterMe: [],
    afterOperation: [],
    afterRead: [],
    afterRefresh: [],
    beforeChange: [],
    beforeDelete: [],
    beforeLogin: [],
    beforeOperation: [],
    beforeRead: [],
    beforeValidate: [],
    me: [],
    refresh: [],
  },
  indexes: [],
  timestamps: true,
  upload: false,
  versions: false,
}

export const addDefaultsToCollectionConfig = (collection: CollectionConfig): CollectionConfig => {
  collection.access = {
    create: defaultAccess,
    delete: defaultAccess,
    read: defaultAccess,
    unlock: defaultAccess,
    update: defaultAccess,
    ...(collection.access || {}),
  }

  collection.admin = {
    components: {},
    custom: {},
    enableRichTextLink: true,
    enableRichTextRelationship: true,
    useAsTitle: 'id',
    ...(collection.admin || {}),
    pagination: {
      defaultLimit: 10,
      limits: [5, 10, 25, 50, 100],
      ...(collection.admin?.pagination || {}),
    },
  }

  collection.auth = collection.auth ?? false
  collection.custom = collection.custom ?? {}
  collection.endpoints = collection.endpoints ?? []
  collection.fields = collection.fields ?? []
  collection.folders = collection.folders ?? false

  collection.hooks = {
    afterChange: [],
    afterDelete: [],
    afterForgotPassword: [],
    afterLogin: [],
    afterLogout: [],
    afterMe: [],
    afterOperation: [],
    afterRead: [],
    afterRefresh: [],
    beforeChange: [],
    beforeDelete: [],
    beforeLogin: [],
    beforeOperation: [],
    beforeRead: [],
    beforeValidate: [],
    me: [],
    refresh: [],
    ...(collection.hooks || {}),
  }

  collection.timestamps = collection.timestamps ?? true
  collection.upload = collection.upload ?? false
  collection.versions = collection.versions ?? false

  collection.indexes = collection.indexes ?? []

  return collection
}

/**
 * @deprecated - remove in 4.0. This is error-prone, as mutating this object will affect any objects that use the defaults as a base.
 */
export const authDefaults: IncomingAuthType = {
  cookies: {
    sameSite: 'Lax',
    secure: false,
  },
  forgotPassword: {},
  lockTime: 600000, // 10 minutes
  loginWithUsername: false,
  maxLoginAttempts: 5,
  tokenExpiration: 7200,
  useSessions: true,
  verify: false,
}

export const addDefaultsToAuthConfig = (auth: IncomingAuthType): IncomingAuthType => {
  auth.cookies = {
    sameSite: 'Lax',
    secure: false,
    ...(auth.cookies || {}),
  }

  auth.forgotPassword = auth.forgotPassword ?? {}
  auth.lockTime = auth.lockTime ?? 600000 // 10 minutes
  auth.loginWithUsername = auth.loginWithUsername ?? false
  auth.maxLoginAttempts = auth.maxLoginAttempts ?? 5
  auth.tokenExpiration = auth.tokenExpiration ?? 7200
  auth.useSessions = auth.useSessions ?? true
  auth.verify = auth.verify ?? false
  auth.strategies = auth.strategies ?? []

  if (!auth.disableLocalStrategy && auth.verify === true) {
    auth.verify = {}
  }

  return auth
}

/**
 * @deprecated - remove in 4.0. This is error-prone, as mutating this object will affect any objects that use the defaults as a base.
 */
export const loginWithUsernameDefaults: LoginWithUsernameOptions = {
  allowEmailLogin: false,
  requireEmail: false,
  requireUsername: true,
}

export const addDefaultsToLoginWithUsernameConfig = (
  loginWithUsername: LoginWithUsernameOptions,
): LoginWithUsernameOptions =>
  ({
    allowEmailLogin: false,
    requireEmail: false,
    requireUsername: true,
    ...(loginWithUsername || {}),
  }) as LoginWithUsernameOptions
```

--------------------------------------------------------------------------------

---[FILE: sanitize.ts]---
Location: payload-main/packages/payload/src/collections/config/sanitize.ts

```typescript
import type { Config, SanitizedConfig } from '../../config/types.js'
import type {
  CollectionConfig,
  SanitizedCollectionConfig,
  SanitizedJoin,
  SanitizedJoins,
} from './types.js'

import { authCollectionEndpoints } from '../../auth/endpoints/index.js'
import { getBaseAuthFields } from '../../auth/getAuthFields.js'
import { TimestampsRequired } from '../../errors/TimestampsRequired.js'
import { sanitizeFields } from '../../fields/config/sanitize.js'
import { fieldAffectsData } from '../../fields/config/types.js'
import { mergeBaseFields } from '../../fields/mergeBaseFields.js'
import { uploadCollectionEndpoints } from '../../uploads/endpoints/index.js'
import { getBaseUploadFields } from '../../uploads/getBaseFields.js'
import { flattenAllFields } from '../../utilities/flattenAllFields.js'
import { formatLabels } from '../../utilities/formatLabels.js'
import { baseVersionFields } from '../../versions/baseFields.js'
import { versionDefaults } from '../../versions/defaults.js'
import { defaultCollectionEndpoints } from '../endpoints/index.js'
import {
  addDefaultsToAuthConfig,
  addDefaultsToCollectionConfig,
  addDefaultsToLoginWithUsernameConfig,
} from './defaults.js'
import { sanitizeCompoundIndexes } from './sanitizeCompoundIndexes.js'
import { validateUseAsTitle } from './useAsTitle.js'

export const sanitizeCollection = async (
  config: Config,
  collection: CollectionConfig,
  /**
   * If this property is set, RichText fields won't be sanitized immediately. Instead, they will be added to this array as promises
   * so that you can sanitize them together, after the config has been sanitized.
   */
  richTextSanitizationPromises?: Array<(config: SanitizedConfig) => Promise<void>>,
  _validRelationships?: string[],
): Promise<SanitizedCollectionConfig> => {
  if (collection._sanitized) {
    return collection as SanitizedCollectionConfig
  }

  collection._sanitized = true

  // /////////////////////////////////
  // Make copy of collection config
  // /////////////////////////////////

  const sanitized: CollectionConfig = addDefaultsToCollectionConfig(collection)

  // /////////////////////////////////
  // Sanitize fields
  // /////////////////////////////////

  const validRelationships = _validRelationships ?? config.collections!.map((c) => c.slug) ?? []

  const joins: SanitizedJoins = {}

  const polymorphicJoins: SanitizedJoin[] = []

  sanitized.fields = await sanitizeFields({
    collectionConfig: sanitized,
    config,
    fields: sanitized.fields,
    joinPath: '',
    joins,
    parentIsLocalized: false,
    polymorphicJoins,
    richTextSanitizationPromises,
    validRelationships,
  })

  if (sanitized.endpoints !== false) {
    if (!sanitized.endpoints) {
      sanitized.endpoints = []
    }

    if (sanitized.auth) {
      for (const endpoint of authCollectionEndpoints) {
        sanitized.endpoints.push(endpoint)
      }
    }

    if (sanitized.upload) {
      for (const endpoint of uploadCollectionEndpoints) {
        sanitized.endpoints.push(endpoint)
      }
    }

    for (const endpoint of defaultCollectionEndpoints) {
      sanitized.endpoints.push(endpoint)
    }
  }

  if (sanitized.timestamps !== false) {
    // add default timestamps fields only as needed
    let hasUpdatedAt: boolean | null = null
    let hasCreatedAt: boolean | null = null
    let hasDeletedAt: boolean | null = null

    sanitized.fields.some((field) => {
      if (fieldAffectsData(field)) {
        if (field.name === 'updatedAt') {
          hasUpdatedAt = true
        }

        if (field.name === 'createdAt') {
          hasCreatedAt = true
        }

        if (field.name === 'deletedAt') {
          hasDeletedAt = true
        }
      }

      return hasCreatedAt && hasUpdatedAt && (!sanitized.trash || hasDeletedAt)
    })

    if (!hasUpdatedAt) {
      sanitized.fields.push({
        name: 'updatedAt',
        type: 'date',
        admin: {
          disableBulkEdit: true,
          hidden: true,
        },
        index: true,
        label: ({ t }) => t('general:updatedAt'),
      })
    }

    if (!hasCreatedAt) {
      sanitized.fields.push({
        name: 'createdAt',
        admin: {
          disableBulkEdit: true,
          hidden: true,
        },
        // The default sort for list view is createdAt. Thus, enabling indexing by default, is a major performance improvement, especially for large or a large amount of collections.
        type: 'date',
        index: true,
        label: ({ t }) => t('general:createdAt'),
      })
    }

    if (sanitized.trash && !hasDeletedAt) {
      sanitized.fields.push({
        name: 'deletedAt',
        type: 'date',
        admin: {
          disableBulkEdit: true,
          hidden: true,
        },
        index: true,
        label: ({ t }) => t('general:deletedAt'),
      })
    }
  }

  const defaultLabels = formatLabels(sanitized.slug)

  sanitized.labels = {
    plural: sanitized.labels?.plural || defaultLabels.plural,
    singular: sanitized.labels?.singular || defaultLabels.singular,
  }

  if (sanitized.versions) {
    if (sanitized.versions === true) {
      sanitized.versions = { drafts: false, maxPerDoc: 100 }
    }

    if (sanitized.timestamps === false) {
      throw new TimestampsRequired(collection)
    }

    sanitized.versions.maxPerDoc =
      typeof sanitized.versions.maxPerDoc === 'number' ? sanitized.versions.maxPerDoc : 100

    if (sanitized.versions.drafts) {
      if (sanitized.versions.drafts === true) {
        sanitized.versions.drafts = {
          autosave: false,
          validate: false,
        }
      }

      if (sanitized.versions.drafts.autosave === true) {
        sanitized.versions.drafts.autosave = {
          interval: versionDefaults.autosaveInterval,
        }
      }

      if (sanitized.versions.drafts.validate === undefined) {
        sanitized.versions.drafts.validate = false
      }

      sanitized.fields = mergeBaseFields(sanitized.fields, baseVersionFields)
    }
  } else {
    delete sanitized.versions
  }

  if (sanitized.folders === true) {
    sanitized.folders = {
      browseByFolder: true,
    }
  } else if (sanitized.folders) {
    sanitized.folders.browseByFolder = sanitized.folders.browseByFolder ?? true
  }

  if (sanitized.upload) {
    if (sanitized.upload === true) {
      sanitized.upload = {}
    }

    sanitized.upload.cacheTags = sanitized.upload?.cacheTags ?? true
    sanitized.upload.bulkUpload = sanitized.upload?.bulkUpload ?? true
    sanitized.upload.staticDir = sanitized.upload.staticDir || sanitized.slug
    sanitized.admin!.useAsTitle =
      sanitized.admin?.useAsTitle && sanitized.admin.useAsTitle !== 'id'
        ? sanitized.admin.useAsTitle
        : 'filename'

    const uploadFields = getBaseUploadFields({
      collection: sanitized,
      config,
    })

    sanitized.fields = mergeBaseFields(sanitized.fields, uploadFields)
  }

  if (sanitized.auth) {
    sanitized.auth = addDefaultsToAuthConfig(
      typeof sanitized.auth === 'boolean' ? {} : sanitized.auth,
    )

    // disable duplicate for auth enabled collections by default
    sanitized.disableDuplicate = sanitized.disableDuplicate ?? true

    if (sanitized.auth.loginWithUsername) {
      if (sanitized.auth.loginWithUsername === true) {
        sanitized.auth.loginWithUsername = addDefaultsToLoginWithUsernameConfig({})
      } else {
        const loginWithUsernameWithDefaults = addDefaultsToLoginWithUsernameConfig(
          sanitized.auth.loginWithUsername,
        )

        // if allowEmailLogin is false, requireUsername must be true
        if (loginWithUsernameWithDefaults.allowEmailLogin === false) {
          loginWithUsernameWithDefaults.requireUsername = true
        }
        sanitized.auth.loginWithUsername = loginWithUsernameWithDefaults
      }
    } else {
      sanitized.auth.loginWithUsername = false
    }

    if (!collection?.admin?.useAsTitle) {
      sanitized.admin!.useAsTitle = sanitized.auth.loginWithUsername ? 'username' : 'email'
    }

    sanitized.fields = mergeBaseFields(sanitized.fields, getBaseAuthFields(sanitized.auth))
  }

  if (collection?.admin?.pagination?.limits?.length) {
    sanitized.admin!.pagination!.limits = collection.admin.pagination.limits
  }

  validateUseAsTitle(sanitized)

  const sanitizedConfig = sanitized as SanitizedCollectionConfig

  sanitizedConfig.joins = joins
  sanitizedConfig.polymorphicJoins = polymorphicJoins

  sanitizedConfig.flattenedFields = flattenAllFields({ fields: sanitizedConfig.fields })

  sanitizedConfig.sanitizedIndexes = sanitizeCompoundIndexes({
    fields: sanitizedConfig.flattenedFields,
    indexes: sanitizedConfig.indexes,
  })

  return sanitizedConfig
}
```

--------------------------------------------------------------------------------

---[FILE: sanitizeCompoundIndexes.ts]---
Location: payload-main/packages/payload/src/collections/config/sanitizeCompoundIndexes.ts

```typescript
import type { FlattenedField } from '../../fields/config/types.js'
import type { CompoundIndex, SanitizedCompoundIndex } from './types.js'

import { InvalidConfiguration } from '../../errors/InvalidConfiguration.js'
import { getFieldByPath } from '../../utilities/getFieldByPath.js'

export const sanitizeCompoundIndexes = ({
  fields,
  indexes,
}: {
  fields: FlattenedField[]
  indexes: CompoundIndex[]
}): SanitizedCompoundIndex[] => {
  const sanitizedCompoundIndexes: SanitizedCompoundIndex[] = []

  for (const index of indexes) {
    const sanitized: SanitizedCompoundIndex = { fields: [], unique: index.unique ?? false }
    for (const path of index.fields) {
      const result = getFieldByPath({ fields, path })

      if (!result) {
        throw new InvalidConfiguration(`Field ${path} was not found`)
      }

      const { field, localizedPath, pathHasLocalized } = result

      if (['array', 'blocks', 'group', 'tab'].includes(field.type)) {
        throw new InvalidConfiguration(
          `Compound index on ${field.type} cannot be set. Path: ${localizedPath}`,
        )
      }

      sanitized.fields.push({ field, localizedPath, path, pathHasLocalized })
    }

    sanitizedCompoundIndexes.push(sanitized)
  }

  return sanitizedCompoundIndexes
}
```

--------------------------------------------------------------------------------

````
