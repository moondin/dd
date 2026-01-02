---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 444
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 444 of 695)

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

---[FILE: README.md]---
Location: payload-main/templates/plugin/README.md

```text
# Payload Plugin Template

A template repo to create a [Payload CMS](https://payloadcms.com) plugin.

Payload is built with a robust infrastructure intended to support Plugins with ease. This provides a simple, modular, and reusable way for developers to extend the core capabilities of Payload.

To build your own Payload plugin, all you need is:

- An understanding of the basic Payload concepts
- And some JavaScript/Typescript experience

## Background

Here is a short recap on how to integrate plugins with Payload, to learn more visit the [plugin overview page](https://payloadcms.com/docs/plugins/overview).

### How to install a plugin

To install any plugin, simply add it to your payload.config() in the Plugin array.

```ts
import myPlugin from 'my-plugin'

export const config = buildConfig({
  plugins: [
    // You can pass options to the plugin
    myPlugin({
      enabled: true,
    }),
  ],
})
```

### Initialization

The initialization process goes in the following order:

1. Incoming config is validated
2. **Plugins execute**
3. Default options are integrated
4. Sanitization cleans and validates data
5. Final config gets initialized

## Building the Plugin

When you build a plugin, you are purely building a feature for your project and then abstracting it outside of the project.

### Template Files

In the Payload [plugin template](https://github.com/payloadcms/payload/tree/main/templates/plugin), you will see a common file structure that is used across all plugins:

1. root folder
2. /src folder
3. /dev folder

#### Root

In the root folder, you will see various files that relate to the configuration of the plugin. We set up our environment in a similar manner in Payload core and across other projects, so hopefully these will look familiar:

- **README**.md\* - This contains instructions on how to use the template. When you are ready, update this to contain instructions on how to use your Plugin.
- **package**.json\* - Contains necessary scripts and dependencies. Overwrite the metadata in this file to describe your Plugin.
- .**eslint**.config.js - Eslint configuration for reporting on problematic patterns.
- .**gitignore** - List specific untracked files to omit from Git.
- .**prettierrc**.json - Configuration for Prettier code formatting.
- **tsconfig**.json - Configures the compiler options for TypeScript
- .**swcrc** - Configuration for SWC, a fast compiler that transpiles and bundles TypeScript.
- **vitest**.config.js - Config file for Vitest, defining how tests are run and how modules are resolved

**IMPORTANT\***: You will need to modify these files.

#### Dev

In the dev folder, you’ll find a basic payload project, created with `npx create-payload-app` and the blank template.

**IMPORTANT**: Make a copy of the `.env.example` file and rename it to `.env`. Update the `DATABASE_URI` to match the database you are using and your plugin name. Update `PAYLOAD_SECRET` to a unique string.
**You will not be able to run `pnpm/yarn dev` until you have created this `.env` file.**

`myPlugin` has already been added to the `payload.config()` file in this project.

```ts
plugins: [
  myPlugin({
    collections: {
      posts: true,
    },
  }),
]
```

Later when you rename the plugin or add additional options, **make sure to update it here**.

You may wish to add collections or expand the test project depending on the purpose of your plugin. Just make sure to keep this dev environment as simplified as possible - users should be able to install your plugin without additional configuration required.

When you’re ready to start development, initiate the project with `pnpm/npm/yarn dev` and pull up [http://localhost:3000](http://localhost:3000) in your browser.

#### Src

Now that we have our environment setup and we have a dev project ready to - it’s time to build the plugin!

**index.ts**

The essence of a Payload plugin is simply to extend the payload config - and that is exactly what we are doing in this file.

```ts
export const myPlugin =
  (pluginOptions: MyPluginConfig) =>
  (config: Config): Config => {
    // do cool stuff with the config here

    return config
  }
```

First, we receive the existing payload config along with any plugin options.

From here, you can extend the config as you wish.

Finally, you return the config and that is it!

##### Spread Syntax

Spread syntax (or the spread operator) is a feature in JavaScript that uses the dot notation **(...)** to spread elements from arrays, strings, or objects into various contexts.

We are going to use spread syntax to allow us to add data to existing arrays without losing the existing data. It is crucial to spread the existing data correctly – else this can cause adverse behavior and conflicts with Payload config and other plugins.

Let’s say you want to build a plugin that adds a new collection:

```ts
config.collections = [
  ...(config.collections || []),
  // Add additional collections here
]
```

First we spread the `config.collections` to ensure that we don’t lose the existing collections, then you can add any additional collections just as you would in a regular payload config.

This same logic is applied to other properties like admin, hooks, globals:

```ts
config.globals = [
  ...(config.globals || []),
  // Add additional globals here
]

