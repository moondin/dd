---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 374
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 374 of 695)

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

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/ListHeader/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .list-header {
    display: flex;
    align-items: flex-end;
    flex-wrap: wrap;

    &__content {
      display: grid;
      grid-template-columns: 1fr auto;
      width: 100%;
    }

    &__title-and-actions {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      gap: calc(var(--base) * 0.5);
    }

    &__title {
      margin: 0;
    }

    &__title-actions {
      margin-bottom: 4px;
      display: flex;
      gap: calc(var(--base) * 0.5);
    }

    &__actions {
      margin-bottom: 4px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: calc(var(--base) * 0.5);
    }

    &__after-header-content {
      width: 100%;
    }

    .btn {
      margin: 0;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/ListHeader/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

export const listHeaderClass = 'list-header'

type ListHeaderProps = {
  readonly Actions?: React.ReactNode[]
  readonly AfterListHeaderContent?: React.ReactNode
  readonly className?: string
  readonly title: string
  readonly TitleActions?: React.ReactNode[]
}
export const ListHeader: React.FC<ListHeaderProps> = (props) => {
  return (
    <header className={[listHeaderClass, props.className].filter(Boolean).join(' ')}>
      <div className={`${listHeaderClass}__content`}>
        <div className={`${listHeaderClass}__title-and-actions`}>
          <h1 className={`${listHeaderClass}__title`}>{props.title}</h1>
          {props.TitleActions.length ? (
            <div className={`${listHeaderClass}__title-actions`}>{props.TitleActions}</div>
          ) : null}
        </div>
        {props.Actions.length ? (
          <div className={`${listHeaderClass}__actions`}>{props.Actions}</div>
        ) : null}
      </div>
      {props.AfterListHeaderContent ? (
        <div className={`${listHeaderClass}__after-header-content`}>
          {props.AfterListHeaderContent}
        </div>
      ) : null}
    </header>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/ListHeader/DrawerRelationshipSelect/index.tsx

```typescript
'use client'

import { getTranslation } from '@payloadcms/translations'

import { FieldLabel } from '../../../fields/FieldLabel/index.js'
import { useConfig } from '../../../providers/Config/index.js'
import { useTranslation } from '../../../providers/Translation/index.js'
import { useListDrawerContext } from '../../ListDrawer/Provider.js'
import { ReactSelect } from '../../ReactSelect/index.js'
import { listHeaderClass } from '../index.js'

const drawerBaseClass = 'list-drawer'

export const DrawerRelationshipSelect = () => {
  const { i18n, t } = useTranslation()
  const {
    config: { collections },
    getEntityConfig,
  } = useConfig()
  const { enabledCollections, selectedOption, setSelectedOption } = useListDrawerContext()
  const enabledCollectionConfigs = collections.filter(({ slug }) =>
    enabledCollections.includes(slug),
  )
  if (enabledCollectionConfigs.length > 1) {
    const activeCollectionConfig = getEntityConfig({ collectionSlug: selectedOption.value })

    return (
      <div className={`${drawerBaseClass}__select-collection-wrap`}>
        <FieldLabel label={t('upload:selectCollectionToBrowse')} />
        <ReactSelect
          className={`${listHeaderClass}__select-collection`}
          isClearable={false}
          onChange={setSelectedOption}
          options={enabledCollectionConfigs.map((coll) => ({
            label: getTranslation(coll.labels.singular, i18n),
            value: coll.slug,
          }))}
          value={{
            label: getTranslation(activeCollectionConfig?.labels.singular, i18n),
            value: activeCollectionConfig?.slug,
          }}
        />
      </div>
    )
  }
  return null
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/ListHeader/DrawerTitleActions/index.tsx

```typescript
export { ListDrawerCreateNewDocButton } from './ListDrawerCreateNewDocButton.js'
```

--------------------------------------------------------------------------------

---[FILE: ListDrawerCreateNewDocButton.tsx]---
Location: payload-main/packages/ui/src/elements/ListHeader/DrawerTitleActions/ListDrawerCreateNewDocButton.tsx

```typescript
'use client'

import { useTranslation } from '../../../providers/Translation/index.js'
import { useListDrawerContext } from '../../ListDrawer/Provider.js'
import { Pill } from '../../Pill/index.js'

const baseClass = 'list-header'

type DefaultDrawerTitleActionsProps = {
  hasCreatePermission: boolean
}

export function ListDrawerCreateNewDocButton({
  hasCreatePermission,
}: DefaultDrawerTitleActionsProps) {
  const { DocumentDrawerToggler } = useListDrawerContext()
  const { t } = useTranslation()

  if (!hasCreatePermission) {
    return null
  }

  return (
    <DocumentDrawerToggler
      className={`${baseClass}__create-new-button`}
      key="create-new-button-toggler"
    >
      <Pill size="small">{t('general:createNew')}</Pill>
    </DocumentDrawerToggler>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/ListHeader/TitleActions/index.tsx

```typescript
export { ListBulkUploadButton } from './ListBulkUploadButton.js'
export { ListCreateNewButton } from './ListCreateNewDocButton.js'
export { ListCreateNewDocInFolderButton } from './ListCreateNewDocInFolderButton.js'
export { ListEmptyTrashButton } from './ListEmptyTrashButton.js'
```

--------------------------------------------------------------------------------

---[FILE: ListBulkUploadButton.tsx]---
Location: payload-main/packages/ui/src/elements/ListHeader/TitleActions/ListBulkUploadButton.tsx
Signals: React, Next.js

```typescript
'use client'
import type { CollectionSlug } from 'payload'

import { useModal } from '@faceless-ui/modal'
import { useRouter } from 'next/navigation.js'
import React from 'react'

import { useBulkUpload } from '../../../elements/BulkUpload/index.js'
import { useTranslation } from '../../../providers/Translation/index.js'
import { Button } from '../../Button/index.js'

export function ListBulkUploadButton({
  collectionSlug,
  hasCreatePermission,
  isBulkUploadEnabled,
  onBulkUploadSuccess,
  openBulkUpload: openBulkUploadFromProps,
}: {
  collectionSlug: CollectionSlug
  hasCreatePermission: boolean
  isBulkUploadEnabled: boolean
  onBulkUploadSuccess?: () => void
  /**
   * @deprecated This prop will be removed in the next major version.
   *
   * Prefer using `onBulkUploadSuccess`
   */
  openBulkUpload?: () => void
}) {
  const { drawerSlug: bulkUploadDrawerSlug, setCollectionSlug, setOnSuccess } = useBulkUpload()
  const { t } = useTranslation()
  const { openModal } = useModal()
  const router = useRouter()

  const openBulkUpload = React.useCallback(() => {
    if (typeof openBulkUploadFromProps === 'function') {
      openBulkUploadFromProps()
    } else {
      setCollectionSlug(collectionSlug)
      openModal(bulkUploadDrawerSlug)
      setOnSuccess(() => {
        if (typeof onBulkUploadSuccess === 'function') {
          onBulkUploadSuccess()
        } else {
          router.refresh()
        }
      })
    }
  }, [
    router,
    collectionSlug,
    bulkUploadDrawerSlug,
    openModal,
    setCollectionSlug,
    setOnSuccess,
    onBulkUploadSuccess,
    openBulkUploadFromProps,
  ])

  if (!hasCreatePermission || !isBulkUploadEnabled) {
    return null
  }

  return (
    <Button
      aria-label={t('upload:bulkUpload')}
      buttonStyle="pill"
      key="bulk-upload-button"
      onClick={openBulkUpload}
      size="small"
    >
      {t('upload:bulkUpload')}
    </Button>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: ListCreateNewDocButton.tsx]---
Location: payload-main/packages/ui/src/elements/ListHeader/TitleActions/ListCreateNewDocButton.tsx
Signals: React

```typescript
'use client'
import type { ClientCollectionConfig } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import React from 'react'

import { useTranslation } from '../../../providers/Translation/index.js'
import { Button } from '../../Button/index.js'

const baseClass = 'list-create-new-doc'

export function ListCreateNewButton({
  collectionConfig,
  hasCreatePermission,
  newDocumentURL,
}: {
  collectionConfig: ClientCollectionConfig
  hasCreatePermission: boolean
  newDocumentURL: string
}) {
  const { i18n, t } = useTranslation()

  if (!hasCreatePermission) {
    return null
  }

  return (
    <Button
      aria-label={t('general:createNewLabel', {
        label: getTranslation(collectionConfig?.labels?.singular, i18n),
      })}
      buttonStyle="pill"
      className={`${baseClass}__create-new-button`}
      el={'link'}
      key="create-new-button"
      size="small"
      to={newDocumentURL}
    >
      {t('general:createNew')}
    </Button>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: ListCreateNewDocInFolderButton.tsx]---
Location: payload-main/packages/ui/src/elements/ListHeader/TitleActions/ListCreateNewDocInFolderButton.tsx
Signals: React

```typescript
'use client'

import type { ClientCollectionConfig, CollectionSlug } from 'payload'

import { useModal } from '@faceless-ui/modal'
import { getTranslation } from '@payloadcms/translations'
import React from 'react'

import { useConfig } from '../../../providers/Config/index.js'
import { useFolder } from '../../../providers/Folders/index.js'
import { useTranslation } from '../../../providers/Translation/index.js'
import { Button } from '../../Button/index.js'
import { DocumentDrawer, useDocumentDrawer } from '../../DocumentDrawer/index.js'
import { Popup, PopupList } from '../../Popup/index.js'

const baseClass = 'create-new-doc-in-folder'

export function ListCreateNewDocInFolderButton({
  buttonLabel,
  collectionSlugs,
  folderAssignedCollections,
  onCreateSuccess,
  slugPrefix,
}: {
  buttonLabel: string
  collectionSlugs: CollectionSlug[]
  folderAssignedCollections: CollectionSlug[]
  onCreateSuccess: (args: {
    collectionSlug: CollectionSlug
    doc: Record<string, unknown>
  }) => Promise<void> | void
  slugPrefix: string
}) {
  const newDocInFolderDrawerSlug = `${slugPrefix}-new-doc-in-folder-drawer`
  const { i18n } = useTranslation()
  const { closeModal, openModal } = useModal()
  const { config } = useConfig()
  const { folderCollectionConfig, folderCollectionSlug, folderFieldName, folderID } = useFolder()
  const [FolderDocumentDrawer, , { closeDrawer: closeFolderDrawer, openDrawer: openFolderDrawer }] =
    useDocumentDrawer({
      collectionSlug: folderCollectionSlug,
    })
  const [createCollectionSlug, setCreateCollectionSlug] = React.useState<string | undefined>()
  const [enabledCollections] = React.useState<ClientCollectionConfig[]>(() =>
    collectionSlugs.reduce((acc, collectionSlug) => {
      const collectionConfig = config.collections.find(({ slug }) => slug === collectionSlug)
      if (collectionConfig) {
        acc.push(collectionConfig)
      }
      return acc
    }, []),
  )

  if (enabledCollections.length === 0) {
    return null
  }

  return (
    <React.Fragment>
      {enabledCollections.length === 1 ? (
        // If there is only 1 option, do not render a popup
        <Button
          buttonStyle="pill"
          className={`${baseClass}__button`}
          el="div"
          onClick={() => {
            if (enabledCollections[0].slug === folderCollectionConfig.slug) {
              openFolderDrawer()
            } else {
              setCreateCollectionSlug(enabledCollections[0].slug)
              openModal(newDocInFolderDrawerSlug)
            }
          }}
          size="small"
        >
          {buttonLabel}
        </Button>
      ) : (
        <Popup
          button={
            <Button
              buttonStyle="pill"
              className={`${baseClass}__popup-button`}
              el="div"
              icon="chevron"
              size="small"
            >
              {buttonLabel}
            </Button>
          }
          buttonType="default"
          className={`${baseClass}__action-popup`}
        >
          <PopupList.ButtonGroup>
            {enabledCollections.map((collection, index) => {
              return (
                <PopupList.Button
                  key={index}
                  onClick={() => {
                    if (collection.slug === folderCollectionConfig.slug) {
                      openFolderDrawer()
                    } else {
                      setCreateCollectionSlug(collection.slug)
                      openModal(newDocInFolderDrawerSlug)
                    }
                  }}
                >
                  {getTranslation(collection.labels.singular, i18n)}
                </PopupList.Button>
              )
            })}
          </PopupList.ButtonGroup>
        </Popup>
      )}

      {createCollectionSlug && (
        <DocumentDrawer
          collectionSlug={createCollectionSlug}
          drawerSlug={newDocInFolderDrawerSlug}
          initialData={{
            [folderFieldName]: folderID,
          }}
          onSave={async ({ doc }) => {
            await onCreateSuccess({
              collectionSlug: createCollectionSlug,
              doc,
            })
            closeModal(newDocInFolderDrawerSlug)
          }}
          redirectAfterCreate={false}
        />
      )}

      {collectionSlugs.includes(folderCollectionConfig.slug) && (
        <FolderDocumentDrawer
          initialData={{
            [folderFieldName]: folderID,
            folderType: createCollectionSlug
              ? folderAssignedCollections || [createCollectionSlug]
              : folderAssignedCollections,
          }}
          onSave={async (result) => {
            await onCreateSuccess({
              collectionSlug: folderCollectionConfig.slug,
              doc: result.doc,
            })
            closeFolderDrawer()
          }}
          redirectAfterCreate={false}
        />
      )}
    </React.Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: ListEmptyTrashButton.tsx]---
Location: payload-main/packages/ui/src/elements/ListHeader/TitleActions/ListEmptyTrashButton.tsx
Signals: React, Next.js

```typescript
'use client'
import type { ClientCollectionConfig } from 'payload'

import { useModal } from '@faceless-ui/modal'
import { getTranslation } from '@payloadcms/translations'
import { useRouter, useSearchParams } from 'next/navigation.js'
import * as qs from 'qs-esm'
import React from 'react'
import { toast } from 'sonner'

import { useConfig } from '../../../providers/Config/index.js'
import { useLocale } from '../../../providers/Locale/index.js'
import { useRouteCache } from '../../../providers/RouteCache/index.js'
import { useTranslation } from '../../../providers/Translation/index.js'
import { requests } from '../../../utilities/api.js'
import { Button } from '../../Button/index.js'
import { ConfirmationModal } from '../../ConfirmationModal/index.js'
import { Translation } from '../../Translation/index.js'

const confirmEmptyTrashSlug = 'confirm-empty-trash'

export function ListEmptyTrashButton({
  collectionConfig,
  hasDeletePermission,
}: {
  collectionConfig: ClientCollectionConfig
  hasDeletePermission: boolean
}) {
  const { i18n, t } = useTranslation()
  const { code: locale } = useLocale()
  const { config } = useConfig()
  const { openModal } = useModal()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { clearRouteCache } = useRouteCache()

  const [trashCount, setTrashCount] = React.useState<null | number>(null)

  React.useEffect(() => {
    const fetchTrashCount = async () => {
      const queryString = qs.stringify(
        {
          depth: 0,
          limit: 0,
          locale,
          trash: true,
          where: {
            deletedAt: {
              exists: true,
            },
          },
        },
        { addQueryPrefix: true },
      )

      try {
        const res = await requests.get(
          `${config.serverURL}${config.routes.api}/${collectionConfig.slug}${queryString}`,
          {
            headers: {
              'Accept-Language': i18n.language,
              'Content-Type': 'application/json',
            },
          },
        )

        const json = await res.json()
        setTrashCount(json?.totalDocs ?? 0)
      } catch {
        setTrashCount(0)
      }
    }

    void fetchTrashCount()
  }, [collectionConfig.slug, config, i18n.language, locale])

  const handleEmptyTrash = React.useCallback(async () => {
    if (!hasDeletePermission) {
      return
    }

    const { slug, labels } = collectionConfig

    const queryString = qs.stringify(
      {
        limit: 0,
        locale,
        trash: true,
        where: {
          deletedAt: {
            exists: true,
          },
        },
      },
      { addQueryPrefix: true },
    )

    const res = await requests.delete(
      `${config.serverURL}${config.routes.api}/${slug}${queryString}`,
      {
        headers: {
          'Accept-Language': i18n.language,
          'Content-Type': 'application/json',
        },
      },
    )

    try {
      const json = await res.json()
      const deletedCount = json?.docs?.length || 0

      if (res.status < 400) {
        toast.success(
          t('general:permanentlyDeletedCountSuccessfully', {
            count: deletedCount,
            label: getTranslation(labels?.plural, i18n),
          }),
        )
      }

      if (json?.errors?.length > 0) {
        toast.error(json.message, {
          description: json.errors.map((err) => err.message).join('\n'),
        })
      }

      router.replace(
        qs.stringify(
          {
            ...Object.fromEntries(searchParams.entries()),
            page: '1',
          },
          { addQueryPrefix: true },
        ),
      )

      clearRouteCache()
    } catch {
      toast.error(t('error:unknown'))
    }
  }, [
    collectionConfig,
    config,
    hasDeletePermission,
    i18n,
    t,
    locale,
    searchParams,
    router,
    clearRouteCache,
  ])

  return (
    <React.Fragment>
      <Button
        aria-label={t('general:emptyTrashLabel', {
          label: getTranslation(collectionConfig?.labels?.plural, i18n),
        })}
        buttonStyle="pill"
        disabled={trashCount === 0}
        id="empty-trash-button"
        key="empty-trash-button"
        onClick={() => {
          openModal(confirmEmptyTrashSlug)
        }}
        size="small"
      >
        {t('general:emptyTrash')}
      </Button>
      <ConfirmationModal
        body={
          <Translation
            elements={{
              '0': ({ children }) => <strong>{children}</strong>,
              '1': ({ children }) => <strong>{children}</strong>,
            }}
            i18nKey="general:aboutToPermanentlyDeleteTrash"
            t={t}
            variables={{
              count: trashCount ?? 0,
              label: getTranslation(
                trashCount === 1
                  ? collectionConfig.labels?.singular
                  : collectionConfig.labels?.plural,
                i18n,
              ),
            }}
          />
        }
        confirmingLabel={t('general:deleting')}
        heading={t('general:confirmDeletion')}
        modalSlug={confirmEmptyTrashSlug}
        onConfirm={handleEmptyTrash}
      />
    </React.Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/ListSelection/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .list-selection {
    display: flex;
    margin-left: auto;
    color: var(--theme-elevation-500);
    gap: 0.5em;
    align-items: center;

    &__actions {
      display: flex;
      gap: calc(var(--base) * 0.5);
    }

    &__button {
      color: var(--theme-elevation-800);
      background: unset;
      border: none;
      text-decoration: underline;
      cursor: pointer;
      padding: 0;
      font-size: inherit;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    @include small-break {
      margin-bottom: base(0.5);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/ListSelection/index.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import type { Props as ButtonProps } from '../Button/types.js'

import { useTranslation } from '../../providers/Translation/index.js'
import { Button } from '../Button/index.js'
import './index.scss'

const baseClass = 'list-selection'

type ListSelection_v4Props = {
  /**
   * The count of selected items
   */
  readonly count: number
  /**
   * Actions that apply to the list as a whole
   *
   * @example select all, clear selection
   */
  readonly ListActions?: React.ReactNode[]
  /**
   * Actions that apply to the selected items
   *
   * @example edit, delete, publish, unpublish
   */
  readonly SelectionActions?: React.ReactNode[]
}
export function ListSelection_v4({ count, ListActions, SelectionActions }: ListSelection_v4Props) {
  const { t } = useTranslation()

  return (
    <div className={baseClass}>
      <span>{t('general:selectedCount', { count, label: '' })}</span>
      {ListActions && ListActions.length > 0 && (
        <React.Fragment>
          <span>&mdash;</span>
          <div className={`${baseClass}__actions`}>{ListActions}</div>
        </React.Fragment>
      )}
      {SelectionActions && SelectionActions.length > 0 && (
        <React.Fragment>
          <span>&mdash;</span>
          <div className={`${baseClass}__actions`}>{SelectionActions}</div>
        </React.Fragment>
      )}
    </div>
  )
}

type ListSelectionButtonProps = {} & ButtonProps
export function ListSelectionButton({ children, className, ...props }: ListSelectionButtonProps) {
  return (
    <Button
      {...props}
      buttonStyle="none"
      className={[`${baseClass}__button`, className].filter(Boolean).join(' ')}
    >
      {children}
    </Button>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/LivePreview/Device/index.tsx
Signals: React

```typescript
'use client'
import React, { useEffect } from 'react'

import { useResize } from '../../../hooks/useResize.js'
import { useLivePreviewContext } from '../../../providers/LivePreview/context.js'

export const DeviceContainer: React.FC<{
  children: React.ReactNode
}> = (props) => {
  const { children } = props

  const deviceFrameRef = React.useRef<HTMLDivElement>(null)
  const outerFrameRef = React.useRef<HTMLDivElement>(null)

  const { breakpoint, setMeasuredDeviceSize, size: desiredSize, zoom } = useLivePreviewContext()

  // Keep an accurate measurement of the actual device size as it is truly rendered
  // This is helpful when `sizes` are non-number units like percentages, etc.

  const { size: measuredDeviceSize } = useResize(deviceFrameRef.current)

  const { size: outerFrameSize } = useResize(outerFrameRef.current)

  let deviceIsLargerThanFrame: boolean = false

  // Sync the measured device size with the context so that other components can use it
  // This happens from the bottom up so that as this component mounts and unmounts,
  // its size is freshly populated again upon re-mounting, i.e. going from iframe->popup->iframe
  useEffect(() => {
    if (measuredDeviceSize) {
      setMeasuredDeviceSize(measuredDeviceSize)
    }
  }, [measuredDeviceSize, setMeasuredDeviceSize])

  let x = '0'
  let margin = '0'

  if (breakpoint && breakpoint !== 'responsive') {
    x = '-50%'

    if (
      desiredSize &&
      measuredDeviceSize &&
      typeof zoom === 'number' &&
      typeof desiredSize.width === 'number' &&
      typeof desiredSize.height === 'number' &&
      typeof measuredDeviceSize.width === 'number' &&
      typeof measuredDeviceSize.height === 'number'
    ) {
      margin = '0 auto'
      const scaledDesiredWidth = desiredSize.width / zoom
      const scaledDeviceWidth = measuredDeviceSize.width * zoom
      const scaledDeviceDifferencePixels = scaledDesiredWidth - desiredSize.width
      deviceIsLargerThanFrame = scaledDeviceWidth > outerFrameSize.width

      if (deviceIsLargerThanFrame) {
        if (zoom > 1) {
          const differenceFromDeviceToFrame = measuredDeviceSize.width - outerFrameSize.width
          if (differenceFromDeviceToFrame < 0) {
            x = `${differenceFromDeviceToFrame / 2}px`
          } else {
            x = '0'
          }
        } else {
          x = '0'
        }
      } else {
        if (zoom >= 1) {
          x = `${scaledDeviceDifferencePixels / 2}px`
        } else {
          const differenceFromDeviceToFrame = outerFrameSize.width - scaledDeviceWidth
          x = `${differenceFromDeviceToFrame / 2}px`
          margin = '0'
        }
      }
    }
  }

  let width = zoom ? `${100 / zoom}%` : '100%'
  let height = zoom ? `${100 / zoom}%` : '100%'

  if (breakpoint !== 'responsive') {
    width = `${desiredSize?.width / (typeof zoom === 'number' ? zoom : 1)}px`
    height = `${desiredSize?.height / (typeof zoom === 'number' ? zoom : 1)}px`
  }

  return (
    <div
      ref={outerFrameRef}
      style={{
        height: '100%',
        width: '100%',
      }}
    >
      <div
        ref={deviceFrameRef}
        style={{
          height,
          margin,
          transform: `translate3d(${x}, 0, 0)`,
          width,
        }}
      >
        {children}
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/LivePreview/DeviceContainer/index.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import { useLivePreviewContext } from '../../../providers/LivePreview/context.js'

export const DeviceContainer: React.FC<{
  children: React.ReactNode
}> = (props) => {
  const { children } = props

  const { breakpoint, breakpoints, size, zoom } = useLivePreviewContext()

  const foundBreakpoint = breakpoint && breakpoints?.find((bp) => bp.name === breakpoint)

  let x = '0'
  let margin = '0'

  if (foundBreakpoint && breakpoint !== 'responsive') {
    x = '-50%'

    if (
      typeof zoom === 'number' &&
      typeof size.width === 'number' &&
      typeof size.height === 'number'
    ) {
      const scaledWidth = size.width / zoom
      const difference = scaledWidth - size.width
      x = `${difference / 2}px`
      margin = '0 auto'
    }
  }

  return (
    <div
      style={{
        height:
          foundBreakpoint && foundBreakpoint?.name !== 'responsive'
            ? `${size?.height / (typeof zoom === 'number' ? zoom : 1)}px`
            : typeof zoom === 'number'
              ? `${100 / zoom}%`
              : '100%',
        margin,
        transform: `translate3d(${x}, 0, 0)`,
        width:
          foundBreakpoint && foundBreakpoint?.name !== 'responsive'
            ? `${size?.width / (typeof zoom === 'number' ? zoom : 1)}px`
            : typeof zoom === 'number'
              ? `${100 / zoom}%`
              : '100%',
      }}
    >
      {children}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/LivePreview/IFrame/index.scss

```text
@layer payload-default {
  .live-preview-iframe {
    background-color: white;
    border: 0;
    width: 100%;
    height: 100%;
    transform-origin: top left;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/LivePreview/IFrame/index.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import { useLivePreviewContext } from '../../../providers/LivePreview/context.js'
import './index.scss'

const baseClass = 'live-preview-iframe'

export const IFrame: React.FC = () => {
  const { iframeRef, setLoadedURL, url, zoom } = useLivePreviewContext()

  return (
    <iframe
      className={baseClass}
      key={url}
      onLoad={() => {
        setLoadedURL(url)
      }}
      ref={iframeRef}
      src={url}
      style={{
        transform: typeof zoom === 'number' ? `scale(${zoom}) ` : undefined,
      }}
      title={url}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/LivePreview/Toggler/index.scss

```text
@import '../../../scss/styles.scss';

@layer payload-default {
  .live-preview-toggler {
    background: none;
    border: none;
    border: 1px solid;
    border-color: var(--theme-elevation-100);
    border-radius: var(--style-radius-s);
    line-height: var(--btn-line-height);
    font-size: var(--base-body-size);
    padding: calc(var(--base) * 0.2) calc(var(--base) * 0.4);
    cursor: pointer;
    transition-property: border, color, background;
    transition-duration: 100ms;
    transition-timing-function: cubic-bezier(0, 0.2, 0.2, 1);
    height: calc(var(--base) * 1.6);
    width: calc(var(--base) * 1.6);
    position: relative;

    .icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      .stroke {
        transition-property: stroke;
        transition-duration: 100ms;
        transition-timing-function: cubic-bezier(0, 0.2, 0.2, 1);
      }
    }

    &:hover {
      border-color: var(--theme-elevation-300);
      background-color: var(--theme-elevation-100);
    }

    &--active {
      background-color: var(--theme-elevation-100);
      border-color: var(--theme-elevation-200);

      &:hover {
        background-color: var(--theme-elevation-200);
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/LivePreview/Toggler/index.tsx
Signals: React

```typescript
import React from 'react'

import { EyeIcon } from '../../../icons/Eye/index.js'
import { useLivePreviewContext } from '../../../providers/LivePreview/context.js'
import { useTranslation } from '../../../providers/Translation/index.js'
import './index.scss'

const baseClass = 'live-preview-toggler'

export const LivePreviewToggler: React.FC = () => {
  const { isLivePreviewing, setIsLivePreviewing, url: livePreviewURL } = useLivePreviewContext()
  const { t } = useTranslation()

  if (!livePreviewURL) {
    return null
  }

  return (
    <button
      aria-label={isLivePreviewing ? t('general:exitLivePreview') : t('general:livePreview')}
      className={[baseClass, isLivePreviewing && `${baseClass}--active`].filter(Boolean).join(' ')}
      id="live-preview-toggler"
      onClick={() => {
        setIsLivePreviewing(!isLivePreviewing)
      }}
      title={isLivePreviewing ? t('general:exitLivePreview') : t('general:livePreview')}
      type="button"
    >
      <EyeIcon active={isLivePreviewing} />
    </button>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/LivePreview/Toolbar/index.scss

```text
@import '../../../scss/styles.scss';

@layer payload-default {
  .live-preview-toolbar {
    display: flex;
    background-color: var(--theme-bg);
    color: var(--theme-text);
    height: calc(var(--base) * 1.75);
    align-items: center;
    flex-shrink: 0;

    &--static {
      position: relative;
      width: 100%;
      justify-content: center;
      border-bottom: 1px solid var(--theme-elevation-100);
    }

    &--draggable {
      @include shadow-lg;
      position: absolute;
      top: 0;
      left: 0;
      margin: 0;
      border-radius: 4px;
    }

    &__drag-handle {
      background: transparent;
      border: 0;
      padding: 0;
      cursor: grab;

      .icon--drag-handle .fill {
        fill: var(--theme-elevation-300);
      }

      &:active {
        cursor: grabbing;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/LivePreview/Toolbar/index.tsx
Signals: React

```typescript
'use client'
import type { EditViewProps } from 'payload'

import { useDraggable } from '@dnd-kit/core'
import React from 'react'

import { DragHandleIcon } from '../../../icons/DragHandle/index.js'
import { useLivePreviewContext } from '../../../providers/LivePreview/context.js'
import { ToolbarControls } from './Controls/index.js'
import './index.scss'

const baseClass = 'live-preview-toolbar'

const DraggableToolbar: React.FC<EditViewProps> = (props) => {
  const { toolbarPosition } = useLivePreviewContext()

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'live-preview-toolbar',
  })

  return (
    <div
      className={[baseClass, `${baseClass}--draggable`].join(' ')}
      style={{
        left: `${toolbarPosition.x}px`,
        top: `${toolbarPosition.y}px`,
        ...(transform
          ? {
              transform: transform
                ? `translate3d(${transform?.x || 0}px, ${transform?.y || 0}px, 0)`
                : undefined,
            }
          : {}),
      }}
    >
      <button
        {...listeners}
        {...attributes}
        className={`${baseClass}__drag-handle`}
        ref={setNodeRef}
        type="button"
      >
        <DragHandleIcon />
      </button>
      <ToolbarControls {...props} />
    </div>
  )
}

const StaticToolbar: React.FC<EditViewProps> = (props) => {
  return (
    <div className={[baseClass, `${baseClass}--static`].join(' ')}>
      <ToolbarControls {...props} />
    </div>
  )
}

export const LivePreviewToolbar: React.FC<
  {
    draggable?: boolean
  } & EditViewProps
> = (props) => {
  const { draggable } = props

  if (draggable) {
    return <DraggableToolbar {...props} />
  }

  return <StaticToolbar {...props} />
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/LivePreview/Toolbar/Controls/index.scss

```text
@import '../../../../scss/styles.scss';

@layer payload-default {
  .live-preview-toolbar-controls {
    display: flex;
    align-items: center;
    gap: calc(var(--base) / 3);

    &__breakpoint {
      border: none;
      background: transparent;
      height: var(--base);

      &:focus {
        outline: none;
      }
    }

    &__device-size {
      display: flex;
      align-items: center;
    }

    &__size {
      width: 50px;
      height: var(--base);
      display: flex;
      align-items: center;
      border: 1px solid var(--theme-elevation-200);
      background: var(--theme-elevation-100);
      border-radius: 2px;
      font-size: small;
    }

    &__zoom {
      width: 55px;
      border: none;
      background: transparent;
      height: var(--base);

      &:focus {
        outline: none;
      }
    }

    &__external {
      flex-shrink: 0;
      display: flex;
      width: var(--base);
      height: var(--base);
      align-items: center;
      justify-content: center;
      padding: 6px 0;
    }

    .popup-button {
      display: flex;
      align-items: center;
    }
  }
}
```

--------------------------------------------------------------------------------

````
