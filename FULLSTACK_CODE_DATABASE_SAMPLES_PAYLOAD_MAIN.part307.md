---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 307
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 307 of 695)

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

---[FILE: withHTML.tsx]---
Location: payload-main/packages/richtext-slate/src/field/plugins/withHTML.tsx

```typescript
import { Transforms } from 'slate'
import { jsx } from 'slate-hyperscript'

const ELEMENT_TAGS = {
  A: (el) => ({
    type: 'link',
    newTab: el.getAttribute('target') === '_blank',
    url: el.getAttribute('href'),
  }),
  BLOCKQUOTE: () => ({ type: 'blockquote' }),
  H1: () => ({ type: 'h1' }),
  H2: () => ({ type: 'h2' }),
  H3: () => ({ type: 'h3' }),
  H4: () => ({ type: 'h4' }),
  H5: () => ({ type: 'h5' }),
  H6: () => ({ type: 'h6' }),
  LI: () => ({ type: 'li' }),
  OL: () => ({ type: 'ol' }),
  P: () => ({}),
  PRE: () => ({ type: 'code' }),
  UL: () => ({ type: 'ul' }),
}

const TEXT_TAGS = {
  CODE: () => ({ code: true }),
  DEL: () => ({ strikethrough: true }),
  EM: () => ({ italic: true }),
  I: () => ({ italic: true }),
  S: () => ({ strikethrough: true }),
  STRONG: () => ({ bold: true }),
  U: () => ({ underline: true }),
}

const deserialize = (el) => {
  if (el.nodeType === 3) {
    return el.textContent
  }
  if (el.nodeType !== 1) {
    return null
  }
  if (el.nodeName === 'BR') {
    return '\n'
  }

  const { nodeName } = el
  let parent = el

  if (nodeName === 'PRE' && el.childNodes[0] && el.childNodes[0].nodeName === 'CODE') {
    ;[parent] = el.childNodes
  }

  let children = Array.from(parent.childNodes).map(deserialize).flat()

  if (children.length === 0) {
    children = [{ text: '' }]
  }

  if (el.nodeName === 'BODY') {
    return jsx('fragment', {}, children)
  }

  if (ELEMENT_TAGS[nodeName]) {
    const attrs = ELEMENT_TAGS[nodeName](el)
    return jsx('element', attrs, children)
  }

  if (TEXT_TAGS[nodeName]) {
    const attrs = TEXT_TAGS[nodeName](el)
    return children.map((child) => jsx('text', attrs, child))
  }

  return children
}

export const withHTML = (incomingEditor) => {
  const { insertData } = incomingEditor

  const editor = incomingEditor

  editor.insertData = (data) => {
    if (!data.types.includes('application/x-slate-fragment')) {
      const html = data.getData('text/html')

      if (html) {
        const parsed = new DOMParser().parseFromString(html, 'text/html')
        const fragment = deserialize(parsed.body)
        Transforms.insertFragment(editor, fragment)
        return
      }
    }

    insertData(data)
  }

  return editor
}
```

--------------------------------------------------------------------------------

---[FILE: ElementButtonProvider.tsx]---
Location: payload-main/packages/richtext-slate/src/field/providers/ElementButtonProvider.tsx
Signals: React

```typescript
'use client'

import React from 'react'

import type { LoadedSlateFieldProps } from '../types.js'

type ElementButtonContextType = {
  disabled?: boolean
  fieldProps: LoadedSlateFieldProps
  path: string
  schemaPath: string
}

const ElementButtonContext = React.createContext<ElementButtonContextType>({
  fieldProps: {} as any,
  path: '',
  schemaPath: '',
})

export const ElementButtonProvider: React.FC<
  {
    children: React.ReactNode
  } & ElementButtonContextType
> = (props) => {
  const { children, ...rest } = props

  return (
    <ElementButtonContext
      value={{
        ...rest,
      }}
    >
      {children}
    </ElementButtonContext>
  )
}

export const useElementButton = () => {
  const path = React.use(ElementButtonContext)
  return path
}
```

--------------------------------------------------------------------------------

---[FILE: ElementProvider.tsx]---
Location: payload-main/packages/richtext-slate/src/field/providers/ElementProvider.tsx
Signals: React

```typescript
'use client'
import type { Element } from 'slate'

import React from 'react'

import type { LoadedSlateFieldProps } from '../types.js'

type ElementContextType<T> = {
  attributes: Record<string, unknown>
  children: React.ReactNode
  editorRef: React.RefObject<HTMLDivElement>
  element: T
  fieldProps: LoadedSlateFieldProps
  path: string
  schemaPath: string
}

const ElementContext = React.createContext<ElementContextType<Element>>({
  attributes: {},
  children: null,
  editorRef: null,
  element: {} as Element,
  fieldProps: {} as any,
  path: '',
  schemaPath: '',
})

export const ElementProvider: React.FC<
  {
    childNodes: React.ReactNode
  } & ElementContextType<Element>
> = (props) => {
  const { childNodes, children, ...rest } = props

  return (
    <ElementContext
      value={{
        ...rest,
        children: childNodes,
      }}
    >
      {children}
    </ElementContext>
  )
}

export const useElement = <T,>(): ElementContextType<T> => {
  return React.use(ElementContext) as ElementContextType<T>
}
```