config.hooks = {
  ...(incomingConfig.hooks || {}),
  // Add additional hooks here
}
```

Some properties will be slightly different to extend, for instance the onInit property:

```ts
import { onInitExtension } from './onInitExtension' // example file

config.onInit = async (payload) => {
  if (incomingConfig.onInit) await incomingConfig.onInit(payload)
  // Add additional onInit code by defining an onInitExtension function
  onInitExtension(pluginOptions, payload)
}
```

If you wish to add to the onInit, you must include the **async/await**. We don’t use spread syntax in this case, instead you must await the existing `onInit` before running additional functionality.

In the template, we have stubbed out some addition `onInit` actions that seeds in a document to the `plugin-collection`, you can use this as a base point to add more actions - and if not needed, feel free to delete it.

##### Types.ts

If your plugin has options, you should define and provide types for these options.

```ts
export type MyPluginConfig = {
  /**
   * List of collections to add a custom field
   */
  collections?: Partial<Record<CollectionSlug, true>>
  /**
   * Disable the plugin
   */
  disabled?: boolean
}
```

If possible, include JSDoc comments to describe the options and their types. This allows a developer to see details about the options in their editor.

##### Testing

Having a test suite for your plugin is essential to ensure quality and stability. **Vitest** is a fast, modern testing framework that works seamlessly with Vite and supports TypeScript out of the box.

Vitest organizes tests into test suites and cases, similar to other testing frameworks. We recommend creating individual tests based on the expected behavior of your plugin from start to finish.

Writing tests with Vitest is very straightforward, and you can learn more about how it works in the [Vitest documentation.](https://vitest.dev/)

For this template, we stubbed out `int.spec.ts` in the `dev` folder where you can write your tests.

```ts
describe('Plugin tests', () => {
  // Create tests to ensure expected behavior from the plugin
  it('some condition that must be met', () => {
   // Write your test logic here
   expect(...)
  })
})
```

## Best practices

With this tutorial and the plugin template, you should have everything you need to start building your own plugin.
In addition to the setup, here are other best practices aim we follow:

- **Providing an enable / disable option:** For a better user experience, provide a way to disable the plugin without uninstalling it. This is especially important if your plugin adds additional webpack aliases, this will allow you to still let the webpack run to prevent errors.
- **Include tests in your GitHub CI workflow**: If you’ve configured tests for your package, integrate them into your workflow to run the tests each time you commit to the plugin repository. Learn more about [how to configure tests into your GitHub CI workflow.](https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs)
- **Publish your finished plugin to NPM**: The best way to share and allow others to use your plugin once it is complete is to publish an NPM package. This process is straightforward and well documented, find out more [creating and publishing a NPM package here.](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages/).
- **Add payload-plugin topic tag**: Apply the tag **payload-plugin **to your GitHub repository. This will boost the visibility of your plugin and ensure it gets listed with [existing payload plugins](https://github.com/topics/payload-plugin).
- **Use [Semantic Versioning](https://semver.org/) (SemVar)** - With the SemVar system you release version numbers that reflect the nature of changes (major, minor, patch). Ensure all major versions reference their Payload compatibility.

# Questions

Please contact [Payload](mailto:dev@payloadcms.com) with any questions about using this plugin template.
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/templates/plugin/tsconfig.json
Signals: Next.js

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "lib": [
      "DOM",
      "DOM.Iterable",
      "ES2022"
    ],
    "rootDir": "./",
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "esModuleInterop": true,
    "module": "NodeNext",
    "moduleResolution": "nodenext",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "emitDeclarationOnly": true,
    "target": "ES2022",
    "composite": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
  },
  "include": [
    "./src/**/*.ts",
    "./src/**/*.tsx",
    "./dev/next-env.d.ts",
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: vitest.config.js]---
Location: payload-main/templates/plugin/vitest.config.js

```javascript
import path from 'path'
import { loadEnv } from 'payload/node'
import { fileURLToPath } from 'url'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default defineConfig(() => {
  loadEnv(path.resolve(dirname, './dev'))

  return {
    plugins: [
      tsconfigPaths({
        ignoreConfigErrors: true,
      }),
    ],
    test: {
      environment: 'node',
      hookTimeout: 30_000,
      testTimeout: 30_000,
    },
  }
})
```

--------------------------------------------------------------------------------

---[FILE: extensions.json]---
Location: payload-main/templates/plugin/.vscode/extensions.json

```json
{
  "recommendations": ["dbaeumer.vscode-eslint", "esbenp.prettier-vscode"]
}
```

--------------------------------------------------------------------------------

---[FILE: launch.json]---
Location: payload-main/templates/plugin/.vscode/launch.json
Signals: Next.js

```json
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug full stack",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/next/dist/bin/next",
      "runtimeArgs": ["--inspect"],
      "skipFiles": ["<node_internals>/**"],
      "serverReadyAction": {
        "action": "debugWithChrome",
        "killOnServerStop": true,
        "pattern": "- Local:.+(https?://.+)",
        "uriFormat": "%s",
        "webRoot": "${workspaceFolder}"
      },
      "cwd": "${workspaceFolder}"
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: settings.json]---
Location: payload-main/templates/plugin/.vscode/settings.json

