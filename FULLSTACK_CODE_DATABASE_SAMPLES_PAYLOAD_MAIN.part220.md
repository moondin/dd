---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 220
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 220 of 695)

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

---[FILE: createLocalReq.ts]---
Location: payload-main/packages/payload/src/utilities/createLocalReq.ts

```typescript
import type { Payload, RequestContext, TypedLocale, TypedUser } from '../index.js'
import type { PayloadRequest } from '../types/index.js'

import { getDataLoader } from '../collections/dataloader.js'
import { getLocalI18n } from '../translations/getLocalI18n.js'
import { sanitizeFallbackLocale } from '../utilities/sanitizeFallbackLocale.js'

function getRequestContext(
  req: Partial<PayloadRequest> = { context: null } as unknown as PayloadRequest,
  context: RequestContext = {},
): RequestContext {
  if (req.context) {
    if (Object.keys(req.context).length === 0 && req.context.constructor === Object) {
      // if req.context is `{}` avoid unnecessary spread
      return context
    } else {
      return { ...req.context, ...context }
    }
  } else {
    return context
  }
}

const attachFakeURLProperties = (req: Partial<PayloadRequest>, urlSuffix?: string) => {
  /**
   * *NOTE*
   * If no URL is provided, the local API was called outside
   * the context of a request. Therefore we create a fake URL object.
   * `ts-expect-error` is used below for properties that are 'read-only'.
   * Since they do not exist yet we can safely ignore the error.
   */
  let urlObject: undefined | URL

  function getURLObject() {
    if (urlObject) {
      return urlObject
    }

    const fallbackURL = `http://${req.host || 'localhost'}${urlSuffix || ''}`

    const urlToUse =
      req?.url || req.payload?.config?.serverURL
        ? `${req.payload?.config.serverURL}${urlSuffix || ''}`
        : fallbackURL

    try {
      urlObject = new URL(urlToUse)
    } catch (_err) {
      req.payload?.logger.error(
        `Failed to create URL object from URL: ${urlToUse}, falling back to ${fallbackURL}`,
      )

      urlObject = new URL(fallbackURL)
    }

    return urlObject
  }

  if (!req.host) {
    req.host = getURLObject().host
  }

  if (!req.protocol) {
    req.protocol = getURLObject().protocol
  }

  if (!req.pathname) {
    req.pathname = getURLObject().pathname
  }

  if (!req.searchParams) {
    // @ts-expect-error eslint-disable-next-line no-param-reassign
    req.searchParams = getURLObject().searchParams
  }

  if (!req.origin) {
    // @ts-expect-error eslint-disable-next-line no-param-reassign
    req.origin = getURLObject().origin
  }

  if (!req?.url) {
    // @ts-expect-error eslint-disable-next-line no-param-reassign
    req.url = getURLObject().href
  }
}

export type CreateLocalReqOptions = {
  context?: RequestContext
  fallbackLocale?: false | TypedLocale
  locale?: string
  req?: Partial<PayloadRequest>
  urlSuffix?: string
  user?: TypedUser
}

type CreateLocalReq = (options: CreateLocalReqOptions, payload: Payload) => Promise<PayloadRequest>

export const createLocalReq: CreateLocalReq = async (
  { context, fallbackLocale, locale: localeArg, req = {} as PayloadRequest, urlSuffix, user },
  payload,
): Promise<PayloadRequest> => {
  const localization = payload.config?.localization

  if (localization) {
    const locale = localeArg === '*' ? 'all' : localeArg
    const defaultLocale = localization.defaultLocale
    const localeCandidate = locale || req?.locale || req?.query?.locale

    req.locale =
      localeCandidate && typeof localeCandidate === 'string' ? localeCandidate : defaultLocale

    const sanitizedFallback = sanitizeFallbackLocale({
      fallbackLocale: fallbackLocale!,
      locale: req.locale,
      localization,
    })

    req.fallbackLocale = sanitizedFallback!
  }

  const i18n =
    req?.i18n ||
    (await getLocalI18n({ config: payload.config, language: payload.config.i18n.fallbackLanguage }))

  if (!req.headers) {
    req.headers = new Headers()
  }

  req.context = getRequestContext(req, context)
  req.payloadAPI = req?.payloadAPI || 'local'
  req.payload = payload
  req.i18n = i18n
  req.t = i18n.t
  req.user = user || req?.user || null
  req.payloadDataLoader = req?.payloadDataLoader || getDataLoader(req as PayloadRequest)
  req.routeParams = req?.routeParams || {}
  req.query = req?.query || {}

  attachFakeURLProperties(req, urlSuffix)

  return req as PayloadRequest
}
```

--------------------------------------------------------------------------------

---[FILE: createPayloadRequest.ts]---
Location: payload-main/packages/payload/src/utilities/createPayloadRequest.ts

```typescript
import { initI18n } from '@payloadcms/translations'
import * as qs from 'qs-esm'

