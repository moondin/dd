---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 594
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 594 of 695)

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
Location: payload-main/test/joins/seed.ts

```typescript
import type { Payload } from 'payload'

import path from 'path'
import { getFileByPath } from 'payload'
import { fileURLToPath } from 'url'

import { devUser } from '../credentials.js'
import {
  categoriesJoinRestrictedSlug,
  categoriesSlug,
  collectionRestrictedSlug,
  hiddenPostsSlug,
  postsSlug,
  uploadsSlug,
} from './shared.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const seed = async (_payload: Payload) => {
  await _payload.create({
    collection: 'users',
    data: {
      email: devUser.email,
      password: devUser.password,
    },
  })

  const category = await _payload.create({
    collection: categoriesSlug,
    data: {
      name: 'example',
      group: {},
    },
  })

  await _payload.create({
    collection: hiddenPostsSlug,
    data: {
      category: category.id,
      title: 'Test Post 1',
    },
  })

  const post1 = await _payload.create({
    collection: postsSlug,
    data: {
      category: category.id,
      group: {
        category: category.id,
      },
      title: 'Test Post 1',
      localizedText: 'Text in en',
    },
  })

  const post2 = await _payload.create({
    collection: postsSlug,
    data: {
      category: category.id,
      group: {
        category: category.id,
      },
      title: 'Test Post 2',
      localizedText: 'Text in en',
    },
  })

  const post3 = await _payload.create({
    collection: postsSlug,
    data: {
      category: category.id,
      group: {
        category: category.id,
      },
      title: 'Test Post 3',
      localizedText: 'Text in en',
    },
  })

  await _payload.update({
    collection: postsSlug,
    id: post1.id,
    data: {
      localizedText: 'Text in es',
    },
    locale: 'es',
  })

  await _payload.update({
    collection: postsSlug,
    id: post2.id,
    data: {
      localizedText: 'Text in es',
    },
    locale: 'es',
  })

  await _payload.update({
    collection: postsSlug,
    id: post3.id,
    data: {
      localizedText: 'Text in es',
    },
    locale: 'es',
  })

  // create an upload with image.png
  const imageFilePath = path.resolve(dirname, './image.png')
  const imageFile = await getFileByPath(imageFilePath)
  const { id: uploadedImage } = await _payload.create({
    collection: uploadsSlug,
    data: {},
    file: imageFile,
  })

  // create a post that uses the upload
  await _payload.create({
    collection: postsSlug,
    data: {
      upload: uploadedImage,
    },
  })

  const restrictedCategory = await _payload.create({
    collection: categoriesJoinRestrictedSlug,
    data: {
      name: 'categoryJoinRestricted',
    },
  })
  await _payload.create({
    collection: collectionRestrictedSlug,
    data: {
      title: 'should not allow read',
      canRead: false,
      category: restrictedCategory.id,
    },
  })
  await _payload.create({
    collection: collectionRestrictedSlug,
    data: {
      title: 'should allow read',
      canRead: true,
      category: restrictedCategory.id,
    },
  })

  const root_folder = await _payload.create({
    collection: 'folders',
    data: {
      folder: null,
      title: 'Root folder',
    },
  })

  const page_1 = await _payload.create({
    collection: 'example-pages',
    data: { title: 'page 1', name: 'Andrew', folder: root_folder },
  })

  const post_1 = await _payload.create({
    collection: 'example-posts',
    data: { title: 'page 1', description: 'This is post 1', folder: root_folder },
  })

  const page_2 = await _payload.create({
    collection: 'example-pages',
    data: { title: 'page 2', name: 'Sophia', folder: root_folder },
  })

  const page_3 = await _payload.create({
    collection: 'example-pages',
    data: { title: 'page 3', name: 'Michael', folder: root_folder },
  })

  const post_2 = await _payload.create({
    collection: 'example-posts',
    data: { title: 'post 2', description: 'This is post 2', folder: root_folder },
  })

  const post_3 = await _payload.create({
    collection: 'example-posts',
    data: { title: 'post 3', description: 'This is post 3', folder: root_folder },
  })

  const sub_folder_1 = await _payload.create({
    collection: 'folders',
    data: { folder: root_folder, title: 'Sub Folder 1' },
  })

  const page_4 = await _payload.create({
    collection: 'example-pages',
    data: { title: 'page 4', name: 'Emma', folder: sub_folder_1 },
  })

  const post_4 = await _payload.create({
    collection: 'example-posts',
    data: { title: 'post 4', description: 'This is post 4', folder: sub_folder_1 },
  })

  const sub_folder_2 = await _payload.create({
    collection: 'folders',
    data: { folder: root_folder, title: 'Sub Folder 2' },
  })

  const page_5 = await _payload.create({
    collection: 'example-pages',
    data: { title: 'page 5', name: 'Liam', folder: sub_folder_2 },
  })

  const post_5 = await _payload.create({
    collection: 'example-posts',
    data: { title: 'post 5', description: 'This is post 5', folder: sub_folder_2 },
  })
}
```

