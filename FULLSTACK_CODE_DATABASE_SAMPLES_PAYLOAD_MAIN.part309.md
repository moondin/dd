---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 309
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 309 of 695)

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

---[FILE: buildSearchParams.ts]---
Location: payload-main/packages/sdk/src/utilities/buildSearchParams.ts

```typescript
import type { SelectType, Sort, Where } from 'payload'

import { stringify } from 'qs-esm'

export type OperationArgs = {
  depth?: number
  draft?: boolean
  fallbackLocale?: false | string
  joins?: false | Record<string, unknown>
  limit?: number
  locale?: string
  page?: number
  pagination?: boolean
  populate?: Record<string, unknown>
  select?: SelectType
  sort?: Sort
  where?: Where
}

export const buildSearchParams = (args: OperationArgs): string => {
  const search: Record<string, unknown> = {}

  if (typeof args.depth === 'number') {
    search.depth = String(args.depth)
  }

  if (typeof args.page === 'number') {
    search.page = String(args.page)
  }

  if (typeof args.limit === 'number') {
    search.limit = String(args.limit)
  }

  if (typeof args.draft === 'boolean') {
    search.draft = String(args.draft)
  }

  if (typeof args.pagination === 'boolean') {
    search.pagination = String(args.pagination)
  }

  if (args.fallbackLocale) {
    search['fallback-locale'] = String(args.fallbackLocale)
  }

  if (args.locale) {
    search.locale = args.locale
  }

  if (args.sort) {
    const sanitizedSort = Array.isArray(args.sort) ? args.sort.join(',') : args.sort
    search.sort = sanitizedSort
  }

  if (args.select) {
    search.select = args.select
  }

  if (args.where) {
    search.where = args.where
  }

  if (args.populate) {
    search.populate = args.populate
  }

  if (args.joins) {
    search.joins = args.joins
  }

  if (Object.keys(search).length > 0) {
    return stringify(search, { addQueryPrefix: true })
  }

  return ''
}
```

--------------------------------------------------------------------------------

---[FILE: resolveFileFromOptions.ts]---
Location: payload-main/packages/sdk/src/utilities/resolveFileFromOptions.ts

