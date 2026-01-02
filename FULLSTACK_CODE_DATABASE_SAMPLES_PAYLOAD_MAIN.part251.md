---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 251
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 251 of 695)

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

---[FILE: update.ts]---
Location: payload-main/packages/plugin-mcp/src/mcp/tools/resource/update.ts
Signals: Zod

```typescript
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { JSONSchema4 } from 'json-schema'
import type { PayloadRequest, TypedUser } from 'payload'

import { z } from 'zod'

import type { PluginMCPServerConfig } from '../../../types.js'

import { toCamelCase } from '../../../utils/camelCase.js'
import { convertCollectionSchemaToZod } from '../../../utils/convertCollectionSchemaToZod.js'
import { toolSchemas } from '../schemas.js'
export const updateResourceTool = (
  server: McpServer,
  req: PayloadRequest,
  user: TypedUser,
  verboseLogs: boolean,
  collectionSlug: string,
  collections: PluginMCPServerConfig['collections'],
  schema: JSONSchema4,
) => {
  const tool = async (
    data: string,
    id?: number | string,
    where?: string,
    draft: boolean = false,
    depth: number = 0,
    overrideLock: boolean = true,
    filePath?: string,
    overwriteExistingFiles: boolean = false,
    locale?: string,
    fallbackLocale?: string,
  ): Promise<{
    content: Array<{
      text: string
      type: 'text'
    }>
  }> => {
    const payload = req.payload

    if (verboseLogs) {
      payload.logger.info(
        `[payload-mcp] Updating resource in collection: ${collectionSlug}${id ? ` with ID: ${id}` : ' with where clause'}, draft: ${draft}${locale ? `, locale: ${locale}` : ''}`,
      )
    }

    try {
      // Parse the data JSON
      let parsedData: Record<string, unknown>
      try {
        parsedData = JSON.parse(data)
        if (verboseLogs) {
          payload.logger.info(
            `[payload-mcp] Parsed data for ${collectionSlug}: ${JSON.stringify(parsedData)}`,
          )
        }
      } catch (_parseError) {
        payload.logger.error(`[payload-mcp] Invalid JSON data provided: ${data}`)
        const response = {
          content: [{ type: 'text' as const, text: 'Error: Invalid JSON data provided' }],
        }
        return (collections?.[collectionSlug]?.overrideResponse?.(response, {}, req) ||
          response) as {
          content: Array<{
            text: string
            type: 'text'
          }>
        }
      }

      // Validate that either id or where is provided
      if (!id && !where) {
        payload.logger.error('[payload-mcp] Either id or where clause must be provided')
        const response = {
          content: [
            { type: 'text' as const, text: 'Error: Either id or where clause must be provided' },
          ],
        }
        return (collections?.[collectionSlug]?.overrideResponse?.(response, {}, req) ||
          response) as {
          content: Array<{
            text: string
            type: 'text'
          }>
        }
      }

      // Parse where clause if provided
      let whereClause = {}
      if (where) {
        try {
          whereClause = JSON.parse(where)
          if (verboseLogs) {
            payload.logger.info(`[payload-mcp] Using where clause: ${where}`)
          }
        } catch (_parseError) {
          payload.logger.error(`[payload-mcp] Invalid where clause JSON: ${where}`)
          const response = {
            content: [{ type: 'text' as const, text: 'Error: Invalid JSON in where clause' }],
          }
          return (collections?.[collectionSlug]?.overrideResponse?.(response, {}, req) ||
            response) as {
            content: Array<{
              text: string
              type: 'text'
            }>
          }
        }
      }

      // Update by ID or where clause
      if (id) {
        // Single document update
        const updateOptions = {
          id,
          collection: collectionSlug,
          data: parsedData,
          depth,
          draft,
          overrideAccess: false,
          overrideLock,
          req,
          user,
          ...(filePath && { filePath }),
          ...(overwriteExistingFiles && { overwriteExistingFiles }),
          ...(locale && { locale }),
          ...(fallbackLocale && { fallbackLocale }),
        }

        if (verboseLogs) {
          payload.logger.info(`[payload-mcp] Updating single document with ID: ${id}`)
        }
        const result = await payload.update({
          ...updateOptions,
          data: parsedData,
        } as any)

        if (verboseLogs) {
          payload.logger.info(`[payload-mcp] Successfully updated document with ID: ${id}`)
        }

        const response = {
          content: [
            {
              type: 'text' as const,
              text: `Document updated successfully in collection "${collectionSlug}"!