--------------------------------------------------------------------------------

---[FILE: LeafButtonProvider.tsx]---
Location: payload-main/packages/richtext-slate/src/field/providers/LeafButtonProvider.tsx
Signals: React

```typescript
'use client'

import React from 'react'

import type { LoadedSlateFieldProps } from '../types.js'

type LeafButtonContextType = {
  fieldProps: LoadedSlateFieldProps
  path: string
  schemaPath: string
}

const LeafButtonContext = React.createContext<LeafButtonContextType>({
  fieldProps: {} as any,
  path: '',
  schemaPath: '',
})

export const LeafButtonProvider: React.FC<
  {
    children: React.ReactNode
  } & LeafButtonContextType
> = (props) => {
  const { children, ...rest } = props

  return (
    <LeafButtonContext
      value={{
        ...rest,
      }}
    >
      {children}
    </LeafButtonContext>
  )
}

export const useLeafButton = () => {
  const path = React.use(LeafButtonContext)
  return path
}
```

--------------------------------------------------------------------------------

---[FILE: LeafProvider.tsx]---
Location: payload-main/packages/richtext-slate/src/field/providers/LeafProvider.tsx
Signals: React

```typescript
'use client'

import React from 'react'

import type { LoadedSlateFieldProps } from '../types.js'

type LeafContextType = {
  attributes: Record<string, unknown>
  children: React.ReactNode
  editorRef: React.RefObject<HTMLDivElement>
  fieldProps: LoadedSlateFieldProps
  leaf: string
  path: string
  schemaPath: string
}

const LeafContext = React.createContext<LeafContextType>({
  attributes: {},
  children: null,
  editorRef: null,
  fieldProps: {} as any,
  leaf: '',
  path: '',
  schemaPath: '',
})

export const LeafProvider: React.FC<
  {
    result: React.ReactNode
  } & LeafContextType
> = (props) => {
  const { children, result, ...rest } = props

  return (
    <LeafContext
      value={{
        ...rest,
        children: result,
      }}
    >
      {children}
    </LeafContext>
  )
}

export const useLeaf = () => {
  const path = React.use(LeafContext)
  return path
}
```

--------------------------------------------------------------------------------

---[FILE: SlatePropsProvider.tsx]---
Location: payload-main/packages/richtext-slate/src/utilities/SlatePropsProvider.tsx
Signals: React

```typescript
'use client'

import React, { createContext, type ReactNode, use } from 'react'

interface SlateProps {
  schemaPath: string
}

const SlatePropsContext = createContext<SlateProps | undefined>(undefined)

export function SlatePropsProvider({
  children,
  schemaPath,
}: {
  children: ReactNode
  schemaPath: string
}) {
  return <SlatePropsContext value={{ schemaPath }}>{children}</SlatePropsContext>
}

export function useSlateProps() {
  const context = use(SlatePropsContext)
  if (!context) {
    throw new Error('useSlateProps must be used within SlatePropsProvider')
  }
  return context
}
```

--------------------------------------------------------------------------------

---[FILE: useSlatePlugin.tsx]---
Location: payload-main/packages/richtext-slate/src/utilities/useSlatePlugin.tsx

```typescript
import type { Editor } from 'slate'

import { useAddClientFunction } from '@payloadcms/ui'

import { useSlateProps } from './SlatePropsProvider.js'

type Plugin = (editor: Editor) => Editor

export const useSlatePlugin = (key: string, plugin: Plugin) => {
  const { schemaPath } = useSlateProps()

  useAddClientFunction(`slatePlugin.${schemaPath}.${key}`, plugin)
}
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: payload-main/packages/sdk/.prettierignore

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
Location: payload-main/packages/sdk/.swcrc

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
Location: payload-main/packages/sdk/eslint.config.js

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

---[FILE: license.md]---
Location: payload-main/packages/sdk/license.md

```text
MIT License

Copyright (c) 2018-2024 Payload CMS, Inc. <info@payloadcms.com>

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
Location: payload-main/packages/sdk/package.json

```json
{
  "name": "@payloadcms/sdk",
  "version": "3.68.5",
  "description": "The official Payload REST API SDK",
  "homepage": "https://payloadcms.com",
  "repository": {
    "type": "git",
    "url": "https://github.com/payloadcms/payload.git",
    "directory": "packages/sdk"
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
    "clean": "rimraf {dist,*.tsbuildinfo}",
    "copyfiles": "copyfiles -u 1 \"src/**/*.{html,css,scss,ttf,woff,woff2,eot,svg,jpg,png,json}\" dist/",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  },
  "dependencies": {
    "payload": "workspace:*",
    "qs-esm": "7.0.2",
    "ts-essentials": "10.0.3"
  },
  "devDependencies": {
    "@payloadcms/eslint-config": "workspace:*"
  },
  "publishConfig": {
    "exports": {
      ".": {
        "import": "./dist/index.js",
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
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
Location: payload-main/packages/sdk/README.md

```text
# Payload SDK

