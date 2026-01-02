---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 531
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 531 of 695)

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

---[FILE: tsconfig.eslint.json]---
Location: payload-main/test/benchmark-blocks/tsconfig.eslint.json

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
Location: payload-main/test/benchmark-blocks/tsconfig.json

```json
{
  "extends": "../tsconfig.json",
}
```

--------------------------------------------------------------------------------

---[FILE: types.d.ts]---
Location: payload-main/test/benchmark-blocks/types.d.ts

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

---[FILE: blocks.ts]---
Location: payload-main/test/benchmark-blocks/blocks/blocks.ts

```typescript
import type { Block, BlocksField, BlockSlug } from 'payload'

export const generateBlocks = (
  blockCount: number,
  useReferences?: boolean,
): (Block | BlockSlug)[] => {
  const blocks: (Block | BlockSlug)[] = []

  for (let i = 0; i < blockCount; i++) {
    if (useReferences) {
      blocks.push(`block_${i}` as BlockSlug)
    } else {
      blocks.push({
        slug: `block_${i}`,
        fields: [
          {
            name: 'field1',
            type: 'text',
          },
          {
            name: 'field2',
            type: 'text',
          },
          {
            name: 'field3',
            type: 'text',
          },
          {
            name: 'field4',
            type: 'number',
          },
        ],
      })
    }
  }

  return blocks
}
export const generateBlockFields = (
  blockCount: number,
  containerCount: number,
  useReferences?: boolean,
): BlocksField[] => {
  const fields: BlocksField[] = []
  for (let i = 0; i < containerCount; i++) {
    const block: BlocksField = {
      name: `blocksfield_${i}`,
      type: 'blocks',
      blocks: [],
    }

    if (useReferences) {
      block.blockReferences = generateBlocks(blockCount, true)
    } else {
      block.blocks = generateBlocks(blockCount) as any
    }
    fields.push(block)
  }

  return fields
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/benchmark-blocks/collections/Media/index.ts

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
Location: payload-main/test/benchmark-blocks/collections/Posts/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { lexicalEditor } from '@payloadcms/richtext-lexical'

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
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [...defaultFeatures],
      }),
    },
  ],
  versions: {
    drafts: true,
  },
}
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/test/bulk-edit/.gitignore

```text
/media
/media-gif
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: payload-main/test/bulk-edit/config.ts

```typescript
import { fileURLToPath } from 'node:url'
import path from 'path'

import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import { devUser } from '../credentials.js'
import { PostsCollection } from './collections/Posts/index.js'
import { TabsCollection } from './collections/Tabs/index.js'
import { postsSlug } from './shared.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfigWithDefaults({
  collections: [PostsCollection, TabsCollection],
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
Location: payload-main/test/bulk-edit/e2e.spec.ts

```typescript
import type { BrowserContext, Locator, Page } from '@playwright/test'
import type { PayloadTestSDK } from 'helpers/sdk/index.js'

import { expect, test } from '@playwright/test'
import { addArrayRow } from 'helpers/e2e/fields/array/index.js'
import { addListFilter } from 'helpers/e2e/filters/index.js'
import { selectInput } from 'helpers/e2e/selectInput.js'
import { toggleBlockOrArrayRow } from 'helpers/e2e/toggleCollapsible.js'
import * as path from 'path'
import { wait } from 'payload/shared'
import { fileURLToPath } from 'url'

import type { Config, Post } from './payload-types.js'

import {
  ensureCompilationIsDone,
  exactText,
  findTableCell,
  initPageConsoleErrorCatch,
  selectTableRow,
  // throttleTest,
} from '../helpers.js'
import { AdminUrlUtil } from '../helpers/adminUrlUtil.js'
import { initPayloadE2ENoConfig } from '../helpers/initPayloadE2ENoConfig.js'
import { TEST_TIMEOUT_LONG } from '../playwright.config.js'
import { postsSlug, tabsSlug } from './shared.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

let context: BrowserContext
let payload: PayloadTestSDK<Config>
let serverURL: string

