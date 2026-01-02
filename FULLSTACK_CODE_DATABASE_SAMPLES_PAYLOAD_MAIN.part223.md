---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 223
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 223 of 695)

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

---[FILE: handleEndpoints.ts]---
Location: payload-main/packages/payload/src/utilities/handleEndpoints.ts

```typescript
import { status as httpStatus } from 'http-status'
import { match } from 'path-to-regexp'

import type { Collection } from '../collections/config/types.js'
import type { Endpoint, PayloadHandler, SanitizedConfig } from '../config/types.js'
import type { APIError } from '../errors/APIError.js'
import type { GlobalConfig } from '../globals/config/types.js'
import type { PayloadRequest } from '../types/index.js'

import { createPayloadRequest } from './createPayloadRequest.js'
import { headersWithCors } from './headersWithCors.js'
import { mergeHeaders } from './mergeHeaders.js'
import { routeError } from './routeError.js'

const notFoundResponse = (req: PayloadRequest, pathname?: string) => {
  return Response.json(
    {
      message: `Route not found "${pathname ?? new URL(req.url!).pathname}"`,
    },
    {
      headers: headersWithCors({
        headers: new Headers(),
        req,
      }),
      status: httpStatus.NOT_FOUND,
    },
  )
}

/**
 * Attaches the Payload REST API to any backend framework that uses Fetch Request/Response
 * like Next.js (app router), Remix, Bun, Hono.
 *
 * ### Example: Using Hono
 * ```ts
 * import { handleEndpoints } from 'payload';
 * import { serve } from '@hono/node-server';
 * import { loadEnv } from 'payload/node';
 *
 * const port = 3001;
 * loadEnv();
 *
 * const { default: config } = await import('@payload-config');
 *
 * const server = serve({
 *   fetch: async (request) => {
 *     const response = await handleEndpoints({
 *       config,
 *       request: request.clone(),
 *     });
 *
 *     return response;
 *   },
 *   port,
 * });
 *
 * server.on('listening', () => {
 *   console.log(`API server is listening on http://localhost:${port}/api`);
 * });
 * ```
 */
export const handleEndpoints = async ({
  basePath = '',
  config: incomingConfig,
  path,
  payloadInstanceCacheKey,
  request,
}: {
  basePath?: string
  config: Promise<SanitizedConfig> | SanitizedConfig
  /** Override path from the request */
  path?: string
  payloadInstanceCacheKey?: string
  request: Request
}): Promise<Response> => {
  let handler!: PayloadHandler
  let req: PayloadRequest
  let collection!: Collection

  // This can be used against GET request search params size limit.
  // Instead you can do POST request with a text body as search params.
  // We use this internally for relationships querying on the frontend
  // packages/ui/src/fields/Relationship/index.tsx
  if (
    request.method.toLowerCase() === 'post' &&
    (request.headers.get('X-Payload-HTTP-Method-Override') === 'GET' ||
      request.headers.get('X-HTTP-Method-Override') === 'GET')
  ) {
    let url = request.url
    let data: any = undefined

    if (request.headers.get('Content-Type') === 'application/x-www-form-urlencoded') {
      const search = await request.text()
      url = `${request.url}?${search}`
    } else if (request.headers.get('Content-Type') === 'application/json') {
      // May not be supported by every endpoint
      data = await request.json()

      // locale and fallbackLocale is read by createPayloadRequest to populate req.locale and req.fallbackLocale
      // => add to searchParams
      if (data?.locale) {
        url += `?locale=${data.locale}`
      }
      if (data?.fallbackLocale) {
        url += `&fallbackLocale=${data.depth}`
      }
    }

    const req = new Request(url, {
      // @ts-expect-error // TODO: check if this is required
      cache: request.cache,
      credentials: request.credentials,
      headers: request.headers,
      method: 'GET',
      signal: request.signal,
    })

    if (data) {
      // @ts-expect-error attach data to request - less overhead than using urlencoded
      req.data = data
    }

    const response = await handleEndpoints({
      basePath,
      config: incomingConfig,
      path,
      payloadInstanceCacheKey,
      request: req,
    })

    return response
  }

  try {
    req = await createPayloadRequest({
      canSetHeaders: true,
      config: incomingConfig,
      payloadInstanceCacheKey,
      request,
    })

    if (req.method?.toLowerCase() === 'options') {
      return Response.json(
        {},
        {
          headers: headersWithCors({
            headers: new Headers(),
            req,
          }),
          status: 200,
        },
      )
    }

    const { payload } = req
    const { config } = payload

    const pathname = `${basePath}${path ?? new URL(req.url!).pathname}`

    if (!pathname.startsWith(config.routes.api)) {
      return notFoundResponse(req, pathname)
    }

    // /api/posts/route -> /posts/route
    let adjustedPathname = pathname.replace(config.routes.api, '')

    let isGlobals = false

    // /globals/header/route -> /header/route
    if (adjustedPathname.startsWith('/globals')) {
      isGlobals = true
      adjustedPathname = adjustedPathname.replace('/globals', '')
    }

    const segments = adjustedPathname.split('/')
    // remove empty string first element
    segments.shift()

    const firstParam = segments[0]

    let globalConfig!: GlobalConfig

    // first param can be a global slug or collection slug, find the relevant config
    if (firstParam) {
      if (isGlobals) {
        globalConfig = payload.globals.config.find((each) => each.slug === firstParam)!
      } else if (payload.collections[firstParam]) {
        collection = payload.collections[firstParam]
      }
    }

    let endpoints: Endpoint[] | false = config.endpoints

    if (collection) {
      endpoints = collection.config.endpoints
      // /posts/route -> /route
      adjustedPathname = adjustedPathname.replace(`/${collection.config.slug}`, '')
    } else if (globalConfig) {
      // /header/route -> /route
      adjustedPathname = adjustedPathname.replace(`/${globalConfig.slug}`, '')
      endpoints = globalConfig.endpoints!
    }

    // sanitize when endpoint.path is '/'
    if (adjustedPathname === '') {
      adjustedPathname = '/'
    }

    if (endpoints === false) {
      return Response.json(
        {
          message: `Cannot ${req.method?.toUpperCase()} ${req.url}`,
        },
        {
          headers: headersWithCors({
            headers: new Headers(),
            req,
          }),
          status: httpStatus.NOT_IMPLEMENTED,
        },
      )
    }

    // Find the relevant endpoint configuration
    const endpoint = endpoints?.find((endpoint) => {
      if (endpoint.method !== req.method?.toLowerCase()) {
        return false
      }

      const pathMatchFn = match(endpoint.path, { decode: decodeURIComponent })

      const matchResult = pathMatchFn(adjustedPathname)

      if (!matchResult) {
        return false
      }

      req.routeParams = matchResult.params as Record<string, unknown>

      // Inject to routeParams the slug as well so it can be used later
      if (collection) {
        req.routeParams.collection = collection.config.slug
      } else if (globalConfig) {
        req.routeParams.global = globalConfig.slug
      }

      return true
    })

    if (endpoint) {
      handler = endpoint.handler
    }

    if (!handler) {
      return notFoundResponse(req, pathname)
    }

    const response = await handler(req)

    return new Response(response.body, {
      headers: headersWithCors({
        headers: mergeHeaders(req.responseHeaders ?? new Headers(), response.headers),
        req,
      }),
      status: response.status,
      statusText: response.statusText,
    })
  } catch (_err) {
    const err = _err as APIError
    return routeError({
      collection,
      config: incomingConfig,
      err,
      req: req!,
    })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: headersWithCors.ts]---
Location: payload-main/packages/payload/src/utilities/headersWithCors.ts

```typescript
import type { PayloadRequest } from '../types/index.js'

