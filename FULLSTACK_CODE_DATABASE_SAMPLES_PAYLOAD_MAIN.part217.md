---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 217
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 217 of 695)

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

---[FILE: processNested.ts]---
Location: payload-main/packages/payload/src/uploads/fetchAPI-multipart/processNested.ts

```typescript
import { isSafeFromPollution } from './utilities.js'

export const processNested = function (data: Record<string, any>) {
  if (!data || data.length < 1) {
    return Object.create(null)
  }

  const d = Object.create(null),
    keys = Object.keys(data)

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]!,
      keyParts = key?.replace(new RegExp(/\[/g), '.').replace(new RegExp(/\]/g), '').split('.'),
      value = data[key]
    let current = d

    for (let index = 0; index < keyParts.length; index++) {
      const k = keyParts[index]!

      // Ensure we don't allow prototype pollution
      if (!isSafeFromPollution(current, k)) {
        continue
      }

      if (index >= keyParts.length - 1) {
        current[k] = value
      } else {
        if (!current[k]) {
          current[k] = !keyParts[index + 1] ? [] : Object.create(null)
        }
        current = current[k]
      }
    }
  }
  return d
}
```

--------------------------------------------------------------------------------

---[FILE: uploadTimer.ts]---
Location: payload-main/packages/payload/src/uploads/fetchAPI-multipart/uploadTimer.ts

```typescript
type CreateUploadTimer = (
  timeout?: number,
  callback?: () => void,
) => {
  clear: () => void
  set: () => boolean
}

export const createUploadTimer: CreateUploadTimer = (timeout = 0, callback = () => {}) => {
  let timer: NodeJS.Timeout | null | number = null

  const clear = () => {
    clearTimeout(timer!)
  }

  const set = () => {
    // Do not start a timer if zero timeout or it hasn't been set.
    if (!timeout) {
      return false
    }
    clear()
    timer = setTimeout(callback, timeout)
    return true
  }

  return { clear, set }
}
```

--------------------------------------------------------------------------------

---[FILE: utilities.ts]---
Location: payload-main/packages/payload/src/uploads/fetchAPI-multipart/utilities.ts

