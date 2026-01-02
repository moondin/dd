---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 615
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 615 of 695)

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
Location: payload-main/test/live-preview/blocks/ArchiveBlock/index.ts

```typescript
import type { Block } from 'payload'

import { slateEditor } from '@payloadcms/richtext-slate'

export const Archive: Block = {
  slug: 'archive',
  labels: {
    singular: 'Archive',
    plural: 'Archives',
  },
  fields: [
    {
      name: 'introContent',
      label: 'Intro Content',
      type: 'richText',
      editor: slateEditor({}),
    },
    {
      name: 'populateBy',
      type: 'select',
      defaultValue: 'collection',
      options: [
        {
          label: 'Collection',
          value: 'collection',
        },
        {
          label: 'Individual Selection',
          value: 'selection',
        },
      ],
    },
    {
      type: 'select',
      name: 'relationTo',
      label: 'Collections To Show',
      defaultValue: 'posts',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
      },
      options: [
        {
          label: 'Posts',
          value: 'posts',
        },
      ],
    },
    {
      type: 'relationship',
      name: 'categories',
      label: 'Categories To Show',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
      },
    },
    {
      type: 'number',
      name: 'limit',
      label: 'Limit',
      defaultValue: 10,
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
        step: 1,
      },
    },
    {
      type: 'relationship',
      name: 'selectedDocs',
      label: 'Selection',
      relationTo: ['posts'],
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'selection',
      },
    },
    {
      type: 'relationship',
      name: 'populatedDocs',
      label: 'Populated Docs',
      relationTo: ['posts'],
      hasMany: true,
      admin: {
        disabled: true,
        description: 'This field is auto-populated after-read',
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
      },
    },
    {
      type: 'number',
      name: 'populatedDocsTotal',
      label: 'Populated Docs Total',
      admin: {
        step: 1,
        disabled: true,
        description: 'This field is auto-populated after-read',
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
      },
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/live-preview/blocks/CallToAction/index.ts

```typescript
import type { Block } from 'payload'

import { slateEditor } from '@payloadcms/richtext-slate'

import { invertBackground } from '../../fields/invertBackground.js'
import linkGroup from '../../fields/linkGroup.js'