test.describe('Bulk Edit', () => {
  let page: Page
  let postsUrl: AdminUrlUtil
  let tabsUrl: AdminUrlUtil

  test.beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)
    ;({ payload, serverURL } = await initPayloadE2ENoConfig({ dirname }))
    postsUrl = new AdminUrlUtil(serverURL, postsSlug)
    tabsUrl = new AdminUrlUtil(serverURL, tabsSlug)

    context = await browser.newContext()
    page = await context.newPage()
    initPageConsoleErrorCatch(page)
    await ensureCompilationIsDone({ page, serverURL })
  })

  test.beforeEach(async () => {
    // await throttleTest({ page, context, delay: 'Fast 3G' })
  })

  test('should not show "select all across pages" button if already selected all', async () => {
    await deleteAllPosts()
    await createPost({ title: 'Post 1' })
    await page.goto(postsUrl.list)
    await page.locator('input#select-all').check()
    await expect(page.locator('button#select-all-across-pages')).toBeHidden()
  })

  test('should update selection state after deselecting item following select all', async () => {
    await deleteAllPosts()

    Array.from({ length: 6 }).forEach(async (_, i) => {
      await createPost({ title: `Post ${i + 1}` })
    })

    await page.goto(postsUrl.list)
    await page.locator('input#select-all').check()
    await page.locator('button#select-all-across-pages').click()

    // Deselect the first row
    await page.locator('.row-1 input').click()

    // eslint-disable-next-line jest-dom/prefer-checked
    await expect(page.locator('input#select-all')).not.toHaveAttribute('checked', '')
  })

  test('should delete many', async () => {
    await deleteAllPosts()

    const titleOfPostToDelete1 = 'Post to delete (published)'
    const titleOfPostToDelete2 = 'Post to delete (draft)'

    await Promise.all([
      createPost({ title: titleOfPostToDelete1 }),
      createPost({ title: titleOfPostToDelete2 }, { draft: true }),
    ])

    await page.goto(postsUrl.list)

    await expect(page.locator(`tbody tr:has-text("${titleOfPostToDelete1}")`)).toBeVisible()
    await expect(page.locator(`tbody tr:has-text("${titleOfPostToDelete2}")`)).toBeVisible()

    await selectTableRow(page, titleOfPostToDelete1)
    await selectTableRow(page, titleOfPostToDelete2)

    await page.locator('.delete-documents__toggle').click()
    await page.locator('#confirm-delete-many-docs #confirm-action').click()

    await expect(page.locator('.payload-toast-container .toast-success')).toContainText(
      'Deleted 2 Posts successfully.',
    )

    await expect(page.locator(`tbody tr:has-text("${titleOfPostToDelete1}")`)).toBeHidden()
    await expect(page.locator(`tbody tr:has-text("${titleOfPostToDelete2}")`)).toBeHidden()
  })

  test('should publish many', async () => {
    await deleteAllPosts()

    const titleOfPostToPublish1 = 'Post to publish (already published)'
    const titleOfPostToPublish2 = 'Post to publish (draft)'

    await Promise.all([
      createPost({ title: titleOfPostToPublish1 }),
      createPost({ title: titleOfPostToPublish2 }, { draft: true }),
    ])

    await page.goto(postsUrl.list)

    await expect(page.locator(`tbody tr:has-text("${titleOfPostToPublish1}")`)).toBeVisible()
    await expect(page.locator(`tbody tr:has-text("${titleOfPostToPublish2}")`)).toBeVisible()

    await selectTableRow(page, titleOfPostToPublish1)
    await selectTableRow(page, titleOfPostToPublish2)

    await page.locator('.list-selection__button[aria-label="Publish"]').click()
    await page.locator('#publish-posts #confirm-action').click()

    await expect(page.locator('.payload-toast-container .toast-success')).toContainText(
      'Updated 2 Posts successfully.',
    )

    await expect(await findTableCell(page, '_status', titleOfPostToPublish1)).toContainText(
      'Published',
    )
    await expect(await findTableCell(page, '_status', titleOfPostToPublish2)).toContainText(
      'Published',
    )
  })

  test('should unpublish many', async () => {
    await deleteAllPosts()

    const titleOfPostToUnpublish1 = 'Post to unpublish (published)'
    const titleOfPostToUnpublish2 = 'Post to unpublish (already draft)'

    await Promise.all([
      createPost({ title: titleOfPostToUnpublish1 }),
      createPost({ title: titleOfPostToUnpublish2 }, { draft: true }),
    ])

    await page.goto(postsUrl.list)

    await expect(page.locator(`tbody tr:has-text("${titleOfPostToUnpublish1}")`)).toBeVisible()
    await expect(page.locator(`tbody tr:has-text("${titleOfPostToUnpublish2}")`)).toBeVisible()

    await selectTableRow(page, titleOfPostToUnpublish1)
    await selectTableRow(page, titleOfPostToUnpublish2)

    await page.locator('.list-selection__button[aria-label="Unpublish"]').click()
    await page.locator('#unpublish-posts #confirm-action').click()

    await expect(await findTableCell(page, '_status', titleOfPostToUnpublish1)).toContainText(
      'Draft',
    )
    await expect(await findTableCell(page, '_status', titleOfPostToUnpublish2)).toContainText(
      'Draft',
    )
  })

  test('should update many', async () => {
    await deleteAllPosts()

    const updatedPostTitle = 'Post (Updated)'

    Array.from({ length: 3 }).forEach(async (_, i) => {
      await createPost({ title: `Post ${i + 1}` })
    })

    await page.goto(postsUrl.list)

    for (let i = 1; i <= 3; i++) {
      const invertedIndex = 4 - i
      await expect(page.locator(`.row-${invertedIndex} .cell-title`)).toContainText(`Post ${i}`)
    }

    await page.locator('input#select-all').check()
    await page.locator('.edit-many__toggle').click()

    const { field, modal } = await selectFieldToEdit(page, {
      fieldLabel: 'Title',
      fieldID: 'title',
    })

    await field.fill(updatedPostTitle)
    await modal.locator('.form-submit button[type="submit"].edit-many__publish').click()

    await expect(page.locator('.payload-toast-container .toast-success')).toContainText(
      'Updated 3 Posts successfully.',
    )

    for (let i = 1; i <= 3; i++) {
      const invertedIndex = 4 - i
      await expect(page.locator(`.row-${invertedIndex} .cell-title`)).toContainText(
        updatedPostTitle,
      )
    }
  })

  test('should publish many from drawer', async () => {
    await deleteAllPosts()

    const titleOfPostToPublish1 = 'Post to unpublish (published)'
    const titleOfPostToPublish2 = 'Post to publish (already draft)'

    await Promise.all([
      createPost({ title: titleOfPostToPublish1 }),
      createPost({ title: titleOfPostToPublish2 }, { draft: true }),
    ])

    const description = 'published document'

    await page.goto(postsUrl.list)

    await expect(page.locator(`tbody tr:has-text("${titleOfPostToPublish1}")`)).toBeVisible()
    await expect(page.locator(`tbody tr:has-text("${titleOfPostToPublish2}")`)).toBeVisible()

    await selectTableRow(page, titleOfPostToPublish1)
    await selectTableRow(page, titleOfPostToPublish2)

    await page.locator('.edit-many__toggle').click()

    const { field, modal } = await selectFieldToEdit(page, {
      fieldLabel: 'Description',
      fieldID: 'description',
    })

    await field.fill(description)

    // Bulk edit the selected rows to `published` status
    await modal.locator('.form-submit .edit-many__publish').click()

    await expect(page.locator('.payload-toast-container .toast-success')).toContainText(
      'Updated 2 Posts successfully.',
    )

    await expect(await findTableCell(page, '_status', titleOfPostToPublish1)).toContainText(
      'Published',
    )
    await expect(await findTableCell(page, '_status', titleOfPostToPublish2)).toContainText(
      'Published',
    )
  })

  test('should draft many from drawer', async () => {
    await deleteAllPosts()

    const titleOfPostToDraft1 = 'Post to draft (published)'
    const titleOfPostToDraft2 = 'Post to draft (draft)'

    await Promise.all([
      createPost({ title: titleOfPostToDraft1 }),
      createPost({ title: titleOfPostToDraft2 }, { draft: true }),
    ])

    const description = 'draft document'

    await page.goto(postsUrl.list)

    await selectTableRow(page, titleOfPostToDraft1)
    await selectTableRow(page, titleOfPostToDraft2)

    await page.locator('.edit-many__toggle').click()

    const { field, modal } = await selectFieldToEdit(page, {
      fieldLabel: 'Description',
      fieldID: 'description',
    })

    await field.fill(description)

    // Bulk edit the selected rows to `draft` status
    await modal.locator('.form-submit .edit-many__draft').click()

    await expect(page.locator('.payload-toast-container .toast-success')).toContainText(
      'Updated 2 Posts successfully.',
    )

    await expect(await findTableCell(page, '_status', titleOfPostToDraft1)).toContainText('Draft')
    await expect(await findTableCell(page, '_status', titleOfPostToDraft2)).toContainText('Draft')
  })

  test('should delete all on page', async () => {
    await deleteAllPosts()

    Array.from({ length: 3 }).forEach(async (_, i) => {
      await createPost({ title: `Post ${i + 1}` })
    })

    await page.goto(postsUrl.list)
    await expect(page.locator('.table table > tbody > tr')).toHaveCount(3)

    await page.locator('input#select-all').check()
    await page.locator('.list-selection__button[aria-label="Delete"]').click()
    await page.locator('#confirm-delete-many-docs #confirm-action').click()

    await expect(page.locator('.payload-toast-container .toast-success')).toHaveText(
      'Deleted 3 Posts successfully.',
    )

    await page.locator('.collection-list__no-results').isVisible()
  })

  test('should delete all with filters and across pages', async () => {
    await deleteAllPosts()

    Array.from({ length: 6 }).forEach(async (_, i) => {
      await createPost({ title: `Post ${i + 1}` })
    })

    await page.goto(postsUrl.list)

    await expect(page.locator('.page-controls__page-info')).toContainText('1-5 of 6')

    await page.locator('#search-filter-input').fill('Post')
    await page.waitForURL(/search=Post/)
    await expect(page.locator('.table table > tbody > tr')).toHaveCount(5)
    await page.locator('input#select-all').check()
    await page.locator('button#select-all-across-pages').click()
    await page.locator('.list-selection__button[aria-label="Delete"]').click()
    await page.locator('#confirm-delete-many-docs #confirm-action').click()

    await expect(page.locator('.payload-toast-container .toast-success')).toHaveText(
      'Deleted 6 Posts successfully.',
    )

    await page.locator('.collection-list__no-results').isVisible()
  })

  test('should update all with filters and across pages', async () => {
    await deleteAllPosts()

    Array.from({ length: 6 }).forEach(async (_, i) => {
      await createPost({ title: `Post ${i + 1}` })
    })

    await page.goto(postsUrl.list)
    await page.locator('#search-filter-input').fill('Post')
    await page.waitForURL(/search=Post/)
    await expect(page.locator('.table table > tbody > tr')).toHaveCount(5)

    await page.locator('input#select-all').check()
    await page.locator('button#select-all-across-pages').click()

    await page.locator('.edit-many__toggle').click()

    const { field } = await selectFieldToEdit(page, {
      fieldLabel: 'Title',
      fieldID: 'title',
    })

    const updatedTitle = 'Post (Updated)'
    await field.fill(updatedTitle)

    await page.locator('.form-submit button[type="submit"].edit-many__publish').click()
    await expect(page.locator('.payload-toast-container .toast-success')).toContainText(
      'Updated 6 Posts successfully.',
    )

    await expect(page.locator('.table table > tbody > tr')).toHaveCount(5)
    await expect(page.locator('.row-1 .cell-title')).toContainText(updatedTitle)
  })

  test('should not override un-edited values if it has a defaultValue', async () => {
    await deleteAllPosts()

    const postData = {
      title: 'Post 1',
      array: [
        {
          optional: 'some optional array field',
          innerArrayOfFields: [
            {
              innerOptional: 'some inner optional array field',
            },
          ],
        },
      ],
      group: {
        defaultValueField: 'This is NOT the default value',
        title: 'some title',
      },
      blocks: [
        {
          textFieldForBlock: 'some text for block text',
          blockType: 'textBlock',
        },
      ],
      defaultValueField: 'This is NOT the default value',
    }

    const updatedPostTitle = 'Post 1 (Updated)'

    const { id: postID } = await createPost(postData)

    await page.goto(postsUrl.list)

    const { modal } = await selectAllAndEditMany(page)

    const { field } = await selectFieldToEdit(page, {
      fieldLabel: 'Title',
      fieldID: 'title',
    })

    await field.fill(updatedPostTitle)
    await modal.locator('.form-submit button[type="submit"].edit-many__publish').click()

    await expect(page.locator('.payload-toast-container .toast-success')).toContainText(
      'Updated 1 Post successfully.',
    )

    const updatedPost = await payload.find({
      collection: postsSlug,
      limit: 1,
      depth: 0,
      where: {
        id: {
          equals: postID,
        },
      },
    })

    expect(updatedPost.docs[0]).toMatchObject({
      ...postData,
      title: updatedPostTitle,
    })
  })

  test('should bulk edit fields with subfields', async () => {
    await deleteAllPosts()

    await createPost()

    await page.goto(postsUrl.list)

    await selectAllAndEditMany(page)

    const { modal, field } = await selectFieldToEdit(page, {
      fieldLabel: 'Group > Title',
      fieldID: 'group__title',
    })

    await field.fill('New Group Title')
    await modal.locator('.form-submit button[type="submit"].edit-many__publish').click()

    await expect(page.locator('.payload-toast-container .toast-success')).toContainText(
      'Updated 1 Post successfully.',
    )

    const updatedPost = await payload
      .find({
        collection: 'posts',
        limit: 1,
      })
      ?.then((res) => res.docs[0])

    expect(updatedPost?.group?.title).toBe('New Group Title')
  })

  test('should not display fields options lacking read and update permissions', async () => {
    await deleteAllPosts()

    await createPost()

    await page.goto(postsUrl.list)

    const { modal } = await selectAllAndEditMany(page)

    await expect(
      modal.locator('.field-select .rs__option', { hasText: exactText('No Read') }),
    ).toBeHidden()

    await expect(
      modal.locator('.field-select .rs__option', { hasText: exactText('No Update') }),
    ).toBeHidden()
  })

  test('should thread field permissions through subfields', async () => {
    await deleteAllPosts()

    await createPost()

    await page.goto(postsUrl.list)

    await selectAllAndEditMany(page)

    const { field } = await selectFieldToEdit(page, { fieldLabel: 'Array', fieldID: 'array' })

    await wait(500)

    await addArrayRow(page, { fieldName: 'array' })

    const row = page.locator(`#array-row-0`)
    const toggler = row.locator('button.collapsible__toggle')

    await expect(toggler).toHaveClass(/collapsible__toggle--collapsed/)
    await expect(page.locator(`#field-array__0__optional`)).toBeHidden()

    await toggleBlockOrArrayRow({
      page,
      targetState: 'open',
      rowIndex: 0,
      fieldName: 'array',
    })

    await expect(field.locator('#field-array__0__optional')).toBeVisible()
    await expect(field.locator('#field-array__0__noRead')).toBeHidden()
    await expect(field.locator('#field-array__0__noUpdate')).toBeDisabled()
  })

  test('should toggle list selections off on successful publish', async () => {
    await deleteAllPosts()

    const postCount = 3
    Array.from({ length: postCount }).forEach(async (_, i) => {
      await createPost({ title: `Post ${i + 1}` }, { draft: true })
    })

    await page.goto(postsUrl.list)
    await page.locator('input#select-all').check()

    await page.locator('.list-selection__button[aria-label="Publish"]').click()
    await page.locator('#publish-posts #confirm-action').click()

    await expect(page.locator('.payload-toast-container .toast-success')).toContainText(
      `Updated ${postCount} Posts successfully.`,
    )

    await expect(page.locator('.table input#select-all[checked]')).toBeHidden()

    for (let i = 1; i < postCount + 1; i++) {
      await expect(
        page.locator(`table tbody tr .row-${i} input[type="checkbox"][checked]`),
      ).toBeHidden()
    }
  })

  test('should toggle list selections off on successful unpublish', async () => {
    await deleteAllPosts()

    const postCount = 3
    Array.from({ length: postCount }).forEach(async (_, i) => {
      await createPost({ title: `Post ${i + 1}`, _status: 'published' })
    })

    await page.goto(postsUrl.list)
    await page.locator('input#select-all').check()

    await page.locator('.list-selection__button[aria-label="Unpublish"]').click()
    await page.locator('#unpublish-posts #confirm-action').click()

    await expect(page.locator('.payload-toast-container .toast-success')).toContainText(
      `Updated ${postCount} Posts successfully.`,
    )

    await expect(page.locator('.table input#select-all[checked]')).toBeHidden()

    for (let i = 1; i < postCount + 1; i++) {
      await expect(
        page.locator(`table tbody tr .row-${i} input[type="checkbox"][checked]`),
      ).toBeHidden()
    }
  })

  test('should toggle list selections off on successful edit', async () => {
    await deleteAllPosts()
    const bulkEditValue = 'test'

    const postCount = 3
    Array.from({ length: postCount }).forEach(async (_, i) => {
      await createPost({ title: `Post ${i + 1}` })
    })

    await page.goto(postsUrl.list)
    await page.locator('input#select-all').check()

    await page.locator('.list-selection__button[aria-label="Edit"]').click()

    const editDrawer = page.locator('dialog#edit-posts')
    await expect(editDrawer).toBeVisible()

    const fieldSelect = editDrawer.locator('.field-select')
    await expect(fieldSelect).toBeVisible()

    const fieldSelectControl = fieldSelect.locator('.rs__control')
    await expect(fieldSelectControl).toBeVisible()
    await fieldSelectControl.click()

    const titleOption = fieldSelect.locator('.rs__option:has-text("Title")').first()
    await titleOption.click()

    await editDrawer.locator('input#field-title').fill(bulkEditValue)

    await editDrawer.locator('button[type="submit"]:has-text("Publish changes")').click()

    await expect(page.locator('.payload-toast-container .toast-success')).toContainText(
      `Updated ${postCount} Posts successfully.`,
    )

    await expect(page.locator('.table input#select-all[checked]')).toBeHidden()

    for (let i = 1; i < postCount + 1; i++) {
      await expect(
        page.locator(`table tbody tr .row-${i} input[type="checkbox"][checked]`),
      ).toBeHidden()
    }
  })

  test('should not delete nested un-named tab array data', async () => {
    const originalDoc = await payload.create({
      collection: tabsSlug,
      data: {
        title: 'Tab Title',
        tabTab: {
          tabTabArray: [
            {
              tabTabArrayText: 'nestedText',
            },
          ],
        },
      },
    })

    await page.goto(tabsUrl.list)
    await addListFilter({
      page,
      fieldLabel: 'ID',
      operatorLabel: 'equals',
      value: originalDoc.id,
    })

    // select first item
    await page.locator('table tbody tr.row-1 input[type="checkbox"]').check()
    // open bulk edit drawer
    await page
      .locator('.list-selection__actions .btn', {
        hasText: 'Edit',
      })
      .click()

    const bulkEditForm = page.locator('form.edit-many__form')
    await expect(bulkEditForm).toBeVisible()

    await selectInput({
      selectLocator: bulkEditForm.locator('.react-select'),
      options: ['Title'],
      multiSelect: true,
    })

    await bulkEditForm.locator('#field-title').fill('Updated Tab Title')
    await bulkEditForm.locator('button[type="submit"]').click()

    await expect(bulkEditForm).toBeHidden()

    const updatedDocQuery = await payload.find({
      collection: tabsSlug,
      where: {
        id: {
          equals: originalDoc.id,
        },
      },
    })
    const updatedDoc = updatedDocQuery.docs[0]
    await expect.poll(() => updatedDoc?.title).toEqual('Updated Tab Title')
    await expect.poll(() => updatedDoc?.tabTab?.tabTabArray?.length).toBe(1)

    await expect
      .poll(() => updatedDoc?.tabTab?.tabTabArray?.[0]?.tabTabArrayText)
      .toEqual('nestedText')
  })
})

