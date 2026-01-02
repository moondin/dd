---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 562
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 562 of 695)

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

---[FILE: index.ts]---
Location: payload-main/test/fields/collections/Relationship/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { relationshipFieldsSlug } from '../../slugs.js'

const RelationshipFields: CollectionConfig = {
  fields: [
    {
      name: 'text',
      type: 'text',
    },
    {
      name: 'relationship',
      relationTo: ['text-fields', 'array-fields'],
      required: true,
      type: 'relationship',
      admin: {
        sortOptions: {
          'text-fields': '-id',
          'array-fields': '-id',
        },
      },
    },
    {
      name: 'relationHasManyPolymorphic',
      type: 'relationship',
      relationTo: ['text-fields', 'array-fields'],
      hasMany: true,
      admin: {
        sortOptions: {
          'text-fields': '-text',
        },
      },
    },
    {
      name: 'relationToSelf',
      relationTo: relationshipFieldsSlug,
      type: 'relationship',
    },
    {
      name: 'relationToSelfSelectOnly',
      relationTo: relationshipFieldsSlug,
      type: 'relationship',
    },
    {
      name: 'relationWithAllowCreateToFalse',
      admin: {
        allowCreate: false,
      },
      defaultValue: ({ user }) => user?.id,
      relationTo: 'users',
      type: 'relationship',
    },
    {
      name: 'relationWithAllowEditToFalse',
      admin: {
        allowEdit: false,
      },
      defaultValue: ({ user }) => user?.id,
      relationTo: 'users',
      type: 'relationship',
    },
    {
      name: 'relationWithDynamicDefault',
      defaultValue: ({ user }) => user?.id,
      relationTo: 'users',
      type: 'relationship',
    },
    {
      name: 'relationHasManyWithDynamicDefault',
      defaultValue: ({ user }) =>
        user
          ? {
              relationTo: 'users',
              value: user.id,
            }
          : undefined,
      relationTo: ['users'],
      type: 'relationship',
    },
    {
      name: 'relationshipWithMin',
      hasMany: true,
      minRows: 2,
      relationTo: 'text-fields',
      type: 'relationship',
    },
    {
      name: 'relationshipWithMax',
      hasMany: true,
      maxRows: 2,
      relationTo: 'text-fields',
      type: 'relationship',
    },
    {
      name: 'relationshipHasMany',
      hasMany: true,
      relationTo: 'text-fields',
      type: 'relationship',
    },
    {
      name: 'array',
      fields: [
        {
          name: 'relationship',
          relationTo: 'text-fields',
          type: 'relationship',
        },
      ],
      type: 'array',
    },
    {
      name: 'relationshipWithMinRows',
      relationTo: ['text-fields'],
      hasMany: true,
      minRows: 2,
      type: 'relationship',
    },
    {
      name: 'relationToRow',
      relationTo: 'row-fields',
      type: 'relationship',
    },
    {
      name: 'relationToRowMany',
      relationTo: 'row-fields',
      type: 'relationship',
      hasMany: true,
    },
    {
      name: 'relationshipDrawer',
      relationTo: 'text-fields',
      admin: { appearance: 'drawer' },
      type: 'relationship',
    },
    {
      name: 'relationshipDrawerReadOnly',
      relationTo: 'text-fields',
      admin: {
        readOnly: true,
        appearance: 'drawer',
      },
      type: 'relationship',
    },
    {
      name: 'polymorphicRelationshipDrawer',
      admin: { appearance: 'drawer' },
      type: 'relationship',
      relationTo: ['text-fields', 'array-fields'],
    },
    {
      name: 'relationshipDrawerHasMany',
      relationTo: 'text-fields',
      admin: {
        appearance: 'drawer',
      },
      hasMany: true,
      type: 'relationship',
    },
    {
      name: 'relationshipDrawerHasManyPolymorphic',
      relationTo: ['text-fields', 'array-fields'],
      admin: {
        appearance: 'drawer',
      },
      hasMany: true,
      type: 'relationship',
    },
    {
      name: 'relationshipDrawerWithAllowCreateFalse',
      admin: {
        allowCreate: false,
        appearance: 'drawer',
      },
      type: 'relationship',
      relationTo: 'text-fields',
    },
    {
      name: 'relationshipDrawerWithFilterOptions',
      admin: { appearance: 'drawer' },
      type: 'relationship',
      relationTo: ['text-fields'],
      filterOptions: ({ relationTo }) => {
        if (relationTo === 'text-fields') {
          return {
            text: {
              equals: 'list drawer test',
            },
          }
        } else {
          return true
        }
      },
    },
  ],
  slug: relationshipFieldsSlug,
}

