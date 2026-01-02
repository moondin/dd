---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 515
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 515 of 695)

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
Location: payload-main/test/admin/seed.ts

```typescript
import type { Payload } from 'payload'

import { devUser } from '../credentials.js'
import { executePromises } from '../helpers/executePromises.js'
import {
  customViews1CollectionSlug,
  customViews2CollectionSlug,
  geoCollectionSlug,
  localizedCollectionSlug,
  noApiViewCollectionSlug,
  postsCollectionSlug,
  usersCollectionSlug,
  with300DocumentsSlug,
} from './slugs.js'

export const seed = async (_payload: Payload) => {
  await executePromises(
    [
      () =>
        _payload.create({
          collection: usersCollectionSlug,
          data: {
            email: devUser.email,
            password: devUser.password,
          },
          depth: 0,
          overrideAccess: true,
        }),
      () =>
        _payload.create({
          collection: 'base-list-filters',
          data: {
            title: 'show me',
          },
          depth: 0,
          overrideAccess: true,
        }),
      () =>
        _payload.create({
          collection: 'base-list-filters',
          data: {
            title: 'hide me',
          },
          depth: 0,
          overrideAccess: true,
        }),
      ...[...Array(11)].map((_, i) => async () => {
        const postDoc = await _payload.create({
          collection: postsCollectionSlug,
          data: {
            description: 'Description',
            title: `Post ${i + 1}`,
            disableListColumnText: 'Disable List Column Text',
            disableListFilterText: 'Disable List Filter Text',
          },
          depth: 0,
          overrideAccess: true,
        })

        return await _payload.update({
          collection: postsCollectionSlug,
          where: {
            id: {
              equals: postDoc.id,
            },
          },
          data: {
            relationship: postDoc.id,
          },
          depth: 0,
          overrideAccess: true,
        })
      }),
      () =>
        _payload.create({
          collection: customViews1CollectionSlug,
          data: {
            title: 'Custom View',
          },
          depth: 0,
          overrideAccess: true,
        }),
      () =>
        _payload.create({
          collection: customViews2CollectionSlug,
          data: {
            title: 'Custom View',
          },
          depth: 0,
          overrideAccess: true,
        }),
      () =>
        _payload.create({
          collection: geoCollectionSlug,
          data: {
            point: [7, -7],
          },
          depth: 0,
          overrideAccess: true,
        }),
      () =>
        _payload.create({
          collection: geoCollectionSlug,
          data: {
            point: [5, -5],
          },
          depth: 0,
          overrideAccess: true,
        }),
      () =>
        _payload.create({
          collection: noApiViewCollectionSlug,
          data: {},
          depth: 0,
          overrideAccess: true,
        }),
      () =>
        _payload.create({
          collection: localizedCollectionSlug,
          data: {
            title: 'Localized Doc',
          },
          depth: 0,
          overrideAccess: true,
        }),
    ],
    false,
  )

  // delete all with300Documents
  await _payload.delete({
    collection: with300DocumentsSlug,
    where: {},
  })

  // Create 300 documents of with300Documents
  const manyDocumentsPromises: Promise<unknown>[] = Array.from({ length: 300 }, (_, i) => {
    const index = (i + 1).toString().padStart(3, '0')
    return _payload.create({
      collection: with300DocumentsSlug,
      data: {
        id: index,
        text: `document ${index}`,
      },
    })
  })

  await Promise.all([...manyDocumentsPromises])
}
```

--------------------------------------------------------------------------------

---[FILE: shared.ts]---
Location: payload-main/test/admin/shared.ts

