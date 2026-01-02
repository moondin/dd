---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 644
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 644 of 695)

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

---[FILE: int.spec.ts]---
Location: payload-main/test/plugin-seo/int.spec.ts

```typescript
import type { Payload } from 'payload'

import path from 'path'
import { getFileByPath } from 'payload'
import { fileURLToPath } from 'url'

import { initPayloadInt } from '../helpers/initPayloadInt.js'
import removeFiles from '../helpers/removeFiles.js'
import { mediaSlug } from './shared.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

let payload: Payload

describe('@payloadcms/plugin-seo', () => {
  let page = null
  let mediaDoc = null

  beforeAll(async () => {
    const uploadsDir = path.resolve(dirname, './media')
    removeFiles(path.normalize(uploadsDir))
    ;({ payload } = await initPayloadInt(dirname))

    // Create image
    const filePath = path.resolve(dirname, './image-1.jpg')
    const file = await getFileByPath(filePath)

    mediaDoc = await payload.create({
      collection: mediaSlug,
      data: {},
      file,
    })

    page = await payload.create({
      collection: 'pages',
      data: {
        title: 'Test page',
        slug: 'test-page',
        meta: {
          title: 'Test page',
        },
      },
      depth: 0,
    })
  })

  afterAll(async () => {
    await payload.destroy()
  })

  it('should add meta title', async () => {
    const pageWithTitle = await payload.update({
      collection: 'pages',
      id: page.id,
      data: {
        meta: {
          title: 'Hello, world!',
        },
      },
      depth: 0,
    })

    expect(pageWithTitle).toHaveProperty('meta')
    expect(pageWithTitle.meta).toHaveProperty('title')
    expect(pageWithTitle.meta.title).toBe('Hello, world!')
  })

  it('should add meta description', async () => {
    const pageWithDescription = await payload.update({
      collection: 'pages',
      id: page.id,
      data: {
        meta: {
          description: 'This is a test page',
        },
      },
      depth: 0,
    })

    expect(pageWithDescription).toHaveProperty('meta')
    expect(pageWithDescription.meta).toHaveProperty('description')
    expect(pageWithDescription.meta.description).toBe('This is a test page')
  })

  it('should add meta image', async () => {
    const pageWithImage = await payload.update({
      collection: 'pages',
      id: page.id,
      data: {
        meta: {
          image: mediaDoc.id,
        },
      },
      depth: 0,
    })

    expect(pageWithImage).toHaveProperty('meta')
    expect(pageWithImage.meta).toHaveProperty('image')
    expect(pageWithImage.meta.image).toBe(mediaDoc.id)
  })

  it('should add custom meta field', async () => {
    const pageWithCustomField = await payload.update({
      collection: 'pages',
      id: page.id,
      data: {
        meta: {
          ogTitle: 'Hello, world!',
        },
      },
      depth: 0,
    })

    expect(pageWithCustomField).toHaveProperty('meta')
    expect(pageWithCustomField.meta).toHaveProperty('ogTitle')
    expect(pageWithCustomField.meta.ogTitle).toBe('Hello, world!')
  })

  it('should localize meta fields', async () => {
    const pageWithLocalizedMeta = await payload.update({
      collection: 'pages',
      id: page.id,
      data: {
        meta: {
          title: 'Hola, mundo!',
          description: 'Esta es una página de prueba',
        },
      },
      locale: 'es',
      depth: 0,
    })

    expect(pageWithLocalizedMeta).toHaveProperty('meta')
    expect(pageWithLocalizedMeta.meta).toHaveProperty('title')
    expect(pageWithLocalizedMeta.meta.title).toBe('Hola, mundo!')
    expect(pageWithLocalizedMeta.meta).toHaveProperty('description')
    expect(pageWithLocalizedMeta.meta.description).toBe('Esta es una página de prueba')

    // query the page in the default locale
    const pageInDefaultLocale = await payload.findByID({
      collection: 'pages',
      id: page.id,
      depth: 0,
    })

    expect(pageInDefaultLocale).toHaveProperty('meta')
    expect(pageInDefaultLocale.meta).toHaveProperty('title')
    expect(pageInDefaultLocale.meta.title).toBe('Hello, world!')
    expect(pageInDefaultLocale.meta).toHaveProperty('description')
    expect(pageInDefaultLocale.meta.description).toBe('This is a test page')
  })
})
```

--------------------------------------------------------------------------------