export default RelationshipFields
```

--------------------------------------------------------------------------------

---[FILE: e2e.spec.ts]---
Location: payload-main/test/fields/collections/Row/e2e.spec.ts

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
import { initPayloadE2ENoConfig } from '../../../helpers/initPayloadE2ENoConfig.js'
import { reInitializeDB } from '../../../helpers/reInitializeDB.js'
import { RESTClient } from '../../../helpers/rest.js'
import { TEST_TIMEOUT_LONG } from '../../../playwright.config.js'
import { rowFieldsSlug } from '../../slugs.js'

const filename = fileURLToPath(import.meta.url)
const currentFolder = path.dirname(filename)
const dirname = path.resolve(currentFolder, '../../')

const { beforeAll, beforeEach, describe } = test

let payload: PayloadTestSDK<Config>
let client: RESTClient
let page: Page
let serverURL: string
let url: AdminUrlUtil

describe('Row', () => {
  beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)
    process.env.SEED_IN_CONFIG_ONINIT = 'false' // Makes it so the payload config onInit seed is not run. Otherwise, the seed would be run unnecessarily twice for the initial test run - once for beforeEach and once for onInit
    ;({ payload, serverURL } = await initPayloadE2ENoConfig<Config>({
      dirname,
      // prebuild,
    }))

    url = new AdminUrlUtil(serverURL, rowFieldsSlug)

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

  test('should show row fields as table columns', async () => {
    await page.goto(url.create)

    // fill the required fields, including the row field
    const idInput = page.locator('input#field-id')
    await idInput.fill('123')
    const titleInput = page.locator('input#field-title')
    await titleInput.fill('Row 123')
    await page.locator('#action-save').click()
    await wait(200)
    await expect(page.locator('.payload-toast-container')).toContainText('successfully')

    // ensure the 'title' field is visible in the table header
    await page.goto(url.list)
    const titleHeading = page.locator('th#heading-title')
    await expect(titleHeading).toBeVisible()

    // ensure the 'title' field shows the correct value in the table cell
    const titleCell = page.locator('.row-1 td.cell-title')
    await expect(titleCell).toBeVisible()
    await expect(titleCell).toContainText('Row 123')
  })

  test('should not show duplicative ID field', async () => {
    await page.goto(url.create)
    // fill the required fields, including the custom ID field
    const idInput = page.locator('input#field-id')
    await idInput.fill('456')
    const titleInput = page.locator('input#field-title')
    await titleInput.fill('Row 456')
    await page.locator('#action-save').click()
    await wait(200)
    await expect(page.locator('.payload-toast-container')).toContainText('successfully')

    // ensure there are not two ID fields in the table header
    await page.goto(url.list)
    const idHeadings = page.locator('th#heading-id')
    await expect(idHeadings).toBeVisible()
    await expect(idHeadings).toHaveCount(1)
  })

  test('should render row fields inline and with explicit widths', async () => {
    await page.goto(url.create)
    const fieldA = page.locator('input#field-field_with_width_a')
    const fieldB = page.locator('input#field-field_with_width_b')

    await expect(fieldA).toBeVisible()
    await expect(fieldB).toBeVisible()

    const fieldABox = await fieldA.boundingBox()
    const fieldBBox = await fieldB.boundingBox()

    await expect(() => {
      expect(fieldABox.y).toEqual(fieldBBox.y)
      expect(fieldABox.width).toEqual(fieldBBox.width)
    }).toPass()

    const field_30_percent = page.locator(
      '.field-type.text:has(input#field-field_with_width_30_percent)',
    )
    const field_60_percent = page.locator(
      '.field-type.text:has(input#field-field_with_width_60_percent)',
    )
    const field_20_percent = page.locator(
      '.field-type.text:has(input#field-field_with_width_20_percent)',
    )
    const collapsible_30_percent = page.locator(
      '.collapsible-field:has(#field-field_within_collapsible_a)',
    )

    const field_20_percent_width_within_row_a = page.locator(
      '.field-type.text:has(input#field-field_20_percent_width_within_row_a)',
    )
    const field_no_set_width_within_row_b = page.locator(
      '.field-type.text:has(input#field-no_set_width_within_row_b)',
    )
    const field_no_set_width_within_row_c = page.locator(
      '.field-type.text:has(input#field-no_set_width_within_row_c)',
    )
    const field_20_percent_width_within_row_d = page.locator(
      '.field-type.text:has(input#field-field_20_percent_width_within_row_d)',
    )

    await expect(field_30_percent).toBeVisible()
    await expect(field_60_percent).toBeVisible()
    await expect(field_20_percent).toBeVisible()
    await expect(collapsible_30_percent).toBeVisible()
    await expect(field_20_percent_width_within_row_a).toBeVisible()
    await expect(field_no_set_width_within_row_b).toBeVisible()
    await expect(field_no_set_width_within_row_c).toBeVisible()
    await expect(field_20_percent_width_within_row_d).toBeVisible()

    const field_30_boundingBox = await field_30_percent.boundingBox()
    const field_60_boundingBox = await field_60_percent.boundingBox()
    const field_20_boundingBox = await field_20_percent.boundingBox()
    const collapsible_30_boundingBox = await collapsible_30_percent.boundingBox()
    const field_20_percent_width_within_row_a_box =
      await field_20_percent_width_within_row_a.boundingBox()
    const field_no_set_width_within_row_b_box = await field_no_set_width_within_row_b.boundingBox()
    const field_no_set_width_within_row_c_box = await field_no_set_width_within_row_c.boundingBox()
    const field_20_percent_width_within_row_d_box =
      await field_20_percent_width_within_row_d.boundingBox()

    await expect(() => {
      expect(field_30_boundingBox.y).toEqual(field_60_boundingBox.y)
      expect(field_30_boundingBox.x).toEqual(field_20_boundingBox.x)
      expect(field_30_boundingBox.y).not.toEqual(field_20_boundingBox.y)
      expect(field_30_boundingBox.height).toEqual(field_60_boundingBox.height)
      expect(collapsible_30_boundingBox.width).toEqual(field_30_boundingBox.width)

      expect(field_20_percent_width_within_row_a_box.y).toEqual(
        field_no_set_width_within_row_b_box.y,
      )
      expect(field_no_set_width_within_row_b_box.y).toEqual(field_no_set_width_within_row_c_box.y)
      expect(field_no_set_width_within_row_c_box.y).toEqual(
        field_20_percent_width_within_row_d_box.y,
      )

      expect(field_20_percent_width_within_row_a_box.width).toEqual(
        field_20_percent_width_within_row_d_box.width,
      )
      expect(field_no_set_width_within_row_b_box.width).toEqual(
        field_no_set_width_within_row_c_box.width,
      )
    }).toPass()
  })

  test('should render nested row fields in the correct position', async () => {
    await page.goto(url.create)

    // These fields are not given explicit `width` values
    await page.goto(url.create)
    const fieldA = page.locator('input#field-field_within_collapsible_a')
    await expect(fieldA).toBeVisible()
    const fieldB = page.locator('input#field-field_within_collapsible_b')
    await expect(fieldB).toBeVisible()
    const fieldABox = await fieldA.boundingBox()
    const fieldBBox = await fieldB.boundingBox()

    await expect(() => {
      // Check that the top value of the fields are the same
      expect(fieldABox.y).toEqual(fieldBBox.y)
      expect(fieldABox.height).toEqual(fieldBBox.height)
    }).toPass()
  })

  test('should respect admin.width for Blocks fields inside a row', async () => {
    await page.goto(url.create)

    // Target the Blocks field wrappers
    const left = page.locator('#field-leftColumn')
    const right = page.locator('#field-rightColumn')

    await expect(left).toBeVisible()
    await expect(right).toBeVisible()

    // 1) CSS variable is applied (via mergeFieldStyles)
    const leftVar = await left.evaluate((el) =>
      getComputedStyle(el).getPropertyValue('--field-width').trim(),
    )
    const rightVar = await right.evaluate((el) =>
      getComputedStyle(el).getPropertyValue('--field-width').trim(),
    )

    await expect(() => {
      expect(leftVar).toBe('50%')
      expect(rightVar).toBe('50%')
    }).toPass()

    // Also assert inline style contains the var (robust to other inline styles)
    await expect(left).toHaveAttribute('style', /--field-width:\s*50%/)
    await expect(right).toHaveAttribute('style', /--field-width:\s*50%/)

    // 2) Layout reflects the widths (same row, equal widths)
    const leftBox = await left.boundingBox()
    const rightBox = await right.boundingBox()

    await expect(() => {
      // Same row
      expect(Math.round(leftBox.y)).toEqual(Math.round(rightBox.y))
      // Equal width (tolerate sub-pixel differences)
      expect(Math.round(leftBox.width)).toEqual(Math.round(rightBox.width))
    }).toPass()
  })

  test('should respect admin.width for array fields inside a row', async () => {
    await page.goto(url.create)

    // Target the Array field wrappers
    const left = page.locator('#field-arrayLeftColumn')
    const right = page.locator('#field-arrayRightColumn')

    await expect(left).toBeVisible()
    await expect(right).toBeVisible()

    // 1) CSS variable is applied (via mergeFieldStyles)
    const leftVar = await left.evaluate((el) =>
      getComputedStyle(el).getPropertyValue('--field-width').trim(),
    )
    const rightVar = await right.evaluate((el) =>
      getComputedStyle(el).getPropertyValue('--field-width').trim(),
    )

    await expect(() => {
      expect(leftVar).toBe('50%')
      expect(rightVar).toBe('50%')
    }).toPass()

    // Also assert inline style contains the var (robust to other inline styles)
    await expect(left).toHaveAttribute('style', /--field-width:\s*50%/)
    await expect(right).toHaveAttribute('style', /--field-width:\s*50%/)

    // 2) Layout reflects the widths (same row, equal widths)
    const leftBox = await left.boundingBox()
    const rightBox = await right.boundingBox()

    await expect(() => {
      // Same row
      expect(Math.round(leftBox.y)).toEqual(Math.round(rightBox.y))
      // Equal width (tolerate sub-pixel differences)
      expect(Math.round(leftBox.width)).toEqual(Math.round(rightBox.width))
    }).toPass()
  })
})
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/fields/collections/Row/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { rowFieldsSlug } from '../../slugs.js'

const RowFields: CollectionConfig = {
  slug: rowFieldsSlug,
  versions: true,
  admin: {
    defaultColumns: ['title', 'id'],
  },
  fields: [
    {
      name: 'id',
      label: 'Custom ID',
      type: 'text',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          label: 'Title within a row',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'field_with_width_a',
          label: 'Field with 50% width',
          type: 'text',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'field_with_width_b',
          label: 'Field with 50% width',
          type: 'text',
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'field_with_width_30_percent',
          label: 'Field with 30% width',
          type: 'text',
          admin: {
            width: '30%',
          },
        },
        {
          name: 'field_with_width_60_percent',
          label: 'Field with 60% width',
          type: 'text',
          admin: {
            width: '60%',
          },
        },
        {
          name: 'field_with_width_20_percent',
          label: 'Field with 20% width',
          type: 'text',
          admin: {
            width: '20%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          label: 'Collapsible 30% width within a row',
          type: 'collapsible',
          fields: [
            {
              name: 'field_within_collapsible_a',
              label: 'Field within collapsible',
              type: 'text',
            },
          ],
          admin: {
            width: '30%',
          },
        },
        {
          label: 'Collapsible within a row',
          type: 'collapsible',
          fields: [
            {
              name: 'field_within_collapsible_b',
              label: 'Field within collapsible',
              type: 'text',
            },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          label: 'Explicit 20% width within a row (A)',
          type: 'text',
          name: 'field_20_percent_width_within_row_a',
          admin: {
            width: '20%',
          },
        },
        {
          label: 'No set width within a row (B)',
          type: 'text',
          name: 'no_set_width_within_row_b',
        },
        {
          label: 'No set width within a row (C)',
          type: 'text',
          name: 'no_set_width_within_row_c',
        },
        {
          label: 'Explicit 20% width within a row (D)',
          type: 'text',
          name: 'field_20_percent_width_within_row_d',
          admin: {
            width: '20%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'leftColumn',
          type: 'blocks',
          blocks: [
            {
              slug: 'leftTextBlock',
              fields: [
                {
                  name: 'leftText',
                  type: 'text',
                },
              ],
            },
          ],
          admin: {
            width: '50%',
          },
        },
        {
          name: 'rightColumn',
          type: 'blocks',
          blocks: [
            {
              slug: 'rightTextBlock',
              fields: [
                {
                  name: 'rightText',
                  type: 'text',
                },
              ],
            },
          ],
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'arrayLeftColumn',
          type: 'array',
          admin: {
            width: '50%',
          },
          fields: [
            {
              name: 'leftArrayChild',
              type: 'text',
            },
          ],
        },
        {
          name: 'arrayRightColumn',
          type: 'array',
          fields: [
            {
              name: 'rightArrayChild',
              type: 'text',
            },
          ],
          admin: {
            width: '50%',
          },
        },
      ],
    },
  ],
}

export default RowFields
```

