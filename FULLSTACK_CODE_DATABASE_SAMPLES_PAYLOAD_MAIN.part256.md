---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 256
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 256 of 695)

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

---[FILE: populateBreadcrumbsBeforeChange.ts]---
Location: payload-main/packages/plugin-nested-docs/src/hooks/populateBreadcrumbsBeforeChange.ts

```typescript
import type { CollectionBeforeChangeHook } from 'payload'

import type { NestedDocsPluginConfig } from '../types.js'

import { populateBreadcrumbs } from '../utilities/populateBreadcrumbs.js'

export const populateBreadcrumbsBeforeChange =
  (pluginConfig: NestedDocsPluginConfig): CollectionBeforeChangeHook =>
  async ({ collection, data, originalDoc, req }) =>
    populateBreadcrumbs({
      breadcrumbsFieldName: pluginConfig.breadcrumbsFieldSlug,
      collection,
      data,
      generateLabel: pluginConfig.generateLabel,
      generateURL: pluginConfig.generateURL,
      originalDoc,
      parentFieldName: pluginConfig.parentFieldSlug,
      req,
    })
```

--------------------------------------------------------------------------------

---[FILE: resaveChildren.ts]---
Location: payload-main/packages/plugin-nested-docs/src/hooks/resaveChildren.ts

```typescript
import type { CollectionAfterChangeHook, JsonObject, ValidationError } from 'payload'

import { APIError, ValidationErrorName } from 'payload'

import type { NestedDocsPluginConfig } from '../types.js'

import { populateBreadcrumbs } from '../utilities/populateBreadcrumbs.js'

export const resaveChildren =
  (pluginConfig: NestedDocsPluginConfig): CollectionAfterChangeHook =>
  async ({ collection, doc, req }) => {
    if (collection?.versions?.drafts && doc._status !== 'published') {
      // If the parent is a draft, don't resave children
      return
    }

    const parentSlug = pluginConfig?.parentFieldSlug || 'parent'

    const initialDraftChildren = await req.payload.find({
      collection: collection.slug,
      depth: 0,
      draft: true,
      limit: 0,
      locale: req.locale,
      req,
      where: {
        [parentSlug]: {
          equals: doc.id,
        },
      },
    })

    const draftChildren = initialDraftChildren.docs.filter((child) => child._status === 'draft')

    const publishedChildren = await req.payload.find({
      collection: collection.slug,
      depth: 0,
      draft: false,
      limit: 0,
      locale: req.locale,
      req,
      where: {
        [parentSlug]: {
          equals: doc.id,
        },
      },
    })

    const childrenById = [...draftChildren, ...publishedChildren.docs].reduce<
      Record<string, JsonObject[]>
    >((acc, child) => {
      acc[child.id] = acc[child.id] || []
      acc[child.id]!.push(child)
      return acc
    }, {})

    const sortedChildren = Object.values(childrenById).flatMap((group: JsonObject[]) => {
      return group.sort((a, b) => {
        if (a.updatedAt !== b.updatedAt) {
          return a.updatedAt > b.updatedAt ? 1 : -1
        }
        return a._status === 'published' ? 1 : -1
      })
    })

    if (sortedChildren.length) {
      try {
        for (const child of sortedChildren) {
          const isDraft = child._status !== 'published'

          await req.payload.update({
            id: child.id,
            collection: collection.slug,
            data: populateBreadcrumbs({
              collection,
              data: child,
              generateLabel: pluginConfig.generateLabel,
              generateURL: pluginConfig.generateURL,
              parentFieldName: pluginConfig.parentFieldSlug,
              req,
            }),
            depth: 0,
            draft: isDraft,
            locale: req.locale,
            req,
          })
        }
      } catch (err: unknown) {
        req.payload.logger.error(
          `Nested Docs plugin encountered an error while re-saving a child document.`,
        )
        req.payload.logger.error(err)

        if (
          (err as ValidationError)?.name === ValidationErrorName &&
          (err as ValidationError)?.data?.errors?.length
        ) {
          throw new APIError(
            'Could not publish or save changes: One or more children are invalid.',
            400,
          )
        }
      }
    }

    return undefined
  }
```

--------------------------------------------------------------------------------

---[FILE: resaveSelfAfterCreate.ts]---
Location: payload-main/packages/plugin-nested-docs/src/hooks/resaveSelfAfterCreate.ts

