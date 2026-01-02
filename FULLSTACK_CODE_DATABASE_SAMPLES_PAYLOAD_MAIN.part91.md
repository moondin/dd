---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 91
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 91 of 695)

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
Location: payload-main/examples/live-preview/README.md

```text
# Payload Live Preview Example

The [Payload Live Preview Example](https://github.com/payloadcms/payload/tree/main/examples/live-preview) demonstrates how to implement [Live Preview](https://payloadcms.com/docs/live-preview/overview) in [Payload](https://github.com/payloadcms/payload). With Live Preview you can render your front-end application directly within the Admin panel. As you type, your changes take effect in real-time. No need to save a draft or publish your changes.

**IMPORTANT—This example includes a fully integrated Next.js App Router front-end that runs on the same server as Payload.**

## Quick Start

1. Run the following command to create a project from the example:

- `npx create-payload-app --example live-preview`

2. `cp .env.example .env` to copy the example environment variables

3. `pnpm dev`, `yarn dev` or `npm run dev` to start the server
   - Press `y` when prompted to seed the database
4. `open http://localhost:3000` to access the home page
5. `open http://localhost:3000/admin` to access the admin panel
   - Login with email `demo@payloadcms.com` and password `demo`

That's it! Changes made in `./src` will be reflected in your app. See the [Development](#development) section for more details.

## How it works

Live Preview works by rendering an iframe on the page that loads your front-end application. The Admin panel communicates with your app through `window.postMessage` events. These events are emitted every time a change is made to the document. Your app then listens for these events and re-renders itself with the data it receives.

### Collections

