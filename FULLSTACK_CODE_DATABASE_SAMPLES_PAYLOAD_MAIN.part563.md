---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 563
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 563 of 695)

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
Location: payload-main/test/fields/collections/SlugField/e2e.spec.ts

```typescript
import type { Page } from '@playwright/test'

import { expect, test } from '@playwright/test'
import { checkFocusIndicators } from 'helpers/e2e/checkFocusIndicators.js'
import { runAxeScan } from 'helpers/e2e/runAxeScan.js'
import path from 'path'
import { fileURLToPath } from 'url'

import type { PayloadTestSDK } from '../../../helpers/sdk/index.js'
import type { Config } from '../../payload-types.js'

import {
  changeLocale,
  ensureCompilationIsDone,
  initPageConsoleErrorCatch,
  saveDocAndAssert,
} from '../../../helpers.js'
import { AdminUrlUtil } from '../../../helpers/adminUrlUtil.js'
import { initPayloadE2ENoConfig } from '../../../helpers/initPayloadE2ENoConfig.js'
import { reInitializeDB } from '../../../helpers/reInitializeDB.js'
import { RESTClient } from '../../../helpers/rest.js'
import { TEST_TIMEOUT_LONG } from '../../../playwright.config.js'
import { slugFieldsSlug } from '../../slugs.js'

const filename = fileURLToPath(import.meta.url)
const currentFolder = path.dirname(filename)
const dirname = path.resolve(currentFolder, '../../')

const { beforeAll, beforeEach, describe } = test

let payload: PayloadTestSDK<Config>
let client: RESTClient
let page: Page
let serverURL: string
// If we want to make this run in parallel: test.describe.configure({ mode: 'parallel' })
let url: AdminUrlUtil

const unlockSlug = async (fieldName: string = 'slug') => {
  const fieldID = `#field-${fieldName}`
  const unlockButton = page.locator(`#field-${fieldName}-lock`)
  await unlockButton.click()
  const slugField = page.locator(fieldID)
  await expect(slugField).toBeEnabled()
}

const regenerateSlug = async (fieldName: string = 'slug') => {
  await unlockSlug(fieldName)
  const generateButton = page.locator(`#field-${fieldName}-generate`)
  await generateButton.click()
}

