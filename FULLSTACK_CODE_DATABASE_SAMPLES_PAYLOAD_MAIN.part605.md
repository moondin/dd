---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 605
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 605 of 695)

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
Location: payload-main/test/lexical/collections/_LexicalFullyFeatured/db/e2e.spec.ts

```typescript
import {
  buildEditorState,
  type DefaultNodeTypes,
  type SerializedInlineBlockNode,
} from '@payloadcms/richtext-lexical'
import { expect, type Page, test } from '@playwright/test'
import { lexicalFullyFeaturedSlug } from 'lexical/slugs.js'
import path from 'path'
import { fileURLToPath } from 'url'

import type { PayloadTestSDK } from '../../../../helpers/sdk/index.js'
import type { Config, InlineBlockWithSelect } from '../../../payload-types.js'

import { ensureCompilationIsDone, saveDocAndAssert } from '../../../../helpers.js'
import { AdminUrlUtil } from '../../../../helpers/adminUrlUtil.js'
import { assertNetworkRequests } from '../../../../helpers/e2e/assertNetworkRequests.js'
import { initPayloadE2ENoConfig } from '../../../../helpers/initPayloadE2ENoConfig.js'
import { reInitializeDB } from '../../../../helpers/reInitializeDB.js'
import { TEST_TIMEOUT_LONG } from '../../../../playwright.config.js'
import { LexicalHelpers, type PasteMode } from '../../utils.js'

const filename = fileURLToPath(import.meta.url)
const currentFolder = path.dirname(filename)
const dirname = path.resolve(currentFolder, '../../../')

let payload: PayloadTestSDK<Config>
let serverURL: string

const { beforeAll, beforeEach, describe } = test

// This test suite resets the database before each test to ensure a clean state and cannot be run in parallel.
// Use this for tests that modify the database.
describe('Lexical Fully Featured - database', () => {
  let lexical: LexicalHelpers
  let url: AdminUrlUtil
  beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)
    process.env.SEED_IN_CONFIG_ONINIT = 'false' // Makes it so the payload config onInit seed is not run. Otherwise, the seed would be run unnecessarily twice for the initial test run - once for beforeEach and once for onInit
    ;({ payload, serverURL } = await initPayloadE2ENoConfig<Config>({ dirname }))

    const page = await browser.newPage()
    await ensureCompilationIsDone({ page, serverURL })
    await page.close()
  })
  beforeEach(async ({ page }) => {
    await reInitializeDB({
      serverURL,
      snapshotKey: 'lexicalTest',
      uploadsDir: [path.resolve(dirname, './collections/Upload/uploads')],
    })
    url = new AdminUrlUtil(serverURL, lexicalFullyFeaturedSlug)
    lexical = new LexicalHelpers(page)
    await page.goto(url.create)
    await lexical.editor.first().focus()
  })

  describe('auto upload', () => {
    const filePath = path.resolve(dirname, './collections/Upload/payload.jpg')

    async function uploadsTest(page: Page, mode: 'cmd+v' | PasteMode, expectedFileName?: string) {
      if (mode === 'cmd+v') {
        await page.keyboard.press('Meta+V')
        await page.keyboard.press('Control+V')
      } else {
        await lexical.pasteFile({ filePath, mode })
      }

      await expect(lexical.drawer).toBeVisible()
      await lexical.drawer.locator('.bulk-upload--actions-bar').getByText('Save').click()
      await expect(lexical.drawer).toBeHidden()

      await expect(lexical.editor.locator('.LexicalEditorTheme__upload')).toHaveCount(1)
      await expect(
        lexical.editor.locator('.LexicalEditorTheme__upload__doc-drawer-toggler'),
      ).toHaveText(expectedFileName || 'payload-1.jpg')

      const uploadedImage = await payload.find({
        collection: 'uploads',
        where: { filename: { equals: expectedFileName || 'payload-1.jpg' } },
      })
      expect(uploadedImage.totalDocs).toBe(1)
    }

    // eslint-disable-next-line playwright/expect-expect
    test('ensure auto upload by copy & pasting image works when pasting a blob', async ({
      page,
    }) => {
      await uploadsTest(page, 'blob')
    })

    // eslint-disable-next-line playwright/expect-expect
    test('ensure auto upload by copy & pasting image works when pasting as html', async ({
      page,
    }) => {
      // blob will be put in src of img tag => cannot infer file name
      await uploadsTest(page, 'html', 'pasted-image.jpeg')
    })

    test('ensure auto upload by copy & pasting image works when pasting from website', async ({
      page,
    }) => {
      await page.goto(url.admin + '/custom-image')
      await page.keyboard.press('Meta+A')
      await page.keyboard.press('Control+A')

      await page.keyboard.press('Meta+C')
      await page.keyboard.press('Control+C')

      await page.goto(url.create)
      await lexical.editor.first().focus()
      await expect(lexical.editor).toBeFocused()

      await uploadsTest(page, 'cmd+v')

      // Save page
      await saveDocAndAssert(page)

      const lexicalFullyFeatured = await payload.find({
        collection: lexicalFullyFeaturedSlug,
        limit: 1,
      })
      const richText = lexicalFullyFeatured?.docs?.[0]?.richText

      const headingNode = richText?.root?.children[0]
      expect(headingNode).toBeDefined()
      expect(headingNode?.children?.[1]?.text).toBe('This is an image:')

      const uploadNode = richText?.root?.children?.[1]?.children?.[0]
      // @ts-expect-error unsafe access is fine in tests
      expect(uploadNode.value?.filename).toBe('payload-1.jpg')
    })

    test('ensure block contents are not reset on save on both create and update', async ({
      page,
    }) => {
      await lexical.slashCommand('myblock')
      await expect(lexical.editor.locator('.LexicalEditorTheme__block')).toBeVisible()

      /**
       * Test on create
       */
      await assertNetworkRequests(
        page,
        `/admin/collections/${lexicalFullyFeaturedSlug}`,
        async () => {
          await lexical.editor.locator('#field-someText').first().fill('Testing 123')
        },
        {
          minimumNumberOfRequests: 2,
          allowedNumberOfRequests: 3,
        },
      )

      await expect(lexical.editor.locator('#field-someText')).toHaveValue('Testing 123')
      await saveDocAndAssert(page)
      await expect(lexical.editor.locator('#field-someText')).toHaveValue('Testing 123')
      await page.reload()
      await expect(lexical.editor.locator('#field-someText')).toHaveValue('Testing 123')

      /**
       * Test on update (this is where the issue appeared)
       */
      await assertNetworkRequests(
        page,
        `/admin/collections/${lexicalFullyFeaturedSlug}`,
        async () => {
          await lexical.editor.locator('#field-someText').first().fill('Updated text')
        },
        {
          minimumNumberOfRequests: 2,
          allowedNumberOfRequests: 2,
        },
      )
      await expect(lexical.editor.locator('#field-someText')).toHaveValue('Updated text')
      await saveDocAndAssert(page)
      await expect(lexical.editor.locator('#field-someText')).toHaveValue('Updated text')
      await page.reload()
      await expect(lexical.editor.locator('#field-someText')).toHaveValue('Updated text')
    })
  })

  test('ensure inline block initial form state is applied on load for inline blocks with select fields', async ({
    page,
  }) => {
    const doc = await payload.create({
      collection: 'lexical-fully-featured',
      data: {
        richText: buildEditorState<
          DefaultNodeTypes | SerializedInlineBlockNode<InlineBlockWithSelect>
        >({
          nodes: [
            {
              type: 'inlineBlock',
              version: 1,
              fields: {
                blockType: 'inlineBlockWithSelect',
                id: '1',
              },
            },
            {
              type: 'inlineBlock',
              version: 1,
              fields: {
                blockType: 'inlineBlockWithSelect',
                id: '2',
              },
            },
            {
              type: 'inlineBlock',
              version: 1,
              fields: {
                blockType: 'inlineBlockWithSelect',
                id: '3',
              },
            },
          ],
        }),
      },
    })

    /**
     * Ensure there are no unnecessary, additional form state requests made, since we already have the form state as part of the initial state.
     */
    await assertNetworkRequests(
      page,
      `/admin/collections/${lexicalFullyFeaturedSlug}`,
      async () => {
        await page.goto(url.edit(doc.id))
        await lexical.editor.first().focus()
      },
      {
        minimumNumberOfRequests: 0,
        allowedNumberOfRequests: 0,
        requestFilter: (request) => {
          // Ensure it's a form state request
          if (request.method() === 'POST') {
            const requestBody = request.postDataJSON()

            return (
              Array.isArray(requestBody) &&
              requestBody.length > 0 &&
              requestBody[0].name === 'form-state'
            )
          }
          return false
        },
      },
    )
  })

  test('ensure block name can be saved and loaded', async ({ page }) => {
    await lexical.slashCommand('myblock')
    await expect(lexical.editor.locator('.LexicalEditorTheme__block')).toBeVisible()

    const blockNameInput = lexical.editor.locator('#blockName')

    /**
     * Test on create
     */
    await assertNetworkRequests(
      page,
      `/admin/collections/${lexicalFullyFeaturedSlug}`,
      async () => {
        await blockNameInput.fill('Testing 123')
      },
      {
        minimumNumberOfRequests: 2,
        allowedNumberOfRequests: 3,
      },
    )

    await expect(blockNameInput).toHaveValue('Testing 123')
    await saveDocAndAssert(page)
    await expect(blockNameInput).toHaveValue('Testing 123')
    await page.reload()
    await expect(blockNameInput).toHaveValue('Testing 123')

    /**
     * Test on update
     */
    await assertNetworkRequests(
      page,
      `/admin/collections/${lexicalFullyFeaturedSlug}`,
      async () => {
        await blockNameInput.fill('Updated blockname')
      },
      {
        minimumNumberOfRequests: 2,
        allowedNumberOfRequests: 2,
      },
    )
    await expect(blockNameInput).toHaveValue('Updated blockname')
    await saveDocAndAssert(page)
    await expect(blockNameInput).toHaveValue('Updated blockname')
    await page.reload()
    await expect(blockNameInput).toHaveValue('Updated blockname')
  })
})
```

