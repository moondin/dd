---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 559
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 559 of 695)

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

---[FILE: shared.ts]---
Location: payload-main/test/fields/collections/Date/shared.ts

```typescript
import type { DateField } from '../../payload-types.js'

export const dateDoc: Partial<DateField> = {
  default: '2022-08-12T10:00:00.000+00:00',
  timeOnly: '2022-08-12T10:00:00.157+00:00',
  timeOnlyWithCustomFormat: '2022-08-12T10:00:00.157+00:00',
  dayOnly: '2022-08-11T22:00:00.000+00:00',
  dayAndTime: '2022-08-12T10:00:00.052+00:00',
  monthOnly: '2022-07-31T22:00:00.000+00:00',
  defaultWithTimezone: '2027-08-12T10:00:00.000+00:00',
  defaultWithTimezone_tz: 'Europe/London',
  dayAndTimeWithTimezone: '2027-08-12T01:00:00.000+00:00', // 10AM tokyo time — we will test for this in e2e
  dayAndTimeWithTimezone_tz: 'Asia/Tokyo',
  timezoneBlocks: [
    {
      blockType: 'dateBlock',
      dayAndTime: '2025-01-31T09:00:00.000Z',
      dayAndTime_tz: 'Europe/Berlin',
    },
  ],
  timezoneArray: [
    {
      dayAndTime: '2025-01-31T09:00:00.549Z',
      dayAndTime_tz: 'Europe/Berlin',
    },
  ],
  timezoneGroup: {
    dayAndTime: '2025-01-31T09:00:00.000Z',
    dayAndTime_tz: 'Europe/Berlin',
  },
  dayAndTimeWithTimezoneReadOnly: '2027-08-12T01:00:00.000+00:00',
  dayAndTimeWithTimezoneReadOnly_tz: 'Asia/Tokyo',
  dayAndTimeWithTimezoneFixed: '2025-10-29T20:00:00.000+00:00',
}
```

--------------------------------------------------------------------------------

---[FILE: AfterInput.tsx]---
Location: payload-main/test/fields/collections/Email/AfterInput.tsx
Signals: React

```typescript
'use client'

import React from 'react'

export const AfterInput: React.FC = () => {
  return <label className="after-input">#after-input</label>
}
```

--------------------------------------------------------------------------------

---[FILE: BeforeInput.tsx]---
Location: payload-main/test/fields/collections/Email/BeforeInput.tsx
Signals: React

```typescript
'use client'

import React from 'react'

export const BeforeInput: React.FC = () => {
  return <label className="before-input">#before-input</label>
}
```

--------------------------------------------------------------------------------

---[FILE: CustomError.tsx]---
Location: payload-main/test/fields/collections/Email/CustomError.tsx
Signals: React

```typescript
'use client'

import { useField, useFormFields, useFormSubmitted } from '@payloadcms/ui'
import React from 'react'

export const CustomError: React.FC<any> = (props) => {
  const { path: pathFromProps } = props
  const submitted = useFormSubmitted()
  const { path } = useField(pathFromProps)
  const field = useFormFields(([fields]) => (fields && fields?.[path]) || null)
  const { valid } = field || {}

  const showError = submitted && !valid

  if (showError) {
    return <div className="custom-error">#custom-error</div>
  }

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: CustomLabel.tsx]---
Location: payload-main/test/fields/collections/Email/CustomLabel.tsx
Signals: React

```typescript
'use client'

import type { EmailFieldClientComponent } from 'payload'

import React from 'react'

