---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 232
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 232 of 695)

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

---[FILE: afterDelete.ts]---
Location: payload-main/packages/plugin-cloud-storage/src/hooks/afterDelete.ts

```typescript
import type { CollectionAfterDeleteHook, CollectionConfig, FileData, TypeWithID } from 'payload'

import type { GeneratedAdapter, TypeWithPrefix } from '../types.js'

interface Args {
  adapter: GeneratedAdapter
  collection: CollectionConfig
}

export const getAfterDeleteHook = ({
  adapter,
  collection,
}: Args): CollectionAfterDeleteHook<FileData & TypeWithID & TypeWithPrefix> => {
  return async ({ doc, req }) => {
    try {
      const filesToDelete: string[] = [
        doc.filename,
        ...Object.values(doc?.sizes || []).map(
          (resizedFileData) => resizedFileData?.filename as string,
        ),
      ]

      const promises = filesToDelete.map(async (filename) => {
        if (filename) {
          await adapter.handleDelete({ collection, doc, filename, req })
        }
      })

      await Promise.all(promises)
    } catch (err: unknown) {
      req.payload.logger.error({
        err,
        msg: `There was an error while deleting files corresponding to the ${collection.labels?.singular} with ID ${doc.id}.`,
      })
    }
    return doc
  }
}
```

--------------------------------------------------------------------------------

---[FILE: afterRead.ts]---
Location: payload-main/packages/plugin-cloud-storage/src/hooks/afterRead.ts

```typescript
import type { CollectionConfig, FieldHook, ImageSize } from 'payload'

import type { GeneratedAdapter, GenerateFileURL } from '../types.js'

interface Args {
  adapter: GeneratedAdapter
  collection: CollectionConfig
  disablePayloadAccessControl?: boolean
  generateFileURL?: GenerateFileURL
  size?: ImageSize
}

export const getAfterReadHook =
  ({ adapter, collection, disablePayloadAccessControl, generateFileURL, size }: Args): FieldHook =>
  async ({ data, value }) => {
    const filename = size ? data?.sizes?.[size.name]?.filename : data?.filename
    const prefix = data?.prefix
    let url = value

    if (disablePayloadAccessControl && filename) {
      url = await adapter.generateURL?.({
        collection,
        data,
        filename,
        prefix,
      })
    }

    if (generateFileURL) {
      url = await generateFileURL({
        collection,
        filename,
        prefix,
        size,
      })
    }

    return url
  }
```

--------------------------------------------------------------------------------

---[FILE: beforeChange.ts]---
Location: payload-main/packages/plugin-cloud-storage/src/hooks/beforeChange.ts

```typescript
import type { CollectionBeforeChangeHook, CollectionConfig, FileData, TypeWithID } from 'payload'

import type { GeneratedAdapter } from '../types.js'

import { getIncomingFiles } from '../utilities/getIncomingFiles.js'

interface Args {
  adapter: GeneratedAdapter
  collection: CollectionConfig
}

export const getBeforeChangeHook =
  ({ adapter, collection }: Args): CollectionBeforeChangeHook<FileData & TypeWithID> =>
  async ({ data, originalDoc, req }) => {
    try {
      const files = getIncomingFiles({ data, req })

      if (files.length > 0) {
        // If there is an original doc,
        // And we have new files,
        // We need to delete the old files before uploading new
        if (originalDoc) {
          let filesToDelete: string[] = []

          if (typeof originalDoc?.filename === 'string') {
            filesToDelete.push(originalDoc.filename)
          }

          if (typeof originalDoc.sizes === 'object') {
            filesToDelete = filesToDelete.concat(
              Object.values(originalDoc?.sizes || []).map(
                (resizedFileData) => resizedFileData?.filename as string,
              ),
            )
          }

          const deletionPromises = filesToDelete.map(async (filename) => {
            if (filename) {
              await adapter.handleDelete({ collection, doc: originalDoc, filename, req })
            }
          })

          await Promise.all(deletionPromises)
        }

        const promises = files.map(async (file) => {
          await adapter.handleUpload({
            clientUploadContext: file.clientUploadContext,
            collection,
            data,
            file,
            req,
          })
        })

        await Promise.all(promises)
      }
    } catch (err: unknown) {
      req.payload.logger.error(
        `There was an error while uploading files corresponding to the collection ${collection.slug} with filename ${data.filename}:`,
      )
      req.payload.logger.error({ err })
      throw err
    }
    return data
  }
```