export const CallToAction: Block = {
  slug: 'cta',
  labels: {
    singular: 'Call to Action',
    plural: 'Calls to Action',
  },
  fields: [
    invertBackground,
    {
      name: 'richText',
      label: 'Rich Text',
      type: 'richText',
      editor: slateEditor({}),
    },
    linkGroup({
      appearances: ['primary', 'secondary'],
      overrides: {
        maxRows: 2,
      },
    }),
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/live-preview/blocks/Content/index.ts

```typescript
import type { Block, Field } from 'payload'

import { slateEditor } from '@payloadcms/richtext-slate'

import { invertBackground } from '../../fields/invertBackground.js'
import link from '../../fields/link.js'

const columnFields: Field[] = [
  {
    name: 'size',
    type: 'select',
    defaultValue: 'oneThird',
    options: [
      {
        value: 'oneThird',
        label: 'One Third',
      },
      {
        value: 'half',
        label: 'Half',
      },
      {
        value: 'twoThirds',
        label: 'Two Thirds',
      },
      {
        value: 'full',
        label: 'Full',
      },
    ],
  },
  {
    name: 'richText',
    label: 'Rich Text',
    type: 'richText',
    editor: slateEditor({}),
  },
  {
    name: 'enableLink',
    type: 'checkbox',
  },
  link({
    overrides: {
      admin: {
        condition: (_, { enableLink }) => Boolean(enableLink),
      },
    },
  }),
]

export const Content: Block = {
  slug: 'content',
  fields: [
    invertBackground,
    {
      name: 'columns',
      type: 'array',
      fields: columnFields,
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/live-preview/blocks/MediaBlock/index.ts

```typescript
import type { Block } from 'payload'

import { invertBackground } from '../../fields/invertBackground.js'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  fields: [
    invertBackground,
    {
      name: 'position',
      type: 'select',
      defaultValue: 'default',
      options: [
        {
          label: 'Default',
          value: 'default',
        },
        {
          label: 'Fullscreen',
          value: 'fullscreen',
        },
      ],
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: Categories.ts]---
Location: payload-main/test/live-preview/collections/Categories.ts

```typescript
import type { CollectionConfig } from 'payload'

import { categoriesSlug } from '../shared.js'

export const Categories: CollectionConfig = {
  slug: categoriesSlug,
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
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: CollectionLevelConfig.ts]---
Location: payload-main/test/live-preview/collections/CollectionLevelConfig.ts

```typescript
import type { CollectionConfig } from 'payload'

import { collectionLevelConfigSlug } from '../shared.js'

export const CollectionLevelConfig: CollectionConfig = {
  slug: collectionLevelConfigSlug,
  admin: {
    description: "Live Preview is enabled on this collection's own config, not the root config.",
    useAsTitle: 'title',
    livePreview: {
      url: 'http://localhost:3000/live-preview',
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: ConditionalURL.ts]---
Location: payload-main/test/live-preview/collections/ConditionalURL.ts

```typescript
import type { CollectionConfig } from 'payload'

export const ConditionalURL: CollectionConfig = {
  slug: 'conditional-url',
  admin: {
    livePreview: {
      url: ({ data }) => (data?.enabled ? '/live-preview/static' : null),
    },
    preview: (doc) => {
      return doc?.enabled ? '/live-preview/static' : null
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'enabled',
      type: 'checkbox',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: CustomLivePreview.ts]---
Location: payload-main/test/live-preview/collections/CustomLivePreview.ts

```typescript
import type { CollectionConfig } from 'payload'

import { Archive } from '../blocks/ArchiveBlock/index.js'
import { CallToAction } from '../blocks/CallToAction/index.js'
import { Content } from '../blocks/Content/index.js'
import { MediaBlock } from '../blocks/MediaBlock/index.js'
import { hero } from '../fields/hero.js'
import { customLivePreviewSlug, mediaSlug, tenantsSlug } from '../shared.js'

export const CustomLivePreview: CollectionConfig = {
  slug: customLivePreviewSlug,
  labels: {
    singular: 'Custom Live Preview Page',
    plural: 'Custom Live Preview Pages',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['id', 'title', 'slug', 'createdAt'],
    preview: (doc) => `/live-preview/ssr/${doc?.slug}`,
    components: {
      views: {
        edit: {
          livePreview: {
            Component: '/components/CustomLivePreview.js#CustomLivePreview',
          },
        },
      },
    },
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: tenantsSlug,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [hero],
        },
        {
          label: 'Content',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [CallToAction, Content, MediaBlock, Archive],
            },
          ],
        },
      ],
    },
    {
      name: 'meta',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: mediaSlug,
        },
      ],
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: Media.ts]---
Location: payload-main/test/live-preview/collections/Media.ts

```typescript
import type { CollectionConfig } from 'payload'

import { mediaSlug } from '../shared.js'

export const Media: CollectionConfig = {
  slug: mediaSlug,
  upload: true,
  access: {
    read: () => true,
    create: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    // {
    //   name: 'caption',
    //   type: 'richText',
    // },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: Pages.ts]---
Location: payload-main/test/live-preview/collections/Pages.ts

```typescript
import type { CollectionConfig } from 'payload'

import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { slateEditor } from '@payloadcms/richtext-slate'

import { Archive } from '../blocks/ArchiveBlock/index.js'
import { CallToAction } from '../blocks/CallToAction/index.js'
import { Content } from '../blocks/Content/index.js'
import { MediaBlock } from '../blocks/MediaBlock/index.js'
import { hero } from '../fields/hero.js'
import { mediaSlug, pagesSlug, postsSlug, tenantsSlug } from '../shared.js'

