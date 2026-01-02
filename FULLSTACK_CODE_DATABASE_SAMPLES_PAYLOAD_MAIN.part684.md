---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 684
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 684 of 695)

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
Location: payload-main/test/versions/seed.ts

```typescript
import { buildEditorState, type DefaultNodeTypes } from '@payloadcms/richtext-lexical'
import path from 'path'
import { getFileByPath, type Payload } from 'payload'
import { fileURLToPath } from 'url'

import type { DraftPost } from './payload-types.js'

import { devUser } from '../credentials.js'
import { executePromises } from '../helpers/executePromises.js'
import { generateLexicalData } from './collections/Diff/generateLexicalData.js'
import {
  autosaveWithDraftValidateSlug,
  diffCollectionSlug,
  draftCollectionSlug,
  media2CollectionSlug,
  mediaCollectionSlug,
} from './slugs.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export async function seed(_payload: Payload, parallel: boolean = false) {
  const blocksField: DraftPost['blocksField'] = [
    {
      blockType: 'block',
      localized: null,
      text: 'Hello World',
    },
  ]

  const imageFilePath = path.resolve(dirname, './image.jpg')
  const imageFile = await getFileByPath(imageFilePath)

  const { id: uploadedImage } = await _payload.create({
    collection: mediaCollectionSlug,
    data: {},
    file: imageFile,
  })

  const { id: uploadedImageMedia2 } = await _payload.create({
    collection: media2CollectionSlug,
    data: {},
    file: imageFile,
  })

  const imageFilePath2 = path.resolve(dirname, './image.png')
  const imageFile2 = await getFileByPath(imageFilePath2)

  const { id: uploadedImage2 } = await _payload.create({
    collection: mediaCollectionSlug,
    data: {},
    file: imageFile2,
  })

  const { id: uploadedImage2Media2 } = await _payload.create({
    collection: media2CollectionSlug,
    data: {},
    file: imageFile2,
  })

  await executePromises(
    [
      () =>
        _payload.create({
          collection: 'users',
          data: {
            email: devUser.email,
            password: devUser.password,
          },
          depth: 0,
          overrideAccess: true,
        }),
      () =>
        _payload.create({
          collection: draftCollectionSlug,
          data: {
            blocksField,
            description: 'Description',
            radio: 'test',
            title: 'Draft Title',
          },
          depth: 0,
          overrideAccess: true,
          draft: true,
        }),
    ],
    parallel,
  )

  const { id: manyDraftsID } = await _payload.create({
    collection: draftCollectionSlug,
    data: {
      blocksField,
      description: 'Description',
      radio: 'test',
      title: 'Title With Many Versions',
    },
    depth: 0,
    overrideAccess: true,
    draft: true,
  })

  for (let i = 0; i < 10; i++) {
    await _payload.update({
      id: manyDraftsID,
      collection: draftCollectionSlug,
      data: {
        title: `Title With Many Versions ${i + 2}`,
      },
      depth: 0,
      overrideAccess: true,
    })
  }

  const draft2 = await _payload.create({
    collection: draftCollectionSlug,
    data: {
      _status: 'published',
      blocksField,
      description: 'Description',
      radio: 'test',
      title: 'Published Title',
    },
    depth: 0,
    overrideAccess: true,
    draft: false,
  })

  const draft3 = await _payload.create({
    collection: draftCollectionSlug,
    data: {
      _status: 'published',
      blocksField,
      description: 'Description2',
      radio: 'test',
      title: 'Another Published Title',
    },
    depth: 0,
    overrideAccess: true,
    draft: false,
  })

  await _payload.create({
    collection: autosaveWithDraftValidateSlug,
    data: {
      title: 'Initial seeded title',
    },
  })

  const { id: doc1ID } = await _payload.create({
    collection: 'text',
    data: {
      text: 'Document 1',
    },
  })

  const { id: doc2ID } = await _payload.create({
    collection: 'text',
    data: {
      text: 'Document 2',
    },
  })

  const diffDocDraft = await _payload.create({
    collection: diffCollectionSlug,
    locale: 'en',
    data: {
      _status: 'draft',
      text: 'Draft 1',
    },
    depth: 0,
  })

  await _payload.update({
    collection: diffCollectionSlug,
    locale: 'en',
    data: {
      _status: 'draft',
      text: 'Draft 2',
    },
    depth: 0,
    id: diffDocDraft.id,
  })

  await _payload.update({
    collection: diffCollectionSlug,
    locale: 'en',
    data: {
      _status: 'draft',
      text: 'Draft 3',
    },
    depth: 0,
    id: diffDocDraft.id,
  })
  await _payload.update({
    collection: diffCollectionSlug,
    locale: 'en',
    data: {
      _status: 'draft',
      text: 'Draft 4',
    },
    depth: 0,
    id: diffDocDraft.id,
  })

  const diffDoc = await _payload.update({
    collection: diffCollectionSlug,
    locale: 'en',
    id: diffDocDraft.id,
    data: {
      _status: 'published',
      array: [
        {
          textInArray: 'textInArray',
        },
      ],
      arrayLocalized: [
        {
          textInArrayLocalized: 'textInArrayLocalized',
        },
      ],
      blocks: [
        {
          blockType: 'TextBlock',
          textInBlock: 'textInBlock',
        },
        {
          blockType: 'CollapsibleBlock',
          textInCollapsibleInCollapsibleBlock: 'textInCollapsibleInCollapsibleBlock',
          textInRowInCollapsibleBlock: 'textInRowInCollapsibleBlock',
        },
        {
          blockType: 'TabsBlock',
          namedTab1InBlock: {
            textInNamedTab1InBlock: 'textInNamedTab1InBlock',
          },
          textInUnnamedTab2InBlock: 'textInUnnamedTab2InBlock',
          textInRowInUnnamedTab2InBlock: 'textInRowInUnnamedTab2InBlock',
          textInUnnamedTab2InBlockAccessFalse: 'textInUnnamedTab2InBlockAccessFalse',
        },
      ],
      checkbox: true,
      code: 'code',
      date: '2021-04-01T00:00:00.000Z',
      email: 'email@email.com',
      textInUnnamedGroup: 'textInUnnamedGroup',
      textInUnnamedLabeledGroup: 'textInUnnamedLabeledGroup',
      group: {
        textInGroup: 'textInGroup',
      },
      namedTab1: {
        textInNamedTab1: 'textInNamedTab1',
        textInNamedTab1ReadFalse: 'textInNamedTab1ReadFalse',
        textInNamedTab1UpdateFalse: 'textInNamedTab1UpdateFalse',
      },
      number: 1,
      point: [1, 2],
      json: {
        text: 'json',
        number: 1,
        boolean: true,
        array: [
          {
            textInArrayInJson: 'textInArrayInJson',
          },
        ],
      },
      radio: 'option1',
      relationship: manyDraftsID,
      relationshipHasMany: [manyDraftsID],
      richtext: generateLexicalData({
        mediaID: uploadedImage,
        textID: doc1ID,
        updated: false,
      }) as any,
      richtextWithCustomDiff: buildEditorState<DefaultNodeTypes>({
        text: 'richtextWithCustomDiff',
      }),
      select: 'option1',
      text: 'text',
      textArea: 'textArea',
      textInCollapsible: 'textInCollapsible',
      textInRow: 'textInRow',
      textInUnnamedTab2: 'textInUnnamedTab2',
      textInRowInUnnamedTab: 'textInRowInUnnamedTab',
      textInRowInUnnamedTabUpdateFalse: 'textInRowInUnnamedTabUpdateFalse',

      textCannotRead: 'textCannotRead',
      relationshipPolymorphic: {
        relationTo: 'text',
        value: doc1ID,
      },
      relationshipHasManyPolymorphic: [
        {
          relationTo: 'text',
          value: doc1ID,
        },
      ],
      relationshipHasManyPolymorphic2: [
        {
          relationTo: 'text',
          value: doc1ID,
        },
        {
          relationTo: draftCollectionSlug,
          value: draft2.id,
        },
      ],
      upload: uploadedImage,
      uploadHasMany: [uploadedImage],
    },
    depth: 0,
  })

  const pointGeoJSON: any = {
    type: 'Point',
    coordinates: [1, 3],
  }

  await _payload.db.updateOne({
    collection: diffCollectionSlug,
    id: diffDoc.id,
    returning: false,
    data: {
      point: pointGeoJSON,
      createdAt: new Date(new Date(diffDoc.createdAt).getTime() - 2 * 60 * 10000).toISOString(),
      updatedAt: new Date(new Date(diffDoc.updatedAt).getTime() - 2 * 60 * 10000).toISOString(),
    },
  })

  const versions = await _payload.findVersions({
    collection: diffCollectionSlug,
    depth: 0,
    limit: 50,
    sort: '-createdAt',
  })

  let i = 0
  for (const version of versions.docs) {
    i += 1
    const date = new Date(new Date(version.createdAt).getTime() - 2 * 60 * 10000 * i).toISOString()
    await _payload.db.updateVersion({
      id: version.id,
      collection: diffCollectionSlug,
      returning: false,
      versionData: {
        createdAt: date,
        updatedAt: date,
      } as any,
    })
  }

  const updatedDiffDoc = await _payload.update({
    id: diffDoc.id,
    collection: diffCollectionSlug,
    locale: 'en',
    data: {
      _status: 'published',
      array: [
        {
          textInArray: 'textInArray2',
        },
      ],
      arrayLocalized: [
        {
          textInArrayLocalized: 'textInArrayLocalized2',
        },
      ],
      blocks: [
        {
          blockType: 'TextBlock',
          textInBlock: 'textInBlock2',
        },
        {
          blockType: 'CollapsibleBlock',
          textInCollapsibleInCollapsibleBlock: 'textInCollapsibleInCollapsibleBlock2',
          textInRowInCollapsibleBlock: 'textInRowInCollapsibleBlock2',
        },
        {
          blockType: 'TabsBlock',
          namedTab1InBlock: {
            textInNamedTab1InBlock: 'textInNamedTab1InBlock2',
          },
          textInUnnamedTab2InBlock: 'textInUnnamedTab2InBlock2',
          textInRowInUnnamedTab2InBlock: 'textInRowInUnnamedTab2InBlock2',
          textInUnnamedTab2InBlockAccessFalse: 'textInUnnamedTab2InBlockAccessFalse2',
        },
      ],
      checkbox: false,
      code: 'code2',
      date: '2023-04-01T00:00:00.000Z',
      email: 'email2@email.com',
      textInUnnamedGroup: 'textInUnnamedGroup2',
      textInUnnamedLabeledGroup: 'textInUnnamedLabeledGroup2',
      group: {
        textInGroup: 'textInGroup2',
      },
      namedTab1: {
        textInNamedTab1: 'textInNamedTab12',
        textInNamedTab1ReadFalse: 'textInNamedTab1ReadFalse2',
        textInNamedTab1UpdateFalse: 'textInNamedTab1UpdateFalse2',
      },
      number: 2,
      json: {
        text: 'json2',
        number: 2,
        boolean: true,
        array: [
          {
            textInArrayInJson: 'textInArrayInJson2',
          },
        ],
      },
      point: pointGeoJSON,
      radio: 'option2',
      relationship: draft2.id,
      relationshipHasMany: [manyDraftsID, draft2.id],
      relationshipPolymorphic: {
        relationTo: draftCollectionSlug,
        value: draft2.id,
      },
      relationshipHasManyPolymorphic: [
        {
          relationTo: 'text',
          value: doc1ID,
        },
        {
          relationTo: draftCollectionSlug,
          value: draft2.id,
        },
      ],
      relationshipHasManyPolymorphic2: [
        {
          relationTo: 'text',
          value: doc1ID,
        },
        {
          relationTo: draftCollectionSlug,
          value: draft3.id,
        },
      ],
      richtext: generateLexicalData({
        mediaID: uploadedImage2,
        textID: doc2ID,
        updated: true,
      }) as any,
      richtextWithCustomDiff: buildEditorState<DefaultNodeTypes>({
        text: 'richtextWithCustomDiff2',
      }),
      select: 'option2',
      text: 'text2',
      textArea: 'textArea2',
      textInCollapsible: 'textInCollapsible2',
      textInRow: 'textInRow2',
      textCannotRead: 'textCannotRead2',
      textInUnnamedTab2: 'textInUnnamedTab22',
      textInRowInUnnamedTab: 'textInRowInUnnamedTab2',
      textInRowInUnnamedTabUpdateFalse: 'textInRowInUnnamedTabUpdateFalse2',

      upload: uploadedImage2,
      uploadHasMany: [uploadedImage, uploadedImage2],
    },
    depth: 0,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: slugs.ts]---
Location: payload-main/test/versions/slugs.ts

```typescript
export const autosaveCollectionSlug = 'autosave-posts'
export const autosaveWithMultiSelectCollectionSlug = 'autosave-multi-select-posts'

