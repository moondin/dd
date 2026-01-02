---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 92
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 92 of 695)

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

---[FILE: importmap.js]---
Location: payload-main/examples/live-preview/src/app/(payload)/admin/importmap.js

```javascript
import { RscEntrySlateCell as RscEntrySlateCell_0e78253914a550fdacd75626f1dabe17 } from '@payloadcms/richtext-slate/rsc'
import { RscEntrySlateField as RscEntrySlateField_0e78253914a550fdacd75626f1dabe17 } from '@payloadcms/richtext-slate/rsc'
import { BoldLeafButton as BoldLeafButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { BoldLeaf as BoldLeaf_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { CodeLeafButton as CodeLeafButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { CodeLeaf as CodeLeaf_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { ItalicLeafButton as ItalicLeafButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { ItalicLeaf as ItalicLeaf_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { StrikethroughLeafButton as StrikethroughLeafButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { StrikethroughLeaf as StrikethroughLeaf_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { UnderlineLeafButton as UnderlineLeafButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { UnderlineLeaf as UnderlineLeaf_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { BlockquoteElementButton as BlockquoteElementButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { BlockquoteElement as BlockquoteElement_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { H1ElementButton as H1ElementButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { Heading1Element as Heading1Element_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { H2ElementButton as H2ElementButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { Heading2Element as Heading2Element_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { H3ElementButton as H3ElementButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { Heading3Element as Heading3Element_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { H4ElementButton as H4ElementButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { Heading4Element as Heading4Element_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { H5ElementButton as H5ElementButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { Heading5Element as Heading5Element_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { H6ElementButton as H6ElementButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { Heading6Element as Heading6Element_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { IndentButton as IndentButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { IndentElement as IndentElement_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { ListItemElement as ListItemElement_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { LinkButton as LinkButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { LinkElement as LinkElement_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { WithLinks as WithLinks_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { OLElementButton as OLElementButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { OrderedListElement as OrderedListElement_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { RelationshipButton as RelationshipButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { RelationshipElement as RelationshipElement_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { WithRelationship as WithRelationship_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { TextAlignElementButton as TextAlignElementButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { ULElementButton as ULElementButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { UnorderedListElement as UnorderedListElement_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { UploadElementButton as UploadElementButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { UploadElement as UploadElement_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { WithUpload as WithUpload_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'

export const importMap = {
  '@payloadcms/richtext-slate/rsc#RscEntrySlateCell':
    RscEntrySlateCell_0e78253914a550fdacd75626f1dabe17,
  '@payloadcms/richtext-slate/rsc#RscEntrySlateField':
    RscEntrySlateField_0e78253914a550fdacd75626f1dabe17,
  '@payloadcms/richtext-slate/client#BoldLeafButton':
    BoldLeafButton_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#BoldLeaf': BoldLeaf_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#CodeLeafButton':
    CodeLeafButton_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#CodeLeaf': CodeLeaf_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#ItalicLeafButton':
    ItalicLeafButton_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#ItalicLeaf': ItalicLeaf_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#StrikethroughLeafButton':
    StrikethroughLeafButton_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#StrikethroughLeaf':
    StrikethroughLeaf_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#UnderlineLeafButton':
    UnderlineLeafButton_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#UnderlineLeaf': UnderlineLeaf_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#BlockquoteElementButton':
    BlockquoteElementButton_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#BlockquoteElement':
    BlockquoteElement_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#H1ElementButton':
    H1ElementButton_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#Heading1Element':
    Heading1Element_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#H2ElementButton':
    H2ElementButton_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#Heading2Element':
    Heading2Element_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#H3ElementButton':
    H3ElementButton_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#Heading3Element':
    Heading3Element_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#H4ElementButton':
    H4ElementButton_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#Heading4Element':
    Heading4Element_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#H5ElementButton':
    H5ElementButton_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#Heading5Element':
    Heading5Element_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#H6ElementButton':
    H6ElementButton_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#Heading6Element':
    Heading6Element_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#IndentButton': IndentButton_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#IndentElement': IndentElement_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#ListItemElement':
    ListItemElement_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#LinkButton': LinkButton_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#LinkElement': LinkElement_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#WithLinks': WithLinks_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#OLElementButton':
    OLElementButton_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#OrderedListElement':
    OrderedListElement_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#RelationshipButton':
    RelationshipButton_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#RelationshipElement':
    RelationshipElement_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#WithRelationship':
    WithRelationship_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#TextAlignElementButton':
    TextAlignElementButton_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#ULElementButton':
    ULElementButton_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#UnorderedListElement':
    UnorderedListElement_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#UploadElementButton':
    UploadElementButton_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#UploadElement': UploadElement_0b388c087d9de8c4f011dd323a130cfb,
  '@payloadcms/richtext-slate/client#WithUpload': WithUpload_0b388c087d9de8c4f011dd323a130cfb,
}
```