export const Pages: CollectionConfig = {
  slug: pagesSlug,
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['id', 'title', 'slug', 'createdAt'],
    preview: (doc) => `/live-preview/${doc?.slug}`,
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      unique: true,
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: tenantsSlug,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [hero],
        },
        {
          label: 'Content',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [CallToAction, Content, MediaBlock, Archive],
            },
          ],
        },
        {
          label: 'Test',
          fields: [
            {
              name: 'localizedTitle',
              type: 'text',
              localized: true,
            },
            {
              name: 'relationToLocalized',
              type: 'relationship',
              relationTo: postsSlug,
            },
            {
              label: 'Rich Text — Slate',
              type: 'richText',
              name: 'richTextSlate',
              editor: slateEditor({}),
            },
            {
              label: 'Rich Text — Lexical',
              type: 'richText',
              name: 'richTextLexical',
              editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                  ...defaultFeatures,
                  BlocksFeature({ blocks: ['mediaBlock'] }),
                ],
              }),
            },
            {
              label: 'Rich Text — Lexical — Localized',
              type: 'richText',
              name: 'richTextLexicalLocalized',
              localized: true,
              editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                  ...defaultFeatures,
                  BlocksFeature({ blocks: ['mediaBlock'] }),
                ],
              }),
            },
            {
              name: 'relationshipAsUpload',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'relationshipMonoHasOne',
              type: 'relationship',
              relationTo: postsSlug,
            },
            {
              name: 'relationshipMonoHasMany',
              type: 'relationship',
              relationTo: postsSlug,
              hasMany: true,
            },
            {
              name: 'relationshipPolyHasOne',
              type: 'relationship',
              relationTo: [postsSlug],
            },
            {
              name: 'relationshipPolyHasMany',
              type: 'relationship',
              relationTo: [postsSlug],
              hasMany: true,
            },
            {
              name: 'arrayOfRelationships',
              type: 'array',
              fields: [
                {
                  name: 'uploadInArray',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'richTextInArray',
                  type: 'richText',
                },
                {
                  name: 'relationshipInArrayMonoHasOne',
                  type: 'relationship',
                  relationTo: postsSlug,
                },
                {
                  name: 'relationshipInArrayMonoHasMany',
                  type: 'relationship',
                  relationTo: postsSlug,
                  hasMany: true,
                },
                {
                  name: 'relationshipInArrayPolyHasOne',
                  type: 'relationship',
                  relationTo: [postsSlug],
                },
                {
                  name: 'relationshipInArrayPolyHasMany',
                  type: 'relationship',
                  relationTo: [postsSlug],
                  hasMany: true,
                },
              ],
            },
            {
              label: 'Named Tabs',
              type: 'tabs',
              tabs: [
                {
                  name: 'tab',
                  label: 'Tab',
                  fields: [
                    {
                      name: 'relationshipInTab',
                      type: 'relationship',
                      relationTo: postsSlug,
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
      name: 'meta',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: mediaSlug,
        },
      ],
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: Posts.ts]---
Location: payload-main/test/live-preview/collections/Posts.ts

```typescript
import type { CollectionConfig } from 'payload'

import { Archive } from '../blocks/ArchiveBlock/index.js'
import { CallToAction } from '../blocks/CallToAction/index.js'
import { Content } from '../blocks/Content/index.js'
import { MediaBlock } from '../blocks/MediaBlock/index.js'
import { hero } from '../fields/hero.js'
import { mediaSlug, postsSlug, tenantsSlug } from '../shared.js'

export const Posts: CollectionConfig = {
  slug: postsSlug,
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  trash: true,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['id', 'title', 'slug', 'createdAt'],
    preview: (doc) => `/live-preview/posts/${doc?.slug}`,
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: tenantsSlug,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [hero],
        },
        {
          label: 'Content',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [CallToAction, Content, MediaBlock, Archive],
            },
            {
              name: 'relatedPosts',
              type: 'relationship',
              relationTo: postsSlug,
              hasMany: true,
              filterOptions: ({ id }) => {
                return {
                  id: {
                    not_in: [id],
                  },
                }
              },
            },
          ],
        },
        {
          label: 'Test',
          fields: [
            {
              name: 'localizedTitle',
              type: 'text',
              localized: true,
            },
          ],
        },
      ],
    },
    {
      name: 'meta',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: mediaSlug,
        },
      ],
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: SSR.ts]---
Location: payload-main/test/live-preview/collections/SSR.ts

```typescript
import type { CollectionConfig } from 'payload'

import { Archive } from '../blocks/ArchiveBlock/index.js'
import { CallToAction } from '../blocks/CallToAction/index.js'
import { Content } from '../blocks/Content/index.js'
import { MediaBlock } from '../blocks/MediaBlock/index.js'
import { hero } from '../fields/hero.js'
import { mediaSlug, ssrPagesSlug, tenantsSlug } from '../shared.js'

export const SSR: CollectionConfig = {
  slug: ssrPagesSlug,
  labels: {
    singular: 'SSR Page',
    plural: 'SSR Pages',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['id', 'title', 'slug', 'createdAt'],
    preview: (doc) => `/live-preview/ssr/${doc?.slug}`,
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: tenantsSlug,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [hero],
        },
        {
          label: 'Content',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [CallToAction, Content, MediaBlock, Archive],
            },
          ],
        },
      ],
    },
    {
      name: 'meta',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: mediaSlug,
        },
      ],
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: SSRAutosave.ts]---
Location: payload-main/test/live-preview/collections/SSRAutosave.ts