Package to allow querying Payload REST API in a fully type safe way. Has support for all necessary operations, including auth, type safe `select`, `populate`, `joins` properties and simplified file uploading. Its interface is _very_ similar to the Local API.

```ts
import { PayloadSDK } from '@payloadcms/sdk'
import type { Config } from './payload-types'

// Pass your config from generated types as generic
const sdk = new PayloadSDK<Config>({
  baseURL: 'https://example.com/api',
})

// Find operation
const posts = await sdk.find({
  collection: 'posts',
  draft: true,
  limit: 10,
  locale: 'en',
  page: 1,
  where: { _status: { equals: 'published' } },
})

// Find by ID operation
const posts = await sdk.findByID({
  id,
  collection: 'posts',
  draft: true,
  locale: 'en',
})

// Auth login operation
const result = await sdk.login({
  collection: 'users',
  data: {
    email: 'dev@payloadcms.com',
    password: '12345',
  },
})

// Create operation
const result = await sdk.create({
  collection: 'posts',
  data: { text: 'text' },
})

// Create operation with a file
// `file` can be either a Blob | File object or a string URL
const result = await sdk.create({ collection: 'media', file, data: {} })

// Count operation
const result = await sdk.count({ collection: 'posts', where: { id: { equals: post.id } } })

// Update (by ID) operation
const result = await sdk.update({
  collection: 'posts',
  id: post.id,
  data: {
    text: 'updated-text',
  },
})

// Update (bulk) operation
const result = await sdk.update({
  collection: 'posts',
  where: {
    id: {
      equals: post.id,
    },
  },
  data: { text: 'updated-text-bulk' },
})

// Delete (by ID) operation
const result = await sdk.delete({ id: post.id, collection: 'posts' })

// Delete (bulk) operation
const result = await sdk.delete({ where: { id: { equals: post.id } }, collection: 'posts' })

// Find Global operation
const result = await sdk.findGlobal({ slug: 'global' })

// Update Global operation
const result = await sdk.updateGlobal({ slug: 'global', data: { text: 'some-updated-global' } })

// Auth Login operation
const result = await sdk.login({
  collection: 'users',
  data: { email: 'dev@payloadcms.com', password: '123456' },
})

// Auth Me operation
const result = await sdk.me(
  { collection: 'users' },
  {
    headers: {
      Authorization: `JWT  ${user.token}`,
    },
  },
)

// Auth Refresh Token operation
const result = await sdk.refreshToken(
  { collection: 'users' },
  { headers: { Authorization: `JWT ${user.token}` } },
)

// Auth Forgot Password operation
const result = await sdk.forgotPassword({
  collection: 'users',
  data: { email: user.email },
})

// Auth Reset Password operation
const result = await sdk.resetPassword({
  collection: 'users',
  data: { password: '1234567', token: resetPasswordToken },
})

// Find Versions operation
const result = await sdk.findVersions({
  collection: 'posts',
  where: { parent: { equals: post.id } },
})

// Find Version by ID operation
const result = await sdk.findVersionByID({ collection: 'posts', id: version.id })

// Restore Version operation
const result = await sdk.restoreVersion({
  collection: 'posts',
  id,
})

// Find Global Versions operation
const result = await sdk.findGlobalVersions({
  slug: 'global',
})

// Find Global Version by ID operation
const result = await sdk.findGlobalVersionByID({ id: version.id, slug: 'global' })

// Restore Global Version operation
const result = await sdk.restoreGlobalVersion({
  slug: 'global',
  id,
})
```

Every operation has optional 3rd parameter which is used to add additional data to the RequestInit object (like headers):

```ts
await sdk.me(
  {
    collection: 'users',
  },
  {
    // RequestInit object
    headers: {
      Authorization: `JWT ${token}`,
    },
  },
)
```

To query custom endpoints, you can use the `request` method, which is used internally for all other methods:

```ts
await sdk.request({
  method: 'POST',
  path: '/send-data',
  json: {
    id: 1,
  },
})
```

Custom `fetch` implementation and `baseInit` for shared `RequestInit` properties:

```ts
const sdk = new PayloadSDK<Config>({
  baseInit: { credentials: 'include' },
  baseURL: 'https://example.com/api',
  fetch: async (url, init) => {
    console.log('before req')
    const response = await fetch(url, init)
    console.log('after req')
    return response
  },
})
```
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/packages/sdk/tsconfig.json

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "composite": true, // Make sure typescript knows that this module depends on their references
    "noEmit": false /* Do not emit outputs. */,
    "emitDeclarationOnly": true,
    "strict": true,
    "outDir": "./dist" /* Specify an output folder for all emitted files. */,
    "rootDir": "./src" /* Specify the root folder within your source files. */
  },
  "exclude": [
    "dist",
    "build",
    "tests",
    "test",
    "node_modules",
    "eslint.config.js",
    "src/**/*.spec.js",
    "src/**/*.spec.jsx",
    "src/**/*.spec.ts",
    "src/**/*.spec.tsx"
  ],
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.d.ts", "src/**/*.json"],
  "references": [{ "path": "../payload" }]
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/sdk/src/index.ts