```json
{
  "npm.packageManager": "pnpm",
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit"
    }
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit"
    }
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit"
    }
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "[jsonc]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "editor.formatOnSaveMode": "file",
  "typescript.tsdk": "node_modules/typescript/lib",
  "[javascript][typescript][typescriptreact]": {
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: .env.example]---
Location: payload-main/templates/plugin/dev/.env.example

```text
DATABASE_URI=mongodb://127.0.0.1/payload-plugin-template
PAYLOAD_SECRET=YOUR_SECRET_HERE
```

--------------------------------------------------------------------------------

---[FILE: e2e.spec.ts]---
Location: payload-main/templates/plugin/dev/e2e.spec.ts

```typescript
import { expect, test } from '@playwright/test'

// this is an example Playwright e2e test
test('should render admin panel logo', async ({ page }) => {
  await page.goto('/admin')

  // login
  await page.fill('#field-email', 'dev@payloadcms.com')
  await page.fill('#field-password', 'test')
  await page.click('.form-submit button')

  // should show dashboard
  await expect(page).toHaveTitle(/Dashboard/)
  await expect(page.locator('.graphic-icon')).toBeVisible()
})
```

--------------------------------------------------------------------------------

---[FILE: int.spec.ts]---
Location: payload-main/templates/plugin/dev/int.spec.ts

```typescript
import type { Payload } from 'payload'

import config from '@payload-config'
import { createPayloadRequest, getPayload } from 'payload'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'

import { customEndpointHandler } from '../src/endpoints/customEndpointHandler.js'

let payload: Payload

afterAll(async () => {
  await payload.destroy()
})

beforeAll(async () => {
  payload = await getPayload({ config })
})

describe('Plugin integration tests', () => {
  test('should query custom endpoint added by plugin', async () => {
    const request = new Request('http://localhost:3000/api/my-plugin-endpoint', {
      method: 'GET',
    })

    const payloadRequest = await createPayloadRequest({ config, request })
    const response = await customEndpointHandler(payloadRequest)
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data).toMatchObject({
      message: 'Hello from custom endpoint',
    })
  })

  test('can create post with custom text field added by plugin', async () => {
    const post = await payload.create({
      collection: 'posts',
      data: {
        addedByPlugin: 'added by plugin',
      },
    })
    expect(post.addedByPlugin).toBe('added by plugin')
  })

  test('plugin creates and seeds plugin-collection', async () => {
    expect(payload.collections['plugin-collection']).toBeDefined()

    const { docs } = await payload.find({ collection: 'plugin-collection' })

    expect(docs).toHaveLength(1)
  })
})
```

--------------------------------------------------------------------------------

---[FILE: next-env.d.ts]---
Location: payload-main/templates/plugin/dev/next-env.d.ts

```typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
```

--------------------------------------------------------------------------------

---[FILE: next.config.mjs]---
Location: payload-main/templates/plugin/dev/next.config.mjs

```text
import { withPayload } from '@payloadcms/next/withPayload'
import { fileURLToPath } from 'url'
import path from 'path'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  serverExternalPackages: ['mongodb-memory-server'],
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
```

--------------------------------------------------------------------------------

---[FILE: payload-types.ts]---
Location: payload-main/templates/plugin/dev/payload-types.ts

```typescript
/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