export const autosaveWithDraftButtonSlug = 'autosave-with-draft-button-posts'

export const autosaveWithDraftValidateSlug = 'autosave-with-validate-posts'

export const customIDSlug = 'custom-ids'

export const draftCollectionSlug = 'draft-posts'

export const draftsNoReadVersionsSlug = 'drafts-no-read-versions'

export const draftWithValidateCollectionSlug = 'draft-with-validate-posts'
export const draftWithMaxCollectionSlug = 'draft-with-max-posts'

export const draftWithChangeHookCollectionSlug = 'draft-posts-with-change-hook'

export const postCollectionSlug = 'posts'

export const diffCollectionSlug = 'diff'
export const mediaCollectionSlug = 'media'
export const media2CollectionSlug = 'media2'

export const versionCollectionSlug = 'version-posts'

export const disablePublishSlug = 'disable-publish'
export const errorOnUnpublishSlug = 'error-on-unpublish'

export const disablePublishGlobalSlug = 'disable-publish-global'

export const textCollectionSlug = 'text'

export const collectionSlugs = [
  autosaveCollectionSlug,
  autosaveWithMultiSelectCollectionSlug,
  draftCollectionSlug,
  draftWithChangeHookCollectionSlug,
  postCollectionSlug,
  diffCollectionSlug,
  mediaCollectionSlug,
  media2CollectionSlug,
  versionCollectionSlug,
  textCollectionSlug,
]

