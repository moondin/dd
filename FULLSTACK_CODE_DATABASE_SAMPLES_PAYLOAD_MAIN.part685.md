---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 685
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 685 of 695)

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

---[FILE: generateLexicalData.ts]---
Location: payload-main/test/versions/collections/Diff/generateLexicalData.ts

```typescript
import type { DefaultTypedEditorState, SerializedBlockNode } from '@payloadcms/richtext-lexical'

import { mediaCollectionSlug, textCollectionSlug } from '../../slugs.js'

export function generateLexicalData(args: {
  mediaID: number | string
  textID: number | string
  updated: boolean
}): DefaultTypedEditorState {
  return {
    root: {
      children: [
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: `Fugiat esse${args.updated ? ' new ' : ''}in dolor aleiqua ${args.updated ? 'gillum' : 'cillum'} proident ad cillum excepteur mollit reprehenderit mollit commodo. Pariatur incididunt non exercitation est mollit nisi labore${args.updated ? ' ' : 'delete'}officia cupidatat amet commodo commodo proident occaecat.`,
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
          textStyle: '',
        },
        {
          children: [
            {
              detail: 0,
              format: args.updated ? 1 : 0,
              mode: 'normal',
              style: '',
              text: 'Some ',
              type: 'text',
              version: 1,
            },
            {
              detail: 0,
              format: args.updated ? 0 : 1,
              mode: 'normal',
              style: '',
              text: 'Bold',
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
              format: 1,
              mode: 'normal',
              style: '',
              text: 'Italic',
              type: 'text',
              version: 1,
            },
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: ' text with ',
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
                  text: 'a link',
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
                url: args.updated ? 'https://www.payloadcms.com' : 'https://www.google.com',
                newTab: true,
                linkType: 'custom',
              },
              id: '67d869aa706b36f346ecffd9',
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
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'another link',
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
                url: 'https://www.payload.ai',
                newTab: args.updated ? true : false,
                linkType: 'custom',
              },
              id: '67d869aa706b36f346ecffd0',
            },
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: ' text ',
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
                  text: args.updated ? 'third link updated' : 'third link',
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
                url: 'https://www.payloadcms.com/docs',
                newTab: true,
                linkType: 'custom',
              },
              id: '67d869aa706b36f346ecffd0',
            },
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: '.',
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
                  text: 'link with description',
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
                url: 'https://www.payloadcms.com/docs',
                description: args.updated ? 'updated description' : 'description',
                newTab: true,
                linkType: 'custom',
              },
              id: '67d869aa706b36f346ecffd0',
            },
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'text',
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
                  text: 'identical link',
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
                url: 'https://www.payloadcms.com/docs2',
                description: 'description',
                newTab: true,
                linkType: 'custom',
              },
              id: '67d869aa706b36f346ecffd0',
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
        {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'One',
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
                  text: args.updated ? 'Two updated' : 'Two',
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
                  text: 'Three',
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
            ...(args.updated
              ? [
                  {
                    children: [
                      {
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: 'Four',
                        type: 'text',
                        version: 1,
                      },
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    type: 'listitem',
                    version: 1,
                    value: 4,
                  },
                ]
              : []),
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
                  text: 'One',
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
                  text: 'Two',
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
                  text: args.updated ? 'Three' : 'Three original',
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
                  text: 'Checked',
                  type: 'text',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              type: 'listitem',
              version: 1,
              checked: true,
              value: 1,
            },
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Unchecked',
                  type: 'text',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              type: 'listitem',
              version: 1,
              checked: args.updated ? false : true,
              value: 2,
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
              text: `Heading1${args.updated ? ' updated' : ''}`,
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
              text: `Heading2${args.updated ? ' updated' : ''}`,
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
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: `Heading3${args.updated ? ' updated' : ''}`,
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'heading',
          version: 1,
          tag: 'h3',
        },
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: `Heading4${args.updated ? ' updated' : ''}`,
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'heading',
          version: 1,
          tag: 'h4',
        },
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: `Heading5${args.updated ? ' updated' : ''}`,
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'heading',
          version: 1,
          tag: 'h5',
        },
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: `Heading6${args.updated ? ' updated' : ''}`,
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'heading',
          version: 1,
          tag: 'h6',
        },
        {
          type: 'upload',
          version: 3,
          format: '',
          id: '67d8693c76b36f346ecffd8',
          relationTo: mediaCollectionSlug,
          value: args.mediaID,
        },
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: `Quote${args.updated ? ' updated' : ''}`,
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
          type: 'relationship',
          version: 2,
          format: '',
          relationTo: textCollectionSlug,
          value: args.textID,
        },
        {
          type: 'block',
          version: 2,
          format: '',
          fields: {
            id: '67d8693c706b36f346ecffd7',
            radios: args.updated ? 'option1' : 'option3',
            someText: `Text1${args.updated ? ' updated' : ''}`,
            blockName: '',
            someTextRequired: 'Text2',
            blockType: 'myBlock',
          },
        } as SerializedBlockNode,
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/versions/collections/Diff/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { diffCollectionSlug, draftCollectionSlug } from '../../slugs.js'

export const Diff: CollectionConfig = {
  slug: diffCollectionSlug,
  fields: [
    {
      name: 'array',
      type: 'array',
      fields: [
        {
          name: 'textInArray',
          type: 'text',
        },
      ],
    },
    {
      name: 'arrayLocalized',
      type: 'array',
      localized: true,
      fields: [
        {
          name: 'textInArrayLocalized',
          type: 'text',
        },
      ],
    },
    {
      name: 'blocks',
      type: 'blocks',
      blocks: [
        {
          slug: 'TextBlock',
          fields: [
            {
              name: 'textInBlock',
              type: 'text',
            },
          ],
        },
        {
          slug: 'CollapsibleBlock',
          fields: [
            {
              type: 'collapsible',
              label: 'Collapsible',
              fields: [
                {
                  type: 'collapsible',
                  label: 'Nested Collapsible',
                  fields: [
                    {
                      name: 'textInCollapsibleInCollapsibleBlock',
                      type: 'text',
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'textInRowInCollapsibleBlock',
                      type: 'text',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          slug: 'TabsBlock',
          fields: [
            {
              type: 'tabs',
              tabs: [
                {
                  name: 'namedTab1InBlock',
                  fields: [
                    {
                      name: 'textInNamedTab1InBlock',
                      type: 'text',
                    },
                  ],
                },
                {
                  label: 'Unnamed Tab 2 In Block',
                  fields: [
                    {
                      name: 'textInUnnamedTab2InBlock',
                      type: 'text',
                    },
                    {
                      name: 'textInUnnamedTab2InBlockAccessFalse',
                      type: 'text',
                      access: {
                        read: () => false,
                      },
                    },
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'textInRowInUnnamedTab2InBlock',
                          type: 'text',
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
    },
    {
      type: 'checkbox',
      name: 'checkbox',
    },
    {
      type: 'code',
      name: 'code',
    },
    {
      type: 'collapsible',
      label: 'Collapsible',
      fields: [
        {
          name: 'textInCollapsible',
          type: 'text',
        },
      ],
    },
    {
      type: 'date',
      name: 'date',
    },
    {
      type: 'email',
      name: 'email',
    },
    {
      type: 'group',
      name: 'group',
      fields: [
        {
          name: 'textInGroup',
          type: 'text',
        },
      ],
    },
    {
      type: 'group',
      fields: [
        {
          name: 'textInUnnamedGroup',
          type: 'text',
        },
      ],
    },
    {
      type: 'group',
      label: 'Unnamed Labeled Group',
      fields: [
        {
          name: 'textInUnnamedLabeledGroup',
          type: 'text',
        },
      ],
    },
    {
      type: 'number',
      name: 'number',
    },
    {
      type: 'point',
      name: 'point',
    },
    {
      type: 'json',
      name: 'json',
    },
    {
      type: 'radio',
      name: 'radio',
      options: [
        {
          label: 'Option 1',
          value: 'option1',
        },
        {
          label: 'Option 2',
          value: 'option2',
        },
      ],
    },
    {
      type: 'relationship',
      name: 'relationship',
      relationTo: draftCollectionSlug,
    },
    {
      type: 'relationship',
      name: 'relationshipHasMany',
      hasMany: true,
      relationTo: draftCollectionSlug,
    },
    {
      type: 'relationship',
      name: 'relationshipPolymorphic',
      relationTo: [draftCollectionSlug, 'text'],
    },
    {
      type: 'relationship',
      name: 'relationshipHasManyPolymorphic',
      hasMany: true,
      relationTo: [draftCollectionSlug, 'text'],
    },
    {
      type: 'relationship',
      name: 'relationshipHasManyPolymorphic2',
      hasMany: true,
      relationTo: [draftCollectionSlug, 'text'],
    },
    {
      name: 'richtext',
      type: 'richText',
    },
    {
      name: 'richtextWithCustomDiff',
      type: 'richText',
      admin: {
        components: {
          Diff: './elements/RichTextDiffComponent/index.js#RichTextDiffComponent',
        },
      },
    },
    {
      fields: [
        {
          name: 'textInRow',
          type: 'text',
        },
      ],
      type: 'row',
    },
    {
      name: 'textCannotRead',
      type: 'text',
      access: {
        read: () => false,
      },
    },
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
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          name: 'namedTab1',
          fields: [
            {
              name: 'textInNamedTab1',
              type: 'text',
            },
            {
              name: 'textInNamedTab1ReadFalse',
              type: 'text',
              access: {
                read: () => false,
              },
            },
            {
              name: 'textInNamedTab1UpdateFalse',
              type: 'text',
              access: {
                update: () => false,
              },
            },
          ],
        },
        {
          label: 'Unnamed Tab 2',
          fields: [
            {
              name: 'textInUnnamedTab2',
              type: 'text',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'textInRowInUnnamedTab',
                  type: 'text',
                },
                {
                  name: 'textInRowInUnnamedTabUpdateFalse',
                  type: 'text',
                  access: {
                    update: () => false,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'text',
      type: 'text',
    },
    {
      name: 'textArea',
      type: 'textarea',
    },
    {
      name: 'upload',
      relationTo: 'media',
      type: 'upload',
    },
    {
      name: 'uploadHasMany',
      hasMany: true,
      relationTo: 'media',
      type: 'upload',
    },
  ],
  versions: {
    drafts: true,
    maxPerDoc: 35,
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/versions/elements/CollectionVersionButton/index.tsx
Signals: React

```typescript
import React from 'react'