--------------------------------------------------------------------------------

---[FILE: CollectionsExplained.tsx]---
Location: payload-main/test/lexical/components/CollectionsExplained.tsx
Signals: React

```typescript
import React from 'react'

export function CollectionsExplained() {
  return (
    <div>
      <h1>Which collection should I use for my tests?</h1>

      <p>
        By default and as a rule of thumb: "Lexical Fully Featured". This collection has all our
        features, but it does NOT have (and will never have):
      </p>
      <ul>
        <li>Relationships or dependencies to other collections</li>
        <li>Seeded documents</li>
        <li>Features with custom props (except for a block and an inline block included)</li>
        <li>Multiple richtext fields or other fields</li>
      </ul>

      <p>If you need any of these features, use another collection or create a new one.</p>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: CustomField.tsx]---
Location: payload-main/test/lexical/components/CustomField.tsx
Signals: React

```typescript
'use client'

import type { TextFieldClientComponent } from 'payload'

import React from 'react'

export const CustomField: TextFieldClientComponent = ({ schemaPath }) => {
  return <div id="custom-field-schema-path">{schemaPath}</div>
}
```

--------------------------------------------------------------------------------

---[FILE: Image.tsx]---
Location: payload-main/test/lexical/components/Image.tsx
Signals: React

```typescript
import type { AdminViewServerProps } from 'payload'