export const autoSaveGlobalSlug = 'autosave-global'

export const autosaveWithDraftButtonGlobal = 'autosave-with-draft-button-global'

export const draftGlobalSlug = 'draft-global'

export const draftUnlimitedGlobalSlug = 'draft-unlimited-global'

export const draftWithMaxGlobalSlug = 'draft-with-max-global'

export const globalSlugs = [autoSaveGlobalSlug, draftGlobalSlug]

export const localizedCollectionSlug = 'localized-posts'

export const localizedGlobalSlug = 'localized-global'
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.eslint.json]---
Location: payload-main/test/versions/tsconfig.eslint.json

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
Location: payload-main/test/versions/tsconfig.json

```json
{
  "extends": "../tsconfig.json"
}
```

--------------------------------------------------------------------------------

---[FILE: Autosave.ts]---
Location: payload-main/test/versions/collections/Autosave.ts

```typescript
import type { CollectionConfig } from 'payload'

import { autosaveCollectionSlug, postCollectionSlug } from '../slugs.js'

const AutosavePosts: CollectionConfig = {
  slug: autosaveCollectionSlug,
  labels: {
    singular: 'Autosave Post',
    plural: 'Autosave Posts',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'description', 'createdAt', '_status'],
  },
  versions: {
    maxPerDoc: 35,
    drafts: {
      autosave: {
        interval: 100,
      },
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
    readVersions: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      unique: true,
      localized: true,
    },
    {
      name: 'relationship',
      type: 'relationship',
      relationTo: postCollectionSlug,
      admin: {
        components: {
          Label: './elements/CustomFieldLabel/index.tsx#CustomFieldLabel',
        },
      },
    },
    {
      name: 'computedTitle',
      label: 'Computed Title',
      type: 'text',
      hooks: {
        beforeChange: [({ data }) => data?.title],
      },
    },
    {
      name: 'richText',
      type: 'richText',
    },
    {
      name: 'json',
      type: 'json',
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: true,
    },
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

export default AutosavePosts
```

