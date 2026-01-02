---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 206
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 206 of 695)

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

---[FILE: addFolderFieldToCollection.ts]---
Location: payload-main/packages/payload/src/folders/addFolderFieldToCollection.ts

```typescript
import type { SanitizedCollectionConfig } from '../index.js'

import { buildFolderField } from './buildFolderField.js'

export const addFolderFieldToCollection = ({
  collection,
  collectionSpecific,
  folderFieldName,
  folderSlug,
}: {
  collection: SanitizedCollectionConfig
  collectionSpecific: boolean
  folderFieldName: string
  folderSlug: string
}): void => {
  collection.fields.push(
    buildFolderField({
      collectionSpecific,
      folderFieldName,
      folderSlug,
      overrides: {
        admin: {
          allowCreate: false,
          allowEdit: false,
          components: {
            Cell: '@payloadcms/ui/rsc#FolderTableCell',
            Field: '@payloadcms/ui/rsc#FolderField',
          },
        },
      },
    }),
  )
}
```

--------------------------------------------------------------------------------

---[FILE: buildFolderField.ts]---
Location: payload-main/packages/payload/src/folders/buildFolderField.ts

```typescript
import type { SingleRelationshipField } from '../fields/config/types.js'
import type { Document } from '../types/index.js'

import { extractID } from '../utilities/extractID.js'

export const buildFolderField = ({
  collectionSpecific,
  folderFieldName,
  folderSlug,
  overrides = {},
}: {
  collectionSpecific: boolean
  folderFieldName: string
  folderSlug: string
  overrides?: Partial<SingleRelationshipField>
}): SingleRelationshipField => {
  const field: SingleRelationshipField = {
    name: folderFieldName,
    type: 'relationship',
    admin: {},
    hasMany: false,
    index: true,
    label: 'Folder',
    relationTo: folderSlug,
    validate: async (value, { collectionSlug, data, overrideAccess, previousValue, req }) => {
      if (!collectionSpecific) {
        // if collection scoping is not enabled, no validation required since folders can contain any type of document
        return true
      }

      if (!value) {
        // no folder, no validation required
        return true
      }

      const newID = extractID<Document>(value)
      if (previousValue && extractID<Document>(previousValue) === newID) {
        // value did not change, no validation required
        return true
      } else {
        // need to validat the folder value allows this collection type
        let parentFolder: Document = null
        if (typeof value === 'string' || typeof value === 'number') {
          // need to populate the value with the document
          parentFolder = await req.payload.findByID({
            id: newID,
            collection: folderSlug,
            depth: 0, // no need to populate nested folders
            overrideAccess,
            req,
            select: {
              folderType: true, // only need to check folderType
            },
            user: req.user,
          })
        }

        if (parentFolder && collectionSlug) {
          const parentFolderTypes: string[] = (parentFolder.folderType as string[]) || []

          // if the parent folder has no folder types, it accepts all collections
          if (parentFolderTypes.length === 0) {
            return true
          }

          // validation for a folder document
          if (collectionSlug === folderSlug) {
            // ensure the parent accepts ALL folder types
            const folderTypes: string[] = 'folderType' in data ? (data.folderType as string[]) : []
            const invalidSlugs = folderTypes.filter((validCollectionSlug: string) => {
              return !parentFolderTypes.includes(validCollectionSlug)
            })
            if (invalidSlugs.length === 0) {
              return true
            } else {
              return `Folder with ID ${newID} does not allow documents of type ${invalidSlugs.join(', ')}`
            }
          }

          // validation for a non-folder document
          if (parentFolderTypes.includes(collectionSlug)) {
            return true
          } else {
            return `Folder with ID ${newID} does not allow documents of type ${collectionSlug}`
          }
        } else {
          return `Folder with ID ${newID} not found in collection ${folderSlug}`
        }
      }
    },
  }

  if (overrides?.admin) {
    field.admin = {
      ...field.admin,
      ...(overrides.admin || {}),
    }

    if (overrides.admin.components) {
      field.admin.components = {
        ...field.admin.components,
        ...(overrides.admin.components || {}),
      }
    }
  }

  return field
}
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: payload-main/packages/payload/src/folders/constants.ts

```typescript
export const foldersSlug = 'payload-folders'
export const parentFolderFieldName = 'folder'
```

--------------------------------------------------------------------------------

---[FILE: createFolderCollection.ts]---
Location: payload-main/packages/payload/src/folders/createFolderCollection.ts

```typescript
import type { CollectionConfig } from '../collections/config/types.js'
import type { Field, Option, SelectField } from '../fields/config/types.js'

