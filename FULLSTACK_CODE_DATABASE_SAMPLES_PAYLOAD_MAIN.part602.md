---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 602
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 602 of 695)

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

---[FILE: generatePayloadPluginLexicalData.ts]---
Location: payload-main/test/lexical/collections/LexicalMigrate/generatePayloadPluginLexicalData.ts

```typescript
export const payloadPluginLexicalData = {
  words: 49,
  preview:
    'paragraph text bold italic underline and all subscript superscript  code internal link external link…',
  comments: [],
  characters: 493,
  jsonContent: {
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
              text: 'paragraph text ',
              type: 'text',
              version: 1,
            },
            {
              detail: 0,
              format: 1,
              mode: 'normal',
              style: '',
              text: 'bold',
              type: 'text',
              version: 1,
            },
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: ' ',
              type: 'text',
              version: 1,
            },
            {
              detail: 0,
              format: 2,
              mode: 'normal',
              style: '',
              text: 'italic',
              type: 'text',
              version: 1,
            },
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: ' ',
              type: 'text',
              version: 1,
            },
            {
              detail: 0,
              format: 8,
              mode: 'normal',
              style: '',
              text: 'underline',
              type: 'text',
              version: 1,
            },
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: ' and ',
              type: 'text',
              version: 1,
            },
            {
              detail: 0,
              format: 11,
              mode: 'normal',
              style: '',
              text: 'all',
              type: 'text',
              version: 1,
            },
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: ' ',
              type: 'text',
              version: 1,
            },
            {
              detail: 0,
              format: 32,
              mode: 'normal',
              style: '',
              text: 'subscript',
              type: 'text',
              version: 1,
            },
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: ' ',
              type: 'text',
              version: 1,
            },
            {
              detail: 0,
              format: 64,
              mode: 'normal',
              style: '',
              text: 'superscript',
              type: 'text',
              version: 1,
            },
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: '  ',
              type: 'text',
              version: 1,
            },
            {
              detail: 0,
              format: 16,
              mode: 'normal',
              style: '',
              text: 'code',
              type: 'text',
              version: 1,
            },
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: ' ',
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
                  text: 'internal link',
                  type: 'text',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              type: 'link',
              version: 2,
              attributes: {
                newTab: true,
                linkType: 'internal',
                doc: {
                  value: '{{TEXT_DOC_ID}}',
                  relationTo: 'text-fields',
                  data: {}, // populated data
                },
                text: 'internal link',
              },
            },
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: ' ',
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
                  text: 'external link',
                  type: 'text',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              type: 'link',
              version: 2,
              attributes: {
                newTab: true,
                nofollow: false,
                url: 'https://fewfwef.de',
                linkType: 'custom',
                text: 'external link',
              },
            },
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: ' s. ',
              type: 'text',
              version: 1,
            },
            {
              detail: 0,
              format: 4,
              mode: 'normal',
              style: '',
              text: 'strikethrough',
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
              text: 'heading 1',
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
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
              text: 'heading 2',
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'heading',
          version: 1,
          tag: 'h2',
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
                  text: 'bullet list ',
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
                  text: 'item 2',
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
                  text: 'item 3',
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
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'ordered list',
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
                  text: 'item 2',
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
                  text: 'item 3',
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
          listType: 'number',
          start: 1,
          tag: 'ol',
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
                  text: 'check list',
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
                  text: 'item 2',
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
                  text: 'item 3',
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
          listType: 'check',
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
              text: 'quoteeee',
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'quote',
          version: 1,
        },
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'code block line ',
              type: 'code-highlight',
              version: 1,
            },
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: '1',
              type: 'code-highlight',
              version: 1,
              highlightType: 'number',
            },
            {
              type: 'linebreak',
              version: 1,
            },
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'code block line ',
              type: 'code-highlight',
              version: 1,
            },
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: '2',
              type: 'code-highlight',
              version: 1,
              highlightType: 'number',
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'code',
          version: 1,
          language: 'javascript',
        },
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Upload:',
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
              type: 'upload',
              version: 1,
              rawImagePayload: {
                value: {
                  id: '{{UPLOAD_DOC_ID}}',
                },
                relationTo: 'uploads',
              },
              caption: {
                editorState: {
                  root: {
                    children: [
                      {
                        children: [
                          {
                            detail: 0,
                            format: 0,
                            mode: 'normal',
                            style: '',
                            text: 'upload caption',
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
                    format: '',
                    indent: 0,
                    type: 'root',
                    version: 1,
                  },
                },
              },
              showCaption: true,
              data: {}, // populated upload data
            },
          ],
          direction: null,
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
        },
        {
          children: [],
          direction: null,
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
                  children: [
                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: 'normal',
                          style: '',
                          text: '2x2 table top left',
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
                  format: '',
                  indent: 0,
                  type: 'tablecell',
                  version: 1,
                  colSpan: 1,
                  rowSpan: 1,
                  backgroundColor: null,
                  headerState: 3,
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
                          text: '2x2 table top right',
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
                  format: '',
                  indent: 0,
                  type: 'tablecell',
                  version: 1,
                  colSpan: 1,
                  rowSpan: 1,
                  backgroundColor: null,
                  headerState: 1,
                },
              ],
              direction: null,
              format: '',
              indent: 0,
              type: 'tablerow',
              version: 1,
            },
            {
              children: [
                {
                  children: [
                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: 'normal',
                          style: '',
                          text: '2x2 table bottom left',
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
                  format: '',
                  indent: 0,
                  type: 'tablecell',
                  version: 1,
                  colSpan: 1,
                  rowSpan: 1,
                  backgroundColor: null,
                  headerState: 2,
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
                          text: '2x2 table bottom right',
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
                  format: '',
                  indent: 0,
                  type: 'tablecell',
                  version: 1,
                  colSpan: 1,
                  rowSpan: 1,
                  backgroundColor: null,
                  headerState: 0,
                },
              ],
              direction: null,
              format: '',
              indent: 0,
              type: 'tablerow',
              version: 1,
            },
          ],
          direction: null,
          format: '',
          indent: 0,
          type: 'table',
          version: 1,
        },
        {
          rows: [
            {
              cells: [
                {
                  colSpan: 1,
                  id: 'kafuj',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  type: 'header',
                  width: null,
                },
                {
                  colSpan: 1,
                  id: 'iussu',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  type: 'header',
                  width: null,
                },
              ],
              height: null,
              id: 'tnied',
            },
            {
              cells: [
                {
                  colSpan: 1,
                  id: 'hpnnv',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  type: 'header',
                  width: null,
                },
                {
                  colSpan: 1,
                  id: 'ndteg',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  type: 'normal',
                  width: null,
                },
              ],
              height: null,
              id: 'rxyey',
            },
            {
              cells: [
                {
                  colSpan: 1,
                  id: 'rtueq',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  type: 'header',
                  width: null,
                },
                {
                  colSpan: 1,
                  id: 'vrzoi',
                  json: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
                  type: 'normal',
                  width: null,
                },
              ],
              height: null,
              id: 'qzglv',
            },
          ],
          type: 'tablesheet',
          version: 1,
        },
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'youtube:',
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
          type: 'youtube',
          version: 1,
          videoID: '3Nwt3qu0_UY',
        },
        {
          children: [
            {
              equation: '3+3',
              inline: true,
              type: 'equation',
              version: 1,
            },
          ],
          direction: null,
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
                  text: 'collapsible title',
                  type: 'text',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              type: 'collapsible-title',
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
                      text: 'collabsible conteent',
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
              format: '',
              indent: 0,
              type: 'collapsible-content',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'collapsible-container',
          version: 1,
          open: true,
        },
        {
          children: [],
          direction: null,
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
        },
        {
          type: 'horizontalrule',
          version: 1,
        },
      ],
      direction: 'ltr',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/lexical/collections/LexicalMigrate/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import {
  lexicalEditor,
  lexicalHTMLField,
  LinkFeature,
  TreeViewFeature,
  UploadFeature,
} from '@payloadcms/richtext-lexical'
import {
  LexicalPluginToLexicalFeature,
  SlateToLexicalFeature,
} from '@payloadcms/richtext-lexical/migrate'

import { lexicalMigrateFieldsSlug } from '../../slugs.js'
import { getSimpleLexicalData } from './data.js'

export const LexicalMigrateFields: CollectionConfig = {
  slug: lexicalMigrateFieldsSlug,
  admin: {
    useAsTitle: 'title',
    listSearchableFields: ['title', 'richTextLexicalCustomFields'],
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
      name: 'lexicalWithLexicalPluginData',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          LexicalPluginToLexicalFeature({ quiet: true }),
          TreeViewFeature(),
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
        ],
      }),
    },
    {
      name: 'lexicalWithSlateData',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          SlateToLexicalFeature(),
          TreeViewFeature(),
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
        ],
      }),
    },
    {
      name: 'lexicalSimple',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [...defaultFeatures],
      }),
      defaultValue: getSimpleLexicalData('simple'),
    },
    lexicalHTMLField({ htmlFieldName: 'lexicalSimple_html', lexicalFieldName: 'lexicalSimple' }),
    {
      name: 'groupWithLexicalField',
      type: 'group',
      fields: [
        {
          name: 'lexicalInGroupField',
          type: 'richText',
          editor: lexicalEditor({
            features: ({ defaultFeatures }) => [...defaultFeatures],
          }),
          defaultValue: getSimpleLexicalData('group'),
        },
        lexicalHTMLField({
          htmlFieldName: 'lexicalInGroupField_html',
          lexicalFieldName: 'lexicalInGroupField',
        }),
      ],
    },
    {
      name: 'arrayWithLexicalField',
      type: 'array',
      fields: [
        {
          name: 'lexicalInArrayField',
          type: 'richText',
          editor: lexicalEditor({
            features: ({ defaultFeatures }) => [...defaultFeatures],
          }),
        },
        lexicalHTMLField({
          htmlFieldName: 'lexicalInArrayField_html',
          lexicalFieldName: 'lexicalInArrayField',
        }),
      ],
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: shared.ts]---
Location: payload-main/test/lexical/collections/LexicalMigrate/shared.ts

```typescript
import { payloadPluginLexicalData } from './generatePayloadPluginLexicalData.js'