type CorsArgs = {
  headers: Headers
  req: Partial<PayloadRequest>
}
export const headersWithCors = ({ headers, req }: CorsArgs): Headers => {
  const cors = req?.payload?.config.cors
  const requestOrigin = req?.headers?.get('Origin')

  if (cors) {
    const defaultAllowedHeaders = [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Content-Encoding',
      'x-apollo-tracing',
      'X-Payload-HTTP-Method-Override',
    ]

    headers.set('Access-Control-Allow-Methods', 'PUT, PATCH, POST, GET, DELETE, OPTIONS')

    if (typeof cors === 'object' && 'headers' in cors) {
      headers.set(
        'Access-Control-Allow-Headers',
        [...defaultAllowedHeaders, ...cors.headers].filter(Boolean).join(', '),
      )
    } else {
      headers.set('Access-Control-Allow-Headers', defaultAllowedHeaders.join(', '))
    }

    if (cors === '*' || (typeof cors === 'object' && 'origins' in cors && cors.origins === '*')) {
      headers.set('Access-Control-Allow-Origin', '*')
    } else if (
      (Array.isArray(cors) && cors.indexOf(requestOrigin!) > -1) ||
      (!Array.isArray(cors) &&
        typeof cors === 'object' &&
        'origins' in cors &&
        cors.origins.indexOf(requestOrigin!) > -1)
    ) {
      headers.set('Access-Control-Allow-Credentials', 'true')
      headers.set('Access-Control-Allow-Origin', requestOrigin!)
    }
  }

  return headers
}
```

--------------------------------------------------------------------------------

---[FILE: initTransaction.ts]---
Location: payload-main/packages/payload/src/utilities/initTransaction.ts

```typescript
import type { MarkRequired } from 'ts-essentials'

