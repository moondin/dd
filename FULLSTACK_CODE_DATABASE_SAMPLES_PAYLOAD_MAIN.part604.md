---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 604
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 604 of 695)

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
Location: payload-main/test/lexical/collections/RichText/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import {
  BlocksFeature,
  HTMLConverterFeature,
  lexicalEditor,
  lexicalHTML,
  LinkFeature,
  TreeViewFeature,
  UploadFeature,
} from '@payloadcms/richtext-lexical'
import { slateEditor } from '@payloadcms/richtext-slate'

import { richTextFieldsSlug } from '../../slugs.js'
import { RelationshipBlock, SelectFieldBlock, TextBlock, UploadAndRichTextBlock } from './blocks.js'

const RichTextFields: CollectionConfig = {
  slug: richTextFieldsSlug,
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'lexicalCustomFields',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          TreeViewFeature(),
          HTMLConverterFeature({}),
          LinkFeature({
            fields: ({ defaultFields }) => [
              ...defaultFields,
              {
                name: 'rel',
                label: 'Rel Attribute',
                type: 'select',
                hasMany: true,
                options: ['noopener', 'noreferrer', 'nofollow'],
                admin: {
                  description:
                    'The rel attribute defines the relationship between a linked resource and the current document. This is a custom link field.',
                },
              },
            ],
          }),
          UploadFeature({
            collections: {
              uploads: {
                fields: [
                  {
                    name: 'caption',
                    type: 'richText',
                    editor: lexicalEditor(),
                  },
                ],
              },
            },
          }),
          BlocksFeature({
            blocks: [TextBlock, UploadAndRichTextBlock, SelectFieldBlock, RelationshipBlock],
          }),
        ],
      }),
    },
    lexicalHTML('lexicalCustomFields', { name: 'lexicalCustomFields_html' }),
    {
      name: 'lexical',
      type: 'richText',
      admin: {
        description: 'This rich text field uses the lexical editor.',
      },
      defaultValue: {
        root: {
          children: [
            {
              children: [
                {
                  text: 'This is a paragraph.',
                  type: 'text',
                },
              ],
              direction: null,
              format: '',
              indent: 0,
              type: 'paragraph',
              version: 1,
            },
          ],
          direction: null,
          format: '',
          indent: 0,
          type: 'root',
          version: 1,
        },
      },
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [...defaultFeatures, TreeViewFeature()],
      }),
    },
    {
      name: 'selectHasMany',
      hasMany: true,
      type: 'select',
      admin: {
        description:
          'This select field is rendered here to ensure its options dropdown renders above the rich text toolbar.',
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
      name: 'richText',
      type: 'richText',
      editor: slateEditor({
        admin: {
          elements: [
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'ul',
            'ol',
            'textAlign',
            'indent',
            'link',
            'relationship',
            'upload',
          ],
          link: {
            fields: [
              {
                name: 'rel',
                label: 'Rel Attribute',
                type: 'select',
                hasMany: true,
                options: ['noopener', 'noreferrer', 'nofollow'],
                admin: {
                  description:
                    'The rel attribute defines the relationship between a linked resource and the current document. This is a custom link field.',
                },
              },
            ],
          },
          upload: {
            collections: {
              uploads: {
                fields: [
                  {
                    name: 'caption',
                    type: 'richText',
                    editor: slateEditor({}),
                  },
                ],
              },
            },
          },
        },
      }),
      required: true,
    },
    {
      name: 'richTextCustomFields',
      type: 'richText',
      editor: slateEditor({
        admin: {
          elements: [
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'ul',
            'ol',
            'indent',
            'link',
            'relationship',
            'upload',
          ],
          link: {
            fields: ({ defaultFields }) => {
              return [
                ...defaultFields,
                {
                  label: 'Custom',
                  name: 'customLinkField',
                  type: 'text',
                },
              ]
            },
          },
          upload: {
            collections: {
              uploads: {
                fields: [
                  {
                    name: 'caption',
                    type: 'richText',
                    editor: slateEditor({}),
                  },
                ],
              },
            },
          },
        },
      }),
    },
    {
      name: 'richTextReadOnly',
      type: 'richText',
      admin: {
        readOnly: true,
      },
      editor: slateEditor({
        admin: {
          elements: [
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'ul',
            'ol',
            'indent',
            'link',
            'relationship',
            'upload',
          ],
          link: {
            fields: [
              {
                name: 'rel',
                label: 'Rel Attribute',
                type: 'select',
                hasMany: true,
                options: ['noopener', 'noreferrer', 'nofollow'],
                admin: {
                  description:
                    'The rel attribute defines the relationship between a linked resource and the current document. This is a custom link field.',
                },
              },
            ],
          },
          upload: {
            collections: {
              uploads: {
                fields: [
                  {
                    name: 'caption',
                    type: 'richText',
                  },
                ],
              },
            },
          },
        },
      }),
    },
    {
      name: 'blocks',
      type: 'blocks',
      blocks: [
        {
          slug: 'textBlock',
          fields: [
            {
              name: 'text',
              type: 'text',
            },
          ],
        },
        {
          slug: 'richTextBlockSlate',
          fields: [
            {
              editor: slateEditor({}),
              name: 'text',
              type: 'richText',
            },
          ],
        },
      ],
    },
  ],
}

