---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 565
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 565 of 695)

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
Location: payload-main/test/fields/collections/Upload/e2e.spec.ts

```typescript
import type { Page } from '@playwright/test'

import { expect, test } from '@playwright/test'
import { checkFocusIndicators } from 'helpers/e2e/checkFocusIndicators.js'
import { runAxeScan } from 'helpers/e2e/runAxeScan.js'
import { openDocDrawer } from 'helpers/e2e/toggleDocDrawer.js'
import path from 'path'
import { wait } from 'payload/shared'
import { fileURLToPath } from 'url'

import type { PayloadTestSDK } from '../../../helpers/sdk/index.js'
import type { Config } from '../../payload-types.js'

import {
  ensureCompilationIsDone,
  initPageConsoleErrorCatch,
  saveDocAndAssert,
} from '../../../helpers.js'
import { AdminUrlUtil } from '../../../helpers/adminUrlUtil.js'
import { initPayloadE2ENoConfig } from '../../../helpers/initPayloadE2ENoConfig.js'
import { reInitializeDB } from '../../../helpers/reInitializeDB.js'
import { POLL_TOPASS_TIMEOUT, TEST_TIMEOUT_LONG } from '../../../playwright.config.js'
import { uploadsSlug } from '../../slugs.js'

const filename = fileURLToPath(import.meta.url)
const currentFolder = path.dirname(filename)
const dirname = path.resolve(currentFolder, '../../')

const { beforeAll, beforeEach, describe } = test

let payload: PayloadTestSDK<Config>
let page: Page
let serverURL: string
// If we want to make this run in parallel: test.describe.configure({ mode: 'parallel' })
let url: AdminUrlUtil

describe('Upload', () => {
  beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)
    process.env.SEED_IN_CONFIG_ONINIT = 'false' // Makes it so the payload config onInit seed is not run. Otherwise, the seed would be run unnecessarily twice for the initial test run - once for beforeEach and once for onInit
    ;({ payload, serverURL } = await initPayloadE2ENoConfig<Config>({
      dirname,
      // prebuild,
    }))
    url = new AdminUrlUtil(serverURL, uploadsSlug)

    const context = await browser.newContext()
    page = await context.newPage()
    initPageConsoleErrorCatch(page)

    await ensureCompilationIsDone({ page, serverURL })
  })
  beforeEach(async () => {
    await reInitializeDB({
      serverURL,
      snapshotKey: 'fieldsTest',
      uploadsDir: path.resolve(dirname, './collections/Upload/uploads'),
    })

    await ensureCompilationIsDone({ page, serverURL })
  })

  async function uploadImage() {
    await page.goto(url.create)

    // create a jpg upload
    await page
      .locator('.file-field__upload input[type="file"]')
      .setInputFiles(path.resolve(dirname, './collections/Upload/payload.jpg'))
    await expect(page.locator('.file-field .file-field__filename')).toHaveValue('payload.jpg')
    await saveDocAndAssert(page)
  }

  test('should upload files', async () => {
    await uploadImage()
  })

  test('should upload files from remote URL', async () => {
    await page.goto(url.create)

    const pasteURLButton = page.locator('.file-field__upload button', {
      hasText: 'Paste URL',
    })
    await pasteURLButton.click()

    const remoteImage =
      'https://raw.githubusercontent.com/payloadcms/website/refs/heads/main/public/images/og-image.jpg'

    const inputField = page.locator('.file-field__upload .file-field__remote-file')
    await inputField.fill(remoteImage)

    const addFileButton = page.locator('.file-field__add-file')
    await addFileButton.click()

    await expect(page.locator('.file-field .file-field__filename')).toHaveValue('og-image.jpg')

    await saveDocAndAssert(page)

    await expect(page.locator('.file-field .file-details img')).toHaveAttribute(
      'src',
      /\/api\/uploads\/file\/og-image\.jpg(\?.*)?$/,
    )
  })

  test('should disable save button during upload progress from remote URL', async () => {
    await page.goto(url.create)

    const pasteURLButton = page.locator('.file-field__upload button', {
      hasText: 'Paste URL',
    })
    await pasteURLButton.click()

    const remoteImage =
      'https://raw.githubusercontent.com/payloadcms/website/refs/heads/main/public/images/og-image.jpg'

    const inputField = page.locator('.file-field__upload .file-field__remote-file')
    await inputField.fill(remoteImage)

    // Intercept the upload request
    await page.route(
      'https://raw.githubusercontent.com/payloadcms/website/refs/heads/main/public/images/og-image.jpg',
      (route) => setTimeout(() => route.continue(), 2000), // Artificial 2-second delay
    )

    const addFileButton = page.locator('.file-field__add-file')
    await addFileButton.click()

    const submitButton = page.locator('.form-submit .btn')
    await expect(submitButton).toBeDisabled()

    // Wait for the upload to complete
    await page.waitForResponse(
      'https://raw.githubusercontent.com/payloadcms/website/refs/heads/main/public/images/og-image.jpg',
    )

    // Assert the submit button is re-enabled after upload
    await expect(submitButton).toBeEnabled()
  })

  // test that the image renders
  test('should render uploaded image', async () => {
    await uploadImage()
    await expect(page.locator('.file-field .file-details img')).toHaveAttribute(
      'src',
      /\/api\/uploads\/file\/payload-1\.jpg(\?.*)?$/,
    )
  })

  test('should upload using the document drawer', async () => {
    await uploadImage()
    await wait(1000)
    // Open the media drawer and create a png upload

    await openDocDrawer({ page, selector: '#field-media .upload__createNewToggler' })

    await page
      .locator('[id^=doc-drawer_uploads_1_] .file-field__upload input[type="file"]')
      .setInputFiles(path.resolve(dirname, './uploads/payload.png'))

    await expect(
      page.locator('[id^=doc-drawer_uploads_1_] .file-field__upload .file-field__filename'),
    ).toHaveValue('payload.png')

    await page.locator('[id^=doc-drawer_uploads_1_] #action-save').click()
    await expect(page.locator('.payload-toast-container')).toContainText('successfully')

    // Assert that the media field has the png upload
    await expect(
      page.locator('.field-type.upload .upload-relationship-details__filename a'),
    ).toHaveAttribute('href', '/api/uploads/file/payload-1.png')

    await expect(
      page.locator('.field-type.upload .upload-relationship-details__filename a'),
    ).toContainText('payload-1.png')

    await expect(
      page.locator('.field-type.upload .upload-relationship-details img'),
    ).toHaveAttribute('src', '/api/uploads/file/payload-1.png')
    await saveDocAndAssert(page)
  })

  test('should upload after editing image inside a document drawer', async () => {
    await uploadImage()
    await wait(1000)
    // Open the media drawer and create a png upload

    await openDocDrawer({ page, selector: '#field-media .upload__createNewToggler' })

    await page
      .locator('[id^=doc-drawer_uploads_1_] .file-field__upload input[type="file"]')
      .setInputFiles(path.resolve(dirname, './uploads/payload.png'))
    await expect(
      page.locator('[id^=doc-drawer_uploads_1_] .file-field__upload .file-field__filename'),
    ).toHaveValue('payload.png')
    await page.locator('[id^=doc-drawer_uploads_1_] .file-field__edit').click()
    await page
      .locator('[id^=edit-upload] .edit-upload__input input[name="Width (px)"]')
      .nth(1)
      .fill('200')
    await page
      .locator('[id^=edit-upload] .edit-upload__input input[name="Height (px)"]')
      .nth(1)
      .fill('200')
    await page.locator('[id^=edit-upload] button:has-text("Apply Changes")').nth(1).click()
    await page.locator('[id^=doc-drawer_uploads_1_] #action-save').click()
    await expect(page.locator('.payload-toast-container')).toContainText('successfully')

    // Assert that the media field has the png upload
    await expect(
      page.locator('.field-type.upload .upload-relationship-details__filename a'),
    ).toHaveAttribute('href', '/api/uploads/file/payload-1.png')
    await expect(
      page.locator('.field-type.upload .upload-relationship-details__filename a'),
    ).toContainText('payload-1.png')
    await expect(
      page.locator('.field-type.upload .upload-relationship-details img'),
    ).toHaveAttribute('src', '/api/uploads/file/payload-1.png')
    await saveDocAndAssert(page)
  })

  test('should clear selected upload', async () => {
    await uploadImage()
    await wait(1000) // TODO: Fix this. Need to wait a bit until the form in the drawer mounted, otherwise values sometimes disappear. This is an issue for all drawers

    await openDocDrawer({ page, selector: '#field-media .upload__createNewToggler' })

    await wait(1000)

    await page
      .locator('[id^=doc-drawer_uploads_1_] .file-field__upload input[type="file"]')
      .setInputFiles(path.resolve(dirname, './uploads/payload.png'))
    await expect(
      page.locator('[id^=doc-drawer_uploads_1_] .file-field__upload .file-field__filename'),
    ).toHaveValue('payload.png')
    await page.locator('[id^=doc-drawer_uploads_1_] #action-save').click()
    await expect(page.locator('.payload-toast-container')).toContainText('successfully')
    await page.locator('.field-type.upload .upload-relationship-details__remove').click()
  })

  test('should select using the list drawer and restrict mimetype based on filterOptions', async () => {
    await uploadImage()

    await openDocDrawer({ page, selector: '.field-type.upload .upload__listToggler' })

    const jpgImages = page.locator('[id^=list-drawer_1_] .upload-gallery img[src$=".jpg"]')
    await expect
      .poll(async () => await jpgImages.count(), { timeout: POLL_TOPASS_TIMEOUT })
      .toEqual(0)
  })

  test.skip('should show drawer for input field when enableRichText is false', async () => {
    const uploads3URL = new AdminUrlUtil(serverURL, 'uploads3')
    await page.goto(uploads3URL.create)

    // create file in uploads 3 collection
    await page
      .locator('.file-field__upload input[type="file"]')
      .setInputFiles(path.resolve(dirname, './collections/Upload/payload.jpg'))
    await expect(page.locator('.file-field .file-field__filename')).toContainText('payload.jpg')
    await page.locator('#action-save').click()

    await wait(200)

    // open drawer
    await openDocDrawer({ page, selector: '.field-type.upload .list-drawer__toggler' })
    // check title
    await expect(page.locator('.list-drawer__header-text')).toContainText('Uploads 3')
  })

  describe('A11y', () => {
    test.fixme('Create view should have no accessibility violations', async ({}, testInfo) => {
      await page.goto(url.create)
      await page.locator('#field-text').waitFor()

      const scanResults = await runAxeScan({
        page,
        testInfo,
        include: ['.collection-edit__main'],
        exclude: ['.field-description'], // known issue - reported elsewhere @todo: remove this once fixed - see report https://github.com/payloadcms/payload/discussions/14489
      })

      expect(scanResults.violations.length).toBe(0)
    })

    test.fixme('Edit view should have no accessibility violations', async ({}, testInfo) => {
      await page.goto(url.list)
      const firstItem = page.locator('.cell-filename a').nth(0)
      await firstItem.click()

      await page.locator('#field-text').waitFor()

      const scanResults = await runAxeScan({
        page,
        testInfo,
        include: ['.collection-edit__main'],
        exclude: ['.field-description'], // known issue - reported elsewhere @todo: remove this once fixed - see report https://github.com/payloadcms/payload/discussions/14489
      })

      expect(scanResults.violations.length).toBe(0)
    })

    test('Upload fields have focus indicators', async ({}, testInfo) => {
      await page.goto(url.create)
      await page.locator('#field-text').waitFor()

      const scanResults = await checkFocusIndicators({
        page,
        testInfo,
        selector: '.collection-edit__main',
      })

      expect(scanResults.totalFocusableElements).toBeGreaterThan(0)
      expect(scanResults.elementsWithoutIndicators).toBe(0)
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/fields/collections/Upload/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

import { uploadsSlug } from '../../slugs.js'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const Uploads: CollectionConfig = {
  slug: uploadsSlug,
  fields: [
    {
      name: 'text',
      type: 'text',
    },
    {
      name: 'media',
      type: 'upload',
      filterOptions: {
        mimeType: {
          equals: 'image/png',
        },
      },
      relationTo: uploadsSlug,
    },
    // {
    //   name: 'richText',
    //   type: 'richText',
    // },
  ],
  upload: {
    staticDir: path.resolve(dirname, './uploads'),
  },
}

export default Uploads
```

