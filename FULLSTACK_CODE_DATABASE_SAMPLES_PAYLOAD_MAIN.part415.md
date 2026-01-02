---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 415
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 415 of 695)

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
Location: payload-main/packages/ui/src/views/CollectionFolder/index.tsx
Signals: React, Next.js

```typescript
'use client'

import type { DragEndEvent } from '@dnd-kit/core'
import type { FolderListViewClientProps } from 'payload'

import { useDndMonitor } from '@dnd-kit/core'
import { getTranslation } from '@payloadcms/translations'
import { useRouter } from 'next/navigation.js'
import { formatAdminURL } from 'payload/shared'
import React, { Fragment } from 'react'

import { DefaultListViewTabs } from '../../elements/DefaultListViewTabs/index.js'
import { DroppableBreadcrumb } from '../../elements/FolderView/Breadcrumbs/index.js'
import { ColoredFolderIcon } from '../../elements/FolderView/ColoredFolderIcon/index.js'
import { CurrentFolderActions } from '../../elements/FolderView/CurrentFolderActions/index.js'
import { DragOverlaySelection } from '../../elements/FolderView/DragOverlaySelection/index.js'
import { SortByPill } from '../../elements/FolderView/SortByPill/index.js'
import { ToggleViewButtons } from '../../elements/FolderView/ToggleViewButtons/index.js'
import { Gutter } from '../../elements/Gutter/index.js'
import { ListHeader } from '../../elements/ListHeader/index.js'
import {
  ListBulkUploadButton,
  ListCreateNewDocInFolderButton,
} from '../../elements/ListHeader/TitleActions/index.js'
import { NoListResults } from '../../elements/NoListResults/index.js'
import { SearchBar } from '../../elements/SearchBar/index.js'
import { useStepNav } from '../../elements/StepNav/index.js'
import { useConfig } from '../../providers/Config/index.js'
import { useEditDepth } from '../../providers/EditDepth/index.js'
import { FolderProvider, useFolder } from '../../providers/Folders/index.js'
import { usePreferences } from '../../providers/Preferences/index.js'
import { useRouteCache } from '../../providers/RouteCache/index.js'
import './index.scss'
import { useRouteTransition } from '../../providers/RouteTransition/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { useWindowInfo } from '../../providers/WindowInfo/index.js'
import { ListSelection } from './ListSelection/index.js'

const baseClass = 'collection-folder-list'

export function DefaultCollectionFolderView({
  allCollectionFolderSlugs: folderCollectionSlugs,
  allowCreateCollectionSlugs,
  baseFolderPath,
  breadcrumbs,
  documents,
  folderFieldName,
  folderID,
  FolderResultsComponent,
  search,
  sort,
  subfolders,
  ...restOfProps
}: FolderListViewClientProps) {
  return (
    <FolderProvider
      allCollectionFolderSlugs={folderCollectionSlugs}
      allowCreateCollectionSlugs={allowCreateCollectionSlugs}
      baseFolderPath={baseFolderPath}
      breadcrumbs={breadcrumbs}
      documents={documents}
      folderFieldName={folderFieldName}
      folderID={folderID}
      FolderResultsComponent={FolderResultsComponent}
      search={search}
      sort={sort}
      subfolders={subfolders}
    >
      <CollectionFolderViewInContext {...restOfProps} />
    </FolderProvider>
  )
}

type CollectionFolderViewInContextProps = Omit<
  FolderListViewClientProps,
  | 'allCollectionFolderSlugs'
  | 'allowCreateCollectionSlugs'
  | 'baseFolderPath'
  | 'breadcrumbs'
  | 'documents'
  | 'folderFieldName'
  | 'folderID'
  | 'FolderResultsComponent'
  | 'subfolders'
>

function CollectionFolderViewInContext(props: CollectionFolderViewInContextProps) {
  const {
    AfterFolderList,
    AfterFolderListTable,
    BeforeFolderList,
    BeforeFolderListTable,
    collectionSlug,
    Description,
    disableBulkDelete,
    disableBulkEdit,
    search,
    viewPreference,
  } = props

  const { config, getEntityConfig } = useConfig()
  const { i18n, t } = useTranslation()
  const drawerDepth = useEditDepth()
  const { setStepNav } = useStepNav()
  const { setPreference } = usePreferences()
  const {
    allowCreateCollectionSlugs,
    breadcrumbs,
    documents,
    dragOverlayItem,
    folderCollectionConfig,
    folderCollectionSlug,
    FolderResultsComponent,
    folderType,
    getSelectedItems,
    moveToFolder,
    refineFolderData,
    selectedItemKeys,
    setIsDragging,
    subfolders,
  } = useFolder()

  const router = useRouter()
  const { startRouteTransition } = useRouteTransition()
  const { clearRouteCache } = useRouteCache()

  const collectionConfig = getEntityConfig({ collectionSlug })

  const { labels, upload } = collectionConfig
  const isUploadCollection = Boolean(upload)
  const isBulkUploadEnabled = isUploadCollection && collectionConfig.upload.bulkUpload

  const {
    breakpoints: { s: smallBreak },
  } = useWindowInfo()

  const onDragEnd = React.useCallback(
    async (event: DragEndEvent) => {
      if (!event.over) {
        return
      }

      if (event.over.data.current.type === 'folder' && 'id' in event.over.data.current) {
        try {
          await moveToFolder({
            itemsToMove: getSelectedItems(),
            toFolderID: event.over.data.current.id,
          })
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Error moving items:', error)
        }

        clearRouteCache()
      }
    },
    [moveToFolder, getSelectedItems, clearRouteCache],
  )

  const handleSetViewType = React.useCallback(
    async (view: 'grid' | 'list') => {
      await setPreference(`${collectionSlug}-collection-folder`, {
        viewPreference: view,
      })
      clearRouteCache()
    },
    [collectionSlug, setPreference, clearRouteCache],
  )

  React.useEffect(() => {
    if (!drawerDepth) {
      setStepNav([
        !breadcrumbs.length
          ? {
              label: (
                <div className={`${baseClass}__step-nav-icon-label`} key="root">
                  <ColoredFolderIcon />
                  {getTranslation(labels?.plural, i18n)}
                </div>
              ),
            }
          : {
              label: (
                <DroppableBreadcrumb
                  className={[
                    `${baseClass}__step-nav-droppable`,
                    `${baseClass}__step-nav-icon-label`,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  id={null}
                  key="root"
                  onClick={() => {
                    startRouteTransition(() => {
                      if (config.folders) {
                        router.push(
                          formatAdminURL({
                            adminRoute: config.routes.admin,
                            path: `/collections/${collectionSlug}/${config.folders.slug}`,
                            serverURL: config.serverURL,
                          }),
                        )
                      }
                    })
                  }}
                >
                  <ColoredFolderIcon />
                  {getTranslation(labels?.plural, i18n)}
                </DroppableBreadcrumb>
              ),
            },
        ...breadcrumbs.map((crumb, crumbIndex) => {
          return {
            label:
              crumbIndex === breadcrumbs.length - 1 ? (
                crumb.name
              ) : (
                <DroppableBreadcrumb
                  className={`${baseClass}__step-nav-droppable`}
                  id={crumb.id}
                  key={crumb.id}
                  onClick={() => {
                    startRouteTransition(() => {
                      if (config.folders) {
                        router.push(
                          formatAdminURL({
                            adminRoute: config.routes.admin,
                            path: `/collections/${collectionSlug}/${config.folders.slug}/${crumb.id}`,
                            serverURL: config.serverURL,
                          }),
                        )
                      }
                    })
                  }}
                >
                  {crumb.name}
                </DroppableBreadcrumb>
              ),
          }
        }),
      ])
    }
  }, [
    breadcrumbs,
    collectionSlug,
    config.folders,
    config.routes.admin,
    config.serverURL,
    drawerDepth,
    i18n,
    labels?.plural,
    router,
    setStepNav,
    startRouteTransition,
  ])

  const totalDocsAndSubfolders = documents.length + subfolders.length

  return (
    <Fragment>
      <DndEventListener onDragEnd={onDragEnd} setIsDragging={setIsDragging} />

      <div className={`${baseClass} ${baseClass}--${collectionSlug}`}>
        {BeforeFolderList}
        <Gutter className={`${baseClass}__wrap`}>
          <ListHeader
            Actions={[
              !smallBreak && (
                <ListSelection
                  disableBulkDelete={disableBulkDelete}
                  disableBulkEdit={collectionConfig.disableBulkEdit ?? disableBulkEdit}
                  folderAssignedCollections={
                    Array.isArray(folderType) ? folderType : [collectionSlug]
                  }
                  key="list-selection"
                />
              ),
              <DefaultListViewTabs
                collectionConfig={collectionConfig}
                config={config}
                key="default-list-actions"
                viewType="folders"
              />,
            ].filter(Boolean)}
            AfterListHeaderContent={Description}
            title={getTranslation(labels?.plural, i18n)}
            TitleActions={[
              allowCreateCollectionSlugs.length && (
                <ListCreateNewDocInFolderButton
                  buttonLabel={
                    allowCreateCollectionSlugs.length > 1
                      ? t('general:createNew')
                      : `${t('general:create')} ${getTranslation(folderCollectionConfig.labels?.singular, i18n).toLowerCase()}`
                  }
                  collectionSlugs={allowCreateCollectionSlugs}
                  folderAssignedCollections={
                    Array.isArray(folderType) ? folderType : [collectionSlug]
                  }
                  key="create-new-button"
                  onCreateSuccess={clearRouteCache}
                  slugPrefix="create-document--header-pill"
                />
              ),
              <ListBulkUploadButton
                collectionSlug={collectionSlug}
                hasCreatePermission={allowCreateCollectionSlugs.includes(collectionSlug)}
                isBulkUploadEnabled={isBulkUploadEnabled}
                key="bulk-upload-button"
              />,
            ].filter(Boolean)}
          />
          <SearchBar
            Actions={[
              <SortByPill key="sort-by-pill" />,
              <ToggleViewButtons
                activeView={viewPreference}
                key="toggle-view-buttons"
                setActiveView={handleSetViewType}
              />,
              <CurrentFolderActions key="current-folder-actions" />,
            ].filter(Boolean)}
            label={t('general:searchBy', {
              label: t('general:name'),
            })}
            onSearchChange={(search) => refineFolderData({ query: { search }, updateURL: true })}
            searchQueryParam={search}
          />
          {BeforeFolderListTable}
          {totalDocsAndSubfolders > 0 && FolderResultsComponent}
          {totalDocsAndSubfolders === 0 && (
            <NoListResults
              Actions={[
                allowCreateCollectionSlugs.includes(folderCollectionSlug) && (
                  <ListCreateNewDocInFolderButton
                    buttonLabel={`${t('general:create')} ${getTranslation(folderCollectionConfig.labels?.singular, i18n).toLowerCase()}`}
                    collectionSlugs={[folderCollectionConfig.slug]}
                    folderAssignedCollections={
                      Array.isArray(folderType) ? folderType : [collectionSlug]
                    }
                    key="create-folder"
                    onCreateSuccess={clearRouteCache}
                    slugPrefix="create-folder--no-results"
                  />
                ),
                allowCreateCollectionSlugs.includes(collectionSlug) && (
                  <ListCreateNewDocInFolderButton
                    buttonLabel={`${t('general:create')} ${t('general:document').toLowerCase()}`}
                    collectionSlugs={[collectionSlug]}
                    folderAssignedCollections={
                      Array.isArray(folderType) ? folderType : [collectionSlug]
                    }
                    key="create-document"
                    onCreateSuccess={clearRouteCache}
                    slugPrefix="create-document--no-results"
                  />
                ),
              ].filter(Boolean)}
              Message={
                <p>
                  {i18n.t('general:noResults', {
                    label: `${getTranslation(labels?.plural, i18n)} ${t('general:or').toLowerCase()} ${getTranslation(
                      folderCollectionConfig.labels?.plural,
                      i18n,
                    )}`,
                  })}
                </p>
              }
            />
          )}
          {AfterFolderListTable}
        </Gutter>
        {AfterFolderList}
      </div>
      {selectedItemKeys.size > 0 && dragOverlayItem && (
        <DragOverlaySelection item={dragOverlayItem} selectedCount={selectedItemKeys.size} />
      )}
    </Fragment>
  )
}

function DndEventListener({ onDragEnd, setIsDragging }) {
  useDndMonitor({
    onDragCancel() {
      setIsDragging(false)
    },
    onDragEnd(event) {
      setIsDragging(false)
      onDragEnd(event)
    },
    onDragStart() {
      setIsDragging(true)
    },
  })

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/views/CollectionFolder/ListSelection/index.tsx
Signals: React

```typescript
'use client'