--------------------------------------------------------------------------------

---[FILE: shared.ts]---
Location: payload-main/test/joins/shared.ts

```typescript
export const categoriesSlug = 'categories'

export const categories2Slug = 'categories-2'

export const postsSlug = 'posts'

export const hiddenPostsSlug = 'hidden-posts'

export const uploadsSlug = 'uploads'

export const localizedPostsSlug = 'localized-posts'

export const localizedCategoriesSlug = 'localized-categories'

export const restrictedPostsSlug = 'restricted-posts'

export const categoriesJoinRestrictedSlug = 'categories-join-restricted'

export const collectionRestrictedSlug = 'collection-restricted'

export const restrictedCategoriesSlug = 'restricted-categories'

export const categoriesVersionsSlug = 'categories-versions'

export const versionsSlug = 'versions'

export const collectionSlugs = [
  categoriesSlug,
  categoriesVersionsSlug,
  postsSlug,
  localizedPostsSlug,
  localizedCategoriesSlug,
  restrictedPostsSlug,
  restrictedCategoriesSlug,
]
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.eslint.json]---
Location: payload-main/test/joins/tsconfig.eslint.json

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
Location: payload-main/test/joins/tsconfig.json

```json
{
  "extends": "../tsconfig.json"
}
```

--------------------------------------------------------------------------------

---[FILE: Categories.ts]---
Location: payload-main/test/joins/collections/Categories.ts

```typescript
import type { CollectionConfig } from 'payload'

import { ValidationError } from 'payload'

import { categoriesSlug, hiddenPostsSlug, postsSlug, versionsSlug } from '../shared.js'
import { singularSlug } from './Singular.js'

