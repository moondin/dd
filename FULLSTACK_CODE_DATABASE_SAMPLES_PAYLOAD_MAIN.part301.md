---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 301
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 301 of 695)

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

---[FILE: jsx.spec.ts]---
Location: payload-main/packages/richtext-lexical/src/utilities/jsx/jsx.spec.ts

```typescript
import { extractPropsFromJSXPropsString } from './extractPropsFromJSXPropsString.js'
import { propsToJSXString } from './jsx.js'

describe('jsx', () => {
  describe('prop string to object', () => {
    const INPUT_AND_OUTPUT: {
      input: string
      inputFromOutput?: string
      output: Record<string, any>
    }[] = [
      {
        input: 'key="value"',
        output: {
          key: 'value',
        },
      },
      {
        input: "key='value'",
        output: {
          key: 'value',
        },
        inputFromOutput: 'key="value"',
      },
      {
        input: 'key={[1, 2, 3]}',
        output: {
          key: [1, 2, 3],
        },
      },
      {
        input: 'key={[1, 2, 3, [1, 2]]}',
        output: {
          key: [1, 2, 3, [1, 2]],
        },
      },
      {
        input: 'object={4}',
        output: {
          object: 4,
        },
      },
      {
        input: 'object={{"test": 1}}',
        output: {
          object: { test: 1 },
        },
      },
      {
        input: 'object={[1, 2, 3, [1, 2]]}',
        output: {
          object: [1, 2, 3, [1, 2]],
        },
      },
      {
        input: 'object={[1, 2]}',
        output: {
          object: [1, 2],
        },
      },
      {
        input: 'key="value" object={{key: "value"}}',
        inputFromOutput: 'key="value" object={{"key": "value"}}',
        output: {
          key: 'value',
          object: { key: 'value' },
        },
      },
      {
        input: 'global packageId="myId" uniqueId="some unique id!" update',
        output: {
          global: true,
          packageId: 'myId',
          uniqueId: 'some unique id!',
          update: true,
        },
      },
      {
        input:
          'global key="value" object={{key: "value", something: "test", hello: 1}} packageId="myId" uniqueId="some unique id!" update',
        inputFromOutput:
          'global key="value" object={{"hello": 1, "key": "value", "something": "test"}} packageId="myId" uniqueId="some unique id!" update',
        output: {
          global: true,
          key: 'value',
          object: { hello: 1, key: 'value', something: 'test' },
          packageId: 'myId',
          uniqueId: 'some unique id!',
          update: true,
        },
      },
      {
        input:
          'object={{hello: 1, key: "value", nested: { key: "value" }, something: "test", test: [1, 2, 3]}}',
        inputFromOutput:
          'object={{"hello": 1, "key": "value", "nested": {"key": "value"}, "something": "test", "test": [1, 2, 3]}}',
        output: {
          object: {
            hello: 1,
            key: 'value',
            nested: { key: 'value' },
            something: 'test',
            test: [1, 2, 3],
          },
        },
      },
      {
        input:
          'global key="value" object={{hello: 1, key: "value", nested: { key: "value" }, something: "test", test: [1, 2, 3]}} packageId="myId" uniqueId="some unique id!" update',
        inputFromOutput:
          'global key="value" object={{"hello": 1, "key": "value", "nested": { "key": "value" }, "something": "test", "test": [1, 2, 3]}} packageId="myId" uniqueId="some unique id!" update',
        output: {
          global: true,
          key: 'value',
          object: {
            hello: 1,
            key: 'value',
            nested: { key: 'value' },
            something: 'test',
            test: [1, 2, 3],
          },
          packageId: 'myId',
          uniqueId: 'some unique id!',
          update: true,
        },
      },
      {
        // Test if unquoted property keys in objects within arrays are supprted. This is
        // supported through the more lenient JSOX parser, instead of using JSON.parse()
        input: 'key={[1, 2, { hello: "there" }]}',
        inputFromOutput: 'key={[1, 2, { "hello": "there" }]}',
        output: {
          key: [1, 2, { hello: 'there' }],
        },
      },
      {
        // Test if ` strings work
        input: `key={[1, 2, { hello: \`there\` }]}`,
        inputFromOutput: 'key={[1, 2, { "hello": "there" }]}',
        output: {
          key: [1, 2, { hello: 'there' }],
        },
      },
      {
        // Test if multiline ` strings work
        input: `key={[1, 2, { hello: \`Hello
there\` }]}`,
        inputFromOutput: 'key={[1, 2, { "hello": "Hello\\nthere" }]}',
        output: {
          key: [1, 2, { hello: 'Hello\nthere' }],
        },
      },
    ]

    for (const { input, output } of INPUT_AND_OUTPUT) {
      it(`can correctly convert to object: "${input.replace(/\n/g, '\\n')}"`, () => {
        const propsObject = extractPropsFromJSXPropsString({ propsString: input })
        console.log({ output, propsObject })

        expect(propsObject).toStrictEqual(output)
      })
    }

    for (const { input: originalInput, inputFromOutput, output } of INPUT_AND_OUTPUT) {
      const input = inputFromOutput || originalInput
      it(`can correctly convert from object: "${input.replace(/\n/g, '\\n')}"`, () => {
        const propsString = propsToJSXString({ props: output })
        console.log({ input, propsString })

        expect(propsString.replaceAll(' ', '')).toBe(input.replaceAll(' ', ''))
      })
    }
  })
})
```

--------------------------------------------------------------------------------

---[FILE: jsx.ts]---
Location: payload-main/packages/richtext-lexical/src/utilities/jsx/jsx.ts

```typescript
/**
 * Converts an object of props to a JSX props string.
 *
 * This function is the inverse of `extractPropsFromJSXPropsString`.
 */