import React from 'react'

export const Image: React.FC<AdminViewServerProps> = async ({ payload }) => {
  const images = await payload.find({
    collection: 'uploads',
    limit: 1,
  })

  if (!images?.docs?.length) {
    return null
  }

  return (
    <div>
      <h2>This is an image:</h2>
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <img src={images?.docs?.[0]?.url as string} />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: TabsWithRichText.ts]---
Location: payload-main/test/lexical/globals/TabsWithRichText.ts

```typescript
/**
 * IMPORTANT: Do not change this style. This specific configuration is needed to reproduce this issue before it was fixed (https://github.com/payloadcms/payload/issues/4282):
 * - lexicalEditor initialized on the outside and then shared between two richText fields
 * - tabs field with two tabs, each with a richText field
 * - each tab has a different label in each language. Needs to be a LOCALIZED label, not a single label for all languages. Only then can it be reproduced
 */

import type { GlobalConfig } from 'payload'

import { lexicalEditor } from '@payloadcms/richtext-lexical'

const initializedEditor = lexicalEditor()

const TabsWithRichText: GlobalConfig = {
  slug: 'tabsWithRichText',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'tab1',
          label: {
            en: 'en tab1',
            es: 'es tab1',
          },
          fields: [
            {
              name: 'rt1',
              type: 'richText',
              editor: initializedEditor,
            },
          ],
        },
        {
          name: 'tab2',
          label: {
            en: 'en tab2',
            es: 'es tab2',
          },
          fields: [
            {
              name: 'rt2',
              type: 'richText',
              editor: initializedEditor,
            },
          ],
        },
      ],
    },
  ],
}

export default TabsWithRichText
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/test/lexical-mdx/.gitignore

```text
/media
/media-gif
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: payload-main/test/lexical-mdx/config.ts

```typescript
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import * as fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'path'

import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import { devUser } from '../credentials.js'
import { MediaCollection } from './collections/Media/index.js'
import { PostsCollection } from './collections/Posts/index.js'
import { docsBasePath } from './collections/Posts/shared.js'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfigWithDefaults({
  // ...extend config here
  collections: [
    PostsCollection,
    {
      slug: 'simple',
      fields: [
        {
          name: 'text',
          type: 'text',
        },
      ],
    },
    MediaCollection,
  ],
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  editor: lexicalEditor({}),
  cors: ['http://localhost:3000', 'http://localhost:3001'],
  globals: [],
  onInit: async (payload) => {
    await payload.create({
      collection: 'users',
      data: {
        email: devUser.email,
        password: devUser.password,
      },
    })

    await payload.delete({
      collection: 'posts',
      where: {},
    })

    // Recursively collect all paths to .mdx files RELATIVE to basePath
    const walkSync = (dir: string, filelist: string[] = []) => {
      fs.readdirSync(dir).forEach((file) => {
        filelist = fs.statSync(path.join(dir, file)).isDirectory()
          ? walkSync(path.join(dir, file), filelist)
          : filelist.concat(path.join(dir, file))
      })
      return filelist
    }

    const mdxFiles = walkSync(docsBasePath)
      .filter((file) => file.endsWith('.mdx'))
      .map((file) => file.replace(docsBasePath, ''))

    for (const file of mdxFiles) {
      await payload.create({
        collection: 'posts',
        depth: 0,
        context: {
          seed: true,
        },
        data: {
          docPath: file,
        },
      })
    }
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
```

--------------------------------------------------------------------------------

---[FILE: int.spec.ts]---
Location: payload-main/test/lexical-mdx/int.spec.ts

```typescript
/* eslint jest/no-conditional-in-test: 0 */
import type {
  BlockFields,
  LexicalRichTextAdapter,
  SanitizedServerEditorConfig,
  SerializedBlockNode,
} from '@payloadcms/richtext-lexical'
import type { RichTextField, SanitizedConfig } from 'payload'
import type { MarkOptional } from 'ts-essentials'

import path from 'path'
import { fileURLToPath } from 'url'

import { initPayloadInt } from '../helpers/initPayloadInt.js'
import { postsSlug } from './collections/Posts/index.js'
import { editorJSONToMDX, mdxToEditorJSON } from './mdx/hooks.js'
import { restExamplesTest1 } from './tests/restExamples.test.js'
import { restExamplesTest2 } from './tests/restExamples2.test.js'

import { defaultTests } from './tests/default.test.js'
import { writeFileSync } from 'fs'
import { codeTest1 } from './tests/code1.test.js'

let config: SanitizedConfig
let editorConfig: SanitizedServerEditorConfig

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export type Test = {
  blockNode?: {
    fields: Omit<BlockFields, 'id'>
  } & Omit<
    MarkOptional<SerializedBlockNode, 'children' | 'fields' | 'format' | 'type' | 'version'>,
    'fields'
  >
  debugFlag?: boolean
  description?: string
  ignoreSpacesAndNewlines?: boolean
  input: string
  inputAfterConvertFromEditorJSON?: string
  rootChildren?: any[]
  convertToEditorJSON?: boolean
  convertFromEditorJSON?: boolean
}
type Tests = Array<Test>

describe('Lexical MDX', () => {
  // --__--__--__--__--__--__--__--__--__
  // Boilerplate test setup/teardown
  // --__--__--__--__--__--__--__--__--__
  beforeAll(async () => {
    const { config: incomingConfig } = await initPayloadInt(dirname, undefined, false)
    config = incomingConfig

    const richTextField: RichTextField = config.collections
      .find((collection) => collection.slug === postsSlug)
      .fields.find(
        (field) => 'name' in field && field.name === 'richText',
      ) as unknown as RichTextField

    editorConfig = (richTextField.editor as LexicalRichTextAdapter).editorConfig
  })

  const INPUT_AND_OUTPUTBase: Tests = [
    ...defaultTests,
    restExamplesTest1,
    restExamplesTest2,
    codeTest1,
  ]

  const INPUT_AND_OUTPUT: Tests = INPUT_AND_OUTPUTBase.find((test) => test.debugFlag)
    ? [INPUT_AND_OUTPUTBase.find((test) => test.debugFlag)]
    : INPUT_AND_OUTPUTBase

  for (const {
    input,
    inputAfterConvertFromEditorJSON,
    blockNode,
    ignoreSpacesAndNewlines,
    rootChildren,
    debugFlag,
    description,
    convertFromEditorJSON,
    convertToEditorJSON,
  } of INPUT_AND_OUTPUT) {
    let sanitizedInput = input
    // Remove beginning and end newline of input if exists (since the input is a template string)
    if (sanitizedInput.startsWith('\n')) {
      sanitizedInput = sanitizedInput.slice(1)
    }
    if (sanitizedInput.endsWith('\n')) {
      sanitizedInput = sanitizedInput.slice(0, -1)
    }

    let sanitizedInputAfterConvertFromEditorJSON = inputAfterConvertFromEditorJSON
    if (sanitizedInputAfterConvertFromEditorJSON) {
      if (sanitizedInputAfterConvertFromEditorJSON.startsWith('\n')) {
        sanitizedInputAfterConvertFromEditorJSON = sanitizedInputAfterConvertFromEditorJSON.slice(1)
      }
      if (sanitizedInputAfterConvertFromEditorJSON.endsWith('\n')) {
        sanitizedInputAfterConvertFromEditorJSON = sanitizedInputAfterConvertFromEditorJSON.slice(
          0,
          -1,
        )
      }
    }

    if (convertToEditorJSON !== false) {
      it(`can convert to editor JSON: ${description ?? sanitizedInput}"`, () => {
        const result = mdxToEditorJSON({
          mdxWithFrontmatter: sanitizedInput,
          editorConfig,
        })

        if (debugFlag) {
          writeFileSync(path.resolve(dirname, 'result.json'), JSON.stringify(result, null, 2))
        }

        if (blockNode) {
          const receivedBlockNode: SerializedBlockNode = result.editorState.root
            .children[0] as unknown as SerializedBlockNode
          expect(receivedBlockNode).not.toBeNull()

          // By doing it like this, the blockNode defined in the test does not need to have all the top-level properties. We only wanna compare keys that are defined in the test
          const receivedBlockNodeToTest = {}
          for (const key in blockNode) {
            receivedBlockNodeToTest[key] = receivedBlockNode[key]
          }

          removeUndefinedAndIDRecursively(receivedBlockNodeToTest)
          removeUndefinedAndIDRecursively(blockNode)

          expect(receivedBlockNodeToTest).toStrictEqual(blockNode)
        } else if (rootChildren) {
          const receivedRootChildren = result.editorState.root.children
          removeUndefinedAndIDRecursively(receivedRootChildren)
          removeUndefinedAndIDRecursively(rootChildren)

          expect(receivedRootChildren).toStrictEqual(rootChildren)
        } else {
          throw new Error('Test not configured properly')
        }
      })
    }

    if (convertFromEditorJSON !== false) {
      it(`can convert from editor JSON: ${description ?? sanitizedInput}"`, () => {
        const editorState = {
          root: {
            children: blockNode
              ? [
                  {
                    format: '',
                    type: 'block',
                    version: 2,
                    ...blockNode,
                  },
                ]
              : rootChildren,
            format: '',
            indent: 0,
            type: 'root',
            version: 1,
          },
        }
        const result = editorJSONToMDX({
          editorConfig,
          editorState,
        })
        // Remove all spaces and newlines
        const resultNoSpace = ignoreSpacesAndNewlines ? result.replace(/\s/g, '') : result
        const inputNoSpace = ignoreSpacesAndNewlines
          ? (sanitizedInputAfterConvertFromEditorJSON ?? sanitizedInput).replace(/\s/g, '')
          : (sanitizedInputAfterConvertFromEditorJSON ?? sanitizedInput)

        expect(resultNoSpace).toBe(inputNoSpace)
      })
    }
  }
})

