---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 597
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 597 of 695)

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

---[FILE: seed.ts]---
Location: payload-main/test/lexical/seed.ts

```typescript
import type { Payload } from 'payload'

import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { lexicalDocData } from './collections/Lexical/data.js'
import { generateLexicalLocalizedRichText } from './collections/LexicalLocalized/generateLexicalRichText.js'
import { lexicalMigrateDocData } from './collections/LexicalMigrate/data.js'
import { richTextBulletsDocData, richTextDocData } from './collections/RichText/data.js'
import {
  arrayFieldsSlug,
  collectionSlugs,
  lexicalFieldsSlug,
  lexicalLocalizedFieldsSlug,
  lexicalMigrateFieldsSlug,
  lexicalRelationshipFieldsSlug,
  richTextFieldsSlug,
  textFieldsSlug,
  uploads2Slug,
  uploadsSlug,
  usersSlug,
} from './slugs.js'

// import type { Payload } from 'payload'

import { buildEditorState, type DefaultNodeTypes } from '@payloadcms/richtext-lexical'
import { getFileByPath } from 'payload'

import { devUser } from '../credentials.js'
import { seedDB } from '../helpers/seed.js'
import { arrayDoc } from './collections/Array/shared.js'
import { anotherTextDoc, textDoc } from './collections/Text/shared.js'
import { uploadsDoc } from './collections/Upload/shared.js'
// import { blocksDoc } from './collections/Blocks/shared.js'
// import { codeDoc } from './collections/Code/shared.js'
// import { collapsibleDoc } from './collections/Collapsible/shared.js'
// import { conditionalLogicDoc } from './collections/ConditionalLogic/shared.js'
// import { customRowID, customTabID, nonStandardID } from './collections/CustomID/shared.js'
// import { dateDoc } from './collections/Date/shared.js'
// import { anotherEmailDoc, emailDoc } from './collections/Email/shared.js'
// import { groupDoc } from './collections/Group/shared.js'
// import { jsonDoc } from './collections/JSON/shared.js'
// import { lexicalDocData } from './collections/Lexical/data.js'
// import { generateLexicalLocalizedRichText } from './collections/LexicalLocalized/generateLexicalRichText.js'
// import { lexicalMigrateDocData } from './collections/LexicalMigrate/data.js'
// import { numberDoc } from './collections/Number/shared.js'
// import { pointDoc } from './collections/Point/shared.js'
// import { radiosDoc } from './collections/Radio/shared.js'
// import { richTextBulletsDocData, richTextDocData } from './collections/RichText/data.js'
// import { selectsDoc } from './collections/Select/shared.js'
// import { tabsDoc } from './collections/Tabs/shared.js'
// import { anotherTextDoc, textDoc } from './collections/Text/shared.js'
// import { uploadsDoc } from './collections/Upload/shared.js'
// import {
//   arrayFieldsSlug,
//   blockFieldsSlug,
//   checkboxFieldsSlug,
//   codeFieldsSlug,
//   collapsibleFieldsSlug,
//   collectionSlugs,
//   conditionalLogicSlug,
//   customIDSlug,
//   customRowIDSlug,
//   customTabIDSlug,
//   dateFieldsSlug,
//   emailFieldsSlug,
//   groupFieldsSlug,
//   jsonFieldsSlug,
//   lexicalFieldsSlug,
//   lexicalLocalizedFieldsSlug,
//   lexicalMigrateFieldsSlug,
//   lexicalRelationshipFieldsSlug,
//   numberFieldsSlug,
//   pointFieldsSlug,
//   radioFieldsSlug,
//   relationshipFieldsSlug,
//   richTextFieldsSlug,
//   selectFieldsSlug,
//   tabsFieldsSlug,
//   textFieldsSlug,
//   uiSlug,
//   uploads2Slug,
//   uploadsMulti,
//   uploadsMultiPoly,
//   uploadsPoly,
//   uploadsSlug,
//   usersSlug,
// } from './slugs.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const seed = async (_payload: Payload) => {
  const jpgPath = path.resolve(dirname, './collections/Upload/payload.jpg')
  const pngPath = path.resolve(dirname, './uploads/payload.png')

  // Get both files in parallel
  const [jpgFile, pngFile] = await Promise.all([getFileByPath(jpgPath), getFileByPath(pngPath)])

  const createdArrayDoc = await _payload.create({
    collection: arrayFieldsSlug,
    data: arrayDoc,
    depth: 0,
    overrideAccess: true,
  })

  const createdTextDoc = await _payload.create({
    collection: textFieldsSlug,
    data: textDoc,
    depth: 0,
    overrideAccess: true,
  })

  await _payload.create({
    collection: textFieldsSlug,
    data: anotherTextDoc,
    depth: 0,
    overrideAccess: true,
  })

  const createdPNGDoc = await _payload.create({
    collection: uploadsSlug,
    data: {},
    file: pngFile,
    depth: 0,
    overrideAccess: true,
  })

  const createdPNGDoc2 = await _payload.create({
    collection: uploads2Slug,
    data: {},
    file: pngFile,
    depth: 0,
    overrideAccess: true,
  })

  const createdJPGDoc = await _payload.create({
    collection: uploadsSlug,
    data: {
      ...uploadsDoc,
      media: createdPNGDoc.id,
    },
    file: jpgFile,
    depth: 0,
    overrideAccess: true,
  })

  const formattedID =
    _payload.db.defaultIDType === 'number' ? createdArrayDoc.id : `"${createdArrayDoc.id}"`

  const formattedJPGID =
    _payload.db.defaultIDType === 'number' ? createdJPGDoc.id : `"${createdJPGDoc.id}"`

  const formattedTextID =
    _payload.db.defaultIDType === 'number' ? createdTextDoc.id : `"${createdTextDoc.id}"`

  const richTextDocWithRelId = JSON.parse(
    JSON.stringify(richTextDocData)
      .replace(/"\{\{ARRAY_DOC_ID\}\}"/g, `${formattedID}`)
      .replace(/"\{\{UPLOAD_DOC_ID\}\}"/g, `${formattedJPGID}`)
      .replace(/"\{\{TEXT_DOC_ID\}\}"/g, `${formattedTextID}`),
  )
  const richTextBulletsDocWithRelId = JSON.parse(
    JSON.stringify(richTextBulletsDocData)
      .replace(/"\{\{ARRAY_DOC_ID\}\}"/g, `${formattedID}`)
      .replace(/"\{\{UPLOAD_DOC_ID\}\}"/g, `${formattedJPGID}`)
      .replace(/"\{\{TEXT_DOC_ID\}\}"/g, `${formattedTextID}`),
  )

  const richTextDocWithRelationship = { ...richTextDocWithRelId }

  await _payload.create({
    collection: richTextFieldsSlug,
    data: richTextBulletsDocWithRelId,
    depth: 0,
    overrideAccess: true,
  })

  const createdRichTextDoc = await _payload.create({
    collection: richTextFieldsSlug,
    data: richTextDocWithRelationship,
    depth: 0,
    overrideAccess: true,
  })

  const formattedRichTextDocID =
    _payload.db.defaultIDType === 'number' ? createdRichTextDoc.id : `"${createdRichTextDoc.id}"`

  const lexicalDocWithRelId = JSON.parse(
    JSON.stringify(lexicalDocData)
      .replace(/"\{\{ARRAY_DOC_ID\}\}"/g, `${formattedID}`)
      .replace(/"\{\{UPLOAD_DOC_ID\}\}"/g, `${formattedJPGID}`)
      .replace(/"\{\{TEXT_DOC_ID\}\}"/g, `${formattedTextID}`)
      .replace(/"\{\{RICH_TEXT_DOC_ID\}\}"/g, `${formattedRichTextDocID}`),
  )

  const lexicalMigrateDocWithRelId = JSON.parse(
    JSON.stringify(lexicalMigrateDocData)
      .replace(/"\{\{ARRAY_DOC_ID\}\}"/g, `${formattedID}`)
      .replace(/"\{\{UPLOAD_DOC_ID\}\}"/g, `${formattedJPGID}`)
      .replace(/"\{\{TEXT_DOC_ID\}\}"/g, `${formattedTextID}`)
      .replace(/"\{\{RICH_TEXT_DOC_ID\}\}"/g, `${formattedRichTextDocID}`),
  )

  await _payload.create({
    collection: usersSlug,
    depth: 0,
    data: {
      email: devUser.email,
      password: devUser.password,
    },
    overrideAccess: true,
  })

  await _payload.create({
    collection: lexicalFieldsSlug,
    data: lexicalDocWithRelId,
    depth: 0,
    overrideAccess: true,
  })

  const lexicalLocalizedDoc1 = await _payload.create({
    collection: lexicalLocalizedFieldsSlug,
    data: {
      title: 'Localized Lexical en',
      lexicalBlocksLocalized: buildEditorState<DefaultNodeTypes>({ text: 'English text' }),
      lexicalBlocksSubLocalized: generateLexicalLocalizedRichText(
        'Shared text',
        'English text in block',
      ) as any,
    },
    locale: 'en',
    depth: 0,
    overrideAccess: true,
  })

  await _payload.create({
    collection: lexicalRelationshipFieldsSlug,
    data: {
      richText: buildEditorState<DefaultNodeTypes>({ text: 'English text' }),
    },
    depth: 0,
    overrideAccess: true,
  })

  await _payload.update({
    collection: lexicalLocalizedFieldsSlug,
    id: lexicalLocalizedDoc1.id,
    data: {
      title: 'Localized Lexical es',
      lexicalBlocksLocalized: buildEditorState<DefaultNodeTypes>({ text: 'Spanish text' }),
      lexicalBlocksSubLocalized: generateLexicalLocalizedRichText(
        'Shared text',
        'Spanish text in block',
        (lexicalLocalizedDoc1.lexicalBlocksSubLocalized.root.children[1].fields as any).id,
      ) as any,
    },
    locale: 'es',
    depth: 0,
    overrideAccess: true,
  })

  const lexicalLocalizedDoc2 = await _payload.create({
    collection: lexicalLocalizedFieldsSlug,
    data: {
      title: 'Localized Lexical en 2',

      lexicalBlocksLocalized: buildEditorState<DefaultNodeTypes>({
        text: 'English text 2',
        nodes: [
          {
            format: '',
            type: 'relationship',
            version: 2,
            relationTo: lexicalLocalizedFieldsSlug,
            value: lexicalLocalizedDoc1.id,
          },
        ],
      }),
      lexicalBlocksSubLocalized: buildEditorState<DefaultNodeTypes>({
        text: 'English text 2',
        nodes: [
          {
            format: '',
            type: 'relationship',
            version: 2,
            relationTo: lexicalLocalizedFieldsSlug,
            value: lexicalLocalizedDoc1.id,
          },
        ],
      }),
    },
    locale: 'en',
    depth: 0,
    overrideAccess: true,
  })

  await _payload.update({
    collection: lexicalLocalizedFieldsSlug,
    id: lexicalLocalizedDoc2.id,
    data: {
      title: 'Localized Lexical es 2',

      lexicalBlocksLocalized: buildEditorState<DefaultNodeTypes>({
        text: 'Spanish text 2',
        nodes: [
          {
            format: '',
            type: 'relationship',
            version: 2,
            relationTo: lexicalLocalizedFieldsSlug,
            value: lexicalLocalizedDoc1.id,
          },
        ],
      }),
    },
    locale: 'es',
    depth: 0,
    overrideAccess: true,
  })

  await _payload.create({
    collection: lexicalMigrateFieldsSlug,
    data: lexicalMigrateDocWithRelId,
    depth: 0,
    overrideAccess: true,
  })

  const getInlineBlock = () => ({
    type: 'inlineBlock',
    fields: {
      id: Math.random().toString(36).substring(2, 15),
      text: 'text',
      blockType: 'inlineBlockInLexical',
    },
    version: 1,
  })

  await _payload.create({
    collection: 'LexicalInBlock',
    depth: 0,
    data: {
      content: {
        root: {
          children: [
            {
              format: '',
              type: 'block',
              version: 2,
              fields: {
                id: '6773773284be8978db7a498d',
                lexicalInBlock: buildEditorState<DefaultNodeTypes>({ text: 'text' }),
                blockName: '',
                blockType: 'blockInLexical',
              },
            },
          ],
          direction: null,
          format: '',
          indent: 0,
          type: 'root',
          version: 1,
        },
      },
      blocks: [
        {
          blockType: 'lexicalInBlock2',
          blockName: '1',
          lexical: buildEditorState<DefaultNodeTypes>({ text: '1' }),
        },
        {
          blockType: 'lexicalInBlock2',
          blockName: '2',
          lexical: buildEditorState<DefaultNodeTypes>({ text: '2' }),
        },
        {
          blockType: 'lexicalInBlock2',
          lexical: {
            root: {
              children: [
                {
                  children: [...Array.from({ length: 20 }, () => getInlineBlock())],
                  direction: null,
                  format: '',
                  indent: 0,
                  type: 'paragraph',
                  version: 1,
                  textFormat: 0,
                  textStyle: '',
                },
              ],
              direction: null,
              format: '',
              indent: 0,
              type: 'root',
              version: 1,
            },
          },
          id: '67e1af0b78de3228e23ef1d5',
          blockName: '1',
        },
      ],
    },
  })

  await _payload.create({
    collection: 'lexical-access-control',
    data: {
      richText: {
        root: {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'text ',
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
                      text: 'link',
                      type: 'text',
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  type: 'link',
                  version: 3,
                  fields: {
                    url: 'https://',
                    newTab: false,
                    linkType: 'custom',
                    blocks: [
                      {
                        id: '67e45673cbd5181ca8cbeef7',
                        blockType: 'block',
                      },
                    ],
                  },
                  id: '67e4566fcbd5181ca8cbeef5',
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              type: 'paragraph',
              version: 1,
              textFormat: 0,
              textStyle: '',
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'root',
          version: 1,
        },
      },
      title: 'title',
    },
    depth: 0,
  })
}

export async function clearAndSeedEverything(_payload: Payload) {
  return await seedDB({
    _payload,
    collectionSlugs,
    seedFunction: seed,
    snapshotKey: 'lexicalTest',
    uploadsDir: path.resolve(dirname, './collections/Upload/uploads'),
  })
}
```