import type { SanitizedConfig } from '../config/types.js'
import type { TypedFallbackLocale } from '../index.js'
import type { CustomPayloadRequestProperties, PayloadRequest } from '../types/index.js'

import { executeAuthStrategies } from '../auth/executeAuthStrategies.js'
import { getDataLoader } from '../collections/dataloader.js'
import { getPayload } from '../index.js'
import { sanitizeLocales } from './addLocalesToRequest.js'
import { getRequestLanguage } from './getRequestLanguage.js'
import { parseCookies } from './parseCookies.js'

type Args = {
  canSetHeaders?: boolean
  config: Promise<SanitizedConfig> | SanitizedConfig
  params?: {
    collection: string
  }
  payloadInstanceCacheKey?: string
  request: Request
}

export const createPayloadRequest = async ({
  canSetHeaders,
  config: configPromise,
  params,
  payloadInstanceCacheKey,
  request,
}: Args): Promise<PayloadRequest> => {
  const cookies = parseCookies(request.headers)
  const payload = await getPayload({
    config: configPromise,
    cron: true,
    key: payloadInstanceCacheKey,
  })

  const { config } = payload
  const localization = config.localization

  const urlProperties = new URL(request.url)
  const { pathname, searchParams } = urlProperties

  const isGraphQL =
    !config.graphQL.disable && pathname === `${config.routes.api}${config.routes.graphQL}`

  const language = getRequestLanguage({
    config,
    cookies,
    headers: request.headers,
  })

  const i18n = await initI18n({
    config: config.i18n,
    context: 'api',
    language,
  })

  let locale = searchParams.get('locale')

  const { search: queryToParse } = urlProperties

  const query = queryToParse
    ? qs.parse(queryToParse, {
        arrayLimit: 1000,
        depth: 10,
        ignoreQueryPrefix: true,
      })
    : {}

  const fallbackFromRequest = (query.fallbackLocale ||
    searchParams.get('fallback-locale') ||
    searchParams.get('fallbackLocale')) as TypedFallbackLocale

  let fallbackLocale = fallbackFromRequest

  if (localization) {
    const locales = sanitizeLocales({
      fallbackLocale: fallbackLocale!,
      locale: locale!,
      localization,
    })

    fallbackLocale = locales.fallbackLocale!
    locale = locales.locale!
  }

  const customRequest: CustomPayloadRequestProperties = {
    context: {},
    fallbackLocale: fallbackLocale!,
    hash: urlProperties.hash,
    host: urlProperties.host,
    href: urlProperties.href,
    i18n,
    locale,
    origin: urlProperties.origin,
    pathname: urlProperties.pathname,
    payload,
    payloadAPI: isGraphQL ? 'GraphQL' : 'REST',
    payloadDataLoader: undefined!,
    payloadUploadSizes: {},
    port: urlProperties.port,
    protocol: urlProperties.protocol,
    query,
    routeParams: params || {},
    search: urlProperties.search,
    searchParams: urlProperties.searchParams,
    t: i18n.t,
    transactionID: undefined,
    user: null,
  }

  const req: PayloadRequest = Object.assign(request, customRequest)

  req.payloadDataLoader = getDataLoader(req)

  const { responseHeaders, user } = await executeAuthStrategies({
    canSetHeaders,
    headers: req.headers,
    isGraphQL,
    payload,
  })

  req.user = user

  if (responseHeaders) {
    req.responseHeaders = responseHeaders
  }

  return req
}
```

--------------------------------------------------------------------------------

---[FILE: deepCopyObject.ts]---
Location: payload-main/packages/payload/src/utilities/deepCopyObject.ts

```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { JsonValue } from '../types/index.js'