--------------------------------------------------------------------------------

---[FILE: shared.ts]---
Location: payload-main/test/fields/collections/Upload/shared.ts

```typescript
import type { Upload } from '../../payload-types.js'

export const uploadsDoc: Partial<Upload> = {
  text: 'An upload here',
}
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/test/fields/collections/Upload2/.gitignore

```text
uploads2
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/fields/collections/Upload2/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

import { uploads2Slug } from '../../slugs.js'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const Uploads2: CollectionConfig = {
  slug: uploads2Slug,
  upload: {
    staticDir: path.resolve(dirname, './uploads2'),
  },
  labels: {
    singular: 'Upload 2',
    plural: 'Uploads 2',
  },
  fields: [
    {
      type: 'text',
      name: 'text',
    },
    {
      type: 'upload',
      name: 'media',
      relationTo: uploads2Slug,
    },
  ],
}

export default Uploads2
```

--------------------------------------------------------------------------------

---[FILE: shared.ts]---
Location: payload-main/test/fields/collections/Upload2/shared.ts

```typescript
import type { Uploads2 } from '../../payload-types.js'

export const uploadsDoc: Partial<Uploads2> = {
  text: 'An upload here',
}
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/test/fields/collections/UploadMulti/.gitignore

```text
uploads
```

--------------------------------------------------------------------------------