--------------------------------------------------------------------------------

---[FILE: slugs.ts]---
Location: payload-main/test/lexical/slugs.ts

```typescript
export const usersSlug = 'users'

export const lexicalFullyFeaturedSlug = 'lexical-fully-featured'
export const lexicalFieldsSlug = 'lexical-fields'
export const lexicalJSXConverterSlug = 'lexical-jsx-converter'
export const lexicalHeadingFeatureSlug = 'lexical-heading-feature'
export const lexicalListsFeatureSlug = 'lexical-lists-features'

export const lexicalLinkFeatureSlug = 'lexical-link-feature'
export const lexicalLocalizedFieldsSlug = 'lexical-localized-fields'
export const lexicalMigrateFieldsSlug = 'lexical-migrate-fields'
export const lexicalRelationshipFieldsSlug = 'lexical-relationship-fields'
export const lexicalAccessControlSlug = 'lexical-access-control'
export const richTextFieldsSlug = 'rich-text-fields'

// Auxiliary slugs
export const textFieldsSlug = 'text-fields'
export const uploadsSlug = 'uploads'
export const uploads2Slug = 'uploads2'

export const arrayFieldsSlug = 'array-fields'

export const collectionSlugs = [
  lexicalFieldsSlug,
  lexicalLocalizedFieldsSlug,
  lexicalMigrateFieldsSlug,
  lexicalRelationshipFieldsSlug,
  lexicalAccessControlSlug,
  richTextFieldsSlug,
  textFieldsSlug,
  uploadsSlug,
  lexicalListsFeatureSlug,
]
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.eslint.json]---
Location: payload-main/test/lexical/tsconfig.eslint.json

```json
{
  // extend your base config to share compilerOptions, etc
  //"extends": "./tsconfig.json",
  "compilerOptions": {
    // ensure that nobody can accidentally use this config for a build
    "noEmit": true
  },
  "include": [
    // whatever paths you intend to lint
    "./**/*.ts",
    "./**/*.tsx"
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/test/lexical/tsconfig.json

```json
{
  "extends": "../tsconfig.json"
}
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: payload-main/test/lexical/collections/utils.ts

```typescript
import type { Locator, Page } from 'playwright'

import { expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { wait } from 'payload/shared'

export type PasteMode = 'blob' | 'html'

function inferMimeFromExt(ext: string): string {
  switch (ext.toLowerCase()) {
    case '.gif':
      return 'image/gif'
    case '.jpeg':
    case '.jpg':
      return 'image/jpeg'
    case '.png':
      return 'image/png'
    case '.svg':
      return 'image/svg+xml'
    case '.webp':
      return 'image/webp'
    default:
      return 'application/octet-stream'
  }
}

async function readAsBase64(filePath: string): Promise<string> {
  const buf = await fs.promises.readFile(filePath)
  return Buffer.from(buf).toString('base64')
}

export class LexicalHelpers {
  page: Page
  constructor(page: Page) {
    this.page = page
  }

  async addLine(
    type: 'check' | 'h1' | 'h2' | 'ordered' | 'paragraph' | 'unordered',
    text: string,
    indent: number,
    startWithEnter = true,
  ) {
    if (startWithEnter) {
      await this.page.keyboard.press('Enter')
    }
    await this.slashCommand(type)
    // Outdent 10 times to be sure we are at the beginning of the line
    for (let i = 0; i < 10; i++) {
      await this.page.keyboard.press('Shift+Tab')
    }
    const adjustedIndent = ['check', 'ordered', 'unordered'].includes(type) ? indent - 1 : indent
    for (let i = 0; i < adjustedIndent; i++) {
      await this.page.keyboard.press('Tab')
    }
    await this.page.keyboard.type(text)
  }

  async clickFixedToolbarButton({
    buttonKey,
    dropdownKey,
  }: {
    buttonKey?: string
    dropdownKey?: string
  }): Promise<{
    dropdownItems?: Locator
  }> {
    if (dropdownKey) {
      await this.fixedToolbar.locator(`[data-dropdown-key="${dropdownKey}"]`).click()

      const dropdownItems = this.page.locator(`.toolbar-popup__dropdown-items`)
      await expect(dropdownItems).toBeVisible()

      if (buttonKey) {
        await dropdownItems.locator(`[data-item-key="${buttonKey}"]`).click()
      }
      return {
        dropdownItems,
      }
    }

    if (buttonKey) {
      await this.fixedToolbar.locator(`[data-item-key="${buttonKey}"]`).click()
    }
    return {}
  }

  async clickInlineToolbarButton({
    buttonKey,
    dropdownKey,
  }: {
    buttonKey?: string
    dropdownKey?: string
  }): Promise<{
    dropdownItems?: Locator
  }> {
    if (dropdownKey) {
      await this.inlineToolbar.locator(`[data-dropdown-key="${dropdownKey}"]`).click()

      const dropdownItems = this.page.locator(`.toolbar-popup__dropdown-items`)
      await expect(dropdownItems).toBeVisible()

      if (buttonKey) {
        await dropdownItems.locator(`[data-item-key="${buttonKey}"]`).click()
      }
      return {
        dropdownItems,
      }
    }

    if (buttonKey) {
      await this.inlineToolbar.locator(`[data-item-key="${buttonKey}"]`).click()
    }
    return {}
  }

  async paste(type: 'html' | 'markdown', text: string) {
    await this.page.context().grantPermissions(['clipboard-read', 'clipboard-write'])

    await this.page.evaluate(
      async ([text, type]) => {
        const blob = new Blob([text!], { type: type === 'html' ? 'text/html' : 'text/markdown' })
        const clipboardItem = new ClipboardItem({ 'text/html': blob })
        await navigator.clipboard.write([clipboardItem])
      },
      [text, type],
    )
    await this.page.keyboard.press(`ControlOrMeta+v`)
  }

  async pasteFile({ filePath, mode: modeFromArgs }: { filePath: string; mode?: PasteMode }) {
    const mode: PasteMode = modeFromArgs ?? 'blob'
    const name = path.basename(filePath)
    const mime = inferMimeFromExt(path.extname(name))

    // Build payloads per mode
    let payload:
      | { bytes: number[]; kind: 'blob'; mime: string; name: string }
      | { html: string; kind: 'html' } = { html: '', kind: 'html' }

    if (mode === 'blob') {
      const buf = await fs.promises.readFile(filePath)
      payload = { kind: 'blob', bytes: Array.from(buf), name, mime }
    } else if (mode === 'html') {
      const b64 = await readAsBase64(filePath)
      const src = `data:${mime};base64,${b64}`
      const html = `<img src="${src}" alt="${name}">`
      payload = { kind: 'html', html }
    }

    await this.page.evaluate((p) => {
      const target =
        (document.activeElement as HTMLElement | null) ||
        document.querySelector('[contenteditable="true"]') ||
        document.body

      const dt = new DataTransfer()

      if (p.kind === 'blob') {
        const file = new File([new Uint8Array(p.bytes)], p.name, { type: p.mime })
        dt.items.add(file)
      } else if (p.kind === 'html') {
        dt.setData('text/html', p.html)
      }

      try {
        const evt = new ClipboardEvent('paste', {
          clipboardData: dt,
          bubbles: true,
          cancelable: true,
        })
        target.dispatchEvent(evt)
      } catch {
        /* ignore */
      }
    }, payload)
  }

  async save(container: 'document' | 'drawer') {
    if (container === 'drawer') {
      await this.drawer.getByText('Save').click()
    } else {
      throw new Error('Not implemented')
    }
    await this.page.waitForTimeout(1000)
  }

  async slashCommand(
    // prettier-ignore
    command: ('block' | 'check' | 'code' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' |'h6' | 'inline'
    | 'link' | 'ordered' | 'paragraph' | 'quote' | 'relationship' | 'table' | 'unordered'|'upload') | ({} & string),
    expectMenuToClose = true,
    labelToMatch?: string,
  ) {
    await this.page.keyboard.press(`/`)

    const slashMenuPopover = this.page.locator('#slash-menu .slash-menu-popup')
    await expect(slashMenuPopover).toBeVisible()
    await this.page.keyboard.type(command)
    await wait(200)
    if (labelToMatch) {
      await slashMenuPopover.getByText(labelToMatch).click()
    } else {
      await this.page.keyboard.press(`Enter`)
    }
    if (expectMenuToClose) {
      await expect(slashMenuPopover).toBeHidden()
    }
  }

  get decorator() {
    return this.editor.locator('[data-lexical-decorator="true"]')
  }

  get drawer() {
    return this.page.locator('.drawer__content')
  }

  get editor() {
    return this.page.locator('[data-lexical-editor="true"]')
  }

  get fixedToolbar() {
    return this.page.locator('.fixed-toolbar')
  }

  get inlineToolbar() {
    return this.page.locator('.inline-toolbar-popup')
  }

  get paragraph() {
    return this.editor.locator('p')
  }
}
```

--------------------------------------------------------------------------------

---[FILE: AddRowButton.tsx]---
Location: payload-main/test/lexical/collections/Array/AddRowButton.tsx

```typescript
'use client'

import { useForm } from '@payloadcms/ui'

const AddRowButton = () => {
  const { addFieldRow } = useForm()

  const handleClick = () => {
    addFieldRow({
      path: 'externallyUpdatedArray',
      schemaPath: 'externallyUpdatedArray',
      subFieldState: {
        text: {
          initialValue: 'Hello, world!',
          valid: true,
          value: 'Hello, world!',
        },
      },
    })
  }

  return (
    <button id="updateArrayExternally" onClick={handleClick} type="button">
      Add Row
    </button>
  )
}

export default AddRowButton
```

--------------------------------------------------------------------------------

---[FILE: CustomArrayField.tsx]---
Location: payload-main/test/lexical/collections/Array/CustomArrayField.tsx

```typescript
'use client'
import type { ArrayFieldClientComponent } from 'payload'

import { ArrayField } from '@payloadcms/ui'

export const CustomArrayField: ArrayFieldClientComponent = (props) => {
  return (
    <div id="custom-array-field">
      <ArrayField {...props} />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: CustomTextField.tsx]---
Location: payload-main/test/lexical/collections/Array/CustomTextField.tsx

```typescript
import type { TextFieldServerComponent } from 'payload'

import { TextField } from '@payloadcms/ui'

export const CustomTextField: TextFieldServerComponent = ({ clientField, path }) => {
  return (
    <div id="custom-text-field">
      <TextField field={clientField} path={path} />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/lexical/collections/Array/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { arrayFieldsSlug } from '../../slugs.js'

export const arrayDefaultValue = [{ text: 'row one' }, { text: 'row two' }]

const ArrayFields: CollectionConfig = {
  admin: {
    enableRichTextLink: false,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: false,
    },
    {
      name: 'items',
      defaultValue: arrayDefaultValue,
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
        {
          name: 'anotherText',
          type: 'text',
        },
        {
          name: 'uiField',
          type: 'ui',
          admin: {
            components: {
              Field: {
                path: './collections/Array/LabelComponent.js#ArrayRowLabel',
                serverProps: {
                  // While this doesn't do anything, this will reproduce a bug where having server-only props in here will throw a "Functions cannot be passed directly to Client Components" error
                  someFn: () => 'Hello',
                },
              },
            },
          },
        },
        {
          name: 'localizedText',
          type: 'text',
          localized: true,
        },
        {
          name: 'subArray',
          fields: [
            {
              name: 'text',
              type: 'text',
            },
            {
              name: 'textTwo',
              label: 'Second text field',
              type: 'text',
              required: true,
              defaultValue: 'default',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'textInRow',
                  type: 'text',
                  required: true,
                  defaultValue: 'default',
                },
              ],
            },
          ],
          type: 'array',
        },
      ],
      required: true,
      type: 'array',
    },
    {
      name: 'collapsedArray',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'text',
          required: true,
          type: 'text',
        },
      ],
      type: 'array',
    },
    {
      name: 'localized',
      defaultValue: arrayDefaultValue,
      fields: [
        {
          name: 'text',
          required: true,
          type: 'text',
        },
      ],
      localized: true,
      required: true,
      type: 'array',
    },
    {
      name: 'readOnly',
      admin: {
        readOnly: true,
      },
      defaultValue: [
        {
          text: 'defaultValue',
        },
        {
          text: 'defaultValue2',
        },
      ],
      fields: [
        {
          name: 'text',
          type: 'text',
        },
      ],
      type: 'array',
    },
    {
      name: 'potentiallyEmptyArray',
      fields: [
        {
          name: 'text',
          type: 'text',
        },
        {
          name: 'groupInRow',
          fields: [
            {
              name: 'textInGroupInRow',
              type: 'text',
            },
          ],
          type: 'group',
        },
      ],
      type: 'array',
    },
    {
      name: 'rowLabelAsComponent',
      admin: {
        components: {
          RowLabel: '/collections/Array/LabelComponent.js#ArrayRowLabel',
        },
        description: 'Row labels rendered as react components.',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
        },
      ],
      type: 'array',
    },
    {
      name: 'arrayWithMinRows',
      fields: [
        {
          name: 'text',
          type: 'text',
        },
      ],
      minRows: 2,
      type: 'array',
    },
    {
      name: 'disableSort',
      defaultValue: arrayDefaultValue,
      admin: {
        isSortable: false,
      },
      fields: [
        {
          name: 'text',
          required: true,
          type: 'text',
        },
      ],
      type: 'array',
    },
    {
      name: 'nestedArrayLocalized',
      type: 'array',
      fields: [
        {
          type: 'array',
          name: 'array',
          fields: [
            {
              name: 'text',
              type: 'text',
              localized: true,
            },
          ],
        },
      ],
    },
    {
      name: 'externallyUpdatedArray',
      type: 'array',
      fields: [
        {
          name: 'customTextField',
          type: 'ui',
          admin: {
            components: {
              Field: '/collections/Array/CustomTextField.js#CustomTextField',
            },
          },
        },
      ],
    },
    {
      name: 'customArrayField',
      type: 'array',
      admin: {
        components: {
          Field: '/collections/Array/CustomArrayField.js#CustomArrayField',
        },
      },
      fields: [
        {
          name: 'text',
          type: 'text',
        },
      ],
    },
    {
      name: 'ui',
      type: 'ui',
      admin: {
        components: {
          Field: '/collections/Array/AddRowButton.js',
        },
      },
    },
    {
      name: 'arrayWithLabels',
      type: 'array',
      labels: {
        singular: ({ t }) => t('authentication:account'),
        plural: ({ t }) => t('authentication:generate'),
      },
      fields: [
        {
          name: 'text',
          type: 'text',
        },
      ],
    },
  ],
  slug: arrayFieldsSlug,
  versions: true,
}

export default ArrayFields
```

--------------------------------------------------------------------------------

---[FILE: LabelComponent.tsx]---
Location: payload-main/test/lexical/collections/Array/LabelComponent.tsx
Signals: React

```typescript
'use client'

import type { PayloadClientReactComponent, RowLabelComponent } from 'payload'

import { useRowLabel } from '@payloadcms/ui'
import React from 'react'

export const ArrayRowLabel: PayloadClientReactComponent<RowLabelComponent> = () => {
  const { data } = useRowLabel<{ title: string }>()
  return (
    <div id="custom-array-row-label" style={{ color: 'coral', textTransform: 'uppercase' }}>
      {data.title || 'Untitled'}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: shared.ts]---
Location: payload-main/test/lexical/collections/Array/shared.ts

```typescript
import type { RequiredDataFromCollection } from 'payload/types'

import type { ArrayField } from '../../payload-types.js'

export const arrayDoc: RequiredDataFromCollection<ArrayField> = {
  arrayWithMinRows: [
    {
      text: 'first row',
    },
    {
      text: 'second row',
    },
  ],
  collapsedArray: [
    {
      text: 'initialize collapsed',
    },
  ],
  items: [
    {
      text: 'first row',
    },
    {
      text: 'second row',
    },
    {
      text: 'third row',
    },
    {
      text: 'fourth row',
    },
    {
      text: 'fifth row',
    },
    {
      text: 'sixth row',
    },
  ],
  title: 'array doc 1',
}

export const anotherArrayDoc: RequiredDataFromCollection<ArrayField> = {
  arrayWithMinRows: [
    {
      text: 'first row',
    },
    {
      text: 'second row',
    },
  ],
  collapsedArray: [
    {
      text: 'initialize collapsed',
    },
  ],
  items: [
    {
      text: 'first row',
    },
    {
      text: 'second row',
    },
    {
      text: 'third row',
    },
  ],
  title: 'array doc 2',
}
```

--------------------------------------------------------------------------------

````