/*
Main deepCopyObject handling - from rfdc: https://github.com/davidmarkclements/rfdc/blob/master/index.js

Copyright 2019 "David Mark Clements <david.mark.clements@gmail.com>"

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions
of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.
*/

function copyBuffer(cur: any) {
  if (cur instanceof Buffer) {
    return Buffer.from(cur)
  }

  return new cur.constructor(cur.buffer.slice(), cur.byteOffset, cur.length)
}

const constructorHandlers = new Map()
constructorHandlers.set(Date, (o: any) => new Date(o))
constructorHandlers.set(Map, (o: any, fn: any) => new Map(cloneArray<any>(Array.from(o), fn)))
constructorHandlers.set(Set, (o: any, fn: any) => new Set(cloneArray(Array.from(o), fn)))
constructorHandlers.set(RegExp, (regex: RegExp) => new RegExp(regex.source, regex.flags))

let handler: ((o: any, fn: any) => any) | null = null

function cloneArray<T extends object>(a: T, fn: (o: any) => any): T {
  const keys = Object.keys(a)
  const a2 = new Array(keys.length) as T
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i] as keyof typeof a
    const cur = a[k] as any
    if (typeof cur !== 'object' || cur === null) {
      a2[k] = cur
    } else if (cur instanceof RegExp) {
      a2[k] = new RegExp(cur.source, cur.flags) as any
    } else if (cur.constructor !== Object && (handler = constructorHandlers.get(cur.constructor))) {
      a2[k] = handler(cur, fn)
    } else if (ArrayBuffer.isView(cur)) {
      a2[k] = copyBuffer(cur)
    } else {
      a2[k] = fn(cur)
    }
  }
  return a2
}

export const deepCopyObject = <T>(o: T): T => {
  if (typeof o !== 'object' || o === null) {
    return o
  }
  if (Array.isArray(o)) {
    return cloneArray(o, deepCopyObject)
  }
  if (o instanceof RegExp) {
    return new RegExp(o.source, o.flags) as T
  }

  if (o.constructor !== Object && (handler = constructorHandlers.get(o.constructor))) {
    return handler(o, deepCopyObject)
  }
  const o2 = {} as T
  for (const k in o) {
    if (Object.hasOwnProperty.call(o, k) === false) {
      continue
    }
    const cur = o[k]
    if (typeof cur !== 'object' || cur === null) {
      o2[k] = cur
    } else if (cur instanceof RegExp) {
      o2[k] = new RegExp(cur.source, cur.flags) as any
    } else if (cur.constructor !== Object && (handler = constructorHandlers.get(cur.constructor))) {
      o2[k] = handler(cur, deepCopyObject)
    } else if (ArrayBuffer.isView(cur)) {
      o2[k] = copyBuffer(cur)
    } else {
      o2[k] = deepCopyObject(cur)
    }
  }
  return o2
}

/*
Fast deepCopyObjectSimple handling - from fast-json-clone: https://github.com/rhysd/fast-json-clone

Benchmark: https://github.com/AlessioGr/fastest-deep-clone-json/blob/main/test/benchmark.js
*/

/**
 * A deepCopyObject implementation which only works for JSON objects and arrays, and is faster than
 * JSON.parse(JSON.stringify(obj))
 *
 * @param value The JSON value to be cloned. There are two invariants. 1) It must not contain circles
 *              as JSON does not allow it. This function will cause infinite loop for such values by
 *              design. 2) It must contain JSON values only. Other values like `Date`, `Regexp`, `Map`,
 *              `Set`, `Buffer`, ... are not allowed.
 * @returns The cloned JSON value.
 */
export function deepCopyObjectSimple<T extends JsonValue>(value: T, filterUndefined = false): T {
  if (typeof value !== 'object' || value === null) {
    return value
  } else if (Array.isArray(value)) {
    return value.map((e) =>
      typeof e !== 'object' || e === null ? e : deepCopyObjectSimple(e, filterUndefined),
    ) as T
  } else {
    if (value instanceof Date) {
      return new Date(value) as unknown as T
    }
    const ret: { [key: string]: T } = {}
    for (const k in value) {
      const v = value[k]
      if (filterUndefined && v === undefined) {
        continue
      }
      ret[k] =
        typeof v !== 'object' || v === null
          ? v
          : (deepCopyObjectSimple(v as T, filterUndefined) as any)
    }
    return ret as unknown as T
  }
}

