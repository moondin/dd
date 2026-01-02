---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 557
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 557 of 695)

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
Location: payload-main/test/fields/collections/ConditionalLogic/e2e.spec.ts

```typescript
import type { BrowserContext, Page } from '@playwright/test'

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
  // throttleTest,
} from '../../../helpers.js'
import { AdminUrlUtil } from '../../../helpers/adminUrlUtil.js'
import { assertNetworkRequests } from '../../../helpers/e2e/assertNetworkRequests.js'
import { initPayloadE2ENoConfig } from '../../../helpers/initPayloadE2ENoConfig.js'
import { reInitializeDB } from '../../../helpers/reInitializeDB.js'
import { RESTClient } from '../../../helpers/rest.js'
import { TEST_TIMEOUT_LONG } from '../../../playwright.config.js'
import { conditionalLogicSlug } from '../../slugs.js'

const filename = fileURLToPath(import.meta.url)
const currentFolder = path.dirname(filename)
const dirname = path.resolve(currentFolder, '../../')

const { beforeAll, beforeEach, describe } = test

let payload: PayloadTestSDK<Config>
let client: RESTClient
let page: Page
let serverURL: string
let url: AdminUrlUtil
let context: BrowserContext

const toggleConditionAndCheckField = async (toggleLocator: string, fieldLocator: string) => {
  const toggle = page.locator(toggleLocator)

  if (!(await toggle.isChecked())) {
    await expect(page.locator(fieldLocator)).toBeHidden()
    await toggle.click()
    await expect(page.locator(fieldLocator)).toBeVisible()
  } else {
    await expect(page.locator(fieldLocator)).toBeVisible()
    await toggle.click()
    await expect(page.locator(fieldLocator)).toBeHidden()
  }
}

describe('Conditional Logic', () => {
  beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)
    process.env.SEED_IN_CONFIG_ONINIT = 'false' // Makes it so the payload config onInit seed is not run. Otherwise, the seed would be run unnecessarily twice for the initial test run - once for beforeEach and once for onInit
    ;({ payload, serverURL } = await initPayloadE2ENoConfig<Config>({
      dirname,
      // prebuild,
    }))

    url = new AdminUrlUtil(serverURL, conditionalLogicSlug)

    context = await browser.newContext()
    page = await context.newPage()
    initPageConsoleErrorCatch(page)

    await ensureCompilationIsDone({ page, serverURL })
  })

  beforeEach(async () => {
    // await throttleTest({
    //   page,
    //   context,
    //   delay: 'Fast 4G',
    // })

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

  test("should conditionally render field based on another field's data", async () => {
    await page.goto(url.create)

    await toggleConditionAndCheckField(
      'label[for=field-toggleField]',
      'label[for=field-fieldWithCondition]',
    )

    expect(true).toBe(true)
  })

  test('ensure conditions receive document ID during form state request', async () => {
    await page.goto(url.create)

    const fieldOnlyVisibleIfNoID = page.locator('#field-fieldWithDocIDCondition')

    await expect(fieldOnlyVisibleIfNoID).toBeVisible()

    const textField = page.locator('#field-text')
    await assertNetworkRequests(
      page,
      '/admin/collections/conditional-logic',
      async () => {
        await textField.fill('some text')
      },
      {
        minimumNumberOfRequests: 1,
      },
    )

    await assertNetworkRequests(
      page,
      '/api/conditional-logic',
      async () => {
        await saveDocAndAssert(page)
      },
      {
        minimumNumberOfRequests: 1,
      },
    )

    await expect(fieldOnlyVisibleIfNoID).toBeHidden()

    // Fill text and wait for form state request to come back
    await assertNetworkRequests(
      page,
      '/admin/collections/conditional-logic',
      async () => {
        await textField.fill('updated text')
      },
      {
        minimumNumberOfRequests: 1,
      },
    )

    await expect(fieldOnlyVisibleIfNoID).toBeHidden()
  })

  test('should conditionally render custom field that renders a Payload field', async () => {
    await page.goto(url.create)

    await toggleConditionAndCheckField(
      'label[for=field-toggleField]',
      'label[for=field-customFieldWithField]',
    )

    expect(true).toBe(true)
  })

  test('should conditionally render custom field that wraps itself with the withCondition HOC (legacy)', async () => {
    await page.goto(url.create)

    await toggleConditionAndCheckField(
      'label[for=field-toggleField]',
      'label[for=field-customFieldWithHOC]',
    )

    expect(true).toBe(true)
  })

  test('should toggle conditional custom client field', async () => {
    await page.goto(url.create)
    await toggleConditionAndCheckField('label[for=field-toggleField]', '#custom-client-field')
    expect(true).toBe(true)
  })

  test('should conditionally render custom server field', async () => {
    await page.goto(url.create)
    await toggleConditionAndCheckField('label[for=field-toggleField]', '#custom-server-field')
    expect(true).toBe(true)
  })

  test('should conditionally render rich text fields', async () => {
    await page.goto(url.create)
    await toggleConditionAndCheckField(
      'label[for=field-toggleField]',
      '.field-type.rich-text-lexical',
    )
    expect(true).toBe(true)
  })

  test('should show conditional field based on user data', async () => {
    await page.goto(url.create)
    const userConditional = page.locator('input#field-userConditional')
    await expect(userConditional).toBeVisible()
  })

  test('should show conditional field based on nested field data', async () => {
    await page.goto(url.create)

    const parentGroupFields = page.locator(
      'div#field-parentGroup > .group-field__wrap > .render-fields',
    )
    await expect(parentGroupFields).toHaveCount(1)

    const toggle = page.locator('label[for=field-parentGroup__enableParentGroupFields]')
    await toggle.click()

    const toggledField = page.locator('input#field-parentGroup__siblingField')

    await expect(toggledField).toBeVisible()
  })

  test('should show conditional field based on siblingData', async () => {
    await page.goto(url.create)

    const toggle = page.locator('label[for=field-parentGroup__enableParentGroupFields]')
    await toggle.click()

    const fieldRelyingOnSiblingData = page.locator('input#field-reliesOnParentGroup')
    await expect(fieldRelyingOnSiblingData).toBeVisible()
  })

  test('should not render fields when adding array or blocks rows until form state returns', async () => {
    await page.goto(url.create)
    await addArrayRow(page, { fieldName: 'arrayWithConditionalField' })
    const shimmer = '#field-arrayWithConditionalField .collapsible__content > .shimmer-effect'

    await expect(page.locator(shimmer)).toBeVisible()

    await expect(page.locator(shimmer)).toBeHidden()

    // Do not use `waitForSelector` here, as it will wait for the selector to appear, not disappear
    // eslint-disable-next-line playwright/no-wait-for-selector
    const wasFieldAttached = await page
      .waitForSelector('input#field-arrayWithConditionalField__0__textWithCondition', {
        state: 'attached',
        timeout: 100, // A small timeout to catch any transient rendering
      })
      .catch(() => false) // If it doesn't appear, this resolves to `false`

    expect(wasFieldAttached).toBeFalsy()

    const fieldToToggle = page.locator('input#field-enableConditionalFields')
    await fieldToToggle.click()

    await expect(
      page.locator('input#field-arrayWithConditionalField__0__textWithCondition'),
    ).toBeVisible()
  })

  test('should render field based on path argument', async () => {
    await page.goto(url.create)

    await addArrayRow(page, { fieldName: 'arrayOne' })

    await addArrayRow(page, { fieldName: 'arrayOne__0__arrayTwo' })

    await addArrayRow(page, { fieldName: 'arrayOne__0__arrayTwo__0__arrayThree' })

    const numberField = page.locator('#field-arrayOne__0__arrayTwo__0__arrayThree__0__numberField')

    await expect(numberField).toBeHidden()

    const selectField = page.locator('#field-arrayOne__0__arrayTwo__0__selectOptions')

    await selectField.click({ delay: 100 })
    const options = page.locator('.rs__option')

    await options.locator('text=Option Two').click()

    await expect(numberField).toBeVisible()
  })

  test('should render field based on operation argument', async () => {
    await page.goto(url.create)

    const textField = page.locator('#field-text')
    const fieldWithOperationCondition = page.locator('#field-fieldWithOperationCondition')

    await textField.fill('some text')

    await expect(fieldWithOperationCondition).toBeVisible()

    await saveDocAndAssert(page)

    await expect(fieldWithOperationCondition).toBeHidden()
  })
})
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/fields/collections/ConditionalLogic/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { conditionalLogicSlug } from '../../slugs.js'

const ConditionalLogic: CollectionConfig = {
  slug: conditionalLogicSlug,
  admin: {
    useAsTitle: 'text',
  },
  fields: [
    {
      name: 'text',
      type: 'text',
      required: true,
    },
    {
      name: 'toggleField',
      type: 'checkbox',
    },
    {
      name: 'fieldWithDocIDCondition',
      type: 'text',
      admin: {
        condition: ({ id }) => !id,
      },
    },
    {
      name: 'fieldWithCondition',
      type: 'text',
      admin: {
        condition: ({ toggleField }) => Boolean(toggleField),
      },
    },
    {
      name: 'fieldWithOperationCondition',
      type: 'text',
      admin: {
        condition: (data, siblingData, { operation }) => {
          if (operation === 'create') {
            return true
          }

          return false
        },
      },
    },
    {
      name: 'customFieldWithField',
      type: 'text',
      admin: {
        components: {
          Field: '/collections/ConditionalLogic/CustomFieldWithField.js',
        },
        condition: ({ toggleField }) => Boolean(toggleField),
      },
    },
    {
      name: 'customFieldWithHOC',
      label: 'Custom Field With HOC (legacy)',
      type: 'text',
      admin: {
        components: {
          Field: '/collections/ConditionalLogic/CustomFieldWithHOC.js',
        },
        condition: ({ toggleField }) => Boolean(toggleField),
      },
    },
    {
      name: 'customClientFieldWithCondition',
      type: 'text',
      admin: {
        components: {
          Field: '/collections/ConditionalLogic/CustomClientField.js',
        },
        condition: ({ toggleField }) => Boolean(toggleField),
      },
    },
    {
      name: 'customServerFieldWithCondition',
      type: 'text',
      admin: {
        components: {
          Field: '/collections/ConditionalLogic/CustomServerField.js',
        },
        condition: ({ toggleField }) => Boolean(toggleField),
      },
    },
    {
      name: 'conditionalRichText',
      type: 'richText',
      admin: {
        condition: ({ toggleField }) => Boolean(toggleField),
      },
    },
    {
      name: 'userConditional',
      type: 'text',
      admin: {
        condition: (_data, _siblingData, { user }) => {
          return Boolean(user?.canViewConditionalField)
        },
      },
    },
    {
      name: 'parentGroup',
      type: 'group',
      fields: [
        {
          name: 'enableParentGroupFields',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'siblingField',
          type: 'text',
          admin: {
            description: 'Ensures we can rely on nested fields within `data`.',
            condition: ({ parentGroup }) => Boolean(parentGroup?.enableParentGroupFields),
          },
        },
      ],
    },
    {
      name: 'reliesOnParentGroup',
      type: 'text',
      admin: {
        description: 'Ensures we can rely on nested fields within `siblingsData`.',
        condition: (_, { parentGroup }) => Boolean(parentGroup?.enableParentGroupFields),
      },
    },
    {
      name: 'groupSelection',
      type: 'select',
      options: ['group1', 'group2'],
    },
    {
      name: 'group1',
      type: 'group',
      fields: [
        {
          name: 'group1Field',
          type: 'text',
        },
      ],
      admin: {
        condition: ({ groupSelection }) => groupSelection === 'group1',
      },
    },
    {
      name: 'group2',
      type: 'group',
      fields: [
        {
          name: 'group2Field',
          type: 'text',
        },
      ],
      admin: {
        condition: ({ groupSelection }) => groupSelection === 'group2',
      },
    },
    {
      name: 'enableConditionalFields',
      type: 'checkbox',
    },
    {
      name: 'arrayWithConditionalField',
      type: 'array',
      fields: [
        {
          name: 'text',
          type: 'text',
        },
        {
          name: 'textWithCondition',
          type: 'text',
          admin: {
            condition: (data) => data.enableConditionalFields,
          },
        },
      ],
    },
    {
      name: 'blocksWithConditionalField',
      type: 'blocks',
      blocks: [
        {
          slug: 'blockWithConditionalField',
          fields: [
            {
              name: 'text',
              type: 'text',
            },
            {
              name: 'textWithCondition',
              type: 'text',
              admin: {
                condition: (data) => data.enableConditionalFields,
              },
            },
          ],
        },
      ],
    },
    {
      name: 'arrayOne',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'arrayTwo',
          type: 'array',
          fields: [
            {
              name: 'selectOptions',
              type: 'select',
              defaultValue: 'optionOne',
              options: [
                {
                  label: 'Option One',
                  value: 'optionOne',
                },
                {
                  label: 'Option Two',
                  value: 'optionTwo',
                },
              ],
            },
            {
              name: 'arrayThree',
              type: 'array',
              fields: [
                {
                  name: 'numberField',
                  type: 'number',
                  admin: {
                    condition: (data, siblingData, { path }) => {
                      // Ensure path has enough depth
                      if (path.length < 5) {
                        return false
                      }

                      const arrayOneIndex = parseInt(String(path[1]), 10)
                      const arrayTwoIndex = parseInt(String(path[3]), 10)

                      const arrayOneItem = data.arrayOne?.[arrayOneIndex]
                      const arrayTwoItem = arrayOneItem?.arrayTwo?.[arrayTwoIndex]

                      return arrayTwoItem?.selectOptions === 'optionTwo'
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export default ConditionalLogic
```