--------------------------------------------------------------------------------

---[FILE: getFilePrefix.ts]---
Location: payload-main/packages/plugin-cloud-storage/src/utilities/getFilePrefix.ts

```typescript
import type { CollectionConfig, PayloadRequest, UploadConfig } from 'payload'

export async function getFilePrefix({
  clientUploadContext,
  collection,
  filename,
  req,
}: {
  clientUploadContext?: unknown
  collection: CollectionConfig
  filename: string
  req: PayloadRequest
}): Promise<string> {
  // Prioritize from clientUploadContext if there is:
  if (
    clientUploadContext &&
    typeof clientUploadContext === 'object' &&
    'prefix' in clientUploadContext &&
    typeof clientUploadContext.prefix === 'string'
  ) {
    return clientUploadContext.prefix
  }

  const imageSizes = (collection?.upload as UploadConfig)?.imageSizes || []

  const files = await req.payload.find({
    collection: collection.slug,
    depth: 0,
    draft: true,
    limit: 1,
    pagination: false,
    where: {
      or: [
        {
          filename: { equals: filename },
        },
        ...imageSizes.map((imageSize) => ({
          [`sizes.${imageSize.name}.filename`]: { equals: filename },
        })),
      ],
    },
  })
  const prefix = files?.docs?.[0]?.prefix
  return prefix ? (prefix as string) : ''
}
```

--------------------------------------------------------------------------------

---[FILE: getIncomingFiles.ts]---
Location: payload-main/packages/plugin-cloud-storage/src/utilities/getIncomingFiles.ts

```typescript
import type { FileData, PayloadRequest } from 'payload'

import type { File } from '../types.js'

export function getIncomingFiles({
  data,
  req,
}: {
  data: Partial<FileData>
  req: PayloadRequest
}): File[] {
  const file = req.file

  let files: File[] = []

  if (file && data.filename && data.mimeType) {
    const mainFile: File = {
      buffer: file.data,
      clientUploadContext: file.clientUploadContext,
      filename: data.filename,
      filesize: file.size,
      mimeType: data.mimeType,
      tempFilePath: file.tempFilePath,
    }

    files = [mainFile]

    if (data?.sizes) {
      Object.entries(data.sizes).forEach(([key, resizedFileData]) => {
        if (req.payloadUploadSizes?.[key] && resizedFileData.mimeType) {
          files = files.concat([
            {
              buffer: req.payloadUploadSizes[key],
              filename: `${resizedFileData.filename}`,
              filesize: req.payloadUploadSizes[key].length,
              mimeType: resizedFileData.mimeType,
            },
          ])
        }
      })
    }
  }

  return files
}
```

--------------------------------------------------------------------------------

---[FILE: initClientUploads.ts]---
Location: payload-main/packages/plugin-cloud-storage/src/utilities/initClientUploads.ts

```typescript
import type { Config, PayloadHandler } from 'payload'

export const initClientUploads = <ExtraProps extends Record<string, unknown>, T>({
  clientHandler,
  collections,
  config,
  enabled,
  extraClientHandlerProps,
  serverHandler,
  serverHandlerPath,
}: {
  /** Path to clientHandler component */
  clientHandler: string
  collections: Record<string, T>
  config: Config
  enabled: boolean
  /** extra props to pass to the client handler */
  extraClientHandlerProps?: (collection: T) => ExtraProps
  serverHandler: PayloadHandler
  serverHandlerPath: string
}) => {
  if (enabled) {
    if (!config.endpoints) {
      config.endpoints = []
    }

    /**
     * Tracks how many times the same handler was already applied.
     * This allows to apply the same plugin multiple times, for example
     * to use different buckets for different collections.
     */
    let handlerCount = 0

    for (const endpoint of config.endpoints) {
      // We want to match on 'path', 'path-1', 'path-2', etc.
      if (endpoint.path?.startsWith(serverHandlerPath)) {
        handlerCount++
      }
    }

    if (handlerCount) {
      serverHandlerPath = `${serverHandlerPath}-${handlerCount}`
    }

    config.endpoints.push({
      handler: serverHandler,
      method: 'post',
      path: serverHandlerPath,
    })
  }

  if (!config.admin) {
    config.admin = {}
  }

  if (!config.admin.dependencies) {
    config.admin.dependencies = {}
  }
  // Ensure client handler is always part of the import map, to avoid
  // import map discrepancies between dev and prod
  config.admin.dependencies[clientHandler] = {
    type: 'function',
    path: clientHandler,
  }

  if (!config.admin.components) {
    config.admin.components = {}
  }

  if (!config.admin.components.providers) {
    config.admin.components.providers = []
  }

  for (const collectionSlug in collections) {
    const collection = collections[collectionSlug]

    let prefix: string | undefined

    if (
      collection &&
      typeof collection === 'object' &&
      'prefix' in collection &&
      typeof collection.prefix === 'string'
    ) {
      prefix = collection.prefix
    }

    config.admin.components.providers.push({
      clientProps: {
        collectionSlug,
        enabled,
        extra: extraClientHandlerProps ? extraClientHandlerProps(collection!) : undefined,
        prefix,
        serverHandlerPath,
      },
      path: clientHandler,
    })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/packages/plugin-ecommerce/.gitignore

```text
node_modules
.env
dist
demo/uploads
build
.DS_Store
package-lock.json
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: payload-main/packages/plugin-ecommerce/.prettierignore

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
Location: payload-main/packages/plugin-ecommerce/.swcrc

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