--------------------------------------------------------------------------------

---[FILE: AutosaveWithDraftButton.ts]---
Location: payload-main/test/versions/collections/AutosaveWithDraftButton.ts

```typescript
import type { CollectionConfig } from 'payload'

import { autosaveWithDraftButtonSlug } from '../slugs.js'

const AutosaveWithDraftButtonPosts: CollectionConfig = {
  slug: autosaveWithDraftButtonSlug,
  labels: {
    singular: 'Autosave with Draft Button Post',
    plural: 'Autosave with Draft Button Posts',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'subtitle', 'createdAt', '_status'],
  },
  versions: {
    drafts: {
      autosave: {
        showSaveDraftButton: true,
        interval: 1000,
      },
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
  ],
}

export default AutosaveWithDraftButtonPosts
```

--------------------------------------------------------------------------------

---[FILE: AutosaveWithDraftValidate.ts]---
Location: payload-main/test/versions/collections/AutosaveWithDraftValidate.ts

```typescript
import type { CollectionConfig } from 'payload'

import { autosaveWithDraftValidateSlug } from '../slugs.js'

const AutosaveWithDraftValidate: CollectionConfig = {
  slug: autosaveWithDraftValidateSlug,
  labels: {
    singular: 'Autosave with Draft Validate',
    plural: 'Autosave with Draft Validate',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'subtitle', 'createdAt', '_status'],
  },
  versions: {
    maxPerDoc: 35,
    drafts: {
      validate: true,
      autosave: {
        interval: 250,
      },
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
  ],
}

export default AutosaveWithDraftValidate
```

