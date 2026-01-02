---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 564
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 564 of 695)

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
Location: payload-main/test/fields/collections/Text/e2e.spec.ts

```typescript
import type { Page } from '@playwright/test'
import type { GeneratedTypes } from 'helpers/sdk/types.js'

import { expect, test } from '@playwright/test'
import { openListColumns, toggleColumn } from 'helpers/e2e/columns/index.js'
import { addListFilter } from 'helpers/e2e/filters/index.js'
import { upsertPreferences } from 'helpers/e2e/preferences.js'
import { runAxeScan } from 'helpers/e2e/runAxeScan.js'
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
  selectTableRow,
} from '../../../helpers.js'
import { AdminUrlUtil } from '../../../helpers/adminUrlUtil.js'
import { initPayloadE2ENoConfig } from '../../../helpers/initPayloadE2ENoConfig.js'
import { reInitializeDB } from '../../../helpers/reInitializeDB.js'
import { RESTClient } from '../../../helpers/rest.js'
import { TEST_TIMEOUT_LONG } from '../../../playwright.config.js'
import { textFieldsSlug } from '../../slugs.js'
import { textDoc } from './shared.js'

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

describe('Text', () => {
  beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)
    process.env.SEED_IN_CONFIG_ONINIT = 'false' // Makes it so the payload config onInit seed is not run. Otherwise, the seed would be run unnecessarily twice for the initial test run - once for beforeEach and once for onInit
    ;({ payload, serverURL } = await initPayloadE2ENoConfig<Config>({
      dirname,
      // prebuild,
    }))
    url = new AdminUrlUtil(serverURL, textFieldsSlug)

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

  describe('hidden and disabled fields', () => {
    test('should not render top-level hidden fields in the UI', async () => {
      await page.goto(url.create)
      await expect(page.locator('#field-hiddenTextField')).toBeHidden()
      await page.goto(url.list)
      await expect(page.locator('.cell-hiddenTextField')).toBeHidden()
      await expect(page.locator('#heading-hiddenTextField')).toBeHidden()

      const { columnContainer } = await openListColumns(page, {})

      await expect(
        columnContainer.locator('.pill-selector__pill', {
          hasText: exactText('Hidden Text Field'),
        }),
      ).toBeHidden()

      await selectTableRow(page, 'Seeded text document')
      await page.locator('.edit-many__toggle').click()
      await page.locator('.field-select .rs__control').click()

      const hiddenFieldOption = page.locator('.rs__option', {
        hasText: exactText('Hidden Text Field'),
      })

      await expect(hiddenFieldOption).toBeHidden()
    })

    test('should not show disabled fields in the UI', async () => {
      await page.goto(url.create)
      await expect(page.locator('#field-disabledTextField')).toHaveCount(0)
      await page.goto(url.list)
      await expect(page.locator('.cell-disabledTextField')).toBeHidden()
      await expect(page.locator('#heading-disabledTextField')).toBeHidden()

      const { columnContainer } = await openListColumns(page, {})

      await expect(
        columnContainer.locator('.pill-selector__pill', {
          hasText: exactText('Disabled Text Field'),
        }),
      ).toBeHidden()

      await selectTableRow(page, 'Seeded text document')

      await page.locator('.edit-many__toggle').click()

      await page.locator('.field-select .rs__control').click()

      const disabledFieldOption = page.locator('.rs__option', {
        hasText: exactText('Disabled Text Field'),
      })

      await expect(disabledFieldOption).toBeHidden()
    })

    test('should render hidden input for admin.hidden fields', async () => {
      await page.goto(url.create)
      await expect(page.locator('#field-adminHiddenTextField')).toHaveAttribute('type', 'hidden')
      await page.goto(url.list)
      await expect(page.locator('.cell-adminHiddenTextField').first()).toBeVisible()
      await expect(page.locator('#heading-adminHiddenTextField')).toBeVisible()

      const { columnContainer } = await openListColumns(page, {})

      await expect(
        columnContainer.locator('.pill-selector__pill', {
          hasText: exactText('Admin Hidden Text Field'),
        }),
      ).toBeVisible()

      await selectTableRow(page, 'Seeded text document')
      await page.locator('.edit-many__toggle').click()
      await page.locator('.field-select .rs__control').click()

      const adminHiddenFieldOption = page.locator('.rs__option', {
        hasText: exactText('Admin Hidden Text Field'),
      })

      await expect(adminHiddenFieldOption).toBeVisible()
    })

    test('hidden and disabled fields should not break subsequent field paths', async () => {
      await page.goto(url.create)
      await expect(page.locator('#custom-field-schema-path')).toHaveText('text-fields._index-4')
    })
  })

  test('should display field in list view', async () => {
    await page.goto(url.list)
    const textCell = page.locator('.row-1 .cell-text')
    await expect(textCell).toHaveText(textDoc.text)
  })

  test('should respect admin.disableListColumn despite preferences', async () => {
    await upsertPreferences<Config, GeneratedTypes<any>>({
      payload,
      user: client.user,
      key: 'text-fields-list',
      value: {
        columns: [
          {
            accessor: 'disableListColumnText',
            active: true,
          },
        ],
      },
    })

    await page.goto(url.list)
    await openListColumns(page, {})
    await expect(
      page.locator(`.pill-selector .pill-selector__pill`, {
        hasText: exactText('Disable List Column Text'),
      }),
    ).toBeHidden()

    await expect(page.locator('#heading-disableListColumnText')).toBeHidden()
    await expect(page.locator('table .row-1 .cell-disableListColumnText')).toBeHidden()
  })

  test('should display i18n label in cells when missing field data', async () => {
    await page.goto(url.list)
    await page.waitForURL(new RegExp(`${url.list}.*\\?.*`))

    await toggleColumn(page, {
      targetState: 'on',
      columnLabel: 'Text en',
      columnName: 'i18nText',
    })

    const textCell = page.locator('.row-1 .cell-i18nText')

    await expect(textCell).toHaveText('<No Text en>')
  })

  test('should show i18n label', async () => {
    await page.goto(url.create)

    await expect(page.locator('label[for="field-i18nText"]')).toHaveText('Text en')
  })

  test('should show i18n placeholder', async () => {
    await page.goto(url.create)
    await expect(page.locator('#field-i18nText')).toHaveAttribute('placeholder', 'en placeholder')
  })

  test('should show i18n descriptions', async () => {
    await page.goto(url.create)
    const description = page.locator('.field-description-i18nText')
    await expect(description).toHaveText('en description')
  })

  test('should create hasMany with multiple texts', async () => {
    const input = 'five'
    const furtherInput = 'six'

    await page.goto(url.create)
    const requiredField = page.locator('#field-text')
    const field = page.locator('.field-hasMany')

    await requiredField.fill(String(input))
    await field.click()
    await page.keyboard.type(input)
    await page.keyboard.press('Enter')
    await page.keyboard.type(furtherInput)
    await page.keyboard.press('Enter')
    await saveDocAndAssert(page)
    await expect(field.locator('.rs__value-container')).toContainText(input)
    await expect(field.locator('.rs__value-container')).toContainText(furtherInput)
  })

  test('should allow editing hasMany text field values by clicking', async () => {
    const originalText = 'original'
    const newText = 'new'

    await page.goto(url.create)

    // fill required field
    const requiredField = page.locator('#field-text')
    await requiredField.fill(String(originalText))

    const field = page.locator('.field-hasMany')

    // Add initial value
    await field.click()
    await page.keyboard.type(originalText)
    await page.keyboard.press('Enter')

    // Click to edit existing value
    const value = field.locator('.multi-value-label__text')
    await value.click()
    await value.dblclick()
    await page.keyboard.type(newText)
    await page.keyboard.press('Enter')

    await saveDocAndAssert(page)
    await expect(field.locator('.rs__value-container')).toContainText(`${newText}`)
  })

  test('should not allow editing hasMany text field values when disabled', async () => {
    await page.goto(url.create)
    const field = page.locator('.field-readOnlyHasMany')

    // Try to click to edit
    const value = field.locator('.multi-value-label__text')
    await value.click({ force: true })

    // Verify it does not become editable
    await expect(field.locator('.multi-value-label__text')).not.toHaveClass(/.*--editable/)
  })

  test('should filter Text field hasMany: false in the collection list view - in', async () => {
    await page.goto(url.list)
    await expect(page.locator('table >> tbody >> tr')).toHaveCount(2)

    await addListFilter({
      page,
      fieldLabel: 'Text',
      operatorLabel: 'is in',
      value: 'Another text document',
    })

    await wait(300)
    await expect(page.locator('table >> tbody >> tr')).toHaveCount(1)
  })

  test('should filter Text field hasMany: false in the collection list view - is not in', async () => {
    await page.goto(url.list)
    await expect(page.locator('table >> tbody >> tr')).toHaveCount(2)

    await addListFilter({
      page,
      fieldLabel: 'Text',
      operatorLabel: 'is not in',
      value: 'Another text document',
    })

    await wait(300)
    await expect(page.locator('table >> tbody >> tr')).toHaveCount(1)
  })

  test('should filter Text field hasMany: true in the collection list view - in', async () => {
    await page.goto(url.list)
    await expect(page.locator('table >> tbody >> tr')).toHaveCount(2)

    await addListFilter({
      page,
      fieldLabel: 'Has Many',
      operatorLabel: 'is in',
      value: 'one',
    })

    await wait(300)
    await expect(page.locator('table >> tbody >> tr')).toHaveCount(1)
  })

  test('should filter Text field hasMany: true in the collection list view - is not in', async () => {
    await page.goto(url.list)
    await expect(page.locator('table >> tbody >> tr')).toHaveCount(2)

    await addListFilter({
      page,
      fieldLabel: 'Has Many',
      operatorLabel: 'is not in',
      value: 'four',
    })

    await wait(300)
    await expect(page.locator('table >> tbody >> tr')).toHaveCount(1)
  })

  describe('A11y', () => {
    test.fixme('Edit view should have no accessibility violations', async ({}, testInfo) => {
      await page.goto(url.create)
      await page.locator('#field-text').waitFor()

      const scanResults = await runAxeScan({
        page,
        testInfo,
        include: ['.document-fields__main'],
        exclude: ['[id*="react-select-"]'], // ignore react-select elements here
      })

      expect(scanResults.violations.length).toBe(0)
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/fields/collections/Text/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { defaultText, textFieldsSlug } from './shared.js'

const TextFields: CollectionConfig = {
  slug: textFieldsSlug,
  admin: {
    useAsTitle: 'text',
  },
  defaultSort: 'id',
  fields: [
    {
      name: 'text',
      type: 'text',
      required: true,
      hooks: {
        beforeDuplicate: [({ value }) => `${value} - duplicate`],
      },
    },
    {
      name: 'hiddenTextField',
      type: 'text',
      hidden: true,
    },
    {
      name: 'adminHiddenTextField',
      type: 'text',
      admin: {
        hidden: true,
        description: 'This field should be hidden',
      },
    },
    {
      name: 'disabledTextField',
      type: 'text',
      admin: {
        disabled: true,
        description: 'This field should be disabled',
      },
    },
    {
      type: 'row',
      admin: {
        components: {
          Field: './components/CustomField.tsx#CustomField',
        },
      },
      fields: [],
    },
    {
      name: 'localizedText',
      type: 'text',
      localized: true,
    },
    {
      name: 'i18nText',
      type: 'text',
      admin: {
        description: {
          en: 'en description',
          es: 'es description',
        },
        placeholder: {
          en: 'en placeholder',
          es: 'es placeholder',
        },
      },
      label: {
        en: 'Text en',
        es: 'Text es',
      },
    },
    {
      name: 'defaultString',
      type: 'text',
      defaultValue: defaultText,
    },
    {
      name: 'defaultEmptyString',
      type: 'text',
      defaultValue: '',
    },
    {
      name: 'defaultFunction',
      type: 'text',
      defaultValue: () => defaultText,
    },
    {
      name: 'defaultAsync',
      type: 'text',
      defaultValue: async (): Promise<string> => {
        return new Promise((resolve) =>
          setTimeout(() => {
            resolve(defaultText)
          }, 1),
        )
      },
    },
    {
      name: 'overrideLength',
      type: 'text',
      label: 'Override the 40k text length default',
      maxLength: 50000,
    },
    {
      name: 'fieldWithDefaultValue',
      type: 'text',
      defaultValue: async () => {
        const defaultValue = new Promise((resolve) => setTimeout(() => resolve('some-value'), 1000))

        return defaultValue
      },
    },
    {
      name: 'dependentOnFieldWithDefaultValue',
      type: 'text',
      hooks: {
        beforeChange: [
          ({ data }) => {
            return data?.fieldWithDefaultValue || ''
          },
        ],
      },
    },
    {
      name: 'hasMany',
      type: 'text',
      hasMany: true,
    },
    {
      name: 'hasManySecond',
      type: 'text',
      hasMany: true,
    },
    {
      name: 'readOnlyHasMany',
      type: 'text',
      hasMany: true,
      admin: {
        readOnly: true,
      },
      defaultValue: ['default'],
    },
    {
      name: 'validatesHasMany',
      type: 'text',
      hasMany: true,
      minLength: 3,
    },
    {
      name: 'localizedHasMany',
      type: 'text',
      hasMany: true,
      localized: true,
    },
    {
      name: 'withMinRows',
      type: 'text',
      hasMany: true,
      minRows: 2,
    },
    {
      name: 'withMaxRows',
      type: 'text',
      hasMany: true,
      maxRows: 4,
    },
    {
      name: 'defaultValueFromReq',
      type: 'text',
      defaultValue: async ({ req }) => {
        return Promise.resolve(req.context.defaultValue)
      },
    },
    {
      name: 'array',
      type: 'array',
      fields: [
        {
          name: 'texts',
          type: 'text',
          hasMany: true,
        },
      ],
    },
    {
      name: 'blocks',
      type: 'blocks',
      blocks: [
        {
          slug: 'blockWithText',
          fields: [
            {
              name: 'texts',
              type: 'text',
              hasMany: true,
            },
          ],
        },
      ],
    },
  ],
}

export default TextFields
```

