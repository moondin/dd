---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 84
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 84 of 695)

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
Location: payload-main/examples/email/README.md

```text
# Payload Email Example

This example demonstrates how to integrate email functionality into Payload.

## Quick Start

To spin up this example locally, follow these steps:

1. Run the following command to create a project from the example:

- `npx create-payload-app --example email`

2. `cp .env.example .env` to copy the example environment variables
3. `pnpm install && pnpm dev` to install dependencies and start the dev server
4. open `http://localhost:3000/admin` to access the admin panel
5. Create your first user

## How it works

Email functionality in Payload is configured using adapters. The recommended adapter for most use cases is the [@payloadcms/email-nodemailer](https://www.npmjs.com/package/@payloadcms/email-nodemailer) package.

To enable email, pass your adapter configuration to the `email` property in the Payload Config. This allows Payload to send auth-related emails for password resets, new user verifications, and other email needs.

1. In the Payload Config file, add your email adapter to the `email` property. For example, the `@payloadcms/email-nodemailer` adapter can be configured for SMTP, SendGrid, or other supported transports. During development, if no configuration is provided, Payload will use a mock service via [ethereal.email](ethereal.email).

Now we can start sending email!

2. Go to `src/collections/Newsletter.ts` - with an `afterChange` hook, we are sending an email when a new user signs up for the newsletter

Let's not forget our authentication emails...

3. Auth-enabled collections have built-in options to verify the user and reset the user password. Open `src/collections/Users.ts` and see how we customize these emails.

Speaking of customization...

4. Take a look at `src/email/generateEmailHTML` and how it compiles a custom template when sending email. You change this to any HTML template of your choosing.

That's all you need, now you can go ahead and test out this repo by creating a new `user` or `newsletter-signup` and see the email integration in action.

## Development

To spin up this example locally, follow the [Quick Start](#quick-start).

## Production

To run Payload in production, you need to build and start the Admin panel. To do so, follow these steps:

1. Invoke the `next build` script by running `pnpm build` or `npm run build` in your project root. This creates a `.next` directory with a production-ready admin bundle.
1. Finally run `pnpm start` or `npm run start` to run Node in production and serve Payload from the `.build` directory.

### Deployment

The easiest way to deploy your project is to use [Payload Cloud](https://payloadcms.com/new/import), a one-click hosting solution to deploy production-ready instances of your Payload apps directly from your GitHub repo. You can also deploy your app manually, check out the [deployment documentation](https://payloadcms.com/docs/production/deployment) for full details.

## Resources

For more information on integrating email, check out these resources:

<!-- Update with live blog post URL when published -->

- [Blog Post - Email 101](https://payloadcms.com/blog)
- [Email Documentation](https://payloadcms.com/docs/email/overview#email-functionality)

## Questions

If you have any issues or questions, reach out to us on [Discord](https://discord.com/invite/payload) or start a [GitHub discussion](https://github.com/payloadcms/payload/discussions).
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/examples/email/tsconfig.json
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

---[FILE: payload-types.ts]---
Location: payload-main/examples/email/src/payload-types.ts

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
    'newsletter-signups': NewsletterSignup;
    users: User;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  collectionsJoins: {};
  collectionsSelect: {
    'newsletter-signups': NewsletterSignupsSelect<false> | NewsletterSignupsSelect<true>;
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
  jobs?: {
    tasks: unknown;
    workflows?: unknown;
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
 * via the `definition` "newsletter-signups".
 */
export interface NewsletterSignup {
  id: string;
  name?: string | null;
  email: string;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users".
 */
export interface User {
  id: string;
  name?: string | null;
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  _verified?: boolean | null;
  _verificationToken?: string | null;
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
        relationTo: 'newsletter-signups';
        value: string | NewsletterSignup;
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
 * via the `definition` "newsletter-signups_select".
 */
export interface NewsletterSignupsSelect<T extends boolean = true> {
  name?: T;
  email?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users_select".
 */
export interface UsersSelect<T extends boolean = true> {
  name?: T;
  updatedAt?: T;
  createdAt?: T;
  email?: T;
  resetPasswordToken?: T;
  resetPasswordExpiration?: T;
  salt?: T;
  hash?: T;
  _verified?: T;
  _verificationToken?: T;
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
Location: payload-main/examples/email/src/payload.config.ts

```typescript
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Newsletter } from './collections/Newsletter'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// eslint-disable-next-line no-restricted-exports
export default buildConfig({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
  },
  collections: [Newsletter, Users],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  editor: lexicalEditor({}),
  // For example use case, we are passing nothing to nodemailerAdapter
  // This will default to using etherial.email
  email: nodemailerAdapter(),
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

---[FILE: layout.tsx]---
Location: payload-main/examples/email/src/app/(payload)/layout.tsx
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
Location: payload-main/examples/email/src/app/(payload)/admin/importMap.js

```javascript
export const importMap = {}
```

--------------------------------------------------------------------------------

---[FILE: not-found.tsx]---
Location: payload-main/examples/email/src/app/(payload)/admin/[[...segments]]/not-found.tsx
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
Location: payload-main/examples/email/src/app/(payload)/admin/[[...segments]]/page.tsx
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
Location: payload-main/examples/email/src/app/(payload)/api/graphql/route.ts

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
Location: payload-main/examples/email/src/app/(payload)/api/graphql-playground/route.ts

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import { GRAPHQL_PLAYGROUND_GET } from '@payloadcms/next/routes'

export const GET = GRAPHQL_PLAYGROUND_GET(config)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: payload-main/examples/email/src/app/(payload)/api/[...slug]/route.ts

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

---[FILE: Newsletter.ts]---
Location: payload-main/examples/email/src/collections/Newsletter.ts

```typescript
import type { CollectionConfig } from 'payload'
import { sanitizeUserDataForEmail } from 'payload/shared'

import { generateEmailHTML } from '../email/generateEmailHTML'

export const Newsletter: CollectionConfig = {
  slug: 'newsletter-signups',
  admin: {
    defaultColumns: ['name', 'email'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'email',
      type: 'text',
      required: true,
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create') {
          req.payload
            .sendEmail({
              from: 'sender@example.com',
              html: await generateEmailHTML({
                content: `<p>${doc.name ? `Hi ${sanitizeUserDataForEmail(doc.name)}!` : 'Hi!'} We'll be in touch soon...</p>`,
                headline: 'Welcome to the newsletter!',
              }),
              subject: 'Thanks for signing up!',
              to: doc.email,
            })
            .catch((error) => {
              console.error('Error sending email:', error)
            })
        }
      },
    ],
  },
}
```

--------------------------------------------------------------------------------

---[FILE: Users.ts]---
Location: payload-main/examples/email/src/collections/Users.ts

```typescript
import type { CollectionConfig } from 'payload'

import { generateForgotPasswordEmail } from '../email/generateForgotPasswordEmail'
import { generateVerificationEmail } from '../email/generateVerificationEmail'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    forgotPassword: {
      generateEmailHTML: generateForgotPasswordEmail,
      generateEmailSubject: () => 'Reset your password',
    },
    verify: {
      generateEmailHTML: generateVerificationEmail,
      generateEmailSubject: () => 'Verify your email',
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: generateEmailHTML.ts]---
Location: payload-main/examples/email/src/email/generateEmailHTML.ts

```typescript
import ejs from 'ejs'
import fs from 'fs'
import juice from 'juice'
import path from 'path'

export const generateEmailHTML = async (data: any): Promise<string> => {
  const templatePath = path.join(process.cwd(), 'src/email/template.ejs')
  const templateContent = fs.readFileSync(templatePath, 'utf8')

  // Compile and render the template with EJS
  const preInlinedCSS = ejs.render(templateContent, { ...data, cta: data.cta || {} })

  // Inline CSS
  const html = juice(preInlinedCSS)

  return Promise.resolve(html)
}
```

--------------------------------------------------------------------------------

---[FILE: generateForgotPasswordEmail.ts]---
Location: payload-main/examples/email/src/email/generateForgotPasswordEmail.ts

```typescript
import type { PayloadRequest } from 'payload'

import { generateEmailHTML } from './generateEmailHTML'

type ForgotPasswordEmailArgs =
  | {
      req?: PayloadRequest
      token?: string
      user?: any
    }
  | undefined

export const generateForgotPasswordEmail = async (
  args: ForgotPasswordEmailArgs,
): Promise<string> => {
  return generateEmailHTML({
    content: '<p>Let&apos;s get you back in.</p>',
    cta: {
      buttonLabel: 'Reset your password',
      url: `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/reset-password?token=${args?.token}`,
    },
    headline: 'Locked out?',
  })
}
```

--------------------------------------------------------------------------------

---[FILE: generateVerificationEmail.ts]---
Location: payload-main/examples/email/src/email/generateVerificationEmail.ts

```typescript
import { generateEmailHTML } from './generateEmailHTML'

import { sanitizeUserDataForEmail } from 'payload/shared'

type User = {
  email: string
  name?: string
}

type GenerateVerificationEmailArgs = {
  token: string
  user: User
}

export const generateVerificationEmail = async (
  args: GenerateVerificationEmailArgs,
): Promise<string> => {
  const { token, user } = args

  return generateEmailHTML({
    content: `<p>Hi${user.name ? ' ' + sanitizeUserDataForEmail(user.name) : ''}! Validate your account by clicking the button below.</p>`,
    cta: {
      buttonLabel: 'Verify',
      url: `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/verify?token=${token}&email=${user.email}`,
    },
    headline: 'Verify your account',
  })
}
```

--------------------------------------------------------------------------------

---[FILE: template.ejs]---
Location: payload-main/examples/email/src/email/template.ejs

```text
<!doctype html>
<html>

<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style type="text/css">
    body,
    html {
      margin: 0;
      padding: 0;
    }

    body,
    html,
    .bg {
      height: 100%;
    }

    body,
    h1,
    h2,
    h3,
    h4,
    p,
    em,
    strong {
      font-family: sans-serif;
    }

    body {
      font-size: 15px;
      color: #333333;
    }

    a {
      color: #333333;
      outline: 0;
      text-decoration: underline;
    }

    a img {
      border: 0;
      outline: 0;
    }

    img {
      max-width: 100%;
      height: auto;
      vertical-align: top;
    }

    h1,
    h2,
    h3,
    h4,
    h5 {
      font-weight: 900;
      line-height: 1.25;
    }

    h1 {
      font-size: 40px;
      color: #333333;
      margin: 0 0 25px 0;
    }

    h2 {
      color: #333333;
      margin: 0 0 25px 0;
      font-size: 30px;
      line-height: 30px;
    }

    h3 {
      font-size: 25px;
      color: #333333;
      margin: 0 0 25px 0;
    }

    h4 {
      font-size: 20px;
      color: #333333;
      margin: 0 0 15px 0;
      line-height: 30px;
    }

    h5 {
      color: #333333;
      font-size: 17px;
      font-weight: 900;
      margin: 0 0 15px;
    }

    table {
      border-collapse: collapse;
    }

    p,
    td {
      font-size: 14px;
      line-height: 25px;
      color: #333333;
    }

    p {
      margin: 0 0 25px;
    }

    ul {
      padding-left: 15px;
      margin-left: 15px;
      font-size: 14px;
      line-height: 25px;
      margin-bottom: 25px;
    }

    li {
      font-size: 14px;
      line-height: 25px;
      color: #333333;
    }

    table.hr td {
      font-size: 0;
      line-height: 2px;
    }

    .white {
      color: white;
    }

    /********************************
    MAIN
    ********************************/

    .main {
      background: white;
    }

    /********************************
    MAX WIDTHS
    ********************************/

    .max-width {
      max-width: 800px;
      width: 94%;
      margin: 0 3%;
    }

    /********************************
    REUSABLES
    ********************************/

    .padding {
      padding: 60px;
    }

    .center {
      text-align: center;
    }

    .no-border {
      border: 0;
      outline: none;
      text-decoration: none;
    }

    .no-margin {
      margin: 0;
    }

    .spacer {
      line-height: 45px;
      height: 45px;
    }

    /********************************
    PANELS
    ********************************/

    .panel {
      width: 100%;
    }

    @media screen and (max-width: 800px) {
      h1 {
        font-size: 24px !important;
        margin: 0 0 20px 0 !important;
      }

      h2 {
        font-size: 20px !important;
        margin: 0 0 20px 0 !important;
      }

      h3 {
        font-size: 20px !important;
        margin: 0 0 20px 0 !important;
      }

      h4 {
        font-size: 18px !important;
        margin: 0 0 15px 0 !important;
      }

      h5 {
        font-size: 15px !important;
        margin: 0 0 10px !important;
      }

      .max-width {
        width: 90% !important;
        margin: 0 5% !important;
      }

      td.padding {
        padding: 30px !important;
      }

      td.padding-vert {
        padding-top: 20px !important;
        padding-bottom: 20px !important;
      }

      td.padding-horiz {
        padding-left: 20px !important;
        padding-right: 20px !important;
      }

      .spacer {
        line-height: 20px !important;
        height: 20px !important;
      }
    }

  </style>
</head>

<body>
  <div style="background-color: #f3f3f3; height: 100%">
    <table height="100%" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f3f3f3">
      <tr>
        <td valign="top" align="left">
          <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tbody>
              <tr>
                <td align="center" valign="top">
                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tbody>
                      <tr>
                        <td align="center">
                          <table class="max-width" cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tbody>
                              <tr>
                                <td class="spacer">&nbsp;</td>
                              </tr>
                              <tr>
                                <td class="padding main">
                                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tbody>
                                      <tr>
                                        <td>
                                          <!-- LOGO -->
                                          <a href="https://payloadcms.com/" target="_blank">
                                            <img src="https://payloadcms.com/images/logo-dark.png" width="150"
                                              height="auto" />
                                          </a>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td class="spacer">&nbsp;</td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <!-- HEADLINE -->
                                          <h1 style="margin: 0 0 30px"><%= headline %></h1>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <!-- CONTENT -->
                                          <%- content %>

                                          <!-- CTA -->
                                          <% if (cta) { %>
                                          <div>
                                            <a href="<%= cta.url %>" style="
                                                  background-color: #222222;
                                                  border-radius: 4px;
                                                  color: #ffffff;
                                                  display: inline-block;
                                                  font-family: sans-serif;
                                                  font-size: 13px;
                                                  font-weight: bold;
                                                  line-height: 60px;
                                                  text-align: center;
                                                  text-decoration: none;
                                                  width: 200px;
                                                  -webkit-text-size-adjust: none;
                                                ">
                                              <%= cta.buttonLabel %>
                                            </a>
                                          </div>
                                          <% } %>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </table>
  </div>
</body>

</html>
```

--------------------------------------------------------------------------------

---[FILE: .env.example]---
Location: payload-main/examples/form-builder/.env.example

```text
DATABASE_URI=mongodb://127.0.0.1/payload-form-builder-example
PAYLOAD_SECRET=YOUR_SECRET_HERE
NEXT_PUBLIC_PAYLOAD_URL=http://localhost:3000
```

--------------------------------------------------------------------------------

---[FILE: .eslintrc.cjs]---
Location: payload-main/examples/form-builder/.eslintrc.cjs

```text
module.exports = {
  extends: 'next',
  root: true,
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
}
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/examples/form-builder/.gitignore

```text
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

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
/.next/
/out/

# production
/build

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
next-env.d.ts

.env

/media
```

--------------------------------------------------------------------------------

---[FILE: .prettierrc.json]---
Location: payload-main/examples/form-builder/.prettierrc.json

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "semi": false
}
```

--------------------------------------------------------------------------------

---[FILE: next.config.mjs]---
Location: payload-main/examples/form-builder/next.config.mjs

```text
import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
}

export default withPayload(nextConfig)
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: payload-main/examples/form-builder/package.json
Signals: React, Next.js

```json
{
  "name": "payload-form-builder-example",
  "version": "1.0.0",
  "description": "Payload form builder example.",
  "license": "MIT",
  "type": "module",
  "scripts": {
    "build": "cross-env NODE_OPTIONS=--no-deprecation next build",
    "dev": "cross-env NODE_OPTIONS=--no-deprecation && pnpm seed && next dev",
    "generate:importmap": "cross-env NODE_OPTIONS=--no-deprecation payload generate:importmap",
    "generate:schema": "payload-graphql generate:schema",
    "generate:types": "cross-env NODE_OPTIONS=--no-deprecation payload generate:types",
    "payload": "cross-env NODE_OPTIONS=--no-deprecation payload",
    "seed": "npm run payload migrate:fresh",
    "start": "cross-env NODE_OPTIONS=--no-deprecation next start"
  },
  "dependencies": {
    "@apollo/client": "^3.7.0",
    "@faceless-ui/css-grid": "^1.2.0",
    "@faceless-ui/modal": "^2.0.2",
    "@payloadcms/db-mongodb": "latest",
    "@payloadcms/next": "latest",
    "@payloadcms/plugin-cloud": "latest",
    "@payloadcms/plugin-form-builder": "latest",
    "@payloadcms/richtext-lexical": "latest",
    "cross-env": "^7.0.3",
    "graphql": "^16.9.0",
    "next": "^15.4.10",
    "payload": "latest",
    "react": "19.2.1",
    "react-dom": "19.2.1",
    "react-hook-form": "^7.41.0",
    "react-select": "^5.9.0"
  },
  "devDependencies": {
    "@payloadcms/graphql": "latest",
    "@types/node": "^20.11.25",
    "@types/react": "19.2.1",
    "@types/react-dom": "19.2.1",
    "dotenv": "^16.4.5",
    "eslint": "^8.57.0",
    "eslint-config-next": "^15.0.0",
    "tsx": "^4.16.2",
    "typescript": "5.5.2"
  },
  "engines": {
    "node": "^18.20.2 || >=20.9.0"
  }
}
```

--------------------------------------------------------------------------------

````