```typescript
import type { CollectionAfterChangeHook } from 'payload'

import type { Breadcrumb, NestedDocsPluginConfig } from '../types.js'

// This hook automatically re-saves a document after it is created
// so that we can build its breadcrumbs with the newly created document's ID.

export const resaveSelfAfterCreate =
  (pluginConfig: NestedDocsPluginConfig): CollectionAfterChangeHook =>
  async ({ collection, doc, operation, req }) => {
    if (operation !== 'create') {
      return undefined
    }

    const { locale, payload } = req
    const breadcrumbSlug = pluginConfig.breadcrumbsFieldSlug || 'breadcrumbs'
    const breadcrumbs = doc[breadcrumbSlug] as unknown as Breadcrumb[]

    try {
      await payload.update({
        id: doc.id,
        collection: collection.slug,
        data: {
          [breadcrumbSlug]:
            breadcrumbs?.map((crumb, i) => ({
              ...crumb,
              doc: breadcrumbs.length === i + 1 ? doc.id : crumb.doc,
            })) || [],
        },
        depth: 0,
        draft: collection?.versions?.drafts && doc._status !== 'published',
        locale,
        req,
      })
    } catch (err: unknown) {
      payload.logger.error(
        `Nested Docs plugin has had an error while adding breadcrumbs during document creation.`,
      )
      payload.logger.error(err)
    }
  }
```

--------------------------------------------------------------------------------

---[FILE: formatBreadcrumb.ts]---
Location: payload-main/packages/plugin-nested-docs/src/utilities/formatBreadcrumb.ts

```typescript
import type { SanitizedCollectionConfig } from 'payload'

import type { Breadcrumb, GenerateLabel, GenerateURL } from '../types.js'

type Args = {
  /**
   * Existing breadcrumb, if any, to base the new breadcrumb on.
   * This ensures that row IDs are maintained across updates, etc.
   */
  breadcrumb?: Breadcrumb
  collection: SanitizedCollectionConfig
  docs: Record<string, unknown>[]
  generateLabel?: GenerateLabel
  generateURL?: GenerateURL
}

export const formatBreadcrumb = ({
  breadcrumb,
  collection,
  docs,
  generateLabel,
  generateURL,
}: Args): Breadcrumb => {
  let url: string | undefined = undefined
  let label: string

  const lastDoc = docs[docs.length - 1]!

  if (typeof generateURL === 'function') {
    url = generateURL(docs, lastDoc, collection)
  }

  if (typeof generateLabel === 'function') {
    label = generateLabel(docs, lastDoc, collection)
  } else {
    const title = collection.admin?.useAsTitle ? lastDoc[collection.admin.useAsTitle] : ''

    label = typeof title === 'string' || typeof title === 'number' ? String(title) : ''
  }

  return {
    ...(breadcrumb || {}),
    doc: lastDoc.id as string,
    label,
    url,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: getParents.ts]---
Location: payload-main/packages/plugin-nested-docs/src/utilities/getParents.ts

```typescript
import type { CollectionConfig, Document, PayloadRequest } from 'payload'

import type { NestedDocsPluginConfig } from '../types.js'

export const getParents = async (
  req: PayloadRequest,
  pluginConfig: Pick<NestedDocsPluginConfig, 'generateLabel' | 'generateURL' | 'parentFieldSlug'>,
  collection: CollectionConfig,
  doc: Record<string, unknown>,
  docs: Array<Record<string, unknown>> = [],
): Promise<Document[]> => {
  const parentSlug = pluginConfig?.parentFieldSlug || 'parent'
  const parent = doc[parentSlug]
  let retrievedParent: null | Record<string, unknown> = null

  if (parent) {
    // If not auto-populated, and we have an ID
    if (typeof parent === 'string' || typeof parent === 'number') {
      retrievedParent = await req.payload.findByID({
        id: parent,
        collection: collection.slug,
        depth: 0,
        disableErrors: true,
        req,
      })
    }

    // If auto-populated
    if (typeof parent === 'object') {
      retrievedParent = parent as Record<string, unknown>
    }

    if (retrievedParent) {
      if (retrievedParent[parentSlug]) {
        return getParents(req, pluginConfig, collection, retrievedParent, [
          retrievedParent,
          ...docs,
        ])
      }

      return [retrievedParent, ...docs]
    }
  }

  return docs
}
```

--------------------------------------------------------------------------------

---[FILE: populateBreadcrumbs.ts]---
Location: payload-main/packages/plugin-nested-docs/src/utilities/populateBreadcrumbs.ts

```typescript
import type { Data, Document, PayloadRequest, SanitizedCollectionConfig } from 'payload'