describe('SlugField', () => {
  beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)
    process.env.SEED_IN_CONFIG_ONINIT = 'false' // Makes it so the payload config onInit seed is not run. Otherwise, the seed would be run unnecessarily twice for the initial test run - once for beforeEach and once for onInit
    ;({ payload, serverURL } = await initPayloadE2ENoConfig<Config>({
      dirname,
      // prebuild,
    }))
    url = new AdminUrlUtil(serverURL, slugFieldsSlug)

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

  test('should generate slug for title field on save', async () => {
    await page.goto(url.create)
    await page.locator('#field-title').fill('Test title')

    await saveDocAndAssert(page)

    await expect(page.locator('#field-slug')).toHaveValue('test-title')
  })

  test('should generate slug on demand from client side', async () => {
    await page.goto(url.create)
    await page.locator('#field-title').fill('Test title client side')

    await saveDocAndAssert(page)

    await page.locator('#field-title').fill('This should have regenerated')
    await regenerateSlug('slug')

    await expect(page.locator('#field-slug')).toHaveValue('this-should-have-regenerated')
  })

  test('custom values should be kept', async () => {
    await page.goto(url.create)
    await page.locator('#field-title').fill('Test title with custom slug')

    await saveDocAndAssert(page)

    const slugField = page.locator('#field-slug')
    await expect(slugField).toHaveValue('test-title-with-custom-slug')
    await expect(slugField).toBeDisabled()

    await unlockSlug('slug')

    await slugField.fill('custom-slug-value')

    await saveDocAndAssert(page)

    await expect(slugField).toHaveValue('custom-slug-value')
  })

  test('custom slugify functions are supported', async () => {
    await page.goto(url.create)
    await page.locator('#field-title').fill('Test Custom Slugify')

    await saveDocAndAssert(page)

    await expect(page.locator('#field-customSlugify')).toHaveValue('TEST CUSTOM SLUGIFY')

    // Ensure it can be regenerated from the client-side
    const titleField = page.locator('#field-title')
    await titleField.fill('Another Custom Slugify')

    await regenerateSlug('customSlugify')

    await expect(page.locator('#field-customSlugify')).toHaveValue('ANOTHER CUSTOM SLUGIFY')
  })

  describe('localized slugs', () => {
    test('should generate slug for localized fields', async () => {
      await page.goto(url.create)
      await page.locator('#field-title').fill('Test normal title in default locale')
      await page.locator('#field-localizedTitle').fill('Test title in english')

      await saveDocAndAssert(page)

      await expect(page.locator('#field-slug')).toHaveValue('test-normal-title-in-default-locale')
      await expect(page.locator('#field-localizedSlug')).toHaveValue('test-title-in-english')

      await changeLocale(page, 'es')

      await expect(page.locator('#field-localizedTitle')).toBeEmpty()
      await page.locator('#field-localizedTitle').fill('Title in spanish')

      await saveDocAndAssert(page)

      await expect(page.locator('#field-localizedSlug')).toHaveValue('title-in-spanish')
    })
  })

  describe('A11y', () => {
    test('Edit view should have no accessibility violations', async ({}, testInfo) => {
      await page.goto(url.create)
      await page.locator('#field-title').waitFor()

      const scanResults = await runAxeScan({
        page,
        testInfo,
        include: ['.collection-edit__main'],
        exclude: ['.field-description'], // known issue - reported elsewhere @todo: remove this once fixed - see report https://github.com/payloadcms/payload/discussions/14489
      })

      expect(scanResults.violations.length).toBe(0)
    })

    test('Slug inputs have focus indicators', async ({}, testInfo) => {
      await page.goto(url.create)
      await page.locator('#field-title').waitFor()

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
Location: payload-main/test/fields/collections/SlugField/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { slugField } from 'payload'

import { slugFieldSlug } from './shared.js'

const SlugField: CollectionConfig = {
  slug: slugFieldSlug,
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField(),
    {
      name: 'localizedTitle',
      type: 'text',
      localized: true,
    },
    slugField({
      slugify: ({ valueToSlugify }) => valueToSlugify?.toUpperCase(),
      name: 'customSlugify',
      checkboxName: 'generateCustomSlug',
    }),
    slugField({
      useAsSlug: 'localizedTitle',
      name: 'localizedSlug',
      localized: true,
      required: false,
      checkboxName: 'generateLocalizedSlug',
    }),
  ],
}

export default SlugField
```

--------------------------------------------------------------------------------

---[FILE: shared.ts]---
Location: payload-main/test/fields/collections/SlugField/shared.ts

```typescript
import type { RequiredDataFromCollection } from 'payload'

import type { SlugField } from '../../payload-types.js'

export const defaultText = 'default-text'
export const slugFieldSlug = 'slug-fields'

export const slugFieldDoc: RequiredDataFromCollection<SlugField> = {
  title: 'Seeded text document',
  slug: 'seeded-text-document',
  localizedTitle: 'Localized text',
  localizedSlug: 'localized-text',
  customSlugify: 'SEEDED-TEXT-DOCUMENT',
}
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: payload-main/test/fields/collections/Tabs/constants.ts

```typescript
export const namedTabText = 'Some text in a named tab'
export const namedTabDefaultValue = 'default text inside of a named tab'
export const localizedTextValue = 'localized text'
```

--------------------------------------------------------------------------------

---[FILE: e2e.spec.ts]---
Location: payload-main/test/fields/collections/Tabs/e2e.spec.ts

```typescript
import type { Page } from '@playwright/test'

import { expect, test } from '@playwright/test'
import { checkFocusIndicators } from 'helpers/e2e/checkFocusIndicators.js'
import { runAxeScan } from 'helpers/e2e/runAxeScan.js'
import path from 'path'
import { wait } from 'payload/shared'
import { fileURLToPath } from 'url'

import type { PayloadTestSDK } from '../../../helpers/sdk/index.js'
import type { Config } from '../../payload-types.js'

import {
  ensureCompilationIsDone,
  initPageConsoleErrorCatch,
  saveDocAndAssert,
  switchTab,
} from '../../../helpers.js'
import { AdminUrlUtil } from '../../../helpers/adminUrlUtil.js'
import { navigateToDoc } from '../../../helpers/e2e/navigateToDoc.js'
import { initPayloadE2ENoConfig } from '../../../helpers/initPayloadE2ENoConfig.js'
import { reInitializeDB } from '../../../helpers/reInitializeDB.js'
import { RESTClient } from '../../../helpers/rest.js'
import { POLL_TOPASS_TIMEOUT, TEST_TIMEOUT_LONG } from '../../../playwright.config.js'
import { tabsFieldsSlug } from '../../slugs.js'

const filename = fileURLToPath(import.meta.url)
const currentFolder = path.dirname(filename)
const dirname = path.resolve(currentFolder, '../../')

const { beforeAll, beforeEach, describe } = test

let payload: PayloadTestSDK<Config>
let client: RESTClient
let page: Page
let serverURL: string
// If we want to make this run in parallel: test.describe.configure({ mode: 'parallel' })
let url: AdminUrlUtil

describe('Tabs', () => {
  beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)
    process.env.SEED_IN_CONFIG_ONINIT = 'false' // Makes it so the payload config onInit seed is not run. Otherwise, the seed would be run unnecessarily twice for the initial test run - once for beforeEach and once for onInit
    ;({ payload, serverURL } = await initPayloadE2ENoConfig<Config>({
      dirname,
      // prebuild,
    }))
    url = new AdminUrlUtil(serverURL, tabsFieldsSlug)

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

  test('should fill and retain a new value within a tab while switching tabs', async () => {
    const textInRowValue = 'hello'
    const numberInRowValue = '23'
    const jsonValue = '{ "foo": "bar"}'

    await page.goto(url.create)

    await switchTab(page, '.tabs-field__tab-button:has-text("Tab with Row")')
    await page.locator('#field-textInRow').fill(textInRowValue)
    await page.locator('#field-numberInRow').fill(numberInRowValue)
    await page.locator('.json-field .inputarea').fill(jsonValue)

    await wait(300)

    await switchTab(page, '.tabs-field__tab-button:has-text("Tab with Array")')
    await switchTab(page, '.tabs-field__tab-button:has-text("Tab with Row")')

    await expect(page.locator('#field-textInRow')).toHaveValue(textInRowValue)
    await expect(page.locator('#field-numberInRow')).toHaveValue(numberInRowValue)
    await expect(page.locator('.json-field .lines-content')).toContainText(jsonValue)
  })

  test('should retain updated values within tabs while switching between tabs', async () => {
    const textInRowValue = 'new value'
    const jsonValue = '{ "new": "value"}'
    await navigateToDoc(page, url)

    // Go to Row tab, update the value
    await switchTab(page, '.tabs-field__tab-button:has-text("Tab with Row")')

    await page.locator('#field-textInRow').fill(textInRowValue)
    await page.locator('.json-field .inputarea').fill(jsonValue)

    await wait(500)

    // Go to Array tab, then back to Row. Make sure new value is still there
    await switchTab(page, '.tabs-field__tab-button:has-text("Tab with Array")')
    await switchTab(page, '.tabs-field__tab-button:has-text("Tab with Row")')

    await expect(page.locator('#field-textInRow')).toHaveValue(textInRowValue)
    await expect(page.locator('.json-field .lines-content')).toContainText(jsonValue)

    // Go to array tab, save the doc
    await switchTab(page, '.tabs-field__tab-button:has-text("Tab with Array")')
    await saveDocAndAssert(page)

    // Go back to row tab, make sure the new value is still present
    await switchTab(page, '.tabs-field__tab-button:has-text("Tab with Row")')
    await expect(page.locator('#field-textInRow')).toHaveValue(textInRowValue)
  })

  test('should render array data within unnamed tabs', async () => {
    await navigateToDoc(page, url)
    await switchTab(page, '.tabs-field__tab-button:has-text("Tab with Array")')
    await expect(page.locator('#field-array__0__text')).toHaveValue("Hello, I'm the first row")
  })

  test('should render array data within named tabs', async () => {
    await navigateToDoc(page, url)
    await switchTab(page, '.tabs-field__tab-button:has-text("Tab with Name")')
    await expect(page.locator('#field-tab__array__0__text')).toHaveValue(
      "Hello, I'm the first row, in a named tab",
    )
  })

  test('should render conditional tab when checkbox is toggled', async () => {
    await navigateToDoc(page, url)
    await wait(200)

    const conditionalTabSelector = '.tabs-field__tab-button:text-is("Conditional Tab")'
    const button = page.locator(conditionalTabSelector)
    await expect(
      async () => await expect(page.locator(conditionalTabSelector)).toHaveClass(/--hidden/),
    ).toPass({
      timeout: POLL_TOPASS_TIMEOUT,
    })

    const checkboxSelector = `input#field-conditionalTabVisible`
    await page.locator(checkboxSelector).check()
    await expect(page.locator(checkboxSelector)).toBeChecked()

    await expect(
      async () => await expect(page.locator(conditionalTabSelector)).not.toHaveClass(/--hidden/),
    ).toPass({
      timeout: POLL_TOPASS_TIMEOUT,
    })

    await switchTab(page, conditionalTabSelector)

    await expect(
      page.locator('label[for="field-conditionalTab__conditionalTabField"]'),
    ).toHaveCount(1)
  })

  test('should hide nested conditional tab when checkbox is toggled', async () => {
    await navigateToDoc(page, url)

    // Show the conditional tab
    const conditionalTabSelector = '.tabs-field__tab-button:text-is("Conditional Tab")'
    const checkboxSelector = `input#field-conditionalTabVisible`
    await page.locator(checkboxSelector).check()
    await wait(200)
    await switchTab(page, conditionalTabSelector)

    // Now assert on the nested conditional tab
    const nestedConditionalTabSelector = '.tabs-field__tab-button:text-is("Nested Conditional Tab")'

    await expect(
      async () =>
        await expect(page.locator(nestedConditionalTabSelector)).not.toHaveClass(/--hidden/),
    ).toPass({
      timeout: POLL_TOPASS_TIMEOUT,
    })

    const nestedCheckboxSelector = `input#field-conditionalTab__nestedConditionalTabVisible`
    await page.locator(nestedCheckboxSelector).uncheck()

    await expect(
      async () => await expect(page.locator(nestedConditionalTabSelector)).toHaveClass(/--hidden/),
    ).toPass({
      timeout: POLL_TOPASS_TIMEOUT,
    })
  })

  test('should save preferences for tab order', async () => {
    await page.goto(url.list)

    const firstItem = page.locator('.cell-id a').nth(0)
    const href = await firstItem.getAttribute('href')
    await firstItem.click()

    const regex = new RegExp(href!.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))

    await page.waitForURL(regex)

    await page.locator('.tabs-field__tabs button:nth-child(2)').nth(0).click()

    await page.reload()

    const tab2 = page.locator('.tabs-field__tabs button:nth-child(2)').nth(0)

    await expect(async () => await expect(tab2).toHaveClass(/--active/)).toPass({
      timeout: POLL_TOPASS_TIMEOUT,
    })
  })

  describe('A11y', () => {
    test.fixme('Edit view should have no accessibility violations', async ({}, testInfo) => {
      await page.goto(url.create)
      await page.locator('.tabs-field__tabs').first().waitFor()

      const scanResults = await runAxeScan({
        page,
        testInfo,
        include: ['.collection-edit__main'],
        exclude: ['.field-description'], // known issue - reported elsewhere @todo: remove this once fixed - see report https://github.com/payloadcms/payload/discussions/14489
      })

      expect(scanResults.violations.length).toBe(0)
    })

    test('Tab fields have focus indicators', async ({}, testInfo) => {
      await page.goto(url.create)
      await page.locator('.tabs-field__tabs').first().waitFor()

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
Location: payload-main/test/fields/collections/Tabs/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { tabsFieldsSlug } from '../../slugs.js'
import { getBlocksField } from '../Blocks/index.js'
import { namedTabDefaultValue } from './constants.js'

const TabsFields: CollectionConfig = {
  slug: tabsFieldsSlug,
  access: {
    read: () => true,
  },
  versions: true,
  fields: [
    {
      name: 'sidebarField',
      type: 'text',
      label: 'Sidebar Field',
      admin: {
        position: 'sidebar',
        description:
          'This should not collapse despite there being many tabs pushing the main fields open.',
      },
    },
    {
      name: 'conditionalTabVisible',
      type: 'checkbox',
      label: 'Toggle Conditional Tab',
      admin: {
        position: 'sidebar',
        description:
          'When active, the conditional tab should be visible. When inactive, it should be hidden.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          name: 'conditionalTab',
          label: 'Conditional Tab',
          description: 'This tab should only be visible when the conditional field is checked.',
          fields: [
            {
              name: 'conditionalTabField',
              type: 'text',
              label: 'Conditional Tab Field',
              defaultValue:
                'This field should only be visible when the conditional tab is visible.',
            },
            {
              name: 'nestedConditionalTabVisible',
              type: 'checkbox',
              label: 'Toggle Nested Conditional Tab',
              defaultValue: true,
              admin: {
                description:
                  'When active, the nested conditional tab should be visible. When inactive, it should be hidden.',
              },
            },
            {
              type: 'group',
              name: 'conditionalTabGroup',
              fields: [
                {
                  type: 'text',
                  name: 'conditionalTabGroupTitle',
                },
                {
                  type: 'tabs',
                  tabs: [
                    {
                      // duplicate name as above, should not conflict with tab IDs in form-state, if it does then tests will fail
                      name: 'conditionalTab',
                      label: 'Duplicate conditional tab',
                      fields: [],
                      admin: {
                        condition: ({ conditionalTab }) =>
                          !!conditionalTab?.nestedConditionalTabVisible,
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: 'tabs',

              tabs: [
                {
                  label: 'Nested Unconditional Tab',
                  description: 'Description for a nested unconditional tab',
                  fields: [
                    {
                      name: 'nestedUnconditionalTabInput',
                      type: 'text',
                    },
                  ],
                },
                {
                  label: 'Nested Conditional Tab',
                  description: 'Here is a description for a nested conditional tab',
                  fields: [
                    {
                      name: 'nestedConditionalTabInput',
                      type: 'textarea',
                      defaultValue:
                        'This field should only be visible when the nested conditional tab is visible.',
                    },
                  ],
                  admin: {
                    condition: ({ conditionalTab }) =>
                      !!conditionalTab?.nestedConditionalTabVisible,
                  },
                },
              ],
            },
          ],
          admin: {
            condition: ({ conditionalTabVisible }) => !!conditionalTabVisible,
          },
        },
        {
          label: 'Tab with Array',
          description: 'This tab has an array.',
          fields: [
            {
              type: 'ui',
              name: 'demoUIField',
              label: 'Demo UI Field',
              admin: {
                components: {
                  Field: '/collections/Tabs/UIField.js#UIField',
                },
              },
            },
            {
              name: 'array',
              labels: {
                singular: 'Item',
                plural: 'Items',
              },
              type: 'array',
              required: true,
              fields: [
                // path: 'array.n.text'
                // schemaPath: '_index-1-0.array.text'
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Tab with Blocks',
          description: 'Blocks are rendered here to ensure they populate and render correctly.',
          fields: [getBlocksField()],
        },
        {
          label: 'Tab with Group',
          description: 'This tab has a group, which should not render its top border or margin.',
          fields: [
            {
              name: 'group',
              type: 'group',
              label: 'Group',
              fields: [
                {
                  name: 'number',
                  type: 'number',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Tab with Row',
          description: 'This tab has a row field.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'textInRow',
                  type: 'text',
                  required: true,
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'numberInRow',
                  type: 'number',
                  required: true,
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'json',
              type: 'json',
            },
          ],
        },
        {
          name: 'tab',
          label: 'Tab with Name',
          interfaceName: 'TabWithName',
          description: 'This tab has a name, which should namespace the contained fields.',
          fields: [
            {
              name: 'array',
              labels: {
                singular: 'Item',
                plural: 'Items',
              },
              type: 'array',
              required: true,
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'text',
              type: 'text',
            },
            {
              name: 'defaultValue',
              type: 'text',
              defaultValue: namedTabDefaultValue,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'arrayInRow',
                  type: 'array',
                  fields: [
                    {
                      name: 'textInArrayInRow',
                      type: 'text',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'namedTabWithDefaultValue',
          description: 'This tab has a name, which should namespace the contained fields.',
          fields: [
            {
              name: 'defaultValue',
              type: 'text',
              defaultValue: namedTabDefaultValue,
            },
          ],
        },
        {
          name: 'localizedTab',
          label: { en: 'Localized Tab en', es: 'Localized Tab es' },
          localized: true,
          description: 'This tab is localized and requires a name',
          fields: [
            {
              name: 'text',
              type: 'text',
            },
          ],
        },
        {
          name: 'accessControlTab',
          access: {
            read: () => false,
          },
          description: 'This tab is cannot be read',
          fields: [
            {
              name: 'text',
              type: 'text',
            },
          ],
        },
        {
          name: 'hooksTab',
          label: 'Hooks Tab',
          hooks: {
            beforeValidate: [
              ({ data = {} }) => {
                if (!data.hooksTab) {
                  data.hooksTab = {}
                }
                data.hooksTab.beforeValidate = true
                return data.hooksTab
              },
            ],
            beforeChange: [
              ({ data = {} }) => {
                if (!data.hooksTab) {
                  data.hooksTab = {}
                }
                data.hooksTab.beforeChange = true
                return data.hooksTab
              },
            ],
            afterChange: [
              ({ originalDoc }) => {
                originalDoc.hooksTab.afterChange = true
                return originalDoc.hooksTab
              },
            ],
            afterRead: [
              ({ data = {} }) => {
                if (!data.hooksTab) {
                  data.hooksTab = {}
                }
                data.hooksTab.afterRead = true
                return data.hooksTab
              },
            ],
          },
          description: 'This tab has hooks',
          fields: [
            {
              name: 'beforeValidate',
              type: 'checkbox',
            },
            {
              name: 'beforeChange',
              type: 'checkbox',
            },
            {
              name: 'afterChange',
              type: 'checkbox',
            },
            {
              name: 'afterRead',
              type: 'checkbox',
            },
          ],
        },
        {
          name: 'camelCaseTab',
          fields: [
            {
              name: 'array',
              type: 'array',
              fields: [
                {
                  type: 'text',
                  name: 'text',
                  localized: true,
                },
                {
                  type: 'array',
                  name: 'array',
                  fields: [
                    {
                      type: 'text',
                      name: 'text',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Tabs within Collapsible',
      fields: [
        {
          type: 'tabs',
          tabs: [
            {
              label: 'Nested Tab One',
              description: 'Here is a description for a nested tab',
              fields: [
                {
                  name: 'textarea',
                  type: 'textarea',
                },
              ],
            },
            {
              label: 'Nested Tab Two',
              description: 'Description for tab two',
              fields: [
                {
                  name: 'anotherText',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'nestedTab',
              label: 'Nested Tab with Name',
              description: 'This tab has a name, which should namespace the contained fields.',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export default TabsFields
```

--------------------------------------------------------------------------------

---[FILE: shared.ts]---
Location: payload-main/test/fields/collections/Tabs/shared.ts

```typescript
import type { TabsField } from '../../payload-types.js'

import { getBlocksFieldSeedData } from '../Blocks/shared.js'
import { localizedTextValue, namedTabText } from './constants.js'

export const tabsDoc: Partial<TabsField> = {
  array: [
    {
      text: "Hello, I'm the first row",
    },
    {
      text: 'Second row here',
    },
    {
      text: 'Here is some data for the third row',
    },
  ],
  blocks: getBlocksFieldSeedData(),
  group: {
    number: 12,
  },
  nestedTab: {
    text: 'Some text in a nested, named tab',
  },
  tab: {
    array: [
      {
        text: "Hello, I'm the first row, in a named tab",
      },
      {
        text: 'Second row here, in a named tab',
      },
      {
        text: 'Here is some data for the third row, in a named tab',
      },
    ],
    text: namedTabText,
    arrayInRow: [
      {
        text: "Hello, I'm some text in an array in a row",
      },
    ],
  },
  localizedTab: {
    text: localizedTextValue,
  },
  accessControlTab: {
    text: 'cannot be read',
  },
  hooksTab: {
    beforeValidate: false,
    beforeChange: false,
    afterChange: false,
    afterRead: false,
  },
  textarea: 'Here is some text that goes in a textarea',
  anotherText: 'Super tired of writing this text',
  textInRow: 'hello',
  numberInRow: 235,
}
```

--------------------------------------------------------------------------------

---[FILE: UIField.tsx]---
Location: payload-main/test/fields/collections/Tabs/UIField.tsx
Signals: React

```typescript
import React from 'react'

export const UIField: React.FC = () => {
  return <p>This is a UI field within a tab component.</p>
}
```

--------------------------------------------------------------------------------

---[FILE: e2e.spec.ts]---
Location: payload-main/test/fields/collections/Tabs2/e2e.spec.ts

```typescript
import type { Page } from '@playwright/test'

import { expect, test } from '@playwright/test'
import { addArrayRow } from 'helpers/e2e/fields/array/index.js'
import path from 'path'
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
import { RESTClient } from '../../../helpers/rest.js'
import { TEST_TIMEOUT_LONG } from '../../../playwright.config.js'
import { tabsFields2Slug } from '../../slugs.js'

const filename = fileURLToPath(import.meta.url)
const currentFolder = path.dirname(filename)
const dirname = path.resolve(currentFolder, '../../')

const { beforeAll, beforeEach, describe } = test

let payload: PayloadTestSDK<Config>
let client: RESTClient
let page: Page
let serverURL: string
// If we want to make this run in parallel: test.describe.configure({ mode: 'parallel' })
let url: AdminUrlUtil

describe('Tabs', () => {
  beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)
    process.env.SEED_IN_CONFIG_ONINIT = 'false' // Makes it so the payload config onInit seed is not run. Otherwise, the seed would be run unnecessarily twice for the initial test run - once for beforeEach and once for onInit
    ;({ payload, serverURL } = await initPayloadE2ENoConfig<Config>({
      dirname,
      // prebuild,
    }))
    url = new AdminUrlUtil(serverURL, tabsFields2Slug)

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

  test('should correctly save nested unnamed and named tabs', async () => {
    await page.goto(url.create)

    await addArrayRow(page, { fieldName: 'tabsInArray' })
    await page.locator('#field-tabsInArray__0__text').fill('tab 1 text')
    await page.locator('.tabs-field__tabs button:nth-child(2)').click()
    await page.locator('#field-tabsInArray__0__tab2__text2').fill('tab 2 text')

    await saveDocAndAssert(page)

    await expect(page.locator('#field-tabsInArray__0__text')).toHaveValue('tab 1 text')
    await page.locator('.tabs-field__tabs button:nth-child(2)').click()
    await expect(page.locator('#field-tabsInArray__0__tab2__text2')).toHaveValue('tab 2 text')
  })
})
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/fields/collections/Tabs2/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { tabsFields2Slug } from '../../slugs.js'

export const TabsFields2: CollectionConfig = {
  slug: tabsFields2Slug,
  fields: [
    {
      name: 'tabsInArray',
      type: 'array',
      fields: [
        {
          type: 'tabs',
          label: 'tabs',
          tabs: [
            {
              label: 'tab1',
              fields: [
                {
                  type: 'text',
                  name: 'text',
                },
              ],
            },
            {
              name: 'tab2',
              fields: [
                {
                  type: 'text',
                  name: 'text2',
                },
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

---[FILE: CustomDescription.tsx]---
Location: payload-main/test/fields/collections/Text/CustomDescription.tsx
Signals: React

```typescript
import React from 'react'

export default function CustomDescription() {
  return <div>Custom Description</div>
}
```

--------------------------------------------------------------------------------

````
