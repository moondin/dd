---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 679
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 679 of 695)

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
Location: payload-main/test/uploads/shared.ts

```typescript
export const usersSlug = 'users'
export const mediaSlug = 'media'
export const relationSlug = 'relation'
export const audioSlug = 'audio'
export const enlargeSlug = 'enlarge'
export const withoutEnlargeSlug = 'without-enlarge'
export const focalNoSizesSlug = 'focal-no-sizes'
export const focalOnlySlug = 'focal-only'
export const imageSizesOnlySlug = 'image-sizes-only'
export const reduceSlug = 'reduce'
export const relationPreviewSlug = 'relation-preview'
export const mediaWithRelationPreviewSlug = 'media-with-relation-preview'
export const mediaWithoutRelationPreviewSlug = 'media-without-relation-preview'
export const mediaWithoutCacheTagsSlug = 'media-without-cache-tags'
export const adminUploadControlSlug = 'admin-upload-control'
export const adminThumbnailFunctionSlug = 'admin-thumbnail-function'
export const adminThumbnailWithSearchQueries = 'admin-thumbnail-with-search-queries'
export const adminThumbnailSizeSlug = 'admin-thumbnail-size'
export const unstoredMediaSlug = 'unstored-media'
export const versionSlug = 'versions'
export const animatedTypeMedia = 'animated-type-media'
export const customUploadFieldSlug = 'custom-upload-field'
export const hideFileInputOnCreateSlug = 'hide-file-input-on-create'
export const withMetadataSlug = 'with-meta-data'
export const withoutMetadataSlug = 'without-meta-data'
export const withOnlyJPEGMetadataSlug = 'with-only-jpeg-meta-data'
export const customFileNameMediaSlug = 'custom-file-name-media'
export const allowListMediaSlug = 'allow-list-media'
export const restrictFileTypesSlug = 'restrict-file-types'
export const noRestrictFileTypesSlug = 'no-restrict-file-types'
export const noRestrictFileMimeTypesSlug = 'no-restrict-file-mime-types'
export const skipSafeFetchMediaSlug = 'skip-safe-fetch-media'
export const skipSafeFetchHeaderFilterSlug = 'skip-safe-fetch-header-filter'
export const skipAllowListSafeFetchMediaSlug = 'skip-allow-list-safe-fetch-media'
export const listViewPreviewSlug = 'list-view-preview'
export const threeDimensionalSlug = 'three-dimensional'
export const constructorOptionsSlug = 'constructor-options'
export const bulkUploadsSlug = 'bulk-uploads'
export const restrictedMimeTypesSlug = 'restricted-mime-types'
export const pdfOnlySlug = 'pdf-only'

export const fileMimeTypeSlug = 'file-mime-type'
export const svgOnlySlug = 'svg-only'
export const anyImagesSlug = 'any-images'
export const mediaWithoutDeleteAccessSlug = 'media-without-delete-access'
export const mediaWithImageSizeAdminPropsSlug = 'media-with-image-size-admin-props'
export const uploads2Slug = 'uploads-2'
```

--------------------------------------------------------------------------------

---[FILE: startMockCorsServer.ts]---
Location: payload-main/test/uploads/startMockCorsServer.ts

```typescript
import fs from 'fs'
import http from 'http'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const startMockCorsServer = () => {
  const server = http.createServer((req, res) => {
    const filePath = path.resolve(dirname, 'test-image.jpg')

    res.setHeader('Content-Type', 'image/jpeg')
    fs.createReadStream(filePath).pipe(res)
  })

  server.listen(4000, () => {
    console.log('Mock CORS server running on http://localhost:4000')
  })

  return server
}
```

--------------------------------------------------------------------------------

---[FILE: svgWithXml.svg]---
Location: payload-main/test/uploads/svgWithXml.svg