---[FILE: e2e.spec.ts]---
Location: payload-main/test/fields/collections/UploadMulti/e2e.spec.ts

```typescript
import type { Page } from '@playwright/test'

import { expect, test } from '@playwright/test'
import { openDocDrawer } from 'helpers/e2e/toggleDocDrawer.js'
import path from 'path'
import { wait } from 'payload/shared'
import { fileURLToPath } from 'url'

import type { PayloadTestSDK } from '../../../helpers/sdk/index.js'
import type { Config } from '../../payload-types.js'

import {
  ensureCompilationIsDone,
  exactText,
  initPageConsoleErrorCatch,
  saveDocAndAssert,
} from '../../../helpers.js'
import { AdminUrlUtil } from '../../../helpers/adminUrlUtil.js'
import { initPayloadE2ENoConfig } from '../../../helpers/initPayloadE2ENoConfig.js'
import { reInitializeDB } from '../../../helpers/reInitializeDB.js'
import { POLL_TOPASS_TIMEOUT, TEST_TIMEOUT_LONG } from '../../../playwright.config.js'
import { uploadsMulti } from '../../slugs.js'

const filename = fileURLToPath(import.meta.url)
const currentFolder = path.dirname(filename)
const dirname = path.resolve(currentFolder, '../../')

const { beforeAll, beforeEach, describe } = test

let payload: PayloadTestSDK<Config>
let page: Page
let serverURL: string
// If we want to make this run in parallel: test.describe.configure({ mode: 'parallel' })
let url: AdminUrlUtil

describe('Upload with hasMany', () => {
  beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)
    process.env.SEED_IN_CONFIG_ONINIT = 'false' // Makes it so the payload config onInit seed is not run. Otherwise, the seed would be run unnecessarily twice for the initial test run - once for beforeEach and once for onInit
    ;({ payload, serverURL } = await initPayloadE2ENoConfig<Config>({
      dirname,
      // prebuild,
    }))
    url = new AdminUrlUtil(serverURL, uploadsMulti)

    const context = await browser.newContext()
    page = await context.newPage()
    initPageConsoleErrorCatch(page)

    await ensureCompilationIsDone({ page, serverURL })
  })
  beforeEach(async () => {
    await reInitializeDB({
      serverURL,
      snapshotKey: 'fieldsTest',
      uploadsDir: path.resolve(dirname, './collections/Upload/uploads'),
    })

    await ensureCompilationIsDone({ page, serverURL })
  })

  test('should upload in new doc', async () => {
    await page.goto(url.create)

    const multiButton = page.locator('#field-media button', {
      hasText: exactText('Create New'),
    })
    await multiButton.click()

    const uploadModal = page.locator('#media-bulk-upload-drawer-slug-1')
    await expect(uploadModal).toBeVisible()

    await uploadModal
      .locator('.dropzone input[type="file"]')
      .setInputFiles(path.resolve(dirname, './collections/Upload/payload.jpg'))

    const saveButton = uploadModal.locator('.bulk-upload--actions-bar__saveButtons button')
    await saveButton.click()

    const firstFileInList = page.locator('.upload-field-card').first()
    await expect(firstFileInList.locator('.upload-relationship-details__filename')).toBeVisible()

    await multiButton.click()
    await expect(uploadModal).toBeVisible()
    await page.setInputFiles(
      'input[type="file"]',
      path.resolve(dirname, './collections/Upload/payload.jpg'),
    )
    await saveButton.click()

    await saveDocAndAssert(page)
  })

  test('can insert new media with existing values', async () => {
    await page.goto(url.list)

    const firstItem = page.locator('.cell-id').first().locator('a')

    await firstItem.click()

    const multiButton = page.locator('#field-media button', {
      hasText: exactText('Create New'),
    })

    await multiButton.click()

    const uploadModal = page.locator('#media-bulk-upload-drawer-slug-1')
    await expect(uploadModal).toBeVisible()

    await uploadModal
      .locator('.dropzone input[type="file"]')
      .setInputFiles(path.resolve(dirname, './collections/Upload/payload.jpg'))

    const saveButton = uploadModal.locator('.bulk-upload--actions-bar__saveButtons button')
    await saveButton.click()

    const firstFileInList = page.locator('.upload-field-card').first()
    await expect(firstFileInList.locator('.upload-relationship-details__filename')).toBeVisible()

    await page
      .locator('#field-media button', {
        hasText: exactText('Create New'),
      })
      .first()
      .click()
    await expect(uploadModal).toBeVisible()
    await page.setInputFiles(
      'input[type="file"]',
      path.resolve(dirname, './collections/Upload/payload.jpg'),
    )
    await saveButton.click()

    await saveDocAndAssert(page)
  })
})
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/fields/collections/UploadMulti/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { uploads2Slug, uploadsMulti, uploadsSlug } from '../../slugs.js'

const Uploads: CollectionConfig = {
  slug: uploadsMulti,
  fields: [
    {
      name: 'text',
      type: 'text',
    },
    {
      name: 'media',
      type: 'upload',
      hasMany: true,
      relationTo: uploadsSlug,
    },
  ],
}

export default Uploads
```