--------------------------------------------------------------------------------

---[FILE: not-found.tsx]---
Location: payload-main/examples/live-preview/src/app/(payload)/admin/[[...segments]]/not-found.tsx
Signals: Next.js

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'

import config from '@payload-config'
import { generatePageMetadata, NotFoundPage } from '@payloadcms/next/views'

import { importMap } from '../importMap'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const NotFound = ({ params, searchParams }: Args) =>
  NotFoundPage({ config, importMap, params, searchParams })

export default NotFound
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: payload-main/examples/live-preview/src/app/(payload)/admin/[[...segments]]/page.tsx
Signals: Next.js

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'

import config from '@payload-config'
import { generatePageMetadata, RootPage } from '@payloadcms/next/views'

import { importMap } from '../importMap'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const Page = ({ params, searchParams }: Args) =>
  RootPage({ config, importMap, params, searchParams })

export default Page
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: payload-main/examples/live-preview/src/app/(payload)/api/graphql/route.ts

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import { GRAPHQL_POST, REST_OPTIONS } from '@payloadcms/next/routes'

export const POST = GRAPHQL_POST(config)

export const OPTIONS = REST_OPTIONS(config)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: payload-main/examples/live-preview/src/app/(payload)/api/graphql-playground/route.ts

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import { GRAPHQL_PLAYGROUND_GET } from '@payloadcms/next/routes'

export const GET = GRAPHQL_PLAYGROUND_GET(config)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: payload-main/examples/live-preview/src/app/(payload)/api/[...slug]/route.ts

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import { REST_DELETE, REST_GET, REST_OPTIONS, REST_PATCH, REST_POST } from '@payloadcms/next/routes'