import type { PayloadRequest } from '../types/index.js'

/**
 * Starts a new transaction using the db adapter with a random id and then assigns it to the req.transaction
 * @returns true if beginning a transaction and false when req already has a transaction to use
 */
export async function initTransaction(
  req: MarkRequired<Partial<PayloadRequest>, 'payload'>,
): Promise<boolean> {
  const { payload, transactionID } = req
  if (transactionID instanceof Promise) {
    // wait for whoever else is already creating the transaction
    await transactionID
    return false
  }

  if (transactionID) {
    // we already have a transaction, we're not in charge of committing it
    return false
  }
  if (typeof payload.db.beginTransaction === 'function') {
    // create a new transaction
    req.transactionID = payload.db.beginTransaction().then((transactionID) => {
      if (transactionID) {
        req.transactionID = transactionID
      }

      return transactionID!
    })
    return !!(await req.transactionID)
  }
  return false
}
```

--------------------------------------------------------------------------------

---[FILE: isEntityHidden.ts]---
Location: payload-main/packages/payload/src/utilities/isEntityHidden.ts

```typescript
import type { SanitizedCollectionConfig } from '../collections/config/types.js'
import type { SanitizedGlobalConfig } from '../globals/config/types.js'
import type { PayloadRequest } from '../types/index.js'

export const isEntityHidden = ({
  hidden,
  user,
}: {
  hidden: SanitizedCollectionConfig['admin']['hidden'] | SanitizedGlobalConfig['admin']['hidden']
  user: PayloadRequest['user']
}) => {
  return typeof hidden === 'function' ? hidden({ user: user! }) : hidden === true
}
```

--------------------------------------------------------------------------------

---[FILE: isErrorPublic.ts]---
Location: payload-main/packages/payload/src/utilities/isErrorPublic.ts

```typescript
import { status as httpStatus } from 'http-status'

import type { SanitizedConfig } from '../config/types.js'

type PayloadError = {
  isPublic?: boolean
  status?: number
} & Error

/**
 * Determines if an error should be shown to the user.
 */
export function isErrorPublic(error: Error, config: SanitizedConfig) {
  const payloadError = error as PayloadError

  if (config.debug) {
    return true
  }
  if (payloadError.isPublic === true) {
    return true
  }
  if (payloadError.isPublic === false) {
    return false
  }
  if (payloadError.status && payloadError.status !== httpStatus.INTERNAL_SERVER_ERROR) {
    return true
  }

  return false
}
```

--------------------------------------------------------------------------------

---[FILE: isNextBuild.ts]---
Location: payload-main/packages/payload/src/utilities/isNextBuild.ts

```typescript
/**
 * Utility function to determine if the code is being executed during the Next.js build process.
 */
export function isNextBuild() {
  return (
    process.env.NEXT_PHASE === 'phase-production-build' ||
    process.env.npm_lifecycle_event === 'build'
  )
}
```

--------------------------------------------------------------------------------

---[FILE: isNumber.ts]---
Location: payload-main/packages/payload/src/utilities/isNumber.ts

```typescript
export function isNumber(value: unknown): value is number {
  if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
    return false
  }

  return !Number.isNaN(Number(value))
}
```

--------------------------------------------------------------------------------

---[FILE: isolateObjectProperty.ts]---
Location: payload-main/packages/payload/src/utilities/isolateObjectProperty.ts

```typescript
/**
 * Creates a proxy for the given object that has its own property
 */
