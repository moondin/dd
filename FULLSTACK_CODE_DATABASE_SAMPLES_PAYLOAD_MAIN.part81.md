---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 81
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 81 of 695)

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
Location: payload-main/examples/draft-preview/README.md

```text
# Payload Draft Preview Example

The [Payload Draft Preview Example](https://github.com/payloadcms/payload/tree/main/examples/draft-preview/payload) demonstrates how to implement [Draft Preview](https://payloadcms.com/docs/admin/preview#draft-preview) in [Payload](https://github.com/payloadcms/payload) using [Versions](https://payloadcms.com/docs/versions/overview) and [Drafts](https://payloadcms.com/docs/versions/drafts). With Draft Preview, you can navigate to your front-end application and enter "draft mode", where your queries are modified to fetch draft content instead of published content. This is useful for seeing how your content will look before being published.

## Quick Start

To spin up this example locally, follow these steps:

1. Run the following command to create a project from the example:

- `npx create-payload-app --example draft-preview`

2. `cp .env.example .env` to copy the example environment variables
3. `pnpm dev`, `yarn dev` or `npm run dev` to start the server
4. `open http://localhost:3000/admin` to access the admin panel
5. Login with email `demo@payloadcms.com` and password `demo`

That's it! Changes made in `./src` will be reflected in your app. See the [Development](#development) section for more details.

## How it works

Draft preview works by sending the user to your front-end with a `secret` along with their http-only cookies. Your front-end catches the request, verifies the authenticity, then enters into it's own preview mode. Once in preview mode, your front-end can begin securely requesting draft documents from Payload. See [Preview Mode](#preview-mode) for more details.

### Collections

