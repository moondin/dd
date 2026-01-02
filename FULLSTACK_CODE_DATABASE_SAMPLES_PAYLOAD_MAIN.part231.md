---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 231
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 231 of 695)

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

---[FILE: .swcrc]---
Location: payload-main/packages/plugin-cloud-storage/.swcrc

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

---[FILE: azure.d.ts]---
Location: payload-main/packages/plugin-cloud-storage/azure.d.ts

```typescript
export { azureBlobStorageAdapter } from './dist/adapters/azure/index.js'
//# sourceMappingURL=azure.d.ts.map
```

--------------------------------------------------------------------------------

---[FILE: azure.js]---
Location: payload-main/packages/plugin-cloud-storage/azure.js

```javascript
export { azureBlobStorageAdapter } from './dist/adapters/azure/index.js'

//# sourceMappingURL=azure.js.map
```

--------------------------------------------------------------------------------

---[FILE: gcs.d.ts]---
Location: payload-main/packages/plugin-cloud-storage/gcs.d.ts

```typescript
export { gcsAdapter } from './dist/adapters/gcs/index.js'
//# sourceMappingURL=gcs.d.ts.map
```

--------------------------------------------------------------------------------

---[FILE: gcs.js]---
Location: payload-main/packages/plugin-cloud-storage/gcs.js

```javascript
export { gcsAdapter } from './dist/adapters/gcs/index.js'

//# sourceMappingURL=gcs.js.map
```

--------------------------------------------------------------------------------

---[FILE: LICENSE.md]---
Location: payload-main/packages/plugin-cloud-storage/LICENSE.md

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
Location: payload-main/packages/plugin-cloud-storage/package.json
Signals: React

```json
{
  "name": "@payloadcms/plugin-cloud-storage",
  "version": "3.68.5",
  "description": "The official cloud storage plugin for Payload CMS",
  "homepage": "https://payloadcms.com",
  "repository": {
    "type": "git",
    "url": "https://github.com/payloadcms/payload.git",
    "directory": "packages/plugin-cloud-storage"
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
    "./types": {
      "import": "./src/types.ts",
      "types": "./src/types.ts",
      "default": "./src/types.ts"
    },
    "./utilities": {
      "import": "./src/exports/utilities.ts",
      "types": "./src/exports/utilities.ts",
      "default": "./src/exports/utilities.ts"
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
    "dist",
    "*.js",
    "*.d.ts"
  ],
  "scripts": {
    "build": "pnpm build:types && pnpm build:swc ",
    "build:debug": "pnpm build",
    "build:swc": "swc ./src -d ./dist --config-file .swcrc --strip-leading-paths",
    "build:types": "tsc --emitDeclarationOnly --outDir dist",
    "clean": "rimraf -g {dist,*.tsbuildinfo}",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "test": "echo \"No tests available.\""
  },
  "dependencies": {
    "@payloadcms/ui": "workspace:*",
    "find-node-modules": "^2.1.3",
    "range-parser": "^1.2.1"
  },
  "devDependencies": {
    "@types/find-node-modules": "^2.1.2",
    "@types/react": "19.2.1",
    "@types/react-dom": "19.2.1",
    "payload": "workspace:*"
  },
  "peerDependencies": {
    "payload": "workspace:*",
    "react": "^19.0.1 || ^19.1.2 || ^19.2.1",
    "react-dom": "^19.0.1 || ^19.1.2 || ^19.2.1"
  },
  "publishConfig": {
    "exports": {
      ".": {
        "import": "./dist/index.js",
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "./types": {
        "import": "./dist/types.js",
        "types": "./dist/types.d.ts",
        "default": "./dist/types.js"
      },
      "./utilities": {
        "import": "./dist/exports/utilities.js",
        "types": "./dist/exports/utilities.d.ts",
        "default": "./dist/exports/utilities.js"
      },
      "./client": {
        "import": "./dist/exports/client.js",
        "types": "./dist/exports/client.d.ts",
        "default": "./dist/exports/client.js"
      }
    },
    "main": "./dist/index.js",
    "registry": "https://registry.npmjs.org/",
    "types": "./dist/index.d.ts"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: payload-main/packages/plugin-cloud-storage/README.md

```text
# Payload Cloud Storage Plugin