export interface Config {
  auth: {
    users: UserAuthOperations;
  };
  collections: {
    posts: Post;
    media: Media;
    'plugin-collection': PluginCollection;
    users: User;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  collectionsJoins: {};
  collectionsSelect: {
    posts: PostsSelect<false> | PostsSelect<true>;
    media: MediaSelect<false> | MediaSelect<true>;
    'plugin-collection': PluginCollectionSelect<false> | PluginCollectionSelect<true>;
    users: UsersSelect<false> | UsersSelect<true>;
    'payload-locked-documents': PayloadLockedDocumentsSelect<false> | PayloadLockedDocumentsSelect<true>;
    'payload-preferences': PayloadPreferencesSelect<false> | PayloadPreferencesSelect<true>;
    'payload-migrations': PayloadMigrationsSelect<false> | PayloadMigrationsSelect<true>;
  };
  db: {
    defaultIDType: string;
  };
  globals: {};
  globalsSelect: {};
  locale: null;
  user: User & {
    collection: 'users';
  };
  jobs: {
    tasks: unknown;
    workflows: unknown;
  };
}
export interface UserAuthOperations {
  forgotPassword: {
    email: string;
    password: string;
  };
  login: {
    email: string;
    password: string;
  };
  registerFirstUser: {
    email: string;
    password: string;
  };
  unlock: {
    email: string;
    password: string;
  };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "posts".
 */
export interface Post {
  id: string;
  addedByPlugin?: string | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media".
 */
export interface Media {
  id: string;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  thumbnailURL?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  focalX?: number | null;
  focalY?: number | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "plugin-collection".
 */
export interface PluginCollection {
  id: string;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users".
 */
export interface User {
  id: string;
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents".
 */
export interface PayloadLockedDocument {
  id: string;
  document?:
    | ({
        relationTo: 'posts';
        value: string | Post;
      } | null)
    | ({
        relationTo: 'media';
        value: string | Media;
      } | null)
    | ({
        relationTo: 'plugin-collection';
        value: string | PluginCollection;
      } | null)
    | ({
        relationTo: 'users';
        value: string | User;
      } | null);
  globalSlug?: string | null;
  user: {
    relationTo: 'users';
    value: string | User;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences".
 */
export interface PayloadPreference {
  id: string;
  user: {
    relationTo: 'users';
    value: string | User;
  };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations".
 */
export interface PayloadMigration {
  id: string;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "posts_select".
 */
export interface PostsSelect<T extends boolean = true> {
  addedByPlugin?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media_select".
 */
export interface MediaSelect<T extends boolean = true> {
  updatedAt?: T;
  createdAt?: T;
  url?: T;
  thumbnailURL?: T;
  filename?: T;
  mimeType?: T;
  filesize?: T;
  width?: T;
  height?: T;
  focalX?: T;
  focalY?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "plugin-collection_select".
 */
export interface PluginCollectionSelect<T extends boolean = true> {
  id?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users_select".
 */
export interface UsersSelect<T extends boolean = true> {
  updatedAt?: T;
  createdAt?: T;
  email?: T;
  resetPasswordToken?: T;
  resetPasswordExpiration?: T;
  salt?: T;
  hash?: T;
  loginAttempts?: T;
  lockUntil?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents_select".
 */
export interface PayloadLockedDocumentsSelect<T extends boolean = true> {
  document?: T;
  globalSlug?: T;
  user?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences_select".
 */
export interface PayloadPreferencesSelect<T extends boolean = true> {
  user?: T;
  key?: T;
  value?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations_select".
 */
export interface PayloadMigrationsSelect<T extends boolean = true> {
  name?: T;
  batch?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "auth".
 */
export interface Auth {
  [k: string]: unknown;
}


declare module 'payload' {
  export interface GeneratedTypes extends Config {}
}
```

--------------------------------------------------------------------------------

---[FILE: payload.config.ts]---
Location: payload-main/templates/plugin/dev/payload.config.ts

```typescript
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { MongoMemoryReplSet } from 'mongodb-memory-server'
import path from 'path'
import { buildConfig } from 'payload'
import { myPlugin } from 'plugin-package-name-placeholder'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { testEmailAdapter } from './helpers/testEmailAdapter.js'
import { seed } from './seed.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

if (!process.env.ROOT_DIR) {
  process.env.ROOT_DIR = dirname
}

const buildConfigWithMemoryDB = async () => {
  if (process.env.NODE_ENV === 'test') {
    const memoryDB = await MongoMemoryReplSet.create({
      replSet: {
        count: 3,
        dbName: 'payloadmemory',
      },
    })

    process.env.DATABASE_URI = `${memoryDB.getUri()}&retryWrites=true`
  }

  return buildConfig({
    admin: {
      importMap: {
        baseDir: path.resolve(dirname),
      },
    },
    collections: [
      {
        slug: 'posts',
        fields: [],
      },
      {
        slug: 'media',
        fields: [],
        upload: {
          staticDir: path.resolve(dirname, 'media'),
        },
      },
    ],
    db: mongooseAdapter({
      ensureIndexes: true,
      url: process.env.DATABASE_URI || '',
    }),
    editor: lexicalEditor(),
    email: testEmailAdapter,
    onInit: async (payload) => {
      await seed(payload)
    },
    plugins: [
      myPlugin({
        collections: {
          posts: true,
        },
      }),
    ],
    secret: process.env.PAYLOAD_SECRET || 'test-secret_key',
    sharp,
    typescript: {
      outputFile: path.resolve(dirname, 'payload-types.ts'),
    },
  })
}

export default buildConfigWithMemoryDB()
```

--------------------------------------------------------------------------------

---[FILE: seed.ts]---
Location: payload-main/templates/plugin/dev/seed.ts

```typescript
import type { Payload } from 'payload'

import { devUser } from './helpers/credentials.js'

export const seed = async (payload: Payload) => {
  const { totalDocs } = await payload.count({
    collection: 'users',
    where: {
      email: {
        equals: devUser.email,
      },
    },
  })

  if (!totalDocs) {
    await payload.create({
      collection: 'users',
      data: devUser,
    })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/templates/plugin/dev/tsconfig.json
Signals: Next.js

```json
{
  "extends": "../tsconfig.json",
  "exclude": [],
  "include": [
    "**/*.js",
    "**/*.jsx",
    "**/*.mjs",
    "**/*.cjs",
    "**/*.ts",
    "**/*.tsx",
    "../src/**/*.ts",
    "../src/**/*.tsx",
    "next.config.mjs",
    ".next/types/**/*.ts"
  ],
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@payload-config": [
        "./payload.config.ts"
      ],
      "plugin-package-name-placeholder": [
        "../src/index.ts"
      ],
      "plugin-package-name-placeholder/client": [
        "../src/exports/client.ts"
      ],
      "plugin-package-name-placeholder/rsc": [
        "../src/exports/rsc.ts"
      ]
    },
    "noEmit": true,
    "emitDeclarationOnly": false,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: layout.tsx]---
Location: payload-main/templates/plugin/dev/app/(payload)/layout.tsx
Signals: React

```typescript
import type { ServerFunctionClient } from 'payload'

import '@payloadcms/next/css'
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import React from 'react'

import { importMap } from './admin/importMap.js'
import './custom.scss'

type Args = {
  children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
)

export default Layout
```

--------------------------------------------------------------------------------

---[FILE: importMap.js]---
Location: payload-main/templates/plugin/dev/app/(payload)/admin/importMap.js

```javascript
import { BeforeDashboardClient as BeforeDashboardClient_fc6e7dd366b9e2c8ce77d31252122343 } from 'plugin-package-name-placeholder/client'
import { BeforeDashboardServer as BeforeDashboardServer_c4406fcca100b2553312c5a3d7520a3f } from 'plugin-package-name-placeholder/rsc'

export const importMap = {
  'plugin-package-name-placeholder/client#BeforeDashboardClient':
    BeforeDashboardClient_fc6e7dd366b9e2c8ce77d31252122343,
  'plugin-package-name-placeholder/rsc#BeforeDashboardServer':
    BeforeDashboardServer_c4406fcca100b2553312c5a3d7520a3f,
}
```

--------------------------------------------------------------------------------

---[FILE: not-found.tsx]---
Location: payload-main/templates/plugin/dev/app/(payload)/admin/[[...segments]]/not-found.tsx
Signals: Next.js

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'

import config from '@payload-config'
import { generatePageMetadata, NotFoundPage } from '@payloadcms/next/views'

import { importMap } from '../importMap.js'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const NotFound = ({ params, searchParams }: Args) =>
  NotFoundPage({ config, importMap, params, searchParams })

export default NotFound
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: payload-main/templates/plugin/dev/app/(payload)/admin/[[...segments]]/page.tsx
Signals: Next.js

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'

import config from '@payload-config'
import { generatePageMetadata, RootPage } from '@payloadcms/next/views'

import { importMap } from '../importMap.js'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const Page = ({ params, searchParams }: Args) =>
  RootPage({ config, importMap, params, searchParams })

export default Page
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: payload-main/templates/plugin/dev/app/(payload)/api/graphql/route.ts

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import { GRAPHQL_POST, REST_OPTIONS } from '@payloadcms/next/routes'

export const POST = GRAPHQL_POST(config)

export const OPTIONS = REST_OPTIONS(config)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: payload-main/templates/plugin/dev/app/(payload)/api/graphql-playground/route.ts

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import '@payloadcms/next/css'
import { GRAPHQL_PLAYGROUND_GET } from '@payloadcms/next/routes'

export const GET = GRAPHQL_PLAYGROUND_GET(config)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: payload-main/templates/plugin/dev/app/(payload)/api/[...slug]/route.ts

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import '@payloadcms/next/css'
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from '@payloadcms/next/routes'

export const GET = REST_GET(config)
export const POST = REST_POST(config)
export const DELETE = REST_DELETE(config)
export const PATCH = REST_PATCH(config)
export const PUT = REST_PUT(config)
export const OPTIONS = REST_OPTIONS(config)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: payload-main/templates/plugin/dev/app/my-route/route.ts

```typescript
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const GET = async (request: Request) => {
  const payload = await getPayload({
    config: configPromise,
  })

  return Response.json({
    message: 'This is an example of a custom route.',
  })
}
```

--------------------------------------------------------------------------------

---[FILE: credentials.ts]---
Location: payload-main/templates/plugin/dev/helpers/credentials.ts

```typescript
export const devUser = {
  email: 'dev@payloadcms.com',
  password: 'test',
}
```

--------------------------------------------------------------------------------

---[FILE: testEmailAdapter.ts]---
Location: payload-main/templates/plugin/dev/helpers/testEmailAdapter.ts

```typescript
import type { EmailAdapter, SendEmailOptions } from 'payload'

/**
 * Logs all emails to stdout
 */
export const testEmailAdapter: EmailAdapter<void> = ({ payload }) => ({
  name: 'test-email-adapter',
  defaultFromAddress: 'dev@payloadcms.com',
  defaultFromName: 'Payload Test',
  sendEmail: async (message) => {
    const stringifiedTo = getStringifiedToAddress(message)
    const res = `Test email to: '${stringifiedTo}', Subject: '${message.subject}'`
    payload.logger.info({ content: message, msg: res })
    return Promise.resolve()
  },
})

function getStringifiedToAddress(message: SendEmailOptions): string | undefined {
  let stringifiedTo: string | undefined

  if (typeof message.to === 'string') {
    stringifiedTo = message.to
  } else if (Array.isArray(message.to)) {
    stringifiedTo = message.to
      .map((to: { address: string } | string) => {
        if (typeof to === 'string') {
          return to
        } else if (to.address) {
          return to.address
        }
        return ''
      })
      .join(', ')
  } else if (message.to?.address) {
    stringifiedTo = message.to.address
  }
  return stringifiedTo
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/templates/plugin/src/index.ts

```typescript
import type { CollectionSlug, Config } from 'payload'

import { customEndpointHandler } from './endpoints/customEndpointHandler.js'

export type MyPluginConfig = {
  /**
   * List of collections to add a custom field
   */
  collections?: Partial<Record<CollectionSlug, true>>
  disabled?: boolean
}

export const myPlugin =
  (pluginOptions: MyPluginConfig) =>
  (config: Config): Config => {
    if (!config.collections) {
      config.collections = []
    }

    config.collections.push({
      slug: 'plugin-collection',
      fields: [
        {
          name: 'id',
          type: 'text',
        },
      ],
    })

    if (pluginOptions.collections) {
      for (const collectionSlug in pluginOptions.collections) {
        const collection = config.collections.find(
          (collection) => collection.slug === collectionSlug,
        )

        if (collection) {
          collection.fields.push({
            name: 'addedByPlugin',
            type: 'text',
            admin: {
              position: 'sidebar',
            },
          })
        }
      }
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

    if (!config.admin) {
      config.admin = {}
    }

    if (!config.admin.components) {
      config.admin.components = {}
    }

    if (!config.admin.components.beforeDashboard) {
      config.admin.components.beforeDashboard = []
    }

    config.admin.components.beforeDashboard.push(
      `plugin-package-name-placeholder/client#BeforeDashboardClient`,
    )
    config.admin.components.beforeDashboard.push(
      `plugin-package-name-placeholder/rsc#BeforeDashboardServer`,
    )

    config.endpoints.push({
      handler: customEndpointHandler,
      method: 'get',
      path: '/my-plugin-endpoint',
    })

    const incomingOnInit = config.onInit

    config.onInit = async (payload) => {
      // Ensure we are executing any existing onInit functions before running our own.
      if (incomingOnInit) {
        await incomingOnInit(payload)
      }

      const { totalDocs } = await payload.count({
        collection: 'plugin-collection',
        where: {
          id: {
            equals: 'seeded-by-plugin',
          },
        },
      })

      if (totalDocs === 0) {
        await payload.create({
          collection: 'plugin-collection',
          data: {
            id: 'seeded-by-plugin',
          },
        })
      }
    }

    return config
  }
```

--------------------------------------------------------------------------------

---[FILE: BeforeDashboardClient.tsx]---
Location: payload-main/templates/plugin/src/components/BeforeDashboardClient.tsx
Signals: React

```typescript
'use client'
import { useConfig } from '@payloadcms/ui'
import { useEffect, useState } from 'react'

export const BeforeDashboardClient = () => {
  const { config } = useConfig()

  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchMessage = async () => {
      const response = await fetch(`${config.serverURL}${config.routes.api}/my-plugin-endpoint`)
      const result = await response.json()
      setMessage(result.message)
    }

    void fetchMessage()
  }, [config.serverURL, config.routes.api])

  return (
    <div>
      <h1>Added by the plugin: Before Dashboard Client</h1>
      <div>
        Message from the endpoint:
        <div>{message || 'Loading...'}</div>
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: BeforeDashboardServer.module.css]---
Location: payload-main/templates/plugin/src/components/BeforeDashboardServer.module.css

```text
.wrapper {
  display: flex;
  gap: 5px;
  flex-direction: column;
}
```

--------------------------------------------------------------------------------

---[FILE: BeforeDashboardServer.tsx]---
Location: payload-main/templates/plugin/src/components/BeforeDashboardServer.tsx

```typescript
import type { ServerComponentProps } from 'payload'

import styles from './BeforeDashboardServer.module.css'

export const BeforeDashboardServer = async (props: ServerComponentProps) => {
  const { payload } = props

  const { docs } = await payload.find({ collection: 'plugin-collection' })

  return (
    <div className={styles.wrapper}>
      <h1>Added by the plugin: Before Dashboard Server</h1>
      Docs from Local API:
      {docs.map((doc) => (
        <div key={doc.id}>{doc.id}</div>
      ))}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: customEndpointHandler.ts]---
Location: payload-main/templates/plugin/src/endpoints/customEndpointHandler.ts

```typescript
import type { PayloadHandler } from 'payload'

export const customEndpointHandler: PayloadHandler = () => {
  return Response.json({ message: 'Hello from custom endpoint' })
}
```

--------------------------------------------------------------------------------

````