```typescript
import fs from 'fs'
import path from 'path'
import { Readable } from 'stream'

import type { FetchAPIFileUploadOptions } from '../../config/types.js'

// Parameters for safe file name parsing.
const SAFE_FILE_NAME_REGEX = /[^\w-]/g
const MAX_EXTENSION_LENGTH = 3

// Parameters to generate unique temporary file names:
const TEMP_COUNTER_MAX = 65536
const TEMP_PREFIX = 'tmp'
let tempCounter = 0

/**
 * Logs message to console if options.debug option set to true.
 */
export const debugLog = (options: FetchAPIFileUploadOptions, msg: string) => {
  const opts = options || {}
  if (!opts.debug) {
    return false
  }
  console.log(`Next-file-upload: ${msg}`) // eslint-disable-line
  return true
}

/**
 * Generates unique temporary file name. e.g. tmp-5000-156788789789.
 */
export const getTempFilename = (prefix: string = TEMP_PREFIX) => {
  tempCounter = tempCounter >= TEMP_COUNTER_MAX ? 1 : tempCounter + 1
  return `${prefix}-${tempCounter}-${Date.now()}`
}

type FuncType = (...args: any[]) => any
export const isFunc = (value: any): value is FuncType => {
  return typeof value === 'function'
}

/**
 * Set errorFunc to the same value as successFunc for callback mode.
 */
type ErrorFunc = (resolve: () => void, reject: (err: Error) => void) => (err: Error) => void
const errorFunc: ErrorFunc = (resolve, reject) => (isFunc(reject) ? reject : resolve)

/**
 * Return a callback function for promise resole/reject args.
 * Ensures that callback is called only once.
 */
type PromiseCallback = (resolve: () => void, reject: (err: Error) => void) => (err: Error) => void
export const promiseCallback: PromiseCallback = (resolve, reject) => {
  let hasFired = false
  return (err: Error) => {
    if (hasFired) {
      return
    }

    hasFired = true
    return err ? errorFunc(resolve, reject)(err) : resolve()
  }
}

// The default prototypes for both objects and arrays.
// Used by isSafeFromPollution
const OBJECT_PROTOTYPE_KEYS = Object.getOwnPropertyNames(Object.prototype)
const ARRAY_PROTOTYPE_KEYS = Object.getOwnPropertyNames(Array.prototype)

/**
 * Determines whether a key insertion into an object could result in a prototype pollution
 */
type IsSafeFromPollution = (base: any, key: string) => boolean
export const isSafeFromPollution: IsSafeFromPollution = (base, key) => {
  // We perform an instanceof check instead of Array.isArray as the former is more
  // permissive for cases in which the object as an Array prototype but was not constructed
  // via an Array constructor or literal.
  const TOUCHES_ARRAY_PROTOTYPE = base instanceof Array && ARRAY_PROTOTYPE_KEYS.includes(key)
  const TOUCHES_OBJECT_PROTOTYPE = OBJECT_PROTOTYPE_KEYS.includes(key)

  return !TOUCHES_ARRAY_PROTOTYPE && !TOUCHES_OBJECT_PROTOTYPE
}

/**
 * Build request field/file objects to return
 */
type BuildFields = (instance: any, field: string, value: any) => any
export const buildFields: BuildFields = (instance, field, value) => {
  // Do nothing if value is not set.
  if (value === null || value === undefined) {
    return instance
  }
  instance = instance || Object.create(null)

  if (!isSafeFromPollution(instance, field)) {
    return instance
  }
  // Non-array fields
  if (!instance[field]) {
    instance[field] = value
    return instance
  }
  // Array fields
  if (instance[field] instanceof Array) {
    instance[field].push(value)
  } else {
    instance[field] = [instance[field], value]
  }
  return instance
}

/**
 * Creates a folder if it does not exist
 * for file specified in the path variable
 */
type CheckAndMakeDir = (fileUploadOptions: FetchAPIFileUploadOptions, filePath: string) => boolean
export const checkAndMakeDir: CheckAndMakeDir = (fileUploadOptions, filePath) => {
  if (!fileUploadOptions.createParentPath) {
    return false
  }
  // Check whether folder for the file exists.
  const parentPath = path.dirname(filePath)
  // Create folder if it doesn't exist.
  if (!fs.existsSync(parentPath)) {
    fs.mkdirSync(parentPath, { recursive: true })
  }
  // Checks folder again and return a results.
  return fs.existsSync(parentPath)
}

/**
 * Delete a file.
 */
type DeleteFile = (filePath: string, callback: (args: any) => void) => void
export const deleteFile: DeleteFile = (filePath, callback) => fs.unlink(filePath, callback)

/**
 * Copy file via streams
 */
type CopyFile = (src: string, dst: string, callback: (err: Error) => void) => void
const copyFile: CopyFile = (src, dst, callback) => {
  // cbCalled flag and runCb helps to run cb only once.
  let cbCalled = false
  const runCb = (err?: Error) => {
    if (cbCalled) {
      return
    }
    cbCalled = true
    callback(err!)
  }
  // Create read stream
  const readable = fs.createReadStream(src)
  readable.on('error', runCb)
  // Create write stream
  const writable = fs.createWriteStream(dst)
  writable.on('error', (err: Error) => {
    readable.destroy()
    runCb(err)
  })
  writable.on('close', () => runCb())
  // Copy file via piping streams.
  readable.pipe(writable)
}

/**
 * moveFile: moves the file from src to dst.
 * Firstly trying to rename the file if no luck copying it to dst and then deleting src.
 */
type MoveFile = (
  src: string,
  dst: string,
  callback: (err: Error, renamed?: boolean) => void,
) => void
export const moveFile: MoveFile = (src, dst, callback) =>
  fs.rename(src, dst, (err) => {
    if (err) {
      // Try to copy file if rename didn't work.
      copyFile(src, dst, (cpErr) => (cpErr ? callback(cpErr) : deleteFile(src, callback)))
      return
    }
    // File was renamed successfully: Add true to the callback to indicate that.
    callback(null!, true)
  })

/**
 * Save buffer data to a file.
 * @param {Buffer} buffer - buffer to save to a file.
 * @param {string} filePath - path to a file.
 */
export const saveBufferToFile = (
  buffer: Buffer,
  filePath: string,
  callback: (err?: Error) => void,
) => {
  if (!Buffer.isBuffer(buffer)) {
    return callback(new Error('buffer variable should be type of Buffer!'))
  }
  // Setup readable stream from buffer.
  let streamData = buffer
  const readStream = new Readable()
  readStream._read = () => {
    readStream.push(streamData)
    streamData = null!
  }
  // Setup file system writable stream.
  const fstream = fs.createWriteStream(filePath)
  // console.log("Calling saveBuffer");
  fstream.on('error', (err) => {
    // console.log("err cb")
    callback(err)
  })
  fstream.on('close', () => {
    // console.log("close cb");
    callback()
  })
  // Copy file via piping streams.
  readStream.pipe(fstream)
}

/**
 * Decodes uriEncoded file names.
 * @param {Object} opts - middleware options.
 * @param fileName {String} - file name to decode.
 * @returns {String}
 */
const uriDecodeFileName = (opts: FetchAPIFileUploadOptions, fileName: string) => {
  if (!opts || !opts.uriDecodeFileNames) {
    return fileName
  }
  // Decode file name from URI with checking URI malformed errors.
  // See Issue https://github.com/richardgirges/express-fileupload/issues/342.
  try {
    return decodeURIComponent(fileName)
  } catch (ignore) {
    const matcher = /(%[a-f\d]{2})/gi
    return fileName
      .split(matcher)
      .map((str) => {
        try {
          return decodeURIComponent(str)
        } catch (ignore) {
          return ''
        }
      })
      .join('')
  }
}

/**
 * Parses filename and extension and returns object {name, extension}.
 */
type ParseFileNameExtension = (
  preserveExtension: boolean | number,
  fileName: string,
) => {
  extension: string
  name: string
}
export const parseFileNameExtension: ParseFileNameExtension = (preserveExtension, fileName) => {
  const defaultResult = {
    name: fileName,
    extension: '',
  }
  if (!preserveExtension) {
    return defaultResult
  }

  // Define maximum extension length
  const maxExtLength =
    typeof preserveExtension === 'boolean' ? MAX_EXTENSION_LENGTH : preserveExtension

  const nameParts = fileName.split('.')
  if (nameParts.length < 2) {
    return defaultResult
  }

  let extension = nameParts.pop()
  if (extension!.length > maxExtLength && maxExtLength > 0) {
    nameParts[nameParts.length - 1] += '.' + extension!.substr(0, extension!.length - maxExtLength)
    extension = extension!.substr(-maxExtLength)
  }

  return {
    name: nameParts.join('.'),
    extension: maxExtLength ? extension! : '',
  }
}

/**
 * Parse file name and extension.
 */
type ParseFileName = (opts: FetchAPIFileUploadOptions, fileName: string) => string
export const parseFileName: ParseFileName = (opts, fileName) => {
  // Check fileName argument
  if (!fileName || typeof fileName !== 'string') {
    return getTempFilename()
  }
  // Cut off file name if it's length more then 255.
  let parsedName = fileName.length <= 255 ? fileName : fileName.substr(0, 255)
  // Decode file name if uriDecodeFileNames option set true.
  parsedName = uriDecodeFileName(opts, parsedName)
  // Stop parsing file name if safeFileNames options hasn't been set.
  if (!opts.safeFileNames) {
    return parsedName
  }
  // Set regular expression for the file name.
  const nameRegex =
    typeof opts.safeFileNames === 'object' && opts.safeFileNames instanceof RegExp
      ? opts.safeFileNames
      : SAFE_FILE_NAME_REGEX
  // Parse file name extension.
  const parsedFileName = parseFileNameExtension(opts.preserveExtension!, parsedName)
  if (parsedFileName.extension.length) {
    parsedFileName.extension = '.' + parsedFileName.extension.replace(nameRegex, '')
  }

  return parsedFileName.name.replace(nameRegex, '').concat(parsedFileName.extension)
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/payload/src/uploads/fetchAPI-stream-file/index.ts

```typescript
import fs from 'fs'

