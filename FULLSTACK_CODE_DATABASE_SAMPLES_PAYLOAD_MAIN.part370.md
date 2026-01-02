---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 370
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 370 of 695)

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
Location: payload-main/packages/ui/src/elements/FolderView/DragOverlaySelection/index.tsx

```typescript
import type { Modifier } from '@dnd-kit/core'
import type { FolderOrDocument } from 'payload/shared'

import { DragOverlay } from '@dnd-kit/core'
import { getEventCoordinates } from '@dnd-kit/utilities'

import { FolderFileCard } from '../FolderFileCard/index.js'
import './index.scss'

const baseClass = 'drag-overlay-selection'

type DragCardsProps = {
  readonly item: FolderOrDocument
  readonly selectedCount: number
}
export function DragOverlaySelection({ item, selectedCount }: DragCardsProps) {
  return (
    <DragOverlay
      dropAnimation={null}
      modifiers={[snapTopLeftToCursor]}
      style={{
        height: 'unset',
        maxWidth: '220px',
      }}
    >
      <div className={`${baseClass}__cards`}>
        {Array.from({ length: selectedCount > 1 ? 2 : 1 }).map((_, index) => (
          <div
            className={`${baseClass}__card`}
            key={index}
            style={{
              right: `${index * 3}px`,
              top: `-${index * 3}px`,
            }}
          >
            <FolderFileCard
              id={null}
              isSelected
              itemKey="overlay-card"
              title={item.value._folderOrDocumentTitle}
              type="folder"
            />
          </div>
        ))}
        {selectedCount > 1 ? (
          <span className={`${baseClass}__card-count`}>{selectedCount}</span>
        ) : null}
      </div>
    </DragOverlay>
  )
}

export const snapTopLeftToCursor: Modifier = ({ activatorEvent, draggingNodeRect, transform }) => {
  if (draggingNodeRect && activatorEvent) {
    const activatorCoordinates = getEventCoordinates(activatorEvent)

    if (!activatorCoordinates) {
      return transform
    }

    const offsetX = activatorCoordinates.x - draggingNodeRect.left
    const offsetY = activatorCoordinates.y - draggingNodeRect.top

    return {
      ...transform,
      x: transform.x + offsetX + 5,
      y: transform.y + offsetY + 5,
    }
  }

  return transform
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/FolderView/Drawers/EditFolderAction/index.tsx

```typescript
import { useRouteCache } from '../../../../providers/RouteCache/index.js'
import { useTranslation } from '../../../../providers/Translation/index.js'
import { useDocumentDrawer } from '../../../DocumentDrawer/index.js'
import { ListSelectionButton } from '../../../ListSelection/index.js'

