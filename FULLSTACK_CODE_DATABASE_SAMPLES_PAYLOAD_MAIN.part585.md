---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 585
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 585 of 695)

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

---[FILE: types.ts]---
Location: payload-main/test/helpers/sdk/types.ts

```typescript
import type { TypeWithID, Where, WhereField } from 'payload'
import type { DeepPartial, MarkOptional } from 'ts-essentials'

type CollectionDoc = {
  createdAt?: string
  id?: number | string
  sizes?: unknown
  updatedAt?: string
}

type BaseTypes = {
  collections: Record<string, CollectionDoc>
  globals: Record<string, TypeWithID>
}

export type GeneratedTypes<T extends BaseTypes> = {
  collections: {
    [P in keyof T['collections']]: CollectionDoc
  }
  globals: {
    [P in keyof T['globals']]: T['globals'][P]
  }
}

export type FetchOptions = {
  args?: Record<string, unknown>
  jwt?: string
  operation:
    | 'create'
    | 'delete'
    | 'find'
    | 'findVersions'
    | 'login'
    | 'sendEmail'
    | 'update'
    | 'updateGlobal'
  reduceJSON?: <R>(json: any) => R
}

type BaseArgs = {
  jwt?: string
}

export type CreateArgs<
  TGeneratedTypes extends GeneratedTypes<TGeneratedTypes>,
  TSlug extends keyof TGeneratedTypes['collections'],
> = {
  collection: TSlug
  data: MarkOptional<
    TGeneratedTypes['collections'][TSlug],
    'createdAt' | 'id' | 'sizes' | 'updatedAt'
  >
  depth?: number
  draft?: boolean
  fallbackLocale?: string
  file?: File
  filePath?: string
  locale?: string
  overrideAccess?: boolean
  overwriteExistingFiles?: boolean
  showHiddenFields?: boolean
  user?: TypeWithID
} & BaseArgs

export type UpdateByIDArgs<
  TGeneratedTypes extends GeneratedTypes<TGeneratedTypes>,
  TSlug extends keyof TGeneratedTypes['collections'],
> = {
  id: number | string
  where?: never
} & UpdateBaseArgs<TGeneratedTypes, TSlug>

export type UpdateManyArgs<
  TGeneratedTypes extends GeneratedTypes<TGeneratedTypes>,
  TSlug extends keyof TGeneratedTypes['collections'],
> = {
  id: never
  where?: Where
} & UpdateBaseArgs<TGeneratedTypes, TSlug>

export type UpdateBaseArgs<
  TGeneratedTypes extends GeneratedTypes<TGeneratedTypes>,
  TSlug extends keyof TGeneratedTypes['collections'],
> = {
  autosave?: boolean
  collection: TSlug
  data: DeepPartial<TGeneratedTypes['collections'][TSlug]>
  depth?: number
  draft?: boolean
  fallbackLocale?: string
  file?: File
  filePath?: string
  locale?: string
  overrideAccess?: boolean
  overwriteExistingFiles?: boolean
  showHiddenFields?: boolean
  user?: TypeWithID
} & BaseArgs

export type UpdateArgs<
  TGeneratedTypes extends GeneratedTypes<TGeneratedTypes>,
  TSlug extends keyof TGeneratedTypes['collections'],
> = UpdateByIDArgs<TGeneratedTypes, TSlug> | UpdateManyArgs<TGeneratedTypes, TSlug>

export type UpdateGlobalArgs<
  TGeneratedTypes extends GeneratedTypes<TGeneratedTypes>,
  TSlug extends keyof TGeneratedTypes['globals'],
> = {
  data: DeepPartial<TGeneratedTypes['globals'][TSlug]>
  slug: TSlug
} & BaseArgs

export type FindArgs<
  TGeneratedTypes extends GeneratedTypes<TGeneratedTypes>,
  TSlug extends keyof TGeneratedTypes['collections'],
> = {
  collection: TSlug
  depth?: number
  disableErrors?: boolean
  draft?: boolean
  fallbackLocale?: string
  limit?: number
  locale?: string
  overrideAccess?: boolean
  page?: number
  pagination?: boolean
  showHiddenFields?: boolean
  sort?: string
  trash?: boolean
  user?: TypeWithID
  where?: Where
} & BaseArgs

export type LoginArgs<
  TGeneratedTypes extends GeneratedTypes<TGeneratedTypes>,
  TSlug extends keyof TGeneratedTypes['collections'],
> = {
  collection: TSlug
  data: {
    email: string
    password: string
  }
} & BaseArgs

export type DeleteArgs<
  TGeneratedTypes extends GeneratedTypes<TGeneratedTypes>,
  TSlug extends keyof TGeneratedTypes['collections'],
> = {
  collection: TSlug
  id?: string
  overrideAccess?: boolean
  trash?: boolean
  where?: Where
} & BaseArgs
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: payload-main/test/hooks/config.ts

```typescript
import { fileURLToPath } from 'node:url'
import path from 'path'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
import type { SanitizedConfig } from 'payload'