export function iteratorToStream(iterator: AsyncIterator<Uint8Array>) {
  return new ReadableStream({
    async pull(controller) {
      const { done, value } = await iterator.next()
      if (done) {
        controller.close()
      } else {
        controller.enqueue(value)
      }
    },
  })
}

export async function* nodeStreamToIterator(stream: fs.ReadStream) {
  for await (const chunk of stream) {
    yield new Uint8Array(chunk)
  }
}

export function streamFile({
  filePath,
  options,
}: {
  filePath: string
  options?: { end?: number; start?: number }
}): ReadableStream {
  const nodeStream = fs.createReadStream(filePath, options)
  const data: ReadableStream = iteratorToStream(nodeStreamToIterator(nodeStream))
  return data
}
```

--------------------------------------------------------------------------------

---[FILE: addDataAndFileToRequest.ts]---
Location: payload-main/packages/payload/src/utilities/addDataAndFileToRequest.ts

```typescript
import type { PayloadRequest } from '../types/index.js'

import { APIError } from '../errors/APIError.js'
import { processMultipartFormdata } from '../uploads/fetchAPI-multipart/index.js'

type AddDataAndFileToRequest = (req: PayloadRequest) => Promise<void>

/**
 * Mutates the Request, appending 'data' and 'file' if found
 */
