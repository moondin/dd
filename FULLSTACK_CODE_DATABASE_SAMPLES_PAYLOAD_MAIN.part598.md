---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 598
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 598 of 695)

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

---[FILE: blocks.ts]---
Location: payload-main/test/lexical/collections/Lexical/blocks.ts

```typescript
import type { ArrayField, Block, TextFieldSingleValidation } from 'payload'

import { BlocksFeature, FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

import { textFieldsSlug } from '../../slugs.js'

async function asyncFunction(param: string) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(param?.toUpperCase())
    }, 1000)
  })
}

export const FilterOptionsBlock: Block = {
  slug: 'filterOptionsBlock',
  fields: [
    {
      name: 'text',
      type: 'text',
    },
    {
      name: 'group',
      type: 'group',
      fields: [
        {
          name: 'groupText',
          type: 'text',
        },
        {
          name: 'dependsOnDocData',
          type: 'relationship',
          relationTo: 'text-fields',
          filterOptions: ({ data }) => {
            if (!data.title) {
              return true
            }
            return {
              text: {
                equals: data.title,
              },
            }
          },
        },
        {
          name: 'dependsOnSiblingData',
          type: 'relationship',
          relationTo: 'text-fields',
          filterOptions: ({ siblingData }) => {
            // @ts-expect-error
            if (!siblingData?.groupText) {
              return true
            }
            return {
              text: {
                equals: (siblingData as any)?.groupText,
              },
            }
          },
        },
        {
          name: 'dependsOnBlockData',
          type: 'relationship',
          relationTo: 'text-fields',
          filterOptions: ({ blockData }) => {
            if (!blockData?.text) {
              return true
            }
            return {
              text: {
                equals: blockData?.text,
              },
            }
          },
        },
      ],
    },
  ],
}

export const ValidationBlock: Block = {
  slug: 'validationBlock',
  fields: [
    {
      name: 'text',
      type: 'text',
    },
    {
      name: 'group',
      type: 'group',
      fields: [
        {
          name: 'groupText',
          type: 'text',
        },
        {
          name: 'textDependsOnDocData',
          type: 'text',
          validate: ((value, { data }) => {
            if ((data as any)?.title === 'invalid') {
              return 'doc title cannot be invalid'
            }
            return true
          }) as TextFieldSingleValidation,
        },
        {
          name: 'textDependsOnSiblingData',
          type: 'text',
          validate: ((value, { siblingData }) => {
            if ((siblingData as any)?.groupText === 'invalid') {
              return 'textDependsOnSiblingData sibling field cannot be invalid'
            }
          }) as TextFieldSingleValidation,
        },
        {
          name: 'textDependsOnBlockData',
          type: 'text',
          validate: ((value, { blockData }) => {
            if ((blockData as any)?.text === 'invalid') {
              return 'textDependsOnBlockData sibling field cannot be invalid'
            }
          }) as TextFieldSingleValidation,
        },
      ],
    },
  ],
}

export const AsyncHooksBlock: Block = {
  slug: 'asyncHooksBlock',
  fields: [
    {
      name: 'test1',
      label: 'Text',
      type: 'text',
      hooks: {
        afterRead: [
          ({ value }) => {
            return value?.toUpperCase()
          },
        ],
      },
    },
    {
      name: 'test2',
      label: 'Text',
      type: 'text',
      hooks: {
        afterRead: [
          async ({ value }) => {
            const valuenew = await asyncFunction(value)
            return valuenew
          },
        ],
      },
    },
  ],
}

export const BlockColumns = ({ name }: { name: string }): ArrayField => ({
  type: 'array',
  name,
  interfaceName: 'BlockColumns',
  admin: {
    initCollapsed: true,
  },
  fields: [
    {
      name: 'text',
      type: 'text',
    },
    {
      name: 'subArray',
      type: 'array',
      fields: [
        {
          name: 'requiredText',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
})
export const ConditionalLayoutBlock: Block = {
  fields: [
    {
      label: 'Layout',
      name: 'layout',
      type: 'select',
      options: ['1', '2', '3'],
      defaultValue: '1',
      required: true,
    },
    {
      ...BlockColumns({ name: 'columns' }),
      admin: {
        condition: (data, siblingData) => {
          return ['1'].includes(siblingData.layout)
        },
      },
      minRows: 1,
      maxRows: 1,
    },
    {
      ...BlockColumns({ name: 'columns2' }),
      admin: {
        condition: (data, siblingData) => {
          return ['2'].includes(siblingData.layout)
        },
      },
      minRows: 2,
      maxRows: 2,
    },
    {
      ...BlockColumns({ name: 'columns3' }),
      admin: {
        condition: (data, siblingData) => {
          return ['3'].includes(siblingData.layout)
        },
      },
      minRows: 3,
      maxRows: 3,
    },
  ],
  slug: 'conditionalLayout',
}

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

export const RadioButtonsBlock: Block = {
  interfaceName: 'LexicalBlocksRadioButtonsBlock',
  fields: [
    {
      name: 'radioButtons',
      type: 'radio',
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
      ],
    },
  ],
  slug: 'radioButtons',
}

export const RichTextBlock: Block = {
  fields: [
    {
      name: 'richTextField',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          FixedToolbarFeature(),
          BlocksFeature({
            blocks: [
              {
                fields: [
                  {
                    name: 'subRichTextField',
                    type: 'richText',
                    editor: lexicalEditor({}),
                  },
                  {
                    name: 'subUploadField',
                    type: 'upload',
                    relationTo: 'uploads',
                  },
                ],
                slug: 'lexicalAndUploadBlock',
              },
            ],
          }),
        ],
      }),
    },
  ],
  slug: 'richTextBlock',
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

export const RelationshipHasManyBlock: Block = {
  fields: [
    {
      name: 'rel',
      type: 'relationship',
      hasMany: true,
      relationTo: [textFieldsSlug, 'uploads'],
      required: true,
    },
  ],
  slug: 'relationshipHasManyBlock',
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

export const SubBlockBlock: Block = {
  slug: 'subBlockLexical',
  fields: [
    {
      name: 'subBlocksLexical',
      type: 'blocks',
      blocks: [
        {
          slug: 'contentBlock',
          fields: [
            {
              name: 'richText',
              type: 'richText',
              required: true,
              editor: lexicalEditor(),
            },
          ],
        },
        {
          slug: 'textArea',
          fields: [
            {
              name: 'content',
              type: 'textarea',
              required: true,
            },
          ],
        },
        SelectFieldBlock,
      ],
    },
  ],
}

export const TabBlock: Block = {
  slug: 'tabBlock',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Tab1',
          name: 'tab1',
          fields: [
            {
              name: 'text1',
              type: 'text',
            },
          ],
        },
        {
          label: 'Tab2',
          name: 'tab2',
          fields: [
            {
              name: 'text2',
              type: 'text',
            },
          ],
        },
      ],
    },
  ],
}

export const CodeBlock: Block = {
  fields: [
    {
      name: 'code',
      type: 'code',
    },
  ],
  slug: 'code',
}

export const NoBlockNameBlock: Block = {
  fields: [
    {
      name: 'text',
      type: 'text',
    },
  ],
  admin: {
    disableBlockName: true,
  },
  slug: 'noBlockName',
}
```