export default RichTextFields
```

--------------------------------------------------------------------------------

---[FILE: loremIpsum.ts]---
Location: payload-main/test/lexical/collections/RichText/loremIpsum.ts

```typescript
export const loremIpsum =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam hendrerit nisi sed sollicitudin pellentesque. Nunc posuere purus rhoncus pulvinar aliquam. Ut aliquet tristique nisl vitae volutpat. Nulla aliquet porttitor venenatis. Donec a dui et dui fringilla consectetur id nec massa. Aliquam erat volutpat. Sed ut dui ut lacus dictum fermentum vel tincidunt neque. Sed sed lacinia lectus. Duis sit amet sodales felis. Duis nunc eros, mattis at dui ac, convallis semper risus. In adipiscing ultrices tellus, in suscipit massa vehicula eu.'
```

--------------------------------------------------------------------------------

---[FILE: CustomDescription.tsx]---
Location: payload-main/test/lexical/collections/Text/CustomDescription.tsx
Signals: React

```typescript
import React from 'react'

export default function CustomDescription() {
  return <div>Custom Description</div>
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/lexical/collections/Text/index.ts

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
Location: payload-main/test/lexical/collections/Text/shared.ts

```typescript
import type { RequiredDataFromCollection } from 'payload/types'

import type { TextField } from '../../payload-types.js'

export const defaultText = 'default-text'
export const textFieldsSlug = 'text-fields'

export const textDoc: RequiredDataFromCollection<TextField> = {
  text: 'Seeded text document',
  localizedText: 'Localized text',
}

export const anotherTextDoc: RequiredDataFromCollection<TextField> = {
  text: 'Another text document',
}
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/test/lexical/collections/Upload/.gitignore

```text
uploads
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/lexical/collections/Upload/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

import { uploads2Slug, uploadsSlug } from '../../slugs.js'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Uploads: CollectionConfig = {
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

export const Uploads2: CollectionConfig = {
  ...Uploads,
  slug: uploads2Slug,
  fields: [
    ...Uploads.fields,
    {
      name: 'altText',
      type: 'text',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: shared.ts]---
Location: payload-main/test/lexical/collections/Upload/shared.ts

```typescript
import type { Upload } from '../../payload-types.js'

export const uploadsDoc: Partial<Upload> = {
  text: 'An upload here',
}
```

--------------------------------------------------------------------------------

---[FILE: e2e.spec.ts]---
Location: payload-main/test/lexical/collections/_LexicalFullyFeatured/e2e.spec.ts

```typescript
import { expect, test } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

import type { PayloadTestSDK } from '../../../helpers/sdk/index.js'
import type { Config } from '../../payload-types.js'

import { ensureCompilationIsDone } from '../../../helpers.js'
import { AdminUrlUtil } from '../../../helpers/adminUrlUtil.js'
import { initPayloadE2ENoConfig } from '../../../helpers/initPayloadE2ENoConfig.js'
import { lexicalFullyFeaturedSlug } from '../../../lexical/slugs.js'
import { TEST_TIMEOUT_LONG } from '../../../playwright.config.js'
import { LexicalHelpers } from '../utils.js'

const filename = fileURLToPath(import.meta.url)
const currentFolder = path.dirname(filename)
const dirname = path.resolve(currentFolder, '../../')

let payload: PayloadTestSDK<Config>
let serverURL: string

const { beforeAll, beforeEach, describe } = test

// Unlike the other suites, this one runs in parallel, as they run on the `lexical-fully-featured/create` URL and are "pure" tests
// PLEASE do not reset the database or perform any operations that modify it in this file.
test.describe.configure({ mode: 'parallel' })

describe('Lexical Fully Featured', () => {
  let lexical: LexicalHelpers
  beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)
    process.env.SEED_IN_CONFIG_ONINIT = 'false' // Makes it so the payload config onInit seed is not run. Otherwise, the seed would be run unnecessarily twice for the initial test run - once for beforeEach and once for onInit
    ;({ payload, serverURL } = await initPayloadE2ENoConfig<Config>({ dirname }))

    const page = await browser.newPage()
    await ensureCompilationIsDone({ page, serverURL })
    await page.close()
  })
  beforeEach(async ({ page }) => {
    const url = new AdminUrlUtil(serverURL, lexicalFullyFeaturedSlug)
    lexical = new LexicalHelpers(page)
    await page.goto(url.create)
    await lexical.editor.first().focus()
  })
  test('prevent extra paragraph when inserting decorator blocks like blocks or upload node', async () => {
    await lexical.slashCommand('myblock')
    await expect(lexical.editor.locator('.LexicalEditorTheme__block')).toBeVisible()
    await lexical.slashCommand('relationship', true, 'Relationship')
    await lexical.drawer.locator('.list-drawer__header').getByText('Create New').click()
    await lexical.save('drawer')
    await expect(lexical.decorator).toHaveCount(2)
    await lexical.slashCommand('upload')
    await lexical.drawer.locator('.list-drawer__header').getByText('Create New').click()
    await lexical.drawer.getByText('Paste URL').click()
    await lexical.drawer
      .locator('.file-field__remote-file')
      .fill(
        'https://raw.githubusercontent.com/payloadcms/website/refs/heads/main/public/images/universal-truth.jpg',
      )
    await lexical.drawer.getByText('Add file').click()
    await lexical.save('drawer')
    await expect(lexical.decorator).toHaveCount(3)
    const paragraph = lexical.editor.locator('> p')
    await expect(paragraph).toHaveText('')
  })

  test('ensure upload node can be aligned', async ({ page }) => {
    await lexical.slashCommand('upload')
    await lexical.drawer.locator('.list-drawer__header').getByText('Create New').click()
    await lexical.drawer.getByText('Paste URL').click()
    const url =
      'https://raw.githubusercontent.com/payloadcms/website/refs/heads/main/public/images/universal-truth.jpg'
    await lexical.drawer.locator('.file-field__remote-file').fill(url)
    await lexical.drawer.getByText('Add file').click()
    await lexical.save('drawer')
    const img = lexical.editor.locator('img').first()
    await img.click()
    const imgBoxBeforeCenter = await img.boundingBox()
    await expect(() => {
      expect(imgBoxBeforeCenter?.x).toBeLessThan(150)
    }).toPass({ timeout: 100 })
    await page.getByLabel('align dropdown').click()
    await page.getByLabel('Align Center').click()
    const imgBoxAfterCenter = await img.boundingBox()
    await expect(() => {
      expect(imgBoxAfterCenter?.x).toBeGreaterThan(150)
    }).toPass({ timeout: 100 })
  })

  test('ControlOrMeta+A inside input should select all the text inside the input', async ({
    page,
  }) => {
    await lexical.editor.first().focus()
    await page.keyboard.type('Hello')
    await page.keyboard.press('Enter')
    await lexical.slashCommand('myblock')
    await page.locator('#field-someText').first().focus()
    await page.keyboard.type('World')
    await page.keyboard.press('ControlOrMeta+A')
    await page.keyboard.press('Backspace')
    const paragraph = lexical.editor.locator('> p').first()
    await expect(paragraph).toHaveText('Hello')
    await expect(page.getByText('World')).toHaveCount(0)
  })

  test('text state feature', async ({ page }) => {
    await page.keyboard.type('Hello')
    await page.keyboard.press('ControlOrMeta+A')

    await lexical.clickInlineToolbarButton({
      dropdownKey: 'textState',
      buttonKey: 'bg-red',
    })

    const colored = page.locator('span').filter({ hasText: 'Hello' })
    await expect(colored).toHaveCSS('background-color', 'oklch(0.704 0.191 22.216)')
    await expect(colored).toHaveAttribute('data-background-color', 'bg-red')
    await lexical.clickInlineToolbarButton({
      dropdownKey: 'textState',
      buttonKey: 'clear-style',
    })

    await expect(colored).toBeVisible()
    await expect(colored).not.toHaveCSS('background-color', 'oklch(0.704 0.191 22.216)')
    await expect(colored).not.toHaveAttribute('data-background-color', 'bg-red')
  })

  test('ensure inline toolbar items are updated when selecting word by double-clicking', async ({
    page,
  }) => {
    await page.keyboard.type('Hello')
    await page.getByText('Hello').first().dblclick()

    const { dropdownItems } = await lexical.clickInlineToolbarButton({
      dropdownKey: 'textState',
    })

    const someButton = dropdownItems!.locator(`[data-item-key="bg-red"]`)
    await expect(someButton).toHaveAttribute('aria-disabled', 'false')
  })

  test('ensure fixed toolbar items are updated when selecting word by double-clicking', async ({
    page,
  }) => {
    await page.keyboard.type('Hello')
    await page.getByText('Hello').first().dblclick()

    const { dropdownItems } = await lexical.clickFixedToolbarButton({
      dropdownKey: 'textState',
    })

    const someButton = dropdownItems!.locator(`[data-item-key="bg-red"]`)
    await expect(someButton).toHaveAttribute('aria-disabled', 'false')
  })

  test('ensure opening relationship field with appearance: "drawer" inside rich text inline block does not close drawer', async ({
    page,
  }) => {
    // https://github.com/payloadcms/payload/pull/13830

    await lexical.slashCommand('inlineblockwithrelationship')

    await expect(lexical.drawer).toBeVisible()

    await lexical.drawer.locator('.react-select').click()
    // At this point, the drawer would close if the issue is not fixed

    await page.getByText('Seeded text document').click()

    await expect(
      lexical.drawer.locator('.react-select .relationship--single-value__text'),
    ).toHaveText('Seeded text document')

    await lexical.drawer.getByText('Save changes').click()
    await expect(lexical.drawer).toBeHidden()
  })

  test('ensure code block can be created using slash commands', async ({ page }) => {
    await lexical.slashCommand('code')
    const codeBlock = lexical.editor.locator('.LexicalEditorTheme__block-Code')
    await expect(codeBlock).toHaveCount(1)
    await expect(codeBlock).toBeVisible()

    await expect(codeBlock.locator('.monaco-editor')).toBeVisible()

    await expect(
      codeBlock.locator('.payload-richtext-code-block__language-selector-button'),
    ).toHaveAttribute('data-selected-language', 'abap')

    // Does not contain payload types. However, since this is JavaScript and not TypeScript, there should be no errors.
    await codeBlock.locator('.monaco-editor .view-line').first().click()
    await page.keyboard.type("import { APIError } from 'payload'")
    await expect(codeBlock.locator('.monaco-editor .view-overlays .squiggly-error')).toHaveCount(0)
  })

  test('ensure code block can be created using client-side markdown shortcuts', async ({
    page,
  }) => {
    await page.keyboard.type('```ts ')
    const codeBlock = lexical.editor.locator('.LexicalEditorTheme__block-Code')
    await expect(codeBlock).toHaveCount(1)
    await expect(codeBlock).toBeVisible()

    await expect(codeBlock.locator('.monaco-editor')).toBeVisible()
    await expect(
      codeBlock.locator('.payload-richtext-code-block__language-selector-button'),
    ).toHaveAttribute('data-selected-language', 'ts')

    // Ensure it does not contain payload types
    await codeBlock.locator('.monaco-editor .view-line').first().click()
    await page.keyboard.type("import { APIError } from 'payload'")
    await expect(codeBlock.locator('.monaco-editor .view-overlays .squiggly-error')).toHaveCount(1)
  })

  test('ensure payload code block can be created using slash commands and it contains payload types', async ({
    page,
  }) => {
    await lexical.slashCommand('payloadcode')
    const codeBlock = lexical.editor.locator('.LexicalEditorTheme__block-PayloadCode')
    await expect(codeBlock).toHaveCount(1)
    await expect(codeBlock).toBeVisible()

    await expect(codeBlock.locator('.monaco-editor')).toBeVisible()
    await expect(
      codeBlock.locator('.payload-richtext-code-block__language-selector-button'),
    ).toHaveAttribute('data-selected-language', 'ts')

    // Ensure it contains payload types
    await codeBlock.locator('.monaco-editor .view-line').first().click()
    await page.keyboard.type("import { APIError } from 'payload'")
    await expect(codeBlock.locator('.monaco-editor .view-overlays .squiggly-error')).toHaveCount(0)
  })

  test('copy pasting a inline block within range selection should not duplicate the inline block id', async ({
    page,
  }) => {
    await page.keyboard.type('Hello ')
    await lexical.slashCommand('inline')
    await lexical.drawer.locator('input').first().fill('World')
    await lexical.drawer.getByText('Save changes').click()
    await expect(lexical.drawer).toBeHidden()
    const inlineBlock = lexical.editor.locator('.LexicalEditorTheme__inlineBlock')
    await expect(inlineBlock).toHaveCount(1)

    await page.keyboard.press('ControlOrMeta+A')
    await page.keyboard.press('ControlOrMeta+C')
    // needed for some reason
    // eslint-disable-next-line playwright/no-wait-for-timeout
    await page.waitForTimeout(1000)
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ControlOrMeta+V')
    await expect(inlineBlock).toHaveCount(2)
    await inlineBlock.nth(1).locator('button').first().click()
    await expect(lexical.drawer).toBeVisible()
    await expect(lexical.drawer.locator('input').first()).toHaveValue('World')
    await lexical.drawer.locator('input').first().fill('World changed')
    await expect(lexical.drawer.locator('input').first()).toHaveValue('World changed')
    await lexical.drawer.getByText('Save changes').click()
    await inlineBlock.nth(0).locator('button').first().click()
    await expect(lexical.drawer.locator('input').first()).toHaveValue('World')
    await lexical.drawer.getByLabel('Close').click()
    await expect(lexical.drawer).toBeHidden()
    await inlineBlock.nth(1).locator('button').first().click()
    await expect(lexical.drawer.locator('input').first()).toHaveValue('World changed')
  })

  test('copy pasting a inline block within node selection should not duplicate the inline block id', async ({
    page,
  }) => {
    await page.keyboard.type('Hello ')
    await lexical.slashCommand('inline')
    await lexical.drawer.locator('input').first().fill('World')
    await lexical.drawer.getByText('Save changes').click()
    await expect(lexical.drawer).toBeHidden()
    const inlineBlock = lexical.editor.locator('.LexicalEditorTheme__inlineBlock')
    await expect(inlineBlock).toHaveCount(1)
    await inlineBlock.click()
    await expect(lexical.drawer).toBeHidden()
    await page.keyboard.press('ControlOrMeta+C')
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ControlOrMeta+V')
    await expect(inlineBlock).toHaveCount(2)
    await inlineBlock.nth(1).locator('button').first().click()
    await expect(lexical.drawer).toBeVisible()
    await expect(lexical.drawer.locator('input').first()).toHaveValue('World')
    await lexical.drawer.locator('input').first().fill('World changed')
    await expect(lexical.drawer.locator('input').first()).toHaveValue('World changed')
    await lexical.drawer.getByText('Save changes').click()
    await expect(lexical.drawer).toBeHidden()
    await inlineBlock.nth(0).locator('button').first().click()
    await expect(lexical.drawer.locator('input').first()).toHaveValue('World')
    await lexical.drawer.getByLabel('Close').click()
    await expect(lexical.drawer).toBeHidden()
    await inlineBlock.nth(1).locator('button').first().click()
    await expect(lexical.drawer.locator('input').first()).toHaveValue('World changed')
  })
})