export const Categories: CollectionConfig = {
  slug: categoriesSlug,
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    // Alternative tabs usage
    // {
    //   type: 'tabs',
    //   tabs: [
    //     {
    //       label: 'Unnamed tab',
    //       fields: [
    //         {
    //           name: 'relatedPosts',
    //           label: 'Related Posts',
    //           type: 'join',
    //           collection: postsSlug,
    //           on: 'category',
    //         },
    //       ],
    //     },
    //     {
    //       name: 'group',
    //       fields: [
    //         {
    //           name: 'relatedPosts',
    //           label: 'Related Posts (Group)',
    //           type: 'join',
    //           collection: postsSlug,
    //           on: 'group.category',
    //         },
    //       ],
    //     },
    //   ],
    // },
    {
      name: 'relatedPosts',
      label: 'Related Posts',
      type: 'join',
      admin: {
        components: {
          afterInput: ['/components/AfterInput.js#AfterInput'],
          beforeInput: ['/components/BeforeInput.js#BeforeInput'],
          Description: '/components/CustomDescription/index.js#FieldDescriptionComponent',
        },
        disableRowTypes: false,
      },
      collection: postsSlug,
      defaultSort: '-title',
      defaultLimit: 5,
      on: 'category',
      maxDepth: 1,
    },
    {
      name: 'noRowTypes',
      type: 'join',
      collection: postsSlug,
      defaultLimit: 5,
      on: 'category',
      maxDepth: 1,
    },
    {
      name: 'hasManyPosts',
      type: 'join',
      collection: postsSlug,
      admin: {
        description: 'Static Description',
      },
      on: 'categories',
    },
    {
      name: 'hasManyPostsLocalized',
      type: 'join',
      collection: postsSlug,
      on: 'categoriesLocalized',
    },
    {
      name: 'hiddenPosts',
      type: 'join',
      collection: hiddenPostsSlug,
      on: 'category',
    },
    {
      name: 'group',
      type: 'group',
      fields: [
        {
          name: 'relatedPosts',
          label: 'Related Posts (Group)',
          type: 'join',
          collection: postsSlug,
          on: 'group.category',
          admin: {
            defaultColumns: ['id', 'createdAt', 'title'],
            disableRowTypes: false,
          },
        },
        {
          name: 'camelCasePosts',
          type: 'join',
          collection: postsSlug,
          on: 'group.camelCaseCategory',
        },
      ],
    },
    {
      name: 'arrayPosts',
      type: 'join',
      collection: 'posts',
      on: 'array.category',
    },
    {
      name: 'arrayHasManyPosts',
      type: 'join',
      collection: 'posts',
      on: 'arrayHasMany.category',
    },
    {
      name: 'localizedArrayPosts',
      type: 'join',
      collection: 'posts',
      on: 'localizedArray.category',
    },
    {
      name: 'blocksPosts',
      type: 'join',
      collection: 'posts',
      on: 'blocks.category',
    },
    {
      name: 'polymorphicJoin',
      type: 'join',
      collection: [postsSlug, versionsSlug],
      on: 'category',
    },
    {
      name: 'polymorphicJoinNoRowTypes',
      type: 'join',
      collection: [postsSlug, versionsSlug],
      on: 'category',
      admin: {
        disableRowTypes: true,
      },
    },
    {
      name: 'polymorphic',
      type: 'join',
      collection: postsSlug,
      on: 'polymorphic',
    },
    {
      name: 'polymorphics',
      type: 'join',
      collection: postsSlug,
      on: 'polymorphics',
    },
    {
      name: 'localizedPolymorphic',
      type: 'join',
      collection: postsSlug,
      on: 'localizedPolymorphic',
    },
    {
      name: 'localizedPolymorphics',
      type: 'join',
      collection: postsSlug,
      on: 'localizedPolymorphics',
    },
    {
      name: 'singulars',
      type: 'join',
      collection: singularSlug,
      on: 'category',
    },
    {
      name: 'filtered',
      type: 'join',
      collection: postsSlug,
      on: 'category',
      where: {
        isFiltered: { not_equals: true },
      },
    },
    {
      name: 'inTab',
      type: 'join',
      collection: postsSlug,
      on: 'tab.category',
    },
    {
      name: 'joinWithError',
      type: 'join',
      collection: postsSlug,
      on: 'category',
      hooks: {
        beforeValidate: [
          ({ data }) => {
            if (data?.enableErrorOnJoin) {
              throw new ValidationError({
                collection: 'categories',
                errors: [
                  {
                    message: 'enableErrorOnJoin is true',
                    path: 'joinWithError',
                  },
                ],
              })
            }
          },
        ],
      },
    },
    {
      name: 'enableErrorOnJoin',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: CategoriesVersions.ts]---
Location: payload-main/test/joins/collections/CategoriesVersions.ts

```typescript
import type { CollectionConfig } from 'payload'

import { categoriesVersionsSlug, versionsSlug } from '../shared.js'

export const CategoriesVersions: CollectionConfig = {
  slug: categoriesVersionsSlug,
  labels: {
    singular: 'Category With Versions',
    plural: 'Categories With Versions',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'relatedVersions',
      type: 'join',
      collection: versionsSlug,
      on: 'categoryVersion',
    },
    {
      name: 'relatedVersionsMany',
      type: 'join',
      collection: versionsSlug,
      on: 'categoryVersions',
    },
  ],
  versions: {
    drafts: true,
  },
}
```

--------------------------------------------------------------------------------

---[FILE: FolderPoly1.ts]---
Location: payload-main/test/joins/collections/FolderPoly1.ts

```typescript
import type { CollectionConfig } from 'payload'

export const FolderPoly1: CollectionConfig = {
  slug: 'folderPoly1',
  fields: [
    {
      name: 'folderPoly1Title',
      type: 'text',
    },
  ],
  folders: true,
}
```

--------------------------------------------------------------------------------

---[FILE: FolderPoly2.ts]---
Location: payload-main/test/joins/collections/FolderPoly2.ts

```typescript
import type { CollectionConfig } from 'payload'

export const FolderPoly2: CollectionConfig = {
  slug: 'folderPoly2',
  fields: [
    {
      name: 'folderPoly2Title',
      type: 'text',
    },
  ],
  folders: true,
}
```

--------------------------------------------------------------------------------

---[FILE: HiddenPosts.ts]---
Location: payload-main/test/joins/collections/HiddenPosts.ts

```typescript
import type { CollectionConfig } from 'payload'

import { categoriesSlug, hiddenPostsSlug } from '../shared.js'

export const HiddenPosts: CollectionConfig = {
  slug: hiddenPostsSlug,
  admin: {
    useAsTitle: 'title',
    hidden: true,
    defaultColumns: ['title', 'category'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: categoriesSlug,
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: Posts.ts]---
Location: payload-main/test/joins/collections/Posts.ts

```typescript
import type { CollectionConfig } from 'payload'

import { categoriesSlug, postsSlug, uploadsSlug } from '../shared.js'

export const Posts: CollectionConfig = {
  slug: postsSlug,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'localizedText', 'category', 'updatedAt', 'createdAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'localizedText',
      type: 'text',
      localized: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'isFiltered',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Hides posts for the `filtered` join field in categories',
      },
    },
    {
      name: 'restrictedField',
      type: 'text',
      access: {
        read: () => false,
        update: () => false,
      },
    },
    {
      name: 'upload',
      type: 'upload',
      relationTo: uploadsSlug,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: categoriesSlug,
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: categoriesSlug,
      hasMany: true,
    },
    {
      name: 'categoriesLocalized',
      type: 'relationship',
      relationTo: categoriesSlug,
      hasMany: true,
      localized: true,
    },
    {
      name: 'polymorphic',
      type: 'relationship',
      relationTo: ['categories', 'users'],
    },
    {
      name: 'polymorphics',
      type: 'relationship',
      relationTo: ['categories', 'users'],
      hasMany: true,
    },
    {
      name: 'localizedPolymorphic',
      type: 'relationship',
      relationTo: ['categories', 'users'],
      localized: true,
    },
    {
      name: 'localizedPolymorphics',
      type: 'relationship',
      relationTo: ['categories', 'users'],
      hasMany: true,
      localized: true,
    },
    {
      name: 'group',
      type: 'group',
      fields: [
        {
          name: 'category',
          type: 'relationship',
          relationTo: categoriesSlug,
        },
        {
          name: 'camelCaseCategory',
          type: 'relationship',
          relationTo: categoriesSlug,
        },
      ],
    },
    {
      name: 'array',
      type: 'array',
      fields: [
        {
          name: 'category',
          type: 'relationship',
          relationTo: categoriesSlug,
        },
      ],
    },
    {
      name: 'arrayHasMany',
      type: 'array',
      fields: [
        {
          name: 'category',
          type: 'relationship',
          hasMany: true,
          relationTo: categoriesSlug,
        },
      ],
    },
    {
      name: 'localizedArray',
      type: 'array',
      localized: true,
      fields: [
        {
          name: 'category',
          type: 'relationship',
          relationTo: categoriesSlug,
        },
      ],
    },
    {
      name: 'blocks',
      type: 'blocks',
      blocks: [
        {
          slug: 'block',
          fields: [
            {
              name: 'category',
              type: 'relationship',
              relationTo: categoriesSlug,
            },
          ],
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          name: 'first',
          fields: [
            {
              type: 'text',
              name: 'tabText',
            },
          ],
        },
        {
          name: 'tab',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'category',
                  type: 'relationship',
                  relationTo: categoriesSlug,
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

---[FILE: SelfJoins.ts]---
Location: payload-main/test/joins/collections/SelfJoins.ts

```typescript
import type { CollectionConfig } from 'payload'

export const SelfJoins: CollectionConfig = {
  slug: 'self-joins',
  fields: [
    {
      name: 'rel',
      type: 'relationship',
      relationTo: 'self-joins',
    },
    {
      name: 'joins',
      type: 'join',
      on: 'rel',
      collection: 'self-joins',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: Singular.ts]---
Location: payload-main/test/joins/collections/Singular.ts

```typescript
import type { CollectionConfig } from 'payload'

export const singularSlug = 'singular'

export const Singular: CollectionConfig = {
  slug: singularSlug,
  fields: [
    {
      type: 'relationship',
      relationTo: 'categories',
      name: 'category',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: Uploads.ts]---
Location: payload-main/test/joins/collections/Uploads.ts

```typescript
import type { CollectionConfig } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

import { uploadsSlug } from '../shared.js'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Uploads: CollectionConfig = {
  slug: uploadsSlug,
  fields: [
    {
      name: 'relatedPosts',
      type: 'join',
      collection: 'posts',
      on: 'upload',
      admin: {
        disableRowTypes: false,
      },
    },
  ],
  upload: {
    staticDir: path.resolve(dirname, '../uploads'),
  },
}
```

--------------------------------------------------------------------------------

---[FILE: Versions.ts]---
Location: payload-main/test/joins/collections/Versions.ts

```typescript
import type { CollectionConfig } from 'payload'

import { versionsSlug } from '../shared.js'

export const Versions: CollectionConfig = {
  slug: versionsSlug,
  labels: {
    singular: 'Post With Versions',
    plural: 'Posts With Versions',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      relationTo: 'categories',
      type: 'relationship',
    },
    {
      name: 'categoryVersion',
      relationTo: 'categories-versions',
      type: 'relationship',
      label: 'Category With Versions',
    },
    {
      name: 'categoryVersions',
      relationTo: 'categories-versions',
      type: 'relationship',
      hasMany: true,
      label: 'Categories With Versions (Has Many)',
    },
  ],
  versions: {
    drafts: {
      autosave: true,
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: AfterInput.tsx]---
Location: payload-main/test/joins/components/AfterInput.tsx
Signals: React

```typescript
'use client'

import React from 'react'

export const AfterInput: React.FC = () => {
  return <div className="after-input">#after-input</div>
}
```

--------------------------------------------------------------------------------

---[FILE: BeforeInput.tsx]---
Location: payload-main/test/joins/components/BeforeInput.tsx
Signals: React

```typescript
'use client'

import React from 'react'

export const BeforeInput: React.FC = () => {
  return <div className="before-input">#before-input</div>
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/joins/components/CustomDescription/index.tsx
Signals: React

```typescript
'use client'
import type { FieldDescriptionClientComponent } from 'payload'

import React from 'react'

export const FieldDescriptionComponent: FieldDescriptionClientComponent = ({ path }) => {
  return <div className={`field-description-${path}`}>Component description: {path}</div>
}
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/test/kv/.gitignore

```text
/media
/media-gif
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: payload-main/test/kv/config.ts

```typescript
import { fileURLToPath } from 'node:url'
import path from 'path'

import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfigWithDefaults({
  // ...extend config here
  collections: [],
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  globals: [],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
```

--------------------------------------------------------------------------------

---[FILE: eslint.config.js]---
Location: payload-main/test/kv/eslint.config.js

```javascript
import { rootParserOptions } from '../../eslint.config.js'
import { testEslintConfig } from '../eslint.config.js'

/** @typedef {import('eslint').Linter.Config} Config */

/** @type {Config[]} */
export const index = [
  ...testEslintConfig,
  {
    languageOptions: {
      parserOptions: {
        ...rootParserOptions,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]

export default index
```

--------------------------------------------------------------------------------

---[FILE: int.spec.ts]---
Location: payload-main/test/kv/int.spec.ts

```typescript
import type { KVAdapterResult, Payload } from 'payload'

import { RedisKVAdapter, redisKVAdapter } from '@payloadcms/kv-redis'
import path from 'path'
import { inMemoryKVAdapter } from 'payload'
import { fileURLToPath } from 'url'

import { initPayloadInt } from '../helpers/initPayloadInt.js'

let payload: Payload

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

describe('KV Adapters', () => {
  // --__--__--__--__--__--__--__--__--__
  // Boilerplate test setup/teardown
  // --__--__--__--__--__--__--__--__--__
  beforeAll(async () => {
    const initialized = await initPayloadInt(dirname)
    ;({ payload } = initialized)
  })

  afterAll(async () => {
    if (typeof payload.db.destroy === 'function') {
      await payload.db.destroy()
    }
  })

  const testKVAdapter = async (adapter?: KVAdapterResult) => {
    if (adapter) {
      payload.kv = adapter.init({ payload })
    }

    await payload.kv.set('my-key-1', { userID: 1 })
    await payload.kv.set('my-key-2', { userID: 2 })

    expect(await payload.kv.get('my-key-1')).toStrictEqual({ userID: 1 })
    expect(await payload.kv.get('my-key-2')).toStrictEqual({ userID: 2 })
    expect(await payload.kv.get('my-key-3')).toBeNull()

    expect(await payload.kv.has('my-key-1')).toBeTruthy()
    expect(await payload.kv.has('my-key-2')).toBeTruthy()
    expect(await payload.kv.has('my-key-3')).toBeFalsy()

    let keys = await payload.kv.keys()
    expect(keys).toHaveLength(2)
    expect(keys).toContain('my-key-1')
    expect(keys).toContain('my-key-2')

    await payload.kv.set('my-key-1', { userID: 10 })
    expect(await payload.kv.get('my-key-1')).toStrictEqual({ userID: 10 })

    await payload.kv.delete('my-key-1')
    expect(await payload.kv.get('my-key-1')).toBeNull()
    expect(await payload.kv.has('my-key-1')).toBeFalsy()
    keys = await payload.kv.keys()
    expect(keys).toHaveLength(1)
    expect(keys).toContain('my-key-2')

    await payload.kv.clear()
    expect(await payload.kv.get('my-key-2')).toBeNull()
    expect(await payload.kv.has('my-key-2')).toBeFalsy()
    keys = await payload.kv.keys()
    expect(keys).toHaveLength(0)

    if (payload.kv instanceof RedisKVAdapter) {
      await payload.kv.redisClient.quit()
    }

    return true
  }

  it('databaseKVAdapter', async () => {
    // default
    expect(await testKVAdapter()).toBeTruthy()
  })

  it('inMemoryKVAdapter', async () => {
    expect(await testKVAdapter(inMemoryKVAdapter())).toBeTruthy()
  })

  it('redisKVAdapter', async () => {
    expect(await testKVAdapter(redisKVAdapter())).toBeTruthy()
  })
})
```

--------------------------------------------------------------------------------

---[FILE: payload-types.ts]---
Location: payload-main/test/kv/payload-types.ts

```typescript
/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

export interface Config {
  auth: {
    users: UserAuthOperations;
  };
  collections: {
    users: User;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
    'payload-kv': PayloadKv;
  };
  collectionsJoins: {};
  collectionsSelect: {
    users: UsersSelect<false> | UsersSelect<true>;
    'payload-locked-documents': PayloadLockedDocumentsSelect<false> | PayloadLockedDocumentsSelect<true>;
    'payload-preferences': PayloadPreferencesSelect<false> | PayloadPreferencesSelect<true>;
    'payload-migrations': PayloadMigrationsSelect<false> | PayloadMigrationsSelect<true>;
    'payload-kv': PayloadKvSelect<false> | PayloadKvSelect<true>;
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
  document?: {
    relationTo: 'users';
    value: string | User;
  } | null;
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
 * via the `definition` "payload-kv".
 */
export interface PayloadKv {
  id: string;
  key: string;
  data:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
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
 * via the `definition` "payload-kv_select".
 */
export interface PayloadKvSelect<T extends boolean = true> {
  key?: T;
  data?: T;
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

---[FILE: tsconfig.eslint.json]---
Location: payload-main/test/kv/tsconfig.eslint.json

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
Location: payload-main/test/kv/tsconfig.json

```json
{
  "extends": "../tsconfig.json"
}
```

--------------------------------------------------------------------------------

---[FILE: types.d.ts]---
Location: payload-main/test/kv/types.d.ts

```typescript
import type { RequestContext as OriginalRequestContext } from 'payload'

declare module 'payload' {
  // Create a new interface that merges your additional fields with the original one
  export interface RequestContext extends OriginalRequestContext {
    myObject?: string
    // ...
  }
}
```

--------------------------------------------------------------------------------

---[FILE: baseConfig.ts]---
Location: payload-main/test/lexical/baseConfig.ts

```typescript
import { en } from '@payloadcms/translations/languages/en'
import { es } from '@payloadcms/translations/languages/es'
import { he } from '@payloadcms/translations/languages/he'
import { fileURLToPath } from 'node:url'
import path from 'path'
import { type Config } from 'payload'

import { LexicalFullyFeatured } from './collections/_LexicalFullyFeatured/index.js'
import ArrayFields from './collections/Array/index.js'
import {
  getLexicalFieldsCollection,
  lexicalBlocks,
  lexicalInlineBlocks,
} from './collections/Lexical/index.js'
import { LexicalAccessControl } from './collections/LexicalAccessControl/index.js'
import { LexicalHeadingFeature } from './collections/LexicalHeadingFeature/index.js'
import { LexicalInBlock } from './collections/LexicalInBlock/index.js'
import { LexicalJSXConverter } from './collections/LexicalJSXConverter/index.js'
import { LexicalLinkFeature } from './collections/LexicalLinkFeature/index.js'
import { LexicalListsFeature } from './collections/LexicalListsFeature/index.js'
import { LexicalLocalizedFields } from './collections/LexicalLocalized/index.js'
import { LexicalMigrateFields } from './collections/LexicalMigrate/index.js'
import { LexicalObjectReferenceBugCollection } from './collections/LexicalObjectReferenceBug/index.js'
import { LexicalRelationshipsFields } from './collections/LexicalRelationships/index.js'
import { OnDemandForm } from './collections/OnDemandForm/index.js'
import { OnDemandOutsideForm } from './collections/OnDemandOutsideForm/index.js'
import RichTextFields from './collections/RichText/index.js'
import TextFields from './collections/Text/index.js'
import { Uploads, Uploads2 } from './collections/Upload/index.js'
import TabsWithRichText from './globals/TabsWithRichText.js'
import { seed } from './seed.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const baseConfig: Partial<Config> = {
  // ...extend config here
  collections: [
    LexicalFullyFeatured,
    LexicalLinkFeature,
    LexicalListsFeature,
    LexicalHeadingFeature,
    LexicalJSXConverter,
    getLexicalFieldsCollection({
      blocks: lexicalBlocks,
      inlineBlocks: lexicalInlineBlocks,
    }),
    LexicalMigrateFields,
    LexicalLocalizedFields,
    LexicalObjectReferenceBugCollection,
    LexicalInBlock,
    LexicalAccessControl,
    LexicalRelationshipsFields,
    RichTextFields,
    TextFields,
    Uploads,
    Uploads2,
    ArrayFields,
    OnDemandForm,
    OnDemandOutsideForm,
  ],
  globals: [TabsWithRichText],

  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      views: {
        custom: {
          Component: './components/Image.js#Image',
          path: '/custom-image',
        },
      },
      beforeDashboard: [
        {
          path: './components/CollectionsExplained.js#CollectionsExplained',
        },
      ],
    },
  },
  onInit: async (payload) => {
    // IMPORTANT: This should only seed, not clear the database.
    if (process.env.SEED_IN_CONFIG_ONINIT !== 'false') {
      await seed(payload)
    }
  },
  localization: {
    defaultLocale: 'en',
    fallback: true,
    locales: ['en', 'es', 'he'],
  },
  i18n: {
    supportedLanguages: {
      en,
      es,
      he,
    },
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
}
```

--------------------------------------------------------------------------------

---[FILE: config.blockreferences.ts]---
Location: payload-main/test/lexical/config.blockreferences.ts

```typescript
/* eslint-disable no-restricted-exports */

import type { BlockSlug } from 'payload'

import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import { autoDedupeBlocksPlugin } from '../helpers/autoDedupeBlocksPlugin/index.js'
import { baseConfig } from './baseConfig.js'
import {
  getLexicalFieldsCollection,
  lexicalBlocks,
  lexicalInlineBlocks,
} from './collections/Lexical/index.js'
import { lexicalFieldsSlug } from './slugs.js'

export default buildConfigWithDefaults({
  ...baseConfig,
  blocks: [
    ...(baseConfig.blocks ?? []),
    ...lexicalBlocks.filter((block) => typeof block !== 'string'),
    ...lexicalInlineBlocks.filter((block) => typeof block !== 'string'),
  ],
  collections: baseConfig.collections?.map((collection) => {
    if (collection.slug === lexicalFieldsSlug) {
      return getLexicalFieldsCollection({
        blocks: lexicalBlocks.map((block) =>
          typeof block === 'string' ? block : block.slug,
        ) as BlockSlug[],
        inlineBlocks: lexicalInlineBlocks.map((block) =>
          typeof block === 'string' ? block : block.slug,
        ) as BlockSlug[],
      })
    }
    return collection
  }),
  plugins: [autoDedupeBlocksPlugin({ silent: false })],
})
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: payload-main/test/lexical/config.ts

```typescript
import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import { baseConfig } from './baseConfig.js'

export default buildConfigWithDefaults(baseConfig)
```

--------------------------------------------------------------------------------

````