export function propsToJSXString({ props }: { props: Record<string, any> }): string {
  const propsArray: string[] = []

  for (const [key, value] of Object.entries(props)) {
    if (typeof value === 'string') {
      // Handle simple string props
      propsArray.push(`${key}="${escapeQuotes(value)}"`)
    } else if (typeof value === 'number') {
      // Handle number and boolean props
      propsArray.push(`${key}={${value}}`)
    } else if (typeof value === 'boolean') {
      if (value) {
        propsArray.push(`${key}`)
      }
    } else if (value !== null && typeof value === 'object') {
      if (Array.isArray(value)) {
        // Handle array props
        propsArray.push(`${key}={[${value.map((v) => JSON.stringify(v, replacer)).join(', ')}]}`)
      } else {
        // Handle complex object props
        propsArray.push(`${key}={${JSON.stringify(value, replacer)}}`)
      }
    }
  }

  return propsArray.join(' ')
}

// Helper function to escape quotes in string values
function escapeQuotes(str: string): string {
  return str.replace(/"/g, '&quot;')
}

// Custom replacer function for JSON.stringify to handle single quotes
function replacer(key: string, value: any): any {
  if (typeof value === 'string') {
    return value.replace(/'/g, "\\'")
  }
  return value
}

/**
 * Converts a frontmatter string to an object.
 */
export function frontmatterToObject(frontmatter: string): Record<string, any> {
  const lines = frontmatter.trim().split('\n')
  const result = {}
  let inFrontmatter = false

  for (const line of lines) {
    if (line.trim() === '---') {
      inFrontmatter = !inFrontmatter
      continue
    }

    if (inFrontmatter) {
      const [key, ...valueParts] = line.split(':')
      const value = valueParts.join(':').trim()

      // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
      result[key.trim()] = value
    }
  }

  return result
}

/**
 * Converts an object to a frontmatter string.
 */
export function objectToFrontmatter(obj: Record<string, any>): null | string {
  if (!Object.entries(obj)?.length) {
    return null
  }
  let frontmatter = '---\n'

  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      frontmatter += `${key}: ${value.join(', ')}\n`
    } else {
      frontmatter += `${key}: ${value}\n`
    }
  }

  frontmatter += '---\n'
  return frontmatter
}

/**
 * Takes an MDX content string and extracts the frontmatter and content.
 *
 * The resulting object contains the mdx content without the frontmatter and the frontmatter itself.
 */