type EditFolderActionProps = {
  folderCollectionSlug: string
  id: number | string
}
export const EditFolderAction = ({ id, folderCollectionSlug }: EditFolderActionProps) => {
  const { clearRouteCache } = useRouteCache()
  const { t } = useTranslation()
  const [FolderDocumentDrawer, , { closeDrawer, openDrawer }] = useDocumentDrawer({
    id,
    collectionSlug: folderCollectionSlug,
  })

  if (!id) {
    return null
  }

  return (
    <>
      <ListSelectionButton onClick={openDrawer} type="button">
        {t('general:edit')}
      </ListSelectionButton>

      <FolderDocumentDrawer
        onSave={() => {
          closeDrawer()
          clearRouteCache()
        }}
      />
    </>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/FolderView/Drawers/MoveToFolder/index.scss

```text
@layer payload-default {
  .move-folder-drawer {
    &__body-section {
      display: grid;
      grid-template-rows: auto 1fr;
      gap: var(--base);
    }

    &__breadcrumbs-section {
      padding: calc(var(--base) * 0.75) var(--gutter-h);
      border-bottom: 1px solid var(--theme-elevation-100);
      display: flex;
      justify-content: space-between;

      .move-folder-drawer__add-folder-button {
        margin-left: var(--base);
      }
    }

    &__folder-breadcrumbs-root {
      display: flex;
      align-items: center;
      gap: calc(var(--base) / 2);
    }

    .item-card-grid__title {
      display: none;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/FolderView/Drawers/MoveToFolder/index.tsx
Signals: React

```typescript
'use client'

import type { CollectionSlug, Document } from 'payload'
import type { FolderBreadcrumb, FolderOrDocument } from 'payload/shared'

import { useModal } from '@faceless-ui/modal'
import { getTranslation } from '@payloadcms/translations'
import { extractID } from 'payload/shared'
import React from 'react'

import { useAuth } from '../../../../providers/Auth/index.js'
import { FolderProvider, useFolder } from '../../../../providers/Folders/index.js'
import { useRouteCache } from '../../../../providers/RouteCache/index.js'
import { useServerFunctions } from '../../../../providers/ServerFunctions/index.js'
import { useTranslation } from '../../../../providers/Translation/index.js'
import { Button } from '../../../Button/index.js'
import { ConfirmationModal } from '../../../ConfirmationModal/index.js'
import { useDocumentDrawer } from '../../../DocumentDrawer/index.js'
import { Drawer } from '../../../Drawer/index.js'
import { DrawerActionHeader } from '../../../DrawerActionHeader/index.js'
import { DrawerContentContainer } from '../../../DrawerContentContainer/index.js'
import { ListCreateNewDocInFolderButton } from '../../../ListHeader/TitleActions/ListCreateNewDocInFolderButton.js'
import { LoadingOverlay } from '../../../Loading/index.js'
import { NoListResults } from '../../../NoListResults/index.js'
import { Translation } from '../../../Translation/index.js'
import { FolderBreadcrumbs } from '../../Breadcrumbs/index.js'
import { ColoredFolderIcon } from '../../ColoredFolderIcon/index.js'
import './index.scss'

const baseClass = 'move-folder-drawer'
const baseModalSlug = 'move-folder-drawer'
const confirmModalSlug = `${baseModalSlug}-confirm-move`

type ActionProps =
  | {
      readonly action: 'moveItemsToFolder'
    }
  | {
      readonly action: 'moveItemToFolder'
      readonly title: string
    }
export type MoveToFolderDrawerProps = {
  readonly drawerSlug: string
  readonly folderAssignedCollections: CollectionSlug[]
  readonly folderCollectionSlug: string
  readonly folderFieldName: string
  readonly fromFolderID?: number | string
  readonly fromFolderName?: string
  readonly itemsToMove: FolderOrDocument[]
  /**
   * Callback function to be called when the user confirms the move
   *
   * @param folderID - The ID of the folder to move the items to
   */
  readonly onConfirm: (args: {
    id: null | number | string
    name: null | string
  }) => Promise<void> | void
  readonly populateMoveToFolderDrawer?: (folderID: null | number | string) => Promise<void> | void
  /**
   * Set to `true` to skip the confirmation modal
   * @default false
   */
  readonly skipConfirmModal?: boolean
} & ActionProps

export function MoveItemsToFolderDrawer(props: MoveToFolderDrawerProps) {
  return (
    <Drawer gutter={false} Header={null} slug={props.drawerSlug}>
      <LoadFolderData {...props} />
    </Drawer>
  )
}

function LoadFolderData(props: MoveToFolderDrawerProps) {
  const { permissions } = useAuth()
  const [subfolders, setSubfolders] = React.useState<FolderOrDocument[]>([])
  const [documents, setDocuments] = React.useState<FolderOrDocument[]>([])
  const [breadcrumbs, setBreadcrumbs] = React.useState<FolderBreadcrumb[]>([])
  const [FolderResultsComponent, setFolderResultsComponent] = React.useState<React.ReactNode>(null)
  const [hasLoaded, setHasLoaded] = React.useState(false)
  const [folderID, setFolderID] = React.useState<null | number | string>(props.fromFolderID || null)
  const hasLoadedRef = React.useRef(false)
  const { getFolderResultsComponentAndData } = useServerFunctions()

  const populateMoveToFolderDrawer = React.useCallback(
    async (folderIDToPopulate: null | number | string) => {
      try {
        const result = await getFolderResultsComponentAndData({
          browseByFolder: false,
          collectionsToDisplay: [props.folderCollectionSlug],
          displayAs: 'grid',
          // todo: should be able to pass undefined, empty array or null and get all folders. Need to look at API for this in the server function
          folderAssignedCollections: props.folderAssignedCollections,
          folderID: folderIDToPopulate,
          sort: 'name',
        })

        setBreadcrumbs(result.breadcrumbs || [])
        setSubfolders(result?.subfolders || [])
        setDocuments(result?.documents || [])
        setFolderResultsComponent(result.FolderResultsComponent || null)
        setFolderID(folderIDToPopulate)
        setHasLoaded(true)
      } catch (e) {
        setBreadcrumbs([])
        setSubfolders([])
        setDocuments([])
      }

      hasLoadedRef.current = true
    },
    [getFolderResultsComponentAndData, props.folderAssignedCollections, props.folderCollectionSlug],
  )

  React.useEffect(() => {
    if (!hasLoadedRef.current) {
      void populateMoveToFolderDrawer(props.fromFolderID)
    }
  }, [populateMoveToFolderDrawer, props.fromFolderID])

  if (!hasLoaded) {
    return <LoadingOverlay />
  }

  return (
    <FolderProvider
      allCollectionFolderSlugs={[props.folderCollectionSlug]}
      allowCreateCollectionSlugs={
        permissions.collections[props.folderCollectionSlug]?.create
          ? [props.folderCollectionSlug]
          : []
      }
      allowMultiSelection={false}
      breadcrumbs={breadcrumbs}
      documents={documents}
      folderFieldName={props.folderFieldName}
      folderID={folderID}
      FolderResultsComponent={FolderResultsComponent}
      key={folderID}
      onItemClick={async (item) => {
        await populateMoveToFolderDrawer(item.value.id)
      }}
      subfolders={subfolders}
    >
      <Content {...props} populateMoveToFolderDrawer={populateMoveToFolderDrawer} />
    </FolderProvider>
  )
}

function Content({
  drawerSlug,
  fromFolderID,
  fromFolderName,
  itemsToMove,
  onConfirm,
  populateMoveToFolderDrawer,
  skipConfirmModal,
  ...props
}: MoveToFolderDrawerProps) {
  const { clearRouteCache } = useRouteCache()
  const { closeModal, isModalOpen, openModal } = useModal()
  const [count] = React.useState(() => itemsToMove.length)
  const [folderAddedToUnderlyingFolder, setFolderAddedToUnderlyingFolder] = React.useState(false)
  const { i18n, t } = useTranslation()
  const {
    breadcrumbs,
    folderCollectionConfig,
    folderCollectionSlug,
    folderFieldName,
    folderID,
    FolderResultsComponent,
    folderType,
    getSelectedItems,
    subfolders,
  } = useFolder()
  const [FolderDocumentDrawer, , { closeDrawer: closeFolderDrawer, openDrawer: openFolderDrawer }] =
    useDocumentDrawer({
      collectionSlug: folderCollectionSlug,
    })

  const getSelectedFolder = React.useCallback((): {
    id: null | number | string
    name: null | string
  } => {
    const selected = getSelectedItems()

    if (selected.length === 0) {
      const lastCrumb = breadcrumbs?.[breadcrumbs.length - 1]
      // use the breadcrumb
      return {
        id: lastCrumb?.id || null,
        name: lastCrumb?.name || null,
      }
    } else {
      // use the selected item
      return {
        id: selected[0].value.id,
        name: selected[0].value._folderOrDocumentTitle,
      }
    }
  }, [breadcrumbs, getSelectedItems])

  const onCreateSuccess = React.useCallback(
    async ({ collectionSlug, doc }: { collectionSlug: CollectionSlug; doc: Document }) => {
      await populateMoveToFolderDrawer(folderID)
      if (
        collectionSlug === folderCollectionSlug &&
        ((doc?.folder && fromFolderID === extractID(doc?.folder)) ||
          (!fromFolderID && !doc?.folder))
      ) {
        // if the folder we created is in the same folder as the one we are moving from
        // set variable so we can clear the route cache when we close the drawer
        setFolderAddedToUnderlyingFolder(true)
      }
    },
    [populateMoveToFolderDrawer, folderID, fromFolderID, folderCollectionSlug],
  )

  const onConfirmMove = React.useCallback(() => {
    if (typeof onConfirm === 'function') {
      void onConfirm(getSelectedFolder())
    }
  }, [getSelectedFolder, onConfirm])

  React.useEffect(() => {
    if (!isModalOpen(drawerSlug) && folderAddedToUnderlyingFolder) {
      // if we added a folder to the underlying folder, clear the route cache
      // so that the folder view will be reloaded with the new folder
      setFolderAddedToUnderlyingFolder(false)
      clearRouteCache()
    }
  }, [drawerSlug, isModalOpen, clearRouteCache, folderAddedToUnderlyingFolder])

  return (
    <div className={baseClass}>
      <DrawerActionHeader
        onCancel={() => {
          closeModal(drawerSlug)
        }}
        onSave={() => {
          if (skipConfirmModal) {
            onConfirmMove()
          } else {
            openModal(confirmModalSlug)
          }
        }}
        saveLabel={t('general:select')}
        title={
          <DrawerHeading
            action={props.action}
            count={count}
            fromFolderName={fromFolderID ? fromFolderName : undefined}
            title={props.action === 'moveItemToFolder' ? props.title : undefined}
          />
        }
      />

      <div className={`${baseClass}__breadcrumbs-section`}>
        <FolderBreadcrumbs
          breadcrumbs={[
            {
              id: null,
              name: (
                <span className={`${baseClass}__folder-breadcrumbs-root`}>
                  <ColoredFolderIcon />
                  {t('folder:folders')}
                </span>
              ),
              onClick: breadcrumbs.length
                ? () => {
                    void populateMoveToFolderDrawer(null)
                  }
                : undefined,
            },
            ...breadcrumbs.map((crumb, index) => ({
              id: crumb.id,
              name: crumb.name,
              onClick:
                index !== breadcrumbs.length - 1
                  ? () => {
                      void populateMoveToFolderDrawer(crumb.id)
                    }
                  : undefined,
            })),
          ]}
        />
        {subfolders.length > 0 && (
          <>
            <Button
              buttonStyle="pill"
              className={`${baseClass}__add-folder-button`}
              margin={false}
              onClick={() => {
                openFolderDrawer()
              }}
            >
              {t('fields:addLabel', {
                label: getTranslation(folderCollectionConfig.labels?.singular, i18n),
              })}
            </Button>
            <FolderDocumentDrawer
              initialData={{
                [folderFieldName]: folderID,
                folderType,
              }}
              onSave={(result) => {
                void onCreateSuccess({
                  collectionSlug: folderCollectionConfig.slug,
                  doc: result.doc,
                })
                closeFolderDrawer()
              }}
              redirectAfterCreate={false}
            />
          </>
        )}
      </div>

      <DrawerContentContainer className={`${baseClass}__body-section`}>
        {subfolders.length > 0 ? (
          FolderResultsComponent
        ) : (
          <NoListResults
            Actions={[
              <ListCreateNewDocInFolderButton
                buttonLabel={`${t('general:create')} ${getTranslation(folderCollectionConfig.labels?.singular, i18n).toLowerCase()}`}
                collectionSlugs={[folderCollectionSlug]}
                folderAssignedCollections={props.folderAssignedCollections}
                key="create-folder"
                onCreateSuccess={onCreateSuccess}
                slugPrefix="create-new-folder-from-drawer--no-results"
              />,
            ]}
            Message={
              <p>
                {i18n.t('general:noResults', {
                  label: `${getTranslation(folderCollectionConfig.labels?.plural, i18n)}`,
                })}
              </p>
            }
          />
        )}
      </DrawerContentContainer>

      {!skipConfirmModal && (
        <ConfirmationModal
          body={
            <ConfirmationMessage
              action={props.action}
              count={count}
              fromFolderName={fromFolderName}
              title={props.action === 'moveItemToFolder' ? props.title : undefined}
              toFolderName={getSelectedFolder().name}
            />
          }
          confirmingLabel={t('general:moving')}
          confirmLabel={t('general:move')}
          heading={t('general:confirmMove')}
          modalSlug={confirmModalSlug}
          onConfirm={onConfirmMove}
        />
      )}
    </div>
  )
}

function DrawerHeading(
  props: { count?: number } & ActionProps & Pick<MoveToFolderDrawerProps, 'fromFolderName'>,
): string {
  const { t } = useTranslation()

  switch (props.action) {
    case 'moveItemToFolder':
      // moving current folder from list view actions menu
      // or moving item from edit view
      if (props.fromFolderName) {
        // move from folder
        return t('folder:movingFromFolder', {
          fromFolder: props.fromFolderName,
          title: props.title,
        })
      } else {
        // move from root
        return t('folder:selectFolderForItem', {
          title: props.title,
        })
      }

    case 'moveItemsToFolder':
      if (props.fromFolderName) {
        // move from folder
        return t('folder:movingFromFolder', {
          fromFolder: props.fromFolderName,
          title: `${props.count} ${props.count > 1 ? t('general:items') : t('general:item')}`,
        })
      } else {
        // move from root
        return t('folder:selectFolderForItem', {
          title: `${props.count} ${props.count > 1 ? t('general:items') : t('general:item')}`,
        })
      }
  }
}

function ConfirmationMessage(
  props: { count?: number; toFolderName?: string } & ActionProps &
    Pick<MoveToFolderDrawerProps, 'fromFolderName'>,
) {
  const { t } = useTranslation()

  switch (props.action) {
    case 'moveItemToFolder':
      // moving current folder from list view actions menu
      // or moving item from edit view
      if (props.toFolderName) {
        // move to destination
        // You are about to move {{title}} to {{toFolder}}. Are you sure?
        return (
          <Translation
            elements={{
              1: ({ children }) => <strong>{children}</strong>,
              2: ({ children }) => <strong>{children}</strong>,
            }}
            i18nKey="folder:moveItemToFolderConfirmation"
            t={t}
            variables={{
              title: props.title,
              toFolder: props.toFolderName,
            }}
          />
        )
      } else {
        // move to root
        // You are about to move {{title}} to the root folder. Are you sure?
        return (
          <Translation
            elements={{
              1: ({ children }) => <strong>{children}</strong>,
            }}
            i18nKey="folder:moveItemToRootConfirmation"
            t={t}
            variables={{
              title: props.title,
            }}
          />
        )
      }

    case 'moveItemsToFolder':
      // moving many (documents/folders) from list view
      if (props.toFolderName) {
        // move to destination
        // You are about to move {{count}} {{label}} to {{toFolder}}. Are you sure?
        return (
          <Translation
            elements={{
              1: ({ children }) => <strong>{children}</strong>,
              2: ({ children }) => <strong>{children}</strong>,
            }}
            i18nKey="folder:moveItemsToFolderConfirmation"
            t={t}
            variables={{
              count: props.count,
              label: props.count > 1 ? t('general:items') : t('general:item'),
              toFolder: props.toFolderName,
            }}
          />
        )
      } else {
        // move to root
        // You are about to move {{count}} {{label}} to the root folder. Are you sure?
        return (
          <Translation
            elements={{
              1: ({ children }) => <strong>{children}</strong>,
            }}
            i18nKey="folder:moveItemsToRootConfirmation"
            t={t}
            variables={{
              count: props.count,
              label: props.count > 1 ? t('general:items') : t('general:item'),
            }}
          />
        )
      }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/FolderView/FilterFolderTypePill/index.scss

```text
@import '../../../scss/styles.scss';

@layer payload-default {
  .collection-type {
    &__count {
      font-weight: 600;
      font-variant-numeric: tabular-nums;
      background-color: var(--theme-bg);
      color: var(--theme-text);
      padding: 0px 3px;
      border-radius: var(--style-radius-s);
      margin-left: -4px;
      margin-right: calc(var(--base) * 0.25);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/FolderView/FilterFolderTypePill/index.tsx
Signals: React

```typescript
'use client'

import { getTranslation } from '@payloadcms/translations'
import React from 'react'

import { useConfig } from '../../../providers/Config/index.js'
import { useFolder } from '../../../providers/Folders/index.js'
import { useTranslation } from '../../../providers/Translation/index.js'
import { Button } from '../../Button/index.js'
import { CheckboxPopup } from '../../CheckboxPopup/index.js'
import './index.scss'

const baseClass = 'collection-type'

export function FilterFolderTypePill() {
  const {
    activeCollectionFolderSlugs: visibleCollectionSlugs,
    allCollectionFolderSlugs: folderCollectionSlugs,
    folderCollectionSlug,
    refineFolderData,
  } = useFolder()
  const { i18n, t } = useTranslation()
  const { config, getEntityConfig } = useConfig()

  const [allCollectionOptions] = React.useState(() => {
    return config.collections.reduce(
      (acc, collection) => {
        if (collection.folders && folderCollectionSlugs.includes(collection.slug)) {
          acc.push({
            label: getTranslation(collection.labels?.plural, i18n),
            value: collection.slug,
          })
        }

        return acc
      },
      [
        {
          label: getTranslation(
            getEntityConfig({ collectionSlug: folderCollectionSlug }).labels?.plural,
            i18n,
          ),
          value: folderCollectionSlug,
        },
      ],
    )
  })

  return (
    <CheckboxPopup
      Button={
        <Button buttonStyle="pill" el="div" icon="chevron" margin={false} size="small">
          {visibleCollectionSlugs.length ? (
            <span className={`${baseClass}__count`}>{visibleCollectionSlugs.length}</span>
          ) : null}
          {t('version:type')}
        </Button>
      }
      key="relation-to-selection-popup"
      onChange={({ selectedValues: relationTo }) => {
        void refineFolderData({ query: { relationTo }, updateURL: true })
      }}
      options={allCollectionOptions}
      selectedValues={visibleCollectionSlugs}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/FolderView/FolderField/index.scss

```text
@layer payload-default {
  .folder-edit-field {
    display: none;
  }

  .edit-many-bulk-uploads__main,
  .edit-many__main {
    .folder-edit-field {
      display: initial;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.server.tsx]---
Location: payload-main/packages/ui/src/elements/FolderView/FolderField/index.server.tsx

```typescript
import type { RelationshipFieldServerProps } from 'payload'

// eslint-disable-next-line payload/no-imports-from-exports-dir
import { MoveDocToFolder } from '../../../exports/client/index.js'
import './index.scss'

const baseClass = 'folder-edit-field'

export const FolderField = (props: RelationshipFieldServerProps) => {
  if (props.payload.config.folders === false) {
    return null
  }
  return (
    <MoveDocToFolder
      className={baseClass}
      folderCollectionSlug={props.payload.config.folders.slug}
      folderFieldName={props.payload.config.folders.fieldName}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/FolderView/FolderFileCard/index.scss

```text
@import '../../../scss/styles.scss';
@layer payload-default {
  .folder-file-card {
    // vars
    --card-border-color: var(--theme-elevation-150);
    --card-bg-color: var(--theme-elevation-0);
    --card-preview-bg-color: var(--theme-elevation-50);
    --card-icon-dots-bg-color: transparent;
    --card-icon-dots-color: var(--theme-elevation-600);
    --card-titlebar-icon-color: var(--theme-elevation-300);
    --card-label-color: var(--theme-text);
    --card-preview-icon-color: var(--theme-elevation-400);
    --assigned-collections-color: var(--theme-elevation-900);

    position: relative;
    display: grid;
    grid-template-areas: 'details';
    border-radius: var(--style-radius-m);
    border: 1px solid var(--card-border-color);
    background-color: var(--card-bg-color);
    cursor: pointer;

    &--file {
      grid-template-rows: 1fr auto;
      grid-template-areas:
        'preview'
        'details';
    }

    &--over {
      --card-border-color: var(--theme-elevation-500);
      --card-bg-color: var(--theme-elevation-150);
      --card-icon-dots-bg-color: transparent;
      --card-icon-dots-color: var(--theme-elevation-400);
      --card-titlebar-icon-color: var(--theme-elevation-250);
      --card-label-color: var(--theme-text);
    }

    &--disabled {
      --card-bg-color: var(--theme-elevation-50);
      cursor: not-allowed;
      &:after {
        content: '';
        position: absolute;
        background-color: var(--theme-bg);
        opacity: 0.5;
        width: calc(100% + 2px);
        height: calc(100% + 2px);
        top: -1px;
        left: -1px;
        border-radius: inherit;
      }
    }

    &--selected {
      --card-border-color: var(--theme-success-300);
      --card-bg-color: var(--theme-success-50);
      --card-preview-bg-color: var(--theme-success-50);
      --card-icon-dots-bg-color: var(--theme-success-50);
      --card-icon-dots-color: var(--theme-success-400);
      --card-titlebar-icon-color: var(--theme-success-800);
      --card-label-color: var(--theme-success-800);
      --card-preview-icon-color: var(--theme-success-800);
      --accessibility-outline: 2px solid var(--theme-success-600);
      --assigned-collections-color: var(--theme-success-850);

      .popup:hover:not(.popup--active) {
        --card-icon-dots-bg-color: var(--theme-success-100);
      }
      &:has(.popup--active) {
        --card-icon-dots-bg-color: var(--theme-success-150);
      }

      .icon--dots {
        opacity: 1;
      }

      .folder-file-card__icon-wrap .icon {
        opacity: 0.5;
      }

      .folder-file-card__preview-area .icon {
        opacity: 0.7;
      }

      .folder-file-card__preview-area .thumbnail {
        &:after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          background: var(--theme-success-150);
          width: 100%;
          height: 100%;
          mix-blend-mode: hard-light;
        }
      }
    }

    &:not(.folder-file-card--selected) {
      .icon--dots {
        opacity: 0;
      }

      &:hover,
      &:has(.popup--active) {
        --card-bg-color: var(--theme-elevation-50);

        .icon--dots {
          opacity: 1;
        }
      }

      .popup:hover:not(.popup--active) {
        --card-icon-dots-bg-color: var(--theme-elevation-150);
      }
      &:has(.popup--active) {
        --card-icon-dots-bg-color: var(--theme-elevation-200);
      }
    }

    &__drop-area {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      pointer-events: none;
    }

    &__preview-area {
      grid-area: preview;
      aspect-ratio: 1/1;
      background-color: var(--card-preview-bg-color);
      border-top-left-radius: var(--style-radius-s);
      border-top-right-radius: var(--style-radius-s);
      border-bottom: 1px solid var(--card-border-color);
      display: grid;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      grid-template-columns: auto 50% auto;

      &:has(.thumbnail) {
        grid-template-columns: unset;
      }

      > .icon {
        grid-column: 2;
      }

      .icon--document {
        pointer-events: none;
        height: 50%;
        width: 50%;
        margin: auto;
        color: var(--card-preview-icon-color);
      }

      .thumbnail {
        width: 100%;
        height: 100%;
        position: relative;
        border-radius: inherit;
        > img {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: inherit;
        }
      }

      &:has(.thumbnail) {
        justify-content: stretch;
      }

      img {
        height: 100%;
        width: 100%;
        max-width: 100%;
        max-height: 100%;
        object-fit: cover;
        border-top-left-radius: var(--style-radius-s);
        border-top-right-radius: var(--style-radius-s);
      }
    }

    &__titlebar-area {
      position: relative;
      pointer-events: none;
      display: flex;
      flex-direction: column;
      grid-area: details;
      border-radius: inherit;
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 1rem;
      align-items: center;
      padding: calc(var(--base) / 2);
      background-color: var(--card-bg-color);

      .popup {
        pointer-events: all;
      }
    }

    &__titlebar-labels {
      display: grid;
    }

    &__name {
      overflow: hidden;
      font-weight: bold;
      text-indent: 1px; // prevents left cuttoff of the first letter
      text-wrap: nowrap;
      text-overflow: ellipsis;
      line-height: normal;
      color: var(--card-label-color);
    }

    &__assigned-collections {
      color: var(--assigned-collections-color);
      opacity: 0.5;
      margin-top: 4px;
      line-height: normal;
    }

    &__icon-wrap .icon {
      flex-shrink: 0;
      color: var(--card-titlebar-icon-color);
    }

    .icon--dots {
      rotate: 90deg;
      transition: opacity 0.2s;
      color: var(--card-icon-dots-color);
      border-radius: var(--style-radius-s);
      background-color: var(--card-icon-dots-bg-color);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/FolderView/FolderFileCard/index.tsx
Signals: React

```typescript
'use client'

import type { FolderOrDocument } from 'payload/shared'

import { useDroppable } from '@dnd-kit/core'
import { getTranslation } from '@payloadcms/translations'
import React from 'react'

import { DocumentIcon } from '../../../icons/Document/index.js'
import { ThreeDotsIcon } from '../../../icons/ThreeDots/index.js'
import { useConfig } from '../../../providers/Config/index.js'
import { useFolder } from '../../../providers/Folders/index.js'
import { useTranslation } from '../../../providers/Translation/index.js'
import { Popup } from '../../Popup/index.js'
import { Thumbnail } from '../../Thumbnail/index.js'
import { ColoredFolderIcon } from '../ColoredFolderIcon/index.js'
import { DraggableWithClick } from '../DraggableWithClick/index.js'
import './index.scss'

const baseClass = 'folder-file-card'

type Props = {
  readonly className?: string
  readonly disabled?: boolean
  readonly folderType?: string[]
  readonly id: number | string
  readonly isDeleting?: boolean
  readonly isFocused?: boolean
  readonly isSelected?: boolean
  readonly itemKey: string
  readonly onClick?: (e: React.MouseEvent) => void
  readonly onKeyDown?: (e: React.KeyboardEvent) => void
  readonly PopupActions?: React.ReactNode
  readonly previewUrl?: string
  readonly selectedCount?: number
  readonly title: string
  readonly type: 'file' | 'folder'
}
export function FolderFileCard({
  id,
  type,
  className = '',
  disabled = false,
  folderType,
  isDeleting = false,
  isFocused = false,
  isSelected = false,
  itemKey,
  onClick,
  onKeyDown,
  PopupActions,
  previewUrl,
  selectedCount = 0,
  title,
}: Props) {
  const disableDrop = !id || disabled || type !== 'folder'
  const { isOver, setNodeRef } = useDroppable({
    id: itemKey,
    data: {
      id,
      type,
      folderType,
    },
    disabled: disableDrop,
  })
  const ref = React.useRef(null)

  React.useEffect(() => {
    const copyOfRef = ref.current
    if (isFocused && ref.current) {
      ref.current.focus()
    } else if (!isFocused && ref.current) {
      ref.current.blur()
    }

    return () => {
      if (copyOfRef) {
        copyOfRef.blur()
      }
    }
  }, [isFocused])

  return (
    <DraggableWithClick
      className={[
        baseClass,
        className,
        isSelected && `${baseClass}--selected`,
        disabled && `${baseClass}--disabled`,
        isDeleting && `${baseClass}--deleting`,
        isFocused && `${baseClass}--focused`,
        isOver && `${baseClass}--over`,
        `${baseClass}--${type}`,
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={disabled || (!onClick && !onKeyDown)}
      key={itemKey}
      onClick={onClick}
      onKeyDown={onKeyDown}
      ref={ref}
    >
      {!disableDrop ? <div className={`${baseClass}__drop-area`} ref={setNodeRef} /> : null}

      {type === 'file' ? (
        <div className={`${baseClass}__preview-area`}>
          {previewUrl ? <Thumbnail fileSrc={previewUrl} /> : <DocumentIcon />}
        </div>
      ) : null}

      <div className={`${baseClass}__titlebar-area`}>
        <div className={`${baseClass}__icon-wrap`}>
          {type === 'file' ? <DocumentIcon /> : <ColoredFolderIcon />}
        </div>
        <div className={`${baseClass}__titlebar-labels`}>
          <p className={`${baseClass}__name`} title={title}>
            <span>{title}</span>
          </p>
          {folderType && folderType.length > 0 ? (
            <AssignedCollections folderType={folderType} />
          ) : null}
        </div>
        {PopupActions ? (
          <Popup
            button={<ThreeDotsIcon />}
            disabled={selectedCount > 1 || (selectedCount === 1 && !isSelected)}
            horizontalAlign="right"
            size="large"
            verticalAlign="bottom"
          >
            {PopupActions}
          </Popup>
        ) : null}
      </div>
    </DraggableWithClick>
  )
}

function AssignedCollections({ folderType }: { folderType: string[] }) {
  const { config } = useConfig()
  const { i18n } = useTranslation()

  const collectionsDisplayText = React.useMemo(() => {
    return folderType.reduce((acc, collection) => {
      const collectionConfig = config.collections?.find((c) => c.slug === collection)
      if (collectionConfig) {
        return [...acc, getTranslation(collectionConfig.labels.plural, i18n)]
      }
      return acc
    }, [])
  }, [folderType, config.collections, i18n])

  return (
    <p className={`${baseClass}__assigned-collections`}>
      {collectionsDisplayText.map((label, index) => (
        <span key={label}>
          {label}
          {index < folderType.length - 1 ? ', ' : ''}
        </span>
      ))}
    </p>
  )
}

type ContextCardProps = {
  readonly className?: string
  readonly index: number // todo: possibly remove
  readonly item: FolderOrDocument
  readonly type: 'file' | 'folder'
}
export function ContextFolderFileCard({ type, className, index, item }: ContextCardProps) {
  const { checkIfItemIsDisabled, focusedRowIndex, onItemClick, onItemKeyPress, selectedItemKeys } =
    useFolder()
  const isSelected = selectedItemKeys.has(item.itemKey)
  const isDisabled = checkIfItemIsDisabled(item)

  return (
    <FolderFileCard
      className={className}
      disabled={isDisabled}
      folderType={item.value.folderType || []}
      id={item.value.id}
      isFocused={focusedRowIndex === index}
      isSelected={isSelected}
      itemKey={item.itemKey}
      onClick={(event) => {
        void onItemClick({ event, index, item })
      }}
      onKeyDown={(event) => {
        void onItemKeyPress({ event, index, item })
      }}
      previewUrl={item.value.url}
      title={item.value._folderOrDocumentTitle}
      type={type}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/FolderView/FolderFileTable/index.scss

```text
@import '../../../scss/styles.scss';

@layer payload-default {
  .folder-file-table {
    &__cell-with-icon {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: calc(var(--base) / 2);
    }
  }
}
```

--------------------------------------------------------------------------------

````
