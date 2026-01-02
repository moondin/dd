---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 310
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 310 of 695)

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

---[FILE: index.ts]---
Location: payload-main/packages/storage-gcs/src/index.ts

```typescript
import type { StorageOptions } from '@google-cloud/storage'
import type {
  Adapter,
  ClientUploadsConfig,
  PluginOptions as CloudStoragePluginOptions,
  CollectionOptions,
  GeneratedAdapter,
} from '@payloadcms/plugin-cloud-storage/types'
import type { Config, Plugin, UploadCollectionSlug } from 'payload'

import { Storage } from '@google-cloud/storage'
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
import { initClientUploads } from '@payloadcms/plugin-cloud-storage/utilities'

import { getGenerateSignedURLHandler } from './generateSignedURL.js'
import { getGenerateURL } from './generateURL.js'
import { getHandleDelete } from './handleDelete.js'
import { getHandleUpload } from './handleUpload.js'
import { getHandler } from './staticHandler.js'

export interface GcsStorageOptions {
  acl?: 'Private' | 'Public'

  /**
   * The name of the bucket to use.
   */
  bucket: string
  /**
   * Optional cache key to identify the GCS storage client instance.
   * If not provided, a default key will be used.
   *
   * @default `gcs:containerName`
   */
  clientCacheKey?: string
  /**
   * Do uploads directly on the client to bypass limits on Vercel. You must allow CORS PUT method for the bucket to your website.
   */
  clientUploads?: ClientUploadsConfig
  /**
   * Collection options to apply the S3 adapter to.
   */
  collections: Partial<Record<UploadCollectionSlug, Omit<CollectionOptions, 'adapter'> | true>>
  /**
   * Whether or not to enable the plugin
   *
   * Default: true
   */
  enabled?: boolean

  /**
   * Google Cloud Storage client configuration.
   *
   * @see https://github.com/googleapis/nodejs-storage
   */
  options: StorageOptions
}

type GcsStoragePlugin = (gcsStorageArgs: GcsStorageOptions) => Plugin

const gcsClients = new Map<string, Storage>()

export const gcsStorage: GcsStoragePlugin =
  (gcsStorageOptions: GcsStorageOptions) =>
  (incomingConfig: Config): Config => {
    const cacheKey = gcsStorageOptions.clientCacheKey || `gcs:${gcsStorageOptions.bucket}`

    const getStorageClient = (): Storage => {
      if (gcsClients.has(cacheKey)) {
        return gcsClients.get(cacheKey)!
      }
      gcsClients.set(cacheKey, new Storage(gcsStorageOptions.options))

      return gcsClients.get(cacheKey)!
    }

    const adapter = gcsStorageInternal(getStorageClient, gcsStorageOptions)

    const isPluginDisabled = gcsStorageOptions.enabled === false

    initClientUploads({
      clientHandler: '@payloadcms/storage-gcs/client#GcsClientUploadHandler',
      collections: gcsStorageOptions.collections,
      config: incomingConfig,
      enabled: !isPluginDisabled && Boolean(gcsStorageOptions.clientUploads),
      serverHandler: getGenerateSignedURLHandler({
        access:
          typeof gcsStorageOptions.clientUploads === 'object'
            ? gcsStorageOptions.clientUploads.access
            : undefined,
        bucket: gcsStorageOptions.bucket,
        collections: gcsStorageOptions.collections,
        getStorageClient,
      }),
      serverHandlerPath: '/storage-gcs-generate-signed-url',
    })

    if (isPluginDisabled) {
      return incomingConfig
    }

    // Add adapter to each collection option object
    const collectionsWithAdapter: CloudStoragePluginOptions['collections'] = Object.entries(
      gcsStorageOptions.collections,
    ).reduce(
      (acc, [slug, collOptions]) => ({
        ...acc,
        [slug]: {
          ...(collOptions === true ? {} : collOptions),
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

function gcsStorageInternal(
  getStorageClient: () => Storage,
  { acl, bucket, clientUploads }: GcsStorageOptions,
): Adapter {
  return ({ collection, prefix }): GeneratedAdapter => {
    return {
      name: 'gcs',
      clientUploads,
      generateURL: getGenerateURL({ bucket, getStorageClient }),
      handleDelete: getHandleDelete({ bucket, getStorageClient }),
      handleUpload: getHandleUpload({
        acl,
        bucket,
        collection,
        getStorageClient,
        prefix,
      }),
      staticHandler: getHandler({ bucket, collection, getStorageClient }),
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: staticHandler.ts]---
Location: payload-main/packages/storage-gcs/src/staticHandler.ts

```typescript
import type { StaticHandler } from '@payloadcms/plugin-cloud-storage/types'
import type { CollectionConfig } from 'payload'