--------------------------------------------------------------------------------

---[FILE: AutosaveWithMultiSelect.ts]---
Location: payload-main/test/versions/collections/AutosaveWithMultiSelect.ts

```typescript
import type { CollectionConfig } from 'payload'

import { autosaveWithMultiSelectCollectionSlug } from '../slugs.js'

const AutosaveWithMultiSelectPosts: CollectionConfig = {
  slug: autosaveWithMultiSelectCollectionSlug,
  versions: {
    drafts: {
      autosave: {
        interval: 2000,
      },
    },
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      unique: true,
      localized: true,
    },
    {
      name: 'tag',
      type: 'select',
      options: ['blog', 'essay', 'portfolio'],
      hasMany: true,
    },
  ],
}

export default AutosaveWithMultiSelectPosts
```

--------------------------------------------------------------------------------

---[FILE: CustomIDs.ts]---
Location: payload-main/test/versions/collections/CustomIDs.ts

```typescript
import type { CollectionConfig } from 'payload'

import { customIDSlug } from '../slugs.js'

const CustomIDs: CollectionConfig = {
  slug: customIDSlug,
  admin: {
    defaultColumns: ['id', 'title', 'createdAt'],
    useAsTitle: 'id',
  },
  fields: [
    {
      name: 'id',
      type: 'text',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title',
    },
  ],
  versions: {
    drafts: false,
    maxPerDoc: 2,
  },
}

export default CustomIDs
```

--------------------------------------------------------------------------------

---[FILE: DisablePublish.ts]---
Location: payload-main/test/versions/collections/DisablePublish.ts

```typescript
import type { CollectionConfig } from 'payload'

import { disablePublishSlug } from '../slugs.js'

const DisablePublish: CollectionConfig = {
  slug: disablePublishSlug,
  access: {
    create: ({ data }) => {
      return data?._status !== 'published'
    },
    update: ({ data }) => {
      return data?._status !== 'published'
    },
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
  ],
  versions: {
    drafts: true,
  },
}

export default DisablePublish
```

--------------------------------------------------------------------------------

---[FILE: Drafts.ts]---
Location: payload-main/test/versions/collections/Drafts.ts

```typescript
import type { CollectionConfig } from 'payload'

import { draftCollectionSlug } from '../slugs.js'

const DraftPosts: CollectionConfig = {
  slug: draftCollectionSlug,
  access: {
    update: () => {
      return {
        restrictedToUpdate: {
          not_equals: true,
        },
      }
    },
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
    readVersions: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    components: {
      edit: {
        PublishButton: '/elements/CustomSaveButton/index.js#CustomPublishButton',
      },
      views: {
        edit: {
          version: {
            actions: ['/elements/CollectionVersionButton/index.js'],
          },
          versions: {
            actions: ['/elements/CollectionVersionsButton/index.js'],
          },
        },
      },
    },
    defaultColumns: ['title', 'description', 'createdAt', '_status'],
    useAsTitle: 'title',
  },
  fields: [
    {
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          localized: true,
          required: true,
          unique: true,
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      required: true,
    },
    {
      name: 'radio',
      type: 'radio',
      options: [
        {
          label: { en: 'Test en', es: 'Test es' },
          value: 'test',
        },
      ],
    },
    {
      name: 'select',
      type: 'select',
      hasMany: true,
      options: [
        {
          label: { en: 'Test1 en', es: 'Test1 es' },
          value: 'test1',
        },
        {
          label: { en: 'Test2 en', es: 'Test2 es' },
          value: 'test2',
        },
      ],
    },
    {
      name: 'blocksField',
      type: 'blocks',
      blocks: [
        {
          slug: 'block',
          fields: [
            {
              name: 'text',
              type: 'text',
            },
            {
              name: 'localized',
              type: 'text',
              localized: true,
            },
          ],
        },
      ],
    },
    {
      name: 'relation',
      type: 'relationship',
      relationTo: draftCollectionSlug,
    },
    {
      name: 'restrictedToUpdate',
      type: 'checkbox',
    },
  ],
  versions: {
    drafts: {
      schedulePublish: {
        timeFormat: 'HH:mm',
      },
    },
    maxPerDoc: 0,
  },
}

export default DraftPosts
```