```typescript
import type { ApplyDisableErrors, PaginatedDocs, SelectType, TypeWithVersion } from 'payload'

import type { ForgotPasswordOptions } from './auth/forgotPassword.js'
import type { LoginOptions, LoginResult } from './auth/login.js'
import type { MeOptions, MeResult } from './auth/me.js'
import type { ResetPasswordOptions, ResetPasswordResult } from './auth/resetPassword.js'
import type { CountOptions } from './collections/count.js'
import type { CreateOptions } from './collections/create.js'
import type { DeleteByIDOptions, DeleteManyOptions, DeleteOptions } from './collections/delete.js'
import type { FindOptions } from './collections/find.js'
import type { FindByIDOptions } from './collections/findByID.js'
import type { FindVersionByIDOptions } from './collections/findVersionByID.js'
import type { FindVersionsOptions } from './collections/findVersions.js'
import type { RestoreVersionByIDOptions } from './collections/restoreVersion.js'
import type { FindGlobalVersionByIDOptions } from './globals/findVersionByID.js'
import type { FindGlobalVersionsOptions } from './globals/findVersions.js'
import type { RestoreGlobalVersionByIDOptions } from './globals/restoreVersion.js'
import type { UpdateGlobalOptions } from './globals/update.js'
import type {
  AuthCollectionSlug,
  BulkOperationResult,
  CollectionSlug,
  DataFromCollectionSlug,
  DataFromGlobalSlug,
  GlobalSlug,
  PayloadGeneratedTypes,
  SelectFromCollectionSlug,
  SelectFromGlobalSlug,
  TransformCollectionWithSelect,
  TransformGlobalWithSelect,
} from './types.js'
import type { OperationArgs } from './utilities/buildSearchParams.js'

import { forgotPassword } from './auth/forgotPassword.js'
import { login } from './auth/login.js'
import { me } from './auth/me.js'
import { type RefreshOptions, type RefreshResult, refreshToken } from './auth/refreshToken.js'
import { resetPassword } from './auth/resetPassword.js'
import { verifyEmail, type VerifyEmailOptions } from './auth/verifyEmail.js'
import { count } from './collections/count.js'
import { create } from './collections/create.js'
import { deleteOperation } from './collections/delete.js'
import { find } from './collections/find.js'
import { findByID } from './collections/findByID.js'
import { findVersionByID } from './collections/findVersionByID.js'
import { findVersions } from './collections/findVersions.js'
import { restoreVersion } from './collections/restoreVersion.js'
import {
  update,
  type UpdateByIDOptions,
  type UpdateManyOptions,
  type UpdateOptions,
} from './collections/update.js'
import { findGlobal, type FindGlobalOptions } from './globals/findOne.js'
import { findGlobalVersionByID } from './globals/findVersionByID.js'
import { findGlobalVersions } from './globals/findVersions.js'
import { restoreGlobalVersion } from './globals/restoreVersion.js'
import { updateGlobal } from './globals/update.js'
import { buildSearchParams } from './utilities/buildSearchParams.js'

type Args = {
  /** Base passed `RequestInit` to `fetch`. For base headers / credentials include etc. */
  baseInit?: RequestInit

  /**
   * Base API URL for requests.
   * @example 'https://example.com/api'
   */
  baseURL: string

  /**
   * This option allows you to pass a custom `fetch` implementation.
   * The function always receives `path` as the first parameter and `RequestInit` as the second.
   * @example For testing without needing an HTTP server:
   * ```typescript
   * import type { GeneratedTypes, SanitizedConfig } from 'payload';
   * import config from '@payload-config';
   * import { REST_DELETE, REST_GET, REST_PATCH, REST_POST, REST_PUT } from '@payloadcms/next/routes';
   * import { PayloadSDK } from '@payloadcms/sdk';
   *
   * export type TypedPayloadSDK = PayloadSDK<GeneratedTypes>;
   *
   * const api = {
   *   GET: REST_GET(config),
   *   POST: REST_POST(config),
   *   PATCH: REST_PATCH(config),
   *   DELETE: REST_DELETE(config),
   *   PUT: REST_PUT(config),
   * };
   *
   * const awaitedConfig = await config;
   *
   * export const sdk = new PayloadSDK<GeneratedTypes>({
   *   baseURL: '',
   *   fetch: (path: string, init: RequestInit) => {
   *     const [slugs, search] = path.slice(1).split('?');
   *     const url = `${awaitedConfig.serverURL || 'http://localhost:3000'}${awaitedConfig.routes.api}/${slugs}${search ? `?${search}` : ''}`;
   *
   *     if (init.body instanceof FormData) {
   *       const file = init.body.get('file') as Blob;
   *       if (file && init.headers instanceof Headers) {
   *         init.headers.set('Content-Length', file.size.toString());
   *       }
   *     }
   *
   *     const request = new Request(url, init);
   *
   *     const params = {
   *       params: Promise.resolve({
   *         slug: slugs.split('/'),
   *       }),
   *     };
   *
   *     return api[init.method.toUpperCase()](request, params);
   *   },
   * });
   * ```
   */
  fetch?: typeof fetch
}

/**
 * @experimental
 */
export class PayloadSDK<T extends PayloadGeneratedTypes = PayloadGeneratedTypes> {
  baseInit: RequestInit

  baseURL: string

  fetch: typeof fetch
  constructor(args: Args) {
    this.baseURL = args.baseURL
    this.fetch = args.fetch ?? globalThis.fetch.bind(globalThis)
    this.baseInit = args.baseInit ?? {}
  }

  /**
   * @description Performs count operation
   * @param options
   * @returns count of documents satisfying query
   */
  count<TSlug extends CollectionSlug<T>>(
    options: CountOptions<T, TSlug>,
    init?: RequestInit,
  ): Promise<{ totalDocs: number }> {
    return count(this, options, init)
  }

  /**
   * @description Performs create operation
   * @param options
   * @returns created document
   */
  create<TSlug extends CollectionSlug<T>, TSelect extends SelectType>(
    options: CreateOptions<T, TSlug, TSelect>,
    init?: RequestInit,
  ): Promise<TransformCollectionWithSelect<T, TSlug, TSelect>> {
    return create(this, options, init)
  }

  delete<TSlug extends CollectionSlug<T>, TSelect extends SelectFromCollectionSlug<T, TSlug>>(
    options: DeleteManyOptions<T, TSlug, TSelect>,
    init?: RequestInit,
  ): Promise<BulkOperationResult<T, TSlug, TSelect>>
  delete<TSlug extends CollectionSlug<T>, TSelect extends SelectFromCollectionSlug<T, TSlug>>(
    options: DeleteByIDOptions<T, TSlug, TSelect>,
    init?: RequestInit,
  ): Promise<TransformCollectionWithSelect<T, TSlug, TSelect>>

  /**
   * @description Update one or more documents
   * @param options
   * @returns Updated document(s)
   */
  delete<TSlug extends CollectionSlug<T>, TSelect extends SelectFromCollectionSlug<T, TSlug>>(
    options: DeleteOptions<T, TSlug, TSelect>,
    init?: RequestInit,
  ): Promise<
    BulkOperationResult<T, TSlug, TSelect> | TransformCollectionWithSelect<T, TSlug, TSelect>
  > {
    return deleteOperation(this, options, init)
  }

  /**
   * @description Find documents with criteria
   * @param options
   * @returns documents satisfying query
   */
  find<TSlug extends CollectionSlug<T>, TSelect extends SelectType>(
    options: FindOptions<T, TSlug, TSelect>,
    init?: RequestInit,
  ): Promise<PaginatedDocs<TransformCollectionWithSelect<T, TSlug, TSelect>>> {
    return find(this, options, init)
  }

  /**
   * @description Find document by ID
   * @param options
   * @returns document with specified ID
   */
  findByID<
    TSlug extends CollectionSlug<T>,
    TDisableErrors extends boolean,
    TSelect extends SelectType,
  >(
    options: FindByIDOptions<T, TSlug, TDisableErrors, TSelect>,
    init?: RequestInit,
  ): Promise<ApplyDisableErrors<TransformCollectionWithSelect<T, TSlug, TSelect>, TDisableErrors>> {
    return findByID(this, options, init)
  }

  findGlobal<TSlug extends GlobalSlug<T>, TSelect extends SelectFromGlobalSlug<T, TSlug>>(
    options: FindGlobalOptions<T, TSlug, TSelect>,
    init?: RequestInit,
  ): Promise<TransformGlobalWithSelect<T, TSlug, TSelect>> {
    return findGlobal(this, options, init)
  }

  findGlobalVersionByID<TSlug extends GlobalSlug<T>, TDisableErrors extends boolean>(
    options: FindGlobalVersionByIDOptions<T, TSlug, TDisableErrors>,
    init?: RequestInit,
  ): Promise<ApplyDisableErrors<TypeWithVersion<DataFromGlobalSlug<T, TSlug>>, TDisableErrors>> {
    return findGlobalVersionByID(this, options, init)
  }

  findGlobalVersions<TSlug extends GlobalSlug<T>>(
    options: FindGlobalVersionsOptions<T, TSlug>,
    init?: RequestInit,
  ): Promise<PaginatedDocs<TypeWithVersion<DataFromGlobalSlug<T, TSlug>>>> {
    return findGlobalVersions(this, options, init)
  }
  findVersionByID<TSlug extends CollectionSlug<T>, TDisableErrors extends boolean>(
    options: FindVersionByIDOptions<T, TSlug, TDisableErrors>,
    init?: RequestInit,
  ): Promise<
    ApplyDisableErrors<TypeWithVersion<DataFromCollectionSlug<T, TSlug>>, TDisableErrors>
  > {
    return findVersionByID(this, options, init)
  }

  findVersions<TSlug extends CollectionSlug<T>>(
    options: FindVersionsOptions<T, TSlug>,
    init?: RequestInit,
  ): Promise<PaginatedDocs<TypeWithVersion<DataFromCollectionSlug<T, TSlug>>>> {
    return findVersions(this, options, init)
  }
  forgotPassword<TSlug extends AuthCollectionSlug<T>>(
    options: ForgotPasswordOptions<T, TSlug>,
    init?: RequestInit,
  ): Promise<{ message: string }> {
    return forgotPassword(this, options, init)
  }

  login<TSlug extends AuthCollectionSlug<T>>(
    options: LoginOptions<T, TSlug>,
    init?: RequestInit,
  ): Promise<LoginResult<T, TSlug>> {
    return login(this, options, init)
  }

  me<TSlug extends AuthCollectionSlug<T>>(
    options: MeOptions<T, TSlug>,
    init?: RequestInit,
  ): Promise<MeResult<T, TSlug>> {
    return me(this, options, init)
  }

  refreshToken<TSlug extends AuthCollectionSlug<T>>(
    options: RefreshOptions<T, TSlug>,
    init?: RequestInit,
  ): Promise<RefreshResult<T, TSlug>> {
    return refreshToken(this, options, init)
  }

  async request({
    args = {},
    file,
    init: incomingInit,
    json,
    method,
    path,
  }: {
    args?: OperationArgs
    file?: Blob
    init?: RequestInit
    json?: unknown
    method: 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT'
    path: string
  }): Promise<Response> {
    const headers = new Headers({ ...this.baseInit.headers, ...incomingInit?.headers })

    const init: RequestInit = {
      method,
      ...this.baseInit,
      ...incomingInit,
      headers,
    }

    if (json) {
      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('_payload', JSON.stringify(json))
        init.body = formData
      } else {
        headers.set('Content-Type', 'application/json')
        init.body = JSON.stringify(json)
      }
    }

    const response = await this.fetch(`${this.baseURL}${path}${buildSearchParams(args)}`, init)

    return response
  }

  resetPassword<TSlug extends AuthCollectionSlug<T>>(
    options: ResetPasswordOptions<T, TSlug>,
    init?: RequestInit,
  ): Promise<ResetPasswordResult<T, TSlug>> {
    return resetPassword(this, options, init)
  }

  restoreGlobalVersion<TSlug extends GlobalSlug<T>>(
    options: RestoreGlobalVersionByIDOptions<T, TSlug>,
    init?: RequestInit,
  ): Promise<TypeWithVersion<DataFromGlobalSlug<T, TSlug>>> {
    return restoreGlobalVersion(this, options, init)
  }

  restoreVersion<TSlug extends CollectionSlug<T>>(
    options: RestoreVersionByIDOptions<T, TSlug>,
    init?: RequestInit,
  ): Promise<DataFromCollectionSlug<T, TSlug>> {
    return restoreVersion(this, options, init)
  }

  update<TSlug extends CollectionSlug<T>, TSelect extends SelectFromCollectionSlug<T, TSlug>>(
    options: UpdateManyOptions<T, TSlug, TSelect>,
    init?: RequestInit,
  ): Promise<BulkOperationResult<T, TSlug, TSelect>>

  update<TSlug extends CollectionSlug<T>, TSelect extends SelectFromCollectionSlug<T, TSlug>>(
    options: UpdateByIDOptions<T, TSlug, TSelect>,
    init?: RequestInit,
  ): Promise<TransformCollectionWithSelect<T, TSlug, TSelect>>

  /**
   * @description Update one or more documents
   * @param options
   * @returns Updated document(s)
   */
  update<TSlug extends CollectionSlug<T>, TSelect extends SelectFromCollectionSlug<T, TSlug>>(
    options: UpdateOptions<T, TSlug, TSelect>,
    init?: RequestInit,
  ): Promise<
    BulkOperationResult<T, TSlug, TSelect> | TransformCollectionWithSelect<T, TSlug, TSelect>
  > {
    return update(this, options, init)
  }

  updateGlobal<TSlug extends GlobalSlug<T>, TSelect extends SelectFromGlobalSlug<T, TSlug>>(
    options: UpdateGlobalOptions<T, TSlug, TSelect>,
    init?: RequestInit,
  ): Promise<TransformGlobalWithSelect<T, TSlug, TSelect>> {
    return updateGlobal(this, options, init)
  }

  verifyEmail<TSlug extends AuthCollectionSlug<T>>(
    options: VerifyEmailOptions<T, TSlug>,
    init?: RequestInit,
  ): Promise<{ message: string }> {
    return verifyEmail(this, options, init)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/sdk/src/types.ts

```typescript
import type {
  JsonObject,
  SelectType,
  Sort,
  StringKeyOf,
  TransformDataWithSelect,
  TypeWithID,
  Where,
} from 'payload'
import type { MarkOptional, NonNever } from 'ts-essentials'

