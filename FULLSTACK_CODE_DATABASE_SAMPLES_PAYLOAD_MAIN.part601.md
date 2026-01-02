---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 601
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 601 of 695)

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

---[FILE: BlockComponent.tsx]---
Location: payload-main/test/lexical/collections/Lexical/inlineBlockComponents/BlockComponent.tsx
Signals: React

```typescript
import {
  InlineBlockContainer,
  InlineBlockEditButton,
  InlineBlockLabel,
  InlineBlockRemoveButton,
} from '@payloadcms/richtext-lexical/client'
import React from 'react'

export const BlockComponent: React.FC = () => {
  return (
    <InlineBlockContainer>
      <p>Test</p>
      <InlineBlockEditButton />
      <InlineBlockLabel />
      <InlineBlockRemoveButton />
    </InlineBlockContainer>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: LabelComponent.tsx]---
Location: payload-main/test/lexical/collections/Lexical/inlineBlockComponents/LabelComponent.tsx
Signals: React

```typescript
'use client'

import { useFormFields } from '@payloadcms/ui'
import React from 'react'

export const LabelComponent: React.FC = () => {
  const key = useFormFields(([fields]) => fields.key)

  return <div>{(key?.value as string) ?? '<no value>'}yaya</div>
}
```

--------------------------------------------------------------------------------

---[FILE: feature.client.ts]---
Location: payload-main/test/lexical/collections/Lexical/ModifyInlineBlockFeature/feature.client.ts

```typescript
'use client'

import { $isInlineBlockNode, createClientFeature } from '@payloadcms/richtext-lexical/client'
import { $getSelection } from '@payloadcms/richtext-lexical/lexical'
import { CloseMenuIcon } from '@payloadcms/ui'

import { ModifyInlineBlockPlugin } from './plugin.js'

export const ModifyInlineBlockFeatureClient = createClientFeature({
  plugins: [
    {
      Component: ModifyInlineBlockPlugin,
      position: 'normal',
    },
  ],
  toolbarFixed: {
    groups: [
      {
        key: 'debug',
        items: [
          {
            ChildComponent: CloseMenuIcon,
            key: 'setKeyToDebug',
            label: 'Set Key To Debug',
            onSelect({ editor }) {
              editor.update(() => {
                const selection = $getSelection()

                // Check if selection consist of 1 node and that its an inlineblocknode
                const nodes = selection.getNodes()

                if (nodes.length !== 1) {
                  return
                }

                const node = nodes[0]

                if (!$isInlineBlockNode(node)) {
                  return
                }

                const fields = node.getFields()

                node.setFields({
                  blockType: fields.blockType,
                  id: fields.id,
                  key: 'value2',
                })
              })
            },
          },
        ],
        type: 'buttons',
      },
    ],
  },
})
```

--------------------------------------------------------------------------------

---[FILE: feature.server.ts]---
Location: payload-main/test/lexical/collections/Lexical/ModifyInlineBlockFeature/feature.server.ts

```typescript
import { createServerFeature } from '@payloadcms/richtext-lexical'

export const ModifyInlineBlockFeature = createServerFeature({
  key: 'ModifyInlineBlockFeature',
  feature: {
    ClientFeature:
      './collections/Lexical/ModifyInlineBlockFeature/feature.client.js#ModifyInlineBlockFeatureClient',
  },
})
```

--------------------------------------------------------------------------------

---[FILE: plugin.tsx]---
Location: payload-main/test/lexical/collections/Lexical/ModifyInlineBlockFeature/plugin.tsx

```typescript
'use client'

import type { PluginComponent } from '@payloadcms/richtext-lexical'