--------------------------------------------------------------------------------

---[FILE: DraftsNoReadVersions.ts]---
Location: payload-main/test/versions/collections/DraftsNoReadVersions.ts

```typescript
import type { CollectionConfig } from 'payload'

import { draftsNoReadVersionsSlug } from '../slugs.js'

const DraftsNoReadVersions: CollectionConfig = {
  slug: draftsNoReadVersionsSlug,
  access: {
    readVersions: () => false,
  },
  admin: {
    defaultColumns: ['title', 'createdAt', '_status'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
  versions: {
    drafts: true,
  },
}

export default DraftsNoReadVersions
```

--------------------------------------------------------------------------------

---[FILE: DraftsWithChangeHook.ts]---
Location: payload-main/test/versions/collections/DraftsWithChangeHook.ts

```typescript
import type { CollectionConfig } from 'payload'

import { APIError } from 'payload'

import { draftWithChangeHookCollectionSlug } from '../slugs.js'

const DraftWithChangeHookPosts: CollectionConfig = {
  slug: draftWithChangeHookCollectionSlug,
  admin: {
    defaultColumns: ['title', 'description', 'createdAt', '_status'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      localized: true,
      required: true,
      unique: true,
      hooks: {
        beforeChange: [
          (args) => {
            if (args?.data?.title?.includes('Invalid')) {
              throw new APIError('beforeChange hook threw APIError 422', 422)
            }
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      required: true,
    },
  ],
  versions: {
    drafts: {
      schedulePublish: {
        timeFormat: 'HH:mm',
      },
    },
    maxPerDoc: 0,
  },
}

export default DraftWithChangeHookPosts
```

--------------------------------------------------------------------------------

---[FILE: DraftsWithMax.ts]---
Location: payload-main/test/versions/collections/DraftsWithMax.ts

```typescript
import type { CollectionConfig } from 'payload'

import { draftWithMaxCollectionSlug } from '../slugs.js'

const DraftWithMaxPosts: CollectionConfig = {
  slug: draftWithMaxCollectionSlug,
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
    readVersions: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    components: {
      edit: {
        PublishButton: '/elements/CustomSaveButton/index.js#CustomPublishButton',
      },
      views: {
        edit: {
          version: {
            actions: ['/elements/CollectionVersionButton/index.js'],
          },
          versions: {
            actions: ['/elements/CollectionVersionsButton/index.js'],
          },
        },
      },
    },
    defaultColumns: ['title', 'description', 'createdAt', '_status'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      localized: true,
      required: true,
      unique: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      required: true,
    },
    {
      name: 'radio',
      type: 'radio',
      options: [
        {
          label: { en: 'Test en', es: 'Test es' },
          value: 'test',
        },
      ],
    },
    {
      name: 'select',
      type: 'select',
      hasMany: true,
      options: [
        {
          label: { en: 'Test1 en', es: 'Test1 es' },
          value: 'test1',
        },
        {
          label: { en: 'Test2 en', es: 'Test2 es' },
          value: 'test2',
        },
      ],
    },
    {
      name: 'blocksField',
      type: 'blocks',
      blocks: [
        {
          slug: 'block',
          fields: [
            {
              name: 'text',
              type: 'text',
            },
            {
              name: 'localized',
              type: 'text',
              localized: true,
            },
          ],
        },
      ],
    },
    {
      name: 'relation',
      type: 'relationship',
      relationTo: draftWithMaxCollectionSlug,
    },
  ],
  versions: {
    drafts: true,
    maxPerDoc: 1,
  },
}

export default DraftWithMaxPosts
```

--------------------------------------------------------------------------------

---[FILE: DraftsWithValidate.ts]---
Location: payload-main/test/versions/collections/DraftsWithValidate.ts

```typescript
import type { CollectionConfig } from 'payload'

import { draftWithValidateCollectionSlug } from '../slugs.js'

const DraftsWithValidate: CollectionConfig = {
  slug: draftWithValidateCollectionSlug,
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
  ],
  versions: {
    drafts: {
      validate: true,
    },
  },
}

export default DraftsWithValidate
```