export const GET = REST_GET(config)
export const POST = REST_POST(config)
export const DELETE = REST_DELETE(config)
export const PATCH = REST_PATCH(config)
export const OPTIONS = REST_OPTIONS(config)
```

--------------------------------------------------------------------------------

---[FILE: Users.ts]---
Location: payload-main/examples/live-preview/src/collections/Users.ts

```typescript
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/examples/live-preview/src/collections/Pages/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import richText from '../../fields/richText'
import { loggedIn } from './access/loggedIn'
import { formatSlug } from './hooks/formatSlug'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    create: loggedIn,
    delete: loggedIn,
    read: () => true,
    update: loggedIn,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data }) => {
        const isHomePage = data.slug === 'home'
        return `${process.env.NEXT_PUBLIC_SERVER_URL}${!isHomePage ? `/${data.slug}` : ''}`
      },
    },
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [formatSlug('title')],
      },
      index: true,
      label: 'Slug',
    },
    richText(),
  ],
  versions: {
    drafts: {
      autosave: {
        interval: 375,
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: loggedIn.ts]---
Location: payload-main/examples/live-preview/src/collections/Pages/access/loggedIn.ts

```typescript
import type { Access } from 'payload'

export const loggedIn: Access = ({ req: { user } }) => {
  return Boolean(user)
}
```

--------------------------------------------------------------------------------

---[FILE: formatSlug.ts]---
Location: payload-main/examples/live-preview/src/collections/Pages/hooks/formatSlug.ts

```typescript
import type { FieldHook } from 'payload'

const format = (val: string): string =>
  val
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase()

export const formatSlug =
  (fallback: string): FieldHook =>
  ({ data, operation, originalDoc, value }) => {
    if (typeof value === 'string') {
      return format(value)
    }

    if (operation === 'create') {
      const fallbackData = data?.[fallback] || originalDoc?.[fallback]

      if (fallbackData && typeof fallbackData === 'string') {
        return format(fallbackData)
      }
    }

    return value
  }
```

--------------------------------------------------------------------------------

---[FILE: link.ts]---
Location: payload-main/examples/live-preview/src/fields/link.ts

```typescript
import type { Field } from 'payload'

import deepMerge from '../utilities/deepMerge'

export const appearanceOptions = {
  default: {
    label: 'Default',
    value: 'default',
  },
  primary: {
    label: 'Primary Button',
    value: 'primary',
  },
  secondary: {
    label: 'Secondary Button',
    value: 'secondary',
  },
}

export type LinkAppearances = 'default' | 'primary' | 'secondary'

type LinkType = (options?: {
  appearances?: false | LinkAppearances[]
  disableLabel?: boolean
  overrides?: Record<string, unknown>
}) => Field

const link: LinkType = ({ appearances, disableLabel = false, overrides = {} } = {}) => {
  const linkResult: Field = {
    name: 'link',
    type: 'group',
    admin: {
      hideGutter: true,
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'type',
            type: 'radio',
            admin: {
              layout: 'horizontal',
              width: '50%',
            },
            defaultValue: 'reference',
            options: [
              {
                label: 'Internal link',
                value: 'reference',
              },
              {
                label: 'Custom URL',
                value: 'custom',
              },
            ],
          },
          {
            name: 'newTab',
            type: 'checkbox',
            admin: {
              style: {
                alignSelf: 'flex-end',
              },
              width: '50%',
            },
            label: 'Open in new tab',
          },
        ],
      },
    ],
  }

  const linkTypes: Field[] = [
    {
      name: 'reference',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'reference',
      },
      label: 'Document to link to',
      maxDepth: 1,
      relationTo: ['pages'],
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'custom',
      },
      label: 'Custom URL',
      required: true,
    },
  ]

  if (!disableLabel) {
    if (linkTypes[0].admin) {
      linkTypes[0].admin.width = '50%'
    }
    if (linkTypes[1].admin) {
      linkTypes[1].admin.width = '50%'
    }

    linkResult.fields.push({
      type: 'row',
      fields: [
        ...linkTypes,
        {
          name: 'label',
          type: 'text',
          admin: {
            width: '50%',
          },
          label: 'Label',
          required: true,
        },
      ],
    })
  } else {
    linkResult.fields = [...linkResult.fields, ...linkTypes]
  }

  if (appearances !== false) {
    let appearanceOptionsToUse = [
      appearanceOptions.default,
      appearanceOptions.primary,
      appearanceOptions.secondary,
    ]

    if (appearances) {
      appearanceOptionsToUse = appearances.map((appearance) => appearanceOptions[appearance])
    }

    linkResult.fields.push({
      name: 'appearance',
      type: 'select',
      admin: {
        description: 'Choose how the link should be rendered.',
      },
      defaultValue: 'default',
      options: appearanceOptionsToUse,
    })
  }

  return deepMerge(linkResult, overrides)
}

export default link
```

--------------------------------------------------------------------------------

---[FILE: elements.ts]---
Location: payload-main/examples/live-preview/src/fields/richText/elements.ts

```typescript
import type { RichTextElement } from '@payloadcms/richtext-slate'

const elements: RichTextElement[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'link']

export default elements
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/examples/live-preview/src/fields/richText/index.ts

```typescript
import type { RichTextElement, RichTextLeaf } from '@payloadcms/richtext-slate'
import type { RichTextField } from 'payload'

import { slateEditor } from '@payloadcms/richtext-slate'

import deepMerge from '../../utilities/deepMerge'
import link from '../link'
import elements from './elements'
import leaves from './leaves'

type RichText = (
  overrides?: Partial<RichTextField>,
  additions?: {
    elements?: RichTextElement[]
    leaves?: RichTextLeaf[]
  },
) => RichTextField

const richText: RichText = (
  overrides = {},
  additions = {
    elements: [],
    leaves: [],
  },
) =>
  deepMerge<RichTextField, Partial<RichTextField>>(
    {
      name: 'richText',
      type: 'richText',
      editor: slateEditor({
        admin: {
          elements: [...elements, ...(additions.elements || [])],
          leaves: [...leaves, ...(additions.leaves || [])],
          upload: {
            collections: {
              media: {
                fields: [
                  {
                    name: 'caption',
                    type: 'richText',
                    editor: slateEditor({
                      admin: {
                        elements: [...elements],
                        leaves: [...leaves],
                      },
                    }),
                    label: 'Caption',
                  },
                  {
                    name: 'alignment',
                    type: 'radio',
                    label: 'Alignment',
                    options: [
                      {
                        label: 'Left',
                        value: 'left',
                      },
                      {
                        label: 'Center',
                        value: 'center',
                      },
                      {
                        label: 'Right',
                        value: 'right',
                      },
                    ],
                  },
                  {
                    name: 'enableLink',
                    type: 'checkbox',
                    label: 'Enable Link',
                  },
                  link({
                    appearances: false,
                    disableLabel: true,
                    overrides: {
                      admin: {
                        condition: (_: any, data: { enableLink: any }) => Boolean(data?.enableLink),
                      },
                    },
                  }),
                ],
              },
            },
          },
        },
      }),
      required: true,
    },
    overrides,
  )

export default richText
```

--------------------------------------------------------------------------------

---[FILE: leaves.ts]---
Location: payload-main/examples/live-preview/src/fields/richText/leaves.ts

```typescript
import type { RichTextLeaf } from '@payloadcms/richtext-slate'

const defaultLeaves: RichTextLeaf[] = ['bold', 'italic', 'underline']

export default defaultLeaves
```

--------------------------------------------------------------------------------

---[FILE: MainMenu.ts]---
Location: payload-main/examples/live-preview/src/globals/MainMenu.ts

```typescript
import type { GlobalConfig } from 'payload'

import link from '../fields/link'

export const MainMenu: GlobalConfig = {
  slug: 'main-menu',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: seed.ts]---
Location: payload-main/examples/live-preview/src/migrations/seed.ts

```typescript
import type { MigrateUpArgs } from '@payloadcms/db-mongodb'

import type { Page } from '../payload-types'
import { DefaultDocumentIDType } from 'payload'

export const home = (id: DefaultDocumentIDType): Partial<Page> => ({
  slug: 'home',
  richText: [
    {
      type: 'h1',
      children: [
        {
          text: 'Payload Live Preview Example',
        },
      ],
    },
    {
      children: [
        { text: 'This is a ' },
        {
          type: 'link',
          children: [{ text: 'Next.js' }],
          linkType: 'custom',
          newTab: true,
          url: 'https://nextjs.org',
        },
        { text: " app made explicitly for Payload's " },
        {
          type: 'link',
          children: [{ text: 'Live Preview Example' }],
          linkType: 'custom',
          newTab: true,
          url: 'https://github.com/payloadcms/payload/tree/master/examples/live-preview/payload',
        },
        { text: '. With ' },
        {
          type: 'link',
          children: [{ text: 'Live Preview' }],
          newTab: true,
          url: 'https://payloadcms.com/docs/live-preview/overview',
        },
        {
          text: ' you can edit this page in the admin panel and see the changes reflected here in real time.',
        },
        ...(id
          ? [
              {
                text: ' To get started, visit ',
              },
              {
                type: 'link',
                children: [{ text: 'this page' }],
                linkType: 'custom',
                newTab: true,
                url: `/admin/collections/pages/${id}/preview`,
              },
              { text: '.' },
            ]
          : []),
      ],
    },
  ],
  title: 'Home',
})

export const examplePage: Partial<Page> = {
  slug: 'example-page',
  richText: [
    {
      type: 'h1',
      children: [
        {
          text: 'Example Page',
        },
      ],
    },
    {
      children: [
        {
          text: 'This is an example page. You can edit this page in the Admin panel and see the changes reflected here in real time.',
        },
      ],
    },
  ],
  title: 'Example Page',
}

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await payload.create({
    collection: 'users',
    data: {
      email: 'demo@payloadcms.com',
      password: 'demo',
    },
  })

  const { id: examplePageID } = await payload.create({
    collection: 'pages',
    data: examplePage as any, // eslint-disable-line
  })

  const { id: ogHomePageID } = await payload.create({
    collection: 'pages',
    data: {
      title: 'Home',
      richText: [],
    },
  })

  const { id: homePageID } = await payload.update({
    id: ogHomePageID,
    collection: 'pages',
    data: home(ogHomePageID),
  })

  await payload.updateGlobal({
    slug: 'main-menu',
    data: {
      navItems: [
        {
          link: {
            type: 'reference',
            label: 'Home',
            reference: {
              relationTo: 'pages',
              value: homePageID,
            },
            url: '',
          },
        },
        {
          link: {
            type: 'reference',
            label: 'Example Page',
            reference: {
              relationTo: 'pages',
              value: examplePageID,
            },
            url: '',
          },
        },
        {
          link: {
            type: 'custom',
            label: 'Dashboard',
            reference: undefined,
            url: '/admin',
          },
        },
      ],
    },
  })
}
```

--------------------------------------------------------------------------------

---[FILE: deepMerge.ts]---
Location: payload-main/examples/live-preview/src/utilities/deepMerge.ts

```typescript
// @ts-nocheck

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item: unknown): boolean {
  return item && typeof item === 'object' && !Array.isArray(item)
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
// eslint-disable-next-line no-restricted-exports
export default function deepMerge<T, R>(target: T, source: R): T {
  const output = { ...target }
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] })
        } else {
          output[key] = deepMerge(target[key], source[key])
        }
      } else {
        Object.assign(output, { [key]: source[key] })
      }
    })
  }

  return output
}
```

--------------------------------------------------------------------------------

---[FILE: .env.example]---
Location: payload-main/examples/localization/.env.example

```text
# Database connection string
DATABASE_URI=mongodb://127.0.0.1/payload-template-website

# Used to encrypt JWT tokens
PAYLOAD_SECRET=YOUR_SECRET_HERE

# Used to format links and URLs
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Allow robots to index the site (optional)
NEXT_PUBLIC_IS_LIVE=

# Used to preview drafts
PAYLOAD_PUBLIC_DRAFT_SECRET=demo-draft-secret
NEXT_PRIVATE_DRAFT_SECRET=demo-draft-secret

# Used to revalidate static pages
REVALIDATION_KEY=demo-revalation-key
NEXT_PRIVATE_REVALIDATION_KEY=demo-revalation-key
```

--------------------------------------------------------------------------------

---[FILE: .eslintignore]---
Location: payload-main/examples/localization/.eslintignore

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
playwright.config.ts
jest.config.js
```

--------------------------------------------------------------------------------

---[FILE: .eslintrc.cjs]---
Location: payload-main/examples/localization/.eslintrc.cjs

```text
module.exports = {
  extends: 'next',
  root: true,
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
}
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/examples/localization/.gitignore

```text
build
dist / media
node_modules
.DS_Store
.env
.next
.vercel

# Payload default media upload directory
public/media/
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: payload-main/examples/localization/.prettierignore

```text
**/payload-types.ts
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
**/docs/**
tsconfig.json
```

--------------------------------------------------------------------------------

---[FILE: .prettierrc.json]---
Location: payload-main/examples/localization/.prettierrc.json

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "semi": false
}
```

--------------------------------------------------------------------------------

---[FILE: components.json]---
Location: payload-main/examples/localization/components.json

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/app/(frontend)/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/utilities/ui"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: docker-compose.yml]---
Location: payload-main/examples/localization/docker-compose.yml

```yaml
version: '3'

services:
  payload:
    image: node:18-alpine
    ports:
      - '3000:3000'
    volumes:
      - .:/home/node/app
      - node_modules:/home/node/app/node_modules
    working_dir: /home/node/app/
    command: sh -c "yarn install && yarn dev"
    depends_on:
      - mongo
    env_file:
      - .env

  mongo:
    image: mongo:latest
    ports:
      - '27017:27017'
    command:
      - --storageEngine=wiredTiger
    volumes:
      - data:/data/db
    logging:
      driver: none

volumes:
  data:
  node_modules:
```

--------------------------------------------------------------------------------

---[FILE: Dockerfile]---
Location: payload-main/examples/localization/Dockerfile

```text
FROM node:18.8-alpine as base

FROM base as builder

WORKDIR /home/node/app
COPY package*.json ./

COPY . .
RUN yarn install
RUN yarn build

FROM base as runtime

ENV NODE_ENV=production

WORKDIR /home/node/app
COPY package*.json  ./
COPY yarn.lock ./

RUN yarn install --production

EXPOSE 3000

CMD ["node", "dist/server.js"]
```

--------------------------------------------------------------------------------

---[FILE: next-env.d.ts]---
Location: payload-main/examples/localization/next-env.d.ts

```typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
```

--------------------------------------------------------------------------------

---[FILE: next.config.js]---
Location: payload-main/examples/localization/next.config.js

```javascript
import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL /* 'https://example.com' */].map((item) => {
        const url = new URL(item)

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        }
      }),
    ],
  },
  reactStrictMode: true,
  redirects,
}

