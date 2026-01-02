---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 521
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 521 of 695)

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

---[FILE: CustomViews1.ts]---
Location: payload-main/test/admin/globals/CustomViews1.ts

```typescript
import type { GlobalConfig } from 'payload'

import { customGlobalViews1GlobalSlug } from '../slugs.js'

export const CustomGlobalViews1: GlobalConfig = {
  slug: customGlobalViews1GlobalSlug,
  admin: {
    components: {
      views: {
        edit: {
          default: {
            Component: '/components/views/CustomEdit/index.js#CustomEditView',
          },
        },
      },
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
  ],
  versions: true,
}
```

--------------------------------------------------------------------------------

---[FILE: CustomViews2.ts]---
Location: payload-main/test/admin/globals/CustomViews2.ts

```typescript
import type { GlobalConfig } from 'payload'

import { customTabComponent, overriddenDefaultRouteTabLabel } from '../shared.js'
import { customGlobalViews2GlobalSlug } from '../slugs.js'

export const CustomGlobalViews2: GlobalConfig = {
  slug: customGlobalViews2GlobalSlug,
  admin: {
    components: {
      views: {
        edit: {
          api: {
            // Override the default tab component for the default route
            tab: {
              Component: {
                path: '/components/CustomTabComponent/index.js#CustomTabComponent',
                clientProps: {
                  label: overriddenDefaultRouteTabLabel,
                },
              },
            },
          },
          default: {
            Component: '/components/views/CustomEditDefault/index.js#CustomDefaultEditView',
          },
          myCustomView: {
            Component: '/components/views/CustomTabLabel/index.js#CustomTabLabelView',
            tab: {
              href: '/custom-tab-view',
              label: 'Custom',
            },
            path: '/custom-tab-view',
          },
          myCustomViewWithCustomTab: {
            Component: {
              path: '/components/views/CustomTabComponent/index.js#CustomTabComponentView',
              clientProps: {
                label: customTabComponent,
              },
            },
            tab: {
              Component: {
                path: '/components/CustomTabComponent/index.js#CustomTabComponent',
                clientProps: {
                  label: customTabComponent,
                },
              },
            },
            path: '/custom-tab-component',
          },
          versions: {
            Component: '/components/views/CustomVersions/index.js#CustomVersionsView',
          },
        },
      },
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
  ],
  versions: true,
}
```

--------------------------------------------------------------------------------

---[FILE: Global.ts]---
Location: payload-main/test/admin/globals/Global.ts

```typescript
import type { GlobalConfig } from 'payload'

import { globalSlug } from '../slugs.js'

export const Global: GlobalConfig = {
  slug: globalSlug,
  admin: {
    components: {
      elements: {
        beforeDocumentControls: [
          '/components/BeforeDocumentControls/CustomDraftButton/index.js#CustomDraftButton',
        ],
      },
      views: {
        edit: {
          api: {
            actions: ['/components/actions/GlobalAPIButton/index.js#GlobalAPIButton'],
          },
          default: {
            actions: ['/components/actions/GlobalEditButton/index.js#GlobalEditButton'],
          },
        },
      },
    },
    group: 'Group',
    preview: () => 'https://payloadcms.com',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'sidebarField',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  label: {
    en: 'My Global Label',
  },
  versions: {
    drafts: true,
  },
}
```

--------------------------------------------------------------------------------

---[FILE: Group1A.ts]---
Location: payload-main/test/admin/globals/Group1A.ts

```typescript
import type { GlobalConfig } from 'payload'

import { group1GlobalSlug } from '../slugs.js'

export const GlobalGroup1A: GlobalConfig = {
  slug: group1GlobalSlug,
  admin: {
    group: 'Group',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
  ],
  label: 'Group Globals 1',
}
```

--------------------------------------------------------------------------------

---[FILE: Group1B.ts]---
Location: payload-main/test/admin/globals/Group1B.ts

```typescript
import type { GlobalConfig } from 'payload'

import { group2GlobalSlug } from '../slugs.js'

export const GlobalGroup1B: GlobalConfig = {
  slug: group2GlobalSlug,
  admin: {
    group: 'Group',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: Hidden.ts]---
Location: payload-main/test/admin/globals/Hidden.ts

```typescript
import type { GlobalConfig } from 'payload'

import { hiddenGlobalSlug } from '../slugs.js'