export function isolateObjectProperty<T extends object>(object: T, key: (keyof T)[] | keyof T): T {
  const keys = Array.isArray(key) ? key : [key]
  const delegate = {} as T

  // Initialize delegate with the keys, if they exist in the original object
  for (const k of keys) {
    if (k in object) {
      delegate[k] = object[k]
    }
  }

  const handler: ProxyHandler<T> = {
    deleteProperty(target, p): boolean {
      return Reflect.deleteProperty(keys.includes(p as keyof T) ? delegate : target, p)
    },
    get(target, p, receiver) {
      return Reflect.get(keys.includes(p as keyof T) ? delegate : target, p, receiver)
    },
    has(target, p) {
      return Reflect.has(keys.includes(p as keyof T) ? delegate : target, p)
    },
    set(target, p, newValue, receiver) {
      if (keys.includes(p as keyof T)) {
        // in case of transactionID we must ignore any receiver, because
        // "If provided and target does not have a setter for propertyKey, the property will be set on receiver instead."
        return Reflect.set(delegate, p, newValue)
      } else {
        return Reflect.set(target, p, newValue, receiver)
      }
    },
  }
  return new Proxy(object, handler)
}
```

--------------------------------------------------------------------------------

---[FILE: isPlainObject.ts]---
Location: payload-main/packages/payload/src/utilities/isPlainObject.ts

```typescript
import { isReactComponentOrFunction } from './isReactComponent.js'

export function isPlainObject(o: any): boolean {
  // Is this a React component?
  if (isReactComponentOrFunction(o)) {
    return false
  }

  // from https://github.com/fastify/deepmerge/blob/master/index.js#L77
  return typeof o === 'object' && o !== null && !(o instanceof RegExp) && !(o instanceof Date)
}
```

--------------------------------------------------------------------------------

---[FILE: isReactComponent.ts]---
Location: payload-main/packages/payload/src/utilities/isReactComponent.ts
Signals: React

```typescript
import type React from 'react'

const clientRefSymbol = Symbol.for('react.client.reference')

export function isReactServerComponentOrFunction<T extends any>(
  component: any | React.ComponentType,
): component is T {
  return typeof component === 'function' && component.$$typeof !== clientRefSymbol
}

export function isReactClientComponent<T extends any>(
  component: any | React.ComponentType,
): component is T {
  return typeof component === 'function' && component.$$typeof === clientRefSymbol
}

export function isReactComponentOrFunction<T extends any>(
  component: any | React.ComponentType,
): component is T {
  return typeof component === 'function'
}
```

--------------------------------------------------------------------------------

---[FILE: isURLAllowed.ts]---
Location: payload-main/packages/payload/src/utilities/isURLAllowed.ts

```typescript
import type { AllowList } from '../uploads/types.js'

export const isURLAllowed = (url: string, allowList: AllowList): boolean => {
  try {
    const parsedUrl = new URL(url)

    return allowList.some((allowItem) => {
      return Object.entries(allowItem).every(([key, value]) => {
        // Skip undefined or null values
        if (!value) {
          return true
        }
        // Compare protocol with colon
        if (key === 'protocol') {
          return typeof value === 'string' && parsedUrl.protocol === `${value}:`
        }

        if (key === 'pathname') {
          // Convert wildcards to a regex
          const regexPattern = value
            .replace(/\*\*/g, '.*') // Match any path
            .replace(/\*/g, '[^/]*') // Match any part of a path segment
            .replace(/\/$/, '(/)?') // Allow optional trailing slash
          const regex = new RegExp(`^${regexPattern}$`)
          return regex.test(parsedUrl.pathname)
        }

        // Default comparison for all other properties (hostname, port, search)
        return parsedUrl[key as keyof URL] === value
      })
    })
  } catch {
    return false // If the URL is invalid, deny by default
  }
}
```

--------------------------------------------------------------------------------

---[FILE: isValidID.ts]---
Location: payload-main/packages/payload/src/utilities/isValidID.ts

```typescript
import ObjectIdImport from 'bson-objectid'

const ObjectId = 'default' in ObjectIdImport ? ObjectIdImport.default : ObjectIdImport