export interface PayloadGeneratedTypes {
  auth: {
    [slug: string]: {
      forgotPassword: {
        email: string
      }
      login: {
        email: string
        password: string
      }
      registerFirstUser: {
        email: string
        password: string
      }
      unlock: {
        email: string
      }
    }
  }

  collections: {
    [slug: string]: JsonObject & TypeWithID
  }
  collectionsJoins: {
    [slug: string]: {
      [schemaPath: string]: string
    }
  }

  collectionsSelect: {
    [slug: string]: any
  }
  db: {
    defaultIDType: number | string
  }
  globals: {
    [slug: string]: JsonObject
  }

  globalsSelect: {
    [slug: string]: any
  }

  locale: null | string
}

export type TypedCollection<T extends PayloadGeneratedTypes> = T['collections']

export type TypedGlobal<T extends PayloadGeneratedTypes> = T['globals']

export type TypedCollectionSelect<T extends PayloadGeneratedTypes> = T['collectionsSelect']

export type TypedCollectionJoins<T extends PayloadGeneratedTypes> = T['collectionsJoins']

export type TypedGlobalSelect<T extends PayloadGeneratedTypes> = T['globalsSelect']

export type TypedAuth<T extends PayloadGeneratedTypes> = T['auth']

export type CollectionSlug<T extends PayloadGeneratedTypes> = StringKeyOf<TypedCollection<T>>

