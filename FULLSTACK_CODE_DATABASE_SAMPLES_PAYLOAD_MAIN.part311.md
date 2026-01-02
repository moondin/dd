---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 311
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 311 of 695)

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

---[FILE: staticHandler.ts]---
Location: payload-main/packages/storage-s3/src/staticHandler.ts

```typescript
import type { StaticHandler } from '@payloadcms/plugin-cloud-storage/types'
import type { CollectionConfig, PayloadRequest } from 'payload'
import type { Readable } from 'stream'

import * as AWS from '@aws-sdk/client-s3'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { getFilePrefix } from '@payloadcms/plugin-cloud-storage/utilities'
import path from 'path'

export type SignedDownloadsConfig =
  | {
      /** @default 7200 */
      expiresIn?: number
      shouldUseSignedURL?(args: {
        collection: CollectionConfig
        filename: string
        req: PayloadRequest
      }): boolean | Promise<boolean>
    }
  | boolean

interface Args {
  bucket: string
  collection: CollectionConfig
  getStorageClient: () => AWS.S3
  signedDownloads?: SignedDownloadsConfig
}

const isNodeReadableStream = (body: AWS.GetObjectOutput['Body']): body is Readable => {
  return (
    typeof body === 'object' &&
    body !== null &&
    'pipe' in body &&
    typeof body.pipe === 'function' &&
    'destroy' in body &&
    typeof body.destroy === 'function'
  )
}

const abortRequestAndDestroyStream = ({
  abortController,
  object,
}: {
  abortController: AbortController
  object?: AWS.GetObjectOutput
}) => {
  try {
    abortController.abort()
  } catch {
    /* noop */
  }
  if (object?.Body && isNodeReadableStream(object.Body)) {
    object.Body.destroy()
  }
}

export const getHandler = ({
  bucket,
  collection,
  getStorageClient,
  signedDownloads,
}: Args): StaticHandler => {
  return async (req, { headers: incomingHeaders, params: { clientUploadContext, filename } }) => {
    let object: AWS.GetObjectOutput | undefined = undefined
    let streamed = false

    const abortController = new AbortController()
    if (req.signal) {
      req.signal.addEventListener('abort', () => {
        abortRequestAndDestroyStream({ abortController, object })
      })
    }

    try {
      const prefix = await getFilePrefix({ clientUploadContext, collection, filename, req })

      const key = path.posix.join(prefix, filename)

      if (signedDownloads && !clientUploadContext) {
        let useSignedURL = true
        if (
          typeof signedDownloads === 'object' &&
          typeof signedDownloads.shouldUseSignedURL === 'function'
        ) {
          useSignedURL = await signedDownloads.shouldUseSignedURL({ collection, filename, req })
        }

        if (useSignedURL) {
          const command = new GetObjectCommand({ Bucket: bucket, Key: key })
          const signedUrl = await getSignedUrl(
            // @ts-expect-error mismatch versions
            getStorageClient(),
            command,
            typeof signedDownloads === 'object' ? signedDownloads : { expiresIn: 7200 },
          )
          return Response.redirect(signedUrl, 302)
        }
      }

      object = await getStorageClient().getObject(
        {
          Bucket: bucket,
          Key: key,
        },
        { abortSignal: abortController.signal },
      )

      if (!object.Body) {
        return new Response(null, { status: 404, statusText: 'Not Found' })
      }

      let headers = new Headers(incomingHeaders)

      // Only include Content-Length when it’s present and strictly numeric.
      // This prevents "Parse Error: Invalid character in Content-Length" when providers (e.g., MinIO)
      // return undefined or a non-numeric value.
      const contentLength = String(object.ContentLength);
      if (contentLength && !isNaN(Number(contentLength))) {
        headers.append('Content-Length', contentLength);
      }

      headers.append('Content-Type', String(object.ContentType))
      headers.append('Accept-Ranges', String(object.AcceptRanges))
      headers.append('ETag', String(object.ETag))

      const etagFromHeaders = req.headers.get('etag') || req.headers.get('if-none-match')
      const objectEtag = object.ETag

      if (
        collection.upload &&
        typeof collection.upload === 'object' &&
        typeof collection.upload.modifyResponseHeaders === 'function'
      ) {
        headers = collection.upload.modifyResponseHeaders({ headers }) || headers
      }

      if (etagFromHeaders && etagFromHeaders === objectEtag) {
        return new Response(null, {
          headers,
          status: 304,
        })
      }

      if (!isNodeReadableStream(object.Body)) {
        req.payload.logger.error({
          key,
          msg: 'S3 object body is not a readable stream',
        })
        return new Response('Internal Server Error', { status: 500 })
      }

      const stream = object.Body
      stream.on('error', (err) => {
        req.payload.logger.error({
          err,
          key,
          msg: 'Error while streaming S3 object (aborting)',
        })
        abortRequestAndDestroyStream({ abortController, object })
      })

      streamed = true
      return new Response(stream, { headers, status: 200 })
    } catch (err) {
      if (err instanceof AWS.NoSuchKey) {
        return new Response(null, { status: 404, statusText: 'Not Found' })
      }
      req.payload.logger.error(err)
      return new Response('Internal Server Error', { status: 500 })
    } finally {
      if (!streamed) {
        abortRequestAndDestroyStream({ abortController, object })
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: S3ClientUploadHandler.ts]---
Location: payload-main/packages/storage-s3/src/client/S3ClientUploadHandler.ts

```typescript
'use client'
import { createClientUploadHandler } from '@payloadcms/plugin-cloud-storage/client'