See the [Collections](https://payloadcms.com/docs/configuration/collections) docs for details on how to extend any of this functionality.

- #### Users

  The `users` collection is auth-enabled which provides access to the admin panel. This is where your front-end application will be rendered with live page data. See [Pages](#pages) for more details.

  ```ts
  // ./src/collections/Users.ts
  {
    // ...
    auth: true
  }
  ```

  For additional help with authentication, see the [Authentication](https://payloadcms.com/docs/authentication/overview#authentication-overview) docs or the official [Auth Example](https://github.com/payloadcms/payload/tree/main/examples/auth).

- #### Pages

  The `pages` collection has Live Preview enabled through the `admin.livePreview` property of the `pages` collection config:

  ```ts
  // ./src/collections/Pages.ts
  {
    // ...
    admin: {
      livePreview: {
        url: ({ data }) => `${process.env.PAYLOAD_URL}/${data.slug}`
      }
    }
  }
  ```

  For more details on how to extend this functionality, see the [Live Preview](https://payloadcms.com/docs/live-preview/overview) docs.

## Front-end

While using Live Preview, the Admin panel emits a new `window.postMessage` event every time a change is made to the document. Your front-end application can listen for these events and re-render accordingly.

There are two ways to use Live Preview in your own application depending on whether your front-end framework supports server components:

- [Server-side Live Preview (suggested)](#server)
- [Client-side Live Preview](#client)

<Banner type="info">
  We suggest using server-side Live Preview if your framework supports it, it is both simpler to setup and more performant to run than the client-side alternative.
</Banner>

### Server

> Server-side Live Preview is only for front-end frameworks that support the concept of Server Components, i.e. [React Server Components](https://react.dev/reference/rsc/server-components). If your front-end application is built with a client-side framework like the [Next.js Pages Router](https://nextjs.org/docs/pages), [React Router](https://reactrouter.com), [Vue 3](https://vuejs.org), etc., see [client-side Live Preview](#client).

Server-side Live Preview works by making a roundtrip to the server every time your document is saved, i.e. draft save, autosave, or publish. While using Live Preview, the Admin panel emits a new `window.postMessage` event which your front-end application can use to invoke this process. In Next.js, this means simply calling `router.refresh()` which will hydrate the HTML using new data straight from the [Local API](../local-api/overview).

If your server-side front-end application is built with [React](#react), you can use the `RefreshRouteOnChange` function that Payload provides. In the future, all other major frameworks like Vue and Svelte will be officially supported. If you are using any of these frameworks today, you can still integrate with Live Preview yourself using the underlying tooling that Payload provides. See [building your own router refresh component](https://payloadcms.com/docs/live-preview/server#building-your-own-router-refresh-component) for more information.

#### React

If your front-end application is built with server-side [React](https://react.dev), i.e. [Next.js App Router](https://nextjs.org/docs/app), you can use the `RefreshRouteOnSave` component that Payload provides and thread it your framework's refresh function.

First, install the `@payloadcms/live-preview-react` package:

```bash
npm install @payloadcms/live-preview-react
```

Then, render `RefreshRouteOnSave` anywhere in your `page.tsx`. Here's an example:

`page.tsx`:

```tsx
import { RefreshRouteOnSave } from './RefreshRouteOnSave.tsx'
import { getPayload } from 'payload'
import config from '../payload.config'

export default async function Page() {
  const payload = await getPayload({ config })

  const page = await payload.find({
    collection: 'pages',
    draft: true,
  })

  return (
    <Fragment>
      <RefreshRouteOnSave />
      <h1>{page.title}</h1>
    </Fragment>
  )
}
```

`RefreshRouteOnSave.tsx`:

```tsx
'use client'
import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation.js'
import React from 'react'

export const RefreshRouteOnSave: React.FC = () => {
  const router = useRouter()
  return <PayloadLivePreview refresh={router.refresh} serverURL={process.env.PAYLOAD_SERVER_URL} />
}
```

For more details on how to setup server-side Live Preview, see the [server-side Live Preview](https://payloadcms.com/docs/live-preview/server) docs.

### Client

> If your front-end application is supports Server Components like the [Next.js App Router](https://nextjs.org/docs/app), etc., we suggest setting up [server-side Live Preview](#server).

#### React

If your front-end application is built with client-side React such as Next.js Pages Router, React Router, etc., use the [`useLivePreview`](#react) React hook that Payload provides.

First, install the `@payloadcms/live-preview-react` package:

```bash
npm install @payloadcms/live-preview-react
```

Then, use the `useLivePreview` hook in your React component:

```tsx
'use client'
import { useLivePreview } from '@payloadcms/live-preview-react'
import { Page as PageType } from '@/payload-types'

// Fetch the page in a server component, pass it to the client component, then thread it through the hook
// The hook will take over from there and keep the preview in sync with the changes you make
// The `data` property will contain the live data of the document
export const PageClient: React.FC<{
  page: {
    title: string
  }
}> = ({ page: initialPage }) => {
  const { data } = useLivePreview<PageType>({
    initialData: initialPage,
    serverURL: PAYLOAD_SERVER_URL,
    depth: 2, // Ensure that the depth matches the request for `initialPage`
  })

  return <h1>{data.title}</h1>
}
```

#### JavaScript

In the future, all other major frameworks like Vue, Svelte, etc will be officially supported. If you are using any of these framework today, you can still integrate with Live Preview yourself using the tooling that Payload provides.

First, install the `@payloadcms/live-preview` package:

```bash
npm install @payloadcms/live-preview
```

Then, build your own hook:

```tsx
import { subscribe, unsubscribe } from '@payloadcms/live-preview'

// Build your own hook to subscribe to the live preview events
// This function will handle everything for you like
// 1. subscribing to `window.postMessage` events
// 2. merging initial page data with incoming form state
// 3. populating relationships and uploads
```

See [building your own Live Preview hook](https://payloadcms.com/docs/live-preview/frontend#building-your-own-hook) for more details.

For more details on how to setup client-side Live Preview, see the [client-side Live Preview](https://payloadcms.com/docs/live-preview/client) docs.

## Development

To spin up this example locally, follow the [Quick Start](#quick-start).

### Seed

On boot, a seed script is included to scaffold a basic database for you to use as an example. You can remove `pnpm seed` from the `dev` script in the `package.json` to prevent this behavior. You can also freshly seed your project at any time by running `pnpm seed`. This seed creates a user with email `demo@payloadcms.com` and password `demo` along with a home page and an example page with two versions, one published and the other draft.

> NOTICE: seeding the database is destructive because it drops your current database to populate a fresh one from the seed template. Only run this command if you are starting a new project or can afford to lose your current data.

## Production

To run Payload in production, you need to build and serve the Admin panel. To do so, follow these steps:

1. Invoke the `next build` script by running `pnpm build` or `npm run build` in your project root. This creates a `.next` directory with a production-ready admin bundle.
1. Finally run `pnpm start` or `npm run start` to run Node in production and serve Payload from the `.build` directory.

### Deployment

The easiest way to deploy your project is to use [Payload Cloud](https://payloadcms.com/new/import), a one-click hosting solution to deploy production-ready instances of your Payload apps directly from your GitHub repo. You can also choose to self-host your app, check out the [Deployment](https://payloadcms.com/docs/production/deployment) docs for more details.

## Questions

If you have any issues or questions, reach out to us on [Discord](https://discord.com/invite/payload) or start a [GitHub discussion](https://github.com/payloadcms/payload/discussions).
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/examples/live-preview/tsconfig.json
Signals: React, Next.js

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "esModuleInterop": true,
    "target": "ES2022",
    "lib": [
      "DOM",
      "DOM.Iterable",
      "ES2022"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "strictNullChecks": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "incremental": true,
    "jsx": "preserve",
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "sourceMap": true,
    "isolatedModules": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@payload-config": [
        "./src/payload.config.ts"
      ],
      "react": [
        "./node_modules/@types/react"
      ],
      "@/*": [
        "./src/*"
      ],
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    "redirects.js",
    "next.config.mjs"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: launch.json]---
Location: payload-main/examples/live-preview/.vscode/launch.json

```json
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Live Preview Example CMS",
      "program": "${workspaceFolder}/src/server.ts",
      "preLaunchTask": "npm: build:server",
      "env": {
        "PAYLOAD_CONFIG_PATH": "${workspaceFolder}/src/payload.config.ts"
      }
      // "outFiles": [
      //   "${workspaceFolder}/dist/**/*.js"
      // ]
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: payload-types.ts]---
Location: payload-main/examples/live-preview/src/payload-types.ts

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
    pages: Page;
    users: User;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  collectionsJoins: {};
  collectionsSelect: {
    pages: PagesSelect<false> | PagesSelect<true>;
    users: UsersSelect<false> | UsersSelect<true>;
    'payload-locked-documents': PayloadLockedDocumentsSelect<false> | PayloadLockedDocumentsSelect<true>;
    'payload-preferences': PayloadPreferencesSelect<false> | PayloadPreferencesSelect<true>;
    'payload-migrations': PayloadMigrationsSelect<false> | PayloadMigrationsSelect<true>;
  };
  db: {
    defaultIDType: string;
  };
  globals: {
    'main-menu': MainMenu;
  };
  globalsSelect: {
    'main-menu': MainMenuSelect<false> | MainMenuSelect<true>;
  };
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
 * via the `definition` "pages".
 */
export interface Page {
  id: string;
  title: string;
  slug?: string | null;
  richText: {
    [k: string]: unknown;
  }[];
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
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
        relationTo: 'pages';
        value: string | Page;
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
 * via the `definition` "pages_select".
 */
export interface PagesSelect<T extends boolean = true> {
  title?: T;
  slug?: T;
  richText?: T;
  updatedAt?: T;
  createdAt?: T;
  _status?: T;
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
 * via the `definition` "main-menu".
 */
export interface MainMenu {
  id: string;
  navItems?:
    | {
        link: {
          type?: ('reference' | 'custom') | null;
          newTab?: boolean | null;
          reference?: {
            relationTo: 'pages';
            value: string | Page;
          } | null;
          url?: string | null;
          label: string;
        };
        id?: string | null;
      }[]
    | null;
  updatedAt?: string | null;
  createdAt?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "main-menu_select".
 */
export interface MainMenuSelect<T extends boolean = true> {
  navItems?:
    | T
    | {
        link?:
          | T
          | {
              type?: T;
              newTab?: T;
              reference?: T;
              url?: T;
              label?: T;
            };
        id?: T;
      };
  updatedAt?: T;
  createdAt?: T;
  globalType?: T;
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
Location: payload-main/examples/live-preview/src/payload.config.ts

```typescript
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { slateEditor } from '@payloadcms/richtext-slate'
import { fileURLToPath } from 'node:url'
import path from 'path'
import { buildConfig } from 'payload'

import { Pages } from './collections/Pages'
import { Users } from './collections/Users'
import { MainMenu } from './globals/MainMenu'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// eslint-disable-next-line no-restricted-exports
export default buildConfig({
  admin: {
    livePreview: {
      breakpoints: [
        {
          name: 'mobile',
          height: 667,
          label: 'Mobile',
          width: 375,
        },
      ],
    },
  },
  collections: [Pages, Users],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  editor: slateEditor({}),
  globals: [MainMenu],
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
```

--------------------------------------------------------------------------------

---[FILE: app.scss]---
Location: payload-main/examples/live-preview/src/app/(app)/app.scss

```text
$breakpoint: 1000px;

:root {
  --max-width: 1600px;
  --foreground-rgb: 0, 0, 0;
  --background-rgb: 255, 255, 255;
  --block-spacing: 2rem;
  --gutter-h: 4rem;
  --base: 1rem;

  @media (max-width: $breakpoint) {
    --block-spacing: 1rem;
    --gutter-h: 2rem;
    --base: 0.75rem;
  }
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-rgb: 7, 7, 7;
  }
}

* {
  box-sizing: border-box;
}

html {
  font-size: 20px;
  line-height: 1.5;
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    'Open Sans',
    'Helvetica Neue',
    sans-serif;

  @media (max-width: $breakpoint) {
    font-size: 16px;
  }
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
}

body {
  margin: 0;
  color: rgb(var(--foreground-rgb));
  background: rgb(var(--background-rgb));
}

img {
  height: auto;
  max-width: 100%;
  display: block;
}

h1 {
  font-size: 4.5rem;
  line-height: 1.2;
  margin: 0 0 2.5rem 0;

  @media (max-width: $breakpoint) {
    font-size: 3rem;
    margin: 0 0 1.5rem 0;
  }
}

h2 {
  font-size: 3.5rem;
  line-height: 1.2;
  margin: 0 0 2.5rem 0;
}

h3 {
  font-size: 2.5rem;
  line-height: 1.2;
  margin: 0 0 2rem 0;
}

h4 {
  font-size: 1.5rem;
  line-height: 1.2;
  margin: 0 0 1rem 0;
}

h5 {
  font-size: 1.25rem;
  line-height: 1.2;
  margin: 0 0 1rem 0;
}

h6 {
  font-size: 1rem;
  line-height: 1.2;
  margin: 0 0 1rem 0;
}

a {
  color: inherit;
  text-decoration: none;
}

@media (prefers-color-scheme: dark) {
  html {
    color-scheme: dark;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: layout.tsx]---
Location: payload-main/examples/live-preview/src/app/(app)/layout.tsx
Signals: React

```typescript
/* eslint-disable no-restricted-exports */
import React from 'react'

import { Header } from './_components/Header'
import './app.scss'

export const metadata = {
  description: 'Generated by create next app',
  title: 'Create Next App',
}

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: payload-main/examples/live-preview/src/app/(app)/page.tsx

```typescript
import Page from './[slug]/page'

export default Page
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/examples/live-preview/src/app/(app)/[slug]/index.module.scss

```text
.page {
  margin-top: calc(var(--base) * 2);
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: payload-main/examples/live-preview/src/app/(app)/[slug]/page.tsx
Signals: React, Next.js

```typescript
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React, { Fragment } from 'react'

import type { Page as PageType } from '../../../payload-types'

import config from '../../../payload.config'
import { Gutter } from '../_components/Gutter'
import RichText from '../_components/RichText'
import classes from './index.module.scss'
import { RefreshRouteOnSave } from './RefreshRouteOnSave'

interface PageParams {
  params: Promise<{
    slug?: string
  }>
}

// eslint-disable-next-line no-restricted-exports
export default async function Page({ params: paramsPromise }: PageParams) {
  const { slug = 'home' } = await paramsPromise
  const payload = await getPayload({ config })

  const pageRes = await payload.find({
    collection: 'pages',
    draft: true,
    limit: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  const data = pageRes?.docs?.[0] as null | PageType

  if (data === null) {
    return notFound()
  }

  return (
    <Fragment>
      <RefreshRouteOnSave />
      <main className={classes.page}>
        <Gutter>
          <RichText content={data?.richText} />
        </Gutter>
      </main>
    </Fragment>
  )
}

export async function generateStaticParams() {
  const payload = await getPayload({ config })

  const pagesRes = await payload.find({
    collection: 'pages',
    depth: 0,
    draft: true,
    limit: 100,
  })

  const pages = pagesRes?.docs

  return pages.map(({ slug }) =>
    slug !== 'home'
      ? {
          slug,
        }
      : {},
  )
}
```

--------------------------------------------------------------------------------

---[FILE: RefreshRouteOnSave.tsx]---
Location: payload-main/examples/live-preview/src/app/(app)/[slug]/RefreshRouteOnSave.tsx
Signals: React, Next.js

```typescript
'use client'

import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation.js'
import React from 'react'

export const RefreshRouteOnSave: React.FC = () => {
  const router = useRouter()

  return (
    <PayloadLivePreview
      refresh={() => router.refresh()}
      serverURL={process.env.NEXT_PUBLIC_SERVER_URL || ''}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/examples/live-preview/src/app/(app)/_components/Button/index.module.scss

```text
.button {
  border: none;
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  background-color: transparent;
}

.content {
  display: flex;
  align-items: center;
  justify-content: space-around;

  svg {
    margin-right: calc(var(--base) / 2);
    width: var(--base);
    height: var(--base);
  }
}

.label {
  text-align: center;
  display: flex;
  align-items: center;
}

.button {
  text-decoration: none;
  display: inline-flex;
  padding: 12px 24px;
}

.primary--white {
  background-color: black;
  color: white;
}

.primary--black {
  background-color: white;
  color: black;
}

.secondary--white {
  background-color: white;
  box-shadow: inset 0 0 0 1px black;
}

.secondary--black {
  background-color: black;
  box-shadow: inset 0 0 0 1px white;
}

.appearance--default {
  padding: 0;
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/examples/live-preview/src/app/(app)/_components/Button/index.tsx
Signals: React, Next.js

```typescript
import type { ElementType } from 'react'

import Link from 'next/link'
import React from 'react'

import classes from './index.module.scss'

export type Props = {
  appearance?: 'default' | 'primary' | 'secondary'
  className?: string
  disabled?: boolean
  el?: 'a' | 'button' | 'link'
  href?: string
  label?: string
  newTab?: boolean | null
  onClick?: () => void
  type?: 'button' | 'submit'
}

export const Button: React.FC<Props> = ({
  type = 'button',
  appearance,
  className: classNameFromProps,
  disabled,
  el: elFromProps = 'link',
  href,
  label,
  newTab,
  onClick,
}) => {
  let el = elFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}
  const className = [
    classes.button,
    classNameFromProps,
    classes[`appearance--${appearance}`],
    classes.button,
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <div className={classes.content}>
      {/* <Chevron /> */}
      <span className={classes.label}>{label}</span>
    </div>
  )

  if (onClick || type === 'submit') {
    el = 'button'
  }

  if (el === 'link') {
    return (
      <Link className={className} href={href || ''} {...newTabProps} onClick={onClick}>
        {content}
      </Link>
    )
  }

  const Element: ElementType = el

  return (
    <Element
      className={className}
      href={href}
      type={type}
      {...newTabProps}
      disabled={disabled}
      onClick={onClick}
    >
      {content}
    </Element>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/examples/live-preview/src/app/(app)/_components/CMSLink/index.tsx
Signals: React, Next.js

```typescript
import Link from 'next/link'
import React from 'react'

import type { Page } from '../../../../payload-types'

import { Button } from '../Button'

export type CMSLinkType = {
  appearance?: 'default' | 'primary' | 'secondary'
  children?: React.ReactNode
  className?: string
  label?: string
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages'
    value: number | Page | string
  } | null
  type?: 'custom' | 'reference' | null
  url?: null | string
}

export const CMSLink: React.FC<CMSLinkType> = ({
  type,
  appearance,
  children,
  className,
  label,
  newTab,
  reference,
  url,
}) => {
  const href =
    type === 'reference' && typeof reference?.value === 'object' && reference.value.slug
      ? `${reference?.relationTo !== 'pages' ? `/${reference?.relationTo}` : ''}/${
          reference.value.slug
        }`
      : url

  if (!href) {
    return null
  }

  if (!appearance) {
    const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

    if (type === 'custom') {
      return (
        <a href={url || ''} {...newTabProps} className={className}>
          {label && label}
          {children ? <>{children}</> : null}
        </a>
      )
    }

    if (href) {
      return (
        <Link href={href} {...newTabProps} className={className} prefetch={false}>
          {label && label}
          {children ? <>{children}</> : null}
        </Link>
      )
    }
  }

  const buttonProps = {
    appearance,
    href,
    label,
    newTab,
  }

  return <Button className={className} {...buttonProps} el="link" />
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/examples/live-preview/src/app/(app)/_components/Gutter/index.module.scss

```text
.gutter {
  max-width: var(--max-width);
  width: 100%;
  margin: auto;
}

.gutterLeft {
  padding-left: var(--gutter-h);
}

.gutterRight {
  padding-right: var(--gutter-h);
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/examples/live-preview/src/app/(app)/_components/Gutter/index.tsx
Signals: React

```typescript
import React from 'react'

import classes from './index.module.scss'

type Props = {
  children: React.ReactNode
  className?: string
  left?: boolean
  ref?: React.Ref<HTMLDivElement>
  right?: boolean
}

export const Gutter: React.FC<Props & { ref?: React.Ref<HTMLDivElement> }> = (props) => {
  const { children, className, left = true, right = true, ref } = props

  return (
    <div
      className={[
        classes.gutter,
        left && classes.gutterLeft,
        right && classes.gutterRight,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      ref={ref}
    >
      {children}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/examples/live-preview/src/app/(app)/_components/Header/index.module.scss

```text
.header {
  padding: var(--base) 0;
}

.wrap {
  display: flex;
  justify-content: space-between;
  gap: calc(var(--base) / 2);
  flex-wrap: wrap;
}

.logo {
  flex-shrink: 0;
}

.nav {
  display: flex;
  align-items: center;
  gap: var(--base);
  white-space: nowrap;
  overflow: hidden;
  flex-wrap: wrap;

  a {
    display: block;
    text-decoration: none;
  }

  @media (max-width: 1000px) {
    gap: 0 calc(var(--base) / 2);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/examples/live-preview/src/app/(app)/_components/Header/index.tsx
Signals: React, Next.js

```typescript
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import config from '../../../../payload.config'
import { CMSLink } from '../CMSLink'
import { Gutter } from '../Gutter'
import classes from './index.module.scss'

export const Header = async () => {
  const payload = await getPayload({ config })

  const mainMenu = await payload.findGlobal({
    slug: 'main-menu',
    depth: 1,
  })

  const { navItems } = mainMenu

  const hasNavItems = navItems && Array.isArray(navItems) && navItems.length > 0

  return (
    <header className={classes.header}>
      <Gutter className={classes.wrap}>
        <Link className={classes.logo} href="/">
          <picture>
            <source
              media="(prefers-color-scheme: dark)"
              srcSet="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-logo-light.svg"
            />
            <Image
              alt="Payload Logo"
              height={30}
              src="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-logo-dark.svg"
              width={150}
            />
          </picture>
        </Link>
        {hasNavItems && (
          <nav className={classes.nav}>
            {navItems.map(({ link }, i) => {
              const sanitizedLink = {
                ...link,
                type: link.type ?? undefined,
                newTab: link.newTab ?? false,
                url: link.url ?? undefined,
              }

              return <CMSLink key={i} {...sanitizedLink} />
            })}
          </nav>
        )}
      </Gutter>
    </header>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/examples/live-preview/src/app/(app)/_components/RichText/index.module.scss

```text
.richText {
  :first-child {
    margin-top: 0;
  }

  a {
    text-decoration: underline;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/examples/live-preview/src/app/(app)/_components/RichText/index.tsx
Signals: React

```typescript
import React from 'react'

import classes from './index.module.scss'
import serialize from './serialize'

const RichText: React.FC<{ className?: string; content: any }> = ({ className, content }) => {
  if (!content) {
    return null
  }

  return (
    <div className={[classes.richText, className].filter(Boolean).join(' ')}>
      {serialize(content)}
    </div>
  )
}

export default RichText
```

--------------------------------------------------------------------------------

---[FILE: serialize.tsx]---
Location: payload-main/examples/live-preview/src/app/(app)/_components/RichText/serialize.tsx
Signals: React

```typescript
import escapeHTML from 'escape-html'
import React, { Fragment } from 'react'
import { Text } from 'slate'

// eslint-disable-next-line no-use-before-define
type Children = Leaf[]

type Leaf = {
  [key: string]: unknown
  children: Children
  type: string
  url?: string
  value?: {
    alt: string
    url: string
  }
}

const serialize = (children: Children): React.ReactNode[] =>
  children.map((node, i) => {
    if (Text.isText(node)) {
      let text = <span dangerouslySetInnerHTML={{ __html: escapeHTML(node.text) }} />

      if (node.bold) {
        text = <strong key={i}>{text}</strong>
      }

      if (node.code) {
        text = <code key={i}>{text}</code>
      }

      if (node.italic) {
        text = <em key={i}>{text}</em>
      }

      if (node.underline) {
        text = (
          <span key={i} style={{ textDecoration: 'underline' }}>
            {text}
          </span>
        )
      }

      if (node.strikethrough) {
        text = (
          <span key={i} style={{ textDecoration: 'line-through' }}>
            {text}
          </span>
        )
      }

      return <Fragment key={i}>{text}</Fragment>
    }

    if (!node) {
      return null
    }

    switch (node.type) {
      case 'blockquote':
        return <blockquote key={i}>{serialize(node.children)}</blockquote>
      case 'h1':
        return <h1 key={i}>{serialize(node.children)}</h1>
      case 'h2':
        return <h2 key={i}>{serialize(node.children)}</h2>
      case 'h3':
        return <h3 key={i}>{serialize(node.children)}</h3>
      case 'h4':
        return <h4 key={i}>{serialize(node.children)}</h4>
      case 'h5':
        return <h5 key={i}>{serialize(node.children)}</h5>
      case 'h6':
        return <h6 key={i}>{serialize(node.children)}</h6>
      case 'li':
        return <li key={i}>{serialize(node.children)}</li>
      case 'link':
        return (
          <a href={escapeHTML(node.url)} key={i}>
            {serialize(node.children)}
          </a>
        )
      case 'ol':
        return <ol key={i}>{serialize(node.children)}</ol>
      case 'ul':
        return <ul key={i}>{serialize(node.children)}</ul>

      default:
        return <p key={i}>{serialize(node.children)}</p>
    }
  })

export default serialize
```

--------------------------------------------------------------------------------

---[FILE: layout.tsx]---
Location: payload-main/examples/live-preview/src/app/(payload)/layout.tsx
Signals: React

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { ServerFunctionClient } from 'payload'

import config from '@payload-config'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import '@payloadcms/next/css'
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

````