```typescript
import type { CollectionConfig } from 'payload'

import { Archive } from '../blocks/ArchiveBlock/index.js'
import { CallToAction } from '../blocks/CallToAction/index.js'
import { Content } from '../blocks/Content/index.js'
import { MediaBlock } from '../blocks/MediaBlock/index.js'
import { hero } from '../fields/hero.js'
import { mediaSlug, ssrAutosavePagesSlug, tenantsSlug } from '../shared.js'

export const SSRAutosave: CollectionConfig = {
  slug: ssrAutosavePagesSlug,
  labels: {
    singular: 'SSR Autosave Page',
    plural: 'SSR Autosave Pages',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  versions: {
    drafts: {
      autosave: {
        interval: 375,
      },
    },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['id', 'title', 'slug', 'createdAt'],
    preview: (doc) => `/live-preview/ssr-autosave/${doc?.slug}`,
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: tenantsSlug,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [hero],
        },
        {
          label: 'Content',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [CallToAction, Content, MediaBlock, Archive],
            },
          ],
        },
      ],
    },
    {
      name: 'meta',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: mediaSlug,
        },
      ],
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: StaticURL.ts]---
Location: payload-main/test/live-preview/collections/StaticURL.ts

```typescript
import type { CollectionConfig } from 'payload'

