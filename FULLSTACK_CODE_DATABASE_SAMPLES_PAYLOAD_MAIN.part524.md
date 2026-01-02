---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 524
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 524 of 695)

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

---[FILE: tsconfig.json]---
Location: payload-main/test/admin-root/tsconfig.json
Signals: Next.js

```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@payload-config": ["./config.ts"],
      "@payloadcms/ui/assets": ["../../packages/ui/src/assets/index.ts"],
      "@payloadcms/ui/elements/*": ["../../packages/ui/src/elements/*/index.tsx"],
      "@payloadcms/ui/fields/*": ["../../packages/ui/src/fields/*/index.tsx"],
      "@payloadcms/ui/forms/*": ["../../packages/ui/src/forms/*/index.tsx"],
      "@payloadcms/ui/graphics/*": ["../../packages/ui/src/graphics/*/index.tsx"],
      "@payloadcms/ui/hooks/*": ["../../packages/ui/src/hooks/*.ts"],
      "@payloadcms/ui/icons/*": ["../../packages/ui/src/icons/*/index.tsx"],
      "@payloadcms/ui/providers/*": ["../../packages/ui/src/providers/*/index.tsx"],
      "@payloadcms/ui/templates/*": ["../../packages/ui/src/templates/*/index.tsx"],
      "@payloadcms/ui/utilities/*": ["../../packages/ui/src/utilities/*.ts"],
      "@payloadcms/ui/scss": ["../../packages/ui/src/scss.scss"],
      "@payloadcms/ui/scss/app.scss": ["../../packages/ui/src/scss/app.scss"],
      "payload/types": ["../../packages/payload/src/exports/types.ts"],
      "@payloadcms/next/*": ["../../packages/next/src/*"],
      "@payloadcms/next": ["../../packages/next/src/exports/*"]
    }
  },
  "include": ["next-env.d.ts", ".next/types/**/*.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

--------------------------------------------------------------------------------

---[FILE: importMap.js]---
Location: payload-main/test/admin-root/app/(payload)/importMap.js

```javascript
import { CustomView as CustomView_c4f0e2747eca2be436a06a63cea31567 } from '../../CustomView/index.js'

export const importMap = {
  '/CustomView/index.js#CustomView': CustomView_c4f0e2747eca2be436a06a63cea31567,
}
```

--------------------------------------------------------------------------------

---[FILE: layout.tsx]---
Location: payload-main/test/admin-root/app/(payload)/layout.tsx
Signals: React

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { ServerFunctionClient } from 'payload'

import config from '@payload-config'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import React from 'react'

import { importMap } from './importMap.js'
import '@payloadcms/next/css'
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

---[FILE: ignore]---
Location: payload-main/test/admin-root/app/(payload)/admin/ignore

```text
This is just an empty file to ensure the /admin folder is present in git
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: payload-main/test/admin-root/app/(payload)/api/graphql/route.ts

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
Location: payload-main/test/admin-root/app/(payload)/api/graphql-playground/route.ts

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import { GRAPHQL_PLAYGROUND_GET } from '@payloadcms/next/routes'

export const GET = GRAPHQL_PLAYGROUND_GET(config)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: payload-main/test/admin-root/app/(payload)/api/[...slug]/route.ts

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

---[FILE: not-found.tsx]---
Location: payload-main/test/admin-root/app/(payload)/[[...segments]]/not-found.tsx
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
Location: payload-main/test/admin-root/app/(payload)/[[...segments]]/page.tsx
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
Location: payload-main/test/admin-root/app/my-route/route.ts

```typescript
export const GET = () => {
  return Response.json({
    hello: 'elliot',
  })
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/admin-root/collections/Posts/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const postsSlug = 'posts'

export const PostsCollection: CollectionConfig = {
  slug: postsSlug,
  admin: {
    useAsTitle: 'text',
  },
  fields: [
    {
      name: 'text',
      type: 'text',
    },
  ],
  versions: {
    drafts: true,
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin-root/CustomView/index.tsx

```typescript
import type { AdminViewServerProps } from 'payload'