import { APIError } from 'payload'

import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import { AfterOperationCollection } from './collections/AfterOperation/index.js'
import { BeforeChangeHooks } from './collections/BeforeChange/index.js'
import {
  BeforeDelete2Collection,
  BeforeDeleteCollection,
} from './collections/BeforeDelete/index.js'
import { BeforeOperationCollection } from './collections/BeforeOperation/index.js'
import { BeforeValidateCollection } from './collections/BeforeValidate/index.js'
import ChainingHooks from './collections/ChainingHooks/index.js'
import ContextHooks from './collections/ContextHooks/index.js'
import { DataHooks } from './collections/Data/index.js'
import { FieldPaths } from './collections/FieldPaths/index.js'
import Hooks, { hooksSlug } from './collections/Hook/index.js'
import NestedAfterChangeHooks from './collections/NestedAfterChangeHook/index.js'
import NestedAfterReadHooks from './collections/NestedAfterReadHooks/index.js'
import Relations from './collections/Relations/index.js'
import TransformHooks from './collections/Transform/index.js'
import Users, { seedHooksUsers } from './collections/Users/index.js'
import { ValueCollection } from './collections/Value/index.js'
import { DataHooksGlobal } from './globals/Data/index.js'

export const HooksConfig: Promise<SanitizedConfig> = buildConfigWithDefaults({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    BeforeOperationCollection,
    BeforeChangeHooks,
    BeforeValidateCollection,
    AfterOperationCollection,
    ContextHooks,
    TransformHooks,
    Hooks,
    NestedAfterReadHooks,
    NestedAfterChangeHooks,
    ChainingHooks,
    Relations,
    Users,
    DataHooks,
    BeforeDeleteCollection,
    BeforeDelete2Collection,
    FieldPaths,
    ValueCollection,
  ],
  globals: [DataHooksGlobal],
  endpoints: [
    {
      path: '/throw-to-after-error',
      method: 'get',
      handler: () => {
        throw new APIError("I'm a teapot", 418)
      },
    },
  ],
  hooks: {
    afterError: [() => console.log('Running afterError hook')],
  },
  onInit: async (payload) => {
    await seedHooksUsers(payload)
    await payload.create({
      collection: hooksSlug,
      data: {
        fieldBeforeValidate: false,
        collectionBeforeValidate: false,
        fieldBeforeChange: false,
        collectionBeforeChange: false,
        fieldAfterChange: false,
        collectionAfterChange: false,
        collectionBeforeRead: false,
        fieldAfterRead: false,
        collectionAfterRead: false,
      },
    })
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})

export default HooksConfig
```

--------------------------------------------------------------------------------

---[FILE: e2e.spec.ts]---
Location: payload-main/test/hooks/e2e.spec.ts

```typescript
import type { Page } from '@playwright/test'
import type { CollectionSlug } from 'payload'

import { expect, test } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

import type { PayloadTestSDK } from '../helpers/sdk/index.js'
import type { Config } from './payload-types.js'

import { ensureCompilationIsDone, initPageConsoleErrorCatch, saveDocAndAssert } from '../helpers.js'
import { AdminUrlUtil } from '../helpers/adminUrlUtil.js'
import { initPayloadE2ENoConfig } from '../helpers/initPayloadE2ENoConfig.js'
import { TEST_TIMEOUT_LONG } from '../playwright.config.js'
import { beforeValidateSlug } from './shared.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const { beforeAll, beforeEach, describe } = test

let payload: PayloadTestSDK<Config>