export const S3ClientUploadHandler = createClientUploadHandler({
  handler: async ({ apiRoute, collectionSlug, file, prefix, serverHandlerPath, serverURL }) => {
    const response = await fetch(`${serverURL}${apiRoute}${serverHandlerPath}`, {
      body: JSON.stringify({
        collectionSlug,
        filename: file.name,
        mimeType: file.type,
      }),
      credentials: 'include',
      method: 'POST',
    })

    const { url } = (await response.json()) as {
      url: string
    }

    await fetch(url, {
      body: file,
      headers: { 'Content-Length': file.size.toString(), 'Content-Type': file.type },
      method: 'PUT',
    })

    return { prefix }
  },
})
```

--------------------------------------------------------------------------------

---[FILE: client.ts]---
Location: payload-main/packages/storage-s3/src/exports/client.ts

```typescript
export { S3ClientUploadHandler } from '../client/S3ClientUploadHandler.js'
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: payload-main/packages/storage-uploadthing/.prettierignore

```text
.tmp
**/.git
**/.hg
**/.pnp.*
**/.svn
**/.yarn/**
**/build
**/dist/**
**/node_modules
**/temp
```

--------------------------------------------------------------------------------

---[FILE: .swcrc]---
Location: payload-main/packages/storage-uploadthing/.swcrc

```text
{
  "$schema": "https://json.schemastore.org/swcrc",
  "sourceMaps": true,
  "jsc": {
    "target": "esnext",
    "parser": {
      "syntax": "typescript",
      "tsx": true,
      "dts": true
    }
  },
  "module": {
    "type": "es6"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: LICENSE.md]---
Location: payload-main/packages/storage-uploadthing/LICENSE.md

```text
MIT License

Copyright (c) 2018-2025 Payload CMS, Inc. <info@payloadcms.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: payload-main/packages/storage-uploadthing/package.json

```json
{
  "name": "@payloadcms/storage-uploadthing",
  "version": "3.68.5",
  "description": "Payload storage adapter for uploadthing",
  "homepage": "https://payloadcms.com",
  "repository": {
    "type": "git",
    "url": "https://github.com/payloadcms/payload.git",
    "directory": "packages/storage-uploadthing"
  },
  "license": "MIT",
  "author": "Payload <dev@payloadcms.com> (https://payloadcms.com)",
  "maintainers": [
    {
      "name": "Payload",
      "email": "info@payloadcms.com",
      "url": "https://payloadcms.com"
    }
  ],
  "sideEffects": false,
  "type": "module",
  "exports": {
    ".": {
      "import": "./src/index.ts",
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    },
    "./client": {
      "import": "./src/exports/client.ts",
      "types": "./src/exports/client.ts",
      "default": "./src/exports/client.ts"
    }
  },
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "pnpm build:types && pnpm build:swc",
    "build:clean": "find . \\( -type d \\( -name build -o -name dist -o -name .cache \\) -o -type f -name tsconfig.tsbuildinfo \\) -exec rm -rf {} + && pnpm build",
    "build:debug": "pnpm build",
    "build:swc": "swc ./src -d ./dist --config-file .swcrc --strip-leading-paths",
    "build:types": "tsc --emitDeclarationOnly --outDir dist",
    "clean": "rimraf -g {dist,*.tsbuildinfo}",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  },
  "dependencies": {
    "@payloadcms/plugin-cloud-storage": "workspace:*",
    "uploadthing": "7.3.0"
  },
  "devDependencies": {
    "payload": "workspace:*"
  },
  "peerDependencies": {
    "payload": "workspace:*"
  },
  "engines": {
    "node": "^18.20.2 || >=20.9.0"
  },
  "publishConfig": {
    "exports": {
      ".": {
        "import": "./dist/index.js",
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "./client": {
        "import": "./dist/exports/client.js",
        "types": "./dist/exports/client.d.ts",
        "default": "./dist/exports/client.js"
      }
    },
    "main": "./dist/index.js",
    "types": "./dist/index.d.ts"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: payload-main/packages/storage-uploadthing/README.md

```text
# Uploadthing Storage for Payload (beta)