See the [Collections](https://payloadcms.com/docs/configuration/collections) docs for details on how to extend any of this functionality.

- #### Users

  The `users` collection is auth-enabled which provides access to the admin panel. When previewing documents on your front-end, the user's JWT is used to authenticate the request. See [Pages](#pages) for more details.

  For additional help with authentication, see the [Authentication](https://payloadcms.com/docs/authentication/overview#authentication-overview) docs or the official [Auth Example](https://github.com/payloadcms/payload/tree/main/examples/auth).

- #### Pages

  The `pages` collection is draft-enabled and has access control that restricts public users from viewing pages with a `_status` of `draft`. To fetch draft documents on your front-end, simply include the `draft=true` query param along with the `Authorization` header once you have entered [Preview Mode](#preview-mode).

  ```ts
  const preview = true // set this based on your own front-end environment (see `Preview Mode` below)
  const pageSlug = 'example-page' // same here
  const searchParams = `?where[slug][equals]=${pageSlug}&depth=1${preview ? `&draft=true` : ''}`

  // when previewing, send the payload token to bypass draft access control
  const pageReq = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/pages${searchParams}`, {
    headers: {
      ...(preview
        ? {
            Authorization: `JWT ${payloadToken}`,
          }
        : {}),
    },
  })
  ```

  For more details on how to extend this functionality, see the [Authentication](https://payloadcms.com/docs/authentication/overview) docs.

### Preview Mode

To preview draft documents, the user first needs to have at least one draft document saved. When they click the "preview" button from the Payload admin panel, a custom [preview function](https://payloadcms.com/docs/admin/collections#preview) routes them to your front-end with a `secret` along with their http-only cookies. An API route on your front-end will verify the secret and token before entering into it's own preview mode. Once in preview mode, it can begin requesting drafts from Payload using the `Authorization` header. See [Pages](#pages) for more details.

> "Preview mode" can vary between frameworks. In the Next.js App Router, [Draft Mode](https://nextjs.org/docs/pages/building-your-application/configuring/draft-mode) enables you to work with previewable content. It provides methods to set cookies in your browser, ensuring content is displayed as a draft, but this behavior might differ in other frameworks.

### On-demand Revalidation

If your front-end is statically generated then you may also want to regenerate the HTML for each page individually as they are published, referred to as On-demand Revalidation. This will prevent your static site from having to fully rebuild every page in order to deploy content changes. To do this, we add an `afterChange` hook to the collection that fires a request to your front-end in the background each time the document is updated. You can handle this request on your front-end to revalidate the HTML for your page.

> On-demand revalidation can vary between frameworks. In the Next.js [App Router](https://nextjs.org/docs/app/building-your-application/data-fetching/revalidating#on-demand-revalidation), on-demand revalidation allows you to regenerate the HTML for specific pages as needed. However, this behavior may differ in other frameworks.

### Admin Bar

You might also want to render an admin bar on your front-end so that logged-in users can quickly navigate between the front-end and Payload as they're editing. For React apps, check out the official [Payload Admin Bar](https://github.com/payloadcms/payload/tree/main/packages/admin-bar). For other frameworks, simply hit the `/me` route with `credentials: 'include'` and render your own admin bar if the user is logged in.

### CORS

The [`cors`](https://payloadcms.com/docs/production/preventing-abuse#cross-origin-resource-sharing-cors), [`csrf`](https://payloadcms.com/docs/production/preventing-abuse#cross-site-request-forgery-csrf), and [`cookies`](https://payloadcms.com/docs/authentication/overview#options) settings are configured to ensure that the admin panel and front-end can communicate with each other securely. If you are combining your front-end and admin panel into a single application that runs of a shared port and domain, you can simplify your config by removing these settings.

For more details on this, see the [CORS](https://payloadcms.com/docs/production/preventing-abuse#cross-origin-resource-sharing-cors) docs.

## Development

To spin up this example locally, follow the [Quick Start](#quick-start).

### Seed

On boot, a seed script is included to scaffold a basic database for you to use as an example. You can remove `pnpm seed` from the `dev` script in the `package.json` to prevent this behavior. You can also freshly seed your project at any time by running `pnpm seed`. This seed creates a user with email `demo@payloadcms.com` and password `demo` along with a home page and an example page with two versions, one published and the other draft.

> NOTICE: seeding the database is destructive because it drops your current database to populate a fresh one from the seed template. Only run this command if you are starting a new project or can afford to lose your current data.

## Production

To run Payload in production, you need to build and start the Admin panel. To do so, follow these steps:

1. Invoke the `next build` script by running `pnpm build` or `npm run build` in your project root. This creates a `.next` directory with a production-ready admin bundle.
1. Finally run `pnpm start` or `npm run start` to run Node in production and serve Payload from the `.build` directory.

### Deployment

The easiest way to deploy your project is to use [Payload Cloud](https://payloadcms.com/new/import), a one-click hosting solution to deploy production-ready instances of your Payload apps directly from your GitHub repo. You can also choose to self-host your app, check out the [Deployment](https://payloadcms.com/docs/production/deployment) docs for more details.

## Questions

If you have any issues or questions, reach out to us on [Discord](https://discord.com/invite/payload) or start a [GitHub discussion](https://github.com/payloadcms/payload/discussions).
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/examples/draft-preview/tsconfig.json
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
      "@payload-types": [
        "./src/payload-types.ts"
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

---[FILE: payload-types.ts]---
Location: payload-main/examples/draft-preview/src/payload-types.ts

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
Location: payload-main/examples/draft-preview/src/payload.config.ts

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
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Pages, Users],
  cors: [process.env.NEXT_PUBLIC_SERVER_URL || ''].filter(Boolean),
  csrf: [process.env.NEXT_PUBLIC_SERVER_URL || ''].filter(Boolean),
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  editor: slateEditor({}),
  globals: [MainMenu],
  graphQL: {
    schemaOutputFile: path.resolve(dirname, 'generated-schema.graphql'),
  },
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
```

--------------------------------------------------------------------------------

---[FILE: app.scss]---
Location: payload-main/examples/draft-preview/src/app/(app)/app.scss

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
Location: payload-main/examples/draft-preview/src/app/(app)/layout.tsx
Signals: Next.js

```typescript
import type { Metadata } from 'next'

import { draftMode } from 'next/headers'

import { AdminBar } from '../../components/AdminBar'
import { Header } from '../../components/Header'
import './app.scss'

export const metadata: Metadata = {
  description: 'Generated by create next app',
  title: 'Create Next App',
}

// eslint-disable-next-line no-restricted-exports
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html lang="en">
      <body>
        <AdminBar
          adminBarProps={{
            preview: isEnabled,
          }}
        />
        <Header />
        {children}
      </body>
    </html>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: payload-main/examples/draft-preview/src/app/(app)/page.tsx

```typescript
import Page from './[slug]/page'

export default Page
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: payload-main/examples/draft-preview/src/app/(app)/exit-preview/route.ts
Signals: Next.js

```typescript
import { draftMode } from 'next/headers'

export async function GET(): Promise<Response> {
  const draft = await draftMode()
  draft.disable()
  return new Response('Draft mode is disabled')
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: payload-main/examples/draft-preview/src/app/(app)/preview/route.ts
Signals: Next.js

```typescript
import type { CollectionSlug, PayloadRequest } from 'payload'
import { getPayload } from 'payload'

import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

import configPromise from '@payload-config'

export async function GET(
  req: {
    cookies: {
      get: (name: string) => {
        value: string
      }
    }
  } & Request,
): Promise<Response> {
  const payload = await getPayload({ config: configPromise })

  const { searchParams } = new URL(req.url)

  const path = searchParams.get('path')
  const collection = searchParams.get('collection') as CollectionSlug
  const slug = searchParams.get('slug')
  const previewSecret = searchParams.get('previewSecret')

  if (previewSecret !== process.env.PREVIEW_SECRET) {
    return new Response('You are not allowed to preview this page', { status: 403 })
  }

  if (!path || !collection || !slug) {
    return new Response('Insufficient search params', { status: 404 })
  }

  if (!path.startsWith('/')) {
    return new Response('This endpoint can only be used for relative previews', { status: 500 })
  }

  let user

  try {
    user = await payload.auth({
      req: req as unknown as PayloadRequest,
      headers: req.headers,
    })
  } catch (error) {
    payload.logger.error({ err: error }, 'Error verifying token for live preview')
    return new Response('You are not allowed to preview this page', { status: 403 })
  }

  const draft = await draftMode()

  if (!user) {
    draft.disable()
    return new Response('You are not allowed to preview this page', { status: 403 })
  }

  // You can add additional checks here to see if the user is allowed to preview this page

  draft.enable()

  redirect(path)
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/examples/draft-preview/src/app/(app)/[slug]/index.module.scss

```text
.page {
  margin-top: calc(var(--base) * 2);
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: payload-main/examples/draft-preview/src/app/(app)/[slug]/page.tsx
Signals: React, Next.js

```typescript
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React, { cache, Fragment } from 'react'

import type { Page as PageType } from '@payload-types'

import { Gutter } from '../../../components/Gutter'
import RichText from '../../../components/RichText'
import config from '../../../payload.config'
import { home as homeStatic } from '../../../seed/home'
import classes from './index.module.scss'

export async function generateStaticParams() {
  const payload = await getPayload({ config })

  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
  })

  const params = pages.docs
    ?.filter((doc) => {
      return doc.slug !== 'home'
    })
    .map(({ slug }) => {
      return { slug }
    })

  return params || []
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

// eslint-disable-next-line no-restricted-exports
export default async function Page({ params: paramsPromise }: Args) {
  const { slug = 'home' } = await paramsPromise

  let page: null | PageType

  page = await queryPageBySlug({
    slug,
  })

  // Remove this code once your website is seeded
  if (!page && slug === 'home') {
    page = homeStatic
  }

  if (page === null) {
    return notFound()
  }

  return (
    <Fragment>
      <main className={classes.page}>
        <Gutter>
          <h1>{page?.title}</h1>
          <RichText content={page?.richText} />
        </Gutter>
      </main>
    </Fragment>
  )
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
```

--------------------------------------------------------------------------------

---[FILE: layout.tsx]---
Location: payload-main/examples/draft-preview/src/app/(payload)/layout.tsx
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
Location: payload-main/examples/draft-preview/src/app/(payload)/admin/importMap.js

```javascript
import { RscEntrySlateCell as RscEntrySlateCell_0e78253914a550fdacd75626f1dabe17 } from '@payloadcms/richtext-slate/rsc'
import { RscEntrySlateField as RscEntrySlateField_0e78253914a550fdacd75626f1dabe17 } from '@payloadcms/richtext-slate/rsc'
import { BoldLeafButton as BoldLeafButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { BoldLeaf as BoldLeaf_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { CodeLeafButton as CodeLeafButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { CodeLeaf as CodeLeaf_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { ItalicLeafButton as ItalicLeafButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { ItalicLeaf as ItalicLeaf_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { StrikethroughLeafButton as StrikethroughLeafButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { StrikethroughLeaf as StrikethroughLeaf_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { UnderlineLeafButton as UnderlineLeafButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { UnderlineLeaf as UnderlineLeaf_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { BlockquoteElementButton as BlockquoteElementButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { BlockquoteElement as BlockquoteElement_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { H1ElementButton as H1ElementButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { Heading1Element as Heading1Element_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { H2ElementButton as H2ElementButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { Heading2Element as Heading2Element_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { H3ElementButton as H3ElementButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { Heading3Element as Heading3Element_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { H4ElementButton as H4ElementButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { Heading4Element as Heading4Element_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { H5ElementButton as H5ElementButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { Heading5Element as Heading5Element_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { H6ElementButton as H6ElementButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { Heading6Element as Heading6Element_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { IndentButton as IndentButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { IndentElement as IndentElement_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { ListItemElement as ListItemElement_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { LinkButton as LinkButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { LinkElement as LinkElement_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { WithLinks as WithLinks_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { OLElementButton as OLElementButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { OrderedListElement as OrderedListElement_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { RelationshipButton as RelationshipButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { RelationshipElement as RelationshipElement_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { WithRelationship as WithRelationship_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { TextAlignElementButton as TextAlignElementButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { ULElementButton as ULElementButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { UnorderedListElement as UnorderedListElement_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { UploadElementButton as UploadElementButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { UploadElement as UploadElement_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { WithUpload as WithUpload_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'

export const importMap = {
  '@payloadcms/richtext-slate/rsc#RscEntrySlateCell':
    RscEntrySlateCell_0e78253914a550fdacd75626f1dabe17,
  '@payloadcms/richtext-slate/rsc#RscEntrySlateField':
    RscEntrySlateField_0e78253914a550fdacd75626f1dabe17,
  '@payloadcms/richtext-slate/client#BoldLeafButton':
    BoldLeafButton_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#BoldLeaf': BoldLeaf_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#CodeLeafButton':
    CodeLeafButton_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#CodeLeaf': CodeLeaf_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#ItalicLeafButton':
    ItalicLeafButton_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#ItalicLeaf': ItalicLeaf_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#StrikethroughLeafButton':
    StrikethroughLeafButton_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#StrikethroughLeaf':
    StrikethroughLeaf_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#UnderlineLeafButton':
    UnderlineLeafButton_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#UnderlineLeaf': UnderlineLeaf_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#BlockquoteElementButton':
    BlockquoteElementButton_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#BlockquoteElement':
    BlockquoteElement_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#H1ElementButton':
    H1ElementButton_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#Heading1Element':
    Heading1Element_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#H2ElementButton':
    H2ElementButton_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#Heading2Element':
    Heading2Element_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#H3ElementButton':
    H3ElementButton_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#Heading3Element':
    Heading3Element_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#H4ElementButton':
    H4ElementButton_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#Heading4Element':
    Heading4Element_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#H5ElementButton':
    H5ElementButton_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#Heading5Element':
    Heading5Element_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#H6ElementButton':
    H6ElementButton_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#Heading6Element':
    Heading6Element_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#IndentButton': IndentButton_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#IndentElement': IndentElement_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#ListItemElement':
    ListItemElement_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#LinkButton': LinkButton_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#LinkElement': LinkElement_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#WithLinks': WithLinks_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#OLElementButton':
    OLElementButton_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#OrderedListElement':
    OrderedListElement_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#RelationshipButton':
    RelationshipButton_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#RelationshipElement':
    RelationshipElement_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#WithRelationship':
    WithRelationship_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#TextAlignElementButton':
    TextAlignElementButton_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#ULElementButton':
    ULElementButton_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#UnorderedListElement':
    UnorderedListElement_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#UploadElementButton':
    UploadElementButton_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#UploadElement': UploadElement_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#WithUpload': WithUpload_0b388c087d9de8c4f011dd323a130cfb,
}
```

--------------------------------------------------------------------------------

---[FILE: not-found.tsx]---
Location: payload-main/examples/draft-preview/src/app/(payload)/admin/[[...segments]]/not-found.tsx
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
Location: payload-main/examples/draft-preview/src/app/(payload)/admin/[[...segments]]/page.tsx
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
Location: payload-main/examples/draft-preview/src/app/(payload)/api/graphql/route.ts

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
Location: payload-main/examples/draft-preview/src/app/(payload)/api/graphql-playground/route.ts

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import { GRAPHQL_PLAYGROUND_GET } from '@payloadcms/next/routes'

export const GET = GRAPHQL_PLAYGROUND_GET(config)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: payload-main/examples/draft-preview/src/app/(payload)/api/[...slug]/route.ts

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

---[FILE: Users.ts]---
Location: payload-main/examples/draft-preview/src/collections/Users.ts

```typescript
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [],
}
```

--------------------------------------------------------------------------------

````
