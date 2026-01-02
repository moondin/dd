---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 641
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 641 of 695)

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

---[FILE: e2e.spec.ts]---
Location: payload-main/test/plugin-nested-docs/e2e.spec.ts

```typescript
import type { Page } from '@playwright/test'

import { expect, test } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

import type { Config, Page as PayloadPage } from './payload-types.js'

import { ensureCompilationIsDone, initPageConsoleErrorCatch } from '../helpers.js'
import { AdminUrlUtil } from '../helpers/adminUrlUtil.js'
import { initPayloadE2ENoConfig } from '../helpers/initPayloadE2ENoConfig.js'
import { TEST_TIMEOUT_LONG } from '../playwright.config.js'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const { beforeAll, describe } = test
let url: AdminUrlUtil
let page: Page
let draftParentID: string
let parentID: string
let draftChildID: string
let childID: string

describe('Nested Docs Plugin', () => {
  beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)
    const { serverURL, payload } = await initPayloadE2ENoConfig<Config>({ dirname })
    url = new AdminUrlUtil(serverURL, 'pages')
    const context = await browser.newContext()
    page = await context.newPage()

    initPageConsoleErrorCatch(page)
    await ensureCompilationIsDone({ page, serverURL })

    async function createPage({
      slug,
      title = 'Title page',
      parent,
      _status = 'published',
    }: Partial<PayloadPage>): Promise<PayloadPage> {
      return payload.create({
        collection: 'pages',
        data: {
          title,
          slug,
          _status,
          parent,
        },
      }) as unknown as Promise<PayloadPage>
    }

    const parentPage = await createPage({ slug: 'parent-slug' })
    parentID = parentPage.id

    const childPage = await createPage({
      slug: 'child-slug',
      title: 'Child page',
      parent: parentID,
    })
    childID = childPage.id

    const draftParentPage = await createPage({ slug: 'parent-slug-draft', _status: 'draft' })
    draftParentID = draftParentPage.id

    const draftChildPage = await createPage({
      slug: 'child-slug-draft',
      title: 'Child page',
      parent: draftParentID,
      _status: 'draft',
    })
    draftChildID = draftChildPage.id
  })

  describe('Core functionality', () => {
    const slugClass = '#field-slug'
    const publishButtonClass = '#action-save'
    const draftButtonClass = '#action-save-draft'

    test('Parent slug updates breadcrumbs in child', async () => {
      await page.goto(url.edit(childID))
      let slug = page.locator(slugClass).nth(0)
      await expect(slug).toHaveValue('child-slug')

      // TODO: remove when error states are fixed
      const apiTabButton = page.locator('text=API')
      await apiTabButton.click()
      const breadcrumbs = page.locator('text=/parent-slug').first()
      await expect(breadcrumbs).toBeVisible()

      // TODO: add back once error states are fixed
      // const parentSlugInChildClass = '#field-breadcrumbs__0__url'
      // const parentSlugInChild = page.locator(parentSlugInChildClass).nth(0)
      // await expect(parentSlugInChild).toHaveValue('/parent-slug')

      await page.goto(url.edit(parentID))
      slug = page.locator(slugClass).nth(0)
      await slug.fill('updated-parent-slug')
      await expect(slug).toHaveValue('updated-parent-slug')
      await page.locator(publishButtonClass).nth(0).click()
      await expect(page.locator('.payload-toast-container')).toContainText('successfully')
      await page.goto(url.edit(childID))

      // TODO: remove when error states are fixed
      await apiTabButton.click()
      const updatedBreadcrumbs = page.locator('text=/updated-parent-slug').first()
      await expect(updatedBreadcrumbs).toBeVisible()

      // TODO: add back once error states are fixed
      // await expect(parentSlugInChild).toHaveValue('/updated-parent-slug')
    })

    test('Draft parent slug does not update child', async () => {
      await page.goto(url.edit(draftChildID))

      // TODO: remove when error states are fixed
      const apiTabButton = page.locator('text=API')
      await apiTabButton.click()
      const breadcrumbs = page.locator('text=/parent-slug-draft').first()
      await expect(breadcrumbs).toBeVisible()

      // TODO: add back once error states are fixed
      // const parentSlugInChildClass = '#field-breadcrumbs__0__url'
      // const parentSlugInChild = page.locator(parentSlugInChildClass).nth(0)
      // await expect(parentSlugInChild).toHaveValue('/parent-slug-draft')

      await page.goto(url.edit(parentID))
      await page.locator(slugClass).nth(0).fill('parent-updated-draft')
      await page.locator(draftButtonClass).nth(0).click()
      await expect(page.locator('.payload-toast-container')).toContainText('successfully')
      await page.goto(url.edit(draftChildID))

      await apiTabButton.click()
      const updatedBreadcrumbs = page.locator('text=/parent-slug-draft').first()
      await expect(updatedBreadcrumbs).toBeVisible()

      // TODO: add back when error states are fixed
      // await expect(parentSlugInChild).toHaveValue('/parent-slug-draft')
    })

    test('Publishing parent doc should not publish child', async () => {
      await page.goto(url.edit(childID))
      await page.locator(slugClass).nth(0).fill('child-updated-draft')
      await page.locator(draftButtonClass).nth(0).click()

      await page.goto(url.edit(parentID))
      await page.locator(slugClass).nth(0).fill('parent-updated-published')
      await page.locator(publishButtonClass).nth(0).click()

      await page.goto(url.edit(childID))
      await expect(page.locator(slugClass).nth(0)).toHaveValue('child-updated-draft')
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: int.spec.ts]---
Location: payload-main/test/plugin-nested-docs/int.spec.ts

```typescript
import type { ArrayField, Payload, RelationshipField } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

