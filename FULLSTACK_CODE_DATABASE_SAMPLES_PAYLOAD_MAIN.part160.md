---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 160
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 160 of 695)

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

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/API/index.tsx
Signals: React

```typescript
import type { DocumentViewServerProps } from 'payload'

import React from 'react'

import { APIViewClient } from './index.client.js'

export function APIView(props: DocumentViewServerProps) {
  return <APIViewClient />
}
```

--------------------------------------------------------------------------------

---[FILE: metadata.ts]---
Location: payload-main/packages/next/src/views/API/metadata.ts

```typescript
import type { MetaConfig } from 'payload'

import { getTranslation } from '@payloadcms/translations'

import type { GenerateEditViewMetadata } from '../Document/getMetaBySegment.js'

import { generateMetadata } from '../../utilities/meta.js'

/**
 * @todo Remove the `MetaConfig` type assertions. They are currently required because of how the `Metadata` type from `next` consumes the `URL` type.
 */
export const generateAPIViewMetadata: GenerateEditViewMetadata = async ({
  collectionConfig,
  config,
  globalConfig,
  i18n,
}) => {
  const entityLabel = collectionConfig
    ? getTranslation(collectionConfig.labels.singular, i18n)
    : globalConfig
      ? getTranslation(globalConfig.label, i18n)
      : ''

  return Promise.resolve(
    generateMetadata({
      ...(config.admin.meta || {}),
      description: `API - ${entityLabel}`,
      keywords: 'API',
      serverURL: config.serverURL,
      title: `API - ${entityLabel}`,
      ...((collectionConfig
        ? {
            ...(collectionConfig?.admin.meta || {}),
            ...(collectionConfig?.admin?.components?.views?.edit?.api?.meta || {}),
          }
        : {}) as MetaConfig),
      ...((globalConfig
        ? {
            ...(globalConfig?.admin.meta || {}),
            ...(globalConfig?.admin?.components?.views?.edit?.api?.meta || {}),
          }
        : {}) as MetaConfig),
    }),
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/API/LocaleSelector/index.tsx
Signals: React

```typescript
'use client'
import { SelectField, useTranslation } from '@payloadcms/ui'
import React from 'react'