--------------------------------------------------------------------------------

---[FILE: shared.ts]---
Location: payload-main/test/fields/collections/UploadMulti/shared.ts

```typescript
import type { Upload } from '../../payload-types.js'

export const uploadsDoc: Partial<Upload> = {
  text: 'An upload here',
}
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/test/fields/collections/UploadMultiPoly/.gitignore

```text
uploads
```

--------------------------------------------------------------------------------

---[FILE: e2e.spec.ts]---
Location: payload-main/test/fields/collections/UploadMultiPoly/e2e.spec.ts

```typescript
import type { Page } from '@playwright/test'

import { expect, test } from '@playwright/test'
import { openDocDrawer } from 'helpers/e2e/toggleDocDrawer.js'
import path from 'path'
import { wait } from 'payload/shared'
import { fileURLToPath } from 'url'

import type { PayloadTestSDK } from '../../../helpers/sdk/index.js'
import type { Config } from '../../payload-types.js'

import {
  ensureCompilationIsDone,
  exactText,
  initPageConsoleErrorCatch,
  saveDocAndAssert,
} from '../../../helpers.js'
import { AdminUrlUtil } from '../../../helpers/adminUrlUtil.js'
import { initPayloadE2ENoConfig } from '../../../helpers/initPayloadE2ENoConfig.js'
import { reInitializeDB } from '../../../helpers/reInitializeDB.js'
import { POLL_TOPASS_TIMEOUT, TEST_TIMEOUT_LONG } from '../../../playwright.config.js'
import { uploadsMultiPoly } from '../../slugs.js'

