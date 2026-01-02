---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 312
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 312 of 695)

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

---[FILE: handleUpload.ts]---
Location: payload-main/packages/storage-vercel-blob/src/handleUpload.ts

```typescript
import type { HandleUpload } from '@payloadcms/plugin-cloud-storage/types'

import { put } from '@vercel/blob'
import path from 'path'

import type { VercelBlobStorageOptions } from './index.js'

type HandleUploadArgs = {
  baseUrl: string
  prefix?: string
} & Omit<VercelBlobStorageOptions, 'collections'>

export const getHandleUpload = ({
  access = 'public',
  addRandomSuffix,
  baseUrl,
  cacheControlMaxAge,
  prefix = '',
  token,
}: HandleUploadArgs): HandleUpload => {
  return async ({ data, file: { buffer, filename, mimeType } }) => {
    const fileKey = path.posix.join(data.prefix || prefix, filename)

    const result = await put(fileKey, buffer, {
      access,
      addRandomSuffix,
      cacheControlMaxAge,
      contentType: mimeType,
      token,
    })

    // Get filename with suffix from returned url
    if (addRandomSuffix) {
      data.filename = decodeURIComponent(result.url.replace(`${baseUrl}/`, ''))
    }

    return data
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/storage-vercel-blob/src/index.ts

```typescript
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

import type { VercelBlobClientUploadHandlerExtra } from './client/VercelBlobClientUploadHandler.js'

import { getGenerateUrl } from './generateURL.js'
import { getClientUploadRoute } from './getClientUploadRoute.js'
import { getHandleDelete } from './handleDelete.js'
import { getHandleUpload } from './handleUpload.js'
import { getStaticHandler } from './staticHandler.js'

export type VercelBlobStorageOptions = {
  /**
   * Access control level. Currently, only 'public' is supported.
   * Vercel plans on adding support for private blobs in the future.
   *
   * @default 'public'
   */
  access?: 'public'

  /**
   * Add a random suffix to the uploaded file name in Vercel Blob storage
   *
   * @default false
   */
  addRandomSuffix?: boolean

  /**
   * Cache-Control max-age in seconds
   *
   * @default 365 * 24 * 60 * 60 // (1 Year)
   */
  cacheControlMaxAge?: number

  /**
   * Do uploads directly on the client, to bypass limits on Vercel.
   */
  clientUploads?: ClientUploadsConfig

  /**
   * Collections to apply the Vercel Blob adapter to
   */
  collections: Partial<Record<UploadCollectionSlug, Omit<CollectionOptions, 'adapter'> | true>>

  /**
   * Whether or not to enable the plugin
   *
   * Default: true
   */
  enabled?: boolean

  /**
   * Vercel Blob storage read/write token
   *
   * Usually process.env.BLOB_READ_WRITE_TOKEN set by Vercel
   *
   * If unset, the plugin will be disabled and will fallback to local storage
   */
  token: string | undefined
}

const defaultUploadOptions: Partial<VercelBlobStorageOptions> = {
  access: 'public',
  addRandomSuffix: false,
  cacheControlMaxAge: 60 * 60 * 24 * 365, // 1 year
  enabled: true,
}

type VercelBlobStoragePlugin = (vercelBlobStorageOpts: VercelBlobStorageOptions) => Plugin