export const LocaleSelector: React.FC<{
  readonly localeOptions: {
    label: Record<string, string> | string
    value: string
  }[]
  readonly onChange: (value: string) => void
}> = ({ localeOptions, onChange }) => {
  const { t } = useTranslation()

  return (
    <SelectField
      field={{
        name: 'locale',
        label: t('general:locale'),
        options: localeOptions,
      }}
      onChange={(value: string) => onChange(value)}
      path="locale"
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/next/src/views/API/RenderJSON/index.scss

```text
@import '~@payloadcms/ui/scss';

$tab-width: 24px;

@layer payload-default {
  .query-inspector {
    --tab-width: 24px;

    &__json-children {
      position: relative;

      &--nested {
        & li {
          padding-left: 8px;
        }
      }

      &:before {
        content: '';
        position: absolute;
        top: 0;
        width: 1px;
        height: 100%;
        border-left: 1px dashed var(--theme-elevation-200);
      }
    }

    &__row-line {
      &--nested {
        .query-inspector__json-children {
          padding-left: var(--tab-width);
        }
      }
    }

    &__list-wrap {
      position: relative;
    }

    &__list-toggle {
      all: unset;
      width: 100%;
      text-align: left;
      cursor: pointer;
      border-radius: 3px;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      position: relative;
      display: flex;
      column-gap: 14px;
      row-gap: 10px;
      align-items: center;
      left: 0;
      width: calc(100% + 3px);
      background-color: var(--theme-elevation-50);

      &:not(.query-inspector__list-toggle--empty) {
        margin-left: calc(var(--tab-width) * -1 - 10px);
      }

      svg .stroke {
        stroke: var(--theme-elevation-400);
      }

      &:hover {
        background-color: var(--theme-elevation-100);
      }

      &--empty {
        cursor: default;
        pointer-events: none;
      }
    }

    &__toggle-row-icon {
      &--open {
        transform: rotate(0deg);
      }
      &--closed {
        transform: rotate(-90deg);
      }
    }

    &__value-type {
      &--number {
        .query-inspector__value {
          color: var(--number-color);
        }
      }

      &--string {
        .query-inspector__value {
          color: var(--string-color);
        }
      }
    }

    &__bracket {
      position: relative;

      &--position-end {
        left: 2px;
        width: calc(100% - 5px);
      }
    }

    // Some specific rules targetting the very top of the nested JSON structure or very first items since they need slightly different styling
    &__results {
      & > .query-inspector__row-line--nested {
        & > .query-inspector__list-toggle {
          margin-left: 0;
          column-gap: 6px;

          .query-inspector__toggle-row-icon {
            margin-left: -4px;
          }
        }

        & > .query-inspector__json-children {
          padding-left: calc(var(--base) * 1);
        }

        & > .query-inspector__bracket--nested > .query-inspector__bracket--position-end {
          padding-left: 16px;
        }
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/API/RenderJSON/index.tsx
Signals: React

```typescript
'use client'
import { ChevronIcon } from '@payloadcms/ui'
import * as React from 'react'

import './index.scss'

const chars = {
  leftCurlyBracket: '\u007B',
  leftSquareBracket: '\u005B',
  rightCurlyBracket: '\u007D',
  rightSquareBracket: '\u005D',
}

const baseClass = 'query-inspector'

const Bracket = ({
  type,
  comma = false,
  position,
}: {
  comma?: boolean
  position: 'end' | 'start'
  type: 'array' | 'object'
}) => {
  const rightBracket = type === 'object' ? chars.rightCurlyBracket : chars.rightSquareBracket
  const leftBracket = type === 'object' ? chars.leftCurlyBracket : chars.leftSquareBracket
  const bracketToRender = position === 'end' ? rightBracket : leftBracket

  return (
    <span className={`${baseClass}__bracket ${baseClass}__bracket--position-${position}`}>
      {bracketToRender}
      {position === 'end' && comma ? ',' : null}
    </span>
  )
}

type Args = {
  isEmpty?: boolean
  object: any[] | Record<string, any>
  objectKey?: string
  parentType?: 'array' | 'object'
  trailingComma?: boolean
}

export const RenderJSON = ({
  isEmpty = false,
  object,
  objectKey,
  parentType = 'object',
  trailingComma = false,
}: Args) => {
  const objectKeys = object ? Object.keys(object) : []
  const objectLength = objectKeys.length
  const [isOpen, setIsOpen] = React.useState<boolean>(true)
  const isNested = parentType === 'object' || parentType === 'array'
  return (
    <li className={isNested ? `${baseClass}__row-line--nested` : ''}>
      <button
        aria-label="toggle"
        className={`${baseClass}__list-toggle ${isEmpty ? `${baseClass}__list-toggle--empty` : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        {isEmpty ? null : (
          <ChevronIcon
            className={`${baseClass}__toggle-row-icon ${baseClass}__toggle-row-icon--${
              isOpen ? 'open' : 'closed'
            }`}
          />
        )}
        <span>
          {objectKey && `"${objectKey}": `}
          <Bracket position="start" type={parentType} />
          {isEmpty ? <Bracket comma={trailingComma} position="end" type={parentType} /> : null}
        </span>
      </button>

      <ul
        className={`${baseClass}__json-children ${isNested ? `${baseClass}__json-children--nested` : ''}`}
      >
        {isOpen &&
          objectKeys.map((key, keyIndex) => {
            let value = object[key]
            let type = 'string'
            const isLastKey = keyIndex === objectLength - 1

            if (value === null) {
              type = 'null'
            } else if (value instanceof Date) {
              type = 'date'
              value = value.toISOString()
            } else if (Array.isArray(value)) {
              type = 'array'
            } else if (typeof value === 'object') {
              type = 'object'
            } else if (typeof value === 'number') {
              type = 'number'
            } else if (typeof value === 'boolean') {
              type = 'boolean'
            } else {
              type = 'string'
            }

            if (type === 'object' || type === 'array') {
              return (
                <RenderJSON
                  isEmpty={value.length === 0 || Object.keys(value).length === 0}
                  key={`${key}-${keyIndex}`}
                  object={value}
                  objectKey={parentType === 'object' ? key : undefined}
                  parentType={type}
                  trailingComma={!isLastKey}
                />
              )
            }

            if (
              type === 'date' ||
              type === 'string' ||
              type === 'null' ||
              type === 'number' ||
              type === 'boolean'
            ) {
              const parentHasKey = Boolean(parentType === 'object' && key)

              const rowClasses = [
                `${baseClass}__row-line`,
                `${baseClass}__value-type--${type}`,
                `${baseClass}__row-line--${objectKey ? 'nested' : 'top'}`,
              ]
                .filter(Boolean)
                .join(' ')

              return (
                <li className={rowClasses} key={`${key}-${keyIndex}`}>
                  {parentHasKey ? <span>{`"${key}": `}</span> : null}

                  <span className={`${baseClass}__value`}>{JSON.stringify(value)}</span>
                  {isLastKey ? '' : ','}
                </li>
              )
            }
          })}
      </ul>

      {!isEmpty && (
        <span className={isNested ? `${baseClass}__bracket--nested` : ''}>
          <Bracket comma={trailingComma} position="end" type={parentType} />
        </span>
      )}
    </li>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: buildView.tsx]---
Location: payload-main/packages/next/src/views/BrowseByFolder/buildView.tsx
Signals: React, Next.js

```typescript
import type {
  AdminViewServerProps,
  BuildCollectionFolderViewResult,
  FolderListViewClientProps,
  FolderListViewServerPropsOnly,
  FolderSortKeys,
  ListQuery,
} from 'payload'

import { DefaultBrowseByFolderView, HydrateAuthProvider } from '@payloadcms/ui'
import { RenderServerComponent } from '@payloadcms/ui/elements/RenderServerComponent'
import { getFolderResultsComponentAndData, upsertPreferences } from '@payloadcms/ui/rsc'
import { formatAdminURL } from '@payloadcms/ui/shared'
import { redirect } from 'next/navigation.js'
import React from 'react'

export type BuildFolderViewArgs = {
  customCellProps?: Record<string, any>
  disableBulkDelete?: boolean
  disableBulkEdit?: boolean
  enableRowSelections: boolean
  folderID?: number | string
  isInDrawer?: boolean
  overrideEntityVisibility?: boolean
  query: ListQuery
} & AdminViewServerProps

export const buildBrowseByFolderView = async (
  args: BuildFolderViewArgs,
): Promise<BuildCollectionFolderViewResult> => {
  const {
    browseByFolderSlugs: browseByFolderSlugsFromArgs = [],
    disableBulkDelete,
    disableBulkEdit,
    enableRowSelections,
    folderID,
    initPageResult,
    isInDrawer,
    params,
    query: queryFromArgs,
    searchParams,
  } = args

  const {
    locale: fullLocale,
    permissions,
    req: {
      i18n,
      payload,
      payload: { config },
      query: queryFromReq,
      user,
    },
    visibleEntities,
  } = initPageResult

  if (config.folders === false || config.folders.browseByFolder === false) {
    throw new Error('not-found')
  }

  const foldersSlug = config.folders.slug

  /**
   * All visiible folder enabled collection slugs that the user has read permissions for.
   */
  const allowReadCollectionSlugs = browseByFolderSlugsFromArgs.filter(
    (collectionSlug) =>
      permissions?.collections?.[collectionSlug]?.read &&
      visibleEntities.collections.includes(collectionSlug),
  )

  const query =
    queryFromArgs ||
    ((queryFromReq
      ? {
          ...queryFromReq,
          relationTo:
            typeof queryFromReq?.relationTo === 'string'
              ? JSON.parse(queryFromReq.relationTo)
              : undefined,
        }
      : {}) as ListQuery)

  /**
   * If a folderID is provided and the relationTo query param exists,
   * we filter the collection slugs to only those that are allowed to be read.
   *
   * If no folderID is provided, only folders should be active and displayed (the root view).
   */
  let collectionsToDisplay: string[] = []
  if (folderID && Array.isArray(query?.relationTo)) {
    collectionsToDisplay = query.relationTo.filter(
      (slug) => allowReadCollectionSlugs.includes(slug) || slug === foldersSlug,
    )
  } else if (folderID) {
    collectionsToDisplay = [...allowReadCollectionSlugs, foldersSlug]
  } else {
    collectionsToDisplay = [foldersSlug]
  }

  const {
    routes: { admin: adminRoute },
  } = config

  /**
   * @todo: find a pattern to avoid setting preferences on hard navigation, i.e. direct links, page refresh, etc.
   * This will ensure that prefs are only updated when explicitly set by the user
   * This could potentially be done by injecting a `sessionID` into the params and comparing it against a session cookie
   */
  const browseByFolderPreferences = await upsertPreferences<{
    sort?: FolderSortKeys
    viewPreference?: 'grid' | 'list'
  }>({
    key: 'browse-by-folder',
    req: initPageResult.req,
    value: {
      sort: query?.sort as FolderSortKeys,
    },
  })

  const sortPreference: FolderSortKeys = browseByFolderPreferences?.sort || 'name'
  const viewPreference = browseByFolderPreferences?.viewPreference || 'grid'

  const { breadcrumbs, documents, folderAssignedCollections, FolderResultsComponent, subfolders } =
    await getFolderResultsComponentAndData({
      browseByFolder: true,
      collectionsToDisplay,
      displayAs: viewPreference,
      folderAssignedCollections: collectionsToDisplay.filter((slug) => slug !== foldersSlug) || [],
      folderID,
      req: initPageResult.req,
      sort: sortPreference,
    })

  const resolvedFolderID = breadcrumbs[breadcrumbs.length - 1]?.id

  if (
    !isInDrawer &&
    ((resolvedFolderID && folderID && folderID !== resolvedFolderID) ||
      (folderID && !resolvedFolderID))
  ) {
    redirect(
      formatAdminURL({
        adminRoute,
        path: config.admin.routes.browseByFolder,
        serverURL: config.serverURL,
      }),
    )
  }

  const serverProps: Omit<FolderListViewServerPropsOnly, 'collectionConfig' | 'listPreferences'> = {
    documents,
    i18n,
    locale: fullLocale,
    params,
    payload,
    permissions,
    searchParams,
    subfolders,
    user,
  }

  // const folderViewSlots = renderFolderViewSlots({
  //   clientProps: {
  //   },
  //   description: staticDescription,
  //   payload,
  //   serverProps,
  // })

  // Filter down allCollectionFolderSlugs by the ones the current folder is assingned to
  const allAvailableCollectionSlugs =
    folderID && Array.isArray(folderAssignedCollections) && folderAssignedCollections.length
      ? allowReadCollectionSlugs.filter((slug) => folderAssignedCollections.includes(slug))
      : allowReadCollectionSlugs

  // Filter down activeCollectionFolderSlugs by the ones the current folder is assingned to
  const availableActiveCollectionFolderSlugs = collectionsToDisplay.filter((slug) => {
    if (slug === foldersSlug) {
      return permissions?.collections?.[foldersSlug]?.read
    } else {
      return !folderAssignedCollections || folderAssignedCollections.includes(slug)
    }
  })

  // Documents cannot be created without a parent folder in this view
  const allowCreateCollectionSlugs = (
    resolvedFolderID ? [foldersSlug, ...allAvailableCollectionSlugs] : [foldersSlug]
  ).filter((collectionSlug) => {
    if (collectionSlug === foldersSlug) {
      return permissions?.collections?.[foldersSlug]?.create
    }
    return (
      permissions?.collections?.[collectionSlug]?.create &&
      visibleEntities.collections.includes(collectionSlug)
    )
  })

  return {
    View: (
      <>
        <HydrateAuthProvider permissions={permissions} />
        {RenderServerComponent({
          clientProps: {
            // ...folderViewSlots,
            activeCollectionFolderSlugs: availableActiveCollectionFolderSlugs,
            allCollectionFolderSlugs: allAvailableCollectionSlugs,
            allowCreateCollectionSlugs,
            baseFolderPath: `/browse-by-folder`,
            breadcrumbs,
            disableBulkDelete,
            disableBulkEdit,
            documents,
            enableRowSelections,
            folderAssignedCollections,
            folderFieldName: config.folders.fieldName,
            folderID: resolvedFolderID || null,
            FolderResultsComponent,
            sort: sortPreference,
            subfolders,
            viewPreference,
          } satisfies FolderListViewClientProps,
          // Component:config.folders?.components?.views?.BrowseByFolders?.Component,
          Fallback: DefaultBrowseByFolderView,
          importMap: payload.importMap,
          serverProps,
        })}
      </>
    ),
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/BrowseByFolder/index.tsx
Signals: React, Next.js

```typescript
import type React from 'react'

import { notFound } from 'next/navigation.js'

import type { BuildFolderViewArgs } from './buildView.js'

import { buildBrowseByFolderView } from './buildView.js'

export const BrowseByFolder: React.FC<BuildFolderViewArgs> = async (args) => {
  try {
    const { View } = await buildBrowseByFolderView(args)
    return View
  } catch (error) {
    if (error?.message === 'NEXT_REDIRECT') {
      throw error
    }
    if (error.message === 'not-found') {
      notFound()
    } else {
      console.error(error) // eslint-disable-line no-console
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: metadata.ts]---
Location: payload-main/packages/next/src/views/BrowseByFolder/metadata.ts
Signals: Next.js

```typescript
import type { Metadata } from 'next'

import type { GenerateViewMetadata } from '../Root/index.js'

import { generateMetadata } from '../../utilities/meta.js'

export const generateBrowseByFolderMetadata = async (
  args: Parameters<GenerateViewMetadata>[0],
): Promise<Metadata> => {
  const { config, i18n } = args

  const title: string = i18n.t('folder:browseByFolder')
  const description: string = ''
  const keywords: string = ''

  return generateMetadata({
    ...(config.admin.meta || {}),
    description,
    keywords,
    serverURL: config.serverURL,
    title,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: buildView.tsx]---
Location: payload-main/packages/next/src/views/CollectionFolders/buildView.tsx
Signals: React, Next.js

```typescript
import type {
  AdminViewServerProps,
  BuildCollectionFolderViewResult,
  FolderListViewClientProps,
  FolderListViewServerPropsOnly,
  FolderSortKeys,
  ListQuery,
} from 'payload'

import { DefaultCollectionFolderView, HydrateAuthProvider } from '@payloadcms/ui'
import { RenderServerComponent } from '@payloadcms/ui/elements/RenderServerComponent'
import { getFolderResultsComponentAndData, upsertPreferences } from '@payloadcms/ui/rsc'
import { formatAdminURL } from '@payloadcms/ui/shared'
import { redirect } from 'next/navigation.js'
import React from 'react'

// import { renderFolderViewSlots } from './renderFolderViewSlots.js'

export type BuildCollectionFolderViewStateArgs = {
  disableBulkDelete?: boolean
  disableBulkEdit?: boolean
  enableRowSelections: boolean
  folderID?: number | string
  isInDrawer?: boolean
  overrideEntityVisibility?: boolean
  query: ListQuery
} & AdminViewServerProps

/**
 * Builds the entire view for collection-folder views on the server
 */
export const buildCollectionFolderView = async (
  args: BuildCollectionFolderViewStateArgs,
): Promise<BuildCollectionFolderViewResult> => {
  const {
    disableBulkDelete,
    disableBulkEdit,
    enableRowSelections,
    folderID,
    initPageResult,
    isInDrawer,
    overrideEntityVisibility,
    params,
    query: queryFromArgs,
    searchParams,
  } = args

  const {
    collectionConfig,
    collectionConfig: { slug: collectionSlug },
    locale: fullLocale,
    permissions,
    req: {
      i18n,
      payload,
      payload: { config },
      query: queryFromReq,
      user,
    },
    visibleEntities,
  } = initPageResult

  if (!config.folders) {
    throw new Error('not-found')
  }

  if (
    !permissions?.collections?.[collectionSlug]?.read ||
    !permissions?.collections?.[config.folders.slug].read
  ) {
    throw new Error('not-found')
  }

  if (collectionConfig) {
    if (
      (!visibleEntities.collections.includes(collectionSlug) && !overrideEntityVisibility) ||
      !config.folders
    ) {
      throw new Error('not-found')
    }

    const query = queryFromArgs || queryFromReq

    /**
     * @todo: find a pattern to avoid setting preferences on hard navigation, i.e. direct links, page refresh, etc.
     * This will ensure that prefs are only updated when explicitly set by the user
     * This could potentially be done by injecting a `sessionID` into the params and comparing it against a session cookie
     */
    const collectionFolderPreferences = await upsertPreferences<{
      sort?: FolderSortKeys
      viewPreference?: 'grid' | 'list'
    }>({
      key: `${collectionSlug}-collection-folder`,
      req: initPageResult.req,
      value: {
        sort: query?.sort as FolderSortKeys,
      },
    })

    const sortPreference: FolderSortKeys = collectionFolderPreferences?.sort || 'name'
    const viewPreference = collectionFolderPreferences?.viewPreference || 'grid'

    const {
      routes: { admin: adminRoute },
    } = config

    const {
      breadcrumbs,
      documents,
      folderAssignedCollections,
      FolderResultsComponent,
      subfolders,
    } = await getFolderResultsComponentAndData({
      browseByFolder: false,
      collectionsToDisplay: [config.folders.slug, collectionSlug],
      displayAs: viewPreference,
      folderAssignedCollections: [collectionSlug],
      folderID,
      req: initPageResult.req,
      sort: sortPreference,
    })

    const resolvedFolderID = breadcrumbs[breadcrumbs.length - 1]?.id

    if (
      !isInDrawer &&
      ((resolvedFolderID && folderID && folderID !== resolvedFolderID) ||
        (folderID && !resolvedFolderID))
    ) {
      redirect(
        formatAdminURL({
          adminRoute,
          path: `/collections/${collectionSlug}/${config.folders.slug}`,
          serverURL: config.serverURL,
        }),
      )
    }

    const serverProps: FolderListViewServerPropsOnly = {
      collectionConfig,
      documents,
      i18n,
      locale: fullLocale,
      params,
      payload,
      permissions,
      searchParams,
      subfolders,
      user,
    }

    // We could support slots in the folder view in the future
    // const folderViewSlots = renderFolderViewSlots({
    //   clientProps: {
    //     collectionSlug,
    //     hasCreatePermission,
    //     newDocumentURL,
    //   },
    //   collectionConfig,
    //   description: typeof collectionConfig.admin.description === 'function'
    //   ? collectionConfig.admin.description({ t: i18n.t })
    //   : collectionConfig.admin.description,
    //   payload,
    //   serverProps,
    // })

    const search = query?.search as string

    return {
      View: (
        <>
          <HydrateAuthProvider permissions={permissions} />
          {RenderServerComponent({
            clientProps: {
              // ...folderViewSlots,
              allCollectionFolderSlugs: [config.folders.slug, collectionSlug],
              allowCreateCollectionSlugs: [
                permissions?.collections?.[config.folders.slug]?.create
                  ? config.folders.slug
                  : null,
                resolvedFolderID && permissions?.collections?.[collectionSlug]?.create
                  ? collectionSlug
                  : null,
              ].filter(Boolean),
              baseFolderPath: `/collections/${collectionSlug}/${config.folders.slug}`,
              breadcrumbs,
              collectionSlug,
              disableBulkDelete,
              disableBulkEdit,
              documents,
              enableRowSelections,
              folderAssignedCollections,
              folderFieldName: config.folders.fieldName,
              folderID: resolvedFolderID || null,
              FolderResultsComponent,
              search,
              sort: sortPreference,
              subfolders,
              viewPreference,
            } satisfies FolderListViewClientProps,
            // Component: collectionConfig?.admin?.components?.views?.Folders?.Component,
            Fallback: DefaultCollectionFolderView,
            importMap: payload.importMap,
            serverProps,
          })}
        </>
      ),
    }
  }

  throw new Error('not-found')
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/CollectionFolders/index.tsx
Signals: React, Next.js

```typescript
import type React from 'react'

import { notFound } from 'next/navigation.js'

import type { BuildCollectionFolderViewStateArgs } from './buildView.js'

import { buildCollectionFolderView } from './buildView.js'

export const CollectionFolderView: React.FC<BuildCollectionFolderViewStateArgs> = async (args) => {
  try {
    const { View } = await buildCollectionFolderView(args)
    return View
  } catch (error) {
    if (error?.message === 'NEXT_REDIRECT') {
      throw error
    }
    if (error.message === 'not-found') {
      notFound()
    } else {
      console.error(error) // eslint-disable-line no-console
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: metadata.ts]---
Location: payload-main/packages/next/src/views/CollectionFolders/metadata.ts
Signals: Next.js

```typescript
import type { Metadata } from 'next'
import type { SanitizedCollectionConfig } from 'payload'

import { getTranslation } from '@payloadcms/translations'

import type { GenerateViewMetadata } from '../Root/index.js'

import { generateMetadata } from '../../utilities/meta.js'

export const generateCollectionFolderMetadata = async (
  args: {
    collectionConfig: SanitizedCollectionConfig
  } & Parameters<GenerateViewMetadata>[0],
): Promise<Metadata> => {
  const { collectionConfig, config, i18n } = args

  let title: string = ''
  const description: string = ''
  const keywords: string = ''

  if (collectionConfig) {
    title = getTranslation(collectionConfig.labels.singular, i18n)
  }

  title = `${title ? `${title} ` : title}${i18n.t('folder:folders')}`

  return generateMetadata({
    ...(config.admin.meta || {}),
    description,
    keywords,
    serverURL: config.serverURL,
    title,
    ...(collectionConfig?.admin?.meta || {}),
  })
}
```

--------------------------------------------------------------------------------

---[FILE: renderFolderViewSlots.tsx]---
Location: payload-main/packages/next/src/views/CollectionFolders/renderFolderViewSlots.tsx

```typescript
import type {
  AfterFolderListClientProps,
  AfterFolderListTableClientProps,
  AfterFolderListTableServerPropsOnly,
  BeforeFolderListClientProps,
  BeforeFolderListServerPropsOnly,
  BeforeFolderListTableClientProps,
  BeforeFolderListTableServerPropsOnly,
  FolderListViewServerPropsOnly,
  FolderListViewSlots,
  ListViewSlotSharedClientProps,
  Payload,
  SanitizedCollectionConfig,
  StaticDescription,
  ViewDescriptionClientProps,
  ViewDescriptionServerPropsOnly,
} from 'payload'

import { RenderServerComponent } from '@payloadcms/ui/elements/RenderServerComponent'

type Args = {
  clientProps: ListViewSlotSharedClientProps
  collectionConfig: SanitizedCollectionConfig
  description?: StaticDescription
  payload: Payload
  serverProps: FolderListViewServerPropsOnly
}

export const renderFolderViewSlots = ({
  clientProps,
  collectionConfig,
  description,
  payload,
  serverProps,
}: Args): FolderListViewSlots => {
  const result: FolderListViewSlots = {} as FolderListViewSlots

  if (collectionConfig.admin.components?.afterList) {
    result.AfterFolderList = RenderServerComponent({
      clientProps: clientProps satisfies AfterFolderListClientProps,
      Component: collectionConfig.admin.components.afterList,
      importMap: payload.importMap,
      serverProps: serverProps satisfies AfterFolderListTableServerPropsOnly,
    })
  }

  const listMenuItems = collectionConfig.admin.components?.listMenuItems
  if (Array.isArray(listMenuItems)) {
    result.listMenuItems = [
      RenderServerComponent({
        clientProps,
        Component: listMenuItems,
        importMap: payload.importMap,
        serverProps,
      }),
    ]
  }

  if (collectionConfig.admin.components?.afterListTable) {
    result.AfterFolderListTable = RenderServerComponent({
      clientProps: clientProps satisfies AfterFolderListTableClientProps,
      Component: collectionConfig.admin.components.afterListTable,
      importMap: payload.importMap,
      serverProps: serverProps satisfies AfterFolderListTableServerPropsOnly,
    })
  }

  if (collectionConfig.admin.components?.beforeList) {
    result.BeforeFolderList = RenderServerComponent({
      clientProps: clientProps satisfies BeforeFolderListClientProps,
      Component: collectionConfig.admin.components.beforeList,
      importMap: payload.importMap,
      serverProps: serverProps satisfies BeforeFolderListServerPropsOnly,
    })
  }

  if (collectionConfig.admin.components?.beforeListTable) {
    result.BeforeFolderListTable = RenderServerComponent({
      clientProps: clientProps satisfies BeforeFolderListTableClientProps,
      Component: collectionConfig.admin.components.beforeListTable,
      importMap: payload.importMap,
      serverProps: serverProps satisfies BeforeFolderListTableServerPropsOnly,
    })
  }

  if (collectionConfig.admin.components?.Description) {
    result.Description = RenderServerComponent({
      clientProps: {
        collectionSlug: collectionConfig.slug,
        description,
      } satisfies ViewDescriptionClientProps,
      Component: collectionConfig.admin.components.Description,
      importMap: payload.importMap,
      serverProps: serverProps satisfies ViewDescriptionServerPropsOnly,
    })
  }

  return result
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/CollectionTrash/index.tsx
Signals: React, Next.js

```typescript
import type { AdminViewServerProps, ListQuery } from 'payload'
import type React from 'react'

import { notFound } from 'next/navigation.js'

import { renderListView } from '../List/index.js'

type RenderTrashViewArgs = {
  customCellProps?: Record<string, any>
  disableBulkDelete?: boolean
  disableBulkEdit?: boolean
  disableQueryPresets?: boolean
  drawerSlug?: string
  enableRowSelections: boolean
  overrideEntityVisibility?: boolean
  query: ListQuery
  redirectAfterDelete?: boolean
  redirectAfterDuplicate?: boolean
  redirectAfterRestore?: boolean
} & AdminViewServerProps

export const TrashView: React.FC<Omit<RenderTrashViewArgs, 'enableRowSelections'>> = async (
  args,
) => {
  try {
    const { List: TrashList } = await renderListView({
      ...args,
      enableRowSelections: true,
      trash: true,
      viewType: 'trash',
    })

    return TrashList
  } catch (error) {
    if (error.message === 'not-found') {
      notFound()
    }
    console.error(error) // eslint-disable-line no-console
  }
}
```

--------------------------------------------------------------------------------

---[FILE: metadata.ts]---
Location: payload-main/packages/next/src/views/CollectionTrash/metadata.ts
Signals: Next.js

```typescript
import type { Metadata } from 'next'
import type { SanitizedCollectionConfig } from 'payload'

import { getTranslation } from '@payloadcms/translations'

import type { GenerateViewMetadata } from '../Root/index.js'

import { generateMetadata } from '../../utilities/meta.js'

export const generateCollectionTrashMetadata = async (
  args: {
    collectionConfig: SanitizedCollectionConfig
  } & Parameters<GenerateViewMetadata>[0],
): Promise<Metadata> => {
  const { collectionConfig, config, i18n } = args

  let title: string = ''
  const description: string = ''
  const keywords: string = ''

  if (collectionConfig) {
    title = getTranslation(collectionConfig.labels.plural, i18n)
  }

  title = `${title ? `${title} ` : title}${i18n.t('general:trash')}`

  return generateMetadata({
    ...(config.admin.meta || {}),
    description,
    keywords,
    serverURL: config.serverURL,
    title,
    ...(collectionConfig?.admin?.meta || {}),
  })
}
```

--------------------------------------------------------------------------------

---[FILE: index.client.tsx]---
Location: payload-main/packages/next/src/views/CreateFirstUser/index.client.tsx
Signals: React

```typescript
'use client'
import type { FormProps, UserWithToken } from '@payloadcms/ui'
import type {
  DocumentPreferences,
  FormState,
  LoginWithUsernameOptions,
  SanitizedDocumentPermissions,
} from 'payload'

import {
  ConfirmPasswordField,
  EmailAndUsernameFields,
  Form,
  FormSubmit,
  PasswordField,
  RenderFields,
  useAuth,
  useConfig,
  useServerFunctions,
  useTranslation,
} from '@payloadcms/ui'
import { abortAndIgnore, handleAbortRef } from '@payloadcms/ui/shared'
import { formatApiURL } from 'payload/shared'
import React, { useEffect } from 'react'

export const CreateFirstUserClient: React.FC<{
  docPermissions: SanitizedDocumentPermissions
  docPreferences: DocumentPreferences
  initialState: FormState
  loginWithUsername?: false | LoginWithUsernameOptions
  userSlug: string
}> = ({ docPermissions, docPreferences, initialState, loginWithUsername, userSlug }) => {
  const {
    config: {
      routes: { admin, api: apiRoute },
      serverURL,
    },
    getEntityConfig,
  } = useConfig()

  const { getFormState } = useServerFunctions()

  const { t } = useTranslation()
  const { setUser } = useAuth()

  const abortOnChangeRef = React.useRef<AbortController>(null)

  const collectionConfig = getEntityConfig({ collectionSlug: userSlug })

  const onChange: FormProps['onChange'][0] = React.useCallback(
    async ({ formState: prevFormState, submitted }) => {
      const controller = handleAbortRef(abortOnChangeRef)

      const response = await getFormState({
        collectionSlug: userSlug,
        docPermissions,
        docPreferences,
        formState: prevFormState,
        operation: 'create',
        schemaPath: userSlug,
        signal: controller.signal,
        skipValidation: !submitted,
      })

      abortOnChangeRef.current = null

      if (response && response.state) {
        return response.state
      }
    },
    [userSlug, getFormState, docPermissions, docPreferences],
  )

  const handleFirstRegister = (data: UserWithToken) => {
    setUser(data)
  }

  useEffect(() => {
    const abortOnChange = abortOnChangeRef.current

    return () => {
      abortAndIgnore(abortOnChange)
    }
  }, [])

  return (
    <Form
      action={formatApiURL({
        apiRoute,
        path: `/${userSlug}/first-register`,
        serverURL,
      })}
      initialState={{
        ...initialState,
        'confirm-password': {
          ...initialState['confirm-password'],
          valid: initialState['confirm-password']['valid'] || false,
          value: initialState['confirm-password']['value'] || '',
        },
      }}
      method="POST"
      onChange={[onChange]}
      onSuccess={handleFirstRegister}
      redirect={admin}
      validationOperation="create"
    >
      <EmailAndUsernameFields
        className="emailAndUsername"
        loginWithUsername={loginWithUsername}
        operation="create"
        readOnly={false}
        t={t}
      />
      <PasswordField
        autoComplete="off"
        field={{
          name: 'password',
          label: t('authentication:newPassword'),
          required: true,
        }}
        path="password"
      />
      <ConfirmPasswordField />
      <RenderFields
        fields={collectionConfig.fields}
        forceRender
        parentIndexPath=""
        parentPath=""
        parentSchemaPath={userSlug}
        permissions={true}
        readOnly={false}
      />
      <FormSubmit size="large">{t('general:create')}</FormSubmit>
    </Form>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/next/src/views/CreateFirstUser/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .create-first-user {
    display: flex;
    flex-direction: column;
    gap: base(0.4);

    > form > .field-type {
      margin-bottom: var(--base);

      & .form-submit {
        margin: 0;
      }
    }
  }

  .emailAndUsername {
    margin-bottom: var(--base);
  }
}
```

--------------------------------------------------------------------------------

````