---[FILE: payload-types.ts]---
Location: payload-main/test/plugin-seo/payload-types.ts

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
    users: User;
    pages: Page;
    media: Media;
    pagesWithImportedFields: PagesWithImportedField;
    'payload-kv': PayloadKv;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  collectionsJoins: {};
  collectionsSelect: {
    users: UsersSelect<false> | UsersSelect<true>;
    pages: PagesSelect<false> | PagesSelect<true>;
    media: MediaSelect<false> | MediaSelect<true>;
    pagesWithImportedFields: PagesWithImportedFieldsSelect<false> | PagesWithImportedFieldsSelect<true>;
    'payload-kv': PayloadKvSelect<false> | PayloadKvSelect<true>;
    'payload-locked-documents': PayloadLockedDocumentsSelect<false> | PayloadLockedDocumentsSelect<true>;
    'payload-preferences': PayloadPreferencesSelect<false> | PayloadPreferencesSelect<true>;
    'payload-migrations': PayloadMigrationsSelect<false> | PayloadMigrationsSelect<true>;
  };
  db: {
    defaultIDType: string;
  };
  globals: {};
  globalsSelect: {};
  locale: 'en' | 'es' | 'de';
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
  sessions?:
    | {
        id: string;
        createdAt?: string | null;
        expiresAt: string;
      }[]
    | null;
  password?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "pages".
 */