const filename = fileURLToPath(import.meta.url)
const currentFolder = path.dirname(filename)
const dirname = path.resolve(currentFolder, '../../')

const { beforeAll, beforeEach, describe } = test

let payload: PayloadTestSDK<Config>
let page: Page
let serverURL: string
// If we want to make this run in parallel: test.describe.configure({ mode: 'parallel' })
let url: AdminUrlUtil

describe('Upload polymorphic with hasMany', () => {
  beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)
    process.env.SEED_IN_CONFIG_ONINIT = 'false' // Makes it so the payload config onInit seed is not run. Otherwise, the seed would be run unnecessarily twice for the initial test run - once for beforeEach and once for onInit
    ;({ payload, serverURL } = await initPayloadE2ENoConfig<Config>({
      dirname,
      // prebuild,
    }))
    url = new AdminUrlUtil(serverURL, uploadsMultiPoly)

    const context = await browser.newContext()
    page = await context.newPage()
    initPageConsoleErrorCatch(page)

    await ensureCompilationIsDone({ page, serverURL })
  })
  beforeEach(async () => {
    await reInitializeDB({
      serverURL,
      snapshotKey: 'fieldsTest',
      uploadsDir: path.resolve(dirname, './collections/Upload/uploads'),
    })

    await ensureCompilationIsDone({ page, serverURL })
  })

  test('should upload in new doc', async () => {
    await page.goto(url.create)

    const multiPolyButton = page.locator('#field-media button', {
      hasText: exactText('Create New'),
    })
    await multiPolyButton.click()

    const uploadModal = page.locator('#media-bulk-upload-drawer-slug-1')
    await expect(uploadModal).toBeVisible()

    await uploadModal
      .locator('.dropzone input[type="file"]')
      .setInputFiles(path.resolve(dirname, './collections/Upload/payload.jpg'))

    const saveButton = uploadModal.locator('.bulk-upload--actions-bar__saveButtons button')
    await saveButton.click()

    const firstFileInList = page.locator('.upload-field-card').first()
    await expect(firstFileInList.locator('.pill')).toContainText('Upload')

    await multiPolyButton.click()
    await expect(uploadModal).toBeVisible()
    await page.setInputFiles(
      'input[type="file"]',
      path.resolve(dirname, './collections/Upload/payload.jpg'),
    )

    const collectionSelector = uploadModal.locator(
      '.file-selections__header .file-selections__collectionSelect',
    )

    await expect(collectionSelector).toBeVisible()
    const fieldSelector = collectionSelector.locator('.react-select')
    await fieldSelector.click({ delay: 100 })
    const options = uploadModal.locator('.rs__option')
    // Select an option
    await options.locator('text=Upload 2').click()

    await expect(uploadModal.locator('.bulk-upload--drawer-header')).toContainText('Upload 2')
    await saveButton.click()

    const svgItemInList = page.locator('.upload-field-card').nth(1)
    await expect(svgItemInList.locator('.pill')).toContainText('Upload 2')

    await saveDocAndAssert(page)
  })

  test('can insert new media with existing values', async () => {
    await page.goto(url.create)

    const multiPolyButton = page.locator('#field-media button', {
      hasText: exactText('Create New'),
    })
    await multiPolyButton.click()

    const uploadModal = page.locator('#media-bulk-upload-drawer-slug-1')
    await expect(uploadModal).toBeVisible()

    await uploadModal
      .locator('.dropzone input[type="file"]')
      .setInputFiles(path.resolve(dirname, './collections/Upload/payload.jpg'))

    const saveButton = uploadModal.locator('.bulk-upload--actions-bar__saveButtons button')
    await saveButton.click()

    const firstFileInList = page.locator('.upload-field-card').first()
    await expect(firstFileInList.locator('.pill')).toContainText('Upload')

    await multiPolyButton.click()
    await expect(uploadModal).toBeVisible()
    await page.setInputFiles(
      'input[type="file"]',
      path.resolve(dirname, './collections/Upload/payload.jpg'),
    )

    const collectionSelector = uploadModal.locator(
      '.file-selections__header .file-selections__collectionSelect',
    )

    await expect(collectionSelector).toBeVisible()
    const fieldSelector = collectionSelector.locator('.react-select')
    await fieldSelector.click({ delay: 100 })
    const options = uploadModal.locator('.rs__option')
    // Select an option
    await options.locator('text=Upload 2').click()

    await expect(uploadModal.locator('.bulk-upload--drawer-header')).toContainText('Upload 2')
    await saveButton.click()

    const svgItemInList = page.locator('.upload-field-card').nth(1)
    await expect(svgItemInList.locator('.pill')).toContainText('Upload 2')

    await saveDocAndAssert(page)

    const multiButton = page.locator('#field-media button', {
      hasText: exactText('Create New'),
    })

    await multiButton.click()

    await expect(uploadModal).toBeVisible()

    await uploadModal
      .locator('.dropzone input[type="file"]')
      .setInputFiles(path.resolve(dirname, './collections/Upload/payload.jpg'))

    await saveButton.click()

    await expect(firstFileInList.locator('.upload-relationship-details__filename')).toBeVisible()

    await page
      .locator('#field-media button', {
        hasText: exactText('Create New'),
      })
      .first()
      .click()
    await expect(uploadModal).toBeVisible()
    await page.setInputFiles(
      'input[type="file"]',
      path.resolve(dirname, './collections/Upload/payload.jpg'),
    )
    await saveButton.click()

    await saveDocAndAssert(page)
  })
})
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/fields/collections/UploadMultiPoly/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { uploads2Slug, uploadsMultiPoly, uploadsSlug } from '../../slugs.js'