import type { Page } from './payload-types.js'

import { initPayloadInt } from '../helpers/initPayloadInt.js'

let payload: Payload

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

describe('@payloadcms/plugin-nested-docs', () => {
  beforeAll(async () => {
    ;({ payload } = await initPayloadInt(dirname))
  })

  afterAll(async () => {
    await payload.destroy()
  })

  describe('seed', () => {
    it('should populate two levels of breadcrumbs', async () => {
      const query = await payload.find({
        collection: 'pages',
        where: {
          slug: {
            equals: 'child-page',
          },
        },
      })

      expect(query.docs[0].breadcrumbs).toHaveLength(2)
    })

    it('should populate three levels of breadcrumbs', async () => {
      const query = await payload.find({
        collection: 'pages',
        where: {
          slug: {
            equals: 'grandchild-page',
          },
        },
      })

      expect(query.docs[0].breadcrumbs).toHaveLength(3)
      expect(query.docs[0].breadcrumbs[0].url).toStrictEqual('/parent-page')
      expect(query.docs[0].breadcrumbs[1].url).toStrictEqual('/parent-page/child-page')
      expect(query.docs[0].breadcrumbs[2].url).toStrictEqual(
        '/parent-page/child-page/grandchild-page',
      )
    })

    it('should update more than 10 (default limit) breadcrumbs', async () => {
      // create a parent doc
      const parentDoc = await payload.create({
        collection: 'pages',
        data: {
          title: '11 children',
          slug: '11-children',
        },
      })

      // create 11 children docs
      for (let i = 0; i < 11; i++) {
        await payload.create({
          collection: 'pages',
          data: {
            title: `Child ${i + 1}`,
            slug: `child-${i + 1}`,
            parent: parentDoc.id,
            _status: 'published',
          },
        })
      }
      // update parent doc
      await payload.update({
        collection: 'pages',
        id: parentDoc.id,
        data: {
          title: '11 children updated',
          slug: '11-children-updated',
          _status: 'published',
        },
      })

      // read children docs
      const { docs } = await payload.find({
        collection: 'pages',
        limit: 0,
        where: {
          parent: {
            equals: parentDoc.id,
          },
        },
      })

      const firstUpdatedChildBreadcrumbs = docs[0]?.breadcrumbs
      const lastUpdatedChildBreadcrumbs = docs[10]?.breadcrumbs

      expect(firstUpdatedChildBreadcrumbs).toHaveLength(2)
      // @ts-ignore
      expect(firstUpdatedChildBreadcrumbs[0].url).toStrictEqual('/11-children-updated')

      expect(firstUpdatedChildBreadcrumbs).toBeDefined()
      // @ts-ignore
      expect(lastUpdatedChildBreadcrumbs[0].url).toStrictEqual('/11-children-updated')
    })

    it('should return breadcrumbs as an array of objects', async () => {
      const parentDoc = await payload.create({
        collection: 'pages',
        data: {
          title: 'parent doc',
          slug: 'parent-doc',
          _status: 'published',
        },
      })

      const childDoc = await payload.create({
        collection: 'pages',
        data: {
          title: 'child doc',
          slug: 'child-doc',
          parent: parentDoc.id,
          _status: 'published',
        },
      })

      // expect breadcrumbs to be an array
      expect(childDoc.breadcrumbs).toBeInstanceOf(Array)
      expect(childDoc.breadcrumbs).toBeDefined()

      // expect each to be objects
      childDoc.breadcrumbs?.map((breadcrumb) => {
        expect(breadcrumb).toBeInstanceOf(Object)
      })
    })

    it('should update child doc breadcrumb without affecting any other data', async () => {
      const parentDoc = await payload.create({
        collection: 'pages',
        data: {
          title: 'parent doc',
          slug: 'parent',
        },
      })

      const childDoc = await payload.create({
        collection: 'pages',
        data: {
          title: 'child doc',
          slug: 'child',
          parent: parentDoc.id,
          _status: 'published',
        },
      })

      await payload.update({
        collection: 'pages',
        id: parentDoc.id,
        data: {
          title: 'parent updated',
          slug: 'parent-updated',
          _status: 'published',
        },
      })

      const updatedChild = await payload
        .find({
          collection: 'pages',
          where: {
            id: {
              equals: childDoc.id,
            },
          },
        })
        .then(({ docs }) => docs[0])

      // breadcrumbs should be updated
      expect(updatedChild!.breadcrumbs).toHaveLength(2)

      expect(updatedChild!.breadcrumbs?.[0]?.url).toStrictEqual('/parent-updated')
      expect(updatedChild!.breadcrumbs?.[1]?.url).toStrictEqual('/parent-updated/child')

      // no other data should be affected
      expect(updatedChild!.title).toEqual('child doc')
      expect(updatedChild!.slug).toEqual('child')
    })
  })

  describe('overrides', () => {
    let collection
    beforeAll(() => {
      collection = payload.config.collections.find(({ slug }) => slug === 'categories')
    })

    it('should allow overriding breadcrumbs field', () => {
      const breadcrumbField = collection.fields.find(
        (field) => field.type === 'array' && field.name === 'categorization',
      ) as ArrayField
      const customField = breadcrumbField.fields.find(
        (field) => field.type === 'text' && field.name === 'test',
      ) as ArrayField

      expect(breadcrumbField.admin.description).toStrictEqual('custom')
      expect(customField).toBeDefined()
      expect(breadcrumbField.admin.readOnly).toStrictEqual(true)
      expect(breadcrumbField.admin.readOnly).toStrictEqual(true)
    })

    it('should allow overriding parent field', () => {
      const parentField = collection.fields.find(
        (field) => field.type === 'relationship' && field.name === 'owner',
      ) as RelationshipField

      expect(parentField.admin.description).toStrictEqual('custom')
    })

    it('should allow custom breadcrumb and parent slugs', async () => {
      const parent = await payload.create({
        collection: 'categories',
        data: {
          name: 'parent',
        },
      })
      const child = await payload.create({
        collection: 'categories',
        data: {
          name: 'child',
          owner: parent.id,
        },
      })
      const grandchild = await payload.create({
        collection: 'categories',
        data: {
          name: 'grandchild',
          owner: child.id,
        },
      })

      expect(grandchild.categorization[0].doc).toStrictEqual(parent.id)
      expect(grandchild.categorization[0].label).toStrictEqual('parent')
      expect(grandchild.categorization[1].doc).toStrictEqual(child.id)
      expect(grandchild.categorization[1].label).toStrictEqual('child')
      expect(grandchild.categorization[2].label).toStrictEqual('grandchild')
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: payload-types.ts]---
Location: payload-main/test/plugin-nested-docs/payload-types.ts

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
    categories: Category;
    users: User;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  collectionsJoins: {};
  collectionsSelect: {
    pages: PagesSelect<false> | PagesSelect<true>;
    categories: CategoriesSelect<false> | CategoriesSelect<true>;
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
 * via the `definition` "pages".
 */
export interface Page {
  id: string;
  title: string;
  slug: string;
  fullTitle?: string | null;
  parent?: (string | null) | Page;
  breadcrumbs?:
    | {
        doc?: (string | null) | Page;
        url?: string | null;
        label?: string | null;
        id?: string | null;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "categories".
 */
export interface Category {
  id: string;
  name: string;
  /**
   * custom
   */
  categorization?:
    | {
        doc?: (string | null) | Category;
        url?: string | null;
        label?: string | null;
        test?: string | null;
        id?: string | null;
      }[]
    | null;
  /**
   * custom
   */
  owner?: (string | null) | Category;
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
        relationTo: 'categories';
        value: string | Category;
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
  fullTitle?: T;
  parent?: T;
  breadcrumbs?:
    | T
    | {
        doc?: T;
        url?: T;
        label?: T;
        id?: T;
      };
  updatedAt?: T;
  createdAt?: T;
  _status?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "categories_select".
 */
export interface CategoriesSelect<T extends boolean = true> {
  name?: T;
  categorization?:
    | T
    | {
        doc?: T;
        url?: T;
        label?: T;
        test?: T;
        id?: T;
      };
  owner?: T;
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
Location: payload-main/test/plugin-nested-docs/shared.ts

```typescript
export const pagesSlug = 'pages'

export const mediaSlug = 'media'
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.eslint.json]---
Location: payload-main/test/plugin-nested-docs/tsconfig.eslint.json

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
Location: payload-main/test/plugin-nested-docs/tsconfig.json

```json
{
  "extends": "../tsconfig.json"
}
```

--------------------------------------------------------------------------------

---[FILE: Categories.ts]---
Location: payload-main/test/plugin-nested-docs/collections/Categories.ts

```typescript
import type { CollectionConfig } from 'payload'

import { createBreadcrumbsField, createParentField } from '@payloadcms/plugin-nested-docs'

export const Categories: CollectionConfig = {
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      required: true,
      type: 'text',
    },
    createBreadcrumbsField('categories', {
      name: 'categorization',
      admin: {
        description: 'custom',
      },
      fields: [
        {
          name: 'test',
          type: 'text',
        },
      ],
    }),
    createParentField('categories', {
      name: 'owner',
      admin: {
        description: 'custom',
      },
    }),
  ],
  slug: 'categories',
}
```

--------------------------------------------------------------------------------

---[FILE: Pages.ts]---
Location: payload-main/test/plugin-nested-docs/collections/Pages.ts

```typescript
import type { CollectionConfig } from 'payload'

import { populateFullTitle } from './populateFullTitle.js'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Page',
    plural: 'Pages',
  },
  admin: {
    useAsTitle: 'fullTitle',
  },
  versions: {
    drafts: true,
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      required: true,
    },
    {
      name: 'fullTitle',
      type: 'text',
      localized: true,
      hooks: {
        beforeChange: [populateFullTitle],
      },
      admin: {
        components: {
          Field: null,
        },
      },
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: populateFullTitle.ts]---
Location: payload-main/test/plugin-nested-docs/collections/populateFullTitle.ts

```typescript
import type { FieldHook } from 'payload'

export const generateFullTitle = (breadcrumbs: Array<{ label: string }>): string | undefined => {
  if (Array.isArray(breadcrumbs)) {
    return breadcrumbs.reduce((title, breadcrumb, i) => {
      if (i === 0) return `${breadcrumb.label}`
      return `${title} > ${breadcrumb.label}`
    }, '')
  }

  return undefined
}

export const populateFullTitle: FieldHook = ({ data, originalDoc }) =>
  generateFullTitle(data?.breadcrumbs || originalDoc?.breadcrumbs)
```

--------------------------------------------------------------------------------

---[FILE: Users.ts]---
Location: payload-main/test/plugin-nested-docs/collections/Users.ts

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
    // Email added by default
    // Add more fields as needed
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/plugin-nested-docs/seed/index.ts

```typescript
import type { Payload } from 'payload'

export const seed = async (payload: Payload): Promise<boolean> => {
  payload.logger.info('Seeding data...')

  try {
    await payload.create({
      collection: 'users',
      data: {
        email: 'demo@payloadcms.com',
        password: 'demo',
      },
    })

    const { id: parentID } = await payload.create({
      collection: 'pages',
      data: {
        slug: 'parent-page',
        title: 'Parent page',
        _status: 'published',
      },
    })

    const { id: childID } = await payload.create({
      collection: 'pages',
      data: {
        parent: parentID,
        slug: 'child-page',
        title: 'Child page',
        _status: 'published',
      },
    })

    await payload.create({
      collection: 'pages',
      data: {
        parent: childID,
        slug: 'grandchild-page',
        title: 'Grandchild page',
        _status: 'published',
      },
    })

    await payload.create({
      collection: 'pages',
      data: {
        slug: 'sister-page',
        title: 'Sister page',
        _status: 'published',
      },
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
Location: payload-main/test/plugin-redirects/config.ts

```typescript
import { fileURLToPath } from 'node:url'
import path from 'path'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
import { redirectsPlugin } from '@payloadcms/plugin-redirects'

import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import { devUser } from '../credentials.js'
import { Pages } from './collections/Pages.js'
import { Users } from './collections/Users.js'
import { seed } from './seed/index.js'

export default buildConfigWithDefaults({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Pages],
  i18n: {
    translations: {
      // Test that custom translations can override ONLY specific keys
      // All other keys will use the plugin's defaults
      en: {
        $schema: './translation-schema.json',
        'plugin-redirects': {
          fromUrl: 'Source URL (Custom)', // Override just this one key
          // All other keys (customUrl, internalLink, etc.) will use plugin defaults
        },
      },
      de: {
        $schema: './translation-schema.json',
        'plugin-redirects': {
          // Full German translations (not included in plugin by default)
          customUrl: 'Benutzerdefinierte URL',
          documentToRedirect: 'Dokument zum Weiterleiten',
          fromUrl: 'Quell-URL',
          internalLink: 'Interner Link',
          redirectType: 'Weiterleitungstyp',
          toUrlType: 'Ziel-URL-Typ',
        },
      },
    },
  },
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
    redirectsPlugin({
      collections: ['pages'],
      overrides: {
        fields: ({ defaultFields }) => {
          return [
            ...defaultFields,
            {
              type: 'text',
              name: 'customField',
            },
          ]
        },
      },
      redirectTypes: ['301', '302'],
      redirectTypeFieldOverride: {
        label: 'Redirect Type (Overridden)',
      },
    }),
  ],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
```

--------------------------------------------------------------------------------

---[FILE: e2e.spec.ts]---
Location: payload-main/test/plugin-redirects/e2e.spec.ts

```typescript
import type { Page } from '@playwright/test'

import { expect, test } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

import type { PayloadTestSDK } from '../helpers/sdk/index.js'
import type { Config } from './payload-types.js'

import { ensureCompilationIsDone, initPageConsoleErrorCatch, saveDocAndAssert } from '../helpers.js'
import { AdminUrlUtil } from '../helpers/adminUrlUtil.js'
import { initPayloadE2ENoConfig } from '../helpers/initPayloadE2ENoConfig.js'
import { TEST_TIMEOUT_LONG } from '../playwright.config.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

test.describe('Redirects Plugin', () => {
  let page: Page
  let redirectsUrl: AdminUrlUtil
  let payload: PayloadTestSDK<Config>
  let serverURL: string

  test.beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)
    const { payload: payloadFromInit, serverURL: serverFromInit } =
      await initPayloadE2ENoConfig<Config>({
        dirname,
      })
    redirectsUrl = new AdminUrlUtil(serverFromInit, 'redirects')
    serverURL = serverFromInit
    payload = payloadFromInit

    const context = await browser.newContext()
    page = await context.newPage()
    initPageConsoleErrorCatch(page)

    await ensureCompilationIsDone({ page, serverURL })
  })

  test.describe('Redirects collection', () => {
    test('should display translated field labels in English (with custom override)', async () => {
      await page.goto(redirectsUrl.create)

      // Wait for page to load
      await page.waitForSelector('#field-from', { timeout: 10000 })

      // Check custom override for "from" field
      const fromLabel = page.locator('label[for="field-from"]')
      await expect(fromLabel).toContainText('Source URL (Custom)')

      // Check radio button labels (these are auto-injected by plugin)
      const internalLinkOption = page.locator('label[for="field-to.type-reference"]')
      await expect(internalLinkOption).toContainText('Internal link')

      const customUrlOption = page.locator('label[for="field-to.type-custom"]')
      await expect(customUrlOption).toContainText('Custom URL')

      // Check the override field still works
      const redirectTypeLabel = page.locator('label[for="field-type"]')
      await expect(redirectTypeLabel).toContainText('Redirect Type (Overridden)')
    })

    test('should display translated field labels in Spanish', async () => {
      // Change user language to Spanish
      await page.goto(serverURL + '/admin/account')
      await page.waitForSelector('.payload-settings__language .react-select')
      await page.locator('.payload-settings__language .react-select').click()
      await page.locator('.rs__option', { hasText: 'Español' }).click()

      // Wait for settings to save
      await page.waitForTimeout(500)

      await page.goto(redirectsUrl.create)
      await page.waitForSelector('#field-from', { timeout: 10000 })

      // Check Spanish translations (auto-injected by plugin)
      const fromLabel = page.locator('label[for="field-from"]')
      await expect(fromLabel).toContainText('URL de origen')

      const internalLinkOption = page.locator('label[for="field-to.type-reference"]')
      await expect(internalLinkOption).toContainText('Enlace interno')

      const customUrlOption = page.locator('label[for="field-to.type-custom"]')
      await expect(customUrlOption).toContainText('URL personalizada')
    })

    test('should display translated field labels in German (custom translation)', async () => {
      // Change user language to German
      await page.goto(serverURL + '/admin/account')
      await page.waitForSelector('.payload-settings__language .react-select')
      await page.locator('.payload-settings__language .react-select').click()
      await page.locator('.rs__option', { hasText: 'Deutsch' }).click()

      // Wait for settings to save
      await page.waitForTimeout(500)

      await page.goto(redirectsUrl.create)
      await page.waitForSelector('#field-from', { timeout: 10000 })

      // Check German translations (from config override)
      const fromLabel = page.locator('label[for="field-from"]')
      await expect(fromLabel).toContainText('Quell-URL')

      const internalLinkOption = page.locator('label[for="field-to.type-reference"]')
      await expect(internalLinkOption).toContainText('Interner Link')

      const customUrlOption = page.locator('label[for="field-to.type-custom"]')
      await expect(customUrlOption).toContainText('Benutzerdefinierte URL')
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: int.spec.ts]---
Location: payload-main/test/plugin-redirects/int.spec.ts

```typescript
import type { Payload } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

import type { Page } from './payload-types.js'

import { initPayloadInt } from '../helpers/initPayloadInt.js'
import { pagesSlug } from './shared.js'

let payload: Payload
let page: Page

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

describe('@payloadcms/plugin-redirects', () => {
  beforeAll(async () => {
    ;({ payload } = await initPayloadInt(dirname))

    page = await payload.create({
      collection: 'pages',
      data: {
        title: 'Test',
      },
    })
  })

  afterAll(async () => {
    await payload.destroy()
  })

  it('should add a redirects collection', async () => {
    const redirect = await payload.find({
      collection: 'redirects',
      depth: 0,
      limit: 1,
    })

    expect(redirect).toBeTruthy()
  })

  it('should add a redirect with to internal page', async () => {
    const redirect = await payload.create({
      collection: 'redirects',
      data: {
        from: '/test',
        to: {
          type: 'reference',
          reference: {
            relationTo: pagesSlug,
            value: page.id,
          },
        },
        type: '301',
      },
    })

    expect(redirect).toBeTruthy()
    expect(redirect.from).toBe('/test')
    expect(redirect.to.reference.value).toMatchObject(page)
  })

  it('should add a redirect with to custom url', async () => {
    const redirect = await payload.create({
      collection: 'redirects',
      data: {
        from: '/test2',
        to: {
          type: 'custom',
          url: '/test',
        },
        type: '301',
      },
    })

    expect(redirect).toBeTruthy()
    expect(redirect.from).toBe('/test2')
    expect(redirect.to.url).toBe('/test')
  })
})
```

--------------------------------------------------------------------------------

````