export const LexicalRichTextDoc = {
  title: 'Rich Text',
  richTextLexicalWithLexicalPluginData: payloadPluginLexicalData,
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/lexical/collections/LexicalObjectReferenceBug/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { lexicalEditor, UploadFeature } from '@payloadcms/richtext-lexical'

/**
 * Do not change this specific CollectionConfig. Simply having this config in payload used to cause the admin panel to hang.
 * Thus, simply having this config in the test suite is enough to test the bug fix and prevent regressions. In case of regression,
 * the entire admin panel will hang again and all tests will fail.
 */
export const LexicalObjectReferenceBugCollection: CollectionConfig = {
  slug: 'lexicalObjectReferenceBug',
  fields: [
    {
      name: 'lexicalDefault',
      type: 'richText',
    },
    {
      name: 'lexicalEditor',
      type: 'richText',
      editor: lexicalEditor({
        features: [
          UploadFeature({
            collections: {
              media: {
                fields: [
                  {
                    name: 'caption',
                    type: 'richText',
                  },
                ],
              },
            },
          }),
        ],
      }),
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/lexical/collections/LexicalRelationships/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import {
  defaultEditorFeatures,
  FixedToolbarFeature,
  lexicalEditor,
  RelationshipFeature,
  UploadFeature,
} from '@payloadcms/richtext-lexical'

import { lexicalRelationshipFieldsSlug } from '../../slugs.js'

export const LexicalRelationshipsFields: CollectionConfig = {
  slug: lexicalRelationshipFieldsSlug,
  access: {
    read: () => true,
  },
  versions: { drafts: true },
  fields: [
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: [
          ...defaultEditorFeatures,
          RelationshipFeature({
            enabledCollections: ['array-fields'],
          }),
          UploadFeature({
            enabledCollections: ['uploads'],
          }),
        ],
      }),
    },
    {
      name: 'richText2',
      type: 'richText',
      editor: lexicalEditor({
        features: [...defaultEditorFeatures, RelationshipFeature(), FixedToolbarFeature()],
      }),
    },
    {
      name: 'richText3',
      type: 'richText',
      editor: lexicalEditor({
        features: [
          ...defaultEditorFeatures,
          UploadFeature({
            disabledCollections: ['uploads'],
          }),
        ],
      }),
    },
    {
      name: 'richTextLocalized',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: [
          ...defaultEditorFeatures,
          RelationshipFeature({
            enabledCollections: ['array-fields'],
          }),
          UploadFeature({
            enabledCollections: ['uploads'],
          }),
        ],
      }),
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: Component.tsx]---
Location: payload-main/test/lexical/collections/OnDemandForm/Component.tsx

```typescript
'use client'

import type { DefaultNodeTypes } from '@payloadcms/richtext-lexical'
import type { JSONFieldClientComponent } from 'payload'

import { buildEditorState, RenderLexical } from '@payloadcms/richtext-lexical/client'

import { lexicalFullyFeaturedSlug } from '../../slugs.js'

export const Component: JSONFieldClientComponent = () => {
  return (
    <div>
      Fully-Featured Component:
      <RenderLexical
        field={{ name: 'json' }}
        initialValue={buildEditorState<DefaultNodeTypes>({ text: 'defaultValue' })}
        schemaPath={`collection.${lexicalFullyFeaturedSlug}.richText`}
      />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: e2e.spec.ts]---
Location: payload-main/test/lexical/collections/OnDemandForm/e2e.spec.ts

```typescript
import { expect, test } from '@playwright/test'
import { AdminUrlUtil } from 'helpers/adminUrlUtil.js'
import { reInitializeDB } from 'helpers/reInitializeDB.js'
import path from 'path'
import { wait } from 'payload/shared'
import { fileURLToPath } from 'url'

import { ensureCompilationIsDone, saveDocAndAssert } from '../../../helpers.js'
import { initPayloadE2ENoConfig } from '../../../helpers/initPayloadE2ENoConfig.js'
import { TEST_TIMEOUT_LONG } from '../../../playwright.config.js'
import { LexicalHelpers } from '../utils.js'
const filename = fileURLToPath(import.meta.url)
const currentFolder = path.dirname(filename)
const dirname = path.resolve(currentFolder, '../../')

const { beforeAll, beforeEach, describe } = test

const { serverURL } = await initPayloadE2ENoConfig({
  dirname,
})

describe('Lexical On Demand', () => {
  let lexical: LexicalHelpers
  beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)
    process.env.SEED_IN_CONFIG_ONINIT = 'false' // Makes it so the payload config onInit seed is not run. Otherwise, the seed would be run unnecessarily twice for the initial test run - once for beforeEach and once for onInit
    const page = await browser.newPage()
    await ensureCompilationIsDone({ page, serverURL })
    await page.close()
  })

  describe('within form', () => {
    beforeEach(async ({ page }) => {
      await reInitializeDB({
        serverURL,
        snapshotKey: 'lexicalTest',
        uploadsDir: [path.resolve(dirname, './collections/Upload/uploads')],
      })
      const url = new AdminUrlUtil(serverURL, 'OnDemandForm')
      lexical = new LexicalHelpers(page)
      await page.goto(url.create)
      await lexical.editor.first().focus()
    })
    test('lexical is rendered on demand within form', async ({ page }) => {
      await page.keyboard.type('Hello')

      await saveDocAndAssert(page)
      await page.reload()

      const paragraph = lexical.editor.locator('> p')
      await expect(paragraph).toHaveText('Hello')
    })

    test('on-demand editor within form can render nested fields', async () => {
      await lexical.slashCommand('table', false)

      await expect(lexical.drawer.locator('#field-rows')).toHaveValue('5')
      await expect(lexical.drawer.locator('#field-columns')).toHaveValue('5')
    })
  })

  describe('outside form', () => {
    beforeEach(async ({ page }) => {
      await reInitializeDB({
        serverURL,
        snapshotKey: 'lexicalTest',
        uploadsDir: [path.resolve(dirname, './collections/Upload/uploads')],
      })
      const url = new AdminUrlUtil(serverURL, 'OnDemandOutsideForm')
      lexical = new LexicalHelpers(page)
      await page.goto(url.create)
      await lexical.editor.first().focus()
    })
    test('lexical is rendered on demand outside form', async ({ page }) => {
      await page.keyboard.type('Hello')

      const paragraph = lexical.editor.locator('> p')
      await expect(paragraph).toHaveText('Hellostate default')

      await saveDocAndAssert(page)
      await page.reload()

      const paragraphAfterSave = lexical.editor.locator('> p')
      await expect(paragraphAfterSave).not.toHaveText('Hellostate default') // Outside Form => Not Saved
    })

    test('lexical value can be controlled outside form', async ({ page }) => {
      await page.keyboard.type('Hello')

      const paragraph = lexical.editor.locator('> p')
      await expect(paragraph).toHaveText('Hellostate default')

      // Click button with text
      const button = page.getByRole('button', { name: 'Reset Editor State' })
      await button.click()

      await expect(paragraph).toHaveText('state default')
    })

    test('on-demand editor outside form can render nested fields', async () => {
      await lexical.slashCommand('table', false)

      await expect(lexical.drawer.locator('#field-rows')).toHaveValue('5')
      await expect(lexical.drawer.locator('#field-columns')).toHaveValue('5')
    })

    test('on-demand editor renders label', async ({ page }) => {
      await expect(page.locator('.field-label[for="field-myField"]')).toHaveText('My Label')
    })

    test('ensure anchor richText field is hidden', async ({ page }) => {
      // Important: Wait for all fields to render
      await wait(1000)
      await expect(page.locator('.shimmer')).toHaveCount(0)

      await expect(page.locator('.field-label[for="field-hiddenAnchor"]')).toHaveCount(0)

      await expect(page.locator('.rich-text-lexical')).toHaveCount(1)
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/lexical/collections/OnDemandForm/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const OnDemandForm: CollectionConfig = {
  slug: 'OnDemandForm',
  fields: [
    {
      name: 'json',
      type: 'json',
      admin: {
        components: {
          Field: './collections/OnDemandForm/Component.js#Component',
        },
      },
    },
  ],
}
```

--------------------------------------------------------------------------------

````