const Uploads: CollectionConfig = {
  slug: uploadsMultiPoly,
  fields: [
    {
      name: 'text',
      type: 'text',
    },
    {
      name: 'media',
      type: 'upload',
      hasMany: true,
      relationTo: [uploadsSlug, uploads2Slug],
    },
  ],
}

export default Uploads
```

--------------------------------------------------------------------------------

---[FILE: shared.ts]---
Location: payload-main/test/fields/collections/UploadMultiPoly/shared.ts

```typescript
import type { Upload } from '../../payload-types.js'

export const uploadsDoc: Partial<Upload> = {
  text: 'An upload here',
}
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/test/fields/collections/UploadPoly/.gitignore

```text
uploads
```

--------------------------------------------------------------------------------

---[FILE: e2e.spec.ts]---
Location: payload-main/test/fields/collections/UploadPoly/e2e.spec.ts

```typescript
import type { Page } from '@playwright/test'

import { expect, test } from '@playwright/test'
import { openDocDrawer } from 'helpers/e2e/toggleDocDrawer.js'
import path from 'path'
import { wait } from 'payload/shared'
import { fileURLToPath } from 'url'

import type { PayloadTestSDK } from '../../../helpers/sdk/index.js'
import type { Config } from '../../payload-types.js'

import {
  ensureCompilationIsDone,
  exactText,
  initPageConsoleErrorCatch,
  saveDocAndAssert,
} from '../../../helpers.js'
import { AdminUrlUtil } from '../../../helpers/adminUrlUtil.js'
import { initPayloadE2ENoConfig } from '../../../helpers/initPayloadE2ENoConfig.js'
import { reInitializeDB } from '../../../helpers/reInitializeDB.js'
import { POLL_TOPASS_TIMEOUT, TEST_TIMEOUT_LONG } from '../../../playwright.config.js'
import { uploadsPoly } from '../../slugs.js'

const filename = fileURLToPath(import.meta.url)
const currentFolder = path.dirname(filename)
const dirname = path.resolve(currentFolder, '../../')

const { beforeAll, beforeEach, describe } = test

let payload: PayloadTestSDK<Config>
let page: Page
let serverURL: string
// If we want to make this run in parallel: test.describe.configure({ mode: 'parallel' })
let url: AdminUrlUtil

describe('Upload polymorphic', () => {
  beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)
    process.env.SEED_IN_CONFIG_ONINIT = 'false' // Makes it so the payload config onInit seed is not run. Otherwise, the seed would be run unnecessarily twice for the initial test run - once for beforeEach and once for onInit
    ;({ payload, serverURL } = await initPayloadE2ENoConfig<Config>({
      dirname,
      // prebuild,
    }))
    url = new AdminUrlUtil(serverURL, uploadsPoly)

    const context = await browser.newContext()
    page = await context.newPage()
    initPageConsoleErrorCatch(page)

    await ensureCompilationIsDone({ page, serverURL })
  })
  beforeEach(async () => {
    await reInitializeDB({
      serverURL,
      snapshotKey: 'fieldsTest',
      uploadsDir: path.resolve(dirname, './collections/Upload/uploads'),
    })

    await ensureCompilationIsDone({ page, serverURL })
  })

  test('should upload in single polymorphic field', async () => {
    await page.goto(url.create)

    const singlePolyButton = page.locator('#field-media button', {
      hasText: exactText('Create New'),
    })
    await singlePolyButton.click()

    const uploadModal = page.locator('.payload__modal-item.drawer--is-open')
    await expect(uploadModal).toBeVisible()

    await uploadModal
      .locator('.dropzone input[type="file"]')
      .setInputFiles(path.resolve(dirname, './collections/Upload/payload.jpg'))

    const saveButton = uploadModal.locator('#action-save')
    await saveButton.click()

    const mediaPill = page.locator('#field-media .pill')
    await expect(mediaPill).toBeVisible()
    await expect(mediaPill).toContainText('Upload')

    await saveDocAndAssert(page)
  })
})
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/fields/collections/UploadPoly/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { uploads2Slug, uploadsPoly, uploadsSlug } from '../../slugs.js'

const Uploads: CollectionConfig = {
  slug: uploadsPoly,
  fields: [
    {
      name: 'text',
      type: 'text',
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: [uploadsSlug, uploads2Slug],
    },
  ],
}

export default Uploads
```

