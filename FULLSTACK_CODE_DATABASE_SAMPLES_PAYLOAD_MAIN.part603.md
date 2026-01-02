---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 603
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 603 of 695)

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

---[FILE: Component.tsx]---
Location: payload-main/test/lexical/collections/OnDemandOutsideForm/Component.tsx
Signals: React

```typescript
'use client'

import type { DefaultNodeTypes, DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { JSONFieldClientComponent } from 'payload'

import { buildEditorState, RenderLexical } from '@payloadcms/richtext-lexical/client'
import React, { useState } from 'react'

export const Component: JSONFieldClientComponent = () => {
  const [value, setValue] = useState<DefaultTypedEditorState | undefined>(() =>
    buildEditorState<DefaultNodeTypes>({ text: 'state default' }),
  )

  const handleReset = React.useCallback(() => {
    setValue(buildEditorState<DefaultNodeTypes>({ text: 'state default' }))
  }, [])

  return (
    <div>
      Default Component:
      <RenderLexical
        field={{ name: 'myField', label: 'My Label' }}
        initialValue={buildEditorState<DefaultNodeTypes>({ text: 'defaultValue' })}
        schemaPath={`collection.OnDemandOutsideForm.hiddenAnchor`}
        setValue={setValue as any}
        value={value}
      />
      <button onClick={handleReset} style={{ marginTop: 8 }} type="button">
        Reset Editor State
      </button>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/lexical/collections/OnDemandOutsideForm/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { EXPERIMENTAL_TableFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

export const OnDemandOutsideForm: CollectionConfig = {
  slug: 'OnDemandOutsideForm',
  fields: [
    {
      name: 'json',
      type: 'json',
      admin: {
        components: {
          Field: './collections/OnDemandOutsideForm/Component.js#Component',
        },
      },
    },
    {
      name: 'hiddenAnchor',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [...rootFeatures, EXPERIMENTAL_TableFeature()],
      }),
      admin: {
        hidden: true,
      },
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: blocks.ts]---
Location: payload-main/test/lexical/collections/RichText/blocks.ts

```typescript
import type { Block } from 'payload'

import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const TextBlock: Block = {
  fields: [
    {
      name: 'text',
      type: 'text',
      required: true,
    },
  ],
  slug: 'textRequired',
}

export const UploadAndRichTextBlock: Block = {
  fields: [
    {
      name: 'upload',
      type: 'upload',
      relationTo: 'uploads',
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor(),
    },
  ],
  slug: 'uploadAndRichText',
}

export const RelationshipBlock: Block = {
  fields: [
    {
      name: 'rel',
      type: 'relationship',
      relationTo: 'uploads',
      required: true,
    },
  ],
  slug: 'relationshipBlock',
}

export const SelectFieldBlock: Block = {
  fields: [
    {
      name: 'select',
      type: 'select',
      options: [
        {
          label: 'Option 1',
          value: 'option1',
        },
        {
          label: 'Option 2',
          value: 'option2',
        },
        {
          label: 'Option 3',
          value: 'option3',
        },
        {
          label: 'Option 4',
          value: 'option4',
        },
        {
          label: 'Option 5',
          value: 'option5',
        },
      ],
    },
  ],
  slug: 'select',
}
```

--------------------------------------------------------------------------------

---[FILE: data.ts]---
Location: payload-main/test/lexical/collections/RichText/data.ts

```typescript
import { generateLexicalRichText } from './generateLexicalRichText.js'
import { generateSlateRichText } from './generateSlateRichText.js'

export const richTextBlocks = [
  {
    blockType: 'textBlock',
    text: 'Regular text',
  },
  {
    blockType: 'richTextBlockSlate',
    text: [
      {
        children: [
          {
            text: 'Rich text',
          },
        ],
        type: 'h1',
      },
    ],
  },
]
export const richTextDocData = {
  title: 'Rich Text',
  selectHasMany: ['one', 'five'],
  richText: generateSlateRichText(),
  richTextReadOnly: generateSlateRichText(),
  richTextCustomFields: generateSlateRichText(),
  lexicalCustomFields: generateLexicalRichText(),
  blocks: richTextBlocks,
}