--------------------------------------------------------------------------------

---[FILE: data.ts]---
Location: payload-main/test/lexical/collections/Lexical/data.ts

```typescript
import { generateLexicalRichText } from './generateLexicalRichText.js'

export const lexicalDocData = {
  title: 'Rich Text',
  lexicalWithBlocks: generateLexicalRichText(),
}
```

--------------------------------------------------------------------------------

---[FILE: generateLexicalRichText.ts]---
Location: payload-main/test/lexical/collections/Lexical/generateLexicalRichText.ts

```typescript
import type {
  SerializedBlockNode,
  SerializedParagraphNode,
  SerializedTextNode,
  SerializedUploadNode,
  TypedEditorState,
} from '@payloadcms/richtext-lexical'

export function generateLexicalRichText(): TypedEditorState<
  SerializedBlockNode | SerializedParagraphNode | SerializedTextNode | SerializedUploadNode
> {
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
              text: 'Upload Node:',
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          textFormat: 0,
          version: 1,
        },
        {
          format: '',
          type: 'upload',
          version: 2,
          id: '665d105a91e1c337ba8308dd',
          fields: {
            caption: {
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
                        text: 'Relationship inside Upload Caption:',
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
                    relationTo: 'text-fields',
                    value: '{{TEXT_DOC_ID}}',
                  },
                ],
                direction: 'ltr',
              },
            },
          },
          relationTo: 'uploads',
          value: '{{UPLOAD_DOC_ID}}',
        },
        {
          format: '',
          type: 'block',
          version: 2,
          fields: {
            id: '65298b13db4ef8c744a7faaa',
            rel: '{{UPLOAD_DOC_ID}}',
            blockName: 'Block Node, with Relationship Field',
            blockType: 'relationshipBlock',
          },
        },
        {
          format: '',
          type: 'block',
          version: 2,
          fields: {
            id: '6565c8668294bf824c24d4a4',
            blockName: '',
            blockType: 'relationshipHasManyBlock',
            rel: [
              {
                value: '{{TEXT_DOC_ID}}',
                relationTo: 'text-fields',
              },
              {
                value: '{{UPLOAD_DOC_ID}}',
                relationTo: 'uploads',
              },
            ],
          },
        },
        {
          format: '',
          type: 'block',
          version: 2,
          fields: {
            id: '65298b1ddb4ef8c744a7faab',
            richTextField: {
              root: {
                type: 'root',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    format: '',
                    type: 'relationship',
                    version: 2,
                    relationTo: 'rich-text-fields',
                    value: '{{RICH_TEXT_DOC_ID}}',
                  },
                  {
                    children: [
                      {
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: 'Some text below relationship node 1',
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
                direction: null,
              },
            },
            blockName: 'Block Node, with RichText Field, with Relationship Node',
            blockType: 'richTextBlock',
          },
        },
        {
          format: '',
          type: 'block',
          version: 2,
          fields: {
            id: '65298b2bdb4ef8c744a7faac',
            blockName: 'Block Node, with Blocks Field, With RichText Field, With Relationship Node',
            blockType: 'subBlockLexical',
            subBlocksLexical: [
              {
                id: '65298b2edb4ef8c744a7faad',
                richText: {
                  root: {
                    type: 'root',
                    format: '',
                    indent: 0,
                    version: 1,
                    children: [
                      {
                        format: '',
                        type: 'relationship',
                        version: 2,
                        relationTo: 'text-fields',
                        value: '{{TEXT_DOC_ID}}',
                      },
                      {
                        children: [
                          {
                            detail: 0,
                            format: 0,
                            mode: 'normal',
                            style: '',
                            text: 'Some text below relationship node 2',
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
                    direction: null,
                  },
                },
                blockType: 'contentBlock',
              },
            ],
          },
        },
        {
          format: '',
          type: 'block',
          version: 2,
          fields: {
            id: '65298b49db4ef8c744a7faae',
            upload: '{{UPLOAD_DOC_ID}}',
            blockName: 'Block Node, With Upload Field',
            blockType: 'uploadAndRichText',
          },
        },
        {
          children: [],
          direction: null,
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
            id: '65532e49fe515eb112e605a3',
            blockName: 'Radio Buttons 1',
            blockType: 'radioButtons',
            radioButtons: 'option1',
          },
        },
        {
          format: '',
          type: 'block',
          version: 2,
          fields: {
            id: '65532e50fe515eb112e605a4',
            blockName: 'Radio Buttons 2',
            blockType: 'radioButtons',
            radioButtons: 'option1',
          },
        },
        {
          children: [],
          direction: null,
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
            id: '65588bfa80fb5a147a378e74',
            blockName: '',
            blockType: 'conditionalLayout',
            layout: '1',
            columns: [
              {
                id: '65588bfb80fb5a147a378e75',
                text: 'text in conditionalLayout block',
              },
            ],
          },
        }, // Do not remove this blocks node. It ensures that validation passes when it's created
        {
          children: [],
          direction: null,
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
            id: '666c9dfd189d72626ea301f9',
            blockName: '',
            tab1: {
              text1: 'Some text1',
            },
            tab2: {
              text2: 'Some text2',
            },
            blockType: 'tabBlock',
          },
        },
        {
          format: '',
          type: 'block',
          version: 2,
          fields: {
            id: '666c9e0b189d72626ea301fa',
            blockName: '',
            blockType: 'code',
            code: 'Some code\nhello\nworld',
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
Location: payload-main/test/lexical/collections/Lexical/index.ts

```typescript
import type { ServerEditorConfig } from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { Block, BlockSlug, CollectionConfig } from 'payload'