export type GlobalSlug<T extends PayloadGeneratedTypes> = StringKeyOf<TypedGlobal<T>>

export type AuthCollectionSlug<T extends PayloadGeneratedTypes> = StringKeyOf<TypedAuth<T>>

export type TypedUploadCollection<T extends PayloadGeneratedTypes> = NonNever<{
  [K in keyof TypedCollection<T>]:
    | 'filename'
    | 'filesize'
    | 'mimeType'
    | 'url' extends keyof TypedCollection<T>[K]
    ? TypedCollection<T>[K]
    : never
}>

export type UploadCollectionSlug<T extends PayloadGeneratedTypes> = StringKeyOf<
  TypedUploadCollection<T>
>

export type DataFromCollectionSlug<
  T extends PayloadGeneratedTypes,
  TSlug extends CollectionSlug<T>,
> = TypedCollection<T>[TSlug]

export type DataFromGlobalSlug<
  T extends PayloadGeneratedTypes,
  TSlug extends GlobalSlug<T>,
> = TypedGlobal<T>[TSlug]

export type SelectFromCollectionSlug<
  T extends PayloadGeneratedTypes,
  TSlug extends CollectionSlug<T>,
> = TypedCollectionSelect<T>[TSlug]

export type SelectFromGlobalSlug<
  T extends PayloadGeneratedTypes,
  TSlug extends GlobalSlug<T>,