import { ApiError, type Storage } from '@google-cloud/storage'
import { getFilePrefix } from '@payloadcms/plugin-cloud-storage/utilities'
import path from 'path'

interface Args {
  bucket: string
  collection: CollectionConfig
  getStorageClient: () => Storage
}

export const getHandler = ({ bucket, collection, getStorageClient }: Args): StaticHandler => {
  return async (req, { headers: incomingHeaders, params: { clientUploadContext, filename } }) => {
    try {
      const prefix = await getFilePrefix({ clientUploadContext, collection, filename, req })
      const file = getStorageClient().bucket(bucket).file(path.posix.join(prefix, filename))

      const [metadata] = await file.getMetadata()

      const etagFromHeaders = req.headers.get('etag') || req.headers.get('if-none-match')
      const objectEtag = metadata.etag

      let headers = new Headers(incomingHeaders)

      headers.append('Content-Length', String(metadata.size))
      headers.append('Content-Type', String(metadata.contentType))
      headers.append('ETag', String(metadata.etag))

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

      // Manually create a ReadableStream for the web from a Node.js stream.
      const readableStream = new ReadableStream({
        start(controller) {
          const nodeStream = file.createReadStream()
          nodeStream.on('data', (chunk) => {
            controller.enqueue(new Uint8Array(chunk))
          })
          nodeStream.on('end', () => {
            controller.close()
          })
          nodeStream.on('error', (err) => {
            controller.error(err)
          })
        },
      })

      return new Response(readableStream, {
        headers,
        status: 200,
      })
    } catch (err: unknown) {
      if (err instanceof ApiError && err.code === 404) {
        return new Response(null, { status: 404, statusText: 'Not Found' })
      }
      req.payload.logger.error(err)
      return new Response('Internal Server Error', { status: 500 })
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: GcsClientUploadHandler.ts]---
Location: payload-main/packages/storage-gcs/src/client/GcsClientUploadHandler.ts

```typescript
'use client'
import { createClientUploadHandler } from '@payloadcms/plugin-cloud-storage/client'

export const GcsClientUploadHandler = createClientUploadHandler({
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

    const { url } = (await response.json()) as { url: string }

    await fetch(url, {
      body: file,
      headers: { 'Content-Length': file.size.toString(), 'Content-Type': file.type },
      method: 'PUT',
    })

    return {
      prefix,
    }
  },
})
```

--------------------------------------------------------------------------------

---[FILE: client.ts]---
Location: payload-main/packages/storage-gcs/src/exports/client.ts

```typescript
export { GcsClientUploadHandler } from '../client/GcsClientUploadHandler.js'
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: payload-main/packages/storage-r2/.prettierignore

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
Location: payload-main/packages/storage-r2/.swcrc

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
Location: payload-main/packages/storage-r2/LICENSE.md

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
Location: payload-main/packages/storage-r2/package.json

```json
{
  "name": "@payloadcms/storage-r2",
  "version": "3.68.5",
  "description": "Payload storage adapter for Cloudflare R2",
  "homepage": "https://payloadcms.com",
  "repository": {
    "type": "git",
    "url": "https://github.com/payloadcms/payload.git",
    "directory": "packages/storage-r2"
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
    "@payloadcms/plugin-cloud-storage": "workspace:*"
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

---[FILE: tsconfig.json]---
Location: payload-main/packages/storage-r2/tsconfig.json

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "composite": true, // Make sure typescript knows that this module depends on their references
    "noEmit": false /* Do not emit outputs. */,
    "emitDeclarationOnly": true,
    "outDir": "./dist" /* Specify an output folder for all emitted files. */,
    "rootDir": "./src" /* Specify the root folder within your source files. */,
    // Do not include DOM and DOM.Iterable as this is a server-only package.
    "lib": ["ES2022"],
  },
  "exclude": ["dist", "node_modules"],
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.d.ts", "src/**/*.json"],
  "references": [{ "path": "../payload" }, { "path": "../plugin-cloud-storage" }]
}
```

--------------------------------------------------------------------------------

---[FILE: handleDelete.ts]---
Location: payload-main/packages/storage-r2/src/handleDelete.ts

```typescript
import type { HandleDelete } from '@payloadcms/plugin-cloud-storage/types'

import path from 'path'

import type { R2Bucket } from './types.js'

interface Args {
  bucket: R2Bucket
}

export const getHandleDelete = ({ bucket }: Args): HandleDelete => {
  return async ({ doc: { prefix = '' }, filename }) => {
    await bucket.delete(path.posix.join(prefix, filename))
  }
}
```

--------------------------------------------------------------------------------

---[FILE: handleUpload.ts]---
Location: payload-main/packages/storage-r2/src/handleUpload.ts

```typescript
import type { HandleUpload } from '@payloadcms/plugin-cloud-storage/types'
import type { CollectionConfig } from 'payload'

import path from 'path'

import type { R2Bucket } from './types.js'

interface Args {
  bucket: R2Bucket
  collection: CollectionConfig
  prefix?: string
}

export const getHandleUpload = ({ bucket, prefix = '' }: Args): HandleUpload => {
  return async ({ data, file }) => {
    // Read more: https://github.com/cloudflare/workers-sdk/issues/6047#issuecomment-2691217843
    const buffer = process.env.NODE_ENV === 'development' ? new Blob([file.buffer]) : file.buffer
    await bucket.put(path.posix.join(data.prefix || prefix, file.filename), buffer, {
      httpMetadata: { contentType: file.mimeType },
    })

    return data
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/storage-r2/src/index.ts

```typescript
import type {
  Adapter,
  PluginOptions as CloudStoragePluginOptions,
  CollectionOptions,
  GeneratedAdapter,
} from '@payloadcms/plugin-cloud-storage/types'
import type { Config, Plugin, UploadCollectionSlug } from 'payload'

import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'

import type { R2Bucket } from './types.js'

import { getHandleDelete } from './handleDelete.js'
import { getHandleUpload } from './handleUpload.js'
import { getHandler } from './staticHandler.js'

export interface R2StorageOptions {
  bucket: R2Bucket
  /**
   * Collection options to apply the R2 adapter to.
   */
  collections: Partial<Record<UploadCollectionSlug, Omit<CollectionOptions, 'adapter'> | true>>
  enabled?: boolean
}

type R2StoragePlugin = (r2StorageArgs: R2StorageOptions) => Plugin

export const r2Storage: R2StoragePlugin =
  (r2StorageOptions) =>
  (incomingConfig: Config): Config => {
    const adapter = r2StorageInternal(r2StorageOptions)

    const isPluginDisabled = r2StorageOptions.enabled === false

    if (isPluginDisabled) {
      return incomingConfig
    }

    // Add adapter to each collection option object
    const collectionsWithAdapter: CloudStoragePluginOptions['collections'] = Object.entries(
      r2StorageOptions.collections,
    ).reduce(
      (acc, [slug, collOptions]) => ({
        ...acc,
        [slug]: {
          ...(collOptions === true ? {} : collOptions),
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

function r2StorageInternal({ bucket }: R2StorageOptions): Adapter {
  return ({ collection, prefix }): GeneratedAdapter => {
    return {
      name: 'r2',
      handleDelete: getHandleDelete({ bucket }),
      handleUpload: getHandleUpload({
        bucket,
        collection,
        prefix,
      }),
      staticHandler: getHandler({ bucket, collection, prefix }),
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: staticHandler.ts]---
Location: payload-main/packages/storage-r2/src/staticHandler.ts

```typescript
import type { StaticHandler } from '@payloadcms/plugin-cloud-storage/types'
import type { CollectionConfig } from 'payload'

import path from 'path'

import type { R2Bucket } from './types.js'

interface Args {
  bucket: R2Bucket
  collection: CollectionConfig
  prefix?: string
}

const isMiniflare = process.env.NODE_ENV === 'development'

export const getHandler = ({ bucket, prefix = '' }: Args): StaticHandler => {
  return async (req, { params: { filename } }) => {
    // Due to https://github.com/cloudflare/workers-sdk/issues/6047
    // We cannot send a Headers instance to Miniflare
    const obj = await bucket?.get(path.posix.join(prefix, filename), {
      range: isMiniflare ? undefined : req.headers,
    })
    if (obj?.body == undefined) {
      return new Response(null, { status: 404 })
    }

    const headers = new Headers()
    if (!isMiniflare) {
      obj.writeHttpMetadata(headers)
    }

    return obj.etag === (req.headers.get('etag') || req.headers.get('if-none-match'))
      ? new Response(null, { headers, status: 304 })
      : new Response(obj.body, { headers, status: 200 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/storage-r2/src/types.ts

```typescript
export interface R2Bucket {
  createMultipartUpload(key: string, options?: any): Promise<any>
  delete(keys: string | string[]): Promise<void>
  get(
    key: string,
    options: {
      onlyIf: any | Headers
    } & any,
  ): Promise<any | null>
  get(key: string, options?: any): Promise<any | null>
  head(key: string): Promise<any>
  list(options?: any): Promise<any>
  put(
    key: string,
    value: ArrayBuffer | ArrayBufferView | Blob | null | ReadableStream | string,
    options?: {
      httpMetadata?: any | Headers
      onlyIf: any
    } & any,
  ): Promise<any | null>
  put(
    key: string,
    value: ArrayBuffer | ArrayBufferView | Blob | null | ReadableStream | string,
    options?: any,
  ): Promise<any>
  resumeMultipartUpload(key: string, uploadId: string): any
}
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: payload-main/packages/storage-s3/.prettierignore

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
Location: payload-main/packages/storage-s3/.swcrc

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

---[FILE: docker-compose.yml]---
Location: payload-main/packages/storage-s3/docker-compose.yml
Signals: Docker

```yaml
version: '3.2'
services:
  localstack:
    image: localstack/localstack:latest
    container_name: localstack_demo
    ports:
      - '4563-4599:4563-4599'
      - '8055:8080'
    environment:
      - SERVICES=s3
      - DEBUG=1
      - DATA_DIR=/tmp/localstack/data
    volumes:
      - './.localstack:/var/lib/localstack'
      - '/var/run/docker.sock:/var/run/docker.sock'
```

--------------------------------------------------------------------------------

---[FILE: LICENSE.md]---
Location: payload-main/packages/storage-s3/LICENSE.md

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
Location: payload-main/packages/storage-s3/package.json

```json
{
  "name": "@payloadcms/storage-s3",
  "version": "3.68.5",
  "description": "Payload storage adapter for Amazon S3",
  "homepage": "https://payloadcms.com",
  "repository": {
    "type": "git",
    "url": "https://github.com/payloadcms/payload.git",
    "directory": "packages/storage-s3"
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
    "@aws-sdk/client-s3": "^3.614.0",
    "@aws-sdk/lib-storage": "^3.614.0",
    "@aws-sdk/s3-request-presigner": "^3.614.0",
    "@payloadcms/plugin-cloud-storage": "workspace:*"
  },
  "devDependencies": {
    "@smithy/node-http-handler": "4.0.3",
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
Location: payload-main/packages/storage-s3/README.md

```text
# S3 Storage for Payload

This package provides a simple way to use S3 with Payload.

**NOTE:** This package removes the need to use `@payloadcms/plugin-cloud-storage` as was needed in Payload 2.x.

## Installation

```sh
pnpm add @payloadcms/storage-s3
```

## Usage

- Configure the `collections` object to specify which collections should use the AWS S3 adapter. The slug _must_ match one of your existing collection slugs.
- The `config` object can be any [`S3ClientConfig`](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3) object (from [`@aws-sdk/client-s3`](https://github.com/aws/aws-sdk-js-v3)). _This is highly dependent on your AWS setup_. Check the AWS documentation for more information.
- When enabled, this package will automatically set `disableLocalStorage` to `true` for each collection.
- When deploying to Vercel, server uploads are limited with 4.5MB. Set `clientUploads` to `true` to do uploads directly on the client. You must allow CORS PUT method for the bucket to your website.
- Configure `signedDownloads` (either globally of per-collection in `collections`) to use [presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html) for files downloading. This can improve performance for large files (like videos) while still respecting your access control. Additionally, with `signedDownloads.shouldUseSignedURL` you can specify a condition whether Payload should use a presigned URL, if you want to use this feature only for specific files.

```ts
import { s3Storage } from '@payloadcms/storage-s3'
import { Media } from './collections/Media'
import { MediaWithPrefix } from './collections/MediaWithPrefix'

export default buildConfig({
  collections: [Media, MediaWithPrefix],
  plugins: [
    s3Storage({
      collections: {
        media: true,
        'media-with-prefix': {
          prefix,
        },
        'media-with-presigned-downloads': {
          // Filter only mp4 files
          signedDownloads: {
            shouldUseSignedURL: ({ collection, filename, req }) => {
              return filename.endsWith('.mp4')
            },
          },
        },
      },
      bucket: process.env.S3_BUCKET,
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
        region: process.env.S3_REGION,
        // ... Other S3 configuration
      },
    }),
  ],
})
```

### Configuration Options

See the the [AWS SDK Package](https://github.com/aws/aws-sdk-js-v3) and [`S3ClientConfig`](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3) object for guidance on AWS S3 configuration.
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/packages/storage-s3/tsconfig.json

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

---[FILE: generateSignedURL.ts]---
Location: payload-main/packages/storage-s3/src/generateSignedURL.ts

```typescript
import type { ClientUploadsAccess } from '@payloadcms/plugin-cloud-storage/types'
import type { PayloadHandler } from 'payload'

import * as AWS from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import path from 'path'
import { APIError, Forbidden } from 'payload'

import type { S3StorageOptions } from './index.js'

interface Args {
  access?: ClientUploadsAccess
  acl?: 'private' | 'public-read'
  bucket: string
  collections: S3StorageOptions['collections']
  getStorageClient: () => AWS.S3
}

const defaultAccess: Args['access'] = ({ req }) => !!req.user

export const getGenerateSignedURLHandler = ({
  access = defaultAccess,
  acl,
  bucket,
  collections,
  getStorageClient,
}: Args): PayloadHandler => {
  return async (req) => {
    if (!req.json) {
      throw new APIError('Content-Type expected to be application/json', 400)
    }

    const { collectionSlug, filename, mimeType } = (await req.json()) as {
      collectionSlug: string
      filename: string
      mimeType: string
    }

    const collectionS3Config = collections[collectionSlug]
    if (!collectionS3Config) {
      throw new APIError(`Collection ${collectionSlug} was not found in S3 options`)
    }

    const prefix = (typeof collectionS3Config === 'object' && collectionS3Config.prefix) || ''

    if (!(await access({ collectionSlug, req }))) {
      throw new Forbidden()
    }

    const fileKey = path.posix.join(prefix, filename)

    const url = await getSignedUrl(
      // @ts-expect-error mismatch versions or something
      getStorageClient(),
      new AWS.PutObjectCommand({ ACL: acl, Bucket: bucket, ContentType: mimeType, Key: fileKey }),
      {
        expiresIn: 600,
      },
    )

    return Response.json({ url })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: generateURL.ts]---
Location: payload-main/packages/storage-s3/src/generateURL.ts

```typescript
import type * as AWS from '@aws-sdk/client-s3'
import type { GenerateURL } from '@payloadcms/plugin-cloud-storage/types'

import path from 'path'

interface Args {
  bucket: string
  config: AWS.S3ClientConfig
}

export const getGenerateURL =
  ({ bucket, config: { endpoint } }: Args): GenerateURL =>
  ({ filename, prefix = '' }) => {
    const stringifiedEndpoint = typeof endpoint === 'string' ? endpoint : endpoint?.toString()
    return `${stringifiedEndpoint}/${bucket}/${path.posix.join(prefix, encodeURIComponent(filename))}`
  }
```

--------------------------------------------------------------------------------

---[FILE: handleDelete.ts]---
Location: payload-main/packages/storage-s3/src/handleDelete.ts

```typescript
import type * as AWS from '@aws-sdk/client-s3'
import type { HandleDelete } from '@payloadcms/plugin-cloud-storage/types'

import path from 'path'

interface Args {
  bucket: string
  getStorageClient: () => AWS.S3
}

export const getHandleDelete = ({ bucket, getStorageClient }: Args): HandleDelete => {
  return async ({ doc: { prefix = '' }, filename }) => {
    await getStorageClient().deleteObject({
      Bucket: bucket,
      Key: path.posix.join(prefix, filename),
    })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: handleUpload.ts]---
Location: payload-main/packages/storage-s3/src/handleUpload.ts

```typescript
import type * as AWS from '@aws-sdk/client-s3'
import type { HandleUpload } from '@payloadcms/plugin-cloud-storage/types'
import type { CollectionConfig } from 'payload'

import { Upload } from '@aws-sdk/lib-storage'
import fs from 'fs'
import path from 'path'

interface Args {
  acl?: 'private' | 'public-read'
  bucket: string
  collection: CollectionConfig
  getStorageClient: () => AWS.S3
  prefix?: string
}

const multipartThreshold = 1024 * 1024 * 50 // 50MB

export const getHandleUpload = ({
  acl,
  bucket,
  getStorageClient,
  prefix = '',
}: Args): HandleUpload => {
  return async ({ data, file }) => {
    const fileKey = path.posix.join(data.prefix || prefix, file.filename)

    const fileBufferOrStream = file.tempFilePath
      ? fs.createReadStream(file.tempFilePath)
      : file.buffer

    if (file.buffer.length > 0 && file.buffer.length < multipartThreshold) {
      await getStorageClient().putObject({
        ACL: acl,
        Body: fileBufferOrStream,
        Bucket: bucket,
        ContentType: file.mimeType,
        Key: fileKey,
      })

      return data
    }

    const parallelUploadS3 = new Upload({
      client: getStorageClient(),
      params: {
        ACL: acl,
        Body: fileBufferOrStream,
        Bucket: bucket,
        ContentType: file.mimeType,
        Key: fileKey,
      },
      partSize: multipartThreshold,
      queueSize: 4,
    })

    await parallelUploadS3.done()

    return data
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/storage-s3/src/index.ts

```typescript
import type {
  Adapter,
  ClientUploadsConfig,
  PluginOptions as CloudStoragePluginOptions,
  CollectionOptions,
  GeneratedAdapter,
} from '@payloadcms/plugin-cloud-storage/types'
import type { NodeHttpHandlerOptions } from '@smithy/node-http-handler'
import type { Config, Plugin, UploadCollectionSlug } from 'payload'

import * as AWS from '@aws-sdk/client-s3'
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
import { initClientUploads } from '@payloadcms/plugin-cloud-storage/utilities'

import type { SignedDownloadsConfig } from './staticHandler.js'

import { getGenerateSignedURLHandler } from './generateSignedURL.js'
import { getGenerateURL } from './generateURL.js'
import { getHandleDelete } from './handleDelete.js'
import { getHandleUpload } from './handleUpload.js'
import { getHandler } from './staticHandler.js'

export type S3StorageOptions = {
  /**
   * Access control list for uploaded files.
   */

  acl?: 'private' | 'public-read'

  /**
   * Bucket name to upload files to.
   *
   * Must follow [AWS S3 bucket naming conventions](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html).
   */

  bucket: string

  /**
   * Optional cache key to identify the S3 storage client instance.
   * If not provided, a default key will be used.
   *
   * @default `s3:containerName`
   */
  clientCacheKey?: string

  /**
   * Do uploads directly on the client to bypass limits on Vercel. You must allow CORS PUT method for the bucket to your website.
   */
  clientUploads?: ClientUploadsConfig
  /**
   * Collection options to apply the S3 adapter to.
   */
  collections: Partial<
    Record<
      UploadCollectionSlug,
      | ({
          signedDownloads?: SignedDownloadsConfig
        } & Omit<CollectionOptions, 'adapter'>)
      | true
    >
  >
  /**
   * AWS S3 client configuration. Highly dependent on your AWS setup.
   *
   * [AWS.S3ClientConfig Docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/s3clientconfig.html)
   */
  config: AWS.S3ClientConfig

  /**
   * Whether or not to disable local storage
   *
   * @default true
   */
  disableLocalStorage?: boolean

  /**
   * Whether or not to enable the plugin
   *
   * Default: true
   */
  enabled?: boolean
  /**
   * Use pre-signed URLs for files downloading. Can be overriden per-collection.
   */
  signedDownloads?: SignedDownloadsConfig
}

type S3StoragePlugin = (storageS3Args: S3StorageOptions) => Plugin

const s3Clients = new Map<string, AWS.S3>()

const defaultRequestHandlerOpts: NodeHttpHandlerOptions = {
  httpAgent: {
    keepAlive: true,
    maxSockets: 100,
  },
  httpsAgent: {
    keepAlive: true,
    maxSockets: 100,
  },
}

export const s3Storage: S3StoragePlugin =
  (s3StorageOptions: S3StorageOptions) =>
  (incomingConfig: Config): Config => {
    const cacheKey = s3StorageOptions.clientCacheKey || `s3:${s3StorageOptions.bucket}`

    const getStorageClient: () => AWS.S3 = () => {
      if (s3Clients.has(cacheKey)) {
        return s3Clients.get(cacheKey)!
      }

      s3Clients.set(
        cacheKey,
        new AWS.S3({
          requestHandler: defaultRequestHandlerOpts,
          ...(s3StorageOptions.config ?? {}),
        }),
      )

      return s3Clients.get(cacheKey)!
    }

    const isPluginDisabled = s3StorageOptions.enabled === false

    initClientUploads({
      clientHandler: '@payloadcms/storage-s3/client#S3ClientUploadHandler',
      collections: s3StorageOptions.collections,
      config: incomingConfig,
      enabled: !isPluginDisabled && Boolean(s3StorageOptions.clientUploads),
      serverHandler: getGenerateSignedURLHandler({
        access:
          typeof s3StorageOptions.clientUploads === 'object'
            ? s3StorageOptions.clientUploads.access
            : undefined,
        acl: s3StorageOptions.acl,
        bucket: s3StorageOptions.bucket,
        collections: s3StorageOptions.collections,
        getStorageClient,
      }),
      serverHandlerPath: '/storage-s3-generate-signed-url',
    })

    if (isPluginDisabled) {
      return incomingConfig
    }

    const adapter = s3StorageInternal(getStorageClient, s3StorageOptions)

    // Add adapter to each collection option object
    const collectionsWithAdapter: CloudStoragePluginOptions['collections'] = Object.entries(
      s3StorageOptions.collections,
    ).reduce(
      (acc, [slug, collOptions]) => ({
        ...acc,
        [slug]: {
          ...(collOptions === true ? {} : collOptions),
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

function s3StorageInternal(
  getStorageClient: () => AWS.S3,
  {
    acl,
    bucket,
    clientUploads,
    collections,
    config = {},
    signedDownloads: topLevelSignedDownloads,
  }: S3StorageOptions,
): Adapter {
  return ({ collection, prefix }): GeneratedAdapter => {
    const collectionStorageConfig = collections[collection.slug]

    let signedDownloads: null | SignedDownloadsConfig =
      typeof collectionStorageConfig === 'object'
        ? (collectionStorageConfig.signedDownloads ?? false)
        : null

    if (signedDownloads === null) {
      signedDownloads = topLevelSignedDownloads ?? null
    }

    return {
      name: 's3',
      clientUploads,
      generateURL: getGenerateURL({ bucket, config }),
      handleDelete: getHandleDelete({ bucket, getStorageClient }),
      handleUpload: getHandleUpload({
        acl,
        bucket,
        collection,
        getStorageClient,
        prefix,
      }),
      staticHandler: getHandler({
        bucket,
        collection,
        getStorageClient,
        signedDownloads: signedDownloads ?? false,
      }),
    }
  }
}
```

--------------------------------------------------------------------------------

````