export const richTextBulletsDocData = {
  title: 'Bullets and Indentation',
  lexicalCustomFields: generateLexicalRichText(),
  richText: [
    {
      type: 'ul',
      children: [
        {
          type: 'li',
          children: [
            {
              children: [
                {
                  text: 'I am semantically connected to my sub-bullets',
                },
              ],
            },
            {
              type: 'ul',
              children: [
                {
                  type: 'li',
                  children: [
                    {
                      text: 'I am sub-bullets that are semantically connected to the parent bullet',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          children: [
            {
              text: 'Normal bullet',
            },
          ],
          type: 'li',
        },
        {
          type: 'li',
          children: [
            {
              type: 'ul',
              children: [
                {
                  type: 'li',
                  children: [
                    {
                      text: 'I am the old style of sub-bullet',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'li',
          children: [
            {
              text: 'Another normal bullet',
            },
          ],
        },
        {
          type: 'li',
          children: [
            {
              children: [
                {
                  text: 'This text precedes a nested list',
                },
              ],
            },
            {
              type: 'ul',
              children: [
                {
                  type: 'li',
                  children: [
                    {
                      text: 'I am a sub-bullet',
                    },
                  ],
                },
                {
                  type: 'li',
                  children: [
                    {
                      text: 'And I am another sub-bullet',
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
```

--------------------------------------------------------------------------------

---[FILE: e2e.spec.ts]---
Location: payload-main/test/lexical/collections/RichText/e2e.spec.ts

```typescript
import type { Page } from '@playwright/test'

import { expect, test } from '@playwright/test'
import path from 'path'
import { wait } from 'payload/shared'
import { fileURLToPath } from 'url'

import {
  ensureCompilationIsDone,
  initPageConsoleErrorCatch,
  saveDocAndAssert,
} from '../../../helpers.js'
import { AdminUrlUtil } from '../../../helpers/adminUrlUtil.js'
import { initPayloadE2ENoConfig } from '../../../helpers/initPayloadE2ENoConfig.js'
import { reInitializeDB } from '../../../helpers/reInitializeDB.js'
import { POLL_TOPASS_TIMEOUT, TEST_TIMEOUT_LONG } from '../../../playwright.config.js'

const filename = fileURLToPath(import.meta.url)
const currentFolder = path.dirname(filename)
const dirname = path.resolve(currentFolder, '../../')

const { beforeAll, beforeEach, describe } = test

let page: Page
let serverURL: string
// If we want to make this run in parallel: test.describe.configure({ mode: 'parallel' })

describe('Rich Text', () => {
  beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)
    process.env.SEED_IN_CONFIG_ONINIT = 'false' // Makes it so the payload config onInit seed is not run. Otherwise, the seed would be run unnecessarily twice for the initial test run - once for beforeEach and once for onInit
    ;({ serverURL } = await initPayloadE2ENoConfig<Config>({
      dirname,
    }))

    const context = await browser.newContext()
    page = await context.newPage()
    initPageConsoleErrorCatch(page)

    await ensureCompilationIsDone({ page, serverURL })
  })
  beforeEach(async () => {
    await reInitializeDB({
      serverURL,
      snapshotKey: 'lexicalTest',
      uploadsDir: [path.resolve(dirname, './collections/Upload/uploads')],
    })

    await ensureCompilationIsDone({ page, serverURL })
  })

  async function navigateToRichTextFields() {
    const url: AdminUrlUtil = new AdminUrlUtil(serverURL, 'rich-text-fields')
    await page.goto(url.list)

    const linkToDoc = page.locator('.row-1 .cell-title a').first()
    await expect(() => expect(linkToDoc).toBeTruthy()).toPass({ timeout: POLL_TOPASS_TIMEOUT })
    const linkDocHref = await linkToDoc.getAttribute('href')

    await linkToDoc.click()

    await page.waitForURL(`**${linkDocHref}`)
  }

  describe('cell', () => {
    test('ensure cells are smaller than 300px in height', async () => {
      const url: AdminUrlUtil = new AdminUrlUtil(serverURL, 'rich-text-fields')
      await page.goto(url.list) // Navigate to rich-text list view

      const table = page.locator('.table-wrap .table')
      await expect(table).toBeVisible()

      const lexicalCell = table.locator('.cell-lexicalCustomFields').first()
      await expect(lexicalCell).toBeVisible()

      const lexicalHtmlCell = table.locator('.cell-lexicalCustomFields_html').first()
      await expect(lexicalHtmlCell).toBeVisible()

      const entireRow = table.locator('.row-1').first()

      // Make sure each of the 3 above are no larger than 300px in height:
      await expect
        .poll(async () => (await lexicalCell.boundingBox())?.height, {
          timeout: POLL_TOPASS_TIMEOUT,
        })
        .toBeLessThanOrEqual(300)

      await expect
        .poll(async () => (await lexicalHtmlCell.boundingBox())?.height, {
          timeout: POLL_TOPASS_TIMEOUT,
        })
        .toBeLessThanOrEqual(300)

      await expect
        .poll(async () => (await entireRow.boundingBox())?.height, { timeout: POLL_TOPASS_TIMEOUT })
        .toBeLessThanOrEqual(300)
    })
  })

  describe('toolbar', () => {
    test('should run url validation', async () => {
      await navigateToRichTextFields()

      // Open link drawer
      await page.locator('.rich-text__toolbar button:not([disabled]) .link').first().click()

      // find the drawer
      const editLinkModal = page.locator('[id^=drawer_1_rich-text-link-]')
      await expect(editLinkModal).toBeVisible()

      // Fill values and click Confirm
      await editLinkModal.locator('#field-text').fill('link text')
      await editLinkModal.locator('label[for="field-linkType-custom-2"]').click()
      await editLinkModal.locator('#field-url').fill('')
      await wait(200)
      await editLinkModal.locator('button[type="submit"]').click()
      await wait(400)
      const errorField = page.locator(
        '[id^=drawer_1_rich-text-link-] .render-fields > :nth-child(3)',
      )
      const hasErrorClass = await errorField.evaluate((el) => el.classList.contains('error'))
      expect(hasErrorClass).toBe(true)
    })

    // TODO: Flaky test flakes consistently in CI: https://github.com/payloadcms/payload/actions/runs/8913431889/job/24478995959?pr=6155
    test.skip('should create new url custom link', async () => {
      await navigateToRichTextFields()

      // Open link drawer
      await page.locator('.rich-text__toolbar button:not([disabled]) .link').first().click()

      // find the drawer
      const editLinkModal = page.locator('[id^=drawer_1_rich-text-link-]')
      await expect(editLinkModal).toBeVisible()

      await wait(400)
      // Fill values and click Confirm
      await editLinkModal.locator('#field-text').fill('link text')
      await editLinkModal.locator('label[for="field-linkType-custom-2"]').click()
      await editLinkModal.locator('#field-url').fill('https://payloadcms.com')
      await editLinkModal.locator('button[type="submit"]').click()
      await expect(editLinkModal).toBeHidden()
      await wait(400)
      await saveDocAndAssert(page)

      // Remove link from editor body
      await page.locator('span >> text="link text"').click()
      const popup = page.locator('.popup--active .rich-text-link__popup')
      await expect(popup.locator('.rich-text-link__link-label')).toBeVisible()
      await popup.locator('.rich-text-link__link-close').click()
      await expect(page.locator('span >> text="link text"')).toHaveCount(0)
    })

    // TODO: Flaky test flakes consistently in CI: https://github.com/payloadcms/payload/actions/runs/8913769794/job/24480056251?pr=6155
    test.skip('should create new internal link', async () => {
      await navigateToRichTextFields()

      // Open link drawer
      await page.locator('.rich-text__toolbar button:not([disabled]) .link').first().click()

      // find the drawer
      const editLinkModal = page.locator('[id^=drawer_1_rich-text-link-]')
      await expect(editLinkModal).toBeVisible()
      await wait(400)

      // Fill values and click Confirm
      await editLinkModal.locator('#field-text').fill('link text')
      await editLinkModal.locator('label[for="field-linkType-internal-2"]').click()
      await editLinkModal.locator('#field-doc .rs__control').click()
      await page.keyboard.type('dev@')
      await editLinkModal
        .locator('#field-doc .rs__menu .rs__option:has-text("dev@payloadcms.com")')
        .click()
      // await wait(200);
      await editLinkModal.locator('button[type="submit"]').click()
      await saveDocAndAssert(page)
    })

    test('should not create new url link when read only', async () => {
      await navigateToRichTextFields()
      const modalTrigger = page.locator('.rich-text--read-only .rich-text__toolbar button .link')
      await expect(modalTrigger).toBeDisabled()
    })

    // TODO: this test can't find the selector for the search filter, but functionality works.
    // Need to debug
    test.skip('should search correct useAsTitle field after toggling collection in list drawer', async () => {
      await navigateToRichTextFields()

      // open link drawer
      const field = page.locator('#field-richText')
      const button = field.locator(
        'button.rich-text-relationship__list-drawer-toggler.list-drawer__toggler',
      )
      await button.click()

      // check that the search is on the `name` field of the `text-fields` collection
      const drawer = page.locator('[id^=list-drawer_1_]')

      await expect(drawer.locator('.search-filter__input')).toHaveAttribute(
        'placeholder',
        'Search by Text',
      )

      // change the selected collection to `array-fields`
      await page.locator('.list-drawer_select-collection-wrap .rs__control').click()
      const menu = page.locator('.list-drawer__select-collection-wrap .rs__menu')
      await menu.locator('.rs__option').getByText('Array Field').click()

      // check that `id` is now the default search field
      await expect(drawer.locator('.search-filter__input')).toHaveAttribute(
        'placeholder',
        'Search by ID',
      )
    })

    test('should only list RTE enabled collections in link drawer', async () => {
      await navigateToRichTextFields()
      await wait(1000)

      await page.locator('.rich-text__toolbar button:not([disabled]) .link').first().click()

      const editLinkModal = page.locator('[id^=drawer_1_rich-text-link-]')
      await expect(editLinkModal).toBeVisible()

      await wait(1000)

      await editLinkModal.locator('label[for="field-linkType-internal-2"]').click()
      await editLinkModal.locator('.relationship__wrap .rs__control').click()

      const menu = page.locator('.relationship__wrap .rs__menu')

      // array-fields has enableRichTextLink set to false
      await expect(menu).not.toContainText('Array Fields')
    })

    test('should only list non-upload collections in relationship drawer', async () => {
      await navigateToRichTextFields()
      await wait(1000)

      // Open link drawer
      await page
        .locator('.rich-text__toolbar button:not([disabled]) .relationship-rich-text-button')
        .first()
        .click()

      await wait(1000)

      // open the list select menu
      await page.locator('.list-drawer__select-collection-wrap .rs__control').click()

      const menu = page.locator('.list-drawer__select-collection-wrap .rs__menu')
      const regex = /\bUploads\b/
      await expect(menu).not.toContainText(regex)
    })

    // TODO: Flaky test in CI. Flake: https://github.com/payloadcms/payload/actions/runs/8914532814/job/24482407114
    test.skip('should respect customizing the default fields', async () => {
      const linkText = 'link'
      const value = 'test value'
      await navigateToRichTextFields()
      await wait(1000)

      const field = page.locator('.rich-text', {
        has: page.locator('#field-richTextCustomFields'),
      })
      // open link drawer
      const button = field.locator('button.rich-text__button.link')
      await button.click()
      await wait(1000)

      // fill link fields
      const linkDrawer = page.locator('[id^=drawer_1_rich-text-link-]')
      const fields = linkDrawer.locator('.render-fields > .field-type')
      await fields.locator('#field-text').fill(linkText)
      await fields.locator('#field-url').fill('https://payloadcms.com')
      const input = fields.locator('#field-fields__customLinkField')
      await input.fill(value)

      await wait(1000)

      // submit link closing drawer
      await linkDrawer.locator('button[type="submit"]').click()
      const linkInEditor = field.locator(`.rich-text-link >> text="${linkText}"`)
      await wait(300)

      await saveDocAndAssert(page)

      // open modal again
      await linkInEditor.click()

      const popup = page.locator('.popup--active .rich-text-link__popup')
      await expect(popup).toBeVisible()

      await popup.locator('.rich-text-link__link-edit').click()

      const linkDrawer2 = page.locator('[id^=drawer_1_rich-text-link-]')
      const fields2 = linkDrawer2.locator('.render-fields > .field-type')
      const input2 = fields2.locator('#field-fields__customLinkField')

      await expect(input2).toHaveValue(value)
    })
  })

  describe('editor', () => {
    test('should populate url link', async () => {
      await navigateToRichTextFields()
      await wait(500)

      // Open link popup
      await page.locator('#field-richText span >> text="render links"').click()
      const popup = page.locator('.popup__content .rich-text-link__popup')
      await expect(popup).toBeVisible()
      await expect(popup.locator('a')).toHaveAttribute('href', 'https://payloadcms.com')

      // Open the drawer
      await popup.locator('.rich-text-link__link-edit').click()
      const editLinkModal = page.locator('[id^=drawer_1_rich-text-link-]')
      await expect(editLinkModal).toBeVisible()

      // Check the drawer values
      const textField = editLinkModal.locator('#field-text')
      await expect(textField).toHaveValue('render links')

      await wait(1000)
      // Close the drawer
      await editLinkModal.locator('button[type="submit"]').click()
      await expect(editLinkModal).toBeHidden()
    })

    test('should populate relationship link', async () => {
      await navigateToRichTextFields()

      // Open link popup
      await page.locator('#field-richText span >> text="link to relationships"').click()
      const popup = page.locator('.popup__content .rich-text-link__popup')
      await expect(popup).toBeVisible()
      await expect(popup.locator('a')).toHaveAttribute(
        'href',
        /\/admin\/collections\/array-fields\/.*/,
      )

      // Open the drawer
      await popup.locator('.rich-text-link__link-edit').click()
      const editLinkModal = page.locator('[id^=drawer_1_rich-text-link-]')
      await expect(editLinkModal).toBeVisible()

      // Check the drawer values
      const textField = editLinkModal.locator('#field-text')
      await expect(textField).toHaveValue('link to relationships')
    })

    test('should open upload drawer and render custom relationship fields', async () => {
      await navigateToRichTextFields()
      const field = page.locator('#field-richText')
      const button = field.locator('button.rich-text-upload__upload-drawer-toggler')

      await button.click()

      const documentDrawer = page.locator('[id^=drawer_1_upload-drawer-]')
      await expect(documentDrawer).toBeVisible()
      const caption = documentDrawer.locator('#field-caption')
      await expect(caption).toBeVisible()
    })

    test('should open upload document drawer from read-only field', async () => {
      await navigateToRichTextFields()
      const field = page.locator('#field-richTextReadOnly')
      const button = field.locator(
        'button.rich-text-upload__doc-drawer-toggler.doc-drawer__toggler',
      )

      await button.click()

      const documentDrawer = page.locator('[id^=doc-drawer_uploads_1_]')
      await expect(documentDrawer).toBeVisible()
    })

    test('should open relationship document drawer from read-only field', async () => {
      await navigateToRichTextFields()
      const field = page.locator('#field-richTextReadOnly')
      const button = field.locator(
        'button.rich-text-relationship__doc-drawer-toggler.doc-drawer__toggler',
      )

      await button.click()

      const documentDrawer = page.locator('[id^=doc-drawer_text-fields_1_]')
      await expect(documentDrawer).toBeVisible()
    })

    test('should populate new links', async () => {
      await navigateToRichTextFields()
      await wait(1000)

      // Highlight existing text
      const headingElement = page.locator(
        '#field-richText h1 >> text="Hello, I\'m a rich text field."',
      )
      await headingElement.selectText()

      await wait(500)

      // click the toolbar link button
      await page.locator('.rich-text__toolbar button:not([disabled]) .link').first().click()

      // find the drawer and confirm the values
      const editLinkModal = page.locator('[id^=drawer_1_rich-text-link-]')
      await expect(editLinkModal).toBeVisible()
      const textField = editLinkModal.locator('#field-text')
      await expect(textField).toHaveValue("Hello, I'm a rich text field.")
    })
    test('should not take value from previous block', async () => {
      await navigateToRichTextFields()
      await page.locator('#field-blocks').scrollIntoViewIfNeeded()
      await expect(page.locator('#field-blocks__0__text')).toBeVisible()
      await expect(page.locator('#field-blocks__0__text')).toHaveValue('Regular text')
      await wait(500)
      const editBlock = page.locator('#blocks-row-0 .popup-button')
      await editBlock.click()
      const removeButton = page.locator('.popup__content').getByRole('button', { name: 'Remove' })
      await expect(removeButton).toBeVisible()
      await wait(500)
      await removeButton.click()
      const richTextField = page.locator('#field-blocks__0__text')
      await expect(richTextField).toBeVisible()
      const richTextValue = await richTextField.innerText()
      expect(richTextValue).toContain('Rich text')
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: generateLexicalRichText.ts]---
Location: payload-main/test/lexical/collections/RichText/generateLexicalRichText.ts

```typescript
import { textFieldsSlug } from '../../slugs.js'
import { loremIpsum } from './loremIpsum.js'

export function generateLexicalRichText() {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: [
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: "Hello, I'm a rich text field.",
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: 'center',
          indent: 0,
          type: 'heading',
          version: 1,
          tag: 'h1',
        },
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'I can do all kinds of fun stuff like ',
              type: 'text',
              version: 1,
            },
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'render links',
                  type: 'text',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              id: '665d10938106ab380c7f3730',
              type: 'link',
              version: 2,
              fields: {
                url: 'https://payloadcms.com',
                newTab: true,
                linkType: 'custom',
              },
            },
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: ', ',
              type: 'text',
              version: 1,
            },
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'link to relationships',
                  type: 'text',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              id: '665d10938106ab380c7f3730',
              type: 'link',
              version: 2,
              fields: {
                url: 'https://',
                doc: {
                  value: '{{TEXT_DOC_ID}}',
                  relationTo: textFieldsSlug,
                },
                newTab: false,
                linkType: 'internal',
              },
            },
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: ', and store nested relationship fields:',
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
        },
        {
          format: '',
          type: 'relationship',
          version: 2,
          value: '{{TEXT_DOC_ID}}',
          relationTo: 'text-fields',
        },
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'You can build your own elements, too.',
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
        },
        {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: "It's built with Lexical",
                  type: 'text',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              type: 'listitem',
              version: 1,
              value: 1,
            },
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'It stores content as JSON so you can use it wherever you need',
                  type: 'text',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              type: 'listitem',
              version: 1,
              value: 2,
            },
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: "It's got a great editing experience for non-technical users",
                  type: 'text',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              type: 'listitem',
              version: 1,
              value: 3,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'list',
          version: 1,
          listType: 'bullet',
          start: 1,
          tag: 'ul',
        },
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'And a whole lot more.',
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
        },
        {
          format: '',
          type: 'upload',
          version: 2,
          id: '665d10938106ab380c7f372f',
          relationTo: 'uploads',
          value: '{{UPLOAD_DOC_ID}}',
          fields: {
            caption: {
              root: {
                type: 'root',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  ...[...Array(4)].map(() => ({
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    type: 'paragraph',
                    version: 1,
                    children: [
                      {
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: loremIpsum,
                        type: 'text',
                        version: 1,
                      },
                    ],
                  })),
                ],
                direction: 'ltr',
              },
            },
          },
        },
        {
          children: [],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
        },
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam hendrerit nisi sed sollicitudin pellentesque. Nunc posuere purus rhoncus pulvinar aliquam. Ut aliquet tristique nisl vitae volutpat. Nulla aliquet porttitor venenatis. Donec a dui et dui fringilla consectetur id nec massa. Aliquam erat volutpat. Sed ut dui ut lacus dictum fermentum vel tincidunt neque. Sed sed lacinia lectus. Duis sit amet sodales felis. Duis nunc eros, mattis at dui ac, convallis semper risus. In adipiscing ultrices tellus, in suscipit massa vehicula eu.',
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
        },
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam hendrerit nisi sed sollicitudin pellentesque. Nunc posuere purus rhoncus pulvinar aliquam. Ut aliquet tristique nisl vitae volutpat. Nulla aliquet porttitor venenatis. Donec a dui et dui fringilla consectetur id nec massa. Aliquam erat volutpat. Sed ut dui ut lacus dictum fermentum vel tincidunt neque. Sed sed lacinia lectus. Duis sit amet sodales felis. Duis nunc eros, mattis at dui ac, convallis semper risus. In adipiscing ultrices tellus, in suscipit massa vehicula eu.',
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
        },
      ],
      direction: 'ltr',
    },
  }
}
```

--------------------------------------------------------------------------------

---[FILE: generateSlateRichText.ts]---
Location: payload-main/test/lexical/collections/RichText/generateSlateRichText.ts

```typescript
import { loremIpsum } from './loremIpsum.js'

export function generateSlateRichText() {
  return [
    {
      children: [
        {
          text: "Hello, I'm a rich text field.",
        },
      ],
      type: 'h1',
      textAlign: 'center',
    },
    {
      children: [
        {
          text: 'I can do all kinds of fun stuff like ',
        },
        {
          type: 'link',
          url: 'https://payloadcms.com',
          newTab: true,
          children: [
            {
              text: 'render links',
            },
          ],
        },
        {
          text: ', ',
        },
        {
          type: 'link',
          linkType: 'internal',
          doc: {
            value: '{{ARRAY_DOC_ID}}',
            relationTo: 'array-fields',
          },
          fields: {},
          children: [
            {
              text: 'link to relationships',
            },
          ],
        },
        {
          text: ', and store nested relationship fields:',
        },
      ],
    },
    {
      children: [
        {
          text: '',
        },
      ],
      type: 'relationship',
      value: {
        id: '{{TEXT_DOC_ID}}',
      },
      relationTo: 'text-fields',
    },
    {
      children: [
        {
          text: 'You can build your own elements, too.',
        },
      ],
    },
    {
      type: 'ul',
      children: [
        {
          children: [
            {
              // This node is untyped, because I want to test this scenario:
              // https://github.com/payloadcms/payload/pull/13202
              children: [
                {
                  text: 'This editor is built ',
                },
                {
                  text: 'with SlateJS',
                },
              ],
            },
          ],
          type: 'li',
        },
        {
          type: 'li',
          children: [
            {
              text: 'It stores content as JSON so you can use it wherever you need',
            },
          ],
        },
        {
          type: 'li',
          children: [
            {
              text: "It's got a great editing experience for non-technical users",
            },
          ],
        },
      ],
    },
    {
      children: [
        {
          text: 'And a whole lot more.',
        },
      ],
    },
    {
      children: [
        {
          text: '',
        },
      ],
      type: 'upload',
      value: {
        id: '{{UPLOAD_DOC_ID}}',
      },
      relationTo: 'uploads',
      fields: {
        caption: [
          ...[...Array(4)].map(() => {
            return {
              children: [
                {
                  text: loremIpsum,
                },
              ],
            }
          }),
        ],
      },
    },
    {
      children: [
        {
          text: '',
        },
      ],
    },
    ...[...Array(2)].map(() => {
      return {
        children: [
          {
            text: loremIpsum,
          },
        ],
      }
    }),
  ]
}
```

--------------------------------------------------------------------------------

````