export const addDataAndFileToRequest: AddDataAndFileToRequest = async (req) => {
  const { body, headers, method, payload } = req

  if (method && ['PATCH', 'POST', 'PUT'].includes(method.toUpperCase()) && body) {
    const [contentType] = (headers.get('Content-Type') || '').split(';', 1)
    const bodyByteSize = parseInt(req.headers.get('Content-Length') || '0', 10)

    if (contentType === 'application/json') {
      let data = {}
      try {
        const text = await req.text?.()
        data = text ? JSON.parse(text) : {}
      } catch (error) {
        req.payload.logger.error(error)
      } finally {
        req.data = data
        // @ts-expect-error attach json method to request
        req.json = () => Promise.resolve(data)
      }
    } else if (bodyByteSize && contentType?.includes('multipart/')) {
      const { error, fields, files } = await processMultipartFormdata({
        options: {
          ...(payload.config.bodyParser || {}),
          ...(payload.config.upload || {}),
        },
        request: req as Request,
      })

      if (error) {
        throw new APIError(error.message)
      }

      if (files?.file) {
        req.file = files.file
      }

      if (fields?._payload && typeof fields._payload === 'string') {
        req.data = JSON.parse(fields._payload)
      }

      if (!req.file && fields?.file && typeof fields?.file === 'string') {
        const { clientUploadContext, collectionSlug, filename, mimeType, size } = JSON.parse(
          fields.file,
        )
        const uploadConfig = req.payload.collections[collectionSlug]!.config.upload

        if (!uploadConfig.handlers) {
          throw new APIError('uploadConfig.handlers is not present for ' + collectionSlug)
        }

        let response: null | Response = null
        let error: unknown

        for (const handler of uploadConfig.handlers) {
          try {
            const result = await handler(req, {
              doc: null!,
              params: {
                clientUploadContext, // Pass additional specific to adapters context returned from UploadHandler, then staticHandler can use them.
                collection: collectionSlug,
                filename,
              },
            })
            if (result) {
              response = result
            }
            // If we couldn't get the file from that handler, save the error and try other.
          } catch (err) {
            error = err
          }
        }

        if (!response) {
          if (error) {
            payload.logger.error(error)
          }

          throw new APIError('Expected response from the upload handler.')
        }

        req.file = {
          name: filename,
          clientUploadContext,
          data: Buffer.from(await response.arrayBuffer()),
          mimetype: response.headers.get('Content-Type') || mimeType,
          size,
        }
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: addLocalesToRequest.ts]---
Location: payload-main/packages/payload/src/utilities/addLocalesToRequest.ts

```typescript
import type { SanitizedConfig } from '../config/types.js'
import type { TypedFallbackLocale } from '../index.js'
import type { PayloadRequest } from '../types/index.js'

import { sanitizeFallbackLocale } from './sanitizeFallbackLocale.js'

/**
 * Mutates the Request to contain 'locale' and 'fallbackLocale' based on data or searchParams
 */
export function addLocalesToRequestFromData(req: PayloadRequest): void {
  const {
    data,
    payload: { config },
  } = req

  if (data) {
    const localeOnReq = req.locale
    const fallbackLocaleOnReq = req.fallbackLocale
    let localeFromData!: string
    let fallbackLocaleFromData!: string | string[]

    if (!localeOnReq && data?.locale && typeof data.locale === 'string') {
      localeFromData = data.locale
    }

    if (!fallbackLocaleOnReq) {
      if (data?.['fallback-locale'] && typeof data?.['fallback-locale'] === 'string') {
        fallbackLocaleFromData = data['fallback-locale']
      }

      if (data?.['fallbackLocale'] && typeof data?.['fallbackLocale'] === 'string') {
        fallbackLocaleFromData = data['fallbackLocale']
      }
    }

    if (!localeOnReq || !fallbackLocaleOnReq) {
      const { fallbackLocale, locale } = sanitizeLocales({
        fallbackLocale: fallbackLocaleFromData,
        locale: localeFromData,
        localization: config.localization,
      })

      if (localeFromData) {
        req.locale = locale
      }

      if (fallbackLocaleFromData) {
        req.fallbackLocale = fallbackLocale
      }
    }
  }
}

type SanitizeLocalesArgs = {
  fallbackLocale: TypedFallbackLocale
  locale: string
  localization: SanitizedConfig['localization']
}
type SanitizeLocalesReturn = {
  fallbackLocale?: TypedFallbackLocale
  locale?: string
}
export const sanitizeLocales = ({
  fallbackLocale,
  locale,
  localization,
}: SanitizeLocalesArgs): SanitizeLocalesReturn => {
  // Check if localization has fallback enabled or if a fallback locale is provided

  if (localization) {
    fallbackLocale = sanitizeFallbackLocale({
      fallbackLocale,
      locale,
      localization,
    })!
  }

  if (['*', 'all'].includes(locale)) {
    locale = 'all'
  } else if (localization && !localization.localeCodes.includes(locale) && localization.fallback) {
    locale = localization.defaultLocale
  }

  return {
    fallbackLocale,
    locale,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: addSelectGenericsToGeneratedTypes.spec.ts]---
Location: payload-main/packages/payload/src/utilities/addSelectGenericsToGeneratedTypes.spec.ts

```typescript
import { addSelectGenericsToGeneratedTypes } from './addSelectGenericsToGeneretedTypes.js'

const INPUT_AND_OUTPUT = [
  {
    input: `
/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run \`payload generate:types\` to regenerate this file.
 */

export interface Config {
  auth: {
    users: UserAuthOperations;
  };
  collections: {
    posts: Post;
    users: User;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  collectionsSelect: {
    posts: PostsSelect;
    users: UsersSelect;
    'payload-locked-documents': PayloadLockedDocumentsSelect;
    'payload-preferences': PayloadPreferencesSelect;
    'payload-migrations': PayloadMigrationsSelect;
  };
  db: {
    defaultIDType: string;
  };
  globals: {};
  globalsSelect: {};
  locale: null;
  user: User & {
    collection: 'users';
  };
}
export interface UserAuthOperations {
  forgotPassword: {
    email: string;
    password: string;
  };
  login: {
    email: string;
    password: string;
  };
  registerFirstUser: {
    email: string;
    password: string;
  };
  unlock: {
    email: string;
    password: string;
  };
}
/**
 * This interface was referenced by \`Config\`'s JSON-Schema
 * via the \`definition\` "posts".
 */
export interface Post {
  id: string;
  text?: string | null;
  number?: number | null;
  group?: {
    text?: string | null;
    number?: number | null;
  };
  array?:
    | {
        text?: string | null;
        number?: number | null;
        id?: string | null;
      }[]
    | null;
  blocks?:
    | (
        | {
            text?: string | null;
            introText?: string | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'intro';
          }
        | {
            text?: string | null;
            ctaText?: string | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'cta';
          }
      )[]
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by \`Config\`'s JSON-Schema
 * via the \`definition\` "users".
 */
export interface User {
  id: string;
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password?: string | null;
}
/**
 * This interface was referenced by \`Config\`'s JSON-Schema
 * via the \`definition\` "payload-locked-documents".
 */
export interface PayloadLockedDocument {
  id: string;
  document?:
    | ({
        relationTo: 'posts';
        value: string | Post;
      } | null)
    | ({
        relationTo: 'users';
        value: string | User;
      } | null);
  globalSlug?: string | null;
  user: {
    relationTo: 'users';
    value: string | User;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by \`Config\`'s JSON-Schema
 * via the \`definition\` "payload-preferences".
 */
export interface PayloadPreference {
  id: string;
  user: {
    relationTo: 'users';
    value: string | User;
  };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by \`Config\`'s JSON-Schema
 * via the \`definition\` "payload-migrations".
 */
export interface PayloadMigration {
  id: string;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by \`Config\`'s JSON-Schema
 * via the \`definition\` "posts_select".
 */
export interface PostsSelect {
  text?: boolean;
  number?: boolean;
  sharedGroup?: boolean | SharedGroup;
  group?:
    | boolean
    | {
        text?: boolean;
        number?: boolean;
      };
  array?:
    | boolean
    | {
        text?: boolean;
        number?: boolean;
        id?: boolean;
      };
  blocks?:
    | boolean
    | {
        intro?:
          | boolean
          | {
              text?: boolean;
              introText?: boolean;
              id?: boolean;
              blockName?: boolean;
            };
        cta?:
          | boolean
          | {
              text?: boolean;
              ctaText?: boolean;
              id?: boolean;
              blockName?: boolean;
            };
      };
  updatedAt?: boolean;
  createdAt?: boolean;
}
/**
 * This interface was referenced by \`Config\`'s JSON-Schema
 * via the \`definition\` "users_select".
 */
export interface UsersSelect {
  updatedAt?: boolean;
  createdAt?: boolean;
  email?: boolean;
  resetPasswordToken?: boolean;
  resetPasswordExpiration?: boolean;
  salt?: boolean;
  hash?: boolean;
  loginAttempts?: boolean;
  lockUntil?: boolean;
}
/**
 * This interface was referenced by \`Config\`'s JSON-Schema
 * via the \`definition\` "payload-locked-documents_select".
 */
export interface PayloadLockedDocumentsSelect {
  document?: boolean;
  globalSlug?: boolean;
  user?: boolean;
  updatedAt?: boolean;
  createdAt?: boolean;
}
/**
 * This interface was referenced by \`Config\`'s JSON-Schema
 * via the \`definition\` "payload-preferences_select".
 */
export interface PayloadPreferencesSelect {
  user?: boolean;
  key?: boolean;
  value?: boolean;
  updatedAt?: boolean;
  createdAt?: boolean;
}
/**
 * This interface was referenced by \`Config\`'s JSON-Schema
 * via the \`definition\` "payload-migrations_select".
 */
export interface PayloadMigrationsSelect {
  name?: boolean;
  batch?: boolean;
  updatedAt?: boolean;
  createdAt?: boolean;
}
/**
 * This interface was referenced by \`Config\`'s JSON-Schema
 * via the \`definition\` "auth".
 */
export interface Auth {
  [k: string]: unknown;
}


declare module 'payload' {
  // @ts-ignore 
  export interface GeneratedTypes extends Config {}
}
`,
    output: `
/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run \`payload generate:types\` to regenerate this file.
 */

export interface Config {
  auth: {
    users: UserAuthOperations;
  };
  collections: {
    posts: Post;
    users: User;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  collectionsSelect: {
    posts: PostsSelect<false> | PostsSelect<true>;
    users: UsersSelect<false> | UsersSelect<true>;
    'payload-locked-documents': PayloadLockedDocumentsSelect<false> | PayloadLockedDocumentsSelect<true>;
    'payload-preferences': PayloadPreferencesSelect<false> | PayloadPreferencesSelect<true>;
    'payload-migrations': PayloadMigrationsSelect<false> | PayloadMigrationsSelect<true>;
  };
  db: {
    defaultIDType: string;
  };
  globals: {};
  globalsSelect: {};
  locale: null;
  user: User & {
    collection: 'users';
  };
}
export interface UserAuthOperations {
  forgotPassword: {
    email: string;
    password: string;
  };
  login: {
    email: string;
    password: string;
  };
  registerFirstUser: {
    email: string;
    password: string;
  };
  unlock: {
    email: string;
    password: string;
  };
}
/**
 * This interface was referenced by \`Config\`'s JSON-Schema
 * via the \`definition\` "posts".
 */
export interface Post {
  id: string;
  text?: string | null;
  number?: number | null;
  group?: {
    text?: string | null;
    number?: number | null;
  };
  array?:
    | {
        text?: string | null;
        number?: number | null;
        id?: string | null;
      }[]
    | null;
  blocks?:
    | (
        | {
            text?: string | null;
            introText?: string | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'intro';
          }
        | {
            text?: string | null;
            ctaText?: string | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'cta';
          }
      )[]
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by \`Config\`'s JSON-Schema
 * via the \`definition\` "users".
 */
export interface User {
  id: string;
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password?: string | null;
}
/**
 * This interface was referenced by \`Config\`'s JSON-Schema
 * via the \`definition\` "payload-locked-documents".
 */
export interface PayloadLockedDocument {
  id: string;
  document?:
    | ({
        relationTo: 'posts';
        value: string | Post;
      } | null)
    | ({
        relationTo: 'users';
        value: string | User;
      } | null);
  globalSlug?: string | null;
  user: {
    relationTo: 'users';
    value: string | User;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by \`Config\`'s JSON-Schema
 * via the \`definition\` "payload-preferences".
 */
export interface PayloadPreference {
  id: string;
  user: {
    relationTo: 'users';
    value: string | User;
  };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by \`Config\`'s JSON-Schema
 * via the \`definition\` "payload-migrations".
 */
export interface PayloadMigration {
  id: string;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by \`Config\`'s JSON-Schema
 * via the \`definition\` "posts_select".
 */
export interface PostsSelect<T extends boolean = true> {
  text?: T;
  number?: T;
  sharedGroup?: T | SharedGroup<T>;
  group?:
    | T
    | {
        text?: T;
        number?: T;
      };
  array?:
    | T
    | {
        text?: T;
        number?: T;
        id?: T;
      };
  blocks?:
    | T
    | {
        intro?:
          | T
          | {
              text?: T;
              introText?: T;
              id?: T;
              blockName?: T;
            };
        cta?:
          | T
          | {
              text?: T;
              ctaText?: T;
              id?: T;
              blockName?: T;
            };
      };
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by \`Config\`'s JSON-Schema
 * via the \`definition\` "users_select".
 */
export interface UsersSelect<T extends boolean = true> {
  updatedAt?: T;
  createdAt?: T;
  email?: T;
  resetPasswordToken?: T;
  resetPasswordExpiration?: T;
  salt?: T;
  hash?: T;
  loginAttempts?: T;
  lockUntil?: T;
}
/**
 * This interface was referenced by \`Config\`'s JSON-Schema
 * via the \`definition\` "payload-locked-documents_select".
 */
export interface PayloadLockedDocumentsSelect<T extends boolean = true> {
  document?: T;
  globalSlug?: T;
  user?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by \`Config\`'s JSON-Schema
 * via the \`definition\` "payload-preferences_select".
 */
export interface PayloadPreferencesSelect<T extends boolean = true> {
  user?: T;
  key?: T;
  value?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by \`Config\`'s JSON-Schema
 * via the \`definition\` "payload-migrations_select".
 */
export interface PayloadMigrationsSelect<T extends boolean = true> {
  name?: T;
  batch?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by \`Config\`'s JSON-Schema
 * via the \`definition\` "auth".
 */
export interface Auth {
  [k: string]: unknown;
}


declare module 'payload' {
  // @ts-ignore 
  export interface GeneratedTypes extends Config {}
}
`,
  },
]

describe('addSelectGenericsToGeneratedTypes', () => {
  it('should match return of given input with output', () => {
    for (const { input, output } of INPUT_AND_OUTPUT) {
      expect(
        addSelectGenericsToGeneratedTypes({
          compiledGeneratedTypes: input,
        }),
      ).toStrictEqual(output)
    }
  })
})
```

--------------------------------------------------------------------------------

---[FILE: addSelectGenericsToGeneretedTypes.ts]---
Location: payload-main/packages/payload/src/utilities/addSelectGenericsToGeneretedTypes.ts

```typescript
export const addSelectGenericsToGeneratedTypes = ({
  compiledGeneratedTypes,
}: {
  compiledGeneratedTypes: string
}) => {
  const modifiedLines: string[] = []

  let isCollectionsSelectToken = false
  let isSelectTypeToken = false

  for (const line of compiledGeneratedTypes.split('\n')) {
    let newLine = line
    if (line === `  collectionsSelect: {` || line === `  globalsSelect: {`) {
      isCollectionsSelectToken = true
    }

    if (isCollectionsSelectToken) {
      if (line === '  };') {
        isCollectionsSelectToken = false
      } else {
        // replace <posts: PostsSelect;> with <posts: PostsSelect<true> | PostsSelect<false;>
        newLine = line.replace(/(['"]?\w+['"]?):\s*(\w+);/g, (_, variable, type) => {
          return `${variable}: ${type}<false> | ${type}<true>;`
        })
      }
    }

    // eslint-disable-next-line regexp/no-unused-capturing-group
    if (line.match(/via the `definition` "([\w-]+_select)"/g)) {
      isSelectTypeToken = true
    }

    if (isSelectTypeToken) {
      if (line.startsWith('export interface')) {
        // add generic to the interface
        newLine = line.replace(/(export interface\s+\w+)(\s*\{)/g, '$1<T extends boolean = true>$2')
      } else {
        newLine = line
          // replace booleans with T on the line
          .replace(/(?<!\?)\bboolean\b/g, 'T')
          // replace interface names like CtaBlock to CtaBlock<T>
          .replace(
            /\b(\w+)\s*\|\s*(\w+)\b/g,
            (_match, left, right) => `${left} | ${right}<${left}>`,
          )

        if (line === '}') {
          isSelectTypeToken = false
        }
      }
    }

    modifiedLines.push(newLine)
  }

  return modifiedLines.join('\n')
}
```

--------------------------------------------------------------------------------

---[FILE: appendNonTrashedFilter.ts]---
Location: payload-main/packages/payload/src/utilities/appendNonTrashedFilter.ts

```typescript
import type { Where } from '../types/index.js'

export const appendNonTrashedFilter = ({
  deletedAtPath = 'deletedAt',
  enableTrash,
  trash,
  where,
}: {
  deletedAtPath?: string
  enableTrash: boolean
  trash?: boolean
  where: Where
}): Where => {
  if (!enableTrash || trash) {
    return where
  }

  const notTrashedFilter = {
    [deletedAtPath]: { exists: false },
  }

  if (where?.and) {
    return {
      ...where,
      and: [...where.and, notTrashedFilter],
    }
  }

  return {
    and: [notTrashedFilter, ...(where ? [where] : [])],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: appendUploadSelectFields.ts]---
Location: payload-main/packages/payload/src/utilities/appendUploadSelectFields.ts

```typescript
import type { ClientCollectionConfig, SanitizedCollectionConfig, SelectType } from '../index.js'

/**
 * Mutates the incoming select object to append fields required for upload thumbnails
 * @param collectionConfig
 * @param select
 */
export const appendUploadSelectFields = ({
  collectionConfig,
  select,
}: {
  collectionConfig: ClientCollectionConfig | SanitizedCollectionConfig
  select: SelectType
}) => {
  if (!collectionConfig.upload || !select) {
    return
  }

  select.mimeType = true
  select.thumbnailURL = true

  if (collectionConfig.upload.imageSizes && collectionConfig.upload.imageSizes.length > 0) {
    if (
      collectionConfig.upload.adminThumbnail &&
      typeof collectionConfig.upload.adminThumbnail === 'string'
    ) {
      /** Only return image size properties that are required to generate the adminThumbnailURL */
      select.sizes = {
        [collectionConfig.upload.adminThumbnail]: {
          filename: true,
        },
      }
    } else {
      /** Only return image size properties that are required for thumbnails */
      select.sizes = collectionConfig.upload.imageSizes.reduce((acc, imageSizeConfig) => {
        return {
          ...acc,
          [imageSizeConfig.name]: {
            filename: true,
            url: true,
            width: true,
          },
        }
      }, {})
    }
  } else {
    select.url = true
  }
}
```

--------------------------------------------------------------------------------

---[FILE: applyLocaleFiltering.ts]---
Location: payload-main/packages/payload/src/utilities/applyLocaleFiltering.ts

```typescript
import type { ClientConfig } from '../config/client.js'
import type { SanitizedConfig } from '../config/types.js'
import type { PayloadRequest } from '../types/index.js'

export async function applyLocaleFiltering({
  clientConfig,
  config,
  req,
}: {
  clientConfig: ClientConfig
  config: SanitizedConfig
  req: PayloadRequest
}): Promise<void> {
  if (
    !clientConfig.localization ||
    !config.localization ||
    typeof config.localization.filterAvailableLocales !== 'function'
  ) {
    return
  }

  const filteredLocales = (
    await config.localization.filterAvailableLocales({
      locales: config.localization.locales,
      req,
    })
  ).map(({ toString, ...rest }) => rest)

  clientConfig.localization.localeCodes = filteredLocales.map(({ code }) => code)
  clientConfig.localization.locales = filteredLocales
}
```

--------------------------------------------------------------------------------

---[FILE: canAccessAdmin.ts]---
Location: payload-main/packages/payload/src/utilities/canAccessAdmin.ts

```typescript
import type { PayloadRequest } from '../types/index.js'

import { UnauthorizedError } from '../errors/UnauthorizedError.js'

/**
 * Protects admin-only routes, server functions, etc.
 * The requesting user must either:
 * a. pass the `access.admin` function on the `users` collection, if defined
 * b. match the `config.admin.user` property on the Payload config
 * c. if no user is present, and there are no users in the system, allow access (for first user creation)
 * @throws {Error} Throws an `Unauthorized` error if access is denied that can be explicitly caught
 */
export const canAccessAdmin = async ({ req }: { req: PayloadRequest }) => {
  const incomingUserSlug = req.user?.collection
  const adminUserSlug = req.payload.config.admin.user

  if (incomingUserSlug) {
    const adminAccessFn = req.payload.collections[incomingUserSlug]?.config.access?.admin

    if (adminAccessFn) {
      const canAccess = await adminAccessFn({ req })

      if (!canAccess) {
        throw new UnauthorizedError()
      }
      // Match the user collection to the global admin config
    } else if (adminUserSlug !== incomingUserSlug) {
      throw new UnauthorizedError()
    }
  } else {
    const hasUsers = await req.payload.find({
      collection: adminUserSlug,
      depth: 0,
      limit: 1,
      pagination: false,
    })

    // If there are users, we should not allow access because of `/create-first-user`
    if (hasUsers.docs.length) {
      throw new UnauthorizedError()
    }
  }
}
```

--------------------------------------------------------------------------------

````
