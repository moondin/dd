---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 216
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 216 of 695)

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

---[FILE: types.ts]---
Location: payload-main/packages/payload/src/uploads/types.ts

```typescript
import type { ResizeOptions, Sharp, SharpOptions } from 'sharp'

import type { CollectionConfig, TypeWithID } from '../collections/config/types.js'
import type { PayloadComponent } from '../config/types.js'
import type { PayloadRequest } from '../types/index.js'
import type { WithMetadata } from './optionallyAppendMetadata.js'

export type FileSize = {
  filename: null | string
  filesize: null | number
  height: null | number
  mimeType: null | string
  width: null | number
}

// TODO: deprecate in Payload v4.
/**
 * FileSizeImproved is a more precise type, and will replace FileSize in Payload v4.
 * This type is for internal use only as it will be deprecated in the future.
 * @internal
 */
export type FileSizeImproved = {
  url: null | string
} & FileSize

export type FileSizes = {
  [size: string]: FileSize
}

export type FileData = {
  filename: string
  filesize: number
  focalX?: number
  focalY?: number
  height: number
  mimeType: string
  sizes: FileSizes
  tempFilePath?: string
  url?: string
  width: number
}

export type ProbedImageSize = {
  height: number
  width: number
}

/**
 * Params sent to the sharp `toFormat()` function
 * @link https://sharp.pixelplumbing.com/api-output#toformat
 */
export type ImageUploadFormatOptions = {
  format: Parameters<Sharp['toFormat']>[0]
  options?: Parameters<Sharp['toFormat']>[1]
}

/**
 * Params sent to the sharp trim() function
 * @link https://sharp.pixelplumbing.com/api-resize#trim
 */
export type ImageUploadTrimOptions = Parameters<Sharp['trim']>[0]

export type GenerateImageName = (args: {
  extension: string
  height: number
  originalName: string
  sizeName: string
  width: number
}) => string

export type ImageSize = {
  /**
   * Admin UI options that control how this image size appears in list views.
   *
   * NOTE: In Payload v4, these options (`disableGroupBy`, `disableListColumn` and `disableListFilter`)
   * should default to `true` so image size subfields are hidden from list columns
   * and filters by default, reducing noise in the admin UI.
   */
  admin?: {
    /**
     * If set to true, this image size will not be available
     * as a selectable groupBy option in the collection list view.
     * @default false
     */
    disableGroupBy?: boolean
    /**
     * If set to true, this image size will not be available
     * as a selectable column in the collection list view.
     * @default false
     */
    disableListColumn?: boolean
    /**
     * If set to true, this image size will not be available
     * as a filter option in the collection list view.
     * @default false
     */
    disableListFilter?: boolean
  }
  /**
   * @deprecated prefer position
   */
  crop?: string // comes from sharp package
  formatOptions?: ImageUploadFormatOptions
  /**
   * Generate a custom name for the file of this image size.
   */
  generateImageName?: GenerateImageName
  name: string
  trimOptions?: ImageUploadTrimOptions
  /**
   * When an uploaded image is smaller than the defined image size, we have 3 options:
   *
   * `undefined | false | true`
   *
   * 1. `undefined` [default]: uploading images with smaller width AND height than the image size will return null
   * 2. `false`: always enlarge images to the image size
   * 3. `true`: if the image is smaller than the image size, return the original image
   */
  withoutEnlargement?: ResizeOptions['withoutEnlargement']
} & Omit<ResizeOptions, 'withoutEnlargement'>

export type GetAdminThumbnail = (args: { doc: Record<string, unknown> }) => false | null | string

export type AllowList = Array<{
  hostname: string
  pathname?: string
  port?: string
  protocol?: 'http' | 'https'
  search?: string
}>

export type FileAllowList = Array<{
  extensions: string[]
  mimeType: string
}>

type Admin = {
  components?: {
    /**
     * The Controls component to extend the upload controls in the admin panel.
     */
    controls?: PayloadComponent[]
  }
}

export type UploadConfig = {
  /**
   * The adapter name to use for uploads. Used for storage adapter telemetry.
   * @default undefined
   */
  adapter?: string
  /**
   * The admin configuration for the upload field.
   */
  admin?: Admin
  /**
   * Represents an admin thumbnail, which can be either a React component or a string.
   * - If a string, it should be one of the image size names.
   * - A function that generates a fully qualified URL for the thumbnail, receives the doc as the only argument.
   **/
  adminThumbnail?: GetAdminThumbnail | string
  /**
   * Allow restricted file types known to be problematic.
   * - If set to `true`, it will allow all file types.
   * - If set to `false`, it will not allow file types and extensions known to be problematic.
   * - This setting is overriden by the `mimeTypes` option.
   * @default false
   */
  allowRestrictedFileTypes?: boolean
  /**
   * Enables bulk upload of files from the list view.
   * @default true
   */
  bulkUpload?: boolean
  /**
   * Appends a cache tag to the image URL when fetching the thumbnail in the admin panel. It may be desirable to disable this when hosting via CDNs with strict parameters.
   *
   * @default true
   */
  cacheTags?: boolean
  /**
   * Sharp constructor options to be passed to the uploaded file.
   * @link https://sharp.pixelplumbing.com/api-constructor/#sharp
   */
  constructorOptions?: SharpOptions
  /**
   * Enables cropping of images.
   * @default true
   */
  crop?: boolean
  /**
   * Disable the ability to save files to disk.
   * @default false
   */
  disableLocalStorage?: boolean
  /**
   * Enable displaying preview of the uploaded file in Upload fields related to this Collection.
   * Can be locally overridden by `displayPreview` option in Upload field.
   * @default false
   */
  displayPreview?: boolean
  /**
   *
   * Accepts existing headers and returns the headers after filtering or modifying.
   * If using this option, you should handle the removal of any sensitive cookies
   * (like payload-prefixed cookies) to prevent leaking session information to external
   * services. By default, Payload automatically filters out payload-prefixed cookies
   * when this option is NOT defined.
   *
   * Useful for adding custom headers to fetch from external providers.
   * @default undefined
   */
  externalFileHeaderFilter?: (headers: Record<string, string>) => Record<string, string>
  /**
   * Field slugs to use for a compound index instead of the default filename index.
   */
  filenameCompoundIndex?: string[]
  /**
   * Require files to be uploaded when creating a document.
   * @default true
   */
  filesRequiredOnCreate?: boolean
  /**
   * Enables focal point positioning for image manipulation.
   * @default false
   */
  focalPoint?: boolean
  /**
   * Format options for the uploaded file. Formatting image sizes needs to be done within each formatOptions individually.
   */
  formatOptions?: ImageUploadFormatOptions
  /**
   * Custom handlers to run when a file is fetched.
   *
   * - If a handler returns a Response, the response will be sent to the client and no further handlers will be run.
   * - If a handler returns null, the next handler will be run.
   * - If no handlers return a response the file will be returned by default.
   *
   * @link https://sharp.pixelplumbing.com/api-output/#toformat
   * @default undefined
   */
  handlers?: ((
    req: PayloadRequest,
    args: {
      doc: TypeWithID
      headers?: Headers
      params: { clientUploadContext?: unknown; collection: string; filename: string }
    },
  ) => Promise<Response> | Promise<void> | Response | void)[]
  /**
   * Set to `true` to prevent the admin UI from showing file inputs during document creation, useful for programmatic file generation.
   */
  hideFileInputOnCreate?: boolean
  /**
   * Set to `true` to prevent the admin UI having a way to remove an existing file while editing.
   */
  hideRemoveFile?: boolean
  imageSizes?: ImageSize[]
  /**
   * Restrict mimeTypes in the file picker. Array of valid mime types or mimetype wildcards
   * @example ['image/*', 'application/pdf']
   * @default undefined
   */
  mimeTypes?: string[]
  /**
   * Ability to modify the response headers fetching a file.
   * @default undefined
   */
  modifyResponseHeaders?: ({ headers }: { headers: Headers }) => Headers | void
  /**
   * Controls the behavior of pasting/uploading files from URLs.
   * If set to `false`, fetching from remote URLs is disabled.
   * If an `allowList` is provided, server-side fetching will be enabled for specified URLs.
   *
   * @default true (client-side fetching enabled)
   */
  pasteURL?:
    | {
        allowList: AllowList
      }
    | false
  /**
   * Sharp resize options for the original image.
   * @link https://sharp.pixelplumbing.com/api-resize#resize
   * @default undefined
   */
  resizeOptions?: ResizeOptions
  /**
   *  Skip safe fetch when using server-side fetching for external files from these URLs.
   *  @default false
   */
  skipSafeFetch?: AllowList | boolean
  /**
   * The directory to serve static files from. Defaults to collection slug.
   * @default undefined
   */
  staticDir?: string
  trimOptions?: ImageUploadTrimOptions
  /**
   * Optionally append metadata to the image during processing.
   *
   * Can be a boolean or a function.
   *
   * If true, metadata will be appended to the image.
   * If false, no metadata will be appended.
   * If a function, it will receive an object containing the metadata and should return a boolean indicating whether to append the metadata.
   * @default false
   */
  withMetadata?: WithMetadata
}
export type checkFileRestrictionsParams = {
  collection: CollectionConfig
  file: File
  req: PayloadRequest
}

export type SanitizedUploadConfig = {
  staticDir: UploadConfig['staticDir']
} & UploadConfig

export type File = {
  /**
   * The buffer of the file.
   */
  data: Buffer
  /**
   * The mimetype of the file.
   */
  mimetype: string
  /**
   * The name of the file.
   */
  name: string
  /**
   * The size of the file in bytes.
   */
  size: number
}

export type FileToSave = {
  /**
   * The buffer of the file.
   */
  buffer: Buffer
  /**
   * The path to save the file.
   */
  path: string
}

type Crop = {
  height: number
  unit: '%' | 'px'
  width: number
  x: number
  y: number
}

type FocalPoint = {
  x: number
  y: number
}

export type UploadEdits = {
  crop?: Crop
  focalPoint?: FocalPoint
  heightInPixels?: number
  widthInPixels?: number
}
```

