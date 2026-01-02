---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 245
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 245 of 695)

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

---[FILE: removeDisabledFields.ts]---
Location: payload-main/packages/plugin-import-export/src/utilities/removeDisabledFields.ts

```typescript
/**
 * Recursively removes fields from a deeply nested object based on dot-notation paths.
 *
 * This utility supports removing:
 * - Nested fields in plain objects (e.g., "group.value")
 * - Fields inside arrays of objects (e.g., "group.array.field1")
 *
 * It safely traverses both object and array structures and avoids mutating the original input.
 *
 * @param obj - The original object to clean.
 * @param disabled - An array of dot-separated paths indicating which fields to remove.
 * @returns A deep clone of the original object with specified fields removed.
 */

export const removeDisabledFields = (
  obj: Record<string, unknown>,
  disabled: string[] = [],
): Record<string, unknown> => {
  if (!disabled.length) {
    return obj
  }

  const clone = structuredClone(obj)

  // Process each disabled path independently
  for (const path of disabled) {
    const parts = path.split('.')

    /**
     * Recursively walks the object tree according to the dot path,
     * and deletes the field once the full path is reached.
     *
     * @param target - The current object or array being traversed
     * @param i - The index of the current path part
     */
    const removeRecursively = (target: any, i = 0): void => {
      if (target == null) {
        return
      }

      const key = parts[i]

      // If at the final part of the path, perform the deletion
      if (i === parts.length - 1) {
        // If the current level is an array, delete the key from each item
        if (Array.isArray(target)) {
          for (const item of target) {
            if (item && typeof item === 'object' && key !== undefined) {
              delete item[key as keyof typeof item]
            }
          }
        } else if (typeof target === 'object' && key !== undefined) {
          delete target[key]
        }
        return
      }

      if (key === undefined) {
        return
      }

      // Traverse to the next level in the path
      const next = target[key]

      if (Array.isArray(next)) {
        // If the next value is an array, recurse into each item
        for (const item of next) {
          removeRecursively(item, i + 1)
        }
      } else {
        // Otherwise, continue down the object path
        removeRecursively(next, i + 1)
      }
    }

    removeRecursively(clone)
  }

  return clone
}
```

--------------------------------------------------------------------------------

---[FILE: setNestedValue.ts]---
Location: payload-main/packages/plugin-import-export/src/utilities/setNestedValue.ts

```typescript
/**
 * Sets a value deeply into a nested object or array, based on a dot-notation path.
 *
 * This function:
 * - Supports array indexing (e.g., "array.0.field1")
 * - Creates intermediate arrays/objects as needed
 * - Mutates the target object directly
 *
 * @example
 * const obj = {}
 * setNestedValue(obj, 'group.array.0.field1', 'hello')
 * // Result: { group: { array: [ { field1: 'hello' } ] } }
 *
 * @param obj - The target object to mutate.
 * @param path - A dot-separated string path indicating where to assign the value.
 * @param value - The value to set at the specified path.
 */

export const setNestedValue = (
  obj: Record<string, unknown>,
  path: string,
  value: unknown,
): void => {
  const parts = path.split('.')
  let current: any = obj

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    const isLast = i === parts.length - 1
    const isIndex = !Number.isNaN(Number(part))

    if (isIndex) {
      const index = Number(part)

      // Ensure the current target is an array
      if (!Array.isArray(current)) {
        current = []
      }

      // Ensure the array slot is initialized
      if (!current[index]) {
        current[index] = {}
      }

      if (isLast) {
        current[index] = value
      } else {
        current = current[index] as Record<string, unknown>
      }
    } else {
      // Ensure the object key exists
      if (isLast) {
        if (typeof part === 'string') {
          current[part] = value
        }
      } else {
        if (typeof current[part as string] !== 'object' || current[part as string] === null) {
          current[part as string] = {}
        }

        current = current[part as string] as Record<string, unknown>
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: sortHelpers.ts]---
Location: payload-main/packages/plugin-import-export/src/utilities/sortHelpers.ts

```typescript
/** Remove a leading '-' from a sort value (e.g. "-title" -> "title") */
export const stripSortDash = (v?: null | string): string => (v ? v.replace(/^-/, '') : '')

/** Apply order to a base field (("title","desc") -> "-title") */
export const applySortOrder = (field: string, order: 'asc' | 'desc'): string =>
  order === 'desc' ? `-${field}` : field