--------------------------------------------------------------------------------

---[FILE: shared.ts]---
Location: payload-main/test/fields/collections/ConditionalLogic/shared.ts

```typescript
import type { RequiredDataFromCollection } from 'payload'

import type { ConditionalLogic } from '../../payload-types.js'

export const conditionalLogicDoc: RequiredDataFromCollection<ConditionalLogic> = {
  text: 'Seeded conditional logic document',
  toggleField: true,
}
```

--------------------------------------------------------------------------------

---[FILE: CustomRowID.ts]---
Location: payload-main/test/fields/collections/CustomID/CustomRowID.ts

```typescript
import type { CollectionConfig } from 'payload'

import { customRowIDSlug } from '../../slugs.js'

export const CustomRowID: CollectionConfig = {
  slug: customRowIDSlug,
  admin: {
    useAsTitle: 'id',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'id',
          type: 'text',
        },
      ],
    },
  ],
  labels: {
    plural: 'Custom Row IDs',
    singular: 'Custom Row ID',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: CustomTabID.ts]---
Location: payload-main/test/fields/collections/CustomID/CustomTabID.ts

```typescript
import type { CollectionConfig } from 'payload'

import { customTabIDSlug } from '../../slugs.js'

export const CustomTabID: CollectionConfig = {
  slug: customTabIDSlug,
  admin: {
    useAsTitle: 'id',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'id',
              type: 'text',
            },
          ],
          label: 'Tab 1',
        },
      ],
    },
  ],
  labels: {
    plural: 'Custom Tab IDs',
    singular: 'Custom Tab ID',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: e2e.spec.ts]---
