---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 116
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 116 of 695)

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
Location: payload-main/examples/whitelabel/README.md

```text
# Payload White-label Example

This example demonstrates how to re-brand or white-label the [Payload Admin Panel](https://payloadcms.com/docs/admin/overview#the-admin-panel) by modifying the favicon, icon, logo, ogImage and title suffix.

## Quick Start

To spin up this example locally, follow these steps:

1. Run the following command to create a project from the example:

- `npx create-payload-app --example whitelabel`

2. `cp .env.example .env` to copy the example environment variables
3. `pnpm install && pnpm dev` to install dependencies and start the dev server
4. `open http://localhost:3000/admin` to access the admin panel
5. Login with email `dev@payloadcms.com` and password `test`

## Re-branding walkthrough

Start by navigating to the `payload.config.ts` file and then take a look at the admin property.

The following sub-properties have already been configured:

`meta.icons`: Images that will be displayed as the tab icon.

`meta.openGraph.images`: Images that will appear in the preview when you share links to your admin panel online and through social media.

`meta.titleSuffix`: Text that appends the meta/page title displayed in the browser tab — _must be a string_.

`graphics.Logo`: Image component to be displayed as the logo on the Sign Up / Login view.

`graphics.Icon`: Image component displayed above the Nav in the admin panel, often a condensed version of a full logo.

