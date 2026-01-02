---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 369
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 369 of 695)

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
Location: payload-main/packages/ui/src/elements/FileDetails/index.tsx
Signals: React

```typescript
'use client'
import type { Data, FileSizes, SanitizedCollectionConfig } from 'payload'

import React from 'react'

import { DraggableFileDetails } from './DraggableFileDetails/index.js'
import { StaticFileDetails } from './StaticFileDetails/index.js'

type SharedFileDetailsProps = {
  collectionSlug: string
  customUploadActions?: React.ReactNode[]
  doc: {
    sizes?: FileSizes
  } & Data
  enableAdjustments?: boolean
  hasImageSizes?: boolean
  hideRemoveFile?: boolean
  imageCacheTag?: string
  uploadConfig: SanitizedCollectionConfig['upload']
}

type StaticFileDetailsProps = {
  draggableItemProps?: never
  handleRemove?: () => void
  hasMany?: never
  isSortable?: never
  removeItem?: never
  rowIndex?: never
}

type DraggableFileDetailsProps = {
  handleRemove?: never
  hasMany: boolean
  isSortable?: boolean
  removeItem?: (index: number) => void
  rowIndex: number
}

export type FileDetailsProps = (DraggableFileDetailsProps | StaticFileDetailsProps) &
  SharedFileDetailsProps

export const FileDetails: React.FC<FileDetailsProps> = (props) => {
  const { hasMany } = props

  if (hasMany) {
    return <DraggableFileDetails {...props} />
  }

  return <StaticFileDetails {...props} />
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/FileDetails/DraggableFileDetails/index.scss

```text
@import '../../../scss/styles.scss';