Location: payload-main/test/fields/collections/CustomID/e2e.spec.ts

```typescript
import type { Page } from '@playwright/test'

import { expect, test } from '@playwright/test'
import { navigateToDoc } from 'helpers/e2e/navigateToDoc.js'
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
import { customIDSlug, customRowIDSlug, customTabIDSlug } from '../../slugs.js'
import { customRowID, customTabID, nonStandardID } from './shared.js'

const filename = fileURLToPath(import.meta.url)
const currentFolder = path.dirname(filename)
const dirname = path.resolve(currentFolder, '../../')

const { beforeAll, beforeEach, describe } = test

let payload: PayloadTestSDK<Config>
let client: RESTClient
let page: Page
let serverURL: string
let url: AdminUrlUtil
let customTabIDURL: AdminUrlUtil
let customRowIDURL: AdminUrlUtil

describe('Custom IDs', () => {
  beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)
    process.env.SEED_IN_CONFIG_ONINIT = 'false' // Makes it so the payload config onInit seed is not run. Otherwise, the seed would be run unnecessarily twice for the initial test run - once for beforeEach and once for onInit
    ;({ payload, serverURL } = await initPayloadE2ENoConfig<Config>({
      dirname,
      // prebuild,
    }))

    url = new AdminUrlUtil(serverURL, customIDSlug)
    customTabIDURL = new AdminUrlUtil(serverURL, customTabIDSlug)
    customRowIDURL = new AdminUrlUtil(serverURL, customRowIDSlug)

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

  test('allow create of non standard ID', async () => {
    await page.goto(url.list)
    await navigateToDoc(page, url)
    await expect(page.locator('#field-id')).toHaveValue(nonStandardID)
    await expect(page.locator('.id-label')).toContainText(nonStandardID)
  })

  test('should use custom ID field nested within unnamed tab', async () => {
    await page.goto(customTabIDURL.edit(customTabID))
    const idField = page.locator('#field-id')
    await expect(idField).toHaveValue(customTabID)
  })

  test('should use custom ID field nested within row', async () => {
    await page.goto(customRowIDURL.edit(customRowID))
    const idField = page.locator('#field-id')
    await expect(idField).toHaveValue(customRowID)
  })
})
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/fields/collections/CustomID/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { customIDSlug } from '../../slugs.js'

export const CustomID: CollectionConfig = {
  slug: customIDSlug,
  versions: true,
  admin: {
    useAsTitle: 'id',
  },
  fields: [
    {
      name: 'id',
      type: 'text',
    },
  ],
  labels: {
    plural: 'Custom IDs',
    singular: 'Custom ID',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: shared.ts]---
Location: payload-main/test/fields/collections/CustomID/shared.ts

```typescript
export const nonStandardID = 'id 1'
export const customRowID = '111111111111111111111111'
export const customTabID = '111111111111111111111111'
```

--------------------------------------------------------------------------------

````