import {
  BlocksFeature,
  defaultEditorFeatures,
  EXPERIMENTAL_TableFeature,
  FixedToolbarFeature,
  getEnabledNodes,
  HeadingFeature,
  lexicalEditor,
  LinkFeature,
  sanitizeServerEditorConfig,
  TreeViewFeature,
  UploadFeature,
} from '@payloadcms/richtext-lexical'
import { createHeadlessEditor } from '@payloadcms/richtext-lexical/lexical/headless'
import { $convertToMarkdownString } from '@payloadcms/richtext-lexical/lexical/markdown'

import { lexicalFieldsSlug } from '../../slugs.js'
import {
  AsyncHooksBlock,
  CodeBlock,
  ConditionalLayoutBlock,
  FilterOptionsBlock,
  NoBlockNameBlock,
  RadioButtonsBlock,
  RelationshipBlock,
  RelationshipHasManyBlock,
  RichTextBlock,
  SelectFieldBlock,
  SubBlockBlock,
  TabBlock,
  TextBlock,
  UploadAndRichTextBlock,
  ValidationBlock,
} from './blocks.js'
import { ModifyInlineBlockFeature } from './ModifyInlineBlockFeature/feature.server.js'

export const lexicalBlocks: (Block | BlockSlug)[] = [
  ValidationBlock,
  FilterOptionsBlock,
  AsyncHooksBlock,
  RichTextBlock,
  TextBlock,
  UploadAndRichTextBlock,
  SelectFieldBlock,
  RelationshipBlock,
  RelationshipHasManyBlock,
  SubBlockBlock,
  RadioButtonsBlock,
  ConditionalLayoutBlock,
  TabBlock,
  CodeBlock,
  NoBlockNameBlock,
  {
    slug: 'myBlock',
    admin: {
      components: {},
    },
    fields: [
      {
        name: 'key',
        label: () => {
          return 'Key'
        },
        type: 'select',
        options: ['value1', 'value2', 'value3'],
      },
    ],
  },
  {
    slug: 'myBlockWithLabel',
    admin: {
      components: {
        Label: '/collections/Lexical/blockComponents/LabelComponent.js#LabelComponent',
      },
    },
    fields: [
      {
        name: 'key',
        label: () => {
          return 'Key'
        },
        type: 'select',
        options: ['value1', 'value2', 'value3'],
      },
    ],
  },
  {
    slug: 'myBlockWithBlock',
    admin: {
      components: {
        Block: '/collections/Lexical/blockComponents/BlockComponent.js#BlockComponent',
      },
    },
    fields: [
      {
        name: 'key',
        label: () => {
          return 'Key'
        },
        type: 'select',
        options: ['value1', 'value2', 'value3'],
      },
    ],
  },
  {
    slug: 'BlockRSC',

    admin: {
      components: {
        Block: '/collections/Lexical/blockComponents/BlockComponentRSC.js#BlockComponentRSC',
      },
    },
    fields: [
      {
        name: 'key',
        label: () => {
          return 'Key'
        },
        type: 'select',
        options: ['value1', 'value2', 'value3'],
      },
    ],
  },
  {
    slug: 'myBlockWithBlockAndLabel',
    admin: {
      components: {
        Block: '/collections/Lexical/blockComponents/BlockComponent.js#BlockComponent',
        Label: '/collections/Lexical/blockComponents/LabelComponent.js#LabelComponent',
      },
    },
    fields: [
      {
        name: 'key',
        label: () => {
          return 'Key'
        },
        type: 'select',
        options: ['value1', 'value2', 'value3'],
      },
    ],
  },
]