--------------------------------------------------------------------------------

---[FILE: shared.ts]---
Location: payload-main/test/fields/collections/UploadPoly/shared.ts

```typescript
import type { Upload } from '../../payload-types.js'

export const uploadsDoc: Partial<Upload> = {
  text: 'An upload here',
}
```

--------------------------------------------------------------------------------

---[FILE: e2e.spec.ts]---
Location: payload-main/test/fields/collections/UploadRestricted/e2e.spec.ts

```typescript
import type { Page } from '@playwright/test'
import type { PayloadTestSDK } from 'helpers/sdk/index.js'

import { expect, test } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

import type { Config } from '../../payload-types.js'

import { ensureCompilationIsDone, initPageConsoleErrorCatch } from '../../../helpers.js'
import { AdminUrlUtil } from '../../../helpers/adminUrlUtil.js'
import { initPayloadE2ENoConfig } from '../../../helpers/initPayloadE2ENoConfig.js'
import { reInitializeDB } from '../../../helpers/reInitializeDB.js'
import { RESTClient } from '../../../helpers/rest.js'
import { TEST_TIMEOUT_LONG } from '../../../playwright.config.js'
import { uploadsRestricted } from '../../slugs.js'

const filename = fileURLToPath(import.meta.url)
const currentFolder = path.dirname(filename)
const dirname = path.resolve(currentFolder, '../../')

const { beforeAll, beforeEach, describe } = test

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let payload: PayloadTestSDK<Config>
let client: RESTClient
let page: Page
let serverURL: string
// If we want to make this run in parallel: test.describe.configure({ mode: 'parallel' })
let url: AdminUrlUtil

describe('Upload with restrictions', () => {
  beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)
    process.env.SEED_IN_CONFIG_ONINIT = 'false' // Makes it so the payload config onInit seed is not run. Otherwise, the seed would be run unnecessarily twice for the initial test run - once for beforeEach and once for onInit
    ;({ payload, serverURL } = await initPayloadE2ENoConfig<Config>({
      dirname,
      // prebuild,
    }))
    url = new AdminUrlUtil(serverURL, uploadsRestricted)

    const context = await browser.newContext()
    page = await context.newPage()
    initPageConsoleErrorCatch(page)

    await ensureCompilationIsDone({ page, serverURL })
  })
  beforeEach(async () => {
    await reInitializeDB({
      serverURL,
      snapshotKey: 'fieldsTest',
      uploadsDir: path.resolve(dirname, './collections/Upload/uploads'),
    })

    if (client) {
      await client.logout()
    }
    client = new RESTClient({ defaultSlug: 'users', serverURL })
    await client.login()

    await ensureCompilationIsDone({ page, serverURL })
  })

  test('allowCreate = false should hide create new button and drag and drop text', async () => {
    await page.goto(url.create)
    const fieldWithoutRestriction = page.locator('#field-uploadWithoutRestriction')
    await expect(fieldWithoutRestriction).toBeVisible()
    await expect(fieldWithoutRestriction.getByRole('button', { name: 'Create New' })).toBeVisible()
    await expect(fieldWithoutRestriction.getByText('or drag and drop a file')).toBeVisible()
    const fieldWithAllowCreateFalse = page.locator('#field-uploadWithAllowCreateFalse')
    await expect(fieldWithAllowCreateFalse).toBeVisible()
    await expect(fieldWithAllowCreateFalse.getByRole('button', { name: 'Create New' })).toBeHidden()
    // We could also test that the D&D functionality is disabled. But I think seeing the label
    // disappear is enough. Maybe if there is some regression...
    await expect(fieldWithAllowCreateFalse.getByText('or drag and drop a file')).toBeHidden()
    const fieldMultipleWithAllow = page.locator('#field-uploadMultipleWithAllowCreateFalse')
    await expect(fieldMultipleWithAllow).toBeVisible()
    await expect(fieldMultipleWithAllow.getByRole('button', { name: 'Create New' })).toBeHidden()
    await expect(fieldMultipleWithAllow.getByText('or drag and drop a file')).toBeHidden()
  })

  test('allowCreate = false should hide create new button in the list drawer', async () => {
    await page.goto(url.create)
    const fieldWithoutRestriction = page.locator('#field-uploadWithoutRestriction')
    await expect(fieldWithoutRestriction).toBeVisible()
    await fieldWithoutRestriction.getByRole('button', { name: 'Choose from existing' }).click()
    const drawer = page.locator('.drawer__content')
    await expect(drawer).toBeVisible()
    const createNewHeader = page
      .locator('.list-drawer__header')
      .locator('button', { hasText: 'Create New' })
    await expect(createNewHeader).toBeVisible()
    await page.locator('.list-drawer__header .close-modal-button').click()
    await expect(drawer).toBeHidden()
    const fieldWithAllowCreateFalse = page.locator('#field-uploadWithAllowCreateFalse')
    await expect(fieldWithAllowCreateFalse).toBeVisible()
    await fieldWithAllowCreateFalse.getByRole('button', { name: 'Choose from existing' }).click()
    await expect(drawer).toBeVisible()
    await expect(createNewHeader).toBeHidden()
  })
})
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/fields/collections/UploadRestricted/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { uploadsRestricted, uploadsSlug } from '../../slugs.js'

const Uploads: CollectionConfig = {
  slug: uploadsRestricted,
  fields: [
    {
      name: 'text',
      type: 'text',
    },
    {
      name: 'uploadWithoutRestriction',
      type: 'upload',
      relationTo: uploadsSlug,
    },
    {
      name: 'uploadWithAllowCreateFalse',
      type: 'upload',
      relationTo: uploadsSlug,
      admin: {
        allowCreate: false,
      },
    },
    {
      name: 'uploadMultipleWithAllowCreateFalse',
      type: 'upload',
      relationTo: uploadsSlug,
      hasMany: true,
      admin: { allowCreate: false },
    },
  ],
}

export default Uploads
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/test/fields/collections/Uploads3/.gitignore

```text
uploads3
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/fields/collections/Uploads3/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