---[FILE: eslint.config.js]---
Location: payload-main/packages/plugin-ecommerce/eslint.config.js

```javascript
import { rootEslintConfig, rootParserOptions } from '../../eslint.config.js'

/** @typedef {import('eslint').Linter.Config} Config */

/** @type {Config[]} */
export const index = [
  ...rootEslintConfig,
  {
    languageOptions: {
      parserOptions: {
        ...rootParserOptions,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]

export default index
```

--------------------------------------------------------------------------------

---[FILE: LICENSE.md]---
Location: payload-main/packages/plugin-ecommerce/LICENSE.md

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
Location: payload-main/packages/plugin-ecommerce/package.json
Signals: React, Next.js

```json
{
  "name": "@payloadcms/plugin-ecommerce",
  "version": "3.68.5",
  "description": "Ecommerce plugin for Payload",
  "keywords": [
    "payload",
    "cms",
    "plugin",
    "typescript",
    "react",
    "ecommerce"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/payloadcms/payload.git",
    "directory": "packages/plugin-ecommerce"
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
  "type": "module",
  "exports": {
    ".": {
      "import": "./src/index.ts",
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    },
    "./types": {
      "import": "./src/exports/types.ts",
      "types": "./src/exports/types.ts",
      "default": "./src/exports/types.ts"
    },
    "./payments/stripe": {
      "import": "./src/exports/payments/stripe.ts",
      "types": "./src/exports/payments/stripe.ts",
      "default": "./src/exports/payments/stripe.ts"
    },
    "./rsc": {
      "import": "./src/exports/rsc.ts",
      "types": "./src/exports/rsc.ts",
      "default": "./src/exports/rsc.ts"
    },
    "./translations": {
      "import": "./src/exports/translations.ts",
      "types": "./src/exports/translations.ts",
      "default": "./src/exports/translations.ts"
    },
    "./client": {
      "import": "./src/exports/client/index.ts",
      "types": "./src/exports/client/index.ts",
      "default": "./src/exports/client/index.ts"
    },
    "./client/react": {
      "import": "./src/exports/client/react.ts",
      "types": "./src/exports/client/react.ts",
      "default": "./src/exports/client/react.ts"
    }
  },
  "main": "./src/index.tsx",
  "types": "./src/index.tsx",
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "pnpm copyfiles && pnpm build:types && pnpm build:swc",
    "build:debug": "pnpm build",
    "build:swc": "swc ./src -d ./dist --config-file .swcrc --strip-leading-paths",
    "build:types": "tsc --emitDeclarationOnly --outDir dist",
    "clean": "rimraf -g {dist,*.tsbuildinfo}",
    "copyfiles": "copyfiles -u 1 \"src/**/*.{html,css,scss,ttf,woff,woff2,eot,svg,jpg,png,json}\" dist/",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  },
  "dependencies": {
    "@payloadcms/translations": "workspace:*",
    "@payloadcms/ui": "workspace:*",
    "qs-esm": "7.0.2"
  },
  "devDependencies": {
    "@payloadcms/eslint-config": "workspace:*",
    "@payloadcms/next": "workspace:*",
    "@types/json-schema": "7.0.15",
    "@types/react": "19.2.1",
    "@types/react-dom": "19.2.1",
    "payload": "workspace:*",
    "stripe": "18.3.0"
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
        "import": "./dist/exports/types.js",
        "types": "./dist/exports/types.d.ts",
        "default": "./dist/exports/types.js"
      },
      "./payments/stripe": {
        "import": "./dist/exports/payments/stripe.js",
        "types": "./dist/exports/payments/stripe.d.ts",
        "default": "./dist/exports/payments/stripe.js"
      },
      "./rsc": {
        "import": "./dist/exports/rsc.js",
        "types": "./dist/exports/rsc.d.ts",
        "default": "./dist/exports/rsc.js"
      },
      "./client": {
        "import": "./dist/exports/client/index.js",
        "types": "./dist/exports/client/index.d.ts",
        "default": "./dist/exports/client/index.js"
      },
      "./client/react": {
        "import": "./dist/exports/client/react.js",
        "types": "./dist/exports/client/react.d.ts",
        "default": "./dist/exports/client/react.js"
      },
      "./translations": {
        "import": "./dist/exports/translations.js",
        "types": "./dist/exports/translations.d.ts",
        "default": "./dist/exports/translations.js"
      }
    },
    "main": "./dist/index.js",
    "registry": "https://registry.npmjs.org/",
    "types": "./dist/index.d.ts"
  },
  "homepage:": "https://payloadcms.com"
}
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: payload-main/packages/plugin-ecommerce/README.md

```text
# Payload Ecommerce

