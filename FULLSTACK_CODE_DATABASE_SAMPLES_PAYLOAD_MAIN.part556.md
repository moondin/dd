---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 556
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 556 of 695)

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
Location: payload-main/test/fields/collections/Blocks/index.ts

```typescript
import type { BlocksField, CollectionConfig } from 'payload'

import { slateEditor } from '@payloadcms/richtext-slate'

import { blockFieldsSlug, textFieldsSlug } from '../../slugs.js'
import { getBlocksFieldSeedData } from './shared.js'

export const getBlocksField = (prefix?: string): BlocksField => ({
  name: 'blocks',
  type: 'blocks',
  blocks: [
    {
      slug: prefix ? `${prefix}Content` : 'content',
      imageURL: '/api/uploads/file/payload480x320.jpg',
      interfaceName: prefix ? `${prefix}ContentBlock` : 'ContentBlock',
      admin: {
        components: {
          Label: './collections/Blocks/components/CustomBlockLabel.tsx',
        },
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
        {
          name: 'richText',
          type: 'richText',
          editor: slateEditor({}),
        },
      ],
    },
    {
      slug: prefix ? `${prefix}NoBlockname` : 'noBlockname',
      interfaceName: prefix ? `${prefix}NoBlockname` : 'NoBlockname',
      admin: {
        disableBlockName: true,
      },
      fields: [
        {
          name: 'text',
          type: 'text',
        },
      ],
    },
    {
      slug: prefix ? `${prefix}Number` : 'number',
      interfaceName: prefix ? `${prefix}NumberBlock` : 'NumberBlock',
      fields: [
        {
          name: 'number',
          type: 'number',
          required: true,
        },
      ],
    },
    {
      slug: prefix ? `${prefix}SubBlocks` : 'subBlocks',
      interfaceName: prefix ? `${prefix}SubBlocksBlock` : 'SubBlocksBlock',
      fields: [
        {
          type: 'collapsible',
          fields: [
            {
              name: 'subBlocks',
              type: 'blocks',
              blocks: [
                {
                  slug: 'textRequired',
                  fields: [
                    {
                      name: 'text',
                      type: 'text',
                      required: true,
                    },
                  ],
                },
                {
                  slug: 'number',
                  interfaceName: 'NumberBlock',
                  fields: [
                    {
                      name: 'number',
                      type: 'number',
                      required: true,
                    },
                  ],
                },
              ],
            },
          ],
          label: 'Collapsible within Block',
        },
      ],
    },
    {
      slug: prefix ? `${prefix}Tabs` : 'tabs',
      interfaceName: prefix ? `${prefix}TabsBlock` : 'TabsBlock',
      fields: [
        {
          type: 'tabs',
          tabs: [
            {
              fields: [
                {
                  type: 'collapsible',
                  fields: [
                    {
                      // collapsible
                      name: 'textInCollapsible',
                      type: 'text',
                    },
                  ],
                  label: 'Collapsible within Block',
                },
                {
                  type: 'row',
                  fields: [
                    {
                      // collapsible
                      name: 'textInRow',
                      type: 'text',
                    },
                  ],
                },
              ],
              label: 'Tab with Collapsible',
            },
          ],
        },
      ],
    },
  ],
  defaultValue: getBlocksFieldSeedData(prefix),
  required: true,
})

export const BlockFields: CollectionConfig = {
  slug: blockFieldsSlug,
  fields: [
    getBlocksField(),
    {
      ...getBlocksField(),
      name: 'duplicate',
    },
    {
      ...getBlocksField('localized'),
      name: 'collapsedByDefaultBlocks',
      admin: {
        initCollapsed: true,
      },
      localized: true,
    },
    {
      ...getBlocksField('localized'),
      name: 'disableSort',
      admin: {
        isSortable: false,
      },
      localized: true,
    },
    {
      ...getBlocksField('localized'),
      name: 'localizedBlocks',
      localized: true,
    },
    {
      name: 'i18nBlocks',
      type: 'blocks',
      blocks: [
        {
          slug: 'textInI18nBlock',
          fields: [
            {
              name: 'text',
              type: 'text',
            },
          ],
          graphQL: {
            singularName: 'I18nText',
          },
          labels: {
            plural: {
              en: 'Texts en',
              es: 'Texts es',
            },
            singular: {
              en: 'Text en',
              es: 'Text es',
            },
          },
        },
      ],
      label: {
        en: 'Block en',
        es: 'Block es',
      },
      labels: {
        plural: {
          en: 'Blocks en',
          es: 'Blocks es',
        },
        singular: {
          en: 'Block en',
          es: 'Block es',
        },
      },
    },
    {
      name: 'blocksWithLocalizedArray',
      type: 'blocks',
      blocks: [
        {
          slug: 'localizedArray',
          fields: [
            {
              name: 'array',
              type: 'array',
              localized: true,
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
    },
    {
      name: 'blocksWithSimilarConfigs',
      type: 'blocks',
      blocks: [
        {
          slug: 'block-a',
          fields: [
            {
              name: 'items',
              type: 'array',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          slug: 'block-b',
          fields: [
            {
              name: 'items',
              type: 'array',
              fields: [
                {
                  name: 'title2',
                  type: 'text',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          slug: 'group-block',
          fields: [
            {
              name: 'group',
              type: 'group',
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
    },
    {
      name: 'blocksWithSimilarGroup',
      type: 'blocks',
      admin: {
        description:
          'The purpose of this field is to test validateExistingBlockIsIdentical works with similar blocks with group fields',
      },
      blocks: [
        {
          slug: 'group-block',
          fields: [
            {
              name: 'group',
              type: 'group',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                },
              ],
            },
          ],
        },
        {
          slug: 'block-b',
          fields: [
            {
              name: 'items',
              type: 'array',
              fields: [
                {
                  name: 'title2',
                  type: 'text',
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'blocksWithMinRows',
      type: 'blocks',
      blocks: [
        {
          slug: 'blockWithMinRows',
          fields: [
            {
              name: 'blockTitle',
              type: 'text',
            },
          ],
        },
      ],
      minRows: 2,
    },
    {
      name: 'customBlocks',
      type: 'blocks',
      blocks: [
        {
          slug: 'block-1',
          fields: [
            {
              name: 'block1Title',
              type: 'text',
            },
          ],
        },
        {
          slug: 'block-2',
          fields: [
            {
              name: 'block2Title',
              type: 'text',
            },
          ],
        },
      ],
    },
    {
      name: 'ui',
      type: 'ui',
      admin: {
        components: {
          Field: '/collections/Blocks/components/AddCustomBlocks/index.js#AddCustomBlocks',
        },
      },
    },
    {
      name: 'relationshipBlocks',
      type: 'blocks',
      blocks: [
        {
          slug: 'relationships',
          fields: [
            {
              name: 'relationship',
              type: 'relationship',
              relationTo: textFieldsSlug,
            },
          ],
        },
      ],
    },
    {
      name: 'blockWithLabels',
      type: 'blocks',
      labels: {
        singular: ({ t }) => t('authentication:account'),
        plural: ({ t }) => t('authentication:generate'),
      },
      blocks: [
        {
          labels: {
            singular: ({ t }) => t('authentication:account'),
            plural: ({ t }) => t('authentication:generate'),
          },
          slug: 'text',
          fields: [
            {
              name: 'text',
              type: 'text',
            },
          ],
        },
      ],
    },
    {
      name: 'deduplicatedBlocks',
      type: 'blocks',
      blockReferences: ['ConfigBlockTest'],
      blocks: [],
    },
    {
      name: 'deduplicatedBlocks2',
      type: 'blocks',
      blockReferences: ['ConfigBlockTest'],
      blocks: [],
    },
    {
      name: 'localizedReferencesLocalizedBlock',
      type: 'blocks',
      blockReferences: ['localizedTextReference'],
      blocks: [],
      localized: true,
    },
    {
      name: 'localizedReferences',
      type: 'blocks',
      // Needs to be a separate block - otherwise this will break in postgres. This is unrelated to block references
      // and an issue with all blocks.
      blockReferences: ['localizedTextReference2'],
      blocks: [],
    },
    {
      name: 'groupedBlocks',
      type: 'blocks',
      admin: {
        description: 'The purpose of this field is to test Block groups.',
      },
      blocks: [
        {
          slug: 'blockWithGroupOne',
          admin: {
            group: 'Group',
          },
          fields: [
            {
              name: 'text',
              type: 'text',
            },
          ],
        },
        {
          slug: 'blockWithGroupTwo',
          admin: {
            group: 'Group',
          },
          fields: [
            {
              name: 'text',
              type: 'text',
            },
          ],
        },
        {
          slug: 'blockWithLocalizedGroup',
          admin: {
            group: {
              en: 'Group in en',
              es: 'Group in es',
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
          slug: 'blockWithoutGroup',
          fields: [
            {
              name: 'text',
              type: 'text',
            },
          ],
        },
      ],
    },
    {
      name: 'readOnly',
      type: 'blocks',
      admin: {
        readOnly: true,
      },
      defaultValue: [
        {
          blockType: 'readOnlyBlock',
          title: 'readOnly',
        },
      ],
      blocks: [
        {
          slug: 'readOnlyBlock',
          fields: [
            {
              type: 'text',
              name: 'title',
              defaultValue: 'readOnly',
            },
          ],
        },
      ],
    },
    {
      name: 'enabledBlocks',
      type: 'text',
      admin: {
        description:
          "Change the value of this field to change the enabled blocks of the blocksWithDynamicFilterOptions field. If it's empty, all blocks are enabled.",
      },
    },
    {
      name: 'blocksWithDynamicFilterOptions',
      type: 'blocks',
      filterOptions: ({ siblingData: _siblingData, data }) => {
        const siblingData = _siblingData as { enabledBlocks: string }

        if (siblingData?.enabledBlocks !== data?.enabledBlocks) {
          // Just an extra assurance that the field is working as intended
          throw new Error('enabledBlocks and siblingData.enabledBlocks must be identical')
        }
        return siblingData?.enabledBlocks?.length ? [siblingData.enabledBlocks] : true
      },
      blocks: [
        {
          slug: 'blockOne',
          fields: [
            {
              type: 'text',
              name: 'block1Text',
              validate: (value: any) => {
                if (value === 'error') {
                  return 'error'
                }
                return true
              },
            },
          ],
        },
        {
          slug: 'blockTwo',
          fields: [
            {
              type: 'text',
              name: 'block2Text',
            },
          ],
        },
        {
          slug: 'blockThree',
          fields: [
            {
              type: 'text',
              name: 'block3Text',
            },
          ],
        },
      ],
    },
    {
      name: 'blocksWithFilterOptions',
      type: 'blocks',
      filterOptions: ['blockFour', 'blockFive'],
      blocks: [
        {
          slug: 'blockFour',
          fields: [
            {
              type: 'text',
              name: 'block1Text',
            },
          ],
        },
        {
          slug: 'blockFive',
          fields: [
            {
              type: 'text',
              name: 'block2Text',
            },
          ],
        },
        {
          slug: 'blockSix',
          fields: [
            {
              type: 'text',
              name: 'block3Text',
            },
          ],
        },
      ],
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: shared.ts]---
Location: payload-main/test/fields/collections/Blocks/shared.ts

```typescript
import type { BlockField } from '../../payload-types.js'