export function deepCopyObjectSimpleWithoutReactComponents<T extends JsonValue>(value: T): T {
  if (
    typeof value === 'object' &&
    value !== null &&
    '$$typeof' in value &&
    typeof value.$$typeof === 'symbol'
  ) {
    return undefined!
  } else if (typeof value !== 'object' || value === null) {
    return value
  } else if (Array.isArray(value)) {
    return value.map((e) =>
      typeof e !== 'object' || e === null ? e : deepCopyObjectSimpleWithoutReactComponents(e),
    ) as T
  } else {
    // Handle File objects by returning them as-is (don't serialize to plain object)
    if (value instanceof File) {
      return value as unknown as T
    }
    if (value instanceof Date) {
      return new Date(value) as unknown as T
    }
    const ret: { [key: string]: T } = {}
    for (const k in value) {
      const v = value[k]
      ret[k] =
        typeof v !== 'object' || v === null
          ? v
          : (deepCopyObjectSimpleWithoutReactComponents(v as T) as any)
    }
    return ret as unknown as T
  }
}

/**
 * A deepCopyObject implementation which is slower than deepCopyObject, but more correct.
 * Can be used if correctness is more important than speed. Supports circular dependencies
 */
export function deepCopyObjectComplex<T>(object: T, cache: WeakMap<any, any> = new WeakMap()): T {
  if (object === null) {
    return null!
  }

  if (cache.has(object)) {
    return cache.get(object)
  }

  // Handle File
  if (object instanceof File) {
    return object as unknown as T
  }

  // Handle Date
  if (object instanceof Date) {
    return new Date(object.getTime()) as unknown as T
  }

  // Handle RegExp
  if (object instanceof RegExp) {
    return new RegExp(object.source, object.flags) as unknown as T
  }

  // Handle Map
  if (object instanceof Map) {
    const clonedMap = new Map()
    cache.set(object, clonedMap)
    for (const [key, value] of object.entries()) {
      clonedMap.set(key, deepCopyObjectComplex(value, cache))
    }
    return clonedMap as unknown as T
  }

  // Handle Set
  if (object instanceof Set) {
    const clonedSet = new Set()
    cache.set(object, clonedSet)
    for (const value of object.values()) {
      clonedSet.add(deepCopyObjectComplex(value, cache))
    }
    return clonedSet as unknown as T
  }

  // Handle Array and Object
  if (typeof object === 'object' && object !== null) {
    if ('$$typeof' in object && typeof object.$$typeof === 'symbol') {
      return object
    }

    const clonedObject: any = Array.isArray(object)
      ? []
      : Object.create(Object.getPrototypeOf(object))
    cache.set(object, clonedObject)

    for (const key in object) {
      if (
        Object.prototype.hasOwnProperty.call(object, key) ||
        Object.getOwnPropertySymbols(object).includes(key as any)
      ) {
        clonedObject[key] = deepCopyObjectComplex(object[key], cache)
      }
    }

    return clonedObject as T
  }

  // Handle all other cases
  return object
}
```

--------------------------------------------------------------------------------

---[FILE: deepMerge.ts]---
Location: payload-main/packages/payload/src/utilities/deepMerge.ts

```typescript
import deepMerge from 'deepmerge'

import { isPlainObject } from './isPlainObject.js'

export { deepMerge }
/**
 * Fully-featured deepMerge.
 *
 * Array handling: Arrays in the target object are combined with the source object's arrays.
 */
export function deepMergeWithCombinedArrays<T extends object>(
  obj1: object,
  obj2: object,
  options: deepMerge.Options = {},
): T {
  return deepMerge<T>(obj1, obj2, {
    arrayMerge: (target, source, options) => {
      const destination = target.slice()

      source.forEach((item, index) => {
        if (typeof destination[index] === 'undefined') {
          destination[index] = options?.cloneUnlessOtherwiseSpecified(item, options)
        } else if (options?.isMergeableObject(item)) {
          destination[index] = deepMerge(target[index], item, options)
        } else if (target.indexOf(item) === -1) {
          destination.push(item)
        }
      })
      return destination
    },
    ...options,
  })
}