--------------------------------------------------------------------------------

---[FILE: unlinkTempFiles.ts]---
Location: payload-main/packages/payload/src/uploads/unlinkTempFiles.ts

```typescript
import fs from 'fs/promises'

import type { SanitizedCollectionConfig } from '../collections/config/types.js'
import type { SanitizedConfig } from '../config/types.js'
import type { PayloadRequest } from '../types/index.js'

import { mapAsync } from '../utilities/mapAsync.js'

type Args = {
  collectionConfig: SanitizedCollectionConfig
  config: SanitizedConfig
  req: PayloadRequest
}
/**
 * Cleanup temp files after operation lifecycle
 */
export const unlinkTempFiles: (args: Args) => Promise<void> = async ({
  collectionConfig,
  config,
  req,
}) => {
  if (config.upload?.useTempFiles && collectionConfig.upload) {
    const { file } = req
    const fileArray = [{ file }]
    await mapAsync(fileArray, async ({ file }) => {
      // Still need this check because this will not be populated if using local API
      if (file?.tempFilePath) {
        await fs.unlink(file.tempFilePath)
      }
    })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: uploadFiles.ts]---
Location: payload-main/packages/payload/src/uploads/uploadFiles.ts

```typescript
import type { Payload } from '../index.js'
import type { PayloadRequest } from '../types/index.js'
import type { FileToSave } from './types.js'