```typescript
export const resolveFileFromOptions = async (file: Blob | string) => {
  if (typeof file === 'string') {
    const response = await fetch(file)
    const fileName = file.split('/').pop() ?? ''
    const blob = await response.blob()

    return new File([blob], fileName, { type: blob.type })
  } else {
    return file
  }
}
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: payload-main/packages/storage-azure/.prettierignore

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
Location: payload-main/packages/storage-azure/.swcrc

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
    },
    "transform": {
      "react": {
        "runtime": "automatic",
        "pragmaFrag": "React.Fragment",
        "throwIfNamespace": true,
        "development": false,
        "useBuiltins": true
      }
    }
  },
  "module": {
    "type": "es6"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: LICENSE.md]---
Location: payload-main/packages/storage-azure/LICENSE.md

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
Location: payload-main/packages/storage-azure/package.json

```json
{
  "name": "@payloadcms/storage-azure",
  "version": "3.68.5",
  "description": "Payload storage adapter for Azure Blob Storage",
  "homepage": "https://payloadcms.com",
  "repository": {
    "type": "git",
    "url": "https://github.com/payloadcms/payload.git",
    "directory": "packages/storage-azure"
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
    "@azure/abort-controller": "^1.1.0",
    "@azure/storage-blob": "^12.11.0",
    "@payloadcms/plugin-cloud-storage": "workspace:*",
    "range-parser": "^1.2.1"
  },
  "devDependencies": {
    "@types/range-parser": "^1.2.7",
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
Location: payload-main/packages/storage-azure/README.md

```text
# Azure Blob Storage for Payload

This package provides a simple way to use [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs) with Payload.

**NOTE:** This package removes the need to use `@payloadcms/plugin-cloud-storage` as was needed in Payload 2.x.

## Installation

```sh
pnpm add @payloadcms/storage-azure
```

## Usage

- Configure the `collections` object to specify which collections should use the Azure Blob Storage adapter. The slug _must_ match one of your existing collection slugs.
- When enabled, this package will automatically set `disableLocalStorage` to `true` for each collection.
- When deploying to Vercel, server uploads are limited with 4.5MB. Set `clientUploads` to `true` to do uploads directly on the client. You must allow CORS PUT method to your website.

```ts
import { azureStorage } from '@payloadcms/storage-azure'
import { Media } from './collections/Media'
import { MediaWithPrefix } from './collections/MediaWithPrefix'

export default buildConfig({
  collections: [Media, MediaWithPrefix],
  plugins: [
    azureStorage({
      collections: {
        media: true,
        'media-with-prefix': {
          prefix,
        },
      },
      allowContainerCreate: process.env.AZURE_STORAGE_ALLOW_CONTAINER_CREATE === 'true',
      baseURL: process.env.AZURE_STORAGE_ACCOUNT_BASEURL,
      connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
      containerName: process.env.AZURE_STORAGE_CONTAINER_NAME,
    }),
  ],
})
```

### Configuration Options

| Option                 | Description                                                              | Default |
| ---------------------- | ------------------------------------------------------------------------ | ------- |
| `enabled`              | Whether or not to enable the plugin                                      | `true`  |
| `collections`          | Collections to apply the Azure Blob adapter to                           |         |
| `allowContainerCreate` | Whether or not to allow the container to be created if it does not exist | `false` |
| `baseURL`              | Base URL for the Azure Blob storage account                              |         |
| `connectionString`     | Azure Blob storage connection string                                     |         |
| `containerName`        | Azure Blob storage container name                                        |         |
| `clientUploads`        | Do uploads directly on the client to bypass limits on Vercel.            |         |
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/packages/storage-azure/tsconfig.json

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "composite": true, // Make sure typescript knows that this module depends on their references
    "noEmit": false /* Do not emit outputs. */,
    "emitDeclarationOnly": true,
    "outDir": "./dist" /* Specify an output folder for all emitted files. */,
    // Do not include DOM and DOM.Iterable as this is a server-only package.
    "lib": ["ES2022"],
    "rootDir": "./src" /* Specify the root folder within your source files. */,
  },
  "exclude": ["dist", "node_modules"],
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.d.ts", "src/**/*.json"],
  "references": [{ "path": "../payload" }, { "path": "../plugin-cloud-storage" }],
}
```

--------------------------------------------------------------------------------

---[FILE: generateSignedURL.ts]---
Location: payload-main/packages/storage-azure/src/generateSignedURL.ts

```typescript
import type { ContainerClient, StorageSharedKeyCredential } from '@azure/storage-blob'
import type { ClientUploadsAccess } from '@payloadcms/plugin-cloud-storage/types'
import type { PayloadHandler } from 'payload'

import { BlobSASPermissions, generateBlobSASQueryParameters } from '@azure/storage-blob'
import path from 'path'
import { APIError, Forbidden } from 'payload'

import type { AzureStorageOptions } from './index.js'

interface Args {
  access?: ClientUploadsAccess
  collections: AzureStorageOptions['collections']
  containerName: string
  getStorageClient: () => ContainerClient
}

const defaultAccess: Args['access'] = ({ req }) => !!req.user

export const getGenerateSignedURLHandler = ({
  access = defaultAccess,
  collections,
  containerName,
  getStorageClient,
}: Args): PayloadHandler => {
  return async (req) => {
    if (!req.json) {
      throw new APIError('Unreachable')
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

    const blobClient = getStorageClient().getBlobClient(fileKey)

    const sasToken = generateBlobSASQueryParameters(
      {
        blobName: fileKey,
        containerName,
        contentType: mimeType,
        expiresOn: new Date(Date.now() + 30 * 60 * 1000),
        permissions: BlobSASPermissions.parse('w'),
        startsOn: new Date(),
      },
      getStorageClient().credential as StorageSharedKeyCredential,
    )

    return Response.json({ url: `${blobClient.url}?${sasToken.toString()}` })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: generateURL.ts]---
Location: payload-main/packages/storage-azure/src/generateURL.ts

```typescript
import type { GenerateURL } from '@payloadcms/plugin-cloud-storage/types'

import path from 'path'

interface Args {
  baseURL: string
  containerName: string
}

export const getGenerateURL =
  ({ baseURL, containerName }: Args): GenerateURL =>
  ({ filename, prefix = '' }) => {
    return `${baseURL}/${containerName}/${path.posix.join(prefix, filename)}`
  }
```

--------------------------------------------------------------------------------

---[FILE: handleDelete.ts]---
Location: payload-main/packages/storage-azure/src/handleDelete.ts

```typescript
import type { ContainerClient } from '@azure/storage-blob'
import type { HandleDelete } from '@payloadcms/plugin-cloud-storage/types'
import type { CollectionConfig } from 'payload'

import path from 'path'

interface Args {
  collection: CollectionConfig
  getStorageClient: () => ContainerClient
}

export const getHandleDelete = ({ getStorageClient }: Args): HandleDelete => {
  return async ({ doc: { prefix = '' }, filename }) => {
    const blockBlobClient = getStorageClient().getBlockBlobClient(path.posix.join(prefix, filename))
    await blockBlobClient.deleteIfExists()
  }
}
```

--------------------------------------------------------------------------------

---[FILE: handleUpload.ts]---
Location: payload-main/packages/storage-azure/src/handleUpload.ts

```typescript
import type { ContainerClient } from '@azure/storage-blob'
import type { HandleUpload } from '@payloadcms/plugin-cloud-storage/types'
import type { CollectionConfig } from 'payload'

import { AbortController } from '@azure/abort-controller'
import fs from 'fs'
import path from 'path'
import { Readable } from 'stream'

interface Args {
  collection: CollectionConfig
  getStorageClient: () => ContainerClient
  prefix?: string
}

const multipartThreshold = 1024 * 1024 * 50 // 50MB
export const getHandleUpload = ({ getStorageClient, prefix = '' }: Args): HandleUpload => {
  return async ({ data, file }) => {
    const fileKey = path.posix.join(data.prefix || prefix, file.filename)

    const blockBlobClient = getStorageClient().getBlockBlobClient(fileKey)

    // when there are no temp files, or the upload is less than the threshold size, do not stream files
    if (!file.tempFilePath && file.buffer.length > 0 && file.buffer.length < multipartThreshold) {
      await blockBlobClient.upload(file.buffer, file.buffer.byteLength, {
        blobHTTPHeaders: { blobContentType: file.mimeType },
      })

      return data
    }

    const fileBufferOrStream: Readable = file.tempFilePath
      ? fs.createReadStream(file.tempFilePath)
      : Readable.from(file.buffer)

    await blockBlobClient.uploadStream(fileBufferOrStream, 4 * 1024 * 1024, 4, {
      abortSignal: AbortController.timeout(30 * 60 * 1000),
    })

    return data
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/storage-azure/src/index.ts

```typescript
import type { ContainerClient } from '@azure/storage-blob'
import type {
  Adapter,
  ClientUploadsConfig,
  PluginOptions as CloudStoragePluginOptions,
  CollectionOptions,
  GeneratedAdapter,
} from '@payloadcms/plugin-cloud-storage/types'
import type { Config, Plugin, UploadCollectionSlug } from 'payload'

import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
import { initClientUploads } from '@payloadcms/plugin-cloud-storage/utilities'

import { getGenerateSignedURLHandler } from './generateSignedURL.js'
import { getGenerateURL } from './generateURL.js'
import { getHandleDelete } from './handleDelete.js'
import { getHandleUpload } from './handleUpload.js'
import { getHandler } from './staticHandler.js'
import { getStorageClient as getStorageClientFunc } from './utils/getStorageClient.js'

export type AzureStorageOptions = {
  /**
   * Whether or not to allow the container to be created if it does not exist
   *
   * @default false
   */
  allowContainerCreate: boolean

  /**
   * Base URL for the Azure Blob storage account
   */
  baseURL: string

  /**
   * Optional cache key to identify the Azure Blob storage client instance.
   * If not provided, a default key will be used.
   *
   * @default `azure:containerName`
   */
  clientCacheKey?: string

  /**
   * Do uploads directly on the client to bypass limits on Vercel. You must allow CORS PUT method to your website.
   */
  clientUploads?: ClientUploadsConfig

  /**
   * Collection options to apply the Azure Blob adapter to.
   */
  collections: Partial<Record<UploadCollectionSlug, Omit<CollectionOptions, 'adapter'> | true>>

  /**
   * Azure Blob storage connection string
   */
  connectionString: string

  /**
   * Azure Blob storage container name
   */
  containerName: string

  /**
   * Whether or not to enable the plugin
   *
   * Default: true
   */
  enabled?: boolean
}

type AzureStoragePlugin = (azureStorageArgs: AzureStorageOptions) => Plugin

export const azureStorage: AzureStoragePlugin =
  (azureStorageOptions: AzureStorageOptions) =>
  (incomingConfig: Config): Config => {
    const getStorageClient = () =>
      getStorageClientFunc({
        connectionString: azureStorageOptions.connectionString,
        containerName: azureStorageOptions.containerName,
      })

    const isPluginDisabled = azureStorageOptions.enabled === false

    initClientUploads({
      clientHandler: '@payloadcms/storage-azure/client#AzureClientUploadHandler',
      collections: azureStorageOptions.collections,
      config: incomingConfig,
      enabled: !isPluginDisabled && Boolean(azureStorageOptions.clientUploads),
      serverHandler: getGenerateSignedURLHandler({
        access:
          typeof azureStorageOptions.clientUploads === 'object'
            ? azureStorageOptions.clientUploads.access
            : undefined,
        collections: azureStorageOptions.collections,
        containerName: azureStorageOptions.containerName,
        getStorageClient,
      }),
      serverHandlerPath: '/storage-azure-generate-signed-url',
    })

    if (isPluginDisabled) {
      return incomingConfig
    }

    const adapter = azureStorageInternal(getStorageClient, azureStorageOptions)

    // Add adapter to each collection option object
    const collectionsWithAdapter: CloudStoragePluginOptions['collections'] = Object.entries(
      azureStorageOptions.collections,
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

function azureStorageInternal(
  getStorageClient: () => ContainerClient,
  {
    allowContainerCreate,
    baseURL,
    clientUploads,
    connectionString,
    containerName,
  }: AzureStorageOptions,
): Adapter {
  const createContainerIfNotExists = () => {
    void getStorageClientFunc({ connectionString, containerName }).createIfNotExists({
      access: 'blob',
    })
  }

  return ({ collection, prefix }): GeneratedAdapter => {
    return {
      name: 'azure',
      clientUploads,
      generateURL: getGenerateURL({ baseURL, containerName }),
      handleDelete: getHandleDelete({ collection, getStorageClient }),
      handleUpload: getHandleUpload({
        collection,
        getStorageClient,
        prefix,
      }),
      staticHandler: getHandler({ collection, getStorageClient }),
      ...(allowContainerCreate && { onInit: createContainerIfNotExists }),
    }
  }
}

export { getStorageClientFunc as getStorageClient }
```

--------------------------------------------------------------------------------

---[FILE: staticHandler.ts]---
Location: payload-main/packages/storage-azure/src/staticHandler.ts

```typescript
import type { ContainerClient } from '@azure/storage-blob'
import type { StaticHandler } from '@payloadcms/plugin-cloud-storage/types'
import type { CollectionConfig } from 'payload'

import { RestError } from '@azure/storage-blob'
import { getFilePrefix } from '@payloadcms/plugin-cloud-storage/utilities'
import path from 'path'

import { getRangeFromHeader } from './utils/getRangeFromHeader.js'

interface Args {
  collection: CollectionConfig
  getStorageClient: () => ContainerClient
}

export const getHandler = ({ collection, getStorageClient }: Args): StaticHandler => {
  return async (req, { headers: incomingHeaders, params: { clientUploadContext, filename } }) => {
    try {
      const prefix = await getFilePrefix({ clientUploadContext, collection, filename, req })
      const blockBlobClient = getStorageClient().getBlockBlobClient(
        path.posix.join(prefix, filename),
      )

      const { end, start } = await getRangeFromHeader(
        blockBlobClient,
        String(req.headers.get('range')),
      )

      const blob = await blockBlobClient.download(start, end)

      const response = blob._response

      let initHeaders: Headers = {
        ...(response.headers.rawHeaders() as unknown as Headers),
      }

      // Typescript is difficult here with merging these types from Azure
      if (incomingHeaders) {
        initHeaders = {
          ...initHeaders,
          ...incomingHeaders,
        }
      }

      let headers = new Headers(initHeaders)

      const etagFromHeaders = req.headers.get('etag') || req.headers.get('if-none-match')
      const objectEtag = response.headers.get('etag')

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
          const nodeStream = blob.readableStreamBody
          if (!nodeStream) {
            throw new Error('No readable stream body')
          }

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
        status: response.status,
      })
    } catch (err: unknown) {
      if (err instanceof RestError && err.statusCode === 404) {
        return new Response(null, { status: 404, statusText: 'Not Found' })
      }
      req.payload.logger.error(err)
      return new Response('Internal Server Error', { status: 500 })
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: AzureClientUploadHandler.ts]---
Location: payload-main/packages/storage-azure/src/client/AzureClientUploadHandler.ts

```typescript
'use client'
import { createClientUploadHandler } from '@payloadcms/plugin-cloud-storage/client'

export const AzureClientUploadHandler = createClientUploadHandler({
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
      headers: {
        'Content-Length': file.size.toString(),
        'Content-Type': file.type,
        // Required for azure
        'x-ms-blob-type': 'BlockBlob',
      },
      method: 'PUT',
    })

    return { prefix }
  },
})
```

--------------------------------------------------------------------------------

---[FILE: client.ts]---
Location: payload-main/packages/storage-azure/src/exports/client.ts

```typescript
export { AzureClientUploadHandler } from '../client/AzureClientUploadHandler.js'
```

--------------------------------------------------------------------------------

---[FILE: getRangeFromHeader.ts]---
Location: payload-main/packages/storage-azure/src/utils/getRangeFromHeader.ts

```typescript
import type { BlockBlobClient } from '@azure/storage-blob'

import parseRange from 'range-parser'

export const getRangeFromHeader = async (
  blockBlobClient: BlockBlobClient,
  rangeHeader?: string,
): Promise<{ end: number | undefined; start: number }> => {
  const fullRange = { end: undefined, start: 0 }

  if (!rangeHeader) {
    return fullRange
  }

  const size = await blockBlobClient.getProperties().then((props) => props.contentLength)
  if (size === undefined) {
    return fullRange
  }

  const range = parseRange(size, rangeHeader)
  if (range === -1 || range === -2 || range.type !== 'bytes' || range.length !== 1) {
    return fullRange
  }

  return range[0] ?? fullRange
}
```

--------------------------------------------------------------------------------

---[FILE: getStorageClient.ts]---
Location: payload-main/packages/storage-azure/src/utils/getStorageClient.ts

```typescript
import type { ContainerClient } from '@azure/storage-blob'

import { BlobServiceClient } from '@azure/storage-blob'

import type { AzureStorageOptions } from '../index.js'

// Cache the Azure Blob storage clients in a map so that multiple instances are not overriding each other in the case of different configurations used per collection
const azureClients = new Map<string, ContainerClient>()

export function getStorageClient(
  options: Pick<AzureStorageOptions, 'clientCacheKey' | 'connectionString' | 'containerName'>,
): ContainerClient {
  const cacheKey = options.clientCacheKey || `azure:${options.containerName}`

  if (azureClients.has(cacheKey)) {
    return azureClients.get(cacheKey)!
  }

  const { connectionString, containerName } = options

  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)

  azureClients.set(cacheKey, blobServiceClient.getContainerClient(containerName))

  return azureClients.get(cacheKey)!
}
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: payload-main/packages/storage-gcs/.prettierignore

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
Location: payload-main/packages/storage-gcs/.swcrc

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
Location: payload-main/packages/storage-gcs/LICENSE.md

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
Location: payload-main/packages/storage-gcs/package.json