--------------------------------------------------------------------------------

---[FILE: CustomJSXLabel.tsx]---
Location: payload-main/test/fields/collections/Select/CustomJSXLabel.tsx

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
Location: payload-main/test/fields/collections/Select/e2e.spec.ts

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
import { selectFieldsSlug } from '../../slugs.js'

const filename = fileURLToPath(import.meta.url)
const currentFolder = path.dirname(filename)
const dirname = path.resolve(currentFolder, '../../')

const { beforeAll, beforeEach, describe } = test

let payload: PayloadTestSDK<Config>
let client: RESTClient
let page: Page
let serverURL: string
let url: AdminUrlUtil

describe('Select', () => {
  beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)
    process.env.SEED_IN_CONFIG_ONINIT = 'false' // Makes it so the payload config onInit seed is not run. Otherwise, the seed would be run unnecessarily twice for the initial test run - once for beforeEach and once for onInit
    ;({ payload, serverURL } = await initPayloadE2ENoConfig<Config>({
      dirname,
      // prebuild,
    }))

    url = new AdminUrlUtil(serverURL, selectFieldsSlug)

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

  test('should use i18n option labels', async () => {
    await page.goto(url.create)

    const field = page.locator('#field-selectI18n')
    await field.click({ delay: 100 })
    const options = page.locator('.rs__option')
    // Select an option
    await options.locator('text=One').click()

    await saveDocAndAssert(page)
    await expect(field.locator('.rs__value-container')).toContainText('One')
  })

  test('should show custom JSX option label in edit', async () => {
    await page.goto(url.create)

    const svgLocator = page.locator('#field-selectWithJsxLabelOption svg#payload-logo')

    await expect(svgLocator).toBeVisible()
  })

  test('should show custom JSX option label in list', async () => {
    await page.goto(url.list)

    const columnsButton = page.locator('button:has-text("Columns")')

    await columnsButton.click()

    await page.locator('text=Select with JSX label option').click()

    await expect(page.locator('.cell-selectWithJsxLabelOption svg#payload-logo')).toBeVisible()
  })

  test('should reduce options', async () => {
    await page.goto(url.create)
    const field = page.locator('#field-selectWithFilteredOptions')
    await field.click({ delay: 100 })
    const options = page.locator('.rs__option')
    await expect(options.locator('text=One')).toBeVisible()

    // click the field again to close the options
    await field.click({ delay: 100 })

    await page.locator('#field-disallowOption1').click()
    await field.click({ delay: 100 })
    await expect(options.locator('text=One')).toBeHidden()
  })

  test('should retain search when reducing options', async () => {
    await page.goto(url.create)
    const field = page.locator('#field-selectWithFilteredOptions')
    await field.click({ delay: 100 })
    const options = page.locator('.rs__option')
    await expect(options.locator('text=One')).toBeVisible()
    await expect(options.locator('text=Two')).toBeVisible()
    await field.locator('input').fill('On')
    await expect(options.locator('text=One')).toBeVisible()
    await expect(options.locator('text=Two')).toBeHidden()
  })

  describe('A11y', () => {
    test.fixme('Create view should have no accessibility violations', async ({}, testInfo) => {
      await page.goto(url.create)
      await page.locator('#field-select').waitFor()

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
      const firstItem = page.locator('.cell-id a').nth(0)
      await firstItem.click()

      await page.locator('#field-select').waitFor()

      const scanResults = await runAxeScan({
        page,
        testInfo,
        include: ['.collection-edit__main'],
        exclude: ['.field-description'], // known issue - reported elsewhere @todo: remove this once fixed - see report https://github.com/payloadcms/payload/discussions/14489
      })

      expect(scanResults.violations.length).toBe(0)
    })

    test.fixme('Select fields have focus indicators', async ({}, testInfo) => {
      await page.goto(url.create)
      await page.locator('#field-select').waitFor()

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
Location: payload-main/test/fields/collections/Select/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { selectFieldsSlug } from '../../slugs.js'
import { CustomJSXLabel } from './CustomJSXLabel.js'

const SelectFields: CollectionConfig = {
  slug: selectFieldsSlug,
  versions: true,
  fields: [
    {
      name: 'select',
      type: 'select',
      admin: {
        isClearable: true,
      },
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
          label: 'Value Three',
          value: 'three',
        },
      ],
    },
    {
      name: 'selectReadOnly',
      type: 'select',
      admin: {
        readOnly: true,
      },
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
          label: 'Value Three',
          value: 'three',
        },
      ],
    },
    {
      name: 'selectHasMany',
      hasMany: true,
      type: 'select',
      admin: {
        isClearable: true,
        isSortable: true,
      },
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
          label: 'Value Three',
          value: 'three',
        },
        {
          label: 'Value Four',
          value: 'four',
        },
        {
          label: 'Value Five',
          value: 'five',
        },
        {
          label: 'Value Six',
          value: 'six',
        },
      ],
    },
    {
      name: 'array',
      type: 'array',
      fields: [
        {
          name: 'selectHasMany',
          hasMany: true,
          type: 'select',
          admin: {
            isClearable: true,
            isSortable: true,
          },
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
              label: 'Value Three',
              value: 'three',
            },
            {
              label: 'Value Four',
              value: 'four',
            },
            {
              label: 'Value Five',
              value: 'five',
            },
            {
              label: 'Value Six',
              value: 'six',
            },
          ],
        },
        {
          name: 'group',
          type: 'group',
          fields: [
            {
              name: 'selectHasMany',
              hasMany: true,
              type: 'select',
              admin: {
                isClearable: true,
                isSortable: true,
              },
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
                  label: 'Value Three',
                  value: 'three',
                },
                {
                  label: 'Value Four',
                  value: 'four',
                },
                {
                  label: 'Value Five',
                  value: 'five',
                },
                {
                  label: 'Value Six',
                  value: 'six',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'selectHasManyLocalized',
      type: 'select',
      hasMany: true,
      localized: true,
      options: [
        {
          label: 'Value One',
          value: 'one',
        },
        {
          label: 'Value Two',
          value: 'two',
        },
      ],
    },
    {
      name: 'selectI18n',
      type: 'select',
      admin: {
        isClearable: true,
      },
      options: [
        {
          value: 'one',
          label: { en: 'One', es: 'Uno' },
        },
        {
          value: 'two',
          label: { en: 'Two', es: 'Dos' },
        },
        {
          value: 'three',
          label: { en: 'Three', es: 'Tres' },
        },
      ],
    },
    {
      name: 'simple',
      type: 'select',
      options: ['One', 'Two', 'Three'],
    },
    {
      type: 'group',
      name: 'settings',
      fields: [
        {
          name: 'category',
          type: 'select',
          hasMany: true,
          options: [
            { value: 'a', label: 'A' },
            { value: 'b', label: 'B' },
          ],
        },
      ],
    },
    {
      name: 'selectWithJsxLabelOption',
      label: 'Select with JSX label option',
      type: 'select',
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
    {
      name: 'disallowOption1',
      type: 'checkbox',
    },
    {
      name: 'selectWithFilteredOptions',
      label: 'Select with filtered options',
      type: 'select',
      defaultValue: 'one',
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
          label: 'Value Three',
          value: 'three',
        },
      ],
      filterOptions: ({ options, data }) =>
        data.disallowOption1
          ? options.filter(
              (option) => (typeof option === 'string' ? options : option.value) !== 'one',
            )
          : options,
    },
  ],
}