export const isValidID = (
  value: number | string,
  type: 'number' | 'ObjectID' | 'text',
  // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
): boolean => {
  if (type === 'text' && value) {
    if (['object', 'string'].includes(typeof value)) {
      const isObjectID = ObjectId.isValid(value as string)
      return typeof value === 'string' || isObjectID
    }
    return false
  }

  if (typeof value === 'number' && !Number.isNaN(value)) {
    return true
  }

  if (type === 'ObjectID') {
    return ObjectId.isValid(String(value))
  }
}
```

--------------------------------------------------------------------------------

---[FILE: killTransaction.ts]---
Location: payload-main/packages/payload/src/utilities/killTransaction.ts

```typescript
import type { MarkRequired } from 'ts-essentials'

import type { PayloadRequest } from '../types/index.js'

/**
 * Rollback the transaction from the req using the db adapter and removes it from the req
 */
export async function killTransaction(
  req: MarkRequired<Partial<PayloadRequest>, 'payload'>,
): Promise<void> {
  const { payload, transactionID } = req
  if (transactionID && !(transactionID instanceof Promise)) {
    try {
      await payload.db.rollbackTransaction(req.transactionID!)
    } catch (ignore) {
      // swallow any errors while attempting to rollback
    }
    delete req.transactionID
  }
}
```

--------------------------------------------------------------------------------

---[FILE: logError.ts]---
Location: payload-main/packages/payload/src/utilities/logError.ts

```typescript
import type pino from 'pino'

import type { Payload } from '../types/index.js'