```json
{
  "name": "@payloadcms/storage-gcs",
  "version": "3.68.5",
  "description": "Payload storage adapter for Google Cloud Storage",
  "homepage": "https://payloadcms.com",
  "repository": {
    "type": "git",
    "url": "https://github.com/payloadcms/payload.git",
    "directory": "packages/storage-gcs"
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
    "@google-cloud/storage": "7.17.2",
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

---[FILE: README.md]---
Location: payload-main/packages/storage-gcs/README.md

```text
# Google Cloud Storage for Payload

This package provides a simple way to use [Google Cloud Storage](https://cloud.google.com/storage) with Payload.

**NOTE:** This package removes the need to use `@payloadcms/plugin-cloud-storage` as was needed in Payload 2.x.

## Installation

```sh
pnpm add @payloadcms/storage-gcs
```

## Usage

- Configure the `collections` object to specify which collections should use the Google Cloud Storage adapter. The slug _must_ match one of your existing collection slugs.
- When enabled, this package will automatically set `disableLocalStorage` to `true` for each collection.
- When deploying to Vercel, server uploads are limited with 4.5MB. Set `clientUploads` to `true` to do uploads directly on the client. You must allow CORS PUT method for the bucket to your website.

```ts
import { gcsStorage } from '@payloadcms/storage-gcs'
import { Media } from './collections/Media'
import { MediaWithPrefix } from './collections/MediaWithPrefix'

export default buildConfig({
  collections: [Media, MediaWithPrefix],
  plugins: [
    gcsStorage({
      collections: {
        media: true,
        'media-with-prefix': {
          prefix,
        },
      },
      bucket: process.env.GCS_BUCKET,
      options: {
        apiEndpoint: process.env.GCS_ENDPOINT,
        projectId: process.env.GCS_PROJECT_ID,
      },
    }),
  ],
})
```

### Configuration Options

| Option        | Description                                                                                         | Default   |
| ------------- | --------------------------------------------------------------------------------------------------- | --------- |
| `enabled`     | Whether or not to enable the plugin                                                                 | `true`    |
| `collections` | Collections to apply the storage to                                                                 |           |
| `bucket`      | The name of the bucket to use                                                                       |           |
| `options`     | Google Cloud Storage client configuration. See [Docs](https://github.com/googleapis/nodejs-storage) |           |
| `acl`         | Access control list for files that are uploaded                                                     | `Private` |
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/packages/storage-gcs/tsconfig.json

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

---[FILE: generateSignedURL.ts]---
Location: payload-main/packages/storage-gcs/src/generateSignedURL.ts

```typescript
import type { Storage } from '@google-cloud/storage'
import type { ClientUploadsAccess } from '@payloadcms/plugin-cloud-storage/types'
import type { PayloadHandler } from 'payload'

import path from 'path'
import { APIError, Forbidden } from 'payload'

import type { GcsStorageOptions } from './index.js'

interface Args {
  access?: ClientUploadsAccess
  acl?: 'private' | 'public-read'
  bucket: string
  collections: GcsStorageOptions['collections']
  getStorageClient: () => Storage
}

const defaultAccess: Args['access'] = ({ req }) => !!req.user

export const getGenerateSignedURLHandler = ({
  access = defaultAccess,
  bucket,
  collections,
  getStorageClient,
}: Args): PayloadHandler => {
  return async (req) => {
    if (!req.json) {
      throw new APIError('Unreachable')
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

    const [url] = await getStorageClient()
      .bucket(bucket)
      .file(fileKey)
      .getSignedUrl({
        action: 'write',
        contentType: mimeType,
        expires: Date.now() + 60 * 60 * 5,
        version: 'v4',
      })

    return Response.json({ url })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: generateURL.ts]---
Location: payload-main/packages/storage-gcs/src/generateURL.ts

```typescript
import type { Storage } from '@google-cloud/storage'
import type { GenerateURL } from '@payloadcms/plugin-cloud-storage/types'

import path from 'path'

interface Args {
  bucket: string
  getStorageClient: () => Storage
}

export const getGenerateURL =
  ({ bucket, getStorageClient }: Args): GenerateURL =>
  ({ filename, prefix = '' }) => {
    return decodeURIComponent(
      getStorageClient().bucket(bucket).file(path.posix.join(prefix, filename)).publicUrl(),
    )
  }
```

--------------------------------------------------------------------------------

---[FILE: handleDelete.ts]---
Location: payload-main/packages/storage-gcs/src/handleDelete.ts

```typescript
import type { Storage } from '@google-cloud/storage'
import type { HandleDelete } from '@payloadcms/plugin-cloud-storage/types'

import path from 'path'

interface Args {
  bucket: string
  getStorageClient: () => Storage
}

export const getHandleDelete = ({ bucket, getStorageClient }: Args): HandleDelete => {
  return async ({ doc: { prefix = '' }, filename }) => {
    await getStorageClient().bucket(bucket).file(path.posix.join(prefix, filename)).delete({
      ignoreNotFound: true,
    })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: handleUpload.ts]---
Location: payload-main/packages/storage-gcs/src/handleUpload.ts

```typescript
import type { Storage } from '@google-cloud/storage'
import type { HandleUpload } from '@payloadcms/plugin-cloud-storage/types'
import type { CollectionConfig } from 'payload'

import path from 'path'

interface Args {
  acl?: 'Private' | 'Public'
  bucket: string
  collection: CollectionConfig
  getStorageClient: () => Storage
  prefix?: string
}

export const getHandleUpload = ({
  acl,
  bucket,
  getStorageClient,
  prefix = '',
}: Args): HandleUpload => {
  return async ({ data, file }) => {
    const fileKey = path.posix.join(data.prefix || prefix, file.filename)

    const gcsFile = getStorageClient().bucket(bucket).file(fileKey)
    await gcsFile.save(file.buffer, {
      metadata: {
        contentType: file.mimeType,
      },
    })

    if (acl) {
      await gcsFile[`make${acl}`]()
    }

    return data
  }
}
```

--------------------------------------------------------------------------------

````