A set of utilities... more to come
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/packages/plugin-ecommerce/tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "strict": true,
  },
  "references": [{ "path": "../payload" }, { "path": "../ui" }, { "path": "../translations" }]
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/plugin-ecommerce/src/index.ts

```typescript
import type { Config, Endpoint } from 'payload'

import { deepMergeSimple } from 'payload/shared'

import type { EcommercePluginConfig, SanitizedEcommercePluginConfig } from './types/index.js'

import { createAddressesCollection } from './collections/addresses/createAddressesCollection.js'
import { createCartsCollection } from './collections/carts/createCartsCollection.js'
import { createOrdersCollection } from './collections/orders/createOrdersCollection.js'
import { createProductsCollection } from './collections/products/createProductsCollection.js'
import { createTransactionsCollection } from './collections/transactions/createTransactionsCollection.js'
import { createVariantOptionsCollection } from './collections/variants/createVariantOptionsCollection.js'
import { createVariantsCollection } from './collections/variants/createVariantsCollection/index.js'
import { createVariantTypesCollection } from './collections/variants/createVariantTypesCollection.js'
import { confirmOrderHandler } from './endpoints/confirmOrder.js'
import { initiatePaymentHandler } from './endpoints/initiatePayment.js'
import { translations } from './translations/index.js'
import { getCollectionSlugMap } from './utilities/getCollectionSlugMap.js'
import { pushTypeScriptProperties } from './utilities/pushTypeScriptProperties.js'
import { sanitizePluginConfig } from './utilities/sanitizePluginConfig.js'

export const ecommercePlugin =
  (pluginConfig?: EcommercePluginConfig) =>
  async (incomingConfig: Config): Promise<Config> => {
    if (!pluginConfig) {
      return incomingConfig
    }

    const sanitizedPluginConfig = sanitizePluginConfig({ pluginConfig })
    /**
     * Used to keep track of the slugs of collections in case they are overridden by the user.
     */
    const collectionSlugMap = getCollectionSlugMap({ sanitizedPluginConfig })

    const accessConfig = sanitizedPluginConfig.access

    // Ensure collections exists
    if (!incomingConfig.collections) {
      incomingConfig.collections = []
    }

    // Controls whether variants are enabled in the plugin. This is toggled to true under products config
    let enableVariants = false

    const currenciesConfig: Required<SanitizedEcommercePluginConfig['currencies']> =
      sanitizedPluginConfig.currencies

    let addressFields

    if (sanitizedPluginConfig.addresses) {
      addressFields = sanitizedPluginConfig.addresses.addressFields

      const supportedCountries = sanitizedPluginConfig.addresses.supportedCountries

      const defaultAddressesCollection = createAddressesCollection({
        access: accessConfig,
        addressFields,
        customersSlug: collectionSlugMap.customers,
        supportedCountries,
      })

      const addressesCollection =
        sanitizedPluginConfig.addresses &&
        typeof sanitizedPluginConfig.addresses === 'object' &&
        'addressesCollectionOverride' in sanitizedPluginConfig.addresses &&
        sanitizedPluginConfig.addresses.addressesCollectionOverride
          ? await sanitizedPluginConfig.addresses.addressesCollectionOverride({
              defaultCollection: defaultAddressesCollection,
            })
          : defaultAddressesCollection

      incomingConfig.collections.push(addressesCollection)
    }

    if (sanitizedPluginConfig.products) {
      const productsConfig =
        typeof sanitizedPluginConfig.products === 'boolean'
          ? {
              variants: true,
            }
          : sanitizedPluginConfig.products

      enableVariants = Boolean(productsConfig.variants)

      if (productsConfig.variants) {
        const variantsConfig =
          typeof productsConfig.variants === 'boolean' ? undefined : productsConfig.variants

        const defaultVariantsCollection = createVariantsCollection({
          access: accessConfig,
          currenciesConfig,
          inventory: sanitizedPluginConfig.inventory,
          productsSlug: collectionSlugMap.products,
          variantOptionsSlug: collectionSlugMap.variantOptions,
        })

        const variants =
          variantsConfig &&
          typeof variantsConfig === 'object' &&
          'variantsCollectionOverride' in variantsConfig &&
          variantsConfig.variantsCollectionOverride
            ? await variantsConfig.variantsCollectionOverride({
                defaultCollection: defaultVariantsCollection,
              })
            : defaultVariantsCollection

        const defaultVariantTypesCollection = createVariantTypesCollection({
          access: accessConfig,
          variantOptionsSlug: collectionSlugMap.variantOptions,
        })

        const variantTypes =
          variantsConfig &&
          typeof variantsConfig === 'object' &&
          'variantTypesCollectionOverride' in variantsConfig &&
          variantsConfig.variantTypesCollectionOverride
            ? await variantsConfig.variantTypesCollectionOverride({
                defaultCollection: defaultVariantTypesCollection,
              })
            : defaultVariantTypesCollection

        const defaultVariantOptionsCollection = createVariantOptionsCollection({
          access: accessConfig,
          variantTypesSlug: collectionSlugMap.variantTypes,
        })

        const variantOptions =
          variantsConfig &&
          typeof variantsConfig === 'object' &&
          'variantOptionsCollectionOverride' in variantsConfig &&
          variantsConfig.variantOptionsCollectionOverride
            ? await variantsConfig.variantOptionsCollectionOverride({
                defaultCollection: defaultVariantOptionsCollection,
              })
            : defaultVariantOptionsCollection

        incomingConfig.collections.push(variants, variantTypes, variantOptions)
      }

      const defaultProductsCollection = createProductsCollection({
        access: accessConfig,
        currenciesConfig,
        enableVariants,
        inventory: sanitizedPluginConfig.inventory,
        variantsSlug: collectionSlugMap.variants,
        variantTypesSlug: collectionSlugMap.variantTypes,
      })

      const productsCollection =
        productsConfig &&
        'productsCollectionOverride' in productsConfig &&
        productsConfig.productsCollectionOverride
          ? await productsConfig.productsCollectionOverride({
              defaultCollection: defaultProductsCollection,
            })
          : defaultProductsCollection

      incomingConfig.collections.push(productsCollection)

      if (sanitizedPluginConfig.carts) {
        const cartsConfig =
          typeof sanitizedPluginConfig.carts === 'object' ? sanitizedPluginConfig.carts : {}

        const defaultCartsCollection = createCartsCollection({
          access: accessConfig,
          allowGuestCarts: cartsConfig.allowGuestCarts,
          currenciesConfig,
          customersSlug: collectionSlugMap.customers,
          enableVariants: Boolean(productsConfig.variants),
          productsSlug: collectionSlugMap.products,
          variantsSlug: collectionSlugMap.variants,
        })

        const cartsCollection =
          sanitizedPluginConfig.carts &&
          typeof sanitizedPluginConfig.carts === 'object' &&
          'cartsCollectionOverride' in sanitizedPluginConfig.carts &&
          sanitizedPluginConfig.carts.cartsCollectionOverride
            ? await sanitizedPluginConfig.carts.cartsCollectionOverride({
                defaultCollection: defaultCartsCollection,
              })
            : defaultCartsCollection

        incomingConfig.collections.push(cartsCollection)
      }
    }

    if (sanitizedPluginConfig.orders) {
      const defaultOrdersCollection = createOrdersCollection({
        access: accessConfig,
        addressFields,
        currenciesConfig,
        customersSlug: collectionSlugMap.customers,
        enableVariants,
        productsSlug: collectionSlugMap.products,
        variantsSlug: collectionSlugMap.variants,
      })

      const ordersCollection =
        sanitizedPluginConfig.orders &&
        typeof sanitizedPluginConfig.orders === 'object' &&
        'ordersCollectionOverride' in sanitizedPluginConfig.orders &&
        sanitizedPluginConfig.orders.ordersCollectionOverride
          ? await sanitizedPluginConfig.orders.ordersCollectionOverride({
              defaultCollection: defaultOrdersCollection,
            })
          : defaultOrdersCollection

      incomingConfig.collections.push(ordersCollection)
    }

    const paymentMethods = sanitizedPluginConfig.payments.paymentMethods

    if (sanitizedPluginConfig.payments) {
      if (paymentMethods.length) {
        if (!Array.isArray(incomingConfig.endpoints)) {
          incomingConfig.endpoints = []
        }

        const productsValidation =
          (typeof sanitizedPluginConfig.products === 'object' &&
            sanitizedPluginConfig.products.validation) ||
          undefined

        paymentMethods.forEach((paymentMethod) => {
          const methodPath = `/payments/${paymentMethod.name}`
          const endpoints: Endpoint[] = []

          const initiatePayment: Endpoint = {
            handler: initiatePaymentHandler({
              currenciesConfig,
              inventory: sanitizedPluginConfig.inventory,
              paymentMethod,
              productsSlug: collectionSlugMap.products,
              productsValidation,
              transactionsSlug: collectionSlugMap.transactions,
              variantsSlug: collectionSlugMap.variants,
            }),
            method: 'post',
            path: `${methodPath}/initiate`,
          }

          const confirmOrder: Endpoint = {
            handler: confirmOrderHandler({
              cartsSlug: collectionSlugMap.carts,
              currenciesConfig,
              ordersSlug: collectionSlugMap.orders,
              paymentMethod,
              productsValidation,
              transactionsSlug: collectionSlugMap.transactions,
            }),
            method: 'post',
            path: `${methodPath}/confirm-order`,
          }

          endpoints.push(initiatePayment, confirmOrder)

          // Attach any additional endpoints defined in the payment method
          if (paymentMethod.endpoints && paymentMethod.endpoints.length > 0) {
            const methodEndpoints = paymentMethod.endpoints.map((endpoint) => {
              const path = endpoint.path.startsWith('/') ? endpoint.path : `/${endpoint.path}`

              return {
                ...endpoint,
                path: `${methodPath}${path}`,
              }
            })

            endpoints.push(...methodEndpoints)
          }

          incomingConfig.endpoints!.push(...endpoints)
        })
      }
    }

    if (sanitizedPluginConfig.transactions) {
      const defaultTransactionsCollection = createTransactionsCollection({
        access: accessConfig,
        addressFields,
        cartsSlug: collectionSlugMap.carts,
        currenciesConfig,
        customersSlug: collectionSlugMap.customers,
        enableVariants,
        ordersSlug: collectionSlugMap.orders,
        paymentMethods,
        productsSlug: collectionSlugMap.products,
        variantsSlug: collectionSlugMap.variants,
      })

      const transactionsCollection =
        sanitizedPluginConfig.transactions &&
        typeof sanitizedPluginConfig.transactions === 'object' &&
        'transactionsCollectionOverride' in sanitizedPluginConfig.transactions &&
        sanitizedPluginConfig.transactions.transactionsCollectionOverride
          ? await sanitizedPluginConfig.transactions.transactionsCollectionOverride({
              defaultCollection: defaultTransactionsCollection,
            })
          : defaultTransactionsCollection

      incomingConfig.collections.push(transactionsCollection)
    }

    if (!incomingConfig.i18n) {
      incomingConfig.i18n = {}
    }

    if (!incomingConfig.i18n?.translations) {
      incomingConfig.i18n.translations = {}
    }

    incomingConfig.i18n.translations = deepMergeSimple(
      translations,
      incomingConfig.i18n?.translations,
    )

    if (!incomingConfig.typescript) {
      incomingConfig.typescript = {}
    }

    if (!incomingConfig.typescript.schema) {
      incomingConfig.typescript.schema = []
    }

    incomingConfig.typescript.schema.push((args) =>
      pushTypeScriptProperties({
        ...args,
        collectionSlugMap,
        sanitizedPluginConfig,
      }),
    )

    return incomingConfig
  }

export {
  createAddressesCollection,
  createCartsCollection,
  createOrdersCollection,
  createProductsCollection,
  createTransactionsCollection,
  createVariantOptionsCollection,
  createVariantsCollection,
  createVariantTypesCollection,
}

export { EUR, GBP, USD } from './currencies/index.js'
export { amountField } from './fields/amountField.js'
export { currencyField } from './fields/currencyField.js'
export { pricesField } from './fields/pricesField.js'
export { statusField } from './fields/statusField.js'
export { variantsFields } from './fields/variantsFields.js'
```