👉 Check out this blog post for a more in-depth walkthrough: [White-label the Admin UI](https://payloadcms.com/blog/white-label-admin-ui)

## Development

To spin up this example locally, follow the [Quick Start](#quick-start).

### Seed

On boot, a seed script is included to create a user.

## Production

To run Payload in production, you need to build and start the Admin panel. To do so, follow these steps:

1. Invoke the `next build` script by running `pnpm build` or `npm run build` in your project root. This creates a `.next` directory with a production-ready admin bundle.
1. Finally run `pnpm start` or `npm run start` to run Node in production and serve Payload from the `.build` directory.

### Deployment

The easiest way to deploy your project is to use [Payload Cloud](https://payloadcms.com/new/import), a one-click hosting solution to deploy production-ready instances of your Payload apps directly from your GitHub repo. You can also deploy your app manually, check out the [deployment documentation](https://payloadcms.com/docs/production/deployment) for full details.

## Questions

If you have any issues or questions, reach out to us on [Discord](https://discord.com/invite/payload) or start a [GitHub discussion](https://github.com/payloadcms/payload/discussions).
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/examples/whitelabel/tsconfig.json
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
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": [
        "./src/*"
      ],
      "@payload-config": [
        "src/payload.config.ts"
      ],
      "@payload-types": [
        "src/payload-types.ts"
      ]
    },
    "target": "ES2022",
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    "src/mocks/emptyObject.js"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: favicon.svg]---
Location: payload-main/examples/whitelabel/public/assets/favicon.svg

```text
<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="216" height="218" viewBox="0 0 216 218">
<g transform="translate(0,218) scale(0.1,-0.1)"
fill="#000000" stroke="none">
<path d="M0 1095 l0 -1085 1075 0 1075 0 0 1085 0 1085 -1075 0 -1075 0 0
-1085z m1217 538 c-15 -158 -29 -434 -24 -439 3 -3 95 31 204 76 109 46 206
85 215 87 13 4 23 -14 48 -97 17 -56 29 -105 25 -108 -4 -4 -105 -32 -226 -62
-121 -30 -219 -59 -218 -65 1 -5 68 -95 150 -199 l149 -188 -84 -64 c-47 -35
-89 -64 -93 -64 -4 0 -64 97 -133 215 -69 118 -127 215 -130 215 -3 0 -61 -95
-130 -210 -84 -142 -129 -209 -138 -205 -25 9 -161 110 -161 119 -1 5 69 96
154 202 96 120 151 196 143 199 -7 2 -94 25 -193 50 -99 26 -196 51 -216 56
l-37 9 30 98 c16 53 33 100 37 105 4 4 104 -33 222 -82 118 -49 216 -87 218
-85 4 4 -17 397 -25 462 l-5 42 112 0 112 0 -6 -67z"/>
</g>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: payload-types.ts]---
Location: payload-main/examples/whitelabel/src/payload-types.ts

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
    users: User;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  collectionsJoins: {};
  collectionsSelect: {
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
  document?: {
    relationTo: 'users';
    value: string | User;
  } | null;
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
Location: payload-main/examples/whitelabel/src/payload.config.ts

```typescript
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// eslint-disable-next-line no-restricted-exports
export default buildConfig({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    // Add your own logo and icon here
    components: {
      graphics: {
        Icon: '/graphics/Icon/index.tsx#Icon',
        Logo: '/graphics/Logo/index.tsx#Logo',
      },
    },
    // Add your own meta data here
    meta: {
      description: 'This is a custom meta description',
      icons: [
        {
          type: 'image/png',
          rel: 'icon',
          url: '/assets/favicon.svg',
        },
      ],
      openGraph: {
        description: 'This is a custom OG description',
        images: [
          {
            height: 600,
            url: '/assets/ogImage.png',
            width: 800,
          },
        ],
        title: 'This is a custom OG title',
      },
      titleSuffix: '- Your App Name',
    },
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  editor: lexicalEditor({}),
  graphQL: {
    schemaOutputFile: path.resolve(dirname, 'generated-schema.graphql'),
  },
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL: 'http://localhost:3000',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
```

--------------------------------------------------------------------------------

---[FILE: layout.tsx]---
Location: payload-main/examples/whitelabel/src/app/(payload)/layout.tsx
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
Location: payload-main/examples/whitelabel/src/app/(payload)/admin/importMap.js

```javascript
import { Icon as Icon_9c1a3ff8a9adb7b1e4b7a5cd42725bdb } from 'src/graphics/Icon/index.tsx'
import { Logo as Logo_217937c36742cdefe571d11857c968fa } from 'src/graphics/Logo/index.tsx'

export const importMap = {
  '/graphics/Icon/index.tsx#Icon': Icon_9c1a3ff8a9adb7b1e4b7a5cd42725bdb,
  '/graphics/Logo/index.tsx#Logo': Logo_217937c36742cdefe571d11857c968fa,
}
```

--------------------------------------------------------------------------------

---[FILE: not-found.tsx]---
Location: payload-main/examples/whitelabel/src/app/(payload)/admin/[[...segments]]/not-found.tsx
Signals: Next.js

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'

import config from '@payload-config'
import { generatePageMetadata, NotFoundPage } from '@payloadcms/next/views'

import { importMap } from '../importMap'

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
Location: payload-main/examples/whitelabel/src/app/(payload)/admin/[[...segments]]/page.tsx
Signals: Next.js

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'

import config from '@payload-config'
import { generatePageMetadata, RootPage } from '@payloadcms/next/views'

import { importMap } from '../importMap'

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
Location: payload-main/examples/whitelabel/src/app/(payload)/api/graphql/route.ts

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
Location: payload-main/examples/whitelabel/src/app/(payload)/api/graphql-playground/route.ts

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import { GRAPHQL_PLAYGROUND_GET } from '@payloadcms/next/routes'

export const GET = GRAPHQL_PLAYGROUND_GET(config)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: payload-main/examples/whitelabel/src/app/(payload)/api/[...slug]/route.ts

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

---[FILE: index.tsx]---
Location: payload-main/examples/whitelabel/src/graphics/Icon/index.tsx
Signals: React

```typescript
import React from 'react'

const css = `
  html[data-theme="dark"] .text {
    fill: #0C0C0C;
  }

  html[data-theme="dark"] .bg {
    fill: white;
  }

  .graphic-icon {
    width: 50px;
    height: 50px;
  }
`

export const Icon = () => {
  return (
    <svg
      className="graphic-icon"
      fill="none"
      height="435"
      viewBox="0 0 430 435"
      width="430"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>{css}</style>
      <rect
        className="bg"
        fill="#0C0C0C"
        height="434"
        transform="translate(0 0.154785)"
        width="430"
      />
      <path
        className="text"
        d="M79.1562 185.75V193.297H95.1406V246.5H79.1562V254H120.406V246.5H104.047V193.297H120.406V185.75H79.1562ZM200.216 233.469H191.544C191.262 235.531 190.778 237.453 190.091 239.234C189.403 240.984 188.481 242.5 187.325 243.781C186.169 245.094 184.747 246.109 183.059 246.828C181.403 247.547 179.434 247.906 177.153 247.906C175.059 247.906 173.231 247.578 171.669 246.922C170.106 246.234 168.747 245.297 167.591 244.109C166.434 242.953 165.481 241.609 164.731 240.078C163.981 238.547 163.372 236.906 162.903 235.156C162.434 233.438 162.091 231.688 161.872 229.906C161.684 228.094 161.591 226.344 161.591 224.656V215.047C161.591 213.359 161.684 211.625 161.872 209.844C162.091 208.031 162.434 206.266 162.903 204.547C163.372 202.828 163.981 201.203 164.731 199.672C165.512 198.141 166.481 196.797 167.637 195.641C168.762 194.484 170.106 193.578 171.669 192.922C173.262 192.234 175.091 191.891 177.153 191.891C179.434 191.891 181.403 192.281 183.059 193.062C184.747 193.812 186.169 194.859 187.325 196.203C188.481 197.547 189.403 199.109 190.091 200.891C190.778 202.672 191.262 204.594 191.544 206.656H200.216C199.841 203.406 199.059 200.438 197.872 197.75C196.716 195.062 195.169 192.75 193.231 190.812C191.294 188.906 188.981 187.438 186.294 186.406C183.606 185.344 180.559 184.812 177.153 184.812C174.309 184.812 171.747 185.219 169.466 186.031C167.184 186.812 165.153 187.906 163.372 189.312C161.559 190.719 159.997 192.391 158.684 194.328C157.403 196.234 156.341 198.312 155.497 200.562C154.622 202.812 153.966 205.172 153.528 207.641C153.122 210.109 152.903 212.609 152.872 215.141V224.656C152.903 227.188 153.122 229.688 153.528 232.156C153.966 234.625 154.622 236.984 155.497 239.234C156.341 241.484 157.403 243.562 158.684 245.469C159.997 247.375 161.559 249.031 163.372 250.438C165.153 251.844 167.184 252.953 169.466 253.766C171.778 254.547 174.341 254.938 177.153 254.938C180.434 254.938 183.403 254.422 186.059 253.391C188.747 252.328 191.075 250.844 193.044 248.938C194.981 247.062 196.559 244.812 197.778 242.188C198.997 239.531 199.809 236.625 200.216 233.469ZM277.259 223.812V216.031C277.228 213.594 277.009 211.125 276.603 208.625C276.228 206.125 275.634 203.719 274.822 201.406C273.978 199.094 272.916 196.938 271.634 194.938C270.384 192.906 268.884 191.141 267.134 189.641C265.384 188.141 263.369 186.969 261.087 186.125C258.806 185.25 256.259 184.812 253.447 184.812C250.634 184.812 248.087 185.25 245.806 186.125C243.556 186.969 241.556 188.141 239.806 189.641C238.056 191.172 236.541 192.953 235.259 194.984C234.009 196.984 232.978 199.141 232.166 201.453C231.322 203.766 230.697 206.172 230.291 208.672C229.916 211.141 229.712 213.594 229.681 216.031V223.812C229.712 226.25 229.931 228.703 230.337 231.172C230.744 233.641 231.369 236.031 232.212 238.344C233.025 240.656 234.072 242.828 235.353 244.859C236.634 246.859 238.15 248.609 239.9 250.109C241.65 251.609 243.65 252.797 245.9 253.672C248.181 254.516 250.728 254.938 253.541 254.938C256.353 254.938 258.884 254.516 261.134 253.672C263.416 252.797 265.431 251.609 267.181 250.109C268.931 248.609 270.431 246.859 271.681 244.859C272.962 242.859 274.009 240.703 274.822 238.391C275.634 236.078 276.228 233.688 276.603 231.219C277.009 228.719 277.228 226.25 277.259 223.812ZM268.681 215.938V223.812C268.65 225.438 268.541 227.141 268.353 228.922C268.197 230.703 267.9 232.453 267.462 234.172C266.994 235.922 266.384 237.594 265.634 239.188C264.916 240.75 264.009 242.125 262.916 243.312C261.791 244.531 260.447 245.5 258.884 246.219C257.353 246.938 255.572 247.297 253.541 247.297C251.509 247.297 249.728 246.938 248.197 246.219C246.666 245.5 245.337 244.531 244.212 243.312C243.087 242.125 242.15 240.734 241.4 239.141C240.65 237.547 240.041 235.875 239.572 234.125C239.103 232.406 238.759 230.656 238.541 228.875C238.353 227.094 238.244 225.406 238.212 223.812V215.938C238.244 214.344 238.353 212.672 238.541 210.922C238.759 209.141 239.103 207.375 239.572 205.625C240.009 203.906 240.603 202.266 241.353 200.703C242.103 199.109 243.041 197.703 244.166 196.484C245.291 195.297 246.619 194.344 248.15 193.625C249.681 192.906 251.447 192.547 253.447 192.547C255.478 192.547 257.259 192.906 258.791 193.625C260.322 194.312 261.65 195.25 262.775 196.438C263.9 197.656 264.837 199.062 265.587 200.656C266.337 202.219 266.947 203.859 267.416 205.578C267.853 207.328 268.166 209.094 268.353 210.875C268.541 212.625 268.65 214.312 268.681 215.938ZM352.475 254V185.75H343.709L343.569 236.656L317.084 185.75H308.272V254H317.038L317.178 203L343.663 254H352.475Z"
        fill="white"
      />
    </svg>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/examples/whitelabel/src/graphics/Logo/index.tsx
Signals: React

```typescript
import React from 'react'

const css = `
  html[data-theme="dark"] path {
    fill: white;
  }

  .graphic-logo {
    width: 150px;
    height: auto;
  }`

export const Logo = () => {
  return (
    <svg
      className="graphic-logo"
      fill="#0F0F0F"
      viewBox="0 0 518 563"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style type="text/css">{css}</style>
      <g fill="#000000" stroke="none" transform="translate(0,563) scale(0.1,-0.1)">
        <path
          d="M440 3060 l0 -2170 2150 0 2150 0 0 2170 0 2170 -2150 0 -2150 0 0
          -2170z m1855 301 c52 -24 88 -63 117 -126 19 -42 23 -71 26 -182 4 -151 -8
          -213 -58 -281 -55 -77 -140 -107 -230 -83 -66 18 -105 53 -141 128 -31 61 -33
          74 -37 189 -5 145 16 233 69 298 60 72 169 97 254 57z m766 8 c74 -25 126 -85
          144 -166 l7 -33 -45 0 c-41 0 -45 2 -50 29 -15 75 -102 125 -177 102 -84 -25
          -126 -130 -118 -295 5 -109 36 -189 88 -226 39 -28 129 -31 178 -6 26 14 31
          23 37 69 4 29 5 66 3 82 -3 30 -4 30 -70 33 l-68 3 0 34 0 35 110 0 110 0 0
          -129 0 -130 -32 -24 c-54 -40 -97 -58 -154 -64 -189 -20 -311 148 -290 399 12
          141 66 241 151 279 46 21 126 24 176 8z m774 -8 c105 -49 151 -165 143 -368
          -4 -104 -7 -117 -39 -180 -41 -82 -91 -121 -164 -129 -145 -17 -241 78 -266
          264 -19 144 13 296 79 366 60 63 167 84 247 47z m-2505 -296 l0 -305 165 0
          165 0 0 -35 0 -35 -210 0 -210 0 0 340 0 340 45 0 45 0 0 -305z"
        />
        <path
          d="M2140 3286 c-80 -44 -114 -265 -64 -418 44 -135 193 -147 254 -22 22
          44 24 63 24 184 1 122 -2 140 -23 183 -13 26 -36 56 -51 67 -33 23 -102 26
          -140 6z"
        />
        <path
          d="M3667 3280 c-14 -11 -36 -41 -49 -68 -20 -42 -23 -61 -23 -177 0
          -120 2 -134 27 -187 30 -65 64 -88 129 -88 35 0 48 6 79 38 52 52 63 98 58
          257 -3 117 -6 134 -28 173 -14 24 -37 50 -52 58 -40 21 -110 18 -141 -6z"
        />
      </g>
    </svg>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: payload-main/packages/admin-bar/.prettierignore

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
Location: payload-main/packages/admin-bar/.swcrc

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
Location: payload-main/packages/admin-bar/LICENSE.md

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
Location: payload-main/packages/admin-bar/package.json
Signals: React

```json
{
  "name": "@payloadcms/admin-bar",
  "version": "3.68.5",
  "description": "An admin bar for React apps using Payload",
  "homepage": "https://payloadcms.com",
  "repository": {
    "type": "git",
    "url": "https://github.com/payloadcms/payload.git",
    "directory": "packages/admin-bar"
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
    "clean": "rimraf -g {dist,*.tsbuildinfo}",
    "copyfiles": "copyfiles -u 1 \"src/**/*.{html,css,scss,ttf,woff,woff2,eot,svg,jpg,png,json}\" dist/",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  },
  "devDependencies": {
    "@payloadcms/eslint-config": "workspace:*",
    "@types/react": "19.2.1",
    "@types/react-dom": "19.2.1",
    "payload": "workspace:*"
  },
  "peerDependencies": {
    "react": "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.1 || ^19.1.2 || ^19.2.1",
    "react-dom": "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.1 || ^19.1.2 || ^19.2.1"
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
Location: payload-main/packages/admin-bar/README.md

```text
# Payload Admin Bar

An admin bar for React apps using [Payload](https://github.com/payloadcms/payload).

### Installation

```bash
pnpm i @payloadcms/admin-bar
```

### Basic Usage

```jsx
import { PayloadAdminBar } from '@payloadcms/admin-bar'

export const App = () => {
  return <PayloadAdminBar cmsURL="https://cms.website.com" collection="pages" id="12345" />
}
```

Checks for authentication with Payload CMS by hitting the [`/me`](https://payloadcms.com/docs/authentication/operations#me) route. If authenticated, renders an admin bar with simple controls to do the following:

- Navigate to the admin dashboard
- Navigate to the currently logged-in user's account
- Edit the current collection
- Create a new collection of the same type
- Logout
- Indicate and exit preview mode

The admin bar ships with very little style and is fully customizable.

### Dynamic props

With client-side routing, we need to update the admin bar with a new collection type and document id on each route change. This will depend on your app's specific setup, but here are a some common examples:

#### NextJS

For NextJS apps using dynamic-routes, use `getStaticProps`:

```ts
export const getStaticProps = async ({ params: { slug } }) => {
  const props = {}

  const pageReq = await fetch(
    `https://cms.website.com/api/pages?where[slug][equals]=${slug}&depth=1`,
  )
  const pageData = await pageReq.json()

  if (pageReq.ok) {
    const { docs } = pageData
    const [doc] = docs

    props = {
      ...doc,
      collection: 'pages',
      collectionLabels: {
        singular: 'page',
        plural: 'pages',
      },
    }
  }

  return props
}
```

Now your app can forward these props onto the admin bar. Something like this:

```ts
import { PayloadAdminBar } from '@payloadcms/admin-bar';

export const App = (appProps) => {
  const {
    pageProps: {
      collection,
      collectionLabels,
      id
    }
  } = appProps;

  return (
    <PayloadAdminBar
      {...{
        cmsURL: 'https://cms.website.com',
        collection,
        collectionLabels,
        id
      }}
    />
  )
}
```

### Props

| Property           | Type                                                                                                                     | Required | Default                 | Description                                                                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------ | -------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| cmsURL             | `string`                                                                                                                 | true     | `http://localhost:8000` | `serverURL` as defined in your [Payload config](https://payloadcms.com/docs/configuration/overview#options)                                                |
| adminPath          | `string`                                                                                                                 | false    | /admin                  | `routes` as defined in your [Payload config](https://payloadcms.com/docs/configuration/overview#options)                                                   |
| apiPath            | `string`                                                                                                                 | false    | /api                    | `routes` as defined in your [Payload config](https://payloadcms.com/docs/configuration/overview#options)                                                   |
| authCollectionSlug | `string`                                                                                                                 | false    | 'users'                 | Slug of your [auth collection](https://payloadcms.com/docs/configuration/collections)                                                                      |
| collectionSlug     | `string`                                                                                                                 | true     | undefined               | Slug of your [collection](https://payloadcms.com/docs/configuration/collections)                                                                           |
| collectionLabels   | `{ singular?: string, plural?: string }`                                                                                 | false    | undefined               | Labels of your [collection](https://payloadcms.com/docs/configuration/collections)                                                                         |
| id                 | `string`                                                                                                                 | true     | undefined               | id of the document                                                                                                                                         |
| logo               | `ReactElement`                                                                                                           | false    | undefined               | Custom logo                                                                                                                                                |
| classNames         | `{ logo?: string, user?: string, controls?: string, create?: string, logout?: string, edit?: string, preview?: string }` | false    | undefined               | Custom class names, one for each rendered element                                                                                                          |
| logoProps          | `{[key: string]?: unknown}`                                                                                              | false    | undefined               | Custom props                                                                                                                                               |
| userProps          | `{[key: string]?: unknown}`                                                                                              | false    | undefined               | Custom props                                                                                                                                               |
| divProps           | `{[key: string]?: unknown}`                                                                                              | false    | undefined               | Custom props                                                                                                                                               |
| createProps        | `{[key: string]?: unknown}`                                                                                              | false    | undefined               | Custom props                                                                                                                                               |
| logoutProps        | `{[key: string]?: unknown}`                                                                                              | false    | undefined               | Custom props                                                                                                                                               |
| editProps          | `{[key: string]?: unknown}`                                                                                              | false    | undefined               | Custom props                                                                                                                                               |
| previewProps       | `{[key: string]?: unknown}`                                                                                              | false    | undefined               | Custom props                                                                                                                                               |
| style              | `CSSProperties`                                                                                                          | false    | undefined               | Custom inline style                                                                                                                                        |
| unstyled           | `boolean`                                                                                                                | false    | undefined               | If true, renders no inline style                                                                                                                           |
| onAuthChange       | `(user: PayloadMeUser) => void`                                                                                          | false    | undefined               | Fired on each auth change                                                                                                                                  |
| devMode            | `boolean`                                                                                                                | false    | undefined               | If true, fakes authentication (useful when dealing with [SameSite cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)) |
| preview            | `boolean`                                                                                                                | false    | undefined               | If true, renders an exit button with your `onPreviewExit` handler)                                                                                         |
| onPreviewExit      | `function`                                                                                                               | false    | undefined               | Callback for the preview button `onClick` event)                                                                                                           |
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/packages/admin-bar/tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "references": [{ "path": "../payload" }]
}
```

--------------------------------------------------------------------------------

````
