---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 53
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 53 of 695)

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

---[FILE: mcp.mdx]---
Location: payload-main/docs/plugins/mcp.mdx

```text
---
title: MCP Plugin
label: MCP
order: 49
desc: MCP (Model Context Protocol) capabilities with Payload
keywords: plugins, mcp, ai, model context protocol, plugin, payload, cms
---

![https://www.npmjs.com/package/@payloadcms/plugin-mcp](https://img.shields.io/npm/v/@payloadcms/plugin-mcp)

<Banner type="warning">
  This plugin is currently in Beta and may have breaking changes in future
  releases.
</Banner>

This plugin adds [Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro) capabilities.

<Banner type="info">
  This plugin is completely open-source and the [source code can be found
  here](https://github.com/payloadcms/payload/tree/main/packages/plugin-mcp). If
  you need help, check out our [Community
  Help](https://payloadcms.com/community-help). If you think you've found a bug,
  please [open a new
  issue](https://github.com/payloadcms/payload/issues/new?assignees=&labels=plugin%3A%mcp&template=bug_report.md&title=plugin-mcp%3A)
  with as much detail as possible.
</Banner>

## Core features

- Adds a collection to your config where:
  - You can allow / disallow `find`, `create`, `update`, and `delete` operations for each collection
  - You can to allow / disallow capabilities in real time
  - You can define your own Prompts, Tools and Resources available over MCP

## Installation

Install the plugin using any JavaScript package manager like [pnpm](https://pnpm.io), [npm](https://npmjs.com), or [Yarn](https://yarnpkg.com):

```bash
  pnpm add @payloadcms/plugin-mcp
```

## Basic Usage

In the `plugins` array of your [Payload Config](https://payloadcms.com/docs/configuration/overview), call the plugin with [options](#options):

```ts
import { buildConfig } from 'payload'
import { mcpPlugin } from '@payloadcms/plugin-mcp'

const config = buildConfig({
  collections: [
    {
      slug: 'posts',
      fields: [],
    },
  ],
  plugins: [
    mcpPlugin({
      collections: {
        posts: {
          enabled: true,
        },
      },
    }),
  ],
})