> = TypedGlobalSelect<T>[TSlug]

export type TransformCollectionWithSelect<
  T extends PayloadGeneratedTypes,
  TSlug extends CollectionSlug<T>,
  TSelect extends SelectType,
> = TSelect extends SelectType
  ? TransformDataWithSelect<DataFromCollectionSlug<T, TSlug>, TSelect>
  : DataFromCollectionSlug<T, TSlug>

export type TransformGlobalWithSelect<
  T extends PayloadGeneratedTypes,
  TSlug extends GlobalSlug<T>,
  TSelect extends SelectType,
> = TSelect extends SelectType
  ? TransformDataWithSelect<DataFromGlobalSlug<T, TSlug>, TSelect>
  : DataFromGlobalSlug<T, TSlug>

export type RequiredDataFromCollection<TData extends JsonObject> = MarkOptional<
  TData,
  'createdAt' | 'id' | 'sizes' | 'updatedAt'
>

export type RequiredDataFromCollectionSlug<
  T extends PayloadGeneratedTypes,
  TSlug extends CollectionSlug<T>,
> = RequiredDataFromCollection<DataFromCollectionSlug<T, TSlug>>

export type TypedLocale<T extends PayloadGeneratedTypes> = NonNullable<T['locale']>

export type JoinQuery<T extends PayloadGeneratedTypes, TSlug extends CollectionSlug<T>> =
  TypedCollectionJoins<T>[TSlug] extends Record<string, string>
    ?
        | false
        | Partial<{
            [K in keyof TypedCollectionJoins<T>[TSlug]]:
              | {
                  count?: boolean
                  limit?: number
                  page?: number
                  sort?: Sort
                  where?: Where
                }
              | false
          }>
    : never

export type PopulateType<T extends PayloadGeneratedTypes> = Partial<TypedCollectionSelect<T>>

export type IDType<
  T extends PayloadGeneratedTypes,
  TSlug extends CollectionSlug<T>,
> = DataFromCollectionSlug<T, TSlug>['id']

export type BulkOperationResult<
  T extends PayloadGeneratedTypes,
  TSlug extends CollectionSlug<T>,
  TSelect extends SelectType,