export const CustomLabel: EmailFieldClientComponent = ({ path }) => {
  return (
    <label className="custom-label" htmlFor={`field-${path?.replace(/\./g, '__')}`}>
      #label
    </label>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: e2e.spec.ts]---
Location: payload-main/test/fields/collections/Email/e2e.spec.ts

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
import { emailFieldsSlug } from '../../slugs.js'
import { emailDoc } from './shared.js'

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

describe('Email', () => {
  beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)
    process.env.SEED_IN_CONFIG_ONINIT = 'false' // Makes it so the payload config onInit seed is not run. Otherwise, the seed would be run unnecessarily twice for the initial test run - once for beforeEach and once for onInit
    ;({ payload, serverURL } = await initPayloadE2ENoConfig<Config>({
      dirname,
      // prebuild,
    }))
    url = new AdminUrlUtil(serverURL, emailFieldsSlug)

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
    const emailCell = page.locator('.row-1 .cell-email')
    await expect(emailCell).toHaveText(emailDoc.email)
  })

  test('should have autocomplete', async () => {
    await page.goto(url.create)
    const autoCompleteEmail = page.locator('#field-emailWithAutocomplete')
    await expect(autoCompleteEmail).toHaveAttribute('autocomplete')
  })

  test('should show i18n label', async () => {
    await page.goto(url.create)

    await expect(page.locator('label[for="field-i18nEmail"]')).toHaveText('Text en')
  })

  test('should show i18n placeholder', async () => {
    await page.goto(url.create)
    await expect(page.locator('#field-i18nEmail')).toHaveAttribute('placeholder', 'en placeholder')
  })

  test('should show i18n descriptions', async () => {
    await page.goto(url.create)
    const description = page.locator('.field-description-i18nEmail')
    await expect(description).toHaveText('en description')
  })

  test('should render custom label', async () => {
    await page.goto(url.create)
    const label = page.locator('label.custom-label[for="field-customLabel"]')
    await expect(label).toHaveText('#label')
  })

  test('should render custom error', async () => {
    await page.goto(url.create)
    const input = page.locator('input[id="field-customError"]')
    await input.fill('ab')
    await expect(input).toHaveValue('ab')
    const error = page.locator('.custom-error:near(input[id="field-customError"])')
    const submit = page.locator('button[type="button"][id="action-save"]')
    await submit.click()
    await expect(error).toHaveText('#custom-error')
  })

  test('should render beforeInput and afterInput', async () => {
    await page.goto(url.create)
    const input = page.locator('input[id="field-beforeAndAfterInput"]')

    const prevSibling = await input.evaluateHandle((el) => {
      return el.previousElementSibling
    })
    const prevSiblingText = await page.evaluate((el) => el.textContent, prevSibling)
    expect(prevSiblingText).toEqual('#before-input')

    const nextSibling = await input.evaluateHandle((el) => {
      return el.nextElementSibling
    })
    const nextSiblingText = await page.evaluate((el) => el.textContent, nextSibling)
    expect(nextSiblingText).toEqual('#after-input')
  })

  describe('A11y', () => {
    test('Edit view should have no accessibility violations', async ({}, testInfo) => {
      await page.goto(url.create)
      await page.locator('#field-email').waitFor()

      const scanResults = await runAxeScan({
        page,
        testInfo,
        include: ['.document-fields__main'],
        exclude: ['.field-description'], // known issue - reported elsewhere @todo: remove this once fixed - see report https://github.com/payloadcms/payload/discussions/14489
      })

      expect(scanResults.violations.length).toBe(0)
    })

    test('Email inputs have focus indicators', async ({}, testInfo) => {
      await page.goto(url.create)
      await page.locator('#field-email').waitFor()

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
Location: payload-main/test/fields/collections/Email/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { defaultEmail, emailFieldsSlug } from './shared.js'

const EmailFields: CollectionConfig = {
  slug: emailFieldsSlug,
  defaultSort: 'id',
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'localizedEmail',
      type: 'email',
      localized: true,
    },
    {
      name: 'emailWithAutocomplete',
      type: 'email',
      admin: {
        autoComplete: 'username',
      },
    },
    {
      name: 'i18nEmail',
      type: 'email',
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
      name: 'defaultEmail',
      type: 'email',
      defaultValue: defaultEmail,
    },
    {
      name: 'defaultEmptyString',
      type: 'email',
      defaultValue: '',
    },
    {
      name: 'defaultFunction',
      type: 'email',
      defaultValue: () => defaultEmail,
    },
    {
      name: 'defaultAsync',
      type: 'email',
      defaultValue: async (): Promise<string> => {
        return new Promise((resolve) =>
          setTimeout(() => {
            resolve(defaultEmail)
          }, 1),
        )
      },
    },
    {
      name: 'customLabel',
      type: 'email',
      admin: {
        components: {
          Label: '/collections/Email/CustomLabel.js#CustomLabel',
        },
      },
    },
    {
      name: 'customError',
      type: 'email',
      admin: {
        components: {
          Error: '/collections/Email/CustomError.js#CustomError',
        },
      },
    },
    {
      name: 'beforeAndAfterInput',
      type: 'email',
      admin: {
        components: {
          afterInput: ['/collections/Email/AfterInput.js#AfterInput'],
          beforeInput: ['/collections/Email/BeforeInput.js#BeforeInput'],
        },
      },
    },
    {
      name: 'disableListColumnText',
      type: 'email',
      admin: {
        disableListColumn: true,
        disableListFilter: false,
      },
    },
    {
      name: 'disableListFilterText',
      type: 'email',
      admin: {
        disableListColumn: false,
        disableListFilter: true,
      },
    },
  ],
}

export default EmailFields
```

--------------------------------------------------------------------------------

---[FILE: shared.ts]---
Location: payload-main/test/fields/collections/Email/shared.ts

```typescript
import type { RequiredDataFromCollection } from 'payload/types'

import type { EmailField } from '../../payload-types.js'

export const defaultEmail = 'dev@example.com'

export const emailFieldsSlug = 'email-fields'

export const emailDoc: RequiredDataFromCollection<EmailField> = {
  email: 'dev@example.com',
  localizedEmail: 'another@example.com',
}

export const anotherEmailDoc: RequiredDataFromCollection<EmailField> = {
  email: 'user@example.com',
}
```

--------------------------------------------------------------------------------

---[FILE: e2e.spec.ts]---
Location: payload-main/test/fields/collections/Group/e2e.spec.ts

```typescript
import type { Page } from '@playwright/test'

import { expect, test } from '@playwright/test'
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
import { groupFieldsSlug } from '../../slugs.js'
import { namedGroupDoc } from './shared.js'

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

describe('Group', () => {
  beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)
    process.env.SEED_IN_CONFIG_ONINIT = 'false' // Makes it so the payload config onInit seed is not run. Otherwise, the seed would be run unnecessarily twice for the initial test run - once for beforeEach and once for onInit
    ;({ payload, serverURL } = await initPayloadE2ENoConfig<Config>({
      dirname,
      // prebuild,
    }))
    url = new AdminUrlUtil(serverURL, groupFieldsSlug)

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

  describe('Named', () => {
    test('should display field in list view', async () => {
      await page.goto(url.list)

      const textCell = page.locator('.row-1 .cell-group')

      await expect(textCell).toContainText(JSON.stringify(namedGroupDoc.group?.text), {
        useInnerText: true,
      })
    })
  })

  describe('Unnamed', () => {
    test('should display field in list view', async () => {
      await page.goto(url.list)

      const textCell = page.locator('.row-1 .cell-insideUnnamedGroup')

      await expect(textCell).toContainText(namedGroupDoc?.insideUnnamedGroup ?? '', {
        useInnerText: true,
      })
    })

    test('should display field in list view deeply nested', async () => {
      await page.goto(url.list)

      const textCell = page.locator('.row-1 .cell-deeplyNestedGroup')

      await expect(textCell).toContainText(JSON.stringify(namedGroupDoc.deeplyNestedGroup), {
        useInnerText: true,
      })
    })

    test('should display field visually within nested groups', async () => {
      await page.goto(url.create)

      // Makes sure the fields are rendered
      await page.mouse.wheel(0, 2000)

      const unnamedGroupSelector = `.field-type.group-field #field-insideUnnamedGroup`
      const unnamedGroupField = page.locator(unnamedGroupSelector)

      await expect(unnamedGroupField).toBeVisible()

      // Makes sure the fields are rendered
      await page.mouse.wheel(0, 2000)

      // A bit repetitive but this selector should fail if the group is not nested
      const unnamedNestedGroupSelector = `.field-type.group-field .field-type.group-field .field-type.group-field .field-type.group-field .field-type.group-field #field-deeplyNestedGroup__insideNestedUnnamedGroup`
      const unnamedNestedGroupField = page.locator(unnamedNestedGroupSelector)
      await expect(unnamedNestedGroupField).toBeVisible()
    })

    test('should display with no label when label is undefined', async () => {
      await page.goto(url.create)

      // Makes sure the fields are rendered
      await page.mouse.wheel(0, 2000)

      const nolabelGroupSelector = `.field-type.group-field#field-_index-14 .group-field__header`
      const nolabelGroupField = page.locator(nolabelGroupSelector)

      await expect(nolabelGroupField).toBeHidden()

      // Makes sure the fields are rendered
      await page.mouse.wheel(0, 2000)

      // Children should render even if the group has no label
      const nolabelGroupChildSelector = `.field-type.group-field#field-_index-14 #field-insideGroupWithNoLabel`
      const nolabelGroupChildField = page.locator(nolabelGroupChildSelector)

      await expect(nolabelGroupChildField).toBeVisible()
    })
  })

  describe('A11y', () => {
    test.fixme('Edit view should have no accessibility violations', async ({}, testInfo) => {
      await page.goto(url.create)
      await page.locator('#field-group__text').waitFor()

      const scanResults = await runAxeScan({
        page,
        testInfo,
        include: ['.collection-edit__main'],
      })

      expect(scanResults.violations.length).toBe(0)
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/fields/collections/Group/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { groupFieldsSlug } from '../../slugs.js'

export const groupDefaultValue = 'set from parent'
export const groupDefaultChild = 'child takes priority'

const GroupFields: CollectionConfig = {
  slug: groupFieldsSlug,
  versions: true,
  admin: {
    defaultColumns: ['id', 'group', 'insideUnnamedGroup', 'deeplyNestedGroup'],
  },
  fields: [
    {
      label: 'Group Field',
      name: 'group',
      type: 'group',
      defaultValue: {
        defaultParent: groupDefaultValue,
      },
      admin: {
        description: 'This is a group.',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          defaultValue: groupDefaultValue,
        },
        {
          name: 'defaultParent',
          type: 'text',
          defaultValue: groupDefaultChild,
        },
        {
          name: 'defaultChild',
          type: 'text',
          defaultValue: groupDefaultChild,
        },
        {
          name: 'subGroup',
          type: 'group',
          fields: [
            {
              name: 'textWithinGroup',
              type: 'text',
            },
            {
              name: 'arrayWithinGroup',
              type: 'array',
              fields: [
                {
                  name: 'textWithinArray',
                  type: 'text',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'arrayOfGroups',
      type: 'array',
      defaultValue: [
        {
          groupItem: {
            text: 'Hello world',
          },
        },
      ],
      fields: [
        {
          name: 'groupItem',
          type: 'group',
          fields: [{ name: 'text', type: 'text' }],
        },
      ],
    },
    {
      name: 'localizedGroup',
      type: 'group',
      fields: [
        {
          name: 'text',
          type: 'text',
        },
      ],
      localized: true,
    },
    {
      name: 'potentiallyEmptyGroup',
      type: 'group',
      fields: [
        {
          name: 'text',
          type: 'text',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'groupInRow',
          type: 'group',
          fields: [
            {
              name: 'field',
              type: 'text',
            },
            {
              name: 'secondField',
              type: 'text',
            },
            {
              name: 'thirdField',
              type: 'text',
            },
          ],
        },
        {
          name: 'secondGroupInRow',
          type: 'group',
          fields: [
            {
              name: 'field',
              type: 'text',
            },
            {
              name: 'nestedGroup',
              type: 'group',
              fields: [
                {
                  name: 'nestedField',
                  type: 'text',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          name: 'groups',
          label: 'Groups in tabs',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'groupInRow',
                  type: 'group',
                  fields: [
                    {
                      name: 'field',
                      type: 'text',
                    },
                    {
                      name: 'secondField',
                      type: 'text',
                    },
                    {
                      name: 'thirdField',
                      type: 'text',
                    },
                  ],
                },
                {
                  name: 'secondGroupInRow',
                  type: 'group',
                  fields: [
                    {
                      name: 'field',
                      type: 'text',
                    },
                    {
                      name: 'nestedGroup',
                      type: 'group',
                      fields: [
                        {
                          name: 'nestedField',
                          type: 'text',
                        },
                      ],
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
      name: 'camelCaseGroup',
      type: 'group',
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
    {
      name: 'localizedGroupArr',
      type: 'group',
      localized: true,
      fields: [
        {
          name: 'array',
          type: 'array',
          fields: [
            {
              type: 'text',
              name: 'text',
            },
          ],
        },
      ],
    },
    {
      name: 'localizedGroupSelect',
      type: 'group',
      localized: true,
      fields: [
        {
          type: 'select',
          hasMany: true,
          options: ['one', 'two'],
          name: 'select',
        },
      ],
    },
    {
      name: 'localizedGroupRel',
      type: 'group',
      localized: true,
      fields: [
        {
          type: 'relationship',
          relationTo: 'email-fields',
          name: 'email',
        },
      ],
    },
    {
      name: 'localizedGroupManyRel',
      type: 'group',
      localized: true,
      fields: [
        {
          type: 'relationship',
          relationTo: 'email-fields',
          name: 'email',
          hasMany: true,
        },
      ],
    },
    {
      name: 'localizedGroupPolyRel',
      type: 'group',
      localized: true,
      fields: [
        {
          type: 'relationship',
          relationTo: ['email-fields'],
          name: 'email',
        },
      ],
    },
    {
      name: 'localizedGroupPolyHasManyRel',
      type: 'group',
      localized: true,
      fields: [
        {
          type: 'relationship',
          relationTo: ['email-fields'],
          name: 'email',
          hasMany: true,
        },
      ],
    },
    {
      type: 'group',
      label: 'Unnamed group',
      fields: [
        {
          type: 'text',
          name: 'insideUnnamedGroup',
        },
      ],
    },
    {
      type: 'group',
      fields: [
        {
          type: 'text',
          name: 'insideGroupWithNoLabel',
        },
      ],
    },
    {
      type: 'group',
      label: 'Deeply nested group',
      fields: [
        {
          type: 'group',
          label: 'Deeply nested group',
          fields: [
            {
              type: 'group',
              name: 'deeplyNestedGroup',
              label: 'Deeply nested group',
              fields: [
                {
                  type: 'group',
                  label: 'Deeply nested group',
                  fields: [
                    {
                      type: 'group',
                      label: 'Deeply nested group',
                      fields: [
                        {
                          type: 'text',
                          name: 'insideNestedUnnamedGroup',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export default GroupFields
```

--------------------------------------------------------------------------------

---[FILE: shared.ts]---
Location: payload-main/test/fields/collections/Group/shared.ts

```typescript
import type { GroupField } from '../../payload-types.js'

export const namedGroupDoc: Partial<GroupField> = {
  group: {
    text: 'some text within a group',
    subGroup: {
      textWithinGroup: 'please',
      arrayWithinGroup: [
        {
          textWithinArray: 'text in a group and array',
        },
      ],
    },
  },
  insideUnnamedGroup: 'text in unnamed group',
  deeplyNestedGroup: {
    insideNestedUnnamedGroup: 'text in nested unnamed group',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: e2e.spec.ts]---
Location: payload-main/test/fields/collections/Indexed/e2e.spec.ts

```typescript
import type { Page } from '@playwright/test'

import { expect, test } from '@playwright/test'
import path from 'path'
import { wait } from 'payload/shared'
import { fileURLToPath } from 'url'

import type { PayloadTestSDK } from '../../../helpers/sdk/index.js'
import type { Config } from '../../payload-types.js'

import { ensureCompilationIsDone, initPageConsoleErrorCatch } from '../../../helpers.js'
import { AdminUrlUtil } from '../../../helpers/adminUrlUtil.js'
import { assertToastErrors } from '../../../helpers/assertToastErrors.js'
import { initPayloadE2ENoConfig } from '../../../helpers/initPayloadE2ENoConfig.js'
import { reInitializeDB } from '../../../helpers/reInitializeDB.js'
import { RESTClient } from '../../../helpers/rest.js'
import { POLL_TOPASS_TIMEOUT, TEST_TIMEOUT_LONG } from '../../../playwright.config.js'
import { indexedFieldsSlug } from '../../slugs.js'

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

    url = new AdminUrlUtil(serverURL, indexedFieldsSlug)

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

  test('should display unique constraint error in ui', async () => {
    const uniqueText = 'uniqueText'
    const doc = await payload.create({
      collection: 'indexed-fields',
      data: {
        group: {
          unique: uniqueText,
        },
        localizedUniqueRequiredText: 'text',
        text: 'text',
        uniqueRequiredText: 'text',
        uniqueText,
      },
    })

    await payload.update({
      id: doc.id,
      collection: 'indexed-fields',
      data: {
        localizedUniqueRequiredText: 'es text',
      },
      locale: 'es',
    })

    await page.goto(url.create)

    await page.locator('#field-text').fill('test')
    await page.locator('#field-uniqueText').fill(uniqueText)
    await page.locator('#field-localizedUniqueRequiredText').fill('localizedUniqueRequired2')

    await wait(500)

    // attempt to save
    await page.click('#action-save', { delay: 200 })

    // toast error
    await assertToastErrors({
      page,
      errors: ['uniqueText'],
      dismissAfterAssertion: true,
    })

    await expect.poll(() => page.url(), { timeout: POLL_TOPASS_TIMEOUT }).toContain('create')

    // field specific error
    await expect(page.locator('.field-type.text.error #field-uniqueText')).toBeVisible()

    // reset first unique field
    await page.locator('#field-uniqueText').clear()

    // nested in a group error
    await page.locator('#field-group__unique').fill(uniqueText)

    // TODO: used because otherwise the toast locator resolves to 2 items
    // at the same time. Instead we should uniquely identify each toast.
    await wait(2000)

    // attempt to save
    await page.locator('#action-save').click()

    // toast error
    await assertToastErrors({
      page,
      errors: ['group.unique'],
    })

    await expect.poll(() => page.url(), { timeout: POLL_TOPASS_TIMEOUT }).toContain('create')

    // field specific error inside group
    await expect(page.locator('.field-type.text.error #field-group__unique')).toBeVisible()
  })
})
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/fields/collections/Indexed/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { indexedFieldsSlug } from '../../slugs.js'

const IndexedFields: CollectionConfig = {
  slug: indexedFieldsSlug,
  fields: [
    {
      name: 'text',
      type: 'text',
      index: true,
      required: true,
    },
    {
      name: 'uniqueText',
      type: 'text',
      unique: true,
    },
    {
      name: 'uniqueRelationship',
      type: 'relationship',
      relationTo: 'text-fields',
      unique: true,
    },
    {
      name: 'uniqueHasManyRelationship',
      type: 'relationship',
      relationTo: 'text-fields',
      unique: true,
      hasMany: true,
    },
    {
      name: 'uniqueHasManyRelationship_2',
      type: 'relationship',
      relationTo: 'text-fields',
      hasMany: true,
      unique: true,
    },
    {
      name: 'uniquePolymorphicRelationship',
      type: 'relationship',
      relationTo: ['text-fields'],
      unique: true,
    },
    {
      name: 'uniquePolymorphicRelationship_2',
      type: 'relationship',
      relationTo: ['text-fields'],
      unique: true,
    },
    {
      name: 'uniqueHasManyPolymorphicRelationship',
      type: 'relationship',
      relationTo: ['text-fields'],
      unique: true,
      hasMany: true,
    },
    {
      name: 'uniqueHasManyPolymorphicRelationship_2',
      type: 'relationship',
      relationTo: ['text-fields'],
      unique: true,
      hasMany: true,
    },
    {
      name: 'uniqueRequiredText',
      type: 'text',
      defaultValue: 'uniqueRequired',
      required: true,
      unique: true,
    },
    {
      name: 'localizedUniqueRequiredText',
      type: 'text',
      defaultValue: 'localizedUniqueRequired',
      localized: true,
      required: true,
      unique: true,
    },
    {
      name: 'point',
      type: 'point',
    },
    {
      name: 'group',
      type: 'group',
      fields: [
        {
          name: 'localizedUnique',
          type: 'text',
          localized: true,
          unique: true,
        },
        {
          name: 'unique',
          type: 'text',
          unique: true,
        },
        {
          name: 'point',
          type: 'point',
        },
      ],
    },
    {
      type: 'collapsible',
      fields: [
        {
          name: 'collapsibleLocalizedUnique',
          type: 'text',
          localized: true,
          unique: true,
        },
        {
          name: 'collapsibleTextUnique',
          type: 'text',
          label: 'collapsibleTextUnique',
          unique: true,
        },
      ],
      label: 'Collapsible',
    },
    {
      type: 'text',
      name: 'someText',
      index: true,
    },
    {
      type: 'array',
      name: 'some',
      index: true,
      fields: [
        {
          type: 'text',
          name: 'text',
          index: true,
        },
      ],
    },
  ],
  versions: true,
}

export default IndexedFields
```

--------------------------------------------------------------------------------

---[FILE: AfterField.tsx]---
Location: payload-main/test/fields/collections/JSON/AfterField.tsx

```typescript
'use client'

import { useField } from '@payloadcms/ui'

export function AfterField() {
  const { setValue } = useField({ path: 'customJSON' })

  return (
    <button
      id="set-custom-json"
      onClick={(e) => {
        e.preventDefault()
        setValue({
          users: [
            {
              id: 1,
              name: 'John Doe',
              email: 'john.doe@example.com',
              isActive: true,
              roles: ['admin', 'editor'],
            },
            {
              id: 2,
              name: 'Jane Smith',
              email: 'jane.smith@example.com',
              isActive: false,
              roles: ['viewer'],
            },
          ],
        })
      }}
      style={{ marginTop: '5px', padding: '5px 10px' }}
      type="button"
    >
      Set Custom JSON
    </button>
  )
}
```

--------------------------------------------------------------------------------

````