--------------------------------------------------------------------------------

---[FILE: createAddressesCollection.ts]---
Location: payload-main/packages/plugin-ecommerce/src/collections/addresses/createAddressesCollection.ts

```typescript
import type { CollectionConfig, Field } from 'payload'

import type { AccessConfig, CountryType } from '../../types/index.js'

import { accessOR } from '../../utilities/accessComposition.js'
import { defaultCountries } from './defaultCountries.js'
import { beforeChange } from './hooks/beforeChange.js'

type Props = {
  access: Pick<
    AccessConfig,
    'customerOnlyFieldAccess' | 'isAdmin' | 'isAuthenticated' | 'isDocumentOwner'
  >
  /**
   * Array of fields used for capturing the address data. Use this over overrides to customise the fields here as it's reused across the plugin.
   */
  addressFields: Field[]
  /**
   * Slug of the customers collection, defaults to 'users'.
   */
  customersSlug?: string
  supportedCountries?: CountryType[]
}

export const createAddressesCollection: (props: Props) => CollectionConfig = (props) => {
  const { access, addressFields, customersSlug = 'users' } = props || {}

  const { supportedCountries: supportedCountriesFromProps } = props || {}
  const supportedCountries = supportedCountriesFromProps || defaultCountries
  const hasOnlyOneCountry = supportedCountries && supportedCountries.length === 1

  const fields: Field[] = [
    {
      name: 'customer',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      label: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:customer'),
      relationTo: customersSlug,
    },
    ...addressFields.map((field) => {
      if ('name' in field && field.name === 'country') {
        return {
          name: 'country',
          type: 'select',
          label: ({ t }) =>
            // @ts-expect-error - translations are not typed in plugins yet
            t('plugin-ecommerce:addressCountry'),
          options: supportedCountries || defaultCountries,
          required: true,
          ...(supportedCountries && supportedCountries?.[0] && hasOnlyOneCountry
            ? {
                defaultValue: supportedCountries?.[0].value,
              }
            : {}),
        } as Field
      }

      return field
    }),
  ]

  const baseConfig: CollectionConfig = {
    slug: 'addresses',
    access: {
      create: access.isAuthenticated,
      delete: accessOR(access.isAdmin, access.isDocumentOwner),
      read: accessOR(access.isAdmin, access.isDocumentOwner),
      update: accessOR(access.isAdmin, access.isDocumentOwner),
    },
    admin: {
      description: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:addressesCollectionDescription'),
      group: 'Ecommerce',
      hidden: true,
      useAsTitle: 'createdAt',
    },
    fields,
    hooks: {
      beforeChange: [beforeChange({ customerOnlyFieldAccess: access.customerOnlyFieldAccess })],
    },
    labels: {
      plural: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:addresses'),
      singular: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:address'),
    },
    timestamps: true,
  }

  return { ...baseConfig }
}
```