Updated document:
\`\`\`json
${JSON.stringify(result, null, 2)}
\`\`\``,
            },
          ],
        }

        return (collections?.[collectionSlug]?.overrideResponse?.(response, result, req) ||
          response) as {
          content: Array<{
            text: string
            type: 'text'
          }>
        }
      } else {
        // Multiple documents update
        const updateOptions = {
          collection: collectionSlug,
          data: parsedData,
          depth,
          draft,
          overrideAccess: false,
          overrideLock,
          req,
          user,
          where: whereClause,
          ...(filePath && { filePath }),
          ...(overwriteExistingFiles && { overwriteExistingFiles }),
          ...(locale && { locale }),
          ...(fallbackLocale && { fallbackLocale }),
        }

        if (verboseLogs) {
          payload.logger.info(`[payload-mcp] Updating multiple documents with where clause`)
        }
        const result = await payload.update({
          ...updateOptions,
          data: parsedData,
        } as any)

        const bulkResult = result as { docs?: unknown[]; errors?: unknown[] }
        const docs = bulkResult.docs || []
        const errors = bulkResult.errors || []

        if (verboseLogs) {
          payload.logger.info(
            `[payload-mcp] Successfully updated ${docs.length} documents, ${errors.length} errors`,
          )
        }

        let responseText = `Multiple documents updated in collection "${collectionSlug}"!
Updated: ${docs.length} documents
Errors: ${errors.length}
---`

        if (docs.length > 0) {
          responseText += `\n\nUpdated documents:
\`\`\`json
${JSON.stringify(docs, null, 2)}
\`\`\``
        }

        if (errors.length > 0) {
          responseText += `\n\nErrors:
\`\`\`json
${JSON.stringify(errors, null, 2)}
\`\`\``
        }

        const response = {
          content: [
            {
              type: 'text' as const,
              text: responseText,
            },
          ],
        }

        return (collections?.[collectionSlug]?.overrideResponse?.(
          response,
          { docs, errors },
          req,
        ) || response) as {
          content: Array<{
            text: string
            type: 'text'
          }>
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      payload.logger.error(
        `[payload-mcp] Error updating resource in ${collectionSlug}: ${errorMessage}`,
      )

      const response = {
        content: [
          {
            type: 'text' as const,
            text: `Error updating resource in collection "${collectionSlug}": ${errorMessage}`,
          },
        ],
      }

      return (collections?.[collectionSlug]?.overrideResponse?.(response, {}, req) || response) as {
        content: Array<{
          text: string
          type: 'text'
        }>
      }
    }
  }

  if (collections?.[collectionSlug]?.enabled) {
    const convertedFields = convertCollectionSchemaToZod(schema)

    // Create a new schema that combines the converted fields with update-specific parameters
    // Use .partial() to make all fields optional for partial updates
    const updateResourceSchema = z.object({
      ...convertedFields.partial().shape,
      id: z.union([z.string(), z.number()]).optional().describe('The ID of the document to update'),
      depth: z
        .number()
        .optional()
        .default(0)
        .describe('How many levels deep to populate relationships'),
      draft: z
        .boolean()
        .optional()
        .default(false)
        .describe('Whether to update the document as a draft'),
      fallbackLocale: z
        .string()
        .optional()
        .describe('Optional: fallback locale code to use when requested locale is not available'),
      filePath: z.string().optional().describe('File path for file uploads'),
      locale: z
        .string()
        .optional()
        .describe(
          'Optional: locale code to update the document in (e.g., "en", "es"). Defaults to the default locale',
        ),
      overrideLock: z
        .boolean()
        .optional()
        .default(true)
        .describe('Whether to override document locks'),
      overwriteExistingFiles: z
        .boolean()
        .optional()
        .default(false)
        .describe('Whether to overwrite existing files'),
      where: z
        .string()
        .optional()
        .describe('JSON string for where clause to update multiple documents'),
    })

    server.tool(
      `update${collectionSlug.charAt(0).toUpperCase() + toCamelCase(collectionSlug).slice(1)}`,
      `${collections?.[collectionSlug]?.description || toolSchemas.updateResource.description.trim()}`,
      updateResourceSchema.shape,
      async (params: Record<string, unknown>) => {
        const {
          id,
          depth,
          draft,
          fallbackLocale,
          filePath,
          locale,
          overrideLock,
          overwriteExistingFiles,
          where,
          ...fieldData
        } = params
        // Convert field data back to JSON string format expected by the tool
        const data = JSON.stringify(fieldData)
        return await tool(
          data,
          id as number | string | undefined,
          where as string | undefined,
          draft as boolean,
          depth as number,
          overrideLock as boolean,
          filePath as string | undefined,
          overwriteExistingFiles as boolean,
          locale as string | undefined,
          fallbackLocale as string | undefined,
        )
      },
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: camelCase.ts]---
Location: payload-main/packages/plugin-mcp/src/utils/camelCase.ts

```typescript
/**
 * Converts a string to camel case by replacing dashes, underscores, and spaces
 * with camel case formatting.
 *
 * @param str - The string to convert to camel case
 * @returns The camel cased string
 */
export const toCamelCase = (str: string): string => {
  return str
    .replace(/[-_\s]+(.)?/g, (_, chr) => (chr ? chr.toUpperCase() : ''))
    .replace(/^(.)/, (_, chr) => chr.toLowerCase())
}
```

--------------------------------------------------------------------------------

---[FILE: convertCollectionSchemaToZod.ts]---
Location: payload-main/packages/plugin-mcp/src/utils/convertCollectionSchemaToZod.ts
Signals: Zod

```typescript
import type { JSONSchema4 } from 'json-schema'

import { jsonSchemaToZod } from 'json-schema-to-zod'
import * as ts from 'typescript'
import { z } from 'zod'

export const convertCollectionSchemaToZod = (schema: JSONSchema4) => {
  // Remove properties that should not be included in the Zod schema
  delete schema?.properties?.createdAt
  delete schema?.properties?.updatedAt

  const zodSchemaAsString = jsonSchemaToZod(schema)

  // Transpile TypeScript to JavaScript
  const transpileResult = ts.transpileModule(zodSchemaAsString, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      removeComments: true,
      strict: false,
      target: ts.ScriptTarget.ES2018,
    },
  })

  /**
   * This Function evaluation is safe because:
   * 1. The input schema comes from Payload's collection configuration, which is controlled by the application developer
   * 2. The jsonSchemaToZod library converts JSON Schema to Zod schema definitions, producing only type validation code
   * 3. The transpiled output contains only Zod schema definitions (z.string(), z.number(), etc.) - no executable logic
   * 4. The resulting Zod schema is used only for parameter validation in MCP tools, not for data processing
   * 5. No user input or external data is involved in the schema generation process
   */
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  return new Function('z', `return ${transpileResult.outputText}`)(z)
}
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/packages/plugin-multi-tenant/.gitignore

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
Location: payload-main/packages/plugin-multi-tenant/.prettierignore

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
Location: payload-main/packages/plugin-multi-tenant/.swcrc

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
Location: payload-main/packages/plugin-multi-tenant/LICENSE.md

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
Location: payload-main/packages/plugin-multi-tenant/package.json
Signals: React, Next.js

```json
{
  "name": "@payloadcms/plugin-multi-tenant",
  "version": "3.68.5",
  "description": "Multi Tenant plugin for Payload",
  "keywords": [
    "payload",
    "cms",
    "plugin",
    "typescript",
    "react",
    "multi-tenant",
    "nextjs"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/payloadcms/payload.git",
    "directory": "packages/plugin-multi-tenant"
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
      "import": "./src/index.ts",
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    },
    "./fields": {
      "import": "./src/exports/fields.ts",
      "types": "./src/exports/fields.ts",
      "default": "./src/exports/fields.ts"
    },
    "./types": {
      "import": "./src/exports/types.ts",
      "types": "./src/exports/types.ts",
      "default": "./src/exports/types.ts"
    },
    "./rsc": {
      "import": "./src/exports/rsc.ts",
      "types": "./src/exports/rsc.ts",
      "default": "./src/exports/rsc.ts"
    },
    "./client": {
      "import": "./src/exports/client.ts",
      "types": "./src/exports/client.ts",
      "default": "./src/exports/client.ts"
    },
    "./utilities": {
      "import": "./src/exports/utilities.ts",
      "types": "./src/exports/utilities.ts",
      "default": "./src/exports/utilities.ts"
    },
    "./translations/languages/all": {
      "import": "./src/translations/index.ts",
      "types": "./src/translations/index.ts",
      "default": "./src/translations/index.ts"
    },
    "./translations/languages/*": {
      "import": "./src/translations/languages/*.ts",
      "types": "./src/translations/languages/*.ts",
      "default": "./src/translations/languages/*.ts"
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
    "clean": "rimraf {dist,*.tsbuildinfo}",
    "copyfiles": "copyfiles -u 1 \"src/**/*.{html,css,scss,ttf,woff,woff2,eot,svg,jpg,png,json}\" dist/",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "pack:plugin": "pnpm build && pnpm pack"
  },
  "devDependencies": {
    "@payloadcms/eslint-config": "workspace:*",
    "@payloadcms/translations": "workspace:*",
    "@payloadcms/ui": "workspace:*",
    "payload": "workspace:*"
  },
  "peerDependencies": {
    "@payloadcms/ui": "workspace:*",
    "payload": "workspace:*"
  },
  "publishConfig": {
    "exports": {
      ".": {
        "import": "./dist/index.js",
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "./fields": {
        "import": "./dist/exports/fields.js",
        "types": "./dist/exports/fields.d.ts",
        "default": "./dist/exports/fields.js"
      },
      "./types": {
        "import": "./dist/exports/types.js",
        "types": "./dist/exports/types.d.ts",
        "default": "./dist/exports/types.js"
      },
      "./rsc": {
        "import": "./dist/exports/rsc.js",
        "types": "./dist/exports/rsc.d.ts",
        "default": "./dist/exports/rsc.js"
      },
      "./client": {
        "import": "./dist/exports/client.js",
        "types": "./dist/exports/client.d.ts",
        "default": "./dist/exports/client.js"
      },
      "./utilities": {
        "import": "./dist/exports/utilities.js",
        "types": "./dist/exports/utilities.d.ts",
        "default": "./dist/exports/utilities.js"
      },
      "./translations/languages/all": {
        "import": "./dist/translations/index.js",
        "types": "./dist/translations/index.d.ts",
        "default": "./dist/translations/index.js"
      },
      "./translations/languages/*": {
        "import": "./dist/translations/languages/*.js",
        "types": "./dist/translations/languages/*.d.ts",
        "default": "./dist/translations/languages/*.js"
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
Location: payload-main/packages/plugin-multi-tenant/README.md

```text
# Multi Tenant Plugin

A plugin for [Payload](https://github.com/payloadcms/payload) to easily manage multiple tenants from within your admin panel.

- [Source code](https://github.com/payloadcms/payload/tree/main/packages/plugin-multi-tenant)
- [Documentation](https://payloadcms.com/docs/plugins/multi-tenant)
- [Documentation source](https://github.com/payloadcms/payload/tree/main/docs/plugins/multi-tenant.mdx)

## Installation

```bash
pnpm add @payloadcms/plugin-multi-tenant
```

## Plugin Types

```ts
type MultiTenantPluginConfig<ConfigTypes = unknown> = {
  /**
   * After a tenant is deleted, the plugin will attempt to clean up related documents
   * - removing documents with the tenant ID
   * - removing the tenant from users
   *
   * @default true
   */
  cleanupAfterTenantDelete?: boolean
  /**
   * Automatically
   */
  collections: {
    [key in CollectionSlug]?: {
      /**
       * Set to `true` if you want the collection to behave as a global
       *
       * @default false
       */
      isGlobal?: boolean
      /**
       * Set to `false` if you want to manually apply the baseFilter
       *
       * @default true
       */
      useBaseFilter?: boolean
      /**
       * Set to `false` if you want to handle collection access manually without the multi-tenant constraints applied
       *
       * @default true
       */
      useTenantAccess?: boolean
    }
  }
  /**
   * Enables debug mode
   * - Makes the tenant field visible in the admin UI within applicable collections
   *
   * @default false
   */
  debug?: boolean
  /**
   * Enables the multi-tenant plugin
   *
   * @default true
   */
  enabled?: boolean
  /**
   * Field configuration for the field added to all tenant enabled collections
   */
  tenantField?: {
    access?: RelationshipField['access']
    /**
     * The name of the field added to all tenant enabled collections
     *
     * @default 'tenant'
     */
    name?: string
  }
  /**
   * Field configuration for the field added to the users collection
   *
   * If `includeDefaultField` is `false`, you must include the field on your users collection manually
   * This is useful if you want to customize the field or place the field in a specific location
   */
  tenantsArrayField?:
    | {
        /**
         * Access configuration for the array field
         */
        arrayFieldAccess?: ArrayField['access']
        /**
         * Name of the array field
         *
         * @default 'tenants'
         */
        arrayFieldName?: string
        /**
         * Name of the tenant field
         *
         * @default 'tenant'
         */
        arrayTenantFieldName?: string
        /**
         * When `includeDefaultField` is `true`, the field will be added to the users collection automatically
         */
        includeDefaultField?: true
        /**
         * Additional fields to include on the tenants array field
         */
        rowFields?: Field[]
        /**
         * Access configuration for the tenant field
         */
        tenantFieldAccess?: RelationshipField['access']
      }
    | {
        arrayFieldAccess?: never
        arrayFieldName?: string
        arrayTenantFieldName?: string
        /**
         * When `includeDefaultField` is `false`, you must include the field on your users collection manually
         */
        includeDefaultField?: false
        rowFields?: never
        tenantFieldAccess?: never
      }
  /**
   * Customize tenant selector label
   *
   * Either a string or an object where the keys are i18n codes and the values are the string labels
   */
  tenantSelectorLabel?:
    | Partial<{
        [key in AcceptedLanguages]?: string
      }>
    | string
  /**
   * The slug for the tenant collection
   *
   * @default 'tenants'
   */
  tenantsSlug?: string
  /**
   * Function that determines if a user has access to _all_ tenants
   *
   * Useful for super-admin type users
   */
  userHasAccessToAllTenants?: (
    user: ConfigTypes extends { user: unknown } ? ConfigTypes['user'] : User,
  ) => boolean
  /**
   * Opt out of adding access constraints to the tenants collection
   */
  useTenantsCollectionAccess?: boolean
  /**
   * Opt out including the baseListFilter to filter tenants by selected tenant
   */
  useTenantsListFilter?: boolean
  /**
   * Opt out including the baseListFilter to filter users by selected tenant
   */
  useUsersTenantFilter?: boolean
}
```

### How to configure Collections as Globals for multi-tenant

When using multi-tenant, globals need to actually be configured as collections so the content can be specific per tenant.
To do that, you can mark a collection with `isGlobal` and it will behave like a global and users will not see the list view.

```ts
multiTenantPlugin({
  collections: {
    navigation: {
      isGlobal: true,
    },
  },
})
```

### Customizing access control

In some cases, the access control supplied out of the box may be too strict. For example, if you need _some_ documents to be shared between tenants, you will need to opt out of the supplied access control functionality.

By default this plugin merges your access control result with a constraint based on tenants the user has access to within an _AND_ condition. That would not work for the above scenario.

In the multi-tenant plugin config you can set `useTenantAccess` to false:

```ts
// File: payload.config.ts

import { buildConfig } from 'payload'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { getTenantAccess } from '@payloadcms/plugin-multi-tenant/utilities'
import { Config as ConfigTypes } from './payload-types'

// Add the plugin to your payload config
export default buildConfig({
  plugins: [
    multiTenantPlugin<ConfigTypes>({
      collections: {
        media: {
          useTenantAccess: false,
        },
      },
    }),
  ],
  collections: [
    {
      slug: 'media',
      fields: [
        {
          name: 'isShared',
          type: 'checkbox',
          defaultValue: false,
          // you likely want to set access control on fields like this
          // to prevent just any user from modifying it
        },
      ],
      access: {
        read: ({ req, doc }) => {
          if (!req.user) return false

          const whereConstraint = {
            or: [
              {
                isShared: {
                  equals: true,
                },
              },
            ],
          }

          const tenantAccessResult = getTenantAccess({ user: req.user })

          if (tenantAccessResult) {
            whereConstraint.or.push(tenantAccessResult)
          }

          return whereConstraint
        },
      },
    },
  ],
})
```

### Placing the tenants array field

In your users collection you may want to place the field in a tab or in the sidebar, or customize some of the properties on it.

You can use the `tenantsArrayField.includeDefaultField: false` setting in the plugin config. You will then need to manually add a `tenants` array field in your users collection.

This field cannot be nested inside a named field, ie a group, named-tab or array. It _can_ be nested inside a row, unnamed-tab, collapsible.

To make it easier, this plugin exports the field for you to import and merge in your own properties.

```ts
import type { CollectionConfig } from 'payload'
import { tenantsArrayField } from '@payloadcms/plugin-multi-tenant/fields'

const customTenantsArrayField = tenantsArrayField({
  arrayFieldAccess: {}, // access control for the array field
  tenantFieldAccess: {}, // access control for the tenants field on the array row
  rowFields: [], // additional row fields
})

export const UsersCollection: CollectionConfig = {
  slug: 'users',
  fields: [
    {
      ...customTenantsArrayField,
      label: 'Associated Tenants',
    },
  ],
}
```
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/packages/plugin-multi-tenant/tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "references": [{ "path": "../payload" }, { "path": "../ui"}, { "path": "../translations"}]
}
```

--------------------------------------------------------------------------------

---[FILE: defaults.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/defaults.ts

```typescript
export const defaults = {
  basePath: undefined,
  tenantCollectionSlug: 'tenants',
  tenantFieldName: 'tenant',
  tenantsArrayFieldName: 'tenants',
  tenantsArrayTenantFieldName: 'tenant',
  tenantSelectorLabel: 'Tenant',
}
```

--------------------------------------------------------------------------------

````
