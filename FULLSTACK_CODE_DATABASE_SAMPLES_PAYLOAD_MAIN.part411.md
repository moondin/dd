---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 411
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 411 of 695)

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

---[FILE: buildTableState.ts]---
Location: payload-main/packages/ui/src/utilities/buildTableState.ts

```typescript
import type {
  BuildTableStateArgs,
  ClientCollectionConfig,
  ClientConfig,
  CollectionPreferences,
  Column,
  ErrorResult,
  PaginatedDocs,
  SanitizedCollectionConfig,
  ServerFunction,
  Where,
} from 'payload'

import { APIError, canAccessAdmin, formatErrors, getAccessResults } from 'payload'
import { applyLocaleFiltering, isNumber } from 'payload/shared'

import { getClientConfig } from './getClientConfig.js'
import { getColumns } from './getColumns.js'
import { renderFilters, renderTable } from './renderTable.js'
import { upsertPreferences } from './upsertPreferences.js'

type BuildTableStateSuccessResult = {
  clientConfig?: ClientConfig
  data: PaginatedDocs
  errors?: never
  preferences: CollectionPreferences
  renderedFilters: Map<string, React.ReactNode>
  state: Column[]
  Table: React.ReactNode
}

type BuildTableStateErrorResult = {
  data?: any
  renderedFilters?: never
  state?: never
  Table?: never
} & (
  | {
      message: string
    }
  | ErrorResult
)

export type BuildTableStateResult = BuildTableStateErrorResult | BuildTableStateSuccessResult

export const buildTableStateHandler: ServerFunction<
  BuildTableStateArgs,
  Promise<BuildTableStateResult>
> = async (args) => {
  const { req } = args

  try {
    const res = await buildTableState(args)
    return res
  } catch (err) {
    req.payload.logger.error({ err, msg: `There was an error building form state` })

    if (err.message === 'Could not find field schema for given path') {
      return {
        message: err.message,
      }
    }

    if (err.message === 'Unauthorized') {
      return null
    }

    return formatErrors(err)
  }
}

const buildTableState = async (
  args: BuildTableStateArgs,
): Promise<BuildTableStateSuccessResult> => {
  const {
    collectionSlug,
    columns: columnsFromArgs,
    data: dataFromArgs,
    enableRowSelections,
    orderableFieldName,
    parent,
    query,
    renderRowTypes,
    req,
    req: {
      i18n,
      payload,
      payload: { config },
      user,
    },
    tableAppearance,
  } = args

  await canAccessAdmin({ req })

  const clientConfig = getClientConfig({
    config,
    i18n,
    importMap: payload.importMap,
    user,
  })

  await applyLocaleFiltering({ clientConfig, config, req })

  const permissions = await getAccessResults({ req })

  let collectionConfig: SanitizedCollectionConfig
  let clientCollectionConfig: ClientCollectionConfig

  if (!Array.isArray(collectionSlug)) {
    if (req.payload.collections[collectionSlug]) {
      collectionConfig = req.payload.collections[collectionSlug].config
      clientCollectionConfig = clientConfig.collections.find(
        (collection) => collection.slug === collectionSlug,
      )
    }
  }

  const collectionPreferences = await upsertPreferences<CollectionPreferences>({
    key: Array.isArray(collectionSlug)
      ? `${parent.collectionSlug}-${parent.joinPath}`
      : `collection-${collectionSlug}`,
    req,
    value: {
      columns: columnsFromArgs,
      limit: isNumber(query?.limit) ? Number(query.limit) : undefined,
      sort: query?.sort as string,
    },
  })

  let data: PaginatedDocs = dataFromArgs

  // lookup docs, if desired, i.e. within `join` field which initialize with `depth: 0`

  if (!data?.docs || query) {
    if (Array.isArray(collectionSlug)) {
      if (!parent) {
        throw new APIError('Unexpected array of collectionSlug, parent must be provided')
      }

      const select = {}
      let currentSelectRef = select

      const segments = parent.joinPath.split('.')

      for (let i = 0; i < segments.length; i++) {
        currentSelectRef[segments[i]] = i === segments.length - 1 ? true : {}
        currentSelectRef = currentSelectRef[segments[i]]
      }

      const joinQuery: { limit?: number; page?: number; sort?: string; where?: Where } = {
        sort: query?.sort as string,
        where: query?.where,
      }

      if (query) {
        if (!Number.isNaN(Number(query.limit))) {
          joinQuery.limit = Number(query.limit)
        }

        if (!Number.isNaN(Number(query.page))) {
          joinQuery.limit = Number(query.limit)
        }
      }

      let parentDoc = await payload.findByID({
        id: parent.id,
        collection: parent.collectionSlug,
        depth: 1,
        joins: {
          [parent.joinPath]: joinQuery,
        },
        overrideAccess: false,
        select,
        user: req.user,
      })

      for (let i = 0; i < segments.length; i++) {
        if (i === segments.length - 1) {
          data = parentDoc[segments[i]]
        } else {
          parentDoc = parentDoc[segments[i]]
        }
      }
    } else {
      data = await payload.find({
        collection: collectionSlug,
        depth: 0,
        draft: true,
        limit: query?.limit,
        locale: req.locale,
        overrideAccess: false,
        page: query?.page,
        sort: query?.sort,
        user: req.user,
        where: query?.where,
      })
    }
  }

  const { columnState, Table } = renderTable({
    clientCollectionConfig,
    clientConfig,
    collectionConfig,
    collections: Array.isArray(collectionSlug) ? collectionSlug : undefined,
    columns: getColumns({
      clientConfig,
      collectionConfig: clientCollectionConfig,
      collectionSlug,
      columns: columnsFromArgs,
      i18n: req.i18n,
      permissions,
    }),
    data,
    enableRowSelections,
    fieldPermissions: Array.isArray(collectionSlug)
      ? true
      : permissions.collections[collectionSlug].fields,
    i18n: req.i18n,
    orderableFieldName,
    payload,
    query,
    renderRowTypes,
    tableAppearance,
    useAsTitle: Array.isArray(collectionSlug)
      ? payload.collections[collectionSlug[0]]?.config?.admin?.useAsTitle
      : collectionConfig?.admin?.useAsTitle,
  })

  let renderedFilters

  if (collectionConfig) {
    renderedFilters = renderFilters(collectionConfig.fields, req.payload.importMap)
  }

  return {
    data,
    preferences: collectionPreferences,
    renderedFilters,
    state: columnState,
    Table,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: canUseDOM.ts]---
Location: payload-main/packages/ui/src/utilities/canUseDOM.ts

```typescript
export const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
)
```

--------------------------------------------------------------------------------

---[FILE: combineFieldLabel.tsx]---
Location: payload-main/packages/ui/src/utilities/combineFieldLabel.tsx
Signals: React

```typescript
import type { ClientField } from 'payload'