/**
 * Fully-featured deepMerge.
 *
 * Array handling: Arrays in the target object are replaced by the source object's arrays.
 */
export function deepMergeWithSourceArrays<T extends object>(obj1: object, obj2: object): T {
  return deepMerge<T>(obj1, obj2, { arrayMerge: (_, source) => source })
}

/**
 * Fully-featured deepMerge. Does not clone React components by default.
 */
export function deepMergeWithReactComponents<T extends object>(obj1: object, obj2: object): T {
  return deepMerge<T>(obj1, obj2, {
    isMergeableObject: isPlainObject,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: extractID.ts]---
Location: payload-main/packages/payload/src/utilities/extractID.ts

```typescript
export const extractID = <IDType extends number | string>(
  objectOrID: { id: IDType } | IDType,
): IDType => {
  if (typeof objectOrID === 'string' || typeof objectOrID === 'number') {
    return objectOrID
  }

  return objectOrID.id
}
```

--------------------------------------------------------------------------------

---[FILE: filterDataToSelectedLocales.ts]---
Location: payload-main/packages/payload/src/utilities/filterDataToSelectedLocales.ts

```typescript
import type { Block, Field, FlattenedBlock } from '../fields/config/types.js'
import type { SanitizedConfig } from '../index.js'
import type { JsonObject } from '../types/index.js'

import { fieldAffectsData, fieldShouldBeLocalized, tabHasName } from '../fields/config/types.js'

type FilterDataToSelectedLocalesArgs = {
  configBlockReferences: SanitizedConfig['blocks']
  docWithLocales: JsonObject
  fields: Field[]
  parentIsLocalized?: boolean
  selectedLocales: string[]
}

/**
 * Filters localized field data to only include specified locales.
 * For non-localized fields, returns all data as-is.
 * For localized fields, if selectedLocales is provided, returns only those locales.
 * If selectedLocales is not provided and field is localized, returns all locales.
 */
export function filterDataToSelectedLocales({
  configBlockReferences,
  docWithLocales,
  fields,
  parentIsLocalized = false,
  selectedLocales,
}: FilterDataToSelectedLocalesArgs): JsonObject {
  if (!docWithLocales || typeof docWithLocales !== 'object') {
    return docWithLocales
  }

  const result: JsonObject = {}

  for (const field of fields) {
    if (fieldAffectsData(field)) {
      const fieldIsLocalized = fieldShouldBeLocalized({ field, parentIsLocalized })

      switch (field.type) {
        case 'array': {
          if (Array.isArray(docWithLocales[field.name])) {
            result[field.name] = docWithLocales[field.name].map((item: JsonObject) =>
              filterDataToSelectedLocales({
                configBlockReferences,
                docWithLocales: item,
                fields: field.fields,
                parentIsLocalized: fieldIsLocalized,
                selectedLocales,
              }),
            )
          }
          break
        }

        case 'blocks': {
          if (field.name in docWithLocales && Array.isArray(docWithLocales[field.name])) {
            result[field.name] = docWithLocales[field.name].map((blockData: JsonObject) => {
              let block: Block | FlattenedBlock | undefined
              if (configBlockReferences && field.blockReferences) {
                for (const blockOrReference of field.blockReferences) {
                  if (typeof blockOrReference === 'string') {
                    block = configBlockReferences.find((b) => b.slug === blockData.blockType)
                  } else {
                    block = blockOrReference
                  }
                }
              } else if (field.blocks) {
                block = field.blocks.find((b) => b.slug === blockData.blockType)
              }

              if (block) {
                return filterDataToSelectedLocales({
                  configBlockReferences,
                  docWithLocales: blockData,
                  fields: block?.fields || [],
                  parentIsLocalized: fieldIsLocalized,
                  selectedLocales,
                })
              }

              return blockData
            })
          }
          break
        }

        case 'group': {
          // Named groups create a nested data structure
          if (
            fieldAffectsData(field) &&
            field.name in docWithLocales &&
            typeof docWithLocales[field.name] === 'object'
          ) {
            result[field.name] = filterDataToSelectedLocales({
              configBlockReferences,
              docWithLocales: docWithLocales[field.name] as JsonObject,
              fields: field.fields,
              parentIsLocalized: fieldIsLocalized,
              selectedLocales,
            })
          } else {
            // Unnamed groups pass through the same data level
            const nestedResult = filterDataToSelectedLocales({
              configBlockReferences,
              docWithLocales,
              fields: field.fields,
              parentIsLocalized,
              selectedLocales,
            })
            Object.assign(result, nestedResult)
          }
          break
        }

        default: {
          // For all other data-affecting fields (text, number, select, etc.)
          if (field.name in docWithLocales) {
            const value = docWithLocales[field.name]

            // If the field is localized and has locale data
            if (fieldIsLocalized && value && typeof value === 'object' && !Array.isArray(value)) {
              // If selectedLocales is provided, filter to only those locales
              if (selectedLocales && selectedLocales.length > 0) {
                const filtered: Record<string, unknown> = {}
                for (const locale of selectedLocales) {
                  if (locale in value) {
                    filtered[locale] = value[locale]
                  }
                }
                if (Object.keys(filtered).length > 0) {
                  result[field.name] = filtered
                }
              } else {
                // If no selectedLocales, include all locales
                result[field.name] = value
              }
            } else {
              // Non-localized field or non-object value
              result[field.name] = value
            }
          }
          break
        }
      }
    } else {
      // Layout-only fields that don't affect data structure
      switch (field.type) {
        case 'collapsible':
        case 'row': {
          // These pass through the same data level
          const nestedResult = filterDataToSelectedLocales({
            configBlockReferences,
            docWithLocales,
            fields: field.fields,
            parentIsLocalized,
            selectedLocales,
          })
          Object.assign(result, nestedResult)
          break
        }

        case 'tabs': {
          for (const tab of field.tabs) {
            if (tabHasName(tab)) {
              // Named tabs create a nested data structure
              if (tab.name in docWithLocales && typeof docWithLocales[tab.name] === 'object') {
                result[tab.name] = filterDataToSelectedLocales({
                  configBlockReferences,
                  docWithLocales: docWithLocales[tab.name],
                  fields: tab.fields,
                  parentIsLocalized,
                  selectedLocales,
                })
              }
            } else {
              // Unnamed tabs pass through the same data level
              const nestedResult = filterDataToSelectedLocales({
                configBlockReferences,
                docWithLocales,
                fields: tab.fields,
                parentIsLocalized,
                selectedLocales,
              })
              Object.assign(result, nestedResult)
            }
          }
          break
        }
      }
    }
  }

  return result
}
```

--------------------------------------------------------------------------------

---[FILE: findUp.ts]---
Location: payload-main/packages/payload/src/utilities/findUp.ts

```typescript
import fs from 'fs'
import path from 'path'

/**
 * Synchronously walks up parent directories until a condition is met and/or one of the file names within the fileNames array is found.
 */
export function findUpSync({
  condition,
  dir,
  fileNames,
}: {
  condition?: (dir: string) => boolean | Promise<boolean | string> | string
  dir: string
  fileNames?: string[]
}): null | string {
  const { root } = path.parse(dir)

  while (true) {
    if (fileNames?.length) {
      let found = false
      for (const fileName of fileNames) {
        const filePath = path.join(dir, fileName)
        const exists = pathExistsAndIsAccessibleSync(filePath)
        if (exists) {
          if (!condition) {
            return filePath
          }
          found = true
          break
        }
      }
      if (!found && dir !== root) {
        dir = path.dirname(dir) // Move up one directory level.
        continue
      }
    }
    const result = condition?.(dir)
    if (result === true) {
      return dir
    }
    if (typeof result === 'string' && result?.length) {
      return result
    }
    if (dir === root) {
      return null // Reached the root directory without a match.
    }
    dir = path.dirname(dir) // Move up one directory level.
  }
}

/**
 * Asynchronously walks up parent directories until a condition is met and/or one of the file names within the fileNames array is found.
 */
export async function findUp({
  condition,
  dir,
  fileNames,
}: {
  condition?: (dir: string) => boolean | Promise<boolean | string> | string
  dir: string
  fileNames?: string[]
}): Promise<null | string> {
  const { root } = path.parse(dir)

  while (true) {
    if (fileNames?.length) {
      let found = false
      for (const fileName of fileNames) {
        const filePath = path.resolve(dir, fileName)
        const exists = await pathExistsAndIsAccessible(filePath)
        if (exists) {
          if (!condition) {
            return filePath
          }
          found = true
          break
        }
      }
      if (!found && dir !== root) {
        dir = path.dirname(dir) // Move up one directory level.
        continue
      }
    }
    const result = await condition?.(dir)
    if (result === true) {
      return dir
    }
    if (typeof result === 'string' && result?.length) {
      return result
    }
    if (dir === root) {
      return null // Reached the root directory without a match.
    }
    dir = path.dirname(dir) // Move up one directory level.
  }
}

// From https://github.com/sindresorhus/path-exists/blob/main/index.js
// fs.accessSync is preferred over fs.existsSync as it's usually a good idea
// to check if the process has permission to read/write to a file before doing so.
// Also see https://github.com/nodejs/node/issues/39960
export function pathExistsAndIsAccessibleSync(path: string) {
  try {
    fs.accessSync(path)
    return true
  } catch {
    return false
  }
}

export async function pathExistsAndIsAccessible(path: string) {
  try {
    await fs.promises.access(path)
    return true
  } catch {
    return false
  }
}
```

--------------------------------------------------------------------------------

---[FILE: flattenAllFields.ts]---
Location: payload-main/packages/payload/src/utilities/flattenAllFields.ts

```typescript
import type {
  Block,
  Field,
  FlattenedBlock,
  FlattenedBlocksField,
  FlattenedField,
  FlattenedJoinField,
} from '../fields/config/types.js'

import { fieldAffectsData, tabHasName } from '../fields/config/types.js'

export const flattenBlock = ({ block }: { block: Block }): FlattenedBlock => {
  return {
    ...block,
    flattenedFields: flattenAllFields({ fields: block.fields }),
  }
}

const flattenedFieldsCache = new Map<Field[], FlattenedField[]>()

/**
 * Flattens all fields in a collection, preserving the nested field structure.
 * @param cache
 * @param fields
 */
export const flattenAllFields = ({
  cache,
  fields,
}: {
  /** Allows you to get FlattenedField[] from Field[] anywhere without performance overhead by caching. */
  cache?: boolean
  fields: Field[]
}): FlattenedField[] => {
  if (cache) {
    const maybeFields = flattenedFieldsCache.get(fields)
    if (maybeFields) {
      return maybeFields
    }
  }

  const result: FlattenedField[] = []

  for (const field of fields) {
    switch (field.type) {
      case 'array':
      case 'group': {
        if (fieldAffectsData(field)) {
          result.push({ ...field, flattenedFields: flattenAllFields({ fields: field.fields }) })
        } else {
          for (const nestedField of flattenAllFields({ fields: field.fields })) {
            result.push(nestedField)
          }
        }
        break
      }

      case 'blocks': {
        const blocks: FlattenedBlock[] = []
        let blockReferences: (FlattenedBlock | string)[] | undefined = undefined
        if (field.blockReferences) {
          blockReferences = []
          for (const block of field.blockReferences) {
            if (typeof block === 'string') {
              blockReferences.push(block)
              continue
            }
            blockReferences.push(flattenBlock({ block }))
          }
        } else {
          for (const block of field.blocks) {
            if (typeof block === 'string') {
              blocks.push(block)
              continue
            }
            blocks.push(flattenBlock({ block }))
          }
        }

        const resultField: FlattenedBlocksField = {
          ...field,
          blockReferences,
          blocks,
        }

        result.push(resultField)
        break
      }

      case 'collapsible':
      case 'row': {
        for (const nestedField of flattenAllFields({ fields: field.fields })) {
          result.push(nestedField)
        }
        break
      }

      case 'join': {
        result.push(field as FlattenedJoinField)
        break
      }

      case 'tabs': {
        for (const tab of field.tabs) {
          if (!tabHasName(tab)) {
            for (const nestedField of flattenAllFields({ fields: tab.fields })) {
              result.push(nestedField)
            }
          } else {
            result.push({
              ...tab,
              type: 'tab',
              flattenedFields: flattenAllFields({ fields: tab.fields }),
            })
          }
        }
        break
      }

      default: {
        if (field.type !== 'ui') {
          result.push(field)
        }
      }
    }
  }

  flattenedFieldsCache.set(fields, result)

  return result
}
```

--------------------------------------------------------------------------------

````