export const vercelBlobStorage: VercelBlobStoragePlugin =
  (options: VercelBlobStorageOptions) =>
  (incomingConfig: Config): Config => {
    // Parse storeId from token
    const storeId = options.token
      ?.match(/^vercel_blob_rw_([a-z\d]+)_[a-z\d]+$/i)?.[1]
      ?.toLowerCase()

    const isPluginDisabled = options.enabled === false || !options.token

    // Don't throw if the plugin is disabled
    if (!storeId && !isPluginDisabled) {
      throw new Error(
        'Invalid token format for Vercel Blob adapter. Should be vercel_blob_rw_<store_id>_<random_string>.',
      )
    }

    const optionsWithDefaults = {
      ...defaultUploadOptions,
      ...options,
    }

    const baseUrl = `https://${storeId}.${optionsWithDefaults.access}.blob.vercel-storage.com`

    initClientUploads<
      VercelBlobClientUploadHandlerExtra,
      VercelBlobStorageOptions['collections'][string]
    >({
      clientHandler: '@payloadcms/storage-vercel-blob/client#VercelBlobClientUploadHandler',
      collections: options.collections,
      config: incomingConfig,
      enabled: !isPluginDisabled && Boolean(options.clientUploads),
      extraClientHandlerProps: (collection) => ({
        addRandomSuffix: !!optionsWithDefaults.addRandomSuffix,
        baseURL: baseUrl,
        prefix:
          (typeof collection === 'object' && collection.prefix && `${collection.prefix}/`) || '',
      }),
      serverHandler: getClientUploadRoute({
        access:
          typeof options.clientUploads === 'object' ? options.clientUploads.access : undefined,
        addRandomSuffix: optionsWithDefaults.addRandomSuffix,
        cacheControlMaxAge: options.cacheControlMaxAge,
        token: options.token ?? '',
      }),
      serverHandlerPath: '/vercel-blob-client-upload-route',
    })

    // If the plugin is disabled or no token is provided, do not enable the plugin
    if (isPluginDisabled) {
      return incomingConfig
    }

    const adapter = vercelBlobStorageInternal({ ...optionsWithDefaults, baseUrl })

    // Add adapter to each collection option object
    const collectionsWithAdapter: CloudStoragePluginOptions['collections'] = Object.entries(
      options.collections,
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

function vercelBlobStorageInternal(
  options: { baseUrl: string } & VercelBlobStorageOptions,
): Adapter {
  return ({ collection, prefix }): GeneratedAdapter => {
    const { access, addRandomSuffix, baseUrl, cacheControlMaxAge, clientUploads, token } = options

    if (!token) {
      throw new Error('Vercel Blob storage token is required')
    }

    return {
      name: 'vercel-blob',
      clientUploads,
      generateURL: getGenerateUrl({ baseUrl, prefix }),
      handleDelete: getHandleDelete({ baseUrl, prefix, token }),
      handleUpload: getHandleUpload({
        access,
        addRandomSuffix,
        baseUrl,
        cacheControlMaxAge,
        prefix,
        token,
      }),
      staticHandler: getStaticHandler({ baseUrl, cacheControlMaxAge, token }, collection),
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: staticHandler.ts]---
Location: payload-main/packages/storage-vercel-blob/src/staticHandler.ts

```typescript
import type { StaticHandler } from '@payloadcms/plugin-cloud-storage/types'
import type { CollectionConfig } from 'payload'

import { getFilePrefix } from '@payloadcms/plugin-cloud-storage/utilities'
import { BlobNotFoundError, head } from '@vercel/blob'
import path from 'path'

type StaticHandlerArgs = {
  baseUrl: string
  cacheControlMaxAge?: number
  token: string
}

export const getStaticHandler = (
  { baseUrl, cacheControlMaxAge = 0, token }: StaticHandlerArgs,
  collection: CollectionConfig,
): StaticHandler => {
  return async (req, { headers: incomingHeaders, params: { clientUploadContext, filename } }) => {
    try {
      const prefix = await getFilePrefix({ clientUploadContext, collection, filename, req })
      const fileKey = path.posix.join(prefix, encodeURIComponent(filename))
      const fileUrl = `${baseUrl}/${fileKey}`
      const etagFromHeaders = req.headers.get('etag') || req.headers.get('if-none-match')
      const blobMetadata = await head(fileUrl, { token })
      const { contentDisposition, contentType, size, uploadedAt } = blobMetadata
      const uploadedAtString = uploadedAt.toISOString()
      const ETag = `"${fileKey}-${uploadedAtString}"`

      let headers = new Headers(incomingHeaders)

      headers.append('Cache-Control', `public, max-age=${cacheControlMaxAge}`)
      headers.append('Content-Disposition', contentDisposition)
      headers.append('Content-Length', String(size))
      headers.append('Content-Type', contentType)
      headers.append('ETag', ETag)

      if (
        collection.upload &&
        typeof collection.upload === 'object' &&
        typeof collection.upload.modifyResponseHeaders === 'function'
      ) {
        headers = collection.upload.modifyResponseHeaders({ headers }) || headers
      }

      if (etagFromHeaders && etagFromHeaders === ETag) {
        return new Response(null, {
          headers,
          status: 304,
        })
      }

      const response = await fetch(`${fileUrl}?${uploadedAtString}`, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          Pragma: 'no-cache',
        },
      })

      const blob = await response.blob()

      if (!blob) {
        return new Response(null, { status: 204, statusText: 'No Content' })
      }

      const bodyBuffer = await blob.arrayBuffer()

      headers.append('Last-Modified', uploadedAtString)

      return new Response(bodyBuffer, {
        headers,
        status: 200,
      })
    } catch (err: unknown) {
      if (err instanceof BlobNotFoundError) {
        return new Response(null, { status: 404, statusText: 'Not Found' })
      }
      req.payload.logger.error({ err, msg: 'Unexpected error in staticHandler' })
      return new Response('Internal Server Error', { status: 500 })
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: VercelBlobClientUploadHandler.ts]---
Location: payload-main/packages/storage-vercel-blob/src/client/VercelBlobClientUploadHandler.ts

```typescript
'use client'
import { createClientUploadHandler } from '@payloadcms/plugin-cloud-storage/client'
import { upload } from '@vercel/blob/client'

export type VercelBlobClientUploadHandlerExtra = {
  addRandomSuffix: boolean
  baseURL: string
  prefix: string
}

export const VercelBlobClientUploadHandler =
  createClientUploadHandler<VercelBlobClientUploadHandlerExtra>({
    handler: async ({
      apiRoute,
      collectionSlug,
      extra: { addRandomSuffix, baseURL, prefix = '' },
      file,
      serverHandlerPath,
      serverURL,
      updateFilename,
    }) => {
      const result = await upload(`${prefix}${file.name}`, file, {
        access: 'public',
        clientPayload: collectionSlug,
        contentType: file.type,
        handleUploadUrl: `${serverURL}${apiRoute}${serverHandlerPath}`,
      })

      // Update filename with suffix from returned url
      if (addRandomSuffix) {
        updateFilename(result.url.replace(`${baseURL}/`, ''))
      }

      return { prefix }
    },
  })
```

--------------------------------------------------------------------------------

---[FILE: client.ts]---
Location: payload-main/packages/storage-vercel-blob/src/exports/client.ts

```typescript
export { VercelBlobClientUploadHandler } from '../client/VercelBlobClientUploadHandler.js'
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/packages/translations/.gitignore

```text
./dist
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: payload-main/packages/translations/.prettierignore

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
**/docs/**
tsconfig.json
```

--------------------------------------------------------------------------------

---[FILE: .swcrc]---
Location: payload-main/packages/translations/.swcrc

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
Location: payload-main/packages/translations/LICENSE.md

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
Location: payload-main/packages/translations/package.json
Signals: React

```json
{
  "name": "@payloadcms/translations",
  "version": "3.68.5",
  "homepage": "https://payloadcms.com",
  "repository": {
    "type": "git",
    "url": "https://github.com/payloadcms/payload.git",
    "directory": "packages/translations"
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
      "import": "./src/exports/index.ts",
      "types": "./src/exports/index.ts",
      "default": "./src/exports/index.ts"
    },
    "./all": {
      "import": "./src/exports/all.ts",
      "types": "./src/exports/all.ts",
      "default": "./src/exports/all.ts"
    },
    "./utilities": {
      "import": "./src/exports/utilities.ts",
      "types": "./src/exports/utilities.ts",
      "default": "./src/exports/utilities.ts"
    },
    "./languages/*": {
      "import": "./src/languages/*.ts",
      "types": "./src/languages/*.ts",
      "default": "./src/languages/*.ts"
    }
  },
  "main": "./src/exports/index.ts",
  "types": "./src/exports/index.ts",
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "pnpm build:types && pnpm build:swc",
    "build:debug": "pnpm build",
    "build:swc": "swc ./src -d ./dist --config-file .swcrc --strip-leading-paths",
    "build:types": "tsc --emitDeclarationOnly --outDir dist",
    "clean": "rimraf -g {dist,*.tsbuildinfo}",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  },
  "dependencies": {
    "date-fns": "4.1.0"
  },
  "devDependencies": {
    "@payloadcms/eslint-config": "workspace:*",
    "@types/react": "19.2.1",
    "@types/react-dom": "19.2.1",
    "dotenv": "16.4.7",
    "prettier": "3.5.3",
    "typescript": "5.7.3"
  },
  "publishConfig": {
    "exports": {
      ".": {
        "import": "./dist/exports/index.js",
        "types": "./dist/exports/index.d.ts",
        "default": "./dist/exports/index.js"
      },
      "./all": {
        "import": "./dist/exports/all.js",
        "types": "./dist/exports/all.d.ts",
        "default": "./dist/exports/all.js"
      },
      "./utilities": {
        "import": "./dist/exports/utilities.js",
        "types": "./dist/exports/utilities.d.ts",
        "default": "./dist/exports/utilities.js"
      },
      "./languages/*": {
        "import": "./dist/languages/*.js",
        "types": "./dist/languages/*.d.ts",
        "default": "./dist/languages/*.js"
      }
    },
    "main": "./dist/exports/index.js",
    "types": "./dist/exports/index.d.ts"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: payload-main/packages/translations/README.md

```text
# Payload Translations

The home of Payloads API and Admin Panel translations.

## How to contribute

#### Updating a translation

1. Update the translation value
2. Run one of the following:
   ```sh
   yarn build
   // or
   npm build
   // or
   pnpm build
   ```

#### Adding a new translation

1. Add the new translation key/value pair for **all** languages located in the `<payload-repo-root>/packages/translations/src/languages` folder
2. Run one of the following:
   ```sh
   yarn build
   // or
   npm build
   // or
   pnpm build
   ```

#### Adding a new language

1. Create a new TS file in the `<payload-repo-root>/packages/translations/src/languages` folder, use the language code as the file name (e.g. `<payload-repo-root>/packages/translations/src/languages/en.ts` for English)
2. Copy all translations from an existing language file and update all of the translations to match your new language. Make sure the translation object containing all the translations is type `DefaultTranslationsObject`.
3. Run one of the following:
   ```sh
   yarn build
   // or
   npm build
   // or
   pnpm build
   ```
4. Import and export your new language file from within `<payload-repo-root>/packages/translations/src/exports/all.ts`
5. Re-export the file from within `<payload-repo-root>/packages/payload/src/exports/i18n/[your-new-language].ts`

Here is a full list of language keys. Note that these are not all implemented, but if you would like to contribute and add a new language, you can use this list as a reference:

| Language Code  | Language Name                              |
| -------------- | ------------------------------------------ |
| af             | Afrikaans                                  |
| am             | Amharic                                    |
| ar-sa          | Arabic (Saudi Arabia)                      |
| as             | Assamese                                   |
| az-Latn        | Azerbaijani (Latin)                        |
| be             | Belarusian                                 |
| bg             | Bulgarian                                  |
| bn-BD          | Bangla (Bangladesh)                        |
| bn-IN          | Bangla (India)                             |
| bs             | Bosnian (Latin)                            |
| ca             | Catalan Spanish                            |
| ca-ES-valencia | Valencian                                  |
| cs             | Czech                                      |
| cy             | Welsh                                      |
| da             | Danish                                     |
| de             | German (Germany)                           |
| el             | Greek                                      |
| en-GB          | English (United Kingdom)                   |
| en-US          | English (United States)                    |
| es             | Spanish (Spain)                            |
| es-ES          | Spanish (Spain)                            |
| es-US          | Spanish (United States)                    |
| es-MX          | Spanish (Mexico)                           |
| et             | Estonian                                   |
| eu             | Basque                                     |
| fa             | Persian                                    |
| fi             | Finnish                                    |
| fil-Latn       | Filipino                                   |
| fr             | French (France)                            |
| fr-FR          | French (France)                            |
| fr-CA          | French (Canada)                            |
| ga             | Irish                                      |
| gd-Latn        | Scottish Gaelic                            |
| gl             | Galician                                   |
| gu             | Gujarati                                   |
| ha-Latn        | Hausa (Latin)                              |
| he             | Hebrew                                     |
| hi             | Hindi                                      |
| hr             | Croatian                                   |
| hu             | Hungarian                                  |
| hy             | Armenian                                   |
| id             | Indonesian                                 |
| ig-Latn        | Igbo                                       |
| is             | Icelandic                                  |
| it             | Italian (Italy)                            |
| it-it          | Italian (Italy)                            |
| ja             | Japanese                                   |
| ka             | Georgian                                   |
| kk             | Kazakh                                     |
| km             | Khmer                                      |
| kn             | Kannada                                    |
| ko             | Korean                                     |
| kok            | Konkani                                    |
| ku-Arab        | Central Kurdish                            |
| ky-Cyrl        | Kyrgyz                                     |
| lb             | Luxembourgish                              |
| lt             | Lithuanian                                 |
| lv             | Latvian                                    |
| mi-Latn        | Maori                                      |
| mk             | Macedonian                                 |
| ml             | Malayalam                                  |
| mn-Cyrl        | Mongolian (Cyrillic)                       |
| mr             | Marathi                                    |
| ms             | Malay (Malaysia)                           |
| mt             | Maltese                                    |
| nb             | Norwegian (Bokmål)                         |
| ne             | Nepali (Nepal)                             |
| nl             | Dutch (Netherlands)                        |
| nl-BE          | Dutch (Netherlands)                        |
| nn             | Norwegian (Nynorsk)                        |
| nso            | Sesotho sa Leboa                           |
| or             | Odia                                       |
| pa             | Punjabi (Gurmukhi)                         |
| pa-Arab        | Punjabi (Arabic)                           |
| pl             | Polish                                     |
| prs-Arab       | Dari                                       |
| pt-BR          | Portuguese (Brazil)                        |
| pt-PT          | Portuguese (Portugal)                      |
| qut-Latn       | K’iche’                                    |
| quz            | Quechua (Peru)                             |
| ro             | Romanian (Romania)                         |
| ru             | Russian                                    |
| rw             | Kinyarwanda                                |
| sd-Arab        | Sindhi (Arabic)                            |
| si             | Sinhala                                    |
| sk             | Slovak                                     |
| sl             | Slovenian                                  |
| sq             | Albanian                                   |
| sr-Cyrl-BA     | Serbian (Cyrillic, Bosnia and Herzegovina) |
| sr-Cyrl-RS     | Serbian (Cyrillic, Serbia)                 |
| sr-Latn-RS     | Serbian (Latin, Serbia)                    |
| sv             | Swedish (Sweden)                           |
| sw             | Kiswahili                                  |
| ta             | Tamil                                      |
| te             | Telugu                                     |
| tg-Cyrl        | Tajik (Cyrillic)                           |
| th             | Thai                                       |
| ti             | Tigrinya                                   |
| tk-Latn        | Turkmen (Latin)                            |
| tn             | Setswana                                   |
| tr             | Turkish                                    |
| tt-Cyrl        | Tatar (Cyrillic)                           |
| ug-Arab        | Uyghur                                     |
| uk             | Ukrainian                                  |
| ur             | Urdu                                       |
| uz-Latn        | Uzbek (Latin)                              |
| vi             | Vietnamese                                 |
| wo             | Wolof                                      |
| xh             | isiXhosa                                   |
| yo-Latn        | Yoruba                                     |
| zh-Hans        | Chinese (Simplified)                       |
| zh-Hant        | Chinese (Traditional)                      |
| zu             | isiZulu                                    |
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/packages/translations/tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "include": [
    "./src/**/*.ts",
  ],
  "compilerOptions": {
    // Do not include DOM and DOM.Iterable as this is a server-only package.
    "lib": ["ES2022"],
  }
}
```

--------------------------------------------------------------------------------

````