async function selectFieldToEdit(
  page: Page,
  {
    fieldLabel,
    fieldID,
  }: {
    fieldID: string
    fieldLabel: string
  },
): Promise<{ field: Locator; modal: Locator }> {
  // ensure modal is open, open if needed
  const isModalOpen = await page.locator('#edit-posts').isVisible()

  if (!isModalOpen) {
    await page.locator('.edit-many__toggle').click()
  }

  const modal = page.locator('#edit-posts')
  await expect(modal).toBeVisible()

  await modal.locator('.field-select .rs__control').click()
  await modal.locator('.field-select .rs__option', { hasText: exactText(fieldLabel) }).click()

  const field = modal.locator(`#field-${fieldID}`)
  await expect(field).toBeVisible()

  return { modal, field }
}

async function selectAllAndEditMany(page: Page): Promise<{ modal: Locator }> {
  await page.locator('input#select-all').check()
  await page.locator('.edit-many__toggle').click()
  const modal = page.locator('#edit-posts')
  await expect(modal).toBeVisible()
  return { modal }
}

async function deleteAllPosts() {
  await payload.delete({ collection: postsSlug, where: { id: { exists: true } } })
}

async function createPost(
  dataOverrides?: Partial<Post>,
  overrides?: Record<string, unknown>,
): Promise<Post> {
  return payload.create({
    collection: postsSlug,
    ...(overrides || {}),
    data: {
      title: 'Post Title',
      ...(dataOverrides || {}),
    },
  }) as unknown as Promise<Post>
}
```

--------------------------------------------------------------------------------

---[FILE: payload-types.ts]---
Location: payload-main/test/bulk-edit/payload-types.ts

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
    tabs: Tab;
    users: User;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  collectionsJoins: {};
  collectionsSelect: {
    posts: PostsSelect<false> | PostsSelect<true>;
    tabs: TabsSelect<false> | TabsSelect<true>;
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
  description?: string | null;
  defaultValueField?: string | null;
  group?: {
    defaultValueField?: string | null;
    title?: string | null;
  };
  array?:
    | {
        optional?: string | null;
        innerArrayOfFields?:
          | {
              innerOptional?: string | null;
              id?: string | null;
            }[]
          | null;
        noRead?: string | null;
        noUpdate?: string | null;
        id?: string | null;
      }[]
    | null;
  blocks?:
    | {
        textFieldForBlock?: string | null;
        id?: string | null;
        blockName?: string | null;
        blockType: 'textBlock';
      }[]
    | null;
  noRead?: string | null;
  noUpdate?: string | null;
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "tabs".
 */
export interface Tab {
  id: string;
  title?: string | null;
  tabTab?: {
    tabTabArray?:
      | {
          tabTabArrayText?: string | null;
          id?: string | null;
        }[]
      | null;
  };
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
        relationTo: 'posts';
        value: string | Post;
      } | null)
    | ({
        relationTo: 'tabs';
        value: string | Tab;
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
  description?: T;
  defaultValueField?: T;
  group?:
    | T
    | {
        defaultValueField?: T;
        title?: T;
      };
  array?:
    | T
    | {
        optional?: T;
        innerArrayOfFields?:
          | T
          | {
              innerOptional?: T;
              id?: T;
            };
        noRead?: T;
        noUpdate?: T;
        id?: T;
      };
  blocks?:
    | T
    | {
        textBlock?:
          | T
          | {
              textFieldForBlock?: T;
              id?: T;
              blockName?: T;
            };
      };
  noRead?: T;
  noUpdate?: T;
  updatedAt?: T;
  createdAt?: T;
  _status?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "tabs_select".
 */
export interface TabsSelect<T extends boolean = true> {
  title?: T;
  tabTab?:
    | T
    | {
        tabTabArray?:
          | T
          | {
              tabTabArrayText?: T;
              id?: T;
            };
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

````