export default config
```

### Options

| Option                                 | Type                | Description                                                                                    |
| -------------------------------------- | ------------------- | ---------------------------------------------------------------------------------------------- |
| `collections`                          | `object`            | An object of collection slugs to use for MCP capabilities.                                     |
| `collections[slug]`                    | `object`            | An object of collection slugs to use for MCP capabilities.                                     |
| `collections[slug].description`        | `string`            | A description for the collection.                                                              |
| `collections[slug].overrideResponse`   | `function`          | A function that allows you to override the response from the operation tool call               |
| `collections[slug].enabled`            | `object or boolean` | Determines whether the model can find, create, update, and delete documents in the collection. |
| `collections[slug].enabled.find`       | `boolean`           | Whether to allow the model to find documents in the collection.                                |
| `collections[slug].enabled.create`     | `boolean`           | Whether to allow the model to create documents in the collection.                              |
| `collections[slug].enabled.update`     | `boolean`           | Whether to allow the model to update documents in the collection.                              |
| `collections[slug].enabled.delete`     | `boolean`           | Whether to allow the model to delete documents in the collection.                              |
| `disabled`                             | `boolean`           | Disable the MCP plugin while keeping database schema consistent.                               |
| `overrideApiKeyCollection`             | `function`          | A function that allows you to override the automatically generated API Keys collection.        |
| `mcp`                                  | `object`            | MCP options that allow you to customize the MCP server.                                        |
| `mcp.tools`                            | `array`             | An array of tools to add to the MCP server.                                                    |
| `mcp.tools.name`                       | `string`            | The name of the tool.                                                                          |
| `mcp.tools.description`                | `string`            | The description of the tool.                                                                   |
| `mcp.tools.handler`                    | `function`          | The handler function for the tool.                                                             |
| `mcp.tools.parameters`                 | `object`            | The parameters for the tool (Zod schema).                                                      |
| `mcp.prompts`                          | `array`             | An array of prompts to add to the MCP server.                                                  |
| `mcp.prompts.name`                     | `string`            | The name of the prompt.                                                                        |
| `mcp.prompts.title`                    | `string`            | The title of the prompt (used by models to determine when to use it).                          |
| `mcp.prompts.description`              | `string`            | The description of the prompt.                                                                 |
| `mcp.prompts.handler`                  | `function`          | The handler function for the prompt.                                                           |
| `mcp.prompts.argsSchema`               | `object`            | The arguments schema for the prompt (Zod schema).                                              |
| `mcp.resources`                        | `array`             | An array of resources to add to the MCP server.                                                |
| `mcp.resources.name`                   | `string`            | The name of the resource.                                                                      |
| `mcp.resources.title`                  | `string`            | The title of the resource (used by models to determine when to use it).                        |
| `mcp.resources.description`            | `string`            | The description of the resource.                                                               |
| `mcp.resources.handler`                | `function`          | The handler function for the resource.                                                         |
| `mcp.resources.uri`                    | `string or object`  | The URI of the resource (can be a string or ResourceTemplate for dynamic URIs).                |
| `mcp.resources.mimeType`               | `string`            | The MIME type of the resource.                                                                 |
| `mcp.handlerOptions`                   | `object`            | The handler options for the MCP server.                                                        |
| `mcp.handlerOptions.basePath`          | `string`            | The base path for the MCP server (default: '/api').                                            |
| `mcp.handlerOptions.verboseLogs`       | `boolean`           | Whether to log verbose logs to the console (default: false).                                   |
| `mcp.handlerOptions.maxDuration`       | `number`            | The maximum duration for the MCP server requests (default: 60).                                |
| `mcp.serverOptions`                    | `object`            | The server options for the MCP server.                                                         |
| `mcp.serverOptions.serverInfo`         | `object`            | The server info for the MCP server.                                                            |
| `mcp.serverOptions.serverInfo.name`    | `string`            | The name of the MCP server (default: 'Payload MCP Server').                                    |
| `mcp.serverOptions.serverInfo.version` | `string`            | The version of the MCP server (default: '1.0.0').                                              |

## Connecting to MCP Clients

After installing and configuring the plugin, you can connect apps with MCP client capabilities to Payload.

### Step 1: Create an API Key

1. Start your Payload server
2. Navigate to your admin panel at `http://localhost:3000/admin`
3. Go to the **MCP → API Keys** collection
4. Click **Create New**
5. Allow or Disallow MCP traffic permissions for each collection (enable find, create, update, delete as needed)
6. Click **Create** and copy the uniquely generated API key

### Step 2: Configure Your MCP Client

MCP Clients can be configured to interact with your MCP server.
These clients require some JSON configuration, or platform configuration in order to know how to reach your MCP server.

<Banner type="warning">
  Caution: the format of these JSON files may change over time. Please check the
  client website for updates.
</Banner>