This package provides a way to use [uploadthing](https://uploadthing.com) with Payload.

## Installation

```sh
pnpm add @payloadcms/storage-uploadthing
```

## Usage

- Configure the `collections` object to specify which collections should use uploadthing. The slug _must_ match one of your existing collection slugs and be an `upload` type.
- Get an API key from Uploadthing and set it as `apiKey` in the `options` object.
- `acl` is optional and defaults to `public-read`.
- When deploying to Vercel, server uploads are limited with 4.5MB. Set `clientUploads` to `true` to do uploads directly on the client.

```ts
export default buildConfig({
  collections: [Media],
  plugins: [
    uploadthingStorage({
      collections: {
        media: true,
      },
      options: {
        token: process.env.UPLOADTHING_TOKEN,
        acl: 'public-read',
      },
    }),
  ],
})
```
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/packages/storage-uploadthing/tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "references": [{ "path": "../payload" }, { "path": "../plugin-cloud-storage" }],
  "compilerOptions": {
    // Do not include DOM and DOM.Iterable as this is a server-only package.
    "lib": ["ES2022"],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: generateURL.ts]---
Location: payload-main/packages/storage-uploadthing/src/generateURL.ts

```typescript
import type { GenerateURL } from '@payloadcms/plugin-cloud-storage/types'

import path from 'path'

import { getKeyFromFilename } from './utilities.js'

export const generateURL: GenerateURL = ({ data, filename, prefix = '' }) => {
  const key = getKeyFromFilename(data, filename)
  return `https://utfs.io/f/${path.posix.join(prefix, key || '')}`
}
```

--------------------------------------------------------------------------------

---[FILE: getClientUploadRoute.ts]---
Location: payload-main/packages/storage-uploadthing/src/getClientUploadRoute.ts

```typescript
import {
  APIError,
  Forbidden,
  type PayloadHandler,
  type PayloadRequest,
  type UploadCollectionSlug,
} from 'payload'

type Args = {
  access?: (args: {
    collectionSlug: UploadCollectionSlug
    req: PayloadRequest
  }) => boolean | Promise<boolean>
  acl: 'private' | 'public-read'
  routerInputConfig?: FileRouterInputConfig
  token?: string
}

const defaultAccess: Args['access'] = ({ req }) => !!req.user

import type { FileRouter } from 'uploadthing/server'

import { createRouteHandler } from 'uploadthing/next'
import { createUploadthing } from 'uploadthing/server'

import type { FileRouterInputConfig } from './index.js'