@layer payload-default {
  .file-details-draggable {
    display: flex;
    gap: 0.6rem;
    //justify-content: space-between;
    align-items: center;
    background: var(--theme-elevation-50);
    border-radius: 3px;
    padding: 0.7rem 0.8rem;

    &--drag-wrapper {
      display: flex;
      gap: 0.6rem;
      align-items: center;
    }

    &__thumbnail {
      max-width: 1.5rem;
    }

    &__actions {
      flex-grow: 2;
      display: flex;
      gap: 0.6rem;
      align-items: center;
      justify-content: flex-end;
    }

    &__remove.btn--style-icon-label {
      margin: 0;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/FileDetails/DraggableFileDetails/index.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import { Button } from '../../Button/index.js'
import { Thumbnail } from '../../Thumbnail/index.js'
import './index.scss'

const baseClass = 'file-details-draggable'

import type { Data, FileSizes, SanitizedCollectionConfig } from 'payload'

import { DraggableSortableItem } from '../../../elements/DraggableSortable/DraggableSortableItem/index.js'
import { DragHandleIcon } from '../../../icons/DragHandle/index.js'
import { EditIcon } from '../../../icons/Edit/index.js'
import { useDocumentDrawer } from '../../DocumentDrawer/index.js'

export type DraggableFileDetailsProps = {
  collectionSlug: string
  customUploadActions?: React.ReactNode[]
  doc: {
    sizes?: FileSizes
  } & Data
  enableAdjustments?: boolean
  hasImageSizes?: boolean
  hasMany: boolean
  hideRemoveFile?: boolean
  imageCacheTag?: string
  isSortable?: boolean
  removeItem?: (index: number) => void
  rowIndex: number
  uploadConfig: SanitizedCollectionConfig['upload']
}

export const DraggableFileDetails: React.FC<DraggableFileDetailsProps> = (props) => {
  const {
    collectionSlug,
    doc,
    hideRemoveFile,
    imageCacheTag,
    isSortable,
    removeItem,
    rowIndex,
    uploadConfig,
  } = props

  const { id, filename, thumbnailURL, url } = doc

  const [DocumentDrawer, DocumentDrawerToggler] = useDocumentDrawer({
    id,
    collectionSlug,
  })

  return (
    <DraggableSortableItem id={id} key={id}>
      {(draggableSortableItemProps) => (
        <div
          className={[
            baseClass,
            draggableSortableItemProps && isSortable && `${baseClass}--has-drag-handle`,
          ]
            .filter(Boolean)
            .join(' ')}
          ref={draggableSortableItemProps.setNodeRef}
          style={{
            transform: draggableSortableItemProps.transform,
            transition: draggableSortableItemProps.transition,
            zIndex: draggableSortableItemProps.isDragging ? 1 : undefined,
          }}
        >
          <div className={`${baseClass}--drag-wrapper`}>
            {isSortable && draggableSortableItemProps && (
              <div
                className={`${baseClass}__drag`}
                {...draggableSortableItemProps.attributes}
                {...draggableSortableItemProps.listeners}
              >
                <DragHandleIcon />
              </div>
            )}
            <Thumbnail
              className={`${baseClass}__thumbnail`}
              collectionSlug={collectionSlug}
              doc={doc}
              fileSrc={thumbnailURL || url}
              imageCacheTag={imageCacheTag}
              uploadConfig={uploadConfig}
            />
          </div>
          <div className={`${baseClass}__main-detail`}>{filename}</div>

          <div className={`${baseClass}__actions`}>
            <DocumentDrawer />
            <DocumentDrawerToggler>
              <EditIcon />
            </DocumentDrawerToggler>
            {!hideRemoveFile && removeItem && (
              <Button
                buttonStyle="icon-label"
                className={`${baseClass}__remove`}
                icon="x"
                iconStyle="none"
                onClick={() => removeItem(rowIndex)}
                round
              />
            )}
          </div>
        </div>
      )}
    </DraggableSortableItem>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/FileDetails/FileMeta/index.scss

```text
@import '../../../scss/styles.scss';

@layer payload-default {
  .file-meta {
    &__url {
      display: flex;
      gap: base(0.4);

      a {
        font-weight: 600;
        text-decoration: none;

        &:hover,
        &:focus-visible {
          text-decoration: underline;
        }
      }
    }

    &__size-type,
    &__url a {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &__edit {
      position: relative;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/FileDetails/FileMeta/index.tsx
Signals: React

```typescript
'use client'
import { formatFilesize } from 'payload/shared'
import React from 'react'

export type FileMetaProps = {
  filename: string
  filesize: number
  height?: number
  mimeType: string
  sizes?: unknown
  url: string
  width?: number
}

import { CopyToClipboard } from '../../CopyToClipboard/index.js'
import './index.scss'

const baseClass = 'file-meta'

export const FileMeta: React.FC<FileMetaProps> = (props) => {
  const { filename, filesize, height, mimeType, url: fileURL, width } = props

  return (
    <div className={baseClass}>
      <div className={`${baseClass}__url`}>
        <a href={fileURL} rel="noopener noreferrer" target="_blank">
          {filename}
        </a>
        <CopyToClipboard defaultMessage="Copy URL" value={fileURL} />
      </div>
      <div className={`${baseClass}__size-type`}>
        {formatFilesize(filesize)}
        {typeof width === 'number' && typeof height === 'number' && (
          <React.Fragment>
            &nbsp;-&nbsp;
            {width}x{height}
          </React.Fragment>
        )}
        {mimeType && (
          <React.Fragment>
            &nbsp;-&nbsp;
            {mimeType}
          </React.Fragment>
        )}
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/FileDetails/StaticFileDetails/index.scss

```text
@import '../../../scss/styles.scss';

@layer payload-default {
  .file-details {
    background: var(--theme-elevation-50);
    border: 1px solid var(--theme-border-color);
    border-radius: var(--style-radius-m);
    @include inputShadow;

    header {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      position: relative;
    }

    &__remove {
      position: absolute;
      margin: 0;
      top: $baseline;
      right: $baseline;

      & .btn__icon {
        border: 1px solid var(--theme-border-color);
        background: var(--theme-input-bg);
        @include inputShadow;
        transition: border 100ms cubic-bezier(0, 0.2, 0.2, 1);

        &:hover {
          border: 1px solid var(--theme-elevation-400);
        }
      }
    }

    &__main-detail {
      padding: var(--base) calc(var(--base) * 1.2);
      width: auto;
      flex-grow: 1;
      min-width: 280px;
      max-width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-self: stretch;
      gap: calc(var(--base) * 0.2);
    }

    &__toggle-more-info {
      font-weight: 600;
      text-decoration: none;

      &:hover,
      &:focus-visible {
        text-decoration: underline;
      }
    }

    &__toggle-icon {
      padding: calc(var(--base) / 4);
    }

    &__sizes {
      margin: 0;
      padding: calc(var(--base) * 1.5) $baseline 0;
      list-style: none;
      display: flex;
      flex-wrap: wrap;

      li {
        width: 50%;
        padding: 0 calc(var(--base) * 0.5);
        margin-bottom: $baseline;
      }
    }

    &__size-label {
      color: var(--theme-elevation-400);
    }

    &__file-mutation {
      display: flex;
      margin-top: calc(var(--base) * 0.25);
      gap: calc(var(--base) / 2);
    }

    &__edit {
      cursor: pointer;
      background-color: var(--theme-elevation-150);
      border: none;
      border-radius: $style-radius-m;
      padding: calc(var(--base) * 0.25) calc(var(--base) * 0.5);

      &:hover {
        background-color: var(--theme-elevation-100);
      }
    }

    @include large-break {
      &__main-detail {
        padding: $baseline;
      }

      &__sizes {
        display: block;
        padding: $baseline $baseline calc(var(--base) * 0.5);

        li {
          padding: 0;
          width: 100%;
        }
      }
    }

    @include mid-break {
      header {
        flex-wrap: wrap;
      }

      .thumbnail {
        width: 50%;
        order: 1;
      }

      &__remove {
        order: 2;
      }

      &__main-detail {
        order: 3;
        width: 100%;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/FileDetails/StaticFileDetails/index.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import { Button } from '../../Button/index.js'
import { Thumbnail } from '../../Thumbnail/index.js'
import { UploadActions } from '../../Upload/index.js'
import { FileMeta } from '../FileMeta/index.js'
import './index.scss'

const baseClass = 'file-details'

import type { Data, FileSizes, SanitizedCollectionConfig } from 'payload'

export type StaticFileDetailsProps = {
  customUploadActions?: React.ReactNode[]
  doc: {
    sizes?: FileSizes
  } & Data
  enableAdjustments?: boolean
  handleRemove?: () => void
  hasImageSizes?: boolean
  hideRemoveFile?: boolean
  imageCacheTag?: string
  uploadConfig: SanitizedCollectionConfig['upload']
}

export const StaticFileDetails: React.FC<StaticFileDetailsProps> = (props) => {
  const {
    customUploadActions,
    doc,
    enableAdjustments,
    handleRemove,
    hasImageSizes,
    hideRemoveFile,
    imageCacheTag,
    uploadConfig,
  } = props

  const { filename, filesize, height, mimeType, thumbnailURL, url, width } = doc

  const previewAllowed = uploadConfig.displayPreview ?? true

  return (
    <div className={baseClass}>
      <header>
        {previewAllowed && (
          <Thumbnail
            // size="small"
            className={`${baseClass}__thumbnail`}
            doc={doc}
            fileSrc={thumbnailURL || url}
            imageCacheTag={imageCacheTag}
            uploadConfig={uploadConfig}
          />
        )}
        <div className={`${baseClass}__main-detail`}>
          <FileMeta
            filename={filename as string}
            filesize={filesize as number}
            height={height as number}
            mimeType={mimeType as string}
            url={url as string}
            width={width as number}
          />

          {(enableAdjustments || (hasImageSizes && doc.filename) || customUploadActions) && (
            <UploadActions
              customActions={customUploadActions}
              enableAdjustments={Boolean(enableAdjustments)}
              enablePreviewSizes={hasImageSizes && doc.filename}
              mimeType={mimeType}
            />
          )}
        </div>
        {!hideRemoveFile && handleRemove && (
          <Button
            buttonStyle="icon-label"
            className={`${baseClass}__remove`}
            icon="x"
            iconStyle="with-border"
            onClick={handleRemove}
            round
          />
        )}
      </header>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/FolderView/Breadcrumbs/index.scss

```text
@import '../../../scss/styles.scss';

@layer payload-default {
  .droppable-button {
    @include btn-reset;
    font-weight: 600;
    font-family: inherit;
    &:hover {
      cursor: pointer;
    }
  }
  .folderBreadcrumbs {
    display: flex;

    &__crumb,
    &__crumb-item.droppable-button {
      @extend %h4;
      font-weight: 600;
      letter-spacing: unset;
      display: flex;
      align-items: center;
      margin: 0;

      &:has(.icon--folder) {
        height: calc(var(--base) * 1.6);
        .btn__label {
          display: flex;
          align-items: center;
          height: 100%;
        }
      }
    }

    &__crumb-item.droppable-button--hover {
      opacity: 0.5;
    }

    &__crumb-chevron {
      position: relative;
      top: 1px;

      .stroke {
        stroke: var(--theme-elevation-250);
      }
    }
  }

  @include mid-break {
    .folderBreadcrumbs {
      &__crumb,
      &__crumb-item {
        font-size: var(--base);
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/FolderView/Breadcrumbs/index.tsx
Signals: React

```typescript
'use client'

import type { FolderBreadcrumb } from 'payload/shared'

import { useDroppable } from '@dnd-kit/core'
import React from 'react'

import { ChevronIcon } from '../../../icons/Chevron/index.js'
import './index.scss'

const baseClass = 'folderBreadcrumbs'

type Props = {
  readonly breadcrumbs: {
    id: null | number | string
    name: React.ReactNode | string
    onClick: () => void
  }[]
  className?: string
}
export function FolderBreadcrumbs({ breadcrumbs, className }: Props) {
  return (
    <div className={`${baseClass} ${className || ''}`.trim()}>
      {breadcrumbs?.map((crumb, index) => (
        <div className={`${baseClass}__crumb`} key={index}>
          {crumb.onClick ? (
            <DroppableBreadcrumb
              className={`${baseClass}__crumb-item`}
              id={crumb.id}
              onClick={crumb.onClick}
            >
              {crumb.name}
            </DroppableBreadcrumb>
          ) : (
            crumb.name
          )}
          {breadcrumbs.length > 0 && index !== breadcrumbs.length - 1 && (
            <ChevronIcon className={`${baseClass}__crumb-chevron`} direction="right" />
          )}
        </div>
      ))}
    </div>
  )
}

export function DroppableBreadcrumb({
  id,
  children,
  className,
  onClick,
}: {
  children: React.ReactNode
  className?: string
  onClick: () => void
} & Pick<FolderBreadcrumb, 'id'>) {
  const { isOver, setNodeRef } = useDroppable({
    id: `folder-${id}`,
    data: {
      id,
      type: 'folder',
    },
  })

  return (
    <button
      className={['droppable-button', className, isOver && 'droppable-button--hover']
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
      ref={setNodeRef}
      type="button"
    >
      {children}
    </button>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/FolderView/BrowseByFolderButton/index.scss

```text
@import '../../../scss/styles.scss';

@layer payload-default {
  .browse-by-folder-button {
    border: 1px solid var(--theme-elevation-100);
    text-decoration: none;
    padding: calc(var(--base) / 2);
    display: flex;
    align-items: center;
    width: 100%;
    gap: calc(var(--base) * 0.33);
    margin-top: calc(var(--base) * 0.25);
    margin-bottom: var(--base);
    border-radius: var(--style-radius-m);
    color: var(--theme-text);

    &.active {
      background-color: var(--theme-elevation-50);
      font-weight: 600;

      .icon {
        color: var(--theme-elevation-400);
      }
    }

    .icon {
      color: var(--theme-elevation-300);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/FolderView/BrowseByFolderButton/index.tsx
Signals: React

```typescript
import { formatAdminURL } from 'payload/shared'
import React from 'react'

import { useConfig } from '../../../providers/Config/index.js'
import { useTranslation } from '../../../providers/Translation/index.js'
import { Link } from '../../Link/index.js'
import { ColoredFolderIcon } from '../ColoredFolderIcon/index.js'
import './index.scss'

const baseClass = 'browse-by-folder-button'

export function BrowseByFolderButton({ active }) {
  const { t } = useTranslation()
  const { config } = useConfig()
  const {
    admin: {
      routes: { browseByFolder: foldersRoute },
    },
    routes: { admin: adminRoute },
    serverURL,
  } = config

  return (
    <Link
      className={[baseClass, active && 'active'].filter(Boolean).join(' ')}
      href={formatAdminURL({
        adminRoute,
        path: foldersRoute,
        serverURL,
      })}
      id="browse-by-folder"
      prefetch={false}
    >
      <ColoredFolderIcon />
      {t('folder:browseByFolder')}
    </Link>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.client.tsx]---
Location: payload-main/packages/ui/src/elements/FolderView/Cell/index.client.tsx
Signals: React

```typescript
'use client'

import type { Data, ViewTypes } from 'payload'
import type { FolderOrDocument } from 'payload/shared'

import React, { useEffect } from 'react'

// eslint-disable-next-line payload/no-imports-from-exports-dir
import { MoveDocToFolderButton, useConfig, useTranslation } from '../../../exports/client/index.js'

type Props = {
  readonly collectionSlug: string
  readonly data: Data
  readonly docTitle: string
  readonly folderCollectionSlug: string
  readonly folderFieldName: string
  readonly viewType?: ViewTypes
}

export const FolderTableCellClient = ({
  collectionSlug,
  data,
  docTitle,
  folderCollectionSlug,
  folderFieldName,
  viewType,
}: Props) => {
  const docID = data.id
  const intialFolderID = data?.[folderFieldName]

  const { config } = useConfig()
  const { t } = useTranslation()
  const [fromFolderName, setFromFolderName] = React.useState(() =>
    intialFolderID ? `${t('general:loading')}...` : t('folder:noFolder'),
  )
  const [fromFolderID, setFromFolderID] = React.useState(intialFolderID)

  const hasLoadedFolderName = React.useRef(false)

  const onConfirm = React.useCallback(
    async ({ id, name }) => {
      try {
        await fetch(`${config.routes.api}/${collectionSlug}/${docID}`, {
          body: JSON.stringify({
            [folderFieldName]: id,
          }),
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
        })

        setFromFolderID(id)
        setFromFolderName(name || t('folder:noFolder'))
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error moving document to folder', error)
      }
    },
    [config.routes.api, collectionSlug, docID, folderFieldName, t],
  )

  useEffect(() => {
    const loadFolderName = async () => {
      try {
        const req = await fetch(
          `${config.routes.api}/${folderCollectionSlug}${intialFolderID ? `/${intialFolderID}` : ''}`,
          {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'GET',
          },
        )

        const res = await req.json()
        setFromFolderName(res?.name || t('folder:noFolder'))
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error moving document to folder', error)
      }
    }

    if (!hasLoadedFolderName.current) {
      void loadFolderName()
      hasLoadedFolderName.current = true
    }
  }, [config.routes.api, folderCollectionSlug, intialFolderID, t])

  return (
    <MoveDocToFolderButton
      buttonProps={{
        disabled: viewType === 'trash',
        size: 'small',
      }}
      collectionSlug={collectionSlug}
      docData={data as FolderOrDocument['value']}
      docID={docID}
      docTitle={docTitle}
      folderCollectionSlug={folderCollectionSlug}
      folderFieldName={folderFieldName}
      fromFolderID={fromFolderID}
      fromFolderName={fromFolderName}
      modalSlug={`move-doc-to-folder-cell--${docID}`}
      onConfirm={onConfirm}
      skipConfirmModal={false}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.server.tsx]---
Location: payload-main/packages/ui/src/elements/FolderView/Cell/index.server.tsx
Signals: React

```typescript
import type { DefaultServerCellComponentProps } from 'payload'

import React from 'react'

import { FolderTableCellClient } from './index.client.js'

export const FolderTableCell = (props: DefaultServerCellComponentProps) => {
  const titleToRender =
    (props.collectionConfig.upload ? props.rowData?.filename : props.rowData?.title) ||
    props.rowData.id

  if (!props.payload.config.folders) {
    return null
  }

  return (
    <FolderTableCellClient
      collectionSlug={props.collectionSlug}
      data={props.rowData}
      docTitle={titleToRender}
      folderCollectionSlug={props.payload.config.folders.slug}
      folderFieldName={props.payload.config.folders.fieldName}
      viewType={props.viewType}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/FolderView/ColoredFolderIcon/index.scss

```text
@layer payload-default {
  .colored-folder-icon {
    color: var(--theme-elevation-300);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/FolderView/ColoredFolderIcon/index.tsx

```typescript
import { FolderIcon } from '../../../icons/Folder/index.js'
import './index.scss'
export function ColoredFolderIcon() {
  return <FolderIcon className="colored-folder-icon" />
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/FolderView/CurrentFolderActions/index.tsx
Signals: React, Next.js

```typescript
import { useModal } from '@faceless-ui/modal'
import { getTranslation } from '@payloadcms/translations'
import { useRouter } from 'next/navigation.js'
import React from 'react'
import { toast } from 'sonner'

import { Dots } from '../../../icons/Dots/index.js'
import { useConfig } from '../../../providers/Config/index.js'
import { useFolder } from '../../../providers/Folders/index.js'
import { useRouteCache } from '../../../providers/RouteCache/index.js'
import { useRouteTransition } from '../../../providers/RouteTransition/index.js'
import { useTranslation } from '../../../providers/Translation/index.js'
import { ConfirmationModal } from '../../ConfirmationModal/index.js'
import { useDocumentDrawer } from '../../DocumentDrawer/index.js'
import { Popup, PopupList } from '../../Popup/index.js'
import { Translation } from '../../Translation/index.js'
import { MoveItemsToFolderDrawer } from '../Drawers/MoveToFolder/index.js'

const moveToFolderDrawerSlug = 'move-to-folder--current-folder'
const confirmDeleteDrawerSlug = 'confirm-many-delete'

const baseClass = 'current-folder-actions'

type Props = {
  className?: string
}
export function CurrentFolderActions({ className }: Props) {
  const router = useRouter()
  const { startRouteTransition } = useRouteTransition()
  const {
    breadcrumbs,
    currentFolder,
    folderCollectionConfig,
    folderCollectionSlug,
    folderFieldName,
    folderID,
    getFolderRoute,
    moveToFolder,
  } = useFolder()
  const [FolderDocumentDrawer, , { closeDrawer: closeFolderDrawer, openDrawer: openFolderDrawer }] =
    useDocumentDrawer({
      id: folderID,
      collectionSlug: folderCollectionSlug,
    })
  const { clearRouteCache } = useRouteCache()
  const { config } = useConfig()
  const { routes, serverURL } = config
  const { closeModal, openModal } = useModal()
  const { i18n, t } = useTranslation()

  const deleteCurrentFolder = React.useCallback(async () => {
    await fetch(`${serverURL}${routes.api}/${folderCollectionSlug}/${folderID}?depth=0`, {
      credentials: 'include',
      method: 'DELETE',
    })
    startRouteTransition(() => {
      router.push(getFolderRoute(breadcrumbs[breadcrumbs.length - 2]?.id || null))
    })
  }, [
    breadcrumbs,
    folderCollectionSlug,
    folderID,
    getFolderRoute,
    router,
    serverURL,
    routes.api,
    startRouteTransition,
  ])

  if (!folderID) {
    return null
  }

  return (
    <>
      <Popup
        button={<Dots />}
        className={[baseClass, className].filter(Boolean).join(' ')}
        render={() => (
          <PopupList.ButtonGroup>
            <PopupList.Button
              onClick={() => {
                openFolderDrawer()
              }}
            >
              {t('general:editLabel', {
                label: getTranslation(folderCollectionConfig.labels.singular, i18n),
              })}
            </PopupList.Button>
            <PopupList.Button
              onClick={() => {
                openModal(moveToFolderDrawerSlug)
              }}
            >
              {t('folder:moveFolder')}
            </PopupList.Button>
            <PopupList.Button
              onClick={() => {
                openModal(confirmDeleteDrawerSlug)
              }}
            >
              {t('folder:deleteFolder')}
            </PopupList.Button>
          </PopupList.ButtonGroup>
        )}
      />
      <MoveItemsToFolderDrawer
        action="moveItemToFolder"
        drawerSlug={moveToFolderDrawerSlug}
        folderAssignedCollections={currentFolder?.value.folderType}
        folderCollectionSlug={folderCollectionSlug}
        folderFieldName={folderFieldName}
        fromFolderID={currentFolder?.value.id}
        fromFolderName={currentFolder?.value._folderOrDocumentTitle}
        itemsToMove={[currentFolder]}
        onConfirm={async ({ id, name }) => {
          await moveToFolder({
            itemsToMove: [currentFolder],
            toFolderID: id,
          })
          if (id) {
            // moved to folder
            toast.success(
              t('folder:itemHasBeenMoved', {
                folderName: `"${name}"`,
                title: currentFolder.value._folderOrDocumentTitle,
              }),
            )
          } else {
            // moved to root
            toast.success(
              t('folder:itemHasBeenMovedToRoot', {
                title: currentFolder.value._folderOrDocumentTitle,
              }),
            )
          }
          closeModal(moveToFolderDrawerSlug)
        }}
        title={currentFolder.value._folderOrDocumentTitle}
      />

      <ConfirmationModal
        body={
          <Translation
            elements={{
              '1': ({ children }) => <strong>{children}</strong>,
            }}
            i18nKey="general:aboutToDelete"
            t={t}
            variables={{
              label: getTranslation(folderCollectionConfig.labels.singular, i18n),
              title: currentFolder.value._folderOrDocumentTitle,
            }}
          />
        }
        confirmingLabel={t('general:deleting')}
        heading={t('general:confirmDeletion')}
        modalSlug={confirmDeleteDrawerSlug}
        onConfirm={deleteCurrentFolder}
      />

      <FolderDocumentDrawer
        onSave={() => {
          closeFolderDrawer()
          clearRouteCache()
        }}
      />
    </>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/FolderView/DraggableTableRow/index.scss

```text
@layer payload-default {
  .draggable-table-row {
    // vars
    --border-top-left-radius: var(--style-radius-m);
    --border-top-right-radius: var(--style-radius-m);
    --border-bottom-right-radius: var(--style-radius-m);
    --border-bottom-left-radius: var(--style-radius-m);
    --row-text-color: var(--theme-text);
    --row-icon-opacity: 1;
    --row-icon-color: var(--theme-elevation-400);
    --row-bg-color: transparent;
    --row-opacity: 1;
    --foreground-opacity: 0;
    --row-cursor: pointer;

    isolation: isolate;
    opacity: var(--row-opacity);
    cursor: var(--row-cursor);

    &__first-td {
      border-top-left-radius: var(--border-top-left-radius);
      border-bottom-left-radius: var(--border-bottom-left-radius);
    }

    td.draggable-table-row__last-td {
      border-top-right-radius: var(--border-top-right-radius);
      border-bottom-right-radius: var(--border-bottom-right-radius);
      padding-inline-end: calc(var(--base) * (0.8));
    }

    &:not(.draggable-table-row--selected):nth-child(odd) {
      --row-bg-color: var(--theme-elevation-50);
    }

    &:nth-child(odd) {
      &:after {
        display: none;
      }
    }

    &--focused {
      &.draggable-table-row:nth-child(odd),
      &.draggable-table-row:nth-child(even) {
        --row-bg-color: var(--theme-elevation-100);
      }
    }

    &--disabled {
      --row-cursor: no-drop;
      --row-opacity: 0.6;
    }

    &--selected {
      --row-icon-color: var(--theme-success-800);
      --row-icon-opacity: 0.6;
      &.draggable-table-row:nth-child(odd),
      &.draggable-table-row:nth-child(even) {
        --row-bg-color: var(--theme-success-150);
      }
    }

    &--selected + .draggable-table-row--selected {
      --border-top-left-radius: 0;
      --border-top-right-radius: 0;
    }

    &--selected:not(:last-child):has(+ .draggable-table-row--selected) {
      --border-bottom-left-radius: 0;
      --border-bottom-right-radius: 0;
    }

    &--over {
      &.draggable-table-row:nth-child(odd),
      &.draggable-table-row:nth-child(even) {
        --row-bg-color: var(--theme-elevation-150);
      }
    }

    &__cell-content {
      position: relative;
      z-index: 1;
      color: var(--row-text-color);
      background-color: var(--row-bg-color);
    }

    &__drag-handle {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      left: 0;
      right: 0;
      cursor: var(--row-cursor);
      background: none;
      border: none;
      padding: 0;
      outline-offset: 0;
      z-index: 2;

      &:focus-visible {
        box-shadow: inset 0px 0px 0px 2px var(--theme-text);
        outline: none;
      }
    }

    &__drop-area {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      left: 0;
      right: 0;
    }

    .simple-table {
      &__hidden-cell {
        position: absolute;
        padding: 0;
        width: 100%;
        height: 100%;
        left: 0;
        right: 0;
      }
    }

    &.draggable-table-row {
      position: relative;
    }

    .icon {
      color: var(--row-icon-color);
      opacity: var(--row-icon-opacity);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/FolderView/DraggableTableRow/index.tsx
Signals: React

```typescript
'use client'
import { useDroppable } from '@dnd-kit/core'
import React from 'react'

import { DraggableWithClick } from '../DraggableWithClick/index.js'
import { HiddenCell, TableCell } from '../SimpleTable/index.js'
import './index.scss'

const baseClass = 'draggable-table-row'
type Props = {
  readonly columns: React.ReactNode[]
  readonly disabled?: boolean
  readonly dragData?: Record<string, unknown>
  readonly id: number | string
  readonly isDroppable?: boolean
  readonly isFocused?: boolean
  readonly isSelected?: boolean
  readonly isSelecting?: boolean
  readonly itemKey: string
  readonly onClick?: (e: React.MouseEvent) => void
  readonly onKeyDown?: (e: React.KeyboardEvent) => void
}
export function DraggableTableRow({
  id,
  columns,
  disabled = false,
  dragData,
  isDroppable: _isDroppable,
  isFocused,
  isSelected,
  isSelecting,
  itemKey,
  onClick,
  onKeyDown,
}: Props) {
  const isDroppable = !disabled && _isDroppable && !isSelected
  const { isOver, setNodeRef } = useDroppable({
    id,
    data: dragData,
    disabled: !isDroppable,
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
      as="tr"
      className={[
        baseClass,
        isSelected && `${baseClass}--selected`,
        isSelecting && `${baseClass}--selecting`,
        disabled && `${baseClass}--disabled`,
        isFocused && `${baseClass}--focused`,
        isOver && `${baseClass}--over`,
      ]
        .filter(Boolean)
        .join(' ')}
      key={itemKey}
      onClick={onClick}
      onKeyDown={onKeyDown}
      ref={ref}
    >
      {columns.map((col, i) => (
        <TableCell
          className={[
            `${baseClass}__cell-content`,
            i === 0 && `${baseClass}__first-td`,
            i === columns.length - 1 && `${baseClass}__last-td`,
          ]
            .filter(Boolean)
            .join(' ')}
          key={`${itemKey}-${i}`}
        >
          {col}
        </TableCell>
      ))}

      {isDroppable ? (
        <HiddenCell>
          <div className={`${baseClass}__drop-area`} ref={setNodeRef} />
        </HiddenCell>
      ) : null}
    </DraggableWithClick>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/FolderView/DraggableWithClick/index.scss

```text
@layer payload-default {
  .draggable-with-click:not(.draggable-with-click--disabled) {
    user-select: none;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/FolderView/DraggableWithClick/index.tsx
Signals: React

```typescript
import { useDraggable } from '@dnd-kit/core'
import React, { useId, useRef } from 'react'

import './index.scss'

const baseClass = 'draggable-with-click'

type Props = {
  readonly as?: React.ElementType
  readonly children?: React.ReactNode
  readonly className?: string
  readonly disabled?: boolean
  readonly onClick: (e: React.MouseEvent) => void
  readonly onKeyDown?: (e: React.KeyboardEvent) => void
  readonly ref?: React.RefObject<HTMLDivElement>
  readonly thresholdPixels?: number
}

export const DraggableWithClick = ({
  as = 'div',
  children,
  className,
  disabled = false,
  onClick,
  onKeyDown,
  ref,
  thresholdPixels = 3,
}: Props) => {
  const id = useId()
  const { attributes, listeners, setNodeRef } = useDraggable({ id, disabled })
  const initialPos = useRef({ x: 0, y: 0 })
  const isDragging = useRef(false)

  const handlePointerDown = (e) => {
    initialPos.current = { x: e.clientX, y: e.clientY }
    isDragging.current = false

    const handlePointerMove = (moveEvent) => {
      const deltaX = Math.abs(moveEvent.clientX - initialPos.current.x)
      const deltaY = Math.abs(moveEvent.clientY - initialPos.current.y)
      if (deltaX > thresholdPixels || deltaY > thresholdPixels) {
        isDragging.current = true
        if (listeners?.onPointerDown) {
          listeners.onPointerDown(e)
          // when the user starts dragging
          // - call the click handler
          // - remove the pointermove listener
          onClick(moveEvent)
        }
        window.removeEventListener('pointermove', handlePointerMove)
      }
    }

    const cleanup = () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }

    const handlePointerUp = (upEvent) => {
      cleanup()
      if (!isDragging.current) {
        // if the user did not drag the element
        // - call the click handler
        onClick(upEvent)
      }
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
  }

  const Component = as || 'div'

  return (
    <Component
      role="button"
      tabIndex={0}
      {...attributes}
      className={[baseClass, className, disabled ? `${baseClass}--disabled` : '']
        .filter(Boolean)
        .join(' ')}
      onKeyDown={disabled ? undefined : onKeyDown}
      onPointerDown={disabled ? undefined : onClick ? handlePointerDown : undefined}
      ref={(node) => {
        if (disabled) {
          return
        }
        setNodeRef(node)
        if (ref) {
          ref.current = node
        }
      }}
    >
      {children}
    </Component>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/FolderView/DragOverlaySelection/index.scss

```text
@layer payload-default {
  .drag-overlay-selection {
    &__cards {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 1fr;
    }

    &__card {
      position: absolute;
      width: 100%;
      height: 100%;
      grid-column: 1/2;
      grid-row: 1/2;
    }

    &__card-count {
      position: absolute;
      transform: translate(calc(50% - 3px), calc(-50% - 3px));
      right: 0;
      top: 0;
      border-radius: 50%;
      line-height: 1;
      width: 26px;
      height: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--theme-success-50);
      background: var(--theme-success-600);
      font-weight: bold;
      font-variant-numeric: tabular-nums;
    }
  }
}
```

--------------------------------------------------------------------------------

````