import { uploads3Slug } from '../../slugs.js'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const Uploads3: CollectionConfig = {
  slug: uploads3Slug,
  upload: {
    staticDir: path.resolve(dirname, './uploads3'),
  },
  labels: {
    singular: 'Upload 3',
    plural: 'Uploads 3',
  },
  admin: {
    enableRichTextRelationship: false,
  },
  fields: [
    {
      type: 'upload',
      name: 'media',
      relationTo: uploads3Slug,
    },
    // {
    //   type: 'richText',
    //   name: 'richText',
    // },
  ],
}

export default Uploads3
```

--------------------------------------------------------------------------------

---[FILE: AfterNavLinks.tsx]---
Location: payload-main/test/fields/components/AfterNavLinks.tsx
Signals: React, Next.js

```typescript
'use client'

import type { PayloadClientReactComponent, SanitizedConfig } from 'payload'

import { NavGroup, useConfig } from '@payloadcms/ui'
import LinkImport from 'next/link.js'
const Link = 'default' in LinkImport ? LinkImport.default : LinkImport
import React from 'react'

const baseClass = 'after-nav-links'

export const AfterNavLinks: PayloadClientReactComponent<
  SanitizedConfig['admin']['components']['afterNavLinks'][0]
> = () => {
  const {
    config: {
      routes: { admin: adminRoute },
    },
  } = useConfig()

  return (
    <NavGroup key="extra-links" label="Extra Links">
      {/* Open link to payload admin url */}
      {/* <Link href={`${adminRoute}/collections/uploads`}>Internal Payload Admin Link</Link> */}
      {/* Open link to payload admin url with prefiltered query */}
      <Link href={`${adminRoute}/collections/uploads?page=1&search=jpg&limit=10`}>
        Prefiltered Media
      </Link>
    </NavGroup>
  )
}
```

--------------------------------------------------------------------------------

````