export const lexicalInlineBlocks: (Block | BlockSlug)[] = [
  {
    slug: 'AvatarGroup',
    interfaceName: 'AvatarGroupBlock',
    fields: [
      {
        name: 'avatars',
        type: 'array',
        minRows: 1,
        maxRows: 6,
        fields: [
          {
            name: 'image',
            type: 'upload',
            relationTo: 'uploads',
          },
        ],
      },
    ],
  },
  {
    slug: 'myInlineBlock',
    admin: {
      components: {},
    },
    fields: [
      {
        name: 'key',
        label: () => {
          return 'Key'
        },
        type: 'select',
        options: ['value1', 'value2', 'value3'],
      },
    ],
  },
  {
    slug: 'myInlineBlockWithLabel',
    admin: {
      components: {
        Label: '/collections/Lexical/inlineBlockComponents/LabelComponent.js#LabelComponent',
      },
    },
    fields: [
      {
        name: 'key',
        label: () => {
          return 'Key'
        },
        type: 'select',
        options: ['value1', 'value2', 'value3'],
      },
    ],
  },
  {
    slug: 'myInlineBlockWithBlock',
    admin: {
      components: {
        Block: '/collections/Lexical/inlineBlockComponents/BlockComponent.js#BlockComponent',
      },
    },
    fields: [
      {
        name: 'key',
        label: () => {
          return 'Key'
        },
        type: 'select',
        options: ['value1', 'value2', 'value3'],
      },
    ],
  },
  {
    slug: 'myInlineBlockWithBlockAndLabel',
    admin: {
      components: {
        Block: '/collections/Lexical/inlineBlockComponents/BlockComponent.js#BlockComponent',
        Label: '/collections/Lexical/inlineBlockComponents/LabelComponent.js#LabelComponent',
      },
    },
    fields: [
      {
        name: 'key',
        label: () => {
          return 'Key'
        },
        type: 'select',
        options: ['value1', 'value2', 'value3'],
      },
    ],
  },
]