describe('Lexical Fully Featured, admin panel in RTL', () => {
  let lexical: LexicalHelpers
  beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)
    process.env.SEED_IN_CONFIG_ONINIT = 'false' // Makes it so the payload config onInit seed is not run. Otherwise, the seed would be run unnecessarily twice for the initial test run - once for beforeEach and once for onInit
    ;({ payload, serverURL } = await initPayloadE2ENoConfig<Config>({ dirname }))

    const page = await browser.newPage()
    await ensureCompilationIsDone({ page, serverURL })
    await page.close()
  })
  beforeEach(async ({ page }) => {
    const url = new AdminUrlUtil(serverURL, lexicalFullyFeaturedSlug)
    lexical = new LexicalHelpers(page)
    await page.goto(url.account)
    await page.locator('.payload-settings__language .react-select').click()
    const options = page.locator('.rs__option')
    await options.locator('text=עברית').click()
    await expect(page.getByText('משתמשים').first()).toBeVisible()
    await page.goto(url.create)
    await lexical.editor.first().focus()
  })
  test('slash menu should be positioned correctly in RTL', async ({ page }) => {
    await page.keyboard.type('/')
    const menu = page.locator('#slash-menu .slash-menu-popup')
    await expect(menu).toBeVisible()

    // left edge (0 indents)
    const menuBox = (await menu.boundingBox())!
    const slashBox = (await lexical.paragraph.getByText('/', { exact: true }).boundingBox())!
    await expect(() => {
      expect(menuBox.x).toBeGreaterThan(0)
      expect(menuBox.x).toBeLessThan(slashBox.x)
    }).toPass({ timeout: 100 })
    await page.keyboard.press('Backspace')
    await expect(menu).toBeHidden()

    // A bit separated (3 tabs)
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('Tab')
    }
    await page.keyboard.type('/')
    await expect(menu).toBeVisible()
    const menuBox2 = (await menu.boundingBox())!
    const slashBox2 = (await lexical.paragraph.getByText('/', { exact: true }).boundingBox())!
    await expect(() => {
      expect(menuBox2.x).toBe(menuBox.x)
      // indents should allways be 40px. Please don't change this! https://github.com/payloadcms/payload/pull/13274
      expect(slashBox2.x).toBe(slashBox.x + 40 * 3)
    }).toPass({ timeout: 100 })
    await page.keyboard.press('Backspace')
    await expect(menu).toBeHidden()

    // middle approx (13 tabs)
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab')
    }
    await page.keyboard.type('/')
    await expect(menu).toBeVisible()
    const menuBox3 = (await menu.boundingBox())!
    const slashBox3 = (await lexical.paragraph.getByText('/', { exact: true }).boundingBox())!
    await expect(() => {
      // The right edge of the menu should be approximately the same as the left edge of the slash
      expect(menuBox3.x + menuBox3.width).toBeLessThan(slashBox3.x + 15)
      expect(menuBox3.x + menuBox3.width).toBeGreaterThan(slashBox3.x - 15)
      // indents should allways be 40px. Please don't change this! https://github.com/payloadcms/payload/pull/13274
      expect(slashBox3.x).toBe(slashBox.x + 40 * 13)
    }).toPass({ timeout: 100 })
    await page.keyboard.press('Backspace')
    await expect(menu).toBeHidden()

    // right edge (27 tabs)
    for (let i = 0; i < 14; i++) {
      await page.keyboard.press('Tab')
    }
    await page.keyboard.type('/')
    await expect(menu).toBeVisible()
    const menuBox4 = (await menu.boundingBox())!
    const slashBox4 = (await lexical.paragraph.getByText('/', { exact: true }).boundingBox())!
    await expect(() => {
      // The right edge of the menu should be approximately the same as the left edge of the slash
      expect(menuBox4.x + menuBox4.width).toBeLessThan(slashBox4.x + 15)
      expect(menuBox4.x + menuBox4.width).toBeGreaterThan(slashBox4.x - 15)
      // indents should allways be 40px. Please don't change this! https://github.com/payloadcms/payload/pull/13274
      expect(slashBox4.x).toBe(slashBox.x + 40 * 27)
    }).toPass({ timeout: 100 })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/lexical/collections/_LexicalFullyFeatured/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import {
  BlocksFeature,
  CodeBlock,
  defaultColors,
  EXPERIMENTAL_TableFeature,
  FixedToolbarFeature,
  lexicalEditor,
  TextStateFeature,
  TreeViewFeature,
} from '@payloadcms/richtext-lexical'