export default SelectFields
```

--------------------------------------------------------------------------------

---[FILE: shared.ts]---
Location: payload-main/test/fields/collections/Select/shared.ts

```typescript
import type { SelectField } from '../../payload-types.js'

export const selectsDoc: Partial<SelectField> = {
  select: 'one',
  selectHasMany: ['two', 'four'],
  settings: {
    category: ['a'],
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/fields/collections/SelectVersions/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { selectVersionsFieldsSlug } from '../../slugs.js'

const SelectVersionsFields: CollectionConfig = {
  slug: selectVersionsFieldsSlug,
  versions: { drafts: { autosave: true } },
  fields: [
    {
      type: 'select',
      hasMany: true,
      options: ['a', 'b', 'c', 'd'],
      name: 'hasMany',
    },
    {
      type: 'array',
      name: 'array',
      fields: [
        {
          type: 'select',
          hasMany: true,
          options: ['a', 'b', 'c'],
          name: 'hasManyArr',
        },
      ],
    },
    {
      type: 'blocks',
      name: 'blocks',
      blocks: [
        {
          slug: 'block',
          fields: [
            {
              type: 'select',
              hasMany: true,
              options: ['a', 'b', 'c'],
              name: 'hasManyBlocks',
            },
          ],
        },
      ],
    },
  ],
}

export default SelectVersionsFields
```

--------------------------------------------------------------------------------

````