// Safely coerce query.sort / query.groupBy to a string (ignore arrays)
export const normalizeQueryParam = (v: unknown): string | undefined => {
  if (typeof v === 'string') {
    return v
  }
  if (Array.isArray(v) && typeof v[0] === 'string') {
    return v[0]
  }
  return undefined
}
```

--------------------------------------------------------------------------------

---[FILE: validateLimitValue.ts]---
Location: payload-main/packages/plugin-import-export/src/utilities/validateLimitValue.ts

```typescript
import type { TFunction } from '@payloadcms/translations'

export const validateLimitValue = (
  value: null | number | undefined,
  t: TFunction,
  step = 100,
): string | undefined => {
  if (value && value < 0) {
    return t('validation:lessThanMin', { label: t('general:value'), min: 0, value })
  }

  if (value && value % step !== 0) {
    return `Limit must be a multiple of ${step}`
  }

  return undefined
}
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/packages/plugin-mcp/.gitignore

```text
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.
# plugin tarballs
/payloadcms-plugin-mcp-server-*.tgz

# dependencies
/node_modules
/.pnp
.pnp.js
.yarn/install-state.gz

/.idea/*
!/.idea/runConfigurations

# testing
/coverage

# next.js
.next/
/out/

# production
/build
/dist

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo

.env

/dev/media

# Playwright
/test-results/
/playwright-report/
/blob-report/
/playwright/.cache/
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: payload-main/packages/plugin-mcp/.prettierignore

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
Location: payload-main/packages/plugin-mcp/.swcrc

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
Location: payload-main/packages/plugin-mcp/LICENSE.md

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
Location: payload-main/packages/plugin-mcp/package.json

```json
{
  "name": "@payloadcms/plugin-mcp",
  "version": "3.68.5",
  "description": "MCP (Model Context Protocol) capabilities with Payload",
  "keywords": [
    "plugin",
    "mcp",
    "model context protocol"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/payloadcms/payload.git",
    "directory": "packages/plugin-mcp"
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
    }
  },
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "files": [
    "src",
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
    "lint:fix": "eslint . --fix",
    "pack:plugin": "pnpm build && pnpm pack"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.17.2",
    "@types/json-schema": "7.0.15",
    "@vercel/mcp-adapter": "^1.0.0",
    "json-schema-to-zod": "2.6.1",
    "zod": "^3.25.50"
  },
  "devDependencies": {
    "@payloadcms/eslint-config": "workspace:*",
    "payload": "workspace:*"
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
Location: payload-main/packages/plugin-mcp/README.md

```text
# Payload MCP Plugin

A plugin for [Payload](https://github.com/payloadcms/payload). This plugin adds [Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro) capabilities.

- [Source code](https://github.com/payloadcms/payload/tree/main/packages/plugin-mcp)
- [Documentation](https://payloadcms.com/docs/plugins/mcp)
- [Documentation source](https://github.com/payloadcms/payload/tree/main/docs/plugins/mcp.mdx)
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/packages/plugin-mcp/tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "references": [{ "path": "../payload" }, { "path": "../ui"}, { "path": "../translations"}]
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/plugin-mcp/src/index.ts

```typescript
import type { Config } from 'payload'

import type { MCPAccessSettings, PluginMCPServerConfig } from './types.js'

import { createAPIKeysCollection } from './collections/createApiKeysCollection.js'
import { initializeMCPHandler } from './endpoints/mcp.js'

declare module 'payload' {
  export interface PayloadRequest {
    payloadAPI: 'GraphQL' | 'local' | 'MCP' | 'REST'
  }
}

export type { MCPAccessSettings }
/**
 * The MCP Plugin for Payload. This plugin allows you to add MCP capabilities to your Payload project.
 *
 * @param pluginOptions - The options for the MCP plugin.
 * @experimental This plugin is experimental and may change in the future.
 */
export const mcpPlugin =
  (pluginOptions: PluginMCPServerConfig) =>
  (config: Config): Config => {
    if (!config.collections) {
      config.collections = []
    }

    // Collections
    const collections = pluginOptions.collections || {}
    // Extract custom tools for the global config
    const customTools =
      pluginOptions.mcp?.tools?.map((tool) => ({
        name: tool.name,
        description: tool.description,
      })) || []

    const experimentalTools = pluginOptions?.experimental?.tools || {}

    /**
     * API Keys
     * --------
     * High resolution control over MCP capabilities is crucial when using Payload with LLMs.
     *
     * This API Keys collection has ways for admins to create API keys and allow or disallow the MCP capabilities.
     * This is useful when Admins want to allow or disallow the use of the MCP capabilities in real time.
     * For example:
     *  - If a collection has all of its capabilities enabled, admins can allow or disallow the create, update, delete, and find capabilities on that collection.
     *  - If a collection only has the find capability enabled, admins can only allow or disallow the find capability on that collection.
     *  - If a custom tool has gone haywire, admins can disallow that tool.
     *
     */
    const apiKeyCollection = createAPIKeysCollection(
      collections,
      customTools,
      experimentalTools,
      pluginOptions,
    )
    if (pluginOptions.overrideApiKeyCollection) {
      config.collections.push(pluginOptions.overrideApiKeyCollection(apiKeyCollection))
    } else {
      config.collections.push(apiKeyCollection)
    }

    /**
     * If the plugin is disabled, we still want to keep added collections/fields so the database schema is consistent which is important for migrations.
     * If your plugin heavily modifies the database schema, you may want to remove this property.
     */
    if (pluginOptions.disabled) {
      return config
    }

    if (!config.endpoints) {
      config.endpoints = []
    }

    /**
     * This is the primary MCP Server Endpoint.
     * Payload will automatically add the /api prefix to the path, so the full path is `/api/mcp`
     * NOTE: This is only transport method until we add full support for SSE which will be another endpoint at `/api/sse`
     */
    config.endpoints.push({
      handler: initializeMCPHandler(pluginOptions),
      method: 'post',
      path: '/mcp',
    })

    /**
     * The GET response is always: {"jsonrpc":"2.0","error":{"code":-32000,"message":"Method not allowed."},"id":null} -- even with an API key
     * This is expected behavior and MCP clients should always use the POST endpoint.
     */
    config.endpoints.push({
      handler: initializeMCPHandler(pluginOptions),
      method: 'get',
      path: '/mcp',
    })

    return config
  }
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/plugin-mcp/src/types.ts
Signals: Zod

```typescript
import type { CollectionConfig, CollectionSlug, PayloadRequest, TypedUser } from 'payload'
import type { z } from 'zod'

import { type ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js'

export type PluginMCPServerConfig = {
  /**
   * Set the collections that should be available as resources via MCP.
   */
  collections?: Partial<
    Record<
      CollectionSlug,
      {
        /**
         * Set the description of the collection. This is used by MCP clients to determine when to use the collecton as a resource.
         */
        description?: string
        /**
         * Set the enabled capabilities of the collection. Admins can then allow or disallow the use of the capability by MCP clients.
         */
        enabled:
          | {
              create?: boolean
              delete?: boolean
              find?: boolean
              update?: boolean
            }
          | boolean

        /**
         * Override the response generated by the MCP client. This allows you to modify the response that is sent to the MCP client. This is useful for adding additional data to the response, data normalization, or verifying data.
         */
        overrideResponse?: (
          response: {
            content: Array<{
              text: string
              type: string
            }>
          },
          doc: Record<string, unknown>,
          req: PayloadRequest,
        ) => {
          content: Array<{
            text: string
            type: string
          }>
        }
      }
    >
  >
  /**
   * Disable the MCP plugin.
   */
  disabled?: boolean
  /**
   * Experimental features
   * **These features are for experimental purposes -- They are Disabled in Production by Default**
   */
  experimental?: {
    /**
     * These are MCP tools that can be used by a client to modify Payload.
     */
    tools: {
      /**
       * **Experimental** -- Auth MCP tools allow a client to change authentication priviliages for users. This is for developing ideas that help Admins with authentication tasks.
       */
      auth?: {
        /**
         * Enable the auth MCP tools. This allows Admins to enable or disable the auth capabilities.
         * @default false
         */
        enabled: boolean
      }
      /**
       * **Experimental** -- Collection MCP tools allow for the creation, modification, and deletion of Payload collections. This is for developing ideas that help Developers with collection tasks.
       */
      collections?: {
        /**
         * Set the directory path to the collections directory. This can be a directory outside of your default directory, or another Payload project.
         */
        collectionsDirPath: string
        /**
         * Enable the collection MCP tools. This allows Admins to enable or disable the Collection modification capabilities.
         * @default false
         */
        enabled: boolean
      }
      /**
       * **Experimental** -- Config MCP tools allow for the modification of a Payload Config. This is for developing ideas that help Developers with config tasks.
       */
      config?: {
        /**
         * Set the directory path to the config directory. This can be a directory outside of your default directory, or another Payload project.
         */
        configFilePath: string
        /**
         * Enable the config MCP tools. This allows Admins to enable or disable the Payload Config modification capabilities.
         * @default false
         */
        enabled: boolean
      }
      /**
       * **Experimental** -- Jobs MCP tools allow for the modification of Payload jobs. This is for developing ideas that help Developers with job tasks.
       */
      jobs?: {
        /**
         * Enable the jobs MCP tools. This allows Admins to enable or disable the Job modification capabilities.
         * @default false
         */
        enabled: boolean
        /**
         * Set the directory path to the jobs directory. This can be a directory outside of your default directory, or another Payload project.
         */
        jobsDirPath: string
      }
    }
  }
  /**
   * MCP Server options.
   */
  mcp?: {
    handlerOptions?: MCPHandlerOptions
    /**
     * Add custom MCP Prompts.
     */
    prompts?: {
      /**
       * Set the args schema of the prompt. This is the args schema that will be passed to the prompt. This is used by MCP clients to determine the arguments that will be passed to the prompt.
       */
      argsSchema: z.ZodRawShape
      /**
       * Set the description of the prompt. This is used by MCP clients to determine when to use the prompt.
       */
      description: string
      /**
       * Set the handler of the prompt. This is the function that will be called when the prompt is used.
       */
      handler: (
        args: Record<string, unknown>,
        req: PayloadRequest,
        _extra: unknown,
      ) =>
        | {
            messages: Array<{
              content: {
                text: string
                type: 'text'
              }
              role: 'assistant' | 'user'
            }>
          }
        | Promise<{
            messages: Array<{
              content: {
                text: string
                type: 'text'
              }
              role: 'assistant' | 'user'
            }>
          }>
      /**
       * Set the function name of the prompt.
       */
      name: string
      /**
       * Set the title of the prompt. LLMs will interperate the title to determine when to use the prompt.
       */
      title: string
    }[]

    /**
     * Add custom MCP Resource.
     */
    resources?: {
      /**
       * Set the description of the resource. This is used by MCP clients to determine when to use the resource.
       * example: 'Data is a resource that contains special data.'
       */
      description: string
      /**
       * Set the handler of the resource. This is the function that will be called when the resource is used.
       * The handler can have either 3 arguments (when no args are passed) or 4 arguments (when args are passed).
       */
      handler: (...args: any[]) =>
        | {
            contents: Array<{
              text: string
              uri: string
            }>
          }
        | Promise<{
            contents: Array<{
              text: string
              uri: string
            }>
          }>
      /**
       * Set the mime type of the resource.
       * example: 'text/plain'
       */
      mimeType: string
      /**
       * Set the function name of the resource.
       * example: 'data'
       */
      name: string
      /**
       * Set the title of the resource. LLMs will interperate the title to determine when to use the resource.
       * example: 'Data'
       */
      title: string
      /**
       * Set the uri of the resource.
       * example: 'data://app'
       */
      uri: ResourceTemplate | string
    }[]
    serverOptions?: MCPServerOptions
    /**
     * Add custom MCP Tools.
     */
    tools?: {
      /**
       * Set the description of the tool. This is used by MCP clients to determine when to use the tool.
       */
      description: string
      /**
       * Set the handler of the tool. This is the function that will be called when the tool is used.
       */
      handler: (
        args: Record<string, unknown>,
        req: PayloadRequest,
        _extra: unknown,
      ) =>
        | {
            content: Array<{
              text: string
              type: 'text'
            }>
            role?: string
          }
        | Promise<{
            content: Array<{
              text: string
              type: 'text'
            }>
            role?: string
          }>
      /**
       * Set the name of the tool. This is the name that will be used to identify the tool. LLMs will interperate the name to determine when to use the tool.
       */
      name: string
      /**
       * Set the parameters of the tool. This is the parameters that will be passed to the tool.
       */
      parameters: z.ZodRawShape
    }[]
  }

  /**
   * Override the API key collection.
   * This allows you to add fields to the API key collection or modify the collection in any way you want.
   * @param collection - The API key collection.
   * @returns The modified API key collection.
   */
  overrideApiKeyCollection?: (collection: CollectionConfig) => CollectionConfig

  /**
   * Override the authentication method.
   * This allows you to use a custom authentication method instead of the default API key authentication.
   * @param req - The request object.
   * @returns The MCP access settings.
   */
  overrideAuth?: (
    req: PayloadRequest,
    getDefaultMcpAccessSettings: (overrideApiKey?: null | string) => Promise<MCPAccessSettings>,
  ) => MCPAccessSettings | Promise<MCPAccessSettings>

  /**
   * Set the users collection that API keys should be associated with.
   */
  userCollection?: CollectionConfig | string
}

/**
 * MCP Handler options.
 */
export type MCPHandlerOptions = {
  /**
   * Set the base path of the MCP handler. This is the path that will be used to access the MCP handler.
   * @default /api
   */
  basePath?: string
  /**
   * Set the maximum duration of the MCP handler. This is the maximum duration that the MCP handler will run for.
   * @default 60
   */
  maxDuration?: number
  /**
   * Set the Redis URL for the MCP handler. This is the URL that will be used to access the Redis server.
   * @default process.env.REDIS_URL
   * INFO: Disabled until developer clarity is reached for server side streaming and we have an auth pattern for all SSE patterns
   */
  // redisUrl?: string
  /**
   * Set verbose logging.
   * @default false
   */
  verboseLogs?: boolean
}

/**
 * MCP Server options.
 */
export type MCPServerOptions = {
  /**
   * Set the server info of the MCP server.
   */
  serverInfo?: {
    /**
     * Set the name of the MCP server.
     * @default 'Payload MCP Server'
     */
    name: string
    /**
     * Set the version of the MCP server.
     * @default '1.0.0'
     */
    version: string
  }
}

export type MCPAccessSettings = {
  auth?: {
    auth?: boolean
    forgotPassword?: boolean
    login?: boolean
    resetPassword?: boolean
    unlock?: boolean
    verify?: boolean
  }
  collections?: {
    create?: boolean
    delete?: boolean
    find?: boolean
    update?: boolean
  }
  config?: {
    find?: boolean
    update?: boolean
  }
  jobs?: {
    create?: boolean
    run?: boolean
    update?: boolean
  }
  'payload-mcp-prompt'?: Record<string, boolean>
  'payload-mcp-resource'?: Record<string, boolean>
  'payload-mcp-tool'?: Record<string, boolean>
  user: TypedUser
} & Record<string, unknown>

export type FieldDefinition = {
  description?: string
  name: string
  options?: { label: string; value: string }[]
  position?: 'main' | 'sidebar'
  required?: boolean
  type: string
}

export type FieldModification = {
  changes: {
    description?: string
    options?: { label: string; value: string }[]
    position?: 'main' | 'sidebar'
    required?: boolean
    type?: string
  }
  fieldName: string
}

export type CollectionConfigUpdates = {
  access?: {
    create?: string
    delete?: string
    read?: string
    update?: string
  }
  description?: string
  slug?: string
  timestamps?: boolean
  versioning?: boolean
}

export type AdminConfig = {
  avatar?: string
  css?: string
  dateFormat?: string
  inactivityRoute?: string
  livePreview?: {
    breakpoints?: Array<{
      height: number
      label: string
      name: string
      width: number
    }>
  }
  logoutRoute?: string
  meta?: {
    favicon?: string
    ogImage?: string
    titleSuffix?: string
  }
  user?: string
}

export type DatabaseConfig = {
  connectOptions?: string
  type?: 'mongodb' | 'postgres'
  url?: string
}

export type PluginUpdates = {
  add?: string[]
  remove?: string[]
}

export type GeneralConfig = {
  cookiePrefix?: string
  cors?: string
  csrf?: string
  graphQL?: {
    disable?: boolean
    schemaOutputFile?: string
  }
  rateLimit?: {
    max?: number
    skip?: string
    window?: number
  }
  secret?: string
  serverURL?: string
  typescript?: {
    declare?: boolean
    outputFile?: string
  }
}

export interface SchemaField {
  description?: string
  name: string
  options?: string[]
  required?: boolean
  type: string
}

export interface TaskSequenceItem {
  description?: string
  retries?: number
  taskId: string
  taskSlug: string
  timeout?: number
}

export interface JobConfigUpdate {
  description?: string
  queue?: string
  retries?: number
  timeout?: number
}
```

--------------------------------------------------------------------------------

````
