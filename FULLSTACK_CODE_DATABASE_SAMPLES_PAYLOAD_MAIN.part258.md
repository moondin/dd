---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 258
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 258 of 695)

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

---[FILE: package.json]---
Location: payload-main/packages/plugin-sentry/package.json
Signals: React, Next.js

```json
{
  "name": "@payloadcms/plugin-sentry",
  "version": "3.68.5",
  "description": "Sentry plugin for Payload",
  "keywords": [
    "payload",
    "cms",
    "plugin",
    "typescript",
    "sentry",
    "error handling"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/payloadcms/payload.git",
    "directory": "packages/plugin-sentry"
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
    "build": "pnpm copyfiles && pnpm build:types && pnpm build:swc",
    "build:debug": "pnpm build",
    "build:swc": "swc ./src -d ./dist --config-file .swcrc-build --strip-leading-paths",
    "build:types": "tsc --emitDeclarationOnly --outDir dist",
    "clean": "rimraf -g {dist,*.tsbuildinfo}",
    "copyfiles": "copyfiles -u 1 \"src/**/*.{html,css,scss,ttf,woff,woff2,eot,svg,jpg,png,json}\" dist/",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  },
  "dependencies": {
    "@sentry/nextjs": "^8.33.1",
    "@sentry/types": "^8.33.1"
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
      "./client": {
        "import": "./dist/exports/client.js",
        "types": "./dist/exports/client.d.ts",
        "default": "./dist/exports/client.js"
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
Location: payload-main/packages/plugin-sentry/README.md

```text
# Payload Sentry Plugin

