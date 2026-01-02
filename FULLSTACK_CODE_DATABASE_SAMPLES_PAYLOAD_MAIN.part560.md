---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 560
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 560 of 695)

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
Location: payload-main/test/fields/collections/JSON/e2e.spec.ts

```typescript
import type { Page } from '@playwright/test'

import { expect, test } from '@playwright/test'
import { runAxeScan } from 'helpers/e2e/runAxeScan.js'
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
import { POLL_TOPASS_TIMEOUT, TEST_TIMEOUT_LONG } from '../../../playwright.config.js'
import { jsonFieldsSlug } from '../../slugs.js'
import { jsonDoc } from './shared.js'

const filename = fileURLToPath(import.meta.url)
const currentFolder = path.dirname(filename)
const dirname = path.resolve(currentFolder, '../../')

const { beforeAll, beforeEach, describe } = test

let payload: PayloadTestSDK<Config>
let client: RESTClient
let page: Page
let serverURL: string
let url: AdminUrlUtil

describe('JSON', () => {
  beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)
    process.env.SEED_IN_CONFIG_ONINIT = 'false' // Makes it so the payload config onInit seed is not run. Otherwise, the seed would be run unnecessarily twice for the initial test run - once for beforeEach and once for onInit
    ;({ payload, serverURL } = await initPayloadE2ENoConfig<Config>({
      dirname,
      // prebuild,
    }))

    url = new AdminUrlUtil(serverURL, jsonFieldsSlug)

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

  test('should display field in list view', async () => {
    await page.goto(url.list)
    const jsonCell = page.locator('.row-1 .cell-json')
    await expect(jsonCell).toHaveText(JSON.stringify(jsonDoc.json))
  })

  test('should create', async () => {
    const input = '{"foo": "bar"}'
    await page.goto(url.create)
    const jsonCodeEditor = page.locator('.json-field .code-editor').first()
    await expect(() => expect(jsonCodeEditor).toBeVisible()).toPass({
      timeout: POLL_TOPASS_TIMEOUT,
    })
    const jsonFieldInputArea = page.locator('.json-field .inputarea').first()
    await jsonFieldInputArea.fill(input)

    await saveDocAndAssert(page)
    const jsonField = page.locator('.json-field').first()
    await expect(jsonField).toContainText('"foo": "bar"')
  })

  test('should not unflatten json field containing keys with dots', async () => {
    const input = '{"foo.with.periods": "bar"}'

    await page.goto(url.create)
    const jsonCodeEditor = page.locator('.group-field .json-field .code-editor').first()
    await expect(() => expect(jsonCodeEditor).toBeVisible()).toPass({
      timeout: POLL_TOPASS_TIMEOUT,
    })
    const json = page.locator('.group-field .json-field .inputarea')
    await json.fill(input)

    await saveDocAndAssert(page, '.form-submit button')
    await expect(page.locator('.group-field .json-field')).toContainText(
      '"foo.with.periods": "bar"',
    )
  })

  test('should save field with "target" property', async () => {
    const input = '{"target": "foo"}'
    await page.goto(url.create)
    const jsonCodeEditor = page.locator('.json-field .code-editor').first()
    await expect(() => expect(jsonCodeEditor).toBeVisible()).toPass({
      timeout: POLL_TOPASS_TIMEOUT,
    })
    const jsonFieldInputArea = page.locator('.json-field .inputarea').first()
    await jsonFieldInputArea.fill(input)

    await saveDocAndAssert(page)
    const jsonField = page.locator('.json-field').first()
    await expect(jsonField).toContainText('"target": "foo"')
  })

  test('should update', async () => {
    const createdDoc = await payload.create({
      collection: 'json-fields',
      data: {
        customJSON: {
          default: 'value',
        },
      },
    })

    await page.goto(url.edit(createdDoc.id))
    const jsonField = page.locator('.json-field:not(.read-only) #field-customJSON')
    await expect(jsonField).toContainText('"default": "value"')

    const boundingBox = await page
      .locator('.json-field:not(.read-only) #field-customJSON')
      .boundingBox()
    await expect(() => expect(boundingBox).not.toBeNull()).toPass()
    const originalHeight = boundingBox!.height

    // click the button to set custom JSON
    await page.locator('#set-custom-json').click({ delay: 1000 })

    const newBoundingBox = await page
      .locator('.json-field:not(.read-only) #field-customJSON')
      .boundingBox()
    await expect(() => expect(newBoundingBox).not.toBeNull()).toPass()
    const newHeight = newBoundingBox!.height

    await expect(() => {
      expect(newHeight).toBeGreaterThan(originalHeight)
    }).toPass()
  })

  describe('A11y', () => {
    test('Edit view should have no accessibility violations', async ({}, testInfo) => {
      await page.goto(url.create)
      await page.locator('#field-json').waitFor()

      const scanResults = await runAxeScan({
        page,
        testInfo,
        include: ['.document-fields__main'],
      })

      expect(scanResults.violations.length).toBe(0)
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/fields/collections/JSON/index.tsx

```typescript
import type { CollectionConfig } from 'payload'