function removeUndefinedAndIDRecursively(obj: object) {
  for (const key in obj) {
    const value = obj[key]
    if (value && typeof value === 'object') {
      removeUndefinedAndIDRecursively(value)
    } else if (value === undefined) {
      delete obj[key]
    } else if (value === null) {
      delete obj[key]
    } else if (key === 'id') {
      delete obj[key]
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: payload-types.ts]---
Location: payload-main/test/lexical-mdx/payload-types.ts

```typescript
/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

/**
 * Supported timezones in IANA format.
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "supportedTimezones".
 */
export type SupportedTimezones =
  | 'Pacific/Midway'
  | 'Pacific/Niue'
  | 'Pacific/Honolulu'
  | 'Pacific/Rarotonga'
  | 'America/Anchorage'
  | 'Pacific/Gambier'
  | 'America/Los_Angeles'
  | 'America/Tijuana'
  | 'America/Denver'
  | 'America/Phoenix'
  | 'America/Chicago'
  | 'America/Guatemala'
  | 'America/New_York'
  | 'America/Bogota'
  | 'America/Caracas'
  | 'America/Santiago'
  | 'America/Buenos_Aires'
  | 'America/Sao_Paulo'
  | 'Atlantic/South_Georgia'
  | 'Atlantic/Azores'
  | 'Atlantic/Cape_Verde'
  | 'Europe/London'
  | 'Europe/Berlin'
  | 'Africa/Lagos'
  | 'Europe/Athens'
  | 'Africa/Cairo'
  | 'Europe/Moscow'
  | 'Asia/Riyadh'
  | 'Asia/Dubai'
  | 'Asia/Baku'
  | 'Asia/Karachi'
  | 'Asia/Tashkent'
  | 'Asia/Calcutta'
  | 'Asia/Dhaka'
  | 'Asia/Almaty'
  | 'Asia/Jakarta'
  | 'Asia/Bangkok'
  | 'Asia/Shanghai'
  | 'Asia/Singapore'
  | 'Asia/Tokyo'
  | 'Asia/Seoul'
  | 'Australia/Brisbane'
  | 'Australia/Sydney'
  | 'Pacific/Guam'
  | 'Pacific/Noumea'
  | 'Pacific/Auckland'
  | 'Pacific/Fiji';

export interface Config {
  auth: {
    users: UserAuthOperations;
  };
  blocks: {};
  collections: {
    posts: Post;
    simple: Simple;
    media: Media;
    users: User;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  collectionsJoins: {};
  collectionsSelect: {
    posts: PostsSelect<false> | PostsSelect<true>;
    simple: SimpleSelect<false> | SimpleSelect<true>;
    media: MediaSelect<false> | MediaSelect<true>;
    users: UsersSelect<false> | UsersSelect<true>;
    'payload-locked-documents': PayloadLockedDocumentsSelect<false> | PayloadLockedDocumentsSelect<true>;
    'payload-preferences': PayloadPreferencesSelect<false> | PayloadPreferencesSelect<true>;
    'payload-migrations': PayloadMigrationsSelect<false> | PayloadMigrationsSelect<true>;
  };
  db: {
    defaultIDType: string;
  };
  globals: {};
  globalsSelect: {};
  locale: null;
  user: User & {
    collection: 'users';
  };
  jobs: {
    tasks: unknown;
    workflows: unknown;
  };
}
export interface UserAuthOperations {
  forgotPassword: {
    email: string;
    password: string;
  };
  login: {
    email: string;
    password: string;
  };
  registerFirstUser: {
    email: string;
    password: string;
  };
  unlock: {
    email: string;
    password: string;
  };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "posts".
 */
export interface Post {
  id: string;
  docPath: string;
  frontMatter?:
    | {
        key?: string | null;
        value?: string | null;
        id?: string | null;
      }[]
    | null;
  richText?: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  richTextUnconverted?: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "simple".
 */
export interface Simple {
  id: string;
  text?: string | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media".
 */
export interface Media {
  id: string;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  thumbnailURL?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  focalX?: number | null;
  focalY?: number | null;
  sizes?: {
    thumbnail?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
    medium?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
    large?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
  };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users".
 */
export interface User {
  id: string;
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents".
 */
export interface PayloadLockedDocument {
  id: string;
  document?:
    | ({
        relationTo: 'posts';
        value: string | Post;
      } | null)
    | ({
        relationTo: 'simple';
        value: string | Simple;
      } | null)
    | ({
        relationTo: 'media';
        value: string | Media;
      } | null)
    | ({
        relationTo: 'users';
        value: string | User;
      } | null);
  globalSlug?: string | null;
  user: {
    relationTo: 'users';
    value: string | User;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences".
 */
export interface PayloadPreference {
  id: string;
  user: {
    relationTo: 'users';
    value: string | User;
  };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations".
 */
export interface PayloadMigration {
  id: string;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "posts_select".
 */
export interface PostsSelect<T extends boolean = true> {
  docPath?: T;
  frontMatter?:
    | T
    | {
        key?: T;
        value?: T;
        id?: T;
      };
  richText?: T;
  richTextUnconverted?: T;
  updatedAt?: T;
  createdAt?: T;
  _status?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "simple_select".
 */
export interface SimpleSelect<T extends boolean = true> {
  text?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media_select".
 */
export interface MediaSelect<T extends boolean = true> {
  updatedAt?: T;
  createdAt?: T;
  url?: T;
  thumbnailURL?: T;
  filename?: T;
  mimeType?: T;
  filesize?: T;
  width?: T;
  height?: T;
  focalX?: T;
  focalY?: T;
  sizes?:
    | T
    | {
        thumbnail?:
          | T
          | {
              url?: T;
              width?: T;
              height?: T;
              mimeType?: T;
              filesize?: T;
              filename?: T;
            };
        medium?:
          | T
          | {
              url?: T;
              width?: T;
              height?: T;
              mimeType?: T;
              filesize?: T;
              filename?: T;
            };
        large?:
          | T
          | {
              url?: T;
              width?: T;
              height?: T;
              mimeType?: T;
              filesize?: T;
              filename?: T;
            };
      };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users_select".
 */
export interface UsersSelect<T extends boolean = true> {
  updatedAt?: T;
  createdAt?: T;
  email?: T;
  resetPasswordToken?: T;
  resetPasswordExpiration?: T;
  salt?: T;
  hash?: T;
  loginAttempts?: T;
  lockUntil?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents_select".
 */
export interface PayloadLockedDocumentsSelect<T extends boolean = true> {
  document?: T;
  globalSlug?: T;
  user?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences_select".
 */
export interface PayloadPreferencesSelect<T extends boolean = true> {
  user?: T;
  key?: T;
  value?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations_select".
 */
export interface PayloadMigrationsSelect<T extends boolean = true> {
  name?: T;
  batch?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "RestExamplesBlock".
 */
export interface RestExamplesBlock {
  data?:
    | {
        operation?: string | null;
        method?: string | null;
        path?: string | null;
        description?: string | null;
        example?: {
          slug?: string | null;
          req?:
            | {
                [k: string]: unknown;
              }
            | unknown[]
            | string
            | number
            | boolean
            | null;
          res?:
            | {
                [k: string]: unknown;
              }
            | unknown[]
            | string
            | number
            | boolean
            | null;
          drawerContent?: string | null;
        };
        id?: string | null;
      }[]
    | null;
  id?: string | null;
  blockName?: string | null;
  blockType: 'restExamples';
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "auth".
 */
export interface Auth {
  [k: string]: unknown;
}


declare module 'payload' {
  // @ts-ignore 
  export interface GeneratedTypes extends Config {}
}
```

--------------------------------------------------------------------------------

---[FILE: result.json]---
Location: payload-main/test/lexical-mdx/result.json

```json
{
  "editorState": {
    "root": {
      "children": [
        {
          "format": "",
          "type": "block",
          "version": 2,
          "fields": {
            "blockType": "restExamples",
            "data": [
              {
                "operation": "Find",
                "method": "GET",
                "path": "/api/{collection-slug}",
                "description": "Find paginated documents",
                "example": {
                  "slug": "getCollection",
                  "req": true,
                  "res": {
                    "paginated": true,
                    "data": {
                      "id": "644a5c24cc1383022535fc7c",
                      "title": "Home",
                      "content": "REST API examples",
                      "slug": "home",
                      "createdAt": "2023-04-27T11:27:32.419Z",
                      "updatedAt": "2023-04-27T11:27:32.419Z"
                    }
                  },
                  "drawerContent": "\n#### Heading\n\nOne `two` three\n\n- [sort](/docs/queries/overview#sort) - sort by field\n- [where](/docs/queries/overview) - pass a where query to constrain returned documents\n\n```ts\nconst a = 1\nconst b = 2\nconst c = 3\nconst d = 4\n```\n"
                }
              }
            ],
            "id": "6771f28d009a850b8401645e"
          }
        }
      ],
      "direction": null,
      "format": "",
      "indent": 0,
      "type": "root",
      "version": 1
    }
  },
  "frontMatter": []
}
```

--------------------------------------------------------------------------------

````