describe('Hooks', () => {
  let url: AdminUrlUtil
  let beforeChangeURL: AdminUrlUtil
  let beforeDeleteURL: AdminUrlUtil
  let beforeDelete2URL: AdminUrlUtil
  let page: Page
  let serverURL: string

  beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)
    ;({ payload, serverURL } = await initPayloadE2ENoConfig<Config>({ dirname }))

    url = new AdminUrlUtil(serverURL, 'before-validate')
    beforeChangeURL = new AdminUrlUtil(serverURL, 'before-change-hooks')
    beforeDeleteURL = new AdminUrlUtil(serverURL, 'before-delete-hooks')
    beforeDelete2URL = new AdminUrlUtil(serverURL, 'before-delete-2-hooks')
    const context = await browser.newContext()
    page = await context.newPage()

    initPageConsoleErrorCatch(page)
    await ensureCompilationIsDone({ page, serverURL })
  })

  beforeEach(async () => {
    await ensureCompilationIsDone({ page, serverURL })

    await clearAllDocs()
  })

  test('should replace value with before validate response', async () => {
    await page.goto(url.create)
    await page.locator('#field-title').fill('should replace value with before validate response')
    await saveDocAndAssert(page)

    await expect(page.locator('#field-title')).toHaveValue('reset in beforeValidate')
    await page
      .locator('#field-title')
      .fill('should replace value with before validate response again')
    await saveDocAndAssert(page)

    await expect(page.locator('#field-title')).toHaveValue('reset in beforeValidate')
  })

  test('should reflect changes made in beforeChange collection hooks within ui after save', async () => {
    await page.goto(beforeChangeURL.create)
    await page.locator('#field-title').fill('should replace value with before change response')
    await saveDocAndAssert(page)

    await expect(page.locator('#field-title')).toHaveValue('hi from hook')
    await page.locator('#field-title').fill('helllooooooooo')
    await saveDocAndAssert(page)

    await expect(page.locator('#field-title')).toHaveValue('hi from hook')
  })

  describe('beforeDelete errors', () => {
    test('ensure document with erroring beforeDelete hook cannot be deleted from list view while public 401 error is shown in toast', async () => {
      const doc = await payload.create({
        collection: 'before-delete-hooks',
        data: {
          title: 'some title',
        },
      })

      await page.goto(beforeDeleteURL.list)

      const tr = page.locator(`tr[data-id="${doc.id}"]`)
      await expect(tr).toBeVisible()
      await tr.locator('.checkbox-input__input input').check()

      const deleteBtn = page.locator('.list-selection__button.delete-documents__toggle')
      await deleteBtn.click()

      await page.locator('#confirm-action').click()

      await expect(page.locator('.payload-toast-container')).toContainText(
        `Test error: cannot delete document with ID ${doc.id}`,
      )

      // Ensure the document is still in the db
      await expect
        .poll(
          async () => {
            const docs = await payload.find({
              collection: 'before-delete-hooks',
              where: {
                id: { equals: doc.id },
              },
            })
            return docs.totalDocs
          },
          { timeout: TEST_TIMEOUT_LONG },
        )
        .toBe(1)

      await payload.delete({
        collection: 'before-delete-hooks',
        id: doc.id,
      })
    })

    test('ensure document with erroring beforeDelete hook cannot be deleted from edit view while public 401 error is shown in toast', async () => {
      const doc = await payload.create({
        collection: 'before-delete-hooks',
        data: {
          title: 'some title',
        },
      })

      await page.goto(beforeDeleteURL.edit(doc.id))

      await page.locator('.doc-controls__popup .popup-button').click()
      await page.locator('#action-delete').click()

      await page.locator('#confirm-action').click()

      await expect(page.locator('.payload-toast-container')).toContainText(
        `Test error: cannot delete document with ID ${doc.id}`,
      )

      // Ensure the document is still in the db
      await expect
        .poll(
          async () => {
            const docs = await payload.find({
              collection: 'before-delete-hooks',
              where: {
                id: { equals: doc.id },
              },
            })
            return docs.totalDocs
          },
          { timeout: TEST_TIMEOUT_LONG },
        )
        .toBe(1)

      await payload.delete({
        collection: 'before-delete-hooks',
        id: doc.id,
      })
    })

    test('ensure private 500 error is not shown when deleting document with erroring beforeDelete hook from list view', async () => {
      const doc = await payload.create({
        collection: 'before-delete-2-hooks',
        data: {
          title: 'some title',
        },
      })

      await page.goto(beforeDelete2URL.list)

      const tr = page.locator(`tr[data-id="${doc.id}"]`)
      await expect(tr).toBeVisible()
      await tr.locator('.checkbox-input__input input').check()

      const deleteBtn = page.locator('.list-selection__button.delete-documents__toggle')
      await deleteBtn.click()

      await page.locator('#confirm-action').click()

      await expect(page.locator('.payload-toast-container')).toContainText('Something went wrong.')
      await expect(page.locator('.payload-toast-container')).not.toContainText(
        `Test error: cannot delete document with ID ${doc.id}`,
      )

      await payload.delete({
        collection: 'before-delete-2-hooks',
        id: doc.id,
      })
    })

    test('ensure private 500 error is not shown when deleting document with erroring beforeDelete hook from edit view', async () => {
      const doc = await payload.create({
        collection: 'before-delete-2-hooks',
        data: {
          title: 'some title',
        },
      })

      await page.goto(beforeDelete2URL.edit(doc.id))

      await page.locator('.doc-controls__popup .popup-button').click()
      await page.locator('#action-delete').click()

      await page.locator('#confirm-action').click()

      await expect(page.locator('.payload-toast-container')).toContainText('Something went wrong.')
      await expect(page.locator('.payload-toast-container')).not.toContainText(
        `Test error: cannot delete document with ID ${doc.id}`,
      )

      await payload.delete({
        collection: 'before-delete-2-hooks',
        id: doc.id,
      })
    })
  })
})

async function clearAllDocs(): Promise<void> {
  await clearCollectionDocs(beforeValidateSlug)
}

async function clearCollectionDocs(collectionSlug: CollectionSlug): Promise<void> {
  await payload.delete({
    collection: collectionSlug,
    where: {
      id: { exists: true },
    },
  })
}
```

--------------------------------------------------------------------------------

````