--------------------------------------------------------------------------------

---[FILE: shared.ts]---
Location: payload-main/test/fields/collections/Text/shared.ts

```typescript
import type { RequiredDataFromCollection } from 'payload'

import type { TextField } from '../../payload-types.js'

export const defaultText = 'default-text'
export const textFieldsSlug = 'text-fields'

export const textDoc: RequiredDataFromCollection<TextField> = {
  text: 'Seeded text document',
  localizedText: 'Localized text',
  hasMany: ['one', 'two'],
}

export const anotherTextDoc: RequiredDataFromCollection<TextField> = {
  text: 'Another text document',
  hasMany: ['three', 'four'],
}
```

--------------------------------------------------------------------------------

---[FILE: e2e.spec.ts]---
Location: payload-main/test/fields/collections/Textarea/e2e.spec.ts

```typescript
import type { Page } from '@playwright/test'
import type { GeneratedTypes } from 'helpers/sdk/types.js'

import { expect, test } from '@playwright/test'
import { checkFocusIndicators } from 'helpers/e2e/checkFocusIndicators.js'
import { openListColumns, toggleColumn } from 'helpers/e2e/columns/index.js'
import { addListFilter } from 'helpers/e2e/filters/index.js'
import { upsertPreferences } from 'helpers/e2e/preferences.js'
import { runAxeScan } from 'helpers/e2e/runAxeScan.js'
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
  selectTableRow,
} from '../../../helpers.js'
import { AdminUrlUtil } from '../../../helpers/adminUrlUtil.js'
import { initPayloadE2ENoConfig } from '../../../helpers/initPayloadE2ENoConfig.js'
import { reInitializeDB } from '../../../helpers/reInitializeDB.js'
import { RESTClient } from '../../../helpers/rest.js'
import { TEST_TIMEOUT_LONG } from '../../../playwright.config.js'
import { textareaFieldsSlug } from '../../slugs.js'
import { textareaDoc } from './shared.js'

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

describe('Textarea', () => {
  beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)
    process.env.SEED_IN_CONFIG_ONINIT = 'false' // Makes it so the payload config onInit seed is not run. Otherwise, the seed would be run unnecessarily twice for the initial test run - once for beforeEach and once for onInit
    ;({ payload, serverURL } = await initPayloadE2ENoConfig<Config>({
      dirname,
      // prebuild,
    }))
    url = new AdminUrlUtil(serverURL, textareaFieldsSlug)

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

  describe('hidden and disabled fields', () => {
    test('should not render top-level hidden fields in the UI', async () => {
      await page.goto(url.create)
      await expect(page.locator('#field-hiddenTextField')).toBeHidden()
      await page.goto(url.list)
      await expect(page.locator('.cell-hiddenTextField')).toBeHidden()
      await expect(page.locator('#heading-hiddenTextField')).toBeHidden()

      const { columnContainer } = await openListColumns(page, {})

      await expect(
        columnContainer.locator('.pill-selector__pill', {
          hasText: exactText('Hidden Text Field'),
        }),
      ).toBeHidden()

      await selectTableRow(page, 'Seeded text document')
      await page.locator('.edit-many__toggle').click()
      await page.locator('.field-select .rs__control').click()

      const hiddenFieldOption = page.locator('.rs__option', {
        hasText: exactText('Hidden Text Field'),
      })

      await expect(hiddenFieldOption).toBeHidden()
    })

    test('should not show disabled fields in the UI', async () => {
      await page.goto(url.create)
      await expect(page.locator('#field-disabledTextField')).toHaveCount(0)
      await page.goto(url.list)
      await expect(page.locator('.cell-disabledTextField')).toBeHidden()
      await expect(page.locator('#heading-disabledTextField')).toBeHidden()

      const { columnContainer } = await openListColumns(page, {})

      await expect(
        columnContainer.locator('.pill-selector__pill', {
          hasText: exactText('Disabled Text Field'),
        }),
      ).toBeHidden()

      await selectTableRow(page, 'Seeded text document')

      await page.locator('.edit-many__toggle').click()

      await page.locator('.field-select .rs__control').click()

      const disabledFieldOption = page.locator('.rs__option', {
        hasText: exactText('Disabled Text Field'),
      })

      await expect(disabledFieldOption).toBeHidden()
    })

    test('should render hidden input for admin.hidden fields', async () => {
      await page.goto(url.create)
      await expect(page.locator('#field-adminHiddenTextField')).toHaveAttribute('type', 'hidden')
      await page.goto(url.list)
      await expect(page.locator('.cell-adminHiddenTextField').first()).toBeVisible()
      await expect(page.locator('#heading-adminHiddenTextField')).toBeVisible()

      const { columnContainer } = await openListColumns(page, {})

      await expect(
        columnContainer.locator('.pill-selector__pill', {
          hasText: exactText('Admin Hidden Text Field'),
        }),
      ).toBeVisible()

      await selectTableRow(page, 'Seeded text document')
      await page.locator('.edit-many__toggle').click()
      await page.locator('.field-select .rs__control').click()

      const adminHiddenFieldOption = page.locator('.rs__option', {
        hasText: exactText('Admin Hidden Text Field'),
      })

      await expect(adminHiddenFieldOption).toBeVisible()
    })
  })

  test('should display field in list view', async () => {
    await page.goto(url.list)
    const textCell = page.locator('.row-1 .cell-text')
    await expect(textCell).toHaveText(textareaDoc.text)
  })

  test('should respect admin.disableListColumn despite preferences', async () => {
    await upsertPreferences<Config, GeneratedTypes<any>>({
      payload,
      user: client.user,
      key: 'text-fields-list',
      value: {
        columns: [
          {
            accessor: 'disableListColumnText',
            active: true,
          },
        ],
      },
    })

    await page.goto(url.list)
    await openListColumns(page, {})
    await expect(
      page.locator(`.pill-selector .pill-selector__pill`, {
        hasText: exactText('Disable List Column Text'),
      }),
    ).toBeHidden()

    await expect(page.locator('#heading-disableListColumnText')).toBeHidden()
    await expect(page.locator('table .row-1 .cell-disableListColumnText')).toBeHidden()
  })

  test('should display i18n label in cells when missing field data', async () => {
    await page.goto(url.list)
    await page.waitForURL(new RegExp(`${url.list}.*\\?.*`))

    await toggleColumn(page, {
      targetState: 'on',
      columnLabel: 'Text en',
      columnName: 'i18nText',
    })

    const textCell = page.locator('.row-1 .cell-i18nText')

    await expect(textCell).toHaveText('<No Text en>')
  })

  test('should show i18n label', async () => {
    await page.goto(url.create)

    await expect(page.locator('label[for="field-i18nText"]')).toHaveText('Text en')
  })

  test('should show i18n placeholder', async () => {
    await page.goto(url.create)
    await expect(page.locator('#field-i18nText')).toHaveAttribute('placeholder', 'en placeholder')
  })

  test('should show i18n descriptions', async () => {
    await page.goto(url.create)
    const description = page.locator('.field-description-i18nText')
    await expect(description).toHaveText('en description')
  })

  describe('A11y', () => {
    test('Edit view should have no accessibility violations', async ({}, testInfo) => {
      await page.goto(url.create)
      await page.locator('#field-text').waitFor()

      const scanResults = await runAxeScan({
        page,
        testInfo,
        include: ['.document-fields__main'],
        exclude: ['.field-description'], // known issue - reported elsewhere @todo: remove this once fixed - see report https://github.com/payloadcms/payload/discussions/14489
      })

      expect(scanResults.violations.length).toBe(0)
    })

    test('Textarea inputs have focus indicators', async ({}, testInfo) => {
      await page.goto(url.create)
      await page.locator('#field-text').waitFor()

      const scanResults = await checkFocusIndicators({
        page,
        testInfo,
        selector: '.document-fields__main',
      })

      expect(scanResults.totalFocusableElements).toBeGreaterThan(0)
      expect(scanResults.elementsWithoutIndicators).toBe(0)
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/fields/collections/Textarea/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { defaultText, textareaFieldsSlug } from './shared.js'

const TextareaFields: CollectionConfig = {
  slug: textareaFieldsSlug,
  admin: {
    useAsTitle: 'text',
  },
  defaultSort: 'id',
  fields: [
    {
      name: 'text',
      type: 'textarea',
      required: true,
      hooks: {
        beforeDuplicate: [({ value }) => `${value} - duplicate`],
      },
    },
    {
      name: 'hiddenTextField',
      type: 'textarea',
      hidden: true,
    },
    {
      name: 'adminHiddenTextField',
      type: 'textarea',
      admin: {
        hidden: true,
        description: 'This field should be hidden',
      },
    },
    {
      name: 'disabledTextField',
      type: 'textarea',
      admin: {
        disabled: true,
        description: 'This field should be disabled',
      },
    },
    {
      name: 'localizedText',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'i18nText',
      type: 'textarea',
      admin: {
        description: {
          en: 'en description',
          es: 'es description',
        },
        placeholder: {
          en: 'en placeholder',
          es: 'es placeholder',
        },
      },
      label: {
        en: 'Text en',
        es: 'Text es',
      },
    },
    {
      name: 'defaultString',
      type: 'textarea',
      defaultValue: defaultText,
    },
    {
      name: 'defaultEmptyString',
      type: 'textarea',
      defaultValue: '',
    },
    {
      name: 'defaultFunction',
      type: 'textarea',
      defaultValue: () => defaultText,
    },
    {
      name: 'defaultAsync',
      type: 'textarea',
      defaultValue: async (): Promise<string> => {
        return new Promise((resolve) =>
          setTimeout(() => {
            resolve(defaultText)
          }, 1),
        )
      },
    },
    {
      name: 'overrideLength',
      type: 'textarea',
      label: 'Override the 40k text length default',
      maxLength: 50000,
    },
    {
      name: 'fieldWithDefaultValue',
      type: 'textarea',
      defaultValue: async () => {
        const defaultValue = new Promise((resolve) => setTimeout(() => resolve('some-value'), 1000))

        return defaultValue
      },
    },
    {
      name: 'dependentOnFieldWithDefaultValue',
      type: 'textarea',
      hooks: {
        beforeChange: [
          ({ data }) => {
            return data?.fieldWithDefaultValue || ''
          },
        ],
      },
    },
    {
      name: 'defaultValueFromReq',
      type: 'textarea',
      defaultValue: async ({ req }) => {
        return Promise.resolve(req.context.defaultValue)
      },
    },
  ],
}

export default TextareaFields
```