> = {
  docs: TransformCollectionWithSelect<T, TSlug, TSelect>[]
  errors: {
    id: DataFromCollectionSlug<T, TSlug>['id']
    message: string
  }[]
}
```

--------------------------------------------------------------------------------

---[FILE: forgotPassword.ts]---
Location: payload-main/packages/sdk/src/auth/forgotPassword.ts

```typescript
import type { PayloadSDK } from '../index.js'
import type { AuthCollectionSlug, PayloadGeneratedTypes, TypedAuth } from '../types.js'

export type ForgotPasswordOptions<
  T extends PayloadGeneratedTypes,
  TSlug extends AuthCollectionSlug<T>,
> = {
  collection: TSlug
  data: {
    disableEmail?: boolean
    expiration?: number
  } & Omit<TypedAuth<T>[TSlug]['forgotPassword'], 'password'>
}

export async function forgotPassword<
  T extends PayloadGeneratedTypes,
  TSlug extends AuthCollectionSlug<T>,
>(
  sdk: PayloadSDK<T>,
  options: ForgotPasswordOptions<T, TSlug>,
  init?: RequestInit,
): Promise<{ message: string }> {
  const response = await sdk.request({
    init,
    json: options.data,
    method: 'POST',
    path: `/${options.collection}/forgot-password`,
  })

  return response.json()
}
```

--------------------------------------------------------------------------------

---[FILE: login.ts]---
Location: payload-main/packages/sdk/src/auth/login.ts

```typescript
import type { PayloadSDK } from '../index.js'
import type {
  AuthCollectionSlug,
  DataFromCollectionSlug,
  PayloadGeneratedTypes,
  TypedAuth,
} from '../types.js'

export type LoginOptions<T extends PayloadGeneratedTypes, TSlug extends AuthCollectionSlug<T>> = {
  collection: TSlug
  data: TypedAuth<T>[TSlug]['login']
}

export type LoginResult<T extends PayloadGeneratedTypes, TSlug extends AuthCollectionSlug<T>> = {
  exp?: number
  message: string
  token?: string
  // @ts-expect-error auth collection and user collection
  user: DataFromCollectionSlug<T, TSlug>
}

export async function login<T extends PayloadGeneratedTypes, TSlug extends AuthCollectionSlug<T>>(
  sdk: PayloadSDK<T>,
  options: LoginOptions<T, TSlug>,
  init?: RequestInit,
): Promise<LoginResult<T, TSlug>> {
  const response = await sdk.request({
    init,
    json: options.data,
    method: 'POST',
    path: `/${options.collection}/login`,
  })

  return response.json()
}
```

--------------------------------------------------------------------------------

---[FILE: me.ts]---
Location: payload-main/packages/sdk/src/auth/me.ts

```typescript
import type { PayloadSDK } from '../index.js'
import type { AuthCollectionSlug, DataFromCollectionSlug, PayloadGeneratedTypes } from '../types.js'

export type MeOptions<T extends PayloadGeneratedTypes, TSlug extends AuthCollectionSlug<T>> = {
  collection: TSlug
}

export type MeResult<T extends PayloadGeneratedTypes, TSlug extends AuthCollectionSlug<T>> = {
  collection?: TSlug
  exp?: number
  message: string
  strategy?: string
  token?: string
  // @ts-expect-error auth collection and user collection
  user: DataFromCollectionSlug<T, TSlug>
}

export async function me<T extends PayloadGeneratedTypes, TSlug extends AuthCollectionSlug<T>>(
  sdk: PayloadSDK<T>,
  options: MeOptions<T, TSlug>,
  init?: RequestInit,
): Promise<MeResult<T, TSlug>> {
  const response = await sdk.request({
    init,
    method: 'GET',
    path: `/${options.collection}/me`,
  })

  return response.json()
}
```

--------------------------------------------------------------------------------

---[FILE: refreshToken.ts]---
Location: payload-main/packages/sdk/src/auth/refreshToken.ts

```typescript
import type { PayloadSDK } from '../index.js'
import type { AuthCollectionSlug, DataFromCollectionSlug, PayloadGeneratedTypes } from '../types.js'

export type RefreshOptions<T extends PayloadGeneratedTypes, TSlug extends AuthCollectionSlug<T>> = {
  collection: TSlug
}

export type RefreshResult<T extends PayloadGeneratedTypes, TSlug extends AuthCollectionSlug<T>> = {
  exp: number
  refreshedToken: string
  setCookie?: boolean
  strategy?: string
  // @ts-expect-error auth collection and user collection
  user: DataFromCollectionSlug<T, TSlug>
}

export async function refreshToken<
  T extends PayloadGeneratedTypes,
  TSlug extends AuthCollectionSlug<T>,
>(
  sdk: PayloadSDK<T>,
  options: RefreshOptions<T, TSlug>,
  init?: RequestInit,
): Promise<RefreshResult<T, TSlug>> {
  const response = await sdk.request({
    init,
    method: 'POST',
    path: `/${options.collection}/refresh-token`,
  })

  return response.json()
}
```

--------------------------------------------------------------------------------

````