--------------------------------------------------------------------------------

---[FILE: defaultAddressFields.ts]---
Location: payload-main/packages/plugin-ecommerce/src/collections/addresses/defaultAddressFields.ts

```typescript
import type { Field } from 'payload'

export const defaultAddressFields: () => Field[] = () => {
  return [
    {
      name: 'title',
      type: 'text',
      label: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:addressTitle'),
    },
    {
      name: 'firstName',
      type: 'text',
      label: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:addressFirstName'),
    },
    {
      name: 'lastName',
      type: 'text',
      label: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:addressLastName'),
    },
    {
      name: 'company',
      type: 'text',
      label: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:addressCompany'),
    },
    {
      name: 'addressLine1',
      type: 'text',
      label: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:addressLine1'),
    },
    {
      name: 'addressLine2',
      type: 'text',
      label: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:addressLine2'),
    },
    {
      name: 'city',
      type: 'text',
      label: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:addressCity'),
    },
    {
      name: 'state',
      type: 'text',
      label: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:addressState'),
    },
    {
      name: 'postalCode',
      type: 'text',
      label: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:addressPostalCode'),
    },
    {
      name: 'country',
      type: 'text',
      label: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:addressCountry'),
    },
    {
      name: 'phone',
      type: 'text',
      label: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:addressPhone'),
    },
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: defaultCountries.ts]---
Location: payload-main/packages/plugin-ecommerce/src/collections/addresses/defaultCountries.ts

```typescript
import type { CountryType } from '../../types/index.js'