export const ModifyInlineBlockPlugin: PluginComponent = () => {
  return null
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/lexical/collections/LexicalAccessControl/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { defaultEditorFeatures, lexicalEditor, LinkFeature } from '@payloadcms/richtext-lexical'

import { lexicalAccessControlSlug } from '../../slugs.js'

export const LexicalAccessControl: CollectionConfig = {
  slug: lexicalAccessControlSlug,
  access: {
    read: () => true,
    create: () => false,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: [
          ...defaultEditorFeatures,
          LinkFeature({
            fields: ({ defaultFields }) => [
              ...defaultFields,
              {
                name: 'blocks',
                type: 'blocks',
                blocks: [
                  {
                    slug: 'block',
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
          }),
        ],
      }),
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: e2e.spec.ts]---
Location: payload-main/test/lexical/collections/LexicalHeadingFeature/e2e.spec.ts

```typescript
import { expect, test } from '@playwright/test'
import { AdminUrlUtil } from 'helpers/adminUrlUtil.js'
import { lexicalHeadingFeatureSlug } from 'lexical/slugs.js'
import path from 'path'
import { fileURLToPath } from 'url'

import { ensureCompilationIsDone } from '../../../helpers.js'
import { initPayloadE2ENoConfig } from '../../../helpers/initPayloadE2ENoConfig.js'
import { TEST_TIMEOUT_LONG } from '../../../playwright.config.js'
import { LexicalHelpers } from '../utils.js'
const filename = fileURLToPath(import.meta.url)
const currentFolder = path.dirname(filename)
const dirname = path.resolve(currentFolder, '../../')

const { beforeAll, beforeEach, describe } = test

// Unlike the other suites, this one runs in parallel, as they run on the `lexical-fully-featured/create` URL and are "pure" tests
// PLEASE do not reset the database or perform any operations that modify it in this file.

test.describe.configure({ mode: 'parallel' })

const { serverURL } = await initPayloadE2ENoConfig({
  dirname,
})

describe('Lexical Heading Feature', () => {
  let lexical: LexicalHelpers
  beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)
    process.env.SEED_IN_CONFIG_ONINIT = 'false' // Makes it so the payload config onInit seed is not run. Otherwise, the seed would be run unnecessarily twice for the initial test run - once for beforeEach and once for onInit
    const page = await browser.newPage()
    await ensureCompilationIsDone({ page, serverURL })
    await page.close()
  })
  beforeEach(async ({ page }) => {
    const url = new AdminUrlUtil(serverURL, lexicalHeadingFeatureSlug)
    lexical = new LexicalHelpers(page)
    await page.goto(url.create)
    await lexical.editor.first().focus()
  })

  test('unallowed headings should be converted when pasting', async () => {
    await lexical.paste(
      'html',
      '<h1>Hello1</h1><h2>Hello2</h2><h3>Hello3</h3><h4>Hello4</h4><h5>Hello5</h5><h6>Hello6</h6>',
    )
    await expect(lexical.editor.locator('h1')).toHaveCount(0)
    await expect(lexical.editor.locator('h2')).toHaveCount(1)
    await expect(lexical.editor.locator('h3')).toHaveCount(0)
    await expect(lexical.editor.locator('h4')).toHaveCount(5)
    await expect(lexical.editor.locator('h5')).toHaveCount(0)
    await expect(lexical.editor.locator('h6')).toHaveCount(0)
  })
})
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/lexical/collections/LexicalHeadingFeature/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

import { lexicalHeadingFeatureSlug } from '../../slugs.js'

export const LexicalHeadingFeature: CollectionConfig = {
  slug: lexicalHeadingFeatureSlug,
  labels: {
    singular: 'Lexical Heading Feature',
    plural: 'Lexical Heading Feature',
  },
  fields: [
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          FixedToolbarFeature(),
          HeadingFeature({ enabledHeadingSizes: ['h4', 'h2'] }),
        ],
      }),
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/lexical/collections/LexicalInBlock/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

export const LexicalInBlock: CollectionConfig = {
  slug: 'LexicalInBlock',
  fields: [
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: [
          BlocksFeature({
            blocks: [
              {
                slug: 'blockInLexical',
                fields: [
                  {
                    name: 'lexicalInBlock',
                    label: 'My Label',
                    type: 'richText',
                    required: true,
                    editor: lexicalEditor(),
                    admin: {
                      description: 'Some Description',
                    },
                  },
                ],
              },
            ],
          }),
        ],
      }),
    },
    {
      name: 'blocks',
      type: 'blocks',
      blocks: [
        {
          slug: 'lexicalInBlock2',
          fields: [
            {
              name: 'lexical',
              type: 'richText',
              editor: lexicalEditor({
                features: [
                  BlocksFeature({
                    inlineBlocks: [
                      {
                        slug: 'inlineBlockInLexical',
                        fields: [
                          {
                            name: 'text',
                            type: 'text',
                          },
                        ],
                      },
                    ],
                  }),
                ],
              }),
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
Location: payload-main/test/lexical/collections/LexicalJSXConverter/e2e.spec.ts

```typescript
import type { Locator, Page } from '@playwright/test'

import { expect, test } from '@playwright/test'
import { AdminUrlUtil } from 'helpers/adminUrlUtil.js'
import { reInitializeDB } from 'helpers/reInitializeDB.js'
import { lexicalJSXConverterSlug } from 'lexical/slugs.js'
import path from 'path'
import { fileURLToPath } from 'url'

import { ensureCompilationIsDone } from '../../../helpers.js'
import { initPayloadE2ENoConfig } from '../../../helpers/initPayloadE2ENoConfig.js'
import { TEST_TIMEOUT_LONG } from '../../../playwright.config.js'
import { LexicalHelpers } from '../utils.js'
const filename = fileURLToPath(import.meta.url)
const currentFolder = path.dirname(filename)
const dirname = path.resolve(currentFolder, '../../')

const { beforeAll, beforeEach, describe } = test

// Unlike other suites, this one runs in parallel, as they run on the `/create` URL and are "pure" tests
// PLEASE do not reset the database or perform any operations that modify it in this file.
test.describe.configure({ mode: 'parallel' })

const { serverURL } = await initPayloadE2ENoConfig({
  dirname,
})

describe('Lexical JSX Converter', () => {
  beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)
    process.env.SEED_IN_CONFIG_ONINIT = 'false' // Makes it so the payload config onInit seed is not run. Otherwise, the seed would be run unnecessarily twice for the initial test run - once for beforeEach and once for onInit
    const page = await browser.newPage()
    await ensureCompilationIsDone({ page, serverURL })
    await page.close()
  })
  beforeEach(async ({ page }) => {
    const url = new AdminUrlUtil(serverURL, lexicalJSXConverterSlug)
    const lexical = new LexicalHelpers(page)
    await page.goto(url.create)
    await lexical.editor.first().focus()
  })

  // See rationale in https://github.com/payloadcms/payload/issues/13130#issuecomment-3058348085
  test('indents should be 40px in the editor and in the jsx converter', async ({ page }) => {
    const lexical = new LexicalHelpers(page)
    // 40px
    await lexical.addLine('ordered', 'HelloA0', 1, false)
    await lexical.addLine('paragraph', 'HelloA1', 1)
    await lexical.addLine('unordered', 'HelloA2', 1)
    await lexical.addLine('h1', 'HelloA3', 1)
    await lexical.addLine('check', 'HelloA4', 1)

    // 80px
    await lexical.addLine('ordered', 'HelloB0', 2)
    await lexical.addLine('paragraph', 'HelloB1', 2)
    await lexical.addLine('unordered', 'HelloB2', 2)
    await lexical.addLine('h1', 'HelloB3', 2)
    await lexical.addLine('check', 'HelloB4', 2)

    const [offsetA0_ed, offsetA0_jsx] = await getIndentOffset(page, 'HelloA0')
    const [offsetA1_ed, offsetA1_jsx] = await getIndentOffset(page, 'HelloA1')
    const [offsetA2_ed, offsetA2_jsx] = await getIndentOffset(page, 'HelloA2')
    const [offsetA3_ed, offsetA3_jsx] = await getIndentOffset(page, 'HelloA3')
    const [offsetA4_ed, offsetA4_jsx] = await getIndentOffset(page, 'HelloA4')

    const [offsetB0_ed, offsetB0_jsx] = await getIndentOffset(page, 'HelloB0')
    const [offsetB1_ed, offsetB1_jsx] = await getIndentOffset(page, 'HelloB1')
    const [offsetB2_ed, offsetB2_jsx] = await getIndentOffset(page, 'HelloB2')
    const [offsetB3_ed, offsetB3_jsx] = await getIndentOffset(page, 'HelloB3')
    const [offsetB4_ed, offsetB4_jsx] = await getIndentOffset(page, 'HelloB4')

    await expect(() => {
      expect(offsetA0_ed).toBe(offsetB0_ed - 40)
      expect(offsetA1_ed).toBe(offsetB1_ed - 40)
      expect(offsetA2_ed).toBe(offsetB2_ed - 40)
      expect(offsetA3_ed).toBe(offsetB3_ed - 40)
      expect(offsetA4_ed).toBe(offsetB4_ed - 40)
      expect(offsetA0_jsx).toBe(offsetB0_jsx - 40)
      expect(offsetA1_jsx).toBe(offsetB1_jsx - 40)
      expect(offsetA2_jsx).toBe(offsetB2_jsx - 40)
      expect(offsetA3_jsx).toBe(offsetB3_jsx - 40)
      // TODO: Checklist item in JSX needs more thought
      // expect(offsetA4_jsx).toBe(offsetB4_jsx - 40)
    }).toPass()

    // HTML in JSX converter should contain as few inline styles as possible
    await expect(async () => {
      const innerHTML = await page.locator('.payload-richtext').innerHTML()
      const normalized = normalizeCheckboxUUIDs(innerHTML)
      expect(normalized).toBe(
        `<ol class="list-number"><li class="" value="1">HelloA0</li></ol><p style="padding-inline-start: 40px;">HelloA1</p><ul class="list-bullet"><li class="" value="1">HelloA2</li></ul><h1 style="padding-inline-start: 40px;">HelloA3</h1><ol class="list-number"><li class="" value="1">HelloA4</li><li class="nestedListItem" value="2" style="list-style-type: none;"><ol class="list-number"><li class="" value="1">HelloB0</li></ol></li></ol><p style="padding-inline-start: 80px;">HelloB1</p><ul class="list-bullet"><li class="nestedListItem" value="1" style="list-style-type: none;"><ul class="list-bullet"><li class="" value="1">HelloB2</li></ul></li></ul><h1 style="padding-inline-start: 80px;">HelloB3</h1><ul class="list-check"><li aria-checked="false" class="list-item-checkbox list-item-checkbox-unchecked nestedListItem" role="checkbox" tabindex="-1" value="1" style="list-style-type: none;"><ul class="list-check"><li aria-checked="false" class="list-item-checkbox list-item-checkbox-unchecked" role="checkbox" tabindex="-1" value="1" style="list-style-type: none;"><input id="DETERMINISTIC_UUID" readonly="" type="checkbox"><label for="DETERMINISTIC_UUID">HelloB4</label><br></li></ul></li></ul>`,
      )
    }).toPass()
  })
})

async function getIndentOffset(page: Page, text: string): Promise<[number, number]> {
  const textElement = page.getByText(text)
  await expect(textElement).toHaveCount(2)
  const startLeft = (locator: Locator) =>
    locator.evaluate((el) => {
      const leftRect = el.getBoundingClientRect().left
      const paddingLeft = getComputedStyle(el).paddingLeft
      return leftRect + parseFloat(paddingLeft)
    })
  return [await startLeft(textElement.first()), await startLeft(textElement.last())]
}

function normalizeCheckboxUUIDs(html: string): string {
  return html
    .replace(/id="[a-f0-9-]{36}"/g, 'id="DETERMINISTIC_UUID"')
    .replace(/for="[a-f0-9-]{36}"/g, 'for="DETERMINISTIC_UUID"')
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/lexical/collections/LexicalJSXConverter/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { DebugJsxConverterFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

import { lexicalJSXConverterSlug } from '../../slugs.js'

export const LexicalJSXConverter: CollectionConfig = {
  slug: lexicalJSXConverterSlug,
  fields: [
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [...defaultFeatures, DebugJsxConverterFeature()],
      }),
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: e2e.spec.ts]---
Location: payload-main/test/lexical/collections/LexicalLinkFeature/e2e.spec.ts

```typescript
import { expect, test } from '@playwright/test'
import { AdminUrlUtil } from 'helpers/adminUrlUtil.js'
import { reInitializeDB } from 'helpers/reInitializeDB.js'
import { lexicalLinkFeatureSlug } from 'lexical/slugs.js'
import path from 'path'
import { fileURLToPath } from 'url'

import { ensureCompilationIsDone } from '../../../helpers.js'
import { initPayloadE2ENoConfig } from '../../../helpers/initPayloadE2ENoConfig.js'
import { TEST_TIMEOUT_LONG } from '../../../playwright.config.js'
import { LexicalHelpers } from '../utils.js'
const filename = fileURLToPath(import.meta.url)
const currentFolder = path.dirname(filename)
const dirname = path.resolve(currentFolder, '../../')

const { beforeAll, beforeEach, describe } = test

// Unlike the other suites, this one runs in parallel, as they run on the `lexical-fully-featured/create` URL and are "pure" tests
// PLEASE do not reset the database or perform any operations that modify it in this file.
test.describe.configure({ mode: 'parallel' })

const { serverURL } = await initPayloadE2ENoConfig({
  dirname,
})

describe('Lexical Link Feature', () => {
  beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)
    process.env.SEED_IN_CONFIG_ONINIT = 'false' // Makes it so the payload config onInit seed is not run. Otherwise, the seed would be run unnecessarily twice for the initial test run - once for beforeEach and once for onInit
    const page = await browser.newPage()
    await ensureCompilationIsDone({ page, serverURL })
    await page.close()
  })
  beforeEach(async ({ page }) => {
    const url = new AdminUrlUtil(serverURL, lexicalLinkFeatureSlug)
    const lexical = new LexicalHelpers(page)
    await page.goto(url.create)
    await lexical.editor.first().focus()
  })

  test('can add new custom fields in link feature modal', async ({ page }) => {
    const lexical = new LexicalHelpers(page)

    await lexical.editor.fill('link')
    await lexical.editor.selectText()

    const linkButtonClass = `.rich-text-lexical__wrap .fixed-toolbar .toolbar-popup__button-link`
    const linkButton = page.locator(linkButtonClass).first()

    await linkButton.click()

    const customField = lexical.drawer.locator('#field-someText')

    await expect(customField).toBeVisible()
  })

  test('can set default value of newTab checkbox to checked', async ({ page }) => {
    const lexical = new LexicalHelpers(page)

    await lexical.editor.fill('link')
    await lexical.editor.selectText()

    const linkButtonClass = `.rich-text-lexical__wrap .fixed-toolbar .toolbar-popup__button-link`
    const linkButton = page.locator(linkButtonClass).first()

    await linkButton.click()

    const checkboxField = lexical.drawer.locator(`[id^="field-newTab"]`)

    await expect(checkboxField).toBeChecked()
  })
})
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/lexical/collections/LexicalLinkFeature/index.ts

```typescript
import type { CheckboxField, CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  lexicalEditor,
  LinkFeature,
  TreeViewFeature,
} from '@payloadcms/richtext-lexical'

import { lexicalLinkFeatureSlug } from '../../slugs.js'

export const LexicalLinkFeature: CollectionConfig = {
  slug: lexicalLinkFeatureSlug,
  labels: {
    singular: 'Lexical Link Feature',
    plural: 'Lexical Link Feature',
  },
  fields: [
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          TreeViewFeature(),
          LinkFeature({
            fields: ({ defaultFields }) => {
              const modifiedFields = defaultFields.map((field) => {
                if (field.name === 'newTab') {
                  return { ...field, defaultValue: true } as CheckboxField
                }

                return field
              })

              return [...modifiedFields, { type: 'text', name: 'someText' }]
            },
          }),
          FixedToolbarFeature(),
        ],
      }),
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: e2e.spec.ts]---
Location: payload-main/test/lexical/collections/LexicalListsFeature/e2e.spec.ts