import { Fragment } from 'react'

import { RenderCustomComponent } from '../elements/RenderCustomComponent/index.js'
import { FieldLabel } from '../fields/FieldLabel/index.js'

export const combineFieldLabel = ({
  CustomLabel,
  field,
  prefix,
}: {
  CustomLabel?: React.ReactNode
  field?: ClientField
  prefix?: React.ReactNode
}): React.ReactNode => {
  return (
    <Fragment>
      {prefix ? (
        <Fragment>
          <span style={{ display: 'inline-block' }}>{prefix}</span>
          {' > '}
        </Fragment>
      ) : null}
      <span style={{ display: 'inline-block' }}>
        <RenderCustomComponent
          CustomComponent={CustomLabel}
          Fallback={<FieldLabel label={'label' in field && field.label} />}
        />
      </span>
    </Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: copyDataFromLocale.ts]---
Location: payload-main/packages/ui/src/utilities/copyDataFromLocale.ts

```typescript
import ObjectIdImport from 'bson-objectid'
import {
  canAccessAdmin,
  type CollectionSlug,
  type Data,
  type Field,
  type FlattenedBlock,
  formatErrors,
  type PayloadRequest,
  type ServerFunction,
  traverseFields,
} from 'payload'
import { fieldAffectsData, fieldShouldBeLocalized, tabHasName } from 'payload/shared'

const ObjectId = 'default' in ObjectIdImport ? ObjectIdImport.default : ObjectIdImport

export type CopyDataFromLocaleArgs = {
  collectionSlug?: CollectionSlug
  docID?: number | string
  fromLocale: string
  globalSlug?: string
  overrideData?: boolean
  req: PayloadRequest
  toLocale: string
}

function iterateFields(
  fields: Field[],
  fromLocaleData: Data,
  toLocaleData: Data,
  req: PayloadRequest,
  parentIsLocalized: boolean,
): void {
  fields.map((field) => {
    if (fieldAffectsData(field)) {
      switch (field.type) {
        case 'array':
          // if the field has no value, take the source value
          if (
            field.name in toLocaleData &&
            // only replace if the target value is null or undefined
            [null, undefined].includes(toLocaleData[field.name]) &&
            field.name in fromLocaleData
          ) {
            toLocaleData[field.name] = fromLocaleData[field.name]
            break
          }

          // if the field has a value - loop over the data from target
          if (field.name in toLocaleData) {
            toLocaleData[field.name].map((item: Data, index: number) => {
              if (fromLocaleData[field.name]?.[index]) {
                // Generate new IDs if the field is localized to prevent errors with relational DBs.
                if (fieldShouldBeLocalized({ field, parentIsLocalized })) {
                  toLocaleData[field.name][index].id = new ObjectId().toHexString()
                }

                iterateFields(
                  field.fields,
                  fromLocaleData[field.name][index],
                  item,
                  req,
                  parentIsLocalized || field.localized,
                )
              }
            })
          }
          break

        case 'blocks':
          // if the field has no value, take the source value
          if (
            field.name in toLocaleData &&
            // only replace if the target value is null, undefined, or empty array
            ([null, undefined].includes(toLocaleData[field.name]) ||
              (Array.isArray(toLocaleData[field.name]) && toLocaleData[field.name].length === 0)) &&
            field.name in fromLocaleData
          ) {
            toLocaleData[field.name] = fromLocaleData[field.name]
            break
          }

          // if the field has a value - loop over the data from target
          if (field.name in toLocaleData) {
            toLocaleData[field.name].map((blockData: Data, index: number) => {
              const block =
                req.payload.blocks[blockData.blockType] ??
                ((field.blockReferences ?? field.blocks).find(
                  (block) => typeof block !== 'string' && block.slug === blockData.blockType,
                ) as FlattenedBlock | undefined)

              // Generate new IDs if the field is localized to prevent errors with relational DBs.
              if (fieldShouldBeLocalized({ field, parentIsLocalized })) {
                toLocaleData[field.name][index].id = new ObjectId().toHexString()
              }

              if (block?.fields?.length) {
                iterateFields(
                  block?.fields,
                  fromLocaleData[field.name][index],
                  blockData,
                  req,
                  parentIsLocalized || field.localized,
                )
              }
            })
          }

          break

        case 'checkbox':
        case 'code':
        case 'date':
        case 'email':
        case 'json':
        case 'number':
        case 'point':
        case 'radio':
        case 'relationship':
        case 'richText':
        case 'select':
        case 'text':
        case 'textarea':
        case 'upload':
          if (
            field.name in toLocaleData &&
            // only replace if the target value is null or undefined
            [null, undefined].includes(toLocaleData[field.name]) &&
            field.name in fromLocaleData
          ) {
            toLocaleData[field.name] = fromLocaleData[field.name]
          }
          break

        case 'group': {
          if (
            fieldAffectsData(field) &&
            field.name in toLocaleData &&
            fromLocaleData?.[field.name] !== undefined
          ) {
            iterateFields(
              field.fields,
              fromLocaleData[field.name],
              toLocaleData[field.name],
              req,
              parentIsLocalized || field.localized,
            )
          } else {
            iterateFields(field.fields, fromLocaleData, toLocaleData, req, parentIsLocalized)
          }
          break
        }
      }
    } else {
      switch (field.type) {
        case 'collapsible':
        case 'row':
          iterateFields(field.fields, fromLocaleData, toLocaleData, req, parentIsLocalized)
          break

        case 'tabs':
          field.tabs.map((tab) => {
            if (tabHasName(tab)) {
              if (tab.name in toLocaleData && fromLocaleData?.[tab.name] !== undefined) {
                iterateFields(
                  tab.fields,
                  fromLocaleData[tab.name],
                  toLocaleData[tab.name],
                  req,
                  parentIsLocalized,
                )
              }
            } else {
              iterateFields(tab.fields, fromLocaleData, toLocaleData, req, parentIsLocalized)
            }
          })
          break
      }
    }
  })
}

function mergeData(
  fromLocaleData: Data,
  toLocaleData: Data,
  fields: Field[],
  req: PayloadRequest,
  parentIsLocalized: boolean,
): Data {
  iterateFields(fields, fromLocaleData, toLocaleData, req, parentIsLocalized)

  return toLocaleData
}

/**
 * We don't have to recursively remove all ids,
 * just the ones from the fields inside a localized array or block.
 */
function removeIdIfParentIsLocalized(data: Data, fields: Field[]): Data {
  traverseFields({
    callback: ({ parentIsLocalized, ref }) => {
      if (parentIsLocalized) {
        delete (ref as { id: unknown }).id
      }
    },
    fields,
    fillEmpty: false,
    ref: data,
  })

  return data
}

export const copyDataFromLocaleHandler: ServerFunction<CopyDataFromLocaleArgs> = async (args) => {
  const { req } = args

  try {
    return await copyDataFromLocale(args)
  } catch (err) {
    req.payload.logger.error({
      err,
      msg: `There was an error copying data from "${args.fromLocale}" to "${args.toLocale}"`,
    })

    if (err.message === 'Unauthorized') {
      return null
    }

    return formatErrors(err)
  }
}

export const copyDataFromLocale = async (args: CopyDataFromLocaleArgs) => {
  const {
    collectionSlug,
    docID,
    fromLocale,
    globalSlug,
    overrideData = false,
    req: {
      payload,
      payload: { collections, globals },
      user,
    },
    req,
    toLocale,
  } = args

  await canAccessAdmin({ req })

  const [fromLocaleData, toLocaleData] = await Promise.allSettled([
    globalSlug
      ? payload.findGlobal({
          slug: globalSlug,
          depth: 0,
          locale: fromLocale,
          overrideAccess: false,
          user,
          // `select` would allow us to select only the fields we need in the future
        })
      : payload.findByID({
          id: docID,
          collection: collectionSlug,
          depth: 0,
          joins: false,
          locale: fromLocale,
          overrideAccess: false,
          user,
          // `select` would allow us to select only the fields we need in the future
        }),
    globalSlug
      ? payload.findGlobal({
          slug: globalSlug,
          depth: 0,
          locale: toLocale,
          overrideAccess: false,
          user,
          // `select` would allow us to select only the fields we need in the future
        })
      : payload.findByID({
          id: docID,
          collection: collectionSlug,
          depth: 0,
          joins: false,
          locale: toLocale,
          overrideAccess: false,
          user,
          // `select` would allow us to select only the fields we need in the future
        }),
  ])

  if (fromLocaleData.status === 'rejected') {
    throw new Error(`Error fetching data from locale "${fromLocale}"`)
  }

  if (toLocaleData.status === 'rejected') {
    throw new Error(`Error fetching data from locale "${toLocale}"`)
  }

  const fields = globalSlug
    ? globals[globalSlug].config.fields
    : collections[collectionSlug].config.fields

  const fromLocaleDataWithoutID = fromLocaleData.value
  const toLocaleDataWithoutID = toLocaleData.value

  const dataWithID = overrideData
    ? fromLocaleDataWithoutID
    : mergeData(fromLocaleDataWithoutID, toLocaleDataWithoutID, fields, req, false)

  const data = removeIdIfParentIsLocalized(dataWithID, fields)

  return globalSlug
    ? await payload.updateGlobal({
        slug: globalSlug,
        data,
        locale: toLocale,
        overrideAccess: false,
        req,
        user,
      })
    : await payload.update({
        id: docID,
        collection: collectionSlug,
        data,
        locale: toLocale,
        overrideAccess: false,
        req,
        user,
      })
}
```

--------------------------------------------------------------------------------

---[FILE: dateLocales.ts]---
Location: payload-main/packages/ui/src/utilities/dateLocales.ts

```typescript
import { ar } from 'date-fns/locale/ar'
import { az } from 'date-fns/locale/az'
import { bg } from 'date-fns/locale/bg'
import { cs } from 'date-fns/locale/cs'
import { de } from 'date-fns/locale/de'
import { enUS } from 'date-fns/locale/en-US'
import { es } from 'date-fns/locale/es'
import { faIR } from 'date-fns/locale/fa-IR'
import { fr } from 'date-fns/locale/fr'
import { hr } from 'date-fns/locale/hr'
import { hu } from 'date-fns/locale/hu'
import { is } from 'date-fns/locale/is'
import { it } from 'date-fns/locale/it'
import { ja } from 'date-fns/locale/ja'
import { ko } from 'date-fns/locale/ko'
import { nb } from 'date-fns/locale/nb'
import { nl } from 'date-fns/locale/nl'
import { pl } from 'date-fns/locale/pl'
import { pt } from 'date-fns/locale/pt'
import { ro } from 'date-fns/locale/ro'
import { ru } from 'date-fns/locale/ru'
import { sv } from 'date-fns/locale/sv'
import { th } from 'date-fns/locale/th'
import { tr } from 'date-fns/locale/tr'
import { vi } from 'date-fns/locale/vi'
import { zhCN } from 'date-fns/locale/zh-CN'
import { zhTW } from 'date-fns/locale/zh-TW'

export const dateLocales = {
  ar,
  az,
  bg,
  cs,
  de,
  enUS,
  es,
  fa: faIR,
  fr,
  hr,
  hu,
  is,
  it,
  ja,
  ko,
  nb,
  nl,
  pl,
  pt,
  ro,
  ru,
  sv,
  th,
  tr,
  vi,
  zh: zhCN,
  'zh-tw': zhTW,
}
```

--------------------------------------------------------------------------------

---[FILE: deepMerge.ts]---
Location: payload-main/packages/ui/src/utilities/deepMerge.ts

```typescript
/**
 * Very simple, but fast deepMerge implementation. Only deepMerges objects, not arrays and clones everything.
 * Do not use this if your object contains any complex objects like React Components, or if you would like to combine Arrays.
 * If you only have simple objects and need a fast deepMerge, this is the function for you.
 *
 * obj2 takes precedence over obj1 - thus if obj2 has a key that obj1 also has, obj2's value will be used.
 *
 * @param obj1 base object
 * @param obj2 object to merge "into" obj1
 */
export function deepMergeSimple<T = object>(obj1: object, obj2: object): T {
  const output = { ...obj1 }

  for (const key in obj2) {
    if (Object.prototype.hasOwnProperty.call(obj2, key)) {
      if (typeof obj2[key] === 'object' && !Array.isArray(obj2[key]) && obj1[key]) {
        output[key] = deepMergeSimple(obj1[key], obj2[key])
      } else {
        output[key] = obj2[key]
      }
    }
  }

  return output as T
}
```

--------------------------------------------------------------------------------

---[FILE: filterOutUploadFields.ts]---
Location: payload-main/packages/ui/src/utilities/filterOutUploadFields.ts

```typescript
import type { FieldWithPathClient } from 'payload'

export const filterOutUploadFields = (fields: FieldWithPathClient[]): FieldWithPathClient[] => {
  // List of reserved upload field names
  const baseUploadFieldNames = [
    'file',
    'mimeType',
    'thumbnailURL',
    'width',
    'height',
    'filesize',
    'filename',
    'url',
    'focalX',
    'focalY',
    'sizes',
  ]

  return fields.filter((field) => !baseUploadFieldNames.includes('name' in field && field.name))
}
```

--------------------------------------------------------------------------------

---[FILE: findLocaleFromCode.ts]---
Location: payload-main/packages/ui/src/utilities/findLocaleFromCode.ts

```typescript
import type { Locale, SanitizedLocalizationConfig } from 'payload'
/*
 return the Locale for given locale code, else return null
*/
export const findLocaleFromCode = (
  localizationConfig: SanitizedLocalizationConfig,
  locale: string,
): Locale | null => {
  if (!localizationConfig?.locales || localizationConfig.locales.length === 0) {
    return null
  }

  return localizationConfig.locales.find((el) => el?.code === locale)
}
```

--------------------------------------------------------------------------------

---[FILE: formatAbsoluteURL.ts]---
Location: payload-main/packages/ui/src/utilities/formatAbsoluteURL.ts

```typescript
const getAbsoluteUrl = (url) => {
  try {
    return new URL(url, window.location.origin).href
  } catch {
    return url
  }
}

/**
 * Ensures the provided URL is absolute. If not, it converts it to an absolute URL based
 * on the current window location.
 * Note: This MUST be called within the client environment as it relies on the `window` object
 * to determine the absolute URL.
 */
export const formatAbsoluteURL = (incomingURL: string) =>
  incomingURL?.startsWith('http://') || incomingURL?.startsWith('https://')
    ? incomingURL
    : getAbsoluteUrl(incomingURL)
```

--------------------------------------------------------------------------------

---[FILE: formatAdminURL.ts]---
Location: payload-main/packages/ui/src/utilities/formatAdminURL.ts

```typescript
/** Will read the `routes.admin` config and appropriately handle `"/"` admin paths */
export { formatAdminURL } from 'payload/shared'
```

--------------------------------------------------------------------------------

---[FILE: formatFields.ts]---
Location: payload-main/packages/ui/src/utilities/formatFields.ts

```typescript
import type { Field } from 'payload'

import { fieldAffectsData, fieldIsID } from 'payload/shared'

export const formatFields = (fields: Field[], isEditing?: boolean): Field[] =>
  isEditing ? fields.filter((field) => !fieldAffectsData(field) || !fieldIsID(field)) : fields
```

--------------------------------------------------------------------------------

---[FILE: generateFieldID.ts]---
Location: payload-main/packages/ui/src/utilities/generateFieldID.ts

```typescript
export const generateFieldID = (path: string, editDepth: number, uuid: string) => {
  if (!path) {
    return undefined
  }
  return `field-${path.replace(/\./g, '__')}${editDepth > 1 ? `-${editDepth}` : ''}${uuid ? `-${uuid}` : ''}`
}
```

--------------------------------------------------------------------------------

---[FILE: getClientConfig.ts]---
Location: payload-main/packages/ui/src/utilities/getClientConfig.ts
Signals: React

```typescript
import type { SupportedLanguages } from '@payloadcms/translations'
import type { ClientConfig, CreateClientConfigArgs } from 'payload'

import { createClientConfig, createUnauthenticatedClientConfig } from 'payload'
import { cache } from 'react'

type CachedClientConfigs = Record<keyof SupportedLanguages, ClientConfig>

let cachedClientConfigs = global._payload_clientConfigs as CachedClientConfigs

if (!cachedClientConfigs) {
  cachedClientConfigs = global._payload_clientConfigs = {} as CachedClientConfigs
}

export const getClientConfig = cache(
  ({ config, i18n, importMap, user }: CreateClientConfigArgs): ClientConfig => {
    const currentLanguage = i18n.language

    if (cachedClientConfigs[currentLanguage] && !global._payload_doNotCacheClientConfig) {
      if (!user) {
        return createUnauthenticatedClientConfig({
          clientConfig: cachedClientConfigs[currentLanguage],
        }) as unknown as ClientConfig
      }

      return cachedClientConfigs[currentLanguage]
    }

    const cachedClientConfig = createClientConfig({
      config,
      i18n,
      importMap,
      user,
    })

    cachedClientConfigs[currentLanguage] = cachedClientConfig
    global._payload_clientConfigs = cachedClientConfigs
    global._payload_doNotCacheClientConfig = false

    if (!user) {
      return createUnauthenticatedClientConfig({
        clientConfig: cachedClientConfig,
      }) as unknown as ClientConfig
    }

    return cachedClientConfig
  },
)
```

--------------------------------------------------------------------------------

---[FILE: getClientSchemaMap.ts]---
Location: payload-main/packages/ui/src/utilities/getClientSchemaMap.ts
Signals: React

```typescript
import type { I18n, I18nClient } from '@payloadcms/translations'
import type { ClientConfig, ClientFieldSchemaMap, FieldSchemaMap, Payload } from 'payload'

import { cache } from 'react'

import { buildClientFieldSchemaMap } from './buildClientFieldSchemaMap/index.js'

let cachedClientSchemaMap = global._payload_clientSchemaMap

if (!cachedClientSchemaMap) {
  cachedClientSchemaMap = global._payload_clientSchemaMap = null
}

export const getClientSchemaMap = cache(
  (args: {
    collectionSlug?: string
    config: ClientConfig
    globalSlug?: string
    i18n: I18nClient
    payload: Payload
    schemaMap: FieldSchemaMap
  }): ClientFieldSchemaMap => {
    const { collectionSlug, config, globalSlug, i18n, payload, schemaMap } = args

    if (!cachedClientSchemaMap || global._payload_doNotCacheClientSchemaMap) {
      cachedClientSchemaMap = new Map()
    }

    let cachedEntityClientFieldMap = cachedClientSchemaMap.get(collectionSlug || globalSlug)

    if (cachedEntityClientFieldMap) {
      return cachedEntityClientFieldMap
    }

    cachedEntityClientFieldMap = new Map()

    const { clientFieldSchemaMap: entityClientFieldMap } = buildClientFieldSchemaMap({
      collectionSlug,
      config,
      globalSlug,
      i18n: i18n as I18n,
      payload,
      schemaMap,
    })

    cachedClientSchemaMap.set(collectionSlug || globalSlug, entityClientFieldMap)

    global._payload_clientSchemaMap = cachedClientSchemaMap

    global._payload_doNotCacheClientSchemaMap = false

    return entityClientFieldMap
  },
)
```

--------------------------------------------------------------------------------

---[FILE: getColumns.ts]---
Location: payload-main/packages/ui/src/utilities/getColumns.ts

```typescript
import type { I18nClient } from '@payloadcms/translations'
import type {
  ClientCollectionConfig,
  ClientConfig,
  ColumnPreference,
  SanitizedPermissions,
} from 'payload'

import { flattenTopLevelFields } from 'payload'
import { fieldAffectsData } from 'payload/shared'

import { filterFieldsWithPermissions } from '../providers/TableColumns/buildColumnState/filterFieldsWithPermissions.js'
import { getInitialColumns } from '../providers/TableColumns/getInitialColumns.js'

export const getColumns = ({
  clientConfig,
  collectionConfig,
  collectionSlug,
  columns,
  i18n,
  permissions,
}: {
  clientConfig: ClientConfig
  collectionConfig?: ClientCollectionConfig
  collectionSlug: string | string[]
  columns: ColumnPreference[]
  i18n: I18nClient
  permissions?: SanitizedPermissions
}) => {
  const isPolymorphic = Array.isArray(collectionSlug)

  const fields = !isPolymorphic ? (collectionConfig?.fields ?? []) : []

  if (isPolymorphic) {
    for (const collection of collectionSlug) {
      const clientCollectionConfig = clientConfig.collections.find(
        (each) => each.slug === collection,
      )

      for (const field of filterFieldsWithPermissions({
        fieldPermissions: permissions?.collections?.[collection]?.fields || true,
        fields: clientCollectionConfig.fields,
      })) {
        if (fieldAffectsData(field)) {
          if (fields.some((each) => fieldAffectsData(each) && each.name === field.name)) {
            continue
          }
        }

        fields.push(field)
      }
    }
  }

  return columns
    ? columns?.filter((column) =>
        flattenTopLevelFields(fields, {
          i18n,
          keepPresentationalFields: true,
          moveSubFieldsToTop: true,
        })?.some((field) => {
          const accessor =
            'accessor' in field ? field.accessor : 'name' in field ? field.name : undefined
          return accessor === column.accessor
        }),
      )
    : getInitialColumns(
        isPolymorphic
          ? fields
          : filterFieldsWithPermissions({
              fieldPermissions:
                typeof collectionSlug === 'string' &&
                permissions?.collections?.[collectionSlug]?.fields
                  ? permissions.collections[collectionSlug].fields
                  : true,
              fields,
            }),
        collectionConfig?.admin?.useAsTitle,
        isPolymorphic ? [] : collectionConfig?.admin?.defaultColumns,
      )
}
```

--------------------------------------------------------------------------------

---[FILE: getDisplayedFieldValue.ts]---
Location: payload-main/packages/ui/src/utilities/getDisplayedFieldValue.ts

```typescript
import type { I18nClient } from '@payloadcms/translations'
import type { ClientField } from 'payload'

import { getTranslation } from '@payloadcms/translations'

import { isValidReactElement } from './isValidReactElement.js'

/**
 * Returns the appropriate display value for a field.
 * - For select and radio fields:
 *   - Returns JSX elements as-is.
 *   - Translates localized label objects based on the current language.
 *   - Returns string labels directly.
 *   - Falls back to the option value if no valid label is found.
 * - For all other field types, returns `cellData` unchanged.
 */
export const getDisplayedFieldValue = (cellData: any, field: ClientField, i18n: I18nClient) => {
  if ((field?.type === 'select' || field?.type === 'radio') && Array.isArray(field.options)) {
    const selectedOption = field.options.find((opt) =>
      typeof opt === 'object' ? opt.value === cellData : opt === cellData,
    )

    if (selectedOption) {
      if (typeof selectedOption === 'object' && 'label' in selectedOption) {
        return isValidReactElement(selectedOption.label)
          ? selectedOption.label // Return JSX directly
          : getTranslation(selectedOption.label, i18n) || selectedOption.value // Use translation or fallback to value
      }
      return selectedOption // If option is a string, return it directly
    }
  }
  return cellData // Default fallback if no match found
}
```

--------------------------------------------------------------------------------

---[FILE: getFolderResultsComponentAndData.tsx]---
Location: payload-main/packages/ui/src/utilities/getFolderResultsComponentAndData.tsx

```typescript
import type {
  CollectionSlug,
  ErrorResult,
  GetFolderResultsComponentAndDataArgs,
  ServerFunction,
  Where,
} from 'payload'
import type { FolderBreadcrumb, FolderOrDocument } from 'payload/shared'

import { APIError, formatErrors, getFolderData } from 'payload'
import { buildFolderWhereConstraints, combineWhereConstraints } from 'payload/shared'

import {
  FolderFileTable,
  ItemCardGrid,
  // eslint-disable-next-line payload/no-imports-from-exports-dir -- This component is returned via server functions, it must reference the exports dir
} from '../exports/client/index.js'

type GetFolderResultsComponentAndDataResult = {
  breadcrumbs?: FolderBreadcrumb[]
  documents?: FolderOrDocument[]
  folderAssignedCollections?: CollectionSlug[]
  FolderResultsComponent: React.ReactNode
  subfolders?: FolderOrDocument[]
}

type GetFolderResultsComponentAndDataErrorResult = {
  breadcrumbs?: never
  documents?: never
  FolderResultsComponent?: never
  subfolders?: never
} & (
  | {
      message: string
    }
  | ErrorResult
)

export const getFolderResultsComponentAndDataHandler: ServerFunction<
  GetFolderResultsComponentAndDataArgs,
  Promise<GetFolderResultsComponentAndDataErrorResult | GetFolderResultsComponentAndDataResult>
> = async (args) => {
  const { req } = args

  try {
    const res = await getFolderResultsComponentAndData(args)
    return res
  } catch (err) {
    req.payload.logger.error({
      err,
      msg: `There was an error getting the folder results component and data`,
    })

    return formatErrors(err)
  }
}

/**
 * This function is responsible for fetching folder data, building the results component
 * and returns the data and component together.
 */
export const getFolderResultsComponentAndData = async ({
  browseByFolder = false,
  collectionsToDisplay: activeCollectionSlugs,
  displayAs,
  folderAssignedCollections,
  folderID = undefined,
  req,
  sort,
}: GetFolderResultsComponentAndDataArgs): Promise<GetFolderResultsComponentAndDataResult> => {
  const { payload } = req

  if (!payload.config.folders) {
    throw new APIError('Folders are not enabled in the configuration.')
  }

  const emptyQuery = {
    id: {
      exists: false,
    },
  }

  let collectionSlug: CollectionSlug | undefined = undefined
  let documentWhere: undefined | Where =
    Array.isArray(activeCollectionSlugs) && !activeCollectionSlugs.length ? emptyQuery : undefined
  let folderWhere: undefined | Where =
    Array.isArray(activeCollectionSlugs) && !activeCollectionSlugs.length ? emptyQuery : undefined

  // todo(perf): - collect promises and resolve them in parallel
  for (const activeCollectionSlug of activeCollectionSlugs) {
    if (activeCollectionSlug === payload.config.folders.slug) {
      const folderCollectionConstraints = await buildFolderWhereConstraints({
        collectionConfig: payload.collections[activeCollectionSlug].config,
        folderID,
        localeCode: req?.locale,
        req,
        search: typeof req?.query?.search === 'string' ? req.query.search : undefined,
        sort,
      })

      if (folderCollectionConstraints) {
        folderWhere = folderCollectionConstraints
      }

      folderWhere = combineWhereConstraints([
        folderWhere,
        Array.isArray(folderAssignedCollections) &&
        folderAssignedCollections.length &&
        payload.config.folders.collectionSpecific
          ? {
              or: [
                {
                  folderType: {
                    in: folderAssignedCollections,
                  },
                },
                // if the folderType is not set, it means it accepts all collections and should appear in the results
                {
                  folderType: {
                    exists: false,
                  },
                },
              ],
            }
          : undefined,
      ])
    } else if ((browseByFolder && folderID) || !browseByFolder) {
      if (!browseByFolder) {
        collectionSlug = activeCollectionSlug
      }

      if (!documentWhere) {
        documentWhere = {
          or: [],
        }
      }

      const collectionConstraints = await buildFolderWhereConstraints({
        collectionConfig: payload.collections[activeCollectionSlug].config,
        folderID,
        localeCode: req?.locale,
        req,
        search: typeof req?.query?.search === 'string' ? req.query.search : undefined,
        sort,
      })

      if (collectionConstraints) {
        documentWhere.or.push(collectionConstraints)
      }
    }
  }

  const folderData = await getFolderData({
    collectionSlug,
    documentWhere,
    folderID,
    folderWhere,
    req,
    sort,
  })

  let FolderResultsComponent = null

  if (displayAs === 'grid') {
    FolderResultsComponent = (
      <div>
        {folderData.subfolders.length ? (
          <>
            <ItemCardGrid items={folderData.subfolders} title={'Folders'} type="folder" />
          </>
        ) : null}

        {folderData.documents.length ? (
          <>
            <ItemCardGrid
              items={folderData.documents}
              subfolderCount={folderData.subfolders.length}
              title={'Documents'}
              type="file"
            />
          </>
        ) : null}
      </div>
    )
  } else {
    FolderResultsComponent = <FolderFileTable showRelationCell={browseByFolder} />
  }

  return {
    breadcrumbs: folderData.breadcrumbs,
    documents: folderData.documents,
    folderAssignedCollections: folderData.folderAssignedCollections,
    FolderResultsComponent,
    subfolders: folderData.subfolders,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: getOffsetTop.ts]---
Location: payload-main/packages/ui/src/utilities/getOffsetTop.ts

```typescript
export const getOffsetTop = (element: HTMLElement): number => {
  let el = element
  // Set our distance placeholder
  let distance = 0

  // Loop up the DOM
  if (el.offsetParent) {
    do {
      distance += el.offsetTop
      el = el.offsetParent as HTMLElement
    } while (el)
  }

  // Return our distance
  return distance < 0 ? 0 : distance
}
```

--------------------------------------------------------------------------------

---[FILE: getRequestLanguage.ts]---
Location: payload-main/packages/ui/src/utilities/getRequestLanguage.ts
Signals: Next.js

```typescript
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies.js'

type GetRequestLanguageArgs = {
  cookies: Map<string, string> | ReadonlyRequestCookies
  defaultLanguage?: string
  headers: Request['headers']
}

export const getRequestLanguage = ({
  cookies,
  defaultLanguage = 'en',
  headers,
}: GetRequestLanguageArgs): string => {
  const acceptLanguage = headers.get('Accept-Language')
  const cookieLanguage = cookies.get('lng')

  return (
    acceptLanguage ||
    (typeof cookieLanguage === 'string' ? cookieLanguage : cookieLanguage.value) ||
    defaultLanguage
  )
}
```

--------------------------------------------------------------------------------

---[FILE: getSchemaMap.ts]---
Location: payload-main/packages/ui/src/utilities/getSchemaMap.ts
Signals: React

```typescript
import type { I18n, I18nClient } from '@payloadcms/translations'
import type { FieldSchemaMap, SanitizedConfig } from 'payload'

import { cache } from 'react'

import { buildFieldSchemaMap } from './buildFieldSchemaMap/index.js'

let cachedSchemaMap = global._payload_schemaMap

if (!cachedSchemaMap) {
  cachedSchemaMap = global._payload_schemaMap = null
}

export const getSchemaMap = cache(
  (args: {
    collectionSlug?: string
    config: SanitizedConfig
    globalSlug?: string
    i18n: I18nClient
  }): FieldSchemaMap => {
    const { collectionSlug, config, globalSlug, i18n } = args

    if (!cachedSchemaMap || global._payload_doNotCacheSchemaMap) {
      cachedSchemaMap = new Map()
    }

    let cachedEntityFieldMap = cachedSchemaMap.get(collectionSlug || globalSlug)

    if (cachedEntityFieldMap) {
      return cachedEntityFieldMap
    }

    cachedEntityFieldMap = new Map()

    const { fieldSchemaMap: entityFieldMap } = buildFieldSchemaMap({
      collectionSlug,
      config,
      globalSlug,
      i18n: i18n as I18n,
    })

    cachedSchemaMap.set(collectionSlug || globalSlug, entityFieldMap)

    global._payload_schemaMap = cachedSchemaMap

    global._payload_doNotCacheSchemaMap = false

    return entityFieldMap
  },
)
```

--------------------------------------------------------------------------------

---[FILE: getSupportedMonacoLocale.ts]---
Location: payload-main/packages/ui/src/utilities/getSupportedMonacoLocale.ts

```typescript
export const getSupportedMonacoLocale = (locale: string): string => {
  const supportedLocales = {
    de: 'de',
    es: 'es',
    fr: 'fr',
    it: 'it',
    ja: 'ja',
    ko: 'ko',
    ru: 'ru',
    zh: 'zh-cn',
    'zh-tw': 'zh-tw',
  }

  return supportedLocales[locale]
}
```

--------------------------------------------------------------------------------

````