import { jsonFieldsSlug } from '../../slugs.js'

const JSON: CollectionConfig = {
  slug: jsonFieldsSlug,
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'json',
      type: 'json',
      admin: {
        maxHeight: 542,
      },
      jsonSchema: {
        fileMatch: ['a://b/foo.json'],
        schema: {
          type: 'object',
          properties: {
            array: {
              type: 'array',
              items: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  object: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      array: {
                        type: 'array',
                        items: {
                          type: 'number',
                        },
                      },
                      text: {
                        type: 'string',
                      },
                    },
                  },
                  text: {
                    type: 'string',
                  },
                },
              },
            },
            foo: {
              enum: ['bar', 'foobar'],
            },
            number: {
              enum: [10, 5],
            },
          },
        },
        uri: 'a://b/foo.json',
      },
    },
    {
      name: 'group',
      type: 'group',
      fields: [
        {
          name: 'jsonWithinGroup',
          type: 'json',
        },
      ],
    },
    {
      name: 'customJSON',
      type: 'json',
      admin: {
        components: {
          afterInput: ['./collections/JSON/AfterField.js#AfterField'],
        },
      },
      label: 'Custom Json',
    },
  ],
  versions: {
    maxPerDoc: 1,
  },
}

export default JSON
```

--------------------------------------------------------------------------------

---[FILE: shared.ts]---
Location: payload-main/test/fields/collections/JSON/shared.ts

```typescript
import type { JsonField } from '../../payload-types.js'