This repository contains the officially supported Payload Cloud Storage plugin. It extends Payload to allow you to store all uploaded media in third-party permanent storage.

**NOTE:** If you are using Payload 3.0 and one of the following storage services, you should use one of following packages instead of this one:

| Service              | Package                                                                                                           |
| -------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Vercel Blob          | [`@payloadcms/storage-vercel-blob`](https://github.com/payloadcms/payload/tree/main/packages/storage-vercel-blob) |
| AWS S3               | [`@payloadcms/storage-s3`](https://github.com/payloadcms/payload/tree/main/packages/storage-s3)                   |
| Azure                | [`@payloadcms/storage-azure`](https://github.com/payloadcms/payload/tree/main/packages/storage-azure)             |
| Google Cloud Storage | [`@payloadcms/storage-gcs`](https://github.com/payloadcms/payload/tree/main/packages/storage-gcs)                 |

This package is now best used for implementing custom storage solutions or third-party storage services that do not have `@payloadcms/storage-*` packages.

## Installation

`pnpm add @payloadcms/plugin-cloud-storage`

## Usage

```ts
import { buildConfig } from 'payload'
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'

export default buildConfig({
  plugins: [
    cloudStoragePlugin({
      collections: {
        'my-collection-slug': {
          adapter: theAdapterToUse, // see docs for the adapter you want to use
        },
      },
    }),
  ],
  // The rest of your config goes here
})
```

### Conditionally Enabling/Disabling

The proper way to conditionally enable/disable this plugin is to use the `enabled` property.

```ts
cloudStoragePlugin({
  enabled: process.env.MY_CONDITION === 'true',
  collections: {
    'my-collection-slug': {
      adapter: theAdapterToUse, // see docs for the adapter you want to use
    },
  },
}),
```

If the code is included _in any way in your config_ but conditionally disabled in another fashion, you may run into issues such as `Webpack Build Error: Can't Resolve 'fs' and 'stream'` or similar because the plugin must be run at all times in order to properly extend the webpack config.

## Features

**Adapter-based Implementation**

This plugin supports the following adapters:

- [Azure Blob Storage](#azure-blob-storage-adapter)
- [AWS S3-style Storage](#s3-adapter)
- [Google Cloud Storage](#gcs-adapter)
- [Vercel Blob Storage](#vercel-blob-adapter)

However, you can create your own adapter for any third-party service you would like to use.

All adapters are implemented `dev` directory's [Payload Config](https://github.com/payloadcms/plugin-cloud-storage/blob/master/dev/src/payload.config.ts). See this file for examples.

## Plugin options

This plugin is configurable to work across many different Payload collections. A `*` denotes that the property is required.

| Option           | Type                                                                                                                                                   | Description                                                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| `collections` \* | Record<string, [CollectionOptions](https://github.com/payloadcms/plugin-cloud-storage/blob/c4a492a62abc2f21b4cd6a7c97778acd8e831212/src/types.ts#L48)> | Object with keys set to the slug of collections you want to enable the plugin for, and values set to collection-specific options. |
| `enabled`        |                                                                                                                                                        | `boolean` to conditionally enable/disable plugin. Default: true.                                                                  |

**Collection-specific options:**

| Option                        | Type                                                                                               | Description                                                                                                                                                                                                   |
| ----------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `adapter` \*                  | [Adapter](https://github.com/payloadcms/plugin-cloud-storage/blob/master/src/types.ts#L51)         | Pass in the adapter that you'd like to use for this collection. You can also set this field to `null` for local development if you'd like to bypass cloud storage in certain scenarios and use local storage. |
| `disableLocalStorage`         | `boolean`                                                                                          | Choose to disable local storage on this collection. Defaults to `true`.                                                                                                                                       |
| `disablePayloadAccessControl` | `true`                                                                                             | Set to `true` to disable Payload's access control. [More](#payload-access-control)                                                                                                                            |
| `prefix`                      | `string`                                                                                           | Set to `media/images` to upload files inside `media/images` folder in the bucket.                                                                                                                             |
| `generateFileURL`             | [GenerateFileURL](https://github.com/payloadcms/plugin-cloud-storage/blob/master/src/types.ts#L53) | Override the generated file URL with one that you create.                                                                                                                                                     |

### Payload Access Control

Payload ships with access control that runs _even on statically served files_. The same `read` access control property on your `upload`-enabled collections is used, and it allows you to restrict who can request your uploaded files.

To preserve this feature, by default, this plugin _keeps all file URLs exactly the same_. Your file URLs won't be updated to point directly to your cloud storage source, as in that case, Payload's access control will be completely bypassed and you would need public readability on your cloud-hosted files.

Instead, all uploads will still be reached from the default `/:collectionSlug/file/:filename` path. This plugin will "pass through" all files that are hosted on your third-party cloud service—with the added benefit of keeping your existing access control in place.

If this does not apply to you (your upload collection has `read: () => true` or similar) you can disable this functionality by setting `disablePayloadAccessControl` to `true`. When this setting is in place, this plugin will update your file URLs to point directly to your cloud host.

## Credit

This plugin was created with significant help, and code, from [Alex Bechmann](https://github.com/alexbechmann) and [Richard VanBergen](https://github.com/richardvanbergen). Thank you!!
```

--------------------------------------------------------------------------------

---[FILE: s3.d.ts]---
Location: payload-main/packages/plugin-cloud-storage/s3.d.ts

```typescript
export { s3Adapter } from './dist/adapters/s3/index.js'
//# sourceMappingURL=s3.d.ts.map
```

--------------------------------------------------------------------------------

---[FILE: s3.js]---
Location: payload-main/packages/plugin-cloud-storage/s3.js

```javascript
export { s3Adapter } from './dist/adapters/s3/index.js'

//# sourceMappingURL=s3.js.map
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/packages/plugin-cloud-storage/tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "references": [{ "path": "../payload" }, { "path": "../ui" }],
  "compilerOptions": {
    // Do not include DOM and DOM.Iterable as this is a server-only package.
    "lib": ["ES2022"],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: launch.json]---
Location: payload-main/packages/plugin-cloud-storage/.vscode/launch.json

```json
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}/dev",
      "runtimeArgs": ["-r", "./node_modules/ts-node/register"],
      "name": "Debug Cloud Storage - S3",
      "program": "${workspaceFolder}/dev/src/server.ts",
      "outputCapture": "std",
      "env": {
        "PAYLOAD_PUBLIC_CLOUD_STORAGE_ADAPTER": "s3",
        "PAYLOAD_CONFIG_PATH": "${workspaceFolder}/dev/src/payload.config.ts"
      }
    },
    {
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}/dev",
      "runtimeArgs": ["-r", "./node_modules/ts-node/register"],
      "name": "Debug Cloud Storage - Azure",
      "program": "${workspaceFolder}/dev/src/server.ts",
      "outputCapture": "std",
      "env": {
        "PAYLOAD_PUBLIC_CLOUD_STORAGE_ADAPTER": "azure",
        "PAYLOAD_CONFIG_PATH": "${workspaceFolder}/dev/src/payload.config.ts"
      }
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: settings.json]---
Location: payload-main/packages/plugin-cloud-storage/.vscode/settings.json

```json
{
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
      "source.fixAll": true
    },
    "editor.formatOnSave": true
  }
}
```

--------------------------------------------------------------------------------

---[FILE: local-dev.md]---
Location: payload-main/packages/plugin-cloud-storage/docs/local-dev.md

```text
# Developing with this plugin locally

This repository includes a local development environment for local testing and development of this plugin. To run the local sandbox, follow the instructions below.

1. Make sure you have Node and a MongoDB to work with
1. Clone the repo
1. `yarn` in both the root folder of the repo, and the `./dev` folder
1. `cd` into `./dev` and run `cp .env.example .env` to create an `.env` file
1. Open your newly created `./dev/.env` file and _completely_ fill out each property

## Azure Adapter Development

This repository comes with a Docker emulator for Azure Blob Storage.

If you would like to test locally with an emulated blob storage container, you can `cd` into `./src/adapters/azure/emulator` and then run `docker-compose up -d`.

The default `./dev/.env.example` file comes pre-loaded with correct `env` variables that correspond to the Azure Docker emulator.

Otherwise, if you are not using the emulator, make sure your environment variables within `./dev/.env` are configured for your Azure connection.

Finally, to start the Payload dev server with the Azure adapter, run `yarn dev:azure` and then open `http://localhost:3000/admin` in your browser.

## S3 Adapter Development

This repository also includes a Docker LocalStack emulator for S3. It requires a few more steps to get up and running.

To use the S3 emulator, use the following steps:

1. Make sure you have `awscli` installed. On Mac, run `brew install awscli` to get started.
1. Make sure you have an AWS profile created. LocalStack does not verify credentials, so you can create a profile with dummy credentials. However, your `region` will need to match. To create a dummy profile for LocalStack, type `aws configure --profile localstack`. Use the access key and secret from the `./dev/.env.example` and use region `us-east-1`.
1. Now you can start the Docker container via moving to the `./src/adapters/s3/emulator` folder and running `docker-compose up -d`.
1. Once the Docker container is running, you can create a new bucket with the following command: `aws --endpoint-url=http://localhost:4566 s3 mb s3://payload-bucket`. Note that our bucket is called `payload-bucket`.
1. Finally, attach an ACL to the bucket so it is readable: `aws --endpoint-url=http://localhost:4566 s3api put-bucket-acl --bucket payload-bucket --acl public-read`

Finally, you can run `yarn dev:s3` and then open `http://localhost:3000/admin` in your browser.

## Google Cloud Storage (GCS) Adapter Development

This repository comes with a Docker emulator for Google Cloud Storage.

If you would like to test locally with an emulated GCS container, you can `cd` into `./src/adapters/gcs/emulator` and then run `docker-compose up -d`.

The default `./dev/.env.example` file comes pre-loaded with correct `env` variables that correspond to the GCS Docker emulator.

Otherwise, if you are not using the emulator, make sure your environment variables within `./dev/.env` are configured for your Google connection.

Finally, to start the Payload dev server with the GCS adapter, run `yarn dev:gcs` and then open `http://localhost:3000/admin` in your browser.
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/plugin-cloud-storage/src/index.ts

```typescript
export { cloudStoragePlugin } from './plugin.js'
```

--------------------------------------------------------------------------------

---[FILE: plugin.ts]---
Location: payload-main/packages/plugin-cloud-storage/src/plugin.ts

```typescript
import type { Config } from 'payload'

import type { AllowList, PluginOptions } from './types.js'

import { getFields } from './fields/getFields.js'
import { getAfterDeleteHook } from './hooks/afterDelete.js'
import { getBeforeChangeHook } from './hooks/beforeChange.js'

// This plugin extends all targeted collections by offloading uploaded files
// to cloud storage instead of solely storing files locally.

// It is based on an adapter approach, where adapters can be written for any cloud provider.
// Adapters are responsible for providing four actions that this plugin will use:
// 1. handleUpload, 2. handleDelete, 3. generateURL, 4. staticHandler

// Optionally, the adapter can specify any Webpack config overrides if they are necessary.

export const cloudStoragePlugin =
  (pluginOptions: PluginOptions) =>
  (incomingConfig: Config): Config => {
    const { collections: allCollectionOptions, enabled } = pluginOptions
    const config = { ...incomingConfig }

    // Return early if disabled. Only webpack config mods are applied.
    if (enabled === false) {
      return config
    }

    const initFunctions: Array<() => void> = []

    return {
      ...config,
      collections: (config.collections || []).map((existingCollection) => {
        const options = allCollectionOptions[existingCollection.slug]

        if (options?.adapter) {
          const adapter = options.adapter({
            collection: existingCollection,
            prefix: options.prefix,
          })

          if (adapter.onInit) {
            initFunctions.push(adapter.onInit)
          }

          const fields = getFields({
            adapter,
            collection: existingCollection,
            disablePayloadAccessControl: options.disablePayloadAccessControl,
            generateFileURL: options.generateFileURL,
            prefix: options.prefix,
          })

          const handlers = [
            ...(typeof existingCollection.upload === 'object' &&
            Array.isArray(existingCollection.upload.handlers)
              ? existingCollection.upload.handlers
              : []),
          ]

          if (!options.disablePayloadAccessControl) {
            handlers.push(adapter.staticHandler)
            // Else if disablePayloadAccessControl: true and clientUploads is used
            // Build the "proxied" handler that responses only when the file was requested by client upload in addDataAndFileToRequest
          } else if (adapter.clientUploads) {
            handlers.push((req, args) => {
              if ('clientUploadContext' in args.params) {
                return adapter.staticHandler(req, args)
              }
            })
          }

          const getSkipSafeFetchSetting = (): AllowList | boolean => {
            if (options.disablePayloadAccessControl) {
              return true
            }
            const isBooleanTrueSkipSafeFetch =
              typeof existingCollection.upload === 'object' &&
              existingCollection.upload.skipSafeFetch === true

            const isAllowListSkipSafeFetch =
              typeof existingCollection.upload === 'object' &&
              Array.isArray(existingCollection.upload.skipSafeFetch)

            if (isBooleanTrueSkipSafeFetch) {
              return true
            } else if (isAllowListSkipSafeFetch) {
              const existingSkipSafeFetch =
                typeof existingCollection.upload === 'object' &&
                Array.isArray(existingCollection.upload.skipSafeFetch)
                  ? existingCollection.upload.skipSafeFetch
                  : []

              const hasExactLocalhostMatch = existingSkipSafeFetch.some((entry) => {
                const entryKeys = Object.keys(entry)
                return entryKeys.length === 1 && entry.hostname === 'localhost'
              })

              const localhostEntry =
                process.env.NODE_ENV !== 'production' && !hasExactLocalhostMatch
                  ? [{ hostname: 'localhost' }]
                  : []

              return [...existingSkipSafeFetch, ...localhostEntry]
            }

            if (process.env.NODE_ENV !== 'production') {
              return [{ hostname: 'localhost' }]
            }

            return false
          }

          return {
            ...existingCollection,
            fields,
            hooks: {
              ...(existingCollection.hooks || {}),
              afterDelete: [
                ...(existingCollection.hooks?.afterDelete || []),
                getAfterDeleteHook({ adapter, collection: existingCollection }),
              ],
              beforeChange: [
                ...(existingCollection.hooks?.beforeChange || []),
                getBeforeChangeHook({ adapter, collection: existingCollection }),
              ],
            },
            upload: {
              ...(typeof existingCollection.upload === 'object' ? existingCollection.upload : {}),
              adapter: adapter.name,
              disableLocalStorage:
                typeof options.disableLocalStorage === 'boolean'
                  ? options.disableLocalStorage
                  : true,
              handlers,
              skipSafeFetch: getSkipSafeFetchSetting(),
            },
          }
        }

        return existingCollection
      }),
      onInit: async (payload) => {
        initFunctions.forEach((fn) => fn())
        if (config.onInit) {
          await config.onInit(payload)
        }
      },
    }
  }
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/plugin-cloud-storage/src/types.ts

```typescript
import type {
  CollectionConfig,
  Field,
  FileData,
  ImageSize,
  PayloadRequest,
  TypeWithID,
  UploadCollectionSlug,
} from 'payload'

export interface File {
  buffer: Buffer
  clientUploadContext?: unknown
  filename: string
  filesize: number
  mimeType: string
  tempFilePath?: string
}

export type ClientUploadsAccess = (args: {
  collectionSlug: UploadCollectionSlug
  req: PayloadRequest
}) => boolean | Promise<boolean>

export type ClientUploadsConfig =
  | {
      access?: ClientUploadsAccess
    }
  | boolean

export type HandleUpload = (args: {
  clientUploadContext: unknown
  collection: CollectionConfig
  data: any
  file: File
  req: PayloadRequest
}) => Promise<void> | void

export interface TypeWithPrefix {
  prefix?: string
}

export type HandleDelete = (args: {
  collection: CollectionConfig
  doc: FileData & TypeWithID & TypeWithPrefix
  filename: string
  req: PayloadRequest
}) => Promise<void> | void

export type GenerateURL = (args: {
  collection: CollectionConfig
  data: any
  filename: string
  prefix?: string
}) => Promise<string> | string

export type StaticHandler = (
  req: PayloadRequest,
  args: {
    doc?: TypeWithID
    headers?: Headers
    params: { clientUploadContext?: unknown; collection: string; filename: string }
  },
) => Promise<Response> | Response

export interface GeneratedAdapter {
  clientUploads?: ClientUploadsConfig
  /**
   * Additional fields to be injected into the base collection and image sizes
   */
  fields?: Field[]
  /**
   * Generates the public URL for a file
   */
  generateURL?: GenerateURL
  handleDelete: HandleDelete
  handleUpload: HandleUpload
  name: string
  onInit?: () => void
  staticHandler: StaticHandler
}

export type Adapter = (args: { collection: CollectionConfig; prefix?: string }) => GeneratedAdapter

export type AllowList = Array<{
  hostname: string
  pathname?: string
  port?: string
  protocol?: 'http' | 'https'
  search?: string
}>

export type GenerateFileURL = (args: {
  collection: CollectionConfig
  filename: string
  prefix?: string
  size?: ImageSize
}) => Promise<string> | string

export interface CollectionOptions {
  adapter: Adapter | null
  disableLocalStorage?: boolean
  disablePayloadAccessControl?: true
  generateFileURL?: GenerateFileURL
  prefix?: string
}

export interface PluginOptions {
  collections: Partial<Record<UploadCollectionSlug, CollectionOptions>>
  /**
   * Whether or not to enable the plugin
   *
   * Default: true
   */
  enabled?: boolean
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/plugin-cloud-storage/src/admin/index.ts

```typescript
import type { Config } from 'payload'

import type { PluginOptions } from '../types.js'

import { getFields } from './fields/getFields.js'

// This is the admin plugin cloud-storage stubfile.
// It only extends the config that are required by the admin UI.

export const cloudStorage =
  (pluginOptions: PluginOptions) =>
  (incomingConfig: Config): Config => {
    const { collections: allCollectionOptions, enabled } = pluginOptions
    const config = { ...incomingConfig }

    // Return early if disabled. Only webpack config mods are applied.
    if (enabled === false) {
      return config
    }

    return {
      ...config,
      collections: (config.collections || []).map((existingCollection) => {
        const options = allCollectionOptions[existingCollection.slug]

        if (options?.adapter) {
          const fields = getFields({
            collection: existingCollection,
            prefix: options.prefix,
          })

          return {
            ...existingCollection,
            fields,
          }
        }

        return existingCollection
      }),
    }
  }
```

--------------------------------------------------------------------------------

---[FILE: getFields.ts]---
Location: payload-main/packages/plugin-cloud-storage/src/admin/fields/getFields.ts

```typescript
import type { CollectionConfig, Field, GroupField, TextField } from 'payload'

import path from 'path'

interface Args {
  collection: CollectionConfig
  prefix?: string
}

export const getFields = ({ collection, prefix }: Args): Field[] => {
  const baseURLField: TextField = {
    name: 'url',
    type: 'text',
    admin: {
      hidden: true,
      readOnly: true,
    },
    label: 'URL',
  }

  const basePrefixField: TextField = {
    name: 'prefix',
    type: 'text',
    admin: {
      hidden: true,
      readOnly: true,
    },
  }

  const fields = [...collection.fields]

  // Inject a hook into all URL fields to generate URLs

  let existingURLFieldIndex = -1

  const existingURLField = fields.find((existingField, i) => {
    if ('name' in existingField && existingField.name === 'url') {
      existingURLFieldIndex = i
      return true
    }
    return false
  }) as TextField

  if (existingURLFieldIndex > -1) {
    fields.splice(existingURLFieldIndex, 1)
  }

  fields.push({
    ...baseURLField,
    ...(existingURLField || {}),
  } as TextField)

  if (typeof collection.upload === 'object' && collection.upload.imageSizes) {
    let existingSizesFieldIndex = -1

    const existingSizesField = fields.find((existingField, i) => {
      if ('name' in existingField && existingField.name === 'sizes') {
        existingSizesFieldIndex = i
        return true
      }

      return false
    }) as GroupField

    if (existingSizesFieldIndex > -1) {
      fields.splice(existingSizesFieldIndex, 1)
    }

    const sizesField: Field = {
      ...(existingSizesField || {}),
      name: 'sizes',
      type: 'group',
      admin: {
        hidden: true,
      },
      fields: collection.upload.imageSizes.map((size) => {
        const existingSizeField = existingSizesField?.fields.find(
          (existingField) => 'name' in existingField && existingField.name === size.name,
        ) as GroupField

        const existingSizeURLField = existingSizeField?.fields.find(
          (existingField) => 'name' in existingField && existingField.name === 'url',
        ) as GroupField

        return {
          ...existingSizeField,
          name: size.name,
          type: 'group',
          fields: [
            {
              ...(existingSizeURLField || {}),
              ...baseURLField,
            },
          ],
        } as Field
      }),
    }

    fields.push(sizesField)
  }

  // If prefix is enabled, save it to db
  if (typeof prefix !== 'undefined') {
    let existingPrefixFieldIndex = -1

    const existingPrefixField = fields.find((existingField, i) => {
      if ('name' in existingField && existingField.name === 'prefix') {
        existingPrefixFieldIndex = i
        return true
      }
      return false
    }) as TextField

    if (existingPrefixFieldIndex > -1) {
      fields.splice(existingPrefixFieldIndex, 1)
    }

    fields.push({
      ...basePrefixField,
      ...(existingPrefixField || {}),
      defaultValue: path.posix.join(prefix),
    } as TextField)
  }

  return fields
}
```

--------------------------------------------------------------------------------

---[FILE: createClientUploadHandler.tsx]---
Location: payload-main/packages/plugin-cloud-storage/src/client/createClientUploadHandler.tsx
Signals: React

```typescript
'use client'

import type { UploadCollectionSlug } from 'payload'

import { useConfig, useEffectEvent, useUploadHandlers } from '@payloadcms/ui'
import { Fragment, type ReactNode, useEffect } from 'react'

type ClientUploadHandlerProps<T extends Record<string, unknown>> = {
  children: ReactNode
  collectionSlug: UploadCollectionSlug
  enabled?: boolean
  extra: T
  prefix?: string
  serverHandlerPath: string
}

export const createClientUploadHandler = <T extends Record<string, unknown>>({
  handler,
}: {
  handler: (args: {
    apiRoute: string
    collectionSlug: UploadCollectionSlug
    extra: T
    file: File
    prefix?: string
    serverHandlerPath: string
    serverURL: string
    updateFilename: (value: string) => void
  }) => Promise<unknown>
}) => {
  return function ClientUploadHandler({
    children,
    collectionSlug,
    enabled,
    extra,
    prefix,
    serverHandlerPath,
  }: ClientUploadHandlerProps<T>) {
    const { setUploadHandler } = useUploadHandlers()
    const {
      config: {
        routes: { api: apiRoute },
        serverURL,
      },
    } = useConfig()

    const initializeHandler = useEffectEvent(() => {
      if (enabled) {
        setUploadHandler({
          collectionSlug,
          handler: ({ file, updateFilename }) => {
            return handler({
              apiRoute,
              collectionSlug,
              extra,
              file,
              prefix,
              serverHandlerPath,
              serverURL,
              updateFilename,
            })
          },
        })
      }
    })

    useEffect(() => {
      initializeHandler()
    }, [])

    return <Fragment>{children}</Fragment>
  }
}
```

--------------------------------------------------------------------------------

---[FILE: client.ts]---
Location: payload-main/packages/plugin-cloud-storage/src/exports/client.ts

```typescript
export { createClientUploadHandler } from '../client/createClientUploadHandler.js'
```

--------------------------------------------------------------------------------

---[FILE: utilities.ts]---
Location: payload-main/packages/plugin-cloud-storage/src/exports/utilities.ts

```typescript
export { getFilePrefix } from '../utilities/getFilePrefix.js'
export { initClientUploads } from '../utilities/initClientUploads.js'
```

--------------------------------------------------------------------------------

---[FILE: getFields.ts]---
Location: payload-main/packages/plugin-cloud-storage/src/fields/getFields.ts

```typescript
import type { CollectionConfig, Field, GroupField, TextField } from 'payload'

import path from 'path'

import type { GeneratedAdapter, GenerateFileURL } from '../types.js'

import { getAfterReadHook } from '../hooks/afterRead.js'

interface Args {
  adapter: GeneratedAdapter
  collection: CollectionConfig
  disablePayloadAccessControl?: true
  generateFileURL?: GenerateFileURL
  prefix?: string
}

export const getFields = ({
  adapter,
  collection,
  disablePayloadAccessControl,
  generateFileURL,
  prefix,
}: Args): Field[] => {
  const baseURLField: TextField = {
    name: 'url',
    type: 'text',
    admin: {
      hidden: true,
      readOnly: true,
    },
    label: 'URL',
  }

  const basePrefixField: TextField = {
    name: 'prefix',
    type: 'text',
    admin: {
      hidden: true,
      readOnly: true,
    },
  }

  const fields = [...collection.fields, ...(adapter.fields || [])]

  // Inject a hook into all URL fields to generate URLs

  let existingURLFieldIndex = -1

  const existingURLField = fields.find((existingField, i) => {
    if ('name' in existingField && existingField.name === 'url') {
      existingURLFieldIndex = i
      return true
    }
    return false
  }) as TextField

  if (existingURLFieldIndex > -1) {
    fields.splice(existingURLFieldIndex, 1)
  }

  fields.push({
    ...baseURLField,
    ...(existingURLField || {}),
    hooks: {
      afterRead: [
        getAfterReadHook({ adapter, collection, disablePayloadAccessControl, generateFileURL }),
        ...(existingURLField?.hooks?.afterRead || []),
      ],
    },
  } as TextField)

  if (typeof collection.upload === 'object' && collection.upload.imageSizes) {
    let existingSizesFieldIndex = -1

    const existingSizesField = fields.find((existingField, i) => {
      if ('name' in existingField && existingField.name === 'sizes') {
        existingSizesFieldIndex = i
        return true
      }

      return false
    }) as GroupField

    if (existingSizesFieldIndex > -1) {
      fields.splice(existingSizesFieldIndex, 1)
    }

    const sizesField: Field = {
      ...(existingSizesField || {}),
      name: 'sizes',
      type: 'group',
      admin: {
        hidden: true,
      },
      fields: collection.upload.imageSizes.map((size) => {
        const existingSizeField = existingSizesField?.fields.find(
          (existingField) => 'name' in existingField && existingField.name === size.name,
        ) as GroupField

        const existingSizeURLField = existingSizeField?.fields.find(
          (existingField) => 'name' in existingField && existingField.name === 'url',
        ) as GroupField

        return {
          ...existingSizeField,
          name: size.name,
          type: 'group',
          fields: [
            ...(adapter.fields || []),
            {
              ...(existingSizeURLField || {}),
              ...baseURLField,
              hooks: {
                afterRead: [
                  getAfterReadHook({
                    adapter,
                    collection,
                    disablePayloadAccessControl,
                    generateFileURL,
                    size,
                  }),
                  ...((typeof existingSizeURLField === 'object' &&
                    'hooks' in existingSizeURLField &&
                    existingSizeURLField?.hooks?.afterRead) ||
                    []),
                ],
              },
            },
          ],
        } as Field
      }),
    }

    fields.push(sizesField)
  }

  // If prefix is enabled, save it to db
  if (typeof prefix !== 'undefined') {
    let existingPrefixFieldIndex = -1

    const existingPrefixField = fields.find((existingField, i) => {
      if ('name' in existingField && existingField.name === 'prefix') {
        existingPrefixFieldIndex = i
        return true
      }
      return false
    }) as TextField

    if (existingPrefixFieldIndex > -1) {
      fields.splice(existingPrefixFieldIndex, 1)
    }

    fields.push({
      ...basePrefixField,
      ...(existingPrefixField || {}),
      defaultValue: path.posix.join(prefix),
    } as TextField)
  }

  return fields
}
```

--------------------------------------------------------------------------------

````