export const getLexicalFieldsCollection: (args: {
  blocks: (Block | BlockSlug)[]
  inlineBlocks: (Block | BlockSlug)[]
}) => CollectionConfig = ({ blocks, inlineBlocks }) => {
  const editorConfig: ServerEditorConfig = {
    features: [
      ...defaultEditorFeatures,
      //TestRecorderFeature(),
      TreeViewFeature(),
      //HTMLConverterFeature(),
      FixedToolbarFeature(),
      LinkFeature({
        fields: ({ defaultFields }) => [
          ...defaultFields,
          {
            name: 'rel',
            type: 'select',
            admin: {
              description:
                'The rel attribute defines the relationship between a linked resource and the current document. This is a custom link field.',
            },
            hasMany: true,
            label: 'Rel Attribute',
            options: ['noopener', 'noreferrer', 'nofollow'],
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
      ModifyInlineBlockFeature(),
      BlocksFeature({
        blocks,
        inlineBlocks,
      }),
      EXPERIMENTAL_TableFeature(),
    ],
  }
  return {
    slug: lexicalFieldsSlug,
    access: {
      read: () => true,
    },
    admin: {
      listSearchableFields: ['title', 'richTextLexicalCustomFields'],
      useAsTitle: 'title',
    },
    fields: [
      {
        name: 'title',
        type: 'text',
        required: true,
      },
      {
        name: 'lexicalRootEditor',
        type: 'richText',
      },
      {
        name: 'lexicalSimple',
        type: 'richText',
        admin: {
          description: 'A simple lexical field',
        },
        editor: lexicalEditor({
          features: ({ defaultFeatures }) => [
            //TestRecorderFeature(),
            TreeViewFeature(),
            BlocksFeature({
              blocks: [
                RichTextBlock,
                TextBlock,
                UploadAndRichTextBlock,
                SelectFieldBlock,
                RelationshipBlock,
                RelationshipHasManyBlock,
                SubBlockBlock,
                RadioButtonsBlock,
                ConditionalLayoutBlock,
              ],
            }),
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h4'] }),
          ],
        }),
      },
      {
        type: 'ui',
        name: 'clearLexicalState',
        admin: {
          components: {
            Field: {
              path: '/collections/Lexical/components/ClearState.js#ClearState',
              clientProps: {
                fieldName: 'lexicalSimple',
              },
            },
          },
        },
      },
      {
        name: 'lexicalWithBlocks',
        type: 'richText',
        admin: {
          components: {
            Description: '/collections/Lexical/components/Description.js#Description',
          },
          description: 'Should not be rendered',
        },
        editor: lexicalEditor({
          admin: {
            hideGutter: false,
          },
          features: editorConfig.features,
        }),
        required: true,
      },
      //{
      //  name: 'rendered',
      //  type: 'ui',
      //  admin: {
      //    components: {
      //      Field: './collections/Lexical/LexicalRendered.js#LexicalRendered',
      //    },
      //  },
      //},
      {
        name: 'lexicalWithBlocks_markdown',
        type: 'textarea',
        hooks: {
          afterRead: [
            async ({ data, req, siblingData }) => {
              const yourSanitizedEditorConfig = await sanitizeServerEditorConfig(
                editorConfig,
                req.payload.config,
              )

              const headlessEditor = createHeadlessEditor({
                nodes: getEnabledNodes({
                  editorConfig: yourSanitizedEditorConfig,
                }),
              })

              const yourEditorState: SerializedEditorState = siblingData.lexicalWithBlocks
              try {
                headlessEditor.update(
                  () => {
                    headlessEditor.setEditorState(headlessEditor.parseEditorState(yourEditorState))
                  },
                  { discrete: true },
                )
              } catch (e) {
                /* empty */
              }

              // Export to markdown
              let markdown: string = ''
              headlessEditor.getEditorState().read(() => {
                markdown = $convertToMarkdownString(
                  yourSanitizedEditorConfig?.features?.markdownTransformers,
                )
              })
              return markdown
            },
          ],
        },
      },
    ],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: LexicalRendered.tsx]---
Location: payload-main/test/lexical/collections/Lexical/LexicalRendered.tsx
Signals: React

```typescript
'use client'
import type { DefaultNodeTypes, SerializedBlockNode } from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { getRestPopulateFn } from '@payloadcms/richtext-lexical/client'
import {
  convertLexicalToHTML,
  type HTMLConvertersFunction,
} from '@payloadcms/richtext-lexical/html'
import {
  convertLexicalToHTMLAsync,
  type HTMLConvertersFunctionAsync,
} from '@payloadcms/richtext-lexical/html-async'
import { type JSXConvertersFunction, RichText } from '@payloadcms/richtext-lexical/react'
import { useConfig, useDocumentInfo, usePayloadAPI } from '@payloadcms/ui'
import React, { useEffect, useMemo, useState } from 'react'

const jsxConverters: JSXConvertersFunction<DefaultNodeTypes | SerializedBlockNode<any>> = ({
  defaultConverters,
}) => ({
  ...defaultConverters,
  blocks: {
    myTextBlock: ({ node }) => <div style={{ backgroundColor: 'red' }}>{node.fields.text}</div>,
    relationshipBlock: ({ node, nodesToJSX }) => {
      return <p>Test</p>
    },
  },
})

const htmlConverters: HTMLConvertersFunction<DefaultNodeTypes | SerializedBlockNode<any>> = ({
  defaultConverters,
}) => ({
  ...defaultConverters,
  blocks: {
    myTextBlock: ({ node }) => `<div style="background-color: red;">${node.fields.text}</div>`,
    relationshipBlock: () => {
      return `<p>Test</p>`
    },
  },
})

const htmlConvertersAsync: HTMLConvertersFunctionAsync<
  DefaultNodeTypes | SerializedBlockNode<any>
> = ({ defaultConverters }) => ({
  ...defaultConverters,
  blocks: {
    myTextBlock: ({ node }) => `<div style="background-color: red;">${node.fields.text}</div>`,
    relationshipBlock: () => {
      return `<p>Test</p>`
    },
  },
})

export const LexicalRendered: React.FC = () => {
  const { id, collectionSlug } = useDocumentInfo()

  const {
    config: {
      routes: { api },
      serverURL,
    },
  } = useConfig()

  const [{ data }] = usePayloadAPI(`${serverURL}${api}/${collectionSlug}/${id}`, {
    initialParams: {
      depth: 1,
    },
  })

  const [{ data: unpopulatedData }] = usePayloadAPI(`${serverURL}${api}/${collectionSlug}/${id}`, {
    initialParams: {
      depth: 0,
    },
  })

  const html: null | string = useMemo(() => {
    if (!data.lexicalWithBlocks) {
      return null
    }

    return convertLexicalToHTML({
      converters: htmlConverters,
      data: data.lexicalWithBlocks as SerializedEditorState,
    })
  }, [data.lexicalWithBlocks])

  const [htmlFromUnpopulatedData, setHtmlFromUnpopulatedData] = useState<null | string>(null)

  useEffect(() => {
    async function convert() {
      const html = await convertLexicalToHTMLAsync({
        converters: htmlConvertersAsync,
        data: unpopulatedData.lexicalWithBlocks as SerializedEditorState,
        populate: getRestPopulateFn({
          apiURL: `${serverURL}${api}`,
        }),
      })

      setHtmlFromUnpopulatedData(html)
    }
    void convert()
  }, [unpopulatedData.lexicalWithBlocks, api, serverURL])

  if (!data.lexicalWithBlocks) {
    return null
  }

  return (
    <div>
      <h1>Rendered JSX:</h1>
      <RichText converters={jsxConverters} data={data.lexicalWithBlocks as SerializedEditorState} />
      <h1>Rendered HTML:</h1>
      {html && <div dangerouslySetInnerHTML={{ __html: html }} />}
      <h1>Rendered HTML 2:</h1>
      {htmlFromUnpopulatedData && (
        <div dangerouslySetInnerHTML={{ __html: htmlFromUnpopulatedData }} />
      )}
      <h1>Raw JSON:</h1>
      <pre>{JSON.stringify(data.lexicalWithBlocks, null, 2)}</pre>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: loremIpsum.ts]---
Location: payload-main/test/lexical/collections/Lexical/loremIpsum.ts

```typescript
export const loremIpsum =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam hendrerit nisi sed sollicitudin pellentesque. Nunc posuere purus rhoncus pulvinar aliquam. Ut aliquet tristique nisl vitae volutpat. Nulla aliquet porttitor venenatis. Donec a dui et dui fringilla consectetur id nec massa. Aliquam erat volutpat. Sed ut dui ut lacus dictum fermentum vel tincidunt neque. Sed sed lacinia lectus. Duis sit amet sodales felis. Duis nunc eros, mattis at dui ac, convallis semper risus. In adipiscing ultrices tellus, in suscipit massa vehicula eu.'
```

--------------------------------------------------------------------------------

---[FILE: BlockComponent.tsx]---
Location: payload-main/test/lexical/collections/Lexical/blockComponents/BlockComponent.tsx
Signals: React

```typescript
'use client'
import type { UIFieldClientComponent } from 'payload'

import {
  BlockCollapsible,
  BlockEditButton,
  BlockRemoveButton,
} from '@payloadcms/richtext-lexical/client'
import { useFormFields } from '@payloadcms/ui'
import React from 'react'

export const BlockComponent: UIFieldClientComponent = () => {
  const key = useFormFields(([fields]) => fields.key)

  return (
    <BlockCollapsible>
      MY BLOCK COMPONENT. Value: {(key?.value as string) ?? '<no value>'}
      Edit: <BlockEditButton />
      <BlockRemoveButton />
    </BlockCollapsible>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: BlockComponentRSC.tsx]---
Location: payload-main/test/lexical/collections/Lexical/blockComponents/BlockComponentRSC.tsx
Signals: React

```typescript
import type { UIFieldServerComponent } from 'payload'

import { BlockCollapsible } from '@payloadcms/richtext-lexical/client'
import React from 'react'

export const BlockComponentRSC: UIFieldServerComponent = (props) => {
  const { siblingData } = props

  return <BlockCollapsible>Data: {siblingData?.key ?? ''}</BlockCollapsible>
}
```

--------------------------------------------------------------------------------

---[FILE: LabelComponent.tsx]---
Location: payload-main/test/lexical/collections/Lexical/blockComponents/LabelComponent.tsx
Signals: React

```typescript
'use client'

import type { UIFieldClientComponent } from 'payload'

import { useFormFields } from '@payloadcms/ui'
import React from 'react'

export const LabelComponent: UIFieldClientComponent = () => {
  const key = useFormFields(([fields]) => fields.key)

  return <div>{(key?.value as string) ?? '<no value>'}yaya</div>
}
```

--------------------------------------------------------------------------------

---[FILE: ClearState.tsx]---
Location: payload-main/test/lexical/collections/Lexical/components/ClearState.tsx
Signals: React

```typescript
'use client'

import type { SerializedParagraphNode, SerializedTextNode } from '@payloadcms/richtext-lexical'

import { useForm } from '@payloadcms/ui'
import React from 'react'

export const ClearState = ({ fieldName }: { fieldName: string }) => {
  const { dispatchFields, fields } = useForm()

  const clearState = React.useCallback(() => {
    const newState = {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: '',
                version: 1,
              } as SerializedTextNode,
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            textStyle: '',
            version: 1,
          } as SerializedParagraphNode,
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    }
    dispatchFields({
      type: 'REPLACE_STATE',
      state: {
        ...fields,
        [fieldName]: {
          ...fields[fieldName],
          initialValue: newState,
          value: newState,
        },
      },
    })
  }, [dispatchFields, fields, fieldName])

  return (
    <button id={`clear-lexical-${fieldName}`} onClick={clearState} type="button">
      Clear State
    </button>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: Description.tsx]---
Location: payload-main/test/lexical/collections/Lexical/components/Description.tsx

```typescript
export const Description = () => {
  return (
    <div className="lexical-blocks-custom-description" style={{ color: 'red' }}>
      My Custom Lexical Description
    </div>
  )
}
```

--------------------------------------------------------------------------------

````