const baseClass = 'collection-version-button'

const CollectionVersionButton: React.FC = () => {
  return (
    <div
      className={baseClass}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'calc(var(--base) / 4)',
      }}
    >
      <p className="nav__label" style={{ color: 'var(--theme-text)', margin: 0 }}>
        Collection Version Button
      </p>
    </div>
  )
}

export default CollectionVersionButton
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/versions/elements/CollectionVersionsButton/index.tsx
Signals: React

```typescript
import React from 'react'

const baseClass = 'collection-versions-button'

const CollectionVersionsButton: React.FC = () => {
  return (
    <div
      className={baseClass}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'calc(var(--base) / 4)',
      }}
    >
      <p className="nav__label" style={{ color: 'var(--theme-text)', margin: 0 }}>
        Collection Versions Button
      </p>
    </div>
  )
}

export default CollectionVersionsButton
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/versions/elements/CustomFieldLabel/index.tsx

```typescript
'use client'
import { useDocumentInfo } from '@payloadcms/ui'

export const CustomFieldLabel = () => {
  const { data } = useDocumentInfo()

  return (
    <p id="custom-field-label">{`Value in DocumentInfoContext: ${data?.relationship || '<No value>'}`}</p>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/test/versions/elements/CustomSaveButton/index.module.scss

```text
.customButton {
  :global(.btn) {
    background-color: var(--theme-success-150);
    color: var(--theme-success-750);

    &:hover {
      background-color: var(--theme-success-100) !important;
    }

    &:disabled {
      background-color: var(--theme-success-100);
      color: var(--theme-success-750);
    }
  }

  :global(.popup-button) {
    background-color: var(--theme-success-150);
    color: var(--theme-success-750);

    &:hover {
      background-color: var(--theme-success-100) !important;
    }

    &:disabled {
      background-color: var(--theme-success-100);
      color: var(--theme-success-750);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/versions/elements/CustomSaveButton/index.tsx
Signals: React

```typescript
'use client'
import { PublishButton } from '@payloadcms/ui'
import * as React from 'react'

import classes from './index.module.scss'

export function CustomPublishButton() {
  return (
    <div className={classes.customButton}>
      <PublishButton />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/versions/elements/GlobalVersionButton/index.tsx
Signals: React

```typescript
import React from 'react'

const baseClass = 'global-version-button'

const GlobalVersionButton: React.FC = () => {
  return (
    <div
      className={baseClass}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'calc(var(--base) / 4)',
      }}
    >
      <p className="nav__label" style={{ color: 'var(--theme-text)', margin: 0 }}>
        Global Version Button
      </p>
    </div>
  )
}

export default GlobalVersionButton
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/versions/elements/GlobalVersionsButton/index.tsx
Signals: React

```typescript
import React from 'react'

const baseClass = 'global-versions-button'

const GlobalVersionsButton: React.FC = () => {
  return (
    <div
      className={baseClass}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'calc(var(--base) / 4)',
      }}
    >
      <p className="nav__label" style={{ color: 'var(--theme-text)', margin: 0 }}>
        Global Versions Button
      </p>
    </div>
  )
}

export default GlobalVersionsButton
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/versions/elements/RichTextDiffComponent/index.tsx

```typescript
import type { RichTextFieldDiffServerComponent } from 'payload'

export const RichTextDiffComponent: RichTextFieldDiffServerComponent = () => {
  return <p>Test</p>
}
```

--------------------------------------------------------------------------------

---[FILE: Autosave.ts]---
Location: payload-main/test/versions/globals/Autosave.ts

```typescript
import type { GlobalConfig } from 'payload'

import { autoSaveGlobalSlug } from '../slugs.js'

const AutosaveGlobal: GlobalConfig = {
  slug: autoSaveGlobalSlug,
  access: {
    read: ({ req: { user } }) => {
      if (user) {
        return true
      }

      return {
        or: [
          {
            _status: {
              equals: 'published',
            },
          },
          {
            _status: {
              exists: false,
            },
          },
        ],
      }
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
    },
  ],
  label: 'Autosave Global',
  versions: {
    drafts: {
      autosave: true,
    },
    max: 20,
  },
}

export default AutosaveGlobal
```

--------------------------------------------------------------------------------

---[FILE: AutosaveWithDraftButton.ts]---
Location: payload-main/test/versions/globals/AutosaveWithDraftButton.ts

```typescript
import type { GlobalConfig } from 'payload'

import { autosaveWithDraftButtonGlobal } from '../slugs.js'

const AutosaveWithDraftButtonGlobal: GlobalConfig = {
  slug: autosaveWithDraftButtonGlobal,
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
    },
  ],
  label: 'Autosave with Draft Button Global',
  versions: {
    drafts: {
      autosave: {
        showSaveDraftButton: true,
        interval: 1000,
      },
    },
  },
}

export default AutosaveWithDraftButtonGlobal
```

--------------------------------------------------------------------------------

---[FILE: DisablePublish.ts]---
Location: payload-main/test/versions/globals/DisablePublish.ts

```typescript
import type { GlobalConfig } from 'payload'

import { disablePublishGlobalSlug } from '../slugs.js'

const DisablePublishGlobal: GlobalConfig = {
  slug: disablePublishGlobalSlug,
  access: {
    update: ({ data }) => {
      return data?._status !== 'published'
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
  ],
  versions: {
    drafts: true,
  },
}

export default DisablePublishGlobal
```

--------------------------------------------------------------------------------

---[FILE: Draft.ts]---
Location: payload-main/test/versions/globals/Draft.ts

```typescript
import type { GlobalConfig } from 'payload'

import { draftGlobalSlug } from '../slugs.js'

const DraftGlobal: GlobalConfig = {
  slug: draftGlobalSlug,
  label: 'Draft Global',
  admin: {
    preview: () => 'https://payloadcms.com',
    components: {
      views: {
        edit: {
          version: {
            actions: ['/elements/GlobalVersionButton/index.js'],
          },
          versions: {
            actions: ['/elements/GlobalVersionsButton/index.js'],
          },
        },
      },
    },
  },
  versions: {
    max: 20,
    drafts: {
      schedulePublish: true,
    },
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) {
        return true
      }

      return {
        or: [
          {
            _status: {
              equals: 'published',
            },
          },
          {
            _status: {
              exists: false,
            },
          },
        ],
      }
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
  ],
}

export default DraftGlobal
```

--------------------------------------------------------------------------------

---[FILE: DraftUnlimited.ts]---
Location: payload-main/test/versions/globals/DraftUnlimited.ts

```typescript
import type { GlobalConfig } from 'payload'

import { draftUnlimitedGlobalSlug } from '../slugs.js'

const DraftUnlimitedGlobal: GlobalConfig = {
  slug: draftUnlimitedGlobalSlug,
  label: 'Draft Unlimited Global',
  admin: {
    preview: () => 'https://payloadcms.com',
    components: {
      views: {
        edit: {
          version: {
            actions: ['/elements/GlobalVersionButton/index.js'],
          },
          versions: {
            actions: ['/elements/GlobalVersionsButton/index.js'],
          },
        },
      },
    },
  },
  versions: {
    max: 0,
    drafts: {
      schedulePublish: true,
    },
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) {
        return true
      }

      return {
        or: [
          {
            _status: {
              equals: 'published',
            },
          },
          {
            _status: {
              exists: false,
            },
          },
        ],
      }
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
  ],
}

export default DraftUnlimitedGlobal
```

--------------------------------------------------------------------------------

---[FILE: DraftWithMax.ts]---
Location: payload-main/test/versions/globals/DraftWithMax.ts

```typescript
import type { GlobalConfig } from 'payload'

import { draftWithMaxGlobalSlug } from '../slugs.js'

const DraftWithMaxGlobal: GlobalConfig = {
  slug: draftWithMaxGlobalSlug,
  label: 'Draft with Max Global',
  admin: {
    components: {
      views: {
        edit: {
          version: {
            actions: ['/elements/GlobalVersionButton/index.js'],
          },
          versions: {
            actions: ['/elements/GlobalVersionsButton/index.js'],
          },
        },
      },
    },
  },
  versions: {
    max: 1,
    drafts: true,
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) {
        return true
      }

      return {
        or: [
          {
            _status: {
              equals: 'published',
            },
          },
          {
            _status: {
              exists: false,
            },
          },
        ],
      }
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
  ],
}

export default DraftWithMaxGlobal
```

--------------------------------------------------------------------------------

---[FILE: LocalizedGlobal.ts]---
Location: payload-main/test/versions/globals/LocalizedGlobal.ts

```typescript
import type { GlobalConfig } from 'payload'

import { localizedGlobalSlug } from '../slugs.js'

const LocalizedGlobal: GlobalConfig = {
  slug: localizedGlobalSlug,
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
    },
    {
      name: 'content',
      type: 'text',
      localized: true,
    },
  ],
  versions: {
    drafts: true,
  },
}

export default LocalizedGlobal
```

--------------------------------------------------------------------------------

---[FILE: MaxVersions.ts]---
Location: payload-main/test/versions/globals/MaxVersions.ts

```typescript
import type { GlobalConfig } from 'payload'

export const MaxVersions: GlobalConfig = {
  slug: 'max-versions',
  fields: [
    {
      name: 'title',
      type: 'text',
    },
  ],
  versions: {
    max: 2,
    drafts: true,
  },
}
```

--------------------------------------------------------------------------------

---[FILE: emptyModule.js]---
Location: payload-main/test/versions/mocks/emptyModule.js

```javascript
export default {}
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/test/_community/.gitignore

```text
/media
/media-gif
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: payload-main/test/_community/config.ts

```typescript
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { fileURLToPath } from 'node:url'
import path from 'path'

import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import { devUser } from '../credentials.js'
import { MediaCollection } from './collections/Media/index.js'
import { PostsCollection, postsSlug } from './collections/Posts/index.js'
import { MenuGlobal } from './globals/Menu/index.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfigWithDefaults({
  // ...extend config here
  collections: [PostsCollection, MediaCollection],
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  editor: lexicalEditor({}),
  globals: [
    // ...add more globals here
    MenuGlobal,
  ],
  onInit: async (payload) => {
    await payload.create({
      collection: 'users',
      data: {
        email: devUser.email,
        password: devUser.password,
      },
    })

    await payload.create({
      collection: postsSlug,
      data: {
        title: 'example post',
      },
    })
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
```

--------------------------------------------------------------------------------

---[FILE: e2e.spec.ts]---
Location: payload-main/test/_community/e2e.spec.ts

```typescript
import type { Page } from '@playwright/test'

import { expect, test } from '@playwright/test'
import * as path from 'path'
import { fileURLToPath } from 'url'

import { ensureCompilationIsDone, initPageConsoleErrorCatch } from '../helpers.js'
import { AdminUrlUtil } from '../helpers/adminUrlUtil.js'
import { initPayloadE2ENoConfig } from '../helpers/initPayloadE2ENoConfig.js'
import { TEST_TIMEOUT_LONG } from '../playwright.config.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

test.describe('Community', () => {
  let page: Page
  let url: AdminUrlUtil

  test.beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)

    const { payload, serverURL } = await initPayloadE2ENoConfig({ dirname })
    url = new AdminUrlUtil(serverURL, 'posts')

    const context = await browser.newContext()
    page = await context.newPage()
    initPageConsoleErrorCatch(page)
    await ensureCompilationIsDone({ page, serverURL })
  })

  test('example test', async () => {
    await page.goto(url.list)

    const textCell = page.locator('.row-1 .cell-title')
    await expect(textCell).toHaveText('example post')
  })
})
```

--------------------------------------------------------------------------------

````