```typescript
import { expect, test } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

import type { PayloadTestSDK } from '../../../helpers/sdk/index.js'
import type { Config } from '../../payload-types.js'

import { ensureCompilationIsDone } from '../../../helpers.js'
import { AdminUrlUtil } from '../../../helpers/adminUrlUtil.js'
import { initPayloadE2ENoConfig } from '../../../helpers/initPayloadE2ENoConfig.js'
import { TEST_TIMEOUT_LONG } from '../../../playwright.config.js'
import { lexicalListsFeatureSlug } from '../../slugs.js'
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

describe('Lexical Lists Features', () => {
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
    const url = new AdminUrlUtil(serverURL, lexicalListsFeatureSlug)
    lexical = new LexicalHelpers(page)
    await page.goto(url.create)
    await lexical.editor.first().focus()
  })
  test('Registering only ordered list should work', async ({ page }) => {
    await page.keyboard.type('- hello')
    await expect(lexical.editor.locator('li')).toBeHidden()
    await page.keyboard.press('Enter')
    await page.keyboard.type('1. hello')
    await expect(lexical.editor.locator('li')).toBeVisible()
  })
})
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/lexical/collections/LexicalListsFeature/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import {
  ChecklistFeature,
  FixedToolbarFeature,
  lexicalEditor,
  OrderedListFeature,
  TreeViewFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'

import { lexicalListsFeatureSlug } from '../../slugs.js'

export const LexicalListsFeature: CollectionConfig = {
  slug: lexicalListsFeatureSlug,
  labels: {
    singular: 'Lexical Lists Features',
    plural: 'Lexical Lists Features',
  },
  fields: [
    {
      name: 'onlyOrderedList',
      type: 'richText',
      editor: lexicalEditor({
        features: [
          TreeViewFeature(),
          FixedToolbarFeature(),
          OrderedListFeature(),
          // UnorderedListFeature(),
          // ChecklistFeature(),
        ],
      }),
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: generateLexicalRichText.ts]---
Location: payload-main/test/lexical/collections/LexicalLocalized/generateLexicalRichText.ts

```typescript
export function generateLexicalLocalizedRichText(text1: string, text2: string, blockID?: string) {
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
              text: text1,
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
          textFormat: 0,
        },
        {
          format: '',
          type: 'block',
          version: 2,
          fields: {
            id: blockID ?? '66685716795f191f08367b1a',
            blockName: '',
            textLocalized: text2,
            counter: 1,
            blockType: 'blockLexicalLocalized',
          },
        },
      ],
      direction: 'ltr',
    },
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/lexical/collections/LexicalLocalized/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