import type { CollectionSlug } from 'payload'

import { useModal } from '@faceless-ui/modal'
import { extractID } from 'payload/shared'
import React, { Fragment } from 'react'
import { toast } from 'sonner'

import { DeleteMany_v4 } from '../../../elements/DeleteMany/index.js'
import { EditMany_v4 } from '../../../elements/EditMany/index.js'
import { EditFolderAction } from '../../../elements/FolderView/Drawers/EditFolderAction/index.js'
import { MoveItemsToFolderDrawer } from '../../../elements/FolderView/Drawers/MoveToFolder/index.js'
import { ListSelection_v4, ListSelectionButton } from '../../../elements/ListSelection/index.js'
import { PublishMany_v4 } from '../../../elements/PublishMany/index.js'
import { UnpublishMany_v4 } from '../../../elements/UnpublishMany/index.js'
import { useConfig } from '../../../providers/Config/index.js'
import { useFolder } from '../../../providers/Folders/index.js'
import { useRouteCache } from '../../../providers/RouteCache/index.js'
import { useTranslation } from '../../../providers/Translation/index.js'

const moveToFolderDrawerSlug = 'move-to-folder--list'

type GroupedSelections = {
  [relationTo: string]: {
    all?: boolean
    ids?: (number | string)[]
    totalCount: number
  }
}