export const GlobalHidden: GlobalConfig = {
  slug: hiddenGlobalSlug,
  admin: {
    hidden: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: NoApiView.ts]---
Location: payload-main/test/admin/globals/NoApiView.ts

```typescript
import type { GlobalConfig } from 'payload'

import { noApiViewGlobalSlug } from '../slugs.js'

export const GlobalNoApiView: GlobalConfig = {
  slug: noApiViewGlobalSlug,
  admin: {
    hideAPIURL: true,
  },
  fields: [],
}
```

--------------------------------------------------------------------------------

---[FILE: NotInView.ts]---
Location: payload-main/test/admin/globals/NotInView.ts

```typescript
import type { GlobalConfig } from 'payload'

import { notInViewGlobalSlug } from '../slugs.js'

export const GlobalNotInView: GlobalConfig = {
  slug: notInViewGlobalSlug,
  admin: {
    group: false,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: Settings.ts]---
Location: payload-main/test/admin/globals/Settings.ts

```typescript
import type { GlobalConfig } from 'payload'

import { settingsGlobalSlug } from '../slugs.js'

export const Settings: GlobalConfig = {
  slug: settingsGlobalSlug,
  fields: [
    {
      type: 'checkbox',
      name: 'canAccessProtected',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: emptyModule.js]---
Location: payload-main/test/admin/mocks/emptyModule.js

```javascript
export default {}
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/test/admin-bar/.gitignore

```text
/media
/media-gif
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: payload-main/test/admin-bar/config.ts

```typescript
import { fileURLToPath } from 'node:url'
import path from 'path'

import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import { devUser } from '../credentials.js'
import { MediaCollection } from './collections/Media/index.js'
import { PostsCollection, postsSlug } from './collections/Posts/index.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfigWithDefaults({
  // ...extend config here
  collections: [PostsCollection, MediaCollection],
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  onInit: async (payload) => {
    await payload.create({
      collection: 'users',
      data: {
        email: devUser.email,
        password: devUser.password,
      },
    })

    await payload.create({
      collection: postsSlug,
      data: {
        title: 'example post',
      },
    })
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
```

--------------------------------------------------------------------------------

---[FILE: e2e.spec.ts]---
Location: payload-main/test/admin-bar/e2e.spec.ts

```typescript
import type { Page } from '@playwright/test'

import { expect, test } from '@playwright/test'
import * as path from 'path'
import { fileURLToPath } from 'url'

import { ensureCompilationIsDone, initPageConsoleErrorCatch } from '../helpers.js'
import { AdminUrlUtil } from '../helpers/adminUrlUtil.js'
import { initPayloadE2ENoConfig } from '../helpers/initPayloadE2ENoConfig.js'
import { TEST_TIMEOUT_LONG } from '../playwright.config.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

test.describe('Admin Bar', () => {
  let page: Page
  let url: AdminUrlUtil
  let serverURL: string

  test.beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)

    const { payload, serverURL: incomingServerURL } = await initPayloadE2ENoConfig({ dirname })
    url = new AdminUrlUtil(incomingServerURL, 'posts')
    serverURL = incomingServerURL

    const context = await browser.newContext()
    page = await context.newPage()
    initPageConsoleErrorCatch(page)
    await ensureCompilationIsDone({ page, serverURL: incomingServerURL })
  })

  test('should render admin bar', async () => {
    await page.goto(`${serverURL}/admin-bar`)
    await expect(page.locator('#payload-admin-bar')).toBeVisible()
  })
})
```

--------------------------------------------------------------------------------

---[FILE: next-env.d.ts]---
Location: payload-main/test/admin-bar/next-env.d.ts

```typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
```

--------------------------------------------------------------------------------

---[FILE: next.config.mjs]---
Location: payload-main/test/admin-bar/next.config.mjs

```text
import nextConfig from '../../next.config.mjs'

import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

export default {
  ...nextConfig,
  env: {
    PAYLOAD_CORE_DEV: 'true',
    ROOT_DIR: path.resolve(dirname),
  },
}
```

--------------------------------------------------------------------------------

---[FILE: payload-types.ts]---
Location: payload-main/test/admin-bar/payload-types.ts

```typescript
/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

/**
 * Supported timezones in IANA format.
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "supportedTimezones".
 */
export type SupportedTimezones =
  | 'Pacific/Midway'
  | 'Pacific/Niue'
  | 'Pacific/Honolulu'
  | 'Pacific/Rarotonga'
  | 'America/Anchorage'
  | 'Pacific/Gambier'
  | 'America/Los_Angeles'
  | 'America/Tijuana'
  | 'America/Denver'
  | 'America/Phoenix'
  | 'America/Chicago'
  | 'America/Guatemala'
  | 'America/New_York'
  | 'America/Bogota'
  | 'America/Caracas'
  | 'America/Santiago'
  | 'America/Buenos_Aires'
  | 'America/Sao_Paulo'
  | 'Atlantic/South_Georgia'
  | 'Atlantic/Azores'
  | 'Atlantic/Cape_Verde'
  | 'Europe/London'
  | 'Europe/Berlin'
  | 'Africa/Lagos'
  | 'Europe/Athens'
  | 'Africa/Cairo'
  | 'Europe/Moscow'
  | 'Asia/Riyadh'
  | 'Asia/Dubai'
  | 'Asia/Baku'
  | 'Asia/Karachi'
  | 'Asia/Tashkent'
  | 'Asia/Calcutta'
  | 'Asia/Dhaka'
  | 'Asia/Almaty'
  | 'Asia/Jakarta'
  | 'Asia/Bangkok'
  | 'Asia/Shanghai'
  | 'Asia/Singapore'
  | 'Asia/Tokyo'
  | 'Asia/Seoul'
  | 'Australia/Brisbane'
  | 'Australia/Sydney'
  | 'Pacific/Guam'
  | 'Pacific/Noumea'
  | 'Pacific/Auckland'
  | 'Pacific/Fiji';

export interface Config {
  auth: {
    users: UserAuthOperations;
  };
  blocks: {};
  collections: {
    posts: Post;
    media: Media;
    users: User;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  collectionsJoins: {};
  collectionsSelect: {
    posts: PostsSelect<false> | PostsSelect<true>;
    media: MediaSelect<false> | MediaSelect<true>;
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
  title?: string | null;
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
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
  sizes?: {
    thumbnail?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
    medium?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
    large?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
  };
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
  title?: T;
  updatedAt?: T;
  createdAt?: T;
  _status?: T;
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
  sizes?:
    | T
    | {
        thumbnail?:
          | T
          | {
              url?: T;
              width?: T;
              height?: T;
              mimeType?: T;
              filesize?: T;
              filename?: T;
            };
        medium?:
          | T
          | {
              url?: T;
              width?: T;
              height?: T;
              mimeType?: T;
              filesize?: T;
              filename?: T;
            };
        large?:
          | T
          | {
              url?: T;
              width?: T;
              height?: T;
              mimeType?: T;
              filesize?: T;
              filename?: T;
            };
      };
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
  // @ts-ignore 
  export interface GeneratedTypes extends Config {}
}
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.eslint.json]---
Location: payload-main/test/admin-bar/tsconfig.eslint.json

```json
{
  // extend your base config to share compilerOptions, etc
  //"extends": "./tsconfig.json",
  "compilerOptions": {
    // ensure that nobody can accidentally use this config for a build
    "noEmit": true
  },
  "include": [
    // whatever paths you intend to lint
    "./**/*.ts",
    "./**/*.tsx"
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/test/admin-bar/tsconfig.json
Signals: Next.js

```json
{
  "extends": "../tsconfig.json",
  "include": ["next-env.d.ts", ".next/types/**/*.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

--------------------------------------------------------------------------------

---[FILE: types.d.ts]---
Location: payload-main/test/admin-bar/types.d.ts

```typescript
import type { RequestContext as OriginalRequestContext } from 'payload'

declare module 'payload' {
  // Create a new interface that merges your additional fields with the original one
  export interface RequestContext extends OriginalRequestContext {
    myObject?: string
    // ...
  }
}
```

--------------------------------------------------------------------------------

---[FILE: custom.scss]---
Location: payload-main/test/admin-bar/app/(payload)/custom.scss

```text
#custom-css {
  font-family: monospace;
}

#custom-css::after {
  content: 'custom-css';
}
```

--------------------------------------------------------------------------------

---[FILE: layout.tsx]---
Location: payload-main/test/admin-bar/app/(payload)/layout.tsx
Signals: React

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { ServerFunctionClient } from 'payload'

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
Location: payload-main/test/admin-bar/app/(payload)/admin/importMap.js

```javascript
export const importMap = {}
```

--------------------------------------------------------------------------------

---[FILE: not-found.tsx]---
Location: payload-main/test/admin-bar/app/(payload)/admin/[[...segments]]/not-found.tsx
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
Location: payload-main/test/admin-bar/app/(payload)/admin/[[...segments]]/page.tsx
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
Location: payload-main/test/admin-bar/app/(payload)/api/graphql/route.ts

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
Location: payload-main/test/admin-bar/app/(payload)/api/graphql-playground/route.ts

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import { GRAPHQL_PLAYGROUND_GET } from '@payloadcms/next/routes/index.js'

export const GET = GRAPHQL_PLAYGROUND_GET(config)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: payload-main/test/admin-bar/app/(payload)/api/[...slug]/route.ts

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import { REST_DELETE, REST_GET, REST_OPTIONS, REST_PATCH, REST_POST } from '@payloadcms/next/routes'

export const GET = REST_GET(config)
export const POST = REST_POST(config)
export const DELETE = REST_DELETE(config)
export const PATCH = REST_PATCH(config)
export const OPTIONS = REST_OPTIONS(config)
```

--------------------------------------------------------------------------------

---[FILE: app.scss]---
Location: payload-main/test/admin-bar/app/admin-bar/app.scss

```text
:root {
  --font-body: system-ui;
}

* {
  box-sizing: border-box;
}

html {
  -webkit-font-smoothing: antialiased;
}

html,
body,
#app {
  height: 100%;
}

body {
  font-family: var(--font-body);
  margin: 0;
}
```

--------------------------------------------------------------------------------

---[FILE: layout.tsx]---
Location: payload-main/test/admin-bar/app/admin-bar/layout.tsx
Signals: React, Next.js

```typescript
import type { Metadata } from 'next'

import { PayloadAdminBar } from '@payloadcms/admin-bar'
import React from 'react'

import './app.scss'

export const metadata: Metadata = {
  description: 'Payload Admin Bar',
  title: 'Payload Admin Bar',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PayloadAdminBar
          adminPath="/admin"
          apiPath="/api"
          cmsURL="http://localhost:3000"
          collection="pages"
          devMode
          id="1"
        />
        {children}
      </body>
    </html>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: payload-main/test/admin-bar/app/admin-bar/page.tsx
Signals: React

```typescript
import { Fragment } from 'react'

const PageTemplate = () => {
  return (
    <Fragment>
      <br />
      <h1>Payload Admin Bar</h1>
    </Fragment>
  )
}

export default PageTemplate
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/admin-bar/collections/Media/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const mediaSlug = 'media'

export const MediaCollection: CollectionConfig = {
  slug: mediaSlug,
  access: {
    create: () => true,
    read: () => true,
  },
  fields: [],
  upload: {
    crop: true,
    focalPoint: true,
    imageSizes: [
      {
        name: 'thumbnail',
        height: 200,
        width: 200,
      },
      {
        name: 'medium',
        height: 800,
        width: 800,
      },
      {
        name: 'large',
        height: 1200,
        width: 1200,
      },
    ],
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/admin-bar/collections/Posts/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const postsSlug = 'posts'

export const PostsCollection: CollectionConfig = {
  slug: postsSlug,
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
  ],
  versions: {
    drafts: true,
  },
}
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/test/admin-root/.gitignore

```text
/media
/media-gif
app/(payload)/admin/importMap.js
/app/(payload)/admin/importMap.js
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: payload-main/test/admin-root/config.ts

```typescript
import { fileURLToPath } from 'node:url'
import path from 'path'

import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import { devUser } from '../credentials.js'
import { PostsCollection, postsSlug } from './collections/Posts/index.js'
import { MenuGlobal } from './globals/Menu/index.js'
import { adminRoute } from './shared.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfigWithDefaults({
  collections: [PostsCollection],
  admin: {
    autoLogin: {
      email: devUser.email,
      password: devUser.password,
      prefillOnly: true,
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    theme: 'dark',
    components: {
      views: {
        CustomDefaultView: {
          Component: '/CustomView/index.js#CustomView',
          path: '/custom-view',
        },
      },
    },
  },
  cors: ['http://localhost:3000', 'http://localhost:3001'],
  globals: [MenuGlobal],
  routes: {
    admin: adminRoute,
  },
  onInit: async (payload) => {
    await payload.create({
      collection: 'users',
      data: {
        email: devUser.email,
        password: devUser.password,
      },
    })

    await payload.create({
      collection: postsSlug,
      data: {
        text: 'example post',
      },
    })
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
```

--------------------------------------------------------------------------------

---[FILE: e2e.spec.ts]---
Location: payload-main/test/admin-root/e2e.spec.ts

```typescript
import type { BrowserContext, Page } from '@playwright/test'

import { expect, test } from '@playwright/test'
import * as path from 'path'
import { adminRoute } from 'shared.js'
import { fileURLToPath } from 'url'

import {
  ensureCompilationIsDone,
  initPageConsoleErrorCatch,
  saveDocAndAssert,
  // throttleTest,
} from '../helpers.js'
import { AdminUrlUtil } from '../helpers/adminUrlUtil.js'
import { login } from '../helpers/e2e/auth/login.js'
import { initPayloadE2ENoConfig } from '../helpers/initPayloadE2ENoConfig.js'
import { TEST_TIMEOUT_LONG } from '../playwright.config.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
let context: BrowserContext

test.describe('Admin Panel (Root)', () => {
  let page: Page
  let url: AdminUrlUtil

  test.beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)

    const { serverURL } = await initPayloadE2ENoConfig({ dirname })
    url = new AdminUrlUtil(serverURL, 'posts', {
      admin: adminRoute,
    })

    context = await browser.newContext()
    page = await context.newPage()
    initPageConsoleErrorCatch(page)

    await ensureCompilationIsDone({
      customRoutes: {
        admin: adminRoute,
      },
      page,
      serverURL,
      noAutoLogin: true,
    })

    await login({ page, serverURL, customRoutes: { admin: adminRoute } })

    await ensureCompilationIsDone({
      customRoutes: {
        admin: adminRoute,
      },
      page,
      serverURL,
    })
  })

  // test.beforeEach(async () => {
  //   await throttleTest({
  //     page,
  //     context,
  //     delay: 'Fast 4G',
  //   })
  // })

  test('should redirect `${adminRoute}/collections` to `${adminRoute}', async () => {
    const collectionsURL = `${url.admin}/collections`
    await page.goto(collectionsURL)
    // Should redirect to dashboard
    await expect.poll(() => page.url()).toBe(`${url.admin}`)
  })

  test('renders admin panel at root', async () => {
    await page.goto(url.admin)
    const pageURL = page.url()
    expect(pageURL).toBe(url.admin)
    expect(pageURL).not.toContain('/admin')
  })

  test('collection — navigates to list view', async () => {
    await page.goto(url.list)
    const pageURL = page.url()
    expect(pageURL).toContain(url.list)
    expect(pageURL).not.toContain('/admin')
  })

  test('collection — renders versions list', async () => {
    await page.goto(url.create)
    const textField = page.locator('#field-text')
    await textField.fill('test')
    await saveDocAndAssert(page)

    const versionsTab = page.locator('a.doc-tab[href$="/versions"]')
    await versionsTab.click()
    const firstRow = page.locator('tbody .row-1')
    await expect(firstRow).toBeVisible()
  })

  test('collection - should hide Copy To Locale button when localization is false', async () => {
    await page.goto(url.create)
    const textField = page.locator('#field-text')
    await textField.fill('test')
    await saveDocAndAssert(page)
    await page.locator('.doc-controls__popup >> .popup-button').click()
    await expect(page.locator('#copy-locale-data__button')).toBeHidden()
  })

  test('global — navigates to edit view', async () => {
    await page.goto(url.global('menu'))
    const pageURL = page.url()
    expect(pageURL).toBe(url.global('menu'))
    expect(pageURL).not.toContain('/admin')
  })

  test('global — renders versions list', async () => {
    await page.goto(url.global('menu'))
    const textField = page.locator('#field-globalText')
    await textField.fill('updated global text')
    await saveDocAndAssert(page)

    await page.goto(`${url.global('menu')}/versions`)
    const firstRow = page.locator('tbody .row-1')
    await expect(firstRow).toBeVisible()
  })

  test('ui - should render default payload favicons', async () => {
    await page.goto(url.admin)
    const favicons = page.locator('link[rel="icon"][type="image/png"]')
    await expect(favicons).toHaveCount(2)
    await expect(favicons.nth(0)).toHaveAttribute('sizes', '32x32')
    await expect(favicons.nth(1)).toHaveAttribute('sizes', '32x32')
    await expect(favicons.nth(1)).toHaveAttribute('media', '(prefers-color-scheme: dark)')
    await expect(favicons.nth(1)).toHaveAttribute('href', /\/payload-favicon-light\.[a-z\d]+\.png/)
  })

  test('config.admin.theme should restrict the theme', async () => {
    await page.goto(url.account)
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    await expect(page.locator('#field-theme')).toBeHidden()
    await expect(page.locator('#field-theme-auto')).toBeHidden()
  })

  test('should mount custom root views', async () => {
    await page.goto(`${url.admin}/custom-view`)
    await expect(page.locator('#custom-view')).toBeVisible()
  })

  test('should close modal on route change', async () => {
    await page.goto(url.create)
    const textField = page.locator('#field-text')
    await textField.fill('updated')
    await page.click('a[aria-label="Account"]')
    const modal = page.locator('div.payload__modal-container')
    await expect(modal).toBeVisible()

    await page.goBack()
    await expect(modal).toBeHidden()
  })
})
```

--------------------------------------------------------------------------------

---[FILE: int.spec.ts]---
Location: payload-main/test/admin-root/int.spec.ts

```typescript
import type { Payload } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

import type { NextRESTClient } from '../helpers/NextRESTClient.js'

import { devUser } from '../credentials.js'
import { initPayloadInt } from '../helpers/initPayloadInt.js'
import { postsSlug } from './collections/Posts/index.js'

let payload: Payload
let token: string
let restClient: NextRESTClient

const { email, password } = devUser

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

describe('Admin (Root) Tests', () => {
  // --__--__--__--__--__--__--__--__--__
  // Boilerplate test setup/teardown
  // --__--__--__--__--__--__--__--__--__
  beforeAll(async () => {
    const initialized = await initPayloadInt(dirname)
    ;({ payload, restClient } = initialized)

    const data = await restClient
      .POST('/users/login', {
        body: JSON.stringify({
          email,
          password,
        }),
      })
      .then((res) => res.json())

    token = data.token
  })

  afterAll(async () => {
    await payload.destroy()
  })

  // --__--__--__--__--__--__--__--__--__
  // You can run tests against the local API or the REST API
  // use the tests below as a guide
  // --__--__--__--__--__--__--__--__--__

  it('local API example', async () => {
    const newPost = await payload.create({
      collection: postsSlug,
      data: {
        text: 'LOCAL API EXAMPLE',
      },
    })

    expect(newPost.text).toEqual('LOCAL API EXAMPLE')
  })

  it('rest API example', async () => {
    const data = await restClient
      .POST(`/${postsSlug}`, {
        body: JSON.stringify({
          text: 'REST API EXAMPLE',
        }),
        headers: {
          Authorization: `JWT ${token}`,
        },
      })
      .then((res) => res.json())

    expect(data.doc.text).toEqual('REST API EXAMPLE')
  })
})
```

--------------------------------------------------------------------------------

---[FILE: next-env.d.ts]---
Location: payload-main/test/admin-root/next-env.d.ts

```typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
```

--------------------------------------------------------------------------------

---[FILE: next.config.mjs]---
Location: payload-main/test/admin-root/next.config.mjs

```text
import bundleAnalyzer from '@next/bundle-analyzer'

import { withPayload } from '../../packages/next/src/withPayload/withPayload.js'
import path from 'path'
import { fileURLToPath } from 'url'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

export default withBundleAnalyzer(
  withPayload({
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    images: {
      remotePatterns: [
        {
          hostname: 'localhost',
        },
      ],
    },
    env: {
      PAYLOAD_CORE_DEV: 'true',
      ROOT_DIR: path.resolve(dirname),
    },
    webpack: (webpackConfig) => {
      webpackConfig.resolve.extensionAlias = {
        '.cjs': ['.cts', '.cjs'],
        '.js': ['.ts', '.tsx', '.js', '.jsx'],
        '.mjs': ['.mts', '.mjs'],
      }

      return webpackConfig
    },
  }),
)
```

--------------------------------------------------------------------------------

````