This plugin allows you to integrate [Sentry](https://sentry.io/) seamlessly with your [Payload](https://github.com/payloadcms/payload) application.

- [Source code](https://github.com/payloadcms/payload/tree/main/packages/plugin-sentry)
- [Documentation](https://payloadcms.com/docs/plugins/sentry)
- [Documentation source](https://github.com/payloadcms/payload/tree/main/docs/plugins/sentry.mdx)
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/packages/plugin-sentry/tsconfig.json

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

---[FILE: index.ts]---
Location: payload-main/packages/plugin-sentry/src/index.ts

```typescript
import type { ScopeContext } from '@sentry/types'
import type { APIError, Config } from 'payload'

import type { PluginOptions } from './types.js'

export { PluginOptions }
/**
 * @example
 * ```ts
 * import * as Sentry from '@sentry/nextjs'
 *
 * sentryPlugin({
 *   options: {
 *     captureErrors: [400, 403],
 *     context: ({ defaultContext, req }) => {
 *       return {
 *         ...defaultContext,
 *         tags: {
 *           locale: req.locale,
 *         },
 *       }
 *     },
 *     debug: true,
 *   },
 *   Sentry,
 * })
 * ```
 */
export const sentryPlugin =
  (pluginOptions: PluginOptions) =>
  (config: Config): Config => {
    const { enabled = true, options = {}, Sentry } = pluginOptions

    if (!enabled || !Sentry) {
      return config
    }

    const { captureErrors = [], debug = false } = options

    return {
      ...config,
      admin: {
        ...config.admin,
        components: {
          ...config.admin?.components,
          providers: [
            ...(config.admin?.components?.providers ?? []),
            '@payloadcms/plugin-sentry/client#AdminErrorBoundary',
          ],
        },
      },
      hooks: {
        afterError: [
          ...(config.hooks?.afterError ?? []),
          async (args) => {
            const status = (args.error as APIError).status ?? 500
            if (status >= 500 || captureErrors.includes(status)) {
              let context: Partial<ScopeContext> = {
                extra: {
                  errorCollectionSlug: args.collection?.slug,
                },
                ...(args.req.user && {
                  user: {
                    id: args.req.user.id,
                    collection: args.req.user.collection,
                    email: args.req.user.email,
                    ip_address: args.req.headers?.get('X-Forwarded-For') ?? undefined,
                    username: args.req.user.username,
                  },
                }),
              }

              if (options?.context) {
                context = await options.context({
                  ...args,
                  defaultContext: context,
                })
              }

              const id = Sentry.captureException(args.error, context)

              if (debug) {
                args.req.payload.logger.info(
                  `Captured exception ${id} to Sentry, error msg: ${args.error.message}`,
                )
              }
            }
          },
        ],
      },
    }
  }
```

--------------------------------------------------------------------------------

---[FILE: plugin.spec.ts]---
Location: payload-main/packages/plugin-sentry/src/plugin.spec.ts

```typescript
import type { AfterErrorHook, AfterErrorHookArgs, Config, PayloadRequest } from 'payload'

import { APIError, defaults } from 'payload'

import { sentryPlugin } from './index'
import { randomUUID } from 'crypto'

const mockExceptionID = randomUUID()

const mockSentry = {
  captureException() {
    return mockExceptionID
  },
}

describe('@payloadcms/plugin-sentry - unit', () => {
  it('should run the plugin', () => {
    const plugin = sentryPlugin({ Sentry: mockSentry, enabled: true })
    const config = plugin(createConfig())

    assertPluginRan(config)
  })

  it('should default enabled: true', () => {
    const plugin = sentryPlugin({ Sentry: mockSentry })
    const config = plugin(createConfig())

    assertPluginRan(config)
  })

  it('should not run if Sentry is not provided', () => {
    const plugin = sentryPlugin({ enabled: true })
    const config = plugin(createConfig())

    assertPluginDidNotRun(config)
  })

  it('should respect enabled: false', () => {
    const plugin = sentryPlugin({ Sentry: mockSentry, enabled: false })
    const config = plugin(createConfig())

    assertPluginDidNotRun(config)
  })

  it('should execute Sentry.captureException with correct errors / args', async () => {
    const hintTimestamp = Date.now()

    const plugin = sentryPlugin({
      Sentry: mockSentry,
      options: {
        context: ({ defaultContext }) => ({
          ...defaultContext,
          extra: {
            ...defaultContext.extra,
            hintTimestamp,
          },
        }),
      },
    })
    const config = plugin(createConfig())

    const hook = config.hooks?.afterError?.[0] as AfterErrorHook

    const apiError = new Error('ApiError')

    const afterApiErrorHookArgs: AfterErrorHookArgs = {
      req: {} as PayloadRequest,
      context: {},
      error: apiError,
      collection: { slug: 'mock-slug' } as any,
    }

    const captureExceptionSpy = jest.spyOn(mockSentry, 'captureException')

    await hook(afterApiErrorHookArgs)

    expect(captureExceptionSpy).toHaveBeenCalledTimes(1)
    expect(captureExceptionSpy).toHaveBeenCalledWith(apiError, {
      extra: {
        errorCollectionSlug: 'mock-slug',
        hintTimestamp,
      },
    })
    expect(captureExceptionSpy).toHaveReturnedWith(mockExceptionID)

    const error = new Error('Error')

    const afterErrorHookArgs: AfterErrorHookArgs = {
      req: {} as PayloadRequest,
      context: {},
      error,
      collection: { slug: 'mock-slug' } as any,
    }

    await hook(afterErrorHookArgs)

    expect(captureExceptionSpy).toHaveBeenCalledTimes(2)
    expect(captureExceptionSpy).toHaveBeenCalledWith(error, {
      extra: {
        errorCollectionSlug: 'mock-slug',
        hintTimestamp,
      },
    })
    expect(captureExceptionSpy).toHaveReturnedWith(mockExceptionID)
  })
})

function assertPluginRan(config: Config) {
  expect(config.hooks?.afterError?.[0]).toBeDefined()
}

function assertPluginDidNotRun(config: Config) {
  expect(config.hooks?.afterError?.[0]).toBeUndefined()
}

function createConfig(overrides?: Partial<Config>): Config {
  return {
    ...defaults,
    ...overrides,
  } as Config
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/plugin-sentry/src/types.ts

```typescript
import type { ScopeContext } from '@sentry/types'
import type { AfterErrorHookArgs } from 'payload'

type SentryInstance = {
  captureException: (err: Error, hint: any) => string
}

type ContextArgs = {
  defaultContext: Partial<ScopeContext>
} & AfterErrorHookArgs

export interface PluginOptions {
  /**
   * Enable or disable Sentry plugin
   * @default true
   */
  enabled?: boolean
  /**
   * Options passed directly to Sentry
   */
  options?: {
    /**
     * Sentry will only capture 500 errors by default.
     * If you want to capture other errors, you can add them as an array here.
     * @default []
     */
    captureErrors?: number[]
    /**
     * Set `ScopeContext` for `Sentry.captureException` which includes `user` and other info.
     */
    context?: (args: ContextArgs) => Partial<ScopeContext> | Promise<Partial<ScopeContext>>
    /**
     * Log captured exceptions,
     * @default false
     */
    debug?: boolean
  }
  /**
   * Instance of Sentry from
   * ```ts
   * import * as Sentry from '@sentry/nextjs'
   * ```
   * This is required unless enabled is set to false.
   */
  Sentry?: SentryInstance
}
```

--------------------------------------------------------------------------------

---[FILE: client.ts]---
Location: payload-main/packages/plugin-sentry/src/exports/client.ts

```typescript
export { AdminErrorBoundary } from '../providers/AdminErrorBoundary.js'
```

--------------------------------------------------------------------------------

---[FILE: AdminErrorBoundary.tsx]---
Location: payload-main/packages/plugin-sentry/src/providers/AdminErrorBoundary.tsx
Signals: React

```typescript
'use client'

import type { ReactNode } from 'react'

import { ErrorBoundary } from '@sentry/nextjs'

/**
 * Captures errored components to Sentry
 */
export const AdminErrorBoundary = ({ children }: { children: ReactNode }) => {
  return <ErrorBoundary>{children}</ErrorBoundary>
}
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/packages/plugin-seo/.gitignore

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
Location: payload-main/packages/plugin-seo/.prettierignore

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
Location: payload-main/packages/plugin-seo/.swcrc

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
Location: payload-main/packages/plugin-seo/LICENSE.md

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
Location: payload-main/packages/plugin-seo/package.json
Signals: React, Next.js

```json
{
  "name": "@payloadcms/plugin-seo",
  "version": "3.68.5",
  "description": "SEO plugin for Payload",
  "keywords": [
    "payload",
    "cms",
    "plugin",
    "typescript",
    "react",
    "seo",
    "yoast"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/payloadcms/payload.git",
    "directory": "packages/plugin-seo"
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
  "sideEffects": [
    "*.scss",
    "*.css"
  ],
  "type": "module",
  "exports": {
    ".": {
      "import": "./src/index.tsx",
      "types": "./src/index.tsx",
      "default": "./src/index.tsx"
    },
    "./types": {
      "import": "./src/exports/types.ts",
      "types": "./src/exports/types.ts",
      "default": "./src/exports/types.ts"
    },
    "./fields": {
      "import": "./src/exports/fields.ts",
      "types": "./src/exports/fields.ts",
      "default": "./src/exports/fields.ts"
    },
    "./client": {
      "import": "./src/exports/client.ts",
      "types": "./src/exports/client.ts",
      "default": "./src/exports/client.ts"
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
    "@payloadcms/ui": "workspace:*"
  },
  "devDependencies": {
    "@payloadcms/eslint-config": "workspace:*",
    "@payloadcms/next": "workspace:*",
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
      "./fields": {
        "import": "./dist/exports/fields.js",
        "types": "./dist/exports/fields.d.ts",
        "default": "./dist/exports/fields.js"
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
Location: payload-main/packages/plugin-seo/README.md

```text
# Payload SEO Plugin

A plugin for [Payload](https://github.com/payloadcms/payload) to manage SEO metadata from within your admin panel.

If you're using version 2.0.0 or higher of this plugin, you'll need to be using version 2.7.0 or higher of Payload.

If you're still on an older payload version, please use version 1.0.15.

- [Source code](https://github.com/payloadcms/payload/tree/main/packages/plugin-seo)
- [Documentation](https://payloadcms.com/docs/plugins/seo)
- [Documentation source](https://github.com/payloadcms/payload/tree/main/docs/plugins/seo.mdx)
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/packages/plugin-seo/tsconfig.json
Signals: Next.js

```json
{
  "extends": "../../tsconfig.base.json",
  "references": [{ "path": "../payload" }, { "path": "../ui" }, { "path": "../next" }]
}
```

--------------------------------------------------------------------------------

---[FILE: defaults.ts]---
Location: payload-main/packages/plugin-seo/src/defaults.ts

```typescript
export const defaults = {
  description: {
    maxLength: 150,
    minLength: 100,
  },
  title: {
    maxLength: 60,
    minLength: 50,
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/plugin-seo/src/index.tsx

```typescript
import type { Config, Field, GroupField, TabsField } from 'payload'

import { deepMergeSimple } from 'payload/shared'

import type {
  GenerateDescription,
  GenerateImage,
  GenerateTitle,
  GenerateURL,
  SEOPluginConfig,
} from './types.js'

import { MetaDescriptionField } from './fields/MetaDescription/index.js'
import { MetaImageField } from './fields/MetaImage/index.js'
import { MetaTitleField } from './fields/MetaTitle/index.js'
import { OverviewField } from './fields/Overview/index.js'
import { PreviewField } from './fields/Preview/index.js'
import { translations } from './translations/index.js'

export const seoPlugin =
  (pluginConfig: SEOPluginConfig) =>
  (config: Config): Config => {
    const defaultFields: Field[] = [
      OverviewField({}),
      MetaTitleField({
        hasGenerateFn: typeof pluginConfig?.generateTitle === 'function',
      }),
      MetaDescriptionField({
        hasGenerateFn: typeof pluginConfig?.generateDescription === 'function',
      }),
      ...(pluginConfig?.uploadsCollection
        ? [
            MetaImageField({
              hasGenerateFn: typeof pluginConfig?.generateImage === 'function',
              relationTo: pluginConfig.uploadsCollection as string,
            }),
          ]
        : []),
      PreviewField({
        hasGenerateFn: typeof pluginConfig?.generateURL === 'function',
      }),
    ]

    const seoFields: GroupField[] = [
      {
        name: 'meta',
        type: 'group',
        fields: [
          ...(pluginConfig?.fields && typeof pluginConfig.fields === 'function'
            ? pluginConfig.fields({ defaultFields })
            : defaultFields),
        ],
        interfaceName: pluginConfig.interfaceName,
        label: 'SEO',
      },
    ]

    return {
      ...config,
      collections:
        config.collections?.map((collection) => {
          const { slug } = collection
          const isEnabled = pluginConfig?.collections?.includes(slug)

          if (isEnabled) {
            if (pluginConfig?.tabbedUI) {
              // prevent issues with auth enabled collections having an email field that shouldn't be moved to the SEO tab
              const emailField =
                collection.auth &&
                !(typeof collection.auth === 'object' && collection.auth.disableLocalStrategy) &&
                collection.fields?.find((field) => 'name' in field && field.name === 'email')
              const hasOnlyEmailField = collection.fields?.length === 1 && emailField

              const seoTabs: TabsField[] = hasOnlyEmailField
                ? [
                    {
                      type: 'tabs',
                      tabs: [
                        {
                          fields: seoFields,
                          label: 'SEO',
                        },
                      ],
                    },
                  ]
                : [
                    {
                      type: 'tabs',
                      tabs: [
                        // append a new tab onto the end of the tabs array, if there is one at the first index
                        // if needed, create a new `Content` tab in the first index for this collection's base fields
                        ...(collection?.fields?.[0]?.type === 'tabs' &&
                        collection?.fields?.[0]?.tabs
                          ? collection.fields[0].tabs
                          : [
                              {
                                fields: [
                                  ...(emailField
                                    ? collection.fields.filter(
                                        (field) => 'name' in field && field.name !== 'email',
                                      )
                                    : collection.fields),
                                ],
                                label: collection?.labels?.singular || 'Content',
                              },
                            ]),
                        {
                          fields: seoFields,
                          label: 'SEO',
                        },
                      ],
                    },
                  ]

              return {
                ...collection,
                fields: [
                  ...(emailField ? [emailField] : []),
                  ...seoTabs,
                  ...(collection?.fields?.[0]?.type === 'tabs' ? collection.fields.slice(1) : []),
                ],
              }
            }

            return {
              ...collection,
              fields: [...(collection?.fields || []), ...seoFields],
            }
          }

          return collection
        }) || [],
      endpoints: [
        ...(config.endpoints ?? []),
        {
          handler: async (req) => {
            const data: Omit<
              Parameters<GenerateTitle>[0],
              'collectionConfig' | 'globalConfig' | 'req'
            > = await req.json?.()

            const reqData = data ?? req.data

            const result = pluginConfig.generateTitle
              ? await pluginConfig.generateTitle({
                  ...data,
                  collectionConfig: config.collections?.find(
                    (c) => c.slug === reqData.collectionSlug,
                  ),
                  globalConfig: config.globals?.find((g) => g.slug === reqData.globalSlug),
                  req,
                } satisfies Parameters<GenerateTitle>[0])
              : ''
            return new Response(JSON.stringify({ result }), { status: 200 })
          },
          method: 'post',
          path: '/plugin-seo/generate-title',
        },
        {
          handler: async (req) => {
            const data: Omit<
              Parameters<GenerateTitle>[0],
              'collectionConfig' | 'globalConfig' | 'req'
            > = await req.json?.()

            const reqData = data ?? req.data

            const result = pluginConfig.generateDescription
              ? await pluginConfig.generateDescription({
                  ...data,
                  collectionConfig: config.collections?.find(
                    (c) => c.slug === reqData.collectionSlug,
                  ),
                  globalConfig: config.globals?.find((g) => g.slug === reqData.globalSlug),
                  req,
                } satisfies Parameters<GenerateDescription>[0])
              : ''
            return new Response(JSON.stringify({ result }), { status: 200 })
          },
          method: 'post',
          path: '/plugin-seo/generate-description',
        },
        {
          handler: async (req) => {
            const data: Omit<
              Parameters<GenerateTitle>[0],
              'collectionConfig' | 'globalConfig' | 'req'
            > = await req.json?.()

            const reqData = data ?? req.data

            const result = pluginConfig.generateURL
              ? await pluginConfig.generateURL({
                  ...data,
                  collectionConfig: config.collections?.find(
                    (c) => c.slug === reqData.collectionSlug,
                  ),
                  globalConfig: config.globals?.find((g) => g.slug === reqData.globalSlug),
                  req,
                } satisfies Parameters<GenerateURL>[0])
              : ''
            return new Response(JSON.stringify({ result }), { status: 200 })
          },
          method: 'post',
          path: '/plugin-seo/generate-url',
        },
        {
          handler: async (req) => {
            const data: Omit<
              Parameters<GenerateTitle>[0],
              'collectionConfig' | 'globalConfig' | 'req'
            > = await req.json?.()

            const reqData = data ?? req.data

            const result = pluginConfig.generateImage
              ? await pluginConfig.generateImage({
                  ...data,
                  collectionConfig: config.collections?.find(
                    (c) => c.slug === reqData.collectionSlug,
                  ),
                  globalConfig: config.globals?.find((g) => g.slug === reqData.globalSlug),
                  req,
                } satisfies Parameters<GenerateImage>[0])
              : ''
            return new Response(JSON.stringify({ result }), { status: 200 })
          },
          method: 'post',
          path: '/plugin-seo/generate-image',
        },
      ],
      globals:
        config.globals?.map((global) => {
          const { slug } = global
          const isEnabled = pluginConfig?.globals?.includes(slug)

          if (isEnabled) {
            if (pluginConfig?.tabbedUI) {
              const seoTabs: TabsField[] = [
                {
                  type: 'tabs',
                  tabs: [
                    // append a new tab onto the end of the tabs array, if there is one at the first index
                    // if needed, create a new `Content` tab in the first index for this global's base fields
                    ...(global?.fields?.[0]?.type === 'tabs' && global?.fields?.[0].tabs
                      ? global.fields[0].tabs
                      : [
                          {
                            fields: [...(global?.fields || [])],
                            label: global?.label || 'Content',
                          },
                        ]),
                    {
                      fields: seoFields,
                      label: 'SEO',
                    },
                  ],
                },
              ]

              return {
                ...global,
                fields: [
                  ...seoTabs,
                  ...(global?.fields?.[0]?.type === 'tabs' ? global.fields.slice(1) : []),
                ],
              }
            }

            return {
              ...global,
              fields: [...(global?.fields || []), ...seoFields],
            }
          }

          return global
        }) || [],
      i18n: {
        ...config.i18n,
        translations: deepMergeSimple(translations, config.i18n?.translations ?? {}),
      },
    }
  }
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/plugin-seo/src/types.ts

```typescript
import type { DocumentInfoContext } from '@payloadcms/ui'
import type {
  CollectionConfig,
  CollectionSlug,
  Field,
  GlobalConfig,
  GlobalSlug,
  PayloadRequest,
  UploadCollectionSlug,
} from 'payload'

export type FieldsOverride = (args: { defaultFields: Field[] }) => Field[]

export type PartialDocumentInfoContext = Pick<
  DocumentInfoContext,
  | 'collectionSlug'
  | 'docPermissions'
  | 'globalSlug'
  | 'hasPublishedDoc'
  | 'hasPublishPermission'
  | 'hasSavePermission'
  | 'id'
  | 'initialData'
  | 'initialState'
  | 'preferencesKey'
  | 'title'
  | 'versionCount'
>

export type GenerateTitle<T = any> = (
  args: {
    collectionConfig?: CollectionConfig
    doc: T
    globalConfig?: GlobalConfig
    locale?: string
    req: PayloadRequest
  } & PartialDocumentInfoContext,
) => Promise<string> | string

export type GenerateDescription<T = any> = (
  args: {
    collectionConfig?: CollectionConfig
    doc: T
    globalConfig?: GlobalConfig
    locale?: string
    req: PayloadRequest
  } & PartialDocumentInfoContext,
) => Promise<string> | string

export type GenerateImage<T = any> = (
  args: {
    collectionConfig?: CollectionConfig
    doc: T
    globalConfig?: GlobalConfig
    locale?: string
    req: PayloadRequest
  } & PartialDocumentInfoContext,
) => { id: number | string } | number | Promise<{ id: number | string } | number | string> | string

export type GenerateURL<T = any> = (
  args: {
    collectionConfig?: CollectionConfig
    doc: T
    globalConfig?: GlobalConfig
    locale?: string
    req: PayloadRequest
  } & PartialDocumentInfoContext,
) => Promise<string> | string

export type SEOPluginConfig = {
  /**
   * Collections to include the SEO fields in
   */
  collections?: ({} | CollectionSlug)[]
  /**
   * Override the default fields inserted by the SEO plugin via a function that receives the default fields and returns the new fields
   *
   * If you need more flexibility you can insert the fields manually as needed. @link https://payloadcms.com/docs/plugins/seo#direct-use-of-fields
   */
  fields?: FieldsOverride
  generateDescription?: GenerateDescription
  generateImage?: GenerateImage
  generateTitle?: GenerateTitle
  /**
   *
   */
  generateURL?: GenerateURL
  /**
   * Globals to include the SEO fields in
   */
  globals?: ({} | GlobalSlug)[]
  interfaceName?: string
  /**
   * Group fields into tabs, your content will be automatically put into a general tab and the SEO fields into an SEO tab
   *
   * If you need more flexibility you can insert the fields manually as needed. @link https://payloadcms.com/docs/plugins/seo#direct-use-of-fields
   */
  tabbedUI?: boolean
  /**
   * The slug of the collection used to handle image uploads
   */
  uploadsCollection?: {} | UploadCollectionSlug
}

export type Meta = {
  description?: string
  image?: any // TODO: type this
  keywords?: string
  title?: string
}
```

--------------------------------------------------------------------------------

---[FILE: client.ts]---
Location: payload-main/packages/plugin-seo/src/exports/client.ts

```typescript
export { MetaDescriptionComponent } from '../fields/MetaDescription/MetaDescriptionComponent.js'
export { MetaImageComponent } from '../fields/MetaImage/MetaImageComponent.js'
export { MetaTitleComponent } from '../fields/MetaTitle/MetaTitleComponent.js'
export { OverviewComponent } from '../fields/Overview/OverviewComponent.js'
export { PreviewComponent } from '../fields/Preview/PreviewComponent.js'
```

--------------------------------------------------------------------------------

---[FILE: fields.ts]---
Location: payload-main/packages/plugin-seo/src/exports/fields.ts

```typescript
export { MetaDescriptionField } from '../fields/MetaDescription/index.js'
export { MetaImageField } from '../fields/MetaImage/index.js'
export { MetaTitleField } from '../fields/MetaTitle/index.js'
export { OverviewField } from '../fields/Overview/index.js'
export { PreviewField } from '../fields/Preview/index.js'
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/plugin-seo/src/exports/types.ts

```typescript
export type {
  GenerateDescription,
  GenerateImage,
  GenerateTitle,
  GenerateURL,
  Meta,
  SEOPluginConfig,
} from '../types.js'
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/plugin-seo/src/fields/index.scss

```text
@layer payload-default {
  .plugin-seo__field {
    .field-label {
      display: inline !important;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/plugin-seo/src/fields/MetaDescription/index.ts

```typescript
import type { TextareaField } from 'payload'

interface FieldFunctionProps {
  /**
   * Tell the component if the generate function is available as configured in the plugin config
   */
  hasGenerateFn?: boolean
  overrides?: Partial<TextareaField>
}

type FieldFunction = ({ hasGenerateFn, overrides }: FieldFunctionProps) => TextareaField

export const MetaDescriptionField: FieldFunction = ({ hasGenerateFn = false, overrides }) => {
  return {
    name: 'description',
    type: 'textarea',
    admin: {
      components: {
        Field: {
          clientProps: {
            hasGenerateDescriptionFn: hasGenerateFn,
          },
          path: '@payloadcms/plugin-seo/client#MetaDescriptionComponent',
        },
      },
    },
    localized: true,
    ...(overrides ?? {}),
  }
}
```

--------------------------------------------------------------------------------

````