export const jsonDoc: Partial<JsonField> = {
  json: {
    arr: ['val1', 'val2', 'val3'],
    nested: {
      value: 'nested value',
    },
    property: 'value',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: e2e.spec.ts]---
Location: payload-main/test/fields/collections/Number/e2e.spec.ts

```typescript
import type { Page } from '@playwright/test'

import { expect, test } from '@playwright/test'
import { checkFocusIndicators } from 'helpers/e2e/checkFocusIndicators.js'
import { addListFilter } from 'helpers/e2e/filters/index.js'
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
} from '../../../helpers.js'
import { AdminUrlUtil } from '../../../helpers/adminUrlUtil.js'
import { assertToastErrors } from '../../../helpers/assertToastErrors.js'
import { initPayloadE2ENoConfig } from '../../../helpers/initPayloadE2ENoConfig.js'
import { reInitializeDB } from '../../../helpers/reInitializeDB.js'
import { RESTClient } from '../../../helpers/rest.js'
import { TEST_TIMEOUT_LONG } from '../../../playwright.config.js'
import { numberDoc } from './shared.js'

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

describe('Number', () => {
  beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)
    process.env.SEED_IN_CONFIG_ONINIT = 'false' // Makes it so the payload config onInit seed is not run. Otherwise, the seed would be run unnecessarily twice for the initial test run - once for beforeEach and once for onInit
    ;({ payload, serverURL } = await initPayloadE2ENoConfig<Config>({
      dirname,
      // prebuild,
    }))
    url = new AdminUrlUtil(serverURL, 'number-fields')

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

  test('should display field in list view', async () => {
    await page.goto(url.list)
    const textCell = page.locator('.row-1 .cell-number')
    await expect(textCell).toHaveText(String(numberDoc.number))
  })

  test('should filter Number fields in the collection view - greaterThanOrEqual', async () => {
    await page.goto(url.list)
    await expect(page.locator('table >> tbody >> tr')).toHaveCount(3)

    await addListFilter({
      page,
      fieldLabel: 'Number',
      operatorLabel: 'is greater than or equal to',
      value: '3',
    })

    await wait(300)
    await expect(page.locator('table >> tbody >> tr')).toHaveCount(2)
  })

  test('should filter Number field hasMany: false in the collection view - in', async () => {
    await page.goto(url.list)
    await expect(page.locator('table >> tbody >> tr')).toHaveCount(3)

    await addListFilter({
      page,
      fieldLabel: 'Number',
      operatorLabel: 'is in',
      value: '2',
    })

    await wait(300)
    await expect(page.locator('table >> tbody >> tr')).toHaveCount(1)
  })

  test('should filter Number field hasMany: false in the collection view - is not in', async () => {
    await page.goto(url.list)
    await expect(page.locator('table >> tbody >> tr')).toHaveCount(3)

    await addListFilter({
      page,
      fieldLabel: 'Number',
      operatorLabel: 'is not in',
      value: '2',
    })

    await wait(300)
    await expect(page.locator('table >> tbody >> tr')).toHaveCount(2)
  })

  test('should filter Number field hasMany: true in the collection view - in', async () => {
    await page.goto(url.list)
    await expect(page.locator('table >> tbody >> tr')).toHaveCount(3)

    await addListFilter({
      page,
      fieldLabel: 'Has Many',
      operatorLabel: 'is in',
      value: '5',
    })

    await wait(300)
    await expect(page.locator('table >> tbody >> tr')).toHaveCount(1)
  })

  test('should filter Number field hasMany: true in the collection view - is not in', async () => {
    await page.goto(url.list)
    await expect(page.locator('table >> tbody >> tr')).toHaveCount(3)

    await addListFilter({
      page,
      fieldLabel: 'Has Many',
      operatorLabel: 'is not in',
      value: '6',
    })

    await wait(300)
    await expect(page.locator('table >> tbody >> tr')).toHaveCount(3)
  })

  test('should create', async () => {
    const input = 5
    await page.goto(url.create)
    const field = page.locator('#field-number')
    await field.fill(String(input))
    await saveDocAndAssert(page)
    await expect(field).toHaveValue(String(input))
  })

  test('should create hasMany', async () => {
    const input = 5
    await page.goto(url.create)
    const field = page.locator('.field-hasMany')
    await field.click()
    await page.keyboard.type(String(input))
    await page.keyboard.press('Enter')
    await saveDocAndAssert(page)
    await expect(field.locator('.rs__value-container')).toContainText(String(input))
  })

  test('should bypass min rows validation when no rows present and field is not required', async () => {
    await page.goto(url.create)
    await saveDocAndAssert(page)
  })

  test('should fail min rows validation when rows are present', async () => {
    const input = 5
    await page.goto(url.create)
    await page.locator('.field-withMinRows').click()
    await page.keyboard.type(String(input))
    await page.keyboard.press('Enter')
    await page.click('#action-save', { delay: 100 })
    await assertToastErrors({
      page,
      errors: ['With Min Rows'],
    })
  })

  test('should keep data removed on save if deleted', async () => {
    const input = 1
    await page.goto(url.create)
    const field = page.locator('#field-number')
    await field.fill(String(input))
    await saveDocAndAssert(page)
    await expect(field).toHaveValue(String(input))
    await field.fill('')
    await saveDocAndAssert(page)
    await expect(field).toHaveValue('')
  })

  describe('A11y', () => {
    // This test should pass once select element issues are resolved @todo: re-enable this test
    test.fixme('Edit view should have no accessibility violations', async ({}, testInfo) => {
      await page.goto(url.create)
      await page.locator('#field-number').waitFor()

      const scanResults = await runAxeScan({
        page,
        testInfo,
        include: ['.document-fields__main'],
        exclude: ['.field-description'], // known issue - reported elsewhere @todo: remove this once fixed - see report https://github.com/payloadcms/payload/discussions/14489
      })

      expect(scanResults.violations.length).toBe(0)
    })

    // Equally, test is caught up on select issues @todo: re-enable this test when possible
    test.fixme('Number inputs have focus indicators', async ({}, testInfo) => {
      await page.goto(url.create)
      await page.locator('#field-number').waitFor()

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
Location: payload-main/test/fields/collections/Number/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { numberFieldsSlug } from '../../slugs.js'

export const defaultNumber = 5

const NumberFields: CollectionConfig = {
  slug: numberFieldsSlug,
  admin: {
    useAsTitle: 'number',
  },
  fields: [
    {
      name: 'number',
      type: 'number',
    },
    {
      name: 'min',
      type: 'number',
      min: 10,
    },
    {
      name: 'max',
      type: 'number',
      max: 10,
    },
    {
      name: 'positiveNumber',
      type: 'number',
      min: 0,
    },
    {
      name: 'negativeNumber',
      type: 'number',
      max: 0,
    },
    {
      name: 'decimalMin',
      type: 'number',
      min: 0.5,
    },
    {
      name: 'decimalMax',
      type: 'number',
      max: 0.5,
    },
    {
      name: 'defaultNumber',
      type: 'number',
      defaultValue: defaultNumber,
    },
    {
      name: 'hasMany',
      type: 'number',
      hasMany: true,
      min: 5,
      max: 100,
    },
    {
      name: 'validatesHasMany',
      type: 'number',
      hasMany: true,
      validate: (value) => {
        if (value && !Array.isArray(value)) {
          return 'value should be an array'
        }
        return true
      },
    },
    {
      name: 'localizedHasMany',
      type: 'number',
      hasMany: true,
      localized: true,
    },
    {
      name: 'withMinRows',
      type: 'number',
      hasMany: true,
      minRows: 2,
    },
    {
      name: 'array',
      type: 'array',
      fields: [
        {
          name: 'numbers',
          type: 'number',
          hasMany: true,
        },
      ],
    },
    {
      name: 'blocks',
      type: 'blocks',
      blocks: [
        {
          slug: 'blockWithNumber',
          fields: [
            {
              name: 'numbers',
              type: 'number',
              hasMany: true,
            },
          ],
        },
      ],
    },
  ],
}

export default NumberFields
```

--------------------------------------------------------------------------------

---[FILE: shared.ts]---
Location: payload-main/test/fields/collections/Number/shared.ts

```typescript
import type { NumberField } from '../../payload-types.js'

export const numberDoc: Partial<NumberField> = {
  number: 5,
  min: 15,
  max: 5,
  positiveNumber: 5,
  negativeNumber: -5,
  decimalMin: 1.25,
  decimalMax: 0.25,
  hasMany: [5, 10, 15],
  validatesHasMany: [5],
  localizedHasMany: [10],
  withMinRows: [5, 10],
}
```

--------------------------------------------------------------------------------

---[FILE: e2e.spec.ts]---
Location: payload-main/test/fields/collections/Point/e2e.spec.ts

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
  ensureCompilationIsDone,
  initPageConsoleErrorCatch,
  saveDocAndAssert,
} from '../../../helpers.js'
import { AdminUrlUtil } from '../../../helpers/adminUrlUtil.js'
import { initPayloadE2ENoConfig } from '../../../helpers/initPayloadE2ENoConfig.js'
import { reInitializeDB } from '../../../helpers/reInitializeDB.js'
import { RESTClient } from '../../../helpers/rest.js'
import { TEST_TIMEOUT_LONG } from '../../../playwright.config.js'
import { pointFieldsSlug } from '../../slugs.js'

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
let filledGroupPoint
let emptyGroupPoint
describe('Point', () => {
  beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)
    process.env.SEED_IN_CONFIG_ONINIT = 'false' // Makes it so the payload config onInit seed is not run. Otherwise, the seed would be run unnecessarily twice for the initial test run - once for beforeEach and once for onInit
    ;({ payload, serverURL } = await initPayloadE2ENoConfig<Config>({
      dirname,
      // prebuild,
    }))
    url = new AdminUrlUtil(serverURL, pointFieldsSlug)

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

    filledGroupPoint = await payload.create({
      collection: pointFieldsSlug,
      data: {
        group: { point: [4, 2] },
        localized: [4, 2],
        point: [5, 5],
      },
    })
    emptyGroupPoint = await payload.create({
      collection: pointFieldsSlug,
      data: {
        group: {},
        localized: [3, -2],
        point: [5, 5],
      },
    })
  })

  test('should save point', async () => {
    await page.goto(url.create)
    const longField = page.locator('#field-longitude-point')
    await longField.fill('9')

    const latField = page.locator('#field-latitude-point')
    await latField.fill('-2')

    const localizedLongField = page.locator('#field-longitude-localized')
    await localizedLongField.fill('1')

    const localizedLatField = page.locator('#field-latitude-localized')
    await localizedLatField.fill('-1')

    const groupLongitude = page.locator('#field-longitude-group__point')
    await groupLongitude.fill('3')

    const groupLatField = page.locator('#field-latitude-group__point')
    await groupLatField.fill('-8')

    await saveDocAndAssert(page)
    await expect(longField).toHaveAttribute('value', '9')
    await expect(latField).toHaveAttribute('value', '-2')
    await expect(localizedLongField).toHaveAttribute('value', '1')
    await expect(localizedLatField).toHaveAttribute('value', '-1')
    await expect(groupLongitude).toHaveAttribute('value', '3')
    await expect(groupLatField).toHaveAttribute('value', '-8')
  })

  test('should update point', async () => {
    await page.goto(url.edit(emptyGroupPoint.id))
    const longField = page.locator('#field-longitude-point')
    await longField.fill('9')

    const latField = page.locator('#field-latitude-point')
    await latField.fill('-2')

    const localizedLongField = page.locator('#field-longitude-localized')
    await localizedLongField.fill('2')

    const localizedLatField = page.locator('#field-latitude-localized')
    await localizedLatField.fill('-2')

    const groupLongitude = page.locator('#field-longitude-group__point')
    await groupLongitude.fill('3')

    const groupLatField = page.locator('#field-latitude-group__point')
    await groupLatField.fill('-8')

    await saveDocAndAssert(page)

    await expect(longField).toHaveAttribute('value', '9')
    await expect(latField).toHaveAttribute('value', '-2')
    await expect(localizedLongField).toHaveAttribute('value', '2')
    await expect(localizedLatField).toHaveAttribute('value', '-2')
    await expect(groupLongitude).toHaveAttribute('value', '3')
    await expect(groupLatField).toHaveAttribute('value', '-8')
  })

  test('should be able to clear a value point', async () => {
    await page.goto(url.edit(filledGroupPoint.id))

    const groupLongitude = page.locator('#field-longitude-group__point')
    await groupLongitude.fill('')

    const groupLatField = page.locator('#field-latitude-group__point')
    await groupLatField.fill('')

    await saveDocAndAssert(page)

    await expect(groupLongitude).toHaveAttribute('value', '')
    await expect(groupLatField).toHaveAttribute('value', '')
  })

  describe('A11y', () => {
    test.fixme('Edit view should have no accessibility violations', async ({}, testInfo) => {
      await page.goto(url.create)
      await page.locator('#field-longitude-point').waitFor()

      const scanResults = await runAxeScan({
        page,
        testInfo,
        include: ['.document-fields__main'],
      })

      expect(scanResults.violations.length).toBe(0)
    })

    test('Point inputs have focus indicators', async ({}, testInfo) => {
      await page.goto(url.create)
      await page.locator('#field-longitude-point').waitFor()

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
Location: payload-main/test/fields/collections/Point/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { pointFieldsSlug } from '../../slugs.js'

const PointFields: CollectionConfig = {
  slug: pointFieldsSlug,
  admin: {
    useAsTitle: 'point',
  },
  versions: true,
  fields: [
    {
      name: 'point',
      type: 'point',
      label: 'Location',
      required: true,
    },
    {
      name: 'camelCasePoint',
      type: 'point',
    },
    {
      name: 'localized',
      type: 'point',
      label: 'Localized Point',
      unique: true,
      localized: true,
    },
    {
      type: 'group',
      name: 'group',
      fields: [
        {
          name: 'point',
          type: 'point',
        },
      ],
    },
  ],
}

export default PointFields
```

--------------------------------------------------------------------------------

---[FILE: shared.ts]---
Location: payload-main/test/fields/collections/Point/shared.ts

```typescript
import type { PointField } from '../../payload-types.js'

export const pointDoc: Partial<PointField> = {
  point: [7, -7],
  localized: [15, -12],
  group: { point: [1, 9] },
}
```

--------------------------------------------------------------------------------

---[FILE: CustomJSXLabel.tsx]---
Location: payload-main/test/fields/collections/Radio/CustomJSXLabel.tsx

```typescript
export const CustomJSXLabel = () => {
  return (
    <svg
      className="graphic-icon"
      height="20px"
      id="payload-logo"
      viewBox="0 0 25 25"
      width="20px"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.8673 21.2336L4.40922 16.9845C4.31871 16.9309 4.25837 16.8355 4.25837 16.7282V10.1609C4.25837 10.0477 4.38508 9.97616 4.48162 10.0298L13.1404 14.9642C13.2611 15.0358 13.412 14.9464 13.412 14.8093V11.6091C13.412 11.4839 13.3456 11.3647 13.2309 11.2992L2.81624 5.36353C2.72573 5.30989 2.60505 5.30989 2.51454 5.36353L1.15085 6.14422C1.06034 6.19786 1 6.29321 1 6.40048V18.5995C1 18.7068 1.06034 18.8021 1.15085 18.8558L11.8491 24.9583C11.9397 25.0119 12.0603 25.0119 12.1509 24.9583L21.1355 19.8331C21.2562 19.7616 21.2562 19.5948 21.1355 19.5232L18.3357 17.9261C18.2211 17.8605 18.0883 17.8605 17.9737 17.9261L12.175 21.2336C12.0845 21.2872 11.9638 21.2872 11.8733 21.2336H11.8673Z"
        fill="var(--theme-elevation-1000)"
      />
      <path
        d="M22.8491 6.13827L12.1508 0.0417218C12.0603 -0.0119135 11.9397 -0.0119135 11.8491 0.0417218L6.19528 3.2658C6.0746 3.33731 6.0746 3.50418 6.19528 3.57569L8.97092 5.16091C9.08557 5.22647 9.21832 5.22647 9.33296 5.16091L11.8672 3.71872C11.9578 3.66508 12.0784 3.66508 12.1689 3.71872L19.627 7.96782C19.7175 8.02146 19.7778 8.11681 19.7778 8.22408V14.8212C19.7778 14.9464 19.8442 15.0656 19.9589 15.1311L22.7345 16.7104C22.8552 16.7819 23.006 16.6925 23.006 16.5554V6.40048C23.006 6.29321 22.9457 6.19786 22.8552 6.14423L22.8491 6.13827Z"
        fill="var(--theme-elevation-1000)"
      />
    </svg>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: e2e.spec.ts]---
Location: payload-main/test/fields/collections/Radio/e2e.spec.ts

```typescript
import type { Page } from '@playwright/test'

import { expect, test } from '@playwright/test'
import { checkFocusIndicators } from 'helpers/e2e/checkFocusIndicators.js'
import { runAxeScan } from 'helpers/e2e/runAxeScan.js'
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
import { radioFieldsSlug } from '../../slugs.js'

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

    url = new AdminUrlUtil(serverURL, radioFieldsSlug)

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

  test('should show i18n label in list', async () => {
    await page.goto(url.list)
    await expect(page.locator('.cell-radio')).toHaveText('Value One')
  })

  test('should show i18n label while editing', async () => {
    await page.goto(url.create)
    await expect(page.locator('label[for="field-radio"]')).toHaveText('Radio en')
  })

  test('should show i18n radio labels', async () => {
    await page.goto(url.create)
    await expect(page.locator('label[for="field-radio-one"] .radio-input__label')).toHaveText(
      'Value One',
    )
  })

  test('should show custom JSX label in list', async () => {
    await page.goto(url.list)
    await expect(page.locator('.cell-radioWithJsxLabelOption svg#payload-logo')).toBeVisible()
  })

  test('should show custom JSX label while editing', async () => {
    await page.goto(url.create)
    await expect(
      page.locator('label[for="field-radioWithJsxLabelOption-three"] svg#payload-logo'),
    ).toBeVisible()
  })

  describe('A11y', () => {
    test('Edit view should have no accessibility violations', async ({}, testInfo) => {
      await page.goto(url.create)
      await page.locator('#field-radio').waitFor()

      const scanResults = await runAxeScan({
        page,
        testInfo,
        include: ['.document-fields__main'],
      })

      // On this page there's a known custom label without a clear name, expect 1 violation
      expect(scanResults.violations.length).toBe(1)
    })

    test('Radio inputs have focus indicators', async ({}, testInfo) => {
      await page.goto(url.create)
      await page.locator('#field-radio').waitFor()

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
Location: payload-main/test/fields/collections/Radio/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { radioFieldsSlug } from '../../slugs.js'
import { CustomJSXLabel } from './CustomJSXLabel.js'

const RadioFields: CollectionConfig = {
  slug: radioFieldsSlug,
  fields: [
    {
      name: 'radio',
      label: {
        en: 'Radio en',
        es: 'Radio es',
      },
      type: 'radio',
      options: [
        {
          label: { en: 'Value One', es: 'Value Uno' },
          value: 'one',
        },
        {
          label: 'Value Two',
          value: 'two',
        },
        {
          label: 'Value Three',
          value: 'three',
        },
      ],
    },
    {
      name: 'radioWithJsxLabelOption',
      label: 'Radio with JSX label option',
      type: 'radio',
      defaultValue: 'three',
      options: [
        {
          label: 'Value One',
          value: 'one',
        },
        {
          label: 'Value Two',
          value: 'two',
        },
        {
          label: CustomJSXLabel,
          value: 'three',
        },
      ],
    },
  ],
}

export default RadioFields
```

--------------------------------------------------------------------------------

---[FILE: shared.ts]---
Location: payload-main/test/fields/collections/Radio/shared.ts

```typescript
import type { RadioField } from '../../payload-types.js'

export const radiosDoc: Partial<RadioField> = {
  radio: 'one',
}
```

--------------------------------------------------------------------------------

````