import type { GenerateLabel, GenerateURL } from '../types.js'

import { formatBreadcrumb } from './formatBreadcrumb.js'
import { getParents as getAllParentDocuments } from './getParents.js'

type Args = {
  breadcrumbsFieldName?: string
  collection: SanitizedCollectionConfig
  data: Data
  generateLabel?: GenerateLabel
  generateURL?: GenerateURL
  originalDoc?: Document
  parentFieldName?: string
  req: PayloadRequest
}
export const populateBreadcrumbs = async ({
  breadcrumbsFieldName = 'breadcrumbs',
  collection,
  data,
  generateLabel,
  generateURL,
  originalDoc,
  parentFieldName,
  req,
}: Args): Promise<Data> => {
  const newData = data

  const currentDocument = {
    ...originalDoc,
    ...data,
    id: originalDoc?.id ?? data?.id,
  }

  const allParentDocuments: Document[] = await getAllParentDocuments(
    req,
    {
      generateLabel,
      generateURL,
      parentFieldSlug: parentFieldName,
    },
    collection,
    currentDocument,
  )

  allParentDocuments.push(currentDocument)

  const breadcrumbs = allParentDocuments.map((_, i) =>
    formatBreadcrumb({
      breadcrumb: currentDocument[breadcrumbsFieldName]?.[i],
      collection,
      docs: allParentDocuments.slice(0, i + 1),
      generateLabel,
      generateURL,
    }),
  )

  newData[breadcrumbsFieldName] = breadcrumbs

  return newData
}
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/packages/plugin-redirects/.gitignore

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
Location: payload-main/packages/plugin-redirects/.prettierignore

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
Location: payload-main/packages/plugin-redirects/.swcrc

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
Location: payload-main/packages/plugin-redirects/LICENSE.md

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
Location: payload-main/packages/plugin-redirects/package.json
Signals: React, Next.js

```json
{
  "name": "@payloadcms/plugin-redirects",
  "version": "3.68.5",
  "description": "Redirects plugin for Payload",
  "keywords": [
    "payload",
    "cms",
    "plugin",
    "typescript",
    "react",
    "redirects",
    "nextjs"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/payloadcms/payload.git",
    "directory": "packages/plugin-redirects"
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
      "import": "./src/exports/types.ts",
      "types": "./src/exports/types.ts",
      "default": "./src/exports/types.ts"
    }
  },
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "files": [
    "dist",
    "types.js",
    "types.d.ts"
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
    "payload": "workspace:*"
  },
  "devDependencies": {
    "@payloadcms/eslint-config": "workspace:*"
  },
  "peerDependencies": {
    "payload": "workspace:*"
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
      }
    },
    "main": "./dist/index.js",
    "types": "./dist/index.d.ts"
  },
  "homepage:": "https://payloadcms.com"
}
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: payload-main/packages/plugin-redirects/README.md

```text
# Payload Redirects Plugin