export function extractFrontmatter(mdxContent: string) {
  // eslint-disable-next-line regexp/no-super-linear-backtracking
  const frontmatterRegex = /^---\s*\n[\s\S]*?\n---\s*\n/
  const match = mdxContent.match(frontmatterRegex)

  if (match) {
    const frontmatter = match[0]
    const contentWithoutFrontmatter = mdxContent.slice(frontmatter.length).trim()
    return {
      content: contentWithoutFrontmatter,
      frontmatter: frontmatter.trim(),
    }
  } else {
    // If no frontmatter is found, return the original content
    return {
      content: mdxContent.trim(),
      frontmatter: '',
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-lexical/src/utilities/migrateSlateToLexical/index.ts

```typescript
/* eslint-disable no-console */
import type { CollectionConfig, Field, GlobalConfig, Payload } from 'payload'

import { migrateDocumentFieldsRecursively } from './migrateDocumentFieldsRecursively.js'

/**
 * This goes through every single collection and field in the payload config, and migrates its data from Slate to Lexical. This does not support sub-fields within slate.
 *
 * It will only translate fields fulfilling all these requirements:
 * - field schema uses lexical editor
 * - lexical editor has SlateToLexicalFeature added
 * - saved field data is in Slate format
 *
 * @param payload
 */
export async function migrateSlateToLexical({ payload }: { payload: Payload }) {
  const collections = payload.config.collections

  const errors: unknown[] = []

  const allLocales = payload.config.localization ? payload.config.localization.localeCodes : [null]

  const totalCollections = collections.length
  for (const locale of allLocales) {
    let curCollection = 0
    for (const collection of collections) {
      curCollection++
      await migrateCollection({
        collection,
        cur: curCollection,
        errors,
        locale,
        max: totalCollections,
        payload,
      })
    }
    for (const global of payload.config.globals) {
      await migrateGlobal({
        errors,
        global,
        locale,
        payload,
      })
    }
  }

  if (errors.length) {
    console.error(`Found ${errors.length} errors::`, JSON.stringify(errors, null, 2))
  } else {
    console.log('Migration successful - no errors')
  }
}

async function migrateGlobal({
  errors,
  global,
  locale,
  payload,
}: {
  errors: unknown[]
  global: GlobalConfig
  locale: null | string
  payload: Payload
}) {
  console.log(`SlateToLexical: ${locale}: Migrating global:`, global.slug)

  const document = await payload.findGlobal({
    slug: global.slug,
    depth: 0,
    draft: true,
    locale: locale || undefined,
    overrideAccess: true,
  })

  const found = migrateDocument({
    document,
    fields: global.fields,
    payload,
  })

  if (found) {
    try {
      await payload.updateGlobal({
        slug: global.slug,
        data: document,
        depth: 0,
        draft: document?._status === 'draft',
        locale: locale || undefined,
      })
      // Catch it, because some errors were caused by the user previously (e.g. invalid relationships) and will throw an error now, even though they are not related to the migration
    } catch (e) {
      console.log('Error updating global', e, {
        slug: global.slug,
      })
      errors.push(e)
    }
  }
}

async function migrateCollection({
  collection,
  cur,
  errors,
  locale,
  max,
  payload,
}: {
  collection: CollectionConfig
  cur: number
  errors: unknown[]
  locale: null | string
  max: number
  payload: Payload
}) {
  console.log(
    `SlateToLexical: ${locale}: Migrating collection:`,
    collection.slug,
    '(' + cur + '/' + max + ')',
  )

  const documentCount = (
    await payload.count({
      collection: collection.slug,
      depth: 0,
      locale: locale || undefined,
    })
  ).totalDocs

  let page = 1
  let migrated = 0

  while (migrated < documentCount) {
    const documents = await payload.find({
      collection: collection.slug,
      depth: 0,
      draft: true,
      locale: locale || undefined,
      overrideAccess: true,
      page,
      pagination: true,
    })

    for (const document of documents.docs) {
      migrated++
      console.log(
        `SlateToLexical: ${locale}: Migrating collection:`,
        collection.slug,
        '(' +
          cur +
          '/' +
          max +
          ') - Migrating Document: ' +
          document.id +
          ' (' +
          migrated +
          '/' +
          documentCount +
          ')',
      )
      const found = migrateDocument({
        document,
        fields: collection.fields,
        payload,
      })

      if (found) {
        try {
          await payload.update({
            id: document.id,
            collection: collection.slug,
            data: document,
            depth: 0,
            draft: document?._status === 'draft',
            locale: locale || undefined,
          })
          // Catch it, because some errors were caused by the user previously (e.g. invalid relationships) and will throw an error now, even though they are not related to the migration
        } catch (e) {
          errors.push(e)

          console.log('Error updating collection', e, {
            id: document.id,
            slug: collection.slug,
          })
        }
      }
    }
    page++
  }
}

function migrateDocument({
  document,
  fields,
  payload,
}: {
  document: Record<string, unknown>
  fields: Field[]
  payload: Payload
}): boolean {
  return !!migrateDocumentFieldsRecursively({
    data: document,
    fields,
    found: 0,
    payload,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: migrateDocumentFieldsRecursively.ts]---
Location: payload-main/packages/richtext-lexical/src/utilities/migrateSlateToLexical/migrateDocumentFieldsRecursively.ts

```typescript
import type { Field, FlattenedBlock, Payload } from 'payload'

import { fieldAffectsData, fieldHasSubFields, fieldIsArrayType, tabHasName } from 'payload/shared'

import type {
  SlateNode,
  SlateNodeConverter,
} from '../../features/migrations/slateToLexical/converter/types.js'
import type { LexicalRichTextAdapter } from '../../types.js'

import { convertSlateToLexical } from '../../features/migrations/slateToLexical/converter/index.js'

type NestedRichTextFieldsArgs = {
  data: Record<string, unknown>

  fields: Field[]
  found: number
  payload: Payload
}

export const migrateDocumentFieldsRecursively = ({
  data,
  fields,
  found,
  payload,
}: NestedRichTextFieldsArgs): number => {
  for (const field of fields) {
    if (fieldHasSubFields(field) && !fieldIsArrayType(field)) {
      if (fieldAffectsData(field) && typeof data[field.name] === 'object') {
        found += migrateDocumentFieldsRecursively({
          data: data[field.name] as Record<string, unknown>,
          fields: field.fields,
          found,
          payload,
        })
      } else {
        found += migrateDocumentFieldsRecursively({
          data,
          fields: field.fields,
          found,
          payload,
        })
      }
    } else if (field.type === 'tabs') {
      field.tabs.forEach((tab) => {
        found += migrateDocumentFieldsRecursively({
          data: (tabHasName(tab) ? data[tab.name] : data) as Record<string, unknown>,
          fields: tab.fields,
          found,
          payload,
        })
      })
    } else if (Array.isArray(data[field.name])) {
      if (field.type === 'blocks') {
        ;(data[field.name] as Array<Record<string, unknown>>).forEach((row) => {
          const blockTypeToMatch: string = row?.blockType as string
          const block =
            payload?.blocks[blockTypeToMatch] ??
            ((field.blockReferences ?? field.blocks).find(
              (block) => typeof block !== 'string' && block.slug === blockTypeToMatch,
            ) as FlattenedBlock | undefined)

          if (block) {
            found += migrateDocumentFieldsRecursively({
              data: row,
              fields: block.fields,
              found,
              payload,
            })
          }
        })
      }

      if (field.type === 'array') {
        ;(data[field.name] as Array<Record<string, unknown>>).forEach((row) => {
          found += migrateDocumentFieldsRecursively({
            data: row,
            fields: field.fields,
            found,
            payload,
          })
        })
      }
    }

    if (field.type === 'richText' && Array.isArray(data[field.name])) {
      // Slate richText
      const editor: LexicalRichTextAdapter = field.editor as LexicalRichTextAdapter
      if (editor && typeof editor === 'object') {
        if ('features' in editor && editor.features?.length) {
          // find slatetolexical feature
          const slateToLexicalFeature = editor.editorConfig.resolvedFeatureMap.get('slateToLexical')
          if (slateToLexicalFeature) {
            // DO CONVERSION

            const { converters } = slateToLexicalFeature.sanitizedServerFeatureProps as {
              converters?: SlateNodeConverter[]
            }

            data[field.name] = convertSlateToLexical({
              converters: converters!,
              slateData: data[field.name] as SlateNode[],
            })

            found++
          }
        }
      }
    }
  }

  return found
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-lexical/src/utilities/upgradeLexicalData/index.ts

```typescript
import type { CollectionConfig, Field, GlobalConfig, Payload } from 'payload'

import { upgradeDocumentFieldsRecursively } from './upgradeDocumentFieldsRecursively.js'

/**
 * This goes through every single document in your payload app and re-saves it, if it has a lexical editor.
 * This way, the data is automatically converted to the new format, and that automatic conversion gets applied to every single document in your app.
 *
 * @param payload
 */
export async function upgradeLexicalData({ payload }: { payload: Payload }) {
  const collections = payload.config.collections

  const allLocales = payload.config.localization ? payload.config.localization.localeCodes : [null]

  const totalCollections = collections.length
  for (const locale of allLocales) {
    let curCollection = 0
    for (const collection of collections) {
      curCollection++
      await upgradeCollection({
        collection,
        cur: curCollection,
        locale,
        max: totalCollections,
        payload,
      })
    }
    for (const global of payload.config.globals) {
      await upgradeGlobal({
        global,
        locale,
        payload,
      })
    }
  }
}

async function upgradeGlobal({
  global,
  locale,
  payload,
}: {
  global: GlobalConfig
  locale: null | string
  payload: Payload
}) {
  console.log(`Lexical Upgrader: ${locale}: Upgrading global:`, global.slug)

  const document = await payload.findGlobal({
    slug: global.slug,
    depth: 0,
    locale: locale || undefined,
    overrideAccess: true,
  })

  const found = upgradeDocument({
    document,
    fields: global.fields,
    payload,
  })

  if (found) {
    await payload.updateGlobal({
      slug: global.slug,
      data: document,
      depth: 0,
      locale: locale || undefined,
    })
  }
}

async function upgradeCollection({
  collection,
  cur,
  locale,
  max,
  payload,
}: {
  collection: CollectionConfig
  cur: number
  locale: null | string
  max: number
  payload: Payload
}) {
  console.log(
    `Lexical Upgrade: ${locale}: Upgrading collection:`,
    collection.slug,
    '(' + cur + '/' + max + ')',
  )

  const documentCount = (
    await payload.count({
      collection: collection.slug,
      depth: 0,
      locale: locale || undefined,
    })
  ).totalDocs

  let page = 1
  let upgraded = 0

  while (upgraded < documentCount) {
    const documents = await payload.find({
      collection: collection.slug,
      depth: 0,
      locale: locale || undefined,
      overrideAccess: true,
      page,
      pagination: true,
    })

    for (const document of documents.docs) {
      upgraded++
      console.log(
        `Lexical Upgrade: ${locale}: Upgrading collection:`,
        collection.slug,
        '(' +
          cur +
          '/' +
          max +
          ') - Upgrading Document: ' +
          document.id +
          ' (' +
          upgraded +
          '/' +
          documentCount +
          ')',
      )
      const found = upgradeDocument({
        document,
        fields: collection.fields,
        payload,
      })

      if (found) {
        await payload.update({
          id: document.id,
          collection: collection.slug,
          data: document,
          depth: 0,
          locale: locale || undefined,
        })
      }
    }
    page++
  }
}

function upgradeDocument({
  document,
  fields,
  payload,
}: {
  document: Record<string, unknown>
  fields: Field[]
  payload: Payload
}): boolean {
  return !!upgradeDocumentFieldsRecursively({
    data: document,
    fields,
    found: 0,
    payload,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: upgradeDocumentFieldsRecursively.ts]---
Location: payload-main/packages/richtext-lexical/src/utilities/upgradeLexicalData/upgradeDocumentFieldsRecursively.ts

```typescript
import type { SerializedEditorState } from 'lexical'
import type { Field, FlattenedBlock, Payload } from 'payload'

import { createHeadlessEditor } from '@lexical/headless'
import { fieldAffectsData, fieldHasSubFields, fieldIsArrayType, tabHasName } from 'payload/shared'

import type { LexicalRichTextAdapter } from '../../types.js'

import { getEnabledNodes } from '../../lexical/nodes/index.js'

type NestedRichTextFieldsArgs = {
  data: Record<string, unknown>

  fields: Field[]
  found: number
  payload: Payload
}

export const upgradeDocumentFieldsRecursively = ({
  data,
  fields,
  found,
  payload,
}: NestedRichTextFieldsArgs): number => {
  for (const field of fields) {
    if (fieldHasSubFields(field) && !fieldIsArrayType(field)) {
      if (fieldAffectsData(field) && typeof data[field.name] === 'object') {
        found += upgradeDocumentFieldsRecursively({
          data: data[field.name] as Record<string, unknown>,
          fields: field.fields,
          found,
          payload,
        })
      } else {
        found += upgradeDocumentFieldsRecursively({
          data,
          fields: field.fields,
          found,
          payload,
        })
      }
    } else if (field.type === 'tabs') {
      field.tabs.forEach((tab) => {
        found += upgradeDocumentFieldsRecursively({
          data: (tabHasName(tab) ? data[tab.name] : data) as Record<string, unknown>,
          fields: tab.fields,
          found,
          payload,
        })
      })
    } else if (Array.isArray(data[field.name])) {
      if (field.type === 'blocks') {
        ;(data[field.name] as Record<string, unknown>[]).forEach((row) => {
          const blockTypeToMatch: string = row?.blockType as string

          const block =
            payload.blocks[blockTypeToMatch] ??
            ((field.blockReferences ?? field.blocks).find(
              (block) => typeof block !== 'string' && block.slug === blockTypeToMatch,
            ) as FlattenedBlock | undefined)

          if (block) {
            found += upgradeDocumentFieldsRecursively({
              data: row,
              fields: block.fields,
              found,
              payload,
            })
          }
        })
      }

      if (field.type === 'array') {
        ;(data[field.name] as Record<string, unknown>[]).forEach((row) => {
          found += upgradeDocumentFieldsRecursively({
            data: row,
            fields: field.fields,
            found,
            payload,
          })
        })
      }
    }

    if (
      field.type === 'richText' &&
      data[field.name] &&
      !Array.isArray(data[field.name]) &&
      'root' in (data[field.name] as Record<string, unknown>)
    ) {
      // Lexical richText
      const editor: LexicalRichTextAdapter = field.editor as LexicalRichTextAdapter
      if (editor && typeof editor === 'object') {
        if ('features' in editor && editor.features?.length) {
          // Load lexical editor into lexical, then save it immediately
          const editorState = data[field.name] as SerializedEditorState

          const headlessEditor = createHeadlessEditor({
            nodes: getEnabledNodes({
              editorConfig: editor.editorConfig,
            }),
          })
          headlessEditor.update(
            () => {
              headlessEditor.setEditorState(headlessEditor.parseEditorState(editorState))
            },
            { discrete: true },
          )

          // get editor state
          data[field.name] = headlessEditor.getEditorState().toJSON()

          found++
        }
      }
    }
  }

  return found
}
```

--------------------------------------------------------------------------------

---[FILE: hasText.ts]---
Location: payload-main/packages/richtext-lexical/src/validate/hasText.ts

```typescript
import type {
  SerializedEditorState,
  SerializedLexicalNode,
  SerializedParagraphNode,
  SerializedTextNode,
} from 'lexical'

export function hasText(
  value: null | SerializedEditorState<SerializedLexicalNode> | undefined,
): boolean {
  const hasChildren = !!value?.root?.children?.length

  let hasOnlyEmptyParagraph = false
  if (value?.root?.children?.length === 1) {
    if (value?.root?.children[0]?.type === 'paragraph') {
      const paragraphNode = value?.root?.children[0] as SerializedParagraphNode

      if (!paragraphNode?.children || paragraphNode?.children?.length === 0) {
        hasOnlyEmptyParagraph = true
      } else if (paragraphNode?.children?.length === 1) {
        const paragraphNodeChild = paragraphNode?.children[0]
        if (paragraphNodeChild?.type === 'text') {
          if (!(paragraphNodeChild as SerializedTextNode | undefined)?.['text']?.length) {
            hasOnlyEmptyParagraph = true
          }
        }
      }
    }
  }

  if (!hasChildren || hasOnlyEmptyParagraph) {
    return false
  } else {
    return true
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-lexical/src/validate/index.ts

```typescript
import type { SerializedEditorState } from 'lexical'
import type { RichTextField, Validate } from 'payload'

import type { SanitizedServerEditorConfig } from '../lexical/config/types.js'

import { hasText } from './hasText.js'
import { validateNodes } from './validateNodes.js'

export const richTextValidateHOC = ({
  editorConfig,
}: {
  editorConfig: SanitizedServerEditorConfig
}) => {
  const richTextValidate: Validate<SerializedEditorState, unknown, unknown, RichTextField> = async (
    value,
    options,
  ) => {
    const {
      req: { t },
      required,
    } = options

    if (required && hasText(value) === false) {
      return t('validation:required')
    }

    // Traverse through nodes and validate them. Just like a node can hook into the population process (e.g. link or relationship nodes),
    // they can also hook into the validation process. E.g. a block node probably has fields with validation rules.

    const rootNodes = value?.root?.children
    if (rootNodes && Array.isArray(rootNodes) && rootNodes?.length) {
      return await validateNodes({
        nodes: rootNodes,
        nodeValidations: editorConfig.features.validations,
        validation: {
          options,
          value,
        },
      })
    }

    return true
  }

  return richTextValidate
}
```

--------------------------------------------------------------------------------

---[FILE: validateNodes.ts]---
Location: payload-main/packages/richtext-lexical/src/validate/validateNodes.ts

```typescript
import type { SerializedEditorState, SerializedLexicalNode } from 'lexical'
import type { RichTextField, ValidateOptions } from 'payload'

import type { NodeValidation } from '../features/typesServer.js'

export async function validateNodes({
  nodes,
  nodeValidations,
  validation: validationFromProps,
}: {
  nodes: SerializedLexicalNode[]
  nodeValidations: Map<string, Array<NodeValidation>>
  validation: {
    options: ValidateOptions<unknown, unknown, RichTextField, SerializedEditorState>
    value: SerializedEditorState
  }
}): Promise<string | true> {
  for (const node of nodes) {
    // Validate node
    const validations = nodeValidations.get(node.type)
    if (validations) {
      for (const validation of validations) {
        const validationResult = await validation({
          node,
          nodeValidations,
          validation: validationFromProps,
        })
        if (validationResult !== true) {
          return `${node.type} node failed to validate: ${validationResult}`
        }
      }
    }

    // Validate node's children
    if ('children' in node && node?.children) {
      const childrenValidationResult = await validateNodes({
        nodes: node.children as SerializedLexicalNode[],
        nodeValidations,
        validation: validationFromProps,
      })
      if (childrenValidationResult !== true) {
        return childrenValidationResult
      }
    }
  }

  return true
}
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: payload-main/packages/richtext-slate/.prettierignore

```text
.tmp
**/.git
**/.hg
**/.pnp.*
**/.svn
**/.yarn/**
**/build
**/dist/**
**/node_modules
**/temp
```

--------------------------------------------------------------------------------

---[FILE: .swcrc]---
Location: payload-main/packages/richtext-slate/.swcrc

```text
{
  "$schema": "https://json.schemastore.org/swcrc",
  "sourceMaps": true,
  "jsc": {
    "target": "esnext",
    "parser": {
      "syntax": "typescript",
      "tsx": true,
      "dts": true
    },
    "transform": {
      "react": {
        "runtime": "automatic",
        "pragmaFrag": "React.Fragment",
        "throwIfNamespace": true,
        "development": false,
        "useBuiltins": true
      }
    }
  },
  "module": {
    "type": "es6"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: LICENSE.md]---
Location: payload-main/packages/richtext-slate/LICENSE.md

```text
MIT License

Copyright (c) 2018-2025 Payload CMS, Inc. <info@payloadcms.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: payload-main/packages/richtext-slate/package.json
Signals: React

```json
{
  "name": "@payloadcms/richtext-slate",
  "version": "3.68.5",
  "description": "The officially supported Slate richtext adapter for Payload",
  "homepage": "https://payloadcms.com",
  "repository": {
    "type": "git",
    "url": "https://github.com/payloadcms/payload.git",
    "directory": "packages/richtext-slate"
  },
  "license": "MIT",
  "author": "Payload <dev@payloadcms.com> (https://payloadcms.com)",
  "maintainers": [
    {
      "name": "Payload",
      "email": "info@payloadcms.com",
      "url": "https://payloadcms.com"
    }
  ],
  "sideEffects": [
    "*.scss",
    "*.css"
  ],
  "type": "module",
  "exports": {
    ".": {
      "import": "./src/index.tsx",
      "types": "./src/index.tsx",
      "default": "./src/index.tsx"
    },
    "./client": {
      "import": "./src/exports/client/index.ts",
      "types": "./src/exports/client/index.ts",
      "default": "./src/exports/client/index.ts"
    },
    "./rsc": {
      "import": "./src/exports/server/rsc.ts",
      "types": "./src/exports/server/rsc.ts",
      "default": "./src/exports/server/rsc.ts"
    }
  },
  "main": "./src/index.tsx",
  "types": "./src/index.tsx",
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "pnpm copyfiles && pnpm build:types && pnpm build:swc",
    "build:debug": "pnpm build",
    "build:swc": "swc ./src -d ./dist --config-file .swcrc --strip-leading-paths",
    "build:types": "tsc --emitDeclarationOnly --outDir dist",
    "clean": "rimraf -g {dist,*.tsbuildinfo}",
    "copyfiles": "copyfiles -u 1 \"src/**/*.{html,css,scss,ttf,woff,woff2,eot,svg,jpg,png,json}\" dist/",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  },
  "dependencies": {
    "@payloadcms/translations": "workspace:*",
    "@payloadcms/ui": "workspace:*",
    "is-hotkey": "0.2.0",
    "slate": "0.91.4",
    "slate-history": "0.86.0",
    "slate-hyperscript": "0.81.3",
    "slate-react": "0.92.0"
  },
  "devDependencies": {
    "@payloadcms/eslint-config": "workspace:*",
    "@types/is-hotkey": "^0.1.10",
    "@types/node": "22.15.30",
    "@types/react": "19.2.1",
    "@types/react-dom": "19.2.1",
    "payload": "workspace:*"
  },
  "peerDependencies": {
    "payload": "workspace:*",
    "react": "^19.0.1 || ^19.1.2 || ^19.2.1",
    "react-dom": "^19.0.1 || ^19.1.2 || ^19.2.1"
  },
  "engines": {
    "node": "^18.20.2 || >=20.9.0"
  },
  "publishConfig": {
    "exports": {
      ".": {
        "import": "./dist/index.js",
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "./rsc": {
        "import": "./dist/exports/server/rsc.js",
        "types": "./dist/exports/server/rsc.d.ts",
        "default": "./dist/exports/server/rsc.js"
      },
      "./client": {
        "import": "./dist/exports/client/index.js",
        "types": "./dist/exports/client/index.d.ts",
        "default": "./dist/exports/client/index.js"
      }
    },
    "main": "./dist/index.js",
    "registry": "https://registry.npmjs.org/",
    "types": "./dist/index.d.ts"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: payload-main/packages/richtext-slate/README.md

```text
# Payload Slate Rich Text Editor

Slate Rich Text Editor for [Payload](https://payloadcms.com).

- [Main Repository](https://github.com/payloadcms/payload)
- [Payload Docs](https://payloadcms.com/docs)

## Installation

```bash
npm install @payloadcms/richtext-slate
```

## Usage

```ts
import { buildConfig } from 'payload'
import { slateEditor } from '@payloadcms/richtext-slate'

export default buildConfig({
  editor: slateEditor({}),
  // ...rest of config
})
```

More detailed usage can be found in the [Payload Docs](https://payloadcms.com/docs/configuration/overview).
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/packages/richtext-slate/tsconfig.json
Signals: React

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "composite": true, // Make sure typescript knows that this module depends on their references
    "noEmit": false /* Do not emit outputs. */,
    "emitDeclarationOnly": true,
    "outDir": "./dist" /* Specify an output folder for all emitted files. */,
    "rootDir": "./src" /* Specify the root folder within your source files. */,
    "jsx": "react-jsx",

    /* TODO: remove the following lines */
    "strict": false,
  },
  "exclude": [
    "dist",
    "build",
    "tests",
    "test",
    "node_modules",
    "eslint.config.js",
    "src/**/*.spec.js",
    "src/**/*.spec.jsx",
    "src/**/*.spec.ts",
    "src/**/*.spec.tsx"
  ],
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.d.ts",
    "src/**/*.json",
    "src/field/leaves/italic/Italic"
  ],
  "references": [{ "path": "../payload" }, { "path": "../translations" }, { "path": "../ui" }]
}
```

--------------------------------------------------------------------------------

---[FILE: generateSchemaMap.ts]---
Location: payload-main/packages/richtext-slate/src/generateSchemaMap.ts

```typescript
import type { Field, RichTextAdapter } from 'payload'

import { traverseFields } from '@payloadcms/ui/utilities/buildFieldSchemaMap/traverseFields'

import type { AdapterArguments, RichTextCustomElement } from './types.js'

import { elements as elementTypes } from './field/elements/index.js'
import { linkFieldsSchemaPath } from './field/elements/link/shared.js'
import { uploadFieldsSchemaPath } from './field/elements/upload/shared.js'

export const getGenerateSchemaMap =
  (args: AdapterArguments): RichTextAdapter['generateSchemaMap'] =>
  ({ config, i18n, schemaMap, schemaPath }) => {
    ;(args?.admin?.elements || Object.values(elementTypes)).forEach((el) => {
      let element: RichTextCustomElement

      if (typeof el === 'object' && el !== null) {
        element = el
      } else if (typeof el === 'string' && elementTypes[el]) {
        element = elementTypes[el]
      }

      if (element) {
        switch (element.name) {
          case 'link': {
            if (args.admin?.link?.fields) {
              schemaMap.set(`${schemaPath}.${linkFieldsSchemaPath}`, {
                fields: args.admin?.link?.fields as Field[],
              })

              // generate schema map entries for sub-fields using traverseFields
              traverseFields({
                config,
                fields: args.admin?.link?.fields as Field[],
                i18n,
                parentIndexPath: '',
                parentSchemaPath: `${schemaPath}.${linkFieldsSchemaPath}`,
                schemaMap,
              })
            }

            break
          }

          case 'relationship':
            break

          case 'upload': {
            const uploadEnabledCollections = config.collections.filter(
              ({ admin: { enableRichTextRelationship, hidden }, upload }) => {
                if (hidden === true) {
                  return false
                }

                return enableRichTextRelationship && Boolean(upload) === true
              },
            )

            uploadEnabledCollections.forEach((collection) => {
              if (args?.admin?.upload?.collections[collection.slug]?.fields) {
                schemaMap.set(`${schemaPath}.${uploadFieldsSchemaPath}.${collection.slug}`, {
                  fields: args?.admin?.upload?.collections[collection.slug]?.fields,
                })

                // generate schema map entries for sub-fields using traverseFields
                traverseFields({
                  config,
                  fields: args?.admin?.upload?.collections[collection.slug]?.fields,
                  i18n,
                  parentIndexPath: '',
                  parentSchemaPath: `${schemaPath}.${uploadFieldsSchemaPath}.${collection.slug}`,
                  schemaMap,
                })
              }
            })

            break
          }
        }
      }
    })

    return schemaMap
  }
```

--------------------------------------------------------------------------------

````