Our recommended approach to make your server available for most MCP clients is to use the [mcp-remote](https://www.npmjs.com/package/mcp-remote) package via `npx`.

Below are configuration examples for popular MCP clients.

#### [VSCode](https://code.visualstudio.com/docs/copilot/customization/mcp-servers)

```json
{
  "mcp.servers": {
    "Payload": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "http://127.0.0.1:3000/api/mcp",
        "--header",
        "Authorization: Bearer API-KEY-HERE"
      ]
    }
  }
}
```

#### [Cursor](https://cursor.com/docs/context/mcp)

```json
{
  "mcpServers": {
    "Payload": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "http://localhost:3000/api/mcp",
        "--header",
        "Authorization: Bearer API-KEY-HERE"
      ]
    }
  }
}
```

#### Other MCP Clients

For connections without using `mcp-remote` you can use this configuration format:

```json
{
  "mcpServers": {
    "Payload": {
      "type": "http",
      "url": "http://localhost:3000/api/mcp",
      "headers": {
        "Authorization": "Bearer API-KEY-HERE"
      }
    }
  }
}
```

## Customizations

The plugin supports fully custom `prompts`, `tools` and `resources` that can be called or retrieved by MCP clients.
After defining a custom method you can allow / disallow the feature from the admin panel by adjusting the `API Key` MCP Options checklist.

## Prompts

Prompts allow models to generate structured messages for specific tasks. Each prompt defines a schema for arguments and returns formatted messages:

```ts
prompts: [
  {
    name: 'reviewContent',
    title: 'Content Review Prompt',
    description: 'Creates a prompt for reviewing content quality',
    argsSchema: {
      content: z.string().describe('The content to review'),
      criteria: z.array(z.string()).describe('Review criteria'),
    },
    handler: ({ content, criteria }, req) => ({
      messages: [
        {
          content: {
            type: 'text',
            text: `Please review this content based on the following criteria: ${criteria.join(', ')}\n\nContent: ${content}`,
          },
          role: 'user',
        },
      ],
    }),
  },
]
```

## Resources

Resources provide access to data or content that models can read. They can be static or dynamic with parameterized URIs:

```ts
resources: [
  // Static resource
  {
    name: 'guidelines',
    title: 'Content Guidelines',
    description: 'Company content creation guidelines',
    uri: 'guidelines://company',
    mimeType: 'text/markdown',
    handler: (uri, req) => ({
    handler: (uri, req) => ({
      contents: [
        {
          uri: uri.href,
          text: '# Content Guidelines\n\n1. Keep it concise\n2. Use clear language',
        },
      ],
    }),
  },

  // Dynamic resource with template
  {
    name: 'userProfile',
    title: 'User Profile',
    description: 'Access user profile information',
    uri: new ResourceTemplate('users://profile/{userId}', { list: undefined }),
    mimeType: 'application/json',
    handler: async (uri, { userId }, req) => {
      // Fetch user data from your system
      const userData = await getUserById(userId)
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify(userData, null, 2),
          },
        ],
      }
    },
  },
]
```

## Tools

Tools allow you to extend MCP capabilities beyond basic CRUD operations. Use them when you need to perform complex queries, aggregations, or business logic that isn't covered by the standard collection operations.

```ts
tools: [
  {
    name: 'getPostScores',
    description: 'Get useful scores about content in posts',
    handler: async (args, req) => {
      const { payload } = req
      const stats = await payload.find({
        collection: 'posts',
        where: {
          createdAt: {
            greater_than: args.since,
          },
        },
        req,
        overrideAccess: false,
        user: req.user,
      })

      return {
        content: [
          {
            type: 'text',
            text: `Found ${stats.totalDocs} posts created since ${args.since}`,
          },
        ],
      }
    },
    parameters: z.object({
      since: z.string().describe('ISO date string for filtering posts'),
    }).shape,
  },
]
```

## API Key access to MCP

Payload adds an API key collection that allows admins to manage MCP capabilities. Admins can:

- Create user associated API keys for MCP clients
- `Allow` or `disallow` endpoint traffic in real-time
- `Allow` or `disallow` tools, resources, and prompts

You can customize the API Key collection using the `overrideApiKeyCollection` option:

```ts
mcpPlugin({
  overrideApiKeyCollection: (collection) => {
    // Add fields to the API Keys collection
    collection.fields.push({
      name: 'department',
      type: 'select',
      options: [
        { label: 'Development', value: 'dev' },
        { label: 'Marketing', value: 'marketing' },
      ],
    })

    // You can also add hooks
    collection.hooks?.beforeRead?.push(({ doc, req }) => {
      req.payload.logger.info('Before Read MCP hook!')
      return doc
    })
    return collection
  },
  // ... other options
})
```

You can create an MCP access strategy using the `overrideAuth` option:

```ts
import { type MCPAccessSettings, mcpPlugin } from '@payloadcms/plugin-mcp'

// ... other config

mcpPlugin({
  overrideAuth: (req, getDefaultMcpAccessSettings) => {
    const { payload } = req

    // This will return the default MCPAccessSettings
    // getDefaultMcpAccessSettings()

    payload.logger.info('Custom access Settings for all MCP traffic')
    return {
      posts: {
        find: true,
      },
      products: {
        find: true,
      },
    } as MCPAccessSettings
  },
  // ... other options
})
```

If you want the default `MCPAccessSettings`, you can use the addtional argument `getDefaultMcpAccessSettings`.
This will use the Bearer token found in the headers on the req to return the `MCPAccessSettings` related to the user assigned to the API key.

## Hooks

To understand or modify data returned by models at runtime use a collection [Hook](https://payloadcms.com/docs/hooks/collections). Within a hook you can look up the API context. If the context is `MCP` that collection was triggered by the MCP Plugin. This does not apply to custom tools or resources that have their own context, and can make unrelated database calls.

In this example, Post titles are modified to include '(MCP Hook Override)' when they are read using MCP.

```ts
import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'The title of the post',
      },
      required: true,
    },

    // ... other fields
  ],
  hooks: {
    beforeRead: [
      ({ doc, req }) => {
        if (req.payloadAPI === 'MCP') {
          doc.title = `${doc.title} (MCP Hook Override)`
        }
        return doc
      },
    ],
  },
}
```

## Performance

The description you choose to use for your collection greatly impacts the way a model will decide to use it.

The description in this example is more difficult for a model to understand it's purpose.

```ts
// Weak
const config = buildConfig({
  // ...
  plugins: [
    mcpPlugin({
      collections: {
        posts: {
          enabled: true,
          description: 'My posts',
        },
      },
    }),
  ],
})
```

The description in this example gives a model a stronger ability to know when to use this collection.

```ts
// Strong
const config = buildConfig({
  // ...
  plugins: [
    mcpPlugin({
      collections: {
        posts: {
          enabled: true,
          description: 'Posts with content about science and nature',
        },
      },
    }),
  ],
})
```
```

--------------------------------------------------------------------------------

---[FILE: multi-tenant.mdx]---
Location: payload-main/docs/plugins/multi-tenant.mdx

```text
---
title: Multi-Tenant Plugin
label: Multi-Tenant
order: 50
desc: Scaffolds multi-tenancy for your Payload application
keywords: plugins, multi-tenant, multi-tenancy, plugin, payload, cms, seo, indexing, search, search engine
---

![https://www.npmjs.com/package/@payloadcms/plugin-multi-tenant](https://img.shields.io/npm/v/@payloadcms/plugin-multi-tenant)

This plugin sets up multi-tenancy for your application from within your [Admin Panel](../admin/overview). It does so by adding a `tenant` field to all specified collections. Your front-end application can then query data by tenant. You must add the Tenants collection so you control what fields are available for each tenant.

<Banner type="info">
  This plugin is completely open-source and the [source code can be found
  here](https://github.com/payloadcms/payload/tree/main/packages/plugin-multi-tenant).
  If you need help, check out our [Community
  Help](https://payloadcms.com/community-help). If you think you've found a bug,
  please [open a new
  issue](https://github.com/payloadcms/payload/issues/new/choose) with as much
  detail as possible.
</Banner>

## Core features

- Adds a `tenant` field to each specified collection
- Adds a tenant selector to the admin panel, allowing you to switch between tenants
- Filters list view results by selected tenant
- Filters relationship fields by selected tenant
- Ability to create "global" like collections, 1 doc per tenant
- Automatically assign a tenant to new documents

<Banner type="error">
  **Warning**

By default this plugin cleans up documents when a tenant is deleted. You should ensure you have
strong access control on your tenants collection to prevent deletions by unauthorized users.

You can disable this behavior by setting `cleanupAfterTenantDelete` to `false` in the plugin options.

</Banner>

## Installation

Install the plugin using any JavaScript package manager like [pnpm](https://pnpm.io), [npm](https://npmjs.com), or [Yarn](https://yarnpkg.com):

```bash
  pnpm add @payloadcms/plugin-multi-tenant
```

### Options

The plugin accepts an object with the following properties:

```ts
type MultiTenantPluginConfig<ConfigTypes = unknown> = {
  /**
   * Base path for your application
   *
   * https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath
   *
   * @default undefined
   */
  basePath?: string
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
       * Override the access result from the collection access control functions
       *
       * The function receives:
       *  - accessResult: the original result from the access control function
       *  - accessKey: 'read', 'create', 'update', 'delete', 'readVersions', or 'unlock'
       *  - ...restOfAccessArgs: the original arguments passed to the access control function
       */
      accessResultOverride?: CollectionAccessResultOverride
      /**
       * Opt out of adding the tenant field and place
       * it manually using the `tenantField` export from the plugin
       */
      customTenantField?: boolean
      /**
       * Set to `true` if you want the collection to behave as a global
       *
       * @default false
       */
      isGlobal?: boolean
      /**
       * Overrides for the tenant field, will override the entire tenantField configuration
       */
      tenantFieldOverrides?: CollectionTenantFieldConfigOverrides
      /**
       * Set to `false` if you want to manually apply the baseListFilter
       * Set to `false` if you want to manually apply the baseFilter
       *
       * @default true
       */
      useBaseFilter?: boolean
      /**
       * @deprecated Use `useBaseFilter` instead. If both are defined,
       * `useBaseFilter` will take precedence. This property remains only
       * for backward compatibility and may be removed in a future version.
       *
       * Originally, `baseListFilter` was intended to filter only the List View
       * in the admin panel. However, base filtering is often required in other areas
       * such as internal link relationships in the Lexical editor.
       *
       * @default true
       */
      useBaseListFilter?: boolean
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
   * Localization for the plugin
   */
  i18n?: {
    translations: {
      [key in AcceptedLanguages]?: {
        /**
         * Shown inside 3 dot menu on edit document view
         *
         * @default 'Assign Tenant'
         */
        'assign-tenant-button-label'?: string
        /**
         * Shown as the title of the assign tenant modal
         *
         * @default 'Assign "{{title}}"'
         */
        'assign-tenant-modal-title'?: string
        /**
         * Shown as the label for the assigned tenant field in the assign tenant modal
         *
         * @default 'Assigned Tenant'
         */
        'field-assignedTenant-label'?: string
        /**
         * Shown as the label for the global tenant selector in the admin UI
         *
         * @default 'Filter by Tenant'
         */
        'nav-tenantSelector-label'?: string
      }
    }
  }
  /**
   * Field configuration for the field added to all tenant enabled collections
   */
  tenantField?: RootTenantFieldConfigOverrides
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
   *
   * @deprecated Use `i18n.translations` instead.
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
    user: ConfigTypes extends { user: unknown }
      ? ConfigTypes['user']
      : TypedUser,
  ) => boolean
  /**
   * Override the access result on the users collection access control functions
   *
   * The function receives:
   *  - accessResult: the original result from the access control function
   *  - accessKey: 'read', 'create', 'update', 'delete', 'readVersions', or 'unlock'
   *  - ...restOfAccessArgs: the original arguments passed to the access control function
   */
  usersAccessResultOverride?: CollectionAccessResultOverride
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

## Basic Usage

In the `plugins` array of your [Payload Config](https://payloadcms.com/docs/configuration/overview), call the plugin with [options](#options):

```ts
import { buildConfig } from 'payload'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import type { Config } from './payload-types'

const config = buildConfig({
  collections: [
    {
      slug: 'tenants',
      admin: {
        useAsTitle: 'name',
      },
      fields: [
        // remember, you own these fields
        // these are merely suggestions/examples
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
        },
        {
          name: 'domain',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
  plugins: [
    multiTenantPlugin<Config>({
      collections: {
        pages: {},
        navigation: {
          isGlobal: true,
        },
      },
    }),
  ],
})

export default config
```

## Front end usage

The plugin scaffolds out everything you will need to separate data by tenant. You can use the `tenant` field to filter data from enabled collections in your front-end application.

In your frontend you can query and constrain data by tenant with the following:

```tsx
const pagesBySlug = await payload.find({
  collection: 'pages',
  depth: 1,
  draft: false,
  limit: 1000,
  overrideAccess: false,
  where: {
    // your constraint would depend on the
    // fields you added to the tenants collection
    // here we are assuming a slug field exists
    // on the tenant collection, like in the example above
    'tenant.slug': {
      equals: 'gold',
    },
  },
})
```

### NextJS rewrites

Using NextJS rewrites and this route structure `/[tenantDomain]/[slug]`, we can rewrite routes specifically for domains requested:

```ts
async rewrites() {
  return [
    {
      source: '/((?!admin|api)):path*',
      destination: '/:tenantDomain/:path*',
      has: [
        {
          type: 'host',
          value: '(?<tenantDomain>.*)',
        },
      ],
    },
  ];
}
```

### React Hooks

Below are the hooks exported from the plugin that you can import into your own custom components to consume.

#### useTenantSelection

You can import this like so:

```tsx
import { useTenantSelection } from '@payloadcms/plugin-multi-tenant/client'

...

const tenantContext = useTenantSelection()
```

The hook returns the following context:

```ts
type ContextType = {
  /**
   * Array of options to select from
   */
  options: OptionObject[]
  /**
   * The currently selected tenant ID
   */
  selectedTenantID: number | string | undefined
  /**
   * Prevents a refresh when the tenant is changed
   *
   * If not switching tenants while viewing a "global",
   * set to true
   */
  setPreventRefreshOnChange: React.Dispatch<React.SetStateAction<boolean>>
  /**
   * Sets the selected tenant ID
   *
   * @param args.id - The ID of the tenant to select
   * @param args.refresh - Whether to refresh the page
   * after changing the tenant
   */
  setTenant: (args: {
    id: number | string | undefined
    refresh?: boolean
  }) => void
}
```

## Examples

The [Examples Directory](https://github.com/payloadcms/payload/tree/main/examples) also contains an official [Multi-Tenant](https://github.com/payloadcms/payload/tree/main/examples/multi-tenant) example.
```

--------------------------------------------------------------------------------

---[FILE: nested-docs.mdx]---
Location: payload-main/docs/plugins/nested-docs.mdx

```text
---
title: Nested Docs Plugin
label: Nested Docs
order: 60
desc: Nested documents in a parent, child, and sibling relationship.
keywords: plugins, nested, documents, parent, child, sibling, relationship
---

![https://www.npmjs.com/package/@payloadcms/plugin-nested-docs](https://img.shields.io/npm/v/@payloadcms/plugin-nested-docs)

This plugin allows you to easily nest the documents of your application inside of one another. It does so by adding a
new `parent` field onto each of your documents that, when selected, attaches itself to the parent's tree. When you edit
the great-great-grandparent of a document, for instance, all of its descendants are recursively updated. This is an
extremely powerful way of achieving hierarchy within a collection, such as parent/child relationship between pages.

Documents also receive a new `breadcrumbs` field. Once a parent is assigned, these breadcrumbs are populated based on
each ancestor up the tree. Breadcrumbs allow you to dynamically generate labels and URLs based on the document's
position in the hierarchy. Even if the slug of a parent document changes, or the entire tree is nested another level
deep, changes will cascade down the entire tree and all breadcrumbs will reflect those changes.

With this pattern you can perform whatever side-effects your applications needs on even the most deeply nested
documents. For example, you could easily add a custom `fullTitle` field onto each document and inject the parent's title
onto it, such as "Parent Title > Child Title". This would allow you to then perform searches and filters based on _that_
field instead of the original title. This is especially useful if you happen to have two documents with identical titles
but different parents.

<Banner type="info">
  This plugin is completely open-source and the [source code can be found
  here](https://github.com/payloadcms/payload/tree/main/packages/plugin-nested-docs).
  If you need help, check out our [Community
  Help](https://payloadcms.com/community-help). If you think you've found a bug,
  please [open a new
  issue](https://github.com/payloadcms/payload/issues/new?assignees=&labels=plugin%3A%20nested-docs&template=bug_report.md&title=plugin-nested-docs%3A)
  with as much detail as possible.
</Banner>

## Core features

- Automatically adds a `parent` relationship field to each document
- Allows for parent/child relationships between documents within the same collection
- Recursively updates all descendants when a parent is changed
- Automatically populates a `breadcrumbs` field with all ancestors up the tree
- Dynamically generate labels and URLs for each breadcrumb
- Supports localization

## Installation

Install the plugin using any JavaScript package manager like [pnpm](https://pnpm.io), [npm](https://npmjs.com), or [Yarn](https://yarnpkg.com):

```bash
  pnpm add @payloadcms/plugin-nested-docs
```

## Basic Usage

In the `plugins` array of your [Payload Config](https://payloadcms.com/docs/configuration/overview), call the plugin
with [options](#options):

```ts
import { buildConfig } from 'payload'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'

const config = buildConfig({
  collections: [
    {
      slug: 'pages',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'slug',
          type: 'text',
        },
      ],
    },
  ],
  plugins: [
    nestedDocsPlugin({
      collections: ['pages'],
      generateLabel: (_, doc) => doc.title,
      generateURL: (docs) =>
        docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
    }),
  ],
})

export default config
```

### Fields

#### Parent

The `parent` relationship field is automatically added to every document which allows editors to choose another document
from the same collection to act as the direct parent.

#### Breadcrumbs

The `breadcrumbs` field is an array which dynamically populates all parent relationships of a document up to the top
level and stores the following fields.

| Field   | Description                                                                                                                                                                                                                                                                                  |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `label` | The label of the breadcrumb. This field is automatically set to either the `collection.admin.useAsTitle` (if defined) or is set to the `ID` of the document. You can also dynamically define the `label` by passing a function to the options property of [`generateLabel`](#generatelabel). |
| `url`   | The URL of the breadcrumb. By default, this field is undefined. You can manually define this field by passing a property called function to the plugin options property of [`generateURL`](#generateurl).                                                                                    |

### Options

#### `collections`

An array of collections slugs to enable nested docs.

#### `generateLabel`

Each `breadcrumb` has a required `label` field. By default, its value will be set to the collection's `admin.useAsTitle`
or fallback to the `ID` of the document.

You can also pass a function to dynamically set the `label` of your breadcrumb.

```ts
// payload.config.ts
nestedDocsPlugin({
  //...
  generateLabel: (_, doc) => doc.title, // NOTE: 'title' is a hypothetical field
})
```

The function takes two arguments and returns a string:

| Argument     | Type     | Description                                   |
| ------------ | -------- | --------------------------------------------- |
| `docs`       | `Array`  | An array of the breadcrumbs up to that point  |
| `doc`        | `Object` | The current document being edited             |
| `collection` | `Object` | The collection config of the current document |

#### `generateURL`

A function that allows you to dynamically generate each breadcrumb `url`. Each `breadcrumb` has an optional `url` field
which is undefined by default. For example, you might want to format a full URL to contain all breadcrumbs up to
that point, like `/about-us/company/our-team`.

```ts
// payload.config.ts
nestedDocsPlugin({
  //...
  generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''), // NOTE: 'slug' is a hypothetical field
})
```

| Argument     | Type     | Description                                   |
| ------------ | -------- | --------------------------------------------- |
| `docs`       | `Array`  | An array of the breadcrumbs up to that point  |
| `doc`        | `Object` | The current document being edited             |
| `collection` | `Object` | The collection config of the current document |

#### `parentFieldSlug`

When defined, the `parent` field will not be provided for you automatically, and instead, expects you to add your
own `parent` field to each collection manually. This gives you complete control over where you put the field in your
admin dashboard, etc. Set this property to the `name` of your custom field.

#### `breadcrumbsFieldSlug`

When defined, the `breadcrumbs` field will not be provided for you, and instead, expects you to add your
own `breadcrumbs` field to each collection manually. Set this property to the `name` of your custom field.

<Banner type="info">
  **Note:**

If you opt out of automatically being provided a `parent` or `breadcrumbs` field, you need to make
sure that both fields are placed at the top-level of your document. They cannot exist within any
nested data structures like a `group`, `array`, or `blocks`.

</Banner>

## Overrides

You can also extend the built-in `parent` and `breadcrumbs` fields per collection by using the `createParentField`
and `createBreadcrumbField` methods. They will merge your customizations overtop the plugin's base field configurations.

```ts
import type { CollectionConfig } from 'payload'
import { createParentField } from '@payloadcms/plugin-nested-docs'
import { createBreadcrumbsField } from '@payloadcms/plugin-nested-docs'

const examplePageConfig: CollectionConfig = {
  slug: 'pages',
  fields: [
    createParentField(
      // First argument is equal to the slug of the collection
      // that the field references
      'pages',

      // Second argument is equal to field overrides that you specify,
      // which will be merged into the base parent field config
      {
        admin: {
          position: 'sidebar',
        },
        // Note: if you override the `filterOptions` of the `parent` field,
        // be sure to continue to prevent the document from referencing itself as the parent like this:
        // filterOptions: ({ id }) => ({ id: {not_equals: id }})
      },
    ),
    createBreadcrumbsField(
      // First argument is equal to the slug of the collection
      // that the field references
      'pages',

      // Argument equal to field overrides that you specify,
      // which will be merged into the base `breadcrumbs` field config
      {
        label: 'Page Breadcrumbs',
      },
    ),
  ],
}
```

<Banner type="warning">
  **Note:**

If overriding the `name` of either `breadcrumbs` or `parent` fields, you must specify the
`breadcrumbsFieldSlug` or `parentFieldSlug` respectively.

</Banner>

## Localization

This plugin supports localization by default. If the `localization` property is set in your Payload Config,
the `breadcrumbs` field is automatically localized. For more details on how localization works in Payload, see
the [Localization](https://payloadcms.com/docs/configuration/localization) docs.

## TypeScript

All types can be directly imported:

```ts
import {
  PluginConfig,
  GenerateURL,
  GenerateLabel,
} from '@payloadcms/plugin-nested-docs/types'
```

## Examples

The [Templates Directory](https://github.com/payloadcms/payload/tree/main/templates) also contains an official [Website Template](https://github.com/payloadcms/payload/tree/main/templates/website) and [E-commerce Template](https://github.com/payloadcms/payload/tree/main/templates/ecommerce), both of which use this plugin.
```

--------------------------------------------------------------------------------

````