export type ListSelectionProps = {
  disableBulkDelete?: boolean
  disableBulkEdit?: boolean
  folderAssignedCollections: CollectionSlug[]
}

export const ListSelection: React.FC<ListSelectionProps> = ({
  disableBulkDelete,
  disableBulkEdit,
  folderAssignedCollections,
}) => {
  const {
    clearSelections,
    currentFolder,
    folderCollectionSlug,
    folderFieldName,
    folderID,
    getSelectedItems,
    moveToFolder,
  } = useFolder()

  const { clearRouteCache } = useRouteCache()
  const { config } = useConfig()
  const { t } = useTranslation()
  const { closeModal, openModal } = useModal()
  const items = getSelectedItems()

  const groupedSelections: GroupedSelections = items.reduce((acc, item) => {
    if (item) {
      if (acc[item.relationTo]) {
        acc[item.relationTo].ids.push(extractID(item.value))
        acc[item.relationTo].totalCount += 1
      } else {
        acc[item.relationTo] = {
          ids: [extractID(item.value)],
          totalCount: 1,
        }
      }
    }

    return acc
  }, {} as GroupedSelections)

  const count = items.length
  const singleNonFolderCollectionSelected =
    Object.keys(groupedSelections).length === 1 &&
    Object.keys(groupedSelections)[0] !== folderCollectionSlug
  const collectionConfig = singleNonFolderCollectionSelected
    ? config.collections.find((collection) => {
        return collection.slug === Object.keys(groupedSelections)[0]
      })
    : null

  if (count === 0) {
    return null
  }

  const ids = singleNonFolderCollectionSelected
    ? groupedSelections[Object.keys(groupedSelections)[0]]?.ids || []
    : []

  return (
    <ListSelection_v4
      count={count}
      ListActions={[
        count > 0 && (
          <ListSelectionButton key="clear-all" onClick={() => clearSelections()}>
            {t('general:clearAll')}
          </ListSelectionButton>
        ),
      ].filter(Boolean)}
      SelectionActions={[
        !disableBulkEdit && ids.length && (
          <Fragment key="bulk-actions">
            <EditMany_v4 collection={collectionConfig} count={count} ids={ids} selectAll={false} />
            <PublishMany_v4
              collection={collectionConfig}
              count={count}
              ids={ids}
              selectAll={false}
            />
            <UnpublishMany_v4
              collection={collectionConfig}
              count={count}
              ids={ids}
              selectAll={false}
            />
          </Fragment>
        ),
        count === 1 && !singleNonFolderCollectionSelected && (
          <EditFolderAction
            folderCollectionSlug={folderCollectionSlug}
            id={groupedSelections[folderCollectionSlug].ids[0]}
            key="edit-folder-action"
          />
        ),
        count > 0 ? (
          <React.Fragment key={moveToFolderDrawerSlug}>
            <ListSelectionButton
              onClick={() => {
                openModal(moveToFolderDrawerSlug)
              }}
              type="button"
            >
              {t('general:move')}
            </ListSelectionButton>

            <MoveItemsToFolderDrawer
              action="moveItemsToFolder"
              drawerSlug={moveToFolderDrawerSlug}
              folderAssignedCollections={folderAssignedCollections}
              folderCollectionSlug={folderCollectionSlug}
              folderFieldName={folderFieldName}
              fromFolderID={folderID}
              fromFolderName={currentFolder?.value?._folderOrDocumentTitle}
              itemsToMove={getSelectedItems()}
              onConfirm={async ({ id, name }) => {
                await moveToFolder({
                  itemsToMove: getSelectedItems(),
                  toFolderID: id,
                })

                if (id) {
                  // moved to folder
                  toast.success(
                    t('folder:itemsMovedToFolder', {
                      folderName: `"${name}"`,
                      title: `${count} ${count > 1 ? t('general:items') : t('general:item')}`,
                    }),
                  )
                } else {
                  // moved to root
                  toast.success(
                    t('folder:itemsMovedToRoot', {
                      title: `${count} ${count > 1 ? t('general:items') : t('general:item')}`,
                    }),
                  )
                }

                clearRouteCache()
                closeModal(moveToFolderDrawerSlug)
              }}
            />
          </React.Fragment>
        ) : null,
        !disableBulkDelete && (
          <DeleteMany_v4
            afterDelete={() => {
              clearRouteCache()
              clearSelections()
            }}
            key="bulk-delete"
            selections={groupedSelections}
          />
        ),
      ].filter(Boolean)}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/views/Edit/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .collection-edit {
    --gradient: linear-gradient(to left, rgba(0, 0, 0, 0.04) 0%, transparent 100%);

    &__main-wrapper {
      width: 100%;
      display: flex;
    }

    &__main {
      width: 100%;
      container-type: inline-size;

      &--popup-open {
        width: 100%;
      }

      &--is-live-previewing {
        width: 40%;
        position: relative;

        &::after {
          content: ' ';
          position: absolute;
          top: 0;
          right: 0;
          width: calc(var(--base) * 2);
          height: 100%;
          background: var(--gradient);
          pointer-events: none;
          z-index: -1;
        }
      }
    }

    &__form {
      height: 100%;
      width: 100%;
    }

    &__auth {
      margin-bottom: base(1.6);
      border-radius: var(--style-radius-s);
    }

    @include small-break {
      &__auth {
        margin-top: 0;
        margin-bottom: var(--base);
      }
    }
  }

  html[data-theme='dark'] {
    .collection-edit {
      --gradient: linear-gradient(to left, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%);
    }
  }
}
```

--------------------------------------------------------------------------------

````