import { defaultAccess } from '../auth/defaultAccess.js'
import { buildFolderField } from './buildFolderField.js'
import { deleteSubfoldersBeforeDelete } from './hooks/deleteSubfoldersAfterDelete.js'
import { dissasociateAfterDelete } from './hooks/dissasociateAfterDelete.js'
import { ensureSafeCollectionsChange } from './hooks/ensureSafeCollectionsChange.js'
import { reparentChildFolder } from './hooks/reparentChildFolder.js'

type CreateFolderCollectionArgs = {
  collectionSpecific: boolean
  debug?: boolean
  folderEnabledCollections: CollectionConfig[]
  folderFieldName: string
  slug: string
}
export const createFolderCollection = ({
  slug,
  collectionSpecific,
  debug,
  folderEnabledCollections,
  folderFieldName,
}: CreateFolderCollectionArgs): CollectionConfig => {
  const { collectionOptions, collectionSlugs } = folderEnabledCollections.reduce(
    (acc, collection: CollectionConfig) => {
      acc.collectionSlugs.push(collection.slug)
      acc.collectionOptions.push({
        label: collection.labels?.plural || collection.slug,
        value: collection.slug,
      })

      return acc
    },
    {
      collectionOptions: [] as Option[],
      collectionSlugs: [] as string[],
    },
  )

  return {
    slug,
    access: {
      create: defaultAccess,
      delete: defaultAccess,
      read: defaultAccess,
      readVersions: defaultAccess,
      update: defaultAccess,
    },
    admin: {
      hidden: !debug,
      useAsTitle: 'name',
    },
    fields: [
      {
        name: 'name',
        type: 'text',
        index: true,
        required: true,
      },
      buildFolderField({
        collectionSpecific,
        folderFieldName,
        folderSlug: slug,
        overrides: {
          admin: {
            hidden: !debug,
          },
        },
      }),
      {
        name: 'documentsAndFolders',
        type: 'join',
        admin: {
          hidden: !debug,
        },
        collection: [slug, ...collectionSlugs],
        hasMany: true,
        on: folderFieldName,
      },
      ...(collectionSpecific
        ? [
            {
              name: 'folderType',
              type: 'select',
              admin: {
                components: {
                  Field: {
                    clientProps: {
                      options: collectionOptions,
                    },
                    path: '@payloadcms/ui#FolderTypeField',
                  },
                },
                position: 'sidebar',
              },
              hasMany: true,
              options: collectionOptions,
            } satisfies SelectField,
          ]
        : ([] as Field[])),
    ],
    hooks: {
      afterChange: [
        reparentChildFolder({
          folderFieldName,
        }),
      ],
      afterDelete: [
        dissasociateAfterDelete({
          collectionSlugs,
          folderFieldName,
        }),
      ],
      beforeDelete: [deleteSubfoldersBeforeDelete({ folderFieldName, folderSlug: slug })],
      beforeValidate: [
        ...(collectionSpecific ? [ensureSafeCollectionsChange({ foldersSlug: slug })] : []),
      ],
    },
    labels: {
      plural: 'Folders',
      singular: 'Folder',
    },
    typescript: {
      interface: 'FolderInterface',
    },
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/payload/src/folders/types.ts

```typescript
import type { CollectionConfig, TypeWithID } from '../collections/config/types.js'
import type { CollectionSlug, SanitizedCollectionConfig } from '../index.js'
import type { Document } from '../types/index.js'

export type FolderInterface = {
  documentsAndFolders?: {
    docs: {
      relationTo: CollectionSlug
      value: Document
    }[]
  }
  folder?: FolderInterface | (number | string | undefined)
  folderType: CollectionSlug[]
  name: string
} & TypeWithID

export type FolderBreadcrumb = {
  folderType?: CollectionSlug[]
  id: null | number | string
  name: string
}

export type Subfolder = {
  fileCount: number
  hasSubfolders: boolean
  id: number | string
  name: string
  subfolderCount: number
}

export type FolderEnabledColection = {
  admin: {
    custom: {
      folderCollectionSlug: CollectionSlug
    }
  }
  slug: CollectionSlug
} & SanitizedCollectionConfig

/**
 * `${relationTo}-${id}` is used as a key for the item
 */
export type FolderDocumentItemKey = `${string}-${number | string}`

/**
 * Needed for document card view for upload enabled collections
 */
type DocumentMediaData = {
  filename?: string
  mimeType?: string
  url?: string
}
/**
 * A generic structure for a folder or document item.
 */
export type FolderOrDocument = {
  itemKey: FolderDocumentItemKey
  relationTo: CollectionSlug
  value: {
    _folderOrDocumentTitle: string
    createdAt?: string
    folderID?: number | string
    folderType: CollectionSlug[]
    id: number | string
    updatedAt?: string
  } & DocumentMediaData
}

export type GetFolderDataResult = {
  breadcrumbs: FolderBreadcrumb[] | null
  documents: FolderOrDocument[]
  folderAssignedCollections: CollectionSlug[] | undefined
  subfolders: FolderOrDocument[]
}

export type RootFoldersConfiguration = {
  /**
   * If true, the browse by folder view will be enabled
   *
   * @default true
   */
  browseByFolder?: boolean
  /**
   * An array of functions to be ran when the folder collection is initialized
   * This allows plugins to modify the collection configuration
   */
  collectionOverrides?: (({
    collection,
  }: {
    collection: Omit<CollectionConfig, 'trash'>
  }) => Omit<CollectionConfig, 'trash'> | Promise<Omit<CollectionConfig, 'trash'>>)[]
  /**
   * If true, you can scope folders to specific collections.
   *
   * @default true
   */
  collectionSpecific?: boolean
  /**
   * Ability to view hidden fields and collections related to folders
   *
   * @default false
   */
  debug?: boolean
  /**
   * The Folder field name
   *
   * @default "folder"
   */
  fieldName?: string
  /**
   * Slug for the folder collection
   *
   * @default "payload-folders"
   */
  slug?: string
}

export type CollectionFoldersConfiguration = {
  /**
   * If true, the collection will be included in the browse by folder view
   *
   * @default true
   */
  browseByFolder?: boolean
}

type BaseFolderSortKeys = 'createdAt' | 'name' | 'updatedAt'

export type FolderSortKeys = `-${BaseFolderSortKeys}` | BaseFolderSortKeys
```

--------------------------------------------------------------------------------

---[FILE: deleteSubfoldersAfterDelete.ts]---
Location: payload-main/packages/payload/src/folders/hooks/deleteSubfoldersAfterDelete.ts

```typescript
import type { CollectionBeforeDeleteHook } from '../../index.js'

type Args = {
  folderFieldName: string
  folderSlug: string
}
export const deleteSubfoldersBeforeDelete = ({
  folderFieldName,
  folderSlug,
}: Args): CollectionBeforeDeleteHook => {
  return async ({ id, req }) => {
    await req.payload.delete({
      collection: folderSlug,
      req,
      where: {
        [folderFieldName]: {
          equals: id,
        },
      },
    })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: dissasociateAfterDelete.ts]---
Location: payload-main/packages/payload/src/folders/hooks/dissasociateAfterDelete.ts

```typescript
import type { CollectionAfterDeleteHook } from '../../index.js'

type Args = {
  collectionSlugs: string[]
  folderFieldName: string
}
export const dissasociateAfterDelete = ({
  collectionSlugs,
  folderFieldName,
}: Args): CollectionAfterDeleteHook => {
  return async ({ id, req }) => {
    for (const collectionSlug of collectionSlugs) {
      await req.payload.update({
        collection: collectionSlug,
        data: {
          [folderFieldName]: null,
        },
        req,
        where: {
          [folderFieldName]: {
            equals: id,
          },
        },
      })
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ensureSafeCollectionsChange.ts]---
Location: payload-main/packages/payload/src/folders/hooks/ensureSafeCollectionsChange.ts

```typescript
import { APIError, type CollectionBeforeValidateHook, type CollectionSlug } from '../../index.js'
import { extractID } from '../../utilities/extractID.js'
import { getTranslatedLabel } from '../../utilities/getTranslatedLabel.js'

export const ensureSafeCollectionsChange =
  ({ foldersSlug }: { foldersSlug: CollectionSlug }): CollectionBeforeValidateHook =>
  async ({ data, originalDoc, req }) => {
    const currentFolderID = extractID(originalDoc || {})
    const parentFolderID = extractID(data?.folder || originalDoc?.folder || {})
    if (Array.isArray(data?.folderType) && data.folderType.length > 0) {
      const folderType = data.folderType as string[]
      const currentlyAssignedCollections: string[] | undefined =
        Array.isArray(originalDoc?.folderType) && originalDoc.folderType.length > 0
          ? originalDoc.folderType
          : undefined
      /**
       * Check if the assigned collections have changed.
       * example:
       * - originalAssignedCollections: ['posts', 'pages']
       * - folderType: ['posts']
       *
       * The user is narrowing the types of documents that can be associated with this folder.
       * If the user is only expanding the types of documents that can be associated with this folder,
       * we do not need to do anything.
       */
      const newCollections = currentlyAssignedCollections
        ? // user is narrowing the current scope of the folder
          currentlyAssignedCollections.filter((c) => !folderType.includes(c))
        : // user is adding a scope to the folder
          folderType

      if (newCollections && newCollections.length > 0) {
        let hasDependentDocuments = false
        if (typeof currentFolderID === 'string' || typeof currentFolderID === 'number') {
          const childDocumentsResult = await req.payload.findByID({
            id: currentFolderID,
            collection: foldersSlug,
            joins: {
              documentsAndFolders: {
                limit: 100_000_000,
                where: {
                  or: [
                    {
                      relationTo: {
                        in: newCollections,
                      },
                    },
                  ],
                },
              },
            },
            overrideAccess: true,
            req,
          })

          hasDependentDocuments = childDocumentsResult.documentsAndFolders.docs.length > 0
        }

        // matches folders that are directly related to the removed collections
        let hasDependentFolders = false
        if (
          !hasDependentDocuments &&
          (typeof currentFolderID === 'string' || typeof currentFolderID === 'number')
        ) {
          const childFoldersResult = await req.payload.find({
            collection: foldersSlug,
            limit: 1,
            req,
            where: {
              and: [
                {
                  folderType: {
                    in: newCollections,
                  },
                },
                {
                  folder: {
                    equals: currentFolderID,
                  },
                },
              ],
            },
          })
          hasDependentFolders = childFoldersResult.totalDocs > 0
        }

        if (hasDependentDocuments || hasDependentFolders) {
          const translatedLabels = newCollections.map((collectionSlug) => {
            if (req.payload.collections[collectionSlug]?.config.labels.singular) {
              return getTranslatedLabel(
                req.payload.collections[collectionSlug]?.config.labels.plural,
                req.i18n,
              )
            }
            return collectionSlug
          })

          throw new APIError(
            `The folder "${data.name || originalDoc.name}" contains ${hasDependentDocuments ? 'documents' : 'folders'} that still belong to the following collections: ${translatedLabels.join(', ')}`,
            400,
          )
        }
        return data
      }
    } else if (
      (data?.folderType === null ||
        (Array.isArray(data?.folderType) && data?.folderType.length === 0)) &&
      parentFolderID
    ) {
      // attempting to set the folderType to catch-all, so we need to ensure that the parent allows this
      let parentFolder
      if (typeof parentFolderID === 'string' || typeof parentFolderID === 'number') {
        try {
          parentFolder = await req.payload.findByID({
            id: parentFolderID,
            collection: foldersSlug,
            overrideAccess: true,
            req,
            select: {
              name: true,
              folderType: true,
            },
            user: req.user,
          })
        } catch (_) {
          // parent folder does not exist
        }
      }

      if (
        parentFolder &&
        parentFolder?.folderType &&
        Array.isArray(parentFolder.folderType) &&
        parentFolder.folderType.length > 0
      ) {
        throw new APIError(
          `The folder "${data?.name || originalDoc.name}" must have folder-type set since its parent folder ${parentFolder?.name ? `"${parentFolder?.name}" ` : ''}has a folder-type set.`,
          400,
        )
      }
    }

    return data
  }
```

--------------------------------------------------------------------------------

---[FILE: reparentChildFolder.ts]---
Location: payload-main/packages/payload/src/folders/hooks/reparentChildFolder.ts

```typescript
import type { CollectionAfterChangeHook, Payload } from '../../index.js'

import { extractID } from '../../utilities/extractID.js'

type Args = {
  folderCollectionSlug: string
  folderFieldName: string
  folderID: number | string
  parentIDToFind: number | string
  payload: Payload
}

/**
 * Determines if a child folder belongs to a parent folder by
 * recursively checking upwards through the folder hierarchy.
 */
async function isChildOfFolder({
  folderCollectionSlug,
  folderFieldName,
  folderID,
  parentIDToFind,
  payload,
}: Args): Promise<boolean> {
  const parentFolder = await payload.findByID({
    id: folderID,
    collection: folderCollectionSlug,
  })

  const parentFolderID = parentFolder[folderFieldName]
    ? extractID(parentFolder[folderFieldName])
    : undefined

  if (!parentFolderID) {
    // made it to the root
    return false
  }

  if (parentFolderID === parentIDToFind) {
    // found match, would be cyclic
    return true
  }

  return isChildOfFolder({
    folderCollectionSlug,
    folderFieldName,
    folderID: parentFolderID,
    parentIDToFind,
    payload,
  })
}

/**
 * If a parent is moved into a child folder, we need to re-parent the child
 * 
 * @example
 * 
 * ```ts
    → F1
      → F2
        → F2A
      → F3

  Moving F1 → F2A becomes:

    → F2A
      → F1
        → F2
        → F3
  ```
 */
export const reparentChildFolder = ({
  folderFieldName,
}: {
  folderFieldName: string
}): CollectionAfterChangeHook => {
  return async ({ doc, previousDoc, req }) => {
    if (
      previousDoc[folderFieldName] !== doc[folderFieldName] &&
      doc[folderFieldName] &&
      req.payload.config.folders
    ) {
      const newParentFolderID = extractID(doc[folderFieldName])
      const isMovingToChild = newParentFolderID
        ? await isChildOfFolder({
            folderCollectionSlug: req.payload.config.folders.slug,
            folderFieldName,
            folderID: newParentFolderID,
            parentIDToFind: doc.id,
            payload: req.payload,
          })
        : false

      if (isMovingToChild) {
        // if the folder was moved into a child folder, the child folder needs
        // to be re-parented with the parent of the folder that was moved
        await req.payload.update({
          id: newParentFolderID,
          collection: req.payload.config.folders.slug,
          data: {
            [folderFieldName]: previousDoc[folderFieldName]
              ? extractID(previousDoc[folderFieldName])
              : null,
          },
          req,
        })
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: buildFolderWhereConstraints.ts]---
Location: payload-main/packages/payload/src/folders/utils/buildFolderWhereConstraints.ts

```typescript
import type { SanitizedCollectionConfig } from '../../collections/config/types.js'
import type { PayloadRequest, Where } from '../../types/index.js'

import { combineWhereConstraints } from '../../utilities/combineWhereConstraints.js'
import { mergeListSearchAndWhere } from '../../utilities/mergeListSearchAndWhere.js'

type Args = {
  collectionConfig: SanitizedCollectionConfig
  folderID?: number | string
  localeCode?: string
  req: PayloadRequest
  search?: string
  sort?: string
}
export async function buildFolderWhereConstraints({
  collectionConfig,
  folderID,
  localeCode,
  req,
  search = '',
  sort,
}: Args): Promise<undefined | Where> {
  const constraints: Where[] = [
    mergeListSearchAndWhere({
      collectionConfig,
      search,
      // where // cannot have where since fields in folders and collection will differ
    }),
  ]

  const baseFilterConstraint = await (
    collectionConfig.admin?.baseFilter ?? collectionConfig.admin?.baseListFilter
  )?.({
    limit: 0,
    locale: localeCode,
    page: 1,
    req,
    sort:
      sort ||
      (typeof collectionConfig.defaultSort === 'string' ? collectionConfig.defaultSort : 'id'),
  })

  if (baseFilterConstraint) {
    constraints.push(baseFilterConstraint)
  }

  if (folderID) {
    // build folder join where constraints
    constraints.push({
      relationTo: {
        equals: collectionConfig.slug,
      },
    })

    // join queries need to omit trashed documents
    if (collectionConfig.trash) {
      constraints.push({
        deletedAt: {
          exists: false,
        },
      })
    }
  }

  const filteredConstraints = constraints.filter(Boolean)

  if (filteredConstraints.length > 1) {
    return combineWhereConstraints(filteredConstraints)
  } else if (filteredConstraints.length === 1) {
    return filteredConstraints[0]
  }

  return undefined
}
```

--------------------------------------------------------------------------------

---[FILE: formatFolderOrDocumentItem.ts]---
Location: payload-main/packages/payload/src/folders/utils/formatFolderOrDocumentItem.ts

```typescript
import type { CollectionSlug, Document } from '../../index.js'
import type { FolderOrDocument } from '../types.js'

import { isImage } from '../../uploads/isImage.js'
import { getBestFitFromSizes } from '../../utilities/getBestFitFromSizes.js'

type Args = {
  folderFieldName: string
  isUpload: boolean
  relationTo: CollectionSlug
  useAsTitle?: string
  value: Document
}
export function formatFolderOrDocumentItem({
  folderFieldName,
  isUpload,
  relationTo,
  useAsTitle,
  value,
}: Args): FolderOrDocument {
  const itemValue: FolderOrDocument['value'] = {
    id: value?.id,
    _folderOrDocumentTitle: String((useAsTitle && value?.[useAsTitle]) || value['id']),
    createdAt: value?.createdAt,
    folderID: value?.[folderFieldName],
    folderType: value?.folderType || [],
    updatedAt: value?.updatedAt,
  }

  if (isUpload) {
    itemValue.filename = value.filename
    itemValue.mimeType = value.mimeType
    itemValue.url =
      value.thumbnailURL ||
      (isImage(value.mimeType)
        ? getBestFitFromSizes({
            sizes: value.sizes,
            targetSizeMax: 520,
            targetSizeMin: 300,
            url: value.url,
            width: value.width,
          })
        : undefined)
  }

  return {
    itemKey: `${relationTo}-${value.id}`,
    relationTo,
    value: itemValue,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: getFolderBreadcrumbs.ts]---
Location: payload-main/packages/payload/src/folders/utils/getFolderBreadcrumbs.ts

```typescript
import type { Document, PayloadRequest } from '../../types/index.js'
import type { FolderBreadcrumb } from '../types.js'

type GetFolderBreadcrumbsArgs = {
  breadcrumbs?: FolderBreadcrumb[]
  folderID?: number | string
  req: PayloadRequest
}
/**
 * Builds breadcrumbs up from child folder
 * all the way up to root folder
 */
export const getFolderBreadcrumbs = async ({
  breadcrumbs = [],
  folderID,
  req,
}: GetFolderBreadcrumbsArgs): Promise<FolderBreadcrumb[] | null> => {
  const { payload, user } = req
  if (folderID && payload.config.folders) {
    const folderFieldName: string = payload.config.folders.fieldName
    const folderQuery = await payload.find({
      collection: payload.config.folders.slug,
      depth: 0,
      limit: 1,
      overrideAccess: false,
      req,
      select: {
        name: true,
        [folderFieldName]: true,
        folderType: true,
      },
      user,
      where: {
        id: {
          equals: folderID,
        },
      },
    })

    const folder = folderQuery.docs[0] as Document

    if (folder) {
      breadcrumbs.push({
        id: folder.id,
        name: folder.name,
        folderType: folder.folderType,
      })
      if (folder[folderFieldName]) {
        return getFolderBreadcrumbs({
          breadcrumbs,
          folderID:
            typeof folder[folderFieldName] === 'number' ||
            typeof folder[folderFieldName] === 'string'
              ? folder[folderFieldName]
              : folder[folderFieldName].id,
          req,
        })
      }
    }
  }

  return breadcrumbs.reverse()
}
```

--------------------------------------------------------------------------------

---[FILE: getFolderData.ts]---
Location: payload-main/packages/payload/src/folders/utils/getFolderData.ts

```typescript
import type { CollectionSlug } from '../../index.js'
import type { PayloadRequest, Where } from '../../types/index.js'
import type { FolderOrDocument, FolderSortKeys, GetFolderDataResult } from '../types.js'

import { parseDocumentID } from '../../index.js'
import { getFolderBreadcrumbs } from './getFolderBreadcrumbs.js'
import { queryDocumentsAndFoldersFromJoin } from './getFoldersAndDocumentsFromJoin.js'
import { getOrphanedDocs } from './getOrphanedDocs.js'

type Args = {
  /**
   * Specify to query documents from a specific collection
   * @default undefined
   * @example 'posts'
   */
  collectionSlug?: CollectionSlug
  /**
   * Optional where clause to filter documents by
   * @default undefined
   */
  documentWhere?: Where
  /**
   * The ID of the folder to query documents from
   * @default undefined
   */
  folderID?: number | string
  /** Optional where clause to filter subfolders by
   * @default undefined
   */
  folderWhere?: Where
  req: PayloadRequest
  sort: FolderSortKeys
}
/**
 * Query for documents, subfolders and breadcrumbs for a given folder
 */
export const getFolderData = async ({
  collectionSlug,
  documentWhere,
  folderID: _folderID,
  folderWhere,
  req,
  sort = 'name',
}: Args): Promise<GetFolderDataResult> => {
  const { payload } = req

  if (payload.config.folders === false) {
    throw new Error('Folders are not enabled')
  }

  const parentFolderID = parseDocumentID({
    id: _folderID,
    collectionSlug: payload.config.folders.slug,
    payload,
  })

  const breadcrumbsPromise = getFolderBreadcrumbs({
    folderID: parentFolderID,
    req,
  })

  if (parentFolderID) {
    // subfolders and documents are queried together
    const documentAndSubfolderPromise = queryDocumentsAndFoldersFromJoin({
      documentWhere,
      folderWhere,
      parentFolderID,
      req,
    })
    const [breadcrumbs, result] = await Promise.all([
      breadcrumbsPromise,
      documentAndSubfolderPromise,
    ])

    return {
      breadcrumbs,
      documents: sortDocs({ docs: result.documents, sort }),
      folderAssignedCollections: result.folderAssignedCollections,
      subfolders: sortDocs({ docs: result.subfolders, sort }),
    }
  } else {
    const subfoldersPromise = getOrphanedDocs({
      collectionSlug: payload.config.folders.slug,
      folderFieldName: payload.config.folders.fieldName,
      req,
      where: folderWhere,
    })
    const [breadcrumbs, subfolders] = await Promise.all([breadcrumbsPromise, subfoldersPromise])

    return {
      breadcrumbs,
      documents: [],
      folderAssignedCollections: collectionSlug ? [collectionSlug] : undefined,
      subfolders: sortDocs({ docs: subfolders, sort }),
    }
  }
}

function sortDocs({
  docs,
  sort,
}: {
  docs: FolderOrDocument[]
  sort?: FolderSortKeys
}): FolderOrDocument[] {
  if (!sort) {
    return docs
  }
  const isDesc = typeof sort === 'string' && sort.startsWith('-')
  const sortKey = (isDesc ? sort.slice(1) : sort) as FolderSortKeys

  return docs.sort((a, b) => {
    let result = 0
    if (sortKey === 'name') {
      result = a.value._folderOrDocumentTitle.localeCompare(b.value._folderOrDocumentTitle)
    } else if (sortKey === 'createdAt') {
      result =
        new Date(a.value.createdAt || '').getTime() - new Date(b.value.createdAt || '').getTime()
    } else if (sortKey === 'updatedAt') {
      result =
        new Date(a.value.updatedAt || '').getTime() - new Date(b.value.updatedAt || '').getTime()
    }
    return isDesc ? -result : result
  })
}
```

--------------------------------------------------------------------------------

---[FILE: getFoldersAndDocumentsFromJoin.ts]---
Location: payload-main/packages/payload/src/folders/utils/getFoldersAndDocumentsFromJoin.ts

```typescript
import type { PaginatedDocs } from '../../database/types.js'
import type { CollectionSlug } from '../../index.js'
import type { Document, PayloadRequest, Where } from '../../types/index.js'
import type { FolderOrDocument } from '../types.js'

import { APIError } from '../../errors/APIError.js'
import { combineWhereConstraints } from '../../utilities/combineWhereConstraints.js'
import { formatFolderOrDocumentItem } from './formatFolderOrDocumentItem.js'

type QueryDocumentsAndFoldersResults = {
  documents: FolderOrDocument[]
  folderAssignedCollections: CollectionSlug[]
  subfolders: FolderOrDocument[]
}
type QueryDocumentsAndFoldersArgs = {
  /**
   * Optional where clause to filter documents by
   * @default undefined
   */
  documentWhere?: Where
  /** Optional where clause to filter subfolders by
   * @default undefined
   */
  folderWhere?: Where
  parentFolderID: number | string
  req: PayloadRequest
}
export async function queryDocumentsAndFoldersFromJoin({
  documentWhere,
  folderWhere,
  parentFolderID,
  req,
}: QueryDocumentsAndFoldersArgs): Promise<QueryDocumentsAndFoldersResults> {
  const { payload, user } = req

  if (payload.config.folders === false) {
    throw new APIError('Folders are not enabled', 500)
  }

  const subfolderDoc = (await payload.find({
    collection: payload.config.folders.slug,
    depth: 1,
    joins: {
      documentsAndFolders: {
        limit: 100_000_000,
        sort: 'name',
        where: combineWhereConstraints([folderWhere, documentWhere], 'or'),
      },
    },
    limit: 1,
    overrideAccess: false,
    req,
    select: {
      documentsAndFolders: true,
      folderType: true,
    },
    user,
    where: {
      id: {
        equals: parentFolderID,
      },
    },
  })) as PaginatedDocs<Document>

  const childrenDocs = subfolderDoc?.docs[0]?.documentsAndFolders?.docs || []

  const results: QueryDocumentsAndFoldersResults = childrenDocs.reduce(
    (acc: QueryDocumentsAndFoldersResults, doc: Document) => {
      if (!payload.config.folders) {
        return acc
      }
      const { relationTo, value } = doc
      const item = formatFolderOrDocumentItem({
        folderFieldName: payload.config.folders.fieldName,
        isUpload: Boolean(payload.collections[relationTo]!.config.upload),
        relationTo,
        useAsTitle: payload.collections[relationTo]!.config.admin?.useAsTitle,
        value,
      })

      if (relationTo === payload.config.folders.slug) {
        acc.subfolders.push(item)
      } else {
        acc.documents.push(item)
      }

      return acc
    },
    {
      documents: [],
      subfolders: [],
    },
  )

  return {
    documents: results.documents,
    folderAssignedCollections: subfolderDoc?.docs[0]?.folderType || [],
    subfolders: results.subfolders,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: getOrphanedDocs.ts]---
Location: payload-main/packages/payload/src/folders/utils/getOrphanedDocs.ts

```typescript
import type { CollectionSlug, PayloadRequest, Where } from '../../index.js'
import type { FolderOrDocument } from '../types.js'

import { combineWhereConstraints } from '../../utilities/combineWhereConstraints.js'
import { formatFolderOrDocumentItem } from './formatFolderOrDocumentItem.js'

type Args = {
  collectionSlug: CollectionSlug
  folderFieldName: string
  req: PayloadRequest
  /**
   * Optional where clause to filter documents by
   * @default undefined
   */
  where?: Where
}
export async function getOrphanedDocs({
  collectionSlug,
  folderFieldName,
  req,
  where,
}: Args): Promise<FolderOrDocument[]> {
  const { payload, user } = req
  const noParentFolderConstraint: Where = {
    or: [
      {
        [folderFieldName]: {
          exists: false,
        },
      },
      {
        [folderFieldName]: {
          equals: null,
        },
      },
    ],
  }

  const orphanedFolders = await payload.find({
    collection: collectionSlug,
    limit: 0,
    overrideAccess: false,
    req,
    sort: payload.collections[collectionSlug]?.config.admin.useAsTitle,
    user,
    where: where
      ? combineWhereConstraints([noParentFolderConstraint, where])
      : noParentFolderConstraint,
  })

  return (
    orphanedFolders?.docs.map((doc) =>
      formatFolderOrDocumentItem({
        folderFieldName,
        isUpload: Boolean(payload.collections[collectionSlug]?.config.upload),
        relationTo: collectionSlug,
        useAsTitle: payload.collections[collectionSlug]?.config.admin.useAsTitle,
        value: doc,
      }),
    ) || []
  )
}
```

--------------------------------------------------------------------------------

---[FILE: client.ts]---
Location: payload-main/packages/payload/src/globals/config/client.ts

```typescript
import type { I18nClient, TFunction } from '@payloadcms/translations'

import type { ImportMap } from '../../bin/generateImportMap/index.js'
import type {
  LivePreviewConfig,
  SanitizedConfig,
  ServerOnlyLivePreviewProperties,
} from '../../config/types.js'
import type { Payload } from '../../types/index.js'
import type { SanitizedGlobalConfig } from './types.js'

import { type ClientField, createClientFields } from '../../fields/config/client.js'

export type ServerOnlyGlobalProperties = keyof Pick<
  SanitizedGlobalConfig,
  'access' | 'admin' | 'custom' | 'endpoints' | 'fields' | 'flattenedFields' | 'hooks'
>

export type ServerOnlyGlobalAdminProperties = keyof Pick<
  SanitizedGlobalConfig['admin'],
  'components' | 'hidden'
>

export type ClientGlobalConfig = {
  admin: {
    components: null
    livePreview?: Omit<LivePreviewConfig, ServerOnlyLivePreviewProperties>
    preview?: boolean
  } & Omit<
    SanitizedGlobalConfig['admin'],
    'components' | 'livePreview' | 'preview' | ServerOnlyGlobalAdminProperties
  >
  fields: ClientField[]
} & Omit<SanitizedGlobalConfig, 'admin' | 'fields' | ServerOnlyGlobalProperties>

const serverOnlyProperties: Partial<ServerOnlyGlobalProperties>[] = [
  'hooks',
  'access',
  'endpoints',
  'custom',
  'flattenedFields',
  // `admin` is handled separately
]

const serverOnlyGlobalAdminProperties: Partial<ServerOnlyGlobalAdminProperties>[] = [
  'hidden',
  'components',
]

export const createClientGlobalConfig = ({
  defaultIDType,
  global,
  i18n,
  importMap,
}: {
  defaultIDType: Payload['config']['db']['defaultIDType']
  global: SanitizedConfig['globals'][0]
  i18n: I18nClient
  importMap: ImportMap
}): ClientGlobalConfig => {
  const clientGlobal = {} as ClientGlobalConfig

  for (const key in global) {
    if (serverOnlyProperties.includes(key as any)) {
      continue
    }
    switch (key) {
      case 'admin':
        if (!global.admin) {
          break
        }
        clientGlobal.admin = {} as ClientGlobalConfig['admin']
        for (const adminKey in global.admin) {
          if (serverOnlyGlobalAdminProperties.includes(adminKey as any)) {
            continue
          }
          switch (adminKey) {
            case 'livePreview':
              if (!global.admin.livePreview) {
                break
              }
              clientGlobal.admin.livePreview = {}
              if (global.admin.livePreview.breakpoints) {
                clientGlobal.admin.livePreview.breakpoints = global.admin.livePreview.breakpoints
              }
              break
            case 'preview':
              clientGlobal.admin.preview = true
              break
            default:
              ;(clientGlobal.admin as any)[adminKey] =
                global.admin[adminKey as keyof typeof global.admin]
          }
        }
        break
      case 'fields':
        clientGlobal.fields = createClientFields({
          defaultIDType,
          fields: global.fields,
          i18n,
          importMap,
        })
        break
      case 'label':
        clientGlobal.label =
          typeof global.label === 'function'
            ? global.label({ i18n, t: i18n.t as TFunction })
            : global.label
        break
      default: {
        ;(clientGlobal as any)[key] = global[key as keyof typeof global]
        break
      }
    }
  }

  return clientGlobal
}

export const createClientGlobalConfigs = ({
  defaultIDType,
  globals,
  i18n,
  importMap,
}: {
  defaultIDType: Payload['config']['db']['defaultIDType']
  globals: SanitizedConfig['globals']
  i18n: I18nClient
  importMap: ImportMap
}): ClientGlobalConfig[] => {
  const clientGlobals = new Array(globals.length)

  for (let i = 0; i < globals.length; i++) {
    const global = globals[i]

    clientGlobals[i] = createClientGlobalConfig({
      defaultIDType,
      global: global!,
      i18n,
      importMap,
    })
  }

  return clientGlobals
}
```

--------------------------------------------------------------------------------

````