A plugin for [Payload](https://github.com/payloadcms/payload) to easily manage your redirects from within your admin panel.

## Features

- Manage redirects directly from your admin panel
- Support for internal (reference) and external (custom URL) redirects
- Built-in multi-language support
- Optional redirect types (301, 302, etc.)

## Installation

```bash
pnpm add @payloadcms/plugin-redirects
```

## Basic Usage

In your [Payload Config](https://payloadcms.com/docs/configuration/overview), add the plugin:

```ts
import { buildConfig } from 'payload'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'

export default buildConfig({
  plugins: [
    redirectsPlugin({
      collections: ['pages'], // Collections to use in the 'to' relationship field
    }),
  ],
})
```

## Configuration

### Options

| Option                      | Type       | Description                                                                                             |
| --------------------------- | ---------- | ------------------------------------------------------------------------------------------------------- |
| `collections`               | `string[]` | An array of collection slugs to populate in the `to` field of each redirect.                            |
| `overrides`                 | `object`   | A partial collection config that allows you to override anything on the `redirects` collection.         |
| `redirectTypes`             | `string[]` | Provide an array of redirects if you want to provide options for the type of redirects to be supported. |
| `redirectTypeFieldOverride` | `Field`    | A partial Field config that allows you to override the Redirect Type field if enabled above.            |

### Advanced Example

```ts
import { buildConfig } from 'payload'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'

export default buildConfig({
  plugins: [
    redirectsPlugin({
      collections: ['pages', 'posts'],

      // Add custom redirect types
      redirectTypes: ['301', '302'],

      // Override the redirects collection
      overrides: {
        slug: 'custom-redirects',

        // Add custom fields
        fields: ({ defaultFields }) => {
          return [
            ...defaultFields,
            {
              name: 'notes',
              type: 'textarea',
              admin: {
                description: 'Internal notes about this redirect',
              },
            },
          ]
        },
      },
    }),
  ],
})
```

## Custom Translations

The plugin automatically includes translations for English, French, and Spanish. If you want to customize existing translations or add new languages, you can override them in your config:

```ts
import { buildConfig } from 'payload'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'

export default buildConfig({
  i18n: {
    translations: {
      // Add your custom language
      de: {
        'plugin-redirects': {
          fromUrl: 'Von URL',
          toUrlType: 'Ziel-URL-Typ',
          internalLink: 'Interner Link',
          customUrl: 'Benutzerdefinierte URL',
          documentToRedirect: 'Dokument zum Weiterleiten',
          redirectType: 'Weiterleitungstyp',
        },
      },
      // Or override existing translations
      fr: {
        'plugin-redirects': {
          fromUrl: 'URL source', // Custom override
        },
      },
    },
  },

  plugins: [
    redirectsPlugin({
      collections: ['pages'],
    }),
  ],
})
```

## Using Redirects in Your Frontend

The plugin creates a `redirects` collection in your database. You can query this collection from your frontend and implement the redirects using your framework's routing system.

### Example: Next.js Middleware

```ts
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Fetch redirects from Payload API
  const redirects = await fetch('http://localhost:3000/api/redirects', {
    next: { revalidate: 60 }, // Cache for 60 seconds
  }).then((res) => res.json())

  // Find matching redirect
  const redirect = redirects.docs?.find((r: any) => r.from === pathname)

  if (redirect) {
    const destination =
      redirect.to.type === 'reference'
        ? redirect.to.reference.slug // Adjust based on your collection structure
        : redirect.to.url

    return NextResponse.redirect(
      new URL(destination, request.url),
      redirect.type === '301' ? 301 : 302,
    )
  }

  return NextResponse.next()
}
```

## Links

- [Source code](https://github.com/payloadcms/payload/tree/main/packages/plugin-redirects)
- [Documentation](https://payloadcms.com/docs/plugins/redirects)
- [Issue tracker](https://github.com/payloadcms/payload/issues)
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/packages/plugin-redirects/tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "references": [{ "path": "../payload" }],
  "compilerOptions": {
    // Do not include DOM and DOM.Iterable as this is a server-only package.
    "lib": ["ES2022"],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.d.ts]---
Location: payload-main/packages/plugin-redirects/types.d.ts

```typescript
export * from './dist/types'
```

--------------------------------------------------------------------------------

---[FILE: types.js]---
Location: payload-main/packages/plugin-redirects/types.js

```javascript
module.exports = require('./dist/types')
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/plugin-redirects/src/index.ts

```typescript
import type { CollectionConfig, Config, Field, SelectField } from 'payload'

import { deepMergeSimple } from 'payload/shared'

import type { RedirectsPluginConfig } from './types.js'

import { redirectOptions } from './redirectTypes.js'
import { translations } from './translations/index.js'

export { redirectOptions, redirectTypes } from './redirectTypes.js'
export { translations as redirectsTranslations } from './translations/index.js'
export const redirectsPlugin =
  (pluginConfig: RedirectsPluginConfig) =>
  (incomingConfig: Config): Config => {
    // Merge translations FIRST (before building fields)
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

    const redirectSelectField: SelectField = {
      name: 'type',
      type: 'select',
      // @ts-expect-error - translations are not typed in plugins yet
      label: ({ t }) => t('plugin-redirects:redirectType'),
      options: redirectOptions.filter((option) =>
        pluginConfig?.redirectTypes?.includes(option.value),
      ),
      required: true,
      ...((pluginConfig?.redirectTypeFieldOverride || {}) as {
        hasMany: boolean
      } & Partial<SelectField>),
    }

    const defaultFields: Field[] = [
      {
        name: 'from',
        type: 'text',
        index: true,
        // @ts-expect-error - translations are not typed in plugins yet
        label: ({ t }) => t('plugin-redirects:fromUrl'),
        required: true,
        unique: true,
      },
      {
        name: 'to',
        type: 'group',
        fields: [
          {
            name: 'type',
            type: 'radio',
            admin: {
              layout: 'horizontal',
            },
            defaultValue: 'reference',
            // @ts-expect-error - translations are not typed in plugins yet
            label: ({ t }) => t('plugin-redirects:toUrlType'),
            options: [
              {
                // @ts-expect-error - translations are not typed in plugins yet
                label: ({ t }) => t('plugin-redirects:internalLink'),
                value: 'reference',
              },
              {
                // @ts-expect-error - translations are not typed in plugins yet
                label: ({ t }) => t('plugin-redirects:customUrl'),
                value: 'custom',
              },
            ],
          },
          {
            name: 'reference',
            type: 'relationship',
            admin: {
              condition: (_, siblingData) => siblingData?.type === 'reference',
            },
            // @ts-expect-error - translations are not typed in plugins yet
            label: ({ t }) => t('plugin-redirects:documentToRedirect'),
            relationTo: pluginConfig?.collections || [],
            required: true,
          },
          {
            name: 'url',
            type: 'text',
            admin: {
              condition: (_, siblingData) => siblingData?.type === 'custom',
            },
            // @ts-expect-error - translations are not typed in plugins yet
            label: ({ t }) => t('plugin-redirects:customUrl'),
            required: true,
          },
        ],
        label: false,
      },
      ...(pluginConfig?.redirectTypes ? [redirectSelectField] : []),
    ]

    const redirectsCollection: CollectionConfig = {
      ...(pluginConfig?.overrides || {}),
      slug: pluginConfig?.overrides?.slug || 'redirects',
      access: {
        read: () => true,
        ...(pluginConfig?.overrides?.access || {}),
      },
      admin: {
        defaultColumns: ['from', 'to.type', 'createdAt'],
        ...(pluginConfig?.overrides?.admin || {}),
      },
      fields:
        pluginConfig?.overrides?.fields && typeof pluginConfig?.overrides?.fields === 'function'
          ? pluginConfig?.overrides.fields({ defaultFields })
          : defaultFields,
    }

    return {
      ...incomingConfig,
      collections: [...(incomingConfig?.collections || []), redirectsCollection],
    }
  }
```

--------------------------------------------------------------------------------

---[FILE: redirectTypes.ts]---
Location: payload-main/packages/plugin-redirects/src/redirectTypes.ts

```typescript
export const redirectTypes = ['301', '302', '303', '307', '308'] as const

export const redirectOptions: { label: string; value: (typeof redirectTypes)[number] }[] = [
  {
    label: '301 - Permanent',
    value: '301',
  },
  {
    label: '302 - Temporary',
    value: '302',
  },
  {
    label: '303 - See Other',
    value: '303',
  },
  {
    label: '307 - Temporary Redirect',
    value: '307',
  },
  {
    label: '308 - Permanent Redirect',
    value: '308',
  },
]
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/plugin-redirects/src/types.ts

```typescript
import type { CollectionConfig, Field, SelectField } from 'payload'

import type { redirectTypes } from './redirectTypes.js'
export type FieldsOverride = (args: { defaultFields: Field[] }) => Field[]

export type RedirectsPluginConfig = {
  collections?: string[]
  overrides?: { fields?: FieldsOverride } & Partial<Omit<CollectionConfig, 'fields'>>
  redirectTypeFieldOverride?: Partial<SelectField>
  redirectTypes?: (typeof redirectTypes)[number][]
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/plugin-redirects/src/exports/types.ts

```typescript
export type { RedirectsTranslationKeys, RedirectsTranslations } from '../translations/index.js'
export type { RedirectsPluginConfig } from '../types.js'
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/plugin-redirects/src/translations/index.ts

```typescript
import type { GenericTranslationsObject, NestedKeysStripped } from '@payloadcms/translations'

import { en } from './languages/en.js'
import { es } from './languages/es.js'
import { fr } from './languages/fr.js'

export const translations = {
  en,
  es,
  fr,
}

export type RedirectsTranslations = GenericTranslationsObject

export type RedirectsTranslationKeys = NestedKeysStripped<RedirectsTranslations>
```

--------------------------------------------------------------------------------

---[FILE: translation-schema.json]---
Location: payload-main/packages/plugin-redirects/src/translations/translation-schema.json

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-04/schema#",
  "additionalProperties": false,
  "properties": {
    "$schema": {
      "type": "string"
    },
    "plugin-redirects": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "fromUrl": {
          "type": "string"
        },
        "toUrlType": {
          "type": "string"
        },
        "internalLink": {
          "type": "string"
        },
        "customUrl": {
          "type": "string"
        },
        "documentToRedirect": {
          "type": "string"
        },
        "redirectType": {
          "type": "string"
        }
      },
      "required": [
        "fromUrl",
        "toUrlType",
        "internalLink",
        "customUrl",
        "documentToRedirect",
        "redirectType"
      ]
    }
  },
  "required": ["plugin-redirects"]
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/plugin-redirects/src/translations/types.ts

```typescript
import type { en } from './languages/en.js'

export type PluginDefaultTranslationsObject = typeof en
```

--------------------------------------------------------------------------------

---[FILE: en.ts]---
Location: payload-main/packages/plugin-redirects/src/translations/languages/en.ts

```typescript
import type { GenericTranslationsObject } from '@payloadcms/translations'

export const en: GenericTranslationsObject = {
  $schema: '../translation-schema.json',
  'plugin-redirects': {
    customUrl: 'Custom URL',
    documentToRedirect: 'Document to redirect to',
    fromUrl: 'From URL',
    internalLink: 'Internal link',
    redirectType: 'Redirect Type',
    toUrlType: 'To URL Type',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: es.ts]---
Location: payload-main/packages/plugin-redirects/src/translations/languages/es.ts

```typescript
import type { GenericTranslationsObject } from '@payloadcms/translations'

export const es: GenericTranslationsObject = {
  $schema: '../translation-schema.json',
  'plugin-redirects': {
    customUrl: 'URL personalizada',
    documentToRedirect: 'Documento al que redirigir',
    fromUrl: 'URL de origen',
    internalLink: 'Enlace interno',
    redirectType: 'Tipo de redirección',
    toUrlType: 'Tipo de URL de destino',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: fr.ts]---
Location: payload-main/packages/plugin-redirects/src/translations/languages/fr.ts

```typescript
import type { GenericTranslationsObject } from '@payloadcms/translations'

export const fr: GenericTranslationsObject = {
  $schema: '../translation-schema.json',
  'plugin-redirects': {
    customUrl: 'URL personnalisée',
    documentToRedirect: 'Page de redirection',
    fromUrl: "URL d'origine",
    internalLink: 'Référence vers une page',
    redirectType: 'Type de redirection',
    toUrlType: "Type d'URL de destination",
  },
}
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/packages/plugin-search/.gitignore

```text
node_modules
.env
dist
build
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: payload-main/packages/plugin-search/.prettierignore

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
Location: payload-main/packages/plugin-search/.swcrc

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
Location: payload-main/packages/plugin-search/LICENSE.md

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
Location: payload-main/packages/plugin-search/package.json
Signals: React, Next.js

```json
{
  "name": "@payloadcms/plugin-search",
  "version": "3.68.5",
  "description": "Search plugin for Payload",
  "keywords": [
    "payload",
    "cms",
    "plugin",
    "typescript",
    "react",
    "search",
    "algolia"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/payloadcms/payload.git",
    "directory": "packages/plugin-search"
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
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    },
    "./types": {
      "import": "./src/exports/types.ts",
      "types": "./src/exports/types.ts",
      "default": "./src/exports/types.ts"
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
    "build": "pnpm copyfiles && pnpm build:types && pnpm build:swc",
    "build:debug": "pnpm build",
    "build:swc": "swc ./src -d ./dist --config-file .swcrc --strip-leading-paths",
    "build:types": "tsc --emitDeclarationOnly --outDir dist",
    "clean": "rimraf -g {dist,*.tsbuildinfo}",
    "copyfiles": "copyfiles -u 1 \"src/**/*.{html,css,scss,ttf,woff,woff2,eot,svg,jpg,png,json}\" dist/",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "test": "echo \"Error: no tests specified\""
  },
  "dependencies": {
    "@payloadcms/next": "workspace:*",
    "@payloadcms/ui": "workspace:*"
  },
  "devDependencies": {
    "@payloadcms/eslint-config": "workspace:*",
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
        "import": "./dist/exports/types.js",
        "types": "./dist/exports/types.d.ts",
        "default": "./dist/exports/types.js"
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
  },
  "homepage:": "https://payloadcms.com"
}
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: payload-main/packages/plugin-search/README.md

```text
# Payload Search Plugin

A plugin for [Payload](https://github.com/payloadcms/payload) to generate records of your documents that are extremely fast to search on.

- [Source code](https://github.com/payloadcms/payload/tree/main/packages/plugin-search)
- [Documentation](https://payloadcms.com/docs/plugins/search)
- [Documentation source](https://github.com/payloadcms/payload/tree/main/docs/plugins/search.mdx)
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/packages/plugin-search/tsconfig.json
Signals: Next.js

```json
{
  "extends": "../../tsconfig.base.json",
  "references": [{ "path": "../payload" }, { "path": "../ui" }, { "path": "../next" }]
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/plugin-search/src/index.ts

```typescript
import type { CollectionAfterChangeHook, Config } from 'payload'

import type { SanitizedSearchPluginConfig, SearchPluginConfig } from './types.js'

import { deleteFromSearch } from './Search/hooks/deleteFromSearch.js'
import { syncWithSearch } from './Search/hooks/syncWithSearch.js'
import { generateSearchCollection } from './Search/index.js'

type CollectionAfterChangeHookArgs = Parameters<CollectionAfterChangeHook>[0]

export const searchPlugin =
  (incomingPluginConfig: SearchPluginConfig) =>
  (config: Config): Config => {
    const { collections } = config

    // If the user defines `localize` to either true or false, use that
    // Otherwise, set it based on if their config has localization enabled or disabled
    const shouldLocalize =
      typeof incomingPluginConfig.localize === 'boolean'
        ? incomingPluginConfig.localize
        : Boolean(config.localization)
    incomingPluginConfig.localize = shouldLocalize

    if (collections) {
      const locales = config.localization
        ? config.localization.locales.map((localeConfig) =>
            typeof localeConfig === 'string' ? localeConfig : localeConfig.code,
          )
        : []

      const labels = Object.fromEntries(
        collections
          .filter(({ slug }) => incomingPluginConfig.collections?.includes(slug))
          .map((collection) => [collection.slug, collection.labels]),
      )

      const pluginConfig: SanitizedSearchPluginConfig = {
        // write any config defaults here
        deleteDrafts: true,
        labels,
        locales,
        reindexBatchSize: incomingPluginConfig?.reindexBatchSize || 50,
        syncDrafts: false,
        ...incomingPluginConfig,
      }

      // add afterChange and afterDelete hooks to every search-enabled collection
      const collectionsWithSearchHooks = config?.collections
        ?.map((collection) => {
          const { hooks: existingHooks } = collection

          const enabledCollections = pluginConfig.collections || []
          const isEnabled = enabledCollections.indexOf(collection.slug) > -1
          if (isEnabled) {
            return {
              ...collection,
              hooks: {
                ...collection.hooks,
                afterChange: [
                  ...(existingHooks?.afterChange || []),
                  async (args: CollectionAfterChangeHookArgs) => {
                    await syncWithSearch({
                      ...args,
                      collection: collection.slug,
                      pluginConfig,
                    })
                  },
                ],
                beforeDelete: [
                  ...(existingHooks?.beforeDelete || []),
                  deleteFromSearch(pluginConfig),
                ],
              },
            }
          }

          return collection
        })
        .filter(Boolean)

      return {
        ...config,
        collections: [
          ...(collectionsWithSearchHooks || []),
          generateSearchCollection(pluginConfig),
        ],
      }
    }

    return config
  }
```

--------------------------------------------------------------------------------

````