export const getClientUploadRoute = ({
  access = defaultAccess,
  acl,
  routerInputConfig = {},
  token,
}: Args): PayloadHandler => {
  const f = createUploadthing()

  const uploadRouter = {
    uploader: f({
      ...routerInputConfig,
      blob: {
        acl,
        maxFileCount: 1,
        maxFileSize: '512MB',
        ...('blob' in routerInputConfig ? routerInputConfig.blob : {}),
      },
    })
      .middleware(async ({ req: rawReq }) => {
        const req = rawReq as PayloadRequest

        const collectionSlug = req.searchParams.get('collectionSlug')

        if (!collectionSlug) {
          throw new APIError('No payload was provided')
        }

        if (!(await access({ collectionSlug, req }))) {
          throw new Forbidden()
        }

        return {}
      })
      .onUploadComplete(() => {}),
  } satisfies FileRouter

  const { POST } = createRouteHandler({ config: { token }, router: uploadRouter })

  return async (req) => {
    return POST(req)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: handleDelete.ts]---
Location: payload-main/packages/storage-uploadthing/src/handleDelete.ts

```typescript
import type { HandleDelete } from '@payloadcms/plugin-cloud-storage/types'
import type { UTApi } from 'uploadthing/server'

import { APIError } from 'payload'

import { getKeyFromFilename } from './utilities.js'

type Args = {
  utApi: UTApi
}

export const getHandleDelete = ({ utApi }: Args): HandleDelete => {
  return async ({ doc, filename, req }) => {
    const key = getKeyFromFilename(doc, filename)

    if (!key) {
      req.payload.logger.error({
        msg: `Error deleting file: ${filename} - unable to extract key from doc`,
      })
      throw new APIError(`Error deleting file: ${filename}`)
    }

    try {
      if (key) {
        await utApi.deleteFiles(key)
      }
    } catch (err) {
      req.payload.logger.error({
        err,
        msg: `Error deleting file with key: ${filename} - key: ${key}`,
      })
      throw new APIError(`Error deleting file: ${filename}`)
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: handleUpload.ts]---
Location: payload-main/packages/storage-uploadthing/src/handleUpload.ts

```typescript
import type { HandleUpload } from '@payloadcms/plugin-cloud-storage/types'
import type { UTApi } from 'uploadthing/server'

import { APIError } from 'payload'
import { UTFile } from 'uploadthing/server'

import type { ACL } from './index.js'

type HandleUploadArgs = {
  acl: ACL
  utApi: UTApi
}

export const getHandleUpload = ({ acl, utApi }: HandleUploadArgs): HandleUpload => {
  return async ({ clientUploadContext, data, file }) => {
    try {
      if (
        clientUploadContext &&
        typeof clientUploadContext === 'object' &&
        'key' in clientUploadContext &&
        typeof clientUploadContext.key === 'string'
      ) {
        // Clear the old file
        await utApi.deleteFiles(clientUploadContext.key)
      }

      const { buffer, filename, mimeType } = file

      const blob = new Blob([buffer], { type: mimeType })
      const res = await utApi.uploadFiles(new UTFile([blob], filename), { acl })

      if (res.error) {
        throw new APIError(`Error uploading file: ${res.error.code} - ${res.error.message}`)
      }

      // Find matching data.sizes entry
      const foundSize = Object.keys(data.sizes || {}).find(
        (key) => data.sizes?.[key]?.filename === filename,
      )

      if (foundSize) {
        data.sizes[foundSize]._key = res.data?.key
      } else {
        data._key = res.data?.key
        data.filename = res.data?.name
      }

      return data
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Interrogate uploadthing error which returns FiberFailure
        if ('toJSON' in error && typeof error.toJSON === 'function') {
          const json = error.toJSON() as {
            cause?: { defect?: { _id?: string; data?: { error?: string }; error?: string } }
          }
          if (json.cause?.defect?.error && json.cause.defect.data?.error) {
            throw new APIError(
              `Error uploading file with uploadthing: ${json.cause.defect.error} - ${json.cause.defect.data.error}`,
            )
          }
        } else {
          throw new APIError(`Error uploading file with uploadthing: ${error.message}`)
        }
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/storage-uploadthing/src/index.ts

```typescript
import type {
  Adapter,
  ClientUploadsAccess,
  PluginOptions as CloudStoragePluginOptions,
  CollectionOptions,
  GeneratedAdapter,
} from '@payloadcms/plugin-cloud-storage/types'
import type { Config, Field, Plugin, UploadCollectionSlug } from 'payload'
import type { createUploadthing } from 'uploadthing/server'
import type { UTApiOptions } from 'uploadthing/types'

import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
import { initClientUploads } from '@payloadcms/plugin-cloud-storage/utilities'
import { UTApi } from 'uploadthing/server'

import { generateURL } from './generateURL.js'
import { getClientUploadRoute } from './getClientUploadRoute.js'
import { getHandleDelete } from './handleDelete.js'
import { getHandleUpload } from './handleUpload.js'
import { getHandler } from './staticHandler.js'

export type FileRouterInputConfig = Parameters<ReturnType<typeof createUploadthing>>[0]

export type UploadthingStorageOptions = {
  /**
   * Do uploads directly on the client, to bypass limits on Vercel.
   */
  clientUploads?:
    | {
        access?: ClientUploadsAccess
        routerInputConfig?: FileRouterInputConfig
      }
    | boolean

  /**
   * Collection options to apply the adapter to.
   */
  collections: Partial<Record<UploadCollectionSlug, Omit<CollectionOptions, 'adapter'> | true>>

  /**
   * Whether or not to enable the plugin
   *
   * Default: true
   */
  enabled?: boolean

  /**
   * Uploadthing Options
   */
  options: {
    /**
     * @default 'public-read'
     */
    acl?: ACL
  } & UTApiOptions
}

type UploadthingPlugin = (uploadthingStorageOptions: UploadthingStorageOptions) => Plugin

/** NOTE: not synced with uploadthing's internal types. Need to modify if more options added */
export type ACL = 'private' | 'public-read'

export const uploadthingStorage: UploadthingPlugin =
  (uploadthingStorageOptions: UploadthingStorageOptions) =>
  (incomingConfig: Config): Config => {
    const isPluginDisabled = uploadthingStorageOptions.enabled === false

    initClientUploads({
      clientHandler: '@payloadcms/storage-uploadthing/client#UploadthingClientUploadHandler',
      collections: uploadthingStorageOptions.collections,
      config: incomingConfig,
      enabled: !isPluginDisabled && Boolean(uploadthingStorageOptions.clientUploads),
      serverHandler: getClientUploadRoute({
        access:
          typeof uploadthingStorageOptions.clientUploads === 'object'
            ? uploadthingStorageOptions.clientUploads.access
            : undefined,
        acl: uploadthingStorageOptions.options.acl || 'public-read',
        routerInputConfig:
          typeof uploadthingStorageOptions.clientUploads === 'object'
            ? uploadthingStorageOptions.clientUploads.routerInputConfig
            : undefined,
        token: uploadthingStorageOptions.options.token,
      }),
      serverHandlerPath: '/storage-uploadthing-client-upload-route',
    })

    if (isPluginDisabled) {
      return incomingConfig
    }

    // Default ACL to public-read
    if (!uploadthingStorageOptions.options.acl) {
      uploadthingStorageOptions.options.acl = 'public-read'
    }

    const adapter = uploadthingInternal(uploadthingStorageOptions)

    // Add adapter to each collection option object
    const collectionsWithAdapter: CloudStoragePluginOptions['collections'] = Object.entries(
      uploadthingStorageOptions.collections,
    ).reduce(
      (acc, [slug, collOptions]) => ({
        ...acc,
        [slug]: {
          ...(collOptions === true ? {} : collOptions),

          // Disable payload access control if the ACL is public-read or not set
          // ...(uploadthingStorageOptions.options.acl === 'public-read'
          //   ? { disablePayloadAccessControl: true }
          //   : {}),

          adapter,
        },
      }),
      {} as Record<string, CollectionOptions>,
    )

    // Set disableLocalStorage: true for collections specified in the plugin options
    const config = {
      ...incomingConfig,
      collections: (incomingConfig.collections || []).map((collection) => {
        if (!collectionsWithAdapter[collection.slug]) {
          return collection
        }

        return {
          ...collection,
          upload: {
            ...(typeof collection.upload === 'object' ? collection.upload : {}),
            disableLocalStorage: true,
          },
        }
      }),
    }

    return cloudStoragePlugin({
      collections: collectionsWithAdapter,
    })(config)
  }

function uploadthingInternal(options: UploadthingStorageOptions): Adapter {
  const fields: Field[] = [
    {
      name: '_key',
      type: 'text',
      admin: {
        disableBulkEdit: true,
        disableListColumn: true,
        disableListFilter: true,
        hidden: true,
      },
    },
  ]

  return (): GeneratedAdapter => {
    const {
      clientUploads,
      options: { acl = 'public-read', ...utOptions },
    } = options

    const utApi = new UTApi(utOptions)

    return {
      name: 'uploadthing',
      clientUploads,
      fields,
      generateURL,
      handleDelete: getHandleDelete({ utApi }),
      handleUpload: getHandleUpload({ acl, utApi }),
      staticHandler: getHandler({ utApi }),
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: staticHandler.ts]---
Location: payload-main/packages/storage-uploadthing/src/staticHandler.ts

```typescript
import type { StaticHandler } from '@payloadcms/plugin-cloud-storage/types'
import type { Where } from 'payload'
import type { UTApi } from 'uploadthing/server'

import { getKeyFromFilename } from './utilities.js'

type Args = {
  utApi: UTApi
}

export const getHandler = ({ utApi }: Args): StaticHandler => {
  return async (
    req,
    { doc, headers: incomingHeaders, params: { clientUploadContext, collection, filename } },
  ) => {
    try {
      let key: string
      const collectionConfig = req.payload.collections[collection]?.config

      if (
        clientUploadContext &&
        typeof clientUploadContext === 'object' &&
        'key' in clientUploadContext &&
        typeof clientUploadContext.key === 'string'
      ) {
        key = clientUploadContext.key
      } else {
        let retrievedDoc = doc

        if (!retrievedDoc) {
          const or: Where[] = [
            {
              filename: {
                equals: filename,
              },
            },
          ]

          if (collectionConfig?.upload.imageSizes) {
            collectionConfig.upload.imageSizes.forEach(({ name }) => {
              or.push({
                [`sizes.${name}.filename`]: {
                  equals: filename,
                },
              })
            })
          }

          const result = await req.payload.db.findOne({
            collection,
            req,
            where: { or },
          })

          if (result) {
            retrievedDoc = result
          }
        }

        if (!retrievedDoc) {
          return new Response(null, { status: 404, statusText: 'Not Found' })
        }

        key = getKeyFromFilename(retrievedDoc, filename)!
      }

      if (!key) {
        return new Response(null, { status: 404, statusText: 'Not Found' })
      }

      const { url: signedURL } = await utApi.getSignedURL(key)

      if (!signedURL) {
        return new Response(null, { status: 404, statusText: 'Not Found' })
      }

      const response = await fetch(signedURL)

      if (!response.ok) {
        return new Response(null, { status: 404, statusText: 'Not Found' })
      }

      const blob = await response.blob()

      const etagFromHeaders = req.headers.get('etag') || req.headers.get('if-none-match')
      const objectEtag = response.headers.get('etag')

      let headers = new Headers(incomingHeaders)

      headers.append('Content-Length', String(blob.size))
      headers.append('Content-Type', blob.type)

      if (objectEtag) {
        headers.append('ETag', objectEtag)
      }

      if (
        collectionConfig?.upload &&
        typeof collectionConfig.upload === 'object' &&
        typeof collectionConfig.upload.modifyResponseHeaders === 'function'
      ) {
        headers = collectionConfig.upload.modifyResponseHeaders({ headers }) || headers
      }

      if (etagFromHeaders && etagFromHeaders === objectEtag) {
        return new Response(null, {
          headers,
          status: 304,
        })
      }

      return new Response(blob, {
        headers,
        status: 200,
      })
    } catch (err) {
      req.payload.logger.error({ err, msg: 'Unexpected error in staticHandler' })
      return new Response('Internal Server Error', { status: 500 })
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: utilities.ts]---
Location: payload-main/packages/storage-uploadthing/src/utilities.ts

```typescript
/**
 * Extract '_key' value from the doc safely
 */
export const getKeyFromFilename = (doc: unknown, filename: string) => {
  if (
    doc &&
    typeof doc === 'object' &&
    'filename' in doc &&
    doc.filename === filename &&
    '_key' in doc
  ) {
    return doc._key as string
  }
  if (doc && typeof doc === 'object' && 'sizes' in doc) {
    const sizes = doc.sizes
    if (typeof sizes === 'object' && sizes !== null) {
      for (const size of Object.values(sizes)) {
        if (size?.filename === filename && '_key' in size) {
          return size._key as string
        }
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: UploadthingClientUploadHandler.ts]---
Location: payload-main/packages/storage-uploadthing/src/client/UploadthingClientUploadHandler.ts

```typescript
'use client'
import { createClientUploadHandler } from '@payloadcms/plugin-cloud-storage/client'
import { genUploader } from 'uploadthing/client'

export const UploadthingClientUploadHandler = createClientUploadHandler({
  handler: async ({ apiRoute, collectionSlug, file, serverHandlerPath, serverURL }) => {
    const { uploadFiles } = genUploader({
      package: 'storage-uploadthing',
      url: `${serverURL}${apiRoute}${serverHandlerPath}?collectionSlug=${collectionSlug}`,
    })

    const res = await uploadFiles('uploader', {
      files: [file],
    })

    return { key: res[0]?.key }
  },
})
```

--------------------------------------------------------------------------------

---[FILE: client.ts]---
Location: payload-main/packages/storage-uploadthing/src/exports/client.ts

```typescript
export { UploadthingClientUploadHandler } from '../client/UploadthingClientUploadHandler.js'
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: payload-main/packages/storage-vercel-blob/.prettierignore

```text
.tmp
**/.git
**/.hg
**/.pnp.*
**/.svn
**/.yarn/**
**/build
**/dist/**
**/node_modules
**/temp
```

--------------------------------------------------------------------------------

---[FILE: .swcrc]---
Location: payload-main/packages/storage-vercel-blob/.swcrc

```text
{
  "$schema": "https://json.schemastore.org/swcrc",
  "sourceMaps": true,
  "jsc": {
    "target": "esnext",
    "parser": {
      "syntax": "typescript",
      "tsx": true,
      "dts": true
    }
  },
  "module": {
    "type": "es6"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: LICENSE.md]---
Location: payload-main/packages/storage-vercel-blob/LICENSE.md

```text
MIT License

Copyright (c) 2018-2025 Payload CMS, Inc. <info@payloadcms.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: payload-main/packages/storage-vercel-blob/package.json

```json
{
  "name": "@payloadcms/storage-vercel-blob",
  "version": "3.68.5",
  "description": "Payload storage adapter for Vercel Blob Storage",
  "homepage": "https://payloadcms.com",
  "repository": {
    "type": "git",
    "url": "https://github.com/payloadcms/payload.git",
    "directory": "packages/storage-vercel-blob"
  },
  "license": "MIT",
  "author": "Payload <dev@payloadcms.com> (https://payloadcms.com)",
  "maintainers": [
    {
      "name": "Payload",
      "email": "info@payloadcms.com",
      "url": "https://payloadcms.com"
    }
  ],
  "sideEffects": false,
  "type": "module",
  "exports": {
    ".": {
      "import": "./src/index.ts",
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    },
    "./client": {
      "import": "./src/exports/client.ts",
      "types": "./src/exports/client.ts",
      "default": "./src/exports/client.ts"
    }
  },
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "pnpm build:types && pnpm build:swc",
    "build:clean": "find . \\( -type d \\( -name build -o -name dist -o -name .cache \\) -o -type f -name tsconfig.tsbuildinfo \\) -exec rm -rf {} + && pnpm build",
    "build:debug": "pnpm build",
    "build:swc": "swc ./src -d ./dist --config-file .swcrc --strip-leading-paths",
    "build:types": "tsc --emitDeclarationOnly --outDir dist",
    "clean": "rimraf -g {dist,*.tsbuildinfo}",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  },
  "dependencies": {
    "@payloadcms/plugin-cloud-storage": "workspace:*",
    "@vercel/blob": "^0.22.3"
  },
  "devDependencies": {
    "payload": "workspace:*"
  },
  "peerDependencies": {
    "payload": "workspace:*"
  },
  "engines": {
    "node": "^18.20.2 || >=20.9.0"
  },
  "publishConfig": {
    "exports": {
      ".": {
        "import": "./dist/index.js",
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "./client": {
        "import": "./dist/exports/client.js",
        "types": "./dist/exports/client.d.ts",
        "default": "./dist/exports/client.js"
      }
    },
    "main": "./dist/index.js",
    "types": "./dist/index.d.ts"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: payload-main/packages/storage-vercel-blob/README.md

```text
# Vercel Blob Storage for Payload

This package provides a simple way to use [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) storage with Payload.

**NOTE:** This package removes the need to use `@payloadcms/plugin-cloud-storage` as was needed in Payload 2.x.

## Installation

```sh
pnpm add @payloadcms/storage-vercel-blob
```

## Usage

- Configure the `collections` object to specify which collections should use the Vercel Blob adapter. The slug _must_ match one of your existing collection slugs.
- Ensure you have `BLOB_READ_WRITE_TOKEN` set in your Vercel environment variables. This is usually set by Vercel automatically after adding blob storage to your project.
- When enabled, this package will automatically set `disableLocalStorage` to `true` for each collection.
- When deploying to Vercel, server uploads are limited with 4.5MB. Set `clientUploads` to `true` to do uploads directly on the client.

```ts
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { Media } from './collections/Media'
import { MediaWithPrefix } from './collections/MediaWithPrefix'

export default buildConfig({
  collections: [Media, MediaWithPrefix],
  plugins: [
    vercelBlobStorage({
      enabled: true, // Optional, defaults to true
      // Specify which collections should use Vercel Blob
      collections: {
        media: true,
        'media-with-prefix': {
          prefix: 'my-prefix',
        },
      },
      // Token provided by Vercel once Blob storage is added to your Vercel project
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
})
```

| Option               | Description                                                          | Default                       |
| -------------------- | -------------------------------------------------------------------- | ----------------------------- |
| `enabled`            | Whether or not to enable the plugin                                  | `true`                        |
| `collections`        | Collections to apply the Vercel Blob adapter to                      |                               |
| `addRandomSuffix`    | Add a random suffix to the uploaded file name in Vercel Blob storage | `false`                       |
| `cacheControlMaxAge` | Cache-Control max-age in seconds                                     | `365 * 24 * 60 * 60` (1 Year) |
| `token`              | Vercel Blob storage read/write token                                 | `''`                          |
| `clientUploads`      | Do uploads directly on the client to bypass limits on Vercel         |                               |
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/packages/storage-vercel-blob/tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "references": [{ "path": "../payload" }, { "path": "../plugin-cloud-storage" }],
  "compilerOptions": {
    // Do not include DOM and DOM.Iterable as this is a server-only package.
    "lib": ["ES2022"],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: generateURL.ts]---
Location: payload-main/packages/storage-vercel-blob/src/generateURL.ts

```typescript
import type { GenerateURL } from '@payloadcms/plugin-cloud-storage/types'

import path from 'path'

type GenerateUrlArgs = {
  baseUrl: string
  prefix?: string
}

export const getGenerateUrl = ({ baseUrl }: GenerateUrlArgs): GenerateURL => {
  return ({ filename, prefix = '' }) => {
    return `${baseUrl}/${path.posix.join(prefix, encodeURIComponent(filename))}`
  }
}
```

--------------------------------------------------------------------------------

---[FILE: getClientUploadRoute.ts]---
Location: payload-main/packages/storage-vercel-blob/src/getClientUploadRoute.ts

```typescript
import type { PayloadHandler, PayloadRequest, UploadCollectionSlug } from 'payload'

import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { APIError, Forbidden } from 'payload'

type Args = {
  access?: (args: {
    collectionSlug: UploadCollectionSlug
    req: PayloadRequest
  }) => boolean | Promise<boolean>
  addRandomSuffix?: boolean
  cacheControlMaxAge?: number
  token: string
}

const defaultAccess: Args['access'] = ({ req }) => !!req.user

export const getClientUploadRoute =
  ({ access = defaultAccess, addRandomSuffix, cacheControlMaxAge, token }: Args): PayloadHandler =>
  async (req) => {
    const body = (await req.json!()) as HandleUploadBody

    try {
      const jsonResponse = await handleUpload({
        body,
        onBeforeGenerateToken: async (_pathname: string, collectionSlug: null | string) => {
          if (!collectionSlug) {
            throw new APIError('No payload was provided')
          }

          if (!(await access({ collectionSlug, req }))) {
            throw new Forbidden()
          }

          return Promise.resolve({
            addRandomSuffix,
            cacheControlMaxAge,
          })
        },
        onUploadCompleted: async () => {},
        request: req as Request,
        token,
      })

      return Response.json(jsonResponse)
    } catch (error) {
      req.payload.logger.error(error)
      throw new APIError('storage-vercel-blob client upload route error')
    }
  }
```

--------------------------------------------------------------------------------

---[FILE: handleDelete.ts]---
Location: payload-main/packages/storage-vercel-blob/src/handleDelete.ts

```typescript
import type { HandleDelete } from '@payloadcms/plugin-cloud-storage/types'

import { del } from '@vercel/blob'
import path from 'path'

type HandleDeleteArgs = {
  baseUrl: string
  prefix?: string
  token: string
}

export const getHandleDelete = ({ baseUrl, token }: HandleDeleteArgs): HandleDelete => {
  return async ({ doc: { prefix = '' }, filename }) => {
    const fileUrl = `${baseUrl}/${path.posix.join(prefix, filename)}`
    const deletedBlob = await del(fileUrl, { token })

    return deletedBlob
  }
}
```

--------------------------------------------------------------------------------

````