export interface Page {
  id: string;
  title: string;
  excerpt?: string | null;
  slug: string;
  meta: {
    title: string;
    description?: string | null;
    /**
     * Maximum upload file size: 12MB. Recommended file size for images is <500KB.
     */
    image?: (string | null) | Media;
    ogTitle?: string | null;
  };
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
  media?: (string | null) | Media;
  richText?: {
    root: {
      type: string;
      children: {
        type: any;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
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
 * via the `definition` "pagesWithImportedFields".
 */
export interface PagesWithImportedField {
  id: string;
  title: string;
  excerpt?: string | null;
  slug: string;
  metaAndSEO: {
    title: string;
    innerMeta?: {
      description?: string | null;
    };
    innerMedia?: {
      /**
       * Maximum upload file size: 12MB. Recommended file size for images is <500KB.
       */
      image?: (string | null) | Media;
    };
  };
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-kv".
 */
export interface PayloadKv {
  id: string;
  key: string;
  data:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents".
 */
export interface PayloadLockedDocument {
  id: string;
  document?:
    | ({
        relationTo: 'users';
        value: string | User;
      } | null)
    | ({
        relationTo: 'pages';
        value: string | Page;
      } | null)
    | ({
        relationTo: 'media';
        value: string | Media;
      } | null)
    | ({
        relationTo: 'pagesWithImportedFields';
        value: string | PagesWithImportedField;
      } | null)
    | ({
        relationTo: 'payload-kv';
        value: string | PayloadKv;
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
  sessions?:
    | T
    | {
        id?: T;
        createdAt?: T;
        expiresAt?: T;
      };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "pages_select".
 */
export interface PagesSelect<T extends boolean = true> {
  title?: T;
  excerpt?: T;
  slug?: T;
  meta?:
    | T
    | {
        title?: T;
        description?: T;
        image?: T;
        ogTitle?: T;
      };
  updatedAt?: T;
  createdAt?: T;
  _status?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media_select".
 */
export interface MediaSelect<T extends boolean = true> {
  media?: T;
  richText?: T;
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
 * via the `definition` "pagesWithImportedFields_select".
 */
export interface PagesWithImportedFieldsSelect<T extends boolean = true> {
  title?: T;
  excerpt?: T;
  slug?: T;
  metaAndSEO?:
    | T
    | {
        title?: T;
        innerMeta?:
          | T
          | {
              description?: T;
            };
        innerMedia?:
          | T
          | {
              image?: T;
            };
      };
  updatedAt?: T;
  createdAt?: T;
  _status?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-kv_select".
 */
export interface PayloadKvSelect<T extends boolean = true> {
  key?: T;
  data?: T;
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
Location: payload-main/test/plugin-seo/shared.ts

```typescript
export const pagesSlug = 'pages'

export const pagesWithImportedFieldsSlug = 'pagesWithImportedFields'

export const mediaSlug = 'media'
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.eslint.json]---
Location: payload-main/test/plugin-seo/tsconfig.eslint.json

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
Location: payload-main/test/plugin-seo/tsconfig.json

```json
{
  "extends": "../tsconfig.json"
}
```

--------------------------------------------------------------------------------

---[FILE: Media.ts]---
Location: payload-main/test/plugin-seo/collections/Media.ts

```typescript
import type { CollectionConfig } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

import { mediaSlug } from '../shared.js'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: mediaSlug,
  upload: {
    staticDir: path.resolve(dirname, '../media'),
  },
  fields: [
    {
      type: 'upload',
      name: 'media',
      relationTo: 'media',
      filterOptions: {
        mimeType: {
          equals: 'image/png',
        },
      },
    },
    {
      type: 'richText',
      name: 'richText',
    },
  ],
}

export const uploadsDoc = {
  text: 'An upload here',
}
```

--------------------------------------------------------------------------------

---[FILE: Pages.ts]---
Location: payload-main/test/plugin-seo/collections/Pages.ts

```typescript
import type { CollectionConfig } from 'payload'

import { pagesSlug } from '../shared.js'

export const Pages: CollectionConfig = {
  slug: pagesSlug,
  labels: {
    singular: 'Page',
    plural: 'Pages',
  },
  admin: {
    useAsTitle: 'title',
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            {
              name: 'title',
              label: 'Title',
              type: 'text',
              required: true,
            },
            {
              name: 'excerpt',
              label: 'Excerpt',
              type: 'text',
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              // NOTE: in order for position: 'sidebar' to work here,
              // the first field of this config must be of type `tabs`,
              // and this field must be a sibling of it
              // See `./Posts` or the `../../README.md` for more info
              admin: {
                position: 'sidebar',
              },
            },
          ],
        },
      ],
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: PagesWithImportedFields.ts]---
Location: payload-main/test/plugin-seo/collections/PagesWithImportedFields.ts

```typescript
import type { CollectionConfig } from 'payload'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

import { pagesWithImportedFieldsSlug } from '../shared.js'

export const PagesWithImportedFields: CollectionConfig = {
  slug: pagesWithImportedFieldsSlug,
  labels: {
    singular: 'Page with imported fields',
    plural: 'Pages with imported fields',
  },
  admin: {
    useAsTitle: 'title',
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
    },
    OverviewField({
      titlePath: 'metaAndSEO.title',
      descriptionPath: 'metaAndSEO.innerMeta.description',
      imagePath: 'metaAndSEO.innerMedia.image',
    }),
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            {
              name: 'excerpt',
              label: 'Excerpt',
              type: 'text',
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              // NOTE: in order for position: 'sidebar' to work here,
              // the first field of this config must be of type `tabs`,
              // and this field must be a sibling of it
              // See `./Posts` or the `../../README.md` for more info
              admin: {
                position: 'sidebar',
              },
            },
          ],
        },
        {
          label: 'Meta',
          name: 'metaAndSEO',
          fields: [
            MetaTitleField({
              hasGenerateFn: true,
              overrides: {
                required: true,
              },
            }),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'metaAndSEO.title',
              descriptionPath: 'metaAndSEO.innerMeta.description',
            }),
            {
              type: 'group',
              name: 'innerMeta',
              fields: [
                MetaDescriptionField({
                  hasGenerateFn: true,
                }),
              ],
            },
            {
              type: 'group',
              name: 'innerMedia',
              fields: [
                MetaImageField({
                  relationTo: 'media',
                  hasGenerateFn: true,
                }),
              ],
            },
          ],
        },
      ],
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: Users.ts]---
Location: payload-main/test/plugin-seo/collections/Users.ts

```typescript
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      label: 'Custom Email',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: AfterInput.tsx]---
Location: payload-main/test/plugin-seo/components/AfterInput.tsx
Signals: React

```typescript
import React from 'react'

export const AfterInput: React.FC = () => {
  return <div>{`Hello this is afterInput`}</div>
}
```

--------------------------------------------------------------------------------

---[FILE: BeforeInput.tsx]---
Location: payload-main/test/plugin-seo/components/BeforeInput.tsx
Signals: React

```typescript
import React from 'react'

export const BeforeInput: React.FC = () => {
  return <div>{`Hello this is beforeInput`}</div>
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/plugin-seo/seed/index.ts

```typescript
import type { Payload, PayloadRequest } from 'payload'

import { fileURLToPath } from 'node:url'
import path from 'path'
import { getFileByPath } from 'payload'

import { mediaSlug } from '../shared.js'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const seed = async (payload: Payload): Promise<boolean> => {
  payload.logger.info('Seeding data...')
  const req = {} as PayloadRequest

  try {
    // Create image
    const filePath = path.resolve(dirname, '../image-1.jpg')
    const file = await getFileByPath(filePath)

    const mediaDoc = await payload.create({
      collection: mediaSlug,
      data: {},
      file,
    })

    await payload.create({
      collection: 'pages',
      data: {
        slug: 'test-page',
        meta: {
          description: 'This is a test meta description',
          image: mediaDoc.id,
          ogTitle: 'This is a custom og:title field',
          title: 'This is a test meta title',
        },
        title: 'Test Page',
      },
      req,
    })

    return true
  } catch (err) {
    console.error(err)
    return false
  }
}
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: payload-main/test/plugin-stripe/config.ts

```typescript
import { fileURLToPath } from 'node:url'
import path from 'path'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
import { stripePlugin } from '@payloadcms/plugin-stripe'

import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import { devUser } from '../credentials.js'
import { Customers } from './collections/Customers.js'
import { Products } from './collections/Products.js'
import { Users } from './collections/Users.js'
import { seed } from './seed/index.js'
import { subscriptionCreatedOrUpdated } from './webhooks/subscriptionCreatedOrUpdated.js'
import { subscriptionDeleted } from './webhooks/subscriptionDeleted.js'
import { syncPriceJSON } from './webhooks/syncPriceJSON.js'

process.env.STRIPE_WEBHOOKS_ENDPOINT_SECRET = 'whsec_123'
process.env.STRIPE_SECRET_KEY = 'sk_test_123'

export default buildConfigWithDefaults({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Products, Customers],
  localization: {
    defaultLocale: 'en',
    fallback: true,
    locales: ['en', 'es', 'de'],
  },
  onInit: async (payload) => {
    await payload.create({
      collection: 'users',
      data: {
        email: devUser.email,
        password: devUser.password,
      },
    })

    await seed(payload)
  },
  plugins: [
    stripePlugin({
      isTestKey: true,
      logs: true,
      rest: false,
      stripeSecretKey: process.env.STRIPE_SECRET_KEY,
      stripeWebhooksEndpointSecret: process.env.STRIPE_WEBHOOKS_ENDPOINT_SECRET,
      sync: [
        {
          collection: 'customers',
          fields: [
            {
              fieldPath: 'name',
              stripeProperty: 'name',
            },
            {
              fieldPath: 'email',
              stripeProperty: 'email',
            },
            // NOTE: nested fields are not supported yet, because the Stripe API keeps everything separate at the top-level
            // because of this, we need to wire our own custom webhooks to handle these changes
            // In the future, support for nested fields may look something like this:
            // {
            //   field: 'subscriptions.name',
            //   property: 'plan.name',
            // }
          ],
          stripeResourceType: 'customers',
          stripeResourceTypeSingular: 'customer',
        },
        {
          collection: 'products',
          fields: [
            {
              fieldPath: 'name',
              stripeProperty: 'name',
            },
            {
              fieldPath: 'price.stripePriceID',
              stripeProperty: 'default_price',
            },
          ],
          stripeResourceType: 'products',
          stripeResourceTypeSingular: 'product',
        },
      ],
      webhooks: {
        'customer.subscription.created': subscriptionCreatedOrUpdated,
        'customer.subscription.deleted': subscriptionDeleted,
        'customer.subscription.updated': subscriptionCreatedOrUpdated,
        'product.created': syncPriceJSON,
        'product.updated': syncPriceJSON,
      },
    }),
  ],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
```

--------------------------------------------------------------------------------

---[FILE: int.spec.ts]---
Location: payload-main/test/plugin-stripe/int.spec.ts

```typescript
import type { Payload } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

import { initPayloadInt } from '../helpers/initPayloadInt.js'

let payload: Payload

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

describe('Stripe Plugin', () => {
  beforeAll(async () => {
    ;({ payload } = await initPayloadInt(dirname))
  })

  afterAll(async () => {
    await payload.destroy()
  })

  it('should create products', async () => {
    const product = await payload.create({
      collection: 'products',
      data: {
        name: 'Test Product',
      },
    })

    expect(product).toHaveProperty('name', 'Test Product')
  })

  // Test various common API calls like `products.create`, etc.
  // Send the requests through the Payload->Stripe proxy
  // Query Stripe directly to ensure the data is as expected
  it.todo('should open REST API proxy')

  // Test various common webhook events like `product.created`, etc.
  // These could potentially be mocked
  it.todo('should handle incoming Stripe webhook events')

  // Test that the data is synced to Stripe automatically without the use of custom hooks/proxy
  // I.e. the `sync` config option
  it.todo('should auto-sync data based on config')
})
```

--------------------------------------------------------------------------------

---[FILE: payload-types.ts]---
Location: payload-main/test/plugin-stripe/payload-types.ts

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
    customers: CustomerAuthOperations;
  };
  blocks: {};
  collections: {
    users: User;
    products: Product;
    customers: Customer;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  collectionsJoins: {};
  collectionsSelect: {
    users: UsersSelect<false> | UsersSelect<true>;
    products: ProductsSelect<false> | ProductsSelect<true>;
    customers: CustomersSelect<false> | CustomersSelect<true>;
    'payload-locked-documents': PayloadLockedDocumentsSelect<false> | PayloadLockedDocumentsSelect<true>;
    'payload-preferences': PayloadPreferencesSelect<false> | PayloadPreferencesSelect<true>;
    'payload-migrations': PayloadMigrationsSelect<false> | PayloadMigrationsSelect<true>;
  };
  db: {
    defaultIDType: string;
  };
  globals: {};
  globalsSelect: {};
  locale: 'en' | 'es' | 'de';
  user:
    | (User & {
        collection: 'users';
      })
    | (Customer & {
        collection: 'customers';
      });
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
export interface CustomerAuthOperations {
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
  name?: string | null;
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
 * via the `definition` "products".
 */
export interface Product {
  id: string;
  name?: string | null;
  /**
   * All pricing information is managed in Stripe and will be reflected here.
   */
  price?: {
    stripePriceID?: string | null;
    stripeJSON?: string | null;
  };
  stripeID?: string | null;
  skipSync?: boolean | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "customers".
 */
export interface Customer {
  id: string;
  name?: string | null;
  /**
   * All subscriptions are managed in Stripe and will be reflected here. Use the link in the sidebar to go directly to this customer in Stripe to begin managing their subscriptions.
   */
  subscriptions?:
    | {
        stripeSubscriptionID?: string | null;
        stripeProductID?: string | null;
        product?: (string | null) | Product;
        status?:
          | ('active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid')
          | null;
        id?: string | null;
      }[]
    | null;
  stripeID?: string | null;
  skipSync?: boolean | null;
  updatedAt: string;
  createdAt: string;
  enableAPIKey?: boolean | null;
  apiKey?: string | null;
  apiKeyIndex?: string | null;
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
        relationTo: 'users';
        value: string | User;
      } | null)
    | ({
        relationTo: 'products';
        value: string | Product;
      } | null)
    | ({
        relationTo: 'customers';
        value: string | Customer;
      } | null);
  globalSlug?: string | null;
  user:
    | {
        relationTo: 'users';
        value: string | User;
      }
    | {
        relationTo: 'customers';
        value: string | Customer;
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
  user:
    | {
        relationTo: 'users';
        value: string | User;
      }
    | {
        relationTo: 'customers';
        value: string | Customer;
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
  name?: T;
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
 * via the `definition` "products_select".
 */
export interface ProductsSelect<T extends boolean = true> {
  name?: T;
  price?:
    | T
    | {
        stripePriceID?: T;
        stripeJSON?: T;
      };
  stripeID?: T;
  skipSync?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "customers_select".
 */
export interface CustomersSelect<T extends boolean = true> {
  name?: T;
  subscriptions?:
    | T
    | {
        stripeSubscriptionID?: T;
        stripeProductID?: T;
        product?: T;
        status?: T;
        id?: T;
      };
  stripeID?: T;
  skipSync?: T;
  updatedAt?: T;
  createdAt?: T;
  enableAPIKey?: T;
  apiKey?: T;
  apiKeyIndex?: T;
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
Location: payload-main/test/plugin-stripe/shared.ts

```typescript
export const pagesSlug = 'pages'

export const productsSlug = 'products'

export const customersSlug = 'customers'
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.eslint.json]---
Location: payload-main/test/plugin-stripe/tsconfig.eslint.json

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
Location: payload-main/test/plugin-stripe/tsconfig.json

```json
{
  "extends": "../tsconfig.json"
}
```

--------------------------------------------------------------------------------

````