```typescript
import type { Config } from 'payload'

export const slugSingularLabel = 'Post'

export const slugPluralLabel = 'Posts'

export const customViewPath = '/custom-view'

export const customNestedViewPath = `${customViewPath}/nested-view`

export const publicCustomViewPath = '/public-custom-view'

export const protectedCustomNestedViewPath = `${publicCustomViewPath}/protected-nested-view`

export const customParamViewPathBase = '/custom-param'

export const customParamViewPath = `${customParamViewPathBase}/:id`

export const customViewTitle = 'Custom View'

export const customParamViewTitle = 'Custom Param View'

export const customNestedViewTitle = 'Custom Nested View'

export const customEditLabel = 'Custom Edit Label'

export const customTabComponent = 'Custom Tab Component'

export const overriddenDefaultRouteTabLabel = 'Custom Tab Component Default View'

export const customTabLabel = 'Custom Tab Label'

export const customTabViewPath = '/custom-tab-component'

export const customTabViewTitle = 'Custom View With Tab Component'

export const customTabLabelViewTitle = 'Custom Tab Label View'

export const customTabViewComponentTitle = 'Custom View With Tab Component'

export const customNestedTabViewPath = `${customTabViewPath}/nested-view`

export const customCollectionMetaTitle = 'Custom Meta Title'

export const customRootViewMetaTitle = 'Custom Root View Meta Title'

export const customDefaultTabMetaTitle = 'Custom Default Tab Meta Title'

export const customVersionsTabMetaTitle = 'Custom Versions Tab Meta Title'

export const customTabAdminDescription = 'Custom Tab Admin Description'

export const customViewMetaTitle = 'Custom Tab Meta Title'

export const customNestedTabViewTitle = 'Custom Nested Tab View'

export const customCollectionParamViewPathBase = '/custom-param'

export const customCollectionParamViewPath = `${customCollectionParamViewPathBase}/:slug`

export const customAdminRoutes: Config['admin']['routes'] = {
  inactivity: '/custom-inactivity',
  logout: '/custom-logout',
}
```

--------------------------------------------------------------------------------

---[FILE: slugs.ts]---
Location: payload-main/test/admin/slugs.ts

```typescript
export const usersCollectionSlug = 'users'
export const customViews1CollectionSlug = 'custom-views-one'
export const customViews2CollectionSlug = 'custom-views-two'
export const reorderTabsSlug = 'reorder-tabs'
export const geoCollectionSlug = 'geo'
export const arrayCollectionSlug = 'array'
export const postsCollectionSlug = 'posts'

export const localizedCollectionSlug = 'localized'
export const group1Collection1Slug = 'group-one-collection-ones'
export const group1Collection2Slug = 'group-one-collection-twos'
export const group2Collection1Slug = 'group-two-collection-ones'
export const group2Collection2Slug = 'group-two-collection-twos'

export const useAsTitleGroupFieldSlug = 'use-as-title-group-field'
export const hiddenCollectionSlug = 'hidden-collection'
export const notInViewCollectionSlug = 'not-in-view-collection'
export const noApiViewCollectionSlug = 'collection-no-api-view'
export const disableDuplicateSlug = 'disable-duplicate'
export const disableCopyToLocale = 'disable-copy-to-locale'
export const uploadCollectionSlug = 'uploads'
export const placeholderCollectionSlug = 'placeholder'

export const uploadTwoCollectionSlug = 'uploads-two'
export const customFieldsSlug = 'custom-fields'

export const listDrawerSlug = 'with-list-drawer'
export const virtualsSlug = 'virtuals'
export const formatDocURLCollectionSlug = 'format-doc-url'
export const collectionSlugs = [
  usersCollectionSlug,
  customViews1CollectionSlug,
  customViews2CollectionSlug,
  geoCollectionSlug,
  arrayCollectionSlug,
  postsCollectionSlug,
  group1Collection1Slug,
  group1Collection2Slug,
  group2Collection1Slug,
  group2Collection2Slug,
  hiddenCollectionSlug,
  noApiViewCollectionSlug,
  customFieldsSlug,
  disableDuplicateSlug,
  listDrawerSlug,
  virtualsSlug,
  formatDocURLCollectionSlug,
  localizedCollectionSlug,
]

export const customGlobalViews1GlobalSlug = 'custom-global-views-one'
export const customGlobalViews2GlobalSlug = 'custom-global-views-two'
export const globalSlug = 'global'
export const group1GlobalSlug = 'group-globals-one'
export const group2GlobalSlug = 'group-globals-two'
export const hiddenGlobalSlug = 'hidden-global'

export const notInViewGlobalSlug = 'not-in-view-global'
export const settingsGlobalSlug = 'settings'
export const noApiViewGlobalSlug = 'global-no-api-view'
export const globalSlugs = [
  customGlobalViews1GlobalSlug,
  customGlobalViews2GlobalSlug,
  globalSlug,
  group1GlobalSlug,
  group2GlobalSlug,
  hiddenGlobalSlug,
  noApiViewGlobalSlug,
]
export const with300DocumentsSlug = 'with300documents'
export const editMenuItemsSlug = 'edit-menu-items'
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.eslint.json]---
Location: payload-main/test/admin/tsconfig.eslint.json

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
Location: payload-main/test/admin/tsconfig.json

```json
{
  "extends": "../tsconfig.json"
}
```

--------------------------------------------------------------------------------

---[FILE: types.d.ts]---
Location: payload-main/test/admin/types.d.ts

```typescript
declare module '*.png' {
  const value: any
  export = value
}
```

--------------------------------------------------------------------------------

---[FILE: Array.ts]---
Location: payload-main/test/admin/collections/Array.ts

```typescript
import type { CollectionConfig } from 'payload'