export const getBlocksFieldSeedData = (prefix?: string): any => [
  {
    blockName: 'First block',
    blockType: prefix ? `${prefix}Content` : 'content',
    text: 'first block',
    richText: [
      {
        children: [{ text: '' }],
      },
    ],
  },
  {
    blockName: 'Second block',
    blockType: prefix ? `${prefix}Number` : 'number',
    number: 342,
  },
  {
    blockName: 'Sub-block demonstration',
    blockType: prefix ? `${prefix}SubBlocks` : 'subBlocks',
    subBlocks: [
      {
        blockName: 'First sub block',
        blockType: 'number',
        number: 123,
      },
      {
        blockName: 'Second sub block',
        blockType: 'textRequired',
        text: 'second sub block',
      },
    ],
  },
  {
    blockType: prefix ? `${prefix}NoBlockname` : 'noBlockname',
    text: 'Hello world',
  },
]

export const blocksDoc: Partial<BlockField> = {
  blocks: getBlocksFieldSeedData(),
  localizedBlocks: getBlocksFieldSeedData('localized'),
  blocksWithMinRows: [
    {
      blockTitle: 'first row',
      blockType: 'blockWithMinRows',
    },
    {
      blockTitle: 'second row',
      blockType: 'blockWithMinRows',
    },
  ],
  localizedReferencesLocalizedBlock: [
    {
      blockType: 'localizedTextReference',
      text: 'localized text',
    },
  ],
  localizedReferences: [
    {
      blockType: 'localizedTextReference2',
      text: 'localized text',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: CustomBlockLabel.tsx]---
Location: payload-main/test/fields/collections/Blocks/components/CustomBlockLabel.tsx

```typescript
import type { BlockRowLabelServerComponent } from 'payload'

const CustomBlockLabel: BlockRowLabelServerComponent = ({ rowLabel }) => {
  return <div>{`Custom Block Label: ${rowLabel}`}</div>
}

export default CustomBlockLabel
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/test/fields/collections/Blocks/components/AddCustomBlocks/index.scss

```text
.custom-blocks-field-management {
  display: flex;
  gap: var(--base);
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/fields/collections/Blocks/components/AddCustomBlocks/index.tsx
Signals: React

```typescript
'use client'

import { Button, useField, useForm } from '@payloadcms/ui'
import * as React from 'react'

import './index.scss'

const baseClass = 'custom-blocks-field-management'

const blocksPath = 'customBlocks'

export const AddCustomBlocks: React.FC<any> = (props) => {
  const { addFieldRow, initializing, replaceFieldRow } = useForm()
  const field = useField<number>({ path: blocksPath })
  const { value } = field

  const schemaPath = props.schemaPath.replace(`.${props.field.name}`, `.${blocksPath}`)

  return (
    <div className={baseClass}>
      <Button
        disabled={initializing}
        onClick={() => {
          addFieldRow({
            blockType: 'block-1',
            path: blocksPath,
            schemaPath,
            subFieldState: {
              block1Title: {
                initialValue: 'Block 1: Prefilled Title',
                valid: true,
                value: 'Block 1: Prefilled Title',
              },
            },
          })
        }}
        type="button"
      >
        Add Block 1
      </Button>
      <Button
        disabled={initializing}
        onClick={() => {
          addFieldRow({
            blockType: 'block-2',
            path: blocksPath,
            schemaPath,
            subFieldState: {
              block2Title: {
                initialValue: 'Block 2: Prefilled Title',
                valid: true,
                value: 'Block 2: Prefilled Title',
              },
            },
          })
        }}
        type="button"
      >
        Add Block 2
      </Button>
      <Button
        disabled={initializing}
        onClick={() =>
          replaceFieldRow({
            blockType: 'block-1',
            path: blocksPath,
            rowIndex: value,
            schemaPath,
            subFieldState: {
              block1Title: {
                initialValue: 'REPLACED BLOCK',
                valid: true,
                value: 'REPLACED BLOCK',
              },
            },
          })
        }
        type="button"
      >
        Replace Block {value}
      </Button>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: e2e.spec.ts]---
Location: payload-main/test/fields/collections/Checkbox/e2e.spec.ts

```typescript
import type { Page } from '@playwright/test'

import { expect, test } from '@playwright/test'
import { checkFocusIndicators } from 'helpers/e2e/checkFocusIndicators.js'
import { addListFilter } from 'helpers/e2e/filters/index.js'
import { runAxeScan } from 'helpers/e2e/runAxeScan.js'
import path from 'path'
import { fileURLToPath } from 'url'

import { ensureCompilationIsDone, initPageConsoleErrorCatch } from '../../../helpers.js'
import { AdminUrlUtil } from '../../../helpers/adminUrlUtil.js'
import { initPayloadE2ENoConfig } from '../../../helpers/initPayloadE2ENoConfig.js'
import { reInitializeDB } from '../../../helpers/reInitializeDB.js'
import { RESTClient } from '../../../helpers/rest.js'
import { TEST_TIMEOUT_LONG } from '../../../playwright.config.js'
import { checkboxFieldsSlug } from '../../slugs.js'

const filename = fileURLToPath(import.meta.url)
const currentFolder = path.dirname(filename)
const dirname = path.resolve(currentFolder, '../../')

const { beforeAll, beforeEach, describe } = test

let client: RESTClient
let page: Page
let serverURL: string
let url: AdminUrlUtil

describe('Checkboxes', () => {
  beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)
    process.env.SEED_IN_CONFIG_ONINIT = 'false' // Makes it so the payload config onInit seed is not run. Otherwise, the seed would be run unnecessarily twice for the initial test run - once for beforeEach and once for onInit
    ;({ serverURL } = await initPayloadE2ENoConfig({
      dirname,
      // prebuild,
    }))

    url = new AdminUrlUtil(serverURL, checkboxFieldsSlug)

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

  test('should not crash on filtering where checkbox is first field', async () => {
    await page.goto(url.list)

    await addListFilter({
      page,
      fieldLabel: 'Checkbox',
      operatorLabel: 'equals',
      value: 'True',
    })

    await expect(page.locator('table > tbody > tr')).toHaveCount(1)
  })

  describe('A11y', () => {
    test('Edit view should have no accessibility violations', async ({}, testInfo) => {
      await page.goto(url.create)
      await page.locator('#field-checkbox').waitFor()

      const scanResults = await runAxeScan({
        page,
        testInfo,
        include: ['.document-fields__main'],
      })

      expect(scanResults.violations.length).toBe(0)
    })

    test('Checkbox inputs have focus indicators', async ({}, testInfo) => {
      await page.goto(url.create)
      await page.locator('#field-checkbox').waitFor()

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
Location: payload-main/test/fields/collections/Checkbox/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { checkboxFieldsSlug } from '../../slugs.js'

const CheckboxFields: CollectionConfig = {
  slug: checkboxFieldsSlug,
  fields: [
    {
      name: 'checkbox',
      type: 'checkbox',
      required: true,
    },
    {
      name: 'checkboxNotRequired',
      type: 'checkbox',
    },
  ],
}

export default CheckboxFields
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/fields/collections/Code/index.tsx

```typescript
import type { CollectionConfig } from 'payload'

import { codeFieldsSlug } from '../../slugs.js'

const Code: CollectionConfig = {
  slug: codeFieldsSlug,
  fields: [
    {
      name: 'javascript',
      type: 'code',
      admin: {
        language: 'javascript',
      },
    },
    {
      name: 'typescript',
      type: 'code',
      admin: {
        language: 'typescript',
      },
    },
    {
      name: 'json',
      type: 'code',
      admin: {
        language: 'json',
      },
    },
    {
      name: 'html',
      type: 'code',
      admin: {
        language: 'html',
      },
    },
    {
      name: 'css',
      type: 'code',
      admin: {
        language: 'css',
      },
    },
    {
      name: 'codeWithPadding',
      type: 'code',
      admin: {
        editorOptions: { padding: { bottom: 25, top: 25 } },
      },
    },
  ],
}

export default Code
```

--------------------------------------------------------------------------------

---[FILE: shared.ts]---
Location: payload-main/test/fields/collections/Code/shared.ts

```typescript
import type { CodeField } from '../../payload-types.js'

export const codeDoc: Partial<CodeField> = {
  css: `@import url(https://fonts.googleapis.com/css?family=Questrial);
@import url(https://fonts.googleapis.com/css?family=Arvo);

@font-face {
  src: url(https://lea.verou.me/logo.otf);
  font-family: 'LeaVerou';
}

/*
 Shared styles
 */

section h1,
#features li strong,
header h2,
footer p {
  font: 100% Rockwell, Arvo, serif;
}

/*
 Styles
 */

* {
  margin: 0;
  padding: 0;
}

body {
  font: 100%/1.5 Questrial, sans-serif;
  tab-size: 4;
  hyphens: auto;
}

a {
  color: inherit;
}

section h1 {
  font-size: 250%;
}`,
  html: `<!DOCTYPE html>
<html lang="en">
<head>

<script>
  // Just a lil’ script to show off that inline JS gets highlighted
  window.console && console.log('foo');
</script>
<meta charset="utf-8" />
<link rel="icon" href="assets/favicon.png" />
<title>Prism</title>
<link rel="stylesheet" href="assets/style.css" />
<link rel="stylesheet" href="themes/prism.css" data-noprefix />
<script src="assets/vendor/prefixfree.min.js"></script>

<script>var _gaq = [['_setAccount', 'UA-11111111-1'], ['_trackPageview']];</script>
<script src="https://www.google-analytics.com/ga.js" async></script>
</head>
<body>`,

  javascript: "console.log('Hello');",

  json: JSON.stringify({ arr: ['val1', 'val2', 'val3'], property: 'value' }, null, 2),

  typescript: `class Greeter {
  greeting: string;

  constructor(message: string) {
    this.greeting = message;
  }

  greet() {
    return "Hello, " + this.greeting;
  }
}

let greeter = new Greeter("world");`,
}
```

--------------------------------------------------------------------------------

---[FILE: e2e.spec.ts]---
Location: payload-main/test/fields/collections/Collapsible/e2e.spec.ts

```typescript
import type { Page } from '@playwright/test'

import { expect, test } from '@playwright/test'
import { checkFocusIndicators } from 'helpers/e2e/checkFocusIndicators.js'
import { addArrayRow } from 'helpers/e2e/fields/array/index.js'
import { runAxeScan } from 'helpers/e2e/runAxeScan.js'
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
import { collapsibleFieldsSlug } from '../../slugs.js'

const filename = fileURLToPath(import.meta.url)
const currentFolder = path.dirname(filename)
const dirname = path.resolve(currentFolder, '../../')

const { beforeAll, beforeEach, describe } = test

let payload: PayloadTestSDK<Config>
let client: RESTClient
let page: Page
let serverURL: string
let url: AdminUrlUtil

describe('Collapsibles', () => {
  beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)
    process.env.SEED_IN_CONFIG_ONINIT = 'false' // Makes it so the payload config onInit seed is not run. Otherwise, the seed would be run unnecessarily twice for the initial test run - once for beforeEach and once for onInit
    ;({ payload, serverURL } = await initPayloadE2ENoConfig<Config>({
      dirname,
      // prebuild,
    }))

    url = new AdminUrlUtil(serverURL, collapsibleFieldsSlug)

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

  test('should render collapsible as collapsed if initCollapsed is true', async () => {
    await page.goto(url.create)
    const collapsedCollapsible = page.locator(
      '#field-collapsible-_index-1 .collapsible__toggle--collapsed',
    )
    await expect(collapsedCollapsible).toBeVisible()
  })

  test('should render CollapsibleLabel using a function', async () => {
    const label = 'custom row label'
    await page.goto(url.create)
    await page.locator('#field-collapsible-_index-3-1 #field-nestedTitle').fill(label)
    await wait(100)
    const customCollapsibleLabel = page.locator(
      `#field-collapsible-_index-3-1 .collapsible-field__row-label-wrap :text("${label}")`,
    )
    await expect(customCollapsibleLabel).toContainText(label)
  })

  test('should render CollapsibleLabel using a component', async () => {
    const label = 'custom row label as component'
    await page.goto(url.create)
    await page.locator('#field-arrayWithCollapsibles').scrollIntoViewIfNeeded()

    const arrayWithCollapsibles = page.locator('#field-arrayWithCollapsibles')
    await expect(arrayWithCollapsibles).toBeVisible()

    await addArrayRow(page, { fieldName: 'arrayWithCollapsibles' })

    const innerTextField = page.locator(
      '#arrayWithCollapsibles-row-0 #field-collapsible-arrayWithCollapsibles__0___index-0 #field-arrayWithCollapsibles__0__innerCollapsible',
    )
    await expect(innerTextField).toBeVisible()
    await innerTextField.fill(label)

    const customCollapsibleLabel = page.locator(
      `#field-arrayWithCollapsibles >> #arrayWithCollapsibles-row-0 >> .collapsible-field__row-label-wrap :text("${label}")`,
    )

    await expect(customCollapsibleLabel).toBeVisible()
    await expect(customCollapsibleLabel).toHaveCSS('text-transform', 'uppercase')
  })

  describe('A11y', () => {
    test.fixme('Edit view should have no accessibility violations', async ({}, testInfo) => {
      await page.goto(url.create)
      await page.locator('#field-text').waitFor()

      const scanResults = await runAxeScan({
        page,
        testInfo,
        include: ['.collection-edit__main'],
        exclude: ['.field-description'], // known issue - reported elsewhere @todo: remove this once fixed - see report https://github.com/payloadcms/payload/discussions/14489
      })

      expect(scanResults.violations.length).toBe(0)
    })

    test('Collapsible fields have focus indicators', async ({}, testInfo) => {
      await page.goto(url.create)
      await page.locator('#field-text').waitFor()

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
Location: payload-main/test/fields/collections/Collapsible/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { collapsibleFieldsSlug } from '../../slugs.js'
import { getCustomLabel } from './CustomLabel/getCustomLabel.js'

const CollapsibleFields: CollectionConfig = {
  slug: collapsibleFieldsSlug,
  versions: true,
  fields: [
    {
      label: 'Collapsible Field',
      type: 'collapsible',
      admin: {
        description: 'This is a collapsible field.',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
        {
          name: 'group',
          type: 'group',
          fields: [
            {
              name: 'textWithinGroup',
              type: 'text',
            },
            {
              name: 'subGroup',
              type: 'group',
              fields: [
                {
                  name: 'textWithinSubGroup',
                  type: 'text',
                },
                {
                  name: 'requiredTextWithinSubGroup',
                  type: 'text',
                  required: true,
                  defaultValue: 'required text',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      label: 'Collapsible Field - Collapsed by Default',
      type: 'collapsible',
      admin: {
        description: 'This is a collapsible field.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'someText',
          type: 'text',
        },
        {
          name: 'group2',
          type: 'group',
          fields: [
            {
              name: 'textWithinGroup',
              type: 'text',
            },
            {
              name: 'subGroup',
              type: 'group',
              fields: [
                {
                  name: 'textWithinSubGroup',
                  type: 'text',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      admin: {
        description: 'Collapsible label rendered from a function.',
        initCollapsed: true,
        components: {
          Label: getCustomLabel({
            path: 'functionTitleField',
            fallback: 'Custom Collapsible Label',
            style: {},
          }),
        },
      },
      fields: [
        {
          name: 'functionTitleField',
          type: 'text',
        },
      ],
    },
    {
      type: 'collapsible',
      admin: {
        description: 'Collapsible label rendered as a react component.',
        components: {
          Label: getCustomLabel({ path: 'componentTitleField', style: {} }),
        },
      },
      fields: [
        {
          name: 'componentTitleField',
          type: 'text',
        },
        {
          type: 'collapsible',
          admin: {
            components: {
              Label: getCustomLabel({
                path: 'nestedTitle',
                fallback: 'Nested Collapsible',
                style: {},
              }),
            },
          },
          fields: [
            {
              type: 'text',
              name: 'nestedTitle',
            },
          ],
        },
      ],
    },
    {
      name: 'arrayWithCollapsibles',
      type: 'array',
      fields: [
        {
          type: 'collapsible',
          admin: {
            components: {
              Label: '/collections/Collapsible/NestedCustomLabel/index.js#NestedCustomLabel',
            },
          },
          fields: [
            {
              name: 'innerCollapsible',
              type: 'text',
            },
          ],
        },
      ],
    },
  ],
}

export default CollapsibleFields
```

--------------------------------------------------------------------------------

---[FILE: shared.ts]---
Location: payload-main/test/fields/collections/Collapsible/shared.ts

```typescript
import type { RequiredDataFromCollection } from 'payload/types'

import type { CollapsibleField } from '../../payload-types.js'

export const collapsibleDoc: RequiredDataFromCollection<CollapsibleField> = {
  text: 'Seeded collapsible doc',
  group: {
    textWithinGroup: 'some text within a group',
    subGroup: {
      textWithinSubGroup: 'hello, get out',
    },
  },
  arrayWithCollapsibles: [
    {
      innerCollapsible: '',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: getCustomLabel.tsx]---
Location: payload-main/test/fields/collections/Collapsible/CustomLabel/getCustomLabel.tsx
Signals: React

```typescript
import type { CollapsibleField } from 'payload'
import type React from 'react'

export const getCustomLabel = ({
  fallback,
  path,
  style,
}: {
  fallback?: string
  path: string
  style: React.CSSProperties
}): CollapsibleField['admin']['components']['Label'] => {
  return {
    clientProps: {
      fallback,
      path,
      style,
    },
    path: '/collections/Collapsible/CustomLabel/index.js#CustomLabelComponent',
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/fields/collections/Collapsible/CustomLabel/index.tsx
Signals: React

```typescript
'use client'

import { useRowLabel } from '@payloadcms/ui'
import React from 'react'

export const CustomLabelComponent: React.FC<{
  fallback?: string
  path: string
  style?: React.CSSProperties
}> = ({
  fallback = 'Untitled',
  path,
  style = {
    color: 'hotpink',
    textTransform: 'uppercase',
  },
}) => {
  const { data } = useRowLabel()

  return <div style={style}>{data?.[path] || fallback}</div>
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/fields/collections/Collapsible/NestedCustomLabel/index.tsx
Signals: React

```typescript
'use client'

import { useRowLabel } from '@payloadcms/ui'
import React from 'react'

export const NestedCustomLabel: React.FC = () => {
  const { data } = useRowLabel<{
    innerCollapsible: string
  }>()

  return (
    <div
      style={{
        color: 'hotpink',
        textTransform: 'uppercase',
      }}
    >
      {data?.innerCollapsible || 'Untitled'}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: CustomClientField.tsx]---
Location: payload-main/test/fields/collections/ConditionalLogic/CustomClientField.tsx
Signals: React

```typescript
'use client'

import type { TextFieldClientComponent } from 'payload'

import React from 'react'

const CustomClientField: TextFieldClientComponent = () => {
  return <div id="custom-client-field">Custom Client Field</div>
}

export default CustomClientField
```

--------------------------------------------------------------------------------

---[FILE: CustomFieldWithField.tsx]---
Location: payload-main/test/fields/collections/ConditionalLogic/CustomFieldWithField.tsx
Signals: React

```typescript
'use client'
import type { TextFieldClientComponent } from 'payload'

import { TextField } from '@payloadcms/ui'
import React from 'react'

const CustomFieldWithField: TextFieldClientComponent = (props) => {
  return <TextField {...props} />
}

export default CustomFieldWithField
```

--------------------------------------------------------------------------------

---[FILE: CustomFieldWithHOC.tsx]---
Location: payload-main/test/fields/collections/ConditionalLogic/CustomFieldWithHOC.tsx
Signals: React

```typescript
'use client'
import type { TextFieldClientComponent } from 'payload'

import { TextField, withCondition } from '@payloadcms/ui'
import React from 'react'

const MyField: TextFieldClientComponent = (props) => {
  return <TextField {...props} />
}

export default withCondition(MyField)
```

--------------------------------------------------------------------------------

---[FILE: CustomServerField.tsx]---
Location: payload-main/test/fields/collections/ConditionalLogic/CustomServerField.tsx
Signals: React

```typescript
import type { TextFieldServerComponent } from 'payload'

import React from 'react'

const CustomServerField: TextFieldServerComponent = () => {
  return <div id="custom-server-field">Custom Server Field</div>
}

export default CustomServerField
```

--------------------------------------------------------------------------------

````