import { FileUploadError } from '../errors/index.js'
import { saveBufferToFile } from './saveBufferToFile.js'

export const uploadFiles = async (
  payload: Payload,
  files: FileToSave[],
  req: PayloadRequest,
): Promise<void> => {
  try {
    await Promise.all(
      files.map(async ({ buffer, path }) => {
        await saveBufferToFile(buffer, path)
      }),
    )
  } catch (err) {
    payload.logger.error(err)
    throw new FileUploadError(req.t)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: getFile.ts]---
Location: payload-main/packages/payload/src/uploads/endpoints/getFile.ts

```typescript
import type { Stats } from 'fs'

import { fileTypeFromFile } from 'file-type'
import fsPromises from 'fs/promises'
import { status as httpStatus } from 'http-status'
import path from 'path'

import type { PayloadHandler } from '../../config/types.js'

import { APIError } from '../../errors/APIError.js'
import { checkFileAccess } from '../../uploads/checkFileAccess.js'
import { streamFile } from '../../uploads/fetchAPI-stream-file/index.js'
import { getFileTypeFallback } from '../../uploads/getFileTypeFallback.js'
import { parseRangeHeader } from '../../uploads/parseRangeHeader.js'
import { getRequestCollection } from '../../utilities/getRequestEntity.js'
import { headersWithCors } from '../../utilities/headersWithCors.js'

export const getFileHandler: PayloadHandler = async (req) => {
  const collection = getRequestCollection(req)

  const filename = req.routeParams?.filename as string

  if (!collection.config.upload) {
    throw new APIError(
      `This collection is not an upload collection: ${collection.config.slug}`,
      httpStatus.BAD_REQUEST,
    )
  }

  const accessResult = (await checkFileAccess({
    collection,
    filename,
    req,
  }))!

  if (accessResult instanceof Response) {
    return accessResult
  }

  if (collection.config.upload.handlers?.length) {
    let customResponse: null | Response | void = null
    const headers = new Headers()

    for (const handler of collection.config.upload.handlers) {
      customResponse = await handler(req, {
        doc: accessResult,
        headers,
        params: {
          collection: collection.config.slug,
          filename,
        },
      })
      if (customResponse && customResponse instanceof Response) {
        break
      }
    }

    if (customResponse instanceof Response) {
      return customResponse
    }
  }

  const fileDir = collection.config.upload?.staticDir || collection.config.slug
  const filePath = path.resolve(`${fileDir}/${filename}`)
  let stats: Stats

  try {
    stats = await fsPromises.stat(filePath)
  } catch (err) {
    if ((err as { code?: string }).code === 'ENOENT') {
      req.payload.logger.error(
        `File ${filename} for collection ${collection.config.slug} is missing on the disk. Expected path: ${filePath}`,
      )

      // Omit going to the routeError handler by returning response instead of
      // throwing an error to cut down log noise. The response still matches what you get with APIError to not leak details to the user.
      return Response.json(
        {
          errors: [
            {
              message: 'Something went wrong.',
            },
          ],
        },
        {
          headers: headersWithCors({
            headers: new Headers(),
            req,
          }),
          status: 500,
        },
      )
    }

    throw err
  }

  const fileTypeResult = (await fileTypeFromFile(filePath)) || getFileTypeFallback(filePath)
  let mimeType = fileTypeResult.mime

  if (filePath.endsWith('.svg') && fileTypeResult.mime === 'application/xml') {
    mimeType = 'image/svg+xml'
  }

  // Parse Range header for byte range requests
  const rangeHeader = req.headers.get('range')
  const rangeResult = parseRangeHeader({
    fileSize: stats.size,
    rangeHeader,
  })

  if (rangeResult.type === 'invalid') {
    let headers = new Headers()
    headers.set('Content-Range', `bytes */${stats.size}`)
    headers = collection.config.upload?.modifyResponseHeaders
      ? collection.config.upload.modifyResponseHeaders({ headers }) || headers
      : headers

    return new Response(null, {
      headers: headersWithCors({
        headers,
        req,
      }),
      status: httpStatus.REQUESTED_RANGE_NOT_SATISFIABLE,
    })
  }

  let headers = new Headers()
  headers.set('Content-Type', mimeType)
  headers.set('Accept-Ranges', 'bytes')

  let data: ReadableStream
  let status: number
  const isPartial = rangeResult.type === 'partial'
  const range = rangeResult.range

  if (isPartial && range) {
    const contentLength = range.end - range.start + 1
    headers.set('Content-Length', String(contentLength))
    headers.set('Content-Range', `bytes ${range.start}-${range.end}/${stats.size}`)
    data = streamFile({ filePath, options: { end: range.end, start: range.start } })
    status = httpStatus.PARTIAL_CONTENT
  } else {
    headers.set('Content-Length', String(stats.size))
    data = streamFile({ filePath })
    status = httpStatus.OK
  }

  headers = collection.config.upload?.modifyResponseHeaders
    ? collection.config.upload.modifyResponseHeaders({ headers }) || headers
    : headers

  return new Response(data, {
    headers: headersWithCors({
      headers,
      req,
    }),
    status,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: getFileFromURL.ts]---
Location: payload-main/packages/payload/src/uploads/endpoints/getFileFromURL.ts

```typescript
import type { PayloadHandler } from '../../config/types.js'

import { executeAccess } from '../../auth/executeAccess.js'
import { APIError } from '../../errors/APIError.js'
import { Forbidden } from '../../errors/Forbidden.js'
import { getRequestCollectionWithID } from '../../utilities/getRequestEntity.js'
import { isURLAllowed } from '../../utilities/isURLAllowed.js'

// If doc id is provided, it means we are updating the doc
// /:collectionSlug/paste-url/:doc-id?src=:fileUrl

// If doc id is not provided, it means we are creating a new doc
// /:collectionSlug/paste-url?src=:fileUrl

export const getFileFromURLHandler: PayloadHandler = async (req) => {
  const { id, collection } = getRequestCollectionWithID(req, { optionalID: true })

  if (!req.user) {
    throw new Forbidden(req.t)
  }

  const config = collection?.config

  if (id) {
    // updating doc
    const accessResult = await executeAccess({ req }, config.access.update)
    if (!accessResult) {
      throw new Forbidden(req.t)
    }
  } else {
    // creating doc
    const accessResult = await executeAccess({ req }, config.access?.create)
    if (!accessResult) {
      throw new Forbidden(req.t)
    }
  }
  try {
    if (!req.url) {
      throw new APIError('Request URL is missing.', 400)
    }

    const { searchParams } = new URL(req.url)
    const src = searchParams.get('src')

    if (!src || typeof src !== 'string') {
      throw new APIError('A valid URL string is required.', 400)
    }

    const validatedUrl = new URL(src)

    if (
      typeof config.upload?.pasteURL === 'object' &&
      !isURLAllowed(validatedUrl.href, config.upload.pasteURL.allowList)
    ) {
      throw new APIError(`The provided URL (${validatedUrl.href}) is not allowed.`, 400)
    }

    // Fetch the file with no compression
    const response = await fetch(validatedUrl.href, {
      headers: {
        'Accept-Encoding': 'identity',
      },
    })

    if (!response.ok) {
      throw new APIError(`Failed to fetch file from ${validatedUrl.href}`, response.status)
    }

    const decodedFileName = decodeURIComponent(validatedUrl.pathname.split('/').pop() || '')

    return new Response(response.body, {
      headers: {
        'Content-Disposition': `attachment; filename="${decodedFileName}"`,
        'Content-Length': response.headers.get('content-length') || '',
        'Content-Type': response.headers.get('content-type') || 'application/octet-stream',
      },
    })
  } catch (err) {
    throw new APIError(
      `Error fetching file: ${err instanceof Error ? err.message : 'Unknown error'}`,
      500,
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/payload/src/uploads/endpoints/index.ts

```typescript
import type { Endpoint } from '../../config/types.js'

import { wrapInternalEndpoints } from '../../utilities/wrapInternalEndpoints.js'
import { getFileHandler } from './getFile.js'
import { getFileFromURLHandler } from './getFileFromURL.js'

export const uploadCollectionEndpoints: Endpoint[] = wrapInternalEndpoints([
  {
    handler: getFileFromURLHandler,
    method: 'get',
    path: '/paste-url/:id?',
  },
  {
    handler: getFileHandler,
    method: 'get',
    path: '/file/:filename',
  },
])
```

--------------------------------------------------------------------------------

---[FILE: fileFactory.ts]---
Location: payload-main/packages/payload/src/uploads/fetchAPI-multipart/fileFactory.ts

```typescript
import type { FetchAPIFileUploadOptions } from '../../config/types.js'
import type { FileShape } from './index.js'

import {
  checkAndMakeDir,
  debugLog,
  isFunc,
  moveFile,
  promiseCallback,
  saveBufferToFile,
} from './utilities.js'

type MoveFile = (
  filePath: string,
  options: FileFactoryOptions,
  fileUploadOptions: FetchAPIFileUploadOptions,
) => (resolve: () => void, reject: () => void) => void

/**
 * Returns Local function that moves the file to a different location on the filesystem
 * which takes two function arguments to make it compatible w/ Promise or Callback APIs
 */
const moveFromTemp: MoveFile = (filePath, options, fileUploadOptions) => (resolve, reject) => {
  debugLog(fileUploadOptions, `Moving temporary file ${options.tempFilePath} to ${filePath}`)
  moveFile(options.tempFilePath, filePath, promiseCallback(resolve, reject))
}

/**
 * Returns Local function that moves the file from buffer to a different location on the filesystem
 * which takes two function arguments to make it compatible w/ Promise or Callback APIs
 */
const moveFromBuffer: MoveFile = (filePath, options, fileUploadOptions) => (resolve, reject) => {
  debugLog(fileUploadOptions, `Moving uploaded buffer to ${filePath}`)
  // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
  saveBufferToFile(options.buffer, filePath, promiseCallback(resolve, reject))
}

type FileFactoryOptions = {
  buffer: Buffer
  encoding: string
  hash: Buffer | string
  mimetype: string
  name: string
  size: number
  tempFilePath: string
  truncated: boolean
}
type FileFactory = (
  options: FileFactoryOptions,
  fileUploadOptions: FetchAPIFileUploadOptions,
) => FileShape
export const fileFactory: FileFactory = (options, fileUploadOptions) => {
  // see: https://github.com/richardgirges/express-fileupload/issues/14
  // firefox uploads empty file in case of cache miss when f5ing page.
  // resulting in unexpected behavior. if there is no file data, the file is invalid.
  // if (!fileUploadOptions.useTempFiles && !options.buffer.length) return;

  // Create and return file object.
  return {
    name: options.name,
    data: options.buffer,
    encoding: options.encoding,
    md5: options.hash,
    mimetype: options.mimetype,
    mv: (filePath: string, callback) => {
      // Define a proper move function.
      const moveFunc = fileUploadOptions.useTempFiles
        ? moveFromTemp(filePath, options, fileUploadOptions)
        : moveFromBuffer(filePath, options, fileUploadOptions)
      // Create a folder for a file.
      checkAndMakeDir(fileUploadOptions, filePath)
      // If callback is passed in, use the callback API, otherwise return a promise.
      const defaultReject = () => undefined
      return isFunc(callback) ? moveFunc(callback, defaultReject) : new Promise(moveFunc)
    },
    size: options.size,
    tempFilePath: options.tempFilePath,
    truncated: options.truncated,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: handlers.ts]---
Location: payload-main/packages/payload/src/uploads/fetchAPI-multipart/handlers.ts

```typescript
import crypto from 'crypto'
import fs, { WriteStream } from 'fs'
import path from 'path'

import type { FetchAPIFileUploadOptions } from '../../config/types.js'

import { checkAndMakeDir, debugLog, deleteFile, getTempFilename } from './utilities.js'

type Handler = (
  options: FetchAPIFileUploadOptions,
  fieldname: string,
  filename: string,
) => {
  cleanup: () => void
  complete: () => Buffer
  dataHandler: (data: Buffer) => void
  getFilePath: () => string
  getFileSize: () => number
  getHash: () => string
  getWritePromise: () => Promise<boolean>
}

export const tempFileHandler: Handler = (options, fieldname, filename) => {
  const dir = path.normalize(options.tempFileDir!)
  const tempFilePath = path.join(process.cwd(), dir, getTempFilename())
  checkAndMakeDir({ createParentPath: true }, tempFilePath)

  debugLog(options, `Temporary file path is ${tempFilePath}`)

  const hash = crypto.createHash('md5')
  let fileSize = 0
  let completed = false

  debugLog(options, `Opening write stream for ${fieldname}->${filename}...`)
  const writeStream = fs.createWriteStream(tempFilePath)
  const writePromise = new Promise<boolean>((resolve, reject) => {
    writeStream.on('finish', () => resolve(true))
    writeStream.on('error', (err) => {
      debugLog(options, `Error write temp file: ${err}`)
      reject(err)
    })
  })

  return {
    cleanup: () => {
      completed = true
      debugLog(options, `Cleaning up temporary file ${tempFilePath}...`)
      writeStream.end()
      deleteFile(tempFilePath, (err) =>
        err
          ? debugLog(options, `Cleaning up temporary file ${tempFilePath} failed: ${err}`)
          : debugLog(options, `Cleaning up temporary file ${tempFilePath} done.`),
      )
    },
    complete: () => {
      completed = true
      debugLog(options, `Upload ${fieldname}->${filename} completed, bytes:${fileSize}.`)
      if (writeStream instanceof WriteStream) {
        writeStream.end()
      }
      // Return empty buff since data was uploaded into a temp file.
      return Buffer.concat([])
    },
    dataHandler: (data) => {
      if (completed === true) {
        debugLog(options, `Error: got ${fieldname}->${filename} data chunk for completed upload!`)
        return
      }
      writeStream.write(data)
      hash.update(data)
      fileSize += data.length
      debugLog(options, `Uploading ${fieldname}->${filename}, bytes:${fileSize}...`)
    },
    getFilePath: () => tempFilePath,
    getFileSize: () => fileSize,
    getHash: () => hash.digest('hex'),
    getWritePromise: () => writePromise,
  }
}

export const memHandler: Handler = (options, fieldname, filename) => {
  const buffers: Buffer[] = []
  const hash = crypto.createHash('md5')
  let fileSize = 0
  let completed = false

  const getBuffer = () => Buffer.concat(buffers, fileSize)

  return {
    cleanup: () => {
      completed = true
    },
    complete: () => {
      debugLog(options, `Upload ${fieldname}->${filename} completed, bytes:${fileSize}.`)
      completed = true
      return getBuffer()
    },
    dataHandler: (data) => {
      if (completed === true) {
        debugLog(options, `Error: got ${fieldname}->${filename} data chunk for completed upload!`)
        return
      }
      buffers.push(data)
      hash.update(data)
      fileSize += data.length
      debugLog(options, `Uploading ${fieldname}->${filename}, bytes:${fileSize}...`)
    },
    getFilePath: () => '',
    getFileSize: () => fileSize,
    getHash: () => hash.digest('hex'),
    getWritePromise: () => Promise.resolve(true),
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/payload/src/uploads/fetchAPI-multipart/index.ts

```typescript
import path from 'path'

import type { FetchAPIFileUploadOptions } from '../../config/types.js'

import { APIError } from '../../errors/APIError.js'
import { isEligibleRequest } from './isEligibleRequest.js'
import { processMultipart } from './processMultipart.js'
import { debugLog } from './utilities.js'

const DEFAULT_UPLOAD_OPTIONS: FetchAPIFileUploadOptions = {
  abortOnLimit: false,
  createParentPath: false,
  debug: false,
  defParamCharset: 'utf8',
  limitHandler: false,
  parseNested: false,
  preserveExtension: false,
  responseOnLimit: 'File size limit has been reached',
  safeFileNames: false,
  tempFileDir: path.join(process.cwd(), 'tmp'),
  uploadTimeout: 60000,
  uriDecodeFileNames: false,
  useTempFiles: false,
}

export type FileShape = {
  data: Buffer
  encoding: string
  md5: Buffer | string
  mimetype: string
  mv: (filePath: string, callback: () => void) => Promise<void> | void
  name: string
  size: number
  tempFilePath: string
  truncated: boolean
}

type FetchAPIFileUploadResponseFile = {
  data: Buffer
  mimetype: string
  name: string
  size: number
  tempFilePath?: string
}

export type FetchAPIFileUploadResponse = {
  error?: APIError
  fields: Record<string, string>
  files: Record<string, FetchAPIFileUploadResponseFile>
}

type FetchAPIFileUpload = (args: {
  options?: FetchAPIFileUploadOptions
  request: Request
}) => Promise<FetchAPIFileUploadResponse>

export const processMultipartFormdata: FetchAPIFileUpload = async ({
  options: incomingOptions,
  request,
}) => {
  const options: FetchAPIFileUploadOptions = { ...DEFAULT_UPLOAD_OPTIONS, ...incomingOptions }

  if (!isEligibleRequest(request)) {
    debugLog(options, 'Request is not eligible for file upload!')

    return {
      error: new APIError('Request is not eligible for file upload', 500),
      fields: undefined!,
      files: undefined!,
    }
  } else {
    return processMultipart({ options, request })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: isEligibleRequest.ts]---
Location: payload-main/packages/payload/src/uploads/fetchAPI-multipart/isEligibleRequest.ts

```typescript
// eslint-disable-next-line regexp/no-super-linear-backtracking, regexp/no-obscure-range
const ACCEPTABLE_CONTENT_TYPE = /multipart\/['"()+-_]+(?:; ?['"()+-_]*)+$/i
const UNACCEPTABLE_METHODS = new Set(['CONNECT', 'DELETE', 'GET', 'HEAD', 'OPTIONS', 'TRACE'])

const hasBody = (req: Request): boolean => {
  return Boolean(
    req.headers.get('transfer-encoding') ||
      (req.headers.get('content-length') && req.headers.get('content-length') !== '0'),
  )
}

const hasAcceptableMethod = (req: Request): boolean => !UNACCEPTABLE_METHODS.has(req.method)

const hasAcceptableContentType = (req: Request): boolean => {
  const contType = req.headers.get('content-type')
  return contType!.includes('boundary=') && ACCEPTABLE_CONTENT_TYPE.test(contType!)
}

export const isEligibleRequest = (req: Request): boolean => {
  try {
    return hasBody(req) && hasAcceptableMethod(req) && hasAcceptableContentType(req)
  } catch (ignore) {
    return false
  }
}
```

--------------------------------------------------------------------------------

---[FILE: LICENSE.md]---
Location: payload-main/packages/payload/src/uploads/fetchAPI-multipart/LICENSE.md

```text
The MIT License (MIT)

Copyright (c) 2015 Richard Girges

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

This project uses a modified version of the `express-fileupload` package, which is distributed under the terms of the MIT License. The modifications made to the original code are as follows:

I converted the code to TypeScript, and made some minor changes since we needed this to work with the [Web Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) instead of the Node HTTP Request. Express-fileupload relied on req.pipe, which does not exist on the Web Request.
```

--------------------------------------------------------------------------------

---[FILE: processMultipart.ts]---
Location: payload-main/packages/payload/src/uploads/fetchAPI-multipart/processMultipart.ts

```typescript
import type { Readable } from 'stream'

import Busboy from 'busboy'
import { status as httpStatus } from 'http-status'

import type { FetchAPIFileUploadOptions } from '../../config/types.js'
import type { FetchAPIFileUploadResponse } from './index.js'

import { APIError } from '../../errors/APIError.js'
import { fileFactory } from './fileFactory.js'
import { memHandler, tempFileHandler } from './handlers.js'
import { processNested } from './processNested.js'
import { createUploadTimer } from './uploadTimer.js'
import { buildFields, debugLog, isFunc, parseFileName } from './utilities.js'

const waitFlushProperty = Symbol('wait flush property symbol')

declare global {
  interface Request {
    [waitFlushProperty]?: Promise<any>[]
  }
}

type ProcessMultipart = (args: {
  options: FetchAPIFileUploadOptions
  request: Request
}) => Promise<FetchAPIFileUploadResponse>
export const processMultipart: ProcessMultipart = async ({ options, request }) => {
  let parsingRequest = true

  let shouldAbortProccessing = false
  let fileCount = 0
  let filesCompleted = 0
  let allFilesHaveResolved: (value?: unknown) => void
  let failedResolvingFiles: (err: Error) => void

  const allFilesComplete = new Promise((res, rej) => {
    allFilesHaveResolved = res
    failedResolvingFiles = rej
  })

  const result: FetchAPIFileUploadResponse = {
    fields: undefined!,
    files: undefined!,
  }

  const headersObject: Record<string, string> = {}
  request.headers.forEach((value, name) => {
    headersObject[name] = value
  })

  const reader = request.body?.getReader()

  const busboy = Busboy({ ...options, headers: headersObject })

  function abortAndDestroyFile(file: Readable, err: APIError) {
    file.destroy()
    shouldAbortProccessing = true
    failedResolvingFiles(err)
  }

  // Build multipart req.body fields
  busboy.on('field', (field, val) => {
    result.fields = buildFields(result.fields, field, val)
  })

  // Build req.files fields
  busboy.on('file', (field, file, info) => {
    fileCount += 1
    // Parse file name(cutting huge names, decoding, etc..).
    const { encoding, filename: name, mimeType: mime } = info
    const filename = parseFileName(options, name)

    const inferredMimeType =
      (filename && filename.endsWith('.glb') && 'model/gltf-binary') ||
      (filename && filename.endsWith('.gltf') && 'model/gltf+json') ||
      mime

    // Define methods and handlers for upload process.
    const { cleanup, complete, dataHandler, getFilePath, getFileSize, getHash, getWritePromise } =
      options.useTempFiles
        ? tempFileHandler(options, field, filename) // Upload into temporary file.
        : memHandler(options, field, filename) // Upload into RAM.

    const writePromise = options.useTempFiles
      ? getWritePromise().catch(() => {
          busboy.end()
          cleanup()
        })
      : getWritePromise()

    const uploadTimer = createUploadTimer(options.uploadTimeout, () => {
      return abortAndDestroyFile(
        file,
        new APIError(`Upload timeout for ${field}->${filename}, bytes:${getFileSize()}`),
      )
    })

    file.on('limit', () => {
      debugLog(options, `Size limit reached for ${field}->${filename}, bytes:${getFileSize()}`)
      uploadTimer.clear()

      if (isFunc(options.limitHandler)) {
        options.limitHandler({ request, size: getFileSize() })
      }

      // Return error and cleanup files if abortOnLimit set.
      if (options.abortOnLimit) {
        debugLog(options, `Upload file size limit reached ${field}->${filename}.`)
        cleanup()
        abortAndDestroyFile(
          file,
          new APIError(options.responseOnLimit!, httpStatus.REQUEST_ENTITY_TOO_LARGE, {
            size: getFileSize(),
          }),
        )
      }
    })

    file.on('data', (data) => {
      uploadTimer.set()
      dataHandler(data)
    })

    file.on('end', () => {
      const size = getFileSize()
      debugLog(options, `Upload finished ${field}->${filename}, bytes:${size}`)
      uploadTimer.clear()

      if (!name && size === 0) {
        fileCount -= 1
        if (options.useTempFiles) {
          cleanup()
          debugLog(options, `Removing the empty file ${field}->${filename}`)
        }
        return debugLog(options, `Don't add file instance if original name and size are empty`)
      }

      filesCompleted += 1

      result.files = buildFields(
        result.files,
        field,
        fileFactory(
          {
            name: filename,
            buffer: complete(),
            encoding,
            hash: getHash(),
            mimetype: inferredMimeType,
            size,
            tempFilePath: getFilePath(),
            truncated: Boolean('truncated' in file && file.truncated) || false,
          },
          options,
        ),
      )

      if (!request[waitFlushProperty]) {
        request[waitFlushProperty] = []
      }
      request[waitFlushProperty].push(writePromise)

      if (filesCompleted === fileCount) {
        allFilesHaveResolved()
      }
    })

    file.on('error', (err) => {
      uploadTimer.clear()
      debugLog(options, `File Error: ${err.message}`)
      cleanup()
      failedResolvingFiles(err)
    })

    // Start upload process.
    debugLog(options, `New upload started ${field}->${filename}, bytes:${getFileSize()}`)
    uploadTimer.set()
  })

  busboy.on('finish', async () => {
    debugLog(options, `Busboy finished parsing request.`)
    if (options.parseNested) {
      result.fields = processNested(result.fields)
      result.files = processNested(result.files)
    }

    if (request[waitFlushProperty]) {
      try {
        await Promise.all(request[waitFlushProperty]).then(() => {
          delete request[waitFlushProperty]
        })
      } catch (err) {
        debugLog(options, `Error waiting for file write promises: ${err}`)
      }
    }

    return result
  })

  busboy.on(
    'error',
    (err = new APIError('Busboy error parsing multipart request', httpStatus.BAD_REQUEST)) => {
      debugLog(options, `Busboy error`)
      throw err
    },
  )

  while (parsingRequest) {
    const { done, value } = await reader!.read()

    if (done) {
      parsingRequest = false
    }

    if (value && !shouldAbortProccessing) {
      busboy.write(value)
    }
  }

  if (fileCount !== 0) {
    await allFilesComplete.catch((e) => {
      throw e
    })
  }

  return result
}
```

--------------------------------------------------------------------------------

````