import { lexicalFullyFeaturedSlug } from '../../slugs.js'

export const LexicalFullyFeatured: CollectionConfig = {
  slug: lexicalFullyFeaturedSlug,
  labels: {
    singular: 'Lexical Fully Featured',
    plural: 'Lexical Fully Featured',
  },
  fields: [
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        // Try to keep feature props simple and minimal in this collection
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          TreeViewFeature(),
          FixedToolbarFeature(),
          EXPERIMENTAL_TableFeature(),
          TextStateFeature({
            state: {
              color: { ...defaultColors.text },
              backgroundColor: { ...defaultColors.background },
            },
          }),
          BlocksFeature({
            blocks: [
              CodeBlock(),
              CodeBlock({
                slug: 'PayloadCode',
                defaultLanguage: 'ts',
                languages: {
                  js: 'JavaScript',
                  ts: 'TypeScript',
                  json: 'JSON',
                  plaintext: 'Plain Text',
                },
                typescript: {
                  fetchTypes: [
                    {
                      url: 'https://unpkg.com/payload@3.59.0-internal.8435f3c/dist/index.bundled.d.ts',
                      filePath: 'file:///node_modules/payload/index.d.ts',
                    },
                    {
                      url: 'https://unpkg.com/@types/react@19.1.17/index.d.ts',
                      filePath: 'file:///node_modules/@types/react/index.d.ts',
                    },
                  ],
                  paths: {
                    payload: ['file:///node_modules/payload/index.d.ts'],
                    react: ['file:///node_modules/@types/react/index.d.ts'],
                  },
                  typeRoots: ['node_modules/@types', 'node_modules/payload'],
                  enableSemanticValidation: true,
                },
              }),

              {
                slug: 'myBlock',
                fields: [
                  {
                    name: 'someText',
                    type: 'text',
                  },
                ],
              },
            ],
            inlineBlocks: [
              {
                slug: 'myInlineBlock',
                fields: [
                  {
                    name: 'someText',
                    type: 'text',
                  },
                ],
              },
              {
                slug: 'inlineBlockWithSelect',
                interfaceName: 'InlineBlockWithSelect',
                fields: [
                  {
                    // Having this specific select field here reproduces an issue where the initial state is not applied on load, and every
                    // inline block will make its own form state request on load.
                    name: 'styles',
                    type: 'select',
                    hasMany: true,
                    options: [
                      { label: 'Option 1', value: 'opt1' },
                      { label: 'Option 2', value: 'opt2' },
                    ],
                    defaultValue: [],
                  },
                ],
              },
              {
                slug: 'inlineBlockWithRelationship',
                fields: [
                  {
                    name: 'relationship',
                    type: 'relationship',
                    relationTo: 'text-fields',
                    admin: {
                      // Required to reproduce issue: https://github.com/payloadcms/payload/issues/13778
                      appearance: 'drawer',
                    },
                  },
                ],
              },
            ],
          }),
        ],
      }),
    },
  ],
}
```

--------------------------------------------------------------------------------

````