import { lexicalLocalizedFieldsSlug } from '../../slugs.js'

export const LexicalLocalizedFields: CollectionConfig = {
  slug: lexicalLocalizedFieldsSlug,
  admin: {
    useAsTitle: 'title',
    listSearchableFields: ['title'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'lexicalBlocksSubLocalized',
      type: 'richText',
      admin: {
        description: 'Non-localized field with localized block subfields',
      },
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          BlocksFeature({
            blocks: [
              {
                slug: 'blockLexicalLocalized',
                fields: [
                  {
                    name: 'textLocalized',
                    type: 'text',
                    localized: true,
                  },
                  {
                    name: 'counter',
                    type: 'number',
                    hooks: {
                      beforeChange: [
                        ({ value }) => {
                          return value ? value + 1 : 1
                        },
                      ],
                      afterRead: [
                        ({ value }) => {
                          return value ? value * 10 : 10
                        },
                      ],
                    },
                  },
                  {
                    name: 'rel',
                    type: 'relationship',
                    relationTo: lexicalLocalizedFieldsSlug,
                  },
                ],
              },
            ],
          }),
        ],
      }),
    },
    {
      name: 'lexicalBlocksLocalized',
      admin: {
        description: 'Localized field with localized block subfields',
      },
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          BlocksFeature({
            blocks: [
              {
                slug: 'blockLexicalLocalized2',
                fields: [
                  {
                    name: 'textLocalized',
                    type: 'text',
                    localized: true,
                  },
                  {
                    name: 'rel',
                    type: 'relationship',
                    relationTo: lexicalLocalizedFieldsSlug,
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

---[FILE: data.ts]---
Location: payload-main/test/lexical/collections/LexicalMigrate/data.ts

```typescript
import { generateSlateRichText } from '../RichText/generateSlateRichText.js'
import { payloadPluginLexicalData } from './generatePayloadPluginLexicalData.js'

export const lexicalMigrateDocData = {
  title: 'Rich Text',
  lexicalWithLexicalPluginData: payloadPluginLexicalData,
  lexicalWithSlateData: [
    ...generateSlateRichText(),
    {
      children: [
        {
          text: 'Some block quote',
        },
      ],
      type: 'blockquote',
    },
  ],
  arrayWithLexicalField: [
    {
      lexicalInArrayField: getSimpleLexicalData('array 1'),
    },
    {
      lexicalInArrayField: getSimpleLexicalData('array 2'),
    },
  ],
}

export function getSimpleLexicalData(textContent: string) {
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
              text: textContent,
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

````