```text
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg"
   width="1"
   height="1">
    <rect
       width="1"
       height="1"
       style="fill:#666;" />
</svg>
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.eslint.json]---
Location: payload-main/test/uploads/tsconfig.eslint.json

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
Location: payload-main/test/uploads/tsconfig.json

```json
{
  "extends": "../tsconfig.json"
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/uploads/collections/AdminThumbnailFunction/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

import { adminThumbnailFunctionSlug } from '../../shared.js'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const AdminThumbnailFunction: CollectionConfig = {
  slug: adminThumbnailFunctionSlug,
  upload: {
    staticDir: path.resolve(dirname, 'test/uploads/media'),
    adminThumbnail: () =>
      'https://raw.githubusercontent.com/payloadcms/website/refs/heads/main/public/images/universal-truth.jpg',
  },
  fields: [],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/uploads/collections/AdminThumbnailSize/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

import { adminThumbnailSizeSlug } from '../../shared.js'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const AdminThumbnailSize: CollectionConfig = {
  slug: adminThumbnailSizeSlug,
  upload: {
    staticDir: path.resolve(dirname, 'test/uploads/media'),
    adminThumbnail: 'small',
    imageSizes: [
      {
        name: 'small',
        width: 100,
        height: 100,
      },
      {
        name: 'medium',
        width: 200,
        height: 200,
      },
    ],
  },
  fields: [],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/uploads/collections/AdminThumbnailWithSearchQueries/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

import { adminThumbnailWithSearchQueries } from '../../shared.js'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const AdminThumbnailWithSearchQueries: CollectionConfig = {
  slug: adminThumbnailWithSearchQueries,
  hooks: {
    afterRead: [
      ({ doc }) => {
        return {
          ...doc,
          // Test that URLs with additional queries are handled correctly
          thumbnailURL: `/_next/image?url=${doc.url}&w=384&q=5`,
        }
      },
    ],
  },
  upload: {
    staticDir: path.resolve(dirname, 'test/uploads/media'),
  },
  fields: [],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/uploads/collections/AdminUploadControl/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

import { adminUploadControlSlug } from '../../shared.js'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const AdminUploadControl: CollectionConfig = {
  slug: adminUploadControlSlug,
  upload: {
    staticDir: path.resolve(dirname, 'test/uploads/media'),
    admin: {
      components: {
        controls: [
          '/collections/AdminUploadControl/components/UploadControl/index.js#UploadControlRSC',
        ],
      },
    },
  },
  fields: [],
}
```

--------------------------------------------------------------------------------

---[FILE: index.client.tsx]---
Location: payload-main/test/uploads/collections/AdminUploadControl/components/UploadControl/index.client.tsx
Signals: React

```typescript
'use client'
import { Button, useUploadControls } from '@payloadcms/ui'
import React, { useCallback } from 'react'

export const UploadControl = () => {
  const { setUploadControlFile, setUploadControlFileUrl } = useUploadControls()

  const loadFromFile = useCallback(async () => {
    const response = await fetch(
      'https://raw.githubusercontent.com/payloadcms/website/refs/heads/main/public/images/universal-truth.jpg',
    )
    const blob = await response.blob()
    const file = new File([blob], 'universal-truth.jpg', { type: 'image/jpeg' })
    setUploadControlFile(file)
  }, [setUploadControlFile])

  const loadFromUrl = useCallback(() => {
    setUploadControlFileUrl(
      'https://raw.githubusercontent.com/payloadcms/website/refs/heads/main/public/images/universal-truth.jpg',
    )
  }, [setUploadControlFileUrl])

  return (
    <div>
      <Button id="load-from-file-upload-button" onClick={loadFromFile}>
        Load from File
      </Button>
      <br />
      <Button id="load-from-url-upload-button" onClick={loadFromUrl}>
        Load from URL
      </Button>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/uploads/collections/AdminUploadControl/components/UploadControl/index.tsx
Signals: React

```typescript
import React from 'react'

import { UploadControl } from './index.client.js'

export const UploadControlRSC: React.FC = () => {
  return (
    <div>
      <UploadControl />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/uploads/collections/AnyImageType/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { fileURLToPath } from 'node:url'
import path from 'path'

import { anyImagesSlug } from '../../shared.js'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const AnyImageTypeCollection: CollectionConfig = {
  slug: anyImagesSlug,
  upload: {
    staticDir: path.resolve(dirname, '../../with-any-image-type'),
    mimeTypes: ['image/*'],
  },
  admin: {
    enableRichTextRelationship: false,
  },
  fields: [],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/uploads/collections/BulkUploads/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { bulkUploadsSlug } from '../../shared.js'

export const BulkUploadsCollection: CollectionConfig = {
  slug: bulkUploadsSlug,
  upload: true,
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      type: 'text',
      name: 'title',
      required: true,
    },
    {
      name: 'relationship',
      type: 'relationship',
      relationTo: ['simple-relationship'],
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/uploads/collections/CustomUploadField/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { customUploadFieldSlug } from '../../shared.js'

export const CustomUploadFieldCollection: CollectionConfig = {
  slug: customUploadFieldSlug,
  upload: true,
  admin: {
    components: {
      edit: {
        Upload: '/collections/CustomUploadField/components/CustomUpload/index.js#CustomUploadRSC',
      },
    },
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.client.tsx]---
Location: payload-main/test/uploads/collections/CustomUploadField/components/CustomUpload/index.client.tsx
Signals: React

```typescript
'use client'

import { Drawer, DrawerToggler, TextField, Upload, useDocumentInfo } from '@payloadcms/ui'
import React from 'react'

const customDrawerSlug = 'custom-upload-drawer'

const CustomDrawer = () => {
  return (
    <Drawer slug={customDrawerSlug}>
      <h1>Custom Drawer</h1>
      <TextField
        field={{
          name: 'alt',
          label: 'Alt',
        }}
        path="alt"
      />
    </Drawer>
  )
}

const CustomDrawerToggler = () => {
  return (
    <React.Fragment>
      <DrawerToggler slug={customDrawerSlug}>Custom Drawer</DrawerToggler>
      <CustomDrawer />
    </React.Fragment>
  )
}

export const CustomUploadClient = () => {
  const { collectionSlug, docConfig, initialState } = useDocumentInfo()

  return (
    <div>
      <h3>This text was rendered on the client</h3>
      <Upload
        collectionSlug={collectionSlug}
        customActions={[<CustomDrawerToggler key={0} />]}
        initialState={initialState}
        uploadConfig={'upload' in docConfig ? docConfig.upload : undefined}
      />
      <h4>
        And that{' '}
        <span aria-label="point up" role="img">
          👆
        </span>{' '}
        is re-used from payload components
      </h4>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/uploads/collections/CustomUploadField/components/CustomUpload/index.tsx
Signals: React

```typescript
import type { PayloadServerReactComponent, SanitizedCollectionConfig } from 'payload'

import React from 'react'

import { CustomUploadClient } from './index.client.js'

export const CustomUploadRSC: PayloadServerReactComponent<
  SanitizedCollectionConfig['admin']['components']['edit']['Upload']
> = () => {
  return (
    <div>
      <h2>This text was rendered on the server</h2>
      <CustomUploadClient />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/uploads/collections/FileMimeType/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { fileMimeTypeSlug } from '../../shared.js'

export const FileMimeType: CollectionConfig = {
  slug: fileMimeTypeSlug,
  admin: {
    useAsTitle: 'title',
  },
  upload: {
    mimeTypes: ['application/pdf'],
  },
  fields: [
    {
      type: 'text',
      name: 'title',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/uploads/collections/SimpleRelationship/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const SimpleRelationshipCollection: CollectionConfig = {
  slug: 'simple-relationship',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      type: 'text',
      name: 'title',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/uploads/collections/Upload1/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { fileURLToPath } from 'node:url'
import path from 'path'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Uploads1: CollectionConfig = {
  slug: 'uploads-1',
  upload: {
    staticDir: path.resolve(dirname, 'uploads'),
    pasteURL: {
      allowList: [
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '4000',
        },
      ],
    },
  },
  fields: [
    {
      type: 'upload',
      name: 'hasManyUpload',
      relationTo: 'uploads-2',
      filterOptions: {
        mimeType: {
          in: ['image/png', 'application/pdf'],
        },
      },
      hasMany: true,
    },
    {
      type: 'upload',
      name: 'singleUpload',
      relationTo: 'uploads-2',
      filterOptions: {
        mimeType: {
          equals: 'image/png',
        },
      },
    },
    {
      type: 'upload',
      name: 'hasManyThumbnailUpload',
      relationTo: 'admin-thumbnail-size',
      hasMany: true,
    },
    {
      type: 'upload',
      name: 'singleThumbnailUpload',
      relationTo: 'admin-thumbnail-size',
    },
    {
      type: 'richText',
      name: 'richText',
    },
  ],
}

export const uploadsDoc = {
  text: 'An upload here',
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/uploads/collections/Upload2/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { fileURLToPath } from 'node:url'
import path from 'path'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Uploads2: CollectionConfig = {
  slug: 'uploads-2',
  upload: {
    staticDir: path.resolve(dirname, 'uploads'),
    pasteURL: {
      allowList: [
        {
          protocol: 'https',
          hostname: 'some-example-website.com',
          pathname: '/images/*',
          port: '',
          search: '',
        },
      ],
    },
  },
  admin: {
    enableRichTextRelationship: false,
  },
  fields: [
    {
      name: 'prefix',
      type: 'text',
      required: true,
    },
    {
      type: 'text',
      name: 'title',
    },
  ],
}

export const uploadsDoc = {
  text: 'An upload here',
}
```

--------------------------------------------------------------------------------

---[FILE: mockFSModule.js]---
Location: payload-main/test/uploads/mocks/mockFSModule.js

```javascript
export default {
  readdirSync: () => {},
  rmSync: () => {},
}
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/test/versions/.gitignore

```text
uploads
uploads2
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: payload-main/test/versions/config.ts

```typescript
import { fileURLToPath } from 'node:url'
import path from 'path'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import AutosavePosts from './collections/Autosave.js'
import AutosaveWithDraftButtonPosts from './collections/AutosaveWithDraftButton.js'
import AutosaveWithDraftValidate from './collections/AutosaveWithDraftValidate.js'
import AutosaveWithMultiSelectPosts from './collections/AutosaveWithMultiSelect.js'
import CustomIDs from './collections/CustomIDs.js'
import { Diff } from './collections/Diff/index.js'
import DisablePublish from './collections/DisablePublish.js'
import DraftPosts from './collections/Drafts.js'
import DraftsNoReadVersions from './collections/DraftsNoReadVersions.js'
import DraftWithChangeHook from './collections/DraftsWithChangeHook.js'
import DraftWithMax from './collections/DraftsWithMax.js'
import DraftsWithValidate from './collections/DraftsWithValidate.js'
import ErrorOnUnpublish from './collections/ErrorOnUnpublish.js'
import LocalizedPosts from './collections/Localized.js'
import { Media } from './collections/Media.js'
import { Media2 } from './collections/Media2.js'
import Posts from './collections/Posts.js'
import { TextCollection } from './collections/Text.js'
import VersionPosts from './collections/Versions.js'
import AutosaveGlobal from './globals/Autosave.js'
import AutosaveWithDraftButtonGlobal from './globals/AutosaveWithDraftButton.js'
import DisablePublishGlobal from './globals/DisablePublish.js'
import DraftGlobal from './globals/Draft.js'
import DraftUnlimitedGlobal from './globals/DraftUnlimited.js'
import DraftWithMaxGlobal from './globals/DraftWithMax.js'
import LocalizedGlobal from './globals/LocalizedGlobal.js'
import { MaxVersions } from './globals/MaxVersions.js'
import { seed } from './seed.js'

export default buildConfigWithDefaults({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    // The autosave test uses this format in order to compare timestamps in the UI
    dateFormat: 'MMMM do yyyy, h:mm:ss a',
  },
  collections: [
    DisablePublish,
    Posts,
    AutosavePosts,
    AutosaveWithDraftButtonPosts,
    AutosaveWithMultiSelectPosts,
    AutosaveWithDraftValidate,
    DraftPosts,
    DraftsNoReadVersions,
    DraftWithMax,
    DraftWithChangeHook,
    DraftsWithValidate,
    ErrorOnUnpublish,
    LocalizedPosts,
    VersionPosts,
    CustomIDs,
    Diff,
    TextCollection,
    Media,
    Media2,
  ],
  globals: [
    AutosaveGlobal,
    AutosaveWithDraftButtonGlobal,
    DraftGlobal,
    DraftWithMaxGlobal,
    DisablePublishGlobal,
    LocalizedGlobal,
    MaxVersions,
    DraftUnlimitedGlobal,
  ],
  indexSortableFields: true,
  localization: {
    defaultLocale: 'en',
    locales: [
      {
        code: 'en',
        label: 'English',
      },
      {
        code: 'es',
        label: {
          en: 'Spanish',
          es: 'Español',
          de: 'Spanisch',
        },
      },
      {
        code: 'de',
        label: {
          en: 'German',
          es: 'Alemán',
          de: 'Deutsch',
        },
      },
    ],
  },
  onInit: async (payload) => {
    if (process.env.SEED_IN_CONFIG_ONINIT !== 'false') {
      await seed(payload)
    }
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
```

--------------------------------------------------------------------------------

````