import { arrayCollectionSlug } from '../slugs.js'

export const Array: CollectionConfig = {
  slug: arrayCollectionSlug,
  fields: [
    {
      name: 'array',
      type: 'array',
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

---[FILE: BaseListFilter.ts]---
Location: payload-main/test/admin/collections/BaseListFilter.ts

```typescript
import type { CollectionConfig } from 'payload'

export const BaseListFilter: CollectionConfig = {
  slug: 'base-list-filters',
  admin: {
    baseListFilter: () => ({
      title: {
        not_equals: 'hide me',
      },
    }),
    useAsTitle: 'title',
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

---[FILE: CustomViews1.ts]---
Location: payload-main/test/admin/collections/CustomViews1.ts

```typescript
import type { CollectionConfig } from 'payload'

import { customViews1CollectionSlug } from '../slugs.js'

export const CustomViews1: CollectionConfig = {
  slug: customViews1CollectionSlug,
  admin: {
    components: {
      Description: '/components/ViewDescription/index.js#ViewDescription',
      views: {
        // This will override the entire Edit View including all nested views, i.e. `/edit/:id/*`
        // To override one specific nested view, use the nested view's slug as the key
        edit: {
          root: {
            Component: '/components/views/CustomEdit/index.js#CustomEditView',
          },
        },
      },
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
  ],
  versions: true,
}
```

--------------------------------------------------------------------------------

---[FILE: CustomViews2.ts]---
Location: payload-main/test/admin/collections/CustomViews2.ts

```typescript
import type { CollectionConfig } from 'payload'

import {
  customCollectionMetaTitle,
  customCollectionParamViewPath,
  customCollectionParamViewPathBase,
  customDefaultTabMetaTitle,
  customEditLabel,
  customNestedTabViewPath,
  customTabComponent,
  customTabLabel,
  customTabViewPath,
  customVersionsTabMetaTitle,
  customViewMetaTitle,
  overriddenDefaultRouteTabLabel,
} from '../shared.js'
import { customViews2CollectionSlug } from '../slugs.js'

export const CustomViews2: CollectionConfig = {
  slug: customViews2CollectionSlug,
  admin: {
    meta: {
      title: customCollectionMetaTitle,
    },
    components: {
      views: {
        edit: {
          api: {
            // Override the default tab component for the default route
            tab: {
              Component: {
                path: '/components/CustomTabComponent/index.js#CustomTabComponent',
                clientProps: {
                  label: overriddenDefaultRouteTabLabel,
                },
              },
            },
          },
          // This will override one specific nested view within the `/edit/:id` route, i.e. `/edit/:id/versions`
          customViewWithParam: {
            Component: '/components/views/CustomTabWithParam/index.js#CustomTabWithParamView',
            tab: {
              href: `${customCollectionParamViewPathBase}/123`,
              label: 'Custom Param View',
            },
            path: customCollectionParamViewPath,
          },
          default: {
            tab: {
              label: customEditLabel,
            },
            meta: {
              title: customDefaultTabMetaTitle,
            },
          },
          myCustomView: {
            Component: '/components/views/CustomTabLabel/index.js#CustomTabLabelView',
            tab: {
              href: '/custom-tab-view',
              label: customTabLabel,
            },
            path: '/custom-tab-view',
            meta: {
              title: customViewMetaTitle,
            },
          },
          myCustomViewWithCustomTab: {
            Component: '/components/views/CustomTabComponent/index.js#CustomTabComponentView',
            tab: {
              Component: {
                path: '/components/CustomTabComponent/index.js#CustomTabComponent',
                clientProps: {
                  label: customTabComponent,
                },
              },
            },
            path: customTabViewPath,
          },
          myCustomViewWithNestedPath: {
            Component: '/components/views/CustomTabNested/index.js#CustomNestedTabView',
            tab: {
              href: customNestedTabViewPath,
              label: 'Custom Nested Tab View',
            },
            path: customNestedTabViewPath,
            meta: {
              title: 'Custom Nested Meta Title',
            },
          },
          versions: {
            Component: '/components/views/CustomVersions/index.js#CustomVersionsView',
            meta: {
              title: customVersionsTabMetaTitle,
            },
          },
        },
      },
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
  ],
  versions: true,
}
```

--------------------------------------------------------------------------------

---[FILE: DisableBulkEdit.ts]---
Location: payload-main/test/admin/collections/DisableBulkEdit.ts

```typescript
import type { CollectionConfig } from 'payload'

export const DisableBulkEdit: CollectionConfig = {
  slug: 'disable-bulk-edit',
  fields: [],
  disableBulkEdit: true,
}
```

--------------------------------------------------------------------------------

---[FILE: DisableCopyToLocale.ts]---
Location: payload-main/test/admin/collections/DisableCopyToLocale.ts

```typescript
import type { CollectionConfig } from 'payload'

import { disableCopyToLocale } from '../slugs.js'

export const DisableCopyToLocale: CollectionConfig = {
  slug: disableCopyToLocale,
  admin: {
    disableCopyToLocale: true,
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

---[FILE: DisableDuplicate.ts]---
Location: payload-main/test/admin/collections/DisableDuplicate.ts

```typescript
import type { CollectionConfig } from 'payload'

import { disableDuplicateSlug } from '../slugs.js'

export const DisableDuplicate: CollectionConfig = {
  slug: disableDuplicateSlug,
  disableDuplicate: true,
  fields: [
    {
      name: 'title',
      type: 'text',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: editMenuItems.ts]---
Location: payload-main/test/admin/collections/editMenuItems.ts

```typescript
import type { CollectionConfig } from 'payload'

import { editMenuItemsSlug } from '../slugs.js'

export const EditMenuItems: CollectionConfig = {
  slug: editMenuItemsSlug,
  admin: {
    components: {
      edit: {
        editMenuItems: [
          {
            path: '/components/EditMenuItems/index.js#EditMenuItems',
          },
          {
            path: '/components/EditMenuItemsServer/index.js#EditMenuItemsServer',
          },
        ],
      },
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

---[FILE: Geo.ts]---
Location: payload-main/test/admin/collections/Geo.ts

```typescript
import type { CollectionConfig } from 'payload'

import { geoCollectionSlug } from '../slugs.js'

export const Geo: CollectionConfig = {
  slug: geoCollectionSlug,
  admin: {
    components: {
      views: {
        edit: {
          api: {
            actions: ['/components/actions/CollectionAPIButton/index.js#CollectionAPIButton'],
          },
          default: {
            actions: ['/components/actions/CollectionEditButton/index.js#CollectionEditButton'],
          },
        },
        list: {
          actions: ['/components/actions/CollectionListButton/index.js#CollectionListButton'],
        },
      },
    },
  },
  fields: [
    {
      name: 'point',
      type: 'point',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: Group1A.ts]---
Location: payload-main/test/admin/collections/Group1A.ts

```typescript
import type { CollectionConfig } from 'payload'

import { group1Collection1Slug } from '../slugs.js'

export const CollectionGroup1A: CollectionConfig = {
  slug: group1Collection1Slug,
  admin: {
    group: 'One',
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

---[FILE: Group1B.ts]---
Location: payload-main/test/admin/collections/Group1B.ts

```typescript
import type { CollectionConfig } from 'payload'

import { group1Collection2Slug } from '../slugs.js'

export const CollectionGroup1B: CollectionConfig = {
  slug: group1Collection2Slug,
  admin: {
    group: 'One',
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

---[FILE: Group2A.ts]---
Location: payload-main/test/admin/collections/Group2A.ts

```typescript
import type { CollectionConfig } from 'payload'

import { group2Collection1Slug } from '../slugs.js'

export const CollectionGroup2A: CollectionConfig = {
  slug: group2Collection1Slug,
  admin: {
    group: 'One',
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

---[FILE: Group2B.ts]---
Location: payload-main/test/admin/collections/Group2B.ts

```typescript
import type { CollectionConfig } from 'payload'

import { group2Collection2Slug } from '../slugs.js'

export const CollectionGroup2B: CollectionConfig = {
  slug: group2Collection2Slug,
  admin: {
    group: 'One',
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

---[FILE: Hidden.ts]---
Location: payload-main/test/admin/collections/Hidden.ts

```typescript
import type { CollectionConfig } from 'payload'

import { hiddenCollectionSlug } from '../slugs.js'

export const CollectionHidden: CollectionConfig = {
  slug: hiddenCollectionSlug,
  admin: {
    hidden: () => true,
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

---[FILE: ListDrawer.ts]---
Location: payload-main/test/admin/collections/ListDrawer.ts

```typescript
import type { CollectionConfig } from 'payload'

import { listDrawerSlug } from '../slugs.js'

export const ListDrawer: CollectionConfig = {
  slug: listDrawerSlug,
  admin: {
    components: {
      beforeListTable: [
        {
          path: '/components/BeforeList/index.js#SelectPostsButton',
        },
      ],
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'description',
      type: 'text',
    },
    {
      name: 'number',
      type: 'number',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: Localized.ts]---
Location: payload-main/test/admin/collections/Localized.ts

```typescript
import type { CollectionConfig } from 'payload'

import { localizedCollectionSlug } from '../slugs.js'

export const Localized: CollectionConfig = {
  slug: localizedCollectionSlug,
  admin: {
    useAsTitle: 'title',
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: NoApiView.ts]---
Location: payload-main/test/admin/collections/NoApiView.ts

```typescript
import type { CollectionConfig } from 'payload'

import { noApiViewCollectionSlug } from '../slugs.js'

export const CollectionNoApiView: CollectionConfig = {
  slug: noApiViewCollectionSlug,
  admin: {
    hideAPIURL: true,
  },
  fields: [],
}
```

--------------------------------------------------------------------------------

---[FILE: NoTimestamps.ts]---
Location: payload-main/test/admin/collections/NoTimestamps.ts

```typescript
import type { CollectionConfig } from 'payload'

export const noTimestampsSlug = 'no-timestamps'

export const NoTimestampsCollection: CollectionConfig = {
  slug: noTimestampsSlug,
  timestamps: false,
  fields: [
    {
      name: 'title',
      type: 'text',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: NotInView.ts]---
Location: payload-main/test/admin/collections/NotInView.ts

```typescript
import type { CollectionConfig } from 'payload'

import { notInViewCollectionSlug } from '../slugs.js'

export const CollectionNotInView: CollectionConfig = {
  slug: notInViewCollectionSlug,
  admin: {
    group: false,
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

---[FILE: Placeholder.ts]---
Location: payload-main/test/admin/collections/Placeholder.ts

```typescript
import type { CollectionConfig } from 'payload'

import { placeholderCollectionSlug } from '../slugs.js'

export const Placeholder: CollectionConfig = {
  slug: placeholderCollectionSlug,
  fields: [
    {
      name: 'defaultSelect',
      type: 'select',
      options: [
        {
          label: 'Option 1',
          value: 'option1',
        },
      ],
    },
    {
      name: 'placeholderSelect',
      type: 'select',
      options: [{ label: 'Option 1', value: 'option1' }],
      admin: {
        placeholder: 'Custom placeholder',
      },
    },
    {
      name: 'defaultRelationship',
      type: 'relationship',
      relationTo: 'posts',
    },
    {
      name: 'placeholderRelationship',
      type: 'relationship',
      relationTo: 'posts',
      admin: {
        placeholder: 'Custom placeholder',
      },
    },
  ],
  versions: true,
}
```

--------------------------------------------------------------------------------

---[FILE: Posts.ts]---
Location: payload-main/test/admin/collections/Posts.ts

```typescript
import type { CollectionConfig } from 'payload'

import { slateEditor } from '@payloadcms/richtext-slate'

import { customTabAdminDescription, slugPluralLabel, slugSingularLabel } from '../shared.js'
import { postsCollectionSlug, uploadCollectionSlug } from '../slugs.js'

export const Posts: CollectionConfig = {
  slug: postsCollectionSlug,
  admin: {
    defaultColumns: [
      'id',
      'number',
      'title',
      'description',
      'demoUIField',
      'disableListColumnTextInRow',
      'someGroup.disableListColumnTextInGroup',
    ],
    description: 'This is a custom collection description.',
    group: 'One',
    listSearchableFields: ['id', 'title', 'description', 'number'],
    components: {
      beforeListTable: [
        '/components/ResetColumns/index.js#ResetDefaultColumnsButton',
        {
          path: '/components/Banner/index.js#Banner',
          clientProps: {
            message: 'BeforeListTable custom component',
          },
        },
      ],
      Description: {
        path: '/components/ViewDescription/index.js#ViewDescription',
      },
      afterListTable: [
        {
          path: '/components/Banner/index.js#Banner',
          clientProps: {
            message: 'AfterListTable custom component',
          },
        },
      ],
      listMenuItems: [
        {
          path: '/components/ListMenuItems/index.js#ListMenuItemsExample',
        },
      ],
      afterList: [
        {
          path: '/components/Banner/index.js#Banner',
          clientProps: {
            message: 'AfterList custom component',
          },
        },
      ],
      beforeList: [
        {
          path: '/components/Banner/index.js#Banner',
          clientProps: {
            message: 'BeforeList custom component',
          },
        },
      ],
      edit: {
        beforeDocumentControls: [
          '/components/BeforeDocumentControls/CustomDraftButton/index.js#CustomDraftButton',
          '/components/BeforeDocumentControls/CustomSaveButton/index.js#CustomSaveButton',
        ],
      },
    },
    pagination: {
      defaultLimit: 5,
      limits: [5, 10, 15],
    },
    meta: {
      description: 'This is a custom meta description for posts',
      openGraph: {
        description: 'This is a custom OG description for posts',
        title: 'This is a custom OG title for posts',
      },
    },
    preview: () => 'https://payloadcms.com',
    useAsTitle: 'title',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'title',
              type: 'text',
            },
            {
              name: 'description',
              type: 'text',
            },
            {
              name: 'number',
              type: 'number',
            },
            {
              name: 'richText',
              type: 'richText',
              editor: slateEditor({
                admin: {
                  elements: ['relationship'],
                },
              }),
            },
            {
              name: 'demoUIField',
              type: 'ui',
              admin: {
                components: {
                  Cell: '/components/DemoUIField/Cell.js#DemoUIFieldCell',
                  Field: '/components/DemoUIField/Field.js#DemoUIField',
                },
              },
              label: 'Demo UI Field',
            },
          ],
          label: 'Tab 1',
          admin: {
            description: customTabAdminDescription,
          },
        },
        {
          label: 'Tab 2',
          fields: [],
          admin: {
            description: () => `t:${customTabAdminDescription}`,
          },
        },
      ],
    },
    {
      name: 'someTextField',
      type: 'text',
    },
    {
      name: 'namedGroup',
      type: 'group',
      fields: [
        {
          name: 'someTextField',
          type: 'text',
        },
      ],
    },
    {
      type: 'group',
      label: 'Unnamed group',
      fields: [
        {
          name: 'textFieldInUnnamedGroup',
          type: 'text',
        },
      ],
    },
    {
      name: 'groupWithCustomCell',
      type: 'group',
      admin: {
        components: {
          Cell: '/components/CustomGroupCell/index.js#CustomGroupCell',
        },
      },
      fields: [
        {
          name: 'nestedTextFieldInGroupWithCustomCell',
          type: 'text',
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          name: 'namedTab',
          fields: [
            {
              name: 'nestedTextFieldInNamedTab',
              type: 'text',
            },
          ],
        },
        {
          label: 'unnamedTab',
          fields: [
            {
              name: 'nestedTextFieldInUnnamedTab',
              type: 'text',
            },
          ],
        },
      ],
    },
    {
      name: 'relationship',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      relationTo: 'posts',
    },
    {
      name: 'users',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      relationTo: 'users',
    },
    {
      name: 'customCell',
      type: 'text',
      admin: {
        components: {
          Cell: '/components/CustomCell/index.js#CustomCell',
        },
      },
    },
    {
      name: 'upload',
      type: 'upload',
      relationTo: uploadCollectionSlug,
    },
    {
      name: 'hiddenField',
      type: 'text',
      hidden: true,
    },
    {
      name: 'adminHiddenField',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'disableListColumnText',
      type: 'text',
      admin: {
        disableListColumn: true,
      },
    },
    {
      name: 'disableListFilterText',
      type: 'text',
      admin: {
        disableListFilter: true,
      },
    },
    {
      name: 'sidebarField',
      type: 'text',
      access: {
        update: () => false,
      },
      admin: {
        description:
          'This is a very long description that takes many characters to complete and hopefully will wrap instead of push the sidebar open, lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum voluptates. Quisquam, voluptatum voluptates.',
        position: 'sidebar',
      },
    },
    {
      type: 'radio',
      name: 'wavelengths',
      defaultValue: 'fm',
      options: [
        {
          label: 'FM',
          value: 'fm',
        },
        {
          label: 'AM',
          value: 'am',
        },
      ],
    },
    {
      type: 'select',
      name: 'selectField',
      hasMany: true,
      defaultValue: ['option1', 'option2'],
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
      name: 'file',
      type: 'text',
    },
    {
      name: 'noReadAccessField',
      type: 'text',
      access: {
        read: () => false,
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'disableListColumnTextInRow',
          type: 'text',
          admin: {
            disableListColumn: true,
          },
        },
      ],
    },
    {
      name: 'someGroup',
      type: 'group',
      fields: [
        {
          name: 'disableListColumnTextInGroup',
          type: 'text',
          admin: {
            disableListColumn: true,
          },
        },
      ],
    },
  ],
  labels: {
    plural: slugPluralLabel,
    singular: slugSingularLabel,
  },
  versions: {
    drafts: true,
  },
}
```

--------------------------------------------------------------------------------

---[FILE: ReorderTabs.ts]---
Location: payload-main/test/admin/collections/ReorderTabs.ts

```typescript
import type { CollectionConfig } from 'payload'

import { reorderTabsSlug } from '../slugs.js'

export const ReorderTabs: CollectionConfig = {
  slug: reorderTabsSlug,
  admin: {
    components: {
      views: {
        edit: {
          default: {
            tab: {
              order: 100,
            },
          },
          api: {
            tab: {
              order: 0,
            },
          },
          test: {
            path: '/test',
            Component: '/components/views/CustomEdit/index.js#CustomEditView',
            tab: {
              label: 'Test',
              href: '/test',
              order: 50,
            },
          },
        },
      },
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
  ],
  versions: true,
}
```

--------------------------------------------------------------------------------

---[FILE: Upload.ts]---
Location: payload-main/test/admin/collections/Upload.ts

```typescript
import type { CollectionConfig } from 'payload'

import { uploadCollectionSlug } from '../slugs.js'

export const UploadCollection: CollectionConfig = {
  slug: uploadCollectionSlug,
  fields: [
    {
      name: 'title',
      type: 'text',
    },
  ],
  upload: {
    imageSizes: [
      {
        name: 'thumbnail',
        width: 100,
        height: 100,
      },
    ],
    adminThumbnail: () =>
      'https://raw.githubusercontent.com/payloadcms/website/refs/heads/main/public/images/universal-truth.jpg',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: UploadTwo.ts]---
Location: payload-main/test/admin/collections/UploadTwo.ts

```typescript
import type { CollectionConfig } from 'payload'

import { uploadTwoCollectionSlug } from '../slugs.js'

export const UploadTwoCollection: CollectionConfig = {
  slug: uploadTwoCollectionSlug,
  fields: [
    {
      name: 'title',
      type: 'text',
    },
  ],
  upload: true,
}
```

--------------------------------------------------------------------------------

---[FILE: UseAsTitleGroupField.ts]---
Location: payload-main/test/admin/collections/UseAsTitleGroupField.ts

```typescript
import type { CollectionConfig } from 'payload'

import { useAsTitleGroupFieldSlug } from '../slugs.js'

export const UseAsTitleGroupField: CollectionConfig = {
  slug: useAsTitleGroupFieldSlug,
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      type: 'group',
      label: 'unnamed group',
      fields: [
        {
          name: 'name',
          type: 'text',
        },
      ],
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: Users.ts]---
Location: payload-main/test/admin/collections/Users.ts

```typescript
import type { CollectionConfig } from 'payload'

import { usersCollectionSlug } from '../slugs.js'

export const Users: CollectionConfig = {
  slug: usersCollectionSlug,
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'textField',
      type: 'text',
    },
    {
      name: 'sidebarField',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: Virtuals.ts]---
Location: payload-main/test/admin/collections/Virtuals.ts

```typescript
import type { CollectionConfig } from 'payload'

import { virtualsSlug } from '../slugs.js'

export const Virtuals: CollectionConfig = {
  slug: virtualsSlug,
  admin: {
    useAsTitle: 'virtualTitleFromPost',
  },
  fields: [
    {
      name: 'virtualTitleFromPost',
      type: 'text',
      virtual: 'post.title',
    },
    {
      name: 'virtualText',
      type: 'text',
      virtual: true,
    },
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: With300Documents.ts]---
Location: payload-main/test/admin/collections/With300Documents.ts

```typescript
import type { CollectionConfig } from 'payload'

import { with300DocumentsSlug } from '../slugs.js'

export const with300Documents: CollectionConfig = {
  slug: with300DocumentsSlug,
  admin: {
    useAsTitle: 'text',
  },
  fields: [
    {
      name: 'text',
      type: 'text',
    },
    {
      name: 'selfRelation',
      type: 'relationship',
      relationTo: with300DocumentsSlug,
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: AfterInput.tsx]---
Location: payload-main/test/admin/collections/CustomFields/AfterInput.tsx
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
Location: payload-main/test/admin/collections/CustomFields/BeforeInput.tsx
Signals: React

```typescript
'use client'

import React from 'react'

export const BeforeInput: React.FC = () => {
  return <div className="before-input">#before-input</div>
}
```

--------------------------------------------------------------------------------

---[FILE: CustomError.tsx]---
Location: payload-main/test/admin/collections/CustomFields/CustomError.tsx
Signals: React

```typescript
'use client'

import { useField, useFormFields, useFormSubmitted } from '@payloadcms/ui'
import React from 'react'

export const CustomError: React.FC<any> = (props) => {
  const { path: pathFromProps } = props
  const submitted = useFormSubmitted()
  const { path } = useField(pathFromProps)
  const field = useFormFields(([fields]) => (fields && fields?.[path]) || null)
  const { valid } = field || {}

  const showError = submitted && !valid

  if (showError) {
    return <div className="custom-error">#custom-error</div>
  }

  return null
}
```

--------------------------------------------------------------------------------

````