export const logError = ({ err, payload }: { err: unknown; payload: Payload }): void => {
  let level: false | pino.Level = 'error'

  if (
    err &&
    typeof err === 'object' &&
    'name' in err &&
    typeof err.name === 'string' &&
    typeof payload.config.loggingLevels[err.name as keyof typeof payload.config.loggingLevels] !==
      'undefined'
  ) {
    level = payload.config.loggingLevels[err.name as keyof typeof payload.config.loggingLevels]
  }

  if (level) {
    const logObject: { err?: unknown; msg?: unknown } = {}

    if (level === 'info') {
      logObject.msg = typeof err === 'object' && 'message' in err! ? err.message : 'Error'
    } else {
      logObject.err = err
    }

    payload.logger[level](logObject)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: logger.ts]---
Location: payload-main/packages/payload/src/utilities/logger.ts

```typescript
import { type Logger, pino } from 'pino'
import { build, type PinoPretty, type PrettyOptions } from 'pino-pretty'

import type { Config } from '../config/types.js'

/**
 * Payload internal logger. Uses Pino.
 * This allows you to bring your own logger instance and let payload use it
 */
export type PayloadLogger = Logger

const prettyOptions: PrettyOptions = {
  colorize: true,
  ignore: 'pid,hostname',
  translateTime: 'SYS:HH:MM:ss',
}

export const prettySyncLoggerDestination: PinoPretty.PrettyStream = build({
  ...prettyOptions,
  destination: 1, // stdout
  sync: true,
})

export const defaultLoggerOptions: PinoPretty.PrettyStream = build(prettyOptions)

export const getLogger = (name = 'payload', logger?: Config['logger']): PayloadLogger => {
  if (!logger) {
    return pino(defaultLoggerOptions)
  }

  // Synchronous logger used by bin scripts
  if (logger === 'sync') {
    return pino(prettySyncLoggerDestination)
  }

  // Check if logger is an object
  if ('options' in logger) {
    const { destination, options } = logger

    if (!options.name) {
      options.name = name
    }

    if (!options.enabled) {
      options.enabled = process.env.DISABLE_LOGGING !== 'true'
    }

    return pino(options, destination)
  } else {
    // Instantiated logger
    return logger
  }
}
```

--------------------------------------------------------------------------------

---[FILE: mapAsync.ts]---
Location: payload-main/packages/payload/src/utilities/mapAsync.ts

```typescript
export async function mapAsync<T, U>(
  arr: T[],
  callbackfn: (item: T, index: number, array: T[]) => Promise<U>,
): Promise<U[]> {
  return Promise.all(arr.map(callbackfn))
}
```

--------------------------------------------------------------------------------

---[FILE: mergeHeaders.ts]---
Location: payload-main/packages/payload/src/utilities/mergeHeaders.ts

```typescript
export const mergeHeaders = (sourceHeaders: Headers, destinationHeaders: Headers): Headers => {
  // Create a new Headers object
  const combinedHeaders = new Headers(destinationHeaders)

  // Append sourceHeaders to combinedHeaders
  sourceHeaders.forEach((value, key) => {
    combinedHeaders.append(key, value)
  })

  return combinedHeaders
}
```

--------------------------------------------------------------------------------

---[FILE: mergeListSearchAndWhere.ts]---
Location: payload-main/packages/payload/src/utilities/mergeListSearchAndWhere.ts

```typescript
import type { ClientCollectionConfig } from '../collections/config/client.js'
import type { SanitizedCollectionConfig } from '../collections/config/types.js'
import type { Where } from '../types/index.js'

const isEmptyObject = (obj: object) => Object.keys(obj).length === 0

export const hoistQueryParamsToAnd = (currentWhere: Where, incomingWhere: Where) => {
  if (isEmptyObject(incomingWhere)) {
    return currentWhere
  }

  if (isEmptyObject(currentWhere)) {
    return incomingWhere
  }

  if ('and' in currentWhere && currentWhere.and) {
    currentWhere.and.push(incomingWhere)
  } else if ('or' in currentWhere) {
    currentWhere = {
      and: [currentWhere, incomingWhere],
    }
  } else {
    currentWhere = {
      and: [currentWhere, incomingWhere],
    }
  }

  return currentWhere
}

type Args = {
  collectionConfig: ClientCollectionConfig | SanitizedCollectionConfig
  search: string
  where?: Where
}

export const mergeListSearchAndWhere = ({ collectionConfig, search, where = {} }: Args): Where => {
  if (search) {
    let copyOfWhere = { ...(where || {}) }

    const searchAsConditions = (
      collectionConfig.admin.listSearchableFields || [collectionConfig.admin?.useAsTitle || 'id']
    ).map((fieldName) => ({
      [fieldName]: {
        like: search,
      },
    }))

    if (searchAsConditions.length > 0) {
      copyOfWhere = hoistQueryParamsToAnd(copyOfWhere, {
        or: searchAsConditions,
      })
    }

    if (!isEmptyObject(copyOfWhere)) {
      where = copyOfWhere
    }
  }

  return where
}
```

--------------------------------------------------------------------------------

---[FILE: parseBooleanString.ts]---
Location: payload-main/packages/payload/src/utilities/parseBooleanString.ts

```typescript
/**
 * Useful when parsing query parameters where booleans are represented as strings.
 * Falls back to `undefined` to allow default handling elsewhere.
 */
export const parseBooleanString = (
  value: boolean | null | string | undefined,
): boolean | undefined => {
  if (typeof value === 'boolean') {
    return value
  }

  if (value === 'true') {
    return true
  }

  if (value === 'false') {
    return false
  }

  return undefined
}
```

--------------------------------------------------------------------------------

---[FILE: parseCookies.ts]---
Location: payload-main/packages/payload/src/utilities/parseCookies.ts

```typescript
export const parseCookies = (headers: Request['headers']): Map<string, string> => {
  const list = new Map<string, string>()
  const rc = headers.get('Cookie')

  if (rc) {
    rc.split(';').forEach((cookie) => {
      const parts = cookie.split('=')
      const key = parts.shift()?.trim()
      const encodedValue = parts.join('=')

      try {
        const decodedValue = decodeURI(encodedValue)
        list.set(key!, decodedValue)
      } catch {
        // ignore invalid encoded values
      }
    })
  }

  return list
}
```

--------------------------------------------------------------------------------

---[FILE: parseDocumentID.ts]---
Location: payload-main/packages/payload/src/utilities/parseDocumentID.ts

```typescript
import type { CollectionSlug, Payload } from '../index.js'

import { isNumber } from './isNumber.js'

type ParseDocumentIDArgs = {
  collectionSlug: CollectionSlug
  id?: number | string
  payload: Payload
}

export function parseDocumentID({ id, collectionSlug, payload }: ParseDocumentIDArgs) {
  const idType = payload.collections[collectionSlug]?.customIDType ?? payload.db.defaultIDType

  return id ? (idType === 'number' && isNumber(id) ? parseFloat(String(id)) : id) : undefined
}
```

--------------------------------------------------------------------------------

---[FILE: reduceFieldsToValues.ts]---
Location: payload-main/packages/payload/src/utilities/reduceFieldsToValues.ts

```typescript
import type { Data, FormState } from '../admin/types.js'

import { unflatten as flatleyUnflatten } from './unflatten.js'
/**
 * Reduce flattened form fields (Fields) to just map to the respective values instead of the full FormField object
 *
 * @param unflatten This also unflattens the data if `unflatten` is true. The unflattened data should match the original data structure
 * @param ignoreDisableFormData - if true, will include fields that have `disableFormData` set to true, for example, blocks or arrays fields.
 *
 */
export const reduceFieldsToValues = (
  fields: FormState,
  unflatten?: boolean,
  ignoreDisableFormData?: boolean,
): Data => {
  let data: Record<string, any> = {}

  if (!fields) {
    return data
  }

  Object.keys(fields).forEach((key) => {
    if (ignoreDisableFormData === true || !fields[key]?.disableFormData) {
      data[key] = fields[key]?.value
    }
  })

  if (unflatten) {
    data = flatleyUnflatten(data)
  }

  return data
}
```

--------------------------------------------------------------------------------

---[FILE: removeUndefined.ts]---
Location: payload-main/packages/payload/src/utilities/removeUndefined.ts

```typescript
export function removeUndefined<T extends object>(obj: T): T {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined)) as T
}
```

--------------------------------------------------------------------------------

---[FILE: routeError.ts]---
Location: payload-main/packages/payload/src/utilities/routeError.ts

```typescript
import { status as httpStatus } from 'http-status'

import type { Collection } from '../collections/config/types.js'
import type { ErrorResult, SanitizedConfig } from '../config/types.js'
import type { PayloadRequest } from '../types/index.js'

import { APIError } from '../errors/APIError.js'
import { getPayload } from '../index.js'
import { formatErrors } from './formatErrors.js'
import { headersWithCors } from './headersWithCors.js'
import { isErrorPublic } from './isErrorPublic.js'
import { logError } from './logError.js'
import { mergeHeaders } from './mergeHeaders.js'

export const routeError = async ({
  collection,
  config: configArg,
  err,
  req: incomingReq,
}: {
  collection?: Collection
  config: Promise<SanitizedConfig> | SanitizedConfig
  err: APIError
  req: PayloadRequest | Request
}): Promise<Response> => {
  if ('payloadInitError' in err && err.payloadInitError === true) {
    // do not attempt initializing Payload if the error is due to a failed initialization. Otherwise,
    // it will cause an infinite loop of initialization attempts and endless error responses, without
    // actually logging the error, as the error logging code will never be reached.
    console.error(err)
    return Response.json(
      {
        message: 'There was an error initializing Payload',
      },
      { status: httpStatus.INTERNAL_SERVER_ERROR },
    )
  }

  let payload = incomingReq && 'payload' in incomingReq && incomingReq?.payload

  if (!payload) {
    try {
      payload = await getPayload({ config: configArg, cron: true })
    } catch (ignore) {
      return Response.json(
        {
          message: 'There was an error initializing Payload',
        },
        { status: httpStatus.INTERNAL_SERVER_ERROR },
      )
    }
  }

  let response = formatErrors(err)

  let status = err.status || httpStatus.INTERNAL_SERVER_ERROR

  logError({ err, payload })

  const req = incomingReq as PayloadRequest

  req.payload = payload
  const headers = headersWithCors({
    headers: new Headers(),
    req,
  })

  const { config } = payload

  // Internal server errors can contain anything, including potentially sensitive data.
  // Therefore, error details will be hidden from the response unless `config.debug` is `true`
  if (!isErrorPublic(err, config)) {
    response = formatErrors(new APIError('Something went wrong.'))
  }

  if (config.debug && config.debug === true) {
    response.stack = err.stack
  }

  if (collection) {
    await collection.config.hooks.afterError?.reduce(async (promise, hook) => {
      await promise

      const result = await hook({
        collection: collection.config,
        context: req.context,
        error: err,
        req,
        result: response,
      })

      if (result) {
        response = (result.response as ErrorResult) || response
        status = result.status || status
      }
    }, Promise.resolve())
  }

  await config.hooks.afterError?.reduce(async (promise, hook) => {
    await promise

    const result = await hook({
      collection: collection?.config,
      context: req.context,
      error: err,
      req,
      result: response,
    })

    if (result) {
      response = (result.response as ErrorResult) || response
      status = result.status || status
    }
  }, Promise.resolve())

  return Response.json(response, {
    headers: req.responseHeaders ? mergeHeaders(req.responseHeaders, headers) : headers,
    status,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: sanitizeFallbackLocale.ts]---
Location: payload-main/packages/payload/src/utilities/sanitizeFallbackLocale.ts

```typescript
import type { SanitizedLocalizationConfig } from '../config/types.js'
import type { TypedFallbackLocale } from '../index.js'

interface Args {
  fallbackLocale: TypedFallbackLocale
  locale: string
  localization: SanitizedLocalizationConfig
}

/**
 * Sanitizes fallbackLocale based on a provided fallbackLocale, locale and localization config
 *
 * Handles the following scenarios:
 * - determines if a fallback locale should be used
 * - determines if a locale specific fallback should be used in place of the default locale
 * - sets the fallbackLocale to 'null' if no fallback locale should be used
 */
export const sanitizeFallbackLocale = ({
  fallbackLocale,
  locale,
  localization,
}: Args): TypedFallbackLocale => {
  if (fallbackLocale === undefined || fallbackLocale === null) {
    if (localization && localization.fallback) {
      // Check for locale specific fallback
      const localeSpecificFallback = localization.locales.length
        ? localization.locales.find((localeConfig) => localeConfig.code === locale)?.fallbackLocale
        : undefined

      if (localeSpecificFallback) {
        return localeSpecificFallback
      }

      return localization.defaultLocale
    }

    return false
  } else if (Array.isArray(fallbackLocale)) {
    return fallbackLocale.filter((localeCode) => localization.localeCodes.includes(localeCode))
  } else if (fallbackLocale) {
    if (['false', 'none', 'null'].includes(fallbackLocale)) {
      return false
    }

    if (localization.localeCodes.includes(fallbackLocale)) {
      return fallbackLocale
    }
  }

  return false
}
```

--------------------------------------------------------------------------------

---[FILE: sanitizeInternalFields.ts]---
Location: payload-main/packages/payload/src/utilities/sanitizeInternalFields.ts

```typescript
export const sanitizeInternalFields = <T extends Record<string, unknown>>(incomingDoc: T): T => {
  // Create a new object to hold the sanitized fields
  const newDoc: Record<string, unknown> = {}

  for (const key in incomingDoc) {
    const val = incomingDoc[key]
    if (key === '_id') {
      newDoc['id'] = val
    } else if (key !== '__v') {
      newDoc[key] = val
    }
  }

  return newDoc as T
}
```

--------------------------------------------------------------------------------

---[FILE: sanitizeJoinParams.ts]---
Location: payload-main/packages/payload/src/utilities/sanitizeJoinParams.ts

```typescript
import type { JoinQuery } from '../types/index.js'

import { isNumber } from './isNumber.js'

export type JoinParams =
  | {
      [schemaPath: string]:
        | {
            limit?: unknown
            sort?: string
            where?: unknown
          }
        | false
    }
  | false

/**
 * Convert request JoinQuery object from strings to numbers
 * @param joins
 */
export const sanitizeJoinParams = (_joins: JoinParams = {}): JoinQuery => {
  const joinQuery: Record<string, any> = {}
  const joins = _joins as Record<string, any>

  Object.keys(joins).forEach((schemaPath) => {
    if (joins[schemaPath] === 'false' || joins[schemaPath] === false) {
      joinQuery[schemaPath] = false
    } else {
      joinQuery[schemaPath] = {
        count: joins[schemaPath].count === 'true',
        limit: isNumber(joins[schemaPath]?.limit) ? Number(joins[schemaPath].limit) : undefined,
        page: isNumber(joins[schemaPath]?.page) ? Number(joins[schemaPath].page) : undefined,
        sort: joins[schemaPath]?.sort ? joins[schemaPath].sort : undefined,
        where: joins[schemaPath]?.where ? joins[schemaPath].where : undefined,
      }
    }
  })

  return joinQuery
}
```

--------------------------------------------------------------------------------

````