--------------------------------------------------------------------------------

---[FILE: ErrorOnUnpublish.ts]---
Location: payload-main/test/versions/collections/ErrorOnUnpublish.ts

```typescript
import type { CollectionConfig } from 'payload'

import { APIError } from 'payload'

import { errorOnUnpublishSlug } from '../slugs.js'

const ErrorOnUnpublish: CollectionConfig = {
  slug: errorOnUnpublishSlug,
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
  ],
  versions: {
    drafts: true,
  },
  hooks: {
    beforeValidate: [
      ({ data, originalDoc }) => {
        if (data?._status === 'draft' && originalDoc?._status === 'published') {
          throw new APIError('Custom error on unpublish', 400, {}, true)
        }
      },
    ],
  },
}

export default ErrorOnUnpublish
```

--------------------------------------------------------------------------------

---[FILE: Localized.ts]---
Location: payload-main/test/versions/collections/Localized.ts

```typescript
import type { CollectionConfig } from 'payload'

import { localizedCollectionSlug } from '../slugs.js'

const LocalizedPosts: CollectionConfig = {
  slug: localizedCollectionSlug,
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'text',
      type: 'text',
      localized: true,
    },
    {
      name: 'description',
      type: 'text',
      localized: true,
    },
    {
      name: 'blocks',
      type: 'blocks',
      blocks: [
        {
          slug: 'block',
          fields: [
            {
              name: 'array',
              type: 'array',
              localized: true,
              fields: [
                {
                  name: 'relationship',
                  type: 'relationship',
                  relationTo: 'posts',
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

export default LocalizedPosts
```

--------------------------------------------------------------------------------

---[FILE: Media.ts]---
Location: payload-main/test/versions/collections/Media.ts

```typescript
import type { CollectionConfig } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

import { mediaCollectionSlug } from '../slugs.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  fields: [],
  slug: mediaCollectionSlug,
  upload: {
    staticDir: path.resolve(dirname, './uploads'),
  },
}
```

--------------------------------------------------------------------------------

---[FILE: Media2.ts]---
Location: payload-main/test/versions/collections/Media2.ts

```typescript
import type { CollectionConfig } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

import { media2CollectionSlug } from '../slugs.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media2: CollectionConfig = {
  fields: [],
  slug: media2CollectionSlug,
  upload: {
    staticDir: path.resolve(dirname, './uploads2'),
  },
}
```

--------------------------------------------------------------------------------

---[FILE: Posts.ts]---
Location: payload-main/test/versions/collections/Posts.ts

```typescript
import type { CollectionConfig } from 'payload'

import {
  autosaveCollectionSlug,
  draftCollectionSlug,
  postCollectionSlug,
  versionCollectionSlug,
} from '../slugs.js'

const Posts: CollectionConfig = {
  slug: postCollectionSlug,
  fields: [
    {
      name: 'relationToAutosaves',
      type: 'relationship',
      relationTo: autosaveCollectionSlug,
    },
    {
      name: 'relationToVersions',
      type: 'relationship',
      relationTo: versionCollectionSlug,
    },
    {
      name: 'relationToDrafts',
      type: 'relationship',
      relationTo: draftCollectionSlug,
    },
  ],
}

export default Posts
```

--------------------------------------------------------------------------------

---[FILE: Text.ts]---
Location: payload-main/test/versions/collections/Text.ts

```typescript
import type { CollectionConfig } from 'payload'

import { textCollectionSlug } from '../slugs.js'

export const TextCollection: CollectionConfig = {
  slug: textCollectionSlug,
  admin: {
    useAsTitle: 'text',
  },
  fields: [
    {
      name: 'text',
      type: 'text',
      required: true,
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: Versions.ts]---
Location: payload-main/test/versions/collections/Versions.ts

```typescript
import type { CollectionConfig } from 'payload'

import { versionCollectionSlug } from '../slugs.js'

const VersionPosts: CollectionConfig = {
  slug: versionCollectionSlug,
  access: {
    read: ({ req: { user } }) => {
      if (user) {
        return true
      }

      return false
    },
    readVersions: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    defaultColumns: ['title', 'description', 'createdAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      localized: true,
      required: true,
      unique: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      required: true,
    },
  ],
  versions: {
    drafts: false,
    maxPerDoc: 2,
  },
}

export default VersionPosts
```

--------------------------------------------------------------------------------

````