export const StaticURLCollection: CollectionConfig = {
  slug: 'static-url',
  admin: {
    livePreview: {
      url: '/live-preview/static',
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: Tenants.ts]---
Location: payload-main/test/live-preview/collections/Tenants.ts

```typescript
import type { CollectionConfig } from 'payload'

import { tenantsSlug } from '../shared.js'

export const Tenants: CollectionConfig = {
  slug: tenantsSlug,
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['id', 'clientURL'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'clientURL',
      label: 'Client URL',
      type: 'text',
      required: true,
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: Users.ts]---
Location: payload-main/test/live-preview/collections/Users.ts

```typescript
import type { CollectionConfig } from 'payload'

import { usersSlug } from '../shared.js'

export const Users: CollectionConfig = {
  slug: usersSlug,
  auth: true,
  fields: [],
}
```

--------------------------------------------------------------------------------

---[FILE: CustomLivePreview.tsx]---
Location: payload-main/test/live-preview/components/CustomLivePreview.tsx

```typescript
'use client'
import { LivePreviewWindow, useDocumentInfo, useLivePreviewContext } from '@payloadcms/ui'

import './styles.css'

export function CustomLivePreview() {
  const { collectionSlug, globalSlug } = useDocumentInfo()
  const { isLivePreviewing, setURL, url } = useLivePreviewContext()

  return (
    <div
      className={[
        'custom-live-preview',
        isLivePreviewing && `custom-live-preview--is-live-previewing`,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {isLivePreviewing && (
        <>
          <p>Custom live preview being rendered</p>
          <LivePreviewWindow collectionSlug={collectionSlug} globalSlug={globalSlug} />
        </>
      )}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: styles.css]---
Location: payload-main/test/live-preview/components/styles.css

```text
.custom-live-preview {
  width: 80%;
  display: none;
  overflow: hidden;

  &.custom-live-preview--is-live-previewing {
    display: block;
  }

  .live-preview-window {
    width: 100%;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: hero.ts]---
Location: payload-main/test/live-preview/fields/hero.ts

```typescript
import type { Field } from 'payload'

import { slateEditor } from '@payloadcms/richtext-slate'

export const hero: Field = {
  name: 'hero',
  label: false,
  type: 'group',
  fields: [
    {
      type: 'select',
      name: 'type',
      label: 'Type',
      required: true,
      defaultValue: 'lowImpact',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
      ],
    },
    {
      name: 'richText',
      label: 'Rich Text',
      type: 'richText',
      editor: slateEditor({}),
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        condition: (_, { type } = {}) => ['highImpact'].includes(type),
      },
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: invertBackground.ts]---
Location: payload-main/test/live-preview/fields/invertBackground.ts

```typescript
import type { CheckboxField } from 'payload'

export const invertBackground: CheckboxField = {
  name: 'invertBackground',
  type: 'checkbox',
}
```

--------------------------------------------------------------------------------

---[FILE: link.ts]---
Location: payload-main/test/live-preview/fields/link.ts

```typescript
import type { Field } from 'payload'

import { pagesSlug, postsSlug } from '../shared.js'
import deepMerge from '../utilities/deepMerge.js'

export const appearanceOptions = {
  primary: {
    label: 'Primary Button',
    value: 'primary',
  },
  secondary: {
    label: 'Secondary Button',
    value: 'secondary',
  },
  default: {
    label: 'Default',
    value: 'default',
  },
}

export type LinkAppearances = 'default' | 'primary' | 'secondary'

type LinkType = (options?: {
  appearances?: LinkAppearances[] | false
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
            defaultValue: 'reference',
            admin: {
              layout: 'horizontal',
              width: '50%',
            },
          },
          {
            name: 'newTab',
            label: 'Open in new tab',
            type: 'checkbox',
            admin: {
              width: '50%',
              style: {
                alignSelf: 'flex-end',
              },
            },
          },
        ],
      },
    ],
  }

  const linkTypes: Field[] = [
    {
      name: 'reference',
      label: 'Document to link to',
      type: 'relationship',
      relationTo: [postsSlug, pagesSlug],
      required: true,
      maxDepth: 1,
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'reference',
      },
    },
    {
      name: 'url',
      label: 'Custom URL',
      type: 'text',
      required: true,
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'custom',
      },
    },
  ]

  if (!disableLabel) {
    linkTypes.map((linkType) => ({
      ...linkType,
      admin: {
        ...linkType.admin,
        width: '50%',
      },
    }))

    linkResult.fields.push({
      type: 'row',
      fields: [
        ...linkTypes,
        {
          name: 'label',
          label: 'Label',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          },
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
      defaultValue: appearanceOptionsToUse[0].value,
      options: appearanceOptionsToUse,
      admin: {
        description: 'Choose how the link should be rendered.',
      },
    })
  }

  return deepMerge(linkResult, overrides)
}

export default link
```

--------------------------------------------------------------------------------

---[FILE: linkGroup.ts]---
Location: payload-main/test/live-preview/fields/linkGroup.ts

```typescript
import type { ArrayField, Field } from 'payload'

import type { LinkAppearances } from './link.js'

import deepMerge from '../utilities/deepMerge.js'
import link from './link.js'

type LinkGroupType = (options?: {
  appearances?: LinkAppearances[] | false
  overrides?: Partial<ArrayField>
}) => Field

const linkGroup: LinkGroupType = ({ overrides = {}, appearances } = {}) => {
  const generatedLinkGroup: Field = {
    name: 'links',
    type: 'array',
    fields: [
      link({
        appearances,
      }),
    ],
  }

  return deepMerge(generatedLinkGroup, overrides)
}

export default linkGroup
```

--------------------------------------------------------------------------------

---[FILE: Footer.ts]---
Location: payload-main/test/live-preview/globals/Footer.ts

```typescript
import type { GlobalConfig } from 'payload'

import link from '../fields/link.js'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      maxRows: 6,
      fields: [link()],
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: Header.ts]---
Location: payload-main/test/live-preview/globals/Header.ts

```typescript
import type { GlobalConfig } from 'payload'

import link from '../fields/link.js'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      maxRows: 6,
      fields: [link()],
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: mockFSModule.js]---
Location: payload-main/test/live-preview/mocks/mockFSModule.js

```javascript
export default {
  readdirSync: () => {},
  rmSync: () => {},
}
```

--------------------------------------------------------------------------------

---[FILE: next-env.d.ts]---
Location: payload-main/test/live-preview/prod/next-env.d.ts

```typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/building-your-application/configuring/typescript for more information.
```

--------------------------------------------------------------------------------

---[FILE: next.config.mjs]---
Location: payload-main/test/live-preview/prod/next.config.mjs

```text
import nextConfig from '../../../next.config.mjs'

import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

export default {
  ...nextConfig,
  env: {
    PAYLOAD_CORE_DEV: 'true',
    ROOT_DIR: path.resolve(dirname),
  },
}
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/test/live-preview/prod/tsconfig.json
Signals: Next.js

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@payload-config": ["../config.ts"],
      "@payloadcms/ui/assets": ["../../../packages/ui/src/assets/index.ts"],
      "@payloadcms/ui/elements/*": ["../../../packages/ui/src/elements/*/index.tsx"],
      "@payloadcms/ui/fields/*": ["../../../packages/ui/src/fields/*/index.tsx"],
      "@payloadcms/ui/forms/*": ["../../../packages/ui/src/forms/*/index.tsx"],
      "@payloadcms/ui/graphics/*": ["../../../packages/ui/src/graphics/*/index.tsx"],
      "@payloadcms/ui/hooks/*": ["../../../packages/ui/src/hooks/*.ts"],
      "@payloadcms/ui/icons/*": ["../../../packages/ui/src/icons/*/index.tsx"],
      "@payloadcms/ui/providers/*": ["../../../packages/ui/src/providers/*/index.tsx"],
      "@payloadcms/ui/templates/*": ["../../../packages/ui/src/templates/*/index.tsx"],
      "@payloadcms/ui/utilities/*": ["../../../packages/ui/src/utilities/*.ts"],
      "@payloadcms/ui/scss": ["../../../packages/ui/src/scss.scss"],
      "@payloadcms/ui/scss/app.scss": ["../../../packages/ui/src/scss/app.scss"],
      "payload/types": ["../../../packages/payload/src/exports/types.ts"],
      "@payloadcms/next/*": ["../../../packages/next/src/*"],
      "@payloadcms/next": ["../../../packages/next/src/exports/*"]
    }
  },
  "include": ["next-env.d.ts", ".next/types/**/*.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

--------------------------------------------------------------------------------

---[FILE: custom.scss]---
Location: payload-main/test/live-preview/prod/app/(payload)/custom.scss

```text
#custom-css {
  font-family: monospace;
}

#custom-css::after {
  content: 'custom-css';
}
```

--------------------------------------------------------------------------------

---[FILE: layout.tsx]---
Location: payload-main/test/live-preview/prod/app/(payload)/layout.tsx
Signals: React

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { ServerFunctionClient } from 'payload'

import config from '@payload-config'
import '@payloadcms/next/css'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import React from 'react'

import { importMap } from './admin/importMap.js'
import './custom.scss'

type Args = {
  children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
)

export default Layout
```

--------------------------------------------------------------------------------

````