--------------------------------------------------------------------------------

---[FILE: shared.ts]---
Location: payload-main/test/fields/collections/Textarea/shared.ts

```typescript
import type { RequiredDataFromCollection } from 'payload'

import type { TextareaField } from '../../payload-types.js'

export const defaultText = 'default-text'
export const textareaFieldsSlug = 'textarea-fields'

export const textareaDoc: RequiredDataFromCollection<TextareaField> = {
  text: 'Seeded text document',
  localizedText: 'Localized text',
}

export const anotherTextareaDoc: RequiredDataFromCollection<TextareaField> = {
  text: 'Another text document',
}
```

--------------------------------------------------------------------------------

---[FILE: e2e.spec.ts]---
Location: payload-main/test/fields/collections/UI/e2e.spec.ts

```typescript
import type { Page } from '@playwright/test'

import { expect, test } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

import type { PayloadTestSDK } from '../../../helpers/sdk/index.js'
import type { Config } from '../../payload-types.js'

import { ensureCompilationIsDone, initPageConsoleErrorCatch } from '../../../helpers.js'
import { AdminUrlUtil } from '../../../helpers/adminUrlUtil.js'
import { initPayloadE2ENoConfig } from '../../../helpers/initPayloadE2ENoConfig.js'
import { reInitializeDB } from '../../../helpers/reInitializeDB.js'
import { RESTClient } from '../../../helpers/rest.js'
import { TEST_TIMEOUT_LONG } from '../../../playwright.config.js'
import { uiSlug } from '../../slugs.js'

const filename = fileURLToPath(import.meta.url)
const currentFolder = path.dirname(filename)
const dirname = path.resolve(currentFolder, '../../')

const { beforeAll, beforeEach, describe } = test

let payload: PayloadTestSDK<Config>
let client: RESTClient
let page: Page
let serverURL: string
let url: AdminUrlUtil

describe('Radio', () => {
  beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)
    process.env.SEED_IN_CONFIG_ONINIT = 'false' // Makes it so the payload config onInit seed is not run. Otherwise, the seed would be run unnecessarily twice for the initial test run - once for beforeEach and once for onInit
    ;({ payload, serverURL } = await initPayloadE2ENoConfig<Config>({
      dirname,
      // prebuild,
    }))

    url = new AdminUrlUtil(serverURL, uiSlug)

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

  test('should show custom: client configuration', async () => {
    await page.goto(url.create)

    const uiField = page.locator('#uiCustomClient')

    await expect(uiField).toBeVisible()
    await expect(uiField).toContainText('client-side-configuration')
  })
})
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/fields/collections/UI/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { uiFieldsSlug } from './shared.js'

const UIFields: CollectionConfig = {
  slug: uiFieldsSlug,
  admin: {
    useAsTitle: 'text',
    custom: {
      'new-value': 'client available',
    },
  },
  custom: {
    'new-server-value': 'only available on server',
  },
  defaultSort: 'id',
  fields: [
    {
      name: 'text',
      type: 'text',
      required: true,
    },
    {
      type: 'ui',
      name: 'uiCustomClient',
      admin: {
        components: {
          Field: '/collections/UI/UICustomClient.js#UICustomClient',
        },
        custom: {
          customValue: `client-side-configuration`,
        },
      },
      custom: {
        server: {
          serverOnly: 'string',
        },
      },
    },
  ],
}

export default UIFields
```

--------------------------------------------------------------------------------

---[FILE: shared.ts]---
Location: payload-main/test/fields/collections/UI/shared.ts

```typescript
export const defaultText = 'default-text'
export const uiFieldsSlug = 'ui-fields'
```

--------------------------------------------------------------------------------

---[FILE: UICustomClient.tsx]---
Location: payload-main/test/fields/collections/UI/UICustomClient.tsx
Signals: React

```typescript
'use client'
import type { TextFieldClientComponent } from 'payload'

import React from 'react'

export const UICustomClient: TextFieldClientComponent = ({
  field: {
    name,
    admin: { custom },
  },
}) => {
  return <div id={name}>{custom?.customValue}</div>
}
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/test/fields/collections/Upload/.gitignore

```text
uploads
```

--------------------------------------------------------------------------------

````
