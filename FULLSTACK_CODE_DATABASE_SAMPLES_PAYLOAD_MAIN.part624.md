---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 624
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 624 of 695)

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

---[FILE: shared.ts]---
Location: payload-main/test/localization/shared.ts

```typescript
export const englishTitle = 'english'
export const spanishTitle = 'spanish'
export const relationEnglishTitle = 'english-relation'
export const relationSpanishTitle = 'spanish-relation'
export const relationEnglishTitle2 = `${relationEnglishTitle}2`
export const relationSpanishTitle2 = `${relationSpanishTitle}2`

export const defaultLocale = 'en'
export const spanishLocale = 'es'
export const portugueseLocale = 'pt'
export const hungarianLocale = 'hu'

// Slugs
export const localizedPostsSlug = 'localized-posts'
export const localizedDateFieldsSlug = 'localized-date-fields'
export const withLocalizedRelSlug = 'with-localized-relationship'
export const relationshipLocalizedSlug = 'relationship-localized'
export const withRequiredLocalizedFields = 'localized-required'
export const localizedSortSlug = 'localized-sort'

export const localizedDraftsSlug = 'localized-drafts'
export const usersSlug = 'users'
export const blocksWithLocalizedSameName = 'blocks-same-name'
export const cannotCreateDefaultLocale = 'cannot-create-default-locale'
export const allFieldsLocalizedSlug = 'all-fields-localized'
export const arrayWithFallbackCollectionSlug = 'array-with-fallback-fields'
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.eslint.json]---
Location: payload-main/test/localization/tsconfig.eslint.json

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
Location: payload-main/test/localization/tsconfig.json

```json
{
  "extends": "../tsconfig.json"
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/localization/collections/AllFields/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { allFieldsLocalizedSlug } from '../../shared.js'

export const AllFieldsLocalized: CollectionConfig = {
  slug: allFieldsLocalizedSlug,
  admin: {
    useAsTitle: 'text',
  },
  fields: [
    // Simple localized fields
    {
      name: 'text',
      type: 'text',
      localized: true,
    },
    {
      name: 'textarea',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'number',
      type: 'number',
      localized: true,
    },
    {
      name: 'email',
      type: 'email',
      localized: true,
    },
    {
      name: 'code',
      type: 'code',
      localized: true,
    },
    {
      name: 'json',
      type: 'json',
      localized: true,
    },
    {
      name: 'select',
      type: 'select',
      localized: true,
      options: ['option1', 'option2', 'option3'],
    },
    {
      name: 'radio',
      type: 'radio',
      localized: true,
      options: ['radio1', 'radio2'],
    },
    {
      name: 'checkbox',
      type: 'checkbox',
      localized: true,
    },
    {
      name: 'date',
      type: 'date',
      localized: true,
    },

    // Localized group with localized children
    {
      name: 'localizedGroup',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
        },
      ],
      localized: true,
    },

    // Non-localized group with localized children
    {
      name: 'nonLocalizedGroup',
      type: 'group',
      fields: [
        {
          name: 'localizedText',
          type: 'text',
          localized: true,
        },
        {
          name: 'nonLocalizedText',
          type: 'text',
        },
      ],
    },

    // Localized array with localized children
    {
      name: 'localizedArray',
      type: 'array',
      fields: [
        {
          name: 'item',
          type: 'text',
          localized: true,
        },
      ],
      localized: true,
    },

    // Non-localized array with localized children
    {
      name: 'nonLocalizedArray',
      type: 'array',
      fields: [
        {
          name: 'localizedItem',
          type: 'text',
          localized: true,
        },
      ],
    },

    // Localized blocks with nested localized fields
    {
      name: 'localizedBlocks',
      type: 'blocks',
      blocks: [
        {
          slug: 'localizedTextBlock',
          fields: [
            {
              name: 'text',
              type: 'text',
              localized: true,
            },
          ],
        },
        {
          slug: 'nestedBlock',
          fields: [
            {
              name: 'nestedArray',
              type: 'array',
              fields: [
                {
                  name: 'item',
                  type: 'text',
                },
              ],
              localized: true,
            },
          ],
        },
      ],
      localized: true,
    },

    // Named tabs with localized tab
    {
      type: 'tabs',
      tabs: [
        {
          name: 'localizedTab',
          fields: [
            {
              name: 'tabText',
              type: 'text',
              localized: true,
            },
          ],
          label: 'Localized Tab',
          localized: true,
        },
        {
          name: 'nonLocalizedTab',
          fields: [
            {
              name: 'localizedInNonLocalizedTab',
              type: 'text',
              localized: true,
            },
          ],
          label: 'Non-Localized Tab',
        },
      ],
    },

    // Unnamed tab (passes through)
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'unnamedTabLocalizedText',
              type: 'text',
              localized: true,
            },
          ],
          label: 'Unnamed Tab',
        },
      ],
    },

    // Deeply nested: localized tab
    {
      type: 'tabs',
      tabs: [
        {
          name: 't1',
          label: 'Deeply Nested Tab',
          localized: true,
          fields: [
            {
              type: 'tabs',
              tabs: [
                {
                  name: 't2',
                  label: 'Nested Tab Level 2',
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
          ],
        },
      ],
    },

    // Deeply nested: localized group > non-localized group > localized array
    {
      name: 'g1',
      type: 'group',
      label: 'Deeply Nested Group',
      fields: [
        {
          name: 'g2',
          type: 'group',
          fields: [
            {
              name: 'g2a1',
              type: 'array',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  localized: true,
                },
              ],
              localized: true,
            },
          ],
        },
      ],
      localized: true,
    },

    // relation to self
    {
      name: 'selfRelation',
      type: 'relationship',
      relationTo: allFieldsLocalizedSlug,
    },
  ],
  versions: {
    drafts: true,
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/localization/collections/Array/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const arrayCollectionSlug = 'array-fields'

export const ArrayCollection: CollectionConfig = {
  slug: arrayCollectionSlug,
  fields: [
    {
      name: 'items',
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
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/localization/collections/ArrayWithFallback/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { arrayWithFallbackCollectionSlug } from '../../shared.js'

export const ArrayWithFallbackCollection: CollectionConfig = {
  slug: arrayWithFallbackCollectionSlug,
  fields: [
    {
      name: 'items',
      type: 'array',
      localized: true,
      required: true,
      fields: [
        {
          name: 'text',
          type: 'text',
        },
      ],
    },
    {
      name: 'itemsReadOnly',
      type: 'array',
      localized: true,
      admin: {
        readOnly: true,
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/localization/collections/Blocks/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const blocksCollectionSlug = 'blocks-fields'

export const BlocksCollection: CollectionConfig = {
  slug: blocksCollectionSlug,
  admin: {
    useAsTitle: 'title',
  },
  versions: {
    drafts: {
      autosave: true,
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Tab',
          fields: [
            {
              name: 'tabContent',
              label: 'Content',
              type: 'blocks',
              localized: true,
              blocks: [
                {
                  slug: 'blockInsideTab',
                  fields: [{ type: 'text', name: 'text' }],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'content',
      label: 'Content',
      type: 'blocks',
      localized: true,
      blocks: [
        {
          slug: 'blockInsideBlock',
          fields: [
            {
              name: 'text',
              type: 'text',
            },
            {
              name: 'content',
              type: 'blocks',
              blocks: [
                {
                  slug: 'textBlock',
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
              name: 'array',
              type: 'array',
              fields: [
                {
                  name: 'link',
                  type: 'group',
                  fields: [
                    {
                      name: 'label',
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
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/localization/collections/Group/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const groupSlug = 'groups'

export const Group: CollectionConfig = {
  slug: groupSlug,
  fields: [
    {
      name: 'groupLocalizedRow',
      type: 'group',
      localized: true,
      fields: [
        {
          type: 'row',
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
      name: 'groupLocalized',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
      ],
      localized: true,
    },

    {
      name: 'group',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
        },
      ],
    },
    {
      name: 'deep',
      type: 'group',
      fields: [
        {
          name: 'array',
          type: 'array',
          fields: [
            {
              name: 'title',
              type: 'text',
              localized: true,
            },
          ],
        },
        {
          name: 'blocks',
          type: 'blocks',
          blocks: [
            {
              slug: 'first',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  localized: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/localization/collections/LocalizedDateFields/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { localizedDateFieldsSlug } from '../../shared.js'

export const LocalizedDateFields: CollectionConfig = {
  slug: localizedDateFieldsSlug,
  versions: {
    drafts: true,
  },
  fields: [
    {
      type: 'date',
      name: 'localizedDate',
      localized: true,
    },
    {
      type: 'date',
      name: 'date',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/localization/collections/LocalizedDrafts/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { localizedDraftsSlug } from '../../shared.js'

export const LocalizedDrafts: CollectionConfig = {
  slug: localizedDraftsSlug,
  versions: {
    drafts: true,
  },
  fields: [
    {
      type: 'text',
      name: 'title',
      localized: true,
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/localization/collections/LocalizedWithinLocalized/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const LocalizedWithinLocalized: CollectionConfig = {
  slug: 'localized-within-localized',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'myTab',
          label: 'My Tab',
          localized: true,
          fields: [
            {
              name: 'shouldNotBeLocalized',
              type: 'text',
              localized: true,
            },
          ],
        },
      ],
    },
    {
      name: 'myArray',
      type: 'array',
      localized: true,
      fields: [
        {
          name: 'shouldNotBeLocalized',
          type: 'text',
          localized: true,
        },
      ],
    },
    {
      name: 'myBlocks',
      type: 'blocks',
      localized: true,
      blocks: [
        {
          slug: 'myBlock',
          fields: [
            {
              name: 'shouldNotBeLocalized',
              type: 'text',
              localized: true,
            },
          ],
        },
      ],
    },
    {
      name: 'myGroup',
      type: 'group',
      localized: true,
      fields: [
        {
          name: 'shouldNotBeLocalized',
          type: 'text',
          localized: true,
        },
      ],
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/localization/collections/NestedArray/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const NestedArray: CollectionConfig = {
  slug: 'nested-arrays',
  versions: {
    drafts: true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'My Tab',
          fields: [
            {
              name: 'arrayWithBlocks',
              type: 'array',
              localized: true,
              fields: [
                {
                  name: 'blocksWithinArray',
                  type: 'blocks',
                  blocks: [
                    {
                      slug: 'someBlock',
                      fields: [
                        {
                          name: 'relationWithinBlock',
                          type: 'relationship',
                          relationTo: 'localized-posts',
                        },
                        {
                          name: 'myGroup',
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
              ],
            },
            {
              name: 'arrayWithLocalizedRelation',
              type: 'array',
              dbName: 'arr_rel',
              fields: [
                {
                  name: 'localizedRelation',
                  type: 'relationship',
                  localized: true,
                  relationTo: 'localized-posts',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/localization/collections/NestedFields/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const NestedFields: CollectionConfig = {
  slug: 'nested-field-tables',
  fields: [
    {
      name: 'array',
      type: 'array',
      localized: true,
      fields: [
        {
          name: 'relation',
          type: 'relationship',
          relationTo: ['localized-posts'],
        },
        {
          name: 'hasManyRelation',
          type: 'relationship',
          hasMany: true,
          relationTo: 'localized-posts',
        },
        {
          name: 'hasManyPolyRelation',
          type: 'relationship',
          hasMany: true,
          relationTo: ['localized-posts'],
        },
        {
          name: 'select',
          type: 'select',
          hasMany: true,
          options: ['one', 'two', 'three'],
        },
        {
          name: 'number',
          type: 'number',
          hasMany: true,
        },
        {
          name: 'text',
          type: 'text',
          hasMany: true,
        },
      ],
    },
    {
      name: 'blocks',
      type: 'blocks',
      localized: true,
      blocks: [
        {
          slug: 'block',
          fields: [
            {
              name: 'nestedBlocks',
              type: 'blocks',
              blocks: [
                {
                  slug: 'content',
                  fields: [
                    {
                      name: 'relation',
                      type: 'relationship',
                      relationTo: ['localized-posts'],
                    },
                  ],
                },
              ],
            },
            {
              name: 'array',
              type: 'array',
              fields: [
                {
                  name: 'relation',
                  type: 'relationship',
                  relationTo: ['localized-posts'],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/localization/collections/NestedToArrayAndBlock/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const nestedToArrayAndBlockCollectionSlug = 'nested'

export const NestedToArrayAndBlock: CollectionConfig = {
  slug: nestedToArrayAndBlockCollectionSlug,
  fields: [
    {
      type: 'blocks',
      name: 'blocks',
      blocks: [
        {
          slug: 'block',
          fields: [
            {
              name: 'someText',
              type: 'text',
              localized: true,
            },
            {
              name: 'array',
              type: 'array',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  localized: true,
                },
                {
                  name: 'textNotLocalized',
                  type: 'text',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'topLevelArray',
      type: 'array',
      localized: false,
      fields: [
        {
          name: 'localizedText',
          type: 'text',
          localized: true,
        },
        {
          name: 'notLocalizedText',
          type: 'text',
        },
      ],
    },
    {
      name: 'topLevelArrayLocalized',
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
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/localization/collections/NoLocalizedFields/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const noLocalizedFieldsCollectionSlug = 'no-localized-fields'

export const NoLocalizedFieldsCollection: CollectionConfig = {
  slug: noLocalizedFieldsCollectionSlug,
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'text',
      type: 'text',
      localized: false,
    },
    {
      type: 'group',
      name: 'group',
      fields: [
        {
          name: 'en',
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
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/localization/collections/RichText/index.ts

```typescript
import type { CollectionConfig } from 'payload/types'

import { lexicalEditor, TreeViewFeature } from '@payloadcms/richtext-lexical'
import { slateEditor } from '@payloadcms/richtext-slate'

export const richTextSlug = 'richText'

export const RichTextCollection: CollectionConfig = {
  slug: richTextSlug,
  fields: [
    {
      type: 'richText',
      name: 'richText',
      label: 'Rich Text',
      localized: true,
      editor: slateEditor({
        admin: {
          elements: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
        },
      }),
    },
    {
      name: 'lexical',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [...defaultFeatures, TreeViewFeature()],
      }),
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/localization/collections/Tab/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const tabSlug = 'tabs'

export const Tab: CollectionConfig = {
  slug: tabSlug,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'tabLocalized',
          localized: true,
          fields: [
            {
              name: 'title',
              type: 'text',
            },
            {
              name: 'array',
              type: 'array',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                },
              ],
            },
          ],
        },
        {
          name: 'tab',
          fields: [
            {
              localized: true,
              name: 'title',
              type: 'text',
            },
          ],
        },
        {
          name: 'deep',
          fields: [
            {
              name: 'array',
              type: 'array',
              fields: [
                {
                  localized: true,
                  type: 'text',
                  name: 'title',
                },
              ],
            },
            {
              name: 'blocks',
              type: 'blocks',
              blocks: [
                {
                  slug: 'first',
                  fields: [
                    {
                      localized: true,
                      type: 'text',
                      name: 'title',
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
}
```

--------------------------------------------------------------------------------

````