export default withNextIntl(withPayload(nextConfig))
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: payload-main/examples/localization/package.json
Signals: React, Next.js

```json
{
  "name": "payload-localization-example",
  "version": "1.0.0",
  "description": "An example of how to use Payload's localization features",
  "type": "module",
  "scripts": {
    "build": "cross-env NODE_OPTIONS=--no-deprecation next build",
    "dev": "cross-env NODE_OPTIONS=--no-deprecation next dev",
    "dev:prod": "cross-env NODE_OPTIONS=--no-deprecation rm -rf .next && pnpm build && pnpm start",
    "generate:importmap": "cross-env NODE_OPTIONS=--no-deprecation payload generate:importmap",
    "generate:types": "cross-env NODE_OPTIONS=--no-deprecation payload generate:types",
    "ii": "cross-env NODE_OPTIONS=--no-deprecation pnpm --ignore-workspace install",
    "lint": "cross-env NODE_OPTIONS=--no-deprecation next lint",
    "lint:fix": "cross-env NODE_OPTIONS=--no-deprecation next lint --fix",
    "payload": "cross-env NODE_OPTIONS=--no-deprecation payload",
    "reinstall": "cross-env NODE_OPTIONS=--no-deprecation rm -rf node_modules && rm pnpm-lock.yaml && pnpm --ignore-workspace install",
    "start": "cross-env NODE_OPTIONS=--no-deprecation next start"
  },
  "dependencies": {
    "@payloadcms/db-mongodb": "latest",
    "@payloadcms/live-preview-react": "latest",
    "@payloadcms/next": "latest",
    "@payloadcms/payload-cloud": "latest",
    "@payloadcms/plugin-form-builder": "latest",
    "@payloadcms/plugin-nested-docs": "latest",
    "@payloadcms/plugin-redirects": "latest",
    "@payloadcms/plugin-search": "latest",
    "@payloadcms/plugin-seo": "latest",
    "@payloadcms/richtext-lexical": "latest",
    "@payloadcms/ui": "latest",
    "@radix-ui/react-checkbox": "^1.0.4",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-slot": "^1.0.2",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "cross-env": "^7.0.3",
    "geist": "^1.3.0",
    "graphql": "^16.8.2",
    "jsonwebtoken": "9.0.2",
    "lucide-react": "^0.378.0",
    "next": "^15.4.10",
    "next-intl": "^3.23.2",
    "payload": "latest",
    "prism-react-renderer": "^2.3.1",
    "react": "^19.2.1",
    "react-dom": "^19.2.1",
    "react-hook-form": "7.45.4",
    "sharp": "0.32.6",
    "tailwind-merge": "^2.3.0",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3.2.0",
    "@tailwindcss/typography": "^0.5.13",
    "@types/escape-html": "^1.0.2",
    "@types/jsonwebtoken": "^9.0.6",
    "@types/node": "22.5.4",
    "@types/react": "19.2.1",
    "@types/react-dom": "19.2.1",
    "autoprefixer": "^10.4.19",
    "copyfiles": "^2.4.1",
    "eslint": "^9.16.0",
    "eslint-config-next": "15.1.0",
    "postcss": "^8.4.38",
    "prettier": "^3.4.2",
    "tailwindcss": "^3.4.3",
    "typescript": "5.7.3"
  },
  "engines": {
    "node": "^18.20.2 || >=20.9.0"
  }
}
```

--------------------------------------------------------------------------------

````