export function CustomView(args: AdminViewServerProps) {
  return <div id="custom-view">Hello, world!</div>
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/admin-root/globals/Menu/index.ts

```typescript
import type { GlobalConfig } from 'payload'

export const menuSlug = 'menu'

export const MenuGlobal: GlobalConfig = {
  slug: menuSlug,
  versions: {
    drafts: false,
  },
  fields: [
    {
      name: 'globalText',
      type: 'text',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: layout.tsx]---
Location: payload-main/test/app/(app)/layout.tsx
Signals: React

```typescript
import React from 'react'

export const metadata = {
  description: 'Generated by Next.js',
  title: 'Next.js',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: payload-main/test/app/(app)/test/page.tsx

```typescript
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const Page = async ({ params, searchParams }) => {
  const payload = await getPayload({
    config: configPromise,
  })
  return <div>test ${payload?.config?.collections?.length}</div>
}

export default Page
```

--------------------------------------------------------------------------------

---[FILE: custom.scss]---
Location: payload-main/test/app/(payload)/custom.scss

```text
#custom-css {
  font-family: monospace;
  background-image: url('/placeholder.png');
}

#custom-css::after {
  content: 'custom-css';
}
```

--------------------------------------------------------------------------------

---[FILE: layout.tsx]---
Location: payload-main/test/app/(payload)/layout.tsx
Signals: React

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { ServerFunctionClient } from 'payload'

import config from '@payload-config'
import '@payloadcms/next/css'
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

---[FILE: not-found.tsx]---
Location: payload-main/test/app/(payload)/admin/[[...segments]]/not-found.tsx
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
Location: payload-main/test/app/(payload)/admin/[[...segments]]/page.tsx
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
Location: payload-main/test/app/(payload)/api/graphql/route.ts

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
Location: payload-main/test/app/(payload)/api/graphql-playground/route.ts

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import { GRAPHQL_PLAYGROUND_GET } from '@payloadcms/next/routes'

export const GET = GRAPHQL_PLAYGROUND_GET(config)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: payload-main/test/app/(payload)/api/[...slug]/route.ts

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

---[FILE: route.ts]---
Location: payload-main/test/app/my-route/route.ts

```typescript
export const GET = () => {
  return Response.json({
    hello: 'elliot',
  })
}
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: payload-main/test/array-update/config.ts

```typescript
import { fileURLToPath } from 'node:url'
import path from 'path'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import { devUser } from '../credentials.js'
import { arraySlug } from './shared.js'

export default buildConfigWithDefaults({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    {
      slug: arraySlug,
      fields: [
        {
          name: 'arrayOfFields',
          type: 'array',
          admin: {
            initCollapsed: true,
          },
          fields: [
            {
              name: 'required',
              type: 'text',
              required: true,
            },
            {
              name: 'optional',
              type: 'text',
            },
            {
              name: 'innerArrayOfFields',
              type: 'array',
              fields: [
                {
                  name: 'required',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'optional',
                  type: 'text',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  onInit: async (payload) => {
    await payload.create({
      collection: 'users',
      data: {
        email: devUser.email,
        password: devUser.password,
      },
    })
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
```

--------------------------------------------------------------------------------

---[FILE: int.spec.ts]---
Location: payload-main/test/array-update/int.spec.ts

```typescript
import type { Payload } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

import { initPayloadInt } from '../helpers/initPayloadInt.js'
import { arraySlug } from './shared.js'

let payload: Payload

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

describe('array-update', () => {
  beforeAll(async () => {
    ;({ payload } = await initPayloadInt(dirname))
  })

  afterAll(async () => {
    await payload.destroy()
  })

  it('should persist existing array-based data while updating and passing row ID', async () => {
    const originalText = 'some optional text'

    const doc = await payload.create({
      collection: arraySlug,
      data: {
        arrayOfFields: [
          {
            optional: originalText,
            required: 'a required field here',
          },
          {
            optional: 'this is cool',
            required: 'another required field here',
          },
        ],
      },
    })

    const arrayWithExistingValues = [...doc.arrayOfFields]

    const updatedText = 'this is some new text for the first item in array'

    arrayWithExistingValues[0] = {
      id: arrayWithExistingValues[0].id,
      required: updatedText,
    }

    const updatedDoc = await payload.update({
      id: doc.id,
      collection: arraySlug,
      data: {
        arrayOfFields: arrayWithExistingValues,
      },
    })

    expect(updatedDoc.arrayOfFields?.[0]).toMatchObject({
      optional: originalText,
      required: updatedText,
    })
  })

  it('should disregard existing array-based data while updating and NOT passing row ID', async () => {
    const updatedText = 'here is some new text'

    const secondArrayItem = {
      optional: 'optional test',
      required: 'test',
    }

    const doc = await payload.create({
      collection: arraySlug,
      data: {
        arrayOfFields: [
          {
            optional: 'some optional text',
            required: 'a required field here',
          },
          secondArrayItem,
        ],
      },
    })

    const updatedDoc = await payload.update({
      id: doc.id,
      collection: arraySlug,
      data: {
        arrayOfFields: [
          {
            required: updatedText,
          },
          {
            id: doc.arrayOfFields?.[1].id,
            required: doc.arrayOfFields?.[1].required,
            // NOTE - not passing optional field. It should persist
            // because we're passing ID
          },
        ],
      },
    })

    expect(updatedDoc.arrayOfFields?.[0].required).toStrictEqual(updatedText)
    expect(updatedDoc.arrayOfFields?.[0].optional).toBeFalsy()

    expect(updatedDoc.arrayOfFields?.[1]).toMatchObject(secondArrayItem)
  })
})
```

--------------------------------------------------------------------------------

---[FILE: payload-types.ts]---
Location: payload-main/test/array-update/payload-types.ts

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
    arrays: Array;
    users: User;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  collectionsJoins: {};
  collectionsSelect: {
    arrays: ArraysSelect<false> | ArraysSelect<true>;
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
 * via the `definition` "arrays".
 */
export interface Array {
  id: string;
  arrayOfFields?:
    | {
        required: string;
        optional?: string | null;
        innerArrayOfFields?:
          | {
              required: string;
              optional?: string | null;
              id?: string | null;
            }[]
          | null;
        id?: string | null;
      }[]
    | null;
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
        relationTo: 'arrays';
        value: string | Array;
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
 * via the `definition` "arrays_select".
 */
export interface ArraysSelect<T extends boolean = true> {
  arrayOfFields?:
    | T
    | {
        required?: T;
        optional?: T;
        innerArrayOfFields?:
          | T
          | {
              required?: T;
              optional?: T;
              id?: T;
            };
        id?: T;
      };
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
  // @ts-ignore 
  export interface GeneratedTypes extends Config {}
}
```

--------------------------------------------------------------------------------

---[FILE: shared.ts]---
Location: payload-main/test/array-update/shared.ts

```typescript
export const arraySlug = 'arrays'
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.eslint.json]---
Location: payload-main/test/array-update/tsconfig.eslint.json

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
Location: payload-main/test/array-update/tsconfig.json

```json
{
  "extends": "../tsconfig.json"
}
```

--------------------------------------------------------------------------------

---[FILE: AuthDebug.tsx]---
Location: payload-main/test/auth/AuthDebug.tsx
Signals: React

```typescript
'use client'

import type { UIField, User } from 'payload'

import { useAuth } from '@payloadcms/ui'
import React, { useEffect, useState } from 'react'

export const AuthDebug: React.FC<UIField> = () => {
  const [state, setState] = useState<User | null | undefined>()
  const { user } = useAuth()

  useEffect(() => {
    const fetchUser = async () => {
      const userRes = await fetch(`/api/users/${user?.id}`)?.then((res) => res.json())
      setState(userRes)
    }

    if (user?.id) {
      void fetchUser()
    }
  }, [user])

  return (
    <div id="auth-debug">
      <div id="use-auth-result">{user?.custom as string}</div>
      <div id="users-api-result">{state?.custom as string}</div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: BeforeDashboard.tsx]---
Location: payload-main/test/auth/BeforeDashboard.tsx

```typescript
'use client'

import { useConfig } from '@payloadcms/ui'

export const BeforeDashboard = () => {
  const { config } = useConfig()

  return (
    <p
      id="authenticated-client-config"
      style={{ opacity: 0, pointerEvents: 'none', position: 'absolute' }}
    >
      {JSON.stringify(config, null, 2)}
    </p>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: BeforeLogin.tsx]---
Location: payload-main/test/auth/BeforeLogin.tsx

```typescript
'use client'

import { useConfig } from '@payloadcms/ui'

export const BeforeLogin = () => {
  const { config } = useConfig()

  return (
    <p
      id="unauthenticated-client-config"
      style={{ opacity: 0, pointerEvents: 'none', position: 'absolute' }}
    >
      {JSON.stringify(config, null, 2)}
    </p>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: payload-main/test/auth/config.ts

```typescript
import { fileURLToPath } from 'node:url'
import path from 'path'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import { devUser } from '../credentials.js'
import { seed } from './seed.js'
import {
  apiKeysSlug,
  namedSaveToJWTValue,
  partialDisableLocalStrategiesSlug,
  publicUsersSlug,
  saveToJWTKey,
  slug,
} from './shared.js'

export default buildConfigWithDefaults({
  admin: {
    autoLogin: {
      email: devUser.email,
      password: devUser.password,
      prefillOnly: true,
    },
    autoRefresh: true,
    components: {
      beforeDashboard: ['./BeforeDashboard.js#BeforeDashboard'],
      beforeLogin: ['./BeforeLogin.js#BeforeLogin'],
      views: {
        'create-first-user': {
          Component: './CreateFirstUser.js#CreateFirstUser',
          path: '/create-first-user',
          exact: true,
        },
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: 'users',
  },
  collections: [
    {
      slug,
      admin: {
        useAsTitle: 'custom',
      },
      auth: {
        cookies: {
          domain: undefined,
          sameSite: 'Lax',
          secure: false,
        },
        depth: 0,
        lockTime: 600 * 1000, // lock time in ms
        maxLoginAttempts: 2,
        tokenExpiration: 7200, // 2 hours
        useAPIKey: true,
        verify: false,
        forgotPassword: {
          expiration: 300000, // 5 minutes
        },
      },
      fields: [
        {
          name: 'adminOnlyField',
          type: 'text',
          access: {
            read: ({ req: { user } }) => {
              return user?.roles?.includes('admin')
            },
          },
        },
        {
          name: 'roles',
          type: 'select',
          defaultValue: ['user'],
          hasMany: true,
          label: 'Role',
          options: ['admin', 'editor', 'moderator', 'user', 'viewer'],
          required: true,
          saveToJWT: true,
        },
        {
          name: 'namedSaveToJWT',
          type: 'text',
          defaultValue: namedSaveToJWTValue,
          label: 'Named Save To JWT',
          saveToJWT: saveToJWTKey,
        },
        {
          name: 'richText',
          type: 'richText',
        },
        {
          name: 'group',
          type: 'group',
          fields: [
            {
              name: 'liftedSaveToJWT',
              type: 'text',
              defaultValue: 'lifted from group',
              label: 'Lifted Save To JWT',
              saveToJWT: 'x-lifted-from-group',
            },
          ],
        },
        {
          name: 'groupSaveToJWT',
          type: 'group',
          fields: [
            {
              name: 'saveToJWTString',
              type: 'text',
              defaultValue: 'nested property',
              label: 'Save To JWT String',
              saveToJWT: 'x-test',
            },
            {
              name: 'saveToJWTFalse',
              type: 'text',
              defaultValue: 'nested property',
              label: 'Save To JWT False',
              saveToJWT: false,
            },
          ],
          label: 'Group Save To JWT',
          saveToJWT: 'x-group',
        },
        {
          type: 'tabs',
          tabs: [
            {
              name: 'saveToJWTTab',
              fields: [
                {
                  name: 'test',
                  type: 'text',
                  defaultValue: 'yes',
                  saveToJWT: 'x-field',
                },
              ],
              label: 'Save To JWT Tab',
              saveToJWT: true,
            },
            {
              name: 'tabSaveToJWTString',
              fields: [
                {
                  name: 'includedByDefault',
                  type: 'text',
                  defaultValue: 'yes',
                },
              ],
              label: 'Tab Save To JWT String',
              saveToJWT: 'tab-test',
            },
            {
              fields: [
                {
                  name: 'tabLiftedSaveToJWT',
                  type: 'text',
                  defaultValue: 'lifted from unnamed tab',
                  label: 'Tab Lifted Save To JWT',
                  saveToJWT: true,
                },
                {
                  name: 'unnamedTabSaveToJWTString',
                  type: 'text',
                  defaultValue: 'text',
                  label: 'Unnamed Tab Save To JWT String',
                  saveToJWT: 'x-tab-field',
                },
                {
                  name: 'unnamedTabSaveToJWTFalse',
                  type: 'text',
                  defaultValue: 'false',
                  label: 'Unnamed Tab Save To JWT False',
                  saveToJWT: false,
                },
              ],
              label: 'No Name',
            },
          ],
        },
        {
          name: 'custom',
          type: 'text',
          label: 'Custom',
        },
        {
          name: 'authDebug',
          type: 'ui',
          admin: {
            components: {
              Field: '/AuthDebug.js#AuthDebug',
            },
          },
          label: 'Auth Debug',
        },
        {
          // This is a uniquely identifiable field that we use to ensure it doesn't appear in the page source when unauthenticated
          // E.g. if the user is authenticated, it will appear in the both the client config
          name: 'shouldNotShowInClientConfigUnlessAuthenticated',
          type: 'text',
          access: {
            // Setting this forces the field to show up in the permissions object
            read: () => true,
          },
        },
      ],
    },
    {
      slug: partialDisableLocalStrategiesSlug,
      auth: {
        disableLocalStrategy: {
          // optionalPassword: true,
          enableFields: true,
        },
      },
      fields: [
        // with `enableFields: true`, the following DB columns will be created:
        // email
        // reset_password_token
        // reset_password_expiration
        // salt
        // hash
        // login_attempts
        // lock_until
      ],
    },
    {
      slug: 'disable-local-strategy-password',
      auth: { disableLocalStrategy: true },
      fields: [
        {
          name: 'password',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      slug: apiKeysSlug,
      access: {
        read: ({ req: { user } }) => {
          if (!user) {
            return false
          }
          if (user?.collection === apiKeysSlug) {
            return {
              id: {
                equals: user.id,
              },
            }
          }
          return true
        },
      },
      auth: {
        disableLocalStrategy: true,
        useAPIKey: true,
      },
      fields: [],
      labels: {
        plural: 'API Keys',
        singular: 'API Key',
      },
    },
    {
      slug: publicUsersSlug,
      auth: {
        verify: true,
      },
      fields: [],
    },
    {
      slug: 'relationsCollection',
      fields: [
        {
          name: 'rel',
          type: 'relationship',
          relationTo: 'users',
        },
        {
          name: 'text',
          type: 'text',
        },
      ],
    },
    {
      slug: 'api-keys-with-field-read-access',
      auth: {
        disableLocalStrategy: true,
        useAPIKey: true,
      },
      fields: [
        {
          name: 'enableAPIKey',
          type: 'checkbox',
          access: {
            read: () => false,
          },
        },
        {
          name: 'apiKey',
          type: 'text',
          access: {
            read: () => false,
          },
        },
      ],
      labels: {
        plural: 'API Keys With Field Read Access',
        singular: 'API Key With Field Read Access',
      },
    },
  ],
  onInit: seed,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
```

--------------------------------------------------------------------------------

---[FILE: CreateFirstUser.tsx]---
Location: payload-main/test/auth/CreateFirstUser.tsx
Signals: React

```typescript
import type { AdminViewServerProps } from 'payload'

import { CreateFirstUserView } from '@payloadcms/next/views'
import React from 'react'

export async function CreateFirstUser(props: AdminViewServerProps) {
  const builtInView = await CreateFirstUserView(props)

  return (
    <>
      <div>
        <h1 id="custom-view-override">Custom CreateFirstUser View Override</h1>
      </div>
      {builtInView}
    </>
  )
}
```

--------------------------------------------------------------------------------

````