/**
 * Default list of countries supported for forms and payments.
 * This can be overriden or reused in other parts of the application.
 *
 * The label is the human-readable name of the country, and the value is the ISO 3166-1 alpha-2 code.
 */
export const defaultCountries: CountryType[] = [
  { label: 'United States', value: 'US' },
  { label: 'United Kingdom', value: 'GB' },
  { label: 'Canada', value: 'CA' },
  { label: 'Australia', value: 'AU' },
  { label: 'Austria', value: 'AT' },
  { label: 'Belgium', value: 'BE' },
  { label: 'Brazil', value: 'BR' },
  { label: 'Bulgaria', value: 'BG' },
  { label: 'Cyprus', value: 'CY' },
  { label: 'Czech Republic', value: 'CZ' },
  { label: 'Denmark', value: 'DK' },
  { label: 'Estonia', value: 'EE' },
  { label: 'Finland', value: 'FI' },
  { label: 'France', value: 'FR' },
  { label: 'Germany', value: 'DE' },
  { label: 'Greece', value: 'GR' },
  { label: 'Hong Kong', value: 'HK' },
  { label: 'Hungary', value: 'HU' },
  { label: 'India', value: 'IN' },
  { label: 'Ireland', value: 'IE' },
  { label: 'Italy', value: 'IT' },
  { label: 'Japan', value: 'JP' },
  { label: 'Latvia', value: 'LV' },
  { label: 'Lithuania', value: 'LT' },
  { label: 'Luxembourg', value: 'LU' },
  { label: 'Malaysia', value: 'MY' },
  { label: 'Malta', value: 'MT' },
  { label: 'Mexico', value: 'MX' },
  { label: 'Netherlands', value: 'NL' },
  { label: 'New Zealand', value: 'NZ' },
  { label: 'Norway', value: 'NO' },
  { label: 'Poland', value: 'PL' },
  { label: 'Portugal', value: 'PT' },
  { label: 'Romania', value: 'RO' },
  { label: 'Singapore', value: 'SG' },
  { label: 'Slovakia', value: 'SK' },
  { label: 'Slovenia', value: 'SI' },
  { label: 'Spain', value: 'ES' },
  { label: 'Sweden', value: 'SE' },
  { label: 'Switzerland', value: 'CH' },
]
```

--------------------------------------------------------------------------------

---[FILE: beforeChange.ts]---
Location: payload-main/packages/plugin-ecommerce/src/collections/addresses/hooks/beforeChange.ts

```typescript
import type { CollectionBeforeChangeHook } from 'payload'

import type { AccessConfig } from '../../../types/index.js'

interface Props {
  customerOnlyFieldAccess: AccessConfig['customerOnlyFieldAccess']
}

export const beforeChange: (args: Props) => CollectionBeforeChangeHook =
  ({ customerOnlyFieldAccess }) =>
  async ({ data, req }) => {
    const isCustomer = await customerOnlyFieldAccess({ req })

    // Ensure that the customer field is set to the current user's ID if the user is a customer.
    // Admins can set to any customer.
    if (req.user && isCustomer) {
      data.customer = req.user.id
    }
  }
```

--------------------------------------------------------------------------------

````
